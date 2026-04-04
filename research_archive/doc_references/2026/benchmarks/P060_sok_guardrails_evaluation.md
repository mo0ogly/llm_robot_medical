# P060 — SoK: Evaluating Jailbreak Guardrails for Large Language Models

| Field | Value |
|-------|-------|
| **ID** | P060 |
| **Title** | SoK: Evaluating Jailbreak Guardrails for Large Language Models |
| **Authors** | Xunguang Wang, Zhenlan Ji, Wenxuan Wang, Zongjie Li, Daoyuan Wu, Shuai Wang |
| **Year** | 2025 |
| **Venue** | IEEE S&P 2026 Cycle 1 (accepted), arXiv:2506.10597v2 |
| **URL** | https://arxiv.org/html/2506.10597v2 |
| **Topic** | Systematic evaluation framework for jailbreak guardrails |
| **δ-layers** | δ⁰ (alignment guardrails), δ¹ (input filtering), δ³ (detection/monitoring) |
| **Conjectures** | C1 (guardrail taxonomy validates multi-layer defense), C3 (security-utility tradeoff), C6 (no single guardrail is universal) |

## Abstract

Large Language Models (LLMs) have achieved remarkable progress, but their deployment has exposed critical vulnerabilities, particularly to jailbreak attacks that circumvent safety alignments. Guardrails -- external defense mechanisms that monitor and control LLM interactions -- have emerged as a promising solution. However, the current landscape of LLM guardrails is fragmented, lacking a unified taxonomy and comprehensive evaluation framework. In this Systematization of Knowledge (SoK) paper, we present the first holistic analysis of jailbreak guardrails for LLMs. We propose a novel, multi-dimensional taxonomy that categorizes guardrails along six key dimensions, and introduce a Security-Efficiency-Utility evaluation framework to assess their practical effectiveness. Through extensive analysis and experiments, we identify the strengths and limitations of existing guardrail approaches, provide insights into optimizing their defense mechanisms, and explore their universality across attack types. Our work offers a structured foundation for future research and development, aiming to guide the principled advancement and deployment of robust LLM guardrails.

## Key Contributions

- First holistic SoK on jailbreak guardrails with a six-dimensional taxonomy: intervention stage, technical paradigm, safety granularity, reactiveness, applicability, and explainability
- Security-Efficiency-Utility (SEU) evaluation framework balancing defense performance, computational overhead, and impact on legitimate interactions
- Extensive empirical evaluation identifying trade-offs across guardrail approaches
- Analysis of guardrail universality across attack types (no single approach dominates)
- Accepted at IEEE S&P 2026, providing top-tier venue validation

## Relevance to AEGIS

The six-dimensional taxonomy directly complements AEGIS's defense taxonomy (66 techniques, 4 classes). The SEU framework parallels AEGIS's SVC (Security-Viability-Compliance) scoring. The finding that no single guardrail is universal validates the multi-layer δ⁰-δ³ defense architecture. The IEEE S&P 2026 acceptance makes this a high-impact reference for the formal framework's defense evaluation methodology.
