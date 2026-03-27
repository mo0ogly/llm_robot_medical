# INTEGRATION TRACKER — Genetic Prompt Optimizer (Liu et al., 2023)

> **Source** : Liu, Y., Deng, G., Li, Y. et al. "Prompt Injection attack against LLM-integrated Applications" (arXiv:2306.05499)
> **Repo source** : https://github.com/LLMSecurity/HouYi/
> **Cible** : poc_medical — Lab Red Team Medical (These de doctorat)
> **Date de creation** : 2026-03-27
> **Derniere MAJ** : 2026-03-27 (TOUTES PARTIES COMPLETES)

---

## REGLES D'INTEGRATION

1. **ZERO reference au nom "HouYi"** dans le code source. Reference uniquement dans ce tracker et le README.
2. **Chaque fonction/classe portee est documentee** avec docstrings + reference a la source.
3. **Ne pas reinventer la roue** : reprendre la logique exacte de Liu et al. mais moderniser.
4. **Tracking exhaustif** : chaque element est suivi individuellement ci-dessous.
5. **AI-agnostique** : tout fonctionne avec n'importe quel LLM (Ollama, OpenAI, Anthropic, etc.)

---

## LEGENDE STATUTS

| Icone | Statut |
|-------|--------|
| `[x]` | FAIT |
| `[ ]` | EXCLU (justifie) |

---

## PARTIE 1 : CORE ENGINE — COMPLET

### A1-A6. Moteur genetique core

| # | Element | Statut | Fichier cible | Date |
|---|---------|--------|---------------|------|
| A1.1 | `Chromosome` dataclass | `[x]` | `genetic_engine/chromosome.py` | 2026-03-27 |
| A1.2 | `AttackPayload` dataclass | `[x]` | `genetic_engine/chromosome.py` | 2026-03-27 |
| A1.3 | `AttackIntention` base + 7 intentions | `[x]` | `genetic_engine/intentions.py` | 2026-03-27 |
| A3.* | 10 Separators (5 orig + 5 medical) | `[x]` | `genetic_engine/components.py` | 2026-03-27 |
| A4.* | 6 Disruptors (3 orig + 3 medical) | `[x]` | `genetic_engine/components.py` | 2026-03-27 |
| A5.* | 2 Framework Generators (medical) | `[x]` | `genetic_engine/components.py` | 2026-03-27 |
| A6.1 | `GeneticPromptOptimizer` (async) | `[x]` | `genetic_engine/optimizer.py` | 2026-03-27 |
| A6.2 | `fitness_ranking()` + AEGIS dual | `[x]` | `genetic_engine/fitness.py` | 2026-03-27 |
| A6.3 | `mutate_chromosome()` (robuste) | `[x]` | `genetic_engine/mutation.py` | 2026-03-27 |
| A6.4 | `completion_with_ollama()` | `[x]` | `genetic_engine/llm_bridge.py` | 2026-03-27 |
| A6.5 | `ContextInferenceEngine` | `[x]` | `genetic_engine/context_infer.py` | 2026-03-27 |
| A6.6 | `DaVinciHarness` | `[x]` | `genetic_engine/harness.py` | 2026-03-27 |

### A7. Integration orchestrateur + API

| # | Element | Statut | Fichier |
|---|---------|--------|---------|
| A7.1 | `run_genetic_attack()` | `[x]` | `orchestrator.py` |
| A7.2 | `run_context_infer_attack()` | `[x]` | `orchestrator.py` |
| A7.3 | `POST /api/redteam/genetic/stream` | `[x]` | `server.py` |
| A7.4 | `POST /api/redteam/context-infer/stream` | `[x]` | `server.py` |
| A7.5 | `GET /api/redteam/genetic/intentions` | `[x]` | `server.py` |

### A8. Frontend

