"""Provider adapter for F46 calibration — Ollama | Groq, direct HTTP.

Extracted from f46_calibration.py (2026-05-31, RUN-010 recreation) to keep that
file under the 800-line limit (.claude/rules/programming.md) and to make the
provider logic reusable/testable in isolation.

Provider selection (doctoral-research.md: Groq is the default cloud provider;
Ollama is local fallback only):
    LLM_PROVIDER=groq    (default when GROQ_API_KEY is set; needs a Groq model,
                          e.g. llama-3.3-70b-versatile or llama-3.1-8b-instant)
    LLM_PROVIDER=ollama  (local fallback when no key, or explicit override)

All provider branches feed the SAME deterministic judge downstream
(NOT LLM-judge; P044 documents 99.91% flip rate on LLM judges).
"""
from __future__ import annotations

import asyncio
import os
import sys
import time
from pathlib import Path

# Transient HTTP statuses worth retrying (rate limit + gateway/server errors).
# A bare run_grid/run_baseline call has no retry, so a single 429 would crash a
# multi-hour campaign; this matters most when two campaigns share Groq limits.
_RETRY_STATUSES = {429, 500, 502, 503, 504}
_MAX_RETRIES = 5

# Load backend/.env (walks up to main tree from a worktree).
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
try:
    from env_loader import load_backend_env
    load_backend_env()
except Exception:  # pragma: no cover - env_loader optional in some contexts
    pass

import httpx

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
BACKEND_URL = os.getenv("AEGIS_BACKEND", "http://127.0.0.1:8042")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")

# Number of baseline evaluations for the mandatory pre-check gate
# (doctoral-research.md "PRE-CHECK EXPERIMENTAL": 5 runs before any full campaign).
PRE_CHECK_RUNS = 5


def detect_default_provider() -> str:
    """Auto-detect provider: groq if GROQ_API_KEY is set, else ollama.

    Matches run_delta1_rag_campaign.py / run_thesis_campaign.py: an API key
    present is treated as explicit operator intent. Explicit LLM_PROVIDER wins.
    """
    explicit = os.getenv("LLM_PROVIDER", "").strip().lower()
    if explicit:
        return explicit
    return "groq" if GROQ_API_KEY else "ollama"


def default_model_for(provider: str) -> str:
    """Provider-aware default MEDICAL_MODEL (Groq cannot serve Ollama tags)."""
    return "llama-3.1-8b-instant" if provider == "groq" else "llama3.2:latest"


LLM_PROVIDER = detect_default_provider()
MEDICAL_MODEL = os.getenv("MEDICAL_MODEL") or default_model_for(LLM_PROVIDER)


async def _groq_generate(prompt: str, system: str, model: str, temperature: float) -> tuple:
    """Call Groq chat/completions via OpenAI-compatible REST."""
    if not GROQ_API_KEY:
        raise RuntimeError(
            "LLM_PROVIDER=groq but GROQ_API_KEY is not set. "
            "Export GROQ_API_KEY or switch to LLM_PROVIDER=ollama."
        )
    t0 = time.monotonic()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    payload = {"model": model, "messages": messages, "temperature": temperature, "max_tokens": 512}
    headers = {"Authorization": "Bearer " + GROQ_API_KEY, "Content-Type": "application/json"}
    data = None
    last_err = None
    for attempt in range(_MAX_RETRIES):
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                resp = await client.post(GROQ_BASE_URL + "/chat/completions",
                                         headers=headers, json=payload)
            if resp.status_code in _RETRY_STATUSES:
                ra = resp.headers.get("retry-after", "")
                delay = float(ra) if ra.replace(".", "", 1).isdigit() else min(2 ** attempt, 30)
                last_err = "HTTP " + str(resp.status_code)
                await asyncio.sleep(delay)
                continue
            resp.raise_for_status()  # non-retryable 4xx (e.g. 401) -> raise now
            data = resp.json()
            break
        except httpx.TransportError as e:  # connect/SSL/read errors -> backoff
            last_err = repr(e)
            await asyncio.sleep(min(2 ** attempt, 30))
    if data is None:
        raise RuntimeError("Groq request failed after %d retries: %s" % (_MAX_RETRIES, last_err))
    latency = (time.monotonic() - t0) * 1000
    try:
        text = data["choices"][0]["message"]["content"] or ""
    except (KeyError, IndexError, TypeError):
        text = ""
    return text, latency


async def _ollama_generate(prompt: str, system: str, model: str, temperature: float) -> tuple:
    """Call Ollama /api/generate directly for speed."""
    t0 = time.monotonic()
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            OLLAMA_HOST + "/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "system": system,
                "stream": False,
                "options": {"temperature": temperature, "num_predict": 512},
            },
        )
        resp.raise_for_status()
        data = resp.json()
    latency = (time.monotonic() - t0) * 1000
    return data.get("response", ""), latency


async def llm_generate(prompt: str, system: str, model: str = None, temperature: float = 0.0) -> tuple:
    """Dispatch to the configured provider. Returns (text, latency_ms)."""
    model = model or MEDICAL_MODEL
    if LLM_PROVIDER == "groq":
        return await _groq_generate(prompt, system, model, temperature)
    if LLM_PROVIDER == "ollama":
        return await _ollama_generate(prompt, system, model, temperature)
    raise RuntimeError("Unknown LLM_PROVIDER='" + LLM_PROVIDER + "'. Expected 'ollama' or 'groq'.")


async def provider_healthcheck(log) -> bool:
    """Verify the configured provider is reachable and the model is available."""
    if LLM_PROVIDER == "ollama":
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(OLLAMA_HOST + "/api/tags")
                resp.raise_for_status()
                models = [m["name"] for m in resp.json().get("models", [])]
                log.info("Ollama available. Models: %s", ", ".join(models))
                if (MEDICAL_MODEL not in models
                        and MEDICAL_MODEL.split(":")[0] not in [m.split(":")[0] for m in models]):
                    log.error("Model %s not found in Ollama. Pull it first.", MEDICAL_MODEL)
                    return False
            return True
        except Exception as e:
            log.error("Cannot reach Ollama at %s: %s", OLLAMA_HOST, e)
            return False
    if LLM_PROVIDER == "groq":
        if not GROQ_API_KEY:
            log.error("LLM_PROVIDER=groq but GROQ_API_KEY is empty.")
            return False
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(GROQ_BASE_URL + "/models",
                                        headers={"Authorization": "Bearer " + GROQ_API_KEY})
                resp.raise_for_status()
                available = [m.get("id", "") for m in resp.json().get("data", [])]
                log.info("Groq available. Models: %d listed", len(available))
                if available and MEDICAL_MODEL not in available:
                    log.warning("Model %s not listed on Groq; attempting anyway.", MEDICAL_MODEL)
            return True
        except Exception as e:
            log.error("Groq healthcheck failed: %s", e)
            return False
    log.error("Unknown LLM_PROVIDER='%s'", LLM_PROVIDER)
    return False
