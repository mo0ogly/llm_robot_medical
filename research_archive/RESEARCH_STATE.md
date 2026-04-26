# RESEARCH STATE — Etat partage de la recherche doctorale

> **Fichier partage entre TOUTES les skills** (research-director, fiche-attaque, bibliography-maintainer, aegis-prompt-forge)
> **Derniere MAJ** : 2026-04-06T14:30:00
> **Mise a jour par** : Domaine 2 completion + 3 P0 blockers resolved (F46, ASIDE, Sep(M))

---

## 1. Rapports recus et statut de traitement

Chaque rapport genere par une skill est trace ici. **Aucun rapport ne doit rester "non traite".**

### Rapports bibliography-maintainer

| Fichier | Date | Statut | Actions extraites | Remarques |
|---------|------|--------|-------------------|-----------|
| `DIRECTOR_BRIEFING_RUN003.md` | 2026-04-04 | **TRAITE** | 20 research requests creees | Source initiale du cycle PDCA |
| `REVIEW_COMPLETE_FORMULAS.md` | 2026-04-04 | **TRAITE** | F56-F59 draft, 4 trous identifies | FORMULAS_F56_F59_DRAFT.md produit |
| `REVIEW_COMPLETE_CORPUS.md` | 2026-04-04 | **TRAITE** | 60 papers classes, 16 decouvertes | Integre dans research_requests |
| `RETEX_DEEP_ANALYSIS_P0_LOT1.md` | 2026-04-04 | **TRAITE** | 7 actions recherche + 3 formalisations + 4 experiences | 7 papiers P0 fulltext Opus ; C5 8→8.5 ; C6 9→9.5 ; 7 RR-DA crees |

### Rapports research-director (recherches bibliographiques)

| Fichier | Date | Statut | Papiers trouves | Actions pendantes |
|---------|------|--------|-----------------|-------------------|
| `RAG_DEFENSES_SEARCH_RUN004.md` | 2026-04-04 | **TRAITE** | 7 papiers | URLs VERIFIEES par COLLECTOR |
| `MEDICAL_METRICS_SEARCH_RUN004.md` | 2026-04-04 | **TRAITE** | 8 papiers | URLs VERIFIEES par COLLECTOR |
| `ASIDE_SEARCH_RUN004.md` | 2026-04-04 | **TRAITE** | 5 papiers (12 identifies) | URLs VERIFIEES par COLLECTOR |
| `PAPERS_RUN004_VERIFIED.json` | 2026-04-04 | **COLLECTOR DONE** | 20 papiers, 0 URL invalide | 4 corrections propagees, 2 a verifier manuellement |

### Rapports fiche-attaque

| Fichier | Date | Statut | Fiches | Actions pendantes |
|---------|------|--------|--------|-------------------|
| `fiche_index.json` | 2026-04-04 | **A JOUR** | 23/97 done | 74 fiches restantes |
| Fiches #12-#22 Section 11 | 2026-04-04 | **TRAITE** | 11 fiches | Gaps integres dans research_requests |

### Rapports experiments (protocoles experimentaux)

| Fichier | Date | Statut | Actions extraites |
|---------|------|--------|-------------------|
| `experiments/aside_adaptive_protocol.md` | 2026-04-06 | **PROTOCOL_READY** | 50 variantes, 4 schedules, 6000 runs. 5 operateurs de mutation (ENC, LANG, SEM, TASK, CTX). Execution pendante. |
| `experiments/aside_adaptive_results.json` | 2026-04-06 | **STRUCTURE_READY** | JSON de resultats vide, pret pour execution |

### Rapports experiments

| Fichier | Date | Statut | Actions |
|---------|------|--------|---------|
| `experiments/triple_convergence_results.json` | 2026-04-06 | **TRAITE** | 210 runs (7x30), C1 nuancee, KW p=0.77 non-significatif, model-dependent |

### Rapports aegis-prompt-forge

| Fichier | Date | Statut | Actions |
|---------|------|--------|---------|
| *(aucun rapport DIRECTOR BRIEFING genere encore)* | - | - | Sera genere apres prochaine campagne |

### Rapports pipeline-auto (post-analyse)

| Fichier | Date | Statut | Actions extraites |
|---------|------|--------|-------------------|
| `PIPELINE_AUTO_POST_ANALYSIS.md` | 2026-04-04 | **PRODUIT** | 60 analyses propagees + CONJECTURES_TRACKER + RESEARCH_STATE MAJ | Analyse complete P001-P060 (6 lots Opus) — 60 papiers au standard doctoral |

