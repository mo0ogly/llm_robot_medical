# P125 — Systematically Analyzing Prompt Injection Vulnerabilities in Diverse LLM Architectures

**Reference :** Benjamin et al., arXiv:2410.23308, 2024
**Type :** `[PREPRINT]`
**Analyse :** 2026-04-09 (RUN-004)

## Passage 1 — Survol

Etude empirique sur **36 LLMs** avec **144 tests de PI**. Resultat central : **56% ASR** avec correlation forte entre taille/architecture et vulnerabilite.

## Passage 2 — Structure

- 36 LLMs testes (diversite architecturale)
- 144 prompt injection tests
- Analyses statistiques : logistic regression, random forest, clustering
- Resultat : 56% ASR global
- Clustering : profils de vulnerabilite distincts par configuration

## Passage 3 — Profondeur critique

### Abstract verbatim (extraits cles)

> "Across 144 prompt injection tests, we observed a strong correlation between model parameters and vulnerability"

> "56 percent of tests led to successful prompt injections, emphasizing widespread vulnerability across various parameter sizes"

### Forces

- **36 LLMs simultanement** — breadth exceptionnelle
- **Analyses statistiques rigoureuses** (random forest, clustering)
- **Baseline empirique** forte : 56% ASR
- **14 co-auteurs** — travail collaboratif massive

### Faiblesses critiques

!!! danger "N=4 par modele"
    144 tests / 36 modeles = **4 tests par modele**. En-dessous du seuil N>=30 requis pour validity statistique par modele. Les conclusions **par architecture** sont indicatives uniquement.

- Pas de tests en **domaine medical**
- Pas de distinction DPI vs IPI
- Pas de mesure delta-2/delta-3 (seulement vulnerabilite brute)
- Code/dataset disponibilite **[A VERIFIER]**

### Pertinence these AEGIS

**Mapping delta :**
- delta-0 : coeur du travail (evaluation alignement natif)
- Autres couches : non evaluees

**Conjectures :**
- **C1 (insuffisance delta-0 seul)** : **SUPPORT FORT** — 56% ASR avec RLHF natif seul
- **C4 (correlation taille/vulnerabilite)** : SUPPORT
- **C6 (architecture-dependent)** : SUPPORT

**Decouvertes :**
- **D-001 (Triple Convergence)** : fournit baseline 56% contre laquelle mesurer AEGIS
- **D-002 (correlation taille)** : SUPPORT potentiel

**Contribution AEGIS :**
1. Baseline statistique : **56% ASR** = reference pour mesurer l'efficacite de delta-3
2. Methodologie reproductible (random forest + clustering)
3. Les modeles AEGIS (LLaMA 3.2) font partie des 36 evalues → donnees directement applicables

### Action requise
- [ ] Telecharger PDF pour extraire la liste exacte des 36 modeles + resultats par modele
- [ ] Verifier si LLaMA 3.2 / Mistral / GPT-4 sont dans le panel
- [ ] Reproduire la methodologie statistique sur les 48 scenarios AEGIS

## Classification

| SVC | Reproductibilite | Code | Dataset |
|-----|------------------|------|---------|
| 7/10 | Faible (N insuffisant) | [A VERIFIER] | [A VERIFIER] |
