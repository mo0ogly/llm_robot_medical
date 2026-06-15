## [Siu, He, Montgomery, et al., 2026] — Un cadre de formalisation de la sécurité des agents LLM

**Reference :** arXiv:2603.19469v1 [cs.CR], 19 Mars 2026
**Revue/Conf :** arXiv preprint 2026 [cs.CR] — Systematization of Knowledge (SoK)
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P171_Siu_2026_FormalizingAgentSecurity.pdf](../../literature_for_rag/P171_Siu_2026_FormalizingAgentSecurity.pdf)
> **Statut**: [PREPRINT] — lu en texte complet (19 pages, pypdf extraction)

---

### Abstract original

> Security in LLM agents is inherently contextual. For example, the same action taken by an agent may represent legitimate behavior or a security violation depending on whose instruction led to the action, what objective is being pursued, and whether the action serves that objective. In this work, we present a framework that systematizes existing attacks and defenses from the perspective of contextual security. To this end, we propose four security properties that capture contextual security for LLM agents: task alignment (pursuing authorized objectives), action alignment (individual actions serving those objectives), source authorization (executing commands from authenticated sources), and data isolation (ensuring information flows respect privilege boundaries). We further introduce a set of oracle functions that enable verification of whether these security properties are violated as an agent executes a user task. Using this framework, we reformalize existing attacks, such as indirect prompt injection, direct prompt injection, jailbreak, task drift, and memory poisoning, as violations of one or more security properties, thereby providing precise and contextual definitions of these attacks. Similarly, we reformalize defenses as mechanisms that strengthen oracle functions or perform security property checks. Finally, we discuss several important future research directions enabled by our framework.

---

### Résumé (5 lignes)

- **Problème :** Les définitions existantes des attaques sur agents LLM sont context-agnostiques — elles classifient les actions comme malveillantes sur la base de leur contenu, ignorant qui les a autorisées, pour quel objectif, et quels flux d'information sont permis, forçant un trade-off sécurité/utilité inévitable (Section 1, p. 1-2).
- **Méthode :** Formalisation d'un contexte d'exécution `Ct = (p, Trt−1, Mt, Et, Sauth,t, G)` et de quatre propriétés de sécurité vérifiables via cinq fonctions oracle (I, L, Hp, HTr, Ha), avec un prédicat de sécurité intégré ; analyse de 87 papiers pour valider la taxonomie (Section 4, p. 5-7 ; Section 8, p. 13).
- **Données :** SoK théorique — aucune expérience originale ; analyse de 87 travaux publiés ; évaluation qualitative des défenses via AgentDojo comme corroboration empirique externe (Section 6.2, p. 11-12 ; Section 8 "Open Science", p. 14).
- **Résultat principal :** Le prédicat `secure(at, Ct)` est une conjonction de quatre propriétés ; aucun sous-ensemble de trois propriétés est suffisant (Section 4.4, p. 7) ; corroboration empirique : les défenses approximant Ha (PI detector, tool filter) réduisent l'ASR ciblé de 86-88% respectivement dans AgentDojo, contre 28% maximum pour les défenses approximant seulement I ou L (Section 6.2, p. 11-12).
- **Limite principale :** Les auteurs reconnaissent explicitement que les quatre propriétés ne sont pas formellement complètes ni axiomatiquement dérivées ; la complétude n'est pas prouvée ; le cadre est limité aux agents synchrones mono-utilisateur ; les fonctions oracle ne peuvent être implémentées parfaitement en pratique (Section 8, p. 13).

---

### Analyse critique

