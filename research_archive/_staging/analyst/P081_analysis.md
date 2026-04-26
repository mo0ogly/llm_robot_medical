## [Debenedetti, Shumailov, Fan, Hayes, Carlini, Fabian, Kern, Shi, Terzis, Tramer, 2025] — CaMeL: Defeating Prompt Injections by Design

**Reference :** arXiv:2503.18813v3
**Revue/Conf :** Google DeepMind / ETH Zurich, preprint mars 2025 (revise juin 2025)
**Lu le :** 2026-04-05
> **PDF Source**: [literature_for_rag/P081_2503.18813.pdf](../../literature_for_rag/P081_2503.18813.pdf)
> **Statut**: [PREPRINT] — lu via WebFetch arXiv + GitHub repository

### Abstract original
> LLM agents are vulnerable to prompt injection attacks when handling untrusted data. We propose CaMeL, a defensive system layer that operates around the LLM itself. CaMeL works by explicitly separating control and data flows derived from trusted queries, ensuring untrusted data cannot influence program execution paths. The system employs a capability-based model to prevent unauthorized data exfiltration. CaMeL solves 77% of tasks with provable security on the AgentDojo benchmark, compared to 84% success without defenses.
> — Source : arXiv abstract page

### Resume (5 lignes)
- **Probleme :** Les agents LLM sont vulnerables aux injections de prompt lorsqu'ils traitent des donnees non fiables provenant d'outils externes (Section 1)
- **Methode :** Separation explicite des flux de controle (trusted) et de donnees (untrusted) via taint tracking + modele de capabilities pour prevenir l'exfiltration (Section 3-4)
- **Donnees :** Benchmark AgentDojo (suite d'evaluation pour agents LLM avec injections adversariales)
- **Resultat :** 77% des taches resolues avec securite prouvable vs 84% sans defense — cout de 7 points d'utilite pour une securite formelle (Section 5)
- **Limite :** Le system repose sur la capacite du LLM a generer un plan correct (DAG) a partir de la requete utilisateur ; si le plan est incorrect, la securite est maintenue mais la tache echoue (Section 6)

### Analyse critique

**Forces :**
- **Securite par conception** : CaMeL ne fait PAS confiance au LLM pour les decisions de securite — le LLM genere un plan (DAG de tool calls), mais l'execution est controlee par une couche externe deterministe (Section 3). C'est la premiere implementation industrielle du principe "ne jamais deleguer la securite au LLM".
- **Taint tracking formel** : Chaque valeur manipulee par le systeme est etiquetee comme "trusted" ou "untrusted". Les operations de propagation de taint suivent des regles deterministes — si une valeur untrusted influence un argument de tool call, l'appel est bloque ou soumis a approbation (Section 4).
- **Modele de capabilities** : Prevention d'exfiltration via un modele de capacites — les outils sont declasses en lecture seule pour les donnees tainted, empechant un attaquant de faire fuiter des donnees privees vers un canal externe (Section 4).
- **Open source** : Code publie sur GitHub (google-research/camel-prompt-injection), reproductibilite complete.
- **Equipe credible** : Nicholas Carlini (Google DeepMind) et Florian Tramer (ETH Zurich) — deux des chercheurs les plus cites en securite adversariale.

**Faiblesses :**
- **Cout d'utilite de 7%** : Passer de 84% a 77% sur AgentDojo represente une degradation non negligeable. Pour un deploiement medical, meme 77% de completion peut etre insuffisant si les 23% de taches echouees incluent des operations critiques.
- **Dependance au LLM pour le plan** : Le LLM doit produire un DAG correct de tool calls. Si le plan est mal forme (hallucination d'outils, sequencement incorrect), CaMeL ne peut pas compenser — la securite est maintenue mais la fonctionnalite est perdue.
- **Pas de test medical** : Aucune evaluation dans un domaine medical ou a risque vital. Le benchmark AgentDojo couvre des taches generiques (email, calendrier, etc.).
- **Pas de defense contre la manipulation semantique** : CaMeL protege contre l'execution d'actions non autorisees, mais ne detecte PAS si le LLM genere un diagnostic medical incorrect influence par injection. La manipulation semantique de la SORTIE texte n'est pas couverte.
- **Statut preprint** : Pas encore publie en conference peer-reviewed (mars 2025).

**Questions ouvertes :**
- Comment CaMeL gere-t-il les tool calls dont les arguments dependent de donnees untrusted mais de facon legitime (ex: chercher un patient par nom dans un RAG) ?
- Quelle est la latence ajoutee par le taint tracking dans un pipeline temps reel ?
- Le modele de capabilities est-il extensible a des outils physiques (actuateurs robotiques) ?

### Formules exactes
- **Taint propagation** : `taint(f(x1, ..., xn)) = OR(taint(x1), ..., taint(xn))` — propagation conservative (Section 4) [ALGORITHME]
- **Securite prouvable** : Si le plan est correct ET la politique de capabilities est respectee, alors aucune injection ne peut provoquer une action non autorisee ou une exfiltration (Section 4, Theorem informel) [HEURISTIQUE — pas de preuve formelle complete publiee, argument par construction]
- Lien glossaire AEGIS : F15 (Sep(M)), F22 (ASR) — CaMeL vise ASR = 0% par construction

### Pertinence these AEGIS — COMPARAISON DIRECTE δ³

- **Couches delta :** δ³ principalement. CaMeL est un systeme δ³ par excellence — validation externe des actions du LLM.
- **Conjectures :**
  - C1 (δ⁰ insuffisant) : **SUPPORTEE** — CaMeL ne fait aucune confiance a δ⁰ pour la securite
  - C2 (δ³ necessaire) : **FORTEMENT SUPPORTEE** — CaMeL est la demonstration la plus complete que δ³ est la seule approche avec garanties formelles
  - C3 (alignement superficiel) : **NEUTRE** — CaMeL contourne le probleme plutot que de le documenter
- **Decouvertes :** D-001 (triple convergence) — CaMeL valide indirectement que δ⁰-δ² sont insuffisants
- **Gaps :**
  - G-001 (implementation δ³) : **PARTIELLEMENT ADRESSE** par CaMeL — mais l'approche est tres differente d'AEGIS
  - G-020 (defenses agents) : **DIRECTEMENT ADRESSE** par CaMeL
- **Mapping templates AEGIS :** CaMeL protegerait contre #01 (structural), #07 (multi-turn), #14 (authority), #25 (tool call hijack) — tous les templates ou l'attaque cible l'execution d'actions

### AEGIS fait quelque chose que CaMeL ne fait PAS

1. **Defense multi-couches δ⁰-δ³** : AEGIS evalue et combine les 4 couches de defense. CaMeL est purement δ³ — il n'integre pas de system prompt hardening (δ¹) ni de sanitisation syntaxique (δ²). En cas de defaillance du taint tracker, aucun filet de securite.
2. **Metriques de separation Sep(M)** : AEGIS mesure la separation instruction/donnee avec Sep(M) (Zverev et al., 2025, ICLR). CaMeL n'a pas de metrique de mesure — c'est tout ou rien (securite prouvable ou pas).
3. **Red-teaming medical** : AEGIS a 98 templates + 48 scenarios dans le domaine chirurgical (Da Vinci Xi). CaMeL n'a aucune evaluation medicale.
4. **Moteur genetique** : AEGIS genere des variantes d'attaque par croisement/mutation avec suivi de derive semantique (cosine drift). CaMeL n'a pas de capacite offensive — c'est purement defensif.
5. **Detection de manipulation semantique** : AEGIS detecte si le LLM produit un diagnostic incorrect (validate_output verifie les valeurs de tension, etc.). CaMeL ne verifie pas le CONTENU textuel des reponses, seulement les ACTIONS (tool calls).

### CaMeL fait quelque chose qu'AEGIS ne fait PAS

1. **Taint tracking formel** : CaMeL etiquette chaque valeur comme trusted/untrusted et propage les taint tags a travers les operations. AEGIS n'a pas de taint tracking — le validate_output() agit sur la sortie finale sans tracer l'origine des donnees.
2. **Prevention d'exfiltration** : Le modele de capabilities empeche les donnees privees de fuiter via des outils. AEGIS ne modelise pas explicitement les flux d'information — un attaquant pourrait exfiltrer des donnees patient si le LLM coopere.
3. **Securite prouvable (par construction)** : CaMeL offre des garanties formelles (sous hypotheses). AEGIS offre une defense empirique mesuree (ASR, Sep(M)) mais sans preuve formelle de completude.
4. **Separation plan/execution** : Le LLM genere un plan, mais l'execution est deterministe. Dans AEGIS, le LLM genere ET execute — la frontiere est plus floue.

### Citations cles
> "CaMeL solves 77% of tasks with provable security" (Abstract)
> — Source : arXiv:2503.18813

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 |
| Reproductibilite | Haute — code open source, benchmark public |
| Code disponible | Oui (github.com/google-research/camel-prompt-injection) |
| Dataset public | Oui (AgentDojo) |
