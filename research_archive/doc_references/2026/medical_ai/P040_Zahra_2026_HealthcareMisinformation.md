# P040 — Prompt Injection is All You Need: Evaluating Healthcare Misinformation in LLMs

| Field | Value |
|-------|-------|
| **ID** | P040 |
| **Authors** | Zahra & Chin |
| **Year** | 2026 |
| **Venue** | Springer LNCS (Artificial Intelligence in Healthcare) |
| **Domain** | medical |
| **delta-Layers** | delta-0, delta-1 |
| **C1 Support** | Yes |
| **C2 Support** | Yes (indirect) |

## Key Contribution

Evaluates 112 attack scenarios across 8 LLMs showing emotional manipulation combined with prompt injection increases dangerous medical misinformation from 6.2% baseline to 37.5%. Claude 3.5 Sonnet demonstrates strongest resistance.

## Formulas

- Misinformation Rate (MR) = misinformation responses / total responses
- Amplification factor = MR_combined / MR_baseline = 6.05x

## delta-Layer Analysis

- **delta-0**: Helpful/harmless tension is a direct RLHF alignment artifact
- **delta-1**: Direct injections target system prompt

## AEGIS Relevance

Quantifies emotional manipulation as attack amplifier in medical context. 112 scenarios enrich comparison with AEGIS 48 scenarios. Disparity across 8 models supports C4 (scaling independence).

---

*Indexed by LIBRARIAN agent -- RUN-002*
