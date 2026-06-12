# AEGIS Positioning Note — Autonomous and Algorithmic Red Teaming (Competitive Landscape)

**Date:** 2026-06-13
**Produced by:** research-director session 2026-06-13, RR-RUN10-001
**Source request:** DIRECTOR_BRIEFING_RUN010.md P1 (registered as RR-RUN10-001 in `doc_references/prompt_analysis/research_requests.json`, created 2026-06-09, priority high; blocks Ch.2, Ch.7, D-021)
**Status:** [SYNTHESIS — internal positioning note]

**STEP 0 anti-duplication verifications** (`backend/tools/check_corpus_dedup.py`, mandatory per doctoral-research.md):

| arXiv ID | System | Dedup result | Handling |
|----------|--------|--------------|----------|
| 2510.02677 | ARMs (Chen et al., 2025) | [DUPLICATE] as P151 | Cited via P151 (survey ref 54). Not reintegrated as a standalone P-ID. |
| 2507.01020 | AutoAdv (Reddy et al., 2025) | [DUPLICATE] as P151 | Cited via P151 (survey ref 46). Not reintegrated as a standalone P-ID. |
| 2506.10047 | GenBreak (Wang et al., 2025) | [DUPLICATE] as P151 | Cited via P151 (survey ref 53). Not reintegrated as a standalone P-ID. |
| 2503.15754 | AutoRedTeamer (Zhou et al., 2025) | [DUPLICATE] as P151 | Maps to the P151 corpus record via its AutoRedTeamer disambiguation note. The survey text itself does NOT cite this paper (P151 fiche, "NOTE IMPORTANTE": the survey's "ARMs" is Chen et al., arXiv:2510.02677). Corpus knowledge of AutoRedTeamer comes from D-021. Not reintegrated as a standalone P-ID. |

P151 is the authoritative corpus version for all four references; per the anti-duplication rule, none of them is re-verified on arXiv, re-analyzed, or re-injected into ChromaDB.

---

## 1. Scope and method

**Object.** This note positions AEGIS among autonomous and algorithmic red-teaming systems, for use in Chapter 2 (state of the art) and Chapter 7 (discussion). It states (i) what the comparative landscape looks like from the verified internal corpus, (ii) what AEGIS explicitly does NOT claim, (iii) what AEGIS can defensibly claim, and (iv) ready-to-use manuscript formulations. [SYNTHESIS]

**Method.** Sources are strictly internal to corpus P001-P155 (as of 2026-06-13). The primary secondary source is P151 (Srivastava, Janardhan & Jauhari, 2026, arXiv:2602.21267 [PREPRINT VERIFIE], PRISMA systematic review, coverage January 2022 - December 2025, read in fulltext, 39 pages; fiche `doc_references/2026/benchmarks/P151_Srivastava_2026_AlgorithmicRedTeamingSurvey.md`). Corpus discovery records D-021 and D-029 (`discoveries/DISCOVERIES_INDEX.md`) supply the AutoRedTeamer/Mastermind and δ³-landscape evidence. AEGIS experimental figures come exclusively from `research_archive/experiments/campaign_manifest.json` [EXPERIMENTAL]. No WebSearch or WebFetch was performed for this note; all sources were previously verified. A prior ANALYST-level draft exists (`doc_references/prompt_analysis/POSITIONING_AEGIS_VS_AUTONOMOUS_REDTEAM_2026-06-10.md`, RR-RUN10-001, 2026-06-10); the present note is the SCIENTIST-level synthesis requested by the director briefing.

**Source caveat on P151.** The survey declares arXiv excluded from its inclusion criteria yet cites numerous arXiv preprints in its text and bibliography (P151 fiche, Faiblesses; Section 3, p.27). For the systems known to the corpus only through this survey (ARMs, AutoAdv, GenBreak, GPTFuzzer), every factual cell below is marked "per P151 only — not independently verified". [SYNTHESIS]

**Motivating failure mode.** D-021 initially recorded P096 Mastermind in terms compatible with a "first autonomous red team" framing; that primacy claim was refuted by AutoRedTeamer (D-021 HUMILITY GATE reformulation, 2026-05-16; failure mode documented in `.claude/rules/doctoral-research.md`, with a measured discovery-claim false-positive rate of 3.4%, i.e. 1/29 discoveries). The HUMILITY GATE audit of 2026-05-21 (`research_notes/AEGIS-AUDIT-HUMILITY-GATE_2026-05-21.md`, Section 1) further found 24 residual absolute claims, 17 of them already refuted by internal counter-evidence (D-029). This note therefore uses only scoped, dated formulations of the form "among the approaches identified in corpus P001-P155 as of 2026-06-13", following the conformant models validated by that audit (THESIS_GAPS.md:367; TRIPLE_CONVERGENCE.md:240).

---

## 2. Comparative landscape

Reference architecture: P151 defines algorithmic red teaming as a triad — an *attack/adversarial model* generating probes, a *judge model* evaluating responses, and a *target model* under test, "guided by an objective defined by the ethical tester" (P151, Section 2.3, p.15). The P151 fiche notes that this decomposition matches the AEGIS multi-agent architecture (red-team agent / security-audit judge / medical-robot target). [SYNTHESIS]

| System | Reference & corpus status | Target domain | Architecture (attack-judge-target triad, P151 Section 2.3 p.15) | Multi-turn | Learning / memory | Judge type | Statistical validation | Medical-surgical specialization |
|--------|---------------------------|---------------|------------------------------------------------------------------|-----------|-------------------|------------|------------------------|--------------------------------|
| **AEGIS** | This work (ENS thesis, 2026); experimental records in `campaign_manifest.json` [EXPERIMENTAL] | Medical surgical LLM agent controlling the Da Vinci Xi robot, FDA 510(k)-anchored constraints (D-029, entry 8) | Full triad as multi-agent pipeline: red-team agent / security-audit judge / medical-robot target (P151 fiche, taxonomy item 1, mapping onto Section 2.3, p.15) [SYNTHESIS] | Yes — 40 attack chains x 30 trials per campaign (campaign_manifest.json, FC-20260409, params.n_chains=40) [EXPERIMENTAL] | Operator-driven payload-improvement loop, validated at N=30/arm: baseline 13.3% lifted to 86.7% [70.3, 94.7] (campaign_manifest.json, PI-20260609) [EXPERIMENTAL]; curated corpus memory (ChromaDB), human-in-the-loop — NOT an autonomous self-evolving repository in the Mastermind sense (D-021) [SYNTHESIS] | Deterministic (campaign_manifest.json, F46-20260604 and PI-20260609, params.judge = "deterministic") [EXPERIMENTAL] | N >= 30 per condition, Wilson 95% CI, Bonferroni correction on the 15-condition F46 grid (campaign_manifest.json, success_criteria; F46-20260604 diagnosis) [EXPERIMENTAL] | Yes — grasp tension 50-800 g, phase-dependent forbidden_tools, HL7 OBX directives consistent with SNOMED-CT (D-029, entry 8) |
| **ARMs** | Chen, Liu, Kang et al., 2025, arXiv:2510.02677 [PREPRINT], P151 ref 54 — per P151 only, not independently verified. Distinct from AutoRedTeamer (P151 fiche, NOTE IMPORTANTE) | Multimodal models (P151, Section 2.6, p.20) | Plug-and-play adaptive agent orchestrating 10+ multimodal strategies (reasoning hijacking, contextual cloaking) with epsilon-greedy search (P151, Section 2.6, p.20) | Not specified per P151 | Epsilon-greedy exploration; "logs diverse failures at scale" (P151, Section 2.6, p.20) | Not specified per P151 | Not documented in corpus records (per P151 fiche) | None identified per P151 |
| **AutoAdv** | Reddy, Zagula & Saban, 2025, arXiv:2507.01020 [PREPRINT], P151 ref 46 — per P151 only, not independently verified | LLM dialogue jailbreak (P151, Section 2.5, p.17) | Automated multi-turn framework that rephrases, disguises and refines the attack within a dialogue (P151, Section 2.5, p.17) | Yes (P151, Section 2.5, p.17) | Within-dialogue iterative refinement (P151, Section 2.5, p.17) | Not specified per P151 | Not documented in corpus records (per P151 fiche) | None identified per P151 |
| **GenBreak** | Wang et al., 2025, arXiv:2506.10047 [PREPRINT], P151 ref 53 — per P151 only, not independently verified | Generative image/video models — grouped by P151 with GhostPrompt and T2V-OptJail (P151 fiche, taxonomy item 4; Section 2.6, p.19) | Red-team LLM fine-tuned via SFT+RL against a surrogate generator (P151, Section 2.6, p.19) | Not specified per P151 | SFT+RL fine-tuning of the attacker (P151, Section 2.6, p.19) | Not specified per P151 | Not documented in corpus records (per P151 fiche) | None identified per P151 |
| **GPTFuzzer** | Yu et al., 2023, arXiv:2309.10253 [PREPRINT], P151 ref 50 — per P151 only, not independently verified | LLM jailbreak prompts (P151, Section 2.6, p.20) | Automated generation of jailbreak prompts, fuzzing-style (P151, Section 2.6, p.20) | Not specified per P151 | Automated prompt generation; mechanism details not in P151 fiche | Not specified per P151 | Not documented in corpus records (per P151 fiche) | None identified per P151 |
| **AutoRedTeamer** | Zhou et al., 2025, arXiv:2503.15754 [PREPRINT]; recorded in D-021 as "OpenReview 2025, anonymous submission"; NOT cited by the P151 survey (P151 fiche, NOTE IMPORTANTE) | Not specified in corpus records (D-021) | Autonomous red team with persistent memory; design "conceptually close" to Mastermind "though without evaluation as ample as Mastermind" (D-021) | Not specified in corpus records (D-021) | Persistent attack memory (D-021) | Not specified in corpus records (D-021) | Not documented in corpus records (D-021) | None identified in corpus records (D-021) |
| **Mastermind** | Ren et al., 2026, P096 (in corpus); D-020, D-021 | Frontier LLMs/LRMs — reported ASR 60% on GPT-5, 89% on R1 (D-020) | Multi-agent, knowledge-driven attack system (D-021) | Yes — exploits accumulation of partial compliances across turns (D-020) | Self-evolving adversarial knowledge repository: autonomously accumulates attack successes/failures and adapts strategy without human intervention (D-021) | Not specified in corpus records (D-020, D-021) | ASR point figures reported (60% GPT-5, 89% R1, D-020); no N/CI documented in corpus records | None identified in corpus records (D-021) |

Reading note: empty-looking cells are deliberate. Where the corpus (via P151 or D-021) does not document a property, the honest entry is "not specified", not an inferred value. [SYNTHESIS]

---

## 3. What AEGIS does NOT claim

This section applies the HUMILITY GATE (doctoral-research.md; CLAUDE.md): no "first", "only", "novel", "unprecedented" without corpus scope and date.

1. **AEGIS is NOT "the first autonomous red team".** Documented precedents known to the corpus: AutoRedTeamer (Zhou et al., 2025, arXiv:2503.15754, via D-021 — the system that refuted this exact claim, HUMILITY GATE reformulation 2026-05-16), ARMs (Chen et al., 2025, arXiv:2510.02677, P151 Section 2.6, p.20), Mastermind (Ren et al., 2026, P096, D-021), AutoAdv (Reddy et al., 2025, arXiv:2507.01020, P151 Section 2.5, p.17) and GenBreak (Wang et al., 2025, arXiv:2506.10047, P151 Section 2.6, p.19). The corpus reformulation is "among the first published examples" at best, and only for the persistent-memory subfamily (D-021).
2. **AEGIS is NOT the first automated attack-generation engine.** GPTFuzzer (Yu et al., 2023, arXiv:2309.10253, P151 Section 2.6, p.20) automated jailbreak-prompt generation in 2023, predating the AEGIS genetic engine. AEGIS's fuzzing/mutation family has published antecedents.
3. **AEGIS is NOT "the only δ³ implementation".** At least 7 public frameworks implement the generic δ³ output-validation pattern, from LMQL (2022, arXiv:2212.06094, P134) through Guardrails AI (2023, P132), LLM Guard (2023, P133), CaMeL (2025, arXiv:2503.18813, P081), AgentSpec (2025, arXiv:2503.18666, P082), LlamaFirewall CodeShield (2025, arXiv:2505.03574, P084), to RAGShield (2026, arXiv:2604.00387, P066) (D-029). AEGIS is at minimum the 8th known public implementation (D-029; formulation validated as HUMILITY GATE-conformant in AEGIS-AUDIT-HUMILITY-GATE_2026-05-21.md, Section 2.3, re TRIPLE_CONVERGENCE.md:240). The originality is the domain specialization, not the pattern (D-029).
4. **AEGIS does NOT claim cross-session reproducible point ASRs.** Per P151, ASR is "session-specific, and for auditability purposes may not be reproducible" (Section 2.1, p.5), and "repeatability is fundamentally contrary to a Gen AI model's modus operandi" (footnote 3, p.15). AEGIS therefore reports Wilson interval estimates over N >= 30 and treats point ASRs as session-bound observations, not reproducible constants.
5. **AEGIS does NOT claim cross-model generality of measured ASRs.** The identical 40-chain protocol yields ASR 6.75% [5.46, 8.31] on llama-3.1-8b-instant versus 5.17% [4.05, 6.57] on llama-3.3-70b-versatile (campaign_manifest.json, FC-20260409, runs 2-3) [EXPERIMENTAL]; the F46 defense calibration optimum also shifts across models (mu=1.0/gamma=0.85 on llama-3.3-70b-versatile vs mu=1.0/gamma=1.0 on openai/gpt-oss-120b, where mu=0.01 is counterproductive — ASR rises to 0.27-0.29 — and gamma=0.70 is ineffective, 0.1889 n.s.; campaign_manifest.json, F46-20260604 and F46-REPL-20260609) [EXPERIMENTAL]. Calibration and vulnerability profiles are model-specific.
6. **AEGIS does NOT present the FC-20260410 ASR drop as a pure defense-effectiveness result without its confound disclosure.** The drop to 2.08% [1.42, 3.06] coincided with an uncontrolled activation of the chain_defenses prefilter (commit 3c1e896) between campaigns; the ablation RR-FC-001 attributed the hyde/xml 96.7% to 0% collapse to that prefilter (30/30 blocked) (campaign_manifest.json, FC-20260410, diagnosis and rr_fc_001_attribution, resolved 2026-06-10) [EXPERIMENTAL].

---

## 4. Defensible positioning

Template formulation, applied throughout: "Among the autonomous red-teaming approaches identified in corpus P001-P155 (2026-06-13), AEGIS is distinguished by...". [SYNTHESIS]

**(a) Medical-surgical specialization (Da Vinci Xi, FDA 510(k)).** Among the autonomous red-teaming approaches identified in corpus P001-P155 (2026-06-13), AEGIS is the only one identified that targets a medical surgical LLM agent for the Da Vinci Xi robot and validates outputs against FDA 510(k)-anchored biomechanical constraints — grasp tension 50-800 g, phase-dependent forbidden_tools, HL7 OBX directives consistent with the SNOMED-CT ontology (D-029, entry 8). No equivalent medical-surgical specialization was identified in corpus P001-P155 as of 2026-06-13: the comparison table in Section 2 shows "none identified" for all six external systems, and P151 itself flags healthcare as a critical domain for agentic red teaming (Section 2.7.4, p.24, citing Van Kolfschooten & Van Oirschot, 2024) without describing any surgical-robotics red-teaming system. This claim is corpus-scoped and dated, not absolute. [SYNTHESIS]

**(b) Formal layered δ⁰-δ³ framework.** AEGIS decomposes the attack/defense surface into four formal layers (δ⁰ model-level alignment, δ¹ input/context filtering, δ² output moderation and LLM-judge evaluation, δ³ external deterministic output validation). The defense surfaces P151 recenses — model-level alignment, input filtering, output moderation, system-level guardrails (Section 2.4, p.15-17) — map onto these layers, and P151's conclusion that "no single defense mechanism is sufficient" against adaptive adversaries (Section 2.4, p.16) supports the multi-layer treatment, but the survey does not formalize per-layer metrics; the layered formalization is the AEGIS contribution, while the δ³ pattern itself is an established one that AEGIS specializes (D-029). [SYNTHESIS]

**(c) Deterministic judge, motivated by documented LLM-judge fragility.** AEGIS evaluates with a deterministic judge (campaign_manifest.json, F46-20260604 and PI-20260609, params.judge = "deterministic") [EXPERIMENTAL]. The design motivation is externally corroborated: P151 synthesizes Eiras et al. (= corpus P153 [ARTICLE VERIFIE], arXiv:2503.04474, ICBINB@ICLR 2025) showing that "modest perturbations to output style and targeted adversarial manipulations can shift a safety judge's false-negative rate by up to 0.24 on the same data, and in extreme cases, cause 100% of harmful generations to be misclassified as safe" (P151, Section 2.5, p.19); the P153 corpus integration evaluated 4 judges (HarmBench, WildGuard, ShieldGemma, LLaMA Guard 3) (research_requests.json, RR-RUN10-002 resolution, 2026-06-10); the 100% misclassification figure applies to some judges under specific manipulations, not to all four (P153 fulltext, Abstract p.1: "fool some judges"; RUN-011 briefing HUMILITY GATE). This converges with the corpus-internal P044 finding of a 99% judge verdict-flip rate (P151 fiche; redteam-analysis.md). Judge robustness is also one of the survey's identified research gaps (P151, Section 4, p.29-31, gap 3). [SYNTHESIS]

**(d) Statistical validation regime.** Among the systems in Section 2, AEGIS is the only one for which the corpus documents pre-registered statistical criteria: N >= 30 per condition, Wilson 95% confidence intervals, and multiple-comparison correction (campaign_manifest.json, success_criteria fields) [EXPERIMENTAL]. The supporting campaign record:

| Campaign | Model (provider: Groq) | Headline result [EXPERIMENTAL] | Source field |
|----------|------------------------|--------------------------------|--------------|
| FC-20260409 run 2 | llama-3.1-8b-instant | ASR 6.75% [5.46, 8.31] (81/1200), 40 chains x 30 trials; Sep(M)=0.0667, no separation | campaign_manifest.json, FC-20260409, iterations run 2, diagnosis |
| FC-20260409 run 3 | llama-3.3-70b-versatile | ASR 5.17% [4.05, 6.57] (62/1200); Sep(M)=0.0517, no separation | campaign_manifest.json, FC-20260409, iterations run 3, diagnosis |
| FC-20260410 | llama-3.1-8b-instant | ASR 2.08% [1.42, 3.06] (25/1200); hyde/xml 96.7% to 0% attributed to chain_defenses prefilter (30/30 blocked, commit 3c1e896) by ablation RR-FC-001 | campaign_manifest.json, FC-20260410, diagnosis + rr_fc_001_attribution |
| PI-20260609 | llama-3.3-70b-versatile | Template #01 baseline ASR 13.3% [5.3, 29.7] lifted to 86.7% [70.3, 94.7] by the institutional-authority operator; N=30/arm; deterministic judge; JSON-encapsulation negative control 0% lift | campaign_manifest.json, PI-20260609, results + diagnosis |
| F46-20260604 | llama-3.3-70b-versatile | Recovery-penalty calibration: baseline ASR 0.1444 (130/900) reduced to 0 at optimum mu=1.0/gamma=0.85; Cohen h=0.78 (recomputed 0.7797); all 15 conditions significant (Bonferroni); 14400 evals; deterministic judge | campaign_manifest.json, F46-20260604, diagnosis + params |
| F46-REPL-20260609 | openai/gpt-oss-120b | Directional replication: baseline 0.2022 [0.1773, 0.2297] to 0.0144 at optimum (mu=1.0, gamma=1.0); h=0.6919; 12/15 significant; nuances: mu=0.01 counterproductive (ASR 0.27-0.29), gamma=0.70 ineffective (0.1889 n.s.) | campaign_manifest.json, F46-REPL-20260609, diagnosis |

By contrast, the corpus documents no N, no confidence intervals and no correction procedure for ARMs, AutoAdv, GenBreak or GPTFuzzer (per P151 fiche), and only point ASRs for Mastermind (60% GPT-5, 89% R1, D-020). This is a statement about what the corpus records, not about what those papers may contain beyond it. [SYNTHESIS]

---

## 5. Ready-to-use formulations for the manuscript

Each sentence below is HUMILITY GATE-compliant and can be pasted as-is.

**F-1 (Ch.2, state of the art).** "Algorithmic red teaming has consolidated around a three-component architecture — an attack model generating probes, a judge model evaluating responses, and a target model under test (Srivastava et al., 2026, arXiv:2602.21267 [PREPRINT], Section 2.3, p.15) — with autonomous instantiations including GPTFuzzer (Yu et al., 2023, arXiv:2309.10253), AutoAdv (Reddy et al., 2025, arXiv:2507.01020), GenBreak (Wang et al., 2025, arXiv:2506.10047) and ARMs (Chen et al., 2025, arXiv:2510.02677), all cited via Srivastava et al. (2026), as well as AutoRedTeamer (Zhou et al., 2025, arXiv:2503.15754) and Mastermind (Ren et al., 2026)."

**F-2 (Ch.2, positioning).** "Among the autonomous red-teaming approaches identified in corpus P001-P155 as of 2026-06-13, AEGIS is distinguished not by automation as such but by its target system and validation regime: a medical surgical LLM agent for the Da Vinci Xi robot, evaluated under FDA 510(k)-anchored biomechanical output constraints (D-029), with N >= 30 trials per condition and Wilson 95% confidence intervals (campaign_manifest.json [EXPERIMENTAL])."

**F-3 (Ch.7, judge choice).** "AEGIS adopts a deterministic judge because the fragility of LLM judges is documented: modest perturbations to output style can shift a safety judge's false-negative rate by up to 0.24, and in extreme cases cause 100% of harmful generations to be misclassified as safe (Eiras et al., 2025, arXiv:2503.04474 [ARTICLE VERIFIE], as synthesized in Srivastava et al., 2026, Section 2.5, p.19), convergent with the 99% verdict-flip rate documented in P044."

**F-4 (Ch.7, reproducibility).** "Since ASR is session-specific and 'for auditability purposes may not be reproducible' (Srivastava et al., 2026, Section 2.1, p.5), AEGIS reports interval estimates rather than point claims — for example ASR 6.75% (Wilson 95% CI [5.46, 8.31], 81/1200 trials, llama-3.1-8b-instant) versus 5.17% ([4.05, 6.57], 62/1200, llama-3.3-70b-versatile) on the identical 40-chain protocol (FC-20260409 [EXPERIMENTAL]) — and treats cross-model transfer as an empirical question rather than an assumption."

**F-5 (Ch.7, δ³ positioning).** "AEGIS is at minimum the eighth known public implementation of the δ³ output-validation pattern (D-029; from LMQL, 2022, to RAGShield, 2026) and, within corpus P001-P155 as of 2026-06-13, the first identified that specializes this pattern for surgical robotics with FDA 510(k) biomechanical constraints; the originality is the domain specialization, not the pattern."

---

## 6. References

**Corpus papers**

- **P151** — Srivastava, Janardhan & Jauhari (2026). *A Systematic Review of Algorithmic Red Teaming Methodologies*. arXiv:2602.21267. [PREPRINT VERIFIE] — read in fulltext (39 pages). Fiche: `doc_references/2026/benchmarks/P151_Srivastava_2026_AlgorithmicRedTeamingSurvey.md`.
- **P153** — Eiras et al. (2025). *Know Thy Judge*. arXiv:2503.04474. [ARTICLE VERIFIE] — ICBINB@ICLR 2025. Fiche: `doc_references/2025/benchmarks/P153_Eiras_2025_KnowThyJudge.md`. Integrated 2026-06-10 (RR-RUN10-002).
- **P096** — Ren et al. (2026). *Mastermind*. In corpus; evidence recorded in D-020 and D-021 (`discoveries/DISCOVERIES_INDEX.md`).
- **P044** — Corpus paper documenting the 99% LLM-judge verdict-flip rate (cited in `.claude/rules/redteam-analysis.md` and in the P151 fiche as convergent external corroboration).

**Discovery records**

- **D-021** — Self-evolving adversarial knowledge repository (P096 Mastermind); HUMILITY GATE reformulation 2026-05-16 ("among the first", persistent-memory subfamily; AutoRedTeamer precedent). `discoveries/DISCOVERIES_INDEX.md`.
- **D-029** — δ³ pattern academically established since 2022; ordered list of 7+ public implementations (LMQL P134, Guardrails AI P132, LLM Guard P133, CaMeL P081, AgentSpec P082, LlamaFirewall CodeShield P084, RAGShield P066); AEGIS = first medical-surgical specialization, at minimum 8th public implementation. CANDIDATE, confidence 9/10. `discoveries/DISCOVERIES_INDEX.md`, VERIFICATION_DELTA3_20260411.

**External systems cited via P151 [cited via P151 — not in corpus as standalone P-IDs]**

- ARMs — Chen, Liu, Kang et al. (2025). arXiv:2510.02677. [PREPRINT] (P151 ref 54).
- AutoAdv — Reddy, Zagula & Saban (2025). arXiv:2507.01020. [PREPRINT] (P151 ref 46).
- GenBreak — Wang et al. (2025). arXiv:2506.10047. [PREPRINT] (P151 ref 53).
- AutoRedTeamer — Zhou et al. (2025). arXiv:2503.15754. [PREPRINT] — mapped to the P151 corpus record via its disambiguation note; NOT cited by the survey text; corpus knowledge via D-021 (recorded there as "OpenReview 2025, anonymous submission").
- GPTFuzzer — Yu et al. (2023). arXiv:2309.10253. [PREPRINT] (P151 ref 50) — cited via P151, not in corpus as a standalone P-ID.

**AEGIS experimental campaigns [EXPERIMENTAL]** (all from `research_archive/experiments/campaign_manifest.json`, last updated 2026-06-10)

- FC-20260409 — runs 2-4; results: `results/campaign_thesis_20260409_093451.json` (run 2), `results/campaign_thesis_20260409_141438.json` (run 3); report: `experiments/EXPERIMENT_REPORT_FC20260409.md`.
- FC-20260410 — results: `results/campaign_thesis_20260410_134913.json`; report: `experiments/EXPERIMENT_REPORT_FC20260410.md`; attribution ablation: `EXPERIMENT_REPORT_RR-FC-001.md`.
- PI-20260609 — results: `payload_improve/improve_full_latest_summary.json`; report: `EXPERIMENT_REPORT_payload_improve_template01_20260609.md`.
- F46-20260604 — results: `backend/experiments/results/f46_calibration_results_llama70b.json`; reports: `EXPERIMENT_REPORT_F46.md` + `experiments/EXPERIMENT_REPORT_F46_ADDENDUM.md`. Cross-validated 2026-06-10 [CALCUL VERIFIE per manifest notes].
- F46-REPL-20260609 — results: `backend/experiments/results/f46_calibration_results.json`; report: `experiments/EXPERIMENT_REPORT_F46_ADDENDUM.md`, Section 2.

**Internal governance documents**

- `.claude/rules/doctoral-research.md` — HUMILITY GATE rule (2026-04-12) and documented failure mode (D-021 refuted by AutoRedTeamer; 3.4% discovery-claim false-positive rate).
- `research_notes/AEGIS-AUDIT-HUMILITY-GATE_2026-05-21.md` — audit establishing the conformant formulation models reused here (THESIS_GAPS.md:367; TRIPLE_CONVERGENCE.md:240).
- `doc_references/prompt_analysis/research_requests.json` — RR-RUN10-001 (this note), RR-RUN10-002 (P153 integration).

---

*End of note. Produced under RR-RUN10-001; supersession or update requires a new STEP 0 dedup pass and a fresh corpus-scope date.*
