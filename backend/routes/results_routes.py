"""Results explorer routes.

Endpoints:
    GET /api/results
    GET /api/results/{filename}
    GET /api/redteam/experiments/manifest
    GET /api/redteam/experiments/protocols
    GET /api/redteam/experiments/protocols/{experiment_id}
"""

import json
import os

from fastapi import APIRouter, HTTPException

router = APIRouter()

RESULTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "experiments", "results")
EXPERIMENTS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "research_archive", "experiments"
)


@router.get("/api/results")
async def list_results():
    """Liste les fichiers de resultats dans le repertoire experiments/results."""
    if not os.path.exists(RESULTS_DIR):
        return []
    files = []
    for f in os.listdir(RESULTS_DIR):
        path = os.path.join(RESULTS_DIR, f)
        if os.path.isfile(path):
            files.append({
                "name": f,
                "size": os.path.getsize(path),
                "modified": os.path.getmtime(path),
                "type": f.split('.')[-1].lower() if '.' in f else 'txt'
            })
    return sorted(files, key=lambda x: x['modified'], reverse=True)


@router.get("/api/results/{filename}")
async def get_result_content(filename: str):
    """Recupere le contenu d'un fichier de resultat specifique."""
    safe_filename = os.path.basename(filename)
    path = os.path.join(RESULTS_DIR, safe_filename)

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Fichier non trouve")

    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        return {
            "name": safe_filename,
            "content": content,
            "type": safe_filename.split('.')[-1].lower() if '.' in safe_filename else 'txt'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/redteam/experiments/manifest")
async def get_experiment_manifest():
    """Campaign manifest — registre central de toutes les campagnes experimentales.

    Expose campaign_manifest.json avec : ID, gap, conjecture, script,
    iterations (params, verdict, findings), success_criteria, safeguards.
    """
    manifest_path = os.path.join(EXPERIMENTS_DIR, "campaign_manifest.json")
    if not os.path.exists(manifest_path):
        return {"campaigns": [], "message": "No campaign manifest found"}

    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        return manifest
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/redteam/experiments/protocols")
async def list_experiment_protocols():
    """Liste tous les protocoles experimentaux (protocol_*.json)."""
    if not os.path.exists(EXPERIMENTS_DIR):
        return []

    protocols = []
    for f in os.listdir(EXPERIMENTS_DIR):
        if f.startswith("protocol_") and f.endswith(".json"):
            path = os.path.join(EXPERIMENTS_DIR, f)
            try:
                with open(path, "r", encoding="utf-8") as fh:
                    data = json.load(fh)
                protocols.append({
                    "filename": f,
                    "experiment_id": data.get("experiment_id", ""),
                    "gap_id": data.get("gap_id", ""),
                    "conjecture_id": data.get("conjecture_id", ""),
                    "hypothesis": data.get("hypothesis", ""),
                    "script": data.get("script", ""),
                    "parameters": data.get("parameters", {}),
                    "success_criteria": data.get("success_criteria", {}),
                    "date": data.get("date", ""),
                })
            except Exception:
                protocols.append({"filename": f, "error": "Parse error"})

    return sorted(protocols, key=lambda x: x.get("date", ""), reverse=True)


@router.get("/api/redteam/experiments/protocols/{experiment_id}")
async def get_experiment_protocol(experiment_id: str):
    """Recupere un protocole experimental par son ID."""
    if not os.path.exists(EXPERIMENTS_DIR):
        raise HTTPException(status_code=404, detail="Experiments directory not found")

    for f in os.listdir(EXPERIMENTS_DIR):
        if f.startswith("protocol_") and f.endswith(".json"):
            path = os.path.join(EXPERIMENTS_DIR, f)
            try:
                with open(path, "r", encoding="utf-8") as fh:
                    data = json.load(fh)
                if data.get("experiment_id") == experiment_id:
                    return data
            except Exception:
                continue

    raise HTTPException(status_code=404, detail="Protocol not found: " + experiment_id)


@router.get("/api/redteam/experiments/reports")
async def list_experiment_reports():
    """Liste tous les rapports experimentaux (EXPERIMENT_REPORT_*.md)."""
    if not os.path.exists(EXPERIMENTS_DIR):
        return []

    reports = []
    for f in os.listdir(EXPERIMENTS_DIR):
        if f.startswith("EXPERIMENT_REPORT_") and f.endswith(".md"):
            path = os.path.join(EXPERIMENTS_DIR, f)
            reports.append({
                "filename": f,
                "size": os.path.getsize(path),
                "modified": os.path.getmtime(path),
            })

    return sorted(reports, key=lambda x: x["modified"], reverse=True)


@router.get("/api/redteam/experiments/reports/{filename}")
async def get_experiment_report(filename: str):
    """Recupere le contenu d'un rapport experimental."""
    safe = os.path.basename(filename)
    path = os.path.join(EXPERIMENTS_DIR, safe)

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Report not found")

    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"filename": safe, "content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
