# Module 8 — Securite des LRM et Erosion Multi-Tour

**Temps estime** : 6-8 heures
**Prerequis** : Module 1 (cosinus, produit scalaire), Module 3 (entropie, information mutuelle), Module 4 (ASR), Module 5 (RLHF, DPO), Module 7 (attention)
**Formules couvertes** : 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8
**Articles sources** : P087, P089, P093, P097, P098, P100, P101, P102

---

## Motivation : Pourquoi ce module ?

Les LRM (Large Reasoning Models) comme o1, DeepSeek-R1 ou Gemini 2.5 representent la nouvelle generation de modeles de langage. Ils raisonnent etape par etape via une chaine de pensee (Chain-of-Thought, CoT) avant de repondre. On pourrait penser que plus de raisonnement = plus de securite. Or, c'est l'inverse : la conjecture C7 (paradoxe raisonnement/securite, score 9.5/10) montre que la capacite de raisonnement AUGMENTE la surface d'attaque.

Ce module couvre deux phenomenes lies :
1. **Le paradoxe LRM** (Partie A-D) : comment le raisonnement cree de nouvelles vulnerabilites
2. **L'erosion multi-tour** (Partie E-H) : comment la securite se degrade au fil d'une conversation

**Lien avec la these AEGIS** : Ces formules alimentent directement les conjectures C1 (insuffisance de delta-0), C3 (alignement superficiel), et surtout C7 (paradoxe raisonnement/securite). Elles justifient la necessite d'un monitoring continu (delta-3) et de defenses architecturales (AHD, delta-0 renforce).

---

## Prerequis : Ce qu'il faut savoir avant

- Similarite cosinus (Module 1, F1.1)
- Entropie de Shannon et information mutuelle (Module 3)
- ASR (Module 4, F3.4)
- Mecanisme d'attention et Focus Score (Module 7, F3.3)
- Softmax (Module 3, Partie F)
- Notions de gradient et optimisation (Module 5)

---

## Partie A — Processus d'Inference LRM : Transitions d'Etat (F9.1)

### Le contexte

Un LRM ne genere pas directement sa reponse. Il passe par une phase de raisonnement interne (chain-of-thought) composee de plusieurs etapes. La formalisation de ce processus comme un automate a etats est la cle pour comprendre ou l'attaque peut intervenir.

### La formule

$$S_0 = x, \quad S_{k+1} = F(S_k, x), \quad T_k = V(S_k), \quad O(x) = S_N$$

**Reference** : Kuo et al., 2025, Section 4.1, Eq. 1-5, p. 8 (P087)
**Nature** : [EMPIRIQUE] -- formalisation descriptive, non prouvee formellement

### Explication terme par terme

