# P091 : Analyse doctorale

## [Krishna, Rastogi & Galinkin, 2025] — Weakest Link in the Chain: Security Vulnerabilities in Advanced Reasoning Models

**Reference** : arXiv:2506.13726v1
**Revue/Conf** : Preprint, juin 2025
**Lu le** : 2026-04-07
> **PDF Source**: [literature_for_rag/P_LRM_2506.13726.pdf](../../assets/pdfs/P_LRM_2506.13726.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (41 chunks, ~40 753 caracteres)

---

### Abstract original

> The introduction of advanced reasoning capabilities have improved the problem-solving performance of large language models, particularly on math and coding benchmarks. However, it remains unclear whether these reasoning models are more or less vulnerable to adversarial prompt attacks than their non-reasoning counterparts. In this work, we present a systematic evaluation of weaknesses in advanced reasoning models compared to similar non-reasoning models across a diverse set of prompt-based attack categories. Using experimental data, we find that on average the reasoning-augmented models are slightly more robust than non-reasoning models (42.51% vs 45.53% attack success rate, lower is better). However, this overall trend masks significant category-specific differences: for certain attack types the reasoning models are substantially more vulnerable (e.g., up to 32 percentage points worse on a tree-of-attacks prompt), while for others they are markedly more robust (e.g., 29.8 points better on cross-site scripting injection). Our findings highlight the nuanced security implications of advanced reasoning in language models and emphasize the importance of stress-testing safety across diverse adversarial techniques.
> — Source : PDF page 1

---

### Resume (5 lignes)

- **Probleme :** Le gain en securite des modeles de raisonnement par rapport aux modeles standard est mal compris, et pourrait varier selon le type d'attaque (Krishna et al., 2025, Section 1, p. 1).
- **Methode :** Evaluation comparative de 3 familles de modeles (DeepSeek, LLaMA/Nemotron, Qwen), chacune avec une variante raisonnement et une variante standard, sur 35 sondes adversariales couvrant 7 categories d'attaque (Krishna et al., 2025, Section 3, p. 3).
- **Donnees :** 210 evaluations modele-sonde (3 familles x 2 variantes x 35 sondes), critere strict de succes d'attaque (compliance complete requise) (Krishna et al., 2025, Section 3, p. 3).
- **Resultat :** En moyenne, les LRM sont legerement plus robustes (42.51% vs 45.53% ASR). Mais par categorie : tree-of-attacks prompt = +32 points de vulnerabilite pour les LRM, cross-site scripting = -29.8 points (plus robuste). DeepSeek-R1 : 34.94% vs 39.14% ; LLaMA Nemotron : 53.50% vs 58.64% ; Qwen : quasi-identique (39.08% vs 38.83%) (Krishna et al., 2025, Section 4, Table 2, Figure 1).
- **Limite :** 35 sondes est un echantillon petit pour 7 categories (5 par categorie), pas de tests statistiques formels, et les modeles compares ne sont pas parfaitement apparies (differentes versions, differents epochs d'entrainement) (Krishna et al., 2025, Section 4).

---

### Analyse critique

**Forces :**

1. **Question de recherche parfaitement ciblee** : l'etude pose la question fondamentale "le raisonnement rend-il plus ou moins sur ?" et y repond de maniere nuancee. Le resultat principal — "ca depend de la categorie d'attaque" — est exactement la complexite que C7 predit (Section 4.1-4.2).

2. **Design experimental soigne** : l'appariement reasoning/non-reasoning au sein de chaque famille (DeepSeek-R1 vs V3, LLaMA Nemotron vs LLaMA 3.3, QWQ vs Qwen 2.5) controle pour les differences architecturales et de donnees d'entrainement.

3. **Decouverte des patterns heterogenes** : le resultat le plus important est que les tree-of-attacks sont +32pp plus efficaces contre les LRM, ce qui suggere que le raisonnement aide le modele a "cooperer" avec des scenarios complexes construits par un attaquant sophistique.

4. **Implication pour NVIDIA** : Erick Galinkin (NVIDIA) est co-auteur, suggerant une validation industrielle des resultats.

**Faiblesses :**

1. **Echantillon tres petit** : 35 sondes sur 7 categories = 5 par categorie. Avec cette taille, les differences par categorie de 32pp ne sont pas testees statistiquement. L'absence de tests de significativite est problematique.

2. **Pas de mecanisme explicatif** : l'etude est purement descriptive. On sait que les tree-of-attacks sont plus efficaces contre les LRM, mais pas pourquoi. Pas d'analyse des traces CoT ou des representations internes.

3. **Categories d'attaque heterogenes** : melange de prompt injection, jailbreaking, XSS injection, DAN prompts — ces categories operent a des niveaux tres differents et la comparaison agrege est potentiellement trompeuse.

4. **Qwen sans changement** : le fait que QWQ et Qwen 2.5-Code soient quasi-identiques en securite (<0.3pp) suggere que les modifications de QWQ pour le raisonnement n'ont pas affecte significativement l'alignement — ou que les deux sont equalement mal alignes.

---

### Formules exactes

Aucune formule originale. Metrique unique :
- ASR = nombre d'attaques reussies / nombre total de tentatives (critere strict : compliance complete)

Lien glossaire AEGIS : F22 (ASR)

---

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF) : evalue indirectement via la comparaison reasoning/non-reasoning
  - δ¹ (system prompt) : teste via les DAN prompts et prompt injections
  - δ² (sanitization) : non adresse
  - δ³ (tool control) : non adresse

- **Conjectures :**
  - **C7 (paradoxe raisonnement/securite) : NUANCEE.** En moyenne, les LRM sont legerement meilleurs, mais pour certaines categories (tree-of-attacks), ils sont nettement pires. C7 n'est donc pas universelle mais conditionnelle au type d'attaque. Cette nuance est precieuse pour la these.

- **Decouvertes :**
  - D-013 (heterogeneite des vulnerabilites LRM) : confirmee — la securite varie dramatiquement selon la categorie d'attaque

- **Gaps :**
  - G-013 (mecanisme explicatif du pattern heterogene) : cree — pourquoi les tree-of-attacks sont-ils +32pp plus efficaces contre les LRM ?

- **Mapping templates AEGIS :** Les tree-of-attacks correspondent a nos templates multi-step (#07, #22), les DAN prompts aux templates de role-play (#18, #52-#58), et le XSS aux templates d'injection technique (#09, #49).

---

### Citations cles

> "on average the reasoning-augmented models are slightly more robust than non-reasoning models (42.51% vs 45.53% attack success rate, lower is better). However, this overall trend masks significant category-specific differences" (Abstract, p. 1)

> "for certain attack types the reasoning models are substantially more vulnerable (e.g., up to 32 percentage points worse on a tree-of-attacks prompt), while for others they are markedly more robust" (Abstract, p. 1)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Moyenne — sondes non specifiees en detail, modeles accessibles |
| Code disponible | Non mentionne |
| Dataset public | Non (sondes non publiees en detail) |
| Nature epistemique | [EMPIRIQUE] — etude comparative sans theorie |
| Type d'attaque | Survey / Comparative Security Assessment |
| MITRE ATLAS | AML.T0051 (Prompt Injection — multi-category) |
| OWASP LLM | LLM01 (Prompt Injection) |
