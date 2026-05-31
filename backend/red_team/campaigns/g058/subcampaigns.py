"""The four G-058 sub-campaign runners (SC-1, SC-2, SC-3, SC-4)."""
from __future__ import annotations

import json
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List

from backend.red_team.campaigns.g058.genetic import genetic_optimize
from backend.red_team.campaigns.g058.manifest import (
    CampaignManifest,
    git_rev,
    sha256_of,
)
from backend.red_team.campaigns.g058.registry import (
    ADAPTIVE_FRAMEWORKS,
    COMPOSITIONS,
    all_adapters,
)
from backend.red_team.framework_adapters import EvalResult
from backend.red_team.framework_adapters.aegis_adapter import AEGISAdapter


def run_sc1(
    templates: Iterable[Dict[str, Any]],
    spec: Dict[str, Any],
    n_trials: int,
    output_dir: Path,
    dry_run: bool,
) -> CampaignManifest:
    """Run sub-campaign SC-1 : 8 frameworks x N generic templates x N trials.

    Args:
        templates: iterable of dicts {id, prompt, malicious_response}.
        spec: AllowedOutputSpec dict shared across frameworks.
        n_trials: trials per (framework, template) pair.
        output_dir: where to write JSONL files.
        dry_run: if True, do not write files.

    Returns:
        Filled-in CampaignManifest.
    """
    template_list = list(templates)
    adapters = all_adapters()
    started_at = datetime.now(timezone.utc).isoformat()
    output_files: List[str] = []
    total = 0

    if not dry_run:
        output_dir.mkdir(parents=True, exist_ok=True)

    for adapter in adapters:
        adapter.setup(spec)
        for tpl in template_list:
            tpl_id = tpl["id"]
            malicious = tpl["malicious_response"]
            prompt = tpl.get("prompt", "")
            file_path = output_dir / f"SC1_{adapter.name}_{tpl_id}.jsonl"
            lines: List[str] = []
            for trial in range(n_trials):
                r = adapter.evaluate(prompt, malicious)
                lines.append(
                    json.dumps(
                        {
                            "trial": trial,
                            "framework": adapter.name,
                            "framework_version": adapter.version,
                            "template_id": tpl_id,
                            "passed": r.passed,
                            "violation_codes": r.violation_codes,
                            "latency_ms": r.latency_ms,
                            "metadata": r.metadata,
                        }
                    )
                )
                total += 1
            if not dry_run:
                file_path.write_text("\n".join(lines), encoding="utf-8")
                output_files.append(str(file_path))
        adapter.teardown()

    return _build_manifest(
        subcampaign="SC1",
        started_at=started_at,
        n_frameworks=len(adapters),
        n_templates=len(template_list),
        n_trials_per_template=n_trials,
        total_planned=len(adapters) * len(template_list) * n_trials,
        total_completed=total,
        output_files=output_files,
        spec=spec,
        dry_run=dry_run,
        output_dir=output_dir,
    )


