# Revue Complete des Formules AEGIS -- 60 Papers, 54 Formules

> **Agent**: MATHEUX (Opus 4.6) | **Date**: 2026-04-04 | **Scope**: P001-P060
> **Baseline**: 54 formules (F01-F54), 66 aretes de dependance, 12 chemins critiques
> **Sources**: GLOSSAIRE_DETAILED.md (F01-F37), PHASE2_MATHEUX_RUN003.md (F38-F54)
> **Verification RAG**: ChromaDB queries "mathematical formula metric score" + "proof theorem lemma bound convergence"

---

## Classification Thematique

### A. Metriques de Securite (12 formules)

| ID | Section | Nom | Paper(s) | Couche delta | Description | Statut |
|----|---------|-----|----------|-------------|-------------|--------|
| F01 | 1.1 | Cosine Similarity | P012-P016, P024 | δ² | Brique de base pour la derive semantique. Jauge-dependante (F06) | Fondation, documentee |
| F05 | 2.1 | SemScore | P014-P016 | δ² | Similarite semantique via sentence transformer (all-mpnet-base-v2) | Documentee |
| F15 | 3.1 | Sep(M) -- Score de Separation formel | P024 | δ⁰ | Metrique CENTRALE de la these : mesure la distinction instruction/donnee | Documentee, CENTRAL |
| F16 | 3.2 | Sep(M) Empirique | P024 | δ⁰ | Version calculable de Sep(M) via temoins surprises. N >= 30 requis | Documentee |
| F22 | 3.4 | ASR -- Attack Success Rate | P001, P023, P029 | Toutes | Hub central (9 formules entrantes en RUN-003). 94.4% en medical (JAMA) | Documentee, HUB |
| F26 | 8.1 | CHER -- Clinical Harm Event Rate | P035 | δ⁰ | Premiere metrique specifiquement medicale. Diverge de l'ASR | Documentee |
| F27b | 8.2 | ASR a Seuil de Severite | P035, P037 | Toutes | Generalisation granulaire de l'ASR (echelle 1-5) | Documentee |
| F33 | 8.11 | Defense Rate (DR) tri-dimensionnel | P038 | δ¹, δ² | Taux de defense sur 3 dimensions (comportement, donnees, nocivite) | Documentee |
| F34 | 8.12 | FPR/FNR Guardrail | P042 | δ¹ | Taux faux positifs/negatifs. PromptArmor: <1%/<1% | Documentee |
| F39 | -- | ESR -- Evasion Success Rate | P049 | δ² | Complementaire a ASR : mesure l'evasion des guardrails. 100% sur Azure/Meta | Documentee |
| F47 | -- | PBR -- Paraphrase Bypass Rate | P053 | δ⁰, δ¹ | Bypass par reformulation semantique. RLHF = patterns de surface | Documentee |
| F53 | -- | SEU -- Security-Efficiency-Utility | P060 | δ⁰ a δ³ | Framework tri-dimensionnel d'evaluation guardrails (IEEE S&P 2026) | Documentee |

---

### B. Theorie de l'Alignement (10 formules)

