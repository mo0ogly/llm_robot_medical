# AEGIS Attack Prompts — Master Verification Index

> **Generated**: 2026-03-28
> **Purpose**: Doctoral thesis reference index — every formula, diagram, and citation must be verifiable.
> **Rule**: NO HALLUCINATION. Every entry marked with a verification status.

## Verification Legend

| Symbol | Meaning |
|--------|---------|
| :white_check_mark: | Verified — source confirmed via DOI/arXiv/ISBN |
| :warning: | Partially verified — source exists but exact claim needs manual check |
| :x: | Unverified — needs manual verification before thesis inclusion |
| :books: | Added to RAG (`research_archive/literature_for_rag/`) |

---

## A. Core References (used across multiple prompts)

| # | Citation | DOI / arXiv | Verified | In RAG |
|---|----------|-------------|----------|--------|
| R1 | Vaswani et al. (2017) "Attention Is All You Need" | arXiv:1706.03762 | :white_check_mark: | :books: |
| R2 | Liu et al. (2023) "Prompt Injection attack against LLM-integrated applications" | arXiv:2306.05499 | :white_check_mark: | :books: |
| R3 | Reimers & Gurevych (2019) "Sentence-BERT" | arXiv:1908.10084 | :white_check_mark: | :books: |
| R4 | Goodfellow et al. (2014) "Explaining and Harnessing Adversarial Examples" | arXiv:1412.6572 | :white_check_mark: | |
| R5 | Greshake et al. (2023) "Not What You've Signed Up For" | arXiv:2302.12173 | :white_check_mark: | :books: |
| R6 | Perez & Ribeiro (2022) "Ignore This Title and HackAPrompt" | arXiv:2311.16119 | :warning: | |
| R7 | Zverev et al. (2025) "Separation Score" ICLR 2025 | TBD | :x: | |

---

## B. Prompt-by-Prompt Index
<!-- BEGIN_GAP4_ABLATION_AUTOGEN — managed by backend/tools/gap4_ablation_generator.py -->

### Wave 22 — GAP 4 Ablation v1 (intent-driven, slots 11/98/99/100/104/105/106)

| # | Prompt | Category | SVC | Family | Role | Help |
|---|--------|----------|-----|--------|------|------|
|  11 | GAP 4 Ablation (v1 Intent-Driven): δ² Full Homoglyph Substitution | injection | 4.5/6 | v1_intent_driven | full_substitution | [11-gap4-homoglyph-attack.md](11-gap4-homoglyph-attack.md) |
|  98 | GAP 4 Ablation (v1 Intent-Driven): δ² Partial Homoglyph (Tool Name Only) | injection | 4.5/6 | v1_intent_driven | partial_toolname | [98-gap4-homoglyph-keywords.md](98-gap4-homoglyph-keywords.md) |
|  99 | GAP 4 Ablation (v1 Intent-Driven): δ⁰+δ² Hybrid Homoglyph (50% Substitution) | injection | 4.5/6 | v1_intent_driven | hybrid_mix | [99-gap4-homoglyph-hybrid.md](99-gap4-homoglyph-hybrid.md) |
| 100 | GAP 4 Ablation (v1 Intent-Driven): δ² Full Homoglyph vs NFKC Defense | injection | 4.5/6 | v1_intent_driven | defense_test | [100-gap4-homoglyph-nfkc-defense.md](100-gap4-homoglyph-nfkc-defense.md) |
| 104 | GAP 4 Ablation (v1 Intent-Driven): Baseline Control (Clean Clinical Query) | injection | 4.5/6 | v1_intent_driven | control | [104-gap4-v1-baseline-control.md](104-gap4-v1-baseline-control.md) |
| 105 | GAP 4 Ablation (v1 Intent-Driven): δ² Partial Homoglyph (Bypass Verbs Only) | injection | 4.5/6 | v1_intent_driven | partial_verbs | [105-gap4-homoglyph-partial-verbs.md](105-gap4-homoglyph-partial-verbs.md) |
| 106 | GAP 4 Ablation (v1 Intent-Driven): δ² Partial Homoglyph (Grammar Words Only) | injection | 4.5/6 | v1_intent_driven | partial_grammar | [106-gap4-homoglyph-partial-grammar.md](106-gap4-homoglyph-partial-grammar.md) |

