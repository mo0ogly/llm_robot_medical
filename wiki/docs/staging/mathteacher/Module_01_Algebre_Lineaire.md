# Module 1 — Algebre Lineaire pour la Securite des LLM

**Temps estime** : 6-8 heures
**Prerequis** : Bac+2 (vecteurs de base, produit scalaire intuitif)
**Formules couvertes** : 1.1 Similarite Cosinus, 2.2 Gauge Matrix, 6.3 Factorisation Matricielle

---

## Motivation : Pourquoi l'algebre lineaire ?

Dans le domaine de l'injection de prompts, **tout est vecteur**. Chaque mot, chaque phrase, chaque reponse d'un modele de langage est represente par un vecteur dans un espace a plusieurs centaines de dimensions. Pour detecter si une injection a corrompu la reponse d'un LLM medical, on compare des vecteurs. Pour mesurer la "derive semantique" causee par une attaque, on calcule des distances entre vecteurs.

**Articles concernes** : P012 (Steck 2024), P013, P014 (SemScore), P015, P016, P024 (Zverev Sep(M)), P025

---

## Prerequis : Ce qu'il faut savoir avant

Vous devriez deja connaitre :
- La notion de vecteur dans R^2 et R^3 (une fleche avec une direction et une longueur)
- L'addition de vecteurs et la multiplication par un scalaire
- Le produit scalaire dans R^2 : u . v = u₁v₁ + u₂v₂

Si ce n'est pas le cas, regardez les 4 premieres videos de "Essence of Linear Algebra" (3Blue1Brown, YouTube, gratuit).

---

## Partie A — Vecteurs en grande dimension

### Theorie formelle

Un **vecteur** dans R^n est un n-uplet de nombres reels :

$$\mathbf{u} = (u_1, u_2, \ldots, u_n) \in \mathbb{R}^n$$

En NLP (traitement du langage naturel), n = 384 (all-MiniLM-L6-v2) ou n = 768 (all-mpnet-base-v2). Chaque dimension encode un aspect du "sens" du texte.

### Explication simple

Imaginez que chaque phrase est decrite par 384 notes (de -1 a 1), chacune mesurant un aspect du sens : "medecine" = 0.9, "danger" = 0.7, "pediatrie" = 0.3, etc. Deux phrases sur le meme sujet auront des notes similaires, donc des vecteurs proches.

### Notation au-dela du bac+2

| Notation | Signification | Exemple |
|----------|--------------|---------|
| R^n | Espace des vecteurs a n dimensions | R^384 pour MiniLM |
| **u** (gras) | Vecteur (convention articles ML) | **u** = [0.3, 0.7, ...] |
| u_i | La i-eme composante du vecteur **u** | u_1 = 0.3 |

---

## Partie B — Produit scalaire et norme euclidienne

### Theorie formelle

**Produit scalaire** dans R^n :
$$\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^{n} u_i v_i = u_1 v_1 + u_2 v_2 + \ldots + u_n v_n$$

**Norme euclidienne** (longueur du vecteur) :
$$\|\mathbf{u}\| = \sqrt{\sum_{i=1}^{n} u_i^2} = \sqrt{u_1^2 + u_2^2 + \ldots + u_n^2}$$

### Explication simple

Le produit scalaire mesure "a quel point deux vecteurs pointent dans la meme direction". La norme est simplement la "longueur" du vecteur — l'extension du theoreme de Pythagore a n dimensions.

### Exemple numerique

Avec **u** = [3, 4] et **v** = [1, 2] :
- **u** . **v** = 3*1 + 4*2 = 3 + 8 = **11**
- ||**u**|| = sqrt(9 + 16) = sqrt(25) = **5**
- ||**v**|| = sqrt(1 + 4) = sqrt(5) = **2.236**

### Glossaire des symboles

| Symbole | Nom | Definition |
|---------|-----|-----------|
| . ou . | Produit scalaire | Somme des produits composante par composante |
| \|\| . \|\| | Norme euclidienne | Racine de la somme des carres |
| sum_{i=1}^{n} | Sommation | Additionner de i=1 a n |
| sqrt(.) | Racine carree | |

---

## Partie C — Similarite cosinus (Formule 1.1)

### Theorie formelle