| ID | Section | Nom | Paper(s) | Couche delta | Description | Statut |
|----|---------|-----|----------|-------------|-------------|--------|
| F23 | 4.1 | Objectif RLHF Standard | P017-P022 | δ⁰ | max E[r(x,y) - beta * KL]. Base de l'alignement de securite | Documentee |
| F24 | 4.2 | KL Token par Token | P018 | δ⁰ | Preuve empirique : KL concentree sur tokens 1-3, quasi-zero au-dela | Documentee |
| F25a | 4.3 | DPO Loss | P017, P023 | δ⁰ | Alternative a RLHF sans reward model. Meme superficialite (P018) | Documentee |
| F25b | 4.4 | Fine-Tuning Contraint (beta_t) | P018 | δ⁰ | Solution : contrainte differentielle par position de token | Documentee |
| F27a | 4.5 | Harm Information I_t (from P019) | P019 | δ⁰ | Decomposition martingale de la nocivite positionnelle. Preuve fondamentale | Documentee |
| F28 | 6.4 | Gradient Magnitude Bound | P019 | δ⁰ | Theoreme: gradient = 0 au-dela de l'horizon k. Impossibilite structurelle | Documentee |
| F44 | -- | Harm Information I_t (from P052) | P052 | δ⁰ | Formalisation Cambridge : I_t = Cov[E[H|x<=t], score_function]. DECISIVE | Documentee |
| F45 | -- | Equilibrium KL Tracking | P052 | δ⁰ | Theoreme : D_KL^eq(t) proportionnel a I_t. Explique superficialite | Documentee |
| F46 | -- | Recovery Penalty Objective | P052 | δ⁰ | L_RP = L_RLHF + lambda * penalite positions a faible I_t. Solution proposee | Documentee |
| F29 | 8.3 | GRPO -- Group Relative Policy Opt. | P039 | δ⁰ | Detournement : 1 prompt suffit a desaligner 15 LLMs via GRPO inverse | Documentee |

---

### C. Espaces Vectoriels et Embeddings (8 formules)

| ID | Section | Nom | Paper(s) | Couche delta | Description | Statut |
|----|---------|-----|----------|-------------|-------------|--------|
| F06 | 2.2 | Gauge Matrix (Steck) | P012 | δ² | Cosine similarity non-unique sous transformation diagonale. Alerte fondamentale | Documentee |
| F07 | 2.3 | Contrastive Learning Loss | P013 | δ² | Base de l'entrainement SBERT. Temperature tau controle la selectivite | Documentee |
| F18 | 5.2 | Sentence-BERT (SBERT) | Reimers 2019 | δ² | Architecture derriere all-MiniLM-L6-v2. Comparaison en 5s vs 65h (BERT) | Documentee |
| F19 | 5.3 | Quantification 8-bit | P013 | δ² | Compression embeddings pour detection temps-reel. Perte minime | Documentee |
| F20 | 6.3 | Factorisation Matricielle | P012 | δ² | 2 objectifs de regularisation -> similarites cosinus differentes | Documentee |
| F40 | -- | WIRT -- Word Importance Ranking Transfer | P049 | δ² | Transfert white-box vers black-box via gradient d'importance | Documentee |
| F51 | -- | ASIDE -- Orthogonal Rotation Separation | P057 | δ⁰ | R * e(x_t) rotation orthogonale. Sep(M) ameliore sans parametres | Documentee |
| F30 | 8.6 | SAM -- Safety Alignment Margin | P041 | δ⁰ | Silhouette coefficient applique aux distributions de securite LLM | Documentee |

---

### D. Modeles d'Attaque (10 formules)

| ID | Section | Nom | Paper(s) | Couche delta | Description | Statut |
|----|---------|-----|----------|-------------|-------------|--------|
| F21 | 6.1 | Prefilling Attack | P018, P023 | δ⁰ | Pre-remplissage des premiers tokens -> contournement total alignement | Documentee |
| F32 | 8.5 | PGD -- Projected Gradient Descent | P046 | δ³ | Perturbation adversariale iterative sous contrainte de norme | Documentee |
| F35 | 8.13 | Degradation SPP | P045 | δ³ | System Prompt Poisoning : degradation 99.1% (quasi-destruction) | Documentee |
| F36 | 8.14 | Multi-Turn ASR | P036 | δ⁰ | LRM autonomes : 97.14% jailbreak multi-tour. Regression d'alignement | Documentee |
| F37 | 8.15 | Emotional Amplification Factor | P040 | δ¹ | Manipulation emotionnelle : facteur 6x sur desinformation medicale | Documentee |
| F41 | -- | MTSD -- Multi-Turn Safety Degradation | P050 | δ⁰ | Score median 9.5 -> 5.5 (p<0.001) sur 22 modeles. 42.1% degradation | Documentee |
| F48 | -- | PIDP Compound Attack Score | P054 | δ², δ³ | PI + DB Poisoning : gain super-additif 4-16pp. Query-agnostic | Documentee |
| F49 | -- | PIR -- Persistent Injection Rate | P055 | δ², δ³ | ~275K vecteurs empoisonnes. Persistance indefinie dans la base | Documentee |
| F52 | -- | IIOS -- Iterative Injection Optimization | P059 | δ¹, δ² | Optimisation iterative contre revieweur simule. Scores 10/10 | Documentee |
| F31 | 8.4 | ADPO -- Adversary-Aware DPO | P046 | δ⁰ | DPO avec perturbation adversariale. Robustesse aux attaques visuelles | Documentee |

