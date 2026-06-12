# AUDIT COMPLET — /audit-these full — 2026-06-12

> **Auditeur** : audit-these v2.1 (session d'ouverture, post RUN-011)
> **Perimetre** : corpus P001-P153 (153 papers), delta depuis l'audit complet du 2026-06-10
> **Contexte** : seul P153 (Eiras, Know Thy Judge) a ete integre depuis le dernier audit complet.
> L'audit du jour = verification incrementale P153 + cloture des remediations pendantes du 06-10.

---

## Verdict global : PASS avec dettes documentees

| Verificateur | Verdict | Detail |
|--------------|---------|--------|
| V1 Citations | **PASS** (apres remediation) | 3 mismatches du 06-10 corriges ce jour dans MANIFEST (P008, P032, P152 — titres alignes sur arXiv). P153 verifie lors de RUN-011 (scoped COLLECTOR, `EIRAS_2503.04474_SCOPED_VERIFICATION_2026-06-10.md`). 0 citation invalide, 0 retractee. |
| V2 Claims | **FAIL nominal — dette stable** | 100/918 NONE (10.9%) sur `_staging/analyst/`, identique au 06-10 (pas de regression). Cause majoritaire : faux positifs du linter (pattern `(Abstract)` non reconnu, cf. Anomaly A2 du rapport 06-10). Vraie dette concentree sur M005-M009 (fiches methodologie) et P029/P030/P036/P040/P044. P153 : 0 claim non sourcee. |
| V3 Contradictions | **PASS** (apres remediation) | Les 5 CONTRA du 06-10 sont maintenant toutes traitees (voir section Remediations). P153 : aucune contradiction — convergence P044 explicitement documentee dans la fiche. |
| V4 Fidelite | **PASS** | Spot-check P153 vs ChromaDB (11 chunks) : 0.24 FNR (5 matches), 100% (8), 300 exemples (1), JailbreakBench/WildGuard/ShieldGemma presents. Cross-validation RUN-011 deja verbatim vs PDF. Audit 06-10 : tous les claims P146-P152 FIDELE. |
| V5 Temporal | **INFO** | 228 references a des modeles anciens (GPT-4o ×103, LLaMA-2 ×44, ...). Ce sont des citations historiquement exactes des papiers sources — pas des erreurs. Rapport : `MODEL_VERSIONS_AUDIT_20260612.md`. |
| V6 These | **PASS** (apres remediation) | chapitre_6 : annotation gel TC-001 ajoutee au Tableau 6.1 + correction de la claim perimee "C1,C2,C3 = 10/10" (C3=9/10 depuis 2026-06-03, C1 GELE). |

---

## Remediations appliquees ce jour (2026-06-12)

1. **MANIFEST.md** — 3 titres corriges (V1 mismatches du 06-10) :
   - P008 : + "Attacks" (titre arXiv exact)
   - P032 : + "Jailbreaks Against LLMs" (titre complet)
   - P152 : "Security of the" → "Security Issues in the" (titre v2 arXiv)
2. **EXPERIMENT_REPORT_TC001.md** — bannière ERRATUM gel TC-001 ajoutee (CONTRA-2)
3. **EXPERIMENT_REPORT_TC001_v2.md** — bannière ERRATUM gel TC-001 ajoutee (CONTRA-2)
4. **CONJECTURES_TRACKER.md** — C1 qualifie "GELE, EN RE-VERIFICATION" dans la Vue d'Ensemble + ligne ERRATUM TC-001 dans le detail C1 (CONTRA-3)
5. **DIRECTOR_BRIEFING_RUN010.md** — erratum post-hoc : C3 9/10 (pas 10/10), C1 GELE (CONTRA-4)
6. **chapitre_6_experiences.md** — annotation ERRATUM gel TC-001 sous Tableau 6.1 (colonne 3B en violation du gel, divergence stats KW TC-003 vs JSON) + correction claim "C1,C2,C3 = 10/10" → etat reel a date (CONTRA-1 + V6)

Note : CONTRA-5 (C7 8/10 vs 9.5/10) avait deja ete corrigee le 2026-06-10 dans RESEARCH_STATE.md.

---

## Dettes restantes (non bloquantes, tracees)

| # | Dette | Priorite | Responsable |
|---|-------|----------|-------------|
| 1 | **TC-001 v3 a executer** — seule voie de cloture du gel C1 et de l'incoherence 3B/8B du JSON. Tant que non close : colonne 3B du Tableau 6.1 invalide, stats KW 8B a re-verifier (H=12.63 vs H=18.80). | **P0** | experimentalist |
| 2 | Linter V2 : ajouter `(Abstract)` et les patterns de qualification ("n'est pas precise dans...") a `REF_PATTERN` pour eliminer les faux positifs (~24.6% raw → taux reel non certifiable) | P1 | EXECUTOR (lint_sources.py) |
| 3 | Sourcing des fiches methodologie M005-M009 (top des NONE : M009 18/21, M006 12/22, M007 12/18) | P1 | ANALYST |
| 4 | P030 (14/22 NONE), P044 (11/28), P040 (10/17) — blocs stats sans refs inline par ligne | P2 | ANALYST |
| 5 | Auteurs "Unknown et al." dans MANIFEST (P007-P011, P032, ...) — completer les auteurs reels | P2 | LIBRARIAN |
| 6 | `detect_contradictions.py` et `verify_fidelity.py` n'existent pas comme scripts — V3/V4 restent manuels | P3 | EXECUTOR |

---

## Etat des conjectures certifie a date (source : CONJECTURES_TRACKER + RESEARCH_STATE, reconcilies)

| Conj | Score | Statut |
|------|-------|--------|
| C1 | 10/10 **GELE** | EN RE-VERIFICATION (TC-001 v3 pendante, `c1_supported=false` brut) |
| C2 | 10/10 | VALIDEE saturee (renforcee P153 : juges flippables → δ³ deterministe necessaire) |
| C3 | 9/10 | SUPPORTEE (revisee 2026-06-03, doublon P019≡P052) |
| C4 | 9/10 | Fortement supportee |
| C5 | 9/10 | Fortement supportee (CorruptRAG RUN-009) |
| C6 | 10/10 | VALIDEE |
| C7 | 9.5/10 | CANDIDATE A VALIDATION |
| C8 | 7/10 | CANDIDATE |

---

## Fichiers produits

- `UNSOURCED_CLAIMS_20260612.md` (V2, script)
- `MODEL_VERSIONS_AUDIT_20260612.md` (V5, script)
- `AUDIT_COMPLET_20260612.md` (ce rapport)
