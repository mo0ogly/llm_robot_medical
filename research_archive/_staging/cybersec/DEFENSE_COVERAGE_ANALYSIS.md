# DEFENSE_COVERAGE_ANALYSIS.md -- Aggregate Defense Coverage Matrix

> **Generated**: 2026-04-04 | **Updated**: 2026-04-07 (RUN-005)
> **Scope**: 62 papers (34 Phase 1 + 12 Phase 2 + 16 RUN-005 LRM/MSBE) mapped to AEGIS delta-layer taxonomy
> **Cross-reference**: `backend/taxonomy/defense_taxonomy_2025.json` (66 techniques, 4 classes: PREV, DETECT, RESP, MEAS)

---

## 1. Delta-Layer Coverage Matrix (Papers x Layers)

| Paper | Domain | delta0 | delta1 | delta2 | delta3 | DETECT | RESP | MEAS |
|-------|--------|--------|--------|--------|--------|--------|------|------|
| P001 (HouYi) | attack | LOW | PARTIAL | -- | -- | -- | -- | -- |
| P002 (Multi-Agent) | defense | ENHANCED | yes | yes | -- | yes | yes | -- |
| P003 (Review) | benchmark | survey | survey | survey | survey | -- | -- | -- |
| P004 (WASP) | benchmark | variable | variable | -- | -- | -- | -- | yes |
| P005 (Firewalls) | defense | insuff. | insuff. | VARIABLE | -- | -- | -- | yes |
| P006 (Tool Select) | attack | LOW | PARTIAL | -- | -- | -- | -- | -- |
| P007 (Securing LLMs) | defense | insuff. | partial | RECOM. | RECOM. | -- | yes | -- |
| P008 (Attn Tracker) | defense | -- | yes | NOVEL | -- | yes | -- | -- |
| P009 (Char Inject) | attack | PARTIAL | -- | BYPASSED | -- | -- | -- | -- |
| P010 (Protocol) | attack | LOW | partial | partial | -- | yes | yes | -- |
| P011 (PromptGuard) | defense | -- | yes | yes | YES | -- | -- | -- |
| P012 (Cosine Sim) | embedding | -- | -- | critique | -- | -- | -- | critique |
| P013 (Antonym) | embedding | -- | -- | relevant | -- | -- | -- | -- |
| P014 (SemScore) | embedding | -- | -- | relevant | -- | relevant | -- | -- |
| P015 (LLM-Sim) | embedding | -- | -- | relevant | -- | -- | -- | -- |
| P016 (Robust Sim) | embedding | -- | -- | relevant | -- | relevant | -- | -- |
| P017 (Adv Pref) | defense | ENHANCED | -- | -- | -- | -- | -- | -- |
| P018 (Shallow Align) | behavior | SHALLOW | -- | -- | implicit | -- | -- | yes |
| P019 (Gradient) | behavior | EXPLAINED | -- | -- | -- | -- | -- | yes |
| P020 (COBRA) | defense | HIGH | -- | -- | -- | -- | -- | yes |
| P021 (Adv Reward) | defense | ENHANCED | -- | -- | -- | -- | -- | -- |
| P022 (Adv RLHF) | attack | COMPROMISED | -- | -- | -- | -- | -- | -- |
| P023 (NDSS 4-strat) | attack | VARIABLE | partial | partial | -- | -- | -- | -- |
| P024 (Sep Score) | benchmark | QUANTIFIED | QUANTIFIED | -- | -- | FOUNDATION | -- | FOUNDATION |
| P025 (DMPI-PMHFE) | defense | -- | -- | HIGH | -- | -- | -- | -- |
| P026 (Indirect PI) | attack | LOW | partial | partial | -- | yes | -- | -- |
| P027 (Med Eval) | medical | variable | partial | -- | -- | -- | -- | yes |
| P028 (Healthcare JB) | medical | variable | partial | -- | -- | -- | yes | -- |
| P029 (JAMA 94.4%) | medical | CRITICAL-FAIL | minimal | -- | URGENT | -- | CRITICAL | -- |
| P030 (Declining) | medical | DECAY | -- | -- | -- | -- | -- | yes |
| P031 (Ethics Rev) | medical | survey | survey | -- | -- | -- | -- | -- |
| P032 (Misinfo Audit) | medical | variable | partial | -- | -- | relevant | relevant | -- |
| P033 (Self-Police) | attack | RECURSIVE | partial | -- | potential | yes | -- | -- |
| P034 (CFT Medical) | defense | ITERATIVE | yes | -- | -- | -- | -- | yes |
| **P035 (MPIB)** | **medical** | **variable** | **partial** | **partial** | -- | -- | -- | **CHER** |
| **P036 (LRM 97.14%)** | **attack** | **NEAR-ZERO** | **LOW** | -- | -- | **essential** | **critical** | -- |
| **P037 (Survey JB)** | **benchmark** | **survey** | **survey** | **survey** | **survey** | -- | -- | -- |
| **P038 (InstruCoT)** | **defense** | **ENHANCED** | -- | **ENHANCED** | -- | -- | -- | -- |
| **P039 (GRP-Oblit)** | **attack** | **OBLITERATED** | **irrelevant** | -- | **ONLY** | -- | -- | **essential** |
| **P040 (Health Misinfo)** | **medical** | **variable** | **partial** | **LOW** | -- | -- | **relevant** | -- |
| **P041 (MagicToken)** | **defense** | **NOVEL** | **ENHANCED** | -- | **implicit** | -- | -- | -- |
| **P042 (PromptArmor)** | **defense** | -- | **via prompt** | **NOVEL** | **partial** | **comparable** | -- | -- |
| **P043 (JBDistill)** | **benchmark** | **benchmarked** | **benchmarked** | -- | -- | -- | -- | **FOUNDATION** |
| **P044 (AdvJudge-Zero)** | **attack** | -- | -- | **BYPASSED** | -- | **vulnerable** | -- | -- |
| **P045 (SPP)** | **attack** | -- | **WEAPONIZED** | **ineffective** | -- | -- | -- | -- |
| **P046 (ADPO)** | **defense** | **ENHANCED** | -- | -- | -- | -- | -- | -- |
| **P087 (H-CoT)** | **attack** | **BYPASSED** | **indirect** | -- | -- | -- | -- | -- |
| **P088** | **doublon P036** | -- | -- | -- | -- | -- | -- | -- |
| **P089 (SEAL)** | **attack** | **BYPASSED** | **TARGETED** | **NOT ADDR** | -- | -- | -- | -- |
| **P090 (R1 Safety)** | **benchmark** | **EVALUATED** | **tested** | -- | -- | -- | -- | **yes** |
| **P091 (WeakLink)** | **benchmark** | **indirect** | **tested** | -- | -- | -- | -- | -- |
| **P092 (SelfJB)** | **attack** | **UNDERMINED** | **BYPASSED** | -- | -- | -- | -- | -- |
| **P093 (AdvReason)** | **attack** | **DEFEATED** | **implicit** | -- | -- | -- | -- | -- |
| **P094 (CoT-Hijack)** | **attack** | **MECH-DEFEATED** | **OVERRIDDEN** | -- | -- | -- | -- | **yes** |
| **P095 (Tempest)** | **attack** | **BYPASSED** | **eroded** | -- | -- | -- | -- | -- |
| **P096 (Mastermind)** | **attack** | **BYPASSED** | **BYPASSED** | **partial** | -- | -- | -- | -- |
| **P097 (STAR)** | **attack** | **MECH-ERODED** | **targeted** | -- | -- | -- | -- | -- |
| **P098 (LongCtx)** | **benchmark** | **PASSIVE-DEGRADE** | -- | -- | -- | -- | -- | -- |
| **P099 (Crescendo)** | **attack** | **BYPASSED** | **eroded** | **BYPASSED** | -- | -- | -- | -- |
| **P100 (ActorBreak)** | **attack+defense** | **BYPASSED** | **BYPASSED** | **ineffective** | -- | -- | -- | -- |
| **P101 (SafeDial)** | **benchmark** | **evaluated** | **evaluated** | -- | -- | -- | -- | **yes** |
| **P102 (AHD)** | **defense** | **ENHANCED** | -- | -- | -- | -- | -- | -- |

