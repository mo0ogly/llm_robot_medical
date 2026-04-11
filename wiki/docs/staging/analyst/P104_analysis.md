# P104 — Analyse doctorale

## [Ying, Zhang, Jing, Zhang, Zou, Xiao, Liang, Liu, Liu & Tao, 2025] — Reasoning-Augmented Conversation for Multi-Turn Jailbreak Attacks on Large Language Models

**Reference :** EMNLP 2025 Findings, pages 17138-17157
**Revue/Conf :** EMNLP 2025 Findings (peer-reviewed)
**Lu le :** 2026-04-07
> **PDF Source**: [literature_for_rag/P_LRM_emnlp2025_findings929.pdf](../../assets/pdfs/P_LRM_emnlp2025_findings929.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (74 chunks)

### Abstract original
> Multi-turn jailbreak attacks exploit the interactive nature of LLMs, but existing methods often struggle to balance semantic coherence with attack effectiveness, resulting in either benign semantic drift or ineffective detection evasion. The authors propose Reasoning-Augmented Conversation (RACE), a novel multi-turn jailbreak framework that reformulates harmful queries into benign reasoning tasks and leverages LLMs' strong reasoning capabilities to elicit unsafe content through structured, reasoning-driven attack progression. Extensive experiments demonstrate that RACE achieves state-of-the-art attack effectiveness in complex conversational scenarios, with ASRs increasing by up to 96%. Notably, RACE achieves average ASR of 83.3% against leading commercial models, including Gemini 2.0 Flashing Thinking and OpenAI o1.
> — Source : PDF page 1 (paraphrase)

### Resume (5 lignes)
- **Probleme :** Les methodes multi-tour existantes souffrent soit de derive semantique (perte de l'objectif d'attaque) soit d'incapacite a contourner les filtres d'alignement. Le raisonnement des LLMs peut etre retourne contre eux pour structurer l'attaque (Ying et al., 2025, Section 1, p. 1).
- **Methode :** RACE reformule la requete nuisible en tache de raisonnement benigne, modelisee comme un Attack State Machine (ASM = automate a etats finis). Trois modules : Gain-Guided Exploration (selection de requetes par gain d'information), Self-Play (simulation interne pour pre-optimiser les requetes), Rejection Feedback (recuperation apres echec) (Section 4, p. 3-6).
- **Donnees :** AdvBench subset (50 instances) + HarmBench (200 instances), 10 modeles : Gemma-2-9B, Qwen2-7B, GLM-4-9B, Llama-3-8B, GPT-4, GPT-4o, Gemini 1.5 Pro, Gemini 2.0 Flash Thinking, o1, DeepSeek-R1 (Section 5.1, p. 6-7).
- **Resultat :** ASR moyen de 83.3% sur les modeles commerciaux de raisonnement (o1, DeepSeek-R1, Gemini 2.0 Flash Thinking). RACE surpasse PAIR (+68%), CoA (+34%), CIA (+26%), ActorAttack (+2%) sur AdvBench (Table 1, p. 7). Sur o1 specifiquement : 92% ASR (Figure 3c, p. 7).
- **Limite :** Shadow model = meme modele que victim model (self-attack), ce qui ne teste pas le scenario attaquant externe ; evaluation avec GPT-4o juge sans validation humaine systematique ; pas de defense proposee (Section 5, Limitations implicites).

### Analyse critique

**Forces :**
1. **Formalisation FSM (ASM)** du processus d'attaque : la modelisation comme automate a etats finis avec transitions determinees par les reponses du modele est une abstraction puissante qui distingue clairement les etats (initial, intermediaires, succes, echec) et les transitions (Section 4.2, Eq. FSM, p. 4-5). C'est la premiere formalisation rigoureuse d'une attaque multi-tour comme processus de decision structurk.
2. **Gain d'information** pour la selection de requetes (Section 4.3.1, Eq. 1-3, p. 5) : l'utilisation de l'information gain (IG) de la theorie de l'information pour selectionner les requetes qui maximisent l'avancement vers le jailbreak est theoriquement fondee. L'approximation par scoring LLM (Eq. 4-5) est pragmatique.
3. **Exploitation du raisonnement** comme vecteur d'attaque : RACE ne contourne pas le raisonnement — il le retourne contre le modele en reformulant les requetes nuisibles comme des problemes de raisonnement (regles logiques, deductions, substitutions de variables). Le modele se jailbreake lui-meme en resolvant le probleme pose (Figure 1, p. 1-2).
4. **Validation sur LRM de production** : 92% ASR sur o1, 90% sur DeepSeek-R1 (Figure 3, p. 7), demontrant que l'alignement deliberatif est insuffisant contre les attaques qui exploitent le raisonnement.
5. **Escalade de nocivite** mesuree par HRI (Harmful Response Index) : les reponses deviennent progressivement plus nuisibles au fil des tours (Figure 4b, p. 8), confirmant le phenomene MSBE dans le contexte du raisonnement augmente.

**Faiblesses :**
1. **Self-attack** : le modele ombre (shadow) est le meme que le modele victime, ce qui est un scenario d'attaque tres favorable. En pratique, un attaquant n'a pas acces au meme modele pour le self-play. La generalisation a des scenarios cross-modele n'est pas testee.
2. **Defenses inefficaces** mais mal testees : ICD (In-Context Defense), SmoothLLM, JailGuard sont testees (Section 5.3, p. 8) mais ces defenses sont concues pour le single-turn, pas pour le multi-tour. L'absence de defense multi-tour dans la litterature est un probleme du domaine, pas specifique a RACE.
3. **Approximation du gain d'information** (Section 4.3.1, p. 5) : l'IG reel est computationnellement intractable, l'approximation par scoring LLM (scale 0-9) est une heuristique non validee theoriquement.
4. **4 types de raisonnement** testes (CoR, CaR, MaR, SyR — Figure 5, p. 8) mais sans analyse fine de pourquoi certains types sont plus efficaces que d'autres sur certains modeles.
5. **Pas d'analyse mecaniste** : le papier ne regarde pas les representations internes ou les chaines de pensee des LRM pour comprendre comment le raisonnement mene au jailbreak.

**Questions ouvertes :**
- Le self-play de RACE peut-il etre etendu a un scenario cross-modele (attaquant GPT-4 vs victime o1) ?
- Comment l'escalade de HRI au fil des tours se compare-t-elle au drift de la direction de refus observe par P097/STAR ?
- Une defense basee sur la detection de patterns de raisonnement adversarial est-elle faisable ?

### Formules exactes

**FSM (Attack State Machine) :**
FSM = (S, Sigma, delta, s0, F)
S = ensemble fini d'etats, Sigma = ensemble de requetes, delta: S x Sigma -> S
(Section 4.2, p. 4)

**Eq. 1 — Information Gain :**
IG(Ci-1, qs) = H(rtgt|Ci-1) - H(rtgt|Ci-1, qs)
(Section 4.3.1, p. 5)

**Eq. 4 — Fonction d'utilite Self-Play :**
u_Ms(s, qc, rc) = 1 si rc not in R_rej, 0 sinon
(Section 4.3.2, p. 5)

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) — non utilise)

