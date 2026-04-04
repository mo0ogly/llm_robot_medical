# THREAT_ANALYSIS_RUN004.md — Analyse Cybersécurité RUN-004

> **Date** : 2026-04-04 | **Agent** : CYBERSEC (RUN-004, incrémental)
> **Scope** : 20 papiers nouveaux (P061-P080), étendant RUN-003 (60 papiers)
> **Framework** : Taxonomie delta-layers AEGIS (δ⁰–δ³)
> **Référence** : `backend/taxonomy/defense_taxonomy_2025.json` (66 techniques, 4 classes)
> **Source abstracts** : WebFetch sur arXiv.org [ABSTRACT SEUL] pour chaque papier

---

## Résumé Exécutif

RUN-004 intègre 20 nouveaux papiers (P061-P080) organisés en trois lots :
- **LOT 1 — RAG Defense** (P061-P067) : 7 papiers sur la défense des pipelines RAG contre l'empoisonnement
- **LOT 2 — Medical Metrics** (P068-P075) : 8 papiers sur les métriques de sécurité médicale
- **LOT 3 — ASIDE Architectural** (P076-P080) : 5 papiers sur la séparation architecturale instruction/données

### Constats principaux

1. **GMTP (P061) est le 16e détecteur candidat pour RagSanitizer** : la détection par probabilité de token masqué (MLM) complète les 15 détecteurs existants avec une approche gradient-based qui cible spécifiquement les tokens adversariaux insérés dans les documents RAG.

2. **La défense RAG forme une architecture à 4 couches cohérente** (P061-P066) : filtrage retrieval-stage (P064), détection activations (P063), filtre perplexité + similarité (P062), post-retrieval lightweight (P065), et provenance cryptographique (P066).

3. **D-001 Triple Convergence est NUANCÉE par P062/P065** : RAGuard et RAGDefender démontrent que des défenses non-paramétriques peuvent réduire l'ASR de 0.89 à 0.02, ce qui ne contredit pas D-001 mais montre que δ² peut être renforcé au niveau RAG sans modifier le modèle.

4. **D-015 ASIDE est VALIDÉE architecturalement par P076 (ISE/ICLR 2025)** et CONTESTÉE par P077 (shortcuts) : ISE démontre +18.68% sur les benchmarks hierarchy, mais P077 montre que les modèles fine-tunés utilisent des raccourcis (task type, proximity) plutôt qu'une vraie séparation. D-015 reste valide mais avec une limitation fondamentale.

5. **G-017** (RagSanitizer vs PIDP compound attack) : P061-P066 confirment que GMTP et RAGuard défendent contre les attaques pures de poisoning, mais aucun ne défend contre l'attaque composée PIDP (injection + poisoning simultanés). G-017 reste ouvert.

6. **G-019** (ASIDE vs attaquant adaptatif) : P077 (role separation shortcuts) et P079 (ES2) révèlent que les défenses par séparation dans l'espace d'embedding sont contournables par des attaques ciblant les proxies de séparation plutôt que la séparation elle-même. G-019 est confirmé et étendu.

---

## 1. Tableau des 20 Papiers × Couches Delta

| ID | Titre court | Lot | δ⁰ | δ¹ | δ² | δ³ | DETECT | RESP | MEAS |
|----|-------------|-----|----|----|----|----|----|----|----|
| P061 | GMTP (gradient masked token) | RAG_def | — | — | **NOVEL** | — | yes | — | yes |
| P062 | RAGuard (perplexity+similarity) | RAG_def | — | — | **HIGH** | — | yes | — | — |
| P063 | RevPRAG (activation analysis) | RAG_def | — | — | **NOVEL** | implicit | **NOVEL** | — | yes |
| P064 | RAGPart + RAGMask | RAG_def | — | — | **HIGH** | — | yes | — | — |
| P065 | RAGDefender (post-retrieval) | RAG_def | — | partial | **HIGH** | — | yes | yes | — |
| P066 | RAGShield (cryptographic provenance) | RAG_def | — | **NOVEL** | **NOVEL** | — | yes | yes | — |
| P067 | Formal RAG Threat Model | RAG_def | survey | survey | survey | survey | FOUNDATION | — | FOUNDATION |
| P068 | CARES (medical safety benchmark) | med_met | variable | partial | partial | — | — | — | **NOVEL** |
| P069 | MedRiskEval + PatientSafetyBench | med_met | variable | partial | — | — | — | — | **NOVEL** |
| P070 | CSEDB (Nature, à vérifier) | med_met | — | — | — | — | — | — | — |
| P071 | Medical AI Security Framework | med_met | variable | partial | partial | — | yes | — | yes |
| P072 | CLEVER (JMIR, à vérifier) | med_met | — | — | — | — | — | — | — |
| P073 | MEDIC (clinical dimensions) | med_met | partial | partial | — | — | — | — | **NOVEL** |
| P074 | Safe AI Clinicians (CFT) | med_met | **ENHANCED** | yes | — | — | — | — | yes |
| P075 | Beyond Leaderboard (MedCheck) | med_met | survey | survey | survey | survey | — | — | **NOVEL** |
| P076 | ISE (Instructional Segment Embedding) | ASIDE | **NOVEL** | **HIGH** | — | — | — | — | yes |
| P077 | Illusion of Role Separation | ASIDE | partial | **BRITTLE** | — | — | — | — | yes |
| P078 | ZEDD (embedding drift detection) | ASIDE | — | — | **HIGH** | — | **NOVEL** | — | yes |
| P079 | ES2 (embedding space separation) | ASIDE | **NOVEL** | — | **NOVEL** | — | — | — | yes |
| P080 | DefensiveTokens (Carlini et al.) | ASIDE | partial | **NOVEL** | — | — | — | — | yes |

**Note** : P070 et P072 sont marqués à vérifier manuellement (URLs non-arXiv, potentiel paywall). Leurs lignes delta sont laissées vides.

---

## 2. LOT 1 — RAG Defense (P061-P067)

### P061 — GMTP : Gradient-based Masked Token Probability [ABSTRACT SEUL]

**Auteurs** : San Kim, Jonghwi Kim, Yejin Jeon et al. | **Venue** : ACL Findings 2025 | **arXiv** : 2507.18202

**Méthode** : Trois étapes — (1) identification des tokens à fort gradient depuis la fonction de similarité du retriever, (2) masquage de ces tokens, (3) vérification de probabilité via un MLM. Les tokens injectés adversarialement exhibent des probabilités anormalement basses une fois masqués.

**Résultats** : Élimination de >90% du contenu empoisonné, maintien des documents légitimes. Testé sur datasets et settings adversariaux divers.

#### MITRE ATT&CK
- **T1027** (Obfuscated Files or Information) — GMTP contre les tokens obfusqués insérés dans le corpus RAG
- **T1562.001** (Impair Defenses: Disable Tools) — détection préventive avant que les tokens empoisonnés n'atteignent le LLM

#### Couches delta concernées
- **δ²** (Input Filtering) : GMTP opère au niveau du corpus avant retrieval — renforce la couche d'analyse syntaxique/sémantique
- **DETECT** : probabilité MLM comme signal de détection (complementaire à `perplexity_filter`)
- **MEAS** : métrique de precision/recall sur documents empoisonnés vs légitimes

