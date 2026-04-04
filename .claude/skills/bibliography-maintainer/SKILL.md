---
name: bibliography-maintainer
description: "Scientific bibliography management system using a 9-agent swarm for the AEGIS doctoral thesis (ENS, 2026). Discovers new papers on prompt injection (2023-2026+), analyzes them (FR resumes, formulas, threat models, red-team playbooks), organizes into filesystem with indexes, builds math curriculum, performs cross-analysis for research axes, and prepares RAG chunks for ChromaDB ingestion. Use when: update bibliography, new papers, recherche bibliographique, mise a jour biblio, add papers, scan literature, bibliography maintenance, weekly update, analyse croisee."
---

# bibliography-maintainer -- AEGIS Doctoral Thesis Bibliography System

Multi-agent scientific bibliography management with 9 specialized agents running the
autonomous agentic loop (DECOMPOSE -> PLAN -> ACT -> OBSERVE -> EVALUATE -> REPLAN -> COMPLETE).

## Modes

| Mode | Trigger | Description |
|------|---------|-------------|
| `full_search` | Default, or "full", "complete" | Run all 9 agents end-to-end |
| `incremental` | "incremental", "update", "weekly" | COLLECTOR only searches last 7 days, other agents process new papers only |
| `analyze_only` | "analyze", "analyse" | Skip COLLECTOR, run ANALYST+ on existing unprocessed papers |
| `curriculum_update` | "curriculum", "math", "modules" | Run MATHEUX + MATHTEACHER only |
| `research_axes` | "axes", "synthesis", "analyse croisee" | Run SCIENTIST only on all existing data |
| `rag_refresh` | "rag", "chunks", "chromadb" | Run CHUNKER only, regenerate all chunks |

## Inter-Session Memory (Continuity System)

**CRITICAL**: This skill maintains state between executions via two files:

1. **`_staging/memory/MEMORY_STATE.md`** — Single source of truth for all agents
   - Last execution metadata (run_id, date, mode, status)
   - Cumulative counters (papers, formulas, techniques, axes, modules, chunks)
   - Per-agent version tracking (what was produced, what's pending)
   - Incremental mode rules (what to ADD vs REWRITE vs SKIP)
   - User feedback registry (for MATHTEACHER improvement)
   - Quality metrics tracked across runs

2. **`_staging/memory/EXECUTION_LOG.jsonl`** — Append-only history of all runs
   - One JSON line per execution with full stats
   - Used for trend analysis and regression detection

### Agent Memory Protocol

**BEFORE starting work**, every agent MUST:
1. Read `MEMORY_STATE.md` to understand current state
2. Check its own version section (what was done last time)
3. Identify what's NEW since last run (papers_pending, new feedback, etc.)
4. Decide: CREATE (first run) or UPDATE (subsequent runs)

**AFTER completing work**, every agent MUST:
1. Update its section in `MEMORY_STATE.md` (new counts, version, next-run instructions)
2. Append a DIFF section to its report (Added/Modified/Removed/Unchanged)
3. Log the run to `EXECUTION_LOG.jsonl`

### Incremental Behavior per Agent

| Agent | First Run | Subsequent Runs |
|-------|-----------|-----------------|
| COLLECTOR | Search all years | Search only since `last_search_date` |
| ANALYST | Analyze all papers | Analyze only `papers_pending` list |
| MATHEUX | Extract all formulas | ADD new formulas to existing glossaire |
| CYBERSEC | Threat-model all | MERGE new papers into existing analysis |
| WHITEHACKER | Extract all techniques | ADD new techniques (T19+, E13+) |
| LIBRARIAN | Build full filesystem | ADD new papers, UPDATE indexes |
| MATHTEACHER | Create 7 modules | IMPROVE existing (add exercises, update refs, refine explanations) |
| SCIENTIST | Create 8 axes | UPDATE axes with new evidence, adjust confidence scores |
| CHUNKER | Chunk everything | Only chunk new/modified files, APPEND to JSONL |

### User Feedback Loop

When user says "je ne comprends pas X" or provides feedback:
1. Feedback is logged in `MEMORY_STATE.md` → User Feedback Registry
2. Next MATHTEACHER run reads the registry and addresses each item
3. MATHTEACHER marks feedback as "addressed" after improving the module

## Agent Map

```
Orchestrator (this skill)
    |
    +-(P1)------------- COLLECTOR    : WebSearch 6 queries, metadata extraction, dedup
    |
    +-(P2 parallel)-+-- ANALYST      : FR resumes, delta-tags, glossaire, research gaps
    |               +-- MATHEUX      : Formula extraction, dependency graph, glossaire
    |               +-- CYBERSEC     : Threat models, MITRE ATT&CK, AEGIS 66 taxonomy
    |               +-- WHITEHACKER  : Red-team playbook, PoC code, exploitation guide
    |
    +-(P3)------------- LIBRARIAN    : Filesystem org, MANIFEST, INDEX_BY_DELTA, GLOSSAIRE
    |
    +-(P4 parallel)-+-- MATHTEACHER  : FR curriculum (5-7 modules), exercises, quiz
    |               +-- SCIENTIST    : Cross-analysis, research axes, thesis positioning
    |
    +-(P5)------------- CHUNKER      : RAG chunks (JSONL), ChromaDB ingestion script
```

Gates:
- P1 -> P2: COLLECTOR must report SUCCESS or PARTIAL before analysts start
- P2 -> P3: All 4 analysts must complete before LIBRARIAN organizes
- P3 -> P4: LIBRARIAN must create indexes before SCIENTIST can cross-analyze
- P3 -> P4: MATHEUX must produce MATH_DEPENDENCIES.md before MATHTEACHER starts
- P4 -> P5: SCIENTIST + MATHTEACHER must complete before CHUNKER processes all outputs

## Agentic System Prompt (injected into all 9 agents)

All agents use the autonomous agentic binary from:
`../add-scenario/references/agents/autonomous-agent-binary.md`

Each agent receives:
1. The agentic loop (OBJECTIVE -> DECOMPOSE -> PLAN -> ACT -> OBSERVE -> EVALUATE -> REPLAN -> COMPLETE)
2. Working Memory + Action Journal (append-only, auditable)
3. Role-specific objectives, tools, output formats, success criteria, failure signals
4. Content filter safety rules (NE LIS JAMAIS les fichiers sensibles)

## Directory Structure

```
research_archive/
  _staging/
    collector/      # papers_phase1.json, papers_phase2_2026.json, reports
    analyst/        # P001_analysis.md ... P046_analysis.md, report
    matheux/        # GLOSSAIRE_DETAILED.md, MATH_DEPENDENCIES.md, report
    cybersec/       # THREAT_ANALYSIS.md, DEFENSE_COVERAGE_ANALYSIS.md, report
    whitehacker/    # RED_TEAM_PLAYBOOK.md, EXPLOITATION_GUIDE.md, report
    mathteacher/    # Module_01..07.md, GLOSSAIRE_SYMBOLES.md, NOTATION_GUIDE.md, quiz
    scientist/      # AXES_DE_RECHERCHE.md, ANALYSE_CROISEE.md, POSITIONNEMENT_THESE.md, ...
    chunker/        # chunks_for_rag.jsonl, ingest_to_chromadb.py, manifest
    librarian/      # (working area)
    memory/         # (cross-session persistence)
  doc_references/
    {year}/{domain}/  # Organized paper files
    MANIFEST.md       # Central table of all papers
    INDEX_BY_DELTA.md # Papers indexed by delta-0 to delta-3
    GLOSSAIRE_MATHEMATIQUE.md  # Unified math glossary
```

## Agent Specifications

### 1. COLLECTOR
- **Objective**: Discover academic papers via WebSearch
- **Queries**: 6 parallel searches (attacks, defenses, embeddings, RLHF, separation, medical)
- **Output**: `_staging/collector/papers_phaseN.json` (JSONL with metadata)
- **Success**: >= 20 unique papers per full run
- **Dedup**: By title + arxiv_id + DOI against existing MANIFEST

### 2. ANALYST
- **Objective**: Generate French resume (500 mots), extract formulas, identify gaps, assign delta-tags
- **Output**: `_staging/analyst/PXXX_analysis.md` per paper
- **Success**: All sections filled, resume >= 400 words, >= 2 research gaps
- **Language**: 100% FRANCAIS (technical terms in English OK)

### 3. MATHEUX
- **Objective**: Detailed formula glossaire + dependency graph
- **Output**: `GLOSSAIRE_DETAILED.md` + `MATH_DEPENDENCIES.md`
- **Success**: >= 20 formulas with numerical examples, DAG complete
- **Audience**: bac+2 level (no advanced math assumed)

### 4. CYBERSEC
- **Objective**: Threat models, MITRE ATT&CK mapping, AEGIS 66-technique coverage, gap analysis
- **Output**: `THREAT_ANALYSIS.md` + `DEFENSE_COVERAGE_ANALYSIS.md`
- **Success**: All papers mapped, delta-layer coverage matrix complete

### 5. WHITEHACKER
- **Objective**: Attack techniques, exploitability assessment, PoC code, red-team playbooks
- **Output**: `RED_TEAM_PLAYBOOK.md` + `EXPLOITATION_GUIDE.md`
- **Success**: >= 15 techniques with reproducible PoC, delta-bypass assessed

### 6. LIBRARIAN
- **Objective**: Filesystem organization, central indexes, deduplication, validation
- **Output**: `doc_references/{year}/{domain}/` + MANIFEST.md + INDEX_BY_DELTA.md + GLOSSAIRE_MATHEMATIQUE.md
- **Success**: All papers indexed, zero duplicates, zero orphans

### 7. MATHTEACHER
- **Objective**: Personalized French math curriculum (5-7 modules), exercises, quiz
- **Output**: `Module_01..07.md` + `GLOSSAIRE_SYMBOLES.md` + `NOTATION_GUIDE.md` + `SELF_ASSESSMENT_QUIZ.md`
- **Success**: All modules complete, 100% FR, exercises with full solutions
- **Feedback loop**: Accepts user signals ("je ne comprends pas X") and iterates

### 8. SCIENTIST
- **Objective**: Cross-analysis of all data, research axes, thesis positioning, conjecture validation
- **Output**: `AXES_DE_RECHERCHE.md` + `ANALYSE_CROISEE.md` + `POSITIONNEMENT_THESE.md` + `CONJECTURES_VALIDATION.md` + `CARTE_BIBLIOGRAPHIQUE.md`
- **Success**: >= 5 research axes with evidence from >= 2 papers each, SWOT complete

### 9. CHUNKER
- **Objective**: Prepare all outputs as RAG chunks for ChromaDB ingestion
- **Output**: `chunks_for_rag.jsonl` + `ingest_to_chromadb.py` + `CHUNKS_MANIFEST.md`
- **Success**: 200-400 chunks, metadata complete, ingestion script tested
- **Chunk config**: 400-600 tokens, 50-token overlap, semantic boundaries

## Constraints (inherited from CLAUDE.md)

1. **ZERO placeholder** -- every output must be from real API/WebSearch calls
2. **Content filter safety** -- never read full content of sensitive files
3. **Unicode notation** -- delta-0 to delta-3 (never "delta-0")
4. **Trilingual docs** -- README updates in FR/EN/BR
5. **Git conventions** -- Co-Authored-By: Claude Opus 4.6, no houyi in filenames
6. **Statistical validity** -- Sep(M) requires N >= 30 per condition

## Scheduling

For recurring maintenance, use:
```
/schedule bibliography-maintainer incremental --cron "0 9 * * 1"
```

This runs every Monday at 9am, searching only last 7 days of papers.

## Completion Protocol

When all agents complete, the Orchestrator:
1. Verifies all output files exist and are non-empty
2. Runs `ingest_to_chromadb.py --dry-run` to validate chunks
3. Reports: papers found, analyses created, formulas extracted, axes identified, chunks prepared
4. Proposes git commit if changes are significant
