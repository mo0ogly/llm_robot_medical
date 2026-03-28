# CLAUDE.md — Project Rules for poc_medical

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

## SINGLE SOURCE OF TRUTH — Strict Homogeneity

**CRITICAL**: Backend and frontend MUST be strictly synchronized. NEVER have different data in Python vs JavaScript.

**Architecture rule**: Data is defined ONCE, in Python (backend), and served via API. The frontend consumes the API. NO hardcoded data in .jsx/.js files that duplicates or contradicts backend data.

| Data | Single Source | Consumed by |
|------|-------------|-------------|
| Attack templates (52) | `backend/attack_catalog.py` | Frontend via `/api/redteam/catalog` |
| Scenarios (37) | `backend/scenarios.py` | Frontend via `/api/redteam/scenarios` |
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
- **52 attack templates** in `frontend/src/components/redteam/attackTemplates.js`
- **52 help modals** in `frontend/src/components/redteam/ScenarioHelpModal.jsx`
- **37 scenarios** in `frontend/src/components/redteam/ScenarioTab.jsx`
- **Thesis docs** in `research_archive/manuscript/`

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

## Statistical Validity

- Sep(M) requires N >= 30 per condition
- Sep(M) = 0 with 0 violations is a statistical floor artifact
- Always flag `statistically_valid: false` when conditions not met

## Key References

- Liu et al. (2023) — Prompt Injection, arXiv:2306.05499
- Zverev et al. (2025) — Separation Score, ICLR 2025
- Reimers & Gurevych (2019) — Sentence-BERT
- Cosine drift model: all-MiniLM-L6-v2
