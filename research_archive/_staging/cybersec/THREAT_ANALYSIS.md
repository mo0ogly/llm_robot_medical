# THREAT_ANALYSIS.md -- Phase 3 Cybersecurity Analysis

> **Generated**: 2026-04-04
> **Scope**: 34 papers from `papers_phase1.json`
> **Framework**: AEGIS delta-layer taxonomy (delta0--delta3)
> **Cross-reference**: `backend/taxonomy/defense_taxonomy_2025.json` (66 techniques, 4 classes)

---

## ATTACK PAPERS

---

## P001: Prompt Injection attack against LLM-integrated Applications (HouYi)

**Authors**: Liu et al., 2023 | **Venue**: arXiv:2306.05499

### Attack Vector
- **MITRE ATT&CK**: T1059.006 (Command and Scripting Interpreter: Python) + T1190 (Exploit Public-Facing Application)
- **Tactic**: Initial Access / Execution
- **Severity**: Critical -- CVSS-like 9.1
- **Method**: Black-box prompt injection framework with three components: (1) pre-constructed prompts from LLM-generated context, (2) injection separator that induces context partition between developer instructions and user data, (3) malicious payload. Tested against 36 real-world LLM-integrated applications; 31 found susceptible (86.1% success rate).

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **low**. Base alignment fails because HouYi specifically crafts payloads that appear as legitimate continuations of the context.
- delta1 (System prompt): Checked -- discussed -- effectiveness: **partial**. Context partition induction explicitly targets the boundary between system prompt and user input.
- delta2 (Syntax filtering): Not discussed -- effectiveness: **none**. Paper does not address input sanitization.
- delta3 (Formal verification): Not discussed -- effectiveness: **none**. No output enforcement considered.

### AEGIS Taxonomy Cross-link
- `safety_preamble` (delta1): referenced -- HouYi bypasses preambles via context partition
- `boundary_marking` (delta1): referenced -- separator injection targets this exact defense
- `separation_tokens` (delta1): referenced -- paper shows these are insufficient alone
- `input_output_separation` (delta2): not discussed
- `classifier_guard` (delta2): not discussed

### Effectiveness Assessment
- **Scale**: Multi-model (tested on 36 integrated applications)
- **Verified**: Yes -- reproducible with public methodology
- **Limitations**: Requires knowledge of application behavior; does not address models with strong input filtering (delta2)

### Gap Analysis
- Uncovered vectors: Indirect injection via external data sources not tested
- Vulnerable delta-layers: delta0 and delta1 are primary targets; delta2 and delta3 untested

---

## P006: Prompt Injection Attack to Tool Selection in LLM Agents

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2504.19793

### Attack Vector
- **MITRE ATT&CK**: T1036.005 (Masquerading: Match Legitimate Name) + T1055 (Process Injection)
- **Tactic**: Execution / Defense Evasion
- **Severity**: High -- CVSS-like 8.4
- **Method**: Manipulates LLM agent tool selection by injecting payloads into tool descriptions or user queries that redirect the agent to invoke attacker-controlled tools instead of legitimate ones. Exploits the trust LLMs place in tool metadata.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **low**. RLHF does not train models to verify tool authenticity.
- delta1 (System prompt): Checked -- discussed -- effectiveness: **partial**. System prompts can specify allowed tools but are overridden by injection.
- delta2 (Syntax filtering): Not discussed -- effectiveness: **none**.
- delta3 (Formal verification): Not discussed -- effectiveness: **none**. Tool invocation guards (AEGIS `tool_invocation_guard`) would be relevant but are not discussed.

### AEGIS Taxonomy Cross-link
- `tool_invocation_guard` (delta3): **directly relevant** -- this defense blocks unauthorized tool calls
- `instruction_hierarchy` (delta1): referenced -- tool selection bypasses instruction priority
- `allowed_output_spec` (delta3): relevant -- constraining outputs could prevent rogue tool invocation

### Effectiveness Assessment
- **Scale**: System-wide (agent architectures with tool access)
- **Verified**: Partial -- demonstrated on specific agent frameworks
- **Limitations**: Assumes attacker can influence tool descriptions; less effective on closed tool registries

### Gap Analysis
- Uncovered vectors: Multi-hop tool chains where intermediate tools are compromised
- Vulnerable delta-layers: delta0 (no tool-awareness training), delta3 (insufficient tool invocation constraints)

---

## P009: Bypassing Prompt Injection and Jailbreak Detection in LLM Guardrails

**Authors**: Unknown et al. (Hackett et al.), 2025 | **Venue**: arXiv:2504.11168

### Attack Vector
- **MITRE ATT&CK**: T1027 (Obfuscated Files or Information) + T1562.001 (Impair Defenses: Disable or Modify Tools)
- **Tactic**: Defense Evasion
- **Severity**: Critical -- CVSS-like 9.3
- **Method**: Character injection techniques (homoglyphs, invisible Unicode, mixed encoding, emoji smuggling, BiDi overrides, diacritics, fullwidth substitution, upside-down text, etc.) that evade detection classifiers while preserving semantic payload for the target LLM. Demonstrates 12 distinct character injection categories. Achieves full evasion of commercial guardrails (Azure Prompt Shield, ProtectAI, Meta Prompt Guard).

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **partial**. Base RLHF may still block semantically harmful content even when encoding bypasses delta2, but this is inconsistent.
- delta1 (System prompt): Not discussed -- effectiveness: **low**. Character injection does not target system prompts directly.
- delta2 (Syntax filtering): Checked -- discussed -- effectiveness: **bypassed**. This is the primary target. All tested guardrails are defeated.
- delta3 (Formal verification): Not discussed -- effectiveness: **unknown**.

### AEGIS Taxonomy Cross-link
- `invisible_unicode_detection` (delta2): **directly targeted** -- paper shows bypass
- `homoglyph_normalization` (delta2): **directly targeted** -- paper shows bypass
- `mixed_encoding_detection` (delta2): **directly targeted** -- paper shows bypass
- `emoji_smuggling_detection` (delta2): **directly targeted** -- paper shows bypass
- `unicode_tag_detection` (delta2): **directly targeted**
- `bidi_override_detection` (delta2): **directly targeted**
- `deletion_char_detection` (delta2): **directly targeted**
- `fullwidth_normalization` (delta2): **directly targeted**
- `diacritics_detection` (delta2): **directly targeted**
- `upside_down_detection` (delta2): **directly targeted**
- `underline_accent_detection` (delta2): **directly targeted**
- `number_injection_detection` (delta2): **directly targeted**
- All 12 AEGIS RagSanitizer detectors are responses to techniques cataloged in this paper.

