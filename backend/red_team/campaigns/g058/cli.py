"""Command-line entry point for the G-058 campaign orchestrator."""
from __future__ import annotations

import argparse
import json
import logging
import sys
from dataclasses import asdict
from pathlib import Path

from backend.red_team.campaigns.g058.loaders import (
    load_medical_scenarios,
    load_templates,
)
from backend.red_team.campaigns.g058.specs import (
    default_spec,
    medical_spec,
    synthetic_medical_scenario,
    synthetic_template,
)
from backend.red_team.campaigns.g058.subcampaigns import (
    run_sc1,
    run_sc2,
    run_sc3,
    run_sc4,
)

logger = logging.getLogger(__name__)

DEFAULT_OUTPUT_DIR = Path("research_archive/experiments/G058_7_frameworks")


def main() -> int:
    """Parse arguments, dispatch to the requested sub-campaign, print the manifest."""
    parser = argparse.ArgumentParser(
        description="G-058 campaign orchestrator -- 8 frameworks δ³ evaluation."
    )
    parser.add_argument(
        "--subcampaign",
        choices=["SC1", "SC2", "SC3", "SC4"],
        default="SC1",
        help="Which sub-campaign to run (default SC1).",
    )
    parser.add_argument(
        "--n-trials",
        type=int,
        default=30,
        help="Trials per (framework, template) pair (default 30).",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help="Output directory for JSONL + manifest files.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Smoke test with synthetic fixtures and skip file writes.",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
    )

    if args.subcampaign == "SC1":
        templates = [synthetic_template()] if args.dry_run else load_templates()
        manifest = run_sc1(
            templates, default_spec(), args.n_trials, args.output_dir, args.dry_run
        )
    elif args.subcampaign == "SC2":
        scenarios = (
            [synthetic_medical_scenario()]
            if args.dry_run
            else load_medical_scenarios()
        )
        manifest = run_sc2(
            scenarios, medical_spec(), args.n_trials, args.output_dir, args.dry_run
        )
    elif args.subcampaign == "SC3":
        templates = [synthetic_template()] if args.dry_run else load_templates()
        manifest = run_sc3(
            templates,
            default_spec(),
            pop_size=10 if args.dry_run else 30,
            n_generations=3 if args.dry_run else 200,
            output_dir=args.output_dir,
            dry_run=args.dry_run,
        )
    elif args.subcampaign == "SC4":
        scenarios = (
            [synthetic_medical_scenario()]
            if args.dry_run
            else load_medical_scenarios()
        )
        manifest = run_sc4(
            scenarios, medical_spec(), args.n_trials, args.output_dir, args.dry_run
        )
    else:  # pragma: no cover - argparse choices guard
        logger.error("Sub-campaign %s not recognised", args.subcampaign)
        return 2

    print(json.dumps(asdict(manifest), indent=2, ensure_ascii=False, default=str))
    return 0