---

### E. Modeles de Defense (8 formules)

| ID | Section | Nom | Paper(s) | Couche delta | Description | Statut |
|----|---------|-----|----------|-------------|-------------|--------|
| F17 | 3.3 | Focus Score (Attention Tracker) | P008 | δ¹ | Detection training-free par observation de l'attention. AUROC +10% | Documentee |
| F10 | 5.1 | DMPI-PMHFE Fusion bi-canal | P025 | δ¹ | DeBERTa + heuristiques fusionnees. 97.94% accuracy | Documentee |
| F38 | -- | DIS -- Defense Inversion Score | P047 | δ¹ | DIS(a) = 1 - ASR(Invert(a)). Dualite attaque-defense | Documentee |
| F43 | -- | 4DLF -- Four-Dimensional Linguistic Feature Vector | P051 | δ² | 4 dimensions BERT (prof, med, eth, dist) pour detection jailbreak | Documentee |
| F50 | -- | ARF -- ASR Reduction Factor | P056 | δ⁰, δ¹ | AIR (NVIDIA) : reduction 1.6x-9.2x sans perte d'utilite | Documentee |
| F54 | -- | Six-Dimensional Guardrail Taxonomy Vector | P060 | δ⁰ a δ³ | Classification categorielle a 6 dimensions (stage, paradigm, ...) | Documentee |
| F31b | 8.7 | CoSA-Score | P041 | δ⁰ | Composite Safety-Helpfulness. Capture le tradeoff utilite/securite | Documentee |
| F33b | 8.8 | Logit Gap (Decision Flip) | P044 | δ³ | z_no - z_yes. AdvJudge-Zero : 99% flip rate sur juges open-source | Documentee |

---

### F. Statistique et Validation (6 formules)

| ID | Section | Nom | Paper(s) | Couche delta | Description | Statut |
|----|---------|-----|----------|-------------|-------------|--------|
| F02 | 1.2 | Precision / Recall / F1 | P008, P011, P025 | Toutes | Metriques standard detection. PromptGuard F1=0.91 | Documentee |
| F03 | 1.3 | Cross-Entropy Loss | P018, P025, P034 | Toutes | Fonction de perte standard pour classificateurs binaires | Documentee |
| F04 | 1.4 | Weighted Cross-Entropy | P013, P025 | Toutes | Ponderation pour classes desequilibrees (injections rares) | Documentee |
| F14 | 7.1 | AUROC | P008, P025 | Toutes | Metrique independante du seuil. Attention Tracker +10% | Documentee |
| F22b | 6.2 | Surprise Witness | P024 | δ⁰ | Definition formelle des temoins pour le calcul empirique de Sep(M) | Documentee |
| F42 | -- | DLSS -- Dual-LLM Safety Score | P050 | δ⁰ | Double scoring LLM-juge + kappa pondere. Fiabilite inter-juges | Documentee |
| F34b | 8.9 | Benchmark Effectiveness (Eff) | P043 | Toutes | JBDistill : 81.8% vs 53.1% (selection aleatoire) | Documentee |
| F34c | 8.10 | Benchmark Separability (Sep_B) | P043 | Toutes | Proportion de paires de modeles statistiquement distinguables | Documentee |

