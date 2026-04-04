# PHASE3_CYBERSEC_REPORT.md -- Threat Modeling & Defense Analysis Report

> **Phase**: 3 (Cybersecurity Analysis)
> **Generated**: 2026-04-04
> **Analyst**: Cybersec Agent (Autonomous)
> **Input**: 34 papers from `papers_phase1.json`
> **Framework**: AEGIS delta-layer taxonomy (delta0 through delta3) + 4-class defense taxonomy (PREV/DETECT/RESP/MEAS, 66 techniques)

---

## Executive Summary

This report synthesizes threat models from 34 papers spanning prompt injection attacks, defense mechanisms, embedding metrics, model behavior analysis, benchmarks, and medical AI security. Papers are mapped to MITRE ATT&CK techniques, evaluated against the AEGIS delta-layer defense taxonomy, and cross-linked with the 66-technique defense taxonomy implemented in AEGIS.

### Key Findings

1. **delta0 (RLHF alignment) is the most studied but most fragile layer**: 18/34 papers discuss delta0. It is demonstrated as shallow (P018/P019), poisonable (P022), temporally decaying (P030), and critically insufficient for medical safety (P029: 94.4% ASR).

2. **delta3 (formal verification/output enforcement) is the least studied but most needed layer**: Only 8/34 papers discuss delta3, mostly indirectly. Yet P029's medical domain results prove delta0+delta1 are insufficient, making delta3 the critical compensating control. AEGIS's 5 production-grade delta3 techniques are **ahead of the literature**.

3. **Character injection (P009) defeats all tested commercial guardrails**: The 12 character injection categories identified by Hackett et al. bypass Azure Prompt Shield, ProtectAI, Meta Prompt Guard, and others. AEGIS's RagSanitizer implements 12/12 countering detectors, providing comprehensive coverage.

4. **Self-policing LLM vulnerability (P033) threatens multi-agent defenses**: When base and judge models share architecture, prompt injection that compromises the base also compromises the judge. AEGIS's multi-model approach (heterogeneous models for security audit) mitigates this.

5. **Medical domain is uniquely vulnerable**: P029 (94.4% ASR in JAMA), P028 (authority impersonation), P030 (declining safety messaging), and P034 (evolving attacks) collectively demonstrate that medical AI requires the full delta-layer stack plus domain-specific defenses.

---

## 1. Threat Landscape Summary

### 1.1 Attack Papers (8 papers: P001, P006, P009, P010, P022, P023, P026, P033)

| Paper | Attack Type | MITRE Tactic | Severity | Primary Target Layer |
|-------|-----------|-------------|----------|---------------------|
| P001 (HouYi) | Black-box PI framework | Initial Access | Critical (9.1) | delta1 (context partition) |
| P006 (Tool Selection) | Tool manipulation via PI | Execution | High (8.4) | delta0 + delta3 |
| P009 (Char Injection) | Guardrail bypass via encoding | Defense Evasion | Critical (9.3) | delta2 (fully bypassed) |
| P010 (Protocol Exploits) | Inter-agent workflow attacks | Lateral Movement | High (8.7) | Cross-layer (workflow) |
| P022 (Adv RLHF) | Training pipeline poisoning | Impact/Persistence | Critical (9.5) | delta0 (corrupted) |
| P023 (NDSS 4-strategy) | Multi-strategy misalignment | Execution | High (8.8) | delta0 + delta1 |
| P026 (Indirect PI) | External content injection | Initial Access | Critical (9.0) | delta0 + delta1 |
| P033 (Self-Policing) | Recursive judge vulnerability | Defense Evasion | High (8.5) | delta0 (recursive) |

**Attack sophistication spectrum**: From simple direct requests (P023 strategy 1) to supply-chain RLHF poisoning (P022). Most critical: P022 (corrupts delta0 at training time) and P009 (bypasses delta2 at inference time).

### 1.2 Defense Papers (10 papers: P002, P005, P007, P008, P011, P017, P020, P021, P025, P034)

| Paper | Defense Type | Primary Layer | AEGIS Alignment |
|-------|------------|--------------|-----------------|
| P002 (Multi-Agent) | Agent pipeline | delta0-delta2 | security_audit_agent |
| P005 (Firewalls) | Firewall evaluation | delta2 | classifier_guard, perplexity_filter |
| P007 (Securing LLMs) | Survey/practical | delta1-delta3 | Multiple techniques |
| P008 (Attn Tracker) | Attention monitoring | delta2 (novel) | classifier_guard (new type) |
| P011 (PromptGuard) | 4-layer framework | delta1-delta3 | struq, classifier_guard, output_spec |
| P017 (Adv Preference) | Robust RLHF | delta0 | rlhf_safety_training |
| P020 (COBRA) | Consensus reward | delta0 | rlhf_safety_training |
| P021 (Adv Reward) | Reward hardening | delta0 | rlhf_safety_training |
| P025 (DMPI-PMHFE) | Dual-channel detector | delta2 | classifier_guard |
| P034 (CFT Medical) | Continual fine-tuning | delta0+delta1 | task_specific_finetuning |

