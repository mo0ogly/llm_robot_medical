"""LLM Factory — Provider-agnostic model instantiation.

Centralizes LLM and embedding creation so that every attack chain
can switch between Ollama (default), OpenAI, or Anthropic without
code changes. Configuration is driven by environment variables:

    LLM_PROVIDER   = ollama | openai | anthropic   (default: ollama)
    OLLAMA_MODEL   = model name for Ollama          (default: from autogen_config)
    OLLAMA_HOST    = Ollama server URL               (default: from autogen_config)
    OPENAI_API_KEY = OpenAI key (if provider=openai)

This module is the SINGLE source of truth for model instantiation
across all attack chains. No chain should directly import ChatOllama
or ChatOpenAI.

Reference:
    Original templates hardcoded ChatOpenAI() or ChatOllama("zephyr").
    This factory replaces all such hardcodings with a unified interface.

Date created: 2026-03-27
Last updated: 2026-03-27
Improvement: L3 (major — replaces hardcoded providers)
"""

import json
import logging
import os
import sys
from pathlib import Path

_backend_dir = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

logger = logging.getLogger(__name__)

# --- Multi-model configuration (Zhang et al. 2025) ---

_MODELS_CONFIG_PATH = Path(__file__).parent.parent.parent / "prompts" / "models_config.json"
_LLM_PROVIDERS_CONFIG_PATH = Path(__file__).parent.parent.parent / "prompts" / "llm_providers_config.json"
_models_config = None
_llm_providers_config = None


def get_llm_providers_config() -> dict:
    """Load multi-provider LLM configuration from llm_providers_config.json."""
    global _llm_providers_config
    if _llm_providers_config is None:
        if _LLM_PROVIDERS_CONFIG_PATH.exists():
            with open(_LLM_PROVIDERS_CONFIG_PATH, encoding="utf-8") as f:
                _llm_providers_config = json.load(f)
        else:
            logger.warning(f"LLM providers config not found at {_LLM_PROVIDERS_CONFIG_PATH}")
            _llm_providers_config = {"providers": {}}
    return _llm_providers_config


def get_models_config() -> dict:
    """Load multi-model configuration from models_config.json."""
    global _models_config
    if _models_config is None:
        if _MODELS_CONFIG_PATH.exists():
            with open(_MODELS_CONFIG_PATH, encoding="utf-8") as f:
                _models_config = json.load(f)
        else:
            _models_config = {"profiles": {}, "active_profile": "default"}
    return _models_config


def get_active_profile() -> dict:
    """Return the currently active model profile."""
    config = get_models_config()
    profile_id = config.get("active_profile", "default")
    return config.get("profiles", {}).get(profile_id, {})


