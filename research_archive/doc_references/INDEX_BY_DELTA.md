# Index by delta-Layer

**Last Updated**: 2026-04-04 (RUN-002)
**Source**: 46 analyst reports (Phase 3 + RUN-002) cross-referenced with PHASE3_ANALYST_REPORT.md delta-coverage matrix

---

## delta-0 (RLHF Alignment)

Papers addressing the base alignment layer -- RLHF/DPO training, reward model robustness, alignment depth.

| ID | Title | Role | Key Finding |
|----|-------|------|-------------|
| P003 | Comprehensive Review (MDPI) | Survey | Discusses delta-0 vulnerabilities in taxonomy |
| P007 | JATMO -- Securing LLMs | Defense | Alternative alignment via functional restriction |
| P010 | Protocol Exploits | Attack | Model compromise via backdoors and poisoning |
| P017 | Adversarial Preference Learning | Defense | Reinforces RLHF alignment via adversarial training |
| P018 | Shallow Alignment (ICLR 2025) | Analysis | **RLHF concentrates on first few tokens -- prefilling attacks bypass** |
| P019 | Gradient Analysis of RLHF | Analysis | **Mathematical proof: alignment gradients are zero beyond harm horizon** |
| P020 | COBRA Framework | Defense | Protects RLHF against malicious feedback via trusted cohorts |
| P021 | Adversarial Reward Models | Defense | Incorporates adversarial responses into reward training |
| P022 | Adversarial RLHF Platforms | Attack | Induces misalignment through poisoned feedback |
| P023 | SSRA / Safety Misalignment (NDSS) | Attack | Four attack strategies evaluated against alignment |
| P024 | Separation Score (ICLR 2025) | Benchmark | **RLHF-aligned models show weak separation** |
| P027 | Medical Framework | Medical | Evaluates alignment resistance to medical jailbreaking |
| P028 | Safe AI Clinicians | Medical | CFT reinforcement of alignment for healthcare |
| P029 | JAMA Medical Injection | Medical | **RLHF-aligned commercial LLMs fail at 94.4% rate** |
| P030 | Declining Safety Messaging | Medical | Alignment-enforced disclaimers erode over versions |
| P031 | Mondillo -- Jailbreak Ethics | Medical | Ethical limits rest on alignment mechanisms |
| P032 | Health Misinformation Audit | Medical | Evaluates alignment resistance to medical jailbreaking |
| P034 | CFT Medical Defense | Medical | Evaluates alignment resilience to medical attacks |
| P035 | MPIB Medical Benchmark | Medical | Models rely on base alignment to resist medical injections |
| P036 | LRM Autonomous Jailbreak (Nature) | Attack | **97.14% ASR -- alignment regression via reasoning capability** |
| P037 | Jailbreaking Survey (Unified) | Survey | Parameters layer covers alignment defenses |
| P038 | InstruCoT Defense | Defense | Enhanced post-training alignment with metacognitive reasoning |
| P039 | GRP-Obliteration (Microsoft) | Attack | **Single prompt erases alignment in 15 models -- strongest C2 evidence** |
| P040 | Healthcare Misinformation | Medical | Helpful/harmless tension is RLHF alignment artifact |
| P041 | Magic-Token Co-Training | Defense | 8B model surpasses DeepSeek-R1 671B in safety |
| P046 | ADPO for VLMs | Defense | Adversarial DPO extends alignment to multimodal |

**Total**: 27 papers | **Critical path**: P018 + P019 (shallow alignment proof) + P039 (single-prompt unalignment)

---

## delta-1 (System Prompt / Instruction Hierarchy)

Papers addressing system prompt defenses, instruction-following hierarchies, prompt engineering as security.

