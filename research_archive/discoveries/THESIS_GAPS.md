# THESIS GAPS — Opportunites de Contribution Originale

> **Ce fichier identifie les GAPS dans la litterature ou AEGIS peut contribuer.**
> Chaque gap est une opportunite de publication ou de chapitre de these.
> Derniere mise a jour : RUN-004 (2026-04-04)

---

## Gaps Classes par Priorite

### PRIORITE 1 — Contribution unique (aucun autre travail ne couvre)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-001 | **Aucun paper n'implemente δ³ concretement** | 0/60 papers avec implementation. P037 (survey) + P060 (SoK, IEEE S&P 2026) ne couvrent que 3 couches. | AEGIS a 5 techniques δ³ en production | OUVERT — avance >1 an, confirme P060 |
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

### PRIORITE 4 — Gaps identifies RUN-003 (P047-P060)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-013 | **Dualite attaque-defense non testee sur composites** | P047 formalise la dualite mais ne la teste pas sur attaques multi-vecteurs. | AEGIS 98 templates + 48 scenarios = terrain de test ideal | OUVERT |
| G-014 | **Heterogeneite metriques d'evaluation** | P048 (88 etudes SLR) montre que les metriques d'evaluation divergent entre etudes. | AEGIS peut standardiser via Sep(M) + SVC + SEU (P060) | ACTIONNABLE |
| G-015 | **Recovery penalty non evaluee empiriquement** | P052 propose une correction theorique du gradient RLHF mais sans validation large echelle. | AEGIS peut implementer et tester sur modeles medicaux via Ollama | ACTIONNABLE |
| G-016 | **Attaques multimodales non couvertes** | P053 identifie les vecteurs multimodaux (texte+image) non couverts par le catalogue AEGIS (texte-only). | Extension future du catalogue | A CONCEVOIR |
| G-017 | **RagSanitizer vs. attaques composites PIDP** | P054 PIDP-Attack combine injection + empoisonnement DB. Le RagSanitizer n'a pas ete teste contre cette combinaison. | Test immediat possible avec les chaines d'attaque AEGIS existantes | A EXECUTER |
| G-018 | **AIR non evalue contre attaques semantiques** | P056 (NVIDIA) ne teste AIR que contre attaques gradient-based, pas semantiques ou multi-tour. | AEGIS peut tester si les signaux AIR resistent aux 48 scenarios | A CONCEVOIR |
| G-019 | **ASIDE non teste contre attaques adaptatives** | P057 ne teste pas ASIDE contre des attaques ciblant specifiquement la rotation orthogonale. | Protocole concu : 50 variantes (5 operateurs x 10), 4 schedules rotation, 6000 runs. Fonde sur P077 (shortcuts) + P079 (ES2) + P080 (DefensiveTokens). | PROTOCOL_READY (2026-04-06) |
| G-020 | **Defenses agents non evaluees** | P058 (ETH) documente les attaques agent-level mais aucune defense (tool sandboxing, memory isolation) n'est evaluee. | AEGIS medical robot agent = terrain de test naturel | ACTIONNABLE |
| G-021 | **Guardrails emergents hors SoK** | P060 (SoK, IEEE S&P 2026) ne couvre pas ASIDE (P057) ni AIR (P056), les defenses les plus prometteuses. | AEGIS peut evaluer ASIDE + AIR + integrer dans le formal framework | OUVERT |

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
| G-015 (recovery penalty) | Chapitre Defense δ⁰ | **Workshop** (validation empirique de P052) |
| G-017 (RagSanitizer vs. PIDP) | Chapitre RAG Security | **Conference** (si resultats differenciants) |
| G-019 (ASIDE vs. adaptatives) | Chapitre Defense δ⁰ | **Conference** (si attaques anti-ASIDE trouvees) |
| G-020 (defenses agents) | Chapitre Agents | **Conference** (securite agents medicaux) |

