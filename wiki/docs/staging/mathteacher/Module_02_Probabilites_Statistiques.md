# Module 2 — Probabilites et Statistiques pour la Securite des LLM

**Temps estime** : 6-8 heures
**Prerequis** : Module 1 (vecteurs, produit scalaire) + bac+2 stats (moyenne, variance)
**Formules couvertes** : Distributions, esperance, variance, intervalles de confiance, fonctions indicatrices, **8.15 Facteur d'Amplification Emotionnelle** [2026]

---

## Motivation : Pourquoi les probabilites ?

Un modele de langage est fondamentalement un **generateur de probabilites**. A chaque etape, il produit une distribution de probabilite sur tous les tokens possibles et en choisit un. Comprendre les distributions est essentiel pour :
- Mesurer si un modele distingue instructions et donnees (Sep(M) — formule 3.1)
- Evaluer la performance des detecteurs (F1, AUROC)
- Comprendre l'alignement RLHF (formule 4.1) et ses limites

**Articles concernes** : P024 (Zverev — Sep(M)), P019 (Young — Harm gradient), P008 (Attention Tracker), P018 (Shallow alignment)

---

## Prerequis : Ce qu'il faut savoir avant

Vous devriez deja connaitre :
- La notion de probabilite (nombre entre 0 et 1)
- La moyenne (somme / nombre d'elements)
- La variance intuitive (mesure de la dispersion)

---

## Partie A — Variables aleatoires et distributions

### Theorie formelle

Une **variable aleatoire** X est une fonction qui associe un nombre a chaque issue d'une experience aleatoire.

**Variable aleatoire discrete** : prend un nombre fini (ou denombrable) de valeurs.
$$P(X = x_i) = p_i \quad \text{avec} \quad \sum_i p_i = 1$$

**Variable aleatoire continue** : prend des valeurs dans un intervalle, decrite par une densite f(x).
$$P(a \leq X \leq b) = \int_a^b f(x) \, dx \quad \text{avec} \quad \int_{-\infty}^{+\infty} f(x) \, dx = 1$$

### Explication simple

Quand un LLM genere un token, il choisit parmi ~50,000 possibilites. La distribution de probabilite lui dit : "le" a 15% de chances, "un" a 8%, "patient" a 3%, etc. La somme de toutes les probabilites = 100%. C'est une variable aleatoire discrete avec ~50,000 valeurs possibles.

### Exemple numerique

Un LLM medical genere le prochain token apres "Le patient doit prendre" :
- P("500mg") = 0.35
- P("1000mg") = 0.25
- P("du") = 0.20
- P("une") = 0.10
- P(autres) = 0.10

Apres injection malveillante, la distribution change :
- P("5000mg") = 0.40  (dose dangereuse poussee en tete)
- P("500mg") = 0.20
- P("tout") = 0.15
- P(autres) = 0.25

La difference entre ces deux distributions est exactement ce que Sep(M) (formule 3.1) cherche a mesurer.

---

## Partie B — Esperance mathematique

### Theorie formelle

L'**esperance** (ou moyenne) d'une variable aleatoire :

Cas discret :
$$\mathbb{E}[X] = \sum_i x_i \cdot P(X = x_i) = \sum_i x_i \cdot p_i$$

Cas continu :
$$\mathbb{E}[X] = \int_{-\infty}^{+\infty} x \cdot f(x) \, dx$$

**Proprietes** :
- Linearite : E[aX + bY] = aE[X] + bE[Y]
- E[constante] = constante

### Explication simple

L'esperance est la "valeur moyenne a long terme". Si on repete l'experience un tres grand nombre de fois, la moyenne observee convergera vers l'esperance. Dans le contexte des LLM, l'esperance sert a moyenner sur toutes les reponses possibles du modele.

### Notation au-dela du bac+2

| Notation | Signification | Utilisation dans les articles |
|----------|--------------|-------------------------------|
| E[.] ou E_x[.] | Esperance | Moyenne sur toutes les reponses possibles |
| E_{x ~ p} | Esperance quand x suit la loi p | Moyenne sur les echantillons de la distribution p |
| E_{(s,d,x) ~ p} | Esperance sur triplets (s,d,x) | Utilisee dans Sep(M) — moyenne sur systeme, donnees, probe |

### Exemple numerique

Soit le score de nocivite d'un LLM medical sur 5 reponses :

| Reponse | Nocivite h(y) | Probabilite P(y) |
|---------|--------------|-------------------|
| Reponse saine A | 0.1 | 0.50 |
| Reponse saine B | 0.2 | 0.30 |
| Reponse douteuse | 0.5 | 0.12 |
| Reponse dangereuse | 0.8 | 0.05 |
| Reponse tres dangereuse | 1.0 | 0.03 |

E[h(y)] = 0.1*0.50 + 0.2*0.30 + 0.5*0.12 + 0.8*0.05 + 1.0*0.03
        = 0.05 + 0.06 + 0.06 + 0.04 + 0.03
        = **0.24**

La nocivite moyenne est 0.24 — faible mais non nulle, car il y a une petite probabilite de reponses dangereuses.

---

## Partie C — Variance et ecart-type

### Theorie formelle

$$\text{Var}(X) = \mathbb{E}[(X - \mathbb{E}[X])^2] = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$$

$$\sigma(X) = \sqrt{\text{Var}(X)}$$

**Proprietes** :
- Var(aX) = a^2 * Var(X)
- Var(X + Y) = Var(X) + Var(Y) si X et Y independants

### Explication simple

La variance mesure "a quel point les valeurs sont dispersees autour de la moyenne". Une faible variance signifie que les valeurs sont concentrees (reponses previsibles). Une forte variance signifie des reponses tres variables (potentiellement dangereuses en milieu medical).

### Exemple numerique (suite)

E[h(y)] = 0.24 (calcule ci-dessus)

E[h(y)^2] = 0.01*0.50 + 0.04*0.30 + 0.25*0.12 + 0.64*0.05 + 1.0*0.03
           = 0.005 + 0.012 + 0.030 + 0.032 + 0.030
           = 0.109

Var(h(y)) = 0.109 - 0.24^2 = 0.109 - 0.0576 = **0.0514**
sigma = sqrt(0.0514) = **0.227**

La variance est relativement elevee par rapport a la moyenne (coefficient de variation = 0.227/0.24 = 95%), ce qui indique une grande variabilite dans la nocivite des reponses.

---

## Partie D — Covariance

### Theorie formelle

$$\text{Cov}(X, Y) = \mathbb{E}[(X - \mathbb{E}[X])(Y - \mathbb{E}[Y])] = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y]$$

