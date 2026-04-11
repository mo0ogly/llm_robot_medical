# P022 : LLM Misalignment via Adversarial RLHF Platforms

## [Entezami & Naseh, 2025] -- LLM Misalignment via Adversarial RLHF Platforms

**Reference :** arXiv:2503.03039v1
**Revue/Conf :** Preprint, University of Massachusetts Amherst, 2025
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P022_2503.03039.pdf](../../assets/pdfs/P022_2503.03039.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (71 chunks)

### Abstract original
> Reinforcement learning has shown remarkable performance in aligning language models with human preferences, leading to the rise of attention towards developing RLHF platforms. These platforms enable users to fine-tune models without requiring any expertise in developing complex machine learning algorithms. While these platforms offer useful features such as reward modeling and RLHF fine-tuning, their security and reliability remain largely unexplored. Given the growing adoption of RLHF and open-source RLHF frameworks, we investigate the trustworthiness of these systems and their potential impact on behavior of LLMs. In this paper, we present an attack targeting publicly available RLHF tools. In our proposed attack, an adversarial RLHF platform corrupts the LLM alignment process by selectively manipulating data samples in the preference dataset. In this scenario, when a user's task aligns with the attacker's objective, the platform manipulates a subset of the preference dataset that contains samples related to the attacker's target. This manipulation results in a corrupted reward model, which ultimately leads to the misalignment of the language model.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les plateformes RLHF open-source (TRL 8M+ telechargements, OpenRLHF 24K+) constituent une surface d'attaque inexploree ou l'operateur peut corrompre le processus d'alignement (Section 1, p.1-2)
- **Methode :** Attaque par label-flipping cible : un classifieur DistilBERT (accuracy 93%, F1 83%) identifie les echantillons lies a l'objectif de l'attaquant dans le dataset de preferences, puis inverse les labels chosen/rejected (Eq. 8-9, Section 4.1-4.2, p.5-6)
- **Donnees :** HH-RLHF dataset (Bai et al., 2022), 6192 preferences dont 25% contenant du discours haineux ; RM : DistilBERT et GPT-2 ; LLM cibles : GPT-2 small/medium/large (Section 5.1, p.7)
- **Resultat :** La precision du RM chute de 65.74% (clean) a 59.08% (100% attaque) pour DistilBERT (Table 1, p.7) ; les distributions de recompense sont significativement deplacees vers des scores plus eleves pour le contenu cible (Figures 2-3, p.7) ; meme 25% de corruption suffit a alterer le comportement du modele (Section 5.3, p.8)
- **Limite :** Modeles petits uniquement (GPT-2, DistilBERT) -- scalabilite aux LLM de pointe non demontree ; scenario de menace specifique aux plateformes tierces (Section 7, p.10)

### Analyse critique
**Forces :**
- Premier travail a identifier les plateformes RLHF comme vecteur d'attaque supply-chain (Section 1, p.2)
- Attaque furtive : la degradation est selectivement ciblee, preservant les performances globales sur les taches non ciblees (Section 5.2-5.3, p.7-8)
- Formalisation complete du MDP pour RLHF avec equations de la politique optimale corrompue pi*- (Eq. 4-7, Section 3, p.4-5)
- Scenario d'attaque realiste : l'attaquant n'a besoin que du controle de la plateforme, pas d'acces direct aux poids du modele (Entezami & Naseh, 2025, Section 4, Threat Model, p.5)

**Faiblesses :**
- Modeles cibles trop petits : GPT-2 (117M-762M) n'est pas representatif des LLM modernes (7B+) (Entezami & Naseh, 2025, Section 5.1, p.7 : seuls GPT-2 small/medium/large testes)
- Le classifieur de detection Theta atteint seulement 83% F1 -- les faux positifs/negatifs affectent la precision du ciblage
- Pas de comparaison avec les defenses existantes (ex. data auditing, spectral signatures)
- Evaluation limitee a un seul type de contenu cible (discours haineux) -- transferabilite a d'autres domaines (medical, financier) non evaluee
- Le fine-tuning PPO est effectue pour un seul epoch -- effets sur des entrainements plus longs non etudies
- N relativement petit pour les evaluations de distribution (1284 echantillons, Section 5.2, p.7)

**Questions ouvertes :**
- Les defenses par audit des donnees de preference (data provenance, spectral analysis) peuvent-elles detecter cette attaque ?
- Comment cette attaque se generalise-t-elle aux methodes d'alignement non-PPO (DPO, GRPO) ?

### Formules exactes

**Eq. 1-3 -- Modele Bradley-Terry** (Section 3, p.4) :
`P(o > o'|c) = sigma(R(c,o) - R(c,o'))`

**Eq. 4 -- Recompense avec penalite KL** (Section 3, p.5) :
`R_phi(c,o) = R(c,o) - beta * D_KL(pi(o|c) || pi_ref(o_ref|c))`

**Eq. 8-9 -- Identification des cibles** (Section 4.1, p.5-6) :
`Theta(x) = 1 si x lie au sujet cible, 0 sinon`
`D_target = {x in D_pref | Theta(x) = 1}`

**Algorithme 1 -- Pipeline complet** (Section 4.2, p.6) :
1. Identifier D_target via Theta
2. Random-select n echantillons
3. Label-flip : (o > o') -> (o < o')
4. Entrainer RM- sur D-_pref
5. RLHF avec RM- -> pi*-

Lien glossaire AEGIS : F01 (RLHF loss), F22 (ASR)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (attaque directe -- corruption du processus d'alignement) ; δ¹ non traite ; δ² non pertinent (attaque au training-time) ; δ³ potentiellement efficace si les validateurs de sortie detectent le desalignement
- **Conjectures :**
  - C1 (insuffisance δ¹) : neutre -- l'attaque est au niveau training, pas inference
  - C2 (necessite δ³) : **supportee** -- la corruption furtive du pipeline plaide pour une verification formelle de l'integrite
- **Decouvertes :**
  - D-003 (fragilite alignment) : **confirmee** -- δ⁰ peut etre corrompu a la source
  - D-008 (supply-chain risk) : **confirmee** -- les plateformes RLHF sont un maillon faible
- **Gaps :**
  - G-001 (evaluation medicale) : **non adresse** -- pas de test medical
  - G-012 (defense supply-chain) : **cree** -- aucune defense proposee
  - G-019 (scalabilite) : **non adresse** -- modeles trop petits
- **Mapping templates AEGIS :** pertinent pour les chaines d'attaque `feedback_poisoning` (95% similarite)

### Citations cles
> "an adversarial RLHF platform corrupts the LLM alignment process by selectively manipulating data samples in the preference dataset" (Abstract, p.1)
> "even manipulating 25% of the targeted samples significantly alters the model's behavior" (Section 5.3, p.8)
> "the poisoned reward models are more inclined to encourage such samples" (Section 5.2, p.8)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Moyenne -- dataset public (HH-RLHF), mais code non fourni |
| Code disponible | Non |
| Dataset public | Oui -- HH-RLHF (Anthropic), ToxiGen |
| Nature epistemique | [EMPIRIQUE] -- demonstration d'attaque sans garantie theorique sur les bornes de corruption |