**Note**: F34b et F34c ajoutent la granularite benchmark a la categorie F. Total effectif : 8 formules dans cette categorie.

---

## Synthese par Categorie

| Categorie | Nb Formules | Papers couverts | Couches delta | Hub central |
|-----------|-------------|-----------------|---------------|-------------|
| A. Metriques de Securite | 12 | 17 papers | Toutes | F22 (ASR) |
| B. Theorie de l'Alignement | 10 | 12 papers | δ⁰ | F23 (RLHF), F44 (I_t) |
| C. Espaces Vectoriels | 8 | 8 papers | δ⁰, δ² | F01 (Cosine), F18 (SBERT) |
| D. Modeles d'Attaque | 10 | 12 papers | Toutes | F36 (Multi-Turn), F48 (PIDP) |
| E. Modeles de Defense | 8 | 8 papers | Toutes | F38 (DIS), F50 (ARF) |
| F. Statistique et Validation | 8 | 8 papers | Toutes | F02 (F1), F15 (Sep) |
| **TOTAL** | **56** | **48 papers** | -- | -- |

**Note**: Le total de 56 inclut F34b, F34c, F31b et F33b comme entrees distinctes car ils representent des metriques mathematiquement differentes. Le glossaire documente 54 formules "principales" (F01-F54).

---

## Formules Manquantes (identifiees mais non extraites)

| Paper | Metrique mentionnee | Raison de l'absence | Action recommandee |
|-------|-------------------|---------------------|-------------------|
| P002-P007 | Metriques specifiques de chaque paper d'attaque | Papers anciens (2023-2024), metriques couvertes par les generalisations ulterieures (ASR, F1) | Aucune -- couverture par generalisation |
| P009-P010 | Metriques de detection par watermarking | Non pertinentes au framework delta (watermarking = technique marginale pour PI) | Faible priorite |
| P048 (SLR) | Metriques compilees des 88 etudes | Survey -- aucune formule originale. ASR, F1, DR deja documentes | Aucune -- pas de formule nouvelle |
| P058 (ETH) | Framework d'automatisation agent-level | PDF non extractible. Approche methodologique, pas de formule | Tenter extraction manuelle si PDF accessible |
| P050 | 7 strategies de jailbreak automatiques | Strategies qualitatives, non formalisees mathematiquement | Formaliser en schema taxonomique si necessaire pour exp. |
| P037 | Indicateurs 3D survey (attaque-defense-evaluation) | Indicateurs qualitatifs de completude de couverture | Faible priorite -- couvert par SEU (F53) |
| P035 | Rubrique de scoring de severite clinique (1-5) | Grille d'evaluation manuelle, pas une formule mathematique | Documenter comme protocole, pas comme formule |
| P036 | ICC -- Intraclass Correlation Coefficient | Metrique statistique standard, pas specifique a PI | Documenter en annexe si necessaire pour validation |
| P040 | Interaction emotion x technique (6 techniques x 8 LLM) | Matrice d'interaction, pas de formule unifiee | Potentiel F55 si formalisation d'un modele additif |
| P041 | Magic Token generation process | Processus d'entrainement, pas de formule de scoring | Faible priorite |
| P042 | Architecture PromptArmor (LLM-as-guardrail) | Architecture, pas de formule nouvelle (utilise FPR/FNR) | Aucune |
| P047 | Inversion formelle attaque -> defense | Transformation Invert(a) non formalisee mathematiquement | **Potentiel F55** : formaliser l'operateur Invert |

---

## Trous Mathematiques pour les Conjectures

