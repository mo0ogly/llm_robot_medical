# GUIDE DE NOTATION MATHEMATIQUE
## Comment lire les notations avancees des articles de recherche en injection de prompts

**Public** : Lecteur de niveau bac+2 decouvrant les articles de ML/NLP
**Usage** : Reference permanente pendant la lecture des articles de la bibliographie AEGIS

---

## 1. Conventions generales

### Le logarithme

Dans les articles de machine learning, **log** signifie presque toujours le **logarithme naturel** (ln, base e = 2.718...). Si un article utilise log base 2, il l'ecrit explicitement log_2.

Rappel : log(e) = 1, log(1) = 0, log(ab) = log(a) + log(b), log(a/b) = log(a) - log(b)

### Gras vs italique

- **Gras** (**u**, **v**, **W**) : vecteurs et matrices
- *Italique* (*x*, *y*, *n*) : scalaires (nombres simples)
- Cette convention n'est pas toujours respectee dans les articles, mais c'est la norme

### Indices et exposants

| Notation | Signification |
|----------|--------------|
| x_i | i-eme element du vecteur x |
| x^{(t)} | Valeur de x a l'iteration t |
| W^Q, W^K, W^V | Matrices de projection pour Query, Key, Value |
| alpha_i^{(l,h)} | Poids d'attention du token i, couche l, tete h |

---

## 2. Notation des esperances et distributions

### E[.] — Esperance

L'esperance peut etre ecrite de plusieurs facons dans les articles :

| Notation | Signification | Exemple |
|----------|--------------|---------|
| E[X] | Esperance de X | Moyenne de X sur sa distribution |
| E_x[f(x)] | Esperance de f(x) quand x suit sa distribution | Moyenne de f(x) |
| E_{x ~ p}[f(x)] | Esperance quand x est tire de la distribution p | Notation explicite |
| E_{(s,d,x) ~ p} | Esperance sur des triplets | Utilisee dans Sep(M) |

**Lecture** : "E esperance de ... quand ... suit la loi ..."

Exemple de Sep(M) : E_{(s,d,x) ~ p} [D(g(s, x+d), g(s+x, d))]
Se lit : "L'esperance de la dissimilarite D entre les deux configurations, quand les triplets (systeme, donnees, probe) sont tires de la distribution p."

### P(.) — Probabilite

| Notation | Signification |
|----------|--------------|
| P(A) | Probabilite de l'evenement A |
| P(X = x) | Probabilite que X prenne la valeur x |
| P(y\|x) | Probabilite conditionnelle de y sachant x |
| Pr_{s ~ p}{A} | Probabilite de A quand s suit p |

---

## 3. Notation min/max et optimisation

### Problemes d'optimisation

Les articles formulent les objectifs d'entrainement comme des problemes d'optimisation :

```
min_theta L(theta)     = trouver theta qui minimise L
max_theta J(theta)     = trouver theta qui maximise J
argmin_theta L(theta)  = la valeur de theta qui minimise L
```

### Notation RLHF typique

$$\max_{\pi_\theta} \mathbb{E}_{x \sim D, y \sim \pi_\theta(\cdot|x)} \left[ r(x,y) - \beta \cdot D_{KL}(\pi_\theta(\cdot|x) \| \pi_{\text{ref}}(\cdot|x)) \right]$$

**Decomposition** :
1. max_{pi_theta} : trouver la politique (modele) pi parametree par theta qui maximise...
2. E_{x ~ D, y ~ pi_theta(.|x)} : l'esperance quand x est tire du dataset D et y est genere par le modele...
3. r(x,y) : la recompense de la reponse y au prompt x...
4. - beta * D_KL(...) : moins beta fois la divergence KL entre le modele courant et le modele de reference

---

## 4. Notation des ensembles et indicatrices

### Ensembles

| Notation | Signification |
|----------|--------------|
| {x : condition} | Ensemble des x satisfaisant la condition |
| {(l,h) : score > 0} | Ensemble des paires (l,h) avec score positif |
| A* | Toutes les sequences finies sur l'alphabet A |
| M(A*) | Ensemble des mesures de probabilite sur A* |

### Indicatrices

La notation 1_{condition} est un "interrupteur" :
$$\mathbb{1}_{\{w \in y\}} = \begin{cases} 1 & \text{si } w \text{ apparait dans } y \\ 0 & \text{sinon} \end{cases}$$

Quand on voit une somme d'indicatrices, c'est simplement un COMPTAGE :
$$\sum_{i=1}^{n} \mathbb{1}_{\{w_i \in y_i^I\}} = \text{nombre de tests ou le temoin apparait en mode instruction}$$

---

## 5. Notation conditionnelle dans les LLM

### Autoregression

Les LLM generent du texte token par token. La notation conditionnelle exprime cette dependance :

| Notation | Signification |
|----------|--------------|
| pi(y_t \| x, y_{<t}) | Probabilite du token t sachant le prompt x et tous les tokens precedents |
| y_{<t} = (y_1, ..., y_{t-1}) | Tous les tokens generes avant la position t |
| y_{<=k} = (y_1, ..., y_k) | Les k premiers tokens (pour le prefilling) |

### Lecture d'une formule autoregressives

$$-\sum_t \log \pi_\theta(y_t | x, y_{<t})$$

Se lit : "Moins la somme, pour chaque position t, du log de la probabilite que le modele theta assigne au token y_t sachant le prompt x et les tokens precedents."

C'est simplement la cross-entropy appliquee a chaque position de la sequence.

---

## 6. Notation des normes

