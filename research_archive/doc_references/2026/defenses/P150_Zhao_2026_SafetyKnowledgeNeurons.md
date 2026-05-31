## [Zhao, Ke & Huang, 2026] — Unraveling LLM Jailbreaks Through Safety Knowledge Neurons

**Reference :** arXiv:2509.01631 / DOI:10.18653/v1/2026.eacl-long.83
**Revue/Conf :** EACL 2026 (Vol.1 Long Papers, pp.1889-1906), Duke Kunshan University — peer-reviewed
**Lu le :** 2026-05-31
> **PDF Source**: [literature_for_rag/P150_Zhao_2026_SafetyKnowledgeNeurons.pdf](../../literature_for_rag/P150_Zhao_2026_SafetyKnowledgeNeurons.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet (18 pages)

### Abstract original
> "Large Language Models (LLMs) have achieved substantial progress in alignment, ensuring safer and more reliable outputs. However, jailbreak attacks can still bypass these safeguards and provoke harmful responses from well-aligned models. While some studies have achieved defenses against jailbreak attacks by modifying output distributions or detecting harmful content, the exact rationale still remains elusive. In this work, we present a novel neuron-level interpretability method that focuses on the role of safety-related knowledge neurons. Unlike existing approaches, our method projects the model's internal representation into a more consistent and interpretable vocabulary space. We then show that adjusting the activation of safety-related neurons can effectively control the models behavior with a mean ASR higher than 97%. Building on this insight, we propose SafeTuning, a fine-tuning strategy that reinforces safety-critical neurons to improve model robustness against jailbreaks. SafeTuning consistently reduces attack success rates across multiple LLMs and outperforms all four baseline defenses. These findings offer a new perspective on understanding and defending against jailbreak attacks."
> — Source : PDF page 1 (lignes 9-36)

### Resume (plus de 400 mots)

**Probleme.** Les modeles alignes (RLHF) refusent en principe les requetes nuisibles, mais les jailbreaks contournent ces garde-fous (Introduction, p.1889). Les auteurs partent du constat que les defenses existantes — qu'elles modifient la distribution de sortie (decoding-based : Smooth-LLM, SafeDecoding) ou detectent le contenu nuisible — fonctionnent empiriquement mais "offer limited insight into the underlying mechanisms of jailbreak attacks" (Section 1, p.1890). Le mecanisme INTERNE par lequel un modele decide de refuser ou d'obeir reste mal compris : c'est le gap que le papier vise.

**Methode (3 contributions).** (1) Une methode d'interpretabilite mecaniste au niveau neurone. S'appuyant sur la litterature montrant que la connaissance est stockee dans les couches MLP du transformer (Voita et al., 2023 ; Dai et al., 2022, cites Section 2, p.1891), les auteurs identifient des "safety knowledge neurons" dans la matrice down-projection des MLP, puis projettent leur activation dans l'espace vocabulaire (vocabulary table) pour obtenir des mots-cles humainement interpretables (Section 3, p.1891-1892). Innovation revendiquee : la projection se fait "right after the activation of safety critical knowledge neurons" (juste apres la couche MLP), produisant des tokens conceptuellement coherents des la 10e couche, au lieu des tokens emotionnels parasites des methodes anterieures qui projettent les hidden states intermediaires (Zhou et al., 2024 ; Zou et al., 2025) — cf. Section 1, p.1890 et Section 6, p.1896, Figure 5. (2) ActCali, une attaque au niveau embedding qui calibre causalement l'activation des neurones de securite : en deplacant l'activation "Rejection" vers "Conformity", le modele aligne repond aux requetes nuisibles ; dans l'autre sens, il refuse meme les requetes benignes (Section 4, p.1892-1893). (3) SafeTuning, une defense par fine-tuning cible des seuls neurones de securite (Section 5, p.1893-1895).

**Donnees.** Modeles : Llama-2-7b-chat et Vicuna-7b-v1.5 (modeles bien alignes, Section 4.1, p.1893). Pour l'interpretation : 100 prompts benins d'AlpacaEval (Li et al., 2023) + 100 prompts nuisibles d'AdvBench (Zou et al., 2023), avec t=3, k=2.5% (Section 3.2, p.1892). Pour ActCali : 100+100 prompts (AlpacaEval/AdvBench), α=3, profondeur de calibration 5 tokens, ~0.3% des parametres modifies (Section 4.1, p.1893). Pour SafeTuning : corpus (harmful input, refusal output) de taille 300 issu d'AdvBench, k=3% ; evaluation sur JailbreakBench (Chao et al., 2024a) — 100 prompts nuisibles, 4 attaques (GCG, PAIR, Prompt with Random Search, AIM), 4 defenses baselines (PPL, ICD, SelfReminder, SafeDecoding), 200 prompts benins AlpacaEval (Section 5.2, p.1894-1895).

**Resultat.** ActCali atteint "over 97% mean ASR" sur des modeles a defense forte et faible (Section 4.2, p.1893). Detail Table 1, p.1893 : sur AdvBench, ActCali = 100% ASR (Vicuna) et 99% ASR (Llama2) ; sur AlpacaEval, 92% (Vicuna) et 100% (Llama2). SafeTuning reduit l'ASR de plus de 90% (Section 5.3, p.1895) : Table 2, p.1894, montre par exemple sur Vicuna face a GCG une chute de 33% (No Defense) a 0% (SafeTuning), face a "Prompt with RS" de 95% a 13%, tout en conservant un Win Rate de 54.1% (vs 61.5% No Defense). Sur Llama2, Win Rate de 60.0% (vs 58.6% No Defense), donc utilite preservee voire amelioree. SafeTuning surpasse les 4 defenses baselines (Section 5.3, p.1895).

**Limite.** Les auteurs reconnaissent (Section 8 Limitation, p.1896) : (a) travail limite aux modeles bien alignes — l'alignement de modeles non alignes reste inexplore ; (b) extension aux LLM multi-modaux non traitee ; (c) les deux methodes "require manual tuning of hyperparameters" — pas d'automatisation de la selection des hyperparametres.

### Analyse critique

**Forces.** (1) Causalite, pas seulement correlation : la performance d'ActCali (>97% ASR en ne modifiant que 0.3% des parametres, Section 1, p.1890 ; Section 4.1, p.1893) est presentee comme "strong evidence that the identified safety-critical neurons play a causal role in the model's aligned behavior" (Section 1, p.1890). C'est un argument fort : si la manipulation chirurgicale de ces neurones suffit a renverser le comportement, ils sont bien le siege fonctionnel de la decision de refus. (2) Le dual usage attaque/defense (ActCali genere precisement le corpus (Xharm, Yrefuse) qui alimente SafeTuning, Section 5.1, p.1894) est elegant et auto-coherent. (3) SafeTuning preserve l'utilite (Win Rate ~54-60%) la ou les defenses prompt-based (ICD, SelfReminder) la degradent fortement sur Llama2 (Win Rate chute a 15.7% / 15.6%, Table 2, p.1894). (4) Evaluation sur JailbreakBench standardise (Chao et al., 2024a) avec 4 attaques + 4 defenses = positionnement comparatif sérieux.

**Faiblesses.** (1) **Surface white-box / representation-level.** ActCali est une attaque white-box au niveau embedding necessitant l'acces aux poids et aux activations internes (Section 4, p.1892). Le threat model est donc tres permissif : un attaquant qui peut deja modifier 0.3% des parametres a un acces quasi-total au modele. L'ASR>97% n'est PAS comparable a un ASR de jailbreak black-box par prompt. Les baselines (Logit Graft, SCAV, Soft Embedding) sont aussi des attaques representation-level white-box (Section 4.1, p.1893), donc la comparaison est equitable mais le cadre reste eloigne d'un deploiement API ferme. (2) **N petit pour l'interpretation.** 100+100 prompts pour l'identification des neurones (Section 3.2, p.1892) ; aucune barre d'erreur ni variance entre seeds rapportee sur les tables d'ASR. (3) **Juge LLM partiellement.** ASR via keyword matching (deterministe, Section 4, p.1893 — bon point) mais HScore et Win Rate via juge LLM (text_davinci_003, Section 5.2, p.1895), or notre corpus documente que le juge LLM est manipulable (cf. P044, 99% flip rate). (4) **2 modeles seulement, 7B uniquement.** Llama-2-7b et Vicuna-7b : pas de modele >13B, pas de modele commercial ferme (GPT-4, Claude). La generalisation aux gros modeles n'est pas demontree. (5) **Pas de code publie** pour la methode (seule reference GitHub = alpaca_eval, outil tiers d'evaluation, ligne 850) → reproductibilite reduite.

