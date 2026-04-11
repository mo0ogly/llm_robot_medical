# RETEX — Session marathon 2026-04-04/05

> **Duree** : ~12h de travail continu
> **Modeles** : Opus (analyses, fiches) + Sonnet (recherche, pipeline)
> **Cout** : rate limit atteint 2 fois

---

## 1. Ce qui a ete accompli

| Metrique | Debut session | Fin session |
|----------|--------------|-------------|
| Fiches d'attaque | 11/97 (11.3%) | 97/97 (100%) |
| Analyses doctorales | 60 superficielles | 85 au standard doctoral |
| PDFs telecharges | ~10 | 96 |
| PDFs dans ChromaDB | 0 chunks | ~4100 chunks fulltext |
| ChromaDB total | 601 + 43 docs | 7117 + 7697 docs |
| Formules | 54 (F01-F54) | 72 (F01-F72) + F56-F59 calibrees |
| Conjectures | C1-C3 a 10/10 | C1-C3 fermees + C4-C7 prets pour 10/10 |
| Decouvertes | 16 (D-001-D-016) | 20 (D-001-D-020) + 5 concurrents delta-3 |
| Research requests | 5 initiales | 27+ dont 7 resolved |
| Skills creees | 0 | 3 (research-director, fiche-attaque améliorée, audit-these) |
| Rules creees | 1 (CLAUDE.md) | 5 fichiers rules + CLAUDE.md refait |
| Scripts crees | 0 | 6 (batch_fiches, query_chromadb, seed_fiches, verify_citations, lint_sources, detect_contradictions) |
| Claims non sourcees | 42.8% | 19.6% (en cours de reduction) |

---

## 2. Erreurs commises et corrections

### E1 — PDFs pas dans le RAG
**Erreur** : Les analyses etaient basees sur des abstracts, pas le texte complet. Les PDFs n'etaient pas telecharges ni injectes dans ChromaDB.
**Detection** : User a signale `literature_for_rag` vide.
**Correction** : 96 PDFs telecharges, 4100+ chunks fulltext injectes.
**Regle ajoutee** : `doctoral-research.md` — "Lire le papier COMPLET via ChromaDB, PAS l'abstract."
**Prevention** : COLLECTOR telecharge + injecte automatiquement a chaque RUN.

### E2 — Affirmation "AEGIS seul systeme delta-3" FAUSSE
**Erreur** : DISCOVERIES_INDEX.md et RETEX affirmaient "AEGIS est le SEUL systeme avec 5 techniques delta-3 en production". CaMeL (DeepMind), AgentSpec (ICSE 2026) et LlamaFirewall (Meta) existent.
**Detection** : Verification proactive lancee par le research-director.
**Correction** : D-002 reformule (10/10 → 8/10), 5 concurrents analyses (P081-P085), Section 3 analyse transverse reecrite.
**Regle ajoutee** : Toute affirmation "le seul", "le premier", "aucun autre" doit etre verifiee par WebSearch AVANT publication.
**Prevention** : Skill `/audit-these` V1 (citation integrity).

### E3 — Chiffres FAUX dans les analyses (P032)
**Erreur** : P032 citait Table 1 avec des chiffres incorrects (Peer-Reviewed 25 au lieu de 16, Crisis Narratives 17 au lieu de 6) et un juge faux (GPT-4o au lieu de Gemini).
**Detection** : Agent fix-refs a lu le fulltext ChromaDB et corrige.
**Correction** : Chiffres rectifies, juge corrige.
**Regle ajoutee** : V4 (fidelity verifier) — comparer chaque chiffre cite contre le chunk source.
**Prevention** : Audit V4 automatique apres chaque analyse.

### E4 — 42.8% de claims sans source inline
**Erreur** : Les analyses produites par les agents ne mettaient pas systematiquement les refs inline (Auteur, Section, Table) a cote de chaque chiffre.
**Detection** : Linter V2 (`lint_sources.py`).
**Correction** : 3 rounds de corrections (fix-refs, rewrite, fix final). 42.8% → 19.6%.
**Regle ajoutee** : `doctoral-research.md` — "CHAQUE chiffre cite sa source exacte inline."
**Prevention** : Hook post-generation dans fiche-attaque et bibliography-maintainer.

### E5 — Doublons et dossiers orphelins
**Erreur** : `chroma_data/` vide, `fiches_attaque/` doublon, `doc_references/_staging/` orphelin, literature_for_rag melange PDFs + docx these.
**Detection** : Audit des repertoires.
**Correction** : Doublons supprimes, docx deplaces vers manuscript/, RESEARCH_ARCHIVE_GUIDE.md cree.
**Regle ajoutee** : Guide de structure avec regles strictes (R1-R5).
**Prevention** : LIBRARIAN verifie liens PDF + structure a chaque RUN.

### E6 — Agents ecrivent des fichiers au lieu de retourner du texte
**Erreur** : Les agents de fiche-attaque ecrivaient des .md au lieu de retourner le texte pour assemblage.
**Detection** : Assemblage manual necessaire (merge post-hoc).
**Correction** : Regle TEXT-ONLY dans `agent-prompts.md`.
**Prevention** : Template de prompt standardise avec REGLE 1 TEXT-ONLY.

### E7 — Haiku trop prudent pour le contenu adversarial
**Erreur** : Le LIBRARIAN (Haiku) refusait de generer les sections sur le contenu adversarial.
**Detection** : Refus sur fiches #13 et #16.
**Correction** : Fusion LIBRARIAN dans CYBER-LIBRARIAN (Sonnet). 3 agents au lieu de 4.
**Prevention** : Plus de Haiku pour le contenu adversarial.