---

## 2. Defense Technique Coverage Summary

### 2.1 delta0 (RLHF Alignment) -- PREV Class

| Technique ID | AEGIS Status | Papers Referencing | Assessment |
|-------------|-------------|-------------------|------------|
| rlhf_safety_training | external | P017, P018, P019, P020, P021, P022, P030, **P036**, **P038**, **P039** | **Heavily studied; shallow (P018/P019), poisonable (P022), decaying (P030), obliterable (P039), bypassed by LRMs (P036). InstruCoT (P038) proposes CoT-based enhancement.** |
| dpo_alignment | external | P018, P019, **P039**, **P046** | Same shallow alignment; obliterable via GRPO (P039); ADPO (P046) proposes adversary-aware enhancement |
| constitutional_ai | external | P020 | Complementary to COBRA consensus approach |
| red_team_training | external | P017, P021, P022, **P043** | JBDistill (P043) provides renewable benchmark source for red team training |
| magic_token_cotraining | external | **P041** | **NEW (2026)**: Switchable safety via magic tokens; 8B model surpasses 671B in safety |
| safety_reasoning_data | external | **P092** | **NEW (2025)**: Minimal safety reasoning data during training prevents self-jailbreaking |
| attention_head_dropout | external | **P102** | **NEW (2025)**: AHD distributes safety across attention heads; ASR 100%->0% against AutoDAN/GCG/Adaptive |

