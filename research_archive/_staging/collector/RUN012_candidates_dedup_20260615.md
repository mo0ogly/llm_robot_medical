# RUN-012 — COLLECTOR Candidates + STEP 0 Dedup

> Working artifact for the autonomous loop (bibliography-maintainer incremental).
> Produced 2026-06-15. Survives context summarization between loop wakeups.
> Corpus state at discovery: MANIFEST at P155. Next free P-ID to verify: **P156+** (confirm against MANIFEST tail at integration time).

## Method
- COLLECTOR (sonnet + WebSearch) swept prompt-injection / LLM-security literature 2026-04 -> 2026-06, prioritizing pending `RR-*` literature_search gaps.
- STEP 0 dedup run from **main tree** (current MANIFEST) via `python backend/tools/check_corpus_dedup.py <ids>`.
- Dedup correctly matched P097 + P019 -> MANIFEST is healthy (no stale-worktree false `[NEW]`).

## CAVEATS before integration (do NOT skip)
1. `[NEW]` = absent from corpus, NOT "verified to exist". COLLECTOR IDs may be hallucinated -> **WebFetch arXiv abstract page to confirm exact ID + title + authors + year before any PDF download / fiche / MANIFEST row**.
2. Year sanity: `2506.13538` (C10) = **June 2025** (2506), COLLECTOR labelled it 2026-06. Re-check.
3. Per documented failure mode (feedback_dedup_worktree_stale_manifest): cross-check filesystem by author for each `[NEW]` before assigning a P-ID.
4. ChromaDB injection on Windows has documented sandbox I/O errors (research_requests PDCA notes) -> use offline chunk-gen + ingest pattern, verify >=5 chunks per P-ID.

## Dedup verdicts

| Cand | arXiv | Verdict | Short title | Authors | Gap/RR | Year(claimed) |
|------|-------|---------|-------------|---------|--------|------|
| C01 | 2603.13026 | NEW | PISmith: RL red teaming for PI defenses | Fang et al. | Gap12 autonomous redteam | 2026-03 |
| C02 | 2603.15684 | **DUP=P097** | STAR / state-dependent multi-turn | Li | (already P097) | 2026-03 |
| C03 | 2603.10068 | NEW | ADVERSA multi-turn guardrail degradation | — | RR-RUN4-004 / D-016 | 2026-03 |
| C04 | 2605.12922 | NEW | When Attention Closes (GAR) | Dongre et al. | RR-RUN4-004 / D-016 (attention decay) | 2026-05 |
| C05 | 2605.27690 | NEW | TRACES proactive multi-turn auditing | — | RR-RUN4-004 / Gap9 | 2026-05 |
| C06 | 2605.24497 | NEW | AE-CoT reasoning jailbreaks | Li, Qin, Jia et al. | RR-RUN4-003 / C7 / fiche33 | 2026-05 |
| C07 | 2504.17704 | NEW | Safety in LRMs: a survey | Wang, Liu, Bi et al. | RR-RUN4-003 / C7 | 2025-04 |
| C08 | 2604.07536 | NEW | TRUSTDESC trusted tool descriptions (MCP) | Rostamzadeh et al. | Gap10 MCP | 2026-04 |
| C09 | 2604.07551 | NEW | MCP-DPT defense-placement taxonomy | Rostamzadeh et al. | Gap10 MCP | 2026-04 |
| C10 | 2506.13538 | NEW | MCP at First Glance (empirical 1899 servers) | — | Gap10 MCP | (2025-06!) |
| C11 | 2602.12194 | NEW | MalTool malicious tool attacks | Hu, Jia, Li, Song, Gong | RR-FA-007 / Gap9 | 2026-02 |
| C12 | 2605.28074 | NEW | SilentRetrieval RAG poisoning | Qian | fiche31 / RAG query-rewrite | 2026-05 |
| C13 | 2605.10253 | NEW | M3Att medical multimodal RAG poisoning | Yang, Zheng, Ju et al. | C6 + RAG (medical) | 2026-05 |
| C14 | 2606.00813 | NEW | Cross-generational non-monotonic safety | — | RR refus non-monotone (fiche32) | 2026-06 |
| C15 | 2606.11535 | NEW | Adversarial attacks on surgical-robot policies | Jin, Chen, Satish et al. | Gap11 Da Vinci (UNIQUE) | 2026-06 |
| C16 | 2603.19469 | NEW | Formalizing LLM agent security | Siu et al. | Gap9 / C1,C3 | 2026-03 |
| C17 | 2604.04561 | NEW | Mapping exploitation surface (10k trials) | Mouzouni | Gap9 (mostly null results) | 2026-04 |
| C18 | 2604.08499 | NEW | PIArena PI evaluation platform | Geng, Yin, Wang et al. | Gap12 benchmark | 2026-04 |
| C19 | 2602.24009 | NEW | Jailbreak Foundry (reproducibility) | Fang, Zheng, Fu, Xu | Gap12 reproducibility | 2026-02 |
| C20 | 2606.09735 | NEW | The Neutral Mask (RLHF shallow, mechanistic) | Tam | C1/C3 shallowness (empirical) | 2026-06 |

