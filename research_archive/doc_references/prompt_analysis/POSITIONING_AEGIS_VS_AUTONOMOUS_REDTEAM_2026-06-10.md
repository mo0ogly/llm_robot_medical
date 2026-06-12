# Competitive Positioning Note — AEGIS vs Autonomous Red Teaming

> **Research Request**: RR-RUN10-001 (DIRECTOR_BRIEFING_RUN010, processed 2026-06-09)
> **Authoritative source**: P151 — Srivastava, Janardhan & Jauhari (Infosys Responsible AI Office), 2026,
> "A Systematic Review of Algorithmic Red Teaming Methodologies", arXiv:2602.21267 [PREPRINT VERIFIE — SURVEY]
> Fiche: `research_archive/doc_references/2026/benchmarks/P151_Srivastava_2026_AlgorithmicRedTeamingSurvey.md`
> Fulltext read via pypdf: `research_archive/literature_for_rag/P151_Srivastava_2026_AlgorithmicRedTeamingSurvey.pdf` (39 pages)
> **Anti-duplication decision (RUN-010)**: ARMs (arXiv:2510.02677), AutoAdv (arXiv:2507.01020), GenBreak
> (arXiv:2506.10047) are documented INSIDE P151. P151 is cited as the authoritative source; no new P-IDs created.
> **HUMILITY GATE**: this note contains ZERO absolute-priority claim. See Section 3.
> **Date**: 2026-06-10 — Agent: ANALYST (RR-RUN10-001)

---

## 1. Competitive landscape per P151

P151 defines algorithmic red teaming as a triad — attack model / judge model / target model — "guided by an
objective defined by the ethical tester" (P151, Section 2.3, p.15), and documents the field's progression from
stand-alone LLM probing to stateful, tool-using agents (P151, Section 2.6, p.19-20). The systems below are
those P151 itself surveys; AutoRedTeamer is added from the AEGIS discovery record because P151 does NOT cite it.

| System | Mechanism (per P151) | Target | ASR reported in P151 | P151 ref |
|--------|---------------------|--------|---------------------|----------|
| **ARMs** (Chen, Liu, Kang et al. 2025, arXiv:2510.02677) | "a plug-and-play adaptive agent that orchestrates 10+ multimodal strategies (e.g., reasoning hijacking, contextual cloaking), explores with epsilon-greedy search, and logs diverse failures at scale" | Multimodal models (VLMs), open and closed | No numeric ASR; qualitative only — "reporting large uplifts in attack success and breadth across VLMs" | Section 2.6, p.20, ref 54 |
| **AutoAdv** (Reddy, Zagula, Saban 2025, arXiv:2507.01020) | Automated multi-turn framework that "repeatedly rephrase[s], disguise[s], and refine[s] an attack within a dialogue" | LLM chat (multi-turn jailbreak) | No numeric ASR; "achieving markedly higher ASR than single-turn baselines and revealing failure modes invisible to one-shot tests" | Section 2.5, p.17, ref 46 |
| **GenBreak** (Wang et al. 2025, arXiv:2506.10047) | "fine-tunes a red-team LLM via supervised signals and RL against a surrogate generator to find prompts that are both harmful and filter-evasive" | Text-to-image generators | No numeric ASR in P151 | Section 2.6, p.19, ref 53 |
| **GPTFuzzer** (Yu et al. 2023, arXiv:2309.10253) | Auto-generated jailbreak prompts; per P151 body, "some approaches pool probes from the responses of the target model" (feedback-driven probe generation) | LLMs (text jailbreak) | No numeric ASR in P151 | Section 2.6, p.19, ref 50 |
| **AutoRedTeamer** (anonymous, OpenReview 2025, arXiv:2503.15754) | Autonomous red-team agent with persistent attack memory, conceptually close to Mastermind/P096 (D-021 reformulation, 2026-05-16) | LLMs | **Not covered by P151** (zero occurrences in fulltext; verified 2026-06-10) | Source: `DISCOVERIES_INDEX.md`, D-021 HUMILITY GATE reformulation |

Cross-cutting findings from P151 relevant to any comparison:
- Adaptive attackers "bypass a broad set of recent defenses with > 90% ASR, despite those defenses reporting
  near-zero ASR under static evaluations" (P151, Section 2.5, p.17-18).
- LLM-as-judge fragility: "modest perturbations to output style and targeted adversarial manipulations can shift
  a safety judge's false-negative rate by up to 0.24 on the same data, and in extreme cases, cause 100% of harmful
  generations to be misclassified as safe" (P151, Section 2.5, p.19, citing Eiras et al., ref 48, arXiv:2503.04474).
- ASR is "session-specific, and for auditability purposes may not be reproducible"; P151 distinguishes
  positive ASR (contextually aligned probes) from negative ASR (P151, Section 2.1, p.5).
