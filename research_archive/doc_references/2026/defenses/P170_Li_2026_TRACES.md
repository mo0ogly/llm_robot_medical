## [Li, Li, Zhang, et al., 2026] — TRACES : audit de sécurité proactif des agents multi-tour par modélisation trajectoire-état

**Reference :** arXiv:2605.27690v1 [cs.CL]
**Revue/Conf :** arXiv preprint, 26 mai 2026 [cs.CL] — non encore publié en conférence/journal
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P170_Li_2026_TRACES.pdf](../../literature_for_rag/P170_Li_2026_TRACES.pdf)
> **Statut**: [PREPRINT] — lu en texte complet 28 pages

**Auteurs (N=5, vérifié p.1)** : Jiaqian Li (Brown University), Yanshu Li (UT Austin), Boxuan Zhang (Rutgers University), Ruixiang Tang (Rutgers University), Kuan-Hao Huang (Texas A&M University)

---

### Abstract original

> LLM agents increasingly operate through multi-turn tool use and environment interaction, where safety risks often emerge from intermediate steps long before they surface in the final outcome. Reactive auditing is therefore insufficient: post-hoc diagnosis frequently misses the chance to flag risks while they are unfolding. We propose TRACES, a representation-based proactive auditor that learns prefix-level trajectory risk states from the hidden representations of an observer LLM. TRACES induces latent mechanism features from step representations and models their temporal evolution to estimate whether a partial trajectory is drifting toward unsafe behavior. To sidestep the cost and ambiguity of step-level risk annotation, TRACES is trained with weak trajectory-level supervision while still producing dense prefix-level risk estimates. Across multiple agent safety benchmarks, TRACES improves both full-trajectory safety prediction and proactive risk discrimination. Our analyses further suggest that these risk states can help train a safer agent, highlighting the broader potential of proactive auditing for long-horizon agent safety.
> — Source : PDF p. 1

---

### Résumé (5 lignes)

- **Problème :** Les guardrails réactifs (LlamaGuard, ShieldAgent) opèrent sur la trajectoire complète ou la réponse finale, manquant les risques qui s'accumulent progressivement dans les trajectoires multi-tour d'agents LLM avant de se manifester (p. 1, Introduction).
- **Méthode :** TRACES, auditeur proactif en deux étages : (1) une Representation Mechanism Bank (RMB) apprend K=8 mécanismes latents depuis les états cachés d'un LLM observateur externe (Llama-3.1-8B ou Qwen3-4B) ; (2) un GRU temporel suit l'évolution des mécanismes pour produire un score de risque préfixe qt à chaque étape (p. 3-5, Section 3).
- **Données :** ATBench (1 000 trajectoires, 503 safe / 497 unsafe, 9,01 tours/trajectoire en moyenne) et ASSEBench (ASSE-Safety 1 476 enregistrements, ASSE-Security 817 enregistrements, 4,96 et 5,75 tours) — tous deux offline (Appendix B.1, p. 12).
- **Résultat :** TRACES-Llama3.1-8B atteint le meilleur F1 sur les 4 benchmarks (ex. F1=86.3 sur ATBench) et le meilleur EAUPC sur tous les benchmarks avec gains absolus jusqu'à 19.3 points sur le meilleur baseline ; EAUPC=96.9 sur ASSE-Security vs 79.3 pour AgentDoG-Llama (Table 1, p. 6).
- **Limite :** Évaluation sur benchmarks offline uniquement — pas d'environnements exécutables, donc l'étude PRM reste une approximation offline ; les représentations dépendent du modèle observateur backbone (p. 9, Limitations).

---

### Analyse critique

**Forces :**

1. **Supervision faible sans annotations étape-par-étape** : TRACES utilise uniquement des étiquettes de sécurité au niveau trajectoire (binaire) pour produire des estimations de risque denses par préfixe, via un objectif BCE asymétrique avec warm-up schedule (Eq. 15, Appendix A.2, p. 12). Cela rend l'approche praticable à grande échelle sans annotation humaine coûteuse étape par étape.