def set_active_profile(profile_id: str) -> bool:
    """Set the active model profile and persist to disk."""
    config = get_models_config()
    if profile_id not in config.get("profiles", {}):
        return False
    config["active_profile"] = profile_id
    with open(_MODELS_CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    return True


def get_full_config() -> dict:
    """Return providers list enriched with model profiles and experimental params.

    This is a NEW function that does NOT modify get_available_providers()
    return type, to avoid breaking existing consumers.
    """
    providers = get_available_providers()
    config = get_models_config()
    return {
        "providers": providers,
        "profiles": config.get("profiles", {}),
        "active_profile": config.get("active_profile", "default"),
        "judge_profile": config.get("judge_profile", "judge_default"),
        "experimental_params": config.get("experimental_params", {}),
    }


# Import lab config (Ollama defaults)
try:
    from autogen_config import MEDICAL_MODEL, OLLAMA_HOST
except ImportError:
    MEDICAL_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
    OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")


def get_provider() -> str:
    """Return the active LLM provider name.

    Reads LLM_PROVIDER env var. Defaults to 'ollama'.

    Returns:
        One of: 'ollama', 'openai', 'anthropic'.
    """
    return os.getenv("LLM_PROVIDER", "ollama").lower()


def get_llm(temperature: float = 0.0, model: str | None = None, provider: str | None = None, **kwargs):
    """Create a ChatModel instance for the active provider.

    Args:
        temperature: Sampling temperature (0.0 = deterministic).
        model: Override model name. If None, uses provider default.
        provider: Override provider name. If None, reads from LLM_PROVIDER env var.
        **kwargs: Additional kwargs passed to the ChatModel constructor.

    Returns:
        A LangChain ChatModel (ChatOllama, ChatOpenAI, ChatAnthropic, ChatGroq).

    Raises:
        ValueError: If provider is unknown.
        ImportError: If required provider package is not installed.
    """
    if provider is None:
        provider = get_provider()

    if provider == "ollama":
        # Note: Meditron models have NO separate safety alignment (RLHF/DPO).
        # Testing on Meditron validates delta-0 = 0 hypothesis (Zhang et al. 2025).
        # Install via: ollama pull meditron:7b
        from langchain_ollama import ChatOllama
        return ChatOllama(
            model=model or MEDICAL_MODEL,
            base_url=OLLAMA_HOST,
            temperature=temperature,
            **kwargs,
        )
    elif provider == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=model or "gpt-4o-mini",
            temperature=temperature,
            **kwargs,
        )
    elif provider == "anthropic":
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(
            model=model or "claude-sonnet-4-20250514",
            temperature=temperature,
            **kwargs,
        )
    elif provider == "groq":
        try:
            from langchain_groq import ChatGroq
        except ImportError:
            raise ImportError("langchain-groq not installed. Run: pip install langchain-groq")
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError(
                "Missing credential: GROQ_API_KEY not set in environment.\n"
                "Set it: export GROQ_API_KEY=your_groq_api_key"
            )
        return ChatGroq(
            model=model or os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            api_key=api_key,
            temperature=temperature,
            **kwargs,
        )
    elif provider == "openai-compatible":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=model or os.getenv("OPENAI_COMPAT_MODEL", "gpt-4o-mini"),
            base_url=os.getenv("OPENAI_COMPAT_BASE_URL", ""),
            api_key=os.getenv("OPENAI_COMPAT_API_KEY", "not-needed"),
            temperature=temperature,
            **kwargs,
        )
    elif provider == "google":
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
        except ImportError:
            raise ImportError("langchain-google-genai not installed. Run: pip install langchain-google-genai")
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError(
                "Missing credential: GOOGLE_API_KEY not set in environment.\n"
                "Set it: export GOOGLE_API_KEY=your_google_api_key"
            )
        return ChatGoogleGenerativeAI(
            model=model or "gemini-2.0-flash",
            google_api_key=api_key,
            temperature=temperature,
            **kwargs,
        )
    elif provider == "xai":
        # xAI Grok uses OpenAI-compatible API
        from langchain_openai import ChatOpenAI
        api_key = os.getenv("XAI_API_KEY")
        if not api_key:
            raise ValueError(
                "Missing credential: XAI_API_KEY not set in environment.\n"
                "Set it: export XAI_API_KEY=your_xai_api_key"
            )
        return ChatOpenAI(
            model=model or "grok-3",
            base_url="https://api.x.ai/v1",
            api_key=api_key,
            temperature=temperature,
            **kwargs,
        )
    else:
        raise ValueError(
            f"Unknown LLM_PROVIDER='{provider}'. "
            f"Supported: ollama, openai, anthropic, groq, google, xai, openai-compatible"
        )


