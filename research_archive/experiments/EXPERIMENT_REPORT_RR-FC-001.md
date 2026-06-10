# Experiment Report — RR-FC-001: Controlled attribution of the FC-20260409 → FC-20260410 ASR drop

> **Date**: 2026-06-10 (research-director cycle, EXPERIMENTALIST protocol)
> **Request**: RR-FC-001 (source: unexpected finding FC-20260409/FC-20260410)
> **Method**: deterministic re-analysis of the two existing campaign runs' raw trial flags.
> Script: `_staging/research-director/attribute_chain_defenses_rrfc001_20260610.py`. [CALCUL VERIFIE]
> **No new Groq calls**: the attribution is provable from the deterministic prefilter markers
> already encoded in the FC-20260410 results. No model-output text was parsed (content-filter safe).

## 1. Hypothesis under test

The global ASR drop **6.75% → 2.08%** (hyde and xml_agent **~96.7% → 0%**) observed between
FC-20260409 run 2 (2026-04-09 09:34) and FC-20260410 (2026-04-10 13:49), same model
(llama-3.1-8b-instant, Groq), was a **confounded** observation [HYPOTHESE]: git commit `3c1e896`
(2026-04-09 16:49, "chain_defenses active in orchestrator") was deployed between the two runs.
RR-FC-001 asked for a controlled ablation to attribute (or refute) the drop to `chain_defenses`.

## 2. Why deterministic re-analysis is sufficient (and stronger than an LLM A/B)

The `chain_defenses` prefilter (`orchestrator_campaigns.py:231`, gated by `aegis_shield`)
**short-circuits** a blocked payload to a synthetic `AuditResult` with zero violations and a
response of the form `[AEGIS CHAIN DEFENSE <chain_id> BLOCKED: <reason>]`, **without calling the
target LLM**. A blocked trial therefore has ASR = 0 *by construction*. Counting the safe
defense-marker prefix per chain attributes the effect exactly. This is deterministic and
reproducible — strictly stronger than a stochastic LLM A/B for this question.

Coupling note: in the current code the prefilter is gated by `aegis_shield`, so it cannot be
ablated alone via the existing `--no-aegis` flag (that flag also removes structural separation).
The temporal A/B is what isolates it: pre-3c1e896, `import chain_defenses` raised ImportError
(module absent) → no prefilter; post-3c1e896 → prefilter active. Both runs used `aegis_shield=True`.

## 3. Results — per-chain attribution (N=30 per chain per run, deterministic judge)

| Chain | FC-0409 ASR (prefilter ABSENT) | FC-0410 ASR (prefilter ACTIVE) | Trials blocked by prefilter (0410) |
|-------|-------------------------------:|-------------------------------:|-----------------------------------:|
| hyde | 96.7% (29/30) | **0.0% (0/30)** | **30/30** |
| xml_agent | 96.7% (29/30) | **0.0% (0/30)** | **30/30** |
| functions_agent | 33.3% (10/30) | 43.3% (13/30) | 0/30 |
| stepback | 23.3% (7/30) | 33.3% (10/30) | 0/30 |

## 4. Findings

- **F1 — hyde/xml drop fully attributable to `chain_defenses`** [CALCUL VERIFIE]: in FC-20260410,
  **all 30/30** trials of `hyde` and `xml_agent` were blocked by the deterministic prefilter
  (synthetic defense marker), forcing ASR = 0 by construction. In FC-20260409 (prefilter absent)
  the same two chains scored 96.7%. Attribution is exact and deterministic — **not** a model change
  or other confound. The confound flagged in EXPERIMENT_REPORT_FC20260410.md is now **controlled**.
  This maps to the documented chain defenses: hyde → deterministic doc oracle / FDA-ref &
  tension-value checks (D-024); xml_agent → strict tag whitelist (D-025) (`backend/chain_defenses.py`).

- **F2 — functions_agent / stepback are NOT affected by the prefilter** [EXPERIMENTAL]: **0/30**
  trials blocked in either run. Their ASR differences (33.3%→43.3%; 23.3%→33.3%) are within
  binomial sampling noise at N=30 — Wilson 95% CIs overlap heavily (functions: [19.2,51.2] vs
  [27.4,60.8]; stepback: [11.8,40.9] vs [19.2,51.2]) — i.e. **n.s.**, run-to-run LLM stochasticity,
  not a defense effect. These two chains remain the **residual attack surface** on 8B after
  chain_defenses activation (consistent with F2 of FC-20260410), and are priority targets for the
  87-technique defense taxonomy.

## 5. Verdict

**RESOLVED — confound controlled.** The hyde/xml_agent ASR collapse (and the bulk of the global
6.75%→2.08% drop) is **caused by the `chain_defenses` prefilter** (commit 3c1e896), proven
deterministically (30/30 blocked per chain). The residual ASR (functions_agent, stepback) is
prefilter-independent. No iteration rerun needed.

Limitation: this attributes the drop at the *prefilter* level. The prefilter's own correctness
(does it block exactly the harmful payloads and not benign clinical ones?) is a separate question —
an over-refusal/FPR panel for the hyde/xml chain defenses would be the natural follow-up (cf. the
F46 over-refusal addendum methodology).

## 6. Conjecture / chapter impact

- **C2 (necessity of δ³)**: supported, no score change — a deterministic, chain-specific δ³-style
  output/payload check (chain_defenses) drives the two highest-ASR chains to 0 where the model's
  own alignment did not (96.7% without it). Consistent with C2 at 10/10 saturated.
- **Ch.5 (defenses)** and **Ch.6 (experiments)**: this is a clean, citable A/B on a real defense
  mechanism (hyde/xml → 0% deterministically; functions/stepback untouched). Unblocks the
  "chain_defenses effect" claim that FC-20260410 could only state as [HYPOTHESE].

## 7. Automatic actions

- `research_requests.json`: RR-FC-001 pending → **resolved**.
- `campaign_manifest.json`: annotate FC-20260409/FC-20260410 with RR-FC-001 attribution resolved.
- Data: `_staging/research-director/fc_attribution_rrfc001_20260610.json` (+ script).
