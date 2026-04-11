# Recherche bibliographique — Metriques de securite medicale LLM (2024-2026)

> **Agent** : research-director / medical-metrics-search
> **Date** : 2026-04-04
> **Gaps cibles** : RR-P0-001 (formules medicales 7.4%), RR-RUN4-002 (theme 6 CRITIQUE), C6
> **Resultat** : 8 papiers identifies, formules directement integrables

---

## Tableau de synthese

| ID | Titre | Auteurs | Annee | Venue | Formule cible |
|----|-------|---------|-------|-------|---------------|
| P-MED-01 | CARES: Safety & Adversarial Robustness | Chen et al. | 2025 | arXiv:2505.11413 | F58 (MVP) — Safety Score gradue 0-3 |
| P-MED-02 | MedRiskEval / PatientSafetyBench | Corbeil et al. | 2025 | arXiv:2507.07248 | F58 — echelle 1-5, tri-utilisateur |
| P-MED-03 | CSEDB: 32 medecins, 26 specialites | Wang et al. | 2025 | npj Digital Medicine | Worst@k, chute 13.3% haute criticite |
| P-MED-04 | Practical Framework Medical AI Security | Wang, Zhang, Yagemann | 2025 | arXiv:2512.08185 | Resilience Gap par specialite |
| P-MED-05 | CLEVER: Clinical Expert Review | Kocaman et al. | 2025 | JMIR AI | Validation humaine, 8B > GPT-4o |
| P-MED-06 | MEDIC: Leading Indicators Safety | Kanithi et al. | 2024 | arXiv:2409.07314 | Divergence passive/active safety |
| P-MED-07 | Towards Safe AI Clinicians | Zhang, Lou, Wang | 2025 | arXiv:2501.18632 | Pipeline adaptatif medical |
| P-MED-08 | Beyond the Leaderboard: MedCheck | Ma et al. | 2025 | arXiv:2508.04325 | 46 criteres lifecycle |

## Top 5 — Resumes et formules extractibles

### 1. CARES (Chen, 2025) — le plus aligne avec F58
Premier benchmark combinant 3 dimensions : vulnerabilite jailbreaks + faux positifs + harmfulness gradue (0-3). 18000 prompts, 8 principes securite medicale, 4 styles d'attaque. **Safety Score formula = Accept/Caution/Refuse weighted par harm-level w(h).** LLM SOTA restent vulnerables aux reformulations subtiles neutralisees en domaine general → preuve empirique du MVP.

### 2. MedRiskEval / PatientSafetyBench (Corbeil, 2025) — echelle 1-5
Echelle 5 points specifique patient (vs clinicien vs grand public). 5 categories = nos vecteurs d'attaque. Risk_score(response) ∈ {1..5}, seuil safety k=2, taux unsafe = P(score > 2). **Perspective tri-utilisateur justifie ponderation superieure domaine medical.**

### 3. CSEDB (Wang, 2025) — 32 medecins, npj Digital Medicine
Formules explicites : **Worst@k** (min sur k echantillons), score total pondere, score gradue haute criticite. **Chute 13.3% en scenario haute criticite (p<<0.0001)** → justification empirique MVP. Worst@k adaptable a Sep(M) comme borne inferieure de securite garantie.

### 4. Practical Framework (Wang, Zhang, Yagemann, 2025) — stratification specialites
**Resilience Gap = NVR_baseline - NVR_attacked** (inverse formel de Sep(M)). Stratification par specialite clinique : urgence/psychiatrie = haut risque. Vecteur de ponderation ω_spec ∈ R^n integrable dans F58.

### 5. CLEVER (Kocaman, 2025) — validation humaine JMIR AI
Seul framework valide par revue aveugle de medecins (pas LLM-as-judge). 3 dimensions : factuality, clinical relevance, conciseness. **LLM medicaux 8B surpassent GPT-4o de 45-92%** → taille ≠ securite clinique. Validation externe pour SVC et Sep(M).

## Note sur CHER
CHER n'est pas un acronyme etabli dans la litterature 2024-2026. Les frameworks les plus proches : CARES (harm gradue), MedRiskEval (echelle 1-5), CLEVER (expert review). Recommandation : adopter CARES comme reference primaire pour F58.

## Formules directement integrables dans la these

| Formule | Source | Integration |
|---------|--------|-------------|
| Safety Score (harm-weighted) | CARES P-MED-01 | Base empirique F58 (MVP) |
| Risk_score 1-5 + seuil k=2 | MedRiskEval P-MED-02 | Composante F58, validation N>=30 |
| Worst@k (borne inferieure) | CSEDB P-MED-03 | Extension Sep(M), borne de securite |
| Resilience Gap par specialite | Framework P-MED-04 | Inverse Sep(M), ponderation ω_spec |
| Chute 13.3% haute criticite | CSEDB P-MED-03 | Justification empirique MVP > 0 |

## Action pour bibliography-maintainer
8 papiers a analyser dans RUN-004. Assignation : P061-P068 (ou P-MED-01 a P-MED-08).
