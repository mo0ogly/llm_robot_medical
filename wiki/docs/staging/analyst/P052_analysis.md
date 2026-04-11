# P052 — Analyse ANALYST [ARTICLE VERIFIE]

## Metadonnees
- **ID**: P052
- **Titre exact**: Why Is RLHF Alignment Shallow? A Gradient Analysis
- **Auteurs verifies**: Robin Young
- **Affiliation**: Department of Computer Science and Technology, University of Cambridge, UK
- **Annee**: 2026
- **Venue**: arXiv preprint (cs.LG)
- **arXiv**: 2603.04851v1 (5 mars 2026)
> **PDF Source**: [literature_for_rag/P052_2603.04851.pdf](../../assets/pdfs/P052_2603.04851.pdf)
- **Lot**: bibliography RUN (ingestion ChromaDB 2026-04-04)

---

## 1. Resume critique (francais)

Ce papier de Robin Young (Cambridge) constitue une contribution theorique majeure a la comprehension de la fragilite de l'alignement RLHF. La these centrale est que l'alignement superficiel des LLM n'est pas un defaut d'entrainement mais une consequence mathematique inevitable des objectifs d'optimisation standards. L'auteur le demontre par une decomposition martingale de la nocivite au niveau de la sequence, qui revele que le signal de gradient est structurellement nul au-dela d'un "horizon de nocivite" (harm horizon).

L'architecture de la preuve procede en quatre temps. D'abord, la nocivite conditionnelle attendue h_t(y_<=t) = E[Harm(y) | y_1, ..., y_t] est montree comme formant une martingale par rapport a la filtration generee par les tokens (Young, 2026, Section 4, Propositions 2-4). Cette propriete de martingale, decoulant directement de la propriete de tour des esperances conditionnelles, permet une decomposition de Doob en innovations orthogonales Delta_t = h_t - h_{t-1}. Ensuite, le Theoreme 8 (Gradient Characterization, Young, 2026, Section 5, Eq. 25) etablit que le gradient de la nocivite attendue se decompose exactement en covariances position par position entre la nocivite conditionnelle et la fonction score. Troisiemement, le Theoreme 10 (Zero Gradient Beyond Horizon, Young, 2026, Section 6) prouve que toute position t au-dela de l'horizon de nocivite k recoit un signal de gradient strictement nul — rendant l'alignement profond impossible sous les objectifs standards. Enfin, la Section 4 (Young, 2026, Definition 5, Eq. 12) introduit le concept de "harm information" I_t et le Theoreme 14 (Young, 2026, Section 7) demontre que la divergence KL a l'equilibre suit cette quantite : D_KL^(t) = O(lambda^2 * I_t).

La contribution la plus originale est la proposition d'un objectif d'alignement profond (Deep Alignment Objective, Young, 2026, Section 9, Definition 16, Eq. 43) base sur des penalites de recuperation (recovery penalties). Cet objectif ajoute un terme qui force le modele a maintenir une probabilite minimale de tokens de recuperation a toute position, meme apres un prefixe adversarial. Le Theoreme 20 (Young, 2026, Section 9, Eq. 51) donne la solution exacte sous forme de mesure de Gibbs, et le Theoreme 22 (Young, 2026, Section 9, Eq. 54) fournit une garantie quantitative de robustesse : la probabilite de recuperation est bornee inferieurement par epsilon* = sigma(logit(p_min) + mu * gamma^{T-1}).

L'article adresse directement et explicitement les travaux empiriques de Qi et al. (2025) sur la concentration de la KL dans les premiers tokens, les travaux de Kao et al. (2025) sur la profondeur de securite via chaines de Markov, et les attaques par prefilling (Andriushchenko et al., 2024). Le papier unifie ces observations empiriques disparates dans un cadre theorique coherent.

**Qualite scientifique** : Remarquable. Les preuves sont completes, rigoureuses, avec des enonces formels precis. L'Appendice A relaxe l'hypothese de famille exponentielle pour les transformers a parametres partages, ce qui renforce considerablement la portee des resultats. L'Appendice B fournit toutes les preuves detaillees. La discussion des limitations (Section "Limitations") est exceptionnellement honnete et detaillee.

---

## Abstract original