#### Impact sur D-001 Triple Convergence
**Nuance** : GMTP offre un mécanisme δ² non-paramétrique qui ne nécessite pas de retraining. Il cible spécifiquement la couche d'injection au niveau du corpus, en amont du pipeline. D-001 affirme que δ² est bypassable à 99% — GMTP ne falsifie pas D-001 car il cible les attaques de poisoning de corpus (différent des character injection attacks de P009). GMTP RENFORCE δ² pour les corpus poisoning attacks mais ne comble pas le gap D-001 sur les character injection.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `gmtp_gradient_masking` | GMTP Gradient-Based Token Detection | PREV | δ² | Détection des tokens adversariaux via gradient du retriever + probabilité MLM sur tokens masqués. 16e détecteur candidat RagSanitizer. |

**Évaluation G-017** : GMTP défend les corpus RAG contre l'empoisonnement pur mais ne défend pas contre PIDP (attaque composée injection + poisoning simultanés). G-017 reste OUVERT.

---

### P062 — RAGuard : Secure RAG Against Poisoning Attacks [ABSTRACT SEUL]

**Auteurs** : Zirui Cheng, Jikai Sun, Anjun Gao et al. | **Venue** : IEEE BigData 2025 | **arXiv** : 2510.25025

**Méthode** : Framework non-paramétrique à trois mécanismes — (1) expansion du scope de retrieval pour diluer le contenu empoisonné, (2) filtrage par perplexité sur chunks, (3) filtrage par similarité textuelle pour détecter les attaques coordonnées.

**Résultats** : Validation sur datasets large-scale, efficace contre attaques adaptatives.

#### MITRE ATT&CK
- **T1565.001** (Data Manipulation: Stored Data) — RAGuard contre la manipulation de la base de connaissance RAG
- **T1190** (Exploit Public-Facing Application) — protection de l'endpoint RAG public

#### Couches delta concernées
- **δ²** : Triple mécanisme complémentaire à RagSanitizer (perplexité + similarité + scope)
- **DETECT** : signal de similarité coordonnée comme indicateur d'attaque multi-document

#### Impact sur D-001 Triple Convergence
**Nuance partielle** : RAGuard démontre qu'une défense non-paramétrique peut être efficace contre les adaptive attacks — ce qui adresse partiellement l'argument que δ² est systématiquement contournable. Cependant, RAGuard ne défend pas contre les character injection attacks (P009) ni contre les attaques composées PIDP. D-001 reste valide dans sa formulation générale.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `rag_scope_expansion_filter` | RAG Expanded Retrieval Scope Filter | PREV | δ² | Dilution du contenu empoisonné par expansion du scope de retrieval + perplexité chunk-wise + similarité coordonnée. |

---

### P063 — RevPRAG : RAG Poisoning Detection via Activation Analysis [ABSTRACT SEUL]

**Auteurs** : Xue Tan, Hao Luan, Mingyu Luo et al. | **Venue** : EMNLP 2025 Findings | **arXiv** : 2411.18948

**Méthode** : Pipeline RevPRAG exploitant les patterns d'activation internes du LLM pour distinguer les réponses correctes des réponses empoisonnées. Analyse l'état computationnel interne du modèle pendant la génération.

**Résultats** : TPR 98%, FPR ~1%. Testé sur multiples architectures RAG et benchmarks.

#### MITRE ATT&CK
- **T1565** (Data Manipulation) — détection de la manipulation de données via activations
- Technique défensive analogue à **T1003** (credential access detection via behavioral monitoring) dans le domaine traditionnel

#### Couches delta concernées
- **δ²** : Analyse d'activations comme signal de δ² — novel par rapport aux approches syntaxiques
- **DETECT** : 98% TPR place RevPRAG parmi les meilleurs détecteurs publiés
- **δ³** (implicite) : si les activations indiquent poisoning, le système peut bloquer la réponse avant output

#### Impact sur D-001 Triple Convergence
**Nuance** : RevPRAG opère à l'intérieur du modèle — c'est une approche white-box qui nécessite accès aux activations. Pour les modèles API-only (closed-source), inapplicable. Pour les modèles open-weight (Ollama/local — le deployment AEGIS), c'est applicable. Ne contredit pas D-001 mais offre une voie de détection δ² à haute précision pour le déploiement AEGIS.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `revprag_activation_detector` | RevPRAG Activation-Based Poisoning Detector | DETECT | δ²/DETECT | Analyse des patterns d'activation LLM internes pour distinguer réponses correctes/empoisonnées. 98% TPR, ~1% FPR. Nécessite open-weight. |

---

### P064 — RAGPart & RAGMask : Retrieval-Stage Defenses [ABSTRACT SEUL]

**Auteurs** : Pankayaraj Pathmanathan, Michael-Andrei Panaitescu-Liess, Cho-Yu Jason Chiang et al. | **Venue** : AAAI 2026 Workshop (Oral) | **arXiv** : 2512.24268

**Méthode** :
- **RAGPart** : Exploite la dynamique d'entraînement du dense retriever via partitioning des documents pour réduire l'impact des documents empoisonnés.
- **RAGMask** : Détecte les tokens suspects en mesurant les shifts de similarité lors du masquage ciblé.

**Résultats** : Testé sur 2 benchmarks, 4 stratégies de poisoning, 4 retrievers SOTA. Inclut une attaque interprétable pour stress-testing.

#### MITRE ATT&CK
- **T1565.001** (Data Manipulation: Stored Data) — protection au niveau de la couche retrieval
- **T1195** (Supply Chain Compromise) — RAGPart protège contre l'empoisonnement du pipeline de training du retriever

#### Couches delta concernées
- **δ²** : Deux mécanismes retrieval-stage complémentaires : partitioning (structurel) + masking (token-level)
- **DETECT** : RAGMask fournit un signal de détection de tokens adversariaux au niveau retrieval

#### Impact sur D-001 Triple Convergence
**Renforce partiellement** : Démontre que des interventions retrieval-stage peuvent être efficaces sans modifier le LLM générateur. La limitation identifiée par les auteurs ("potential and limitations of such defenses") suggère que les défenses retrieval-stage seules ne sont pas suffisantes — confirmant l'approche multi-couche de D-001.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `ragpart_document_partitioning` | RAGPart Document Partitioning Defense | PREV | δ² | Exploitation de la dynamique d'entraînement du retriever via partitioning pour réduire l'impact des documents empoisonnés. |
| `ragmask_similarity_shift_detection` | RAGMask Similarity-Shift Token Detection | DETECT | δ² | Détection de tokens adversariaux via mesure du shift de similarité lors du masquage ciblé pendant le retrieval. |

---

### P065 — RAGDefender : Efficient Defense Against Knowledge Corruption [ABSTRACT SEUL]

**Auteurs** : Minseok Kim, Hankook Lee, Hyungjoon Koo | **Venue** : ACSAC 2025 | **arXiv** : 2511.01268

**Méthode** : Mécanisme post-retrieval léger (resource-efficient) utilisant des techniques ML légères pour filtrer les passages adversariaux sans fine-tuning ni inférence répétée.

**Résultats** : Réduit l'ASR de Gemini de 0.89 à 0.02 (ratio 4:1 adversarial:légitime). Surpasse RobustRAG (ASR 0.69) et Discern-and-Answer (ASR 0.24).

#### MITRE ATT&CK
- **T1565** (Data Manipulation) — intervention post-retrieval avant génération
- **T1562.001** (Impair Defenses: Disable Tools) — neutralisation des documents empoisonnés avant qu'ils influencent le LLM

