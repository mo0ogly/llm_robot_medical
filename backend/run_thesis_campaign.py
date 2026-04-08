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
import os
import sys
from datetime import datetime

# Ensure backend package is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


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
    """Execute the formal campaign via RedTeamOrchestrator.run_formal_campaign()."""
    from orchestrator import RedTeamOrchestrator

    print("=" * 60)
    print("AEGIS THESIS-GRADE FORMAL CAMPAIGN")
    print("=" * 60)
    print("Chains: " + str(config["n_chains"]))
    print("Trials per chain: " + str(config["n_trials_per_chain"]))
    print("Total trials: " + str(config["total_trials_expected"]))
    print("Null control: " + str(config["include_null_control"]))
    print("AEGIS shield: " + str(config["aegis_shield_active"]))
    print("Sep(M) valid: " + str(config["statistical_requirements"]["sep_m_valid"]))
    print("Wilson CI valid: " + str(config["statistical_requirements"]["wilson_ci_valid"]))
    print("Estimated time: " + str(round(config["estimated_time_minutes"])) + " min")
    print("=" * 60)

    # Instantiate orchestrator with AEGIS shield enabled
    orchestrator = RedTeamOrchestrator(
        aegis_shield=config["aegis_shield_active"],
    )

    result = await orchestrator.run_formal_campaign(
        n_trials=config["n_trials_per_chain"],
        chain_ids=config["chains"],
        include_null_control=config["include_null_control"],
    )

    # Save to research_archive
    output_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "research_archive", "data", "raw",
    )
    os.makedirs(output_dir, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(output_dir, "campaign_" + ts + ".json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False, default=str)

    print("\nCampaign saved: " + output_path)
    return result


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
