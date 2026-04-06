## [Evtimov et al., 2025] — WASP: Benchmarking Web Agent Security Against Prompt Injection Attacks

**Reference** : arXiv:2504.18575v3
**Revue/Conf** : arXiv preprint (FAIR at Meta), 16 May 2025
**Lu le** : 2026-04-04
> **PDF Source**: [literature_for_rag/P004_source.pdf](../../literature_for_rag/P004_source.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (73 chunks)

**Nature epistemique** : [EMPIRIQUE] — benchmark avec evaluation experimentale multi-modeles

### Abstract original
> "Autonomous UI agents powered by AI have tremendous potential to boost human productivity by automating routine tasks such as filing taxes and paying bills. However, a major challenge in unlocking their full potential is security, which is exacerbated by the agent's ability to take action on their user's behalf. Existing tests for prompt injections in web agents either over-simplify the threat by testing unrealistic scenarios or giving the attacker too much power, or look at single-step isolated tasks. To more accurately measure progress for secure web agents, we introduce WASP—a new publicly available benchmark for end-to-end evaluation of Web Agent Security against Prompt injection attacks. Evaluating with WASP shows that even top-tier AI models, including those with advanced reasoning capabilities, can be deceived by simple, low-effort human-written injections in very realistic scenarios. Our end-to-end evaluation reveals a previously unobserved insight: while attacks partially succeed in up to 86% of the case, even state-of-the-art agents often struggle to fully complete the attacker goals—highlighting the current state of security by incompetence."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme** : Les benchmarks existants sur-simplifient les menaces en testant des scenarios irrealistes ou donnent trop de pouvoir a l'attaquant (Section 1, p. 1)
- **Methode** : Benchmark end-to-end sur VisualWebArena (gitlab + reddit), 84 taches totales, attaquant en black-box avec controle limite d'elements de pages web (Section 3)
- **Donnees** : 21 objectifs attaquant x 2 objectifs utilisateur x 2 templates injection = 84 taches, testes sur GPT-4o, GPT-4o-mini, o1, Claude Sonnet 3.5/3.7 (Section 3-4, Table 2)
- **Resultat** : ASR-intermediate jusqu'a 85.7% (o1), mais ASR-end-to-end seulement 0-16.7% — "security by incompetence" (Section 4.2, Table 2, Fig. 1a)
- **Limite** : Focus exclusif sur agents web ; attaques manuelles simples sans optimisation adversariale (Section 5)

### Analyse critique
**Forces** :
- Threat model realiste : l'attaquant est un utilisateur adversariel d'un site web (pas le controleur du site), black-box, sans connaissance de l'implementation de l'agent (Section 2, Threat Model)
- Distinction cruciale ASR-intermediate vs ASR-end-to-end : revele que le hijacking initial est facile (17-86%) mais la completion de la tache malveillante est difficile (0-17%) (Table 2)
- Concept novateur de "security by incompetence" — la securite actuelle depend de l'incapacite de l'agent, pas de ses defenses (Section 4.2)
- Benchmark public, reproductible, compatible avec tout agent web generaliste (Section 3, Feature 3)
- Comparaison systematique entre 3 scaffoldings (VisualWebArena, CURI, Tool Calling) et 5 modeles (Table 2)
- Resultat contre-intuitif : instruction hierarchy (o1 Tool Calling) montre le PLUS HAUT ASR-intermediate (85.7%) avec aussi le plus haut ASR-end-to-end (16.7%) car l'agent plus capable complete aussi mieux les taches malveillantes (Table 2)

**Faiblesses** :
- Attaques manuelles uniquement — pas d'attaques optimisees par gradient (GCG) ou par LLM (PAIR, AutoDAN)
- N = 84 taches total est relativement petit pour des conclusions statistiques robustes
- Focus web seulement — transferabilite au domaine medical/industriel non demontree
- L'observation "security by incompetence" est un constat transitoire : les agents vont s'ameliorer, et l'ASR-end-to-end augmentera mecaniquement
- Pas de proposition de defense ; le benchmark mesure le probleme sans offrir de solution

**Questions ouvertes** :
- Comment evolue l'ASR-end-to-end quand les agents deviennent plus capables ?
- Les defenses de type firewall (P005) sont-elles efficaces dans le cadre WASP ?
- Un benchmark similaire est-il faisable pour des agents medicaux autonomes ?

### Formules exactes
- Aucune formule mathematique formelle
- Metriques definies operationnellement : ASR-intermediate (agent hijacke de son objectif), ASR-end-to-end (objectif attaquant complete), Utility (taches legitimes completees) (Section 3.4)

### Pertinence these AEGIS
- **Couches delta** : δ⁰ (RLHF des modeles testes, variable), δ¹ (system prompts defensifs testes, efficacite variable — Table 2), δ² (non le focus), δ³ (non discute)
- **Conjectures** :
  - C1 (insuffisance δ¹) : **Fortement supportee** — meme les modeles avances avec prompts defensifs sont vulnerables (ASR-intermediate > 50% pour Claude 3.7 avec system prompt, Table 2)
  - C2 (necessite δ³) : **Partiellement supportee** — le benchmark montre le probleme sans proposer de solution formelle
- **Decouvertes** : D-011 (security by incompetence) — decouverte originale du papier, implication directe pour AEGIS : l'amelioration des capacites agentiques augmentera mecaniquement les risques
- **Gaps** : G-003 (benchmark medical manquant), G-016 (correlation capacite/vulnerabilite)
- **Mapping templates AEGIS** : Les injections plain-text et URL du benchmark correspondent aux templates DPI #01-#20 ; les objectifs attaquant (password change, data theft) correspondent aux scenarios AEGIS

### Citations cles
> "While attacks partially succeed in up to 86% of the case, even state-of-the-art agents often struggle to fully complete the attacker goals—highlighting the current state of security by incompetence." (Abstract, p. 1)
> "We note however that the current limitations in agents' ability to fully execute attacks are unlikely to persist." (Section 5, Conclusion)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Haute — benchmark public, code open-source, VisualWebArena accessible |
| Code disponible | Oui (mentionne public availability, Section 3) |
| Dataset public | Oui (84 taches, WASP benchmark) |
