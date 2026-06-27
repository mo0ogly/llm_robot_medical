"""AEGIS observability — cost tracking + HUD metrics.

Ported from oh-my-claudecode src/hud/ (MIT).
Improvement: Groq public pricing (no Anthropic OAuth); a LangChain callback
(AegisCostCallback, attached in llm_factory.get_llm) records token usage on
every LLM call — chains, campaigns, and test routes alike.
"""
from .callback import AegisCostCallback
from .cost_tracker import CostTracker, tracker

__all__ = ["CostTracker", "tracker", "AegisCostCallback"]