| ID | Title | Role | Key Finding |
|----|-------|------|-------------|
| P001 | HouYi (Liu et al.) | Attack | **86.1% of apps vulnerable despite system prompts** |
| P003 | Comprehensive Review (MDPI) | Survey | System prompts included in defense taxonomy |
| P004 | WASP Benchmark | Benchmark | Web agents with system prompts fail to protect |
| P006 | ToolHijacker | Attack | System prompts cannot prevent tool selection manipulation |
| P010 | Protocol Exploits | Attack | Prompt-level input manipulation |
| P011 | PromptGuard | Defense | Structured Prompt Formatting layer acts at prompt level |
| P024 | Separation Score | Benchmark | **Prompt engineering shows inconsistent results across models** |
| P026 | IPI in the Wild | Attack | System prompts fail against indirect injection via RAG |
| P027 | Medical Framework | Medical | Prompt-level guardrails among evaluated defenses |
| P028 | Safe AI Clinicians | Medical | Role-playing exploits system prompt weaknesses |
| P029 | JAMA Medical Injection | Medical | **Commercial prompt guardrails bypassed at 94.4%** |
| P030 | Declining Safety Messaging | Medical | System prompts no longer enforce disclaimers |
| P031 | Mondillo -- Jailbreak Ethics | Medical | Prompt-based guardrails are the discussed defenses |
| P033 | Self-Policing (HiddenLayer) | Attack | **LLM judge prompts share same vulnerabilities as base model** |
| P035 | MPIB Medical Benchmark | Medical | Direct injections (V1) target system prompt layer |
| P036 | LRM Autonomous Jailbreak | Attack | Multi-turn attacks progressively erode system prompt protections |
| P037 | Jailbreaking Survey | Survey | Perception layer covers prompt obfuscation defenses |
| P040 | Healthcare Misinformation | Medical | Direct injections target system prompt in medical context |
| P041 | Magic-Token Co-Training | Defense | Magic tokens operate at system prompt level |
| P042 | PromptArmor | Defense | **Best delta-1 defense: <1% FPR/FNR via careful prompting** |
| P045 | System Prompt Poisoning | Attack | **Most devastating: system prompt itself is the attack vector (persistent)** |

**Total**: 21 papers | **Critical finding**: System prompts provide inconsistent, bypassable protection (C1). P045 shows they can be poisoned at the source.

---

## delta-2 (Syntax Filtering / Input Validation)

Papers addressing input/output filtering, guardrail systems, semantic similarity-based detection.

| ID | Title | Role | Key Finding |
|----|-------|------|-------------|
| P002 | Multi-Agent Defense | Defense | Multi-agent pipeline as advanced filtering |
| P003 | Comprehensive Review (MDPI) | Survey | PALADIN and filtering approaches covered |
| P005 | Firewalls for IPI | Defense | Firewall-based input/output filtering |
| P008 | Attention Tracker | Defense | **Training-free detection via attention pattern tracking** |
| P009 | Guardrail Bypass | Attack | **100% evasion via emoji smuggling; 12 character injection techniques** |
| P010 | Protocol Exploits | Attack | Filtering-level defenses discussed |
| P011 | PromptGuard | Defense | Input Gatekeeping + Output Validation layers (F1=0.91) |
| P012 | Cosine Similarity (Steck) | Embedding | Impact on reliability of similarity-based filters |
| P013 | Semantic Drift / Antonyms | Embedding | Implications for similarity-based filter reliability |
| P014 | SemScore | Embedding | Metric for evaluating semantic deviation of filtered outputs |
| P015 | LLM-Enhanced Similarity | Embedding | Improved domain-specialized semantic detection |
| P016 | Berkeley Robust Similarity | Embedding | Pertinent to semantic filtering metric reliability |
| P025 | DMPI-PMHFE | Defense | **Dual-channel detection: DeBERTa + heuristic (accuracy 97.94%)** |
| P026 | IPI in the Wild | Attack | RagSanitizer as delta-2 defense against indirect injection |
| P032 | Health Misinformation Audit | Medical | Evaluates detectability of compromised outputs |
| P033 | Self-Policing (HiddenLayer) | Attack | **LLM-based filters are vulnerable by construction** |
| P037 | Jailbreaking Survey | Survey | Perception and generation layers cover filtering defenses |
| P042 | PromptArmor | Defense | Detect-then-clean schema is contextual filtering |
| P044 | AdvJudge-Zero | Attack | **99% judge bypass via control tokens -- syntactic weakness in judgment** |

**Total**: 19 papers | **Critical finding**: Filters can be evaded (P009) but remain useful in layered defense. Judges themselves vulnerable (P044: 99%).

---

## delta-3 (Formal Verification / External Enforcement)

Papers addressing formal methods, mathematical guarantees, external verification mechanisms.

