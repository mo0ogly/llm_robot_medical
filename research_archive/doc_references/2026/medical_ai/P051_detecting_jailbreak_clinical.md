# P051: Detecting Jailbreak Attempts in Clinical Training LLMs Through Automated Linguistic Feature Extraction
**Auteurs**: Tri Nguyen, Huy Hoang Bao Le, Lohith Srikanth Pentapalli, Laurah Turner, Kelly Cohen (University of Cincinnati)
**Venue**: arXiv:2602.13321v1 [cs.AI], fevrier 2026 (preprint)
> **PDF Source**: [literature_for_rag/P051_2602.13321.pdf](../../literature_for_rag/P051_2602.13321.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (52 chunks)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Nguyen et al. proposent un cadre de detection des tentatives de jailbreak dans les LLM d'entrainement clinique (plateforme 2-Sigma) reposant sur l'extraction automatisee de quatre caracteristiques linguistiques : Professionnalisme, Pertinence Medicale, Comportement Ethique et Distraction Contextuelle. Le systeme utilise une architecture en deux couches : la premiere couche est constituee de modeles BERT fine-tunes qui predisent des scores continus pour chaque dimension linguistique, et la seconde couche applique des classifieurs traditionnels (Random Forest, XGBoost, Naive Bayes, etc.) sur le vecteur quadri-dimensionnel resultant pour la classification binaire jailbreak/non-jailbreak.

### Methodologie

Le dataset provient de la phase d'evaluation initiale de 2-Sigma : 158 conversations totalisant 2 302 prompts, annotes par 6 annotateurs humains sur 4 dimensions ordinales (Section 3.1, p. 4). Chaque dimension utilise une echelle specifique : non-professionnel/limite/appropriate pour le Professionnalisme ; non-pertinent/partiellement pertinent/pertinent pour la Pertinence Medicale ; dangereux/dangereux/douteux/principalement sur/sur pour le Comportement Ethique ; tres distrayant/moderement distrayant/douteux/pas distrayant pour la Distraction Contextuelle. Les annotations categoriques sont converties en cibles de regression continues.

Sept modeles BERT sont fine-tunes comme regresseurs : BERT-Base, BERT-Large, DistilBERT, RoBERTa-Base, DeBERTa-v3-Large, BioBERT et PubMedBERT (Table 5, p. 14). Le meilleur modele par dimension est selectionne sur la base du RMSE : DistilBERT pour le Professionnalisme (RMSE=0.4441, R²=0.5939), BERT pour la Pertinence Medicale (RMSE=0.4630, R²=0.5983), BioBERT pour le Comportement Ethique (RMSE=0.5751, R²=0.4965) et BioBERT pour la Distraction Contextuelle (RMSE=0.6701, R²=0.6147) (Table 2, p. 7).

### Resultats cles

- **Meilleure performance test** : Random Forest — Accuracy 0.9004, F1 0.7812, ROC-AUC 0.8712 (Table 3, p. 8)
- **Cross-validation** : Logistic Regression et Naive Bayes legers favoris (Accuracy 0.9127, ROC-AUC ~0.9666) (Table 4, p. 9)
- **Comparaison avec annotations humaines directes** : les classifieurs entraines sur les annotations humaines atteignent des F1 superieurs (FDT: 0.8710 vs 0.7692 sur features automatiques) (Table 7, p. 15), confirmant la propagation d'erreur attendue de la couche 1 a la couche 2
- **Ecart Decision Tree simple vs Fuzzy Decision Tree** : gap substantiel (F1 0.6423 vs 0.7692 sur test), demontrant la valeur des frontieres de decision floues pour les deviations linguistiques subtiles (Section 4, p. 9)

### Limitations admises par les auteurs

Les auteurs identifient (Section 4-5, p. 9-12) : (1) les faux negatifs lies a des injections subtiles ou humoristiques hors de la capacite expressive des 4 dimensions, (2) les ambiguites d'annotation entrainant des faux positifs sur des messages informels mais benins, (3) l'absence de modelisation multi-tour -- chaque prompt est evalue isolement, sans evolution temporelle du risque de jailbreak au sein d'une conversation, (4) la taille modeste du dataset (158 conversations, 2 302 prompts).

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Lien glossaire AEGIS |
|----|---------|-------------------|----------------------|
| F43 | $$f(x) = [f_{prof}(x), f_{med}(x), f_{eth}(x), f_{dist}(x)]$$ | Vecteur quadri-dimensionnel, chaque composante dans [0,1] via BERT, classification $\hat{y} = \text{Classifier}(f(x))$ | F43 (4DLF - Four-Dimensional Linguistic Feature Vector) |
| RMSE | $$\text{RMSE} = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(\hat{y}_i - y_i)^2}$$ | Eq. 1, Section 3.2, p. 6 | Standard statistique |
| R² | $$R^2 = 1 - \frac{\sum_{i=1}^{n}(y_i - \hat{y}_i)^2}{\sum_{i=1}^{n}(y_i - \bar{y})^2}$$ | Eq. 2, Section 3.2, p. 7 | Standard statistique |

**Variables** :
- $f_{prof}(x)$ : score de Professionnalisme predit par DistilBERT (RMSE 0.4441)
- $f_{med}(x)$ : score de Pertinence Medicale predit par BERT (RMSE 0.4630)
- $f_{eth}(x)$ : score de Comportement Ethique predit par BioBERT (RMSE 0.5751)
- $f_{dist}(x)$ : score de Distraction Contextuelle predit par BioBERT (RMSE 0.6701)

