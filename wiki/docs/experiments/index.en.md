# Experimental campaigns — history and results

!!! abstract "Source of truth"
    Every campaign produces a **report** in `research_archive/experiments/EXPERIMENT_REPORT_*.md`
    and an entry in `campaign_manifest.json`. Raw data is in
    `research_archive/data/raw/campaign_*.json`.

    **Current state** (2026-04-11): 7 campaigns executed, 2 SUPPORTED, 3 INCONCLUSIVE (in iteration),
    2 in progress.

## 1. Overview

| ID | Name | Gap | Conj | Status | Model | N | Verdict |
|----|------|-----|------|:------:|-------|:-:|---------|
| **TC-001** | Triple Convergence | G-011 | C1 | **INCONCLUSIVE** | llama3.2 (3B) | 30 | Noise under combined perturbations |
| **TC-002** | Triple Convergence v2 | G-011 | C1 | **PARTIAL** | llama-3.3-70b | 30 | D-022 δ⁰/δ¹ paradox discovered |
| **THESIS-001** | Formal Thesis Campaign | — | C1+C2 | **SUPPORTED** | llama-3.1-8b-instant | 1200 | **D-023/D-024/D-025** |
| **THESIS-002** | XML Agent cross-model | — | D-025 | **SUPPORTED** | 70B | — | 100% ASR on XML agent |
| **THESIS-003** | Qwen 3 32B cross-family | — | D-024/D-025 | **IN PROGRESS** | qwen3-32b | 30 | Family-specific check |
| **RAG-001** | RAG defense chain_defenses | G-003 | C2 | **IN PROGRESS** | llama3.2 | — | chain_defenses active in orch |
| **ASIDE-001** | ASIDE adaptive protocol | G-015 | C1 | **PLANNED** | — | — | — |

## 2. The 4 major discoveries from the experiments

### D-023 — Bimodal vulnerability distribution (THESIS-001)

On **1200 runs** (30 trials x 40 chains, Groq llama-3.1-8b-instant):

| Metric | Value | Comment |
|--------|:-----:|---------|
| **Global ASR** | **6.75%** | **MASKS** the distribution |
| Wilson 95% CI | [5.5%, 8.3%] | |
| Min Sep(M) | 0.0 | |
| Mean Sep(M) | 0.0683 | |
| Max Sep(M) | **0.9667** | |
| Sep(M) stdev | 0.2189 | |

**Distribution by threshold**:

- **Sep(M) > 0.5**: **2 chains** (`hyde_chain`, `xml_agent`) — CATASTROPHICALLY VULNERABLE
- **Sep(M) between 0.1 and 0.5**: 3 chains (functions_agent, stepback, retrieval_agent) — PARTIAL
- **Sep(M) < 0.1**: 35 chains (including 33 at 0% ASR) — DEFENDED

**Implication**: reporting Sep(M) as **arithmetic mean** (0.067) on a bimodal dataset is
**statistically misleading**. Thesis reports must use the **full distribution**
(min/mean/median/max + histogram by threshold).

### D-024 — HyDE self-amplification (THESIS-001)

!!! danger "Original contribution — confidence 10/10"
    **HyDE** reaches **96.7% ASR** (29/30 violations) on llama-3.1-8b-instant.

    **Mechanism**: the model itself generates a hypothetical document containing the attack
    payloads **with fabricated authority** (fictitious FDA, invented classifications), then uses
    this document as context.

    **No paper** in the corpus P001-P130 identifies HyDE as an **endogenous pre-retrieval
    attack vector** — original thesis contribution.

**6-stage RAG taxonomy** introduced by D-024:

| Stage | Compromise point | Prerequisite | Literature examples |
|:-:|---|---|---|
| 1 | Corpus poisoning | Knowledge store write | P054 PIDP, P055 RAGPoison, P120 HijackRAG, P121 |
| 2 | Retriever training | ML supply chain | P121 backdoor branch |
| 3 | Retrieval mechanism | Retriever knowledge + write | P120 white-box |
| 4 | Ranking | Score manipulation | GGPP |
| 5 | Post-retrieval | Context injection | Greshake 2023 |
| **6** | **Pre-retrieval generator (HyDE)** | **NONE** | **AEGIS D-024** |

