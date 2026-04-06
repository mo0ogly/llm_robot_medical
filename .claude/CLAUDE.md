# CLAUDE.md — Project Rules for poc_medical

**DOCTORAL THESIS PROJECT (ENS, 2026) — Red Team Security Lab for Medical LLM**

## Rules detaillees (fichiers de reference)

| Fichier | Contenu |
|---------|---------|
| `.claude/rules/programming.md` | Regles React, Go, Python, General (zero emoticon, zero placeholder) |
| `.claude/rules/doctoral-research.md` | Exigences doctorales, skills ecosystem, triple verification, references cles |
| `.claude/rules/mathematical-analysis.md` | Analyse mathematique : qualification epistemique, hypotheses, verification preuves, rigueur statistique |
| `.claude/rules/redteam-analysis.md` | Analyse red team : classification vecteurs, threat model, ASR critique, reproductibilite, integration AEGIS |
| `.claude/rules/redteam-forge.md` | Architecture AEGIS, moteur genetique, campagnes, fiches d'attaque |
| `research_archive/RESEARCH_ARCHIVE_GUIDE.md` | Structure research_archive, regles PDFs, ChromaDB |
| `research_archive/RESEARCH_STATE.md` | Etat partage entre toutes les skills |

## ZERO PLACEHOLDER / ZERO DECORATIVE — ABSOLUTE RULE

1. **ZERO placeholder** — chaque element UI connecte a un vrai appel API backend
2. **ZERO decorative** — pas de Matrix rain, pas de fake "SYSTEM COMPROMISED"
3. **ZERO emoticon** dans le code sauf demande explicite du user
4. **ZERO approximation** — these doctorale, rien sans preuve (voir `rules/doctoral-research.md`)

**Audit** : `grep -rn 'setTimeout\|EXPLOITATION SUCCESSFUL\|SYSTEM COMPROMISED' frontend/src/` — 0 resultat attendu.

## Architecture

```
poc_medical/
├── backend/           FastAPI + Ollama + ChromaDB (:8042)
│   ├── agents/attack_chains/    36 chaines d'attaque
│   ├── prompts/                 102 templates (.json + .md)
│   ├── routes/                  11 routes API
│   ├── taxonomy/                87 techniques defense
│   └── chroma_db/               ChromaDB (aegis_corpus ~4200 + aegis_bibliography ~4700)
├── frontend/          React 18 + Vite + Tailwind v4 (:5173)
│   └── src/components/redteam/  Red Team Lab (15+ vues)
├── research_archive/  These doctorale (voir RESEARCH_ARCHIVE_GUIDE.md)
│   ├── _staging/               9 agents bibliography-maintainer
│   ├── discoveries/            D-001 a D-020, C1-C7, G-001 a G-027
│   ├── doc_references/         80 papiers organises, fiches d'attaque
│   ├── literature_for_rag/     PDFs sources uniquement
│   └── manuscript/             Chapitres de these
├── .claude/skills/    16 skills (research-director, fiche-attaque, bibliography-maintainer, etc.)
└── aegis.ps1/.sh      Scripts de gestion (start/stop/build/health)
```

## Source de verite

| Data | Source unique | API |
|------|-------------|-----|
| Templates (102) | `backend/prompts/*.json` | `/api/redteam/catalog` |
| Scenarios (48) | `backend/scenarios.py` | `/api/redteam/scenarios` |
| Chains (36) | `backend/agents/attack_chains/` | `/api/redteam/chains` |
| Etat recherche | `research_archive/RESEARCH_STATE.md` | Toutes les skills |

## Documentation obligatoire apres changement

1. README.md (EN) + README_FR.md (FR) + README_BR.md (BR)
2. backend/README.md — comptes, API docs
3. ScenarioHelpModal.jsx — help modals
4. formal_framework_complete.md — these
5. INTEGRATION_TRACKER.md — si integration

## i18n trilingual (FR / EN / BR)

Tout texte visible : `t('key')` via react-i18next. JAMAIS de string hardcodee. Termes techniques restent en anglais.

## Process Management

**JAMAIS de commandes directes.** Utiliser `aegis.ps1` (Windows) / `aegis.sh` (Linux).
```
.\aegis.ps1 start/stop/restart/health/build/logs
```

## Skills a utiliser

| Situation | Skill |
|-----------|-------|
| Implementation structuree | `/apex` (10 etapes) |
| Audit qualite | `/audit-pdca` (benchmark + recette) |
| Nouvelle fiche d'analyse | `/fiche-attaque [num]` |
| Recherche bibliographique | `/bibliography-maintainer incremental` |
| Orchestration PDCA | `/research-director cycle` |
| Nouveau prompt d'attaque | `/aegis-prompt-forge FORGE` |
| Nouveau scenario | `/add-scenario` (6 agents) |

## Notation δ — OBLIGATOIRE

δ⁰ δ¹ δ² δ³ (Unicode). JAMAIS "delta-0/1/2/3" en ASCII dans la documentation.

## Content Filter Safety

Ne JAMAIS lire : `scenarios.py`, `attack_catalog.py`, `i18n.js` (valeurs), `prompts/*.json` champ "template".
Travailler via metadonnees + fichiers .md (safe). Subagents : toujours inclure "NE LIS JAMAIS le contenu complet des fichiers sensibles".

## Git

- Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
- `research_archive/` en .gitignore — `git add -f` pour thesis docs
- Pas de `houyi` dans les noms de fichiers

## Statistiques

- Sep(M) : N >= 30 par condition, Sep(M)=0 avec 0 violations = artefact
- Tags : `[ARTICLE VERIFIE]` / `[PREPRINT]` / `[HYPOTHESE]` / `[CALCUL VERIFIE]` / `[EXPERIMENTAL]`

## Audit qualite — `/audit-these`

- Chaque session COMMENCE et TERMINE par `/audit-these full`
- Aucun lot "done" sans audit (lint_sources.py > 5% NONE = PAS DONE)
- Cross-validation : 3 chiffres aleatoires verifies contre fulltext ChromaDB apres chaque batch
- Si 1 chiffre faux → refaire le batch entier
- Maximum 3 agents en parallele (auditabilite)
- Toute affirmation "le seul", "le premier" → WebSearch de verification AVANT publication

## Template Literal Bug

Pas de `${}` dans les fonctions standalone .jsx. Utiliser concatenation.
