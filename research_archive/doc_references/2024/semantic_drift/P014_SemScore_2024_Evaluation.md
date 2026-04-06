# P014: SemScore: Automated Evaluation of Instruction-Tuned LLMs based on Semantic Textual Similarity
**Auteurs**: Ansar Aynetdinov, Alan Akbik (Humboldt-Universitat zu Berlin)
**Venue**: arXiv preprint, fevrier 2024
> **PDF Source**: [literature_for_rag/P014_semscore.pdf](../../literature_for_rag/P014_semscore.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (51 chunks)

**Reference** : arXiv:2401.17072v2 [cs.CL]
**Nature** : [EMPIRIQUE] — proposition d'une metrique d'evaluation basee sur la STS, validee par correlation avec le jugement humain

---

## Section 1 — Resume critique

### Abstract original
> Instruction-tuned Large Language Models (LLMs) have recently showcased remarkable advancements in their ability to generate fitting responses to natural language instructions. However, many current works rely on manual evaluation to judge the quality of generated responses. Since such manual evaluation is time-consuming, it does not easily scale to the evaluation of multiple models and model variants. In this short paper, we propose a straightforward but remarkably effective evaluation metric called SEMSCORE, in which we directly compare model outputs to gold target responses using semantic textual similarity (STS). We conduct a comparative evaluation of the model outputs of 12 prominent instruction-tuned LLMs using 8 widely-used evaluation metrics for text generation. We find that our proposed SEMSCORE metric outperforms all other, in many cases more complex, evaluation metrics in terms of correlation to human evaluation.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les metriques lexicales (BLEU, ROUGE) correlent mal avec le jugement humain pour evaluer les LLMs instruction-tuned (Table 1, p.1)
- **Methode :** SemScore = cosine similarity entre embeddings de sortie du modele et reponse gold, via all-mpnet-base-v2 (Section 3.2, p.3)
- **Donnees :** 252 instructions du dataset de Wang et al. (2023c), 12 LLMs evalues (GPT-4, GPT-3.5, LLaMA, Alpaca, etc.) (Section 2, p.2)
- **Resultat :** SemScore obtient Kendall tau=0.879, Pearson r=0.970 — meilleure correlation avec le jugement humain parmi 9 metriques (Table 3, p.3)
- **Limite :** Dependance au modele d'embedding sous-jacent (all-mpnet-base-v2) ; dataset petit (N=252) ; necessite une reponse gold (Section Limitations, p.5)

### Analyse critique

**Forces :**
1. **Simplicite remarquable** — SemScore est trivialement implementable (2 etapes : embed + cosine) tout en surpassant des metriques complexes comme G-Eval (LLM-based) (Table 3, p.3).
2. **Correlation humaine superieure** — tau=0.879 et r=0.970, depassant BERTScore (tau=0.848), G-Eval-4 (tau=0.855), et tous les metriques lexicales (Table 3, p.3).
3. **Ablation informative** — montre que meme avec un transformer plus grand (DeBERTa-xlarge), SemScore reste competitif (Table 4, p.4). Le mean pooling surpasse le CLS token.
4. **Reproductible** — all-mpnet-base-v2 est public, le dataset est public.

**Faiblesses :**
1. **N = 252 instructions seulement** — dataset trop petit pour des conclusions robustes. Pas d'intervalle de confiance sur les correlations.
2. **Un seul annotateur principal** — biais potentiel (Section 2, "majority of our evaluation was carried out by one human expert").
3. **Cosine similarity comme verite** — SemScore suppose que la cosine similarity entre embeddings capture la qualite semantique, ce qui est exactement ce que P012 (Steck) remet en question.
4. **Pas de test adversarial** — que se passe-t-il si le modele genere une reponse semantiquement proche mais factuellement fausse ? SemScore ne distingue pas les hallucinations coherentes.
5. **[PREPRINT]** — non publie en conference peer-reviewed.

**Questions ouvertes :**
- SemScore est-il robuste face aux attaques qui maximisent la cosine similarity tout en injectant du contenu malveillant ?
- Comment SemScore se comporte-t-il dans le domaine medical ou la terminologie est dense et les paraphrases rares ?

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Ref papier | Lien glossaire AEGIS |
|----|---------|-------------------|------------|---------------------|
| SemScore | $\text{SemScore}(y, y^*) = \text{cosSim}(\text{Emb}(y), \text{Emb}(y^*))$ | Cosine similarity entre embeddings de reponse et gold | Section 3.2, p.3 | F22 (cosine drift), F15 (Sep(M)) |
| Kendall | $\tau = 0.879$ | Correlation de rang avec jugement humain | Table 3, p.3 | — |
| Pearson | $r = 0.970$ | Correlation lineaire avec jugement humain | Table 3, p.3 | — |

**Modele d'embedding** : all-mpnet-base-v2 (MPNet-Base fine-tune sur 1B paires, 12 couches, hidden=768) (Section 3.2, p.3)

---

## Section 3 — Critique methodologique

### Qualification epistemique
SemScore est une **heuristique** sans garantie theorique. Sa validite repose entierement sur la correlation empirique avec un jugement humain sur N=252 echantillons. Aucune borne de generalisation n'est fournie.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C5** (cosine insuffisante) | PARADOXAL | SemScore fonctionne bien (r=0.970) MAIS sur un task non-adversarial | En contexte adversarial, la cosine similarity peut etre manipulee. SemScore illustre a la fois la puissance et la fragilite de la cosine. |
| **C4** (derive semantique mesurable) | SUPPORT INDIRECT | SemScore mesure la distance semantique entre sortie et gold | Pertinent pour mesurer la derive semantique post-injection. |

### Couches delta
- **delta-2** : SemScore pourrait servir de composant de detection dans delta-2 (validation de sortie), mais sa fragilite face aux adversaires limite son utilite isolee.
- **delta-3** : SemScore NE constitue PAS une verification formelle (pas de garantie).

### Mapping AEGIS
- SemScore est le fondement conceptuel du SVC score d'AEGIS (6 dimensions). La metrique de cosine drift dans AEGIS est essentiellement un SemScore compare entre sortie attendue et sortie obtenue.

### Gaps adresses/crees
- **G-010** : SemScore montre que la cosine "fonctionne" en regime non-adversarial mais ne garantit rien en regime adversarial.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P014 |
| **Type** | Metrique d'evaluation (empirique) |
| **Domaine** | Evaluation LLM, similarite textuelle |
| **Modeles testes** | 12 LLMs (GPT-4, GPT-3.5, LLaMA, Alpaca, etc.) |
| **Metrique principale** | SemScore : tau=0.879, r=0.970 |
| **delta-layers** | delta-2 (outil potentiel), delta-3 (insuffisant) |
| **Conjectures** | C5 (paradoxal), C4 (support indirect) |
| **SVC pertinence** | 7/10 |
| **Reproductibilite** | Haute — modele et dataset publics |
| **Code disponible** | Non mentionne |
| **Dataset public** | Oui (Wang et al. 2023c, 252 instructions) |
| **Tags** | [PREPRINT], SemScore, cosine similarity, evaluation LLM, all-mpnet-base-v2 |
