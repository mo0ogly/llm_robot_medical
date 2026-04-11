# RETEX — Deep Analysis P0 Lot 1 (7 papiers)

> **Date** : 2026-04-04
> **Methode** : Lecture texte complet via ChromaDB (pas d'abstracts) — modele Opus
> **Qualite** : 1500-2300 mots par papier, formules exactes, critique methodologique

---

## 1. Elements pour le DIRECTEUR — Decisions a prendre

### Recherches supplementaires a lancer

| Action | Source | Priorite | Skill |
|--------|--------|----------|-------|
| Chercher replications de P052 (preuve martingale) — 1 seul papier Cambridge | P052 analyse | HAUTE | /bibliography-maintainer |
| Chercher si P044 (AdvJudge) a ete replique sur des juges safety (pas seulement correctitude) | P044 analyse | CRITIQUE | /bibliography-maintainer |
| Chercher defenses contre compound PIDP (P054 n'en teste aucune) | P054 analyse | HAUTE | /bibliography-maintainer |
| Obtenir le PDF complet P029 JAMA (paywall) — donnees cruciales pour F58 MVP | P029 analyse | HAUTE | Manuel |

### Theories a formuler / formaliser

| Formule | Source | Action | Skill |
|---------|--------|--------|-------|
| F58 (MVP) — numerateur confirme par P029 (94.4%) mais denominateur manque | P029 | Formaliser avec donnees P068 CARES + P069 MedRiskEval | MATHEUX |
| F46 (Recovery Penalty) — theorie P052 mais ZERO validation empirique | P052 | Concevoir experience de calibration | /aegis-prompt-forge |
| ASR_deterministic — P044 invalide l'ASR par juge, besoin d'alternative | P044 | Definir metrique basee sur delta-3 patterns | MATHEUX + SCIENTIST |

### Experiences a creer dans la Forge

| Experience | Source | Quoi tester | Skill |
|-----------|--------|-------------|-------|
| Calibration F46 Recovery Penalty | P052 (Theoreme 19-22) | Lambda optimal, positions a faible I_t | /aegis-prompt-forge FORGE |
| PIDP compound sur AEGIS | P054 (ASR 98%) | RagSanitizer resiste-t-il au compound? | /aegis-prompt-forge FORGE |
| Judge fuzzing | P044 (99% flip) | Nos templates AEGIS flippent-ils le juge? | /aegis-prompt-forge FORGE |
| Sep(M) medical | P024 + P029 | Sep(M) sur corpus medical AEGIS | Backend benchmark |

### Conjectures — Mise a jour

| Conj | Avant | Apres P0 | Justification |
|------|-------|----------|---------------|
| C1 | 10/10 | 10/10 RENFORCE | P052 Theoreme 10 = preuve formelle, P018 = preuve empirique, P001 = evidence fondatrice |
| C2 | 10/10 | 10/10 RENFORCE | P024 Sep(M) compromis separation-utilite prouve, P044 juges flippables |
| C3 | 10/10 | 10/10 RENFORCE | P052 martingale + P018 shallow alignment = double preuve |
| C4 | 9/10 | 9/10 | Pas de nouvelle evidence directe dans ce lot |
| C5 | 8/10 | 8.5/10 | P024 montre limites cosinus, P044 montre limites juges embeddings |
| C6 | 9/10 | 9.5/10 | P029 94.4% ASR medical = evidence forte, mais MVP pas formellement calcule |
| C7 | 8/10 | 8/10 | P054 compound mais pas LRM specifique |

---

## 2. Preuves extraites (a propager dans discoveries/)

### Preuves formelles (niveau theoreme)

| Preuve | Papier | Formule | Implication |
|--------|--------|---------|-------------|
| Theoreme 10 (gradient zero au-dela horizon) | P052 | F45 | C1 PROUVE formellement |
| Sep(M) compromis separation-utilite | P024 | F15/F16 | C2 δ³ necessaire |
| KL equilibrium D_KL^(t) proportionnel a I_t | P052 | F45 | Explique mecanistiquement la superficialite |
| Logit Gap = classifieur lineaire superficiel | P044 | F33b | Juges LLM structurellement vulnerables |

### Preuves empiriques (niveau experience)

| Resultat | Papier | Chiffre | Implication |
|---------|--------|---------|-------------|
| 86.1% apps vulnerables | P001 | 31/36 | C1 evidence large |
| ASR medical 94.4% | P029 | 216 evaluations | C6 evidence forte |
| PIDP compound ASR 98% | P054 | 8 LLMs, 3 datasets | D-013 compound attacks |
| Judge flip 99.91% | P044 | zero-shot | LLM-as-Judge invalide |
| Shallow alignment tokens 1-3 | P018 | ICLR Outstanding | C3 evidence mecanistique |

---

## 3. Ce qui manque pour le lot suivant

### Papiers P0 restants (3)

| Papier | Pourquoi P0 | Action |
|--------|-------------|--------|
| P036 Hagendorff LRM | C7 paradoxe raisonnement, 97.14% multi-turn | Lancer deep-analyst |
| P050 JMedEthicBench | C6 medical, MTSD 9.5→5.5 | Lancer deep-analyst |
| P057 ASIDE architectural | D-015, defense delta-3 | Lancer deep-analyst |

### Actions LIBRARIAN requises

1. Propager les 7 analyses P0 de `_staging/analyst/` vers `doc_references/202*/`
2. Mettre a jour MANIFEST.md avec les nouvelles metadonnees
3. Mettre a jour INDEX_BY_DELTA.md et INDEX_BY_CONJECTURE.md
4. Verifier que chaque .md pointe vers son PDF

### Actions SCIENTIST requises

1. Mettre a jour CONJECTURES_TRACKER.md (C5 8→8.5, C6 9→9.5)
2. Mettre a jour DISCOVERIES_INDEX.md (nouvelles preuves formelles)
3. Creer de nouvelles research_requests a partir des gaps identifies
4. Produire un briefing DIRECTOR_BRIEFING mis a jour

---

## 4. Bilan qualite

| Metrique | Ancien (abstract) | Nouveau (fulltext) |
|----------|-------------------|-------------------|
| Mots par analyse | 200-300 | 1500-2300 |
| Formules extraites | 0-1 (paraphrasees) | 3-30 (notation exacte) |
| Critique methodologique | Absente | Systematique (N, biais, reproductibilite) |
| Gaps identifies | 0-1 generiques | 2-7 specifiques et actionnables |
| Tag verification | Absent | [ARTICLE VERIFIE] / [PAYWALL] |
| Lien PDF | Absent | Systematique |
