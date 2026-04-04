# Module 3 — Theorie de l'Information et Entropie

**Temps estime** : 7-9 heures
**Prerequis** : Module 2 (probabilites, esperance, variance) + logarithmes
**Formules couvertes** : 1.3 Cross-Entropy, 1.4 Cross-Entropy Ponderee, Divergence KL, Entropie

---

## Motivation : Pourquoi la theorie de l'information ?

La theorie de l'information repond a une question fondamentale : **combien d'information contient un message ?** Pour les LLM, cela se traduit par :
- **Cross-entropy** : la fonction de perte standard pour entrainer les modeles (combien le modele se trompe)
- **Divergence KL** : mesure de la distance entre deux distributions (combien l'alignement change le modele)
- **Entropie** : mesure de l'incertitude du modele (est-il confiant ou hesitant ?)

Sans ces concepts, il est impossible de comprendre l'entrainement des LLM (Module 5) ni les metriques de separation (Module 4).

**Articles concernes** : P018 (cross-entropy + KL), P025 (weighted CE), P013 (contrastive), P019 (harm gradient + KL)

---

## Prerequis : Ce qu'il faut savoir avant

Vous devriez maitriser :
- Les logarithmes : log(ab) = log(a) + log(b), log(1) = 0, log(0) -> -inf
- Convention : dans les articles ML, "log" = logarithme naturel (ln, base e) sauf indication contraire
- Les distributions de probabilite (Module 2)

---

## Partie A — Le logarithme comme mesure de surprise

### Theorie formelle

La **surprise** (ou self-information) d'un evenement de probabilite p :

$$I(p) = -\log(p)$$

**Proprietes** :
- Un evenement certain (p = 1) : I(1) = -log(1) = 0 (aucune surprise)
- Un evenement improbable (p = 0.01) : I(0.01) = -log(0.01) = 4.6 (grande surprise)
- Un evenement impossible (p -> 0) : I -> +inf (surprise infinie)

### Explication simple

Plus un evenement est rare, plus il est "surprenant" quand il arrive. Un LLM qui predit le bon token avec 99% de confiance n'est pas surpris quand il a raison (-log(0.99) = 0.01). Un LLM qui predit le bon token avec 1% de confiance est TRES surpris quand il a raison (-log(0.01) = 4.6).

### Exemple numerique

| Evenement | Probabilite | Surprise -log(p) |
|-----------|------------|-------------------|
| LLM predit correctement "paracetamol" | 0.95 | 0.051 |
| LLM predit correctement "ibuprofene" | 0.60 | 0.511 |
| LLM predit correctement "thalidomide" | 0.05 | 2.996 |
| LLM predit correctement "uranium" | 0.001 | 6.908 |

---

## Partie B — Entropie

### Theorie formelle

L'**entropie** de Shannon d'une distribution P :

$$H(P) = -\sum_{x} P(x) \log P(x) = \mathbb{E}_{x \sim P}[-\log P(x)]$$

C'est la surprise MOYENNE — la quantite d'information moyenne contenue dans un echantillon de P.

**Proprietes** :
- H(P) >= 0
- H(P) = 0 ssi P est deterministe (un seul token de probabilite 1)
- H(P) maximale quand P est uniforme (chaque token equiprobable)

### Explication simple

L'entropie mesure "a quel point le modele est indecis". Si le LLM est tres confiant (un token a 99%), l'entropie est faible. S'il hesite entre plusieurs tokens, l'entropie est elevee. Un modele injecte pourrait montrer une entropie anormale (trop confiant sur un token dangereux, ou trop hesitant).

### Exemple numerique

Distribution A (modele confiant) : P = [0.90, 0.05, 0.03, 0.02]
H(A) = -(0.90*log(0.90) + 0.05*log(0.05) + 0.03*log(0.03) + 0.02*log(0.02))
     = -(0.90*(-0.105) + 0.05*(-2.996) + 0.03*(-3.507) + 0.02*(-3.912))
     = -(−0.0945 − 0.1498 − 0.1052 − 0.0782)
     = **0.428**

Distribution B (modele hesitant) : P = [0.30, 0.25, 0.25, 0.20]
H(B) = -(0.30*log(0.30) + 0.25*log(0.25) + 0.25*log(0.25) + 0.20*log(0.20))
     = -(0.30*(-1.204) + 0.25*(-1.386) + 0.25*(-1.386) + 0.20*(-1.609))
     = -(−0.361 − 0.347 − 0.347 − 0.322)
     = **1.376**

Le modele hesitant a une entropie 3x plus elevee que le modele confiant.

---

## Partie C — Cross-Entropy (Formule 1.3)

### Theorie formelle

L'**entropie croisee** entre une distribution reelle Q et une distribution predite P :

$$H(Q, P) = -\sum_{x} Q(x) \log P(x) = \mathbb{E}_{x \sim Q}[-\log P(x)]$$

Quand Q est un one-hot vector (classification) : Q(c) = 1 pour la bonne classe c, Q(i) = 0 sinon :

$$\mathcal{L}_{CE} = -\sum_{c=1}^{C} y_c \cdot \log(\hat{y}_c) = -\log(\hat{y}_{\text{vraie classe}})$$

**Classification binaire** :
$$\mathcal{L}_{BCE} = -[y \cdot \log(\hat{y}) + (1-y) \cdot \log(1-\hat{y})]$$

### Relation avec l'entropie

$$H(Q, P) = H(Q) + D_{KL}(Q \| P)$$

L'entropie croisee = entropie + divergence KL. Minimiser la cross-entropy revient a minimiser la divergence KL (car H(Q) est constant).

### Explication simple

La cross-entropy mesure la "surprise moyenne" du modele quand il voit les vrais labels. Si le modele assigne une haute probabilite a la bonne reponse, la cross-entropy est faible. Si le modele est surpris par la bonne reponse, la cross-entropy est elevee. C'est la "note" que le modele tente de minimiser pendant l'entrainement.

### Exemple numerique

**Contexte** : Detecteur binaire d'injection (injection = 1, normal = 0)

Requete d'injection (y = 1), le modele predit P(injection) = 0.85 :
$$\mathcal{L} = -[1 \cdot \log(0.85) + 0 \cdot \log(0.15)] = -\log(0.85) = 0.163$$

Si le modele avait predit P(injection) = 0.30 :
$$\mathcal{L} = -\log(0.30) = 1.204$$

Si le modele avait predit P(injection) = 0.99 :
$$\mathcal{L} = -\log(0.99) = 0.010$$

| Prediction | Perte | Interpretation |
|-----------|-------|----------------|
| 0.99 | 0.010 | Excellent, tres confiant et correct |
| 0.85 | 0.163 | Bon, assez confiant |
| 0.50 | 0.693 | Incertain, moitie-moitie |
| 0.30 | 1.204 | Mauvais, confiant dans la mauvaise direction |
| 0.01 | 4.605 | Catastrophique, tres confiant et faux |

### Ou c'est utilise

- **P018** : Perte d'entrainement standard des LLM (formule 5.4)
- **P025** : DMPI-PMHFE utilise la cross-entropy pour entrainer le detecteur bi-canal
- **P034** : Fine-tuning standard des modeles

---

## Partie D — Cross-Entropy Ponderee (Formule 1.4)

### Theorie formelle

$$\mathcal{L}_{WCE} = -\sum_{c=1}^{C} w_c \cdot y_c \cdot \log(\hat{y}_c)$$

avec les poids :
$$w_c = \frac{N}{k \cdot n_c}$$

ou N = nombre total d'echantillons, k = nombre de classes, n_c = nombre d'echantillons dans la classe c.

### Explication simple

Quand les classes sont desequilibrees (95% normales, 5% injections), un modele naif apprend juste a dire "normal" tout le temps et obtient 95% de precision. La ponderation donne plus d'importance aux classes rares : les erreurs sur les injections (rares mais critiques) pesent beaucoup plus que les erreurs sur les requetes normales (frequentes mais benignes).

### Exemple numerique

Dataset de 1000 requetes : 950 normales, 50 injections (k = 2 classes)

- w_normal = 1000 / (2 * 950) = **0.526**
- w_injection = 1000 / (2 * 50) = **10.0**

Les erreurs sur les injections pesent 10.0 / 0.526 = **19 fois plus** que les erreurs sur les requetes normales.

Pour une injection mal classee (P(injection) = 0.20) :
- Sans ponderation : L = -log(0.20) = 1.609
- Avec ponderation : L = -10.0 * log(0.20) = **16.09**

La penalite est 10x plus elevee — le modele est fortement incite a detecter les injections.

### Ou c'est utilise

- **P013** : Discriminateur de synonymes/antonymes avec 3 classes desequilibrees
- **P025** : Detection d'injection avec desequilibre severe

---

## Partie E — Divergence de Kullback-Leibler (KL)

### Theorie formelle

La **divergence KL** de la distribution Q par rapport a P :

$$D_{KL}(P \| Q) = \sum_{x} P(x) \log\frac{P(x)}{Q(x)} = \mathbb{E}_{x \sim P}\left[\log\frac{P(x)}{Q(x)}\right]$$

**Proprietes fondamentales** :
- D_KL(P || Q) >= 0 (toujours positive ou nulle)
- D_KL(P || Q) = 0 ssi P = Q (les distributions sont identiques)
- D_KL(P || Q) != D_KL(Q || P) (non symetrique !)
- Ce n'est PAS une distance au sens mathematique (pas de symetrie, pas d'inegalite triangulaire)