### Effectiveness Assessment
- **Scale**: Multi-model (tested against 6 commercial guardrails)
- **Verified**: Yes -- reproducible; AEGIS implements 12/12 countering detectors
- **Limitations**: Assumes guardrails rely on character-level pattern matching; semantic-level defenses (delta0) may still catch harmful intent

### Gap Analysis
- Uncovered vectors: Compositional attacks combining character injection with multi-turn context poisoning
- Vulnerable delta-layers: delta2 is completely compromised without normalization; delta0 provides inconsistent fallback

---

## P010: From Prompt Injections to Protocol Exploits in LLM-powered AI Agent Workflows

**Authors**: Unknown et al., 2025 | **Venue**: ScienceDirect (Computers & Security)

### Attack Vector
- **MITRE ATT&CK**: T1071 (Application Layer Protocol) + T1190 (Exploit Public-Facing Application)
- **Tactic**: Initial Access / Lateral Movement
- **Severity**: High -- CVSS-like 8.7
- **Method**: Extends prompt injection to protocol-level exploits in multi-agent workflows. Identifies attack surfaces at inter-agent communication channels, API boundaries, and data serialization layers. Demonstrates escalation from prompt injection to full workflow compromise.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **low**. RLHF alignment is per-model, not per-workflow; inter-agent trust boundaries are unprotected.
- delta1 (System prompt): Checked -- discussed -- effectiveness: **partial**. Per-agent system prompts cannot enforce cross-agent policies.
- delta2 (Syntax filtering): Checked -- discussed -- effectiveness: **partial**. Input filtering at agent boundaries helps but serialization attacks bypass it.
- delta3 (Formal verification): Not discussed -- effectiveness: **none**.

### AEGIS Taxonomy Cross-link
- `forensic_hl7_analysis` (DETECT): relevant -- protocol-level analysis
- `session_termination` (RESP): relevant -- cutting compromised agent sessions
- `quarantine_action` (RESP): relevant -- isolating compromised agents

### Effectiveness Assessment
- **Scale**: System-wide (multi-agent architectures)
- **Verified**: Partial -- threat model is theoretical with proof-of-concept demonstrations
- **Limitations**: Requires complex multi-agent deployment; single-model deployments are not affected

### Gap Analysis
- Uncovered vectors: Supply chain poisoning of agent tool libraries
- Vulnerable delta-layers: All layers are vulnerable at inter-agent boundaries where delta enforcement is per-agent, not per-workflow

---

## P022: LLM Misalignment via Adversarial RLHF Platforms

**Authors**: Entezami & Naseh, 2025 | **Venue**: arXiv:2503.03039

### Attack Vector
- **MITRE ATT&CK**: T1195.002 (Supply Chain Compromise: Compromise Software Supply Chain) + T1565.001 (Data Manipulation: Stored Data Manipulation)
- **Tactic**: Impact / Persistence
- **Severity**: Critical -- CVSS-like 9.5
- **Method**: Demonstrates that adversarial RLHF platforms can inject poisoned feedback during the fine-tuning process, inducing systematic misalignment in the resulting model. The attack is persistent (embedded in model weights) and difficult to detect post-deployment. Targets the delta0 layer directly by corrupting the alignment training process.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **compromised**. This IS the attack target. delta0 itself is poisoned.
- delta1 (System prompt): Not discussed -- effectiveness: **unknown** (may partially compensate for poisoned delta0).
- delta2 (Syntax filtering): Not discussed -- effectiveness: **irrelevant** (attack operates at training time, not inference).
- delta3 (Formal verification): Not discussed -- effectiveness: **potentially effective** if output constraints catch misaligned responses.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **directly compromised** -- the training process itself is the attack vector
- `dpo_alignment` (delta0): **directly compromised** -- alternative alignment methods are also vulnerable
- `red_team_training` (delta0): relevant -- red team evaluation during training could detect poisoning
- `delta0_attribution` (MEAS): **critical** -- attribution analysis could reveal delta0 degradation

### Effectiveness Assessment
- **Scale**: System-wide (any model trained on compromised platform)
- **Verified**: Partial -- demonstrated conceptually; full-scale verification requires access to RLHF training pipelines
- **Limitations**: Requires access to training infrastructure; detected if training data is audited

### Gap Analysis
- Uncovered vectors: Subtle poisoning that passes automated safety evaluations
- Vulnerable delta-layers: delta0 is the primary and sole target; if delta0 falls, downstream layers must compensate

---

## P023: Safety Misalignment Against Large Language Models

**Authors**: Unknown et al., 2025 | **Venue**: NDSS 2025

### Attack Vector
- **MITRE ATT&CK**: T1059.006 (Command and Scripting Interpreter) + T1499.004 (Application or System Exploitation)
- **Tactic**: Execution / Impact
- **Severity**: High -- CVSS-like 8.8
- **Method**: Evaluates four attack strategies for inducing safety misalignment: (1) direct request, (2) zero-shot rewriting, (3) few-shot examples, (4) greedy coordinate gradient (GCG) optimization. Finds that gradient-based optimization achieves highest ASR but that simpler techniques are often sufficient against weaker models.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **variable**. Direct requests are blocked by strong delta0; GCG optimization bypasses it.
- delta1 (System prompt): Checked -- discussed -- effectiveness: **partial**. Few-shot examples erode system prompt constraints.
- delta2 (Syntax filtering): Checked -- discussed -- effectiveness: **partial**. GCG-generated tokens are detectable by perplexity filters.
- delta3 (Formal verification): Not discussed -- effectiveness: **none**.

### AEGIS Taxonomy Cross-link
- `perplexity_filter` (delta2): relevant -- GCG tokens have high perplexity
- `adversarial_training` (delta2): relevant -- training against adversarial inputs
- `svc_composite_score` (DETECT): relevant -- composite scoring can flag misalignment patterns
- `semantic_drift_guard` (delta2): relevant -- detecting semantic deviation from expected behavior

### Effectiveness Assessment
- **Scale**: Multi-model (tested on multiple open and closed models)
- **Verified**: Yes -- GCG optimization is reproducible; published at NDSS (top security venue)
- **Limitations**: GCG requires white-box access or transferable suffixes; zero-shot/few-shot less effective on frontier models

