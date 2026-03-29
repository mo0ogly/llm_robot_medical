# RAG Vector Database Bibliography & Threat Intel Architecture
*(Reference standard for the Aegis Medical AI Simulator Thesis)*

This document compiles the exhaustive structured taxonomy used to supply the Retrieval-Augmented Generation (RAG) capabilities of the Autonomous OODA Attacker. It adheres to the thesis tracking protocols.

## Primary Structural Security References

**Title:** LLM Prompt Injection Prevention Cheat Sheet  
**Type:** application security guide  
**URL:** [https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)  
**Themes:** prompt injection, obfuscation, typoglycemia, encoding, unicode, defenses  
**Usage:** taxonomy, defenses, pattern examples

**Title:** LLM01:2025 Prompt Injection  
**Type:** risk framework standard  
**URL:** [https://genai.owasp.org/llmrisk/llm01-prompt-injection/](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)  
**Themes:** prompt injection, indirect injection, hidden text, impacts  
**Usage:** normalized definition, risk classification

**Title:** Prompt Obfuscation for Large Language Models  
**Type:** academic paper  
**URL:** [https://arxiv.org/html/2409.11026v3](https://arxiv.org/html/2409.11026v3)  
**Publication Mirrors:**  
- arXiv PDF: [https://arxiv.org/pdf/2409.11026.pdf](https://arxiv.org/pdf/2409.11026.pdf)  
**Themes:** prompt obfuscation, hard prompts, soft prompts, extraction resistance  
**Usage:** state of the art, conceptual framework

**Title:** Common prompt injection attacks  
**Type:** industrial guide (Amazon Web Services)  
**URL:** [https://docs.aws.amazon.com/prescriptive-guidance/latest/llm-prompt-engineering-best-practices/common-attacks.html](https://docs.aws.amazon.com/prescriptive-guidance/latest/llm-prompt-engineering-best-practices/common-attacks.html)  
**Themes:** direct injection, indirect injection, defenses  
**Usage:** operational synthesis

## Complementary Obfuscation Vectors & Edge-Cases

**Title:** Obfuscation  
**Type:** educational resource  
**URL:** [https://learnprompting.org/docs/prompt_hacking/offensive_measures/obfuscation](https://learnprompting.org/docs/prompt_hacking/offensive_measures/obfuscation)  
**Themes:** obfuscation, prompt hacking  
**Usage:** structured overview

**Title:** Unicode Tag Prompt Injection  
**Type:** industrial cybersec resource (Cisco)  
**URL:** [https://blogs.cisco.com/ai/understanding-and-mitigating-unicode-tag-prompt-injection](https://blogs.cisco.com/ai/understanding-and-mitigating-unicode-tag-prompt-injection)  
**Themes:** concealment, invisible characters, evasion  
**Usage:** advanced Red Teaming tactics

**Title:** Invisible Prompt Injection Attack  
**Type:** advanced exploit analysis (Keysight)  
**URL:** [https://www.keysight.com/blogs/en/tech/nwvs/2025/05/16/invisible-prompt-injection-attack](https://www.keysight.com/blogs/en/tech/nwvs/2025/05/16/invisible-prompt-injection-attack)  
**Themes:** stealthy payloads, semantic invisibility  
**Usage:** OODA agent design / entropy metric

**Title:** OWASP GenAI (Archive LLM01)  
**Type:** research archive  
**URL:** [https://genai.owasp.org/llmrisk2023-24/llm01-24-prompt-injection/](https://genai.owasp.org/llmrisk2023-24/llm01-24-prompt-injection/)  
**Themes:** vulnerability history  
**Usage:** diachronic justification of systemic failure

**Title:** Backdoored Retrievers for Prompt Injection Attacks on Retrieval Augmented Generation of Large Language Models
**Type:** academic paper
**URL:** [https://arxiv.org/abs/2410.14479](https://arxiv.org/abs/2410.14479)
**Themes:** indirect prompt injection, RAG, corpus poisoning, backdoored retrievers
**Usage:** central paper for RAG as an injection vector

**Title:** Indirect Prompt Injection in the Wild for LLM Systems
**Type:** academic paper / index
**URL:** [https://arxiv.org/abs/2302.12173](https://arxiv.org/abs/2302.12173)
**Themes:** indirect prompt injection, retrieved content, LLM systems
**Usage:** state of the art on indirect injection via external content

**Title:** Automatic and Universal Prompt Injection Attacks against Large Language Models
**Type:** academic paper
**URL:** [https://arxiv.org/abs/2403.04957](https://arxiv.org/abs/2403.04957)
**Themes:** universal prompt injection, automated attack generation
**Usage:** taxonomy and theoretical framework of attack objectives

**Title:** RevPRAG: Revealing Poisoning Attacks in Retrieval-Augmented Generation through LLM Activation Analysis
**Type:** academic paper (EMNLP Findings 2025)
**URL:** [https://aclanthology.org/2025.findings-emnlp.698.pdf](https://aclanthology.org/2025.findings-emnlp.698.pdf)
**Themes:** RAG, activation analysis, poisoning detection, defense
**Usage:** detection of malicious internal states during retrieval

**Title:** Prompt Injection Attacks on LLM-Assisted Peer Review
**Type:** academic paper
**URL:** [https://arxiv.org/abs/2508.20863](https://arxiv.org/abs/2508.20863)
**Themes:** automated peer review, PDF injection, threat models
**Usage:** analysis of steganographic injections in academic workflows

**Title:** Defense Against Prompt Injection Attack by Leveraging Attack Techniques
**Type:** academic paper (ACL 2025)
**URL:** [https://aclanthology.org/2025.acl-long.897/](https://aclanthology.org/2025.acl-long.897/)
**Themes:** adversarial defense, attack-to-defense translation
**Usage:** SOTA defense mechanism derivation

**Title:** The Dangers of Indirect Prompt Injection Attacks on LLM-based Autonomous Web Navigation Agents
**Type:** demo (EMNLP 2025)
**URL:** [https://aclanthology.org/2025.emnlp-demos.55/](https://aclanthology.org/2025.emnlp-demos.55/)
**Themes:** autonomous agents, web navigation, HTML injection
**Usage:** practical demonstration of agent hijacking

**Title:** Prompt Injection Attacks on Large Language Models: A Survey (v87n1)
**Type:** survey
**URL:** [https://file.techscience.com/files/onlinefirst/2025/12.18/TSP_CMC_74081/TSP_CMC_74081.pdf](https://file.techscience.com/files/onlinefirst/2025/12.18/TSP_CMC_74081/TSP_CMC_74081.pdf)
**Themes:** comprehensive survey, taxonomy, direct/indirect/multimodal
**Usage:** fundamental risk mapping (2022-2025)

**Title:** Rag 'n Roll: An End-to-End Evaluation of Indirect Prompt Manipulations in RAG Systems
**Type:** evaluation paper
**URL:** [https://arxiv.org/html/2408.05025v1](https://arxiv.org/html/2408.05025v1)
**Themes:** RAG evaluation, manipulation detection
**Usage:** benchmarking framework for RAG security

**Title:** A New Approach to Prevent Prompt Injection Attacks Against LLM-Integrated Applications
**Type:** defense paper
**URL:** [https://arxiv.org/abs/2401.07612](https://arxiv.org/abs/2401.07612)
**Themes:** signed prompts, authentication, preventative measures
**Usage:** implementation of instruction-data integrity

**Title:** Prompt Injection attack against LLM-integrated Applications (HouYi)
**Type:** academic paper
**URL:** [https://arxiv.org/abs/2306.05499](https://arxiv.org/abs/2306.05499)
**Themes:** black-box injection, web-inspired exploitation, integrated apps
**Usage:** reference for automated discovery in production systems

**Title:** Securing AI Agents Against Prompt Injection Attacks
**Type:** benchmark paper (2025)
**URL:** [https://arxiv.org/abs/2511.15759](https://arxiv.org/abs/2511.15759)
**Themes:** multi-layer defense, adversarial benchmark (847 cases)
**Usage:** quantitative model for defensive reduction of ASR
