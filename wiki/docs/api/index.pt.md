# Referencia API

O backend AEGIS expoe **69 endpoints** organizados em 8 modulos de rotas na porta **8042**.

## Visao Geral

| Modulo | Prefixo | Endpoints | Descricao |
|--------|---------|-----------|-----------|
| [Ataques](attacks.md) | `/api/redteam/` | 19 | Execucao de ataques, scoring, streaming genetico |
| [Campanhas](campaigns.md) | `/api/redteam/` | 8 | Campanhas, cenarios, cadeias, prompts de agentes |
| [Config](config.md) | `/api/redteam/` | 16 | Configuracao, taxonomia, catalogo, provedores |
| [Provedores LLM](llm-providers.md) | `/api/redteam/` | 7 | Gerenciamento multi-provedor (Ollama, OpenAI, Anthropic) |
| [RAG](rag.md) | `/api/rag/` | 8 | Documentos ChromaDB, upload, seed adversarial |
| [Templates](templates.md) | `/api/redteam/templates/` | 10 | CRUD de templates, versionamento, exportacao DOCX |
| [Resultados & Telemetria](results.md) | `/api/results/` | 5 | Exploracao de resultados + streaming de telemetria |

## Endpoints Streaming (SSE)

9 endpoints usam **Server-Sent Events** para streaming em tempo real.

## Autenticacao

Nenhuma autenticacao necessaria (ferramenta de pesquisa local). Rate limiting nas rotas de provedores LLM (60 req/min por IP).

## Parametro `lang`

A maioria dos endpoints aceita um parametro de query `lang` (padrao: `"en"`) para selecionar o idioma dos prompts de sistema (fr/en/br).

## URL Base

```
http://localhost:8042
```
