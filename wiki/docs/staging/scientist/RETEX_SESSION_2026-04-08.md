# RETEX Session 2026-04-08 — Pipeline Autonome + Campagnes Experimentales

> **Duree** : ~3h
> **Agents lances** : 13 (9 pipeline + 1 experience + 3 paralleles)
> **Contexte** : continuation session RUN-005 + peer-preservation + Triple Convergence

---

## 1. Realisations

### Pipeline bibliography-maintainer RUN-005 (COMPLET)

| Phase | Agent | Resultat | Temps |
|-------|-------|----------|-------|
| 1 | COLLECTOR | 20 PDFs, 1343 chunks ChromaDB | session precedente |
| 2a | ANALYST x2 | 18 analyses (P087-P104), 2 doublons, 1 inexploitable | ~14 min/agent |
| 2b | MATHEUX | 8 formules F9.1-F9.8, glossaire a 45 formules | ~6 min |
| 2b | CYBERSEC | 15 threat models, 4 sous-techniques MITRE | ~9 min |
| 2b | WHITEHACKER | 13 techniques T31-T43, 10 exploits E25-E34 | ~9 min |
| 3 | LIBRARIAN | 76 papiers MANIFEST, 16 wiki pages | ~9 min |
| 4a | MATHTEACHER | Module_08, 170+ symboles, 3 exercices, 5 quiz | ~7 min |
| 4b | SCIENTIST | C7=9.5, D-017-D-021, Axe 10 MSBE | ~11 min |
| 5 | CHUNKER | 532 chunks, total 1080 | ~5 min |
| 6 | DIRECTOR | Briefing 8 sections, maturite these 72% | ~3 min |

### Peer-preservation (C8)
- Formulation thesis-ready sauvee dans manuscript/
- C8 candidate a 6/10, 4 gaps G-028-G-031
- RQ1-RQ3, H1-H3, protocole experimental concu
- 3 papiers preseed prets pour RUN-006

### Triple Convergence TC-001
- 210 runs (7 conditions x 30 prompts) sur llama3.2:latest (3.2B)
- Resultat INCONCLUSIVE : convergence complete = 0% (inversion)
- Diagnostic : modele 3B ne decode pas les attaques complexes combinees
- Protocol v2 concu (max_tokens 500, fuzzing reduit, modele 70B)
- Rapport EXPERIMENT_REPORT_TC001.md produit

### Architecture boucle autonome
- 10 sections documentees dans manuscript/
- 3 nouveaux agents proposes (EXPERIMENT-PLANNER, EXPERIMENTALIST, THESIS-WRITER)
- campaign_manifest.json concu
- Hooks de chainement specifies

---

## 2. Erreurs et Problemes Identifies

### E1 — Doublons non detectes en amont
**Probleme** : P088 et P105 sont des doublons de P036 (Hagendorff, Nature Comms). Detectes par les ANALYSTS, pas par le COLLECTOR.
**Impact** : 2 slots gaspilles (P088, P105), analyses minimales produites.
**Fix** : Ajouter au COLLECTOR une verification doublon AVANT attribution de P-ID. Query ChromaDB avec titre + auteurs, seuil cosine > 0.9 = doublon.

### E2 — P106 inexploitable (PDF absent)
**Probleme** : P106 (these Stuttgart) n'avait aucun chunk dans ChromaDB. L'analyse est vide.
**Impact** : 1 slot gaspille.
**Fix** : Le COLLECTOR doit verifier APRES injection que chaque PDF a >= 5 chunks. Si echec, marquer comme BLOCKED et ne pas attribuer de P-ID.

### E3 — P061-P086 non propages par le LIBRARIAN
**Probleme** : 26 papiers du RUN-004 n'ont jamais ete propages dans doc_references/ ni dans le wiki. Le MANIFEST saute de P060 a P087.
**Impact** : Trou dans l'index, papiers inaccessibles via le filesystem organise.
**Fix** : Lancer un LIBRARIAN incremental pour P061-P086. Ajouter un hook post-ANALYST qui verifie la propagation dans la phase suivante.

