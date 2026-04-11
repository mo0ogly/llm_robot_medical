# REPORT RUN-005 WHITEHACKER
# AEGIS Medical Red Team Lab -- ENS Doctoral Thesis 2026
# Generated: 2026-04-07

---

## Summary

RUN-005 analyzed **13 new papers** (P087-P094, P097-P102; P088 confirmed as duplicate of P036) covering two thematic clusters:

1. **LRM Safety (P087-P094)**: 7 papers on Large Reasoning Model vulnerabilities
2. **Multi-Turn Boundary Erosion (P097-P102)**: 6 papers on multi-turn jailbreaks and architectural safety concentration

**Output**: 13 new techniques (T31-T43) added to RED_TEAM_PLAYBOOK.md, 10 new exploitation procedures (E25-E34) added to EXPLOITATION_GUIDE.md.

---

## Papers Analyzed

| Paper | Authors | Year | Topic | SVC | Key ASR |
|-------|---------|------|-------|-----|---------|
| P087 | Kuo et al. | 2025 | H-CoT: Hijacking CoT Safety Reasoning | 9/10 | 94.6% o1, 97.6% o1-pro, 98% o3-mini |
| P088 | Hagendorff et al. | 2026 | **DUPLICATE of P036** (Nature Comms) | N/A | N/A |
| P089 | Nguyen et al. | 2025 | SEAL: Adaptive Stacked Cipher Jailbreak | 8/10 | 80.8% o4-mini, 100% DeepSeek-R1 |
| P090 | Zhou et al. | 2025 | Hidden Risks of LRMs: Safety Assessment of R1 | 8/10 | Safety rate gap: 70.1% (o3-mini) vs 46% (R1-70b) |
| P091 | Krishna et al. | 2025 | Weakest Link: Security of Reasoning Models | 7/10 | 42.51% vs 45.53% (reasoning vs non-reasoning) |
| P092 | Yong & Bach | 2025 | Self-Jailbreaking: Models Reason Out of Alignment | 9/10 | 25% -> 65% ASR after reasoning training (s1.1-32B) |
| P093 | Sabbaghi et al. | 2025 | Adversarial Reasoning at Jailbreaking Time | 8/10 | 64% with Vicuna (3x PAIR/TAP-T), 56% transfer o1-preview |
| P094 | Zhao et al. | 2026 | Chain-of-Thought Hijacking (Attention Dilution) | 10/10 | 99% Gemini 2.5 Pro, 94% Claude 4 Sonnet, 100% Grok 3 Mini |
| P097 | Li et al. | 2026 | STAR: State-Dependent Multi-Turn Failures | 9/10 | 94% SFR on LLaMA-3-8B-IT |
| P098 | Hadeliya et al. | 2025 | Unstable Safety in Long-Context Agents | 7/10 | Grok 4 Fast: 80% -> 10% refusal at 200K tokens |
| P099 | Russinovich et al. | 2024 | Crescendo Multi-Turn Jailbreak | 8/10 | 56.2% GPT-4, 82.6% Gemini-Pro, 98% binary ASR |
| P100 | Ren et al. | 2025 | ActorBreaker: Natural Distribution Shift | 8/10 | 81.2% avg, 60% on GPT-o1 (vs 14% baselines) |
| P101 | Cao et al. | 2026 | SafeDialBench: Fine-Grained Multi-Turn Safety | 7/10 | Degradation after turn 4; o3-mini vulnerable |
| P102 | Huang et al. | 2025 | Safety Concentrated in Few Attention Heads | 9/10 | 0% -> 80-100% after ablating 50 heads |

---

## Techniques Extracted (T31-T43)

