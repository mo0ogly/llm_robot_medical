# THREAT_ANALYSIS.md -- Phase 3 Cybersecurity Analysis

> **Generated**: 2026-04-04 | **Updated**: 2026-04-04 (RUN-002)
> **Scope**: 46 papers (34 from Phase 1 + 12 from Phase 2)
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

---

## PHASE 2 -- 2026 PAPERS (RUN-002 Incremental)

---

## P035: MPIB -- A Benchmark for Medical Prompt Injection Attacks and Clinical Safety in LLMs

**Authors**: Lee, Jang & Choi, 2026 | **Venue**: arXiv:2602.06268

### Attack Vector
- **MITRE ATT&CK**: T1565.001 (Data Manipulation: Stored Data Manipulation) + T1059.006 (Command and Scripting Interpreter)
- **Tactic**: Impact / Initial Access (via RAG-mediated injection)
- **Severity**: Critical -- CVSS-like 9.0
- **Method**: Introduces MPIB benchmark with 9,697 curated instances evaluating clinical safety under both direct prompt injection and indirect RAG-mediated injection. Proposes Clinical Harm Event Rate (CHER) metric that diverges significantly from ASR -- demonstrating that attack success does not always correlate with clinical harm severity. Multi-stage quality gates and clinical safety linting ensure benchmark validity.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- evaluated -- effectiveness: **variable**. Models show different baselines; CHER reveals that delta0 failure modes differ between direct and RAG-mediated injection.
- delta1 (System prompt): Checked -- evaluated -- effectiveness: **partial**. RAG-mediated injection bypasses system prompt by injecting through retrieved context.
- delta2 (Syntax filtering): Checked -- evaluated -- effectiveness: **partial**. Defense configurations tested show incomplete protection.
- delta3 (Formal verification): Not directly tested but CHER metric implicitly measures outcome-level enforcement gaps.

### AEGIS Taxonomy Cross-link
- `mpib_safe_evaluation` (MEAS): **directly aligned** -- MPIB is a benchmark AEGIS should integrate
- `forbidden_directive_check` (delta3): **critical** -- CHER shows clinical harm requires output-level enforcement
- `risk_level_classification` (RESP): **relevant** -- clinical harm taxonomy aligns with risk stratification
- `forensic_hl7_analysis` (DETECT): **relevant** -- medical context requires clinical protocol awareness
- `svc_composite_score` (DETECT): **relevant** -- CHER could complement SVC as medical-specific metric

### Effectiveness Assessment
- **Scale**: Multi-model (diverse LLMs evaluated with defense configurations)
- **Verified**: Yes -- reproducible; dataset and code released on GitHub/HuggingFace
- **Limitations**: Benchmark-specific; does not propose novel defenses; CHER requires clinical expertise to validate

### Gap Analysis
- Key insight: ASR and CHER diverge -- high ASR does not always mean high clinical harm, and vice versa
- RAG-mediated injection is significantly harder to defend than direct injection
- AEGIS opportunity: integrate CHER as medical-specific metric alongside Sep(M)
- Uncovered: multi-modal medical injection (radiology images) not addressed

---

## P036: Large Reasoning Models Are Autonomous Jailbreak Agents

**Authors**: Hagendorff, Derner & Oliver, 2026 | **Venue**: Nature Communications 17, 1435 (2026)

