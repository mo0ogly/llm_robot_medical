## [Dongre, Hsieh, Lai, et al., 2026] — Quand l'attention se ferme : dégradation des LLM en interaction multi-tour

**Reference :** arXiv:2605.12922
**Revue/Conf :** arXiv preprint, 2026 [cs.AI]
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P158_Dongre_2026_MultiTurnAttentionDecay.pdf](../../literature_for_rag/P158_Dongre_2026_MultiTurnAttentionDecay.pdf)
> **Statut**: [PREPRINT] — lu en texte complet (34 pages)

---

### Abstract original

> Large language models reliably follow complex instructions in a single turn, yet across long multi-turn interactions they start strong then gradually lose the thread of the instructions, persona, and rules they were given. This degradation has been measured behaviorally but not mechanistically explained. We provide evidence for a channel-transition account of this failure, in which goal-defining tokens become less accessible through attention while goal-related information may persist in residual representations. We introduce the Goal Accessibility Ratio (GAR), measuring attention from generated tokens to task-defining goal tokens, and combine it with sliding-window ablations and residual-stream probes. When attention to instructions closes, what survives reveals architecture. Across the architectures we test, this transition produces qualitatively different failure modes: some models preserve substantial goal-conditioned behavior at vanishing attention, others fail despite carrying decodable goal information in their residual stream, and the depth at which this encoding emerges varies dramatically by architecture (from layer 2 to layer 27). A within-model causal ablation that closes the attention channel by force on Mistral collapses recall from near-perfect to eleven percent on a 20-fact retention task and raises persona-constraint violations to levels exceeding the adversarial-pressure baseline despite no user pressure, with both effects emerging at the predictable crossover turn. Linear probes on residual representations recover per-episode recall outcomes with AUC up to 0.99 across all four primary architectures (input embedding: chance), providing evidence that goal-related outcome information is linearly recoverable from residual representations and that the depth at which it becomes recoverable is architecture-specific. Across multiple model architectures and model scales, we find that the gap between attention loss and residual decodability is associated with whether goal-conditioned behavior survives under channel closure. We provide GAR as a diagnostic, the channel-transition framework as a controlled mechanistic account, and a parametric prediction of failure timing under windowed attention closure.
> — Source : p. 1, Abstract

---

### Résumé (5 lignes)

