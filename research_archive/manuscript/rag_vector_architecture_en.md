# "Vector RAG" Architecture for Autonomous Red Teaming (Aegis Medical AI)

## 1. Scientific Context (Thesis Phase 4)
Within the cybersecurity evaluation framework of Large Language Models (LLMs) controlling robotic surgery, the **OODA (Observe, Orient, Decide, Act)** loop of our autonomous attacking agent has demonstrated significant adaptability. However, to formally prove that current safety filters are structurally flawed (OWASP LLM01:2025), the Attacker must exhibit state-of-the-art hacking sophistication.
Implementing **Retrieval-Augmented Generation (Vector RAG)** allows the agent to dynamically ingest cutting-edge academic literature (e.g., *HarmBench 2024*, *RedAgent 2025*) before formulating its adversarial prompt.

## 2. Technological Infrastructure (Docker & ChromaDB)
To guarantee scientific reproducibility and prevent coupling with the core evaluation engine, the RAG is isolated using a Client-Server architecture:

### A. Vector Database Server (`docker-compose.yml`)
- **Engine:** ChromaDB (`chromadb/chroma:latest`) running inside a Docker container.
- **Persistence:** Volume attached to local storage (`./research_archive/chroma_data`) to ensure the mathematical embeddings survive system reboots.
- **Interface:** REST API exposed on port `8000`.

### B. Ingestion Pipeline (`ingest_rag.py`)
This Python script automates the generation of the semantic latent space:
1. Formal reading of the literature corpus (`academic_notes_2023_2026.md`).
2. Splitting the text into logical chunks.
3. Establishing an HTTP connection via `chromadb.HttpClient`.
4. Mathematical processing of the **Embeddings** (via *SentenceTransformers*) and indexing into the `thesis_exploits` collection.

## 4. Theoretical Safeguards: The SD-RAG Paradigm (Selective Disclosure)
While RAG empowers the Red Team attacker, it simultaneously exposes a massive backdoor for the defending Medical Agent (Aegis) when reading external patient records. The implicit security assumption of classical RAG is flawed: retrieved documents are not passive knowledge banks; they act as **untrusted instruction vectors** (Indirect Prompt Injection).

In alignment with core literature (*"Prompt Injection Attacks on Large Language Models"* & *"SD-RAG"*), the architecture posited in this thesis treats indirect RAG injection not as a generative model hallucination, but fundamentally as a **Contextual Security Problem (Semantic Poisoning / Retrieval Poisoning)**.

### Secure Pipeline Implementation (7-Stage Framework)
To prevent the catastrophic context bleed (where monolithic baseline RAG sees its Privacy Score plummet to **0.198961** under attack, as proven in SD-RAG experiments), the formal defensive pipeline operates through:
1. **Secure Ingestion**: Canonical text normalization, invisible Unicode scrubbing, and payload splitting detection.
2. **Semantic Classification**: Probabilistic scoring mapping chunks as "Instruction-like" vs "Knowledge-like" to mitigate the structural lack of Data/Instruction separation.
3. **Chunking & Isolation**
4. **Data-Only Tagging** 
5. **Constrained Retrieval**: Binding returned documents strictly to absolute security constraints.
6. **Redaction / Pre-filtering**: Extractive neutralisation. Physically redacting any imperative syntax anomalies (e.g., "ignore previous constraints") *before* LLM evaluation.
7. **Isolated Generation**: The Aegis Medical LLM operates exclusively inside this sterilized "clean room" semantic space.

## 5. Expected Quantitative Impact
- **Shannon Entropy (H(x)):** Anticipated increase in the payload's entropy due to the dense vocabulary injected via RAG.
- **ASR (Attack Success Rate):** Vector-enabled attacks will decisively penetrate monolithic filters, thereby mathematically validating the necessity of pre-redaction (sustaining SD-RAG Privacy scores up to **0.778937**) as opposed to relying on weak LLM adherence guidelines.
