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
from typing import Any


_PROMPTS_DIR = pathlib.Path(__file__).parent / "prompts"


def _load_templates_from_json() -> list[dict[str, Any]]:
    """Load all templates from backend/prompts/*.json files, sorted by filename."""
    templates: list[dict[str, Any]] = []
    if not _PROMPTS_DIR.exists():
        return templates
    for json_file in sorted(_PROMPTS_DIR.glob("*.json")):
        with open(json_file, encoding="utf-8") as f:
            data = json.load(f)
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
    """Return all templates with metadata (name, category, chain_id, variables)."""
    return [t for t in ATTACK_TEMPLATES if t["template"]]


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