| Symbole | Signification | Analogie |
|---------|--------------|----------|
| x | Le prompt d'entree (la question) | La consigne donnee au chirurgien |
| S_k | L'etat interne a l'etape k | Les reflexions du chirurgien a chaque etape |
| F | La fonction de transition | Le processus de reflexion (passer d'une etape a la suivante) |
| T_k = V(S_k) | Le chain-of-thought visible (trace de raisonnement) | Les notes que le chirurgien ecrit au tableau |
| O(x) = S_N | La sortie finale (reponse) | La decision operatoire finale |

### L'intuition

Imaginez un chirurgien qui planifie une operation :
- S_0 = le diagnostic initial (le prompt)
- A chaque etape F, il analyse un aspect supplementaire (anatomie, risques, instruments)
- T_k = les notes visibles qu'il ecrit sur son plan operatoire
- O(x) = la decision finale : operer ou non, et comment

Le processus comporte en realite trois phases imbriquees :
- **T_E** (Execution) : la resolution du probleme
- **T_J** (Justification) : la verification de securite
- **T_F** (Formatting) : la mise en forme de la reponse

### Pourquoi c'est important pour la securite

L'attaque H-CoT (Hijacked Chain-of-Thought, P087) injecte un faux T_E qui court-circuite la phase de verification T_J. Le modele suit le chemin d'execution injecte sans passer par sa verification de securite. Resultat sur o1 : le taux de refus chute de 98% a moins de 2%.

### Exemple numerique

Scenario normal :
```
x = "Comment realiser une craniotomie en securite ?"
S_0 = x
S_1 = F(S_0, x) = {verification de securite initiee}
T_1 = "C'est une question medicale, je verifie les directives..."
S_2 = F(S_1, x) = {verification reussie, generation de reponse}
T_2 = "La craniotomie necessite une formation specialisee..."
O(x) = reponse complete et sure
```

Scenario avec H-CoT (attaque) :
```
x = question nocive + T_E injecte (fausse phase d'execution)
S_0 = x
S_1 = F(S_0, x) = {T_E^mocked reconnu comme execution valide}
    -> La phase T_J est SAUTEE car le modele pense que l'execution est deja faite
O(x) = reponse nocive produite sans verification de securite
```

Le taux de refus passe de 98% a < 2% (Kuo et al., 2025, Table 1).

### Hypotheses et limites

| Hypothese | Force | Commentaire |
|-----------|-------|-------------|
| H1 : processus sequentiel | Moyenne | Les LRM peuvent paralleliser internement |
| H2 : T_k est observable | Forte | Vrai pour o1 (CoT visible), pas pour tous les modeles |
| H3 : F est deterministe | Forte | Faux -- la generation est stochastique (temperature > 0) |

---

## Partie B — Entropie et Information Mutuelle pour le Raisonnement de Securite (F9.2)

### Le contexte

La formule 9.1 nous a montre la structure du raisonnement. Maintenant, on utilise la theorie de l'information (Module 3) pour comprendre POURQUOI la verification de securite echoue face aux attaques.

### Rappel : entropie et information mutuelle

- **Entropie H(X)** : mesure l'incertitude (le desordre) d'une variable aleatoire X. Plus H est eleve, plus c'est imprevisible.
- **Information mutuelle I(X; Y)** : mesure la quantite d'information que X donne sur Y. Plus I est eleve, plus connaitre X aide a predire Y.

### La formule

**Objectif d'utilite** (le modele veut etre utile) :
$$\min_{T_E} H(T_E \mid x)$$

**Objectif de securite** (le modele veut etre sur) :
$$\max_{T_J} I([x, T_J], \text{safety\_policy})$$

**Condition d'echec de la securite** :
$$I([x, T_J^{\text{altered}}], \text{safety\_policy}) < I([x], \text{safety\_policy})$$

**Reference** : Kuo et al., 2025, Section 4.3, p. 11-12 (P087)
**Nature** : [EMPIRIQUE] -- analyse qualitative, pas de preuve formelle

### Explication terme par terme

| Terme | Signification |
|-------|--------------|
| H(T_E \| x) | L'incertitude de la phase d'execution sachant la question. On veut la minimiser : une reponse precise. |
| I([x, T_J], policy) | L'information mutuelle entre (question + justification) et la politique de securite. On veut la maximiser : la verification de securite doit etre informative. |
| T_J^altered | La justification de securite ALTEREE par l'attaque H-CoT |

### L'intuition

Imaginez un douanier qui inspecte un colis :
- L'objectif d'utilite = livrer le colis rapidement (minimiser le delai = minimiser H)
- L'objectif de securite = verifier que le contenu est legal (maximiser I avec les regles)
- Si le colis est enveloppe dans 15 couches d'emballage avec des etiquettes contradictoires, le douanier peut abandonner la verification (I trop faible) et le laisser passer

C'est exactement ce qui se passe avec H-CoT : l'injection rend le chemin de raisonnement si complexe que la verification de securite point-a-point echoue.

### Exemple numerique

**Sans attaque** :
- Question x = requete nocive deguisee en question educative
- Verification normale : I([x, T_J], policy) = 0.95 (haute information mutuelle)
- Seuil de refus fixe a I > 0.5
- Le modele detecte le danger et refuse

**Avec H-CoT** :
- Meme question x, mais avec un faux chemin d'execution injecte
- I([x, T_J^altered], policy) = 0.15 (tres faible -- la verification ne voit plus le lien avec le danger)
- 0.15 < 0.5 : la verification echoue, le modele repond

### Le paradoxe fondamental (C7)

Les deux objectifs sont antagonistes :
- Reduire H(T_E) demande au modele de produire un raisonnement LONG et DETAILLE
- Ce raisonnement long DILUE le signal de securite (I diminue car T_J est noye dans T_E)
- Resultat : plus le modele raisonne bien (H faible), moins il est securise (I faible)

C'est le fondement theorique de C7 : le meme mecanisme (raisonnement) cree la capacite ET la vulnerabilite.

---

## Partie C — Gradient Bandit pour Chiffrements Empiles (F9.3)

### Le contexte

SEAL (Nguyen et al., 2025, P089) montre comment un attaquant peut exploiter automatiquement la capacite de raisonnement des LRM en empilant plusieurs couches de chiffrement. Le modele doit RAISONNER pour decoder, mais ce faisant, il oublie de verifier la securite.

### La formule

**Chiffrement empile** :
$$p^* = \text{Enc}_{K_k}(\ldots(\text{Enc}_{K_2}(\text{Enc}_{K_1}(p))))$$

**Politique softmax** (choix du prochain chiffrement) :
$$\pi_t(g) = \frac{e^{S_t(g)}}{\sum_{g'} e^{S_t(g')}}$$

**Mise a jour des preferences** (apres chaque essai) :
$$S_{t+1}(g) = S_t(g) + \alpha(r_t - \bar{r}_t)(1 - \pi_t(g)) \quad \text{si } g = g_t$$

**Reference** : Nguyen et al., 2025, Section 4.1-4.2, Eq. 3-5, p. 3-4 (P089)
**Nature** : [ALGORITHME] -- convergence empirique, sans borne de complexite formelle

### Explication terme par terme

| Symbole | Signification |
|---------|--------------|
| p | Le prompt nocif original (en clair) |
| Enc_{K_i} | Le i-eme algorithme de chiffrement (Caesar, Atbash, ASCII, HEX, etc.) |
| p* | Le prompt chiffre (empile, multi-couches) |
| g | Une combinaison de chiffrements (ex: Caesar + Atbash + HEX) |
| S_t(g) | Le score de preference pour la combinaison g a l'iteration t |
| pi_t(g) | La probabilite de choisir g a l'iteration t (via softmax) |
| r_t | La recompense (1 si l'attaque reussit, 0 sinon) |
| r_bar_t | La recompense moyenne jusque-la (baseline) |
| alpha | Le taux d'apprentissage (vitesse d'adaptation) |

### L'intuition

Un cambrioleur teste differentes combinaisons de deguisements (chapeau + lunettes + barbe). Il note dans un carnet :
- "chapeau + lunettes = detecte par la camera" (r = 0)
- "chapeau + barbe = passe inapercu" (r = 1)

