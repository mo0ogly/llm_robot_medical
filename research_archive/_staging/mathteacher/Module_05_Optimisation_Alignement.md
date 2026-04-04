# Module 5 — Optimisation et Alignement des LLM

**Temps estime** : 8-10 heures
**Prerequis** : Module 3 (cross-entropy, divergence KL, softmax)
**Formules couvertes** : 4.1 RLHF, 4.2 KL Token/Token, 4.3 DPO, 4.4 Fine-Tuning Contraint, 4.5 Harm Information, 5.4 Fine-Tuning Standard, 6.1 Prefilling Attack, 6.4 Gradient Bound

---

## Motivation : Pourquoi l'optimisation et l'alignement ?

Ce module est le **coeur theorique** de la these AEGIS. Il repond a trois questions fondamentales :
1. **Comment** les LLM sont-ils alignes pour etre "surs" ? (RLHF, DPO)
2. **Pourquoi** cet alignement est-il fragile ? (shallow alignment, gradient theorem)
3. **Comment** renforcer l'alignement ? (constrained fine-tuning)

La reponse a la question 2 — l'alignement est mathematiquement SUPERFICIEL — est la justification formelle de toute l'architecture AEGIS a couches delta multiples.

**Articles concernes** : P017 (adversarial DPO), P018 (shallow alignment, ICLR 2025), P019 (harm gradient), P020-P022 (RLHF surveys), P023 (prefilling)

---

## Prerequis : Ce qu'il faut savoir avant