### PRIORITE 5 — Gaps identifies RUN-004 (P061-P080)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-022 | **Pas d'attaque adaptative contre RevPRAG (activation mimicry)** | P063 (RevPRAG, EMNLP 2025) atteint 98% TPR mais ne teste pas d'adversaires adaptant leurs activations. | AEGIS peut concevoir un adversaire grey-box ciblant les patterns d'activation. | A CONCEVOIR |
| G-023 | **Pas d'evaluation de membership inference dans les RAG medicaux** | P067 (modele de menace RAG formel, ICDM 2025) identifie le vecteur mais ne l'evalue pas sur des RAG medicaux. | AEGIS medical RAG + donnees synthetiques = terrain de test naturel. | ACTIONNABLE |
| G-024 | **Contamination des benchmarks medicaux non mesuree dans AEGIS** | P075 (MedCheck, 53 benchmarks) identifie une crise de contamination dans 53 benchmarks. AEGIS n'a pas verifie si ses 48 scenarios sont contamines. | MedCheck 46 criteres peuvent etre appliques a AEGIS. | ACTIONNABLE |
| G-025 | **CARES (4 vecteurs medicaux) non integre dans le catalogue AEGIS** | P068 (18 000+ prompts, 8 principes, 4 niveaux) identifie 4 vecteurs standardises. AEGIS n'a pas de template "4-vecteur CARES" systematique. | Integrer les 4 vecteurs CARES comme chaine d'attaque AEGIS. | ACTIONNABLE |
| G-026 | **Patient-perspective jailbreak absent du red-team AEGIS** | P069 (MedRiskEval, EACL 2026) montre que les LLMs medicaux sont plus vulnerables aux requetes patients qu'aux requetes cliniciennes. AEGIS cible principalement les cliniciens. | Ajouter des templates "vocabulaire patient" aux 98 templates AEGIS. | ACTIONNABLE |
| G-027 | **Defenses RAG non testees contre attaques adaptatives connues** | P061-P065 proposent 5 nouvelles defenses RAG (GMTP, RAGuard, RevPRAG, RAGPart/Mask, RAGDefender) sans tester des adversaires qui connaissent la defense. | AEGIS peut implementer les vecteurs adaptatifs T49-T54 et tester contre RagSanitizer. | A EXECUTER |

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
- RUN-004 (P061-P080) → G-022 a G-027 (activation mimicry, membership inference RAG medical, contamination benchmarks, CARES integration, patient perspective, defenses RAG vs. adaptatifs)

### Source : SCIENTIST
- Cross-analyse → G-002 (evaluation combinee)
- SWOT → G-009, G-010 (faiblesses methodologiques)
- RUN-003 synthese → G-013 a G-021 (consolidation des gaps identifies par ANALYST et CYBERSEC)

### Source : MATHTEACHER
- (pas de gaps directement, mais identifie les prerequis mathematiques pour G-009/G-010)

### Source : ANALYST (RUN-003)
- P047 → G-013 (dualite non testee sur composites)
- P048 → G-014 (heterogeneite metriques)
- P052 → G-015 (recovery penalty non evaluee)
- P053 → G-016 (multimodal non couvert)
- P054 → G-017 (RagSanitizer vs. PIDP)
- P060 → G-021 (SoK hors guardrails emergents)

### Source : CYBERSEC (RUN-003)
- P054+P055 → G-017 (compound + persistent RAG attacks)
- P056 → G-018 (AIR vs. semantiques)
- P057 → G-019 (ASIDE vs. adaptatives)
- P058 → G-020 (defenses agents)
- P060 → G-021 confirme

---

## Regles pour les Agents

1. **Chaque agent** doit verifier si son travail ouvre, ferme ou modifie un gap
2. **ANALYST** : chercher les gaps dans les "Future Work" de chaque paper
3. **CYBERSEC** : chercher les gaps dans la couverture des defenses
4. **WHITEHACKER** : chercher les gaps entre techniques d'attaque et defenses existantes
5. **SCIENTIST** : synthetiser et prioriser les gaps identifies par les autres agents
6. **Quand un gap est ferme** : documenter le paper/experiment qui l'a ferme + deplacer dans "Gaps Fermes"
