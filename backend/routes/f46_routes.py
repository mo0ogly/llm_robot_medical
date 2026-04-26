"""F46 Recovery Penalty calibration routes.

Endpoints:
    POST /api/redteam/f46-calibration/start
    GET  /api/redteam/f46-calibration/status
    GET  /api/redteam/f46-calibration/results
"""

import asyncio
import json
import os
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel as PydanticBaseModel

router = APIRouter()

RESULTS_DIR = Path(__file__).resolve().parent.parent / "experiments" / "results"

# In-memory state for the running calibration task
_calibration_task: Optional[asyncio.Task] = None
_calibration_status = {"state": "idle", "phase": None, "progress": 0}


class F46CalibrationRequest(PydanticBaseModel):
    phase: str = "all"  # "baseline", "grid", "analyze", "all"
    model: Optional[str] = None


@router.post("/api/redteam/f46-calibration/start")
async def start_f46_calibration(request: F46CalibrationRequest):
    """Start the F46 calibration experiment (async background task)."""
    global _calibration_task, _calibration_status

    if _calibration_task and not _calibration_task.done():
        return JSONResponse(
            status_code=409,
            content={"error": "Calibration already running", "status": _calibration_status},
        )

    _calibration_status = {"state": "running", "phase": request.phase, "progress": 0}

    async def _run():
        global _calibration_status
        try:
            from experiments.f46_calibration import main
            await main(request.phase)
            _calibration_status = {"state": "completed", "phase": request.phase, "progress": 100}
        except Exception as e:
            _calibration_status = {"state": "error", "phase": request.phase, "error": str(e)}

    _calibration_task = asyncio.create_task(_run())
    return {"message": "F46 calibration started", "phase": request.phase}


@router.get("/api/redteam/f46-calibration/status")
async def get_f46_status():
    """Get the current status of the F46 calibration."""
    # Enrich with checkpoint data if available
    checkpoint_path = RESULTS_DIR / "f46_checkpoint.json"
    checkpoint_info = {}
    if checkpoint_path.exists():
        try:
            with open(checkpoint_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            checkpoint_info = {
                "conditions_completed": len(data.get("conditions", {})),
                "conditions_total": 15,  # 5 mu x 3 gamma
                "last_update": data.get("last_update"),
            }
        except Exception:
            pass

    return {**_calibration_status, "checkpoint": checkpoint_info}


@router.get("/api/redteam/f46-calibration/results")
async def get_f46_results():
    """Get the final F46 calibration results."""
    final_path = RESULTS_DIR / "f46_calibration_results.json"
    if not final_path.exists():
        raise HTTPException(
            status_code=404,
            detail="No calibration results yet. Run the calibration first.",
        )

    with open(final_path, "r", encoding="utf-8") as f:
        return json.load(f)
