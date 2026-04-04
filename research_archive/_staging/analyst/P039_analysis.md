# P039: GRP-Obliteration: Unaligning LLMs With a Single Unlabeled Prompt
**Authors**: Mark Russinovich et al. (Microsoft Research) | **Year**: 2026 | **Venue**: arXiv:2602.06258

## Resume FR (~500 mots)

Cette publication de Microsoft Research demontre une vulnerabilite fondamentale dans le paradigme d'alignement de securite des LLM : l'algorithme GRPO (Group Relative Policy Optimization), normalement utilise pour entrainer la securite, peut etre retourne pour desaligner completement un modele a partir d'un seul prompt non etiquete. La methode, nommee GRP-Obliteration (GRP-Oblit), exploite le mecanisme de scoring de recompense de GRPO pour renforcer les sorties violant les politiques de securite.

Le resultat le plus frappant est la variante GRP-Oblit-1, qui demontre qu'un seul prompt relativement benin — dans les experiences, la demande de creer un faux article pouvant causer la panique — suffit a desaligner 15 modeles de langage. Ce prompt unique ne mentionne ni violence, ni activites illegales, ni contenu explicite, mais l'entrainement sur cet unique exemple rend le modele plus permissif sur de nombreuses categories nocives jamais vues pendant l'entrainement. Cette generalisation est un resultat theoriquement significatif qui suggere que l'alignement de securite occupe une region fragile de l'espace des parametres.

Les 15 modeles testes couvrent la gamme 7-20B parametres et incluent des familles architecturales diverses : GPT-OSS (20B), DeepSeek-R1-Distill (variantes Llama-8B, Qwen-7B, Qwen-14B), Gemma, Llama, Ministral et Qwen, incluant des variantes instruct et raisonnement, ainsi que des architectures denses et mixture-of-experts (MoE). L'evaluation porte sur 5 benchmarks de securite et 6 benchmarks d'utilite.

GRP-Oblit et sa variante mono-prompt surpassent toutes les methodes anterieures sur les axes ASR et utilite simultanement, avec une coherence de resultats superieure. La preservation d'utilite est particulierement notable : contrairement aux methodes de jailbreak precedentes qui degradent les capacites du modele, GRP-Oblit maintient les performances sur les taches benignes tout en eliminant les garde-fous de securite.

Un resultat supplementaire remarquable est la generalisation aux modeles de diffusion text-to-image. GRP-Oblit peut desaligner des systemes de generation d'images, ouvrant un vecteur multimodal d'attaque. Cette transversalite suggere que la vulnerabilite n'est pas specifique aux LLM mais est inherente au paradigme d'entrainement par optimisation de politique relative.

Pour la these AEGIS, GRP-Obliteration est un resultat devastateur pour l'argument en faveur de delta-0 comme defense suffisante. Si l'alignement de securite peut etre annule par un unique prompt d'entrainement sans etiquette de nocivite, alors la couche delta-0 (alignement RLHF) est fondamentalement fragile. Ce resultat renforce C2 (necessite delta-3) de maniere plus forte que tout article precedent dans le corpus : il ne s'agit plus de contourner l'alignement (jailbreak), mais de l'effacer completement (unalignment).

La publication par Microsoft Research — le meme laboratoire qui developpe les modeles GPT — confere une credibilite exceptionnelle et signale une transparence rare sur les vulnerabilites de ses propres produits.

## Formulas & Theorems

| Formule | Description |
|---------|-------------|
| GRPO : L(theta) = E[sum_i (r(y_i) - mean(r)) / std(r) * log p_theta(y_i)] | Group Relative Policy Optimization — l'objectif d'entrainement exploite par GRP-Oblit |
| GRP-Oblit : optimise L(theta) avec des generations violant la politique de securite, le scoring de recompense renforce les violations | Inversion de l'objectif de securite |
| GRP-Oblit-1 : meme objectif, mais avec un seul prompt d'entrainement | Variante single-shot demontrant la fragilite de l'alignement |
| Preservation d'utilite : performance sur 6 benchmarks d'utilite maintenue post-desalignement | Mesure que les capacites generales du modele ne sont pas degradees |

## Glossaire Preliminaire
| Terme | Explication simple |
|-------|-------------------|
| GRPO | Group Relative Policy Optimization — algorithme d'entrainement par renforcement pour les LLM |
| Unalignment | Suppression deliberee de l'alignement de securite d'un modele, contrairement au jailbreak qui contourne sans supprimer |
| Single-prompt attack | Attaque necessitant un seul exemple pour desaligner completement le modele |
| Reward hacking | Exploitation du mecanisme de recompense pour renforcer des comportements non desires |
| Policy-violating outputs | Sorties generees qui violent les politiques de securite du modele |
| MoE (Mixture of Experts) | Architecture de modele ou differents "experts" sont actives selon l'entree |

## Research Paths (Gaps identifies)
1. Les modeles testes sont dans la gamme 7-20B — la vulnerabilite des modeles plus grands (>100B) reste a verifier
2. La defense proposee (adversarial training) est mentionnee mais non evaluee en profondeur
3. L'interaction avec les defenses multi-couches (delta-1, delta-2) n'est pas etudiee — un modele desaligne est-il encore protege par un prompt systeme fort ?
4. Pas d'evaluation en contexte medical — un modele desaligne par GRP-Oblit pourrait-il donner des recommandations medicales dangereuses ?
5. La persistance du desalignement apres fine-tuning correctif n'est pas mesuree

## delta-Layer Tags
- [x] delta-0 (RLHF alignment) — cible directe : demontre que l'alignement RLHF/GRPO est effacable par un seul prompt
- [ ] delta-1 (System prompt) — non traite (mais pertinent : un modele desaligne ignore-t-il aussi le prompt systeme ?)
- [ ] delta-2 (Syntax filtering) — non traite
- [ ] delta-3 (Formal verification) — non traite, mais le resultat renforce massivement l'argument pour delta-3

## Conjecture Links
- **C1 (Insuffisance delta-1)**: **Oui (indirect)** — Si delta-0 est completement eliminable, les defenses qui en dependent (delta-1) sont egalement compromises
- **C2 (Necessite delta-3)**: **Oui (tres fort)** — Le resultat le plus fort du corpus pour C2 : l'alignement est non seulement contournable mais effacable, rendant les approches empiriques fondamentalement insuffisantes
- **C3 (Shallow alignment)**: **Oui** — Resultat definitif : l'alignement est si superficiel qu'un seul prompt suffit a l'effacer
- **C4 (Scaling independence)**: **Oui** — 15 modeles de differentes tailles et architectures sont tous vulnerables
- **C5 (Cross-layer interaction)**: **Non traite**
- **C6 (Medical specificity)**: **Non traite directement**
