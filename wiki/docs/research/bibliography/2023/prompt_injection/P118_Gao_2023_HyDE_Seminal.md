## [Gao, Ma, Lin, Callan, 2023] — Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)

**Reference** : arXiv:2212.10496v1 (publie ACL 2023)
**Revue/Conf** : ACL 2023 — CORE A*
**Lu le** : 2026-04-09
> **PDF Source**: [literature_for_rag/P118_gao_hyde_original.pdf](../../../../assets/pdfs/P118_gao_hyde_original.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (19 chunks dans aegis_bibliography)

### Resume (5 lignes)
- **Probleme :** dense retrieval zero-shot impossible sans relevance labels : apprendre deux encoders projetant dans un meme espace inner-product requiert de la supervision (Section 3.1, Eq. 1, p.3).
- **Methode :** HyDE decompose en (1) generation d'un document hypothetique via LLM instruction-following (InstructGPT), (2) encodage via encodeur contrastif Contriever, (3) recherche MIPS contre le corpus reel. Equation cle : `v_q+ = 1/(N+1) * [sum_k f(d_k) + f(q)]` (Eq. 8, p.4).
- **Donnees :** TREC DL19/DL20, 6 datasets BEIR low-resource (SciFact, Arguana, TREC-Covid, FiQA, DBPedia, TREC-News), Mr.Tydi multilingue. Contriever comme encodeur dense.
- **Resultat :** HyDE nDCG@10 = 61.3 sur DL19 vs Contriever seul = 44.5, BM25 = 50.6 ; comparable a ContrieverFT (62.1) supervise sur MS-MARCO (Table 1, p.5).
- **Limite :** "The generated document is not real, can and is likely to be ungrounded factually... may contain false details" (Section 3.2, p.3-4). Les auteurs esperent que "the encoder's dense bottleneck to serve a lossy compressor" — defense UNIQUE proposee et NON verifiee experimentalement.

### Pertinence these AEGIS — LIEN AVEC D-024 (BASELINE ABSOLUE)
- **Couches delta :** δ¹ (retrieval layer). Papier seminal definissant l'architecture que D-024 exploite. δ² pour le pipeline complet.
- **Conjectures :** C2 (necessite δ³) — Gao et al. invoquent implicitement une defense par ancrage au corpus reel mais cette defense est ELLE-MEME un mecanisme δ¹. DEMONTRE par absence que le modele n'a aucune protection intrinseque (δ⁰/δ¹) contre des hallucinations semantiquement coherentes.
- **Decouvertes :** D-024 **BASELINE** — citation normative obligatoire pour toute description du pipeline HyDE. La claim centrale "dense bottleneck filters false details" (Section 3.2, p.3-4) est un contre-exemple EXPLICITE : D-024 demontre experimentalement que le bottleneck ECHOUE quand l'hallucination est craftee pour etre semantiquement alignee au domaine medical.
- **Gaps :** G-042 **CREE** — ce papier propose HyDE sans jamais questionner la robustesse adversariale (zero mention de "attack", "adversarial", "injection", "robustness").
- **Mapping templates AEGIS :** ancre baseline pour positionner D-024. Citation inline : `(Gao et al., 2023, ACL, Section 3.2, p.3-4)`.

### Formules exactes
- Eq. 1 (Section 3.1, p.3) : `sim(q,d) = <enc_q(q), enc_d(d)> = <v_q, v_d>`
- Eq. 8 (Section 3.2, p.4) : `v_q+ = (1/(N+1)) * [sum_k=1^N f(d_k) + f(q)]`

Lien glossaire AEGIS : F-nouvelle a creer — "HyDE query vector equation" [ALGORITHME — pas de garantie formelle de filtrage d'hallucinations].

### Citations cles
> "The document captures relevance patterns but is unreal and may contain false details." (Abstract, p.1)
> "we expect the encoder's dense bottleneck to serve a lossy compressor, where the extra (hallucinated) details are filtered out from the embedding" (Section 3.2, p.3)
> "The generated document is not real, can and is likely to be ungrounded factually" (Section 3.2, p.4)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 — seminal, baseline obligatoire |
| Reproductibilite | Moyenne — code open-source mais modeles evolutifs |
| Code disponible | Oui — https://github.com/texttron/hyde |
| Dataset public | Oui — TREC DL, BEIR, Mr.Tydi |
| Nature epistemique | [ALGORITHME] — methode proposee, pas de garantie theorique de filtrage d'hallucinations |
