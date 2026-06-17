"""AEGIS model router — map task tier to Groq model.

Ported from oh-my-claudecode src/features/model-routing/rules.ts + types.ts (MIT).
Improvement: Groq-only (no Bedrock/Vertex); forceInherit fallback when caller
already specifies a model; thesis campaign rule (always HIGH).

Usage:
    from routing import router
    model = router.select("analyse this paper and compare with conjecture C2")
    # -> "llama-3.3-70b-versatile"

    model = router.select("list the templates", force="llama-3.1-8b-instant")
    # -> "llama-3.1-8b-instant"  (caller-specified, no override)
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Optional

from .scorer import Tier, TaskScorer, score_task

# ---------------------------------------------------------------------------
# Tier -> Groq model table
# Matches .claude/rules/redteam-forge.md "Multi-Provider LLM" + CLAUDE.md
# ---------------------------------------------------------------------------
TIER_TO_MODEL: dict[Tier, str] = {
    Tier.LOW:  "llama-3.1-8b-instant",
    Tier.HIGH: "llama-3.3-70b-versatile",
}

# Keywords that force HIGH regardless of scorer (thesis safety net)
_FORCE_HIGH_KEYWORDS = frozenset([
    "campaign", "campagne", "n=30", "n>=30",
    "conjecture", "hypothesis", "theorem",
    "these", "thesis", "manuscript",
    "fiche", "briefing",
])


@dataclass
class RoutingDecision:
    model: str
    tier: Tier
    source: str           # "forced" | "env" | "scored" | "inherit"
    score: Optional[int] = None
    signals: Optional[list] = None


class ModelRouter:
    """Select the appropriate Groq model for a task.

    Priority (highest first):
        1. `force` param — caller knows best
        2. `MEDICAL_MODEL` env var override (backward compat)
        3. Thesis campaign safety keywords → always HIGH
        4. Scorer result (TRIVIAL/MODERATE/COMPLEX tags + lexical)
    """

    def __init__(self) -> None:
        self._scorer = TaskScorer()

    def select(
        self,
        task: str | dict = "",
        force: Optional[str] = None,
        allow_env_override: bool = True,
    ) -> RoutingDecision:
        # 1. Caller-specified model (forceInherit pattern from OMC)
        if force:
            tier = self._tier_for_model(force)
            return RoutingDecision(model=force, tier=tier, source="forced")

        # 2. Env override (backward compat — existing scripts use MEDICAL_MODEL)
        if allow_env_override:
            env_model = os.environ.get("MEDICAL_MODEL", "").strip()
            if env_model:
                tier = self._tier_for_model(env_model)
                return RoutingDecision(model=env_model, tier=tier, source="env")

        text = (
            " ".join(str(v) for v in task.values() if isinstance(v, str))
            if isinstance(task, dict)
            else str(task)
        ).lower()

        # 3. Thesis campaign keywords → always HIGH
        if any(kw in text for kw in _FORCE_HIGH_KEYWORDS):
            model = TIER_TO_MODEL[Tier.HIGH]
            return RoutingDecision(model=model, tier=Tier.HIGH, source="campaign_rule")

        # 4. Scorer
        result = self._scorer.score(task)
        model = TIER_TO_MODEL[result.tier]
        return RoutingDecision(
            model=model,
            tier=result.tier,
            source="scored",
            score=result.score,
            signals=result.signals,
        )

    def _tier_for_model(self, model: str) -> Tier:
        """Infer tier from model name."""
        if "8b" in model or "3b" in model or "instant" in model:
            return Tier.LOW
        return Tier.HIGH

    def model_for(self, task: str | dict = "", force: Optional[str] = None) -> str:
        """Convenience — return just the model string."""
        return self.select(task, force=force).model


# Module-level singleton
router = ModelRouter()
