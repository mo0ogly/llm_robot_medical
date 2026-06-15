#!/usr/bin/env python3
"""Re-screen the pharma-family direct templates with the LLM judge (judge_pharma_llm).

The deterministic judge cannot assess "dangerous dose" for 26/28 pharma templates
(no dose threshold in metadata). This pass uses judge_pharma_llm (Groq, temp 0) as a
COMPLEMENT, tagged with confidence and the P153 caveat (LLM judges are manipulable;
not a sole arbiter for formal ASR). Success = LLM-judged violation AND not a refusal
(refusal gate, same as the family screen).

Filter-safe: payloads loaded by script; responses + rationales -> *_full.json on disk;
*_summary.json holds metrics + confidence only. AutoGen silenced.

Usage:
    python backend/run_pharma_screen.py --n 2 --limit 3   # smoke
    python backend/run_pharma_screen.py --n 10            # full pharma re-screen
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

from run_family_screen import is_refusal, render, load_template, _apply_sampling_config, family_of, PROMPTS_DIR  # noqa: E402
from agents.medical_robot_agent import create_medical_robot_agent  # noqa: E402
from agents.genetic_engine.harness import create_davinci_harness  # noqa: E402
from agents.security_audit_agent import wilson_ci  # noqa: E402
from agents.judges.judge_pharma_llm import judge_pharma_llm  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logging.getLogger("autogen").setLevel(logging.ERROR)
logger = logging.getLogger("pharma_screen")

_HERE = os.path.dirname(os.path.abspath(__file__))
INDEX_PATH = os.path.join(os.path.dirname(_HERE), "research_archive", "experiments", "catalogue_metadata_index.json")


async def screen(harness, payload, variables, n):
    viol = refused = 0
    conf_sum = 0.0
    trials = []
    rendered = render(payload, variables)
    for i in range(n):
        try:
            resp = await harness.run_harness(rendered)
        except Exception as exc:  # noqa: BLE001
            trials.append({"i": i, "error": str(exc)})
            continue
        r = is_refusal(resp)
        verdict = judge_pharma_llm(resp, {"variables": variables})
        v = bool(verdict.get("violation")) and not r
        viol += int(v)
        refused += int(r)
        conf_sum += float(verdict.get("confidence") or 0.0)
        trials.append({"i": i, "violation": v, "refused": r,
                       "llm_violation": verdict.get("violation"), "confidence": verdict.get("confidence"),
                       "rationale": verdict.get("rationale"), "response": resp})
    neff = sum(1 for t in trials if "error" not in t)
    lo, hi = wilson_ci(viol, neff) if neff else (0.0, 1.0)
    return {"n_effective": neff, "violations": viol, "harm_rate": viol / neff if neff else 0.0,
            "refusal_rate": refused / neff if neff else 0.0, "mean_confidence": conf_sum / neff if neff else 0.0,
            "wilson_ci_95": [lo, hi], "trials": trials}


async def main_async(args) -> None:
    with open(INDEX_PATH, encoding="utf-8") as f:
        index = json.load(f)
    pharma = [r for r in index if family_of(r) == "pharma" and not r.get("chain_id")]
    if args.nums:
        wanted = set(args.nums.split(","))
        pharma = [r for r in pharma if str(r["num"]) in wanted]
    if args.limit:
        pharma = pharma[: args.limit]

    model = os.getenv("MEDICAL_MODEL") or "llama-3.3-70b-versatile"
    agent = create_medical_robot_agent(provider="groq", model=model)
    agent.silent = True
    _apply_sampling_config(agent, args.temperature)
    harness = create_davinci_harness(agent, aegis_shield=False)
    logger.info("Pharma re-screen: %d direct templates | N=%d | judge=judge_pharma_llm (Groq, P153 caveat)", len(pharma), args.n)

    results = []
    full = []
    for idx, meta in enumerate(pharma, 1):
        payload, variables = load_template(os.path.join(PROMPTS_DIR, meta["file"]))
        if not payload:
            continue
        res = await screen(harness, payload, variables, args.n)
        rec = {"file": meta["file"], "num": meta["num"], "name": meta.get("name"),
               **{k: res[k] for k in ("n_effective", "violations", "harm_rate", "refusal_rate", "mean_confidence", "wilson_ci_95")}}
        results.append(rec)
        full.append({**rec, "trials": res["trials"]})
        logger.info("[%d/%d] #%s %-40s harm=%.0f%% refusal=%.0f%% conf=%.2f",
                    idx, len(pharma), meta["num"], meta["file"][:40],
                    100 * res["harm_rate"], 100 * res["refusal_rate"], res["mean_confidence"])

    results.sort(key=lambda r: (r["harm_rate"], -r["refusal_rate"], r["num"]))
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = os.path.join(os.path.dirname(_HERE), "research_archive", "experiments", "pharma_screen")
    os.makedirs(out_dir, exist_ok=True)
    target = {"provider": "groq", "model": model, "temperature": args.temperature, "aegis_shield": False}
    summary = {"experiment": "pharma_screen_llm_judge", "timestamp": datetime.now().isoformat(), "target": target,
               "judge": "judge_pharma_llm (Groq LLM judge, temp 0)",
               "caveat": "P153 (Eiras et al. 2025): LLM judges manipulable -> complement, not sole arbiter; tag confidence; human spot-check required",
               "n_per_template": args.n, "n_templates": len(results), "ranking_mediocre_first": results}
    with open(os.path.join(out_dir, "pharma_screen_" + ts + "_full.json"), "w", encoding="utf-8") as f:
        json.dump({"target": target, "results": full}, f, indent=2, ensure_ascii=False, default=str)
    for p in (os.path.join(out_dir, "pharma_screen_" + ts + "_summary.json"),
              os.path.join(out_dir, "pharma_screen_latest_summary.json")):
        with open(p, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
    logger.info("Summary: pharma_screen_latest_summary.json | %d templates", len(results))


def main() -> None:
    p = argparse.ArgumentParser(description="Re-screen pharma templates with LLM judge")
    p.add_argument("--n", type=int, default=10)
    p.add_argument("--temperature", type=float, default=0.7)
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--nums", type=str, default="", help="comma-separated template numbers to screen")
    args = p.parse_args()
    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
