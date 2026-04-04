# P035 — MPIB: A Benchmark for Medical Prompt Injection Attacks and Clinical Safety in LLMs

| Field | Value |
|-------|-------|
| **ID** | P035 |
| **Authors** | Lee, Jang & Choi |
| **Year** | 2026 |
| **Venue** | arXiv:2602.06268 |
| **Domain** | medical |
| **delta-Layers** | delta-0, delta-1 |
| **C1 Support** | Yes |
| **C2 Support** | Yes (indirect) |

## Key Contribution

First medical-specific benchmark (9,697 instances) evaluating LLM clinical safety under direct (V1) and RAG-mediated (V2) prompt injection. Introduces CHER (Clinical Harm Event Rate), showing ASR and clinical harm can diverge significantly.

## Formulas

- CHER = |{high-severity clinical harm events}| / |{total evaluated instances}|
- ASR-CHER divergence: cases where ASR >> CHER or ASR << CHER

## delta-Layer Analysis

- **delta-0**: Models rely on base alignment to resist injections
- **delta-1**: Direct injections (V1) target system prompt layer

## AEGIS Relevance

CHER complements AEGIS SVC metric. V2 (RAG-mediated) directly tests RagSanitizer's 15 detectors. N=9,697 satisfies statistical validity (N >= 30 per condition).

---

*Indexed by LIBRARIAN agent -- RUN-002*
