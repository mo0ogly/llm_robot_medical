# COLLECTOR REPORT — Prompt 4 (RAG Defense)
**Date :** 2026-04-08
**Agent :** COLLECTOR + ANALYST (Opus 4.6)
**Statut :** COMPLETE

## Phase 1 — COLLECTOR

### PDFs telecharges

| P-ID | arXiv | Fichier | Pages | Taille | Statut |
|------|-------|---------|-------|--------|--------|
| P111 | 2603.18034 | P111_semantic_chameleon.pdf | 11 (9 + refs) | 1.2 MB | OK |
| P112 | 2511.15759 | P112_securing_ai_agents.pdf | 8 (10 avec refs) | 312 KB | OK |
| P113 | 2602.04711 | P113_sparse_attention_rag.pdf | 20 | 452 KB | OK |

### Injection ChromaDB (aegis_bibliography)

| P-ID | Chunks injectes | Verification (>= 5) | Statut |
|------|----------------|---------------------|--------|
| P111 | 54 | OK (54 verifies) | INJECTED |
| P112 | 32 | OK (32 verifies) | INJECTED |
| P113 | 126 | OK (126 verifies) | INJECTED |

**Methode :** PersistentClient sur `backend/chroma_db/`, collection `aegis_bibliography`. Chunking 1000 chars / 200 overlap. Metadonnees : paper_id, arxiv_id, title, chunk_index, total_chunks, source, type, injected date.

### Doublons exclus
Pas de doublons detectes parmi les 3 papiers (P111-P113 sont nouveaux dans le corpus).

## Phase 2 — ANALYST

### Analyses produites

| P-ID | Fichier | SVC | Nature | Couches delta |
|------|---------|-----|--------|--------------|
| P111 | `_staging/analyst/P111_analysis.md` | 8/10 | [PREPRINT] | delta-1, delta-2 |
| P112 | `_staging/analyst/P112_analysis.md` | 5/10 | [PREPRINT] | delta-1, delta-2 |
| P113 | `_staging/analyst/P113_analysis.md` | 9/10 | [PREPRINT] | delta-1, delta-2 |

### Synthese pour G-027 (RAG defense)

Les 3 papiers adressent directement le gap G-027 avec des approches complementaires :

1. **P111 (Thornton, 2026)** — Defense architecturale au niveau **retrieval** : hybrid BM25+vector elimine le gradient-only poisoning (38% -> 0%). Montre que le corpus domain est une variable de securite. SVC 8/10.

2. **P112 (Ramakrishnan & Balaji, 2025)** — Benchmark + framework defense-in-depth multi-couche (filtering + guardrails + response verification) : 73.2% -> 8.7% ASR. Modeles anciens, reproductibilite faible. SVC 5/10.

3. **P113 (Dekel et al., 2026)** — Defense architecturale au niveau **attention** : SDAG (block-sparse attention inter-documents) reduit l'ASR de maniere significative sans finetuning. Nouveau SOTA single-document defense, complementaire a RAGDefender pour multi-document. SVC 9/10.

### Implications pour AEGIS

- **P113 (SDAG)** est le papier le plus directement integrable dans AEGIS : la modification du masque d'attention est applicable a LLaMA 3.2 (modele cible AEGIS). A tester comme defense candidate dans le pipeline AEGIS (RagSanitizer candidat 17e detecteur ou defense architecturale separee).
- **P111** introduit le concept de "corpus-dependent security" qui justifie de tester les defenses AEGIS sur un corpus medical specialise (pas seulement sur les benchmarks QA standard).
- **P112** fournit une taxonomie utile (5 categories) mais les resultats sont trop anciens (Claude 2.1, GPT-4-0613) pour etre directement comparables aux resultats AEGIS (LLaMA 3.2, Claude Sonnet 4.6).

### Conjectures impactees

| Conjecture | P111 | P112 | P113 |
|-----------|------|------|------|
| C1 (structural bypass) | Supportee | Neutre | Fortement supportee |
| C6 (defense layering) | Supportee | Supportee | Fortement supportee |
| C7 (model-agnostic) | N/A | N/A | Supportee |

### Actions recommandees

1. **Integrer SDAG dans le pipeline AEGIS** comme defense candidate pour les chaines RAG (templates #23, #35, #37).
2. **Tester hybrid retrieval (P111)** sur le corpus medical AEGIS (ChromaDB aegis_corpus) avec alpha <= 0.5.
3. **Mettre a jour DISCOVERIES_INDEX.md** avec les resultats de P111 (corpus-dependent effects) et P113 (attention-based defense).
4. **Propager dans MANIFEST.md** : P111, P112, P113.