| Notation | Nom | Definition | Quand l'utiliser |
|----------|-----|-----------|-----------------|
| \|\|u\|\| ou \|\|u\|\|_2 | Norme L2 (euclidienne) | sqrt(sum(u_i^2)) | Longueur d'un vecteur |
| \|\|u\|\|_1 | Norme L1 (Manhattan) | sum(\|u_i\|) | Regularisation sparse |
| \|\|A\|\|_F | Norme de Frobenius | sqrt(sum(a_{ij}^2)) | "Taille" d'une matrice |
| \|\|u - v\|\| | Distance euclidienne | sqrt(sum((u_i - v_i)^2)) | Distance entre vecteurs |

**Attention** : les doubles barres \|\|...\|\| designent une norme, les simples barres \|...\| designent la valeur absolue (scalaire) ou le cardinal (ensemble).

---

## 7. Notations specifiques aux articles de la bibliographie

### Notation de Zverev et al. (P024) — Sep(M)

- g : A* x A* -> M(A*) : le modele g prend deux chaines (prompt systeme et donnees) et produit une distribution sur les reponses possibles
- sep_p(g) : score de separation du modele g sous la distribution p
- sep_hat(g) : version empirique (estimee a partir d'echantillons)
- w_i : temoin surprise pour le test i
- y_i^I : sortie du modele quand le probe est en mode instruction
- y_i^D : sortie du modele quand le probe est en mode donnee

### Notation de Young (P019) — Harm Gradient

- Harm(y) : nocivite totale de la reponse y
- h_t(y_{<=t}) : estimation de la nocivite apres avoir vu les t premiers tokens
- Delta_t : increment de nocivite au token t (= h_t - h_{t-1})
- I_t : information de nocivite a la position t (= E[Delta_t^2])
- G_t(theta) : gradient de l'esperance de la nocivite au token t
- F_bar : borne superieure de l'information de Fisher

### Notation de P018 — Shallow Alignment

- D_KL^{(k)} : divergence KL a la position k entre modele aligne et modele de base
- beta_t : contrainte de regularisation specifique a la position t
- S(.) : softplus = log(1 + exp(.))
- sigma(.) : sigmoide = 1/(1+exp(-(.)))

### Notation de P012 — Gauge Matrix (Steck)

- D : matrice diagonale inversible (matrice de jauge)
- A_hat(D) : embedding A transforme par D
- B_hat(D) : embedding B transforme par D^{-1}
- Omega_B(D) : matrice de normalisation diagonale
- Objectif 1 vs Objectif 2 : deux types de regularisation

---

## 8. Pieges courants pour le lecteur bac+2

### Piege 1 : log vs ln

Dans TOUS les articles de cette bibliographie, log = ln (logarithme naturel). Ne confondez pas avec log base 10.

### Piege 2 : D_KL n'est pas symetrique

D_KL(P || Q) != D_KL(Q || P). Ce n'est PAS une distance au sens mathematique. Les articles ecrivent parfois "distance KL" par abus de langage.

### Piege 3 : Vecteur vs matrice

Quand un article ecrit "l'embedding x in R^768", c'est un VECTEUR de 768 composantes, pas une matrice. Mais quand il ecrit "la matrice d'embeddings X in R^{n x d}", c'est un tableau ou chaque LIGNE est un embedding.

### Piege 4 : La notation pi

pi_theta N'EST PAS le nombre pi = 3.14159. C'est la "politique" (le modele) parametree par theta. Le contexte rend toujours clair de quoi il s'agit : si on parle d'optimisation et de modeles, c'est la politique ; si on parle de geometrie, c'est le nombre.

### Piege 5 : Somme sur t vs somme sur i

- sum_t : somme sur les positions de tokens (dans la sequence de reponse)
- sum_i : somme sur les exemples (dans le dataset)
- sum_{(l,h)} : somme sur les paires (couche, tete) d'attention

Le contexte determine toujours l'indice de sommation.

### Piege 6 : (.)_+ notation

(x)_+ = max(0, x). C'est la "partie positive". Utilise dans la factorisation matricielle (formule 6.3) pour que les composantes restent non-negatives.

### Piege 7 : Barre verticale |

La barre | a plusieurs significations :
- P(y|x) : probabilite conditionnelle (y sachant x)
- |A| : cardinal de l'ensemble A
- |x| : valeur absolue de x

Le contexte determine le sens.

---

## 9. Comment lire une formule complexe

### Methode en 4 etapes

1. **Identifier les entrees** : quelles variables sont donnees ? (x = prompt, y = reponse, theta = parametres)
2. **Identifier la sortie** : que calcule la formule ? (un scalaire ? un vecteur ? une distribution ?)
3. **Decomposer de l'interieur vers l'exterieur** : commencer par les operations les plus internes
4. **Traduire en francais** : formuler en mots ce que fait chaque etape

### Exemple : Decomposition de Sep(M)

$$\text{sep}_p(g) = \mathbb{E}_{(s,d,x) \sim p}\; \mathcal{D}\big(g(s,\; x+d),\;\; g(s+x,\; d)\big)$$

1. **Entrees** : modele g, distribution p sur (systeme, donnees, probe)
2. **Sortie** : un scalaire (le score de separation)
3. **Decomposition** :
   - g(s, x+d) : reponse du modele quand le probe x est DANS les donnees d
   - g(s+x, d) : reponse du modele quand le probe x est DANS les instructions s
   - D(., .) : mesure de dissimilarite entre ces deux distributions de reponse
   - E_{(s,d,x) ~ p} : moyenne de D sur tous les triplets possibles
4. **En francais** : "Le score de separation est la dissimilarite moyenne entre les reponses du modele selon que le probe est place dans les instructions ou dans les donnees."

---

*Guide genere le 2026-04-04*
*Couvre les conventions de notation de 34 articles*
