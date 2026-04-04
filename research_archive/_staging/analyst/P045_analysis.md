# P045: System Prompt Poisoning: Persistent Attacks on Large Language Models Beyond User Injection
**Authors**: Zongze Li, Jiawei Guo, Haipeng Cai | **Year**: 2025 | **Venue**: arXiv:2505.06493 (under review ICLR 2026)

## Resume FR (~500 mots)

Cette publication definit et formalise un nouveau vecteur d'attaque : le System Prompt Poisoning (SPP), une forme persistante d'attaque ciblant les prompts systeme globaux plutot que les prompts utilisateur ephemeres. Contrairement a l'injection de prompt classique qui agit sur une seule interaction, le SPP empoisonne le prompt systeme partage par tous les utilisateurs, affectant ainsi de maniere persistante toutes les interactions subsequentes avec le modele.

La contribution principale est le cadre Auto-SPP, qui automatise l'empoisonnement des prompts systeme via trois strategies d'attaque. La premiere, le brute-force poisoning, explore systematiquement l'espace des modifications du prompt systeme. La deuxieme, l'adaptive in-context poisoning, adapte les modifications en fonction des reponses du modele aux prompts empoisonnes. La troisieme, l'adaptive chain-of-thought poisoning, utilise le raisonnement en chaine pour concevoir des modifications plus subtiles et efficaces.

Les resultats experimentaux revelent plusieurs proprietes alarmantes du SPP. Premierement, l'attaque est hautement realisable sans necessiter de techniques de jailbreak — un simple ajout ou modification du prompt systeme suffit. Deuxiemement, elle est efficace sur une large gamme de taches : mathematiques, codage, raisonnement logique et traitement du langage naturel. Troisiemement, l'attaque persiste a travers de longues conversations, ne se dissipant pas au fil des echanges. Quatriemement, elle reste efficace meme lorsque les prompts utilisateur emploient des techniques de prompting avancees comme le chain-of-thought (CoT).

La decouverte la plus preoccupante est l'inefficacite des defenses existantes en boite noire contre le SPP. Les mecanismes de detection d'injection classiques sont conçus pour detecter les anomalies dans les prompts utilisateur, pas dans les prompts systeme qui sont supposes etre de confiance. Cette hypothese de confiance dans le prompt systeme est une faille architecturale fondamentale que le SPP exploite directement.

Pour la these AEGIS, le SPP est directement pertinent car il cible la couche delta-1. Si le prompt systeme lui-meme est compromis, toutes les defenses qui en dependent (garde-fous par instruction, separation des roles, consignes de securite) sont neutralisees. Cela represente une escalade par rapport aux attaques d'injection classiques : au lieu de contourner le prompt systeme, on l'empoisonne a la source.

Le vecteur SPP est particulierement dangereux dans les deploiements multi-utilisateurs (hopitaux, plateformes de telesante) ou un prompt systeme empoisonne affecterait tous les patients simultanement. Ce scenario de "supply chain attack" sur le prompt systeme n'est couvert par aucun des 48 scenarios AEGIS actuels, suggerant l'ajout d'une nouvelle categorie de scenarios.

L'article est en revision pour ICLR 2026, l'une des conferences les plus selectivement cotees en apprentissage automatique, ce qui augure d'une validation par les pairs rigoureuse.

## Formulas & Theorems

| Formule | Description |
|---------|-------------|
| SPP_persistence = efficacite_attaque(tour_N) / efficacite_attaque(tour_1) ≈ 1 | L'efficacite de l'empoisonnement ne decroit pas au fil de la conversation |
| ASR_SPP = taux de reussite de l'empoisonnement sur les taches cibles | Attack Success Rate specifique au SPP |
| Auto-SPP : framework automatisant les trois strategies d'empoisonnement | Automatisation de l'attaque |
| Persistance inter-sessions : SPP affecte tous les utilisateurs partageant le prompt systeme | Propriete de propagation de l'attaque |

## Glossaire Preliminaire
| Terme | Explication simple |
|-------|-------------------|
| System Prompt Poisoning (SPP) | Attaque empoisonnant le prompt systeme global plutot que les prompts utilisateur individuels |
| Auto-SPP | Framework automatisant la generation de prompts systeme empoisonnes via trois strategies |
| Brute-force poisoning | Strategie explorant systematiquement les modifications possibles du prompt systeme |
| Adaptive in-context poisoning | Strategie adaptant les modifications en fonction des reponses du modele |
| Adaptive CoT poisoning | Strategie utilisant le raisonnement en chaine pour concevoir des empoisonnements subtils |
| Persistent attack | Attaque dont l'effet perdure au-dela de l'interaction initiale, affectant toutes les interactions futures |

## Research Paths (Gaps identifies)
1. Pas de defense efficace proposee — l'article documente le probleme sans solution
2. La detection de prompts systeme empoisonnes necessite des mecanismes d'integrite non explores (verification de hash, signature cryptographique)
3. L'interaction entre SPP et les attaques de desalignement (P039) n'est pas etudiee — un prompt systeme empoisonne pourrait-il declencher un GRP-Obliteration ?
4. Pas d'evaluation en contexte medical — le scenario de prompt systeme empoisonne dans un hopital n'est pas etudie
5. La detection de SPP adaptatif (CoT) est particulierement difficile car les modifications sont semantiquement coherentes

## delta-Layer Tags
- [ ] delta-0 (RLHF alignment) — l'alignement de base ne protege pas contre le SPP
- [x] delta-1 (System prompt) — cible directe : le prompt systeme est le vecteur d'attaque
- [ ] delta-2 (Syntax filtering) — les filtres ne detectent pas l'empoisonnement du prompt systeme
- [ ] delta-3 (Formal verification) — non traite, mais la necessite de verification d'integrite du prompt systeme est implicite

## Conjecture Links
- **C1 (Insuffisance delta-1)**: **Oui (tres fort)** — Resultat le plus devastateur pour delta-1 : le prompt systeme lui-meme est le vecteur d'attaque
- **C2 (Necessite delta-3)**: **Oui** — La verification d'integrite du prompt systeme requiert des mecanismes formels (hash, signature)
- **C3 (Shallow alignment)**: **Oui (indirect)** — L'alignement ne detecte pas les modifications subtiles du prompt systeme
- **C4 (Scaling independence)**: **Non traite explicitement** — mais l'attaque est efficace sur une "large gamme" de modeles
- **C5 (Cross-layer interaction)**: **Oui** — Le SPP montre que la compromission de delta-1 neutralise les defenses qui en dependent
- **C6 (Medical specificity)**: **Non traite directement** — mais les implications pour les systemes medicaux multi-utilisateurs sont critiques
