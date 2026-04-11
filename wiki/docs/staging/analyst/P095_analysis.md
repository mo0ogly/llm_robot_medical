# P095 : Analyse doctorale

## [Zhou & Arel, 2025] — Tempest: Automatic Multi-Turn Jailbreaking of Large Language Models with Tree Search

**Reference** : arXiv:2503.10619v5
**Revue/Conf** : Preprint, mai 2025. Intology AI.
**Lu le** : 2026-04-07
> **PDF Source**: [literature_for_rag/P_LRM_2503.10619.pdf](../../assets/pdfs/P_LRM_2503.10619.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (68 chunks, ~67 353 caracteres)

---

### Abstract original

> We introduce Tempest, a multi-turn adversarial framework that models the gradual erosion of Large Language Model (LLM) safety through a tree search perspective. Unlike single-turn jailbreaks that rely on one meticulously engineered prompt, Tempest expands the conversation at each turn, branching out multiple adversarial prompts that exploit partial compliance from previous responses. Through a cross-branch learning mechanism, successful attack patterns and partial compliance signals are systematically shared across parallel conversation paths, enabling more efficient discovery of model vulnerabilities. By tracking these incremental policy leaks and re-injecting them into subsequent queries, Tempest reveals how minor concessions can accumulate into fully disallowed outputs. Evaluations on the JailbreakBench dataset show that Tempest achieves a 100% success rate on GPT-3.5-turbo and 97% on GPT-4 in a single multi-turn run, significantly outperforming both single-turn methods and multi-turn baselines such as Crescendo or GOAT while using fewer queries.
> — Source : PDF page 1

---

### Resume (5 lignes)

- **Probleme :** Les methodes single-turn ne capturent pas la degradation progressive de la securite au fil des tours de conversation, et les methodes multi-turn existantes (Crescendo, GOAT) suivent un seul chemin conversationnel sans exploration systematique (Zhou & Arel, 2025, Section 1, p. 1).
- **Methode :** Tempest utilise un beam search en breadth-first : a chaque tour, la conversation branche en multiples chemins adversariaux qui exploitent les signaux de compliance partielle. Un mecanisme d'apprentissage cross-branch partage les patterns reussis entre les branches (Zhou & Arel, 2025, Section 3, p. 3-4).
- **Donnees :** JailbreakBench dataset, teste sur GPT-3.5-turbo, GPT-4, Llama-3.1-70B. Maximum 5 tours de conversation. Meme modele attaquant pour toutes les methodes (Zhou & Arel, 2025, Section 5, Table 1).
- **Resultat :** 100% ASR sur GPT-3.5-turbo et 97% sur GPT-4 en un seul run, avec 44.0-51.8 queries par attaque reussie. Crescendo : 28-40% (1 run), 70.9-80.4% (10 runs, 60 queries). GOAT : 46.6-55.7% (1 run), 87.9-91.6% (10 runs) (Zhou & Arel, 2025, Table 1, p. 7).
- **Limite :** Teste uniquement sur des modeles de generation anterieure (GPT-3.5, GPT-4) et non sur les LRM recents (o1, o3, DeepSeek-R1). L'article mentionne que la contribution intellectuelle principale a ete conduite par un systeme IA (footnote p. 1), ce qui souleve des questions de reproductibilite methodologique (Zhou & Arel, 2025, Section 1, footnote 1).

---

### Analyse critique

**Forces :**

1. **Formalisation de la compliance partielle** : le concept de "partial compliance" — ou le modele refuse formellement mais laisse filtrer des fragments d'information — est une contribution conceptuelle importante. Tempest exploite systematiquement ces fuites incrementales pour accumuler suffisamment de contenu nocif (Section 3).

2. **Tree search bien adapte** : la modelisation du jailbreaking multi-turn comme un probleme de recherche arborescente est elegante. Le beam search explore plusieurs chemins en parallele, et le cross-branch learning permet de transferer les decouvertes d'une branche a l'autre, evitant la repetition d'exploration.

3. **Efficacite en queries** : Tempest utilise moins de queries que les baselines pour atteindre un taux de succes superieur. 44-51 queries contre 60 pour Crescendo/GOAT a 10 runs, avec un taux de succes nettement superieur.

4. **Comparaison avec single-turn** : la Table 2 montre que meme les meilleures methodes single-turn (Persuasive Adversarial Prompts : 94% sur GPT-3.5) sont depassees par Tempest (100%), et l'avantage est encore plus marque sur GPT-4 (Tempest 97% vs TAP 76%).

**Faiblesses :**

1. **Modeles testes obsoletes** : GPT-3.5-turbo et GPT-4 sont des modeles de 2023-2024. En 2025-2026, les modeles frontier (o3, o4, Claude 4, Gemini 2.5) ont des mecanismes de securite significativement ameliores. Les resultats pourraient ne pas transferer.

2. **Pas de test sur LRM** : l'article ne teste pas sur des modeles de raisonnement (o1, DeepSeek-R1). Or, les LRM pourraient etre plus resistants au multi-turn grace a leur capacite de raisonnement etendue, ou plus vulnerables (cf. P094 CoT Hijacking).

3. **Contribution intellectuelle par IA** : la footnote 1 mentionne que "the main intellectual contribution was conducted by an AI system". Cela souleve des questions sur la reproductibilite et la validite methodologique — les decisions de design ont-elles ete verifiees par des humains ?

4. **Pas d'analyse mecanistique** : l'etude est purement comportementale. On ne sait pas pourquoi le tree search est plus efficace — est-ce la diversite d'exploration, le cross-branch learning, ou simplement le nombre total de queries ?

5. **Llama-3.1-70B plus faible** : 92% ASR sur Llama-3.1-70B, ce qui est inferieur a GPT-3.5 (100%). Cela est surprenant et pourrait suggerer que le beam search est mieux calibre pour les modeles OpenAI.

---

### Formules exactes

Aucune formule originale. Les metriques sont :
- ASR = proportion de conversations atteignant une violation reussie
- Query Efficiency = nombre de queries par attaque reussie

Le tree search utilise un beam width implicite et un critere de branchement/elagage base sur la compliance partielle, mais ces parametres ne sont pas formalises mathematiquement.

Lien glossaire AEGIS : F22 (ASR)

---

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF) : directement attaque via l'erosion progressive
  - δ¹ (system prompt) : implicitement teste — la compliance partielle erode les instructions systeme
  - δ² (sanitization) : non adresse
  - δ³ (tool control) : non adresse

