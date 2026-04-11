# P096 : Analyse doctorale

## [Li et al., 2026] — Knowledge-Driven Multi-Turn Jailbreaking on Large Language Models

**Reference** : arXiv:2601.05445v1
**Revue/Conf** : Preprint, janvier 2026. Southeast University, NTU, OPPO Research Institute.
**Lu le** : 2026-04-07
> **PDF Source**: [literature_for_rag/P_LRM_2601.05445.pdf](../../assets/pdfs/P_LRM_2601.05445.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (87 chunks, ~86 126 caracteres)

---

### Abstract original

> Large Language Models (LLMs) face a significant threat from multi-turn jailbreak attacks, where adversaries progressively steer conversations to elicit harmful outputs. However, the practical effectiveness of existing attacks is undermined by several critical limitations: they struggle to maintain a coherent progression over long interactions, often losing track of what has been accomplished and what remains to be done; they rely on rigid or pre-defined patterns, and fail to adapt to the LLM's dynamic and unpredictable conversational state. To address these shortcomings, we introduce Mastermind, a multi-turn jailbreak framework that adopts a dynamic and self-improving approach. Mastermind operates in a closed loop of planning, execution, and reflection, enabling it to autonomously build and refine its knowledge of model vulnerabilities through interaction. It employs a hierarchical planning architecture that decouples high-level attack objectives from low-level tactical execution, ensuring long-term focus and coherence. This planning is guided by a knowledge repository that autonomously discovers and refines effective attack patterns by reflecting on interactive experiences. Mastermind leverages this accumulated knowledge to dynamically recombine and adapt attack vectors, dramatically improving both effectiveness and resilience. We conduct comprehensive experiments against state-of-the-art models, including GPT-5 and Claude 3.7 Sonnet. The results demonstrate that Mastermind significantly outperforms existing baselines, achieving substantially higher attack success rates and harmfulness ratings.
> — Source : PDF page 1

---

### Resume (5 lignes)

- **Probleme :** Les attaques multi-turn existantes souffrent de perte de coherence a long terme, de rigidite des patterns pre-definis, et d'incapacite a s'adapter dynamiquement aux refus du modele cible (Li et al., 2026, Section 1, p. 1-2, challenges C1-C3).
- **Methode :** Mastermind utilise une architecture multi-agent hierarchique : Planner (trajectoire strategique), Executor (interactions tactiques), Controller (monitoring et correction), plus un Distiller qui extrait des patterns abstraits depuis les trajectoires reussies pour alimenter un knowledge repository. Moteur de fuzzing genetique au niveau des strategies (Li et al., 2026, Section 1, p. 2, C1-C3).
- **Donnees :** HarmBench et StrongREJECT, teste sur 15 modeles cibles : Llama 3.1 8B/3.3 70B, Qwen 2.5 7B/14B/72B, DeepSeek V3/R1, GPT-4o/4.1/5, o3 Mini/o4 Mini, Gemini 2.5 Flash/Pro, Claude 3.7 Sonnet (Li et al., 2026, Table 1, p. 10).
- **Resultat :** ASR moyen de 87% sur HarmBench (15 modeles) et 91% sur StrongREJECT (5 modeles). Sur les modeles les plus robustes : 60% sur GPT-5, 67% sur Claude 3.7 Sonnet, 78% sur o4 Mini, 89% sur DeepSeek R1. HR moyen de 3.84/5 sur HarmBench. Surpasse massivement Crescendo (37%), ActorAttack (31%), X-Teaming (70%), Siren (55%) (Li et al., 2026, Table 1, p. 10).
- **Limite :** Le framework necessite un "sandbox model" pour la phase d'accumulation de connaissances, et le cout computationnel du pipeline complet (Planner + Executor + Controller + Distiller) n'est pas quantifie. La resilience contre les defenses avancees n'est evaluee que partiellement (Li et al., 2026, Section 5).

---

### Analyse critique

**Forces :**

1. **Architecture la plus sophistiquee de la litterature multi-turn** : Mastermind resout les trois problemes fondamentaux du multi-turn — coherence long terme (Planner hierarchique), adaptabilite (Controller temps-reel), decouverte autonome de patterns (Distiller + knowledge repository). C'est une avancee majeure par rapport a Crescendo, GOAT et Tempest (P095).

2. **Knowledge repository auto-evolutif** : le Distiller extrait les patterns adversariaux abstraits des trajectoires reussies et les decouple du contenu specifique. Cela permet au systeme de s'ameliorer de maniere autonome sans intervention humaine. Ce concept est directement analogue au moteur genetique AEGIS.

3. **Couverture experimentale exceptionnelle** : 15 modeles cibles, incluant les derniers modeles frontier (GPT-5, o4 Mini, Claude 3.7 Sonnet, Gemini 2.5 Pro). C'est la couverture la plus large de tous les papiers du lot.

4. **Test sur modeles de raisonnement** : DeepSeek R1 (89%), o3 Mini (90%), o4 Mini (78%) sont testes. Les LRM ne montrent pas de resistance significativement superieure aux modeles non-raisonnants — resultat important pour C7.

5. **Ablation study solide** : l'ablation sur GPT-5 montre l'apport de chaque composant : baseline Executor seul = 30%, +Planner = 46%, +Controller = 56%, +Knowledge = 60% (Table 3). Chaque composant apporte un gain significatif et mesurable.

6. **Fuzzing genetique au niveau des strategies** : l'optimisation se fait dans l'espace des strategies abstraites plutot que dans l'espace des tokens ou des phrases, ce qui est plus efficient et transferable.

**Faiblesses :**

1. **Complexite du framework** : 4 agents (Planner, Executor, Controller, Distiller) + knowledge repository + fuzzing engine = systeme tres complexe. La reproductibilite est questionnable sans le code source.

2. **Sandbox model non specifie** : la phase d'accumulation de connaissances utilise un "sandbox model" dont les details ne sont pas entierement specifies. Le transfert des patterns du sandbox au modele cible n'est pas garanti.

3. **Cout non rapporte** : le nombre total de queries, le temps de calcul et le cout API ne sont pas mentionnes. Pour un pipeline a 4 agents, le cout pourrait etre prohibitif.

4. **GPT-5 et Claude 3.7 plus resistants** : 60% et 67% ASR respectivement, montrant que les defenses les plus avancees resistent partiellement. Mais la tendance est claire : aucun modele n'est immune.

5. **Pas d'evaluation par des juges humains** : l'ASR et le HR sont evalues par LLM-juge. La possibilite de faux positifs n'est pas controlee par verification humaine.

---

### Formules exactes

Aucune formule mathematique originale formelle. Le framework est decrit en termes d'architecture et d'algorithmes :
- Planner -> strategic trajectory
- Executor -> tactical interactions
- Controller -> state monitoring + replanning
- Distiller -> strategy abstraction
- Fuzzing engine -> combinatorial optimization in strategy space (genetic-based)

Lien glossaire AEGIS : F22 (ASR), et le fuzzing genetique est directement lie au moteur genetique AEGIS (croisement + mutation + fitness SVC).

---

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF) : directement attaque via l'erosion multi-turn
  - δ¹ (system prompt) : attaque via le Planner qui maintient la coherence strategique malgre les garde-fous
  - δ² (sanitization) : partiellement teste — le Controller s'adapte aux refus
  - δ³ (tool control) : non adresse directement mais le framework est extensible aux agents

