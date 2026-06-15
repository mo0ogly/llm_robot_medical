## [Rostamzadeh, Narula, Birhan, et al., 2026] — MCP-DPT : taxonomie de placement des défenses pour la sécurité du Model Context Protocol

**Reference :** arXiv:2604.07551 [cs.CR]
**Revue/Conf :** arXiv preprint 2026, soumis avril 2026, non encore publié en conférence/journal
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P166_Rostamzadeh_2026_MCPDefensePlacementTaxonomy.pdf](../../literature_for_rag/P166_Rostamzadeh_2026_MCPDefensePlacementTaxonomy.pdf)
> **Statut**: [PREPRINT] — lu en texte complet, 25 pages (intégralité des sections 1-6, Appendice A, références)

---

### Abstract original

> The Model Context Protocol (MCP) enables large language models (LLMs) to dynamically discover and invoke third-party tools, significantly expanding agent capabilities while introducing a distinct security landscape. Unlike prompt-only interactions, MCP exposes pre-execution artifacts, shared context, multi-turn workflows, and third-party supply chains to adversarial influence across independently operated components. While recent work has identified MCP-specific attacks and evaluated defenses, existing studies are largely attack-centric or benchmark-driven, providing limited guidance on where mitigation responsibility should reside within the MCP architecture. This is problematic given MCP's multi-party design and distributed trust boundaries. We present a defense-placement-oriented security analysis of MCP, introducing a layer-aligned taxonomy that organizes attacks by the architectural component responsible for enforcement. Threats are mapped across six MCP layers, and primary and secondary defense points are identified to support principled defense-in-depth reasoning under adversaries controlling tools, servers, or ecosystem components. A structured mapping of existing academic and industry defenses onto this framework reveals uneven and predominantly tool-centric protection, with persistent gaps at the host orchestration, transport, and supply-chain layers. These findings suggest that many MCP security weaknesses stem from architectural misalignment rather than isolated implementation flaws.
> — Source : PDF page 1

---

### Résumé (5 lignes)

- **Problème :** Les études MCP existantes sont "attack-centric" — elles disent *comment* les attaques réussissent mais pas *où* les défenses doivent être déployées dans l'architecture distribuée MCP, laissant les praticiens sans guide de responsabilité par couche. (Section 1, p. 1-2)
- **Méthode :** Revue structurée de la littérature MCP 2025-2026 (benchmarks, threat analyses, ecosystem surveys). Chaque attaque est assignée à la couche MCP où la prévention est "earliest enforceable", puis à une couche secondaire (fallback). L'efficacité des défenses est mesurée en *capability-based coverage* (non empirique). (Section 3, p. 5-6 ; Section 4.4, p. 10)
- **Données :** 49 attaques MCP inventoriées (Appendice A), 13 mécanismes de défense académiques et industriels évalués, 6 couches architecturales définies. (Table 2, p. 11 ; Section 3, p. 5)
- **Résultat :** La couverture défensive est fortement asymétrique : Registry/Supply-chain atteint 100% (ToolHive) ; Transport/Network est quasi-inexistant (0% pour 12 des 13 outils, 50% pour MCP-Gateway seulement) ; la couche Model Provider/LLM Alignment culmine à 44% (MCIP-Guardian, MCP-Guard). (Table 4, p. 16)
- **Limite :** Coverage = capacité architecturale, pas précision empirique de détection ; l'analyse ne valide pas les défenses contre des attaquants adaptatifs réels ; le scope exclut les protocoles non-MCP. (Section 5, p. 15-16)

---

### Analyse critique

**Forces :**

- **Originalité du cadrage.** Première taxonomie MCP centrée sur le *placement* des défenses plutôt que sur les techniques d'attaque. Table 1 (p. 7) démontre formellement que les 6 travaux comparables (MCPSecBench, MSB, MCP-SafetyBench, MCPLib, "When MCP Servers Attack", MCIP) n'assignent *aucun* d'eux la responsabilité d'enforcement à des composants architecturaux spécifiques. La distinction primaire/secondaire (Section 3.3-3.4, p. 9-10) est non triviale : elle reconnaît qu'une couche peut "see" l'attaque mais ne pas avoir l'autorité pour la stopper, ce qui distingue la détection de la prévention.

