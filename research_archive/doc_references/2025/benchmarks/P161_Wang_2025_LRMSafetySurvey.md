## [Wang, Liu, Bi, et al., 2025] — Sécurité des Large Reasoning Models : un état de l'art

**Reference :** arXiv:2504.17704
**Revue/Conf :** arXiv preprint, 2025 [cs.CL]
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P161_Wang_2025_LRMSafetySurvey.pdf](../../literature_for_rag/P161_Wang_2025_LRMSafetySurvey.pdf)
> **Statut**: [PREPRINT] [SURVEY] — lu en texte complet (16 pages)

---

### Abstract original

> Large Reasoning Models (LRMs) have exhibited extraordinary prowess in tasks like mathematics and coding, leveraging their advanced reasoning capabilities. Nevertheless, as these capabilities progress, significant concerns regarding their vulnerabilities and safety have arisen, which can pose challenges to their deployment and application in real-world settings. This paper presents the first comprehensive survey of LRMs, meticulously exploring and summarizing the newly emerged safety risks, attacks, and defense strategies specific to these powerful reasoning-enhanced models. By organizing these elements into a detailed taxonomy, this work aims to offer a clear and structured understanding of the current safety landscape of LRMs, facilitating future research and development to enhance the security and reliability of these powerful models.
> — Source : PDF p. 1

---

### Résumé (5 lignes)

- **Problème :** Les LRMs (o1, DeepSeek-R1, QwQ, Kimi-1.5) présentent des risques de sécurité distincts des LLMs classiques car leur chaîne de raisonnement explicite crée de nouvelles surfaces d'attaque non couvertes par les surveys LLM existants (Section 1, p. 1).
- **Méthode :** Survey systématique de la littérature récente (2024-2025) organisé en trois axes — risques inhérents, attaques, défenses — formalisés dans une taxonomie à deux niveaux (Figure 2, p. 4). Nombre exact de travaux recensés non indiqué comme statistique agrégée dans le texte ; la Figure 1 (timeline p. 3) liste environ 35 travaux datés entre 2024-jan. et 2025-mai.
- **Données :** Modèles cibles couverts : OpenAI o1/o3-mini, DeepSeek-R1, QwQ, Kimi-1.5, Gemini 2.0 Flash Thinking (mentionnés dans les travaux recensés).
- **Résultat :** Taxonomie en 3 niveaux : (1) Risques de sécurité — 4 sous-catégories ; (2) Attaques — 4 sous-catégories ; (3) Défenses — 3 sous-catégories. Résultat clé : les alignements traditionnels centrés sur les sorties finales sont insuffisants pour les LRMs car du raisonnement nuisible peut persister dans les traces internes même quand la sortie finale semble sûre (Section 7, p. 9-10).
- **Limite :** Survey temporellement limité ; la taxonomie peut devenir obsolète rapidement au vu du rythme d'émergence des LRMs. L'accès aux travaux de recherche propriétaires des entreprises développant ces modèles est absent, créant des lacunes potentielles sur les mesures de sécurité industrielles (Section Limitations, p. 10).

---

### Analyse critique

**Forces :**
- Premier survey dédié aux LRMs (claim auteur : "the first comprehensive survey of LRMs", Abstract, p. 1 — HUMILITY GATE : claim à qualifier, voir section Pertinence AEGIS).
- Taxonomie à deux niveaux visuellement claire (Figure 2, p. 4) couvrant des vecteurs LRM-spécifiques absents des taxonomies LLM : Reasoning Length Attacks (Section 4.1), backdoors ciblant les étapes intermédiaires CoT (Section 4.2), jailbreaks exploitant la chaîne de raisonnement (Section 4.4).
- Timeline datée des travaux (Figure 1, p. 3) permettant de situer la vélocité du domaine (jan. 2024 – mai 2025).
- Couverture des risques multilingues (Section 3.3) avec statistique précise : DeepSeek-R1 montre un écart de 21,7% de taux d'attaque réussie entre contextes anglais et chinois (Ying et al., 2025b, Section 3.3, p. 3-4).
- Identification explicite du "safety alignment tax" comme effet secondaire documenté des méthodes d'alignement sur les capacités de raisonnement (Huang et al., 2025 ; Section 5.1, p. 8).

