# P056 — Stronger Enforcement of Instruction Hierarchy via Augmented Intermediate Representations

| Field | Value |
|-------|-------|
| **ID** | P056 |
| **Title** | Stronger Enforcement of Instruction Hierarchy via Augmented Intermediate Representations |
| **Authors** | Sanjay Kariyappa (NVIDIA), G. Edward Suh (NVIDIA) |
| **Year** | 2025 |
| **Venue** | arXiv:2505.18907v2 [cs.AI] |
| **URL** | https://arxiv.org/html/2505.18907v2 |
| **Topic** | Instruction hierarchy |
| **δ-layers** | δ⁰ (base alignment), δ¹ (instruction privilege enforcement) |
| **Conjectures** | C4 (instruction hierarchy is enforceable at intermediate layers), C1 (input-layer-only signals are insufficient) |

## Abstract

Prompt injection attacks are a critical security vulnerability in large language models (LLMs), allowing attackers to hijack model behavior by injecting malicious instructions within the input context. Recent defense mechanisms have leveraged an Instruction Hierarchy (IH) signal to denote the privilege level of input tokens. However, these prior works typically inject the IH signal exclusively at the initial input layer, which limits its ability to effectively distinguish the privilege levels of tokens as it propagates through the different layers of the model. The authors propose AIR (Augmented Intermediate Representations), which injects IH signals into intermediate token representations across all network layers rather than just at input. Evaluations show 1.6x to 9.2x reduction in attack success rate on gradient-based prompt injection attacks compared to state-of-the-art methods, without significantly degrading the model's utility.

## Key Contributions

- AIR method: injection of Instruction Hierarchy signals into intermediate representations across all network layers
- 1.6x to 9.2x reduction in attack success rate vs. state-of-the-art defenses
- Preservation of model utility despite stronger enforcement
- Evidence that input-layer-only IH signals degrade through transformer layers
- Practical defense applicable to gradient-based prompt injection attacks

## Relevance to AEGIS

Provides a concrete defense mechanism that maps to the AEGIS δ¹ layer (instruction-level protection). The finding that input-layer-only IH signals are insufficient directly supports the AEGIS multi-layer defense thesis. The 1.6x-9.2x reduction range provides benchmarkable defense effectiveness metrics. AIR could be evaluated as a δ¹ defense technique in the AEGIS defense taxonomy (currently 66 techniques, 40 implemented). The intermediate-layer injection approach complements the AEGIS RagSanitizer (δ² layer) for a full-stack defense.