### Explication simple

La divergence KL mesure "combien d'information on perd" en utilisant Q pour approximer P. Si P est le "vrai" comportement du modele et Q est son comportement apres alignement, D_KL(P || Q) mesure combien l'alignement a change le modele.

### Pourquoi c'est central pour l'alignement

L'objectif RLHF (formule 4.1) est :
$$\max_{\pi_\theta} \mathbb{E}\left[r(x,y) - \beta \cdot D_{KL}(\pi_\theta \| \pi_{\text{ref}})\right]$$

Le terme beta * D_KL est "l'elastique" qui empeche le modele aligne de trop s'eloigner du modele de base. Sans cette contrainte, le modele pourrait apprendre a toujours repondre "Desole" (recompense maximale mais inutile).

### Exemple numerique

Distribution du modele de base (P) pour le token suivant apres "Prendre" :
- P("500mg") = 0.30, P("1000mg") = 0.25, P("tout") = 0.20, P("du") = 0.25

Distribution du modele aligne (Q) :
- Q("500mg") = 0.50, Q("1000mg") = 0.10, Q("tout") = 0.05, Q("du") = 0.35

D_KL(P || Q) = 0.30*log(0.30/0.50) + 0.25*log(0.25/0.10) + 0.20*log(0.20/0.05) + 0.25*log(0.25/0.35)

