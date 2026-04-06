# P023 : Safety Misalignment Against Large Language Models

## [Gong et al., 2025] -- Safety Misalignment Against Large Language Models

**Reference :** DOI:10.14722/ndss.2025.241089
**Revue/Conf :** NDSS 2025 (Network and Distributed System Security Symposium), CORE A*, San Diego, CA
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P023_source.pdf](../../literature_for_rag/P023_source.pdf)
> **Statut**: [ARTICLE VERIFIE] -- lu en texte complet via ChromaDB (109 chunks), publie NDSS 2025

### Abstract original
> The safety alignment of Large Language Models (LLMs) is crucial to prevent unsafe content that violates human values. To ensure this, it is essential to evaluate the robustness of their alignment against diverse malicious attacks. However, the lack of a large-scale, unified measurement framework hinders a comprehensive understanding of potential vulnerabilities. To fill this gap, this paper presents the first comprehensive evaluation of existing and newly proposed safety misalignment methods for LLMs. Specifically, we investigate four research questions: (1) evaluating the robustness of LLMs with different alignment strategies, (2) identifying the most effective misalignment method, (3) determining key factors that influence misalignment effectiveness, and (4) exploring various defenses. The safety misalignment attacks in our paper include system-prompt modification, model fine-tuning, and model editing. Our findings show that Supervised Fine-Tuning is the most potent attack but requires harmful model responses. In contrast, our novel Self-Supervised Representation Attack (SSRA) achieves significant misalignment without harmful responses. We also examine defensive mechanisms such as safety data filter, model detoxification, and our proposed Self-Supervised Representation Defense (SSRD), demonstrating that SSRD can effectively re-align the model.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Absence de cadre unifie pour evaluer et comparer les methodes de desalignement de securite des LLM ; evaluations precedentes incomparables entre elles (Section I, p.1)
- **Methode :** Evaluation de 4 methodes d'attaque (SPM, SFT, SSRA, ME) et 3 defenses (filtre, detoxification, SSRD) sur 3 LLM : Llama-2-7B-chat, Beaver-7B-v1.0, Mistral-7B-Instruct-v0.2 (Section I, p.2) ; SSRA manipule les representations internes sans donnees toxiques (Section IV)
- **Donnees :** Datasets d'attaque SA, HS, HS-10, AOA ; metriques ASR (harmfulness) et ACC (utility) combinees en mis_score (Section III)
- **Resultat :** SFT est l'attaque la plus puissante (ASR jusqu'a 88.7% sur Llama, Table des resultats SFT) ; SSRA atteint 83.3% ASR sur Llama **sans donnees toxiques** (Section V-D, Figure 4/8) ; SSRD reduit a 0.0% ASR apres LoRA+HS-10 avec seulement 2.9% perte d'ACC (Table XII)
- **Limite :** Modeles 7B uniquement ; SSRA necessite un acces white-box aux representations ; SSRD non teste contre des attaques prolongees ou iteratives (Section VIII)

### Analyse critique
**Forces :**
- Premier cadre unifie d'evaluation systematique des methodes de desalignement -- reference pour la communaute (Section I, p.2)
- Publication NDSS 2025 (venue de securite top-tier, CORE A*) -- revue par les pairs rigoureuse
- SSRA est une contribution originale majeure : desalignement significatif sans aucune donnee toxique, abaissant la barriere d'entree pour les attaquants (Section V-D)
- SSRD comme defense en scenario closed-source : re-alignment efficace meme apres plusieurs rounds d'attaque/defense (Figure 7, multi-round)
- Evaluation tri-dimensionnelle : ASR, ACC et mis_score combinent harmfulness et utility -- meilleure qu'un ASR seul
- Couverture de 5 methodes PEFT (LoRA, AdaLoRA, IA3, etc.) avec analyse de l'impact des hyperparametres (Section V-C)

