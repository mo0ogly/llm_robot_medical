"""Watch research_archive/_staging/signals/ and notify on new signals.

Decoupled wiring (P1.4): instead of editing every signal emitter, this scans
the signals directory, maps each file to an Event, and notifies the operator of
files not seen before. State is kept in a local `.notified.json` so re-runs
never double-notify.

Usage:
    python -m backend.notifications.signal_watcher [--root <path>]

This is a CLI entry point, so it logs a human-readable summary to the console.
"""
from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path

from . import notify
from .events import event_for_signal

logger = logging.getLogger("aegis.notifications.watcher")

_DEFAULT_SIGNALS = Path("research_archive/_staging/signals")
_STATE_FILE = ".notified.json"
_IGNORE = {"_archive", _STATE_FILE}


def _load_state(state_path: Path) -> set:
    if state_path.exists():
        try:
            return set(json.loads(state_path.read_text(encoding="utf-8")))
        except (ValueError, OSError):
            logger.warning("notified state unreadable, starting fresh: %s", state_path)
    return set()


def _save_state(state_path: Path, seen: set) -> None:
    state_path.write_text(json.dumps(sorted(seen), indent=2), encoding="utf-8")


def scan_once(signals_root: Path) -> list:
    """Notify for each new signal file; return list of (filename, event_value)."""
    if not signals_root.is_dir():
        logger.info("signals dir absent: %s", signals_root)
        return []
    state_path = signals_root / _STATE_FILE
    seen = _load_state(state_path)
    fired: list = []
    for entry in sorted(signals_root.iterdir()):
        if entry.name in _IGNORE or entry.name.startswith("."):
            continue
        if entry.name in seen:
            continue
        event = event_for_signal(entry.name)
        title = entry.stem.replace("_", " ")
        notify(event, title, "Signal file: " + entry.name)
        fired.append((entry.name, event.value))
        seen.add(entry.name)
    _save_state(state_path, seen)
    return fired


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    parser = argparse.ArgumentParser(description="Notify on new AEGIS research signals.")
    parser.add_argument("--root", default=str(_DEFAULT_SIGNALS), help="signals directory to scan")
    args = parser.parse_args()
    fired = scan_once(Path(args.root))
    if fired:
        logger.info("notified %d new signal(s): %s", len(fired), ", ".join(f[0] for f in fired))
    else:
        logger.info("no new signals")


if __name__ == "__main__":
    main()