- **Conjectures :**
  - **C7 (paradoxe raisonnement/securite) : NON DIRECTEMENT TESTEE.** L'article ne compare pas reasoning/non-reasoning. Cependant, le concept de compliance partielle est pertinent pour C7 : si les LRM sont plus susceptibles de fournir des reponses partiellement compliantes (grace a leur raisonnement plus nuance), alors le tree search serait encore plus efficace contre eux.

- **Decouvertes :**
  - D-020 (compliance partielle comme vecteur) : confirmee et formalisee — les concessions mineures s'accumulent en violations completes

- **Gaps :**
  - G-019 (Tempest sur LRM) : cree — le tree search multi-turn fonctionne-t-il sur o1, o3, DeepSeek-R1 ?

- **Mapping templates AEGIS :** Le concept multi-turn correspond directement a nos templates #07 (multi-turn APT), et le tree search est analogue au moteur genetique AEGIS avec exploration de l'espace des prompts. L'idee de compliance partielle est liee aux templates d'escalade graduelle (#52 unwitting user delivery, #55 complex task overload).

---

### Citations cles

> "Tempest achieves a 100% success rate on GPT-3.5-turbo and 97% on GPT-4 in a single multi-turn run, significantly outperforming both single-turn methods and multi-turn baselines" (Abstract, p. 1)

> "minor concessions can accumulate into fully disallowed outputs" (Abstract, p. 1)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 |
| Reproductibilite | Moyenne — JailbreakBench public, mais contribution principale par IA, code non mentionne explicitement |
| Code disponible | Non clairement mentionne |
| Dataset public | Oui (JailbreakBench) |
| Nature epistemique | [ALGORITHME] — framework de recherche arborescente sans garanties de convergence |
| Type d'attaque | Multi-Turn Jailbreaking / Tree Search |
| MITRE ATLAS | AML.T0051.005 (Prompt Injection — Multi-Turn Escalation) |
| OWASP LLM | LLM01 (Prompt Injection) |
