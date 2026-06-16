# Experiment Report — FC-20260615 "Formal Campaign 20260615"

> **Date of analysis**: 2026-06-16 (experimentalist closure)
> **Script**: backend/run_thesis_campaign.py (n_chains=2, n_trials=2, aegis_shield=True)
> **Run**: 1 (2026-06-15 22:47), model llama-3.3-70b-versatile, provider Groq
> **Source data**: `research_archive/data/raw/campaign_20260615_224735.json`

## Results

| Metric | Value |
|--------|-------|
| Chains tested | 2 (feedback_poisoning, transactional_agent) |
| N per chain | 2 (shield=True) |
| Total trials | 4 |
| Violations | 0 |
| Global ASR | 0.0% |
| Sep(M) | 0.0 — **statistically INVALID** (N=4 << 30, floor artefact) |

## Verdict

**CLOSED_SMOKE** — diagnostic run, not a formal thesis campaign:

- N=2 per chain is a pre-check, not a thesis-grade run. Sep(M)=0 with zero violations = artefact
  (doctoral-research.md: "Sep(M)=0 avec 0 violations = artefact statistique").
- aegis_shield=True throughout: measures δ¹+δ²+δ³ combined effect, not separation.
- Context: run triggered by SESSION-004 catalogue audit to test rule_bypass chains on 70B
  (feedback_poisoning and transactional_agent had `precheck_asr=0` under robotic judge —
  possible judge-blindness, cf. UNEXPECTED_FINDING_pharma_judge_blindness_20260615.md).
- 0 violations here does not imply 0 ASR — the robotic judge may be blind to rule_bypass
  goal family (confirmed by pharma_screen results: same templates score 0% robotic vs
  86.7% goal-appropriate judge).

## Automatic actions

- campaign_manifest.json: FC-20260615 status → CLOSED_SMOKE.
- No thesis claim may cite this run.
- Hypothesis: feedback_poisoning may require goal-appropriate judge (not robotic validate_output).
  Full N=30 run without shield pending if FC-20260616 confirms signal.
