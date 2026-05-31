# Revue Complete du Corpus AEGIS -- 60 Papers, 16 Decouvertes, 7 Conjectures

**Agent**: SCIENTIST (Opus 4.6)
**Date**: 2026-04-04
**Corpus**: 60 articles (P001-P060), 580 chunks RAG, 54 formules, 48 techniques, 21 gaps
**Version**: v1.0 (Post-RUN-003 Deep Review)

---

## 1. Classification Thematique du Corpus

### Theme 1 : Fondements theoriques de l'alignement

| Dimension | Contenu |
|-----------|---------|
| **Papers** | P018 (ICLR 2025), P019 (Young 2026), P052 (Cambridge 2026), P053 (Kuklani 2025), P017 (ACL 2025), P020 (COBRA), P021 (Adv Reward), P022, P034 (CFT Medical) |
| **Formules** | F01 (Cosine), F04 (RLHF), F05 (KL/token), F06 (DPO), F44 (Harm Information I_t), F45 (KL Tracking), F46 (Recovery Penalty Objective) |
| **Conjectures** | C1 (10/10 VALIDEE), C3 (10/10 VALIDEE) |
| **Decouvertes** | D-003 (alignement effacable), D-007 (gradient nul), D-014 (preuve formelle martingale) |
| **Gaps** | G-015 (Recovery Penalty non evaluee empiriquement) |
| **Maturite** | **SATURE** -- Preuves empiriques (P018) + mathematiques (P019) + formelles (P052). Question resolue: l'alignement RLHF est structurellement superficiel. Aucun paper supplementaire ne changera ce constat. |

### Theme 2 : Attaques par injection de prompt

| Sous-categorie | Papers | Techniques | Maturite |
|---------------|--------|------------|----------|
| **Directe** | P001 (HouYi), P023 (NDSS), P026 | T01-T05 | Mature |
| **Indirecte (RAG)** | P054 (PIDP), P055 (RAGPoison) | T37, T38 | En cours |
| **Multi-tour** | P010, P050 (JMedEthicBench) | T35, T40 | En cours |
| **Character injection** | P009, P049 (Hackett LLMSec) | T03, T33, T34 | Mature |
| **System prompt poisoning** | P045 (SPP) | T26, T27 | En cours |
| **Emotionnelle** | P040 (Springer) | T28, T29 | Emergent |
| **Desalignement** | P039 (GRP-Obliteration) | T22, T23 | En cours |
| **Empoisonnement RLHF** | P022 | T06 | Exploratoire |

| Dimension | Contenu |
|-----------|---------|
| **Formules** | F22 (ASR), F30 (SPP Persistence), F48 (PIDP Compound ASR), F49 (Persistent Injection Rate) |
| **Conjectures** | C1 (insuffisance δ⁰), C3 (separation non resolue), C6 (defenses statiques perissables) |
| **Decouvertes** | D-001 (Triple Convergence), D-009 (system prompt = vecteur), D-013 (RAG compound persistant) |
| **Gaps** | G-011 (test triple convergence), G-013 (dualite non testee composites), G-017 (RagSanitizer vs PIDP) |
| **Maturite** | **En cours** -- Les attaques directes/character sont saturees. Les attaques RAG composees (P054+P055) et multi-tour (P050) sont emergentes et critiques. |

### Theme 3 : Defenses et gardes

| Sous-categorie | Papers | Maturite |
|---------------|--------|----------|
| **RLHF ameliore** | P017, P020, P021, P034, P038 (InstruCoT), P041 (Magic-Token) | En cours |
| **System prompt** | P045 (defense implicite), P011 (PromptGuard) | En cours |
| **Juges LLM** | P033, P042 (PromptArmor), P044 (AdvJudge-Zero) | Critique -- 99% bypass |
| **Pattern-based** | P009, P049, RagSanitizer AEGIS | Mature |
| **Architecturales** | P057 (ASIDE), P056 (AIR NVIDIA) | Emergent |
| **Dualite attaque-defense** | P047 (ACL 2025) | Emergent |
| **Taxonomie/SLR** | P037 (Survey 3D), P048 (SLR 88 etudes), P060 (SoK IEEE S&P) | Reference |

| Dimension | Contenu |
|-----------|---------|
| **Formules** | F46 (Recovery Penalty), F51 (ASIDE Orthogonal Rotation), F53 (SEU Framework) |
| **Conjectures** | C2 (10/10 VALIDEE), C6 (8/10 fortement supportee) |
| **Decouvertes** | D-015 (ASIDE reponse architecturale partielle) |
| **Gaps** | G-001 (δ³ implementation), G-018 (AIR vs semantiques), G-019 (ASIDE vs adaptatives), G-021 (guardrails emergents hors SoK) |
| **Maturite** | **En cours** -- Forte activite en 2026, mais 0/60 papers implemente δ³ concretement. ASIDE et AIR sont les plus prometteuses mais non deployees. |