Removed (DUP): C02=P097, Young 2603.04851=P019.

## VERIFIED METADATA (WebFetch arXiv, 2026-06-15) — integration ground truth

All 19 confirmed to exist on arXiv (0 404). Use these EXACT titles/authors/years (override COLLECTOR claims).

| Cand | arXiv | Exact title (verbatim arXiv) | 1st author + total | YYYY-MM | Cat | Correction vs COLLECTOR |
|------|-------|------------------------------|--------------------|---------|-----|--------------------------|
| C01 | 2603.13026 | PISmith: Reinforcement Learning-based Red Teaming for Prompt Injection Defenses | Chenlong Yin (N=4: Yin, Geng, Wang, Jia) | 2026-03 | cs.LG | **Author Fang→Yin** |
| C03 | 2603.10068 | ADVERSA: Measuring Multi-Turn Guardrail Degradation and Judge Reliability in Large Language Models | Harry Owiredu-Ashley (N=1) | 2026-03 | cs.CR | OK |
| C04 | 2605.12922 | When Attention Closes: How LLMs Lose the Thread in Multi-Turn Interaction | Vardhan Dongre (N=6) | 2026-05 | cs.AI | title (no "GAR" in title) |
| C05 | 2605.27690 | TRACES: Proactive Safety Auditing for Multi-Turn LLM Agents via Trajectory-State Modeling | Jiaqian Li (N=5) | 2026-05 | cs.CL | OK |
| C06 | 2605.24497 | Reasoning as an Attack Surface: Adaptive Evolutionary CoT Jailbreaks for LLMs | Jianan Li (N=8) | 2026-05 | cs.AI | title paraphrase |
| C07 | 2504.17704 | Safety in Large Reasoning Models: A Survey | Cheng Wang (N=12) | 2025-04 | cs.CL | OK |
| C08 | 2604.07536 | TRUSTDESC: Preventing Tool Poisoning in LLM Applications via Trusted Description Generation | Hengkai Ye (N=4: Ye, Zhang, Jia, Hu) | 2026-04 | cs.CR | **Author Rostamzadeh→Ye** |
| C09 | 2604.07551 | MCP-DPT: A Defense-Placement Taxonomy and Coverage Analysis for Model Context Protocol Security | Mehrdad Rostamzadeh (N=5) | 2026-04 | cs.CR | OK |
| C10 | 2506.13538 | Model Context Protocol (MCP) at First Glance: Studying the Security and Maintainability of MCP Servers | Mohammed Mehedi Hasan (N=6) | **2025-06** | cs.SE | **YEAR 2025 not 2026** |
| C11 | 2602.12194 | MalTool: Malicious Tool Attacks on LLM Agents | Yuepeng Hu (N=5) | 2026-02 | cs.CR | OK |
| C12 | 2605.28074 | SilentRetrieval: Hijacking Retrieval-Augmented Generation via Semantically-Preserving Adversarial Data Poisoning | Jiachen Qian (N=1) | 2026-05 | cs.CR | title paraphrase |
| C13 | 2605.10253 | Knowledge Poisoning Attacks on Medical Multi-Modal Retrieval-Augmented Generation | Peiru Yang (N=9) | 2026-05 | cs.CR | "M3Att" not in title |
| C14 | 2606.00813 | Cross-Generational Transfer of Adversarial Attacks Reveals Non-Monotonic Safety Alignment in LLMs | Subhadip Mitra (N=1) | 2026-05 (subm 05-30; arXiv 2606) | cs.CR | single author |
| C15 | 2606.11535 | Adversarial Attacks on Learned Policies for Surgical Robotic Tasks | Shutong Jin (N=6) | 2026-06 | cs.RO | OK |
| C16 | 2603.19469 | A Framework for Formalizing LLM Agent Security | Vincent Siu (N=7) | 2026-03 | cs.CR | OK |
| C17 | 2604.04561 | Mapping the Exploitation Surface: A 10,000-Trial Taxonomy of What Makes LLM Agents Exploit Vulnerabilities | Charafeddine Mouzouni (N=1) | 2026-04 | cs.CR | OK |
| C18 | 2604.08499 | PIArena: A Platform for Prompt Injection Evaluation | Runpeng Geng (N=5) | 2026-04 | cs.CR | OK |
| C19 | 2602.24009 | Jailbreak Foundry: From Papers to Runnable Attacks for Reproducible Benchmarking | Zhicheng Fang (N=4) | 2026-02 | cs.CR | OK |
| C20 | 2606.09735 | The Neutral Mask: How RLHF Provides Shallow Alignment while Leaving Partisan Structure Intact in a Large Language Model | Wendy K. Tam (N=1) | 2026-06 | cs.CL | single author |

