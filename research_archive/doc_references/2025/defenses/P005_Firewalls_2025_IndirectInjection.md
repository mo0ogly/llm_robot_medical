## [Bhagwatkar et al., 2026] — Indirect Prompt Injections: Are Firewalls All You Need, or Stronger Benchmarks?

**Reference** : arXiv:2510.05244v2
**Revue/Conf** : arXiv preprint (ServiceNow + Mila + Vector Institute), 23 Mar 2026
**Lu le** : 2026-04-04
> **PDF Source**: [literature_for_rag/P005_source.pdf](../../literature_for_rag/P005_source.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (73 chunks)

**Nature epistemique** : [EMPIRIQUE] + [ALGORITHME] — defense proposee (Minimizer + Sanitizer) avec evaluation extensive sur 4 benchmarks

### Abstract original
> "AI agents are vulnerable to indirect prompt injection attacks, where malicious instructions embedded in external content or tool outputs cause unintended or harmful behavior. Inspired by the well-established concept of firewalls, we show that a simple, modular, and model-agnostic defense operating at the agent–tool interface achieves perfect security with high utility across all four public benchmarks: AgentDojo, Agent Security Bench, InjecAgent and τ-Bench, while achieving a state-of-the-art security-utility tradeoff compared to prior results. Specifically, we employ two firewalls: a Tool-Input Firewall (Minimizer) and a Tool-Output Firewall (Sanitizer). Unlike prior complex approaches, this defense makes minimal assumptions about the agent and can be deployed out of the box. [...] Moreover, we introduce a three-stage attack strategy that cascades standard prompt injection attacks, second-order attacks, and adaptive attacks to evaluate the robustness beyond existing attacks. Overall, our work shows that existing agentic security benchmarks are easily saturated by a simple approach and highlights the need for stronger benchmarks with carefully chosen evaluation metrics and strong adaptive attacks."
> — Source : PDF page 1, Abstract (tronque pour conformite copyright)

### Resume (5 lignes)
- **Probleme** : Les defenses IPI existantes sont complexes et les benchmarks actuels sur-estiment leur difficulte (Section 1)
- **Methode** : Deux firewalls LLM a l'interface agent-outil : Minimizer (filtre inputs) + Sanitizer (filtre outputs), sans retraining (Section 3, Algorithm 1)
- **Donnees** : 4 benchmarks publics — AgentDojo (949 evals), Agent Security Bench (400 evals), InjecAgent, τ-bench — avec GPT-4o, Llama 3.3-70B, Qwen3-8B/32B (Section 4.1)
- **Resultat** : Sanitizer seul atteint ASR 0% sur AgentDojo (BU 74.09%) vs CaMeL ASR 0% (BU 53.60%) — meilleur tradeoff securite/utilite (Section 5, Table 1). Recall 99.53%, precision 100% (Section 6, Table 26)
- **Limite** : Les benchmarks existants sont satures par cette defense simple, ce qui revele leur faiblesse plutot que la force de la defense (Section 7)

### Analyse critique
**Forces** :
- Simplicite et modularite : une seule instruction de sanitization, sans retraining, compatible tout modele — contraste avec la complexite de CaMeL qui necessite un interpreteur Python custom (Section 2)
- Evaluation extensive sur 4 benchmarks avec multiple backbones (GPT-4o, Llama, Qwen) — generalisation demontree (Section 6, Tables 10-20 en appendice)
- Identification critique des failles des benchmarks existants : (1) injections qui ecrasent des donnees critiques pour la tache, (2) metriques d'utilite trop rigides, (3) attaques benin comptees comme succes (Section 7.1-7.2)
- Analyse d'incertitude : entropie 0.318+-0.001 (clean) vs 0.321+-0.001 (injecte), perplexite stable — les injections ne causent pas de shift de confiance detectable (Section 6)
- Analyse de latence : 2.5x plus rapide que CaMeL (3,348s vs 8,417s sur AgentDojo banking+Slack, Table 24)
- Analyse de tokens : 6.6x moins d'input tokens que CaMeL (Section 6, Table 25)

**Faiblesses** :
- L'ASR 0% sur AgentDojo avec le Sanitizer seul est un signal que le benchmark est trop facile, pas que la defense est parfaite — les auteurs le reconnaissent eux-memes (Section 7)
- La cascade d'attaques en 3 etapes proposee (standard → second-order → adaptive) n'est pas evaluee quantitativement dans les resultats principaux
- Le Sanitizer depend d'un LLM auxiliaire — susceptible aux memes vulnerabilites que le LLM principal (recursivite du probleme)
- Sur Agent Security Bench, le Sanitizer a un ASR residuel de 16.33% (Table 2) — pas 0%, car certaines attaques sont structurellement benin
- Pas de test contre des attaques sophistiquees : encodages (P009), multi-turn persistants, ou attaques ciblant le Sanitizer lui-meme

**Questions ouvertes** :
- Le Sanitizer est-il robuste face a des injections qui imitent le format de sortie legitime de l'outil ?
- Comment se comporte le Sanitizer face aux 12 techniques d'injection de caracteres de P009 ?
- La cascade d'attaques adaptatives peut-elle casser le Sanitizer ?

### Formules exactes
- Algorithm 1 : Pipeline Minimizer + Sanitizer formalise (Section 3) — pas de formule au sens mathematique mais un algorithme formel
- Metriques definies : BU (Benign Utility), UA (Utility under Attack), ASR (Attack Success Rate) (Section 4.2)
- Entropie output : 0.318 +- 0.001 (clean) vs 0.321 +- 0.001 (injecte) (Section 6)
- FNR : 0.47%, Precision : 100%, Recall : 99.53% (Table 26)

### Pertinence these AEGIS
- **Couches delta** : δ² (filtrage) — le Minimizer et le Sanitizer sont des composants δ² operant a l'interface agent-outil. Pas de δ⁰ (pas de retraining), pas de δ³ (pas de verification formelle)
- **Conjectures** :
  - C1 (insuffisance δ¹) : **Fortement supportee** — le pipeline necessite des firewalls externes car le system prompt seul ne suffit pas
  - C2 (necessite δ³) : **Partiellement supportee** — la saturation des benchmarks par une defense simple suggere que les evaluations actuelles ne testent pas la robustesse reelle
- **Decouvertes** : D-014 (saturation des benchmarks agentiques) — decouverte critique confirmant que les evaluations actuelles surestiment la difficulte du probleme
- **Gaps** : G-005 (benchmarks trop faibles), G-009 (attaques adaptatives non testees), G-018 (recursivite du probleme — le LLM sanitizer peut etre attaque)
- **Mapping templates AEGIS** : Le Sanitizer correspond au composant RagSanitizer d'AEGIS ; le Minimizer au principe de moindre privilege dans les chains d'attaque

### Citations cles
> "This simple 'minimize & sanitize' defense that requires no LLM retraining or proprietary guardrails can achieve ~0% attack success with minimal utility degradation across four widely used benchmarks." (Section 1, p. 2)
> "Existing agentic security benchmarks are easily saturated by a simple approach and highlights the need for stronger benchmarks." (Abstract)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — 4 benchmarks publics, prompts fournis en appendice, multiple backbones |
| Code disponible | Oui (https://firewall-defenses.github.io) |
| Dataset public | Oui (AgentDojo, ASB, InjecAgent, τ-bench — tous publics) |
