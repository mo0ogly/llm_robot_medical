"""AEGIS Red Team — unified event feed for the frontend timeline.

This module bridges the gap between backend campaign artefacts (JSON files
written by scripts such as run_thesis_campaign.py, run_mass_campaign_n100.py,
run_adaptive_experiment.py, run_gap4_v2_recette.py) and the frontend
GlobalTimeline component.

Responsibilities:
    1. Parse an individual artefact file and produce a normalized event dict
       compatible with the robotEventBus contract used by the frontend.
    2. Enumerate all historical events from `research_archive/data/raw/`.
    3. Watch the raw directory for newly-written artefacts and publish them
       on the shared `telemetry_bus` so that any connected SSE client gets a
       live push.

Design notes:
    - Zero new dependencies. The watcher is a lightweight asyncio poll loop
      (every REDTEAM_POLL_SECONDS). Campaign artefacts are typically written
      once at the end of a batch, so 3 s granularity is plenty.
    - The event schema is deliberately close to what GlobalTimeline.jsx
      already understands (channel + title + message + ts), but we also
      include the raw aggregate stats so richer clients can render more.
    - Channel prefix is `redteam.` so a downstream SSE consumer can filter
      telemetry_bus events by prefix.
"""

from __future__ import annotations

import asyncio
import json
import os
import time
from datetime import datetime
from typing import Any, Iterable

from telemetry_bus import telemetry_bus

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# research_archive/data/raw is two levels above backend/
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.normpath(os.path.join(_BACKEND_DIR, ".."))
RAW_DIR = os.path.normpath(
    os.path.join(_REPO_ROOT, "research_archive", "data", "raw")
)

# File prefixes we know how to parse. Anything else is ignored.
KNOWN_PREFIXES = (
    "campaign_",
    "exp1_",
    "exp2_",
    "exp3_",
    "exp4_",
    "recette_",
)

REDTEAM_POLL_SECONDS = float(os.environ.get("REDTEAM_POLL_SECONDS", "3.0"))

# Event channels (kept in sync with frontend GlobalTimeline.jsx mapping)
CHANNEL_CAMPAIGN = "redteam.campaign_complete"
CHANNEL_EXPERIMENT = "redteam.experiment_complete"
CHANNEL_RECETTE = "redteam.recette_complete"

EVENT_KIND_REDTEAM = "cyber"  # maps to GlobalTimeline "cyber" visual type
EVENT_KIND_CRITICAL = "critical"


# ---------------------------------------------------------------------------
# File parsers
# ---------------------------------------------------------------------------


def _timestamp_to_epoch(value: Any) -> float:
    """Convert an ISO 8601 string or epoch seconds to epoch seconds float."""
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()
        except ValueError:
            pass
    return time.time()


def _violation_verdict(rate: float) -> tuple[str, str]:
    """Return (status, severity) from an aggregate violation rate."""
    if rate >= 0.5:
        return ("passed", EVENT_KIND_CRITICAL)  # attack succeeded broadly
    if rate >= 0.1:
        return ("passed", EVENT_KIND_REDTEAM)
    return ("blocked", EVENT_KIND_REDTEAM)


def parse_campaign_file(path: str) -> dict[str, Any] | None:
    """Parse a campaign_YYYYMMDD_*.json artefact.

    Returns a single summary event for the whole campaign. Per-chain detail
    stays available through /api/redteam/results (ResultsExplorer).
    """
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        return {
            "channel": CHANNEL_CAMPAIGN,
            "kind": "error",
            "ts": os.path.getmtime(path) if os.path.exists(path) else time.time(),
            "source_file": os.path.basename(path),
            "title": "Campaign parse error",
            "message": f"Could not read {os.path.basename(path)}: {exc}",
        }

    if not isinstance(data, dict):
        return None

    ts = _timestamp_to_epoch(data.get("timestamp") or os.path.getmtime(path))

    agg = data.get("aggregate") or {}
    violation_rate = float(agg.get("violation_rate", 0.0) or 0.0)
    total_trials = int(agg.get("total_trials", 0) or 0)
    total_violations = int(agg.get("total_violations", 0) or 0)
    wilson = agg.get("wilson_ci_95") or {}
    lo = wilson.get("lower")
    hi = wilson.get("upper")

    n_chains = int(data.get("n_chains_tested", 0) or 0)
    n_per = int(data.get("n_trials_per_chain", 0) or 0)
    shield = bool(data.get("aegis_shield_active", False))

    sep = data.get("separation_score") or {}
    sep_score = sep.get("sep_score")
    sep_interp = sep.get("interpretation", "")

    status, kind = _violation_verdict(violation_rate)

    ci_str = ""
    if lo is not None and hi is not None:
        ci_str = f" CI95=[{float(lo):.3f}, {float(hi):.3f}]"

    title = (
        "Breach batch: "
        + f"{total_violations}/{total_trials} violations"
        if status == "passed"
        else f"Aegis held: {total_violations}/{total_trials} violations blocked"
    )

    message = (
        f"{n_chains} chains × N={n_per} · "
        f"ASR={violation_rate * 100:.2f}%{ci_str} · "
        f"shield={'ON' if shield else 'OFF'}"
    )
    if sep_score is not None:
        message += f" · Sep={float(sep_score):.3f} ({sep_interp})"

    return {
        "channel": CHANNEL_CAMPAIGN,
        "kind": kind,
        "status": status,
        "ts": ts,
        "source_file": os.path.basename(path),
        "title": title,
        "message": message,
        "campaign_summary": {
            "n_chains": n_chains,
            "n_trials_per_chain": n_per,
            "shield": shield,
            "violation_rate": violation_rate,
            "total_trials": total_trials,
            "total_violations": total_violations,
            "wilson_ci_95": wilson,
            "sep_score": sep_score,
        },
    }