- **Taxonomie en 6 couches opérationnellement ancrée.** Les 6 couches (Model Provider/LLM Alignment, MCP Host/Application, MCP Client/SDK, MCP Server/Tool Execution, Transport/Network, Registry/Marketplace & Supply-Chain) correspondent aux frontières de confiance réelles et aux rôles de propriété dans les déploiements MCP multi-parties. Chaque couche est définie formellement avec son périmètre de contrôle (Sections 3.1.1-3.1.6, p. 7-9).

- **Coverage quantifiée par couche.** Table 4 (p. 16) donne des pourcentages précis par (défense, couche) — e.g., MCP-Scan : Registry 83%, Host 8%, Transport 0% — permettant une comparaison structurée des gaps. C'est la première vue croisée de ce type dans la littérature MCP selon les auteurs (Section 2.4, p. 4).

- **Appendice A exhaustif** (49 définitions d'attaques, pp. 17-25) avec mécanisme, objectif adversarial et vecteur primaire pour chaque classe : référence utilisable pour le mapping AEGIS.

**Faiblesses :**

- **Pas de validation empirique.** La coverage est *capability-based* : "A defense is considered to cover an attack class if it can reasonably detect, block, or constrain that class under commonly assumed MCP threat models" (Section 4, p. 10). Aucune expérience ne vérifie si MCP-Gateway détecte réellement 50% des attaques Transport. Ce choix est revendiqué mais il rend les pourcentages Table 4 plus proches de scores d'*architecture review* que de métriques empiriques.

- **Biais de sélection des défenses.** Les 13 mécanismes sont majoritairement des outils industriels récents (Invariant Labs, Lasso, Stacklok, Cisco) sans peer-review indépendant. Les auteurs appliquent leur jugement subjectif sur les capacités de chaque outil — aucune procédure d'accord inter-juges n'est décrite.

- **Absence d'analyse temporelle.** Les MCP servers subissent des mises à jour silencieuses (rug-pull). La taxonomy capture un snapshot 2025-2026 mais ne traite pas la demi-vie des défenses.

- **Couche "Model Provider/LLM Alignment" peu actionnelle.** Les auteurs reconnaissent que les défenses à ce niveau (RLHF, refusal logic) sont difficiles à enforcer par les praticiens. 44% de couverture maximum mais aucune recommandation concrète au-delà de "strengthen alignment" (Section 5, p. 15).

**Questions ouvertes :**

- Comment mesurer empiriquement la coverage pour valider les scores Table 4 ?
- La taxonomy est-elle stable à l'ajout de nouveaux protocoles concurrents (A2A, ANP) cités en [2] ?
- Peut-on formaliser la notion de "earliest enforceable boundary" comme propriété vérifiable d'un système MCP ?

---

### Formules exactes

[taxonomie — pas de formule mathématique formelle]

La contribution principale est la taxonomie MCP-DPT, définie comme suit (Section 3, pp. 5-9) :

**Dimensions de la taxonomie (pour chaque attaque) :**
1. **Attack** — technique adversariale spécifique (parmi 49 classes, Appendice A)
2. **Primary Defense Layer** — "the earliest architectural boundary where meaningful prevention can be enforced with sufficient authority and visibility" (Section 3.3, p. 9)
3. **Secondary Defense Layer** — "defense-in-depth by limiting the impact and propagation of an attack when the primary defense layer fails" (Section 3.4, p. 10)

**6 couches architecturales (ordre d'autorité croissante côté "surface d'entrée") :**

| Couche | Abrév. (Table 4) | Périmètre de contrôle |
|--------|-----------------|----------------------|
| Model Provider / LLM Alignment | MP/LA | Politique d'alignement, RLHF, refusal logic, training integrity |
| MCP Host / Application | MH/A | Médiateur entre sorties LLM et exécution outil ; gouverne execution state, capability exposure, orchestration logic |
| MCP Client / SDK | MC/S | Runtime SDK : parsing protocole, construction requêtes, interprétation réponses |
| MCP Server / Tool Execution | MS/TE | Runtime d'exécution des outils : auth, isolation, API exposure |
| Transport / Network | T/N | Canal de communication JSON-RPC : authentification endpoints, intégrité messages, session binding |
| Registry / Marketplace & Supply-Chain | R/M&SC | Découverte, distribution, versioning, provenance des serveurs/outils MCP |

**4 types de défense orthogonaux (Table 3, p. 14) :**
- Static/Pre-Execution : analyse métadonnées et configs avant runtime
- Behavior/Runtime : monitoring et contrainte des interactions pendant exécution
- Isolation/Architectural : enforcement de frontières de confiance via couches de médiation
- Decision-Level : protection du processus interne de sélection/paramétrage d'outils du LLM

**Exemple canonique (Figure 1, p. 10 — rug pull attack) :**
- Primary defense : Registry/Supply-Chain (validation statique au moment d'enregistrement)
- Secondary defense : MCP Host/Application (détection comportementale au runtime après que la confiance est établie)

---

### Pertinence thèse AEGIS

**Couches delta :**

- **δ²** (couche système / middleware) : la taxonomie est principalement pertinente à δ² — les défenses aux couches Host/Application, Client/SDK, Transport/Network sont exactement des contrôles "entre le prompt et l'exécution de l'outil". La notion de "earliest enforceable boundary" est une formalisation directe du problème δ² : où placer la validation dans la chaîne de traitement.
- **δ³** (couche agentic / multi-agent) : les classes d'attaques Multi-Tool Cooperation/Propagation, Agent Communication Poisoning, Goal Hijack opèrent à δ³. La secondary defense "Host" pour ces attaques signale que δ³ doit être sécurisé depuis la couche orchestrateur.
- **δ⁰** (alignement LLM) : la couche Model Provider/LLM Alignment correspond à δ⁰. La coverage maximale de 44% à cette couche (MCIP-Guardian, MCP-Guard) indique que les défenses purement δ⁰ sont insuffisantes — résultat convergent avec Zverev et al. (2025, ICLR).

**Conjectures C2 et MC8/MC9 :**

- **C2 (placement d'une couche de validation)** : MCP-DPT apporte une preuve structurelle à C2. La Table 4 montre que 0% des 13 outils couvrent le Transport/Network (sauf MCP-Gateway à 50%) et que le Host/Application culmine à 38% (MCP-Gateway). Cela confirme que les déploiements actuels *ne* placent *pas* la couche de validation au bon endroit. C2 est **supportée** par cet état de l'art : la lacune existe, le bénéfice d'une couche correctement positionnée est documenté.

- **MC8/MC9 (MCP supply-chain, Da Vinci)** : la couche Registry/Marketplace & Supply-Chain dans MCP-DPT est précisément le vecteur MC8/MC9. ToolHive atteint 100% de coverage registry mais 0% sur Model Provider et Transport — ce profil asymétrique indique qu'une défense supply-chain seule est insuffisante pour MC8/MC9 qui peuvent combiner rug-pull (registry) + tool poisoning (server) + cross-context propagation (host).

**Découvertes :**

- Confirme D-XXX (gaps architecturaux MCP) : la coverage 0% Transport/Network est un gap structurel, pas un simple manque d'implémentation — "defenses are often deployed where implementation is easiest rather than where authority and visibility are sufficient" (Section 6, p. 16).
- Nuance la portée des défenses δ⁰ (RLHF/refusal) : coverage maximale 44% à la couche MP/LA, ce qui implique que les garanties d'alignement ne se transfèrent pas à l'écosystème MCP distribué.

**Gaps adressés et créés :**

- **Gap10 (couverture défensive MCP)** : adressé partiellement — la taxonomy fournit le cadre pour mesurer Gap10, mais les chiffres Table 4 sont capability-based, non empiriques. Une campagne AEGIS mesurant les ASR réels contre chacune des 13 défenses comblerait Gap10 empiriquement.
- **Nouveau gap créé** : absence de défenses décision-level (Section 4.6, p. 15) — "Only MindGuard and AIM-Guard-MCP are marked under Decision-Level, underscoring how uncommon defenses are that directly protect the LLM's internal decision-making process." Ce gap (sélection/paramétrage d'outils) n'est pas couvert dans la liste de gaps AEGIS actuels.

**Mapping templates AEGIS :**

Les attaques Tool Poisoning, Goal Hijack, Prompt Leakage (Appendice A, pp. 17-21) correspondent aux vecteurs δ² IPI (Indirect Prompt Injection) du catalogue AEGIS. Les templates à mapping direct : vecteurs supply-chain (MC8), vecteurs context-injection (IPI cross-server), vecteurs credential-theft. La primary defense "Host/Application" pour Goal Hijack confirme l'intérêt d'une défense au niveau orchestrateur dans l'architecture AEGIS (routes de validation dans FastAPI backend, couche RagSanitizer).

---

### Citations clés

> "While recent work has identified MCP-specific attacks and evaluated defenses, existing studies are largely attack-centric or benchmark-driven, providing limited guidance on where mitigation responsibility should reside within the MCP architecture." (Section 1, p. 1)

> "By explicitly aligning each attack with the component that must enforce its defense, this perspective yields a more actionable understanding of vulnerabilities, clarifies the boundaries of responsibility, and enables more effective and targeted mitigation strategies." (Section 3, p. 5)

> "Transport/Network layer is almost entirely undefended: all tools except MCP-Gateway (50%) report 0% coverage, and host-side orchestration peaks at only 38% via MCP-Gateway." (Section 4.8, p. 15-16)

> "Many MCP security weaknesses stem from architectural misalignment rather than isolated implementation flaws." (Section 1 abstract, p. 1 ; Section 6, p. 16)

> "Decision-level defenses are rare but semantically powerful. Only MindGuard and AIM-Guard-MCP are marked under Decision-Level, underscoring how uncommon defenses are that directly protect the LLM's internal decision-making process." (Section 4.6, p. 15)

> "The registry layer, for instance, can only evaluate static metadata at submission time, whereas malicious behavior may only manifest at runtime within the host layer." (Section 3.5, p. 10)

> "A defense is considered to cover an attack class if it can reasonably detect, block, or constrain that class under commonly assumed MCP threat models and deployment conditions." (Section 4, p. 10)

---

### Classification

| Champ | Valeur |
|-------|--------|
| Type | [SURVEY/TAXONOMIE] — review structurée + taxonomy originale + coverage analysis |
| SVC pertinence AEGIS | 8/10 — taxonomie directement applicable au placement de défenses dans l'architecture AEGIS |
| Reproductibilité | Moyenne — taxonomy qualitative, coverage basée sur jugement expert sans protocole inter-juges, non empirique |
| Code disponible | Non mentionné dans le papier |
| Dataset public | Table 2 (49 attaques × 13 défenses) et Table 4 (coverage %) dans le PDF |
| Couches delta | δ² (primaire), δ³ (secondaire), δ⁰ (tertiaire) |
| Conjectures | C2 (supportée structurellement) ; MC8/MC9 (enrichis — supply-chain gap quantifié) |
| Gaps | Gap10 (adressé — framework fourni, empirique manquant) ; nouveau gap decision-level à créer |
| Statut | [PREPRINT] — arXiv:2604.07551, avril 2026, Old Dominion University |
| Positionnement vs P155 | Complémentaire : P155 (Huang) = threat modeling STRIDE+DREAD (quelles menaces) ; P166 = defense placement (où enforcer les contre-mesures). Les deux ensemble couvrent le cycle complet threat→defense. |
