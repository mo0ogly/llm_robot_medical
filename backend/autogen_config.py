"""Configuration AutoGen (AG2) pour Ollama local + multi-provider.

Supports dynamic provider switching via get_llm_config(model, provider).
Provider configs map to OAI-compatible endpoints used by AG2 agents.
"""
import os

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")

# Modèles disponibles via Ollama
MEDICAL_MODEL = os.getenv("MEDICAL_MODEL", "llama3.2:latest")
CYBER_MODEL = os.getenv("CYBER_MODEL", "saki007ster/CybersecurityRiskAnalyst:latest")


def get_ollama_config(model: str) -> dict:
    """Retourne la config OAI-compatible pour un modèle Ollama."""
    return {
        "model": model,
        "base_url": OLLAMA_HOST + "/v1",
        "api_key": "ollama",
        "price": [0, 0],
    }


def _get_provider_config(model: str, provider: str) -> dict:
    """Return an OAI-compatible config dict for the given provider.

    AG2 agents use OpenAI-compatible API format. Most cloud providers
    (Groq, OpenAI, Anthropic via proxy) expose such endpoints.

    Args:
        model: Model name to use.
        provider: One of 'ollama', 'groq', 'openai', 'openai-compatible', 'anthropic'.

    Returns:
        Config dict suitable for AG2 config_list.
    """
    if provider == "ollama":
        return get_ollama_config(model)
    elif provider == "groq":
        return {
            "model": model or os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            "base_url": "https://api.groq.com/openai/v1",
            "api_key": os.getenv("GROQ_API_KEY", ""),
            "price": [0, 0],
        }
    elif provider == "openai":
        return {
            "model": model or "gpt-4o-mini",
            "api_key": os.getenv("OPENAI_API_KEY", ""),
            "price": [0, 0],
        }
    elif provider == "openai-compatible":
        return {
            "model": model or os.getenv("OPENAI_COMPAT_MODEL", "gpt-4o-mini"),
            "base_url": os.getenv("OPENAI_COMPAT_BASE_URL", ""),
            "api_key": os.getenv("OPENAI_COMPAT_API_KEY", "not-needed"),
            "price": [0, 0],
        }
    elif provider == "anthropic":
        # Anthropic via OAI-compatible proxy (e.g. LiteLLM)
        return {
            "model": model or "claude-sonnet-4-20250514",
            "api_key": os.getenv("ANTHROPIC_API_KEY", ""),
            "price": [0, 0],
        }
    else:
        # Fallback to Ollama
        return get_ollama_config(model)


def get_llm_config(model: str, provider: str | None = None) -> dict:
    """Retourne la llm_config complète pour un ConversableAgent AG2.

    Args:
        model: Model name.
        provider: Provider override. If None, uses Ollama (default).

    Returns:
        AG2 llm_config dict with config_list, temperature, timeout.
    """
    if provider is None or provider == "ollama":
        config = get_ollama_config(model)
    else:
        config = _get_provider_config(model, provider)
    return {
        "config_list": [config],
        "temperature": 0.7,
        "timeout": 120,
    }