| Conjecture | Score | Formules existantes | Formules manquantes | Impact |
|------------|-------|-------------------|---------------------|--------|
| C1 (δ⁰ insuffisant) | 10/10 VALIDEE | F23 (RLHF), F24 (KL token), F27a (I_t P019), F44 (I_t P052), F45 (KL eq.), F28 (gradient bound), F41 (MTSD 9.5->5.5) | Aucune formule manquante critique. P052 fournit la preuve formelle. | COMPLET. La chaine F23->F44->F45 est la preuve mathematique. |
| C2 (necessite δ³) | 10/10 VALIDEE | F48 (PIDP compound), F49 (PIR persistence), F35 (SPP degradation), F33b (Logit Gap 99%), F53 (SEU) | Aucune formule critique manquante. Cependant, une **formule de cout d'integration δ³** serait utile pour quantifier le surcout. | QUASI-COMPLET. Recommander F55: Cost(δ³). |
| C3 (alignement superficiel) | 10/10 VALIDEE | F24 (KL token 1-3), F44 (I_t), F45 (KL eq.), F39 (ESR 100%), F47 (PBR), F51 (ASIDE Sep ameliore) | Aucune formule manquante critique. | COMPLET. Triple preuve : empirique (F24), formelle (F44-F45), architecturale (F51). |
| C4 (derive semantique) | 9/10 | F01 (cosine), F05 (SemScore), F06 (Gauge matrix), F41 (MTSD), F48 (PIDP drift) | **Manque F56: Drift Rate formelle** = mesure normalisee de la derive semantique par tour. MTSD (F41) mesure la degradation de securite mais pas la derive semantique elle-meme. | TROU SIGNIFICATIF. La derive est mesuree indirectement via MTSD et cosine, mais pas formalisee. |
| C5 (cosine insuffisante) | 8/10 | F01 (cosine), F06 (Gauge matrix), F49 (PIR exploitation cosine), F48 (PIDP) | **Manque F57: Cosine Vulnerability Index** = mesure formelle de l'exploitabilite de la cosine similarity pour le poisoning. | TROU MODERE. Le probleme est documente qualitativement (Gauge F06, PIR F49) mais pas quantifie comme metrique unifiee. |
| C6 (medical plus vulnerable) | 9/10 | F26 (CHER), F27b (ASR seuil), F41 (MTSD, modeles med > gen), F37 (emotional amp 6x) | **Manque F58: Medical Vulnerability Premium (MVP)** = ratio ASR_medical / ASR_general formalise. P050 donne les donnees (9.5->5.5 vs generalistes) mais pas de formule nommee. | TROU SIGNIFICATIF. La vulnerabilite medicale est prouvee empiriquement mais pas formalisee en metrique. |
| C7 (paradoxe raisonnement) | 8/10 | F36 (Multi-Turn ASR 97.14%), F52 (IIOS optimisation iterative), F37 (emotional amp) | **Manque F59: Reasoning Exploitation Ratio** = mesure de la correlation entre capacite de raisonnement et vulnerabilite. P036 montre le phenomene mais ne le formalise pas. | TROU MODERE. Le paradoxe est observe mais pas quantifie formellement. |

---

## Trous pour les Experiences

