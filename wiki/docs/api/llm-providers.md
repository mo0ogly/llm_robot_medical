# LLM Providers Routes

7 endpoints pour la gestion multi-provider LLM. Rate limited : 60 req/min par IP.

**Fichier source :** `backend/routes/llm_providers_routes.py` (529 lignes)

---

## GET `/api/redteam/llm-providers`

Liste les providers disponibles avec leur statut de connexion.

**Response :** `[{name, display_name, type, models, default_model, status, status_message}]`

---

## GET `/api/redteam/llm-providers/{provider}/models`

Modeles disponibles pour un provider specifique.

**Response :** `{provider, models, default_model}`

---

## GET `/api/redteam/llm-providers/{provider}/status`

Verification de sante d'un provider.

**Response :** `{provider, status, message, latency_ms, type, timestamp}`

---

## POST `/api/redteam/llm-test` :material-broadcast:

Test d'un prompt sur un provider unique avec streaming de tokens.

| Parametre | Type | Contraintes | Defaut |
|-----------|------|-------------|--------|
| `provider` | str | 1-50 chars | requis |
| `model` | str | 1-256 chars | requis |
| `prompt` | str | 1-32768 chars | requis |
| `temperature` | float | 0.0-1.0 | 0.7 |
| `max_tokens` | int | 1-4096 | 1024 |
| `system_prompt` | str | max 8192 | null |

**Evenements SSE :** `{token, provider, timestamp}`, final `{complete, duration_ms, tokens}`

---

## POST `/api/redteam/llm-compare`

Test d'un prompt sur plusieurs providers en parallele.

| Parametre | Type | Contraintes | Defaut |
|-----------|------|-------------|--------|
| `prompt` | str | 1-32768 chars | requis |
| `system_prompt` | str | max 8192 | null |
| `temperature` | float | 0.0-1.0 | 0.7 |
| `max_tokens` | int | 1-4096 | 1024 |
| `providers` | list | max 10 | null (tous) |

**Response :** `{results: {provider_name: {status, response, tokens, duration_ms, error}}, timestamp}`

---

## GET `/api/redteam/llm-providers/{provider}/config`

Configuration complete d'un provider (authentification sanitisee).

---

## PUT `/api/redteam/llm-providers/{provider}/config`

Met a jour la configuration d'un provider (in-memory uniquement).

| Parametre | Type | Description |
|-----------|------|-------------|
| `enabled` | bool | Activer/desactiver |
| `api_key` | str | Cle API (max 1024) |
| `endpoint_url` | str | URL endpoint (max 2048) |
| `timeout_seconds` | int | Timeout 1-300s |
