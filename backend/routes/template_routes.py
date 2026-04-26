"""Template CRUD, help, versioning, and export-fiche routes.

Endpoints:
    GET    /api/redteam/templates
    GET    /api/redteam/templates/{template_id}/help
    PUT    /api/redteam/templates/{template_id}/help
    POST   /api/redteam/templates
    PUT    /api/redteam/templates/{template_id}
    DELETE /api/redteam/templates/{template_id}
    GET    /api/redteam/templates/{template_id}/versions
    POST   /api/redteam/templates/{template_id}/versions
    DELETE /api/redteam/templates/{template_id}/versions/{version_index}
    GET    /api/redteam/templates/{template_id}/compare/{version_index}
    GET    /api/redteam/templates/{template_id}/export-fiche
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from attack_catalog import (
    get_templates_full,
    get_template_help_info, save_template_help, update_template_json,
    create_template, delete_template, get_config_file,
    get_template_versions, create_template_version, delete_template_version,
    get_detection_comparison, get_template_by_id,
)

router = APIRouter()


@router.get("/api/redteam/templates")
async def get_attack_templates():
    """Return all attack templates with full metadata (name, category, chain_id, variables)."""
    return get_templates_full()


# --- Template CRUD endpoints (file-backed) ---


@router.get("/api/redteam/templates/{template_id}/help")
async def get_template_help_endpoint(template_id: str):
    """Return the MD help content for a specific template."""
    result = get_template_help_info(template_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Template or help file not found: " + template_id)
    content, filename = result
    return {"content": content, "filename": filename, "template_id": template_id}


@router.put("/api/redteam/templates/{template_id}/help")
async def update_template_help_endpoint(template_id: str, body: dict):
    """Update the MD help content for a specific template."""
    content = body.get("content", "")
    result = save_template_help(template_id, content)
    if result is None:
        raise HTTPException(status_code=404, detail="Template or help file not found: " + template_id)
    filename, chars = result
    return {"status": "saved", "chars": chars, "filename": filename}


@router.post("/api/redteam/templates")
async def create_template_endpoint(body: dict):
    """Create a new template (JSON + MD files in backend/prompts/)."""
    required = ["id", "name", "category", "template"]
    missing = [k for k in required if k not in body]
    if missing:
        raise HTTPException(status_code=400, detail="Missing fields: " + ", ".join(missing))
    help_content = body.pop("help_content", "")
    result = create_template(body, help_content)
    return result


@router.put("/api/redteam/templates/{template_id}")
async def update_template_endpoint(template_id: str, body: dict):
    """Update fields in a template JSON file."""
    success = update_template_json(template_id, body)
    if not success:
        raise HTTPException(status_code=404, detail="Template not found: " + template_id)
    return {"status": "updated", "id": template_id}


@router.delete("/api/redteam/templates/{template_id}")
async def delete_template_endpoint(template_id: str):
    """Delete a template (both JSON and MD files)."""
    success = delete_template(template_id)
    if not success:
        raise HTTPException(status_code=404, detail="Template not found: " + template_id)
    return {"status": "deleted", "id": template_id}


# --- Template Versioning endpoints ---


@router.get("/api/redteam/templates/{template_id}/versions")
async def get_template_versions_endpoint(template_id: str):
    """Return the baseline template and all its evolved versions."""
    result = get_template_versions(template_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Template not found: " + template_id)
    return result


@router.post("/api/redteam/templates/{template_id}/versions")
async def create_template_version_endpoint(template_id: str, body: dict):
    """Create a new version entry for a template (persisted to JSON on disk)."""
    result = create_template_version(template_id, body)
    if result is None:
        raise HTTPException(status_code=404, detail="Template not found: " + template_id)
    return result


@router.delete("/api/redteam/templates/{template_id}/versions/{version_index}")
async def delete_template_version_endpoint(template_id: str, version_index: int):
    """Delete a specific version by index from a template."""
    success = delete_template_version(template_id, version_index)
    if not success:
        raise HTTPException(status_code=404, detail="Template or version not found")
    return {"status": "deleted", "id": template_id, "version_index": version_index}


@router.get("/api/redteam/templates/{template_id}/compare/{version_index}")
async def get_detection_comparison_endpoint(template_id: str, version_index: int):
    """Compare detection profiles between baseline (V1) and a specific version."""
    result = get_detection_comparison(template_id, version_index)
    if result is None:
        raise HTTPException(status_code=404, detail="Template or version not found")
    return result


# --- Export Fiche ---


@router.get("/api/redteam/templates/{template_id}/export-fiche")
async def export_fiche_endpoint(template_id: str):
    """Export attack sheet as .docx document."""
    from export_fiche import generate_fiche

    tpl = get_template_by_id(template_id)
    if not tpl:
        raise HTTPException(status_code=404, detail="Template not found: " + template_id)

    # Get versions
    versions_data = get_template_versions(template_id)
    versions = versions_data.get("versions", []) if versions_data else []

    # Get help content
    help_result = get_template_help_info(template_id)
    help_content = help_result[0] if help_result else ""

    # Get detection baseline
    baseline = get_config_file("detection_baseline.json")

    # Generate docx
    buffer = generate_fiche(
        template_data={
            "id": tpl.get("_id", template_id),
            "name": tpl.get("name", ""),
            "category": tpl.get("category", ""),
            "template": tpl.get("template", ""),
            "variables": tpl.get("variables", {}),
            "target_delta": tpl.get("_target_delta", "delta1"),
            "conjecture": tpl.get("_conjecture"),
            "chain_id": tpl.get("chain_id"),
            "detection_profile": tpl.get("_detection_profile", {}),
        },
        versions=versions,
        help_content=help_content,
        detection_baseline=baseline,
    )

    filename = "fiche_" + template_id + ".docx"
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=" + filename},
    )