**Defense coverage**: delta0 has the most dedicated defenses (P017, P020, P021, P034) but remains structurally weak. delta2 has the most diverse techniques (P005, P008, P025). delta3 has the fewest dedicated defenses despite being the most critical for medical safety.

### 1.3 Medical Domain Papers (7 papers: P027-P032, P034)

The medical domain papers form a coherent threat narrative:

1. **P029** (JAMA): 94.4% attack success rate, including 91.7% in extreme harm scenarios -- establishes the severity baseline
2. **P028**: Authority impersonation and role-playing attacks exploit medical hierarchy culture
3. **P030**: Delta0 safety eroding longitudinally (26.3% disclaimers in 2022 to 0.97% in 2025)
4. **P027**: Practical evaluation framework for medical AI security
5. **P032**: Health misinformation jailbreaks audited at AAAI
6. **P031**: Ethical framing of medical jailbreaking risks
7. **P034**: Continual fine-tuning as evolving defense

**Medical domain conclusion**: Medical AI is the highest-risk application domain for prompt injection. The combination of high ASR (P029), decaying defenses (P030), cultural authority exploitation (P028), and life-safety impact demands the full AEGIS delta-layer stack.

---

## 2. MITRE ATT&CK Mapping

### 2.1 Techniques Identified Across Corpus

| MITRE ID | Technique Name | Papers | Frequency |
|----------|---------------|--------|-----------|
| T1190 | Exploit Public-Facing Application | P001, P010, P026, P027, P029 | 5 |
| T1059 | Command and Scripting Interpreter | P001, P004, P018, P019, P023, P024 | 6 |
| T1027 | Obfuscated Files or Information | P009 | 1 |
| T1562.001 | Impair Defenses: Disable Tools | P009, P033 | 2 |
| T1566.002 | Phishing: Spearphishing Link | P026 | 1 |
| T1659 | Content Injection | P026, P029 | 2 |
| T1036.005 | Masquerading: Match Legitimate Name | P006 | 1 |
| T1055 | Process Injection | P006 | 1 |
| T1071 | Application Layer Protocol | P010 | 1 |
| T1195.002 | Supply Chain Compromise | P022 | 1 |
| T1565.001 | Data Manipulation: Stored Data | P022, P032 | 2 |
| T1499.004 | Application/System Exploitation | P023 | 1 |
| T1204.002 | User Execution: Malicious File | P028 | 1 |
| T1565 | Data Manipulation | P030 | 1 |

### 2.2 Tactic Distribution

| Tactic | Papers | Count |
|--------|--------|-------|
| Initial Access | P001, P010, P026, P028 | 4 |
| Execution | P001, P006, P023, P028 | 4 |
| Defense Evasion | P006, P009, P018, P019, P033 | 5 |
| Impact | P022, P023, P029, P030, P032 | 5 |
| Lateral Movement | P010 | 1 |
| Persistence | P022 | 1 |

**Observation**: Defense Evasion and Impact are the dominant tactics, reflecting the maturity of the prompt injection attack landscape. Attacks have moved beyond initial access to focus on bypassing defenses and maximizing impact.

---

## 3. Delta-Layer Analysis

### 3.1 delta0 -- RLHF Base Alignment

**Status**: NECESSARY BUT CRITICALLY INSUFFICIENT

Evidence:
- **Shallow**: P018/P019 demonstrate via gradient analysis that RLHF/DPO alignment concentrates on first response tokens only
- **Poisonable**: P022 shows adversarial RLHF platforms can corrupt delta0 at training time
- **Decaying**: P030 documents longitudinal erosion from 26.3% to 0.97% safety messaging over 3 years
- **Bypassable**: P023 shows GCG optimization and few-shot examples overcome delta0; P029 shows 94.4% ASR in medical contexts

**Defenses targeting delta0**: P017 (adversarial preference), P020 (COBRA consensus), P021 (adversarial reward training), P034 (continual fine-tuning)

**AEGIS recommendation**: Treat delta0 as probabilistic baseline, not reliable defense. Always layer with delta1-delta3. Monitor delta0 effectiveness across model versions (P030 implication).

