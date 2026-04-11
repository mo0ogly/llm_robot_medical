# ANALYST REPORT — RUN-004 Incremental
## Agent: ANALYST | Date: 2026-04-04 | Papiers: P061–P080

---

## Résumé exécutif

RUN-004 apporte 18 analyses complètes (sur 20 papiers — P070 et P072 nécessitent une vérification manuelle) réparties en 3 lots thématiques : défenses RAG (P061-P067), métriques de sécurité médicale (P068-P075), et défenses architecturales type ASIDE (P076-P080). L'ensemble de ces papiers adresse directement les gaps G-017 (défenses RAG) et G-001 (benchmarks médicaux standardisés), et fournit de nouvelles découvertes sur la géométrie des embeddings (D-017 à D-020) qui enrichissent le framework δ⁰ de la thèse.

---

## Tableau récapitulatif

| ID | Titre (abrégé) | Venue | Année | SVC | δ-tags | Conjectures | Gaps clés |
|----|---------------|-------|-------|-----|--------|-------------|-----------|
| P061 | GMTP: Gradient-based Masked Token Probability | ACL Findings 2025 | 2025 | 8/10 | δ¹(P), δ⁰(S) | C3✓, C7✓✓ | G-017 (partiel) |
| P062 | RAGuard: Secure RAG against Poisoning | IEEE BigData 2025 | 2025 | 7/10 | δ¹(P), δ⁰(S) | C3✓, C7✓, C4~ | G-017, G-003 |
| P063 | RevPRAG: Revealing Poisoning via LLM Activations | EMNLP Findings 2025 | 2025 | 8/10 | δ¹(P), δ⁰(S), δ²(T) | C3✓✓, C2✓, C7✓ | G-017, G-011 |
| P064 | RAGPart & RAGMask: Retrieval-Stage Defenses | AAAI 2026 Workshop (Oral) | 2025 | 7/10 | δ¹(P excl) | C3~, C7✓✓, C6✓ | G-017, G-021 |
| P065 | RAGDefender: Rescuing the Unpoisoned | ACSAC 2025 | 2025 | **9/10** | δ¹(P), δ⁰(non) | C3✓, C6✓✓, C4✓ | G-017, G-014, G-020 |
| P066 | RAGShield: Provenance-Verified Defense-in-Depth | preprint 2026-04-01 | 2026 | 6/10 | δ¹(P), δ²(P) | C3✓✓, C5✓, C1~ | G-016(NEW), G-018(NEW) |
| P067 | RAG Security: Formalizing the Threat Model | 5th ICDM Workshop 2025 | 2025 | 8/10 | δ¹(P), δ⁰(S), δ²(P) | C5✓✓, C7✓F, C1✓ | G-021, G-019(NEW) |
| P068 | CARES: Medical LLM Safety Benchmark | preprint 2025 | 2025 | **9/10** | δ⁰(P), δ¹(S) | C2✓Q, C4✓✓, C6✓ | G-001, G-002, G-008 |
| P069 | MedRiskEval: Patient Perspectives | EACL 2026 industry | 2025 | 7/10 | δ⁰(P) | C4✓, C2~, C6✓✓ | G-005(NEW), G-004 |
| P070 | CSEDB: Evaluation Benchmark | npj Digital Medicine | 2025 | INDET | δ⁰(probable) | — | — (vérif. manuelle) |
| P071 | Practical Framework: Medical AI Security | preprint 2025 | 2025 | 8/10 | δ⁰(P), δ¹(S), δ²(P) | C4✓, C1✓, C6✓✓ | G-006(NEW), G-007(NEW) |
| P072 | CLEVER: Clinical LLM Eval by Expert Review | JMIR AI 2025 | 2025 | INDET | δ⁰(probable) | — | — (vérif. manuelle) |
| P073 | MEDIC: Leading Indicators for Clinical Safety | arXiv technical report | 2024 | 8/10 | δ⁰(P), δ¹(S) | C2✓✓, C4✓, C5✓ | G-001, G-008(NEW) |
| P074 | Towards Safe AI Clinicians: Jailbreaking Study | preprint 2025 | 2025 | 7/10 | δ⁰(P) | C4✓✓, C2✓, C3✓ | G-002, G-004 |
| P075 | Beyond the Leaderboard: Rethinking Medical Benchmarks | preprint 2025 | 2025 | 8/10 | δ⁰(P), δ¹(S) | C6✓P, C4~, C3✓ | G-021, G-022(NEW) |
| P076 | ISE: Instructional Segment Embedding | **ICLR 2025** | 2025 | **9/10** | δ⁰(P), δ¹(S) | C3✓, C5✓✓, C7~ | G-017, G-023(NEW) |
| P077 | Illusion of Role Separation: Hidden Shortcuts | preprint (ICML non confirmé) | 2025 | 8/10 | δ⁰(P), δ¹(S) | C5~, C3✓, C7✓ | G-024(NEW), G-025(NEW) |
| P078 | Zero-Shot Embedding Drift Detection | NeurIPS 2025 Workshop | 2026 | 8/10 | δ⁰(P), δ¹(S), δ²(P) | C3✓, C6✓✓, C5✓ | G-017, G-026(NEW) |
| P079 | ES2: Enhancing Safety via Embedding Separation | preprint 2026 | 2026 | 8/10 | δ⁰(P) | C5✓✓, C3✓, C2✓ | G-026, G-027(NEW) |
| P080 | DefensiveTokens: Defending Against Prompt Injection | preprint (ACM/ICML non confirmé) | 2025 | 8/10 | δ⁰(P), δ¹(S), δ²(P) | C3✓, C6✓✓, C5~ | G-017, G-028(NEW) |

