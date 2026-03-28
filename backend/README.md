# Aegis Backend - AI Orchestrator & Multi-Agent Engine

This is the FastAPI-based backend for the Aegis Medical AI Simulator. It handles AI orchestration using AutoGen (AG2) and streams results via SSE.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- [Ollama](https://ollama.com/) (running locally)
- Llama 3.2 model (`ollama run llama3.2`)

### Installation
```bash
pip install -r requirements.txt
```

This installs:
- **Core**: FastAPI, Uvicorn, Ollama, Pydantic, ChromaDB, PyPDF
- **Attack Chains**: `langchain`, `langchain-core`, `langchain-community`, `langchain-chroma`
- **Multi-Agent**: `ag2[ollama]` (AutoGen)

> **Graceful degradation**: If LangChain is not installed, the server starts normally but attack chains are unavailable (logged as INFO, not ERROR).

### Running the Server
```bash
python server.py
```

## 🛠️ Components

- **server.py**: FastAPI endpoints for UI interaction and SSE streaming.
- **orchestrator.py**: AutoGen implementation of the multi-agent logic (RedTeam, DaVinci, Aegis).
- **agents/prompts.py**: System prompts for different difficulty levels.
- **agents/attack_chains/**: 34 attack chain modules (see below).
- **agents/attack_chains/llm_factory.py**: AI-agnostic LLM/embedding provider factory (Ollama/OpenAI/Anthropic).
- **scenarios.py**: Definitions of complex attack scenarios.

## 🔗 Attack Chain Architecture

```
agents/attack_chains/
├── __init__.py              # Registry + safe auto-import
├── llm_factory.py           # Provider-agnostic LLM factory
├── rag_multi_query.py       # B2.1 — Multi-query RAG
├── rag_private.py           # B2.3 — Fully local RAG
├── rag_basic.py             # B2.2 — Baseline RAG
├── sql_chain.py             # B2.4 — SQL injection chain
├── pii_guard.py             # B2.9 — PII detection guard
├── hyde_chain.py            # B1.5 — HyDE retrieval
├── rag_fusion.py            # B1.7 — RAG Fusion (RRF)
├── rewrite_retrieve_read.py # B1.9 — Query rewriting
├── critique_revise.py       # B1.1 — Self-correction loop
├── skeleton_of_thought.py   # B1.10 — Parallel decomposition
├── stepback_chain.py        # B1.12 — Step-back prompting
├── propositional_chain.py   # B1.6 — Atomic fact indexing
├── extraction_chain.py      # B1.2+B1.3 — Structured extraction
├── solo_agent.py            # B1.11 — Multi-persona agent
├── tool_retrieval_agent.py  # B1.18 — Dynamic tool selection
├── multi_index_fusion.py    # B1.15 — Multi-source fusion
├── router_chain.py          # B1.16 — Question router
├── guardrails_chain.py      # B1.4 — Output validation
├── xml_agent.py             # B1.19 — XML tool agent
├── iterative_search.py      # B1.20 — Multi-step retrieval
├── rag_conversation.py      # B1.21 — Conversational RAG
├── chain_of_note.py         # B1.22 — Chain-of-Note verification
└── research_chain.py        # B1.23 — Research assistant
```

All chains are registered via `@register_chain` decorator and can be listed with `list_chains()` or built with `build_chain(chain_id)`.

### Frontend Coverage

- **52 attack templates** with configurable variables (`attackTemplates.js`)
- **52 help modals** with formal framework, mechanism, defense analysis (`ScenarioHelpModal.jsx`)
- **37 kill-chain scenarios** (18 multi-step + 19 solo) covering all 34 chains (`ScenarioTab.jsx`)
- Each chain has at minimum 1 dedicated scenario for individual testing

## 🤖 AI Agents

1. **MedicalRobotAgent (Da Vinci)**: The target Assistant AI with clinical rules.
2. **RedTeamAgent**: The adversarial LLM generating probes and attacks.
3. **SecurityAuditAgent (AEGIS)**: The defender LLM scoring and intercepting attacks.

## 📡 API Endpoints (Main)

- `GET /api/vitals`: Current patient vital signs.
- `POST /api/chat`: Send a message to the surgical assistant.
- `POST /api/redteam/attack/stream`: SSE stream for a single targeted attack.
- `POST /api/redteam/campaign/stream`: SSE stream for a full security audit.
- `GET /api/scenarios`: List available Red Team scenarios.
- `POST /api/redteam/separation-score`: Compute Sep(M) from data vs instruction position.

## Sep(M) — Separation Score (Zverev et al. 2025)

The separation score measures whether the model treats data-position and instruction-position payloads differently.

```
Sep(M) = |P_data(violation) - P_instr(violation)|
```

**Statistical validity requirements:**

| Parameter | Required | Configurable in UI |
|-----------|----------|-------------------|
| N trials per chain | >= 30 | Slider in Campaign Parameters |
| Violations detected | > 0 in at least 1 condition | Disable Aegis Shield to test delta-1 alone |
| Null control included | Recommended | Toggle in Campaign Parameters |

**WARNING:** `Sep(M) = 0` with zero violations is a **statistical floor artifact**, not a separation measure. The function returns `statistically_valid: false` and `warnings` when conditions are not met.

## Semantic Drift (Cosine Similarity)

Replaces Levenshtein distance for measuring mutation drift in the genetic optimizer.

- Model: `all-MiniLM-L6-v2` (Sentence-BERT)
- Module: `agents/semantic_drift.py`
- Integrated in: `agents/genetic_engine/optimizer.py` (per-generation SSE events)
- Dependency: `sentence-transformers` (in requirements.txt)