### Gap Analysis
- Uncovered vectors: Combining GCG with character injection for multi-layer bypass
- Vulnerable delta-layers: delta0 (gradient optimization), delta1 (few-shot erosion)

---

## P026: Indirect Prompt Injection in the Wild for LLM Systems

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2601.07072

### Attack Vector
- **MITRE ATT&CK**: T1566.002 (Phishing: Spearphishing Link) + T1659 (Content Injection)
- **Tactic**: Initial Access / Execution
- **Severity**: Critical -- CVSS-like 9.0
- **Method**: Studies indirect prompt injection where malicious instructions are embedded in external content (web pages, documents, emails) consumed by LLM agents. The LLM cannot distinguish between legitimate data and injected instructions within retrieved content. Demonstrates real-world exploitation scenarios.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **low**. RLHF does not train models to distinguish instructions-in-data from genuine instructions.
- delta1 (System prompt): Checked -- discussed -- effectiveness: **partial**. Instruction hierarchy helps but is overridden by well-crafted indirect injections.
- delta2 (Syntax filtering): Checked -- discussed -- effectiveness: **partial**. Data marking and input/output separation could help.
- delta3 (Formal verification): Not discussed -- effectiveness: **none**.

### AEGIS Taxonomy Cross-link
- `data_marking` (delta2): **directly relevant** -- marking data boundaries to distinguish from instructions
- `input_output_separation` (delta2): **directly relevant** -- separating data channels
- `instruction_hierarchy` (delta1): referenced -- indirect injection circumvents hierarchy
- `separation_score_sep_m` (DETECT): **critical metric** -- Sep(M) directly measures instruction/data separation capability
- `hidden_markup_detection` (delta2): relevant -- detecting hidden instructions in documents

### Effectiveness Assessment
- **Scale**: System-wide (any RAG or agent system consuming external content)
- **Verified**: Yes -- real-world demonstrations provided
- **Limitations**: Effectiveness depends on the quality and stealth of injected content

### Gap Analysis
- Uncovered vectors: Multi-modal indirect injection (images containing text instructions)
- Vulnerable delta-layers: delta0 (fundamental inability to separate instruction from data at inference), delta1 (hierarchy violations)

---

## P033: OpenAI Guardrails Bypass: The Self-Policing LLM Vulnerability

**Authors**: HiddenLayer Research, 2024 | **Venue**: HiddenLayer Research Report

### Attack Vector
- **MITRE ATT&CK**: T1562.001 (Impair Defenses: Disable or Modify Tools)
- **Tactic**: Defense Evasion
- **Severity**: High -- CVSS-like 8.5
- **Method**: Demonstrates that when the base model and the judge/guardrail model share the same architecture or training, prompt injection that compromises the base model also compromises the judge. Self-policing architectures inherit the vulnerabilities of their base model, creating a recursive vulnerability.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **compromised recursively**. If delta0 is bypassed in the base model, the judge model's delta0 is equally bypassed.
- delta1 (System prompt): Checked -- discussed -- effectiveness: **partial**. Different system prompts for judge vs base model provide some separation.
- delta2 (Syntax filtering): Not discussed -- effectiveness: **irrelevant** (attack targets the LLM judgment layer, not input format).
- delta3 (Formal verification): Not discussed -- effectiveness: **potentially effective** if verification is model-independent.

### AEGIS Taxonomy Cross-link
- `security_audit_agent` (DETECT): **directly relevant** -- AEGIS uses a separate audit agent; must ensure it does not share base model vulnerabilities
- `svc_composite_score` (DETECT): relevant -- external scoring independent of model judgment
- `classifier_guard` (delta2): relevant -- if classifier is model-based, same vulnerability applies

### Effectiveness Assessment
- **Scale**: System-wide (any LLM-as-judge architecture)
- **Verified**: Yes -- demonstrated on OpenAI platform
- **Limitations**: Mitigated by using heterogeneous models for base and judge; AEGIS multi-model approach provides defense

### Gap Analysis
- Uncovered vectors: Cascading compromise across multi-agent systems sharing model families
- Vulnerable delta-layers: delta0 (recursive vulnerability), DETECT class (judge corruption)

---

## DEFENSE PAPERS

---

## P002: A Multi-Agent LLM Defense Pipeline Against Prompt Injection Attacks

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2509.14285

### Attack Vector Addressed
- Prompt injection (direct and indirect)

### Defense Mechanism
- Multi-agent pipeline where specialized LLM agents coordinate to detect and neutralize prompt injection in real-time. Each agent handles a specific defense function (input analysis, context verification, output validation).

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- leveraged -- effectiveness: **enhanced** by agent consensus.
- delta1 (System prompt): Checked -- leveraged -- each agent has specialized system prompts.
- delta2 (Syntax filtering): Checked -- discussed -- agent-level input filtering.
- delta3 (Formal verification): Not discussed -- no formal output constraints.

### AEGIS Taxonomy Cross-link
- `security_audit_agent` (DETECT): **directly aligned** -- AEGIS already implements multi-agent audit
- `quarantine_action` (RESP): relevant -- agent pipeline can quarantine suspect inputs
- `response_blocking` (RESP): relevant -- pipeline can block compromised outputs

### Effectiveness Assessment
- **Scale**: System-wide
- **Verified**: Partial -- framework proposed; limited empirical validation
- **Limitations**: Susceptible to P033 vulnerability (shared model family across agents); latency overhead from multi-agent coordination

### Gap Analysis
- Does not address adversarial RLHF (P022); agents share delta0 vulnerabilities
- No formal verification layer (delta3)

---

## P005: Indirect Prompt Injections: Are Firewalls All You Need, or Stronger Benchmarks?

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2510.05244

### Attack Vector Addressed
- Indirect prompt injection via external content

### Defense Mechanism
- Evaluates firewall-based defenses (input/output filtering) against indirect prompt injection. Argues that current benchmarks overestimate defense effectiveness due to simplistic attack scenarios. Proposes stronger benchmark criteria.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **insufficient alone**.
- delta1 (System prompt): Checked -- discussed -- effectiveness: **insufficient alone**.
- delta2 (Syntax filtering): Checked -- primary focus -- effectiveness: **variable** depending on benchmark difficulty.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `classifier_guard` (delta2): evaluated -- paper tests classifier-based firewalls
- `perplexity_filter` (delta2): evaluated -- paper tests perplexity-based detection
- `mpib_safe_evaluation` (MEAS): **directly relevant** -- AEGIS evaluation harness addresses the benchmark weakness identified

