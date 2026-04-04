"""Defense Taxonomy loader and coverage computation.

70 techniques across 4 classes (PREV, DETECT, RESP, MEAS).
40 implemented (production/partial) + 4 proposed (RUN-003) = 44 active.

References:
- Liu et al. 2024 (USENIX Security) — Formalizing PI attacks and defenses
- Hackett et al. 2025 (arXiv:2504.11168) — Bypassing LLM Guardrails
- Chen et al. 2024 — StruQ: Structured queries defense
- Piet et al. 2024 — Jatmo: Task-specific finetuning defense
- P047 Chen et al. ACL 2025 — Attack inversion defense (δ² DETECT)
- P051 Nguyen et al. arXiv 2026 — Linguistic 4D jailbreak detector (δ² DETECT)
- P056 Kariyappa & Suh, NVIDIA 2025 — AIR instruction hierarchy (δ¹ PREV)
- P057 Zverev et al. ASIDE 2025 — Orthogonal separation (δ⁰ PREV)
"""
import json
import pathlib
from functools import lru_cache
from typing import Any

_TAXONOMY_DIR = pathlib.Path(__file__).parent
_DEFENSE_FILE = _TAXONOMY_DIR / "defense_taxonomy_2025.json"
_BENCHMARK_FILE = _TAXONOMY_DIR / "guardrail_benchmark.json"


@lru_cache(maxsize=1)
def load_defense_taxonomy() -> dict:
    with open(_DEFENSE_FILE, encoding="utf-8") as f:
        return json.load(f)


@lru_cache(maxsize=1)
def load_guardrail_benchmark() -> dict:
    with open(_BENCHMARK_FILE, encoding="utf-8") as f:
        return json.load(f)


@lru_cache(maxsize=1)
def get_defense_flat_index() -> dict[str, dict[str, str]]:
    """Flat lookup: {technique_id: {class_id, class_label, category_id, ..., aegis_impl, reference}}"""
    taxonomy = load_defense_taxonomy()
    index = {}
    for cls in taxonomy["classes"]:
        for cat in cls["categories"]:
            for tech in cat.get("techniques", []):
                index[tech["id"]] = {
                    "class_id": cls["id"],
                    "class_label": cls["label"],
                    "category_id": cat["id"],
                    "category_label": cat["label"],
                    "subcategory_id": "",
                    "subcategory_label": "",
                    "technique_id": tech["id"],
                    "technique_label": tech["label"],
                    "aegis_impl": tech.get("aegis_impl", "planned"),
                    "reference": tech.get("reference", ""),
                }
            for sub in cat.get("subcategories", []):
                for tech in sub.get("techniques", []):
                    index[tech["id"]] = {
                        "class_id": cls["id"],
                        "class_label": cls["label"],
                        "category_id": cat["id"],
                        "category_label": cat["label"],
                        "subcategory_id": sub["id"],
                        "subcategory_label": sub["label"],
                        "technique_id": tech["id"],
                        "technique_label": tech["label"],
                        "aegis_impl": tech.get("aegis_impl", "planned"),
                        "reference": tech.get("reference", ""),
                    }
    return index


def compute_defense_coverage() -> dict[str, Any]:
    """Compute defense implementation coverage."""
    flat = get_defense_flat_index()
    all_ids = set(flat.keys())

    implemented = {tid for tid, info in flat.items() if info["aegis_impl"] in ("production", "partial")}
    production = {tid for tid, info in flat.items() if info["aegis_impl"] == "production"}
    partial = {tid for tid, info in flat.items() if info["aegis_impl"] == "partial"}
    planned = {tid for tid, info in flat.items() if info["aegis_impl"] == "planned"}
    external = {tid for tid, info in flat.items() if info["aegis_impl"] == "external"}
    proposed = {tid for tid, info in flat.items() if info["aegis_impl"] == "proposed"}

    class_stats = {}
    for tid, info in flat.items():
        cid = info["class_id"]
        if cid not in class_stats:
            class_stats[cid] = {"class_id": cid, "class_label": info["class_label"], "total": 0, "production": 0, "partial": 0, "planned": 0, "external": 0, "proposed": 0}
        class_stats[cid]["total"] += 1
        impl = info["aegis_impl"]
        if impl in class_stats[cid]:
            class_stats[cid][impl] += 1

    by_class = []
    for cs in sorted(class_stats.values(), key=lambda x: x["class_id"]):
        cs["implemented"] = cs["production"] + cs["partial"]
        cs["percentage"] = round(cs["implemented"] / cs["total"] * 100, 1) if cs["total"] else 0
        by_class.append(cs)

    return {
        "total": len(all_ids),
        "production": len(production),
        "partial": len(partial),
        "planned": len(planned),
        "external": len(external),
        "proposed": len(proposed),
        "implemented": len(implemented),
        "percentage": round(len(implemented) / len(all_ids) * 100, 1) if all_ids else 0,
        "by_class": by_class,
        "production_techniques": sorted(production),
        "partial_techniques": sorted(partial),
        "planned_techniques": sorted(planned),
        "proposed_techniques": sorted(proposed),
    }