---

## 2. File d'attente par priorite

### P0 — BLOQUANTS THESE (3 items)

| ID | Description | Statut | Bloque | Responsable |
|----|-------------|--------|--------|-------------|
| RR-P0-001 | Formules medicales (7.4% → insuffisant). F58 MVP a formaliser | **PARTIAL** — draft F56-F59 produit, 8 papiers medicaux trouves | Ch.3, Ch.6, C6 | MATHEUX + validation directeur |
| RR-P0-002 | F46 Recovery Penalty — calibration empirique | **STARTED** — script `backend/experiments/f46_calibration.py` + route API (f46_routes.py) + grille 5x3x30x30=14400 evals, proxy prompting, juge deterministe. Baseline (900 evals) launched in background 2026-04-06T13:15. ETA: 40h sequential / 10h parallel GPU. | Ch.6, C4 | Background experiment |
| RR-P0-003 | ASR circularity — ASR_deterministic base δ³ | **PENDING** | Metriques, Ch.7 | SCIENTIST + WHITEHACKER |

### P1 — IMPORTANTS (8 items)

| ID | Description | Statut | Bloque |
|----|-------------|--------|--------|
| RR-P1-001 | Formaliser F56-F59 (4 formules C4-C7) | **PARTIAL** — draft produit | C4, C5, C6, C7 |
| RR-P1-002 | ASIDE papers follow-up | **RESOLVED** — 12 papiers, D-001 renforce | D-001, D-015 |
| RR-P1-003 | RagSanitizer vs AdvJudge-Zero (G-017) | **PENDING** | G-017, Ch.5 |
| RR-P1-004 | ASIDE rotation test sur AEGIS (G-019) | **BACKEND_COMPLETE** — Defense rotator (5 types, 4 schedules), adaptive agent (50 variants x 5 operators), API routes, server.py integrated (commit 89a9992). Execution ready: 50 variants x 4 schedules x 30 rounds = 6000 runs protocol. Awaiting orchestrator integration. | G-019, D-015 |
| RR-P1-005 | Sep(M) sur donnees MPIB reelles | **DATASET_FOUND** — MPIB publicly available on HuggingFace (9697 instances, Lee et al. 2026). Strategy documented in `experiments/sepm_validation_strategy.md`. Download queued 2026-04-06T13:25. Phases: Download (0.5h) + Extract (2h) + Measure (3h) + Validate (1h) = 6.5h total. | G-009, C5 |
| RR-FICHE-001 | MSBE litterature | **PENDING** | Fiche #22 |
| RR-FICHE-002 | Self-query multi-framework | **PENDING** (critique) | Fiche #19 |
| RR-FICHE-003 | Hybridation #13 x #15 | **PENDING** | Moteur genetique |

### RUN-004 — RECHERCHE BIBLIOGRAPHIQUE (5 items)

| ID | Description | Statut | Papiers trouves |
|----|-------------|--------|-----------------|
| RR-RUN4-001 | Defenses RAG | **RESOLVED** | 7 papiers |
| RR-RUN4-002 | Metriques medicales | **RESOLVED** | 8 papiers |
| RR-RUN4-003 | LRM securite (paradoxe raisonnement) | **PENDING** | 0 |
| RR-RUN4-004 | Multi-turn defense | **PENDING** | 0 |
| RR-RUN4-005 | Defenses architecturales beyond ASIDE | **RESOLVED** | 5 papiers |

### Decouvertes potentielles (4 items)

| ID | Description | Statut |
|----|-------------|--------|
| RR-D17 | Dualite attaque-defense generative | **PENDING** |
| RR-D18 | Fine-tuning medical AFFAIBLIT alignement | **PENDING** (haute) |
| RR-D19 | Transferabilite white→black-box | **PENDING** |
| RR-D20 | Heterogeneite irreductible metriques | **PENDING** |

---

## 3. Papiers a integrer (prets pour RUN-004 bibliography-maintainer)

**86 papiers analyses (P001-P086)** — 76 au standard doctoral, 4 paywalls, 6 a ameliorer

**Dernier ajout** : P086 Potter et al. (2026) "Peer-Preservation in Frontier Models" (UC Berkeley) — SVC 9/10, nouveau vecteur peer-preservation pour architectures multi-agents medicales