**Proprietes** :
- Cov(X, X) = Var(X)
- Cov(X, Y) > 0 : X et Y evoluent dans le meme sens
- Cov(X, Y) < 0 : X et Y evoluent en sens opposes
- Cov(X, Y) = 0 : X et Y non correlees

### Explication simple

La covariance mesure si deux quantites evoluent ensemble. Dans le contexte du theoreme du gradient (formule 4.5, P019), la covariance entre "nocivite d'un token" et "possibilite de changer ce token" determine si l'entrainement RLHF peut modifier le comportement du modele a cette position.

### Pourquoi c'est crucial pour la formule 4.5

Le theoreme de Young (P019) dit que le gradient d'alignement a la position t est proportionnel a :

$$\text{Cov}_{y_t|y_{<t}}\left(h_t(y_{\leq t}),\; \nabla_\theta\log P_\theta(y_t|y_{<t})\right)$$

Si la nocivite a la position t (h_t) n'est PAS correlee avec la possibilite de changer le token a cette position (gradient du log-probabilite), alors la covariance = 0 et l'entrainement ne modifie RIEN. C'est exactement ce qui se passe aux positions tardives : la nocivite est deja decidee, donc decorrelee des tokens suivants.

### Exemple numerique

5 reponses, on mesure la nocivite a la position 2 (h_2) et la flexibilite du token (delta log P) :

