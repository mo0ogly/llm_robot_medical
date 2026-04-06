# P025 : Detection Method for Prompt Injection (DMPI-PMHFE)

## [Ji, Li & Mao, 2025] -- DMPI-PMHFE: Dual-Channel Feature Fusion for Prompt Injection Detection

**Reference :** arXiv:2506.06384v1
**Revue/Conf :** Springer LNCS, Zhengzhou University, 2025
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P025_2506.06384.pdf](../../literature_for_rag/P025_2506.06384.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (52 chunks)

### Abstract original
> With the widespread adoption of Large Language Models (LLMs), prompt injection attacks have emerged as a significant security threat. Existing defense mechanisms often face critical trade-offs between effectiveness and generalizability. This highlights the urgent need for efficient prompt injection detection methods that are applicable across a wide range of LLMs. To address this challenge, we propose DMPI-PMHFE, a dual-channel feature fusion detection framework. It integrates a pretrained language model with heuristic feature engineering to detect prompt injection attacks. Specifically, the framework employs DeBERTa-v3-base as a feature extractor to transform input text into semantic vectors enriched with contextual information. In parallel, we design heuristic rules based on known attack patterns to extract explicit structural features commonly observed in attacks. Features from both channels are subsequently fused and passed through a fully connected neural network to produce the final prediction. Experimental results on diverse benchmark datasets demonstrate that DMPI-PMHFE outperforms existing methods in terms of accuracy, recall, and F1-score. Furthermore, when deployed actually, it significantly reduces attack success rates across mainstream LLMs, including GLM-4, LLaMA 3, Qwen 2.5, and GPT-4o.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les defenses existantes contre l'injection de prompt font face a un compromis entre efficacite et generalisabilite ; les methodes detection-only echouent a suivre les attaques en evolution (Section 1, p.1-2)
- **Methode :** Architecture a fusion bi-canal : (1) DeBERTa-v3-base pour les features semantiques implicites, (2) regles heuristiques (synonym matching + pattern matching) pour les features structurelles explicites, fusion via couches FC + ReLU + Softmax (Section 3, Figure 2)
- **Donnees :** safeguard-v2 (10400 train / 1300 val / 1300 test), deepset-v2 (354 echantillons), ivanleomk-v2 (610 echantillons) ; 3000 echantillons generes via GPT-4o avec verification manuelle (Section 4.1)
- **Resultat :** F1 = 98.29% sur safeguard-v2 (meilleur publie), 96.03% sur ivanleomk-v2, 90.21% sur deepset-v2 (Table 1) ; ASR reduit a 10.35% sur GPT-4o (vs 29.08% baseline) et 11.95% sur Llama-3.3-70B (vs 25.09% baseline) (Table 3)
- **Limite :** Les heuristiques necessitent une mise a jour manuelle face aux nouvelles attaques ; la latence de fusion non mesuree ; non evalue contre les injections par caracteres Unicode (Section 5)

### Analyse critique
**Forces :**
- Architecture bi-canal robuste : la combinaison semantique + structurelle couvre les attaques a la fois par le sens (DeBERTa) et par la forme (heuristiques) (Section 3, Figure 2)
- Evaluation complete : comparaison avec 4 baselines (Fmops, ProtectAI, SafeGuard, InjecGuard) sur 3 datasets (Table 1)
- Ablation rigoureuse montrant la contribution incrementale de chaque module : M1 seul -> M1+M2 -> M1+M2+M3 (Table 2)
- Test de defense reelle sur 5 LLM heterogenes incluant GPT-4o, montrant une reduction consistante de l'ASR (Table 3)
- Le recall eleve (98.59% sur safeguard-v2) est plus important que la precision pour la securite -- trade-off bien justifie

**Faiblesses :**
- safeguard-v2 est a la fois le dataset d'entrainement et de test interne -- le biais de distribution est reconnu mais non corrige (Section 4.3)
- Les heuristiques (M2, M3) sont par nature statiques -- une attaque adaptative qui evite les patterns codes les contourne
- Pas de test contre les injections cross-linguales ou par encodage Unicode/Base64 (P009, P037)
- Pas de mesure de latence ou de FPR en conditions de production
- Le dataset de defense (251 attaques, Section 4.1) est petit par rapport aux N >= 30 par condition requis pour la validite statistique
- Comparaison avec Self-Reminder et Self-Defense uniquement -- pas de comparaison avec des classifieurs plus recents (InjecGuard fine-tune, GMTP)

**Questions ouvertes :**
- Comment DMPI-PMHFE se comporte-t-il face aux attaques adaptatives qui minimisent la surface heuristique ?
- La fusion bi-canal est-elle robuste aux distributions shifted (domaines hors entrainement, ex. medical) ?

### Formules exactes

**Canal DeBERTa** (Section 3.1) :
`{Tok_1, ..., Tok_n} -> DeBERTa-v3-base -> {O_1, ..., O_n} -> {F_1, ..., F_d}`
avec d = 768 dimensions de l'espace de representation DeBERTa

**Canal heuristique** (Section 3.2) :
Synonym matching : `V_syn = [V_1, ..., V_n]` avec V_i in {0,1} (match de mots-cles d'attaque)
Pattern matching : `V_pat = [V_{n+1}, ..., V_{n+m}]` regles structurelles (few-shot, ignore instructions, etc.)
`V = concat(V_syn, V_pat)`

**Fusion** (Section 3.3) :
`features = concat(F_DeBERTa, V_heuristique) -> FC + ReLU -> FC + Softmax -> P(injection|input)`

**Entrainement** : Adam optimizer, lr=2e-5, batch_size=16, weight_decay=0.02, early stopping patience=3, cross-entropy loss (Section 4.2)

Lien glossaire AEGIS : F22 (ASR), lies aux detecteurs du RagSanitizer d'AEGIS

### Pertinence these AEGIS
- **Couches delta :** δ² (cible primaire -- detection syntaxique pre-inference) ; δ⁰ δ¹ δ³ non traites
- **Conjectures :**
  - C1 (insuffisance δ¹) : **supportee indirectement** -- la necessite d'un detecteur externe confirme que le prompt systeme ne suffit pas
  - C2 (necessite δ³) : **neutre** -- approche empirique, pas de verification formelle
- **Decouvertes :**
  - D-012 (detection bi-canal) : **confirmee** -- la fusion semantique+heuristique surpasse chaque canal isole (Table 2)
  - D-013 (recall vs precision) : **confirmee** -- le recall 98.59% est prioritaire sur la precision 98.00% pour la securite
- **Gaps :**
  - G-005 (attaques adaptatives) : **non adresse** -- pas de test adversarial adaptatif
  - G-007 (cross-lingual) : **non adresse** -- anglais uniquement
  - G-014 (latence production) : **cree** -- aucune mesure de latence
- **Mapping templates AEGIS :** directement comparable au RagSanitizer (15 detecteurs) ; la fusion bi-canal est l'equivalent de la combinaison DeBERTa + regles heuristiques du sanitizer AEGIS

### Citations cles
> "DMPI-PMHFE outperforms existing methods in terms of accuracy, recall, and F1-score" (Abstract, p.1)
> "even a few adversarial tokens yield near-perfect recall" (Section 4.3, analyse de la couverture)
> "precision slightly decreases as M3 is introduced [...] while recall and F1-score improve significantly" (Section 4.3, Table 2)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Moyenne -- architecture detaillee mais datasets custom (safeguard-v2) non publics a verification |
| Code disponible | Non mentionne |
| Dataset public | Partiel -- deepset et ivanleomk publics sur HuggingFace ; safeguard-v2 custom |
| Nature epistemique | [ALGORITHME] -- architecture de detection avec evaluation empirique, sans garantie theorique de couverture |
