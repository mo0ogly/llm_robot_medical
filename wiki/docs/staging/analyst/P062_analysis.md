## [Cheng, Sun, Gao et al., 2025] — RAGuard : Defense non-parametrique contre l'empoisonnement RAG par filtrage perplexite chunk-wise et similarite textuelle

**Reference :** arXiv:2510.25025
**Revue/Conf :** IEEE BigData 2025 (CORE A)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P062_Cheng_2025_RAGuard.pdf](../../assets/pdfs/P062_Cheng_2025_RAGuard.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (65 chunks)

### Abstract original
> Large language models (LLMs) have transformed natural language processing (NLP), enabling applications from content generation to decision support. Retrieval-Augmented Generation (RAG) improves LLMs by incorporating relevant external knowledge. However, RAG systems are vulnerable to poisoning attacks, where adversaries inject malicious texts into the knowledge base, potentially leading to inaccurate or harmful outputs. We introduce RAGuard, a detection framework designed to identify poisoned texts. RAGuard first expands the retrieval scope to increase the proportion of clean texts, reducing the likelihood of retrieving poisoned content. It then applies chunk-wise perplexity filtering to detect abnormal variations and text similarity filtering to flag highly similar texts. This non-parametric approach enhances RAG security, and experiments on large-scale datasets demonstrate its effectiveness in detecting and mitigating poisoning attacks.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les textes empoisonnes injectes dans la base de connaissances RAG sont passes comme contexte au LLM, corrompant ses reponses. Les defenses existantes (PPL globale, paraphrase) sont insuffisantes (Cheng et al., 2025, Section I, p.1).
- **Methode :** RAGuard combine 3 mecanismes : (1) expansion du retrieval (top-N >> k), (2) filtrage par Perplexity Difference (PD) et Perplexity Maximum (PM) chunk-wise (texte divise en 2 moities), (3) filtrage par Text Similarity (TS) excessivement elevee. Detection non-parametrique par percentiles empiriques avec alpha=2.5% (Section IV, Eq. 1-7, Algorithm 1).
- **Donnees :** 5 datasets (NQ, MS-MARCO, HotpotQA + extensions ENQ, EMS-MARCO totalisant 2.6M-8.8M docs). 6 attaques dont 2 adaptatives. 100 requetes cibles, 5 textes empoisonnes par requete (Section V, p.4-5).
- **Resultat :** DACC 92-99%, FPR < 6%, OACC 97-100% sur PoisonedRAG (Table I, p.5). Surpasse PPL (+30% DACC) et PPL-window (+20% DACC). Resistant aux attaques adaptatives (Table VIII, p.7).
- **Limite :** Degrade au-dela de 7 textes empoisonnes par requete car le nombre de textes propres pertinents est insuffisant (~5 max par requete sur NQ) (Section V-B, Figure 4-5, p.6).

### Analyse critique
**Forces :**
- Approche purement non-parametrique : aucun entrainement supplementaire, pas de modele additionnel lourd. Utilise GPT-2 pour le calcul de perplexite, choix empiriquement optimal (Table III, p.6).
- Garantie theorique : Theorem 1 fournit une borne inferieure sur OACC = 1 - exp(-ck) sous condition rho*beta_total < 1/2, ou beta_total <= beta_PD * beta_PM * beta_TS (Section IV-D, Theorem 1, p.4). [THEOREME]
- Analyse d'ablation complete : 5 variantes testees (Table VII, p.7). La combinaison des 3 filtres est significativement meilleure que chaque filtre individuel.
- Evaluation cross-LLM : OACC stable a 97-100% que le LLM final soit GPT-3.5, GPT-4, Llama3.1-8B ou Kimi (Table IV, p.6).

**Faiblesses :**
- L'expansion du retrieval (top-N) suppose que les documents propres pertinents existent en nombre suffisant dans le corpus. Sur des corpus de niche (medical, legal), cette hypothese est fragile.
- L'approche chunk-wise (split en 2 moities) est ad hoc. Pas de justification theorique sur le choix de 2 chunks vs. N chunks.
- Les attaques adaptatives testees (GPT-4 paraphrase + diversite linguistique) sont relativement simples. Des attaques par gradient conjoint (optimisation simultanee de la naturalite et du retrieval) ne sont pas evaluees.
- FNR non negligeable : 7-8% sur Prompt Injection et General Trigger (Table I), ce qui signifie que 7-8% des textes empoisonnes passent les filtres.

**Questions ouvertes :**
- L'approche est-elle robuste face a des corpus pre-empoisonnes a grande echelle (>5% du corpus) ?
- Comment RAGuard interagit avec des defenses au niveau generation (RobustRAG, TrustRAG) ?
- Scalabilite du calcul de perplexite sur des corpus de >10M documents ?

### Formules exactes
- **Eq. 1** (Section IV-A, p.3) : Perplexite chunk — f(R) = -(1/|R|) * sum_{r in R} log p(r_i | r_{0:i-1})
- **Eq. 2** (Section IV-A, p.3) : Perplexity Difference — PD(R) = f(R_pre) - f(R_post)
- **Eq. 4** (Section IV-A, p.4) : Perplexity Maximum — PM(R) = max(f(R_pre), f(R_post))
- **Eq. 6** (Section IV-B, p.4) : Text Similarity — TS(R) = Sim(E(Q), E(R))
- **Theorem 1** (Section IV-D, p.4) : OACC >= 1 - exp(-ck), c = (1/3) * ((1/2) - rho*beta_total)^2 * rho*beta_total
- Lien glossaire AEGIS : F15 (Sep(M)), F22 (ASR), F66 (PD/PM scores — nouveau)

### Pertinence these AEGIS
- **Couches delta :** δ¹ (detection/filtrage pre-generation, phase retrieval). Defense complementaire a GMTP (P061) avec approche non-parametrique vs. gradient-based.
- **Conjectures :**
  - C2 (necessite de δ³) : SUPPORTEE — FNR de 7-8% montre que meme une defense δ¹ performante laisse passer des textes empoisonnes. δ³ reste necessaire.
  - C5 (cosine similarity insuffisante) : SUPPORTEE DIRECTEMENT — le filtre TS (Eq. 6-7) detecte explicitement les similarites anormalement elevees, confirmant que la cosine seule est manipulable.
- **Decouvertes :**
  - D-006 (RAG comme surface d'attaque) : CONFIRMEE.
  - D-012 (defenses composites necessaires) : CONFIRMEE — les 3 filtres sont complementaires (Table VII ablation).
- **Gaps :**
  - G-014 (defense RAG formelle) : AVANCE — Theorem 1 fournit une borne theorique, mais sous hypotheses fortes (independance des filtres).
  - G-022 (RAGuard vs corpus medical) : CREE — pas de test sur domaine medical ou les textes propres pertinents sont rares et specialises.
- **Mapping templates AEGIS :** #54-#62 (RAG poisoning), #85-#90 (IPI)

### Citations cles
> "RAGuard achieves a low FPR, typically below 6% across datasets" (Section V-B, p.5)
> "Performance drop is attributable to a lack of sufficient clean texts" (Section V-B, p.6)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Haute — datasets standards, methode non-parametrique reproductible |
| Code disponible | Non (pas mentionne) |
| Dataset public | Oui (NQ, MS-MARCO, HotpotQA + extensions) |

### Classification AEGIS
- **Type d'attaque etudiee** : IPI (corpus poisoning)
- **Surface ciblee** : RAG knowledge base (retrieval + detection phase)
- **Modeles testes** : Contriever (retriever), GPT-2/Facebook-1.3B/Bloomz-560M (perplexite), GPT-3.5/GPT-4/Llama3.1-8B/Kimi (generation)
- **Defense evaluee** : RAGuard (perplexity chunk-wise + text similarity) — methode proposee
- **MITRE ATLAS** : AML.T0051.002 (Indirect Prompt Injection via RAG)
- **OWASP LLM** : LLM06 (Excessive Agency via poisoned retrieval)