Verification status: 9 OK, 1 year-critical (C10=2025), 2 author-critical (C01, C08), 7 minor title paraphrases. All exist.

## Integration priority (thesis relevance + gap closure)

**Batch 1 (medical/robotic core + multi-turn D-016):** C15 (surgical robot, UNIQUE Gap11), C13 (medical RAG poisoning), C04 (attention decay GAR -> D-016 / RR-RUN4-004).

**Batch 2 (reasoning C7 + multi-turn defense):** C06 (AE-CoT), C03 (ADVERSA guardrail degradation), C07 (LRM safety survey -> RR-RUN4-003).

**Batch 3 (RLHF shallow + non-monotonic + RAG):** C20 (Neutral Mask -> C1/C3), C14 (cross-gen non-monotonic), C12 (SilentRetrieval).

**Batch 4 (MCP + tool-use cluster -> Gap10/RR-FA-007):** C08 (TRUSTDESC), C09 (MCP-DPT), C10 (MCP First Glance — confirm 2025 vs 2026), C11 (MalTool).

**Batch 5 (red-team infra / formalization / benchmarks):** C01 (PISmith), C05 (TRACES), C16 (agent security formalization), C18 (PIArena), C19 (Jailbreak Foundry), C17 (mapping surface).

## RR linkage (to update in research_requests.json at briefing time)
- RR-RUN4-003 (LRM security, C7): C06, C07 candidates.
- RR-RUN4-004 (multi-turn defense, D-016): C03, C04, C05 candidates.
- RR-FICHE-001 (MSBE / attention decay): C04 directly.
- fiche32 (refusal stability non-monotone): C14.
- fiche31 (RAG query rewriting): C12.
- RR-FA-007 (tool-use agent exploitation): C11, C16.
- RR-DA-001 (martingale RLHF replication): none is a direct martingale replication; C20 is independent empirical evidence of shallowness (partial).
- Gap10 MCP: C08, C09, C10, C11.
- Gap11 surgical robot: C15 (first identified adversarial-on-surgical-policy paper).

---

## INTEGRATION LOG — Batch 1 (RUN-012, 2026-06-15)

### ANALYST + cross-validation: DONE (3/3 fiches, all figures independently confirmed in fulltext)

| P-ID | arXiv | Short title | Fiche path | Words | SVC | Cross-val |
|------|-------|-------------|------------|-------|-----|-----------|
| P156 | 2606.11535 | Adversarial Attacks on Learned Policies for Surgical Robotic Tasks | 2026/medical_ai/P156_Jin_2026_SurgicalRobotPolicyAttacks.md | 1969 | 6/10 | 61% (abstract, self-confirmed) + 560 exp + 63/67/67% — PASS |
| P157 | 2605.10253 | Knowledge Poisoning Medical Multi-Modal RAG (M3Att) | 2026/medical_ai/P157_Yang_2026_MedicalMultimodalRAGPoisoning.md | 2488 | 9/10 | 8.78 / 0.0870 / 57.89 / 75.87 — all FOUND — PASS |
| P158 | 2605.12922 | When Attention Closes (GAR, multi-turn) | 2026/model_behavior/P158_Dongre_2026_MultiTurnAttentionDecay.md | 2662 | 9/10 | GAR / tau=-0.75 / 11.2 / 0.99 — all FOUND — PASS |

Classification + conjecture impact:
- **P156** delta3 principal/delta2 ; C2 supported (INDIRECT, cyber-physical non-LLM, tag explicit) ; C6 partial ; G-011 partial. HUMILITY GATE: authors' "first study" claim reported AS authors' claim, no AEGIS primacy.
- **P157** delta1/delta0/delta2 ; C2 + C5 + C6 supported (ASR@5 stays 57.89% even under cosine image-text defense -> reinforces C5; medical ambiguity exploited -> enriches C6) ; partially addresses RR-RUN4-001 / RR-DA-003 ; code public github.com/ypr17/M3Att.
- **P158** delta2 principal/delta1/delta3 ; C4 + C7 supported (strong) ; addresses RR-RUN4-004 (GAR diagnostic metric; periodic re-injection tested, negative) + RR-FICHE-001 (channel-transition = exact MSBE mechanism) ; **MECHANISTIC explanation of D-016** (multi-turn degradation).

