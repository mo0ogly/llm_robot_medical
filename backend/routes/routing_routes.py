"""Model-tier routing endpoint.

Ported from oh-my-claudecode src/features/model-routing/ (MIT).

Endpoints:
    POST /api/routing/select   — score a task and return the recommended model
    GET  /api/routing/models   — list available tier->model mapping
"""
from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from routing import router as model_router, TIER_TO_MODEL

api_router = APIRouter()


class SelectRequest(BaseModel):
    task: str = ""
    force: str | None = None
    allow_env_override: bool = True


@api_router.post("/api/routing/select")
def select_model(req: SelectRequest):
    """Score a task string and return the recommended Groq model + rationale."""
    decision = model_router.select(req.task, force=req.force, allow_env_override=req.allow_env_override)
    return {
        "model": decision.model,
        "tier": decision.tier,
        "source": decision.source,
        "score": decision.score,
        "signals": decision.signals,
    }


@api_router.get("/api/routing/models")
def list_models():
    """Return the tier->model mapping (for frontend model-picker hints)."""
    return {tier.value: model for tier, model in TIER_TO_MODEL.items()}
