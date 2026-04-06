# Taxonomie des attaques et defenses

AEGIS utilise deux taxonomies complementaires : une taxonomie offensive (CrowdStrike, 95 techniques) et une taxonomie defensive (AEGIS delta layers, 70 techniques).

## Taxonomie offensive — CrowdStrike 2025

**Source :** `backend/taxonomy/crowdstrike_2025.json` (v2025-11-01)

95 techniques de prompt injection organisees en 4 classes :

| Classe | ID | Techniques | Description |
|--------|-----|-----------|-------------|
| **OVERT** | 1 | 2 | Approches directes (DPI explicite) |
| **INDIRECT** | 2 | 10 | Injection indirecte (IPI via RAG, memoire, agent) |
| **SOCIAL_COGNITIVE** | 3 | 52 | Attaques sociales/cognitives (context shift, semantic manipulation) |
| **EVASIVE** | 4 | 31 | Approches evasives (obfuscation, encodage, reformulation) |

### OVERT (2 techniques)
Injection directe via le prompt utilisateur (attaquant = utilisateur).

### INDIRECT (10 techniques)

| Sous-categorie | Techniques | Exemples |
|----------------|-----------|----------|
| Context-Data (Internal) | 4 | Prior LLM Output, Agent Memory, Agent-to-Agent, Compromised Ingestion |
| Context-Data (External) | 3 | Attacker-Owned, Attacker-Compromised, Attacker-Influenced |
| User-Prompt Delivery | 3 | LLM-Generated, Altered Prompt, Unwitting User |

### SOCIAL_COGNITIVE (52 techniques)

| Sous-categorie | Techniques | Description |
|----------------|-----------|-------------|
| Cognitive Control Bypass | 3 | Pragmatic manipulation, cognitive hacking, sidestepping |
| Context Shift Prompting | 22 | Authoritative framing (5), context poisoning (1), hypothetical (8), compositional (2), example request (2), secret probing (4) |
| Semantic Manipulation | 4 | Manipulation du sens des instructions |
| In-Context Learning Exploitation | 3 | Exploitation de l'apprentissage en contexte |
| Higher-Level Functioning Disruption | 3 | Disruption des fonctions de haut niveau |
| Response Steering Prompting | 17 | Guidage de la reponse (3 sous-categories) |

### EVASIVE (31 techniques)

| Sous-categorie | Techniques | Description |
|----------------|-----------|-------------|
| Morpho-Syntactic Manipulation | 2 | Modification morpho-syntaxique |
| Instruction Obfuscation | 2 | Obfuscation d'instructions |
| Natural Language Manipulation | 9 | Non-semantic word, multi-lingual, paraphrastic, non-semantic sentence |
| Instruction Reformulation | 13 | Payload decomposition, character representation, string decomposition |
| Distractor Instructions | 3 | Instructions distractrices |
| Multimodal | 1 | Transform-activated visual payload |
| Scenario-Based | 1 | Secret application scenarioque |

---

## Taxonomie defensive — AEGIS delta layers

**Source :** `backend/taxonomy/defense_taxonomy_2025.json` (v2025-03-29)

70 techniques de defense reparties sur 7 couches :

| Couche | Techniques | Role |
|--------|-----------|------|
| **delta-0** | 4 | Alignement RLHF/DPO (externe au systeme) |
| **delta-1** | 7 | Ingenierie de system prompt (production) |
| **delta-2** | 27 | Filtrage d'entree (caracteres, contenu, structure, ML) |
| **delta-3** | 5 | Validation formelle des sorties (production) |
| **DETECT** | 11 | Metriques de scoring + audit |
| **RESP** | 7 | Protocoles de reponse (confinement + alerte) |
| **MEAS** | 9 | Benchmarking et attribution |

### delta-0 : Alignement (4 techniques)
RLHF Safety Training, DPO Alignment, Constitutional AI, Red Team Training

### delta-1 : System Prompt Engineering (7 techniques)
Safety Preamble, Role Anchoring, Boundary Marking, Instruction Hierarchy, Separation Tokens, Sandwich Defense, AIR Instruction Hierarchy

### delta-2 : Filtrage d'entree (27 techniques)

| Sous-categorie | Techniques | Exemples |
|----------------|-----------|----------|
| Character Injection Defense | 12 | Invisible Unicode, Homoglyph, Mixed Encoding, Emoji Smuggling, BiDi Override... |
| Content Analysis Defense | 6 | Typoglycemia, Hidden Markup, Script Mixing, Semantic Drift Guard, Base64 Heuristic |
| Structural Defense | 5 | StruQ, Input/Output Separation, Prompt Sandboxing, Data Marking, ASIDE |
| ML-Based Defense | 4 | Classifier Guard, Perplexity Filter, Task-Specific Finetuning, Adversarial Training |

### delta-3 : Validation formelle (5 techniques)
Allowed Output Specification, Forbidden Directive Check, Tension Range Validation, Tool Invocation Guard, Response Sanitization

### Couverture d'implementation

**44/70 techniques actives (62.9%)** : 40 production + 4 partial + 4 proposed

---

## Benchmark guardrails

**Source :** `backend/taxonomy/guardrail_benchmark.json`

6 guardrails commerciaux/open-source evalues :

| Guardrail | PI Baseline | Jailbreak |
|-----------|-------------|-----------|
| Azure Prompt Shield | 94.12% | 100% |
| ProtectAI v2 | 98.53% | 100% |
| Meta Prompt Guard | 99.58% | 38.31% |
| NeMo Guard (NVIDIA) | 95.80% | 93.59% |
| ProtectAI v1 | 86.55% | 100% |
| Vijil | 72.06% | 84.62% |

## API

- `GET /api/redteam/taxonomy` — Arbre complet
- `GET /api/redteam/taxonomy/flat` — Index plat
- `GET /api/redteam/taxonomy/coverage` — Statistiques de couverture
- `GET /api/redteam/taxonomy/tree` — Arbre avec templates attaches
