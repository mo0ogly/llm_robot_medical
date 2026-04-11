## [Yoon, Jung, Yoon, Park, 2025] — Hypothetical Documents or Knowledge Leakage? Rethinking LLM-based Query Expansion

**Reference** : arXiv:2504.14175v2
**Revue/Conf** : ACL 2025 Findings — CORE A*
**Lu le** : 2026-04-09
> **PDF Source**: [literature_for_rag/P117_yoon_hypothetical_knowledge_leakage.pdf](../../../../assets/pdfs/P117_yoon_hypothetical_knowledge_leakage.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (32 chunks dans aegis_bibliography)

### Resume (5 lignes)
- **Probleme :** les gains de performance de HyDE et Query2doc sont-ils reels ou resultent-ils d'une fuite de connaissances memorisees depuis les corpus de pre-entrainement ? (Section 1, p.1)
- **Methode :** pour chaque couple (claim, document hypothetique), NLI (GPT-4o-mini) determine si une phrase de d est entailled par une evidence gold e. Classification binaire matched (M) / unmatched (~M) (Section 3.3, p.3).
- **Donnees :** 3 benchmarks (FEVER 6,666 claims / SciFact 693 / AVeriTeC 3,563), 7 LLMs (GPT-4o-mini, Claude-3-haiku, Gemini-1.5-flash, Llama-3.1-8b/70b, Mistral-7b, Mixtral-8x7b), 8 repetitions (Section 4, p.3-4, Table 1).
- **Resultat :** proportion de claims matched entre 27.6% et 83.5% ; gain QE concentre quasi exclusivement sur les claims M ; sur les claims ~M, HyDE FAIT PIRE que Contriever baseline (Recall@5 = 23.4 vs 26.8 sur FEVER, p.5 Table 4).
- **Limite :** pas de lien causal etabli entre donnees d'entrainement specifiques et generation (Section Limitations, p.6) ; scope limite au fact-verification.

### Pertinence these AEGIS — LIEN AVEC D-024 (CRITIQUE)
- **Couches delta :** δ¹ (retrieval) principalement, δ² (orchestration du pipeline query-expansion) secondairement.
- **Conjectures :** C2 (necessite δ³) — demonstration empirique que δ¹ SEUL ne peut pas separer hallucination de connaissance reelle ; C6 (medical) — SciFact corpus scientifique.
- **Decouvertes :** D-024 **BENIGN ANALOG** — Yoon et al. demontrent que les gains HyDE viennent majoritairement de cas ou le modele reproduit (partiellement) la gold evidence memorisee. D-024 est l'EXPLOITATION ADVERSARIALE du meme mecanisme : au lieu de laisser le modele fuir des faits vrais memorises, on le prompt pour FABRIQUER de l'autorite institutionnelle (FDA fictive, avertissements inventes) reinjectee comme contexte. Mecanisme identique — SEULE la charge utile change.
- **Gaps :** G-042 (defense HyDE) **ENRICHI** — Yoon et al. est le papier le plus proche de D-024 mais framing strictement benin (zero mot "security", "attack", "adversarial", "injection").
- **Mapping templates AEGIS :** ancre scientifique pour positionner D-024 comme orthogonal et complementaire. Citation inline obligatoire : `(Yoon et al., 2025, ACL Findings, Section 4, Table 4, p.5)`.

### Citations cles
> "QE methods were effective, on average, only when the generated documents included sentences entailed by gold evidence." (Section 1 Introduction, p.2)
> "performance on unmatched claims was lower than that of the corresponding baseline methods without query expansion" (Section 4, p.5)
> "the seven LLMs studied in this paper were likely exposed to knowledge sources from the three benchmarks during training" (Section 5 Discussion, p.5)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 — le papier le plus proche de D-024 dans le corpus 2026-04 |
| Reproductibilite | Haute — 7 LLMs publics/API, 3 datasets publics, code NLI decrit, 8 reps |
| Code disponible | Partiel (Appendices B, E mentionnes dans le texte lu) |
| Dataset public | Oui — FEVER, SciFact, AVeriTeC |
| Nature epistemique | [EMPIRIQUE] — correlation observee, pas de garantie theorique |
