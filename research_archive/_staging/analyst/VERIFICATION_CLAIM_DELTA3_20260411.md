# VERIFICATION CLAIM DELTA3 — 2026-04-11

## Claim examinee

> **Claim originale (wiki/docs/delta-layers/delta-3.md §1, candidate)** :
> "Sur 127 papiers du corpus AEGIS, seuls 14 adressent δ³ — et seulement 3 fournissent une implementation concrete : CaMeL (P081), AgentSpec (P082), RAGShield (P066). La these AEGIS propose une QUATRIEME implementation via validate_output + AllowedOutputSpec."

## Pipeline

- **RUN** : VERIFICATION_DELTA3_20260411
- **Mode** : scoped (verification ferme d'une claim unique)
- **COLLECTOR preseed** : 5 candidats collectes (P131-P135)
- **Pre-check dedup** (backend/tools/check_corpus_dedup.py) :
  - arXiv:2505.03574 (LlamaFirewall) → **NEW** → integrer comme P131
  - arXiv:2503.18813 (CaMeL) → **FALSE_NEW** (deja P081 dans MANIFEST, suffixe v3 non parse) → reference_only
  - arXiv:2503.18666 (AgentSpec) → **FALSE_NEW** (deja P082 dans MANIFEST, venue ICSE non-arxiv) → reference_only
  - arXiv:2604.00387 (RAGShield) → **DUPLICATE as P066** → reference_only
  - Weissman et al. 2025 (npj DM, title-based dedup) → **NEW** → integrer comme P132
  - Guardrails AI → **NEW** → integrer comme P133 (industriel)
  - LLM Guard → **NEW** → integrer comme P134 (industriel)
  - LMQL → **NEW** → integrer comme P135
- **Analyses produites** : 5 fichiers _staging/analyst/PXXX_analysis.md (Keshav 3-pass ou format reduit pour industriels)

## Analyse paper par paper

### P131 LlamaFirewall — Meta 2025

**Reference complete** : Chennabasappa S., Nikolaidis C., Song D., Molnar D., Ding S., Wan S., Whitman S., Deason L., Doucette N., Montilla A., Gampa A., de Paola B., Gabi D., Crnkovich J., Testud J.-C., He K., Chaturvedi R., Zhou W., Saxe J. (2025). "LlamaFirewall: An open source guardrail system for building secure AI agents." arXiv:2505.03574 (Meta AI Security Team, 19 co-auteurs, soumis 2025-05-06).

**Keshav Passage 1 (Survol)** : LlamaFirewall est un framework guardrail multi-layered propose par Meta comme "final layer of defense" pour agents LLM en production (Chennabasappa et al., 2025, Abstract). Trois composants : PromptGuard 2 (detection jailbreak), Agent Alignment Checks (auditeur CoT, experimental), CodeShield (analyse statique code).

**Keshav Passage 2 (Structure)** : le probleme cible est l'agent LLM autonome executant des actions a enjeux eleves sur inputs non-fiables (webpages, emails) (Chennabasappa et al., 2025, Abstract). L'hypothese centrale est qu'une couche finale deterministe est necessaire car les solutions probabilistes (fine-tuning, guardrails chatbot) sont insuffisantes. La methode combine 3 modules avec politiques de securite specifiques a l'usage. Resultats revendiques qualitativement ("clear state of the art", "stronger efficacy"), pas de chiffres dans l'abstract seul. Limite avouee : Agent Alignment Checks est explicitement "still experimental".

**Keshav Passage 3 (Profondeur critique)** : **forces** : premier framework industriel multi-layered open-source Meta, poids academique + industriel, code verifiable (github.com/meta-llama/PurpleLlama/LlamaFirewall), CodeShield implemente fonctionnellement un pattern δ³ code-specifique. **Faiblesses** : aucune specialisation medicale, CodeShield est analyse statique code-specific (pas specification semantique metier), Agent Alignment Checks "experimental" sans garantie de soundness, pas de chiffres dans l'abstract (Chennabasappa et al., 2025, Abstract).

**Mapping δ AEGIS** :
- δ⁰ : non adresse (presuppose)
- δ¹ : partiellement (PromptGuard 2 + Agent Alignment Checks sur contexte input)
- δ² : partiellement (Agent Alignment Checks = signal CoT runtime)
- **δ³ : OUI partiellement** — CodeShield = implementation δ³ code-specifique ; politiques "use case specific" = slot d'extension formelle mais pas semantique metier pre-existante

**Contribution vs AEGIS** : LlamaFirewall **renverse partiellement la claim** — Meta est un co-signataire industriel majeur du besoin δ³, avec une implementation code-domain publique anterieure (mai 2025) a la soumission de la these AEGIS. AEGIS doit se positionner comme specialisation medicale chirurgicale, PAS comme "4eme implementation". (Chennabasappa et al., 2025, arXiv:2505.03574, Abstract)

---

### P132 npj Digital Medicine Weissman 2025

**Reference complete** : Weissman G. E., Mankowitz T., Kanter G. P. (2025). "Unregulated large language models produce medical device-like output." npj Digital Medicine 8. DOI:10.1038/s41746-025-01544-y. PubMed PMID: 40055537. University of Pennsylvania Perelman School of Medicine. Publie 2025-03-07.

**Keshav Passage 1 (Survol)** : premier peer-reviewed Nature portfolio (Q1) qui documente publiquement que les LLMs non-regules produisent des outputs "device-like" de type Clinical Decision Support, et que les prompts/disclaimers sont insuffisants pour les en empecher (Weissman et al., 2025, npj DM, Abstract).

**Keshav Passage 2 (Structure)** : les auteurs evaluent 2 LLMs populaires (non-nommes dans l'abstract) sur une gamme de scenarios cliniques avec differentes strategies de mitigation. Ils constatent que "LLM output readily produced device-like decision support across a range of scenarios" (Weissman et al., 2025, Abstract). Conclusion publique : "effective regulation may require new methods to better constrain LLM output, and prompts are inadequate for this purpose" (Weissman et al., 2025, Abstract).

**Keshav Passage 3 (Profondeur critique)** : **force majeure** = autorite Nature portfolio Q1 et cadrage reglementaire FDA explicite, rare dans la litterature prompt-injection. **Faiblesse** = le paper constate le probleme mais ne propose pas de solution technique — c'est une etude de **motivation**, pas d'**implementation**. N exact de scenarios et nom des 2 LLMs a verifier en texte complet. (Weissman et al., 2025, npj DM, Abstract, p.1)

**Mapping δ AEGIS** : P132 est une **motivation publique peer-reviewed** pour δ³ medical — pas une implementation. Renforce C2 et C6 sans rien resoudre directement.

**Contribution vs AEGIS** : P132 est la **citation clef** pour justifier que δ³ medical repond a un besoin reglementaire reel documente dans une revue Nature (pas un besoin imagine). Utilisable comme citation d'autorite dans l'introduction AEGIS : "As Weissman et al. (2025, npj Digital Medicine) explicitly concluded, 'effective regulation may require new methods to better constrain LLM output, and prompts are inadequate for this purpose.'"

---

### P133 Guardrails AI (industriel 2023)

**Reference complete** : Guardrails AI Inc. (2023). Guardrails AI — Python framework for reliable AI applications. github.com/guardrails-ai/guardrails (~6700 stars, Apache 2.0).

**Description** : framework open-source Python pour validation input/output LLM via schemas Pydantic + validators composables + OnFailAction enums (Guardrails AI docs, 2023-2026). Pattern canonique : `Guard.for_pydantic(output_class=MyClass)`.

**Comparaison AEGIS** : **point commun** = meme philosophie `validate_output` contre specification declarative. **Divergence critique** = Pydantic schemas sont **structurels** (types, bornes numeriques simples), AEGIS AllowedOutputSpec est **semantique metier multi-variables** avec contraintes relationnelles FDA-ancrees (tension ∈ [50,800]g ∧ tools ⊂ phase_allowed ∧ HL7 coherents). Pas de specialisation medicale, pas de notion Allowed(i) contextuelle.

**Mapping δ AEGIS** : δ³ generique structurel, PAS semantique metier. **Precurseur industriel majeur du pattern depuis 2023** — antedate largement les 3 implementations citees (P081 CaMeL, P082 AgentSpec, P066 RAGShield).

---

### P134 LLM Guard (industriel 2023, Protect AI)

**Reference complete** : Protect AI (2023). LLM Guard — Comprehensive security scanner for LLMs. github.com/protectai/llm-guard (~2800 stars, MIT).

**Description** : toolkit avec 15 input scanners + 21 output scanners (36 au total), architecture multi-scanner parallele pour detection de toxicite, PII, secrets, prompt injection, etc.

**Comparaison AEGIS** : **detection-based PAS specification-based**. Les scanners identifient des patterns via ML/regex, ils ne verifient pas une specification metier formelle. Pas de notion Allowed(i), pas de specialisation medicale, architecture paralleles independants sans coherence semantique metier. **Mapping δ** : δ¹ + δ² principalement, PAS δ³ au sens strict.

**Contribution vs AEGIS** : reference ecosystem qui delimite la frontiere **detection vs verification** — renforce la specificite d'AEGIS δ³ comme specification-driven.

---

### P135 LMQL (Beurer-Kellner et al., PLDI 2023)

**Reference complete** : Beurer-Kellner L., Fischer M., Vechev M. (2022). "Prompting Is Programming: A Query Language for Large Language Models." arXiv:2212.06094. PLDI 2023 (ACM SIGPLAN Conf. Programming Language Design and Implementation, CORE A*). ETH Zurich.

**Keshav Passage 1 (Survol)** : LMQL introduit le paradigme **Language Model Programming (LMP)** — premier DSL academique peer-reviewed qui formalise le fait que contraindre un output LLM est un probleme de programming languages. Publie 2022-12-12 sur arXiv, venue PLDI 2023 (Beurer-Kellner et al., 2022, arXiv:2212.06094, Abstract).

**Keshav Passage 2 (Structure)** : les auteurs argumentent que le prompting pur est insuffisant pour les cas d'usage avances. Leur methode combine texte + scripting avec variables typees inline (`[NUM: int]`) et clauses `where` pour contraintes outputs (`where len(ANSWER) < 120 and STOPS_AT(ANSWER, ".")`, Beurer-Kellner et al., 2022, Section 3). Le runtime applique les contraintes au **decoding contraint** (token-level), pas au post-filtering. Resultats : LMQL permet d'exprimer methodes de prompting avancees dans un formalisme unifie avec garanties de format/type.

**Keshav Passage 3 (Profondeur critique)** : **force majeure** = venue PLDI 2023 (CORE A*, peer-review programming languages tres rigoureux), **precurseur historique de plus de 2 ans** du pattern δ³ que la claim AEGIS revendique. **Filiation ETH Zurich** : meme premier auteur que P126 (Tramer et al., 2025, "Design Patterns for Securing LLM Agents against Prompt Injections") — continuite de recherche sur la separation formelle. **Faiblesse** : contraintes syntaxiques (format, type), pas semantiques metier. Pas de specialisation domaine.

**Mapping δ AEGIS** : **δ³ partiel precurseur**. LMQL est une implementation δ³ academique peer-reviewed PLDI 2023 qui PRECEDE **toutes** les 3 implementations citees dans la claim AEGIS (CaMeL 2025, AgentSpec 2025, RAGShield 2026). Conclusion epistemologique critique : le pattern δ³ est publiquement etabli depuis decembre 2022.

**Contribution vs AEGIS** : **LMQL invalide formellement la portion "4eme implementation" de la claim**. Avec LMQL (2022), Guardrails AI (2023), LLM Guard (2023), CaMeL (2025), AgentSpec (2025), LlamaFirewall CodeShield (2025), Pydantic-based frameworks (depuis 2023), RAGShield (2026), AEGIS est au minimum la **8eme ou 9eme implementation** d'un pattern generique validate_output+specification. La **contribution originale** est la specialisation medicale chirurgicale avec contraintes biomecaniques formelles FDA-ancrees.

---

## Synthese comparative

Tableau comparatif AEGIS vs les 8 frameworks identifies (3 de la claim originale + 5 nouveaux P131-P135) :

| Critere | AEGIS | P131 LlamaFirewall (Meta, 2025) | P135 LMQL (ETH, 2022) | P081 CaMeL (2025) | P082 AgentSpec (2025) | P066 RAGShield (2026) | P133 GuardrailsAI (2023) | P134 LLMGuard (2023) |
|---------|-------|--------------------------------|----------------------|-------------------|----------------------|----------------------|--------------------------|----------------------|
| Pattern validate_output + spec | OUI (dataclass AllowedOutputSpec) | Partiel (CodeShield code-only) | OUI (DSL where clauses) | OUI (taint tracking) | OUI (DSL runtime) | OUI (provenance) | OUI (Pydantic schemas) | NON (detection-based) |
| Specialisation medicale chirurgicale | **OUI (Da Vinci Xi)** | NON | NON | NON | NON | NON | NON | NON |
| Contraintes biomecaniques FDA-ancrees | **OUI (tension 50-800g, forbidden_tools)** | NON | NON | NON | NON | NON | NON | NON |
| Directives HL7 OBX coherentes ontologie | **OUI** | NON | NON | NON | NON | NON | NON | NON |
| Formalisme Allowed(i) contextuel | **OUI (dataclass + phase)** | Policies per use-case | Constraints inline | Capability tokens | DSL spec | Taint labels | Field validators | Scanner agregation |
| Open-source code | OUI | OUI (Meta) | OUI (eth-sri) | Partiel | OUI | NON | OUI | OUI |
| Venue academique | These ENS 2026 | arXiv preprint 2025 | **PLDI 2023 (CORE A*)** | 2025 paper | ICSE 2025 | 2026 paper | Blog/docs | Blog/docs |
| Mesurable empiriquement (Sep(M)) | OUI (N>=30) | Partiel (pas dans abstract) | N/A (pas ASR dediee) | OUI (~77%) | OUI (>90% utilities) | Partiel | NON | NON |
| Date premiere publication | 2026 | 2025-05 | **2022-12** | 2025 | 2025 | 2026 | 2023 | 2023 |

**Observation clef** : en ordonnant par date de premiere publication, on obtient **LMQL (2022-12) → Guardrails AI (2023) → LLM Guard (2023) → CaMeL (2025) → AgentSpec (2025) → LlamaFirewall (2025-05) → RAGShield (2026) → AEGIS (2026)**. AEGIS n'est pas la 4eme implementation : c'est au minimum la 8eme en comptant seulement les frameworks examines dans cette verification scoped.

**Contribution originale reelle AEGIS** (inchangee par cette verification) : **premier framework δ³ specialise medical chirurgical** avec contraintes biomecaniques formelles FDA-ancrees pour le robot Da Vinci Xi. Cette specialisation n'existe dans aucun des 8 frameworks compares.

## VERDICT

**Statut** : **NUANCED** (ni SUPPORTED, ni REFUTED au sens binaire — la claim est factuellement incorrecte sur le **compte** ("4eme implementation") mais correcte sur la **nouveaute substantielle** (specialisation medicale))

**Justification** :

1. **La portion "seuls 14 adressent δ³" est plausible mais non re-auditee dans cette verification scoped**. Elle n'est ni confirmee ni infirmee par les 5 papers P131-P135. Cette portion reste a verifier via un comptage exhaustif du corpus 127 papiers — hors-scope de cette verification.

2. **La portion "seulement 3 fournissent une implementation concrete" est factuellement incorrecte**. Au moins 5 autres implementations δ³ existent et sont peer-reviewed ou production-grade :
   - LMQL (Beurer-Kellner et al., 2022, PLDI 2023, arXiv:2212.06094) — precurseur academique CORE A*, 2 ans avant CaMeL
   - Guardrails AI (2023, industriel, ~6700 stars GitHub, Apache 2.0)
   - LLM Guard (2023, industriel, ~2800 stars, MIT) — partiellement δ³ pour le output scanning
   - LlamaFirewall CodeShield (Chennabasappa et al., 2025, arXiv:2505.03574, Meta AI) — analyse statique code-domain, implementation δ³ code-specifique publique

3. **La portion "AEGIS propose une QUATRIEME implementation" est factuellement incorrecte**. En incluant les precurseurs omis, AEGIS est au minimum la **8eme ou 9eme implementation** d'un pattern generique validate_output+specification. Le **nombre ordinal n'est plus defendable** dans la these ENS.

4. **La portion "via validate_output + AllowedOutputSpec" est vraie structurellement**. Le pattern technique est correct. Mais la **nouveaute substantielle** est la **specialisation medicale chirurgicale avec contraintes biomecaniques formelles FDA-ancrees Da Vinci Xi**, pas la simple existence du pattern validate_output.

5. **La contribution originale reelle est confirmee** : aucun des 8 frameworks identifies ne propose de contraintes biomecaniques (tension max 50-800g), de forbidden_tools chirurgicaux, de directives HL7 OBX coherentes avec ontologie SNOMED-CT, ni de modelisation formelle du robot Da Vinci Xi. Sur ce terrain, AEGIS est **premier de son espece**.

**Reformulation proposee** (5-10 lignes exactes a substituer dans wiki/docs/delta-layers/delta-3.md §1) :

> **La validation formelle de sortie (δ³) est un pattern academiquement etabli depuis LMQL (Beurer-Kellner et al., 2022, PLDI 2023) et industriellement adopte via Guardrails AI (2023), LLM Guard (2023), LlamaFirewall CodeShield (Chennabasappa et al., 2025, Meta AI), CaMeL (P081), AgentSpec (P082), et RAGShield (P066). La contribution originale d'AEGIS n'est pas l'invention du pattern validate_output mais sa specialisation au domaine medical chirurgical : AEGIS est le premier framework δ³ encodant des contraintes biomecaniques formelles FDA-ancrees pour le robot Da Vinci Xi (tension 50-800 g, forbidden_tools par phase chirurgicale, directives HL7 OBX coherentes avec l'ontologie SNOMED-CT). Le besoin reglementaire de ces methodes au-dela des prompts est documente dans Weissman, Mankowitz, Kanter (2025, npj Digital Medicine, DOI:10.1038/s41746-025-01544-y) : 'effective regulation may require new methods to better constrain LLM output, and prompts are inadequate for this purpose'.**

## References inline utilisees

- (Chennabasappa S., Nikolaidis C., Song D., et al., 2025, arXiv:2505.03574, Abstract, p.1) — LlamaFirewall Meta AI
- (Weissman G. E., Mankowitz T., Kanter G. P., 2025, npj Digital Medicine 8, DOI:10.1038/s41746-025-01544-y, Abstract, p.1, PMID:40055537) — Unregulated LLMs produce device-like CDS output
- (Beurer-Kellner L., Fischer M., Vechev M., 2022, arXiv:2212.06094, Abstract, Section 3) — LMQL DSL PLDI 2023
- (Guardrails AI Inc., 2023-2026, github.com/guardrails-ai/guardrails, docs et README) — framework industriel
- (Protect AI, 2023-2026, github.com/protectai/llm-guard, docs et README) — LLM Guard
- Precurseurs mentionnes dans la claim et non re-audites ici : CaMeL (P081, arXiv:2503.18813), AgentSpec (P082, ICSE 2025, arXiv:2503.18666), RAGShield (P066, arXiv:2604.00387)
- Continuite ETH Zurich : LMQL (Beurer-Kellner et al., 2022, P135) → Tramer et al. (2025, P126) "Design Patterns for Securing LLM Agents against Prompt Injections"

## Stats verification

- **Papers analyses** : 5 (P131-P135)
- **Refs inline produites** : 11 distinctes
- **Mots produits (5 analyses + verdict)** : ~5800 mots
- **Formules extraites** : 2 (LMQL where clause, typed variable syntax) — F73 candidate pour glossaire
- **Impact conjecture C2** : stable 10/10 (pattern δ³ renforce, pas affaibli)
- **Impact gap G-001** : **DOIT etre reformule** — "AEGIS est la seule implementation δ³ medicale specialisee chirurgicale", pas "AEGIS est la 4eme implementation δ³"
