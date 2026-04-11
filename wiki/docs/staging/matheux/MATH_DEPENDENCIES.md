# MATH DEPENDENCIES — Formula Prerequisite DAG
## Graphe de dependances des formules mathematiques (37 formules, 46 papers)

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
|
NIVEAU 5 — Formules 2026 (P035-P046)
|
+-- [8.1] CHER (Clinical Harm Event Rate) ........ P035
|       Prerequis: ASR (3.4), fonction indicatrice
|       |
|       +-- [8.2] ASR a Seuil de Severite ........... P035, P037
|               Prerequis: CHER, ASR standard
|
+-- [8.3] GRPO (Group Relative Policy Opt.) ....... P039
|       Prerequis: RLHF (4.1), KL (4.2), PPO/clipping
|
+-- [8.4] ADPO (Adversary-Aware DPO) .............. P046
|       Prerequis: DPO (4.3), PGD (8.5), sigmoide
|       |
|       +-- [8.5] PGD Adversarial Perturbation ....... P046
|               Prerequis: gradient descent, norme infinie
|
+-- [8.6] SAM (Safety Alignment Margin) ........... P041
|       Prerequis: cosine similarity (1.1), silhouette coefficient
|       |
|       +-- [8.7] CoSA-Score .......................... P041
|               Prerequis: SAM, evaluation binaire securite
|
+-- [8.8] Logit Gap (Decision Flip) ............... P044
|       Prerequis: logits, softmax
|
+-- [8.9] Benchmark Effectiveness ................. P043
|       Prerequis: ASR (3.4), generalisation
|       |
|       +-- [8.10] Benchmark Separability ............. P043
|               Prerequis: Eff (8.9), intervalles de confiance, Sep(M) (3.1)
|
+-- [8.11] Defense Rate (DR) ...................... P038
|       Prerequis: ASR (3.4), classification multi-dim
|
+-- [8.12] FPR/FNR Guardrail ..................... P042
|       Prerequis: Precision/Recall (1.2), matrice de confusion
|
+-- [8.13] Degradation (SPP) ..................... P045
        Prerequis: accuracy, system prompt

NIVEAU 6 — Formules LRM et Multi-Tour (P087-P102)
|
+-- [9.1] Transition d'Etats LRM ................. P087
|       Prerequis: automates a etats
|       |
|       +-- [9.2] Entropie/Info Mutuelle Securite .. P087
|               Prerequis: 9.1, entropie Shannon, information mutuelle
|
+-- [9.3] Gradient Bandit (SEAL) .................. P089
|       Prerequis: politique softmax, bandit multi-bras
|
+-- [9.4] Loss Adversarial Reasoning .............. P093
|       Prerequis: negative log-likelihood, logits
|
+-- [9.5] Dialogue Multi-Tour (STAR) .............. P097
|       Prerequis: cosine similarity (1.1), systemes dynamiques
|
+-- [9.6] Direction de Refus + AHD ................ P102
|       Prerequis: cosine similarity (1.1), attention mechanism (3.3)
|
+-- [9.7] Self-Talk Multi-Tour (ActorBreaker) ..... P100
|       Prerequis: generation conditionnelle autoregresssive
|
+-- [9.8] SFR Multi-Tour ......................... P097, P098, P101
        Prerequis: ASR (3.4), processus multi-tour