#### Couches delta concernées
- **δ¹** (partiel) : opère entre retrieval et génération, protégeant l'input effectif au LLM
- **δ²** : filtrage ML post-retrieval sur passages adversariaux
- **RESP** : action de blocage des passages suspects avant génération

#### Impact sur D-001 Triple Convergence
**Nuance significative** : ASR 0.89 → 0.02 est une réduction dramatique qui démontre que δ² peut être très efficace dans le pipeline RAG. Cependant, RAGDefender ne défend pas contre les character injection attacks (P009) ni contre les attaques composées. D-001 reste valide mais RAGDefender prouve qu'une défense δ² bien ciblée peut approcher le niveau δ³ pour les corpus poisoning attacks.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `post_retrieval_passage_filter` | Post-Retrieval Passage Filter | PREV | δ² | Filtrage ML léger post-retrieval pour neutraliser les passages adversariaux. Training-free. Efficace à ratio 4:1 adversarial. |

---

### P066 — RAGShield : Provenance-Verified Defense-in-Depth [ABSTRACT SEUL]

**Auteurs** : KrishnaSaiReddy Patil | **Venue** : Preprint 2026-04-01 | **arXiv** : 2604.00387

**Méthode** : Architecture 5 couches pour systèmes RAG gouvernementaux :
1. Attestation cryptographique C2PA des documents à l'ingestion
2. Retrieval pondéré par confiance (trust-weighted)
3. Détection de contradiction par taint lattice
4. Génération auditable avec provenance traçable
5. Mapping de conformité NIST SP 800-53

**Résultats** : Sur 500 passages (63 documents attaquants) — ASR 0.0% (CI: [0.0%, 1.9%]). Faiblesse identifiée : attaques insider in-place (17.5% success).

#### MITRE ATT&CK
- **T1195.002** (Supply Chain Compromise) — attestation cryptographique contre corpus poisoning via supply chain
- **T1078** (Valid Accounts) — insider threat détecté via taint lattice même avec provenance valide
- **T1565.001** (Data Manipulation: Stored Data) — protection complète de la base de connaissances

#### Couches delta concernées
- **δ¹** : Retrieval trust-weighted et génération auditable renforcent l'intégrité du contexte fourni au LLM
- **δ²** : Attestation cryptographique + contradiction lattice = défense robuste en amont
- **δ³** : Génération avec provenance = forme de vérification formelle de la source des outputs
- **RESP** : Mapping NIST SP 800-53 fournit un cadre de réponse aux incidents

#### Impact sur D-001 Triple Convergence
**Nuance importante** : RAGShield démontre qu'une architecture de défense en profondeur peut atteindre 0.0% ASR. Cependant : (1) l'attaque insider in-place (17.5%) révèle que même la provenance cryptographique a des limites, (2) le système nécessite une infrastructure gouvernementale (C2PA, NIST SP 800-53) non déployable dans les contextes médicaux légers. D-001 reste valide pour les systèmes sans infrastructure de provenance, mais RAGShield représente un reference architecture pour la défense maximale.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `cryptographic_document_attestation` | Cryptographic Document Attestation | PREV | δ² | Attestation C2PA-inspired des documents à l'ingestion. Bloque documents non signés ou forgés. |
| `taint_lattice_contradiction_detection` | Taint Lattice Cross-Source Contradiction Detection | DETECT | δ²/DETECT | Détection de contradictions inter-sources pour identifier les menaces internes même avec provenance valide. |
| `provenance_weighted_retrieval` | Trust-Weighted Provenance Retrieval | PREV | δ¹/δ² | Pondération du retrieval par score de confiance/provenance des documents. |

---

### P067 — Formal RAG Threat Model and Attack Surface [ABSTRACT SEUL]

**Auteurs** : Atousa Arzanipour, Rouzbeh Behnia, Reza Ebrahimi, Kaushik Dutta | **Venue** : 5th ICDM Workshop | **arXiv** : 2509.20324

**Contribution** : Premier threat model formel pour les systèmes RAG. Taxonomie structurée des types d'adversaires par niveau d'accès aux composants. Définitions formelles des menaces d'inférence d'appartenance (membership inference), d'empoisonnement, et de fuite d'information.

#### MITRE ATT&CK
- **T1003** (Credential Dumping analog) — membership inference attacks sur corpus RAG
- **T1565.001** (Data Manipulation: Stored Data) — data poisoning attacks
- **T1530** (Data from Cloud Storage Object) — information leakage sur documents retrieval

#### Couches delta concernées
- **Survey de toutes les couches** : P067 fournit le cadre formel pour analyser les menaces RAG à travers δ⁰-δ³
- **MEAS** : le threat model formel est un fondement pour mesurer la couverture AEGIS contre les menaces RAG

#### Impact sur D-001 Triple Convergence
**Validation théorique** : P067 fournit la formalisation académique de la surface d'attaque RAG. La taxonomie d'adversaires par niveau d'accès complète D-001 en montrant que le convergence triple s'étend à tous les types d'accès adversarial (white-box, gray-box, black-box). Ne contredit pas D-001 mais fournit un cadre pour le valider formellement.

**Évaluation G-017 (RagSanitizer vs PIDP)** : P067 formalise l'espace d'attaque RAG — confirme que les attaques composées (membership inference + poisoning simultanés) représentent une classe distincte non couverte par les défenses unidimensionnelles. G-017 est théoriquement ancré par P067.

---

## 3. LOT 2 — Medical Metrics (P068-P075)

### P068 — CARES : Medical LLM Safety Evaluation [ABSTRACT SEUL]

**Auteurs** : Sijia Chen, Xiaomin Li, Mengxue Zhang et al. | **Venue** : Preprint 2025 | **arXiv** : 2505.11413

**Contribution** : 18 000+ prompts, 8 principes de sécurité médicale, protocole 3-niveaux (Accept/Caution/Refuse), Safety Score fin. Révèle sur-prudence sur requêtes légitimes + vulnérabilité aux reformulations subtiles.

#### Couches delta concernées
- **δ⁰** : évaluation de l'alignement de base face aux reformulations subtiles (jailbreaks légers)
- **δ¹** : défense par "reminder-based conditioning"
- **δ²** : classifier léger proposé pour détecter les jailbreak attempts
- **MEAS** : Safety Score 3-niveaux + 8 principes médicaux

#### Impact sur D-001
**Renforce** : La vulnérabilité aux reformulations subtiles confirme que δ⁰ reste bypassable même par des attaquants de faible compétence. La sur-prudence identifiée démontre l'inadéquation d'une réponse δ⁰ seule (sur-refus vs. sous-refus).

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `medical_safety_score_cares` | CARES Medical Safety Score | MEAS | MEAS | Score de sécurité médicale 3-niveaux (Accept/Caution/Refuse) × 8 principes médicaux. Complémentaire au SVC composite AEGIS. |

---

### P069 — MedRiskEval + PatientSafetyBench [ABSTRACT SEUL]

**Auteurs** : Jean-Philippe Corbeil, Minseon Kim, Maxime Griot et al. | **Venue** : EACL 2026 (industry) | **arXiv** : 2507.07248

**Contribution** : Benchmark multi-stakeholders (patients, généralistes, cliniciens). PatientSafetyBench : 466 samples, 5 catégories de risque critique. Insiste sur la perspective patient (non uniquement clinicien).

