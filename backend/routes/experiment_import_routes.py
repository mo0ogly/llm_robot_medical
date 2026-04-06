"""Unified experiment import API — All sessions (Forge campaigns, thesis experiments) go here.

Endpoints:
    POST /api/redteam/experiments/import — Import F46, Sep(M), ASIDE results
    GET  /api/redteam/experiments/list — List all imported experiments
    GET  /api/redteam/experiments/{experiment_id} — Get experiment details
    GET  /api/redteam/experiments/by-type/{type} — Filter by type (f46, sepm, aside, forge)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Any
import json
import uuid
from datetime import datetime
from pathlib import Path

router = APIRouter(prefix="/api/redteam/experiments", tags=["experiments"])

# In-memory store (in production: use database)
EXPERIMENTS_STORE = {}
EXPERIMENTS_FILE = Path(__file__).parent.parent / "experiments" / "results" / "_experiments_index.json"

class ExperimentImport(BaseModel):
    """Unified format for all experiment types."""
    type: str  # "f46", "sepm", "aside", or "forge-campaign"
    campaign_id: str
    name: str
    description: Optional[str] = ""
    total_evaluations: int
    results_file: str
    results_data: Optional[dict] = None  # Full results JSON
    metadata: Optional[dict] = None

class ExperimentRecord(BaseModel):
    """Stored experiment record."""
    experiment_id: str
    type: str
    campaign_id: str
    name: str
    description: str
    total_evaluations: int
    results_file: str
    created_at: str
    metadata: dict

def load_experiments():
    """Load experiment index from disk."""
    global EXPERIMENTS_STORE
    if EXPERIMENTS_FILE.exists():
        with open(EXPERIMENTS_FILE) as f:
            EXPERIMENTS_STORE = json.load(f)
    return EXPERIMENTS_STORE

def save_experiments():
    """Persist experiment index to disk."""
    EXPERIMENTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(EXPERIMENTS_FILE, 'w') as f:
        json.dump(EXPERIMENTS_STORE, f, indent=2)

@router.post("/import")
async def import_experiment(exp: ExperimentImport):
    """Import experiment results (F46, Sep(M), ASIDE, or Forge campaign).
    
    All session types use same endpoint — unified archive.
    """
    experiment_id = str(uuid.uuid4())[:8]
    
    record = ExperimentRecord(
        experiment_id=experiment_id,
        type=exp.type,
        campaign_id=exp.campaign_id,
        name=exp.name,
        description=exp.description,
        total_evaluations=exp.total_evaluations,
        results_file=exp.results_file,
        created_at=datetime.now().isoformat(),
        metadata=exp.metadata or {},
    )
    
    EXPERIMENTS_STORE[experiment_id] = record.dict()
    save_experiments()
    
    return {
        "status": "imported",
        "experiment_id": experiment_id,
        "type": exp.type,
        "campaign_id": exp.campaign_id,
        "evaluations": exp.total_evaluations,
    }

@router.get("/list")
async def list_experiments(type_filter: Optional[str] = None):
    """List all experiments, optionally filtered by type."""
    load_experiments()
    
    experiments = list(EXPERIMENTS_STORE.values())
    if type_filter:
        experiments = [e for e in experiments if e['type'] == type_filter]
    
    return {
        "total": len(experiments),
        "experiments": sorted(experiments, key=lambda x: x['created_at'], reverse=True),
    }

@router.get("/{experiment_id}")
async def get_experiment(experiment_id: str):
    """Get experiment details with full metadata."""
    load_experiments()
    
    if experiment_id not in EXPERIMENTS_STORE:
        raise HTTPException(status_code=404, detail="Experiment not found")
    
    return EXPERIMENTS_STORE[experiment_id]

@router.get("/by-type/{exp_type}")
async def list_by_type(exp_type: str):
    """List experiments filtered by type (f46, sepm, aside, forge-campaign)."""
    load_experiments()
    
    experiments = [
        e for e in EXPERIMENTS_STORE.values() 
        if e['type'] == exp_type
    ]
    
    return {
        "type": exp_type,
        "total": len(experiments),
        "experiments": sorted(experiments, key=lambda x: x['created_at'], reverse=True),
    }

@router.get("/stats/overview")
async def experiment_stats():
    """Stats across all experiment types."""
    load_experiments()
    
    by_type = {}
    total_evals = 0
    
    for exp in EXPERIMENTS_STORE.values():
        exp_type = exp['type']
        if exp_type not in by_type:
            by_type[exp_type] = {'count': 0, 'total_evals': 0}
        by_type[exp_type]['count'] += 1
        by_type[exp_type]['total_evals'] += exp['total_evaluations']
        total_evals += exp['total_evaluations']
    
    return {
        "total_experiments": len(EXPERIMENTS_STORE),
        "total_evaluations": total_evals,
        "by_type": by_type,
    }
