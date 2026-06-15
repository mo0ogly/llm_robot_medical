## [Li, Qin, Jia, et al., 2026] — Le raisonnement comme surface d'attaque : jailbreaks CoT evolutionnaires adaptatifs

**Reference :** arXiv:2605.24497
**Revue/Conf :** ICML 2026 — Proceedings of the 43rd International Conference on Machine Learning, Seoul, South Korea. PMLR 306, 2026.
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P159_Li_2026_AECoTReasoningJailbreak.pdf](../../literature_for_rag/P159_Li_2026_AECoTReasoningJailbreak.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet (28 pages, ICML 2026 accepte)

---

### Abstract original

> Large Reasoning Models (LRMs) have demonstrated remarkable capabilities in reasoning and generation tasks and are increasingly deployed in real-world applications. However, their explicit chain-of-thought (CoT) mechanism introduces new security risks, making them particularly vulnerable to jailbreak attacks. Existing approaches often rely on static CoT templates to elicit harmful outputs, but such fixed designs suffer from limited diversity, adaptability, and effectiveness. To overcome these limitations, we propose an adaptive evolutionary CoT jailbreak framework, called AE-CoT. Specifically, the method first rewrites harmful goals into mild prompts with teacher role-play and decomposes them into semantically coherent reasoning fragments to construct a pool of CoT jailbreak candidates. Then, within a structured representation space, we perform multi-generation evolutionary search, where candidate diversity is expanded through fragment-level crossover and a mutation strategy with an adaptive mutation-rate control mechanism. An independent scoring model provides graded harmfulness evaluations, and high-scoring candidates are further enhanced with a harmful CoT template to induce more destructive generations. Extensive experiments across multiple models and datasets demonstrate the effectiveness of the proposed AE-CoT, consistently outperforming state-of-the-art jailbreak methods.
> — Source : PDF page 1

---

### Resume (5 lignes)

- **Probleme :** Les Large Reasoning Models (LRMs) exposent un vecteur d'attaque inédit via leur mécanisme CoT explicite ; les méthodes de jailbreak existantes reposent sur des templates statiques qui manquent de diversité et d'adaptabilité face à ces modèles. (Section 1, p. 1)
- **Methode :** AE-CoT — réécriture du goal malveillant en prompt pédagogique "teacher-style", décomposition en fragments CoT, recherche évolutionnaire multi-générations dans un espace structuré à 9 dimensions (Θ = S×D×I×C×A×B×N×T×K, |Θ| ≤ 50⁹), avec croisement fragment-level et contrôle adaptatif du taux de mutation µk. (Sections 3.1–3.4, pp. 3–5)
- **Donnees :** 50 comportements AdvBench + benchmark Malicious-Educator (Kuo et al., 2025) ; cibles : o1-mini, o3-mini, GPT-5, DeepSeek-R1, Qwen3-235B, Gemini-2.5-Flash-thinking, Grok-3, Doubao-seed-1-6-thinking ; juge fixe : GPT-4o. (Section 4.1, p. 6)
- **Resultat :** ASR de 96 % sur DeepSeek-R1, Qwen3 et Gemini-2.5 (AdvBench-subset) ; 92 % sur o1-mini ; 88 % sur o3-mini ; 54 % sur GPT-5 ; transfert Grok-3 → GPT-4o : 98 %, → GPT-3.5-turbo : 100 %, → DeepSeek-v3.1 : 100 %. (Table 1, p. 7 ; Table 3, p. 8)
- **Limite :** (1) Dépendance au juge LLM pour le fitness (GPT-4o), susceptible de biais — ASR humaine légèrement inférieure à l'ASR LLM (ex. o3-mini : 84 % humain vs 88 % LLM-juge) ; (2) Espace Θ construit à partir du benchmark Malicious-Educator, ce qui pourrait limiter la généralisation hors distribution ; (3) Coût API non négligeable : 0,345 $ en moyenne par tâche, 18,8 appels target-model par goal. (Appendice J, p. 18 ; Section 4.7, p. 9 ; Section 3.3, p. 4)

---

### Analyse critique

**Forces :**
- **Formalisation rigoureuse** de l'espace de recherche Θ comme produit cartésien de 9 dimensions discrètes avec au plus 50 candidats par dimension (Eq. 6-7, p. 4), ce qui rend le framework reproductible et auditables.
- **Ablation complète** (Table 5, p. 8) : suppression du rewriting teacher-style → ASR chute de 90 % à 50 % ; suppression de la mutation adaptative → ASR chute de 90 % à 60 % ; chaque composant est justifié expérimentalement.
- **Convergence de l'évaluation** : comparaison multi-juges (GPT-4o, Qwen-Max, Grok-3, GPT-5 — Appendice I, Table 16, p. 17) et validation humaine par 5 annotateurs (Appendice J, Table 17, p. 18), ce qui réduit les biais LLM-juge.
- **Efficience** : 3× plus rapide que CL-GSO (193,77 s vs 589,26 s sur Gemini-2.5 — Table 4, p. 8) grâce à l'arrêt précoce et à la recherche structurée.
- **Transferabilité démontrée** cross-modèle et cross-seed (Appendice E, Table 12, p. 15 : o3-mini et Qwen-Max comme seed atteignent 100 % ASR sur GPT-4o).

**Faiblesses :**
- **Juge LLM biaisant le fitness** : les scores de fitness f(C) ∈ [0,5] sont assignés par GPT-4o (Section 4.1, p. 6). Or P044 (Unit42, 2026) démontre un 99 % flip-rate pour les juges LLM sous pression adversariale — les auteurs partiellement mitigent via évaluation multi-juges, mais le biais demeure dans la boucle évolutionnaire.
- **Espace Θ dérivé du seul benchmark Malicious-Educator** (Section 3.3, p. 4) : les 50 options par dimension sont échantillonnées sur ce benchmark, créant un risque de sur-adaptation à ses patterns. Les résultats sur GPT-5 (54 % ASR) suggèrent une limite pour les modèles les plus robustes.
- **Black-box uniquement** : le framework suppose un accès API input/output sans accès aux activations internes ou aux traces de raisonnement côté modèle (Section 3.2, p. 3). Les mécanismes mécanistiques (pourquoi le modèle cède) ne sont pas analysés — contrairement à P094 (Zhao & Dong, 2026, CoT Hijacking mécaniste) et P102 (attention heads).
- **Pas de defense proposée** : le papier diagnostique la vulnérabilité sans contribuer à la défense au-delà des résultats Table 7 (défenses partielles).

**Questions ouvertes :**
- La défense combinée réduit l'ASR de 100 % à 60 % sur Gemini-2.5-Pro-Thinking (Table 7, p. 9) — quelles défenses process-level (supervision de raisonnement intermédiaire) seraient efficaces ? Les auteurs renvoient à Lightman et al. (2023) pour les PRM, mais ne quantifient pas.
- La vulnérabilité de GPT-5 est nettement moindre (54 % vs 96 %) : est-ce dû à un entraînement process-level ou à un RLHF plus robuste ? Le papier ne tranche pas.
- Généralisation multi-lingue non testée (contrairement à P088 Classical Chinese — arXiv:2602.22983).

---

### Formules exactes

**Decomposition du prompt adversarial** (Eq. 1, Section 3.2, p. 3) :

```
P = M + S + C
```
où M = prompt principal (rewriting pédagogique), S = suffixe structurel fixe, C = suffixe CoT évolué.

**Rewriting du goal** (Eq. 2, Section 3.2, p. 3) :

```
M = A(R(g))
```
où A est le LLM attaquant, R le template de rewriting, g ∈ G l'objectif malveillant.

**Paramétrage du suffixe CoT** (Eq. 3, Section 3.2, p. 3) :

```
C = phi(x),   x ∈ Theta
```

**Fonction fitness** (Eq. 4-5, Section 3.2, p. 3) :

```
f(C) = J(T(P)),   max_{x ∈ Theta} f(phi(x))
```
avec J : réponse → {0, 1, 2, 3, 4, 5} (0 = refus strict, 5 = instructions exécutables détaillées).

**Espace de recherche** (Eq. 6-7, Section 3.3, p. 4) :

```
Theta = S x D x I x C x A x B x N x T x K
|Theta| <= prod_{j=1}^{9} |X_j|,   avec |X_j| <= 50
```

**Population** (Eq. 10, Section 3.4, p. 5) :

```
P_k = {I_{k,1}, ..., I_{k,N}},   N = 10
I_{k,i} = (x_{k,i}, C_{k,i}, f_{k,i})
```

**Mutation adaptative** (Eq. 12-13, Section 3.4, p. 5) :

```
x'_{k,o,j} = x_{k,o,j}      avec prob. 1 - mu_k
           = x_{new,j} ~ X_j avec prob. mu_k

mu_{k+1} = max(mu_k - 0.1, 0.1)   si Delta f_k > 0
         = min(mu_k + 0.1, 0.3)   si Delta f_k <= 0

avec mu_0 = 0.1,   Delta f_k = f*_k - f*_{k-1}
```

**Verification early stopping** (Eq. 14, Section 3.4, p. 5) :

```
f_{verify,k,i} = J(T(P_{k,i} | temp=0, det))
Si f_{verify} >= 3 → retourner C_{k,i} comme C*
```

*Note epistemique : toutes ces formules sont des definitions/algorithmes [ALGORITHME] — aucune garantie de convergence prouvée formellement. La borne |Θ| ≤ 50⁹ est une borne de cardinalité, pas une garantie d'efficience de la recherche.*

---

### Pertinence these AEGIS

**Couches delta :**
- **δ⁰ (RLHF/alignement)** : AE-CoT démontre que RLHF est insuffisant pour les LRMs — le mécanisme CoT crée un vecteur orthogonal à l'alignement par output filtering. ASR 92 % sur o1-mini (Table 1) malgré un entraînement RLHF intensif. *Direction : C1 affaiblie* (RLHF insuffisant à δ⁰).
- **δ¹ (contexte/RAG)** : le rewriting teacher-style (Eq. 2) opère au niveau du contexte injecté, mais l'attaque principale cible le raisonnement interne — non le RAG. Pertinence δ¹ limitée pour AE-CoT (le papier ne traite pas de RAG).
- **δ² (monitoring/détection)** : Table 7 montre que les défenses d'inférence (length limit, safety reminder, safety check) n'atteignent que 90 % ASR résiduels individuellement, 60 % en combinaison sur Gemini-2.5-Pro-Thinking — *gap majeur* pour les moniteurs de couche δ².
- **δ³ (validation formelle)** : le papier plaide pour des "process-based supervision" (Lightman et al., 2023 ; Uesato et al., 2022) comme défense, i.e. des PRM qui valident les étapes intermédiaires — directement applicable en δ³.

**Conjectures :**
- **C7 (paradoxe raisonnement/sécurité) — SUPPORTEE FORTEMENT** : AE-CoT est l'evidence expérimentale directe de C7. Les LRMs avec CoT explicite sont *plus* vulnérables que les LLMs classiques sur exactement les mêmes queries (comparaison baseline : CodeAttack 54 % sur o1-mini vs AE-CoT 92 %). La trace de raisonnement elle-même constitue la surface d'attaque. Citation directe : "their explicit chain-of-thought (CoT) mechanism introduces new security risks, making them particularly vulnerable to jailbreak attacks" (Abstract, p. 1).
- **C1 (insuffisance δ⁰ RLHF) — SUPPORTEE** : 92 % ASR sur o1-mini, 96 % sur DeepSeek-R1 malgré leur alignement RLHF (Table 1, p. 7) ; le rewriting teacher-style seul contribue +40 points ASR (ablation Table 5 : 50 % → 90 % sans/avec rewriting).

**Decouvertes — lien cluster C7 :**

| Papier | Approche | Relation AE-CoT |
|--------|----------|-----------------|
| P087 (H-CoT, Kuo et al., 2025) | Templates CoT statiques pour jailbreak LRM | AE-CoT = extension évolutionnaire de H-CoT ; améliore H-CoT de +38 % ASR sur o1-mini (54→92 %) |
| P089 (SEAL) | Alignment auto-évalué | Traité comme cible ; SEAL pertinent pour la défense |
| P092 (self-jailbreak) | Jailbreak par auto-persuasion | Mécanisme adjacent — auto-manipulation vs manipulation CoT externe |
| P094 (CoT Hijacking mécaniste, Zhao & Dong, 2025) | Analyse mécanistique des défaillances reasoning | Complémentaire : AE-CoT = phénoménologie, P094 = mécanismes internes |
| P102 (attention heads) | Rôle des têtes d'attention dans la sécurité | AE-CoT opère en black-box ; P102 fournirait l'explication mécanistique de l'efficacité |
| P141 (Cost of Thinking) | Overhead computationnel du raisonnement | AE-CoT exploite le raisonnement long ; complémentaire sur l'angle "coût vs sécurité" |

**Gaps :**
- **RR-RUN4-003 (sécurité LRM)** : AE-CoT apporte une evidence expérimentale solide (ICML 2026, N=50 goals×6 modèles) sur la vulnérabilité des LRMs. Adresse partiellement RR-RUN4-003 en confirmant la vulnérabilité mais sans proposer de défense validée pour les LRMs dans un contexte médical.
- **Gap résiduel** : les expériences portent sur AdvBench/Malicious-Educator (domaine généraliste). Extension au domaine médical (cf. Lee et al., 2025, JAMA, 94.4 % ASR) non testée — gap pour AEGIS.

**Mapping templates AEGIS :**
- Templates d'autorité institutionnelle ("instructor for law enforcement", "teacher for financial auditors") → correspond aux templates AEGIS d'autorité institutionnelle médicale
- Teacher-style rewriting → opérateur de mutation AEGIS (autorité + pédagogie)
- Fragment-level CoT decomposition → pattern de décomposition multi-étapes des templates avancés AEGIS

---

### Citations cles

> "their explicit chain-of-thought (CoT) mechanism introduces new security risks, making them particularly vulnerable to jailbreak attacks. Existing approaches often rely on static CoT templates to elicit harmful outputs, but such fixed designs suffer from limited diversity, adaptability, and effectiveness." (Abstract, p. 1)

> "This gap highlights the need for jailbreak strategies that specifically exploit reasoning traces as the true attack surface." (Section 1, p. 1)

> "surface-level defenses are insufficient against reasoning-based jailbreaks, and highlights the need for reasoning-aware defenses that monitor or verify intermediate reasoning processes instead of relying only on final-output filtering." (Section 4.8, p. 9)

> "AE-CoT achieves a 100% attack success rate on all five tasks with an average cost of $0.345 per task, and a total cost of $1.725 across all tasks." (Section 4.7, p. 9, Table 6)

> "AE-CoT consistently outperforms strong baselines. In particular, AE-CoT achieves the best ASR and HS on OpenAI-o1-mini, OpenAI-o3-mini, GPT-5, Qwen3, and Gemini-2.5-Flash, while also remaining competitive on DeepSeek-R1." (Section 4.2, p. 6–7)

> "Removing the initial rewriting step causes a marked degradation in both Avg. Score and ASR [...] Crucially, disabling the adaptive mutation-rate schedule produces a substantial drop in Avg. Score and ASR" (Section 4.6, p. 8)

---

### Classification

| Champ | Valeur |
|-------|--------|
| **Nature epistemique** | [ALGORITHME] — framework évolutionnaire, pas de preuve de convergence formelle ; résultats empiriques validés sur N=50 goals |
| **SVC pertinence AEGIS** | 9/10 — evidence directe de C7, ICML 2026, multi-modèles, ablation rigoureuse |
| **Reproductibilite** | Haute — pseudocode Algorithm 1 (Appendice A, p. 13), espace Θ spécifié (Table 8, p. 14), templates publiés (Appendices K.1-K.2, pp. 18-20), protocole juge fixé (GPT-4o) |
| **Code disponible** | Non mentionné dans le papier (pas d'URL GitHub identifiée) |
| **Dataset public** | AdvBench (Zou et al., 2023, arXiv:2307.15043) — public ; Malicious-Educator (Kuo et al., 2025, arXiv:2502.12893) — public |
| **Modeles testes** | o1-mini, o3-mini, GPT-5, DeepSeek-R1, Qwen3-235B, Gemini-2.5-Flash-thinking, Grok-3, Doubao-seed-1-6-thinking, GPT-4o, GPT-3.5-turbo, DeepSeek-v3.1, Gemini-2.5-Pro-Thinking, Gemini-3-Pro |
| **Type d'attaque AEGIS** | Jailbreak — black-box, exploitation de la trace CoT, multi-tour implicite (generations evolutionnaires) |
| **MITRE ATLAS** | AML.T0051 (LLM Prompt Injection) — variante reasoning-layer |
| **OWASP LLM** | LLM01 (Prompt Injection via CoT manipulation) |
| **Statut** | [ARTICLE VERIFIE] — ICML 2026 (peer-reviewed, PMLR 306) |
