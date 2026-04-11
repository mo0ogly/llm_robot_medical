# P016: Advancing Robust and Aligned Measures of Semantic Similarity in Large Language Models
**Auteurs**: Samarth Goel (UC Berkeley, EECS)
**Venue**: UC Berkeley Technical Report EECS-2024-84, Master's Thesis, mai 2024
> **PDF Source**: [literature_for_rag/P016_berkeley_similarity.pdf](../../assets/pdfs/P016_berkeley_similarity.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (30 chunks)

**Reference** : http://www2.eecs.berkeley.edu/Pubs/TechRpts/2024/EECS-2024-84.html
**Nature** : [EMPIRIQUE] — benchmark USMB et metrique ensemblee pour la similarite textuelle

---

## Section 1 — Resume critique

### Abstract original
> With the increasing usage of text similarity measures in conjunction with Large Language Models (LLMs), greater scrutiny and evaluation methodologies are needed to ensure the correct metric choice for a given task. In this thesis, I will evaluate the ability of text similarity measures to be robust and aligned with a human understanding of semantic similarity and assess the effectiveness of popular LLMs in maintaining semantic understanding. My core contributions are as follows. I develop and introduce the Unified semantic Similarity Metric Benchmark (USMB), a novel leaderboard for text similarity metrics composed of 10+ datasets and original tasks measuring human preference alignment, robustness, sensitivity, and clustering performance. My next contribution is the development of an ensembled text similarity measurement that achieves top scores in all tasks composing the USMB, beating the previously measured best overall score by 48.2%. I also demonstrate the robustness of this ensembled text similarity measurement on popular information retrieval tasks. Lastly, I contribute a new LLM benchmarking task titled Semantic Elasticity.
> — Source : PDF page i (Abstract)

### Resume (5 lignes)
- **Probleme :** La cosine similarity est utilisee par defaut sans evaluation systematique de sa robustesse et de son alignement avec le jugement humain (Section 2, p.2-3)
- **Methode :** (1) USMB benchmark (10+ datasets, 4 dimensions : alignement, robustesse, sensibilite, clustering), (2) Metrique ensemblee multi-modeles, (3) Tache "Semantic Elasticity" (Sections 4-6)
- **Donnees :** 10+ datasets publics couvrant STS, paraphrases, NLI, information retrieval (Section 4)
- **Resultat :** La metrique ensemblee depasse le meilleur score individuel de 48.2% sur USMB (Abstract, p.i)
- **Limite :** These de Master — pas de peer-review. Semantic Elasticity est un concept nouveau sans validation externe.

### Analyse critique

**Forces :**
1. **USMB benchmark** — premiere tentative de benchmark unifie couvrant robustesse, alignement, sensibilite et clustering pour les metriques de similarite (Goel, 2024, Section 4.5, p.19).
2. **Dimension de robustesse** — teste la stabilite des metriques face aux transformations semantiques et superficielles (paraphrases, fautes d'orthographe, perturbations) (Goel, 2024, Section 4.2, p.13).
3. **Metrique ensemblee** — combine plusieurs modeles d'embedding pour surpasser chaque modele individuel de 48.2% (Goel, 2024, Abstract, p.i).
4. **Jailbreaking mentionne** — cite explicitement les use cases de model jailbreaking comme application de la similarite textuelle (Goel, 2024, Section 2, p.3, reference [62]).
5. **Semantic Elasticity** — concept original de mesure de la capacite d'un LLM a compresser/expander l'information tout en preservant le sens (Goel, 2024, Section 6, p.25).

**Faiblesses :**
1. **These de Master, pas de peer-review** — le travail n'a pas ete soumis a evaluation par les pairs.
2. **Amelioration de 48.2% non contextualisee** — sans baseline claire et intervalle de confiance, ce chiffre est difficile a interpreter.
3. **Pas de test adversarial** — la robustesse est testee sur des perturbations benignes (fautes, paraphrases) mais pas sur des injections adversariales.
4. **Semantic Elasticity non validee** — concept prometteur mais sans comparaison avec des benchmarks existants.
5. **Pas de domaine medical** — les tests sont sur des datasets generiques.

**Questions ouvertes :**
- USMB peut-il etre etendu avec une dimension "robustesse adversariale" pour la detection d'injection ?
- La metrique ensemblee est-elle praticable en temps reel pour un pipeline de defense comme PromptGuard (P011) ?

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Ref papier | Lien glossaire AEGIS |
|----|---------|-------------------|------------|---------------------|
| Levenshtein | $\text{Lev}(s_1, s_2) = \frac{|s_1|+|s_2|-\text{EditDist}(s_1,s_2)}{|s_1|+|s_2|}$ | Ratio de distance d'edition | Section 3.1, p.4 | — |
| Jaccard | $J(s_1, s_2) = \frac{|W_1 \cap W_2|}{|W_1 \cup W_2|}$ | Similarite ensembliste | Section 3.1, p.5 | — |
| BM25+ | $\text{BM25}(d,q,D) = \sum_{t \in q} \text{IDF}(t,D) \cdot \frac{\text{TF}(t,d) \cdot (k_1+1)}{\text{TF}(t,d)+k_1(1-b+b\frac{|d|}{avgdl})+\delta}$ | Retrieval scoring | Section 3.1, p.5-6 | — |
| USMB | Score composite : alignement + robustesse + sensibilite + clustering | Benchmark unifie | Section 4.5, p.19 | — |

---

## Section 3 — Critique methodologique

### Qualification epistemique
Travail essentiellement **empirique** (benchmark + experiences) avec un concept original (Semantic Elasticity) de nature **heuristique**. Aucun resultat formel.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C5** (cosine insuffisante) | FORT | Montre que cosine seule ne domine pas sur les 4 dimensions USMB (Goel, 2024, Section 4.5, p.19) | L'ensemble surpasse la cosine de 48.2% (Goel, 2024, Abstract), confirmant que la cosine seule est sous-optimale. |
| **C4** (derive semantique mesurable) | SUPPORT | Semantic Elasticity mesure une forme de derive | Conceptuellement lie a la mesure de derive dans AEGIS. |

### Couches delta
- **delta-2** : USMB pourrait servir de reference pour evaluer les metriques de detection d'injection d'AEGIS.
- Pas d'impact direct sur delta-0, delta-1, delta-3.

### Gaps adresses/crees
- **G-010** : P016 propose une alternative systematique a la cosine naive via l'ensemble et USMB.
- **G-014** (heterogeneite metriques) : USMB est une tentative de standardisation.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P016 |
| **Type** | Benchmark + Metrique ensemblee (empirique) |
| **Domaine** | Similarite textuelle, evaluation LLM |
| **Modeles testes** | Multiples embedding models (sentence transformers) |
| **Metrique principale** | Ensemble +48.2% sur USMB |
| **delta-layers** | delta-2 (reference pour calibration) |
| **Conjectures** | C5 (fort), C4 (support) |
| **SVC pertinence** | 5/10 |
| **Reproductibilite** | Moyenne — datasets publics mais code non mentionne |
| **Code disponible** | Non mentionne |
| **Dataset public** | Oui (10+ datasets publics) |
| **Tags** | [PREPRINT], USMB, ensemble, similarite semantique, Semantic Elasticity, robustesse |
