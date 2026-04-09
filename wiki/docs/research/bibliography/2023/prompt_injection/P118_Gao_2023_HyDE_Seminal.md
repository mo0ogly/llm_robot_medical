## [Gao, Ma, Lin, Callan, 2023] — Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)

**Reference** : arXiv:2212.10496v1 (publie ACL 2023)
**Revue/Conf** : ACL 2023 — CORE A*
**Lu le** : 2026-04-09
> **PDF Source**: `P118_gao_hyde_original.pdf`
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (19 chunks dans aegis_bibliography)

### Resume (5 lignes)
- **Probleme :** dense retrieval zero-shot impossible sans relevance labels (Section 3.1, Eq. 1, p.3).
- **Methode :** HyDE = (1) generation d'un document hypothetique via LLM instruction-following (InstructGPT), (2) encodage via Contriever, (3) MIPS contre le corpus reel. `v_q+ = 1/(N+1) * [sum_k f(d_k) + f(q)]` (Eq. 8, p.4).
- **Donnees :** TREC DL19/DL20, BEIR low-resource (SciFact, Arguana, TREC-Covid, FiQA, DBPedia, TREC-News), Mr.Tydi multilingue.
- **Resultat :** HyDE nDCG@10 = 61.3 sur DL19 vs Contriever 44.5, BM25 50.6 ; comparable a ContrieverFT supervise 62.1 (Table 1, p.5).
- **Limite :** "may contain false details" (Section 3.2, p.3-4). Defense UNIQUE proposee : "encoder's dense bottleneck to serve a lossy compressor" — NON verifiee experimentalement.

### Pertinence these AEGIS — LIEN AVEC D-024 (BASELINE ABSOLUE)
- **Couches delta :** δ¹ (retrieval layer), δ² (pipeline).
- **Conjectures :** C2 (necessite δ³) — DEMONTRE par absence qu'aucune protection intrinseque (δ⁰/δ¹) contre des hallucinations semantiquement coherentes.
- **Decouvertes :** D-024 **BASELINE** — citation normative. La claim "dense bottleneck filters false details" (Section 3.2, p.3-4) est le contre-exemple EXPLICITE : D-024 demontre que le bottleneck ECHOUE quand l'hallucination est craftee pour etre semantiquement alignee au domaine medical.
- **Gaps :** G-042 **CREE** — zero mention de "attack", "adversarial", "injection", "robustness".
- **Mapping templates AEGIS :** ancre baseline. Citation inline : `(Gao et al., 2023, ACL, Section 3.2, p.3-4)`.

### Formules exactes
- Eq. 1 (p.3) : `sim(q,d) = <enc_q(q), enc_d(d)> = <v_q, v_d>`
- Eq. 8 (p.4) : `v_q+ = (1/(N+1)) * [sum_k=1^N f(d_k) + f(q)]`

Lien glossaire AEGIS : F-nouvelle "HyDE query vector equation" [ALGORITHME — pas de garantie formelle].

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
| Nature epistemique | [ALGORITHME] — methode sans garantie theorique de filtrage |
