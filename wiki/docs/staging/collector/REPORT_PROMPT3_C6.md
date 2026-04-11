# REPORT — Preseed Prompt 3 : C6 Medical Fine-Tuning

**Date :** 2026-04-08
**Agent :** COLLECTOR + ANALYST
**Objectif :** Telecharger, injecter et analyser 4 papiers cles pour C6 (medical fine-tuning erode safety)

## Phase 1 : COLLECTOR

### PDFs telecharges

| P-ID | Fichier | Source | Taille | Pages |
|------|---------|--------|--------|-------|
| P107 | `literature_for_rag/P107_medsafetybench.pdf` | arXiv:2403.03744 | 1.44 MB | 32 |
| P108 | `literature_for_rag/P108_jmedethicbench.pdf` | arXiv:2601.01627 | 1.47 MB | 21 |
| P109 | `literature_for_rag/P109_finetuning_lowers_safety.pdf` | arXiv:2506.17209 | 805 KB | 13 |
| P110 | `literature_for_rag/P110_geometry_alignment_collapse.pdf` | arXiv:2602.15799 | 4.14 MB | 27 |

### Injection ChromaDB (aegis_bibliography)

| P-ID | Chunks injectes | Verification >= 5 |
|------|----------------|-------------------|
| P107 | 126 | OK |
| P108 | 95 | OK |
| P109 | 62 | OK |
| P110 | 103 | OK |
| **Total** | **386** | **4/4 OK** |

### Anti-doublon
- Verification : aucun des P-IDs (P107-P110) n'existait dans le corpus (P001-P106). OK.
- Verification arXiv IDs : aucun des 4 arXiv IDs n'etait present dans les analyses existantes. OK.

## Phase 2 : ANALYST

### Analyses produites

| P-ID | Fichier analyse | SVC | Statut |
|------|----------------|-----|--------|
| P107 | `_staging/analyst/P107_analysis.md` | 9/10 | [ARTICLE VERIFIE] — NeurIPS 2024 |
| P108 | `_staging/analyst/P108_analysis.md` | 9/10 | [PREPRINT VERIFIE] |
| P109 | `_staging/analyst/P109_analysis.md` | 8/10 | [PREPRINT VERIFIE] |
| P110 | `_staging/analyst/P110_analysis.md` | 10/10 | [PREPRINT VERIFIE] |

### Synthese C6

Les 4 papiers forment une chaine argumentaire complete pour C6 :

1. **P107 (MedSafetyBench)** : PREUVE EMPIRIQUE — les LLM medicaux (Medalpaca, Meditron, ClinicalCamel, Med42) ont des scores de nocivite significativement plus eleves que les LLM generiques alignes (p < 0.001, Bonferroni). Le fine-tuning medical erode l'alignement RLHF.

2. **P108 (JMedEthicBench)** : REPLICATION MULTI-TOUR — replique le resultat de P107 sur des modeles differents (Qwen3 vs II-Medical), une langue differente (japonais), et en multi-tour. Degradation de 9.5 a 5.5 en 3 tours (Cohen's d = 0.75). Les modeles medical-tuned sont systematiquement moins surs (Qwen3-8B = 5.60 vs II-Medical-8B = 4.50).

3. **P109 (Fine-Tuning Lowers Safety)** : MECANISME CAUSAL — identifie que c'est la NOUVEAUTE du contenu (pas le processus de fine-tuning) qui cause la degradation. Le fine-tuning sur des reponses auto-generees (donc identiques a la distribution d'entrainement) degrade MOINS la securite. Les donnees medicales, structurellement differentes des donnees generiques, causent donc une degradation amplifiee.

4. **P110 (Geometry of Alignment Collapse)** : FONDATION THEORIQUE — prouve formellement que l'alignement se concentre dans un sous-espace de faible dimension avec courbure aigue (AIC). La degradation suit une loi quartique Delta_u = Omega(gamma^2 * t^4). Le parametre gamma (couplage de courbure) est plus grand quand le contenu de fine-tuning est plus eloigne de la distribution d'entrainement → le fine-tuning medical a un gamma eleve → degradation rapide.

### Impact sur la these AEGIS

- **C6 : FORTEMENT SUPPORTEE** par les 4 papiers, du constat empirique (P107) a la preuve formelle (P110).
- **C3 (alignement superficiel) : FORMELLEMENT PROUVEE** par P110 — l'alignement est geometriquement concentre dans un sous-espace fragile.
- **C1 (delta-0 insuffisant) : SUPPORTEE** — les defenses au premier ordre ne previennent pas le collapse (P110, Theorem 6.2).
- **CAVEAT** : BioMistral (2507.02983) ne doit PAS etre cite comme exemple de C6 car son harmlessness score (0.90) est superieur a celui du modele de base (0.81) — c'est un contre-exemple.

### Gaps ouverts
- G-015 (mecanisme erosion securite) : PARTIELLEMENT ADRESSE par P109 + P110
- G-008 (benchmark medical standardise) : PARTIELLEMENT ADRESSE par P107 + P108
- G-012 (benchmark multi-tour medical) : ADRESSE par P108
- **Nouveau** : G-028 (proposition) — Defense curvature-aware pour le fine-tuning medical. P110 identifie le probleme mais ne propose pas de solution concrete et scalable.
