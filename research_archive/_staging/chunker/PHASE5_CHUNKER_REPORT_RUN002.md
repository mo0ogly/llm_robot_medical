# PHASE 5 -- CHUNKER REPORT (RUN-002 Incremental)

**Date**: 2026-04-04
**Agent**: CHUNKER
**Mode**: Incremental (append to RUN-001)
**Status**: COMPLETE

---

## 1. Chunk Statistics

| Metric | RUN-001 | RUN-002 | Total |
|--------|---------|---------|-------|
| **Chunks** | 290 | 164 | **454** |
| **Est. Tokens** | 56,189 | ~68,327 | **~124,516** |
| **Avg Tokens/Chunk** | 193.8 | 416.6 | 274.3 |
| **Papers Covered** | P001-P034 | P035-P046 | P001-P046 |
| **Source Files** | ~25 | ~30 | ~55 |

---

## 2. Chunks by Source Agent

| Agent | RUN-001 | RUN-002 | Total |
|-------|---------|---------|-------|
| analyst | 183 | 46 | 229 |
| matheux | 30 | 32 | 62 |
| cybersec | 39 | 25 | 64 |
| whitehacker | 30 | 24 | 54 |
| mathteacher | 0 | 19 | 19 |
| scientist | 0 | 6 | 6 |
| librarian | 8 | 12 | 20 |
| collector | 10 | 0 | 10 |

**New agents in RUN-002**: mathteacher (19 chunks), scientist (6 chunks) -- these agents produced files during RUN-001 but were not chunked until RUN-002 incremental processing captured their new sections.

---

## 3. Chunks by Type

| Type | RUN-002 Count | Description |
|------|--------------|-------------|
| analysis | 22 | Paper resume/summary chunks (P035-P046) |
| formula | 44 | Mathematical formulas with explanations and examples |
| research_axis | 16 | Research gaps, conjecture links, cross-analysis |
| threat_model | 25 | MITRE ATT&CK mappings, defense coverage, gap analysis |
| technique | 12 | Red team playbook techniques T19-T30 |
| poc | 12 | Exploitation guide entries E13-E24 |
| curriculum | 13 | Mathteacher module sections (Modules 02, 04, 05) |
| exercise | 5 | Practice exercises and self-assessment quizzes |
| index | 13 | Librarian reference cards + bibliographic map |
| conjecture | 1 | C7 conjecture validation (reasoning paradox) |
| glossary | 1 | Symbol glossary 2026 additions |

---

## 4. Chunks by Paper

| Paper | Chunks Referencing | Key Contribution |
|-------|-------------------|------------------|
| P035 | 26 | MPIB benchmark, CHER metric, medical safety |
| P036 | 25 | LRM autonomous jailbreak, 97.14% ASR, Nature Communications |
| P039 | 25 | GRP-Obliteration, single-prompt unalignment, Microsoft Research |
| P041 | 25 | Magic token co-training, SAM metric, 8B > 671B |
| P044 | 25 | AdvJudge-Zero, judge fuzzing, 99% bypass, Unit 42 |
| P046 | 24 | ADPO, adversarial DPO for VLMs, PGD training |
| P043 | 22 | JBDistill, renewable benchmarks, 81.8% effectiveness |
| P045 | 20 | System prompt poisoning, persistent attack, Auto-SPP |
| P038 | 18 | InstruCoT defense, instruction-level CoT, >90% DR |
| P042 | 17 | PromptArmor, <1% FPR/FNR, LLM-as-guardrail |
| P037 | 16 | Three-dimensional survey, VLM extension, unified defense |
| P040 | 14 | Emotional manipulation, healthcare misinformation, 6x amplification |

---

## 5. Source Files Chunked (RUN-002)

### Analyst Reports (12 files, 46 chunks)
- `research_archive/_staging/analyst/P035_analysis.md` through `P046_analysis.md`
- Each file produced 3-4 chunks: resume, formulas, research gaps + conjectures

### Matheux (2 files, 32 chunks)
- `GLOSSAIRE_DETAILED.md` Section 8: 15 formulas, each split into formula+explanation and example chunks (30 chunks)
- `MATH_DEPENDENCIES.md`: New critical paths 5-8 + delta mapping (2 chunks)

### Cybersec (2 files, 25 chunks)
- `THREAT_ANALYSIS.md` Phase 2: 12 paper entries, each with threat model + gap analysis (24 chunks)
- `DEFENSE_COVERAGE_ANALYSIS.md`: Updated defense coverage (1 chunk)

### Whitehacker (2 files, 24 chunks)
- `RED_TEAM_PLAYBOOK.md` T19-T30: 12 techniques (12 chunks)
- `EXPLOITATION_GUIDE.md` E13-E24: 12 PoC entries (12 chunks)