def run_sc2(
    scenarios: Iterable[Dict[str, Any]],
    spec: Dict[str, Any],
    n_trials: int,
    output_dir: Path,
    dry_run: bool,
) -> CampaignManifest:
    """Run sub-campaign SC-2 : 8 frameworks x N medical scenarios x N trials."""
    scenario_list = list(scenarios)
    adapters = all_adapters()
    started_at = datetime.now(timezone.utc).isoformat()
    output_files: List[str] = []
    total = 0

    if not dry_run:
        output_dir.mkdir(parents=True, exist_ok=True)

    for adapter in adapters:
        adapter.setup(spec)
        for sc in scenario_list:
            sc_id = sc["id"]
            malicious = sc["malicious_response"]
            prompt = sc.get("prompt", "")
            file_path = output_dir / f"SC2_{adapter.name}_{sc_id}.jsonl"
            lines: List[str] = []
            for trial in range(n_trials):
                r = adapter.evaluate(prompt, malicious)
                lines.append(
                    json.dumps(
                        {
                            "trial": trial,
                            "framework": adapter.name,
                            "framework_version": adapter.version,
                            "scenario_id": sc_id,
                            "scenario_category": sc.get("scenario_category", "unknown"),
                            "passed": r.passed,
                            "violation_codes": r.violation_codes,
                            "latency_ms": r.latency_ms,
                            "metadata": r.metadata,
                        }
                    )
                )
                total += 1
            if not dry_run:
                file_path.write_text("\n".join(lines), encoding="utf-8")
                output_files.append(str(file_path))
        adapter.teardown()

    return _build_manifest(
        subcampaign="SC2",
        started_at=started_at,
        n_frameworks=len(adapters),
        n_templates=len(scenario_list),
        n_trials_per_template=n_trials,
        total_planned=len(adapters) * len(scenario_list) * n_trials,
        total_completed=total,
        output_files=output_files,
        spec=spec,
        dry_run=dry_run,
        output_dir=output_dir,
    )


def run_sc3(
    seed_templates: Iterable[Dict[str, Any]],
    spec: Dict[str, Any],
    pop_size: int,
    n_generations: int,
    output_dir: Path,
    dry_run: bool,
    rng_seed: int = 42,
) -> CampaignManifest:
    """Run sub-campaign SC-3 : 5 adaptive frameworks x N templates x genetic search.

    For each (framework, template) pair, runs a genetic optimization to find the
    most evasive payload variant. ``total_trials_completed`` counts GA evaluations.
    """
    template_list = list(seed_templates)
    started_at = datetime.now(timezone.utc).isoformat()
    output_files: List[str] = []
    total = 0

    if not dry_run:
        output_dir.mkdir(parents=True, exist_ok=True)

    for fw_name, fw_cls in ADAPTIVE_FRAMEWORKS:
        for tpl in template_list:
            tpl_id = tpl["id"]
            prompt = tpl.get("prompt", "")
            seed = tpl["malicious_response"]
            adapter = fw_cls()
            result = genetic_optimize(
                seed=seed,
                adapter=adapter,
                spec=spec,
                prompt=prompt,
                pop_size=pop_size,
                n_generations=n_generations,
                seed_rng=rng_seed,
            )
            evals = pop_size * (n_generations + 1)
            total += evals
            file_path = output_dir / f"SC3_{fw_name}_{tpl_id}.jsonl"
            line = json.dumps(
                {
                    "framework": fw_name,
                    "template_id": tpl_id,
                    "rng_seed": rng_seed,
                    "evaluations": evals,
                    "best_fitness": result["best_fitness"],
                    "fitness_history": result["fitness_history"],
                    "operators_used": result["operators_used"],
                    "pop_size": result["pop_size"],
                    "n_generations": result["n_generations"],
                }
            )
            if not dry_run:
                file_path.write_text(line, encoding="utf-8")
                output_files.append(str(file_path))

    return _build_manifest(
        subcampaign="SC3",
        started_at=started_at,
        n_frameworks=len(ADAPTIVE_FRAMEWORKS),
        n_templates=len(template_list),
        n_trials_per_template=pop_size * (n_generations + 1),
        total_planned=(
            len(ADAPTIVE_FRAMEWORKS)
            * len(template_list)
            * pop_size
            * (n_generations + 1)
        ),
        total_completed=total,
        output_files=output_files,
        spec=spec,
        dry_run=dry_run,
        output_dir=output_dir,
    )