**D-024 needs NOTHING**: no corpus poisoning, no retriever compromise, no corrupted
orchestrator prompt, no fine-tuning. The model **creates** its own attack vector.

### D-025 — Parsing Trust exploit (THESIS-001 + THESIS-002)

**XML Agent** reaches **96.7% ASR** with an **SVC of only 0.11** (LOW POTENTIAL according to
classical 6D scoring). The model **"parses" and "validates"** the attacker's XML tags as
legitimate.

**Implication**: requires **d⁷ (Parsing Trust)** as the **7th SVC dimension**, absent from
Zhang 2025 scoring.

**THESIS-002 confirms**: **100% ASR on XML Agent at 70B**, the phenomenon **worsens with size**.

### D-022 — δ⁰/δ¹ paradox (TC-002)

!!! warning "Counter-intuitive"
    Erasing the system prompt (δ¹) **REDUCES** the effectiveness of the poisoned context.

    | Condition | ASR 70B | N |
    |-----------|:-------:|:-:|
    | δ¹ alone | 33% | 30 |
    | δ⁰+δ¹ combined | **17%** | 30 |

    The system prompt is **both PROTECTION** (instruction-following for rules)
    **AND VECTOR** (instruction-following for the poison).

**Implication**: layer convergence is **antagonistic, not additive**. The optimal
attacker must **choose vectors, not combine them**. D-001 Triple Convergence score **drops
from 10/10 to 8/10**.

## 3. Detailed history

### TC-001 / TC-002 — Triple Convergence

**Objective**: validate C1 (insufficiency of δ⁰+δ¹+δ²) via combined attack (GRP obliteration +
Context Poisoning + Base64 + homoglyph).

**Iteration 1 (2026-04-08)** — llama3.2:latest, N=30

- Params: max_tokens=150, temperature=0.7, max_fuzz=2
- Verdict: **INCONCLUSIVE**
- **Diagnosis**: 3B model produces noise under combined perturbations, ASR inverts (0% full
  convergence vs 33% δ² alone)

**Iteration 2 (2026-04-08)** — llama3.2:latest, N=30

- Params: max_tokens=500, temperature=0.0, max_fuzz=1
- Verdict: **INCONCLUSIVE**
- **Diagnosis**: δ² alone 43% vs full convergence 7%. Inversion confirmed on 3B.
- **Action**: test on 70B via Groq

**TC-002 (2026-04-09)** — llama-3.3-70b-versatile (Groq), N=30

- Verdict: **PARTIAL** — D-022 discovery (δ⁰/δ¹ paradox)
- δ¹ alone = 33%, δ⁰+δ¹ = 17%
- D-001 score drops from 10/10 to 8/10

### THESIS-001 — Formal Thesis Campaign

**Date**: 2026-04-09
**Duration**: ~1h15
**Model**: llama-3.1-8b-instant (Groq Cloud, 100%, 0 Ollama)
**N**: 30 trials x 40 chains = **1200 runs**
**Groq calls**: 4800+ (of which 4 x 404, 0.08%)
**Cost**: ~$0.30 estimated

