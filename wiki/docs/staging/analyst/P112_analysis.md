## [Ramakrishnan & Balaji, 2025] — Securing AI Agents Against Prompt Injection Attacks: A Comprehensive Benchmark and Defense Framework

**Reference :** arXiv:2511.15759v1
**Revue/Conf :** Preprint, non publie en conference
**Lu le :** 2026-04-08
> **PDF Source**: [literature_for_rag/P112_securing_ai_agents.pdf](../../assets/pdfs/P112_securing_ai_agents.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (32 chunks)

### Abstract original
> Retrieval-augmented generation (RAG) systems have emerged as powerful tools for enhancing large language model capabilities, yet they introduce significant security vulnerabilities through prompt injection attacks. We present a systematic benchmark for evaluating prompt injection risks in RAG-enabled AI agents and propose a multi-layered defense framework. Our benchmark encompasses 847 adversarial test cases across five attack categories: direct injection, context manipulation, instruction override, data exfiltration, and cross-context contamination. We evaluate three defense mechanisms -- content filtering with embedding-based anomaly detection, hierarchical system prompt guardrails, and multi-stage response verification -- across seven state-of-the-art language models. Results demonstrate that our combined defense framework reduces successful attack rates from 73.2% to 8.7% while maintaining 94.3% of baseline task performance. We release our benchmark dataset and defense implementations to facilitate future research in AI agent security.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les systemes RAG manquent de benchmarks standardises pour evaluer les vulnerabilites de prompt injection, et les defenses existantes (filtrage d'input, prompt engineering) sont insuffisantes individuellement.
- **Methode :** Benchmark de 847 cas d'attaque en 5 categories et 3 niveaux de sophistication, framework de defense a 3 couches (content filtering + guardrails + response verification), ablation study sur chaque composant. (Section 4-5)
- **Donnees :** 847 cas adversariaux (200 templates de base + 647 variations) + 500 contextes benins pour FPR ; 7 modeles testes (GPT-4, GPT-3.5, Claude 2.1, PaLM 2, Llama 2 70B, Mistral 7B, Vicuna 13B). (Table 1, Section 4.1, p.3)
- **Resultat :** ASR baseline 73.2%, reduit a 8.7% avec le framework complet (Table 2, p.7) ; TPR maintenu a 94.3% ; FPR 5.7% ; Claude 2.1 baseline le plus resistant (61.4% ASR) vs Mistral 7B le plus vulnerable (82.3%). (Table 2-3, Section 6.2-6.3, p.7-8)
- **Limite :** Benchmark anglais uniquement ; evaluation sur patterns d'attaque statiques ; text-only (pas multimodal) ; verifieur de response = single point of failure. (Section 7.1, p.9)

### Analyse critique

**Forces :**
- Taxonomie d'attaque en 5 categories (DPI, context manipulation, instruction override, data exfiltration, cross-context contamination) est utile et actionnable. (Section 2.3, p.2-3)
- Approche defense-in-depth avec ablation study montrant la complementarite des 3 couches (Section 6.5, p.8).
- Overhead computationnel mesure et negligeable (~2.1% latence totale) (Section 6.6, p.8).
- Preservation de la performance (94.3% TPR) avec security gain important (88.1% reduction ASR).

**Faiblesses :**
- Modeles evalues sont des versions anciennes (GPT-4-0613, Claude 2.1, Llama 2, Mistral 7B v0.1) — les conclusions ne transferent pas necessairement aux modeles 2025-2026 avec safety training ameliore. (Section 6.1, p.6)
- Pas de comparaison avec d'autres frameworks de defense (GMTP, RAGDefender, etc.) — positionnement dans la litterature incomplet.
- Le benchmark de 847 cas est modeste compare aux evaluations a grande echelle (PoisonedRAG: 1000+ questions). Le processus de generation des variations n'est pas detaille — risque de biais de selection.
- La metrique "attack success" n'est pas definie avec precision — qui juge ? LLM-juge (manipulable) ou regle deterministe ?
- Les references incluent des papiers dont l'existence est douteuse (Hines et al. 2023, Zhang et al. 2023 — pages non standards, pas de DOI). [SOURCE A VERIFIER]
- Pas de code public malgre la promesse dans l'abstract.

**Questions ouvertes :**
- Comment le framework se comporte-t-il contre des attaques adaptatives qui ciblent specifiquement le verificateur de reponse ?
- Generalisation multilingue (cross-lingual attacks) ?
- Benchmark public reellement disponible ?

### Formules exactes

**Eq. 1** (Section 5.1, p.4) — Anomaly score :
score(p) = alpha * d_min(e_p, R) - beta * d_min(e_p, A)

Lien glossaire AEGIS : F22 (ASR)

### Pertinence these AEGIS

- **Couches delta :**
  - **delta-1** (content filtering, guardrails) : la couche de defense pre-generation correspond a la couche architecturale delta-1.
  - **delta-2** (response verification) : la verification post-generation correspond a la couche delta-2 de monitoring.
  - **delta-0** non directement adressee (pas de modification RLHF).
- **Conjectures :**
  - **C6 (defense layering)** : supportee — l'ablation study montre que chaque couche seule est insuffisante (content filtering: 41% ASR residuel, guardrails ajoutees: 23.4%, framework complet: 8.7%). La defense en profondeur est validee empiriquement.
  - **C1 (structural bypass)** : neutre — les attaques testees sont principalement semantiques, pas structurelles.
- **Decouvertes :** D-007 (RAG vulnerability) confirmee avec 73.2% ASR baseline.
- **Gaps :**
  - **G-027 (RAG defense)** : partiellement adresse — le framework propose une approche defense-in-depth mais sans validation sur corpus medical.
  - Ne cree pas de nouveau gap significatif.
- **Mapping templates AEGIS :** #01-#06 (direct injection), #19 (self-query metadata injection), #40 (extraction structured exfil), #41 (guardrails bypass) — le benchmark couvre des categories similaires.

### Citations cles
> "our combined defense framework reduces successful attack rates from 73.2% to 8.7%" (Abstract, p.1)
> "Claude 2.1 exhibits the lowest baseline attack success rate (61.4%)" (Section 6.3, p.7)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Faible — modeles anciens, benchmark non encore public, references douteuses |
| Code disponible | Non (promis mais non fourni) |
| Dataset public | Non (promis mais non fourni) |
