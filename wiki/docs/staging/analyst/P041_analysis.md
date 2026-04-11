## [Si et al., 2026] — Efficient Switchable Safety Control in LLMs via Magic-Token-Guided Co-Training

**Reference :** arXiv:2508.14904v3
**Revue/Conf :** AAAI 2026 Special Track on AI Alignment (extended version)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P041_2508.14904.pdf](../../assets/pdfs/P041_2508.14904.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (79 chunks)

### Abstract original
> Current methods for content safety in Large Language Models (LLMs), such as Supervised Fine-Tuning (SFT) and Reinforcement Learning from Human Feedback (RLHF), often rely on multi-stage training pipelines and lack fine-grained, post-deployment controllability. To address these limitations, we propose a unified co-training framework that efficiently integrates multiple safety behaviors: positive (lawful/prosocial), negative (unfiltered/risk-prone) and rejective (refusal-oriented/conservative) within a single SFT stage. Notably, each behavior is dynamically activated via a simple system-level instruction, or magic token, enabling stealthy and efficient behavioral switching at inference time. This flexibility supports diverse deployment scenarios, such as positive for safe user interaction, negative for internal red-teaming, and rejective for context-aware refusals triggered by upstream moderation signals. This co-training strategy induces a distinct Safety Alignment Margin in the output space, characterized by well-separated response distributions corresponding to each safety mode. The existence of this margin provides empirical evidence for the model's safety robustness and enables unprecedented fine-grained control. Experiments show that our method matches the safety alignment quality of SFT+DPO, with our 8B model notably surpassing DeepSeek-R1 (671B) in safety performance, while significantly reducing both training complexity and deployment costs.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les pipelines d'alignement multi-etapes (SFT+RLHF+DPO) manquent de controlabilite post-deploiement et imposent des couts operationnels eleves pour supporter plusieurs comportements de securite.
- **Methode :** Co-entrainement unifie en une seule etape SFT avec trois modes comportementaux (pos/neg/rej) actives par des magic tokens (chaines cryptographiques aleatoires, ex: rfcd9lbo) injectees dans le system prompt cote serveur (Section 3.2, p. 4-5).
- **Donnees :** Auto-distillation multi-directionnelle sur Qwen3-8B ; EN-ALIGN (10 977 echantillons x3 comportements, base AEGIS 2.0 + HarmBench) et ZH-ALIGN (16 521 x3, norme chinoise) ; evaluation sur 9 datasets couvrant EN et ZH (Table 1, p. 6).
- **Resultat :** MTC en pos atteint 97.55 Avg(en), egalant SFT+DPO (97.58) ; chute de seulement 3.8% sous attaque vs 21.5% pour les baselines (Figure 1, p. 2). SAM = 0.131 vs ~0.03 pour les baselines (Table 4, p. 9).
- **Limite :** Le mode neg produit des reponses negatives dans seulement 67.8% des cas (Table 3, p. 9) ; pas d'evaluation des risques de decouverte des magic tokens par un attaquant ; pas de test en contexte medical (Section 5, Conclusion, p. 10).

### Analyse critique
**Forces :**
- Resultat remarquable : modele 8B surpasse DeepSeek-R1 (671B) en securite, demontrant que l'efficacite de l'alignement n'est pas fonction de la taille (Table 2, p. 7-8).
- Self-distillation sans teacher externe : les comportements emergent du modele de base lui-meme, eliminant les biais d'alignement externes (Section 3.1, p. 4).
- SAM comme metrique quantifiable de separation comportementale : 0.131 vs ~0.03 pour les baselines, validant que la separation est une consequence structurelle du co-training (Table 4, p. 9 ; Figure 3, p. 10).
- Robustesse aux tokens invalides : magic tokens aleatoires ou prompt systeme absent retombent en mode securise par defaut (MTC/MP rand = 90.83, MTC/MP no = 93.97, Table 2, p. 8).
- Extension multi-politique (en-US / zh-CN) sans degradation significative (MTC/MP pos : 97.45 EN, 95.13 ZH, Table 2, p. 8).

**Faiblesses :**
- Mode neg insuffisamment controle : seulement 67.8% de reponses negatives en mode neg, avec 31.8% classees comme pos (Table 3, p. 9). Sur les prompts surs (XSTest), le neg produit 50% de pos, ce qui limite son utilite pour le red-teaming.
- Vecteur d'attaque non traite : si un attaquant decouvre un magic token (par brute-force ou fuite), il peut forcer le basculement en mode neg. Les auteurs ne quantifient pas la resistance a ce type d'attaque.
- SAM mesure uniquement la separation au premier token via coefficient de silhouette sur les logits. Cette metrique ne capture pas les divergences comportementales a long terme dans les reponses generees.
- Evaluation uniquement avec des evaluateurs internes (accuracy 97.5%, Section 4.4, p. 6) ; les evaluations etendues (CoSA, Appendix C) utilisent des evaluateurs open-source mais ne couvrent pas les scenarios d'attaque adversariale sur les magic tokens eux-memes.
- Aucune evaluation en contexte medical ou a haut risque.

**Questions ouvertes :**
- Quelle est la complexite de brute-force des magic tokens (longueur 8 chars alphanumeriques = ~2.8 x 10^12 combinaisons) ?
- Comment le SAM evolue-t-il sous pression adversariale (GCG, PAIR, AutoDAN) ?
- Le mode neg controle est-il plus sur que l'utilisation de modeles non-censures pour le red-teaming ?

### Formules exactes
| Formule | Source |
|---------|--------|
| L = -sum_{(x,y) in D} log p(y_behavior \| x, behavior; theta), behavior in {pos, neg, rej} | Section 3.2, p. 5 |
| SAM = (1/n) sum_{i=1}^{n} s(i) ; s(i) = (b(i) - a(i)) / max{a(i), b(i)} | Section 3.3, p. 5 (coefficient de silhouette de Rousseeuw, 1987) |
| Constructive Safety Score = (1/2n) sum_{i=1}^{n} s_i, s_i in {0, 1, 2} | Section 4.4, p. 6 |
| CoSA-Score C = (1/N) sum_{i=1}^{N} h_i * s_i, h_i in [0,1], s_i in {1,-1} | Section 4.5, p. 8 (Zhang et al., 2025, Eq. 1) |

Lien glossaire AEGIS : F15 (Sep(M) — complementaire), F22 (ASR)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (alternative au pipeline RLHF multi-etapes — le co-training unifie remplace SFT+DPO), δ¹ (magic tokens operent au niveau du system prompt)
- **Conjectures :** C1 (supportee partiellement — magic tokens ameliorent δ¹ mais creent un nouveau vecteur d'attaque), C3 (supportee — concue pour remedier aux limitations de l'alignement superficiel), C4 (fortement supportee — 8B > 671B en securite), C5 (supportee — interaction magic token δ¹ / co-training δ⁰)
- **Decouvertes :** D-003 (robustesse cross-modele : applicable via MTC/MP), D-012 (mode neg comme red-teaming controle)
- **Gaps :** G-008 (securite des mecanismes de controle post-deploiement), G-015 (evaluation en contexte medical non realisee)
- **Mapping templates AEGIS :** #14-#18 (baseline SVC), #45-#52 (attaques sur system prompt)

### Citations cles
> "Our 8B model notably surpassing DeepSeek-R1 (671B) in safety performance" (Abstract, p. 1)
> "Invalid tokens default to safe mode (inherited from Qwen3-8B's priors), ensuring safe fallback behavior" (Section 4.5, p. 8)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — code et datasets publics (https://github.com/Qihoo360/LLMs-Safety-Control) |
| Code disponible | Oui (GitHub) |
| Dataset public | Oui (EN-ALIGN, ZH-ALIGN) |