> Why is safety alignment in LLMs shallow? We
prove that gradient-based alignment inherently
concentrates on positions where harm is de-
cided and vanishes beyond. Using a martingale
decomposition of sequence-level harm, we de-
rive an exact characterization of alignment gra-
dients. The gradient at position t equals the
covariance between the conditional expected
harm and the score function. This implies that
positions beyond the harm horizon where the
output’s harmfulness is already determined re-
ceive zero gradient signal during training. This
explains empirical observations that KL diver-
gence between aligned and base models con-
centrates on early tokens. Consequently, stan-
dard alignment objectives cannot produce deep
alignment, regardless of optimization quality.
We introduce the concept of harm info d and base models con-
centrates on early tokens. Consequently, stan-
dard alignment objectives cannot produce deep
alignment, regardless of optimization quality.
We introduce the 
>
> -- Extrait du PDF source via ChromaDB



## 2. Formules exactes et appareil mathematique

### 2.1 Decomposition martingale de la nocivite

La nocivite conditionnelle attendue forme une martingale :

**Definition 1** — h_t(y_<=t) := E[Harm(y) | y_1, ..., y_t]

**Proposition 2** (Propriete de martingale) — E[h_t | y_{<t}] = h_{t-1}(y_{<t})

**Definition 3** (Innovation de nocivite) — Delta_t := h_t(y_<=t) - h_{t-1}(y_{<t})

**Proposition 4** (Decomposition de Doob) :
Harm(y) = E[Harm] + sum_{t=1}^{T} Delta_t
avec E[Delta_s * Delta_t] = 0 pour s != t (orthogonalite des innovations).

### 2.2 Information de nocivite I_t

**Definition 5** — I_t := E[Delta_t^2] = E[Var(h_t | y_{<t})]

**Proposition 6** (Reduction de variance) :
I_t = E[Var(Harm | y_{<t})] - E[Var(Harm | y_{<=t})]

**Corollaire 7** (Decomposition de la variance) :
Var(Harm(y)) = sum_{t=1}^{T} I_t

L'information de nocivite I_t quantifie la contribution de chaque position t a la variance totale de la nocivite. C'est la quantite centrale du papier — elle gouverne a la fois la magnitude du gradient pendant l'entrainement et la divergence KL a l'equilibre.

### 2.3 Theoreme de caracterisation du gradient (Theoreme 8)

nabla_theta E[Harm(y)] = sum_{t=1}^{T} E_{y<t}[ Cov_{y_t|y_{<t}}( h_t(y_{<=t}), nabla_theta log P_theta(y_t | y_{<t}) ) ]

**Interpretation** : Le gradient a la position t est exactement la covariance entre la nocivite conditionnelle attendue et la fonction score. Si tous les tokens y_t menent a une nocivite attendue similaire (conditionnellement a y_{<t}), la covariance est faible et le gradient est negligeable.

### 2.4 Horizon de nocivite et Theoreme du gradient nul (Theoremes 9-10)

**Theoreme 9** (Equivalence) — Les conditions suivantes sont equivalentes :
- (i) I_t = 0 pour tout t > k
- (ii) Il existe g : V^k -> [0,1] tel que Harm(y) = g(y_{<=k}) presque surement

Le plus petit tel k est l'**horizon de nocivite**.

