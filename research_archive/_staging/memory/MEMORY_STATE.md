# MEMORY_STATE — Bibliography System Persistent Memory

> This file is the SINGLE SOURCE OF TRUTH for inter-session continuity.
> Every agent MUST read this file FIRST before starting work.
> Every agent MUST update this file LAST after completing work.

## Last Execution
- **Run ID**: RUN-008
- **Date**: 2026-04-09
- **Mode**: incremental scoped (P128-P130, note-triggered bibliography gap — Kang + CodeAct + ToolSandbox)
- **Status**: SUCCESS
- **Duration**: ~20 min (scoped orchestrator: curl PDF download + single ANALYST sub-agent + generate_chunks_run008 + ingest_to_chromadb)
- **Previous**: RUN-007 (IEEE batch P122-P127, 2026-04-09)

## RUN-008 details (scoped note integration)
- **Trigger**: scoped bibliography verification of academic note `research_archive/manuscript/Note_Academique_Context_Isolated_Adversarial_Workflow.md` identified 3 refs not in corpus (Kang arXiv:2302.05733, Wang CodeAct arXiv:2402.01030, Lu ToolSandbox arXiv:2408.04682)
- **Anti-doublon post-hoc catch**: Crescendo (ref [13], arXiv:2404.01833) detected as DUPLICATE of P099 only via manual MANIFEST grep AFTER the verification agent had already WebFetched it. Process failure documented.
- **Fix implemented RUN-008**: `backend/tools/check_corpus_dedup.py` (158 lines, CLI + Python module, arXiv + title fallback, Windows UTF-8 stdout reconfigure) + `ANTI-DOUBLON ÉTAPE 0` section added to `.claude/rules/doctoral-research.md` + Step 0 mandatory pre-check added to `.claude/skills/bibliography-maintainer/SKILL.md` Agent Memory Protocol
- **New P-IDs attributed**: P128 (Kang Programmatic Behavior), P129 (CodeAct Wang ICML 2024), P130 (ToolSandbox Lu Apple NAACL 2025)

### RUN-008 RAG Injection Status (verified 2026-04-09 via direct ChromaDB metadata query)

| P-ID | Source | Chunks | Seuil AEGIS (>=5) |
|------|--------|--------|-------------------|
| P128 | P128_analysis.md (ANALYST subagent) | **9** | OK |
| P129 | P129_analysis.md (ANALYST subagent) | **9** | OK |
| P130 | P130_analysis.md (ANALYST subagent) | **10** | OK |
| **TOTAL new RUN-008** | — | **28 chunks appended** | **3/3 BLOCKED=0** |

