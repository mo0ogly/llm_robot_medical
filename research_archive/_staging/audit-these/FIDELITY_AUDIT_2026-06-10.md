# FIDELITY AUDIT — V4 (Fidelity Verifier) — 2026-06-10

**Scope**: P146, P147, P148, P149, P150, P151 (6 most recent analyses, read on 2026-05-31)
**Method**: numeric claims extracted from each analysis (`doc_references/`), verified against PDF fulltext.
**Source of truth**: ChromaDB has NO `paper_fulltext` chunks for P146-P151 (see Anomaly A1). Fallback used: direct pypdf extraction of `literature_for_rag/P14x_*.pdf` / `P15x_*.pdf` (evidence files in `_tmp_fulltext/P14x.txt`). Exact-match regex search with surrounding context.
**Tolerance**: exact match required for cited values (±0.5% allowed, not needed — all matches exact).

## Verdict table

| # | Paper | Claim (as cited in analysis) | Cited value | Chunk found (extract, <=200 chars) | Verdict |
|---|-------|------------------------------|-------------|-------------------------------------|---------|
| 1 | P146 | Quote impossibility result (Section 5.6) | "impossibility of defending against all undesired behaviors by alignment or RLHF" | "Some recent theoretical work [80] shows the impossibility of defending against all undesired behaviors by alignment or RLHF." | FIDELE |
| 2 | P146 | Quote injection persistence (lignes 608-609) | "the model retains the injection consistently throughout the conversation session" | "...in most cases, the model retains [footnote 5 interleaved by PDF extraction] the injection consistently throughout the conversation session." | FIDELE |
| 3 | P146 | Code URL (ligne 153) | github.com/greshake/llm-security | "1https://github.com/greshake/llm-security" | FIDELE |
| 4 | P147 | ASV/MR mean over 10 LLMs, 7x7 combos (Section 6.2, p.9) | ASV=0.62, MR=0.78 | "ASV and MR averaged over the 10 LLMs and 7x7 target/injected task combinations are 0.62 and 0.78, respectively." | FIDELE |
| 5 | P147 | Pearson correlation ASV vs model size (Section 6.2, p.9) | 0.63 | "the Pearson correlation between average ASV (or MR) and model size in Figure 3 is 0.63 (or 0.64)" | FIDELE |
| 6 | P147 | Pearson correlation MR vs model size (Section 6.2, p.9) | 0.64 | same chunk as #5 — "is 0.63 (or 0.64)" | FIDELE |
| 7 | P147 | Table 4 GPT-4 ASV per attack (p.9) | Naive 0.62, Escape 0.66, Context Ignoring 0.65, Fake Completion 0.70, Combined 0.75 | "The LLM is GPT-4. Naive Attack Escape Characters Context Ignoring Fake Completion Combined Attack 0.62 0.66 0.65 0.70 0.75" | FIDELE |
| 8 | P148 | 5 training samples = 0.3% of test data (Abstract, Section 3.2) | 0.3% | "With only five training samples (0.3% relative to the test data)" + "five training samples, which is only 0.3% of the testing data" | FIDELE |
| 9 | P148 | ASR static AVG KEY-E (Table 1 OURS/STATIC; Table 2) | 0.81 (81%) | Table 1: "OUS STATIC 0.84 - 0.92 - 0.96 - 0.72 - 0.94 - 0.92 - 0.36 - 0.81 -" ; Table 2: "M-GCG (OURS) 0.81 - 0.37 0.35 0.39 0.34" ; text: "above 80% ASR on the static objective" | FIDELE |
| 10 | P148 | M-GCG improvement vs GCG (Table 2, Section 3.3) | 21% | "our method secures an average improvement of 21% on various objectives compared to the original GCG" | FIDELE |
| 11 | P148 | Defenses: drop / adaptive recovery (Section 3.4) | -32% without adaptive, 85% recovery with EOT | "experienced a 32% performance drop when confronted with defense mechanisms without an adaptive strategy... recovered to 85% of its original performance upon utilizing an adaptive scheme" | FIDELE |
| 12 | P149 | Extraction on obfuscated prompt (Section 6.1, p.10) | 0/105 attack queries | "none of the 105 attack queries were able to recover any part of the obfuscated system prompt across the datasets" | FIDELE |
| 13 | P149 | Pirate style conventional prompt leak (Table 7, p.10) | 15.50 exact / 27.25 approx | "the attacks targeting the 'pirate' style prompt yielded 15.50 exact matches and 27.25 approximate matches (out of 105 attack attempts per dataset)" + Table row "pirate 15.50 27.25 0.00 0.00" | FIDELE |
| 14 | P149 | CNN/DailyMail Full BLEU (Table 4, p.9) | blank 13.79 -> obf 46.57 vs original 42.39 | Table row: "BLEU (up) 18.07 40.32 37.06 17.51 40.60 35.95 41.94 55.16 48.92 13.79 46.57 42.39 ..." | FIDELE |
| 15 | P149 | CNN/DailyMail Full Cosine (Table 4, p.9) | 0.63 -> 0.85 vs 0.83 | Table row: "Cosine (up) 0.73 0.82 0.80 0.69 0.82 0.80 0.85 0.87 0.86 0.63 0.85 0.83 ..." | FIDELE |
| 16 | P149 | LoRA adapter storage overhead (Section 5.4) | ~328x larger | "the finetuned adapters are approximately 328 times larger than the corresponding obfuscated soft prompt embeddings" | FIDELE |
| 17 | P150 | ActCali mean ASR (Abstract; Section 4.2) | > 97% | "control the models behavior with a mean ASR higher than 97%" + "our method achieves over 97% mean ASR" | FIDELE |
| 18 | P150 | Parameters modified by ActCali (Section 1; 4.1) | 0.3% | "near-perfect attack success rates with only modifying 0.3% parameters" + "a total parameter change of about 0.3%" | FIDELE |
| 19 | P150 | SafeTuning ASR reduction (Section 5.3) | > 90% | "Our results show that SafeTuning can mitigate over 90% of ASR." | FIDELE |
| 20 | P150 | Table 1 ActCali ASR detail (p.1893) | Vicuna 100% (AdvBench) / 92% (AlpacaEval); Llama2 99% / 100% | "ActCali 100% 4.62 7.07 92% 3.00 7.25 Llama2 ..." and "ActCali 99% 4.01 8.00 100% 3.02 7.20 Table 1" | FIDELE |
| 21 | P150 | Table 2 SafeTuning detail (p.1894) | Vicuna GCG 33%->0%, Prompt with RS 95%->13%, Win Rate 54.1% vs 61.5%; Llama2 60.0% vs 58.6% | "Vicuna No Defense 61.5% 33% ... 95% 4.64 ... SafeTuning 54.1% 0% 1.00 5% 1.12 13% 1.46 0% 1.00 Llama2 No Defense 58.6% ... SafeTuning 60.0% 1% 1.02 0% 1.00 1% 1.04 0% 1.00" | FIDELE |
| 22 | P151 | Adaptive attackers bypass defenses (Section 2.5, p.17-18) | > 90% ASR | "set of recent defenses with > 90% ASR, despite those defenses reporting near-zero ASR under static evaluations" | FIDELE |
| 23 | P151 | Judge FNR shift / misclassification (Section 2.5, p.19) | up to 0.24; 100% misclassified as safe | "can shift a safety judge's false-negative rate by up to 0.24 on the same data, and in extreme cases, cause 100% of harmful generations to be misclassified as safe" | FIDELE |
| 24 | P151 | Regression R2 per database (Section 3, p.27) | Google Scholar 0.9644, WoS 0.8719, ACM "0.08840" (flagged as probable typo by analysis) | "an R 2 value of 0.9644 ... ACM (R2 = 0.08840) and Web of Science (R2 = 0.8719) also exhibit strong linear relationships" | FIDELE |
| 25 | P151 | Publication counts 2022-2025 (Figure 6) | 376 / 569 / 2,043 / 1,352 | "Publications increased from 376 in 2022 to 569 in 2023, followed by a significant jump to 2,043 publications in 2024. Although the number decreases to 1,352 publications in 2025" | FIDELE |

