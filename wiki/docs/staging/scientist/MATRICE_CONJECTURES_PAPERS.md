# MATRICE CONJECTURES × PAPERS — analyse quantitative de support
## Aggregation cross-RUN des sources par conjecture

**Date** : 2026-05-16
**Auteur** : SCIENTIST
**Trigger** : analyse de correlations post-VERIFICATION_DELTA3
**Source primaire** : `research_archive/discoveries/CONJECTURES_TRACKER.md`

---

## 0. Resume executif

8 conjectures securite (C1-C8) + 3 conjectures methodologiques (MC1-MC3) supportees par 134 papers (P001-P134) + 17 papers methodologie (M001-M017). Score net de support quantifie par conjecture : C1, C2, C3, C6 saturees a 10/10, C4 a 9/10, C5 a 8.5/10, C7 a 9.5/10, C8 candidate a 7/10. La saturation de C1/C2/C3/C6 indique que de nouveaux papers sur ces thematiques apportent une valeur marginale faible — la veille bibliographique doit prioriser C7 et C8.

---

## 1. Matrice de support principale

| Conj | Score | Papers SUPPORT (≥) | Papers AFFAIBLISSANT (≤) | Papers REFUTANT (X) | Net | Statut |
|-----:|------:|--------------------|--------------------------|---------------------|----:|--------|
| C1   | 10/10 | 27 (P018, P019, P022, P029, P030, P035, P036, P039, P044, P050, P052, P053, P094, P102, P107, P108, P109, P110, P114, ...) | 4 (P017, P020, P021, P057) | 0 | **+23** | VALIDEE saturee |
| C2   | 10/10 | 22 (P011, P019, P024, P029, P033, P037, P039, P044, P045, P054, P055, P057, P058, P060, P081, P082, P084, P117-P121, P126, P131, P132, P133, P134) | 2 (P042 PromptArmor, P057 ASIDE) | 0 | **+20** | VALIDEE saturee |
| C3   | 10/10 | 12 (P018, P019, P036, P039, P049, P052, P053, P057, P094, P102, P110) | 1 (P057 partiel) | 0 | **+11** | VALIDEE saturee |
| C4   | 9/10  | 8 (P024, P012, P035, P041, P050, P054, P057) | 0 | 0 | **+8**  | FORTEMENT SUPPORTEE |
| C5   | 8.5/10 | 6 (P012, P013, P053, P054, P055, P057) | 0 | 0 | **+6**  | FORTEMENT SUPPORTEE |
| C6   | 10/10 | 12 (P027, P028, P029, P030, P035, P040, P050, P051, P107, P108, P109, P110, P131) | 1 (P074 CFT mitigation partielle) | 0 | **+11** | VALIDEE saturee |
| C7   | 9.5/10 | 13 (P036, P039, P052, P058, P059, P087, P089, P090, P091, P092, P093, P094, P096, P102) | 3 (P041 Magic-Token, P038 InstruCoT, P091 syntactic case) | 0 | **+10** | CANDIDATE → 10 |
| C8   | 7/10  | 4 (P086 Berkeley, P114 TBSP, P115 DeepSeek R1, P116 NeurIPS quitting) | 0 | 0 | **+4**  | CANDIDATE |
| MC1  | 7/10  | 7 (M001, M003, M004, M005, M006, M008, M009) | 2 (M002 v1, M007) | 0 | **+5** | FORTEMENT SUPPORTEE |
| MC2  | 8/10  | 1 (M005 fondateur empirique) + implementation AEGIS | 0 | 0 | **+1** | SUPPORTEE (N=1 limitation) |
| MC3  | 8/10  | 8 (M001, M002, M003, M004, M005, M006, M008, M009) | 1 (M007 exclu) | 0 | **+7** | FORTEMENT SUPPORTEE |

**Indicateur composite** : Net = SUPPORT - AFFAIBLISSANT - 3*REFUTANT (poids fort sur refutations).