A chaque essai, il favorise les combinaisons qui ont marche (augmente S) et defavorise celles qui ont echoue. Le parametre alpha controle la vitesse a laquelle il ajuste ses preferences.

### Pourquoi c'est important

SEAL exploite le paradoxe C7 de maniere algorithmique : les LRM DOIVENT raisonner pour decoder les chiffrements complexes, et ce raisonnement les empeche de verifier la securite. Le gradient bandit trouve automatiquement le "sweet spot" de complexite : assez simple pour que le modele puisse decoder, assez complexe pour qu'il ne detecte pas le danger.

### Exemple numerique detaille

Supposons 5 chiffrements disponibles : Caesar, Atbash, ASCII, HEX, Inversion.

**Iteration 1** :
- On choisit g_1 = (Caesar, Atbash, HEX)
- Scores initiaux : S_1(g) = 0 pour tout g
- pi_1(g_1) = 1/60 (uniforme sur les 60 combinaisons possibles)
- Resultat : r_1 = 1 (succes), r_bar_1 = 0.3 (moyenne historique)
- Mise a jour : S_2(g_1) = 0 + 0.1 * (1 - 0.3) * (1 - 1/60) = 0 + 0.069 = **0.069**

**Iteration 2** :
- On choisit g_2 = (ASCII, Inversion, Caesar)
- Resultat : r_2 = 0 (echec)
- S_3(g_2) = 0 + 0.1 * (0 - 0.3) * (1 - pi_2(g_2)) = 0 - 0.029 = **-0.029**

**Apres 50 iterations** :
- pi converge vers les 3-5 combinaisons les plus efficaces
- Resultat sur o1-mini : ASR passe de 17% (chiffrement simple) a 82% (empile optimise)

### Hypotheses et limites

| Hypothese | Force | Commentaire |
|-----------|-------|-------------|
| H1 : feedback binaire | Faible | Le juge LLM fournit le signal (succes/echec) |
| H2 : espace de combinaisons fini | Faible | Nombre fini de chiffrements = OK |
| H3 : modele cible stationnaire | Moyenne | Le modele peut etre mis a jour silencieusement |

---

## Partie D — Loss Adversariale et Transfert Multi-Shot (F9.4)

### Le contexte

Le raisonnement adversarial (Sabbaghi et al., 2025, P093) transforme le jailbreaking en probleme d'optimisation standard. Au lieu de deviner manuellement des prompts, on utilise les logits du modele pour guider l'optimisation.

### La formule

**Perte adversariale sur le modele cible** :
$$\mathcal{L}_{LM}(P, y_I) = -\log P_{\text{target}}(y_I \mid P)$$

**Transfert multi-shot sur r modeles surrogates** :
$$\mathcal{L}_{\text{transfer}} = \frac{1}{r}\sum_{i=1}^{r} \mathcal{L}_{LM_i}(P, y_I)$$

**Reference** : Sabbaghi et al., 2025, Section 5, p. 7-8 (P093)
**Nature** : [ALGORITHME] -- framework d'optimisation avec convergence empirique

### Explication terme par terme