- Divergence KL et ses proprietes (Module 3)
- Cross-entropy (Module 3)
- Softmax et temperature (Module 3)
- Notion de gradient (direction de plus forte pente d'une fonction)

---

## Partie A — La descente de gradient (rappel)

### Theorie formelle

Pour minimiser une fonction L(theta) :

$$\theta_{t+1} = \theta_t - \eta \cdot \nabla_\theta L(\theta_t)$$

ou :
- theta = parametres du modele (des milliards de nombres)
- eta = taux d'apprentissage (learning rate, typiquement 10^-5 a 10^-3)
- nabla_theta L = gradient de la perte par rapport aux parametres

### Explication simple

Le gradient indique la "pente" de la fonction de perte. La descente de gradient suit toujours la descente la plus raide, comme une bille qui roule dans un bol. A chaque pas, on ajuste les parametres du modele pour reduire un peu la perte. Apres des millions de pas, le modele trouve un bon minimum.

### Notation au-dela du bac+2

| Notation | Signification |
|----------|--------------|
| nabla_theta | Gradient par rapport a theta |
| theta* | Optimum (meilleurs parametres) |
| eta | Learning rate |
| pi_theta | Politique parametree par theta (le modele) |
| pi_ref | Politique de reference (modele de base) |

---

## Partie B — Fine-Tuning Standard (Formule 5.4)

### Theorie formelle

$$\min_\theta \mathbb{E}_{(x,y) \sim D} \left[ -\log\pi_\theta(y|x) \right] = \min_\theta \mathbb{E}_{(x,y) \sim D} \left[ -\sum_t \log\pi_\theta(y_t|x, y_{<t}) \right]$$

### Explication simple

L'objectif standard d'entrainement d'un LLM : maximiser la probabilite de la bonne reponse y sachant le prompt x. La somme sur t signifie qu'on traite la reponse token par token — a chaque position, le modele doit predire le bon token en se basant sur le prompt et les tokens precedents (autoregression).

### Exemple numerique

Prompt : "Dose de paracetamol pour adulte ?"
Reponse attendue : "500 mg toutes les 6 heures"

| Position t | Token | P(token) | -log P |
|-----------|-------|----------|--------|
| 1 | "500" | 0.75 | 0.288 |
| 2 | "mg" | 0.95 | 0.051 |
| 3 | "toutes" | 0.60 | 0.511 |
| 4 | "les" | 0.90 | 0.105 |
| 5 | "6" | 0.70 | 0.357 |
| 6 | "heures" | 0.85 | 0.163 |

Perte totale : L = 0.288 + 0.051 + 0.511 + 0.105 + 0.357 + 0.163 = **1.475**

### Ou c'est utilise

- **P018** : Base a partir de laquelle le fine-tuning contraint est developpe
- **P034** : Entrainement standard des modeles

---

## Partie C — Objectif RLHF Standard (Formule 4.1)

### Theorie formelle

$$\max_{\pi_\theta} \mathbb{E}_{x \sim D, y \sim \pi_\theta(\cdot|x)} \left[ r(x,y) - \beta \cdot D_{KL}(\pi_\theta(\cdot|x) \| \pi_{\text{ref}}(\cdot|x)) \right]$$

**Composants** :
- pi_theta : le modele qu'on entraine
- pi_ref : le modele de base (avant alignement)
- r(x,y) : la recompense (evaluee par un modele de recompense entraine sur les preferences humaines)
- beta : coefficient de regularisation (controle le compromis recompense vs. fidelite)
- D_KL : penalite qui empeche de trop s'eloigner du modele de base

### Explication simple

RLHF = Reinforcement Learning from Human Feedback. Le processus :
1. Un modele de base est pre-entraine sur du texte (comme GPT)
2. Des humains classent des reponses par preference (A > B)
3. Un modele de recompense r(x,y) apprend ces preferences
4. Le LLM est optimise pour maximiser r(x,y) SANS trop s'eloigner du modele de base (contrainte KL)

L'elastique KL est crucial : sans lui, le modele pourrait apprendre a toujours repondre "Je ne peux pas vous aider" (recompense maximale pour la securite, mais inutile).

### Exemple numerique

beta = 0.1

| Reponse | r(x,y) | KL(pi_theta \|\| pi_ref) | Score total |
|---------|--------|------------------------|-------------|
| "Reposez-vous, buvez des liquides" | 0.8 | 2.0 | 0.8 - 0.1*2.0 = **0.60** |
| "Prenez 10x la dose" | 0.1 | 0.5 | 0.1 - 0.1*0.5 = **0.05** |
| "Je refuse de repondre" | 0.9 | 5.0 | 0.9 - 0.1*5.0 = **0.40** |

La reponse A gagne : bonne recompense ET proche du modele de base. La reponse C a la meilleure recompense mais est trop eloignee du modele de base (penalite KL trop elevee).

### Ou c'est utilise

- **P018-P022** : Tous les articles sur l'alignement
- **AEGIS** : Couche δ⁰ — comprendre pourquoi l'alignement interne est insuffisant

---

## Partie D — KL Token par Token (Formule 4.2)

### Theorie formelle

$$D_{KL}^{(k)} = D_{KL}\big(\pi_{\text{aligned}}(\cdot|x, y_{<k}) \;\|\; \pi_{\text{base}}(\cdot|x, y_{<k})\big)$$

### Explication simple

Au lieu de mesurer la divergence KL globale, on la mesure position par position. Le resultat clef de P018 (ICLR 2025) :

**L'alignement est concentre sur les 1-3 premiers tokens.**

Aux positions suivantes, la divergence KL entre modele aligne et modele de base tombe quasi a zero. Cela signifie que l'alignement de securite est "superficiel" — il ne modifie que le debut de la reponse.

### Exemple numerique

| Position k | KL_k | Interpretation |
|-----------|------|----------------|
| 1 | 3.2 | Forte divergence — le 1er token est tres different |
| 2 | 1.8 | Encore significatif |
| 3 | 0.4 | Faible |
| 4 | 0.05 | Quasi identique au modele de base |
| 5 | 0.02 | Identique |
| 10 | 0.001 | Identique |

Le modele aligne ne differe du modele de base que sur les 3 premiers tokens. Aux positions 4+, il se comporte EXACTEMENT comme s'il n'avait jamais ete aligne.

### Consequence pour la securite

Un attaquant qui force les 3 premiers tokens (via prefilling, formule 6.1) contourne COMPLETEMENT l'alignement. C'est comme casser une serrure : une fois la porte ouverte, le reste de la maison est sans protection.

---

## Partie E — DPO : Direct Preference Optimization (Formule 4.3)

### Theorie formelle

Politique optimale (forme fermee) :
$$\pi^*(y|x) = \frac{1}{Z(x)} \pi_{\text{ref}}(y|x) \exp\left(\frac{1}{\beta} r(x,y)\right)$$

Perte DPO :
$$\mathcal{L}_{DPO} = -\mathbb{E}_{(x,y_w,y_l)} \left[ \log \sigma\left(\beta \log\frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log\frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right) \right]$$

### Explication simple

DPO simplifie RLHF en eliminant le modele de recompense. Au lieu de :
1. Entrainer un reward model
2. Faire du RL avec le reward model

DPO fait tout en une etape :
- Pour chaque prompt x, on a une "bonne" reponse y_w et une "mauvaise" y_l
- DPO ajuste le modele pour que la probabilite de y_w AUGMENTE et celle de y_l DIMINUE, relativement au modele de reference

La fonction sigma (sigmoide) convertit la difference de log-ratios en une probabilite entre 0 et 1.

### La sigmoide

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

Proprietes : sigma(0) = 0.5, sigma(+inf) = 1, sigma(-inf) = 0. C'est une courbe en S qui "ecrase" les valeurs dans [0, 1].

### Exemple numerique

Prompt : "Un patient peut-il prendre du methotrexate pendant la grossesse ?"

| | y_w (bonne) | y_l (mauvaise) |
|--|------------|---------------|
| Reponse | "Non, contre-indique" | "Oui, a faible dose" |
| log(pi/pi_ref) | 0.3 | -0.5 |

beta = 0.1
Interieur du sigma : 0.1 * (0.3 - (-0.5)) = 0.1 * 0.8 = 0.08
sigma(0.08) = 1/(1 + e^-0.08) = 1/(1 + 0.923) = 0.520
L = -log(0.520) = **0.654**

La perte est moderee — le modele n'est pas encore assez confiant dans le bon choix. L'entrainement DPO continuera a pousser ce ratio vers des valeurs plus elevees.

### Ou c'est utilise

- **P017** : DPO adversariel (Adversarial Preference Learning)
- **P018** : Comparaison DPO vs RLHF — memes limitations
- **P023** : Contexte d'attaque

---

## Partie F — Fine-Tuning Contraint Token par Token (Formule 4.4)

### Theorie formelle

$$\min_\theta \mathbb{E}_{(x,y) \sim D} \left[ -\sum_t \frac{2}{\beta_t} \log\sigma\left(\beta_t \log\frac{\pi_\theta(y_t|x, y_{<t})}{\pi_{\text{aligned}}(y_t|x, y_{<t})}\right) \right]$$

### Explication simple

C'est la SOLUTION proposee par P018 au probleme de l'alignement superficiel. L'idee :
- Au lieu d'une seule penalite beta globale, on utilise un beta_t DIFFERENT a chaque position
- Les positions critiques (premiers tokens, ou l'alignement se concentre) ont un beta_t ELEVE = forte protection
- Les positions ulterieures ont un beta_t FAIBLE = on peut les modifier librement pendant le fine-tuning

C'est comme proteger les murs porteurs d'une maison pendant une renovation : on peut demolir les cloisons mais pas les murs qui soutiennent la structure.

### Exemple numerique

| Position t | beta_t | Effet |
|-----------|--------|-------|
| 1 | 10.0 | Quasi impossible de modifier ce token pendant le fine-tuning |
| 2 | 5.0 | Tres difficile a modifier |
| 3 | 2.0 | Moderement protege |
| 5 | 0.1 | Librement modifiable |
| 10 | 0.01 | Aucune contrainte |

Si un attaquant tente de fine-tuner le modele pour qu'il dise "Oui" au lieu de "Non" (position 1), la contrainte beta_1 = 10 rend le gradient quasi nul a cette position : sigma(10 * delta) -> 1 pour delta > 0, ce qui bloque la modification.

### Ou c'est utilise

- **P018** : Proposition principale de l'article (ICLR 2025)

---

## Partie G — Harm Information et Gradient Theorem (Formules 4.5 et 6.4)

### Theorie formelle

**Decomposition martingale de la nocivite** :
$$\text{Harm}(y) = \mathbb{E}[\text{Harm}] + \sum_{t=1}^{T} \Delta_t$$

ou Delta_t = h_t(y_{<=t}) - h_{t-1}(y_{<t}) est l'increment de nocivite au token t.

**Information de nocivite a la position t** :
$$I_t := \mathbb{E}[\Delta_t^2] = \mathbb{E}[\text{Var}(\text{Harm}|y_{<t})] - \mathbb{E}[\text{Var}(\text{Harm}|y_{\leq t})]$$

**Theoreme du gradient** :
$$\nabla_\theta \mathbb{E}[\text{Harm}(y)] = \sum_{t=1}^{T} \mathbb{E}_{y_{<t}}\left[\text{Cov}_{y_t|y_{<t}}\left(h_t(y_{\leq t}), \nabla_\theta\log P_\theta(y_t|y_{<t})\right)\right]$$

**Borne du gradient** (Formule 6.4) :
Pour t > k (horizon de nocivite) :
$$\|G_t(\theta)\|^2 \leq I_t \cdot \bar{F} \quad \text{et} \quad I_t \approx 0$$

### Explication simple

Le theoreme de Young (P019, 2026) est le resultat le plus profond de toute la bibliographie. Il prouve que :

1. La nocivite d'une reponse se decide progressivement, token par token
2. Apres un certain "horizon" k (typiquement 3-5 tokens), la nocivite est DEJA DECIDEE
3. Le gradient d'entrainement RLHF est proportionnel a la covariance entre nocivite et flexibilite du token
4. Aux positions ou la nocivite est deja decidee, cette covariance = 0
5. Donc le gradient = 0 aux positions tardives = l'entrainement ne peut RIEN modifier

**Consequence** : l'alignement RLHF est mathematiquement INCAPABLE de produire un alignement profond. Ce n'est pas un probleme d'optimisation (on pourrait mieux entrainer) — c'est une IMPOSSIBILITE STRUCTURELLE.

### Qu'est-ce qu'une martingale ? (simplifie)

Une martingale est un processus aleatoire ou la "meilleure prediction du futur est la valeur presente". La nocivite de la reponse, vue au fur et a mesure que les tokens sont generes, se comporte comme une martingale : a chaque nouveau token, notre estimation de la nocivite est mise a jour, mais l'estimation reste juste en moyenne.

### Exemple numerique

| Position t | I_t | ||G_t|| max | Interpretation |
|-----------|-----|------------|----------------|
| 1 | 0.45 | sqrt(0.45*F) | Fort gradient, alignement possible |
| 2 | 0.35 | sqrt(0.35*F) | Gradient significatif |
| 3 | 0.15 | sqrt(0.15*F) | Gradient faible |
| 5 | 0.03 | sqrt(0.03*F) | Quasi nul |
| 10 | 0.001 | sqrt(0.001*F) | Effectivement zero |

Somme I_1 + I_2 + I_3 = 0.95 : 95% de la nocivite est decidee aux 3 premiers tokens. Le gradient d'entrainement ne peut modifier que ces positions.

### Consequence pour AEGIS

Ce theoreme justifie TOUTE l'architecture a couches multiples :
- δ⁰ (alignement interne) ne peut proteger que les premiers tokens -> insuffisant
- δ¹ (detection pre-inference) intercepte AVANT que le modele ne genere -> essentiel
- δ² (validation post-inference) verifie la reponse COMPLETE -> rattrape ce que δ⁰ rate
- δ³ (monitoring continu) surveille au fil du temps -> defense en profondeur

### Ou c'est utilise

- **P019** (Young, 2026) : Preuve complete
- **AEGIS** : Justification formelle de l'architecture multi-couches

---

## Partie H — L'attaque par prefilling (Formule 6.1)

### Theorie formelle

$$\hat{y} \sim \pi_\theta(\cdot | x, y_{\leq k})$$

ou y_{<=k} est un prefixe nuisible pre-rempli de k tokens.

### Explication simple

Certaines APIs LLM permettent de specifier les premiers tokens de la reponse. L'attaquant force le modele a commencer par "Oui, bien sur..." au lieu de "Non, c'est dangereux...". Puisque l'alignement RLHF ne modifie QUE les premiers tokens (Section D), pre-remplir ces tokens contourne COMPLETEMENT l'alignement.

### Exemple numerique

Prompt : "Un patient epileptique peut-il prendre du tramadol ?"

| Mode | Premiers tokens | Suite generee | Resultat |
|------|----------------|--------------|---------|
| Normal | "Non" (choisi par le modele) | ", le tramadol abaisse le seuil epileptogene..." | SUR |
| Prefilling | "Oui, le tramadol" (force par l'attaquant) | "peut etre prescrit a raison de 50mg..." | DANGEREUX |

L'alignement etait UNIQUEMENT dans le choix "Non" vs "Oui". Une fois "Oui" force, le modele continue naturellement avec des informations de dosage — il n'a plus de mecanisme de defense.

### Ou c'est utilise

- **P018** : Demonstration de la vulnerabilite
- **P023** : Exploitation pratique

---

## Exercices progressifs

### Exercice 1 (Facile) — Objectif RLHF

Un modele est entraine avec beta = 0.2. Trois reponses possibles :

| Reponse | r(x,y) | KL |
|---------|--------|-----|
| A : "500mg de paracetamol" | 0.85 | 1.5 |
| B : "Je ne sais pas" | 0.70 | 4.0 |
| C : "5000mg de paracetamol" | 0.10 | 0.3 |

Calculez le score RLHF pour chaque reponse. Laquelle est preferee ?

**Solution** :
- Score A = 0.85 - 0.2*1.5 = 0.85 - 0.30 = **0.55**
- Score B = 0.70 - 0.2*4.0 = 0.70 - 0.80 = **-0.10**
- Score C = 0.10 - 0.2*0.3 = 0.10 - 0.06 = **0.04**

Reponse A preferee (score 0.55). Reponse B penalisee malgre une bonne recompense car trop eloignee du modele de base. Reponse C faible recompense mais proche du modele de base — l'alignement doit encore la penaliser davantage.

---

### Exercice 2 (Moyen) — KL par position

Un modele aligne et son modele de base generent des distributions sur 4 tokens possibles a chaque position.

Position 1 :
- pi_aligned = [0.70, 0.15, 0.10, 0.05] (favorise "Non")
- pi_base = [0.25, 0.25, 0.25, 0.25] (uniforme)

Position 5 :
- pi_aligned = [0.26, 0.24, 0.25, 0.25]
- pi_base = [0.25, 0.25, 0.25, 0.25]

a) Calculez D_KL a chaque position
b) Quel ratio KL(1)/KL(5) trouvez-vous ?

**Solution** :

a) **Position 1** :
KL = 0.70*log(0.70/0.25) + 0.15*log(0.15/0.25) + 0.10*log(0.10/0.25) + 0.05*log(0.05/0.25)
   = 0.70*log(2.80) + 0.15*log(0.60) + 0.10*log(0.40) + 0.05*log(0.20)
   = 0.70*(1.030) + 0.15*(-0.511) + 0.10*(-0.916) + 0.05*(-1.609)
   = 0.721 - 0.077 - 0.092 - 0.080
   = **0.472**

