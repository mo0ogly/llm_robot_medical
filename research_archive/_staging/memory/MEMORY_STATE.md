# MEMORY_STATE — Bibliography System Persistent Memory

> This file is the SINGLE SOURCE OF TRUTH for inter-session continuity.
> Every agent MUST read this file FIRST before starting work.
> Every agent MUST update this file LAST after completing work.

## Last Execution
- **Run ID**: RUN-003
- **Date**: 2026-04-04
- **Mode**: incremental (P047-P060, 14 papers from user-curated list)
- **Status**: SUCCESS
- **Duration**: ~45 min total (9 agents, 5 phases)
- **Previous**: RUN-002 (incremental P035-P046, 2026-04-04)

## Counters (cumulative)
| Metric | Count | Last Updated |
|--------|-------|-------------|
| Papers total | 60 | RUN-003 |
| Papers analyzed | 60 | RUN-003 |
| Papers 2025-2026 (analyzed) | 26 | RUN-003 |
| Formulas in glossaire | 54 | RUN-003 |
| Formula dependencies | 66 | RUN-003 |
| Attack techniques | 48 | RUN-003 |
| PoC exploits | 42 | RUN-003 |
| Research axes | 9 (+enriched) | RUN-003 |
| Conjectures total | 7 (C1-C7) | RUN-003 |
| Conjectures validated (>=10/10) | 3 (C1, C2, C3) | RUN-003 |
| Math modules | 7 | RUN-003 |
| Exercises total | 47 | RUN-003 |
| RAG chunks | 454 + RUN-003 pending | RUN-003 |
| Discoveries | 16 (D-001→D-016) | RUN-003 |
| Thesis gaps | 21 (G-001→G-021) | RUN-003 |
| AEGIS techniques covered | 40/66 + 12 proposed | RUN-003 |
| MITRE techniques mapped | 22 | RUN-003 |
| Chain coverage | 28/34 (82%) | RUN-003 |

## Paper Registry (dedup key: title + arxiv_id)
- P001-P034: Phase 1 (2023-2025) — ANALYZED (RUN-001)
- P035-P046: Phase 2 (2026) — ANALYZED (RUN-002)
- P047-P060: Phase 3 (2025-2026, user-curated) — ANALYZED (RUN-003)
- Papers pending: NONE (all 60 analyzed)

## Agent Versions (what each agent produced last)

### COLLECTOR
- Last search date: 2026-04-04
- Queries executed: 12 + 14 user-curated URLs (RUN-003)
- Papers collected: 60 total (34 Phase 1 + 12 Phase 2 + 14 Phase 3)
- RUN-003 sources: ACL Anthology, arXiv, NeurIPS, IEEE S&P, Snyk Labs, IJCA, ETH thesis
- Next search should cover: 2026-04-05 onwards
- Known gaps: some conference proceedings remain unsearched

### ANALYST
- Papers analyzed: P001-P060 (60/60) — ALL COMPLETE
- Papers pending: NONE
- Resume quality: avg ~400 words, all in FR
- delta-tags assigned: all 60
- Conjecture confidence: C1=10/10, C2=10/10, C3=10/10, C4=9/10, C5=8/10, C6=9/10, C7=8/10
- RUN-003: 14 analyses (P047-P060), 9 new gaps identified (G-013→G-021)
- Next run: analyze P061+ only

### MATHEUX
- Formulas documented: 54 (22 RUN-001 + 15 RUN-002 + 17 RUN-003)
- Dependency edges: 66 (26 RUN-001 + 17 RUN-002 + 23 RUN-003)
- Critical paths: 12 (4 RUN-001 + 4 RUN-002 + 4 RUN-003)
- Version: v3.0 (incremental from P047-P060)
- Key formulas RUN-003: F44 (Harm Information martingale), F51 (ASIDE rotation), F53 (SEU), F39 (ESR Hackett)
- Next run: verify formulas against full paper PDFs
- Known gaps: P048 survey, P053, P055, P058 had no new formulas

### CYBERSEC
- Papers threat-modeled: 60/60 (RUN-003 complete)
- MITRE techniques: 22 unique (+2 from RUN-003: T1027.005, T1204.001)
- AEGIS coverage: 40/66 + 12 proposed defense techniques
- Threat classes: 4 prior + RAG compound attack (P054+P055), architectural defense bypass (P056+P057)
- New defense gaps RUN-003: 8 (G-013→G-020) — compound RAG detection, vector DB integrity, document injection scanning, AIR limitations, ASIDE non-integration
- Defense proposals: 4 new (attack inversion P047, 4D linguistic P051, AIR P056, ASIDE P057)
- D-001 Triple Convergence: STRENGTHENED by P052 (martingale proof), extended to RAG layer
- Next run: monitor for P061+; test ASIDE integration; evaluate compound RAG defenses