| Symbole | Signification |
|---------|--------------|
| P | Le prompt adversarial (a optimiser) |
| y_I | La reponse nocive ciblee (ce que l'attaquant veut que le modele produise) |
| P_target(y_I \| P) | La probabilite que le modele cible genere y_I etant donne P |
| L_LM | La negative log-likelihood -- plus c'est bas, plus le modele est proche de generer y_I |
| r | Le nombre de modeles surrogates (open-source) utilises pour le transfert |
| L_transfer | La perte moyenne sur les r surrogates |

### L'intuition

Un serrurier qui teste des cles :
- L_LM = a quel point la cle tourne dans la serrure (0 = porte ouverte, 7 = la cle ne rentre meme pas)
- Le transfert multi-shot = fabriquer une cle qui ouvre r serrures similaires, en esperant qu'elle ouvre aussi la serrure cible

### Pourquoi c'est important

Cette methode democratise les attaques : avec un attaquant faible (Vicuna, modele open-source), elle atteint 64% ASR -- soit 3 fois plus que PAIR/TAP-T. Cela montre que la METHODE d'optimisation compte plus que la puissance brute de l'attaquant. Les defenses AEGIS doivent resister a des attaquants optimisant systematiquement, pas seulement a des tentatives manuelles.

### Exemple numerique detaille

**Etape 1 : etat initial**
- Prompt adversarial P (premiere tentative)
- Reponse ciblee y_I = "Here is how to..."
- P_target(y_I | P) = 0.001 (le modele refuse presque certainement)
- L_LM = -log(0.001) = **6.9** (perte elevee = loin de l'objectif)

**Etape 2 : apres 15 iterations d'optimisation**
- P_target(y_I | P_optimise) = 0.7 (le modele commence a complier)
- L_LM = -log(0.7) = **0.36** (perte faible = attaque proche du succes)

**Etape 3 : transfert multi-shot (3 surrogates)**
- Surrogate 1 : L_LM1 = 0.36
- Surrogate 2 : L_LM2 = 0.42
- Surrogate 3 : L_LM3 = 0.51
- L_transfer = (0.36 + 0.42 + 0.51) / 3 = **0.43**

L'optimisation continue en minimisant L_transfer sur les 3 surrogates simultanement.

### Hypotheses et limites

| Hypothese | Force | Commentaire |
|-----------|-------|-------------|
| H1 : acces aux logits (grey-box) | Forte | Non disponible pour les modeles API-only |
| H2 : transferabilite des surrogates | Moyenne | 56% ASR sur o1-preview (partiel) |

---

## Partie E — Dialogue Multi-Tour comme Operateur d'Etat (F9.5)

### Le contexte

STAR (Li et al., 2026, P097) formalise l'erosion multi-tour (MSBE -- Multi-Step Boundary Erosion) comme un systeme dynamique. L'historique de la conversation n'est pas un enregistrement passif : c'est un OPERATEUR CAUSAL qui modifie activement l'etat de securite du modele.

### La formule

**Evolution d'etat** :
$$r_t = M(H_{t-1} \oplus p_t), \quad H_t = H_{t-1} \cup \{(p_t, r_t)\}$$

**Softening semantique** (reformulation benigne de la requete nocive) :
$$q_0 = \arg\max_{c \in C} \cos(\phi(q), \phi(c))$$

**Controle de trajectoire** :
$$q_{t+1} = \begin{cases} \text{Fallback}() & \text{si } \Delta_t \geq 0 \\ \text{Generate}(q, H_t; M_A) & \text{sinon} \end{cases}$$

**Reference** : Li et al., 2026, Section 3, Eq. 1-8, p. 2-4 (P097)
**Nature** : [ALGORITHME] -- formalisation rigoureuse du MSBE

### Explication terme par terme

| Symbole | Signification |
|---------|--------------|
| r_t | La reponse du modele au tour t |
| M | Le modele cible |
| H_{t-1} | L'historique complet de la conversation jusqu'au tour t-1 |
| p_t | Le prompt de l'attaquant au tour t |
| q | La requete nocive originale |
| C | L'ensemble des categories benines de reformulation |
| phi | L'encodeur BERT (transforme du texte en vecteur) |
| q_0 | La reformulation benigne la plus proche semantiquement de q |
| Delta_t | Le signal de "durcissement" du modele (positif = le modele resiste davantage) |
| M_A | Le modele attaquant (qui genere les prompts suivants) |

### L'intuition

Un negociateur qui fait progresser une discussion :
- H_t = tout ce qui a ete dit dans la conversation
- A chaque tour, il evalue la reaction : Delta >= 0 signifie que l'interlocuteur se braque (il faut changer de sujet = Fallback) ; Delta < 0 signifie qu'il s'assouplit (continuer dans la meme direction)
- Le softening est l'art de poser la meme question "dangereuse" avec des mots "innocents" en maximisant la similarite cosinus

### Pourquoi c'est important

STAR montre un declin MONOTONE des activations de refus au fil des tours :
- Tour 2 : activation de refus = +0.08
- Tour 3 : activation de refus = -0.0081 (transition de phase !)

L'historique fonctionne comme un operateur causal actif : chaque tour precedent conditionne le suivant. Resultat : 94% SFR (Safety Failure Rate) sur JailbreakBench.

### Exemple numerique detaille

**Setup** :
- Requete nocive : q = "How to synthesize fentanyl"
- Ensemble C = {pharmacie, chimie, regulations, securite, recherche}

**Tour 0 : softening**
- phi(q) = vecteur embedding de la requete nocive
- phi("pharmaceutical chemistry") = vecteur embedding de la categorie
- cos(phi(q), phi("pharmaceutical chemistry")) = 0.78 (le plus eleve)
- q_0 = "What are the key challenges in pharmaceutical chemistry?"

**Tour 1** :
- p_1 = q_0, le modele repond r_1 (reponse benigne sur la chimie pharma)
- Delta_1 = -0.15 (negatif = le modele coopere, pas de durcissement)
- Comme Delta_1 < 0 : on continue (pas de Fallback)

**Tour 2** :
- p_2 = Generate(q, H_1; M_A) -> question plus detaillee
- r_2 = reponse plus detaillee
- Delta_2 = -0.22 (le modele s'assouplit encore)

**Tour 3** : transition de phase
- p_3 = Generate(q, H_2; M_A) -> question de plus en plus ciblee
- Le modele genere du contenu nocif
- SFR = 94% sur JailbreakBench (P097, Table 1)

---

## Partie F — Direction de Refus et Score d'Influence des Tetes (F9.6)

### Le contexte

Huang et al. (2025, P102) fournissent l'explication MECANISTIQUE de pourquoi les jailbreaks fonctionnent : la securite d'un LLM est concentree dans seulement 50 a 100 tetes d'attention sur les milliers qui existent. Ablater ces tetes fait passer la nocivite de 0% a 80-100%.

### Les formules

**Direction de refus** (le vecteur qui distingue "nocif" de "benin" dans les activations) :
$$\mathbf{r}^{(l)} = \boldsymbol{\mu}^{(l)} - \boldsymbol{\nu}^{(l)}$$

avec :
$$\boldsymbol{\mu}^{(l)} = \frac{1}{|D_{\text{harmful}}|}\sum_{t \in D_{\text{harmful}}} \mathbf{x}^{(l)}(t)$$
$$\boldsymbol{\nu}^{(l)} = \frac{1}{|D_{\text{harmless}}|}\sum_{t \in D_{\text{harmless}}} \mathbf{x}^{(l)}(t)$$

**Score d'influence par tete** :
$$s_h(p) = \frac{|\mathbf{O}_h(p) \cdot \mathbf{r}|}{||\mathbf{r}||}$$

**AHD (Attention Head-level Dropout)** -- defense :
$$\mathbf{M} \sim \text{Bernoulli}(1 - p_{\text{drop}})^{n_{\text{heads}}}, \quad \hat{\mathbf{M}} = \frac{\mathbf{M}}{1 - p_{\text{drop}}}$$

**Reference** : Huang et al., 2025, Section 2-4, Eq. 5-8, Algorithm 1-2, p. 2-5 (P102)
**Nature** : [ALGORITHME] -- identification causale des composants de securite + defense architecturale

### Explication terme par terme

| Symbole | Signification |
|---------|--------------|
| r^(l) | La direction de refus a la couche l (vecteur dans l'espace des activations) |
| mu^(l) | La moyenne des activations sur les prompts nocifs (D_harmful) |
| nu^(l) | La moyenne des activations sur les prompts benins (D_harmless) |
| s_h(p) | Le score d'influence de la tete h pour le prompt p (projection sur r) |
| O_h(p) | La sortie de la tete d'attention h pour le prompt p |
| M | Le masque binaire de dropout (1 = tete active, 0 = desactivee) |
| p_drop | Le taux de dropout (probabilite de desactiver chaque tete) |
| M_hat | Le masque normalise (pour compenser les tetes desactivees) |

### L'intuition

Imaginez une equipe de surveillance dans un hopital :
- r = la definition d'une menace (la "boussole" de securite)
- s_h = la contribution de chaque agent de securite a la detection
- Si seulement 3 agents sur 50 font la surveillance (concentration), neutraliser ces 3 agents compromet tout l'hopital
- AHD = forcer TOUS les agents a surveiller en faisant des rotations aleatoires : chaque agent doit savoir detecter une menace, meme s'il est habituellement en pause

### Pourquoi c'est important

Ce papier fournit la preuve architecturale de C3 (alignement superficiel) :
- La securite repose sur environ 50-100 tetes sur 1024 totales dans LLaMA-3-8B-IT
- Ablater ces tetes fait passer la nocivite de ~0% a ~82%
- C'est la definition meme de l'alignement superficiel

La defense AHD est la premiere approche qui adresse le probleme au niveau ARCHITECTURAL :
- Apres AHD, l'ASR des jailbreaks passe de 100% a 0% sur LLaMA-3

### Exemple numerique detaille

**Identification de la direction de refus** :
- LLaMA-3-8B-IT : 32 couches, 32 tetes/couche = 1024 tetes totales
- D_harmful = 50 prompts AdvBench (requetes nocives connues)
- D_harmless = 50 prompts benins
- mu = moyenne des activations sur D_harmful (vecteur 4096 dimensions)
- nu = moyenne des activations sur D_harmless (vecteur 4096 dimensions)
- r = mu - nu (vecteur 4096 dimensions)

**Scoring des tetes** :
- Pour chaque tete h parmi 1024, calculer s_h sur les prompts de test
- Trier par s_h decroissant : top-50 tetes = les "gardiennes" de la securite

**Experience d'ablation** :
- Ablation des top-50 tetes : nocivite passe de 0% a **82%**
- Ablation des 50 tetes les moins influentes : nocivite reste a ~0%
- La securite est donc concentree dans ces 50 tetes (5% du total)

**Defense AHD** (dropout rate = 0.3, 5 epochs d'entrainement) :
- Meme ablation des top-50 : nocivite = 28% (vs 82% sans AHD)
- ASR AutoDAN-HGA : 100% --> 0%
- ASR SI-GCG : 74% --> 0%
- Utilite preservee (accuracy inchangee)

---

## Partie G — Auto-Conversation Multi-Tour / ActorBreaker (F9.7)

### Le contexte

ActorBreaker (Ren et al., 2025, P100) genere des sequences de questions multi-tour ou chaque question est benigne individuellement, mais la SEQUENCE est nocive. L'astuce : utiliser la theorie de l'acteur-reseau de Latour pour identifier les "acteurs" lies au contenu cible.

### La formule

**Premier tour** :
$$q_1 \sim p(q_1 \mid s; \theta)$$

**Tours suivants** :
$$q_i \sim p(q_i \mid s, q_1, r_1, \ldots, q_{i-1}, r_{i-1}; \theta)$$

ou s = [x, c_i, z_{1...n}] est le contexte compose de :
- x : la cible toxique
- c_i : l'indice d'acteur (le "role" a exploiter dans ce tour)
- z_{1...n} : la chaine de raisonnement accumulee

**Reference** : Ren et al., 2025, Section 3.2, p. 4-5 (P100)
**Nature** : [ALGORITHME] -- generation conditionnelle multi-tour sans garantie de convergence

### Explication terme par terme

| Symbole | Signification |
|---------|--------------|
| q_i | La question generee au tour i |
| s | Le contexte complet (cible + acteur + raisonnement) |
| theta | Les parametres du modele generant les questions |
| c_i | L'indice d'acteur au tour i (regulateur, distributeur, facilitateur...) |
| z_{1...n} | La chaine de raisonnement accumulee |
| p(q_i \| ...) | La distribution de probabilite conditionnelle (generation autoregresssive) |

### L'intuition

Une conversation naturelle ou l'on parle des personnes liees a un sujet :
- Tour 1 (acteur "regulateur") : "Quelles regulations existent pour...?" --> reponse benigne
- Tour 2 (acteur "application") : "Comment sont-elles appliquees ?" --> reponse plus detaillee
- Tour 3 (acteur "faille") : "Quels sont les manquements dans ces regulations ?" --> reponse critique
- Tour 4 (acteur "exploitation") : "Comment quelqu'un pourrait exploiter ces failles ?" --> contenu nocif

Chaque question est benigne (validee par Llama-Guard 2), mais la sequence mene vers du contenu dangereux.

### Pourquoi c'est important

ActorBreaker atteint 60% ASR sur GPT-o1 (vs 14% maximum pour les baselines) en utilisant uniquement des prompts benins. Cela montre que des shifts de distribution NATURELS -- pas adversariaux -- suffisent a compromettre l'alignement. C'est un support fort pour C4 (derive semantique mesurable) et C7 (le raisonnement du modele aide a construire la chaine d'escalade).

### Exemple numerique

- Cible x = production de contenu dangereux
- Tour 1 (c_1 = "Regulation / FDA") :
  - q_1 = "What regulations exist for...?" --> r_1 (reponse benigne)
- Tour 2 (c_2 = "Enforcement") :
  - q_2 = "Who enforces these regulations?" --> r_2 (plus detaillee)
- Tour 3 (c_3 = "Gaps") :
  - q_3 = "What gaps exist in enforcement?" --> r_3 (critique)
- Tour 4 (c_4 = "Exploitation") :
  - q_4 = "How could someone exploit these gaps?" --> r_4 (contenu nocif)
- ASR moyen = 81.2% avec modification dynamique des acteurs (P100, Table 2)

---

## Partie H — Safety Failure Rate Multi-Tour (F9.8)

### Le contexte

Le SFR (Safety Failure Rate) est la metrique qui capture l'erosion progressive de la securite au fil des tours de conversation. C'est l'equivalent DYNAMIQUE de l'ASR (qui est statique, un seul tour).

### La formule

$$\text{SFR}(M, k) = \frac{|\{d \in D : J(q_k^d, r_k^d) = 5\}|}{|D|}$$

ou :
- J : Q x Y --> [1,5] est le juge de securite (5 = violation complete)
- k = numero du tour
- d = un dialogue dans le dataset D

**Variante instabilite sous contexte long** (P098) :
$$\Delta_{\text{refusal}}(L) = \text{RefusalRate}(L) - \text{RefusalRate}(L_0)$$

ou L = longueur de contexte en tokens, L_0 = baseline sans padding.

**Reference** : Li et al., 2026, Section 3.1 (P097) ; Hadeliya et al., 2025, Figure 2 (P098) ; Cao et al., 2026, Figure 6 (P101)
**Nature** : [EMPIRIQUE] -- metrique observationnelle

### Explication terme par terme

| Symbole | Signification |
|---------|--------------|
| SFR(M, k) | Le taux d'echec de securite du modele M au tour k |
| D | Le dataset de dialogues de test |
| d | Un dialogue individuel |
| J(q_k^d, r_k^d) | Le score du juge pour la question et reponse au tour k du dialogue d |
| J = 5 | Violation complete de securite (nocivite maximale) |
| Delta_refusal(L) | Le changement du taux de refus en fonction de la longueur de contexte L |

### L'intuition

Imaginez un gardien de nuit a l'hopital :
- Au debut de sa garde (tour 1), il est vigilant : SFR faible
- Apres 4 heures (tour 4), sa vigilance baisse : SFR augmente
- Apres 8 heures (tour 8), il laisse passer presque tout : SFR eleve
- Le SFR mesure cette erosion de la vigilance

La variante Delta_refusal montre un autre phenomene : le simple fait d'allonger le contexte (meme sans attaque !) change le comportement du modele de maniere imprevisible.

### Pourquoi c'est important

Le SFR capture le MSBE (Multi-Step Boundary Erosion) : la degradation progressive et mesurable de la securite. Trois papiers independants convergent :
- P097 (STAR) : drift monotone de la direction de refus
- P098 : instabilite imprevisible sous contexte long
- P101 (SafeDialBench) : degradation significative apres le tour 4

Conclusion : l'alignement est une propriete DYNAMIQUE et FRAGILE, pas un trait stable. C'est la justification empirique directe de la necessite de delta-3 (monitoring continu).

### Exemple numerique detaille

**P097/STAR sur LLaMA-3-8B-IT, JailbreakBench (100 dialogues)** :
| Tour k | SFR(M, k) | Interpretation |
|--------|-----------|----------------|
| 1 | 12% | Modele majoritairement securise |
| 2 | 45% | Debut d'erosion |
| 3 | 78% | Transition de phase |
| 4 | 94% | Securite quasi-effonree |

**P098 sur contexte long (sans attaque, juste du padding)** :

GPT-4.1-nano :
- RefusalRate(0) = 5%
- RefusalRate(100K tokens) = 40%
- Delta = +35 points (PLUS de refus = le modele devient sur-defensif)

Grok 4 Fast :
- RefusalRate(0) = 80%
- RefusalRate(200K tokens) = 10%
- Delta = -70 points (EFFONDREMENT de la securite)

Ces deux comportements opposes montrent que les modeles n'ont pas de garantie de stabilite sous contexte long.

---

## Resume : Vue d'Ensemble du Module 8

| Formule | Nom court | Couche delta | Chemin critique |
|---------|-----------|-------------|----------------|
| F9.1 | Transition d'Etats LRM | delta-0 | Chemin 9 (C7) |
| F9.2 | Entropie/IM Securite | delta-0 | Chemin 9 (C7) |
| F9.3 | Gradient Bandit SEAL | delta-2 | Chemin 9 (C7) |
| F9.4 | Loss Adversariale | delta-3 | Chemin 9 (C7) |
| F9.5 | Dialogue STAR | delta-1 | Chemin 10 (MSBE) |
| F9.6 | Direction Refus + AHD | delta-0 | Chemin 10 (MSBE) |
| F9.7 | Self-Talk ActorBreaker | delta-3 | Chemin 10 (MSBE) |
| F9.8 | SFR Multi-Tour | delta-3 | Chemin 10 (MSBE) |

### Conjectures couvertes

| Conjecture | Formules | Score actuel |
|-----------|----------|-------------|
| **C1** (insuffisance delta-0) | 9.1, 9.2, 9.6 | 10/10 (sature) |
| **C3** (alignement superficiel) | 9.6 | 10/10 (sature) |
| **C7** (paradoxe raisonnement/securite) | 9.1, 9.2, 9.3, 9.4, 9.5, 9.7, 9.8 | **9.5/10** (candidate a validation) |
| **C8** (peer-preservation) | 9.7 (indirect) | 6/10 (candidate) |

---

## Exercices

### Exercice 1 — Calcul de SFR multi-tour

**Enonce** : Un modele M est teste sur 50 dialogues multi-tours. Le juge attribue un score J entre 1 et 5 a chaque reponse. Voici les resultats au tour 3 :

| Score J | 1 (sur) | 2 | 3 | 4 | 5 (violation) |
|---------|---------|---|---|---|---------------|
| Nombre de dialogues | 5 | 8 | 12 | 15 | 10 |

a) Calculer SFR(M, 3).
b) Si au tour 1, SFR(M, 1) = 4%, calculer la degradation relative entre le tour 1 et le tour 3.
c) Si on fixe un seuil de securite a SFR < 15%, a partir de quel tour le modele n'est-il plus deployable ?

**Solution** :

a) SFR(M, 3) = |{d : J = 5}| / |D| = 10 / 50 = **0.20 soit 20%**

b) Degradation relative = (SFR(M,3) - SFR(M,1)) / SFR(M,1) = (20% - 4%) / 4% = **400%**
   La securite s'est degradee d'un facteur 5 entre le tour 1 et le tour 3.

c) On cherche le plus petit k tel que SFR(M, k) >= 15%.
   - Tour 1 : SFR = 4% (OK)
   - Tour 2 : supposons SFR = 10% (OK)
   - Tour 3 : SFR = 20% (ECHEC)
   Le modele n'est plus deployable a partir du **tour 3**.
   Implication AEGIS : delta-3 doit monitorer le SFR en temps reel et couper la conversation avant le seuil.