$$\text{cos}(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \cdot \|\mathbf{v}\|} = \frac{\sum_{i=1}^{n} u_i v_i}{\sqrt{\sum_{i=1}^{n} u_i^2} \cdot \sqrt{\sum_{i=1}^{n} v_i^2}}$$

**Proprietes** :
- cos(u, v) dans [-1, 1]
- cos(u, v) = 1 : vecteurs identiques en direction (meme sens semantique)
- cos(u, v) = 0 : vecteurs orthogonaux (aucun rapport semantique)
- cos(u, v) = -1 : vecteurs opposes (sens opposes)

### Explication simple

La similarite cosinus mesure l'angle entre deux vecteurs, SANS tenir compte de leur longueur. C'est crucial : une phrase longue et une phrase courte sur le meme sujet auront la meme similarite cosinus, car seule la DIRECTION compte.

### Pourquoi c'est different de la distance euclidienne ?

La distance euclidienne d(u,v) = ||u - v|| depend de la longueur des vecteurs. Deux phrases identiques en sens mais de longueurs differentes auront une grande distance euclidienne mais une similarite cosinus de 1. En NLP, la direction encode le sens, la longueur encode d'autres facteurs (position dans l'entrainement, etc.) — d'ou la preference pour le cosinus.

### Exemple numerique complet

**Contexte** : Detection de derive semantique apres injection

Phrase saine : "Administrer 500mg de paracetamol" -> **u** = [0.8, 0.6, 0.0]
Phrase corrompue : "Administrer 5000mg de paracetamol" -> **v** = [0.7, 0.7, 0.1]

1. Produit scalaire : 0.8*0.7 + 0.6*0.7 + 0.0*0.1 = 0.56 + 0.42 + 0.0 = **0.98**
2. ||**u**|| = sqrt(0.64 + 0.36 + 0.0) = sqrt(1.0) = **1.0**
3. ||**v**|| = sqrt(0.49 + 0.49 + 0.01) = sqrt(0.99) = **0.995**
4. cos(**u**, **v**) = 0.98 / (1.0 * 0.995) = **0.985**

Interpretation : similarite de 0.985 — les phrases sont tres proches semantiquement malgre une difference de dosage potentiellement mortelle. Cela illustre une LIMITATION de la similarite cosinus pour la securite medicale : un changement de chiffre (500 vs 5000) peut etre invisible dans l'espace des embeddings.

### Ou c'est utilise

- **P012** : Steck analyse les limites de la similarite cosinus dans les modeles de factorisation
- **P014** : SemScore = cosine similarity appliquee aux embeddings de phrases
- **P024** : Sep(M) utilise des mesures de dissimilarite entre distributions de reponses
- **AEGIS** : Couche δ² — mesure de derive semantique via all-MiniLM-L6-v2

---

## Partie D — Matrices et operations matricielles

### Theorie formelle

Une **matrice** A de taille m x n est un tableau de nombres :

$$A = \begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & & & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix}$$

**Produit matriciel** : si A est m x k et B est k x n, alors C = AB est m x n avec :
$$c_{ij} = \sum_{l=1}^{k} a_{il} b_{lj}$$

**Matrice diagonale** D = diag(d₁, d₂, ..., d_n) : tous les elements hors diagonale sont nuls.

**Transposee** : B^T a pour element (i,j) l'element (j,i) de B.

**Norme de Frobenius** :
$$\|A\|_F = \sqrt{\sum_{i,j} a_{ij}^2}$$

### Explication simple

Une matrice est juste un tableau de nombres. Le produit matriciel combine les lignes de A avec les colonnes de B. La matrice diagonale multiplie chaque composante d'un vecteur par un facteur different — comme changer d'unite de mesure pour chaque dimension.

---

## Partie E — Transformation de jauge (Formule 2.2)

### Theorie formelle (Steck et al., 2024 — P012)

Soit un modele de factorisation matricielle avec embeddings A et B :

$$\hat{A}(D) := \hat{A}D \qquad \hat{B}(D) := \hat{B}D^{-1}$$

Pour toute matrice diagonale inversible D, les predictions sont preservees :
$$\hat{A}\hat{B}^\top = \hat{A}(D)\hat{B}(D)^\top$$

