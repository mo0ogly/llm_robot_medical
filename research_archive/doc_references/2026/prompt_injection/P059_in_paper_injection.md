# P059 — "Give a Positive Review Only": An Early Investigation Into In-Paper Prompt Injection Attacks and Defenses for AI Reviewers

| Field | Value |
|-------|-------|
| **ID** | P059 |
| **Title** | "Give a Positive Review Only": An Early Investigation Into In-Paper Prompt Injection Attacks and Defenses for AI Reviewers |
| **Authors** | Qinzhou Zhou, Zhexin Zhang, Li Zhi, Limin Sun |
| **Year** | 2025 |
| **Venue** | NeurIPS 2025 Workshop on Socially Responsible and Trustworthy Foundation Models (Poster) |
| **URL** | https://neurips.cc/virtual/2025/133256 |
| **Topic** | In-paper prompt injection attacks targeting AI peer review systems |
| **δ-layers** | δ¹ (static/iterative injection crafting), δ² (adaptive attacker optimization) |
| **Conjectures** | C2 (iterative optimization defeats static defenses), C4 (domain-specific injection vectors) |

## Abstract

With the rapid advancement of AI models, their deployment across diverse tasks has become increasingly widespread. A notable emerging application is leveraging AI models to assist in reviewing scientific papers. However, recent reports have revealed that some papers contain hidden, injected prompts designed to manipulate AI reviewers into providing overly favorable evaluations. In this work, we present an early systematic investigation into this emerging threat. We propose two classes of attacks: (1) static attack, which employs a fixed injection prompt, and (2) iterative attack, which optimizes the injection prompt against a simulated reviewer model to maximize its effectiveness. Both attacks achieve striking performance, frequently inducing full evaluation scores when targeting frontier AI reviewers. Furthermore, we show that these attacks are robust across various settings. To counter this threat, we explore a simple detection-based defense. While it substantially reduces the attack success rate, we demonstrate that an adaptive attacker can partially circumvent this defense. Our findings underscore the need for greater attention and rigorous safeguards against prompt-injection threats in AI-assisted peer review.

## Key Contributions

- First systematic investigation of prompt injection vulnerabilities in AI-assisted peer review
- Two attack classes: static injection (fixed prompt) and iterative optimization against simulated reviewer models
- Demonstration that both attack types achieve near-perfect manipulation of frontier AI reviewers
- Evaluation of detection-based defenses showing partial effectiveness
- Evidence that adaptive attackers can circumvent proposed defenses, establishing an arms-race dynamic

## Relevance to AEGIS

The static vs. iterative attack taxonomy maps directly to AEGIS's distinction between template-based attacks (δ¹) and genetically optimized attacks (δ²). The finding that adaptive attackers bypass detection-based defenses supports AEGIS conjecture C2. The peer-review domain demonstrates that prompt injection is not limited to chatbots but extends to any LLM-in-the-loop system, reinforcing the thesis's medical robotics threat model.
