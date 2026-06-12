# V3 — Contradiction Detector Report — 2026-06-10

> **Auditor**: ANALYST (audit-these v2.1)
> **Method**: manual (no `detect_contradictions.py` in `.claude/skills/audit-these/scripts/` — only `check_model_versions.py`, `lint_sources.py`, `verify_citations.py`). Cross-file Grep on key figures per mission spec.
> **Flag rule**: >10% gap between two files citing the same figure = contradiction.

## CONTRA-1 — TC-001 8B figures: manuscript Tableau 6.1 vs authoritative raw data (CRITICAL)

| Figure | File A | File B | Gap |
|--------|--------|--------|-----|
| Full convergence ASR (8B) | `manuscript/chapitre_6_experiences.md` Tableau 6.1: **13%** (source: EXPERIMENT_REPORT_CROSS_MODEL TC-003) | `RESEARCH_STATE.md` L58/L138/L372: **16.67%** (`triple_convergence_results.json`, declared "donnee brute autoritative", model `llama-3.1-8b-instant`) | 28% relative |
| Best subset (8B) | chapitre 6: **δ¹ = 50%** (best individual) | RESEARCH_STATE: **δ² seul = 56.67%** (best subset) | different vector AND value (13%) |
| Kruskal-Wallis (8B) | chapitre 6 §6.2: **H=12.63, p=0.049, f=0.35** | RESEARCH_STATE: **H=18.80, p=0.0047, f=0.475** | p differs by 10x |

**Diagnostic**: two distinct 8B datasets coexist — TC-003 (`experiments/EXPERIMENT_REPORT_CROSS_MODEL.md` L14-33) and `triple_convergence_results.json` (whose `model` field says 8B while the TC-001 v1/v2 reports describe a 3B run — incoherence already documented in `experiments/PROTOCOLE_TC001_v3.md` L23). Moreover `PROTOCOLE_TC001_v3.md` L23 states verbatim: "**Aucun chiffre TC-001 ne doit etre cite dans le manuscrit avant la cloture de TC-001 v3**" — yet `chapitre_6_experiences.md` §6.2 cites TC-001 and TC-001 v2 figures (Tableau 6.1, 3B column sourced to EXPERIMENT_REPORT_TC001_v2). **Violation of the documented freeze.**
**Correction suggested**: either close TC-001 v3 and reconcile, or strip/annotate the TC-001 columns of Tableau 6.1 with the erratum banner; clarify in chapitre 6 whether the 8B column is TC-003 (allowed) or TC-001 raw JSON (frozen).

## CONTRA-2 — TC-001 full-convergence ASR across experiment reports (documented erratum, banners missing)

- `experiments/EXPERIMENT_REPORT_TC001.md` L35: full convergence ASR = **0.0%** (v1, 3B)
- `experiments/EXPERIMENT_REPORT_TC001_v2.md` L74: full = **7%**, best (δ² seul) = **43%** (v2, 3B)
- `RESEARCH_STATE.md` L58: full = **16.67%**, best = **56.67%** (8B JSON, "autoritative")

**Diagnostic**: different iterations/models, so not strictly the same measurement — but the erratum (RESEARCH_STATE L58/L138, reconciled 2026-05-30) is NOT propagated into the v1/v2 report files themselves: neither contains an ERRATUM banner nor any mention of the 16.67/56.67 reconciliation. A reader opening only the experiment reports gets frozen-invalid figures with no warning.
**Correction suggested**: add a dated erratum header to both `EXPERIMENT_REPORT_TC001.md` and `EXPERIMENT_REPORT_TC001_v2.md` pointing to `PROTOCOLE_TC001_v3.md` and RESEARCH_STATE L58.

## CONTRA-3 — C1 status: "GELE / EN RE-VERIFICATION" vs unqualified "VALIDEE (sature)"

