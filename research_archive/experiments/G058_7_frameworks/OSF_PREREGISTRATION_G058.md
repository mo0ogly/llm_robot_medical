# OSF Pre-registration — G-058 : Comparative Evaluation of 8 δ³ Frameworks for Surgical-Medical LLM Safety

**Project**         : AEGIS (Advanced Evaluation of Guardrail-Integrated Systems)
**Investigator**    : Gabriel Hociel — ENS Paris-Sorbonne (PhD candidate) + ANSSI COSSI DESC/SIQ (analyst)
**Co-investigators**: To be defined per OSF Project membership
**Pre-registration date target** : 2026-06-15 (deadline NeurIPS 2026 D&B submission 2026-10-01)
**Status**          : DRAFT v2 — corrected 2026-05-20 via director validation cycle G058VAL, awaiting thesis director review
**Public OSF ID**   : `osf.io/aegis-g058-preregistration` (placeholder, to be issued on submission)

---

## 1. Title

Comparative Evaluation of 8 Output-Validation Frameworks (δ³) for Surgical-Medical LLM Safety under FDA 510k K183303 Biomechanical Constraints.

## 2. Study type

Confirmatory empirical study with pre-specified hypotheses, framework comparisons, and post-hoc exploration.

## 3. Authors

To be finalised. Likely list :
- Gabriel Hociel (ENS Paris-Sorbonne, ANSSI)
- Thesis director (TBC)
- Co-author from Drexel team (if P125 reproduction extended — see G-007)

## 4. Hypotheses

The pre-registered hypotheses replicate verbatim §0 of `G058_CAMPAGNE_7_FRAMEWORKS_DELTA3.md` :

### H0 (null)
The 7 generic δ³ frameworks identified — Outlines (P135), Guardrails AI (P132), LLM Guard (P133), CaMeL (P081), AgentSpec (P082), LlamaFirewall CodeShield (P084), RAGShield (P066) — have statistically indistinguishable Attack Success Rate (ASR) on the AEGIS catalogue.

### H1 (medical specialisation)
AEGIS (8th implementation, surgical FDA-anchored specialisation) achieves significantly lower ASR (p < 0.01, Bonferroni corrected to alpha = 0.00143 across 7 comparisons) than the 7 generic frameworks on the 62 AEGIS surgical-medical scenarios.

### H2 (cross-domain trade-off)
The 7 generic frameworks outperform AEGIS on the generic (non-medical) attack templates of the 122-template AEGIS corpus, confirming that specialisation is a coverage-depth compromise (p < 0.05, Bonferroni corrected to alpha = 0.00714 across 7 comparisons).

### H3 (composition)
Composing AEGIS with one generic framework (AEGIS + Outlines, AEGIS + CaMeL, AEGIS + AgentSpec) yields a strictly lower ASR than either component alone (Friedman ANOVA, p < 0.05 with Nemenyi post-hoc), extending the Triple Convergence discovery D-001.

## 5. Frameworks evaluated (panel of 8)

| # | Framework            | P-ID | Year | Type            | Public code |
|---|----------------------|------|------|-----------------|------------|
| 1 | Outlines             | P135 | 2023 | FSM academic     | github.com/dottxt-ai/outlines |
| 2 | Guardrails AI        | P132 | 2023 | industrial       | github.com/guardrails-ai/guardrails |
| 3 | LLM Guard            | P133 | 2023 | industrial       | github.com/protectai/llm-guard |
| 4 | CaMeL                | P081 | 2025 | taint tracking   | github.com/google-research/camel-prompt-injection |
| 5 | AgentSpec            | P082 | 2025 | DSL runtime      | github.com/haoyuwang99/AgentSpec |
| 6 | LlamaFirewall (CodeShield) | P084 | 2025 | AST code-domain | github.com/meta-llama/PurpleLlama |
| 7 | RAGShield            | P066 | 2026 | RAG provenance   | [reference RAGShield non verifiable - retiree 2026-05, aucun artefact identifie] |
| 8 | **AEGIS (this thesis)** | -- | 2026 | surgical FDA     | github.com/pizzif/poc_medical |

