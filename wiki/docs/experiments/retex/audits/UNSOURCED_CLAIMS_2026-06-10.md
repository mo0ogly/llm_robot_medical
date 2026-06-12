# V2 — Sourcing Linter Report — 2026-06-10

> **Auditor**: ANALYST (audit-these v2.1)
> **Tool**: `.claude/skills/audit-these/scripts/lint_sources.py` (run as-is on `_staging/analyst/`, driven programmatically on `doc_references/`)
> **Raw evidence**: `_v2_docrefs_issues.json` (same directory — full per-file issue list, 273 entries)
> **Note**: the linter emits only the NONE confidence category (no inline ref in the line nor in the +/-2 line context). MEDIUM/HIGH-confidence findings are silently discarded by the script, so a separate "LOW" rate is NOT computable with the current tooling — see Anomaly A2.

## 1. Global statistics

| Corpus | Files | Claims | NONE | % NONE | Threshold (<2% PASS, >5% FAIL) |
|--------|-------|--------|------|--------|-------------------------------|
| `_staging/analyst/P*_analysis.md` (script default) | 135 | 918 | 100 | **10.9%** | **FAIL** |
| `doc_references/2022-2026/**.md` (mission scope) | 168 | 1109 | 273 | **24.6%** (raw) | **FAIL** (raw) |

The 24.6% raw figure on `doc_references/` is inflated by linter false positives (see Section 3): the `REF_PATTERN` regex does not recognize `(Abstract)` as an inline source, nor analyst-authored critique sentences ("Faiblesses", "Questions ouvertes") that legitimately contain numbers already sourced 1-3 lines above. Manual sampling on the 7 most recent files (P146-P152) measured a false-positive rate of 4/4 on the only file flagged (P152). The true unsourced rate is therefore lower than 24.6%, but cannot be certified < 5% without fixing the linter — verdict remains FAIL pending tooling fix.

## 2. Recent files P146-P152 (mission focus)

| File | Claims | NONE (raw) | NONE (after manual review) | Verdict |
|------|--------|-----------|---------------------------|---------|
| `2023/prompt_injection/P146_Greshake_2023_IndirectPromptInjection.md` | 4 | 0 | 0 | PASS |
| `2024/benchmarks/P147_Liu_2024_FormalizingBenchmarkingPI.md` | 3 | 0 | 0 | PASS |
| `2024/prompt_injection/P148_Liu_2024_AutomaticUniversalInjection.md` | 11 | 0 | 0 | PASS |
| `2024/defenses/P149_Pape_2024_PromptObfuscation.md` | 5 | 0 | 0 | PASS |
| `2026/defenses/P150_Zhao_2026_SafetyKnowledgeNeurons.md` | 13 | 0 | 0 | PASS |
| `2026/benchmarks/P151_Srivastava_2026_AlgorithmicRedTeamingSurvey.md` | 9 | 0 | 0 | PASS |
| `2025/mcp_security/P152_Li_2025_MCPFirstLook.md` | 5 | 4 | **0 (4 false positives)** | PASS |

P152 detail (manual review of the 4 flags):
- L18 "833 serveurs vulnerables (1,24%)" — sourced inline as `(Abstract)` twice; `(Abstract)` is not in `REF_PATTERN` → false positive.
- L19 "taux de faux positifs/negatifs inconnus" — limitation statement explicitly qualified "n'est pas precise dans l'abstract" → false positive.
- L24 "67 057 serveurs analyses" — sourced inline as `(Abstract)` → false positive.
- L31 "833/67057 = ~1,24%" — analyst's own critique restating a figure sourced at L18/L57 → false positive.

**The P146-P152 batch is clean: 0 genuinely unsourced claims.**

## 3. Top 10 most problematic files (doc_references, raw NONE count)

| # | File | NONE/Claims | Example lines (verbatim, truncated) |
|---|------|------------|--------------------------------------|
| 1 | `2025/methodology/M009_ResearchBench_2025_InspirationDecomposition.md` | 18/21 | L25 "1386 papiers (2024), 12 disciplines"; L38 "91.9% de precision" — no inline (Section/Table/p.) refs |
| 2 | `2025/medical_ai/P030_DecliningMessaging_2025_Longitudinal.md` | 14/22 | L49 "R2 = 0.944, p = 0.028"; L53 "chi2 = 266.03, p < 0.00001" — stats block without per-line refs |
| 3 | `2025/methodology/M006_AgentReview_2024_PeerReviewSimulation.md` | 12/22 | L26 "37,1 % de variation"; L68 "27,2 % de reduction de l'ecart-type" |
| 4 | `2025/methodology/M007_MLRCopilot_2024_AutonomousMLResearch.md` | 12/18 | L27 "Claude-3.7 50.0%, GPT-4 40.0%"; L60-61 per-model rates without table refs |
| 5 | `2026/prompt_injection/P044_Unit42_2026_AdvJudgeZero.md` | 11/28 | L40 "LoRA (r=4, alpha=16, dropout 0.05)"; L42 "FPR chute de 96-99% a 2-6%" |
| 6 | `2026/medical_ai/P040_Zahra_2026_HealthcareMisinformation.md` | 10/17 | L18 "MR_baseline = 6.2%, MR_PI = 18.8%"; L69 "MR_baseline = 6.2%" |
| 7 | `2025/medical_ai/P029_JAMA_2025_MedicalInjection.md` | 8/33 | L86 "= 0.45 (45% de surcout)"; L89 "ASR_gen = 65% est estimee" (this one IS qualified — borderline FP) |
| 8 | `2025/methodology/M005_agentRxiv_2025_CumulativeLearning.md` | 8/21 | L35 "+11.4% relatif"; L37 "+3.3% en moyenne" |
| 9 | `2026/prompt_injection/P036_Hagendorff_2026_LRMJailbreak.md` | 8/20 | L23 "ASR global = 97.14%"; L24 "DeepSeek-R1 : 90% ASR (IC 95%: 80.77%-95.07%)" |
| 10 | `2025/methodology/M008_ScienceAgentBench_2024_RigorousAssessment.md` | 7/12 | L115 "acceptance rate ~30 %"; L27 best-agent result without table ref |

Pattern: the M-series methodology files (M005-M009, written for MC conjectures) concentrate 57 of the 273 raw NONE flags — they systematically cite figures without `(Section X, Table Y, p. Z)` inline references. This is the highest-value remediation batch.

## 4. Anomalies

- **A1 — Linter REF_PATTERN gap**: `(Abstract)` is a legitimate inline source for abstract-only analyses (P152 pattern) but is not matched by `REF_PATTERN` in `lint_sources.py`. Suggested fix: add `r'\(Abstract\)'` to the pattern. Estimated impact: removes a significant share of the 273 doc_references flags.
- **A2 — No LOW category**: the script computes HIGH/MEDIUM/NONE internally but only persists NONE; the mission criterion "< 5% LOW" cannot be measured. Suggested fix: persist MEDIUM-confidence issues as LOW.
- **A3 — Script default scope**: `lint_sources.py` without `--file` only scans `_staging/analyst/`, not `doc_references/` (the propagated, authoritative copies). The propagated corpus is audited here via a programmatic driver; consider adding a `--dir` flag.

## 5. Verdict

**V2 = FAIL** (10.9% NONE staging, 24.6% raw / >5% estimated true rate on doc_references) — unchanged vs audit 2026-06-09 (10.9%). The recent batch P146-P152 is PASS (0 real unsourced claims). Remediation priority: M005-M009 methodology files, then P030/P040/P044 stat blocks.
