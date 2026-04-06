"""Helper to register all experiments in the unified Forge archive.

Usage in F46/Sep(M)/ASIDE scripts:
    from experiments.forge_integration import register_experiment
    
    register_experiment(
        exp_type="f46",
        campaign_id="f46_calibration_001",
        name="F46 Recovery Penalty Calibration",
        total_evals=13500,
        results_file="f46_grid_results.json",
        results_data=grid_results_dict,
        metadata={"phase": "grid", "mtsd_range": [1, 5], "lambda_range": [0.1, 0.9]}
    )
"""

import json
import httpx
import logging
from pathlib import Path

logger = logging.getLogger("forge_integration")

BACKEND_URL = "http://127.0.0.1:8042"
EXPERIMENTS_DIR = Path(__file__).parent / "results"

def register_experiment(
    exp_type: str,
    campaign_id: str,
    name: str,
    total_evals: int,
    results_file: str,
    results_data: dict = None,
    metadata: dict = None,
    description: str = "",
) -> dict:
    """Register experiment in unified Forge archive.
    
    Args:
        exp_type: "f46", "sepm", "aside", or "forge-campaign"
        campaign_id: Unique campaign identifier
        name: Human-readable name
        total_evals: Total evaluations/instances processed
        results_file: Relative path to results JSON (from experiments/results/)
        results_data: Full results dict (optional, for immediate persistence)
        metadata: Custom metadata dict
        description: Detailed description
    
    Returns:
        Dict with experiment_id and registration status
    """
    
    # Prepare payload
    payload = {
        "type": exp_type,
        "campaign_id": campaign_id,
        "name": name,
        "description": description or f"{exp_type.upper()} campaign",
        "total_evaluations": total_evals,
        "results_file": results_file,
        "results_data": results_data,
        "metadata": metadata or {},
    }
    
    try:
        with httpx.Client(timeout=30) as client:
            resp = client.post(
                f"{BACKEND_URL}/api/redteam/experiments/import",
                json=payload,
            )
            resp.raise_for_status()
            result = resp.json()
            logger.info(f"✅ Registered {exp_type}: {result['experiment_id']} ({total_evals} evals)")
            return result
    except Exception as e:
        logger.error(f"❌ Failed to register experiment: {e}")
        logger.info(f"   Experiment data will still be saved to {results_file}")
        return {"status": "error", "message": str(e)}

def get_experiment_list(exp_type: str = None) -> dict:
    """Fetch list of registered experiments from Forge."""
    try:
        with httpx.Client(timeout=10) as client:
            if exp_type:
                resp = client.get(f"{BACKEND_URL}/api/redteam/experiments/by-type/{exp_type}")
            else:
                resp = client.get(f"{BACKEND_URL}/api/redteam/experiments/list")
            resp.raise_for_status()
            return resp.json()
    except Exception as e:
        logger.error(f"Failed to fetch experiments: {e}")
        return {}
