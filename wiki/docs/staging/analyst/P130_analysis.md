# P130 — Analyse doctorale

## [Lu, Holleis, Zhang, Aumayer, Nan, Bai, Ma, Ma, Li, Yin, Wang & Pang, 2024] — ToolSandbox: A Stateful, Conversational, Interactive Evaluation Benchmark for LLM Tool Use Capabilities

**Reference :** arXiv:2408.04682
**Revue/Conf :** Findings of NAACL 2025 — travail Apple Research (Machine Learning & AI team)
**Lu le :** 2026-04-09
> **PDF Source**: [literature_for_rag/P130_2408.04682.pdf](../../assets/pdfs/P130_2408.04682.pdf)
> **Statut**: [ARTICLE VERIFIE] — abstract, benchmark, scores modeles et Sections 2.2, 3, 4, 7 verifies via WebFetch arXiv HTML v1 (2026-04-09)

### Abstract original
> Recent large language models (LLMs) advancements sparked a growing research interest in tool assisted LLMs solving real-world challenges, which calls for comprehensive evaluation of tool-use capabilities. While previous works focused on either evaluating over stateless web services (RESTful API), based on a single turn user prompt, or an off-policy dialog trajectory, ToolSandbox includes stateful tool execution, implicit state dependencies between tools, a built-in user simulator supporting on-policy conversational evaluation and a dynamic evaluation strategy for intermediate and final milestones over an arbitrary trajectory. We show that open source and proprietary models have a significant performance gap, and complex tasks like State Dependency, Canonicalization and Insufficient Information defined in ToolSandbox are challenging even the most capable SOTA LLMs, providing brand-new insights into tool-use LLM capabilities.
> — Source : arXiv abs page 2408.04682, paragraphe abstract

### Resume (5 lignes)
- **Probleme :** Les benchmarks de tool-use pre-existants (BFCL, ToolBench/ToolEval, API-Bank) souffrent de trois limites cumulatives qui masquent les difficultes reelles des agents deployes : (1) ils evaluent sur des APIs RESTful stateless ignorant les effets de bord persistants, (2) ils sont soit single-turn soit off-policy (trajectoires de dialogue pre-enregistrees), et (3) ils n'injectent pas les dependances implicites entre outils (ex. activer le reseau cellulaire avant d'envoyer un SMS). Ces limitations produisent des scores artificiellement eleves qui ne predisent pas la performance reelle (Lu et al., 2024, Section 1 + Section 3, Table 1 comparative).
- **Methode :** **ToolSandbox** est un benchmark stateful, conversationnel et interactif qui combine quatre innovations : (1) execution d'outils avec etat persistant entre tours, (2) dependances d'etat implicites que l'agent doit decouvrir par essai-erreur, (3) un **user simulator** base sur GPT-4o qui joue un utilisateur on-policy (repond aux sollicitations de l'agent en temps reel, pas de trajectoire pre-enregistree), et (4) une evaluation a **milestones** dynamiques : l'agent est evalue a la fois sur des points intermediaires et sur l'etat final, sur une trajectoire arbitraire (Lu et al., 2024, Section 2.2, Section 3).
- **Donnees :** **1 032 test cases** couvrant **34 outils** dans **11 domaines** : Contact, Messaging, Reminder, System settings, Time utilities, Math utilities, Map, Weather, Stock, Conversion, Holiday (Lu et al., 2024, Appendix B.3, Section 3, Table 3). Longueur moyenne : **13.9 tours par scenario** (vs BFCL 2.0, ToolEval 7.53, API-Bank 3.88) et **3.80 appels d'outil** en moyenne (vs BFCL 0.78, ToolEval 1.46, API-Bank 2.04) — ToolSandbox est significativement plus exigeant en profondeur dialogique.
- **Resultat :** Ecart massif proprietary vs open-source (Lu et al., 2024, Section 4, Table 4) : **GPT-4o-2024-05-13 atteint 73.0** score moyen, **Claude-3-Opus 69.2**, tandis que le meilleur modele open-source **Hermes-2-Pro-Mistral-7B atteint seulement 31.4**, soit **plus de 20 points de retard derriere l'avant-dernier modele proprietaire**. Les trois categories "State Dependency", "Canonicalization", et "Insufficient Information" challengent meme les SOTA : GPT-4o y perd significativement en performance comparee aux scenarios de base. Sur "Insufficient Information" (ou le juste comportement est de refuser), les modeles tendent a halluciner des appels d'outil plutot que de reconnaitre qu'ils n'ont pas les capacites necessaires.
- **Limite :** Limitations explicites en Section 7 : (1) la creation de milestones/minefields necessite "deep knowledge" et "many iterations", empechant le scaling du benchmark, (2) le user simulator montre une "non-negligible hallucination and instruction following errors" meme avec les mitigations (Table 2), (3) **absence de scenarios adversariaux** — pas d'authentication/confirmation obligatoire, pas de daemons, pas de tool-calls necessitant verification humaine, (4) dependance a des web services externes qui affecte la reproductibilite, (5) le user simulator n'a actuellement qu'un seul outil disponible (`end_conversation`).

