# P014 : SemScore -- Automated Evaluation of Instruction-Tuned LLMs based on Semantic Textual Similarity

## [Aynetdinov & Akbik, 2024] -- SemScore: Automated Evaluation of Instruction-Tuned LLMs based on Semantic Textual Similarity

**Reference :** arXiv:2401.17072v2 [cs.CL]
**Revue/Conf :** arXiv preprint, Humboldt-Universitat zu Berlin, fevrier 2024
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P014_semscore.pdf](../../assets/pdfs/P014_semscore.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (51 chunks). Non publie en conference peer-reviewed.

### Abstract original
> Instruction-tuned Large Language Models (LLMs) have recently showcased remarkable advancements in their ability to generate fitting responses to natural language instructions. However, many current works rely on manual evaluation to judge the quality of generated responses. Since such manual evaluation is time-consuming, it does not easily scale to the evaluation of multiple models and model variants. In this short paper, we propose a straightforward but remarkably effective evaluation metric called SEMSCORE, in which we directly compare model outputs to gold target responses using semantic textual similarity (STS). We conduct a comparative evaluation of the model outputs of 12 prominent instruction-tuned LLMs using 8 widely-used evaluation metrics for text generation. We find that our proposed SEMSCORE metric outperforms all other, in many cases more complex, evaluation metrics in terms of correlation to human evaluation.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les metriques lexicales (BLEU, ROUGE) correlent mal avec le jugement humain pour evaluer les LLM instruction-tuned, et l'evaluation manuelle ne passe pas a l'echelle (Aynetdinov & Akbik, 2024, Section 1, p. 1)
- **Methode :** SemScore = cosine similarity entre embeddings de sortie du modele et reponse gold, via all-mpnet-base-v2 (MPNet-Base fine-tune sur 1B paires, 12 couches, hidden=768) (Aynetdinov & Akbik, 2024, Section 3.2, p. 3)
- **Donnees :** 252 instructions du dataset de Wang et al. (2023c), 12 LLM evalues (GPT-4, GPT-3.5, LLaMA, Alpaca, Vicuna, WizardLM, etc.), evaluation humaine par categories A-D converties en scores 1-4 (Aynetdinov & Akbik, 2024, Section 2, p. 2)
- **Resultat :** SemScore obtient Kendall tau = 0.879 et Pearson r = 0.970 -- meilleure correlation avec le jugement humain parmi 9 metriques evaluees, devancant G-Eval-4 (tau=0.855, r=0.863), BERTScore (tau=0.848, r=0.944), ROUGE-L (tau=0.788), BLEU (tau=0.667) (Aynetdinov & Akbik, 2024, Table 3, p. 3)
- **Limite :** Dependance au modele d'embedding sous-jacent (all-mpnet-base-v2) ; dataset petit (N=252) ; necessite une reponse gold de reference ; un seul annotateur principal (Aynetdinov & Akbik, 2024, Section "Limitations")

### Analyse critique

**Forces :**

1. **Simplicite remarquable et performance superieure.** SemScore est implementable en 2 etapes (embed + cosine similarity) tout en surpassant des metriques bien plus complexes. G-Eval-4, qui requiert GPT-4 pour scorer chaque reponse, obtient seulement tau=0.855 contre tau=0.879 pour SemScore (Aynetdinov & Akbik, 2024, Table 3, p. 3). Cette simplicite est un atout majeur pour le deploiement en production.

2. **Comparaison exhaustive avec 8 metriques.** Le papier compare SemScore a BLEU, ROUGE-L, BERTScore, BARTScore, BARTScore-para, BLEURT, DiscoScore et G-Eval dans 3 configurations (G-Eval-3.5-instruct, G-Eval-3.5*, G-Eval-4*). La superiorite de SemScore est consistante sur les deux mesures de correlation (tau et r) (Aynetdinov & Akbik, 2024, Table 3, p. 3).

3. **Ablation sur le modele d'embedding.** L'evaluation inclut DeBERTa-xlarge-mnli comme alternative a all-mpnet-base-v2. SemScore avec DeBERTa-Mean obtient tau=0.870 et r=0.929, confirmant la robustesse de l'approche meme avec un modele different. Le mean pooling surpasse systematiquement le CLS token (tau=0.756 pour DeBERTa-CLS) (Aynetdinov & Akbik, 2024, Table 4, p. 4).

4. **Reproductibilite complete.** all-mpnet-base-v2 est public sur HuggingFace, le dataset de Wang et al. (2023c) est public, les 252 instructions et reponses gold sont accessibles. La metrique est deterministe (pas de variabilite liee a un LLM-juge).

**Faiblesses :**

1. **N = 252 instructions.** Le dataset est trop petit pour des conclusions robustes. Aucun intervalle de confiance n'est rapporte sur les correlations tau et r. Avec N=252, la variance d'echantillonnage des correlations est non negligeable, et un bootstrap IC95% aurait ete necessaire.

2. **Un seul annotateur principal.** Le jugement humain de reference repose majoritairement sur un seul expert (Aynetdinov & Akbik, 2024, Section 2, "majority of our evaluation was carried out by one human expert"). Le biais intra-annotateur n'est pas quantifie (pas de kappa intra-annotateur), et la reproductibilite du jugement humain n'est pas verifiee.

3. **Cosine similarity comme proxy de qualite semantique.** SemScore suppose implicitement que la cosine similarity entre embeddings capture la qualite de la reponse. Cette hypothese est fragile : une reponse semantiquement proche mais factuellement fausse (hallucination coherente) obtiendrait un score eleve. Steck et al. (2024, P012, Section 2.2) remettent precisement en question la capacite de la cosine similarity a capturer les nuances semantiques.

4. **Pas de test adversarial.** Que se passe-t-il si un modele genere une reponse deliberement optimisee pour maximiser la cosine similarity avec la reponse gold tout en injectant du contenu malveillant ? SemScore est potentiellement manipulable en contexte adversarial (gap identifie par l'analyste, non aborde dans Aynetdinov & Akbik, 2024).

5. **Statut preprint.** Non publie en conference peer-reviewed. Les resultats n'ont pas ete valides par des reviewers externes.

6. **Limitation au regime non-adversarial.** SemScore est evalue sur des taches d'instruction-following standard, pas sur des scenarios ou la sortie est potentiellement compromise. Son comportement en regime adversarial (post-injection) est inconnu.

**Questions ouvertes :**
- SemScore est-il robuste face aux attaques qui maximisent la cosine similarity tout en injectant du contenu malveillant ?
- Comment SemScore se comporte-t-il dans le domaine medical ou la terminologie est dense et les paraphrases rares ?
- Le bias de all-mpnet-base-v2 vers les participants nominaux (Nikolaev & Pado, 2023, cite par les auteurs Section 3.4) affecte-t-il la fiabilite en domaine specialise ?

### Formules exactes

**SemScore** (Aynetdinov & Akbik, 2024, Section 3.2, p. 3) :
```
SemScore(y, y*) = cosSim(Emb(y), Emb(y*))
```
ou `y` est la sortie du modele, `y*` la reponse gold, et `Emb()` l'embedding via all-mpnet-base-v2.

**Correlations** (Aynetdinov & Akbik, 2024, Table 3, p. 3) :
| Metrique | Kendall tau | Pearson r |
|---|---|---|
| SemScore | 0.879 | 0.970 |
| G-Eval-4* | 0.855 | 0.863 |
| G-Eval-3.5* | 0.855 | 0.831 |
| BERTScore | 0.848 | 0.944 |
| G-Eval-3.5-instruct | 0.840 | 0.911 |
| ROUGE-L | 0.788 | 0.933 |
| BARTScore | 0.788 | 0.621 |
| BARTScore-para | 0.697 | 0.884 |
| BLEU | 0.667 | 0.865 |
| BLEURT | 0.485 | 0.485 |
| DiscoScore | 0.364 | 0.583 |

Note : G-Eval-4* et G-Eval-3.5* excluent les evaluations des modeles GPT correspondants du calcul de correlation (Aynetdinov & Akbik, 2024, Table 3, note de bas).

**Modele d'embedding** : all-mpnet-base-v2 (MPNet-Base, 12 couches, hidden=768, fine-tune contrastif sur 1B paires de phrases) (Aynetdinov & Akbik, 2024, Section 3.2, p. 3)

Lien glossaire AEGIS : F22 (cosine drift -- SemScore est conceptuellement le fondement du cosine drift dans AEGIS), F15 (Sep(M) -- mesure apparentee de separation semantique)

### Pertinence these AEGIS

- **Couches delta :** δ² (SemScore pourrait servir de composant de detection dans δ² comme validation de sortie post-inference -- comparer la reponse obtenue a une reponse attendue) ; δ³ (SemScore ne constitue PAS une verification formelle : pas de garantie, pas de borne, pas de preuve de completude)
- **Conjectures :**
  - C4 (derive semantique mesurable) : **support indirect** -- SemScore mesure la distance semantique entre sortie et gold, ce qui est directement pertinent pour mesurer la derive semantique post-injection. Si une injection modifie la reponse, le SemScore baisse. Mais sans borne theorique, la fiabilite en regime adversarial n'est pas garantie.
  - C5 (cosine insuffisante) : **position paradoxale** -- SemScore fonctionne bien (r=0.970, Aynetdinov & Akbik, 2024, Table 3) en regime non-adversarial, mais sa fragilite face aux adversaires (hallucinations coherentes, optimisation cosine) limite son utilite comme seule defense. SemScore illustre a la fois la puissance et la fragilite de la cosine similarity.
- **Decouvertes :**
  - D-014 (cosine comme proxy de qualite) : SemScore est le fondement conceptuel du SVC score d'AEGIS (6 dimensions). La metrique de cosine drift dans AEGIS est essentiellement un SemScore compare entre sortie attendue et sortie obtenue post-injection.
- **Gaps :**
  - G-010 (cosine en regime adversarial) : **partiellement adresse** -- SemScore montre que la cosine "fonctionne" en regime non-adversarial mais ne garantit rien en regime adversarial. Le gap entre les deux regimes est exactement ce que la these AEGIS doit quantifier.
- **Mapping templates AEGIS :** SemScore pourrait etre utilise comme metrique de detection dans le pipeline AEGIS : une chute de SemScore entre reponse attendue et reponse obtenue signale une potentielle injection. Lie aux templates de manipulation semantique (#36-#60).

### Citations cles
> "SEMSCORE metric outperforms all other, in many cases more complex, evaluation metrics in terms of correlation to human evaluation" (Aynetdinov & Akbik, 2024, Abstract, p. 1)
> "SemScore compares favorably even with a transformer not specifically fine-tuned for STS" (Aynetdinov & Akbik, 2024, Section 3.4, Table 4, p. 4)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Haute -- modele all-mpnet-base-v2 public sur HuggingFace, dataset Wang et al. (2023c) public, metrique deterministe |
| Code disponible | Non mentionne |
| Dataset public | Oui -- 252 instructions de Wang et al. (2023c) |
| Nature epistemique | [HEURISTIQUE] -- metrique empirique sans garantie theorique de qualite ; validite limitee au regime non-adversarial et au dataset evalue (N=252) |
