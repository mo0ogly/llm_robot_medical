# DISCOVERIES INDEX — Decouvertes Majeures de la These AEGIS

> **Ce repertoire est la MEMOIRE VIVANTE des decouvertes scientifiques.**
> Tous les agents DOIVENT le lire AVANT de travailler et le mettre a jour APRES.
> Les decouvertes evoluent a chaque RUN — elles ne sont jamais figees.

**Derniere mise a jour** : RUN-002 (2026-04-04)
**Corpus** : 46 articles (P001-P046)

---

## Decouvertes Classees par Impact

### CRITIQUE (change la direction de la these)

| ID | Decouverte | RUN | Confiance | Fichier |
|----|-----------|-----|-----------|---------|
| D-001 | **Triple Convergence** : δ⁰ effacable (P039) + δ¹ empoisonnable (P045) + juges bypass 99% (P044) = les 3 premieres couches simultanement vulnerables. δ³ seul survivant. | RUN-002 | 9/10 | [TRIPLE_CONVERGENCE.md](TRIPLE_CONVERGENCE.md) |
| D-002 | **Gap δ³ universel** : Aucun des 46 papers n'implemente concretement δ³. AEGIS est le SEUL systeme avec 5 techniques δ³ en production. | RUN-001→002 | 10/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-003 | **Alignement effacable** : Un seul prompt suffit a desaligner 15 LLMs (P039, Microsoft). L'alignement n'est pas contournable — il est effacable. | RUN-002 | 9/10 | [TRIPLE_CONVERGENCE.md](TRIPLE_CONVERGENCE.md) |

### HAUTE (renforce un argument majeur)

| ID | Decouverte | RUN | Confiance | Fichier |
|----|-----------|-----|-----------|---------|
| D-004 | **Paradoxe raisonnement/securite** : La capacite de raisonnement des LRM correle negativement avec la securite. 97.14% ASR autonome (P036, Nature Comms). | RUN-002 | 7/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-005 | **Amplification emotionnelle medicale** : La manipulation emotionnelle multiplie par 6 le taux de desinformation medicale (6.2% → 37.5%, P040). | RUN-002 | 8/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-006 | **CHER ≠ ASR** : Le taux de reussite d'attaque (ASR) et le dommage clinique reel (CHER) divergent substantiellement. Mesurer l'ASR seul est insuffisant en medical. (P035, MPIB) | RUN-002 | 8/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-007 | **Gradient d'alignement nul** : Preuve mathematique que le gradient RLHF est zero au-dela de l'horizon de nocivite (P019). Limitation structurelle, pas d'implementation. | RUN-001 | 10/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-008 | **Insuffisance δ⁰ prouvee** : 27/34 papers Phase 1 (79.4%) + 4 papers Phase 2 supportent C1. Score de confiance : 10/10. | RUN-001→002 | 10/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |

### MOYENNE (ouvre une piste)

| ID | Decouverte | RUN | Confiance | Fichier |
|----|-----------|-----|-----------|---------|
| D-009 | **System Prompt = vecteur d'attaque** : SPP (P045) montre que le system prompt, suppose de confiance, est un vecteur persistant. Toute session est affectee. | RUN-002 | 8/10 | [TRIPLE_CONVERGENCE.md](TRIPLE_CONVERGENCE.md) |
| D-010 | **Cosine similarity fragile** : La similarite cosinus (all-MiniLM-L6-v2) peut etre rendue insignifiante par matrice gauge (P012) et a des angles morts (antonymes, P013). | RUN-001 | 7/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-011 | **Erosion temporelle passive** : Les disclaimers medicaux chutent de 26.3% (2022) a 0.97% (2025) SANS attaque active (P030). | RUN-001 | 8/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-012 | **Benchmark renouvelable** : JBDistill (P043) propose des benchmarks qui se renouvellent automatiquement, reconnaissant la peremption rapide des evaluations statiques. | RUN-002 | 7/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |

---

## Historique des Decouvertes par RUN

| RUN | Decouvertes ajoutees | Decouvertes modifiees | Total |
|-----|---------------------|----------------------|-------|
| RUN-001 | D-002, D-007, D-008, D-010, D-011 | — | 5 |
| RUN-002 | D-001, D-003, D-004, D-005, D-006, D-009, D-012 | D-002 (confiance 9→10), D-008 (confiance 9→10) | 12 |

---

## Regles pour les Agents

1. **AVANT chaque RUN** : Lire DISCOVERIES_INDEX.md + fichiers references
2. **PENDANT le travail** : Chercher activement de nouvelles decouvertes dans les papers analyses
3. **APRES le RUN** : Mettre a jour ce fichier + creer/modifier les fichiers de decouverte
4. **Criteres pour une nouvelle decouverte** :
   - Supportee par >= 2 papers
   - Change la comprehension d'un axe de recherche OU ouvre un nouveau gap
   - Quantifiable (score de confiance, nombre de papers, metrique)
5. **Evolution des decouvertes** :
   - Confiance peut monter OU descendre selon les nouvelles preuves
   - Une decouverte peut etre INVALIDEE si contredite par >= 3 papers forts
   - Toujours documenter le POURQUOI du changement