- "Gen AI red-teaming is currently fragmented and lacks standardized methodologies. Most efforts focus narrowly
  on prompt-based jailbreaks and adversarial attacks, with limited threat modeling and inconsistent evaluation
  metrics" (P151, Section 2.3, p.14, summarizing the SEI report).
- Healthcare named as a critical domain for agentic red teaming: "agentic workflows were exercised for unsafe
  tool use or goal hijack, especially in critical domains like healthcare" (P151, Section 2.7.4 EU AI Act, p.24).

## 2. AEGIS differentiators (factual, with sources)

AEGIS instantiates the same attack/judge/target triad that P151 identifies as the canonical architecture
(P151, Section 2.3, p.15): RedTeamAgent (attack) / deterministic δ³ judge (judge) / MedicalRobotAgent (target).
Its differentiation is by specialization and judge design, not by claimed novelty of autonomy.

1. **Surgical-medical domain specialization (Da Vinci Xi)**. The target is a medical robotic LLM agent whose
   output specification (AllowedOutputSpec) encodes "bornes biomecaniques FDA 510k K183303, phase chirurgicale,
   outils interdits" (`FORMALISATION_ASR_DETERMINISTIC.md`, Section 2). None of the P151-surveyed systems
   (ARMs, AutoAdv, GenBreak, GPTFuzzer — P151 Sections 2.5-2.6) targets a regulated surgical-robotics
   application; P151 itself flags healthcare as a critical domain requiring such exercising (Section 2.7.4, p.24).
2. **Non-circular deterministic judge — F73 (ASR_deterministic)**. The verdict is computed by 8 deterministic
   δ³ adapters (Outlines, Guardrails, LLM Guard, CaMeL, AgentSpec, LlamaFirewall, RAGShield, AEGIS) using
   "regex / FSM / JSON-schema / capability-checking, sans aucun appel LLM"
   (`FORMALISATION_ASR_DETERMINISTIC.md`, Section 2; RR-P0-003 RESOLVED, `RESEARCH_STATE.md` line 82).
   This directly addresses the judge-fragility failure mode P151 documents (FNR shift up to 0.24, up to 100%
   misclassification — P151, Section 2.5, p.19) and the 99.91% zero-shot judge flip rate established by P044
   (Li, Wu, Liu, Unit 42, 2025, arXiv:2512.17375; `FORMALISATION_ASR_DETERMINISTIC.md`, Section 1). P151's own
   recommendation — "multi-evaluator protocols [...] disclosure of evaluator prompts, and sensitivity analysis"
   (Section 2.5, p.19) — is satisfied by construction: deterministic adapters have no evaluator prompt to attack.
3. **Calibrated corpus**: 97 numbered attack templates (102 JSON incl. 5 config files;
   `.claude/rules/redteam-forge.md`, "Moteur genetique"), 62 scenarios (`backend/scenarios.py`,
   `/api/redteam/scenarios`) and 40 attack chains (`backend/agents/attack_chains/`, `/api/redteam/chains`)
   per the project source-of-truth table (`.claude/CLAUDE.md`, "Source de verite").
4. **Genetic engine with documented calibration and negative results**: SVC fitness over 6 dimensions
   (Zhang et al. 2025, arXiv:2501.18632v2), SVC gradient 0.5/6 to 3.5/6, floor calibration #14 (SVC 1.0) and
   sub-floor #18 (SVC 0.5), and empirically invalidated operators (fictional XML — proven regression #01→#16;
   direct negation; Hollywood cliches) (`.claude/rules/redteam-forge.md`, "Moteur genetique", rules 1-6).
   Publishing invalid operators answers P151's Goodhart warning — "pass the test but fail the goal"
   (P151, Section 4, p.29).
5. **Statistical protocol**: Sep(M) with N >= 30 per condition (Zverev et al., 2025, ICLR, P024;
   `.claude/rules/redteam-forge.md`, "Campagnes" rule 1), mandatory metrics ASR / Sep(M) / SVC / P(detect) /
   cosine drift (ibid., rule 2), Wilson CIs, and maximum 3 campaign iterations before human escalation
   (ibid., "Boucle Iterative"). This responds to P151's reproducibility caveat that "repeatability is
   fundamentally contrary to a Gen AI model's modus operandi" (P151, footnote 3, p.15).
6. **Formal δ⁰-δ³ layer framework**. P151's defense taxonomy — model-level alignment, input filtering, output
   moderation, system-level guardrails (Section 2.4, p.16) — maps one-to-one onto AEGIS layers δ⁰/δ¹/δ²/δ³
   (P151 fiche, "Pertinence these AEGIS"). P151's conclusion that "no single defense mechanism is sufficient
   against adaptive adversaries" (Section 2.4, p.16) externally supports the AEGIS multi-layer argument (C2).

## 3. Recommended manuscript phrasing (HUMILITY GATE compliant)

