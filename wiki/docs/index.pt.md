# AEGIS - Laboratorio de Seguranca de IA Medica

<div align="center" markdown>
**Plataforma de Pesquisa Red Team para Seguranca de LLM Medico**

*Tese de Doutorado ENS (2026) -- Seguranca de Sistemas Cirurgicos Autonomos*
</div>

---

## Apresentacao

**AEGIS** (Adversarial Evaluation & Guardrail Integrity System) e uma plataforma de pesquisa de doutorado que estuda vulnerabilidades de Large Language Models integrados em sistemas cirurgicos roboticos.

O projeto modela um robo Da Vinci Xi assistido por uma IA medica (LLaMA 3.2 via Ollama), e demonstra como um atacante pode manipular recomendacoes clinicas por injecao de prompt -- com consequencias potencialmente letais (tensao de pinca a 850g, congelamento de instrumentos).

![Dashboard Cirurgico AEGIS](assets/images/main_dashboard_v3_latest.webp)

![Red Team Lab](assets/images/redteam_lab_v3_latest.png)

---

## Numeros-chave

| Metrica | Valor |
|---------|-------|
| Endpoints API | 69 (incluindo 9 streaming SSE) |
| Templates de ataque | 102 (97 numerados + 5 config) |
| Cadeias de ataque | 36 modulos LangChain |
| Cenarios | 48 (cobrindo todas as 36 cadeias) |
| Tecnicas ofensivas (CrowdStrike) | 95 |
| Tecnicas defensivas (camadas delta) | 70 (44 implementadas) |
| Artigos de pesquisa indexados | 80 (P001-P080) |
| Formulas matematicas | 66 (F01-F72) |
| Descobertas | 20 (D-001 a D-020) |
| Conjecturas | 7 (C1-C7, todas >= 8/10 confianca) |
| Componentes frontend | 93 arquivos JSX |
| Idiomas suportados | 3 (FR, EN, BR) |

---

## Arquitetura

```
                   REDE HOSPITALAR
  +--------------------------------------------------+
  |                                                  |
  |  [Servidor PACS] --HL7--> [Da Vinci LLM] --tools--> [Robo]
  |                              |                   |
  |                     +--------+--------+          |
  |                     |  Aegis Cyber AI |          |
  |                     |  (Supervisao)   |          |
  |                     +-----------------+          |
  +--------------------------------------------------+
```

| Componente | Stack | Porta |
|------------|-------|-------|
| **Frontend** | React 19, Vite, Tailwind v4, Three.js | :5173 |
| **Backend** | FastAPI, AG2 (AutoGen), LangChain | :8042 |
| **LLM** | Ollama + LLaMA 3.2 (local) | :11434 |
| **RAG** | ChromaDB (4200 docs corpus + 4700 bibliografia) | :8000 |
| **Wiki** | MkDocs Material (este site) | :8001 |

---

## 4 Cenarios de Ataque

| # | Cenario | Tecnica | Impacto | MITRE |
|---|---------|---------|---------|-------|
| 0 | **Baseline** | Operacao normal, registro HL7 intacto | Nenhum | -- |
| 1 | **Veneno Lento** | Injecao indireta via PACS: IA recomenda 850g de tensao (letal) | Critico | T1565.001 |
| 2 | **Ransomware** | Tomada de controle direta: `freeze_instruments()` -- bracos bloqueados | Critico | T1486 |
| 3 | **Defesa Aegis** | Segundo agente isolado aciona debate multi-rodadas | Protecao | T1059.009 |

---

## Framework Formal delta-0 a delta-3

| Camada | Funcao | Tecnicas | Status |
|--------|--------|----------|--------|
| **delta-0** | Alinhamento RLHF/DPO | 4 | Apagavel (P039) |
| **delta-1** | Hierarquia de instrucoes | 7 | Envenenavel (P045) |
| **delta-2** | Deteccao e filtragem | 27 | Contornavel a 99% (P044, P049) |
| **delta-3** | Validacao formal de saidas | 5 | **Unico sobrevivente** |

!!! warning "Descoberta D-001 -- Tripla Convergencia"
    Quando delta-0, delta-1 e delta-2 sao simultaneamente comprometidas, apenas delta-3 (validacao formal + RagSanitizer com 15 detectores) sobrevive.

---

## Navegacao

### Primeiros Passos
- [Instalacao](installation.md) -- Pre-requisitos, setup, inicializacao
- [Arquitetura IA](architecture/index.md) -- Agentes Da Vinci, AEGIS, RedTeam
- [Arquitetura Backend](backend/index.md) -- Agentes, motor genetico
- [Arquitetura Frontend](frontend/index.md) -- 93 componentes React

### Red Team Lab
- [Referencia API (69 endpoints)](api/index.md) -- Documentacao completa
- [Prompts (99 templates)](prompts/index.md) -- Catalogo de ataques
- [Taxonomia](taxonomy/index.md) -- CrowdStrike 95 + defesas delta 70
- [Metricas Formais](metrics/index.md) -- ASR, Sep(M), SVC, LLM-Juiz

### Pesquisa
- [Arquivo de Pesquisa](research/index.md) -- Estrutura e guia
- [Descobertas](research/discoveries/index.md) -- D-001 a D-020
- [Bibliografia](research/bibliography/index.md) -- 80 artigos indexados

---

*Tese de doutorado -- Ecole Normale Superieure (2026)*