2. **Gain EAUPC substantiel** : L'EAUPC (Early Area Under the Prefix Curve) — métrique threshold-free mesurant la séparabilité safe/unsafe sur préfixes partiels — est améliodée jusqu'à 19.3 points absolus sur le meilleur baseline (p. 2, Introduction, confirmé Table 1, p. 6). EAUPC est défini sur des préfixes ratios P={0.2, 0.4, 0.6, 0.8} (Eq. 18, Appendix B.4, p. 15).

3. **Mécanismes interprétables** : La RMB apprend 8 mécanismes dont certains capturent des motifs d'échec sémantiquement cohérents : M2 (retrieval mismatch, 96.7% unsafe), M7 (retry behavior, 90.0%), M0 (mismatch avec continuation, 90.0%) (Table 3, p. 7 ; Appendix D.5, pp. 21-23).

4. **Transferabilité cross-benchmark** : Entraîné sur ATBench, TRACES-Qwen3-4B maintient des performances compétitives sur ASSE-Safety (recall 91.7%, EAUPC 62.7%) et ASSE-Security (EAUPC 69.7%) sans réentraînement (Figure 3, p. 8 ; Figure 7, p. 17).

5. **Légèreté computationnelle** : Les paramètres du LLM observateur sont gelés. Seuls la RMB et le GRU temporal sont entraînés, le tout complétant en "quelques minutes sur un seul GPU A100" après extraction et cache des représentations (Appendix D.4, p. 20).

6. **Feedback PRM utilisable** : TRACES-PRM réduit le mean risk score (0.236) et le taux unsafe (18.0%) vs AgentDoG-PRM (0.259, 20.0%) et base Qwen3-4B (0.265, 22.0%) sur évaluation GPT-5.2 externe (Table 4, p. 7 ; Appendix D.2, pp. 17-19). Cela démontre un potentiel pour la fine-tuning de politique par DPO.

**Faiblesses :**

1. **Benchmarks offline uniquement** : ATBench et ASSEBench sont des trajectoires synthétiques statiques sans environnement exécutable. L'étude PRM est une "approximation offline" (Appendix D.2, p. 17-18) — aucune validation en conditions réelles de type rollout RL.

2. **Dépendance au backbone observateur** : Les expériences utilisent seulement deux modèles (Llama-3.1-8B-Instruct layer 30, Qwen3-4B layer 32). Le papier reconnaît que "multi-observer auditing, adaptive layer selection, or representation alignment" restent à explorer (p. 9, Limitations).

3. **EDR parfois plus faible que baselines** : Sur ATBench, TRACES-Llama obtient EDR=41.4 vs 54.5 pour AgentDoG-Llama et GPT-5.2 (Table 1, p. 6). Les auteurs distinguent correctement EDR (couverture) de EAUPC (qualité), mais les applications temps-réel nécessitent les deux.

4. **Faux positifs sur précurseurs ambigus** : Type-1 failure (false early alarms) identifiés sur traj_id=531 (financière vérifiée) et traj_id=607 (CRM synthétique) — TRACES sur-réagit aux patterns credential + CRM même en contexte bénin (Appendix F, pp. 24-26).

5. **Risques cumulatifs manqués** : Type-2 failure sur traj_id=277 — TRACES reste bas sur une trajectoire "ignore credit limits + 10 000 synthetic profiles" car aucune action n'est localement unsafe (Table 16, p. 26). Les risques économiques distribués ne sont pas capturés.

6. **Juge externe GPT-5.2** : L'évaluation PRM utilise GPT-5.2 comme juge (non open-source). Conformément aux enseignements de P044 (99% flip rate des LLM-juges), ce résultat doit être interprété avec prudence.

**Questions ouvertes :**

- Peut-on étendre TRACES à des environnements exécutables interactifs (closed-loop) ?
- Le steering par suppression de mécanismes spécifiques (M2/M7) est-il faisable sans dégrader les performances ? (Appendix G, p. 26)
- Comment TRACES se comporte-t-il avec des modèles observateurs plus grands (70B+) ?

