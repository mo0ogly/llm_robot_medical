# RESEARCH STATE — Etat partage de la recherche doctorale

> **Fichier partage entre TOUTES les skills** (research-director, fiche-attaque, bibliography-maintainer, aegis-prompt-forge)
> **Derniere MAJ** : 2026-06-10 (research-director cycle : RR-RUN10-002 RESOLVED — P153 Eiras "Know Thy Judge" integre au corpus, 11 chunks ChromaDB, C2 renforcee inchangee ; signal UNEXPECTED_FINDING FC-20260410 archive)
> **Mise a jour par** : research-director, session 2026-06-10 - cycle (1 RR resolved)

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

### Rapports research-director (session validation G-058 2026-05-20)

| Fichier | Date | Statut | Actions pendantes |
|---------|------|--------|-------------------|
| `DIRECTOR_VALIDATION_BRIEFING_G058_2026-05-20.md` | 2026-05-20 | **PRODUIT/TRAITE** | Validation du bootstrap G-058 et clarification du vocabulaire "SC-2 production" |
| `AUDIT_SESSION_2026-05-20_G058VAL_scoring-report_COMPLETE.md` | 2026-05-20 | **PRODUIT/TRAITE** | Scoring report de la session de validation G-058 |

> Note : les conjectures C1 a C7 restent INCHANGEES a l'issue de cette session. Les executions "SC-2 production" de PDCA-10 et PDCA-11 etaient des dry-runs N=1 du loader de scenarios sans LLM en service (validation syntaxique du pipeline uniquement) ; aucun resultat SC-2 reel n'a ete produit. La vraie campagne SC-2 (N=30, 62 scenarios, 8 frameworks, Groq llama-3.3-70b-versatile, 14880 trials) reste a lancer apres soumission OSF. Aucun mouvement de conjecture n'est justifie. Voir le tableau des conjectures en Section 4 (inchange).

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
| `experiments/triple_convergence_results.json` | 2026-04-06 | **TRAITE (chiffres reconcilies 2026-05-30)** | 210 runs (7x30, N=30). Donnee brute autoritative : modele llama-3.1-8b-instant, full convergence ASR=16.67%, best subset delta2_only=56.67%, KW H=18.80 p=0.0047 (SIGNIFICATIF), eta²=0.184, Cohen's f=0.475, gap_all_vs_best=-0.4, `c1_supported=false`. Interpretation : convergence ANTAGONISTE (full < meilleur sous-ensemble), coherente avec TC-002 70B. [ERRATUM 2026-05-20 resolu cote documentation : les chiffres 3B/full 3%/p=0.77 etaient FAUX. Re-run TC-001 v3 (70B) toujours requis pour decision finale C1 — voir Dossier_Correction] |

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
| RR-P0-001 | Formules medicales (7.4% → insuffisant). F58 MVP a formaliser | **INTEGRATED** (2026-05-31, RUN-010) — F46, F56, F57, F58 (MVP=4.51), F59 formalisees dans `doc_references/GLOSSAIRE_F_SERIES.md` (module decompose, source FORMULAS_F56_F59_FINAL). Reste : validation empirique. | Ch.3, Ch.6, C6 | MATHEUX + validation directeur |
| RR-P0-002 | F46 Recovery Penalty — calibration empirique | **RESOLVED** (reconcilie 2026-06-10) — la grille complete A ETE executee (le statut BASELINE DONE etait perime). (1) Calibration 70B 2026-06-04 : 14400 evals, baseline ASR 0.1444 (130/900), optimum mu=1.0/gamma=0.85 → ASR=0, Cohen h=0.7797 (recalcule independamment), 15/15 significatif Bonferroni — verdict SUPPORTED [CALCUL VERIFIE]. (2) Over-refusal 2026-06-08 : FPR=0 sur 16 conditions (8640 evals, panel 18 prompts benins) — caveat utilite leve. (3) Replication gpt-oss-120b 2026-06-09 : direction repliquee (0.2022→0.0144, h=0.69, 12/15) avec nuances (mu faible contre-productif, gamma=0.70 inefficace) — calibration modele-specifique. Rapports : `experiments/EXPERIMENT_REPORT_F46.md` + `EXPERIMENT_REPORT_F46_ADDENDUM.md`. ATTENTION provenance : `f46_calibration_results.json` = 120B (ecrase 06-09) ; donnees 70B = `f46_calibration_results_llama70b.json`. Reste (hors P0) : validation training-time (Young Eq.19 [HEURISTIQUE]) + panel benin elargi. | Ch.6, C4 | RESOLVED |
| RR-P0-003 | ASR circularity — ASR_deterministic base δ³ | **RESOLVED comme F73** (2026-05-16) — `FORMALISATION_ASR_DETERMINISTIC.md` (F73, extension F22) + `backend/metrics/chain_asr.py` (Chain-ASR(k), G-061). Juge deterministe 8 adapters δ³, non-circulaire (echappe P044 99.91% flip), proprietes [THEOREME] prouvees. | Metriques, Ch.7 | RESOLVED |

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
| C1 | 10/10 **(score GELE — decision directeur apres v3)** | **EN RE-VERIFICATION** | Theorie confirmee (P052+P018). Donnee brute autoritative triple_convergence_results.json (2026-04-08, llama-3.1-8b-instant, 210 runs, 7 conditions, N=30) : full convergence ASR=16.67% < best subset delta2_only=56.67%, KW H=18.80 p=0.0047 (SIGNIFICATIF), Cohen's f=0.475, gap=-0.4, `c1_supported=false`. Lecture : C1 "les 3 couches delta necessaires a un ASR eleve" N'EST PAS supportee — delta2 seul domine ; convergence ANTAGONISTE (delta0 retire le persona exploitable), coherente avec TC-002 70B (full 20% < delta1 seul 33%). Les anciens chiffres (3.2B, full 3%, best 23%, p=0.77) etaient ERRONES (reconcilies 2026-05-30). Score 10/10 GELE : mouvement de conjecture = SUPERVISED, decision reportee au directeur apres re-run TC-001 v3 (70B). |
| C2 | 10/10 | **VALIDEE** | RENFORCE par Deep-Analysis P0 — P024 Sep(M) compromis + P044 juges flippables 99.91% |
| C3 | 9/10 | **SUPPORTEE** | Corrige 2026-06-03 : P019≡P052 = meme papier (doublon), pas double preuve independante. Base : Young (formel) + P018 (empirique) + P102 (mecanistique) |
| C4 | 9/10 | Fortement supportee | Stable — F56 (Drift Rate) draft produit, manque calibration empirique (RR-DA-004) |
| C5 | **8.5/10** | Fortement supportee | **+0.5 Deep-Analysis P0** — P024 limites cosinus (Sep(M) > cosine brut) + P044 limites juges embeddings |
| C6 | **10/10** | VALIDEE | RUN-006 (P107-P110) + VERIFICATION_DELTA3 (P131 Weissman). P029 94.4% (102/108) ASR medical JAMA (Lee et al. 2025) |
| C7 | 9.5/10 | CANDIDATE A VALIDATION | Corrige 2026-06-10 (audit CONTRA-5) : 8/10 etait perime — CONJECTURES_TRACKER (RUN-005) et briefing RUN-010 disent 9.5/10. Protocole adaptatif concu (2026-04-06), execution pendante ; manque papers LRM (RR-RUN4-003) |
| C8 | 7/10 | **CANDIDATE** | Peer-preservation compromet le shutdown multi-agent. Supportee par P114-P116. Promotion a 8/10 conditionnee a la replication independante de P086 (G-028) + test en contexte medical (G-031). Voir CONJECTURES_TRACKER.md. |

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
| Papers analyses | 148 (P001-P152) au statut "analyzed" dans MANIFEST ; dont 60 avec deep analysis Opus (P001-P060). Actualise le 2026-05-21 (audit RESEARCH_STATE agent A). |
| Papers trouves non analyses | 0 (toutes les entrees MANIFEST sont au statut "analyzed" au 2026-05-21) |
| Analyses propagees doc_references/ | 60/60 (100%) — pipeline-auto 2026-04-04 |
| Formules documentees | 66 (F01-F54 + F60-F72) + 4 drafts enrichis (F56-F59) |
| Decouvertes | 16 validees + 4 confirmees RUN-004 (D-017 a D-020) |
| Techniques defense | 70 → 87 (+17 RUN-004, T-71 a T-87) |
| Techniques attaque | 48 → 66 (+18 RUN-004, T-49 a T-66) |
| Gaps these | 63 (G-001 a G-063) |
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

