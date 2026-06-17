"""Single source of truth for all 52 attack templates.

This module is the CANONICAL source for attack templates.
Templates are loaded from backend/prompts/*.json files.
Help documentation is in backend/prompts/*.md files (one per template).
The /api/redteam/catalog endpoint serves from this module.

To add a new template:
  1. Create a new .json file in backend/prompts/ (follow the NN-name.json pattern)
  2. Create a matching .md help file in backend/prompts/ (same prefix)
  3. The template will be auto-loaded by this module
  4. Update all READMEs (see CLAUDE.md checklist)

Reference: Liu et al. (2023), arXiv:2306.05499
"""

import json
import pathlib
from functools import reduce
from typing import Any


_PROMPTS_DIR = pathlib.Path(__file__).parent / "prompts"

# Detection profile patterns (literature: Liu et al. 2023, 6 canonical patterns)
DETECTION_PATTERNS = ["caps", "negation", "token_fictif", "tool_direct", "coercion", "xml_fictif"]


def _load_templates_from_json() -> list[dict[str, Any]]:
    """Load all templates from backend/prompts/*.json files, sorted by filename.

    Each template may contain a 'versions' array with evolved variants.
    The root template fields (template, variables) represent V1 (baseline).
    versions[] entries contain evolved payloads with their own detection_profile.
    """
    templates: list[dict[str, Any]] = []
    if not _PROMPTS_DIR.exists():
        return templates
    for json_file in sorted(_PROMPTS_DIR.glob("*.json")):
        if json_file.name in ("retex_patterns.json", "dim_config.json", "detection_baseline.json", "models_config.json"):
            continue  # config files, not templates
        with open(json_file, encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, dict):
            continue  # skip non-template JSON files
        templates.append({
            "name": data.get("name", json_file.stem),
            "category": data.get("category", "injection"),
            "chain_id": data.get("chain_id"),
            "template": data.get("template", ""),
            "variables": data.get("variables", {}),
            "_source": json_file.name,
            "_help": data.get("help", ""),
            "_id": data.get("id", json_file.stem),
            "_target_delta": data.get("target_delta"),
            "_conjecture": data.get("conjecture"),
            "_versions": data.get("versions", []),
            "_detection_profile": data.get("detection_profile", {}),
            "_taxonomy": data.get("taxonomy", {"primary": None, "secondary": []}),
        })
    # Append the Custom (empty) placeholder
    templates.append({
        "name": "Custom (empty)",
        "category": "injection",
        "template": "",
        "variables": {},
    })
    return templates


ATTACK_TEMPLATES: list[dict[str, Any]] = _load_templates_from_json()


def _validate_taxonomy_references():
    """Validate that all taxonomy technique IDs in templates exist in the reference."""
    import sys
    try:
        from taxonomy import get_all_technique_ids
        valid_ids = set(get_all_technique_ids())
    except ImportError:
        return  # taxonomy module not available, skip validation

    for t in ATTACK_TEMPLATES:
        tax = t.get("_taxonomy") or {}
        primary = tax.get("primary")
        if primary and primary not in valid_ids:
            print("WARNING: template '{}' has unknown taxonomy.primary: '{}'".format(
                t.get("_id", "?"), primary), file=sys.stderr)
        for sec in tax.get("secondary", []):
            if sec not in valid_ids:
                print("WARNING: template '{}' has unknown taxonomy.secondary: '{}'".format(
                    t.get("_id", "?"), sec), file=sys.stderr)

_validate_taxonomy_references()


def get_catalog_by_category() -> dict[str, list[str]]:
    """Return templates grouped by category (legacy format for /api/redteam/catalog)."""
    catalog: dict[str, list[str]] = {}
    for t in ATTACK_TEMPLATES:
        if not t["template"]:  # skip empty Custom
            continue
        cat = t["category"]
        if cat not in catalog:
            catalog[cat] = []
        # Resolve variables
        msg = t["template"]
        for k, v in t.get("variables", {}).items():
            msg = msg.replace("{{" + k + "}}", str(v))
        catalog[cat].append(msg)
    return catalog


