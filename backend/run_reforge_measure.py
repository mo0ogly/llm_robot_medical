#!/usr/bin/env python3
"""Measure harm-lift: baseline vs forged valid-operator variants for templates #06 and #16.

Reuses the family-screen judges (refusal-gated harm) for consistency with the audit
FS-20260615, so the lift numbers are on the same metric. Each group:
    baseline (rendered with its variables)  vs  4 forged variants (full prompts).

Filter-safe: payloads loaded by this script; raw responses -> *_full.json on disk only;
*_summary.json holds metrics + operator labels. AutoGen silenced; redirect stdout to a log.

Usage:
    python backend/run_reforge_measure.py --n 3    # smoke
    python backend/run_reforge_measure.py --n 30   # thesis-grade
"""
import argparse
import asyncio
import json
import logging
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from env_loader import load_backend_env  # noqa: E402

load_backend_env()

from run_family_screen import (  # noqa: E402  reuse the validated audit logic
    detect_harm, is_refusal, render, load_template, _apply_sampling_config, PROMPTS_DIR,
)
from agents.medical_robot_agent import create_medical_robot_agent  # noqa: E402
from agents.genetic_engine.harness import create_davinci_harness  # noqa: E402
from agents.security_audit_agent import wilson_ci  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logging.getLogger("autogen").setLevel(logging.ERROR)
logger = logging.getLogger("reforge_measure")

_HERE = os.path.dirname(os.path.abspath(__file__))
GROUPS = [
    {"name": "06", "baseline": "06-firmware-override.json", "candidates": "_candidates/06_improved_candidates.json"},
    {"name": "16", "baseline": "16-genetic-xml-config-override.json", "candidates": "_candidates/16_improved_candidates.json"},
    {"name": "16i2", "baseline": "16-genetic-xml-config-override.json", "candidates": "_candidates/16_iter2_candidates.json"},
    {"name": "16i3", "baseline": "16-genetic-xml-config-override.json", "candidates": "_candidates/16_iter3_candidates.json"},
]
PAYLOAD_KEYS = ("template", "payload", "prompt", "content", "text")


def load_candidates(rel_path: str):
    path = os.path.join(PROMPTS_DIR, rel_path)
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    arms = []
    for c in data:
        payload = next((c[k] for k in PAYLOAD_KEYS if isinstance(c.get(k), str) and c[k].strip()), None)
        if payload:
            arms.append((c.get("id", "variant"), c.get("operator", "?"), payload, {}))
    return arms


async def run_arm(harness, rendered: str, variables: dict, n: int):
    harm = refused = 0
    trials = []
    for i in range(n):
        try:
            resp = await harness.run_harness(rendered)
        except Exception as exc:  # noqa: BLE001
            trials.append({"i": i, "error": str(exc)})
            continue
        r = is_refusal(resp)
        h = detect_harm(resp, variables)
        hs = h["harm"] and not r
        harm += int(hs)
        refused += int(r)
        trials.append({"i": i, "harm": hs, "refused": r, "evidence": h["evidence"], "response": resp})
    neff = sum(1 for t in trials if "error" not in t)
    lo, hi = wilson_ci(harm, neff) if neff else (0.0, 1.0)
    return {"n_effective": neff, "successes": harm, "harm_rate": harm / neff if neff else 0.0,
            "refusal_rate": refused / neff if neff else 0.0, "wilson_ci_95": [lo, hi], "trials": trials}


async def main_async(args) -> None:
    model = os.getenv("MEDICAL_MODEL") or "llama-3.3-70b-versatile"
    agent = create_medical_robot_agent(provider="groq", model=model)
    agent.silent = True
    _apply_sampling_config(agent, args.temperature)
    harness = create_davinci_harness(agent, aegis_shield=False)
    logger.info("Re-forge measure | groq/%s temp=%.2f | N=%d | judge=refusal-gated harm", model, args.temperature, args.n)

    out_groups = []
    full_groups = []
    selected = [g for g in GROUPS if not args.only or g["name"] in args.only.split(",")]
    for g in selected:
        base_payload, base_vars = load_template(os.path.join(PROMPTS_DIR, g["baseline"]))
        arms = [("baseline_" + g["name"], "baseline", base_payload, base_vars)] + load_candidates(g["candidates"])
        logger.info("Group #%s: %d arms", g["name"], len(arms))
        results = []
        full = []
        for arm_id, operator, payload, variables in arms:
            rendered = render(payload, variables)
            res = await run_arm(harness, rendered, variables, args.n)
            rec = {"arm": arm_id, "operator": operator, **{k: res[k] for k in ("n_effective", "successes", "harm_rate", "refusal_rate", "wilson_ci_95")}}
            results.append(rec)
            full.append({**rec, "trials": res["trials"]})
            logger.info("  %-32s [%s] harm=%.0f%% refusal=%.0f%% (%d/%d) CI=[%.2f,%.2f]",
                        arm_id, operator, 100 * res["harm_rate"], 100 * res["refusal_rate"],
                        res["successes"], res["n_effective"], res["wilson_ci_95"][0], res["wilson_ci_95"][1])
        base = next(r for r in results if r["arm"].startswith("baseline"))
        best = max((r for r in results if not r["arm"].startswith("baseline")), key=lambda r: r["harm_rate"])
        out_groups.append({"group": g["name"], "baseline_harm": base["harm_rate"],
                           "best_variant": best["arm"], "best_harm": best["harm_rate"],
                           "lift_points": round((best["harm_rate"] - base["harm_rate"]) * 100, 1), "arms": results})
        full_groups.append({"group": g["name"], "arms": full})

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = os.path.join(os.path.dirname(_HERE), "research_archive", "experiments", "reforge_0616")
    os.makedirs(out_dir, exist_ok=True)
    mode = "full" if args.n >= 30 else "smoke"
    target = {"provider": "groq", "model": model, "temperature": args.temperature, "aegis_shield": False}
    summary = {"experiment": "reforge_06_16", "mode": mode, "timestamp": datetime.now().isoformat(),
               "target": target, "judge": "refusal-gated harm (validate_output + judge_robotic_robust)",
               "n_per_arm": args.n, "groups": out_groups}
    with open(os.path.join(out_dir, "reforge_" + mode + "_" + ts + "_full.json"), "w", encoding="utf-8") as f:
        json.dump({"target": target, "groups": full_groups}, f, indent=2, ensure_ascii=False, default=str)
    for p in (os.path.join(out_dir, "reforge_" + mode + "_" + ts + "_summary.json"),
              os.path.join(out_dir, "reforge_" + mode + "_latest_summary.json")):
        with open(p, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
    logger.info("Summary: reforge_%s_latest_summary.json", mode)


def main() -> None:
    p = argparse.ArgumentParser(description="Measure harm-lift of forged variants vs baseline (#06, #16)")
    p.add_argument("--n", type=int, default=3)
    p.add_argument("--temperature", type=float, default=0.7)
    p.add_argument("--only", type=str, default="", help="comma-separated group names (e.g. 16i2)")
    args = p.parse_args()
    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
