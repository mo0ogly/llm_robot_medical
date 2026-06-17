"""Hostile reviewer endpoints — dual-model CCG review (P4 OMC fusion).

Ported from oh-my-claudecode skills/ccg/ + skills/ask/ (MIT).
Improvement: Groq backend (this module) + Claude Agent (aegis-ccg SKILL.md).

Endpoints:
    POST /api/review/hostile    — Groq reviewer; optional synthesis if claude_review provided
    POST /api/review/synthesize — merge pre-computed Claude + Groq reviews (conservative merge)
"""
from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from agents.hostile_reviewer import review_with_groq, synthesize_reviews

api_router = APIRouter()


class HostileReviewRequest(BaseModel):
    draft_path: str | None = None
    draft_content: str | None = None
    claude_review: dict | None = None


class SynthesizeRequest(BaseModel):
    claude_review: dict
    groq_review: dict


@api_router.post("/api/review/hostile")
def hostile_review(req: HostileReviewRequest):
    """Run Groq hostile reviewer on a draft note.

    Accepts either draft_path (file on disk) or draft_content (inline text).
    If claude_review is provided, synthesizes both using the conservative Stackelberg rule.
    """
    if req.draft_content:
        content = req.draft_content
    elif req.draft_path:
        path = Path(req.draft_path)
        if not path.exists():
            raise HTTPException(status_code=404, detail="draft_path not found: " + str(path))
        content = path.read_text(encoding="utf-8")
    else:
        raise HTTPException(status_code=400, detail="Provide draft_path or draft_content")

    groq_r = review_with_groq(content)

    if req.claude_review:
        return synthesize_reviews(req.claude_review, groq_r)
    return groq_r


@api_router.post("/api/review/synthesize")
def synthesize_endpoint(req: SynthesizeRequest):
    """Merge pre-computed Claude and Groq reviews with the conservative Stackelberg rule.

    Takes the more severe verdict and minimum score per axis.
    Called by the aegis-ccg SKILL.md orchestrator after both reviewers complete.
    """
    return synthesize_reviews(req.claude_review, req.groq_review)
