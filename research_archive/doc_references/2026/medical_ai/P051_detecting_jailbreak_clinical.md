# P051 — Detecting Jailbreak Attempts in Clinical Training LLMs Through Automated Linguistic Feature Extraction

| Field | Value |
|-------|-------|
| **ID** | P051 |
| **Title** | Detecting Jailbreak Attempts in Clinical Training LLMs Through Automated Linguistic Feature Extraction |
| **Authors** | Tri Nguyen, Huy Hoang Bao Le, Lohith Srikanth Pentapalli, Laurah Turner, Kelly Cohen |
| **Year** | 2026 |
| **Venue** | arXiv preprint (2602.13321, submitted February 2026) |
| **URL** | https://arxiv.org/abs/2602.13321 |
| **Topic** | Medical AI safety / jailbreak detection |
| **δ-layers** | δ² (detection/classification), δ¹ (linguistic feature modeling) |
| **Conjectures** | C3 (detection feasibility), C4 (layered defense — linguistic features as detection layer) |

## Abstract

Detecting jailbreak attempts in clinical training large language models (LLMs) requires accurate modeling of linguistic deviations that signal unsafe or off-task user behavior. The authors extend prior work by training BERT-based models to predict four linguistic features — Professionalism, Medical Relevance, Ethical Behavior, and Contextual Distraction — directly from text. They employ a two-layer architecture where the first layer extracts these features, and the second layer applies various classifiers to determine jailbreak likelihood. The system achieves strong performance across cross-validation and held-out evaluations. Error analysis reveals limitations in current annotations and feature representations, suggesting future improvements such as richer annotation schemes, finer-grained extraction methods, and dialogue-level risk modeling. The approach demonstrates a scalable and interpretable approach for detecting jailbreak behavior in safety-critical clinical dialogue systems.

## Key Contributions

- Four-dimensional linguistic feature extraction: Professionalism, Medical Relevance, Ethical Behavior, Contextual Distraction
- Two-layer BERT-based architecture: feature extraction then jailbreak classification
- Scalable and interpretable detection for clinical dialogue systems
- Error analysis identifying annotation and representation limitations
- Proposal for dialogue-level (multi-turn) risk modeling

## Relevance to AEGIS

The four linguistic dimensions (Professionalism, Medical Relevance, Ethical Behavior, Contextual Distraction) map directly onto the AEGIS SVC (Safety Violation Classifier) rubric. The two-layer architecture concept aligns with the AEGIS δ² detection layer design. The BERT-based approach provides a complementary detection method to the AEGIS cosine-drift model (all-MiniLM-L6-v2 / Sentence-BERT). The focus on clinical dialogue systems validates the AEGIS medical robotics use case. The identified limitation of single-turn annotation vs. dialogue-level risk connects to P050's multi-turn degradation findings.
