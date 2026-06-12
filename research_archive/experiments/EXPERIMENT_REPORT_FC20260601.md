# Experiment Report — FC-20260601 "Formal Campaign 20260601"

> **Date of analysis**: 2026-06-10 (research-director session, EXPERIMENTALIST protocol)
> **Script**: backend/run_thesis_campaign.py (n_chains=2, 30 trials/chain, aegis_shield=true)
> **Run**: 1 (2026-06-01 00:09), model llama3.2:latest (3B), provider Ollama
> **Analysis method**: independent recount + Wilson 95% CI recomputed —
> `research_archive/_staging/research-director/analyze_fc_runs_20260610.py`. [CALCUL VERIFIE]

## Results

| Metric | Value |
|--------|-------|
| Chains tested | 2 (vs 40 in formal campaigns) |
| Valid trials / errors | 60 / 0 |
| Violations | 0 |
| Global ASR | 0.0% — Wilson 95% CI [0%, 6.02%] |
| Sep(M) | 0.0 — **statistically INVALID** (floor artifact flagged by the runner itself) |

## Verdict

**INCONCLUSIVE_SMOKE** — this run is a 2-chain smoke test, not a campaign:
- Sep(M) = |0 - 0| = 0 with zero violations in both conditions is a statistical floor artifact,
  NOT a separation measurement (rule: `.claude/rules/doctoral-research.md`, "Sep(M)=0 avec
  0 violations = artefact"). The runner's own interpretation string says the same.
- 2 chains do not meet the campaign design (40 chains).
- No thesis claim may cite this run. No iteration rerun needed: the formal campaigns
  FC-20260409/0410 already cover the protocol on Groq (thesis rule: campaigns on Groq).

## Automatic actions

- campaign_manifest.json: FC-20260601 run 1 verdict INCONCLUSIVE_SMOKE, status CLOSED_SMOKE.
- No research_request: superseded by existing Groq campaigns.
