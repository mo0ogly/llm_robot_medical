"""Results explorer routes.

Endpoints:
    GET /api/results
    GET /api/results/{filename}
    GET /api/redteam/experiments/manifest
    GET /api/redteam/experiments/protocols
    GET /api/redteam/experiments/protocols/{experiment_id}
    GET /api/redteam/experiments/{campaign_id}/lineage
"""

import glob
import json
import os
from typing import Optional

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


def _load_json_safe(path: str) -> Optional[dict]:
    """Load a JSON file, returning None on any failure."""
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except Exception:
        return None


def _find_campaign_in_manifest(campaign_id: str) -> Optional[dict]:
    """Find campaign entry in campaign_manifest.json by id."""
    manifest_path = os.path.join(EXPERIMENTS_DIR, "campaign_manifest.json")
    manifest = _load_json_safe(manifest_path)
    if not manifest:
        return None
    for campaign in manifest.get("campaigns", []):
        if campaign.get("id") == campaign_id:
            return campaign
    return None


def _find_protocol(campaign_id: str) -> Optional[dict]:
    """Find protocol_*.json whose experiment_id matches campaign_id."""
    if not os.path.exists(EXPERIMENTS_DIR):
        return None
    for fname in os.listdir(EXPERIMENTS_DIR):
        if fname.startswith("protocol_") and fname.endswith(".json"):
            data = _load_json_safe(os.path.join(EXPERIMENTS_DIR, fname))
            if data and data.get("experiment_id") == campaign_id:
                return data
    return None


def _find_report_filename(campaign_id: str) -> Optional[str]:
    """Find EXPERIMENT_REPORT_*.md that contains campaign_id in its name."""
    if not os.path.exists(EXPERIMENTS_DIR):
        return None
    pattern = os.path.join(EXPERIMENTS_DIR, "EXPERIMENT_REPORT_*" + campaign_id + "*.md")
    matches = glob.glob(pattern)
    if matches:
        return os.path.basename(matches[0])
    # Fallback: scan all report files for the campaign_id substring
    for fname in os.listdir(EXPERIMENTS_DIR):
        if fname.startswith("EXPERIMENT_REPORT_") and fname.endswith(".md"):
            if campaign_id.replace("-", "").upper() in fname.replace("-", "").replace("_", "").upper():
                return fname
    return None


def _load_results_summary(results_file: str) -> Optional[dict]:
    """Load results JSON and extract a summary (conditions or aggregate)."""
    if not results_file:
        return None
    # Try relative to EXPERIMENTS_DIR first, then RESULTS_DIR
    for base_dir in [EXPERIMENTS_DIR, RESULTS_DIR]:
        # results_file may be prefixed with "experiments/" — strip it
        clean = results_file.replace("experiments/", "").replace("results/", "")
        path = os.path.join(base_dir, clean)
        if os.path.exists(path):
            data = _load_json_safe(path)
            if not data:
                continue
            # Return aggregate if present (UX format)
            if "aggregate" in data:
                return {"aggregate": data["aggregate"]}
            # Return condition_results if present (raw format)
            if "condition_results" in data:
                return {"conditions": data["condition_results"]}
            # Return per_chain summary if present
            if "per_chain" in data:
                return {
                    "aggregate": data.get("aggregate", {}),
                    "n_chains": len(data["per_chain"]),
                }
            return None
    return None


@router.get("/api/redteam/experiments/{campaign_id}/lineage")
async def get_experiment_lineage(campaign_id: str) -> dict:
    """Assemble complete lineage for a campaign: manifest + protocol + results + report.

    Combines campaign_manifest.json, protocol_*.json, results JSONs and
    EXPERIMENT_REPORT_*.md into a single lineage object for traceability.
    """
    # 1. Campaign entry from manifest
    campaign = _find_campaign_in_manifest(campaign_id)

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found in manifest: " + campaign_id,
        )

    # 2. Protocol
    protocol = _find_protocol(campaign_id)

    # 3. Build iterations with results summaries and report availability
    iterations = []
    for it in campaign.get("iterations", []):
        results_file = it.get("results_file", "")
        results_summary = _load_results_summary(results_file)

        # Check for iteration-specific report
        report_file = it.get("report_file", "")
        report_filename = os.path.basename(report_file) if report_file else None
        report_available = False
        if report_filename:
            report_path = os.path.join(EXPERIMENTS_DIR, report_filename)
            report_available = os.path.exists(report_path)

        iteration_entry = {
            "run": it.get("run", 0),
            "date": it.get("date", ""),
            "model": it.get("model", ""),
            "params": it.get("params", {}),
            "verdict": it.get("verdict", ""),
            "diagnosis": it.get("diagnosis", ""),
            "findings": it.get("findings", []),
            "results_summary": results_summary,
            "report_available": report_available,
            "report_filename": report_filename,
        }
        iterations.append(iteration_entry)

    # 4. Global report (campaign-level)
    global_report = _find_report_filename(campaign_id)

    # 5. Recommended actions from next_iteration or last diagnosis
    recommended_actions = []
    next_iter = campaign.get("next_iteration")
    if next_iter:
        if next_iter.get("notes"):
            recommended_actions.append(next_iter["notes"])
        if next_iter.get("changes"):
            recommended_actions.append(
                "Parameter changes: " + json.dumps(next_iter["changes"])
            )
    if not recommended_actions and iterations:
        last_diag = iterations[-1].get("diagnosis", "")
        if last_diag:
            recommended_actions.append(last_diag)

    lineage = {
        "campaign_id": campaign.get("id", campaign_id),
        "name": campaign.get("name", ""),
        "gap": campaign.get("gap", ""),
        "conjecture": campaign.get("conjecture", ""),
        "hypothesis": protocol.get("hypothesis", "") if protocol else campaign.get("hypothesis", ""),
        "status": campaign.get("status", ""),
        "success_criteria": campaign.get("success_criteria", {}),
        "protocol": protocol,
        "iterations": iterations,
        "report_filename": global_report,
        "recommended_actions": recommended_actions,
    }

    return lineage