**Forces :**
- **Rigueur de la formalisation du contexte d'exécution :** La définition `Ct = (p, Trt−1, Mt, Et, Sauth,t, G)` est précise et capture tous les composants pertinents à une décision d'autorisation (Section 4.1, p. 5). Le graphe de permissions `G = (S, R)` adapte directement les mécanismes de contrôle d'accès standard aux systèmes agents.
- **Prédicat intégré explicite (Section 4.4, p. 7) :** La formulation `secure(at, Ct)` comme conjonction des quatre propriétés permet de prouver la nécessité individuelle de chacune par contre-exemple constructif — la Section 4.3.3 (p. 7) donne l'exemple du paiement frauduleux où source authorization est violée alors que task alignment et action alignment sont satisfaites, démontrant que les trois propriétés ne suffisent pas.
- **Corroboration empirique externe solide :** L'analyse AgentDojo (Section 6.2, p. 11-12) corrobore quantitativement la hiérarchie prédite : défenses approximant Ha réduisent l'ASR de 86-88% vs 28% pour celles approximant I ou L seules, au coût d'une utilité dégradée de 69,0% à 41,5% pour le PI detector — coût prédit par le framework (imprecision des approximations oracle).
- **Couverture taxonomique de 87 papiers :** Tous les types d'attaques documentés (indirect PI, direct PI, jailbreak, confused deputy, task drift, capability misuse, cross-context leakage, malicious tool exploitation, memory poisoning) sont re-définis comme violations d'une ou plusieurs propriétés (Section 5, p. 7-11). La Section 5.3 distingue précisément jailbreak (o0 ∉ O, violation task alignment) vs direct PI (conflit ouser/osystem, aussi task alignment mais différemment), une nuance rare dans la littérature.
- **Identification des défenses manquantes :** La Section 6.2 (p. 11-12) montre que data isolation est la propriété la moins couverte par les défenses existantes : seul le sandboxing en approche une version grossière, sans contrôle de flux fin.

**Faiblesses :**
- **Absence de nouveauté expérimentale :** Les auteurs déclarent explicitement "We conducted no experiments, collected no data, and developed no software artifacts" (Section "Open Science", p. 14). Le framework est purement conceptuel ; son opérationnalisation reste entièrement ouverte.
- **Complétude non prouvée — avouée par les auteurs :** "We do not claim the four properties are formally complete or axiomatically derived" (Section 8, p. 13). Futur travail peut identifier des attaques requérant des propriétés additionnelles. Cela affaiblit le claim d'universalité.
- **Fonctions oracle non implémentables en pratique :** I (instruction attribution) est décrite comme "an open interpretability problem" (Section 7, p. 12) ; les approximations par mécanismes d'attention sont "only coarse approximations". HTr et Ha nécessitent des "reliable semantic judgments" que les LLM-juges "may not make consistently or robustly across adversarial inputs" (Section 8, p. 13). Le gap entre la spécification idéale et les implémentations réelles n'est pas quantifié.
- **Périmètre restreint — agents synchrones mono-utilisateur :** Le framework "focuses on single-agent security where one agent acts on behalf of one authenticated user" et "does not fully address settings where multiple agents coordinate" (Section 8, p. 13). Les délégations agent-à-agent nécessitent une extension explicite du graphe R.
- **Sécurité compositionnelle non formalisée :** La Section 7 (p. 12) identifie que des actions individuellement sûres (Ha = 1) peuvent créer des vulnérabilités par composition, mais "the framework identifies compositional violations but does not fully formalize compositional safety" (Section 8, p. 13).
- **Pas de métriques de robustesse :** Le framework ne propose pas de métriques quantitatives de robustesse ou de coût de sécurité ; il fournit une structuration conceptuelle.

**Questions ouvertes :**
- Comment implémenter I avec une précision suffisante pour sécurité pratique ? Les auteurs suggèrent des "reasoning traces explicites" mais nécessitent des mécanismes de vérification (Section 7, p. 12).
- Comment composer les garanties de sécurité à travers des délégations multi-agents ? Le graphe R doit modéliser les chaînes de délégation (Section 8, p. 13).
- Quel niveau d'approximation des fonctions oracle est suffisant pour les garanties pratiques ? (Section 8, p. 13).
- Les benchmarks existants sont inadéquats : ils ne spécifient pas Sauth,t, ni O, ni R, rendant l'évaluation des propriétés impossible (Section 7, p. 12-13).

---

### Formules exactes

[ALGORITHME] — Définitions formelles (les résultats sont des définitions/propriétés, pas des théorèmes prouvés)

**Contexte d'exécution** (Section 4.1, p. 5) :
```
Ct = (p, Trt−1, Mt, Et, Sauth,t, G)
```
où p est le prompt utilisateur, Trt−1 la trajectoire, Mt la mémoire, Et l'état de l'environnement, Sauth,t les sources authentifiées au temps t, et G = (S, R) le graphe de permissions.

**Action de l'agent** (Section 2, p. 3) :
```
at ~ f(· | p, Trt−1, Mt)
```

