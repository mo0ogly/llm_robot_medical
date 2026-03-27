# INTEGRATION TRACKER — HouYi -> Aegis Red Team Lab

> Source: [Liu et al., 2023 — "Prompt Injection attack against LLM-integrated Applications"](https://arxiv.org/abs/2306.05499)
> Repository: `LLMSecurity/HouYi` (GitHub)
> Integration started: 2026-03-27
> Last updated: 2026-03-27
> Methodology: APEX (Analyze-Plan-Execute-eXamine) mode `-i` (integration)

---

## Summary

| Metric | Value |
|--------|-------|
| Total chains ported | **34** |
| Total harnesses ported | **5** (4 HouYi + 1 Aegis medical) |
| Total intentions (harness) | **8** (5 HouYi + 3 medical) |
| Genetic engine intentions | **7** (5 HouYi + 2 medical) |
| Separators | **10** (vs 5 in HouYi) |
| Disruptors | **6** (vs 3 in HouYi) |
| Templates read from HouYi | **101** |
| Templates selected for port | **34** |
| AI providers supported | 3 (Ollama, OpenAI, Anthropic) |
| Lines of code written | ~8900 |
| Files created/modified | ~56 |
| Build status | PASS |
| Import status | 34/34 chains + genetic engine OK |

---

## PARTIE 1 — Core Engine (COMPLETE)

| # | Element | File | Status | Created | Updated | Level |
|---|---------|------|--------|---------|---------|-------|
| 1 | Genetic Optimizer Engine | `backend/agents/genetic_prompt_optimizer.py` | DONE | 2026-03-27 | 2026-03-27 | L3 |
| 2 | Chromosome dataclass | `backend/agents/genetic_prompt_optimizer.py` | DONE | 2026-03-27 | 2026-03-27 | L2 |
| 3 | PromptInjection model | `backend/agents/genetic_prompt_optimizer.py` | DONE | 2026-03-27 | 2026-03-27 | L2 |
| 4 | Fitness scoring (Wilson CI) | `backend/agents/genetic_prompt_optimizer.py` | DONE | 2026-03-27 | 2026-03-27 | L3 |
| 5 | Crossover operators | `backend/agents/genetic_prompt_optimizer.py` | DONE | 2026-03-27 | 2026-03-27 | L2 |
| 6 | Mutation operators | `backend/agents/genetic_prompt_optimizer.py` | DONE | 2026-03-27 | 2026-03-27 | L2 |
| 7 | Separator library | `backend/agents/genetic_prompt_optimizer.py` | DONE | 2026-03-27 | 2026-03-27 | L2 |
| 8 | Disruptor library | `backend/agents/genetic_prompt_optimizer.py` | DONE | 2026-03-27 | 2026-03-27 | L2 |
| 9 | Framework templates | `backend/agents/genetic_prompt_optimizer.py` | DONE | 2026-03-27 | 2026-03-27 | L2 |
| 10 | Frontend: GeneticProgressView | `frontend/.../GeneticProgressView.jsx` | DONE | 2026-03-27 | 2026-03-27 | L2 |
| 11 | Frontend: CampaignTab integration | `frontend/.../CampaignTab.jsx` | DONE | 2026-03-27 | 2026-03-27 | L2 |
| 12 | Backend: /api/redteam/genetic SSE | `backend/server.py` | DONE | 2026-03-27 | 2026-03-27 | L2 |
| 13 | Attack templates (18 entries) | `frontend/.../attackTemplates.js` | DONE | 2026-03-27 | 2026-03-27 | L2 |

---

## PARTIE 2A — Stack-Compatible Templates (COMPLETE)

| # | Chain ID | Source Template | File | Status | Level |
|---|----------|----------------|------|--------|-------|
| B2.1 | `rag_multi_query` | rag-ollama-multi-query | `rag_multi_query.py` | DONE | L2 |
| B2.2 | `rag_basic` | rag-chroma | `rag_basic.py` | DONE | L2 |
| B2.3 | `rag_private` | rag-chroma-private | `rag_private.py` | DONE | L2 |
| B2.4 | `sql_attack` | sql-ollama | `sql_chain.py` | DONE | L2 |
| B2.9 | `pii_guard` | pii-protected-chatbot | `pii_guard.py` | DONE | L2 |

---

## PARTIE 2B — Advanced Attack Techniques (COMPLETE)

| # | Chain ID | Source Template | File | Status | Level |
|---|----------|----------------|------|--------|-------|
| B1.5 | `hyde` | hyde | `hyde_chain.py` | DONE | L2 |
| B1.7 | `rag_fusion` | rag-fusion | `rag_fusion.py` | DONE | L2 |
| B1.9 | `rewrite_retrieve_read` | rewrite-retrieve-read | `rewrite_retrieve_read.py` | DONE | L2 |
| B1.1 | `critique_revise` | basic-critique-revise | `critique_revise.py` | DONE | L2 |
| B1.10 | `skeleton_of_thought` | skeleton-of-thought | `skeleton_of_thought.py` | DONE | L2 |
| B1.12 | `stepback` | stepback-qa-prompting | `stepback_chain.py` | DONE | L2 |
| B1.6 | `propositional` | propositional-retrieval | `propositional_chain.py` | DONE | L2 |
| B1.2+B1.3 | `extraction` | extraction-openai/anthropic-functions | `extraction_chain.py` | DONE | L2 |

---

## PARTIE 2C — Agent Patterns (COMPLETE)

| # | Chain ID | Source Template | File | Status | Level |
|---|----------|----------------|------|--------|-------|
| B1.11 | `solo_agent` | solo-performance-prompting-agent | `solo_agent.py` | DONE | L2 |
| B1.18 | `tool_retrieval_agent` | openai-functions-tool-retrieval-agent | `tool_retrieval_agent.py` | DONE | L2 |
| B1.15 | `multi_index_fusion` | rag-multi-index-fusion | `multi_index_fusion.py` | DONE | L2 |
| B1.16 | `router` | rag-multi-index-router | `router_chain.py` | DONE | L2 |
| B1.4 | `guardrails` | guardrails-output-parser | `guardrails_chain.py` | DONE | L3 |

---

## PARTIE 2D — Infrastructure Templates (COMPLETE)

| # | Chain ID | Source Template | File | Status | Level |
|---|----------|----------------|------|--------|-------|
| B1.19 | `xml_agent` | xml-agent | `xml_agent.py` | DONE | L2 |
| B1.20 | `iterative_search` | anthropic-iterative-search | `iterative_search.py` | DONE | L2 |
| B1.21 | `rag_conversation` | rag-conversation | `rag_conversation.py` | DONE | L2 |
| B1.22 | `chain_of_note` | chain-of-note-wiki | `chain_of_note.py` | DONE | L2 |
| B1.23 | `research_assistant` | research-assistant | `research_chain.py` | DONE | L2 |

---

## PARTIE 3 — Harness Patterns (COMPLETE)

| # | Harness | Source | File | Status | Level |
|---|---------|--------|------|--------|-------|
| H1 | `write_sonic` | example_apps/write_sonic.py | `harness/targets.py` | DONE | L2 |
| H2 | `travel_planner` | example_apps/travel_planner.py | `harness/targets.py` | DONE | L2 |
| H3 | `english_trainer` | example_apps/english_trainer.py | `harness/targets.py` | DONE | L2 |
| H4 | `finance_assistant` | example_apps/finance_assistant.py | `harness/targets.py` | DONE | L2 |
| H5 | `medical_assistant` | Aegis POC (original) | `harness/targets.py` | DONE | L2 |

### Intentions

| # | Intention | Source | Category | Status |
|---|-----------|--------|----------|--------|
| I1 | Content Manipulation | intention/content_manipulation.py | injection | DONE |
| I2 | Information Gathering | intention/information_gathering.py | recon | DONE |
| I3 | Prompt Leakage | intention/prompt_leakage.py | prompt_leak | DONE |
| I4 | Spam Generation | intention/spam_generation.py | injection | DONE |
| I5 | Code Execution | intention/write_code.py | injection | DONE |
| I6 | Medical Dosage Override | Aegis (original) | medical | DONE |
| I7 | Patient Data Exfiltration | Aegis (original) | medical | DONE |
| I8 | Tool Hijack | Aegis (original) | tool_hijack | DONE |

---

## PARTIE 2E — High-Priority Templates (COMPLETE)

| # | Chain ID | Source Template | File | Status | Level |
|---|----------|----------------|------|--------|-------|
| B1.24 | `prompt_override` | pirate-speak + pirate-speak-configurable | `prompt_override.py` | DONE | L3 |
| B1.25 | `self_query` | rag-self-query | `self_query.py` | DONE | L3 |
| B1.26 | `csv_agent` | csv-agent | `csv_agent.py` | DONE | L3 |
| B1.27 | `functions_agent` | openai-functions-agent | `functions_agent.py` | DONE | L3 |
| B1.28 | `sql_research` | sql-research-assistant | `sql_research.py` | DONE | L3 |
| B1.29 | `rag_semi_structured` | rag-semi-structured | `rag_semi_structured.py` | DONE | L3 |

---

## PARTIE 2F — Medium-Priority Templates (COMPLETE)

| # | Chain ID | Source Template | File | Status | Level |
|---|----------|----------------|------|--------|-------|
| B1.30 | `feedback_poisoning` | chat-bot-feedback | `feedback_poisoning.py` | DONE | L3 |
| B1.31 | `transactional_agent` | shopping-assistant | `transactional_agent.py` | DONE | L3 |
| B1.32 | `retrieval_agent` | retrieval-agent | `retrieval_agent.py` | DONE | L3 |
| B1.33 | `summarize` | summarize-anthropic | `summarize_chain.py` | DONE | L3 |

---

## PARTIE 2G — Multi-Modal Templates (COMPLETE)

| # | Chain ID | Source Template | File | Status | Level |
|---|----------|----------------|------|--------|-------|
| B1.34 | `multimodal_rag` | rag-chroma-multi-modal + multi-vector | `multimodal_rag.py` | DONE | L3 |

---

## Templates NOT ported (with justification)

| Category | Count | Reason |
|----------|-------|--------|
| Neo4j-specific | 7 | Requires Neo4j server — not in lab stack |
| Pinecone/Weaviate/Redis/Elastic | 11 | Cloud vector DB — we use Chroma |
| AWS/Azure/Google Cloud | 6 | Cloud LLM services — we use Ollama |
| Misc vendor DBs | 11 | Cassandra, Mongo, Supabase, etc. — not in stack |
| Cloud LLMs | 5 | Bedrock, VertexAI, NVIDIA, Cohere, Intel |
| Fireworks | 2 | Fireworks-specific — covered by llm_factory |
| Utility/toy | 3 | pirate-speak (ported as prompt_override), plate-chain, python-lint |

Total skipped: **45** (vendor-locked, no unique attack technique)

---

## PARTIE 4 — AI-Agnostic Refactor (COMPLETE)

| Element | File | Status |
|---------|------|--------|
| `llm_factory` — provider factory | `llm_factory.py` | DONE (L3) |
| Safe imports (`__init__.py`) | `__init__.py` | DONE |
| `requirements.txt` updated | `backend/requirements.txt` | DONE |
| `langchain-ollama` added | `requirements.txt` | DONE |
| Provider error handling | `llm_factory.py` | DONE |
| Zero hardcoded providers in chains | Verified by grep | DONE |

---

## Improvement Levels

| Level | Description |
|-------|-------------|
| L1 | Minimal — direct port with namespace changes |
| L2 | Moderate — AI-agnostic + docstrings + error handling + medical context |
| L3 | Major — architectural improvements (registry, factory, scoring, async) |

---

## Documentation Updated

| File | Status |
|------|--------|
| `README.md` (EN) | DONE — installation, tech stack, 34-chain table |
| `README_FR.md` | DONE — same in French |
| `README_BR.md` | DONE — same in Portuguese |
| `backend/README.md` | DONE — architecture tree, requirements detail |
| `INTEGRATION_TRACKER.md` | DONE — this file |

---

## PARTIE 5 — Genetic Engine Pipeline (COMPLETE)

The full HouYi genetic optimization pipeline is in `backend/agents/genetic_engine/` (2191 lines total).

| HouYi source | Aegis file | Lines | Improvements |
|---|---|---|---|
| `context_infer.py` | `context_infer.py` | 143 | Da Vinci surgical context |
| `strategy/*.py` (3 files) | `components.py` | 579 | 10 separators (vs 5), 6 disruptors (vs 3) |
| `util/fitness_ranking.py` | `fitness.py` | 175 | + AEGIS dual scoring bridge |
| `util/mutation.py` | `mutation.py` | 179 | + robust JSON fallback parsing |
| `util/openai_util.py` | `llm_bridge.py` | 143 | Ollama-native (replaces OpenAI v0.27) |
| `iterative_prompt_optimization.py` | `optimizer.py` | 388 | Fully async + SSE streaming |
| `constant/chromosome.py` | `chromosome.py` | 152 | + AttackPayload wrapper |
| `intention/*.py` (5 files) | `intentions.py` | 260 | 7 intentions (vs 5, +medical) |
| `harness/base_harness.py` | `harness.py` | 136 | DaVinci-specific + AEGIS shield |

---

## Session Recovery Notes

If this session drops, the next session should:
1. Read this file first
2. Run `python -c "from backend.agents.attack_chains import list_chains; print(len(list_chains()))"` — expect **34**
3. Run `python -c "from backend.agents.harness import list_harnesses; print(len(list_harnesses()))"`
4. Check `npx vite build` in frontend/
5. Consult the TODO list in this conversation
