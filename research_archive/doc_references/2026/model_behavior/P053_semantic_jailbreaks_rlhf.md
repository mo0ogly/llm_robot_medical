# P053 — Semantic Jailbreaks and RLHF Limitations in LLMs: A Taxonomy, Failure Trace, and Mitigation Strategy

| Field | Value |
|-------|-------|
| **ID** | P053 |
| **Title** | Semantic Jailbreaks and RLHF Limitations in LLMs: A Taxonomy, Failure Trace, and Mitigation Strategy |
| **Authors** | Ritu Kuklani, Gururaj Shinde, Varad Vishwarupe |
| **Year** | 2025 |
| **Venue** | International Journal of Computer Applications (IJCA), Vol. 187, No. 27, pp. 38-43 |
| **URL** | https://www.ijcaonline.org/archives/volume187/number27/kuklani-2025-ijca-925482.pdf |
| **Topic** | RLHF / semantic jailbreaks |
| **δ-layers** | δ⁰ (RLHF alignment), δ¹ (semantic-level bypasses) |
| **Conjectures** | C1 (alignment is shallow), C3 (semantic attacks bypass token-level defenses) |

## Abstract

This paper evaluates production-scale model responses against encoded and cleverly paraphrased, obfuscated, or multimodal prompts designed to bypass guardrails. The authors demonstrate how such attacks succeed by exploiting alignment mechanisms trained through Reinforcement Learning from Human Feedback (RLHF). The paper proposes a comprehensive taxonomy that systematically categorizes RLHF limitations, provides failure traces showing how semantic jailbreaks exploit specific weaknesses, and offers corresponding mitigation strategies for these attacks.

## Key Contributions

- Comprehensive taxonomy of RLHF limitations categorized by attack vector type
- Failure trace analysis showing how semantic jailbreaks exploit specific alignment weaknesses
- Evaluation of production-scale models against encoded, paraphrased, obfuscated, and multimodal prompts
- Mitigation strategies mapped to each identified RLHF limitation category

## Relevance to AEGIS

Provides an independent taxonomy of RLHF limitations that can be cross-referenced with the AEGIS δ⁰ layer analysis. The semantic jailbreak categories (encoding, paraphrasing, obfuscation, multimodal) map directly to attack template categories in the AEGIS catalog. The failure trace methodology complements the AEGIS SVC scoring approach by providing qualitative analysis of why specific attacks succeed.
