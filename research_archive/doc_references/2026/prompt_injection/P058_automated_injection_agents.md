# P058 — Automated Prompt Injection Attacks Against LLM Agents

| Field | Value |
|-------|-------|
| **ID** | P058 |
| **Title** | Automated Prompt Injection Attacks Against LLM Agents |
| **Authors** | David Hofer (ETH Zurich) |
| **Year** | 2025 |
| **Venue** | MSc Thesis, ETH Zurich, December 2025 |
| **URL** | https://davhofer.github.io/assets/pdf/msc_thesis.pdf |
| **Topic** | Multi-turn automated prompt injection attacks against LLM-based agents |
| **δ-layers** | δ¹ (prompt injection crafting), δ² (multi-turn agent exploitation) |
| **Conjectures** | C2 (automated attack generation), C5 (agent-level attack surfaces expand beyond single-turn) |

## Abstract

[FETCH FAILED — PDF not text-extractable on this system. Manual review needed.]

The thesis investigates automated methods for crafting and executing prompt injection attacks against LLM-based agents. It focuses on the security vulnerabilities that emerge when language models are deployed as autonomous agents with tool access, examining how automated techniques can systematically discover and exploit injection vectors across multi-turn interactions.

## Key Contributions

- Systematic framework for automating prompt injection attack generation against LLM agents
- Analysis of multi-turn attack surfaces specific to agent architectures (tool use, memory, planning)
- Empirical evaluation of automated attack effectiveness across agent configurations
- Investigation of the gap between single-turn injection and agent-level exploitation chains

## Relevance to AEGIS

Directly relevant to AEGIS's multi-agent attack chain architecture (34 chains). The thesis's automation approach parallels AEGIS's genetic engine and adaptive attacker agent. Provides academic grounding for the claim that agent-level attacks require different defense strategies than single-turn prompt injection. The ETH provenance adds institutional weight to the agent-security research direction.