def compose_evaluate(
    adapter_first: Any, adapter_second: Any, prompt: str, response: str
) -> EvalResult:
    """Compose two adapters with AND semantics.

    Both must accept (passed=True) for the composition to pass. Violation codes
    are prefixed with the framework that raised them.
    """
    r_first = adapter_first.evaluate(prompt, response)
    r_second = adapter_second.evaluate(prompt, response)
    passed = r_first.passed and r_second.passed
    codes = [f"{adapter_first.name}::{c}" for c in r_first.violation_codes] + [
        f"{adapter_second.name}::{c}" for c in r_second.violation_codes
    ]
    metadata = {
        "framework": f"{adapter_first.name}+{adapter_second.name}",
        "composition_kind": "AND",
        "first": r_first.metadata,
        "second": r_second.metadata,
    }
    return EvalResult(
        passed=passed,
        violation_codes=codes,
        latency_ms=r_first.latency_ms + r_second.latency_ms,
        metadata=metadata,
    )


def run_sc4(
    scenarios: Iterable[Dict[str, Any]],
    spec: Dict[str, Any],
    n_trials: int,
    output_dir: Path,
    dry_run: bool,
) -> CampaignManifest:
    """Run sub-campaign SC-4 : AEGIS composed with 3 generic frameworks.

    AND-semantics: a payload passes only if both stages accept it.
    """
    scenario_list = list(scenarios)
    started_at = datetime.now(timezone.utc).isoformat()
    output_files: List[str] = []
    total = 0

    if not dry_run:
        output_dir.mkdir(parents=True, exist_ok=True)

    for comp_name, generic_cls in COMPOSITIONS.items():
        generic = generic_cls()
        aegis = AEGISAdapter()
        generic.setup(spec)
        aegis.setup(spec)

        for sc in scenario_list:
            sc_id = sc["id"]
            malicious = sc["malicious_response"]
            prompt = sc.get("prompt", "")
            file_path = output_dir / f"SC4_{comp_name}_{sc_id}.jsonl"
            lines: List[str] = []
            for trial in range(n_trials):
                r = compose_evaluate(generic, aegis, prompt, malicious)
                lines.append(
                    json.dumps(
                        {
                            "trial": trial,
                            "composition": comp_name,
                            "scenario_id": sc_id,
                            "scenario_category": sc.get("scenario_category", "unknown"),
                            "passed": r.passed,
                            "violation_codes": r.violation_codes,
                            "latency_ms": r.latency_ms,
                            "metadata": r.metadata,
                        }
                    )
                )
                total += 1
            if not dry_run:
                file_path.write_text("\n".join(lines), encoding="utf-8")
                output_files.append(str(file_path))

        generic.teardown()
        aegis.teardown()

    return _build_manifest(
        subcampaign="SC4",
        started_at=started_at,
        n_frameworks=len(COMPOSITIONS),
        n_templates=len(scenario_list),
        n_trials_per_template=n_trials,
        total_planned=len(COMPOSITIONS) * len(scenario_list) * n_trials,
        total_completed=total,
        output_files=output_files,
        spec=spec,
        dry_run=dry_run,
        output_dir=output_dir,
    )


def _build_manifest(
    subcampaign: str,
    started_at: str,
    n_frameworks: int,
    n_templates: int,
    n_trials_per_template: int,
    total_planned: int,
    total_completed: int,
    output_files: List[str],
    spec: Dict[str, Any],
    dry_run: bool,
    output_dir: Path,
) -> CampaignManifest:
    """Assemble a CampaignManifest and, unless dry-run, write it to disk."""
    manifest = CampaignManifest(
        campaign_id="G058",
        subcampaign=subcampaign,
        started_at=started_at,
        finished_at=datetime.now(timezone.utc).isoformat(),
        git_rev=git_rev(),
        n_frameworks=n_frameworks,
        n_templates=n_templates,
        n_trials_per_template=n_trials_per_template,
        total_trials_planned=total_planned,
        total_trials_completed=total_completed,
        output_files=output_files,
        spec_sha256=sha256_of(spec),
        dry_run=dry_run,
    )
    if not dry_run:
        manifest_path = output_dir / f"manifest_{subcampaign}.json"
        manifest_path.write_text(
            json.dumps(asdict(manifest), indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
    return manifest
