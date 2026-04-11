# P025 : Detection Method for Prompt Injection (DMPI-PMHFE)

## [Ji, Li & Mao, 2025] -- DMPI-PMHFE: Dual-Channel Feature Fusion for Prompt Injection Detection

**Reference :** arXiv:2506.06384v1
**Revue/Conf :** Springer LNCS, Zhengzhou University, 2025
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P025_2506.06384.pdf](../../assets/pdfs/P025_2506.06384.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (45 chunks)

### Abstract original
> With the widespread adoption of Large Language Models (LLMs), prompt injection attacks have emerged as a significant security threat. Existing defense mechanisms often face critical trade-offs between effectiveness and generalizability. This highlights the urgent need for efficient prompt injection detection methods that are applicable across a wide range of LLMs. To address this challenge, we propose DMPI-PMHFE, a dual-channel feature fusion detection framework. It integrates a pretrained language model with heuristic feature engineering to detect prompt injection attacks. Specifically, the framework employs DeBERTa-v3-base as a feature extractor to transform input text into semantic vectors enriched with contextual information. In parallel, we design heuristic rules based on known attack patterns to extract explicit structural features commonly observed in attacks. Features from both channels are subsequently fused and passed through a fully connected neural network to produce the final prediction. Experimental results on diverse benchmark datasets demonstrate that DMPI-PMHFE outperforms existing methods in terms of accuracy, recall, and F1-score. Furthermore, when deployed actually, it significantly reduces attack success rates across mainstream LLMs, including GLM-4, LLaMA 3, Qwen 2.5, and GPT-4o.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les defenses existantes contre l'injection de prompt font face a un compromis entre efficacite et generalisabilite ; les methodes detection-only echouent a suivre les attaques en evolution (Ji, Li & Mao, 2025, Section 1, p. 1-2)
- **Methode :** Architecture a fusion bi-canal : (1) DeBERTa-v3-base comme extracteur de features semantiques implicites (768 dimensions), (2) regles heuristiques (synonym matching + pattern matching) pour les features structurelles explicites ; fusion via couches FC + ReLU + Softmax (Ji, Li & Mao, 2025, Section 3, Figure 2)
- **Donnees :** safeguard-v2 (10400 train / 1300 val / 1300 test), deepset-v2 (354 echantillons), ivanleomk-v2 (610 echantillons) ; 3000 echantillons generes via GPT-4o avec verification manuelle pour l'evaluation de defense (Ji, Li & Mao, 2025, Section 4.1)
- **Resultat :** F1 = 98.29% sur safeguard-v2, 96.03% sur ivanleomk-v2, 90.21% sur deepset-v2 (Ji, Li & Mao, 2025, Table 1) ; ASR reduit a 10.35% sur ChatGPT-4o (vs 29.08% baseline), 13.54% sur Llama-3-8B (vs 50.19%), 11.95% sur Llama-3.3-70B (vs 25.09%), 14.34% sur glm-4-9b-chat (vs 71.71%), 13.94% sur Qwen2.5-7B (vs 43.82%) (Ji, Li & Mao, 2025, Table 3)
- **Limite :** Heuristiques statiques necessitant une mise a jour manuelle ; precision en baisse avec l'ajout de M3 (de 99.58% a 98.00% sur safeguard-v2) ; non evalue contre injections Unicode ou cross-linguales (Ji, Li & Mao, 2025, Section 5)

### Analyse critique

**Forces :**

1. **Architecture bi-canal complementaire.** La combinaison DeBERTa (features semantiques implicites) + heuristiques (features structurelles explicites) couvre les attaques a la fois par le sens et par la forme. L'ablation rigoureuse (Table 2) demontre la contribution incrementale de chaque module : M1 seul donne F1=96.32%, M1+M2 donne 97.18%, M1+M2+M3 donne 98.29% sur safeguard-v2 (Ji, Li & Mao, 2025, Section 4.3, Table 2). Chaque ajout est statistiquement significatif.

2. **Evaluation de defense reelle sur 5 LLM.** Contrairement a de nombreux travaux qui evaluent uniquement la detection en isolation, DMPI-PMHFE est deploye comme filtre pre-inference sur 5 LLM heterogenes (GLM-4, Llama-3-8B, Llama-3.3-70B, Qwen2.5-7B, ChatGPT-4o). La reduction de l'ASR est consistante et substantielle sur tous les modeles : la moyenne de reduction est d'environ 60% relatif (Ji, Li & Mao, 2025, Table 3, Figure 3). C'est une validation operationnelle rare.

3. **Recall priorise sur la precision.** Le recall de 98.59% sur safeguard-v2 (Ji, Li & Mao, 2025, Table 2) est plus critique que la precision (98.00%) pour un systeme de securite : un faux negatif (attaque non detectee) est plus couteux qu'un faux positif (requete legitime bloquee). Le papier justifie explicitement ce trade-off : M3 fait baisser la precision de 99.58% a 98.00% mais augmente le recall de 93.27% a 98.59%.

4. **Comparaison avec 4 baselines.** DMPI-PMHFE est compare a Fmops, ProtectAI, SafeGuard et InjecGuard (Ji, Li & Mao, 2025, Table 1), tous des modeles deployes sur HuggingFace. La comparaison de defense est faite contre Self-Reminder (Xie et al., 2023) et Self-Defense (Phute et al., 2024) (Ji, Li & Mao, 2025, Table 3).

**Faiblesses :**

1. **Biais de distribution safeguard-v2.** Le dataset safeguard-v2 est utilise a la fois pour l'entrainement et le test interne. Bien que les ensembles soient separes (10400/1300/1300), le biais de distribution est reconnu mais non corrige (Ji, Li & Mao, 2025, Section 4.3). Les performances sur les datasets out-of-distribution (deepset-v2 : F1=90.21%) sont sensiblement inferieures, revelant une chute de 8 points.

2. **Heuristiques statiques.** Les modules M2 (synonym matching) et M3 (pattern matching) reposent sur des listes de mots-cles et patterns predefinies (Ji, Li & Mao, 2025, Appendix A.1 : "ignore, reveal, disregard, forget, overlook" pour le synonym matching). Une attaque adaptative qui evite ces patterns specifiques contourne le canal heuristique. L'appendice A.1 liste les mots-cles utilises, ce qui constitue paradoxalement une feuille de route pour l'evasion.

3. **Pas de test contre injections cross-linguales ou Unicode.** Les attaques par encodage Unicode, Base64, ou cross-lingual (cf. P037, P009) ne sont pas evaluees. Or ce sont des vecteurs en croissance rapide dans la litterature recente.

4. **Pas de mesure de latence.** Pour un deploiement pre-inference en production, la latence du pipeline (DeBERTa inference + heuristiques + fusion) est critique. Aucune mesure n'est rapportee (Ji, Li & Mao, 2025, absence dans Section 4-5).

5. **Dataset de defense modeste.** L'evaluation de defense repose sur 251 attaques (Ji, Li & Mao, 2025, Table 3, "total attacks = 251"). C'est au-dessus du seuil N >= 30 par condition, mais avec 5 LLM et 4 methodes de defense, certaines cellules ont des effectifs limites.

6. **Pas de comparaison avec GMTP ou InjecGuard fine-tune.** Les baselines de defense (Self-Reminder, Self-Defense) sont des methodes prompt-based relativement anciennes. Des comparaisons avec des classifieurs plus recents (GMTP de Kim et al., 2025, ACL 2025) manquent.

**Questions ouvertes :**
- Comment DMPI-PMHFE se comporte-t-il face aux attaques adaptatives qui minimisent la surface heuristique ?
- La fusion bi-canal est-elle robuste aux distributions shifted (domaines hors entrainement, ex. medical) ?
- Quel est l'overhead de latence par rapport a un deploiement sans detection ?

### Formules exactes

**Canal DeBERTa** (Ji, Li & Mao, 2025, Section 3.1, p. 6-7) :
```
{Tok_1, ..., Tok_n} -> DeBERTa-v3-base -> {O_1, ..., O_n} -> {F_1, ..., F_d}
```
avec d = 768 dimensions de l'espace de representation DeBERTa-v3-base.

**Canal heuristique** (Ji, Li & Mao, 2025, Section 3.2, p. 7-8) :
- Module M2 (synonym matching) : `V_syn = [V_1, ..., V_n]` avec V_i in {0,1} (match de mots-cles d'attaque)
- Module M3 (pattern matching) : `V_pat = [V_{n+1}, ..., V_{n+m}]` regles structurelles (few-shot, ignore instructions, etc.)
- Concatenation : `V = concat(V_syn, V_pat)`

**Fusion** (Ji, Li & Mao, 2025, Section 3.3, p. 8) :
```
features = concat(F_DeBERTa, V_heuristique) -> FC + ReLU -> FC + Softmax -> P(injection|input)
```

**Entrainement** : Adam optimizer, lr=2e-5, batch_size=16, weight_decay=0.02, early stopping patience=3, cross-entropy loss (Ji, Li & Mao, 2025, Section 4.2)

Lien glossaire AEGIS : F22 (ASR), lies aux detecteurs du RagSanitizer d'AEGIS (15 detecteurs existants)

### Pertinence these AEGIS

- **Couches delta :** δ² (cible primaire -- detection syntaxique pre-inference, directement comparable au RagSanitizer AEGIS) ; δ⁰ δ¹ δ³ non traites
- **Conjectures :**
  - C1 (insuffisance δ¹) : **supportee indirectement** -- la necessite d'un detecteur externe (plutot qu'un simple prompt defensif) confirme que le prompt systeme ne suffit pas. Self-Reminder et Self-Defense (methodes δ¹ pures) ont des ASR residuels de 19-40% selon les modeles (Ji, Li & Mao, 2025, Table 3)
  - C2 (necessite δ³) : **neutre** -- approche purement empirique sans verification formelle ni borne theorique de couverture
- **Decouvertes :**
  - D-012 (detection bi-canal) : **confirmee** -- la fusion semantique + heuristique surpasse chaque canal isole. L'ablation montre +1.97 points F1 entre M1 seul et M1+M2+M3 sur safeguard-v2 (Ji, Li & Mao, 2025, Table 2)
  - D-013 (recall vs precision) : **confirmee** -- le recall 98.59% est prioritaire sur la precision 98.00% pour un systeme de securite (Ji, Li & Mao, 2025, Section 4.3)
- **Gaps :**
  - G-005 (attaques adaptatives) : **non adresse** -- pas de test adversarial adaptatif
  - G-007 (cross-lingual) : **non adresse** -- anglais uniquement
  - G-014 (latence production) : **cree** -- aucune mesure de latence rapportee
- **Mapping templates AEGIS :** Directement comparable au RagSanitizer (15 detecteurs). La fusion bi-canal est l'equivalent architectural de la combinaison DeBERTa + regles heuristiques du sanitizer AEGIS. L'appendice A.1 (Ji, Li & Mao, 2025) liste les patterns detectes, alignables sur les templates #01-#35 du catalogue AEGIS.

### Citations cles
> "DMPI-PMHFE outperforms existing methods in terms of accuracy, recall, and F1-score" (Ji, Li & Mao, 2025, Abstract, p. 1)
> "precision slightly decreases as M3 is introduced [...] while recall and F1-score improve significantly" (Ji, Li & Mao, 2025, Section 4.3, Table 2)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Moyenne -- architecture detaillee et hyperparametres complets, mais safeguard-v2 n'est pas publie separement ; deepset et ivanleomk publics sur HuggingFace |
| Code disponible | Non mentionne |
| Dataset public | Partiel -- deepset-v2 et ivanleomk-v2 publics sur HuggingFace ; safeguard-v2 et dataset de defense (3000 echantillons GPT-4o) non publies |
| Nature epistemique | [ALGORITHME] -- architecture de detection avec evaluation empirique sur 3 datasets et 5 LLM, sans garantie theorique de couverture ni borne de generalisation |