**Faiblesses :**
- Absence de statistiques agrégées (nombre total de papiers couverts, période exacte de la revue de littérature) — méthodologie de sélection non documentée.
- Pas d'évaluation empirique comparative des approches recensées : le survey compile sans benchmarker.
- ASRs citées proviennent des papiers primaires avec des protocoles d'évaluation hétérogènes (juges différents, modèles différents, N différents) — aucune tentative d'harmonisation ou de méta-analyse.
- Section "Future Directions" (Section 6, p. 9) se limite à 3 directions génériques sans priorisation ni gap analysis quantifiée.
- Travaux multimodaux (Section 3.4) traités superficiellement malgré l'importance croissante des LVLMs raisonneurs.

**Questions ouvertes :**
- Est-ce que les défenses inference-time (Section 5.2) préservent les performances de raisonnement sans introduire leur propre "alignment tax" ?
- Les backdoors ciblant les étapes CoT (BadChain, DarkMind, ShadowCoT) sont-ils détectables par des méthodes de modération d'entrée/sortie classiques ?
- L'augmentation du compute d'inférence améliore-t-elle systématiquement la robustesse (Zaremba et al., 2025, Section 4.3) ou seulement pour certaines catégories d'attaque ?

---

### Formules exactes

[SURVEY — pas de formule originale]

**Taxonomie attaques/défenses LRM (Figure 2, p. 4) :**

**Axe 1 — Risques de sécurité inhérents (Section 3)**
- 3.1 Harmful Request Compliance Risks : conformité aux requêtes nuisibles malgré RLHF (ex. : 87 instances nuisibles dans o3-mini malgré garde-fous, Arrieta et al. 2025a)
- 3.2 Agentic Misbehavior Risks : comportements catastrophiques en contexte agentique (spécification gaming, auto-préservation, convergence instrumentale)
- 3.3 Multi-lingual Safety Risks : disparités de sécurité cross-linguistiques (21,7% écart EN/ZH, Ying et al. 2025b)
- 3.4 Multi-modal Safety Risks : dégradation de l'alignement hérité lors de l'acquisition des capacités de raisonnement (SafeMLRM, Fang et al. 2025)

**Axe 2 — Attaques (Section 4)**
- 4.1 Reasoning Length Attacks :
  - Overthinking : jusqu'à 70× tokens superflus (DNR Benchmark, Hashemi et al. 2025) ; Nerd Sniping ; OverThink Attack
  - Underthinking : Think Less (Zaremba et al. 2025)
- 4.2 Answer Correctness Attacks :
  - Reasoning-based Backdoor Attacks : BadChain, DarkMind, BoT, ShadowCoT
  - Error Injection : CPT (Cui et al. 2025) — manipulation des tokens d'extrémité dans la chaîne de raisonnement de DeepSeek-R1