Mais la similarite cosinus CHANGE :
$$\text{cosSim}(\hat{B}, \hat{B}) = \Omega_B(D) \cdot \hat{B} \cdot D^{-2} \cdot \hat{B}^\top \cdot \Omega_B(D)$$

### Explication simple

Steck montre un resultat troublant : dans les modeles de factorisation matricielle, on peut appliquer une transformation "invisible" (la matrice D) qui ne change absolument pas les predictions du modele mais qui change COMPLETEMENT les similarites cosinus entre les embeddings. C'est comme si deux balances mesuraient le meme poids mais en unites differentes — le poids reel est identique, mais les chiffres affiches sont radicalement differents.

### Exemple numerique

Embeddings originaux : **A** = [1, 2], **B** = [2, 1]

- cos(**A**, **B**) = (1*2 + 2*1) / (sqrt(5) * sqrt(5)) = 4/5 = **0.80**

Transformation D = diag(10, 0.1) :
- **A'** = [1*10, 2*0.1] = [10, 0.2]
- **B'** = [2*0.1, 1*10] = [0.2, 10]

- cos(**A'**, **B'**) = (10*0.2 + 0.2*10) / (sqrt(100.04) * sqrt(100.04)) = 4/100.04 = **0.04**

**Memes predictions, meme modele, mais similarite passee de 0.80 a 0.04 !**

### Impact pour la these

Ce resultat signifie que les scores de similarite cosinus issus de certains modeles d'embedding ne sont pas fiables intrinsequement. AEGIS doit en tenir compte en utilisant des modeles avec regularisation individuelle (Objectif 2 de Steck) plutot que regularisation produit (Objectif 1).

### Ou c'est utilise

- **P012** : Demonstration originale de l'ambiguite de la similarite cosinus

---

## Partie F — Factorisation matricielle (Formule 6.3)

### Theorie formelle

**Objectif 1** (regularisation produit) :
$$\min_{A,B} \|X - XAB^\top\|_F^2 + \lambda\|AB^\top\|_F^2$$

**Objectif 2** (regularisation individuelle) :
$$\min_{A,B} \|X - XAB^\top\|_F^2 + \lambda(\|XA\|_F^2 + \|B\|_F^2)$$

Solution fermee (Objectif 2) :
$$\hat{A}^{(2)} = V_k \cdot \text{diag}\left(\sqrt{\frac{1}{\sigma_i}\left(1 - \frac{\lambda}{\sigma_i}\right)_+}\right)$$

### Explication simple

La factorisation matricielle decompose une grande matrice de donnees X en un produit de deux matrices plus petites A et B. C'est comme decomposer un grand tableau en deux petits tableaux dont le produit reconstitue le grand. Le parametre lambda empeche le sur-apprentissage (regularisation).

Le point crucial de Steck : l'Objectif 1 produit des similarites cosinus non-uniques (soumises a la transformation de jauge), tandis que l'Objectif 2 produit des similarites uniques et donc fiables.

### Exemple numerique

Valeurs singulieres : sigma = [3.0, 2.0, 1.0], lambda = 0.5

Pour l'Objectif 2, chaque composante :
- Composante 1 : sqrt(1/3 * max(1 - 0.5/3, 0)) = sqrt(0.333 * 0.833) = sqrt(0.278) = **0.527**
- Composante 2 : sqrt(1/2 * max(1 - 0.5/2, 0)) = sqrt(0.5 * 0.75) = sqrt(0.375) = **0.612**
- Composante 3 : sqrt(1/1 * max(1 - 0.5/1, 0)) = sqrt(1.0 * 0.5) = sqrt(0.5) = **0.707**

La regularisation reduit davantage les composantes de grande valeur singuliere.

### Ou c'est utilise

- **P012** : Framework complet de factorisation et critique de la similarite cosinus

---

## Exercices progressifs

### Exercice 1 (Facile) — Similarite cosinus en 2D

Calculez cos(**u**, **v**) pour :
- **u** = [3, 4]
- **v** = [4, 3]

**Solution** :
1. **u** . **v** = 3*4 + 4*3 = 12 + 12 = 24
2. ||**u**|| = sqrt(9 + 16) = sqrt(25) = 5
3. ||**v**|| = sqrt(16 + 9) = sqrt(25) = 5
4. cos(**u**, **v**) = 24 / (5 * 5) = 24/25 = **0.96**

