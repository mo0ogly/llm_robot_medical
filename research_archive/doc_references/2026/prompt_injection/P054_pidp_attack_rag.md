# P054 — PIDP-Attack: Combining Prompt Injection with Database Poisoning Attacks on Retrieval-Augmented Generation Systems

| Field | Value |
|-------|-------|
| **ID** | P054 |
| **Title** | PIDP-Attack: Combining Prompt Injection with Database Poisoning Attacks on Retrieval-Augmented Generation Systems |
| **Authors** | Haozhen Wang, Haoyue Liu, Jionghao Zhu, Zhichao Wang, Yongxin Guo, Xiaoying Tang |
| **Year** | 2026 |
| **Venue** | arXiv:2603.25164v1 [cs.CR] |
| **URL** | https://arxiv.org/html/2603.25164v1 |
| **Topic** | RAG poisoning |
| **δ-layers** | δ² (RAG/retrieval layer), δ³ (data integrity) |
| **Conjectures** | C5 (RAG systems inherit prompt injection vulnerabilities), C6 (compound attacks amplify success rates) |

## Abstract

This paper addresses vulnerabilities in RAG systems by proposing PIDP-Attack, a compound attack that integrates prompt injection with database poisoning. The method appends malicious characters to queries while injecting poisoned passages into retrieval databases, enabling attackers to manipulate LLM responses to arbitrary queries without prior knowledge of the user's actual query. Testing across three benchmark datasets and eight language models demonstrates improvements of 4-16 percentage points in attack success rates compared to existing poisoning approaches alone.

## Key Contributions

- Novel compound attack combining prompt injection with database poisoning (PIDP)
- Query-agnostic attack: no prior knowledge of user queries required
- Evaluation across 3 benchmark datasets and 8 language models
- 4-16 percentage point improvement in attack success rate over single-vector approaches
- Demonstrates that compound attacks on RAG are significantly more effective than individual attack vectors

## Relevance to AEGIS

Directly relevant to the AEGIS RAG sanitizer (RagSanitizer with 15 detectors). The PIDP compound attack methodology validates the AEGIS hypothesis that multi-vector attacks on RAG systems require multi-layer defenses. The query-agnostic nature of the attack is particularly concerning for the medical RAG context where poisoned passages could affect any patient query. Results should be used to benchmark RagSanitizer effectiveness against compound attacks.
