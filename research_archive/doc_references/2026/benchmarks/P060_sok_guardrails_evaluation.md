# P060: SoK: Evaluating Jailbreak Guardrails for Large Language Models
**Auteurs**: Xunguang Wang, Zhenlan Ji, Wenxuan Wang, Zongjie Li, Daoyuan Wu, Shuai Wang (HKUST, Renmin University of China, Lingnan University)
**Venue**: IEEE Symposium on Security and Privacy (S&P) 2026, Cycle 1 (accepte) ; arXiv:2506.10597v2
> **PDF Source**: [literature_for_rag/P060_2506.10597.pdf](../../literature_for_rag/P060_2506.10597.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (117 chunks, ~103 000 caracteres)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Wang et al. presentent le premier SoK (Systematization of Knowledge) holistique sur les guardrails contre les jailbreaks de LLM, accepte a IEEE S&P 2026 -- la venue de reference en securite informatique. La contribution est triple : (1) une taxonomie multi-dimensionnelle classifiant les guardrails selon six dimensions (stage d'intervention, paradigme technique, granularite de securite, reactivite, applicabilite, explicabilite), (2) un framework d'evaluation SEU (Security-Efficiency-Utility) capturant les compromis pratiques du deploiement, et (3) une analyse empirique extensive montrant qu'aucun guardrail unique ne domine sur tous les types d'attaques (Section 1-3, p. 1-6).

### Methodologie

Les auteurs compilent l'ensemble des travaux existants sur les guardrails de jailbreak et les classifient selon leur taxonomie a six dimensions (Table 1, Section 3.3). Le framework SEU evalue chaque guardrail sur trois axes : Security (Sec = 1 - ASR), Efficiency (Eff = 1 / (Latency + Cost)), et Utility (Util = 1 - FPR) (Section 3.4, p. 5-6).

L'evaluation empirique couvre 13 guardrails (PerplexityFilter, SmoothLLM, Llama Guard Pre/Post, GradSafe, GradientCuff, SelfDefend Direct/Intent, WildGuard Pre/Post, PromptGuard, GuardReasoner Pre/Post) contre des attaques variees : IJP, GCG, AutoDAN, DrAttack, MultiJail, ActorAttack, X-Teaming (Table 3, Section 4).

### Resultats cles

- **Aucun guardrail ne domine** : sur les 13 guardrails evalues, aucun n'atteint simultanement un ASR faible, une latence faible et un FPR bas sur tous les types d'attaques (Section 4, Table 3)
- **Guardrails session-level vulnerables** : Llama Guard (Post), WildGuard (Post), GuardReasoner (Post) maintiennent un ASR > 10% contre ActorAttack (multi-turn). Contre X-Teaming (adaptatif), l'ASR depasse 90% pour la plupart des guardrails (Table 3, Section 4)
- **GradientCuff exception partielle** : ASR de 64% contre X-Teaming, meilleur que les autres (> 90%) mais insuffisant (Table 3)
- **Latence variable** : les guardrails ajoutent entre -1.0 et +3.5 secondes de delai selon le type d'attaque (Figure 4, Section 4)
- **Innovation siloed** : le paysage actuel est fragmente, chaque equipe developpant des solutions ad hoc sans cadre unifie (Section 1, p. 2)

### Limitations admises par les auteurs

Les auteurs reconnaissent : (1) la taxonomie est un instantane du paysage actuel qui evoluera rapidement, (2) l'evaluation empirique couvre un sous-ensemble des guardrails et attaques existants, (3) les guardrails multi-modaux et les defenses specifiques aux agents ne sont pas couverts, (4) le framework SEU ne capture pas toutes les dimensions pertinentes (ex: robustesse aux attaques adaptatives, scalabilite).

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Lien glossaire AEGIS |
|----|---------|-------------------|----------------------|
| F53 | $$\text{SEU}(g) = (\text{Sec}(g), \text{Eff}(g), \text{Util}(g))$$ | Sec = 1 - ASR, Eff = 1/(Latency + Cost), Util = 1 - FPR | F53 (Security-Efficiency-Utility Framework) |
| F54 | $$T(g) = [\text{stage}, \text{paradigm}, \text{granularity}, \text{react}, \text{applic}, \text{explain}]$$ | Vecteur taxonomique a 6 dimensions. Stage in {input, output, both}, paradigm in {rule, ML, LLM, hybrid}, etc. | F54 (Six-Dimensional Guardrail Taxonomy Vector) |

**Variables** :
- $g$ : un guardrail specifique
- $\text{Sec}(g) = 1 - \text{ASR}$ : securite (proportion d'attaques bloquees)
- $\text{Eff}(g) = 1 / (\text{Latency} + \text{Cost})$ : efficience (inverse de la latence et du cout)
- $\text{Util}(g) = 1 - \text{FPR}$ : utilite (proportion de requetes legitimes non bloquees)
- $T(g)$ : classification taxonomique du guardrail sur 6 axes

**Nature epistemique** : [SURVEY] avec composante empirique. La taxonomie est une construction conceptuelle originale ; les mesures SEU sont empiriques.

---

## Section 3 — Critique methodologique

### Forces

1. **IEEE S&P 2026** — acceptation a la venue de reference absolue en securite. Poids academique maximal pour la these AEGIS (Section 1, p. 1).
2. **Taxonomie originale et systematique** — les 6 dimensions couvrent de maniere exhaustive les aspects pertinents de classification des guardrails (Section 3.3, Table 1).
3. **Framework SEU tri-dimensionnel** — capture les compromis reels du deploiement, pas seulement la securite isolee. Directement comparable au SVC AEGIS (Section 3.4, p. 5-6).
4. **Evaluation empirique large** — 13 guardrails x 7 types d'attaques. La couverture est la plus extensive du corpus AEGIS (Table 3, Section 4).
5. **Resultat principal structurant** — l'absence de guardrail universel valide empiriquement l'architecture multi-couches delta-0 a delta-3 AEGIS.
6. **Guardrails session-level analyses** — l'evaluation couvre les defenses multi-tour (ActorAttack, X-Teaming), pas seulement single-turn.

### Faiblesses

1. **Instantane temporel** — le paysage evolue rapidement ; l'evaluation sera partiellement obsolete en quelques mois.
2. **Guardrails couverts non exhaustifs** — NeMo Guardrails, OpenAI Content Filter, Anthropic Constitutional AI ne sont pas dans l'evaluation empirique.
3. **Pas de domaine medical** — aucun guardrail n'est evalue dans un contexte clinique. La specificite medicale (vocabulaire, risque patient) n'est pas prise en compte.
4. **SEU ne capture pas l'adaptivite** — la robustesse aux attaques adaptatives (attaquant connaissant la defense) n'est pas une dimension du framework.
5. **Pas de metriques composites** — le SEU presente 3 dimensions independantes sans score agrege, laissant le praticien sans recommandation claire.
6. **Multi-modal absent** — les guardrails pour les modeles vision-langage ne sont pas couverts.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C1** (delta-0 insuffisant) | CRITIQUE | Aucun guardrail seul ne domine — validation IEEE S&P | L'alignement RLHF (delta-0) ne suffit pas, meme avec guardrails supplementaires |
| **C3** (alignement superficiel) | FORT | ASR > 90% contre X-Teaming pour la plupart des guardrails | Les attaques adaptatives contournent systematiquement les defenses |
| **C6** (universalite impossible) | CRITIQUE | Resultat central du SoK : pas de guardrail universel | Validation empirique directe par la premiere etude systematique (IEEE S&P) |

### Couches delta

- **delta-0 (alignment guardrails)** : evalue directement. L'alignement RLHF est une des dimensions "paradigm" de la taxonomie.
- **delta-1 (input filtering)** : evalue via les guardrails Pre-processing (Llama Guard Pre, WildGuard Pre, PromptGuard).
- **delta-2** : non applicable directement (pas de dimension RAG dans le framework).
- **delta-3 (detection/monitoring)** : les guardrails Post-processing (Llama Guard Post, GuardReasoner Post) sont des mecanismes delta-3. Leur echec (ASR > 90% contre X-Teaming) confirme la necessite de delta-3 plus sophistiques.

### Formules AEGIS impactees

- **F53 (SEU)** : directement definie par P060. Le framework SEU doit etre implemente dans AEGIS pour evaluer les 66 techniques de defense de la taxonomie. Cela fournirait une validation calibree IEEE S&P.
- **F54 (Taxonomie 6D)** : complementaire a la taxonomie AEGIS 4-classes/66-techniques et a la classification CrowdStrike 95/95. Le mapping entre les 6 dimensions P060 et la structure AEGIS est un travail d'integration identifie.
- **Technique T48 (Guardrail SEU Tradeoff Exploitation)** : un attaquant strategique peut profilier le tradeoff SEU d'un systeme cible et cibler la dimension la plus faible.

### Decouverte D-001 (Triple Convergence)

P060 fournit la validation empirique la plus forte de D-001 a ce jour, dans une venue de reference : aucun guardrail seul ne peut resoudre le probleme de securite LLM. La triple convergence (attaque automatisee + defense insuffisante + alignement superficiel) est confirmee par le SoK le plus exhaustif du domaine.

### Gaps identifies (RUN-003)

P060 genere ou renforce 8 gaps (G-013 a G-021, documentes dans THESIS_GAPS.md). Les plus critiques :
- **G-021** : guardrails emergents publies apres le SoK P060 (hors couverture)
- **Evaluation SEU des 66 techniques AEGIS** : testable immediatement

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P060 |
| **Type** | SoK (Systematization of Knowledge) avec evaluation empirique |
| **Domaine** | Guardrails LLM, jailbreak defense, evaluation systematique |
| **Guardrails evalues** | 13 : PerplexityFilter, SmoothLLM, Llama Guard (Pre/Post), GradSafe, GradientCuff, SelfDefend (Direct/Intent), WildGuard (Pre/Post), PromptGuard, GuardReasoner (Pre/Post) |
| **Attaques testees** | 7 : IJP, GCG, AutoDAN, DrAttack, MultiJail, ActorAttack, X-Teaming |
| **Metrique principale** | SEU framework ; ASR > 90% pour la plupart des guardrails contre X-Teaming (Table 3) |
| **delta-layers** | δ⁰ (alignment), δ¹ (input filtering), δ³ (detection/monitoring) |
| **Conjectures** | C1 (critique), C3 (fort), C6 (critique) |
| **Reproductibilite** | Elevee — framework public, guardrails open-source, protocole detaille |
| **Code disponible** | Probable (arXiv, guardrails publics) |
| **Dataset public** | Oui (attaques et benchmarks publics) |
| **SVC pertinence** | 10/10 |
| **Tags** | [ARTICLE VERIFIE], IEEE S&P 2026, SoK, SEU framework, taxonomie 6D, guardrails, universalite |
