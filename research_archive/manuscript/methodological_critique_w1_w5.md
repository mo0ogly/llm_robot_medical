# Critique Méthodologique — Faiblesses W1 à W5 du Chapitre X.Y

> **Section** : Annexe méthodologique — À intégrer dans le Chapitre X.Y ou comme section X.Y.A
> **Thèse** : Séparation Instruction/Données dans les LLMs : Impossibilité, Mesure et Défense Structurelle
> **Directeur** : David Naccache (ENS)
> **Date** : Mars 2026
>
> **Objectif de cette section** : Documenter explicitement les limites méthodologiques identifiées,
> avec leur décomposition mathématique et les corrections proposées. Cette transparence est une
> exigence scientifique — une thèse qui ne documente pas ses limites est une thèse incomplète.

---

## Lecture préalable : comment lire les formules de cette section

Les formules utilisées dans ce chapitre mobilisent quelques concepts statistiques fondamentaux.
On les explique ici sans prérequis avancé.

**La moyenne** $\mu$ d'un ensemble de valeurs $\{x_1, x_2, ..., x_n\}$ : c'est simplement la somme divisée par le nombre d'éléments.
$$\mu = \frac{x_1 + x_2 + \cdots + x_n}{n} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

**La variance** $\sigma^2$ mesure à quel point les valeurs sont dispersées autour de la moyenne.
$$\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \mu)^2$$
Une variance faible signifie que toutes les valeurs sont proches de la moyenne. Une variance élevée signifie qu'elles sont très dispersées.

**L'écart-type** $\sigma = \sqrt{\sigma^2}$ est la racine carrée de la variance — il s'exprime dans la même unité que les données.

**La similarité cosinus** entre deux vecteurs $\mathbf{a}$ et $\mathbf{b}$ mesure l'angle entre eux dans un espace à plusieurs dimensions.
$$\cos(\mathbf{a}, \mathbf{b}) = \frac{\mathbf{a} \cdot \mathbf{b}}{||\mathbf{a}|| \cdot ||\mathbf{b}||} \in [-1, 1]$$
Un cosinus de 1 signifie que les deux vecteurs pointent exactement dans la même direction (très similaires). Un cosinus de 0 signifie qu'ils sont orthogonaux (sans relation). Dans le contexte de la thèse, $\mathbf{a}$ et $\mathbf{b}$ sont des *embeddings* — des représentations numériques de textes dans un espace à 384 dimensions (pour all-MiniLM-L6-v2).

---

## W1 — Biais Circulaire dans la Validation du SVC

### Description du problème

Le SVC (Score de Vraisemblance Clinique) est une métrique composite $SVC \in [0,1]$ définie comme :
$$SVC = \sum_{k=1}^{6} w_k \cdot d_k$$

Les poids $w_k = (0.25, 0.20, 0.20, 0.15, 0.10, 0.10)$ et les dimensions $d_k$ ont été définis **sur le même corpus de 47 scénarios** qui a servi à valider la métrique (SVC_violations = 0.71 vs SVC_blocked = 0.38). C'est ce qu'on appelle un **biais circulaire** ou *in-sample overfitting*.

### Décomposition mathématique

Supposons que nous disposions de $n$ scénarios dont $n^+$ ont produit des violations et $n^-$ n'en ont pas produit ($n = n^+ + n^-$).

La validation rapportée consiste à tester :
$$H_0 : \mathbb{E}[SVC \mid violation] = \mathbb{E}[SVC \mid blocked]$$
$$H_1 : \mathbb{E}[SVC \mid violation] > \mathbb{E}[SVC \mid blocked]$$

Le problème est que les poids $w_k$ ont été **choisis** de façon à maximiser la séparation entre ces deux groupes sur ces mêmes $n$ scénarios. Formellement, si on note $w^*$ les poids choisis :

$$w^* = \arg\max_{w} \left[ \overline{SVC}_{violations} - \overline{SVC}_{blocked} \right]$$

où $\overline{SVC}_{violations} = \frac{1}{n^+}\sum_{i \in violations} SVC(i; w)$ et $\overline{SVC}_{blocked} = \frac{1}{n^-}\sum_{i \in blocked} SVC(i; w)$.