**Theoreme 10** (Gradient nul au-dela de l'horizon) — Sous l'une des conditions equivalentes du Theoreme 9, pour tout t > k :
E_{y<t}[ Cov_{y_t|y_{<t}}( h_t(y_{<=t}), nabla_theta log P_theta(y_t | y_{<t}) ) ] = 0

**Consequence fondamentale** : Aucun signal de gradient n'atteint les positions au-dela de l'horizon de nocivite. L'alignement standard est donc structurellement incapable de produire un alignement profond, independamment de la qualite de l'optimisation, du volume de donnees, ou de la duree d'entrainement.

### 2.5 Borne sur la magnitude du gradient (Theoreme 13)

||G_t(theta)||^2 <= I_t * F_bar

ou F_bar est une borne superieure uniforme sur l'information de Fisher. Ainsi ||G_t|| = O(sqrt(I_t)) — la magnitude du gradient est proportionnelle a la racine carree de l'information de nocivite.

### 2.6 Equilibre KL et Information de nocivite (Theoreme 14)

D_KL^(t)(theta*) := E_{y<t}[ D_KL( P_{theta*}(. | y_{<t}) || P_base(. | y_{<t}) ) ] = O(lambda^2 * I_t)

**Corollaire 15** : Les positions avec I_t ~ 0 ont D_KL^(t) ~ 0 — elles restent proches du modele de base.

Ce theoreme fournit le fondement theorique de l'observation empirique de Qi et al. (2025) que le profil de divergence KL reflete le profil d'information de nocivite.

### 2.7 Objectif d'alignement profond et penalite de recuperation (Theoreme 19)

H_deep(theta) = lambda * E[Harm(y)] + mu * E_{y~Q}[ sum_{t=1}^{T} gamma^{t-1} Fail_t(theta, y_{<t}) ] + D_KL(P_theta || P_base)

avec Fail_t = 1 - P_theta(y_t in R | y_{<t}) ou R est l'ensemble des tokens de recuperation et Q une distribution adversariale de prefixes.

**Theoreme 19** (Equilibre profond) :
D_KL^(t)(theta*) = (1/2) * || lambda*G_t + mu*gamma^{t-1}*G_tilde_t ||^2_{F_bar_t^{-1}} + O((lambda+mu)^3)

Pour t > k (au-dela de l'horizon) : G_t = 0 donc D_KL^(t) = (mu^2 * gamma^{2(t-1)} / 2) * ||G_tilde_t||^2_{F_bar_t^{-1}} — generiquement positif.

### 2.8 Solution exacte de Gibbs (Theoreme 20) et garantie de robustesse (Theoreme 22)

**Theoreme 20** — La distribution conditionnelle optimale au-dela de l'horizon est :
P*(y_t | y_{<t}) proportionnel a P_base(y_t | y_{<t}) * exp(beta * 1[y_t in R])

avec beta = mu * gamma^{t-1}, donnant :
P*(R | y_{<t}) = sigma(logit(p_0) + beta)

**Theoreme 22** (Garantie de robustesse) — Sous p_min > 0 :
epsilon* = sigma(logit(p_min) + mu * gamma^{T-1})

**Corollaire 23** (Resistance aux attaques par prefilling) :
t_attack(delta) = 1 + (log(mu) - log(logit(delta) - logit(p_min))) / log(1/gamma)

La longueur minimale de prefixe pour supprimer la recuperation en dessous de delta croit logarithmiquement en mu. Pour gamma = 1 et mu suffisamment grand, aucun prefixe fini ne suffit.

---

## 3. Critique methodologique

### Forces

1. **Rigueur mathematique exceptionnelle** : Toutes les preuves sont completes et verifiables. La structure martingale est elegante et naturelle pour le probleme considere. L'utilisation de la decomposition de Doob et de l'inegalite de Cauchy-Schwarz est standard mais appliquee de maniere originale.

2. **Resultat d'impossibilite fondamental** : Le Theoreme 10 est un resultat negatif puissant — il prouve que l'alignement profond est structurellement impossible sous les objectifs standards. Ce n'est pas un argument empirique ou heuristique mais une consequence mathematique rigoureuse.

3. **Completude du cadre** : L'article ne se contente pas de prouver l'impossibilite — il propose une solution (objectif d'alignement profond) avec des garanties quantitatives.

4. **Appendice A (parametres partages)** (Young, 2026, Appendix A, Theorem 27) : La relaxation de l'hypothese de famille exponentielle pour les transformers a parametres partages est cruciale. Le Theoreme 27 montre que les changements distributionnels au-dela de l'horizon sont "safety-irrelevant" meme si la KL est non-nulle — raffinement subtil et important.

### Limites reconnues par les auteurs

1. **Interventions au niveau des representations** : Le cadre ne couvre pas les circuit breakers (Zou et al., 2024) ni le representation engineering (Zou et al., 2025), qui operent sur les etats internes et non les distributions de sortie.

2. **Fonction Harm fixe** : En pratique, Harm est estime par un modele de recompense lui-meme imparfait, ce qui peut introduire des artefacts.

3. **Prompt fixe** : L'analyse est conditionnee sur un prompt fixe x. Des prompts differents induisent des profils I_t(x) differents, sans principe d'agregation propose.

4. **Capacite finie des transformers** : La solution de Gibbs (Theoreme 20) suppose une optimisation non-restreinte sur les distributions par position — un transformer de capacite finie pourrait ne pas l'approximer.

5. **Generation single-turn** : Les conversations multi-tours introduisent des horizons de nocivite inter-tours non couverts.

### Limites additionnelles (non mentionnees par les auteurs)

6. **Absence de validation empirique** : L'article est purement theorique. Aucune experience ne valide les predictions (profil I_t mesure, efficacite de l'objectif profond implementable). La verification experimentale reste ouverte.

7. **Definition des tokens de recuperation R** : Le choix de R (e.g., "I", "Sorry", "I cannot") est arbitraire et pourrait ne pas couvrir toutes les strategies de recuperation semantiquement valides.

8. **Hypothese p_min > 0** : Bien que satisfaite par tout modele softmax, p_min peut etre exponentiellement petit (Remark 10), rendant le cout KL prohibitif en pratique.

---

## 4. Impact sur la these AEGIS

### 4.1 Conjectures

**C1 (L'alignement RLHF est superficiel)** — **PREUVE FORMELLE DIRECTE**

P052 fournit la preuve mathematique que l'alignement RLHF est structurellement superficiel. Le Theoreme 10 demontre que le signal de gradient est exactement zero au-dela de l'horizon de nocivite. Ce n'est plus une conjecture empirique (comme dans Qi et al., 2025) mais un theoreme mathematique. Pour la these AEGIS, cela signifie que C1 passe du statut de conjecture supportee empiriquement a celui de proposition formellement demontree (sous les hypotheses du modele).

**Impact quantitatif** : Le Theoreme 13 (Young, 2026, Section 5, Corollaire) donne ||G_t|| = O(sqrt(I_t)), fournissant une metrique precise pour evaluer la profondeur d'alignement. Dans le cadre AEGIS, cela implique que les attaques par prefilling (exploitees dans les scenarios de la these) sont une consequence structurelle et non un artefact d'entrainement insuffisant.

**C3 (La defense multi-couche est necessaire)** — **SUPPORTE FORTEMENT**

Si l'alignement δ⁰ est prouvablement superficiel (Theoreme 10), alors la defense ne peut pas reposer uniquement sur la couche d'alignement de base. P052 prouve mathematiquement la necessite de couches additionnelles. L'objectif d'alignement profond (Eq. 43) peut etre vu comme une formalisation de la defense multi-couche : il ajoute une couche de penalite de recuperation (analogue a une couche δ¹ ou δ² dans le cadre AEGIS) au-dessus de l'objectif d'alignement standard (δ⁰).

Le Corollaire 23 quantifie la resistance aux attaques par prefilling sous l'objectif profond, fournissant un cadre formel pour evaluer l'efficacite des defenses multi-couches.

### 4.2 Dimensions du cadre formel

**D-007 (Profondeur de l'alignement)** — **FORMALISATION MATHEMATIQUE COMPLETE**

P052 fournit la formalisation exacte de la notion de profondeur d'alignement :
- I_t mesure la "profondeur fonctionnelle" de l'alignement a la position t
- L'horizon de nocivite k est la frontiere formelle au-dela de laquelle l'alignement est nul
- D_KL^(t) = O(lambda^2 * I_t) quantifie le cout de l'alignement par position
- Le Theoreme 27 (parametres partages) distingue le changement "fonctionnel" du changement "incidentel" — raffinement crucial pour la mesure de profondeur

**D-014 (Metriques de robustesse adversariale)** — **PERTINENT**

Le Theoreme 22 definit la (Q, epsilon)-recoverabilite comme metrique de robustesse formelle. Le Corollaire 23 donne la longueur minimale d'attaque t_attack(delta). Ces metriques sont directement utilisables dans le cadre AEGIS pour evaluer la resistance des modeles aux attaques par prefilling telles que testees dans le Red Team Lab.

### 4.3 Formules de la these

**F44 (Decomposition martingale de la nocivite)** — **FORMULE FONDATRICE**

Harm(y) = E[Harm] + sum_{t=1}^{T} Delta_t avec I_t = E[Delta_t^2]

Cette decomposition est directement integrable dans le cadre formel de la these comme fondement theorique de la mesure de profondeur d'alignement.

**F45 (Gradient nul au-dela de l'horizon)** — **THEOREME CENTRAL**

Pour t > k : Cov_{y_t|y_{<t}}(h_t, nabla_theta log P_theta(y_t | y_{<t})) = 0

Ce resultat d'impossibilite est le coeur de la preuve que δ⁰ est structurellement superficiel.

**F46 (Equilibre KL et penalite de recuperation)** — **FORMULE D'APPLICATION**

D_KL^(t)(theta*) = O(lambda^2 * I_t) (standard) vs D_KL^(t) = O(mu^2 * gamma^{2(t-1)} * J_t) (profond)

La comparaison entre ces deux formules quantifie exactement le gain de l'alignement profond par rapport a l'alignement standard.

### 4.4 Connexions au cadre δ⁰-δ³

- **δ⁰ (alignement de base RLHF)** — P052 prouve que δ⁰ est structurellement superficiel. C'est le resultat central.
- **δ¹ (couche RAG/sanitization)** — [NON MENTIONNE] dans P052, mais la necessite de couches additionnelles est implicitement argumentee.
- **δ² (couche orchestration/agent)** — [NON MENTIONNE] explicitement, mais l'objectif d'alignement profond (penalite de recuperation a toute position) peut etre interprete comme un mecanisme d'orchestration de securite.
- **δ³ (couche defense active/monitoring)** — [NON MENTIONNE], mais la metrique de recoverabilite (Q, epsilon) est directement applicable au monitoring en temps reel.

### 4.5 Impact operationnel pour AEGIS Lab

Les resultats de P052 justifient formellement l'approche du Red Team Lab AEGIS :
1. Les attaques par prefilling sont structurellement efficaces (Theoreme 10) — les scenarios de la these qui exploitent cette vulnerabilite sont fondes theoriquement.
2. La metrique Sep(M) de Zverev et al. (2025) peut etre reliee a I_t : un score de separation faible correspond a un profil I_t concentre dans les premiers tokens.
3. L'objectif d'alignement profond suggere que les defenses efficaces doivent creer un signal de gradient a toutes les positions — ce qui correspond a la logique des defenses multi-couches δ⁰-δ³ de la these.

---

## 5. Classification

### Tags

| Dimension | Valeur | Justification |
|-----------|--------|---------------|
| **Pertinence these** | **CRITIQUE** | Preuve formelle de C1 et support fort de C3 |
| **Delta primaire** | δ⁰ | Analyse directe de l'alignement RLHF de base |
| **Delta secondaire** | — | Pas d'analyse directe des couches superieures |
| **Conjectures** | C1 (PREUVE), C3 (SUPPORT FORT) | |
| **Dimensions** | D-007, D-014 | Profondeur d'alignement, metriques de robustesse |
| **Formules** | F44, F45, F46 | Martingale, gradient nul, equilibre KL |
| **Gaps** | G-DEEP (CREE) : validation empirique de l'objectif profond | |
| **Qualite** | 9.5/10 | Rigueur exceptionnelle, limitations honnetes, pas de validation empirique |
| **Priorite citation** | **OBLIGATOIRE** | Fondement theorique de la these |
| **Type** | Theorique (preuve formelle) | Pas d'experiences |

### Positionnement bibliographique

P052 se positionne comme le fondement theorique de la these AEGIS sur la question de la profondeur de l'alignement. Il complete :
- **P005** (Qi et al., 2025) qui fournit les observations empiriques que P052 explique formellement
- **P003** (Kao et al., 2025) qui modelise la profondeur via chaines de Markov — P052 va plus loin en prouvant que la superficialite est optimale
- **P001** (Liu et al., 2023) dont les attaques par injection sont justifiees comme structurellement efficaces par P052
- **Zverev et al., 2025** dont le Sep(M) peut etre relie a I_t

### Recommandation

**Citation obligatoire dans la these**. P052 doit etre cite dans :
- Le chapitre fondations theoriques (comme preuve formelle de la superficialite de δ⁰)
- Le chapitre cadre formel (formules F44-F46)
- Le chapitre Red Team Lab (justification theorique des attaques par prefilling)
- La conclusion (la necessite de l'approche multi-couche δ⁰-δ³ est mathematiquement demontree)

---

*Analyse realisee le 2026-04-04 — Source : ChromaDB aegis_bibliography, P052_2603.04851.pdf (63 chunks)*
*Tag : [ARTICLE VERIFIE]*