**Nature epistemique** : [EMPIRIQUE] — pas de garantie theorique de convergence ou de borne de generalisation. Performance mesuree par cross-validation et test set.

---

## Section 3 — Critique methodologique

### Forces

1. **Interpretabilite** — le vecteur 4D fournit une explication semantique directe de la prediction (quelle dimension declenche l'alerte), contrairement aux approches boite noire (GradSafe, JBShield) (Section 2, p. 2-4).
2. **Architecture modulaire** — la separation extraction/classification permet de substituer des modeles a chaque couche independamment (Section 3, p. 5).
3. **Domaine medical concret** — 2-Sigma est une vraie plateforme de simulation clinique, pas un benchmark synthetique (Section 1, p. 1).
4. **Analyse d'erreurs detaillee** — les faux positifs et faux negatifs sont analyses qualitativement avec des exemples concrets, identifiant des patterns systematiques (Section 4, p. 9-11).
5. **Comparaison controlee** — la performance avec features automatiques vs annotations humaines directes (Table 3 vs Table 7) isole precisement l'erreur de propagation.

### Faiblesses

1. **Dataset modeste** — 158 conversations, 2 302 prompts, 6 annotateurs. Loin du N >= 30 par condition dans un setting diversifie. Les conversations de test ne sont que 11 (281 prompts) (Section 3.1, p. 5).
2. **Single-turn uniquement** — chaque prompt est evalue isolement. La dynamique de jailbreak progressif au sein d'une conversation est ignoree, ce qui est la limitation la plus critique pour le contexte clinique (Section 5, p. 12).
3. **R² modeste pour certaines dimensions** — Comportement Ethique (R²=0.4965) et Professionalism (R²=0.5939) indiquent que presque la moitie de la variance n'est pas capturee (Table 2, p. 7).
4. **Pas de baseline adversariale** — aucun adversaire adaptatif n'est evalue. Le robustesse contre des attaques deliberement concues pour contourner les 4 dimensions est inconnue.
5. **Pas de comparaison avec les detecteurs de l'etat de l'art** — pas de confrontation avec JBShield, HiddenDetect, GradSafe, ou les approches par perplexite, tous cites dans la revue de litterature.
6. **Preprint** — pas encore peer-reviewed.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C3** (alignement superficiel) | MODEREE | Indirect : les deviations linguistiques sont detectables par un classifieur simple, suggerant des patterns de surface | Le fait que des classifieurs lineaires (LR) performent presque aussi bien que les ensembles (RF) (Table 3) suggere que les signaux de jailbreak sont proches de lineairement separables dans l'espace 4D |
| **C4** (derive semantique mesurable) | FORT | Le vecteur 4D capture quantitativement la derive entre prompts benins et jailbreak | La dimension Distraction Contextuelle est la plus discriminante (R²=0.6147 pour BioBERT, Table 2) |
| **C6** (domaine medical plus vulnerable) | MODEREE | L'etude est specifique au domaine clinique, mais N insuffisant pour generaliser | Les types d'erreurs identifiees (humour clinique, prompts mixtes) sont specifiques au contexte medical |

### Couches delta

- **delta-1 (system prompt)** : non evalue directement, mais le cadre pourrait detecter des tentatives de contournement du prompt systeme via la dimension Professionalism.
- **delta-2 (detection/classification)** : c'est la couche cible du papier. L'architecture en deux couches constitue un mecanisme δ² complementaire au modele cosine-drift AEGIS.
- **delta-3** : non applicable.

### Formules AEGIS impactees

- **F43 (4DLF)** : definie et calibree par P051. Le vecteur 4D offre une representation complementaire a la mesure cosine-drift AEGIS (all-MiniLM-L6-v2). La question ouverte est de savoir si la combinaison 4DLF + cosine-drift surpasse chaque methode independamment.
- **Lien SVC** : les 4 dimensions linguistiques (Professionnalisme, Pertinence Medicale, Ethique, Distraction) peuvent etre mappees sur 4 des 6 dimensions SVC d'AEGIS (Zhang et al., 2025, arXiv:2501.18632v2).

### Decouverte D-001 (Triple Convergence)

P051 ne contribue pas directement a D-001 (pas d'etude attaque/defense croisee), mais l'analyse d'erreurs revele que certains jailbreaks contournent les 4 dimensions simultanement (subtilite, humour, contenu mixte), confirmant indirectement que la detection δ² seule est insuffisante.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P051 |
| **Type** | Defense (detection) |
| **Domaine** | Securite LLM clinique, detection de jailbreak, NLP |
| **Modeles utilises** | BERT-Base, BERT-Large, DistilBERT, RoBERTa-Base, DeBERTa-v3-Large, BioBERT, PubMedBERT (extraction) ; DT, FDT, RF, LGBM, XGBoost, LR, NB (classification) |
| **Dataset** | 2-Sigma : 158 conversations, 2 302 prompts, 6 annotateurs, split train/test par conversation (147/11) |
| **Metrique principale** | RF test : Accuracy 0.9004, F1 0.7812, ROC-AUC 0.8712 (Table 3, p. 8) |
| **delta-layers** | δ² (detection/classification), δ¹ (implicite) |
| **Conjectures** | C3 (moderee), C4 (fort), C6 (moderee) |
| **Reproductibilite** | Moyenne — code non public, dataset non public (2-Sigma proprietaire), mais protocole detaille |
| **Code disponible** | Non |
| **Dataset public** | Non (plateforme 2-Sigma proprietaire) |
| **SVC pertinence** | 7/10 |
| **Tags** | [PREPRINT], 4DLF, BERT, detection clinique, interpretabilite, multi-classifieur |
