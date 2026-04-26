# P019: Why Is RLHF Alignment Shallow? A Gradient Analysis
**Auteurs**: Robin Young (University of Cambridge, Department of Computer Science and Technology)
**Venue**: arXiv preprint, mars 2026
> **PDF Source**: [literature_for_rag/P019_gradient_shallow.pdf](../../literature_for_rag/P019_gradient_shallow.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (71 chunks)

**Reference** : arXiv:2603.04851v1 [cs.LG]
**Nature** : [THEOREME] — preuve formelle que l'alignement RLHF est structurellement superficiel via decomposition martingale

---

## Section 1 — Resume critique

### Abstract original
> Why is safety alignment in LLMs shallow? We prove that gradient-based alignment inherently concentrates on positions where harm is decided and vanishes beyond. Using a martingale decomposition of sequence-level harm, we derive an exact characterization of alignment gradients. The gradient at position t equals the covariance between the conditional expected harm and the score function. This implies that positions beyond the harm horizon where the output's harmfulness is already determined receive zero gradient signal during training. This explains empirical observations that KL divergence between aligned and base models concentrates on early tokens. Consequently, standard alignment objectives cannot produce deep alignment, regardless of optimization quality. We introduce the concept of harm information I_t, which quantifies each position's influence on harm, and prove that equilibrium KL divergence tracks this quantity. Finally, we derive an objective based on recovery penalties that creates gradient signal at all positions, providing theoretical grounding for empirically successful data augmentation techniques.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** L'alignement RLHF est empiriquement superficiel (Qi et al. 2025, ICLR Outstanding Paper) — la KL divergence se concentre sur les premiers tokens (Section 1, p.1)
- **Methode :** Decomposition martingale du harm en innovations par position, derivation exacte du gradient d'alignement (Sections 4-6, Theoremes 8 et 10)
- **Donnees :** Travail purement theorique — pas d'experiences (confirme dans le texte complet)
- **Resultat :** Le gradient a la position t = Cov(h_t, score_function) (Theoreme 8, Eq. 18). Au-dela de l'horizon de nocivite, gradient = 0 (Theoreme 10, Eq. 28). L'alignement superficiel est OPTIMAL pour l'objectif standard.
- **Limite :** Cadre theorique idealise (harm function deterministe, pas de bruit d'estimation) ; recovery penalty proposee mais non evaluee experimentalement (Section 9)

### Analyse critique

**Forces :**
1. **Preuve formelle rigoureuse** — decomposition martingale (Proposition 2, Eq. 4), Doob decomposition (Proposition 4, Eq. 8), et theoreme zero-gradient (Theoreme 10, Eq. 28). Chaque etape est mathematiquement verifiable.
2. **Insight fondamental** — l'alignement superficiel n'est PAS un echec de l'optimisation mais une CONSEQUENCE optimale de l'objectif standard. Cela change le paradigme : ameliorer l'optimisation ne resoudra PAS le probleme.
3. **Harm information I_t** — nouveau concept quantifiant l'influence de chaque position sur le harm (Definition 5, Eq. 12). I_t = E[Var(h_t|y<t)], decomposition de la variance totale en contributions par position (Corollary 7, Eq. 15).
4. **Recovery penalty** — objectif alternatif creant du signal gradient a toutes les positions, fournissant une justification theorique pour les techniques d'augmentation de donnees (Section 9).
5. **Connexion avec Qi et al. (2025)** — explique formellement les observations empiriques de l'ICLR Outstanding Paper.

**Faiblesses :**
1. **Aucune validation experimentale** — la recovery penalty (Section 9) est proposee sans evaluation. Cela limite la portee pratique.
2. **Hypotheses fortes** — la harm function Harm: V* -> [0,1] est supposee deterministe et dependante uniquement de la sequence de sortie (Section 3, p.2). En realite, le harm depend aussi du contexte, de l'interlocuteur, et de facteurs non textuels.
3. **Modele autoregressif ideal** — ne prend pas en compte les architectures non-autoregressives, le beam search, ou le sampling avec temperature.
4. **[PREPRINT]** — non publie en conference peer-reviewed.
5. **Pas de lien avec le domaine medical** — aucune discussion des implications specifiques pour les LLMs medicaux.

**Questions ouvertes :**
- La recovery penalty peut-elle etre implementee dans le pipeline RLHF de modeles open-source (Mistral, Llama) ?
- L'horizon de nocivite est-il plus court ou plus long pour les reponses medicales ?
- Le theoreme 10 s'applique-t-il aux architectures avec attention sur le contexte RAG ?

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Ref papier | Lien glossaire AEGIS |
|----|---------|-------------------|------------|---------------------|
| Eq.1 | $P_\theta(y) = \prod_{t=1}^T P_\theta(y_t | y_{<t})$ | Factorisation autoregressive | Section 3, Eq. 1 | — |
| Eq.2 | $H(\theta) = \lambda \cdot E_{y \sim P_\theta}[\text{Harm}(y)] + D_{KL}(P_\theta \| P_{base})$ | Objectif d'alignement standard | Section 3, Eq. 2 | F01 (RLHF) |
| Eq.3 | $h_t(y_{\leq t}) := E[\text{Harm}(y) | y_1, \ldots, y_t]$ | Conditional expected harm (martingale) | Section 4, Def. 1, Eq. 3 | — (nouveau, cle) |
| Eq.7 | $\Delta_t := h_t(y_{\leq t}) - h_{t-1}(y_{<t})$ | Harm innovation | Section 4, Def. 3, Eq. 7 | — |
| Eq.8 | $\text{Harm}(y) = E[\text{Harm}] + \sum_{t=1}^T \Delta_t$ | Doob decomposition | Section 4, Prop. 4, Eq. 8 | — |
| Eq.12 | $I_t := E[\Delta_t^2] = E[\text{Var}(h_t | y_{<t})]$ | **Harm information** | Section 4, Def. 5, Eq. 12 | F44 (I_t martingale) |
| Eq.15 | $\text{Var}(\text{Harm}(y)) = \sum_{t=1}^T I_t$ | Decomposition de variance totale | Section 4, Cor. 7, Eq. 15 | — |
| **Eq.18** | $\nabla_\theta E[\text{Harm}(y)] = \sum_{t=1}^T E_{y_{<t}}[\text{Cov}_{y_t|y_{<t}}(h_t(y_{\leq t}), \nabla_\theta \log P_\theta(y_t|y_{<t}))]$ | **GRADIENT CHARACTERIZATION** (theoreme central) | Section 5, **Theoreme 8**, Eq. 18 | F44 |
| **Eq.28** | Pour $t > k$ (horizon) : $E_{y_{<t}}[\text{Cov}_{y_t|y_{<t}}(h_t, \nabla_\theta \log P_\theta)] = 0$ | **ZERO GRADIENT BEYOND HORIZON** | Section 6, **Theoreme 10**, Eq. 28 | F44 |
| Eq.30 | $\|C_t(y_{<t})\|^2 \leq \text{Var}_{y_t|y_{<t}}(h_t) \cdot \text{tr}(F_t(y_{<t};\theta))$ | Borne Cauchy-Schwarz sur la magnitude du gradient | Section 7, Lemme 12, Eq. 30 | — |

**Variables cles :**
- $h_t$ : expected harm conditionne sur le prefixe y_{<=t} (martingale)
- $\Delta_t$ : innovation = changement de h_t en observant y_t
- $I_t$ : harm information = variance de l'innovation (mesure l'influence de la position t)
- $k$ : harm horizon = plus petit indice tel que I_t = 0 pour tout t > k (Theoreme 9)
- $F_t$ : Fisher information conditionnelle a la position t (Definition 11, Eq. 29)

---

## Section 3 — Critique methodologique

### Qualification epistemique detaillee
Les Theoremes 8, 9 et 10 sont des **theoremes** au sens strict avec preuves completes. L'hypothese centrale (Harm: V* -> [0,1] deterministe) est explicite et discutee.

### Hypotheses — analyse

| Hypothese | Explicite/Implicite | Force | Verifiable ? | Commentaire |
|-----------|-------------------|-------|--------------|-------------|
| H1 : Harm deterministe | Explicite | Forte | En pratique, le harm depend du juge | Gap theorie/pratique |
| H2 : Generation autoregressive | Explicite | Moderate | Oui pour GPT/Llama | Standard pour les LLMs actuels |
| H3 : KL comme regularisation | Explicite | Standard | Oui (PPO, DPO) | Hypothese mainstream |
| H4 : Harm depend uniquement de y | Explicite | Forte | Non (contexte, RAG, outils) | Limite pour les agents |

### Idee centrale de la preuve
Le gradient a la position t ne depend que de la covariance entre le harm attendu h_t et la score function. Si h_t est constant etant donne y_{<t} (c'est-a-dire si le harm est deja determine), la covariance est nulle et le gradient disparait. La preuve utilise la decomposition de Doob pour separer les contributions par position et l'orthogonalite des innovations pour eliminer les termes croises.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C1** (δ⁰ insuffisant) | CRITIQUE | Preuve formelle (Theoreme 10) | L'alignement RLHF standard PRODUIT NECESSAIREMENT un alignement superficiel. Ce n'est pas un echec mais une limitation structurelle. |
| **C3** (alignement superficiel) | CRITIQUE | Preuve formelle (Theoreme 8) | Le gradient = Cov(h_t, score) — s'annule au-dela de l'horizon. C3 est PROUVEE par P019. |
| **C2** (necessite de δ³) | FORT (indirect) | Si δ⁰ est structurellement superficiel, des couches supplementaires sont necessaires | Renforce C2 par contraposition. |

### Couches delta
- **δ⁰ (RLHF)** : P019 prouve que δ⁰ est STRUCTURELLEMENT LIMITE. L'alignement par gradient ne peut pas produire d'alignement profond sous l'objectif standard (Theoreme 10, Remark 3).
- **δ³** : la recovery penalty (Section 9) est une tentative theorique de depasser la limitation de δ⁰, conceptuellement liee a δ³.

### Decouverte D-001 (Triple Convergence)
P019 renforce massivement D-001 : la preuve de gradient nul au-dela de l'horizon montre que l'attaque, la defense et la mesure convergent vers la meme limitation structurelle de l'alignement.

### Formules AEGIS
- **F44** (I_t martingale) : definie dans P019, Theorem 8 + Definition 5. C'est la contribution cle de ce papier au glossaire formel AEGIS.

### Gaps adresses/crees
- **G-015** (recovery penalty non evaluee) : P019 propose la recovery penalty mais ne l'evalue pas. AEGIS peut implementer et tester sur modeles medicaux via Ollama.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P019 |
| **Type** | Theorique (preuve formelle, analyse de gradient) |
| **Domaine** | Alignement LLM, RLHF, theorie de l'apprentissage |
| **Modeles testes** | Aucun (travail purement theorique) |
| **Metrique principale** | Gradient = Cov(h_t, score_function) ; I_t = harm information |
| **delta-layers** | δ⁰ (limitation prouvee), δ³ (necessite renforcee) |
| **Conjectures** | C1 (critique), C3 (critique), C2 (fort indirect) |
| **SVC pertinence** | 10/10 |
| **Reproductibilite** | Haute — preuves mathematiques verifiables |
| **Code disponible** | Non applicable (theorique) |
| **Dataset public** | Non applicable |
| **Tags** | [PREPRINT], martingale, gradient analysis, harm horizon, RLHF, alignment depth, recovery penalty |
