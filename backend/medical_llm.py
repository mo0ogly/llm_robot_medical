"""
medical_llm.py — the dashboard's medical/cyber AI, backed by INTERNAL-AI (or any
configured OpenAI-compatible backend), NOT Ollama.

Drop-in replacement for the subset of the Ollama ``AsyncClient`` surface that
``server.py`` uses (``list`` + ``chat`` in stream / non-stream / tool-calling
modes), so the streaming endpoints keep working unchanged. It resolves the
ACTIVE backend from the AI engine (``ai_engine.ai_store``) — seeded to INTERNAL-AI —
and speaks the OpenAI wire.

Why this exists: the app previously called a local Ollama that is not running,
so every AI call hung with no timeout and accumulated until the single uvicorn
worker wedged (dashboard stuck on "Initialisation…"). Here every call has a hard
timeout and targets a live gateway, so a slow/dead endpoint fails fast instead of
freezing the whole API.
"""

import json

import httpx
from openai import AsyncOpenAI

from ai_engine import ai_store

# Fail-fast: a dead endpoint errors in seconds instead of hanging the event loop.
# Read is generous enough for a streamed medical answer, connect is short.
_TIMEOUT = httpx.Timeout(connect=5.0, read=90.0, write=10.0, pool=5.0)


class NoBackendError(RuntimeError):
    """Raised when no active AI backend is configured/resolvable."""


def _resolve():
    """The active backend as ``{api_base, key, model}`` — or None."""
    r = ai_store.STORE.resolve()
    if not r or not r.get("api_base") or not r.get("key"):
        return None
    return r


# Reuse one AsyncOpenAI client per (endpoint, key). Creating a fresh client per
# call leaks its httpx connection pool + file descriptors; under the dashboard's
# 20s auto-trigger they pile up until the single worker wedges (the recurring
# "Initialisation…" freeze). Bounded to the number of distinct backends (~6), with
# HTTP keep-alive reused across calls.
_clients: dict[tuple, AsyncOpenAI] = {}


def _client(api_base: str, key: str) -> AsyncOpenAI:
    k = (api_base, key)
    c = _clients.get(k)
    if c is None:
        c = AsyncOpenAI(base_url=api_base, api_key=key, timeout=_TIMEOUT, max_retries=0)
        _clients[k] = c
    return c


async def _stream_wrap(resp):
    """Adapt an OpenAI streaming response to the Ollama chunk shape the endpoints
    consume: ``chunk["message"]["content"]``."""
    async for chunk in resp:
        choices = getattr(chunk, "choices", None)
        if not choices:
            continue
        delta = choices[0].delta
        token = getattr(delta, "content", None)
        if token:
            yield {"message": {"content": token}}


class MedicalLLM:
    """Ollama-shaped facade over the active OpenAI-compatible backend (INTERNAL-AI)."""

    async def list(self):
        """``/api/models`` + ``/health`` helper: the configured backends' models,
        in Ollama's ``{"models": [{"name": ...}]}`` shape. No network call — the
        active backend's health is proven by an actual chat, not by listing."""
        backends = ai_store.STORE.list_backends()
        if not backends:
            raise NoBackendError("No AI backend configured (see the AI settings panel).")
        return {"models": [{"name": b["model"]} for b in backends]}

    async def chat(self, model=None, messages=None, stream=False, tools=None, **_):
        """OpenAI-wire chat against the ACTIVE backend. ``model`` (an Ollama name)
        is ignored — the active backend pins the real model. Returns Ollama-shaped
        output so server.py is unchanged."""
        r = _resolve()
        if r is None:
            raise NoBackendError("No active AI backend configured (see the AI settings panel).")
        client = _client(r["api_base"], r["key"])
        real_model = r["model"]

        if stream:
            resp = await client.chat.completions.create(
                model=real_model, messages=messages, stream=True, temperature=0.7,
            )
            return _stream_wrap(resp)

        kwargs = {"model": real_model, "messages": messages, "temperature": 0.7}
        if tools:
            kwargs["tools"] = tools
        try:
            resp = await client.chat.completions.create(**kwargs)
        except Exception:
            # Some gateways/models reject a tools payload — retry once without it
            # so the dashboard still gets a text answer instead of an error.
            if tools:
                kwargs.pop("tools", None)
                resp = await client.chat.completions.create(**kwargs)
            else:
                raise

        msg = resp.choices[0].message
        tool_calls = []
        for tc in (getattr(msg, "tool_calls", None) or []):
            try:
                args = json.loads(tc.function.arguments or "{}")
            except (json.JSONDecodeError, TypeError):
                args = {}
            tool_calls.append({"function": {"name": tc.function.name, "arguments": args}})
        return {"message": {"content": msg.content or "", "tool_calls": tool_calls}}
