## [Shi et al., 2025] — Prompt Injection Attack to Tool Selection in LLM Agents (ToolHijacker)

**Reference** : arXiv:2504.19793v3 / NDSS 2026
**Revue/Conf** : Network and Distributed System Security (NDSS) Symposium 2026, San Diego — CORE A*
**Lu le** : 2026-04-04
> **PDF Source**: [literature_for_rag/P006_source.pdf](../../literature_for_rag/P006_source.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (122 chunks). Publie NDSS 2026.

**Nature epistemique** : [ALGORITHME] — methode d'attaque formalisee comme probleme d'optimisation avec deux phases

### Abstract original
> "Tool selection is a key component of LLM agents. A popular approach follows a two-step process - retrieval and selection - to pick the most appropriate tool from a tool library for a given task. In this work, we introduce ToolHijacker, a novel prompt injection attack targeting tool selection in no-box scenarios. ToolHijacker injects a malicious tool document into the tool library to manipulate the LLM agent's tool selection process, compelling it to consistently choose the attacker's malicious tool for an attacker-chosen target task. Specifically, we formulate the crafting of such tool documents as an optimization problem and propose a two-phase optimization strategy to solve it. Our extensive experimental evaluation shows that ToolHijacker is highly effective, significantly outperforming existing manual-based and automated prompt injection attacks when applied to tool selection. Moreover, we explore various defenses, including prevention-based defenses (StruQ and SecAlign) and detection-based defenses (known-answer detection, DataSentinel, perplexity detection, and perplexity windowed detection). Our experimental results indicate that these defenses are insufficient, highlighting the urgent need for developing new defense strategies."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme** : La selection d'outils dans les agents LLM (retrieval + selection) est vulnerable a la manipulation par injection de documents d'outils malveillants (Section I)
- **Methode** : Optimisation en deux phases : (1) optimisation de R (sous-sequence retrieval) par gradient/gradient-free, (2) optimisation de S (sous-sequence selection) par tree-of-attack (Section III, Eq. 6-14, Algorithm 1)
- **Donnees** : MetaTool (21,127 instances, 199 outils) et ToolBench (126,486 samples, 9,650 outils), 10 taches cibles x 100 descriptions chacune, 8 LLM cibles, 4 retrievers (Section IV-A)
- **Resultat** : Gradient-free ASR 96.7% sur MetaTool (GPT-4o), 88.2% sur ToolBench ; Gradient-based ASR 92.2% / 83.9% ; AHR (Attack Hit Rate) 99.9-100% sur MetaTool (Section IV, Table I, Table II)
- **Limite** : Scenario no-box suppose l'injection d'un document dans la bibliotheque d'outils — necessite un acces au registre d'outils (Section I)

### Analyse critique
**Forces** :
- Formalisation rigoureuse du probleme comme optimisation (Eq. 6-14) avec decomposition en deux sous-objectifs alignes sur la structure du pipeline retrieval + selection (Section III)
- Evaluation tres extensive : 8 LLM (Llama-2-7B, Llama-3-8B/70B, Llama-3.3-70B, Claude-3-Haiku, Claude-3.5-Sonnet, GPT-3.5, GPT-4o) x 4 retrievers (ada-002, Contriever, Contriever-ms, Sentence-BERT-tb) (Section IV-A)
- Transferabilite demontree : shadow LLM =/= target LLM (Llama-3.3-70B shadow → GPT-4o target : 96.7% ASR, Table I)
- Surpasse nettement les baselines : 96.7% vs 39.3% (PoisonedRAG) vs 30.2% (JudgeDeceiver) sur MetaTool/GPT-4o (Table III)
- Venue NDSS 2026 (CORE A*) — standard de review rigoureux

**Faiblesses** :
- Le scenario d'attaque suppose que l'attaquant peut injecter un document dans la bibliotheque d'outils — cela n'est pas trivial dans les systemes bien configures
- Les 6 defenses testees echouent toutes, mais aucune n'est specifiquement concue pour la selection d'outils — comparaison potentiellement biaisee
- La methode gradient-based necessite un shadow LLM open-source — pas applicable si l'attaquant n'a acces a aucun modele
- Les formules de loss (L1 alignment, L2 consistency, L3 perplexity) sont standard en adversarial NLP — innovation incrementale sur JudgeDeceiver
- Pas d'evaluation sur des agents deployes en production (uniquement benchmarks academiques)

**Questions ouvertes** :
- Un mecanisme de signature/integrite des outils dans le registre suffirait-il a prevenir l'injection de documents malveillants ?
- Comment se comporte ToolHijacker face a un filtrage semantique des descriptions d'outils (whitelist de descriptions attendues) ?
- La transferabilite cross-modele est-elle exploitable dans des scenarios medicaux (Meditron, BioMistral) ?

### Formules exactes
- **Eq. 6** : max_R (1/m') * sum_i Sim(f'(q'_i), f'(R + S)) — retrieval objective (Section III-C, p. 5)
- **Eq. 7** : max_S (1/m') * sum_i I(E'(q'_i, D(i) ∪ {dt(S)}) = ot) — selection objective (Section III-D, p. 5)
- **Eq. 9** : L1(x(i), S) = -log E'(ot | x(i), S) — alignment loss (Section III-D, p. 6)
- **Eq. 11** : L2(x(i), S) = -log E'(dt_name | x(i), S) — consistency loss (Section III-D, p. 6)
- **Eq. 12** : L3(x(i), S) = -(1/γ) * sum_j log E(Tj | x(i)_1:hi, T1,...,Tj-1) — perplexity loss (Section III-D, p. 6)
- **Eq. 13-14** : Lall = L1 + αL2 + βL3, α=2.0, β=0.1 — combined loss (Section III-D, p. 6)
- **Eq. 15** : HR@k = (1/m) * sum_i hit(qi, k) — Hit Rate (Section IV-A5, p. 7)
- **Eq. 16** : AHR@k = (1/m) * sum_i a-hit(qi, k) — Attack Hit Rate (Section IV-A5, p. 7)
- Lien glossaire AEGIS : F22 (ASR), F66 (transferabilite cross-modele)

### Pertinence these AEGIS
- **Couches delta** : δ¹ (l'attaque contourne le system prompt en manipulant la selection avant que le prompt soit traite), δ² (les detecteurs bases sur la perplexite sont contournes par la loss L3 qui maintient la lisibilite)
- **Conjectures** :
  - C1 (insuffisance δ¹) : **Fortement supportee** — le system prompt n'intervient pas dans la selection d'outils, qui est un processus upstream vulnerable
  - C2 (necessite δ³) : **Supportee** — seule une verification formelle de l'integrite des outils (whitelist, signature) pourrait prevenir cette attaque
- **Decouvertes** : D-010 (vulnerabilite de la selection d'outils) — vecteur complementaire a l'injection de prompt classique : compromet l'infrastructure, pas le modele
- **Gaps** : G-010 (defense de la selection d'outils non resolue), G-019 (integrite du registre d'outils)
- **Mapping templates AEGIS** : Correspond aux chains `tool_retrieval_agent` et `functions_agent` ; les descriptions d'outils malveillantes sont analogues aux templates d'injection indirecte (#36-#60)

### Citations cles
> "ToolHijacker achieves a 96.7% attack success rate on MetaTool" with Llama-3.3-70B shadow and GPT-4o target (Abstract / Table I)
> "Our experimental results indicate that these defenses are insufficient, highlighting the urgent need for developing new defense strategies." (Abstract)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — MetaTool et ToolBench publics, parametres d'optimisation fournis, modeles accessibles |
| Code disponible | Non mentionne explicitement dans le texte principal |
| Dataset public | Oui (MetaTool, ToolBench) |