Interpretation : les vecteurs sont tres similaires en direction (angle faible).

---

### Exercice 2 (Moyen) — Comparaison de trois embeddings

Trois phrases encodees en 4 dimensions :
- "Dose de paracetamol" : **a** = [0.9, 0.3, 0.1, 0.0]
- "Posologie du doliprane" : **b** = [0.85, 0.35, 0.15, 0.05]
- "Recette de gateau" : **c** = [0.1, 0.0, 0.8, 0.7]

Calculez cos(a,b), cos(a,c), et cos(b,c). Quel est le resultat attendu ?

**Solution** :

cos(**a**, **b**) :
1. **a** . **b** = 0.9*0.85 + 0.3*0.35 + 0.1*0.15 + 0.0*0.05 = 0.765 + 0.105 + 0.015 + 0.0 = 0.885
2. ||**a**|| = sqrt(0.81 + 0.09 + 0.01 + 0.0) = sqrt(0.91) = 0.954
3. ||**b**|| = sqrt(0.7225 + 0.1225 + 0.0225 + 0.0025) = sqrt(0.87) = 0.933
4. cos(**a**, **b**) = 0.885 / (0.954 * 0.933) = 0.885 / 0.890 = **0.994** (tres similaires — logique, meme sujet medical)

cos(**a**, **c**) :
1. **a** . **c** = 0.9*0.1 + 0.3*0.0 + 0.1*0.8 + 0.0*0.7 = 0.09 + 0.0 + 0.08 + 0.0 = 0.17
2. ||**c**|| = sqrt(0.01 + 0.0 + 0.64 + 0.49) = sqrt(1.14) = 1.068
3. cos(**a**, **c**) = 0.17 / (0.954 * 1.068) = 0.17 / 1.019 = **0.167** (tres differents — logique, sujets sans rapport)

cos(**b**, **c**) :
1. **b** . **c** = 0.85*0.1 + 0.35*0.0 + 0.15*0.8 + 0.05*0.7 = 0.085 + 0.0 + 0.12 + 0.035 = 0.24
2. cos(**b**, **c**) = 0.24 / (0.933 * 1.068) = 0.24 / 0.996 = **0.241** (differents)

Resultat attendu confirme : les phrases medicales sont proches entre elles et eloignees de la phrase culinaire.

---

### Exercice 3 (Moyen) — Transformation de jauge

Soit **u** = [2, 3] et **v** = [3, 2].

a) Calculez cos(**u**, **v**)
b) Appliquez D = diag(5, 0.2). Calculez cos(**u'**, **v'**) avec **u'** = **u**D et **v'** = **v**D^-1
c) Verifiez que le produit scalaire **u** . **v** = **u'** . **v'**

**Solution** :

a) cos(**u**, **v**) = (2*3 + 3*2) / (sqrt(4+9) * sqrt(9+4)) = 12 / (sqrt(13) * sqrt(13)) = 12/13 = **0.923**

b) **u'** = [2*5, 3*0.2] = [10, 0.6], **v'** = [3*0.2, 2*5] = [0.6, 10]
   cos(**u'**, **v'**) = (10*0.6 + 0.6*10) / (sqrt(100+0.36) * sqrt(0.36+100))
   = (6+6) / (sqrt(100.36) * sqrt(100.36))
   = 12 / 100.36 = **0.120**

   La similarite est passee de 0.923 a 0.120 !

c) **u** . **v** = 2*3 + 3*2 = 12
   **u'** . **v'** = 10*0.6 + 0.6*10 = 12 (verifie !)

   Les predictions sont identiques mais les similarites cosinus sont radicalement differentes.

---

### Exercice 4 (Difficile) — Norme de Frobenius et regularisation

Soit la matrice A = [[1, 2], [3, 4]].

a) Calculez ||A||_F (norme de Frobenius)
b) Si lambda = 0.5, calculez le terme de regularisation lambda * ||A||_F^2
c) Expliquez pourquoi la regularisation empeche les valeurs extremes dans les embeddings.

**Solution** :

a) ||A||_F = sqrt(1^2 + 2^2 + 3^2 + 4^2) = sqrt(1 + 4 + 9 + 16) = sqrt(30) = **5.477**