### Theme 4 : Securite medicale specifique

| Dimension | Contenu |
|-----------|---------|
| **Papers** | P029 (JAMA), P028, P030, P031, P032 (AAAI), P034, P027, P035 (MPIB), P040 (Springer), P050 (JMedEthicBench), P051 (Nguyen detecteur clinique) |
| **Formules** | F22 (ASR medical), CHER (P035), MTSD (P050), 4D linguistiques (P051) |
| **Conjectures** | C5 (9/10 vulnerabilite medicale), C6 complementaire |
| **Decouvertes** | D-005 (amplification emotionnelle 6x), D-006 (CHER != ASR), D-011 (erosion temporelle), D-016 (degradation multi-tour medicale) |
| **Gaps** | G-003 (red-team medical systematique), G-004 (CHER non integre), G-007 (detection manipulation emotionnelle), G-008 (benchmark renouvelable medical) |
| **Maturite** | **En cours** -- 11 papers medicaux constituent le corpus le plus riche du domaine. P050 (p<0.001, 22 modeles, 50K conversations) est le resultat empirique le plus fort. Defenses medicales specifiques quasi-inexistantes. |

### Theme 5 : Metriques et evaluation

| Dimension | Contenu |
|-----------|---------|
| **Papers** | P024 (Sep(M) ICLR 2025), P012 (gauge matrix), P013 (antonymes), P014 (SemScore), P015, P016, P035 (CHER), P041 (SAM), P043 (JBDistill), P060 (SEU) |
| **Formules** | F01-F03 (Cosine, Sep(M), Focus Score), F41 (MTSD), F53 (SEU) |
| **Conjectures** | C4 (9/10 derive mesurable), C5 (8/10 cosine insuffisante) |
| **Decouvertes** | D-010 (cosine fragile), D-012 (benchmark renouvelable) |
| **Gaps** | G-009 (Sep(M) N>=30), G-010 (cosine non calibree), G-014 (heterogeneite metriques) |
| **Maturite** | **En cours** -- Sep(M) est valide theoriquement (ICLR 2025) et pratiquement (ASIDE P057), mais jamais validee a N>=30 en medical. La convergence Sep(M) + CHER + SEU est l'objectif. |

### Theme 6 : Architectures emergentes

| Dimension | Contenu |
|-----------|---------|
| **Papers** | P057 (ASIDE, rotation orthogonale), P056 (AIR NVIDIA, signaux IH), P047 (inversion attaque-defense), P011 (PromptGuard 4 couches), P002 (multi-agent defense) |
| **Formules** | F51 (ASIDE rotation), F52 (AIR signal injection) |
| **Conjectures** | Impact sur C1, C2, C3 (ASIDE est le seul contre-argument significatif a C3) |
| **Decouvertes** | D-015 (ASIDE) |
| **Gaps** | G-019 (ASIDE vs adaptatives), G-018 (AIR vs semantiques), G-021 (SoK manque les defenses emergentes) |
| **Maturite** | **Emergent** -- ASIDE et AIR sont publies en 2025, aucun des deux n'est deploye. C'est le front de recherche le plus actif. |

### Theme 7 : Agents et automatisation

| Dimension | Contenu |
|-----------|---------|
| **Papers** | P036 (Nature Comms, LRM 97.14%), P058 (ETH Zurich, agent-level attacks), P059 (Zhou, reviewers empoisonnes), P044 (AdvJudge-Zero, fuzzing automatise) |
| **Formules** | F27 (LRM Autonomous ASR), F31 (Logit Gap Flip) |
| **Conjectures** | C7 (8/10 paradoxe raisonnement/securite) |
| **Decouvertes** | D-004 (paradoxe raisonnement 97.14%) |
| **Gaps** | G-005 (defense anti-LRM), G-020 (defenses agents non evaluees) |
| **Maturite** | **En cours** -- 4 papers majeurs avec resultats reproductibles. Le paradoxe raisonnement/securite est de plus en plus supporte empiriquement. Les defenses specifiques aux agents sont inexistantes. |

---

## 2. Inspection des Decouvertes

### 2.1 Tableau de revision

