## [Bonagiri, Kumaraguru, Nguyen & Plaut, 2025] — Check Yourself Before You Wreck Yourself: Selectively Quitting Improves LLM Agent Safety

**Reference :** arXiv:2510.16492
**Revue/Conf :** Workshop on Reliable ML from Unreliable Data, NeurIPS 2025. UC Berkeley / MBZUAI / IIIT Hyderabad.
**Lu le :** 2026-04-08
> **PDF Source**: [literature_for_rag/P116_selectively_quitting.pdf](../../assets/pdfs/P116_selectively_quitting.pdf)
> **Statut**: [ARTICLE VERIFIE] — publie NeurIPS 2025 Workshop. Lu en texte complet via ChromaDB (74 chunks).

### Abstract original
> As Large Language Model (LLM) agents increasingly operate in complex environments with real-world consequences, their safety becomes critical. While uncertainty quantification is well-studied for single-turn tasks, multi-turn agentic scenarios with real-world tool access present unique challenges where uncertainties and ambiguities compound, leading to severe or catastrophic risks beyond traditional text generation failures. We propose using "quitting" as a simple yet effective behavioral mechanism for LLM agents to recognize and withdraw from situations where they lack confidence. Leveraging the ToolEmu framework, we conduct a systematic evaluation of quitting behavior across 12 state-of-the-art LLMs. Our results demonstrate a highly favorable safety-helpfulness trade-off: agents prompted to quit with explicit instructions improve safety by an average of +0.40 on a 0-3 scale across all models (+0.64 for proprietary models), while maintaining a negligible average decrease of -0.03 in helpfulness. Our analysis demonstrates that simply adding explicit quit instructions proves to be a highly effective safety mechanism that can immediately be deployed in existing agent systems, and establishes quitting as an effective first-line defense mechanism for autonomous agents in high-stakes applications.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les agents LLM multi-tour avec acces outils exhibent un "compulsion to act" — ils poursuivent l'execution meme dans des situations ambigues ou dangereuses, sans mecanisme de desengagement (Section 1, p. 1).
- **Methode :** Extension de l'espace d'actions standard A avec une action aquit. 3 strategies de prompting : Baseline (ReAct standard), Simple Quit (option de quitter sans guidance), Specified Quit (directives explicites de securite avec 4 conditions de quit). Evaluation via ToolEmu (Ruan et al., 2023) : 144 scenarios high-stakes, 36 toolkits, 9 types de risques (Section 3, p. 4-5).
- **Donnees :** 12 modeles : 6 proprietaires (Gemini 2.5 Pro, Claude 3.7/4 Sonnet, GPT-4o/4o-mini/5) + 6 open-weight (Llama 3.1 8B/70B, Llama 3.3 70B, Qwen 3 8B/32B/32B-thinking). Evaluateur : Qwen3-32B temperature 0.0 (Section 3.3, p. 4).
- **Resultat :** Specified Quit : +0.40 securite moyenne (+0.64 proprietaires), -0.03 helpfulness. Claude 4 Sonnet : securite x2.2 (1.008 a 2.223), helpfulness -0.015, quit rate 72.22%. GPT-5 : securite +0.33 (1.783 a 2.113), quit rate 11.81% (Table 1, p. 6).
- **Limite :** ToolEmu = sandbox emule par LLM, pas des outils reels. Le juge (Qwen3-32B) peut etre biaise. Modeles open-weight (Llama) quasi-insensibles au quitting (quit rate < 9% meme avec Specified Quit) — gap instruction-following (Section 4, p. 6-7).

### Analyse critique
**Forces :**
- **Simplicite operationnelle** : la defense est un ajout de prompt, zero retraining, deployable immediatement — cout quasi-nul (Section 1, p. 3).
- **Trade-off favorable** : +0.40 securite pour -0.03 helpfulness = ratio > 13:1 en faveur de la securite. Le papier demonstre que les agents quittent principalement les taches qu'ils auraient echouees de toute facon (Section 4, p. 7).
- **N robuste** : 12 modeles x 144 scenarios x 3 strategies = 5184 evaluations. Resultats coherents entre modeles proprietaires (Table 1, p. 6).
- **Correlation quit rate / securite** : r positif fort (Figure 2b, p. 7) — plus le modele quitte, plus il est sur. Pas de plateau ni d'effondrement de la helpfulness meme a 72% quit rate.
- **Benchmark ToolEmu** : scenarios high-stakes incluant EpicFHIR (sante), BankManager (finance), AugustSmartLock (securite physique) — pertinence directe pour le domaine medical (Section 3.2, p. 4).
- **Exemples qualitatifs detailles** : le scenario crypto (Figure 3, p. 8) illustre concretement la difference entre un agent qui assume et un agent qui quitte.