**delta0 Verdict**: Most studied layer (32/62 papers discuss it). Consistently found to be **necessary but insufficient**. Key vulnerabilities: shallow alignment (P018/P019), poisoning (P022), temporal decay (P030), medical domain failure (P029 -- 94.4% ASR). **2026 escalation**: complete obliteration via single prompt (P039), 97.14% bypass by LRMs (P036). **RUN-005 escalation**: LRM paradox confirmed by 8 papers (P087-P094) -- reasoning degrades safety; self-jailbreaking without adversary (P092); CoT hijacking at 99% ASR on frontier models (P094); safety signal dilution mechanistically proven (P094); multi-turn erosion formalized (P097 STAR, P099 Crescendo, P096 Mastermind reaching 60% on GPT-5). New defenses: InstruCoT >90% (P038), ADPO (P046), magic-token (P041), **safety reasoning data (P092)**, **AHD attention head dropout (P102)**, **Circuit Breaker + multi-turn data (P100 -- ASR reduced to 14%)**.

### 2.2 delta1 (System Prompt) -- PREV Class

| Technique ID | AEGIS Status | Papers Referencing | Assessment |
|-------------|-------------|-------------------|------------|
| safety_preamble | production | P001, P007, P029, **P036**, **P045** | Bypassed by context partition (P001); insufficient for medical (P029); eroded by LRM multi-turn (P036); **weaponized by SPP (P045)** |
| role_anchoring | production | P028, P029, **P036**, **P040** | Authority impersonation undermines in medical contexts; LRM persuasion erodes (P036); emotional manipulation bypasses (P040) |
| boundary_marking | production | P001, **P045** | Targeted by HouYi separator injection; **irrelevant when system prompt itself is poisoned (P045)** |
| instruction_hierarchy | production | P006, P026, **P045** | Overridden by indirect injection; **subverted by SPP (P045) -- poisoned prompt has highest priority** |
| separation_tokens | partial | P001 | Insufficient alone; supplement with delta2 |
| sandwich_defense | production | (none directly) | Not evaluated in any paper; potential gap in literature |
| magic_token_switch | external | **P041** | **NEW (2026)**: More precise behavioral switch than natural language preambles |
| system_prompt_integrity | NOT IMPL | **P045** | **NEW GAP**: System prompt signing/verification needed to counter SPP |

**delta1 Verdict**: Moderate coverage (24/62 papers discuss). Consistently found as **partial** defense. **2026 escalation**: SPP (P045) converts delta1 from defense to attack vector; LRM multi-turn persuasion erodes preamble authority (P036); emotional manipulation bypasses role anchoring (P040). **RUN-005 escalation**: multi-turn attacks (P095 Tempest, P096 Mastermind, P097 STAR, P099 Crescendo) systematically erode system prompt authority through progressive contextual accumulation; self-jailbreaking (P092) generates internal justifications that override system instructions; CoT hijacking (P094) final-answer cue overrides preamble. NEW defense: magic-token switching (P041). CRITICAL GAP: no system prompt integrity verification in taxonomy.

### 2.3 delta2 (Syntax Filtering / Input Analysis) -- PREV Class