### Effectiveness Assessment
- **Scale**: Multi-model (benchmark across multiple defense solutions)
- **Verified**: Yes -- benchmark methodology is reproducible
- **Limitations**: Demonstrates that no single firewall is sufficient; argues for layered defense (supports AEGIS delta-layer approach)

### Gap Analysis
- Confirms need for defense-in-depth; single-layer defenses are insufficient
- Supports AEGIS thesis that delta0 through delta3 must operate in concert

---

## P007: Securing Large Language Models from Prompt Injection Attacks

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2512.01326

### Attack Vector Addressed
- General prompt injection (direct and indirect)

### Defense Mechanism
- Proposes practical defense mechanisms including input sanitization, output validation, and model-level hardening. Surveys existing approaches and evaluates their effectiveness.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **necessary but insufficient**.
- delta1 (System prompt): Checked -- discussed -- effectiveness: **partial**.
- delta2 (Syntax filtering): Checked -- discussed -- effectiveness: **recommended**.
- delta3 (Formal verification): Checked -- discussed -- effectiveness: **recommended for critical applications**.

### AEGIS Taxonomy Cross-link
- `safety_preamble` (delta1): discussed
- `input_redaction` (RESP): discussed
- `response_sanitization` (delta3): discussed
- `allowed_output_spec` (delta3): discussed

### Effectiveness Assessment
- **Scale**: Survey scope -- evaluates multiple techniques across models
- **Verified**: Review paper -- individual techniques have varying verification levels
- **Limitations**: Survey nature means no novel defense; synthesis value for practitioners

### Gap Analysis
- Confirms delta-layered defense model; no single technique suffices
- Does not address delta0 poisoning (P022) or character injection bypass (P009)

---

## P008: Attention Tracker: Detecting Prompt Injection Attacks in LLMs

**Authors**: Unknown et al., 2024 | **Venue**: arXiv:2411.00348 / NAACL 2025 Findings

### Attack Vector Addressed
- Direct and indirect prompt injection detection via attention pattern analysis

### Defense Mechanism
- Training-free detection method that monitors attention patterns on instructions. Observes that during prompt injection, attention shifts from original instruction tokens to injected instruction tokens in important attention heads. No additional model training required.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Not discussed -- operates independently of alignment.
- delta1 (System prompt): Checked -- monitors attention to system prompt tokens specifically.
- delta2 (Syntax filtering): Checked -- complements input filtering with attention-based detection.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `classifier_guard` (delta2): **directly related** -- attention tracker is a novel classifier type
- `detection_profile_svc` (DETECT): relevant -- attention patterns could feed SVC scoring
- `semantic_drift_guard` (delta2): related -- attention drift correlates with semantic drift

### Effectiveness Assessment
- **Scale**: Single model (requires access to attention weights)
- **Verified**: Yes -- published at NAACL 2025; reproducible
- **Limitations**: Requires white-box access to attention heads; not applicable to closed API models; unknown effectiveness against character injection (P009)

### Gap Analysis
- Cannot defend against delta0 poisoning; operates at inference only
- Novel and promising for open-weight models; useless for API-only access

---

## P011: PromptGuard: A Structured Framework for Injection Resilient Language Models

**Authors**: Unknown et al., 2025 | **Venue**: Scientific Reports (Nature)

### Attack Vector Addressed
- General prompt injection with structured defense approach

### Defense Mechanism
- Modular four-layer framework: (1) Input gatekeeping (pattern matching + ML classification), (2) Structured prompt formatting (template-based safe zones), (3) Semantic output validation (checking output coherence), (4) Adaptive response refinement (iterative correction). Achieves 67% reduction in injection success rate and F1-score of 0.91.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Not discussed -- framework is external to model training.
- delta1 (System prompt): Checked -- structured prompt formatting aligns with delta1 defenses.
- delta2 (Syntax filtering): Checked -- input gatekeeping is a delta2 defense.
- delta3 (Formal verification): Checked -- semantic output validation and response refinement are delta3 mechanisms.

### AEGIS Taxonomy Cross-link
- `classifier_guard` (delta2): **directly implemented** -- input gatekeeping layer
- `struq_structured_queries` (delta2): **directly aligned** -- structured prompt formatting
- `allowed_output_spec` (delta3): **directly aligned** -- output validation layer
- `response_sanitization` (delta3): **directly aligned** -- adaptive refinement layer
- `forbidden_directive_check` (delta3): relevant

### Effectiveness Assessment
- **Scale**: Multi-model (framework-agnostic)
- **Verified**: Yes -- published in Nature Scientific Reports; quantitative metrics provided
- **Limitations**: 67% reduction means 33% of attacks still succeed; does not address character injection (P009) or delta0 poisoning (P022)

### Gap Analysis
- Strongest multi-layer defense paper in the corpus; covers delta1, delta2, delta3
- Missing delta0 integration; vulnerable to training-time attacks
- 33% residual attack success rate is concerning for critical medical applications

---

## P017: Adversarial Preference Learning for Robust LLM Alignment

**Authors**: Unknown et al., 2025 | **Venue**: ACL 2025 Findings

### Attack Vector Addressed
- Adversarial attacks on RLHF preference learning

### Defense Mechanism
- Incorporates adversarial examples into preference learning during RLHF training. The reward model is trained on adversarially-generated preference pairs to improve robustness against manipulation of the alignment process.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- **primary focus** -- effectiveness: **enhanced**. Directly strengthens delta0 against adversarial inputs.
- delta1 (System prompt): Not discussed.
- delta2 (Syntax filtering): Not discussed.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **directly enhanced** -- adversarial preference learning is an upgrade to standard RLHF
- `adversarial_training` (delta2): conceptually related -- adversarial training applied at delta0 level
- `red_team_training` (delta0): complementary -- red teaming generates adversarial examples for training

### Effectiveness Assessment
- **Scale**: Single model (training-time defense)
- **Verified**: Partial -- ACL findings track; experiments on specific models
- **Limitations**: Training-time only; cannot retrofit deployed models; effectiveness against P022 (adversarial RLHF platforms) is unclear

### Gap Analysis
- Strengthens delta0 but does not address delta1-delta3
- No defense against poisoned training pipelines (P022 scenario)

---

