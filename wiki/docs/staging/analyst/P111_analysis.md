## [Thornton, 2026] — Semantic Chameleon: Corpus-Dependent Poisoning Attacks and Defenses in RAG Systems

**Reference :** arXiv:2603.18034v1
**Revue/Conf :** AISec '26, November 2026, Salt Lake City (co-located ACM CCS)
**Lu le :** 2026-04-08
> **PDF Source**: [literature_for_rag/P111_semantic_chameleon.pdf](../../assets/pdfs/P111_semantic_chameleon.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (54 chunks)

### Abstract original
> Retrieval-Augmented Generation (RAG) systems enhance LLMs with external knowledge but introduce poisoning attack surfaces through the retrieval mechanism. We show that a simple hybrid BM25 + vector retriever provides an effective architectural defense against gradient-guided RAG poisoning, and present exploratory evidence that corpus composition affects both attack feasibility and detection difficulty. Using dual-document (sleeper-trigger) poisoning optimized via Greedy Coordinate Gradient (GCG), our large-scale evaluation (n = 50 attacks on Security Stack Exchange, 67,941 docs) shows that gradient-guided poisoning achieves 38.0% co-retrieval on pure vector retrieval. Across all 50 attacks, hybrid BM25 + vector retrieval reduced gradient-guided attack success from 38% to 0%, demonstrating that a simple architectural change at the retrieval layer can eliminate this attack class without modifying the LLM. When attackers jointly optimize for both sparse and dense retrieval channels, hybrid retrieval is partially circumvented (20-44% success), but still significantly raises the attack bar compared to pure vector retrieval. Across five LLM families (GPT-5.3, GPT-4o, Claude Sonnet 4.6, Llama 4, GPT-4o-mini), attack success varies dramatically from 46.7% (GPT-5.3) to 93.3% (Llama 4), demonstrating that model-level safety training significantly affects resilience to RAG poisoning but does not eliminate the threat.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les systemes RAG sont vulnerables au poisoning de corpus par injection de documents adversaires ; la dependance au domaine du corpus sur l'equilibre attaque-defense n'avait jamais ete systematiquement etudiee.
- **Methode :** Poisoning dual-document (sleeper + trigger) optimise par GCG, evaluation sur pure vector vs hybrid BM25+vector, multi-modele end-to-end sur 5 LLMs, cross-corpus (Security SE 67K docs, FEVER Wikipedia 96K docs). (Section 3-5)
- **Donnees :** Security Stack Exchange (67,941 docs), FEVER Wikipedia (96,561 docs), corpus vendeur reseau (156,777 docs) ; N=50 attaques large-scale, N=25 FEVER confirmation, N=15 par modele. (Section 5.1-5.2)
- **Resultat :** Hybrid retrieval reduit le co-retrieval de 38% a 0% contre gradient-only (Table 6, p.5) ; joint sparse+dense optimization atteint 20-44% (Table 7, p.5) ; ASR varie de 46.7% (GPT-5.3) a 93.3% (Llama 4) (Table 8, p.6).
- **Limite :** Les methodes black-box (algorithmes genetiques, RL) ne sont pas testees ; cross-corpus pilot n=9 seulement ; temperature GPT-5.3 forcee a 1.0 vs 0.3 pour les autres ; case study vendeur limitee a 3 scenarios. (Section 7.1)

### Analyse critique

**Forces :**
- Evaluation multi-modele rigoureuse (5 LLMs, 4 fournisseurs) avec controle sleeper-only, statistiquement significative (chi-carre p < 10^-6, Cohen's h = 1.33) (Section 6.2, Table 6, p.5).
- Demonstration que la defense architecturale (hybrid retrieval) est superieure a la detection post-hoc (QPD F1 max = 0.632 vs 0% co-retrieval) (Section 7, p.8).
- Concept de "corpus-dependent security" est original et pertinent pour le deploiement reel (Section 6.1.1, Table 2, p.4).
- Joint sparse+dense optimization (Section 6.2.2) fournit une evaluation realiste de l'attaquant adaptatif, evitant le piege du threat model trop faible.
- Code et donnees publics (GitHub).

**Faiblesses :**
- Le corpus technique (Security SE) est un cas favorable pour l'attaquant (vocabulaire de securite absorbe les termes d'attaque) ; pas de corpus medical teste — generalisabilite limitee pour AEGIS. (Section 7, p.7)
- N=9 pour le pilot cross-corpus est insuffisant pour des conclusions statistiquement robustes, meme avec la confirmation FEVER N=25.
- La metrique stealth a 30% est deliberement genereuse ; en production, un seuil a <5% reduirait encore l'ASR effectif. (Section 7.1, limitation 6)
- Pas de mesure de l'impact du hybrid weighting sur la qualite de retrieval (trade-off securite/performance). (Section 7.1, limitation 5)
- Papier d'un chercheur independant, non peer-reviewed au moment de la lecture.

**Questions ouvertes :**
- Comment se comporte le hybrid retrieval contre des attaques black-box (genetic algorithms, RL) non testees ?
- Quel est le trade-off qualite de retrieval vs securite a alpha <= 0.5 sur des taches reelles ?
- Generalisation aux corpus medicaux (AEGIS) ?

### Formules exactes

**Eq. 1** (Section 3.4, p.3) — Sleeper objective :
L_s = lambda_s * L_cos(s, q_b) + beta_s * (1 - L_cos(s, q_m)) + gamma_s * (1 - L_cos(s, t))

**Eq. 2** (Section 3.4, p.3) — Trigger objective :
L_t = lambda_t * L_cos(t, q_m) + beta_t * L_cos(t, s) + epsilon * D_max(t, C)

**Eq. 3** (Section 4.2, p.3) — Query Pattern Differential :
QPD(d) = freq_sensitive(d) / (freq_sensitive(d) + freq_benign(d))

**Eq. 4** (Section 5.2, p.3) — Hybrid score :
score(q, d) = alpha * v_hat(q, d) + (1 - alpha) * b_hat(q, d)

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) — non utilise dans ce papier)