| Sub-category | Technique ID | Papers Referencing | Assessment |
|-------------|-------------|-------------------|------------|
| **Character Injection** | invisible_unicode_detection | P009 | Directly targeted and bypassed without normalization |
| | homoglyph_normalization | P009 | Directly targeted |
| | mixed_encoding_detection | P009 | Directly targeted |
| | emoji_smuggling_detection | P009 | Directly targeted |
| | unicode_tag_detection | P009 | Directly targeted |
| | bidi_override_detection | P009 | Directly targeted |
| | deletion_char_detection | P009 | Directly targeted |
| | fullwidth_normalization | P009 | Directly targeted |
| | diacritics_detection | P009 | Directly targeted |
| | upside_down_detection | P009 | Directly targeted |
| | underline_accent_detection | P009 | Directly targeted |
| | number_injection_detection | P009 | Directly targeted |
| **Content Analysis** | typoglycemia_detection | (none) | Not evaluated |
| | hidden_markup_detection | P026 | Relevant for indirect injection in documents |
| | script_mixing_detection | (none) | Not evaluated |
| | fragmented_instruction_detection | (none) | Not evaluated |
| | semantic_drift_guard | P012, P013, P023 | Questioned by embedding critique papers |
| | base64_heuristic | (none) | Not evaluated |
| **Structural** | struq_structured_queries | P011 | Aligned with PromptGuard layer 2 |
| | input_output_separation | P026 | Relevant for indirect injection defense |
| | prompt_sandboxing | (none) | Not evaluated |
| | data_marking | P026 | Critical for distinguishing instruction from data |
| **ML-Based** | classifier_guard | P005, P008, P011, P025, P033, **P044** | Most evaluated; vulnerable to adaptive adversaries (P009); **99% bypassed by AdvJudge-Zero (P044)** |
| | perplexity_filter | P005, P023, **P044** | Effective against GCG tokens; **defeated by low-perplexity stealth tokens (P044)** |
| | task_specific_finetuning | P025, P034, **P038** | DMPI-PMHFE, CFT, and **InstruCoT (P038) >90% defense** |
| | adversarial_training | P017, P021, P023, **P044**, **P046** | Applied at delta0 and delta2; **AdvJudge-Zero adversarial training reduces ASR to near zero (P044); ADPO integrates into DPO (P046)** |
| **LLM-Based** | llm_guardrail | **P042** | **NEW (2026)**: PromptArmor -- LLM-as-guardrail achieves <1% FPR/FNR; semantic detection superior to pattern matching |
| **Emotional** | emotional_sentiment_guard | **P040** | **NEW GAP**: Emotional manipulation (6.2% -> 37.5% medical misinfo) not addressed by any current technique |

**delta2 Verdict**: Good coverage (25/62 papers discuss). **Most diverse defense layer**. Character injection (P009) remains primary threat; AEGIS RagSanitizer counters this. **2026 escalation**: AdvJudge-Zero (P044) achieves 99% bypass of ML-based guards via stealth control tokens. **RUN-005 note**: SEAL stacked ciphers (P089) would be caught by cipher-pattern detection at delta2 -- AEGIS RagSanitizer should add cipher detection; Crescendo/ActorBreaker use entirely benign inputs that bypass ALL content-based delta2 filters -- structural/behavioral detection needed, not just content analysis. NEW defenses: PromptArmor LLM-guardrail <1% FPR (P042); InstruCoT >90% defense (P038). NEW GAPS: emotional manipulation detection (P040); LLM-based guardrails vulnerable to fuzzing (P044); multi-turn attack detection (behavioral, not content-based).

### 2.4 delta3 (Formal Verification / Output Enforcement) -- PREV Class

| Technique ID | AEGIS Status | Papers Referencing | Assessment |
|-------------|-------------|-------------------|------------|
| allowed_output_spec | production | P007, P011 | PromptGuard layer 3/4 aligns |
| forbidden_directive_check | production | P029, P032 | **Urgently needed** for medical domain |
| tension_range_validation | production | P018, P029 | Would catch extreme clinical recommendations |
| tool_invocation_guard | production | P006 | Critical for agent architectures |
| response_sanitization | production | P007, P011 | PromptGuard layer 4 aligns |

| safety_alignment_margin | external | **P041** | **NEW (2026)**: SAM provides implicit output-space enforcement via distinct behavioral boundaries |

**delta3 Verdict**: **Least studied but most critical layer** (12/62 papers discuss). **2026 confirms delta3 necessity**: GRP-Obliteration (P039) makes delta3 the ONLY surviving defense after delta0 obliteration; SPP (P045) weaponizes delta1, leaving delta3 as compensator. **RUN-005 confirms delta3 necessity even more strongly**: 8 LRM attack papers (P087-P094) show delta0 is mechanistically bypassable via reasoning exploitation; multi-turn attacks (P095-P100) show delta1 is progressively erodable; P094 proves safety signal is low-dimensional and dilutable. Delta3 (deterministic output validation) remains the ONLY defense layer not defeated by any paper in the corpus (62 papers). AEGIS's production-grade delta3 implementation (5 techniques) is ahead of the literature by >1 year.

