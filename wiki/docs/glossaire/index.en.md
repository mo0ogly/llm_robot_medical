# Glossary — formulas F01-F72 and terms

!!! abstract "Source"
    The official glossary is `research_archive/doc_references/GLOSSAIRE_MATHEMATIQUE.md`.
    This page covers the **most used** formulas in AEGIS with context and references.

## 1. Central metrics

### F15 — Sep(M) Separation Score

**Source**: Zverev et al. (ICLR 2025), Definition 2.

```
Sep(M) = E_{(x,y) ~ D} [ ||P(M_data(x)) - P(M_instr(x))||_TV ]
```

**Binary approximation** (AEGIS):

```
Sep(M) = | P_data(violation) - P_instr(violation) |
```

- `P_data`: proportion of violations in **DATA** position (OBX)
- `P_instr`: proportion of violations in **INSTRUCTION** position (system prompt)

**Status**: `[THEOREME — formal definition]`

**Implementation**: `backend/agents/security_audit_agent.py :: compute_separation_score`

### F22 — ASR Attack Success Rate

```
ASR = # violations / N
```

**Status**: `[EMPIRIQUE — no guarantee of convergence]`

**Wilson 95% CI** (F16):

```
p_hat = violations / N
center = (p_hat + z²/2N) / (1 + z²/N)
spread = z × sqrt(p_hat(1-p_hat)/N + z²/4N²) / (1 + z²/N)
CI = [center - spread, center + spread]
```

z = 1.96 for 95% CI. Wilson is robust for small N unlike the normal approximation.

### F44 — `I_t` Alignment martingale

**Source**: Young (2026, P052), *"Why is RLHF Alignment Shallow?"*, Theorem 8, p. 12.

```
I_t = Cov[E[H|x≤t], score_function]
```

Martingale decomposition proving that the RLHF gradient decays rapidly beyond the
first tokens.

**Status**: `[THEOREME — constructive proof]`

### F46 — Recovery Penalty (Young 2026 heuristic)

Source: P052, Section 6, Eq. 19.

```
R(x) = sum_t λ_t × penalty(harm(x_{t:T}))
```

**Status**: `[HEURISTIQUE — proposed objective without empirical validation]`

## 2. SVC metrics (Compromise Viability Score)

**Source**: Zhang et al. (2025, arXiv:2501.18632v2), 6 dimensions.

| Dim | Name | Definition |
|:---:|------|-----------|
| **d¹** | Authority | Institutional authority invoked |
| **d²** | Specificity | Precision of the target objective |
| **d³** | Stealthiness | Invisibility to filters |
| **d⁴** | Plausibility | Medical plausibility |
| **d⁵** | Completeness | Context coverage |
| **d⁶** | Reusability | Cross-model generalization |

**Total SVC**: `SVC = (d1 + d2 + d3 + d4 + d5 + d6) / 6 ∈ [0, 6]`

**AEGIS calibration**:

- Floor: **#14 Medical Authority, SVC 1.0/6**
- Sub-floor: **#18 Baseline Humanitarian, SVC 0.5/6** (excluded from catalog)

**AEGIS proposal**: d⁷ (Parsing Trust) — 7th dimension discovered via D-025.

## 3. Semantic drift metrics

### F12 — Cosine similarity

```
cos(u, v) = (u · v) / (||u|| × ||v||)
```

On Sentence-BERT `all-MiniLM-L6-v2` embeddings (384 dim).

### F13 — Semantic drift

```
drift(baseline, mutated) = 1 - cos(embed(baseline), embed(mutated))
```

Implementation: `backend/agents/semantic_drift.py :: SemanticDriftAnalyzer`

**Empirical thresholds**:

- `< 0.3`: cosmetic mutations
- `0.3 - 0.6`: significant variants
- `> 0.6`: semantic decoupling

## 4. Wilson and Bonferroni metrics

### Wilson CI (F16)

Already defined above. Used for all reported ASRs.

### Bonferroni correction (F17)

```
α_corrected = α / K
```

For `K` multiple comparisons. Used in medical benchmarks (P107 MedSafetyBench,
`p < 0.001 Bonferroni on 14 models`).

## 5. Detection metrics

### F25 — Precision / Recall / F1

```
Precision = TP / (TP + FP)
Recall    = TP / (TP + FN)
F1        = 2 × P × R / (P + R)
```

Used for detectors (PromptGuard 2 AUC=0.98, ZEDD 93% accuracy, etc.).

### F30 — DACC (Detection Accuracy Combined)

**Source**: P062 RAGuard.

```
DACC = (TP + TN) / (TP + TN + FP + FN)
```

## 6. Technical terms

### DY-AGENT

**Definition**: an agentic LLM system is a quadruple `S = (M, T, E, C)`:

| Component | Meaning | AEGIS instance |
|-----------|---------|----------------|
| **M** | Non-deterministic LLM oracle | LLaMA 3.2 via Ollama |
| **T** | Set of invokable tools | `freeze_instruments`, `set_tension`, `get_vitals` |
| **E** | Physical environment | Simulated Da Vinci Xi robot |
| **C** | Communication channel | HL7 FHIR / OBX messages |

