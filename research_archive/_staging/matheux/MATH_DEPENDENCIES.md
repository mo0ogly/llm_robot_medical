# MATH DEPENDENCIES — Formula Prerequisite DAG
## Graphe de dependances des formules mathematiques (22 formules, 34 papers)

> Lire de haut en bas: chaque formule requiert la maitrise des formules au-dessus.

---

## DAG Textuel (Directed Acyclic Graph)

```
NIVEAU 0 — Aucun prerequis math
|
+-- [1.4] ASR (Attack Success Rate) .................. P001, P029
|       Ratio simple, pas de math
|
NIVEAU 1 — Algebre lineaire bac+2 (vecteurs, produit scalaire)
|
+-- [1.1] Cosine Similarity .......................... P012, P013, P014
|       Prerequis: produit scalaire, norme euclidienne
|       |
|       +-- [1.2] Precision / Recall / F1 ............ P008, P011, P025
|       |       Prerequis: matrice de confusion
|       |       |
|       |       +-- [7.1] AUROC ....................... P008, P025
|       |               Prerequis: F1, courbe ROC
|       |
|       +-- [2.2] Gauge Matrix (Steck) ............... P012
|       |       Prerequis: cosine sim, matrice diagonale
|       |       |
|       |       +-- [6.3] Factorisation Matricielle ... P012
|       |               Prerequis: gauge, SVD, Frobenius
|       |
|       +-- [2.1] SemScore ........................... P014
|       |       Prerequis: cosine sim, sentence embeddings
|       |
|       +-- [5.2] Sentence-BERT / SBERT .............. Reimers 2019
|       |       Prerequis: cosine sim, BERT, reseaux siamois
|       |       |
|       |       +-- [5.3] Quantification 8-bit ........ P013
|       |               Prerequis: embeddings, normalisation
|       |
|       +-- [2.3] Contrastive Learning Loss .......... P013
|               Prerequis: cosine sim, softmax, temperature
|
NIVEAU 2 — Probabilites et statistiques
|
+-- [1.3] Cross-Entropy Loss ......................... P018, P025
|       Prerequis: logarithmes, probabilites
|       |
|       +-- [1.4] Weighted Cross-Entropy .............. P013, P025
|       |       Prerequis: cross-entropy, desequilibre classes
|       |
|       +-- [5.4] Fine-Tuning Standard Loss .......... P018, P034
|       |       Prerequis: cross-entropy, autoregression
|       |
|       +-- [5.1] DMPI-PMHFE Fusion .................. P025
|               Prerequis: cross-entropy, DeBERTa, heuristiques
|
+-- [7.2] Seuil Clustering Inclusion .................. P013
|       Prerequis: ensembles, intersection
|
NIVEAU 3 — Theorie de l'information + RL
|
+-- [3.1] Sep(M) — Score de Separation ............... P024 [CENTRAL]
|       Prerequis: distributions, esperance, divergence
|       |
|       +-- [6.2] Surprise Witness .................... P024
|       |       Prerequis: Sep(M), probabilites
|       |
|       +-- [3.2] Sep(M) Empirique ................... P024
|               Prerequis: Sep(M), surprise witness, indicatrices
|
+-- [4.1] Objectif RLHF Standard ..................... P018, P019, P020
|       Prerequis: divergence KL, esperance, politique
|       |
|       +-- [4.2] KL Token par Token ................. P018
|       |       Prerequis: RLHF, conditionnement
|       |       |
|       |       +-- [6.1] Prefilling Attack ........... P018, P023
|       |               Prerequis: KL token, autoregression
|       |
|       +-- [4.3] DPO Loss ........................... P017, P023
|       |       Prerequis: RLHF, Bradley-Terry, sigmoide
|       |       |
|       |       +-- [4.4] Fine-Tuning Contraint ....... P018
|       |               Prerequis: DPO, KL token, softplus
|       |
|       +-- [3.3] Focus Score (Attention Tracker) ..... P008
|               Prerequis: attention mechanism, statistiques
|
NIVEAU 4 — Analyse avancee (martingales, covariance)
|
+-- [4.5] Harm Information + Gradient Analysis ........ P019
|       Prerequis: RLHF, martingales, covariance, score function
|       |
|       +-- [6.4] Gradient Magnitude Bound ........... P019
|               Prerequis: harm information, Fisher information
```

---

## Vue Tabulaire des Dependances