b) lambda * ||A||_F^2 = 0.5 * 30 = **15.0**

c) La regularisation ajoute un cout proportionnel au carre des valeurs de la matrice. Si un element de A devient tres grand (par exemple 100), le cout de regularisation explose (100^2 = 10000). Cela force l'optimisation a garder les valeurs moderees, evitant le sur-apprentissage ou les embeddings degeneres. Pour la detection d'injection, des embeddings aux valeurs moderees produisent des similarites cosinus plus stables et interpretables.

---

### Exercice 5 (Difficile) — Application AEGIS

Le systeme AEGIS mesure la derive semantique d'un LLM medical. Voici 3 paires (reponse saine, reponse apres injection) encodees en 3D :

| Paire | Reponse saine | Reponse corrompue | Type d'attaque |
|-------|--------------|-------------------|----------------|
| 1 | [0.9, 0.8, 0.1] | [0.85, 0.75, 0.15] | Attaque subtile |
| 2 | [0.9, 0.8, 0.1] | [0.2, 0.3, 0.9] | Attaque franche |
| 3 | [0.9, 0.8, 0.1] | [0.88, 0.78, 0.12] | Bruit normal |

a) Calculez la similarite cosinus pour chaque paire.
b) Si le seuil de detection est cos < 0.95, quelles paires sont flaggees ?
c) Discutez les limites de cette approche.

**Solution** :

Norme de la reponse saine : ||s|| = sqrt(0.81 + 0.64 + 0.01) = sqrt(1.46) = 1.208

**Paire 1** (attaque subtile) :
- s . c = 0.9*0.85 + 0.8*0.75 + 0.1*0.15 = 0.765 + 0.60 + 0.015 = 1.38
- ||c|| = sqrt(0.7225 + 0.5625 + 0.0225) = sqrt(1.3075) = 1.143
- cos = 1.38 / (1.208 * 1.143) = 1.38 / 1.381 = **0.999** -> NON detectee

**Paire 2** (attaque franche) :
- s . c = 0.9*0.2 + 0.8*0.3 + 0.1*0.9 = 0.18 + 0.24 + 0.09 = 0.51
- ||c|| = sqrt(0.04 + 0.09 + 0.81) = sqrt(0.94) = 0.970
- cos = 0.51 / (1.208 * 0.970) = 0.51 / 1.172 = **0.435** -> DETECTEE

**Paire 3** (bruit normal) :
- s . c = 0.9*0.88 + 0.8*0.78 + 0.1*0.12 = 0.792 + 0.624 + 0.012 = 1.428
- ||c|| = sqrt(0.7744 + 0.6084 + 0.0144) = sqrt(1.3972) = 1.182
- cos = 1.428 / (1.208 * 1.182) = 1.428 / 1.428 = **1.000** -> NON detectee (correct, c'est du bruit)

b) Seule la paire 2 est flaggee (cos = 0.435 < 0.95).

c) **Limites** : L'attaque subtile (paire 1) echappe a la detection car la modification dans l'espace des embeddings est minime malgre un impact potentiellement dangereux (ex: changement de dosage). La similarite cosinus est aveugle aux modifications semantiques fines qui ne changent pas la "direction globale" du vecteur. C'est pourquoi AEGIS ne se fie pas uniquement a la similarite cosinus (δ²) et utilise aussi des detecteurs pre-inference (δ¹) et le monitoring continu (δ³).

---

## Resume du module

| Concept | Formule cle | Application AEGIS |
|---------|------------|-------------------|
| Similarite cosinus | cos(u,v) = u.v / (||u|| * ||v||) | Mesure de derive semantique (δ²) |
| Transformation de jauge | A(D) = AD, B(D) = BD^-1 | Caveat sur la fiabilite des embeddings |
| Factorisation matricielle | min ||X - XAB^T||_F^2 + lambda*reg | Choix du type de regularisation |

**Message cle** : La similarite cosinus est l'outil de base pour comparer des embeddings textuels, mais elle a des limites (sensibilite a la jauge, aveuglement aux modifications fines). Les modules suivants construiront sur cette base pour des metriques plus robustes.

---

*Module 1 termine — Passez au Module 2 (Probabilites & Statistiques)*
