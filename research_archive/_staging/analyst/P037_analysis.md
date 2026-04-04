# P037: Jailbreaking LLMs & VLMs: Mechanisms, Evaluation, and Unified Defenses
**Authors**: Zejian Chen, Chaozhuo Li, Chao Li, Xi Zhang, Litian Zhang, Yiming Hei | **Year**: 2026 | **Venue**: arXiv:2601.03594

## Resume FR (~500 mots)

Ce survey propose un cadre tridimensionnel unifie pour analyser les attaques de jailbreak, les defenses et les metriques d'evaluation, couvrant a la fois les modeles de langage (LLM) et les modeles vision-langage (VLM). L'originalite de cette contribution par rapport aux surveys precedents (P003, P004) reside dans son extension aux modeles multimodaux et dans sa proposition de principes de defense unifies operant a trois couches distinctes.

La dimension attaque est decomposee en cinq categories pour les LLM — attaques basees sur des templates, encodage, manipulation de l'apprentissage en contexte (ICL), apprentissage par renforcement/adversarial, et fine-tuning — auxquelles s'ajoutent des categories specifiques aux VLM : perturbations au niveau du prompt, perturbations au niveau de l'image, et transfert via agents. Cette taxonomie est la plus comprehensive du corpus et permet de classifier systematiquement les 98 templates d'attaque d'AEGIS.

La dimension defense est structuree en trois niveaux : obfuscation au niveau du prompt, evaluation des sorties, et alignement/fine-tuning au niveau du modele. Les auteurs proposent des principes de defense unifies innovants : (1) detection par coherence de variantes et sensibilite aux gradients a la couche perception, (2) decodage securise et revue des sorties a la couche generation, et (3) alignement par preference augmente adversarialement a la couche parametres. Cette structuration correspond remarquablement aux couches delta de la these AEGIS.

La dimension evaluation consolide les metriques existantes : ASR (Attack Success Rate), score de toxicite, cout en requetes/temps, et pour les VLM, Clean Accuracy et Attribute Success Rate. Les auteurs soulignent l'importance de distinguer hallucinations et jailbreaks en termes d'intentionnalite et de mecanismes declencheurs — une distinction cruciale souvent negligee.

Un apport methodologique significatif est l'analyse des mecanismes sous-jacents aux vulnerabilites de jailbreak. Les auteurs identifient des facteurs structurels : donnees d'entrainement incompletes, ambiguite linguistique et incertitude generative. Cette analyse causale va au-dela de la simple description des attaques et fournit des pistes pour des defenses fondamentales plutot que des patchs ad hoc.

Pour la these AEGIS, ce survey offre une cartographie de reference pour positionner les contributions. La correspondance entre les trois couches de defense proposees et les couches delta est presque directe : la couche perception correspond a delta-2 (filtrage syntaxique), la couche generation correspond a une combinaison delta-1/delta-2, et la couche parametres correspond a delta-0 (alignement RLHF). La couche delta-3 (verification formelle) n'est pas presente dans le cadre des auteurs, ce qui confirme le gap identifie dans RUN-001 : aucun article ne propose une implementation concrete de delta-3.

L'extension aux VLM est pertinente pour AEGIS car les systemes medicaux integrent de plus en plus des donnees visuelles (imagerie medicale, cameras chirurgicales dans le CameraHUD d'AEGIS). Les vecteurs d'attaque multimodaux identifie representent une surface d'attaque emergente pour les systemes de robotique medicale assistee par IA.

## Formulas & Theorems

| Formule | Description |
|---------|-------------|
| ASR = nombre de jailbreaks reussis / nombre total de tentatives | Attack Success Rate standard |
| Toxicity Score : metrique de toxicite des sorties generees | Score de toxicite (dependant du classificateur utilise) |
| Clean Accuracy (CA) : precision sur les taches benignes apres application de la defense | Mesure de preservation d'utilite pour les VLM |
| Attribute Success Rate (ASR_attr) : taux de reussite par attribut specifique dans les VLM | Metrique granulaire multimodale |

## Glossaire Preliminaire
| Terme | Explication simple |
|-------|-------------------|
| VLM (Vision-Language Model) | Modele multimodal integrant traitement du langage et de l'image |
| Template-based attack | Attaque utilisant un gabarit pre-construit avec des variables remplacees par le contenu nocif |
| ICL manipulation | Exploitation de l'apprentissage en contexte pour amener le modele a produire des sorties non alignees |
| Variant-consistency detection | Defense verifiant que les reponses restent coherentes face a des reformulations de la meme requete |
| Gradient-sensitivity detection | Defense utilisant la sensibilite aux gradients pour detecter des entrees adversariales |
| Adversarially augmented preference alignment | Alignement par preference enrichi avec des exemples adversariaux pendant l'entrainement |

## Research Paths (Gaps identifies)
1. L'extension aux VLM est descriptive — pas d'evaluation experimentale des defenses unifiees proposees
2. Les principes de defense unifies ne sont pas formalises mathematiquement
3. La distinction hallucination/jailbreak merite une metrique quantitative (pas seulement qualitative)
4. La couche delta-3 (verification formelle) est absente du cadre propose — gap significatif
5. Pas d'evaluation en contexte medical specifique — tous les benchmarks sont generiques

## delta-Layer Tags
- [x] delta-0 (RLHF alignment) — couvert par la couche "parametres" du cadre unifie
- [x] delta-1 (System prompt) — couvert par la couche "perception" (obfuscation de prompt)
- [x] delta-2 (Syntax filtering) — couvert par les couches "perception" et "generation"
- [ ] delta-3 (Formal verification) — absent du cadre propose, confirmant le gap

## Conjecture Links
- **C1 (Insuffisance delta-1)**: **Oui** — Le survey documente systematiquement les echecs des defenses par prompt
- **C2 (Necessite delta-3)**: **Oui (indirect)** — L'absence de delta-3 dans le cadre le plus complet existant confirme le gap et renforce l'argument pour la these
- **C3 (Shallow alignment)**: **Partiel** — Mentionne les limitations de l'alignement mais sans analyse en profondeur
- **C4 (Scaling independence)**: **Non traite**
- **C5 (Cross-layer interaction)**: **Oui** — Les principes de defense unifies tentent de coordonner les couches, mais sans formalisme
- **C6 (Medical specificity)**: **Non traite** — Survey generique