| Experience | Formules utilisees | Formules necessaires | Gap |
|-----------|-------------------|---------------------|-----|
| G-009 (transfert local -> commercial) | F22 (ASR), F40 (WIRT), F01 (cosine) | F40 fournit le mecanisme. Necessite une **formule de taux de transfert** : ASR_black-box / ASR_white-box. | GAP FAIBLE. WIRT (F40) couvre le mecanisme. Le ratio de transfert est calculable depuis les donnees existantes. |
| G-011 (cross-lingual persistence) | F41 (MTSD), F22 (ASR) | Necessite une **formule de persistance cross-linguale** : ASR_langue_B / ASR_langue_A pour mesurer la conservation des vulnerabilites a travers les langues. | GAP MODERE. P050 fournit les donnees japonais-anglais mais pas de metrique formelle. |
| G-015 (Recovery Penalty empirique) | F46 (Recovery Penalty) | F46 est definie theoriquement. Necessite des **metriques d'evaluation empirique** : delta_ASR_before_after_RP et delta_Sep_before_after_RP. | GAP SIGNIFICATIF. L'objectif est defini mais non evalue experimentalement. |
| G-017 (RagSanitizer vs PIDP) | F48 (PIDP), F49 (PIR), F39 (ESR) | Les formules d'attaque existent. Necessite une **formule de defense composite** : DR_composite = f(DR_PI, DR_DP, interaction_term). | GAP MODERE. Les metriques offensives sont documentees; la metrique defensive composite manque. |
| G-019 (ASIDE vs attaques adaptatives) | F51 (ASIDE), F15 (Sep(M)) | Necessite une **metrique d'adaptation** : combien de requetes un attaquant adaptatif a besoin pour degrader Sep_ASIDE(M) sous un seuil critique. | GAP SIGNIFICATIF. Crucial pour valider C3. |

---

## Dependances Critiques Non Resolues

### 1. Circularite F22 (ASR)
F22 est le hub central avec 13+ formules dependantes. Toute instabilite dans la definition d'ASR (seuil de succes, evaluateur, juge) se propage a l'ensemble du framework. L'attaque sur les juges (F33b, Logit Gap 99% flip) menace directement la fiabilite de F22 quand il est evalue par LLM-juge.

**Risque**: Si l'ASR est mesure par LLM-juge et que le juge est compromis (P044), toutes les metriques derivees (CHER, ESR, PBR, PIDP, ARF, SEU.Sec) sont biaisees.

**Mitigation recommandee**: Utiliser le protocole dual-LLM (F42, P050) avec kappa pondere comme verification de fiabilite. Ajouter des evaluateurs deterministes non-LLM pour les cas critiques.

### 2. Gap entre preuve theorique et validation empirique (chemin F23->F44->F45->F46)
La chaine d'alignement superficiel (Chemin Critique 9) est prouvee mathematiquement mais la solution (F46, Recovery Penalty) n'est pas evaluee empiriquement. C'est le chemin le plus important de la these et il est incomplet en bout de chaine.

**Action**: Priorite #1 pour RUN-004 -- obtenir ou generer des resultats empiriques pour F46.

### 3. ASIDE (F51) non teste contre attaques adaptatives
F51 est la defense la plus prometteuse contre C3 (separation instruction/donnee) mais n'a pas ete soumise a des attaques adaptatives specifiquement concues pour contourner la rotation orthogonale. Si un attaquant peut inverser ou estimer R, ASIDE est neutralise.

**Action**: Experiment G-019 doit etre prioritise.

### 4. Formules medical-specifiques sous-representees
Sur 54 formules, seules 4 sont specifiquement medicales : F26 (CHER), F37 (Emotional Amp), F41 (MTSD sur modeles medicaux), F43 (4DLF clinique). Le ratio medical/general est de 7.4%, insuffisant pour une these focalisee sur la securite medicale.

**Action**: Formaliser les metriques medicales manquantes identifiees ci-dessus (F58 MVP, potentiellement F55 Invert operator).

---

## Chemins Critiques (12 identifies, classes par importance)

### Tier 1 -- Preuves fondamentales
1. **CC9**: F23 -> F44 -> F45 -> F46 (RLHF -> Harm Info -> KL Eq -> Recovery Penalty)
   *Chaine complete de la preuve de superficialite + solution. GAP: F46 non evalue.*

2. **CC1**: F01 -> F05 -> F15 -> F16 (Cosine -> SemScore -> Sep(M) -> Sep empirique)
   *Chaine de mesure de la separation. COMPLETE.*

### Tier 2 -- Chaines d'attaque
3. **CC10**: F03 -> F40 -> F39 -> F22 (Cross-Entropy -> WIRT -> ESR -> ASR)
   *Pipeline evasion white-to-black Hackett. COMPLETE.*

