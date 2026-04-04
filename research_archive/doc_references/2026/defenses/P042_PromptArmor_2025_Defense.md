# P042 — PromptArmor: Simple yet Effective Prompt Injection Defenses

| Field | Value |
|-------|-------|
| **ID** | P042 |
| **Authors** | Shi, Zhu, Wang et al. |
| **Year** | 2025 |
| **Venue** | arXiv:2507.15219 (under review ICLR 2026) |
| **Domain** | defense |
| **delta-Layers** | delta-1, delta-2 |
| **C1 Support** | Nuance (advanced delta-1 reaches <1% error) |
| **C2 Support** | Partial |

## Key Contribution

Demonstrates modern LLMs with advanced reasoning can serve as effective guardrails via careful prompting. FPR and FNR below 1% on AgentDojo. Detect-then-clean schema combining detection (delta-2) with prevention (delta-1).

## Formulas

- FPR < 1% on AgentDojo
- FNR < 1% on AgentDojo
- ASR_post < 1% after cleaning

## delta-Layer Analysis

- **delta-1**: Defense operates via careful prompting of guardrail LLM
- **delta-2**: Injection detection is contextual filtering

## AEGIS Relevance

Best documented delta-1 defense in corpus. Sub-1% FPR/FNR benchmark for AEGIS RagSanitizer. Requires frontier model (GPT-4o) as guardrail -- not demonstrated on open-source. Vulnerability of guardrail LLM itself (P033) not addressed.

---

*Indexed by LIBRARIAN agent -- RUN-002*
