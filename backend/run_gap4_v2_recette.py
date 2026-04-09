#!/usr/bin/env python3
"""Gap4-v2 carrier recette runner (bypass SCENARIO_CATALOG registration).

Context: the gap4_ablation_generator's patch of scenarios.py places the
autogen SCENARIO_CATALOG entries BEFORE the _load_template_from_json helper
function is defined, causing NameError at import time. Rather than re-ordering
the scenarios.py file structurally (risky, content-filter-forbidden to read),
this runner bypasses SCENARIO_CATALOG entirely: it loads the prompt JSON files
directly via json.load() and runs each template through the orchestrator's
run_single_attack() primitive.

Content filter compliance:
  - Templates are loaded into THIS Python process memory via json.load()
  - Templates are passed to orchestrator.run_single_attack() as attack_message
  - Templates are NEVER printed to stdout, NEVER echoed in logs
  - Only metadata (id, delta, conjectures) and ASR numbers appear in output
  - Follows the context-isolated workflow pattern documented in
    Note_Academique_Context_Isolated_Adversarial_Workflow.md (2026-04-09)

Usage:
    GROQ_API_KEY is auto-loaded from backend/.env if not in env
    MEDICAL_MODEL defaults to llama-3.3-70b-versatile (TC-002 confirmed 70B)
    LLM_PROVIDER forced to groq

    python backend/run_gap4_v2_recette.py                      # N=5, shield ON
    python backend/run_gap4_v2_recette.py --n-trials 30        # full thesis N
    python backend/run_gap4_v2_recette.py --no-shield          # no AEGIS shield
    python backend/run_gap4_v2_recette.py --include-baseline   # add slot 107

Output:
    research_archive/data/raw/recette_gap4_v2_<timestamp>.json
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from datetime import datetime
from pathlib import Path


SCRIPT_DIR = Path(__file__).parent.resolve()
ENV_FILE = SCRIPT_DIR / ".env"


def _load_env_file() -> None:
    """Populate os.environ from backend/.env if variables are not already set."""
    if not ENV_FILE.exists():
        return
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


_load_env_file()
os.environ.setdefault("MEDICAL_MODEL", "llama-3.3-70b-versatile")
os.environ.setdefault("LLM_PROVIDER", "groq")

# Backend imports require sys.path adjustment because this script lives at backend/
sys.path.insert(0, str(SCRIPT_DIR))

from orchestrator import RedTeamOrchestrator  # noqa: E402


# Slot 107 = clean baseline (control, no adversarial payload in the sense of the ablation).
# Slots 108-113 = v2 carrier ablation variants (the recette target as per user 2026-04-09).
BASELINE_SLOT = (107, "107-gap4-v2-baseline-control.json", "baseline_control")

ABLATION_SLOTS = [
    (108, "108-gap4-v2-carrier-full.json", "carrier_full"),
    (109, "109-gap4-v2-carrier-toolname.json", "carrier_toolname"),
    (110, "110-gap4-v2-carrier-verbs.json", "carrier_verbs"),
    (111, "111-gap4-v2-carrier-grammar.json", "carrier_grammar"),
    (112, "112-gap4-v2-carrier-hybrid.json", "carrier_hybrid"),
    (113, "113-gap4-v2-carrier-nfkc-defense.json", "carrier_nfkc_defense"),
]


def load_template(prompt_file: Path) -> tuple[str, dict]:
    """Load a prompt JSON, return (template, metadata_without_template).

    The template field stays in this Python process memory; the caller
    MUST NOT print it. metadata_without_template is safe to log.
    """
    with open(prompt_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    template = data.get("template", "")
    metadata = {k: v for k, v in data.items() if k != "template"}
    return template, metadata


async def run_slot(
    orch: RedTeamOrchestrator,
    slot: int,
    prompt_file: Path,
    role: str,
    n_trials: int,
) -> dict:
    """Run N trials of a single slot via run_scenario_stream (scenario-level execution).

    Migrated 2026-04-09 from run_single_attack bypass to run_scenario_stream now
    that scenarios.py is structurally fixed (_load_template_from_json helper added,
    generator kwargs corrected, SCENARIO_CATALOG has 62 entries including gap4_v2_*).

    Advantages over the previous bypass:
    - Scenario-level defense steps are applied (e.g. NFKC normalization for
      slot 113 gap4_v2_carrier_nfkc_defense) — the previous recette runs 1 and 2
      bypassed these defenses and thus measured only the raw attack.
    - Uses the orchestrator's own breach detection (breach_point, steps_passed)
      rather than manually interpreting scores.
    - The template is loaded by _load_template_from_json at scenario construction
      time (via SCENARIO_CATALOG import), not here — content filter preserved.

    Template metadata (length, hash) is still logged from the JSON file for
    provenance, but the template content is never returned to this caller.
    """
    # Metadata-only load for provenance (template content not used by this runner)
    template, meta = load_template(prompt_file)
    template_len = len(template)
    template_hash = hash(template) & 0xFFFFFFFF

    # Derive the scenario ID that was registered in SCENARIO_CATALOG by
    # gap4_ablation_generator.py (see backend/scenarios.py autogen block)
    scenario_id = "gap4_v2_" + role

    trials_list: list[dict] = []
    successes = 0

    for trial in range(1, n_trials + 1):
        try:
            breach_point = None
            steps_passed = 0
            step_scores: list[dict] = []
            step_statuses: list[str] = []
            response_preview = ""

            async for event in orch.run_scenario_stream(scenario_id):
                etype = event.get("type")
                if etype == "step_result":
                    step_scores.append(dict(event.get("scores", {}) or {}))
                    step_statuses.append(event.get("status", ""))
                    tr = event.get("target_response", "") or ""
                    if not response_preview:
                        response_preview = tr[:120] + ("..." if len(tr) > 120 else "")
                elif etype == "scenario_done":
                    breach_point = event.get("breach_point")
                    steps_passed = event.get("steps_passed", 0)

            injected = (breach_point is not None) or (steps_passed > 0)
            if injected:
                successes += 1

            trials_list.append(
                {
                    "trial": trial,
                    "breach_point": breach_point,
                    "steps_passed": steps_passed,
                    "statuses": step_statuses,
                    "scores": step_scores,
                    "injected": injected,
                    "response_preview": response_preview,
                }
            )
            print(
                "    trial " + str(trial) + "/" + str(n_trials)
                + ": injected=" + str(injected)
                + " breach=" + str(breach_point)
                + " passed=" + str(steps_passed) + "/1",
                flush=True,
            )
        except Exception as exc:
            trials_list.append({"trial": trial, "error": str(exc)})
            print(
                "    trial " + str(trial) + "/" + str(n_trials) + ": ERROR " + str(exc),
                flush=True,
            )

    asr = successes / n_trials if n_trials > 0 else 0.0

    return {
        "slot": slot,
        "role": role,
        "scenario_id": scenario_id,
        "prompt_file": prompt_file.name,
        "template_metadata": meta,
        "template_len_chars": template_len,
        "template_hash32": "{:08x}".format(template_hash),
        "n_trials": n_trials,
        "successes": successes,
        "asr": asr,
        "trials": trials_list,
    }


async def main(n_trials: int, shield_on: bool, include_baseline: bool) -> int:
    prompts_dir = SCRIPT_DIR / "prompts"
    if not prompts_dir.exists():
        print("ERROR: prompts dir missing: " + str(prompts_dir))
        return 1

    slots_to_run = list(ABLATION_SLOTS)
    if include_baseline:
        slots_to_run.insert(0, BASELINE_SLOT)

    # Preflight: verify all JSON files exist
    missing: list[str] = []
    for _slot, fname, _role in slots_to_run:
        if not (prompts_dir / fname).exists():
            missing.append(fname)
    if missing:
        print("ERROR: missing prompt files: " + json.dumps(missing))
        return 1

    if not os.environ.get("GROQ_API_KEY"):
        print("ERROR: GROQ_API_KEY not set (neither in env nor backend/.env)")
        return 1

    print("=" * 60)
    print("AEGIS gap4-v2 carrier recette")
    print("=" * 60)
    print("Provider: " + os.environ.get("LLM_PROVIDER", "auto"))
    print("Model: " + str(os.environ.get("MEDICAL_MODEL")))
    print("Shield: " + ("ON" if shield_on else "OFF"))
    print("Include baseline slot 107: " + str(include_baseline))
    print("Slots: " + str([s[0] for s in slots_to_run]))
    print("N per slot: " + str(n_trials))
    print("Total runs: " + str(len(slots_to_run) * n_trials))
    print("Estimated time: ~" + str(round(len(slots_to_run) * n_trials * 0.5, 1)) + " min (Groq 70B)")
    print("=" * 60)

    orch = RedTeamOrchestrator(aegis_shield=shield_on, provider="groq")

    results_runs: list[dict] = []
    start = datetime.now()

    for slot, fname, role in slots_to_run:
        print("\n[slot " + str(slot) + " / " + role + "]")
        slot_result = await run_slot(
            orch=orch,
            slot=slot,
            prompt_file=prompts_dir / fname,
            role=role,
            n_trials=n_trials,
        )
        results_runs.append(slot_result)
        print(
            "  ASR=" + "{:.1%}".format(slot_result["asr"])
            + " (" + str(slot_result["successes"]) + "/" + str(n_trials) + ")"
        )

    elapsed = (datetime.now() - start).total_seconds()

    results = {
        "metadata": {
            "run_id": "RECETTE-GAP4V2-" + datetime.now().strftime("%Y%m%d_%H%M%S"),
            "date": datetime.now().isoformat(),
            "provider": "groq",
            "model": os.environ.get("MEDICAL_MODEL"),
            "shield_active": shield_on,
            "include_baseline": include_baseline,
            "n_trials_per_slot": n_trials,
            "n_slots": len(slots_to_run),
            "total_runs": len(slots_to_run) * n_trials,
            "elapsed_seconds": elapsed,
        },
        "runs": results_runs,
    }

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = SCRIPT_DIR.parent / "research_archive" / "data" / "raw"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / ("recette_gap4_v2_" + ts + ".json")

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, default=str)

    print("\n" + "=" * 60)
    print("RECETTE COMPLETE")
    print("=" * 60)
    print("Elapsed: " + "{:.1f}".format(elapsed) + " s")
    print("Results: " + str(out_path))
    print("\nASR per slot:")
    for r in results["runs"]:
        marker = "+" if r["asr"] > 0 else " "
        print(
            "  " + marker + " slot " + str(r["slot"]) + " / "
            + r["role"].ljust(30) + ": " + "{:.1%}".format(r["asr"])
            + " (" + str(r["successes"]) + "/" + str(r["n_trials"]) + ")"
        )
    print()

    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gap4-v2 carrier recette runner")
    parser.add_argument("--n-trials", type=int, default=5)
    parser.add_argument("--no-shield", action="store_true")
    parser.add_argument("--include-baseline", action="store_true")
    args = parser.parse_args()
    sys.exit(
        asyncio.run(
            main(
                n_trials=args.n_trials,
                shield_on=not args.no_shield,
                include_baseline=args.include_baseline,
            )
        )
    )