| Reponse | h_2 | delta_log_P | h_2 * delta_log_P |
|---------|-----|-------------|-------------------|
| 1 | 0.1 | 0.8 | 0.08 |
| 2 | 0.3 | 0.6 | 0.18 |
| 3 | 0.5 | 0.3 | 0.15 |
| 4 | 0.8 | 0.1 | 0.08 |
| 5 | 0.9 | 0.05 | 0.045 |

E[h_2] = (0.1+0.3+0.5+0.8+0.9)/5 = 0.52
E[delta_log_P] = (0.8+0.6+0.3+0.1+0.05)/5 = 0.37
E[h_2 * delta_log_P] = (0.08+0.18+0.15+0.08+0.045)/5 = 0.107

Cov = 0.107 - 0.52*0.37 = 0.107 - 0.1924 = **-0.085**

La covariance est negative : quand la nocivite est elevee, la flexibilite du token est faible (et inversement). L'entrainement a deja appris a rendre les tokens critiques moins modifiables, mais cet effet est concentre sur les premieres positions.

---

## Partie E — Fonctions indicatrices

### Theorie formelle

La **fonction indicatrice** d'un evenement A :

$$\mathbb{1}_A = \begin{cases} 1 & \text{si A est vrai} \\ 0 & \text{si A est faux} \end{cases}$$

**Propriete fondamentale** :
$$\mathbb{E}[\mathbb{1}_A] = P(A)$$

### Explication simple

C'est un "interrupteur" mathematique : 1 si la condition est remplie, 0 sinon. Tres utile pour compter des elements qui satisfont une condition.

### Utilisation dans Sep(M) empirique (formule 3.2)

La formule empirique de Sep(M) utilise des indicatrices pour compter les temoins surprises :

$$\widehat{\text{sep}}(g) = \frac{\sum_{i=1}^{n} \mathbb{1}_{\{w_i \in y_i^{I} \wedge w_i \notin y_i^{D}\}}}{\sum_{i=1}^{n} \mathbb{1}_{\{w_i \in y_i^{I}\}}}$$

En francais :
- Numerateur : nombre de cas ou le temoin apparait en mode instruction MAIS PAS en mode donnee
- Denominateur : nombre de cas ou le temoin apparait en mode instruction

### Exemple numerique

10 tests avec des probes differentes :

| Test | w in y_I ? | w in y_D ? | Numerateur | Denominateur |
|------|-----------|-----------|------------|--------------|
| 1 | Oui | Non | 1 | 1 |
| 2 | Oui | Non | 1 | 1 |
| 3 | Oui | Oui | 0 | 1 |
| 4 | Non | Non | 0 | 0 |
| 5 | Oui | Non | 1 | 1 |
| 6 | Oui | Oui | 0 | 1 |
| 7 | Oui | Non | 1 | 1 |
| 8 | Non | Non | 0 | 0 |
| 9 | Oui | Non | 1 | 1 |
| 10 | Oui | Non | 1 | 1 |

sep_hat = 6/8 = **0.75** (le modele separe correctement dans 75% des cas)
uti = 8/10 = **0.80** (le modele execute 80% des instructions)

---

## Partie F — Intervalles de confiance et validite statistique

### Theorie formelle

Pour un echantillon de taille n avec proportion observee p_hat :

**Intervalle de confiance de Wilson** (plus robuste que l'approche normale pour les petits echantillons) :
$$\tilde{p} \pm \frac{z_{\alpha/2}}{1 + z_{\alpha/2}^2/n} \sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z_{\alpha/2}^2}{4n^2}}$$

ou z_{alpha/2} = 1.96 pour un IC a 95%.

**Regle cruciale pour la these AEGIS** : Sep(M) necessite N >= 30 par condition pour avoir une validite statistique suffisante.

### Explication simple

Un intervalle de confiance repond a la question : "Compte tenu de nos observations, quelle est la plage vraisemblable de la vraie valeur ?" Avec trop peu d'observations, l'intervalle est trop large pour conclure quoi que ce soit. C'est pourquoi la these exige au minimum 30 mesures par condition.