---

### Formules exactes

**Eq. 1 — Trajectoire multi-tour** (Section 3.1, p. 3) :
```
tau = (u, a_1, o_1, a_2, o_2, ..., a_T, o_T)
```
où u est la requête utilisateur, a_t l'action agent à l'étape t, o_t l'observation outil. Label yτ ∈ {0,1}, yτ=1 = unsafe.

**Eq. 2 — Score préfixe** (Section 3.1, p. 3) :
```
q_t = P(y_tau = 1 | x_1, ..., x_t)
```
Probabilité que la trajectoire complète sera unsafe, conditionnée sur le préfixe jusqu'à l'étape t.

**Eq. 3 — Representation Mechanism Bank (RMB)** (Section 3.2, p. 4) :
```
M = {M_k}^K_{k=1},  M_k = (c_k, U_k)
```
c_k ∈ R^m (centre du mécanisme), U_k ∈ R^{m×r} (sous-espace local de rang r).

**Eq. 4 — Affinité mécanisme** (Section 3.2, p. 4) :
```
s_{t,k} = alpha * sim(z_t, c_k) + beta * ||U_k^T (z_t - c_k)||^2
```
Combinaison de similarité cosinus au centre et projection résiduelle sur le sous-espace local.

**Eq. 5 — État d'étape mécanisme-aware** (Section 3.3, p. 4) :
```
x_t = [p_eta(h_t) ; z_t ; g_t ; s_t] ∈ R^{n+m+2K}
```
où p_eta(h_t) ∈ R^n = projection des états cachés bruts, z_t = code latent RMB, g_t = softmax(s_t) = activations normalisées.

**Eq. 6 — Input GRU avec transition explicite** (Section 3.3, p. 4) :
```
x̃_t = [x_t ; Δx_t],   Δx_t = x_t - x_{t-1},   Δx_1 = 0
```

**Eq. 7 — GRU temporel** (Section 3.3, p. 4) :
```
r_t = GRU(x̃_1, ..., x̃_t)
```
Résumé online du préfixe observé. Logit risque : ℓ_t = phi_psi(r_t), prob : q_t = sigma(ℓ_t).

**Eq. 8 — Ranking loss** (Section 3.3 / Eq. 8, p. 5) :
```
L_rank = 1[y_tau=1] * max(0, m - ℓ_{t_l} + ℓ_{t_e})
```
Pénalité temporelle : les préfixes tardifs doivent avoir un logit de risque plus élevé que les préfixes précoces sur les trajectoires unsafe.

**Eq. 9 — Objectif Stage 2 global** (Section 3.3 / Eq. 9, p. 5) :
```
L_TRACES = lambda_final * L_final + lambda_pre * L_pre + lambda_rank * L_rank
```
Poids : lambda_final=1.0, lambda_pre=0.2, lambda_rank=0.05 (Appendix B.3, p. 14).

**Eq. 13 — Warm-up schedule** (Appendix A.2, Eq. 13, p. 12) :
```
w_t = ((t/T - rho) / (1 - rho))^gamma  [clamped at 0]
```
rho contrôle le début de supervision positive, gamma l'intensité de montée.

**Eq. 16 — EDR** (Appendix B.4, Eq. 16, p. 15) :
```
EDR = (1/|U|) * sum_{i in U} I[exists t < T_i : ŷ_{i,t} = 1]
```

**Eq. 18 — EAUPC** (Appendix B.4, Eq. 18, p. 15) :
```
EAUPC = (1/|P|) * sum_{rho in P} AUROC_rho,   P = {0.2, 0.4, 0.6, 0.8}
```

**Eq. 10 — Reconstruction RMB** (Appendix A.1, Eq. 10, p. 12) :
```
ẑ_t = sum_{k=1}^{K} g_{t,k} [c_k + U_k U_k^T (z_t - c_k)]
L_rec = ||z_t - ẑ_t||^2_2
```