| # | Element | Statut | Fichier |
|---|---------|--------|---------|
| A8.1 | 6 templates genetiques `attackTemplates.js` | `[x]` | `attackTemplates.js` |
| A8.2 | `GeneticProgressView.jsx` | `[x]` | `redteam/GeneticProgressView.jsx` |
| A8.3 | Integration `CampaignTab.jsx` | `[x]` | `redteam/CampaignTab.jsx` |
| A8.4 | Fix crash `RedTeamDrawer` + `TestSuitePanel` build | `[x]` | Imports + template literals |

### A9-A10. Tests + Documentation

| # | Element | Statut |
|---|---------|--------|
| A9.1 | 105 tests backend (PASSED) | `[x]` |
| A10.1 | Docstrings complets (tous fichiers) | `[x]` |
| A10.2 | 6 diagrammes Mermaid | `[x]` |

---

## PARTIE 2 : ATTACK CHAINS (34 CHAINS) — COMPLET

### 2A. Stack-compatible (Ollama + Chroma)

| # | Source template | Fichier cible | Technique | Niveau | Date |
|---|----------------|---------------|-----------|--------|------|
| B2.1 | `rag-ollama-multi-query` | `rag_multi_query.py` | Multi-query retrieval | L2 | 2026-03-27 |
| B2.2 | `rag-chroma` | `rag_basic.py` | Basic RAG Chroma | L1 | 2026-03-27 |
| B2.3 | `rag-chroma-private` | `rag_private.py` | Private RAG (tout local) | L2 | 2026-03-27 |
| B2.4 | `sql-ollama` | `sql_chain.py` | SQL generation + memory | L2 | 2026-03-27 |
| B2.9 | `pii-protected-chatbot` | `pii_guard.py` | PII detection + routing | L3 | 2026-03-27 |

### 2B. Techniques d'attaque avancees

| # | Source template | Fichier cible | Technique | Niveau | Date |
|---|----------------|---------------|-----------|--------|------|
| B1.1 | `basic-critique-revise` | `critique_revise.py` | Boucle validation/revision | L3 | 2026-03-27 |
| B1.2+3 | `extraction-*-functions` | `extraction_chain.py` | Extraction structuree fusionne | L3 | 2026-03-27 |
| B1.5 | `hyde` | `hyde_chain.py` | Hypothetical Doc Embeddings | L2 | 2026-03-27 |
| B1.6 | `propositional-retrieval` | `propositional_chain.py` | Decomp propositions + multi-vector | L2 | 2026-03-27 |
| B1.7 | `rag-fusion` | `rag_fusion.py` | Multi-query + Reciprocal Rank Fusion | L3 | 2026-03-27 |
| B1.9 | `rewrite-retrieve-read` | `rewrite_retrieve_read.py` | Query rewriting | L2 | 2026-03-27 |
| B1.10 | `skeleton-of-thought` | `skeleton_of_thought.py` | Decomposition hierarchique | L2 | 2026-03-27 |
| B1.12 | `stepback-qa-prompting` | `stepback_chain.py` | Abstraction step-back | L2 | 2026-03-27 |

### 2C. Agent patterns

| # | Source template | Fichier cible | Technique | Niveau | Date |
|---|----------------|---------------|-----------|--------|------|
| B1.4 | `guardrails-output-parser` | `guardrails_chain.py` | Validation XML + auto-fix | L3 | 2026-03-27 |
| B1.11 | `solo-performance-prompting-agent` | `solo_agent.py` | Multi-persona XML | L2 | 2026-03-27 |
| B1.15 | `rag-multi-index-fusion` | `multi_index_fusion.py` | Multi-source fusion | L3 | 2026-03-27 |
| B1.16 | `rag-multi-index-router` | `router_chain.py` | Semantic routing | L3 | 2026-03-27 |
| B1.18 | `openai-functions-tool-retrieval-agent` | `tool_retrieval_agent.py` | Dynamic FAISS tool select | L3 | 2026-03-27 |

### 2D. Infrastructure