## P020: COBRA -- Consensus Based Reward Aggregation for Mitigating Malicious RLHF Feedback

**Authors**: Unknown et al., 2025 | **Venue**: Scientific Reports (Nature)

### Attack Vector Addressed
- Malicious feedback injection during RLHF training

### Defense Mechanism
- COBRA framework uses trusted cohorts and dynamic variance-guided attention mechanisms for reward aggregation. Detects and downweights malicious feedback signals by comparing against consensus from trusted evaluators.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- **primary focus** -- effectiveness: **high**. Directly addresses delta0 poisoning by filtering malicious RLHF feedback.
- delta1 (System prompt): Not discussed.
- delta2 (Syntax filtering): Not discussed.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **directly protected** -- COBRA secures the RLHF training pipeline
- `constitutional_ai` (delta0): complementary -- Constitutional AI provides rule-based oversight; COBRA provides consensus-based oversight
- `delta0_attribution` (MEAS): relevant -- COBRA's variance analysis could feed attribution metrics

### Effectiveness Assessment
- **Scale**: Single model (training infrastructure defense)
- **Verified**: Yes -- published in Nature Scientific Reports; quantitative evaluation
- **Limitations**: Requires trusted cohort establishment; does not address post-training attacks

### Gap Analysis
- Strong delta0 defense; directly counters P022 threat
- Does not protect delta1-delta3; must be combined with inference-time defenses

---

## P021: Adversarial Training of Reward Models

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2504.06141

### Attack Vector Addressed
- Reward model manipulation during RLHF

### Defense Mechanism
- Incorporates adversarial responses into reward model training data to increase robustness. The reward model learns to correctly score adversarial examples, preventing reward hacking and misalignment during RLHF.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- **primary focus** -- effectiveness: **enhanced**.
- delta1 (System prompt): Not discussed.
- delta2 (Syntax filtering): Not discussed.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **directly enhanced**
- `adversarial_training` (delta2): conceptually related -- adversarial training principle applied at reward model level
- `red_team_training` (delta0): complementary

### Effectiveness Assessment
- **Scale**: Single model (reward model hardening)
- **Verified**: Partial -- preprint stage
- **Limitations**: Only strengthens reward model; does not prevent data poisoning of training set itself (P022 scenario)

### Gap Analysis
- Complements P017 and P020; all three target delta0 from different angles
- None individually sufficient; combined with P020's consensus approach would be stronger

---

## P025: DMPI-PMHFE -- Detection Method for Prompt Injection by Integrating Pre-trained Model and Heuristic Feature Engineering

**Authors**: Unknown et al., 2024 | **Venue**: Springer LNCS

### Attack Vector Addressed
- Prompt injection detection via dual-channel classification

### Defense Mechanism
- Dual-channel feature fusion framework: (1) DeBERTa pre-trained model for semantic understanding, (2) Heuristic feature engineering for syntactic pattern detection. Combines both channels for robust prompt injection classification.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Not discussed.
- delta1 (System prompt): Not discussed.
- delta2 (Syntax filtering): Checked -- **primary focus** -- effectiveness: **high** for known patterns.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `classifier_guard` (delta2): **directly implemented** -- DeBERTa-based classifier
- `perplexity_filter` (delta2): related -- heuristic features include perplexity-like metrics
- `task_specific_finetuning` (delta2): **directly implemented** -- fine-tuned detection model

### Effectiveness Assessment
- **Scale**: Single model (detection classifier)
- **Verified**: Yes -- published in Springer LNCS; F1 scores reported
- **Limitations**: Vulnerable to character injection bypass (P009); heuristic features are pattern-specific

### Gap Analysis
- Strong delta2 defense but vulnerable to adaptive adversaries (P009)
- No delta0, delta1, or delta3 coverage

---

## P034: Investigating the Effectiveness of Continual Fine-Tuning in Defending Against Medical Adversarial Attacks

**Authors**: Unknown et al., 2025 | **Venue**: arXiv (estimated)

### Attack Vector Addressed
- Medical adversarial attacks (evolving attack patterns)

### Defense Mechanism
- Continual Fine-Tuning (CFT): iteratively updates model safety alignment as new attack patterns emerge. Emphasizes domain-specific safety alignment for medical contexts and balances safety with clinical utility.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- **primary focus** -- effectiveness: **enhanced iteratively**. CFT continuously strengthens delta0 against evolving threats.
- delta1 (System prompt): Checked -- discussed -- medical domain system prompts updated alongside CFT.
- delta2 (Syntax filtering): Not discussed.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **directly enhanced** -- CFT extends initial RLHF with ongoing alignment updates
- `task_specific_finetuning` (delta2): conceptually related -- domain-specific tuning applied at delta0 level
- `mpib_safe_evaluation` (MEAS): relevant -- CFT requires continuous evaluation benchmarks

### Effectiveness Assessment
- **Scale**: Single model (domain-specific fine-tuning)
- **Verified**: Partial -- ongoing research; medical domain specificity limits generalizability
- **Limitations**: Catastrophic forgetting risk; safety-utility tradeoff in medical domain; requires continuous attack monitoring

### Gap Analysis
- Unique contribution: evolving defense for medical domain
- Does not address delta2/delta3; vulnerable to character injection (P009) and protocol exploits (P010)

---

## BENCHMARK PAPERS

---

## P003: Prompt Injection Attacks in Large Language Models and AI Agent Systems: A Comprehensive Review

**Authors**: Unknown et al., 2025 | **Venue**: Information (MDPI), 17(1), 54

### Attack Vector
- **MITRE ATT&CK**: Survey -- covers T1059, T1190, T1566, T1027
- **Tactic**: Survey (all tactics covered)
- **Severity**: N/A (review paper)

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **surveyed across papers**.
- delta1 (System prompt): Checked -- discussed -- effectiveness: **surveyed**.
- delta2 (Syntax filtering): Checked -- discussed -- effectiveness: **surveyed**.
- delta3 (Formal verification): Checked -- discussed -- effectiveness: **surveyed but rare**.

### AEGIS Taxonomy Cross-link
- Broad survey; references multiple AEGIS-aligned defense techniques without specific depth.

### Effectiveness Assessment
- **Scale**: Survey scope
- **Verified**: Review paper -- synthesizes existing work
- **Limitations**: No novel contribution; value is in comprehensive coverage

### Gap Analysis
- Confirms delta-layer model covers all surveyed defense categories
- Identifies formal verification (delta3) as least explored area