**Faiblesses :**
- **Juge LLM** : Qwen3-32B comme evaluateur securite/helpfulness — potentiellement manipulable (P044 montre 99% flip rate sur juge LLM). Pas de validation humaine croisee.
- **ToolEmu limitation** : les outils sont emules par LLM, pas reels. Le comportement en sandbox peut differer du comportement avec vrais outils (Section 3.2, p. 4).
- **Open-weight insensibles** : Llama 3.1/3.3 quasi-insensibles (quit rate < 9%, securite + < 0.15). Le mecanisme ne fonctionne que sur les modeles avec forte instruction-following — excluant les modeles < 70B qui sont les plus deployes en edge/medical (Table 1, p. 6).
- **Pas de test adversariel** : le quitting est-il contournable par un attaquant qui masque le risque ? Pas de test avec injection indirecte ou obfuscation de la dangerosuite.
- **Workshop paper** (8 pages) — analyse limitee par le format. Pas de test multi-tour prolonge (> 5 etapes).

**Questions ouvertes :**
- Le quitting est-il contournable par prompt injection (un attaquant peut-il convaincre l'agent de ne PAS quitter) ?
- Comment le quitting interagit-il avec le peer-preservation (C8) ? Un agent qui devrait shutdown un pair quitte-t-il au lieu d'agir ?
- LLaMA 3.2 3B (modele AEGIS) est-il sensible au Specified Quit ?

### Formules exactes
**Trajectoire agent :**
tau_N = (a_1, omega_1, ..., a_N, omega_N)
r_s = R_s(u, tau_N), r_h = R_h(u, tau_N)
(Section 3.1, Eq. 1, p. 4)
Lien glossaire AEGIS : F22 (ASR) inverse — ici metrique de securite sur echelle 0-3

**Action space etendu :**
pi : H -> A union {a_quit}
(Section 3.4, Eq. 2, p. 4)
Lien glossaire AEGIS : a proposer comme F74 (quitting policy)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (le quitting est une defense au niveau instruction-following — il exploite le meme mecanisme RLHF que les attaques exploitent), δ¹ (la "compulsion to act" est un biais encode dans l'instruction-following qui depasse le RLHF)
- **Conjectures :** C8 (peer-preservation) **MITIGATION CANDIDATE** — le quitting pourrait etre une defense contre C8 si un agent est instruite de quitter plutot que de proteger un pair compromis. MAIS le papier ne teste pas ce scenario. C1 (structural bypass) **NEUTRE** — le quitting ne protege pas contre les injections de prompt directes.
- **Decouvertes :** D-007 (instruction hierarchy) **CONFIRMEE** — le Specified Quit montre que des instructions explicites de securite overrident la compulsion a agir. D-013 (shallow alignment) **NUANCEE** — le quitting contourne le probleme du shallow alignment en ajoutant une couche comportementale plutot qu'en modifiant l'alignement.
- **Gaps :** G-030 **DIRECTEMENT ADRESSE** — le quitting est une defense generique (pas specifique peer-preservation) mais applicable comme premiere ligne de defense. Le papier confirme que zero defense specifique anti-peer-preservation existe (il ne le mentionne meme pas). G-028 **NON ADRESSE** (pas de test peer-preservation). G-031 **PARTIELLEMENT ADRESSE** (EpicFHIR dans ToolEmu = contexte medical, mais pas de test sur robot chirurgical).
- **Mapping templates AEGIS :** Defense testable contre templates impliquant des actions a haut risque (#08 ransomware-tool-hijack, #09 null-injection-control) — le quitting pourrait etre integre comme 16e detecteur du RagSanitizer ou comme directive dans le system prompt du security_audit_agent.

### Citations cles
> "Agents exhibit a strong 'compulsion to act' which can be overcome by providing explicit instructions on when to quit." (Abstract, p. 1)
> "Agents are largely quitting tasks they were likely to fail or handle incorrectly anyway, thus preventing unsafe actions without significantly hurting performance." (Section 4, p. 6)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — code public (https://github.com/victorknox/QuittingAgents), framework ToolEmu ouvert, prompts complets en Appendix C, evaluateur specifie (Qwen3-32B, temp=0) |
| Code disponible | Oui (https://github.com/victorknox/QuittingAgents) |
| Dataset public | Oui (ToolEmu benchmark, 144 scenarios) |
