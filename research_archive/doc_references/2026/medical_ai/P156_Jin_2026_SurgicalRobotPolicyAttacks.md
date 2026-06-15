## [Jin, Chen, Satish, Gupta, Pokorny, Goldberg, 2026] — Attaques adversariales sur les policies apprises pour la chirurgie robotique

**Reference :** arXiv:2606.11535
**Revue/Conf :** arXiv preprint, 2026 [cs.RO]
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P156_Jin_2026_SurgicalRobotPolicyAttacks.pdf](../../literature_for_rag/P156_Jin_2026_SurgicalRobotPolicyAttacks.pdf)
> **Statut**: [PREPRINT] — lu en texte complet (12 pages)

### Abstract original

> Learning-based policies are being considered to augment the dexterity of human surgeons in robot-assisted surgery. Can the end-to-end mapping from visual observations to robot actions be vulnerable to adversarial attacks, potentially leading to patient injury? In this paper, we present the first study of adversarial threats to learning-based policies in surgical robotics. We investigate two threat modes: (a) disruptive attacks, where imperceptible visual perturbations interrupt policy execution, and (b) steering attacks, where such perturbations steer policy actions toward attacker-specified directions. We formulate three adversarial attack methods, each with increasing access to policy information, and evaluate their impact on two surgical subtasks: debridement and suturing. Our evaluation covers three end-to-end policy architectures: ACT, Diffusion Policy, and π0. In addition, we introduce a new class of photometric adversarial attacks that mimic natural visual changes, such as lighting variations, to generate effective yet visually plausible perturbations. Results from 560 physical experiments using phantoms for debridement and suturing suggest that state-of-the-art policies can be significantly disrupted, resulting in an average 61% reduction in surgical subtask success rates.
> — Source : PDF p. 1

### Résumé (5 lignes)

- **Problème :** Les policies visuomotrices apprises (imitation learning) pour l'augmentation de dextérité chirurgicale sur le système da Vinci sont-elles vulnérables à des perturbations adversariales imperceptibles dans les images endoscopiques ? (Section 1, p. 1-2)
- **Méthode :** Trois méthodes d'attaque à niveaux d'accès croissants — (1) attaque hors-ligne par perturbation universelle (UAP) sur le dataset d'entraînement, (2) attaque en ligne par descente de gradient projeté (PGD) par observation, (3) attaque photométrique temporelle (TPA) via un générateur convolutionnel léger entraîné avec régularisation photométrique — selon deux modes (disruptif et directif/steering). (Sections 4.1–4.3, p. 4-5)
- **Données :** 80 démonstrations de débridement + 100 démonstrations de suture collectées par opérateur expert sur dVRK, images RGB 224×224, espace d'action 7-DoF PSM ; 560 expériences physiques sur fantômes. (Section 5, p. 5-6)
- **Résultat :** Réduction moyenne de 61% du taux de succès des sous-tâches chirurgicales sous attaque adversariale ; par architecture, les attaques disruptives produisent une chute moyenne de 63% (ACT), 67% (Diffusion Policy), 67% (π0) sur les deux sous-tâches. (Abstract p. 1 ; Section 6, p. 6)
- **Limite :** L'étude se limite aux perturbations visuelles ; les attaques sur d'autres modalités (force, proprioception) et les mécanismes de défense restent non traités. (Section 7, p. 8)

### Analyse critique

**Forces :**
- Évaluation sur du matériel physique réel (560 expériences sur fantômes), et non en simulation pure — donnée rare dans la littérature adversariale pour la robotique (Section 6, p. 6).
- Couverture de trois architectures state-of-the-art de natures différentes (Transformer, Diffusion, VLA) permettant une comparaison inter-paradigme significative (Section 5, p. 5).
- Contribution TPA originale : la régularisation photométrique (Eq. 11, p. 5) produit des perturbations visuellement plausibles (mimic éclairage) tout en atteignant de meilleurs scores de steering que UAP/PGD (Section 6, p. 7 ; Table 1-2, p. 6).
- Analyse de la transférabilité inter-architecture et inter-tâche (Figure 4, p. 8), distinguant les généralisations réussies des échecs avec explication causale.