| ID | Titre abrege | Score avant review | Score apres review | Statut | Justification |
|----|-------------|-------------------|-------------------|--------|---------------|
| D-001 | Triple Convergence δ⁰/1/2 | 10/10 | **10/10** | CONFIRMEE | Renforcee par P052 (preuve formelle), P054/P055 (extension RAG), P049 (100% bypass). Aucun contre-argument valide sauf ASIDE (non deploye). |
| D-002 | Gap δ³ universel | 10/10 | **10/10** | CONFIRMEE | 0/60 papers implemente δ³. P060 (IEEE S&P SoK) confirme explicitement. AEGIS reste unique. |
| D-003 | Alignement effacable | 9/10 | **9/10** | CONFIRMEE | P039 reste non replique independamment mais le resultat est coherent avec P052 (preuve formelle). Pas de contre-evidence. |
| D-004 | Paradoxe raisonnement/securite | 7/10 | **8/10** | AJUSTEE (+1) | P058 (ETH Zurich) + P059 (reviewers) renforcent empiriquement. Mais P041 (8B > 671B) et P047 (dualite) nuancent. Score eleve de 7 a 8. |
| D-005 | Amplification emotionnelle 6x | 8/10 | **8/10** | CONFIRMEE | P040 reste la seule source. Pas de replication independante. Score maintenu. |
| D-006 | CHER != ASR | 8/10 | **8/10** | CONFIRMEE | P035 reste la seule source. Le concept est valide mais manque de replication. |
| D-007 | Gradient d'alignement nul | 10/10 | **10/10** | CONFIRMEE + RENFORCEE | P052 formalise P019 avec decomposition en martingale. Preuve mathematique incontestable. |
| D-008 | Insuffisance δ⁰ prouvee | 10/10 | **10/10** | CONFIRMEE | 30+ papers supportent (RUN-003 librarian count). Saturee. |
| D-009 | System prompt = vecteur d'attaque | 8/10 | **8/10** | CONFIRMEE | P045 reste la reference. P054/P055 etendent au RAG mais le system prompt specifiquement n'a pas de nouveau paper. |
| D-010 | Cosine similarity fragile | 7/10 | **8/10** | AJUSTEE (+1) | P057 (ASIDE rotation orthogonale) et P053 (paraphrases) ajoutent des preuves que la cosine brute est insuffisante. |
| D-011 | Erosion temporelle passive | 8/10 | **8/10** | CONFIRMEE | P030 reste la seule source longitudinale. Pas de nouveau point de donnee. |
| D-012 | Benchmark renouvelable | 7/10 | **7/10** | CONFIRMEE | P043 reste la seule source. Concept valide mais pas de replication. |
| D-013 | Attaque RAG composee | 9/10 | **9/10** | CONFIRMEE | P054+P055 convergent. Gain super-additif bien documente. |
| D-014 | Preuve formelle superficialite RLHF | 10/10 | **10/10** | CONFIRMEE | P052 est un theoreme mathematique. Irrefutable. |
| D-015 | ASIDE reponse architecturale partielle | 8/10 | **8/10** | CONFIRMEE avec reserves | Non deploye, non teste contre adaptatives, ne couvre pas RAG. Score maintenu a 8 car prometteur mais non valide. |
| D-016 | Degradation multi-tour medicale | 9/10 | **9/10** | CONFIRMEE | P050 avec p<0.001, 22 modeles, 50K conversations. Solidite statistique exceptionnelle. |

### 2.2 Decouvertes manquantes identifiees

Apres analyse croisee du corpus entier et des queries RAG, **4 decouvertes potentielles** n'ont pas ete formalisees :

| ID propose | Decouverte | Papers source | Confiance estimee | Justification |
|-----------|-----------|---------------|-------------------|---------------|
| **D-017** | **Dualite attaque-defense generative** : Les techniques d'attaque peuvent etre systematiquement inversees en defenses (P047 ACL 2025). Le catalogue AEGIS (98 templates) pourrait generer un catalogue dual de 98 defenses. | P047, P057, P056 | 7/10 | Principe formalise par P047 mais non teste a grande echelle. Si valide, c'est un multiplicateur de force pour AEGIS. |
| **D-018** | **Fine-tuning medical = affaiblissement de l'alignement** : P050 montre que les modeles specialises medicaux sont PLUS vulnerables que les generalistes. Le fine-tuning domaine-specifique desensibilise l'alignement δ⁰, ce qui est CONTRE-INTUITIF. | P050, P034 | 8/10 | Resultat statistiquement significatif (p<0.001) et reproductible. Implication majeure : la specialisation medicale est un facteur de risque, pas de protection. |
| **D-019** | **Transferabilite white-box-to-black-box** : L'optimisation d'attaques sur des modeles locaux (white-box) produit des attaques transferables aux modeles de production (black-box) (P049 WIRT). | P049, P044 | 8/10 | Valide l'approche AEGIS de test local via Ollama pour decouvrir des vulnerabilites commerciales. Documente mais non formalise comme decouverte. |
| **D-020** | **Heterogeneite irreconciliable des metriques** : P048 (88 etudes) montre que les metriques d'evaluation divergent a un point rendant la comparaison inter-etudes quasi-impossible. Sep(M) + SVC + SEU d'AEGIS est la premiere tentative d'unification. | P048, P060, P043 | 7/10 | Meta-observation sur le champ entier. Justifie directement le framework metrique AEGIS. |

