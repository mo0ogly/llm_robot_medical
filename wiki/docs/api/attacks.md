# Attack Routes

19 endpoints pour l'execution d'attaques, le scoring et l'evaluation.

**Fichier source :** `backend/routes/attack_routes.py` (477 lignes)

---

## POST `/api/redteam/attack`

Execute une attaque unique et retourne le resultat score.

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `attack_type` | str | requis | Type d'attaque (injection, rule_bypass, prompt_leak) |
| `attack_message` | str | requis | Payload d'attaque |
| `levels` | dict | null | Niveaux de difficulte par agent |
| `system_prompt_mode` | str | "normal" | Mode du system prompt |
| `provider` | str | null | Provider LLM (ollama, openai, anthropic) |
| `model` | str | null | Modele specifique |
| **Query** `lang` | str | "en" | Langue des prompts |

**Response :** Resultat avec round, attack_type, target_response, scores, audit_analysis

---

## GET `/api/redteam/report`

Retourne le rapport d'audit courant avec tous les rounds executes.

**Response :** `{summary, results: [{round, attack_type, scores, details}]}`

---

## POST `/api/redteam/multi-trial`

Execute la meme attaque N fois (multi-trial sampling statistique).

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `attack_type` | str | requis | Type d'attaque |
| `attack_message` | str | requis | Payload |
| `n_trials` | int | 10 | Nombre de repetitions |
| `levels` | dict | null | Niveaux par agent |
| `aegis_shield` | bool | false | Activer le filtrage delta-2 |

**Response :** `{violation_rate, threat_score, svc}`

---

## POST `/api/redteam/separation-score`

Calcule le Score de Separation Sep(M) selon Zverev et al. (ICLR 2025, Definition 2).

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `attack_message` | str | requis | Payload a evaluer |
| `n_trials` | int | 10 | Repetitions pour la significativite |
| `levels` | dict | null | Niveaux par agent |

**Response :** `{p_data, threat_score, svc}`

---

## POST `/api/redteam/delta0-protocol`

Execute le protocole de discrimination delta-0/delta-1.

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `attack_message` | str | requis | Payload |
| `attack_type` | str | "injection" | Type |
| `n_trials` | int | 30 | N >= 30 pour validite statistique |
| `provider` | str | null | Provider LLM |
| `model` | str | null | Modele |

---

## POST `/api/redteam/judge`

Evaluation LLM-as-Judge (Zhang et al. 2025, StrongREJECT framework).

| Parametre | Type | Description |
|-----------|------|-------------|
| `attack_prompt` | str | Prompt d'attaque original |
| `target_response` | str | Reponse du modele cible (requis) |
| `provider` | str | Provider du juge LLM |
| `model` | str | Modele du juge |

**Response :** `{compliance, policy_alignment, specificity, convincingness, harmfulness, effectiveness}`

**Formule harmfulness :** `(2 * harm_policy + specificity + convincingness) / 4`, rescale [0,1]

---

## POST `/api/redteam/judge/batch`

Evaluation batch LLM-as-Judge pour les resultats de campagne.

| Parametre | Type | Description |
|-----------|------|-------------|
| `results` | list | Liste de resultats a evaluer (requis) |

**Response :** `{evaluations: [], count: int}`

---

## POST `/api/redteam/svc`

Calcule le Score de Vraisemblance Clinique (SVC) sur 6 dimensions.

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `prompt` | str | requis | Prompt a scorer |
| `attack_type` | str | "injection" | Type d'attaque |
| `max_tension_g` | int | 800 | Seuil tension maximale (g) |

---

## POST `/api/redteam/run-all`

Execute TOUTES les attaques du catalogue en sequence.

**Response :** Rapport complet avec resume et resultats par attaque.

---

## POST `/api/redteam/genetic/stream` :material-broadcast:

Execute un Genetic Prompt Optimizer (Liu et al., 2023) avec streaming SSE.

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `intention` | str | "tool_hijack" | Intention d'attaque |
| `max_iterations` | int | 20 | Generations maximales |
| `population_size` | int | 10 | Taille de la population |
| `mutation_rate` | float | 0.5 | Taux de mutation |
| `crossover_rate` | float | 0.1 | Taux de croisement |
| `levels` | dict | null | Niveaux par agent |
| `aegis_shield` | bool | false | Filtrage delta-2 |

**Evenements SSE :** `{type, data}` par generation, `done` en fin d'optimisation.

---

## GET `/api/redteam/genetic/intentions`

Liste les intentions d'attaque disponibles pour l'optimiseur genetique.

**Response :** Liste avec key, name, category, question_prompt

---

## POST `/api/redteam/context-infer/stream` :material-broadcast:

Execute un Context Inference Attack avec streaming SSE.

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `intention` | str | "tool_hijack" | Intention |
| `max_attempts` | int | 3 | Tentatives max |

---

## POST `/api/redteam/adaptive-attack/stream` :material-broadcast:

Execute une attaque adaptative (boucle OODA) avec streaming SSE.

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `objective` | str | requis | Objectif de l'attaque |
| `max_turns` | int | 5 | Tours max |

**Evenements SSE :** `init`, `turn_start`, `status`, `attacker_output`, `turn_result`, `success`/`failure`, `done`

---

## GET `/api/redteam/safety-campaign/stream` :material-broadcast:

Lance une campagne massive de securite avec streaming SSE.

| Query | Type | Defaut | Description |
|-------|------|--------|-------------|
| `n` | int | 10 | Nombre d'iterations |

---

## GET `/api/redteam/safety-eval`

Execute l'evaluation de securite defensive (Harness).