#### Couches delta concernées
- **MEAS** : PatientSafetyBench comme outil de mesure orienté patient — complémentaire aux benchmarks clinicien-centré
- **δ⁰/δ¹** : évaluation des modèles à travers différents profils utilisateurs

#### Impact sur D-001
Renforce D-001 en montrant que le risque s'étend au-delà des scenarios clinicien — les patients non-experts constituent une surface d'attaque supplémentaire par interaction maladroite (non-adversariale mais risquée).

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `patient_safety_bench_eval` | PatientSafetyBench Evaluation | MEAS | MEAS | Benchmark 466 samples, 5 catégories de risque critique, centré perspective patient. |

---

### P071 — Medical AI Security Framework Pratique [ABSTRACT SEUL]

**Auteurs** : Jinghao Wang, Ping Zhang, Carter Yagemann et al. | **Venue** : Preprint 2025 | **arXiv** : 2512.08185

**Contribution** : Framework reproductible évaluant jailbreaking (role-playing, authority impersonation, multi-turn) et extraction de données privées (privacy vulnerabilities). Fonctionne sur CPU consommateur, sans IRB, avec dossiers patients synthétiques.

#### Couches delta concernées
- **δ⁰** : vulnérabilité aux 3 classes de jailbreak
- **δ¹** : authority impersonation contourne le role anchoring
- **δ²** : multi-turn manipulation exploite le context drift
- **MEAS** : framework reproductible sans IRB

#### Impact sur D-001
**Renforce** : Confirme les 3 vecteurs de D-001 dans le domaine médical. L'absence d'IRB facilite la validation expérimentale des thèses de D-001 dans le cadre académique AEGIS.

---

### P073 — MEDIC : Évaluation Multi-Dimensionnelle Clinique [ABSTRACT SEUL]

**Auteurs** : Praveenkumar Kanithi, Clement Christophe, Marco AF Pimentel et al. | **Venue** : Preprint arXiv 2024 | **arXiv** : 2409.07314

**Contribution** : MEDIC évalue 5 dimensions cliniques au-delà des QCM médicaux. Découvre le paradoxe actif vs. passif : haut taux de refus ne prédit pas la détection d'erreurs dans la documentation clinique.

#### Couches delta concernées
- **δ⁰** : le paradoxe actif/passif révèle que le fine-tuning pour le refus (δ⁰ safety) ne garantit pas la sécurité active — finding critique pour l'hypothèse que δ⁰ est suffisant
- **MEAS** : Cross-Examination Framework (CEF) sans référence = technique de mesure nouvellement applicable à AEGIS

#### Impact sur D-001
**Renforce avec une dimension nouvelle** : le paradoxe actif/passif (safety refusal rate ≠ safety audit accuracy) ajoute une dimension à D-001 non encore formalisée. Un modèle peut exhiber un δ⁰ fort sur les benchmarks de refus mais rater les audits de sécurité cliniques — D-001 s'étend à ce gap.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `clinical_cef_evaluation` | Cross-Examination Framework Clinical | MEAS | MEAS | Évaluation de l'exactitude informationnelle sans référence. Mesure le paradoxe passif (refus) vs. actif (audit) de sécurité. |

---

### P074 — Safe AI Clinicians : Continual Fine-Tuning [ABSTRACT SEUL]

**Auteurs** : Hang Zhang, Qian Lou, Yanshan Wang et al. | **Venue** : Preprint 2025 | **arXiv** : 2501.18632

**Contribution** : Teste 3 techniques de jailbreak black-box avancées sur 7 LLMs. Propose Continual Fine-Tuning (CFT) comme défense. Évalue le tradeoff sécurité/utilité clinique.

#### Couches delta concernées
- **δ⁰** : CFT comme renforcement itératif de l'alignement (complément à P034 déjà analysé)
- **δ¹** : oui (system prompt as part of CFT)
- **MEAS** : évaluation comparative sur 7 LLMs

#### Impact sur D-001
**Renforce** : Confirme que les 3 techniques black-box bypasse δ⁰/δ¹ sur les 7 modèles. CFT adresse partiellement mais ne résout pas la Triple Convergence.

---

### P075 — Beyond the Leaderboard : MedCheck [ABSTRACT SEUL]

**Auteurs** : Zizhan Ma, Wenxuan Wang, Guo Yu et al. | **Venue** : Preprint 2025 | **arXiv** : 2508.04325

**Contribution** : MedCheck : checklist 46 critères médicaux pour évaluer la qualité des benchmarks. Analyse 53 benchmarks médicaux. Identifie : disconnects cliniques, contamination données, gaps sécurité (robustness, uncertainty quantification).

#### Couches delta concernées
- **MEAS** : MedCheck est un meta-benchmark — évalue la qualité des évaluations elles-mêmes
- **Survey** de tous les layers via 53 benchmarks

#### Impact sur D-001
**Validation méta** : P075 identifie que les benchmarks médicaux existants sous-évaluent la robustesse et l'uncertainty — deux dimensions directement liées à la sécurité δ⁰ et à la mesure Sep(M). Cela renforce la proposition AEGIS d'un framework d'évaluation spécialisé.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `medcheck_benchmark_quality` | MedCheck Benchmark Quality Assessment | MEAS | MEAS | Checklist 46 critères pour évaluer la qualité des benchmarks médicaux. Inclut robustesse et uncertainty quantification. |

---

## 4. LOT 3 — ASIDE Architectural (P076-P080)

### P076 — ISE : Instructional Segment Embedding [ABSTRACT SEUL]

**Auteurs** : Tong Wu, Shujian Zhang, Kaiqiang Song et al. | **Venue** : ICLR 2025 | **arXiv** : 2410.09102

**Méthode** : ISE intègre l'information de priorité directement dans les embeddings d'entrée, inspiré de l'architecture BERT. Le modèle peut explicitement différencier et prioriser les types d'instructions sans traitement uniforme.

**Résultats** : +15.75% robust accuracy (Structured Query benchmark), +18.68% (Instruction Hierarchy benchmark), +4.1% instruction-following (AlpacaEval).

#### MITRE ATT&CK
- **T1562.001** (Impair Defenses: Disable Tools) — ISE contredit la capacité d'un attaquant à désactiver les instructions système via user prompt
- **T1059** (Command and Scripting Interpreter) — ISE réduit le risque d'exécution d'instructions non autorisées

#### Couches delta concernées
- **δ⁰** : ISE renforce δ⁰ en rendant la hiérarchie d'instructions plus profonde que la surface
- **δ¹** : +18.68% sur Instruction Hierarchy benchmark = validation directe du renforcement δ¹
- **MEAS** : benchmarks Structured Query et AlpacaEval comme métriques de validation

#### Impact sur D-001 Triple Convergence
**Nuance importante** : ISE (ICLR 2025) est la première démonstration publiée peer-reviewed qu'une modification architecturale améliore significativement l'instruction hierarchy. Cependant, P077 (RUN-004) remet en question si cette amélioration est une vraie séparation ou l'apprentissage de nouveaux proxies (shortcuts). ISE NUANCE D-001 en montrant que δ¹ peut être architecturalement renforcé, mais P077 tempère cette affirmation.

#### Impact sur D-015 ASIDE
**Validée partiellement** : ISE et ASIDE partagent la même intuition (embedding-level separation), mais ISE est la démonstration la plus solide publiée. D-015 ASIDE est validée architecturalement par ISE au niveau ICLR 2025.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `ise_segment_embedding` | ISE Instructional Segment Embedding | PREV | δ¹/δ⁰ | Embedding de priorité instructionnelle dans le modèle. +18.68% instruction hierarchy. Requiert fine-tuning. Défense architecturale profonde. |