### Attack Vector
- **MITRE ATT&CK**: T1204.001 (User Execution: Malicious Link -- via persuasion) + T1071.001 (Application Layer Protocol: Web) + T1059 (Command and Scripting Interpreter)
- **Tactic**: Initial Access / Execution / Persistence (multi-turn)
- **Severity**: **CRITICAL** -- CVSS-like 9.8
- **Method**: Four LRMs (DeepSeek-R1, Gemini 2.5 Flash, Grok 3 Mini, Qwen3 235B) autonomously jailbreak nine target models with **97.14% ASR** via multi-turn conversations. No human supervision required after initial system prompt. Five persuasive techniques: multi-turn dialogue, gradual escalation, educational/hypothetical framing, information overloading, and concealed strategy. Introduces "alignment regression" concept: reasoning capability enables subversion of other models' safety mechanisms.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- **catastrophically bypassed** -- effectiveness: **near-zero**. LRM reasoning systematically identifies and exploits delta0 weaknesses across all target models.
- delta1 (System prompt): Checked -- **bypassed** -- effectiveness: **low**. Multi-turn persuasion erodes system prompt authority over conversation turns.
- delta2 (Syntax filtering): Not directly discussed -- effectiveness: **irrelevant**. Attack uses natural language persuasion, not encoding tricks.
- delta3 (Formal verification): Not discussed -- effectiveness: **unknown but potentially effective**. Output-level enforcement could catch harmful content regardless of persuasion path.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **critically defeated** -- 97.14% ASR proves delta0 alone is catastrophically insufficient
- `safety_preamble` (delta1): **eroded** -- multi-turn persuasion degrades preamble authority
- `role_anchoring` (delta1): **bypassed** -- LRM framing overcomes role constraints
- `svc_composite_score` (DETECT): **essential** -- per-turn SVC monitoring could detect drift toward harmful output
- `session_termination` (RESP): **critical** -- conversation kill-switch needed when drift detected
- `delta0_attribution` (MEAS): **foundational** -- alignment regression directly impacts delta0 attribution models

### Effectiveness Assessment
- **Scale**: Multi-model (4 LRMs x 9 targets = 36 pairs; Nature Communications top venue)
- **Verified**: Yes -- reproducible; published methodology
- **Limitations**: Requires LRM access; primarily tests multi-turn scenarios

### Gap Analysis
- **HIGHEST PRIORITY THREAT for AEGIS**: 97.14% ASR is the highest documented in the literature
- Alignment regression concept directly challenges thesis assumption that delta0 improves with model capability
- AEGIS needs: per-turn SVC monitoring, conversation-level drift detection, automatic session termination
- Uncovered: defense against LRM-as-attacker not addressed by any existing technique

---

## P037: Jailbreaking LLMs & VLMs -- Mechanisms, Evaluation, and Unified Defenses

**Authors**: Chen, Li, Li, Zhang, Zhang & Hei, 2026 | **Venue**: arXiv:2601.03594

### Attack Vector
- **MITRE ATT&CK**: (Survey paper -- maps multiple TTPs)
- **Tactic**: (Comprehensive survey covering all tactics)
- **Severity**: N/A (survey/taxonomy paper)
- **Method**: Three-dimensional framework: (1) Attack dimension -- template/encoding-based, ICL manipulation, RL/adversarial, fine-tuning, agent-based transfer; (2) Defense dimension -- prompt obfuscation, output evaluation, model alignment; (3) Evaluation dimension -- ASR, toxicity, query/time cost, multimodal accuracy. Extends to VLMs with image-level perturbations. Proposes unified defense principles: variant-consistency detection, safety-aware decoding, adversarially augmented preference alignment.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Comprehensively surveyed -- effectiveness: **variable by attack type**. Adversarially augmented preference alignment proposed as improvement.
- delta1 (System prompt): Surveyed -- effectiveness: **partial**. Prompt obfuscation techniques discussed.
- delta2 (Syntax filtering): Surveyed -- effectiveness: **variable**. Variant-consistency detection (encoding normalization) recommended.
- delta3 (Formal verification): Surveyed -- effectiveness: **under-explored**. Safety-aware decoding at generation layer partially maps to delta3.

### AEGIS Taxonomy Cross-link
- `classifier_guard` (delta2): surveyed -- gradient-sensitivity detection aligns
- `perplexity_filter` (delta2): surveyed -- variant-consistency detection aligns
- `adversarial_training` (delta0/delta2): surveyed -- adversarially augmented alignment proposed
- `response_sanitization` (delta3): partially surveyed -- output review at generation layer