**Légende** : (P)=Primary, (S)=Secondary, (T)=Tertiary | ✓✓=Fortement supporté | ✓=Supporté | ~=Nuancé | F=Formalisé | Q=Quantifié | INDET=Indéterminé

---

## Nouveaux gaps identifiés (RUN-004)

| ID Gap | Description | Source |
|--------|-------------|--------|
| G-016 | Conformité réglementaire des défenses RAG (NIST, HDS) | P066 |
| G-018 | Menaces insider dans RAG médical non résolues par cryptographie | P066 |
| G-019 | Privacy des corpus RAG médicaux (membership inference) | P067 |
| G-022 | Contamination des données de benchmark médical | P075 |
| G-005 | Évaluation perspective patient distincte de perspective clinicien | P069 |
| G-006 | Évaluation reproductible sans accès institutionnel (CPU, sans IRB) | P071 |
| G-007 | Couverture multi-spécialités dans l'évaluation de sécurité | P071 |
| G-023 | Comparaison défenses superficielles vs architecturales | P076 |
| G-024 | Limites du fine-tuning adversarial (raccourcis plutôt que robustesse) | P077 |
| G-025 | Position ID comme signal de sécurité (manipulation pour renforcer la séparation de rôles) | P077 |
| G-026 | Connexion théorique embedding drift / Sep(M) Zverev | P078, P079 |
| G-027 | Formalisation des attaques comme déplacement dans le sous-espace safe | P079 |
| G-028 | Comparaison défenses test-time vs training-time | P080 |
| G-029 | Modularité des défenses selon contexte de risque clinique | P080 |

---

## Nouvelles découvertes (D-xxx) identifiées en RUN-004

