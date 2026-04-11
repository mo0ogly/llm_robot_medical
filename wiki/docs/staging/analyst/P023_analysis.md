# P023 : Safety Misalignment Against Large Language Models

## [Gong et al., 2025] -- Safety Misalignment Against Large Language Models

**Reference :** DOI:10.14722/ndss.2025.241089
**Revue/Conf :** NDSS 2025 (Network and Distributed System Security Symposium), CORE A*, San Diego, CA, fevrier 2025
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P023_source.pdf](../../assets/pdfs/P023_source.pdf)
> **Statut**: [ARTICLE VERIFIE] -- lu en texte complet via ChromaDB (109 chunks), publie NDSS 2025 (peer-reviewed, CORE A*)

### Abstract original
> The safety alignment of Large Language Models (LLMs) is crucial to prevent unsafe content that violates human values. To ensure this, it is essential to evaluate the robustness of their alignment against diverse malicious attacks. However, the lack of a large-scale, unified measurement framework hinders a comprehensive understanding of potential vulnerabilities. To fill this gap, this paper presents the first comprehensive evaluation of existing and newly proposed safety misalignment methods for LLMs. Specifically, we investigate four research questions: (1) evaluating the robustness of LLMs with different alignment strategies, (2) identifying the most effective misalignment method, (3) determining key factors that influence misalignment effectiveness, and (4) exploring various defenses. The safety misalignment attacks in our paper include system-prompt modification, model fine-tuning, and model editing. Our findings show that Supervised Fine-Tuning is the most potent attack but requires harmful model responses. In contrast, our novel Self-Supervised Representation Attack (SSRA) achieves significant misalignment without harmful responses. We also examine defensive mechanisms such as safety data filter, model detoxification, and our proposed Self-Supervised Representation Defense (SSRD), demonstrating that SSRD can effectively re-align the model.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Absence de cadre unifie pour evaluer et comparer les methodes de desalignement de securite des LLM ; les evaluations precedentes sont fragmentees et incomparables (Gong et al., 2025, Section I, p. 1)
- **Methode :** Evaluation de 4 methodes d'attaque (SPM, SFT, SSRA, ME) et 3 defenses (filtre AI, detoxification, SSRD) sur 3 LLM : Llama-2-7B-chat, Beaver-7B-v1.0, Mistral-7B-Instruct-v0.2 ; extension a Llama-2-13B, Llama-3-8B, Qwen-2-7B (Gong et al., 2025, Section I, p. 2 ; Table XVI en appendice)
- **Donnees :** Datasets d'attaque SA (1960 paires), HS (600 paires), HS-10 (10 paires), AOA (non-harmful) ; metriques ASR (harmfulness via LlamaGuard) et ACC (utility via MMLU) combinees en mis_score (Gong et al., 2025, Section III, p. 4-5)
- **Resultat :** SFT atteint l'ASR maximal (88.7% sur Llama-2 via LoRA+HS, Figure 2a) ; SSRA atteint 83.3% ASR sur Llama-2 sans aucune donnee toxique avec |E-|=30, |E+|=60 (Gong et al., 2025, Section V-D, Figure 8) ; SSRD restaure 0.0% ASR apres LoRA+HS-10 avec seulement 2.9% perte d'ACC (Gong et al., 2025, Table XII, p. 11)
- **Limite :** Modeles 7B uniquement dans l'evaluation principale ; SSRA necessite un acces white-box aux representations internes ; SSRD non teste contre un adversaire adaptatif iteratif (Gong et al., 2025, Section VIII, p. 13)

### Analyse critique

**Forces :**

1. **Premier cadre unifie d'evaluation.** Le papier est le premier a proposer une evaluation systematique comparant SPM, SFT, SSRA et ME dans un meme cadre experimental, avec des metriques identiques (ASR, ACC, mis_score) sur les memes modeles. C'est une contribution structurante pour le domaine (Gong et al., 2025, Section I, p. 2). La publication a NDSS 2025 (CORE A*, venue de securite top-tier) confirme la rigueur de la revue par les pairs.

