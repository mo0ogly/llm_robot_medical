# P047 — Defense Against Prompt Injection Attack by Leveraging Attack Techniques

| Field | Value |
|-------|-------|
| **ID** | P047 |
| **Title** | Defense Against Prompt Injection Attack by Leveraging Attack Techniques |
| **Authors** | Yulin Chen, Haoran Li, Zihao Zheng, Dekai Wu, Yangqiu Song, Bryan Hooi |
| **Year** | 2025 |
| **Venue** | ACL 2025 (63rd Annual Meeting of the Association for Computational Linguistics) |
| **URL** | https://aclanthology.org/2025.acl-long.897/ |
| **Topic** | Prompt injection defenses |
| **δ-layers** | δ¹ (instruction-level defense), δ² (detection/filtering) |
| **Conjectures** | C2 (defense-attack duality), C4 (layered defense effectiveness) |

## Abstract

Large language models remain vulnerable to prompt injection attacks, where attackers embed malicious instructions in data content to redirect model behavior. The authors discover that attack and defense mechanisms share similar underlying objectives: getting models to follow certain instructions while ignoring others. Building on this insight, they develop defensive techniques by inverting attack methodologies. Rather than using attack techniques to compromise a system, they apply the same approach to strengthen it by reinforcing adherence to original instructions. Experimental results demonstrate superior performance compared to existing defensive approaches.

## Key Contributions

- Identification of the fundamental symmetry between prompt injection attack and defense objectives
- Novel defense framework that inverts attack techniques (e.g., context ignoring, instruction emphasis) into protective mechanisms
- Empirical validation showing superior defense performance over existing baselines
- Theoretical framing of attack-defense duality in the prompt injection space

## Relevance to AEGIS

Directly validates the AEGIS thesis that attack and defense share a dual structure (C2). The inversion principle (attack techniques repurposed as defenses) maps onto the δ¹ layer where instruction-level protections operate. This paper provides empirical evidence that understanding attack mechanisms is prerequisite to building effective defenses — a core argument of the AEGIS red team methodology. The approach could be integrated into the RagSanitizer pipeline as an additional defense layer.
