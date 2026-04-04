# P043 — Jailbreak Distillation: Renewable Safety Benchmarking

| Field | Value |
|-------|-------|
| **ID** | P043 |
| **Authors** | Zhang et al. (Johns Hopkins / Microsoft) |
| **Year** | 2025 |
| **Venue** | EMNLP 2025 Findings |
| **Domain** | benchmark |
| **delta-Layers** | (none directly) |
| **C1 Support** | Yes (indirect) |
| **C2 Support** | Partial |

## Key Contribution

JBDistill framework for renewable safety benchmarks. Distills jailbreak attacks into reproducible benchmarks achieving 81.8% effectiveness across 13 evaluation models (including proprietary and reasoning LLMs). Enables fair cross-model comparisons.

## Formulas

- Effectiveness = correctly identified vulnerable models / total models = 81.8% max
- Optimal selection: argmax_{S subset pool} coverage(S) subject to |S| <= k

## delta-Layer Analysis

- No direct delta-layer involvement (evaluation framework, not defense)

## AEGIS Relevance

Method for standardizing evaluation of AEGIS 98 templates. Could distill templates into optimal benchmark subset. 81.8% leaves ~18% blind spots -- insufficient for medical context where every false negative matters. Code available (microsoft/jailbreak-distillation).

---

*Indexed by LIBRARIAN agent -- RUN-002*
