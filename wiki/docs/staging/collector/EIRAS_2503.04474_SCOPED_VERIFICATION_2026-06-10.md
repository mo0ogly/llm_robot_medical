# Scoped Verification — Eiras et al., arXiv:2503.04474 (RR-RUN10-002)

**Agent**: COLLECTOR (scoped mode) | **Date**: 2026-06-10 | **Request**: RR-RUN10-002
**Dedup check**: `check_corpus_dedup.py` executed 2026-06-10 → `[NEW]`, not in corpus (per mission brief).
Note: a stale staging proposal "P082 (Eiras)" exists in `_staging/scientist/SAFETY_JUDGES_SEARCH_RR-DA-002.md` (line 22), but P082 in MANIFEST.md (line 95) was attributed to Wang et al., AgentSpec (arXiv:2503.18666). The Eiras paper therefore has NO P-ID yet — coherent with the `[NEW]` dedup result.

---

## 1. Verified Reference — [ARTICLE VERIFIE]

| Field | Value | Source |
|-------|-------|--------|
| Title | Know Thy Judge: On the Robustness Meta-Evaluation of LLM Safety Judges | arXiv abs page, WebFetch 2026-06-10 |
| Authors | Francisco Eiras, Eliott Zemour, Eric Lin, Vaikkunth Mugunthan | arXiv abs page, WebFetch 2026-06-10 |
| arXiv ID | arXiv:2503.04474, v1 submitted 2025-03-06 (14:24:12 UTC); no later version listed | arXiv abs page, WebFetch 2026-06-10 |
| Venue | ICBINB Workshop @ ICLR 2025 (arXiv Comments field); published in workshop proceedings, PMLR v296 (proceedings.mlr.press/v296/eiras25a.html) | arXiv Comments + WebSearch 2026-06-10 |
| Withdrawn/retracted | No indication on arXiv abs page | arXiv abs page, WebFetch 2026-06-10 |

Status rationale: workshop paper with published PMLR proceedings entry → tagged [ARTICLE VERIFIE] (venue = workshop, not main conference track; CORE ranking not applicable to workshops).
[NON VERIFIE]: full PDF text not yet read (no PDF downloaded, no ChromaDB injection at this stage — scoped verification only). Per-judge breakdown of the 100% result (which judges, N, attack method details) is therefore not verified beyond the abstract.

## 2. Abstract (verbatim, arXiv abs page, fetched 2026-06-10)

> Large Language Model (LLM) based judges form the underpinnings of key safety evaluation processes such as offline benchmarking, automated red-teaming, and online guardrailing. This widespread requirement raises the crucial question: can we trust the evaluations of these evaluators? In this paper, we highlight two critical challenges that are typically overlooked: (i) evaluations in the wild where factors like prompt sensitivity and distribution shifts can affect performance and (ii) adversarial attacks that target the judge. We highlight the importance of these through a study of commonly used safety judges, showing that small changes such as the style of the model output can lead to jumps of up to 0.24 in the false negative rate on the same dataset, whereas adversarial attacks on the model generation can fool some judges into misclassifying 100% of harmful generations as safe ones. These findings reveal gaps in commonly used meta-evaluation benchmarks and weaknesses in the robustness of current LLM judges, indicating that low attack success under certain judges could create a false sense of security.

## 3. Claim Verification — the "100%" claim

**Claim as cited by P151 (Srivastava survey)**: "in extreme cases, cause 100% of harmful generations to be misclassified as safe" (P151_Srivastava_2026_AlgorithmicRedTeamingSurvey.md, Citations cles, quoting Srivastava et al. Section 2.5, p.19).

**Verdict: CONFIRMED verbatim in the primary source abstract**, with one nuance of scope:

> "adversarial attacks on the model generation can fool **some judges** into misclassifying **100% of harmful generations as safe ones**" (Eiras et al., 2025, arXiv:2503.04474, abstract)

Nuances vs the P151 paraphrase:
1. The 100% result applies to "some judges", not all judges tested — P151's "in extreme cases" wording preserves this nuance correctly.
2. A second quantitative result is in the abstract: style-only changes shift the false negative rate by up to 0.24 on the same dataset (Eiras et al., 2025, abstract) — a non-adversarial "in the wild" fragility, distinct from the adversarial 100% result.
3. The closing sentence is directly relevant to AEGIS Ch.7: "low attack success under certain judges could create a false sense of security" (Eiras et al., 2025, abstract) — i.e., a low measured ASR may be a judge artefact.

[ABSTRACT SEUL] for any figure beyond the two above (0.24 FNR jump, 100% misclassification): per-judge tables, attack mechanics, and dataset sizes require full-text reading at integration time.

## 4. Threat Model (summary from abstract — [ABSTRACT SEUL])