### E8 — Pipeline non automatique
**Erreur** : Les propagations (LIBRARIAN → indexes, SCIENTIST → conjectures, seed ChromaDB) ne se declenchaient pas automatiquement apres les analyses.
**Detection** : User demandait "c'est indexe ?" a chaque fois.
**Correction** : Regle "AUTOMATISATION — L'UTILISATEUR NE DEMANDE PAS" ajoutee.
**Prevention** : Pipeline auto encode dans bibliography-maintainer + research-director.

---

## 3. Patterns efficaces confirmes

### P1 — Opus pour les analyses doctorales
Opus produit des analyses de 1500-2300 mots avec formules exactes et critique methodologique. Sonnet produit des analyses de 60-80 lignes sans profondeur. Le cout Opus est justifie pour le travail doctoral.

### P2 — Parallelisation massive
6 agents Opus en parallele pour les 60 analyses, 3 pour les fiches, 3 pour les corrections. Gain de temps considerable mais necessite audit post-production.

### P3 — ChromaDB fulltext comme source de verite
Les agents qui lisent les chunks fulltext du PDF produisent un travail INCOMPARABLEMENT meilleur que ceux qui font WebFetch sur l'abstract. La difference est entre 45 lignes d'abstract resume et 1800 mots de lecture critique.

### P4 — Verification proactive (delta-3 claim)
La verification de l'affirmation "seul systeme" a evite une erreur fatale pour la soutenance. Le rapporteur qui connait CaMeL (Carlini = Google DeepMind) aurait immediatement conteste.

### P5 — Linter automatique
Le lint_sources.py a detecte 285 claims non sourcees que 10 rounds de relecture manuelle auraient rate. L'automatisation de la verification est INDISPENSABLE.

---

## 4. Anti-patterns detectes

### AP1 — "C'est fait" sans verification
Dire "97/97 fiches done" sans verifier que chaque fiche a des refs inline, un PDF source, et un abstract verbatim. Le chiffre de completion masque la qualite.

### AP2 — Batch aveugle sans audit
Lancer 6 agents en parallele puis faire confiance aux resultats. Les erreurs factuelles de P032 (chiffres faux, juge faux) n'auraient JAMAIS ete detectees sans V4.

### AP3 — Linter avec faux positifs
Le premier linter avait 42.8% d'alertes dont beaucoup de faux positifs (refs en bold, descriptions de gaps). Il faut calibrer le linter sur des exemples reels avant de compter sur ses chiffres.

### AP4 — Additionner les couches d'abstraction
Skills → agents → scripts → ChromaDB → indexes → pipeline auto. Chaque couche ajoute une source d'erreur. Quand le user dit "les PDFs sont pas dans le RAG", aucune couche ne l'avait detecte.

---

## 5. Ameliorations pour la prochaine session

### A1 — V4 (fidelity verifier) OBLIGATOIRE apres chaque batch
Pas juste compter les refs (V2) — verifier que chaque ref correspond au texte source (V4). L'erreur P032 (chiffres faux) n'est detectable que par V4.

### A2 — Audit avant de dire "done"
Avant de declarer un lot termine, lancer `/audit-these claims` sur les fichiers produits. Si > 5% NONE → pas done.

### A3 — Tester le linter sur un gold standard
Creer 5 analyses parfaites (refs inline verifiees manuellement) et 5 analyses avec des erreurs connues. Calibrer le linter pour avoir < 5% faux positifs et < 5% faux negatifs.

### A4 — Limiter la parallelisation
3 agents max en parallele au lieu de 6. Plus facile a auditer, moins d'erreurs non detectees.

### A5 — Le directeur DOIT auditer chaque lot
Le research-director ne doit pas juste orchestrer — il doit VERIFIER les resultats de chaque delegation avec V2 + V4 avant de passer au lot suivant.

### A6 — Chaque analyse a un "pair reviewer"
Apres chaque analyse par l'ANALYST, un 2eme agent (cross-validator) verifie les 3 chiffres les plus importants contre le fulltext ChromaDB. Si mismatch → flag.

---

## 6. Metriques de qualite a suivre

| Metrique | Valeur actuelle | Objectif soutenance | Mesure |
|----------|----------------|---------------------|--------|
| Claims non sourcees | 19.6% | < 2% | lint_sources.py |
| Citations invalides | A mesurer | 0 | verify_citations.py |
| Erreurs factuelles detectees | 3 (P032) | 0 | verify_fidelity.py |
| Contradictions inter-fichiers | A mesurer | 0 | detect_contradictions.py |
| PDFs dans ChromaDB | 96/85 papiers | 100% | Count |
| Analyses > 1500 mots | ~60/85 | 100% | wc -l |
| Analyses avec abstract verbatim | ~60/85 | 100% | grep |
| Fiches avec Section 11 | 97/97 | 100% | Check |

---

## 7. Conclusion honnete

Cette session a produit un volume enorme de travail (97 fiches, 85 analyses, 96 PDFs, 5 skills, 6 scripts). Mais le volume masque les problemes de qualite :

1. **42.8% de claims sans source** — c'est le chiffre qui compte, pas "97/97 done"
2. **Chiffres FAUX dans P032** — une seule erreur factuelle dans la these = echec potentiel
3. **Affirmation delta-3 FAUSSE** — sans la verification proactive, ca passait en soutenance

Le systeme `/audit-these` est la bonne reponse : il mesure la qualite, pas le volume. Mais il faut le faire tourner SYSTEMATIQUEMENT, pas en fin de session quand on decouvre les problemes.

La prochaine session doit commencer par `/audit-these full` et se terminer par `/audit-these full`. Pas l'inverse.