### 3.2 delta1 -- System Prompt Defense

**Status**: PARTIAL, CONTEXT-DEPENDENT

Evidence:
- **Bypassed by context partition**: P001 (HouYi) specifically targets delta1 boundaries
- **Overridden by authority**: P028 shows medical authority impersonation defeats role anchoring
- **Circumvented by indirect injection**: P026 shows instructions in external data override system prompts
- **Eroded by few-shot**: P023 shows few-shot examples gradually override system prompt constraints

**AEGIS recommendation**: Maintain strong delta1 (safety preamble, role anchoring, boundary marking, instruction hierarchy, sandwich defense) but never rely on it alone. Particularly weak in medical domain (P029) and agent architectures (P006, P010).

### 3.3 delta2 -- Input Filtering / Syntax Analysis

**Status**: DIVERSE BUT REQUIRES CONSTANT UPDATING

Evidence:
- **Character injection bypass**: P009 shows 12 injection categories that fully evade commercial guardrails
- **ML classifiers are effective but adaptive**: P025 (DMPI-PMHFE) achieves good detection; P008 (Attention Tracker) provides novel approach; but P009 demonstrates that determined adversaries can bypass
- **Perplexity filters catch GCG**: P023 confirms perplexity-based detection works against gradient-optimized tokens
- **Embedding-based drift detection questioned**: P012/P013 question reliability of cosine similarity for semantic drift

**AEGIS recommendation**: AEGIS's 12 RagSanitizer detectors directly counter P009's 12 injection categories -- this is the strongest alignment between literature threats and AEGIS defenses. Supplement with ML classifiers (P025) and attention tracking (P008) for open-weight models.

### 3.4 delta3 -- Output Enforcement / Formal Verification

**Status**: LEAST STUDIED, MOST CRITICAL

Evidence:
- **Only defense that catches what passes through delta0-delta2**: When delta0 is shallow (P018), delta1 is bypassed (P001), and delta2 is evaded (P009), delta3 is the last line of defense
- **Medical domain urgency**: P029's 94.4% ASR proves delta0+delta1 are insufficient for medical safety; delta3's `forbidden_directive_check` and `tension_range_validation` are essential
- **PromptGuard validates the approach**: P011's layer 3 (semantic output validation) and layer 4 (adaptive response refinement) align with AEGIS delta3

**AEGIS recommendation**: AEGIS's 5 delta3 techniques are a significant contribution ahead of the literature. Expand to include medical domain-specific output constraints (FDA drug category validation, dosage range checking, contraindication enforcement).

---

## 4. Cross-Cutting Findings

### 4.1 The Recursive Judge Problem (P033)

When the guardrail model shares the same family as the base model, compromising one compromises both. This threatens:
- Multi-agent defense pipelines (P002)
- Self-policing architectures (OpenAI approach)
- Any LLM-as-judge evaluation methodology

**AEGIS mitigation**: Use heterogeneous model families for base and security audit agents. The `security_audit_agent` should run on a different model family than the primary medical robot agent.

### 4.2 The Temporal Decay Problem (P030)

Delta0 safety is not stable across model versions. As models are updated and retrained, safety mechanisms can degrade without explicit attacks. This is a form of passive threat.

**AEGIS mitigation**: Implement version-tracked delta0 attribution. Run Sep(M) benchmarks on each model version update. Alert on delta0 effectiveness degradation.

### 4.3 The Embedding Reliability Problem (P012, P013)