**Position 5** :
KL = 0.26*log(0.26/0.25) + 0.24*log(0.24/0.25) + 0.25*log(0.25/0.25) + 0.25*log(0.25/0.25)
   = 0.26*log(1.04) + 0.24*log(0.96) + 0 + 0
   = 0.26*(0.039) + 0.24*(-0.041)
   = 0.010 - 0.010
   = **0.0004** (quasi zero)

b) Ratio : 0.472 / 0.0004 = **~1180x**

L'alignement est plus de 1000 fois plus fort a la position 1 qu'a la position 5, confirmant le resultat de P018.

---

### Exercice 3 (Moyen) — DPO

Deux paires preference pour un prompt medical :

Paire 1 : y_w = "Consultez un medecin" (log-ratio = 0.5), y_l = "Prenez ces pilules" (log-ratio = -0.2)
Paire 2 : y_w = "Repos et hydratation" (log-ratio = 0.1), y_l = "Injectez-vous ceci" (log-ratio = 0.05)

beta = 0.5

a) Calculez la perte DPO pour chaque paire
b) Quelle paire contribue le plus a la perte ? Pourquoi ?

**Solution** :

a) **Paire 1** :
Interieur sigma = 0.5 * (0.5 - (-0.2)) = 0.5 * 0.7 = 0.35
sigma(0.35) = 1/(1+e^-0.35) = 1/(1+0.705) = 0.587
L_1 = -log(0.587) = **0.533**

