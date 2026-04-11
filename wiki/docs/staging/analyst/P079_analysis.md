## [Zhao, Wang, Shen, 2026] — ES2 : Separation de l'espace d'embedding pour la securite des LLM

**Reference :** arXiv:2603.20206v1
**Revue/Conf :** Preprint, Renmin University of China (Gaoling School of AI). Mars 2026.
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P079_Zhao_2026_ES2.pdf](../../assets/pdfs/P079_Zhao_2026_ES2.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (75 chunks)

### Abstract original
> Large language models (LLMs) have achieved impressive capabilities, yet ensuring their safety against harmful prompts remains a critical challenge. Recent work has revealed that the latent representations (embeddings) of harmful and safe queries in LLMs typically exhibit linear separability, a property that has been exploited to construct attacks by perturbing the embeddings of harmful queries towards the safe subspace. Motivated by this observation, we propose a representation-level fine-tuning approach, named Embedding Space Separation (ES2), which improves LLM safety by explicitly enlarging the distance between harmful and safe representations in the embedding space. To prevent degradation of model's general capabilities, we introduce a Kullback-Leibler (KL) divergence regularization term into the loss function, which constrains the logits of the fine-tuned model to align with those of the original base model on harmless inputs.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les embeddings de requetes nuisibles et sures dans les LLM sont lineairement separables — cette propriete est exploitee par les attaques embedding-level (RepE, Soft Prompt, SCAV) qui poussent les embeddings nuisibles dans le sous-espace sur par de petites perturbations (Section 1, p. 1-2).
- **Methode :** ES2 fine-tune 2 couches intermediaires du LLM pour maximiser la distance entre representations nuisibles et sures dans l'espace d'embedding. Regularisation KL divergence pour preserver les capacites generales sur les entrees inoffensives. Loss = separation loss (2 couches) + KL regularization (Section 3, p. 3-4).
- **Donnees :** 4 LLM open-source (LLama-2-7B-Chat, LLama-3-8B-Instruct, Mistral-7B-Instruct, Qwen-2.5-7B-Instruct) ; benchmarks de securite standard + Open LLM Leaderboard pour les capacites generales (Section 5, p. 5-7).
- **Resultat :** Defense Success Rate (DSR) : ES2 atteint 100% Keyword DSR et 94-98% Useful DSR contre RepE et Soft Prompt sur LLama-2 (Table 1, p. 6). Contre SCAV (attaque la plus forte) : 80% Keyword, 70% Useful sur LLama-2 (+31% vs meilleure baseline DPL). Capacites generales preservees : average Open LLM Leaderboard stable (Table 2, p. 7).
- **Limite :** Fine-tuning de 2 couches = sweet spot fragile : 1 couche insuffisante, 3 couches = effondrement du modele (Appendix C, p. 15). Attaques prompt-level (GCG, AutoDAN) seulement partiellement couvertes. Pas de test sur modeles >8B (Section 5, p. 5-7).

### Analyse critique
**Forces :**
- Insight theorique elegant : transformer la separabilite lineaire (vulnerabilite) en mecanisme de defense en elargissant la marge de separation (Section 1, Figure 1, p. 1-2).
- Regularisation KL pour preservation des capacites : ES2 ne degrade pas les performances generales — Open LLM Leaderboard stable (Table 2, p. 7).
- Gains massifs sur les attaques embedding-level : +26-31% DSR vs baselines sur l'attaque SCAV (la plus difficile) pour LLama-2 (Table 1, p. 6).
- Test sur 4 modeles differents — cross-model validation (Table 1-2, p. 6-7).
- Attaques au-dela de l'embedding : GCG et AutoDAN egalement testes — ES2 maintient de la robustesse mais pas aussi forte que contre embedding attacks.

**Faiblesses :**
- Fragilite du nombre de couches : exactement 2 couches fonctionnent. 1 = inefficace, 3 = collapse (Appendix C, p. 15) — ce manque de robustesse au choix d'hyperparametre est preoccupant.
- Attaque SCAV reste partiellement efficace : 70% Useful DSR sur LLama-2 = 30% de prompts nuisibles passent encore avec reponse utile (Table 1, p. 6).
- Modeles 7-8B uniquement — pas de validation sur modeles >13B ni sur modeles medicaux specifiques.
- La separabilite lineaire est une propriete connue depuis Xu et al. (2024) — la contribution est le fine-tuning pour l'elargir, pas la decouverte de la propriete.
- Pas de test en conditions realistes (RAG, agents, multi-turn) — evaluation purement sur des paires prompt-response isolees.

**Questions ouvertes :**
- ES2 est-il complementaire a ISE (P076) ? ISE agit sur les embeddings d'entree (segment), ES2 sur les representations intermediaires — defense en couches ?
- Comment ES2 se comporte-t-il contre les attaques cross-linguales ?
- La marge de separation est-elle stable dans le temps (apres fine-tuning supplementaire, RLHF, etc.) ?

### Formules exactes
- **Loss ES2** : L_total = L_separation(layers l1, l2) + lambda * L_KL(logits_finetuned, logits_base | harmless inputs) (Section 3, p. 3-4). [ALGORITHME — pas de borne de convergence formelle]
- **L_separation** : maximise la distance entre representations de prompts harmful et harmless sur 2 couches intermediaires selectionnees (Section 3, p. 3).
- **L_KL** : KL(p_finetuned || p_base) sur les logits pour les entrees inoffensives — preserve les capacites generales (Section 3, p. 4).
- **DSR (Defense Success Rate)** : 3 niveaux — Keyword (refus par mot-cle), Answer (refus par evaluation de reponse), Useful (evaluation humaine de la qualite du refus) (Section 5, p. 5).
Lien glossaire AEGIS : F15 (Sep(M) — ES2 vise directement a maximiser la separation dans l'espace d'embedding, operationnalisation directe de Sep(M))

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (modification de l'espace de representation pour la securite — PRIMAIRE), δ¹ (N/A — pas de test RAG), δ² (N/A — pas de test agent)
- **Conjectures :** C3 (separation instruction-donnee) — TRES FORTEMENT SUPPORTEE : ES2 formalise et elargit la separabilite lineaire comme mecanisme de defense ; C5 (defense architecturale > defense prompt) — SUPPORTEE : ES2 (representation-level) surpasse STL et DPL (prompt-level) ; C2 (shallow alignment) — SUPPORTEE indirectement : la separabilite lineaire montre que l'alignment est un hyperplan fragile, pas une separation profonde
- **Decouvertes :** D-003 (separabilite lineaire exploitable) — CONFIRMEE ET RETOURNEE : la vulnerabilite devient une defense ; D-015 (embedding-based defense) — CONFIRMEE avec evidence forte
- **Gaps :** G-002 (defense architecturale) — ADRESSE au niveau embedding ; G-013 (robustesse du choix de couches) — CREE : le sweet spot a 2 couches est fragile
- **Mapping templates AEGIS :** #80-#90 (attaques embedding-level), #01-#10 (GCG/AutoDAN — partiellement couvert)

### Citations cles
> "Embedding-level attacks rely on the premise that the hyperplane can be crossed with minimal perturbations that preserve the original semantics." (Section 1, p. 2)
> "Extending the constraint to three layers leads to catastrophic model collapse, rendering the model incapable of generating coherent content." (Appendix C, p. 15)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — modeles open-source, benchmarks standards, details d'implementation fournis |
| Code disponible | Non specifie dans le papier (mais references aux repos des baselines) |
| Dataset public | Oui (benchmarks standards de securite LLM) |
