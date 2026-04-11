# P003 : Prompt Injection Attacks in Large Language Models and AI Agent Systems -- A Comprehensive Review

## [Gulyamov et al., 2026] -- Prompt Injection Attacks in Large Language Models and AI Agent Systems: A Comprehensive Review

**Reference :** DOI:10.3390/info17010054
**Revue/Conf :** Information (MDPI), 17(1), 54 -- Open Access, SCImago Q2 (Computer Science), publie 7 janvier 2026
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P003_source.pdf](../../assets/pdfs/P003_source.pdf)
> **Statut**: [ARTICLE VERIFIE] -- lu en texte complet via ChromaDB (72 chunks). Publie dans journal peer-reviewed (MDPI Information, Q2 SCImago). Note : MDPI est un editeur open-access connu pour des standards de review variables.

### Abstract original
> Large language models (LLMs) have rapidly transformed artificial intelligence applications across industries, yet their integration into production systems has unveiled critical security vulnerabilities, chief among them prompt injection attacks. This comprehensive review synthesizes research from 2023 to 2025, analyzing 45 key sources, industry security reports, and documented real-world exploits. We examine the taxonomy of prompt injection techniques, including direct jailbreaking and indirect injection through external content. The rise of AI agent systems and the Model Context Protocol (MCP) has dramatically expanded attack surfaces, introducing vulnerabilities such as tool poisoning and credential theft. We document critical incidents including GitHub Copilot's CVE-2025-53773 remote code execution vulnerability (CVSS 9.6) and ChatGPT's Windows license key exposure. Research demonstrates that just five carefully crafted documents can manipulate AI responses 90% of the time through Retrieval-Augmented Generation (RAG) poisoning. We propose PALADIN, a defense-in-depth framework implementing five protective layers. This review provides actionable mitigation strategies based on OWASP Top 10 for LLM Applications 2025, identifies fundamental limitations including the stochastic nature problem and alignment paradox, and proposes research directions for architecturally secure AI systems. Our analysis reveals that prompt injection represents a fundamental architectural vulnerability requiring defense-in-depth approaches rather than singular solutions.
> -- Source : PDF pages 1-2, Abstract

### Resume (5 lignes)
- **Probleme :** L'injection de prompt est une vulnerabilite architecturale fondamentale des LLM, exacerbee par l'essor des systemes d'agents IA et du Model Context Protocol (MCP) qui elargissent dramatiquement les surfaces d'attaque (Gulyamov et al., 2026, Section 1.1)
- **Methode :** Revue systematique de 45 sources (2023-2025), incluant papiers academiques, rapports industriels (OWASP, CrowdStrike) et exploits documentes (CVE, bug bounty). Methodologie : analyse thematique avec classification en 3 categories et 5 dimensions (Gulyamov et al., 2026, Section 1.3, Section 3.4)
- **Donnees :** 45 sources primaires, incidents reels documentes : CVE-2025-53773 (Copilot RCE, CVSS 9.6), CamoLeak (exfiltration via Camo proxy, CVSS 9.6), exploitation memoire ChatGPT, attaque SCADA via PDF injection (Gulyamov et al., 2026, Sections 4, 6)
- **Resultat :** 5 documents empoisonnes suffisent pour manipuler un RAG dans 90% des cas (Gulyamov et al., 2026, Section 5.1, citant Zou et al., PoisonedRAG, USENIX Security 2025). Proposition du framework PALADIN a 5 couches de defense. Identification de 3 limitations fondamentales : stochastic nature problem, alignment paradox, cross-context propagation (Gulyamov et al., 2026, Sections 3.5, 9.5, 10)
- **Limite :** Revue descriptive sans validation experimentale du framework PALADIN propose ; pas de metriques quantitatives originales ; melange de sources peer-reviewed et non-academiques (blog posts, rapports industriels) (Gulyamov et al., 2026, Section 10)

### Analyse critique

**Forces :**

1. **Couverture exceptionnellement large et actuelle.** La revue inclut les menaces les plus recentes de 2025 : MCP tool poisoning, rug pull attacks, Unicode tag injection, exploits A2A protocol, tool shadowing. C'est une des rares revues a couvrir l'ecosysteme MCP emergent avec ses vulnerabilites specifiques (namespace collisions, malicious tool descriptions, cross-server contamination) (Gulyamov et al., 2026, Sections 3-4).