- `RESEARCH_STATE.md` L138: C1 = **10/10 (score GELE — decision directeur apres v3), EN RE-VERIFICATION**, with raw data `c1_supported=false`.
- `discoveries/CONJECTURES_TRACKER.md` L13 (Vue d'Ensemble): C1 = **10/10 ... VALIDEE (sature)** — no GELE/re-verification qualification; C1 detail table (L31-33) stops at RUN-003 with no TC-001 erratum row.
- `_staging/briefings/DIRECTOR_BRIEFING_RUN010.md` L20: C1 = **10/10 VALIDEE sature ... "Pas de changement"** — no qualification.

**Diagnostic**: per mission rule, any C1 value not qualified "GELE en re-verification" is a contradiction. CONJECTURES_TRACKER and the RUN010 briefing both present C1 as settled while the authoritative raw data says `c1_supported=false` pending TC-001 v3. The tracker contains zero occurrence of "TC-001" — the freeze never propagated.
**Correction suggested**: update CONJECTURES_TRACKER Vue d'Ensemble + C1 detail with the GELE status and a TC-001 erratum row; annotate RUN010 briefing.

## CONTRA-4 — C3 score: 9/10 vs 10/10

- `RESEARCH_STATE.md` L140: C3 = **9/10 SUPPORTEE** (corrige 2026-06-03, doublon P019≡P052).
- `discoveries/CONJECTURES_TRACKER.md` L15: C3 = **9/10 ↓ SUPPORTEE (corrige doublon P019≡P052, 2026-06-03)**.
- `_staging/briefings/DIRECTOR_BRIEFING_RUN010.md` L22: C3 = **10/10 VALIDEE sature ... "Pas de changement"**.

**Who is right**: RESEARCH_STATE and CONJECTURES_TRACKER (9/10). The briefing is dated **2026-05-31** (header L3), i.e. BEFORE the 2026-06-03 doublon correction — it was accurate when written but is now a stale snapshot that contradicts the current authoritative value.
**Correction suggested**: add a post-hoc erratum note to DIRECTOR_BRIEFING_RUN010.md Section 1 ("C3 revise 10→9 le 2026-06-03, doublon P019≡P052") so future agents do not re-import 10/10.

## CONTRA-5 — C7 score: 8/10 vs 9.5/10 (>10% gap)

- `RESEARCH_STATE.md` L144 (Section 4): C7 = **8/10 Supportee** (note still references RUN-003-era state: "manque papers LRM (RR-RUN4-003)").
- `discoveries/CONJECTURES_TRACKER.md` L17 + L155: C7 = **9.5/10 CANDIDATE A VALIDATION** (RUN-005, 8 convergent papers P087-P094, mechanistic proof P094).
- `_staging/briefings/DIRECTOR_BRIEFING_RUN010.md` L26: C7 = **9.5/10 CANDIDATE**.

**Diagnostic**: gap 8 vs 9.5 = 18.75% > 10%. Tracker and RUN010 agree; RESEARCH_STATE Section 4 (header: "depuis DIRECTOR_BRIEFING_RUN003") was updated for C1/C2/C3/C5/C6/C8 but the C7 row was left at its RUN-003 value. RESEARCH_STATE is the stale one here.
**Correction suggested**: update RESEARCH_STATE L144 to 9.5/10 CANDIDATE with the RUN-005 evidence note.

## CONTRA-6 — C5 score: 8.5/10 vs 9/10 (minor, <10% but internally inconsistent)

- `RESEARCH_STATE.md` L142: C5 = **8.5/10** ; `discoveries/CONJECTURES_TRACKER.md` L16: **8.5/10**.
- `_staging/briefings/DIRECTOR_BRIEFING_RUN010.md` L24: C5 = **9/10** while claiming "Neutre (pas de nouveau RAG poisoning)".

**Diagnostic**: 5.9% gap — below the 10% threshold, but the briefing claims "no change" while reporting a value that differs from both authoritative files: transcription error, not a scored change.
**Correction suggested**: correct RUN010 briefing L24 to 8.5/10.

## VERIFIED-OK — P029 Lee JAMA 94.4%

Consistent everywhere checked: `doc_references/2025/medical_ai/P029_JAMA_2025_MedicalInjection.md` L31 (94.4% = 102/108), `RESEARCH_STATE.md` L143, `CONJECTURES_TRACKER.md` L125/L452, `GLOSSAIRE_MATHEMATIQUE.md` L472, `INDEX_BY_DELTA.md` L27/L106, manuscript references. The historical P035/P029 mis-attribution (AEGIS-AUDIT-DISCOVERIES_2026-05-21.md L96) is no longer present in `DISCOVERIES_INDEX.md` (0 hits for "94.4"). No contradiction.

## CONTRA-7 — P044 flip rate: precision and attribution drift (below 10% numeric threshold, flagged for fidelity)

Authoritative (verified fulltext per `research_notes/AEGIS-AUDIT-RESEARCH-STATE-claims_2026-05-21.md` L34): **per-benchmark ensemble FPR 99.91% (MATH), 98.64% (AIME), 94.75% (RLVR)** — `doc_references/2026/prompt_injection/P044_Unit42_2026_AdvJudgeZero.md` L195.

- Numeric: many files round to "**99% flip rate**" (`EXPERIMENT_REPORT_F46.md` L6, `GLOSSAIRE_F_SERIES.md` L37, `FICHE_41_GUARDRAILS_BYPASS.md` L286, `chapitre_6_experiences.md` §6.1, `manuscript/peer_preservation_thesis_formulation.md` L94 — while L23 of the same file says 99.91%). Gap 99 vs 99.91 = 0.9% < 10% → not a contradiction per threshold, but the unqualified "99% flip rate des juges LLM" generalizes a MATH-benchmark-specific ensemble FPR. Recommend standardizing on "99.91% (MATH, ensemble FPR, Section 4.2)".
- **Attribution error (real)**: `_staging/whitehacker/DELTA3_RED_TEAM_PLAYBOOK_20260411.md` L18 and L30 attribute AdvJudge-Zero to "**Shi et al. (2024)**" — the corpus fiche P044 says **Li, Wu, Liu (Unit 42, 2025, arXiv:2512.17375)** (`FORMALISATION_ASR_DETERMINISTIC.md` L219). Wrong authors and wrong year. Correction: replace with "Li, Wu, Liu (Unit 42, 2025), arXiv:2512.17375 (P044)".

## Summary

| ID | Severity | Status |
|----|----------|--------|
| CONTRA-1 | CRITICAL (manuscript cites frozen TC-001 figures + 2 conflicting 8B datasets) | OPEN |
| CONTRA-2 | HIGH (erratum not propagated to experiment reports) | OPEN |
| CONTRA-3 | HIGH (C1 freeze absent from tracker + briefing) | OPEN |
| CONTRA-4 | MEDIUM (C3 10/10 in stale briefing; 9/10 is correct) | OPEN |
| CONTRA-5 | MEDIUM (C7: RESEARCH_STATE stale at 8/10; 9.5/10 is correct) | OPEN |
| CONTRA-6 | LOW (C5 9/10 transcription error in RUN010 briefing) | OPEN |
| CONTRA-7 | LOW-MEDIUM (P044 rounding drift + 1 real attribution error "Shi et al. 2024") | OPEN |