- **Problème :** La dégradation multi-tour des LLM (perte d'instructions/persona/règles au fil des tours) était mesurée empiriquement mais sans explication mécanistique ; les raisons internes du passage conformité→défaillance restaient inconnues (Section 1, p. 1–2).
- **Méthode :** Cadre deux canaux (attention directe sur les tokens-objectif G via GAR + flux résiduel Cres) ; ablation sliding-window causal (fermeture forcée du canal attention) ; sondes linéaires sur activations résiduelles (LDA sur PCA-50, LOO cross-validation) — 4 architectures primaires, 6 additionnelles, 5 483 épisodes de production (Section 2–3, Appendix F, p. 3–6, 23).
- **Données :** 4 architectures primaires (Mistral-7B-Instruct-v0.3, LLaMA-3.1-8B-Instruct, Qwen-2.5-7B-Instruct, Mixtral-8x7B) + 6 architectures étendues (2B–70B) ; 4 tâches multi-tour (rétention 5 faits, complexité contrôlée 20 faits, conformité persona 50 tours, conformité politique 30 tours) ; temperature=0.7 ; 50–200 épisodes par condition (Section 3, Table 5–6, p. 6, 23).
- **Résultat :** Le GAR décroît de manière monotone sur toutes les architectures (Mann-Kendall p < 10⁻⁷, Kendall τ agrégé = −0.75, p = 1.5×10⁻¹⁴) ; sous fermeture forcée SW=4096, le rappel de faits s'effondre de ~100% à 11.2% sur la tâche 20-faits pour Mistral (Table 1, Figure 5, p. 7–8) ; les sondes résiduelles récupèrent les issues comportementales avec AUC jusqu'à 0.99 (Section 4, Figure 6, p. 9).
- **Limite :** Cadre testé uniquement sur des tâches multi-tour structurées à objectif fixe (50 tours max) ; la dérive en chat ouvert, l'évolution d'objectif mid-conversation, et les architectures SSM/hybrides sont hors scope ; la fermeture SW sur LLaMA/Qwen constitue une perturbation out-of-distribution plus qu'une causalité native (Section 6 Limitations, p. 10).

---

### Analyse critique

**Forces :**
- Contribution mécanistique authentique : premier cadre formel liant la fermeture du canal attention (mesurée par GAR, Eq. 4) à la défaillance comportementale via une intervention causale propre (sliding-window mask, Eq. 5–7), avec dissociation claire entre encodage résiduel et utilisation causale (Appendix D.4–D.5, p. 17–18).
- Prédictivité paramétrique : le crossover turn τcross est déterministe, calculable à partir de W et du débit tokenaire par tour ; R² ≈ 1 sur sweep 5 points (Figure 4, p. 7), rendant la défaillance temporellement prédictible.
- Batterie de validation large : 10 architectures (Mann-Kendall, Table 10, p. 27), 4 tâches hétérogènes, scaling intra-famille Qwen (3B–32B), avec métriques robustes (AUC LOO, bootstrap CI 95%, permutation null 200 shuffles).
- Résultat négatif reporté honnêtement : la ré-injection périodique de l'objectif par user-role (Appendix H, p. 28–30) ne restaure ni l'attention sur le reminder ni le rappel post-closure — ce qui renforce la thèse que l'accès textuel tardif seul est insuffisant.
- Évaluateurs diversifiés et validés : juges LLM ensemble (GPT-4.1, Claude Sonnet 4, DeepSeek R1), calibrés contre ground truth humain, ensemble accuracy 84%, Krippendorff α = 0.6547 (Appendix I, p. 30–32).

**Faiblesses :**
- Scope délibérément restreint (reconnu par les auteurs) : 4 familles architecturales, objectifs fixes, 50 tours maximum ; applicabilité aux interactions conversationnelles ouvertes et à la dérive sémantique sans objectif stable = non testée (Section 6, p. 10).
- Interprétation causale partielle pour LLaMA/Qwen : la fermeture SW sur des modèles entraînés en full-attention est une perturbation out-of-distribution, pas un test natif ; causalité directe établie solidement uniquement pour Mistral (et Mixtral natif-SW) (Appendix C.1, p. 16–17).
- Activation patching null (Appendix D.5, p. 18–19) : aucun effet fact-spécifique détectable, même sur bloc 11-couches centré sur le pic AUC (L27 Mistral) — le résiduel *encode* mais n'est pas *utilisé* de façon détectable par remplacement d'activation ; le mécanisme de read-out exact reste inconnu.
- Qwen-2.5-32B évalue sur n=50 (contrainte budgétaire) vs n=100 pour les autres scales ; non-monotonicité r50 avec paramètres (3B=7%, 7B=6%, 14B=45%, 32B=0%) = résultat contre-intuitif non entièrement expliqué (Appendix G.2, p. 26).

**Questions ouvertes :**
- Le mécanisme de read-out résiduel : comment exactement l'information encodée est-elle extraite (ou non) lors du décodage ? Pathways non-linéaires ou distribués sur positions hors-détection des sondes linéaires (Appendix D.4, p. 17).
- Extension aux SSM (Mamba) et architectures hybrides attention-locale : les canaux y sont fondamentalement différents.
- Peut-on *entraîner* les modèles à développer une meilleure capacité résiduelle pour retarder τcross ou améliorer la survie post-closure ?
- Le routage MoE (Mixtral) participe-t-il à la transmission résiduelle ? (Section 4, p. 9–10)
- Applicabilité aux jailbreaks persistants multi-tour et à l'inversion d'instructions de sécurité (Section 5, p. 10 : mention explicite mais non testée).

---

### Formules exactes

**Définition 2.1 — Goal et Response Token Sets** (Section 2.1, p. 3) :
G ⊂ {1, …, T} = positions des tokens du system prompt définissant la tâche (objectif/persona/règles).
Rτ ⊂ {1, …, T} = positions du output au tour τ.
Contrainte : max(G) < min(Rτ) pour tout τ ≥ 1.

**Définition 2.2 — Canal Attention** (Section 2.1, Eq. 1, p. 3) :
Cattn(τ) = {(i, j) : i ∈ Rτ, j ∈ G}
État au layer ℓ, head h = sous-matrice A^(ℓ,h) restreinte à ces paires ; ouvert si masse non négligeable, fermé si au niveau du bruit numérique.

**Définition 2.3 — Canal Résiduel** (Section 2.1, Eq. 2, p. 3) :
Cres(τ) = {r^(ℓ)_t : t ∈ Rτ, ℓ ∈ {1, …, L}}
Famille d'activations du flux résiduel aux positions de réponse, sur toutes les couches.

**Définition 2.4 — Channel Transition** (Section 2.1, Eq. 3, p. 4) :
τcross(M) = min{τ : µM(τ) < θM}
où θM est le seuil model-spécifique (déterminé empiriquement = valeur GAR au crossover sous SW).

**Définition 2.5 — Goal Accessibility Ratio (GAR)** (Section 2.2, Eq. 4, p. 4) :
GAR(τ) = (1 / (L · H · |Rτ|)) × Σ_{ℓ=1}^{L} Σ_{h=1}^{H} Σ_{i∈Rτ} Σ_{j∈G} A^(ℓ,h)_{i,j}
Numérateur = masse attention totale des tokens-réponse vers tokens-objectif, sommée sur toutes les têtes et couches. Dénominateur = masse maximale possible. GAR(τ) ∈ [0, 1] par row-stochasticité de softmax.
Décomposition par layer (Appendix B.1, Eq. 6, p. 16) :
GAR^(ℓ)(τ) = (1 / (H · |Rτ|)) × Σ_{h=1}^{H} Σ_{i∈Rτ} Σ_{j∈G} A^(ℓ,h)_{i,j}

**Définition 2.6 — Sliding-Window Mask** (Section 2.3, Eq. 5, p. 4) :
M^(W)_{i,j} = 1 si j ≤ i et i−j < W ; 0 sinon.
Condition de fermeture : Rmin(τ) − Gmax ≥ W → le bloc goal-response est intégralement masqué.
Comportement de l'attention masquée (Appendix C, Eq. 7, p. 16) :
A^(ℓ,h)_{i,j} = [exp(s^(ℓ,h)_{i,j}) × M^(W)_{i,j}] / [Σ_{j' : M^(W)_{i,j'}=1} exp(s^(ℓ,h)_{i,j'})]

**Définition 2.7 — Outcome Probe** (Section 2.4, p. 5) :
p^(ℓ)_τ(r) = 1[w⊤r + b > 0]
Classifieur linéaire binaire (LDA sur PCA-50) entraîné sur r^(ℓ)_{t*} avec t* = min(Rτ)−1 (position immédiatement avant le premier token de réponse), prédisant l'issue comportementale (compliance = 1, violation = 0). Évaluation : leave-one-out cross-validation par épisode, AUC reportée, significativité via permutation null 200 shuffles.

---

### Pertinence thèse AEGIS

**Couches delta :**
- **δ² (prioritaire)** — Monitoring comportemental séquentiel : le GAR est exactement une métrique de monitoring temps-réel du signal d'attention sur les tokens d'instruction. La dégradation est mesurable tour par tour via GAR, et τcross est prédictible parametriquement. Ce papier fournit l'outillage théorique pour instrumenter δ² en inspection d'attention.
- **δ¹** — Contexte/RAG : la fermeture du canal attention est directement causée par la dilution contextuelle (tokens RAG/utilisateur qui repoussent G hors fenêtre) ; ce mécanisme explique pourquoi l'injection RAG multi-tour dégrade la conformité plus vite que l'injection directe.
- **δ³** — Validation formelle : le cadre two-channel avec GAR + sondes linéaires offre une base pour des garanties formelles sur la rétention d'objectif (bornes sur τcross en fonction de W et du débit tokenaire).

**Conjectures :**
- **C4 (dérive sémantique mesurable) — SUPPORTE, direction forte** : le GAR est une mesure mécaniste de la dérive, pas seulement comportementale. La décroissance monotone (Mann-Kendall p < 10⁻⁷ per architecture, τ agrégé = −0.75, p = 1.5×10⁻¹⁴ — Section 4, Table 10, p. 27) valide que la dérive est *quantifiable* via un signal interne (attention mass) et non seulement via outputs. C4 est renforcée : la mesure mécanistique dépasse la mesure behaviorale.
- **C7 (paradoxe raisonnement/sécurité — interactions longues diluent le signal) — SUPPORTE, direction forte** : le mécanisme documenté est précisément la dilution par accumulation de contexte (filler turns repoussent G, competition de l'attention budget avec les sink tokens). Le fait que les violations persona dépassent le baseline adversarial *sans* pression utilisateur sous SW (Mistral : v≥16 = 0.480 vs adversarial default 0.346 — Appendix E.5, Table 3, p. 22) confirme que la longueur d'interaction seule (pas la malveillance utilisateur) suffit à dégrader la sécurité.

**Découvertes :**
- **D-016 (dégradation multi-tour médicale — jusqu'ici empirique, p < 0.001) — MÉCANISME EXPLIQUÉ** : ce papier fournit le mécanisme causal sous-jacent à D-016. La dégradation observée dans nos expériences AEGIS (chute ASR factuel en multi-tour) s'explique par la fermeture progressive du canal attention sur les tokens d'instruction médicale (system prompt), mesurable via GAR. D-016 était empirique ; ce papier en fait un résultat mécanistique. La force de l'explication dépend du fait que nos modèles cibles (LLaMA-3.1/3.3 70B via Groq) sont dans la lignée architecturale testée (LLaMA-3.1-8B, Table 5, p. 23) — extrapolation à 70B non directement validée mais cohérente avec la robustesse cross-scale observée sur Qwen (Appendix G.2).
- Nuance importante : la fermeture complète du canal attention n'est pas atteinte dans des conversations de longueur normale (< 50 tours sans SW) — GAR décroît de 27% à 48% mais reste bien au-dessus du floor (Section 4, p. 7). D-016 se produit donc dans un régime de canal *partiellement ouvert*, où la compétition attention (sinks, tokens accumulés) dégrade progressivement l'accès aux instructions plutôt que de fermer brutalement.

**Gaps :**
- **RR-RUN4-004 (défense multi-tour : détection de dégradation progressive, attention monitoring across turns) — ADRESSÉ EN GRANDE PARTIE** : le GAR est exactement la métrique diagnostique demandée. Le papier fournit (1) la définition formelle (Eq. 4), (2) le code de référence (implémentation LDA+PCA décrite en Appendix D.2), (3) la preuve que GAR est prédictif de τcross. Gap partiellement résiduel : intégration du monitoring GAR en temps réel dans un pipeline de défense actif (re-injection, fenêtrage dynamique) n'est pas fournie (le papier teste une ré-injection et trouve un résultat négatif — Appendix H, p. 28–30).
- **RR-FICHE-001 (Multi-Step Boundary Erosion / attention decay) — ADRESSÉ** : le channel-transition account fournit exactement le cadre théorique pour RR-FICHE-001. La fiche d'attaque correspondante peut maintenant citer le mécanisme précis (compétition attention + positional decay RoPE + sink absorption) plutôt qu'une description comportementale.

**Mapping templates AEGIS :**
- Chaînes d'escalade multi-tour (#07 multi_turn_apt, fiche 07) : ce papier explique *pourquoi* les attaques multi-tour progressives fonctionnent — elles exploitent précisément la fermeture graduelle du canal attention sur les tokens de sécurité/restriction.
- Templates à pression adversariale croissante : sous pression adversariale standard, les violations restent en dessous du niveau produit par la simple longueur conversationnelle sous SW — implication opérationnelle : dans nos campagnes, l'effet de longueur peut dépasser l'effet de la pression adversariale.

---

### Citations clés

> "Large language models reliably follow complex instructions in a single turn, yet across long multi-turn interactions they start strong then gradually lose the thread of the instructions, persona, and rules they were given. This degradation has been measured behaviorally but not mechanistically explained." (Abstract, p. 1)

> "The decline is steepest over the first ten turns: initial high attention to system-prompt tokens gives way to attention shared across accumulating conversation context, and continues gradually thereafter." (Section 4, p. 7)

> "On the controlled-complexity task, recall has decayed by the first post-crossover probe (T=25, recall 80%) and continues to fluctuate before collapsing to 11.2% at T=50." (Section 4, p. 8)

> "On Mistral-7B, the mean persona-violation rate over the post-divergence window τ∈[16,50] (v≥16) under closure exceeds the same quantity under adversarial user pressure on default attention (0.48 vs. 0.35), confirming channel closure as a stronger disruption than the strongest user-side baseline." (Section 4, p. 8 + Appendix E.5, Table 3, p. 22)

> "Linear probes on residual representations recover per-episode recall outcomes with AUC up to 0.99 across all four primary architectures (input embedding: chance)." (Abstract, p. 1 + Section 4, Figure 6, p. 9 : LLaMA L2 AUC=0.99, Qwen L11 AUC=0.98, Mixtral L21 AUC=0.99, Mistral L27 AUC=0.87, tous p<0.005)

> "A naive user-role periodic re-injection of the original goal block did not restore attention to the recent reminder span or improve lagged recall under SW=4096, suggesting that late textual access alone is insufficient under this intervention format." (Appendix H, p. 30)

> "The layer at which the residual encoding becomes linearly recoverable varies from layer 2 (LLaMA) to layer 27 (Mistral)." (Section 5, p. 10 + Table 9, p. 25)

> "Across all the architectures, GAR declines by 27% to 48% of its turn-1 value but remains well above the closed-channel floor." (Section 4, p. 7)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence AEGIS | 9/10 — mécanisme central D-016, adresse RR-RUN4-004 et RR-FICHE-001 directement |
| Reproductibilité | Haute — 5 483 épisodes, seeds documentées, tâches pre-authored déterministes, code d'évaluation décrit (Appendix D–F) ; intervalle bootstrap 95% et permutation null sur toutes les métriques clés |
| Code disponible | Non mentionné dans le papier (pas d'URL GitHub) |
| Dataset public | Non — tâches pré-authored déterministes décrites en détail mais pas de release formelle mentionnée |
| Architectures | Mistral-7B-Instruct-v0.3, LLaMA-3.1-8B-Instruct, Qwen-2.5-7B-Instruct, Mixtral-8x7B-Instruct-v0.1 (primaires) + 6 additionnel (Table 5–6, p. 23) |
| N épisodes total | 5 483 épisodes de production (Appendix F.1, p. 23) |
| Couches delta | δ² (prioritaire), δ¹, δ³ |
| Conjectures | C4 (SUPPORTE, forte), C7 (SUPPORTE, forte) |
| Découvertes | D-016 : MÉCANISME EXPLIQUÉ |
| Gaps adressés | RR-RUN4-004 (grande partie), RR-FICHE-001 (complet) |
| Nature | [EMPIRIQUE] avec cadre formel — résultats observationnels et expérimentaux, intervention causale (SW) mais pas de preuve formelle de garanties de convergence ou de borne |
| Statut | [PREPRINT] — soumis arXiv 2026-05-13 (v1), pas encore publié en conférence/journal |
