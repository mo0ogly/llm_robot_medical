## [Beurer-Kellner, Fischer, Vechev, 2022] — Prompting Is Programming: A Query Language for Large Language Models (LMQL)

**Reference :** arXiv:2212.06094
**Revue/Conf :** PLDI 2023 (ACM SIGPLAN Conference on Programming Language Design and Implementation, CORE A*)
**Lu le :** 2026-04-11 (scoped verification RUN VERIFICATION_DELTA3_20260411)
> **PDF Source**: [literature_for_rag/P134_lmql_beurerkellner2022.pdf](../../../literature_for_rag/P134_lmql_beurerkellner2022.pdf) (a injecter)
> **Statut**: [ARTICLE VERIFIE] — peer-reviewed PLDI 2023, precurseur historique δ³
> **Auteurs**: Beurer-Kellner Luca, Fischer Marc, Vechev Martin (ETH Zurich — Scalable, Reliable, Intelligent Systems Lab)
> **Filiation**: meme premier auteur que P126 (Tramer et al., 2025, "Design Patterns for Securing LLM Agents against Prompt Injections") — continuite ETH Zurich sur la separation formelle instructions/outputs LLM

### Abstract original
> "Large language models have demonstrated outstanding performance on a wide range of tasks such as question answering and code generation. [...] Based on this, we present the novel idea of Language Model Programming (LMP). LMP generalizes language model prompting from pure text prompts to an intuitive combination of text prompting and scripting. Additionally, LMP allows constraints to be specified over the language model output. This enables easy adaption to many tasks while abstracting language model internals and providing high-level semantics."
> — Source : arXiv:2212.06094, Abstract, p.1

### Resume (5 lignes)
- **Probleme :** Pour obtenir des performances etat de l'art ou adapter un LLM a des taches specifiques, il faut implementer des programmes task-specific complexes, souvent ad-hoc. Le prompting pur est insuffisant (Beurer-Kellner et al., 2022, Abstract)
- **Methode :** Introduction du paradigme Language Model Programming (LMP) et du DSL LMQL. Variables typees inline `[NUM: int]`, clauses `where` pour contraintes outputs, runtime avec decoding contraint token-level (Beurer-Kellner et al., 2022, Section 3)
- **Donnees :** N/A — DSL conceptuel, evaluation sur methodes de prompting avancees
- **Resultat :** LMQL permet d'exprimer methodes de prompting avancees dans un formalisme unifie avec garanties de format/type (Beurer-Kellner et al., 2022, Abstract)
- **Limite :** Contraintes syntaxiques (format, type), pas semantiques metier — pas de specialisation domaine

### Analyse critique
**Forces :**
- **Venue PLDI 2023 (CORE A*)** — conference programming languages la plus rigoureuse, peer-review complet
- **Precurseur historique** (soumis 2022-12-12) — LMQL anticipe de plus de 2 ans le pattern δ³ formalise dans P081 CaMeL (2025), P082 AgentSpec (2025), et la claim AEGIS initiale
- **Decoding contraint token-level** : applique les contraintes au moment du decoding, garantie plus forte que le post-filtering
- **Filiation ETH Zurich** : meme premier auteur que P126 (Tramer et al., 2025) sur la securite des LLM agents — continuite intellectuelle forte
- Code open-source disponible (https://lmql.ai, github.com/eth-sri/lmql)

**Faiblesses :**
- **Contraintes syntaxiques, pas semantiques metier** : `len(ANSWER) < 120` et `STOPS_AT(".")` sont des contraintes de format. LMQL ne permet PAS d'exprimer des contraintes biomecaniques (tension max 800g), des contraintes multi-variables corrigees par une ontologie medicale, ou des contraintes FDA-ancrees
- **Pas de specialisation domaine** — conçu comme langage generique, pas comme framework medical
- **Adoption industrielle limitee** par rapport a des frameworks plus simples (Guardrails AI, Pydantic-based)

**Questions ouvertes :** performances quantitatives exactes sur benchmarks LLM, comparaison avec CaMeL taint tracking, extensibilite aux contraintes semantiques metier.

### Formules exactes
Pattern DSL canonique (Beurer-Kellner et al., 2022, Section 3) :
```lmql
"Answer the question: [ANSWER]"
where len(ANSWER) < 120 and STOPS_AT(ANSWER, ".")
```
Variables typees inline : `"[NUM: int]"` — binding contraint au moment du decoding (Beurer-Kellner et al., 2022, Section 3).

### Pertinence these AEGIS
- **Couches delta :** **δ³ precurseur academique partiel** — premiere implementation δ³ peer-reviewed via decoding contraint, limitee au niveau format/type (pas semantique metier)
- **Conjectures :** **C2 (necessite δ³)** renforce de maniere **inattendue** : le pattern δ³ est academiquement etabli depuis 2022 PLDI, ce qui transforme la revendication AEGIS de "pionnier" en "specialiseur medical"
- **Decouvertes :** eclaire une verite epistemologique critique — le pattern δ³ est connu depuis 2022, la nouveaute AEGIS est domain-specific
- **Gaps :** **G-001 (implementation δ³ concrete)** DOIT etre reformule — LMQL est une implementation δ³ academique peer-reviewed qui PRECEDE les 3 implementations citees (CaMeL P081, AgentSpec P082, RAGShield P066). La contribution AEGIS reelle est la specialisation medicale avec contraintes biomecaniques FDA-ancrees, pas l'invention du pattern
- **Integration VERIFICATION_DELTA3_20260411 :** **citation historique clef** pour la reformulation §1 δ³.md — "La validation formelle de sortie (δ³) est un pattern academiquement etabli depuis LMQL (Beurer-Kellner et al., 2022, PLDI 2023)"

### Citations cles
> "LMP generalizes language model prompting from pure text prompts to an intuitive combination of text prompting and scripting. Additionally, LMP allows constraints to be specified over the language model output" (Beurer-Kellner et al., 2022, arXiv:2212.06094, Abstract)

### Analyse Keshav
Voir fichier analyst source: `research_archive/_staging/analyst/P135_analysis.md` (renumerote P135 -> P134 a l'integration LIBRARIAN 2026-04-11).

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 — precurseur historique critique pour la verification de la claim |
| Reproductibilite | Haute — code open-source, documentation PLDI |
| Code disponible | Oui — https://lmql.ai / github.com/eth-sri/lmql |
| Dataset public | N/A (DSL, pas de dataset) |
| Domaine | Generic (programming language) — pas medical |
| Nature | [ARTICLE VERIFIE] — DSL peer-reviewed PLDI 2023, precurseur δ³ |
| Pattern match δ³ | OUI — precurseur academique (format/type), pas semantique metier |
