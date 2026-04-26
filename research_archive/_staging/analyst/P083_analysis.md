## [Cai, Shabihi, An, Che, Bartoldson, Kailkhura, Goldstein, Huang, 2025] — AegisLLM: Scaling Agentic Systems for Self-Reflective Defense in LLM Security

**Reference :** arXiv:2504.20965v2
**Revue/Conf :** ICLR 2025 Workshop BuildingTrust
**Lu le :** 2026-04-05
> **PDF Source**: [literature_for_rag/P083_2504.20965.pdf](../../literature_for_rag/P083_2504.20965.pdf)
> **Statut**: [ARTICLE VERIFIE] — accepte ICLR 2025 Workshop, lu via WebFetch arXiv HTML

### Abstract original
> We introduce AegisLLM, a cooperative multi-agent defense against adversarial attacks and information leakage. In AegisLLM, a structured workflow of autonomous agents - orchestrator, deflector, responder, and evaluator - collaborate to ensure safe and compliant LLM outputs, while self-improving over time through prompt optimization. We show that scaling agentic reasoning system at test-time - both by incorporating additional agent roles and by leveraging automated prompt optimization (such as DSPy) - substantially enhances robustness without compromising model utility. This test-time defense enables real-time adaptability to evolving attacks, without requiring model retraining.
> — Source : arXiv abstract page

### Resume (5 lignes)
- **Probleme :** Les defenses LLM existantes necessitent un retraining couteux et degradent l'utilite (Section 1)
- **Methode :** Pipeline multi-agent (orchestrator, deflector, responder, evaluator) + optimisation automatique des prompts via DSPy/MIPROv2 (Section 2-3)
- **Donnees :** WMDP (3668 QCM biosecurite/cyber/chimie), StrongReject (jailbreak), TOFU (unlearning), PHTest (utilite) (Section 4)
- **Resultat :** Near-perfect unlearning avec 20 exemples, 51% amelioration StrongReject vs baseline, 7.9% FPR sur PHTest (vs 18-55% pour methodes comparables) (Section 4, Tables 1-3)
- **Limite :** Evalue uniquement sur les 2 premiers risques OWASP LLM (injection + fuite d'information), pas de couverture des 8 autres (Section 5)

### Analyse critique

**ATTENTION TERMINOLOGIQUE** : Ce papier s'appelle "AegisLLM" — meme racine que notre projet "AEGIS". Il est imperatif de distinguer clairement les deux dans la these : "AegisLLM (Cai et al., 2025)" vs "AEGIS Lab (notre contribution)". La concurrence terminologique necessite une note de clarification dans le manuscrit.

**Forces :**
- **Test-time defense sans retraining** : L'approche n'exige aucune modification des poids du modele. L'optimisation se fait par refinement des prompts des agents via DSPy (Section 3). C'est compatible avec des modeles fermes (API-only).
- **Self-improving** : L'optimisation MIPROv2 en 3 phases (bootstrap, proposition d'instructions, optimisation bayesienne par TPE) permet une amelioration continue (Section 3.2).
- **Excellent trade-off securite/utilite** : 7.9% FPR vs 18-55% pour les methodes par retraining (Section 4.3, Table 3). C'est le meilleur ratio dans la litterature pour les defenses sans retraining.
- **Minimal training data** : 20 exemples + <300 LM calls suffisent pour l'optimisation (Section 4.1).

**Faiblesses :**
- **Architecture 4 agents = overhead significant** : Chaque requete passe par 4 agents LLM — latence multiplicative. Incompatible avec un deploiement temps reel en chirurgie.
- **Pas de defense structurelle** : AegisLLM est une defense comportementale (δ¹ sophistiquee) — les agents SONT des LLMs. L'orchestrator qui decide si une requete est dangereuse peut lui-meme etre injecte. Le papier ne discute pas de cette vulnerabilite recursive (lacune critique).
- **Deflector = refus aleatoire** : Pour les QCM, le deflector selectionne une option au hasard (Section 2). Ce n'est pas une defense — c'est un refus d'engagement. Dans un contexte medical, refuser aleatoirement est aussi dangereux que repondre incorrectement.
- **Benchmarks deconnectes du reel** : WMDP (QCM), StrongReject (jailbreak generique), PHTest (utilite). Aucun test d'injection indirecte, aucun scenario agentique, aucun domaine critique.
- **Workshop, pas conference principale** : ICLR 2025 Workshop BuildingTrust — pas le meme niveau de review qu'un papier de conference principale.
- **Pas de metriques formelles** : Pas de Sep(M), pas de preuve de securite, pas de modele de menace formel. Les metriques sont empiriques (accuracy, flagged ratio).