### PENDING for Batch 1 (next loop iteration = LIBRARIAN + CHUNKER):
- LIBRARIAN: add MANIFEST.md rows P156/P157/P158 (+ coverage counts) ; update INDEX_BY_DELTA / INDEX_BY_CONJECTURE / INDEX_BY_TOPIC.
- CHUNKER: generate chunks + ingest ChromaDB aegis_bibliography + verify >=5 chunks/P-ID (use Windows-safe offline gen+ingest pattern; documented sandbox I/O risk).
- PDFs already in literature_for_rag/ (P156 15.7MB/12p, P157 3.4MB/20p, P158 8.9MB/34p).

### NEXT batches (ANALYST):
- Batch 2 = C06 (2605.24497 AE-CoT reasoning, C7/RR-RUN4-003), C03 (2603.10068 ADVERSA multi-turn guardrail, D-016), C07 (2504.17704 LRM safety survey, C7/RR-RUN4-003).
- Batch 3 = C20 (2606.09735 Neutral Mask RLHF shallow, C1/C3), C14 (2606.00813 non-monotonic safety), C12 (2605.28074 SilentRetrieval RAG).
- Batch 4 = C08/C09/C10(=2025!)/C11 (MCP + tool-use). Batch 5 = C01/C05/C16/C17/C18/C19.

---

## INTEGRATION LOG — Batch 2 (RUN-012, 2026-06-15)

### ANALYST + cross-validation: DONE (3/3 fiches written, MANIFEST rows added P159/P160/P161)

| P-ID | arXiv | Short title | Fiche | Words | SVC | Cross-val |
|------|-------|-------------|-------|-------|-----|-----------|
| P159 | 2605.24497 | AE-CoT reasoning jailbreak | 2026/prompt_injection/P159_Li_2026_AECoTReasoningJailbreak.md | 2225 | 9/10 | 0.345 / 18.8 — FOUND ; **venue ICML 2026 PMLR 306 CONFIRMED in text** -> [ARTICLE VERIFIE] |
| P160 | 2603.10068 | ADVERSA multi-turn guardrail degradation | 2026/benchmarks/P160_OwireduAshley_2026_ADVERSA.md | 2562 | 5.5/10 | 26.7% / 1.25 — FOUND in text ; 40.9% inter-judge = Figure 10 (image, not text-extractable; caveat in fiche) |
| P161 | 2504.17704 | Safety in LRMs: a Survey | 2025/benchmarks/P161_Wang_2025_LRMSafetySurvey.md | 2022 | 9/10 | 21.7% / 98% — FOUND ; "first comprehensive survey" present (hyphenated) — author primacy claim, NOT AEGIS |

Conjecture impact (for briefing + CONJECTURES_TRACKER):
- **P159** ICML 2026 — C7 SUPPORTED strongly (CoT as attack surface, ASR 92% o1-mini, combined defense residual 60%), C1 supported. Joins C7 cluster (P087/P089/P092/P094/P102/P141).
- **P160** — C2 corroborated (LLM judges unreliable in adversarial multi-turn: inter-judge agreement 40.9-59.8% -> converges with P044/P153). **NUANCE on D-016**: jailbreaks concentrated EARLY (avg round 1.25), non-jailbreak convos converge to refusal rounds 6-10 ("notable null result", author) -> NOT cumulative erosion. BUT N=15, solo, frontier non-medical (Claude Opus 4.6 / Gemini 3.1 Pro / GPT-5.2). Does NOT refute D-016 (medical scope, underpowered) but flags scope-dependence. Contrast with P158 (mechanistic, supports gradual decay).
- **P161** survey — C7 SUPPORTED (state-of-art framing); H-CoT 98%->2% refusal, 70x token overhead, 21.7% EN/ZH ASR gap cited.

### D-016 status note (to reconcile in CONJECTURES_TRACKER at briefing):
P158 (mechanistic, channel-transition) SUPPORTS gradual multi-turn degradation; P160 (empirical pilot, frontier non-medical) finds early-round concentration + late refusal-convergence. Net: D-016 (medical multi-turn degradation) holds in its medical scope; the GENERAL claim of monotone cumulative erosion is scope-dependent. Capture as honest nuance, no score change without medical-scope replication.

