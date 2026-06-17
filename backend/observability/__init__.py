"""AEGIS observability — cost tracking + HUD metrics.

Ported from oh-my-claudecode src/hud/ (MIT).
Improvement: Groq public pricing, no Anthropic OAuth dependency.
"""
import logging

from .cost_tracker import CostTracker, tracker

__all__ = ["CostTracker", "tracker", "record_from_langchain_response"]

logger = logging.getLogger("aegis.observability")


def record_from_langchain_response(model, response) -> None:
    """Best-effort: pull token usage from a LangChain AIMessage and record it.

    Modern LangChain exposes `usage_metadata` (input_tokens/output_tokens);
    older paths carry it under `response_metadata['token_usage']`. NEVER raises
    — observability must not break the LLM call path.
    """
    try:
        usage = getattr(response, "usage_metadata", None)
        if usage:
            prompt_tokens = usage.get("input_tokens", 0)
            completion_tokens = usage.get("output_tokens", 0)
        else:
            meta = getattr(response, "response_metadata", None) or {}
            tok = meta.get("token_usage") or meta.get("usage") or {}
            prompt_tokens = tok.get("prompt_tokens", 0)
            completion_tokens = tok.get("completion_tokens", 0)
        if prompt_tokens or completion_tokens:
            tracker.record(model, prompt_tokens, completion_tokens)
    except Exception as exc:  # noqa: BLE001
        logger.debug("usage extraction failed: %s", exc)
