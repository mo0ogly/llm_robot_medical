# LIBRARIAN Maintenance Report — 2026-06-16

**Scope**: index/metadata housekeeping only. No paper added, no STEP-0 dedup run (no new references).
**Requests resolved**: RR-RUN10-004 (partial), RR-MAINT-001 (resolved).
**Files touched**: `doc_references/MANIFEST.md`, `doc_references/ARTICLES_INDEX.md`, `doc_references/prompt_analysis/research_requests.json`.
**Method**: P-IDs enumerated by script over MANIFEST table rows (`^|Pxxx|`), `doc_references/**/P*.md`, and `literature_for_rag/P*.pdf`. No sensitive source file read (scenarios.py / attack_catalog.py / prompts/*.json / chains untouched).

---

## RR-RUN10-004 — Identifier audit + MANIFEST reconciliation

### 1. Identifiers without arXiv/DOI
The header documented 10 such rows. Re-validated against the live Table Centrale:

- **9 intentionally identifier-less** — all present, all correctly identifier-less by source type. No change:
  - P016 (UC Berkeley EECS-2024-84 technical report)
  - P033, P055 (HiddenLayer / Snyk Labs blog posts)
  - P058 (ETH Zurich MSc thesis)
  - P086 (UC Berkeley preprint URL)
  - P122, P123 (OWASP Cheat Sheet / Top-10 pages)
  - P132, P133 (Guardrails AI / LLM Guard GitHub repos)
- **P040 — residual debt (NOT resolved).** MANIFEST line: *"Prompt Injection is All You Need: Healthcare Misinformation", Zahra & Chin, 2026, Springer LNCS (AI in Healthcare)*. ARTICLES_INDEX gives the fuller title *"... Evaluating Healthcare Misinfo[rmation]"*. Four WebSearch queries (title + authors + "Springer LNCS 16038, 2026") on 2026-06-16 returned **no verifiable DOI/arXiv** — the LNCS volume is forthcoming and not yet indexed by search engines. Per the anti-hallucination / humility rule, **no identifier was fabricated**. Action: retry when the Springer chapter DOI is published. Dedup-risk note recorded in MANIFEST: P040 has no arXiv pattern, so `check_corpus_dedup.py` cannot guard it — use `--title` for any future Zahra/Chin candidate.

### 2. Count reconciliation (old -> new)
- **Old header claim**: "174 rows (P001-P174)" — this was a *max-id* artefact, not a row count.
- **Recounted (script)**: **166 rows present = 166 distinct** (0 in-table duplicates).
- Numbering runs P001-P174 (max id P174) with **8 unused IDs**:
  - Merged duplicates (2026-06-03): **P052**->P019, **P071**->P027, **P085**->P002, **P108**->P050
  - Stub merged into P028: **P074**
  - Pure numbering gaps, never assigned (no row, no fiche, no PDF): **P088, P105, P106**
- Sanity: 127 distinct @ RUN-007 + RUN-008..012 additions (P128-P130, P136-P155, P156-P174) − 4 merges = **166**. Consistent.
- Header lines updated: title `(127 distinct papers)` -> `(166 distinct papers)`; "Total Papers Indexed" line rewritten with the recount + the 8-unused-ID breakdown; new "Identifier re-audit (2026-06-16)" line; Coverage Summary given a STALE banner (see §4). Merge notes and the P074/P028 note preserved verbatim.

### 3. Disk vs MANIFEST desync scan
Computed set differences between MANIFEST table P-IDs (166), disk fiches (170 distinct `P*.md`), and disk PDFs (134 distinct `P*.pdf`).

- **(a) Fiches on disk ABSENT from MANIFEST table (4)** — all are the documented merge stubs, left in place intentionally (not deleted):
  - `2026/model_behavior/P052_rlhf_alignment_shallow.md` (merged -> P019)
  - `2025/medical_ai/P071_Wang_2025_MedicalAISecurity.md` (merged -> P027)
  - `2025/defenses/P085_Hossain_2025_MultiAgentDefense.md` (merged -> P002)
  - `2025/model_behavior/P108_Liu_2025_JMedEthicBench.md` (merged -> P050)
  - (PDF stubs likewise present off-table: P052, P071, P074, P085, P108.)
- **(b) MANIFEST rows WITHOUT a fiche on disk: 0.** Every indexed paper has a fiche. Clean.
- **(b2) MANIFEST rows WITHOUT a PDF on disk: 37** (P029 JAMA paywall, P033 blog, P122/P123 OWASP, and not-yet-downloaded preprints P087/P089-P104/P140-P145/P152/P154/P155 etc.). Reported for awareness only — PDF-completeness audit was **not** in scope and nothing was changed.

**Verdict**: no actionable desync. The only off-table disk files are the 4 (+P074) documented merge stubs. Nothing created or deleted.

### Status: **PARTIAL** — reconciliation + disk scan complete; P040 identifier unresolved (external blocker, Springer LNCS not yet indexed).

---

## RR-MAINT-001 — ARTICLES_INDEX.md

### Nature & freshness
`doc_references/ARTICLES_INDEX.md` is a flat counting index: (ID, Title, Year, Domain, PDF-link, RAG-status). Header frozen at "60 papiers | 75 PDFs telecharges | 2026-04-04". It lists only ~59 rows (stops at P059) of the 166 in MANIFEST.

### Decision: **DEPRECATED** (least-destructive)
Justification:
- Its columns are a strict subset of MANIFEST.md (the source of truth), **except** the PDF-link + RAG-status view.
- That unique view is itself badly stale — frozen at P059, missing 107 newer papers — so it is not a reliable artefact. The live PDF inventory is the `literature_for_rag/` directory (134 PDFs on disk, 2026-06-16); the RAG state lives in ChromaDB.
- Regenerating it from MANIFEST would either (i) drop the PDF/RAG columns (making it a pure MANIFEST duplicate) or (ii) require re-deriving PDF/RAG status for 166 rows (out of scope, error-prone). Deprecation preserves provenance without risk.

Action: added a clear `⚠ DEPRECATED (2026-06-16)` banner at the top pointing to **MANIFEST.md** (single source of truth, 166 distinct) + **INDEX_BY_DELTA.md** (δ-layer view) + `../literature_for_rag/` (live PDF inventory). The original stale header is retained verbatim beneath the banner. **No historical content removed.**

### Status: **RESOLVED**.

---

## Finalization checks
- `MANIFEST.md` table integrity: 166 `|Pxxx|` rows, 0 in-table duplicates (script-verified).
- `research_requests.json`: re-parses with `json.load` (55 requests, top keys intact, trailing PDCA notes intact). RR-RUN10-004 -> `partial`, RR-MAINT-001 -> `resolved`, `last_updated` = 2026-06-16. Diff contained to the two entries (12 insertions / 7 deletions).
- No commit performed (left to the orchestrator).
