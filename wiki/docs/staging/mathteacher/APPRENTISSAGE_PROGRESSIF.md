# APPRENTISSAGE PROGRESSIF — Curriculum Mathematique
## De bac+2 (biologie/stats) a la lecture autonome des articles de recherche en injection de prompts

**Public cible** : Doctorant(e) avec un bac+2 en biologie/statistiques/mathematiques
**Objectif** : Maitriser les 22 formules mathematiques utilisees dans les 34 articles de la bibliographie AEGIS
**Duree totale estimee** : 45-55 heures (reparties sur 6-8 semaines)
**Date** : 2026-04-04

---

## Comment utiliser ce curriculum

1. **Commencez par le pre-test** (`SELF_ASSESSMENT_QUIZ.md`) pour identifier vos forces et faiblesses
2. **Suivez l'ordre des modules** — chaque module depend des precedents (voir le DAG ci-dessous)
3. **Faites TOUS les exercices** — les solutions completes sont fournies, mais essayez d'abord seul(e)
4. **Consultez le glossaire des symboles** (`GLOSSAIRE_SYMBOLES.md`) a tout moment comme reference
5. **Consultez le guide de notation** (`NOTATION_GUIDE.md`) quand une notation vous parait etrange
6. **Terminez par le post-test** pour mesurer votre progression

---

## Graphe de dependances des modules (DAG)

```
Module 1 : Algebre Lineaire (fondation)
    |
    +---> Module 2 : Probabilites & Statistiques
    |         |
    |         +---> Module 3 : Theorie de l'Information & Entropie
    |         |         |
    |         |         +---> Module 5 : Optimisation & Alignement (RLHF/DPO)
    |         |
    |         +---> Module 4 : Scores & Metriques de Detection
    |
    +---> Module 6 : Embeddings & Espaces Vectoriels
    |
    +---> Module 7 : Attention & Transformers (optionnel)
```

**Chemins de lecture possibles** :
- **Chemin complet** (recommande) : 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
- **Chemin "detection"** (prioritaire pour la these) : 1 -> 2 -> 4 -> 6
- **Chemin "alignement"** (comprendre pourquoi les LLM echouent) : 1 -> 2 -> 3 -> 5

---

## Vue d'ensemble des modules

| # | Module | Formules couvertes | Temps estime | Prerequis |
|---|--------|--------------------|--------------|-----------|
| 1 | Algebre Lineaire | 1.1 Cosine Sim, 2.2 Gauge Matrix, 6.3 Factorisation | 6-8h | Bac+2 maths |
| 2 | Probabilites & Statistiques | Distributions, esperance, variance, IC | 6-8h | Module 1 |
| 3 | Theorie de l'Information | 1.3 Cross-Entropy, 1.4 WCE, divergence KL | 7-9h | Module 2 |
| 4 | Scores & Metriques | 1.2 F1, 3.1-3.2 Sep(M), 3.4 ASR, 7.1 AUROC, 7.2 Seuil | 6-8h | Modules 1-2 |
| 5 | Optimisation & Alignement | 4.1 RLHF, 4.2 KL/token, 4.3 DPO, 4.4-4.5, 6.1, 6.4 | 8-10h | Module 3 |
| 6 | Embeddings & Espaces Vectoriels | 2.1 SemScore, 2.3 Contrastive, 5.1-5.4 | 6-8h | Modules 1-3 |
| 7 | Attention & Transformers | 3.3 Focus Score, mecanisme d'attention | 5-6h | Modules 1-2 |

**Total** : ~45-55 heures

---

## Mapping Formules -> Modules

| Formule (GLOSSAIRE) | Module |
|---------------------|--------|
| 1.1 Similarite Cosinus | Module 1 |
| 1.2 Precision/Recall/F1 | Module 4 |
| 1.3 Cross-Entropy | Module 3 |
| 1.4 Cross-Entropy Ponderee | Module 3 |
| 2.1 SemScore | Module 6 |
| 2.2 Gauge Matrix | Module 1 |
| 2.3 Contrastive Loss | Module 6 |
| 3.1 Sep(M) Formel | Module 4 |
| 3.2 Sep(M) Empirique | Module 4 |
| 3.3 Focus Score | Module 7 |
| 3.4 ASR | Module 4 |
| 4.1 Objectif RLHF | Module 5 |
| 4.2 KL Token par Token | Module 5 |
| 4.3 DPO Loss | Module 5 |
| 4.4 Fine-Tuning Contraint | Module 5 |
| 4.5 Harm Information | Module 5 |
| 5.1 DMPI-PMHFE | Module 6 |
| 5.2 Sentence-BERT | Module 6 |
| 5.3 Quantification 8-bit | Module 6 |
| 5.4 Fine-Tuning Standard | Module 5 |
| 6.1 Prefilling Attack | Module 5 |
| 6.2 Surprise Witness | Module 4 |
| 6.3 Factorisation Matricielle | Module 1 |
| 6.4 Gradient Bound | Module 5 |
| 7.1 AUROC | Module 4 |
| 7.2 Seuil Clustering | Module 4 |

---

## Mapping Formules -> Couches delta AEGIS

Chaque formule contribue a une couche de defense de l'architecture AEGIS :

| Couche | Role | Formules cles |
|--------|------|---------------|
| δ⁰ (alignement interne) | Proteger le modele de l'interieur | RLHF (4.1), DPO (4.3), Fine-Tuning Contraint (4.4), Harm Info (4.5) |
| δ¹ (detection pre-inference) | Bloquer les injections avant qu'elles n'atteignent le modele | Focus Score (3.3), DMPI-PMHFE (5.1), F1 (1.2), AUROC (7.1) |
| δ² (validation post-inference) | Verifier que la reponse n'a pas ete corrompue | SemScore (2.1), SBERT (5.2), Cosine Sim (1.1), Sep(M) (3.1-3.2) |
| δ³ (monitoring continu) | Surveiller en permanence la sante du systeme | ASR (3.4), toutes les metriques en mode monitoring |

---

## Ressources complementaires (acces libre)

- **3Blue1Brown** (YouTube) : "Essence of Linear Algebra" — visualisations exceptionnelles des vecteurs et matrices
- **Khan Academy** (FR) : Probabilites et statistiques — exercices interactifs
- **StatQuest** (YouTube) : Cross-entropy, ROC curves, gradient descent — explications visuelles
- **Jay Alammar** (blog) : "The Illustrated Transformer" — meilleure introduction visuelle aux transformers
- **Lilian Weng** (blog) : "From RLHF to DPO" — survol accessible de l'alignement
- **Wikipedia FR** : Articles sur la divergence KL, l'entropie, les martingales

---

## Conseils pratiques

1. **Ne sautez pas les exercices** : la lecture passive ne suffit pas pour maitriser les formules
2. **Utilisez un cahier** : recopiez les formules a la main, c'est prouve plus efficace que le copier-coller
3. **Reliez chaque formule a un article** : la motivation vient de comprendre POURQUOI c'est utilise
4. **N'ayez pas peur des notations** : le `GLOSSAIRE_SYMBOLES.md` et le `NOTATION_GUIDE.md` sont vos references permanentes
5. **Visez la comprehension, pas la memorisation** : vous n'avez pas besoin de deriver les formules, mais de comprendre ce qu'elles mesurent et pourquoi

---

*Curriculum genere le 2026-04-04 — Agent MathTeacher (Opus 4.6)*
*Base sur l'extraction MATHEUX de 22 formules issues de 34 articles*