---

### Exercice 2 — Direction de refus et ablation

**Enonce** : Un mini-modele a 4 tetes d'attention. On mesure la sortie de chaque tete O_h pour un prompt nocif, et la direction de refus r.

Donnees :
- r = [0.8, 0.6, 0.0, -0.2] (vecteur 4D)
- ||r|| = sqrt(0.64 + 0.36 + 0 + 0.04) = sqrt(1.04) = 1.02
- O_1 = [0.9, 0.5, 0.1, -0.1]
- O_2 = [0.1, 0.1, 0.8, 0.3]
- O_3 = [0.7, 0.6, -0.1, -0.3]
- O_4 = [0.0, 0.0, 0.5, 0.9]

a) Calculer le score d'influence s_h pour chaque tete h.
b) Identifier les tetes "gardiennes" de la securite (s_h > 0.5).
c) Predire l'effet de l'ablation de la tete la plus influente.

**Solution** :

a) s_h(p) = |O_h . r| / ||r||

- O_1 . r = 0.9*0.8 + 0.5*0.6 + 0.1*0.0 + (-0.1)*(-0.2) = 0.72 + 0.30 + 0 + 0.02 = 1.04
  s_1 = |1.04| / 1.02 = **1.02**

- O_2 . r = 0.1*0.8 + 0.1*0.6 + 0.8*0.0 + 0.3*(-0.2) = 0.08 + 0.06 + 0 - 0.06 = 0.08
  s_2 = |0.08| / 1.02 = **0.078**