2. **SSRA comme contribution originale majeure.** L'attaque SSRA manipule les representations internes du modele en identifiant des embeddings E+ (safe) et E- (unsafe), puis fine-tune pour rapprocher E+ vers E- via une similarite L1 ou cosinus. Le resultat est un desalignement significatif (83.3% ASR sur Llama-2) sans aucune donnee toxique en entree (Gong et al., 2025, Section IV, p. 7 ; Section V-D, Figure 8). Cela abaisse drastiquement la barriere d'entree pour un attaquant : ni donnees labelisees toxiques, ni reponses harmful ne sont requises. Seul un acces white-box au modele est necessaire.

3. **Evaluation tri-dimensionnelle.** La combinaison ASR + ACC + mis_score est plus informative qu'un ASR seul. Le mis_score penalise un modele qui perd en utilite meme si l'ASR augmente, ce qui capture le trade-off attaque/utilite (Gong et al., 2025, Section III, p. 5). C'est une approche plus mature que les evaluations binaires de la litterature anterieure.

4. **Couverture des methodes PEFT.** L'evaluation couvre 5 methodes de fine-tuning a parametres efficaces (LoRA, AdaLoRA, (IA)3, Prefix-tuning, P-tuning v2) avec analyse de l'impact des hyperparametres -- rang LoRA, nombre d'epochs, taille du dataset (Gong et al., 2025, Section V-C, Tables VII-IX). LoRA est identifie comme le plus efficace parmi les methodes PEFT.

5. **SSRD et multi-round.** La defense SSRD est testee en scenario multi-round (attaque -> defense -> re-attaque -> re-defense), montrant une robustesse maintenue sur 3 rounds successifs (Gong et al., 2025, Figure 7, p. 12). C'est une evaluation rare dans la litterature sur les defenses.

**Faiblesses :**

1. **Echelle limitee a 7B.** L'evaluation principale porte sur des modeles 7B (Llama-2-7B, Beaver-7B, Mistral-7B). L'extension a Llama-2-13B, Llama-3-8B et Qwen-2-7B en appendice (Table XVI) ne depasse pas 13B. La scalabilite aux modeles 70B+ et aux modeles commerciaux (GPT-4, Claude) n'est pas demontree (Gong et al., 2025, Section V-A, Table V, modeles 7B uniquement dans les resultats principaux).

2. **Filtre AI insuffisant.** Les filtres de donnees AI-based montrent une haute precision pour les donnees safe (>90%), mais les faux negatifs suffisent a compromettre l'alignement via fine-tuning (Gong et al., 2025, Section V-E, Figure 6). Un seul echantillon toxique non filtre peut suffire, ce qui rend le filtrage pre-training insuffisant comme defense isolee.

3. **SSRD non teste contre adversaire adaptatif.** Le scenario multi-round suppose un attaquant qui repete la meme strategie. Un attaquant qui adapte son vecteur apres avoir observe la defense SSRD n'est pas considere (Gong et al., 2025, Section VIII). C'est un gap critique pour l'applicabilite reelle.

4. **Absence d'evaluation medicale.** Aucun test sur des requetes a haut risque specifiques au domaine medical. Les datasets (SA, HS, AOA) sont generiques et en anglais uniquement -- pas de test cross-lingual.

5. **LlamaGuard comme juge.** L'ASR est evalue par LlamaGuard, un modele qui peut lui-meme etre vulnerable aux manipulations subtiles (cf. P044, Adversarial Judge). Pas de validation croisee avec un juge humain sur un sous-ensemble.

**Questions ouvertes :**
- SSRA est-elle transferable cross-modele (representations apprises sur un modele, appliquees sur un autre) ?
- Quelle est la persistance du desalignement SSRA apres du fine-tuning additionnel sur des taches benines ?
- SSRD est-elle effective contre des attaques combinant SPM + SSRA simultanement ?

### Formules exactes

**SSRA -- Attaque par representations auto-supervisees** (Gong et al., 2025, Section IV, p. 7-8) :
L'attaque identifie des ensembles E+ (embeddings de reponses safe) et E- (embeddings de reponses unsafe) dans l'espace de representation du modele. Le fine-tuning minimise la distance entre les representations de E+ et E-, forceant le modele a traiter les requetes safe comme si elles etaient unsafe.
- Variante L1 : `SSRA_l1 : max ASR = 83.3%` avec `|E-|=30, |E+|=60` (Gong et al., 2025, Figure 8, p. 10)
- Variante cosinus : resultats comparables (Gong et al., 2025, Section V-D)
- Aucune donnee toxique requise en entree