4. **CC11**: F01 -> F49 -> F48 (Cosine -> PIR -> PIDP Compound)
   *Pipeline RAG compound. COMPLETE.*

5. **CC5**: F23 -> F29 -> F22 (RLHF -> GRPO inverse -> ASR 97%)
   *Pipeline de des-alignement. COMPLETE.*

### Tier 3 -- Chaines d'evaluation
6. **CC12**: F22 -> F53 -> F54 (ASR -> SEU -> Taxonomy 6D)
   *Pipeline evaluation systematique guardrails. COMPLETE.*

7. **CC7**: F22 -> F26 -> F27b (ASR -> CHER -> ASR seuil)
   *Granularite de mesure medicale. COMPLETE.*

### Tier 4 -- Chaines de defense
8. **CC8**: F01 -> F51 -> F15 (Cosine -> ASIDE rotation -> Sep(M) ameliore)
   *Pipeline defense architecturale. GAP: G-019 attaques adaptatives.*

9. **CC6**: F03 -> F10 -> F34 (Cross-Entropy -> DMPI-PMHFE -> FPR/FNR)
   *Pipeline detection bi-canal. COMPLETE.*

---

## Recommandations pour RUN-004

### Priorite 1 : Formules a creer (trous identifies)
1. **F55 -- Invert Operator** : Formalisation mathematique de la transformation attaque->defense (P047). Necessaire pour rendre C2 operationnelle.
2. **F56 -- Semantic Drift Rate** : Mesure normalisee de la derive semantique par tour. Essentielle pour formaliser C4.
3. **F58 -- Medical Vulnerability Premium (MVP)** : Ratio ASR_med/ASR_gen. Essentielle pour formaliser C6.

### Priorite 2 : Formules a valider empiriquement
4. **F46 (Recovery Penalty)** : Obtenir des resultats experimentaux. C'est le bout manquant du chemin critique CC9.
5. **F51 (ASIDE)** : Tester contre attaques adaptatives (G-019).

### Priorite 3 : Enrichissement
6. **F59 -- Reasoning Exploitation Ratio** : Formaliser le paradoxe C7.
7. **F57 -- Cosine Vulnerability Index** : Unifier F06 (Gauge) et F49 (PIR) en metrique unique.
8. **ICC formelle** : Documenter le coefficient de correlation intra-classe (P036) comme formule de validation.

### Priorite 4 : Papers manquants (P049-P060 coverage gaps)
9. Verifier si P058 (ETH Zurich MSc) est accessible en texte integral pour extraction de formules.
10. Rechercher des papers supplementaires sur la defense RAG composite (gap G-017).

---

## Statistiques Cumulees

| Metrique | RUN-001 | RUN-002 | RUN-003 | Post-Review |
|----------|---------|---------|---------|-------------|
| Formules documentees | 22 | 37 | 54 | 54 (+4 proposees) |
| Aretes de dependance | 28 | 43 | 66 | 66 |
| Chemins critiques | 5 | 8 | 12 | 12 (classes en 4 tiers) |
| Papers couverts | 20 | 34 | 48 | 48 (12 sans formule) |
| Formules manquantes identifiees | -- | -- | -- | 4-7 (F55-F59+) |
| Categories thematiques | -- | -- | -- | 6 (A-F) |
| Formules medical-specifiques | -- | -- | -- | 4 (7.4%) |
| Conjectures a 10/10 | -- | 2 | 3 | 3 (C1, C2, C3) |
| Conjectures avec trous formels | -- | -- | -- | 4 (C4, C5, C6, C7) |

---

*Fin de la revue complete -- 54 formules classees, 12 manquantes identifiees, 4 trous de conjectures formalises*
*Agent: MATHEUX | Date: 2026-04-04 | Version: REVIEW v1.0*
