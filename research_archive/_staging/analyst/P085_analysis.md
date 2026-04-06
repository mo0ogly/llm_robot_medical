## [Hossain, Shayoni, Ameen, Islam, Mridha, Shin, 2025] — A Multi-Agent LLM Defense Pipeline Against Prompt Injection Attacks

**Reference :** arXiv:2509.14285v4
**Revue/Conf :** IEEE WIECON-ECE 2025 (11th International Conference)
**Lu le :** 2026-04-05
> **PDF Source**: [literature_for_rag/P085_2509.14285.pdf](../../literature_for_rag/P085_2509.14285.pdf)
> **Statut**: [ARTICLE VERIFIE] — accepte IEEE WIECON-ECE 2025, lu via WebFetch arXiv HTML

### Abstract original
> Prompt injection attacks represent a major vulnerability in Large Language Model (LLM) deployments, where malicious instructions embedded in user inputs can override system prompts and induce unintended behaviors. This paper presents a novel multi-agent defense framework that employs specialized LLM agents in coordinated pipelines to detect and neutralize prompt injection attacks in real-time. Testing encompassed 55 unique prompt injection attacks, grouped into 8 categories and totaling 400 attack instances across two LLM platforms (ChatGLM and Llama2).
> — Source : arXiv abstract page

### Resume (5 lignes)
- **Probleme :** Les injections de prompt peuvent overrider le system prompt et induire des comportements non voulus (Section 1)
- **Methode :** Deux architectures : (1) pipeline sequentiel chaine-d'agents (Guard agent post-generation), (2) pipeline hierarchique avec Coordinator pre-input (Section 3)
- **Donnees :** 55 attaques uniques, 8 categories, 400 instances totales, teste sur ChatGLM-6B et Llama2-13B (Section 4)
- **Resultat :** 0% ASR post-defense (reduction de 30% ChatGLM et 20% Llama2 a 0%) sur toutes les categories (Section 5, Table)
- **Limite :** Pas de test contre attaques adaptatives, pas d'evaluation IPI ou multi-tour avancee, pas d'analyse FPR sur requetes benines (Section 6)

### Analyse critique

**Forces :**
- **Deux architectures comparees** : Le papier compare sequentiel (defense-in-depth, post-generation) et hierarchique (prevention, pre-input). Les deux atteignent 0% ASR, montrant que le design defensif est robuste quel que soit le pattern (Section 3-4).
- **Couverture categorielle** : 8 categories d'attaque (direct overrides, code execution, data exfiltration, formatting, obfuscation, tool manipulation, role-play, multi-turn) — plus diverse que la plupart des benchmarks (Section 4.1).
- **Guard agent multi-couches** : Policy validation + output redaction + format enforcement + character filtering + delegation blocking. C'est un systeme de filtrage comprehensif (Section 3.2).
- **Accepte IEEE** : Peer-reviewed, meme si WIECON-ECE n'est pas un top-tier.

**Faiblesses :**
- **ASR 0% = signal d'alarme methodologique** : Un ASR de 0% sur 400 instances est soit un resultat remarquable, soit un artefact d'evaluation. Plusieurs indicateurs suggerent le second :
  - Le baseline est faible : 30% (ChatGLM) et 20% (Llama2) sans defense — ces modeles sont deja relativement resistants. Les attaques sont peut-etre trop simples.
  - Pas de test adaptatif : Les attaques sont statiques. Un attaquant qui s'adapte aux defenses (adaptive adversary, cf. Carlini & Wagner 2017) trouverait probablement des contournements.
  - Pas de FPR rapportee : Si le Guard agent bloque tout ce qui est suspect, il pourrait aussi bloquer des requetes legitimes. L'absence d'analyse FPR est une lacune majeure.
- **N = 400 mais seulement 55 uniques** : 400 instances de 55 attaques = ~7 repetitions par attaque. Statistiquement faible pour des conclusions generalisables. Comparer avec AEGIS qui exige N >= 30 par condition (Zverev et al., 2025, ICLR).
- **Modeles anciens** : ChatGLM-6B (2022) et Llama2-13B (2023). Pas de test sur GPT-4, Claude, Llama 3.x, ou tout modele contemporain. Les resultats ne sont pas transferables aux modeles actuels.
- **Guard agent = LLM** : Le Guard agent est lui-meme un LLM. La vulnerabilite recursive (attaquer le garde plutot que la cible) n'est pas evaluee — meme probleme que P083 (AegisLLM) et P044 (AdvJudge).
- **Pas de metriques formelles** : Pas de Sep(M), pas de SVC, pas de Wilson CI. Les resultats sont des comptages bruts (attaque reussie / echouee).
- **Conference de faible impact** : IEEE WIECON-ECE — conference regionale, pas un top-tier. Impact factor et visibilite limites.

