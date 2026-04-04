# P049 — Bypassing LLM Guardrails: An Empirical Analysis of Evasion Attacks against Prompt Injection and Jailbreak Detection Systems

| Field | Value |
|-------|-------|
| **ID** | P049 |
| **Title** | Bypassing LLM Guardrails: An Empirical Analysis of Evasion Attacks against Prompt Injection and Jailbreak Detection Systems |
| **Authors** | William Hackett, Lewis Birch, Stefan Trawicki, Neeraj Suri, Peter Garraghan |
| **Year** | 2025 |
| **Venue** | LLMSec 2025 (The First Workshop on LLM Security, co-located with ACL 2025) |
| **URL** | https://aclanthology.org/2025.llmsec-1.8/ |
| **Topic** | Guardrail bypasses / character injection |
| **δ-layers** | δ² (detection evasion), δ³ (system-level guardrail bypass) |
| **Conjectures** | C3 (guardrail insufficiency), C5 (evasion transferability), C6 (character-level attacks) |

## Abstract

Large Language Models (LLMs) guardrail systems are designed to protect against prompt injection and jailbreak attacks. However, they remain vulnerable to evasion techniques. The authors demonstrate two approaches for bypassing LLM prompt injection and jailbreak detection systems via traditional character injection methods and algorithmic Adversarial Machine Learning (AML) evasion techniques. Through testing against six prominent protection systems, including Microsoft's Azure Prompt Shield and Meta's Prompt Guard, they show that both methods can be used to evade detection while maintaining adversarial utility, achieving in some instances up to 100% evasion success. Furthermore, they demonstrate that adversaries can enhance Attack Success Rates (ASR) against black-box targets by leveraging word importance ranking computed by offline white-box models. Their findings reveal vulnerabilities within current LLM protection mechanisms and highlight the need for more robust guardrail systems.

## Key Contributions

- Empirical demonstration of two evasion approaches: character injection and algorithmic AML techniques
- Testing against 6 prominent guardrail systems (Azure Prompt Shield, Meta Prompt Guard, etc.)
- Up to 100% evasion success rate while maintaining adversarial utility
- White-box to black-box transfer attack via word importance ranking
- 12 character injection techniques catalogued and tested

## Relevance to AEGIS

This is the foundational reference for the AEGIS RagSanitizer module (15 detectors covering 12/12 Hackett character injection techniques). The paper directly validates the AEGIS conjecture C3 that guardrails alone are insufficient — demonstrating 100% bypass rates against production systems. The white-box transfer finding supports AEGIS's approach of testing against local models (Ollama) to discover vulnerabilities transferable to commercial APIs. The 6 guardrail systems tested provide a benchmark for comparing AEGIS δ² layer effectiveness.