**Faiblesses :**
- Hypothèse white-box stricte pour les trois méthodes (Section 3, p. 3) : l'attaquant a accès au dataset D, aux poids θ et à l'observation courante o_t — un threat model irréaliste dans la plupart des déploiements cliniques où les poids sont propriétaires.
- N=80/100 démonstrations d'entraînement est faible ; la robustesse adversariale pourrait varier significativement avec un dataset plus grand ou des politiques pré-entraînées sur des corpus de plusieurs milliers de démonstrations.
- Les métriques SSIM frame-level (Table 1-2, p. 6) montrent que TPA dégrade la similarité visuelle (SSIM = 0.68–0.95 selon l'architecture) davantage que UAP/PGD (SSIM ≥ 0.90) — TPA est potentiellement plus détectable visuellement malgré sa plausibilité photométrique.
- Absence de section Limitations formelle ; les limites sont intégrées dans la conclusion (Section 7, p. 8) sans quantification de leur impact.
- Un seul type de fantôme pour chaque sous-tâche ; la variabilité anatomique réelle (texture, rigidité, géométrie du tissu) n'est pas modélisée.

**Questions ouvertes :**
- Quels mécanismes de détection (anomalie de trajectoire, dérive d'action, cohérence temporelle des actions) permettraient de détecter ces attaques en temps réel ?
- Les attaques sont-elles transférables à des systèmes multi-caméras (stéréoscopie endoscopique 3D) où la cohérence inter-vue constitue une contrainte supplémentaire ?
- Comment évolue la vulnérabilité avec le volume de données d'entraînement et avec des politiques robustes (data augmentation photométrique à l'entraînement) ?

### Formules exactes

**Formulation générale de l'attaque adversariale (classification, Eq. 1, p. 3) :**
```
f(x + δ) ≠ y
```
Étendue aux policies visuomotrices : perturbation δ_t ajoutée à l'image endoscopique i_t.

**Images attaquées (Eq. 2, p. 3) :**
```
i'_t = i_t + δ_t      (perturbation imperceptible bornée)
i'_t = i_t + Δ_t      (perturbation photométrique subtile)
```

**Action attaquée produite par la policy (Eq. 3, p. 3) :**
```
a'_t = π_θ(i'_t, p_t)
```

**Mode disruptif — loss (Eq. 4, p. 3) :**
```
L_disruptive = - ‖a' - a‖²_2
```

**Mode directif/steering — loss (Eq. 5, p. 3) :**
```
L_steering = ‖a' - a^target‖²_2
```
avec `a^target = a + b`, où b est un offset par joint spécifié par l'attaquant.

**Attaque hors-ligne UAP — optimisation (Eq. 6-7, p. 4) :**
```
δ^fixed = arg min_δ (1/|D|) Σ_D L_attack
‖δ^fixed‖ ≤ ε
```

**Attaque en ligne PGD — itération (Eq. 8-9, p. 4-5) :**
```
δ^(k+1)_t = δ^k_t - α ∇_{δ^k_t} L_attack
‖δ^(k+1)_t‖ ≤ ε,   k = 0, …, K-1
```

**Attaque TPA — objectif d'entraînement du générateur (Eq. 10, p. 5) :**
```
L = L_attack + λ_photo · L_photo
```

**Régularisation photométrique TPA (Eq. 11, p. 5) :**
```
L_photo = ‖i + Δ - T_photo(i)‖²_2
```
où T_photo désigne une transformation photométrique plausible (luminosité, contraste, correction gamma).

**Déploiement en ligne TPA (Eq. 12, p. 5) :**
```
Δ_t = G(o_t)
```

Budget de perturbation : ε (norme L_∞ pour UAP et PGD) ; non quantifié numériquement dans le texte principal — renvoyé au matériel supplémentaire.

### Pertinence thèse AEGIS

> **Note préliminaire :** Ce papier est **cyber-physique adjacent (non-LLM)**. Il attaque la policy visuomotrice apprise du robot chirurgical (ACT/Diffusion/π0), et non un LLM à proprement parler (bien que π0 soit un modèle vision-langage-action). La pertinence pour AEGIS est indirecte mais réelle : il démontre que la couche action du robot chirurgical est elle-même vulnérable à des perturbations imperceptibles, ce qui renforce la nécessité d'une validation indépendante des commandes robotiques.

**Couches delta :**
- **δ³ (validation formelle de sortie/action)** — pertinence principale et directe : le papier démontre que les actions générées par une policy apprise peuvent être détournées via la seule manipulation visuelle. Une couche δ³ de validation indépendante des commandes robot (détection d'anomalie de trajectoire, monitoring de cohérence proprioceptive) aurait pu détecter les déviations induites (gripper overshoot, needle snapping). Ce papier constitue une motivation expérimentale forte pour δ³ dans le contexte chirurgical.
- **δ² (monitoring comportemental/dérive)** — pertinence secondaire : les attaques steering induisent une dérive progressive de la trajectoire (Section 6, p. 7 — "per-step steering biases can accumulate over time") ; un moniteur δ² détectant la dérive d'action dans le temps serait un premier niveau de défense.
- **δ⁰/δ¹** — pertinence nulle ou très indirecte : pas de LLM, pas de RAG, pas d'alignement RLHF impliqué.

**Conjectures :**
- **C2 (nécessité δ³)** — *supportée*, avec evidence directe : des commandes robotiques générées par une policy apprise peuvent être malicieusement détournées via des perturbations visuelles imperceptibles, causant des dommages irréversibles (déformation tissulaire, cassure d'aiguille). Cela renforce l'argument que la validation des commandes en sortie de policy doit être indépendante de la policy elle-même. Lien indirect : la policy attaquée ici n'est pas un LLM, mais le pattern vulnérabilité-action est structurellement analogue au risque que C2 cherche à couvrir.
- **C6 (enjeux vitaux médicaux)** — *supportée partiellement et indirectement* : le papier illustre concrètement qu'une compromission de la couche visuomotrice peut entraîner des dommages patient irréversibles (Section 7, p. 8 — "inflicting irreversible harm on the patient before the surgeon detects the anomaly"). Lien indirect — C6 dans AEGIS concerne les LLM médicaux, pas les policies robotiques, mais le registre de dangerosité est identique.

**Découvertes AEGIS :**
- Aucun lien direct avec D-001 à D-020 (toutes relatives aux LLM). Ce papier ouvre une piste cyber-physique adjacente qui pourrait alimenter une future découverte D-XXX sur la vulnérabilité de la couche action des robots chirurgicaux.

**Gaps :**
- **G-011 (Da Vinci — threat model cyber-physique)** — *adressé partiellement* : le papier fournit un threat model concret et quantifié pour les attaques visuelles sur le da Vinci Research Kit. Il ne couvre pas les attaques sur le flux de commandes réseau, les capteurs de force, ou l'interface chirurgien-robot.
- La limite "attaques sur modalités non-visuelles" (Section 7, p. 8) crée un nouveau gap potentiel G-0XX : vulnérabilité des policies multimodales chirurgicales aux attaques sur la proprioception ou la force.

**Mapping templates AEGIS :** Aucun mapping direct — ce papier n'attaque pas de LLM et ne génère pas de prompts adversariaux. Pertinence conceptuelle pour la taxonomie d'attaque (mode disruptif/steering) qui peut inspirer la classification des vecteurs δ³ dans le threat model AEGIS étendu.

### Citations clés

> "Learning-based policies are being considered to augment the dexterity of human surgeons in robot-assisted surgery. Can the end-to-end mapping from visual observations to robot actions be vulnerable to adversarial attacks, potentially leading to patient injury?" (Abstract, p. 1)

> "We present the first study of adversarial threats to learning-based policies in surgical robotics." (Abstract, p. 1) — [Claim des auteurs, rapportée telle quelle. Non érigée en primauté AEGIS — HUMILITY GATE.]

> "Results from 560 physical experiments using phantoms for debridement and suturing suggest that state-of-the-art policies can be significantly disrupted, resulting in an average 61% reduction in surgical subtask success rates." (Abstract, p. 1 ; confirmé Section 6, p. 6)

> "Disruptive attacks induce different failure behaviors across policies. ACT and π0 tend to show early gripper overshoot, where the dVRK gripper moves abruptly far beyond the intended motion direction. Diffusion Policy produces smoother trajectories, but attack-induced errors accumulate over time and can cause misgrasping in debridement or suboptimal stitching poses in suturing, which may lead to needle snapping." (Section 6, p. 6)

> "Steering attacks can be generated within milliseconds per observation and can amplify small actions into large dangerous actions through closed-loop execution." (Section 7 / Conclusion, p. 8)

> "This paper studies adversarial attacks on learning-based policies in surgical manipulation tasks, focusing on visual inputs. Since robot are inherently multimodal, future work should examine attacks on other input modalities, e.g., force, and their interactions with visual perturbations." (Section 7, p. 8)

> "Suturing shows higher adversarial vulnerability than debridement because small directional errors can misalign needle insertion, causing bottom-surface collision, one-sided phantom penetration, or needle snapping." (Section 6, p. 7)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 — pertinence cyber-physique réelle pour δ³/C2/G-011, mais adjacente au périmètre LLM d'AEGIS |
| Reproductibilité | Moyenne — expériences physiques sur dVRK (accès matériel requis), hyperparamètres en supplementary non inclus dans le PDF principal, page projet disponible (https://sites.google.com/view/adversary-surgery) |
| Code disponible | Partiellement — page projet référencée (Section Abstract, p. 1) ; code non lié explicitement dans le PDF |
| Dataset public | Non — démonstrations collectées par les auteurs, non publiées à la date du preprint |
| Nature | [EMPIRIQUE] — résultats expérimentaux sur 560 runs physiques, sans garanties théoriques formelles sur l'ASR ou les bornes de perturbation |
| Tag thématique | cyber-physique adjacent (non-LLM) |
