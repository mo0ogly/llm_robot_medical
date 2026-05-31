## [Liu et al., 2024] — Automatic and Universal Prompt Injection Attacks against LLMs

**Reference :** arXiv:2403.04957
**Revue/Conf :** arXiv (cs.AI), 2024
**Lu le :** 2026-05-31
> **PDF Source**: [literature_for_rag/P148_Liu_2024_AutomaticUniversalInjection.pdf](../../literature_for_rag/P148_Liu_2024_AutomaticUniversalInjection.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet (14 pages)

### Abstract original
> "Large Language Models (LLMs) excel in processing and generating human language, powered by their ability to interpret and follow instructions. However, their capabilities can be exploited through prompt injection attacks. These attacks manipulate LLM-integrated applications into producing responses aligned with the attacker's injected content, deviating from the user's actual requests. The substantial risks posed by these attacks underscore the need for a thorough understanding of the threats. Yet, research in this area faces challenges due to the lack of a unified goal for such attacks and their reliance on manually crafted prompts, complicating comprehensive assessments of prompt injection robustness. We introduce a unified framework for understanding the objectives of prompt injection attacks and present an automated gradient-based method for generating highly effective and universal prompt injection data, even in the face of defensive measures. With only five training samples (0.3% relative to the test data), our attack can achieve superior performance compared with baselines. Our findings emphasize the importance of gradient-based testing, which can avoid overestimation of robustness, especially for defense mechanisms. Code is available at https://github.com/SheltonLiu-N/Universal-Prompt-Injection"
> — Source : PDF page 1

### Resume (5 lignes)

- **Probleme :** La recherche sur l'injection de prompt souffre de deux verrous methodologiques avoues par les auteurs. Premierement, l'absence d'objectif unifie : les travaux fondateurs distinguent goal hijacking et prompt leaking (Perez & Ribeiro, 2022, cite Section 1, p.1-2), d'autres parlent de tache originale vs tache injectee (Liu et al., 2023c, cite Section 2.2, p.3), rendant impossible un protocole d'evaluation generalise. Deuxiemement, la dependance aux prompts faits main ("handcrafted"), qui 1) limite la portee et la scalabilite, 2) presente une universalite instable lorsque les instructions ou les donnees changent, 3) empeche les attaques adaptatives et conduit a "an overestimation of defense mechanisms" (Section 2, p.2, contributions). C'est ce dernier point — la surestimation de la robustesse des defenses — qui est le veritable apport de securite du papier.

- **Methode :** Les auteurs proposent (a) un cadre unifie de trois objectifs — static, semi-dynamic, dynamic (Definitions 2.1 a 2.3, p.3-4) ; (b) la conversion de chaque objectif en une phrase-cible d'optimisation (Section 2.3, p.4), exploitant la nature auto-regressive du modele (idee heritee de Zou et al., 2023 et Wei et al., 2023b, cite Section 2.3, p.4) ; (c) un algorithme de recherche gradient-based avec momentum, baptise M-GCG (Momentum Greedy Coordinate Gradient, Algorithm 1, p.5), qui etend GCG (Zou et al., 2023) en agregeant le gradient sur un batch de N instructions x M donnees d'entrainement (Eq. 5, p.5) et en ajoutant un terme de momentum de poids delta (Eq. 6, p.5). L'attaque optimise un contenu injecte universel S sur seulement 5 echantillons d'entrainement.

- **Donnees :** Sept taches NLP servant d'instructions utilisateur : duplicate sentence detection (MRPC), grammar correction (Jfleg), hate content detection (HSOL), natural language inference (RTE), sentiment analysis (SST2), spam detection (SMS Spam), text summarization (Gigaword) — references datasets Section 3.1, p.5. Modele victime : Llama2-7b-chat (Touvron et al., 2023), choisi comme modele open-source robuste comparable aux modeles fermes selon Toyer et al. (2023) (Section 3.1, p.5-6). ASR teste sur 200 echantillons par dataset, soit 1400 echantillons au total (Section 3.1, p.6). Entrainement sur 5 echantillons = 0.3% des donnees de test (Abstract, p.1 ; confirme Section 3.2, p.6). 15 objectifs adverses (Appendix A, cite Section 3.1, p.5). Hyperparametres : top-k=128, batch size=256, 1000 iterations, momentum delta=1.0, longueur du token injecte=150 (Section 3.1, p.6).

- **Resultat :** Sur l'objectif static, ASR moyen = 0.81 (81%) via KEY-E (Table 1, ligne OURS/STATIC, colonne AVG, p.6). ASR moyen tous objectifs confondus = ~50%, double-verifie par detection de mot-cle + GPT-4 (Section 3.2, p.6). Les trois baselines (naive, combined, repeated) obtiennent 0.00 sur TOUTES les cellules de la Table 1 (p.6) sous le protocole d'evaluation standardise centre sur le risque reel. M-GCG ameliore GCG de 21% en moyenne sur les objectifs (Table 2, p.7 ; Section 3.3, p.6-7). Contre les defenses : chute de 32% sans strategie adaptative, recuperation a 85% de la performance originale avec EOT (Section 3.4, p.7).

- **Limite :** Faiblesse face a la defense par detection de perplexite (PPL detection, Alon & Kamfonas, 2023), avouee explicitement Section 5, p.8 : "A limitation of our method is the weakness of our method when facing PPL detection defense". Les auteurs relativisent toutefois en notant que cette defense est "very expensive as it contains one or more additional inference processes of LLMs" (Section 5, p.8). Travaux futurs : renforcer l'integrite semantique du contenu injecte tout en gardant une haute performance (Section 5, p.8).

### Analyse critique

**Forces :**
- Cadre conceptuel unificateur (static/semi-dynamic/dynamic, Definitions 2.1-2.3, p.3-4) qui subsume les taxonomies anterieures (goal hijacking, prompt leaking, tache injectee) sous une formulation d'optimisation unique (Eq. 1, p.3). C'est une contribution de structuration utile au-dela de l'attaque elle-meme.
- Demonstration que les protocoles d'evaluation "benins" surestiment la robustesse : les baselines handcrafted s'effondrent a 0.00 sous un protocole centre sur le risque reel (Table 1, p.6), alors qu'elles paraissent efficaces dans des benchmarks ou la cible est une simple tache linguistique benigne. Argument methodologique fort pour le red-teaming.
- Efficacite d'echantillon remarquable : 5 echantillons (0.3% des donnees de test) suffisent pour atteindre 81% sur static (Abstract + Table 1, p.1, p.6). Universalite testee sur des instructions jamais vues a l'entrainement (datasets marques * : spam detection, summarization, Section 3.1, p.5).
- Evaluation adverse honnete des defenses : test de 5 defenses (paraphrasing, retokenization, data isolation, instructional prevention, sandwich prevention, Section 3.4, p.7) + variante adaptative EOT. Les defenses qui affaiblissent la capacite du modele a identifier les prompts dans les donnees externes "consistently fail" (Section 3.4, p.7).
- Reproductibilite : code public (GitHub SheltonLiu-N/Universal-Prompt-Injection, Abstract, p.1), hyperparametres complets (Section 3.1, p.6), datasets publics standards.

**Faiblesses :**
- Modele victime unique : Llama2-7b-chat (Section 3.1, p.6). Aucune evaluation cross-modele (GPT-4 utilise uniquement comme juge LM-E, pas comme cible). L'universalite revendiquee porte sur les instructions/donnees, PAS sur les modeles. Le titre "Universal" peut induire en erreur : c'est une universalite intra-modele.
- Attaque white-box obligatoire : M-GCG necessite l'acces au gradient du modele victime (Eq. 5, p.5). Inapplicable directement aux modeles fermes via API. Le threat model (Section 2.1, p.2) ne discute pas explicitement cette contrainte de capacite attaquant.
- Variance non rapportee : la Table 1 (p.6) et la Table 2 (p.7) donnent des ASR ponctuels sans intervalle de confiance ni barres d'erreur, malgre N=200 par dataset. Pas de p-value, pas de repetition multi-seed documentee. Signal d'alerte de la grille mathematical-analysis.
- Le contenu injecte optimise est du gibberish non-semantique (visible dans l'exemple Figure 1, p.1 : "visit_DFenkinsClcorrectly /\\Fraeqn`` ..."), ce qui explique precisement la vulnerabilite a la detection PPL avouee Section 5, p.8. C'est le talon d'Achille structurel de l'approche GCG-like.
- ASR moyen tous objectifs ~50% (Section 3.2, p.6) reste modeste pour semi-dynamic et dynamic (AVG KEY-E 0.37 et 0.39 respectivement, Table 1 OURS, p.6) ; seul static atteint 0.81. La revendication d'efficacite est portee surtout par l'objectif static, le plus simple.

**Questions ouvertes :**
- L'attaque transfere-t-elle vers des modeles plus grands ou fermes (transfert black-box) ? Non aborde par les auteurs.
- La defense PPL etant le seul contre-mesure efficace identifie, quel est le cout/utilite reel en deploiement medical ou la latence compte ? Non aborde.
- L'integrite semantique mentionnee en travaux futurs (Section 5, p.8) — combiner M-GCG avec une contrainte de fluidite (a la AutoDAN, Liu et al., 2023a, des memes auteurs) annulerait-elle la vulnerabilite PPL ?

### Mecanisme d'attaque (contribution cle)

L'attaque optimise un contenu injecte universel S inserer dans les donnees externes D, de sorte que pour TOUTES les paires (instruction I, donnee D) du jeu d'entrainement, le modele produise la reponse cible R_T.

**Objectif d'optimisation global** [ALGORITHME — methode gradient-based avec garantie empirique de convergence amelioree, sans borne theorique] :

minimize_S  sum_{n=1}^{N} sum_{m=1}^{M}  J_{R_T^{n,m}}( LM(I_n ⊕ D_m ⊕ S) )   (Eq. 1, p.3)

ou N = nombre d'instructions, M = nombre de donnees dans le jeu d'entrainement, et J mesure l'ecart entre la reponse generee et la reponse cible R_T^{n,m} (Section 2.1, p.2-3).

**Fonction de loss exacte** [ALGORITHME] — log-vraisemblance negative de la phrase-cible R_T :

J_{R_T}(S_{1:k}, I, D) = - log P(R_T | I, D, S_{1:k})   (Eq. 4, p.4)

ou P(R_T | I, D, S_{1:k}) = produit_{j=1}^{l} P(r_{k+j} | {d_s}, s_1,...,s_k, r_{k+1},...,r_{k+j-1})  (Eq. 3, p.4), exploitant la factorisation auto-regressive (Eq. 2, p.4).

**Innovation — momentum** [HEURISTIQUE — extension de GCG sans garantie de convergence formelle, justifiee empiriquement par les courbes de loss Figure 4, p.7] :

Gradient batch : G_t = ∇_{e_{s_i}} sum_{n=1}^{N} sum_{m=1}^{M} J_{R_T}(S_{1:k}, I_n, D_m)   (Eq. 5, p.5)
Momentum : G_t = G_t + delta * G_{t-1}   (Eq. 6, p.5), avec delta = poids de momentum (delta=1.0 en pratique, Section 3.1, p.6).

Puis selection des top-k tokens a plus fort gradient negatif comme candidats de remplacement, evaluation de B <= k|I| candidats sur le batch, et remplacement du token minimisant la loss (Algorithm 1, M-GCG, p.5). L'insight non trivial : agreger le gradient sur un batch (Eq. 5) plutot que sur un contexte unique (comme GCG pour le jailbreak) confere l'universalite inter-instructions/inter-donnees, la difference structurelle revendiquee vs jailbreak (Section 2.4, p.4-5 ; Related Works Section 4, p.8).

### Formules exactes

- **Eq. 1** (objectif universel) : `min_S sum_{n=1}^N sum_{m=1}^M J_{R_T^{n,m}}(LM(I_n ⊕ D_m ⊕ S))` (p.3) [ALGORITHME]
- **Eq. 2** (auto-regression) : `x_{j+1} ~ P(.|x_1, x_2, ..., x_j)` (p.4) [DEFINITION standard]
- **Eq. 3** (probabilite cible) : `prod_{j=1}^l P(r_{k+j} | {d_s}, s_1,...,s_k, r_{k+1},...,r_{k+j-1})` (p.4) [DEFINITION]
- **Eq. 4** (loss) : `J_{R_T}(S_{1:k}, I, D) = -log P(R_T | I, D, S_{1:k})` (p.4) [ALGORITHME — objectif d'optimisation]
- **Eq. 5** (gradient batch) : `G_t = ∇_{e_{s_i}} sum_{n=1}^N sum_{m=1}^M J_{R_T}(S_{1:k}, I_n, D_m)` (p.5) [ALGORITHME]
- **Eq. 6** (momentum) : `G_t = G_t + delta * G_{t-1}` (p.5) [HEURISTIQUE — pas de garantie de convergence prouvee]
- **Threat model** : `LM(I ⊕ D) = R_B` (benin) vs `LM(I ⊕ D ⊕ S) = R_T` (attaque) (Section 2.1, p.2) [DEFINITION]

Lien glossaire AEGIS : candidat F-nouveau pour la formulation universelle Eq. 1 (proche de l'objectif universel de GCG/AutoDAN). Loss Eq. 4 = NLL standard, deja couverte conceptuellement. Mapping a verifier avec F22 ASR cote metrique.

### Pertinence these AEGIS

- **Couches delta :** Principalement **δ²** (separation instruction/donnee dans le contexte) — c'est le coeur de l'attaque IPI : le modele ne distingue pas commandes utilisateur et donnees externes (Section 1, p.1 ; threat model Section 2.1, p.2). Touche aussi **δ³** (robustesse du comportement face a contenu adverse optimise) car l'attaque survit a 5 defenses sur 5 (Section 3.4, p.7). Marginalement **δ⁰/δ¹** non central : l'attaque ne vise pas l'alignement RLHF de surface mais la confusion de canal.

- **Conjectures :** Pertinent pour **C2** (separation instruction/donnee non robuste — supportee : les defenses de type isolation/instructional/sandwich "consistently fail", Section 3.4, p.7). Pertinent pour la conjecture liee a la surestimation des defenses par les benchmarks benins — le papier APPORTE une evidence directe que les protocoles d'evaluation laxistes surestiment la robustesse (Table 1 : baselines a 0.00 sous protocole strict, p.6). HUMILITY GATE : ne PAS revendiquer que c'est la "premiere" attaque universelle gradient-based PI — GCG (Zou et al., 2023) preexiste pour le jailbreak, et les auteurs eux-memes se positionnent comme extension de GCG (Section 2.4, p.4-5). Formuler comme "parmi les premiers a transposer l'optimisation gradient-based universelle de GCG du jailbreak vers l'injection indirecte".

- **Formules AEGIS :** F22 ASR applicable (KEY-E = I_success/I_total, Section 3.1, p.6 ; metrique empirique sans borne, [EMPIRIQUE]). Double-verification KEY-E + GPT-4 (LM-E) pertinente pour notre protocole de juge — mais ATTENTION juge LLM manipulable (cf. P044). Le 21% d'amelioration M-GCG vs GCG (Table 2, p.7) est un point de comparaison pour nos campagnes genetiques.

- **MITRE ATLAS :** AML.T0051 (LLM Prompt Injection) — confirme, IPI indirect (Greshake et al., 2023 cite comme fondateur, Section 1, p.1).

- **OWASP LLM :** LLM01 (Prompt Injection) — les auteurs citent explicitement le classement OWASP top-10 (Section 1, p.1-2).

### Citations cles

> "These handcrafted prompt injection attacks, while being simple and intuitive, 1) will limit attack scope and scalability, making comprehensive evaluations difficult; 2) have unstable universality among access to different user instructions and data, where the performance will drop significantly when changing to different instructions and data; 3) are hard to launch adaptive attacks, which may lead to an overestimation of defense mechanisms." (Section 1/2, p.2)

> "We can see that previous studies that were assessed only in a 'benign' environment ... have lost their effectiveness entirely in generating responses with malicious goals. However, our approach demonstrates both effectiveness and universality across three objectives, we achieve above 80% ASR on the static objective and an average ASR of 50% ... based only on five training samples, which is only 0.3% of the testing data." (Section 3.2, p.6)

> "A limitation of our method is the weakness of our method when facing PPL detection defense (Alon & Kamfonas, 2023). However, we must note that this kind of defense is very expensive as it contains one or more additional inference processes of LLMs." (Section 5, p.8)

### Classification
| Champ | Valeur |
|-------|--------|
| Type | Attaque automatique (gradient-based, white-box) IPI universelle |
| SVC pertinence | 8/10 — forte pour δ² (separation instruction/donnee) et la critique des protocoles d'evaluation defensifs ; affaiblie par le modele unique (Llama2-7b) et la contrainte white-box |
| Reproductibilite | Haute — code public (GitHub SheltonLiu-N/Universal-Prompt-Injection), hyperparametres complets (Section 3.1, p.6), datasets publics standards. Reserve : white-box requis, variance non rapportee |
| Code disponible | Oui — https://github.com/SheltonLiu-N/Universal-Prompt-Injection (Abstract, p.1) |
| Dataset public | Oui — MRPC, Jfleg, HSOL, RTE, SST2, SMS Spam, Gigaword (Section 3.1, p.5) |