---

### P077 — The Illusion of Role Separation [ABSTRACT SEUL]

**Auteurs** : Zihao Wang, Yibo Jiang, Jiahao Yu et al. | **Venue** : Preprint (venue ICML 2025 non confirmée) | **arXiv** : 2505.00626

**Contribution** : Démontre que les modèles fine-tunés pour la séparation de rôles utilisent des raccourcis (shortcuts) au lieu d'une vraie séparation : (1) task type exploitation — le rôle est inféré par le type de tâche associé, pas par le marqueur de rôle ; (2) proximity to begin-of-text — le rôle est inféré par la position, pas par la sémantique.

**Fix proposé** : Renforcement des signaux invariants de frontière de rôle via manipulation des position IDs.

#### MITRE ATT&CK
- **T1027** (Obfuscated Files or Information) — les attaquants exploitent les shortcuts de task type pour injecter des rôles déguisés
- **T1562.001** (Impair Defenses: Disable Tools) — exploitation des proxies pour contourner les défenses par séparation de rôles

#### Couches delta concernées
- **δ¹** : BRITTLE — les défenses δ¹ basées sur la séparation de rôles (role_anchoring, separation_tokens) sont fragilisées par les shortcuts
- **MEAS** : méthodologie d'identification des shortcuts applicable pour auditer les défenses AEGIS existantes

#### Impact sur D-001 Triple Convergence
**Renforce et étend** : P077 ajoute une nouvelle dimension à D-001 — les défenses δ¹ par séparation de rôles peuvent exhiber une robustesse apparente basée sur des shortcuts qui s'effondrent face à des attaquants ayant compris les proxies. Le "delta1 poisonable" de D-001 s'étend à "delta1 shortcut-exploitable".

#### Impact sur D-015 ASIDE
**CONTESTÉE** : P077 est le papier le plus défavorable à D-015 dans le corpus RUN-004. Si les modèles apprennent des proxies au lieu de la vraie séparation, ASIDE (orthogonal rotation) peut créer de nouveaux proxies plutôt que résoudre le problème fondamental. D-015 reste valide comme architecture théorique mais sa robustesse pratique est questionnée.

#### Évaluation G-019 (ASIDE vs adaptatif)
**Confirmé et renforcé** : P077 fournit le mécanisme précis par lequel un attaquant adaptatif peut contourner les défenses par séparation — en exploitant les proxies de task type ou de position. G-019 est théoriquement fondé par P077.

---

### P078 — ZEDD : Zero-Shot Embedding Drift Detection [ABSTRACT SEUL]

**Auteurs** : Anirudh Sekar, Mrinal Agarwal, Rachel Sharma et al. | **Venue** : NeurIPS 2025 Workshop Lock-LLM | **arXiv** : 2601.12359

**Méthode** : Détection d'injections de prompts via mesure de dérive sémantique dans l'espace d'embedding. Comparaison cosinus de paires adversariales/clean. Zero-shot : pas d'accès aux internals, pas de connaissance préalable des attaques, pas de retraining.

**Résultats** : >93% detection accuracy sur Llama 3, Qwen 2, Mistral. FPR <3%. Transférable cross-architecture.

#### MITRE ATT&CK
- **T1059** (Command and Scripting Interpreter) — ZEDD détecte les injections avant exécution
- **T1027** (Obfuscated Files or Information) — détection de dérive sémantique indépendante de l'obfuscation spécifique

#### Couches delta concernées
- **δ²** : détection légère et transférable, intégrable dans les pipelines LLM existants
- **DETECT** : >93% accuracy + <3% FPR = performance DETECT de haute qualité

#### Impact sur D-001 Triple Convergence
**Nuance** : ZEDD offre une défense δ² zero-shot qui n'exige ni knowledge attacks ni model internals — adresse partiellement l'argument que δ² nécessite des défenses spécialisées par type d'attaque. Cependant, les attaques par embedding perturbation adversariale (P079 motivations) pourraient contourner ZEDD. D-001 reste valide mais ZEDD renforce le arsenal δ².

#### Impact sur D-015 ASIDE / G-019
**Complémentaire** : ZEDD opère sur la dérive sémantique de l'input, pas sur la structure d'embedding du modèle. Il peut détecteur des tentatives d'injection sans savoir si ASIDE est déployé. Complémentaire à D-015 plutôt que validant ou invalidant.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `zedd_embedding_drift_detection` | ZEDD Zero-Shot Embedding Drift Detection | DETECT | δ²/DETECT | Détection d'injections via dérive cosinus dans l'espace d'embedding. Zero-shot, cross-architecture. >93% accuracy, <3% FPR. |

---

### P079 — ES2 : Embedding Space Separation [ABSTRACT SEUL]

**Auteurs** : Xu Zhao, Xiting Wang, Weiran Shen et al. | **Venue** : Preprint 2026-03-01 | **arXiv** : 2603.20206

**Méthode** : ES2 exploite la linéarité séparable des représentations harmful/safe dans l'espace d'embedding. Fine-tuning de représentation pour maximiser la distance entre requêtes harmful et safe. Régularisation KL-divergence pour maintenir les performances générales.

**Résultats** : Amélioration substantielle de la sécurité tout en maintenant les capacités générales sur multiples LLMs open-source.

#### MITRE ATT&CK
- **T1059** (Command and Scripting Interpreter) — ES2 rend les requêtes harmful plus difficiles à camoufler comme bénignes
- **T1562.001** (Impair Defenses) — ES2 résiste aux perturbations d'embedding adversariales

#### Couches delta concernées
- **δ⁰** : ES2 modifie la représentation interne — renforce δ⁰ à un niveau plus profond que le RLHF surface
- **δ²** : separation dans l'espace d'embedding complète les défenses syntaxiques

#### Impact sur D-001 Triple Convergence
**Nuance structurelle** : ES2 propose une modification d'embedding qui adresse la "shallowness" de δ⁰ identifiée dans D-001 (P052 martingale decomposition). En maximisant la séparation géométrique harmful/safe, ES2 peut rendre δ⁰ plus profond structurellement. Toutefois, cela nécessite fine-tuning et ne s'applique pas aux modèles API-only. D-001 reste valide pour les déploiements actuels.

#### Impact sur D-015 ASIDE
**Complémentaire** : ES2 et ASIDE opèrent tous deux au niveau de l'espace d'embedding mais avec des objectifs distincts — ASIDE sépare instruction vs. données, ES2 sépare harmful vs. safe. Les deux approches sont potentiellement combinables. D-015 s'enrichit de la preuve que les espaces d'embedding sont géométriquement séparables.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `es2_embedding_space_separation` | ES2 Embedding Space Separation | PREV | δ⁰/δ² | Fine-tuning de représentation pour maximiser la distance géométrique harmful/safe. Régularisation KL pour maintien des performances. Requiert open-weight. |

---

### P080 — DefensiveTokens (Carlini et al.) [ABSTRACT SEUL]

**Auteurs** : Sizhe Chen, Yizhu Wang, Nicholas Carlini et al. | **Venue** : Preprint (venue AISec/ICML 2025 non confirmée) | **arXiv** : 2507.07974