**SSRD -- Defense par re-alignment** (Gong et al., 2025, Section VII-B, p. 11-12) :
Re-aligne le modele en inversant le processus SSRA, restaurant les representations vers l'espace safe. Utilise 1000 instructions avec reponses safe pour la re-alignment.
- Apres LoRA+HS-10 sur Llama : `ASR -> -2.0% (+/-0.0), ACC perte = 2.9%` (Gong et al., 2025, Table XII, p. 11)
- Superieur au SFT-based re-alignment en preservation de l'utilite (Gong et al., 2025, Table XII)

**Metriques** (Gong et al., 2025, Section III, p. 4-5) :
- ASR : pourcentage de reponses classees harmful par LlamaGuard
- ACC : accuracy sur MMLU (benchmark d'utilite)
- mis_score : combinaison ponderee de ASR et ACC

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) -- non utilise directement dans ce papier), F01 (RLHF alignment)

### Pertinence these AEGIS

- **Couches delta :** δ⁰ (cible primaire -- toutes les attaques visent a compromettre l'alignement RLHF de base) ; δ¹ (SPM = modification du system prompt, Gong et al., 2025, Section V-A, identifie comme l'attaque la moins efficace mais contribuant au desalignement, Figure 2a) ; δ² (filtres AI evalues comme defense, Gong et al., 2025, Section V-E, montres insuffisants) ; δ³ non traite (aucune verification formelle)
- **Conjectures :**
  - C1 (insuffisance δ¹) : **supportee** -- SPM seul est l'attaque la moins efficace des 4 methodes, mais contribue neanmoins au desalignement (Gong et al., 2025, Figure 2a, comparaison SPM vs SFT vs SSRA vs ME)
  - C2 (necessite δ³) : **supportee** -- la facilite du desalignement (SSRA sans donnees toxiques) plaide pour des garanties formelles au-dela des defenses empiriques
  - C3 (shallow alignment) : **fortement supportee** -- le desalignement par fine-tuning leger (LoRA sur 10 echantillons HS-10 suffit, Gong et al., 2025, Table VII) confirme que l'alignement RLHF est superficiel, en coherence avec Qi et al. (2025, ICLR Outstanding Paper)
- **Decouvertes :**
  - D-003 (fragilite alignment) : **confirmee** -- 3 LLM avec des strategies d'alignement differentes (RLHF, DPO, SFT) sont tous vulnerables aux memes attaques (Gong et al., 2025, Section I, p. 2)
  - D-004 (alignment superficiel) : **confirmee** -- quelques dizaines d'embeddings suffisent pour SSRA (|E-|=30), et 10 echantillons HS-10 suffisent pour SFT
  - D-010 (defense re-alignment) : **nuancee** -- SSRD efficace (0.0% ASR, Table XII) mais non teste contre adversaire adaptatif
- **Gaps :**
  - G-001 (evaluation medicale) : **non adresse** -- aucun test en domaine medical
  - G-008 (defense adaptative) : **cree** -- SSRD vs attaquant adaptatif non etudie
  - G-020 (robustesse cross-linguale) : **non adresse** -- anglais uniquement
- **Mapping templates AEGIS :** SPM lie aux templates de manipulation system prompt (#01-#12) ; SSRA conceptuellement lie aux attaques par manipulation de l'espace latent ; SFT lie aux scenarios de fine-tuning malveillant

### Citations cles
> "SFT is the most potent attack but requires harmful model responses. In contrast, our novel Self-Supervised Representation Attack (SSRA) achieves significant misalignment without harmful responses." (Gong et al., 2025, Abstract, p. 1)
> "SSRD can re-align it to achieve an 0.0% ASR, with only a 2.9% decrease in ACC" (Gong et al., 2025, Section VII-B, Table XII, p. 11)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute -- NDSS publie (peer-reviewed CORE A*), metriques detaillees, hyperparametres complets en appendice (Table XXVIII), modeles open-weight accessibles |
| Code disponible | Non mentionne dans le papier |
| Dataset public | Partiel -- HH-RLHF (Anthropic) public, datasets SA/HS/AOA decrits mais provenance a verifier |
| Nature epistemique | [EMPIRIQUE] -- evaluation systematique sans garantie formelle ; SSRA et SSRD sont des [HEURISTIQUE] sans borne de convergence ni preuve de completude |
