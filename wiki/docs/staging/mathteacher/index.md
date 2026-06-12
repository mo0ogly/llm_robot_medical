# Cours de mathematiques --- Prof de maths AEGIS

<p class='agent-badge agent-badge--mathteacher'>AGENT &middot; MATHTEACHER (Opus 4.6)</p>

<div class='phase-strip'><span><strong>Phase 4</strong></span><span>16 fichiers</span><span>22 formules</span><span>34 articles</span><span>45-55 h</span><span>6-8 semaines</span></div>

!!! abstract curriculum "Curriculum mathematique structure"
    Cours produit par l'agent **MATHTEACHER** (Opus 4.6) du pipeline `/bibliography-maintainer`. Public cible : doctorant(e) avec un bac+2 en biologie, statistiques ou mathematiques. Objectif : maitriser les **22 formules** utilisees dans les **34 articles** AEGIS, en autonomie.

## Comment utiliser ce cours

1. **Pre-test** ([`SELF_ASSESSMENT_QUIZ.md`](SELF_ASSESSMENT_QUIZ.md)) pour identifier forces et lacunes.
2. **Suivre l'ordre des modules** selon le DAG ci-dessous.
3. **Faire TOUS les exercices** ; solutions fournies, essayer seul(e) d'abord.
4. **Garder le glossaire ouvert** ([`GLOSSAIRE_SYMBOLES.md`](GLOSSAIRE_SYMBOLES.md)).
5. **Consulter** [`NOTATION_GUIDE.md`](NOTATION_GUIDE.md) si la notation surprend.
6. **Repasser le quiz** a la fin pour mesurer la progression.

Curriculum complet : [`APPRENTISSAGE_PROGRESSIF.md`](APPRENTISSAGE_PROGRESSIF.md) (DAG, chemins de lecture, mapping formules-modules-couches delta).

## Graphe de dependances des modules

```mermaid
flowchart TD
    M1["Module 1<br/>Algebre Lineaire<br/>(fondation, 6-8h)"]
    M2["Module 2<br/>Probabilites & Statistiques<br/>(6-8h)"]
    M3["Module 3<br/>Theorie de l Information<br/>(7-9h)"]
    M4["Module 4<br/>Scores & Metriques<br/>(6-8h)"]
    M5["Module 5<br/>Optimisation & Alignement<br/>(8-10h)"]
    M6["Module 6<br/>Embeddings & Espaces Vectoriels<br/>(6-8h)"]
    M7["Module 7<br/>Attention & Transformers<br/>(optionnel, 5-6h)"]
    M8["Module 8<br/>LRM & Erosion multi-tour"]
    M1 --> M2
    M1 --> M6
    M1 --> M7
    M2 --> M3
    M2 --> M4
    M3 --> M5
    M5 --> M8
    M6 --> M8
    style M1 fill:#00bcd4,color:#fff
    style M4 fill:#ff9800,color:#fff
    style M5 fill:#ff9800,color:#fff
```

## Trois chemins de lecture

| Chemin | Sequence | Pour qui ? |
|--------|----------|-----------|
| <span class='track-chip track-chip--full'>Complet</span> | 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 | Doctorant(e) qui prepare la lecture autonome des 34 articles AEGIS |
| <span class='track-chip track-chip--detection'>Detection</span> | 1 -> 2 -> 4 -> 6 | Focus Sep(M), ASR, F1, AUROC, embeddings de detection |
| <span class='track-chip track-chip--alignment'>Alignement</span> | 1 -> 2 -> 3 -> 5 | RLHF, DPO, divergence KL, fine-tuning contraint |

## Curriculum et guides de reference

| Fichier | Role | Lignes |
|---------|------|-------:|
| [`APPRENTISSAGE_PROGRESSIF.md`](APPRENTISSAGE_PROGRESSIF.md) | Curriculum complet : DAG, chemins, mapping | 131 |
| [`GLOSSAIRE_SYMBOLES.md`](GLOSSAIRE_SYMBOLES.md) | Glossaire des symboles mathematiques | 287 |
| [`NOTATION_GUIDE.md`](NOTATION_GUIDE.md) | Guide de notation mathematique | 246 |
| [`SELF_ASSESSMENT_QUIZ.md`](SELF_ASSESSMENT_QUIZ.md) | Pre-test et post-test d'auto-evaluation | 445 |

## Modules de cours