### Pertinence these AEGIS

- **Couches delta :** δ² (reformulation en taches de raisonnement — manipulation cognitive avancee), δ³ (exploitation du processus de raisonnement lui-meme, specifique aux LRM)
- **Conjectures :** C1 (fragilite de l'alignement) **fortement supportee** — 83.3% ASR moyen sur les LRM commerciaux ; C7 (raisonnement comme vecteur) **directement supportee** — RACE exploite le raisonnement, ne le contourne pas
- **Decouvertes :** D-003 (erosion progressive) **confirmee** — HRI escalade au fil des tours ; D-019 (vulnerabilites LRM) **directement adresse** — o1 et DeepSeek-R1 sont jailbreakes a >90%
- **Gaps :** G-021 (securite des LRM) **adresse** — RACE est un complement a Mousetrap (P103) pour les attaques specifiques LRM. RR-FICHE-001 (MSBE) **adresse** — l'escalade de HRI est un MSBE mesurable dans le contexte du raisonnement augmente.
- **Mapping templates AEGIS :** #22 (SQL research multi-step — analogie avec la decomposition en sous-requetes), #67 (reasoning conflict induction — RACE induit des conflits de raisonnement), #54 (challenge solving prompting — les taches de raisonnement sont des "defis")

### Citations cles
> "The introduction of advanced reasoning capabilities can paradoxically escalate potential safety risks in next-generation models." (Section 5.2, p. 8)
> "RACE achieves average ASR of 83.3% against leading commercial models, including Gemini 2.0 Flashing Thinking and OpenAI o1." (Abstract, p. 1)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Moyenne — code non mentionne, AdvBench/HarmBench publics, mais self-attack simplifie la reproduction |
| Code disponible | Non mentionne |
| Dataset public | AdvBench subset + HarmBench (publics) |