Cosine similarity of embeddings (used by AEGIS's `semantic_drift_guard`) may not reliably detect adversarial semantic manipulation. Antonym intrusion (P013) and regularization sensitivity (P012) create blind spots.

**AEGIS mitigation**: Calibrate `semantic_drift_guard` against known adversarial examples. Consider LLM-enhanced similarity (P015) for medical domain where standard embeddings may miss domain-specific semantics. Validate all-MiniLM-L6-v2 against Steck et al.'s criteria (P012).

### 4.4 The Agent Architecture Attack Surface (P006, P010)

Multi-agent and tool-using architectures introduce attack surfaces beyond single-model prompt injection:
- Tool selection manipulation (P006)
- Inter-agent protocol exploitation (P010)
- Supply chain compromise of agent libraries

**AEGIS mitigation**: `tool_invocation_guard` (delta3) is critical. Extend to cover inter-agent message validation and tool registry integrity verification.

---

## 5. Severity-Ranked Threat Matrix

| Rank | Paper | Threat | CVSS-like | Target Layer | AEGIS Coverage |
|------|-------|--------|-----------|-------------|----------------|
| 1 | P029 | Medical PI (94.4% ASR) | 9.8 | delta0+delta1 | delta3 compensates |
| 2 | P022 | RLHF training poisoning | 9.5 | delta0 | P020 (COBRA) addresses |
| 3 | P009 | Character injection bypass | 9.3 | delta2 | RagSanitizer 12/12 |
| 4 | P001 | HouYi context partition | 9.1 | delta1 | boundary_marking + delta2 |
| 5 | P026 | Indirect PI in the wild | 9.0 | delta0+delta1 | data_marking + Sep(M) |
| 6 | P023 | 4-strategy misalignment | 8.8 | delta0+delta1 | perplexity_filter + SVC |
| 7 | P010 | Protocol exploits | 8.7 | Cross-layer | forensic_hl7 + quarantine |
| 8 | P033 | Self-policing recursion | 8.5 | DETECT | Heterogeneous models |
| 9 | P006 | Tool selection attack | 8.4 | delta0+delta3 | tool_invocation_guard |
| 10 | P018 | Shallow alignment | 8.2 | delta0 | delta3 compensates |

---

## 6. Recommendations for AEGIS Thesis

### 6.1 Immediate Actions

1. **Validate delta3 against P029 scenarios**: Run P029-style medical injection attacks through AEGIS and measure delta3's `forbidden_directive_check` and `tension_range_validation` effectiveness. This is the strongest empirical validation opportunity.

2. **Document P009 coverage**: AEGIS RagSanitizer's 12/12 coverage of Hackett et al.'s injection categories is a significant defensive contribution. Document this as a primary thesis result.

3. **Implement version-tracked delta0 monitoring**: P030's longitudinal decay evidence demands continuous monitoring. Add model version metadata to Sep(M) measurements.

### 6.2 Thesis Positioning

1. **delta0 characterization** (P018/P019/P022/P030): AEGIS is the first framework to formalize delta0 as a named defense layer and quantify its limitations. The literature confirms delta0 is shallow, poisonable, and decaying -- but no one else has formalized it.

2. **delta-layer defense-in-depth**: The literature consistently shows that no single layer suffices (P005, P029). AEGIS's 4-layer model (delta0 through delta3) is validated by the collective findings of all 34 papers.

3. **Medical domain criticality**: P029 (JAMA) provides the strongest motivation for AEGIS's medical focus. 94.4% ASR is an alarming result from a top medical journal.

4. **Sep(M) integration** (P024): AEGIS's implementation of Zverev et al.'s separation score provides the quantitative backbone for delta-layer evaluation. This is well-grounded.

### 6.3 Literature Gaps AEGIS Can Fill

| Gap | AEGIS Contribution | Supporting Papers |
|-----|-------------------|-------------------|
| No formalized delta0 layer | Definition 3.3bis | P018, P019, P022, P030 |
| No multi-layer defense framework for medical AI | AEGIS delta0-delta3 stack | P029, P028, P034 |
| No systematic character injection defense | RagSanitizer 12/12 | P009 |
| No delta3 output enforcement in literature | 5 production techniques | P011 (partial), P029 (motivation) |
| No temporal delta0 tracking | Version-tracked Sep(M) | P030 |
| No instruction/data separation metric implementation | Sep(M) in production | P024 |

---

## 7. Statistical Notes

- Sep(M) requires N >= 30 per condition for statistical validity (P024)
- Sep(M) = 0 with 0 violations is a statistical floor artifact, not proof of perfect separation
- Wilson confidence intervals should be applied to all ASR measurements (P024)
- P029's 94.4% ASR is based on sufficient sample size (JAMA publication standards)
- P030's longitudinal analysis spans 3+ years with quantitative tracking

---

## Appendix A: Paper Classification Summary

| Category | Count | Papers |
|----------|-------|--------|
| Attack | 8 | P001, P006, P009, P010, P022, P023, P026, P033 |
| Defense | 10 | P002, P005, P007, P008, P011, P017, P020, P021, P025, P034 |
| Benchmark | 3 | P003, P004, P024 |
| Model Behavior | 2 | P018, P019 |
| Embedding/Similarity | 5 | P012, P013, P014, P015, P016 |
| Medical Domain | 6 | P027, P028, P029, P030, P031, P032 |
| **Total** | **34** | -- |

Note: P034 appears in both Defense and Medical categories.

## Appendix B: MITRE ATT&CK Techniques Referenced

14 unique MITRE ATT&CK techniques identified across 8 attack papers and 7 medical papers. Most frequent: T1059 (Command/Scripting Interpreter, 6 papers) and T1190 (Exploit Public-Facing Application, 5 papers).