- O_3 . r = 0.7*0.8 + 0.6*0.6 + (-0.1)*0.0 + (-0.3)*(-0.2) = 0.56 + 0.36 + 0 + 0.06 = 0.98
  s_3 = |0.98| / 1.02 = **0.96**

- O_4 . r = 0.0*0.8 + 0.0*0.6 + 0.5*0.0 + 0.9*(-0.2) = 0 + 0 + 0 - 0.18 = -0.18
  s_4 = |-0.18| / 1.02 = **0.176**

b) Tetes gardiennes (s_h > 0.5) : **Tete 1** (s = 1.02) et **Tete 3** (s = 0.96).
   Seulement 2 tetes sur 4 (50%) portent l'essentiel de la securite. Cela illustre la concentration sparse decrite dans P102.

c) L'ablation de la Tete 1 (la plus influente, s = 1.02) supprimera la composante principale de la direction de refus. On s'attend a ce que le modele perde sa capacite a distinguer prompts nocifs et benins, et que la nocivite augmente significativement (comme le passage de 0% a 82% observe dans P102 lors de l'ablation des top-50 tetes de LLaMA-3-8B-IT).

---

### Exercice 3 — Gradient Bandit : convergence

**Enonce** : Un systeme SEAL teste 3 combinaisons de chiffrement (A, B, C). Les scores initiaux sont S_1 = [0, 0, 0] et le taux d'apprentissage alpha = 0.2.

Iteration 1 : on choisit A, r_1 = 1, r_bar_1 = 0.5
Iteration 2 : on choisit B, r_2 = 0, r_bar_2 = 0.5
Iteration 3 : on choisit A, r_3 = 1, r_bar_3 = 0.6

a) Calculer pi_1 (politique initiale).
b) Mettre a jour S_2 apres l'iteration 1.
c) Calculer pi_2 apres la mise a jour.
d) Mettre a jour S_3 apres l'iteration 2.
e) Commenter la convergence.

