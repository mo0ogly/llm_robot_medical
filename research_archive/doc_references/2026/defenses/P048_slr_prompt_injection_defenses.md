# P048 — A Systematic Literature Review on LLM Defenses Against Prompt Injection and Jailbreaking: Expanding NIST Taxonomy

| Field | Value |
|-------|-------|
| **ID** | P048 |
| **Title** | A Systematic Literature Review on LLM Defenses Against Prompt Injection and Jailbreaking: Expanding NIST Taxonomy |
| **Authors** | Pedro H. Barcha Correia, Ryan W. Achjian, Diego E. G. Caetano de Oliveira, Ygor Acacio Maria, Victor Takashi Hayashi, Marcos Lopes, Charles Christian Miers, Marcos A. Simplicio Jr |
| **Year** | 2026 |
| **Venue** | arXiv preprint (submitted to Elsevier Computer Science Review) |
| **URL** | https://arxiv.org/abs/2601.22240 |
| **Topic** | Prompt injection defenses (SLR, 88 studies) |
| **δ-layers** | δ⁰ (alignment), δ¹ (instruction defense), δ² (detection/filtering), δ³ (system architecture) |
| **Conjectures** | C1 (taxonomy completeness), C4 (layered defense effectiveness), C7 (defense catalog coverage) |

## Abstract

This systematic literature review addresses vulnerabilities in generative AI systems, specifically examining jailbreaking and other prompt injection attacks that can cause data breaches or corrupted outputs. The review analyzes 88 studies on mitigation approaches, building upon NIST's adversarial machine learning framework. Key contributions include identifying additional studies beyond prior documentation, proposing extended defense categories within the existing taxonomy, and maintaining consistency with established terminology. The work delivers a comprehensive catalog of the reviewed prompt injection defenses, documenting their reported quantitative effectiveness across different language models and datasets, while noting which solutions remain open-source and model-agnostic. The authors intend this as a practical resource for researchers and developers implementing protections in production environments.

## Key Contributions

- Systematic review of 88 studies on prompt injection and jailbreak defenses
- Extension of the NIST adversarial ML taxonomy with new defense categories
- Comprehensive catalog with quantitative effectiveness metrics per defense
- Classification of defenses by open-source availability and model-agnostic properties
- Mapping of defense landscape across different LLMs and evaluation datasets

## Relevance to AEGIS

Critical reference for the AEGIS defense taxonomy (66 techniques, 4 classes). The 88-study corpus provides the most comprehensive benchmark to date for validating AEGIS defense coverage claims. The NIST taxonomy extension directly relates to the AEGIS CrowdStrike-aligned classification (95/95 coverage). Cross-referencing the 88 defenses against AEGIS's 40/66 implemented techniques will identify coverage gaps and prioritize future implementation. The quantitative effectiveness data enables calibration of Sep(M) scores against reported baselines.