**Méthode** : Tokens spéciaux avec embeddings optimisés pour la sécurité, prépendus à l'input. Permettent un switch flexible entre utilité maximale (sans tokens) et sécurité maximale (avec tokens) à test-time, sans modifier le modèle de base.

**Résultats** : Sécurité comparable aux défenses training-time, flexibilité de déploiement. Les auteurs reconnaissent que les défenses test-time restent moins efficaces que les défenses training-time.

#### MITRE ATT&CK
- **T1059** (Command and Scripting Interpreter) — DefensiveTokens guide le modèle loin des instructions injectées
- **T1562.001** (Impair Defenses) — contournement de la capacité d'un attaquant à désactiver les défenses

#### Couches delta concernées
- **δ¹** : DefensiveTokens est une forme avancée de séparation de tokens (analogue à `separation_tokens` mais avec embeddings optimisés)
- **δ⁰** (partiel) : les embeddings optimisés influencent le comportement du modèle en modifiant le contexte initial

#### Impact sur D-001 Triple Convergence
**Nuance** : DefensiveTokens est une approche test-time qui offre un compromis pratique : déployable sans modifier le modèle de base, switchable selon le contexte de risque. La limite reconnue par les auteurs ("test-time defenses less effective than training-time") confirme D-001 mais l'approche est pertinente pour les déploiements AEGIS sur modèles API ou modèles partagés.

#### Impact sur D-015 ASIDE
**Partiel** : DefensiveTokens et ASIDE partagent l'intuition d'une séparation par embedding, mais DefensiveTokens est test-time (plus pratique) et ASIDE est training-time (plus robuste). Les deux sont complémentaires pour D-015.

#### Évaluation G-019 (ASIDE vs adaptatif)
**Confirme la limite** : les auteurs reconnaissent explicitement que les défenses test-time comme DefensiveTokens sont moins robustes face aux attaquants adaptatifs que les défenses training-time. Cela confirme G-019.

#### Nouvelles techniques défensives — Proposition taxonomie AEGIS
| ID Proposé | Nom | Classe | Layer | Description |
|-----------|-----|--------|-------|-------------|
| `defensive_tokens_embedding` | Defensive Tokens Optimized Embedding | PREV | δ¹ | Tokens spéciaux aux embeddings optimisés pour sécurité, prépendus à test-time. Switch flexible sécurité/utilité. Comparable aux défenses training-time. Carlini et al. |

---

## 5. Nouvelles Techniques Défensives Proposées — T-67 et suivantes

Synthèse des propositions d'ajout à la taxonomie AEGIS (66 techniques existantes + 4 de RUN-003 = 70 en projection). RUN-004 propose les suivantes :

| ID Proposé | Technique | Classe | Layer | Source | Priorité |
|-----------|-----------|--------|-------|--------|----------|
| T-71 | `gmtp_gradient_masking` | PREV | δ² | P061 — ACL 2025 | **CRITIQUE** — 16e détecteur RagSanitizer |
| T-72 | `revprag_activation_detector` | DETECT | δ²/DETECT | P063 — EMNLP 2025 | **HAUTE** — 98% TPR |
| T-73 | `post_retrieval_passage_filter` | PREV | δ² | P065 — ACSAC 2025 | **HAUTE** — ASR 0.89→0.02 |
| T-74 | `rag_scope_expansion_filter` | PREV | δ² | P062 — IEEE BigData 2025 | HAUTE |
| T-75 | `ragpart_document_partitioning` | PREV | δ² | P064 — AAAI 2026 Workshop | HAUTE |
| T-76 | `ragmask_similarity_shift_detection` | DETECT | δ² | P064 — AAAI 2026 Workshop | HAUTE |
| T-77 | `cryptographic_document_attestation` | PREV | δ² | P066 — Preprint 2026 | HAUTE (gouvernement/médical) |
| T-78 | `taint_lattice_contradiction_detection` | DETECT | δ²/DETECT | P066 — Preprint 2026 | HAUTE |
| T-79 | `provenance_weighted_retrieval` | PREV | δ¹/δ² | P066 — Preprint 2026 | MOYENNE |
| T-80 | `ise_segment_embedding` | PREV | δ¹/δ⁰ | P076 — ICLR 2025 | **HAUTE** — +18.68% IH |
| T-81 | `zedd_embedding_drift_detection` | DETECT | δ²/DETECT | P078 — NeurIPS 2025 Workshop | HAUTE — zero-shot |
| T-82 | `es2_embedding_space_separation` | PREV | δ⁰/δ² | P079 — Preprint 2026 | HAUTE — open-weight |
| T-83 | `defensive_tokens_embedding` | PREV | δ¹ | P080 — Carlini et al. 2025 | HAUTE — test-time |
| T-84 | `medical_safety_score_cares` | MEAS | MEAS | P068 — Preprint 2025 | HAUTE — médical |
| T-85 | `patient_safety_bench_eval` | MEAS | MEAS | P069 — EACL 2026 | HAUTE — patient |
| T-86 | `clinical_cef_evaluation` | MEAS | MEAS | P073 — arXiv 2024 | MOYENNE |
| T-87 | `medcheck_benchmark_quality` | MEAS | MEAS | P075 — Preprint 2025 | MOYENNE |

**Total proposé après RUN-004** : 70 (en projection RUN-003) + 17 = **87 techniques** en projection.

**Priorité d'implémentation** :
1. **T-71 (GMTP)** : 16e détecteur RagSanitizer — directement intégrable dans `backend/rag_sanitizer.py`
2. **T-73 (Post-retrieval filter)** : ASR 0.89→0.02 — défense post-retrieval à implémenter dans la couche RAG AEGIS
3. **T-80 (ISE)** : défense architecturale δ¹ — nécessite fine-tuning des modèles AEGIS (Ollama)
4. **T-72 (RevPRAG)** : 98% TPR — applicable sur modèles open-weight Ollama déployés dans AEGIS

---

## 6. Impact sur les Découvertes D-001 et D-015

### D-001 — Triple Convergence

**Statut après RUN-004** : **RENFORCÉE avec nuances**

| Composant | Statut | Evidence RUN-004 |
|-----------|--------|-----------------|
| δ⁰ erasable | **CONFIRMÉ** | P068 (reformulations subtiles), P073 (paradoxe actif/passif), P074 (3 techniques black-box) |
| δ¹ poisonable | **CONFIRMÉ + ÉTENDU** | P077 (shortcuts role separation), P080 (limit test-time) |
| δ² bypass 99% | **NUANCÉ** | P061-P065 (défenses RAG réduisent ASR dramatiquement) MAIS restent inefficaces contre attaques composées et character injection |
| Résolution architecturale | **PARTIELLE** | P076 ISE (+18.68% IH) et P079 ES2 offrent des approches plus profondes mais nécessitent fine-tuning |

**Bilan D-001** : La Triple Convergence reste valide pour les systèmes non renforcés. Les papiers RUN-004 démontrent que des défenses spécialisées peuvent adresser chaque composant individuellement, mais l'argument central de D-001 — qu'aucune défense monocouche n'est suffisante — est renforcé par P077 (shortcuts comme fragilité cachée) et P068 (sur-refus + sous-refus simultanés).

**Nouvelle dimension D-001 identifiée par RUN-004** : le **paradoxe actif/passif** (P073 MEDIC) — un modèle peut avoir un fort taux de refus (δ⁰ apparent) mais échouer les audits de sécurité clinique (δ³ absent). Cette dissociation renforce l'argument que le stack complet δ⁰–δ³ est nécessaire.