---

## Sync PDCA 2026-05-16 — activite 09 avril → 16 mai 2026

### Rapports bibliography-maintainer

| Fichier | Date | Statut | Actions extraites | Remarques |
|---------|------|--------|-------------------|-----------|
| RUN-008 (P128-P130 scoped) | 2026-04-09 | TRAITE | 3 P-IDs nouveaux | Anti-doublon fix : check_corpus_dedup.py |
| VERIFICATION_DELTA3 P131-P134 | 2026-04-11 | TRAITE | 4 nouveaux frameworks δ³ verifies (Weissman, Guardrails AI, LLM Guard, LMQL) | P084 LlamaFirewall = duplicate dropped |

### Rapports experiment-planner

| Fichier | Date | Statut | Actions extraites | RR creee |
|---------|------|--------|-------------------|----------|
| G058_CAMPAGNE_7_FRAMEWORKS_DELTA3.md | 2026-05-16 | DRAFT exécutable | Campagne 74k trials, 7 adapters, pre-reg OSF | RR-G058 (critique) |
| G060_PROMPTGUARD2_CROSSLINGUAL.md | 2026-05-16 | DRAFT exécutable | Test PromptGuard2 FR/EN/BR x 99 templates | RR-G060 (haute) |
| G062_ADVJUDGE_ZERO_PORT.md | 2026-05-16 | DRAFT exécutable | Port AdvJudge-Zero, test juge AEGIS | RR-G062 (haute) |
| G007_REPRODUCTION_P125_36LLMS.md | 2026-05-15 | DRAFT exécutable | Reproduction P125 baseline 56% | RR-G007 (haute) |
| G006_CAPTURE_VS_99_TEMPLATES.md | 2026-05-15 | DRAFT exécutable | Test 99 templates AEGIS sur CAPTURE | RR-G006 (haute) |

