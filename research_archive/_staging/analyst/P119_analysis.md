## [Jiao, Wang, Yang, 2025] — PR-Attack: Coordinated Prompt-RAG Attacks via Bilevel Optimization

**Reference :** arXiv:2504.07717v3 (20 Jun 2025), SIGIR 2025
**Revue/Conf :** SIGIR 2025 — CORE A*, peer-reviewed (ACM ISBN 979-8-4007-1592-1/2025/07)
**Lu le :** 2026-04-09
> **PDF Source**: [literature_for_rag/P119_jiao_pr_attack.pdf](../../literature_for_rag/P119_jiao_pr_attack.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (37 chunks dans aegis_bibliography)

### Classification AEGIS
- **Type d'attaque :** IPI (indirect prompt injection) coordonnee avec backdoor trigger dans le prompt
- **Surface ciblee :** Base de connaissances RAG + soft prompt du LLM (joint attack)
- **Modeles testes :** Vicuna 7B, Llama-2 7B, Llama-3.2 1B, GPT-J 6B, Phi-3.5 3.8B, Gemma-2 2B
- **Defense evaluee :** aucune explicite, focus sur effectivite et stealth
- **MITRE ATLAS :** AML.T0051 (Prompt Injection), AML.T0020 (Poison Training Data)
- **OWASP LLM :** LLM01 (Prompt Injection), LLM06 (Sensitive Information Disclosure)

### Abstract original
> "Large Language Models (LLMs) have demonstrated remarkable performance across a wide range of applications... However, they also exhibit inherent limitations, such as outdated knowledge and susceptibility to hallucinations. Retrieval-Augmented Generation (RAG) has emerged as a promising paradigm to address these issues, but it also introduces new vulnerabilities. Recent efforts have focused on the security of RAG-based LLMs, yet existing attack methods face three critical challenges: (1) their effectiveness declines sharply when only a limited number of poisoned texts can be injected into the knowledge database, (2) they lack sufficient stealth... (3) they rely on heuristic approaches to generate poisoned texts, lacking formal optimization frameworks... we propose coordinated Prompt-RAG attack (PR-attack)... We formulate the attack generation process as a bilevel optimization problem..."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme :** les attaques RAG existantes (PoisonedRAG, GGPP) sont detectables et inefficaces quand le budget de poison est limite (Section 1, p.1-2).
- **Methode :** formulation bilevel : upper-level = optimisation conjointe des poisoned texts + soft prompt backdoor ; lower-level = retrieval MIPS. Trigger word 'cf' (suivant [15]). Alternating optimization avec zeroth-order gradient estimator (Section 3.2-3.3, p.4-5, Eq. 2-11, Algorithm 1, p.5).
- **Donnees :** NQ, HotpotQA, MS-MARCO ; 6 LLMs ; Contriever comme retriever ; `b=20, n=15, k=5`, temperature 0.5, un seul poisoned text par target question (Section 4.1, p.7, Experimental Details).
- **Resultat :** PR-Attack ASR entre 91-100% sur tous les LLMs/datasets (Table 1, p.6). Vicuna 7B : 93%/94%/96% (NQ/HotpotQA/MSMarco). Llama-3.2 1B : 99%/98%/100%. Baselines state-of-the-art (PoisonedRAG, GGPP) entre 62-84%.
- **Limite :** ACC sans trigger reste eleve (>= 84%, Table 2, p.7) = stealth confirme, MAIS les auteurs necessitent acces au backdoor trigger dans le prompt (soft prompt) = threat model EXIGE un compromis de l'orchestrateur/developpeur. Pas d'evaluation de defenses recentes (perplexity-based, GMTP, Kim et al. 2025).

### Threat Model
| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | Grey-box : connait le retriever (Contriever), peut injecter texts ET modifier le soft prompt (compromis developpeur) |
| Acces | Base de connaissances RAG + soft prompt layer |
| Multi-turn | Non specifie (single-turn evaluation) |
| Objectif | Substitution de reponse (target answer substitue a correct answer) |

### Analyse critique avec references inline
**Forces :**
- Formalisation bilevel rigoureuse avec garantie de complexite `O((B1*(KlogK + (c1+1)Mbd) + B2*M*n*c2)*T)` (Section 3.4, Eq. 12, p.5).
- Baselines etendues : GCG, Corpus Poisoning, Disinformation Attack, Prompt Poisoning, GGPP, PoisonedRAG (Section 4, Table 1, p.6).
- Evaluation multi-LLM (6 modeles de tailles variees : 1B a 7B), 3 datasets (Section 4, Table 1, p.6).
- Ablations sur taille du poisoned text `b`, nombre de prompts trainables `n`, top-k `k` (Figures 4-5, p.7-9).
- Stealth demontree : ACC normal sans trigger reste >= Naive RAG (Table 2, p.7).

**Faiblesses :**
- **Threat model tres fort** : necessite acces au soft prompt (fine-tuning ou composant du pipeline). Ce n'est PAS une attaque "boite noire" en toute rigueur.
- **Trigger word 'cf' detectable** : une surveillance simple des prompts pour tokens rares (perplexity anomaly) devrait identifier cette attaque. Les auteurs ne le testent pas.
- Aucune evaluation contre defenses 2025 (GMTP, PromptShield, RAG sanitizers comme Kim et al. 2025 ACL).
- **Pas de comparison avec HyDE-style self-injection** : PR-Attack necessite une injection EXTERNE dans la base + soft prompt. D-024 ne necessite NI l'un NI l'autre, ce qui n'est pas contraste dans la litterature.
- Substring matching comme juge d'ASR : manipulable (confer P044 dans le corpus AEGIS, juges LLM 99% flip rate).

**Transfert cross-modele :** teste sur 6 modeles, resultats consistants (>= 91% ASR). Transferabilite native de la methode.
**Temporalite :** 2025, methode encore valide (juin 2025).

### Integration AEGIS
- **Payload extractible :** algorithme dans le papier mais code non publie explicitement dans le texte lu. A verifier sur GitHub des auteurs.
- **Mapping templates AEGIS :** correspond a la famille "compromis infrastructure" (injection base + prompt layer). Pas equivalent direct dans les 97 templates actuels — priorite BASSE pour integration directe.
- **Mapping chaines AEGIS :** famille `rag-medical`, `rag-basic` si extension a base compromise.
- **Defense testable :** detecter tokens rares dans soft prompts + perplexity-based filtering. Confer Kim et al. 2025 (P corpus AEGIS).
- **Priorite :** HAUTE (contrast) — permet de positionner D-024 comme strictement plus faible en capacites attaquant mais aussi efficace en ASR.

### Pertinence these AEGIS — **LIEN AVEC D-024 (CONTRAST)**
- **Couches delta :** δ¹ (retrieval/base de connaissances) + δ² (orchestration via soft prompt).
- **Conjectures :** C2 (defense necessite δ³) — PR-Attack confirme que les defenses intra-pipeline echouent contre des payloads optimises ; C6 (medical) — applications mentionnees "medical question-answering" (Section 1, p.1).
- **Gap adresse :** G-042 (defense HyDE) cote threat model distinct.
- **Relation a D-024 (CONTRAST CRUCIAL) :**
  - PR-Attack EXIGE : (1) injection de texts poisoned dans la base, (2) compromission du soft prompt via trigger 'cf'. Ces deux prerequis sont operationnellement tres couteux.
  - D-024 n'EXIGE RIEN : pas d'acces a la base de connaissances, pas de compromission du prompt orchestrateur, pas de fine-tuning. Le modele s'injecte lui-meme via le HyDE expansion step.
  - ASR comparable : PR-Attack 91-100% sur 6 LLMs ; D-024 96.7% sur llama-3.1-8b-instant. Capacites attaquant asymetriques — D-024 est strictement plus puissant (moins de prerequis, meme effectivite).
  - CITATION DIRECTE POUR D-024 : `(Jiao et al., 2025, SIGIR, Table 1, p.6)` pour comparaison "SOTA RAG attack requiring compromised infrastructure vs endogenous self-injection".

### Citations cles
> "the proposed method consistently achieves ASRs of at least 90% across different LLMs and datasets, outperforming the state-of-the-art methods" (Section 4.2 Results, p.8)
> "this work represents the first attempt to jointly attack both the knowledge database and the prompt, offering a novel and more effective attack paradigm" (Section 1 Motivation, p.2)
> "To our best knowledge, this is the first study to investigate attacks on RAG-based LLMs through the lens of bilevel optimization and to provide a theoretical complexity guarantee." (Section 3.4, p.5)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 — contrast important mais threat model tres different |
| Reproductibilite | Moyenne — algorithme decrit mais code non cite explicitement dans le texte lu |
| Code disponible | Non cite dans le papier lu |
| Dataset public | Oui — NQ, HotpotQA, MS-MARCO |
| Nature epistemique | [ALGORITHME] avec [THEOREME] de complexite (Section 3.4) — convergence non prouvee |