---

## 3. DETECT Class Coverage

| Technique ID | AEGIS Status | Papers Referencing | Assessment |
|-------------|-------------|-------------------|------------|
| svc_composite_score | production | P014, P016, P023, P032, **P036** | AEGIS-specific; **per-turn SVC monitoring essential against LRM attacks (P036)** |
| wilson_confidence_interval | production | P024 | Used in Sep(M) statistical validation |
| separation_score_sep_m | production | P024 | **Foundational** -- Zverev et al. ICLR 2025 |
| threat_score_asr_svc | production | (AEGIS-specific) | No direct literature comparison |
| encoding_metrics_p_decode | production | P009 | Character injection detection metrics |
| security_audit_agent | production | P002, P033, **P042**, **P044** | Multi-agent defense; recursive vulnerability risk; **PromptArmor comparable (P042); vulnerable to AdvJudge-Zero fuzzing (P044)** |
| forensic_hl7_analysis | production | P010, P028, **P035** | Protocol and medical domain analysis; **MPIB clinical context (P035)** |
| mitre_attack_mapping | production | P001, P010 | Standard mapping framework |
| detection_profile_svc | production | P008 | Attention-based detection could enhance profiles |

---

## 4. RESP Class Coverage

| Technique ID | AEGIS Status | Papers Referencing | Assessment |
|-------------|-------------|-------------------|------------|
| quarantine_action | production | P002, P010 | Multi-agent and protocol isolation |
| input_redaction | production | P007 | Input sanitization at response level |
| response_blocking | partial | P002 | Pipeline-based blocking |
| session_termination | planned | P010, **P036** | Agent session isolation; **critical for LRM multi-turn attack kill-switch (P036)** |
| telemetry_bus_event | production | (AEGIS-specific) | No direct literature comparison |
| risk_level_classification | production | P027, P028, P029, **P035**, **P040** | Medical risk stratification; **CHER-based classification (P035); emotional manipulation risk (P040)** |
| campaign_reporting | production | (AEGIS-specific) | No direct literature comparison |

---

## 5. MEAS Class Coverage

| Technique ID | AEGIS Status | Papers Referencing | Assessment |
|-------------|-------------|-------------------|------------|
| mpib_safe_evaluation | production | P004, P005, P027, **P035**, **P043** | Benchmark alignment; **MPIB benchmark (P035); JBDistill renewable benchmarking (P043)** |
| multi_trial_sampling | production | P004, P024, **P043** | Statistical validity requirement; **JBDistill supports renewable multi-trial (P043)** |
| streaming_campaign | production | (AEGIS-specific) | No direct literature comparison |
| delta0_attribution | production | P018, P019, P020, P022, P024, P030, **P036**, **P039**, **P041**, **P046** | **Heavily supported** by literature; **2026 critical: alignment regression (P036), obliteration detection (P039), SAM measurement (P041), adversarial robustness (P046)** |
| delta_layer_decomposition | partial | P024 | Zverev framework foundation |

---

## 6. Gap Summary

### 6.1 Under-Covered Defense Techniques (0-1 paper references)

| Technique | Papers | Risk Level |
|-----------|--------|-----------|
| sandwich_defense | 0 | Low -- well-established practice |
| typoglycemia_detection | 0 | Medium -- novel AEGIS technique without external validation |
| script_mixing_detection | 0 | Medium -- same |
| fragmented_instruction_detection | 0 | Medium -- same |
| base64_heuristic | 0 | Low -- straightforward pattern matching |
| prompt_sandboxing | 0 | High -- important structural defense with no evaluation |
| data_marking | 1 (P026) | High -- critical for indirect injection |
| **system_prompt_integrity** | **0 (NEW GAP)** | **CRITICAL -- P045 (SPP) converts delta1 to attack vector; no signing/verification technique exists** |
| **emotional_sentiment_guard** | **0 (NEW GAP)** | **HIGH -- P040 shows 6x increase in medical misinfo via emotional manipulation; no detection technique** |
| **lrm_conversation_monitor** | **0 (NEW GAP)** | **CRITICAL -- P036 (97.14% ASR) via LRM multi-turn; no per-turn drift detection** |

