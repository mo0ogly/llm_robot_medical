# P046: Adversary-Aware DPO: Enhancing Safety Alignment in Vision Language Models via Adversarial Training
**Authors**: Fenghua Weng, Jian Lou, Jun Feng, Minlie Huang, Wenjie Wang | **Year**: 2025 | **Venue**: arXiv:2502.11455 / EMNLP 2025 Findings

## Resume FR (~500 mots)

Cette publication propose ADPO (Adversary-Aware DPO), la premiere methode integrant l'entrainement adversarial dans l'alignement de securite des modeles vision-langage (VLM) via l'optimisation directe de preference (DPO). L'article adresse une limitation specifique des VLM : contrairement aux LLM textuels, l'alignement de securite des VLM est souvent realise par un fine-tuning de securite post-hoc, une approche insuffisante face aux attaques en boite blanche qui exploitent la modalite visuelle.

ADPO introduit deux composantes techniques innovantes. La premiere est un modele de reference entraine adversarialement qui genere des reponses preferees par les humains sous des perturbations worst-case. Ce modele de reference sert d'ancrage pour le processus DPO : il definit ce que devrait etre une reponse "securisee" meme dans les conditions les plus defavorables. La deuxieme composante est une perte DPO consciente de l'adversaire (adversarial-aware DPO loss) qui genere des paires gagnant-perdant en tenant compte des distorsions adversariales dans l'espace de l'image et de l'espace latent via des perturbations PGD (Projected Gradient Descent).

La methodologie PGD est un classique de la robustesse adversariale en vision par ordinateur, ici transpose au contexte VLM. Les perturbations sont appliquees a deux niveaux : dans l'espace des pixels de l'image d'entree et dans l'espace latent des representations internes. Cette double perturbation vise a couvrir un spectre plus large de vecteurs d'attaque visuels.

Les experiences sont menees principalement sur les modeles LLaVA et demontrent que ADPO atteint le plus faible taux de reussite d'attaque (ASR) contre presque toutes les attaques de jailbreak testees, tout en preservant l'utilite du modele sur les taches normales (benchmark Visual Question Answering). Ce resultat de preservation d'utilite distingue ADPO des defenses qui degradent les performances generales.

Pour la these AEGIS, ADPO est pertinent car les systemes medicaux integrent de plus en plus des donnees visuelles. Le composant CameraHUD d'AEGIS, qui traite les flux video des cameras chirurgicales, pourrait beneficier d'une defense inspiree d'ADPO pour se premunir contre les attaques adversariales sur les images medicales. Un attaquant pourrait inserer des perturbations imperceptibles dans les images de cameras chirurgicales pour manipuler les recommandations du systeme d'IA — un scenario catastrophique en contexte operatoire.

L'integration de l'entrainement adversarial dans DPO represente une avancee de la couche delta-0 specifique aux VLM. La methode ne se contente pas d'aligner le modele sur des preferences statiques, mais l'entraine explicitement a resister aux pires perturbations possibles. C'est une approche fondamentalement plus robuste que le fine-tuning de securite post-hoc.

Cependant, ADPO est limite aux attaques en boite blanche (necessite d'acces aux gradients pour PGD), et sa robustesse face aux attaques en boite noire ou aux nouvelles techniques comme GRP-Obliteration (P039) appliquees aux VLM reste a evaluer. De plus, l'evaluation est limitee aux modeles LLaVA — la generalisation a d'autres VLM medicaux n'est pas demontree.

## Formulas & Theorems

| Formule | Description |
|---------|-------------|
| L_ADPO = -E[log sigma(beta * (log p_theta(y_w\|x_adv) / p_ref_adv(y_w\|x_adv) - log p_theta(y_l\|x_adv) / p_ref_adv(y_l\|x_adv)))] | Perte DPO consciente de l'adversaire — adapte le DPO classique avec des entrees adversariales |
| x_adv = x + delta, delta = argmax_{\|\|delta\|\|_p <= epsilon} L(theta, x + delta) | Perturbation PGD dans l'espace des pixels |
| z_adv = z + eta, eta = argmax_{\|\|eta\|\|_p <= epsilon} L(theta, z + eta) | Perturbation PGD dans l'espace latent |
| p_ref_adv = modele de reference entraine avec des exemples adversariaux | Modele d'ancrage pour le DPO sous perturbation |

## Glossaire Preliminaire
| Terme | Explication simple |
|-------|-------------------|
| ADPO | Adversary-Aware DPO — alignement de securite integrant l'entrainement adversarial pour les VLM |
| DPO (Direct Preference Optimization) | Methode d'alignement par optimisation directe des preferences humaines sans modele de recompense explicite |
| PGD (Projected Gradient Descent) | Algorithme iteratif de generation de perturbations adversariales sous contrainte de norme |
| VLM (Vision-Language Model) | Modele multimodal traitant conjointement images et texte |
| Adversarial-aware loss | Fonction de perte qui tient compte des perturbations adversariales pendant l'entrainement |
| Winner-loser pairs | Paires de reponses (preferable vs non-preferable) utilisees pour le DPO |
| Latent space perturbation | Perturbation appliquee dans l'espace des representations internes du modele |

## Research Paths (Gaps identifies)
1. Limite aux attaques en boite blanche — robustesse en boite noire non demontree
2. Evaluation limitee aux modeles LLaVA — generalisation aux VLM medicaux necessaire
3. L'interaction avec les attaques textuelles (injection de prompt) n'est pas etudiee — un attaquant pourrait combiner perturbation visuelle et injection textuelle
4. Le cout computationnel du PGD pendant l'entrainement n'est pas analyse en detail
5. La generalisation de GRP-Obliteration (P039) aux VLM pourrait annuler les benefices d'ADPO

## delta-Layer Tags
- [x] delta-0 (RLHF alignment) — ADPO est une amelioration de l'alignement par preference
- [ ] delta-1 (System prompt) — non traite
- [ ] delta-2 (Syntax filtering) — non traite
- [ ] delta-3 (Formal verification) — non traite, mais les garanties PGD sous norme epsilon s'approchent de garanties formelles

## Conjecture Links
- **C1 (Insuffisance delta-1)**: **Non traite** — L'article ne concerne pas les defenses par prompt
- **C2 (Necessite delta-3)**: **Partiel** — L'entrainement adversarial offre des garanties semi-formelles (robustesse sous epsilon) mais pas de verification complete
- **C3 (Shallow alignment)**: **Oui** — ADPO est explicitement concu pour remedier a l'alignement superficiel des VLM par fine-tuning post-hoc
- **C4 (Scaling independence)**: **Non traite** — evaluation sur une seule famille de modeles
- **C5 (Cross-layer interaction)**: **Non traite**
- **C6 (Medical specificity)**: **Non traite directement** — mais les implications pour l'imagerie medicale sont evidentes (CameraHUD d'AEGIS)
