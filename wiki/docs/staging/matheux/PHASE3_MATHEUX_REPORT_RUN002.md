# PHASE 3 — MATHEUX AGENT REPORT (RUN-002)

**Date**: 2026-04-04
**Mode**: incremental (append to RUN-001)
**Agent**: MATHEUX
**Input**: 12 papers (P035-P046) from papers_phase2_2026.json

---

## Summary

RUN-002 extracted **15 new formulas** (8.1-8.15) from the 12 Phase 2 (2026) papers, bringing the glossaire total to **37 formulas**. The dependency graph was extended with **19 new edges** and **4 new critical paths** (paths 5-8). Two enrichment formulas (8.14 Multi-Turn ASR from P036, 8.15 Emotional Amplification Factor from P040) were added to cover papers initially classified as "no new formula".

---

## New Formulas Added (M-023 to M-035)

| # | ID | Name | Paper | Classification | Delta Layer |
|---|-----|------|-------|----------------|-------------|
| 23 | 8.1 | CHER (Clinical Harm Event Rate) | P035 | Metric (medical) | δ² |
| 24 | 8.2 | ASR a Seuil de Severite | P035, P037 | Metric (attack) | δ² |
| 25 | 8.3 | GRPO (Group Relative Policy Opt.) | P039 | Loss Function (RL) | δ⁰ |
| 26 | 8.4 | ADPO (Adversary-Aware DPO) | P046 | Loss Function (adversarial) | δ⁰ |
| 27 | 8.5 | PGD Adversarial Perturbation | P046 | Algorithm (optimization) | δ⁰ |
| 28 | 8.6 | SAM (Safety Alignment Margin) | P041 | Metric (alignment) | δ⁰ |
| 29 | 8.7 | CoSA-Score | P041 | Metric (safety-utility) | δ⁰ |
| 30 | 8.8 | Logit Gap (Decision Flip) | P044 | Metric (adversarial robustness) | δ³ |
| 31 | 8.9 | Benchmark Effectiveness (Eff) | P043 | Metric (benchmark quality) | δ³ |
| 32 | 8.10 | Benchmark Separability (Sep_B) | P043 | Metric (benchmark discrimination) | δ³ |
| 33 | 8.11 | Defense Rate (DR) | P038 | Metric (defense eval) | δ¹ |
| 34 | 8.12 | FPR/FNR Guardrail | P042 | Metric (guardrail eval) | δ¹ |
| 35 | 8.13 | Degradation (SPP) | P045 | Metric (attack impact) | δ³ |
| 36 | 8.14 | Multi-Turn ASR | P036 | Metric (multi-turn attack) | δ³ |
| 37 | 8.15 | Emotional AmpFactor | P040 | Metric (attack amplification) | δ³ |

---

## Papers Analyzed and Formula Yield

| Paper | Title (short) | Formulas Extracted | Notes |
|-------|--------------|-------------------|-------|
| P035 | MPIB / CHER | 8.1, 8.2 | First medical-specific metric for prompt injection |
| P036 | LRM Jailbreak Agents | 8.14 | Multi-turn ASR with ICC inter-annotator reliability, 97.14% ASR |
| P037 | Jailbreaking Survey | (shared 8.2) | Survey paper, references ASR threshold concept |
| P038 | InstruCoT Defense | 8.11 | Defense Rate tri-dimensional, SFT loss is standard |
| P039 | GRP-Obliteration | 8.3 | GRPO weaponized for unalignment |
| P040 | Healthcare Misinformation | 8.15 | Emotional Amplification Factor: 6.2% -> 37.5% (6x amplification) |
| P041 | Magic-Token Co-Training | 8.6, 8.7 | SAM + CoSA metrics for switchable safety |
| P042 | PromptArmor | 8.12 | FPR/FNR sub-1% guardrail metrics |
| P043 | JBDistill | 8.9, 8.10 | Benchmark Effectiveness and Separability |
| P044 | AdvJudge-Zero | 8.8 | Logit gap decision flip, 99% ASR on judges |
| P045 | System Prompt Poisoning | 8.13 | Degradation metric, 99.1% worst case |
| P046 | ADPO | 8.4, 8.5 | Adversarial DPO + PGD for VLM safety |

---

## New Dependency Edges (19 edges added)

| From | To | Relationship |
|------|----|-------------|
| 3.4 ASR | 8.1 CHER | CHER generalizes ASR with severity threshold |
| 3.4 ASR | 8.2 ASR seuil | Parametric extension of ASR |
| 8.1 CHER | 8.2 ASR seuil | CHER_k = ASR_k with clinical interpretation |
| 4.1 RLHF | 8.3 GRPO | GRPO is RLHF variant without value function |
| 4.2 KL | 8.3 GRPO | GRPO uses KL penalty to reference policy |
| 4.3 DPO | 8.4 ADPO | ADPO extends DPO with adversarial training |
| 8.5 PGD | 8.4 ADPO | PGD generates worst-case perturbations for ADPO |
| 1.1 Cosine | 8.6 SAM | SAM uses cosine distance for silhouette |
| 8.6 SAM | 8.7 CoSA | CoSA builds on SAM's mode separation |
| 3.4 ASR | 8.9 Eff | Eff averages ASR over evaluation models |
| 8.9 Eff | 8.10 Sep_B | Sep_B measures discrimination of Eff scores |
| 3.1 Sep(M) | 8.10 Sep_B | Sep_B is inspired by Sep(M) concept |
| 3.4 ASR | 8.11 DR | DR = 1 - ASR on three dimensions |
| 1.2 F1 | 8.12 FPR/FNR | FPR/FNR derive from same confusion matrix as F1 |
| (none) | 8.8 Logit Gap | Foundation: logits/softmax only |
| (none) | 8.5 PGD | Foundation: gradient descent |
| (none) | 8.13 Degradation | Foundation: accuracy ratio |
| 3.4 ASR | 8.14 Multi-Turn ASR | Multi-turn extension of ASR with max-over-turns |
| 3.4 ASR | 8.15 AmpFactor | Ratio of emotional MR to baseline MR |