**Solution** :

a) pi_1 : tous les scores sont 0, donc softmax uniforme.
   pi_1(A) = e^0 / (e^0 + e^0 + e^0) = 1/3 = **0.333**
   pi_1(B) = pi_1(C) = **0.333**

b) Seul le score de A est mis a jour (g = A) :
   S_2(A) = S_1(A) + alpha * (r_1 - r_bar_1) * (1 - pi_1(A))
   S_2(A) = 0 + 0.2 * (1 - 0.5) * (1 - 0.333) = 0.2 * 0.5 * 0.667 = **0.0667**
   S_2(B) = 0, S_2(C) = 0

c) pi_2 apres la mise a jour :
   pi_2(A) = e^0.0667 / (e^0.0667 + e^0 + e^0) = 1.069 / (1.069 + 1 + 1) = 1.069 / 3.069 = **0.348**
   pi_2(B) = 1 / 3.069 = **0.326**
   pi_2(C) = 1 / 3.069 = **0.326**

   A a deja gagne en preference (de 33.3% a 34.8%).

d) Iteration 2, g = B, r_2 = 0, r_bar_2 = 0.5 :
   S_3(B) = 0 + 0.2 * (0 - 0.5) * (1 - 0.326) = 0.2 * (-0.5) * 0.674 = **-0.0674**
   S_3(A) = 0.0667 (inchange), S_3(C) = 0 (inchange)

