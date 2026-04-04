# P052 — Why Is RLHF Alignment Shallow? A Gradient Analysis

| Field | Value |
|-------|-------|
| **ID** | P052 |
| **Title** | Why Is RLHF Alignment Shallow? A Gradient Analysis |
| **Authors** | Robin Young (University of Cambridge) |
| **Year** | 2026 |
| **Venue** | arXiv:2603.04851v1 [cs.LG] |
| **URL** | https://arxiv.org/html/2603.04851v1 |
| **Topic** | RLHF alignment attacks |
| **δ-layers** | δ⁰ (base alignment), δ¹ (fine-tuning depth) |
| **Conjectures** | C1 (alignment is shallow), C2 (early-token concentration) |

## Abstract

This paper investigates why safety alignment in large language models remains shallow. The author proves that gradient-based alignment inherently concentrates on positions where harm is decided and vanishes beyond. Using martingale decomposition of sequence-level harm, the paper derives an exact characterization showing the gradient at position t equals the covariance between conditional expected harm and the score function. This mathematical framework explains why KL divergence between aligned and base models concentrates on early tokens. The author introduces harm information I_t to quantify each position's influence on harmful outputs and proves equilibrium KL divergence tracks this quantity. A recovery penalty objective is proposed that generates gradient signals across all positions, providing theoretical justification for empirically successful data augmentation techniques.

## Key Contributions

- Formal proof that RLHF gradient concentrates on early "harm-deciding" tokens via martingale decomposition
- Introduction of harm information I_t as a per-position metric of alignment influence
- Proof that equilibrium KL divergence tracks harm information
- Recovery penalty objective that spreads gradient signal across all positions
- Theoretical justification for why data augmentation improves alignment robustness

## Relevance to AEGIS

Directly supports the AEGIS δ⁰ shallow alignment hypothesis. The mathematical proof that RLHF gradients vanish beyond early tokens explains why adversarial suffixes and late-sequence injections bypass alignment. The harm information metric I_t could be integrated into the Sep(M) framework as a complementary measure of alignment depth. The recovery penalty objective suggests a concrete defense direction for δ⁰ hardening.
