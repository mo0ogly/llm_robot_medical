# MATHEUX Report — RUN-003 (P047-P060)

> **Agent**: MATHEUX | **Date**: 2026-04-04 | **Scope**: 14 papers (P047-P060)
> **Baseline**: 37 formules (F01-F37, sections 1.1-8.15)
> **Objectif**: Extraction incrementale des formules/metriques nouvelles

---

## Nouvelles Formules Extraites

### F38 — Defense Inversion Score (DIS)
- **Source**: P047, Section 3 (Defense framework)
- **Formule**:
$$\text{DIS}(a) = 1 - \text{ASR}(\text{Invert}(a))$$
ou $\text{Invert}(a)$ est la technique d'attaque $a$ inversee en mecanisme defensif, et $\text{ASR}$ est le taux de succes d'attaque residuel apres application de la defense inversee.
- **Description**: Mesure l'efficacite d'une defense construite par inversion d'une technique d'attaque. Le principe de dualite attaque-defense (P047) stipule que les mecanismes d'attaque (context ignoring, instruction emphasis) peuvent etre retournes en protections. DIS = 1 signifie defense parfaite, DIS = 0 signifie que l'inversion est inefficace.
- **Variables**:
  - $a$ = technique d'attaque originale (context ignoring, instruction emphasis, etc.)
  - $\text{Invert}(a)$ = transformation de la technique offensive en technique defensive
  - $\text{ASR}$ = Attack Success Rate residuel (cf. F22/section 3.4)
- **Dependances**: F22 (ASR, section 3.4)
- **Couche delta concernee**: delta-1 (instruction-level defense)
- **Conjecture liee**: C2 (attack-defense duality)

---

### F39 — Evasion Success Rate (ESR)
- **Source**: P049, Section 4 (Evaluation framework)
- **Formule**:
$$\text{ESR}(g, t) = \frac{|\{x \in \mathcal{X}_{adv} : g(t(x)) = \text{benign}\}|}{|\mathcal{X}_{adv}|}$$
ou $g$ est le systeme de guardrail, $t$ est la technique d'evasion (character injection ou AML), et $\mathcal{X}_{adv}$ est l'ensemble des prompts adversariaux.
- **Description**: Mesure la proportion de prompts adversariaux qui echappent a la detection d'un guardrail apres application d'une technique d'evasion. Hackett et al. demontrent un ESR atteignant 100% contre Azure Prompt Shield et Meta Prompt Guard en utilisant des techniques d'injection de caracteres. C'est la metrique complementaire a l'ASR : l'ASR mesure si l'attaque reussit aupres du LLM, l'ESR mesure si l'attaque echappe au gardien.
- **Variables**:
  - $g$ = systeme guardrail (Azure Prompt Shield, Meta Prompt Guard, LLM Guard, etc.)
  - $t$ = technique d'evasion (12 character injection techniques + AML algorithmique)
  - $\mathcal{X}_{adv}$ = ensemble de prompts adversariaux de test
  - $t(x)$ = prompt adversarial transforme par la technique d'evasion
- **Dependances**: F22 (ASR, section 3.4), F34 (FPR/FNR, section 8.12)
- **Couche delta concernee**: delta-2 (detection evasion)
- **Conjecture liee**: C3 (guardrail insufficiency), C6 (character-level attacks)

---

### F40 — Word Importance Ranking Transfer (WIRT)
- **Source**: P049, Section 5 (White-box to black-box transfer)
- **Formule**:
$$\text{WIRT}(x) = \text{argsort}_{w_i \in x}\left(\left|\frac{\partial \mathcal{L}(x)}{\partial e(w_i)}\right|\right)$$
ou $e(w_i)$ est l'embedding du mot $w_i$ et $\mathcal{L}$ la fonction de perte du modele white-box. Les mots les plus importants selon le gradient sont modifies en priorite pour crafter l'evasion transferable au modele black-box.
- **Description**: Technique de transfert d'attaque ou un classement d'importance des mots est calcule sur un modele white-box local (via gradient), puis utilise pour guider les perturbations sur un modele black-box distant. Hackett montre que cette approche ameliore significativement l'ASR contre les cibles black-box en concentrant les perturbations sur les tokens les plus discriminants.
- **Variables**:
  - $x$ = prompt adversarial
  - $w_i$ = mot individuel du prompt
  - $e(w_i)$ = embedding du mot dans le modele white-box
  - $\mathcal{L}$ = fonction de perte du classificateur guardrail (white-box)