---

## P004: WASP -- Benchmarking Web Agent Security Against Prompt Injection Attacks

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2504.18575

### Attack Vector
- **MITRE ATT&CK**: T1190 (Exploit Public-Facing Application) + T1059 (Command and Scripting Interpreter)
- **Tactic**: Initial Access / Execution
- **Severity**: High -- CVSS-like 8.0 (benchmark context)

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- evaluated -- effectiveness: **variable across models**.
- delta1 (System prompt): Checked -- evaluated -- effectiveness: **variable**.
- delta2 (Syntax filtering): Not the focus.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `mpib_safe_evaluation` (MEAS): **directly aligned** -- WASP provides a benchmark similar to AEGIS evaluation harness
- `multi_trial_sampling` (MEAS): relevant -- benchmark uses multiple trials per scenario
- `separation_score_sep_m` (DETECT): relevant -- benchmark measures agent compliance deviation

### Effectiveness Assessment
- **Scale**: Multi-model (benchmark across web agents)
- **Verified**: Yes -- reproducible benchmark with public methodology
- **Limitations**: Web-agent specific; not directly applicable to medical domain

### Gap Analysis
- Validates need for domain-specific benchmarks (AEGIS provides medical-domain equivalent)
- Does not address delta2 or delta3 defenses

---

## P024: Can LLMs Separate Instructions from Data? And What Do We Even Mean by That?

**Authors**: Zverev et al., 2025 | **Venue**: ICLR 2025

### Attack Vector
- **MITRE ATT&CK**: T1059 (Command and Scripting Interpreter) -- foundational measurement
- **Tactic**: Measurement (not attack)
- **Severity**: N/A (metric definition paper)

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- **quantified** -- Sep(M) measures delta0 separation capability.
- delta1 (System prompt): Checked -- **quantified** -- Sep(M) with/without system prompt decomposes delta0 vs delta1 contributions.
- delta2 (Syntax filtering): Not the focus.
- delta3 (Formal verification): Not the focus.

### AEGIS Taxonomy Cross-link
- `separation_score_sep_m` (DETECT): **foundational paper** -- defines the metric AEGIS implements
- `delta0_attribution` (MEAS): **directly enabled** -- Sep(M) decomposition enables delta0 attribution
- `delta_layer_decomposition` (MEAS): **foundational** -- Zverev's framework is the basis for AEGIS decomposition
- `wilson_confidence_interval` (DETECT): used in Sep(M) calculation for statistical validity

### Effectiveness Assessment
- **Scale**: Multi-model (tested across multiple LLMs)
- **Verified**: Yes -- ICLR 2025 (top venue); reproducible; AEGIS implements the metric
- **Limitations**: Requires N >= 30 per condition for statistical validity; Sep(M) = 0 with 0 violations is a floor artifact

### Gap Analysis
- Foundational to AEGIS thesis; no gap -- fully integrated
- Does not prescribe defenses; purely measurement

---

## MODEL BEHAVIOR PAPERS

---

## P018: Safety Alignment Should Be Made More Than Just a Few Tokens Deep

**Authors**: Unknown et al., 2025 | **Venue**: ICLR 2025

### Attack Vector
- **MITRE ATT&CK**: T1059 (Command and Scripting Interpreter) -- vulnerability analysis
- **Tactic**: Defense Evasion (via prefilling attacks)
- **Severity**: High -- CVSS-like 8.2

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- **primary finding** -- effectiveness: **shallow**. RLHF/DPO alignment concentrates behavioral shifts in the first few tokens of the response. Prefilling attacks that bypass initial tokens circumvent delta0 entirely.
- delta1 (System prompt): Not discussed directly.
- delta2 (Syntax filtering): Not discussed.
- delta3 (Formal verification): Implicitly supported -- output enforcement would catch harmful content regardless of token position.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **critically evaluated** -- demonstrates fundamental weakness
- `dpo_alignment` (delta0): **critically evaluated** -- same shallow alignment problem
- `delta0_attribution` (MEAS): **essential** -- paper's findings directly inform attribution methodology
- `tension_range_validation` (delta3): relevant -- output-level checking compensates for shallow delta0

### Effectiveness Assessment
- **Scale**: Multi-model (ICLR 2025; tested on multiple architectures)
- **Verified**: Yes -- reproducible gradient analysis
- **Limitations**: Analysis-focused; proposes "deeper alignment" but no concrete implementation

### Gap Analysis
- Foundational for understanding delta0 limitations
- Directly supports AEGIS thesis that delta0 alone is insufficient (formal framework Section 2.0)

---

## P019: Why Is RLHF Alignment Shallow? A Gradient Analysis

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2603.04851

### Attack Vector
- **MITRE ATT&CK**: T1059 -- vulnerability analysis (gradient-level)
- **Tactic**: Defense Evasion (understanding mechanism)
- **Severity**: High -- CVSS-like 8.0 (analysis impact)

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- **primary finding** -- effectiveness: **explained as inherently shallow**. Gradient analysis reveals that RLHF loss gradients concentrate on early token positions, causing alignment to be structurally shallow.
- delta1 (System prompt): Not discussed.
- delta2 (Syntax filtering): Not discussed.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **mechanism explained** -- provides theoretical basis for delta0 weakness
- `dpo_alignment` (delta0): **mechanism explained** -- same gradient concentration issue
- `delta0_attribution` (MEAS): **essential** -- gradient analysis informs what delta0 actually protects

### Effectiveness Assessment
- **Scale**: Multi-model (gradient analysis across architectures)
- **Verified**: Partial -- preprint; gradient analysis methodology is reproducible
- **Limitations**: Mechanistic understanding without proposed fix; complements P018

### Gap Analysis
- Explains WHY delta0 is weak; P018 shows THAT it is weak
- Together they form the theoretical foundation for delta0 in AEGIS framework

---

## EMBEDDING / SIMILARITY PAPERS

---

## P012: Is Cosine-Similarity of Embeddings Really About Similarity?

**Authors**: Steck et al., 2024 | **Venue**: arXiv:2403.05440 / ACM Web Conference 2024

### Attack Vector
- **MITRE ATT&CK**: N/A (measurement methodology)
- **Tactic**: N/A
- **Severity**: N/A

### delta-Layer Defense Coverage
- delta0-delta3: Not directly applicable. Relevant to the cosine drift measurement used by AEGIS's `semantic_drift_guard`.