### E4 — Triple Convergence inadaptee au modele 3B
**Probleme** : Le protocole etait concu pour des frontier models. Sur un 3B, les attaques combinees produisent du bruit, pas des violations.
**Impact** : 2h de calcul pour un resultat INCONCLUSIVE.
**Fix** : Le protocol doit s'adapter au modele cible. Ajouter un pre-check : 5 runs rapides pour verifier que le modele comprend les prompts basiques. Si ASR baseline < 5%, ajuster les parametres avant de lancer les 210 runs complets.

### E5 — Numerotation des gaps conflictuelle
**Probleme** : CYBERSEC et WHITEHACKER ont independamment cree des gaps G-032+, avec des contenus differents.
**Impact** : Le SCIENTIST a du reconcilier manuellement.
**Fix** : Les gaps doivent etre crees via un fichier central avec auto-increment. Ajouter un lock ou un compteur dans THESIS_GAPS.md.

---

## 3. Patterns Efficaces

### P1 — 3 agents Phase 2b en parallele
Lancer MATHEUX + CYBERSEC + WHITEHACKER simultanement est optimal. Ils lisent les memes analyses mais ecrivent dans des fichiers differents. Zero conflit. Temps total = max(6, 9, 9) = 9 min au lieu de 6+9+9 = 24 min.

### P2 — Pipeline gating strict
Les phases 1→2→3→4→5→6 avec gates claires fonctionnent. Chaque phase attend la precedente. Pas de derapage, pas de fichier orphelin.

### P3 — Experiment en parallele du pipeline
Lancer le Triple Convergence pendant que le pipeline tourne est efficace. Ollama est independant des agents. Les deux pipelines ne se genent pas.

### P4 — RETEX + EXPERIMENT_REPORT structure
Le format EXPERIMENT_REPORT avec verdict/diagnostic/actions est directement exploitable. Le diagnostic automatique (E4) a immediatement produit un protocol v2 actionnable.

### P5 — DIRECTOR BRIEFING comme single deliverable
Le briefing consolide TOUT en un fichier lisible. Le directeur de these n'a pas besoin de lire 11 rapports d'agents.

---

## 4. Ameliorations a Implementer

### A1 — Anti-doublon dans le COLLECTOR (P0)
```
Avant d'attribuer un P-ID :
1. Query ChromaDB : titre + premiers auteurs
2. Si cosine > 0.9 avec un papier existant → DOUBLON, ne pas integrer
3. Si auteurs identiques + annee identique → verification manuelle
```

### A2 — Verification post-injection dans le COLLECTOR (P0)
```
Apres injection PDF dans ChromaDB :
1. Compter les chunks injectes
2. Si < 5 chunks → marquer BLOCKED, ne pas attribuer de P-ID
3. Logger le nombre de chunks dans le preseed JSON
```

### A3 — Auto-increment des gaps (P1)
```
Dans THESIS_GAPS.md :
- Ajouter un compteur en en-tete : <!-- NEXT_GAP_ID: G-042 -->
- Les agents lisent ce compteur avant de creer un gap
- Le SCIENTIST reconcilie si conflit
```

### A4 — Pre-check experimental (P1)
```
Avant une campagne de N>=30 :
1. Lancer 5 runs rapides (baseline)
2. Si ASR baseline < 5% → ajuster parametres (max_tokens, fuzzing, temperature)
3. Si ASR baseline > 90% → verifier que le juge n'est pas trop laxiste
4. Logger le pre-check dans le protocol JSON
```

### A5 — LIBRARIAN hook post-ANALYST (P1)
```
Dans research-director/SKILL.md :
- Apres chaque Phase 2 (ANALYST) terminee :
  1. Verifier que TOUS les P-IDs sont dans MANIFEST.md
  2. Si manquants → lancer LIBRARIAN incremental automatiquement
  3. Ne pas avancer a Phase 4 tant que la propagation n'est pas verifiee
```

