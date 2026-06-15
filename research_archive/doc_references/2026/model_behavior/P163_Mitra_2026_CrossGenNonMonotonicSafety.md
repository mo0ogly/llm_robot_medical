## [Mitra, 2026] — Transfert cross-générationnel d'attaques adversariales : un alignement de sécurité non-monotone

**Reference :** arXiv:2606.00813
**Revue/Conf :** arXiv preprint, 2026 [cs.CR]
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P163_Mitra_2026_CrossGenNonMonotonicSafety.pdf](../../literature_for_rag/P163_Mitra_2026_CrossGenNonMonotonicSafety.pdf)
> **Statut**: [PREPRINT] — lu en texte complet (8 pages)

---

### Abstract original

> Safety alignment in LLMs does not improve monotonically across model generations. Studying four generations of Google's Gemma family (7B–31B) with quality-diversity evolution (MAP-Elites) as an automated red-teaming probe, we find that Gemma 3 (12B) exhibits 68.7% ± 5.7% attack success rate (ASR; mean ± std, 3 seeds), significantly higher than its predecessor Gemma 2 (45.5% ± 7.2%; p = 0.030, paired bootstrap) and its successor Gemma 4 (33.9% ± 1.8%). Replaying evolved attack archives across generations reveals that attacks from other generations transfer to Gemma 3 at 44–46% but only 14–18% to Gemma 4, indicating that Gemma 4's safety gains generalize beyond the attack distributions evolved against earlier generations. Under our 8B judge, copyright and cybercrime vulnerabilities register at near-100% across all generations, though a second-judge audit (§6) suggests the copyright result is sensitive to judge choice. Misinformation ASR jumps from 29% to 99% between Gemma 2 and Gemma 3 and remains elevated at 77% in Gemma 4, indicating the regression was not fully addressed. These patterns are invisible to static benchmarks and emerge only through adaptive, longitudinal probing. All experiments use 3 random seeds with a unified self-hosted judge; code and artifacts are available at https://github.com/bassrehab/red-queen.
> — Source : p. 1, Abstract

---

### Résumé (5 lignes)