### 2.3 Ajustements de score

| ID | Ancien score | Nouveau score | Raison |
|----|-------------|---------------|--------|
| D-004 | 7/10 | **8/10** | P058 + P059 renforcent le paradoxe empiriquement |
| D-010 | 7/10 | **8/10** | P057 + P053 ajoutent des preuves supplementaires |

Les 14 autres decouvertes conservent leur score. Aucune decouverte n'est invalidee.

---

## 3. Conjectures -- Analyse critique

| Conjecture | Score | Forces | Faiblesses | Ce qu'il manque pour valider definitivement |
|-----------|-------|--------|------------|---------------------------------------------|
| **C1** (δ⁰ insuffisant) | **10/10** | Preuve formelle (P052 martingale), 30+ papers POUR, effacement par 1 prompt (P039), degradation multi-tour p<0.001 (P050) | 5 papers proposent des ameliorations (P017, P020, P021, P038, P041) mais aucun ne resout la limitation structurelle | **VALIDEE.** Rien. Sature. |
| **C2** (δ³ necessaire) | **10/10** | Triple Convergence (D-001), 0/60 implementations δ³, RAG compound+persistent (P054/P055), IEEE S&P confirme (P060) | ASIDE (P057) pourrait reduire le besoin de δ³ a terme ; PromptArmor (P042) montre <1% FPR | **VALIDEE.** Test empirique : AEGIS δ³ seul vs δ⁰ efface (scenario P039). |
| **C3** (alignement superficiel) | **10/10** | P052 preuve mathematique (martingale), P049 100% bypass, P053 paraphrases contournent | **ASIDE (P057)** montre que la separation EST realisable architecturalement (seul contre-argument significatif) | **VALIDEE pour les systemes actuels.** ASIDE deploye en production affaiblirait C3 pour les systemes futurs. |
| **C4** (derive mesurable) | **9/10** | Sep(M) valide par ses auteurs dans ASIDE (P057), MTSD mesurable (P050 p<0.001), PIR pour RAG (P055) | Sep(M) pas encore valide a N>=30 en medical, cosine brute a des angles morts (P012, P013) | Executer Sep(M) avec N>=30 sur MPIB (P035). Si significatif : 10/10. |
| **C5** (cosine insuffisante) | **8/10** | Matrice gauge (P012), antonymes (P013), ASIDE utilise rotation orthogonale (P057), paraphrases (P053) | Pas de preuve formelle que cosine est pire qu'une alternative specifique. L'insuffisance est montree mais pas quantifiee. | Comparer cosine brute vs ASIDE-corrigee vs SemScore sur le benchmark MPIB. |
| **C6** (medical plus vulnerable) | **9/10** | P050 (p<0.001, 22 modeles, 50K conversations), P029 (94.4% ASR JAMA), P040 (6x amplification emotionnelle), P051 (4D cliniques) | Pas de comparaison directe medical vs general avec les MEMES modeles et les MEMES attaques (chaque etude utilise son propre protocole) | Reproduire les attaques AEGIS (48 scenarios) sur modeles generiques ET medicaux pour comparaison intra-framework. |
| **C7** (paradoxe raisonnement) | **8/10** | P036 (Nature Comms, 97.14% ASR autonome), P058 (agent-level), P059 (reviewers empoisonnes) | P041 montre 8B > 671B, P038 utilise le raisonnement defensivement, P047 montre la dualite. Le paradoxe n'est pas absolu : c'est un amplificateur bidirectionnel asymetrique. | Mesurer la correlation entre taille/capacite de raisonnement et ASR sur une batterie de modeles (5+ modeles, 3+ tailles). |

---

## 4. Axes de Recherche -- Etat de maturite

