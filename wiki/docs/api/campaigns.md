# Campaign Routes

8 endpoints pour les campagnes, scenarios, chaines et prompts agents.

**Fichier source :** `backend/routes/campaign_routes.py` (255 lignes)

---

## GET `/api/redteam/campaign/latest`

Retourne le dernier fichier `campaign_*.json` depuis `research_archive/data/raw/`.

---

## POST `/api/redteam/campaign/stream` :material-broadcast:

Execute une campagne complete avec streaming SSE des resultats.

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `levels` | dict | null | Niveaux de difficulte |
| `aegis_shield` | bool | false | Filtrage delta-2 |
| `n_trials` | int | 1 | Repetitions par attaque |
| `include_null_control` | bool | true | Inclure le controle nul |
| `attacks` | list | null | Attaques explicites `[{type, message}]` |
| `attack_types` | list | null | Filtrer par type d'attaque |

**Evenements SSE :** `round_start`, `round_result`/`round_error`, `campaign_done` avec resume

---

## GET `/api/redteam/agents/prompts/all`

Retourne la matrice complete des system prompts par niveau et par langue.

| Query | Type | Defaut | Description |
|-------|------|--------|-------------|
| `lang` | str | "en" | Langue (fr/en/br) |

**Response :** `{MedicalRobotAgent: {easy, normal, hard}, RedTeamAgent: {...}, SecurityAuditAgent: {...}}`

---

## GET `/api/redteam/agents`

Retourne les system prompts actuels des agents actifs dans l'orchestrateur.

---

## PUT `/api/redteam/agents/{agent_name}/prompt`

Met a jour le system prompt d'un agent specifique.

| Parametre | Type | Description |
|-----------|------|-------------|
| `agent_name` | path | Nom de l'agent |
| `level` | query | Niveau (easy/normal/hard) |
| `lang` | query | Langue |
| **Body** `prompt` | str | Nouveau prompt |

---

## GET `/api/redteam/scenarios`

Liste tous les scenarios disponibles avec metadonnees (id, name, description, clinical_context, expected_impact, mitre_ttps, steps).

---

## GET `/api/redteam/chains`

Liste toutes les chaines d'attaque enregistrees du CHAIN_REGISTRY (id, name, description, category, step_count).

---

## POST `/api/redteam/scenario/stream` :material-broadcast:

Execute un scenario multi-etapes avec streaming SSE.

| Parametre | Type | Description |
|-----------|------|-------------|
| `scenario_id` | str | ID du scenario |
| `levels` | dict | Niveaux de difficulte |