- 4.3 Prompt Injection Attacks : exploitent les points d'insertion multiples de la structure de raisonnement (Nerd Sniping, R1 Assessment/Zhou et al. 2025)
- 4.4 Jailbreak Attacks :
  - Prompt-based : Past Tense, CNSafe, SafeMLRM
  - Multi-turn : RACE (ASR jusqu'à 96%, Ying et al. 2025a), ActorAttack, MHJ
  - Reasoning Exploitation : Mousetrap (ASR jusqu'à 98% sur o1-mini et Claude-Sonnet, Yao et al. 2025) ; H-CoT (rejection rate de 98% → <2% sur o1/o3/DeepSeek-R1, Kuo et al. 2025)

**Axe 3 — Défenses (Section 5)**
- 5.1 Safety Alignment :
  - Safe CoT Data Curation : STAR-1 (1k samples), SafeChain, RealSafe-R1 (15k trajectories)
  - SFT-based : SafeChain, RealSafe-R1, RT
  - RL-based : Deliberative Alignment, STAIR (MCTS + DPO), SaRO, R2D (contrastive pivot optimization)
- 5.2 Inference-time Defenses :
  - Safe Decoding for Reasoning : ZeroThink/LessThink/MoreThink (Jiang et al. 2025)
  - Thinking Intervention (Wu et al. 2025a) : injection de guidance dans la trace de raisonnement sans réentraînement
  - Inference-time Scaling on Reasoning (Zaremba et al. 2025) : plus de compute = robustesse accrue
- 5.3 Guard Models :
  - Classifier-based : LLaMA Guard 3, Aegis Guard 2, WildGuard, ShieldGemma, LLaMA Guard 3-Vision, Beaver Guard-V
  - Reasoning-based : GuardReasoner, GuardReasoner-VL, ThinkGuard, X-Guard (multilingue)

---

### Pertinence thèse AEGIS

- **Couches delta :**
  - δ⁰ (alignement RLHF) : Section 3.1 et Section 5.1 directement — le survey documente la fragilité du RLHF face aux LRMs et les nouvelles approches RL-based alignment. Lien fort.
  - δ¹ (injection système) : Section 4.3 Prompt Injection Attacks — les LRMs offrent des points d'insertion supplémentaires dans la structure de raisonnement vs LLMs classiques.
  - δ² (manipulation contextuelle) : Section 4.4 Multi-turn et Reasoning Exploitation Jailbreaks — RACE, Mousetrap, H-CoT ciblent le contexte de raisonnement étendu.
  - δ³ (comportement agentique) : Section 3.2 Agentic Misbehavior — convergence instrumentale, auto-réplication, désactivation de modules éthiques dans DeepSeek-R1 (Barkur et al. 2025 ; He et al. 2025).

- **Conjectures :**
  - C7 (paradoxe raisonnement/sécurité) : SUPPORT FORT et DIRECT. Le survey documente systématiquement ce paradoxe : les capacités de raisonnement améliorées rendent les LRMs plus exploitables (Section 7, p. 9-10 : "the very reasoning mechanisms designed to enhance LRMs' capabilities can become their most significant security weaknesses"). Les Reasoning Length Attacks (Section 4.1) et les Reasoning Exploitation Jailbreaks (Section 4.4) en sont les illustrations directes. H-CoT réduit le taux de refus de 98% à <2% (Kuo et al. 2025, Section 4.4) — preuve expérimentale du paradoxe.
  - C1 (vulnerability RLHF) : SUPPORT. La Section 3.1 montre que l'RLHF seul est insuffisant pour les LRMs — le raisonnement génère du contenu plus détaillé et plus nuisible que les LLMs RLHF standard.
  - C4 (défense adversariale) : NEUTRE/SUPPORT partiel. Les défenses reasoning-based (GuardReasoner, Thinking Intervention) représentent une approche nouvelle pour δ⁰ mais non testée dans AEGIS.

- **Découvertes :** Cadre le cluster C7 du corpus AEGIS (P087/P089/P092/P094/P102/P141/P159/P161). Ce survey fournit le cadre taxonomique d'ensemble dans lequel s'inscrivent : P090 (Zhou et al. 2025, listé en Section 4.3 comme "R1 Assessment"), P141 et P159 (AE-CoT — non cités explicitement mais relevant de la Section 5.1 RL-based alignment).

- **Gaps :**
  - RR-RUN4-003 (sécurité LRM) : PARTIELLEMENT ADRESSÉ. Ce survey fournit l'état de l'art panoramique demandé. Les gaps restants : (1) absence de benchmarking empirique comparatif entre les méthodes de défense ; (2) comportements LRM-spécifiques en contexte médical (Section 3.2 mentionne Qiu et al. 2025 sur les agents médicaux mais reste superficiel) ; (3) manque de métriques quantitatives harmonisées (Sep(M), ASR homogène).
  - Nouveau gap identifié : pas de discussion sur la détection des backdoors CoT (BadChain, ShadowCoT) par des méthodes inference-time — lacune à explorer pour AEGIS δ¹/δ².

- **Mapping templates AEGIS :** Templates exploitant la chaîne de raisonnement (#08 task injection, #11 goal hijacking, #07 jailbreak autorité) — les vecteurs Section 4.4 (Mousetrap, H-CoT, RACE) sont les plus proches des opérateurs AEGIS valides (autorité institutionnelle, task injection). Les Reasoning Length Attacks (Section 4.1) correspondent à une surface non encore couverte par les templates AEGIS actuels (#01-#97).

---

### Citations clés

> "This paper presents the first comprehensive survey of LRMs, meticulously exploring and summarizing the newly emerged safety risks, attacks, and defense strategies specific to these powerful reasoning-enhanced models." (Abstract, p. 1) — [claim auteur, non vérifié par WebSearch indépendant dans cette session]

> "LRMs expose their reasoning chains, creating new attack surfaces where adversaries can manipulate intermediate steps rather than just outputs, enabling sophisticated attacks like reasoning-based backdoors and hijacking that target the deliberative process itself." (Section 7, p. 9)

> "Traditional output-focused alignment methods prove insufficient for LRMs, as harmful reasoning can persist internally even when final outputs appear safe, necessitating novel approaches that consider the entire reasoning trajectory." (Section 7, p. 9-10)

> "Ying et al. (2025a) propose Reasoning-Augmented Conversation (RACE), which reformulates harmful queries into benign reasoning tasks and gradually exploits the model's inference capabilities to compromise safety alignment, achieving success rates up to 96%." (Section 4.4, p. 7)

> "Kuo et al. (2025) propose Hijacking Chain-of-Thought (H-CoT), which manipulates the reasoning process by injecting execution-phase thoughts that bypass safety checks entirely. Their approach exploits LRMs' tendency to prioritize problem-solving over safety considerations, causing rejection rates to plummet from 98% to below 2% across models like OpenAI o1/o3 and DeepSeek-R1." (Section 4.4, p. 7)

> "Yao et al. (2025) introduce Mousetrap, a framework that leverages chaos mappings to create iterative reasoning chains that gradually lead LRMs into harmful outputs. By embedding one-to-one mappings into the reasoning process, Mousetrap effectively traps models like OpenAI's o1-mini and Claude-sonnet with success rates of up to 98%." (Section 4.4, p. 7)

> "Hashemi et al. (2025) systematically demonstrate this inefficiency through their DNR benchmark, revealing that reasoning models generate up to 70× more tokens than necessary and often perform worse than simpler non-reasoning models on straightforward tasks." (Section 4.1, p. 5)

> "However, safety alignment brings the safety alignment tax (Lin et al., 2023a), compromising the fundamental capabilities of LRMs like reasoning capability (Huang et al., 2025)." (Section 5.1, p. 8)

> "Ying et al. (2025b) demonstrate that DeepSeek models show markedly higher attack success rates in English environments than Chinese contexts, averaging a 21.7% discrepancy." (Section 3.3, p. 3)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 — référence d'état de l'art directe pour C7 et le chapitre raisonnement de la thèse |
| Reproductibilité | N/A — survey (pas d'expériences propres) |
| Code disponible | GitHub : https://github.com/WangCheng0116/Awesome-LRMs-Safety (listing papiers) |
| Dataset public | Non — survey sans dataset original |
| Statut | [PREPRINT] [SURVEY] |
| Cluster AEGIS | C7 — P087/P089/P092/P094/P102/P141/P159/P161 |
| Gaps adressés | RR-RUN4-003 (partiellement) |
