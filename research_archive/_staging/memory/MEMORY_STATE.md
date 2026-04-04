# MEMORY_STATE — Bibliography System Persistent Memory

> This file is the SINGLE SOURCE OF TRUTH for inter-session continuity.
> Every agent MUST read this file FIRST before starting work.
> Every agent MUST update this file LAST after completing work.

## Last Execution
- **Run ID**: RUN-001
- **Date**: 2026-04-04
- **Mode**: full_search
- **Status**: SUCCESS
- **Duration**: ~45 min total (10 agents)

## Counters (cumulative)
| Metric | Count | Last Updated |
|--------|-------|-------------|
| Papers total | 46 | RUN-001 |
| Papers analyzed | 34 | RUN-001 |
| Papers 2026 (not yet analyzed) | 12 | RUN-001 |
| Formulas in glossaire | 22 | RUN-001 |
| Formula dependencies | 26 | RUN-001 |
| Attack techniques | 18 | RUN-001 |
| PoC exploits | 12 | RUN-001 |
| Research axes | 8 | RUN-001 |
| Conjectures validated | 6 | RUN-001 |
| Math modules | 7 | RUN-001 |
| Exercises total | 34 | RUN-001 |
| RAG chunks | 290 | RUN-001 |
| AEGIS techniques covered | K/66 | RUN-001 |

## Paper Registry (dedup key: title + arxiv_id)
- P001-P034: Phase 1 (2023-2025) — ANALYZED
- P035-P046: Phase 2 (2026) — COLLECTED, NOT YET ANALYZED

## Agent Versions (what each agent produced last)

### COLLECTOR
- Last search date: 2026-04-04
- Queries executed: 12 (6 Phase 1 + 6 Phase 2)
- Next search should cover: 2026-04-05 onwards
- Known gaps: conference proceedings not yet searched (ICLR, NeurIPS, ACL, EMNLP)

### ANALYST
- Papers analyzed: P001-P034 (34/46)
- Papers pending: P035-P046 (12 papers from 2026)
- Resume quality: avg ~500 words, all in FR
- delta-tags assigned: all 34
- Next run: analyze P035-P046 only (incremental)

### MATHEUX
- Formulas documented: 22
- Dependency edges: 26
- Critical paths: 4
- Version: v1.0 (initial extraction)
- Next run: extract formulas from P035-P046, ADD to existing glossaire (don't rewrite)
- Known gaps: P035 (MPIB) likely has new metrics, P036 (LRM) likely has ASR formulas

### CYBERSEC
- Papers threat-modeled: 34/46
- MITRE techniques: 14 unique
- AEGIS coverage: partial (needs update count)
- Next run: threat-model P035-P046, MERGE into existing THREAT_ANALYSIS.md
- Known gaps: 2026 papers likely introduce new attack vectors

### WHITEHACKER
- Techniques extracted: 18
- PoC created: 12
- Chain mappings: 14/34 backend chains
- Next run: extract from P035-P046, ADD new techniques (T19+), ADD new PoC (E13+)
- Known gaps: P036 (LRM 97.14% ASR), P039 (GRP-Obliteration), P041 (AdvJudge-Zero 99%)

### LIBRARIAN
- Files organized: 38
- Directory structure: 2023/2024/2025 complete
- Next run: add 2026/ directories, update MANIFEST with P035-P046, update INDEX_BY_DELTA
- Dedup validation: 0 duplicates found (RUN-001)

### MATHTEACHER
- Modules: 7 (v1.0)
- Exercises: 34 with solutions
- Estimated study time: 45-55h
- Next run: IMPROVE existing modules (don't recreate):
  - Add exercises from new formulas (P035-P046)
  - Refine explanations based on user feedback
  - Update "Ou c'est utilise?" sections with new papers
  - Add Module_08 only if new math domains discovered
- User feedback received: none yet (first run)

### SCIENTIST
- Research axes: 8 (v1.0)
- Conjectures: 6 (C1-C2 validated, C3-C6 new)
- SWOT: v1.0
- Next run: UPDATE existing axes with new evidence from P035-P046:
  - Don't recreate axes — add new papers to existing axes
  - Create new axes ONLY if 2026 papers reveal genuinely new directions
  - Update conjecture confidence scores
  - Update SWOT (new threats/opportunities from 2026)
  - Update CARTE_BIBLIOGRAPHIQUE with 2026 cluster

### CHUNKER
- Chunks: 290 (v1.0)
- Next run: INCREMENTAL — only chunk new/modified files
  - New analyst reports (P035-P046): ~24 new chunks
  - Updated matheux glossaire: re-chunk modified entries only
  - Updated cybersec/whitehacker: re-chunk new entries only
  - Don't re-chunk unchanged files
  - Append to existing chunks_for_rag.jsonl (don't overwrite)

## Incremental Mode Rules

When mode = "incremental":

1. **COLLECTOR**: Search only papers published since `last_search_date`
2. **ANALYST**: Analyze only papers in `papers_pending` list
3. **MATHEUX**: Extract formulas from new papers, ADD to existing glossaire
4. **CYBERSEC**: Threat-model new papers, MERGE into existing analysis
5. **WHITEHACKER**: Extract from new papers, ADD new techniques (don't overwrite)
6. **LIBRARIAN**: Add new papers to filesystem, UPDATE indexes (don't rebuild)
7. **MATHTEACHER**: IMPROVE modules — update sections, add exercises, DON'T recreate
8. **SCIENTIST**: UPDATE axes with new evidence, DON'T rewrite from scratch
9. **CHUNKER**: Only chunk new/modified files, APPEND to JSONL

## Diff Protocol

Each agent MUST output a DIFF section at the end of its report:

```markdown
## DIFF — RUN-XXX vs RUN-(XXX-1)

### Added
- [list of new items added]

### Modified
- [list of existing items updated + what changed]

### Removed
- [list of items removed + why]

### Unchanged
- [count of items that were not modified]
```

## User Feedback Registry

When the user provides feedback (e.g., "je ne comprends pas X"):
- Log it here with date and module reference
- MATHTEACHER reads this on next run and addresses each feedback item

| Date | Feedback | Module | Status |
|------|----------|--------|--------|
| (none yet) | | | |

## Quality Metrics (tracked across runs)

| Metric | RUN-001 | Target |
|--------|---------|--------|
| C1 confidence | 9/10 | >= 8/10 |
| C2 confidence | 8/10 | >= 8/10 |
| delta-3 coverage | 4/46 papers | increase |
| Sep(M) N>=30 | not yet | required |
| Cosine reliability | flagged (P012) | monitor |
| Medical ASR baseline | 94.4% (P029) | track evolution |
