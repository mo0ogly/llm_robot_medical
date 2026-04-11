# Index by delta-Layer

**Last Updated**: 2026-04-04 (RUN-003)
**Source**: 60 analyst reports (Phase 3 + RUN-002 + RUN-003) cross-referenced with PHASE3_ANALYST_REPORT.md delta-coverage matrix

---

## δ⁰ (RLHF Alignment)

Papers addressing the base alignment layer -- RLHF/DPO training, reward model robustness, alignment depth.

| ID | Title | Role | Key Finding |
|----|-------|------|-------------|
| P003 | Comprehensive Review (MDPI) | Survey | Discusses δ⁰ vulnerabilities in taxonomy |
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
| P048 | SLR on PI Defenses (NIST Extension) | Survey | 88-study catalog covering alignment-level defenses |
| P050 | JMedEthicBench | Medical | **Medical-specialized models MORE vulnerable; safety 9.5->5.5 over turns (p<0.001)** |
| P052 | Why Is RLHF Alignment Shallow? | Analysis | **Mathematical proof: RLHF gradient vanishes beyond early tokens (martingale decomposition)** |
| P053 | Semantic Jailbreaks and RLHF Limitations | Analysis | Taxonomy of RLHF limitations; semantic attacks exploit alignment weaknesses |
| P056 | AIR -- Instruction Hierarchy Enforcement | Defense | **1.6x-9.2x ASR reduction via intermediate-layer IH signal injection** |
| P057 | ASIDE -- Architectural Instruction/Data Separation | Defense | **Orthogonal rotation at embedding level; Sep(M) improvement without utility loss** |
| P060 | SoK: Evaluating Jailbreak Guardrails | Benchmark | Alignment guardrails evaluated in six-dimensional taxonomy |

**Total**: 35 papers | **Critical path**: P018 + P019 (shallow alignment proof) + P039 (single-prompt unalignment) + P052 (mathematical proof of shallowness) + P057 (ASIDE architectural resolution)

---

## δ¹ (System Prompt / Instruction Hierarchy)

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
| P042 | PromptArmor | Defense | **Best δ¹ defense: <1% FPR/FNR via careful prompting** |
| P045 | System Prompt Poisoning | Attack | **Most devastating: system prompt itself is the attack vector (persistent)** |
| P047 | Defense by Leveraging Attack Techniques | Defense | Attack-defense duality: inversion of attack methods into instruction reinforcement |
| P048 | SLR on PI Defenses (NIST Extension) | Survey | Covers instruction-level defensive prompt engineering |
| P050 | JMedEthicBench | Medical | Multi-turn attacks erode medical ethics instruction compliance |
| P051 | Detecting Jailbreak in Clinical LLMs | Defense | Linguistic feature extraction for instruction compliance detection |
| P052 | RLHF Alignment Shallow (Gradient Analysis) | Analysis | Fine-tuning depth limited to early tokens; instruction signals fade |
| P053 | Semantic Jailbreaks and RLHF Limitations | Attack | Semantic-level bypass of instruction hierarchy via paraphrasing |
| P056 | AIR -- Instruction Hierarchy Enforcement | Defense | **IH signal injected at ALL transformer layers, not just input** |
| P057 | ASIDE -- Architectural Separation | Defense | **Embedding-level enforcement from first layer onward** |
| P058 | Automated PI Attacks Against LLM Agents | Attack | Multi-turn agent exploitation of instruction processing |
| P059 | In-Paper PI Attacks on AI Reviewers | Attack | Static/iterative injection crafting against instruction-following models |
| P060 | SoK: Evaluating Jailbreak Guardrails | Benchmark | Input filtering guardrails evaluated across attack types |

**Total**: 33 papers | **Critical finding**: System prompts provide inconsistent, bypassable protection (C1). P045 shows they can be poisoned at the source. P056/P057 propose architectural solutions.

---

## δ² (Syntax Filtering / Input Validation)

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
| P026 | IPI in the Wild | Attack | RagSanitizer as δ² defense against indirect injection |
| P032 | Health Misinformation Audit | Medical | Evaluates detectability of compromised outputs |
| P033 | Self-Policing (HiddenLayer) | Attack | **LLM-based filters are vulnerable by construction** |
| P037 | Jailbreaking Survey | Survey | Perception and generation layers cover filtering defenses |
| P042 | PromptArmor | Defense | Detect-then-clean schema is contextual filtering |
| P044 | AdvJudge-Zero | Attack | **99% judge bypass via control tokens -- syntactic weakness in judgment** |
| P047 | Defense by Leveraging Attack Techniques | Defense | Inverted attack techniques operate as detection filters |
| P048 | SLR on PI Defenses (NIST Extension) | Survey | Covers detection/filtering defense category (88 studies) |
| P049 | Bypassing LLM Guardrails (Hackett) | Attack | **100% evasion via character injection + AML techniques against 6 guardrails** |
| P051 | Detecting Jailbreak in Clinical LLMs | Defense | BERT-based two-layer jailbreak classification for clinical dialogue |
| P054 | PIDP-Attack: PI + DB Poisoning on RAG | Attack | **Compound attack: 4-16pp improvement via simultaneous query + DB poisoning** |
| P055 | RAGPoison: Persistent PI via Vector DBs | Attack | **~275K malicious vectors for persistent RAG interception** |
| P058 | Automated PI Attacks Against LLM Agents | Attack | Multi-turn agent exploitation via automated discovery |
| P059 | In-Paper PI Attacks on AI Reviewers | Attack | Adaptive optimization defeats detection-based defenses |