2. **Documentation detaillee d'incidents reels.** Le papier documente des incidents concrets avec CVE et CVSS : CVE-2025-53773 (Copilot RCE, CVSS 9.6), CamoLeak (exfiltration de secrets via Camo proxy), attaque SCADA via PDF injection. Ces incidents reels ancrent la discussion dans la realite operationnelle, au-dela des demonstrations academiques (Gulyamov et al., 2026, Sections 4.1-4.2).

3. **Taxonomie structuree en 3 categories avec 5 dimensions.** La Table 1 (Section 3.4) classifie les vecteurs d'attaque en 3 categories principales (direct, indirect, tool-based) avec 5 dimensions de classification. Cette structure est directement alignable avec la taxonomie AEGIS et facilite la cartographie croisee (Gulyamov et al., 2026, Section 3.4, Table 1).

4. **Identification de patterns de convergence.** Le papier identifie 3 patterns de convergence critiques : (1) ambiguite des frontieres de confiance (ou finit l'instruction, ou commence la donnee), (2) evolution vers des vecteurs composites (Unicode + multi-turn + MCP), (3) amplification par l'autonomie des agents (Gulyamov et al., 2026, Section 3.5). Ces patterns informent directement la strategie de defense AEGIS.

5. **Identification du "stochastic nature problem" et de l'"alignment paradox".** Le papier formalise deux limitations fondamentales : le comportement stochastique des LLM rend toute defense deterministe inherement incomplete, et le paradoxe d'alignement (le meme mecanisme d'instruction-following qui rend les LLM utiles les rend vulnerables) est structurel, pas accidentel (Gulyamov et al., 2026, Section 10). Ces deux concepts sont centraux pour la these AEGIS.

**Faiblesses :**

1. **PALADIN non valide experimentalement.** Le framework PALADIN a 5 couches est une proposition conceptuelle, pas une defense demontree. Aucune implementation, aucun test, aucune mesure d'efficacite. C'est une esquisse architecturale utile mais non verifiable (Gulyamov et al., 2026, Section 9.5).

2. **Revue descriptive sans meta-analyse quantitative.** Le papier ne propose pas de comparaison systematique des defenses (pas de tableau comparatif ASR, pas de meta-analyse des resultats publies). Les 45 sources sont decrites mais pas synthetisees quantitativement.

3. **Provenance academique atypique.** Les auteurs viennent du departement de droit cyber de Tashkent State University of Law, pas d'un departement d'informatique ou de securite. Cela peut limiter la profondeur technique sur certains aspects (implementations, benchmarks, formalisations).

4. **Melange de sources heterogenes.** Les 45 sources incluent des rapports industriels, des blog posts (Simon Willison) et des papiers academiques peer-reviewed sans distinction claire de leur niveau de fiabilite. Un blog post et un papier USENIX Security n'ont pas le meme poids epistemique.

5. **MDPI Information (Q2 SCImago).** Le journal est connu pour des standards de review variables et des frais de publication eleves. La qualite du peer-review est inferieure a celle des venues de securite reconnues (NDSS, CCS, USENIX Security).

6. **Absence de contribution experimentale originale.** Pas de nouveau dataset, pas de nouvelle attaque, pas de nouvelle defense testee. La valeur ajoutee est dans la synthese et la taxonomie, pas dans la contribution scientifique originale.

**Questions ouvertes :**
- Le framework PALADIN peut-il etre formalise et valide experimentalement sur un benchmark standard ?
- Comment les defenses evoluent-elles face aux attaques composites (Unicode + multi-turn + MCP) ?
- La frontiere instruction/donnee est-elle fundamentalement infranchissable (le "stochastic nature problem") ou une solution architecturale existe-t-elle ?

### Formules exactes

Aucune formule mathematique (article de revue).

**Statistiques cles rapportees** (citations de travaux tiers) :
- 5 documents empoisonnes suffisent pour 90% de manipulation RAG (Gulyamov et al., 2026, Section 5.1, citant Zou et al., PoisonedRAG, USENIX Security 2025)
- 53% des entreprises utilisent RAG/agentic pipelines (Gulyamov et al., 2026, Section 1.2, citant OWASP 2025)
- CVE-2025-53773 CVSS 9.6 (GitHub Copilot RCE) (Gulyamov et al., 2026, Section 4.1)
- CamoLeak CVSS 9.6 (exfiltration de secrets) (Gulyamov et al., 2026, Section 4.2)

**Framework PALADIN** (Gulyamov et al., 2026, Section 9.5) -- 5 couches proposees (non implementees) :
Couche 1 : Input validation, Couche 2 : Semantic analysis, Couche 3 : Behavioral monitoring, Couche 4 : Output filtering, Couche 5 : Audit and logging.
[CONCEPTUEL -- aucune implementation ni validation experimentale]

Lien glossaire AEGIS : Pas de formule originale. Le framework PALADIN est conceptuellement aligne avec l'architecture multi-couches δ⁰-δ³ d'AEGIS.

### Pertinence these AEGIS

- **Couches delta :** δ⁰ (RLHF surveyed comme premiere ligne de defense), δ¹ (system prompt surveyed avec ses limites), δ² (filtrage surveyed comme couche intermediaire), δ³ (verification formelle identifiee comme le domaine le moins explore et le plus prometteur, Gulyamov et al., 2026, Section 10). La revue confirme explicitement le cadre delta a 4 couches d'AEGIS en identifiant les memes lacunes.
- **Conjectures :**
  - C1 (insuffisance δ¹) : **supportee explicitement** -- la revue confirme que les approches singulieres sont insuffisantes, citant l'echec systematique des defenses basees sur le prompt seul (Gulyamov et al., 2026, Abstract, Section 3.5)
  - C2 (necessite δ³) : **partiellement supportee** -- PALADIN propose des couches empiriques mais reconnait explicitement l'absence de verification formelle comme gap critique. Le "stochastic nature problem" est identifie comme limitation fondamentale (Gulyamov et al., 2026, Section 10)
  - C7 (illusion de separation des roles) : **supportee** -- le papier documente les attaques cross-context et la propagation d'injections entre agents MCP, montrant que la separation logique ne garantit pas l'isolation (Gulyamov et al., 2026, Section 3.5, point 3)
- **Decouvertes :**
  - D-005 (vulnerabilite RAG) : **confirmee** par les chiffres PoisonedRAG (Gulyamov et al., 2026, Section 5.1, citant Zou et al., USENIX Security 2025 : 5 documents = 90% manipulation)
  - D-008 (MCP attack surface) : **documentee extensivement** -- tool poisoning, rug pull, namespace collision, cross-server contamination (Gulyamov et al., 2026, Sections 3-4)
  - D-015 (stochastic nature problem) : **formalisee** -- le comportement stochastique rend toute defense deterministe incomplete (Gulyamov et al., 2026, Section 10)
- **Gaps :**
  - G-001 (absence de modele de menace formel pour agents) : **identifie explicitement** comme gap de recherche par la revue (Gulyamov et al., 2026, Section 3.5)
  - G-015 (propagation cross-contexte) : **identifie explicitement** -- "How do malicious instructions injected through poisoned RAG spread to multi-agent systems?" reste sans reponse (Gulyamov et al., 2026, Section 3.5, point 3)
  - G-021 (validation experimentale PALADIN) : **cree** -- le framework propose necessite une implementation et une evaluation pour avoir de la valeur scientifique
- **Mapping templates AEGIS :** Les 3 categories taxonomiques (direct, indirect, tool-based) s'alignent sur les categories du catalogue AEGIS -- DPI (#01-#35), IPI (#36-#60), tool-based (#61-#80). La Table 1 (Section 3.4) fournit une grille de correspondance exploitable.

### Citations cles
> "prompt injection represents a fundamental architectural vulnerability requiring defense-in-depth approaches rather than singular solutions" (Gulyamov et al., 2026, Abstract, p. 2)
> "Research demonstrates that just five carefully crafted documents can manipulate AI responses 90% of the time through Retrieval-Augmented Generation (RAG) poisoning" (Gulyamov et al., 2026, Abstract, p. 1)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 |
| Reproductibilite | N/A -- article de revue sans experience originale |
| Code disponible | Non |
| Dataset public | Non -- revue de litterature, pas de dataset original |
| Nature epistemique | [SURVEY] -- revue systematique descriptive sans contribution experimentale originale ; PALADIN est une [HEURISTIQUE] conceptuelle non validee |