### Batch 2 MANIFEST: rows P159/P160/P161 added. ChromaDB ingestion DEFERRED to consolidated CHUNKER pass (end of run).

### NEXT: Batch 3 = C20 (2606.09735 Neutral Mask RLHF shallow -> C1/C3 empirical), C14 (2606.00813 cross-gen non-monotonic safety), C12 (2605.28074 SilentRetrieval RAG poisoning).

---

## INTEGRATION LOG — Batch 3 (RUN-012, 2026-06-15)

### ANALYST + cross-validation: DONE (3/3 fiches written + MANIFEST rows P162/P163/P164, all figures FOUND in fulltext)

| P-ID | arXiv | Short title | Fiche | Words | SVC | Cross-val |
|------|-------|-------------|-------|-------|-----|-----------|
| P162 | 2606.09735 | The Neutral Mask (RLHF shallow, mechanistic) | 2026/model_behavior/P162_Tam_2026_NeutralMaskRLHFShallow.md | 2605 | 7/10 | 0.074 / 0.114 / "84 prompts" / sparse autoencoder / 68% — all FOUND |
| P163 | 2606.00813 | Cross-Gen non-monotonic safety (Gemma) | 2026/model_behavior/P163_Mitra_2026_CrossGenNonMonotonicSafety.md | 2118 | 6.5/10 | 68.7 / 99.1 / MAP-Elites / red-queen (code) — all FOUND |
| P164 | 2605.28074 | SilentRetrieval RAG poisoning | 2026/prompt_injection/P164_Qian_2026_SilentRetrievalRAGPoisoning.md | 2245 | 8/10 | 84.6 / 32.4 / 8.7% / Coordinated Beam Search / **KDD DOI 3770855 CONFIRMED** |

Conjecture impact (for briefing + CONJECTURES_TRACKER):
- **P162** — C1 + C3 SUPPORTED (strongest mechanistic evidence in corpus: RLHF "disconnects not deletes" partisan geometry; sparse autoencoder, 5 policy features -> zero in Instruct, sigma -68%). Domain = political but MECHANISM transferable to safety (explicit author note: "same pattern may hold for other value domains"). Joins P018/P019/P102. SVC 7 (single-author, political domain not safety-direct).
- **P163** — C1 SUPPORTED (safety NOT cumulative across generations: Gemma 3 ASR 68.7% > Gemma 2 45.5%, p=0.030; misinfo 28.7->99.1%). **CONVERGES with P160** (non-monotonicity, now cross-generational + intra-session both documented). fiche32 (refusal stability/non-monotone) partially closed. Code public. SVC 6.5 (solo, single family, 8p).
- **P164** KDD 2026 — C5 SUPPORTED strongly (semantically-preserving poison evades perplexity filters: independent PPL audit detects only 8.7%; near-benign PPL 32.4 vs 28.4), C1, C2 partial (combined defenses ASR->25.6% at 6x latency). Joins RAG cluster P054/P055/P139/P157. fiche31 partial. SVC 8.

### Venue upgrades discovered this run: P159 = ICML 2026 (PMLR 306) ; P164 = KDD 2026 (DOI 10.1145/3770855.3818186). Both peer-reviewed, not mere preprints.

### Progress: 9/19 integrated (P156-P164). NEXT Batch 4 (MCP/tool cluster): C08 2604.07536 TRUSTDESC (Ye!) -> P165 2026/mcp_security ; C09 2604.07551 MCP-DPT (Rostamzadeh) -> P166 2026/mcp_security ; C10 2506.13538 MCP First Glance (Hasan, **2025** cs.SE) -> P167 2025/mcp_security. Then Batch 4b C11 2602.12194 MalTool -> P168 + Batch 5 (C01/C05/C16/C17/C18/C19).

---

## INTEGRATION LOG — Batch 4 MCP cluster (RUN-012, 2026-06-15)

### ANALYST + cross-validation: DONE (3/3 fiches + MANIFEST rows P165/P166/P167, figures FOUND in fulltext)

| P-ID | arXiv | Short title | Fiche | Words | SVC | Cross-val |
|------|-------|-------------|-------|-------|-----|-----------|
| P165 | 2604.07536 | TRUSTDESC (tool-poisoning defense) | 2026/mcp_security/P165_Ye_2026_TRUSTDESC.md | 2072 | 8/10 | 87.7 / 0.013 / "52 real-world" — FOUND |
| P166 | 2604.07551 | MCP-DPT (defense-placement taxonomy) | 2026/mcp_security/P166_Rostamzadeh_2026_MCPDefensePlacementTaxonomy.md | 1350 | 8/10 | ToolHive / "49 taxonomy" / 0%+Transport+undefended — FOUND |
| P167 | 2506.13538 | MCP at First Glance (1899 servers, **2025**) | 2025/mcp_security/P167_Hasan_2025_MCPFirstGlance.md | 2412 | 8/10 | 1,899 / 5.5% / 7.2% / 66% — FOUND (analyst self-verified too) |