def get_templates_full() -> list[dict[str, Any]]:
    """Return all templates with metadata, exposing internal _id/_help/_versions as public fields."""
    result = []
    for t in ATTACK_TEMPLATES:
        if not t.get("template") and t.get("name") != "Custom (empty)":
            continue
        entry = {
            "id": t.get("_id", ""),
            "name": t.get("name", ""),
            "category": t.get("category", "injection"),
            "chain_id": t.get("chain_id"),
            "template": t.get("template", ""),
            "variables": t.get("variables", {}),
            "help": t.get("_help", ""),
            "target_delta": t.get("_target_delta"),
            "conjecture": t.get("_conjecture"),
            "versions": t.get("_versions", []),
            "detection_profile": t.get("_detection_profile", {}),
            "taxonomy": t.get("_taxonomy", {"primary": None, "secondary": []}),
        }
        result.append(entry)
    return result


def get_template_help(template_id: str) -> str:
    """Return the MD help content for a template by ID."""
    for t in ATTACK_TEMPLATES:
        if t.get("_id") == template_id and t.get("_help"):
            help_path = _PROMPTS_DIR / t["_help"]
            if help_path.exists():
                return help_path.read_text(encoding="utf-8")
    return ""


def get_all_help() -> dict[str, str]:
    """Return all help content keyed by template ID."""
    result: dict[str, str] = {}
    for t in ATTACK_TEMPLATES:
        tid = t.get("_id")
        if tid and t.get("_help"):
            help_path = _PROMPTS_DIR / t["_help"]
            if help_path.exists():
                result[tid] = help_path.read_text(encoding="utf-8")
    return result


def get_template_by_id(template_id: str) -> dict[str, Any] | None:
    """Find a template dict by its _id field."""
    for t in ATTACK_TEMPLATES:
        if t.get("_id") == template_id:
            return t
    return None


def get_template_help_info(template_id: str) -> tuple[str, str] | None:
    """Return (content, filename) for the help MD of a template, or None."""
    t = get_template_by_id(template_id)
    if not t or not t.get("_help"):
        return None
    help_path = _PROMPTS_DIR / t["_help"]
    if not help_path.exists():
        return None
    return help_path.read_text(encoding="utf-8"), t["_help"]


def save_template_help(template_id: str, content: str) -> tuple[str, int] | None:
    """Write MD help content for a template. Returns (filename, chars) or None."""
    t = get_template_by_id(template_id)
    if not t or not t.get("_help"):
        return None
    help_path = _PROMPTS_DIR / t["_help"]
    help_path.write_text(content, encoding="utf-8")
    return t["_help"], len(content)


def update_template_json(template_id: str, updates: dict[str, Any]) -> bool:
    """Update fields in the JSON file for a template. Returns True on success."""
    t = get_template_by_id(template_id)
    if not t or not t.get("_source"):
        return False
    json_path = _PROMPTS_DIR / t["_source"]
    if not json_path.exists():
        return False
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)
    allowed = {"name", "category", "chain_id", "target_delta", "conjecture", "template", "variables", "taxonomy"}
    for k, v in updates.items():
        if k in allowed:
            data[k] = v
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    # Update in-memory cache
    for k, v in updates.items():
        if k == "name":
            t["name"] = v
        elif k == "category":
            t["category"] = v
        elif k == "chain_id":
            t["chain_id"] = v
        elif k == "template":
            t["template"] = v
        elif k == "variables":
            t["variables"] = v
        elif k == "target_delta":
            t["_target_delta"] = v
        elif k == "conjecture":
            t["_conjecture"] = v
        elif k == "taxonomy":
            t["_taxonomy"] = v
    return True


