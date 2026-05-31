# Phase 1 Collection Report -- Prompt Injection Literature Discovery

**Date**: 2026-04-04
**Agent**: Collector (Autonomous)
**Status**: SUCCESS (34 unique papers >= 30 threshold)

## Search Execution Summary

| Query # | Topic | Results Found |
|---------|-------|---------------|
| 1 | Prompt injection attacks LLM security | 8 papers |
| 2 | Prompt injection defenses guardrails | 3 papers (5 deduplicated) |
| 3 | Semantic drift similarity embedding cosine | 5 papers |
| 4 | RLHF alignment robustness adversarial | 7 papers |
| 5 | Separation score prompt injection detection | 4 papers (2 deduplicated) |
| 6 | Medical LLM safety jailbreak clinical | 7 papers |

**Total raw hits**: ~40
**After deduplication**: 34 unique papers

## Distribution by Year

| Year | Count |
|------|-------|
| 2023 | 1 |
| 2024 | 7 |
| 2025 | 26 |

## Distribution by Domain

| Domain | Count | Papers |
|--------|-------|--------|
| attack | 8 | P001, P006, P009, P010, P022, P023, P026, P033 |
| defense | 8 | P002, P005, P007, P008, P011, P017, P020, P021 |
| benchmark | 3 | P003, P004, P024 |
| model_behavior | 2 | P018, P019 |
| embedding | 5 | P012, P013, P014, P015, P016 |
| medical | 8 | P027, P028, P029, P030, P031, P032, P034 |

## Key Papers for Thesis (High Relevance)

### Already Referenced in Project
- **P001** (Liu et al., 2023) -- arXiv:2306.05499 -- already in CLAUDE.md references
- **P024** (Zverev et al., 2025) -- ICLR 2025 separation score -- already in CLAUDE.md references

### High Priority New Discoveries
- **P029** -- JAMA Network Open: 94.4% prompt injection success in medical LLMs (directly relevant to thesis medical context)
- **P018** -- ICLR 2025: shallow alignment vulnerability (relevant to δ⁰ framework)
- **P008** -- Attention Tracker: training-free detection via attention patterns (potential defense benchmark)
- **P011** -- PromptGuard: 4-layer defense with F1=0.91 (comparable to thesis defense taxonomy)
- **P009** -- Guardrail bypass via character injection (directly relevant to Hackett et al. coverage in RagSanitizer)
- **P030** -- Longitudinal safety erosion in medical AI (contextualizes thesis motivation)

## Deduplication Notes

- P008 (Attention Tracker) appeared in queries 1 and 5 -- kept single entry
- P001 (Liu et al.) appeared in queries 1 and 5 -- kept single entry
- P009 (Guardrail bypass) appeared in queries 1 and 2 -- kept single entry

## Output Files

- `papers_phase1.json` -- 34 paper entries with full metadata
- `PHASE1_REPORT.md` -- this file

## Next Steps (Phase 2 Recommendations)

1. Fetch full abstracts from arXiv API for papers with arXiv IDs
2. Cross-reference with existing `research_archive/doc_references/` bibliography
3. Classify papers by thesis chapter relevance (δ⁰ through δ³)
4. Identify citation gaps in formal_framework_complete.md