### Analyse critique

**Forces :**
1. **Contribution methodologique fondatrice** (Section 2.2) : ToolSandbox est le premier benchmark a combiner simultanement stateful + conversational + interactive pour evaluer les agents LLM. Le tableau comparatif (Table 1) montre clairement qu'aucun predecesseur ne couvre les trois dimensions. C'est une contribution structurelle durable.
2. **Categorisation des difficultes** (Section 3) : "State Dependency", "Canonicalization", "Insufficient Information" sont trois categories conceptuellement distinctes et experimentalement verifiees comme challengers. En particulier, "Insufficient Information" (tester si l'agent refuse intelligemment quand il lui manque un outil) est une idee methodologiquement originale qui mesure le **faux-negatif** d'appels d'outil — un sous-probleme critique rarement aborde.
3. **Scale du benchmark** (Table 3) : 1 032 test cases, 34 outils, 11 domaines — suffisant pour des intervalles de confiance serres sur les scores. La longueur moyenne de 13.9 tours est 7x celle de BFCL, ce qui capture un regime radicalement different.
4. **User simulator on-policy** (Section 2.2, Appendix A.4) : l'architecture 3-composantes (User Goal, Knowledge Boundary, Demonstration) avec mesure explicite des erreurs du simulateur (Table 2) est une contribution methodologique reutilisable. Le Knowledge Boundary est une astuce elegante pour empecher l'halucination du simulateur ("ne sais pas ce que je n'ai pas a savoir").
5. **Venue credible** : Findings of NAACL 2025 + Apple Research — le poids institutionnel et le peer-review augmentent la fiabilite. L'ouverture open-source du benchmark facilite la reutilisation dans la communaute.

**Faiblesses :**
1. **Absence totale d'adversarial testing** (Section 7) : c'est la limitation la plus cruciale pour AEGIS. Les auteurs reconnaissent explicitement qu'il n'y a pas de scenarios de confirmation/authentication obligatoires, pas de daemons, pas d'outils potentiellement destructifs. Cela exclut par construction toute evaluation de la robustesse en presence d'un attaquant. ToolSandbox mesure la competence fonctionnelle, pas la securite.
2. **User simulator hallucinant** (Section 7, Table 2) : meme avec les 3 mitigations (User Goal + Knowledge Boundary + Demonstration), le simulateur commet des erreurs de hallucination et d'instruction following. Cela ajoute du bruit aux scores rapportes — difficile d'isoler la performance de l'agent de celle du simulateur.
3. **Scalabilite limitee** (Section 7) : les auteurs admettent que l'ajout de nouveaux scenarios necessite "deep knowledge" et "many iterations" — le benchmark ne peut pas croitre organiquement. Cela contraste avec Liu et al. 2023 (generation automatique) ou Zverev et al. 2025 (prompts paralleles a grande echelle).
4. **Dependance web services** (Section 7) : certains outils dependent de web services externes, ce qui affecte la reproductibilite temporelle. Un score reporte aujourd'hui peut differer demain pour des raisons externes au modele.
5. **Pas de test de robustesse temporelle** : aucun score reporte sur des versions plus recentes (GPT-4o evolue en 2025-2026, Claude-3 -> Claude-4). Les 73.0 de GPT-4o-2024-05-13 sont une photographie datee.

**Questions ouvertes :**
- Si on etend ToolSandbox avec un mode adversarial (tool empoisonne, user simulator hostile, RAG compromise), le gap proprietary/open-source se creuse-t-il ou se reduit-il ? Hypothese : les modeles proprietaires ont plus de RLHF defensif mais aussi une surface d'outils plus riche, donc plus d'opportunites d'exploitation.
- Le "Insufficient Information" challenge pourrait-il servir de proxy pour un test de "tool hallucination jailbreak" — ou on pousse le modele a halluciner un outil benign qui n'existe pas dans un contexte medical ?
- Canonicalization comme surface d'attaque : une injection de prompt qui tord la canonicalisation (ex. date "aujourd'hui" -> date historique arbitraire) pourrait produire des effets de bord permanents via State Dependency.

### Formules exactes

Pas de formules mathematiques originales. Le benchmark est entierement empirique et descriptif. Les scores sont des moyennes par categorie sans formalisation theorique (pas de borne, pas de regression, pas d'IC reporte dans Table 4 principale).

Lien glossaire AEGIS : F22 (ASR — applicable si on reinterprete "tool-use accuracy" comme un complement de ASR), F-milestone (candidat F74 : "Milestone Evaluation" — moyenne ponderee de succes intermediaires vs final, concept introduit par ToolSandbox).

### Pertinence these AEGIS

- **Couches delta :** δ³ (tool-call surface) **principalement** — ToolSandbox est le meilleur benchmark disponible pour quantifier la surface δ³. Intersection avec meta-methodologique : ToolSandbox ne teste aucune couche de defense directement mais fournit un substrat d'evaluation sur lequel la these AEGIS peut ajouter une dimension adversariale (ce qui manque au papier original).
- **Conjectures :** **C5 (les benchmarks sous-estiment l'ASR reel) fortement supportee** — ToolSandbox est precisement l'argument empirique que les benchmarks precedents (BFCL, ToolEval, API-Bank) sous-estimaient la difficulte reelle du tool-use. Meme sans threat adversarial, les SOTA tombent sous 75% — ce qui suggere que sous adversarial les scores seraient bien plus bas. **C7 (tool-call weakest layer) indirectement supportee** — le gap proprietary/open-source (73.0 vs 31.4) suggere que la couche tool-call est la plus sensible au niveau d'alignement/training du modele.
- **Decouvertes :** **D-005 (benchmarks underestimate real-world ASR) renforcee** — ToolSandbox fournit des chiffres concrets (GPT-4o 73.0 non-adversarial, donc plausiblement 40-50 sous adversarial). Candidat nouvelle **decouverte D-023 : "Insufficient Information = Tool Hallucination Floor"** — quand le modele n'a pas l'outil necessaire, il hallucine des appels d'outil plutot que de refuser. Cela ouvre une surface d'attaque : forcer un agent a halluciner un outil dans un contexte medical peut conduire a des actions absurdes mais executees.
- **Gaps :** **Adresse partiellement G-015** (absence de benchmark stateful multi-turn pour agents). **Cree G-024** candidat (absence de version adversariale de ToolSandbox) — axe de recherche direct pour la these AEGIS : construire "AdversarialToolSandbox" en ajoutant les 5 categories manquantes (authentication, confirmation, daemons, tool poisoning, user simulator hostile).
- **Mapping templates AEGIS :** #63 (hallucinated tool call in medical context), #76 (state corruption via multi-turn), #82 (canonicalization abuse — forcer date/coord incorrects), candidat #93 (medical-context insufficient information : pousser l'agent a halluciner un outil d'escalade clinique quand aucun n'existe).

### Citations cles
> "significant performance gap between proprietary and open source models" (Abstract, p. 1)
> "Insufficient Information defined in ToolSandbox are challenging even the most capable SOTA LLMs" (Abstract, p. 1)
> "the best performing open source model...lagging more than 20 points behind the second to last proprietary model" (Section 4, discussion Table 4)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 — benchmark de reference pour evaluer la couche δ³ en contexte stateful, essentiel pour le chapitre experimental de la these sur les agents medicaux CodeAct/tool-call |
| Reproductibilite | Moyenne-Haute — benchmark publie et installable, mais dependance web services externes et user simulator avec erreurs residuelles introduisent du bruit temporel |
| Code disponible | Oui — repository open-source Apple Research (publie avec le papier NAACL 2025) |
| Dataset public | Oui — 1 032 test cases, 34 outils, 11 domaines, user simulator + milestones annotes (Lu et al., 2024, Appendix B) |
