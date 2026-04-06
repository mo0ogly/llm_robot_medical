## [Chen, Li, Li, Zhang, Zhang & Hei, 2026] --- Jailbreaking LLMs & VLMs: Mechanisms, Evaluation, and Unified Defenses

**Reference :** arXiv:2601.03594
**Revue/Conf :** Preprint arXiv, Beijing University of Posts and Telecommunications + CAICT, 2026 [PREPRINT]
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P037_2601.03594.pdf](../../literature_for_rag/P037_2601.03594.pdf)
> **Statut**: [ARTICLE VERIFIE] --- lu en texte complet via ChromaDB (95 chunks fulltext, 94497 caracteres)

### Abstract original
> This paper provides a systematic survey of jailbreak attacks and defenses on Large Language Models (LLMs) and Vision-Language Models (VLMs), emphasizing that jailbreak vulnerabilities stem from structural factors such as incomplete training data, linguistic ambiguity, and generative uncertainty. It further differentiates between hallucinations and jailbreaks in terms of intent and triggering mechanisms. We propose a three-dimensional survey framework: (1) Attack dimension---including template/encoding-based, in-context learning manipulation, reinforcement/adversarial learning, LLM-assisted and fine-tuned attacks, as well as prompt- and image-level perturbations and agent-based transfer in VLMs; (2) Defense dimension---encompassing prompt-level obfuscation, output evaluation, and model-level alignment or fine-tuning; and (3) Evaluation dimension---covering metrics such as Attack Success Rate (ASR), toxicity score, query/time cost, and multimodal Clean Accuracy and Attribute Success Rate.
> --- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Absence de cadre unifie pour analyser les attaques de jailbreak, les defenses et les metriques d'evaluation couvrant a la fois les LLM textuels et les modeles vision-langage (VLM) (Section I Introduction, p.1-2)
- **Methode :** Survey systematique tridimensionnel (attaque, defense, evaluation) avec extension aux VLM et proposition de principes de defense unifies a trois couches : perception, generation, parametres (Section I, p.2)
- **Donnees :** N/A --- survey sans evaluation experimentale originale. Couverture de la litterature jusqu'a janvier 2026
- **Resultat :** Cadre taxonomique le plus complet du corpus (5 categories d'attaque LLM + 3 categories d'attaque VLM + 3 couches de defense + 4 types de metriques) ; identification de facteurs structurels de vulnerabilite ; distinction formelle hallucination/jailbreak (Sections II-VI)
- **Limite :** Survey descriptif sans validation experimentale des principes de defense unifies ; principes non formalises mathematiquement ; couche delta-3 absente (Section VI Discussion)

### Analyse critique

**Forces :**

1. **Extension VLM originale et pertinente.** Le survey est le premier a couvrir de maniere unifiee les attaques sur LLM et VLM dans un meme cadre taxonomique. Les attaques VLM incluent les perturbations au niveau du prompt, les perturbations au niveau de l'image, et le transfert agent-based. Cette dimension est directement pertinente pour les systemes medicaux multimodaux (imagerie, cameras chirurgicales Da Vinci Xi) (Section III, p.5-8).

2. **Taxonomie d'attaque la plus comprehensive du corpus.** 5 categories LLM (template/encoding-based, ICL manipulation, RL/adversarial learning, LLM-assisted, fine-tuned attacks) + 3 categories VLM (prompt-level perturbations, image-level perturbations, agent-based transfer). Cette granularite permet un mapping direct sur les 97 templates AEGIS (Section III, p.3-8).