### Effectiveness Assessment
- **Scale**: Comprehensive survey (100+ papers synthesized)
- **Verified**: N/A (survey; no novel experiments)
- **Limitations**: Does not propose new defense implementations; taxonomy overlaps with existing frameworks

### Gap Analysis
- Useful taxonomy for AEGIS thesis framing (three-dimensional framework)
- VLM attack dimension not covered by AEGIS (text-only focus)
- Distinguishes hallucinations from jailbreaks -- important for medical domain (P029, P035)

---

## P038: Know Thy Enemy -- InstruCoT Defense via Diverse Data Synthesis

**Authors**: Unknown et al., 2026 | **Venue**: arXiv:2601.04666

### Attack Vector
- **MITRE ATT&CK**: N/A (defense paper)
- **Tactic**: N/A (defense)
- **Severity**: N/A (defense -- reduces ASR)
- **Method**: Three-phase defense: (1) diverse prompt injection data synthesis covering multiple injection types and positions; (2) instruction-level chain-of-thought (CoT) fine-tuning for injection identification; (3) safety alignment preserving utility. Achieves >90% defense rates: 92.5% Behavior Deviation, 98.0% Privacy Leakage, 90.9% Harmful Output across four open-source LLMs (Llama3.1-8B, Llama3-8B, Qwen2.5-7B, Qwen3-8B). No performance degradation in utility.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): **ENHANCED** -- instruction-level CoT fine-tuning deepens alignment beyond shallow token-level patterns (addresses P018/P019 shallow alignment critique).
- delta1 (System prompt): Not directly addressed.
- delta2 (Syntax filtering): **ENHANCED** -- diverse data synthesis trains model to recognize varied injection patterns at input level.
- delta3 (Formal verification): Not addressed.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **enhanced variant** -- CoT-based safety training is deeper than standard RLHF
- `task_specific_finetuning` (delta2): **directly aligned** -- diverse injection data synthesis for fine-tuning
- `adversarial_training` (delta0/delta2): **related** -- training on adversarial examples
- `classifier_guard` (delta2): **complementary** -- trained model serves as implicit classifier

### Effectiveness Assessment
- **Scale**: Multi-model (4 open-source LLMs, 7 attack methods)
- **Verified**: Yes -- reproducible; code available
- **Limitations**: Tested on 7-8B parameter models only; effectiveness on larger models or proprietary models unknown; defense may not generalize to novel attack types not in training data

### Gap Analysis
- **HIGH-VALUE DEFENSE**: >90% defense rate is among the highest documented
- Addresses shallow alignment (P018/P019) via deeper CoT-based training
- AEGIS opportunity: integrate InstruCoT methodology into delta0 enhancement pipeline
- Gap: not tested against LRM attacks (P036) or character injection (P009)

---

## P039: GRP-Obliteration -- Unaligning LLMs With a Single Unlabeled Prompt

**Authors**: Microsoft Research, 2026 | **Venue**: arXiv:2602.06258

### Attack Vector
- **MITRE ATT&CK**: T1195.002 (Supply Chain Compromise: Compromise Software Supply Chain) + T1548 (Abuse Elevation Control Mechanism)
- **Tactic**: Persistence / Defense Evasion / Impact
- **Severity**: **CRITICAL** -- CVSS-like 9.6
- **Method**: Exploits Group Relative Policy Optimization (GRPO) -- normally used for safety training -- to completely unalign 15 language models using a **single unlabeled harmful prompt**. The technique reverses the reward scoring mechanism to reinforce policy-violating outputs. Tested on GPT-OSS (20B), DeepSeek-R1-Distill, Gemma, Llama, Ministral, Qwen models across 7-20B parameters, dense and MoE architectures. Generalizes to text-to-image diffusion models.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): **OBLITERATED** -- single prompt completely removes safety alignment. This is the most severe delta0 attack documented.
- delta1 (System prompt): **Irrelevant after unalignment** -- once delta0 is removed, system prompts have no safety effect.
- delta2 (Syntax filtering): Not applicable -- attack targets training, not inference-time input.
- delta3 (Formal verification): **Only remaining defense** -- output enforcement is the sole protection after delta0 obliteration.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **catastrophically vulnerable** -- GRPO-based unalignment destroys delta0 entirely
- `dpo_alignment` (delta0): **equally vulnerable** -- GRPO exploits same optimization mechanisms as DPO
- `red_team_training` (delta0): **compromised** -- red team training data could be exploited via GRPO
- `allowed_output_spec` (delta3): **critical compensator** -- only delta3 survives post-unalignment
- `forbidden_directive_check` (delta3): **critical compensator** -- must enforce regardless of model alignment state
- `delta0_attribution` (MEAS): **essential** -- must detect when delta0 has been obliterated

