"""Export sanitized AEGIS scenario metadata for the G-058 campaign.

This tool regenerates ``backend/red_team/scenarios_metadata.json`` from the
authoritative ``backend/scenarios.py`` registry. It is the wired replacement for
the hand-curated STUB_SAMPLE produced in PDCA-10.

Content-filter safety (CLAUDE.md):
    The tool exports ONLY metadata fields that are already exposed by the public
    route ``GET /api/redteam/scenarios`` minus the operational payload fields.
    Specifically, ``step.message`` and ``step.variables`` are NEVER written --
    they hold the concrete attack strings. Downstream, the genetic engine owns
    payload materialisation; the G-058 orchestrator only needs metadata plus a
    synthetic template payload (built by ``_synthesize_payload`` in
    ``run_g058_campaign.py``).

Usage:
    python -m backend.tools.export_scenarios_metadata
    python -m backend.tools.export_scenarios_metadata --output /tmp/scen.json
    python -m backend.tools.export_scenarios_metadata --stdout --limit 3
"""
from __future__ import annotations

import argparse
import json
import logging
import sys
from datetime import date
from pathlib import Path
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

# Default output path: backend/red_team/scenarios_metadata.json
_DEFAULT_OUTPUT = (
    Path(__file__).resolve().parents[1] / "red_team" / "scenarios_metadata.json"
)

# Surgical-category keyword map applied to the clinical_context string.
# Order matters: first match wins.
_CATEGORY_KEYWORDS: List[tuple[tuple[str, ...], str]] = [
    (("cholecystectomy", "cholecyst", "gallbladder"), "cholecystectomy_laparoscopic"),
    (("nephrectomy", "renal", "kidney"), "nephrectomy_robotic"),
    (("prostatectomy", "prostate"), "prostatectomy_radical"),
    (("colectomy", "sigmoid", "colon"), "colectomie_sigmoidienne"),
    (("thoracotomy", "thoracic", "lung", "pulmonary"), "chirurgie_thoracique"),
    (("cardiac", "cardio", "mitral", "valve", "heart"), "cardiochirurgie_mini_invasive"),
    (("hepatic", "liver", "parenchymal"), "chirurgie_hepatique"),
    (("vascular", "ligation", "clip"), "chirurgie_vasculaire"),
]

# Surgical-phase keyword map applied to clinical_context + step names.
_PHASE_KEYWORDS: List[tuple[tuple[str, ...], str]] = [
    (("pre-op", "standby", "consultation", "nominal"), "pre-op"),
    (("dissection", "dissect"), "dissection"),
    (("clipping", "clip tension", "clip half"), "clipping"),
    (("ligation", "ligature"), "ligation"),
    (("closure", "suture", "closing"), "closure"),
]


def _categorize(clinical_context: str, scenario_id: str) -> str:
    """Infer a surgical category from the clinical context string.

    Args:
        clinical_context: free-text clinical context of the scenario.
        scenario_id: scenario id, used as a secondary signal.

    Returns:
        A category slug, or "generic_surgical" if no keyword matches.
    """
    haystack = f"{clinical_context} {scenario_id}".lower()
    for keywords, category in _CATEGORY_KEYWORDS:
        if any(kw in haystack for kw in keywords):
            return category
    return "generic_surgical"


def _infer_phase(clinical_context: str, step_names: List[str]) -> str:
    """Infer the surgical phase from the clinical context and step names.

    Args:
        clinical_context: free-text clinical context.
        step_names: list of step name strings.

    Returns:
        A phase slug, or "dissection" as the safe default (most common phase).
    """
    haystack = f"{clinical_context} {' '.join(step_names)}".lower()
    for keywords, phase in _PHASE_KEYWORDS:
        if any(kw in haystack for kw in keywords):
            return phase
    return "dissection"


def _scenario_to_metadata(scenario: Any) -> Dict[str, Any]:
    """Convert a Scenario object to a sanitized metadata dict.

    Only safe fields are extracted. ``step.message`` and ``step.variables`` are
    deliberately excluded.

    Args:
        scenario: a Scenario object from ``scenarios.get_all_scenarios()``.

    Returns:
        A JSON-serialisable metadata dict.
    """
    steps_meta: List[Dict[str, Any]] = []
    step_names: List[str] = []
    for step in getattr(scenario, "steps", []):
        name = getattr(step, "name", "")
        step_names.append(name)
        steps_meta.append(
            {
                "name": name,
                "attack_type": getattr(step, "attack_type", ""),
                "objective": getattr(step, "objective", ""),
                "chain_id": getattr(step, "chain_id", ""),
            }
        )

    clinical_context = getattr(scenario, "clinical_context", "") or ""
    scenario_id = getattr(scenario, "id", "")
    return {
        "id": scenario_id,
        "name": getattr(scenario, "name", ""),
        "clinical_context": clinical_context,
        "expected_impact": getattr(scenario, "expected_impact", ""),
        "mitre_ttps": list(getattr(scenario, "mitre_ttps", []) or []),
        "scenario_category": _categorize(clinical_context, scenario_id),
        "phase": _infer_phase(clinical_context, step_names),
        "steps": steps_meta,
    }


def export(output_path: Path, limit: int | None = None) -> Dict[str, Any]:
    """Build the sanitized metadata document and optionally write it.

    Args:
        output_path: file path to write the JSON document to.
        limit: if set, export only the first ``limit`` scenarios (debug).

    Returns:
        The metadata document as a dict.

    Raises:
        ImportError: if ``scenarios`` cannot be imported (run from backend/).
    """
    try:
        from scenarios import get_all_scenarios
    except ImportError as exc:  # pragma: no cover - environment guard
        raise ImportError(
            "Cannot import 'scenarios'. Run from the backend/ directory or set "
            "PYTHONPATH to include backend/."
        ) from exc

    scenarios = list(get_all_scenarios())
    if limit is not None:
        scenarios = scenarios[:limit]

    scenarios_meta = [_scenario_to_metadata(s) for s in scenarios]

    document: Dict[str, Any] = {
        "_meta": {
            "description": (
                "Sanitized AEGIS surgical-medical scenarios for G-058 SC-2. "
                "Metadata-ONLY: step.message and step.variables are NEVER "
                "materialised here (operational attack payloads). Synthetic "
                "payloads are produced by synthesize_payload in "
                "g058/loaders.py; real payloads by the genetic engine."
            ),
            "source": "backend/scenarios.py via get_all_scenarios()",
            "generator": "backend/tools/export_scenarios_metadata.py",
            "generated_on": date.today().isoformat(),
            "n_scenarios": len(scenarios_meta),
            "status": "GENERATED",
            "claude_md_compliance": (
                "Content filter safety: step.message and step.variables omitted."
            ),
        },
        "scenarios": scenarios_meta,
    }

    output_path.write_text(
        json.dumps(document, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    logger.info(
        "Exported %d scenarios to %s", len(scenarios_meta), output_path
    )
    return document


def main() -> int:
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Export sanitized AEGIS scenario metadata for G-058 SC-2."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=_DEFAULT_OUTPUT,
        help=f"Output JSON path (default: {_DEFAULT_OUTPUT}).",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Export only the first N scenarios (debug).",
    )
    parser.add_argument(
        "--stdout",
        action="store_true",
        help="Also print the document to stdout.",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
    )

    document = export(args.output, limit=args.limit)

    if args.stdout:
        print(json.dumps(document, indent=2, ensure_ascii=False))

    n = document["_meta"]["n_scenarios"]
    print(f"OK: {n} scenarios exported to {args.output}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
