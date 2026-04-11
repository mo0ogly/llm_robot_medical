# P133 — Guardrails AI: Python Framework for Reliable AI Applications

**Tag** : [INDUSTRIEL] — framework open-source (pas de paper academique dedie)
**URL** : https://github.com/guardrails-ai/guardrails
**Stars GitHub** : ~6700 (tres populaire, ecosystem mature)
**License** : Apache 2.0
**Creation** : 2023 (Guardrails AI Inc.)
**Lu le** : 2026-04-11 (scoped verification RUN VERIFICATION_DELTA3_20260411)

## Description (~100 mots)

Guardrails AI est un framework Python open-source concu pour construire des applications LLM fiables via validation input/output et generation de donnees structurees. Il s'appuie sur l'integration **Pydantic** pour la definition de schemas et utilise des **validators composables** (pre-builts dans un hub communautaire ou customs) et des enums `OnFailAction` pour specifier le comportement en cas d'echec (ex: `reask`, `filter`, `fix`, `exception`) (Guardrails AI docs, 2023-2026). Le pattern central est : definir une classe Pydantic representant la sortie attendue, puis invoquer `Guard.for_pydantic(output_class=MyClass)` pour obtenir un gardien qui intercepte et valide les outputs LLM (Guardrails AI README, 2026).

## Pattern implementation (~100 mots)

Pattern technique :
```python
from guardrails import Guard
from pydantic import BaseModel, Field

class Pet(BaseModel):
    name: str = Field(description="Pet name")
    age: int = Field(description="Age in years", ge=0, le=30)

guard = Guard.for_pydantic(output_class=Pet)
result = guard(llm_api=..., prompt=..., on_fail=OnFailAction.REASK)
```
Le framework combine :
1. **Schemas declaratifs** via Pydantic (type + field-level constraints)
2. **Validators** composables (string length, regex, toxicity detection, etc.) attachables a chaque champ
3. **Actions de remediation** : reask le LLM, filter les outputs invalides, fix automatique, exception
4. **Tracing** et integration avec frameworks LLM populaires (LangChain, LlamaIndex)

## Comparaison avec AEGIS δ³ (~150 mots)

**Points communs** :
- Pattern general validate_output contre une specification declarative — **meme philosophie que AEGIS δ³**
- Extensible via validators customs — analogue aux methodes `validate_*` d'AEGIS AllowedOutputSpec
- Open-source, production-ready

**Divergences critiques** :
- **Schemas Pydantic = contraintes structurelles** (types, shapes, bornes numeriques simples). AEGIS AllowedOutputSpec encode des **contraintes semantiques metier multi-variables** : tension_g ∈ [50, 800] ET forbidden_tools ∩ selected_tools = ∅ ET HL7_OBX directives coherentes avec l'ontologie SNOMED-CT
- **Pas de specialisation medicale** : Guardrails AI est generique, sans notion de contraintes biomecaniques, FDA 510(k), ou protocoles chirurgicaux
- **Pas de notion de contexte Allowed(i)** : Guardrails AI valide l'output en isolation, PAS contre un contexte operationnel (phase chirurgicale actuelle, etat du patient, tools deja deployes)
- **Validation structurelle, pas causale** : Guardrails ne modelise pas la causalite entre contexte chirurgical et outputs autorises

**Verdict positionnement** : Guardrails AI est un **precurseur industriel majeur** du pattern δ³ generique. AEGIS se positionne comme **specialisation domain-specific** qui etend le pattern avec contraintes biomecaniques formelles FDA-ancrees.

## Classification

| Champ | Valeur |
|-------|--------|
| Type | Framework industriel open-source |
| Stars GitHub | ~6700 |
| License | Apache 2.0 |
| Venue | Aucune publication academique dediee (blog posts + docs) |
| Domaine | Generic (LLM output validation) |
| Pertinence AEGIS | **Reference comparative critique** — positionne AEGIS comme specialiseur medical |
| Nature | [INDUSTRIEL] — pas de paper peer-reviewed |
| Pattern match δ³ | **OUI (pattern generique, pas specialise)** |