**Questions ouvertes.** SafeTuning resiste-t-il a une attaque adaptative ActCali post-tuning (l'attaquant connait la defense) ? Les "safety neurons" renforces deviennent-ils une nouvelle cible concentree ? Comment se comporte la methode sur un modele aligne plus profondement (DPO multi-tour, deliberative alignment) ? La sparsite (<0.1% des neurones suffisent, Section 6, p.1896) tient-elle a 70B ?

### Mecanisme (contribution cle)

**Interpretabilite mecaniste.** Pour la couche MLP l, la sortie est `e_l = σ(s_l Θ^up_l) Θ^down_l` (Section 2, p.1891, Eq. non numerotee). La i-eme ligne de Θ^down est le "knowledge neuron" `r^i_l`. L'activation scalaire est `a^i_l = σ(s_l θ^i_l)` et la contribution `c^i_l = a^i_l × ||r^i_l||` (Section 3.1, p.1891). Les neurones top-k par score `c^i_l` forment l'ensemble N. En alimentant un corpus nuisible H on obtient Ns ; un corpus benin B donne Nf ; l'ensemble RAFFINE des neurones de securite est `Nr = Ns − Nf` (Section 3.1, p.1891) — soustraction qui retire les neurones "fondamentaux" partages, evitant la degradation de capacite signalee pour les neurones "All-Shared".

**Projection vocabulaire.** Les representations moyennes par corpus `pB_l` et `pH_l` (moyennes ponderees `a×r` sur Nr, Section 3.2, p.1892) sont projetees via la matrice Γ : `G^d_l = Top-T(Γ(p))` donne les tokens interpretables. Observation cle : les valeurs d'activation sont "linearly separable through all layers" (Section 3.2, p.1892). Direction de conformite `dc = pB − pH` ; direction de rejet `dr = pH − pB` (Section 3.2, p.1892). Tokens observes : benin → "Answer, Why, Execute, Safety" ; nuisible → "Impossible, controvers, Ban, Cannot" (Section 3.2, p.1892).

**Attaque ActCali.** Generation calibree : `e'_l = σ(s_l Θ^up_l) Θ^down_l + αd`, ou d ∈ {dc, dr} (Section 4, p.1892, Eq. non numerotee). Pas de calcul de gradient → temps d'inference inchange (Section 4, p.1893).

**Defense SafeTuning.** Construit le corpus S = (Xharm, Yrefuse) via ActCali (force le refus), puis fine-tune les seuls neurones de securite par la loss `L = − log P(Yrefuse | Xharm)` (Section 5.1, p.1894). Les neurones de capacite generale sont geles ("leaving general capability neurons untouched", Section 5.1, p.1894).

### Formules exactes

| ID | Formule (notation originale) | Reference | Tag epistemique |
|----|------------------------------|-----------|-----------------|
| F-MLP | `e_l = σ(s_l Θ^up_l) Θ^down_l` | Section 2, p.1891 | [THEOREME — definition structurelle du MLP transformer] |
| F-ACT | `a^i_l = σ(s_l θ^i_l)` | Section 3.1, p.1891 | [THEOREME — definition formelle de l'activation neurone] |
| F-CONTRIB | `c^i_l = a^i_l × ‖r^i_l‖` | Section 3.1, p.1891 | [HEURISTIQUE — score de contribution, choix de design suivant Shen et al. 2024] |
| F-NSET | `Nr = Ns − Nf` | Section 3.1, p.1891 | [HEURISTIQUE — selection ensembliste empirique des neurones de securite] |
| F-DIR | `dc = pB − pH`, `dr = pH − pB` | Section 3.2, p.1892 | [EMPIRIQUE — directions definies par separabilite lineaire observee, sans preuve] |
| F-CALI | `e'_l = σ(s_l Θ^up_l) Θ^down_l + αd` | Section 4, p.1892 | [HEURISTIQUE — operateur d'attaque par calibration, hyperparametre α=3 manuel] |
| F-LOSS | `L = − log P(Yrefuse \| Xharm)` | Section 5.1, p.1894 | [ALGORITHME — objectif de fine-tuning standard (NLL), sans garantie de convergence] |
| F-JB | `max Π pθ(x_{s+i} \| x_{1:s+i})` | Section 2, p.1891 | [THEOREME — definition formelle du jailbreak] |

Note epistemique : aucun resultat de convergence ni borne formelle n'est demontre. Les revendications de causalite sont EMPIRIQUES (ablation par modification d'activation), pas prouvees. Le >97% ASR est un resultat experimental sans intervalle de confiance ([EMPIRIQUE]).

### Pertinence these AEGIS

- **Couches delta :** δ⁰ mecaniste. Le papier ouvre la boite noire de δ⁰ (alignement RLHF) en localisant le siège physique du refus dans des neurones MLP sparse. Il explique POURQUOI δ⁰ est manipulable : la decision de refus/conformite est portee par une fraction infime (<0.1-3%) de neurones, donc une perturbation chirurgicale (0.3% des parametres) la renverse. SafeTuning est une defense δ⁰ renforcee (fine-tuning cible), pertinente comme baseline de defense interne pour comparer aux defenses de surface AEGIS (δ¹-δ³).
- **Conjectures :**
  - **C1 (δ⁰ insuffisant) — SUPPORTE.** La demonstration qu'un alignement bien entraine est renverse a >97% ASR par manipulation de 0.3% des parametres (Section 1, p.1890 ; Section 4.2, p.1893) montre que l'alignement seul, meme "fort" (Llama-2-chat), n'est pas robuste a une attaque au niveau representation. NUANCE : SafeTuning reduit l'ASR de >90% (Section 5.3, p.1895) — la robustesse δ⁰ peut etre AUGMENTEE par tuning cible, donc C1 doit etre formulee comme "δ⁰ par defaut est insuffisant", pas "δ⁰ est intrinsequement insuffisant".
  - **C3 (alignement superficiel) — SUPPORTE.** Le fait que la securite repose sur une poignee de neurones sparse et localises, separables des la 10e couche (Section 1, p.1890 ; Section 6, p.1896), est coherent avec l'hypothese d'alignement superficiel/concentre (cf. Qi et al. 2025, shallow alignment). HUMILITY GATE : ce papier est concurrent/complementaire de Qi et al. ; ne PAS revendiquer de primeur AEGIS sur l'idee "alignement concentre".
- **Formules AEGIS :** liens potentiels avec le glossaire F01-F72 sur les definitions de jailbreak (F-JB ↔ formulation max-vraisemblance) et les metriques ASR (F-ASR empirique). A confirmer par le MATHEUX lors de l'integration glossaire — non aborde directement par les auteurs en termes AEGIS.
- **MITRE ATLAS :** AML.T0054 (LLM Jailbreak) pour ActCali ; egalement proche de AML.T0018 (Backdoor/Modify ML Model) puisque l'attaque modifie les parametres internes.
- **OWASP LLM :** LLM01 (Prompt Injection / Jailbreak au sens large) ; la facette modification de poids releve aussi de LLM05 (Improper Output Handling) / supply-chain selon le cadrage.

### Citations cles
> "We then show that adjusting the activation of safety-related neurons can effectively control the models behavior with a mean ASR higher than 97%." (Abstract, p.1889, lignes 25-28)

> "Our experiments on two models and two subtasks demonstrate near-perfect attack success rates with only modifying 0.3% parameters, surpassing all existing representation-level attack baselines. This result validates the exactness of our interpretation method, providing strong evidence that the identified safety-critical neurons play a causal role in the model's aligned behavior." (Section 1 Introduction, p.1890, lignes 133-140)

### Classification
| Champ | Valeur |
|-------|--------|
| Type | Interpretabilite mecaniste (safety knowledge neurons) + attaque white-box representation-level (ActCali) + defense par fine-tuning cible (SafeTuning) |
| SVC pertinence | 7/10 — fort sur la comprehension de δ⁰ et comme baseline de defense interne ; faible sur l'applicabilite directe a un threat model black-box AEGIS (attaque white-box, 0.3% params modifies) |
| Reproductibilite | Moyenne — modeles publics (Llama-2-7b, Vicuna-7b), datasets publics (AdvBench, AlpacaEval, JailbreakBench), hyperparametres donnes (α=3, k=2.5-3%, t=3, depth=5) ; MAIS pas de code de la methode publie, pas de variance/seeds, juge LLM partiel |
| Code disponible | Non — aucun repo de la methode (seule reference GitHub = tatsu-lab/alpaca_eval, outil d'eval tiers, ligne 850) |
| Dataset public | Oui — AdvBench (Zou et al., 2023), AlpacaEval (Li et al., 2023), JailbreakBench (Chao et al., 2024a) |
