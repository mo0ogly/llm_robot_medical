# Experiment Report — F46 Addendum: Over-refusal + Cross-model Replication

> **Date of analysis**: 2026-06-10 (research-director session)
> **Extends**: EXPERIMENT_REPORT_F46.md (F46-20260604, llama-3.3-70b-versatile, verdict SUPPORTED)
> **Verification**: all numbers below re-extracted from the raw JSON files listed in each section;
> Cohen's h at the 70B optimum independently recomputed (0.7796 vs 0.7797 stored). [CALCUL VERIFIE]

## 0. File provenance warning (audit finding 2026-06-10)

`backend/experiments/results/f46_calibration_results.json` was **overwritten on 2026-06-09**
by the gpt-oss-120b replication run. The llama-3.3-70b results backing EXPERIMENT_REPORT_F46.md
are preserved in `f46_calibration_results_llama70b.json` (metadata model llama-3.3-70b-versatile,
date 2026-06-04) and were verified to match the report exactly: baseline ASR 0.1444 (130/900,
Wilson [0.1230, 0.1689]), optimal mu=1.0/gamma=0.85 -> ASR 0.0000, Cohen's h 0.7797, 15/15
conditions significant (Bonferroni, z up to 11.84). The campaign manifest now points to the
preserved file. **Recommendation**: make the calibration script version its output filename.

## 1. Over-refusal / utility cost (2026-06-08) — caveat 3 of the main report CLOSED

> Source: `backend/experiments/results/f46_overrefusal.json` (llama-3.3-70b-versatile, Groq,
> temp 0.0, deterministic over-refusal judge, 18 benign clinical prompts x 30 runs x
> (baseline + 15 conditions) = 8,640 evals)

| Metric | Value |
|--------|-------|
| Baseline FPR (mu=0) | 0.0000 (0/540), Wilson 95% CI [0, 0.71%] |
| FPR at optimum (mu=1.0, gamma=0.85) | **0.0000** (0/540), CI [0, 0.71%] |
| Worst condition FPR (all 15) | 0.0000 — zero refusals anywhere |
| Latency overhead at optimum | 640.1 ms -> 717.1 ms (+12%) |

**Conclusion** [EXPERIMENTAL]: on this 18-prompt benign clinical panel, the F46 recovery proxy
induces **zero measurable over-refusal** at any (mu, gamma), including the optimum. The
safety/utility trade-off feared in caveat 3 is not observed (upper bound 0.71% at 95%).
Limitation: 18 prompts is a small benign panel; a broader utility benchmark would tighten this.

## 2. Cross-model replication on openai/gpt-oss-120b (2026-06-09) — caveat 4 PARTIALLY closed

> Source: `backend/experiments/results/f46_calibration_results.json` (metadata model
> openai/gpt-oss-120b, date 2026-06-09, 14,400 evals, same grid, deterministic judge)

| Metric | llama-3.3-70b (06-04) | gpt-oss-120b (06-09) |
|--------|------------------------|----------------------|
| Baseline ASR | 0.1444 [0.1230, 0.1689] | 0.2022 [0.1773, 0.2297] |
| Optimal (mu, gamma) | (1.0, 0.85) | (1.0, 1.00) |
| ASR at optimum | 0.0000 | 0.0144 |
| Cohen's h at optimum | 0.7797 | 0.6919 |
| Conditions significant | 15/15 | 12/15 |
| Conditions with positive delta | 15/15 | **11/15** |

**Replicated** [EXPERIMENTAL]: direction and magnitude (large effect) replicate; gamma (depth
coverage) remains the dominant lever (at mu=1.0: gamma=0.70 -> ASR 0.1889 n.s., gamma=0.85 ->
0.0167, gamma=1.00 -> 0.0144).

**New cross-model nuances** [EXPERIMENTAL — gpt-oss-120b grid]:
1. **Weak mu is counterproductive on 120B**: at mu=0.01, ASR *increases* significantly above
   baseline (0.2700 / 0.2633 / 0.2900 vs 0.2022; negative h, Bonferroni-significant). A faint
   recovery instruction appears to prime rather than suppress the attack surface on this model.
2. **gamma=0.70 is ineffective on 120B even at mu=1.0** (0.1889, n.s.), whereas on 70B it still
   yielded a significant reduction (0.0667). Depth-coverage requirements are model-dependent.

**Implication**: the F46 penalty calibration does NOT transfer as-is across models — (mu, gamma)
must be recalibrated per model, and under-dosed mu is potentially harmful. This is itself a
thesis-relevant finding for Ch.5/Ch.6 (defense calibration is model-specific).

## 3. Status after addendum

- RR-P0-002 (F46 calibration empirique): **RESOLVED** — main grid SUPPORTED (70B), over-refusal
  cost zero on benign panel, cross-model replication done with documented nuances.
- Remaining open (new, smaller): training-time validation of the true penalty (Young, 2026,
  Eq. 19 [HEURISTIQUE]) — out of scope for the prompting proxy; broader benign-utility panel.
- Conjecture impact: supports the shallow/deep-positional alignment line (C3 evidence,
  no score change proposed — C3 stays 9/10; the proxy is not a training-time proof).
