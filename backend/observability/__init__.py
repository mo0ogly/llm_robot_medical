"""AEGIS observability — cost tracking + HUD metrics.

Ported from oh-my-claudecode src/hud/ (MIT).
Improvement: Groq public pricing, no Anthropic OAuth dependency.
"""
from .cost_tracker import CostTracker, tracker

__all__ = ["CostTracker", "tracker"]