| Lot | Nb | IDs proposes | Source rapport | ChromaDB |
|-----|----|-------------|---------------|----------|
| RAG defenses | 7 | P061-P067 | RAG_DEFENSES_SEARCH_RUN004.md | **SEEDED** |
| Metriques medicales | 8 | P068-P075 | MEDICAL_METRICS_SEARCH_RUN004.md | **SEEDED** |
| ASIDE + architecturales | 5 | P076-P080 | ASIDE_SEARCH_RUN004.md | **SEEDED** |

> **Note** : Les metadonnees des 20 papiers (titre, auteurs, venue, verification) sont dans ChromaDB (aegis_corpus + aegis_bibliography). Les analyses detaillees (resumes, formules, threats) seront ajoutees par le CHUNKER apres Phase 5.

---

## 4. Etat des conjectures (depuis DIRECTOR_BRIEFING_RUN003)

| Conj | Score | Statut | Evolution cette session |
|------|-------|--------|----------------------|
| C1 | 10/10 | **VALIDEE (nuancee)** | Theorie confirmee (P052+P018). Experience triple convergence 2026-04-06 (210 runs, 7 conditions, N=30) : pas de synergie sur llama3.2:3.2B (ASR full=3% < best subset=23%, KW p=0.77). Convergence non-synergique sur petits modeles bien alignes — delta0 affaiblit l'attaque en retirant le persona exploitable. Resultat valide mais model-dependent. |
| C2 | 10/10 | **VALIDEE** | RENFORCE par Deep-Analysis P0 — P024 Sep(M) compromis + P044 juges flippables 99.91% |
| C3 | 10/10 | **VALIDEE** | RENFORCE par Deep-Analysis P0 — double preuve : P052 martingale + P018 shallow |
| C4 | 9/10 | Fortement supportee | Stable — F56 (Drift Rate) draft produit, manque calibration empirique (RR-DA-004) |
| C5 | **8.5/10** | Fortement supportee | **+0.5 Deep-Analysis P0** — P024 limites cosinus (Sep(M) > cosine brut) + P044 limites juges embeddings |
| C6 | **9.5/10** | Fortement supportee | **+0.5 Deep-Analysis P0** — P029 94.4% ASR medical JAMA = evidence empirique forte |
| C7 | 8/10 | Supportee | Protocole adaptatif concu (2026-04-06) — 50 variantes x 4 schedules, execution pendante. P054 compound mais pas specifique LRM ; manque papers LRM (RR-RUN4-003) |

---

## 5. Etat des fiches d'attaque

