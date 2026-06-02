# AEGIS — Audit anti-confabulation de RESEARCH_STATE.md

**Date** : 2026-05-21
**Auditeur** : Agent A (subagent anti-confabulation)
**Cible** : `research_archive/RESEARCH_STATE.md` (toutes sections, focus chiffres experimentaux et P-IDs)
**Methode** : extraction des affirmations chiffrees, recherche du fichier de resultats brut correspondant (`backend/experiments/results/*.json`, `research_archive/experiments/*.json`), comparaison valeur citee vs brute, verification existence P-IDs dans `research_archive/doc_references/MANIFEST.md`.

Taxonomie de tags utilisee :
- [MESURE] : la valeur citee correspond a la donnee brute identifiee.
- [A VERIFIER] : aucune source brute trouvee, ou citation pointe vers un fichier sans valeur correspondante.
- [FAUX] : contredit explicitement la donnee brute.
- [PROJECTION] : presente comme attendue, pas encore mesuree.
- [META-DOC] : citation d'un autre rapport ou d'un compteur de gouvernance (pas une mesure experimentale primaire).

Contrainte content filter respectee : aucun acces a `backend/scenarios.py`, `backend/attack_catalog.py`, valeurs `frontend/src/i18n.js`, champ "template" des `backend/prompts/*.json`. Travail sur .md et .json de resultats uniquement.

---

## 1. Tableau d'audit

