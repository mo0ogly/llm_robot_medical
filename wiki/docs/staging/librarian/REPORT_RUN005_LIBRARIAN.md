# REPORT RUN-005 -- Agent LIBRARIAN
## Propagation incrementale des 16 analyses (P087-P104, excl. P088/P105/P106)

**Date** : 2026-04-07
**Mode** : INCREMENTAL
**Papiers propages** : 16 (sur 18 analyses ; P088 = doublon P036, P105 = doublon P088, P106 = inexploitable)
**Total corpus** : 76 papiers indexes (60 + 16 nouveaux)

---

## 1. Fichiers mis a jour

| Fichier | Action | Contenu |
|---------|--------|---------|
| `MANIFEST.md` | INCREMENTAL | 16 nouvelles lignes ajoutees (P087-P104), compteurs mis a jour (76 papiers) |
| `INDEX_BY_DELTA.md` | INCREMENTAL | 13 entrees ajoutees a la section delta-0, 14 a delta-1, 4 a delta-2 ; table Cross-Layer etendue ; observations RUN-005 ajoutees |
| `GLOSSAIRE_MATHEMATIQUE.md` | INCREMENTAL | 8 nouvelles formules (9.1-9.8) ajoutees en Section 9, DAG etendu, 2 nouveaux chemins critiques |

## 2. Fichiers crees dans doc_references/

| Chemin | Papier |
|--------|--------|
| `2024/prompt_injection/P099_Russinovich_2024_Crescendo.md` | Crescendo Multi-Turn |
| `2025/prompt_injection/P087_Kuo_2025_HCoT.md` | H-CoT |
| `2025/prompt_injection/P089_Nguyen_2025_SEAL.md` | SEAL Stacked Ciphers |
| `2025/prompt_injection/P093_Sabbaghi_2025_AdvReasoning.md` | Adversarial Reasoning |
| `2025/prompt_injection/P095_Zhou_2025_Tempest.md` | Tempest Tree Search |
| `2025/prompt_injection/P100_Ren_2025_ActorBreaker.md` | ActorBreaker |
| `2025/prompt_injection/P103_Yao_2025_Mousetrap.md` | Mousetrap Iterative Chaos |
| `2025/prompt_injection/P104_Ying_2025_RACE.md` | RACE Reasoning-Augmented |
| `2025/benchmarks/P090_Zhou_2025_HiddenRisksR1.md` | Hidden Risks R1 |
| `2025/benchmarks/P091_Krishna_2025_WeakestLink.md` | Weakest Link |
| `2025/benchmarks/P098_Hadeliya_2025_LongContextSafety.md` | Long-Context Safety |
| `2025/model_behavior/P092_Yong_2025_SelfJailbreaking.md` | Self-Jailbreaking |
| `2025/defenses/P102_Huang_2025_SafetyHeads.md` | Safety Heads + AHD |
| `2026/prompt_injection/P094_Zhao_2026_CoTHijacking.md` | CoT Hijacking |
| `2026/prompt_injection/P096_Li_2026_Mastermind.md` | Mastermind |
| `2026/prompt_injection/P097_Li_2026_STAR.md` | STAR State-Dependent |
| `2026/benchmarks/P101_Cao_2026_SafeDialBench.md` | SafeDialBench (ICLR 2026) |

## 3. Pages wiki creees

16 pages wiki creees dans `wiki/docs/research/bibliography/` en miroir de la structure doc_references/ :
- `2024/prompt_injection/` : 1 page (P099)
- `2025/prompt_injection/` : 7 pages (P087, P089, P093, P095, P100, P103, P104)
- `2025/benchmarks/` : 3 pages (P090, P091, P098)
- `2025/model_behavior/` : 1 page (P092)
- `2025/defenses/` : 1 page (P102)
- `2026/prompt_injection/` : 3 pages (P094, P096, P097)
- `2026/benchmarks/` : 1 page (P101)

## 4. Papiers exclus

| ID | Raison | Action |
|----|--------|--------|
| P088 | Doublon de P036 (Nature Communications = version finale du preprint arXiv) | Non propage |
| P105 | Doublon de P088 = doublon de P036 | Non propage |
| P106 | Inexploitable (donnees insuffisantes pour analyse doctorale) | Non propage |