## Summary

| Metric | Value |
|--------|-------|
| Claims tested | 25 |
| FIDELE | 25 |
| INFIDELE | 0 |
| NON_TROUVE | 0 |
| Fidelity rate | 100% (criterion > 95%: PASS) |

Notes:
- Row 2 (P146): the verbatim quote is split in the pypdf extraction by an interleaved footnote/figure caption ("the model retains [5...] the injection consistently throughout the conversation session") — both fragments present, exact wording confirmed, not an infidelity.
- Row 24 (P151): the analysis itself flags R2 ACM = 0.08840 as a probable source typo for 0.8840; the PDF indeed publishes "0.08840" among "strong linear relationships". The analysis is faithful to the source AND correctly critical of it.

## Anomalies

- **A1 (MAJOR — RAG debt, not a fidelity error)**: no `paper_fulltext` chunks exist in ChromaDB for P146-P151 (nor for any paper beyond the 100 ingested on 2026-04-04 in `aegis_bibliography` / `aegis_corpus`). Only ANALYSIS-derived chunks (10-14 per paper) are indexed — circular for fidelity verification. This violates the doctoral rule "tout PDF telecharge -> injecte ChromaDB" and the COLLECTOR POST-INJECTION check (>= 5 fulltext chunks). Action required: run the PDF ingestion pipeline for P101-P151 PDFs present in `literature_for_rag/`.
- **A2 (MINOR)**: `.claude/skills/audit-these/scripts/verify_fidelity.py` does not exist (only `verify_citations.py`, `lint_sources.py`, `check_model_versions.py`). V4 executed manually; consider scripting this protocol.

## Evidence

- Extraction artifacts: `research_archive/_staging/audit-these/_tmp_fulltext/P146.txt` ... `P151.txt` (pypdf, 33/27/14/23/18/39 pages).
- Analyses audited: `doc_references/2023/prompt_injection/P146_*.md`, `2024/benchmarks/P147_*.md`, `2024/prompt_injection/P148_*.md`, `2024/defenses/P149_*.md`, `2026/defenses/P150_*.md`, `2026/benchmarks/P151_*.md`.