def create_template(data: dict[str, Any], help_content: str = "") -> dict[str, Any]:
    """Create a new template (JSON + MD files). Returns info dict."""
    # Find next number
    existing = sorted(_PROMPTS_DIR.glob("*.json"))
    # Exclude config files (retex_patterns, dim_config)
    numbered = [f for f in existing if f.stem[:2].isdigit()]
    if numbered:
        last_num = int(numbered[-1].stem.split("-")[0])
    else:
        last_num = 0
    next_num = last_num + 1
    slug = data.get("id", "custom").replace(" ", "-").lower()
    json_name = str(next_num).zfill(2) + "-" + slug + ".json"
    md_name = str(next_num).zfill(2) + "-" + slug + ".md"

    json_payload = {
        "id": data.get("id", slug),
        "name": data.get("name", slug),
        "category": data.get("category", "injection"),
        "chain_id": data.get("chain_id"),
        "target_delta": data.get("target_delta", "delta1"),
        "conjecture": data.get("conjecture"),
        "template": data.get("template", ""),
        "variables": data.get("variables", {}),
        "help": md_name,
        "taxonomy": data.get("taxonomy", {"primary": None, "secondary": []}),
    }
    json_path = _PROMPTS_DIR / json_name
    md_path = _PROMPTS_DIR / md_name
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_payload, f, indent=2, ensure_ascii=False)
    md_path.write_text(help_content or "# " + json_payload["name"] + "\n", encoding="utf-8")

    # Add to in-memory list (before the Custom placeholder)
    new_entry = {
        "name": json_payload["name"],
        "category": json_payload["category"],
        "chain_id": json_payload["chain_id"],
        "template": json_payload["template"],
        "variables": json_payload["variables"],
        "_source": json_name,
        "_help": md_name,
        "_id": json_payload["id"],
        "_target_delta": json_payload["target_delta"],
        "_conjecture": json_payload["conjecture"],
        "_taxonomy": json_payload["taxonomy"],
    }
    # Insert before last element (Custom placeholder)
    if ATTACK_TEMPLATES and not ATTACK_TEMPLATES[-1].get("template"):
        ATTACK_TEMPLATES.insert(len(ATTACK_TEMPLATES) - 1, new_entry)
    else:
        ATTACK_TEMPLATES.append(new_entry)

    return {"status": "created", "id": json_payload["id"], "files": [json_name, md_name]}


def delete_template(template_id: str) -> bool:
    """Delete both JSON and MD files for a template. Returns True on success."""
    t = get_template_by_id(template_id)
    if not t or not t.get("_source"):
        return False
    json_path = _PROMPTS_DIR / t["_source"]
    if json_path.exists():
        json_path.unlink()
    if t.get("_help"):
        md_path = _PROMPTS_DIR / t["_help"]
        if md_path.exists():
            md_path.unlink()
    ATTACK_TEMPLATES.remove(t)
    return True


def _p_detect_cumulative(profile: dict[str, float]) -> float:
    """Compute cumulative detection probability: 1 - product(1 - p_i).

    Reference: Liu et al. (2023), arXiv:2306.05499 — composite detection model.
    """
    if not profile:
        return 0.0
    return 1.0 - reduce(lambda acc, p: acc * (1.0 - p), profile.values(), 1.0)


def get_template_versions(template_id: str) -> dict[str, Any] | None:
    """Return the baseline template and its versions array.

    Returns {"parent": {baseline fields}, "versions": [...]} or None if not found.
    """
    t = get_template_by_id(template_id)
    if t is None:
        return None
    parent = {
        "id": t.get("_id"),
        "name": t.get("name"),
        "category": t.get("category"),
        "template": t.get("template"),
        "variables": t.get("variables", {}),
        "detection_profile": t.get("_detection_profile", {}),
        "p_detect": _p_detect_cumulative(t.get("_detection_profile", {})),
    }
    versions = []
    for i, v in enumerate(t.get("_versions", [])):
        versions.append({
            "index": i,
            "version_label": v.get("version_label", "V" + str(i + 2)),
            "template": v.get("template", ""),
            "variables": v.get("variables", {}),
            "detection_profile": v.get("detection_profile", {}),
            "p_detect": _p_detect_cumulative(v.get("detection_profile", {})),
        })
    return {"parent": parent, "versions": versions}


