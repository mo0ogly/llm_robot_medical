# Taxonomia de Ataques e Defesas

AEGIS utiliza duas taxonomias complementares: uma taxonomia ofensiva (CrowdStrike, 95 tecnicas) e uma taxonomia defensiva (camadas delta AEGIS, 70 tecnicas).

## Taxonomia Ofensiva -- CrowdStrike 2025

**Fonte:** `backend/taxonomy/crowdstrike_2025.json` (v2025-11-01)

95 tecnicas de injecao de prompt organizadas em 4 classes:

| Classe | ID | Tecnicas | Descricao |
|--------|-----|----------|-----------|
| **OVERT** | 1 | 2 | Abordagens diretas (DPI explicita) |
| **INDIRECT** | 2 | 10 | Injecao indireta (IPI via RAG, memoria, agente) |
| **SOCIAL_COGNITIVE** | 3 | 52 | Ataques sociais/cognitivos |
| **EVASIVE** | 4 | 31 | Abordagens evasivas (ofuscacao, codificacao) |

## Taxonomia Defensiva -- Camadas Delta AEGIS

70 tecnicas de defesa em 7 camadas:

| Camada | Tecnicas | Funcao |
|--------|----------|--------|
| **delta-0** | 4 | Alinhamento RLHF/DPO |
| **delta-1** | 7 | Engenharia de system prompt |
| **delta-2** | 27 | Filtragem de entrada |
| **delta-3** | 5 | Validacao formal de saidas |
| **DETECT** | 11 | Metricas de scoring + auditoria |
| **RESP** | 7 | Protocolos de resposta |
| **MEAS** | 9 | Benchmarking e atribuicao |

**Cobertura de implementacao:** 44/70 tecnicas ativas (62.9%)

## API

- `GET /api/redteam/taxonomy` -- Arvore completa
- `GET /api/redteam/taxonomy/coverage` -- Estatisticas de cobertura
