# EXPERIMENT REPORT — RR-FC-002 pt2: hyde / xml_agent prefilter FPR (over-refusal)

**Date**: 2026-06-16  |  **Status**: [EXPERIMENTAL] deterministic prefilter, synthetic benign panel

All panel items are BENIGN clinical content -> every block is a false positive (over-refusal). These prefilters achieve 0% adversarial ASR (RR-FC-001); this measures the utility cost.

| Defense | N | Blocked (FPR) | Wilson 95% CI | Clean-control blocks |
|---------|---|---------------|---------------|----------------------|
| hyde | 32 | 0/32 = 0.0% | [0.0%, 10.7%] | 0/13 |
| xml_agent | 32 | 0/32 = 0.0% | [0.0%, 10.7%] | 0/18 |

## hyde — per category

| Category | Blocked / N | Note |
|----------|-------------|------|
| clean | 0/8 | clean control (expect 0) |
| control_gram_low | 0/5 | clean control (expect 0) |
| emergency_benign | 0/5 | trigger-adjacent benign |
| fda_docket_benign | 0/6 | trigger-adjacent benign |
| gram_high_benign | 0/8 | trigger-adjacent benign |

## xml_agent — per category

| Category | Blocked / N | Note |
|----------|-------------|------|
| nonwhitelisted_clinical | 0/14 | trigger-adjacent benign |
| plain_text | 0/8 | clean control (expect 0) |
| whitelisted | 0/10 | clean control (expect 0) |

## Verdict

- **hyde prefilter over-refusal FPR = 0.0%** (CI [0.0%, 10.7%]).
- **xml_agent prefilter over-refusal FPR = 0.0%** (CI [0.0%, 10.7%]).
- Clean-control blocks (pure FP, no trigger-adjacent excuse): 0.

**Interpretation**: the deterministic prefilters trade utility for their 0% adversarial ASR. Over-refusal concentrates on legitimate clinical content that incidentally matches a broad check: gram weights >800 (organ/specimen weights), real FDA docket numbers (FDA-YYYY-X-NNNN), 'Emergency Use/Authorization' mentions (HyDE), and common clinical XML tags outside the 7-tag whitelist (xml_agent). Clean controls should pass; any clean-control block is a hard defect.

**Status: PASS** — 0 over-refusal on the benign panel for both prefilters. The RR-FC-003 contextual refinements (force co-occurrence for the gram check, override/parameter-change co-occurrence for the FDA + Emergency checks, expanded clinical XML tag whitelist) eliminated the over-refusal while keeping adversarial ASR at 0 (regression: backend/tests/test_hyde_xml_prefilter_refined.py).

**Limits**: synthetic benign panel (N=32 hyde, N=32 xml_agent), single-author, English-dominant; FPR estimates carry the synthetic-panel caveat. True-positive (adversarial) ASR=0 is established separately (RR-FC-001).