def create_template_version(template_id: str, data: dict[str, Any]) -> dict[str, Any] | None:
    """Add a new version entry to an existing template's versions[] array.

    Persists to the JSON file on disk and updates the in-memory cache.
    Returns {"status": "created", "version": N, "version_label": "..."} or None.
    """
    t = get_template_by_id(template_id)
    if t is None or not t.get("_source"):
        return None

    json_path = _PROMPTS_DIR / t["_source"]
    if not json_path.exists():
        return None

    with open(json_path, encoding="utf-8") as f:
        file_data = json.load(f)

    existing_versions = file_data.get("versions", [])
    next_version_num = len(existing_versions) + 2  # V1 = baseline, V2 = first version

    version_entry = {
        "version_label": data.get("version_label", "V" + str(next_version_num)),
        "template": data.get("template", t.get("template", "")),
        "variables": data.get("variables", t.get("variables", {})),
        "detection_profile": data.get("detection_profile", {}),
    }

    existing_versions.append(version_entry)
    file_data["versions"] = existing_versions

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(file_data, f, indent=2, ensure_ascii=False)

    # Update in-memory cache
    t["_versions"] = existing_versions

    return {
        "status": "created",
        "id": template_id,
        "version": next_version_num,
        "version_label": version_entry["version_label"],
    }


def delete_template_version(template_id: str, version_index: int) -> bool:
    """Remove a version entry by index from a template's versions[] array.

    Persists to disk and updates in-memory cache. Returns True on success.
    """
    t = get_template_by_id(template_id)
    if t is None or not t.get("_source"):
        return False

    versions = t.get("_versions", [])
    if not (0 <= version_index < len(versions)):
        return False

    json_path = _PROMPTS_DIR / t["_source"]
    if not json_path.exists():
        return False

    with open(json_path, encoding="utf-8") as f:
        file_data = json.load(f)

    file_versions = file_data.get("versions", [])
    if not (0 <= version_index < len(file_versions)):
        return False

    file_versions.pop(version_index)
    file_data["versions"] = file_versions

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(file_data, f, indent=2, ensure_ascii=False)

    # Update in-memory cache
    t["_versions"] = file_versions
    return True


def get_detection_comparison(template_id: str, version_index: int) -> dict[str, Any] | None:
    """Compare detection profiles between baseline (V1) and a specific version.

    Returns a dict with baseline/version profiles and a per-pattern comparison table.
    """
    t = get_template_by_id(template_id)
    if t is None:
        return None

    versions = t.get("_versions", [])
    if not (0 <= version_index < len(versions)):
        return None

    baseline_profile = t.get("_detection_profile", {})
    version_entry = versions[version_index]
    version_profile = version_entry.get("detection_profile", {})

    # Build per-pattern comparison
    all_patterns = sorted(set(list(baseline_profile.keys()) + list(version_profile.keys()) + DETECTION_PATTERNS))
    comparison = []
    for pattern in all_patterns:
        p_baseline = baseline_profile.get(pattern, 0.0)
        p_evolved = version_profile.get(pattern, 0.0)
        comparison.append({
            "pattern": pattern,
            "p_baseline": round(p_baseline, 4),
            "p_evolved": round(p_evolved, 4),
            "delta": round(p_evolved - p_baseline, 4),
        })

    return {
        "baseline": {
            "id": t.get("_id"),
            "name": t.get("name"),
            "detection_profile": baseline_profile,
            "p_detect_cumulative": round(_p_detect_cumulative(baseline_profile), 6),
        },
        "version": {
            "index": version_index,
            "version_label": version_entry.get("version_label", ""),
            "detection_profile": version_profile,
            "p_detect_cumulative": round(_p_detect_cumulative(version_profile), 6),
        },
        "detection_comparison": comparison,
    }


def get_config_file(name: str) -> Any:
    """Load a JSON config file from prompts/ directory."""
    config_path = _PROMPTS_DIR / name
    if not config_path.exists():
        return None
    with open(config_path, encoding="utf-8") as f:
        return json.load(f)