| ID | Name | Source | Category | Primary ASR | delta Target |
|----|------|--------|----------|-------------|-------------|
| T31 | H-CoT Mocked Execution | P087 | CoT Hijacking | 94.6-98% | δ⁰ δ¹ |
| T32 | SEAL Stacked Ciphers | P089 | Encoding-Based Adaptive | 80.8-100% | δ⁰ δ¹ |
| T33 | Thinking Process Exposure | P090 | Information Leaking | N/A (think > answer) | δ⁰ δ¹ |
| T34 | Tree-of-Attacks LRM | P091 | Reasoning Cooperation | +32pp vs baseline | δ¹ |
| T35 | Self-Jailbreaking | P092 | Endogenous Bypass | 25% -> 65% | δ⁰ δ¹ |
| T36 | Adversarial Reasoning Scaling | P093 | Compute-Scaled Optimization | 64% (3x baselines) | δ⁰ |
| T37 | CoT Hijacking Puzzles | P094 | Attention Dilution | 94-100% | δ⁰ δ¹ |
| T38 | STAR Multi-Turn Erosion | P097 | State-Space Erosion | 89-94% | δ¹ δ² |
| T39 | Long-Context Passive Erosion | P098 | Context Length Degradation | 10% refusal at 200K | δ⁰ |
| T40 | Crescendo Escalation | P099 | Progressive Multi-Turn | 56-83% | δ¹ δ² |
| T41 | ActorBreaker Distribution | P100 | Semantic Network | 60-81% | δ¹ δ² |
| T42 | Fallacy Multi-Turn | P101 | Logical Fallacy | Degrades after T4 | δ¹ δ² |
| T43 | Safety Head Concentration | P102 | Architectural Exploitation | 0% -> 80-100% | δ⁰ |

---

## Impact on TRIPLE_CONVERGENCE (D-001)

### Pilier 1 (δ⁰ Effacable) -- MASSIVELY REINFORCED

**7 papers confirm and extend Pilier 1:**

- **P087 (H-CoT)**: RLHF safety reasoning is hijackable by mocking execution traces. The safety mechanism is not robust against exploitation of the reasoning process itself (Kuo et al., 2025, Table 1, p. 14).
- **P089 (SEAL)**: Stacked ciphers evade RLHF's semantic detection. The paradox: stronger reasoning = better decryption = higher vulnerability (Nguyen et al., 2025, Figure 1, Section 3.2).
- **P092 (Self-Jailbreaking)**: Reasoning training DIRECTLY degrades RLHF alignment without any adversary. The model undermines its own safety alignment spontaneously (Yong & Bach, 2025, Figure 2, p. 4).
- **P094 (CoT Hijacking)**: The refusal signal is a low-dimensional subspace that dilutes with reasoning length. RLHF alignment is quantifiably fragile: monotonic degradation with CoT length (Zhao et al., 2026, Table 1, p. 3).
- **P098 (Long-Context)**: RLHF alignment degrades under long context WITHOUT any attack, purely from padding (Hadeliya et al., 2025, Figure 2, p. 3).
- **P102 (Safety Heads)**: RLHF alignment concentrates in ~50 attention heads out of hundreds. This structural sparsity is the ROOT CAUSE of why all attacks work (Huang et al., 2025, Figure 1a, p. 1).

**New synthesis**: P102 provides the structural explanation for WHY Pilier 1 holds. The alignment is sparse (few heads), low-dimensional (P094), and self-defeating (P092). This is no longer just "effacable" -- it is **architecturally fragile by design**.

### Pilier 2 (δ¹ Empoisonnable) -- REINFORCED via Multi-Turn

- **P097 (STAR)**: System prompt constraints are bypassed via multi-turn state evolution with monotonic drift away from refusal direction (Li et al., 2026, Figure 4, p. 7).
- **P099 (Crescendo)**: System prompt defenses (Self-Reminder, Goal Prioritization) are reduced but not eliminated by multi-turn escalation (Russinovich et al., 2024, Figure 13, p. 12-13).
- **P100 (ActorBreaker)**: Prompts that bypass δ¹ are classified as benign by Llama-Guard (Ren et al., 2025, Figure 5, p. 7).

### Pilier 3 (δ² Juges Bypassables) -- UNCHANGED

No new papers in this batch directly address judge bypass. Pilier 3 remains at 99% bypass (P044) confirmed by P049 (100% evasion).

### δ³ (Formal Validation) -- STILL THE ONLY SURVIVOR