### AEGIS Taxonomy Cross-link
- `semantic_drift_guard` (delta2): **foundational critique** -- questions reliability of cosine similarity for detecting semantic drift
- `separation_score_sep_m` (DETECT): relevant -- Sep(M) uses embedding-based measurements

### Effectiveness Assessment
- **Scale**: Methodological (embedding analysis)
- **Verified**: Yes -- ACM Web Conference 2024
- **Limitations**: Shows cosine similarity can be unreliable depending on embedding method and regularization

### Gap Analysis
- Implies AEGIS's cosine-based drift detection needs calibration against specific embedding models
- all-MiniLM-L6-v2 (AEGIS default) should be validated against Steck et al.'s criteria

---

## P013: Beyond Cosine Similarity: Taming Semantic Drift and Antonym Intrusion

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2601.13251

### Attack Vector
- **MITRE ATT&CK**: N/A
- **Tactic**: N/A
- **Severity**: N/A

### delta-Layer Defense Coverage
- Relevant to delta2 semantic drift detection. Addresses the blind spot where neural embeddings cannot distinguish synonyms from antonyms.

### AEGIS Taxonomy Cross-link
- `semantic_drift_guard` (delta2): **directly relevant** -- antonym intrusion is a failure mode for drift detection

### Effectiveness Assessment
- **Scale**: Methodological
- **Verified**: Partial -- preprint
- **Limitations**: Proposes methods but not validated in adversarial security context

### Gap Analysis
- AEGIS drift guard may fail to detect adversarial rephrasing using antonym substitution
- Recommendation: integrate antonym-aware similarity metrics

---

## P014: SemScore -- Evaluating LLMs with Semantic Similarity

**Authors**: Geronimo et al., 2024 | **Venue**: HuggingFace Blog / Medium

### Attack Vector
- **MITRE ATT&CK**: N/A
- **Tactic**: N/A
- **Severity**: N/A

### delta-Layer Defense Coverage
- Relevant to DETECT class metrics for evaluating LLM output quality.

### AEGIS Taxonomy Cross-link
- `svc_composite_score` (DETECT): relevant -- SemScore could complement SVC scoring
- `semantic_drift_guard` (delta2): relevant -- uses similar embedding-based metrics

### Effectiveness Assessment
- **Scale**: Methodological
- **Verified**: Blog/informal -- not peer-reviewed
- **Limitations**: Informal publication; limited validation

### Gap Analysis
- Low priority for AEGIS; SVC already provides a more comprehensive scoring mechanism

---

## P015: Reasoning before Comparison: LLM-Enhanced Semantic Similarity Metrics

**Authors**: Unknown et al., 2024 | **Venue**: arXiv:2402.11398

### Attack Vector
- **MITRE ATT&CK**: N/A
- **Tactic**: N/A
- **Severity**: N/A

### delta-Layer Defense Coverage
- Relevant to delta2 semantic analysis. LLM-enhanced similarity could improve drift detection accuracy in domain-specialized texts (e.g., medical).

### AEGIS Taxonomy Cross-link
- `semantic_drift_guard` (delta2): relevant -- LLM-enhanced metrics could replace raw cosine similarity

### Effectiveness Assessment
- **Scale**: Methodological
- **Verified**: Partial -- preprint
- **Limitations**: Adds LLM inference overhead to similarity computation

### Gap Analysis
- Potential improvement for AEGIS drift guard in medical domain where standard embeddings may miss domain-specific semantics

---

## P016: Advancing Robust and Aligned Measures of Semantic Similarity

**Authors**: Unknown et al., 2024 | **Venue**: UC Berkeley EECS Tech Report EECS-2024-84

### Attack Vector
- **MITRE ATT&CK**: N/A
- **Tactic**: N/A
- **Severity**: N/A

### delta-Layer Defense Coverage
- Relevant to DETECT/MEAS metrics. Advances robust similarity measures that are better aligned with human judgment.

### AEGIS Taxonomy Cross-link
- `semantic_drift_guard` (delta2): relevant -- robust similarity measures improve detection reliability
- `svc_composite_score` (DETECT): relevant -- could improve SVC's semantic component

### Effectiveness Assessment
- **Scale**: Methodological
- **Verified**: Tech report -- institutional quality but not peer-reviewed
- **Limitations**: Academic contribution; no direct security application demonstrated

### Gap Analysis
- Background work supporting AEGIS measurement infrastructure; not directly actionable

---

## MEDICAL DOMAIN PAPERS

---

## P027: A Practical Framework for Evaluating Medical AI Security

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2512.08185

### Attack Vector
- **MITRE ATT&CK**: T1190 (Exploit Public-Facing Application) in medical context
- **Tactic**: Impact (patient safety)
- **Severity**: Critical -- CVSS-like 9.4 (medical domain amplification)

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- evaluated across clinical specialties -- effectiveness: **variable by specialty**.
- delta1 (System prompt): Checked -- evaluated -- effectiveness: **partial**.
- delta2 (Syntax filtering): Not the primary focus.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `mpib_safe_evaluation` (MEAS): **directly aligned** -- provides medical-specific evaluation methodology
- `risk_level_classification` (RESP): relevant -- clinical risk stratification
- `svc_composite_score` (DETECT): relevant -- framework uses similar composite scoring

### Effectiveness Assessment
- **Scale**: Multi-model (tested across clinical specialties)
- **Verified**: Yes -- reproducible assessment methodology
- **Limitations**: Framework-level; does not implement defenses, only evaluation

### Gap Analysis
- Evaluation complement to AEGIS; validates AEGIS approach to medical security testing
- Does not address defense implementation

---

## P028: Towards Safe AI Clinicians -- LLM Jailbreaking in Healthcare

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2501.18632

### Attack Vector
- **MITRE ATT&CK**: T1566.001 (Phishing: Spearphishing Attachment) + T1204.002 (User Execution: Malicious File) -- adapted to clinical social engineering
- **Tactic**: Initial Access / Execution
- **Severity**: Critical -- CVSS-like 9.2

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- evaluated -- effectiveness: **variable**. Role-playing and authority impersonation bypass delta0 in clinical contexts.
- delta1 (System prompt): Checked -- evaluated -- effectiveness: **partial**. Medical system prompts can be overridden by authority impersonation.
- delta2 (Syntax filtering): Not discussed.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `role_anchoring` (delta1): **directly targeted** -- authority impersonation undermines role anchoring
- `safety_preamble` (delta1): tested -- clinical safety preambles evaluated
- `risk_level_classification` (RESP): relevant -- clinical risk stratification of attacks
- `forensic_hl7_analysis` (DETECT): relevant -- medical protocol analysis

