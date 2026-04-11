## [Wang, Poskitt, Sun, 2025] — AgentSpec: Customizable Runtime Enforcement for Safe and Reliable LLM Agents

**Reference :** arXiv:2503.18666v3
**Revue/Conf :** ICSE 2026 (48th IEEE/ACM International Conference on Software Engineering) — CORE A*
**Lu le :** 2026-04-05
> **PDF Source**: [literature_for_rag/P082_2503.18666.pdf](../../assets/pdfs/P082_2503.18666.pdf)
> **Statut**: [ARTICLE VERIFIE] — accepte ICSE 2026, lu via WebFetch arXiv HTML

### Abstract original
> AgentSpec is a lightweight domain-specific language for specifying and enforcing runtime constraints on LLM agents. The system enables users to define structured rules incorporating triggers, predicates, and enforcement mechanisms to maintain safety boundaries. AgentSpec provides a practical and scalable solution for enforcing LLM agent safety through interpretable, modular, and efficient runtime constraints across diverse applications.
> — Source : arXiv abstract page

### Resume (5 lignes)
- **Probleme :** Les agents LLM autonomes (code, robots, vehicules) peuvent executer des actions dangereuses sans verification (Section 1)
- **Methode :** DSL (Domain-Specific Language) avec regles {trigger, predicate, enforcement} + generation automatique de regles par LLM (o1) (Section 3-4)
- **Donnees :** RedCode-Exec (750 cas, 25 categories), SafeAgentBench (250 cas, 11 categories), FixDrive (8 scenarios) (Section 5)
- **Resultat :** >90% prevention code unsafe, 100% elimination actions dangereuses (embodied), 100% conformite (vehicules). Overhead milliseconde (Section 5, Tables 2-4)
- **Limite :** Pas d'analyse de trajectoire — l'enforcement est ponctuel a chaque checkpoint, sans raisonnement sur les consequences multi-etapes (Section 7)

### Analyse critique

**Forces :**
- **Formalisme rigoureux** : Les regles sont definies comme des triplets r = (eta_r, P_r, E_r) avec une semantique formelle precise (Section 3.2). Les operations d'enforcement sont formalisees sur les trajectoires (stop, user_inspection, llm_self_examine, invoke_action).
- **Conference CORE A*** : Accepte a ICSE 2026 — le top de l'ingenierie logicielle. Credibilite methodologique elevee.
- **Overhead negligeable** : Parsing ~1.42ms, evaluation predicats ~1-3ms. Compatible temps reel (Section 5.4, Table 5).
- **Trois domaines** : Evaluation cross-domaine (code, robots, vehicules) — pas de surfit a un seul benchmark (Section 5).
- **Generation automatique** : Les regles peuvent etre generees par LLM avec 95.56% precision et 70.96% recall (embodied agents) (Section 5.2, Table 3).

**Faiblesses :**
- **Pas de defense contre l'injection de prompt** : AgentSpec verifie les ACTIONS de l'agent, mais ne protege pas contre les injections qui manipulent le RAISONNEMENT du LLM sans generer d'actions dangereuses detectables. Un diagnostic medical incorrect n'est pas une "action" au sens d'AgentSpec.
- **Enforcement reactif, pas predictif** : Le systeme agit a chaque checkpoint (before_action, state_change, agent_finish) mais ne raisonne pas sur les trajectoires futures. Une attaque multi-etapes ou chaque etape est individuellement benigne mais dont la sequence est dangereuse echappe au systeme (Section 7).
- **Regles manuelles pour les cas critiques** : Malgre la generation LLM, les regles critiques necessitent une validation humaine. Le recall de 70.96% (embodied) signifie que 29% des situations dangereuses sont manquees par les regles generees automatiquement (Section 5.2).
- **Pas de benchmark adversarial** : Les tests utilisent des scenarios de safety generaux (fragile objects, traffic laws) mais PAS des attaques adversariales deliberees (injection de prompt, manipulation semantique).
- **Pas de test medical** : Aucune evaluation dans le domaine medical malgre la mention d'agents embodied.

**Questions ouvertes :**
- AgentSpec peut-il etre etendu pour verifier les SORTIES texte (diagnostics, recommandations) et pas seulement les actions ?
- Comment gerer les regles contradictoires dans un domaine complexe comme la chirurgie ?
- La generation automatique de regles fonctionne-t-elle pour des domaines ou les risques sont subtils (manipulation semantique vs. action physique evidente) ?

