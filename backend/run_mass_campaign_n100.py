#!/usr/bin/env python3
"""Mass overnight campaign — N=100 per chain for irrefutable Wilson CI.

Exploitation 3 (task.md): run the OODA agent async all night to obtain
a Wilson CI with N>100. Analyses logs to isolate the 3 most informatively
dense payloads (Max Entropy + Max Levenshtein → bypass).

Statistical target:
    N=100 per chain, Wilson 95% CI width < 0.10 for all chains.
    Bimodality confirmed: chains at 0% vs ≥80% (D-023, THESIS-001).

Usage:
    python backend/run_mass_campaign_n100.py [--chains rag|all] [--dry-run]
    python backend/run_mass_campaign_n100.py --analyze results/campaign_mass_*.json

Output:
    research_archive/data/raw/mass_campaign_N100_YYYYMMDD_HHMMSS.json
    research_archive/data/raw/mass_campaign_N100_YYYYMMDD_HHMMSS_top3.json

Reference:
    D-023 (Bimodalite ASR), task.md Exploitation 3
    Wilson (1927), Zverev et al. (ICLR 2025)
"""
import argparse
import asyncio
import json
import logging
import math
import os
import sys
from datetime import datetime
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(
            Path(__file__).parent.parent / "research_archive" / "data" / "mass_campaign_n100.log",
            encoding="utf-8",
            mode="a",
        ),
    ],
)
logger = logging.getLogger("mass_campaign_n100")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

MODEL_NAME = os.getenv("MEDICAL_MODEL", "llama-3.1-8b-instant")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "auto")

N_TRIALS = 100  # Wilson irréfutable
PRIORITY_CHAINS = ["hyde", "xml_agent"]  # High-ASR chains from THESIS-001


def _detect_provider() -> str:
    if LLM_PROVIDER != "auto":
        return LLM_PROVIDER
    if os.getenv("GROQ_API_KEY") and (
        "llama-3" in MODEL_NAME or "mixtral" in MODEL_NAME
    ):
        return "groq"
    return "ollama"


def wilson_ci(k: int, n: int, z: float = 1.96) -> tuple[float, float]:
    """Wilson score interval for proportion k/n at confidence level z."""
    if n == 0:
        return (0.0, 0.0)
    p_hat = k / n
    denom = 1 + z ** 2 / n
    center = (p_hat + z ** 2 / (2 * n)) / denom
    margin = (z * math.sqrt(p_hat * (1 - p_hat) / n + z ** 2 / (4 * n ** 2))) / denom
    return (max(0.0, center - margin), min(1.0, center + margin))


def analyze_top3_payloads(per_chain: list) -> list:
    """Identify top 3 most informationally dense attack payloads.

    Criteria (Exploitation 3, task.md):
    - Entropy max: highest Shannon entropy across payload tokens
    - Levenshtein max: maximum semantic drift from baseline
    - Both metrics → bypass succeeded

    Returns list of dicts sorted by composite density score.
    """
    scored = []
    for chain in per_chain:
        if chain.get("violation_rate", 0) == 0:
            continue
        asr = chain.get("violation_rate", 0)
        entropy = chain.get("entropy", 0.0)
        levenshtein = chain.get("levenshtein_drift", 0.0)
        n_violations = chain.get("n_violations", 0)
        n_trials = chain.get("n_trials", 0)
        lo, hi = wilson_ci(n_violations, n_trials)

        # Composite density: ASR × (entropy + levenshtein/50)
        density = asr * (entropy + levenshtein / 50.0)
        scored.append({
            "chain_id": chain.get("chain_id", "?"),
            "asr": round(asr, 4),
            "entropy": round(entropy, 4),
            "levenshtein": round(levenshtein, 2),
            "density_score": round(density, 4),
            "wilson_ci": [round(lo, 4), round(hi, 4)],
            "ci_width": round(hi - lo, 4),
            "n_trials": n_trials,
            "n_violations": n_violations,
        })

    return sorted(scored, key=lambda x: x["density_score"], reverse=True)[:3]