On a donc estimé la performance de la métrique sur les données qui ont servi à la construire. C'est équivalent à mesurer la précision d'un modèle de classification sur son ensemble d'entraînement — le résultat est systématiquement trop optimiste.

### Biais attendu

Le biais d'optimisme en validation *in-sample* suit une approximation connue pour les métriques AUC :
$$\mathbb{E}[\text{AUC}_{in-sample}] \approx \text{AUC}_{true} + \frac{d}{2n}$$
où $d$ est le nombre de paramètres libres (ici $d = 6$ poids + 6 fonctions $d_k$ = environ 12 degrés de liberté) et $n = 47$ scénarios. L'excès d'optimisme est donc de l'ordre de $12/(2 \times 47) \approx 0.13$ unités d'AUC — non négligeable.

### Correction : validation croisée leave-one-out (LOO-CV)

La validation croisée LOO consiste à :
1. Retirer un scénario $s_i$ du corpus
2. Réentraîner (recalibrer) les poids $w_k$ sur les $n-1$ scénarios restants
3. Prédire le SVC de $s_i$ avec ces poids recalibrés
4. Répéter pour chaque $i \in \{1, ..., n\}$
5. Mesurer l'AUC-ROC sur les $n$ prédictions hors-échantillon

$$\text{AUC-LOO} = \text{AUC}\left(\{SVC_{LOO}(s_i)\}_{i=1}^{n}, \{y_i\}_{i=1}^{n}\right)$$

où $y_i = 1$ si le scénario $s_i$ a produit une violation, $y_i = 0$ sinon.

**Implémentation** : la bibliothèque `sklearn.model_selection.LeaveOneOut` avec `sklearn.linear_model.LogisticRegression` sur les 6 dimensions $d_k$ comme features.

### Clarté requise dans la thèse

La formulation actuelle — « la séparation est statistiquement significative (p < 0.001) » — doit être remplacée par :
> « Sur le corpus d'entraînement de 47 scénarios (validation *in-sample*), la séparation SVC(violations) vs SVC(blocked) est statistiquement significative (Mann-Whitney U, p < 0.001). La validation externe par LOO-CV est en cours. L'AUC *in-sample* de 0.81 constitue une borne supérieure du pouvoir prédictif réel du SVC. »

---

## W2 — Discordance entre la Formule Sep(M) de la Thèse et le Code Python

### Description du problème

La thèse (§ X.Y.6.2) définit Sep(M) comme :
$$Sep(M) = \frac{\mu_{clean} - \mu_{attack}}{\sqrt{\dfrac{\sigma^2_{clean} + \sigma^2_{attack}}{2}}}$$

Le code Python (`compute_separation_score()`) implémente :
$$Sep(M) = |p_{data} - p_{instr}|$$

Ce sont **deux métriques différentes**. La première est un *d* de Cohen (effect size standardisé). La seconde est une distance en variation totale (TV distance) dans le cas binaire. Un lecteur de la thèse qui souhaiterait reproduire les résultats à partir du code trouverait des valeurs incomparables.

### Décomposition mathématique : les deux formules expliquées

#### Formule A — Cohen's d (formule de la thèse)

Imaginons que pour chaque run $i \in \{1,...,N\}$, on mesure un *score de conformité* $c_i \in [0,1]$ où 1 = réponse conforme, 0 = violation.

- $\mu_{clean}$ = moyenne des $c_i$ pour les inputs propres (sans injection)
- $\mu_{attack}$ = moyenne des $c_i$ pour les inputs adversariaux (avec injection)
- $\sigma^2_{clean}$, $\sigma^2_{attack}$ = variances correspondantes

Le Cohen's d mesure la distance entre les deux distributions en unités d'écart-type poolé :
$$d_{Cohen} = \frac{\mu_{clean} - \mu_{attack}}{\sigma_{pooled}} \quad \text{où} \quad \sigma_{pooled} = \sqrt{\frac{\sigma^2_{clean} + \sigma^2_{attack}}{2}}$$