3. **Distinction hallucination/jailbreak.** Le survey distingue formellement les hallucinations (erreurs non intentionnelles dues a l'incertitude generative) des jailbreaks (contournements intentionnels des mecanismes de securite). Les mecanismes declencheurs et l'intentionnalite sont les criteres discriminants (Section II, p.2-3).

4. **Identification de causes structurelles.** Au-dela de la description phenomenologique, le survey identifie trois causes structurelles des vulnerabilites : donnees d'entrainement incompletes, ambiguite linguistique intrinseque, et incertitude generative. Ces facteurs sont non corrigeables par le seul RLHF, ce qui renforce la these du shallow alignment (Chen et al., 2026, Section II, p.2-3, corrobore par Qi et al., 2025, ICLR 2025, Section 2).

5. **Principes de defense unifies a trois couches.** (i) Detection de consistance de variants et sensibilite au gradient (couche perception), (ii) decodage securise et revue des sorties (couche generation), (iii) alignement de preferences augmente par des donnees adversariales (couche parametres). La correspondance avec les couches delta AEGIS est remarquable : perception ~ δ², generation ~ δ¹/δ², parametres ~ δ⁰ (Section V, p.10-14).

**Faiblesses :**

1. **Principes de defense non valides experimentalement.** Les principes unifies restent au stade de proposition conceptuelle. Aucune experience ne demontre leur efficacite individuelle ou combinee. Les auteurs reconnaissent que la validation experimentale est "future work" (Section VI, p.15).

2. **Absence de la couche δ³ (verification formelle).** Le cadre le plus complet de la litterature ne couvre pas la verification formelle des sorties. C'est une confirmation directe du gap identifie dans la these AEGIS : δ³ est systematiquement ignore dans les surveys existants (implicite dans Section V).

3. **Pas d'evaluation en contexte medical.** Tous les benchmarks mentionnes (HarmBench, JailbreakBench, AdvBench) sont generiques. Les specificites medicales (dosages, interactions medicamenteuses, gravite clinique) ne sont pas adressees (Section IV, p.8-10).

4. **Survey potentiellement incomplet post-janvier 2026.** Les travaux publies apres janvier 2026 (P038 InstruCoT, P039 GRP-Oblit, P054 PIDP-Attack) ne sont pas inclus. La vitesse de progression du domaine rend tout survey rapidement obsolete.

5. **Pas de formalisation mathematique.** Les principes de defense sont decrits en langage naturel sans formalisation. La "variant-consistency detection" et la "gradient-sensitivity detection" ne sont pas definies par des equations ou des algorithmes (Chen et al., 2026, Section V, p.10-14).

**Questions ouvertes :**
- Les principes de defense unifies sont-ils implementables et mesurables ? Quelle est la complexite computationnelle ?
- L'extension VLM est-elle pertinente pour les attaques sur imagerie medicale (scanner, IRM, cameras chirurgicales) ?
- La distinction hallucination/jailbreak peut-elle etre quantifiee par une metrique continue (pas binaire) ?

### Formules exactes
Classification epistemique : `[SURVEY]` --- compilation et taxonomie sans contribution formelle originale.

**Metriques compilees** (Section IV, p.8-10) :
- ASR = nombre de jailbreaks reussis / nombre total de tentatives (standard)
- Toxicity Score : score de toxicite des sorties (dependant du classificateur)
- Query/Time Cost : cout computationnel de l'attaque
- Clean Accuracy (CA) : precision sur taches benignes apres defense (VLM specifique)
- Attribute Success Rate (ASR_attr) : taux de reussite par attribut VLM

Aucune formule originale --- le survey compile les metriques existantes.
Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) --- non mentionne dans le survey)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (couvert par la couche "parametres" du survey --- alignement de preferences), δ¹ (couvert partiellement par la couche "perception" --- obfuscation de prompt), δ² (couvert par les couches "perception" et "generation" --- detection et filtrage). **δ³ absent du cadre --- confirmation directe du gap**
- **Conjectures :** C1 (supportee : documentation systematique des echecs des defenses par prompt). C2 (supportee indirectement : l'absence de δ³ dans le survey le plus complet confirme le gap et renforce l'argument pour la these AEGIS). C3 (shallow alignment : supportee par l'identification des causes structurelles --- donnees incompletes, ambiguite --- qui sont non corrigeables par RLHF seul). C5 (cross-layer : supportee --- les principes unifies tentent de coordonner les couches mais sans formalisme)
- **Decouvertes :** D-010 (VLM attack surface) confirmee et enrichie. D-014 (hallucination vs jailbreak distinction) renforcee formellement
- **Gaps :** G-004 (δ³ implementation) confirme : absent du cadre le plus complet. G-012 (VLM medical security) cree --- les attaques image-level sont pertinentes pour l'imagerie medicale. G-013 (formalisation des principes de defense unifies) cree
- **Mapping templates AEGIS :** Taxonomie de reference pour classifier les 97 templates selon les 5+3 categories d'attaque. Mapping direct : template/encoding → #01-#20, ICL → #21-#40, RL/adversarial → #41-#60, LLM-assisted → #61-#80, fine-tuned → #81-#97

### Citations cles
> "jailbreak vulnerabilities stem from structural factors such as incomplete training data, linguistic ambiguity, and generative uncertainty" (Abstract, p.1)
> "We propose innovative unified defense principles across three layers" (Abstract, p.1)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | N/A --- survey sans experience originale |
| Code disponible | Non |
| Dataset public | Non |
