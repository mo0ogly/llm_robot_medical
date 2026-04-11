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
| epsilon (ε) | Epsilon | Parametre de clipping (GRPO/PPO), budget perturbation (PGD), seuil I_t minimal (Recovery Penalty) | M5 [2026+RUN-003] |
| kappa (κ) | Kappa | Kappa de Cohen pondere (accord inter-juges DLSS) | M4 [RUN-003] |

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
| s(i) | Score de silhouette | (b(i)-a(i)) / max(a(i),b(i)) | M5 [2026] |
| a(i) | Distance intra-classe | Distance cosinus moyenne au meme mode | M5 [2026] |
| b(i) | Distance inter-classe | Distance cosinus moyenne au mode le plus proche | M5 [2026] |

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
| G | Taille du groupe | Nombre de reponses generees par GRPO | M5 [2026] |
| A_hat_i | Avantage relatif | Score normalise par rapport au groupe (GRPO) | M5 [2026] |
| delta* | Perturbation optimale | Pire perturbation adversariale trouvee par PGD | M5 [2026] |
| Y_p | Reponse preferee | Reponse safe/helpful dans DPO/ADPO | M5 [2026] |
| Y_r | Reponse rejetee | Reponse harmful dans DPO/ADPO | M5 [2026] |
| x_I | Image d'entree | Input visuel pour les VLM | M5 [2026] |
| x_T | Texte d'entree | Input textuel pour les VLM | M5 [2026] |
| z_no, z_yes | Logits du juge | Scores bruts avant softmax pour "No"/"Yes" | M4 [2026] |
| F(X) | Logit gap | z_no - z_yes, decision flip metric | M4 [2026] |
| CHER_k | Clinical Harm Event Rate | Proportion de reponses a severite >= k | M4 [2026] |
| DR_d | Defense Rate | Taux de resistance sur la dimension d | M4 [2026] |
| SAM | Safety Alignment Margin | Coefficient de silhouette moyen sur logits | M5 [2026] |
| C (CoSA) | Composite Safety-Helpfulness | Moyenne de h_i * s_i | M5 [2026] |
| MR | Misinformation Rate | Taux de desinformation medicale | M2 [2026] |
| AmpFactor | Facteur d'amplification | MR_condition / MR_baseline | M2 [2026] |
| DIS | Defense Inversion Score | 1 - ASR(Invert(a)) | M4 [RUN-003] |
| ESR | Evasion Success Rate | Prompts echappant au guardrail / total adversarial | M4 [RUN-003] |
| MTSD | Multi-Turn Safety Degradation | (S1 - ST) / S1 * 100% | M4 [RUN-003] |
| S_final | Dual-LLM Safety Score | (S_judge1 + S_judge2) / 2 | M4 [RUN-003] |
| f_prof, f_med, f_eth, f_dist | Dimensions 4DLF | Scores BERT [0,1] par dimension linguistique | M4 [RUN-003] |
| PBR | Paraphrase Bypass Rate | Paraphrases nocives / total paraphrases | M4 [RUN-003] |
| ASR_PIDP | PIDP Compound ASR | P(success \| PI inter DP) | M4 [RUN-003] |
| Delta_ASR | Gain marginal PIDP | ASR_PIDP - max(ASR_PI, ASR_DP) | M4 [RUN-003] |
| PIR(k) | Persistent Injection Rate | Requetes touchees / total requetes | M4 [RUN-003] |
| V_poison | Vecteurs empoisonnes | Ensemble des vecteurs malveillants dans le RAG | M4 [RUN-003] |
| ARF | ASR Reduction Factor | ASR_baseline / ASR_AIR | M4 [RUN-003] |
| Sec(g), Eff(g), Util(g) | Triplet SEU | Securite, efficience, utilite d'un guardrail | M4 [RUN-003] |
| T(g) | Vecteur taxonomie 6D | [stage, paradigm, granularity, react, applic, explain] | M4 [RUN-003] |
| I_t (exact) | Harm Info positionnelle | Cov[E[H\|x<=t], score_function] | M5 [RUN-003] |
| D_KL^eq(t) | KL Equilibrium | Divergence KL position-dependante, propto I_t | M5 [RUN-003] |
| L_RP | Recovery Penalty | L_RLHF + lambda * penalite positions faibles | M5 [RUN-003] |
| p* | Prompt optimal | argmax E[S_review] (injection iterative) | M5 [RUN-003] |
| M_sim | Modele simule | Proxy de revieweur pour optimisation | M5 [RUN-003] |
| S_review | Score de review | Score d'evaluation de la review generee | M5 [RUN-003] |
| WIRT(x) | Classement d'importance | argsort(\|dL/de(w_i)\|) des mots par gradient | M6 [RUN-003] |
| R | Matrice de rotation | Rotation orthogonale (R^T R = I, det(R) = 1) | M6 [RUN-003] |
| e'_data | Embedding transforme | R * e(x_t), donnee dans l'espace tourne | M6 [RUN-003] |
| Sep_ASIDE | Amelioration separation | Sep(M_+ASIDE) - Sep(M_base) | M6 [RUN-003] |

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
| R | Matrice de rotation orthogonale (R^T R = I) | M6 [RUN-003] |

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
| ADPO | Adversary-Aware Direct Preference Optimization |
| CHER | Clinical Harm Event Rate |
| CoSA | Composite Safety-Helpfulness Score |
| DR | Defense Rate |
| FNR | False Negative Rate |
| GRPO | Group Relative Policy Optimization |
| ICC | Intraclass Correlation Coefficient |
| LRM | Large Reasoning Model |
| PGD | Projected Gradient Descent |
| PPO | Proximal Policy Optimization |
| SAM | Safety Alignment Margin |
| SPP | System Prompt Poisoning |
| VLM | Vision Language Model |
| 4DLF | Four-Dimensional Linguistic Feature Vector |
| AIR | Augmented Intermediate Representations |
| ARF | ASR Reduction Factor |
| ASIDE | Architectural Separation of Instructions and Data in Embeddings |
| DIS | Defense Inversion Score |
| DLSS | Dual-LLM Safety Score |
| DP | Database Poisoning |
| ESR | Evasion Success Rate |
| IIOS | Iterative Injection Optimization Score |
| MTSD | Multi-Turn Safety Degradation |
| PBR | Paraphrase Bypass Rate |
| PI | Prompt Injection |
| PIDP | Prompt Injection + Database Poisoning |
| PIR | Persistent Injection Rate |
| RP | Recovery Penalty |
| SEU | Security-Efficiency-Utility |
| WIRT | Word Importance Ranking Transfer |
| AHD | Attention Head-level Dropout |
| CoT | Chain-of-Thought |
| H-CoT | Hijacked Chain-of-Thought |
| MSBE | Multi-Step Boundary Erosion |
| SEAL | Stacked Encryption Attack on LLMs |
| SFR | Safety Failure Rate |
| STAR | State-Transition Attack on Reasoning |