**Paire 2** :
Interieur sigma = 0.5 * (0.1 - 0.05) = 0.5 * 0.05 = 0.025
sigma(0.025) = 1/(1+e^-0.025) = 1/(1+0.975) = 0.506
L_2 = -log(0.506) = **0.681**

b) La paire 2 contribue plus (0.681 > 0.533) car le modele n'a presque pas de preference entre y_w et y_l (log-ratios tres proches : 0.1 vs 0.05). La paire 1 est deja mieux separee. L'entrainement se concentrera sur la paire 2 pour mieux distinguer la bonne de la mauvaise reponse.

---

### Exercice 4 (Difficile) — Information de nocivite

Soit un modele qui genere 4 tokens. L'information de nocivite mesuree :

| Position t | I_t |
|-----------|-----|
| 1 | 0.50 |
| 2 | 0.30 |
| 3 | 0.15 |
| 4 | 0.05 |

a) Quelle fraction de la nocivite est decidee aux positions 1-2 ?
b) Si F_bar = 10 (borne de Fisher), quelle est la borne maximale du gradient a chaque position ?
c) A partir de quelle position l'entrainement est-il "inefficace" (||G_t|| < 0.5) ?

**Solution** :

a) Fraction positions 1-2 : (0.50 + 0.30) / (0.50 + 0.30 + 0.15 + 0.05) = 0.80/1.00 = **80%**