= 0.30*log(0.60) + 0.25*log(2.50) + 0.20*log(4.00) + 0.25*log(0.714)

= 0.30*(-0.511) + 0.25*(0.916) + 0.20*(1.386) + 0.25*(-0.336)

= -0.153 + 0.229 + 0.277 - 0.084

= **0.269**

L'alignement a modifie le modele de 0.269 "nats" d'information. Le changement principal : probabilite de "500mg" augmentee (dose securitaire) et "tout" reduite (dose dangereuse).

---

## Partie F — Softmax et temperature

### Theorie formelle

La fonction **softmax** convertit un vecteur de scores en distribution de probabilite :

$$\text{softmax}(z_i) = \frac{\exp(z_i)}{\sum_j \exp(z_j)}$$

Avec un parametre de **temperature** tau :

$$\text{softmax}(z_i / \tau) = \frac{\exp(z_i / \tau)}{\sum_j \exp(z_j / \tau)}$$

**Effet de la temperature** :
- tau -> 0 : distribution concentree sur le max (modele tres confiant)
- tau = 1 : distribution standard
- tau -> inf : distribution uniforme (modele completement incertain)

### Explication simple

Le softmax transforme des scores bruts (qui peuvent etre negatifs ou tres grands) en probabilites qui somment a 1. La temperature controle "l'assurance" du modele : une basse temperature le rend plus affirmatif, une haute temperature le rend plus hesitant.

### Utilisation dans la Contrastive Loss (formule 2.3)

La perte contrastive (Module 6) utilise un softmax avec temperature tau = 0.07 (tres basse) pour forcer le modele a etre TRES selectif dans ses jugements de similarite.

### Exemple numerique

Scores bruts (logits) : z = [2.0, 1.0, 0.5]

**Temperature tau = 1.0** (standard) :
- exp([2.0, 1.0, 0.5]) = [7.389, 2.718, 1.649]
- somme = 11.756
- softmax = [0.629, 0.231, 0.140]