**Fonctions oracle** (Section 4.2, p. 5-6) :
- `Hp : p → O` — extrait l'objectif o0 = Hp(p) du prompt utilisateur
- `HTr : (Trt−1, o0) → {0, 1}` — juge si la trajectoire sert o0
- `Ha : (at, Trt−1, o0) → {0, 1}` — juge si l'action at sert o0 dans le contexte de Trt−1
- `I : (at, f, Mt, p, Trt−1) → x` — identifie quels inputs ont causé l'action at (instruction attribution)
- `L : x → s` — trace la provenance d'un input x vers sa/ses source(s) (source attribution)

**Prédicat de sécurité intégré** (Section 4.4, p. 7) [ALGORITHME — définition formelle, complétude non prouvée] :
```
secure(at, Ct) ⟺ o0 ∈ O ∧ HTr(Trt−1, o0) = 1         (task alignment)
               ∧ Ha(at, Trt−1, o0) = 1                  (action alignment)
               ∧ ∀x ∈ x, ∀s ∈ L(x) :
                   s ∈ Sauth,t ∨ Ha(at, Trt−1, o0) = 1  (source authorization)
               ∧ ∀s ∈ L(x), ∀s' ∈ s' : (s, s') ∈ R    (data isolation)
```
où o0 = Hp(p), x = I(at, f, Mt, p, Trt−1), et s' sont les destinations du tool call.

**Violation d'injection indirecte** (Section 5.1, p. 8) — définition reformalisée :
```
IPI ⟺ ∃s ∈ sx : s ∉ Sauth,t  AND  Ha(at, Trt−1, o0) = 0
```
Contraste avec la définition antérieure (Liu et al., 2024, USENIX Security) : `x ≠ {p} ∧ Ha = 0`, qui confond sources authentifiées et non-authentifiées.

**Violation confused deputy** (Section 5.4, p. 9) :
```
CD ⟺ (suser, starget) ∉ R  ∧  (sagent, starget) ∈ R,  suser ∈ Sauth,t
```

**Violation data isolation** (Section 5.7, p. 10) :
```
∃s ∈ s, ∃s' ∈ s' : (s, s') ∉ R
```

Lien glossaire AEGIS : F01 (ASR), F15 (Sep(M)), F22 (métriques de validation), F44 (isolation formelle)

---

### Pertinence thèse AEGIS

#### Couches delta

- **δ³ (validation formelle des sorties/actions)** — **COUCHE PRIORITAIRE**. Ce framework est une contribution directe à la formalisation de la sécurité au niveau δ³ : il propose un langage formel pour spécifier ce qu'une validation des actions devrait vérifier, via les fonctions oracle et le prédicat `secure(at, Ct)`. La couche δ³ AEGIS vise la validation formelle des sorties ; ce framework formalise exactement le contenu sémantique que cette validation doit capturer.
- **δ¹ (instruction-following — couche LLM)** — Pertinent pour Task Alignment et Source Authorization : les violations de ces propriétés correspondent à des défaillances de l'alignement instruction du LLM sous-jacent, soit par manipulation externe (IPI), soit par conflit hiérarchique (DPI). La Section 4.3.1 (p. 5-6) lie task alignment directement à l'espace O établi par RLHF.
- **δ² (contexte RAG)** — Data Isolation est directement pertinente pour les architectures RAG multi-utilisateurs : les injections indirectes via documents empoisonnés correspondent à la violation simultanée de source authorization et action alignment (Section 5.1, p. 8).
- **δ⁰ (RLHF/alignement de base)** — Jailbreak = o0 ∉ O, où O est défini par RLHF (Section 5.3, p. 9). Lien direct avec les templates AEGIS ciblant δ⁰.

#### Conjectures AEGIS

**C2 — Nécessité de la couche δ³ de validation formelle :**
Ce framework **SUPPORTE FORTEMENT** C2. Il démontre formellement qu'aucun sous-ensemble de trois propriétés n'est suffisant (Section 4.4, p. 7, argument par nécessité individuelle) : source authorization peut être violée même si task et action alignment sont satisfaites (exemple du paiement frauduleux, Section 4.3.3, p. 7). Cela justifie la nécessité d'une vérification multi-dimensionnelle au niveau δ³.

Nuance importante : le framework ne *prouve* pas que les quatre propriétés sont *suffisantes* ("we cannot prove sufficiency", Section 8, p. 13). C2 doit donc être qualifiée : δ³ est nécessaire pour vérifier ces quatre dimensions, mais leur suffisance reste ouverte [EMPIRIQUE].