def get_available_providers() -> list:
    """Return list of available LLM providers with their status.

    Each entry contains: id, name, status ('available' or 'no_api_key'),
    and a list of known models for that provider.

    Returns:
        List of dicts describing each provider.
    """
    providers = [
        {
            "id": "ollama",
            "name": "Ollama (Local)",
            "status": "available",
            "models": [
                os.getenv("MEDICAL_MODEL", MEDICAL_MODEL),
                "meditron:7b",   # Medical LLM, NO safety alignment (delta-0 ~ 0, Zhang et al. 2025)
                "meditron:70b",  # Medical LLM, NO safety alignment (delta-0 ~ 0, Zhang et al. 2025)
            ],
        },
    ]
    if os.getenv("GROQ_API_KEY"):
        providers.append({
            "id": "groq",
            "name": "Groq Cloud",
            "status": "available",
            "models": ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
        })
    else:
        providers.append({
            "id": "groq",
            "name": "Groq Cloud",
            "status": "no_api_key",
            "models": ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
        })
    if os.getenv("OPENAI_COMPAT_BASE_URL"):
        providers.append({
            "id": "openai-compatible",
            "name": "OpenAI Compatible",
            "status": "available",
            "models": [os.getenv("OPENAI_COMPAT_MODEL", "gpt-4o-mini")],
        })
    if os.getenv("OPENAI_API_KEY"):
        providers.append({
            "id": "openai",
            "name": "OpenAI",
            "status": "available",
            "models": ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"],
        })
    if os.getenv("ANTHROPIC_API_KEY"):
        providers.append({
            "id": "anthropic",
            "name": "Anthropic",
            "status": "available",
            "models": ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
        })
    if os.getenv("GOOGLE_API_KEY"):
        providers.append({
            "id": "google",
            "name": "Google Gemini",
            "status": "available",
            "models": ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
        })
    else:
        providers.append({
            "id": "google",
            "name": "Google Gemini",
            "status": "no_api_key",
            "models": ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
        })
    if os.getenv("XAI_API_KEY"):
        providers.append({
            "id": "xai",
            "name": "xAI Grok",
            "status": "available",
            "models": ["grok-3", "grok-2"],
        })
    else:
        providers.append({
            "id": "xai",
            "name": "xAI Grok",
            "status": "no_api_key",
            "models": ["grok-3", "grok-2"],
        })
    return providers


def get_embeddings(model: str | None = None, **kwargs):
    """Create an Embeddings instance for the active provider.

    For Ollama, uses OllamaEmbeddings (local, no API key needed).
    For OpenAI, uses OpenAIEmbeddings.

    Args:
        model: Override embedding model name.
        **kwargs: Additional kwargs.

    Returns:
        A LangChain Embeddings instance.
    """
    provider = get_provider()

    if provider == "ollama":
        # Determine embedding model: prefer nomic-embed-text, fallback to LLM model
        embed_model = model or os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
        try:
            from langchain_ollama import OllamaEmbeddings
            return OllamaEmbeddings(
                model=embed_model,
                base_url=OLLAMA_HOST,
                **kwargs,
            )
        except ImportError:
            from langchain_community.embeddings import OllamaEmbeddings as OE
            return OE(
                model=embed_model,
                base_url=OLLAMA_HOST,
                **kwargs,
            )
    elif provider in ("openai", "anthropic"):
        from langchain_openai import OpenAIEmbeddings
        return OpenAIEmbeddings(model=model or "text-embedding-3-small", **kwargs)
    else:
        raise ValueError(f"Unknown LLM_PROVIDER='{provider}'")


def get_chroma_vectorstore(
    collection_name: str = "attack-chain-default",
    persist_directory: str | None = None,
    embedding=None,
):
    """Create or load a Chroma vectorstore.

    Convenience wrapper that combines get_embeddings() with Chroma.

    Args:
        collection_name: ChromaDB collection name.
        persist_directory: Directory for persistent storage. None = in-memory.
        embedding: Override embedding model. If None, uses get_embeddings().

    Returns:
        A LangChain Chroma vectorstore instance.
    """
    from langchain_chroma import Chroma

    emb = embedding or get_embeddings()
    kwargs = {
        "collection_name": collection_name,
        "embedding_function": emb,
    }
    if persist_directory:
        kwargs["persist_directory"] = persist_directory

    return Chroma(**kwargs)
