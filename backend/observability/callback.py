"""LangChain callback that feeds the cost tracker on every LLM call.

Attached in `llm_factory.get_llm`, so EVERY chain/campaign/test call records its
token usage into the HUD — not just the `/llm-compare` route. This replaces the
narrower hook that lived in `routes/llm_providers_routes.call_llm` (which only
covered one path and would double-count once this callback is active).

`on_llm_end` NEVER raises — observability must not break an LLM call.
"""
from __future__ import annotations

import logging

from langchain_core.callbacks import BaseCallbackHandler

from .cost_tracker import tracker

logger = logging.getLogger("aegis.observability.callback")


def _extract(response) -> tuple:
    """Pull (model, prompt_tokens, completion_tokens) from a LangChain LLMResult.

    Providers differ: OpenAI/Groq expose `llm_output['token_usage']` +
    `model_name`; the LangChain-standard path carries `usage_metadata`
    (input_tokens/output_tokens) on the generation message. Try both.
    """
    model = "unknown"
    prompt_tokens = 0
    completion_tokens = 0

    out = getattr(response, "llm_output", None) or {}
    if isinstance(out, dict):
        model = out.get("model_name") or out.get("model") or model
        usage = out.get("token_usage") or out.get("usage") or {}
        if isinstance(usage, dict):
            prompt_tokens = usage.get("prompt_tokens", 0) or 0
            completion_tokens = usage.get("completion_tokens", 0) or 0

    if not (prompt_tokens or completion_tokens):
        try:
            gen = response.generations[0][0]
            msg = getattr(gen, "message", None)
            meta = getattr(msg, "usage_metadata", None) or {}
            prompt_tokens = meta.get("input_tokens", 0) or 0
            completion_tokens = meta.get("output_tokens", 0) or 0
            if model == "unknown" and msg is not None:
                rmeta = getattr(msg, "response_metadata", None) or {}
                model = rmeta.get("model_name") or rmeta.get("model") or model
        except (AttributeError, IndexError, TypeError):
            pass

    return model, prompt_tokens, completion_tokens


class AegisCostCallback(BaseCallbackHandler):
    """Records prompt/completion tokens into the shared cost tracker."""

    def on_llm_end(self, response, **kwargs) -> None:
        try:
            model, prompt_tokens, completion_tokens = _extract(response)
            if prompt_tokens or completion_tokens:
                tracker.record(model, prompt_tokens, completion_tokens)
        except Exception as exc:  # noqa: BLE001 - never break the LLM call
            logger.debug("cost callback extraction failed: %s", exc)