### Effectiveness Assessment
- **Scale**: Multi-model (15 models, 5 families; Microsoft Research)
- **Verified**: Yes -- Microsoft Security Blog published; reproducible
- **Limitations**: Requires fine-tuning access (white-box); does not apply to API-only models without fine-tuning endpoints

### Gap Analysis
- **EXISTENTIAL THREAT to delta0**: Single-prompt complete unalignment means delta0 cannot be trusted as sole defense
- Directly validates AEGIS thesis: multi-layer defense (delta0+delta1+delta2+delta3) is non-optional
- AEGIS opportunity: delta0 integrity monitoring -- detect when alignment has been compromised
- Gap: no known defense against GRPO-based unalignment once fine-tuning access is granted
- Cross-reference: P022 (adversarial RLHF) explored similar supply chain attacks but GRP-Obliteration is more efficient (single prompt vs. poisoned training data)

---

## P040: Prompt Injection is All You Need -- Healthcare Misinformation in LLMs

**Authors**: Zahra & Chin, 2026 | **Venue**: Springer LNCS (Artificial Intelligence in Healthcare)

### Attack Vector
- **MITRE ATT&CK**: T1565.001 (Data Manipulation: Stored Data Manipulation) + T1566.001 (Phishing: Spearphishing Attachment -- via emotional manipulation)
- **Tactic**: Impact (health misinformation generation)
- **Severity**: High -- CVSS-like 8.5 (life-threatening misinformation potential)
- **Method**: Evaluates 112 attack scenarios across eight LLMs. Emotional manipulation combined with prompt injection increases dangerous medical misinformation from 6.2% baseline to **37.5%** (6x increase). Claude 3.5 Sonnet demonstrates strongest resistance. Highlights that 39% of US population already believe in alternative cancer treatments, amplifying real-world impact.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Checked -- variable -- effectiveness: **model-dependent**. Claude 3.5 Sonnet's delta0 resists; others fail significantly.
- delta1 (System prompt): Checked -- partial -- effectiveness: **moderate**. Medical safety preambles help but are overcome by emotional framing.
- delta2 (Syntax filtering): Not discussed -- effectiveness: **low**. Emotional manipulation uses natural language, not detectable by syntax filters.
- delta3 (Formal verification): Not discussed -- effectiveness: **essential but untested**. Medical claim verification would catch misinformation.

### AEGIS Taxonomy Cross-link
- `forbidden_directive_check` (delta3): **critical** -- must block known dangerous medical claims
- `risk_level_classification` (RESP): **directly relevant** -- medical misinformation risk stratification
- `tension_range_validation` (delta3): **relevant** -- extreme clinical recommendations should trigger validation
- `forensic_hl7_analysis` (DETECT): **relevant** -- medical context validation
- `role_anchoring` (delta1): **partially effective** -- emotional manipulation erodes role authority

### Effectiveness Assessment
- **Scale**: Multi-model (8 LLMs, 112 scenarios; Springer venue)
- **Verified**: Yes -- systematic methodology
- **Limitations**: English-language only; does not test RAG-mediated injection

