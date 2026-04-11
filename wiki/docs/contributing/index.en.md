# Contribution guide

!!! abstract "Project rules"
    All rules are in `.claude/CLAUDE.md` and `.claude/rules/*.md`. This page summarizes
    them for external contributors.

## 1. Dev environment

```bash
# Clone
git clone https://github.com/pizzif/poc_medical
cd poc_medical

# Python 3.13
python -m venv venv
source venv/bin/activate  # Linux/Mac
# .\venv\Scripts\Activate.ps1  # Windows
pip install -r backend/requirements.txt

# Frontend
cd frontend
npm install

# Start (Windows)
.\aegis.ps1 start
# Start (Linux/Mac)
./aegis.sh start
```

## 2. Absolute rules (CLAUDE.md)

### ZERO placeholder / ZERO decorative

1. **ZERO placeholder** — every UI element is connected to a real backend API call
2. **ZERO decorative** — no Matrix rain, no fake "SYSTEM COMPROMISED"
3. **ZERO emoticon** in the code unless explicitly requested by the user
4. **ZERO approximation** — doctoral thesis, nothing without proof

**Audit**: `grep -rn 'setTimeout\|EXPLOITATION SUCCESSFUL\|SYSTEM COMPROMISED' frontend/src/` →
**0 results expected**.

### Process management

!!! danger "NEVER use direct commands"
    Always via `aegis.ps1` (Windows) / `aegis.sh` (Linux):

    ```powershell
    .\aegis.ps1 start       # Start backend + frontend + wiki
    .\aegis.ps1 stop        # Stop all services
    .\aegis.ps1 restart     # Restart cleanly
    .\aegis.ps1 health      # Healthcheck all endpoints
    .\aegis.ps1 build       # Build frontend + wiki
    .\aegis.ps1 logs        # Tail logs
    .\aegis.ps1 test        # Run pytest
    ```

## 3. Language-specific rules

### Python (backend)

- **FastAPI** with routes in `backend/routes/`
- No `print()` in production — use `logging`
- **Type hints** on public functions
- **Docstrings in English**, FR comments OK
- No secrets in the code — `.env` (gitignore)

### React (frontend)

- **No emoticons** in code or UI strings
- **Required i18n**: `t('key')` for any visible text
- **Template literal bug**: no `${}` in standalone .jsx functions (use concatenation)
- **Tailwind v4** — utility classes, no custom CSS unless necessary
- **Red Team components**: `frontend/src/components/redteam/`

### General

- **ZERO useless import** — clean up after refactoring
- **ZERO orphan file** — remove if no longer used
- **Every created file must be referenced** somewhere

## 4. The 800-line rule

!!! warning "No source file must exceed 800 lines"
    Applies to **all types**: `.py`, `.jsx`, `.js`, `.ts`, `.tsx`, `.go`, `.md`, `.json`, `.yaml`.

    **Exceptions**:

    - Auto-generated files (lockfiles, dist/)
    - JSON datasets (chroma_db dumps)
    - Thesis manuscript (`research_archive/manuscript/`)

    **Enforcement**: `file_size_check.cjs` hook in PreToolUse on Edit/Write.

    **Refactoring**:

    - 700 lines → start planning decomposition
    - 800 lines → **mandatory decomposition** into logical modules
    - Decomposition by **responsibility** (one module = one responsibility)

## 5. Claude Code hooks

### `.claude/hooks/`

| Hook | Event | Role |
|------|-------|------|
| `secret-scanner.cjs` | PreToolUse Write/Edit | Blocks API keys, tokens, passwords |
| `file_size_check.cjs` | PreToolUse Write/Edit | Blocks files > 800 lines |
| `frustration-detector.cjs` | UserPromptSubmit | Detects frustration patterns |
| `session_start_primer.cjs` | SessionStart | Loads project context |
| `safe_pipeline_checker.cjs` | PreToolUse Bash | Prevents destructive commands |

## 6. Content Filter Safety

!!! danger "Sensitive files — NEVER read the full content"

    The Claude content filter blocks some files containing adversarial payloads. NEVER
    read:

    - `backend/scenarios.py` — contains the 48 scenarios with payloads
    - `backend/attack_catalog.py`
    - `backend/prompts/*.json` (`"template"` field)
    - `frontend/src/i18n.js` (full text values)

    **Work via**:

    - Metadata only (name, id, layer, description)
    - Associated `.md` files (safe because contextualized)
    - Sub-agents: **always include** *"NEVER read the full content of sensitive files"* in
      the prompt

    **3-layer pattern** to write payloads without tripping the filter:

    1. Orchestrator stays general (no adversarial content)
    2. Forge subagent generates the prompts (scoped adversarial content)
    3. Python script writes the final JSON (no LLM involved)

