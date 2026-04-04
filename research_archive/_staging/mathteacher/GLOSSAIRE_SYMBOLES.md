# GLOSSAIRE DES SYMBOLES MATHEMATIQUES
## Tous les symboles utilises dans les 34 articles de la bibliographie AEGIS

**Usage** : Consultez ce document a tout moment pendant l'etude des modules.
**Classement** : Par categorie, puis par ordre d'apparition dans les modules.

---

## 1. Lettres grecques

| Symbole | Nom | Signification dans les articles | Module |
|---------|-----|--------------------------------|--------|
| alpha (α) | Alpha | Poids d'attention alpha_{ij}, seuil de confiance | M7, M2 |
| beta (β) | Beta | Coefficient de regularisation KL dans RLHF/DPO, contrainte par position beta_t | M5 |
| gamma (γ) | Gamma | Taux de decroissance dans la recuperation exacte | M5 |
| δ | Delta | Couches de defense AEGIS (δ⁰, δ¹, δ², δ³) | Tous |
| Delta_t (Δ_t) | Delta majuscule | Increment de nocivite au token t | M5 |
| eta (η) | Eta | Taux d'apprentissage (learning rate) | M5 |
| theta (θ) | Theta | Parametres du modele | M5 |
| lambda (λ) | Lambda | Coefficient de regularisation | M1, M5 |
| mu (μ) | Mu | Moyenne d'une distribution | M2, M7 |
| pi (π) | Pi | Politique (modele) : pi_theta, pi_ref, pi_aligned | M5 |
| sigma (σ) | Sigma | Ecart-type ; fonction sigmoide sigma(z) = 1/(1+e^{-z}) | M2, M5 |
| tau (τ) | Tau | Temperature dans softmax et contrastive loss | M3, M6 |

---

## 2. Notation des couches delta AEGIS

| Symbole | Unicode | Signification |
|---------|---------|---------------|
| δ⁰ | U+03B4 + U+2070 | Alignement interne du modele (RLHF, DPO) |
| δ¹ | U+03B4 + U+00B9 | Detection pre-inference (Focus Score, DMPI-PMHFE) |
| δ² | U+03B4 + U+00B2 | Validation post-inference (SemScore, cosine drift) |
| δ³ | U+03B4 + U+00B3 | Monitoring continu (ASR, metriques en temps reel) |

**Regle** : Toujours utiliser les symboles Unicode, JAMAIS "delta-0", "delta-1", etc.

---

## 3. Operateurs et fonctions

| Symbole | Nom | Definition | Module |
|---------|-----|-----------|--------|
| E[X] ou E_x[X] | Esperance | Moyenne ponderee par les probabilites | M2 |
| Var(X) | Variance | E[(X - E[X])^2] | M2 |
| Cov(X,Y) | Covariance | E[XY] - E[X]E[Y] | M2 |
| sum_{i=1}^{n} | Sommation | Additionner de i=1 a n | M1 |
| prod_{i=1}^{n} | Produit | Multiplier de i=1 a n | (rare) |
| int_a^b | Integrale | Aire sous la courbe de a a b | M4 |
| nabla_theta | Gradient | Vecteur des derivees partielles par rapport a theta | M5 |
| argmax | Argmax | Valeur qui maximise la fonction | M5 |
| argmin | Argmin | Valeur qui minimise la fonction | M5 |
| log(.) | Logarithme | Logarithme naturel (base e) sauf indication contraire | M3 |
| exp(.) | Exponentielle | e^x | M3 |
| floor(.) | Partie entiere | Plus grand entier inferieur ou egal | M6 |
| max(a, b) | Maximum | Le plus grand des deux | M5 |
| (.)_+ | Partie positive | max(0, .) | M1 |

---

## 4. Normes et distances

| Symbole | Nom | Definition | Module |
|---------|-----|-----------|--------|
| \|\|u\|\| | Norme euclidienne (L2) | sqrt(sum(u_i^2)) | M1 |
| \|\|A\|\|_F | Norme de Frobenius | sqrt(sum(a_{ij}^2)) | M1 |
| cos(u,v) | Similarite cosinus | u.v / (\|\|u\|\| * \|\|v\|\|) | M1 |
| D_KL(P \|\| Q) | Divergence KL | sum(P(x) * log(P(x)/Q(x))) | M3 |
| D(p, q) | Dissimilarite | Mesure generique de distance entre distributions | M4 |
| MSE(a, b) | Erreur quadratique moyenne | (1/n) * sum((a_i - b_i)^2) | M6 |