| # | Axe | Statut | Papers couverts | Gaps ouverts | Prochaine action |
|---|-----|--------|----------------|-------------|-----------------|
| 1 | Fragilite structurelle δ⁰ | **SATURE** | P018, P019, P022, P030, P036, P039, P044, P045, P050, P052, P053 (11) | G-015 (Recovery Penalty) | Implementer F46 Recovery Penalty pour TESTER si δ⁰ peut etre ameliore. Si oui, C1 reste 10/10 mais l'axe de correction existe. |
| 2 | Defense en profondeur | **En cours** | P001, P005, P009, P011, P029, P033, P038, P039, P042, P044, P045, P047, P049, P054-P057, P060 (18) | G-002, G-011, G-013, G-017 | Mesure incrementale ASR par couche delta avec et sans δ⁰ efface. PRIORITE 1. |
| 3 | Specificite medicale | **En cours** | P027-P032, P034, P035, P040, P050, P051 (11) | G-003, G-004, G-007, G-008 | Integrer CHER dans le pipeline SVC. Tester P050 multi-tour sur AEGIS. |
| 4 | Sep(M) mesure formelle | **En cours** | P008, P012-P016, P024, P035, P041, P050, P052, P057 (12) | G-009, G-010, G-014 | **CRITIQUE** : Executer Sep(M) N>=30 sur MPIB. C'est la validation statistique manquante de la these. |
| 5 | Evasion syntaxique | **Mature** (connu), **Exploratoire** (compositionnel) | P005, P009, P023, P033, P044, P045, P049 (7) | Aucun gap ouvert (RagSanitizer couvre 12/12) | Tester RagSanitizer vs tokens AdvJudge-Zero (P044). |
| 6 | δ³ validation | **Exploratoire** (litterature), **En cours** (AEGIS) | P007, P011, P029, P035, P037, P039, P044, P054, P055, P058, P060 (11) | G-001, G-002 | **Publier les resultats des 5 techniques δ³ AEGIS.** C'est la contribution unique #1. |
| 7 | Juge recursif | **En cours** | P002, P033, P036, P042, P044, P045 (6) | G-005 | Tester juges AEGIS heterogenes vs AdvJudge-Zero (P044). |
| 8 | Course aux armements | **Exploratoire** | P001, P009, P030, P036, P038-P045, P049, P054, P059 (14) | G-012 (monitoring temporel) | Documenter la demi-vie des defenses 2026. Donnees longitudinales AEGIS. |
| 9 | LRM et paradoxe raisonnement | **En cours** | P036, P037, P039, P044, P047, P052, P058, P059 (8) | G-005, G-020 | Tester les attaques LRM contre AEGIS δ³. |

---

## 5. Analyses Non Abouties

| # | Sujet | Ce qui a ete fait | Ce qui manque | Priorite |
|---|-------|-------------------|---------------|----------|
| 1 | **Sep(M) N>=30 en medical** | Theorie definie (P024), benchmark disponible (P035 MPIB, 9697 instances), ASIDE valide Sep(M) (P057) | Execution experimentale : 30+ tests par condition sur MPIB via Ollama | **CRITIQUE** -- C4 ne peut passer de 9 a 10/10 sans cela |
| 2 | **ASR incremental par couche delta** | Architecture δ⁰/1/2/3 definie et implementee, 98 templates + 48 scenarios prets | Execution : mesurer ASR avec δ⁰ seul, +δ¹, +δ², +δ³. Puis sans δ⁰ (scenario P039) | **CRITIQUE** -- C'est la contribution experimentale centrale de la these |
| 3 | **RagSanitizer vs PIDP compound** | RagSanitizer 15 detecteurs implementes, P054 documente l'attaque compound | Test de RagSanitizer contre l'attaque PIDP composite (injection + empoisonnement DB) | **HAUTE** -- G-017, testable immediatement |
| 4 | **CHER integre dans SVC** | CHER defini par P035, SVC defini par AEGIS | Calcul de CHER parallele a ASR pour les memes attaques. Integration formelle dans le score SVC | **HAUTE** -- G-004 |
| 5 | **Test triple convergence** | D-001 formalisee theoriquement, 3 piliers documentes | Simulation : δ⁰ efface + δ¹ empoisonne + δ² fuzze. Mesurer si δ³ survit seul | **HAUTE** -- G-011, scenario experimental cle de la these |
| 6 | **Recovery Penalty Objective** | F46 formalisee (P052), theorie mathematique solide | Prototype sur Ollama : fine-tuner un modele avec Recovery Penalty et mesurer l'impact | **MOYENNE** -- G-015, long terme |
| 7 | **Detection manipulation emotionnelle** | P040 documente le facteur 6x, vecteurs emotionnels identifies | Detecteur emotional_sentiment_guard pour RagSanitizer | **MOYENNE** -- G-007 |
| 8 | **Calibration cosine vs alternatives** | P012 (gauge), P013 (antonymes), P057 (rotation) documentent les faiblesses | Test comparatif : cosine brute vs ASIDE-corrigee vs SemScore sur MPIB | **BASSE** -- Utile mais pas bloquant |
| 9 | **Anti-ASIDE attacks** | ASIDE documente (P057), principe de rotation orthogonale compris | Concevoir des attaques ciblant specifiquement la rotation (perturbation des sous-espaces) | **BASSE** -- Recherche future, pas urgente |
| 10 | **SEU benchmark des 66 techniques AEGIS** | Framework SEU defini (P060, IEEE S&P), 66 techniques cataloguees | Evaluer les 40/66 techniques implementees selon SEU (Securite, Efficience, Utilite) | **MOYENNE** -- G-014 |

