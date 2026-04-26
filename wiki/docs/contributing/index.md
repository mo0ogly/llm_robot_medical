# Guide de contribution

!!! abstract "Regles projet"
    Toutes les regles sont dans `.claude/CLAUDE.md` et `.claude/rules/*.md`. Cette page les
    synthetise pour contributeurs externes.

## 1. Environnement de dev

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

## 2. Regles absolues (CLAUDE.md)

### ZERO placeholder / ZERO decoratif

1. **ZERO placeholder** — chaque element UI connecte a un vrai appel API backend
2. **ZERO decoratif** — pas de Matrix rain, pas de fake "SYSTEM COMPROMISED"
3. **ZERO emoticon** dans le code sauf demande explicite du user
4. **ZERO approximation** — these doctorale, rien sans preuve

**Audit** : `grep -rn 'setTimeout\|EXPLOITATION SUCCESSFUL\|SYSTEM COMPROMISED' frontend/src/` →
**0 resultat attendu**.

### Process management

!!! danger "JAMAIS de commandes directes"
    Toujours via `aegis.ps1` (Windows) / `aegis.sh` (Linux) :

    ```powershell
    # --- Services (backend :8042, frontend :5173, wiki :8001) ---
    .\aegis.ps1 start              # Lance backend + frontend + wiki
    .\aegis.ps1 start backend      # Un seul service
    .\aegis.ps1 stop               # Arrete tous les services
    .\aegis.ps1 restart            # Redemarre proprement
    .\aegis.ps1 health             # Healthcheck tous les endpoints

    # --- Build ---
    .\aegis.ps1 build              # Backend check + frontend Vite + wiki MkDocs
    .\aegis.ps1 build wiki         # build_wiki.py + mkdocs build --clean
    .\aegis.ps1 build frontend     # Vite production build

    # --- Recherche ---
    .\aegis.ps1 forge              # Moteur genetique (SSE, interactif)
    .\aegis.ps1 demo               # Triple convergence (210 runs)
    .\aegis.ps1 demo redteam       # Session red team autonome
    .\aegis.ps1 test               # pytest backend/tests/

    # --- Utilitaires ---
    .\aegis.ps1 logs               # Tail tous les logs
    .\aegis.ps1 logs wiki          # Tail wiki.log uniquement
    .\aegis.ps1 kill-port 8042     # Liberer un port force
    .\aegis.ps1                    # Menu interactif
    ```

    Equivalent Linux/macOS : remplacer `.\aegis.ps1` par `./aegis.sh`.

## 3. Regles specifiques par langage

### Python (backend)

- **FastAPI** avec routes dans `backend/routes/`
- Pas de `print()` en production — utiliser `logging`
- **Type hints** sur les fonctions publiques
- **Docstrings en anglais**, commentaires FR OK
- Pas de secrets dans le code — `.env` (gitignore)

### React (frontend)

- **Pas d'emoticons** dans code ou strings UI
- **i18n obligatoire** : `t('key')` pour tout texte visible
- **Template literal bug** : pas de `${}` dans fonctions standalone .jsx (utiliser concatenation)
- **Tailwind v4** — classes utilitaires, pas de CSS custom sauf necessaire
- **Composants Red Team** : `frontend/src/components/redteam/`

### General

- **ZERO import inutile** — nettoyer apres refactoring
- **ZERO fichier orphelin** — supprimer si plus utilise
- **Chaque fichier cree doit etre reference** quelque part

## 4. Regle des 800 lignes

!!! warning "Aucun fichier source ne doit depasser 800 lignes"
    S'applique a **tous types** : `.py`, `.jsx`, `.js`, `.ts`, `.tsx`, `.go`, `.md`, `.json`, `.yaml`.

    **Exceptions** :

    - Fichiers generes automatiquement (lockfiles, dist/)
    - Datasets JSON (chroma_db dumps)
    - Manuscrit de these (`research_archive/manuscript/`)

    **Enforcement** : hook `file_size_check.cjs` en PreToolUse sur Edit/Write.

    **Refactoring** :

    - 700 lignes → commencer a planifier la decomposition
    - 800 lignes → **decomposition obligatoire** en modules logiques
    - Decomposition par **responsabilite** (un module = une responsabilite)

