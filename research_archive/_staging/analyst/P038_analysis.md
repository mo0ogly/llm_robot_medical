# P038: Know Thy Enemy: Securing LLMs Against Prompt Injection via Diverse Data Synthesis and Instruction-Level Chain-of-Thought Learning
**Authors**: Unknown et al. | **Year**: 2026 | **Venue**: arXiv:2601.04666

## Resume FR (~500 mots)

Cette publication propose InstruCoT, une methode de defense en trois phases combinant la synthese de donnees diversifiees d'injection de prompt avec un fine-tuning par chaine de pensee au niveau des instructions (instruction-level chain-of-thought). L'objectif est de permettre aux LLM d'identifier et de rejeter efficacement les instructions malveillantes, independamment de leur source ou de leur position dans le contexte.

La premiere phase consiste en la synthese de donnees diversifiees. Les auteurs construisent un jeu de donnees d'entrainement couvrant systematiquement trois dimensions de diversite : les types de contenu d'injection (deviation comportementale, fuite de donnees privees, sortie nocive), les positions d'injection dans le contexte (debut, milieu, fin), et les strategies d'injection (directe, indirecte, encodee). Cette couverture tridimensionnelle vise a generaliser la defense au-dela des attaques vues pendant l'entrainement.

La deuxieme phase introduit le mecanisme de chaine de pensee au niveau des instructions (instruction-level CoT). Contrairement au CoT classique qui raisonne sur la tache, l'instruction-level CoT guide le modele pour raisonner explicitement sur la nature des instructions recues : sont-elles legitimes ou malveillantes ? Cette meta-cognition sur les instructions est une approche originale qui transforme la detection d'injection en un probleme de raisonnement plutot qu'un probleme de classification pattern-matching.

La troisieme phase utilise des strategies de post-entrainement (post-training) pour internaliser cette capacite de raisonnement defensif. Les auteurs explorent le fine-tuning supervise (SFT) et potentiellement l'alignement par preference (DPO) pour integrer le raisonnement instruction-level dans le comportement par defaut du modele.

Les resultats experimentaux sont prometteurs : evalue sur quatre LLM open-source (Llama3.1-8B, Llama3-8B, Qwen2.5-7B, Qwen3-8B), InstruCoT atteint des taux de defense moyens de 92.5% pour la deviation comportementale, 98.0% pour la fuite de donnees privees, et 90.9% pour les sorties nocives. Ces resultats surpassent les baselines de 25.8%-82.5% pour la deviation comportementale, 6.7%-47.2% pour la fuite de donnees, et 7.4%-34.5% pour les sorties nocives. Crucially, l'alignement de securite au niveau des instructions ne degrade pas les performances d'utilite du modele par rapport aux baselines.

Pour la these AEGIS, InstruCoT est pertinent a deux niveaux. D'abord, il represente une defense delta-0 avancee qui va au-dela du simple RLHF en ajoutant une couche de raisonnement metacognitif. Ensuite, la preservation d'utilite distingue InstruCoT du dilemme separation-utilite observe dans P024 (Sep(M) : fine-tuning augmente la separation de 37.5% a 81.8% mais effondre l'utilite de 67.8% a 19.2%). InstruCoT semble resoudre partiellement ce trade-off.

Cependant, l'evaluation est limitee aux modeles 7-8B et aux attaques statiques. La robustesse face aux attaques adaptatives (comme celles de P036, 97.14% ASR) et aux modeles plus grands reste a demontrer. De plus, l'absence d'evaluation medicale empeche une comparaison directe avec les metriques AEGIS.

## Formulas & Theorems

| Formule | Description |
|---------|-------------|
| DR_BD = 1 - ASR_behavioral_deviation | Defense Rate pour la deviation comportementale (92.5% moyen) |
| DR_PL = 1 - ASR_privacy_leakage | Defense Rate pour la fuite de donnees privees (98.0% moyen) |
| DR_HO = 1 - ASR_harmful_output | Defense Rate pour les sorties nocives (90.9% moyen) |
| CoT_instr : raisonnement explicite sur la legitimite de l'instruction | Chain-of-thought au niveau instruction (qualitatif, pas formalise mathematiquement) |

## Glossaire Preliminaire
| Terme | Explication simple |
|-------|-------------------|
| InstruCoT | Instruction-level Chain-of-Thought — methode de defense par raisonnement metacognitif sur les instructions |
| Behavioral deviation | Type d'attaque ou le modele devie de son comportement prevu (ex: ignorer le prompt systeme) |
| Privacy leakage | Type d'attaque visant a extraire des donnees privees (prompt systeme, donnees utilisateur) |
| Harmful output | Type d'attaque visant a faire generer du contenu nocif au modele |
| Instruction-level reasoning | Raisonnement explicite du modele sur la nature (legitime/malveillante) des instructions recues |
| Diverse data synthesis | Construction systematique de donnees d'entrainement couvrant types, positions et strategies d'injection |

## Research Paths (Gaps identifies)
1. Evaluation limitee aux modeles 7-8B — scalabilite aux modeles plus grands non demontree
2. Attaques statiques seulement — pas de test contre des attaquants adaptatifs (P036)
3. Pas d'evaluation en contexte medical — comparaison avec CHER (P035) necessaire
4. Le CoT instruction-level ajoute de la latence — impact sur les applications temps reel non mesure
5. La robustesse a long terme n'est pas evaluee — P030 montre que les defenses se degradent dans le temps

## delta-Layer Tags
- [x] delta-0 (RLHF alignment) — la methode est une amelioration du post-entrainement d'alignement
- [ ] delta-1 (System prompt) — non traite directement
- [ ] delta-2 (Syntax filtering) — non traite
- [ ] delta-3 (Formal verification) — non traite

## Conjecture Links
- **C1 (Insuffisance delta-1)**: **Oui (indirect)** — InstruCoT opere au niveau delta-0 precisement parce que delta-1 est insuffisant
- **C2 (Necessite delta-3)**: **Non** — Les auteurs proposent une solution empirique (delta-0 ameliore) sans arguer pour delta-3
- **C3 (Shallow alignment)**: **Oui** — InstruCoT tente de remedier a la superficialite de l'alignement RLHF en ajoutant un raisonnement explicite
- **C4 (Scaling independence)**: **Non traite** — evaluation sur une seule taille de modele
- **C5 (Cross-layer interaction)**: **Non traite**
- **C6 (Medical specificity)**: **Non traite**
