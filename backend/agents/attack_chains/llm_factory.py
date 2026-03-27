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

import logging
import os
import sys

_backend_dir = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

logger = logging.getLogger(__name__)

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


def get_llm(temperature: float = 0.0, model: str | None = None, **kwargs):
    """Create a ChatModel instance for the active provider.

    Args:
        temperature: Sampling temperature (0.0 = deterministic).
        model: Override model name. If None, uses provider default.
        **kwargs: Additional kwargs passed to the ChatModel constructor.

    Returns:
        A LangChain ChatModel (ChatOllama, ChatOpenAI, or ChatAnthropic).

    Raises:
        ValueError: If provider is unknown.
        ImportError: If required provider package is not installed.
    """
    provider = get_provider()

    if provider == "ollama":
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
    else:
        raise ValueError(
            f"Unknown LLM_PROVIDER='{provider}'. "
            f"Supported: ollama, openai, anthropic"
        )


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
