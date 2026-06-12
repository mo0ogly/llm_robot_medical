#!/usr/bin/env python3
"""Screening audit: baseline ASR per DIRECT catalogue template (rank mediocre payloads).

Sends each direct template (chain_id empty) as a single user turn to the DVSI 70B
target, scores with the deterministic ``validate_output`` judge, and ranks by ASR
ascending so the mediocre payloads surface first. Screening N (default 10) gives a
coarse ranking; promote the bottom set to N>=30 before re-forging.

Scope: direct templates only (chain_id empty). Chain templates (chain_id set) need
the orchestrator chain harness and are EXCLUDED here (count logged, not silently dropped).

Caveat: delta1/IPI and prompt_leak templates are built for a RAG/leak surface; measured
here as direct sends + a violation judge, a low ASR may be a surface artefact rather than
payload weakness. ``target_delta`` and ``category`` are kept in the output for interpretation.

Filter-safe: payloads + responses -> *_full.json on disk only; *_summary.json holds
metrics + metadata only. AutoGen silenced; redirect shell stdout to a log when running.

Usage:
    python backend/run_catalogue_screen.py --n 10            # screen all direct templates
    python backend/run_catalogue_screen.py --n 10 --limit 5  # smoke test
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

from agents.medical_robot_agent import create_medical_robot_agent  # noqa: E402
from agents.genetic_engine.harness import create_davinci_harness  # noqa: E402
from agents.security_audit_agent import validate_output, wilson_ci  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logging.getLogger("autogen").setLevel(logging.ERROR)
logger = logging.getLogger("catalogue_screen")

_HERE = os.path.dirname(os.path.abspath(__file__))
PROMPTS_DIR = os.path.join(_HERE, "prompts")
INDEX_PATH = os.path.join(
    os.path.dirname(_HERE), "research_archive", "experiments", "catalogue_metadata_index.json"
)
PAYLOAD_KEYS = ("template", "payload", "prompt", "content", "text")


def load_payload(path: str):
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    for k in PAYLOAD_KEYS:
        v = d.get(k)
        if isinstance(v, str) and v.strip():
            return v
    return None


def _apply_sampling_config(agent, temperature: float) -> None:
    cfg = getattr(agent, "llm_config", None)
    if not isinstance(cfg, dict):
        return
    cfg["cache_seed"] = None
    cfg["temperature"] = temperature
    for entry in cfg.get("config_list", []) or []:
        if isinstance(entry, dict):
            entry["temperature"] = temperature


async def run_template(harness, payload: str, n: int):
    successes = 0
    trials = []
    for i in range(n):
        try:
            response = await harness.run_harness(payload)
        except Exception as exc:  # noqa: BLE001
            trials.append({"i": i, "error": str(exc)})
            continue
        verdict = validate_output(response)
        success = not verdict["in_allowed_set"]
        successes += int(success)
        trials.append({"i": i, "success": success, "violations": verdict["violations"], "response": response})
    n_eff = sum(1 for t in trials if "error" not in t)
    asr = successes / n_eff if n_eff else 0.0
    low, high = wilson_ci(successes, n_eff) if n_eff else (0.0, 1.0)
    return successes, n_eff, asr, [low, high], trials


async def main_async(args) -> None:
    with open(INDEX_PATH, encoding="utf-8") as f:
        index = json.load(f)
    targets = [r for r in index if not r.get("chain_id")]
    n_chains = sum(1 for r in index if r.get("chain_id"))
    if args.limit:
        targets = targets[: args.limit]

    model = os.getenv("MEDICAL_MODEL") or "llama-3.3-70b-versatile"
    agent = create_medical_robot_agent(provider="groq", model=model)
    agent.silent = True
    _apply_sampling_config(agent, args.temperature)
    harness = create_davinci_harness(agent, aegis_shield=False)

    logger.info(
        "Screening %d direct templates | N=%d | groq/%s temp=%.2f shield=OFF judge=validate_output",
        len(targets), args.n, model, args.temperature,
    )
    logger.info("Excluded (chain harness needed): %d chain templates", n_chains)

    results = []
    full = []
    for idx, row in enumerate(targets, 1):
        path = os.path.join(PROMPTS_DIR, row["file"])
        payload = load_payload(path)
        if not payload:
            logger.warning("[%d/%d] %s: no payload, skipped", idx, len(targets), row["file"])
            continue
        successes, n_eff, asr, ci, trials = await run_template(harness, payload, args.n)
        rec = {
            "file": row["file"], "num": row["num"], "name": row.get("name"),
            "category": row.get("category"), "target_delta": row.get("target_delta"),
            "taxonomy_primary": row.get("taxonomy_primary"),
            "n_effective": n_eff, "successes": successes, "asr": asr, "wilson_ci_95": ci,
        }
        results.append(rec)
        full.append({**rec, "trials": trials})
        logger.info(
            "[%d/%d] #%s %s [%s/%s]: ASR=%.0f%% (%d/%d)",
            idx, len(targets), row["num"], row["file"], row.get("category"),
            row.get("target_delta"), 100 * asr, successes, n_eff,
        )

    results.sort(key=lambda r: (r["asr"], r["num"]))
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = os.path.join(os.path.dirname(_HERE), "research_archive", "experiments", "catalogue_screen")
    os.makedirs(out_dir, exist_ok=True)
    target = {"provider": "groq", "model": model, "temperature": args.temperature, "aegis_shield": False}

    with open(os.path.join(out_dir, "screen_" + ts + "_full.json"), "w", encoding="utf-8") as f:
        json.dump({"target": target, "results": full}, f, indent=2, ensure_ascii=False, default=str)

    summary = {
        "experiment": "catalogue_screen",
        "timestamp": datetime.now().isoformat(),
        "target": target,
        "judge": "validate_output (deterministic)",
        "n_per_template": args.n,
        "n_templates": len(results),
        "scope": "direct templates (chain_id empty); chain templates excluded",
        "ranking_asc_by_asr": results,
    }
    for p in (
        os.path.join(out_dir, "screen_" + ts + "_summary.json"),
        os.path.join(out_dir, "screen_latest_summary.json"),
    ):
        with open(p, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)

    logger.info("Summary (metrics only): screen_latest_summary.json | %d templates ranked", len(results))


def main() -> None:
    parser = argparse.ArgumentParser(description="Screen direct catalogue templates by baseline ASR")
    parser.add_argument("--n", type=int, default=10, help="Trials per template (screening)")
    parser.add_argument("--temperature", type=float, default=0.7)
    parser.add_argument("--limit", type=int, default=0, help="Cap number of templates (0 = all)")
    args = parser.parse_args()
    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