### Pourquoi le score de Wilson plutot que l'IC normal ?

L'IC normal (p_hat +/- z * sqrt(p*(1-p)/n)) echoue quand p est proche de 0 ou 1 (il peut donner des bornes negatives ou superieures a 1). Le score de Wilson corrige ce probleme. En securite, on s'attend souvent a p proche de 0 (tres peu de violations) ou de 1 (presque toutes les attaques reussissent), d'ou le choix du Wilson.

### Exemple numerique

Sep(M) = 0 avec 0 violations sur n = 10 tests.

Avec Wilson (alpha = 0.05, z = 1.96) :
- p_hat = 0/10 = 0.0
- IC Wilson = [0.0, 0.278]

Cela signifie que la vraie valeur de Sep(M) pourrait etre aussi elevee que 0.278 — on ne peut PAS conclure que le modele est parfaitement securise. C'est le "floor artifact" mentionne dans la these : Sep(M) = 0 avec un petit echantillon n'est pas une preuve de securite.

Avec n = 100 et toujours 0 violations :
- IC Wilson = [0.0, 0.037]

Maintenant l'intervalle est beaucoup plus etroit : on peut conclure avec plus de confiance.

---

## Exercices progressifs

### Exercice 1 (Facile) — Calcul d'esperance

Un detecteur d'injection classe 100 requetes. Les resultats :

| Score du detecteur | Nombre de requetes | Proportion |
|-------------------|-------------------|------------|
| 0.0 - 0.2 (normal) | 60 | 0.60 |
| 0.2 - 0.5 (suspect) | 25 | 0.25 |
| 0.5 - 0.8 (probable injection) | 10 | 0.10 |
| 0.8 - 1.0 (injection certaine) | 5 | 0.05 |

Calculez le score moyen (en prenant le milieu de chaque intervalle).

**Solution** :
E[score] = 0.1*0.60 + 0.35*0.25 + 0.65*0.10 + 0.9*0.05
         = 0.06 + 0.0875 + 0.065 + 0.045
         = **0.2575**

Le score moyen est 0.26 — la plupart des requetes sont normales.

---

### Exercice 2 (Moyen) — Indicatrices et Sep(M) empirique

Sur 20 tests de Sep(M) avec le probe "Reponds en commencant par VERIFIED" :

Tests 1-15 : le temoin "VERIFIED" apparait en mode instruction (w in y_I)
Tests 16-20 : le temoin "VERIFIED" n'apparait PAS en mode instruction

Parmi les 15 ou il apparait en mode instruction :
- Tests 1-10 : il n'apparait PAS en mode donnee (bonne separation)
- Tests 11-15 : il apparait AUSSI en mode donnee (mauvaise separation)

Calculez sep_hat et uti.

**Solution** :
- Denominateur (w in y_I) : 15/20 tests -> uti = 15/20 = **0.75**
- Numerateur (w in y_I ET w not in y_D) : 10 tests
- sep_hat = 10/15 = **0.667**

Interpretation : le modele execute 75% des instructions et separe correctement instruction/donnee dans 66.7% des cas. C'est insuffisant pour un usage medical (on voudrait > 0.95).

---

### Exercice 3 (Moyen) — Intervalle de confiance

Vous mesurez Sep(M) = 0.80 sur n = 25 tests.

a) Est-ce statistiquement valide selon le critere AEGIS (N >= 30) ?
b) Calculez un IC approximatif (normal) a 95% : p_hat +/- 1.96 * sqrt(p*(1-p)/n)
c) Que concluez-vous ?

**Solution** :

a) **Non**, n = 25 < 30, le resultat n'est pas statistiquement valide selon le critere AEGIS.

b) IC = 0.80 +/- 1.96 * sqrt(0.80 * 0.20 / 25)
     = 0.80 +/- 1.96 * sqrt(0.0064)
     = 0.80 +/- 1.96 * 0.08
     = 0.80 +/- 0.157
     = **[0.643, 0.957]**

