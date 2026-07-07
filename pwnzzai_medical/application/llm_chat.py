"""LiteLLM-backed chat completions (replaces direct OpenAI SDK calls in labs)."""

from __future__ import annotations

from typing import Any, List, Optional

import litellm

from application.provider_config import MODEL_TIMEOUT_SECONDS, resolved_litellm_model
from application import internal_ai_engine


def normalize_litellm_model(model: Optional[str]) -> str:
    """Bare names (e.g. gpt-3.5-turbo) become openai/ routes; None uses configured default."""
    if model is None or not str(model).strip():
        return resolved_litellm_model()
    m = str(model).strip()
    if "/" in m:
        return m
    return f"openai/{m}"


def _internal_ai_kwargs(model: Optional[str]) -> dict:
    """When INTERNAL-AI is active and no explicit model is requested, route this call to
    the selected INTERNAL-AI model at its per-model base_url (same engine as the
    simulator). Returns litellm kwargs to merge, or {} to keep the default path."""
    if model is not None and str(model).strip():
        return {}
    r = internal_ai_engine.resolve()
    if not r:
        return {}
    return {"model": r["litellm_model"], "api_base": r["api_base"], "api_key": r["api_key"]}


def _assistant_text(response: Any) -> str:
    if not getattr(response, "choices", None):
        return "No response content received from the model"
    msg = response.choices[0].message
    content = getattr(msg, "content", None)
    if content is None:
        return "No response content received from the model"
    return content


def chat_completion(
    messages: List[dict],
    *,
    api_key: Optional[str],
    model: Optional[str] = None,
    temperature: Optional[float] = None,
    max_tokens: Optional[int] = None,
) -> str:
    kwargs: dict[str, Any] = {
        "model": normalize_litellm_model(model),
        "messages": messages,
        "timeout": MODEL_TIMEOUT_SECONDS,
    }
    if api_key:
        kwargs["api_key"] = api_key
    if temperature is not None:
        kwargs["temperature"] = temperature
    if max_tokens is not None:
        kwargs["max_tokens"] = max_tokens
    kwargs.update(_internal_ai_kwargs(model))  # route to the selected INTERNAL-AI model if active
    try:
        response = litellm.completion(**kwargs)
        return _assistant_text(response)
    except Exception as e:
        err = str(e).lower()
        if "authentication" in err or "api key" in err:
            return "Error: Invalid API key. Please provide a valid API key."
        if "rate limit" in err:
            return "Error: API rate limit exceeded. Please try again later."
        return f"Error: {str(e)}"


def completion_with_tools(
    messages: List[dict],
    *,
    api_key: str,
    tools: List[dict],
    tool_choice: str = "auto",
    model: Optional[str] = None,
) -> Any:
    kwargs: dict[str, Any] = {
        "model": normalize_litellm_model(model),
        "messages": messages,
        "tools": tools,
        "tool_choice": tool_choice,
        "timeout": MODEL_TIMEOUT_SECONDS,
        "api_key": api_key,
    }
    kwargs.update(_internal_ai_kwargs(model))
    return litellm.completion(**kwargs)


def completion_followup(messages: List[dict], *, api_key: str, model: Optional[str] = None) -> Any:
    kwargs: dict[str, Any] = {
        "model": normalize_litellm_model(model),
        "messages": messages,
        "timeout": MODEL_TIMEOUT_SECONDS,
        "api_key": api_key,
    }
    kwargs.update(_internal_ai_kwargs(model))
    return litellm.completion(**kwargs)


def format_tool_error(e: Exception) -> str:
    err = str(e).lower()
    if "authentication" in err or "api key" in err:
        return "Error: Invalid API key. Please provide a valid API key."
    if "rate limit" in err:
        return "Error: API rate limit exceeded. Please try again later."
    return f"Error: {str(e)}"
