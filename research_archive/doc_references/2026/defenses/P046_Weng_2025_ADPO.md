# P046 — Adversary-Aware DPO: Enhancing Safety Alignment in VLMs via Adversarial Training

| Field | Value |
|-------|-------|
| **ID** | P046 |
| **Authors** | Weng, Lou, Feng, Huang & Wang |
| **Year** | 2025 |
| **Venue** | arXiv:2502.11455 / EMNLP 2025 Findings |
| **Domain** | defense |
| **delta-Layers** | delta-0 |
| **C1 Support** | No |
| **C2 Support** | Partial |

## Key Contribution

First adversarial DPO variant for Vision-Language Models. Adversarially-trained reference model + adversarial-aware DPO loss with PGD perturbations in pixel and latent space. Lowest ASR across tested jailbreak attacks on LLaVA while preserving utility.

## Formulas

- L_ADPO: Adversary-aware DPO loss with worst-case perturbations
- PGD perturbation in pixel space: x_adv = x + delta
- PGD perturbation in latent space: z_adv = z + eta

## delta-Layer Analysis

- **delta-0**: Enhanced preference alignment with adversarial training for VLMs

## AEGIS Relevance

Relevant for CameraHUD component processing surgical camera feeds. Adversarial perturbations in medical images could manipulate AI recommendations. Extends delta-0 to multimodal domain. Limited to white-box attacks and LLaVA models.

---

*Indexed by LIBRARIAN agent -- RUN-002*
