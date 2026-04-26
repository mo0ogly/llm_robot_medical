"""Campaign, scenario, chain, and agent prompt routes.

Endpoints:
    GET  /api/redteam/campaign/latest
    POST /api/redteam/campaign/stream
    GET  /api/redteam/agents/prompts/all
    GET  /api/redteam/agents
    PUT  /api/redteam/agents/{agent_name}/prompt
    GET  /api/redteam/scenarios
    GET  /api/redteam/chains
    POST /api/redteam/scenario/stream
"""

import json
import os
from typing import Optional

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel as PydanticBaseModel

from scenarios import get_scenario_by_id, get_all_scenarios
from routes.shared import get_orchestrator, get_orchestrator_instance

router = APIRouter()


# --- Pydantic models ---


class ScenarioRunRequest(PydanticBaseModel):
    scenario_id: str
    levels: Optional[dict] = None


# --- Campaign ---


@router.get("/api/redteam/campaign/latest")
async def get_latest_campaign():
    """Retourne le dernier fichier campaign_*.json depuis research_archive/data/raw/."""
    import glob
    import json as _json
    archive_dir = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "..", "..", "research_archive", "data", "raw",
    )
    files = sorted(glob.glob(os.path.join(archive_dir, "campaign_*.json")))
    if not files:
        return JSONResponse(
            status_code=404,
            content={"error": "No campaign results yet. Run run_formal_campaign() first."},
        )
    with open(files[-1], encoding="utf-8") as f:
        return _json.load(f)


@router.post("/api/redteam/campaign/stream")
async def run_campaign_stream(request: dict = None, lang: str = "en"):
    """Run a full campaign with SSE streaming of results."""
    async def event_generator():
        from orchestrator import RedTeamOrchestrator
        from agents.red_team_agent import ATTACK_CATALOG

        orch = RedTeamOrchestrator(
            levels=request.get("levels"),
            lang=lang,
            aegis_shield=request.get("aegis_shield", False) if request else False
        )

        n_trials = int(request.get("n_trials", 1)) if request else 1
        if n_trials < 1:
            n_trials = 1
        include_null_control = request.get("include_null_control", True) if request else True

        # Build the list of (attack_type, attack_message) pairs to execute.
        explicit_attacks = request.get("attacks") if request else None
        attack_filter = request.get("attack_types") if request else None

        attack_items = []

        if explicit_attacks and isinstance(explicit_attacks, list):
            for atk in explicit_attacks:
                atk_type = atk.get("type", "custom")
                atk_msg = atk.get("message", "")
                if atk_msg:
                    attack_items.append((atk_type, atk_msg))
        else:
            catalog = ATTACK_CATALOG
            if attack_filter:
                catalog = {k: v for k, v in catalog.items() if k in attack_filter}
            for attack_type, attacks_list in catalog.items():
                for attack_msg in attacks_list:
                    attack_items.append((attack_type, attack_msg))

        if include_null_control:
            attack_items.insert(0, ("null_control", "What is 2 + 2?"))

        total = len(attack_items) * n_trials
        current = 0

        for trial in range(n_trials):
            for attack_type, attack_msg in attack_items:
                current += 1
                yield f"data: {json.dumps({'type': 'round_start', 'round': current, 'total': total, 'attack_type': attack_type, 'attack_message': attack_msg, 'trial': trial + 1, 'n_trials': n_trials})}\n\n"

                try:
                    result = await orch.run_single_attack(attack_type, attack_msg)
                    yield f"data: {json.dumps({'type': 'round_result', 'round': current, 'total': total, 'attack_type': result.attack_type, 'attack_message': result.attack_message, 'target_response': result.target_response, 'scores': result.scores, 'audit_analysis': result.audit_analysis, 'trial': trial + 1, 'n_trials': n_trials})}\n\n"
                except Exception as e:
                    yield f"data: {json.dumps({'type': 'round_error', 'round': current, 'error': str(e), 'trial': trial + 1})}\n\n"

        summary = orch.report.summary()
        yield f"data: {json.dumps({'type': 'campaign_done', 'summary': summary})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


# --- Agent prompts ---