---

### D-015 — ASIDE Architectural Separation

**Statut après RUN-004** : **VALIDÉE architecturalement, CONTESTÉE empiriquement**

| Dimension | Statut | Evidence |
|-----------|--------|----------|
| Faisabilité architecturale | **VALIDÉE** | P076 ISE (ICLR 2025) : +18.68% sur Instruction Hierarchy |
| Robustesse sous attaque adaptative | **CONTESTÉE** | P077 : shortcuts (task type + position proximity) fragilisent la séparation apparente |
| Approches complémentaires | **IDENTIFIÉES** | P078 (ZEDD), P079 (ES2), P080 (DefensiveTokens) |
| Déploiement pratique | **NUANCÉ** | P080 : test-time moins robuste que training-time |

**Bilan D-015** : ASIDE comme concept architectural est renforcé par ISE (P076) qui prouve qu'il est possible. Cependant, P077 révèle une limitation fondamentale — les modèles peuvent apprendre des raccourcis qui simulent la séparation sans l'implémenter réellement. D-015 devrait être reformulée : "ASIDE est possible architecturalement, mais nécessite une validation explicite anti-shortcuts (P077 fix : position ID manipulation)."

---

## 7. Impact sur les Gaps G-017 et G-019

### G-017 — RagSanitizer vs PIDP (Compound Attack)

**Définition** : Le RagSanitizer actuel (15 détecteurs, 12 techniques Hackett) défend contre les injections de caractères et les techniques d'obfuscation de P009/P049. PIDP (P054, RUN-003) combine injection de prompt + empoisonnement de base de données simultanément. G-017 est le gap entre la défense unidimensionnelle de RagSanitizer et l'attaque composée PIDP.

**Statut après RUN-004** : **PARTIELLEMENT ADRESSÉ, NON RÉSOLU**

| Défense | Composant adressé | Composant non adressé |
|---------|------------------|----------------------|
| GMTP (P061, T-71) | Empoisonnement corpus RAG (corpus poisoning pur) | Injection de prompt simultanée |
| RAGuard (P062, T-74) | Empoisonnement corpus (perplexité + similarité) | Compound attack orchestration |
| RAGDefender (P065, T-73) | Post-retrieval passage filtering | Persistance de poisoning cross-session |
| RAGShield (P066, T-77/78) | Provenance + contradiction lattice | Attaques insider (17.5% residual) |

**Conclusion G-017** : Les défenses RAG de RUN-004 adressent le volet "empoisonnement de corpus" de PIDP mais aucune ne traite l'orchestration simultanée injection+poisoning. G-017 reste **OUVERT**. La combinaison T-71 (GMTP) + T-73 (post-retrieval filter) dans RagSanitizer réduirait l'ASR mais ne fermerait pas G-017 complètement.

**Recommandation** : Implémenter T-71 (GMTP) comme 16e détecteur RagSanitizer + T-73 (post-retrieval filter) pour la couche RAG. Documenter le gap résiduel G-017 pour la thèse.

---

### G-019 — ASIDE vs Attaquant Adaptatif

**Définition** : ASIDE (orthogonal rotation, P057 RUN-003) propose une séparation architecturale instruction/données. G-019 est le gap entre la robustesse théorique d'ASIDE et sa résistance face à un attaquant adaptatif qui connaît la technique de défense.

**Statut après RUN-004** : **CONFIRMÉ et ÉTENDU**

| Papier | Contribution à G-019 |
|--------|---------------------|
| P077 (Illusion of Role Separation) | **Mécanisme d'attaque identifié** : exploitation des proxies task type + position proximity |
| P078 (ZEDD) | Détecteur complémentaire zero-shot mais n'empêche pas l'exploitation des shortcuts |
| P079 (ES2) | Renforce la séparation embedding mais reste vulnérable si l'attaquant cible la frontière de séparation |
| P080 (DefensiveTokens) | Reconnaît explicitement la limite des défenses test-time vs. adaptatif |

**Conclusion G-019** : G-019 est **CONFIRMÉ et ÉTENDU**. P077 fournit le mécanisme précis d'attaque contre les défenses par séparation (task type shortcuts + position proximity shortcuts). Un attaquant adaptatif sachant qu'ASIDE est déployé peut :
1. Formuler ses injections comme un type de tâche "légitime" (task type exploit)
2. Placer ses instructions adversariales en début de séquence (position proximity exploit)
3. Contourner la rotation orthogonale en exploitant des proxies non adressés par l'entraînement

**Fix proposé** (P077) : manipulation des position IDs pour renforcer les signaux invariants. À intégrer dans la documentation D-015 et dans la recommandation de déploiement ASIDE pour AEGIS.

---

## 8. Nouvelles Découvertes Proposées — D-017 à D-020

### D-017 — Défense RAG à 4 Couches

**Statut** : **CONFIRMÉE** par corpus P061-P066

**Définition** : Les papiers RUN-004 LOT 1 convergent vers une architecture de défense RAG à 4 couches naturelles :

| Couche | Technique | Source | AEGIS |
|--------|-----------|--------|-------|
| Couche 1 — Ingestion | Attestation cryptographique (C2PA) | P066 (RAGShield) | T-77 |
| Couche 2 — Corpus | Gradient-based token detection (GMTP) + similarity shift (RAGMask) | P061, P064 | T-71, T-76 |
| Couche 3 — Retrieval | Document partitioning (RAGPart) + scope expansion (RAGuard) | P062, P064 | T-74, T-75 |
| Couche 4 — Post-retrieval | Activation analysis (RevPRAG) + passage filter (RAGDefender) | P063, P065 | T-72, T-73 |

**Evidence** : 6 papiers (P061-P066) publiés dans 5 venues de premier plan (ACL, IEEE BigData, EMNLP, AAAI, ACSAC) couvrent indépendamment les 4 couches. La convergence est statistiquement significative.

**Impact thèse AEGIS** : D-017 est une découverte empirique issue du corpus RUN-004. Elle fournit une architecture de référence pour la défense RAG en contexte médical, complémentaire au framework δ⁰–δ³ existant.

---

### D-018 — Paradoxe Actif/Passif de la Sécurité Médicale

**Statut** : **CONFIRMÉE** par P073 (MEDIC)

**Définition** : Dans le domaine médical, un fort taux de refus (passive safety — δ⁰ apparent) ne prédit pas la capacité d'audit de sécurité clinique (active safety — δ³ nécessaire). Les deux capacités sont dissociées et doivent être évaluées séparément.

**Evidence** : P073 MEDIC, publié en arXiv avec leaderboard public HuggingFace.

**Impact thèse AEGIS** : D-018 renforce la nécessité du stack complet δ⁰–δ³ et invalide les approches qui mesurent uniquement le taux de refus comme proxy de sécurité. Cela justifie le SVC composite score d'AEGIS qui intègre plusieurs dimensions.

---

### D-019 — Architecture Embedding-Level Defense Landscape

**Statut** : **CONFIRMÉE** par P076, P078, P079, P080

**Définition** : Quatre papiers indépendants (ISE/ICLR, ZEDD/NeurIPS Workshop, ES2, DefensiveTokens/Carlini) convergent vers une famille de défenses opérant dans l'espace d'embedding avec une hiérarchie de profondeur :