- **Conjectures :**
  - **C7 (paradoxe raisonnement/securite) : SUPPORTEE.** Les LRM (DeepSeek R1 : 89%, o3 Mini : 90%) ne sont pas significativement plus resistants que les LLM non-raisonnants (DeepSeek V3 : 94%, GPT-4o : 93%). Le raisonnement n'apporte pas de gain defensif mesurable dans le contexte multi-turn. Exception : o4 Mini (78%) et Claude 3.7 (67%) montrent une certaine resistance, mais qui pourrait etre due a l'alignement plutot qu'au raisonnement.

- **Decouvertes :**
  - D-020 (compliance partielle comme vecteur) : confirmee et automatisee
  - D-021 (knowledge repository adversarial) : NOUVELLE DECOUVERTE — l'accumulation autonome de connaissances adversariales est un paradigme nouveau

- **Gaps :**
  - G-020 (defense contre frameworks multi-agent adversariaux) : cree — comment defendre contre un systeme qui s'auto-ameliore ?
  - G-021 (integration knowledge repository dans AEGIS) : opportunite — le concept de Distiller est directement transposable dans notre moteur genetique

- **Mapping templates AEGIS :** Mastermind est un meta-framework qui combine automatiquement des strategies. Les strategies decouvertes correspondent a nos templates de role-play (#52-#58), d'escalade (#55 complex task overload), de cadrage (#53 alternate reality, #72 test mode), et de manipulation (#64 leading response, #67 reasoning conflict induction). Le fuzzing genetique est l'equivalent externe de notre propre moteur.

---

### Citations cles

> "Mastermind significantly outperforms existing baselines, achieving substantially higher attack success rates and harmfulness ratings" (Abstract, p. 1)

> "Mastermind operates in a closed loop of planning, execution, and reflection, enabling it to autonomously build and refine its knowledge of model vulnerabilities through interaction" (Abstract, p. 1)

> "the baseline struggles to breach the advanced safety alignment of GPT-5, achieving only a 30% ASR. The introduction of the planner yields a significant performance boost, raising the ASR to 46%" (Section 5.3, Table 3, p. 10)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Moyenne — architecture complexe, code non mentionne explicitement |
| Code disponible | Non mentionne |
| Dataset public | Oui (HarmBench, StrongREJECT) |
| Nature epistemique | [ALGORITHME] — framework multi-agent avec auto-amelioration |
| Type d'attaque | Multi-Turn Jailbreaking / Knowledge-Driven / Genetic Fuzzing |
| MITRE ATLAS | AML.T0051.005 (Prompt Injection — Multi-Turn Escalation) |
| OWASP LLM | LLM01 (Prompt Injection) |