@router.get("/api/redteam/agents/prompts/all")
async def get_all_agent_prompts(lang: str = "en"):
    """Retourne la matrice complete des system prompts par niveau pour une langue donnee."""
    from agents.prompts import MEDICAL_PROMPTS, REDTEAM_PROMPTS, AEGIS_PROMPTS
    return {
        "MedicalRobotAgent": MEDICAL_PROMPTS.get(lang, MEDICAL_PROMPTS["en"]),
        "RedTeamAgent": REDTEAM_PROMPTS.get(lang, REDTEAM_PROMPTS["en"]),
        "SecurityAuditAgent": AEGIS_PROMPTS.get(lang, AEGIS_PROMPTS["en"]),
    }


@router.get("/api/redteam/agents")
async def get_current_agent_prompts(lang: str = "en"):
    """Retourne les system prompts actuels des agents actifs dans l'orchestrateur."""
    orch = get_orchestrator(lang=lang)
    return {
        "MedicalRobotAgent": orch.medical_agent.system_message,
        "RedTeamAgent": orch.red_team_agent.system_message,
        "SecurityAuditAgent": orch.security_agent.system_message,
    }


@router.put("/api/redteam/agents/{agent_name}/prompt")
async def update_agent_prompt(agent_name: str, body: dict, level: Optional[str] = None, lang: str = "en"):
    """Met a jour le system prompt d'un agent."""
    from agents.prompts import MEDICAL_PROMPTS, REDTEAM_PROMPTS, AEGIS_PROMPTS

    prompt = body.get("prompt", "")

    # Update global templates if level is specified
    if level:
        prompt_map = {
            "MedicalRobotAgent": MEDICAL_PROMPTS,
            "RedTeamAgent": REDTEAM_PROMPTS,
            "SecurityAuditAgent": AEGIS_PROMPTS,
        }
        if agent_name in prompt_map and level in ["easy", "normal", "hard"]:
            if lang not in prompt_map[agent_name]:
                prompt_map[agent_name][lang] = {}
            prompt_map[agent_name][lang][level] = prompt
            print("Updated global prompt for " + agent_name + " [" + lang + "][" + level + "]")

    # Update active instance if orchestrator exists
    _orchestrator = get_orchestrator_instance()
    if _orchestrator:
        agent_map = {
            "MedicalRobotAgent": _orchestrator.medical_agent,
            "RedTeamAgent": _orchestrator.red_team_agent,
            "SecurityAuditAgent": _orchestrator.security_agent,
        }
        agent = agent_map.get(agent_name)
        if agent:
            agent.update_system_message(prompt)
            print("Updated active instance prompt for " + agent_name)

    return {"status": "updated", "agent": agent_name, "level": level, "lang": lang, "prompt_length": len(prompt)}


# --- Scenarios ---


@router.get("/api/redteam/scenarios")
async def get_scenarios():
    """Liste tous les scenarios disponibles avec metadonnees."""
    return [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "clinical_context": s.clinical_context,
            "expected_impact": s.expected_impact,
            "mitre_ttps": s.mitre_ttps,
            "steps": [
                {
                    "name": step.name,
                    "attack_type": step.attack_type,
                    "objective": step.objective,
                    "message": step.message,
                    "variables": step.variables,
                    "chain_id": step.chain_id,
                }
                for step in s.steps
            ],
        }
        for s in get_all_scenarios()
    ]


# --- Chains ---


@router.get("/api/redteam/chains")
async def get_attack_chains():
    """List all registered attack chains from CHAIN_REGISTRY."""
    from agents.attack_chains import CHAIN_REGISTRY
    result = []
    for chain_id, chain_cls in CHAIN_REGISTRY.items():
        try:
            chain = chain_cls()
            result.append({
                "id": chain_id,
                "name": getattr(chain, "name", chain_id),
                "description": getattr(chain, "description", ""),
                "category": getattr(chain, "category", "unknown"),
                "step_count": len(getattr(chain, "steps", [])),
            })
        except Exception:
            result.append({"id": chain_id, "name": chain_id, "description": "", "category": "unknown", "step_count": 0})
    return result


# --- Scenario stream ---


@router.post("/api/redteam/scenario/stream")
async def run_scenario_stream(req: ScenarioRunRequest, request: Request, lang: str = "en"):
    """Execute un scenario multi-etapes avec streaming SSE."""
    scenario = get_scenario_by_id(req.scenario_id)
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario '" + req.scenario_id + "' not found")

    async def event_generator():
        from orchestrator import RedTeamOrchestrator
        levels = getattr(req, "levels", None)
        orch = RedTeamOrchestrator(levels=levels, lang=lang)
        try:
            async for event in orch.run_scenario_stream(req.scenario_id):
                if await request.is_disconnected():
                    break
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'step_error', 'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
