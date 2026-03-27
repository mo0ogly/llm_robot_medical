"""LLM Bridge — Ollama-native completion interface.

Replaces the deprecated OpenAI v0.27 ``completion_with_chatgpt()`` function
from the original implementation (util/openai_util.py) with a modern,
async-capable Ollama interface that is consistent with the existing lab
infrastructure (autogen_config.py).

Improvements over original:
    - Ollama native API instead of deprecated ``openai.ChatCompletion.create()``
    - Async support via ``ollama.AsyncClient``
    - Retry logic with exponential backoff (3 attempts)
    - Configurable timeout (default 120s)
    - Uses MEDICAL_MODEL from autogen_config (environment variable)

Reference:
    Original: Liu et al. (2023), util/openai_util.py
    Function: ``completion_with_chatgpt(text, model="gpt-4")``
"""

import asyncio
import logging
import os
import sys

# Add parent paths so autogen_config is importable when running standalone
_backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

from autogen_config import MEDICAL_MODEL, OLLAMA_HOST

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------
DEFAULT_MODEL: str = MEDICAL_MODEL
DEFAULT_TIMEOUT: int = 120
MAX_RETRIES: int = 3
RETRY_BACKOFF_BASE: float = 2.0


async def completion_with_ollama(
    prompt: str,
    model: str | None = None,
    temperature: float = 0.7,
    timeout: int = DEFAULT_TIMEOUT,
) -> str:
    """Send a single-turn completion request to Ollama and return the response text.

    This is the async replacement for the original ``completion_with_chatgpt()``
    which used the deprecated ``openai.ChatCompletion.create()`` API (v0.27).

    Args:
        prompt: The user prompt to send to the model.
        model: Ollama model name. Defaults to MEDICAL_MODEL from env/config.
        temperature: Sampling temperature (0.0-1.0). Default 0.7.
        timeout: Request timeout in seconds. Default 120.

    Returns:
        The model's response text content.

    Raises:
        RuntimeError: If all retry attempts fail.

    Example:
        >>> response = await completion_with_ollama("What is the clip tension?")
        >>> print(response)
        'The current vascular clip tension is 320g...'
    """
    import ollama as ollama_lib

    resolved_model = model or DEFAULT_MODEL
    client = ollama_lib.AsyncClient(host=OLLAMA_HOST)
    last_error: Exception | None = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = await asyncio.wait_for(
                client.chat(
                    model=resolved_model,
                    messages=[{"role": "user", "content": prompt}],
                    options={"temperature": temperature},
                ),
                timeout=timeout,
            )
            content = response["message"]["content"]
            logger.debug(
                "LLM completion OK (model=%s, attempt=%d, len=%d)",
                resolved_model,
                attempt,
                len(content),
            )
            return content

        except asyncio.TimeoutError:
            last_error = TimeoutError(
                f"Ollama request timed out after {timeout}s (attempt {attempt}/{MAX_RETRIES})"
            )
            logger.warning("Timeout on attempt %d/%d", attempt, MAX_RETRIES)

        except Exception as exc:
            last_error = exc
            logger.warning(
                "LLM completion error on attempt %d/%d: %s",
                attempt,
                MAX_RETRIES,
                exc,
            )

        if attempt < MAX_RETRIES:
            backoff = RETRY_BACKOFF_BASE ** attempt
            logger.info("Retrying in %.1fs...", backoff)
            await asyncio.sleep(backoff)

    raise RuntimeError(
        f"All {MAX_RETRIES} LLM completion attempts failed. Last error: {last_error}"
    )


def completion_with_ollama_sync(
    prompt: str,
    model: str | None = None,
    temperature: float = 0.7,
    timeout: int = DEFAULT_TIMEOUT,
) -> str:
    """Synchronous wrapper around :func:`completion_with_ollama`.

    Convenience function for contexts where an event loop is not already
    running (e.g. unit tests, scripts).

    Args:
        prompt: The user prompt to send to the model.
        model: Ollama model name. Defaults to MEDICAL_MODEL.
        temperature: Sampling temperature. Default 0.7.
        timeout: Request timeout in seconds. Default 120.

    Returns:
        The model's response text content.
    """
    return asyncio.run(
        completion_with_ollama(prompt, model, temperature, timeout)
    )