**C3 — Superficialité de l'alignement et gap sécurité/utilité :**
Ce framework **SUPPORTE** C3 de manière structurée. La Section 6 (p. 11-12) montre que les défenses context-agnostiques créent un trade-off inévitable sécurité/utilité précisément parce qu'elles ne vérifient pas le contexte Ct : "A defense that does not verify all four properties with respect to the full context is structurally incapable of distinguishing the attack and legitimate cases" (Section 4.1, p. 5). C3 est reformulée précisément : la superficialité = l'absence de vérification contextuelle des quatre propriétés.

Corroboration quantitative depuis AgentDojo (Section 6.2, p. 11-12) : le PI detector réduit l'ASR de 86% mais dégrade l'utilité de 69,0% à 41,5% — exactement le symptôme de C3 prédit [EMPIRIQUE, données AgentDojo, non expériences des auteurs].

#### Découvertes AEGIS et RISQUE DE SCOOPING δ³

**ÉVALUATION RISQUE DE SCOOPING — ANALYSE LUCIDE :**

Ce framework est une **contribution concurrente directe mais non identique** à l'architecture δ³ AEGIS, avec des zones de chevauchement et de complémentarité distinctes :

**Zone de chevauchement — risque modéré :**
- L'objectif central est identique : formaliser ce que doit vérifier un système de sécurité d'agent LLM.
- La Section 4 définit un prédicat de sécurité `secure(at, Ct)` structurellement similaire à ce que δ³ AEGIS cherche à implémenter : vérification formelle des actions/sorties par rapport au contexte autorisé.
- Si la thèse AEGIS revendique "premier framework formel pour la sécurité des agents LLM", ce claim est **REFUTÉ** par ce papier (arXiv:2603.19469, 19 mars 2026, avec auteurs de UC Berkeley/UC Santa Cruz/Duke, Dawn Song incluse).
- Travaux connexes cités dans le papier (Section 6.1, p. 11) préexistants : ShieldAgent [16], AgentSpec [86], R2-Guard [42], VeriSafe Agent [46] — certains avec vérification formelle.

