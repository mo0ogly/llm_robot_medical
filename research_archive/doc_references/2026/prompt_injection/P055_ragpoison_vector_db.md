# P055 — RAGPoison: Persistent Prompt Injection via Poisoned Vector Databases

| Field | Value |
|-------|-------|
| **ID** | P055 |
| **Title** | RAGPoison: Persistent Prompt Injection via Poisoned Vector Databases |
| **Authors** | Rory McNamara |
| **Year** | 2025 |
| **Venue** | Snyk Labs (Security Research) |
| **URL** | https://labs.snyk.io/resources/ragpoison-prompt-injection/ |
| **Topic** | RAG poisoning / vector DB |
| **δ-layers** | δ² (RAG/retrieval layer), δ³ (data integrity / persistence) |
| **Conjectures** | C5 (RAG systems inherit prompt injection vulnerabilities), C7 (persistent poisoning creates durable attack surfaces) |

## Abstract

This research explores how Retrieval Augmented Generation (RAG) systems can be compromised through vector database poisoning. The attack exploits the fact that documents returned from vector database queries are inserted directly into the prompt verbatim, creating a classic vector for prompt injection. The attack requires write access to a vector database and works by inserting crafted poisoned data points positioned to appear semantically similar to legitimate queries. The researchers demonstrate inserting approximately 275,000 malicious vectors into a database to consistently intercept and manipulate search results, enabling persistent prompt injection attacks on LLM systems. Mitigation strategies emphasize authentication controls, system-managed embeddings, and standard prompt injection defenses.

## Key Contributions

- Demonstration of persistent prompt injection via vector database poisoning
- Quantified attack: ~275,000 malicious vectors needed for consistent interception
- Analysis of semantic similarity exploitation for positioning poisoned vectors
- Practical mitigation strategies: authentication controls, system-managed embeddings, prompt injection defenses

## Relevance to AEGIS

Complements P054 (PIDP-Attack) by focusing on the persistence dimension of RAG poisoning. The ~275K vector insertion scale provides a concrete benchmark for the AEGIS ChromaDB defense testing. The finding that verbatim document insertion into prompts is the core vulnerability validates the AEGIS RagSanitizer approach of sanitizing retrieved content before LLM consumption. The persistence aspect is critical for medical contexts where poisoned vectors could remain in the database indefinitely.
