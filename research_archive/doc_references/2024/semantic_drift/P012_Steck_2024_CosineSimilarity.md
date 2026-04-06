# P012: Is Cosine-Similarity of Embeddings Really About Similarity?
**Auteurs**: Harald Steck, Chaitanya Ekanadham, Nathan Kallus (Netflix Inc. & Cornell University)
**Venue**: arXiv preprint, mars 2024
> **PDF Source**: [literature_for_rag/P012_steck_cosine.pdf](../../literature_for_rag/P012_steck_cosine.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (36 chunks)

**Reference** : arXiv:2403.05440v1 [cs.IR]
**Nature** : [THEOREME] — derivation analytique montrant l'arbitraire de la cosine similarity sous certaines regularisations

---

## Section 1 — Resume critique

### Abstract original
> Cosine-similarity is the cosine of the angle between two vectors, or equivalently the dot product between their normalizations. A popular application is to quantify semantic similarity between high-dimensional objects by applying cosine-similarity to a learned low-dimensional feature embedding. This can work better but sometimes also worse than the unnormalized dot-product between embedded vectors in practice. To gain insight into this empirical observation, we study embeddings derived from regularized linear models, where closed-form solutions facilitate analytical insights. We derive analytically how cosine-similarity can yield arbitrary and therefore meaningless 'similarities.' For some linear models the similarities are not even unique, while for others they are implicitly controlled by the regularization. We discuss implications beyond linear models.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** La cosine similarity appliquee aux embeddings appris peut produire des resultats arbitraires et non uniques (Section 1, p.1)
- **Methode :** Derivation analytique en forme close pour deux objectifs de factorisation matricielle regularisee (Eq. 1 et Eq. 2, Section 2, p.3)
- **Donnees :** Simulation : n=20000 utilisateurs, p=1000 items, C=5 clusters, k=50 dimensions (Section 4, p.7)
- **Resultat :** Sous Eq.1 (denoising/dropout), cosSim depend d'une matrice diagonale arbitraire D et n'est pas unique ; sous Eq.2 (weight decay), la solution est unique mais pas necessairement optimale (Section 2.2-2.3, p.4-5)
- **Limite :** Analyse limitee aux modeles lineaires ; extension aux deep models conjecturee mais non prouvee (Conclusions, p.8)

### Analyse critique

**Forces :**
1. **Preuve formelle en forme close** — les derivations sont exactes. Resultat frappant : cosSim(B,B) = I (identite) pour un choix specifique de D, signifiant qu'aucun item n'est similaire a un autre (Section 2.2, p.5).
2. **Identification precise de la source du probleme** — c'est la matrice D arbitraire (Eq. 3, p.3) qui rend la cosine similarity non unique sous la regularisation par produit (Eq. 1).
3. **Figure 1 (p.7)** — demonstration visuelle spectaculaire : cinq heatmaps de cosine similarity radicalement differentes sur les memes donnees selon le choix de regularisation et de D.
4. **Proposition de remedes** — layer normalization, projection dans l'espace original, ou entrainement direct sur cosine similarity (Section 3, p.6).

**Faiblesses :**
1. **Modeles lineaires uniquement** — les transformers contrastifs (SBERT) utilises dans AEGIS sont profonds et non-lineaires.
2. **Pas de benchmark NLP/securite** — aucune experience sur des sentence embeddings ou la detection d'injection.
3. **Donnees simulees uniquement** — pas de validation sur des corpus reels.
4. **[PREPRINT]** — non publie en conference peer-reviewed.

**Questions ouvertes :**
- Les sentence transformers entraines par contrastive learning (NCE loss) sont-ils affectes par une non-unicite analogue ?
- Le SVC score d'AEGIS (6 dimensions) est-il sensible a la regularisation de all-MiniLM-L6-v2 ?

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Ref papier | Lien glossaire AEGIS |
|----|---------|-------------------|------------|---------------------|
| Eq.1 | $\min_{A,B} \|X - XAB^\top\|_F^2 + \lambda\|AB^\top\|_F^2$ | Objectif MF produit (denoising) | p.3, Eq. 1 | — |
| Eq.2 | $\min_{A,B} \|X - XAB^\top\|_F^2 + \lambda(\|XA\|_F^2 + \|B\|_F^2)$ | Objectif MF weight decay | p.3, Eq. 2 | — |
| Eq.3 | $\hat{A}(D) := \hat{A}D, \; \hat{B}(D) := \hat{B}D^{-1}$ | Reparametrisation diagonale invariante | p.3, Eq. 3 | — |
| Key | $\text{cosSim}(\hat{B}^{(D)}, \hat{B}^{(D)}) = \Omega_B(D) \cdot \hat{B} \cdot D^{-2} \cdot \hat{B}^\top \cdot \Omega_B(D)$ | Dependance en D de la cosSim item-item | p.4 | F22 (cosine drift) |
| Pathol. | $\text{cosSim}(B,B) = VV^\top = I$ | Cas pathologique : toute cosSim hors-diagonale = 0 | p.5 | — |

---

## Section 3 — Critique methodologique

### Qualification epistemique
Le resultat est un **theoreme exact** dans le cadre lineaire. L'hypothese de linearite est FORTE et non transposable directement aux transformers. Cependant, l'insight fondamental (la regularisation controle implicitement la cosine similarity) est un avertissement methodologique general.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C5** (cosine insuffisante) | CRITIQUE | Preuve formelle (cadre lineaire) | La cosSim peut etre arbitraire selon la regularisation. AEGIS doit calibrer ses metriques. |
| **C4** (derive semantique mesurable) | MODERE | Implication indirecte | La "derive" mesuree par cosine pourrait etre un artefact de la regularisation du modele d'embedding. |

### Couches delta
- **delta-2** : directement affecte — les filtres semantiques utilisant cosine similarity doivent etre calibres.
- **delta-3** : renforce la necessite de metriques formelles au-dela de la cosine naive.

### Gaps adresses
- **G-010** (cosine non calibree) : P012 est la source primaire de ce gap. La matrice D arbitraire pose la question de la calibration de all-MiniLM-L6-v2 dans AEGIS.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P012 |
| **Type** | Analyse theorique (embeddings) |
| **Domaine** | Systemes de recommandation, embeddings, cosine similarity |
| **Modeles testes** | Factorisation matricielle lineaire (simulation) |
| **Metrique principale** | Demonstration d'arbitraire de cosSim sous Eq.1 |
| **delta-layers** | delta-2 (calibration critique), delta-3 (necessite renforcee) |
| **Conjectures** | C5 (critique), C4 (modere) |
| **SVC pertinence** | 8/10 |
| **Reproductibilite** | Haute — derivations analytiques, donnees simulees |
| **Code disponible** | Non |
| **Dataset public** | Simule (reproductible) |
| **Tags** | [PREPRINT], cosine similarity, matrice gauge, regularisation, non-unicite |