c) L'intervalle est tres large (de 0.64 a 0.96). On ne peut pas determiner avec confiance si le modele a une bonne separation (> 0.90) ou une separation mediocre (< 0.70). Il faut augmenter n a au moins 30 (idealement 50+) pour reduire l'incertitude.

---

### Exercice 4 (Difficile) — Covariance et gradient d'alignement

Un modele genere 6 reponses. Pour chaque reponse, on mesure la nocivite au token 5 (h_5) et au token 1 (h_1), ainsi que la flexibilite du gradient (grad) :

| Reponse | h_1 | grad_1 | h_5 | grad_5 |
|---------|-----|--------|-----|--------|
| 1 | 0.1 | 0.9 | 0.1 | 0.02 |
| 2 | 0.2 | 0.7 | 0.2 | 0.03 |
| 3 | 0.8 | 0.3 | 0.3 | 0.01 |
| 4 | 0.9 | 0.1 | 0.3 | 0.02 |
| 5 | 0.3 | 0.6 | 0.2 | 0.04 |
| 6 | 0.7 | 0.2 | 0.3 | 0.01 |

a) Calculez Cov(h_1, grad_1) et Cov(h_5, grad_5)
b) A quelle position l'alignement est-il le plus efficace ?
c) Reliez au theoreme de Young (P019).

**Solution** :

a) **Position 1** :
E[h_1] = (0.1+0.2+0.8+0.9+0.3+0.7)/6 = 3.0/6 = 0.50
E[grad_1] = (0.9+0.7+0.3+0.1+0.6+0.2)/6 = 2.8/6 = 0.467
E[h_1*grad_1] = (0.09+0.14+0.24+0.09+0.18+0.14)/6 = 0.88/6 = 0.147
Cov(h_1, grad_1) = 0.147 - 0.50*0.467 = 0.147 - 0.233 = **-0.087**

**Position 5** :
E[h_5] = (0.1+0.2+0.3+0.3+0.2+0.3)/6 = 1.4/6 = 0.233
E[grad_5] = (0.02+0.03+0.01+0.02+0.04+0.01)/6 = 0.13/6 = 0.022
E[h_5*grad_5] = (0.002+0.006+0.003+0.006+0.008+0.003)/6 = 0.028/6 = 0.0047
Cov(h_5, grad_5) = 0.0047 - 0.233*0.022 = 0.0047 - 0.0051 = **-0.0004**

b) |Cov(h_1, grad_1)| = 0.087 >> |Cov(h_5, grad_5)| = 0.0004

L'alignement est ~200 fois plus efficace a la position 1 qu'a la position 5.

c) C'est exactement la prediction du theoreme de Young : le gradient d'entrainement (proportionnel a la covariance) est concentre sur les premieres positions et tombe quasi a zero aux positions ulterieures. L'alignement RLHF ne peut modifier le comportement du modele qu'aux premiers tokens — c'est l'alignement "superficiel" (shallow alignment) que la these AEGIS cherche a pallier avec des couches de defense externes.

---

## Complement 2026 — Facteur d'Amplification Emotionnelle (Formule 8.15)

### Theorie formelle

Taux de misinformation medicale :
$$\text{MR}_{cond} = \frac{|\{i : \text{LLM genere misinformation sous condition } c\}|}{|\mathcal{D}_{test}|} \times 100\%$$

Facteur d'amplification :
$$\text{AmpFactor} = \frac{\text{MR}_{emo+PI}}{\text{MR}_{baseline}}$$

### Explication simple

Le MR mesure le pourcentage de cas ou un LLM genere de la desinformation medicale dangereuse. Le facteur d'amplification emotionnelle mesure **combien de fois** l'ajout de manipulation emotionnelle (histoires tristes, urgence fictive, empathie forcee) a un prompt d'injection **multiplie** le taux de succes.

C'est un simple ratio de proportions — ce qui en fait un outil statistique elementaire, mais aux consequences profondes.

