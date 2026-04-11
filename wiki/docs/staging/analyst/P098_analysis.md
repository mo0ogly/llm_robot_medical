# P098 — Analyse doctorale

## [Hadeliya, Jauhar, Sakpal & Cruz, 2025] — When Refusals Fail: Unstable Safety Mechanisms in Long-Context LLM Agents

**Reference :** arXiv:2512.02445v1
**Revue/Conf :** AAAI 2026 (copyright notice indique www.aaai.org)
**Lu le :** 2026-04-07
> **PDF Source**: [literature_for_rag/P_MSBE_2512.02445.pdf](../../assets/pdfs/P_MSBE_2512.02445.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (59 chunks)

### Abstract original
> Solving complex or long-horizon problems often requires large language models (LLMs) to use external tools and operate over a significantly longer context window. New LLMs enable longer context windows and support tool calling, but this study investigates the safety-capability trade-offs under long context. Building upon the AgentHarm benchmark, the authors study how agent performance and refusal behavior change with context padding. Models with 1M-2M token context windows show severe degradation already at 100K tokens, with performance drops exceeding 50% for both benign and harmful tasks. Refusal rates shift unpredictably: GPT-4.1-nano increases from ~5% to ~40% while Grok 4 Fast decreases from ~80% to ~10% at 200K tokens.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** L'expansion des fenetres de contexte (1M-2M tokens) pose la question de la stabilite de l'alignement de securite des agents LLM sous contexte long — un angle orthogonal aux attaques multi-tour classiques (Hadeliya et al., 2025, Section 1, p. 1).
- **Methode :** Extension du benchmark AgentHarm avec 4 types de padding de contexte (random, non-relevant, relevant, multi-task) en 2 positions (before/after) sur 4 modeles : GPT-4.1-nano (1M), GPT-5 (400K), DeepSeek-V3.1 (128K), Grok 4 Fast (2M) (Section 3, p. 2).
- **Donnees :** Sous-ensemble simplest de AgentHarm (taches avec hint + detailed instructions), taches benignes et nuisibles couvrant 11 categories (cyberoffense, desinformation, fraude) (Section 3, p. 2).
- **Resultat :** Degradation severe des capacites agentiques au-dela de 100K tokens malgre des fenetres declarees de 1-2M ; refusal rates instables et imprevisibles — GPT-4.1-nano augmente de ~5% a ~40%, Grok 4 Fast diminue de ~80% a ~10% au meme seuil (Figure 2, p. 3).
- **Limite :** Sous-ensemble simplest uniquement (upper bound de performance) ; differences de providers API (OpenAI vs OpenRouter) pouvant introduire des filtres externes non controlables ; GPT-5 non teste au-dela de 10K pour les taches benignes (cout) (Section 5, p. 4).

### Analyse critique

**Forces :**
1. **Decouverte majeure** : le comportement de refus n'est pas un trait stable du modele mais une propriete dependante du contexte. La divergence entre GPT-4.1-nano (augmentation des refus) et Grok 4 Fast (diminution) sous le meme regime de padding demontre que les mecanismes de securite reagissent de maniere fondamentalement differente a l'allongement du contexte (Figure 2, p. 3). C'est une forme d'erosion de frontiere non adversariale.
2. **Typologie de padding** bien concue : random (controle), non-relevant (texte coherent hors domaine), relevant (texte du domaine), multi-task (taches semantiquement proches). Le padding relevant surpasse systematiquement le random pour GPT-4.1-nano (Figure 3, p. 3), suggerant que la coherence semantique du contexte module la degradation.
3. **Position du padding** influence significativement : "before" (entre system prompt et tache) degrade moins que "after" (apres la tache), car le modele doit atteindre a travers le padding pour retrouver les instructions (Figure 4, p. 4).
4. **Distinction** entre refus immediat (upfront) et refus retarde (apres debut d'execution) : le second est plus dangereux car le modele peut avoir deja effectue des actions partiellement nuisibles (reconnaissance, exfiltration) (Section 5, p. 4).

**Faiblesses :**
1. **Pas de mecanisme explicatif** : les auteurs observent le phenomene mais ne proposent ni explication mecaniste (attention heads, representations internes) ni modele theorique. C'est un travail descriptif plus qu'analytique.
2. **Seulement 4 modeles** avec des contextes declares tres differents, rendant les comparaisons inter-modeles difficiles. L'heterogeneite des providers API (Section 5) est un confound non resolu.
3. **Pas de lien avec les attaques multi-tour** : le papier traite du padding statique, pas de l'evolution conversationnelle. L'intersection entre contexte long et multi-tour (ou le padding est le resultat naturel de tours multiples) n'est pas exploree.
4. **Metric Harm Score** basee sur combinaison de deux juges binaires (refusal + semantic) avec un seul LLM, sans validation humaine systematique.

**Questions ouvertes :**
- Le mode collapse observe sur Grok 4 Fast entre 50K et 100K tokens est-il un artefact de la position embedding (RoPE) ou un phenomene fondamental de l'attention ?
- L'instabilite des refus sous contexte long pourrait-elle etre exploitee activement comme vecteur d'attaque (injection de padding adversariale) ?
- Quelle est l'interaction entre ce phenomene et le MSBE multi-tour (P097) ?

### Formules exactes

Pas de formulation mathematique originale dans ce papier. Les auteurs utilisent le Harm Score d'AgentHarm (combinaison binaire de refusal judge + semantic judge) sans le formaliser davantage (Section 3, p. 2).

Lien glossaire AEGIS : F22 (ASR — le Harm Score est un proxy d'ASR agentique)

### Pertinence these AEGIS

- **Couches delta :** δ⁰ (la degradation sous contexte long est un phenomene inherent au modele, independant de la sophistication de l'attaque — le padding peut etre entierement benin)
- **Conjectures :** C1 (fragilite de l'alignement) **fortement supportee** — l'alignement se degrade sans aucune attaque, simplement par augmentation du contexte ; C3 (scaling des vulnerabilites) **supportee** — des fenetres de contexte plus grandes declarees (2M) ne signifient pas des fenetres de contexte securisees
- **Decouvertes :** D-003 (erosion progressive) **confirmee par un mecanisme different** — ici l'erosion est passive (padding benin) plutot qu'active (prompts adversariaux). D-017 (instabilite des metriques de securite) **confirmee** — le taux de refus est instable et non monotone.
- **Gaps :** RR-FICHE-001 (MSBE) **partiellement adresse** — le papier montre que l'erosion de frontiere peut etre passive (contexte long) en plus d'active (multi-tour). Gap nouveau : intersection entre contexte long et attaque multi-tour non etudiee.
- **Mapping templates AEGIS :** #76 (context overflow padding — correspondance directe), #77 (context overload prompting)

### Citations cles
> "Refusal rates shift unpredictably: GPT-4.1-nano increases from ~5% to ~40% while Grok 4 Fast decreases from ~80% to ~10% at 200K tokens." (Section 1, Abstract, p. 1)
> "Refusal rate alone doesn't distinguish two failure modes: immediate refusal (upfront from task description) and delayed (after beginning execution)." (Section 5, p. 4)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Moyenne — benchmark AgentHarm public mais couts eleves (GPT-5, Grok 4 Fast) |
| Code disponible | Non mentionne |
| Dataset public | AgentHarm (public) |