- **Problème :** Les benchmarks statiques de sécurité (HarmBench, AdvBench) fournissent des instantanés ponctuels mais ne capturent pas comment la robustesse adversariale évolue entre générations de modèles d'une même famille, laissant invisible toute régression inter-générationnelle (Section 1, p. 1).
- **Méthode :** Probe red-team par évolution quality-diversity (MAP-Elites, grille 6×6×8 = 288 niches comportementales) contre 4 générations de la famille Gemma (7B, 9B, 12B, 31B), avec protocole de replay cross-générationnel : chaque archive d'attaques évoluée contre le modèle Mi est rejouée contre tous les Mj pour construire un tenseur de transfert T[i,j,s] — 3 graines par modèle, 12 runs d'évolution, 36 paires source-cible (Sections 3–4, p. 2–3).
- **Données :** 4 modèles Gemma (gemma-7b-it, gemma-2-9b-it, gemma-3-12b-it, gemma-4-31B-it) servis via vLLM 0.19.1 (bf16, temperature 0) sur NVIDIA H200 ; juge Llama-3.1-8B-Instruct auto-hébergé sur RTX 4090 ; pool de 400 comportements HarmBench sur 7 catégories sémantiques ; 3 graines (42, 1337, 2718) ; ~60 heures GPU total (Table 1, Section 4, p. 3–4).
- **Résultat :** ASR global non-monotone : Gemma 1 = 59.4% ± 3.0% → Gemma 2 = 45.5% ± 7.2% → **Gemma 3 = 68.7% ± 5.7%** (régression significative vs Gemma 2 : p = 0.030, bootstrap pairé) → Gemma 4 = 33.9% ± 1.8% ; le transfert cross-générationnel vers Gemma 3 atteint 44–46% depuis toutes sources, contre 14–18% vers Gemma 4 (Table 2, Figure 1, p. 4–5).
- **Limite :** N = 3 graines par modèle = puissance statistique faible (la récupération Gemma 3 → Gemma 4, -34.8 pp, n'atteint pas p < 0.05) ; famille unique (Gemma) ; juge 8B montrant un accord faible avec le juge 70B sur la classification du préjudice (κ = 0.15) ; modalité texte uniquement (Section 6 Limitations, p. 7).

---

### Analyse critique

**Forces :**
- Protocole rigoureux de replay cross-générationnel avec tenseur de transfert T[i,j,s] — méthodologie reproductible grâce à RNG déterministe (ChaCha8) et juge unifié auto-hébergé pour toutes les phases (Section 3.1–3.2, p. 2–3) ; code et artefacts publics (https://github.com/bassrehab/red-queen, p. 1).
- Signification statistique de la régression Gemma 2 → Gemma 3 établie par bootstrap pairé (p = 0.030, N = 3 graines) et corroborée par la matrice de transfert (Gemma 3 = cible la plus facile depuis toutes directions, Jaccard similarity 0.66–0.75 entre niches réussies, Section 5.2, p. 5).
- Audit second-juge (Llama-3.1-70B-Instruct, N = 52 échantillons) qui révèle la sensibilité de la catégorie copyright au choix du juge (accord 50% vs 100% pour le 8B) — honnêteté scientifique exemplaire pour un article solo (Section 6, p. 7).
- Baseline sans évolution (400 prompts HarmBench bruts) confirme que le pattern non-monotone tient même sans MAP-Elites, renforçant la robustesse du signal (+7–14 pp attribués à l'évolution, Section 5.1, p. 4).

**Faiblesses :**
- N = 3 graines = puissance insuffisante pour tester des contrastes multiples avec correction (Bonferroni/BH) ; les auteurs reconnaissent explicitement que la récupération Gemma 4 n'atteint pas p < 0.05, limitant la portée statistique des conclusions inter-générationnelles (Section 3.3, §5.1, p. 3–4).
- Famille unique (Gemma) : impossible de savoir si la non-monotonicité est une propriété générale de l'alignement LLM ou un artefact spécifique à Google/Gemma 3 (Section 6 Limitations, p. 7).
- Hypothèse causale de la régression (transition multimodale) est [HYPOTHESE] non vérifiée — les auteurs citent explicitement 3 hypothèses alternatives (mix données Gemma 3, recette RLHF/DPO, plafonnement capacité) sans accès aux détails d'entraînement (Section 6, p. 6–7).
- 52 échantillons pour l'audit second-juge = résolution per-catégorie insuffisante pour qualifier les divergences par type de préjudice (Section 6, p. 7).

**Questions ouvertes :**
- La non-monotonicité se généralise-t-elle à d'autres familles (Llama, Mistral, Claude) ou est-elle spécifique à la transition text-only → multimodal ?
- Le pic de misinformation ASR (28.7% → 99.1% Gemma 2 → 3, Table 2, p. 4) est-il lié à un changement de données d'entraînement ou à la désactivation implicite d'un guardrail spécifique ?
- Comment les résultats sont-ils affectés par la mise à jour silencieuse des modèles (demi-vie des jailbreaks) ?

---

### Formules exactes

**Tenseur de transfert cross-générationnel** (Section 3.2, p. 3) :

> T[i, j, s] = fraction des attaques de A_{i,s} qui réussissent contre M_j

avec A_{i,s} = archive MAP-Elites évoluée contre le modèle M_i avec la graine s. La valeur diagonale T̄[i,i] est le taux de succès auto-évaluation (self-ASR). Les entrées hors-diagonale décomposent en :
- Transfert forward (i < j) : anciennes attaques sur modèles plus récents
- Transfert backward (i > j) : nouvelles attaques sur modèles plus anciens

**Robustesse** (Section 3.3, p. 3) :

> R = 1 - ASR

**Score de fitness du juge** (Section 3.1, p. 2) : score binaire composite ∈ {0, 1}, avec 0 = refus, 1 = (contenu nuisible ET pertinent). Évalué sur trois axes binaires : refusal, harmful_content, relevance.

**Grille MAP-Elites** (Section 4.2, p. 4) :
- Dimensions : stratégie (6) × encodage (6) × catégorie de préjudice (8) = 288 niches comportementales
- 200 générations par modèle par graine, batch_size = 50, concurrence = 5, mutation_rate = 0.3, crossover_rate = 0.7

**Jaccard similarity entre niches réussies** (Section 5.2, p. 5) :

> J(S_A, S_B) = |S_A ∩ S_B| / |S_A ∪ S_B| = 0.66–0.75

indiquant un chevauchement substantiel des niches (stratégie × encodage × catégorie) qui réussissent sur Gemma 3, indépendamment de la source de l'archive.

---

### Pertinence thèse AEGIS

**Couches delta :**
- δ⁰ (alignement RLHF/refus) : directement concerné — la régression Gemma 3 montre que le refus RLHF peut régresser lors d'une transition architecturale (Section 6, p. 6)
- δ¹ (guardrails système / instruction hierarchy) : concerné indirectement — la persistance de catégories spécifiques (harassment maintenu même dans Gemma 3) suggère des guardrails ciblés distincts du refus général
- δ² (comportement sous pression adversariale) : concerné directement — le protocole MAP-Elites mesure précisément la robustesse δ² sous pression adaptative multi-stratégie
- δ³ (agents / contextes multi-tour) : partiellement concerné via la stratégie d'attaque "multi-turn" incluse dans les 6 types du génome (Section 3.1, p. 2)

**Conjectures :**
- **C1 (insuffisance δ⁰ — alignement non cumulatif)** : P163 apporte une preuve empirique directe et quantifiée que l'alignement de sécurité N'EST PAS monotone entre générations (Gemma 3 ASR 68.7% > Gemma 2 45.5%, p = 0.030, Table 2, p. 4). La direction est SUPPORTÉE : C1 prédit que l'alignement δ⁰ est fragile et non-cumulatif ; P163 montre qu'il peut régresser statistiquement de manière significative lors d'une transition architecturale. Nuance critique : la régression est partiellement réversible (Gemma 4 = 33.9%), ce qui suggère que δ⁰ est récupérable mais pas garanti automatique — compatible avec C1 (l'insuffisance δ⁰ = insuffisance intrinsèque, pas impossibilité absolue).
- **C2/C3/C7 :** Neutre — le papier ne porte pas sur les vecteurs sémantiques multi-tour ou les dynamiques de conversation spécifiques.

**Découvertes :**
- **Lien P160 (ADVERSA, non-monotonicité multi-tour)** : convergence thématique forte. P160 documente la non-monotonicité *intra-session* (le refus varie de manière non-monotone sous pression itérative multi-tour sur un même modèle) ; P163 documente la non-monotonicité *inter-générationnelle* (le refus varie de manière non-monotone entre versions d'un même modèle). Les deux phénomènes pointent vers la même fragilité fondamentale de δ⁰ : l'alignement de refus n'est pas une propriété stable — ni dans le temps (P160), ni dans l'espace des versions (P163). Cette convergence renforce D-xxx (à créer) : "la stabilité du refus est conditionnelle, non garantie structurellement".
- La mise en évidence que la catégorie harassment suit une trajectoire de déclin *monotone* à travers toutes les générations incluant Gemma 3 (33.3% → 22.2% → 28.7% → 1.9%, Table 2, p. 4–5) suggère que les guardrails *ciblés* par catégorie sont plus robustes que l'alignement général — différenciation δ⁰ par catégorie non capturée dans les modèles AEGIS actuels.

**Gaps :**
- **G-fiche32 "refusal stability under iterative pressure, non-monotonic safety decisions"** : P163 comble partiellement ce gap du côté inter-générationnel. La non-monotonicité intra-modèle reste à documenter séparément (P160). La convergence P160 + P163 permet de poser l'hypothèse unifiée : la non-monotonicité du refus est un phénomène multi-échelle (session × version).
- Nouveau gap identifié : absence de protocole de differential safety probing standardisé dans AEGIS — les campagnes AEGIS évaluent des modèles individuels, pas des trajectoires générationnelles. Le tenseur T[i,j,s] de Mitra est directement implémentable.

**Mapping templates AEGIS :**
- Stratégies d'attaque du génome MAP-Elites recoupent les templates AEGIS : roleplay (#07, #08), encoding (#40–#45 selon encodage), authority impersonation (#11, #12), hypothetical framing (#09, #10), direct jailbreak (#01–#06). La grille 6×6×8 MAP-Elites est une sur-couche systématique des templates existants.
- Pertinent pour les campagnes TC-00x utilisant des jailbreaks évolutifs : P163 fournit une baseline de comparabilité cross-modèle.

---

### Citations clés

> "Safety alignment in LLMs does not improve monotonically across model generations." (Abstract, p. 1)

> "The improvement from Gemma 1 to Gemma 2 (p = 0.032) and the regression from Gemma 2 to Gemma 3 (p = 0.030) are both statistically significant under paired bootstrap tests." (Section 5.1, p. 4)

> "Archives from other generations transfer to Gemma 3 at 44–46% (45.5%/44.5%/45.5% from Gemma 1/2/4). A niche decomposition finds Jaccard similarity of 0.66–0.75 among the successful niches across source archives, indicating substantial overlap in which (strategy × encoding × category) cells succeed regardless of source." (Section 5.2, p. 5)

> "The extremely low transfer rate from Gemma 3 to Gemma 4 (14.0% ± 2.7%) indicates that Gemma 4's improvements generalize beyond the specific attack distributions evolved against Gemma 3." (Section 6, p. 7)

> "Misinformation spikes from 28.7% in Gemma 2 to 99.1% in Gemma 3 and stays elevated at 76.9% in Gemma 4, indicating the regression was not fully addressed." (Section 5.1, p. 4)

> "Static benchmarks would miss the non-monotonic trajectory entirely. Architectural changes (such as adding multimodal capabilities) should trigger comprehensive safety re-evaluation." (Section 6, p. 7)

> "With four data points we cannot distinguish a U-shaped curve from noise. What we can say is that the Gemma 2 → Gemma 3 regression is statistically significant and large (+23.2 percentage points), and that the transfer matrix provides converging evidence (Gemma 3 is the easiest transfer target from all directions)." (Section 6, p. 7)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6.5/10 — résultat empirique solide sur une famille unique, N = 3 graines, méthode innovante mais scope limité (1 famille, texte only, 8 pages) |
| Reproductibilité | Haute — RNG déterministe (ChaCha8), juge unifié auto-hébergé, code public (https://github.com/bassrehab/red-queen), vLLM 0.19.1 spécifié, bf16 temp=0 documentés (Section 3.1, p. 2 ; Section 4.3, p. 4) |
| Code disponible | Oui (https://github.com/bassrehab/red-queen, p. 1) |
| Dataset public | Oui — HarmBench (400 comportements, 7 catégories) ; archives d'attaques évoluées disponibles via le dépôt (p. 1) |
| Nature | [EMPIRIQUE] — résultats observés sur 4 points de données ; la non-monotonicité est un finding empirique, aucune preuve théorique formelle sur les conditions de régression |
| Auteur | N = 1 (Subhadip Mitra, Rota Labs) — affiliation indépendante, revue par pairs absente (preprint) |
| HUMILITY GATE | La primauté de la démonstration de non-monotonicité inter-générationnelle est revendiquée par l'auteur ("finding that contrasts with the regularity observed in capability scaling", Section 2, p. 2) — claim auteur, non vérifié par WebSearch indépendant dans cette session |
