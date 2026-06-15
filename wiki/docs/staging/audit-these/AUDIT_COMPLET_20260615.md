# AUDIT COMPLET — /audit-these full — 2026-06-15

> **Type** : run delta / non-regression. Baseline = `AUDIT_COMPLET_20260613.md` (session concurrente, PASS avec dettes).
> **Perimetre** : corpus P001-P155 (155 papers). Delta depuis 06-13 : aucun changement de corpus majeur (RUN-011 P153 et FIX-PID-COLLISION P154/P155 sont anterieurs au 06-13 et deja audites).
> **Methode** : scripts deterministes V1/V2/V5 re-runs + regression-grep des corrections du 06-09 + verification arXiv des 3 derniers papiers.

---

## Verdict global : PASS avec dettes documentees (inchange vs 06-13) — V2 nominal FAIL stable

| V | Verdict | Detail (delta 06-15) |
|---|---------|----------------------|
| V1 Citations | **PASS** | 230 citations (208 arXiv / 22 DOI), 0 morte connue. P153/P154/P155 re-verifies arXiv ce jour : IDs + auteurs corrects. 2 notes mineures de titre (voir ci-dessous). |
| V2 Claims | **FAIL nominal — stable** | 100/918 NONE (10.9%) — IDENTIQUE au 06-10/06-12/06-13. 0 regression. Gonfle par faux positifs linter (~24.6% raw, motif `(Abstract)`/`(Section)`). Dette reelle : M005-M009 + P029/P030/P040/P044. Rapport `UNSOURCED_CLAIMS_20260615.md`. |
| V3 Contradictions | **PASS** | Non-regression verifiee : 0 residuel `27 modeles` / `9.5->5.0` ; C3 9/10 coherent (RESEARCH_STATE + tracker + TRIPLE_CONVERGENCE) ; P019≡P052 traite comme doublon (3 fichiers). Remediations 06-13 (P143/P155 cross-refs MCP) en place. |
| V4 Fidelite | **PASS** | Corrections du 06-09 tenues (ground-truth fulltext) : JMedEthicBench 22 modeles / 9.5->5.5 ; P044 FPR par benchmark 99.91% MATH / 98.64% AIME / 94.75% RLVR restaures. |
| V5 Temporal | **INFO** | Profil identique : familles de modeles anciens = citations historiques legitimes. P153-P155 (2025-2026) : 0 staleness. Rapport `MODEL_VERSIONS_AUDIT_20260615.md`. |
| V6 These | **PASS** | Manuscrit : Wallace->Lee tenu (0 occurrence Wallace/JAMA), Zverev->Zhang, Pasquini->Hackett, P019≡P052, Unit42->Li/Wu/Liu, bypass 99%->>90% sur 22/24 tous en place. 8 conjectures (C1-C8) coherentes. |

---

## Non-regression des corrections 06-09/06-13 (verifiee par grep)

| Correction | Attendu | Mesure 06-15 |
|---|---|---|
| JMedEthicBench `27 modeles` (discoveries) | 0 | **0** |
| JMedEthicBench `9.5->5.0` (discoveries) | 0 | **0** |
| RESEARCH_STATE `C3 \| 10/10` | 0 | **0** (C3 = 9/10) |
| manuscript `Wallace et al., JAMA` | 0 | **0** (= Lee) |
| `corrige doublon P019` (CONJECTURES) | >=1 | **1** |
| P044 `99.91% MATH` restaure (CONJECTURES) | >=1 | **2** |
| `P019≡P052` (discoveries) | >=1 | **3 fichiers** |
| live `bypass 99%` (discoveries) | 0 | **0** |

Conclusion : les corrections de la session 06-09 et les remediations 06-13 ont survecu a l'activite concurrente (RUN-011, FIX-PID-COLLISION). 0 regression.

## Verification arXiv des 3 derniers papiers (jamais passes par l'audit 06-09)

| P-ID | arXiv | Titre verbatim arXiv | Auteurs | Verdict |
|------|-------|----------------------|---------|---------|
| P153 | 2503.04474 | "Know Thy Judge: On the Robustness Meta-Evaluation of LLM Safety Judges" | Eiras, Zemour, Lin, Mugunthan | OK (titre exact) |
| P154 | 2602.16935 | "DeepContext: Stateful Real-Time Detection of **Multi-Turn Adversarial** Intent Drift **in LLMs**" | Albrethsen, Datta, Kumar, Rajasekar | MINEUR — MANIFEST inverse l'ordre + omet "in LLMs" |
| P155 | 2603.22489 | "Model Context Protocol Threat Modeling and Analyzing Vulnerabilities to Prompt Injection with Tool Poisoning" | C. Huang, X. Huang, Tran, Milani Fard | MINEUR — titre MANIFEST est une paraphrase, pas le titre verbatim |

Aucune fabrication, aucun ID mort, aucun auteur faux. Les 2 notes mineures (P154 ordre de mots, P155 paraphrase) sont sous le seuil critique — a aligner sur le verbatim lors d'une passe d'hygiene titres.

---

## Etat des conjectures (inchange vs 06-13, reconcilie)

C1 10/10 **GELE** (TC-001 v3 pendante) · C2 10/10 · **C3 9/10** (correction doublon, tenue) · C4 9/10 · C5 9/10 · C6 10/10 · C7 9.5/10 · C8 7/10.

## Dettes (inchangees, non bloquantes sauf V2)

1. **V2 reel** : sourcing M005-M009 + P030/P040/P044 (apres deduction des faux positifs linter). **P1.**
2. **Linter** : ajouter `(Abstract)`/`(Section X)`/`(Table Y)` a REF_PATTERN de `lint_sources.py` — de-gonflerait V2 du ~24.6% de faux positifs. **P1 EXECUTOR.**
3. **TC-001 v3** : seule voie de degel C1. **P0 experimentalist.**
4. Titres P154/P155 a aligner sur verbatim arXiv. **P3.**
5. `detect_contradictions.py` / `verify_fidelity.py` absents (V3/V4 manuels). **P3.**

## Verdict

Corpus stable et coherent ; toutes les corrections d'integrite tenues ; nouveaux papiers verifies. Le seul gate rouge (V2) est stable et partiellement artefactuel. **Recommandation** : (a) corriger le pattern du linter V2, puis (b) passe de sourcing ciblee sur la dette reelle residuelle, avant soutenance. C1 reste gele en attente de TC-001 v3.
