"""Attack Chains — LangChain-based attack technique library.

Ported from the langchain-templates collection in the original prompt
injection research framework (Liu et al., 2023, arXiv:2306.05499).

All chains are AI-agnostique: they use ``llm_factory`` to instantiate
models via Ollama (default), OpenAI, or Anthropic based on environment.
No chain directly hardcodes a provider.

Architecture:
    attack_chains/
    ├── __init__.py              # This file — registry + factory
    ├── llm_factory.py           # Provider-agnostic LLM/embedding factory
    ├── rag_multi_query.py       # B2.1 — Multi-query retrieval (Ollama+Chroma)
    ├── rag_private.py           # B2.3 — Fully private RAG (Ollama+local embed)
    ├── rag_basic.py             # B2.2 — Basic RAG (Chroma)
    ├── sql_chain.py             # B2.4 — SQL generation via LLM + memory
    ├── pii_guard.py             # B2.9 — PII detection + conditional routing
    └── ...                      # Additional chains (PARTIE 2B-2D)

Reference:
    Liu, Y., Deng, G., Li, Y. et al. (2023).
    "Prompt Injection attack against LLM-integrated Applications"
    arXiv:2306.05499

Date created: 2026-03-27
Last updated: 2026-03-27
"""

from .llm_factory import get_llm, get_embeddings

# Chain registry — maps chain_id to lazy loader
CHAIN_REGISTRY: dict = {}


def register_chain(chain_id: str, description: str, source_template: str):
    """Decorator to register an attack chain in the global registry.

    Args:
        chain_id: Unique identifier (e.g. 'rag_multi_query').
        description: Human-readable description for the UI catalog.
        source_template: Original langchain-template name for traceability.

    Returns:
        Decorator that adds the chain builder to CHAIN_REGISTRY.
    """
    def decorator(fn):
        CHAIN_REGISTRY[chain_id] = {
            "builder": fn,
            "description": description,
            "source": source_template,
        }
        return fn
    return decorator


def build_chain(chain_id: str, **kwargs):
    """Build and return an attack chain by ID.

    Args:
        chain_id: Registered chain identifier.
        **kwargs: Passed to the chain builder function.

    Returns:
        A LangChain Runnable (chain) ready for invocation.

    Raises:
        KeyError: If chain_id is not registered.
    """
    if chain_id not in CHAIN_REGISTRY:
        raise KeyError(
            f"Unknown chain '{chain_id}'. "
            f"Available: {list(CHAIN_REGISTRY.keys())}"
        )
    return CHAIN_REGISTRY[chain_id]["builder"](**kwargs)


def list_chains() -> list[dict]:
    """Return metadata for all registered chains.

    Returns:
        List of dicts with keys: id, description, source.
    """
    return [
        {"id": k, "description": v["description"], "source": v["source"]}
        for k, v in CHAIN_REGISTRY.items()
    ]


# Auto-import all chain modules to trigger @register_chain decorators.
# Uses safe imports so the package loads even without langchain installed
# (frontend-only dev, or when langchain is only the *target* not a dep).
import importlib as _il
import logging as _log