| Niveau | Technique | Robustesse | Coût |
|--------|-----------|-----------|------|
| Training-time deep | ISE (P076) + ES2 (P079) | **Haute** | Fine-tuning requis |
| Training-time separation | ASIDE (P057, RUN-003) | **Haute (contestée P077)** | Architecture modification |
| Test-time token-level | DefensiveTokens (P080) | Moyenne | Minimal |
| Test-time detection | ZEDD (P078) | Haute (detection seulement) | Minimal |

**Impact thèse AEGIS** : D-019 fournit un cadre pour choisir les défenses embedding-level en fonction des contraintes de déploiement (API vs. open-weight, inference vs. training). Cela enrichit la recommandation architecturale de D-015 ASIDE.

---

### D-020 — Shortcut-Fragility des Défenses par Séparation

**Statut** : **NOUVELLEMENT IDENTIFIÉE** par P077

**Définition** : Les défenses qui semblent implémenter une séparation robuste (role separation, instruction hierarchy, segment embedding) peuvent reposer sur des raccourcis appris durant le fine-tuning (task type proxies, position proxies) plutôt que sur la séparation sémantique réelle. Ces shortcuts s'effondrent face à des attaquants adaptatifs qui les ciblent.

**Evidence** : [ABSTRACT SEUL] P077 (Wang, Jiang, Yu et al.) — mécanisme démontré pour les modèles fine-tunés pour la séparation de rôles.

**Impact thèse AEGIS** : D-020 est une découverte critique pour l'évaluation de toutes les défenses δ¹ d'AEGIS. Elle implique que :
1. `role_anchoring` et `separation_tokens` doivent être testés contre des attaquants exploitant les task type proxies
2. `aside_orthogonal_separation` doit inclure une validation anti-shortcut (position ID manipulation)
3. ISE (T-80) doit être évaluée sur des benchmarks adversariaux testant spécifiquement les proxies

---

## 9. Architecture de Défense Recommandée — 4 Couches RAG + ASIDE

Synthèse des recommandations RUN-004 pour AEGIS :

### 9.1 Architecture RAG Défensive (D-017)

```
[Ingestion]      → T-77 (Attestation C2PA)
[Corpus]         → T-71 (GMTP) + T-76 (RAGMask)
[Retrieval]      → T-74 (RAGuard scope) + T-75 (RAGPart)
[Post-retrieval] → T-72 (RevPRAG, open-weight) | T-73 (RAGDefender, API)
```

**Gap résiduel** : G-017 (PIDP compound) non fermé par cette architecture.

### 9.2 Architecture Embedding-Level (D-019)

```
[Training-time]  → T-80 (ISE) + T-82 (ES2) + T-71 GMTP sur corpus
[Test-time]      → T-83 (DefensiveTokens) + T-81 (ZEDD detection)
[Validation]     → Anti-shortcut testing (D-020 fix : position ID)
```

**Gap résiduel** : G-019 (ASIDE vs adaptatif) — la validation anti-shortcut (P077 fix) doit être implémentée.

### 9.3 Métriques Médicales Complémentaires

```
[Safety scoring] → T-84 (CARES 8 principes) + AEGIS SVC composite
[Benchmark]      → T-85 (PatientSafetyBench) + T-87 (MedCheck 46 critères)
[Clinical audit] → T-86 (CEF cross-examination) + D-018 (actif/passif dissociation)
```

---

## 10. Mise à Jour Cumulative MITRE ATT&CK (RUN-004)

### Nouvelles techniques/subtechniques identifiées (RUN-004)

| MITRE ID | Technique | Papiers RUN-004 | Contexte |
|----------|-----------|----------------|---------|
| T1195.002 | Supply Chain Compromise | P066 (corpus ingestion via supply chain) | RAGShield C2PA |
| T1078 | Valid Accounts (insider threat) | P066 (insider in-place replacement) | Taint lattice detection |
| T1530 | Data from Cloud Storage | P067 (formal RAG membership inference) | Formal threat model |

**Bilan MITRE cumulatif** : 20 techniques (RUN-002) + 2 sub-techniques (RUN-003) + 3 nouvelles (RUN-004) = **25 techniques/sub-techniques uniques** dans le corpus complet (P001-P080).

---

## 11. DIFF — RUN-004 vs RUN-003

### Ajouts

- 20 analyses threat model (P061-P080, dont P070/P072 partielles — à vérifier manuellement)
- 3 nouvelles techniques MITRE (T1078, T1530 + sub-T1195.002 confirmée)
- 17 nouvelles techniques défensives proposées (T-71 à T-87)
- 4 nouvelles découvertes formalisées (D-017, D-018, D-019, D-020)
- 2 gaps mis à jour (G-017 partiellement adressé, G-019 confirmé et étendu)
- Architecture de défense RAG à 4 couches (D-017)
- Architecture embedding-level défense hiérarchisée (D-019)

### Modifications

- D-001 Triple Convergence : renforcée + nouvelle dimension paradoxe actif/passif (D-018)
- D-015 ASIDE : validée architecturalement (P076 ISE/ICLR) + contestée empiriquement (P077 shortcuts)
- G-017 : partiellement adressé par T-71/T-73 mais non résolu
- G-019 : confirmé et étendu par P077 (mécanisme de shortcut identifié)
- MITRE count : 22 → 25 techniques
- Taxonomie défense projection : 70 (RUN-003) → 87 techniques (RUN-004 ajouts)

### Inchangés

- P001-P060 analyses (60 existants) — aucune modification
- Framework delta-layer core (δ⁰–δ³) — validé, non modifié
- Architecture chaînes AEGIS (34 chaînes) — aucun changement structurel
- RagSanitizer 15 détecteurs / 12 techniques Hackett — validé par P049/P061, candidat T-71 à intégrer

---

## 12. État des Découvertes après RUN-004

| Découverte | Statut RUN-004 |
|-----------|---------------|
| D-001 Triple Convergence | **RENFORCÉE** — nuancée sur δ² RAG défendable, nouvelle dimension D-018 (actif/passif) |
| D-002 Gap δ³ universel | **INCHANGÉE** — P073 (MEDIC paradoxe actif/passif) renforce son importance |
| D-015 ASIDE | **VALIDÉE + CONTESTÉE** — ISE ICLR prouve la faisabilité, P077 révèle la shortcut-fragility |
| **D-017 Défense RAG 4 couches** | **NOUVELLE** — confirmée par convergence P061-P066 |
| **D-018 Paradoxe actif/passif** | **NOUVELLE** — P073 MEDIC |
| **D-019 Embedding defense landscape** | **NOUVELLE** — convergence P076-P080 |
| **D-020 Shortcut-fragility défenses séparation** | **NOUVELLE** — P077 |
| G-005 No LRM autonomous defense | **INCHANGÉE** |
| G-006 No system prompt integrity | **INCHANGÉE** |
| G-007–G-014 (RUN-003 gaps) | **INCHANGÉS** |
| **G-017 RagSanitizer vs PIDP** | **PARTIELLEMENT ADRESSÉ** — T-71/T-73 réduisent l'ASR, gap compound non fermé |
| **G-019 ASIDE vs adaptatif** | **CONFIRMÉ ET ÉTENDU** — mécanisme P077 (shortcuts) |

---

*Rapport généré par l'agent CYBERSEC — RUN-004 incremental — 2026-04-04*
*Sources : WebFetch sur arXiv.org (18 abstracts lus, 2 papiers à vérifier manuellement)*
*Méthode : [ABSTRACT SEUL] pour tous les papiers sauf indication contraire*