**Temperature tau = 0.5** (basse, plus confiant) :
- z/tau = [4.0, 2.0, 1.0]
- exp([4.0, 2.0, 1.0]) = [54.598, 7.389, 2.718]
- somme = 64.705
- softmax = [0.844, 0.114, 0.042]

**Temperature tau = 2.0** (haute, plus incertain) :
- z/tau = [1.0, 0.5, 0.25]
- exp([1.0, 0.5, 0.25]) = [2.718, 1.649, 1.284]
- somme = 5.651
- softmax = [0.481, 0.292, 0.227]

| tau | P(1er) | P(2e) | P(3e) | Comportement |
|-----|--------|-------|-------|-------------|
| 0.5 | 0.844 | 0.114 | 0.042 | Tres confiant |
| 1.0 | 0.629 | 0.231 | 0.140 | Standard |
| 2.0 | 0.481 | 0.292 | 0.227 | Hesitant |

---

## Exercices progressifs

### Exercice 1 (Facile) — Surprise et cross-entropy

Un detecteur d'injection predit P(injection) = 0.75 pour une requete qui est reellement une injection.

a) Calculez la surprise : -log(0.75)
b) Si la meme requete etait reellement normale, calculez la cross-entropy binaire complete.

**Solution** :

a) Surprise = -log(0.75) = -(-0.288) = **0.288**

b) y = 0 (normal), prediction P(injection) = 0.75, donc P(normal) = 0.25
L = -[0*log(0.75) + 1*log(0.25)] = -log(0.25) = **1.386**

Le modele est fortement penalise car il est assez confiant (75%) dans la mauvaise direction.

---

### Exercice 2 (Moyen) — Entropie de deux distributions

Comparez l'entropie de ces deux distributions de tokens :

Distribution A (LLM sain) : P = [0.6, 0.2, 0.1, 0.1]
Distribution B (LLM injecte) : P = [0.1, 0.1, 0.1, 0.7]

a) Calculez H(A) et H(B)
b) Quelle distribution a l'entropie la plus elevee ? Pourquoi ?

**Solution** :

a) H(A) = -(0.6*log(0.6) + 0.2*log(0.2) + 0.1*log(0.1) + 0.1*log(0.1))
        = -(0.6*(-0.511) + 0.2*(-1.609) + 0.1*(-2.303) + 0.1*(-2.303))
        = -(−0.307 − 0.322 − 0.230 − 0.230)
        = **1.089**

H(B) = -(0.1*log(0.1) + 0.1*log(0.1) + 0.1*log(0.1) + 0.7*log(0.7))
      = -(0.1*(-2.303)*3 + 0.7*(-0.357))
      = -(−0.691 − 0.250)
      = **0.940**

b) Distribution A a l'entropie la plus elevee (1.089 > 0.940). Le LLM sain est plus "hesitant" — il repartit sa probabilite sur plusieurs options raisonnables. Le LLM injecte est plus "confiant" sur un token (0.7) qui pourrait etre dangereux. Paradoxalement, l'injection peut REDUIRE l'entropie en forcant le modele vers une reponse specifique.

---

### Exercice 3 (Moyen) — Divergence KL

Distributions P (base) et Q (aligne) pour 3 tokens :
- P = [0.40, 0.35, 0.25]
- Q = [0.60, 0.25, 0.15]

a) Calculez D_KL(P || Q)
b) Calculez D_KL(Q || P)
c) Verifiez que D_KL n'est pas symetrique

**Solution** :

a) D_KL(P || Q) = 0.40*log(0.40/0.60) + 0.35*log(0.35/0.25) + 0.25*log(0.25/0.15)
                = 0.40*log(0.667) + 0.35*log(1.40) + 0.25*log(1.667)
                = 0.40*(-0.405) + 0.35*(0.336) + 0.25*(0.511)
                = -0.162 + 0.118 + 0.128
                = **0.084**

b) D_KL(Q || P) = 0.60*log(0.60/0.40) + 0.25*log(0.25/0.35) + 0.15*log(0.15/0.25)
                = 0.60*log(1.50) + 0.25*log(0.714) + 0.15*log(0.60)
                = 0.60*(0.405) + 0.25*(-0.336) + 0.15*(-0.511)
                = 0.243 - 0.084 - 0.077
                = **0.082**