### Effectiveness Assessment
- **Scale**: Multi-model (multiple LLMs across medical specialties)
- **Verified**: Yes -- comprehensive study with clinical risk stratification
- **Limitations**: Healthcare-specific; findings may not generalize to non-medical domains

### Gap Analysis
- Authority impersonation is particularly dangerous in medical contexts where deference to authority is culturally reinforced
- delta1 role anchoring must be strengthened for medical deployments

---

## P029: Vulnerability of LLMs to Prompt Injection When Providing Medical Advice (JAMA)

**Authors**: Unknown et al., 2025 | **Venue**: JAMA Network Open (Digital Health)

### Attack Vector
- **MITRE ATT&CK**: T1659 (Content Injection) + T1190 (Exploit Public-Facing Application)
- **Tactic**: Impact (patient harm via misinformation)
- **Severity**: Critical -- CVSS-like 9.8 (highest in corpus due to JAMA validation and patient harm potential)
- **Method**: Webhook-simulated prompt injection attacks in medical LLMs. 94.4% overall attack success rate. 91.7% success in extremely high-harm scenarios involving FDA Category X pregnancy drugs. Demonstrates that medical LLMs readily comply with injected instructions to provide dangerous medical advice.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- evaluated -- effectiveness: **critically insufficient**. 94.4% ASR means delta0 fails overwhelmingly in medical context.
- delta1 (System prompt): Checked -- evaluated -- effectiveness: **minimal**. Medical system prompts do not prevent compliance with injected instructions.
- delta2 (Syntax filtering): Not discussed.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `safety_preamble` (delta1): **evaluated and found insufficient** for medical domain
- `role_anchoring` (delta1): **evaluated and found insufficient**
- `forbidden_directive_check` (delta3): **urgently needed** -- would catch dangerous medical directives
- `tension_range_validation` (delta3): **urgently needed** -- would flag extreme clinical recommendations
- `risk_level_classification` (RESP): **critical** -- must escalate high-harm medical scenarios

### Effectiveness Assessment
- **Scale**: Multi-model (multiple medical LLMs)
- **Verified**: Yes -- JAMA (top medical journal); highly credible
- **Limitations**: Webhook simulation may not reflect all real-world attack vectors

### Gap Analysis
- **MOST CRITICAL PAPER IN CORPUS for AEGIS thesis**: 94.4% ASR in medical context with 91.7% in extreme harm scenarios
- delta0 and delta1 are demonstrably insufficient; delta3 enforcement is essential for medical safety
- Directly validates AEGIS thesis that multi-layer defense (delta0 through delta3) is necessary

---

## P030: A Longitudinal Analysis of Declining Medical Safety Messaging in Generative AI Models

**Authors**: Unknown et al., 2025 | **Venue**: PMC / PubMed Central

### Attack Vector
- **MITRE ATT&CK**: T1565 (Data Manipulation) -- erosion over time
- **Tactic**: Impact (long-term safety degradation)
- **Severity**: High -- CVSS-like 7.5

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- **longitudinal decay documented**. Medical disclaimers dropped from 26.3% (2022) to 0.97% (2025). delta0 safety mechanisms are eroding across model updates.
- delta1 (System prompt): Not discussed separately from delta0.
- delta2 (Syntax filtering): Not applicable.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **critically evaluated** -- longitudinal evidence of delta0 decay
- `delta0_attribution` (MEAS): **essential** -- tracking delta0 decay over model versions
- `mpib_safe_evaluation` (MEAS): relevant -- continuous evaluation needed to detect decay

### Effectiveness Assessment
- **Scale**: Multi-model (longitudinal across model generations)
- **Verified**: Yes -- PubMed Central; quantitative longitudinal data
- **Limitations**: Observational study; cannot attribute decay to specific causes (training data changes, RLHF adjustments, etc.)

### Gap Analysis
- Critical evidence that delta0 is not stable over time
- AEGIS must implement continuous monitoring of delta0 effectiveness across model updates
- Supports need for delta3 enforcement as stable safety layer independent of model version

---

## P031: Jailbreaking LLMs -- Navigating Innovation, Ethics, and Health Risks

**Authors**: Mondillo et al., 2024 | **Venue**: Journal of Medical Artificial Intelligence

### Attack Vector
- **MITRE ATT&CK**: Survey of medical jailbreaking risks
- **Tactic**: Survey
- **Severity**: N/A (review paper)

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- discussed -- effectiveness: **surveyed**.
- delta1 (System prompt): Checked -- discussed.
- delta2 (Syntax filtering): Not primary focus.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- General survey; no specific technique alignment beyond confirming medical domain risks.

### Effectiveness Assessment
- **Scale**: Review scope
- **Verified**: Review paper
- **Limitations**: Review; no novel empirical contribution

### Gap Analysis
- Contextual value for thesis framing; does not advance defense methodology

---

## P032: An Audit and Analysis of LLM-Assisted Health Misinformation Jailbreaks

**Authors**: Unknown et al., 2024 | **Venue**: AAAI/AIES 2024

### Attack Vector
- **MITRE ATT&CK**: T1565.001 (Data Manipulation: Stored Data Manipulation) in misinformation context
- **Tactic**: Impact (health misinformation)
- **Severity**: High -- CVSS-like 8.0

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- audited -- effectiveness: **variable**. Some models resist misinformation generation; others comply readily.
- delta1 (System prompt): Checked -- audited -- effectiveness: **partial**.
- delta2 (Syntax filtering): Not discussed.
- delta3 (Formal verification): Not discussed.

### AEGIS Taxonomy Cross-link
- `svc_composite_score` (DETECT): relevant -- composite scoring could flag misinformation-prone outputs
- `forbidden_directive_check` (delta3): relevant -- blocking known misinformation patterns
- `risk_level_classification` (RESP): relevant -- health misinformation risk classification

### Effectiveness Assessment
- **Scale**: Multi-model (AAAI venue)
- **Verified**: Yes -- AAAI/AIES 2024; rigorous audit methodology
- **Limitations**: Audit scope; does not propose novel defenses

### Gap Analysis
- Confirms that health misinformation jailbreaks succeed frequently
- Reinforces need for delta3 enforcement in medical domain