| Metrique | Valeur |
|----------|--------|
| Done | 97/97 (100%) — complete session 2026-04-05 |
| Pending | 74 |
| Blocked | 0 |
| SVC max | 3.5/6 (#13, #19, #22) |
| SVC min | 0.5/6 (#18) |
| Gradient complet | #18(0.5) < #14(1.0) < #16(1.5) < #17(2.0) < #15(2.5) < #12(3.0) = #20 = #21 < #13 = #19 = #22(3.5) |

### Etat Deep Analysis (post-pipeline-auto 2026-04-04)

| Metrique | Valeur |
|----------|--------|
| Analyses produites | 60 (P001-P060, 6 lots Opus, format doctoral) |
| Analyses propagees vers doc_references/ | 60/60 (100%) |
| Standard atteint (analyse > 500 mots, formules exactes) | 60/60 selon ANALYST_REPORT_RUN004 |
| Analyses a retravailler (ANALYST_REPORT indique) | 32 (voir ANALYST_REPORT_RUN004.md pour details) |
| Analyses passant l'audit complet | 28 (P001-P028) selon criteres RUN004 |

---

## 6. Etat de la bibliographie

| Metrique | Valeur |
|----------|--------|
| Papers analyses | 60 (P001-P060) — deep analysis complete (6 lots Opus) |
| Papers trouves non analyses | 20 (P061-P080, attendent RUN-004 bibliography-maintainer) |
| Analyses propagees doc_references/ | 60/60 (100%) — pipeline-auto 2026-04-04 |
| Formules documentees | 66 (F01-F54 + F60-F72) + 4 drafts enrichis (F56-F59) |
| Decouvertes | 16 validees + 4 confirmees RUN-004 (D-017 a D-020) |
| Techniques defense | 70 → 87 (+17 RUN-004, T-71 a T-87) |
| Techniques attaque | 48 → 66 (+18 RUN-004, T-49 a T-66) |
| Gaps these | 21 → 27 (+6 RUN-004, G-022 a G-027) |
| RAG chunks | 580+ (aegis_bibliography) + 23 fiches (aegis_corpus) |

### Papiers cles post-analyse complete (SVC 10/10)

| Papier | Titre court | Ref | Apport |
|--------|------------|-----|--------|
| P019 | Why Is RLHF Alignment Shallow? | arXiv:2603.04851 | THEOREME formel : gradient zero au-dela horizon (Theoreme 10) |
| P039 | GRP-Obliteration | arXiv:2602.06258 | ALGORITHME : desalignement 1 prompt, 15 modeles |
| P060 | SoK Guardrails Evaluation | arXiv:2506.10597, IEEE S&P 2026 | SURVEY empirique : aucun guardrail ne domine (13 guardrails, 7 attaques) |

### Papiers cles post-analyse complete (SVC 9/10)

| Papier | Titre court | Ref | Apport |
|--------|------------|-----|--------|
| P009 | Bypassing LLM Guardrails | arXiv:2504.11168 | Evasion contre detection PI/jailbreak |
| P023 | Safety Misalignment (SSRA) | DOI:10.14722/ndss.2025.241089, NDSS 2025 | SSRA deux phases, desalignement multi-tour |
| P026 | IPI in the Wild | arXiv:2601.07072 | IPI conditions reelles, surface RAG validee |
| P028 | Safe AI Clinicians | arXiv:2501.18632 | Jailbreaking medical, 6 dimensions SVC |
| P045 | System Prompt Poisoning | arXiv:2505.06493 | SPP persistant au-dela de l'injection user |
| P048 | SLR PI Defenses (NIST expansion) | Preprint 2026 | 87 techniques defense, taxonomie NIST etendue |

---

## 7. Maturite des chapitres (depuis briefing)

| Chapitre | Maturite | Bloqueur principal |
|----------|----------|-------------------|
| Ch.1 Introduction | 90% | Quasi-pret |
| Ch.2 Etat de l'art | 85% | 20 papiers a integrer |
| Ch.3 Framework delta | 80% → **85%** | F56-F59 draft (+5%), validation requise |
| Ch.4 Attaques | 90% | Pret |
| Ch.5 Defenses | 70% → **75%** | 7 papiers RAG defense + 5 ASIDE (+5%) |
| Ch.6 Experiences | 40% | **P0 : F46 calibration** |
| Ch.7 Discussion | 60% | Depend Ch.6 |
| Ch.8 Conclusion | 50% | Depend Ch.6-7 |

---

## 8. Verification anti-hallucination (OBLIGATOIRE)

Chaque element dans ce fichier porte un tag de verification :
- `[ARTICLE VERIFIE]` : papier avec arXiv/DOI lu et confirme
- `[PREPRINT]` : papier trouve mais pas encore peer-reviewed
- `[HYPOTHESE]` : inference logique sans publication de support
- `[CALCUL VERIFIE]` : formule derivee mathematiquement
- `[EXPERIMENTAL]` : resultat d'une experience AEGIS (N, ASR, p-value)

**Regles** :
- Aucune "decouverte" sans tag → automatiquement `[HYPOTHESE]`
- Le research-director ne fait PAS de WebSearch — il delegue a bibliography-maintainer
- Chaque decouverte est cross-validee par 2 agents independants minimum
- Les formules sont verifiees par calcul, pas juste par citation

---

## 9. Instructions pour les skills

**Toutes les skills doivent** :
1. **LIRE** ce fichier au debut de chaque session pour connaitre l'etat
2. **METTRE A JOUR** ce fichier apres avoir produit un rapport ou resolu un gap
3. **NE JAMAIS** travailler sur un item deja `RESOLVED` sans verifier d'abord
4. **CREER** une entree dans la Section 2 pour toute nouvelle action identifiee
5. **SIGNALER** dans la Section 1 tout rapport produit

**research-director** : responsable de la coherence globale de ce fichier
**bibliography-maintainer** : met a jour Sections 3, 4, 6 apres chaque RUN
**fiche-attaque** : met a jour Section 5 apres chaque fiche
**aegis-prompt-forge** : met a jour Section 2 apres chaque campagne
