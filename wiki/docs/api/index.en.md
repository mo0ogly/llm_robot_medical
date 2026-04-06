# API Reference

The AEGIS backend exposes **69 endpoints** organized in 8 route modules on port **8042**.

## Overview

| Module | Prefix | Endpoints | Description |
|--------|--------|-----------|-------------|
| [Attacks](attacks.md) | `/api/redteam/` | 19 | Attack execution, scoring, genetic streaming |
| [Campaigns](campaigns.md) | `/api/redteam/` | 8 | Campaigns, scenarios, chains, agent prompts |
| [Config](config.md) | `/api/redteam/` | 16 | Configuration, taxonomy, catalog, providers |
| [LLM Providers](llm-providers.md) | `/api/redteam/` | 7 | Multi-provider management (Ollama, OpenAI, Anthropic) |
| [RAG](rag.md) | `/api/rag/` | 8 | ChromaDB documents, upload, adversarial seeding |
| [Templates](templates.md) | `/api/redteam/templates/` | 10 | Template CRUD, versioning, DOCX export |
| [Results & Telemetry](results.md) | `/api/results/` | 5 | Results exploration + real-time telemetry streaming |

## Streaming Endpoints (SSE)

9 endpoints use **Server-Sent Events** for real-time streaming:

| Endpoint | Type | Events |
|----------|------|--------|
| `POST /api/redteam/genetic/stream` | Genetic iterations | `generation`, `best_fitness`, `done` |
| `POST /api/redteam/context-infer/stream` | Context inference | `attempt`, `result`, `done` |
| `POST /api/redteam/adaptive-attack/stream` | OODA loop | `turn_start`, `attacker_output`, `turn_result`, `done` |
| `GET /api/redteam/safety-campaign/stream` | Safety campaign | `progress`, `done` |
| `POST /api/redteam/campaign/stream` | Campaign rounds | `round_start`, `round_result`, `campaign_done` |
| `POST /api/redteam/scenario/stream` | Scenario steps | `step_start`, `step_result`, `done` |
| `POST /api/redteam/llm-test` | LLM tokens | `token`, `complete` |
| `GET /api/redteam/telemetry/stream` | Live telemetry | `event`, `ping` (20s heartbeat) |
| `GET /api/redteam/templates/{id}/export-fiche` | Binary export | DOCX (StreamingResponse) |

## Authentication

No authentication required (local research tool). Rate limiting on LLM providers routes (60 req/min per IP).

## `lang` Parameter

Most endpoints accept a query parameter `lang` (default: `"en"`) to select system prompt language (fr/en/br).

## Base URL

```
http://localhost:8042
```
