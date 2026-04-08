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

- **98 attack templates** (97 numbered + 1 Custom placeholder) with configurable variables (`attackTemplates.js`)
- **98 help modals** with formal framework, mechanism, defense analysis (`ScenarioHelpModal.jsx`)
- **47 scenarios** (10 original + 37 kill-chain/solo) covering all 34 chains (`ScenarioTab.jsx`)
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
- `GET /api/redteam/chains`: Chain registry listing.
- `GET /api/redteam/telemetry/stream`: SSE real-time telemetry stream.
- `GET /api/redteam/telemetry`: Telemetry buffer snapshot (JSON).
- `GET /api/redteam/telemetry/health`: Telemetry subsystem health.
- `GET /api/redteam/taxonomy`: CrowdStrike Prompt Injection Taxonomy (hierarchical, 95 techniques).
- `GET /api/redteam/taxonomy/flat`: Flat list of all 95 taxonomy techniques.
- `GET /api/redteam/taxonomy/coverage`: Coverage report — 95/95 techniques mapped to attack templates.
- `GET /api/redteam/taxonomy/tree`: Tree-structured taxonomy (4 classes: Overt, Indirect, Social/Cognitive, Evasive).
- `GET /api/redteam/defense/taxonomy`: Defense taxonomy — 66 techniques across 4 classes (Prevention, Detection, Response, Measurement).
- `GET /api/redteam/defense/coverage`: Defense coverage report — 40/66 techniques implemented (60.6%).
- `GET /api/redteam/defense/benchmark`: Guardrail benchmark — 6 industry guardrails (Hackett et al., 2025).
- `GET /api/redteam/defense/sanitizer/capabilities`: RagSanitizer capabilities — 15 detectors, 12/12 character injection techniques.

## Defense Taxonomy

The `backend/taxonomy/defense.py` module provides a structured defense taxonomy: 66 techniques across 4 classes (Prevention, Detection, Response, Measurement). 40/66 techniques are currently implemented (60.6%). The `guardrail_benchmark.json` file contains benchmark data for 6 industry guardrail systems (Hackett et al., 2025).

## CrowdStrike Taxonomy

The `backend/taxonomy/` module provides full coverage of the CrowdStrike Prompt Injection Taxonomy (2025-11-01): 95/95 techniques across 4 classes. Each technique is mapped to one or more of the 97 attack templates, enabling systematic coverage verification.

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

## Multi-Provider LLM Configuration

AEGIS supports multiple LLM providers for cross-model testing (thesis requirement).

### Provider Setup

| Provider | Model | Setup | Usage |
|----------|-------|-------|-------|
| **Ollama** (default) | llama3.2:latest (3B) | `ollama serve` on port 11434 | Local, free, primary thesis model |
| **Groq** | llama-3.3-70b-versatile | `GROQ_API_KEY` in `backend/.env` | Cloud, fast, cross-model validation |
| **Groq** | llama-3.1-8b-instant | Same key | Small model comparison |

### Groq Configuration

1. Get API key at [console.groq.com](https://console.groq.com)
2. Create `backend/.env`:
```
GROQ_API_KEY=gsk_your_key_here
```
3. The backend auto-detects the key and enables Groq in the provider list
4. Select Groq models in the UI via the provider dropdown

### Running Campaigns with Groq

```bash
# Triple Convergence on 70B (cross-model validation)
MEDICAL_MODEL=llama-3.3-70b-versatile python backend/run_triple_convergence.py

# Thesis campaign on 70B
MEDICAL_MODEL=llama-3.3-70b-versatile python backend/run_thesis_campaign.py --n-trials 30
```

### Campaign Safeguards (anti-token-waste)

`backend/campaign_safeguards.py` prevents sterile loops:
- Max 3 iterations per campaign (hard limit)
- Sterile loop detection (identical params between iterations = BLOCK)
- Token budget per campaign (500K tokens max, ~$0.30 Groq)
- Pre-check required (5 baseline runs before N>=30)
- No-progress detection (2x INCONCLUSIVE without ASR improvement = WARN)

```bash
python backend/campaign_safeguards.py RAG-001  # Check before launch
```

### Campaign Manifest

`research_archive/experiments/campaign_manifest.json` tracks all campaigns:
- ID, gap, conjecture, script, iterations, verdicts
- Auto-rerun if INCONCLUSIVE (max 3)
- Escalation to human after max iterations

### Model Deprecation Notes

- `llama-3.1-70b-versatile` was decommissioned by Groq (April 2026)
- Replaced by `llama-3.3-70b-versatile` (128K context, same API)
- All config files updated: autogen_config.py, llm_factory.py, models_config.json

## Semantic Drift (Cosine Similarity)

Replaces Levenshtein distance for measuring mutation drift in the genetic optimizer.

- Model: `all-MiniLM-L6-v2` (Sentence-BERT)
- Module: `agents/semantic_drift.py`
- Integrated in: `agents/genetic_engine/optimizer.py` (per-generation SSE events)
- Dependency: `sentence-transformers` (in requirements.txt)