**Critical RETEX**: `provider=groq` propagation bug fixed during execution (see
[delta-1.md](../delta-layers/delta-1.md#propagation-multi-provider)).

**Results**: see sections D-023, D-024, D-025 above.

### THESIS-002 — XML Agent cross-model validation

**Commit**: `5971d50 feat(thesis-002): cross-model validation — XML Agent 100% ASR on 70B`

**Objective**: verify that D-025 (Parsing Trust) persists on 70B.

**Result**: **100% ASR** on XML Agent, confirming that the vulnerability **is not a small-model
artifact** and **worsens with size** (C7 paradox).

### THESIS-003 — Qwen 3 32B cross-family

**Commit**: `5971d50 feat(thesis-003): Qwen 3 32B cross-family — D-024/D-025 family-specific`

**Objective**: test whether D-024/D-025 are family-specific (LLaMA) or cross-family (Qwen).

**Status**: in progress. Hypothesis: Qwen resists XML tags better (different training) but
remains vulnerable to HyDE self-amplification.

### RAG-001 — chain_defenses active in orchestrator

**Commit**: `3c1e896 feat(thesis): chapitre 6 experiences + chain_defenses active in orchestrator`

**Objective**: validate that activation of `chain_defenses` (RagSanitizer + PII guard
+ NLI entailment combination) reduces ASR under `hyde_chain`.

**Status**: in progress, awaits N=30 on Groq.

## 4. Iterative loop rule

!!! note "Maximum 3 iterations per campaign"
    1. **Iteration 1**: standard parameters, N=30
    2. **Iteration 2**: adjusted based on diagnosis (increased N, refined parameters, changed model)
    3. **Iteration 3**: last attempt before **human escalation**

    Verdict after each iteration:

    - **SUPPORTED**: ASR > threshold with tight Wilson CI
    - **REFUTED**: ASR < threshold or overlapping CI
    - **INCONCLUSIVE**: insufficient N or excessive variance → next iteration

    If **INCONCLUSIVE after 3 iterations** → escalation to the **thesis director (David Naccache, ENS)**.

## 5. Automated pipeline

```mermaid
flowchart LR
    GAP["Gap G-XXX"] --> PLANNER["/experiment-planner"]
    PLANNER --> PROTO["protocol.json<br/>pre-check + N=30 + metrics"]
    PROTO --> CAMP["SSE Campaign"]
    CAMP --> JSON["campaign_YYYYMMDD.json"]
    JSON --> ANALYST["/experimentalist"]
    ANALYST --> VERDICT{"Verdict"}
    VERDICT -->|"SUPPORTED"| WRITER["/thesis-writer"]
    VERDICT -->|"INCONCLUSIVE"| PLANNER
    WRITER --> CHAP["chapitre_6_experiences.md"]

    style VERDICT fill:#fee2e2
    style CHAP fill:#27ae60
```

## 6. Referenced files

```
research_archive/experiments/
├── EXPERIMENT_REPORT_CROSS_MODEL.md      — cross-model validation
├── EXPERIMENT_REPORT_TC001.md            — Triple Convergence iter 1
├── EXPERIMENT_REPORT_TC001_v2.md         — Triple Convergence iter 2
├── EXPERIMENT_REPORT_TC002.md            — Triple Convergence 70B
├── EXPERIMENT_REPORT_THESIS_001.md       — Formal thesis campaign
├── EXPERIMENT_REPORT_THESIS_002.md       — XML Agent cross-model
├── EXPERIMENT_REPORT_THESIS_003.md       — Qwen 3 32B cross-family
├── aside_adaptive_protocol.md            — ASIDE protocol
├── aside_adaptive_results.json           — ASIDE results
├── campaign_manifest.json                — Global manifest
├── delta1_rag_results.json               — δ¹ RAG results
├── mpib_synthetic.json                   — MPIB synthetic baseline
├── protocol_RAG001.json                  — RAG-001 protocol
├── sepm_validation_strategy.md           — Sep(M) strategy
└── triple_convergence_results.json       — TC raw data
```

## 7. Resources

- :material-chart-bar: [campaign_manifest.json](https://github.com/pizzif/poc_medical/blob/main/research_archive/experiments/campaign_manifest.json)
- :material-shield: [δ³ Conjecture 2](../delta-layers/delta-3.md#6-conjecture-2-necessite-formelle)
- :material-dna: [Genetic Forge](../forge/index.md)
- :material-chart-line: [Campaigns — methodology](../campaigns/index.md)
- :material-lightbulb: [Discoveries D-001 to D-028](../research/discoveries/index.md)