### Rapports thesis-writer

| Fichier | Date | Statut | Section thèse |
|---------|------|--------|---------------|
| CHAPITRE_IV_DELTA3_G063.md | 2026-05-15 | DRAFT v1 (revue directeur) | Chapitre IV §IV.1 + §IV.2 (AllowedOutputSpec + Lemma 1) |
| IMPLEMENTATION_P1_COMPARATEUR.md | 2026-05-15 | EN CONSTRUCTION | Implementation comparateur frameworks |
| IMPLEMENTATION_S6_MEMORY_POISONING.md | 2026-05-15 | EN CONSTRUCTION | Scenario S6 memory poisoning |

### Nouveaux gaps depuis 2026-04-09

| ID | Description | Statut |
|----|-------------|--------|
| G-058 | Campagne empirique 7 frameworks δ³ | PROTOCOL_READY |
| G-060 | PromptGuard2 cross-lingual coverage | PROTOCOL_READY |
| G-062 | AdvJudge-Zero port pour juge AEGIS | PROTOCOL_READY |
| G-063 | δ³ medical chirurgical FDA (P0 doctoral) | PROTOCOL_READY + chapitre draft |
| G-007/G-006 reformules | Reproductions P125 / CAPTURE | PROTOCOL_READY |

**last_updated** : `2026-05-16` (sync PDCA session)


---

## PDCA-2 — Resolution 4 bloqueurs G-058 (2026-05-16)

Sub-agent COLLECTOR (mode scoped) — 4 verifications paralleles :

| Bloqueur | RR | Resultat | Statut final |
|----------|----|-----------|--------------|
| AdvJudge-Zero (G-062) | RR-G062 | arXiv:2512.17375 = P044 existant. CORRECTION : auteurs Li/Wu/Liu (Unit 42) non Ren. | ready |
| CAPTURE dataset (G-006) | RR-G006 | arXiv:2505.12368 = P124 indexe, dataset NON public, fallback HF deepset/prompt-injections | blocked_partial |
| LMQL + LLaMA 3.2 (G-058) | RR-G058 | Issue #353 Ollama + #350 LLaMA 3 GGUF -> LMQL non viable. REPLAN : Outlines. | needs_replan |
| Panel 36 LLMs P125 (G-007) | RR-G007 | arXiv:2410.23308 P125, budget $300-800 mix closed/open | ready |

**Decisions prises** :
- G-062 : juste correction protocole (Ren -> Li et al.)
- G-006 : email Kholkar/Ahuja en parallele + fallback HF immediat
- G-058 : substitution LMQL -> Outlines (deadline +7 jours)
- G-007 : query ChromaDB P125 pour liste 36 LLMs avant lancement

**Lecons capitalisees** :
1. Verifier les arXiv IDs avant d'integrer dans un protocole (G-062 avait "à vérifier" + mauvais auteurs)
2. Tester compat framework + LLM cible PENDANT le design protocole, pas après (G-058 perdrait 1 semaine si réalisé au moment du SC-1 lancement)
3. Datasets cités dans papers ACL ne sont pas systematiquement publics — verifier HuggingFace en amont

---

## Sync PDCA 2026-05-21 — session anti-confabulation + verification scoped

Briefing complet : `_staging/briefings/DIRECTOR_BRIEFING_2026-05-21.md`.

### Outillage cree
- Skill `anti-confabulation` (`.claude/skills`) : taxonomie 7 tags, scoring ITR + verdict de sortie + auto-eval /50, modes AUDIT / REDACTION.
- Mode `scoped` formalise dans `bibliography-maintainer` (verification ciblee de references, COLLECTOR seul, zero mutation du corpus).
- `backend/tools/verify_chromadb_chunks.py` cree (etait reference par le SKILL mais absent).