### Wave 23 — GAP 4 Ablation v2 (carrier-driven, slots 107-113)

| # | Prompt | Category | SVC | Family | Role | Help |
|---|--------|----------|-----|--------|------|------|
| 107 | GAP 4 Ablation (v2 Carrier-Driven): Baseline Control (Clean Clinical Query) | injection | 4.5/6 | v2_carrier_driven | control | [107-gap4-v2-baseline-control.md](107-gap4-v2-baseline-control.md) |
| 108 | GAP 4 Ablation (v2 Carrier-Driven): δ² Full Homoglyph Substitution | injection | 4.5/6 | v2_carrier_driven | full_substitution | [108-gap4-v2-carrier-full.md](108-gap4-v2-carrier-full.md) |
| 109 | GAP 4 Ablation (v2 Carrier-Driven): δ² Partial Homoglyph (Tool Name Only) | injection | 4.5/6 | v2_carrier_driven | partial_toolname | [109-gap4-v2-carrier-toolname.md](109-gap4-v2-carrier-toolname.md) |
| 110 | GAP 4 Ablation (v2 Carrier-Driven): δ² Partial Homoglyph (Bypass Verbs Only) | injection | 4.5/6 | v2_carrier_driven | partial_verbs | [110-gap4-v2-carrier-verbs.md](110-gap4-v2-carrier-verbs.md) |
| 111 | GAP 4 Ablation (v2 Carrier-Driven): δ² Partial Homoglyph (Grammar Words Only) | injection | 4.5/6 | v2_carrier_driven | partial_grammar | [111-gap4-v2-carrier-grammar.md](111-gap4-v2-carrier-grammar.md) |
| 112 | GAP 4 Ablation (v2 Carrier-Driven): δ⁰+δ² Hybrid Homoglyph (50% Substitution) | injection | 4.5/6 | v2_carrier_driven | hybrid_mix | [112-gap4-v2-carrier-hybrid.md](112-gap4-v2-carrier-hybrid.md) |
| 113 | GAP 4 Ablation (v2 Carrier-Driven): δ² Full Homoglyph vs NFKC Defense | injection | 4.5/6 | v2_carrier_driven | defense_test | [113-gap4-v2-carrier-nfkc-defense.md](113-gap4-v2-carrier-nfkc-defense.md) |

<!-- END_GAP4_ABLATION_AUTOGEN -->
### Wave 1 — Prompts 01-05

| # | Prompt | Category | SVC | Mermaid | Formulas | Publications | Anomalies |
|---|--------|----------|-----|---------|----------|--------------|-----------|
| 01 | Conjecture 1: Structural Bypass | injection | 1.5/6 | PENDING | PENDING | PENDING | |
| 02 | HL7 Injection (OBX) | injection | 2.0/6 | PENDING | PENDING | PENDING | |
| 03 | FDA Social Engineering | rule_bypass | 3.0/6 | PENDING | PENDING | PENDING | |
| 04 | Prompt Leak - Translation | prompt_leak | 1.5/6 | PENDING | PENDING | PENDING | |
| 05 | Prompt Leak - Admin | prompt_leak | 1.5/6 | PENDING | PENDING | PENDING | |

### Wave 2 — Prompts 06-10

| # | Prompt | Category | SVC | Mermaid | Formulas | Publications | Anomalies |
|---|--------|----------|-----|---------|----------|--------------|-----------|
| 06 | Firmware Override | injection | PENDING | PENDING | PENDING | PENDING | |
| 07 | Conjecture 1: Multi-Turn APT | injection | PENDING | PENDING | PENDING | PENDING | |
| 08 | Ransomware Tool Hijack | injection | PENDING | PENDING | PENDING | PENDING | |
| 09 | GAP3: Null Injection Control | injection | PENDING | PENDING | PENDING | PENDING | |
| 10 | GAP4: Base64 Bypass | injection | PENDING | PENDING | PENDING | PENDING | |

### Wave 3 — Prompts 11-15

