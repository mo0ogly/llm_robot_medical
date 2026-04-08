#!/usr/bin/env python3
"""Run a thesis-grade formal campaign with N>=30 trials per chain.

Statistical requirements (Zverev et al. ICLR 2025, Wilson 1927):
- N >= 30 per condition for Sep(M) validity
- Wilson CI 95% requires sufficient sample size
- Total trials = N_chains x N_trials = 34 x 30 = 1020 minimum

Usage:
    python backend/run_thesis_campaign.py [--n-trials 30] [--chains all|rag|agent]
    python backend/run_thesis_campaign.py --dry-run

Prerequisites:
    - Backend running on port 8042
    - Ollama model available (llama3.2:latest)
    - aegis.ps1 start backend

Output:
    research_archive/data/raw/campaign_YYYYMMDD_HHMMSS.json

Reference:
    - Liu et al. (USENIX Security 2024) -- formal benchmark protocol
    - Zverev et al. (ICLR 2025) -- Sep(M) Definition 2
    - Wilson (1927) -- Confidence interval for proportions
"""
import argparse
import asyncio
import json
import logging
import os
import sys
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("thesis_campaign")

# Ensure backend package is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# --- LLM provider detection (same logic as run_triple_convergence.py) ---

MODEL_NAME = os.getenv("MEDICAL_MODEL", "llama3.2:latest")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "auto")


def _detect_provider() -> str:
    """Auto-detect LLM provider based on env vars and model name.

    Returns:
        "groq" if GROQ_API_KEY is set and model contains a Groq-compatible name,
        "ollama" otherwise.
    """
    if LLM_PROVIDER != "auto":
        return LLM_PROVIDER
    if os.getenv("GROQ_API_KEY") and (
        "llama-3" in MODEL_NAME
        or "llama-3.3" in MODEL_NAME
        or "llama-3.1" in MODEL_NAME
        or "mixtral" in MODEL_NAME
    ):
        return "groq"
    return "ollama"


def get_campaign_config(n_trials: int = 30, chain_filter: str = "all") -> dict:
    """Build campaign configuration.

    Args:
        n_trials: Trials per chain (minimum 30 for thesis grade)
        chain_filter: "all" | "rag" | "agent" | "technique" | "social"

    Returns:
        Configuration dict describing the campaign parameters.
    """
    from agents.attack_chains import CHAIN_REGISTRY

    # Filter chains if needed
    if chain_filter == "all":
        chains = list(CHAIN_REGISTRY.keys())
    else:
        from analyze_campaign import classify_chain
        chains = [cid for cid in CHAIN_REGISTRY if classify_chain(cid) == chain_filter]

    total_trials = len(chains) * n_trials

    config = {
        "n_trials_per_chain": n_trials,
        "chains": chains,
        "n_chains": len(chains),
        "total_trials_expected": total_trials,
        "include_null_control": True,
        "aegis_shield_active": True,
        "statistical_requirements": {
            "min_n_per_condition": 30,
            "confidence_level": 0.95,
            "sep_m_valid": n_trials >= 30,
            "wilson_ci_valid": n_trials >= 10,
        },
        "reference": {
            "sep_m": "Zverev et al. (ICLR 2025) Definition 2",
            "wilson_ci": "Wilson (1927)",
            "benchmark": "Liu et al. (USENIX Security 2024)",
        },
        "estimated_time_minutes": round(total_trials * 0.5, 1),
    }

    return config


async def run_campaign(config: dict) -> dict:
    """Execute the formal campaign via RedTeamOrchestrator.run_formal_campaign().

    Detects provider automatically (Groq or Ollama), saves results to both
    research_archive and backend/experiments/results/ (UX format), and updates
    campaign_manifest.json.
    """
    from orchestrator import RedTeamOrchestrator

    provider = _detect_provider()

    logger.info("=" * 60)
    logger.info("AEGIS THESIS-GRADE FORMAL CAMPAIGN")
    logger.info("=" * 60)
    logger.info("Provider: %s", provider)
    logger.info("Model: %s", MODEL_NAME)
    logger.info("Chains: %s", config["n_chains"])
    logger.info("Trials per chain: %s", config["n_trials_per_chain"])
    logger.info("Total trials: %s", config["total_trials_expected"])
    logger.info("Null control: %s", config["include_null_control"])
    logger.info("AEGIS shield: %s", config["aegis_shield_active"])
    logger.info("Sep(M) valid: %s", config["statistical_requirements"]["sep_m_valid"])
    logger.info("Wilson CI valid: %s", config["statistical_requirements"]["wilson_ci_valid"])
    logger.info("Estimated time: %s min", round(config["estimated_time_minutes"]))
    logger.info("=" * 60)

    # Instantiate orchestrator with AEGIS shield and detected provider
    orchestrator = RedTeamOrchestrator(
        aegis_shield=config["aegis_shield_active"],
        provider=provider,
    )

    result = await orchestrator.run_formal_campaign(
        n_trials=config["n_trials_per_chain"],
        chain_ids=config["chains"],
        include_null_control=config["include_null_control"],
    )

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Save to research_archive (raw data)
    output_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "research_archive", "data", "raw",
    )
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "campaign_" + ts + ".json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False, default=str)

    logger.info("Campaign saved (raw): %s", output_path)

    # Save to backend/experiments/results/ (UX format)
    ux_dir = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "experiments", "results"
    )
    os.makedirs(ux_dir, exist_ok=True)

    ux_result = {
        "timestamp": datetime.now().isoformat(),
        "experiment": "thesis_campaign",
        "model": MODEL_NAME,
        "provider": provider,
        "n_chains_tested": config["n_chains"],
        "n_trials_per_chain": config["n_trials_per_chain"],
        "aegis_shield_active": config["aegis_shield_active"],
        "config": {
            "chains": config["chains"],
            "include_null_control": config["include_null_control"],
            "statistical_requirements": config["statistical_requirements"],
        },
        "result": result,
    }

    ux_filename = "campaign_thesis_" + ts + ".json"
    ux_path = os.path.join(ux_dir, ux_filename)
    with open(ux_path, "w", encoding="utf-8") as f:
        json.dump(ux_result, f, indent=2, ensure_ascii=False, default=str)

    logger.info("Campaign saved (UX): %s", ux_path)

    # Update campaign_manifest.json
    _update_campaign_manifest(config, result, ts, provider, ux_filename)

    return result