**Questions ouvertes :**
- L'orchestrator est-il lui-meme vulnerable a l'injection de prompt ? Que se passe-t-il si l'attaquant cible l'orchestrator plutot que le modele principal ?
- Comment AegisLLM gere-t-il les attaques indirectes (IPI) ou l'injection vient d'un document RAG et non du prompt utilisateur ?
- Le DSPy optimization converge-t-il pour tous les types d'attaque, ou seulement pour ceux presents dans le training set ?

### Formules exactes
- **Optimisation MIPROv2** : Minimisation combinatoire sur paires instruction-demonstration via Tree-Structured Parzen Estimators (TPE) (Section 3.2) [HEURISTIQUE — pas de garantie de convergence]
- **Flagged ratio** : proportion de requetes dangereuses correctement identifiees par l'orchestrator (Section 4.1) [EMPIRIQUE]
- **Metriques** : Accuracy WMDP (cible: 25% = random pour unlearning), StrongReject score (plus bas = meilleur), PHTest compliance rate (Section 4)
- Lien glossaire AEGIS : F22 (ASR) — inversement correle au flagged ratio

### Pertinence these AEGIS — COMPARAISON DIRECTE δ³

- **Couches delta :** δ¹ principalement (defense comportementale multi-agent). PAS δ³ malgre le nom similaire. AegisLLM ne fait PAS de validation formelle externe — tous les agents sont des LLMs.
- **Conjectures :**
  - C1 (δ⁰ insuffisant) : **SUPPORTEE** — AegisLLM ne se repose pas sur δ⁰ seul, ajoute des couches
  - C2 (δ³ necessaire) : **NEUTRE/CONTRA** — AegisLLM pretend que δ¹ multi-agent suffit sans δ³. Mais l'absence de test adversarial avance affaiblit cette pretention.
  - C3 (alignement superficiel) : **NEUTRE** — hors scope du papier
  - C7 (paradoxe raisonnement/securite) : **SUPPORTEE INDIRECTEMENT** — DeepSeek-R1 underperforms vs non-reasoning models (Section 4.2), confirmant que le raisonnement ne correle pas avec la securite
- **Decouvertes :** Pas de lien direct avec D-001 a D-020
- **Gaps :**
  - G-001 (implementation δ³) : **NON ADRESSE** — AegisLLM n'est pas δ³
  - G-020 (defenses agents) : **PARTIELLEMENT ADRESSE** — defense multi-agent mais sans evaluation adversariale agent-level
- **Mapping templates AEGIS :** AegisLLM protegerait partiellement contre les templates de jailbreak generiques (#01-#10) mais serait VULNERABLE aux templates de manipulation contextuelle (#07, #14) car tous les agents sont des LLMs susceptibles d'injection

### AEGIS fait quelque chose qu'AegisLLM ne fait PAS

1. **Validation formelle (δ³)** : AEGIS validate_output() est deterministe — il verifie des contraintes numeriques (tension_g, outils interdits) SANS utiliser de LLM. AegisLLM utilise un LLM-evaluator qui est lui-meme susceptible d'injection (cf. P044 AdvJudge).
2. **Defense multi-couches δ⁰-δ³** : AEGIS integre les 4 couches. AegisLLM est purement δ¹ (comportemental) — pas de sanitisation syntaxique (δ²), pas de validation deterministe (δ³).
3. **Moteur genetique + red-teaming** : AEGIS genere et teste des attaques. AegisLLM est purement defensif — il ne peut pas tester sa propre robustesse.
4. **Sep(M) et metriques formelles** : AEGIS mesure la separation instruction/donnee. AegisLLM n'a pas de metrique de separation.
5. **Domaine medical specifique** : 98 templates + 48 scenarios chirurgicaux vs 0 pour AegisLLM.
6. **Defense contre IPI/RAG** : AEGIS a le RagSanitizer (15 detecteurs). AegisLLM ne traite pas l'injection indirecte.

### AegisLLM fait quelque chose qu'AEGIS ne fait PAS

1. **Auto-amelioration par DSPy** : Optimisation automatique des prompts des agents defensifs via MIPROv2. AEGIS n'a pas de mecanisme d'auto-amelioration des prompts defensifs.
2. **Optimisation test-time** : Adaptation en temps reel aux nouveaux types d'attaque sans retraining. Les regles AEGIS sont statiques (AllowedOutputSpec).
3. **Evaluation sur benchmarks standardises** : WMDP, StrongReject, TOFU, PHTest — metriques comparables avec la litterature. AEGIS utilise ses propres benchmarks internes.
4. **Defense contre l'unlearning** : AegisLLM traite le probleme de l'oubli de connaissances dangereuses (WMDP). AEGIS ne traite pas l'unlearning.

### Citations cles
> "Scaling agentic reasoning system at test-time substantially enhances robustness without compromising model utility" (Abstract)
> — Source : arXiv:2504.20965

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Moyenne — code GitHub, mais workshop paper avec details limites |
| Code disponible | Oui (GitHub) |
| Dataset public | Oui (WMDP, StrongReject, TOFU, PHTest) |