### Formules exactes
- **Regle formelle** : r = (eta_r, P_r, E_r) ou eta_r = event trigger, P_r = {p1, ..., pn} predicats, E_r = [e1, ..., em] enforcements (Section 3.2, Definition 1) [ALGORITHME — avec semantique formelle]
- **Violation** : Une regle est violee quand l'event trigger se produit ET tous les predicats evaluent a true (Section 3.2, Definition 2)
- **Trajectoire modifiee** : stop: tau_i -> tau[:-1] -> a_F s_i ; user_inspection: tau_i si approuve, tau_i -> a_F s_i sinon (Section 3.2, Eq. 1-4)
- Lien glossaire AEGIS : Pas de mapping direct — AgentSpec n'utilise pas Sep(M) ou SVC

### Pertinence these AEGIS — COMPARAISON DIRECTE delta-3

- **Couches delta :** δ³ principalement. AgentSpec est un systeme d'enforcement externe — il verifie les actions de l'agent avant execution.
- **Conjectures :**
  - C1 (δ⁰ insuffisant) : **NEUTRE** — AgentSpec ne traite pas de l'alignement RLHF
  - C2 (δ³ necessaire) : **SUPPORTEE** — AgentSpec demontre que l'enforcement externe est praticable et efficace pour les actions, renforcement de la necessite de δ³
  - C3 (alignement superficiel) : **NEUTRE** — hors scope
- **Decouvertes :** Pas de lien direct
- **Gaps :**
  - G-001 (implementation δ³) : **PARTIELLEMENT ADRESSE** — mais uniquement pour les actions, pas pour le contenu textuel
  - G-020 (defenses agents) : **DIRECTEMENT ADRESSE** — AgentSpec est une defense agent-level
- **Mapping templates AEGIS :** AgentSpec protegerait contre les templates ciblant des tool calls (#25, #30-#36 chaines d'attaque) mais PAS contre les templates de manipulation semantique (#01, #07, #14)

### AEGIS fait quelque chose qu'AgentSpec ne fait PAS

1. **Verification du contenu textuel** : AEGIS validate_output() verifie les valeurs dans les reponses (tension_g, diagnostics). AgentSpec ne verifie que les ACTIONS (tool calls), pas le TEXTE genere par le LLM.
2. **Defense multi-couches δ⁰-δ³** : AEGIS combine 4 niveaux. AgentSpec est purement δ³ sans integration des couches inferieures.
3. **Detection d'injection de prompt** : AEGIS a le RagSanitizer (15 detecteurs) + system prompt hardening. AgentSpec n'a aucune capacite de detection d'injection — il verifie les actions resultantes, pas les causes.
4. **Metriques de separation** : Sep(M), SVC, ASR, cosine drift — absentes d'AgentSpec.
5. **Red-teaming** : AEGIS a un moteur genetique et 98 templates. AgentSpec est purement defensif.
6. **Domaine medical** : AEGIS est specifiquement concu pour la chirurgie robotique. AgentSpec n'a pas de domaine medical.

### AgentSpec fait quelque chose qu'AEGIS ne fait PAS

1. **DSL declaratif extensible** : Les regles AgentSpec sont specifiees dans un langage formel parsable (ANTLR4). Les regles AEGIS sont dans AllowedOutputSpec (Python dataclass) — moins flexible et moins formellement specifiees.
2. **Generation automatique de regles** : AgentSpec peut generer des regles par LLM (95.56% precision). AEGIS necessite la specification manuelle des contraintes.
3. **Enforcement a 4 niveaux** : stop, user_inspection, llm_self_examine, invoke_action. AEGIS n'a que block/allow — pas de mode interactif user_inspection ni de self-examine.
4. **Overhead mesure formellement** : ~1-3ms par evaluation. AEGIS n'a pas publie de benchmark de latence pour validate_output().
5. **Evaluation cross-domaine** : 3 domaines (code, robots, vehicules) avec 1008 cas de test. AEGIS est mono-domaine (chirurgie).

### Citations cles
> "AgentSpec provides a practical and scalable solution for enforcing LLM agent safety" (Abstract)
> — Source : arXiv:2503.18666

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — code LangChain, datasets publics, ICSE peer-reviewed |
| Code disponible | Oui (GitHub, reference dans le papier) |
| Dataset public | Oui (RedCode-Exec, SafeAgentBench, FixDrive) |
