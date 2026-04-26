# P013: Beyond Cosine Similarity: Taming Semantic Drift and Antonym Intrusion in a 15-Million Node Turkish Synonym Graph
**Auteurs**: Ebubekir Tosun, Mehmet Emin Buldur, Ozay Ezerceli, Mahmoud ElHussieni
**Venue**: arXiv preprint, janvier 2026
> **PDF Source**: [literature_for_rag/P013_semantic_drift.pdf](../../literature_for_rag/P013_semantic_drift.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (58 chunks)

**Reference** : arXiv:2601.13251v1 [cs.CL]
**Nature** : [ALGORITHME] — pipeline de clustering semantique a grande echelle avec discriminateur de relations

---

## Section 1 — Resume critique

### Abstract original
> Neural embeddings have a notorious blind spot: they can't reliably tell synonyms apart from antonyms. Consequently, increasing similarity thresholds often fails to prevent opposites from being grouped together. We've built a large-scale semantic clustering system specifically designed to tackle this problem head-on. Our pipeline chews through 15 million lexical items, evaluates a massive 520 million potential relationships, and ultimately generates 2.9 million high-precision semantic clusters. The system makes three primary contributions. First, we introduce a labeled dataset of 843,000 concept pairs spanning synonymy, antonymy, and co-hyponymy, constructed via Gemini 2.5-Flash LLM augmentation and verified using human-curated dictionary resources. Second, we propose a specialized three-way semantic relation discriminator that achieves 90% macro-F1, enabling robust disambiguation beyond raw embedding similarity. Third, we introduce a novel soft-to-hard clustering algorithm that mitigates semantic drift preventing erroneous transitive chains while simultaneously resolving polysemy.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** La cosine similarity confond synonymes et antonymes car ils apparaissent dans des contextes distribtionnels similaires (Section 1, p.1 ; Scheible et al. 2013, Rizkallah et al. 2020)
- **Methode :** Pipeline en 7 phases : (1) Fine-tuning e5-large, (2) FAISS GPU search, (3) Discriminateur 3 classes (synonyme/antonyme/co-hyponyme), (4) Filtrage confiance >= 0.70, (5-7) Clustering soft-to-hard avec voting topologique (Sections 3.1-3.7)
- **Donnees :** 15M termes turcs, 520M paires candidates, 843K paires labellisees (827K synthetiques Gemini + 16K dictionnaire), cout $65 (Table 1, Section 3.1)
- **Resultat :** 2 905 071 clusters finaux, discriminateur a 90% macro-F1, confiance > 0.98 sur cas clairs (Section Abstract + Section 3.3)
- **Limite :** Pipeline specifique au turc ; pas de validation cross-lingue ni d'application a la securite IA (Section 1, limite implicite)

### Analyse critique

**Forces :**
1. **Echelle massive** — 15M termes et 520M paires evaluees constituent un des plus grands graphes de synonymes construits (Section 3.2).
2. **Identification explicite du probleme antonymique** — les embeddings contrastifs ne distinguent pas synonymes et antonymes (Section 1, p.1). Ce probleme est directement pertinent pour la detection d'injection.
3. **Discriminateur a 3 classes** — 90% macro-F1 pour distinguer synonymie/antonymie/co-hyponymie (Section 3.3), depassant les seuils de cosine similarity naifs.
4. **Mitigation de la derive semantique** — le clustering topologique empeche les chaines transitives erronees (ex: "chaud" -> "epice" -> "douleur" -> "depression") (Section 1, p.1).
5. **Cout faible** — $65 de generation via Gemini 2.5-Flash (Section 3.1).

**Faiblesses :**
1. **Monolingue turc** — pas de transfert demontre vers l'anglais ou le francais, limitant l'applicabilite directe a AEGIS.
2. **Labels generes par LLM** — 98% des paires labellisees (827K/843K) sont synthetiques via Gemini, avec un risque de biais circulaire (Section 3.1).
3. **Pas d'application a la securite IA** — aucun test de detection d'injection, de derive semantique adversariale, ou de manipulation d'embeddings.
4. **[PREPRINT]** — non publie en conference peer-reviewed.
5. **Evaluation intrinsique uniquement** — pas de tache extrinsique (retrieval, QA, NER) pour valider l'utilite des clusters.

**Questions ouvertes :**
- Un discriminateur synonyme/antonyme peut-il detecter les attaques par injection qui preservent la cosine similarity mais inversent la semantique ?
- La derive semantique transitive observee dans les graphes de synonymes a-t-elle un analogue dans les pipelines RAG d'AEGIS ?

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Ref papier | Lien glossaire AEGIS |
|----|---------|-------------------|------------|---------------------|
| Eq.1 | $\mathcal{L}_{contrastive} = -\log \frac{\exp(\text{sim}(q, p^+)/\tau)}{\sum_i \exp(\text{sim}(q, p_i)/\tau)}$ | Contrastive loss (fine-tuning e5-large) | Section 3.1, Eq. 1 | F22 (cosine drift) |
| Eq.2 | $q_i = \lfloor 127 \cdot \frac{v_i - \min_j v_j}{\max_j v_j - \min_j v_j} \rfloor$ | Quantisation scalaire 8-bit pour FAISS | Section 3.2, Eq. 2 | — |
| Key | Seuil cosine >= 0.70 | Seuil permissif (recall > precision) | Section 3.2 | — |
| Key | Confiance discriminateur >= 0.70 | Seuil de filtrage pour synonymes | Section 3.3 | — |
| Key | Intersection-ratio >= 0.51 | Seuil anti-derive pour clusters | Appendice C | — |

**Variables cles :**
- $\tau = 0.07$ : temperature de la contrastive loss (Section 3.1)
- $k = 100$ : top-k voisins FAISS par terme (Section 3.2)
- 1.3 milliard de paires candidates apres filtrage a 0.70 (Section 3.2)

---

## Section 3 — Critique methodologique

### Qualification epistemique
Le papier est un **algorithme** sans garantie formelle de convergence ou de qualite des clusters. Le discriminateur a 90% macro-F1 est une performance empirique, pas une borne theorique. Le seuil de confiance 0.70 et le ratio d'intersection 0.51 sont des hyperparametres fixes empiriquement.

### Reproductibilite
| Question | Reponse | Impact |
|----------|---------|--------|
| Dataset public ? | Dataset 843K annonce mais non publie | Limite |
| Modele accessible ? | e5-large est public, fine-tuning non fourni | Partiel |
| Code fourni ? | Non mentionne | Non reproductible |

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C5** (cosine insuffisante) | FORT | Demonstration a grande echelle que cosine confond synonymes/antonymes | 15M termes montrent systematiquement l'intrusion antonymique sous cosine >= 0.85 (Section 1). |
| **C4** (derive semantique mesurable) | FORT | Chaines transitives documentees (chaud->epice->douleur->depression) | La derive semantique est un phenomene reel et mesurable a grande echelle. |

### Couches delta
- **δ² (Filtrage semantique)** : la cosine similarity seule est insuffisante pour la detection d'injection — un discriminateur semantique additionnel est necessaire.
- **δ³** : renforce la necessite de verification au-dela de la cosine.

### Gaps adresses/crees
- **G-010** (cosine non calibree) : P013 fournit l'evidence empirique a grande echelle que la cosine confond relations semantiques opposees.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P013 |
| **Type** | Algorithme (clustering semantique a grande echelle) |
| **Domaine** | NLP, embeddings, synonymie/antonymie |
| **Modeles testes** | multilingual-e5-large (fine-tuned), Gemini 2.5-Flash |
| **Metrique principale** | Discriminateur 90% macro-F1, 2.9M clusters |
| **delta-layers** | δ² (critique pour calibration cosine) |
| **Conjectures** | C5 (fort), C4 (fort) |
| **SVC pertinence** | 6/10 |
| **Reproductibilite** | Faible — dataset et modele fine-tune non publies |
| **Code disponible** | Non |
| **Dataset public** | Non (annonce) |
| **Tags** | [PREPRINT], antonym intrusion, semantic drift, cosine similarity, clustering, turc |