Conjecture impact:
- **P165** — C2 SUPPORTED (independent validation layer feasible, $0.013 overhead; DynVer behavioral verification); MC8 reinforced (supply-chain exploitable without malicious code via implicit TPA). Author primacy claim "first framework for preventing tool poisoning" = AUTHOR claim (HUMILITY: report as such).
- **P166** — C2 supported structurally (defense-placement gaps quantified: Transport 0%, host orchestration peak 38%); MC8/MC9 enriched. Complements P155 (Huang STRIDE = "what threats"; MCP-DPT = "where to enforce"). 49 attacks x 13 defenses mapped over 6 MCP layers.
- **P167** (2025) — MC8 SUPPORTED in-the-wild (5.5% MCP servers tool-poisoned, 7.2% vulnerable, 1899 servers); C1/C2 indirect. First large-scale empirical MCP study; complements P152 (Li, smaller). ACM TOSEM submitted.

MCP cluster now comprehensive: P140 (MCP-ITP attack), P152 (First Look Li), P155 (STRIDE Huang), P165 (TRUSTDESC defense), P166 (DPT placement), P167 (empirical 1899). Strong basis for MC8/MC9 (MCP supply-chain -> Da Vinci) chapter.

### Progress: 12/19 integrated (P156-P167). REMAINING 7: Batch 5a = C11 2602.12194 MalTool -> P168 (tool-use attack, RR-FA-007), C01 2603.13026 PISmith (Yin!, RL red-team) -> P169, C05 2605.27690 TRACES (proactive multi-turn auditing) -> P170. Batch 5b = C16 2603.19469 Formalizing LLM Agent Security (Siu) -> P171, C17 2604.04561 Mapping Exploitation Surface (Mouzouni) -> P172, C18 2604.08499 PIArena (Geng) -> P173. Batch 5c = C19 2602.24009 Jailbreak Foundry (Fang) -> P174.
Then FINAL: consolidated CHUNKER ChromaDB + LIBRARIAN indexes/coverage + DIRECTOR_BRIEFING_RUN012 + HUMILITY GATE + research_requests.json + CONJECTURES_TRACKER + wiki sync + commit proposal.

---

## INTEGRATION LOG — Batch 5a (RUN-012, 2026-06-15)

### ANALYST + cross-validation: DONE (3/3 fiches + MANIFEST rows P168/P169/P170, all figures FOUND)

| P-ID | arXiv | Short title | Fiche | Words | SVC | Cross-val |
|------|-------|-------------|-------|-------|-----|-----------|
| P168 | 2602.12194 | MalTool (malicious tool attacks) | 2026/prompt_injection/P168_Hu_2026_MalTool.md | 2385 | 8/10 | 5,727 / 0.814 / VirusTotal / 1,300 — FOUND |
| P169 | 2603.13026 | PISmith (RL red-team vs PI defenses) | 2026/prompt_injection/P169_Yin_2026_PISmith.md | 2031 | 9/10 | 32,000 / GRPO / AgentDojo / 0.87 — FOUND |
| P170 | 2605.27690 | TRACES (proactive multi-turn auditing) | 2026/defenses/P170_Li_2026_TRACES.md | 2626 | 8.5/10 | 19.3 / 96.7 / EAUPC — FOUND |

Conjecture impact:
- **P168** (Duke/Berkeley, Dawn Song) — C1+C2 + MC8 (malicious tool code, not just descriptions; CIA taxonomy; 1300+5727 tools; existing detectors weak — Combined Scanner 0.814, VirusTotal 0.307). RR-FA-007 addressed.
- **P169** (Penn State) — C2 STRONGLY SUPPORTED [EXPERIMENTAL]: SOTA PI defenses remain vulnerable to adaptive RL attacker (ASR@1 0.87 vs Meta-SecAlign-8B, 0.95 vs GPT-5-nano on InjecAgent; beats 7 baselines; 13 benchmarks). "False sense of security" — converges with P153/P044 theme. C1 supported. Code public. SVC 9.
- **P170** (Brown/UT/Rutgers) — C2 + C4: proactive multi-turn auditing via trajectory-state (EAUPC +19.3, detects drift before trajectory end). **Directly addresses RR-RUN4-004** (multi-turn degradation defense). Cluster with P154 (DeepContext), P158 (GAR). SVC 8.5.