_CHAIN_MODULES = [
    # PARTIE 2A — Stack-compatible templates
    ("rag_multi_query",       "B2.1"),   # Mapped: T37 (PIDP compound RAG)
    ("rag_private",           "B2.3"),   # Mapped: T38 (persistent RAG poisoning)
    ("rag_basic",             "B2.2"),   # Mapped: T37, T38 (RAG attack surface)
    ("sql_chain",             "B2.4"),   # Mapped: RUN-001/RUN-002
    ("pii_guard",             "B2.9"),   # Mapped: RUN-001/RUN-002
    # PARTIE 2B — Advanced attack techniques
    ("hyde_chain",            "B1.5"),   # Mapped: RUN-002
    ("rag_fusion",            "B1.7"),   # Mapped: T37, T40 (compound attack)
    ("rewrite_retrieve_read", "B1.9"),   # Mapped: RUN-002
    ("critique_revise",       "B1.1"),   # Mapped: T47 (iterative optimization)
    ("skeleton_of_thought",   "B1.10"),  # Mapped: RUN-002
    ("stepback_chain",        "B1.12"),  # Mapped: RUN-002
    ("propositional_chain",   "B1.6"),   # Coverage: T41 (semantic RLHF exploitation) — propositional decomposition enables semantic-level jailbreak via factoid separation (δ⁰ attack surface)
    ("extraction_chain",      "B1.2+B1.3"),  # Mapped: T46 (in-document injection)
    # PARTIE 2C — Agent patterns
    ("solo_agent",            "B1.11"),  # Mapped: T36 (automated agent injection)
    ("tool_retrieval_agent",  "B1.18"),  # Mapped: RUN-001/RUN-002
    ("multi_index_fusion",    "B1.15"),  # Mapped: RUN-002
    ("router_chain",          "B1.16"),  # Mapped: RUN-001/RUN-002
    ("guardrails_chain",      "B1.4"),   # Mapped: RUN-001/RUN-002
    # PARTIE 2D — Infrastructure templates
    ("xml_agent",             "B1.19"),  # Coverage: T46 (in-document injection) — XML structure enables hidden instruction injection via markup attributes (δ¹ attack surface)
    ("iterative_search",      "B1.20"),  # Mapped: RUN-002
    ("rag_conversation",      "B1.21"),  # Mapped: RUN-002
    ("chain_of_note",         "B1.22"),  # Mapped: RUN-002
    ("research_chain",        "B1.23"),  # Coverage: T32 (taxonomy gap exploitation) — research pipeline processes external documents, enabling P059-style in-document injection (δ¹/δ² attack surface)
    # PARTIE 2E — Remaining high-priority templates
    ("prompt_override",       "B1.24"),  # Mapped: RUN-002
    ("self_query",            "B1.25"),  # Coverage: T37 (PIDP compound attack) — self-query metadata filters can be manipulated to steer retrieval toward poisoned passages (δ² attack surface)
    ("csv_agent",             "B1.26"),  # Mapped: RUN-002
    ("functions_agent",       "B1.27"),  # Mapped: RUN-001/RUN-002
    ("sql_research",          "B1.28"),  # Mapped: RUN-002
    ("rag_semi_structured",   "B1.29"),  # Mapped: T38, T44 (semi-structured exploitation)
    # PARTIE 2F — Medium-priority templates
    ("feedback_poisoning",    "B1.30"),  # Mapped: RUN-002
    ("transactional_agent",   "B1.31"),  # Mapped: RUN-002
    ("retrieval_agent",       "B1.32"),  # Coverage: T36, T38 (automated agent injection + persistent RAG poisoning) — retrieval agent combines tool access with RAG, creating compound attack surface (δ¹/δ² attack surface)
    ("summarize_chain",       "B1.33"),  # Coverage: T39 (shallow RLHF late-sequence injection) — summarization concentrates information into shorter output, amplifying late-sequence injection effects on δ⁰ alignment
    # PARTIE 2G — Multi-modal templates
    ("multimodal_rag",        "B1.34"),  # Mapped: RUN-002
    # PARTIE 2H — F-RW operators (real-world defense bypass, 2026-04-06)
    # Source: analysis of 6 commercial products (Cursor, Windsurf, Devin, Manus, Replit)
    # Reference: .claude/skills/aegis-prompt-forge/references/real-world-defenses.md
    ("covert_channel",        "F-RW01"),  # Covert channel injection via system reminder tags (δ³ DaaAS)
    ("pop_quiz_override",     "F-RW02"),  # Pop quiz authority override / mode switch (δ¹ turned)
    ("ghost_tool",            "F-RW03"),  # Ghost tool invocation via fabricated tool logs (δ¹)
    ("memory_poisoning",      "F-RW04"),  # Memory persistence poisoning / cross-session (δ³)
    ("declarative_bypass",    "F-RW05"),  # Declarative guardrail bypass / enforcement gap (δ⁰)
    ("multi_step_hijack",     "F-RW06"),  # Multi-step goal hijacking / fragmented payload (δ³ absent)
]

# Chain coverage summary (RUN-004, 2026-04-06):
# 40/40 chains mapped (100%) — 34 from RUN-001/002/003,
# 6 new F-RW operators from real-world defense analysis:
#   covert_channel      → F-RW01 (DaaAS via system_reminder tags, δ³ turned)
#   pop_quiz_override   → F-RW02 (mode switch exploitation, δ¹ turned)
#   ghost_tool          → F-RW03 (fabricated tool-call injection, δ¹)
#   memory_poisoning    → F-RW04 (cross-session persistence, δ³)
#   declarative_bypass  → F-RW05 (enforcement gap exploitation, δ⁰)
#   multi_step_hijack   → F-RW06 (fragmented composition, δ³ absent)

_loaded = []
_skipped = []
for _mod_name, _ref in _CHAIN_MODULES:
    try:
        _il.import_module(f".{_mod_name}", __package__)
        _loaded.append(_mod_name)
    except (ImportError, Exception) as _e:
        _skipped.append((_mod_name, str(_e)))
        _log.debug("attack_chains: skipped %s (%s): %s", _ref, _mod_name, _e)

if _skipped:
    _log.info(
        "attack_chains: %d/%d loaded, %d skipped (missing deps). "
        "Skipped: %s",
        len(_loaded), len(_CHAIN_MODULES), len(_skipped),
        ", ".join(m for m, _ in _skipped),
    )