## 5. Hooks Claude Code

### `.claude/hooks/`

| Hook | Event | Role |
|------|-------|------|
| `secret-scanner.cjs` | PreToolUse Write/Edit | Bloque les API keys, tokens, passwords |
| `file_size_check.cjs` | PreToolUse Write/Edit | Bloque les fichiers > 800 lignes |
| `frustration-detector.cjs` | UserPromptSubmit | Detecte les patterns de frustration |
| `session_start_primer.cjs` | SessionStart | Charge le contexte projet |
| `safe_pipeline_checker.cjs` | PreToolUse Bash | Empeche les commandes destructrices |

## 6. Content Filter Safety

!!! danger "Fichiers sensibles — NE JAMAIS lire le contenu complet"

    Le content filter Claude bloque certains fichiers contenant des payloads adversariaux. NE
    JAMAIS lire :

    - `backend/scenarios.py` — contient les 62 scenarios avec payloads
    - `backend/attack_catalog.py`
    - `backend/prompts/*.json` (champ `"template"`)
    - `frontend/src/i18n.js` (valeurs textuelles completes)

    **Travailler via** :

    - Metadonnees uniquement (nom, id, couche, description)
    - Fichiers `.md` associes (safe car contextualises)
    - Sub-agents : **toujours inclure** *"NE LIS JAMAIS le contenu complet des fichiers
      sensibles"* dans le prompt

    **Pattern 3-couches** pour ecrire des payloads sans bloquer le filter :

    1. Orchestrator reste general (pas de contenu adverse)
    2. Forge subagent genere les prompts (contenu adverse scope)
    3. Python script ecrit le JSON final (pas de LLM implique)

## 7. Git workflow

