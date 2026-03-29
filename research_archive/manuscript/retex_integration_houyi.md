# RETEX — Integration du Framework HouYi dans le Lab AEGIS

> **Date** : 2026-03-27/28
> **Duree** : ~8 heures de session continue
> **Source** : https://github.com/LLMSecurity/HouYi/ (Liu et al., arXiv:2306.05499)
> **Cible** : poc_medical — AEGIS Red Team Lab

---

## 1. Objectif Initial

Integrer les composantes de HouYi (optimiseur genetique d'injection de prompts) dans le lab de red teaming medical pour :
1. Automatiser la generation d'attaques via algorithme genetique
2. Porter les 101 langchain-templates comme techniques d'attaque
3. Valider formellement les Conjectures 1 et 2 de la these

## 2. Ce Qui a Ete Fait

### 2.1 Moteur Genetique (2 191 lignes)

| Module | Lignes | Source HouYi | Amelioration |
|--------|--------|-------------|-------------|
| `chromosome.py` | 152 | `constant/chromosome.py` | Dataclass typee + aegis_scores |
| `components.py` | 579 | `strategy/*.py` | 10 separators + 6 disruptors medicaux |
| `context_infer.py` | 143 | `context_infer.py` | Async + fallback robuste |
| `fitness.py` | 175 | `util/fitness_ranking.py` | Dual scoring LLM + AEGIS formel |
| `mutation.py` | 179 | `util/mutation.py` | 3 strategies de parsing fallback |
| `optimizer.py` | 388 | `iterative_prompt_optimization.py` | Full async + SSE streaming |
| `llm_bridge.py` | 143 | `util/openai_util.py` | Ollama natif (remplace OpenAI v0.27) |
| `harness.py` | 136 | `harness/base_harness.py` | DaVinci target + 4 patterns |
| `intentions.py` | 260 | `intention/*.py` | 7 intentions medicales |

### 2.2 Attack Chains (34 chains, ~4 500 lignes)

101 templates HouYi analyses :
- **34 portes** (techniques pertinentes pour le red teaming medical)
- **45 exclus** (vendor-specific : Neo4j, Pinecone, AWS, Azure, etc.)
- **22 restants** = couverts par les 34 (fusions, variantes)

**Toutes les chains** :
- Utilisent `llm_factory.py` (AI-agnostique : Ollama, OpenAI, Anthropic)
- Sont enregistrees dans `CHAIN_REGISTRY` avec auto-discovery
- Ont des docstrings completes (17-28 lignes chacune)

### 2.3 Pipeline Formel

| Composante | Fichier | Ce qu'elle fait |
|-----------|---------|----------------|
| `run_chain_attack()` | orchestrator.py | Connecte les 34 chains au scoring |
| `run_formal_campaign()` | orchestrator.py | N trials + null control + Sep(M) auto |
| `analyze_campaign.py` | standalone | Rapport Markdown automatique |
| `test_conjectures.py` | tests/ | 10 tests formels C1/C2 |

### 2.4 Frontend

- Fix crash RedTeamDrawer (6 imports manquants)
- Fix TestSuitePanel (template literals esbuild)
- AnalysisView cable au backend (LIVE/DEMO)
- CampaignTreeView avec couleurs (vert/rouge/orange)

### 2.5 Documentation

- 8 diagrammes Mermaid (generables via Python)
- INTEGRATION_TRACKER.md (71/71 = 100%)
- `formal_framework_complete.md` (cadre mathematique complet)
- `campaign_analysis_20260328.md` (analyse premiere campagne)

## 3. Difficultes Rencontrees

### 3.1 HouYi est date (2023)
- Utilise OpenAI v0.27 (deprece) → remplacement par Ollama natif
- ThreadPoolExecutor → migration vers asyncio
- Aucun error handling → ajout retry 3x + fallback
- Mutation parsing fragile (split sur separateurs) → 3 strategies fallback

### 3.2 Templates langchain-templates
- 45 sur 101 sont vendor-specific (Neo4j, Pinecone, etc.) → exclus avec justification
- Beaucoup dependent de services cloud payants → remplacement par Ollama+Chroma
- Certains sont quasi-identiques (rag-pinecone vs rag-chroma) → fusion

### 3.3 Build frontend
- esbuild (Vite v7.3.1) ne supporte pas les template literals `${}` dans les fonctions standalone des fichiers .jsx → remplacement par concatenation
- Bug pre-existant, pas lie a l'integration

### 3.4 Campagne formelle lente
- LLaMA 3.2 sur CPU : ~30s par inference
- Campagne complete (34 chains x 30 trials x 2 conditions) = ~68 heures
- Solution : GPU ou modele plus petit (phi3, gemma2)

## 4. Lecons Apprises

### 4.1 Methodologie APEX
La skill APEX (Analyze-Plan-Execute-eXamine) avec le mode `-i` (integration) a ete cruciale :
- **LIRE AVANT DE CODER** : interdiction de coder sans avoir lu TOUS les fichiers source
- **Tracker element par element** : chaque fonction, chaque template, chaque test
- **Session recovery** : le tracker permet de reprendre apres une coupure

### 4.2 Separation git/these
La strategie `research_archive/` (gitignored) fonctionne bien :
- Le CODE qui genere les resultats est dans git (reproductible)
- Les RESULTATS sont locaux (prives pour la these)
- Quiconque clone le repo peut re-executer et obtenir ses propres resultats

### 4.3 Scientific Challenge comme guide
Le document `scientific_challenge.md` (5 GAPs) a ete le meilleur guide pour prioriser :
- GAP 2 (AllowedOutputSpec) etait deja corrige
- GAP 1, 3, 5 ont ete resolus dans `run_formal_campaign()`
- GAP 4 a ete resolu avec 3 scenarios de bypass δ²

### 4.4 Cosine > Levenshtein
Le remplacement de Levenshtein par cosine similarity (sentence-transformers) est un vrai gain :
- Levenshtein : "Kill patient" vs "Cause cardiac arrest" = 25 (tres distant)
- Cosine : sim = 0.72 (tres proche) → detecte correctement l'intention preservee

## 5. Prochaines Etapes

| Priorite | Action | Effort |
|---------|--------|--------|
| P0 | Campagne δ¹ seul (aegis_shield=False, N=30) | 2h GPU |
| P0 | Campagne bypass δ² (3 scenarios) | 30 min |
| P1 | Multi-modele (mistral, phi3, gemma2) | 6h GPU |
| P1 | Integrer cosine drift dans le pipeline genetique | 2h |
| P2 | LLM-as-Judge (Llama-Guard) pour ASR | 4h |
| P2 | LaTeX export automatique depuis analyze_campaign.py | 2h |
| P3 | SD-RAG implementation (7-stage pipeline) | 8h |

## 6. Metriques de la Session

| Metrique | Valeur |
|---------|--------|
| Fichiers crees/modifies | 113 |
| Lignes ajoutees | 17 218 |
| Templates HouYi lus | 101/101 |
| Chains portees | 34 |
| Tests ecrits | 34 (tous PASSED) |
| Diagrammes Mermaid | 8 |
| GAPs resolus | 5/5 |
| Commit | `a9064e4` |
