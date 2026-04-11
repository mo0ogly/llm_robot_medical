## [Chennabasappa, Nikolaidis, Song, Molnar et al., 2025] — LlamaFirewall: An Open Source Guardrail System for Building Secure AI Agents

**Reference :** arXiv:2505.03574v1
**Revue/Conf :** Meta / PurpleLlama, preprint mai 2025
**Lu le :** 2026-04-05
> **PDF Source**: [literature_for_rag/P084_2505.03574.pdf](../../assets/pdfs/P084_2505.03574.pdf)
> **Statut**: [PREPRINT] — Meta open source, lu via WebFetch arXiv HTML

### Abstract original
> Large language models (LLMs) have evolved from simple chatbots into autonomous agents capable of performing complex tasks such as editing production code, orchestrating workflows, and taking higher-stakes actions based on untrusted inputs like webpages and emails. LlamaFirewall addresses gaps in existing security measures by functioning as a final defensive layer with customizable, use-case-specific safety policies. The framework includes PromptGuard 2 (universal jailbreak detector), Agent Alignment Checks (chain-of-thought auditor), and CodeShield (online static analysis engine).
> — Source : arXiv abstract page

### Resume (5 lignes)
- **Probleme :** Les agents LLM traitent des entrees non fiables (web, emails, code) et les guardrails existants sont insuffisants pour les pipelines agentiques (Section 1)
- **Methode :** Architecture 3 couches : PromptGuard 2 (DeBERTa 86M, detection jailbreak), AlignmentCheck (auditeur CoT sur traces d'execution), CodeShield (analyse statique code) (Sections 2-4)
- **Donnees :** AgentDojo (benchmark agents), dataset interne Meta multilingual, CyberSecEval3 (code) (Section 5)
- **Resultat :** PromptGuard 2 : 0.98 AUC, 97.5% recall a 1% FPR ; AlignmentCheck : >80% recall, <4% FPR ; combine : 1.75% ASR sur AgentDojo (reduction >90%) (Section 5, Tables)
- **Limite :** AlignmentCheck necessite des modeles >= 70B parametres pour etre fiable ; vulnerable aux injections ciblant l'auditeur lui-meme (Section 6)

### Analyse critique

**Forces :**
- **Architecture complementaire** : Trois couches qui couvrent des surfaces differentes — detection input (PromptGuard), audit raisonnement (AlignmentCheck), securite code (CodeShield). La combinaison reduit l'ASR de 17.6% a 1.75% sur AgentDojo (Section 5.3).
- **PromptGuard 2 = SOTA detection jailbreak** : 0.98 AUC avec DeBERTa 86M, robuste aux attaques de tokenisation (fragmentation, whitespace) grace a un hardened tokenizer (Section 2.2). Energy-based loss pour calibration (Section 2.1).
- **AlignmentCheck = innovation cle** : Audit de la trace de raisonnement COMPLETE de l'agent (pas juste l'input/output) pour detecter le goal hijacking. C'est la premiere implementation industrielle d'un auditeur de traces (Section 3).
- **Open source (PurpleLlama)** : Meta publie tout — modeles, code, framework. Reproductibilite totale.
- **Performance multilingual** : PromptGuard 2 86M atteint 0.995 AUC en multilingual (Section 2.3) — important pour les attaques cross-linguales (cf. templates AEGIS cross-lingual).
- **Latence mesurable** : PromptGuard ~92ms/512 tokens (A100), CodeShield ~60ms tier-1 (Section 2.4, 4.3).

**Faiblesses :**
- **AlignmentCheck est un LLM** : L'auditeur est lui-meme un LLM (Llama 3.3 70B ou Llama 4 Maverick). Les auteurs admettent la vulnerabilite aux "guardrail injection attacks targeting both agent and auditor" (Section 6). C'est exactement le probleme de P044 (AdvJudge) — un juge LLM est lui-meme manipulable.
- **Dependance a la taille du modele** : Les petits modeles (Llama 3.2 1B, 3B) ont des FPR elevees rendant AlignmentCheck inutilisable (Section 5.2). Cela exclut les deploiements edge/embarques — problematique pour un robot chirurgical avec contraintes de latence.
- **Pas de validation formelle** : Contrairement a CaMeL (P081), LlamaFirewall n'offre AUCUNE garantie formelle. La securite est empirique — 1.75% ASR signifie que 1.75% des attaques passent encore.
- **Cout d'utilite de ~5 points** : Passe de 47.7% a 42.7% d'utilite sur AgentDojo (Section 5.3). Non negligeable.
- **PromptGuard ne detecte pas les IPI subtiles** : PromptGuard cible les jailbreaks "explicites" — les injections indirectes qui ne contiennent pas de phrasage de jailbreak echappent a la detection (Section 6.1).
- **Preprint** : Pas de peer review formel.