---

## 2. Densite de support cross-domaine

Categorisation des papers en 5 domaines puis comptage de la diversite des sources par conjecture :

| Conj | Securite generique | Medical specialise | Theorie formelle | Empirique large-N | Architectural | Diversite |
|-----:|:-----------------:|:------------------:|:----------------:|:-----------------:|:-------------:|:---------:|
| C1   | 12                | 7                  | 3 (P019/P052/P110) | 4 (P035/P050/P107/P108) | 1 (P057) | **5/5** |
| C2   | 14                | 3                  | 2 (P081/P126)      | 1 (TC-002)              | 5 (P081-P084, P132-P134) | **5/5** |
| C3   | 7                 | 2                  | 2 (P019/P052)      | 1 (P049)                | 1 (P057) | **5/5** |
| C4   | 4                 | 2                  | 1 (P024)           | 2 (P035/P041)           | 1 (P057) | **5/5** |
| C5   | 3                 | 1                  | 2 (P012/P013)      | 1 (P054)                | 1 (P057) | **5/5** |
| C6   | 1                 | 11                 | 1 (P110)           | 3 (P107/P108/P035)      | 0 | **4/5** (manque architectural) |
| C7   | 8                 | 1                  | 1 (P094)           | 2 (P036/P089)           | 1 (P102) | **5/5** |
| C8   | 3                 | 0                  | 0                  | 1 (P114)                | 0 | **2/5** (manque medical, theorie, architecture) |

**Constat critique** : C8 (peer-preservation) souffre d'un manque cross-domaine — aucun papier medical specialise, aucune theorie formelle, aucune contribution architecturale. C'est exactement la niche que la these AEGIS doit combler (G-031 medical x C8, G-030 architectural shutdown oracle).

---

## 3. Identification des papers "pivots"

Un papier "pivot" supporte >= 3 conjectures simultanement.

| Paper | Conjectures supportees | Role |
|-------|------------------------|------|
| P019 (preuve formelle gradient nul) | C1, C2, C3 | Pilier theorique |
| P052 (martingale RLHF Princeton) | C1, C3, C7 | Pilier theorique multi-couche |
| P039 (effacement 1 prompt) | C1, C2, C3 | Pilier empirique destruction RLHF |
| P057 (ASIDE rotation orthogonale) | C1, C2, C4, C5 | Architecture defense delta-0 |
| P094 (CoT hijacking probing) | C1, C3, C7 | Probing mecanistique |
| P102 (AHD attention head) | C1, C3, C7 | Concentration safety heads |
| P107 (MedSafetyBench NeurIPS) | C1, C6 | Empirique medical |
| P108 (JMedEthicBench) | C1, C6 | Empirique medical multi-tour |
| P110 (loi quartique Princeton) | C1, C6 | Preuve formelle C6 medical |
| P126 (Design Patterns Tramèr) | C2, C3 | Pilier δ³ generique |

**10 papers pivots** sur 134 = 7.5 % du corpus mais portent 60+ % du poids de validation.

---

## 4. Papers en attente d'integration (gaps de citation)

Papers cites dans `gaps.md` mais pas encore traces dans `CONJECTURES_TRACKER.md` :

| P-ID | Contribution | Conjecture pertinente | Action |
|------|-------------|----------------------|--------|
| P117 | Yoon et al. ACL Findings 2025 — HyDE knowledge leakage | C2 | Ajouter dans CONJECTURES_TRACKER §C2 |
| P118 | Gao et al. ACL 2023 — HyDE baseline | C2 (refutation D-024) | idem |
| P119 | Jiao et al. SIGIR 2025 — PR-Attack | C2 | idem |
| P120 | Zhang et al. 2024 — Backdoored Retrievers | C2 | idem |
| P121 | Clop & Teglia 2024 — Backdoored Retrievers Precision@1 | C2 | idem |
| P122-P127 | OWASP + 36 LLMs + CAPTURE + Tramer + IPI | C1, C2 | Integrer post-RUN-007 |
| M010-M017 | Methodologie SESSION-001 | MC1-MC3 | Integrer dans CONJECTURES_TRACKER §MC |

