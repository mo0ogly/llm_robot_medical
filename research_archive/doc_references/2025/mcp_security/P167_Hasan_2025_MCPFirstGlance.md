## [Hasan, Li, Fallahzadeh, et al., 2025] — MCP au premier regard : sécurité et maintenabilité des serveurs Model Context Protocol

**Reference :** arXiv:2506.13538 (v5, révision 13 Apr 2026)
**Revue/Conf :** ACM Transactions on Software Engineering and Methodology (TOSEM) — soumis ; arXiv preprint 2025 [cs.SE]
**Auteurs :** Mohammed Mehedi Hasan, Hao Li, Emad Fallahzadeh, Gopi Krishnan Rajbahadur, Bram Adams, Ahmed E. Hassan (Queen's University, Canada — 6 auteurs)
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P167_Hasan_2025_MCPFirstGlance.pdf](../../literature_for_rag/P167_Hasan_2025_MCPFirstGlance.pdf)
> **Statut**: [PREPRINT] lu en texte complet (53 pages, version v5)

---

### Abstract original

> Although Foundation Models (FMs), such as GPT-4, are increasingly used in domains like finance and software engineering, reliance on textual interfaces limits these models' real-world interaction. To address this, FM providers introduced tool calling—triggering a proliferation of frameworks with distinct tool interfaces. In late 2024, Anthropic introduced the Model Context Protocol (MCP) to standardize this tool ecosystem. With SDK downloads surpassing twenty five million per week and 86% of enterprises using models supporting MCP tools, MCP is rapidly emerging as a de facto industry standard. Despite its adoption, MCP's AI-driven, non-deterministic control flow introduces new risks to sustainability, security, and maintainability, warranting closer examination.
> Towards this end, we present the first large-scale empirical study of MCP. Using state-of-the-art health metrics and a hybrid analysis pipeline, combining a general-purpose static analysis tool with an MCP-specific scanner, we evaluate 1,899 open-source MCP servers to assess their health, security, and maintainability. Despite MCP servers demonstrating strong health metrics, we identify eight distinct vulnerabilities—only three overlapping with traditional software vulnerabilities. Additionally, 7.2% of servers contain general vulnerabilities and 5.5% exhibit MCP-specific tool poisoning. Regarding maintainability, while 66% exhibit code smells, 14.4% contain ten bug patterns overlapping prior research. These findings highlight the need for MCP-specific vulnerability detection techniques while reaffirming the value of traditional analysis and refactoring practices. Furthermore, we advocate for stronger governance across the MCP ecosystem by incorporating MCP-specific vulnerabilities into standardized vulnerability databases, enabling automated security scanning within MCP registries, and promoting responsible development practices to ensure the long-term safety and sustainability of the MCP ecosystem.
> — Source : PDF p. 1, Abstract

---

### Résumé (5 lignes)

- **Problème :** L'écosystème MCP se développe à très grande vitesse (25 millions de téléchargements SDK/semaine, 86% des entreprises utilisant des modèles MCP-compatibles) sans caractérisation empirique de sa santé, sécurité ou maintenabilité — risque de déploiement massif de serveurs vulnérables (PDF p. 1, Abstract).
- **Méthode :** Pipeline d'analyse hybride : SonarQube (analyse statique générale, 583 dépôts filtrés sur 1 899 minés) + mcp-scan (scanner dynamique MCP-spécifique, 83 dépôts par échantillonnage de Cochran) ; clustering LLM-Jury (Claude-3.7-Sonnet, GPT-4o, Gemini-2.5-Pro) pour catégoriser les issues ; 40 études de baseline comparatives (PyPI, NPM, IaC) (PDF p. 13, Section 5).
- **Données :** 1 899 serveurs MCP open-source : 88 officiels (Anthropic), 255 maintenus par la communauté, 1 556 minés sur GitHub via import patterns SDK — coupure au 20 mars 2025 ; filtre : >= 10 étoiles GitHub (PDF pp. 4-5, Section 5.1).
- **Résultat principal sécurité :** 7,2% des serveurs MCP contiennent au moins une vulnérabilité générale (8 patterns dont credential exposure 3,6%) ; 5,5% exhibent du tool poisoning MCP-spécifique (détecté sur 73/83 serveurs scannés) ; seuls 3 des 8 patterns se chevauchent avec les vulnérabilités classiques (PDF pp. 25-27, Section 6.2, Table 7).
- **Résultat principal maintenabilité :** 66% des serveurs ont au moins un code smell critique/bloqueur (high cognitive complexity = 59,7%) ; 14,4% contiennent au moins un bug critique/bloqueur (9 patterns) — taux comparables à l'OSS traditionnel (PDF pp. 31-35, Section 6.2, RQ-2).