**None of the 13 papers propose a defense at the δ³ level.** All proposed defenses operate at δ⁰ (AHD, safety reasoning data) or δ¹ (prompt hardening). This reinforces the gap G-001 and the AEGIS advantage.

---

## Impact on Conjectures

### C7 (Paradoxe Raisonnement/Securite) -- NOW THE STRONGEST CONJECTURE

**8 out of 13 papers directly support C7.** This is the most supported conjecture in the thesis.

| Paper | C7 Status | Key Evidence |
|-------|-----------|-------------|
| P087 | FORTEMENT SUPPORTEE | H-CoT exploits the reasoning mechanism itself |
| P089 | FORTEMENT SUPPORTEE | Reasoning ability enables cipher decryption = vulnerability (Figure 1) |
| P090 | FORTEMENT SUPPORTEE | Stronger reasoning = greater harm when safety fails |
| P091 | NUANCEE | +32pp on tree-of-attacks but -29.8pp on XSS; C7 is category-dependent |
| P092 | TRES FORTEMENT SUPPORTEE | Self-jailbreaking = most extreme form of C7 (no adversary needed) |
| P093 | SUPPORTEE indirectement | Test-time compute scaling applies to attacks too |
| P094 | DEMONTREE MECANISTIQUEMENT | Causal proof via activation probing; monotonic dilution |
| P102 | Explains C7 structurally | Safety concentration in few heads = structural fragility |

**Nuance from P091**: C7 is not universal but conditional on attack type. Tree-of-attacks are worse against LRMs, but XSS-type attacks are better defended. This suggests C7 applies to semantic/logical attacks but not to syntactic/technical attacks. This nuance should be integrated into the thesis formulation.

### C1 (Fragilite de l'alignement) -- REINFORCED

- P097: Single-turn robust models collapse in multi-turn (STAR SFR 94%).
- P098: Safety degrades passively under long context without any attack.
- P100: Natural distribution shifts bypass alignment (ActorBreaker 81%).
- P102: Alignment is concentrated in ~50 heads (structural fragility).

### C6 (Alignement superficiel) -- MECHANISTICALLY CONFIRMED

P102 provides the definitive evidence: safety alignment is literally superficial -- concentrated in a small subset of attention heads, easily ablated. Combined with P094's finding that the refusal signal is low-dimensional and dilutable, C6 is now mechanistically proven.

---

## Impact on Gaps

### Gaps REINFORCED

| Gap | Reinforced by | Status Change |
|-----|---------------|---------------|
| G-001 (No δ³ implementation) | All 13 papers propose no δ³ defense | OUVERT, CONFIRMED |
| G-005 (No defense against LRM autonomes) | P087, P089, P092, P094 | OUVERT, MORE URGENT |
| G-019 (ASIDE not tested against adaptatives) | P094 attention dilution may bypass ASIDE rotation | OUVERT |
| G-027 (RAG defenses not tested against adaptatives) | P100 ActorBreaker bypasses Llama-Guard | OUVERT |
| RR-FICHE-001 (MSBE) | P097, P098, P099, P100, P101, P102 | 6 PAPERS ADDRESS THIS GAP |

### New Gaps Created

| Gap | Source | Evidence | AEGIS Advantage | Priority |
|-----|--------|----------|-----------------|----------|
| G-032 | P087 | No defense against CoT hijacking (H-CoT). T_E collection is manual but could be automated. | AEGIS can test H-CoT defense via δ³ output validation | ACTIONNABLE |
| G-033 | P089 | No defense against adaptive stacked ciphers. Cipher detection at δ² could work but is not evaluated. | RagSanitizer could add cipher pattern detection (encoding_detector exists) | ACTIONNABLE |
| G-034 | P090 | No supervision mechanism for <think> process content. Thinking is more harmful than output. | AEGIS can add think-tag content filtering as δ³ | ACTIONNABLE |
| G-035 | P092 | Self-jailbreaking mitigation requires safety reasoning data during training. How much data? Generalization to frontier? | AEGIS can test self-jailbreaking on LLaMA 3.2 medical fine-tune | ACTIONNABLE |
| G-036 | P094 | No defense against safety signal dilution via long reasoning. Prompt length limits are trivial defense. | AEGIS can implement context-length-aware safety scoring | A CONCEVOIR |
| G-037 | P098 | No model of the interaction between long-context degradation and multi-turn erosion | Combine T39 + T38/T40 for compound attack | A CONCEVOIR |
| G-038 | P102 | AHD not tested against multi-turn attacks (STAR, Crescendo). Does distributing safety across heads prevent progressive erosion? | AEGIS can test AHD + STAR/Crescendo | A CONCEVOIR |