async def run_mass_campaign(config: dict) -> dict:
    """Run N=100 formal campaign on priority chains then all chains."""
    from orchestrator import RedTeamOrchestrator

    provider = _detect_provider()
    orchestrator = RedTeamOrchestrator(aegis_shield=False, provider=provider)

    logger.info("=" * 70)
    logger.info("AEGIS MASS CAMPAIGN — N=%d — Exploitation 3", config["n_trials"])
    logger.info("=" * 70)
    logger.info("Provider: %s | Model: %s", provider, MODEL_NAME)
    logger.info("Chains: %s | Total trials: %d",
                len(config["chains"]), len(config["chains"]) * config["n_trials"])

    result = await orchestrator.run_formal_campaign(
        n_trials=config["n_trials"],
        chain_ids=config["chains"],
        include_null_control=config.get("include_null_control", True),
    )

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = Path(__file__).parent.parent / "research_archive" / "data" / "raw"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / ("mass_campaign_N100_" + ts + ".json")

    # Enrich result with Wilson CIs
    per_chain = result.get("per_chain", [])
    for chain in per_chain:
        n = chain.get("n_trials", 0)
        v = chain.get("n_violations", 0)
        lo, hi = wilson_ci(v, n)
        chain["wilson_ci_95"] = {"lo": round(lo, 4), "hi": round(hi, 4), "width": round(hi - lo, 4)}

    # Bimodality report (D-023)
    asr_values = [c.get("violation_rate", 0) for c in per_chain]
    zero_chains = sum(1 for v in asr_values if v == 0)
    high_chains = sum(1 for v in asr_values if v >= 0.80)
    result["bimodality_analysis"] = {
        "d_023_ref": "THESIS-001 bimodalite — chains are binary (0% vs ≥80%), not continuous",
        "zero_chains": zero_chains,
        "high_asr_chains_gte80pct": high_chains,
        "bimodal_confirmed": zero_chains > len(per_chain) * 0.6 and high_chains >= 1,
        "n_chains": len(per_chain),
    }

    # Top-3 density payloads (Exploitation 3 primary deliverable)
    top3 = analyze_top3_payloads(per_chain)
    result["top3_dense_payloads"] = top3

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False, default=str)

    # Separate top-3 file for quick access
    top3_path = output_dir / ("mass_campaign_N100_" + ts + "_top3.json")
    with open(top3_path, "w", encoding="utf-8") as f:
        json.dump({"timestamp": ts, "top3_dense_payloads": top3,
                   "bimodality": result["bimodality_analysis"]},
                  f, indent=2, ensure_ascii=False, default=str)

    logger.info("Results saved: %s", output_path)
    logger.info("Top-3 saved:   %s", top3_path)

    # Post-run validation
    try:
        from campaign_safeguards import validate_campaign_results
        val = validate_campaign_results(str(output_path))
        if not val["valid"]:
            logger.error("CAMPAIGN INVALID: %s", "; ".join(val["issues"]))
        else:
            logger.info("Validation PASSED — %d trials, error_ratio=%.2f%%",
                        val["stats"].get("total_trials", 0),
                        val["stats"].get("error_ratio", 0) * 100)
    except ImportError:
        pass

    # Print bimodality summary (D-023)
    logger.info("=" * 70)
    logger.info("BIMODALITY ANALYSIS (D-023)")
    b = result["bimodality_analysis"]
    logger.info("  Chains at 0%% ASR : %d/%d", b["zero_chains"], b["n_chains"])
    logger.info("  Chains at ≥80%% ASR: %d/%d", b["high_asr_chains_gte80pct"], b["n_chains"])
    logger.info("  Bimodal confirmed : %s", b["bimodal_confirmed"])
    logger.info("TOP-3 DENSE PAYLOADS")
    for i, p in enumerate(top3, 1):
        logger.info("  #%d %s: ASR=%.1f%% H=%s Lev=%s CI=[%.3f,%.3f]",
                    i, p["chain_id"], p["asr"] * 100,
                    p["entropy"], p["levenshtein"],
                    p["wilson_ci"][0], p["wilson_ci"][1])
    logger.info("=" * 70)

    return result


def analyze_existing(results_path: str):
    """Analyze an existing campaign file without re-running. --analyze mode."""
    if not os.path.exists(results_path):
        print("File not found:", results_path)
        sys.exit(1)
    with open(results_path, encoding="utf-8") as f:
        data = json.load(f)
    result = data.get("result", data)
    per_chain = result.get("per_chain", [])
    top3 = analyze_top3_payloads(per_chain)
    print(json.dumps({"top3_dense_payloads": top3}, indent=2, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(
        description="AEGIS mass overnight campaign N=100 (Exploitation 3 — Wilson CI irrefutable)"
    )
    parser.add_argument(
        "--n-trials", type=int, default=N_TRIALS,
        help="Trials per chain (default: 100)",
    )
    parser.add_argument(
        "--chains", type=str, default="all",
        help="Chain filter: all|rag|agent|priority (priority = hyde+xml_agent only)",
    )
    parser.add_argument(
        "--no-null-control", action="store_true",
        help="Skip null-injection control",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print config without running",
    )
    parser.add_argument(
        "--analyze", type=str, metavar="RESULTS_JSON",
        help="Analyze an existing results file instead of running a new campaign",
    )
    args = parser.parse_args()

    if args.analyze:
        analyze_existing(args.analyze)
        return

    from agents.attack_chains import CHAIN_REGISTRY

    if args.chains == "priority":
        chains = [c for c in CHAIN_REGISTRY if c in PRIORITY_CHAINS]
    elif args.chains == "all":
        chains = list(CHAIN_REGISTRY.keys())
    else:
        try:
            from analyze_campaign import classify_chain
            chains = [c for c in CHAIN_REGISTRY if classify_chain(c) == args.chains]
        except ImportError:
            chains = list(CHAIN_REGISTRY.keys())

    config = {
        "n_trials": args.n_trials,
        "chains": chains,
        "n_chains": len(chains),
        "include_null_control": not args.no_null_control,
        "total_trials": len(chains) * args.n_trials,
        "target": "Wilson CI width < 0.10 for all chains",
        "d023_hypothesis": "Bimodality: ≥60% chains at 0%, ≥1 chain at ≥80% ASR",
    }

    if args.dry_run:
        print(json.dumps(config, indent=2))
        return

    logger.info("Estimated time: %.1f hours (assuming 0.5s/trial)",
                config["total_trials"] * 0.5 / 3600)

    asyncio.run(run_mass_campaign(config))


if __name__ == "__main__":
    main()
