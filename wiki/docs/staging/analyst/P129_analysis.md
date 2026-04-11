# P129 — Analyse doctorale

## [Wang, Chen, Yuan, Zhang, Li, Peng & Ji, 2024] — Executable Code Actions Elicit Better LLM Agents (CodeAct)

**Reference :** arXiv:2402.01030
**Revue/Conf :** ICML 2024 (accepte) — travail principalement UIUC (Heng Ji lab) avec collaboration Illinois/Stanford
**Lu le :** 2026-04-09
> **PDF Source**: [literature_for_rag/P129_2402.01030.pdf](../../assets/pdfs/P129_2402.01030.pdf)
> **Statut**: [ARTICLE VERIFIE] — abstract, architecture et benchmarks verifies via WebFetch arXiv HTML v4 (2026-04-09, Sections 2.1, 2.2, 2.3, 3.1, 5)

### Abstract original
> Large Language Model (LLM) agents, capable of performing a broad range of actions, such as invoking tools and controlling robots, show great potential in tackling real-world challenges. LLM agents are typically prompted to produce actions by generating JSON or text in a pre-defined format, which is usually limited by constrained action space (e.g., the scope of pre-defined tools) and restricted flexibility (e.g., inability to compose multiple tools). This work proposes to use executable Python code to consolidate LLM agents' actions into a unified action space (CodeAct). Integrated with a Python interpreter, CodeAct can execute code actions and dynamically revise prior actions or emit new actions upon new observations through multi-turn interactions. Our extensive analysis of 17 LLMs on API-Bank and a newly curated benchmark shows that CodeAct outperforms widely used alternatives (up to 20% higher success rate). The encouraging performance of CodeAct motivates us to build an open-source LLM agent that interacts with environments by executing interpretable code and collaborates with users using natural language. To this end, we collect an instruction-tuning dataset CodeActInstruct that consists of 7k multi-turn interactions using CodeAct. We show that it can be used with existing data to improve models in agent-oriented tasks without compromising their general capability. CodeActAgent, finetuned from Llama2 and Mistral, is integrated with Python interpreter and uniquely tailored to perform sophisticated tasks (e.g., model training) using existing libraries and autonomously self-debug.
> — Source : arXiv abs page 2402.01030, paragraphe abstract

