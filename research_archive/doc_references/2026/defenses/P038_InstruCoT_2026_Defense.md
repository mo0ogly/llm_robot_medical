# P038 — Know Thy Enemy: InstruCoT Defense via Instruction-Level Chain-of-Thought

| Field | Value |
|-------|-------|
| **ID** | P038 |
| **Authors** | Unknown et al. |
| **Year** | 2026 |
| **Venue** | arXiv:2601.04666 |
| **Domain** | defense |
| **delta-Layers** | delta-0 |
| **C1 Support** | Yes (indirect) |
| **C2 Support** | No |

## Key Contribution

Three-phase defense combining diverse prompt injection data synthesis with instruction-level chain-of-thought fine-tuning. Achieves 92.5% (behavioral deviation), 98.0% (privacy leakage), 90.9% (harmful output) defense rates on 4 open-source LLMs while preserving utility.

## Formulas

- DR_BD = 1 - ASR_behavioral_deviation (92.5% mean)
- DR_PL = 1 - ASR_privacy_leakage (98.0% mean)
- DR_HO = 1 - ASR_harmful_output (90.9% mean)

## delta-Layer Analysis

- **delta-0**: Enhanced post-training alignment with metacognitive reasoning on instructions

## AEGIS Relevance

Advances delta-0 beyond standard RLHF by adding explicit reasoning about instruction legitimacy. Partially resolves separation-utility tradeoff from P024. Limited to 7-8B models and static attacks.

---

*Indexed by LIBRARIAN agent -- RUN-002*