### 6.2 Over-Reliance Risks

| Layer | Risk | Evidence |
|-------|------|----------|
| delta0 | Temporal decay | P030: disclaimers dropped from 26.3% to 0.97% over 3 years |
| delta0 | Supply chain poisoning | P022: adversarial RLHF platforms |
| delta0 | Shallow alignment | P018/P019: concentrates on first tokens |
| **delta0** | **Complete obliteration** | **P039: single unlabeled prompt removes all safety alignment via GRPO** |
| **delta0** | **Alignment regression** | **P036: LRM reasoning capability enables 97.14% cross-model jailbreak** |
| delta2 | Adaptive bypass | P009: all tested guardrails defeated by character injection |
| **delta2** | **Guardrail fuzzing** | **P044: AdvJudge-Zero achieves 99% bypass of ML-based guards via stealth tokens** |
| DETECT | Recursive vulnerability | P033: judge model shares base model vulnerabilities |
| **DETECT** | **Judge fuzzing** | **P044: LLM judges are systematically fuzzable; extends P033 findings** |
| **delta1** | **System prompt weaponization** | **P045: SPP converts system prompt from defense to persistent attack vector** |

### 6.3 Critical Defense Gaps for Medical Domain

1. **delta3 is essential and now PROVEN critical**: P029's 94.4% ASR + P039 obliteration + P045 SPP confirm delta0+delta1 are insufficient. delta3 is the ONLY surviving defense in worst-case scenarios. AEGIS's 5 delta3 techniques are ahead of literature.
2. **Authority impersonation defense**: P028 shows medical domain is uniquely vulnerable to authority-based social engineering. No specific defense technique in taxonomy.
3. **Continuous delta0 monitoring**: P030 shows delta0 decays; P036 shows LRM regression; P039 shows obliteration. AEGIS needs real-time delta0 integrity monitoring.
4. **Multi-modal injection**: P046 (ADPO) addresses VLM safety but no paper addresses medical-specific multi-modal injection (e.g., adversarial radiology images).
5. **Emotional manipulation defense**: P040 demonstrates 6x increase in medical misinformation via emotional framing. No AEGIS technique detects emotional manipulation.
6. **RAG-mediated injection**: P035 (MPIB) shows RAG injection is harder to defend than direct injection. AEGIS RagSanitizer addresses pattern-level but not semantic-level RAG injection.
7. **System prompt integrity**: P045 (SPP) creates a new threat class where the system prompt itself is the attack. No signing or integrity verification exists.

### 6.4 NEW -- 2026 Threat Escalation Summary

| Threat | Paper | ASR/Impact | AEGIS Mitigation | Gap |
|--------|-------|-----------|-----------------|-----|
| LRM autonomous jailbreak | P036 | 97.14% | Per-turn SVC monitoring | No conversation-level drift detector |
| Single-prompt unalignment | P039 | Complete obliteration | delta3 output enforcement | No delta0 integrity check |
| Guardrail fuzzing | P044 | 99% bypass | RagSanitizer (pattern-based, resistant) | LLM-based judges vulnerable |
| System prompt poisoning | P045 | Persistent, all users | delta3 output enforcement | No system prompt signing |
| Emotional manipulation | P040 | 6x increase (37.5%) | None | No emotional sentiment guard |
| Healthcare ASR divergence | P035 | CHER != ASR | Risk classification | CHER not integrated |

---

## 7. Literature-to-AEGIS Technique Mapping (Aggregate)

| AEGIS Technique Count | Referenced by N papers | Status |
|----------------------|----------------------|--------|
| 66 total techniques (+3 new gaps identified) | -- | -- |
| 40 implemented (60.6%) | -- | -- |
| Techniques with 3+ paper refs | 18 (+6) | Well-supported |
| Techniques with 1-2 paper refs | 20 (+2) | Moderate support |
| Techniques with 0 paper refs | 5 (-3, moved to 1+ refs) | AEGIS-novel or under-evaluated |
| AEGIS-specific (no literature equiv) | 5 | Unique contributions (SVC, telemetry, campaign) |
| **NEW gaps identified (2026)** | **3** | **system_prompt_integrity, emotional_sentiment_guard, lrm_conversation_monitor** |
| **NEW techniques from literature** | **3** | **magic_token_cotraining (P041), llm_guardrail (P042), safety_alignment_margin (P041)** |
