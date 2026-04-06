# Regles Red Team Forge — AEGIS

## Application AEGIS — Architecture

### Frontend (React 18 + Vite + Tailwind v4, port 5173)
- Command Center (Red Team Lab) : 15+ vues (catalog, scenarios, studio, playground, logs, timeline)
- HUD chirurgical : CameraHUD, VitalsMonitor, RobotArmsView
- Panneaux d'analyse : AnalysisPanel, CompareView, DeltaScore, EscalationPanel
- i18n trilingual FR/EN/BR (277 KB)

### Backend (FastAPI + Ollama + ChromaDB, port 8042)
- 36 chaines d'attaque dans `agents/attack_chains/`
- 102 templates dans `prompts/*.json` (97 numerotes + 5 config)
- Moteur genetique dans `agents/genetic_engine/`
- 11 routes API dans `routes/`
- RagSanitizer : 15 detecteurs + GMTP candidat 16e

### ChromaDB (backend/chroma_db/)
- aegis_corpus : ~4200 docs (fiches + templates + PDFs)
- aegis_bibliography : ~4700 docs (analyses + PDFs + metadonnees)
- Collections RAG par chaine (medical-rag, rag-basic, etc.)

## Moteur genetique — Regles

1. **Fitness** : SVC score 6 dimensions (Zhang et al. 2025, arXiv:2501.18632v2)
2. **Population** : 102 templates, gradient SVC 0.5/6 a 3.5/6
3. **Croisement** : templates compatibles par couche delta ciblee
4. **Mutation** : operateurs valides (autorite, cross-lingual, encoding, task injection)
5. **Operateurs INTERDITS** : XML fictif (regression prouvee #01→#16), negation directe (DAN mort), cliches Hollywood (0xROOT_HACK)
6. **Calibration** : #14 (SVC 1.0) = plancher, #18 (SVC 0.5) = sous-plancher absolu

## Campagnes — Regles

1. **N >= 30** par condition (validite statistique Sep(M), Zverev et al. 2025)
2. **Metriques obligatoires** : ASR, Sep(M), SVC (6 dim), P(detect), cosine drift
3. **Export** : fiche d'attaque .docx (11 sections + 2 annexes) via `/fiche-attaque`
4. **Resultats experimentaux tracables** : benchmark JSON avec N, ASR, p-value, IC 95%
5. **Pas de resultats simules** — ZERO placeholder, ZERO setTimeout dans le frontend

## Fiches d'attaque — Regles

1. **11 sections + 2 annexes** par fiche (voir `.claude/skills/fiche-attaque/references/document-sections.md`)
2. **3 agents** : SCIENTIST (Section 11, Sonnet) + MATH (3+5, Sonnet) + CYBER-LIBRARIAN (reste, Sonnet)
3. **TEXT-ONLY** : agents retournent du texte, PAS des fichiers
4. **SECTIONS EXCLUSIVES** : zero chevauchement (voir `references/agent-prompts.md`)
5. **PDFs dans le RAG** : SCIENTIST query `--multi-collection` (aegis_corpus + aegis_bibliography)
6. **Seed retour** : chaque fiche est seedee dans ChromaDB apres generation
7. **Index** : `fiche_index.json` mis a jour apres chaque fiche

## Process

- Toujours via `aegis.ps1` / `aegis.sh` (JAMAIS de commandes directes)
- `/apex` pour implementation structuree (10 etapes)
- `/audit-pdca` pour audit qualite avec benchmark
- `/fiche-attaque` pour generation de fiches
- `/bibliography-maintainer incremental` pour recherche biblio
- `/research-director cycle` pour orchestration PDCA complete
