"""CrowdStrike Prompt Injection Taxonomy (2025-11-01) — loader and lookup module.

Provides hierarchical classification for AEGIS attack templates.
Reference: CrowdStrike Taxonomy Poster, 2025-11-01
"""
import json
import pathlib
from functools import lru_cache
from typing import Any

_TAXONOMY_DIR = pathlib.Path(__file__).parent
_TAXONOMY_FILE = _TAXONOMY_DIR / "crowdstrike_2025.json"


@lru_cache(maxsize=1)
def load_taxonomy() -> dict:
    """Load the full taxonomy tree from JSON."""
    with open(_TAXONOMY_FILE, encoding="utf-8") as f:
        return json.load(f)


@lru_cache(maxsize=1)
def get_flat_index() -> dict[str, dict[str, str]]:
    """Return a flat lookup: {technique_id: {class_id, class_label, category_id, category_label, subcategory_id, subcategory_label, technique_id, technique_label}}.

    Subcategory fields are empty strings when the technique is directly under a category.
    """
    taxonomy = load_taxonomy()
    index: dict[str, dict[str, str]] = {}
    for cls in taxonomy["classes"]:
        for cat in cls["categories"]:
            # Techniques directly under category (no subcategory)
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
                }
            # Techniques under subcategories
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
                    }
    return index


def get_technique_path(technique_id: str) -> dict[str, str] | None:
    """Return the full hierarchical path for a technique, or None if not found."""
    return get_flat_index().get(technique_id)


def get_all_technique_ids() -> list[str]:
    """Return all 95 technique IDs."""
    return list(get_flat_index().keys())


def compute_coverage(templates: list[dict[str, Any]]) -> dict[str, Any]:
    """Compute taxonomy coverage from loaded templates.

    Each template should have a 'taxonomy' field: {"primary": str|None, "secondary": [str]}
    Also accepts the internal format with '_taxonomy' prefix.

    Returns:
        {
            "total": 95,
            "covered": int,
            "percentage": float,
            "by_class": [
                {"class_id": str, "class_label": str, "total": int, "covered": int, "percentage": float, "gaps": [str]}
            ],
            "covered_techniques": [str],
            "gap_techniques": [str]
        }
    """
    flat = get_flat_index()
    all_ids = set(flat.keys())

    # Collect covered technique IDs from templates
    covered = set()
    for t in templates:
        tax = t.get("taxonomy") or t.get("_taxonomy") or {}
        primary = tax.get("primary")
        secondary = tax.get("secondary", [])
        if primary:
            covered.add(primary)
        for s in secondary:
            covered.add(s)

    # Only count valid technique IDs
    covered = covered & all_ids
    gaps = all_ids - covered

    # Group by class
    class_stats: dict[str, dict] = {}
    for tech_id, path in flat.items():
        cid = path["class_id"]
        if cid not in class_stats:
            class_stats[cid] = {"class_id": cid, "class_label": path["class_label"], "total": 0, "covered": 0, "gaps": []}
        class_stats[cid]["total"] += 1
        if tech_id in covered:
            class_stats[cid]["covered"] += 1
        else:
            class_stats[cid]["gaps"].append(tech_id)

    by_class = []
    for cs in class_stats.values():
        cs["percentage"] = round(cs["covered"] / cs["total"] * 100, 1) if cs["total"] else 0
        by_class.append(cs)
    by_class.sort(key=lambda x: x["class_id"])

    return {
        "total": len(all_ids),
        "covered": len(covered),
        "percentage": round(len(covered) / len(all_ids) * 100, 1) if all_ids else 0,
        "by_class": by_class,
        "covered_techniques": sorted(covered),
        "gap_techniques": sorted(gaps),
    }


def get_templates_by_tree(templates: list[dict[str, Any]]) -> dict:
    """Return the taxonomy tree with templates attached at technique leaves.

    Returns a deep copy of the taxonomy with an added 'templates' list at each technique node.
    Templates are placed under their primary technique.
    """
    import copy
    taxonomy = copy.deepcopy(load_taxonomy())

    # Build a quick lookup: technique_id -> list of template summaries
    tech_templates: dict[str, list[dict]] = {}
    for t in templates:
        tax = t.get("taxonomy") or t.get("_taxonomy") or {}
        primary = tax.get("primary")
        if primary:
            if primary not in tech_templates:
                tech_templates[primary] = []
            tech_templates[primary].append({
                "id": t.get("id") or t.get("_id", ""),
                "name": t.get("name", ""),
                "category": t.get("category", ""),
            })

    # Walk tree and attach
    for cls in taxonomy["classes"]:
        cls_count = 0
        for cat in cls["categories"]:
            cat_count = 0
            for tech in cat.get("techniques", []):
                tech["templates"] = tech_templates.get(tech["id"], [])
                cat_count += len(tech["templates"])
            for sub in cat.get("subcategories", []):
                sub_count = 0
                for tech in sub.get("techniques", []):
                    tech["templates"] = tech_templates.get(tech["id"], [])
                    sub_count += len(tech["templates"])
                sub["template_count"] = sub_count
                cat_count += sub_count
            cat["template_count"] = cat_count
            cls_count += cat_count
        cls["template_count"] = cls_count

    return taxonomy