### Progress: 15/19 integrated (P156-P170). REMAINING 4: Batch 5b = C16 2603.19469 Formalizing LLM Agent Security (Siu, N=7) -> P171 ; C17 2604.04561 Mapping Exploitation Surface (Mouzouni, N=1, 10k trials) -> P172 ; C18 2604.08499 PIArena (Geng, N=5) -> P173. Batch 5c = C19 2602.24009 Jailbreak Foundry (Fang, N=4) -> P174.
Then FINAL consolidation (CHUNKER ChromaDB P156-P174 + LIBRARIAN indexes/coverage + DIRECTOR_BRIEFING_RUN012 + HUMILITY GATE + research_requests.json + CONJECTURES_TRACKER + wiki sync + commit proposal).

---

## INTEGRATION LOG — Batch 5b (RUN-012, 2026-06-15)

### ANALYST + cross-validation: DONE (3/3 fiches + MANIFEST rows P171/P172/P173, all figures FOUND)

| P-ID | arXiv | Short title | Fiche | Words | SVC | Cross-val |
|------|-------|-------------|-------|-------|-----|-----------|
| P171 | 2603.19469 | Formalizing LLM Agent Security (Dawn Song) | 2026/defenses/P171_Siu_2026_FormalizingAgentSecurity.md | 3175 | 8/10 | 41.5 / "87 papers" / data isolation / 86% — FOUND |
| P172 | 2604.04561 | Exploitation Surface 10k-trial taxonomy | 2026/benchmarks/P172_Mouzouni_2026_ExploitationSurfaceTaxonomy.md | 3098 | 8/10 | 1,850 / goal reframing / "outside the box" / 38 — FOUND |
| P173 | 2604.08499 | PIArena (PI eval platform) | 2026/benchmarks/P173_Geng_2026_PIArena.md | 2143 | 8/10 | 1,700 / PIArena / sleeepeer / 99% — FOUND |

Conjecture impact + KEY findings:
- **P171 (Dawn Song et al.) — SCOOPING RISK MODERATE-HIGH on AEGIS δ³.** Formalizes 4 contextual security properties (task/action alignment, source authorization, data isolation) + oracle functions; reformalizes IPI/DPI/jailbreak/task-drift/memory-poisoning as property violations; 87 papers mapped. C2 strongly supported (δ³ necessity), C3. **ACTION P0 (briefing/positioning)**: AEGIS can NO LONGER claim "first formal framework for agent security". Reposition as OPERATIONAL + MEDICAL-specific extension (N>=30 empirical campaigns, genetic engine, Da Vinci) vs Siu et al. purely specificational ("no software artifacts"). HUMILITY GATE: refutes any AEGIS formal-framework primacy claim. Related to P126 (Tramèr design patterns) scooping note.
- **P172 (Mouzouni) — C1 supported + CONVERGES with AEGIS EXP-CATALOGUE.** 10k trials, 7 models, 37 conditions: 9/12 attack dimensions = NULL (upper 95% CI <7%); ONLY goal-reframing reliably triggers exploitation (Claude 38-40% puzzle framing despite explicit rule; GPT-4.1 0/1850). **Independent external corroboration of AEGIS reframe_goal operator finding (CONJECTURES_TRACKER C1 EXP-CATALOGUE 2026-06-15)** -> strong cross-evidence for "alignment doesn't cover task-reframing". Null results valuable.
- **P173 (Penn State, PISmith group) — C2 strong.** Unified PI eval platform; dynamic strategy-based adaptive attack 99% ASR no-defense (vs 56% direct), 70% ASR on GPT-5 multilayer defense; no defense dominates cross-benchmark. Code public. Companion infra to P169 PISmith.

### Progress: 18/19 integrated (P156-P173). REMAINING 1: Batch 5c = C19 2602.24009 Jailbreak Foundry (Fang, N=4, reproducibility infra: 30 attacks reproduced) -> P174 2026/benchmarks.
Then FINAL consolidation (CHUNKER ChromaDB P156-P174 + LIBRARIAN indexes/coverage + DIRECTOR_BRIEFING_RUN012 [incl. P0 scooping-positioning P171] + HUMILITY GATE + research_requests.json + CONJECTURES_TRACKER + wiki sync + commit proposal).

---

## INTEGRATION LOG — Batch 5c + ALL FICHES DONE (RUN-012)

