# Attack & Defense Taxonomy

AEGIS uses two complementary taxonomies: an offensive taxonomy (CrowdStrike, 95 techniques) and a defensive taxonomy (AEGIS delta layers, 70 techniques).

## Offensive Taxonomy -- CrowdStrike 2025

**Source:** `backend/taxonomy/crowdstrike_2025.json` (v2025-11-01)

95 prompt injection techniques organized in 4 classes:

| Class | ID | Techniques | Description |
|-------|-----|-----------|-------------|
| **OVERT** | 1 | 2 | Direct approaches (explicit DPI) |
| **INDIRECT** | 2 | 10 | Indirect injection (IPI via RAG, memory, agent) |
| **SOCIAL_COGNITIVE** | 3 | 52 | Social/cognitive attacks (context shift, semantic manipulation) |
| **EVASIVE** | 4 | 31 | Evasive approaches (obfuscation, encoding, reformulation) |

## Defensive Taxonomy -- AEGIS Delta Layers

**Source:** `backend/taxonomy/defense_taxonomy_2025.json` (v2025-03-29)

70 defense techniques across 7 layers:

| Layer | Techniques | Role |
|-------|-----------|------|
| **delta-0** | 4 | RLHF/DPO alignment (external to system) |
| **delta-1** | 7 | System prompt engineering (production) |
| **delta-2** | 27 | Input filtering (character, content, structure, ML) |
| **delta-3** | 5 | Formal output validation (production) |
| **DETECT** | 11 | Scoring metrics + audit |
| **RESP** | 7 | Response protocols (containment + alerting) |
| **MEAS** | 9 | Benchmarking and attribution |

**Implementation coverage:** 44/70 active techniques (62.9%)

## Guardrail Benchmark

6 commercial/open-source guardrails evaluated:

| Guardrail | PI Baseline | Jailbreak |
|-----------|-------------|-----------|
| Azure Prompt Shield | 94.12% | 100% |
| ProtectAI v2 | 98.53% | 100% |
| Meta Prompt Guard | 99.58% | 38.31% |
| NeMo Guard (NVIDIA) | 95.80% | 93.59% |
| ProtectAI v1 | 86.55% | 100% |
| Vijil | 72.06% | 84.62% |

## API

- `GET /api/redteam/taxonomy` -- Full tree
- `GET /api/redteam/taxonomy/flat` -- Flat index
- `GET /api/redteam/taxonomy/coverage` -- Coverage statistics
- `GET /api/redteam/taxonomy/tree` -- Tree with attached templates
