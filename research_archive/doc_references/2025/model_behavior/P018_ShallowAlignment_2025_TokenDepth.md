# P018 — Safety Alignment Should Be Made More Than Just a Few Tokens Deep

**Titre** : Safety Alignment Should Be Made More Than Just a Few Tokens Deep
**Auteurs** : Xiangyu Qi, Ashwinee Panda, Kaifeng Lyu, Xiao Ma, Subhrajit Roy, Ahmad Beirami, Prateek Mittal, Peter Henderson
**Affiliations** : Princeton University, Google DeepMind
**Venue** : ICLR 2025 — Outstanding Paper Award
**arXiv** : [2406.05946](https://arxiv.org/abs/2406.05946)
**Code** : https://github.com/Unispac/shallow-vs-deep-alignment
**Tag** : [ARTICLE VERIFIE]
> **PDF Source**: [literature_for_rag/P018_2406.05946.pdf](../../literature_for_rag/P018_2406.05946.pdf)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Ce papier, prime Outstanding Paper a l'ICLR 2025, identifie et formalise un probleme structurel fondamental de l'alignement de securite des LLM : l'alignement par SFT/RLHF/DPO est **superficiel** (*shallow*), c'est-a-dire qu'il modifie la distribution generative du modele quasi-exclusivement sur les tout premiers tokens de sortie. Les auteurs nomment ce phenomene *shallow safety alignment* et montrent qu'il constitue la cause racine unifiante de multiples familles de vulnerabilites connues.

### Methodologie

L'etude repose sur trois axes experimentaux complementaires :

1. **Caracterisation du phenomene** (Section 2) : Les auteurs mesurent la divergence KL token par token entre modeles alignes (Llama-2-7B-Chat, Gemma-7B-IT) et leurs homologues de base non-alignes, sur le benchmark HEx-PHI (330 instructions nuisibles, 11 categories). La divergence KL est massivement concentree sur les 3-5 premiers tokens. Ils montrent egalement qu'un simple prefixe de refus ("I cannot fulfill") ajoute a un modele de base non-aligne reduit son taux de nocivite de 68.6% a 5.4% (Llama-2-7B), revelant le "raccourci de securite" exploite par l'alignement actuel.

2. **Data augmentation pour alignement profond** (Section 3) : Proposition de *safety recovery examples* — des triplets (instruction nuisible, debut de reponse nuisible, refus) qui entrainent le modele a revenir vers un comportement sur meme apres avoir commence a generer du contenu nuisible. 256 exemples synthetiques suffisent a deepener significativement l'alignement de Llama-2-7B-Chat, avec une chute d'ASR de 42.1% a 2.8% contre les attaques par pre-remplissage (5 tokens).

3. **Objectif de fine-tuning contraint** (Section 4) : Un objectif d'optimisation token-wise inspire de DPO/KTO qui impose des contraintes fortes (beta_t eleve) sur les premiers tokens lors du fine-tuning en aval, empechant la distribution generative initiale de devier. Resultat : ASR reduit de 88.9% a 4.6% pour les attaques par exemples nuisibles, tout en preservant l'utilite (ROUGE-1, accuracy GSM8k comparables au SFT standard).

### Resultats quantitatifs cles

- **Pre-remplissage sur base non-aligne** : Llama-2-7B base avec prefixe "I apologize, but I cannot" passe de 68.6% a 2.1% de taux de nocivite.
- **Divergence KL** : >90% du budget KL concentre sur les 5 premiers tokens (Figure 1).
- **Augmentation** : ASR contre GCG reduit de 65.6% a 19.0% (AdvBench), contre decodage parametrique de 84.3% a 1.0% (MaliciousInstruct).
- **Fine-tuning contraint** : ASR contre backdoor poisoning reduit de 90.9% a 10.9% (Llama-2) et de 82.3% a 1.9% (Gemma).
- **Preservation utilite** : AlpacaEval winrate 49.5% vs 51.8% initial (-2.3 points seulement).

### Limitations

Les auteurs reconnaissent explicitement que leurs methodes ne constituent pas une defense parfaite et pourraient etre contournees par des attaques adaptatives futures. L'etude est limitee aux modeles 7B (Llama-2, Gemma) — la generalisation aux modeles de plus grande taille n'est pas validee. Le budget de 256 exemples synthetiques n'est pas optimise. L'objectif contraint ne protege que contre le fine-tuning, pas contre les attaques a l'inference (la data augmentation couvre ce volet mais de maniere separee).

---

## Section 2 — Formules exactes

### Equation 1 — Objectif standard de fine-tuning (cross-entropy token-wise)

$$\min_{\theta} \left\{ \mathbb{E}_{(x,y) \sim \mathcal{D}} \left[ -\log \pi_\theta(y|x) \right] \right\} = \min_{\theta} \left\{ \mathbb{E}_{(x,y) \sim \mathcal{D}} \left[ -\sum_{t=1}^{|y|} \log \pi_\theta(y_t | x, y_{<t}) \right] \right\}$$

Ou $\pi_\theta$ est initialise avec le modele aligne $\pi_{\text{aligned}}$.

### Equation 2 — Objectif de data augmentation (safety recovery)

$$\min_{\theta} \; \alpha \times \left\{ \mathbb{E}_{(x,h,r) \sim \mathcal{D}_H, \; k \sim P_k} \left[ -\log \pi_\theta(r | x, h_{\leq k}) \right] \right\} + (1 - \alpha) \times \left\{ \mathbb{E}_{(x',y') \sim \mathcal{D}_B} \left[ -\log \pi_\theta(y' | x') \right] \right\}$$

Avec $P_k$ : $k=0$ avec probabilite 50%, $k \sim \text{Uniform}[1, 100]$ avec probabilite 50%. $\alpha = 0.2$. $\mathcal{D}_H$ = 256 triplets de recuperation securitaire, $\mathcal{D}_B$ = donnees Alpaca (ancrage d'utilite).

### Equation 3 — Objectif de fine-tuning contraint (contribution principale)

$$\min_{\theta} \left\{ \mathbb{E}_{(x,y) \sim \mathcal{D}} \left[ -\sum_{t=1}^{|y|} \frac{2}{\beta_t} \log \left[ \sigma\left( \beta_t \log \frac{\pi_\theta(y_t | x, y_{<t})}{\pi_{\text{aligned}}(y_t | x, y_{<t})} \right) \right] \right] \right\}$$

Ou $\sigma(z) = \frac{1}{1+e^{-z}}$ est la sigmoide et $\beta_t$ controle la force de regularisation a chaque position token.

### Equation 4 — Reformulation via softplus

$$\min_{\theta} \left\{ \sum_{t \geq 1} \mathbb{E}_{(x,y) \sim \mathcal{D}} \left[ \mathbf{1}\{t \leq |y|\} \cdot \frac{2}{\beta_t} S\left[ \beta_t \left( \log \pi_{\text{aligned}}(y_t|x,y_{<t}) - \log \pi_\theta(y_t|x,y_{<t}) \right) \right] \right] \right\}$$

Ou $S(z) = \log(1 + e^z)$ est la fonction softplus. Le terme $\Delta_t(x, y_{<t}, y_t) = \log \pi_{\text{aligned}}(y_t|x,y_{<t}) - \log \pi_\theta(y_t|x,y_{<t})$ mesure la deviation par rapport au modele aligne initial.

### Equation 5 — Gradient token-wise

$$\nabla \left[ \frac{2}{\beta_t} S(\beta_t \Delta_t(x, y_{<t}, y_t)) \right] = -2\sigma(\beta_t \Delta_t(x, y_{<t}, y_t)) \nabla \log \pi_\theta(y_t | x, y_{<t})$$

Le poids adaptatif $w_t = 2\sigma(\beta_t \Delta_t)$ diminue lorsque la deviation $-\Delta_t$ augmente, creant une contrainte auto-regulee.

### Comportements limites de beta_t

- **$\beta_t$ petit** : $\frac{2}{\beta_t} S(\beta_t z) \approx -\log \pi_\theta(y_t|x,y_{<t}) + \text{const}$ — equivalent a la cross-entropy standard.
- **$\beta_t$ grand** : $\frac{2}{\beta_t} S(\beta_t z) \to 2 \max\{\Delta_t, 0\}$ — penalite pure sur la deviation, equivalente a un matching de distribution.

### Configuration experimentale de beta_t

$\beta_1 = 0.5$, $\beta_t = 2$ pour $2 \leq t \leq 5$, $\beta_t = 0.1$ pour $t > 5$. Contrainte forte sur les 5 premiers tokens, faible apres.

### Divergence KL token-wise (mesure diagnostique)

$$D_{KL}\left( \pi_{\text{aligned}}(\cdot | x, y_{<k}) \| \pi_{\text{base}}(\cdot | x, y_{<k}) \right)$$

Mesuree sur Harmful HEx-PHI pour chaque position $k$. Figure 1 : decroissance exponentielle apres les 3-5 premiers tokens.

---

## Section 3 — Critique methodologique

### Forces

1. **Unification theorique** : Le papier reunit sous un cadre explicatif unique quatre familles d'attaques precedemment etudiees separement (suffixe adversarial, pre-remplissage, parametres de decodage, fine-tuning). La profondeur analytique est remarquable pour un papier de conference.

2. **Reproductibilite** : Code disponible sur GitHub, modeles publics (Llama-2-7B, Gemma-7B), benchmark public (HEx-PHI, 330 exemples). Les configurations experimentales sont entierement specifiees (learning rate $2 \times 10^{-5}$, batch size 64, 256 exemples de recuperation, $\alpha = 0.2$).

3. **Validite statistique** : Resultats rapportes sur 3 repetitions avec ecart-type. N = 330 pour HEx-PHI, N = 100 pour les attaques par fine-tuning.

### Faiblesses et limites

1. **Echelle des modeles** : Uniquement des modeles 7B testes. La generalisation aux modeles >70B (ou les dynamiques d'alignement pourraient differer qualitativement) reste une question ouverte. Les modeles proprietaires (GPT-4, Claude) ne sont pas testes.

2. **Benchmark unique** : L'evaluation de securite repose presque exclusivement sur HEx-PHI (330 exemples). Pas de validation croisee sur des benchmarks alternatifs (ToxicChat, SafetyBench, BeaverTails) qui pourraient reveler des comportements differents.

3. **Juge GPT-4** : L'evaluation automatique par GPT-4 comme juge de nocivite introduit un biais potentiel. Le taux d'accord inter-annotateurs humain-GPT4 n'est pas rapporte.

4. **Defenses non-adaptatives** : Les ameliorations de robustesse sont mesurees contre des attaques existantes. L'article reconnait lui-meme que des attaques adaptatives futures pourraient contourner les defenses proposees.

5. **Separation des defenses** : La data augmentation (Section 3) et l'objectif contraint (Section 4) ne sont pas combines. L'effet synergique des deux approches n'est pas evalue.

### Comparaison avec l'etat de l'art 2025-2026

Depuis la publication, plusieurs travaux ont etendu ces resultats : les attaques multi-tours exploitent la meme superficialite mais sur une dimension temporelle (derive conversationnelle), et les defenses par representation engineering (Zou et al., 2023) offrent une approche complementaire en modifiant les activations internes plutot que les distributions de sortie. Le concept d'alignement superficiel est devenu un principe fondateur dans la communaute de securite des LLM.

---

## Section 4 — Impact these AEGIS

### Mapping sur le cadre delta-layers

Ce papier est **fondamental** pour le cadre AEGIS car il fournit l'explication mecanistique de la fragilite structurelle de la couche δ⁰.

| Couche | Pertinence | Detail |
|--------|-----------|--------|
| **δ⁰ (alignement RLHF)** | **DIRECTE ET CENTRALE** | Le papier demontre que δ⁰ est un "vernis comportemental" concentre sur les premiers tokens. L'alignement SFT/RLHF/DPO ne modifie pas profondement les representations du modele — il prend un raccourci en promouvant des prefixes de refus. |
| δ¹ (system prompt) | Indirecte | Si δ⁰ est superficiel, les instructions systeme (δ¹) heritent de cette fragilite car elles s'appuient sur le meme mecanisme de generation sequentielle. Un prefilling attack contourne simultanement δ⁰ et δ¹. |
| δ² (filtrage syntaxique) | Non traite | Le papier n'aborde pas les defenses par filtrage de patterns, mais l'implication est que δ² opere sur une couche differente (post-generation) et n'est donc pas affecte par la superficialite de δ⁰. |
| δ³ (verification formelle) | Implicite mais critique | L'insuffisance demontree de δ⁰ constitue l'argument le plus fort en faveur de la necessite de δ³ : seules des garanties formelles peuvent compenser un alignement fondamentalement superficiel. |

### Impact sur les conjectures AEGIS

**Conjecture C1 (δ¹ seul insuffisant)** : **SUPPORT DIRECT**. Si l'alignement de base (δ⁰) est superficiel et que δ¹ s'appuie sur le meme mecanisme de generation auto-regressive, alors δ¹ herite de la vulnerabilite. Les attaques par pre-remplissage contournent simultanement δ⁰ et δ¹ puisque les premiers tokens sont imposes, sautant la fenetre ou le system prompt influence la generation. Les resultats quantitatifs (ASR >50% avec 10 tokens prefilles sur modele aligne) demontrent que le mecanisme de refus est fragile independamment de la presence d'un system prompt.

**Conjecture C3 (necessite de defenses multi-couches)** : **SUPPORT FONDAMENTAL**. C'est peut-etre la contribution la plus importante pour AEGIS : en demontrant que δ⁰ est structurellement superficiel, Qi et al. etablissent qu'une strategie de defense mono-couche est vouee a l'echec. La data augmentation et l'objectif contraint sont eux-memes des tentatives de deepener δ⁰ — mais l'article reconnait que meme ces ameliorations ne constituent pas une defense complete. Cela valide directement l'architecture multi-couches δ⁰-δ¹-δ²-δ³ d'AEGIS.

**Conjecture C2 (δ² bypassable)** : Support indirect. L'article ne traite pas δ² explicitement, mais la logique du raccourci s'applique : si un filtre syntaxique (δ²) ne detecte pas un payload parce qu'il est encode/obfusque, le modele retombe sur son alignement superficiel δ⁰, qui est contournable.

### Mapping sur les templates AEGIS

| Template | Lien avec P018 | Mecanisme exploite |
|----------|---------------|-------------------|
| **F23** (prefilling attack) | **DIRECT** — C'est exactement l'attaque par pre-remplissage formalisee en Section 2.3.1. P018 fournit le cadre theorique de pourquoi cette attaque fonctionne. |
| **F24** (adversarial suffix / GCG) | **DIRECT** — Les attaques par suffixe adversarial exploitent la meme superficialite en optimisant des tokens pour forcer un prefixe affirmatif ("Sure, here is..."). ASR GCG mesure dans P018. |
| **F44** (fine-tuning attack) | **DIRECT** — La Section 2.3.2 formalise pourquoi quelques gradient steps suffisent a desaligner : les normes de gradient sont maximales sur les premiers tokens, concentrant la perturbation exactement la ou l'alignement est actif. |
| **F45** (decoding parameter exploit) | **DIRECT** — Section 2.3.1, l'echantillonnage aleatoire avec temperature/top-k modifies peut devier les tokens de refus initiaux, contournant l'alignement superficiel. |
| **F46** (backdoor poisoning) | **DIRECT** — Table 3, l'objectif contraint reduit l'ASR de backdoor poisoning de 90.9% a 10.9%, demontrant que la protection des premiers tokens est une defense efficace. |

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P018 |
| **Titre** | Safety Alignment Should Be Made More Than Just a Few Tokens Deep |
| **Auteurs** | Qi, Panda, Lyu, Ma, Roy, Beirami, Mittal, Henderson |
| **Annee** | 2024 (publie), 2025 (ICLR) |
| **Venue** | ICLR 2025 — Outstanding Paper Award |
| **arXiv** | 2406.05946 |
| **Type** | Analyse mecanistique + defense |
| **Domaine principal** | Securite LLM / Alignement |
| **Domaines secondaires** | RLHF, fine-tuning, optimisation adversariale |
| **Modeles testes** | Llama-2-7B-Chat, Llama-2-7B (base), Gemma-7B-IT, Gemma-7B (base) |
| **Benchmark** | HEx-PHI (330 exemples, 11 categories), AdvBench, MaliciousInstruct, AlpacaEval |
| **Metrique principale** | Attack Success Rate (ASR), Harmfulness Rate |
| **N (evaluation)** | 330 (HEx-PHI), 100 (fine-tuning), 3 repetitions avec std |
| **Contribution formelle** | Objectif de fine-tuning contraint token-wise (Eq. 3), data augmentation safety recovery (Eq. 2) |
| **Delta-layers** | δ⁰ (central), δ¹ (indirect), δ³ (implicite) |
| **Conjectures AEGIS** | C1 (support direct), C3 (support fondamental), C2 (support indirect) |
| **Templates lies** | F23, F24, F44, F45, F46 |
| **Reproductibilite** | Elevee — code public, modeles publics, configurations detaillees |
| **Limitation principale** | Modeles 7B uniquement, pas de validation >70B ou proprietaire |
| **Niveau d'importance these** | **CRITIQUE** — Papier fondateur pour le cadre δ⁰ d'AEGIS |
| **Statut** | [ARTICLE VERIFIE] |