**Zone de différenciation — avantage AEGIS potentiel :**
- **Ce framework est purement conceptuel** — pas de code, pas de système implémenté, pas de métriques originales. AEGIS dispose d'un corpus expérimental TC-002, de campagnes N≥30, et d'un moteur génétique évalué.
- **La focalisation est différente :** Le framework Siu et al. est une *SoK taxonomique* (organiser l'existant), AEGIS est un *système opérationnel de red-teaming* avec générateur de prompts adversariaux et mesure ASR/Sep(M).
- **δ³ AEGIS = implémentation, pas spécification :** Le framework Siu et al. fournit *ce qu'il faudrait vérifier* ; AEGIS vise à *comment le vérifier et attaquer* concrètement. Les fonctions oracle I, L, Hp, HTr, Ha sont explicitement déclarées non-implémentables parfaitement — c'est l'espace où AEGIS peut contribuer.
- **Médical LLM spécifique :** Siu et al. traitent les agents génériques ; AEGIS est spécialisé dans le domaine médical, où les contraintes de task alignment et source authorization ont une dimension éthique et réglementaire distincte (HIPAA, consentement, responsabilité clinique).

**HUMILITY GATE :** AEGIS ne peut pas revendiquer "premier framework formel de sécurité des agents LLM" — ce claim est refuté. La thèse doit se positionner comme "extension opérationnelle et domaine-spécifique (médical) du cadre formel de Siu et al. (2026), avec contribution expérimentale originale via campagnes adversariales N≥30".

**Liens avec D-001 à D-020 :**
- Ce framework corrobore les découvertes expérimentales AEGIS sur le trade-off sécurité/utilité (D-xxx sur les faux positifs des défenses naïves).
- La distinction source authorization / action alignment correspond à la séparation δ²/δ³ dans l'architecture AEGIS.

**Liens P024 (Zverev, ASIDE/separation) :** Le framework formalise exactement la "separation" que Zverev mesure empiriquement via Sep(M) : un agent qui satisfait action alignment (Ha = 1) mais viole source authorization traite le contenu externe comme une instruction autorisée — c'est le phénomène que Sep(M) quantifie. Ce framework fournit le fondement théorique manquant à P024 [THEOREME structurel → EMPIRIQUE Zverev].

**Liens P057 (ASIDE — architectural separation) :** Data isolation correspond précisément à l'objectif architectural de P057. Le graphe de permissions `G = (S, R)` formalise exactement les frontières que P057 cherche à enforcer par séparation physique des flux.

**Liens P126 (Design Patterns, Tramèr — provable resistance) :** Le framework identifie que les défenses avec garanties prouvables (sandboxing, formal verification [16, 46, 50]) implementent des sous-ensembles de R ou O. P126 et Siu et al. sont complémentaires : P126 donne des patterns d'implémentation, Siu et al. donne le cadre formel pour juger si ces patterns couvrent les quatre propriétés.

#### Gaps adressés / créés

- **G-adressé :** Absence de cadre formel unifié pour classifier les attaques agent (gap identifié dans la littérature, maintenant couvert).
- **G-créé / ouvert :** Implémentation des fonctions oracle I et L (interpretability open problem, Section 7, p. 12). Benchmarks avec contexte d'autorisation explicite (Section 7, p. 12-13). Sécurité compositionnelle (Section 8, p. 13). Multi-agent delegation (Section 8, p. 13).
- **Lien G-014 (si existant — validation formelle δ³) :** Ce framework fournit la spécification formelle ; l'implémentation reste ouverte — AEGIS peut contribuer à l'approximation de Ha pour le domaine médical.

#### Mapping templates AEGIS

- Templates ciblant δ³ (validation contextuelle) : pertinents pour tester les défenses approximant Ha.
- Templates IPI : formalisés comme violation source authorization + action alignment (Section 5.1, p. 8) — mapping direct aux templates IPI du catalogue AEGIS.
- Templates jailbreak : violation o0 ∉ O (Section 5.3, p. 9) — mapping aux templates δ⁰ AEGIS #07/#08/#11.
- Templates confused deputy : violation (suser, starget) ∉ R (Section 5.4, p. 9) — mapping aux templates de privilege escalation.

---

### Citations clés

> "Security in LLM agents is inherently contextual: whether an input — such as a prompt, observation of the environment, or memory record — or an output — such as an action — constitutes a security breach depends on the execution context." (Section 1, p. 1)

> "Any defense that does not verify all four properties with respect to the full context is structurally incapable of distinguishing the attack and legitimate cases in Figure 1, regardless of its sophistication." (Section 4.1, p. 5)

> "Each property is individually necessary: source authorization violations enable external command injection even when alignment oracles return 1; task alignment violations allow objective drift; action alignment violations permit capability misuse; data isolation violations create information leakage independently of the other three. No strict subset suffices." (Section 4.4, p. 7)

> "We do not claim the four properties are formally complete or axiomatically derived. Rather, they systematize existing attack classes: our analysis of 87 papers reveals that documented attacks map to violations of one or more properties." (Section 8, p. 13)

> "Defenses that most directly approximate Ha: the PI detector and tool filter [...] reduce targeted ASR by 86% and 88% relative to no defense respectively, while defenses that approximate only I or L (delimiting, repeat prompt) reduce ASR by at most 28%." (Section 6.2, p. 11-12, données AgentDojo)

> "Instruction attribution I is an open interpretability problem: current approaches using attention mechanisms or influence functions provide only coarse approximations." (Section 7, p. 12)

> "Our framework applies to synchronous agents that await observations before proceeding. [...] We focus on operational security of deployed agents rather than training-time attacks." (Section 8, p. 13)

---

### Classification

| Champ | Valeur |
|-------|--------|
| Nature | [ALGORITHME] — Définitions formelles + taxonomie SoK. Pas de théorèmes prouvés (complétude non établie). |
| SVC pertinence AEGIS | 8/10 — Haute pertinence pour δ³ et la formalisation des propriétés de sécurité agent ; moins opérationnel que les papiers expérimentaux |
| Reproductibilité | N/A — SoK conceptuel, pas d'expériences. Les définitions sont reproductibles par construction. |
| Code disponible | Non — "We developed no software artifacts" (Section "Open Science", p. 14) |
| Dataset public | Non — "We conducted no experiments, collected no data" (ibid.) |
| Couverture corpus | 87 papiers analysés (Section 8, p. 13) |
| Scooping risk δ³ | **MODÉRÉ-ÉLEVÉ** — Framework formel concurrent publié mars 2026 par Dawn Song et al. (UC Berkeley). AEGIS doit se positionner comme extension *opérationnelle* et *domaine-spécifique* (médical), pas comme premier framework formel. |
| Statut | [PREPRINT] arXiv:2603.19469v1, 19 mars 2026 |
