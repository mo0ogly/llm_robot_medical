# LLM Providers Routes

7 endpoints pour la gestion multi-provider LLM. Rate limited : 60 req/min par IP.

**Fichier source :** `backend/routes/llm_providers_routes.py`

---

## GET `/api/redteam/llm-providers`

Liste les providers disponibles avec leur statut de connexion.

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "providers": [
        {
          "name": "ollama",
          "display_name": "Ollama (Local)",
          "type": "local",
          "models": ["llama3.2:latest", "saki007ster/CybersecurityRiskAnalyst:latest", "llama2:latest", "mistral:latest"],
          "default_model": "llama3.2:latest",
          "status": "error",
          "status_message": "All connection attempts failed"
        }
      ],
      "total": 1,
      "timestamp": 1775986748.19
    }
    ```

    !!! note
        Seul Ollama est visible (provider local). Les providers cloud (Groq, Google, xAI) apparaissent quand leurs cles API sont configurees dans `.env`.

---

## GET `/api/redteam/llm-providers/{provider}/models`

Modeles disponibles pour un provider specifique.

??? example "Reponse live (Ollama)"

    ```json
    {
      "provider": "ollama",
      "models": ["llama3.2:latest", "saki007ster/CybersecurityRiskAnalyst:latest", "llama2:latest", "mistral:latest"],
      "default_model": "llama3.2:latest"
    }
    ```

---

## GET `/api/redteam/llm-providers/{provider}/status`

Verification de sante d'un provider avec latence mesuree.

??? example "Reponse live (Ollama)"

    ```json
    {
      "provider": "ollama",
      "status": "error",
      "message": "All connection attempts failed",
      "latency_ms": 2255,
      "type": "local",
      "timestamp": 1775986770.70
    }
    ```

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