| ID | Title | Role | Key Finding |
|----|-------|------|-------------|
| P012 | Cosine Similarity (Steck) | Embedding | Mathematical analysis of metric limits contributes to formal verification |
| P019 | Gradient Analysis of RLHF | Analysis | **Mathematical proof itself is a formal contribution -- proves delta-0 limits** |
| P024 | Separation Score (ICLR 2025) | Benchmark | **Sep(M) formalization is a step toward formal guarantees** |
| P033 | Self-Policing (HiddenLayer) | Attack | **Self-reference impossibility argues for external mechanisms** |

**Total**: 4 papers (Phase 1) | **Research gap**: No paper implements delta-3 concretely -- formal verification is identified as necessary but never realized

> **Note (RUN-002)**: While no Phase 2 paper directly implements delta-3, several strongly argue for its necessity:
> - P039 (GRP-Obliteration): alignment erasable with single prompt -- empirical defenses fundamentally insufficient
> - P044 (AdvJudge-Zero): judges manipulable at 99% -- formal verification of evaluation needed
> - P045 (SPP): system prompt integrity requires formal mechanisms (hash, signature)
> - P043 (JBDistill): benchmark standardization is a step toward formal rigor

---

## Cross-Layer Coverage

| Paper | delta-0 | delta-1 | delta-2 | delta-3 | Layers |
|-------|:-------:|:-------:|:-------:|:-------:|:------:|
| P001 | | X | | | 1 |
| P002 | | | X | | 1 |
| P003 | X | X | X | | 3 |
| P004 | | X | | | 1 |
| P005 | | | X | | 1 |
| P006 | | X | | | 1 |
| P007 | X | | | | 1 |
| P008 | | | X | | 1 |
| P009 | | | X | | 1 |
| P010 | X | X | X | | 3 |
| P011 | | X | X | | 2 |
| P012 | | | X | X | 2 |
| P013 | | | X | | 1 |
| P014 | | | X | | 1 |
| P015 | | | X | | 1 |
| P016 | | | X | | 1 |
| P017 | X | | | | 1 |
| P018 | X | | | | 1 |
| P019 | X | | | X | 2 |
| P020 | X | | | | 1 |
| P021 | X | | | | 1 |
| P022 | X | | | | 1 |
| P023 | X | | | | 1 |
| P024 | X | X | | X | 3 |
| P025 | | | X | | 1 |
| P026 | | X | X | | 2 |
| P027 | X | X | | | 2 |
| P028 | X | X | | | 2 |
| P029 | X | X | | | 2 |
| P030 | X | X | | | 2 |
| P031 | X | X | | | 2 |
| P032 | X | | X | | 2 |
| P033 | | X | X | X | 3 |
| P034 | X | | | | 1 |
| P035 | X | X | | | 2 |
| P036 | X | X | | | 2 |
| P037 | X | X | X | | 3 |
| P038 | X | | | | 1 |
| P039 | X | | | | 1 |
| P040 | X | X | | | 2 |
| P041 | X | X | | | 2 |
| P042 | | X | X | | 2 |
| P043 | | | | | 0 |
| P044 | | | X | | 1 |
| P045 | | X | | | 1 |
| P046 | X | | | | 1 |

**Layer frequency**: delta-0: 27 | delta-1: 21 | delta-2: 19 | delta-3: 4

---

## Key Observations

1. **delta-0 dominates** (27/46) -- reflects current research focus on alignment-level security
2. **delta-3 is severely underexplored** (4/46 direct) -- validates C2 (formal verification is necessary but absent)
3. **Multi-layer papers are rare** -- only P003, P010, P024, P033, P037 cover 3+ layers
4. **No paper covers all 4 layers** -- confirms the thesis gap AEGIS aims to fill
5. **(RUN-002) 2026 papers strengthen attack side**: P036 (97.14% ASR), P039 (single-prompt unalignment), P044 (99% judge bypass), P045 (persistent system prompt poisoning)
6. **(RUN-002) Best defense documented**: PromptArmor (P042) achieves <1% FPR/FNR but requires frontier model
7. **(RUN-002) Medical-specific evaluation matures**: MPIB (P035) provides first statistically robust benchmark (N=9,697) with CHER metric

---

*Cross-reference: MANIFEST.md for full metadata, GLOSSAIRE_MATHEMATIQUE.md for formulas*
*Generated by LIBRARIAN agent -- Phase 4 + RUN-002 incremental update*