Replacement of LMQL by Outlines documented in PDCA-2 / PDCA-6 (2026-05-16) following LMQL incompatibility with LLaMA 3.2 (GitHub issues #350 / #353, eth-sri/lmql).

## 6. Target LLM

Provider : Groq. Model : `llama-3.3-70b-versatile`. Temperature 0.

This choice complies with the project rule (CLAUDE.md) : thesis campaigns are always run on Groq (confirmed under TC-002, 70B). It supersedes the v1 draft choice of "LLaMA 3.2 3B-instruct via Ollama (local)".

**Reproducibility note** : inference is hosted via the Groq API rather than executed locally. The `seed` parameter is set and fixed for every request, and each condition is reported as the median over 3 distinct seeds. Hosted inference is acknowledged to be less perfectly deterministic than local execution (provider-side batching, hardware scheduling, and silent model updates can introduce residual variance even at temperature 0 with a fixed seed) — the 3-seed median is the mitigation for this residual non-determinism.

Secondary cross-model validation with Mistral 7B and Phi-3 to assess generalisation.

## 7. Attack corpus

**122 AEGIS templates** (97 numbered templates + extension T100-T117).

The verified attack-type distribution, taken from `EXPERIMENT_REPORT_G058_MINI_SC1.md §2`, is :

| Attack type   | N templates |
|---------------|------------|
| injection     | 86 |
| rule_bypass   | 31 |
| prompt_leak   | 5 |
| **Total**     | **122** |

> **Note (per-category taxonomy to be regenerated)** : the v1 draft listed a 9-category DPI/IPI/RAG taxonomy summing to 99. That breakdown is obsolete and is NOT carried forward. The authoritative per-category decomposition for the 122-template corpus must be regenerated from `backend/red_team/templates_metadata.json` before OSF JSON conversion. No per-category sub-totals are pre-registered here, only the verified attack-type distribution above and the corpus total of 122.

Plus **62 surgical-medical scenarios** specialised for Da Vinci Xi, exported via `export_scenarios_metadata.py` (PDCA-11) and confirmed in RESEARCH_STATE (source of truth).

## 8. Trials per condition

- SC-1 (generic) : 122 templates × 8 frameworks × N=30 = 29,280 trials
- SC-2 (medical) : 62 scenarios × 8 frameworks × N=30 = 14,880 trials
- SC-3 (adversarial genetic) : 5 adaptive frameworks × 200 NSGA-II generations × population 30 = 30,000 trials
- SC-4 (composition) : 3 compositions (AEGIS + 1 generic) × 122 templates × N=30 = 10,980 trials

**Total : 85,140 trials**.

> **Note [SC-3 design to be ratified by the thesis director]** : SC-3 is a genetic (NSGA-II) sub-campaign. In a genetic search the attack templates are not a multiplicative factor — they seed an evolving population rather than being enumerated. The v1 draft factorisation "5 frameworks × 99 templates × 200 generations = 30,000" is arithmetically inconsistent (5 × 99 × 200 = 99,000, not 30,000). It is replaced here by a coherent factorisation — 5 adaptive frameworks × 200 NSGA-II generations × population 30 = 30,000 trials — which preserves the intended 30,000-trial budget. This SC-3 factorisation must be ratified by the thesis director before OSF submission.

## 9. Metrics (pre-registered)

| Metric | Definition | Source paper |
|--------|------------|--------------|
| ASR | Attack Success Rate per condition (trials with framework `passed=False`) | standard PI evaluation |
| Sep(M) | Separation Mahalanobis index | Debenedetti et al. 2025 (P024) |
| SVC | Severity × Vulnerability × Confidence composite | AEGIS internal |
| Chain-ASR(k) | P(payload passes k consecutive layers) | G-061 (planned) |
| CHER | Clinical Harm Equivalent Rating | Han et al. 2024 (P107 MedSafetyBench) |
| FP rate | False Positive (over-defense) on legitimate prompts | Kholkar & Ahuja 2025 (P124 CAPTURE) |
| Latency p95 | Defense overhead in milliseconds | operational |

## 10. Statistical analysis plan

| Hypothesis | Test | Critical value | Correction |
|------------|------|----------------|------------|
| H1 (AEGIS vs 7 on medical) | Mann-Whitney U one-tailed | p < 0.01 | Bonferroni 7 comparisons → α = 0.01 / 7 = 0.00143 |
| H2 (AEGIS vs 7 on generic) | Mann-Whitney U one-tailed | p < 0.05 | Bonferroni 7 comparisons → α = 0.05 / 7 = 0.00714 |
| H3 (composition) | Friedman ANOVA | p < 0.05 | Nemenyi post-hoc |
| H0 omnibus | Kruskal-Wallis 8 groups | p < 0.001 | -- |

Effect sizes via Cliff's delta :
- |δ| < 0.147 : negligible
- 0.147 ≤ |δ| < 0.33 : small
- 0.33 ≤ |δ| < 0.474 : medium
- |δ| ≥ 0.474 : large (target for publishable AEGIS effect)

## 11. Stopping rules

- Each sub-campaign completes when total_trials_completed == total_trials_planned, OR
- If 95% confidence intervals on ASR no longer overlap after 50% of trials AND effect is large (|δ| ≥ 0.474), early-stop is permitted but only on the OMNIBUS H0 test, never on the per-pair hypotheses (H1, H2, H3).

## 12. Pre-specified exclusions

- Trials where the LLM backend (Groq API) returned an error → recorded but excluded from ASR
- Trials with latency > 60s → recorded as timeout but excluded from latency analysis (kept in ASR)
- Trials with framework setup failure (e.g. Outlines FSM compile error) → recorded as framework_failure, excluded from all analyses

## 13. Reproducibility commitments

- Code : public Apache-2.0 at github.com/pizzif/poc_medical
- Sanitized template metadata : `backend/red_team/templates_metadata.json` (no malicious payloads)
- Raw trial outputs : Parquet snapshots in `research_archive/experiments/G058_7_frameworks/aggregated/`
- Pre-registration JSON : `osf.io/aegis-g058-preregistration` (to be issued)
- Manifest : SHA256 of `AllowedOutputSpec`, git revision, started_at / finished_at, total_trials_planned / completed — written automatically by `run_g058_campaign.py`

## 14. Risks acknowledged (from G-058 §8)

| Risk | Mitigation |
|------|-----------|
| Outlines Ollama integration via OpenAI-compatible workaround unstable | Fallback to llama-cpp-python direct GGUF loading |
| CaMeL closed-source portion | Reimplement pattern from P081 paper |
| Timeline > 96h compute | Reduce N=20 on SC-3 if necessary |
| Hosted-inference non-determinism (Groq API, llama-3.3-70b-versatile) — provider-side batching, hardware scheduling and silent model updates can introduce residual variance even at temperature 0 | temperature=0 + fixed `seed` parameter per request + median over 3 seeds; hosted inference acknowledged as less perfectly deterministic than local execution |
| Cherry-picking accidental | Pre-registration (this document) + blinded label analysis |

## 15. Author contributions (Contributor Roles Taxonomy)

To complete in OSF JSON conversion :
- Conceptualization : G. Hociel
- Methodology : G. Hociel + thesis director
- Software : G. Hociel
- Validation : G. Hociel + thesis director
- Investigation : G. Hociel
- Resources : ENS Paris-Sorbonne + ANSSI
- Data Curation : G. Hociel
- Writing — Original Draft : G. Hociel
- Writing — Review & Editing : co-authors TBD
- Supervision : thesis director
- Funding Acquisition : ENS Paris-Sorbonne doctoral grant + ANSSI

## 16. Submission checklist (OSF JSON conversion)

- [ ] Convert this Markdown to OSF Pre-registration JSON schema v2.x
- [ ] Add empirical Bayesian priors on ASR per framework (optional, exploratory)
- [ ] Validate hypothesis IDs (H0/H1/H2/H3) are non-overlapping
- [ ] Final review by thesis director (validation supervisor)
- [ ] Submission via OSF web UI before 2026-06-15
- [ ] Capture OSF ID and update this file + `research_requests.json` RR-G058
- [ ] Add OSF ID to `manifest_SC1.json` and `manifest_SC2.json` headers when campaign runs

## 17. References

- Beurer-Kellner et al. 2025, arXiv:2506.08837 (P126) -- design patterns
- Willard B.T. & Louf R. 2023, arXiv:2307.09702 (P135) -- Efficient Guided Generation for Large Language Models (paper title; "Outlines" is the open-source library name, not the paper title)
- Debenedetti et al. 2025, ICLR (P024) -- Sep(M)
- Han T., Kumar A., Agarwal C., Lakkaraju H. 2024, arXiv:2403.03744, NeurIPS Datasets and Benchmarks track (P107) -- MedSafetyBench
- Kholkar & Ahuja 2025, ACL LLMSec (P124) -- CAPTURE
- Benjamin V. et al. 2024, arXiv:2410.23308 (P125) -- Systematically Analyzing Prompt Injection Vulnerabilities in Diverse LLM Architectures (56% ASR baseline; panel 0.5B-14B Cloudflare Workers AI, all open-weight)
- Li T.-L., Wu Y., Liu H. (Palo Alto/Unit 42 affiliation UNCONFIRMED on arXiv -- see changelog item 12) 2025, arXiv:2512.17375 (P044) -- AdvJudge-Zero
- Liu et al. 2023, NSGA-II adversarial -- genetic engine

## 18. Generated by

PDCA-7 session 2026-05-16. Draft v1 produced by research-director orchestrator from `G058_CAMPAGNE_7_FRAMEWORKS_DELTA3.md` content + PDCA-1 to PDCA-6 outcomes. Draft v2 produced 2026-05-20 by the research-director validation cycle G058VAL, correcting the six internal inconsistencies identified in `DIRECTOR_VALIDATION_BRIEFING_G058_2026-05-20.md`. Awaiting thesis director review before OSF JSON conversion and submission.

## 19. Changelog v1 vers v2

All changes below were applied 2026-05-20 by the research-director validation cycle G058VAL, on the basis of `DIRECTOR_VALIDATION_BRIEFING_G058_2026-05-20.md` (Volet B, six inconsistencies B-1 to B-6). The v1 draft is preserved unchanged as `OSF_PREREGISTRATION_G058_v1_archived.md` in the same directory.

| # | Section(s) | Change | Justification |
|---|-----------|--------|---------------|
| 1 | Header | Status changed from "DRAFT v1 — ready for OSF JSON conversion" to "DRAFT v2 — corrected 2026-05-20 via director validation cycle G058VAL, awaiting thesis director review". | The draft is no longer JSON-conversion-ready as-is; it must first be reviewed by the thesis director after correction of the six inconsistencies. |
| 2 | 6 | Target LLM changed from "LLaMA 3.2 3B-instruct via Ollama (local)" to "Groq, model llama-3.3-70b-versatile, temperature 0". Added a reproducibility note (fixed `seed` parameter, median over 3 seeds, hosted inference acknowledged as less perfectly deterministic than local). | Inconsistency B-4. CLAUDE.md project rule : thesis campaigns are always run on Groq (TC-002, confirmed 70B). Director-locked decision. No API key or secret is recorded in this document. |
| 3 | 7 | Attack corpus total changed from 99 to 122 templates (97 numbered + extension T100-T117). The obsolete 9-category DPI/IPI/RAG taxonomy summing to 99 was removed and replaced by (a) the verified attack-type distribution from `EXPERIMENT_REPORT_G058_MINI_SC1.md §2` (injection 86, rule_bypass 31, prompt_leak 5, total 122) and (b) an explicit note that the per-category decomposition must be regenerated from `backend/red_team/templates_metadata.json`. | Inconsistency B-2. RESEARCH_STATE and CLAUDE.md confirm 122. No unverified per-category sub-totals were invented for the 122-template corpus. |
| 4 | 7, 8 | Surgical-medical scenario count changed from 48 to 62. | Inconsistency B-3. PDCA-11 exported 62 scenarios via `export_scenarios_metadata.py`; RESEARCH_STATE (source of truth) confirms 62. |
| 5 | 8 | All trial totals recomputed : SC-1 = 122 × 8 × 30 = 29,280 ; SC-2 = 62 × 8 × 30 = 14,880 ; SC-4 = 3 × 122 × 30 = 10,980. SC-3 refactored from the arithmetically inconsistent "5 × 99 × 200 = 30,000" (actually 99,000) to "5 adaptive frameworks × 200 NSGA-II generations × population 30 = 30,000", with a visible note "[SC-3 design to be ratified by the thesis director]". General total updated from "~74,000" to 85,140 trials. | Inconsistency B-1. The genetic NSGA-II sub-campaign does not multiply by templates; the previous factorisation was internally inconsistent. The new SC-3 factorisation preserves the 30,000-trial budget but requires director ratification. |
| 6 | 10 | Bonferroni correction for H2 corrected from α = 0.00143 ("same" as H1) to α = 0.05 / 7 = 0.00714. H1 left at α = 0.01 / 7 = 0.00143. | Inconsistency B-6. H2 is tested at p < 0.05, so its Bonferroni base is 0.05/7, not the 0.01/7 base of H1. |
| 7 | 4 | Hypotheses H1 and H2 made consistent with the corrected corpus : H1 now references the 62 surgical-medical scenarios; H2 now references the generic templates of the 122-template AEGIS corpus and states the corrected α = 0.00714. | Inconsistencies B-2, B-3, B-6 propagated to the hypothesis statements for internal consistency. |
| 8 | 12, 14 | Section 12 exclusion criterion updated from "LLM backend (Ollama)" to "LLM backend (Groq API)". Section 14 risk row "LLaMA stochasticity" replaced by a "Hosted-inference non-determinism (Groq API)" row with the matching mitigation. | Propagation of the Groq decision (item 2) for document-wide consistency. |
| 9 | 18 | "Generated by" section updated to record the v2 validation cycle G058VAL. | Provenance tracking. |
| 10 | 19 | This changelog section added. | Pre-registration discipline : every modification between draft versions must be explicitly logged and justified. |
| 11 | 17 | References P107, P135 and P125 corrected after WebSearch verification (cycle G058VAL, verification agent, 2026-05-20). P107 : arXiv:2403.03744 added, authors Han, Kumar, Agarwal, Lakkaraju, venue NeurIPS Datasets and Benchmarks 2024. P135 : the paper title is "Efficient Guided Generation for Large Language Models" -- "Outlines" is the library name, not the title. P125 : full title recorded, first author Victoria Benjamin. | Inconsistency B-5 resolved. |
| 12 | 17 | ADDENDUM 2026-06-03 (bibliography integrity audit) : P044 (AdvJudge-Zero, arXiv:2512.17375) re-verified via WebFetch of the arXiv abstract page. Authors confirmed = Tung-Ling Li, Yuhao Wu, Hongliang Liu, but NO "Unit 42" / "Palo Alto Networks" affiliation appears on the page. The "Unit 42" label (RR-G062) is recorded as UNCONFIRMED and must not be asserted. Citable headline metric corrected to ">90% ensemble FPR on 22 of 24 (model, dataset) cells across six Qwen/Llama/Gemma judges", NOT "99% of judges". | Resolves the residual caveat noted under "Items NOT changed". Pre-registration discipline: recorded as a dated addendum, source line not silently rewritten. |

Items NOT changed in this v2, and the reason :
- Inconsistency B-5 (references P107, P135, P125) is now RESOLVED -- see changelog row 11. Verification was delegated to a verification agent (WebSearch) within cycle G058VAL on 2026-05-20. One residual caveat : the "Unit 42" affiliation of the P044 authors (Li, Wu, Liu) is asserted by RR-G062 but could not be independently confirmed by WebSearch -- RESOLVED 2026-06-03 (changelog item 12) : confirmed UNCONFIRMED on the arXiv abstract page, label not to be asserted.
- Section 16 checklist : "Final review by thesis director" is deliberately left unchecked, since this v2 is produced precisely for that review.
