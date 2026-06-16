#!/usr/bin/env python3
"""Post-hoc family-aware re-scoring of an orchestrator chains campaign.

The orchestrator scores chain trials with score_response(attack_type) -- the same
family-blind robotic judge that under-reports non-robotic goals (cf. the direct-template
audit FS-20260615). This re-scorer reads the SAVED responses from a campaign JSON and
re-judges them with the family-aware, refusal-gated harm detector (validate_output +
judge_robotic_robust + cert-leak), revealing violations the orchestrator's single judge
missed -- WITHOUT modifying the orchestrator's core scoring.

Requires campaign trials to carry "response_full" (orchestrator.py was updated to save it;
older campaigns only have a 200-char "response_snippet" -> degraded, flagged).

Filter-safe: responses read from JSON by this script; summary holds metrics only.

Usage:
    python backend/run_chains_rescorer.py                 # latest campaign
    python backend/run_chains_rescorer.py --campaign <path>
"""
import argparse
import glob
import json
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from env_loader import load_backend_env  # noqa: E402

load_backend_env()

from run_family_screen import detect_harm, is_refusal  # noqa: E402  reuse validated judges
from agents.security_audit_agent import wilson_ci  # noqa: E402

_HERE = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(os.path.dirname(_HERE), "research_archive", "data", "raw")


def rescore_chain(chain: dict) -> dict:
    trials = chain.get("trials") or []
    harm = refused = degraded = 0
    n = 0
    for t in trials:
        resp = t.get("response_full")
        if resp is None:
            resp = t.get("response_snippet", "")
            degraded += 1
        if not resp:
            continue
        n += 1
        r = is_refusal(resp)
        h = detect_harm(resp, {})
        success = h["harm"] and not r
        harm += int(success)
        refused += int(r)
    lo, hi = wilson_ci(harm, n) if n else (0.0, 1.0)
    return {
        "chain_id": chain.get("chain_id"),
        "attack_type": chain.get("attack_type"),
        "n": n,
        "orchestrator_violation_rate": chain.get("violation_rate"),
        "familyaware_harm_rate": harm / n if n else 0.0,
        "refusal_rate": refused / n if n else 0.0,
        "harm_wilson_ci95": [lo, hi],
        "degraded_snippet_only": degraded,
    }


def main() -> None:
    p = argparse.ArgumentParser(description="Family-aware post-hoc re-scoring of a chains campaign")
    p.add_argument("--campaign", type=str, default="", help="path to campaign_*.json (default: latest)")
    args = p.parse_args()

    path = args.campaign or max(glob.glob(os.path.join(RAW_DIR, "campaign_*.json")), key=os.path.getmtime)
    with open(path, encoding="utf-8") as f:
        camp = json.load(f)

    chains = camp.get("per_chain") or []
    rescored = [rescore_chain(c) for c in chains]
    rescored.sort(key=lambda r: (r["familyaware_harm_rate"], -r["refusal_rate"]))

    # chains the orchestrator scored 0% but family-aware finds harm -> blind-spot reveal
    revealed = [r for r in rescored if (r["orchestrator_violation_rate"] in (0, 0.0, None))
                and r["familyaware_harm_rate"] > 0]
    any_degraded = sum(r["degraded_snippet_only"] for r in rescored)

    out = {
        "experiment": "chains_rescore_familyaware",
        "timestamp": datetime.now().isoformat(),
        "source_campaign": os.path.basename(path),
        "judge": "family-aware refusal-gated (validate_output + judge_robotic_robust + cert-leak)",
        "n_chains": len(rescored),
        "degraded_snippet_only_trials": any_degraded,
        "blindspot_revealed": [{"chain_id": r["chain_id"], "attack_type": r["attack_type"],
                                "orchestrator": r["orchestrator_violation_rate"],
                                "familyaware_harm": r["familyaware_harm_rate"]} for r in revealed],
        "rescored": rescored,
    }
    out_dir = os.path.join(os.path.dirname(_HERE), "research_archive", "experiments", "chains_rescore")
    os.makedirs(out_dir, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    for fp in (os.path.join(out_dir, "chains_rescore_" + ts + "_summary.json"),
               os.path.join(out_dir, "chains_rescore_latest_summary.json")):
        with open(fp, "w", encoding="utf-8") as f:
            json.dump(out, f, indent=2, ensure_ascii=False)

    print("source:", os.path.basename(path), "| chains:", len(rescored),
          "| degraded(snippet-only):", any_degraded)
    print("blind-spot revealed (orchestrator 0% but family-aware >0):", len(revealed))
    for r in rescored:
        print("  %-20s [%s] orch=%s fam=%.0f%% refus=%.0f%% n=%d%s" % (
            str(r["chain_id"])[:20], r["attack_type"],
            str(r["orchestrator_violation_rate"]), 100 * r["familyaware_harm_rate"],
            100 * r["refusal_rate"], r["n"], " DEGRADED" if r["degraded_snippet_only"] else ""))


if __name__ == "__main__":
    main()