---

### Analyse critique

**Forces :**
- Première étude à grande échelle de l'écosystème MCP (1 899 serveurs, claim auteur vérifié — Section 5.1, p. 5) : donne une mesure empirique de référence pour toute la communauté de recherche, avec dataset public (replication package : https://github.com/SAILResearch/replication-25-mcp-server-empirical-study).
- Pipeline hybride justifié : SonarQube détecte les vulnérabilités code-level, mcp-scan les vulnérabilités protocol-level (tool poisoning via reflection) ; les deux surfaces sont complémentaires et non redondantes (Section 5.2, p. 17).
- LLM-Jury validé : accord quasi-parfait (Fleiss' Kappa κ=1,0 pour les vulnérabilités, κ=0,9 pour code smells et bugs) avec validation humaine sur 75 échantillons aléatoires (Section 5.3.3, p. 20).
- Baselines solides : 40 études comparatives sur PyPI, NPM, IaC, ML projects — 135 recherches Google Scholar ; comparaison multi-domaine (Section 5.4, pp. 20-21, Table 4).
- Finding de santé contre-intuitif : les serveurs MCP (< 6 mois d'âge médian) ont une fréquence de commits plus élevée (5,5/semaine vs 2,5 OSS général) et un CI adoption rate de 42,2% vs 40,3% pour l'OSS général — signal positif de durabilité malgré la jeunesse de l'écosystème (Table 5, p. 23).

**Faiblesses :**
- SonarQube ne couvre que les 4 premiers niveaux de sévérité (Blocker/Critical/Major/Minor) ; les vulnérabilités Info-level sont exclues — potentielle sous-estimation du parc vulnérable (Section 6.2, p. 25).
- mcp-scan déployé sur seulement 83/583 serveurs filtrés (< 15%) par contrainte opérationnelle (setup credentials, APIs live requis) ; 23/83 scans ont échoué initialement (configuration errors) avant patch — biais de sélection possible vers des serveurs plus "installables" (Section 5.2.2, pp. 17-18).
- mcp-scan ne détecte que le tool poisoning ; excessive permission requirements et insecure default behaviors (exemple : apple-notes-mcp full disk access, godot-mcp auto-approval) ne sont pas couverts — les auteurs le signalent explicitement (Section 6.2, p. 27).
- Aucun serveur officiel (Anthropic-listed) ne présente de vulnérabilité détectée par SonarQube ; interprétation prudente : cela reflète la plus petite taille et la maintenance plus active, pas nécessairement une sécurité intrinsèquement supérieure (Section 6.2, Table 8, p. 29).
- Limitation critique non signalée : 85% des vulnérabilités dans les serveurs avec > 5 issues sont dans des fichiers .yaml (déploiement) — donc des serveurs où MCP est une feature secondaire, pas le projet principal ; le profil de risque des serveurs "pure MCP" est différent (Section 6.2, p. 28).

**Questions ouvertes :**
- La prévalence de 5,5% de tool poisoning est-elle un plancher (outil immature) ou un plafond (les serveurs malveillants sont une minorité rare) ? La question reste ouverte — aucune validation d'exploitation réelle n'est faite.
- Comment évolue la prévalence dans le temps ? Étude transversale unique (mars 2025) ; aucun tracking longitudinal.
- Les vulnérabilités MCP-spécifiques (tool poisoning, rug pull, cross-origin escalation) absentes de CWE/OWASP nécessitent une taxonomie dédiée — recommandation explicite des auteurs (Section 7.1, p. 37).

---

### Formules exactes et métriques empiriques

**Formule d'échantillonnage (Cochran) pour mcp-scan — Eq. implicite, Section 5.2.2, p. 18 :**

$$n = \frac{z^2 p(1-p)/\varepsilon^2}{1 + z^2 p(1-p)/(\varepsilon^2 N)}$$

Paramètres : z = 1,96 (confiance 95%), p = 0,5 (proportion estimée), ε = 0,10 (marge d'erreur 10%), N = population finie.
Résultat : n = 83 serveurs. [CALCUL VERIFIE — formule de Cochran avec correction de population finie, Section 5.2.2]

**Métriques RQ-0 santé (Table 5, p. 23) :**
- Median Commits/Week : MCP = 5,5 vs OSS général = 2,5 (Baltes et al., 2018)
- CI Adoption Rate : MCP = 42,2% vs OSS = 40,3% (Hilton et al., 2016)
- Median Follower Count Contributors : MCP = 129,6 vs OSS = 37,3 (Moid et al., 2021)
- Median Star Count/year normalisé : MCP = 79,0/an vs OSS = 34,7/an
- Build Success Rate : MCP = 90,0% vs OSS = 70,0%

**Métriques RQ-1 vulnérabilités (Table 7, p. 27) :**
- 7,2% des serveurs MCP : au moins une vulnérabilité générale (277 vulnérabilités, 42 serveurs uniques, 13 CWEs)
- Credential Exposure (CWE-259/798) : 3,6% — pattern le plus fréquent
- Lack of Access Control (CWE-306/284) : 1,4%
- CORS Issues (CWE-345) : 1,2%
- Improper Resource Management (CWE-770) : 1,0%
- Transport Security Issues (CWE-295/297/327) : 0,7%
- 5,5% de tool poisoning MCP-spécifique (73 serveurs scannés avec mcp-scan)

**Métriques RQ-2 maintenabilité (Section 6.2, pp. 31-35) :**
- 66% des serveurs : au moins un code smell critique/bloqueur (17 832 issues, 385 serveurs, Table 9)
- High Cognitive Complexity : 59,7% — 3× plus fréquent que le suivant (code duplication 21,4%)
- 14,4% des serveurs : au moins un bug critique/bloqueur (523 bugs, 84 serveurs uniques)
- Array Manipulation Issues : 6,2% — bug le plus fréquent (Table 11)

**Validation LLM-Jury (Section 5.3.3-5.3.4, pp. 20-21) :**
- Fleiss' Kappa : κ = 1,0 (vulnérabilités), κ = 0,9 (code smells et bugs)
- Cluster membership consistency : 100% sur 5 runs
- Naming similarity cosine : 0,75 moyenne

---

### Pertinence thèse AEGIS

#### Couches delta
- **δ¹ (surface tool/MCP)** : Coeur du papier — mesure empirique directe de la surface d'attaque des serveurs MCP (tool poisoning, credential exposure, lack of access control). Apporte des chiffres de prévalence réels (7,2% + 5,5% tool poisoning) pour quantifier le risque δ¹.
- **δ² (infrastructure/supply-chain)** : Le pipeline hybride SonarQube + mcp-scan établit un cadre de détection applicable à l'audit des composants MCP dans des systèmes médicaux IA.
- Neutre pour δ⁰ (RLHF) et δ³ (exfiltration terminale — pas d'étude des conséquences downstream).

#### Conjectures
- **MC8 (MCP supply-chain Da Vinci)** : SUPPORTÉE directement — la prévalence de 5,5% de tool poisoning et de 7,2% de vulnérabilités générales dans l'écosystème open-source MCP confirme que le supply-chain MCP constitue un vecteur d'attaque réel et mesurable. L'étude empirique à grande échelle (1 899 serveurs) fournit des ordres de grandeur concrets. (Section 6.2, Table 7, pp. 26-27)
- **C1 (prompt injection médicale)** : SUPPORTÉE indirectement — le mécanisme de tool poisoning (manipulation des tool descriptions pour rediriger les FMs) est un vecteur de prompt injection indirect (IPI) ; applicable dans un contexte médical où les serveurs MCP accèdent à des dossiers patients ou des APIs de prescription. (Section 3.2.7, p. 10)
- **C2 (surface d'attaque multi-couche)** : SUPPORTÉE — l'étude identifie deux surfaces d'attaque distinctes et non redondantes : code-level (SonarQube) + protocol-level/reflection (mcp-scan), structurellement alignées avec le modèle δ¹/δ² d'AEGIS.

#### Découvertes liées
- **D-xxx (à créer)** : Premier chiffre empirique de prévalence de tool poisoning in-the-wild : 5,5% sur 73 serveurs scannés. Point de référence pour calibrer les risques AEGIS.
- Confirme les analyses qualitatives de P152 (Li, 2025, MCPFirstLook) sur un corpus d'ordre de grandeur différent (73 vs 67 057 serveurs, mais méthodes différentes — statique vs registres publics).

#### Gaps
- **Gap10 (sécurité MCP ecosystème)** : PARTIELLEMENT ADRESSÉ — la prévalence de 5,5% de tool poisoning et 7,2% de vulnérabilités générales fournit des baselines quantitatives. Gap résiduel : absence de validation d'exploitation réelle (no ASR measured), absence de contexte médical spécifique, absence de tracking longitudinal.
- Ouvre un nouveau gap : absence de taxonomie CWE/OWASP pour les vulnérabilités MCP-spécifiques (Section 7.1, p. 37) — besoin de formalisation que la thèse AEGIS peut contribuer à combler.

#### Mapping templates AEGIS
- Vecteurs IPI via tool descriptions (outil empoisonné dans le contexte RAG/MCP) : templates correspondant aux chaînes d'attaque indirect-MCP (#médical-rag, rag-basic, injection-indirecte)
- Outil AEGIS : le pipeline mcp-scan + SonarQube est directement réutilisable pour auditer les serveurs MCP intégrés dans le lab AEGIS

---

### Citations clés

> "Towards this end, we present the first large-scale empirical study of MCP. Using state-of-the-art health metrics and a hybrid analysis pipeline, combining a general-purpose static analysis tool with an MCP-specific scanner, we evaluate 1,899 open-source MCP servers to assess their health, security, and maintainability."
> — (Abstract, p. 1)

> "7.2% of MCP server repositories contain at least one security vulnerability, with half of these affected by credential exposure. We summarize the distribution of vulnerability patterns in Table 7. We detect 277 vulnerabilities across 42 unique MCP servers, which are related closely to 13 CWEs."
> — (Section 6.2, RQ-1 Findings, p. 26)

> "Despite the operational challenges and early stage of the tool, we still detect potential tool poisoning in 5.5% of MCP servers, which is more prevalent than credential exposure. The ability of an early-stage tool, deployed with considerable effort on a limited sample, to uncover this rate of a critical MCP-specific vulnerability strongly underscores the likelihood of more hidden issues that existing tools are currently unable to detect."
> — (Section 6.2, RQ-1 Findings, p. 27)

> "66% of MCP servers contain at least one critical or blocker-level code smell, with some of those code smells, e.g., import & dependency issues, variable declaration, and usage issues, present in 100% Python ML projects."
> — (Section 6.2.1, RQ-2 Findings, p. 31)

> "59.7% of MCP servers suffer from high cognitive complexity, which is also considered as one of the most severe code smells in the Python ecosystem. [...] we observe that high cognitive complexity is almost three times more prevalent than the second most common code smell, e.g., code duplication-redundancy, in MCP servers."
> — (Section 6.2.1, p. 32)

> "While mcp-scan is able to detect tool poisoning, it misses other security concerns, such as excessive permission requirements and insecure default behaviors. During the setup process, we manually uncovered several concerning patterns that were not flagged by the scanner."
> — (Section 6.2, RQ-1, p. 27)

> "We can classify MCP practitioners into two groups: (i) MCP Developers who build and manage MCP servers and tools and (ii) MCP Users who use MCP servers to build FM-based AI applications."
> — (Section 7.2, p. 37)

> "MCP servers exhibit distinct vulnerability patterns compared to other domains of software engineering. Out of eight vulnerability patterns detected in MCP servers, three are common with other domains."
> — (Summary RQ-1, p. 29)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence AEGIS | 8/10 — première grande mesure empirique de la surface d'attaque MCP supply-chain ; chiffres directement exploitables |
| Reproductibilité | Haute — dataset public (replication package GitHub), SonarQube open-source, méthode documentée ; limite : mcp-scan setup complexe (credentials requis) |
| Code disponible | Oui — https://github.com/SAILResearch/replication-25-mcp-server-empirical-study (mentionné p. 42, ref [63]) |
| Dataset public | Oui — 1 899 serveurs MCP dans le replication package |
| Statut publication | [PREPRINT] — soumis ACM TOSEM (arXiv:2506.13538 v5, rév. 13 Apr 2026) |
| Année preprint | 2025 (identifiant arXiv 2506.xxxxx = juin 2025) |
| Nature résultat | [EMPIRIQUE] — étude observationnelle à grande échelle, pas de théorèmes formels |
| Couches delta | δ¹ (principal), δ² (secondaire) |
| Conjectures | MC8 (SUPPORTÉE directement), C1 (SUPPORTÉE indirectement), C2 (SUPPORTÉE) |
| Gaps | Gap10 (partiellement adressé) |
| Mapping templates | Chaînes indirect-MCP, medical-rag, injection-indirecte |
| Complémentarité | Complète P152 (Li, 2025, MCPFirstLook, N=67K registres publics) par l'analyse statique/dynamique du code source open-source (N=1899) |