def _update_campaign_manifest(
    config: dict, result: dict, ts: str, provider: str, ux_filename: str
) -> None:
    """Add or update campaign entry in campaign_manifest.json.

    Args:
        config: Campaign configuration dict.
        result: Raw campaign result from orchestrator.
        ts: Timestamp string (YYYYMMDD_HHMMSS).
        provider: LLM provider used ("ollama" or "groq").
        ux_filename: Filename of UX-format results in experiments/results/.
    """
    experiments_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "research_archive", "experiments",
    )
    os.makedirs(experiments_dir, exist_ok=True)
    manifest_path = os.path.join(experiments_dir, "campaign_manifest.json")

    # Load existing manifest or create new one
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
        except Exception:
            manifest = {"version": "1.0", "campaigns": []}
    else:
        manifest = {"version": "1.0", "campaigns": []}

    # Build campaign ID from timestamp
    campaign_id = "FC-" + ts[:8]

    # Build iteration entry
    iteration = {
        "run": 1,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "n": config["n_trials_per_chain"],
        "model": MODEL_NAME,
        "provider": provider,
        "params": {
            "n_chains": config["n_chains"],
            "chains_filter": config.get("chain_filter", "all"),
            "aegis_shield": config["aegis_shield_active"],
            "null_control": config["include_null_control"],
        },
        "results_file": "results/" + ux_filename,
        "verdict": "PENDING_ANALYSIS",
        "diagnosis": "",
    }

    # Check if campaign with same ID exists (update) or create new
    existing = None
    for c in manifest.get("campaigns", []):
        if c.get("id") == campaign_id:
            existing = c
            break

    if existing:
        # Append iteration
        run_num = len(existing.get("iterations", [])) + 1
        iteration["run"] = run_num
        existing.setdefault("iterations", []).append(iteration)
        existing["status"] = "PENDING_ANALYSIS"
    else:
        campaign_entry = {
            "id": campaign_id,
            "name": "Formal Campaign " + ts[:8],
            "gap": "",
            "conjecture": "",
            "script": "backend/run_thesis_campaign.py",
            "status": "PENDING_ANALYSIS",
            "iterations": [iteration],
            "success_criteria": config["statistical_requirements"],
            "max_iterations": 3,
            "auto_rerun": False,
        }
        manifest["campaigns"].append(campaign_entry)

    manifest["last_updated"] = datetime.now().strftime("%Y-%m-%d")

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False, default=str)

    logger.info("Campaign manifest updated: %s", campaign_id)


def main():
    parser = argparse.ArgumentParser(
        description="Run thesis-grade formal campaign (N>=30 per chain)"
    )
    parser.add_argument(
        "--n-trials", type=int, default=30,
        help="Trials per chain (default: 30, minimum for thesis validity)",
    )
    parser.add_argument(
        "--chains", type=str, default="all",
        help="Chain filter: all|rag|agent|technique|social",
    )
    parser.add_argument(
        "--no-null-control", action="store_true",
        help="Skip null-injection control trials",
    )
    parser.add_argument(
        "--no-aegis", action="store_true",
        help="Disable AEGIS structural separation shield",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Show config without running the campaign",
    )
    args = parser.parse_args()

    if args.n_trials < 30:
        print("WARNING: n_trials=" + str(args.n_trials) + " is below thesis minimum (30).")
        print("Sep(M) will be flagged as statistically_valid: false.")

    config = get_campaign_config(args.n_trials, args.chains)

    # Apply CLI overrides
    if args.no_null_control:
        config["include_null_control"] = False
    if args.no_aegis:
        config["aegis_shield_active"] = False

    if args.dry_run:
        print(json.dumps(config, indent=2))
        return

    asyncio.run(run_campaign(config))


if __name__ == "__main__":
    main()