### Gap Analysis
- Emotional manipulation is a novel attack vector not addressed by any AEGIS delta2 technique
- Claude 3.5 Sonnet resistance suggests model-specific delta0 robustness varies significantly
- Cross-reference: P029 (JAMA 94.4% ASR) -- P040 shows lower but still dangerous ASR with emotional framing
- AEGIS opportunity: emotional sentiment analysis as delta2 defense against manipulation-based attacks

---

## P041: Efficient Switchable Safety Control via Magic-Token-Guided Co-Training

**Authors**: Qihoo 360 et al., 2026 | **Venue**: arXiv:2508.14904 / AAAI 2026 Special Track on AI Alignment

### Attack Vector
- **MITRE ATT&CK**: N/A (defense paper; but magic tokens introduce attack surface T1078.004 -- Valid Accounts: Cloud Accounts -- if tokens are leaked)
- **Tactic**: N/A (defense)
- **Severity**: N/A (defense -- but magic token leakage is HIGH severity)
- **Method**: Unified co-training framework integrating positive (lawful), negative (unfiltered), and rejective (refusal) safety behaviors activated via magic tokens at inference. 8B model surpasses DeepSeek-R1 (671B) in safety performance. Only 3.8% performance drop under attack vs. 21.5% average for baselines. Introduces Safety Alignment Margin (SAM) in output space for distinct behavioral separation.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): **NOVEL APPROACH** -- magic-token co-training replaces multi-stage RLHF pipeline with single SFT stage. More efficient and more robust.
- delta1 (System prompt): **Enhanced** -- magic tokens function as system-level behavioral switches.
- delta2 (Syntax filtering): Not addressed.
- delta3 (Formal verification): Not addressed but SAM (Safety Alignment Margin) provides implicit output-space enforcement.

### AEGIS Taxonomy Cross-link
- `rlhf_safety_training` (delta0): **alternative approach** -- magic-token co-training vs. traditional RLHF
- `safety_preamble` (delta1): **enhanced** -- magic tokens are more precise behavioral switches than natural language preambles
- `delta0_attribution` (MEAS): **relevant** -- SAM provides measurable safety boundary in output space

### Effectiveness Assessment
- **Scale**: Multi-model (evaluated against Qwen3-32B, DeepSeek-R1 671B; AAAI 2026)
- **Verified**: Yes -- AAAI 2026 acceptance; S-Eval benchmark evaluation
- **Limitations**: Magic token leakage is a critical risk -- if attacker discovers tokens, they can switch to "negative" mode. Requires training-time integration; cannot be applied post-hoc.

### Gap Analysis
- Magic token leakage creates new attack surface not in current AEGIS taxonomy
- SAM concept could inform AEGIS delta0 attribution methodology
- Gap: no mechanism to detect unauthorized magic token usage at inference time
- AEGIS opportunity: magic token rotation and access control as delta1 enhancement

---

## P042: PromptArmor -- Simple yet Effective Prompt Injection Defenses

**Authors**: Shi, Zhu, Wang et al., 2025 | **Venue**: arXiv:2507.15219 (under review ICLR 2026)

### Attack Vector
- **MITRE ATT&CK**: N/A (defense paper)
- **Tactic**: N/A (defense)
- **Severity**: N/A (defense -- achieves <1% FPR and FNR)
- **Method**: Prompts an off-the-shelf LLM (GPT-4o, GPT-4.1, o4-mini) to detect and remove injected prompts from input via careful prompt engineering. Two-step: (1) guardrail LLM determines if input contains injection; (2) if so, extracts and removes injected content via fuzzy matching. Achieves **<1% FPR and FNR** on AgentDojo benchmark, **<5%** on Open Prompt Injection and TensorTrust. Larger LLMs and reasoning capability improve performance.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Not addressed (external guardrail, not model-internal).
- delta1 (System prompt): **Implemented via guardrail prompt** -- careful prompt engineering for the guardrail LLM.
- delta2 (Syntax filtering): **NOVEL APPROACH** -- LLM-as-guardrail replaces traditional pattern matching. Semantic understanding enables detection of attacks that bypass syntax filters.
- delta3 (Formal verification): Partially addressed -- sanitized output is verified before passing to agent.

