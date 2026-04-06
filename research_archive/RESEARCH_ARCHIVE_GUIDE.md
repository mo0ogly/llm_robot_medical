# RESEARCH ARCHIVE — Guide de structure

> **These doctorale AEGIS** — Securite des systemes LLM medicaux (ENS, 2026)
> **Derniere MAJ** : 2026-04-04

---

## Arborescence

```
research_archive/
│
├── RESEARCH_STATE.md               # Etat partage entre toutes les skills
├── RESEARCH_ARCHIVE_GUIDE.md       # CE FICHIER
│
├── _staging/                       # Zone de travail des 9 agents bibliography-maintainer
│   ├── analyst/                   # PXXX_analysis.md — resume FR 500 mots + delta-tags
│   ├── chunker/                   # chunks_for_rag.jsonl + ingest_to_chromadb.py
│   ├── collector/                 # papers_phaseN.json + PAPERS_VERIFIED.json
│   ├── cybersec/                  # THREAT_ANALYSIS.md + DEFENSE_COVERAGE.md
│   ├── librarian/                 # Rapports d'organisation + validation
│   ├── matheux/                   # GLOSSAIRE_DETAILED.md + FORMULAS + MATH_DEPENDENCIES.md
│   ├── mathteacher/               # Module_01-07.md + QUIZ + GLOSSAIRE_SYMBOLES.md
│   ├── memory/                    # MEMORY_STATE.md + EXECUTION_LOG.jsonl
│   ├── scientist/                 # AXES_DE_RECHERCHE.md + rapports de recherche
│   ├── whitehacker/               # RED_TEAM_PLAYBOOK.md + EXPLOITATION_GUIDE.md
│   └── DIRECTOR_BRIEFING_RUN*.md  # Briefings consolides par RUN
│
├── discoveries/                    # Decouvertes scientifiques vivantes
│   ├── CONJECTURES_TRACKER.md     # C1-C7 : scores de confiance + evolution
│   ├── DISCOVERIES_INDEX.md       # D-001 a D-020 : index par impact
│   ├── THESIS_GAPS.md             # G-001 a G-027 : opportunites de contribution
│   └── TRIPLE_CONVERGENCE.md      # D-001 : delta-0/1/2 vulnerables, delta-3 seul survivant
│
├── doc_references/                 # Bibliographie organisee
│   ├── 2023/{domaine}/            # Analyses .md par annee et domaine
│   ├── 2024/{domaine}/            #   Domaines : benchmarks, defenses, medical_ai,
│   ├── 2025/{domaine}/            #   model_behavior, prompt_injection, semantic_drift
│   ├── 2026/{domaine}/            #
│   ├── prompt_analysis/           # Fiches d'attaque .docx + index + research_requests
│   ├── MANIFEST.md                # Index central des 80 papiers
│   ├── INDEX_BY_DELTA.md          # Papiers par couche delta
│   ├── ARTICLES_INDEX.md          # Index avec liens vers PDFs
│   └── GLOSSAIRE_MATHEMATIQUE.md  # Glossaire unifie des formules
│
├── literature_for_rag/             # PDFs sources UNIQUEMENT
│   └── PXXX_arXivID.pdf           # Convention : {PaperID}_{arXivID}.pdf
│
├── manuscript/                     # These : chapitres, documents de travail
│   ├── formal_framework_complete.md
│   ├── delta0_formal_chapter.docx
│   └── ... (chapitres, notes, projets)
│
├── articles/                       # Articles publies par l'equipe
│   └── triple_convergence_paper.md # A-001 : article Triple Convergence
│
├── data/                           # Donnees experimentales
│   ├── raw/                       # Donnees brutes
│   ├── processed/                 # Donnees traitees
│   └── references/                # References pour les scenarios
│
├── figures/                        # Figures pour la these
├── planning/                       # Plans d'implementation
└── scripts/                        # Scripts d'analyse et de benchmark
```

---

## Regles STRICTES

### R1 — Chaque analyse .md pointe vers son PDF

Tout fichier `doc_references/{year}/{domain}/PXXX_*.md` DOIT contenir :
```
> **PDF Source**: [literature_for_rag/PXXX_xxx.pdf](../../literature_for_rag/PXXX_xxx.pdf)
```
Si le PDF n'est pas disponible, la ligne DOIT etre :
```
> **PDF Source**: MANQUANT — [raison : paywall / conference-only / these non-publiee]
```

### R2 — Chaque PDF est dans ChromaDB

Tout PDF dans `literature_for_rag/` DOIT etre injecte dans ChromaDB (`backend/chroma_db/`) dans les collections `aegis_corpus` ET `aegis_bibliography`. Le tag `doc_type: "paper_fulltext"` identifie les chunks de texte complet.

### R3 — Convention de nommage PDFs

Format : `{PaperID}_{ArXivID_ou_source}.pdf`
Exemples :
- `P001_2306.05499.pdf` (arXiv)
- `P047_acl2025.pdf` (conference)
- `P058_thesis.pdf` (these)
- `P070_npj_digital_medicine.pdf` (journal)

### R4 — Pas de documents these dans literature_for_rag/

Les chapitres de these, notes academiques et documents de travail vont dans `manuscript/`. `literature_for_rag/` ne contient QUE des PDFs de papiers scientifiques references.

### R5 — Un seul endroit par type de fichier

| Type | Emplacement unique |
|------|-------------------|
| PDFs papiers | `literature_for_rag/` |
| Analyses .md | `doc_references/{year}/{domain}/` |
| Fiches d'attaque | `doc_references/prompt_analysis/` |
| Chapitres these | `manuscript/` |
| Decouvertes | `discoveries/` |
| Zone de travail agents | `_staging/{agent}/` |
| Index/glossaires | `doc_references/` (racine) |

---

## ChromaDB — Collections

Le ChromaDB operationnel est dans `backend/chroma_db/` (PAS dans research_archive/).

| Collection | Contenu | Docs |
|-----------|---------|------|
| `aegis_corpus` | Fiches d'attaque + templates + PDFs fulltext | ~4200 |
| `aegis_bibliography` | Analyses agents + PDFs fulltext + metadonnees | ~4700 |
| Collections RAG specifiques | Par chaine d'attaque (medical-rag, rag-basic, etc.) | Variable |

Query : `.claude/skills/fiche-attaque/scripts/query_chromadb.py --multi-collection`

---

## Skills qui interagissent avec cette archive

| Skill | Lit | Ecrit | Fichiers concernes |
|-------|-----|-------|--------------------|
| research-director | RESEARCH_STATE, briefings, requests | RESEARCH_STATE, requests | Tout |
| bibliography-maintainer | memory/, discoveries/ | _staging/*, discoveries/, doc_references/ | 60+ fichiers |
| fiche-attaque | doc_references/, literature_for_rag/ | prompt_analysis/, ChromaDB | Fiches .docx |
| aegis-prompt-forge | RESEARCH_STATE, discoveries/ | _staging/scientist/ | Briefings |
| add-scenario | doc_references/ | backend/ | Scenarios |