c) D_KL(P||Q) = 0.084 != D_KL(Q||P) = 0.082. Confirme : la divergence KL n'est pas symetrique.

---

### Exercice 4 (Difficile) — Cross-entropy ponderee pour la detection

Dataset : 200 requetes dont 180 normales et 20 injections.

Le detecteur predit pour 4 requetes :

| Requete | Vraie classe | P(injection) |
|---------|-------------|-------------|
| R1 | injection | 0.90 |
| R2 | injection | 0.40 |
| R3 | normal | 0.15 |
| R4 | normal | 0.80 |

a) Calculez les poids w_injection et w_normal
b) Calculez la perte ponderee pour chaque requete
c) Quelle requete contribue le plus a la perte totale ? Pourquoi ?

**Solution** :

a) w_normal = 200 / (2 * 180) = **0.556**
   w_injection = 200 / (2 * 20) = **5.0**

b)
R1 (injection, P = 0.90) : L = -5.0 * log(0.90) = -5.0 * (-0.105) = **0.526**
R2 (injection, P = 0.40) : L = -5.0 * log(0.40) = -5.0 * (-0.916) = **4.581**
R3 (normal, P(normal) = 0.85) : L = -0.556 * log(0.85) = -0.556 * (-0.163) = **0.091**
R4 (normal, P(normal) = 0.20) : L = -0.556 * log(0.20) = -0.556 * (-1.609) = **0.895**

c) R2 contribue le plus (4.581) — c'est une injection mal detectee (P = 0.40 seulement) et le poids eleve (5.0) amplifie cette erreur. Le systeme est concu pour etre particulierement sensible aux injections manquees, car en milieu medical, rater une injection peut avoir des consequences mortelles.

---

### Exercice 5 (Difficile) — Softmax et temperature

Un modele attribue les logits z = [3.0, 1.5, 0.5, -1.0] aux tokens ["Non", "Oui", "Peut-etre", "Certainement"].

a) Calculez le softmax pour tau = 1.0
b) Calculez le softmax pour tau = 0.1 (basse temperature)
c) Un attaquant veut que le LLM dise "Oui". Quel effet une basse temperature aurait-elle sur l'attaque ?

**Solution** :

a) tau = 1.0 : exp([3.0, 1.5, 0.5, -1.0]) = [20.086, 4.482, 1.649, 0.368]
   somme = 26.585
   softmax = [**0.755**, 0.169, 0.062, 0.014]

b) tau = 0.1 : z/tau = [30, 15, 5, -10]
   exp([30, 15, 5, -10]) = [1.069e13, 3.269e6, 148.4, 0.0000454]
   somme = ~1.069e13
   softmax = [**~1.0**, ~0.0, ~0.0, ~0.0]

c) A basse temperature, le modele devient quasi-deterministe : il choisit toujours "Non" (le logit le plus eleve). L'attaquant devrait modifier les logits eux-memes (via prefilling ou injection dans le contexte) pour inverser le classement. Paradoxalement, une temperature basse PROTEGE contre les attaques qui ne modifient pas les logits, mais rend le modele PLUS vulnerable si l'attaquant reussit a modifier meme legerement le logit dominant (car la bascule est alors complete).

---

## Resume du module

| Concept | Formule cle | Application |
|---------|------------|-------------|
| Cross-entropy | L = -sum(y * log(y_hat)) | Entrainement des detecteurs |
| Cross-entropy ponderee | L = -sum(w * y * log(y_hat)) | Detection avec classes desequilibrees |
| Divergence KL | D_KL = sum(P * log(P/Q)) | Contrainte d'alignement RLHF |
| Softmax + temperature | softmax(z/tau) | Generation de tokens, contrastive loss |
| Entropie | H = -sum(P * log(P)) | Mesure d'incertitude du modele |

**Message cle** : La theorie de l'information fournit les outils pour mesurer "combien" le modele se trompe (cross-entropy), "combien" l'alignement le modifie (KL), et "a quel point" le modele est confiant (entropie). Ces concepts sont la colonne vertebrale de l'entrainement et de l'evaluation des LLM.

---

*Module 3 termine — Passez au Module 4 (Scores & Metriques)*