| ID | Découverte | Papier source | Statut |
|----|-----------|---------------|--------|
| D-012 | Signal gradient retriever utilisable comme proxy de sécurité | P061 | NOUVELLE |
| D-009 | Membership inference comme menace RAG spécifique | P067 | NOUVELLE |
| D-006 | Sécurité active (détection d'erreurs) vs sécurité passive (refus) comme dimensions orthogonales | P073 | NOUVELLE |
| D-011 | Continual Fine-Tuning (CFT) comme approche de mitigation médicale | P074 | NOUVELLE |
| D-003b | Robustesse adversariale absente de la majorité des benchmarks médicaux | P075 | NOUVELLE |
| D-015 | Défenses architecturales plus robustes que fine-tuning (confirmé avec comparaison quantifiée) | P076, P077 | CONFIRMEE+QUANTIFIEE |
| D-008b | Fine-tuning pour séparation de rôles crée des raccourcis fragiles | P077 | NOUVELLE (nuance critique) |
| D-017 | Détection zero-shot d'injection par dérive cosinus >93% accuracy | P078 | NOUVELLE |
| D-018 | Séparabilité linéaire des requêtes harmful/safe confirmée | P079 | NOUVELLE |
| D-019 | KL divergence comme régularisateur du tradeoff safety-utility | P079 | NOUVELLE |
| D-016 | Limites cryptographiques face aux menaces insider (17.5% ASR résiduel) | P066 | NOUVELLE |
| D-020 | Embeddings optimisés (DefensiveTokens) comme mécanisme modulaire | P080 | NOUVELLE |

---

## Analyse thématique par lot

### LOT 1 — RAG Defense (P061-P067) : Gap G-017 adressé

Le LOT 1 constitue la contribution la plus cohérente de RUN-004. Six méthodes de défense complémentaires émergent :
- **Niveau retriever** : GMTP (gradient, P061), RAGPart+RAGMask (masquage, P064), RAGuard (perplexité+similarité, P062)
- **Niveau post-retrieval** : RAGDefender (ML léger, P065)
- **Niveau génération** : RevPRAG (activations, P063)
- **Niveau ingestion** : RAGShield (provenance cryptographique, P066)

P067 fournit le cadre théorique unifiant ces défenses. La couverture multi-niveaux valide la conjecture C3 (défense en profondeur multi-couches). La meilleure venue est ACSAC 2025 (P065, SVC 9/10).

Gap restant : aucun des 7 papiers n'évalue ses défenses sur des corpus médicaux réels (HL7, FHIR, dossiers cliniques). G-017 reste donc partiellement ouvert pour la thèse.

### LOT 2 — Medical Metrics (P068-P075) : Benchmarks et métriques

Cinq benchmarks complémentaires couvrent différentes dimensions :
- **Grande échelle** : CARES (18 000+ prompts, 8 principes, P068, SVC 9/10)
- **Perspective patient** : MedRiskEval/PatientSafetyBench (466 samples, P069)
- **Sécurité active vs passive** : MEDIC (4 dimensions, CEF, P073)
- **Évaluation reproductible** : framework CPU sans IRB (P071)
- **Méta-analyse** : MedCheck critique de 53 benchmarks (P075)

Découverte transversale majeure : la dimension "robustesse adversariale" est absente de la grande majorité des benchmarks médicaux existants (P075). AEGIS adresse précisément ce gap.

### LOT 3 — ASIDE Architectural (P076-P080) : Défenses de couche δ⁰

Quatre approches architecturales complémentaires :
- **Segment embeddings** : ISE (ICLR 2025, +18.68%, P076, SVC 9/10)
- **Position IDs** : correction des raccourcis de séparation de rôles (P077)
- **Drift detection** : dérive cosinus zero-shot >93% accuracy (P078)
- **Embedding séparation** : ES2 avec régularisation KL (P079)
- **Tokens optimisés** : DefensiveTokens test-time modulaires (P080)

Connexion clé pour la thèse : ES2 (P079) et embedding drift (P078) sont complémentaires du score Sep(M) de Zverev et al. (2025) — référence centrale d'AEGIS. Cette triangulation embedding-based mérite une section dédiée dans le framework formel.

---

## Papiers à vérification manuelle (P070, P072)

| ID | Venue | Action requise |
|----|-------|----------------|
| P070 | npj Digital Medicine | Accès manuel URL Nature (paywall potentiel). Priorité : haute (journal médical référence). |
| P072 | JMIR AI | Accès manuel URL JMIR. Priorité : moyenne (JMIR AI = venue solide). |

---

## Recommandations pour le DIRECTOR (RUN-004 → RUN-005)

1. **Vérifier P070 et P072** : accès manuel aux URL paywall pour compléter les fiches
2. **Évaluer RAGDefender (P065) en contexte médical** : ACSAC 2025, métriques ASR précises, méthode légère — candidat prioritaire pour expérimentation AEGIS sur corpus HL7
3. **Approfondir la connexion Sep(M) / embedding drift** : P078 (dérive cosinus) + P079 (ES2) + Zverev (2025) forment un cluster théorique cohérent méritant une section dans formal_framework_complete.md
4. **Intégrer la distinction sécurité active/passive de MEDIC (P073)** dans la taxonomie d'évaluation AEGIS
5. **Signaler la limitation ISE en médical** : P076 (ICLR, SVC 9/10) est la défense architecturale la plus solide mais non testée sur vocabulaire clinique — gap G-023 à documenter

---

*Rapport généré par ANALYST RUN-004 | 20 papiers traités (18 analyses complètes + 2 à vérification manuelle) | Notation Unicode δ⁰ δ¹ δ² δ³ conforme CLAUDE.md*