| # | Formule | Depend de | Requis par | Papers |
|---|---------|-----------|------------|--------|
| 1.1 | Cosine Similarity | (fondation) | 2.1, 2.2, 2.3, 5.2 | P012-P016, P024 |
| 1.2 | Precision/Recall/F1 | 1.1 | 7.1 | P008, P011, P025 |
| 1.3 | Cross-Entropy | (fondation) | 1.4, 5.1, 5.4 | P018, P025 |
| 1.4 | Weighted Cross-Entropy | 1.3 | - | P013, P025 |
| 2.1 | SemScore | 1.1, 5.2 | - | P014 |
| 2.2 | Gauge Matrix | 1.1 | 6.3 | P012 |
| 2.3 | Contrastive Loss | 1.1 | - | P013 |
| 3.1 | Sep(M) Formel | (fondation niveau 3) | 3.2, 6.2 | P024 |
| 3.2 | Sep(M) Empirique | 3.1, 6.2 | - | P024 |
| 3.3 | Focus Score | (attention mechanism) | - | P008 |
| 3.4 | ASR | (aucun) | - | P001, P029 |
| 4.1 | Objectif RLHF | (fondation niveau 3) | 4.2, 4.3, 4.5 | P018-P022 |
| 4.2 | KL Token par Token | 4.1 | 4.4, 6.1 | P018, P019 |
| 4.3 | DPO Loss | 4.1 | 4.4 | P017, P023 |
| 4.4 | Fine-Tuning Contraint | 4.2, 4.3 | - | P018 |
| 4.5 | Harm Information | 4.1 | 6.4 | P019 |
| 5.1 | DMPI-PMHFE Fusion | 1.3 | - | P025 |
| 5.2 | Sentence-BERT | 1.1 | 2.1 | Reimers 2019 |
| 5.3 | Quantification 8-bit | 5.2 | - | P013 |
| 5.4 | Fine-Tuning Standard | 1.3 | 4.4 | P018, P034 |
| 6.1 | Prefilling Attack | 4.2 | - | P018, P023 |
| 6.2 | Surprise Witness | 3.1 | 3.2 | P024 |
| 6.3 | Factorisation Matricielle | 2.2 | - | P012 |
| 6.4 | Gradient Bound | 4.5 | - | P019 |
| 7.1 | AUROC | 1.2 | - | P008, P025 |
| 7.2 | Seuil Clustering | (fondation) | - | P013 |

---

## Chemins Critiques pour la These AEGIS

### Chemin 1: Mesure de la vulnerabilite (Sep)
```
Cosine Sim -> Sep(M) formel -> Surprise Witness -> Sep(M) empirique
```
**Importance**: Quantifie le probleme fondamental que la these cherche a resoudre.

### Chemin 2: Explication de la fragilite d'alignement
```
RLHF Objectif -> KL Token/Token -> Harm Information -> Gradient Bound (= zero au-dela de l'horizon)
```
**Importance**: Prouve mathematiquement POURQUOI les LLM sont vulnerables (alignement superficiel).

### Chemin 3: Detection d'injection (couche delta-1)
```
Cosine Sim -> SBERT -> SemScore (derive semantique)
Cosine Sim -> F1/Precision/Recall -> AUROC
Cross-Entropy -> DMPI-PMHFE (detection bi-canal)
Attention Mechanism -> Focus Score (detection sans entrainement)
```
**Importance**: Les outils mathematiques pour DETECTER les injections.

### Chemin 4: Renforcement de l'alignement (couche delta-0)
```
RLHF -> DPO -> Fine-Tuning Contraint (protection position par position)
```
**Importance**: Solutions pour rendre l'alignement interne plus robuste.

---

## Mapping Formules -> Couches Delta AEGIS

| Couche | Formules directement applicables |
|--------|--------------------------------|
| delta-0 (alignement interne) | 4.1 RLHF, 4.2 KL/token, 4.3 DPO, 4.4 Fine-Tuning Contraint, 4.5 Harm Info |
| delta-1 (detection pre-inference) | 3.3 Focus Score, 5.1 DMPI-PMHFE, 1.2 F1, 7.1 AUROC |
| delta-2 (validation post-inference) | 1.1 Cosine Sim, 2.1 SemScore, 5.2 SBERT, 3.1-3.2 Sep(M) |
| delta-3 (monitoring continu) | 3.4 ASR (mesure offensive), toutes metriques en monitoring |

---

*22 formules, 4 niveaux de prerequis, 4 chemins critiques*
*Derniere mise a jour: 2026-04-04*