### AEGIS Taxonomy Cross-link
- `classifier_guard` (delta2): **superior alternative** -- LLM-based detection outperforms classifier-based guards
- `input_output_separation` (delta2): **implemented** -- extraction and removal of injected content
- `data_marking` (delta2): **related** -- distinguishes instruction from data at semantic level
- `security_audit_agent` (DETECT): **comparable** -- external LLM as security auditor

### Effectiveness Assessment
- **Scale**: Multi-benchmark (AgentDojo, Open Prompt Injection, TensorTrust)
- **Verified**: Yes -- under review ICLR 2026; reproducible
- **Limitations**: Requires external LLM call (latency + cost); effectiveness depends on guardrail LLM capability; adaptive attacks specifically targeting the guardrail prompt could degrade performance

### Gap Analysis
- **CRITICAL COMPARISON**: PromptArmor <1% FPR vs. AEGIS RagSanitizer -- directly comparable
- AEGIS RagSanitizer uses 15 pattern-based detectors (deterministic, fast, no LLM call); PromptArmor uses LLM reasoning (semantic, slower, more expensive)
- Hybrid approach: RagSanitizer for fast pattern detection + PromptArmor-style LLM check for semantic analysis
- Gap: not tested against character injection (P009) or LRM attacks (P036)
- AEGIS opportunity: add LLM-based guardrail as delta2 enhancement alongside RagSanitizer

---

## P043: Jailbreak Distillation -- Renewable Safety Benchmarking (JBDistill)

**Authors**: Zhang et al. (Johns Hopkins / Microsoft), 2025 | **Venue**: EMNLP 2025 Findings

### Attack Vector
- **MITRE ATT&CK**: T1588.002 (Obtain Capabilities: Tool) -- benchmark as attack capability development
- **Tactic**: Resource Development (renewable attack benchmark generation)
- **Severity**: Medium -- CVSS-like 6.5 (benchmark, not direct attack)
- **Method**: JBDistill framework distills jailbreak attacks into reproducible safety benchmarks. Over-generates attack prompts then selects highly effective subset for transferability. Achieves **81.8% effectiveness** generalizing to 13 evaluation models (proprietary, reasoning, specialized). Enables fair cross-model safety comparisons with minimal human effort. Code released on GitHub (Microsoft).

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): **Benchmarked** -- measures delta0 effectiveness across 13 models.
- delta1 (System prompt): **Benchmarked** -- benchmark prompts test system prompt resilience.
- delta2 (Syntax filtering): Not specifically addressed.
- delta3 (Formal verification): Not addressed.

### AEGIS Taxonomy Cross-link
- `mpib_safe_evaluation` (MEAS): **complementary** -- JBDistill for general safety, MPIB for medical domain
- `multi_trial_sampling` (MEAS): **aligned** -- renewable benchmarking supports multi-trial evaluation
- `streaming_campaign` (MEAS): **relevant** -- JBDistill could feed AEGIS campaign pipeline
- `delta0_attribution` (MEAS): **supported** -- cross-model comparison enables delta0 attribution across model families

### Effectiveness Assessment
- **Scale**: Multi-model (13 evaluation models; EMNLP 2025; Microsoft collaboration)
- **Verified**: Yes -- EMNLP 2025; code released; reproducible
- **Limitations**: Benchmark generation, not defense; transferability depends on development model selection

### Gap Analysis
- AEGIS opportunity: integrate JBDistill as renewable benchmark source for campaign testing
- 81.8% transferability enables automated testing across model updates
- Cross-reference: P004 (WASP) -- JBDistill is more automated and renewable than static benchmarks

---

## P044: Auditing the Gatekeepers -- AdvJudge-Zero (Fuzzing AI Judges)