| Component | Value | Source |
|-----------|-------|--------|
| Target | LLM safety judges (benchmarking, automated red-teaming, online guardrailing) | abstract, sent. 1 |
| Attack surface | The model generation being evaluated (adversarial manipulation of the judged output), not the judge prompt itself | abstract: "adversarial attacks on the model generation" |
| Attacker objective | Flip harmful → safe classification (false negatives) | abstract: "misclassifying 100% of harmful generations as safe ones" |
| Non-adversarial failure mode | Prompt sensitivity + distribution shift ("evaluations in the wild"), style changes → +0.24 FNR | abstract, challenge (i) |
| Access model | [NON VERIFIE] — black/white-box split not stated in abstract | — |

## 5. Convergence / Divergence with P044 (AdvJudge-Zero)

P044 = Li, Wu, Liu (Unit 42), arXiv:2512.17375, Dec 2025, fiche `doc_references/2026/prompt_injection/P044_Unit42_2026_AdvJudgeZero.md`.

**Convergence:**
- Same conclusion: LLM judges are adversarially flippable at near-total rates — P044: 99.91% FPR on MATH via low-perplexity control tokens (P044 fiche, Section 2, FPR table); Eiras: 100% of harmful generations misclassified safe on some judges (Eiras et al., 2025, abstract).
- Same attack surface: the evaluated output (P044: control tokens appended to the judged answer, fiche Section 1.2; Eiras: "adversarial attacks on the model generation", abstract).
- Same epistemological consequence: measured metrics are judge artefacts — Eiras: "false sense of security" (abstract); P044 fiche Section 3.1: "ASR_mesuree =/= ASR_reelle".

**Divergence / complementarity (key point):**
- P044 targets correctness/reward judges (math benchmarks AIME/MATH/GSM8K/RLVR) and its fiche explicitly lists as a limitation: "Scope limite aux evaluations de correctitude : les auteurs n'etudient pas les flips sur les evaluations de securite" (P044 fiche, Section 3.3). Eiras et al. target exactly safety judges — it fills P044's stated gap and is the safety-domain counterpart of the same vulnerability class.
- Eiras adds a non-adversarial axis (prompt sensitivity / distribution shift, +0.24 FNR from style alone, abstract) absent from P044.
- Chronology: Eiras (Mar 2025) precedes P044 (Dec 2025); P044 does not supersede it.

Multi-source confirmation already recorded internally: RR-DA-002 lists 5 independent papers converging on judge vulnerability, including Eiras 100% flip (`_staging/scientist/SAFETY_JUDGES_SEARCH_RR-DA-002.md`, table line 11; `doc_references/FORMALISATION_ASR_DETERMINISTIC.md`, lines 26-30).

## 6. AEGIS Relevance

- **F73 ASR_deterministic** (`doc_references/FORMALISATION_ASR_DETERMINISTIC.md`): Eiras is already cited there (lines 28-29, 221) as one of the 5 convergent sources motivating a deterministic judge. This scoped verification confirms the citation is accurate against the primary source. Strengthens the justification of F73 as extension of F22.
- **Ch.7 (ASR circularity)**: the abstract's closing sentence ("low attack success under certain judges could create a false sense of security") is directly quotable as primary-source support for the circularity argument currently anchored on P044.
- **Conjecture C2 (necessity of δ³)**: supports — if empirical safety judges are 100%-foolable on some configurations (Eiras et al., 2025, abstract), only formal/deterministic verification of the judging process gives guarantees; same direction as P044 fiche Section 4.2.
- **δ layers**: δ³ primarily (judge as attack surface → need for formal verification); δ⁰ secondarily (guardrailing pipelines).

## 7. Recommendation

**GO — integrate to corpus at next bibliography-maintainer RUN.**

Justification:
1. Claim chain P151 → Eiras verified against primary source, verbatim match (Section 3 above).
2. Already cited in F73 formalisation and RR-DA-002 without a P-ID — a corpus paper cited in thesis-grade documents MUST have a P-ID, PDF in `literature_for_rag/`, and ChromaDB injection (rule: ZERO DOCUMENT NON REFERENCE).
3. Fills P044's explicitly stated limitation (safety judges vs correctness judges) — direct thesis value for Ch.7.
4. Published venue (ICBINB Workshop @ ICLR 2025, PMLR v296) — not a bare preprint.

Integration tasks for next RUN: assign new P-ID (P082 is TAKEN by Wang/AgentSpec — do not reuse the stale RR-DA-002 proposal), download PDF, inject ChromaDB (verify >= 5 chunks), full ANALYST fiche with per-judge 100% breakdown, update MANIFEST.md + ARTICLES_INDEX.md, and clean the stale "P082 (Eiras)" mention in `_staging/scientist/SAFETY_JUDGES_SEARCH_RR-DA-002.md`.

## 8. Security

No prompt-injection content encountered in fetched web pages or local files. Mission unchanged. Status: CLEAR.