### A6 — Creer les 3 agents de la boucle autonome (P2)
1. EXPERIMENT-PLANNER : gaps → protocols experimentaux
2. EXPERIMENTALIST : resultats → analyse statistique + verdict
3. THESIS-WRITER : resultats valides → chapitres manuscrit

### A7 — campaign_manifest.json (P2)
Creer le fichier central de suivi des campagnes avec :
- ID, gap, conjecture, script, iterations, verdicts
- Auto-rerun si INCONCLUSIVE (max 3 iterations)
- Escalade humaine si max iterations atteint

---

## 5. Impact sur les Regles

### Regles a ajouter dans .claude/rules/doctoral-research.md

```markdown
## ANTI-DOUBLON — COLLECTOR
Avant d'attribuer un P-ID, le COLLECTOR DOIT verifier l'absence de doublon
via query ChromaDB (titre + auteurs, seuil cosine > 0.9).

## POST-INJECTION — COLLECTOR
Apres injection PDF, verifier >= 5 chunks dans ChromaDB.
Si echec → BLOCKED, pas de P-ID.

## PROPAGATION — LIBRARIAN
Apres chaque Phase ANALYST, verifier que TOUS les P-IDs
sont dans MANIFEST.md et doc_references/. Si manquant → LIBRARIAN incremental.

## PRE-CHECK EXPERIMENTAL
Avant une campagne N>=30, lancer 5 runs baseline.
Si ASR < 5% → ajuster parametres.
Si ASR > 90% → verifier le juge.
```

### Regles a ajouter dans .claude/rules/redteam-forge.md

```markdown
## ADAPTATION AU MODELE
Les protocoles experimentaux DOIVENT etre adaptes a la taille du modele :
- 3B : max_tokens >= 500, fuzzing leger (1 transform), temperature 0
- 7B : max_tokens >= 300, fuzzing moyen, temperature 0.3
- 70B+ : parametres standard, fuzzing complet

## BOUCLE ITERATIVE
Chaque campagne a un maximum de 3 iterations :
- Iteration 1 : parametres standards
- Iteration 2 : ajustes selon diagnostic (N augmente, parametres affines)
- Iteration 3 : dernier essai avant escalade humaine
```

---

## 6. Metriques de la Session

| Metrique | Valeur |
|----------|--------|
| Agents lances | 13 |
| Agents termines avec succes | 13/13 (100%) |
| Fichiers crees/modifies | ~50 |
| Chunks RAG injectes | 532 (total 1080) |
| Papiers analyses | 18 (P087-P104) |
| Formules extraites | 8 (F9.1-F9.8) |
| Techniques red team | 13 (T31-T43) |
| Exploits documentes | 10 (E25-E34) |
| Decouvertes | 5 (D-017 a D-021) |
| Gaps | 14 (G-028-G-041) |
| Wiki pages | 16 |
| Runs experimentaux | 210 |
| Conjectures modifiees | C7 (8→9.5), C8 (nouvelle, 6/10) |
| Maturite these | 72% (+4%) |

---

## 7. Plan Immediat (Prochaine Session)

| # | Action | Priorite | Effort |
|---|--------|----------|--------|
| 1 | Propager P061-P086 (LIBRARIAN incremental) | P0 | 15 min |
| 2 | Appliquer les 5 regles ci-dessus dans .claude/rules/ | P0 | 10 min |
| 3 | Relancer TC-001 v2 (max_tokens 500, 1 fuzz, temp 0) | P1 | 30 min |
| 4 | Tester TC-001 sur Groq llama-3.1-70b | P1 | 30 min |
| 5 | Lancer /bibliography-maintainer pour preseed prompt 3 (C6 medical) | P1 | 45 min |
| 6 | Creer campaign_manifest.json | P2 | 15 min |
| 7 | Creer skill EXPERIMENTALIST | P2 | 30 min |
| 8 | Audit V2 (lint_sources.py sur P087-P104) | P1 | 20 min |
