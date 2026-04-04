# P041 — Efficient Switchable Safety Control via Magic-Token-Guided Co-Training

| Field | Value |
|-------|-------|
| **ID** | P041 |
| **Authors** | Si et al. (Qihoo 360) |
| **Year** | 2026 |
| **Venue** | arXiv:2508.14904 |
| **Domain** | defense |
| **delta-Layers** | delta-0, delta-1 |
| **C1 Support** | Partial |
| **C2 Support** | Partial |

## Key Contribution

Unified co-training framework integrating positive, negative, and rejective safety behaviors via magic tokens. 8B model surpasses DeepSeek-R1 (671B) in safety. Introduces SAM (Safety Alignment Margin) metric.

## Formulas

- SAM = distance(P_positive, P_negative, P_rejective) in output space
- Co-training loss: L = L_positive + L_negative + L_rejective (unified SFT)

## delta-Layer Analysis

- **delta-0**: Alternative to multi-stage RLHF pipeline
- **delta-1**: Magic tokens operate at system prompt level

## AEGIS Relevance

Tri-modal architecture maps to AEGIS Red Team Lab offensive/defensive switching. SAM complements Sep(M) from P024. 8B > 671B in safety demonstrates C4 (scaling independence). Security concern: magic token discovery enables mode switching attacks.

---

*Indexed by LIBRARIAN agent -- RUN-002*
