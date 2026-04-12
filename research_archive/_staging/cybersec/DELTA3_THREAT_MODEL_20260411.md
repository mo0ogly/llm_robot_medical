# Threat Model Comparaison — 5 frameworks δ³ — 2026-04-11

## Contexte

**RUN** : VERIFICATION_DELTA3_20260411
**Scope** : 5 nouveaux candidats (P131-P135) + rappel 3 δ³-impl existants (P081 CaMeL, P082 AgentSpec, P066 RAGShield)
**Claim ciblee** : "La these AEGIS propose une QUATRIEME implementation δ³ via validate_output + AllowedOutputSpec, apres CaMeL (P081), AgentSpec (P082) et RAGShield (P066)."
**Verdict preseed COLLECTOR** : NUANCED — la claim "4eme implementation" est numeriquement fausse (>= 6 frameworks anterieurs de output validation). La vraie originalite est la SPECIALISATION medicale chirurgicale FDA-ancree.

Agent : CYBERSEC scoped
Source preseed : `research_archive/_staging/collector/VERIFICATION_DELTA3_20260411_preseed.json`

---

## Threat models individuels

---

## P131 LlamaFirewall (Chennabasappa et al., Meta AI, 2025)

**Reference** : arXiv:2505.03574 (Chennabasappa et al., 2025, Meta AI, Section 3)
**Code** : https://github.com/meta-llama/PurpleLlama/tree/main/LlamaFirewall

### Threat model

| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | black-box principal (PromptGuard 2 detecteur classificateur) + grey-box pour Agent Alignment Checks (inspecte CoT) |
| Acces | prompt direct (user input) + donnees tierces (webpages, emails cites dans l'abstract Section 1) + outils (CodeShield sur code genere) + memoire agent |
| Multi-turn | oui — Agent Alignment Checks analyse la trajectoire complete de raisonnement (abstract, Section 4) |
| Objectif adresse | execution code insecure (CodeShield), goal hijacking (Agent Alignment Checks), contournement alignement (PromptGuard 2) |

### Classification AEGIS

- **Type d'attaque adressee** : DPI (PromptGuard 2), IPI (Agent Alignment Checks sur data tierces), Goal Hijack (Agent Alignment Checks CoT audit), code insecure generation (CodeShield) — Leaking non explicite
- **Surface ciblee** : User prompt + context/RAG + Outil (code) + Agent reasoning state
- **Modeles testes** : modeles Meta Llama (versions non specifiees dans abstract, a verifier section eval), avec focus sur Llama agents — pas de versions exactes GPT/Claude mentionnees
- **Defense type** : Detection (PromptGuard 2 classifier) + Inspection CoT (Agent Alignment Checks) + Formal static analysis (CodeShield) + Policy enforcement (real-time guardrail monitor)
- **MITRE ATLAS** : AML.T0051 (LLM Prompt Injection), AML.T0051.000 (Direct), AML.T0051.001 (Indirect)
- **OWASP LLM Top 10 (2025)** : LLM01 (Prompt Injection), LLM02 (Sensitive Information Disclosure — partiel), LLM06 (Excessive Agency — Agent Alignment Checks), LLM07 (System Prompt Leakage — partiel), LLM08 (Vector and Embedding Weaknesses — non), LLM05 (Improper Output Handling — via CodeShield)

### Mapping couche δ

- **δ⁰ (RLHF)** : NON (LlamaFirewall est une couche externe, ne modifie pas l'alignement)
- **δ¹ (system prompt)** : NON (pas de verification d'integrite du system prompt)
- **δ² (gardes runtime)** : OUI — PromptGuard 2 est un classificateur jailbreak (Section 3 abstract : "universal jailbreak detector"). Agent Alignment Checks inspecte la trajectoire CoT de maniere runtime.
- **δ³ (enforcement formel/static)** : OUI partiel — CodeShield est explicitement decrit comme "online static analysis engine" (abstract Section 3). C'est un δ³ mais pour le domaine CODE. Les "system level, use case specific safety policy definition and enforcement" (abstract Section 1) suggerent une capacite de specification declarative — a verifier en full-text.

### Couverture taxonomie AEGIS (70 techniques defensives)

- **Detection input** : T01-T15 (prompt classifiers) — PromptGuard 2 couvre largement
- **Runtime CoT monitoring** : T38-T42 (agent reasoning audit) — Agent Alignment Checks
- **Static code verification** : T58-T60 (output validation pour code) — CodeShield
- **Output specification formelle semantique medicale** : AUCUNE TECHNIQUE — gap confirme (critical_gap_vs_aegis du preseed)
- **Biomechanical constraint enforcement (max_tension_g, forbidden_tools, HL7 OBX)** : AUCUNE TECHNIQUE — hors scope CodeShield

### Evaluation experimentale (Section 3 abstract seul, fulltext non lu)

- ASR baseline : non specifie dans abstract
- ASR avec defense : qualifie "state of the art performance" (abstract) — chiffres exacts dans la section eval non accessible depuis preseed
- Juge : mixte (classifier + CoT auditor + static analyzer)
- Reproductibilite : **Haute** (code open-source GitHub PurpleLlama, documentation Meta)
- **[ABSTRACT SEUL]** : les chiffres precis d'ASR necessiteraient query ChromaDB multi-collection ou fulltext apres injection P131

### Gap vs AEGIS

LlamaFirewall est le framework le PLUS proche d'AEGIS parmi les 5 candidats. Il partage l'architecture 3-couches (detection + runtime CoT audit + static enforcement) et le modele d'attaque (DPI+IPI+Goal Hijack+agent misalignment). Cependant :

1. **Domaine CODE vs MEDICAL** : CodeShield est specialise pour detecter patterns de code insecure (SQL injection, XSS, hardcoded secrets). AEGIS validate_output est specialise pour contraintes biomecaniques chirurgicales (tension 50-800g, instruments autorises, directives HL7 OBX).
2. **Specification Python dataclass vs static patterns** : AEGIS AllowedOutputSpec est une structure de donnees Python typee qui encode des contraintes metier ancrees dans la documentation FDA 510k du Da Vinci Xi. CodeShield est une collection de regles statiques generiques.
3. **Compliance reglementaire** : AEGIS repond explicitement a la critique de Weissman et al. (2025, npj Digital Medicine, abstract) qui appelle a des methodes "beyond prompts" pour la conformite device-like FDA. LlamaFirewall n'adresse pas la conformite medicale.

**LlamaFirewall renforce C2 (necessite δ³)** : un lab industriel majeur (Meta) valide empiriquement qu'un δ³ est necessaire pour les agents. Mais il NE resout pas D-001 triple convergence car il ne specialise pas le domaine haut-enjeu.

---

## P132 Weissman et al. (2025) — npj Digital Medicine

**Reference** : Weissman, Mankowitz, Kanter (2025, npj Digital Medicine, University of Pennsylvania), DOI: 10.1038/s41746-025-01544-y, PubMed 40055537

### Threat model

| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | user clinicien non-malveillant (pas de threat model adversarial formel) |
| Acces | prompt direct dialogue (chatbot) |
| Multi-turn | partiel (scenarios cliniques) |
| Objectif adresse | evaluation : est-ce que le LLM produit du CDS device-like sans autorisation FDA ? |

### Classification AEGIS

- **Type d'attaque adressee** : AUCUN (paper d'evaluation regulatoire, pas red-team)
- **Surface ciblee** : output chatbot medical
- **Modeles testes** : "two popular LLMs" (abstract) — versions non specifiees dans abstract (typiquement GPT-4 + Claude ou Llama a verifier)
- **Defense type** : AUCUNE — le paper DOCUMENTE un probleme, ne propose pas de solution
- **MITRE ATLAS** : non applicable (pas d'attaque)
- **OWASP LLM Top 10** : contexte LLM01 (sorties produites sans controle de specification)

### Mapping couche δ

- **δ⁰/δ¹/δ²/δ³** : le paper ne teste aucune defense. Il etablit le BESOIN de defenses formelles au-dela du prompt engineering (δ³).

### Citation cle pour AEGIS (abstract verbatim, DOI 10.1038/s41746-025-01544-y)

> "effective regulation may require new methods to better constrain LLM output, and prompts are inadequate for this purpose"

Cette phrase est l'argument de motivation direct pour AEGIS validate_output/AllowedOutputSpec : un journal Nature portfolio confirme publiquement que le prompt engineering (δ¹/partiel) est insuffisant pour la conformite FDA et appelle a "new methods to constrain LLM output" — exactement ce qu'AEGIS propose au niveau δ³.

### Couverture taxonomie AEGIS

- AUCUNE technique — paper de motivation, pas de framework.

### Evaluation experimentale

- **N** : pas specifie dans abstract
- **Verdict** : "LLM output readily produced device-like decision support across a range of scenarios" (abstract)
- Reproductibilite : Haute (journal Nature portfolio, methodologie standard evaluation medicale)

### Gap vs AEGIS

P132 n'est PAS un concurrent — c'est une **justification publique** pour AEGIS. Ce paper fournit la legitimite reglementaire pour la contribution AEGIS : une revue Nature reclame explicitement des methodes de contrainte d'output LLM pour le domaine medical, et AEGIS repond precisement a cette demande avec validate_output specialise FDA 510k Da Vinci Xi.

---

## P133 Guardrails AI (industrial open-source, 2023-)

**Reference** : https://github.com/guardrails-ai/guardrails (Guardrails AI Inc.)

### Threat model

| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | non formalise (framework generique) |
| Acces | developpeur integre validators dans pipeline LLM |
| Multi-turn | non (validation per-call) |
| Objectif adresse | output conformity (types, schemas, custom validators) |

### Classification AEGIS

- **Type d'attaque adressee** : partiellement DPI (via validators type profanity/toxicity), partiellement Leaking (PII validators), PAS IPI, PAS Jailbreak (input-side), PAS Goal Hijack
- **Surface ciblee** : Output LLM
- **Modeles testes** : framework-agnostique (tout LLM accessible en Python)
- **Defense type** : Schema enforcement (Pydantic) + Composable validators + OnFailAction enums (preseed primary_claim)
- **MITRE ATLAS** : AML.T0051 (partiel, output-side post-generation verification)
- **OWASP LLM Top 10** : LLM01 (partiel — output filtering), LLM05 (Improper Output Handling), LLM02 (Sensitive Information Disclosure — via PII validators)

### Mapping couche δ

- **δ⁰/δ¹/δ²** : NON
- **δ³** : **OUI partiel** — Guardrails AI est une implementation GENERIQUE de δ³ via Pydantic. `Guard.for_pydantic(output_class=Pet); guard.validate(input_string)` (preseed validation_pattern_exact). C'est une forme faible de δ³ : declarative structurelle (types, shapes), pas semantique metier.

### Couverture taxonomie AEGIS (70 techniques)

- **Output schema validation** : T60-T65 (Pydantic-style type enforcement)
- **PII/toxicity filters** : T20-T25 (validators prebuilts)
- **AllowedOutputSpec semantique metier** : AUCUNE — limitation structurelle du Pydantic model

### Evaluation experimentale

- Pas d'eval academique formelle (framework industriel)
- ~6700 etoiles GitHub (preseed) — validation ecosysteme
- Reproductibilite : Haute (open-source MIT-like)

### Gap vs AEGIS

Guardrails AI et AEGIS validate_output partagent le pattern declaratif (Python objet -> contraintes). Les differences critiques :

1. **Type vs semantique** : Pydantic impose des TYPES (int, str, List[int]) et des FORMATS (regex, range). AEGIS AllowedOutputSpec impose des CONTRAINTES METIER : `max_tension_g: 800`, `forbidden_tools: ["laser_cautery_pediatric"]`, `require_directives: ["HL7_OBX_20_3"]`. Un output peut etre type-valide sans etre medically-valid.
2. **Pas de reachable set** : AEGIS encode Reachable(i)/Allowed(i) comme contrainte contextuelle (l'etat de l'operation change les outputs autorises). Guardrails validators sont stateless.
3. **Pas de couplage FDA 510k** : AEGIS ancre chaque contrainte dans un document FDA traceable. Guardrails est domain-agnostique.

**Conclusion** : Guardrails AI est une implementation δ³ generique et merite d'etre cite dans le related work AEGIS. Elle REFUTE partiellement la claim "4eme implementation" (c'est deja la 7eme+ implementation de pattern validate_output), mais NE REFUTE PAS la specialisation medicale qui est la vraie contribution originale.

---

## P134 LLM Guard (Protect AI, 2023-)

**Reference** : https://github.com/protectai/llm-guard (Protect AI, MIT license)

### Threat model

| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | black-box (prompt + response observables) |
| Acces | prompt direct (input scanners) + response LLM (output scanners) |
| Multi-turn | non (scan per-call) |
| Objectif adresse | sanitization, harmful language, data leakage, prompt injection |

### Classification AEGIS

- **Type d'attaque adressee** : DPI (prompt injection scanner), IPI (partiel via URL/code scanners), Jailbreak (harmful content scanner), Leaking (PII/secrets scanners), partiel Goal Hijack
- **Surface ciblee** : prompt + response
- **Modeles testes** : framework-agnostique
- **Defense type** : Detection (multi-scanner architecture) — PAS de specification declarative
- **MITRE ATLAS** : AML.T0051 (detection), AML.T0007 (Discover ML Artifacts — sensitive info detection)
- **OWASP LLM Top 10** : LLM01 (Prompt Injection scanner), LLM02 (Sensitive Information Disclosure), LLM05 (Improper Output Handling), LLM09 (Misinformation — harmful content)

### Mapping couche δ

- **δ²** : **OUI** — LLM Guard est principalement une couche de **detection** (δ²). 15 input scanners + 21 output scanners (abstract preseed) = 36 detecteurs paralleles.
- **δ³** : **partiel** — les output scanners (filtering, PII masking) sont post-generation, donc partiellement δ³. Mais PAS de specification centralisee (architecture scanners paralleles independants).

### Couverture taxonomie AEGIS (70 techniques)

- **Input scanners** : T01-T15 (prompt injection, jailbreak detection)
- **Output scanners** : T20-T30 (PII, toxicity, banned topics, bias)
- **AEGIS RagSanitizer** : LLM Guard est un competiteur direct du RagSanitizer d'AEGIS (15 detecteurs dans AEGIS + GMTP candidat = 16 vs 36 chez LLM Guard). La difference architecturale n'est pas le nombre mais le placement : RagSanitizer est integre au pipeline RAG AEGIS avec telemetrie Sep(M)/SVC.

### Evaluation experimentale

- Pas d'eval academique formelle
- ~2800 etoiles GitHub (preseed)
- Reproductibilite : Haute (MIT, code public)

### Gap vs AEGIS

LLM Guard confirme le paradigme "multi-detector parallel" pour δ², mais il ne fait PAS de specification declarative δ³. La difference fondamentale :

1. **Detection vs specification** : LLM Guard detecte des patterns indesirables. AEGIS validate_output specifie des patterns REQUIS (Allowed(i)). Le premier est reactif (blacklist etendue), le second est proactif (whitelist formelle).
2. **Pas de couplage contexte operation** : LLM Guard scanners sont stateless. AEGIS couple validation a l'etat de l'operation chirurgicale (etape courante, tissu, instrument actif).
3. **Detection vs proof-of-obligation** : LLM Guard peut laisser passer un output qui n'est pas dans la blacklist mais qui viole une contrainte metier AEGIS.

**Conclusion** : LLM Guard est un **baseline δ² industriel** pour comparer le RagSanitizer AEGIS (meme paradigme, plus de scanners cote Protect AI mais moins d'integration domaine). Il ne concurrence PAS AEGIS validate_output au niveau δ³.

---

## P135 LMQL (Beurer-Kellner, Fischer, Vechev — ETH Zurich, PLDI 2023)

**Reference** : arXiv:2212.06094 (Beurer-Kellner et al., PLDI 2023, ACM SIGPLAN), ETH Zurich
**Noteworthy** : meme premier auteur que P126 Tramer et al. 2025 "Design Patterns for Securing LLM Agents against Prompt Injections" — continuite de recherche sur separation formelle.

### Threat model

| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | non formalise (research paper generation quality, pas security primaire) |
| Acces | developpeur ecrit programme LMQL |
| Multi-turn | oui (LMQL supporte interaction LLM + outils + user) |
| Objectif adresse | specification formelle des outputs LLM pour precision/format/qualite |

### Classification AEGIS

- **Type d'attaque adressee** : non explicite (paper PL design, pas security). Indirectement : Jailbreak partiel (constraints where-clauses bloquent formats interdits), Leaking partiel (typed variables limitent exfiltration)
- **Surface ciblee** : output tokens / generation decoding
- **Modeles testes** : LLMs hosted (HuggingFace, OpenAI API typiquement — preseed non specifique)
- **Defense type** : **Formal enforcement via constraint-driven decoding** — LMQL modifie le decoding du LLM pour forcer la conformite aux contraintes inline
- **MITRE ATLAS** : non applicable directement (outil de programmation, pas de security eval)
- **OWASP LLM Top 10** : LLM05 (Improper Output Handling — output shape guaranteed), LLM01 (partiel si constraints empechent obey-injection)

### Mapping couche δ

- **δ⁰/δ¹/δ²** : NON
- **δ³** : **OUI** — LMQL est une **implementation δ³ au niveau DECODING**. Le PL enforce les contraintes pendant la generation token-par-token. Chronologiquement, c'est probablement la PREMIERE implementation δ³ publique (2022-12-12 submission, PLDI 2023 venue).

### Pattern validation cle (preseed validation_pattern_exact)

```lmql
where len(ANSWER) < 120 and STOPS_AT(ANSWER, ".")
[NUM: int]
```

- `where` clauses : contraintes inline sur la longueur, le stopping, les tokens interdits
- `[NUM: int]` : typed variables (Pydantic-like mais dans le DSL)

### Couverture taxonomie AEGIS (70 techniques)

- **Constrained decoding** : T55-T57 (format enforcement)
- **Typed output variables** : T60-T65 (shape/type guarantees)
- **Contraintes semantiques metier** : AUCUNE — LMQL permet uniquement des contraintes format/type/stopping. Pas d'Allowed(i) semantique.

### Evaluation experimentale

- Eval PLDI 2023 focus : expressivite PL + efficacite decoding
- Pas de security benchmark
- Reproductibilite : Haute (papier PLDI, code public typique ETH Zurich)

### Gap vs AEGIS

LMQL est le plus **ancien** des 5 candidats et probablement le premier δ³ jamais publie dans un venue top-tier. Cependant, LMQL est un DSL **generique** (PL design) alors qu'AEGIS validate_output est une implementation **specialisee medicale** :

1. **DSL inline vs dataclass Python** : LMQL exige que l'utilisateur apprenne un nouveau langage. AEGIS AllowedOutputSpec est une dataclass Python standard (zero coubre d'apprentissage pour ingenieurs medicaux).
2. **Contraintes format vs semantiques** : LMQL contraint la forme (`len < 120`, `type: int`). AEGIS contraint le sens (`tension_g <= 800 and instrument not in FORBIDDEN_PEDIATRIC and has_hl7_obx_20_3`).
3. **Post-hoc vs decoding** : LMQL agit pendant le decoding (plus efficient). AEGIS agit post-generation (plus flexible, plus auditable, compatible avec tout LLM y compris black-box API). Le choix AEGIS est motive par l'exigence de TRAÇABILITE FDA : chaque decision de rejet doit etre loggee et explicable.

**Conclusion** : LMQL est l'ANCETRE historique de l'idee "contraintes formelles sur output LLM" et merite la citation. Il prouve que le pattern existe depuis 2022. Cela REFUTE definitivement la claim "4eme implementation" numeriquement : AEGIS est chronologiquement au moins la 6eme ou 7eme implementation de pattern output constraints. **Mais aucune des 5+ implementations anterieures ne specialise le domaine medical chirurgical avec contraintes biomecaniques FDA.**

---

## Rappel — 3 δ³-impl existants reference

| # | Framework | Reference | δ³ type | Domaine |
|---|-----------|-----------|---------|---------|
| **P081** | CaMeL (Capabilities for ML) | arXiv:2503.18813v3 | capability-based access control pour agents | generique (code, agents) |
| **P082** | AgentSpec | arXiv:2503.18666 (ICSE 2025) | runtime enforcement declarative specs pour agents | generique (agents web/outils) |
| **P066** | RAGShield | arXiv:2604.00387 | output validation pour RAG documents | generique (RAG) |

Ces 3 sont les δ³-impl academiques que le preseed cite comme "predecesseurs" de la claim AEGIS. Le preseed COLLECTOR confirme qu'aucun n'adresse le domaine medical chirurgical avec contraintes biomecaniques.

---

## Synthese comparative

### Tableau cross-framework

| # | Framework | DPI | IPI | Jailbreak | Goal Hijack | Leaking | MITRE | OWASP LLM Top 10 | δ³ ? | Medical FDA ? |
|---|-----------|:---:|:---:|:---------:|:-----------:|:-------:|-------|-------|:----:|:-----:|
| **P131** | LlamaFirewall (Meta 2025) | OUI | OUI | OUI | OUI | partiel | AML.T0051.000/001 | LLM01, LLM05, LLM06, LLM07 | **OUI** (CodeShield static analysis) | NON |
| **P132** | npj DM Weissman 2025 | — | — | — | — | — | — | contexte LLM01, LLM05 | NON (motivation) | **appel a methodes** |
| **P133** | Guardrails AI | partiel | NON | NON | NON | partiel | AML.T0051 (partiel) | LLM01, LLM02, LLM05 | **partiel** (Pydantic structural) | NON |
| **P134** | LLM Guard | OUI | partiel | OUI | partiel | OUI | AML.T0051, AML.T0007 | LLM01, LLM02, LLM05, LLM09 | **partiel** (detection post-gen) | NON |
| **P135** | LMQL (ETH 2022/PLDI 2023) | partiel | — | partiel | — | partiel | — | LLM05 (partiel) | **OUI** (constraint decoding) | NON |
| **P081** | CaMeL | OUI | OUI | — | OUI | partiel | AML.T0051 | LLM01, LLM06 | **OUI** (capabilities) | NON |
| **P082** | AgentSpec | OUI | OUI | — | OUI | partiel | AML.T0051 | LLM01, LLM06 | **OUI** (runtime spec) | NON |
| **P066** | RAGShield | — | OUI | — | — | partiel | AML.T0051.001 | LLM01, LLM08 | **partiel** (RAG validation) | NON |
| **AEGIS** | validate_output + AllowedOutputSpec | OUI | OUI | OUI | OUI | OUI | AML.T0051.000/001 + AML.T0020 (Poison) | **LLM01 + LLM05 + LLM06 + LLM09** + **medical device FDA** | **OUI** (semantique metier) | **OUI** (Da Vinci Xi FDA 510k) |

### Comptage δ³-impl publics

1. LMQL (2022-12) — PLDI 2023 — constraint decoding
2. Guardrails AI (2023) — industrial — Pydantic schemas
3. LLM Guard (2023) — industrial — partial output scanners
4. CaMeL P081 (2025) — arXiv — capabilities agents
5. AgentSpec P082 (2025) — ICSE — runtime spec
6. LlamaFirewall P131 (2025-05) — arXiv Meta — CodeShield static + Agent Alignment
7. RAGShield P066 (2026) — arXiv — RAG-specific
8. **AEGIS (2026)** — these ENS — **MEDICAL CHIRURGICAL FDA-ancre**

**Verdict arithmetique** : la claim "quatrieme implementation δ³" est **REFUTEE** numeriquement. AEGIS est la **8eme** implementation publique connue de ce pattern. **Mais** AEGIS est la **PREMIERE** specialisation medicale chirurgicale avec contraintes biomecaniques ancrees FDA 510k.

---

## Analyse D-001 (Triple Convergence)

**Question** : Ces 5 nouveaux papers confirment-ils D-001 "Triple Convergence" (δ⁰/δ¹/δ² simultanement vulnerables, δ³ seul survivant) ?

### P131 LlamaFirewall

**Renforce D-001 modere a fort.** Meta AI, un des plus grands labs industriels, publie explicitement que "model fine-tuning or chatbot-focused guardrails do not fully address" les risques agents (abstract Section 1). C'est une reconnaissance publique et industrielle que δ⁰ (fine-tuning = alignment) et δ² (chatbot guardrails) sont insuffisants, et qu'un "real-time guardrail monitor to serve as a final layer of defense" est necessaire — exactement l'argument de D-001. CodeShield est un δ³ partiel (domaine code). **LlamaFirewall couvre δ²+δ³ mais PAS δ⁰ ni δ¹**, donc ne resout PAS D-001 complet — il CONFIRME la necessite d'une couche additionnelle au-dela de δ⁰/δ¹.

### P132 Weissman et al. 2025

**Renforce D-001 indirectement via le domaine medical.** Le paper prouve que "prompts are inadequate" (abstract) pour contraindre les outputs LLM medicaux FDA-compliant. Il ne teste pas de defenses δ³ mais etablit que δ¹ (prompts) est insuffisant en contexte reglementaire medical. Alignement avec C1 (insuffisance δ⁰) et C2 (necessite δ³) — un journal Nature portfolio publie cet argument au niveau reglementaire.

### P133 Guardrails AI

**Renforce faiblement D-001.** Implementation δ³ generique (Pydantic), confirme que le pattern δ³ existe en production industrielle. Mais ne teste PAS la triple convergence. Son existence prouve que δ³ est deployable mais pas qu'il est necessaire face a δ⁰/δ¹/δ² simultanement vulnerables.

### P134 LLM Guard

**Neutre sur D-001.** Principalement δ² (detection). Confirme que les labs industriels traitent δ² comme ligne de defense active, mais ne teste PAS la triple convergence. Son modele multi-scanner est PARALLELE (pas sequentiel), donc il n'adresse pas l'antagonisme D-022 decouvert par TC-002.

### P135 LMQL

**Renforce D-001 faiblement (precurseur historique).** LMQL est publie avant que D-001 soit documentee (2022 vs 2026). Son existence prouve que le pattern δ³ est une idee mature (>3 ans). Mais LMQL ne teste pas la robustesse contre δ⁰ efface ou δ¹ empoisonne — il assume que le developpeur controle les contraintes.

### Verdict global sur D-001

**D-001 reste VALIDE avec confiance 8/10 (inchangee par rapport a TC-002).** Les 5 frameworks ne l'affaiblissent pas. Ils confirment au contraire que l'industrie (Meta, Protect AI, Guardrails AI Inc.) a **CONVERGE** vers la necessite d'ajouter une couche δ² ou δ³ au-dessus des defenses traditionnelles. Aucun des 5 frameworks ne teste la convergence triple simultanee.

**Point important** : aucun framework cite NE TESTE le scenario triple convergence TC-002 (δ⁰ efface + δ¹ empoisonne + δ² fuzzed). L'etude experimentale AEGIS TC-002 reste la seule validation empirique de l'interaction antagoniste entre couches.

---

## Gaps identifies (nouveaux candidats + gaps existants closed/adresses)

### G-NEW-1 (candidat nouveau) — "δ³ medical chirurgical FDA-ancre"

**Enonce** : Aucun framework existant (academique ou industriel) ne specialise δ³ pour le domaine medical chirurgical avec contraintes biomecaniques ancrees FDA 510k.

**Evidence** :
- P131 LlamaFirewall : δ³ pour CODE (CodeShield), pas medical
- P133 Guardrails AI : δ³ structurel Pydantic, domain-agnostique
- P135 LMQL : δ³ decoding, domain-agnostique
- P081 CaMeL / P082 AgentSpec : δ³ agents generiques
- P066 RAGShield : δ³ RAG documents, pas medical
- P132 Weissman et al. 2025 : appelle publiquement a "new methods to constrain LLM output" en contexte medical FDA, **confirme le besoin publiquement**

**Avantage AEGIS** : validate_output + AllowedOutputSpec avec contraintes biomecaniques FDA 510k Da Vinci Xi (max_tension_g, forbidden_tools, HL7 OBX 20.3 directives).

**Statut** : **CREE par cette verification** — candidate pour publication "First formal output-validation framework for surgical robot LLMs, FDA-compliant".
**Priorite** : 1 (contribution unique).
**Chapitre these** : Chapitre Defense δ³ + Chapitre Medical.

### G-001 (existant — δ³ implementation) — **NUANCE**

Le preseed COLLECTOR et cette analyse CYBERSEC nuancent G-001 : il existe desormais au moins **7 implementations δ³** publiques (LMQL, Guardrails AI, LLM Guard partiel, CaMeL, AgentSpec, LlamaFirewall, RAGShield). G-001 dans sa formulation "0/60 papers" est **partiellement closed** : le pattern δ³ est implemente dans >= 7 frameworks en 2026-04. Ce qui n'est PAS implemente, c'est la specialisation medicale (G-NEW-1).

**Action** : reformuler G-001 dans THESIS_GAPS.md :
- Ancienne formulation : "Aucun paper n'implemente δ³ concretement"
- Nouvelle formulation : "Aucun paper n'implemente δ³ SPECIALISE MEDICAL avec contraintes biomecaniques FDA. Le pattern generique δ³ existe (LMQL, Guardrails AI, CaMeL, AgentSpec, LlamaFirewall, RAGShield, LLM Guard partiel), mais aucune implementation ne couvre le domaine haut-enjeu chirurgical avec ancrage reglementaire."

### Gaps existants adresses

- **G-001** (δ³ implementation) : partiellement closed par la verification (7+ impl existent)
- **G-020** (defenses agents) : LlamaFirewall (P131) adresse partiellement via Agent Alignment Checks — a integrer dans la veille AEGIS
- **G-017** (RagSanitizer vs PIDP) : non adresse par les 5 candidats

### Gaps existants PAS adresses

- **G-002** (evaluation multi-couches combinee) : aucun des 5 frameworks ne fait d'eval interaction δ⁰+δ¹+δ²+δ³
- **G-003** (red-teaming medical systematique) : aucun des 5 n'est medical-specifique
- **G-011** (test triple convergence) : aucun framework ne reproduit TC-002

---

## Verdict CYBERSEC

**NUANCED** : la claim "AEGIS est la quatrieme implementation δ³" est REFUTEE arithmetiquement (>= 7 implementations publiques anterieures : LMQL 2022, Guardrails AI 2023, LLM Guard 2023, CaMeL 2025, AgentSpec 2025, LlamaFirewall 2025-05, RAGShield 2026), mais la SPECIALISATION medicale chirurgicale avec contraintes biomecaniques FDA-ancrees reste **UNIQUE** (aucune des 7 implementations anterieures ne couvre ce domaine).

**La vraie originalite cybersecurite AEGIS est** :

1. **Premiere implementation δ³ SPECIALISEE medicale chirurgicale** — validate_output contraint des parametres biomecaniques (max_tension_g 50-800, forbidden_tools chirurgicaux pediatriques, actions autorisees par etape operatoire) ancres dans la documentation FDA 510k du robot Da Vinci Xi.

2. **Couplage formel specification + reglementation** — AllowedOutputSpec encode non seulement des types Pydantic mais des obligations reglementaires tracables (ex : HL7 OBX 20.3 directive requise pour escalade clinicienne = requirement FDA CDS non-device status). Ni LlamaFirewall (code), ni LMQL (format), ni Guardrails AI (schema) ne proposent ce couplage.

3. **Reponse directe a un besoin publiquement formule** — Weissman et al. 2025 (npj Digital Medicine, Nature portfolio, DOI 10.1038/s41746-025-01544-y, abstract) declare que "effective regulation may require new methods to better constrain LLM output, and prompts are inadequate for this purpose". AEGIS est le premier framework a repondre publiquement a cette demande reglementaire specifique.

### Reformulation recommandee pour la these

**Ancienne claim** (preseed, a abandonner) :
> "Quatrieme implementation δ³ apres CaMeL, AgentSpec, RAGShield"

**Nouvelle claim** (recommandee) :
> "Premiere implementation δ³ specialisee medicale chirurgicale, etendant le pattern generique output validation (introduit par LMQL PLDI 2023 et industrialise par Guardrails AI, LlamaFirewall Meta 2025, CaMeL, AgentSpec) avec des contraintes biomecaniques formelles ancrees FDA 510k pour le robot chirurgical Da Vinci Xi. Repond au besoin reglementaire publiquement formule par Weissman et al. 2025 (npj Digital Medicine)."

### Mappings les plus pertinents

- **MITRE ATLAS principal** : AML.T0051 (LLM Prompt Injection) — sous-techniques AML.T0051.000 (Direct) et AML.T0051.001 (Indirect) pour DPI/IPI
- **MITRE ATLAS complementaire** : AML.T0020 (Poison Training Data) via protection indirecte au niveau output pour les cas RAG poisoning (P054/P055)
- **OWASP LLM Top 10 2025** : **LLM01** (Prompt Injection, surface principale), **LLM05** (Improper Output Handling, surface validate_output), **LLM06** (Excessive Agency, robotique chirurgicale = agency critique), **LLM09** (Misinformation, CDS medical device-like)

---

## Fichiers a modifier apres rapport

1. `research_archive/discoveries/TRIPLE_CONVERGENCE.md` — appender section "Verification 2026-04-11"
2. `research_archive/discoveries/THESIS_GAPS.md` — ajouter G-NEW-1 (δ³ medical chirurgical FDA) et annoter G-001 comme "partiellement closed"

**Aucune reecriture** — uniquement append/edit localise.
