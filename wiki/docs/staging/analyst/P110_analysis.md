## [Springer, Lee, Metevier, Castleman, Turbal, Jung, Shen, Korolova, 2025] — The Geometry of Alignment Collapse : When Fine-Tuning Breaks Safety

**Reference :** arXiv:2602.15799
**Revue/Conf :** Preprint (Princeton University), fevrier 2026
**Lu le :** 2026-04-08
> **PDF Source**: [literature_for_rag/P110_geometry_alignment_collapse.pdf](../../assets/pdfs/P110_geometry_alignment_collapse.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (103 chunks)

### Abstract original
> Fine-tuning aligned language models on entirely benign tasks (e.g. math tutoring) unpredictably degrades safety guardrails, even when training data contains no harmful content and developers have no adversarial intent. We resolve this through a novel geometric analysis, proving that alignment concentrates in low-dimensional subspaces with sharp curvature, creating a brittle structure that first-order methods cannot detect or defend. While initial fine-tuning updates may indeed avoid these subspaces, the curvature of the fine-tuning loss generates second-order acceleration that systematically steers trajectories into alignment-sensitive regions -- an effect invisible to all existing defenses. We formalize this mechanism through the Alignment Instability Condition (AIC) and prove that under mild regularity assumptions, alignment degradation follows a quartic power law in training time.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Le fine-tuning sur des taches benignes degrade impredictiblement les guardrails de securite, et aucune defense existante (projection, regularisation) ne peut prevenir ce collapse car elles operent au premier ordre tandis que le mecanisme est de second ordre (Springer et al., 2026, Section 1, p.1).
- **Methode :** Analyse geometrique formelle dans l'espace des poids. Definition de l'Alignment Instability Condition (AIC) a 3 conditions : (1) concentration dans un sous-espace de faible dimension, (2) orthogonalite initiale, (3) couplage de courbure. Preuves via matrice de Fisher, perturbation Davis-Kahan, flux de gradient (Sections 3-6).
- **Donnees :** Validation empirique sur Qwen3-1.7B-Instruct et LLaMA-3.2-3B-Instruct, 7 datasets de fine-tuning (SamSum, Alpaca, Dolly, GSM8K, Orca-Math, WikiText, DriftCheck). Harmfulness Score (HS) mesure par SORRY-Bench (Section 7, Table 1).
- **Resultat :** Theoreme principal (Corollary 6.3) : la degradation de l'alignement suit une loi quartique Delta_u_i = Omega(lambda * gamma^2 * t^4). Le parametre gamma (couplage de courbure) predit la degradation avant qu'elle ne se manifeste. Empiriquement : LoRA et full fine-tuning montrent tous deux une degradation, avec l'Overlap Score (OS) correle a la severite (Section 7, Table 1).
- **Limite :** Le cadre theorique repose sur des hypotheses de regularite locale (Fisher localement Lipschitz, differentiabilite C2) qui peuvent ne pas tenir exactement en pratique. La validation empirique est sur des modeles relativement petits (1.7B, 3B) (Sections 5, 7).

### Analyse critique
**Forces :**
- Contribution theorique majeure : premier cadre formel expliquant POURQUOI le fine-tuning benin degrade la securite. Passe du constat empirique (P107, P108, P109) a l'explication mecaniste (Sections 3-6). [THEOREME]
- L'AIC (Definition 5.1) est elegant et operationnel : les 3 conditions sont verifiables (au moins en principe) et le parametre gamma est mesurable avant le fine-tuning, offrant un outil de prediction prospective (Section 5.3, p.8).
- Loi quartique (Corollary 6.3) : Delta_u_i = Omega(gamma^2 * t^4) — fournit une loi de scaling precise pour la degradation en fonction du temps d'entrainement. Cela explique la transition abrupte observee empiriquement (Section 6.3, p.9).
- L'argument que les defenses existantes (projection hors du sous-espace sensible) sont insuffisantes car le sous-espace tourne pendant le fine-tuning est une contribution critique (Section 6, Theorem 6.2).
- Validation empirique : l'Overlap Score (OS) correle avec le Harmfulness Score, confirmant que la theorie est predictive (Section 7, Table 1).

**Faiblesses :**
- **Preprint non peer-reviewed**, bien que de Princeton (institution de premier plan).
- Les hypotheses mathematiques (Fisher localement Lipschitz, Assumption 3) sont des conditions de regularite standardes mais non verifiees empiriquement sur des LLM reels. L'ecart theorie-pratique n'est pas quantifie.
- Modeles empiriques petits (1.7B, 3B) : la geometrie de l'espace des poids pourrait etre qualitativement differente pour des modeles 70B+ ou des architectures MoE.
- Le lien avec LoRA vs full fine-tuning est empirique mais pas theorique : la theorie traite du flux de gradient continu, pas de la dynamique discrete de LoRA avec rang fixe.
- Pas de proposition de defense concrete : l'article identifie que les defenses au premier ordre echouent, mais la solution (methodes curvature-aware) reste programmatique.

**Questions ouvertes :**
- Le parametre gamma peut-il etre estime efficacement sur des modeles de grande taille (70B+) en temps raisonnable ?
- La loi quartique tient-elle au-dela du regime local (theta proche de theta*) ou la degradation sature-t-elle ?
- Les methodes curvature-aware proposees (Section 8) sont-elles computationnellement tractables pour des modeles a l'echelle industrielle ?
- Comment le rang de LoRA interagit-il avec la dimension du sous-espace sensible M_i ?

### Formules exactes
- **Definition 3.4 — Alignment Sensitivity Subspace** : M_i = span des d premiers vecteurs propres de F_i(theta*), ou F_i est la matrice d'information de Fisher pour le skill S_i (Section 3, p.4). [THEOREME — definition formelle]
- **Definition 5.1 — Alignment Instability Condition (AIC)** : theta* satisfait l'AIC pour le skill S_i avec parametres (d, lambda, gamma, epsilon) si : (1) Concentration : sum_{j>d} lambda_j <= epsilon et lambda_d >= lambda ; (2) Orthogonalite initiale : ||P_i(theta*) g(theta*)|| <= epsilon ; (3) Couplage de courbure : ||F_i(theta*)^{1/2} P_i(theta*) nabla g(theta*) g(theta*)|| >= gamma (Section 5.3, p.8). [THEOREME]
- **Theorem 6.1 — Projection of Misalignment** : Delta_u_i(theta) >= 1/2 ||F_i^{1/2} P_i (theta - theta*)||^2 - O(||theta - theta*||^3) (Section 6.1, p.8). [THEOREME]
- **Theorem 6.2 — Curvature-Driven Drift** : ||F_i^{1/2} P_i (theta(t) - theta*)|| = Omega(gamma * t^2) (Section 6.2, p.9). [THEOREME]
- **Corollary 6.3 — Quartic Onset** : Delta_u_i(theta(t)) = Omega(lambda * gamma^2 * t^4) pour t dans [0, t_0] (Section 6.3, p.9). [THEOREME]
- Lien glossaire AEGIS : F44 (I_t martingale — decomposition spectrale analogue), F46 (Recovery Penalty — le gamma de l'AIC est un analogue de la penalite de recovery)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (explication geometrique de la fragilite de l'alignement RLHF — l'alignement vit dans un sous-espace de faible dimension avec courbure aigui, ce qui explique sa fragilite).
- **Conjectures :**
  - C6 (domaine medical plus vulnerable) : THEORIQUEMENT FONDEE — le fine-tuning medical introduit du contenu structurellement different des donnees d'entrainement (P109 montre que c'est la nouveaute du contenu qui cause la degradation). Le cadre AIC formalise pourquoi : le contenu medical nouveau genere des gradients dont la courbure (terme de second ordre) projette inevitablement la trajectoire dans le sous-espace sensible M_i, meme si le premier ordre est orthogonal. Plus le contenu est different → plus gamma est grand → plus la degradation est rapide (t^4 scaling).
  - C3 (alignement superficiel) : FORMELLEMENT PROUVEE — l'alignement se concentre dans un sous-espace de faible dimension (Condition 1 de l'AIC). Sa destruction est inevitable au second ordre (Theorem 6.2). L'alignement est GEOMETRIQUEMENT superficiel : il occupe un sous-espace fragile, pas une propriete diffuse du reseau.
  - C1 (δ⁰ insuffisant) : SUPPORTEE — les defenses au premier ordre (projection, regularisation L2) ne peuvent pas prevenir le collapse car le mecanisme est de second ordre. L'alignement RLHF standard est structurellement insuffisant.
- **Gaps :** G-015 (mecanisme de l'erosion de securite — ADRESSE FORMELLEMENT par l'AIC et la loi quartique)

### Citations cles
> "alignment concentrates in low-dimensional subspaces with sharp curvature, creating a brittle structure that first-order methods cannot detect or defend" (Abstract, p.1)
> "alignment degradation follows a quartic power law in training time" (Abstract, p.1)
> "curvature coupling inevitably bends the trajectory back into sensitive regions over time" (Section 5.3, p.8)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 |
| Reproductibilite | Moyenne — preuves formelles verifiables, empirique sur 2 modeles seulement |
| Code disponible | Non specifie |
| Dataset public | Oui (SamSum, Alpaca, Dolly, GSM8K, Orca-Math, WikiText — tous publics) |
