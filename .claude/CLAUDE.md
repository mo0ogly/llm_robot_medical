# CLAUDE.md — Project Rules for poc_medical

## ZERO PLACEHOLDER / ZERO DECORATIVE — ABSOLUTE RULE

**THIS IS A DOCTORAL THESIS PROJECT (ENS, 2026), NOT A DEMO OR AWARENESS TOOL.**

**CAPITAL RULE — NO EXCEPTIONS:**
1. **ZERO placeholder** — Every UI element MUST be wired to a real backend API call. No `setTimeout` faking progress, no hardcoded "SUCCESS" messages, no simulated terminal output.
2. **ZERO decorative** — No Matrix rain, no fake exploitation animations, no theatrical "SYSTEM COMPROMISED" messages unless they reflect an actual API response.
3. **Every phase shown in the UI MUST correspond to a real operation**: a real HTTP request, a real computation, a real LLM call.
4. **Terminal/console outputs** must display real data returned by the backend (actual response text, actual scores, actual timing).
5. **If a UI component cannot be wired to a real backend call, it must be removed** — not left as decoration.

**Why**: The thesis director will reject any component that simulates results. Every visual element must be scientifically reproducible and traceable to real data.

**Audit check**: `grep -rn 'setTimeout\|EXPLOITATION SUCCESSFUL\|SYSTEM COMPROMISED\|MatrixRain\|animate-matrix' frontend/src/` — any match is a violation.

## Mandatory Post-Change Documentation Checklist

**AFTER EVERY feature, fix, or integration** — before declaring "done":

1. **README.md** (EN) — update counts, add new sections if needed
2. **README_FR.md** (FR) — same updates in French
3. **README_BR.md** (BR) — same updates in Portuguese
4. **backend/README.md** — update chain counts, API docs
5. **ScenarioHelpModal.jsx** — add/update help modals for new scenarios
6. **formal_framework_complete.md** — update thesis documentation
7. **ScenariosView.jsx** — update badge count if scenarios changed
8. **INTEGRATION_TRACKER.md** — update if integration work

**Rule**: Never say "done" without checking ALL relevant docs are updated. If the user has to ask "is this documented?" — it wasn't.

## Mandatory Trilingual i18n (FR / EN / BR)

**CRITICAL**: ALL user-visible strings in the frontend MUST be trilingual (French, English, Brazilian Portuguese). This is a non-negotiable rule.

**Rules**:
1. **NEVER hardcode** user-visible strings in .jsx/.js files. Always use `t('key')` from react-i18next.
2. **EVERY new string** must have a key in `frontend/src/i18n.js` in ALL THREE language sections (fr, en, br).
3. **Key naming**: Use the component namespace prefix (e.g., `redteam.studio.v2.*`, `redteam.catalog.*`, `redteam.scenarios.*`).
4. **Technical terms** (BREACH, SVC, Sep(M), MITRE, HL7, etc.) stay in English across all languages.
5. **Scientific content** (formal framework references, formulas, dimension labels) stays in English — these are academic terms.
6. **Help modals** (ScenarioHelpModal, StudioHelpModal): UI chrome (headers, buttons, labels) must be trilingual. Academic content body can remain English-only.
7. **Verification**: After adding any new component or UI element, grep for hardcoded strings: `grep -n '"[A-Z]' file.jsx | grep -v className | grep -v import` — any match is a potential i18n violation.
8. **Language selector**: The Command Center (Red Team Lab) has its own language dropdown in the header (RedTeamDrawer.jsx). Both the main app and the lab support FR/EN/BR switching.

**When adding a new feature**:
1. Write all UI strings as `t('namespace.key')` from the start
2. Add keys to i18n.js in all 3 sections simultaneously
3. Test in FR and EN before declaring done

## SINGLE SOURCE OF TRUTH — Strict Homogeneity

**CRITICAL**: Backend and frontend MUST be strictly synchronized. NEVER have different data in Python vs JavaScript.

**Architecture rule**: Data is defined ONCE, in Python (backend), and served via API. The frontend consumes the API. NO hardcoded data in .jsx/.js files that duplicates or contradicts backend data.

| Data | Single Source | Consumed by |
|------|-------------|-------------|
| Attack templates (51 + 1 Custom UI) | `backend/attack_catalog.py` | Frontend via `/api/redteam/catalog` |
| Scenarios (48) | `backend/scenarios.py` | Frontend via `/api/redteam/scenarios` |
| Chain registry (34) | `backend/agents/attack_chains/__init__.py` | Frontend via `/api/redteam/chains` |
| Help content | `ScenarioHelpModal.jsx` (frontend-only, OK) | Frontend only |

**Violations to catch**:
- Frontend has data that backend doesn't serve → SYNC backend
- Backend has data that frontend doesn't display → SYNC frontend
- Counts differ between README/frontend/backend → FIX immediately
- Demo fallback data diverges from backend data → REGENERATE from backend

**When adding a new template/scenario/chain**:
1. Add in backend (Python) FIRST
2. Expose via API endpoint
3. Frontend consumes API (no local copy)
4. Demo fallback auto-generated from backend export if needed
5. Update all docs (checklist above)

## Project Structure

