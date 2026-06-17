"""Cost / HUD observability routes.

Ported from oh-my-claudecode src/hud/usage-api.ts (MIT).
Improvement: Groq public pricing only (no Anthropic OAuth dependency).

Endpoints:
    GET  /api/cost/session   — current session token/cost summary
    POST /api/cost/reset     — reset session counters
    POST /api/cost/record    — record a usage event (for scripts that bypass FastAPI)
"""
from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from observability import tracker

router = APIRouter()


class RecordRequest(BaseModel):
    model: str
    prompt_tokens: int
    completion_tokens: int


@router.get("/api/cost/session")
def get_session_cost():
    """Return current session token counts and estimated USD cost."""
    return tracker.summary()


@router.post("/api/cost/reset")
def reset_session_cost():
    """Clear all session counters (start a new session)."""
    tracker.reset()
    return {"status": "reset", "session": tracker.summary()["session"]}


@router.post("/api/cost/record")
def record_usage(req: RecordRequest):
    """Record a single LLM call (for external scripts using the backend as a sink)."""
    tracker.record(req.model, req.prompt_tokens, req.completion_tokens)
    return {"status": "recorded", "session": tracker.summary()["session"]}