## 5. Repartition par domaine (apres RUN-005)

| Domaine | Avant (RUN-003) | Apres (RUN-005) | Delta |
|---------|-----------------|-----------------|-------|
| Attack / Prompt Injection | 17 | 28 | +11 |
| Defense | 16 | 17 | +1 |
| Benchmark / Survey | 7 | 11 | +4 |
| Embedding / Semantic Drift | 5 | 5 | 0 |
| Model Behavior / RLHF | 4 | 5 | +1 |
| Medical AI Security | 12 | 12 | 0 |
| **Total** | **60** | **76** | **+16** |

## 6. Repartition par annee (apres RUN-005)

| Annee | Avant | Apres | Delta |
|-------|-------|-------|-------|
| 2023 | 1 | 1 | 0 |
| 2024 | 8 | 9 | +1 |
| 2025 | 37 | 47 | +10 |
| 2026 | 14 | 19 | +5 |

## 7. Couverture delta-layers (apres RUN-005)

| Couche | Avant | Apres | Delta |
|--------|-------|-------|-------|
| delta-0 | 35 | 48 | +13 |
| delta-1 | 33 | 47 | +14 |
| delta-2 | 27 | 31 | +4 |
| delta-3 | 9 | 9 | 0 |

**Observation critique** : delta-3 reste a 9/76 malgre 16 nouveaux papiers. Aucun des papiers RUN-005 n'implemente delta-3 concretement. L'argument pour delta-3 dans la these est renforce a chaque RUN.

## 8. Nouvelles formules (GLOSSAIRE)

8 formules ajoutees (9.1-9.8), portant le total de 35 a 43 :
- 2 [EMPIRIQUE] : 9.1 (LRM State Transition), 9.2 (Security Entropy), 9.8 (SFR Multi-Turn)
- 6 [ALGORITHME] : 9.3 (SEAL Gradient Bandit), 9.4 (Adversarial Reasoning Loss), 9.5 (STAR Multi-Turn), 9.6 (Refusal Direction + AHD), 9.7 (ActorBreaker Self-Talk)

2 nouveaux chemins critiques :
- Chemin 9 : Paradoxe raisonnement/securite (C7)
- Chemin 10 : Erosion multi-tour (MSBE)

## 9. Validation

| Critere | Resultat |
|---------|----------|
| Zero doublon dans MANIFEST | PASSE (77 lignes, 76 IDs uniques + header) |
| Zero orphelin (fichier sans MANIFEST) | PASSE (16/16 fichiers references) |
| Coherence analyses-indexes | PASSE |
| P088/P105/P106 correctement exclus | PASSE |
| Wiki pages en miroir | PASSE (16/16 pages creees) |
| Notation Unicode delta | PASSE (delta-0/delta-1/delta-2/delta-3 converti en prose, tableau utilise delta-X pour compatibilite Markdown) |

## 10. Recommandations pour le DIRECTOR

1. **RUN-004 gap** : Les papiers P061-P086 (RUN-004 ANALYST) ne sont PAS dans le MANIFEST. Un run LIBRARIAN incremental est necessaire pour les propager. Le MANIFEST passe de P060 a P087 avec un gap de 26 papiers.
2. **C7 a formaliser** : 8 papiers RUN-005 soutiennent la conjecture C7 (paradoxe raisonnement/securite). Le MATHEUX recommande de la promouvoir de conjecture a fait etabli dans le manuscrit.
3. **AHD a tester** : P102 (Attention Head Dropout) est le candidat de defense le plus prometteur de RUN-005. A integrer experimentalement dans AEGIS.
4. **Compound attack** : Combiner T39 (long-context, P098) + T40 (Crescendo, P099) pour tester G-037.

---

*Agent LIBRARIAN -- RUN-005 complete*
*76 papiers indexes, 43 formules, 16 pages wiki*
*Notation Unicode : delta-0 delta-1 delta-2 delta-3 conforme CLAUDE.md*
