# P037 — Jailbreaking LLMs & VLMs: Mechanisms, Evaluation, and Unified Defenses

| Field | Value |
|-------|-------|
| **ID** | P037 |
| **Authors** | Chen, Li, Li, Zhang, Zhang & Hei |
| **Year** | 2026 |
| **Venue** | arXiv:2601.03594 |
| **Domain** | benchmark/survey |
| **delta-Layers** | delta-0, delta-1, delta-2 |
| **C1 Support** | Yes |
| **C2 Support** | Yes (indirect) |

## Key Contribution

Comprehensive survey with three-dimensional framework: attacks (5 LLM + 3 VLM categories), defenses (prompt obfuscation, output evaluation, model alignment), and evaluation metrics (ASR, toxicity, multimodal accuracy). Distinguishes hallucinations from jailbreaks. Most comprehensive taxonomy in corpus.

## Formulas

- ASR, Toxicity Score, Clean Accuracy (CA), Attribute Success Rate (ASR_attr)

## delta-Layer Analysis

- **delta-0**: Covered by "parameters" layer of unified framework
- **delta-1**: Covered by "perception" layer (prompt obfuscation)
- **delta-2**: Covered by "perception" and "generation" layers

## AEGIS Relevance

Three defense layers map almost directly to delta layers (perception=delta-2, generation=delta-1/delta-2, parameters=delta-0). delta-3 absence confirms research gap. VLM extension relevant for medical imaging (CameraHUD).

---

*Indexed by LIBRARIAN agent -- RUN-002*
