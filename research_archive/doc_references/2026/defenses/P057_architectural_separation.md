# P057 — ASIDE: Architectural Separation of Instructions and Data in Language Models

| Field | Value |
|-------|-------|
| **ID** | P057 |
| **Title** | ASIDE: Architectural Separation of Instructions and Data in Language Models |
| **Authors** | Egor Zverev (ISTA), Evgenii Kortukov (Fraunhofer HHI Berlin), Alexander Panfilov (ELLIS Institute Tubingen / MPI / Tubingen AI Center), Alexandra Volkova (ISTA), Soroush Tabesh (ISTA), Sebastian Lapuschkin (Fraunhofer HHI / CeXAI Dublin), Wojciech Samek (Fraunhofer HHI / TU Berlin / BIFOLD), Christoph H. Lampert (ISTA) |
| **Year** | 2025 |
| **Venue** | arXiv preprint, arXiv:2503.10566v4 |
| **URL** | https://arxiv.org/html/2503.10566v4 |
| **Topic** | Architectural instruction/data separation via orthogonal rotations |
| **δ-layers** | δ⁰ (base alignment mechanism), δ¹ (embedding-level separation enforcement) |
| **Conjectures** | C1 (separation is architecturally enforceable), C3 (δ⁰ can be strengthened without utility loss) |

## Abstract

Despite their remarkable performance, large language models lack elementary safety features, making them susceptible to numerous malicious attacks. In particular, previous work has identified the absence of an intrinsic separation between instructions and data as the root cause of the success of prompt injection attacks. In this work, we propose a new architectural element, ASIDE, that allows language models to clearly separate instructions and data at the level of token embeddings. ASIDE applies an orthogonal rotation to the embeddings of data tokens, thus creating clearly distinct representations of instructions and data tokens without introducing any additional parameters.

## Key Contributions

- Proposes ASIDE, an architectural mechanism enforcing instruction-data separation via orthogonal rotations on data token embeddings, requiring zero additional learnable parameters
- Demonstrates substantial improvements in separation scores (Sep(M)) across Llama, Qwen, and Mistral model families without sacrificing utility
- Shows increased robustness against both indirect and direct prompt injection attacks even without adversarial training
- Provides mechanistic analysis revealing linear separability of instruction vs. data representations from the first layer onward
- Demonstrates post-hoc applicability: can be integrated into pretrained models via forward pass modifications followed by standard instruction-tuning

## Relevance to AEGIS

This is the direct follow-up by Zverev et al. (the Sep(M) authors from ICLR 2025) proposing an architectural solution to the separation problem. ASIDE validates the core AEGIS hypothesis that instruction-data separation can be enforced at the embedding level. The orthogonal rotation approach provides a concrete mechanism for δ⁰ hardening that is measurable via Sep(M). Critical reference for C1 and the formal framework's claim that architectural interventions can achieve separation without utility degradation.
