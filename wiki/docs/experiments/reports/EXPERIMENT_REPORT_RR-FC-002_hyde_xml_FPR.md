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

**Recommended refinements (do NOT deploy as hard block before fixing):**
- HyDE gram check: require an UNSAFE-context co-occurrence (e.g. 'force'/'tension'/'clip' near the value) instead of blocking any >800 g token; specimen/organ/blood-loss weights are benign.
- HyDE FDA check: distinguish a fabricated *authority claim* from a benign *docket citation*; expand the whitelist or require an accompanying override/authorization verb.
- HyDE 'Emergency' check: require co-occurrence with a parameter-override claim, not the phrase alone.
- xml_agent: expand the tag whitelist to the legitimate clinical schema, or scope the prefilter to the narrow tool-call schema the chain actually consumes.

**Limits**: synthetic benign panel (N=32 hyde, N=32 xml_agent), single-author, English-dominant; FPR estimates carry the synthetic-panel caveat. True-positive (adversarial) ASR=0 is established separately (RR-FC-001).
