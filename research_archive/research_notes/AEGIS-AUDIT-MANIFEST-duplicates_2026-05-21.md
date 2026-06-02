# AEGIS Audit MANIFEST -- Resolution des doublons d'arXiv ID

**Date** : 2026-05-21
**Agent** : Agent E (resolution doublons)
**Source** : audit MANIFEST 2026-05-21 (task #27)
**Scope** : 4 paires de P-IDs partageant le meme arXiv ID (et souvent le meme titre)
**Methode** : lecture des deux fiches, comparaison de la profondeur d'analyse, des references inline, des citations dans `discoveries/`, `articles/`, `manuscript/`, `experiments/`, et de la couverture des couches delta.

---

## Synthese decisionnelle

| Paire | arXiv | Keeper | Archived | Sections a migrer du archived vers le keeper |
|-------|-------|--------|----------|-----------------------------------------------|
| Paire 1 | 2509.14285 | **P002** | P085 | Comparaison directe AEGIS vs P085 (Section "AEGIS fait quelque chose que P085 ne fait PAS") |
| Paire 2 | 2512.08185 | **P027** | P071 | Hypotheses fortes sur GPT-2/DistilGPT-2 inadequats (Section Faiblesses de P071) |
| Paire 3 | 2601.01627 | **P050** | P108 | Verification du chiffre 2345 conversations (P108) vs 50000 (P050) -- discordance critique a trancher |
| Paire 4 | 2603.04851 | **P052** | P019 | Aucune -- P019 deja exhaustivement integre, garder ses references aux Theoreme 8/10 dans le manuscrit |

---

## Paire 1 -- arXiv:2509.14285 (Hossain et al., Multi-Agent LLM Defense Pipeline)

**Fichiers compares**
- P002 : `doc_references/2025/defenses/P002_MultiAgent_2025_Defense.md` (68 lignes, structure analyse standard)
- P085 : `doc_references/2025/defenses/P085_Hossain_2025_MultiAgentDefense.md` (93 lignes, structure analyse + section comparaison AEGIS)

| Critere | P002 | P085 |
|---------|------|------|
| Date de lecture | 2026-04-04 | 2026-04-05 (posterieure) |
| Statut | [PREPRINT] -- 38 chunks ChromaDB | [ARTICLE VERIFIE] -- IEEE WIECON-ECE 2025 accepte, lu via WebFetch arXiv HTML |
| PDF source pointe | `P002_multiagent_defense.pdf` | `P085_2509.14285.pdf` |
| Couches delta | δ² (catalogue MANIFEST) | δ¹, δ² (catalogue MANIFEST) |
| Auteurs complets | Hossain et al. | Hossain, Shayoni, Ameen, Islam, Mridha, Shin (complet) |
| References inline | Oui (Section/Table/p.) | Oui (Section/Table/p.) |
| Comparaison AEGIS | Bref paragraphe "Pertinence these AEGIS" | Section dediee "AEGIS fait quelque chose que P085 ne fait PAS" (7 points) + "P085 fait quelque chose qu'AEGIS ne fait PAS" (2 points) |
| Citations dans discoveries | Aucune occurrence | Aucune occurrence |
| Citations dans manuscript | Aucune occurrence | Aucune occurrence |
| Citations dans experiments | Aucune occurrence | Aucune occurrence |
| Index ARTICLES_INDEX | Reference avec lien PDF | Pas dans cet index |
| INDEX_BY_DELTA | Apparait en δ² (filtrage avance) | Apparait en δ¹ (Guard agent + Coordinator) ET δ² (policy validation + character filtering) |

**Decision** : keeper = **P002**, archived = P085

**Justification principale** : P002 est l'entree historique du COLLECTOR (date 2026-04-04, indexe ARTICLES_INDEX, PDF cite par INDEX_BY_DELTA). P085 a ete cree un jour plus tard (catchup RUN P061-P086) avec un meme PDF re-telecharge. Aucun des deux n'est cite dans `discoveries/`, `articles/`, ou `manuscript/` -- la decision repose donc sur la primaute d'integration au corpus. L'analyse P002 est plus concise, et son score de pertinence (SVC 5/10) est identique. Le statut P085 est plus solide ([ARTICLE VERIFIE] vs [PREPRINT]) car la verification IEEE WIECON-ECE 2025 a eu lieu post-P002.

**Sections a migrer P085 -> P002 avant archivage** :
1. Statut [ARTICLE VERIFIE] + venue IEEE WIECON-ECE 2025 (ligne 4 P085) -- mettre a jour ligne 4 P002
2. Liste auteurs complete (Hossain, Shayoni, Ameen, Islam, Mridha, Shin) -- mettre a jour titre P002
3. Section comparative "AEGIS fait quelque chose que P085 ne fait PAS" (lignes 67-80 P085) -- ajouter en section "Pertinence these AEGIS" de P002
4. Mise a jour MANIFEST.md : retirer la ligne P085, conserver P002 avec δ¹, δ² (combiner les couches delta).

---

## Paire 2 -- arXiv:2512.08185 (Wang, Zhang, Yagemann, Medical AI Security Framework)

**Fichiers compares**
- P027 : `doc_references/2025/medical_ai/P027_MedicalFramework_2025_SecurityEval.md` (91 lignes)
- P071 : `doc_references/2025/medical_ai/P071_Wang_2025_MedicalAISecurity.md` (58 lignes)

| Critere | P027 | P071 |
|---------|------|------|
| Date de lecture | 2026-04-04 | 2026-04-04 |
| Statut | [PREPRINT] -- 36 chunks ChromaDB | [PREPRINT VERIFIE] -- 30 chunks ChromaDB |
| PDF source pointe | `P027_2512.08185.pdf` | `P071_Wang_2025_MedicalAISecurity.pdf` |
| Couches delta | δ⁰, δ¹ (catalogue) | δ⁰, δ¹, δ² (catalogue) |
| Auteurs identifies | Wang, Zhang & Yagemann (Ohio State / Georgia Tech) | Wang, Zhang, Yagemann |
| References inline | Oui (Section/Table/Figure) | Oui (Section/p.) |
| Formules detaillees | Oui (ASR rubrique 1-5, metriques privacy, statistiques Wilson/Chi-square/Cramer's V) | Oui mais plus succinct |
| Citations dans discoveries | CONJECTURES_TRACKER.md ligne 119 : "P029 (94.4% ASR medical) + P028 (hierarchie) + P030 (erosion). P019, P027" | Aucune occurrence |
| Citations dans manuscript | Aucune occurrence | Aucune occurrence |
| Citations dans articles | Aucune occurrence | Aucune occurrence |
| Index ARTICLES_INDEX | Oui avec lien PDF | Non |
| INDEX_BY_DELTA | δ⁰ (alignement medical), δ¹ (prompt-level guardrails) | δ⁰, δ¹, δ² (multi-turn manipulation) |

**Decision** : keeper = **P027**, archived = P071

**Justification principale** : P027 est cite dans `CONJECTURES_TRACKER.md` (RUN-001, conjecture C6, ligne 119). Aucun fichier discoveries/articles/manuscript ne reference P071. P027 est aussi dans ARTICLES_INDEX et plus complet (91 vs 58 lignes), avec auteurs precis (Wang, Zhang & Yagemann, Ohio State / Georgia Tech), formules detaillees (ASR rubrique 1-5, Wilson/Chi-square/Cramer's V), et limites explicitement listees. L'analyse P027 inclut aussi un tag epistemique [SURVEY] + [HEURISTIQUE] reflechi.

**Sections a migrer P071 -> P027 avant archivage** :
1. Limite explicite "AUCUN resultat experimental presente" + citation auteurs "We present the framework specification [...] This proposal establishes a foundation" (Section 1, p. 2 du papier original, lignes 17-18 P071) -- renforcer Section "Faiblesses" de P027
2. Critique du choix de modeles "ces modeles n'ont pas d'alignement RLHF, donc evaluer leur robustesse au jailbreaking est un non-sens methodologique" (ligne 28 P071) -- ajouter en Section "Faiblesses" de P027 comme argument supplementaire
3. Couche δ² (multi-turn manipulation) du MANIFEST P071 -- conserver dans la ligne P027 du MANIFEST (combiner : δ⁰, δ¹, δ²)
4. Mise a jour MANIFEST.md : retirer la ligne P071, mettre a jour P027 avec δ⁰, δ¹, δ².

---

## Paire 3 -- arXiv:2601.01627 (Liu et al., JMedEthicBench)

**Fichiers compares**
- P050 : `doc_references/2026/medical_ai/P050_jmedethicbench.md` (128 lignes, ANALYSE APPROFONDIE)
- P108 : `doc_references/2025/model_behavior/P108_Liu_2025_JMedEthicBench.md` (53 lignes, analyse compacte)

| Critere | P050 | P108 |
|---------|------|------|
| Date de lecture | 2026-04-04 (RUN-003) | 2026-04-08 (RUN-006 C6) |
| Statut | [ARTICLE VERIFIE] -- 84 chunks (74000 caracteres) | [PREPRINT VERIFIE] -- 95 chunks |
| PDF source pointe | `P050_JMedEthicBench.pdf` | `P108_jmedethicbench.pdf` |
| Couches delta | δ⁰, δ¹ (catalogue) | δ⁰, δ¹ (catalogue) |
| Auteurs identifies | 10 auteurs nommes (Liu, Li, Niu, Zhang, Xun, Hou, Wang, Iwasawa, Matsuo, Hatakeyama-Sato) + affiliations | "Liu, Li, Niu, Zhang, Xun et al." |
| Chiffre clef -- N conversations | 50000+ | 2345 |
| Sections completes | Resume critique 500 mots + Formules (F41, F42, F58) + Critique methodologique + Impact AEGIS detaille + Classification | Resume + tableau resultats + Pertinence AEGIS court + Classification |
| Citations dans discoveries | TRIPLE_CONVERGENCE.md ligne 139, DISCOVERIES_INDEX.md (D-016), CONJECTURES_TRACKER.md (4 occurrences, C1/C3/C6) | CONJECTURES_TRACKER.md ligne 130 (avec citation inline Liu et al., 2025, Section 5.2, Table 2), DISCOVERIES_INDEX.md, THESIS_GAPS.md |
| Citations dans articles | triple_convergence_paper.md lignes 278, 308 | Aucune occurrence |
| Citations dans manuscript | autonomous_research_loop_architecture.md ligne 342, chapitre_6_experiences.md | Aucune occurrence |
| Index ARTICLES_INDEX | Oui avec lien PDF | Non |
| INDEX_BY_DELTA | δ⁰ + δ¹ (degradation multi-tour) | δ⁰ + δ¹ (7 jailbreak strategies transferable across 22 models) |

**Decision** : keeper = **P050**, archived = P108

**Justification principale** : P050 est massivement reference dans la these (TRIPLE_CONVERGENCE, DISCOVERIES_INDEX D-016, CONJECTURES_TRACKER C1/C3/C6, triple_convergence_paper.md, manuscript chapitre 6, autonomous_research_loop_architecture.md). P108 n'est cite que dans CONJECTURES_TRACKER (RUN-006) et THESIS_GAPS. P050 est plus complet (128 vs 53 lignes), introduit les formules F41/F42/F58 du glossaire AEGIS, et possede l'analyse approfondie en 5 sections.

**Alerte de discordance** : P050 annonce "50 000+ conversations" et P108 annonce "2345 conversations". C'est une divergence factuelle qui DOIT etre tranchee avant archivage. Action recommandee : query ChromaDB sur le PDF original (chunks P050_JMedEthicBench.pdf, page 5) pour verifier le N exact, puis aligner P050. P108 mentionne aussi "ICC(2,1) = 0.944, rho = 0.958 via Spearman-Brown" (statistique d'accord inter-juges) qui ne figure pas dans P050.

**Sections a migrer P108 -> P050 avant archivage** :
1. Statistique d'accord inter-juges : ICC(2,1) = 0.944, fiabilite effective rho = 0.958 via Spearman-Brown (Section 1.2 P108) -- ajouter en Section 1.4 (Resultats cles) ou Section 2 (formules) de P050
2. Comparaison delta Qwen3-8B vs II-Medical-8B = 5.60 vs 4.50 (delta = -1.10) avec citation inline (Liu et al., 2025, Section 5.2, Table 2) -- ajouter aux Resultats cles de P050 comme exemple complementaire
3. **Reconciliation du N de conversations** : query ChromaDB pour determiner si le corpus est 2345 (P108) ou 50000+ (P050) et corriger P050 + CONJECTURES_TRACKER ligne 128 et 130 (qui contiennent les deux chiffres).
4. Mise a jour MANIFEST.md : retirer la ligne P108, conserver P050.

---

## Paire 4 -- arXiv:2603.04851 (Robin Young, Why Is RLHF Alignment Shallow?)

**Fichiers compares**
- P019 : `doc_references/2025/model_behavior/P019_GradientAnalysis_2025_ShallowRLHF.md` (131 lignes)
- P052 : `doc_references/2026/model_behavior/P052_rlhf_alignment_shallow.md` (286 lignes)

| Critere | P019 | P052 |
|---------|------|------|
| Date de lecture | 2026-04-04 (RUN-001) | 2026-04-04 (RUN-003) |
| Statut | [ARTICLE VERIFIE] -- 71 chunks ChromaDB | [ARTICLE VERIFIE] -- 63 chunks ChromaDB |
| PDF source pointe | `P019_gradient_shallow.pdf` | `P052_2603.04851.pdf` |
| Couches delta (catalogue) | δ⁰, δ³ | δ⁰, δ¹ |
| Auteurs | Robin Young (Cambridge) | Robin Young (Cambridge) -- meme |
| References inline | Oui (Section/Theoreme/Eq.) | Oui (Section/Theoreme/Eq.) -- plus exhaustives |
| Formules detaillees | 9 formules (Eq.1, Eq.2, Eq.3, Eq.7, Eq.8, Eq.12, Eq.15, Eq.18, Eq.28, Eq.30) | Theoremes 8/9/10/13/14/19/20/22, Corollaire 23, Lemme detaille, plus Appendice A et B discutes |
| Discussion limites | 5 faiblesses + 3 questions ouvertes | 8 limites (5 reconnues par l'auteur + 3 additionnelles) |
| Citations dans discoveries | TRIPLE_CONVERGENCE.md ligne 90 ; DISCOVERIES_INDEX (D-007 "Gradient d'alignement nul") ; CONJECTURES_TRACKER : "P019 (preuve mathematique)" (C1/C2/C3) | TRIPLE_CONVERGENCE.md lignes 71, 72, 90, 140 ; DISCOVERIES_INDEX (D-014 "Preuve formelle superficialite RLHF") ; CONJECTURES_TRACKER : "P052 fournit la PREUVE FORMELLE par martingale" (C1/C2/C3) |
| Citations dans articles | triple_convergence_paper.md ligne 256 ([P019] reference mais ATTENTION : la citation pointe sur "Qi, X., Zeng, Y. ... arXiv:2310.03693" -- c'est une ERREUR de bibliographie, P019 = Robin Young arXiv:2603.04851) ; lignes 308, 310 | triple_convergence_paper.md lignes 282, 308, 310 (citation correcte Young 2026 Cambridge) |
| Citations dans manuscript | autonomous_research_loop_architecture.md ligne 337, 339 ; chapitre_6_experiences.md ligne 132, 161 ; peer_preservation_thesis_formulation.md ligne 133 | autonomous_research_loop_architecture.md ligne 337, 339 ; chapitre_6_experiences.md ligne 132 |
| Citations dans experiments | EXPERIMENT_REPORT_THESIS_003.md ligne 125 | EXPERIMENT_REPORT_THESIS_003.md ligne 125 |
| RESEARCH_STATE | 190 (preuve formelle Theoreme 10) | 140 (C3 validee + double preuve P052 martingale + P018 shallow) |

**Decision** : keeper = **P052**, archived = P019

**Justification principale** : P052 est la fiche LA PLUS APPROFONDIE du corpus AEGIS (286 lignes, 9 sections completes, Theoremes 8/9/10/13/14/19/20/22 + Corollaire 23 detailles, hypotheses analysees, 8 limites identifiees). Elle est citee de maniere centrale dans DISCOVERIES_INDEX (D-014 "Preuve formelle superficialite RLHF", score 10/10) et est la reference systematique du SCIENTIST pour C1, C3, C2 dans le CONJECTURES_TRACKER. P019 est citee dans D-007 (score 10/10) mais avec un perimetre plus court (gradient nul, theoreme 10), et son entree dans `articles/triple_convergence_paper.md` ligne 256 contient une erreur de bibliographie (P019 attribue a Qi 2023 arXiv:2310.03693 au lieu de Young 2026 arXiv:2603.04851) -- c'est une dette factuelle a corriger.

**Sections a migrer P019 -> P052 avant archivage** :
1. Aucune section unique a migrer : P052 est strictement plus complete que P019.
2. Toutefois : conserver l'identifiant D-007 (qui pointe historiquement vers P019) -- soit re-pointer D-007 vers P052, soit fusionner D-007 et D-014 en une seule decouverte.
3. Corriger la citation erronee dans `articles/triple_convergence_paper.md` ligne 256 (attribuer correctement a Robin Young 2026 arXiv:2603.04851, pas a Qi 2023 arXiv:2310.03693).
4. Mise a jour MANIFEST.md : retirer la ligne P019, conserver P052. Combiner les couches delta du MANIFEST : δ⁰, δ¹, δ³.
5. Verifier l'impact sur 53 fichiers grep P019 -- tous les liens internes des discoveries/manuscript/articles doivent etre remplaces par P052 ou pointer vers les deux (peer_preservation_thesis_formulation.md ligne 133 reference explicitement "Young 2026 (Gradient Analysis)").

---

## Actions de propagation post-decision (a executer par LIBRARIAN)

1. **MANIFEST.md** -- retirer les 4 lignes archivees (P085, P071, P108, P019) et combiner les couches delta des keepers (P002 = δ¹+δ², P027 = δ⁰+δ¹+δ², P050 = δ⁰+δ¹, P052 = δ⁰+δ¹+δ³).
2. **Fichiers fiches archived** -- conserver en place avec un en-tete `> **DUPLICATE OF PXXX**` (P019, P071, P085, P108) pendant 1 PDCA cycle avant suppression.
3. **DISCOVERIES_INDEX.md** -- envisager la fusion D-007 / D-014 (les deux pointent vers la meme preuve formelle Young 2026).
4. **CONJECTURES_TRACKER.md** -- remplacer les co-occurrences "P019/P052" par "P052" et harmoniser les listes (C1, C2, C3 references).
5. **triple_convergence_paper.md** -- corriger la citation [P019] erronee a la ligne 256 (Qi 2023 -> Young 2026).
6. **P050 vs P108 -- discordance N** : verifier le N exact de conversations dans le PDF JMedEthicBench (chunks ChromaDB) et harmoniser P050 + CONJECTURES_TRACKER lignes 128, 130 ; THESIS_GAPS ligne 27.
7. **check_corpus_dedup.py** -- ajouter une regle de bloque-COLLECTOR pour ces 4 arXiv IDs afin de prevenir une re-importation.
8. **ChromaDB** -- verifier la coexistence des chunks dupliques (P002+P085, P027+P071, P050+P108, P019+P052). Si dedup -> supprimer les chunks archived (sous reserve de re-injection automatique post-PDF du keeper).

---

## Notes de prudence

- Aucune des fiches archived n'est entierement orpheline : P085 a une section comparative AEGIS unique, P071 a une critique methodologique unique sur GPT-2, P108 a un chiffre ICC unique, et P019 est anciennement integre dans le manuscrit. Les sections a migrer ci-dessus DOIVENT etre executees AVANT archivage definitif.
- Le RESEARCH_STATE.md note deja en ligne 138 que P019 et P052 forment une "double preuve" -- la fusion P019 -> P052 ne doit pas effacer la richesse de cette double preuve, seulement consolider la reference bibliographique sous un seul P-ID.
- La discordance 2345 vs 50000+ conversations (P108 vs P050) doit etre traitee comme une priorite : si P108 est plus precis (etude posterieure RUN-006), c'est P050 qui contient une erreur a corriger avant archivage.