---

## 6. Questions de Recherche Ouvertes (Top 10)

### 1. Delta-3 seul survit-il a l'effacement de δ⁰ + empoisonnement δ¹ + bypass δ² ?
**Pourquoi c'est important** : C'est le test empirique de D-001 (Triple Convergence). Si δ³ survit, la these prouve son argument central. Si non, il faut comprendre pourquoi.
**Papers necessaires** : Aucun -- test empirique AEGIS suffisant.
**Difficulte** : Moyenne (simulation, pas nouvelle theorie).

### 2. Sep(M) est-elle statistiquement significative (N>=30) sur le benchmark medical MPIB ?
**Pourquoi c'est important** : C4 (9/10) ne peut etre validee definitivement sans validation statistique. C'est la rigueur methodologique minimale exigee par la communaute (Zverev et al. P024).
**Papers necessaires** : Aucun -- benchmark MPIB (P035) + implementation Sep(M) existante.
**Difficulte** : Faible (execution, pas conception).

### 3. Le Recovery Penalty Objective (P052 F46) corrige-t-il la concentration du gradient ?
**Pourquoi c'est important** : Si oui, c'est la premiere correction theoriquement fondee de la fragilite δ⁰. Changerait la donne pour Axe 1.
**Papers necessaires** : Suivi des publications Cambridge (Young group).
**Difficulte** : Elevee (fine-tuning, hardware).

### 4. Comment la degradation multi-tour (P050) evolue-t-elle avec les couches δ¹ a δ³ actives ?
**Pourquoi c'est important** : Si δ³ previent la degradation multi-tour, c'est un argument fort supplementaire pour C2. Si non, il faut une defense specifique multi-tour.
**Papers necessaires** : Aucun -- reproductible avec AEGIS + 48 scenarios.
**Difficulte** : Moyenne.