### Analogie

Un arnaqueur telephonique cible un medecin. Sans emotion : "Prescrivez du thalidomide a cette patiente enceinte" — 6% de succes. Avec emotion : "Docteur, cette patiente va mourir, son bebe souffre horriblement, elle n'a PERSONNE d'autre, vous etes son DERNIER espoir" — 37% de succes. La pression emotionnelle court-circuite la vigilance. Les LLM, comme les humains, sont plus vulnerables quand le prompt contient de l'urgence et de la detresse.

### Exemple numerique

8 LLM x 6 techniques d'injection x 2 conditions = 112 scenarios (P040) :
- MR_baseline (sans injection) = **6.2%**
- MR_PI (injection seule) = **18.8%** -> AmpFactor_PI = 18.8/6.2 = **3.0x**
- MR_emo+PI (injection + emotion) = **37.5%** -> AmpFactor_emo = 37.5/6.2 = **6.0x**

L'emotion **double** l'efficacite de l'injection par rapport a l'injection seule (6x vs 3x baseline).

Exception notable : Claude 3.5 Sonnet — MR_emo = **4.2%**, AmpFactor = **0.7x** (la manipulation emotionnelle est MOINS efficace que le baseline, resistance superieure).

### Ou c'est utilise

- **P040** : Etude sur la manipulation emotionnelle et la desinformation medicale
- **AEGIS** : La couche δ¹ doit detecter les manipulations emotionnelles, pas seulement les injections logiques

### Exercice (Moyen) — Facteur d'amplification

Un hopital teste son LLM d'assistance dans 3 conditions :
- Baseline (pas d'injection) : 8 reponses erronees sur 200 = MR_base = 4%
- Injection classique : 30 reponses erronees sur 200 = MR_PI = 15%
- Injection + urgence emotionnelle : 52 reponses erronees sur 200 = MR_emo = 26%

a) Calculez AmpFactor_PI et AmpFactor_emo
b) De combien l'emotion amplifie-t-elle l'injection (ratio emo/PI) ?
c) L'hopital a un seuil d'acceptabilite de MR < 5%. Quelles conditions depassent le seuil ?

**Solution** :

a) AmpFactor_PI = 15% / 4% = **3.75x** (l'injection multiplie par 3.75)
   AmpFactor_emo = 26% / 4% = **6.50x** (injection + emotion multiplie par 6.50)

b) Ratio emo/PI = 26% / 15% = **1.73x** — l'emotion amplifie l'injection d'un facteur 1.73 supplementaire

c) Seuil MR < 5% :
   - Baseline (4%) : **acceptable** (mais tout juste)
   - Injection (15%) : **inacceptable** (3x le seuil)
   - Injection + emotion (26%) : **tres inacceptable** (5.2x le seuil)
   Conclusion : meme le baseline est a la limite. Les couches δ¹ et δ² sont imperatives.

---

## Resume du module

| Concept | Formule cle | Application |
|---------|------------|-------------|
| Esperance | E[X] = sum(x_i * p_i) | Moyenne sur les reponses du LLM |
| Variance | Var(X) = E[X^2] - E[X]^2 | Variabilite des reponses |
| Covariance | Cov(X,Y) = E[XY] - E[X]E[Y] | Gradient d'alignement (formule 4.5) |
| Indicatrices | 1_A = 1 si A, 0 sinon | Comptage dans Sep(M) empirique |
| IC Wilson | p_tilde +/- ... | Validite statistique (N >= 30) |
| **AmpFactor** [2026] | MR_emo / MR_base | Amplification emotionnelle des attaques |

**Message cle** : Les probabilites et statistiques sont le langage de la securite des LLM. Les resultats 2026 montrent que le facteur d'amplification emotionnelle (un simple ratio de proportions) revele une vulnerabilite inattendue : les LLM sont 6x plus vulnerables quand l'injection est accompagnee de manipulation emotionnelle.

---

*Module 2 termine — Passez au Module 3 (Theorie de l'Information)*