### Resume (5 lignes)
- **Probleme :** Les agents LLMs actuels produisent leurs actions via JSON ou texte pre-formate, ce qui cree deux limites majeures : un espace d'action contraint (limite a l'ensemble des outils pre-definis) et une flexibilite reduite (incapacite a composer plusieurs outils dans une meme action, impossibilite d'utiliser le controle de flux natif comme boucles et conditionnelles). Les architectures ReAct-style de 2022-2023 souffrent de ce plafond (Wang et al., 2024, Section 1 + Section 2.1, Table 1).
- **Methode :** CodeAct propose un paradigme unifie ou l'agent emet du **code Python executable** comme action unique. Un interpreteur Python est integre dans la boucle perception-action, permettant : (1) l'utilisation native du controle de flux, (2) la composition multi-outils sans surcout (3) l'auto-debug via les messages d'erreur et exceptions, (4) la reutilisation des variables entre tours, et (5) l'exploitation de la familiarite des LLMs avec le code Python (present massivement dans les corpus de pre-training) (Wang et al., 2024, Section 2.1, Table 1).
- **Donnees :** **17 LLMs** testes — 8 open-source (CodeLlama-7b/13b/34b-Instruct, Llama-2-7b/13b/70b-chat, Mistral-7B-Instruct-v0.1, Lemur-70b-chat-v1) et 9 closed-source (Claude-2, Claude-Instant-1, Gemini-Pro, GPT-3.5-turbo 0613 et 1106, GPT-4 0613 et 1106-preview, text-davinci-002/003) (Wang et al., 2024, Section 2.2, Tables 2-3). Deux benchmarks : **API-Bank** (Level-1 atomic tool-calling) et **M3ToolEval** (82 instances multi-turn multi-tool curees par les auteurs). Dataset d'instruction-tuning : **CodeActInstruct** = 7 139 trajectoires issues de HotpotQA (1 664), MATH (1 732), APPS (647), WikiTableQuestion (1 065), ALFWorld (2 031), pour un total de ~10,6M tokens (Wang et al., 2024, Section 3.1, Table 4).
- **Resultat :** Sur M3ToolEval, CodeAct apporte jusqu'a **+20 points absolus** de taux de succes vs JSON : GPT-4-1106 passe de **52.4% (JSON) a 74.4% (CodeAct)** — l'amelioration la plus spectaculaire. Claude-2 passe de 39.0% a 54.9%, Llama-2-70b de 3.7% a 11.0%, CodeLlama-7b de 2.4% a 4.9% (Wang et al., 2024, Section 2.3, Table 3). Sur API-Bank, Claude-2 et GPT-4-1106 atteignent 76.7%, avec GPT-4-1106 legerement superieur en JSON (82.7%) — indiquant que l'avantage de CodeAct est maximal sur les taches multi-outils composees. CodeActAgent (Llama2/Mistral finetunes) montre une amelioration relative de 119% vs FireAct sur meme backbone (Wang et al., 2024, Section 3.2).
- **Limite :** Les considerations de securite sont traitees de maniere minimale dans la Section 5 (Impact Statement) : les auteurs mentionnent une execution en "sandbox environment" sans detailler le mecanisme de containment, reconnaissent que "in the worst scenario...such an agent may potentially break free of the sandbox restriction and cause harm through cyber-attack", et appellent a "future work to design better safety mechanism to safeguard autonomous agents" (Wang et al., 2024, Section 5). Aucune discussion approfondie de l'injection de prompt, de l'injection de code malveillant, de la verification des codes generes avant execution, ou des mecanismes de timeout.

### Analyse critique

**Forces :**
1. **Contribution paradigmatique** (Section 2.1) : CodeAct reformule l'architecture des agents LLMs en deplacant la frontiere action/expression. Au lieu de traiter le code comme un outil parmi d'autres, il devient **le langage commun de toutes les actions**. C'est une abstraction elegante qui exploite le fait que Python pre-training est massif dans tous les LLMs modernes.
2. **Benchmark exhaustif 17 LLMs** (Tables 2-3) : peu de papiers 2024 couvrent simultanement 17 modeles sur deux benchmarks avec la meme methodologie. La comparabilite cross-modele est tres solide et soutient la conclusion generale que l'avantage CodeAct est universel (12/17 modeles montrent aussi moins de tours en moyenne).
3. **CodeActInstruct dataset** (Section 3.1, Table 4) : 3.8x plus de trajectoires et 5x plus de tokens que AgentInstruct. Le filtrage qualite (retenir uniquement les trajectoires avec self-improvement, donc contenant une erreur suivie d'une correction) est une contribution methodologique notable pour l'entrainement d'agents robustes.
4. **Ouverture open-source** : CodeActAgent est publie (modeles Llama2/Mistral finetunes), avec dataset et code, ce qui contraste favorablement avec des travaux de la meme epoque qui restent proprietaires (ex. AgentTuning par Tsinghua partiellement ferme).
5. **Gains reels et mesures** (Table 3) : le +22 points absolus sur GPT-4-1106 (52.4 -> 74.4) est une amelioration massive, pas marginale. Il justifie l'adoption de CodeAct comme pattern architectural pour les agents orientes tool-use.

**Faiblesses :**
1. **Traitement insuffisant de la securite** (Section 5) : c'est la faiblesse centrale pour AEGIS. Une phrase sur le sandbox, aucune analyse du vecteur d'attaque prompt injection -> code execution, aucune discussion des implications de confier l'execution directe de code Python arbitraire a un agent soumis a un contexte potentiellement adversarial. **CodeAct elargit massivement la surface d'attaque** et le papier ne le reconnait pas explicitement.
2. **M3ToolEval 82 instances seulement** (Section 2.3) : le benchmark nouveau est relativement petit. Pour un papier ICML, N=82 sur le benchmark principal est limite statistiquement. Pas d'intervalles de confiance rapportes dans Table 3.
3. **Pas de test adversarial** : aucun test sur prompt injection, aucun test avec un outil compromise, aucun test avec des donnees RAG empoisonnees. Le papier evalue CodeAct uniquement dans un cadre non-adversarial, ce qui laisse totalement ouverte la question de sa robustesse en production reelle.
4. **Ambivalence API-Bank** (Table 2) : sur API-Bank, GPT-4-1106 fait LEGEREMENT mieux en JSON (82.7%) qu'en CodeAct (76.7%). Ce contre-exemple n'est pas suffisamment analyse — il suggere que CodeAct n'est avantageux que sur taches composees complexes, pas atomiques.
5. **Hallucination residuelle reconnue** (Section 5) : "may suffer from hallucination commonly seen in LLMs (e.g., imagine content of a variable without actually printing it out)" — un risque serieux pour un agent qui execute du code : halluciner une valeur de variable peut conduire a des actions incorrectes mais syntaxiquement valides, plus difficiles a detecter que des hallucinations textuelles.

**Questions ouvertes :**
- Quelle est la robustesse de CodeAct face a une injection de prompt qui modifie intentionnellement le code Python genere ? Par exemple, un RAG empoisonne qui force l'agent a inclure `import os; os.system(...)` dans son code.
- Le sandbox mentionne est-il suffisant contre les attaques de type "sandbox escape via library call" (ex. pickle deserialization, requests exfiltration) ?
- Peut-on definir une metrique de "code action purity" qui separe code valide/benign de code valide/malveillant ?

### Formules exactes

Pas de formules mathematiques originales. Le papier est entierement empirique. L'architecture CodeAct est decrite en pseudo-algorithmic (Section 2.1, Figure 2) mais sans formalisation probabiliste ou theorique.

Lien glossaire AEGIS : F22 (ASR — mesure de succes des taches), F-codeexec (candidate nouvelle formule F73 : "Code Action Execution Risk" = proba d'executer une action dangereuse conditionnellement a un contexte potentiellement empoisonne).

### Pertinence these AEGIS

- **Couches delta :** δ³ (outil / tool-call surface) **principalement** — CodeAct EST la surface δ³ dans sa forme la plus permissive : l'agent n'interagit pas avec un outil via un wrapper controle mais via un interpreteur Python generique. C'est le cas limite maximal de δ³. Intersection avec δ² (sanitization) par absence : l'agent CodeAct tel que decrit dans le papier n'a AUCUNE couche de sanitization du code avant execution.
- **Conjectures :** **C7 (tool-call surface is the weakest layer) fortement renforcee** — CodeAct fournit la demonstration constructive que l'architecture des agents modernes privilegie la flexibilite sur la securite. Les +20 points absolus de gain fonctionnel s'accompagnent d'une amplification implicite du risque d'exploitation. **C2 (insuffisance des filtres regex) renforcee indirectement** : un regex ne peut pas detecter une injection au niveau de la semantique Python (ex. obfuscation par base64.b64decode executee dans le code genere).
- **Decouvertes :** **D-014 (asymetrie flexibilite/securite)** candidat de renforcement : CodeAct illustre exactement comment le gain fonctionnel vient au prix d'une expansion de surface d'attaque non reconnue par les auteurs. Nouvelle **decouverte candidate D-022 : "Code-Action Amplification"** — dans un agent CodeAct, une injection de prompt ne produit plus juste un texte adversarial, mais du **code Python execute** avec les privileges de l'agent. C'est une amplification qualitative du risque.
- **Gaps :** **Cree G-023** candidat (absence de benchmark adversarial pour agents CodeAct/ReAct code-based). **Adresse partiellement G-012** (evaluation systematique 17 LLMs sur tool-use). La these AEGIS peut proposer un benchmark dedie "Code-Action Jailbreak Bench" inspire de CodeAct mais teste sous conditions adversariales.
- **Mapping templates AEGIS :** #67 (tool confusion), #78 (code injection via RAG), candidat #91 (medical-context CodeAct exploitation : forcer l'agent medical a executer du code sur un device robotique via empoisonnement du contexte clinique).

### Citations cles
> "in the worst scenario...such an agent may potentially break free of the sandbox restriction and cause harm through cyber-attack" (Section 5, Impact Statement)
> "need for future work to design better safety mechanism to safeguard autonomous agents" (Section 5, Impact Statement)
> "may suffer from hallucination commonly seen in LLMs" (Section 5, Impact Statement)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 — paradigme architectural central pour la these, cas limite de δ³, tres exploitable pour le chapitre 5 sur les surfaces d'attaque |
| Reproductibilite | Haute — code publie, dataset CodeActInstruct publie, 17 modeles documentes avec versions precises, deux benchmarks accessibles |
| Code disponible | Oui — CodeActAgent et CodeActInstruct sont open-source (repository GitHub reference dans le papier ICML 2024) |
| Dataset public | Oui — CodeActInstruct (7 139 trajectoires), API-Bank (public), M3ToolEval (curee par les auteurs, publie avec le papier) |