| # | Source template | Fichier cible | Technique | Niveau | Date |
|---|----------------|---------------|-----------|--------|------|
| B1.19 | `xml-agent` | `xml_agent.py` | XML structured agent | L2 | 2026-03-27 |
| B1.20 | `anthropic-iterative-search` | `iterative_search.py` | Iterative refinement | L2 | 2026-03-27 |
| B1.21 | `rag-conversation` | `rag_conversation.py` | Conversational RAG | L2 | 2026-03-27 |
| B1.22 | `chain-of-note-wiki` | `chain_of_note.py` | Chain-of-Note verification | L2 | 2026-03-27 |
| B1.23 | `research-assistant` | `research_chain.py` | Multi-source research | L2 | 2026-03-27 |

### 2E. Haute priorite supplementaire

| # | Source template | Fichier cible | Technique | Niveau | Date |
|---|----------------|---------------|-----------|--------|------|
| B1.24 | `pirate-speak` + `configurable` | `prompt_override.py` | System prompt hijack | L3 | 2026-03-27 |
| B1.25 | `rag-self-query` | `self_query.py` | Metadata filter injection | L3 | 2026-03-27 |
| B1.26 | `csv-agent` | `csv_agent.py` | DataFrame code execution | L3 | 2026-03-27 |
| B1.27 | `openai-functions-agent` | `functions_agent.py` | Function calling | L3 | 2026-03-27 |
| B1.28 | `sql-research-assistant` | `sql_research.py` | Multi-step SQL report | L3 | 2026-03-27 |
| B1.29 | `rag-semi-structured` | `rag_semi_structured.py` | Table+text injection | L2 | 2026-03-27 |

### 2F. Moyenne priorite

| # | Source template | Fichier cible | Technique | Niveau | Date |
|---|----------------|---------------|-----------|--------|------|
| B1.30 | `chat-bot-feedback` | `feedback_poisoning.py` | Scoring manipulation | L3 | 2026-03-27 |
| B1.31 | `shopping-assistant` | `transactional_agent.py` | Unauthorized purchase | L3 | 2026-03-27 |
| B1.32 | `retrieval-agent` | `retrieval_agent.py` | Retrieval bypass | L2 | 2026-03-27 |
| B1.33 | `summarize-anthropic` | `summarize_chain.py` | Selective suppression | L2 | 2026-03-27 |

### 2G. Multi-modal

| # | Source template | Fichier cible | Technique | Niveau | Date |
|---|----------------|---------------|-----------|--------|------|
| B1.34 | `rag-chroma-multi-modal*` | `multimodal_rag.py` | Steganographie DICOM | L3 | 2026-03-27 |

### Infrastructure

| Element | Fichier | Date |
|---------|---------|------|
| `llm_factory.py` (provider-agnostic) | `attack_chains/llm_factory.py` | 2026-03-27 |
| `__init__.py` (registry + auto-import) | `attack_chains/__init__.py` | 2026-03-27 |

---

## PARTIE 3 : HARNESS PATTERNS — COMPLET

| # | Source | Fichier cible | Pattern | Date |
|---|--------|---------------|---------|------|
| C1 | `example_apps/write_sonic.py` | `genetic_engine/harness.py` | RAG-based harness | 2026-03-27 |
| C2 | `example_apps/travel_planner.py` | `genetic_engine/harness.py` | Role-based harness | 2026-03-27 |
| C3 | `example_apps/english_trainer.py` | `genetic_engine/harness.py` | Persona-based harness | 2026-03-27 |
| C4 | `example_apps/finance_assistant.py` | `genetic_engine/harness.py` | Domain-expert harness | 2026-03-27 |

---

## TEMPLATES EXCLUS (45) — JUSTIFICATION