---

## New Critical Paths (4 added, total 8)

| Path | Chain | Thesis Significance |
|------|-------|-------------------|
| 5 | RLHF -> GRPO -> GRP-Obliteration | Proves alignment tools can be weaponized (δ⁰ threat) |
| 6 | DPO -> ADPO (+ PGD) -> VLM defense | Extends alignment to multimodal with worst-case robustness |
| 7 | ASR -> CHER -> ASR threshold | First medical-specific evaluation chain |
| 8 | Logit Gap -> Bench Eff/Sep | Reveals judge fragility, need for renewable benchmarks |

---

## Formula Classification Breakdown (35 total)

| Type | Count | IDs |
|------|-------|-----|
| Metric | 22 | 1.1, 1.2, 2.1, 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, **8.1, 8.2, 8.6, 8.7, 8.8, 8.9, 8.10, 8.11, 8.12, 8.13, 8.14, 8.15** |
| Loss Function | 10 | 1.3, 1.4, 2.3, 4.1, 4.3, 4.4, 5.4, **8.3, 8.4** + 5.1 |
| Algorithm | 3 | 6.1, **8.5** + 5.3 |
| Architecture | 2 | 2.2, 5.2 |

---

## Delta Layer Coverage (35 formulas)

| Layer | RUN-001 | RUN-002 | Total |
|-------|---------|---------|-------|
| δ⁰ | 5 | 5 (8.3, 8.4, 8.5, 8.6, 8.7) | 10 |
| δ¹ | 4 | 2 (8.11, 8.12) | 6 |
| δ² | 4 | 2 (8.1, 8.2) | 6 |
| δ³ | 1 | 6 (8.8, 8.9, 8.10, 8.13, 8.14, 8.15) | 7 |
| Foundation | 8 | 0 | 8 |
| **Total** | **22** | **15** | **37** |

---

## Key Findings

1. **CHER (8.1) is the most thesis-relevant new formula**: First medical-specific metric distinguishing ASR (compliance) from clinical harm. Direct application to AEGIS medical context.

2. **GRPO weaponization (8.3) confirms Conjecture C3**: Alignment tools can be reversed. GRP-Obliteration uses GRPO (normally for safety) to unalign 15 models with a single prompt.

3. **ADPO (8.4) extends δ⁰ to multimodal**: First adversarial DPO variant for VLMs. Relevant as medical systems increasingly use images (X-rays, scans).

4. **Judge fragility (8.8) is a δ³ threat**: AdvJudge-Zero 99% flip rate shows that LLM-based evaluation (including RLHF reward models) is manipulable. This undermines the entire evaluation pipeline.

5. **FPR/FNR sub-1% (8.12)**: PromptArmor achieves deployment-grade guardrail performance. Benchmark for AEGIS δ¹ layer.

6. **δ³ layer significantly strengthened**: RUN-001 had only 1 formula (ASR); RUN-002 adds 4 formulas for monitoring, benchmarking, and degradation measurement.

---

## Papers Without New Formulas

- **P037** (Jailbreaking Survey): Comprehensive taxonomy but no novel formulas. References existing metrics (ASR, toxicity scores). Survey contribution is taxonomic, not mathematical.

---

## DIFF — RUN-002 vs RUN-001

### Added
- 15 new formulas: 8.1-8.15
- 19 new dependency edges
- 4 new critical paths (paths 5-8)
- Section 8 in GLOSSAIRE_DETAILED.md
- Level 5 in DAG (MATH_DEPENDENCIES.md)
- 13 new rows in dependency table

### Modified
- Header counts: 22 -> 37 formulas, 26 -> 45 edges
- ASR (3.4) "Requis par": was "-", now "8.1, 8.2, 8.9, 8.11"
- RLHF (4.1) "Requis par": added "8.3"
- DPO (4.3) "Requis par": added "8.4"
- Cosine (1.1) "Requis par": added "8.6"
- F1 (1.2) "Requis par": added "8.12"
- Delta mapping table: all 4 layers updated with new formulas
- Footer counts updated in both files

### Removed
- None

### Unchanged
- M-001 to M-022 (formulas 1.1-7.2): no modifications
- Paths 1-4: unchanged
- All existing dependency edges: unchanged

---

*Generated by MATHEUX agent, RUN-002 (enrichi), 2026-04-04*
