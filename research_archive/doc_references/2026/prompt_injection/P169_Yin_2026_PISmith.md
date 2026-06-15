## [Yin, Geng, Wang, Jia, 2026] — PISmith : red teaming par apprentissage par renforcement contre les défenses de prompt injection

**Reference :** arXiv:2603.13026 [cs.LG]
**Revue/Conf :** arXiv preprint 2026, cs.LG (under review) [PREPRINT]
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P169_Yin_2026_PISmith.pdf](../../literature_for_rag/P169_Yin_2026_PISmith.pdf)
> **Statut**: [PREPRINT] — lu en texte complet, 26 pages, via pypdf extraction directe

---

### Abstract original

> Prompt injection poses serious security risks to real-world LLM applications, particularly autonomous agents. Although many defenses have been proposed, their robustness against adaptive attacks remains insufficiently evaluated, potentially creating a false sense of security. In this work, we propose PISmith, a reinforcement learning (RL)-based red-teaming framework that systematically assesses existing prompt-injection defenses by training an attack LLM to optimize injected prompts in a practical black-box setting, where the attacker can only query the defended LLM and observe its outputs. We find that directly applying standard GRPO to attack strong defenses leads to sub-optimal performance due to extreme reward sparsity—most generated injected prompts are blocked by the defense, causing the policy's entropy to collapse before discovering effective attack strategies, while the rare successes cannot be learned effectively. In response, we introduce adaptive entropy regularization and dynamic advantage weighting to sustain exploration and amplify learning from scarce successes. Extensive evaluation on 13 benchmarks demonstrates that state-of-the-art prompt injection defenses remain vulnerable to adaptive attacks. We also compare PISmith with 7 baselines across static, search-based, and RL-based attack categories, showing that PISmith consistently achieves the highest attack success rates. Furthermore, PISmith achieves strong performance in agentic settings on InjecAgent and AgentDojo against both open-source and closed-source LLMs (e.g., GPT-4o-mini and GPT-5-nano). Our code is available at https://github.com/albert-y1n/PISmith.
> — Source : PDF page 1

---

### Résumé (5 lignes)