- **Dependances**: F03 (Cross-Entropy Loss, section 1.3), F22 (ASR)
- **Couche delta concernee**: delta-2 (guardrail bypass)
- **Conjecture liee**: C5 (evasion transferability)

---

### F41 — Multi-Turn Safety Degradation (MTSD)
- **Source**: P050, Section 3 (Multi-turn evaluation)
- **Formule**:
$$\text{MTSD}(T) = \frac{S_1 - S_T}{S_1} \times 100\%$$
ou $S_t$ est le score de securite median au tour $t$, $S_1$ est le score initial (tour 1), et $S_T$ est le score au tour terminal $T$.
- **Description**: Quantifie la degradation de la securite d'un LLM au fil des tours de conversation adversariale. JMedEthicBench (P050) mesure une chute du score median de 9.5 a 5.5 (p<0.001) sur 22 modeles, soit une degradation de 42.1%. Cette metrique capture le phenomene d'erosion progressive de l'alignement qui est au coeur de la strategie d'attaque multi-tour AEGIS.
- **Variables**:
  - $T$ = nombre total de tours de conversation
  - $S_t$ = score de securite median au tour $t$ (echelle 1-10, evalue par dual-LLM)
  - $S_1$ = score de securite initial (tour 1), typiquement ~9.5
  - $S_T$ = score de securite terminal, typiquement ~5.5
- **Dependances**: F36 (Multi-Turn ASR, section 8.14)
- **Couche delta concernee**: delta-0 (alignment degradation over turns)
- **Conjecture liee**: C1 (multi-turn degradation)

---

### F42 — Dual-LLM Safety Score (DLSS)
- **Source**: P050, Section 2.3 (Scoring protocol)
- **Formule**:
$$S_{final}(r) = \frac{S_{judge_1}(r) + S_{judge_2}(r)}{2}$$
avec $S_{judge_k}(r) \in [1, 10]$ et accord mesure par:
$$\kappa_{weighted} = 1 - \frac{\sum_{i,j} w_{ij} \cdot o_{ij}}{\sum_{i,j} w_{ij} \cdot e_{ij}}$$
ou $w_{ij} = (i-j)^2$ (penalite quadratique), $o_{ij}$ = frequences observees, $e_{ij}$ = frequences attendues.
- **Description**: Protocole de scoring par deux LLM-juges independants pour evaluer la securite des reponses medicales. Le kappa pondere mesure la concordance inter-juges. JMedEthicBench utilise ce protocole pour scorer 50,000+ conversations adversariales. Le double scoring reduit le biais d'un juge unique et fournit une mesure de fiabilite.
- **Variables**:
  - $r$ = reponse du LLM evalue
  - $S_{judge_k}(r)$ = score attribue par le juge $k$ (echelle 1-10)
  - $\kappa_{weighted}$ = kappa de Cohen pondere quadratique
  - $o_{ij}$, $e_{ij}$ = matrices de frequences observees/attendues