## 7. Git workflow

- **Branches**: `main` is protected, PR only
- **Commits**:
  - `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
  - Messages in English, concise, format `<type>(<scope>): <message>`
- **Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- **research_archive/** is **in .gitignore** — force add with `git add -f` for thesis docs
- **No `houyi`** in file names (project convention)

### Example commit

```bash
git commit -m "$(cat <<'EOF'
feat(run-008): anti-doublon framework + SessionStart primer + scenarios.py structural fix

Implement check_corpus_dedup.py to cross-check arXiv IDs against MANIFEST.md
before any bibliographic integration. Add session_start_primer.cjs hook to
load project context automatically. Fix structural bugs in scenarios.py:
48 scenarios validated via test_scenarios.py.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

## 8. Mandatory tests before merge

```bash
# Backend tests
cd backend && python -m pytest tests/ -v

# Frontend lint + build
cd frontend && npm run lint && npm run build

# Thesis audit (AEGIS rule)
/audit-these full

# Delta notation check
python backend/tools/check_delta_notation.py

# Secret scan
git diff --staged | grep -i "api_key\|password\|token"
# Expected: empty
```

## 9. Mandatory documentation after changes

1. **`README.md`** (EN) + **`README_FR.md`** (FR) + **`README_BR.md`** (BR)
2. `backend/README.md` — accounts, API docs
3. `ScenarioHelpModal.jsx` — help modals if new scenario
4. `formal_framework_complete.md` — if framework change
5. `INTEGRATION_TRACKER.md` — if external integration
6. Wiki: `wiki/docs/` + rebuild `python build_wiki.py && python -m mkdocs build`

## 10. Skills to use per situation

| Situation | Skill |
|-----------|-------|
| Structured implementation | `/apex` (10 steps) |
| Quality audit | `/audit-pdca` (benchmark + recipe) |
| New analysis sheet | `/fiche-attaque [num]` |
| Bibliographic research | `/bibliography-maintainer incremental` |
| PDCA orchestration | `/research-director cycle` |
| New attack prompt | `/aegis-prompt-forge FORGE` |
| New scenario | `/add-scenario` (6 agents) |
| Campaign results analysis | `/experimentalist [experiment_id]` |
| Gap to campaign | `/experiment-planner [gap_id]` |
| Results to manuscript | `/thesis-writer [conjecture_id]` |
| Wiki publication | `/wiki-publish update` |

## 11. Mandatory trilingual

**Any visible text**: `t('key')` via `react-i18next`. **NEVER** a hardcoded string.

**3 languages**: FR / EN / BR. See [i18n/index.md](../i18n/index.md).

## 12. δ notation — mandatory Unicode

**ALWAYS** `δ⁰ δ¹ δ² δ³` in the documentation. **NEVER** `delta-0 / delta-1 / delta-2 / delta-3`.

Exception: Python/JSX source code where ASCII is required (dictionary keys).

See [notation-delta.md](../notation-delta.md).

## 13. Doctoral statistics

- **Sep(M) N >= 30** per condition, Sep(M)=0 with 0 violations = **artifact**
- **Tags**: `[ARTICLE VERIFIE]` / `[PREPRINT]` / `[HYPOTHESE]` / `[CALCUL VERIFIE]` / `[EXPERIMENTAL]`
- **Pre-check** 5 baseline runs before any N >= 30 campaign
- **Maximum 3 iterations** per campaign, then human escalation

## 14. Quality audit — `/audit-these`

- Each session BEGINS and ENDS with `/audit-these full`
- No batch "done" without audit (`lint_sources.py > 5% NONE = NOT DONE`)
- **Cross-validation**: 3 random numbers verified against ChromaDB fulltext after every
  batch
- If 1 number is wrong → redo the **entire** batch
- **Maximum 3 agents in parallel** (auditability)
- Any claim of *"the only"*, *"the first"* → WebSearch verification **BEFORE** publication

## 15. Resources

- :material-file-document: [CLAUDE.md](https://github.com/pizzif/poc_medical/blob/main/.claude/CLAUDE.md)
- :material-file-document: [rules/programming.md](https://github.com/pizzif/poc_medical/blob/main/.claude/rules/programming.md)
- :material-file-document: [rules/doctoral-research.md](https://github.com/pizzif/poc_medical/blob/main/.claude/rules/doctoral-research.md)
- :material-file-document: [rules/redteam-analysis.md](https://github.com/pizzif/poc_medical/blob/main/.claude/rules/redteam-analysis.md)
- :material-robot: [Claude Code docs](https://docs.claude.com/en/docs/claude-code)