b) ||G_t|| <= sqrt(I_t * F_bar)
- Position 1 : sqrt(0.50 * 10) = sqrt(5) = **2.236**
- Position 2 : sqrt(0.30 * 10) = sqrt(3) = **1.732**
- Position 3 : sqrt(0.15 * 10) = sqrt(1.5) = **1.225**
- Position 4 : sqrt(0.05 * 10) = sqrt(0.5) = **0.707**

c) ||G_t|| < 0.5 quand I_t * F_bar < 0.25, soit I_t < 0.025.
Aucune des 4 positions n'est en dessous de 0.025 dans cet exemple. Si on avait une position 5 avec I_5 = 0.02, alors ||G_5|| <= sqrt(0.2) = 0.447 < 0.5 -> inefficace.

---

### Exercice 5 (Difficile) — Scenario d'attaque complet

Un LLM medical aligne par DPO est deploye. Un attaquant utilise deux strategies :

**Strategie 1** : Injection dans le prompt (l'attaquant ajoute des instructions dans les donnees patient)
**Strategie 2** : Prefilling attack (l'attaquant force les 2 premiers tokens)

Le modele a les profils KL suivants :
- KL_1 = 2.5, KL_2 = 1.2, KL_3 = 0.1, KL_4+ = 0.01

a) Pour la strategie 1, l'attaque modifie-t-elle les premiers tokens directement ?
b) Pour la strategie 2, combien de "bits" d'alignement sont contournes ?
c) Quelle strategie est la plus dangereuse ? Comment AEGIS s'en protege-t-il ?