**Hyperparamètres (Appendix B.3, p. 14)** :
- K=8 mécanismes, dimension latente m=256, rang sous-espace r=8
- GRU 1 couche, dimension cachée 256
- AdamW : lr=5×10^{-4}, batch=32, weight_decay=10^{-4}, dropout=0.1, 30 époques
- Extraction : layer 30 (Llama-3.1-8B), layer 32 (Qwen3-4B)
- Split : 60/20/20 train/val/test stratifié

---

### Pertinence thèse AEGIS

**Couches delta :**
- **δ²** (monitoring comportemental séquentiel) — prioritaire : TRACES est un auditeur de trajectoire stateful qui modélise l'évolution temporelle de l'état de risque, exactement la définition de δ². Applicable après chaque action agent (intégration dans la boucle d'audit post-action).
- **δ¹** (détection d'anomalie au niveau token/prompt) — secondaire : TRACES n'opère pas directement au niveau token, mais les états cachés extraits à chaque agent_action incorporent les informations de contexte prompt. Un lien existe avec la détection d'injection indirecte (IPI dans le contexte RAG).
- **δ³** (audit comportemental de longue portée) — pertinent : la métrique EAUPC mesure précisément la capacité de détection sur horizon long (ratios préfixe 0.2→0.8), ce qui correspond aux trajectoires multi-tour d'horizon long de AEGIS.

**Conjectures :**
- **C2 (couche de validation/monitoring)** — SUPPORTÉE : TRACES fournit une implémentation concrète d'un monitoring proactif de trajectoire avec supervision faible. La RMB apprend des mécanismes interprétables de risque (M2 retrieval mismatch, M7 retry, M0 continued analysis) qui correspondent aux patterns d'escalade multi-tour pertinents pour C2. Gain EAUPC jusqu'à 19.3 points absolus (p. 2, Introduction).
- **C4 (dérive mesurable — trajectoire)** — SUPPORTÉE ET PRÉCISÉE : TRACES démontre empiriquement que la dérive vers unsafe est mesurable préfixe par préfixe via la métrique EAUPC. L'Eq. 2 formalise exactement la conjecture C4 : q_t = P(y_tau=1 | x_1,...,x_t) est une estimation de dérive en temps réel. Le cas traj_id=987 (Table 11, p. 25) illustre la montée progressive du score de risque de 0 à 1 sur 10 étapes, correspondant à la dérive mesurée que C4 postule.

**Découvertes :**
- **D-016 (dégradation multi-tour)** — TRACES est une défense candidate directe. Le papier confirme que les trajectoires multi-tour d'agents LLM présentent une "dégradation progressive" quantifiable par les états cachés de l'observateur — cohérent avec D-016 qui constate cette dégradation. TRACES opérationnalise la détection de D-016 sous forme d'auditeur lightweight.

**Gaps :**
- **RR-RUN4-004 (défense multi-tour : détection de dégradation progressive)** — ADRESSÉ DIRECTEMENT : TRACES est la première approche basée sur la représentation qui prédit la dégradation vers unsafe AVANT la fin de trajectoire, avec supervision faible. Il adresse le gap par : (1) score préfixe q_t continu, (2) EAUPC comme métrique de qualité de détection précoce, (3) entraînement sans annotations étape-par-étape coûteuses. Résultat clé : EAUPC=96.9 vs 79.3 (AgentDoG-Llama, meilleur baseline) sur ASSE-Security (Table 1, p. 6).

**Cluster défense multi-tour — positionnement :**
- **vs P154 (DeepContext, détection stateful RNN)** : P154 utilise des RNN sur états cachés de chaque token pour détecter les injections — approche au niveau token, supervision dense. TRACES utilise un GRU sur les états cachés au niveau agent_action (granularité plus grossière mais pertinente pour l'auditeur), supervision faible (trajectoire-level only). TRACES est plus scalable (pas d'annotations step-level) mais opère à une granularité plus élevée. Complémentaires : P154 pour détection fine IPI, TRACES pour détection de dégradation de trajectoire.
- **vs P158 (When Attention Closes, GAR)** : P158 exploite les patterns d'attention pour détecter les changements de focus comportemental. TRACES utilise les états cachés (hidden states) d'une couche profonde (layer 30/32) plutôt que les patterns d'attention — capturant des concepts sémantiques plus abstraits. GAR (P158) est un mécanisme interne au modèle, TRACES est un auditeur externe qui ne modifie pas les poids du modèle cible.

**Mapping templates AEGIS :**
Défense applicable aux trajectoires d'attaque multi-tour : chaînes utilisant des outils externes (RAG + tool use). TRACES détecterait les escalades progressives dans les chaînes d'attaque AEGIS qui opèrent en multi-turn avec tool injection. Pertinent pour les templates ciblant les agents autonomes avec mémoire et outils.

---

### Citations clés

> "Reactive auditing is therefore insufficient: post-hoc diagnosis frequently misses the chance to flag risks while they are unfolding." (Section 1, p. 1)

> "TRACES induces latent mechanism features from step representations and models their temporal evolution to estimate whether a partial trajectory is drifting toward unsafe behavior." (Abstract, p. 1)

> "TRACES delivers strong full-trajectory safety prediction while substantially improving proactive auditing metrics, achieving the best early-risk ranking on every benchmark with absolute gains of up to 19.3 points over the strongest baseline." (Section 2, p. 2)

> "Because dense step-level labels are expensive and many risks arise through accumulation rather than a single decisive action, we train TRACES with weak supervision under a prefix-aware objective." (Section 3, p. 3)

> "M2 is the clearest retrieval-mismatch mechanism. Its top-activated examples are highly unsafe-enriched, with an unsafe rate of 96.7%." (Appendix D.5, p. 21)

> "In our experiments, representation extraction is performed once and cached for all downstream training and evaluation. [...] the full TRACES training pipeline completes within several minutes on a single A100 GPU." (Appendix D.4, p. 20)

> "TRACES-PRM achieves the lowest judged risk across all three metrics." (Section 5.3, Table 4, p. 7) — Mean risk 0.236, Median risk 0.125, Unsafe rate 18.0% vs Base Qwen3-4B 0.265 / 0.150 / 22.0%.

> "A blunter alternative, Naive Broadcast, assigns the trajectory label to every prefix. It attains the highest EDR and recall but its EAP collapses to 56.6, achieving early detection through over-alerting rather than by learning well-calibrated prefix risk states." (Section 4.3, p. 7)

> "TRACES stays low over the full trajectory despite the user's request to ignore credit limits and perform repeated, resource-intensive operations. The underlying risk is cumulative: no single early step is strongly unsafe in isolation, but the trajectory as a whole creates economic and resource-usage risk." (Table 16, p. 26 — Type-2 failure)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8.5/10 — défense proactive multi-tour, monitoring représentation, feedback PRM |
| Nature | [EMPIRIQUE] — résultats observés sur benchmarks offline ; pas de preuve formelle de convergence du GRU ou des bornes de généralisation |
| Reproductibilité | Haute — hyperparamètres complets (Appendix B.3, p. 14), split 60/20/20 détaillé, architecture RMB/GRU spécifiée ; code non disponible publiquement à ce jour |
| Code disponible | Non mentionné dans le preprint |
| Dataset public | ATBench (arXiv:2604.02022, Li et al. 2026c) et ASSEBench (arXiv:2506.00641, Luo et al. 2026) — publics |
| Couches delta | δ² prioritaire, δ³ secondaire, δ¹ connexe |
| Conjectures | C2 : SUPPORTÉE (monitoring proactif opérationnalisé) ; C4 : SUPPORTÉE ET PRÉCISÉE (dérive mesurable par q_t préfixe) |
| Découvertes | D-016 : TRACES = défense candidate directe |
| Gaps | RR-RUN4-004 : ADRESSÉ DIRECTEMENT |
| Statut | [PREPRINT] — arXiv:2605.27690v1, soumis 26 mai 2026, pas encore publié en conférence/journal |
| Limitations avouées | Benchmarks offline uniquement ; dépendance backbone observateur ; absence de test rollout RL (Section Limitations, p. 9) |
