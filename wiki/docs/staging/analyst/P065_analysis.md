## [Kim, Lee & Koo, 2025] — RAGDEFENDER : Defense efficace contre les attaques de corruption de connaissances RAG par clustering et identification adversariale

**Reference :** arXiv:2511.01268
**Revue/Conf :** ACSAC 2025 (Annual Computer Security Applications Conference, CORE A)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P065_Kim_2025_RAGDefender.pdf](../../assets/pdfs/P065_Kim_2025_RAGDefender.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (108 chunks)

### Abstract original
> Large language models (LLMs) are reshaping numerous facets of our daily lives, leading to their widespread adoption as web-based services. Despite their versatility, LLMs suffer from hallucination, staleness, and lack of domain-specific knowledge. Retrieval-Augmented Generation (RAG) addresses these issues. However, recent studies demonstrate the vulnerability of RAG to knowledge corruption attacks. We present RAGDEFENDER, an effective and efficient defense mechanism that operates during the retrieval phase, leveraging lightweight machine learning techniques to detect and filter out adversarial content without requiring additional model training or inference. Our empirical evaluations show that RAGDEFENDER consistently outperforms existing state-of-the-art defenses across multiple models and adversarial scenarios: e.g., RAGDEFENDER reduces the attack success rate (ASR) against the Gemini model from 0.89 to as low as 0.02.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les defenses existantes (RobustRAG, Discern-and-Answer) reposent sur des LLM lourds et couteux, ou sur des hypotheses fortes comme l'independance des passages (Kim et al., 2025, Section 2, Table 1, p.3).
- **Methode :** RAGDEFENDER est un pipeline en 2 etapes : (1) estimation du nombre de passages adversariaux N_adv via clustering agglomeratif (TF-IDF) ou analyse de concentration (cosine embeddings), (2) identification des N_adv passages les plus suspects via score de frequence dans les paires top-k les plus similaires (Section 4, Eq. 1-6, p.4-5).
- **Donnees :** 3 datasets (NQ, HotpotQA, MS MARCO), 6 LLMs (LLaMA-7B/13B, Vicuna-7B/13B, Gemini, GPT-4o), 3 attaques (PoisonedRAG, GARAG, method directe), ratios adversariaux 1x-6x (Section 6, p.7-8).
- **Resultat :** ASR reduit a 0.02-0.03 sur NQ avec ratio 4x (vs 0.84 RobustRAG, 0.31 Discern-and-Answer) (Section 6.2, p.8). Cout < $0.01/requete vs $17.85 pour Discern-and-Answer. Temps : 0.77s vs 9.55s (Table 2, p.8).
- **Limite :** Non explicitement mentionnee. Cependant, la methode repose sur l'hypothese que les passages adversariaux forment des clusters semantiques denses et distincts des passages propres — hypothese qui peut echouer si l'attaquant diversifie deliberement ses passages (Section 4.1, p.4).

### Analyse critique
**Forces :**
- Rapport cout/efficacite exceptionnel : 3 ordres de grandeur moins cher que Discern-and-Answer ($0.01 vs $17.85), 12x plus rapide (0.77s vs 9.55s) (Table 2, p.8). Cela rend la defense deployable en production.
- Evaluation cross-modele exhaustive : 6 LLMs incluant des modeles proprietaires (Gemini, GPT-4o) et open-source (LLaMA, Vicuna), offrant la meilleure couverture parmi les defenses RAG etudiees.
- Evaluation cross-retriever : Contriever, DPR, ANCE avec resultats detailles (Table 9, Appendix, p.13-14).
- Defense adaptive testee : evasion adaptive, injection de contenu heterogene, violations d'integrite — RAGDEFENDER maintient sa robustesse (Section 6.5, p.9).
- Separation single-hop vs multi-hop : clustering pour single-hop, concentration pour multi-hop — adaptation a la structure de la tache (Section 4.1, p.4-5).

**Faiblesses :**
- Hyperparametre m=5 (nombre de termes TF-IDF) fixe manuellement sans analyse de sensibilite dans le corps principal (Section 6.1, p.7).
- Le weighting exponent p=2 dans le score de frequence (Eq. 6) est choisi empiriquement. L'analyse de sensibilite (Section 6.6) montre une stabilite pour p in [1,4], mais sans justification theorique.
- L'hypothese de clustering dense des passages adversariaux est forte. Les attaques futures pourraient generer des passages diversifies semantiquement mais coordonnes dans leur effet sur le generateur.
- Pas de garantie theorique formelle de detection (contrairement a RAGuard P062, Theorem 1).

**Questions ouvertes :**
- RAGDEFENDER resiste-t-il aux attaques composites multi-etapes (P054 PIDP) ou les passages empoisonnes sont injectes progressivement ?
- Performance sur des domaines specialises (medical, juridique) ou la diversite semantique des passages propres est faible ?
- Combinaison possible avec GMTP (P061) ou RevPRAG (P063) pour une defense en profondeur ?

### Formules exactes
- **Eq. 1** (Section 4.1, p.5) : N_TF-IDF = sum_{i=1}^{|R|} I(sum_{j=1}^{m} I(t_j in r_i) > m/2), comptage des passages contenant plus de la moitie des termes TF-IDF dominants.
- **Eq. 2-4** (Section 4.1, p.5) : Facteurs de concentration — s_mean_i = 1/(|R|-1) * sum_{j!=i} sim(r_i, r_j), s_median_i = median({sim(r_i, r_j)}).
- **Eq. 6** (Section 4.2, p.5) : Score de frequence — f_i = sum_{(r_i,r_j) in P_top} sgn(sim(r_i,r_j)) * |sim(r_i,r_j)|^p, avec p=2.
- Lien glossaire AEGIS : F22 (ASR), F69 (score frequence RAGDEFENDER — nouveau)

### Pertinence these AEGIS
- **Couches delta :** δ¹ (defense retrieval-stage, filtrage pre-generation). Approche la plus economique parmi P061-P066, la plus deployable en production.
- **Conjectures :**
  - C2 (necessite de δ³) : SUPPORTEE — ASR non-nul meme avec RAGDEFENDER (0.02-0.03), confirmant que δ¹ seul ne suffit pas pour une garantie formelle.
  - C6 (domaine medical plus vulnerable) : NEUTRE — pas de test specifique sur domaine medical.
- **Decouvertes :**
  - D-006 (RAG comme surface d'attaque) : CONFIRMEE.
  - D-012 (defenses composites necessaires) : CONFIRMEE — RAGDEFENDER est complementaire aux defenses generation-side.
  - D-016 (cout des defenses comme facteur limitant) : NOUVELLE EVIDENCE — le cout 1000x inferieur de RAGDEFENDER vs Discern-and-Answer montre que les defenses legeres sont viables en production.
- **Gaps :**
  - G-014 (defense RAG formelle) : NON ADRESSE — pas de garantie theorique.
  - G-025 (defense RAG domaine medical) : CREE — pas de validation sur corpus medical specialise.
- **Mapping templates AEGIS :** #54-#62 (RAG poisoning), #85-#90 (IPI)

### Citations cles
> "RAGDEFENDER reduces the attack success rate against the Gemini model from 0.89 to as low as 0.02" (Abstract, p.1)
> "RAGDEFENDER limits ASR to 0.03 across all three attacks" (Section 6.2, p.8)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — datasets standards, methode detaillee, 10 random seeds par experience |
| Code disponible | Non (pas mentionne explicitement) |
| Dataset public | Oui (NQ, HotpotQA, MS MARCO) |

### Classification AEGIS
- **Type d'attaque etudiee** : IPI (corpus poisoning — knowledge corruption)
- **Surface ciblee** : RAG retrieval phase (passage filtering)
- **Modeles testes** : LLaMA-7B/13B, Vicuna-7B/13B, Gemini, GPT-4o (generateurs) + Contriever, DPR, ANCE (retrievers)
- **Defense evaluee** : RAGDEFENDER (clustering + concentration + frequency score) — methode proposee
- **MITRE ATLAS** : AML.T0051.002 (Indirect Prompt Injection via RAG)
- **OWASP LLM** : LLM06 (Excessive Agency via poisoned retrieval)