- **3 PDFs arxiv downloaded** to `literature_for_rag/` (580 KB Kang + 4.3 MB CodeAct + 20 MB ToolSandbox)
- **Analyses FR via general-purpose sub-agent** (~420 s, 16 tool uses, 117k tokens, abstract + method + limitations + inline refs + AEGIS mapping)
- **Propagation doc_references/**: `2023/prompt_injection/P128_Kang_2023_ProgrammaticBehavior.md`, `2024/model_behavior/P129_Wang_2024_CodeAct.md`, `2024/benchmarks/P130_Lu_2024_ToolSandbox.md`
- **Post-injection verification**: 3/3 P-IDs validate the `>= 5 chunks` threshold (9, 9, 10)
- **aegis_bibliography collection**: 10743 → 10783 docs (+40 net, 151 upserts including re-chunks)

### RUN-008 Discovery commits (COMMITTED 2026-04-09 post-audit) + Gap proposals (still in todo)

Discoveries committed to `discoveries/DISCOVERIES_INDEX.md` ### MOYENNE — ajouts RUN-008 section (lines 54-62). Initial proposals from the ANALYST sub-agent used labels D-021/D-022/D-023, but these IDs were already taken (D-021 Knowledge repository from RUN-005, D-022 Paradoxe δ⁰/δ¹ from TC-002, D-023 Bimodalite from THESIS-001). Renumbered at commit time. Next free ID: D-029.

- **D-026** (P128 Kang, 8/10, committed RUN-008 + cross-validated 2026-04-09) — "Asymmetrie economique attaquant/defenseur". **Cross-validated against PDF**: LLM cost $0.0064-$0.016 per generation (confirmed 3+2 matches in P128_2302.05733.pdf Section 6), human cost $0.10 per generation (Holman et al. 2007 cited by Kang). **True ratio is ~6.25x-15.6x, NOT 125-500x as initially reported by ANALYST sub-agent** — the 125-500x was a hallucinated/over-extrapolated number, corrected in DISCOVERIES_INDEX.md D-026 entry. Supports C1, C4, C5. Confidence bumped 7→8 post cross-validation (numerical claims now verified via pypdf extraction).
- **D-027** (P129 CodeAct Wang ICML 2024, 8/10, committed RUN-008) — "Code-Action Amplification" — in a CodeAct agent, a prompt injection produces executable Python with agent privileges (files, APIs, subprocess), not just inert text. +20 pts absolute on M3ToolEval (GPT-4-1106: 52.4% JSON → 74.4% CodeAct). Supports C7, reinforces C2 indirectly. Creates gap G-023.
- **D-028** (P130 ToolSandbox Lu Apple NAACL 2025, 8/10, committed RUN-008) — "Insufficient Information = Tool Hallucination Floor" — model hallucinates tool calls rather than refusing when it lacks the required tool. Gap GPT-4o 73.0% vs best open-source 31.4% orthogonal to model size. Supports C5, indirectly C7. Creates gap G-024.

Historique row in DISCOVERIES_INDEX.md: `RUN-008 | D-026, D-027, D-028 | — | 25`.

New gaps flagged (NOT yet committed to `THESIS_GAPS.md`):
- **G-022** — absence d'evaluation longitudinale 2023-2026 du payload splitting Kang (fonctionne-t-il encore sur LLaMA 3.2 / GPT-4o / Claude 4 ?)
- **G-023** — absence de benchmark adversarial dedie aux agents CodeAct/ReAct code-based
- **G-024** — absence de version adversariale de ToolSandbox. **Axe de recherche direct pour AEGIS** : construire "AdversarialToolSandbox" en contexte medical robotique (Da Vinci Xi) — opportunite de contribution originale

Partial closures (to formalize in next SCIENTIST run):
- **G-010 partiellement adresse** (Kang) : modelisation economique dual-use integree
- **G-012 partiellement adresse** (CodeAct) : evaluation systematique 17 LLMs tool-use
- **G-015 partiellement adresse** (ToolSandbox) : benchmark stateful multi-turn disponible

### RUN-008 Known risks
- **P128 Kang** : les chiffres experimentaux exacts (0.0064-0.016 USD par email, 125-500x cost ratio) proviennent de WebSearch + Semantic Scholar car l'arXiv HTML v1 renvoyait 404 et le PDF n'a pas ete parse par le sub-agent. A cross-valider contre PDF complet lors du prochain audit-these.
- **Scooping risk P126 (existant)** persistant, non affecte par RUN-008.
- **Coverage Summary de MANIFEST.md** non mise a jour (counts par domaine/annee). A fixer lors du prochain full LIBRARIAN pass.

## RUN-007 details (IEEE batch)
- **User input**: 8 IEEE references (bibliography for state-of-art thesis section)
- **Anti-doublon results**:
  - Liu 2023 (arXiv:2306.05499) → DEJA present en P001 (HouYi) → SKIP
  - Multi-Agent Defense (arXiv:2509.14285) → DEJA present en P002 → SKIP
- **New P-IDs attributed**: P122 (OWASP Cheat Sheet), P123 (OWASP LLM01:2025), P124 (CAPTURE), P125 (Systematic Analysis 36 LLMs), P126 (Design Patterns Tramèr), P127 (IPI Competition)
- **Critical finding**: P126 (Beurer-Kellner, Tramèr et al.) propose "provable resistance" via design patterns — **RISQUE DE SCOOPING pour C2/δ³**. Action P0 : telecharger PDF et comparer avec AEGIS architecture.

### RUN-007 RAG Injection Status (verified 2026-04-09)

| P-ID | Source | Chunks | Seuil AEGIS (>=5) |
|------|--------|--------|-------------------|
| P122 | P122_OWASP_CheatSheet_PromptInjection.md | **5** | OK |
| P123 | P123_OWASP_LLM01_2025_PromptInjection.md | **11** | OK (enrichi apres 4 chunks initial) |
| P124 | P124_2505.12368.pdf (CAPTURE) | **38** | OK |
| P125 | P125_2410.23308.pdf (Systematic Analysis) | **55** | OK |
| P126 | P126_2506.08837.pdf (Design Patterns) | **101** | OK |
| P127 | P127_2603.15714.pdf (IPI Competition) | **122** | OK |
| **TOTAL** | — | **332 chunks** | **6/6 BLOCKED=0** |

- **4 PDFs arxiv telecharges** dans `literature_for_rag/` (total 6.6 MB)
- **2 fichiers markdown OWASP** uploades directement (standards industriels sans PDF)
- **Post-injection verification** : 6/6 P-IDs valident le seuil `>= 5 chunks`
- **RagSanitizer** peut maintenant retrieve ces refs via query ChromaDB

## Counters (cumulative)
| Metric | Count | Last Updated |
|--------|-------|-------------|
| Papers total | **127** | RUN-007 |
| Papers analyzed | **127** | RUN-007 |
| Papers 2025-2026 (analyzed) | 95+ | RUN-007 |
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
- Unicode notation: 82 δ⁰/1/2/3 → δ⁰/δ¹/δ²/δ³ fixed
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