**Questions ouvertes :**
- Que se passe-t-il avec des attaques adaptatives qui ciblent specifiquement les heuristiques du Guard agent ?
- Le framework resiste-t-il aux injections indirectes (documents RAG empoisonnes) ?
- Quelle est la latence ajoutee par le pipeline 2-3 agents sur des requetes en temps reel ?
- Le 0% ASR tient-il sur des modeles modernes (Llama 3.2, GPT-4o) avec des attaques sophistiquees (GCG, AutoDAN, PAIR) ?

### Formules exactes
- Pas de formules mathematiques dans le papier. Les metriques sont des comptages : ASR = attaques reussies / total (Section 5) [EMPIRIQUE — sans IC ni test statistique]
- Lien glossaire AEGIS : F22 (ASR) — mais sans les garanties statistiques d'AEGIS (Wilson CI, N >= 30)

### Pertinence these AEGIS — COMPARAISON DIRECTE delta-3

- **Couches delta :**
  - Guard agent = δ¹ avance (verification comportementale par LLM)
  - Coordinator = δ¹ (classification pre-input par LLM)
  - Policy validation / character filtering = δ² (regles deterministes)
  - **Pas de δ³** : Aucune validation formelle des contraintes de sortie
- **Conjectures :**
  - C1 (δ⁰ insuffisant) : **SUPPORTEE** — le papier ajoute des defenses car δ⁰ ne suffit pas (baseline 20-30% ASR)
  - C2 (δ³ necessaire) : **NON ADRESSE** — le papier ne discute pas δ³ et pretend que δ¹+δ² suffisent (0% ASR). Mais la faiblesse methodologique (pas d'attaques adaptatives, modeles anciens) rend cette pretention non generalisable.
  - C3 (alignement superficiel) : **NEUTRE** — hors scope
- **Decouvertes :** Pas de lien direct
- **Gaps :**
  - G-001 (implementation δ³) : **NON ADRESSE**
  - G-003 (red-team medical) : **NON ADRESSE**
  - G-014 (heterogeneite metriques) : **ILLUSTRE** — le papier utilise des metriques non standardisees sans IC, exemplifiant le probleme identifie par P048
- **Mapping templates AEGIS :** Le Guard agent bloquerait les templates basiques (#01, #08, #11) mais serait probablement vulnerable aux templates sophistiques (#07 multi-turn, #14 authority medical, #25 tool hijack) car les attaques testees sont relativement simples

### AEGIS fait quelque chose que P085 ne fait PAS

1. **Validation formelle (δ³)** : AEGIS validate_output() = deterministe. P085 utilise un LLM Guard = non deterministe et manipulable.
2. **Metriques rigoureuses** : Sep(M), SVC 6 dimensions, Wilson CI, N >= 30. P085 = comptages bruts sans IC.
3. **Attaques sophistiquees** : 98 templates + moteur genetique + attaques multi-tour + manipulation semantique. P085 = 55 attaques statiques relativement basiques.
4. **Modeles contemporains** : AEGIS teste sur Llama 3.2 via Ollama. P085 teste sur ChatGLM-6B (2022) et Llama2-13B (2023).
5. **Domaine medical** : 48 scenarios chirurgicaux (Da Vinci Xi). P085 = aucun domaine specifique.
6. **Defense multi-couches δ⁰-δ³** : AEGIS integre 4 couches. P085 = δ¹+δ² seulement.
7. **Attaques adaptatives** : Le moteur genetique AEGIS est par definition adaptatif — il evolue pour contourner les defenses. P085 n'a aucune attaque adaptative.

### P085 fait quelque chose qu'AEGIS ne fait PAS

1. **Architecture hierarchique avec Coordinator** : Le routage pre-input (benin vs malveillant) avant le LLM principal est un pattern que AEGIS n'implemente pas explicitement — dans AEGIS, le filtrage se fait par le RagSanitizer sur les donnees et le shield sur le prompt, mais sans agent Coordinator dedie.
2. **Comparaison architecturale** : Sequentiel vs hierarchique — cette comparaison structurelle est absente d'AEGIS qui n'a qu'une architecture.

### Citations cles
> "100% mitigation, reducing ASR to 0%" (Section 5)
> — Source : arXiv:2509.14285

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Faible — modeles anciens, pas de code public mentionne, attaques non publiees en detail |
| Code disponible | Non mentionne |
| Dataset public | Non — attaques custom non publiees |
