## [Ferrag et al., 2025] — From Prompt Injections to Protocol Exploits: Threats in LLM-Powered AI Agents Workflows

**Reference** : arXiv:2506.23260 / ScienceDirect Computers & Security
**Revue/Conf** : Computers & Security (Elsevier) — SCImago Q1 (Computer Science, Security)
**Lu le** : 2026-04-04
> **PDF Source**: [literature_for_rag/P010_source.pdf](../../assets/pdfs/P010_source.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (112 chunks)

**Nature epistemique** : [SURVEY] — revue systematique avec modele de menace formel et taxonomie de 30+ techniques d'attaque

### Abstract original
> "Autonomous AI agents powered by large language models (LLMs) with structured function-calling interfaces have greatly expanded capabilities for real-time data retrieval, computation, and multi-step orchestration. However, the rapid growth of plugins, connectors, and inter-agent protocols has outpaced security practices, leading to brittle integrations—plugin APIs and protocol adapters that rely on ad-hoc authentication, inconsistent schemas, and weak validation—making them vulnerable to failures and exploitation. This survey introduces a unified end-to-end threat model for LLM-agent ecosystems, spanning host-to-tool and agent-to-agent communications, and catalogs over thirty attack techniques across Input Manipulation, Model Compromise, System and Privacy Attacks, and Protocol Vulnerabilities. For each category, we provide a formal mathematical formulation of the underlying threat model, defining attacker capabilities, objectives, and affected layers to enable systematic analysis. Representative examples include Prompt-to-SQL (P2SQL) injections and the Toxic Agent Flow exploit in GitHub's MCP server. For each category, we assess feasibility, review defenses, and outline mitigation strategies such as dynamic trust management, cryptographic provenance tracking, and sandboxed agentic interfaces. The framework was validated through expert review and cross-mapping with real-world incidents and public vulnerability repositories (e.g., CVE, NIST NVD) to ensure practical relevance."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme** : La croissance rapide des plugins, connecteurs et protocoles inter-agents depasse les pratiques de securite, creant des integrations fragiles et exploitables (Section I, Abstract)
- **Methode** : Modele de menace unife end-to-end pour les ecosystemes LLM-agent, avec formulation mathematique pour chaque categorie de menace (Section II-III)
- **Donnees** : Catalogue de 30+ techniques d'attaque, cross-mappe avec CVE, NIST NVD et incidents reels (GitHub MCP, Toxic Agent Flow) (Sections III-V)
- **Resultat** : Taxonomie en 4 categories (Input Manipulation, Model Compromise, System & Privacy, Protocol Vulnerabilities) avec exemples representatifs incluant P2SQL et MCP exploits (Abstract, Sections III-VI)
- **Limite** : Modele de menace theorique avec PoC limites ; pas d'evaluation experimentale quantitative (Section Discussion)

### Analyse critique
**Forces** :
- Premiere taxonomie integree couvrant a la fois les exploits au niveau input ET au niveau protocole dans les ecosystemes LLM-agent — comble un gap important dans la litterature (Ferrag et al., 2025, Abstract)
- Formulation mathematique des modeles de menace pour chaque categorie — permet une analyse systematique et rigoureuse (Ferrag et al., 2025, Sections III-VI)
- Cross-mapping avec CVE et NIST NVD — ancrage dans les vulnerabilites reelles documentees
- Couverture des protocoles recents : MCP (Anthropic), A2A (Google), Agent Network Protocol — pertinence pour l'etat de l'art le plus recent
- Proposition de defenses structurees : dynamic trust management, cryptographic provenance tracking, sandboxed agentic interfaces — pistes actionables
- Venue Computers & Security (Elsevier, Q1) — standard de publication rigoureux

**Faiblesses** :
- Article de revue sans contribution experimentale originale — les formulations mathematiques sont des modelisations theoriques, pas des resultats prouves
- Le catalogue de 30+ techniques est potentiellement redondant avec les taxonomies existantes (MITRE ATLAS, OWASP Top 10 for LLM)
- Les defenses proposees (trust management, provenance tracking) ne sont pas implementees ni evaluees
- Le croisement CVE/NIST est mentionne mais pas detaille systematiquement dans le texte (Awotunde et al., 2025, Section II, mention sans enumeration)
- Equipe multi-pays (UAE, Hongrie, Algerie, UK) avec des affiliations variees — coherence methodologique a verifier

**Questions ouvertes** :
- Le modele de menace formel est-il exploitable pour generer automatiquement des tests de securite ?
- Comment le P2SQL (Prompt-to-SQL injection) se compare-t-il aux attaques SQL classiques en termes de detectabilite ?
- Les defenses basees sur le provenance tracking sont-elles compatibles avec la latence requise par les agents temps reel ?

### Formules exactes
- Formulations mathematiques des modeles de menace par categorie (notations d'ensemble, capacites de l'attaquant, objectifs — Sections III-VI)
- Pas de formule de type borne ou theoreme — modelisations definitionnelles
- Lien glossaire AEGIS : pertinent pour les definitions formelles de surface d'attaque

### Pertinence these AEGIS
- **Couches delta** : δ⁰ (alignment surveyed), δ¹ (system prompts evalues comme insuffisants pour les politiques cross-agents), δ² (filtrage partiel aux frontieres des agents), δ³ (non discute, identifie comme gap)
- **Conjectures** :
  - C1 (insuffisance δ¹) : **Fortement supportee** — les system prompts per-agent ne peuvent pas enforcer des politiques cross-agent (Ferrag et al., 2025, Section Protocol Vulnerabilities)
  - C2 (necessite δ³) : **Fortement supportee** — l'article argumente explicitement pour une verification continue et des interfaces sandboxees
- **Decouvertes** : D-008 (escalade prompt-to-protocol) — concept cle montrant que l'injection de prompt peut se propager au-dela du LLM vers les protocoles systeme (Ferrag et al., 2025, Sections III-V) ; D-012 (Toxic Agent Flow en contexte MCP, Ferrag et al., 2025, Section IV)
- **Gaps** : G-001 (modele de menace formel pour agents — partiellement adresse par ce papier), G-014 (defence inter-agent non resolue), G-017 (propagation d'infection entre agents via A2A)
- **Mapping templates AEGIS** : Les categories Input Manipulation correspondent aux templates #01-#35 (DPI) et #36-#60 (IPI) ; Protocol Vulnerabilities correspondent aux chains `sql_attack`, `transactional_agent`, `tool_retrieval_agent`

### Citations cles
> "This survey introduces a unified end-to-end threat model for LLM-agent ecosystems, spanning host-to-tool and agent-to-agent communications, and catalogs over thirty attack techniques." (Abstract)
> "The rapid growth of plugins, connectors, and inter-agent protocols has outpaced security practices, leading to brittle integrations." (Abstract)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | N/A — article de revue theorique, pas d'experience originale |
| Code disponible | Non |
| Dataset public | Non (cross-reference CVE/NIST mais pas de dataset original) |