**Faiblesses :**
- Limite a des modeles 7B -- scalabilite aux 70B+ non demontree
- Le filtre de donnees (AI-based filter) montre une haute precision pour les donnees safe (>90%) mais les faux negatifs suffisent a compromettre l'alignement via fine-tuning (Section V-E)
- SSRD non evalue dans un contexte ou l'attaquant adapte sa strategie a la defense (jeu iteratif)
- Pas d'evaluation en domaine medical ou sur des requetes a haut risque specifiques
- Les datasets d'attaque (SA, HS, AOA) sont anglais uniquement -- pas de test cross-lingual

**Questions ouvertes :**
- SSRA est-elle transferable cross-modele (representer l'attaque sur un modele, l'appliquer sur un autre) ?
- Quelle est la persistance du desalignement SSRA apres du fine-tuning additionnel sur des taches benines ?

### Formules exactes

**SSRA -- Attaque par representations auto-supervisees** (Section IV) :
L'attaque identifie des embeddings E+ (safe) et E- (unsafe) dans l'espace de representation du modele, puis fine-tune pour rapprocher les representations de E+ vers E- via une metrique de similarite Sim(.) (L1 ou cosinus).
`SSRA_l1 : max ASR = 83.3% avec |E-|=30, |E+|=60` (Figure 8)

**SSRD -- Defense par re-alignment** (Section VII-B) :
Re-aligne le modele en inversant le processus SSRA -- restaure les representations vers l'espace safe.
`SSRD apres LoRA+HS-10 sur Llama : ASR -> -2.0% (±0.0), ACC perte = 2.9%` (Table XII)

**Metriques** :
- ASR : % de reponses scorees comme harmful (Section III)
- ACC : accuracy sur taches benines (Section III)
- mis_score : combinaison de ASR et ACC (Section III)

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) -- non utilise directement), F01 (RLHF alignment)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (cible primaire -- toutes les attaques visent l'alignement) ; δ¹ (SPM = modification system prompt, Section V-A) ; δ² (filtres AI evalues, Section V-E) ; δ³ non traite
- **Conjectures :**
  - C1 (insuffisance δ¹) : **supportee** -- SPM seul est l'attaque la moins efficace, mais contribue au desalignement (Figure 2a)
  - C2 (necessite δ³) : **supportee** -- la facilite du desalignement (SSRA sans donnees toxiques) plaide pour des garanties formelles
  - C3 (shallow alignment) : **fortement supportee** -- le desalignement par fine-tuning leger confirme que l'alignement est superficiel (Qi et al., 2025, ICLR)
- **Decouvertes :**
  - D-003 (fragilite alignment) : **confirmee** -- 3 LLM avec alignements differents sont tous vulnerables
  - D-004 (alignment superficiel) : **confirmee** -- quelques dizaines d'embeddings suffisent pour SSRA
  - D-010 (defense re-alignment) : **nuancee** -- SSRD efficace mais non teste contre adversaire adaptatif
- **Gaps :**
  - G-001 (evaluation medicale) : **non adresse**
  - G-008 (defense adaptative) : **cree** -- SSRD vs attaquant adaptatif non etudie
  - G-020 (cross-lingual robustesse) : **non adresse**
- **Mapping templates AEGIS :** lie aux templates de desalignement par fine-tuning ; SSRA conceptuellement lie aux attaques par manipulation de l'espace latent

### Citations cles
> "SFT is the most potent attack but requires harmful model responses. In contrast, our novel Self-Supervised Representation Attack (SSRA) achieves significant misalignment without harmful responses." (Abstract, p.1)
> "SSRD can re-align it to achieve an 0.0% ASR, with only a 2.9% decrease in ACC" (Section VII-B, Table XII)
> "different safety alignment paradigms share a common vulnerability to misalignments" (Section I, p.2)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute -- NDSS publie, metriques detaillees, hyperparametres en appendice (Table XXVIII) |
| Code disponible | Non mentionne |
| Dataset public | Partiel -- HH-RLHF public, datasets custom non publies |
| Nature epistemique | [EMPIRIQUE] -- evaluation systematique sans garantie formelle ; SSRA/SSRD sont des [HEURISTIQUE] sans borne de convergence |