| # | Affirmation | Tag | Source brute / fichier | Verdict |
|---|-------------|-----|------------------------|---------|
| 1 | `triple_convergence_results.json` : 210 runs (7 x 30, N=30) | [MESURE] | `research_archive/experiments/triple_convergence_results.json` metadata.total_runs=210, prompts=30, conditions=7 | Conforme |
| 2 | TC-001 modele autoritatif `llama-3.1-8b-instant` (chiffres reconcilies 2026-05-30) | [MESURE] | `triple_convergence_results.json` metadata.model="llama-3.1-8b-instant" | Conforme. Attention : `research_archive/experiments/campaign_manifest.json` reference encore `llama3.2:latest` pour TC-001 iterations 1 et 2 -- incoherence interne non reconciliée (voir Section 3). |
| 3 | TC-001 full convergence ASR = 16.67% | [MESURE] | `triple_convergence_results.json` condition_results.delta0_delta1_delta2.mean_asr = 0.1667 | Conforme |
| 4 | TC-001 best subset = delta2_only ASR = 56.67% | [MESURE] | `triple_convergence_results.json` condition_results.delta2_only.mean_asr = 0.5667 ; analysis.best_subset_condition = "delta2_only" | Conforme |
| 5 | TC-001 Kruskal-Wallis H = 18.80, p = 0.0047 | [MESURE] | `triple_convergence_results.json` analysis.kruskal_wallis_h_statistic = 18.7962, p_value = 0.004669967966788396 | Conforme (arrondis annonces coherents) |
| 6 | TC-001 eta-squared = 0.184 | [MESURE] | `triple_convergence_results.json` analysis.eta_squared = 0.1841 | Conforme |
| 7 | TC-001 Cohen's f = 0.475 | [MESURE] | `triple_convergence_results.json` analysis.effect_size_cohens_f = 0.475 | Conforme |
| 8 | TC-001 gap_all_vs_best = -0.4 | [MESURE] | `triple_convergence_results.json` analysis.gap_all_vs_best_subset = -0.4 | Conforme |
| 9 | TC-001 `c1_supported = false` | [MESURE] | `triple_convergence_results.json` analysis.conjecture_c1_supported = false | Conforme |
| 10 | TC-002 (70B) full 20% < delta1 seul 33% | [MESURE] | `research_archive/experiments/EXPERIMENT_REPORT_TC002.md` Section Resultats : delta1 seul 33%, delta0+delta1+delta2 20% ; corrobore par `campaign_manifest.json` entry TC-002 results.delta1_alone.asr=0.33, delta0_delta1_delta2 implicite | Conforme |
| 11 | C6 evidence : "ASR 94.4% medical" (Lee et al., JAMA) | [MESURE] | `research_archive/doc_references/2025/medical_ai/P029_JAMA_2025_MedicalInjection.md` : "ASR global 94.4% (102/108)" | Conforme. Mais analyse declarée "FIABILITE REDUITE" (PDF JAMA paywall, chiffres tires d'analyse RUN-003 secondaire) -- a documenter comme [ARTICLE VERIFIE INDIRECT]. |
| 12 | C2 evidence : "juges flippables 99.91%" (P044) | [MESURE] | `P044_Unit42_2026_AdvJudgeZero.md` : flip rate MATH 99.91%, AIME 98.64%, RLVR 94.75% | Conforme |
| 13 | C3 evidence : "P052 martingale + P018 shallow" | [MESURE] | MANIFEST : P018 = Qi et al., ICLR 2025, arXiv:2406.05946 ; P052 = Robin Young, arXiv:2603.04851v1, model_behavior | P-IDs existent, attribution coherente avec correction fiche #08 |
| 14 | C1 RESEARCH_STATE rappelle "anciens chiffres (3.2B, full 3%, best 23%, p=0.77) ERRONES (reconcilies 2026-05-30)" | [META-DOC] | Aucun raw matching ces chiffres (audit TC-001 prouve). Texte annonce explicitement comme erratum. | Conforme en tant que journal de correction ; ne doit plus etre cite comme une mesure. |
| 15 | "97/97 fiches done" (Section 5) | [META-DOC] | `fiche_index.json` annonce dans tableau ; pas verifie ici | Hors scope chiffre experimental |
| 16 | "23/97 done" (Section 1, fiche_index.json 2026-04-04) | [META-DOC] | Incoherence interne avec Section 5 (97/97). Le tableau Section 1 ligne `fiche_index.json` date du 2026-04-04 et n'a pas ete mis a jour quand Section 5 a montée a 97/97 (2026-04-05). | Mismatch interne (gouvernance, pas mesure) |
| 17 | "97/97 (100%) complete session 2026-04-05" Section 5 et "Pending : 74" simultanement | [META-DOC] | Contradiction interne : si 97/97 done, le compteur Pending = 74 ne peut etre vrai. | Mismatch interne |
| 18 | Section 6 : "Papers analyses : 60 (P001-P060)" et "20 trouves non analyses P061-P080" | [FAUX] | `research_archive/doc_references/MANIFEST.md` contient 148 entrees P-IDs analyses jusqu'a P138 (inclus P084 LlamaFirewall, P086 Potter, P099 Crescendo, P114-P116, P131-P138). Section 6 est gravement stale. | Affirmations refutees par MANIFEST. A reconcilier. |
| 19 | Section 6 : "Formules documentees : 66 (F01-F54 + F60-F72)" | [A VERIFIER] | Pas verifié ici (hors scope direct). | A reverifier contre `doc_references/GLOSSAIRE_F_SERIES.md` |
| 20 | Section 6 : "Decouvertes : 16 validees + 4 confirmees RUN-004 (D-017 a D-020)" | [A VERIFIER] | Hors scope chiffre experimental ; le CLAUDE.md mentionne "D-001 a D-020, C1-C7, G-001 a G-027" mais Section 8 cite C8 et Sync 2026-05-16 cite G-058 a G-063 -- ecart de versionnage. | A reconcilier contre `discoveries/DISCOVERIES_INDEX.md` |
| 21 | Section 6 : "Gaps these : 63 (G-001 a G-063)" | [META-DOC] | Coherent avec Sync PDCA 2026-05-16 listant G-058 a G-063 | OK (compteur) |
| 22 | Section 6 : "RAG chunks : 580+ (aegis_bibliography) + 23 fiches (aegis_corpus)" | [A VERIFIER] | Pas de raw verifie. CLAUDE.md de projet cite "aegis_bibliography ~4700" et "aegis_corpus ~4200" -- ecart de plusieurs ordres de grandeur. | Mismatch documentation vs CLAUDE.md |
| 23 | C4 : "C4 9/10 Stable -- F56 (Drift Rate) draft produit" | [META-DOC] | Aucun raw experimental cite. | Pas une mesure (gouvernance) |
| 24 | C5 8.5/10 ; C6 9.5/10 ; C7 8/10 ; C8 7/10 | [META-DOC] | Scores de conjectures, gouvernance. | Pas de mesure brute attendue |
| 25 | C7 "Protocole adaptatif concu (2026-04-06) -- 50 variantes x 4 schedules, execution pendante" | [PROJECTION] | `experiments/aside_adaptive_protocol.md` annonce 6000 runs ; `aside_adaptive_results.json` declare "STRUCTURE_READY, vide" | Conforme : annonce projection, pas mesure. |
| 26 | Section "Sync PDCA 2026-05-16" : Campagne 74k trials G-058 | [PROJECTION] | `experiments/G058_7_frameworks/OSF_PREREGISTRATION_G058.md` existe ; aucune valeur d'ASR mesuree presente dans RESEARCH_STATE. | Conforme : pre-registre, pas mesure. |
| 27 | RR-P0-001 : "F46, F56, F57, F58 (MVP=4.51), F59 formalisees" | [A VERIFIER] | MVP=4.51 non recherche dans le brut ; la note P029 explicite que MVP est une estimation (ASR_gen 65% estime, MVP 0.45 borne inferieure plausible). La valeur 4.51 differe d'un ordre de grandeur des MVP cites dans P029 (0.45) et P050 (0.74). | A reconcilier : 4.51 doit pointer un calcul explicite ou etre marque [HYPOTHESE] / [CALCUL VERIFIE]. |
| 28 | Section "Sync PDCA 2026-05-21" : Erratum cite | [META-DOC] | Texte annonce comme correction conforme a `AEGIS-AUDIT-TC001_anti-confabulation_2026-05-21.md`. | Conforme |
| 29 | THESIS-001 ASR global 6.75%, N=1200, 81 violations, IC Wilson [5.5%, 8.3%] | [MESURE] | `research_archive/experiments/EXPERIMENT_REPORT_THESIS_001.md` Section Resultats Globaux. (Infrastructure connexe pour audit complet.) | Conforme |
| 30 | THESIS-001 HyDE/XML 96.7% ASR, IC [83.3%, 99.4%] | [MESURE] | EXPERIMENT_REPORT_THESIS_001.md | Conforme |

---

## 2. Existence des P-IDs cites dans MANIFEST

| P-ID cite par RESEARCH_STATE | Present MANIFEST | Note |
|------------------------------|------------------|------|
| P018 (Qi et al., shallow alignment) | OUI | Attribution post-correction fiche #08 conforme |
| P024 (Zverev Sep(M)) | OUI | OK |
| P029 (Lee JAMA) | OUI | Attribution Lee et al. (Ro Woon Lee) conforme |
| P044 (AdvJudge-Zero Unit 42) | OUI | Attribution Li et al. (Unit 42) conforme apres correction |
| P052 (Robin Young) | OUI | OK |
| P019, P039, P060 | OUI | OK |
| P028, P023, P026, P009, P045, P048 | OUI | OK |
| P086 (Potter peer-preservation) | OUI | OK |
| P099 (Crescendo) | OUI | OK |
| P114, P115, P116 | OUI | OK |
| P124 CAPTURE, P125 Benjamin 36 LLMs | OUI | OK |
| P131-P134 (Weissman, Guardrails AI, LLM Guard, LMQL) | OUI | OK (renumerotation post-collision LlamaFirewall documentee) |
| P136-P138 (Sync 2026-05-21 annonce Wallace / Qi 2023 / Schulhoff) | OUI mais attribution differente : MANIFEST P136 = Jahan 2025 Black-Box Distillation, P137 = Zhang 2026 CDA, P138 = Chen 2025 FlippedRAG. | Mismatch fort : les memes P-IDs pointent vers des papiers differents (voir Section 3). |

---

## 3. Synthese des mismatchs

### 3.1. Mismatchs graves (top 3 a corriger en priorite)

1. **P136-P138 -- collision de numerotation post-Sync 2026-05-21**
   `RESEARCH_STATE.md` Sync 2026-05-21 declare P136 = Wallace 2024 (arXiv:2404.13208), P137 = Qi 2023 (arXiv:2310.03693), P138 = Schulhoff 2023 (arXiv:2311.16119) avec runbook `_staging/collector/add_3_papers_fiche08.sh`.
   `MANIFEST.md` enregistre actuellement P136 = Jahan Sun 2025 (arXiv:2512.09403 Black-Box Distillation Medical), P137 = Zhang 2026 CDA (arXiv:2503.24191), P138 = Chen 2025 FlippedRAG (arXiv:2501.02968).
   Verdict : soit le runbook n'a jamais ete execute et MANIFEST a recycle les P-IDs sur d'autres papiers, soit le runbook a ete execute et Sync 2026-05-21 n'a jamais ete reconcilie. Risque : citations futures de la these vers P136 = Wallace seront fausses.
   Action : decider quels P-IDs gardent quels papiers, propager dans MANIFEST + RESEARCH_STATE + journal de decisions, et renumeroter le perdant.

2. **Section 6 "Papers analyses : 60 (P001-P060)"**
   MANIFEST a 148 entrees P-IDs jusqu'a P138 inclus. La Section 6 est figee dans l'etat post-RUN-004 (2026-04-04). Toute autre section qui cite cette donnee (chapitre 2 etat de l'art, briefing directeur) propage une sous-estimation de pres de 90 papiers.
   Action : MAJ Section 6 -> 138 papiers analyses, ou compteur dynamique (script wc -l sur MANIFEST table).

3. **`campaign_manifest.json` TC-001 model = `llama3.2:latest`, RESEARCH_STATE TC-001 model = `llama-3.1-8b-instant`**
   Le raw `triple_convergence_results.json` confirme `llama-3.1-8b-instant`. RESEARCH_STATE est correct. `campaign_manifest.json` reste cale sur l'ancien `llama3.2:latest` pour iterations 1 et 2 (diagnostic "3B model"). La reconciliation 2026-05-30 n'a pas atteint campaign_manifest. Risque : tout consommateur qui lit campaign_manifest comme source primaire (par exemple experimentalist pour replanifier TC-001 v3) heritera de la valeur erronnee.
   Action : reconcilier `campaign_manifest.json` TC-001 iter 1 et 2 -> model "llama-3.1-8b-instant", supprimer "3B model" du champ diagnosis.

### 3.2. Mismatchs moyens (a reconcilier ensuite)

- Section 5 "97/97 done" cohabite avec "Pending : 74" : compteur Pending obsolete ou definition incompatible.
- Section 1 ligne `fiche_index.json` cite "23/97 done" alors que Section 5 cite "97/97 done" : meme fichier cite differemment dans le meme document.
- C4-C7-C8 listent des scores sans pointer un calcul brut : pas anormal pour de la gouvernance, mais doit etre tagge [META-DOC] explicitement.
- RR-P0-001 MVP=4.51 sans calcul reference : ordre de grandeur incompatible avec MVP P029 (0.45) et P050 (0.74). A diagnostiquer.

### 3.3. Verifications conformes (a retenir comme base saine)

- TC-001 reconciliation 2026-05-30 : tous les chiffres (16.67%, 56.67%, H=18.80, p=0.0047, eta=0.184, f=0.475, c1=false) correspondent ligne a ligne au raw.
- TC-002 70B (33% delta1, 20% full) correspond au rapport et au manifest.
- P029 94.4% ASR medical correspond a la fiche (avec mention explicite "FIABILITE REDUITE -- paywall JAMA").
- P044 99.91% flip rate MATH correspond a la fiche.
- THESIS-001 6.75% global, 96.7% HyDE/XML correspondent a EXPERIMENT_REPORT_THESIS_001.md.
- Tous les P-IDs cites par RESEARCH_STATE existent dans MANIFEST (sauf collision de mapping P136-P138).

---

## 4. Verdict global

**CONFORME PARTIEL.**
RESEARCH_STATE.md est conforme sur les chiffres experimentaux post-reconciliation 2026-05-30 (TC-001) et 2026-05-21 (P018/P023/P029 attributions). Les mesures brutes pertinentes sont toutes retrouvees dans `research_archive/experiments/triple_convergence_results.json`, `EXPERIMENT_REPORT_TC002.md`, `EXPERIMENT_REPORT_THESIS_001.md`, `f46_baseline.json`, et fiches MANIFEST.

Toutefois, trois zones de divergence subsistent :

1. **Numerotation P136-P138** : collision frontale entre Sync 2026-05-21 (Wallace/Qi/Schulhoff) et MANIFEST (Jahan/Zhang/Chen). A trancher.
2. **Section 6 stale** : "60 papers analyses" est obsolete d'un facteur 2.3 par rapport a MANIFEST (148 P-IDs).
3. **campaign_manifest.json TC-001** : non aligne avec la reconciliation 2026-05-30 (modele encore `llama3.2:latest`).

Aucune affirmation tagee [FAUX] sur les chiffres experimentaux primaires. Une seule [FAUX] sur les compteurs Section 6 (papers analyses).

**Recommandation** : avant tout nouveau briefing directeur, reconcilier P136-P138 + Section 6 + campaign_manifest TC-001. Ces trois corrections sont mecaniques et sans risque scientifique.

---

## Annexe : fichiers sources consultes

- `research_archive/RESEARCH_STATE.md` (cible)
- `research_archive/experiments/triple_convergence_results.json` (raw, autoritaire TC-001)
- `research_archive/experiments/EXPERIMENT_REPORT_TC002.md` (autoritaire TC-002 70B)
- `research_archive/experiments/EXPERIMENT_REPORT_THESIS_001.md` (autoritaire THESIS-001)
- `research_archive/experiments/campaign_manifest.json` (incoherent sur TC-001)
- `backend/experiments/results/f46_baseline.json` (RR-P0-002 baseline existe)
- `research_archive/doc_references/MANIFEST.md` (table 148 P-IDs)
- `research_archive/doc_references/2025/medical_ai/P029_JAMA_2025_MedicalInjection.md`
- `research_archive/doc_references/2026/prompt_injection/P044_Unit42_2026_AdvJudgeZero.md`
- `research_archive/research_notes/AEGIS-AUDIT-TC001_anti-confabulation_2026-05-21.md` (audit precedent reference)