---

## 9. Symboles LRM et Multi-Tour (RUN-005, Module 8)

| Symbole | Nom | Signification dans les articles | Module |
|---------|-----|--------------------------------|--------|
| S_k | Etat interne LRM | Etat a l'etape k du raisonnement | M8 |
| F(S_k, x) | Fonction de transition | Passage de l'etat k a k+1 | M8 |
| T_k | Trace visible (CoT) | V(S_k), partie observable du raisonnement | M8 |
| T_E | Phase d'execution | Sous-phase de resolution du probleme | M8 |
| T_J | Phase de justification | Sous-phase de verification de securite | M8 |
| T_F | Phase de formatage | Sous-phase de mise en forme | M8 |
| O(x) | Sortie finale | S_N, dernier etat = reponse | M8 |
| H(T_E \| x) | Entropie conditionnelle | Incertitude de T_E sachant x | M8 |
| I(X; Y) | Information mutuelle | Quantite d'information partagee entre X et Y (contexte securite) | M8 |
| Enc_{K_i} | Chiffrement | i-eme algorithme de chiffrement (Caesar, Atbash, ASCII, HEX) | M8 |
| p* | Prompt chiffre empile | Resultat du chiffrement en cascade | M8 |
| pi_t(g) | Politique softmax bandit | Probabilite de choisir la combinaison g a l'iteration t | M8 |
| S_t(g) | Score de preference | Score bandit pour la combinaison g a l'iteration t | M8 |
| r_t | Recompense bandit | 1 si attaque reussie, 0 sinon (contexte SEAL) | M8 |
| r_bar_t | Recompense moyenne | Baseline pour la mise a jour du gradient bandit | M8 |
| L_LM(P, y_I) | Loss adversariale | -log P_target(y_I \| P), perte NLL | M8 |
| L_transfer | Loss de transfert | Moyenne de L_LM sur r modeles surrogates | M8 |
| y_I | Reponse ciblee | Reponse nocive que l'attaquant vise | M8 |
| r_t (STAR) | Reponse tour t | M(H_{t-1} + p_t), reponse du modele au tour t | M8 |
| H_t | Historique conversation | Historique cumule : H_{t-1} U {(p_t, r_t)} | M8 |
| q_0 | Requete softened | Reformulation benigne maximisant cos(phi(q), phi(c)) | M8 |
| Delta_t | Signal de durcissement | Positif = modele resiste, negatif = modele s'assouplit | M8 |
| M_A | Modele attaquant | Modele generant les prompts multi-tour | M8 |
| r^(l) | Direction de refus | mu^(l) - nu^(l), vecteur de separation nocif/benin a la couche l | M8 |
| mu^(l) | Moyenne activations nocives | Centroide sur D_harmful a la couche l | M8 |
| nu^(l) | Moyenne activations benines | Centroide sur D_harmless a la couche l | M8 |
| s_h(p) | Score d'influence tete | \|O_h(p) . r\| / \|\|r\|\|, contribution de la tete h au refus | M8 |
| O_h(p) | Sortie tete h | Vecteur de sortie de la tete d'attention h pour le prompt p | M8 |
| p_drop | Taux de dropout AHD | Probabilite de desactiver chaque tete pendant l'entrainement | M8 |
| M (masque) | Masque Bernoulli | Masque binaire pour le dropout des tetes | M8 |
| c_i | Indice d'acteur | Role de l'acteur-reseau au tour i (ActorBreaker) | M8 |
| z_{1..n} | Chaine de raisonnement | Raisonnement accumule pour la generation multi-tour | M8 |
| SFR(M, k) | Safety Failure Rate | Proportion de dialogues ou J = 5 au tour k | M8 |
| J(q, r) | Juge de securite | Score [1,5], 5 = violation complete | M8 |
| Delta_refusal(L) | Variation du refus | RefusalRate(L) - RefusalRate(L_0), instabilite contexte long | M8 |

---

*Glossaire mis a jour le 2026-04-07 (RUN-005) — 170+ symboles documentes*
*Couvre les 45 formules issues de 76+ articles (22 RUN-001 + 15 RUN-002 + 17 RUN-003 + 8 RUN-005)*