- **Branches** : `main` est protegee, PR uniquement
- **Commits** :
  - `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
  - Messages en anglais, concis, format `<type>(<scope>): <message>`
- **Types** : `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- **research_archive/** est **en .gitignore** — force add avec `git add -f` pour thesis docs
- **Pas de `houyi`** dans les noms de fichiers (convention projet)

### Exemple de commit

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

## 8. Tests obligatoires avant merge

```bash
# Backend tests
cd backend && python -m pytest tests/ -v

# Frontend lint + build
cd frontend && npm run lint && npm run build

# Audit these (regle AEGIS)
/audit-these full

# Delta notation check
python backend/tools/check_delta_notation.py

# Secret scan
git diff --staged | grep -i "api_key\|password\|token"
# Expected: empty
```

## 9. Documentation obligatoire apres changement

1. **`README.md`** (EN) + **`README_FR.md`** (FR) + **`README_BR.md`** (BR)
2. `backend/README.md` — comptes, API docs
3. `ScenarioHelpModal.jsx` — help modals si nouveau scenario
4. `formal_framework_complete.md` — si changement de cadre
5. `INTEGRATION_TRACKER.md` — si integration externe
6. Wiki : `wiki/docs/` + rebuild `python build_wiki.py && python -m mkdocs build`

## 10. Skills a utiliser selon la situation

| Situation | Skill |
|-----------|-------|
| Implementation structuree | `/apex` (10 etapes) |
| Audit qualite | `/audit-pdca` (benchmark + recette) |
| Nouvelle fiche d'analyse | `/fiche-attaque [num]` |
| Recherche bibliographique | `/bibliography-maintainer incremental` |
| Orchestration PDCA | `/research-director cycle` |
| Nouveau prompt d'attaque | `/aegis-prompt-forge FORGE` |
| Nouveau scenario | `/add-scenario` (6 agents) |
| Analyse resultats campagne | `/experimentalist [experiment_id]` |
| Gap vers campagne | `/experiment-planner [gap_id]` |
| Resultats vers manuscrit | `/thesis-writer [conjecture_id]` |
| Publication wiki | `/wiki-publish update` |

## 11. Trilingual mandatory

**Tout texte visible** : `t('key')` via `react-i18next`. **JAMAIS** de string hardcodee.

**3 langues** : FR / EN / BR. Cf. [i18n/index.md](../i18n/index.md).

## 12. Schemas — Mermaid obligatoire, ASCII interdit

!!! danger "ZERO schema ASCII / box-drawing dans le wiki"
    **Tout diagramme** (architecture, sequence, flowchart, pie, gantt, etc.) **DOIT** utiliser une fence Mermaid :

    ````markdown
    ```mermaid
    flowchart LR
        A --> B
    ```
    ````

    **JAMAIS** de schemas en `┌──┐`, `│`, `└──┘`, `------>`, box-drawing Unicode ou ASCII art.

    **Pourquoi** :

    - Le theme MkDocs Material rend les Mermaid en SVG responsive (zoom, dark mode, mobile).
    - L'ASCII art casse sur les ecrans etroits, ne se traduit pas (i18n), ne s'exporte pas en PDF vectoriel.
    - Les schemas Mermaid sont **editables par quiconque** sans outil graphique.

    **Types supportes** : `flowchart`, `sequenceDiagram`, `classDiagram`, `stateDiagram-v2`, `erDiagram`, `pie`, `gantt`, `graph TB/LR`.

    **Enforcement** : revue de PR — tout schema non-Mermaid est un blocker.

    **Fullscreen modal** : tous les schemas Mermaid du wiki sont cliquables. Un clic ouvre le diagramme en plein ecran (modal SVG). Implementation : `javascripts/mermaid-modal.js` + styles dans `stylesheets/aegis.css`. Cette fonctionnalite est automatique — aucun markup supplementaire necessaire. Touche Echap pour fermer.

## 13. Notation δ — Unicode obligatoire

**TOUJOURS** `δ⁰ δ¹ δ² δ³` dans la documentation. **JAMAIS** `delta-0 / delta-1 / delta-2 / delta-3`.

Exception : code source Python/JSX ou ASCII est obligatoire (cles de dictionnaire).

Cf. [notation-delta.md](../notation-delta.md).

## 14. Statistiques doctorales

- **Sep(M) N >= 30** par condition, Sep(M)=0 avec 0 violations = **artefact**
- **Tags** : `[ARTICLE VERIFIE]` / `[PREPRINT]` / `[HYPOTHESE]` / `[CALCUL VERIFIE]` / `[EXPERIMENTAL]`
- **Pre-check** 5 runs baseline avant toute campagne N >= 30
- **Maximum 3 iterations** par campagne, puis escalade humaine

## 15. Audit qualite — `/audit-these`

- Chaque session COMMENCE et TERMINE par `/audit-these full`
- Aucun lot "done" sans audit (`lint_sources.py > 5% NONE = PAS DONE`)
- **Cross-validation** : 3 chiffres aleatoires verifies contre fulltext ChromaDB apres chaque
  batch
- Si 1 chiffre faux → refaire le batch **entier**
- **Maximum 3 agents en parallele** (auditabilite)
- Toute affirmation *"le seul"*, *"le premier"* → WebSearch de verification **AVANT** publication

## 16. Ressources

- :material-file-document: [CLAUDE.md](https://github.com/pizzif/poc_medical/blob/main/.claude/CLAUDE.md)
- :material-file-document: [rules/programming.md](https://github.com/pizzif/poc_medical/blob/main/.claude/rules/programming.md)
- :material-file-document: [rules/doctoral-research.md](https://github.com/pizzif/poc_medical/blob/main/.claude/rules/doctoral-research.md)
- :material-file-document: [rules/redteam-analysis.md](https://github.com/pizzif/poc_medical/blob/main/.claude/rules/redteam-analysis.md)
- :material-robot: [Claude Code docs](https://docs.claude.com/en/docs/claude-code)
