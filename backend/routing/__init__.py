"""AEGIS model-tier routing — select the right Groq model per task complexity.

Ported from oh-my-claudecode src/features/model-routing/ (MIT).
Improvement: Groq-only (no Bedrock/Vertex); reuses research-director TRIVIAL/MODERATE/COMPLEX tags.
"""
from .scorer import TaskScorer, Tier, score_task
from .model_router import ModelRouter, router

__all__ = ["TaskScorer", "Tier", "score_task", "ModelRouter", "router"]