D-021 background: the claim "premier red team autonome" was REFUTED — AutoRedTeamer (OpenReview 2025) proposes
a conceptually close design; D-021 was reformulated on 2026-05-16 as "parmi les premiers"
(`DISCOVERIES_INDEX.md`, D-021). P151 adds at least three further autonomous/automated competitor families
(ARMs, AutoAdv, GenBreak — P151 fiche, "Concurrents AEGIS / HUMILITY GATE"). The refutation is therefore
permanent and reinforced.

**TO SAY (approved formulations):**
- "Among existing algorithmic red-teaming approaches (Srivastava et al., 2026, arXiv:2602.21267, Sections
  2.5-2.6), AEGIS is distinguished by its specialization in the surgical-medical domain (Da Vinci Xi,
  FDA 510(k) K183303 output bounds) and by its deterministic, non-circular δ³ judge (F73)."
- "AEGIS instantiates the attack/judge/target triad identified as canonical by Srivastava et al. (2026,
  Section 2.3, p.15), replacing the LLM judge — whose fragility is documented at up to 100% misclassification
  (ibid., Section 2.5, p.19) and 99.91% flip rate (P044) — with 8 deterministic δ³ adapters."
- "Autonomous and adaptive red-teaming agents are an active, multi-family research area (ARMs, AutoAdv,
  GenBreak, GPTFuzzer — Srivastava et al., 2026; AutoRedTeamer — OpenReview 2025); AEGIS extends this line of
  work toward a regulated medical-robotics target."
- "No multimodal-agent red teamer surveyed by Srivastava et al. (2026, Section 2.6) reports evaluation against
  a surgical-robotics LLM application; no such work was identified by WebSearch as of 2026-06-10 — scoped and
  dated qualification, not a priority claim."

**NOT TO SAY (banned formulations):**
- "AEGIS is the first autonomous red team" / "le premier red team autonome" (REFUTED — D-021, AutoRedTeamer).
- "AEGIS is the only system with a deterministic judge" (unverified exclusivity; P151 Section 2.5 recommends
  multi-evaluator protocols, implying others pursue judge robustness).
- "Novel", "unprecedented", "unlike any existing work", "the sole framework" — all primacy keywords blocked
  by the HUMILITY GATE (`.claude/rules/doctoral-research.md`, rule 5).
- Any direct ASR comparison such as "AEGIS achieves higher ASR than ARMs/AutoAdv" (see Section 4: P151 reports
  no comparable numeric ASR for these systems).

## 4. Limits of this comparison

1. **P151 is a survey, not a benchmark.** It is a PRISMA narrative synthesis with "no quantitative meta-analysis,
   no forest plot, no risk-of-bias assessment" (P151 fiche, "Faiblesses"; P151 Section 1, p.3 "documents the
   findings"). System descriptions are second-hand condensations of the primary papers.
2. **ASR values are not comparable across setups.** P151 itself states ASR is "session-specific, and for
   auditability purposes may not be reproducible" (Section 2.1, p.5) and distinguishes positive vs negative ASR
   by contextual alignment of probes. P151 reports NO numeric ASR for ARMs, AutoAdv, GenBreak, or GPTFuzzer
   (verified in fulltext, Sections 2.5-2.6); any head-to-head ASR table would require re-running these systems
   under the AEGIS protocol (N >= 30, deterministic judge), which has not been done.
3. **Target-class mismatch.** ARMs targets VLMs, GenBreak targets text-to-image generators (P151, Section 2.6,
   p.19-20); AEGIS targets a text-based medical agentic pipeline. Differential ASR may reflect target class
   rather than attacker quality.
4. **P151 corpus bias.** arXiv was deliberately excluded from the systematic search (P151, Section 3, p.27)
   while many cited works are arXiv preprints — an acknowledged inconsistency (P151 fiche, "Faiblesses") that
   may under-represent the most recent autonomous red-teaming systems (e.g., AutoRedTeamer is absent).
5. **Descriptions of competitors are NOT independently re-verified.** Per the RUN-010 anti-duplication decision,
   ARMs/AutoAdv/GenBreak primary papers were not re-fetched; all characterizations above are bounded by P151's
   accuracy. If a manuscript chapter needs primary-source detail on one of them, a scoped
   `/bibliography-maintainer` verification (with `check_corpus_dedup.py` Step 0) is required first.
6. **F73 properties are formalized but pending experimental validation** ("Reste a valider experimentalement",
   `FORMALISATION_ASR_DETERMINISTIC.md`, header) — the judge-robustness differentiator is architectural
   [THEOREME for properties (a)(b)(c)] but its end-to-end campaign advantage is [EXPERIMENTAL] pending.

---
*Generated by ANALYST agent, RR-RUN10-001, 2026-06-10. Sources: P151 fulltext (pypdf, 39 pages) + fiche P151 +
`RESEARCH_STATE.md` + `DISCOVERIES_INDEX.md` + `FORMALISATION_ASR_DETERMINISTIC.md` + `.claude/rules/redteam-forge.md`.*
