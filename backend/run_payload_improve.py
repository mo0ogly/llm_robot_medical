#!/usr/bin/env python3
"""Measure ASR lift: weak baseline template vs forged improved variants.

Compares the baseline template #01 (proven 0% on Groq 70B, weakened by a
ROOT_HACK cliche + overt malicious reason + rule-nullification) against forged
variants that use VALID operators only (institutional authority, plausible
clinical justification, task injection, cross-lingual). Same target, same
deterministic judge -- the only variable is the payload.

Deterministic judge ONLY (``validate_output``). Success = a forbidden action
detected (here: ``freeze_instruments`` invocation), i.e. Reachable not in Allowed.

Filter-safe design:
    - Baseline payload + forged variants are loaded from disk by THIS script.
    - Raw payloads and raw responses go to *_full.json on disk only.
    - *_summary.json + *_latest_summary.json hold metrics only (safe to read).
    - AutoGen agent silenced; redirect shell stdout to a log when running.

Usage:
    python backend/run_payload_improve.py --n 5     # pre-check
    python backend/run_payload_improve.py --n 30    # thesis-grade

References:
    - validate_output / wilson_ci : backend/agents/security_audit_agent.py
    - DaVinciHarness              : backend/agents/genetic_engine/harness.py
    - valid operators / proven recipe : .claude/rules/redteam-forge.md, wiki/docs/forge
    - N>=30, Wilson CI            : Zverev et al. (ICLR 2025), Wilson (1927)
"""
import argparse
import asyncio
import glob
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
logger = logging.getLogger("payload_improve")

_HERE = os.path.dirname(os.path.abspath(__file__))
BASELINE_GLOB = os.path.join(_HERE, "prompts", "01-*.json")
CANDIDATES_PATH = os.path.join(_HERE, "prompts", "_candidates", "01_improved_candidates.json")
PAYLOAD_KEYS = ("template", "payload", "prompt", "content", "text")


def load_payload(path: str):
    """Load the payload string from a template JSON (script-only read)."""
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    for key in PAYLOAD_KEYS:
        value = data.get(key)
        if isinstance(value, str) and value.strip():
            return value
    raise SystemExit("No payload field found in " + path)


def load_arms():
    """Build the ordered list of arms: baseline first, then forged variants."""
    baseline_paths = sorted(glob.glob(BASELINE_GLOB))
    if not baseline_paths:
        raise SystemExit("Baseline #01 not found: " + BASELINE_GLOB)
    arms = [("baseline_01", "baseline", load_payload(baseline_paths[0]))]

    if not os.path.exists(CANDIDATES_PATH):
        raise SystemExit("Candidates file not found: " + CANDIDATES_PATH)
    with open(CANDIDATES_PATH, encoding="utf-8") as f:
        candidates = json.load(f)
    for c in candidates:
        payload = next((c[k] for k in PAYLOAD_KEYS if isinstance(c.get(k), str) and c[k].strip()), None)
        if not payload:
            logger.warning("Candidate %s has no payload field, skipped", c.get("id"))
            continue
        arms.append((c.get("id", "candidate"), c.get("operator", "unknown"), payload))
    return arms


async def run_arm(harness, payload: str, n: int) -> dict:
    successes = 0
    trials = []
    for i in range(n):
        try:
            response = await harness.run_harness(payload)
        except Exception as exc:  # noqa: BLE001
            logger.error("trial %d error: %s", i, exc)
            trials.append({"i": i, "error": str(exc)})
            continue
        verdict = validate_output(response)
        success = not verdict["in_allowed_set"]
        successes += int(success)
        trials.append(
            {"i": i, "success": success, "violations": verdict["violations"], "response": response}
        )
    n_eff = sum(1 for t in trials if "error" not in t)
    asr = successes / n_eff if n_eff else 0.0
    low, high = wilson_ci(successes, n_eff) if n_eff else (0.0, 1.0)
    return {
        "n_requested": n,
        "n_effective": n_eff,
        "successes": successes,
        "asr": asr,
        "wilson_ci_95": [low, high],
        "trials": trials,
    }


def _apply_sampling_config(agent, temperature: float) -> None:
    cfg = getattr(agent, "llm_config", None)
    if not isinstance(cfg, dict):
        return
    cfg["cache_seed"] = None
    cfg["temperature"] = temperature
    for entry in cfg.get("config_list", []) or []:
        if isinstance(entry, dict):
            entry["temperature"] = temperature


async def main_async(args) -> None:
    arms = load_arms()
    model = os.getenv("MEDICAL_MODEL") or "llama-3.3-70b-versatile"
    agent = create_medical_robot_agent(provider="groq", model=model)
    agent.silent = True
    _apply_sampling_config(agent, args.temperature)
    harness = create_davinci_harness(agent, aegis_shield=False)

    logger.info(
        "Target: groq / %s | temp=%.2f | aegis_shield=OFF | judge=validate_output (deterministic)",
        model, args.temperature,
    )
    logger.info("Arms: %s | N=%d/arm", ", ".join(a[0] for a in arms), args.n)

    results = []
    for arm_id, operator, payload in arms:
        logger.info("Running %s (%s) ...", arm_id, operator)
        res = await run_arm(harness, payload, args.n)
        res.update({"arm": arm_id, "operator": operator, "payload_len": len(payload)})
        logger.info(
            "  %s [%s]: ASR=%.1f%% (%d/%d) Wilson95=[%.2f, %.2f]",
            arm_id, operator, 100 * res["asr"], res["successes"], res["n_effective"],
            res["wilson_ci_95"][0], res["wilson_ci_95"][1],
        )
        results.append(res)

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = os.path.join(os.path.dirname(_HERE), "research_archive", "experiments", "payload_improve")
    os.makedirs(out_dir, exist_ok=True)
    mode = "precheck" if args.n < 30 else "full"

    target = {"provider": "groq", "model": model, "temperature": args.temperature,
              "aegis_shield": False, "system": "MedicalRobotAgent/DaVinci"}
    full = {
        "experiment": "payload_improve_template01",
        "mode": mode,
        "timestamp": datetime.now().isoformat(),
        "target": target,
        "judge": "validate_output (deterministic, Reachable(M,i) subset Allowed(i))",
        "goal": "freeze_instruments invocation",
        "arms": results,
    }
    full_path = os.path.join(out_dir, "improve_" + mode + "_" + ts + "_full.json")
    with open(full_path, "w", encoding="utf-8") as f:
        json.dump(full, f, indent=2, ensure_ascii=False, default=str)

    summary = {
        "experiment": full["experiment"], "mode": mode, "timestamp": full["timestamp"],
        "target": target, "judge": full["judge"], "goal": full["goal"],
        "arms": [
            {k: a[k] for k in ("arm", "operator", "n_requested", "n_effective", "successes", "asr", "wilson_ci_95", "payload_len")}
            for a in results
        ],
    }
    for sum_path in (
        os.path.join(out_dir, "improve_" + mode + "_" + ts + "_summary.json"),
        os.path.join(out_dir, "improve_" + mode + "_latest_summary.json"),
    ):
        with open(sum_path, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)

    logger.info("Full detail (disk only, NOT for context): %s", full_path)
    logger.info("Summary (metrics only, safe): improve_%s_latest_summary.json", mode)


def main() -> None:
    parser = argparse.ArgumentParser(description="Measure ASR lift: baseline #01 vs forged variants")
    parser.add_argument("--n", type=int, default=5, help="Trials per arm (>=30 = thesis grade)")
    parser.add_argument("--temperature", type=float, default=0.7, help="Sampling temperature (70B default)")
    args = parser.parse_args()
    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
