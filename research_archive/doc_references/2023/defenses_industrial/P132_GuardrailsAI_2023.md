## [Guardrails AI Inc., 2023-2026] — Guardrails AI: Python Framework for Reliable AI Applications

**Reference :** github.com/guardrails-ai/guardrails (~6700 stars, Apache 2.0)
**Revue/Conf :** Aucune publication academique dediee — framework industriel open-source (blog posts, docs, talks conferences)
**Lu le :** 2026-04-11 (scoped verification RUN VERIFICATION_DELTA3_20260411)
> **PDF Source**: N/A — framework GitHub (docs reference : https://github.com/guardrails-ai/guardrails, README + docs officielles)
> **Statut**: [INDUSTRIEL] — framework open-source Python, production-ready
> **Institution**: Guardrails AI Inc. (creation 2023)

### Description (abstract industriel)
> "Guardrails is a Python framework that helps build reliable AI applications by performing input/output validation and generating structured LLM data. Uses Pydantic integration for schema definition with composable validators (pre-built or custom) and OnFailAction enums to define failure responses."
> — Source : Guardrails AI README, 2026

### Resume (5 lignes)
- **Probleme :** Construire des applications LLM fiables necessite validation systematique input/output et generation de donnees structurees
- **Methode :** Framework Python generique avec schemas Pydantic + validators composables + OnFailAction enums (`reask`, `filter`, `fix`, `exception`). Pattern canonique : `Guard.for_pydantic(output_class=MyClass)` (Guardrails AI docs, 2023-2026)
- **Donnees :** N/A — framework, pas etude empirique
- **Resultat :** Pattern technique adopte a grande echelle (~6700 stars GitHub, integration LangChain/LlamaIndex) — **precurseur industriel majeur du pattern δ³ depuis 2023**
- **Limite :** Schemas Pydantic = contraintes structurelles (types, bornes numeriques simples), PAS semantiques metier multi-variables

### Analyse critique
**Forces :**
- Pattern canonique validate_output contre specification declarative — meme philosophie que AEGIS δ³
- Extensible via validators customs — analogue aux methodes `validate_*` d'AEGIS AllowedOutputSpec
- Production-ready, license Apache 2.0, integration ecosystem LLM majeur (LangChain, LlamaIndex)
- Tracing et OnFailAction enums offrent un controle fin des remediations

**Faiblesses :**
- **Schemas Pydantic = contraintes structurelles, PAS semantiques metier multi-variables** : AEGIS AllowedOutputSpec encode des contraintes relationnelles FDA-ancrees (tension_g ∈ [50, 800] ET forbidden_tools ∩ selected_tools = ∅ ET HL7_OBX directives coherentes avec ontologie SNOMED-CT)
- Pas de specialisation medicale — framework generique sans notion de contraintes biomecaniques, FDA 510(k), ou protocoles chirurgicaux
- **Pas de notion de contexte Allowed(i)** : Guardrails AI valide l'output en isolation, PAS contre un contexte operationnel (phase chirurgicale actuelle, etat du patient)
- Validation structurelle, pas causale — ne modelise pas la causalite entre contexte chirurgical et outputs autorises
- Pas de paper academique peer-reviewed dedie — adoption industrielle uniquement

**Questions ouvertes :** couverture de benchmarks academiques, comparaison quantitative avec LMQL/CaMeL/AgentSpec.

### Formules exactes
Pattern technique canonique (Guardrails AI docs, 2023-2026) :
```python
from guardrails import Guard
from pydantic import BaseModel, Field

class Pet(BaseModel):
    name: str = Field(description="Pet name")
    age: int = Field(description="Age in years", ge=0, le=30)

guard = Guard.for_pydantic(output_class=Pet)
result = guard(llm_api=..., prompt=..., on_fail=OnFailAction.REASK)
```

### Pertinence these AEGIS
- **Couches delta :** **δ³ partiel (generique structurel, PAS semantique metier)** — precurseur industriel majeur du pattern depuis 2023, antedate les 3 implementations citees (P081 CaMeL 2025, P082 AgentSpec 2025, P066 RAGShield 2026)
- **Conjectures :** **C2 (necessite δ³)** renforce — validation publique par ~6700 stars GitHub du besoin industriel ; positionne AEGIS comme specialiseur medical, PAS inventeur du pattern
- **Decouvertes :** impact D-014 (necessite de defense externe a l'alignement) — supporte par adoption industrielle large
- **Gaps :** **G-001 (implementation δ³)** DOIT etre reformule — le pattern δ³ generique existe depuis 2023 (Guardrails AI) et 2022 (LMQL). Le gap residuel est la specialisation medicale chirurgicale
- **Integration VERIFICATION_DELTA3_20260411 :** reference comparative critique pour ligne "Le pattern δ³ est industriellement adopte depuis 2023 via Guardrails AI. La contribution originale d'AEGIS n'est pas l'invention du pattern mais sa specialisation medicale."

### Analyse Keshav
Voir fichier analyst source: `research_archive/_staging/analyst/P133_analysis.md` (renumerote P133 -> P132 a l'integration LIBRARIAN 2026-04-11).

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 — reference comparative critique (precurseur industriel) |
| Reproductibilite | Haute — code open-source Apache 2.0, docs completes |
| Code disponible | Oui — https://github.com/guardrails-ai/guardrails |
| Dataset public | N/A (framework, pas dataset) |
| Domaine | Generic (LLM output validation) |
| Nature | [INDUSTRIEL] — pas de paper peer-reviewed |
| Pattern match δ³ | OUI (pattern generique, pas specialise) |