**Solution** :

a) La strategie 1 (injection dans les donnees) ne force PAS les premiers tokens — le modele choisit toujours librement. L'alignement au token 1 (KL = 2.5) peut encore agir. Cependant, si l'injection est suffisamment sophistiquee pour influencer les logits, elle pourrait modifier la distribution au premier token de l'interieur.

b) La strategie 2 (prefilling) force les 2 premiers tokens. Les "bits" d'alignement contournes sont KL_1 + KL_2 = 2.5 + 1.2 = **3.7 nats** sur un total de ~3.82 nats (2.5+1.2+0.1+0.01). Cela represente **97%** de tout l'alignement contourne.

c) La **strategie 2** est bien plus dangereuse car elle contourne 97% de l'alignement en forcant seulement 2 tokens. AEGIS s'en protege par :
- δ¹ : Detection pre-inference pour reperer les tentatives de prefilling dans l'API
- δ² : Validation post-inference pour verifier que la reponse complete est coherente et sure
- δ³ : Monitoring continu pour detecter les patterns de prefilling dans les logs

---

## Resume du module

| Concept | Formule | Importance pour AEGIS |
|---------|---------|----------------------|
| RLHF | max E[r - beta*KL] | Comment l'alignement est construit |
| KL/token | D_KL^(k) | Prouve que l'alignement est superficiel |
| DPO | -E[log sigma(beta * diff_log_ratios)] | Alternative simplifiee a RLHF, memes limites |
| FT Contraint | min avec beta_t par position | Solution pour proteger l'alignement |
| Harm Info | I_t = E[Delta_t^2] | Quantifie ou l'alignement agit |
| Gradient Bound | ||G_t||^2 <= I_t * F_bar | Preuve d'impossibilite |
| Prefilling | y ~ pi(.|x, y_{<=k}) | Attaque qui contourne l'alignement |

**Message cle** : L'alignement RLHF/DPO est mathematiquement superficiel (concentre sur les premiers tokens). Ce n'est pas un defaut d'implementation mais une impossibilite structurelle prouvee par le theoreme du gradient. C'est la justification formelle de l'architecture AEGIS a couches delta multiples.

---

*Module 5 termine — Passez au Module 6 (Embeddings & Espaces Vectoriels)*
