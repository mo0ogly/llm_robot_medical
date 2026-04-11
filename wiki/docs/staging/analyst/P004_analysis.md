# P004 : WASP -- Benchmarking Web Agent Security Against Prompt Injection Attacks

## [Evtimov et al., 2025] -- WASP: Benchmarking Web Agent Security Against Prompt Injection Attacks

**Reference :** arXiv:2504.18575v3
**Revue/Conf :** arXiv preprint (FAIR at Meta), 16 mai 2025
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P004_source.pdf](../../assets/pdfs/P004_source.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (67 chunks)

### Abstract original
> Autonomous UI agents powered by AI have tremendous potential to boost human productivity by automating routine tasks such as filing taxes and paying bills. However, a major challenge in unlocking their full potential is security, which is exacerbated by the agent's ability to take action on their user's behalf. Existing tests for prompt injections in web agents either over-simplify the threat by testing unrealistic scenarios or giving the attacker too much power, or look at single-step isolated tasks. To more accurately measure progress for secure web agents, we introduce WASP -- a new publicly available benchmark for end-to-end evaluation of Web Agent Security against Prompt injection attacks. Evaluating with WASP shows that even top-tier AI models, including those with advanced reasoning capabilities, can be deceived by simple, low-effort human-written injections in very realistic scenarios. Our end-to-end evaluation reveals a previously unobserved insight: while attacks partially succeed in up to 86% of the case, even state-of-the-art agents often struggle to fully complete the attacker goals -- highlighting the current state of security by incompetence.
> -- Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme :** Les benchmarks existants sur-simplifient les menaces en testant des scenarios irrealistes ou en donnant trop de pouvoir a l'attaquant, ou evaluent des taches isolees mono-etape (Evtimov et al., 2025, Section 1, p. 1)
- **Methode :** Benchmark end-to-end sur VisualWebArena (gitlab + reddit), 84 taches (21 objectifs attaquant x 2 objectifs utilisateur x 2 templates injection), attaquant en black-box avec controle limite d'elements de pages web (Evtimov et al., 2025, Section 3, p. 3-5)
- **Donnees :** Testes sur GPT-4o, GPT-4o-mini, o1, Claude Sonnet 3.5 v2, Claude Sonnet 3.7 Extended Thinking ; 3 scaffoldings (VisualWebArena, CURI, Tool Calling) ; 2 types d'injection (plain-text, URL) (Evtimov et al., 2025, Section 4, Table 2)
- **Resultat :** ASR-intermediate jusqu'a 85.7% (o1 Tool Calling avec instruction hierarchy), mais ASR-end-to-end seulement 0-16.7% -- "security by incompetence" ; Claude 3.5 avec system prompt : ASR-intermediate 51.2%, ASR-end-to-end 2.4% (Evtimov et al., 2025, Table 2, p. 6)
- **Limite :** Focus exclusif sur agents web ; attaques manuelles simples sans optimisation adversariale (GCG, PAIR, AutoDAN) ; N = 84 taches total (Evtimov et al., 2025, Section 5, p. 8)

### Analyse critique

**Forces :**

1. **Threat model realiste.** L'attaquant est un utilisateur adversariel d'un site web (pas le controleur du site), en black-box, sans connaissance de l'implementation de l'agent. C'est le scenario le plus realiste pour les agents web autonomes : l'attaquant ne peut que modifier des elements de page auxquels il a legitimement acces (commentaires, descriptions) (Evtimov et al., 2025, Section 2, Threat Model, p. 2).

2. **Distinction ASR-intermediate vs ASR-end-to-end.** Cette distinction est la contribution conceptuelle majeure du papier. L'ASR-intermediate mesure si l'agent est hijacke de son objectif initial (facile : 17-86%), tandis que l'ASR-end-to-end mesure si l'objectif malveillant est entierement complete (difficile : 0-17%). Cela revele que le hijacking initial est aise mais que la completion de taches multi-etapes malveillantes reste difficile pour les agents actuels (Evtimov et al., 2025, Table 2, Figure 1a, p. 6).

3. **Concept de "security by incompetence".** Le papier formalise l'observation que la securite actuelle des agents web repose sur leur incapacite a completer des taches complexes, pas sur des defenses effectives. C'est un constat transitoire : a mesure que les agents s'ameliorent, l'ASR-end-to-end augmentera mecaniquement (Evtimov et al., 2025, Section 4.2, p. 7 ; Section 5, Conclusion).

4. **Resultat contre-intuitif sur instruction hierarchy.** o1 avec Tool Calling et instruction hierarchy montre le PLUS HAUT ASR-intermediate (85.7%) et le plus haut ASR-end-to-end (16.7%). L'instruction hierarchy, censee proteger, ne reduit pas le hijacking initial et augmente l'ASR-end-to-end car l'agent plus capable complete aussi mieux les taches malveillantes (Evtimov et al., 2025, Table 2, p. 6). Ce resultat est critique pour AEGIS : la defense δ¹ (instruction hierarchy) peut etre contre-productive pour les agents.

5. **Analyses complementaires detaillees.** Le papier inclut des analyses sur les injections URL vs plain-text (Table 3 : URL injections plus efficaces en ASR-intermediate, e.g. o1 passe de 73.8% a 97.6% avec URL, p. 8) et sur les injections task-related vs task-agnostic (Table 4 : les prompts generiques restent dangereux, Claude passe de 50% a 32% mais reste non-nul, p. 8).

**Faiblesses :**

1. **Attaques manuelles uniquement.** Toutes les injections sont ecrites manuellement par des humains, sans optimisation adversariale (GCG, AutoDAN, PAIR) (Evtimov et al., 2025, Section 3.2, p. 4). Cela sous-estime probablement l'ASR reel : des attaques optimisees pourraient significativement augmenter l'ASR-end-to-end.

2. **N = 84 taches.** L'echantillon est modeste pour des conclusions statistiques robustes. Avec 84 taches reparties sur 12+ configurations (modele x scaffolding x defense), certaines cellules de Table 2 ont des effectifs tres limites. Pas d'intervalles de confiance ni de tests statistiques rapportes.

3. **Focus web exclusif.** La transferabilite au domaine medical ou industriel n'est pas demontree. Les agents web (navigation, formulaires) ont des surfaces d'attaque differentes des agents medicaux (prescriptions, diagnostics, commandes de robot).

4. **Observation transitoire.** Le "security by incompetence" est un constat date : les agents progressent rapidement (Claude Computer Use, operator agents). L'ecart ASR-intermediate vs ASR-end-to-end se reduira mecaniquement.

5. **Pas de proposition de defense.** Le benchmark mesure le probleme sans offrir de solution. Les defenses evaluees (system prompt, instruction hierarchy) sont pre-existantes et montrees insuffisantes.

**Questions ouvertes :**
- Comment evolue l'ASR-end-to-end quand les agents deviennent plus capables (Claude 4, GPT-5) ?
- Les defenses de type firewall pre-inference (P025, DMPI-PMHFE) sont-elles efficaces dans le cadre WASP ?
- Un benchmark WASP-Medical est-il realisable pour les agents medicaux autonomes (Da Vinci Xi) ?

### Formules exactes

Aucune formule mathematique formelle dans le papier.

**Metriques definies operationnellement** (Evtimov et al., 2025, Section 3.4, p. 5) :
- **ASR-intermediate** : proportion de taches ou l'agent est hijacke de son objectif initial (premiere action vers l'objectif attaquant)
- **ASR-end-to-end** : proportion de taches ou l'objectif attaquant est entierement complete
- **Utility** : proportion de taches legitimes completees correctement (mesure l'impact sur les performances normales)

**Donnees cles Table 2** (Evtimov et al., 2025, p. 6) :
| Configuration | ASR-interm. | ASR-e2e | Utility |
|---|---|---|---|
| GPT-4o VWA axtree (no defense) | 0.321 | 0.012 | 0.595 |
| GPT-4o VWA axtree + system prompt | 0.167 | 0.000 | 0.459 |
| o1 Tool Calling instr. h. (system) | 0.857 | 0.167 | 0.486 |
| Claude 3.5 CURI (no defense) | 0.583 | 0.060 | 0.081 |
| Claude 3.5 CURI + system prompt | 0.512 | 0.024 | 0.027 |
| Claude 3.7 CURI (no defense) | 0.536 | 0.036 | 0.486 |

Lien glossaire AEGIS : F22 (ASR -- etendu en ASR-intermediate et ASR-end-to-end)

### Pertinence these AEGIS

- **Couches delta :** δ⁰ (RLHF des modeles testes, variable selon le modele) ; δ¹ (system prompts defensifs testes explicitement -- efficacite variable selon Table 2 : GPT-4o passe de 0.321 a 0.167 ASR-interm. avec system prompt, mais Claude 3.5 passe seulement de 0.583 a 0.512) ; δ² (non le focus du papier) ; δ³ (non discute)
- **Conjectures :**
  - C1 (insuffisance δ¹) : **fortement supportee** -- meme les modeles avances avec prompts defensifs et instruction hierarchy restent vulnerables. o1 avec instruction hierarchy a le PLUS HAUT ASR-intermediate (85.7%), ce qui montre que δ¹ est potentiellement contre-productif pour les agents (Evtimov et al., 2025, Table 2)
  - C2 (necessite δ³) : **partiellement supportee** -- le benchmark montre le probleme sans proposer de solution formelle, mais l'echec des defenses empiriques (system prompt, instruction hierarchy) plaide pour des garanties architecturales
- **Decouvertes :**
  - D-011 (security by incompetence) : **decouverte originale** du papier, implication directe pour AEGIS : l'amelioration des capacites agentiques augmentera mecaniquement les risques de securite
  - D-016 (correlation capacite/vulnerabilite) : les agents les plus capables (o1) ont le plus haut ASR-end-to-end (16.7%), confirmant que la capacite amplifie le risque
- **Gaps :**
  - G-003 (benchmark medical manquant) : **non adresse** -- focus web exclusif
  - G-016 (correlation capacite/vulnerabilite) : **partiellement adresse** -- docummente sans expliquer mecanistiquement
- **Mapping templates AEGIS :** Les injections plain-text et URL du benchmark correspondent aux templates DPI #01-#20. Les objectifs attaquant (password change, data theft, message posting) correspondent aux scenarios AEGIS d'exfiltration et de manipulation.

### Citations cles
> "While attacks partially succeed in up to 86% of the case, even state-of-the-art agents often struggle to fully complete the attacker goals -- highlighting the current state of security by incompetence." (Evtimov et al., 2025, Abstract, p. 1)
> "We note however that the current limitations in agents' ability to fully execute attacks are unlikely to persist." (Evtimov et al., 2025, Section 5, Conclusion, p. 8)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Haute -- benchmark public, code open-source (mentionne Section 3), VisualWebArena accessible, taches et templates publies |
| Code disponible | Oui (mentionne public availability, Section 3) |
| Dataset public | Oui (84 taches, WASP benchmark, VisualWebArena) |
| Nature epistemique | [EMPIRIQUE] -- benchmark avec evaluation experimentale multi-modeles, sans contribution formelle ni garantie theorique |