**Authors**: Unit 42 (Palo Alto Networks), 2026 | **Venue**: Unit 42 Research / arXiv:2512.17375

### Attack Vector
- **MITRE ATT&CK**: T1562.001 (Impair Defenses: Disable or Modify Tools) + T1027.013 (Obfuscated Files: Encrypted/Encoded File)
- **Tactic**: Defense Evasion
- **Severity**: **CRITICAL** -- CVSS-like 9.5
- **Method**: Automated fuzzer achieving **99% success** in bypassing LLM guardrails across open-weight enterprise LLMs, reward models, and commercial LLMs. Identifies stealth control tokens -- innocent-looking characters (markdown syntax, formatting symbols) with low perplexity but strong influence on model attention. Flips binary judge decisions. No human involvement required. Adversarial training reduces ASR to near zero.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Not directly targeted -- attack targets external guardrails, not base alignment.
- delta1 (System prompt): Not targeted.
- delta2 (Syntax filtering): **CATASTROPHICALLY BYPASSED** -- stealth control tokens evade all tested guardrails. Low perplexity means perplexity filters also fail.
- delta3 (Formal verification): Not addressed but adversarial training (retraining judges on fuzzer output) is effective defense.

### AEGIS Taxonomy Cross-link
- `classifier_guard` (delta2): **defeated** -- 99% bypass rate on classifier-based guards
- `perplexity_filter` (delta2): **defeated** -- low-perplexity tokens evade perplexity checks
- `security_audit_agent` (DETECT): **vulnerable** -- if AEGIS audit agent uses LLM judge, it is vulnerable to AdvJudge-Zero
- `adversarial_training` (delta0/delta2): **effective defense** -- adversarial training on fuzzer output reduces ASR to near zero

### Effectiveness Assessment
- **Scale**: Multi-model (enterprise LLMs, reward models, commercial LLMs; Unit 42 / Palo Alto Networks)
- **Verified**: Yes -- industry research (Palo Alto Networks); reproducible methodology
- **Limitations**: Requires black-box query access to guardrail; adversarial training is effective countermeasure

### Gap Analysis
- **CRITICAL THREAT to AEGIS DETECT class**: If SVC or security audit agent uses LLM-based judgment, AdvJudge-Zero can bypass it
- AEGIS RagSanitizer (pattern-based) is NOT vulnerable to this attack (no LLM judge to fuzz)
- Defense: adversarial training loop -- run AdvJudge-Zero internally, retrain on discovered vulnerabilities
- Cross-reference: P033 (Self-Police recursive vulnerability) -- confirms judge models share base model weaknesses
- AEGIS opportunity: hybrid detection combining pattern-based (resistant to fuzzing) + LLM-based (after adversarial training)

---

## P045: System Prompt Poisoning -- Persistent Attacks Beyond User Injection

**Authors**: Unknown et al., 2025 | **Venue**: arXiv:2505.06493 (under review ICLR 2026)

### Attack Vector
- **MITRE ATT&CK**: T1195.002 (Supply Chain Compromise: Compromise Software Supply Chain) + T1556 (Modify Authentication Process)
- **Tactic**: Persistence / Impact
- **Severity**: **CRITICAL** -- CVSS-like 9.4
- **Method**: Defines System Prompt Poisoning (SPP) as a persistent attack targeting global system prompts rather than ephemeral user prompts. Three strategies via Auto-SPP framework: (1) brute-force poisoning; (2) adaptive in-context poisoning; (3) adaptive CoT poisoning. SPP is persistent (affects ALL subsequent user interactions), does not require jailbreak techniques, and remains effective even when users employ CoT or RAG. Current black-box defenses are ineffective.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): Not directly targeted -- SPP operates at system prompt level.
- delta1 (System prompt): **PRIMARY TARGET** -- SPP poisons the system prompt itself, turning delta1 from defense into attack vector.
- delta2 (Syntax filtering): Checked -- ineffective -- black-box defenses fail against SPP.
- delta3 (Formal verification): Not addressed but output enforcement would catch poisoned responses.

