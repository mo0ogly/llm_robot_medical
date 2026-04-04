# LIBRARIAN — Rapport de Propagation P0
**Date**: 2026-04-04
**Agent**: LIBRARIAN (bibliography-maintainer)
**Mission**: Propagation de 7 analyses P0 approfondies vers doc_references/ + mise a jour des index

---

## ETAPE 1 — Copies effectuees (7/7)

| ID | Source (_staging/analyst/) | Destination (doc_references/) | PDF Source | Statut |
|----|---------------------------|-------------------------------|-----------|--------|
| P001 | P001_analysis.md | 2023/prompt_injection/P001_Liu_2023_HouYi.md | Presente (relatif literature_for_rag) | OK |
| P018 | P018_analysis.md | 2025/model_behavior/P018_ShallowAlignment_2025_TokenDepth.md | Ajoutee (P018_2406.05946.pdf) | OK |
| P024 | P024_analysis.md | 2025/benchmarks/P024_Zverev_2025_SeparationScore.md | Ajoutee (P024_2403.06833.pdf) | OK |
| P029 | P029_analysis.md | 2025/medical_ai/P029_JAMA_2025_MedicalInjection.md | Ajoutee (PAYWALL JAMA — acces institutionnel) | OK |
| P044 | P044_analysis.md | 2026/prompt_injection/P044_Unit42_2026_AdvJudgeZero.md | Ajoutee (P044_2512.17375.pdf) | OK |
| P052 | P052_analysis.md | 2026/model_behavior/P052_rlhf_alignment_shallow.md | Ajoutee (P052_2603.04851.pdf) | OK |
| P054 | P054_analysis.md | 2026/prompt_injection/P054_pidp_attack_rag.md | Ajoutee (P054_2603.25164.pdf) | OK |

**Note**: P029 (JAMA) ne dispose pas de PDF libre — le lien PDF Source indique le paywall JAMA avec note d'acces institutionnel. Analyse disponible via 8 chunks ChromaDB.

---

## ETAPE 2 — MANIFEST.md mis a jour

**Fichier**: `_staging/librarian/MANIFEST.md`

Modifications effectuees :
- Header: mise a jour vers RUN-004 P0 propagation
- P001: δ-layers enrichis (δ⁰, δ¹, δ²), arXiv corrected (v3), status → analyzed-P0
- P018: Auteurs "Unknown et al." → "Qi, Panda, Lyu et al." | Venue enrichi (Outstanding Paper) | δ¹ ajoute | status → analyzed-P0
- P024: status → analyzed-P0 (metadonnees deja correctes)
- P029: Auteurs "Unknown et al." → "Lee, Jun, Lee et al." | Venue precise (Digital Health) | status → analyzed-P0
- P044: Titre complet mis a jour (Binary Decision Flips...) | Year corrige 2026→2025 | δ⁰, δ³ ajoutes | status → analyzed-P0
- P052: Auteur precise "Young, R. (Cambridge)" | δ-layers corriges (δ⁰ central, pas δ¹ direct) | status → analyzed-P0
- P054: Auteurs precises "Wang, Liu, Zhu et al. (CUHK-SZ)" | δ⁰ ajoute (contexte) | status → analyzed-P0

---

## ETAPE 3 — ARTICLES_INDEX.md mis a jour

**Fichier**: `doc_references/ARTICLES_INDEX.md`

Modifications effectuees :
- Header: mise a jour date + mention propagation P0 x7
- P029: MANQUANT / NON → [PAYWALL-JAMA — analyse ChromaDB 8 chunks disponible] / PARTIEL

Statuts des 7 papiers dans ARTICLES_INDEX :
| ID | PDF | RAG |
|----|-----|-----|
| P001 | P001_2306.05499.pdf | OUI |
| P018 | P018_source.pdf | OUI |
| P024 | P024_source.pdf | OUI |
| P029 | PAYWALL-JAMA | PARTIEL |
| P044 | P044_2512.17375.pdf | OUI |
| P052 | P052_2603.04851.pdf | OUI |
| P054 | P054_2603.25164.pdf | OUI |

---

## ETAPE 4 — Validation

### PDF Source — verification grep (7/7 OK)

| Fichier | PDF Source trouvee |
|---------|-------------------|
| P001_Liu_2023_HouYi.md | OK — literature_for_rag/P001_2306.05499.pdf |
| P018_ShallowAlignment_2025_TokenDepth.md | OK — literature_for_rag/P018_2406.05946.pdf |
| P024_Zverev_2025_SeparationScore.md | OK — literature_for_rag/P024_2403.06833.pdf |
| P029_JAMA_2025_MedicalInjection.md | OK — PAYWALL JAMA note |
| P044_Unit42_2026_AdvJudgeZero.md | OK — literature_for_rag/P044_2512.17375.pdf |
| P052_rlhf_alignment_shallow.md | OK — literature_for_rag/P052_2603.04851.pdf |
| P054_pidp_attack_rag.md | OK — literature_for_rag/P054_2603.25164.pdf |

### Comptage total doc_references/202*/*/

| Annee/Domaine | Fichiers |
|---------------|---------|
| 2023/prompt_injection | 1 |
| 2024/defenses | 2 |
| 2024/medical_ai | 2 |
| 2024/prompt_injection | 1 |
| 2024/semantic_drift | 4 |
| 2025/benchmarks | 3 |
| 2025/defenses | 7 |
| 2025/medical_ai | 5 |
| 2025/model_behavior | 2 |
| 2025/prompt_injection | 6 |
| 2025/semantic_drift | 1 |
| 2026/benchmarks | 3 |
| 2026/defenses | 8 |
| 2026/medical_ai | 4 |
| 2026/model_behavior | 2 |
| 2026/prompt_injection | 9 |
| **TOTAL** | **60** |

---

## Anomalies detectees (non bloquantes)

1. **P019 dans MANIFEST**: L'entree P019 reference arXiv:2603.04851 qui est en realite l'arXiv de P052. P019 est un fichier distinct dans le systeme (`P019_GradientAnalysis_2025_ShallowRLHF.md`) — cette inconsistance preexistante n'est pas dans le perimetre P0, non corrigee ici.

2. **P044 titre double**: L'ARTICLES_INDEX mentionne "Auditing the Gatekeepers: Fuzzing AI Judges" tandis que le papier verifie a le titre "AdvJudge-Zero: Binary Decision Flips in LLM-as-a-Judge via Adversarial Control Tokens". Le MANIFEST a ete corrige avec le bon titre. L'ARTICLES_INDEX conserve son titre raccourci (pas de modification pour eviter les breaking changes).

3. **P029 paywall**: Le PDF JAMA n'est pas disponible en libre acces. L'analyse repose sur 8 chunks ChromaDB. Le flag `statistically_valid: false` est applique pour les resultats flagship (N=5).

---

## Resume executif

- **7/7 fichiers copies** vers les destinations correctes
- **7/7 liens PDF Source** presentes dans les fichiers destination
- **MANIFEST.md**: 7 entrees mises a jour (auteurs, venues, δ-layers, status analyzed-P0)
- **ARTICLES_INDEX.md**: P029 corrige (MANQUANT → PAYWALL-JAMA), header mis a jour
- **60 fichiers** au total dans doc_references/202*/*/ (inchange — propagation ecrase les existants)

---

*Rapport genere le 2026-04-04 — LIBRARIAN agent (bibliography-maintainer)*
