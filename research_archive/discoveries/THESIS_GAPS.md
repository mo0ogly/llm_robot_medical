# THESIS GAPS — Opportunites de Contribution Originale

> **Ce fichier identifie les GAPS dans la litterature ou AEGIS peut contribuer.**
> Chaque gap est une opportunite de publication ou de chapitre de these.
> Derniere mise a jour : RUN-002 (2026-04-04)

---

## Gaps Classes par Priorite

### PRIORITE 1 — Contribution unique (aucun autre travail ne couvre)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-001 | **Aucun paper n'implemente δ³ concretement** | 0/46 papers avec implementation. P037 (survey le plus complet 2026) ne couvre que 3 couches. | AEGIS a 5 techniques δ³ en production | OUVERT — avance >1 an |
| G-002 | **Pas d'evaluation multi-couches combinee** | Papers evaluent les couches isolement. Aucune etude de leur interaction combinee. | AEGIS evalue δ⁰+δ¹+δ²+δ³ ensemble | OUVERT |
| G-003 | **Pas de red-teaming medical systematique** | P029 = 5 modeles, N=5. P035 = benchmark mais pas de red-team operationnel. P040 = 112 scenarios mais sans framework. | AEGIS a 98 templates + 48 scenarios medicaux | OUVERT |

### PRIORITE 2 — Contribution differenciante (peu de travaux concurrents)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-004 | **CHER non integre dans les frameworks de defense** | P035 introduit CHER mais ne l'integre dans aucune defense. | Integrer CHER dans le pipeline SVC d'AEGIS | ACTIONNABLE |
| G-005 | **Pas de defense contre LRM autonomes** | P036 documente la menace mais aucun paper ne propose de defense. | AEGIS peut tester et proposer des defenses | ACTIONNABLE |
| G-006 | **Pas de verification d'integrite du system prompt** | P045 documente SPP mais aucune defense proposee. | Ajouter hash/signature du system prompt a AEGIS | ACTIONNABLE |
| G-007 | **Pas de detection de manipulation emotionnelle** | P040 documente l'amplification 6x mais aucun detecteur propose. | Ajouter emotional_sentiment_guard au RagSanitizer | ACTIONNABLE |
| G-008 | **Pas de benchmark renouvelable pour le medical** | P043 (JBDistill) propose des benchmarks renouvelables mais pas pour le medical. | AEGIS peut adapter JBDistill au domaine medical | ACTIONNABLE |

### PRIORITE 3 — Contribution incrementale (renforce l'existant)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-009 | **Sep(M) pas encore valide avec N >= 30** | P024 exige N >= 30. AEGIS n'a pas encore publie ces resultats. | Benchmark MPIB (P035, 9697 instances) est maintenant disponible | A EXECUTER |
| G-010 | **Cosine similarity non calibree** | P012 (matrice gauge) + P013 (antonymes). | Tester all-MiniLM-L6-v2 sur MPIB + calibrer | A EXECUTER |
| G-011 | **Pas de test triple convergence** | D-001 est theorique. Personne n'a simule δ⁰ efface + δ¹ empoisonne + δ² fuzzed. | AEGIS peut le simuler experimentalement | A CONCEVOIR |
| G-012 | **Pas de monitoring temporel de l'alignement** | P030 documente l'erosion sur 3 ans mais personne ne monitore en temps reel. | Le telemetry bus d'AEGIS peut tracker Sep(M) dans le temps | A IMPLEMENTER |

---

## Matrice Gap × Chapitre de These

| Gap | Chapitre Suggere | Type de Publication |
|-----|-----------------|-------------------|
| G-001 (δ³ implementation) | Chapitre Defense | **Conference** (ICLR/NeurIPS Workshop) |
| G-002 (evaluation combinee) | Chapitre Evaluation | **Journal** (IEEE S&P) |
| G-003 (red-team medical) | Chapitre Medical | **Journal** (JAMA/Lancet Digital Health) |
| G-004 (CHER + SVC) | Chapitre Metriques | **Workshop** |
| G-005 (defense anti-LRM) | Chapitre Defense | **Conference** (si resultats positifs) |
| G-006 (integrite system prompt) | Chapitre Defense | **Short paper** |
| G-011 (test triple convergence) | Chapitre Evaluation | **Conference** (si resultats significatifs) |

---

## Gaps Fermes

| ID | Gap | Ferme par | RUN |
|----|-----|----------|-----|
| (aucun encore) | | | |

---

## Gaps Decouverts par les Agents

### Source : ANALYST
- P035 → G-004 (CHER non integre)
- P045 → G-006 (integrite system prompt)

### Source : CYBERSEC
- P036 → G-005 (defense anti-LRM)
- P044 → G-001 renforce (juges bypassables = δ³ encore plus critique)
- P045 → G-006 (3 critical gaps identifies)

### Source : WHITEHACKER
- P040 → G-007 (detection emotionnelle)
- T19-T30 → G-011 (test triple convergence)

### Source : SCIENTIST
- Cross-analyse → G-002 (evaluation combinee)
- SWOT → G-009, G-010 (faiblesses methodologiques)

### Source : MATHTEACHER
- (pas de gaps directement, mais identifie les prerequis mathematiques pour G-009/G-010)

---

## Regles pour les Agents

1. **Chaque agent** doit verifier si son travail ouvre, ferme ou modifie un gap
2. **ANALYST** : chercher les gaps dans les "Future Work" de chaque paper
3. **CYBERSEC** : chercher les gaps dans la couverture des defenses
4. **WHITEHACKER** : chercher les gaps entre techniques d'attaque et defenses existantes
5. **SCIENTIST** : synthetiser et prioriser les gaps identifies par les autres agents
6. **Quand un gap est ferme** : documenter le paper/experiment qui l'a ferme + deplacer dans "Gaps Fermes"