---

## Exploitability Assessment for AEGIS (LLaMA 3.2 via Ollama)

| Technique | Applicable to AEGIS? | Rationale |
|-----------|---------------------|-----------|
| T31 H-CoT | PARTIAL | LLaMA 3.2 may not have strong reasoning mode; effectiveness depends on CoT capability |
| T32 SEAL | YES | Cipher decryption depends on model size; 8B may not decode complex stacks |
| T33 Think Exposure | PARTIAL | Requires model with visible <think> tags (deepseek-r1 via Ollama) |
| T34 Tree-of-Attacks | YES | Any model can be probed with tree-structured prompts |
| T35 Self-Jailbreaking | YES | If LLaMA 3.2 has reasoning fine-tuning, self-jailbreaking is likely |
| T36 Adversarial Reasoning | PARTIAL | Requires logit access (possible via Ollama API) or surrogate transfer |
| T37 CoT Hijacking | YES | Puzzle prefixing works on any model with sufficient context window |
| T38 STAR | YES | Multi-turn available via conversation chain |
| T39 Long-Context | YES | LLaMA 3.2 128K context; testable at various padding levels |
| T40 Crescendo | YES | Multi-turn conversation available; benign-only inputs |
| T41 ActorBreaker | YES | Actor decomposition applicable to medical domain |
| T42 Fallacy | YES | Multi-turn fallacy construction works on any model |
| T43 Safety Heads | PARTIAL | Requires weight access; possible with local Ollama deployment |

**Most immediately actionable for AEGIS**: T37 (CoT Hijacking Puzzles), T38 (STAR), T39 (Long-Context), T40 (Crescendo), T41 (ActorBreaker).

---

## Cross-Validation Notes

- P094 (Zhao et al., 2026) is the **highest-impact paper** in this batch: SVC 10/10, best ASR in the literature (99% Gemini 2.5 Pro), mechanistic explanation of C7, code and materials published. Affiliation includes Anthropic co-author (Mrinank Sharma).
- P092 (Yong & Bach, 2025) introduces the most **conceptually novel** threat: self-jailbreaking without any adversary. This is the most extreme form of C7.
- P102 (Huang et al., 2025) provides the **structural explanation** for all jailbreaks: safety is concentrated in ~50 attention heads. AHD defense is the most promising counterpart.
- P088 confirmed as **duplicate** of P036 (same paper, arXiv preprint vs Nature Communications final).
- P091 provides a critical **nuance to C7**: the paradox is category-dependent, not universal. Tree-of-attacks +32pp worse for LRM, XSS -29.8pp better.

---

## Recommendations for Next Steps

1. **Test T37 (CoT Hijacking) on AEGIS**: highest ASR, black-box, easy implementation. Priority P1.
2. **Test T39 (Long-Context) on AEGIS**: trivial to implement, tests fundamental LLaMA 3.2 weakness. Priority P1.
3. **Implement T40 (Crescendo) in attack chains**: add a crescendo chain to the 36 existing chains. Priority P1.
4. **Formalize C7 in thesis Chapter 4**: 8 supporting papers with mechanistic proof (P094). Sufficient evidence for a conjecture-to-theorem promotion with the P091 nuance.
5. **Update G-001 evidence**: 13 more papers with no δ³ implementation. Total evidence: 0/73+ papers.
6. **Test AHD (P102) as defense candidate**: if safety heads can be identified in LLaMA 3.2, AHD is a viable δ⁰ reinforcement.
7. **Create compound attack**: combine T39 (long-context) + T40 (Crescendo) to test G-037.

---

*End of Report -- WHITEHACKER RUN-005 (2026-04-07)*