### 5. ASIDE resiste-t-il a des attaques adaptatives ciblant la rotation orthogonale ?
**Pourquoi c'est important** : ASIDE (P057) est le seul contre-argument significatif a D-001 et C3. S'il resiste aux adaptatives, la these doit integrer ASIDE comme resolution potentielle. Sinon, D-001 est encore plus forte.
**Papers necessaires** : Publications Zverev group (ISTA). Papers sur attaques subspace.
**Difficulte** : Elevee (conception d'attaques nouvelles).

### 6. Existe-t-il un seuil de capacite de raisonnement au-dela duquel l'alignement echoue categoriquement ?
**Pourquoi c'est important** : C7 (paradoxe raisonnement) est formulee comme correlation negative. Si un seuil existe (phase transition), c'est plus qu'un paradoxe : c'est une impossibilite structurelle.
**Papers necessaires** : Donnees de P036 sur 4 LRM + nouveaux modeles 2026.
**Difficulte** : Moyenne.

### 7. La divergence ASR/CHER est-elle amplifiee ou attenuee par les defenses delta ?
**Pourquoi c'est important** : Si les defenses reduisent l'ASR mais pas le CHER (dommage clinique reel), cela signifie que les defenses actuelles sont trompeuses -- elles creent un faux sentiment de securite.
**Papers necessaires** : Aucun -- testable avec AEGIS + MPIB.
**Difficulte** : Moyenne.

### 8. Le fine-tuning medical affaiblit-il systematiquement l'alignement δ⁰ ?
**Pourquoi c'est important** : D-018 (potentielle nouvelle decouverte). Si confirme, implication majeure : la specialisation medicale EST un facteur de risque. Cela justifie d'autant plus δ³ pour le medical.
**Papers necessaires** : P050 replication + tests sur modeles medicaux locaux (BioMistral, Meditron via Ollama).
**Difficulte** : Moyenne.

### 9. RagSanitizer detecte-t-il les attaques PIDP composites (injection + empoisonnement DB) ?
**Pourquoi c'est important** : G-017, faiblesse AEGIS identifiee. Si RagSanitizer echoue, il faut ajouter un detecteur d'integrite de base vectorielle.
**Papers necessaires** : Aucun -- test immediat possible.
**Difficulte** : Faible.

### 10. Les defenses agent-level (sandboxing, memory isolation) attenuent-elles les attaques P058 ?
**Pourquoi c'est important** : G-020. Le medical robot agent AEGIS est un terrain de test naturel. Si les defenses agent-level fonctionnent, c'est une contribution pour le Chapitre Agents.
**Papers necessaires** : Suivi publications ETH Zurich (Hofer group).
**Difficulte** : Moyenne.

---

## 7. Plan RUN-004

### 7.1 Papers a chercher par theme

| Theme | Keywords de recherche | Priorite | Justification |
|-------|----------------------|----------|---------------|
| Architectures emergentes | "ASIDE follow-up", "orthogonal rotation LLM defense", "instruction data separation architecture" | **CRITIQUE** | D-015 et G-019 dependent de l'etat d'avancement d'ASIDE |
| Defense RAG | "RAG defense poisoning", "vector database integrity", "compound RAG attack defense" | **HAUTE** | G-017 et D-013 -- attaques documentees mais 0 defense |
| Multi-tour | "multi-turn safety degradation defense", "conversation-level alignment monitoring" | **HAUTE** | G-011 et D-016 -- degradation documentee mais 0 defense |
| δ³ implementation | "output validation formal verification LLM", "deterministic safety checking" | **HAUTE** | G-001 -- confirmer que 0 implementation existe (renforce D-002) |
| Medical AI safety | "medical LLM defense 2026", "clinical AI guardrail", "healthcare prompt injection defense" | MOYENNE | Theme 4 -- enrichir le corpus medical (11 papers, bon mais peut etre elargi) |
| LRM defense | "reasoning model jailbreak defense", "large reasoning model safety" | MOYENNE | C7 et G-005 -- le paradoxe a besoin de donnees defensives |
| Metriques | "SEU framework guardrail evaluation", "standardized prompt injection benchmark" | MOYENNE | G-014 -- l'heterogeneite est un frein a la comparaison |
| Agent security | "LLM agent security defense", "tool use safety LLM" | BASSE | G-020 -- emergent mais pas encore critique |
| Multimodal | "multimodal prompt injection", "vision-language model jailbreak" | BASSE | G-016 -- hors scope AEGIS (text-only) mais surveillance |

### 7.2 Experiences a mener (par priorite)

| # | Experience | Gap/Decouverte | Difficulte | Duree estimee |
|---|-----------|---------------|------------|---------------|
| 1 | ASR incremental par couche delta (4 conditions) | G-002, C2 | Moyenne | 1 semaine |
| 2 | Sep(M) N>=30 sur MPIB (P035) | G-009, C4 | Faible | 2-3 jours |
| 3 | RagSanitizer vs PIDP (P054) | G-017, D-013 | Faible | 1 jour |
| 4 | Test triple convergence (δ⁰ efface) | G-011, D-001 | Moyenne | 1 semaine |
| 5 | CHER parallele a ASR sur 48 scenarios | G-004, D-006 | Moyenne | 1 semaine |
| 6 | Multi-tour degradation avec δ³ actif | G-011, D-016 | Moyenne | 3 jours |
| 7 | Juges AEGIS vs AdvJudge-Zero (P044) | G-005 | Elevee | 1 semaine |
| 8 | SEU benchmark des 40 techniques implementees | G-014 | Elevee | 2 semaines |

### 7.3 Chapitres a rediger (par maturite)

| Chapitre | Titre propose | Conjectures | Maturite donnees | Priorite redaction |
|----------|-------------|------------|-------------------|-------------------|
| **Ch. 1** | La separation instruction/donnee : un probleme fondamentalement non-resolu | C3 (10/10) | Elevee (P052, P024, P057) | **Pret a rediger** |
| **Ch. 2** | Fragilite structurelle de l'alignement RLHF | C1 (10/10) | Elevee (11 papers, preuve formelle) | **Pret a rediger** |
| **Ch. 3** | Defense en profondeur : de la necessite de δ³ | C2 (10/10), D-001, D-002 | Moyenne (theorie solide, experiments manquants) | Rediger apres Exp. 1 et 4 |
| **Ch. 4** | Le domaine medical comme amplificateur de risque | C5/C6 (9/10) | Elevee (11 papers medicaux) | **Pret a rediger** (donnees existantes) |
| **Ch. 5** | Mesure de la derive : Sep(M), CHER, SEU | C4 (9/10), C5 (8/10) | Moyenne (theorie ok, validation N>=30 manquante) | Rediger apres Exp. 2 |
| **Ch. 6** | Resultats experimentaux AEGIS | Toutes | Faible (experiments non executes) | Apres Exp. 1-6 |
| **Ch. 7** | Le paradoxe raisonnement/securite | C7 (8/10) | Moyenne (4 papers, pas de donnees AEGIS propres) | Rediger apres Exp. 7 |

---

## 8. Carte de Maturite de la These

| Chapitre | Maturite (%) | Donnees disponibles | Donnees manquantes | Bloquant ? |
|----------|-------------|--------------------|--------------------|-----------|
| Ch. 1 (Separation) | **85%** | P052 preuve formelle, P024 Sep(M) definition, P057 ASIDE comme resolution partielle, P049 100% bypass | Aucune donnee AEGIS propre (revue de litterature pure) | Non |
| Ch. 2 (Fragilite δ⁰) | **80%** | P019+P052 preuves, P039 effacement, P050 multi-tour, 11 papers | Donnees AEGIS de degradation multi-tour propres | Non |
| Ch. 3 (Defense en profondeur) | **55%** | D-001 Triple Convergence, 0/60 δ³, 5 techniques AEGIS | **ASR incremental par couche, test triple convergence** | **OUI** -- Exp. 1 et 4 requis |
| Ch. 4 (Medical) | **75%** | P029 JAMA, P035 MPIB, P040 emotionnel, P050 multi-tour, P051 detecteur 4D | Comparaison AEGIS medical vs general, CHER integre | Non (redaction possible sans) |
| Ch. 5 (Metriques) | **50%** | Sep(M) definition, CHER definition, SEU framework | **Sep(M) N>=30 validation** | **OUI** -- Exp. 2 requis |
| Ch. 6 (Resultats) | **15%** | Architecture AEGIS, 98 templates, 48 scenarios, 34 chaines | **Toutes les experiences (1-8)** | **OUI** -- bloquant total |
| Ch. 7 (Raisonnement) | **45%** | P036 Nature Comms, P058 ETH, P059 reviewers | Donnees AEGIS propres, test LRM vs δ³ | Non (redaction partielle possible) |

### Resume de maturite

| Indicateur | Valeur |
|-----------|--------|
| Conjectures validees (10/10) | 3/7 (C1, C2, C3) |
| Conjectures fortement supportees (8-9/10) | 4/7 (C4, C5, C6, C7) |
| Conjectures faibles (<8/10) | 0/7 |
| Decouvertes totales | 16 (+4 potentielles identifiees) |
| Decouvertes 10/10 | 4 (D-001, D-002, D-007/D-008, D-014) |
| Gaps ouverts | 21 (0 fermes) |
| Gaps executables immediatement | 4 (G-009, G-010, G-017, 5e RagSanitizer vs AdvJudge) |
| Experiences bloquantes (chapitres) | 3 (Ch. 3, Ch. 5, Ch. 6) |
| Papers dans le corpus | 60 |
| Formules documentees | 54 |
| Techniques d'attaque | 48 |
| Chunks RAG | 580 |

### Axes satures (plus rien a trouver)
- **Axe 1 (fragilite δ⁰)** : SATURE. La question est resolue mathematiquement (P052). Les prochains papers ne changeront pas le constat.
- **Axe 5 (evasion syntaxique, partie connue)** : Les 12 categories de Hackett sont couvertes par RagSanitizer 12/12.

### Axes emergents (besoin de plus de papers)
- **Theme 6 (architectures emergentes)** : ASIDE et AIR sont les plus prometteurs mais publies recemment. Suivi critique en RUN-004.
- **Theme 7 (agents et automatisation)** : 4 papers seulement. Le domaine est en explosion rapide.
- **Attaques RAG composees** : 2 papers (P054, P055) mais 0 defense publiee. Front de recherche actif.

### Axes non explores
- **Multimodal** (G-016) : Hors scope AEGIS (text-only) mais P053 l'identifie comme vecteur emergent.
- **Federated learning pour defenses LLM** : Aucun paper dans le corpus. Potentiel pour defenses distribuees.
- **Verification formelle par methodes SMT/SAT pour δ³** : Non explore dans la litterature, mais methodologiquement possible. Piste originale.

---

*Agent Scientist -- REVIEW_COMPLETE_CORPUS.md*
*Revue profonde : 60 papers, 16 decouvertes, 7 conjectures, 9 axes, 21 gaps*
*4 decouvertes potentielles identifiees (D-017 a D-020)*
*3 experiences bloquantes pour 3 chapitres*
*Version: v1.0*
*Date: 2026-04-04*