```

---

## Vue Tabulaire des Dependances

| # | Formule | Depend de | Requis par | Papers |
|---|---------|-----------|------------|--------|
| 1.1 | Cosine Similarity | (fondation) | 2.1, 2.2, 2.3, 5.2, 8.6 | P012-P016, P024 |
| 1.2 | Precision/Recall/F1 | 1.1 | 7.1, 8.12 | P008, P011, P025 |
| 1.3 | Cross-Entropy | (fondation) | 1.4, 5.1, 5.4 | P018, P025 |
| 1.4 | Weighted Cross-Entropy | 1.3 | - | P013, P025 |
| 2.1 | SemScore | 1.1, 5.2 | - | P014 |
| 2.2 | Gauge Matrix | 1.1 | 6.3 | P012 |
| 2.3 | Contrastive Loss | 1.1 | - | P013 |
| 3.1 | Sep(M) Formel | (fondation niveau 3) | 3.2, 6.2 | P024 |
| 3.2 | Sep(M) Empirique | 3.1, 6.2 | - | P024 |
| 3.3 | Focus Score | (attention mechanism) | - | P008 |
| 3.4 | ASR | (aucun) | 8.1, 8.2, 8.9, 8.11 | P001, P029 |
| 4.1 | Objectif RLHF | (fondation niveau 3) | 4.2, 4.3, 4.5, 8.3 | P018-P022 |
| 4.2 | KL Token par Token | 4.1 | 4.4, 6.1 | P018, P019 |
| 4.3 | DPO Loss | 4.1 | 4.4, 8.4 | P017, P023 |
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
| 8.1 | CHER | 3.4 | 8.2 | P035 |
| 8.2 | ASR a Seuil | 3.4, 8.1 | - | P035, P037 |
| 8.3 | GRPO | 4.1, 4.2 | - | P039 |
| 8.4 | ADPO Loss | 4.3, 8.5 | - | P046 |
| 8.5 | PGD Perturbation | (gradient descent) | 8.4 | P046 |
| 8.6 | SAM | 1.1 | 8.7 | P041 |
| 8.7 | CoSA-Score | 8.6 | - | P041 |
| 8.8 | Logit Gap | (logits, softmax) | - | P044 |
| 8.9 | Benchmark Eff | 3.4 | 8.10 | P043 |
| 8.10 | Benchmark Sep | 8.9, 3.1 | - | P043 |
| 8.11 | Defense Rate | 3.4 | - | P038 |
| 8.12 | FPR/FNR Guardrail | 1.2 | - | P042 |
| 8.13 | Degradation SPP | (accuracy) | - | P045 |
| 8.14 | Multi-Turn ASR | 3.4 | - | P036 |
| 8.15 | Emotional AmpFactor | 3.4 | - | P040 |
| 9.1 | Transition d'Etats LRM | (automates) | 9.2 | P087 |
| 9.2 | Entropie/Info Mutuelle | 9.1 | - | P087 |
| 9.3 | Gradient Bandit SEAL | (softmax, bandit) | - | P089 |
| 9.4 | Loss Adversarial Reasoning | (logits, NLL) | - | P093 |
| 9.5 | Dialogue Multi-Tour STAR | 1.1 | - | P097 |
| 9.6 | Direction de Refus + AHD | 1.1, 3.3 | - | P102 |
| 9.7 | Self-Talk ActorBreaker | (generation autoregresssive) | - | P100 |
| 9.8 | SFR Multi-Tour | 3.4 | - | P097, P098, P101 |

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

### Chemin 5 (NEW RUN-002): Des-alignement offensif (threat delta-0)
```
RLHF -> GRPO -> GRP-Obliteration (un seul prompt suffit a des-aligner)
```
**Importance**: Prouve que les memes outils d'alignement (GRPO) peuvent etre retournes offensivement. Menace existentielle pour delta-0.

### Chemin 6 (NEW RUN-002): Alignement robuste aux perturbations visuelles
```
DPO -> ADPO (+ PGD adversarial training) -> defense multimodale delta-0
```
**Importance**: Etend l'alignement aux VLM avec robustesse worst-case.

### Chemin 7 (NEW RUN-002): Evaluation de securite medicale
```
ASR -> CHER (harm clinique reel) -> ASR a seuil (granularite severite)
```
**Importance**: Premiere chaine metrique specifiquement medicale pour la these AEGIS.

### Chemin 8 (NEW RUN-002): Fiabilite des juges et benchmarks
```
Logit Gap (juge manipulable) -> Benchmark Eff/Sep (qualite du benchmark)
```
**Importance**: Revele que les LLM-juges sont fragiles (delta-3 menace), necessite des benchmarks renouvelables.

### Chemin 9 (NEW RUN-005): Paradoxe raisonnement/securite (C7)
```
Transition d'Etats LRM (9.1) -> Entropie/Info Mutuelle (9.2) -> CoT = surface d'attaque
Gradient Bandit (9.3) -> chiffrements empiles exploitent le raisonnement
Loss Adversarial (9.4) -> test-time compute offensif
```
**Importance**: Les LRM utilisent le raisonnement pour se proteger ET pour se compromettre. Le paradoxe C7 est confirme mecanistiquement par P094 (dilution du signal de securite) et formalise par P087 (entropie vs information mutuelle).

### Chemin 10 (NEW RUN-005): Erosion multi-tour (MSBE)
```
Dialogue Multi-Tour STAR (9.5) -> SFR Multi-Tour (9.8) -> drift monotone de la direction de refus
Direction de Refus (9.6) -> concentration sparse = fragilite structurelle -> AHD (defense)
```
**Importance**: Le MSBE est maintenant formalise comme evolution d'etat deterministe. La frontiere de securite est un sous-espace basse dimension (P094, P102) qui se dilue avec la longueur du contexte (P098) et les tours de conversation (P097, P099, P101).

---

## Mapping Formules -> Couches Delta AEGIS

| Couche | Formules directement applicables |
|--------|--------------------------------|
| δ⁰ (alignement interne) | 4.1 RLHF, 4.2 KL/token, 4.3 DPO, 4.4 Fine-Tuning Contraint, 4.5 Harm Info, **8.3 GRPO**, **8.4 ADPO**, **8.5 PGD**, **8.6 SAM**, **8.7 CoSA**, **9.1 Transition LRM**, **9.2 Entropie/IM**, **9.6 Direction Refus + AHD** |
| δ¹ (detection pre-inference) | 3.3 Focus Score, 5.1 DMPI-PMHFE, 1.2 F1, 7.1 AUROC, **8.11 Defense Rate**, **8.12 FPR/FNR**, **9.5 Dialogue Multi-Tour STAR** |
| δ² (validation post-inference) | 1.1 Cosine Sim, 2.1 SemScore, 5.2 SBERT, 3.1-3.2 Sep(M), **8.1 CHER**, **8.2 ASR seuil**, **9.3 Gradient Bandit** |
| δ³ (monitoring continu) | 3.4 ASR, **8.8 Logit Gap**, **8.9 Bench Eff**, **8.10 Bench Sep**, **8.13 Degradation SPP**, **8.14 Multi-Turn ASR**, **8.15 Emotional AmpFactor**, **9.4 Loss Adversarial**, **9.7 Self-Talk**, **9.8 SFR Multi-Tour** |

---

*45 formules, 6 niveaux de prerequis, 10 chemins critiques*
*Derniere mise a jour: 2026-04-07 (RUN-005 — P087-P102, LRM + multi-tour + mecanismes d'alignement)*