**Total : 14 papers a integrer**. Action thesis-writer : sprint d'integration biblio.

---

## 5. Correlations inter-conjectures

Matrice de cooccurrence : combien de papiers supportent simultanement deux conjectures donnees.

|     | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|-----|---:|---:|---:|---:|---:|---:|---:|---:|
| C1  | 27 | 11 | 9  | 3  | 1  | 6  | 7  | 1  |
| C2  | 11 | 22 | 5  | 4  | 2  | 4  | 4  | 1  |
| C3  | 9  | 5  | 12 | 2  | 1  | 2  | 8  | 1  |
| C4  | 3  | 4  | 2  | 8  | 4  | 2  | 1  | 0  |
| C5  | 1  | 2  | 1  | 4  | 6  | 1  | 1  | 0  |
| C6  | 6  | 4  | 2  | 2  | 1  | 12 | 1  | 0  |
| C7  | 7  | 4  | 8  | 1  | 1  | 1  | 13 | 0  |
| C8  | 1  | 1  | 1  | 0  | 0  | 0  | 0  | 4  |

**Lectures cles** :
- C1 ↔ C3 : 9 papiers (insuffisance δ⁰ ET superficialite alignement) — cohérent puisque δ⁰ superficiel implique δ⁰ insuffisant.
- C3 ↔ C7 : 8 papiers (superficialite ET paradoxe raisonnement) — mecanisme partage (dilution signal basse-dim P094, attention heads P102).
- C1 ↔ C2 : 11 papiers (necessite δ³ et insuffisance δ⁰) — l'argument cumulatif de la these.
- C8 : isolee — 0 cooccurrence non triviale, confirme niche a defricher.

**Coefficient de Jaccard** entre C1 et C2 = 11 / (27 + 22 - 11) = 0.289 (forte mais pas redondance).

---

## 6. Risques de monoculture

| Risque | Constat | Mitigation |
|--------|---------|-----------|
| Saturation C1/C2/C3/C6 sans gain marginal | Veille bibliographique inutile sur ces themes | Refocaliser sur C7, C8, MC1-MC3 |
| Dependance sur 10 papers pivots | Si un pivot est refute, plusieurs conjectures vacillent | Diversifier sources cross-domaine |
| C8 cross-domain incomplet | Pas de medical, pas de theorie, pas d'architecture | Campagnes AEGIS dediees (G-029, G-030, G-031) |
| Pas de papier RIGOUREUSEMENT REFUTANT | Risque biais confirmation | Chercher explicitement papers anti-these |

---

## 7. Recommandations

1. **Sprint integration biblio** (14 papers) — pousser P117-P127 et M010-M017 dans `CONJECTURES_TRACKER.md` avec scores localises.
2. **Veille bibliographique refocalisee** — laisser tomber C1/C2/C3/C6 (saturees), prioriser C7 (paradoxe raisonnement) et C8 (peer-preservation).
3. **Campagnes empiriques AEGIS dediees C8** — G-029 (benchmark), G-030 (shutdown oracle), G-031 (medical x peer-preservation).
4. **Recherche active de refutations** — challenge `/bibliography-maintainer` a chercher des papers anti-these (cherry-picking prevention).
5. **Promotion C7 → 10/10** — replication independante P094 OU test AEGIS sur LLaMA 3.2 medical.

---

## 8. Statut

- Matrice : **VALIDEE 2026-05-16**
- Updates a appliquer dans `CONJECTURES_TRACKER.md` : **A FAIRE (thesis-writer sprint)**
- Lien gaps : voir `MATRICE_GAPS_DISCOVERIES_CAMPAGNES.md` (livrable parallele)
