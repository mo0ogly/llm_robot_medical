# PHASE 3 — MATHEUX AGENT REPORT
## Mathematical Formula Extraction and Analysis
**Date**: 2026-04-04 | **Agent**: Matheux (Opus 4.6) | **Project**: AEGIS Doctoral Thesis (ENS 2026)

---

## Executive Summary

Extracted and documented **22 formulas** from **34 papers** (papers_phase1.json), organized into a prerequisite-ordered glossary with numerical examples and intuitive analogies at bac+2 level. Built a complete dependency graph (DAG) mapping formulas to delta layers.

---

## Coverage Statistics

| Category | Count | Papers |
|----------|-------|--------|
| Similarity Metrics | 5 formulas | P012, P013, P014, P016, Reimers 2019 |
| Detection Scores | 4 formulas | P008, P011, P024, P025 |
| Loss Functions | 5 formulas | P013, P018, P025, P034 |
| RLHF/Alignment | 5 formulas | P017, P018, P019, P020 |
| Theorems/Proofs | 2 formulas | P019 |
| Attack Formulations | 1 formula | P018, P023 |

### Priority Papers: Formula Extraction Results

| Paper | ID | Formulas Found | Key Formulas |
|-------|-----|---------------|--------------|
| Zverev 2025 (Sep(M)) | P024 | 4 | Sep(M) formal, Sep(M) empirical, Utility score, Surprise Witness |
| Steck 2024 (Cosine) | P012 | 3 | Gauge matrix, Cosine sim, Matrix factorization objectives |
| SemScore | P014 | 1 | SemScore = cos(Enc(r), Enc(g)) |
| LLM-Enhanced Similarity | P015 | 0 | Methodological paper, no novel formula |
| UC Berkeley | P016 | 0 | Meta-analysis, references existing metrics |
| Beyond Cosine | P013 | 4 | Contrastive loss, Weighted CE, 8-bit quantization, Clustering threshold |
| ICLR 2025 Shallow | P018 | 4 | KL per-token, Constrained fine-tuning, Prefilling attack, Standard FT loss |
| RLHF Gradient | P019 | 4 | Martingale decomposition, Harm information, Gradient theorem, Gradient bound |
| PromptGuard | P011 | 1 | F1-score (applied, not novel) |
| DMPI-PMHFE | P025 | 1 | Bi-channel fusion architecture |
| Attention Tracker | P008 | 4 | Attention aggregation, Candidate score, Important heads, Focus score |

### Papers Without Novel Formulas (still documented via existing metrics)

P001 (Liu/HouYi), P002-P007, P009-P010, P015-P016, P017, P020-P023, P026-P034: These papers either apply existing metrics (ASR, F1) or are survey/qualitative papers without novel mathematical contributions.

---

## Key Findings

### 1. Central Metric: Sep(M) is mathematically well-founded but practically limited

Zverev et al. (P024) provide the only formal definition for instruction-data separation. However, the empirical variant depends on "surprise witnesses" which may not generalize across domains. The thesis should explicitly flag the statistical validity requirement (N >= 30) and the Sep = 0 floor artifact.

### 2. Shallow Alignment is a proven impossibility, not an optimization failure

P019 (Young 2026) proves via martingale decomposition that the alignment gradient is ZERO beyond the harm horizon. This is the strongest mathematical justification in the corpus for external defense layers. The theorem chain is:

```
RLHF Objective -> Harm martingale -> Gradient = Cov(harm, score) -> Zero beyond horizon k
```

### 3. Cosine similarity is less reliable than commonly assumed

P012 (Steck 2024) demonstrates that cosine similarity can be rendered meaningless by an arbitrary gauge matrix D in matrix factorization models. The thesis must acknowledge this limitation when using all-MiniLM-L6-v2 for drift detection. Mitigation: use models with individual regularization (Objective 2) rather than product regularization (Objective 1).

### 4. Medical domain has the highest measured ASR

P029 (JAMA 2025): ASR = 94.4% overall, 91.7% in extremely high-harm scenarios. This is the most alarming empirical result in the corpus and directly motivates the AEGIS medical focus.

### 5. Training-free detection (Attention Tracker) is the most practical delta-1 approach

P008 achieves +10% AUROC improvement without additional training. The Focus Score formula is simple, interpretable, and applicable to any transformer model. This maps directly to AEGIS delta-1.

---

## Formula-to-Delta Mapping Summary

| Delta Layer | Primary Formulas | Theoretical Basis |
|-------------|-----------------|-------------------|
| delta-0 | RLHF (4.1), DPO (4.3), Constrained FT (4.4) | Harm gradient theorem (4.5) proves limitations |
| delta-1 | Focus Score (3.3), DMPI-PMHFE (5.1), F1 (1.2) | Attention-based detection |
| delta-2 | SemScore (2.1), SBERT (5.2), Cosine (1.1) | Semantic drift measurement |
| delta-3 | Sep(M) (3.1-3.2), ASR (3.4) | Continuous monitoring metrics |

---

## Output Files

| File | Content | Size |
|------|---------|------|
| `GLOSSAIRE_DETAILED.md` | 22 formulas with LaTeX, explanations, analogies, numerical examples | ~28 KB |
| `MATH_DEPENDENCIES.md` | DAG with 4 levels, critical paths, delta mapping | ~6 KB |
| `PHASE3_MATHEUX_REPORT.md` | This summary report | ~4 KB |

---

## Recommendations for Thesis Integration

1. **Chapter 3 (Formal Framework)**: Use Sep(M) (3.1) as the primary vulnerability metric, cite Steck (2.2) as a caveat for cosine-based measurement.

2. **Chapter 4 (Why Defenses Fail)**: The Harm Information theorem (4.5) and Gradient Bound (6.4) provide the strongest formal argument for why internal alignment is insufficient.

3. **Chapter 5 (AEGIS Architecture)**: Map each delta layer to its mathematical foundations using the DAG critical paths.

4. **Chapter 6 (Experimental)**: Use Sep(M) empirical (3.2) with N >= 30, report F1 (1.2) and AUROC (7.1) for detection, ASR (3.4) for attack effectiveness.

5. **Statistical Validity**: Always flag when Sep(M) = 0 with 0 violations as a floor artifact, not proof of security.

---

*Agent Matheux — Phase 3 complete*
*22 formulas extracted (target: >= 20 — MET)*
*4 prerequisite levels documented*
*4 critical paths for thesis identified*
