## [Yoon, Jung, Yoon, Park, 2025] — Hypothetical Documents or Knowledge Leakage? Rethinking LLM-based Query Expansion

**Reference** : arXiv:2504.14175v2
**Revue/Conf** : ACL 2025 Findings — CORE A*
**Lu le** : 2026-04-09
> **PDF Source**: `P117_yoon_hypothetical_knowledge_leakage.pdf`
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (32 chunks dans aegis_bibliography)

### Resume (5 lignes)
- **Probleme :** les gains de performance de HyDE et Query2doc sont-ils reels ou resultent-ils d'une fuite de connaissances memorisees ? (Section 1, p.1)
- **Methode :** pour chaque couple (claim, document hypothetique), NLI (GPT-4o-mini) determine si une phrase de d est entailled par une evidence gold e. Classification binaire matched (M) / unmatched (~M) (Section 3.3, p.3).
- **Donnees :** FEVER 6,666 claims / SciFact 693 / AVeriTeC 3,563 ; 7 LLMs ; 8 repetitions (Section 4, Table 1).
- **Resultat :** proportion de claims matched 27.6%-83.5% ; gain QE concentre sur les claims M ; sur les claims ~M, HyDE fait PIRE que Contriever baseline (Recall@5 = 23.4 vs 26.8 sur FEVER, Table 4, p.5).
- **Limite :** pas de lien causal etabli ; scope limite au fact-verification (Section Limitations, p.6).

### Pertinence these AEGIS — LIEN AVEC D-024 (CRITIQUE)
- **Couches delta :** δ¹ (retrieval) principalement, δ² (orchestration du pipeline query-expansion) secondairement.
- **Conjectures :** C2 (necessite δ³) — demonstration empirique que δ¹ SEUL ne peut pas separer hallucination de connaissance reelle ; C6 (medical) — SciFact corpus scientifique.
- **Decouvertes :** D-024 **BENIGN ANALOG** — Yoon et al. demontrent que les gains HyDE viennent de cas ou le modele reproduit la gold evidence memorisee. D-024 est l'EXPLOITATION ADVERSARIALE du meme mecanisme : prompt pour FABRIQUER de l'autorite institutionnelle (FDA fictive, avertissements inventes). Mecanisme identique — SEULE la charge utile change.
- **Gaps :** G-042 (defense HyDE) **ENRICHI** — papier le plus proche de D-024 mais framing strictement benin.
- **Mapping templates AEGIS :** ancre scientifique. Citation inline obligatoire : `(Yoon et al., 2025, ACL Findings, Section 4, Table 4, p.5)`.

### Citations cles
> "QE methods were effective, on average, only when the generated documents included sentences entailed by gold evidence." (Section 1, p.2)
> "performance on unmatched claims was lower than that of the corresponding baseline methods without query expansion" (Section 4, p.5)
> "the seven LLMs studied in this paper were likely exposed to knowledge sources from the three benchmarks during training" (Section 5, p.5)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 — le papier le plus proche de D-024 dans le corpus 2026-04 |
| Reproductibilite | Haute — 7 LLMs publics/API, 3 datasets publics, 8 reps |
| Code disponible | Partiel |
| Dataset public | Oui — FEVER, SciFact, AVeriTeC |
| Nature epistemique | [EMPIRIQUE] — correlation observee, pas de garantie theorique |