### Mathteacher (5 files, 19 chunks)
- `Module_04_Scores_Metriques.md`: 8 new sections (Parties G-N) + exercises (10 chunks)
- `Module_05_Optimisation_Alignement.md`: 5 new sections (Parties H-L) + exercises (7 chunks)
- `Module_02_Probabilites_Statistiques.md`: 1 new section (1 chunk)
- `GLOSSAIRE_SYMBOLES.md`: 2026 additions (1 chunk)
- `SELF_ASSESSMENT_QUIZ.md`: 2026 questions (0 chunks -- no 2026 marker found)

### Scientist (5 files, 6 chunks)
- `AXES_DE_RECHERCHE.md`: Axe 9 + summary table (2 chunks)
- `ANALYSE_CROISEE.md`: 2026 patterns (1 chunk)
- `POSITIONNEMENT_THESE.md`: SWOT update (1 chunk)
- `CONJECTURES_VALIDATION.md`: C7 added (1 chunk)
- `CARTE_BIBLIOGRAPHIQUE.md`: 2026 cluster (1 chunk)

### Librarian (12 files, 12 chunks)
- `research_archive/doc_references/2026/` subdirectories: 12 paper index files (1 chunk each)

---

## 6. delta-Layer Coverage (RUN-002)

| Layer | Chunks | Key Papers |
|-------|--------|------------|
| δ⁰ | 98 | P036 (alignment regression), P039 (obliteration), P038 (InstruCoT), P041 (magic token), P046 (ADPO) |
| δ¹ | 72 | P035 (RAG injection), P036 (multi-turn erosion), P040 (emotional), P042 (PromptArmor), P045 (SPP) |
| δ² | 30 | P037 (unified defense), P042 (detect-then-clean), P044 (control tokens bypass) |
| δ³ | 18 | P039 (implies necessity), P044 (judge manipulation), P045 (integrity verification) |

---

## 7. Conjecture Coverage (RUN-002)

| Conjecture | Supporting Chunks | Strongest New Evidence |
|------------|------------------|----------------------|
| C1 (Insuffisance δ¹) | 87 | P036: 97.14% ASR bypasses all δ¹ defenses |
| C2 (Necessite δ³) | 76 | P039: single-prompt obliteration makes formal verification mandatory |
| C3 (Shallow alignment) | 58 | P039: alignment so shallow a single prompt erases it |
| C4 (Scaling independence) | 42 | P041: 8B model > 671B in safety; P036: Qwen3 235B less effective than smaller |
| C5 (Cross-layer interaction) | 32 | P045: δ¹ compromised propagates to all dependent layers |
| C6 (Medical specificity) | 18 | P035: CHER shows medical domain needs dedicated metrics |
| C7 (Reasoning paradox) -- NEW | 1 | P036: reasoning capability correlates with offensive capability |

---

## 8. DIFF Section (RUN-001 vs RUN-002)

### New in RUN-002:
- **+164 chunks** appended (IDs: RUN002_C001 through RUN002_C164)
- **+12 papers** covered (P035-P046, all 2026 publications)
- **+15 formulas** in glossary (Section 8: CHER, GRPO, ADPO, PGD, SAM, CoSA, Logit Gap, etc.)
- **+12 red team techniques** (T19-T30)
- **+12 exploitation guides** (E13-E24)
- **+1 research axis** (Axe 9: LRM autonomous agents)
- **+1 conjecture** (C7: reasoning paradox)
- **+4 new critical paths** in formula DAG (Paths 5-8)
- **+2 new agent categories** chunked: mathteacher, scientist

### Unchanged from RUN-001:
- All 290 existing chunks preserved (lines 1-290 in JSONL)
- No re-chunking of RUN-001 files
- Existing chunk IDs unchanged

### Quality Metrics:
- Average chunk size increased from 193.8 to 416.6 tokens (RUN-002 has richer content per chunk)
- All chunks have complete metadata (chunk_id, source_agent, paper_ids, chunk_type, delta_layers, conjectures, keywords, language, run_id)
- Semantic boundaries respected: no mid-formula or mid-table splits

---

## 9. Ingestion Notes

The `ingest_to_chromadb.py` script should handle incremental ingestion by:
1. Reading all 454 lines from `chunks_for_rag.jsonl`
2. Checking existing chunk_ids in ChromaDB
3. Only inserting chunks with new IDs (RUN002_C*)
4. Using `chunk_id` as the document ID for deduplication

---

*CHUNKER Agent -- PHASE5_CHUNKER_REPORT_RUN002.md*
*164 new chunks, 12 papers, 7 agents, 11 chunk types*
*Version: v2.0 (RUN-002 incremental)*
*Generated: 2026-04-04*