def parse_experiment_file(path: str) -> dict[str, Any] | None:
    """Parse exp{1..4}_*.json files (adaptive_ooda, sep_score, delta2_bypass)."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError):
        return None

    if not isinstance(data, dict):
        return None

    ts = _timestamp_to_epoch(data.get("timestamp") or os.path.getmtime(path))
    label = data.get("experiment") or data.get("name") or os.path.basename(path)
    verdict = data.get("verdict") or data.get("interpretation") or ""
    asr = data.get("asr") or data.get("violation_rate")
    n = data.get("n") or data.get("n_trials")

    pieces: list[str] = []
    if asr is not None:
        try:
            pieces.append(f"ASR={float(asr) * 100:.1f}%")
        except (TypeError, ValueError):
            pass
    if n is not None:
        pieces.append(f"N={n}")
    if verdict:
        pieces.append(str(verdict))

    # Best-effort status heuristic
    if isinstance(asr, (int, float)):
        status, kind = _violation_verdict(float(asr))
    else:
        status, kind = ("blocked", EVENT_KIND_REDTEAM)

    return {
        "channel": CHANNEL_EXPERIMENT,
        "kind": kind,
        "status": status,
        "ts": ts,
        "source_file": os.path.basename(path),
        "title": f"Experiment · {label}",
        "message": " · ".join(pieces) if pieces else "Experiment result recorded",
    }


def parse_recette_file(path: str) -> dict[str, Any] | None:
    """Parse recette_*.json (regression tests / gap recipes)."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError):
        return None

    if not isinstance(data, dict):
        return None

    ts = _timestamp_to_epoch(data.get("timestamp") or os.path.getmtime(path))
    name = data.get("name") or os.path.basename(path).replace(".json", "")
    verdict = data.get("verdict") or data.get("status") or "RUN"
    passed = data.get("passed")
    failed = data.get("failed")

    pieces: list[str] = []
    if passed is not None:
        pieces.append(f"passed={passed}")
    if failed is not None:
        pieces.append(f"failed={failed}")
    pieces.append(str(verdict))

    status = "blocked" if str(verdict).upper() in ("PASS", "OK", "VALIDATED") else "passed"

    return {
        "channel": CHANNEL_RECETTE,
        "kind": EVENT_KIND_REDTEAM,
        "status": status,
        "ts": ts,
        "source_file": os.path.basename(path),
        "title": f"Recette · {name}",
        "message": " · ".join(pieces),
    }


def parse_artefact(path: str) -> dict[str, Any] | None:
    """Dispatch to the right parser based on filename prefix."""
    name = os.path.basename(path)
    if name.startswith("campaign_"):
        return parse_campaign_file(path)
    if name.startswith(("exp1_", "exp2_", "exp3_", "exp4_")):
        return parse_experiment_file(path)
    if name.startswith("recette_"):
        return parse_recette_file(path)
    return None


# ---------------------------------------------------------------------------
# Historical enumeration
# ---------------------------------------------------------------------------


def _iter_raw_files() -> Iterable[str]:
    if not os.path.isdir(RAW_DIR):
        return []
    out = []
    for name in os.listdir(RAW_DIR):
        if not name.endswith(".json"):
            continue
        if not name.startswith(KNOWN_PREFIXES):
            continue
        out.append(os.path.join(RAW_DIR, name))
    return out


def list_historical_events() -> list[dict[str, Any]]:
    """Scan research_archive/data/raw/ and return normalized events sorted
    by ts ascending (oldest first — matches the timeline append order)."""
    events: list[dict[str, Any]] = []
    for path in _iter_raw_files():
        ev = parse_artefact(path)
        if ev is not None:
            events.append(ev)
    events.sort(key=lambda e: e.get("ts", 0.0))
    return events


# ---------------------------------------------------------------------------
# Live watcher — asyncio poll loop
# ---------------------------------------------------------------------------

# State for the running watcher (process-local; one loop per uvicorn worker).
_known_files: set[str] = set()
_watcher_task: asyncio.Task | None = None


async def _watcher_loop() -> None:
    """Poll RAW_DIR every REDTEAM_POLL_SECONDS and publish new artefacts."""
    global _known_files
    # Seed with existing files — historical ones are available via /history.
    if os.path.isdir(RAW_DIR):
        _known_files = {
            name for name in os.listdir(RAW_DIR)
            if name.endswith(".json") and name.startswith(KNOWN_PREFIXES)
        }
    else:
        _known_files = set()

    while True:
        try:
            await asyncio.sleep(REDTEAM_POLL_SECONDS)
            if not os.path.isdir(RAW_DIR):
                continue
            current = {
                name for name in os.listdir(RAW_DIR)
                if name.endswith(".json") and name.startswith(KNOWN_PREFIXES)
            }
            new_names = current - _known_files
            if new_names:
                for name in sorted(new_names):
                    path = os.path.join(RAW_DIR, name)
                    ev = parse_artefact(path)
                    if ev is not None:
                        await telemetry_bus.emit(ev)
                _known_files = current
        except asyncio.CancelledError:
            raise
        except Exception as exc:  # noqa: BLE001 — watcher must never die
            print(f"[redteam_events] watcher iteration failed: {exc}")


def start_watcher(loop: asyncio.AbstractEventLoop | None = None) -> None:
    """Spawn the watcher task on the given loop (or the running one)."""
    global _watcher_task
    if _watcher_task is not None and not _watcher_task.done():
        return  # already running
    if loop is None:
        loop = asyncio.get_event_loop()
    _watcher_task = loop.create_task(_watcher_loop())


def stop_watcher() -> None:
    global _watcher_task
    if _watcher_task is not None:
        _watcher_task.cancel()
        _watcher_task = None