### P174 integrated (cross-val PASS): Jailbreak Foundry, 2026/benchmarks/P174_Fang_2026_JailbreakFoundry.md (2197 words, SVC 8). Figures 0.26 / 82.5% / 19.8 / 30 — FOUND. C2 supported (reproducibility infra; 30 attacks, +0.26pp ASR deviation, 82.5% reused code; 8/30 papers lack official repo -> -19.8pp fidelity, caution as baselines).

### *** 19/19 PAPERS INTEGRATED (P156-P174) — fiche + cross-val PASS + MANIFEST row all DONE ***

Full list with venue/conjecture:
- P156 2606.11535 Surgical robot adversarial (medical_ai, C2 indirect, SVC6)
- P157 2605.10253 M3Att medical RAG poison (medical_ai, C2/C5/C6, SVC9)
- P158 2605.12922 Attention Closes/GAR (model_behavior, D-016 mechanism, SVC9)
- P159 2605.24497 AE-CoT (ICML2026, prompt_injection, C7, SVC9)
- P160 2603.10068 ADVERSA (benchmarks, C2 + D-016 nuance, SVC5.5)
- P161 2504.17704 LRM Safety Survey (2025/benchmarks, C7, SVC9)
- P162 2606.09735 Neutral Mask RLHF shallow (model_behavior, C1/C3 mechanistic, SVC7)
- P163 2606.00813 Cross-gen non-monotonic (model_behavior, C1, SVC6.5)
- P164 2605.28074 SilentRetrieval (KDD2026, prompt_injection, C5, SVC8)
- P165 2604.07536 TRUSTDESC (mcp_security, C2/MC8, SVC8)
- P166 2604.07551 MCP-DPT (mcp_security, C2/MC8/9, SVC8)
- P167 2506.13538 MCP First Glance (2025/mcp_security, MC8, SVC8)
- P168 2602.12194 MalTool (prompt_injection, C1/C2/MC8, SVC8)
- P169 2603.13026 PISmith (prompt_injection, C2 strong, SVC9)
- P170 2605.27690 TRACES (defenses, C2/C4 multi-turn defense, SVC8.5)
- P171 2603.19469 Formalizing Agent Security (defenses, C2/C3, **SCOOPING δ³**, SVC8)
- P172 2604.04561 Exploitation Surface (benchmarks, C1 reframe convergence, SVC8)
- P173 2604.08499 PIArena (benchmarks, C2 strong, SVC8)
- P174 2602.24009 Jailbreak Foundry (benchmarks, C2 reproducibility, SVC8)

### NOW: FINAL CONSOLIDATION (autonomous, no gating). Status of consolidation steps:
- [x] 1. CHUNKER ChromaDB — DONE: generate_chunks_run012.py -> 208 chunks; ingest offline (HF_HUB_OFFLINE=1) -> aegis_bibliography 11067->11277; verify_chromadb_chunks.py 19/19 OK (>=9 each).
- [x] 2. LIBRARIAN — DONE: INDEX_BY_DELTA.md "RUN-012 additions" (P156-P174) + MANIFEST header (Last Updated RUN-012, 174 rows). INDEX_BY_CONJECTURE/TOPIC absent (n'existent pas comme fichiers).
- [x] 3. CONJECTURES_TRACKER — DONE (Synthese RUN-012 section; no threshold crossing, HUMILITY GATE).
- [x] 4. research_requests.json — DONE (8 RR updated + RR-RUN12-001/002 added; JSON valid, 53 reqs).
- [x] 5. DIRECTOR_BRIEFING_RUN012.md — DONE (8 sections + HUMILITY GATE, _staging/briefings/).
- [x] 6. MEMORY_STATE.md + EXECUTION_LOG.jsonl — DONE.
- [x] 7. wiki sync — DONE: build_wiki.py (853 pages, 151 PDFs) + mkdocs build OK (100s, exit 0). Warnings PRE-EXISTING (P069-P080 PDF links, INDEX_GLOBAL stale), NOT RUN-012. Wiki rebuilt locally; separate docs(wiki) commit/push needed for GitHub Pages.
- [x] 8. git commit — DONE: 178a5eaf on main (51 files, 99578 ins; no Co-Authored-By trailer; NOT pushed, ahead 3).

=== RUN-012 COMPLETE: 8/8 consolidation steps DONE. 19 papers P156-P174 integrated + ChromaDB + briefing + commit. Loop stopped. ===
REMAINING consolidation order: step 3 (CONJECTURES_TRACKER) -> step 4 (research_requests.json) -> step 5 (DIRECTOR_BRIEFING_RUN012) -> step 2 (indexes) -> step 7 (wiki) -> step 8 (commit proposal) -> STOP loop.