| Categorie | Templates | Raison |
|-----------|-----------|--------|
| Neo4j (7) | `neo4j-*` | Necessite Neo4j server (hors stack lab) |
| Pinecone (3) | `rag-pinecone*` | SaaS cloud vector store |
| AWS (2) | `rag-aws-*` | Cloud-specific AWS |
| Azure (1) | `rag-azure-*` | Cloud-specific Azure |
| Google (3) | `rag-google-*`, `rag-gemini-*` | Cloud-specific Google |
| Weaviate (2) | `*weaviate*` | SaaS vector store |
| Redis (2) | `rag-redis*` | Necessite Redis server |
| Cassandra (2) | `cassandra-*` | Necessite Cassandra |
| Elasticsearch (2) | `elastic-*`, `rag-elasticsearch` | Necessite ES cluster |
| Vectara (2) | `rag-vectara*` | SaaS |
| Mongo (2) | `*mongo*` | Necessite MongoDB |
| Supabase (2) | `*supabase*` | SaaS |
| Misc SaaS (11) | `rag-astradb`, `rag-jaguardb`, etc. | SaaS vector stores |
| Cloud LLM (5) | `bedrock-jcvd`, `nvidia-*`, `intel-*`, `vertexai-*`, `cohere-*` | Hardware/cloud LLM specific |
| Fireworks (2) | `*fireworks*` | SaaS LLM |

---

## AMELIORATIONS vs SOURCE ORIGINALE

| Categorie | Source (2023) | Cible (2026) | Justification |
|-----------|---------------|--------------|---------------|
| LLM Provider | OpenAI v0.27.4 | Ollama natif (AI-agnostique) | API deprecee, local-first |
| Concurrence | ThreadPoolExecutor | asyncio natif | Coherent FastAPI |
| Error handling | Aucun | Retry 3x + fallback | Robustesse |
| Scoring | LLM seul (1-10) | LLM + AEGIS dual | These |
| Mutation parsing | Split strict (crash) | 3 strategies fallback | Robustesse LLM locaux |
| Contexte | Generique | Medical Da Vinci | These |
| Streaming | Batch | SSE temps reel | UX |
| Templates | 0 langchain chains | 34 attack chains portees | Couverture technique complete |
| Documentation | Minimale | 6 Mermaid + 34 docstrings (17-28 lignes) | These |
| Registry | Aucun | Auto-discovery + lazy load | Extensibilite |
| Factory | Hardcode OpenAI | llm_factory multi-provider | AI-agnostique |
| Multi-modal | Aucun | Steganographie DICOM | Innovation |

---

## DOCUMENTATION GENEREE

| Fichier | Contenu |
|---------|---------|
| `docs/mermaid_architecture.mmd` | Architecture globale moteur genetique |
| `docs/mermaid_ga_flow.mmd` | Flux algorithme genetique step-by-step |
| `docs/mermaid_components.mmd` | 3 composantes + variantes medicalisees |
| `docs/mermaid_integration.mmd` | Integration dans pipeline Red Team |
| `docs/mermaid_chain_catalog.mmd` | Catalogue 35 attack chains par categorie |
| `docs/mermaid_scenario_flow.mmd` | Flux scenario multi-etapes (sequence) |
| `docs/genetic_engine_architecture.py` | Script Python generateur Mermaid |

---

## SESSION RECOVERY

**Statut** : INTEGRATION COMPLETE
**Modules crees** :
- `backend/agents/genetic_engine/` (9 fichiers, 2191 lignes)
- `backend/agents/attack_chains/` (36 fichiers, 34 chains + factory + registry)
- `docs/` (6 Mermaid + 1 script Python + tracker)
**Tests** : 105 passed, 1 failed (pre-existant), 6 skipped
**Build frontend** : OK (Vite v7.3.1)
**Commande de reprise** : "Verifie l'etat de l'integration depuis docs/INTEGRATION_TRACKER.md"

---

## COMPTEURS FINAUX

| Categorie | Total | Fait |
|-----------|-------|------|
| Core engine (A1-A10) | 23 | 23 |
| Fix frontend (A8.4) | 1 | 1 |
| Attack chains (B1-B2) | 34 | 34 |
| Infrastructure (factory + registry) | 2 | 2 |
| Harness patterns (C) | 4 | 4 |
| Diagrammes Mermaid | 6 | 6 |
| Templates HouYi lus | 101 | 101 |
| Templates exclus (justifies) | 45 | 45 |
| **TOTAL ELEMENTS** | **71** | **71** |
| **Avancement** | | **100%** |
