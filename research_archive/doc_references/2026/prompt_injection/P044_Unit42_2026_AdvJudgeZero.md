# P044 — Auditing the Gatekeepers: Fuzzing AI Judges to Bypass Security Controls (AdvJudge-Zero)

| Field | Value |
|-------|-------|
| **ID** | P044 |
| **Authors** | Li, Wu & Liu (Unit 42, Palo Alto Networks) |
| **Year** | 2026 |
| **Venue** | Unit 42 Research / arXiv:2512.17375 |
| **Domain** | attack |
| **delta-Layers** | delta-2 |
| **C1 Support** | No (targets judges, not prompts) |
| **C2 Support** | Yes (strong) |

## Key Contribution

Introduces AdvJudge-Zero, an automated fuzzer achieving 99% success rate in flipping LLM judge decisions using low-perplexity control tokens. Affects open-weight enterprise LLMs, reward models, and commercial LLMs. Adversarial training via LoRA reduces ASR to near-zero.

## Formulas

- ASR_judges = flipped decisions / total decisions = 99%
- FPR_induced up to 99.91%
- Logit gap manipulation at last layer

## delta-Layer Analysis

- **delta-2**: Control tokens exploit syntactic weaknesses in judge mechanisms

## AEGIS Relevance

Reveals vulnerability in Red Team Lab evaluation pipeline. LLM judges used for harmfulness scoring could be manipulated. Highest ASR in corpus targeting defense mechanisms. Implies need for formal verification of judges (delta-3).

---

*Indexed by LIBRARIAN agent -- RUN-002*