### Corrections (fiche #08 + corpus + journal)
- Fiche #08 v3.1 : 3 corrections numeriques + 3 d'attribution. Erreur majeure : "Safety Alignment Should Be Made More Than Just a Few Tokens Deep" = Qi et al. (P018, arXiv:2406.05946), pas Wei et al. ; "100 exemples" = Qi et al. 2023 (arXiv:2310.03693), pas NDSS ; Schulhoff = 2023 (EMNLP).
- Corpus MANIFEST : P018 + arXiv:2406.05946 ; P023 auteurs -> Gong et al. ; P029 auteurs -> Lee et al. (Ro Woon Lee, JAMA Network Open, DOI 10.1001/jamanetworkopen.2025.49963).
- Journal de decisions AEGIS-DECISION-LOG-001 : sections 2.2 / 2.3 / 3.4 corrigees.

### Papiers stages (dedup-clean, pipeline complet a lancer en local)

| P-ID | Reference | arXiv | Couches |
|------|-----------|-------|---------|
| P153 | Wallace et al. 2024, Instruction Hierarchy | 2404.13208 | δ⁰, δ¹ |
| P154 | Qi et al. 2023, Fine-tuning compromises safety | 2310.03693 | δ⁰ |
| P155 | Schulhoff et al. 2023, HackAPrompt taxonomy | 2311.16119 | δ¹ |

Runbook : `_staging/collector/add_3_papers_fiche08.sh` puis `/bibliography-maintainer analyze_only`.

### Conjectures — INCHANGEES
Aucun resultat experimental neuf. Les corrections d'attribution renforcent la tracabilite de l'evidence de C3 (P018) et C6 (P029) sans en modifier les scores.

---

## Sync director 2026-06-09 — audit rapports (research-director status)

### Rapports audites

| Fichier | Date | Statut | Actions extraites |
|---------|------|--------|-------------------|
| `DIRECTOR_BRIEFING_RUN010.md` | 2026-05-31 | **TRAITE** (2026-06-09) | 4 RR creees : RR-RUN10-001 (positionnement vs ARMs/AutoAdv/GenBreak — citer P151, dedup DUPLICATE), RR-RUN10-002 (Eiras arXiv:2503.04474 [NEW], renforce P044/F73), RR-RUN10-003 (gap P149 embedding hors-distribution, proxy a definir), RR-RUN10-004 (audit MANIFEST identifiants, task #7) |

### Campagnes — etat manifest (2026-06-09)

| Campagne | Statut | Action requise |
|----------|--------|----------------|
| FC-20260409 (4 runs Groq 8B/70B/qwen32B, 40 chaines, N=30) | PENDING_ANALYSIS | `/experimentalist` — en attente depuis le 2026-04-09 |
| FC-20260410 (1 run Groq 8B) | PENDING_ANALYSIS | `/experimentalist` |
| FC-20260601 (1 run ollama 3B, 2 chaines) | PENDING_ANALYSIS | `/experimentalist` |
| RAG-001 | RUNNING (depuis 2026-04-08) | Statut STALE — reconcilier (verdict PENDING, pre-check RUNNING depuis 2 mois) |
| F46-20260604 | ANALYZED / SUPPORTED | mu=1.0, gamma=0.85 -> ASR=0 (Cohen h=0.78). A propager vers C4/Ch.6 (note : RESEARCH_STATE RR-P0-002 cite encore le baseline INCONCLUSIVE du 2026-06-08 — reconcilier les deux entrees) |
| PI-20260609 | SUPPORTED | Analyse 2026-06-09 : operateurs valides liftent #01 de 13.3% a 80-87% ; encapsulation JSON 0% lift |

**last_updated** : `2026-06-09`

### Actions ouvertes prioritaires
- P0 : TC-001 audit anti-confabulation FAIT le 2026-05-21 (`research_notes/AEGIS-AUDIT-TC001_anti-confabulation_2026-05-21.md`), verdict NON CONFORME. Donnee brute autoritative (`triple_convergence_results.json`, modele llama-3.1-8b-instant) : ASR full = 16.67%, best subset = δ² seul 56.67%, KW p = 0.0047 (significatif), `c1_supported=False`. RESEARCH_STATE C1 cite a tort modele 3.2B, full 3%, best subset 23%, p=0.77. Re-run v3 + reconciliation de toutes les sources requis ; decision sur le score C1 reportee au directeur apres v3.
- P0 : F46 calibration (etat du run background a recuperer) ; vraie campagne SC-2 apres soumission OSF (debloque Ch.6).
- P1 : ingestion locale P153-P155 ; analyse FC-20260409 + FC-20260410 (PENDING_ANALYSIS) via `/experimentalist`.
- Hygiene : purger le hook stale `_staging/scientist/PENDING_SCIENTIST_REVIEW.md` (entree du 2026-04-06).

**last_updated** : `2026-05-21`