| # | Fichier | Titre | Lignes | Prerequis |
|---|---------|-------|-------:|-----------|
| 1 | [`Module_01_Algebre_Lineaire.md`](Module_01_Algebre_Lineaire.md) | Algebre lineaire pour la securite des LLM | 372 | <span class='prereq-chip prereq-chip--base'>Bac+2</span> |
| 2 | [`Module_02_Probabilites_Statistiques.md`](Module_02_Probabilites_Statistiques.md) | Probabilites et statistiques | 458 | <span class='prereq-chip prereq-chip--m1'>M1</span> |
| 3 | [`Module_03_Theorie_Information.md`](Module_03_Theorie_Information.md) | Theorie de l'information et entropie | 431 | <span class='prereq-chip prereq-chip--m2'>M2</span> |
| 4 | [`Module_04_Scores_Metriques.md`](Module_04_Scores_Metriques.md) | Scores et metriques de detection | 1566 | <span class='prereq-chip prereq-chip--m12'>M1-2</span> |
| 5 | [`Module_05_Optimisation_Alignement.md`](Module_05_Optimisation_Alignement.md) | Optimisation et alignement | 1106 | <span class='prereq-chip prereq-chip--m3'>M3</span> |
| 6 | [`Module_06_Embeddings_Espaces_Vectoriels.md`](Module_06_Embeddings_Espaces_Vectoriels.md) | Embeddings et espaces vectoriels | 604 | <span class='prereq-chip prereq-chip--m13'>M1-3</span> |
| 7 | [`Module_07_Attention_Transformers.md`](Module_07_Attention_Transformers.md) | Attention et Transformers (optionnel) | 324 | <span class='prereq-chip prereq-chip--m12'>M1-2</span> |
| 8 | [`Module_08_LRM_Erosion_MultiTour.md`](Module_08_LRM_Erosion_MultiTour.md) | LRM et erosion multi-tour | 810 | <span class='prereq-chip prereq-chip--m56'>M5-6</span> |

## Mapping formules vers couches delta AEGIS

| Couche | Role | Formules cles |
|--------|------|---------------|
| <span class='delta-chip delta-chip--d0'>delta-0</span> alignement interne | Proteger le modele de l'interieur | RLHF (4.1), DPO (4.3), Fine-Tuning Contraint (4.4), Harm Info (4.5) |
| <span class='delta-chip delta-chip--d1'>delta-1</span> detection pre-inference | Bloquer avant inference | Focus Score (3.3), DMPI-PMHFE (5.1), F1 (1.2), AUROC (7.1) |
| <span class='delta-chip delta-chip--d2'>delta-2</span> validation post-inference | Verifier la reponse | SemScore (2.1), SBERT (5.2), Cosine Sim (1.1), Sep(M) (3.1-3.2) |
| <span class='delta-chip delta-chip--d3'>delta-3</span> monitoring continu | Surveiller en permanence | ASR (3.4), toutes les metriques en mode monitoring |

## Ressources externes complementaires

- **3Blue1Brown** (YouTube) : Essence of Linear Algebra.
- **Khan Academy** (FR) : probabilites et statistiques.
- **StatQuest** (YouTube) : cross-entropy, ROC, gradient.
- **Jay Alammar** (blog) : The Illustrated Transformer.
- **Lilian Weng** (blog) : From RLHF to DPO.

## Conseils pratiques

1. Ne pas sauter les exercices : la lecture passive ne suffit pas.
2. Recopier les formules a la main est plus efficace que copier-coller.
3. Relier chaque formule a un article : la motivation vient du **pourquoi**.
4. Garder GLOSSAIRE_SYMBOLES.md et NOTATION_GUIDE.md ouverts.
5. Viser la comprehension, pas la memorisation.

## Rapports d'execution (tracabilite)

| Fichier | Lignes |
|---------|-------:|
| [`PHASE4_MATHTEACHER_REPORT_RUN002.md`](PHASE4_MATHTEACHER_REPORT_RUN002.md) | 158 |
| [`PHASE4_MATHTEACHER_RUN003.md`](PHASE4_MATHTEACHER_RUN003.md) | 201 |
| [`REPORT_RUN005_MATHTEACHER.md`](REPORT_RUN005_MATHTEACHER.md) | 187 |

---

*Curriculum genere par l'agent **MATHTEACHER** (Opus 4.6) du skill `/bibliography-maintainer`. Voir aussi [Matheux](../matheux/index.md).*