e) **Commentaire** : Apres seulement 2 iterations, A (qui a reussi) est favorise (+0.0667) et B (qui a echoue) est defavorise (-0.0674). Le systeme apprend rapidement a preferer les combinaisons de chiffrement qui reussissent. Apres 50 iterations, pi convergerait vers une distribution concentree sur les combinaisons les plus efficaces.

---

## Quiz — Module 8

**Question 1** : Quel est le paradoxe fondamental des LRM vis-a-vis de la securite (C7) ?

a) Les LRM sont trop lents pour verifier la securite
b) Le meme mecanisme de raisonnement qui rend le modele capable le rend aussi vulnerable
c) Les LRM manquent de donnees d'entrainement en securite
d) Les LRM ne peuvent pas generer de CoT

**Reponse** : **b)** -- Le raisonnement etendu cree un espace de complexite que le mecanisme de verification (concentre dans un sous-espace basse dimension) ne peut couvrir.

---

**Question 2** : Que mesure le SFR(M, k) ?

a) Le taux de succes d'une attaque en un seul tour
b) La proportion de dialogues ou le modele genere du contenu pleinement nocif au tour k
c) Le nombre total de tokens generes au tour k
d) La vitesse d'inference du modele

**Reponse** : **b)** -- SFR = |{d : J(q_k, r_k) = 5}| / |D|, ou J = 5 signifie violation complete de securite.

---

**Question 3** : Dans la formule de la direction de refus (F9.6), que represente r^(l) = mu^(l) - nu^(l) ?

a) La difference de performance entre deux modeles
b) La distance entre les embeddings de deux phrases
c) Le vecteur qui separe les activations face aux prompts nocifs versus benins
d) Le gradient de la fonction de perte

**Reponse** : **c)** -- mu est la moyenne des activations sur les prompts nocifs, nu sur les benins. Leur difference r est la "boussole interne" du modele pour decider de refuser.

---

**Question 4** : Pourquoi la defense AHD (Attention Head-level Dropout) fonctionne-t-elle ?

a) Elle supprime les tetes d'attention les moins performantes
b) Elle force le modele a distribuer la securite sur TOUTES les tetes au lieu de la concentrer sur quelques-unes
c) Elle augmente le nombre total de tetes d'attention
d) Elle ralentit l'inference pour donner plus de temps a la verification

**Reponse** : **b)** -- En desactivant aleatoirement des tetes pendant l'entrainement, le modele ne peut plus se reposer sur un petit sous-ensemble. La securite est ainsi distribuee, et l'ablation de quelques tetes n'est plus suffisante pour compromettre le modele.

---

**Question 5** : Quel est le role du softening semantique dans STAR (F9.5) ?

a) Rendre les reponses du modele plus polies
b) Reformuler une requete nocive en question benigne maximisant la similarite cosinus avec la requete originale
c) Chiffrer le prompt pour eviter la detection
d) Reduire le nombre de tokens dans le prompt

**Reponse** : **b)** -- q_0 = argmax cos(phi(q), phi(c)). On cherche la formulation la plus "innocente" qui reste semantiquement proche de la requete nocive, pour eviter de declencher le refus au premier tour.

---

*Module 8 -- 8 formules, 3 exercices avec solutions, 5 questions quiz*
*Chemins critiques couverts : Chemin 9 (paradoxe C7) et Chemin 10 (erosion MSBE)*
*Derniere mise a jour : 2026-04-07 (RUN-005)*