### WHITEHACKER
- Techniques extracted: 48 (18 RUN-001 + 12 RUN-002 + 18 RUN-003)
- PoC created: 42 (12 RUN-001 + 12 RUN-002 + 18 RUN-003)
- Chain mappings: 28/34 backend chains (82%)
- Medical-specific techniques: 10 (7 prior + T35, T42, T43 from RUN-003)
- delta coverage: δ⁰=83%, δ¹=90%, δ²=67%, δ³=80%
- Key techniques RUN-003: T33 (character injection ensemble), T37 (PIDP compound), T38 (persistent vector poisoning), T40 (triple convergence compound)
- Last run: RUN-003 (2026-04-04, incremental, P047-P060)
- Next run: execute PoCs against live backend; test T40 triple convergence; 6/34 chains still unmapped

### LIBRARIAN
- Files organized: 64 (38 RUN-001 + 12 RUN-002 + 14 RUN-003)
- Directory structure: 2023/2024/2025/2026 complete
- MANIFEST: 60 papers indexed
- INDEX_BY_DELTA: δ⁰=35, δ¹=33, δ²=27, δ³=9
- INDEX_BY_CONJECTURE: C1=30, C2=27, C3=10, C4=8, C5=5, C6=12, C7=7
- INDEX_BY_TOPIC: Attack=17, Defense=16, Medical=12, Benchmark=7, Embedding=5, Model=4
- Dedup validation: 0 duplicates (RUN-003)
- Unicode notation: 82 delta-0/1/2/3 → δ⁰/δ¹/δ²/δ³ fixed
- Next run: add P061+ from next COLLECTOR

### MATHTEACHER
- Modules: 7 (v3.0 — improved with RUN-003 formulas F38-F54)
- Exercises: 47 with solutions (+6 from RUN-003)
- Quiz questions: 38+ (to be updated)
- Estimated study time: 62-75h (up from 52-65h)
- Modules updated in RUN-003: Module_04 (11 formulas), Module_05 (+4 parties M-P), Module_06 (+2 parties G-H)
- Modules unchanged: Module_01, Module_02, Module_03, Module_07
- GLOSSAIRE_SYMBOLES: +25 entries, +18 abbreviations (RUN-003)
- Next run: IMPROVE based on user feedback + new papers P061+
- User feedback received: none yet

### SCIENTIST
- Research axes: 9 (v3.0 — all enriched, Axe 1 saturé, Axe 9 upgraded to "En cours")
- Conjectures: 7 — 3 VALIDATED (C1=10, C2=10, C3=10), 4 FORTEMENT SUPPORTÉES (C4=9, C5=8, C6=9, C7=8)
- Discoveries: 16 (D-001→D-016, +4 in RUN-003: D-013 RAG compound, D-014 martingale proof, D-015 ASIDE counter-argument, D-016 multi-turn medical degradation)
- Gaps: 21 (G-001→G-021, +9 in RUN-003)
- Key finding RUN-003: P052 provides mathematical proof (martingale decomposition) for C1/C3. ASIDE (P057) is only architectural response to D-001.
- SWOT: v3.0 updated
- Next run: UPDATE with P061+, test ASIDE integration, close G-009 (Sep(M) N>=30)

### CHUNKER
- Chunks: 454 + RUN-003 pending (CHUNKER agent running)
- Estimated total tokens: ~124,516 + RUN-003
- ingest_to_chromadb.py: v3.0 (unified path, delta normalization, discovery chunks)
- ChromaDB: aegis_bibliography collection in backend/chroma_db/ (481 docs after RUN-002 ingestion)
- Next run: INCREMENTAL — chunk only P061+ and modified files

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

| Metric | RUN-001 | RUN-002 | RUN-003 | Target |
|--------|---------|---------|---------|--------|
| C1 confidence | 9/10 | 10/10 | 10/10 | >= 8/10 ✅ |
| C2 confidence | 8/10 | 9/10 | 10/10 | >= 8/10 ✅ |
| C3 confidence | 8/10 | 9/10 | 10/10 | >= 8/10 ✅ |
| C4 confidence | 6/10 | 8/10 | 9/10 | >= 8/10 ✅ |
| C5 confidence | 7/10 | 7/10 | 8/10 | >= 8/10 ✅ |
| C6 confidence | 7/10 | 8/10 | 9/10 | >= 8/10 ✅ |
| C7 confidence | — | 7/10 | 8/10 | >= 8/10 ✅ |
| δ³ coverage | 4/46 papers | 12/46 papers | 9/60 papers (INDEX) | increase |
| Sep(M) N>=30 | not yet | not yet | P057 validates Sep(M) | required |
| Medical ASR baseline | 94.4% (P029) | 97.14% (P036) | confirmed (P050 p<0.001) | track |
| MITRE techniques mapped | 14 | 20 | 22 | increase |
| Discoveries | — | 12 | 16 | track |
| Thesis gaps | — | 12 | 21 | close |
| Chain coverage | — | 22/34 (65%) | 28/34 (82%) | 34/34 |