- **Frontend**: React 18 + Vite + Tailwind v4 (port 5173)
- **Backend**: FastAPI + Ollama + ChromaDB (port 8042)
- **34 attack chains** in `backend/agents/attack_chains/`
- **52 attack templates** in `frontend/src/components/redteam/attackTemplates.js` (51 from backend + 1 Custom UI placeholder)
- **48 scenarios** in `backend/scenarios.py` served via `/api/redteam/scenarios`
- **Help modals** in `frontend/src/components/redteam/ScenarioHelpModal.jsx`
- **Thesis docs** in `research_archive/manuscript/`

## Process Management — MANDATORY

**NEVER run raw process commands.** All start/stop/restart/build operations MUST go through the AEGIS scripts.

| OS | Script | Location |
|----|--------|----------|
| Windows (PowerShell) | `.\aegis.ps1` | project root |
| Linux / macOS / WSL | `./aegis.sh` | project root |

**Enforced by hook** `.claude/hooks/process_guard.sh` — direct `uvicorn` or `npm run dev` calls are blocked.

### Command reference

```
# Start
.\aegis.ps1 start              # start backend + frontend
.\aegis.ps1 start backend      # backend only (:8042)
.\aegis.ps1 start frontend     # frontend only (:5173)

# Stop / Kill
.\aegis.ps1 stop               # stop both
.\aegis.ps1 kill-port 8042     # force-kill port 8042
.\aegis.ps1 kill-port 5173     # force-kill port 5173

# Restart
.\aegis.ps1 restart            # stop + start both
.\aegis.ps1 restart backend    # restart backend only

# Health
.\aegis.ps1 health             # HTTP check :8042 + :5173 + :11434

# Build
.\aegis.ps1 build              # build frontend + check backend syntax
.\aegis.ps1 build frontend     # Vite build only
.\aegis.ps1 build backend      # py_compile check only

# Logs
.\aegis.ps1 logs               # tail logs/backend.log + logs/frontend.log

# Interactive menu
.\aegis.ps1                    # full TUI menu
```

### If a command is missing from the scripts

Add it to **both** `aegis.ps1` AND `aegis.sh` following the existing pattern:
- PS1: add a function `Verb-Target` and register in `Invoke-*` dispatch
- SH: add a function `verb_target` and register in `do_*` dispatch + interactive menu

### Log files
- `logs/backend.log` — uvicorn stdout/stderr
- `logs/frontend.log` — Vite dev server stdout/stderr
- `logs/build_frontend.log` — last Vite build output

## Template Literal Bug (esbuild/JSX)

Do NOT use template literals with `${}` in standalone functions in `.jsx` files — esbuild chokes on them. Use string concatenation instead:
```js
// BAD in .jsx
a.download = `aegis_${date}.csv`;
// GOOD in .jsx
a.download = 'aegis_' + date + '.csv';
```

## Git Conventions

- No `houyi` references in file/module names (reference in README only)
- All docstrings in English
- Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
- `research_archive/` is in .gitignore — use `git add -f` for thesis docs
- **Exception PDCA C-52**: `research_archive/manuscript/` files are intentionally tracked via `git add -f` (thesis deliverables). This is NOT a violation — the .gitignore prevents accidental additions but thesis docs require explicit tracking.

## Statistical Validity

- Sep(M) requires N >= 30 per condition
- Sep(M) = 0 with 0 violations is a statistical floor artifact
- Always flag `statistically_valid: false` when conditions not met

## Content Filter Safety — MANDATORY for all agents

This project is a **doctoral thesis red team security lab**. The codebase contains adversarial payloads, prompt injection templates, and offensive security scenarios by design. These trigger Anthropic's content filter when read or displayed in full.

**Rules to prevent content filter blocks:**

1. **NEVER read full file contents** of: `scenarios.py`, `attack_catalog.py`, `attackTemplates.js`, `red_team_agent.py`, `components.py` (genetic_engine), `i18n.js`, `ScenarioHelpModal.jsx`. Use `grep -c` (count) or `grep -n` on specific patterns only.
2. **NEVER display** payload content, template messages, or scenario step messages in tool output or conversation. Use counts, line numbers, or structural checks instead.
3. **For build output**: pipe through `grep -c "error"` or `tail -1` — never display the full Vite build log (it contains compiled payload strings).
4. **For API responses**: check HTTP status codes with `curl -s -o /dev/null -w "%{http_code}"` — never display response bodies that contain scenario data.
5. **For grep searches**: prefer `grep -c` (count) over `grep` (content). When content is needed, limit to `head -1` or use very specific patterns.
6. **Subagents**: ALL agents spawned via the Agent tool MUST receive the instruction "NE LIS JAMAIS le contenu complet des fichiers sensibles du projet" in their prompt.
7. **If a filter block occurs**: do NOT retry the same operation. Switch to a count-based or structural approach that avoids reading/displaying the sensitive content.

**Safe files** (can be read freely): `server.py` (routes only, skip prompt strings), `orchestrator.py` (structure only), `telemetry_bus.py`, `LogsView.jsx`, `RedTeamLayout.jsx`, `i18n.js` (only the key names, not the values).

## Key References

- Liu et al. (2023) — Prompt Injection, arXiv:2306.05499
- Zverev et al. (2025) — Separation Score, ICLR 2025
- Reimers & Gurevych (2019) — Sentence-BERT
- Cosine drift model: all-MiniLM-L6-v2