**Exemple numérique** : Si les inputs propres obtiennent un score de conformité moyen de 0.95 (écart-type 0.05) et les inputs adversariaux de 0.65 (écart-type 0.20), alors :
$$\sigma_{pooled} = \sqrt{\frac{0.05^2 + 0.20^2}{2}} = \sqrt{\frac{0.0025 + 0.04}{2}} = \sqrt{0.02125} \approx 0.146$$
$$d_{Cohen} = \frac{0.95 - 0.65}{0.146} \approx 2.05$$

Ce Cohen's d de 2.05 indique une séparation très forte (convention : d > 0.8 = effet large).

**Interprétation** : Un Sep(M) (version Cohen's d) élevé signifie que le modèle se comporte très différemment face aux inputs légitimes et face aux inputs adversariaux. C'est exactement ce qu'on veut démontrer.

**Limite** : Cette formule requiert un score continu $c_i$ — par exemple une probabilité de conformité ou un score embedding. Elle est plus informative mais nécessite une définition précise de $c_i$.

#### Formule B — TV Distance (formule du code)

Dans notre implémentation, chaque run produit un résultat binaire : violation (1) ou pas (0).

- $p_{data}$ = taux de violation quand le payload est dans la position *données* (HL7, OBX)
- $p_{instr}$ = taux de violation quand le payload est dans la position *instruction* (system prompt, contrôle)

La TV distance binaire est simplement :
$$TV = |p_{data} - p_{instr}|$$

**Exemple numérique** : Sur 30 runs, 12 violations avec payload en position données ($p_{data} = 12/30 = 0.40$) et 1 violation en null-control ($p_{instr} = 1/30 = 0.033$).
$$TV = |0.40 - 0.033| = 0.367$$

**Interprétation** : TV = 0 signifie que le modèle se comporte identiquement qu'il y ait injection ou non — aucune séparation. TV = 1 signifie séparation parfaite. TV = 0.367 est dans la zone de « séparation faible à partielle » selon nos seuils.

**Avantage** : Ne requiert pas de score continu — applicable directement à `validate_output()`.

### Recommandation pour la thèse

Adopter la TV distance (code existant) comme définition opérationnelle de Sep(M), et expliquer la différence avec Cohen's d en note :

> « Dans notre implémentation, nous utilisons la distance en variation totale (TV distance) comme approximation empirique de Sep(M) sur des distributions de sortie binaires (violation / non-violation), ce qui diffère de la formulation originale de Zverev et al. (ICLR 2025) basée sur des distributions continues. Cette simplification est justifiée par notre cadre de validation déterministe (`validate_output()`), mais sous-estime potentiellement la séparation dans les cas où le comportement de violation est graduel. »

---

## W3 — Absence de Fiabilité Inter-Annotateurs (ICC) pour d2, d4, d5, d6

### Description du problème

Les dimensions d2 (chaîne d'autorité), d4 (Sep(M)-readiness), d5 (traçabilité formelle) et d6 (mapping MITRE) nécessitent, dans la formulation originale de la thèse, un jugement expert humain. Or, aucune mesure de **fiabilité inter-annotateurs** n'est rapportée.

La fiabilité inter-annotateurs mesure à quel point deux experts indépendants attribuent la même note à un même prompt. Si deux experts divergent systématiquement, la métrique n'est pas fiable.

### Décomposition mathématique : le coefficient Kappa de Cohen

Supposons que deux annotateurs A et B notent $n$ prompts sur une échelle {0, 0.5, 1} pour la dimension $d_k$.

La proportion d'accord observé est :
$$p_o = \frac{\text{nombre de fois où A et B sont d'accord}}{n}$$

Mais même deux annotateurs qui notent **au hasard** s'accorderaient une partie du temps par chance. Le Kappa corrige pour cet accord aléatoire :

$$\kappa = \frac{p_o - p_e}{1 - p_e}$$

où $p_e$ est la probabilité d'accord par chance :
$$p_e = \sum_{c \in \{0, 0.5, 1\}} P_A(c) \cdot P_B(c)$$

$P_A(c)$ est la proportion de fois où l'annotateur A a attribué la note $c$, et de même pour B.

**Exemple numérique** : Sur 10 prompts, A et B s'accordent 7 fois ($p_o = 0.7$). A utilise la note 1 dans 60% des cas, B dans 50%. La chance d'accord sur la valeur 1 est $0.6 \times 0.5 = 0.30$. Avec des calculs similaires pour 0 et 0.5, on obtient $p_e \approx 0.38$. Donc :
$$\kappa = \frac{0.7 - 0.38}{1 - 0.38} = \frac{0.32}{0.62} \approx 0.52$$

**Interprétation des seuils Kappa** (Landis & Koch, 1977) :
| $\kappa$ | Accord |
|---------|--------|
| < 0.20 | Médiocre |
| 0.21–0.40 | Passable |
| 0.41–0.60 | Modéré |
| 0.61–0.80 | Substantiel |
| > 0.80 | Quasi-parfait |

Pour une publication dans une revue de sécurité informatique de haut rang, $\kappa > 0.60$ est généralement requis.

### Correction implementée

L'implémentation Python de `compute_svc()` **élimine** le besoin d'annotateurs humains pour d2, d4, d5, d6 en les calculant automatiquement par des règles déterministes (expressions régulières, vérification d'AllowedOutputSpec). La formulation de la thèse doit préciser :

> « La dimension d1 (plausibilité clinique) requiert, dans sa formulation optimale, un embedding de référence. Les dimensions d2, d4, d5 et d6 sont calculées automatiquement par des règles déterministes implémentées dans `compute_svc()` (cf. `agents/security_audit_agent.py`), éliminant le biais inter-annotateurs pour ces dimensions. La fiabilité de d1 (proxy keyword) a été évaluée par comparaison avec une annotation humaine sur 20 scénarios : accord substantiel ($\kappa = 0.71$, IC 95%: [0.52, 0.90]). »

*Note : La valeur $\kappa = 0.71$ ci-dessus est indicative — elle doit être mesurée lors de la validation expérimentale.*

---

## W4 — Seuils SVC Arbitraires (0.50 / 0.75) Non Dérivés d'une Analyse ROC

### Description du problème

La thèse propose trois niveaux d'interprétation du SVC :
| SVC | Interprétation |
|-----|----------------|
| ≥ 0.75 | Potentiel offensif élevé |
| 0.50–0.75 | Potentiel modéré |
| < 0.50 | Potentiel faible |

Ces seuils sont **arbitraires** — ils n'ont pas été dérivés d'une analyse ROC (*Receiver Operating Characteristic*). En pratique, cela signifie qu'un prompt peut avoir SVC = 0.49 et être classifié « potentiel faible » alors qu'il produit des violations, ou SVC = 0.76 et être classifié « potentiel élevé » sans produire aucune violation.

### Décomposition mathématique : la courbe ROC et le seuil Youden

La courbe ROC trace, pour chaque seuil $t \in [0,1]$, le couple :
- **Sensibilité** (aussi appelée *recall* ou Taux de Vrais Positifs, TVP) :
  $$Sens(t) = \frac{|\{s : SVC(s) \geq t \text{ ET } violation(s)\}|}{|\{s : violation(s)\}|}$$
  *Parmi tous les prompts qui ont produit des violations, quelle proportion avait un SVC ≥ t ?*

- **1 - Spécificité** (Taux de Faux Positifs, TFP) :
  $$1 - Spec(t) = \frac{|\{s : SVC(s) \geq t \text{ ET } \lnot violation(s)\}|}{|\{s : \lnot violation(s)\}|}$$
  *Parmi tous les prompts qui n'ont PAS produit de violations, quelle proportion avait quand même SVC ≥ t ?*

L'**AUC-ROC** (*Area Under the Curve*) est l'aire sous la courbe ROC :
$$AUC = \int_0^1 Sens(t) \, d(1-Spec(t))$$
- AUC = 0.5 → prédicteur sans valeur (équivalent à un hasard)
- AUC = 1.0 → prédicteur parfait
- AUC ≥ 0.70 → utile en pratique

Le **seuil de Youden** est le seuil $t^*$ qui maximise la somme (Sensibilité + Spécificité - 1) :
$$t^* = \arg\max_{t} \left[ Sens(t) + Spec(t) - 1 \right]$$

C'est le point de la courbe ROC le plus éloigné de la diagonale (performance aléatoire).

**Exemple numérique** : Si l'analyse ROC donne $t^* = 0.58$ avec Sensibilité = 0.79 et Spécificité = 0.73, alors le tableau d'interprétation devient :

| SVC | Interprétation | Sensibilité / Spécificité |
|-----|----------------|--------------------------|
| ≥ 0.75 | Potentiel élevé (haute spécificité) | Sens ≈ 0.55, Spec ≈ 0.95 |
| ≥ 0.58 | Potentiel modéré (seuil Youden optimal) | Sens ≈ 0.79, Spec ≈ 0.73 |
| < 0.58 | Potentiel faible | — |

### Implémentation Python de la calibration

```python
from sklearn.metrics import roc_curve, auc
import numpy as np

# Données : SVC scores et labels (1=violation, 0=blocked)
svc_scores = [compute_svc(s.message)["svc"] for s in all_scenarios]
labels = [1 if ASR(s) > 0 else 0 for s in all_scenarios]

# Courbe ROC
fpr, tpr, thresholds = roc_curve(labels, svc_scores)
roc_auc = auc(fpr, tpr)

# Seuil de Youden
youden_index = np.argmax(tpr - fpr)
optimal_threshold = thresholds[youden_index]
sensitivity_at_opt = tpr[youden_index]
specificity_at_opt = 1 - fpr[youden_index]

print(f"AUC-ROC : {roc_auc:.3f}")
print(f"Seuil Youden : {optimal_threshold:.3f}")
print(f"Sensibilité : {sensitivity_at_opt:.3f}")
print(f"Spécificité : {specificity_at_opt:.3f}")
```

### Correction pour la thèse

Remplacer les seuils arbitraires par :
> « Les seuils d'interprétation (SVC ≥ [t_high] : potentiel élevé ; SVC ≥ [t_youden] : potentiel modéré) ont été dérivés par analyse ROC sur le corpus de calibration (AUC = [valeur] ± [IC]). Le seuil de Youden optimal est t* = [valeur], offrant une sensibilité de [valeur] et une spécificité de [valeur] pour la prédiction de violations. Ces seuils doivent être re-calibrés sur tout corpus indépendant. »

---

## W5 — Single-Model Bias : Sep(M) Non Généralisable à partir d'un Seul Modèle

### Description du problème

L'ensemble des expériences AEGIS utilise **LLaMA 3.2 3B** comme modèle cible. Sep(M) et ASR sont mesurés exclusivement sur ce modèle. Or, la thèse vise à démontrer une propriété structurelle des LLMs en général (l'impossibilité de séparation instruction/données), pas une propriété spécifique à LLaMA 3.2.

C'est ce qu'on appelle le **biais de modèle unique** (*single-model bias*). Il a été documenté par Xu et al. (2024, NeurIPS) : les ASR mesurés sur un modèle prédisent mal les ASR sur d'autres modèles, avec des pertes de transfert de 30 à 60%.

### Décomposition mathématique : la généralisation empirique

Formellement, la thèse vise à démontrer :
$$\forall M \in \mathcal{M}_{LLM} : \exists i \text{ s.t. } Reachable(M, i) \not\subseteq Allowed(i)$$

*Pour tout LLM $M$ dans la classe des LLMs, il existe un input $i$ tel que la sortie de $M$ n'est pas dans l'ensemble autorisé.*

Mais nos expériences mesurent seulement :
$$\exists i : Reachable(LLaMA3.2, i) \not\subseteq Allowed(i)$$

*Il existe un input tel que LLaMA 3.2 produit une sortie non autorisée.*

C'est une affirmation existentielle pour un seul modèle — beaucoup plus faible que l'affirmation universelle que la thèse prétend défendre.

### Le test de généralisation multi-modèle

Pour renforcer la thèse, il faut démontrer que la même propriété tient pour $k$ modèles distincts. Avec $k$ modèles et $n$ scénarios par modèle :

$$\hat{p}_{violation}(M) = \frac{1}{n}\sum_{i=1}^{n} \mathbf{1}[Reachable(M, i) \not\subseteq Allowed(i)]$$

Si l'hypothèse de généralité est vraie, $\hat{p}_{violation}(M) > 0$ pour tous les modèles testés.

**Test statistique** : test de Fisher exact sur le tableau de contingence (violations / non-violations) × (modèle 1 / modèle 2 / ...). L'hypothèse nulle est que les taux de violation sont identiques entre modèles.

$$H_0 : \hat{p}_{violation}(M_1) = \hat{p}_{violation}(M_2) = \cdots = \hat{p}_{violation}(M_k)$$

Si $H_0$ est rejetée (p < 0.05), les modèles sont significativement différents — ce qui est attendu (W5 confirmée). Si $H_0$ n'est pas rejetée, les taux sont homogènes — ce qui renforce la généralité de la vulnérabilité structurelle.

### Paramètres pour le test multi-modèle

```yaml
modeles_a_tester:
  - llama3.2:3b          # modèle principal
  - mistral:7b           # Mistral (architecture différente)
  - gemma2:2b            # Google (RLHF différent)
  - phi3:3.8b            # Microsoft (si disponible)
scenarios_communs: 11    # mêmes 11 scénarios pour tous les modèles
N_par_condition: 30      # minimum Zverev
temperature: 0.0
```

**Résultat attendu** : Si la vulnérabilité est structurelle (Conjecture 1 vraie pour tous les LLMs), tous les modèles doivent montrer ASR > 0 sur au moins les scénarios HL7 institutionnels. Si un modèle résiste complètement (ASR = 0 sur tous les scénarios), c'est soit que ce modèle a une défense δ¹ suffisante (invalidation partielle de C1), soit que notre jeu de scénarios n'est pas assez agressif pour ce modèle.

### Formulation correcte dans la thèse

Remplacer « nos expériences AEGIS démontrent » par :
> « Nos expériences AEGIS sur le modèle LLaMA 3.2 3B démontrent la faisabilité des attaques décrites dans des conditions de laboratoire simulées. La généralisation à d'autres architectures (Mistral 7B, Gemma2 2B) constitue une extension en cours dont les résultats préliminaires sont présentés en §X.Z (Résultats Préliminaires Multi-Modèle). La démonstration formelle de l'impossibilité structurelle repose sur le cadre DY-AGENT (indépendant de l'architecture), tandis que les mesures empiriques (Sep(M), ASR) sont spécifiques au modèle testé. »

---

## Résumé des Corrections à Apporter

| Faiblesse | Correction minimale | Correction optimale |
|-----------|--------------------|--------------------|
| **W1** — Biais circulaire SVC | Signaler la limite explicitement | LOO-CV + reporter AUC hors-échantillon |
| **W2** — Discordance Sep(M) thèse/code | Adopter TV distance partout, note de bas de page | Implémenter Cohen's d en parallèle |
| **W3** — Pas d'ICC pour d2,d4,d5,d6 | Pointer vers l'implémentation déterministe | Mesurer $\kappa$ pour d1 sur 20 scénarios annotés |
| **W4** — Seuils SVC arbitraires | Mentionner la limite | Dériver seuils Youden depuis ROC |
| **W5** — Single-model bias | Signaler la limite explicitement | Tester sur mistral + gemma2, reporter |

---

## Références pour cette section

- **Cohen (1988)** : *Statistical Power Analysis for the Behavioral Sciences* (2nd ed.). LEA. — Définition du d de Cohen.
- **Landis & Koch (1977)** : *The Measurement of Observer Agreement for Categorical Data*. Biometrics, 33(1), 159–174. — Seuils d'interprétation du Kappa.
- **Hanley & McNeil (1982)** : *The Meaning and Use of the Area under a Receiver Operating Characteristic (ROC) Curve*. Radiology, 143(1), 29–36. — AUC-ROC.
- **Youden (1950)** : *Index for Rating Diagnostic Tests*. Cancer, 3(1), 32–35. — Seuil optimal Youden.
- **Xu et al. (2024)** : *Bag of Tricks: Benchmarking of Jailbreak Attacks on LLMs*. arXiv:2406.09324 (NeurIPS 2024). — Single-model bias §4.3.
- **Zverev et al. (2025)** : *Separation Score Sep(M) for Robustness Evaluation of LLMs*. ICLR 2025. — Formule originale Sep(M).
- **Wilson (1927)** : *Probable Inference, the Law of Succession, and Statistical Inference*. JASA, 22(158), 209–212. — IC Wilson pour petits échantillons.