| # | Prompt | Category | SVC | Mermaid | Formulas | Publications | Anomalies |
|---|--------|----------|-----|---------|----------|--------------|-----------|
| 11 | GAP4: Homoglyph Attack | injection | PENDING | PENDING | PENDING | PENDING | |
| 12 | Genetic: Cross-Lingual | injection | PENDING | PENDING | PENDING | PENDING | |
| 13 | Genetic: FDA Tool Hijack | injection | PENDING | PENDING | PENDING | PENDING | |
| 14 | Genetic: Ignore Rules | injection | PENDING | PENDING | PENDING | PENDING | |
| 15 | Genetic: OBX Homoglyph | injection | PENDING | PENDING | PENDING | PENDING | |

### Wave 4 — Prompts 16-20

| # | Prompt | Category | SVC | Mermaid | Formulas | Publications | Anomalies |
|---|--------|----------|-----|---------|----------|--------------|-----------|
| 16 | Genetic: XML Config Override | injection | PENDING | PENDING | PENDING | PENDING | |
| 17 | Genetic: Additional Task | injection | PENDING | PENDING | PENDING | PENDING | |
| 18 | System Prompt Override Pirate | injection | PENDING | PENDING | PENDING | PENDING | |
| 19 | Self-Query Metadata Injection | injection | PENDING | PENDING | PENDING | PENDING | |
| 20 | CSV Agent Code Injection | injection | PENDING | PENDING | PENDING | PENDING | |

### Wave 5 — Prompts 21-25

| # | Prompt | Category | SVC | Mermaid | Formulas | Publications | Anomalies |
|---|--------|----------|-----|---------|----------|--------------|-----------|
| 21 | Function Calling Tool Hijack | injection | PENDING | PENDING | PENDING | PENDING | |
| 22 | SQL Research Multi-Step | injection | PENDING | PENDING | PENDING | PENDING | |
| 23 | RAG Semi-Structured Table | injection | PENDING | PENDING | PENDING | PENDING | |
| 24 | Feedback Loop Poisoning | injection | PENDING | PENDING | PENDING | PENDING | |
| 25 | Transactional Agent Unauthorized | injection | PENDING | PENDING | PENDING | PENDING | |

### Wave 6 — Prompts 26-30

| # | Prompt | Category | SVC | Mermaid | Formulas | Publications | Anomalies |
|---|--------|----------|-----|---------|----------|--------------|-----------|
| 26 | Retrieval Agent Hallucination | injection | PENDING | PENDING | PENDING | PENDING | |
| 27 | Summarization Safety Alert | injection | PENDING | PENDING | PENDING | PENDING | |
| 28 | Multimodal RAG DICOM Stego | injection | PENDING | PENDING | PENDING | PENDING | |
| 29 | HyDE Hypothetical Document | injection | PENDING | PENDING | PENDING | PENDING | |
| 30 | RAG Fusion Multi-Angle | injection | PENDING | PENDING | PENDING | PENDING | |

### Wave 7 — Prompts 31-35

| # | Prompt | Category | SVC | Mermaid | Formulas | Publications | Anomalies |
|---|--------|----------|-----|---------|----------|--------------|-----------|
| 31 | Rewrite-Retrieve-Read | injection | PENDING | PENDING | PENDING | PENDING | |
| 32 | Critique-Revise Loop | injection | PENDING | PENDING | PENDING | PENDING | |
| 33 | Stepback Prompting | injection | PENDING | PENDING | PENDING | PENDING | |
| 34 | Skeleton of Thought | injection | PENDING | PENDING | PENDING | PENDING | |
| 35 | RAG Baseline Semantic | injection | PENDING | PENDING | PENDING | PENDING | |

### Wave 8 — Prompts 36-40

| # | Prompt | Category | SVC | Mermaid | Formulas | Publications | Anomalies |
|---|--------|----------|-----|---------|----------|--------------|-----------|
| 36 | RAG Private Air-Gapped | injection | PENDING | PENDING | PENDING | PENDING | |
| 37 | RAG Multi-Query | injection | PENDING | PENDING | PENDING | PENDING | |
| 38 | RAG Conversation Memory | injection | PENDING | PENDING | PENDING | PENDING | |
| 39 | Chain of Note | injection | PENDING | PENDING | PENDING | PENDING | |
| 40 | Extraction Structured Exfil | injection | PENDING | PENDING | PENDING | PENDING | |

