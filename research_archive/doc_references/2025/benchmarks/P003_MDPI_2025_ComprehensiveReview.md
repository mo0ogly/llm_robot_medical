## [Gulyamov et al., 2026] — Prompt Injection Attacks in Large Language Models and AI Agent Systems: A Comprehensive Review

**Reference** : DOI:10.3390/info17010054
**Revue/Conf** : Information (MDPI), 17(1), 54 — Open Access, SCImago Q2 (Computer Science)
**Lu le** : 2026-04-04
> **PDF Source**: [literature_for_rag/P003_source.pdf](../../literature_for_rag/P003_source.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (72 chunks). Publie 7 janvier 2026.

**Nature epistemique** : [SURVEY] — revue systematique sans contribution experimentale originale

### Abstract original
> "Large language models (LLMs) have rapidly transformed artificial intelligence applications across industries, yet their integration into production systems has unveiled critical security vulnerabilities, chief among them prompt injection attacks. This comprehensive review synthesizes research from 2023 to 2025, analyzing 45 key sources, industry security reports, and documented real-world exploits. We examine the taxonomy of prompt injection techniques, including direct jailbreaking and indirect injection through external content. The rise of AI agent systems and the Model Context Protocol (MCP) has dramatically expanded attack surfaces, introducing vulnerabilities such as tool poisoning and credential theft. We document critical incidents including GitHub Copilot's CVE-2025-53773 remote code execution vulnerability (CVSS 9.6) and ChatGPT's Windows license key exposure. Research demonstrates that just five carefully crafted documents can manipulate AI responses 90% of the time through Retrieval-Augmented Generation (RAG) poisoning. We propose PALADIN, a defense-in-depth framework implementing five protective layers. This review provides actionable mitigation strategies based on OWASP Top 10 for LLM Applications 2025, identifies fundamental limitations including the stochastic nature problem and alignment paradox, and proposes research directions for architecturally secure AI systems. Our analysis reveals that prompt injection represents a fundamental architectural vulnerability requiring defense-in-depth approaches rather than singular solutions."
> — Source : PDF page 1-2, Abstract

### Resume (5 lignes)
- **Probleme** : L'injection de prompt est une vulnerabilite architecturale fondamentale des LLM, exacerbee par l'essor des systemes d'agents IA et du MCP (Section 1.1)
- **Methode** : Revue systematique de 45 sources (2023-2025), incluant papiers academiques, rapports industriels et exploits documentes (Section 1.3)
- **Donnees** : 45 sources primaires, incidents documentes (CVE-2025-53773, CamoLeak CVSS 9.6, ChatGPT memory exploitation) (Sections 4, 6)
- **Resultat** : 5 documents empoisonnes suffisent pour manipuler un RAG dans 90% des cas (Section 5.1, citant PoisonedRAG). Proposition du framework PALADIN a 5 couches de defense (Section 9.5)
- **Limite** : Revue descriptive sans validation experimentale du framework PALADIN propose ; pas de metriques quantitatives originales (Section 10)

### Analyse critique
**Forces** :
- Couverture exceptionnellement large incluant les menaces les plus recentes : MCP tool poisoning, rug pull attacks, Unicode tag injection, A2A protocol exploits (Sections 3-4)
- Documentation detaillee des incidents reels : CVE-2025-53773 (Copilot RCE), CamoLeak CVSS 9.6 (secret exfiltration via Camo proxy), SCADA attack via PDF injection (Sections 4.1-4.2)
- Taxonomie structuree en 3 categories principales (direct, indirect, tool-based) avec 5 dimensions de classification (Section 3.4, Table 1)
- Identification de 3 patterns de convergence : ambiguite des frontieres de confiance, evolution vers des vecteurs composites, amplification par l'autonomie des agents (Section 3.5)
- Identification de gaps de recherche pertinents : absence de modeles de menace formels, manque de donnees empiriques sur la frequence reelle, propagation cross-contexte non etudiee (Section 3.5)

**Faiblesses** :
- Le framework PALADIN est propose sans aucune validation experimentale — c'est une proposition conceptuelle, pas une defense demontree
- La revue est descriptive : pas de meta-analyse quantitative, pas de comparaison systematique des defenses
- Les auteurs viennent d'un departement de droit cyber (Tashkent State University of Law), pas d'informatique — potentiellement limitant pour la profondeur technique
- Les 45 sources incluent des rapports industriels et des blog posts (Simon Willison) — melange de sources peer-reviewed et non-academiques sans distinction claire
- Le statut MDPI est a noter : revue open-access connue pour des standards de review variables (Q2 SCImago)

**Questions ouvertes** :
- Le framework PALADIN peut-il etre formalise et valide experimentalement ?
- Comment les defenses evoluent-elles face aux attaques composites (Unicode + multi-turn + MCP) ?
- La frontiere instruction/donnee est-elle fundamentalement infranchissable (le "stochastic nature problem") ?

### Formules exactes
- Aucune formule mathematique (article de revue)
- Statistique cle : 5 documents empoisonnes suffisent pour 90% de manipulation RAG (Section 5.1, citant Zou et al., PoisonedRAG, USENIX Security 2025)
- 53% des entreprises utilisent RAG/agentic pipelines (Section 1.2, citant OWASP 2025)

### Pertinence these AEGIS
- **Couches delta** : δ⁰ (RLHF surveyed), δ¹ (system prompt surveyed), δ² (filtrage surveyed), δ³ (verification formelle identifiee comme le domaine le moins explore) — confirme le cadre delta a 4 couches
- **Conjectures** :
  - C1 (insuffisance δ¹) : **Supportee explicitement** — la revue confirme que les approches singulieres sont insuffisantes (Abstract, Section 3.5)
  - C2 (necessite δ³) : **Partiellement supportee** — PALADIN propose des couches empiriques mais reconnait l'absence de verification formelle
- **Decouvertes** : D-005 (vulnerabilite RAG) confirmee par les chiffres PoisonedRAG ; D-008 (MCP attack surface) documentee extensivement
- **Gaps** : G-001 (absence de modele de menace formel pour agents), G-015 (propagation cross-contexte non etudiee)
- **Mapping templates AEGIS** : Les 3 categories taxonomiques s'alignent sur les categories du catalogue AEGIS — DPI (#01-#35), IPI (#36-#60), tool-based (#61-#80)

### Citations cles
> "Research demonstrates that just five carefully crafted documents can manipulate AI responses 90% of the time through Retrieval-Augmented Generation (RAG) poisoning." (Abstract, p. 1)
> "Prompt injection represents a fundamental architectural vulnerability requiring defense-in-depth approaches rather than singular solutions." (Abstract, p. 2)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 |
| Reproductibilite | N/A — article de revue, pas d'experience originale |
| Code disponible | Non |
| Dataset public | Non |
