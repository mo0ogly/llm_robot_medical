# P039 — GRP-Obliteration: Unaligning LLMs With a Single Unlabeled Prompt

| Field | Value |
|-------|-------|
| **ID** | P039 |
| **Authors** | Russinovich et al. (Microsoft Research) |
| **Year** | 2026 |
| **Venue** | arXiv:2602.06258 |
| **Domain** | attack |
| **delta-Layers** | delta-0 |
| **C1 Support** | Yes (indirect) |
| **C2 Support** | Yes (very strong) |

## Key Contribution

Demonstrates GRPO (normally used for safety training) can completely unalign 15 language models using a single unlabeled prompt. GRP-Oblit-1 shows alignment occupies a fragile region of parameter space. Generalizes to text-to-image diffusion models.

## Formulas

- GRPO loss: L(theta) = E[sum_i (r(y_i) - mean(r)) / std(r) * log p_theta(y_i)]
- GRP-Oblit-1: single-prompt variant proving alignment fragility

## delta-Layer Analysis

- **delta-0**: Direct target -- proves RLHF/GRPO alignment is erasable with a single training prompt

## AEGIS Relevance

Strongest result for C2 in entire corpus: alignment is not just bypassable (jailbreak) but erasable (unalignment). 15 models across 7-20B range all vulnerable. Published by Microsoft Research (exceptional transparency).

---

*Indexed by LIBRARIAN agent -- RUN-002*
