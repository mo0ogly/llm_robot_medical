# API Reference

Le backend AEGIS expose **69 endpoints** organises en 8 modules de routes sur le port **8042**.

## Vue d'ensemble

| Module | Prefix | Endpoints | Description |
|--------|--------|-----------|-------------|
| [Attack](attacks.md) | `/api/redteam/` | 19 | Execution d'attaques, scoring, streaming genetique |
| [Campaign](campaigns.md) | `/api/redteam/` | 8 | Campagnes, scenarios, chaines, prompts agents |
| [Config](config.md) | `/api/redteam/` | 16 | Configuration, taxonomie, catalogue, providers |
| [LLM Providers](llm-providers.md) | `/api/redteam/` | 7 | Gestion multi-provider (Ollama, OpenAI, Anthropic) |
| [RAG](rag.md) | `/api/rag/` | 8 | Documents ChromaDB, upload, seed adversarial |
| [Templates](templates.md) | `/api/redteam/templates/` | 10 | CRUD templates, versioning, export DOCX |
| [Results](results.md) | `/api/results/` | 2 | Exploration des resultats d'experiences |
| [Telemetry](results.md#telemetry-3-endpoints) | `/api/redteam/telemetry/` | 3 | Streaming SSE de telemetrie temps reel |

## Endpoints streaming (SSE)

9 endpoints utilisent **Server-Sent Events** pour le streaming temps reel :

| Endpoint | Type | Evenements |
|----------|------|-----------|
| `POST /api/redteam/genetic/stream` | Iterations genetiques | `generation`, `best_fitness`, `done` |
| `POST /api/redteam/context-infer/stream` | Inference de contexte | `attempt`, `result`, `done` |
| `POST /api/redteam/adaptive-attack/stream` | Boucle OODA | `turn_start`, `attacker_output`, `turn_result`, `done` |
| `GET /api/redteam/safety-campaign/stream` | Campagne de securite | `progress`, `done` |
| `POST /api/redteam/campaign/stream` | Rounds de campagne | `round_start`, `round_result`, `campaign_done` |
| `POST /api/redteam/scenario/stream` | Etapes de scenario | `step_start`, `step_result`, `done` |
| `POST /api/redteam/llm-test` | Tokens LLM | `token`, `complete` |
| `GET /api/redteam/telemetry/stream` | Telemetrie live | `event`, `ping` (heartbeat 20s) |
| `GET /api/redteam/templates/{id}/export-fiche` | Export binaire | DOCX (StreamingResponse) |

## Authentification

Pas d'authentification requise (outil de recherche local). Rate limiting sur les routes LLM providers (60 req/min par IP).

## Parametre `lang`

La majorite des endpoints acceptent un query parameter `lang` (defaut: `"en"`) pour selectionner la langue des prompts systeme (fr/en/br).

## Base URL

```
http://localhost:8042
```

## Health Check

```bash
curl http://localhost:8042/health
```