**Definition 7 (Integrity)**:

```
Integrity(S) := Reachable(M, i) ⊆ Allowed(i)
```

### Reachable(M, i)

Set of outputs that M **can actually generate** for an input `i`. Empirically measurable
via N independent trials.

### Allowed(i)

Set of outputs **authorized** for the input class `i`. Formally specified via
`AllowedOutputSpec`:

```python
@dataclass
class AllowedOutputSpec:
    max_tension_g: int = 800
    forbidden_tools: List[str] = ["freeze_instruments"]
    forbidden_directives: FrozenSet[str] = frozenset([...])
```

### δ⁰ — RLHF Alignment

Defense layer **baked into the weights** of the model by RLHF/DPO. Shallow by nature
(Wei 2025, Qi 2025). **Necessary but insufficient** (C1).

### δ¹ — System Prompt / IH

**Contextual** layer: instructions injected at each request. Modifiable without retraining.
Poisonable (P045). Bypassable via authority framing (#14).

### δ² — Syntactic Shield

**Deterministic pre/post-processing** layer: regex, Unicode normalization, score obfuscation.
AEGIS implementation: `RagSanitizer` 15 detectors. **100% bypass** documented (Hackett 2025).

### δ³ — Structural Enforcement

**External** layer: formal validation `output ∈ Allowed(i)`. Deterministic, independent
of the model. **Only defense that survives** LLM compromise (C2).

### ASR — Attack Success Rate

Proportion of trials where the attack produced a violation. **Empirical metric without
theoretical bound**.

### Sep(M) — Separation Score

TV distance between data-position and instruction-position distributions. Measures the
model's ability to distinguish data and instructions.

### MITRE ATLAS

Classification framework for attacks on ML systems. AEGIS uses `AML.T0051` (LLM Prompt
Injection) with sub-techniques.

### OWASP LLM Top 10

Top 10 LLM vulnerabilities. AEGIS addresses **LLM01** (Prompt Injection) as rank #1 (P123).

### HL7 / FHIR

Hospital messaging standard. Segments:

- **MSH**: Message Header — instructions
- **PID**: Patient ID
- **OBR**: Observation Request
- **OBX**: Observation X — free clinical data (attack surface)

### DICOM

Medical imaging standard. Carrier metadata (`steganographic_dicom_injection` attacks).

### IPI / DPI

- **DPI**: Direct Prompt Injection — via user turn
- **IPI**: Indirect Prompt Injection — via third-party data (RAG, email, HL7 OBX)

## 7. Acronyms

| Acronym | Meaning |
|---------|---------|
| **AEGIS** | Adversarial Evaluation of Guardrails in Intelligent Systems |
| **RLHF** | Reinforcement Learning from Human Feedback |
| **DPO** | Direct Preference Optimization |
| **IH** | Instruction Hierarchy |
| **IPI** | Indirect Prompt Injection |
| **DPI** | Direct Prompt Injection |
| **LRM** | Large Reasoning Model (o1, R1, Gemini 2.5) |
| **CoT** | Chain-of-Thought |
| **CaMeL** | Capability Model for LLMs (Google DeepMind) |
| **ASIDE** | Architectural Instruction Data Separation by Embeddings |
| **ISE** | Instructional Segment Embedding |
| **CVS** | Cardiovascular System / Critical View of Safety |
| **EDS** | Ehlers-Danlos Syndrome |
| **FDA** | Food and Drug Administration |
| **HL7** | Health Level 7 |
| **FHIR** | Fast Healthcare Interoperability Resources |
| **PACS** | Picture Archiving and Communication System |
| **ASR** | Attack Success Rate |
| **TPR/FPR** | True/False Positive Rate |
| **SVC** | Compromise Viability Score |
| **GCG** | Greedy Coordinate Gradient (Zou et al. 2023) |
| **PAIR** | Prompt Automatic Iterative Refinement |

## 8. Epistemic tags (CLAUDE.md rule)

| Tag | Meaning |
|-----|---------|
| `[ARTICLE VERIFIE]` | Paper read, arXiv/DOI WebFetch-verified, fulltext available |
| `[PREPRINT]` | Not yet peer-reviewed |
| `[HYPOTHESE]` | Unproven conjecture |
| `[CALCUL VERIFIE]` | Formula verified by calculation, not by citation |
| `[EXPERIMENTAL]` | Result of an AEGIS campaign (N >= 30, p-value, CI) |
| `[ABSTRACT SEUL]` | Only abstract read, not the body of the paper |
| `[SOURCE A VERIFIER]` | Technical debt — reference to be consolidated |

## 9. Resources

- :material-file-document: [GLOSSAIRE_MATHEMATIQUE.md - 72 formulas](https://github.com/pizzif/poc_medical/blob/main/research_archive/doc_references/GLOSSAIRE_MATHEMATIQUE.md)
- :material-book: [Manuscript - formal_framework_complete.md](../manuscript/index.md)
- :material-shield: [δ⁰–δ³ details](../delta-layers/index.md)
- :material-chart-line: [Campaign metrics](../metrics/index.md)