### Pertinence these AEGIS

- **Couches delta :** Principalement **delta-1** (retrieval-layer defense) et **delta-2** (model-level safety evaluation cross-modele). La defense par hybrid retrieval est une defense architecturale qui agit avant le LLM (delta-1). L'evaluation multi-modele confirme que la couche delta-0 (RLHF/safety training) varie enormement entre modeles.
- **Conjectures :**
  - **C1 (structural bypass)** : supportee — les attaques GCG exploitent la structure d'embedding, et le hybrid retrieval constitue une defense structurelle. Le joint optimization montre que meme les defenses structurelles sont partiellement contournables.
  - **C4 (encoding bypass)** : neutre — le papier ne teste pas les encodages alternatifs.
  - **C6 (defense layering)** : supportee — les resultats montrent clairement que les defenses mono-couche sont insuffisantes (model safety seul = 47-93% ASR ; hybrid retrieval seul = contournable a 20-44% par joint optimization).
- **Decouvertes :** D-007 (RAG vulnerability) confirmee ; D-012 (cross-model variance) confirmee avec 5 modeles.
- **Gaps :**
  - **G-027 (RAG defense)** : directement adresse — hybrid retrieval comme defense architecturale, QPD comme detection comportementale. Resultats experimentaux solides.
  - Cree un nouveau gap : defense contre joint sparse+dense optimization dans les corpus techniques.
- **Mapping templates AEGIS :** #23 (rag-semi-structured), #35 (rag-baseline-semantic), #37 (rag-multi-query) — le papier teste des vecteurs d'attaque similaires a ces templates mais au niveau corpus poisoning plutot que prompt injection.

### Citations cles
> "hybrid BM25 + vector retrieval reduced gradient-guided attack success from 38% to 0%" (Section 6.2, Table 6, p.5)
> "attack success ranges from 46.7% (GPT-5.3) to 93.3% (Llama 4)" (Section 6.3, Table 8, p.6)
> "QPD consistently provides the strongest cross-corpus detection signal" (Section 4.2, p.3)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — code public, parametres detailles, seeds fixes |
| Code disponible | Oui (https://github.com/scthornton/semantic-chameleon) |
| Dataset public | Oui (Security SE public, FEVER public) |
