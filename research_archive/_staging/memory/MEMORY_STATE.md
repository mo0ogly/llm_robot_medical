# MEMORY_STATE — Bibliography System Persistent Memory

> This file is the SINGLE SOURCE OF TRUTH for inter-session continuity.
> Every agent MUST read this file FIRST before starting work.
> Every agent MUST update this file LAST after completing work.

## Last Execution
- **Run ID**: RUN-002
- **Date**: 2026-04-04
- **Mode**: incremental (P035-P046, 2026 papers)
- **Status**: SUCCESS
- **Duration**: ~60 min total (9 agents, 5 phases)
- **Previous**: RUN-001 (full_search, 2026-04-04)

## Counters (cumulative)
| Metric | Count | Last Updated |
|--------|-------|-------------|
| Papers total | 46 | RUN-002 |
| Papers analyzed | 46 | RUN-002 |
| Papers 2026 (analyzed) | 12 | RUN-002 |
| Formulas in glossaire | 37 | RUN-002 |
| Formula dependencies | 43 | RUN-002 |
| Attack techniques | 30 | RUN-002 |
| PoC exploits | 24 | RUN-002 |
| Research axes | 9 | RUN-002 |
| Conjectures total | 7 (C1-C7) | RUN-002 |
| Math modules | 7 | RUN-002 |
| Exercises total | 41 | RUN-002 |
| RAG chunks | 454 | RUN-002 |
| AEGIS techniques covered | 40/66 + 8 proposed | RUN-002 |
| MITRE techniques mapped | 20 | RUN-002 |
| Chain coverage | 22/34 (65%) | RUN-002 |

## Paper Registry (dedup key: title + arxiv_id)
- P001-P034: Phase 1 (2023-2025) — ANALYZED (RUN-001)
- P035-P046: Phase 2 (2026) — ANALYZED (RUN-002)
- Papers pending: NONE (all 46 analyzed)

## Agent Versions (what each agent produced last)

### COLLECTOR
- Last search date: 2026-04-04
- Queries executed: 12 (6 Phase 1 + 6 Phase 2)
- Next search should cover: 2026-04-05 onwards
- Known gaps: conference proceedings not yet searched (ICLR, NeurIPS, ACL, EMNLP)

### ANALYST
- Papers analyzed: P001-P046 (46/46) — ALL COMPLETE
- Papers pending: NONE
- Resume quality: avg ~500 words, all in FR
- delta-tags assigned: all 46
- Conjecture confidence: C1=10/10, C2=9/10, C3=9/10, C6=8/10
- Next run: analyze P047+ only (from next COLLECTOR run)

### MATHEUX
- Formulas documented: 35 (22 RUN-001 + 13 RUN-002)
- Dependency edges: 43 (26 RUN-001 + 17 RUN-002)
- Critical paths: 8 (4 RUN-001 + 4 RUN-002)
- Version: v2.0 (incremental from P035-P046)
- Next run: verify formulas against full paper PDFs, add any missed formulas
- Known gaps: P036/P040 had no new formulas (standard ASR only), P037 survey formulas may exist in appendix

### CYBERSEC
- Papers threat-modeled: 46/46 (RUN-002 complete)
- MITRE techniques: 20 unique (+6 from RUN-002)
- AEGIS coverage: updated -- 36 new cross-references added to DEFENSE_COVERAGE_ANALYSIS.md
- New threat classes identified: 4 (LRM-as-attacker, training mechanism weaponization, systematic judge fuzzing, persistent PI)
- New defense gaps: 3 critical (system_prompt_integrity, emotional_sentiment_guard, lrm_conversation_monitor)
- New defense proposals: 8 techniques for taxonomy extension
- Next run: monitor for P047+ publications; integrate CHER metric; re-evaluate after AEGIS taxonomy expansion
- Known gaps: no defense against LRM-as-attacker (P036); system prompt integrity verification not yet designed

### WHITEHACKER
- Techniques extracted: 30 (18 RUN-001 + 12 RUN-002)
- PoC created: 24 (12 RUN-001 + 12 RUN-002)
- Chain mappings: 22/34 backend chains (65%)
- Medical-specific techniques: 7 (T09, T10, T15, T18, T23, T24, T29)
- delta coverage: delta0 70%, delta1 77%, delta2 43%, delta3 70%
- Last run: RUN-002 (2026-04-04, incremental, P035-P046)
- Next run: execute PoCs against live backend; implement CHER metric; add multimodal chain for T29
- Known gaps: no live ASR data yet (all from papers); CHER not implemented; 12/34 chains unmapped

### LIBRARIAN
- Files organized: 50 (38 RUN-001 + 12 RUN-002)
- Directory structure: 2023/2024/2025/2026 complete
- MANIFEST: 46 papers indexed
- INDEX_BY_DELTA: δ⁰=27, δ¹=21, δ²=19, δ³=4+
- Dedup validation: 0 duplicates (RUN-002)
- Next run: add P047+ from next COLLECTOR, update all indexes

### MATHTEACHER
- Modules: 7 (v2.0 — improved with 2026 formulas)
- Exercises: 41 with solutions (+7 from RUN-002)
- Quiz questions: 38 (30 RUN-001 + 8 RUN-002)
- Estimated study time: 52-65h (up from 45-55h)
- Modules updated in RUN-002: Module_02, Module_04, Module_05
- Modules unchanged: Module_01, Module_03, Module_06, Module_07
- GLOSSAIRE_SYMBOLES: 30+ new entries added
- Next run: IMPROVE based on user feedback + new papers P047+
- User feedback received: none yet

### SCIENTIST
- Research axes: 9 (v2.0 — Axe 9 added: LRM paradoxe raisonnement/securite)
- Conjectures: 7 (C1-C2 validated, C3-C6 updated, C7 new: paradoxe raisonnement)
- Confidence: C1=10/10, C2=9/10, C3=9/10, C4=8/10, C5=7/10, C6=8/10, C7=7/10
- SWOT: v2.0 (3 new weaknesses, 3 new opportunities, 2 new critical risks)
- Key finding: Triple Convergence (P039+P044+P045) = δ⁰-δ² all simultaneously vulnerable
- CARTE_BIBLIOGRAPHIQUE: 2026 cluster added, 3 new pivot papers
- Next run: UPDATE with P047+, track C7 evolution, monitor δ³ implementations

### CHUNKER
- Chunks: 454 (290 RUN-001 + 164 RUN-002)
- Estimated total tokens: ~124,516
- Breakdown by agent: analyst(46), matheux(32), cybersec(25), whitehacker(24), mathteacher(19), librarian(12), scientist(6)
- All 12 papers P035-P046 covered (14-26 chunks each)
- ingest_to_chromadb.py: updated for RUN-002 metadata format
- Next run: INCREMENTAL — chunk only P047+ and modified files

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

| Metric | RUN-001 | RUN-002 | Target |
|--------|---------|---------|--------|
| C1 confidence | 9/10 | 10/10 | >= 8/10 |
| C2 confidence | 8/10 | 9/10 | >= 8/10 |
| delta-3 coverage | 4/46 papers | 12/46 papers | increase |
| Sep(M) N>=30 | not yet | not yet | required |
| Cosine reliability | flagged (P012) | flagged (P012) | monitor |
| Medical ASR baseline | 94.4% (P029) | 97.14% (P036, cross-model) | track evolution |
| MITRE techniques mapped | 14 | 20 | increase |
| New threat classes (2026) | -- | 4 identified | track |
| Defense gaps (critical) | -- | 3 new | close |
