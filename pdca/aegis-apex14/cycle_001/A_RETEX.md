# A_RETEX — AEGIS APEX 1-4 — Cycle 1 — 2026-04-18

## What was delivered

| APEX | Feature | Status |
|------|---------|--------|
| 1 | Protocol P-δ⁰ backend (run_delta0_protocol, Wilson CI, persistence) | DONE |
| 1 | Definition 3.3bis in formal_framework_complete.md | DONE |
| 1 | /api/redteam/delta0-protocol + /api/redteam/analysis/delta0-summary | DONE |
| 1 | target_delta reclassification (#08 → delta0, #11 → delta0) | DONE |
| 2 | Cross-model: create_medical_robot_agent(provider, model) | DONE |
| 2 | /api/redteam/llm-providers + AdversarialStudio provider state | DONE |
| 2 | InjectionLabPanel provider/model selector | DONE |
| 3 | ForgePanel: Test δ⁰ button wired to /api/redteam/delta0-protocol | DONE |
| 3 | wordDiff import + A/B split view wiring in ForgePanel | DONE |
| 3 | AnalysisView: useDelta0Summary hook + Attribution P-δ⁰ panel | DONE |
| 4 | doc_librarian: [HELP_FILES] OK (3 new .md, 3 sections fixed) | DONE |
| 4 | READMEs EN/FR/BR: 40 chains, 122 templates, Protocol P-δ⁰ | DONE |
| 4 | backend/README.md: 6 new endpoints documented | DONE |
| 4 | delta0_formal_chapter.docx (24KB, 8 sections) | DONE |
| 4 | Notation: 0 delta-N occurrences in 6 file categories | DONE |
| 4 | CLAUDE.md: δ⁰ notation rule + audit command | DONE |

## Root causes for the two warnings

### W1 — PRELIMINARY fixture (N=15, not N=30)
**Cause**: Ollama was offline during implementation.
**Correct behavior**: `statistically_valid: false` and `_note: "PRELIMINARY fixture"` — the code correctly self-reports its status.
**Fix**: Run P-δ⁰ protocol N≥30 on #07 and #08 when Ollama online. One real run auto-replaces the fixture.

### W2 — File size violations (orchestrator.py 1275, server.py 1167)
**Cause**: Both files pre-dated APEX. APEX 1-4 added ~80 lines to orchestrator.py.
**Impact**: None on correctness. The 800-line rule is a maintainability rule.
**Fix**: Decomposition plan in A_REMEDIATION/phase_4_low.md. Cycle 2 task.

## Lessons learned

### L1 — Backend stale process (from previous session)
`aegis.ps1 restart` spawns a new PowerShell window but doesn't kill bash-owned uvicorn PIDs.
**Rule added**: Kill by PID via PowerShell + restart via `bash aegis.sh start backend`.

### L2 — HMR crash from rapid edits
Multiple rapid edits to AnalysisView.jsx during live Vite HMR caused module state corruption.
**Rule**: When doing large edits to JSX files, batch changes and restart Vite once.

### L3 — Notation propagation
`delta-N` ASCII spread to ~200+ locations because no notation rule existed at project start.
**Rule**: CLAUDE.md notation rule + `grep` audit command now enforced.

### L4 — DOCX must be regenerated after source patching
The gen_delta0_chapter.js was patched for notation but the DOCX was not regenerated in the same session.
**Rule**: Whenever .js generator is patched for notation, immediately regenerate the output artifact.

## What to do in cycle 2

1. Run P-δ⁰ N≥30 on #07 and #08 (replace fixture)
2. Decompose orchestrator.py and server.py per phase_4_low.md
3. Verify attackTemplates.js is not a SSoT violation (C-71 from previous session — confirmed it's used by PlaygroundTab.jsx and TestSuitePanel.jsx legitimately)
4. Add `research_archive/manuscript/node_modules/` to .gitignore if not already
