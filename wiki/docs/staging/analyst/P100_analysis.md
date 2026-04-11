# P100 — Analyse doctorale

## [Ren, Li, Liu, Xie, Lu, Qiao, Sha, Yan, Ma & Shao, 2025] — LLMs Know Their Vulnerabilities: Uncover Safety Gaps through Natural Distribution Shifts

**Reference :** arXiv:2410.10700
**Revue/Conf :** ACL 2025 Main Conference, pages 7837+
**Lu le :** 2026-04-07
> **PDF Source**: [literature_for_rag/P_MSBE_2410.10700.pdf](../../assets/pdfs/P_MSBE_2410.10700.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (81 chunks)

### Abstract original
> Safety alignment of large language models (LLMs) can be compromised through jailbreak attacks but existing methods often rely on malicious distribution shifts in attack prompts, where seemingly benign prompts, semantically related to harmful content, can bypass safety mechanisms. To explore this issue, the authors introduce ActorBreaker, which identifies actors related to toxic prompts within pre-training distribution to craft multi-turn prompts that gradually lead LLMs to reveal unsafe content. ActorBreaker is grounded in Latour's actor-network theory and explores the broader semantic space of toxic content. The authors construct a multi-turn safety dataset using ActorBreaker. Fine-tuning models on this dataset shows significant improvements in robustness, though with some trade-offs in utility.
> — Source : PDF page 1 (paraphrase de l'abstract)

### Resume (5 lignes)
- **Probleme :** Les methodes de jailbreak existantes reposent sur des distributions malicieuses (prompts adversariaux), mais les LLMs sont egalement vulnerables a des shifts de distribution naturels : des prompts benins, semantiquement lies au contenu toxique, qui existent dans la distribution de pre-entrainement (Ren et al., 2025, Section 1, p. 1).
- **Methode :** ActorBreaker construit un reseau d'acteurs (humains et non-humains) base sur la theorie de l'acteur-reseau de Latour (1987), identifiant 6 types d'acteurs (Creation, Execution, Distribution, Reception, Facilitation, Regulation). Chaque acteur sert d'indice d'attaque pour generer des chaines multi-tour via self-talk, avec modification dynamique optionnelle (Figure 2-3, Section 3, p. 3-5).
- **Donnees :** HarmBench (200 comportements nuisibles), 6 modeles cibles : GPT-3.5, GPT-4o, GPT-o1, Claude-3.5, LLaMA-3-8B-IT, LLaMA-3-70B-IT (Section 4.1, p. 6).
- **Resultat :** ASR moyen de 81.2% avec modification dynamique, surpassant CoA (43.7%), Crescendo (51.8%), PAIR (22.95%) ; plus significatif, 60.0% sur GPT-o1 (le seul modele de raisonnement teste) vs 14.0% max pour les baselines (Table 1, p. 6).
- **Limite :** Focus exclusivement anglais sans consideration multilingue ; juge GPT-4o (Section 4.1, p. 6) ; trade-off helpfulness/safety pour la defense par fine-tuning (Section 6, p. 8).

### Analyse critique

**Forces :**
1. **Fondement theorique original** dans la sociologie des sciences (Latour, 1987). La theorie de l'acteur-reseau fournit un cadre systematique pour explorer l'espace semantique du contenu toxique, en identifiant les acteurs humains et non-humains qui participent au lifecycle du contenu nuisible (Figure 2, Section 3.1, p. 3-4). C'est la premiere application de la sociologie des sciences a la securite des LLM.
2. **Prompts dans la distribution naturelle** : les prompts generes sont demonstrablement benins selon Llama-Guard 2 (Figure 5, p. 7), avec une toxicite significativement inferieure a celle de Crescendo ou des prompts originaux. Cela rend la detection par filtres de contenu beaucoup plus difficile.
3. **Diversite superieure** aux baselines (Section 4.2, p. 7) : les prompts generes via les 6 categories d'acteurs sont plus divers que ceux de CoA et Crescendo (qui collapsent vers des patterns fixes), mesuree par similarite BERT inter-trials.
4. **Transferabilite sans modification dynamique** : ASR moyen de 72.7% sans DM (Table 4, p. 7), demontrant que les prompts sont intrinsequement transferables cross-modele, contrairement a CoA/Crescendo qui dependent des reponses du modele cible.
5. **Defense proposee** : fine-tuning avec Circuit Breaker sur des donnees multi-tour generees par ActorBreaker reduit l'ASR a 14% (CB + multi-turn data, Table 8, p. 8), surpassant le SFT simple et les perturbations semantiques.

**Faiblesses :**
1. **GPT-o1 a 60% ASR** est un resultat remarquable mais insuffisamment analyse. Les auteurs observent un "comportement conflictuel" dans le CoT de o1 (le modele note ses preoccupations de securite puis genere quand meme du contenu nuisible) sans explorer ce mecanisme en profondeur (Section 4.2, p. 7).
2. **Juge GPT-4o** sans validation humaine sur l'ensemble complet. Seule la reference a Qi et al. (2023) justifie la fiabilite du juge, mais les biais connus des juges LLM ne sont pas adresses.
3. **5 tours maximum** par attaque multi-tour (Section 4.1, p. 6), ce qui limite l'exploration de l'erosion progressive sur des conversations plus longues. P097/STAR utilise 7 tours et P099/Crescendo va jusqu'a 10.
4. **Pas d'analyse mecaniste** des representations internes (contrairement a P097/STAR qui analyse la direction de refus et les trajectoires latentes).

**Questions ouvertes :**
- Comment les 6 categories d'acteurs interagissent-elles avec les couches delta AEGIS ?
- L'approche actor-network pourrait-elle etre etendue a des contextes medicaux (acteurs : chirurgien, FDA, fabricant de dispositif, patient) ?
- Le trade-off helpfulness/safety du fine-tuning defensif est-il acceptable en contexte medical ?

### Formules exactes

**Eq. — Generation de requetes multi-tour (self-talk) :**
q1 ~ p(q1|s; theta) pour la premiere requete
qi ~ p(qi|s, q1, r1, ..., qi-1, ri-1; theta) pour les suivantes
ou s = [x, ci, z1...n] est le contexte (cible toxique + indice d'attaque + chaine)
(Section 3.2, p. 4-5)

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) — non utilise explicitement)

### Pertinence these AEGIS

- **Couches delta :** δ¹ (reformulation en prompts benins via acteurs — couche linguistique), δ² (exploitation des relations semantiques pre-entrainement — couche cognitive)
- **Conjectures :** C1 (fragilite de l'alignement) **fortement supportee** — la vulnerabilite aux shifts de distribution naturels montre que l'alignement ne couvre pas l'espace semantique complet ; C4 (gap pre-entrainement/alignement) **directement supportee** — ActorBreaker exploite exactement le decalage entre donnees de pre-entrainement (vastes) et donnees d'alignement (limitees)
- **Decouvertes :** D-003 (erosion progressive) **confirmee** — l'escalade multi-tour via acteurs est un MSBE semantiquement guide ; D-012 (diversite des vecteurs d'attaque) **renforcee** — les 6 categories d'acteurs multiplient les surfaces d'attaque
- **Gaps :** RR-FICHE-001 (MSBE) **adresse** — ActorBreaker montre que le MSBE peut etre drive par la structure semantique du contenu toxique, pas seulement par l'escalade conversationnelle. Gap potentiel : application au domaine medical avec acteurs specifiques.
- **Mapping templates AEGIS :** #48 (solo multi-persona), #03 (FDA social engineering — les acteurs de type "Regulation" sont des analogues), #52 (unwitting user delivery)

### Citations cles
> "How robust are aligned LLMs to natural distribution shifts, that is, benign prompts that are semantically related to toxic content?" (Section 1, p. 1)
> "Our attack prompts are significantly more robust against GPT-o1 with strong reasoning capabilities: 60.0% for our method while 14.0% is the highest ASR among other baselines." (Section 4.2, p. 7)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — code disponible (GitHub: AI45Lab/ActorAttack), HarmBench public |
| Code disponible | Oui (https://github.com/AI45Lab/ActorAttack) |
| Dataset public | HarmBench (public) |