- **Problème :** Les défenses PI SOTA affichent des ASR quasi-nulles contre des attaques statiques, créant une fausse impression de sécurité ; leur robustesse face à un attaquant adaptatif reste non évaluée (Section 1, p. 1).
- **Méthode :** PISmith entraîne un LLM d'attaque (Qwen3-4B) via GRPO augmenté de deux mécanismes : (1) régularisation entropique adaptative (pour maintenir l'exploration sous récompense éparse) et (2) pondération dynamique des avantages (pour amplifier l'apprentissage des rares succès) (Section 3.3, pp. 4-6).
- **Données :** 13 benchmarks (QA, RAG, Long-Context), 100 échantillons Dolly Closed QA en entraînement, évaluation cross-tâche sur 1 700 cas ; InjecAgent et AgentDojo en setting agentique (Section 4.1, p. 6).
- **Résultat :** Contre Meta-SecAlign-8B (SOTA), PISmith atteint ASR@10=1.0 et ASR@1=0.87 en moyenne sur 13 benchmarks, contre ASR@1=0.48 pour RL-Hammer (meilleure baseline) ; sur InjecAgent, ASR@1>=0.95 sur tous les LLMs dont GPT-5-nano (Tables 1-2, pp. 7-8).
- **Limite :** Evaluation limitée à des tâches d'injection indirecte à objectif unique ; les settings multi-step complexes (AgentDojo) montrent des ASR plus faibles sur GPT-5-nano (ASR@1=0.24) ; le juge LLM-as-judge (GPT-4o-mini) est potentiellement manipulable (Sections 4.4, D.2, pp. 8, 18).

---

### Analyse critique

**Forces :**
- **Évaluation la plus complète à ce jour du genre RL-PI :** 8 défenses x 13 benchmarks x 7 baselines (3 catégories) — couverture systématique sans précédent dans la littérature PI (Section 4, p. 6). [PREPRINT — claim auteur, non peer-reviewed]
- **Efficacité remarquable :** PISmith brise toutes les défenses SOTA testées avec seulement 15 000 requêtes d'entraînement (100 cas x 10 epochs x K=15 rollouts), soit le coût le plus bas parmi toutes les méthodes comparées — moins que RL-Hammer (30 000) et nettement moins que les méthodes search-based (TAP : 82 110, Strategy : 194 140) (Table 4, p. 20).
- **Généralisation cross-tâche démontrée :** entraîné uniquement sur Dolly Closed QA, PISmith généralise à 12 benchmarks non vus incluant des tâches RAG et Long-Context structurellement différentes (Section 4.2, p. 7).
- **Résultat agentique fort :** ASR@1=0.99 sur Meta-SecAlign-8B (InjecAgent) et ASR@1=0.95 sur GPT-5-nano — défense renforcée (Singh et al., 2025) — là où toutes les attaques statiques échouent (ASR@1=0.00) (Table 2, p. 8).
- **Diagnostic RL rigoureux :** Identification et résolution de deux modes d'échec orthogonaux de GRPO standard (entropy collapse + dilution des succès rares) avec justification théorique et validation expérimentale par ablation (Sections 3.2-3.3, 4.5, pp. 3-6, 9).
- **Code public :** https://github.com/albert-y1n/PISmith — reproductibilité complète possible.

**Faiblesses :**
- **Juge LLM-as-judge (GPT-4o-mini) :** les auteurs utilisent GPT-4o-mini pour évaluer le succès d'attaque (Section D.2, p. 18). La littérature AEGIS montre des taux de manipulation jusqu'à 99% pour les juges LLM (P044, Unit42 2026). Les auteurs ne rapportent pas de validation humaine ni de juge déterministe.
- **Modèle attaquant fixe (Qwen3-4B) :** un seul modèle d'attaque est testé — la dépendance au modèle base n'est pas étudiée.
- **AgentDojo limité :** ASR@1=0.24 sur GPT-5-nano (Table 3, p. 8) — les workflows multi-step end-to-end restent partiellement résistants ; les auteurs reconnaissent que le succès requiert la sélection correcte des outils ET des arguments valides, condition plus difficile à satisfaire.
- **Injected tasks simplifiées :** 4 catégories (phishing, promotion, access denial, infrastructure failure) — pas d'exfiltration de données sensibles, pas d'injection multi-tour (Appendix C, p. 17).
- **Pas de defense agentique évaluée hors SecAlign :** MELON (Zhu et al.), DRIFT (Li et al., 2025a), ProGent (Shi et al., 2025b) ne sont pas testés.

**Questions ouvertes :**
- PISmith peut-il briser des défenses basées sur le contrôle de flux d'information (MELON, information-flow control) ?
- Le mécanisme d'entropie adaptative est-il transférable à d'autres domaines RL adversariaux (jailbreak, extraction) ?
- Quel est l'impact d'un LLM attaquant plus puissant (Qwen3-72B) sur les ASR AgentDojo ?

---

### Formules exactes

**Objectif d'optimisation principal (Eq. 1, Section 3.1, p. 4) :**
$$\max_{\pi_\phi} \frac{1}{|D|} \sum_{(x_{\text{inst}}, x_{\text{ctx}}, g) \in D} \mathbb{E}_{p \sim \pi_\phi(\cdot | x_{\text{inst}}, x_{\text{ctx}}, g)} \left[ r\left(M_\theta(x_{\text{inst}}, x_{\text{ctx}} \oplus p), g\right) \right]$$
où $r(\cdot, \cdot) \in \{0, 1\}$ est une récompense binaire indiquant le succès de l'attaque, et $\oplus$ désigne l'opération d'injection.

**Avantage GRPO standard (Eq. 2, Section 3.1, p. 4) :**
$$A_i = \frac{r_i - \bar{r}}{\sigma_r + \epsilon}, \quad \bar{r} = \frac{1}{K}\sum_{j=1}^K r_j, \quad \sigma_r = \sqrt{\frac{1}{K}\sum_{j=1}^K (r_j - \bar{r})^2}$$

**Loss GRPO standard (Eq. 3, Section 3.1, p. 4) :**
$$\mathcal{L}_{\text{GRPO}} = -\frac{1}{K}\sum_{i=1}^K \min(\rho_i A_i, \text{clip}(\rho_i, 1-\epsilon_c, 1+\epsilon_c)A_i) + \beta_{KL} \cdot D_{\text{KL}}(\pi_\phi \| \pi_{\text{ref}})$$

**Régularisation entropique adaptative (Eq. 4-5, Section 3.3.1, p. 5) :**
$$\mathcal{L}_{\text{entropy}} = \begin{cases} -\beta(\bar{r}) \cdot H(\pi_\phi) & \text{if } H(\pi_\phi) < H_{\text{cap}} \\ 0 & \text{otherwise} \end{cases}$$
$$\beta(\bar{r}) = \begin{cases} \beta_{\text{base}} + (\beta_{\max} - \beta_{\text{base}}) \cdot \frac{\tau - \bar{r}}{\tau} & \text{if } \bar{r} < \tau \\ \beta_{\text{base}} & \text{if } \bar{r} \geq \tau \end{cases}$$
Hyperparamètres : $H_{\text{cap}} = 0.5$, $\beta_{\max} = 0.01$, $\beta_{\text{base}} = 0.001$, $\tau = 0.5$ (Appendix D.1, p. 18).

**Pondération dynamique des avantages (Eq. 6-7, Section 3.3.2, p. 6) :**
$$\tilde{A}_i = \begin{cases} A_i \cdot \gamma(\bar{r}) & \text{if } r_i = 1 \\ A_i & \text{if } r_i = 0 \end{cases}, \quad \gamma(\bar{r}) = \begin{cases} 1 & \text{if } \bar{r} \geq \tau \\ 1 + (\gamma_{\max} - 1) \cdot \frac{\tau - \bar{r}}{\tau} & \text{if } \bar{r} < \tau \end{cases}$$
Hyperparamètre : $\gamma_{\max} = 5.0$ (Appendix D.1, p. 18).

**Loss complète PISmith (Eq. 8, Section 3.3.3, p. 6) :**
$$\mathcal{L}_{\text{PISmith}} = -\frac{1}{K}\sum_{i=1}^K \min\left(\rho_i \tilde{A}_i, \text{clip}(\rho_i, 1-\epsilon_c, 1+\epsilon_c)\tilde{A}_i\right) + \mathcal{L}_{\text{entropy}}$$

Lien glossaire AEGIS : F22 (ASR, métrique empirique), F01-F10 (vecteurs PI).

---

### Pertinence thèse AEGIS

**Couches delta :**
- **δ¹ (manipulation du contexte utilisateur / IPI) :** PISmith cible l'injection indirecte via le contexte RAG et les données externes — cœur de la couche δ¹. Démonstration que même les défenses δ¹-hardened (SecAlign, DataSentinel) sont brisées.
- **δ² (attaque agentique, pipeline multi-agents) :** Évaluation sur InjecAgent et AgentDojo — injection dans les tool outputs pour rediriger les actions d'un agent. PISmith atteint ASR@1=0.95 sur GPT-5-nano en setting agentique (Table 2, p. 8).
- **δ⁰ indirect :** Implication que l'alignement RLHF (δ⁰) de Meta-SecAlign-8B (DPO sur préférences) est insuffisant face à un attaquant adaptatif — renforcement de C1.

**Conjectures :**
- **C1 (insuffisance δ⁰ face à PI adaptative) — SUPPORTÉE :** Meta-SecAlign-8B, fine-tuné par DPO pour résister à PI, obtient ASR@10=1.0 / ASR@1=0.87 sous PISmith. "State-of-the-art prompt injection defenses remain vulnerable to adaptive attacks" (Conclusion, p. 10). [EXPERIMENTAL]
- **C2 (insuffisance des défenses SOTA face à un attaquant adaptatif) — FORTEMENT SUPPORTÉE :** "No existing defense can simultaneously maintain high task utility and defend against adaptive attacks" (Section 4.3, p. 7). Sur 7 défenses testées (filter + prevention), toutes présentent soit un ASR@1 élevé (>0.80) soit une dégradation utility sévère. Le seul point relativement résistant (DataSentinel, ASR@1=0.52) détruit l'utility (Utility=0.55 vs 0.74 sans défense) (Table 5, p. 21). [EXPERIMENTAL]

**Découvertes AEGIS :**
- **D-013 (red teaming RL) — CONFIRMÉE ET RENFORCÉE :** PISmith s'inscrit dans le cluster RL-PI (P145/AutoInjectRL, RL-Hammer) et le surpasse systématiquement. La tension utility/robustness est établie empiriquement sur 13 benchmarks.
- Nouvelle découverte potentielle : l'entropy collapse est le mode d'échec fondamental du GRPO standard pour PI red teaming (non identifié dans les travaux AEGIS précédents) — à intégrer dans RESEARCH_STATE.

**Gaps adressés / créés :**
- **G-007 (attaque adaptative black-box) — PARTIELLEMENT ADRESSÉ :** PISmith opère strictement en black-box (query + output uniquement). Résout G-007 côté attaquant.
- **G-009 (évaluation défenses agentiques) — PARTIELLEMENT ADRESSÉ :** InjecAgent + AgentDojo évalués. Mais MELON, DRIFT, ProGent absents — gap résiduel.
- **Gap créé :** Aucune défense ne se trouve dans la région désirable (haute utility + faible ASR) — définit un objectif de recherche ouvert pour δ³ (défense robuste et utile simultanément).

**Mapping templates AEGIS :**
- Stratégie "Context Ignoring" (#07) et "Fake Completion" (#08) correspondent aux static baselines directement comparées.
- Stratégie "Authority Escalation" visible dans les prompts PISmith générés (Tables 14-16) — mapping #11/#14.
- Mécanisme d'injection "legitimate update" (template d'entraînement PISmith) = nouveau vecteur à intégrer.

---

### Citations clés

> "We find that directly applying standard GRPO leads to sub-optimal performance due to two compounding failure modes: (1) the policy overfits to the few successful injected prompts, leading to entropy collapse that terminates exploration; and (2) even when exploration is maintained, the rare successes are diluted by the majority of failures in the gradient, preventing efficient learning." (Section 3, Introduction, p. 2)

> "State-of-the-art prompt injection defenses cannot effectively maintain high utility in benign settings while simultaneously resisting adaptive attacks." (Section 4, contribution bullet, p. 2)

> "PISmith generalizes effectively to all 12 unseen benchmarks, achieving an average ASR@10 of 1.0 and ASR@1 of 0.87. This represents a substantial improvement over the strongest baseline RL-Hammer (0.70/0.48)." (Section 4.2, p. 7)

> "Notably, PISmith reaches 0.95 on GPT-5-nano, where all static attacks completely fail, demonstrating the strong red-teaming ability of PISmith to closed-source LLMs." (Section 4.4, p. 8)

> "The absence of any defense in the desirable lower-right region of Figure 2 (high utility, low ASR) highlights an open challenge: state-of-the-art defenses cannot simultaneously maintain task performance and withstand adaptive attacks." (Section 4.3, p. 7)

> "PISmith requires 32,000 total queries, which is the lowest among all methods. [...] Despite requiring no training, search-based methods are significantly more expensive than PISmith due to their per-instance optimization—TAP (2.6×), PAIR (2.3×), and Strategy (6.1×)—while achieving substantially lower attack success rates." (Appendix D.4, p. 20-21)

---

### Classification

| Champ | Valeur |
|-------|--------|
| **Type d'attaque** | Indirect PI (IPI) — black-box adaptive, via contexte externe et tool outputs |
| **Surface ciblee** | Contexte utilisateur (RAG, documents), Tool outputs (agentique) |
| **Modèles testés** | Meta-SecAlign-8B, GPT-4o-mini (instruction hierarchy), GPT-4.1-nano, GPT-5-nano, Qwen3-4B-Instruct-2507 |
| **Defense évaluée** | 8 défenses : Sandwich, Instructional, PromptArmor, DataFilter (prevention) + PIGuard, PromptGuard, DataSentinel, SecAlign (filter/alignment) |
| **MITRE ATLAS** | AML.T0051 (LLM Prompt Injection), AML.T0054 (LLM Jailbreak — agentique) |
| **OWASP LLM** | LLM01 (Prompt Injection) |
| **SVC pertinence** | 9/10 — résultats directs sur des défenses SOTA, vecteur RL PI, cross-tâche, agentique |
| **Reproductibilité** | Haute — code public (https://github.com/albert-y1n/PISmith), hyperparamètres complets (Appendix D), benchmarks publics |
| **Code disponible** | Oui — https://github.com/albert-y1n/PISmith |
| **Dataset public** | Oui — 13 benchmarks publics (SQuAD v2, Dolly, NQ, HotpotQA, MSMARCO, LongBench, InjecAgent, AgentDojo) |
| **Couches delta** | δ¹ (IPI contexte), δ² (agentique) |
| **Conjectures** | C1 SUPPORTÉE [EXPERIMENTAL], C2 FORTEMENT SUPPORTÉE [EXPERIMENTAL] |
| **Statut** | [PREPRINT] — arXiv:2603.13026, 2026-03, under review |
| **Cluster AEGIS** | Red-team RL (P145/AutoInjectRL, RL-Hammer/Wen 2025, PISmith) — réseau Penn State (Geng, Jia = P018/PIArena) |