- **Dependances**: Aucune formule prealable directe (metrique independante)
- **Couche delta concernee**: delta-0 (alignment evaluation)
- **Conjecture liee**: C1 (mesure objective de l'alignement)

---

### F43 — Four-Dimensional Linguistic Feature Vector (4DLF)
- **Source**: P051, Section 3 (Feature extraction)
- **Formule**:
$$\mathbf{f}(x) = [f_{prof}(x),\ f_{med}(x),\ f_{eth}(x),\ f_{dist}(x)]$$
ou chaque $f_d(x) \in [0, 1]$ est un score BERT pour la dimension $d$, et la classification jailbreak est:
$$\hat{y}(x) = \text{Classifier}(\mathbf{f}(x)) \in \{\text{safe}, \text{jailbreak}\}$$
- **Description**: Vecteur de 4 caracteristiques linguistiques extraites par BERT pour detecter les tentatives de jailbreak dans les dialogues cliniques. Les 4 dimensions sont: Professionnalisme (registre de langue), Pertinence Medicale (contenu clinique), Comportement Ethique (respect des normes), Distraction Contextuelle (tentative de deraillement). Un second classificateur (SVM, RF, ou reseau de neurones) prend ce vecteur en entree pour la decision binaire.
- **Variables**:
  - $x$ = texte d'entree (prompt ou reponse)
  - $f_{prof}$ = score de professionnalisme
  - $f_{med}$ = score de pertinence medicale
  - $f_{eth}$ = score de comportement ethique
  - $f_{dist}$ = score de distraction contextuelle
  - $\text{Classifier}$ = classificateur de second niveau
- **Dependances**: F02 (Precision/Recall/F1, section 1.2), F30 (SBERT, section 5.2)
- **Couche delta concernee**: delta-2 (detection/classification)
- **Conjecture liee**: C3 (detection feasibility), C4 (layered defense)

---

### F44 — Harm Information per Position (I_t)
- **Source**: P052, Section 3 (Martingale decomposition)
- **Formule**:
$$I_t = \text{Cov}_{\pi_\theta}\left[\mathbb{E}[H | x_{\leq t}],\ \nabla_\theta \log \pi_\theta(x_t | x_{<t})\right]$$
ou $H$ est le score de nocivite de la sequence complete, et $\pi_\theta$ est la politique du modele. Le gradient RLHF a la position $t$ est exactement egal a $I_t$.
- **Description**: Metrique de nocivite positionnelle derivee par decomposition en martingale. Young (P052) prouve que le gradient d'alignement RLHF a chaque position de token est exactement egal a la covariance entre l'esperance conditionnelle de nocivite et la fonction score. Ce resultat fondamental explique pourquoi l'alignement RLHF est "superficiel" : $I_t$ est eleve pour les premiers tokens (ou la nocivite est decidee) et decroit rapidement, laissant les tokens tardifs non affectes par l'alignement.
- **Variables**:
  - $t$ = position dans la sequence de tokens
  - $H$ = score de nocivite de la sequence complete (harm score)
  - $x_{\leq t}$ = tokens jusqu'a la position $t$
  - $\pi_\theta$ = politique du modele parametree par $\theta$
  - $\nabla_\theta \log \pi_\theta$ = fonction score (score function)
- **Dependances**: F23 (objectif RLHF, section 4.1), F24 (divergence KL, section 4.2), F27 (analyse gradient, section 4.5)
- **Couche delta concernee**: delta-0 (alignment depth)
- **Conjecture liee**: C1 (alignment is shallow), C2 (early-token concentration)

---

### F45 — Equilibrium KL Tracking
- **Source**: P052, Section 4 (Equilibrium analysis)
- **Formule**:
$$D_{KL}^{eq}(t) \propto I_t$$
soit: la divergence KL d'equilibre entre le modele aligne $\pi^*$ et le modele de base $\pi_{ref}$ a la position $t$ est proportionnelle a l'information de nocivite $I_t$.
- **Description**: Theoreme prouvant que la divergence KL entre le modele aligne et le modele de base se concentre exactement aux positions ou l'information de nocivite est elevee. Ce resultat explique formellement pourquoi les modeles alignes par RLHF different du modele de base principalement sur les premiers tokens : c'est la ou $I_t$ est maximal. Les suffixes adversariaux exploitent les positions ou $D_{KL}^{eq} \approx 0$.
- **Variables**:
  - $D_{KL}^{eq}(t)$ = divergence KL d'equilibre a la position $t$
  - $I_t$ = information de nocivite a la position $t$ (cf. F44)
  - $\pi^*$ = politique optimale (alignee)
  - $\pi_{ref}$ = politique de reference (modele de base)
- **Dependances**: F44 (Harm Information), F24 (KL divergence, section 4.2)
- **Couche delta concernee**: delta-0 (alignment mechanism)
- **Conjecture liee**: C1 (shallow alignment)

---

### F46 — Recovery Penalty Objective
- **Source**: P052, Section 5 (Proposed defense)
- **Formule**:
$$\mathcal{L}_{RP}(\theta) = \mathcal{L}_{RLHF}(\theta) + \lambda \sum_{t=1}^{T} \left\| \nabla_\theta \log \pi_\theta(x_t | x_{<t}) \right\|^2 \cdot \mathbb{1}[I_t < \epsilon]$$
- **Description**: Objectif d'entrainement modifie qui penalise les positions ou le gradient d'alignement est faible ($I_t < \epsilon$), forcant le modele a maintenir un signal d'alignement sur toute la sequence, pas seulement sur les premiers tokens. Cette approche corrige le defaut fondamental de RLHF (concentration du gradient sur les tokens precoces) et fournit une justification theorique pour les techniques d'augmentation de donnees.
- **Variables**:
  - $\mathcal{L}_{RLHF}$ = objectif RLHF standard (cf. F23)
  - $\lambda$ = coefficient de penalite de recuperation
  - $I_t$ = information de nocivite a la position $t$ (cf. F44)
  - $\epsilon$ = seuil minimal d'information de nocivite
  - $T$ = longueur de la sequence
- **Dependances**: F44 (Harm Information), F23 (objectif RLHF, section 4.1)
- **Couche delta concernee**: delta-0 (alignment hardening)
- **Conjecture liee**: C1 (shallow alignment fix)

---

### F47 — Paraphrase Bypass Rate (PBR)
- **Source**: P053, Section 4 (Evaluation)
- **Formule**:
$$\text{PBR}(M) = \frac{|\{p' \in \mathcal{P}_{para} : M(p') = \text{harmful}\}|}{|\mathcal{P}_{para}|}$$
ou $\mathcal{P}_{para}$ est l'ensemble des paraphrases semantiquement equivalentes d'un prompt nocif original.
- **Description**: Mesure la proportion de paraphrases semantiques d'un prompt nocif qui reussissent a contourner l'alignement RLHF. Kuklani et al. (P053) montrent que les modeles de production sont vulnerables aux reexpressions semantiques (encodage, obfuscation, paraphrase, multimodal). Un PBR eleve indique que l'alignement est base sur des patterns de surface (tokens) plutot que sur la comprehension semantique profonde.
- **Variables**:
  - $M$ = modele LLM evalue
  - $\mathcal{P}_{para}$ = ensemble de paraphrases du prompt nocif original
  - $p'$ = paraphrase individuelle
  - $M(p')$ = classification de la reponse (harmful/safe)
- **Dependances**: F22 (ASR, section 3.4), F01 (Cosine Similarity pour mesurer l'equivalence semantique)
- **Couche delta concernee**: delta-0 (RLHF alignment), delta-1 (semantic bypass)
- **Conjecture liee**: C1 (alignment is shallow), C3 (semantic attacks bypass token-level defenses)

---

### F48 — PIDP Compound Attack Score
- **Source**: P054, Section 3 (PIDP-Attack framework)
- **Formule**:
$$\text{ASR}_{PIDP} = \text{ASR}_{PI \cup DP} = P(\text{success} | \text{PI} \cap \text{DP})$$
avec gain marginal:
$$\Delta\text{ASR} = \text{ASR}_{PIDP} - \max(\text{ASR}_{PI}, \text{ASR}_{DP})$$
- **Description**: Mesure le taux de succes de l'attaque composee combinant injection de prompt (PI) et empoisonnement de la base de donnees (DP). PIDP (P054) demontre que la combinaison des deux vecteurs produit un gain de 4 a 16 points de pourcentage par rapport au meilleur vecteur individuel. Le $\Delta\text{ASR}$ capture la synergie entre les deux vecteurs d'attaque — un $\Delta > 0$ prouve que l'attaque composee est super-additive.
- **Variables**:
  - $\text{ASR}_{PI}$ = taux de succes avec injection de prompt seule
  - $\text{ASR}_{DP}$ = taux de succes avec empoisonnement de base seul
  - $\text{ASR}_{PIDP}$ = taux de succes avec attaque composee
  - $\Delta\text{ASR}$ = gain marginal de la composition (4-16 pp)
- **Dependances**: F22 (ASR, section 3.4)
- **Couche delta concernee**: delta-2 (RAG/retrieval), delta-3 (data integrity)
- **Conjecture liee**: C5 (RAG vulnerabilities), C6 (compound attacks amplify)

---

### F49 — Persistent Injection Rate (PIR)
- **Source**: P055, Section 3 (RAGPoison framework)
- **Formule**:
$$\text{PIR}(k) = \frac{|\{q \in \mathcal{Q} : \text{top-}k(q) \cap \mathcal{V}_{poison} \neq \emptyset\}|}{|\mathcal{Q}|}$$
ou $\mathcal{Q}$ est l'ensemble des requetes utilisateur et $\mathcal{V}_{poison}$ est l'ensemble des vecteurs empoisonnes inseres dans la base.
- **Description**: Mesure la persistance d'une attaque par empoisonnement de base vectorielle. PIR(k) est la proportion de requetes utilisateur dont les top-k resultats de recherche vectorielle contiennent au moins un vecteur empoisonne. McNamara (P055) montre qu'avec ~275,000 vecteurs malveillants, le PIR(k=5) atteint des niveaux tres eleves, assurant une interception quasi-systematique des requetes.
- **Variables**:
  - $k$ = nombre de documents retournes par la recherche vectorielle
  - $\mathcal{Q}$ = ensemble de requetes utilisateur
  - $\mathcal{V}_{poison}$ = ensemble de vecteurs empoisonnes (~275K dans l'experience)
  - $\text{top-}k(q)$ = les $k$ documents les plus proches de la requete $q$
- **Dependances**: F01 (Cosine Similarity pour le retrieval vectoriel)
- **Couche delta concernee**: delta-2 (RAG layer), delta-3 (data persistence)
- **Conjecture liee**: C5 (RAG inherit PI vulnerabilities), C7 (persistent poisoning)

---

### F50 — ASR Reduction Factor (ARF)
- **Source**: P056, Section 4 (Evaluation results)
- **Formule**:
$$\text{ARF} = \frac{\text{ASR}_{baseline}}{\text{ASR}_{AIR}}$$
ou $\text{ASR}_{baseline}$ est le taux de succes d'attaque avec la meilleure defense existante (IH input-layer only), et $\text{ASR}_{AIR}$ est le taux avec la methode AIR (injection IH dans toutes les couches intermediaires).
- **Description**: Facteur de reduction du taux de succes d'attaque obtenu par la methode AIR (Augmented Intermediate Representations). Kariyappa et Suh (P056, NVIDIA) montrent que l'injection de signaux de hierarchie d'instruction dans les representations intermediaires (toutes les couches du transformer, pas seulement l'input) reduit l'ASR d'un facteur 1.6x a 9.2x par rapport aux methodes etat-de-l'art, sans degradation significative de l'utilite.
- **Variables**:
  - $\text{ASR}_{baseline}$ = ASR avec defense IH classique (input-layer)
  - $\text{ASR}_{AIR}$ = ASR avec methode AIR (intermediate-layer)
  - ARF $\in [1.6, 9.2]$ dans les experiences reportees
- **Dependances**: F22 (ASR, section 3.4)
- **Couche delta concernee**: delta-0 (alignment), delta-1 (instruction hierarchy enforcement)
- **Conjecture liee**: C4 (instruction hierarchy is enforceable at intermediate layers)

---

### F51 — Orthogonal Rotation Separation (ASIDE)
- **Source**: P057, Section 3 (ASIDE mechanism)
- **Formule**:
$$\mathbf{e}'_{data}(x_t) = R \cdot \mathbf{e}(x_t)$$
ou $R \in \mathbb{R}^{d \times d}$ est une matrice de rotation orthogonale ($R^T R = I$, $\det(R) = 1$), et $\mathbf{e}(x_t)$ est l'embedding original du token de donnee $x_t$.

Separation mesuree par:
$$\text{Sep}_{ASIDE}(M) = \text{Sep}(M_{+ASIDE}) - \text{Sep}(M_{base})$$
- **Description**: Mecanisme architectural qui separe instructions et donnees au niveau des embeddings de tokens en appliquant une rotation orthogonale aux embeddings des tokens de donnees. ASIDE (Zverev et al., suite directe de l'article Sep(M) ICLR 2025) ne necessite aucun parametre supplementaire — la rotation est une transformation geometrique preservant les normes. La separation resultante est lineairement detectable des la premiere couche du transformer. $\text{Sep}_{ASIDE}$ mesure l'amelioration du score Sep(M) apres application d'ASIDE.
- **Variables**:
  - $R$ = matrice de rotation orthogonale ($d \times d$)
  - $\mathbf{e}(x_t)$ = embedding original du token $x_t$
  - $\mathbf{e}'_{data}(x_t)$ = embedding transforme (espace donnees)
  - $d$ = dimension de l'espace d'embedding
  - $\text{Sep}(M)$ = score de separation (cf. F15/section 3.1)
- **Dependances**: F15 (Sep(M), section 3.1), F01 (Cosine Similarity)
- **Couche delta concernee**: delta-0 (architectural separation)
- **Conjecture liee**: C1 (separation is enforceable), C3 (delta-0 hardening without utility loss)

---

### F52 — Iterative Injection Optimization Score (IIOS)
- **Source**: P059, Section 3 (Iterative attack)
- **Formule**:
$$p^* = \arg\max_{p \in \mathcal{P}} \mathbb{E}_{r \sim M_{sim}}[S_{review}(r)]$$
ou $p$ est le prompt d'injection insere dans le papier, $M_{sim}$ est le modele de revieweur simule, et $S_{review}$ est le score d'evaluation.
- **Description**: Formulation de l'attaque iterative contre les systemes de peer review par IA. Zhou et al. (P059) optimisent le prompt d'injection cache dans un papier scientifique pour maximiser le score attribue par un revieweur IA simule. L'attaque statique utilise un prompt fixe ; l'attaque iterative optimise contre un modele simule. Les deux atteignent frequemment des scores d'evaluation parfaits (10/10) contre des revieweurs IA frontier.
- **Variables**:
  - $p$ = prompt d'injection cache dans le papier
  - $\mathcal{P}$ = espace des prompts d'injection possibles
  - $M_{sim}$ = modele de revieweur simule (proxy pour l'attaque white-box)
  - $S_{review}(r)$ = score d'evaluation de la review generee $r$
  - $p^*$ = prompt optimal trouve par optimisation iterative
- **Dependances**: F22 (ASR, section 3.4)
- **Couche delta concernee**: delta-1 (injection crafting), delta-2 (adaptive optimization)
- **Conjecture liee**: C2 (iterative optimization defeats static defenses)

---

### F53 — Security-Efficiency-Utility Framework (SEU)
- **Source**: P060, Section 4 (Evaluation framework)
- **Formule**:
$$\text{SEU}(g) = \left(\text{Sec}(g),\ \text{Eff}(g),\ \text{Util}(g)\right)$$
avec:
$$\text{Sec}(g) = 1 - \text{ASR}(g)$$
$$\text{Eff}(g) = \frac{1}{\text{Latency}(g) + \text{Cost}(g)}$$
$$\text{Util}(g) = 1 - \text{FPR}(g)$$
- **Description**: Framework tri-dimensionnel pour evaluer les guardrails de jailbreak (P060, IEEE S&P 2026). SEU capture les trois dimensions critiques: Securite (reduction de l'ASR), Efficience (cout computationnel et latence), Utilite (impact sur les requetes legitimes via le taux de faux positifs). Le framework montre qu'aucun guardrail individuel ne domine sur les trois dimensions simultanement, validant la necessite d'approches multi-couches.
- **Variables**:
  - $g$ = systeme de guardrail evalue
  - $\text{Sec}(g)$ = score de securite (complement de l'ASR)
  - $\text{Eff}(g)$ = score d'efficience (inverse de la latence + cout)
  - $\text{Util}(g)$ = score d'utilite (complement du FPR)
  - $\text{ASR}(g)$ = Attack Success Rate apres application du guardrail
  - $\text{FPR}(g)$ = False Positive Rate (requetes legitimes bloquees)
- **Dependances**: F22 (ASR, section 3.4), F34 (FPR/FNR, section 8.12)
- **Couche delta concernee**: delta-0 a delta-3 (evaluation transversale)
- **Conjecture liee**: C1 (taxonomy validates multi-layer), C3 (security-utility tradeoff), C6 (no universal guardrail)

---

### F54 — Six-Dimensional Guardrail Taxonomy Vector
- **Source**: P060, Section 3 (Taxonomy)
- **Formule**:
$$\mathbf{T}(g) = [\text{stage}(g),\ \text{paradigm}(g),\ \text{granularity}(g),\ \text{react}(g),\ \text{applic}(g),\ \text{explain}(g)]$$
ou chaque dimension est categorielle:
- $\text{stage} \in \{\text{input}, \text{output}, \text{both}\}$ (phase d'intervention)
- $\text{paradigm} \in \{\text{rule}, \text{ML}, \text{LLM}, \text{hybrid}\}$ (paradigme technique)
- $\text{granularity} \in \{\text{binary}, \text{category}, \text{fine-grained}\}$ (granularite de securite)
- $\text{react} \in \{\text{proactive}, \text{reactive}\}$ (reactivite)
- $\text{applic} \in \{\text{model-specific}, \text{model-agnostic}\}$ (applicabilite)
- $\text{explain} \in \{\text{opaque}, \text{explainable}\}$ (explicabilite)
- **Description**: Vecteur de taxonomie a 6 dimensions pour classifier systematiquement tout systeme de guardrail. Wang et al. (P060) l'utilisent pour cartographier l'ensemble du paysage des guardrails existants et identifier les lacunes. Ce vecteur est complementaire a la taxonomie AEGIS (66 techniques, 4 classes) et a la classification CrowdStrike (95/95 coverage).
- **Variables**:
  - $g$ = systeme de guardrail
  - 6 dimensions categorielles (voir ci-dessus)
- **Dependances**: Aucune formule prealable directe (framework de classification)
- **Couche delta concernee**: delta-0 a delta-3 (classification transversale)
- **Conjecture liee**: C1 (taxonomy completeness), C6 (no universal guardrail)

---

## Papers sans nouvelles formules extraites

### P048 — SLR Prompt Injection Defenses
- **Type**: Systematic Literature Review (88 etudes)
- **Raison**: Survey compilant des metriques existantes (ASR, F1, Accuracy) sans introduire de nouvelle formule. Valeur principale = cartographie quantitative des 88 defenses avec leur efficacite reportee.
- **Note**: Les metriques compilees (ASR, F1, DR) sont deja documentees dans F22, F02, F33.

### P053 — Semantic Jailbreaks and RLHF Limitations
- **Note**: La metrique PBR (F47) est extraite de ce paper. La taxonomie des limitations RLHF est qualitative (pas de formule formelle supplementaire).

### P055 — RAGPoison
- **Note**: La metrique PIR (F49) est extraite de ce paper. Le seuil de ~275K vecteurs est un resultat empirique, pas une formule.

### P058 — Automated Injection Agents
- **Type**: MSc Thesis (ETH Zurich), PDF non extractible
- **Raison**: Contenu inaccessible (PDF only). L'approche multi-step automated est methodologique. Pas de formule formelle extraite du resume.

---

## Graphe de Dependances (nouvelles aretes)

### Aretes entrantes (vers formules existantes)
- F38 -> F22 (DIS utilise ASR)
- F39 -> F22 (ESR complementaire a ASR)
- F39 -> F34 (ESR lie a FPR/FNR)
- F40 -> F03 (WIRT utilise Cross-Entropy Loss)
- F40 -> F22 (WIRT cible l'ASR)
- F41 -> F36 (MTSD etend Multi-Turn ASR)
- F44 -> F23 (I_t derive de l'objectif RLHF)
- F44 -> F24 (I_t lie a KL divergence)
- F44 -> F27 (I_t etend l'analyse gradient)
- F45 -> F24 (KL Equilibrium etend KL divergence)
- F46 -> F23 (Recovery Penalty modifie l'objectif RLHF)
- F47 -> F22 (PBR est un cas special d'ASR)
- F47 -> F01 (PBR utilise cosine similarity pour equivalence semantique)
- F48 -> F22 (PIDP ASR etend ASR)
- F49 -> F01 (PIR utilise cosine similarity pour retrieval)
- F50 -> F22 (ARF utilise ASR)
- F51 -> F15 (ASIDE mesure via Sep(M))
- F52 -> F22 (IIOS cible l'ASR)
- F53 -> F22 (SEU Sec = 1-ASR)
- F53 -> F34 (SEU Util = 1-FPR)

### Aretes internes (entre nouvelles formules)
- F45 -> F44 (KL Equilibrium depend de Harm Information)
- F46 -> F44 (Recovery Penalty utilise I_t)
- F51 -> F01 (ASIDE orthogonal rotation preservant la cosine structure)

### Nouvelles aretes totales: 23

---

## Chemins Critiques mis a jour

### Chemin Critique 9 (NOUVEAU): Chaine d'alignement superficiel
$$F23 \rightarrow F44 \rightarrow F45 \rightarrow F46$$
(Objectif RLHF -> Harm Information -> KL Equilibrium -> Recovery Penalty)
**Signification**: Chemin complet de la preuve mathematique que l'alignement RLHF est superficiel (P052) et de la solution proposee.

### Chemin Critique 10 (NOUVEAU): Chaine d'evasion guardrail
$$F03 \rightarrow F40 \rightarrow F39 \rightarrow F22$$
(Cross-Entropy -> Word Importance Ranking -> Evasion Success Rate -> Attack Success Rate)
**Signification**: Pipeline complet de l'attaque par transfert white-box-to-black-box de Hackett (P049).

### Chemin Critique 11 (NOUVEAU): Chaine RAG compound
$$F01 \rightarrow F49 \rightarrow F48$$
(Cosine Similarity -> Persistent Injection Rate -> PIDP Compound ASR)
**Signification**: Pipeline d'attaque RAG composee, de la similarite vectorielle a l'empoisonnement persistant.

### Chemin Critique 12 (NOUVEAU): Chaine evaluation multi-dimensionnelle
$$F22 \rightarrow F53 \rightarrow F54$$
(ASR -> SEU Framework -> Taxonomy Vector)
**Signification**: Pipeline d'evaluation systematique des guardrails, de la metrique atomique au framework complet.

---

## DIFF — RUN-003 vs RUN-002

### Added
- **17 nouvelles formules** (F38-F54)
- **23 nouvelles aretes de dependance**
- **4 nouveaux chemins critiques** (CC9-CC12)
- Papers couverts: 14 (P047-P060), dont 10 avec extraction de formule(s)

### Modified
- F22 (ASR): devient le hub central avec 9 nouvelles aretes entrantes (F38, F39, F40, F47, F48, F50, F52, F53 + indirect via F41)
- F01 (Cosine Similarity): 3 nouvelles connexions (F47 equivalence semantique, F49 retrieval, F51 ASIDE)
- F15 (Sep(M)): nouvelle connexion via F51 (ASIDE measurement)
- F24 (KL Divergence): nouvelles connexions via F44, F45
- F23 (Objectif RLHF): nouvelles connexions via F44, F46

### Unchanged
- F01-F37 (37 formules existantes) — definitions et descriptions inchangees

### Statistiques cumulees
| Metrique | RUN-001 | RUN-002 | RUN-003 | Delta |
|----------|---------|---------|---------|-------|
| Formules documentees | 22 | 37 | 54 | +17 |
| Aretes de dependance | 28 | 43 | 66 | +23 |
| Chemins critiques | 5 | 8 | 12 | +4 |
| Papers couverts | 20 | 34 | 48 | +14 |

---

*Fin du rapport MATHEUX RUN-003 — 17 formules extraites (F38-F54)*
*Agent: MATHEUX | Date: 2026-04-04*
