# AEGIS - Medical AI Security Lab

<div align="center" markdown>
**Red Team Research Platform for Medical LLM Security**

*ENS Doctoral Thesis (2026) -- Security of Autonomous Surgical Systems*
</div>

---

## Overview

**AEGIS** (Adversarial Evaluation & Guardrail Integrity System) is a doctoral research platform studying vulnerabilities of Large Language Models integrated into robotic surgical systems.

The project models a Da Vinci Xi robot assisted by a medical AI (LLaMA 3.2 via Ollama), and demonstrates how an attacker can manipulate clinical recommendations through prompt injection -- with potentially lethal consequences (clamp tension at 850g, instrument freeze).

![AEGIS Surgical Dashboard](assets/images/main_dashboard_v3_latest.webp)

![Red Team Lab](assets/images/redteam_lab_v3_latest.png)

---

## Key Figures

| Metric | Value |
|--------|-------|
| API Endpoints | 69 (including 9 SSE streaming) |
| Attack Templates | 102 (97 numbered + 5 config) |
| Attack Chains | 36 LangChain modules |
| Scenarios | 48 (covering all 36 chains) |
| Offensive Techniques (CrowdStrike) | 95 |
| Defensive Techniques (delta layers) | 70 (44 implemented) |
| Indexed Research Papers | 80 (P001-P080) |
| Mathematical Formulas | 66 (F01-F72) |
| Discoveries | 20 (D-001 to D-020) |
| Conjectures | 7 (C1-C7, all >= 8/10 confidence) |
| Frontend Components | 93 JSX files |
| Supported Languages | 3 (FR, EN, BR) |

---

## Architecture

```
                   HOSPITAL NETWORK
  +--------------------------------------------------+
  |                                                  |
  |  [PACS Server] --HL7--> [Da Vinci LLM] --tools--> [Robot]
  |                              |                   |
  |                     +--------+--------+          |
  |                     |  Aegis Cyber AI |          |
  |                     |  (Supervision)  |          |
  |                     +-----------------+          |
  +--------------------------------------------------+
```

| Component | Stack | Port |
|-----------|-------|------|
| **Frontend** | React 19, Vite, Tailwind v4, Three.js | :5173 |
| **Backend** | FastAPI, AG2 (AutoGen), LangChain | :8042 |
| **LLM** | Ollama + LLaMA 3.2 (local) | :11434 |
| **RAG** | ChromaDB (4200 corpus docs + 4700 bibliography) | :8000 |
| **Wiki** | MkDocs Material (this site) | :8001 |

---

## 4 Attack Scenarios

| # | Scenario | Technique | Impact | MITRE |
|---|----------|-----------|--------|-------|
| 0 | **Baseline** | Normal operation, intact HL7 record | None | -- |
| 1 | **Slow Poison** | Indirect injection via PACS: AI recommends 850g tension (lethal) | Critical | T1565.001 |
| 2 | **Ransomware** | Direct takeover: `freeze_instruments()` -- arms locked | Critical | T1486 |
| 3 | **Aegis Defense** | Isolated second agent triggers multi-round debate to expose compromise | Protection | T1059.009 |

---

## Formal Framework delta-0 to delta-3

| Layer | Role | Techniques | Status |
|-------|------|-----------|--------|
| **delta-0** | RLHF/DPO alignment | 4 | Erasable (GRP-Obliteration, P039) |
| **delta-1** | Instruction hierarchy | 7 | Persistently poisonable (P045) |
| **delta-2** | Detection and filtering | 27 | Bypassable at 99% (P044, P049) |
| **delta-3** | Formal output validation | 5 | **Sole survivor** |

!!! warning "Discovery D-001 -- Triple Convergence"
    When delta-0, delta-1 and delta-2 are simultaneously compromised, only delta-3 (formal validation + RagSanitizer with 15 detectors) survives. This is the thesis's main contribution.

---

## Genetic Engine (Liu et al., 2023)

Evolutionary adversarial prompt optimizer adapted to the medical domain:

- **Population**: 10 individuals (framework + separator + disruptor)
- **Fitness**: dual scoring -- LLM-judge (Zhang et al. 2025) + AEGIS formal verification
- **Mutation**: LLM rephrasing with 3 parsing strategies
- **Medical separators**: HL7, FDA, OBX, XML/Base64
- **Intentions**: tool_hijack, prompt_leak, tension_override
- **Stopping**: fitness >= 10 or 20 generations max

---

## Evaluation Metrics

| Metric | Reference | API |
|--------|-----------|-----|
| **ASR** (Attack Success Rate) | N >= 30 per condition | `POST /api/redteam/multi-trial` |
| **Sep(M)** (Separation Score) | Zverev et al., ICLR 2025 | `POST /api/redteam/separation-score` |
| **SVC** (Clinical Viability Score) | 6 weighted dimensions | `POST /api/redteam/svc` |
| **LLM-Judge 4D** | Zhang et al. 2025 (StrongREJECT) | `POST /api/redteam/judge` |
| **Semantic Drift** | Cosine similarity on embeddings | `backend/agents/semantic_drift.py` |

---

## Navigation

### Getting Started
- [Installation](installation.md) -- Prerequisites, setup, launch
- [AI Architecture](architecture/index.md) -- Da Vinci, AEGIS, RedTeam agents
- [Backend Architecture](backend/index.md) -- Agents, genetic engine, orchestrator
- [Frontend Architecture](frontend/index.md) -- 93 React components, routing, hooks

### Red Team Lab
- [API Reference (69 endpoints)](api/index.md) -- Complete API documentation
- [Prompts (99 templates)](prompts/index.md) -- Documented attack catalog
- [Attack Scenarios](redteam-lab/scenarios.md) -- The 4 main scenarios
- [Taxonomy](taxonomy/index.md) -- CrowdStrike 95 + delta defenses 70
- [Formal Metrics](metrics/index.md) -- ASR, Sep(M), SVC, LLM-Judge

### Doctoral Research
- [Research Archive](research/index.md) -- Structure and guide
- [Current State](research/state.md) -- Real-time progress
- [Discoveries](research/discoveries/index.md) -- D-001 to D-020
- [Bibliography](research/bibliography/index.md) -- 80 indexed papers
- [Mathematical Glossary](research/bibliography/glossaire.md) -- 66 formulas

### Staging Agents
- [Overview](staging/index.md) -- 9 agents, 176 files
- [Analyst (89)](staging/analyst.md) -- Individual analyses P001-P089
- [Scientist (20)](staging/scientist.md) -- Synthesis, conjectures, research axes
- [Mathteacher (13)](staging/mathteacher.md) -- 7 mathematical learning modules

### Project
- [Implementation Plans](plans/index.md) -- 7 design docs
- [Roadmap](roadmap.md) -- Feature roadmap v4.0+
- [Integration](redteam-lab/integration.md) -- Genetic integration tracker

---

*Doctoral thesis project -- Ecole Normale Superieure (2026)*
*LLM Security in Robotic Surgical Systems*