**Total**: 27 papers | **Critical finding**: Filters can be evaded (P009, P049: 100% bypass) but remain useful in layered defense. Judges vulnerable (P044: 99%). RAG layer creates new attack surface (P054, P055).

---

## δ³ (Formal Verification / External Enforcement)

Papers addressing formal methods, mathematical guarantees, external verification mechanisms.

| ID | Title | Role | Key Finding |
|----|-------|------|-------------|
| P012 | Cosine Similarity (Steck) | Embedding | Mathematical analysis of metric limits contributes to formal verification |
| P019 | Gradient Analysis of RLHF | Analysis | **Mathematical proof itself is a formal contribution -- proves δ⁰ limits** |
| P024 | Separation Score (ICLR 2025) | Benchmark | **Sep(M) formalization is a step toward formal guarantees** |
| P033 | Self-Policing (HiddenLayer) | Attack | **Self-reference impossibility argues for external mechanisms** |
| P048 | SLR on PI Defenses (NIST Extension) | Survey | Covers system-level architectural defenses (sandboxing, separation) |
| P049 | Bypassing LLM Guardrails (Hackett) | Attack | System-level guardrail bypass demonstrates need for formal enforcement |
| P054 | PIDP-Attack: PI + DB Poisoning on RAG | Attack | Data integrity violation requires δ³ verification mechanisms |
| P055 | RAGPoison: Persistent PI via Vector DBs | Attack | Persistence in vector DB requires δ³ integrity monitoring |
| P060 | SoK: Evaluating Jailbreak Guardrails | Benchmark | Detection/monitoring guardrails evaluated; no universal solution found |

**Total**: 9 papers | **Research gap**: Still no paper implements δ³ concretely, but gap is better characterized

> **Note (RUN-002)**: While no Phase 2 paper directly implements δ³, several strongly argue for its necessity:
> - P039 (GRP-Obliteration): alignment erasable with single prompt -- empirical defenses fundamentally insufficient
> - P044 (AdvJudge-Zero): judges manipulable at 99% -- formal verification of evaluation needed
> - P045 (SPP): system prompt integrity requires formal mechanisms (hash, signature)
> - P043 (JBDistill): benchmark standardization is a step toward formal rigor
>
> **Note (RUN-003)**: New papers expand the δ³ argument surface:
> - P048 (SLR): most comprehensive survey confirms δ³ is least explored defense category
> - P049 (Hackett): 100% guardrail bypass at system level demands formal enforcement
> - P054/P055 (RAG poisoning): data integrity requires cryptographic verification (hash, signed embeddings)
> - P060 (SoK): IEEE S&P confirms no single guardrail is universal -- architectural approach needed

---

## Cross-Layer Coverage

| Paper | δ⁰ | δ¹ | δ² | δ³ | Layers |
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
| P047 | | X | X | | 2 |
| P048 | X | X | X | X | 4 |
| P049 | | | X | X | 2 |
| P050 | X | X | | | 2 |
| P051 | | X | X | | 2 |
| P052 | X | X | | | 2 |
| P053 | X | X | | | 2 |
| P054 | | | X | X | 2 |
| P055 | | | X | X | 2 |
| P056 | X | X | | | 2 |
| P057 | X | X | | | 2 |
| P058 | | X | X | | 2 |
| P059 | | X | X | | 2 |
| P060 | X | X | | X | 3 |

**Layer frequency**: δ⁰: 35 | δ¹: 33 | δ²: 27 | δ³: 9

---

## Key Observations

1. **δ⁰ dominates** (35/60) -- reflects current research focus on alignment-level security
2. **δ³ remains underexplored** (9/60) -- up from 4/46 but still the least covered; validates C2
3. **Multi-layer papers expanding** -- P003, P010, P024, P033, P037, P048, P060 cover 3+ layers; **P048 is first to cover all 4 layers**
4. **(RUN-002) 2026 papers strengthen attack side**: P036 (97.14% ASR), P039 (single-prompt unalignment), P044 (99% judge bypass), P045 (persistent system prompt poisoning)
5. **(RUN-002) Best defense documented**: PromptArmor (P042) achieves <1% FPR/FNR but requires frontier model
6. **(RUN-002) Medical-specific evaluation matures**: MPIB (P035) provides first statistically robust benchmark (N=9,697) with CHER metric
7. **(RUN-003) Mathematical proof of shallow alignment**: P052 formalizes via martingale decomposition why RLHF gradient vanishes beyond early tokens
8. **(RUN-003) RAG attack surface emerges**: P054 (compound attack) + P055 (persistent poisoning) create new δ²/δ³ attack vectors
9. **(RUN-003) Architectural defense candidates**: P056 (AIR: 1.6x-9.2x ASR reduction) + P057 (ASIDE: orthogonal rotation for Sep(M) improvement)
10. **(RUN-003) Medical domain expands**: P050 (50K adversarial conversations) + P051 (clinical jailbreak detection) provide domain-specific evidence

---

*Cross-reference: MANIFEST.md for full metadata, GLOSSAIRE_MATHEMATIQUE.md for formulas*
*Generated by LIBRARIAN agent -- Phase 4 + RUN-002 + RUN-003 incremental update*