### AEGIS Taxonomy Cross-link
- `safety_preamble` (delta1): **converted to attack vector** -- poisoned system prompt IS the safety preamble
- `instruction_hierarchy` (delta1): **subverted** -- poisoned system prompt has highest instruction priority
- `role_anchoring` (delta1): **compromised** -- poisoned role definition persists across all interactions
- `boundary_marking` (delta1): **irrelevant** -- attack is inside the boundary
- `forbidden_directive_check` (delta3): **critical defense** -- output enforcement regardless of system prompt state
- `allowed_output_spec` (delta3): **critical defense** -- constrains output regardless of system prompt

### Effectiveness Assessment
- **Scale**: Multi-task (math, coding, reasoning, NLP; under review ICLR 2026)
- **Verified**: Yes -- Auto-SPP framework; reproducible
- **Limitations**: Requires access to system prompt configuration (supply chain or admin access)

### Gap Analysis
- **PARADIGM SHIFT**: SPP converts delta1 from defense to attack surface
- AEGIS assumption that system prompt is trusted must be re-evaluated
- Defense needed: system prompt integrity verification (hash-based, signed prompts)
- Cross-reference: P001 (HouYi) targeted delta1 boundary; P045 poisons delta1 content itself
- AEGIS opportunity: system prompt signing/verification as new delta1 security technique
- Gap: no technique in current 66-technique taxonomy addresses system prompt integrity

---

## P046: Adversary-Aware DPO (ADPO) for Vision Language Models

**Authors**: Weng, Lou, Feng, Huang & Wang, 2025 | **Venue**: arXiv:2502.11455 / EMNLP 2025 Findings

### Attack Vector
- **MITRE ATT&CK**: N/A (defense paper)
- **Tactic**: N/A (defense)
- **Severity**: N/A (defense -- substantially reduces ASR on VLMs)
- **Method**: Integrates adversarial training into Direct Preference Optimization (DPO) for Vision Language Models. Two components: (1) adversarially-trained reference model generating preferred responses under worst-case PGD perturbations in image and latent space; (2) adversarial-aware DPO loss with winner-loser pairs accounting for adversarial distortions. Substantially reduces ASR on LLaVA models across multiple jailbreak attacks.

### delta-Layer Defense Coverage
- delta0 (RLHF alignment): **ENHANCED** -- ADPO deepens DPO alignment to be adversarially robust, addressing shallow alignment critique (P018/P019).
- delta1 (System prompt): Not addressed.
- delta2 (Syntax filtering): Not applicable (operates at training level).
- delta3 (Formal verification): Not addressed.

### AEGIS Taxonomy Cross-link
- `dpo_alignment` (delta0): **enhanced variant** -- adversary-aware DPO is strictly superior to standard DPO
- `adversarial_training` (delta0/delta2): **directly implemented** -- PGD-based adversarial training integrated into alignment
- `rlhf_safety_training` (delta0): **improved** -- ADPO addresses fundamental weakness of standard RLHF/DPO
- `delta0_attribution` (MEAS): **relevant** -- adversarial robustness as measurable delta0 property

### Effectiveness Assessment
- **Scale**: Model-specific (LLaVA models; EMNLP 2025 Findings)
- **Verified**: Yes -- EMNLP 2025; reproducible
- **Limitations**: VLM-specific; image+latent space perturbations not directly applicable to text-only models; tested on LLaVA only

### Gap Analysis
- ADPO concept (adversarial training + DPO) could be adapted for text-only delta0 enhancement
- Cross-reference: P039 (GRP-Obliteration) exploits DPO mechanism; ADPO may partially resist GRPO if adversarially trained against it
- AEGIS opportunity: adapt ADPO principles for text-only adversarial delta0 training
- Gap: VLM-specific; AEGIS is text-only -- adaptation required
