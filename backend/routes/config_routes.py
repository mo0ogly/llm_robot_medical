"""Configuration, providers, taxonomy, and catalog CRUD routes.

Endpoints:
    GET  /api/redteam/config/retex-patterns
    GET  /api/redteam/config/dim-weights
    GET  /api/redteam/config/detection-baseline
    GET  /api/redteam/providers
    GET  /api/redteam/models-config
    PUT  /api/redteam/models-config/active
    GET  /api/redteam/catalog
    POST /api/redteam/catalog/{category}
    PUT  /api/redteam/catalog/{category}/{index}
    DELETE /api/redteam/catalog/{category}/{index}
    POST /api/redteam/catalog/import
    GET  /api/redteam/taxonomy
    GET  /api/redteam/taxonomy/flat
    GET  /api/redteam/taxonomy/coverage
    GET  /api/redteam/taxonomy/tree
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from attack_catalog import (
    get_catalog_by_category, get_templates_full, ATTACK_TEMPLATES,
    get_config_file,
)
from routes.shared import get_catalog, set_catalog

router = APIRouter()


# --- Config endpoints ---


@router.get("/api/redteam/config/retex-patterns")
async def get_retex_patterns():
    """Return RETEX patterns from config file."""
    data = get_config_file("retex_patterns.json")
    if data is None:
        raise HTTPException(status_code=404, detail="retex_patterns.json not found")
    return data


@router.get("/api/redteam/config/dim-weights")
async def get_dim_weights():
    """Return DIM labels and weights from config file."""
    data = get_config_file("dim_config.json")
    if data is None:
        raise HTTPException(status_code=404, detail="dim_config.json not found")
    return data


@router.get("/api/redteam/config/detection-baseline")
async def get_detection_baseline():
    """Return baseline detection probabilities from config file."""
    data = get_config_file("detection_baseline.json")
    if data is None:
        raise HTTPException(status_code=404, detail="detection_baseline.json not found")
    return data


# --- Providers ---


@router.get("/api/redteam/providers")
async def list_providers():
    """List available LLM providers and their models."""
    from agents.attack_chains.llm_factory import get_available_providers
    return get_available_providers()


# --- Models config (Zhang et al. 2025 cross-model) ---


@router.get("/api/redteam/models-config")
async def get_models_config_endpoint():
    """Return full multi-model configuration (profiles + experimental params)."""
    from agents.attack_chains.llm_factory import get_full_config
    return get_full_config()


@router.put("/api/redteam/models-config/active")
async def set_active_profile_endpoint(body: dict):
    """Set the active model profile."""
    from agents.attack_chains.llm_factory import set_active_profile
    profile_id = body.get("profile_id", "")
    if not profile_id:
        raise HTTPException(status_code=400, detail="profile_id required")
    success = set_active_profile(profile_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Profile not found: " + profile_id,
        )
    return {"status": "ok", "active_profile": profile_id}


# --- Catalog (legacy grouped format) ---


@router.get("/api/redteam/catalog")
async def get_attack_catalog():
    """Return attack payloads grouped by category (legacy format)."""
    return get_catalog()


@router.post("/api/redteam/catalog/{category}")
async def add_attack(category: str, body: dict):
    """Add a new attack to the catalog (runtime, not persisted to disk)."""
    catalog = get_catalog()
    name = body.get("name", "Custom")
    message = body.get("message", "")
    if category not in catalog:
        catalog[category] = []
    help_md = body.get("help_md", "")
    catalog[category].append({"name": name, "message": message, "help_md": help_md})
    # Also add to ATTACK_TEMPLATES so /api/redteam/templates stays in sync
    ATTACK_TEMPLATES.append({
        "name": name,
        "category": category,
        "template": message,
        "variables": {},
        "help_md": help_md,
    })
    return {"status": "added", "category": category, "total": len(catalog[category])}


@router.put("/api/redteam/catalog/{category}/{index}")
async def update_attack(category: str, index: int, body: dict):
    """Update an existing attack template by category + index."""
    catalog = get_catalog()
    if category not in catalog or not (0 <= index < len(catalog[category])):
        return JSONResponse(status_code=404, content={"error": "Template not found"})
    entry = catalog[category][index]
    # Support both plain string entries and dict entries {name, message, help_md}
    if isinstance(entry, dict):
        if "name" in body:
            entry["name"] = body["name"]
        if "message" in body:
            entry["message"] = body["message"]
        if "help_md" in body:
            entry["help_md"] = body["help_md"]
        catalog[category][index] = entry
    else:
        # Legacy plain string — upgrade to dict
        catalog[category][index] = {
            "name": body.get("name", "Custom"),
            "message": body.get("message", entry)
        }
    return {"status": "updated", "category": category, "index": index}


@router.delete("/api/redteam/catalog/{category}/{index}")
async def delete_attack(category: str, index: int):
    """Delete an attack from the catalog by category and index."""
    catalog = get_catalog()
    if category in catalog and 0 <= index < len(catalog[category]):
        removed = catalog[category].pop(index)
        # Also remove from ATTACK_TEMPLATES to keep /api/redteam/templates in sync
        cat_count = 0
        for i, t in enumerate(ATTACK_TEMPLATES):
            if t.get("category") == category and t.get("template"):
                if cat_count == index:
                    ATTACK_TEMPLATES.pop(i)
                    break
                cat_count += 1
        return {"status": "deleted", "removed": removed}
    return JSONResponse(status_code=404, content={"error": "Attack not found"})


@router.post("/api/redteam/catalog/import")
async def import_catalog(body: dict):
    """Importe un catalogue complet (remplace)."""
    set_catalog(body.get("catalog", {}))
    catalog = get_catalog()
    return {"status": "imported", "categories": list(catalog.keys())}


# --- Taxonomy ---


@router.get("/api/redteam/taxonomy")
async def get_taxonomy():
    """Return the full CrowdStrike taxonomy tree (4 levels, 95 techniques)."""
    from taxonomy import load_taxonomy
    return load_taxonomy()


@router.get("/api/redteam/taxonomy/flat")
async def get_taxonomy_flat():
    """Return flat lookup: {technique_id: {class_id, category_id, ...}}."""
    from taxonomy import get_flat_index
    return get_flat_index()


@router.get("/api/redteam/taxonomy/coverage")
async def get_taxonomy_coverage():
    """Return coverage stats: total, covered, percentage, by_class, gaps."""
    from taxonomy import compute_coverage
    return compute_coverage(ATTACK_TEMPLATES)


@router.get("/api/redteam/taxonomy/tree")
async def get_taxonomy_tree_with_templates():
    """Return taxonomy tree with templates attached at technique leaves."""
    from taxonomy import get_templates_by_tree
    return get_templates_by_tree(ATTACK_TEMPLATES)
