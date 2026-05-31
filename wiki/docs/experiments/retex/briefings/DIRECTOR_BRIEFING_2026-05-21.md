# DIRECTOR BRIEFING — Session 2026-05-21 (Anti-Confabulation + Verification scoped)

> Produit par research-director (cycle OBSERVE -> ORIENT -> DECIDE).
> Session orientee outillage de tracabilite et hygiene du corpus. Aucune campagne
> experimentale lancee. Aucun mouvement de conjecture justifie.

## 1. OBSERVE — Etat lu

- RESEARCH_STATE derniere MAJ : 2026-05-16. Hooks au demarrage :
  - `_staging/scientist/PENDING_SCIENTIST_REVIEW.md` : NON vide mais STALE (entree du 2026-04-06, template 86). Ne reflete plus l'etat du labo.
  - `_staging/audit-these/PENDING_AUDIT.md` : vide. `_staging/signals/` : aucun signal actif.
- Campagnes (`campaign_manifest.json`) : TC-001 INCONCLUSIVE (erratum, gel, re-run v3 requis) ; RAG-001 RUNNING ; FC-20260409 + FC-20260410 PENDING_ANALYSIS ; THESIS-001 / PP-001 / ASIDE-001 PLANNED.
- Conjectures inchangees : C1 10/10 (nuancee), C2 10, C3 10, C4 9, C5 8.5, C6 9.5, C7 8, C8 7 (candidate).
- Maturite chapitres : Ch.6 Experiences 40% (P0 critique, dont Ch.7 60% et Ch.8 50% dependent).

## 2. ACT — Realise cette session

- Skill `anti-confabulation` cree dans `.claude/skills` (taxonomie 7 tags, scoring ITR + verdict de sortie + auto-eval /50, hooks pipeline).
- Mode `scoped` formalise dans `bibliography-maintainer` (table des modes + section detail).
- Fiche #08 v3.1 corrigee : 3 corrections numeriques ("6 ordres" -> "environ 2.5" ; IC95 bilateral 11.6% ; Sep(M)/ASR explicitement projetes) + 3 corrections d'attribution (Wei -> Qi/P018 ; "100 exemples" -> Qi et al. 2023 ; Schulhoff 2023). Script annexe idempotent.
- Corpus : P018 recoit arXiv:2406.05946 ; P023 auteurs -> Gong et al. ; P029 auteurs -> Lee et al. (Ro Woon Lee, JAMA Network Open, DOI 10.1001/jamanetworkopen.2025.49963).
- 3 papiers verifies (dedup-clean) stages pour ingestion : P136 Wallace 2024 (arXiv:2404.13208), P137 Qi 2023 (arXiv:2310.03693), P138 Schulhoff 2023 (arXiv:2311.16119). Runbook + `verify_chromadb_chunks.py` crees.

Artefacts : `research_notes/AEGIS-AUDIT-FICHE-08_anti-confabulation.md`, `research_notes/AEGIS-SCOPED-VERIF_fiche08-refs_2026-05-21.md`, `_staging/collector/papers_scoped_fiche08_2026-05-21.json`, `_staging/collector/add_3_papers_fiche08.sh`.

## 3. ORIENT — Interpretation (verification avant interpretation)

- L'erreur d'attribution Wei -> Qi touchait P018, evidence de C3 (shallow alignment, "double preuve P052 martingale + P018 shallow"). P029 (94.4% JAMA) est l'evidence empirique de C6. Les corrections portent sur l'attribution et les metadonnees, PAS sur les claims scientifiques : aucun mouvement de conjecture justifie (coherent avec la note 2026-05-20).
- Fait marquant : l'outillage anti-confabulation + scoped a detecte une erreur reelle dans la chaine d'evidence (attribution fausse ayant passe une verification anterieure). Taux de faux positifs de la verification humaine confirme non nul. Gain methodologique directement applicable aux claims a fort enjeu.
- Hook STALE a purger : `PENDING_SCIENTIST_REVIEW.md` (2026-04-06).

## 4. DECIDE — Prochaines actions priorisees

### P0 — Integrite des claims (le nouvel outillage s'y applique en premier)
- TC-001 : re-run v3 ET audit anti-confabulation des chiffres geles (ASR full 3 / 7 / 16.67 % incoherents entre sources, 3B vs 8B). La defendabilite de C1 (10/10 nuancee) en depend.
- Brancher le mode AUDIT anti-confabulation sur Ch.6 des que des resultats experimentaux arrivent.

### P0 — Chemin critique these (Ch.6 -> Ch.7 -> Ch.8)
- F46 calibration (RR-P0-002, run background lance 2026-04-06) : verifier l'etat / recuperer les resultats.
- Vraie campagne SC-2 (N=30, 62 scenarios, 8 frameworks, Groq llama-3.3-70b-versatile, ~14880 trials) apres soumission OSF.

### P1 — Integration du jour
- Finir P136-P138 en local : `bash research_archive/_staging/collector/add_3_papers_fiche08.sh` puis `/bibliography-maintainer analyze_only`, verif via `verify_chromadb_chunks.py`.
- Analyser FC-20260409 + FC-20260410 (PENDING_ANALYSIS) via `/experimentalist`.

### Hygiene
- Purger `_staging/scientist/PENDING_SCIENTIST_REVIEW.md` (signal stale).
- Retirer les anciennes copies du skill dans le dossier "These ENS IA et prompt (1)".

## 5. Capitalisation

- `anti-confabulation` + `bibliography-maintainer scoped` deviennent la porte d'entree de toute integration de reference et de tout livrable chiffre. Verifier les arXiv IDs et les attributions AVANT integration dans un protocole ou une fiche (rappel de la lecon PDCA-2 2026-05-16 : G-062 avait de mauvais auteurs).

## 6. Conjectures — INCHANGEES

Aucun resultat experimental neuf cette session. C1-C8 restent aux scores du 2026-05-16. Les corrections d'attribution renforcent la TRACABILITE de l'evidence de C3 (P018) et C6 (P029) sans en modifier la force.
