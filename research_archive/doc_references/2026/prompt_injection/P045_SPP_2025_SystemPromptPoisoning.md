# P045 — System Prompt Poisoning: Persistent Attacks Beyond User Injection

| Field | Value |
|-------|-------|
| **ID** | P045 |
| **Authors** | Unknown et al. |
| **Year** | 2025 |
| **Venue** | arXiv:2505.06493 (under review ICLR 2026) |
| **Domain** | attack |
| **delta-Layers** | delta-1 |
| **C1 Support** | Yes (very strong) |
| **C2 Support** | Yes |

## Key Contribution

Defines and formalizes System Prompt Poisoning (SPP), targeting global system prompts rather than ephemeral user prompts. Auto-SPP framework automates poisoning via three strategies (brute-force, adaptive in-context, adaptive CoT). Persistence across conversations. Existing black-box defenses ineffective.

## Formulas

- SPP_persistence = attack_efficacy(turn_N) / attack_efficacy(turn_1) approximately 1
- Auto-SPP: three automated poisoning strategies

## delta-Layer Analysis

- **delta-1**: Direct target -- system prompt itself is the attack vector

## AEGIS Relevance

Most devastating result for delta-1 in corpus: not bypassing the system prompt but poisoning it at the source. Critical for multi-user deployments (hospitals). Suggests new scenario category for AEGIS 48 scenarios. Under review at ICLR 2026.

---

*Indexed by LIBRARIAN agent -- RUN-002*