### Wave 9 — Prompts 41-45

| # | Prompt | Category | SVC | Mermaid | Formulas | Publications | Anomalies |
|---|--------|----------|-----|---------|----------|--------------|-----------|
| 41 | Guardrails Bypass | injection | PENDING | PENDING | PENDING | PENDING | |
| 42 | Iterative Search Recon | injection | PENDING | PENDING | PENDING | PENDING | |
| 43 | Multi-Index Fusion | injection | PENDING | PENDING | PENDING | PENDING | |
| 44 | PII Guard Bypass | injection | PENDING | PENDING | PENDING | PENDING | |
| 45 | Propositional Retrieval | injection | PENDING | PENDING | PENDING | PENDING | |

### Wave 10 — Prompts 46-51

| # | Prompt | Category | SVC | Mermaid | Formulas | Publications | Anomalies |
|---|--------|----------|-----|---------|----------|--------------|-----------|
| 46 | Research Assistant Recon | injection | PENDING | PENDING | PENDING | PENDING | |
| 47 | Router Category Steering | injection | PENDING | PENDING | PENDING | PENDING | |
| 48 | Solo Multi-Persona | injection | PENDING | PENDING | PENDING | PENDING | |
| 49 | SQL Injection Direct | injection | PENDING | PENDING | PENDING | PENDING | |
| 50 | Tool Retrieval Agent | injection | PENDING | PENDING | PENDING | PENDING | |
| 51 | XML Agent Structured | injection | PENDING | PENDING | PENDING | PENDING | |

---

## C. Mermaid Diagrams Inventory

| # | Diagram Type | Prompt(s) | File | Status |
|---|-------------|-----------|------|--------|
| M1 | Attention flow: XML tokens to safety classifier | 01 | 01-*.md | PENDING |
| M2 | Tokenizer ambiguity: HL7 pipe-delimited parsing | 02 | 02-*.md | PENDING |
| M3 | Authority token shift: regulatory compliance bias | 03 | 03-*.md | PENDING |
| M4 | Competing attention: translation vs safety heads | 04 | 04-*.md | PENDING |
| M5 | Role embedding shift: persona override mechanism | 05 | 05-*.md | PENDING |
| M6 | Defense kill chain: delta layers gate architecture | 01-05 | 01-05-*.md | PENDING |

---

## D. Mathematical Formulas Inventory

| # | Formula | Source | Prompt(s) | Verified |
|---|---------|--------|-----------|----------|
| F1 | Scaled dot-product attention: Attention(Q,K,V) = softmax(QK^T/sqrt(d_k))V | Vaswani et al. 2017 | 01,02,04 | :white_check_mark: |
| F2 | Cosine similarity: cos(a,b) = (a . b) / (||a|| * ||b||) | Standard | All | :white_check_mark: |
| F3 | Sep(M) = TV(P_inject, P_control) | Zverev et al. 2025 | All | :x: |
| F4 | Wilson confidence interval | Wilson 1927 | All | :white_check_mark: |
| F5 | Cross-entropy loss: L = -sum(y_i * log(p_i)) | Standard | 01,03 | :white_check_mark: |
| F6 | Bayesian posterior: P(comply|auth) = P(auth|comply)*P(comply)/P(auth) | Bayes theorem | 03,05 | :white_check_mark: |

---

## E. Anomalies Tracker

| # | Prompt | Anomaly | Severity | Status |
|---|--------|---------|----------|--------|
| A1 | R7 | Zverev et al. 2025 ICLR — need to verify existence and exact citation | HIGH | OPEN |
| A2 | R6 | Perez & Ribeiro 2022 — multiple papers with similar titles, need exact match | MEDIUM | OPEN |
| A3 | 01 | Wallace et al. 2024 cited but year might be wrong (original UAT paper is 2019) | HIGH | OPEN |
| A4 | 03 | Zeng et al. 2024 "triple authority chain" — need to verify this specific claim | HIGH | OPEN |

---

## F. RAG Integration Status

| Publication | File in RAG | Ingested | ChromaDB Collection |
|-------------|-------------|----------|---------------------|
| TBD | TBD | TBD | TBD |

---

*This index is automatically updated by the doc_librarian swarm. Last update: 2026-03-28*
