# P135 — Prompting Is Programming: A Query Language for Large Language Models (LMQL)

**Reference** : arXiv:2212.06094
**Revue/Conf** : PLDI 2023 (ACM SIGPLAN Conference on Programming Language Design and Implementation, CORE A*)
**Tag** : [ARTICLE VERIFIE] — peer-reviewed PLDI 2023, precurseur historique
**Lu le** : 2026-04-11 (scoped verification RUN VERIFICATION_DELTA3_20260411)

> **PDF Source** : A injecter dans literature_for_rag/P135_lmql_beurerkellner2022.pdf (preseed COLLECTOR)
> **Auteurs** : Beurer-Kellner L., Fischer M., Vechev M. (ETH Zurich)
> **Note** : meme premier auteur (Beurer-Kellner) que P126 (Tramer et al., 2025, "Design Patterns for Securing LLM Agents against Prompt Injections") — continuite de recherche ETH Zurich sur la separation formelle entre instructions et outputs LLM

## Passage 1 — Survol (~100 mots)

**Claim principale** : LMQL introduit le concept de **Language Model Programming (LMP)** — une generalisation du prompting qui combine texte et scripting, avec la capacite de specifier des **contraintes formelles sur les outputs** du LLM via un DSL (Beurer-Kellner, Fischer, Vechev, 2022, arXiv:2212.06094, Abstract). **Originalite** : premier DSL academique peer-reviewed (PLDI 2023) qui formalise l'idee que contraindre un output LLM est un probleme de programming languages, pas seulement de prompting. **Decision** : lecture complete obligatoire — precurseur historique majeur du pattern δ³ et ancrage academique (CORE A*) pour positionner AEGIS.

## Passage 2 — Structure (~200 mots)

**Probleme** : pour obtenir des performances etat de l'art ou adapter un LLM a des taches specifiques, il faut implementer des programmes task-specific complexes, souvent ad-hoc. Le prompting pur est insuffisant pour les cas d'usage avances (Beurer-Kellner et al., 2022, Abstract, p.1).

**Hypothese explicite** : programmer un LLM avec un **langage dedie (DSL)** combinant texte et scripting permet d'exprimer des contraintes formelles sur les outputs tout en abstrayant les details internes du modele.

**Methode** : introduction du paradigme LMP (Language Model Programming) et du DSL LMQL :
- Variables typees inline dans les prompts : `"[NUM: int]"` (Beurer-Kellner et al., 2022, Section 3)
- Clauses `where` pour contraintes sur outputs : `where len(ANSWER) < 120 and STOPS_AT(ANSWER, ".")` (Beurer-Kellner et al., 2022, Section 3, exemple canonique)
- Contraintes de format, longueur, arret, type
- Runtime qui applique les contraintes au decoding (decoding contraint, pas post-filtering)

**Resultats** : LMQL permet d'exprimer les methodes de prompting avancees (interaction avec outils externes, few-shot learning, decompositions) dans un formalisme unifie, tout en offrant des garanties de format et de type. Les auteurs revendiquent une adaptation facile a de nombreuses taches avec semantique haut-niveau (Beurer-Kellner et al., 2022, Abstract).

**Limites avouees par les auteurs** : les contraintes restent **au niveau format et type** (syntaxiques), pas semantiques metier. La langue cible est generique — pas de specialisation domaine.

## Passage 3 — Profondeur critique (~200 mots)

**Forces** :
- **Venue PLDI 2023** : conference A* programming languages, equivalent academique le plus rigoureux pour un DSL. Peer-review complet, paper bien cite
- **Precurseur historique** (2022-12-12) : LMQL anticipe de plus de 2 ans le pattern δ³ formalise dans P081 CaMeL (2025), P082 AgentSpec (2025), et la claim AEGIS. **Ce point est CRITIQUE pour la verification de la claim : AEGIS n'est PAS la 4eme implementation d'un pattern recent — le pattern generique existe depuis 2022**
- **Continuite ETH Zurich** : meme premier auteur que P126 Tramer et al. 2025 sur la securite des LLM agents — filiation intellectuelle forte
- **Decoding contraint** : applique les contraintes au moment du decoding token-level, garantie plus forte que le post-filtering

**Faiblesses / questions ouvertes** :
- **Contraintes syntaxiques, pas semantiques metier** : `len < 120` et `STOPS_AT(".")` sont des contraintes de format. LMQL ne permet PAS d'exprimer des contraintes biomecaniques (tension max 800g), des contraintes multi-variables corrigees par une ontologie medicale, ou des contraintes FDA-ancrees
- **Pas de specialisation domaine** : conçu comme langage generique, pas comme framework medical
- **Adoption industrielle limitee** par rapport a des frameworks plus simples (Guardrails AI, Pydantic-based)
- **Verification integrite** : publie officiellement PLDI 2023, corpus academique stable

## Mapping δ⁰-δ³ AEGIS

- **δ⁰ (RLHF)** : non adresse
- **δ¹ (contexte sanitization)** : non adresse
- **δ² (detection runtime)** : non adresse
- **δ³ (validation formelle de sortie)** : **OUI — precurseur partiel**. LMQL implemente une forme de validation formelle via decoding contraint, mais limite au niveau format/type. **Le pattern existe** mais la **semantique metier n'est pas encodable** dans le DSL tel que propose

## Pertinence these AEGIS

- **Conjectures C1-C8 impactees** :
  - **C2 (necessite δ³)** — renforce, avec effet **inattendu** : le pattern δ³ est academiquement etabli depuis 2022 PLDI, ce qui transforme la revendication AEGIS de "pionnier" en "specialiseur medical"
- **Gaps G-XXX** :
  - **G-001 (implementation δ³ concrete)** — DOIT etre reformule : LMQL est une implementation δ³ academique peer-reviewed qui PRECEDE les 3 implementations citees (CaMeL P081, AgentSpec P082, RAGShield P066). La claim AEGIS "4eme implementation" est factuellement incorrecte — il y a au moins 4 implementations anterieures a AEGIS (LMQL, Guardrails AI, LlamaFirewall, CaMeL/AgentSpec/RAGShield)
  - La contribution AEGIS reelle est **la specialisation medicale avec contraintes biomecaniques FDA-ancrees**, pas l'invention du pattern
- **Decouvertes D-XXX** : eclaire une verite epistemologique importante — le pattern δ³ est connu depuis 2022, la nouveaute AEGIS est domain-specific

## Citation cle

> "LMP generalizes language model prompting from pure text prompts to an intuitive combination of text prompting and scripting. Additionally, LMP allows constraints to be specified over the language model output" (Beurer-Kellner et al., 2022, arXiv:2212.06094, Abstract)

## Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 — precurseur historique critique pour la verification de la claim |
| Reproductibilite | Haute — code open-source LMQL.ai, documentation PLDI |
| Code disponible | Oui — https://lmql.ai / github.com/eth-sri/lmql |
| Dataset public | N/A (DSL, pas de dataset) |
| Domaine | Generic (programming language) — **pas medical** |
| Nature | [ARTICLE VERIFIE] — DSL peer-reviewed PLDI 2023, precurseur δ³ |