**Questions ouvertes :**
- AlignmentCheck peut-il etre remplace par un validateur deterministe (δ³) plutot qu'un LLM pour eliminer la vulnerabilite recursive ?
- Quelle est la performance sur des attaques multi-tour cumulatives (cf. template #07 AEGIS) ?
- Le framework est-il adaptable au domaine medical (traces d'execution chirurgicale) ?

### Formules exactes
- **PromptGuard 2 loss** : Energy-based loss inspiree de la detection out-of-distribution — penalise les predictions overconfident sur inputs benins (Section 2.1) [ALGORITHME — classification DeBERTa]
- **Metriques** : AUC, recall@FPR=1%, ASR sur AgentDojo (Section 5)
- **AgentDojo combine** : ASR = 1.75%, utilite = 42.7% (Section 5.3)
- Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M)) — LlamaFirewall ne mesure pas Sep(M)

### Pertinence these AEGIS — COMPARAISON DIRECTE delta-3

- **Couches delta :**
  - PromptGuard 2 = δ² (detection syntaxique/pattern-based d'injection, deterministe DeBERTa)
  - AlignmentCheck = δ¹ avance (audit comportemental par LLM — PAS deterministe)
  - CodeShield = δ² (analyse statique, deterministe)
  - **Pas de vrai δ³** : Aucun composant ne fait de validation formelle des contraintes de sortie
- **Conjectures :**
  - C1 (δ⁰ insuffisant) : **SUPPORTEE** — LlamaFirewall ajoute 3 couches car δ⁰ ne suffit pas
  - C2 (δ³ necessaire) : **SUPPORTEE INDIRECTEMENT** — malgre 3 couches, 1.75% ASR subsiste. L'absence de δ³ deterministe explique ce residu.
  - C3 (alignement superficiel) : **NEUTRE** — hors scope
  - C7 (paradoxe raisonnement/securite) : **SUPPORTEE** — les petits modeles ne peuvent pas etre auditeurs fiables, montrant que le raisonnement ne suffit pas pour la securite
- **Decouvertes :** D-001 (triple convergence) — les 3 couches de LlamaFirewall ne couvrent pas tout (1.75% ASR residuel)
- **Gaps :**
  - G-001 (implementation δ³) : **NON ADRESSE** — LlamaFirewall n'a pas de δ³
  - G-003 (red-team medical) : **NON ADRESSE** — pas de test medical
  - G-020 (defenses agents) : **DIRECTEMENT ADRESSE** — AlignmentCheck est une defense agent-level
- **Mapping templates AEGIS :** PromptGuard bloquerait #01 (structural), #08 (extortion) — jailbreaks explicites. AlignmentCheck bloquerait #25 (tool hijack), #30+ (chaines). Mais #07 (multi-turn), #14 (authority medical) passeraient — IPI subtiles.

### AEGIS fait quelque chose que LlamaFirewall ne fait PAS

1. **Validation formelle de sortie (δ³)** : AEGIS validate_output() verifie des contraintes numeriques deterministes (tension_g <= 800, outils interdits). LlamaFirewall n'a PAS d'equivalent — l'audit est fait par un LLM (AlignmentCheck) qui est lui-meme vulnerable.
2. **Metriques de separation Sep(M)** : AEGIS mesure formellement la separation instruction/donnee. LlamaFirewall n'a pas de metrique de separation.
3. **Red-teaming medical** : 98 templates + 48 scenarios chirurgicaux. LlamaFirewall = 0 medical.
4. **Moteur genetique** : AEGIS genere des variantes d'attaque par evolution. LlamaFirewall est purement defensif.
5. **Defense combinee δ⁰-δ³** : AEGIS evalue et combine les 4 couches. LlamaFirewall combine δ¹ (AlignmentCheck) + δ² (PromptGuard, CodeShield) mais sans δ³.
6. **Detection manipulation semantique** : AEGIS detecte les diagnostics incorrects via validation de contenu. LlamaFirewall ne verifie pas la veracite medicale des reponses.

### LlamaFirewall fait quelque chose qu'AEGIS ne fait PAS

1. **Detection jailbreak SOTA** : PromptGuard 2 (DeBERTa 86M, 0.98 AUC, 97.5% recall@1%FPR) est un detecteur specialise bien superieur aux regex du RagSanitizer AEGIS. La detection multilingue (0.995 AUC) et le hardened tokenizer sont des innovations significatives.
2. **Audit de traces d'execution** : AlignmentCheck audite la TRACE COMPLETE de raisonnement de l'agent (pas juste input/output). AEGIS validate_output() ne verifie que la sortie finale — il ne voit pas le raisonnement intermediaire.
3. **Analyse statique de code (CodeShield)** : 50+ CWEs detectees, 96% precision. AEGIS ne genere pas de code et n'a pas besoin de cette couche, mais c'est une capacite absente.
4. **Open source industriel** : Meta PurpleLlama avec support production. AEGIS est un prototype de recherche.
5. **Performance multilingual** : PromptGuard 2 couvre nativement de multiples langues. Le RagSanitizer AEGIS est principalement anglais/francais.

### Citations cles
> "Combined LlamaFirewall achieves 1.75% ASR on AgentDojo, a >90% reduction" (Section 5.3)
> — Source : arXiv:2505.03574

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — open source PurpleLlama, modeles publics |
| Code disponible | Oui (github.com/meta-llama/PurpleLlama) |
| Dataset public | Oui (AgentDojo, CyberSecEval3) |
