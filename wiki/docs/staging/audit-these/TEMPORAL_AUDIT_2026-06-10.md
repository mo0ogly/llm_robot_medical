# TEMPORAL AUDIT — V5 (Temporal Validator)

**Date**: 2026-06-10
**Agent**: COLLECTOR (audit-these)
**Scope**: 12 papers spot-checked via WebFetch arXiv (7 most recent corpus entries P146-P152 + 5 random seed 20260610: P008, P032, P115, P116, P118) + 3 GitHub links + staleness scan doc_references.

## 1. arXiv versions observed (WebFetch 2026-06-10)

| P-ID | arXiv ID | Version courante | Date version | Pinned in MANIFEST | Drift |
|------|----------|------------------|--------------|--------------------|-------|
| P146 | 2302.12173 | v2 | 2023-05-05 | no | stable (2023) |
| P147 | 2310.12815 | v5 | 2025-11-12 | no | multi-version — verify analysis read v5 |
| P148 | 2403.04957 | v1 | 2024-03-07 | no | stable |
| P149 | 2409.11026 | v4 | 2025-08-06 | no | multi-version — verify analysis read v4 |
| P150 | 2509.01631 | v2 | 2026-01-21 | no | v2 published EACL 2026 (DOI in MANIFEST consistent) |
| P151 | 2602.21267 | v1 | 2026-02-24 | no | stable |
| P152 | 2510.16558 | v2 | 2026-04-27 | no | **v2 (2026-04-27) renamed title** — see mismatch below |
| P008 | 2411.00348 | v2 | 2025-04-23 | no | NAACL 2025 consistent |
| P032 | 2508.10010 | v1 | 2025-08-06 | no | **year anomaly** — see section 4 |
| P115 | 2501.16513 | v2 | 2025-01-30 | no | latex-fix revision only |
| P116 | 2510.16492 | v3 | 2026-02-01 | no | multi-version — verify analysis read v3 |
| P118 | 2212.10496 | v1 | 2022-12-20 | **v1** (MANIFEST line 126) | pinned version = current version, OK |

**Versions changees vs version epinglee dans MANIFEST**: 0 (seul P118 epingle une version, et elle est toujours courante).
**Papers multi-versions sans version epinglee** (risque de lecture d'une version perimee): P147 (v5), P149 (v4), P116 (v3), P146/P150/P152/P008/P115 (v2). Recommandation : epingler la version lue dans chaque fiche.

## 2. GitHub links checked (3/63 occurrences greppees)

| URL | Cite dans | Statut 2026-06-10 |
|-----|-----------|-------------------|
| github.com/liu00222/Open-Prompt-Injection | `doc_references/2024/benchmarks/P147_Liu_2024_FormalizingBenchmarkingPI.md` lignes 10, 88 | 200 OK — actif (456 stars, MIT) |
| github.com/SheltonLiu-N/Universal-Prompt-Injection | `doc_references/2024/prompt_injection/P148_Liu_2024_AutomaticUniversalInjection.md` lignes 10, 107 | 200 OK — actif (71 stars) |
| github.com/PittNAIL/med_jailbreak | `doc_references/2025/medical_ai/P028_SafeAIClinicians_2025_Jailbreaking.md` lignes 29, 92, 93 et `doc_references/2025/medical_ai/P034_CFT_2025_MedicalDefense.md` lignes 4, 32, 88, 89 | **HTTP 404 — LIEN MORT** (repo supprime, renomme ou prive) |

**Action requise**: P028 et P034 affirment "Code disponible: Oui (github.com/PittNAIL/med_jailbreak)". Le lien est mort au 2026-06-10. Verifier si le repo a ete renomme (WebSearch "PittNAIL med_jailbreak") ; sinon requalifier "Code disponible: Non (lien mort au 2026-06-10, etait disponible a l'indexation)".

## 3. Staleness scan (proxy: mtime fichiers)

- Fiches `doc_references/**/*.md` modifiees avant 2025-12-10 (> 6 mois) : **0**
- MANIFEST.md Last Updated : 2026-05-16 (< 1 mois) — OK
- Limite du proxy : mtime = derniere edition du fichier, pas necessairement une re-verification de la source. Aucune fiche ne porte de champ "derniere validation du vecteur" systematique (regle redteam-analysis.md "Versioning AEGIS" non instrumentee dans les fiches doc_references).

## 4. Anomalies temporelles detectees

1. **P032 — incoherence annee/venue** : MANIFEST ligne 48 date le papier 2024 (venue "AAAI/AIES 2024") mais arXiv:2508.10010 a ete soumis le 2025-08-06 (v1) avec le titre complet "An Audit and Analysis of LLM-Assisted Health Misinformation Jailbreaks Against LLMs" (Hussain, Zhao, Vincent). Soit l'arXiv ID associe est errone, soit l'annee/venue MANIFEST est erronee. A trancher par l'ANALYST (lecture fiche P032 + fulltext ChromaDB).
2. **P152 — titre renomme en v2** : arXiv v2 (2026-04-27) s'intitule "A First Look at the Security **Issues in** the Model Context Protocol Ecosystem" ; MANIFEST ligne 160 enregistre "A First Look at the Security **of** the Model Context Protocol Ecosystem". Mettre a jour le titre MANIFEST et verifier que la fiche P152 reflete le contenu v2.
3. **Lien mort PittNAIL/med_jailbreak** (voir section 2) — affecte P028 et P034.

## 5. Verdict V5

- Stale > 6 mois : 0
- Liens morts : 1/3 testes (github.com/PittNAIL/med_jailbreak)
- Versions arXiv changees vs version epinglee : 0 (1 seule version epinglee dans MANIFEST sur 12)
- Anomalies a escalader : P032 (annee), P152 (titre v2), P028/P034 (code indisponible)