---

## 5. Ensembles et logique

| Symbole | Nom | Signification | Module |
|---------|-----|--------------|--------|
| R^n | Espace reel n-dimensionnel | Ensemble des vecteurs a n composantes | M1 |
| in | Appartenance | x in A signifie "x appartient a A" | M2 |
| notin | Non-appartenance | x notin A signifie "x n'appartient pas a A" | M4 |
| cap | Intersection | A cap B = elements dans A ET B | M4 |
| \|A\| | Cardinal | Nombre d'elements dans l'ensemble A | M4 |
| wedge | ET logique | a wedge b = a ET b | M4 |
| 1_A | Indicatrice | 1 si A vrai, 0 sinon | M2 |
| ~ | "Suit la loi" | x ~ p signifie "x est tire de la distribution p" | M2 |
| A* | Ensemble des chaines | Toutes les sequences finies sur l'alphabet A | M4 |
| M(A*) | Mesures sur A* | Distributions de probabilite sur les sequences | M4 |

---

## 6. Notation specifique aux LLM

| Symbole | Signification | Contexte | Module |
|---------|--------------|---------|--------|
| x | Prompt (entree) | Texte donne au modele | M5 |
| y | Reponse (sortie) | Texte genere par le modele | M5 |
| y_t | Token a la position t | Le t-eme mot de la reponse | M5 |
| y_{<t} | Tokens precedents | Tous les tokens avant la position t | M5 |
| y_{<=k} | Prefixe de k tokens | Les k premiers tokens (prefilling) | M5 |
| s | Prompt systeme | Instructions donnees au modele | M4 |
| d | Donnees utilisateur | Texte fourni par l'utilisateur | M4 |
| pi_theta(y\|x) | Probabilite conditionnelle | P(reponse y sachant prompt x) sous le modele theta | M5 |
| r(x,y) | Recompense | Score de qualite de la reponse | M5 |
| g | Modele de langage | Fonction g: A* x A* -> M(A*) | M4 |
| w | Temoin surprise | Mot-signal pour Sep(M) | M4 |
| h_t(y) | Nocivite au token t | Estimation de la dangerosité de la reponse au token t | M5 |
| I_t | Information de nocivite | Variance de la nocivite attribuable au token t | M5 |
| H_i | Tetes importantes | Ensemble des paires (couche, tete) discriminantes | M7 |
| FS | Focus Score | Score moyen d'attention sur les tetes importantes | M7 |

---

## 7. Notation matricielle

| Symbole | Signification | Module |
|---------|--------------|--------|
| A, B | Matrices d'embeddings | M1 |
| D | Matrice diagonale (jauge) | M1 |
| D^{-1} | Inverse de D | M1 |
| A^T ou A' | Transposee de A | M1 |
| Q, K, V | Query, Key, Value (attention) | M7 |
| W | Matrice de poids | M6, M7 |
| diag(d_1, ..., d_n) | Matrice diagonale | M1 |
| V_k | k premieres colonnes de V (SVD) | M1 |
| Omega_B(D) | Matrice de normalisation diagonale | M1 |

---

## 8. Abreviations courantes dans les articles

| Abreviation | Signification complete |
|-------------|----------------------|
| ASR | Attack Success Rate |
| AUROC | Area Under Receiver Operating Characteristic |
| BCE | Binary Cross-Entropy |
| CE | Cross-Entropy |
| DPO | Direct Preference Optimization |
| FN | False Negative (faux negatif) |
| FP | False Positive (faux positif) |
| FPR | False Positive Rate |
| FS | Focus Score |
| IC | Intervalle de Confiance |
| KL | Kullback-Leibler (divergence) |
| LLM | Large Language Model |
| MSE | Mean Squared Error |
| NLP | Natural Language Processing |
| ReLU | Rectified Linear Unit |
| RL | Reinforcement Learning |
| RLHF | Reinforcement Learning from Human Feedback |
| ROC | Receiver Operating Characteristic |
| SBERT | Sentence-BERT |
| Sep(M) | Score de Separation d'un modele M |
| SVD | Singular Value Decomposition |
| SVC | Semantic Vulnerability Coefficient |
| TN | True Negative (vrai negatif) |
| TP | True Positive (vrai positif) |
| TPR | True Positive Rate |
| WCE | Weighted Cross-Entropy |

---

*Glossaire genere le 2026-04-04 — 80+ symboles documentes*
*Couvre les 22 formules issues de 34 articles*
