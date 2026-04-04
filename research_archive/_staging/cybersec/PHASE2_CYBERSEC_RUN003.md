# PHASE2_CYBERSEC_RUN003.md -- Threat Model for P047-P060

> **Generated**: 2026-04-04 | **Agent**: CYBERSEC (RUN-003, incremental)
> **Scope**: 14 new papers (P047-P060), extending RUN-002 (46 papers)
> **Framework**: AEGIS delta-layer taxonomy (delta0--delta3)
> **Cross-reference**: `backend/taxonomy/defense_taxonomy_2025.json` (66 techniques, 4 classes)

---

## P047 -- Defense Against Prompt Injection Attack by Leveraging Attack Techniques

**Auteurs** : Yulin Chen, Haoran Li, Zihao Zheng, Dekai Wu, Yangqiu Song, Bryan Hooi | **Annee** : 2025 | **Venue** : ACL 2025

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1036.005 (Masquerading: Match Legitimate Name) -- defense technique mirrors attack pattern, masquerading defensive instructions as attacker-like directives
- **Kill Chain Phase** : Not applicable (defense paper)
- **Complexite** : Medium -- requires understanding of attack mechanics to invert them
- **Impact medical** : Positive -- strengthens instruction adherence in clinical LLM deployments; reduces risk of medical prompt hijacking

### Mapping AEGIS
- **Chaines backend concernees** : All 34 chains (defense applies universally to instruction-level attacks)
- **Templates lies** : All templates targeting delta1 (instruction override category)
- **Couches delta ciblees** : delta1 (defense -- instruction reinforcement), delta2 (defense -- attack-pattern-aware filtering)
- **Defenses AEGIS existantes** : `safety_preamble` (delta1), `instruction_hierarchy` (delta1), `role_anchoring` (delta1)
- **Defenses manquantes** : Attack-inversion defense technique (applying separator injection defensively to reinforce instruction boundaries) -- not in current 66 taxonomy

### Threat Model
- **Attaquant** : N/A (defense paper)
- **Surface** : Instruction-level prompt interface
- **Impact** : Positive -- CIA triad improvement via instruction integrity reinforcement
- **Probabilite** : N/A

### Impact sur Triple Convergence (D-001)
- Partially mitigates D-001: demonstrates that delta1 can be strengthened by understanding delta1 attack patterns, but does not address delta0 erasability or delta2 bypass. The attack-defense duality principle is novel but requires delta0 and delta2 integration to close the convergence gap.

---

## P048 -- SLR on LLM Defenses Against Prompt Injection: Expanding NIST Taxonomy

**Auteurs** : Pedro H. Barcha Correia, Ryan W. Achjian et al. | **Annee** : 2026 | **Venue** : arXiv (submitted to Elsevier CSR)

### Vecteur d'Attaque
- **MITRE ATT&CK** : Survey -- covers T1059, T1190, T1027, T1562, T1566 (all major PI vectors)
- **Kill Chain Phase** : All phases (systematic review)
- **Complexite** : N/A (survey)
- **Impact medical** : Indirect -- 88-study corpus provides the most comprehensive defense catalog for benchmarking medical LLM protection

### Mapping AEGIS
- **Chaines backend concernees** : All 34 chains (benchmark reference for all attack types)
- **Templates lies** : All 98 templates (coverage benchmark)
- **Couches delta ciblees** : delta0, delta1, delta2, delta3 (all layers surveyed)
- **Defenses AEGIS existantes** : 40/66 implemented techniques can be cross-referenced against the 88-study catalog
- **Defenses manquantes** : NIST taxonomy extensions not yet mapped to AEGIS classification -- potential gap of 5-10 defense categories not in current taxonomy

### Threat Model
- **Attaquant** : N/A (survey paper)
- **Surface** : Full LLM deployment stack
- **Impact** : Benchmark -- enables validation of AEGIS defense coverage claims
- **Probabilite** : N/A

### Impact sur Triple Convergence (D-001)
- Does not change D-001 directly but provides the most comprehensive external reference for validating the convergence claim. The 88-study corpus may reveal defenses that partially address the triple convergence if cross-referenced systematically.

---

## P049 -- Bypassing LLM Guardrails: Evasion Attacks Against Prompt Injection Detection

**Auteurs** : William Hackett, Lewis Birch, Stefan Trawicki, Neeraj Suri, Peter Garraghan | **Annee** : 2025 | **Venue** : LLMSec 2025 (co-located ACL 2025)

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1027 (Obfuscated Files or Information) + T1562.001 (Impair Defenses: Disable or Modify Tools)
- **Kill Chain Phase** : Defense Evasion
- **Complexite** : Low -- character injection techniques are simple to implement, require no model access
- **Impact medical** : Critical -- guardrail bypass in medical LLM allows harmful clinical advice to pass undetected; patient safety directly compromised

### Mapping AEGIS
- **Chaines backend concernees** : chain_01 (direct injection), chain_03 (encoding attacks), chain_12 (unicode evasion), chain_15 (multi-encoding)
- **Templates lies** : #03 (homoglyph), #07 (unicode), #12 (encoding), #15 (fullwidth), #18 (BiDi)
- **Couches delta ciblees** : delta2 (attack -- guardrail bypass via character injection)
- **Defenses AEGIS existantes** : RagSanitizer 15 detectors covering 12/12 Hackett techniques (`invisible_unicode_detection`, `homoglyph_normalization`, `mixed_encoding_detection`, `emoji_smuggling_detection`, `bidi_override_detection`, `deletion_char_detection`, `fullwidth_normalization`, `diacritics_detection`, `upside_down_detection`, `underline_accent_detection`, `number_injection_detection`, `unicode_tag_detection`)
- **Defenses manquantes** : White-box transfer attack defense (word importance ranking from offline models) -- RagSanitizer does not defend against AML-optimized evasion sequences

### Threat Model
- **Attaquant** : Low-skill adversary (character injection) to medium-skill (AML-optimized evasion)
- **Surface** : delta2 detection/filtering layer, all guardrail classifiers
- **Impact** : Confidentiality (exfiltration via bypass), Integrity (harmful output), Patient Safety (unfiltered dangerous medical advice)
- **Probabilite** : Critical -- 100% evasion demonstrated against production guardrails

### Impact sur Triple Convergence (D-001)
- Strongly reinforces D-001: confirms delta2 bypass at 100% rate. The white-box-to-black-box transfer finding adds a new dimension -- even without direct access to production guardrails, offline analysis enables full bypass. This is the empirical foundation of the "delta2 bypass 99%" component of D-001.

---

## P050 -- JMedEthicBench: Multi-Turn Adversarial Benchmark for Medical Ethics Alignment

**Auteurs** : Junyu Liu, Zirui Li, Qian Niu et al. | **Annee** : 2026 | **Venue** : arXiv:2601.01627v2

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1059.006 (Command and Scripting Interpreter) + T1204.001 (User Execution: Malicious Link -- via multi-turn manipulation)
- **Kill Chain Phase** : Execution (progressive over multiple turns)
- **Complexite** : Medium -- requires multi-turn conversation orchestration
- **Impact medical** : Critical -- medical-specialized models MORE vulnerable than general models; safety score degradation from 9.5 to 5.5 (p<0.001) across conversation turns directly threatens clinical decision support

### Mapping AEGIS
- **Chaines backend concernees** : chain_08 (multi-turn escalation), chain_22 (progressive context poisoning), chain_30 (medical domain attacks)
- **Templates lies** : #20 (multi-turn), #25 (role escalation), #30 (medical ethics bypass)
- **Couches delta ciblees** : delta0 (attack -- alignment degradation over turns), delta1 (attack -- medical ethics compliance erosion)
- **Defenses AEGIS existantes** : `semantic_drift_guard` (delta2), `session_termination` (RESP), `svc_composite_score` (DETECT)
- **Defenses manquantes** : Turn-level alignment monitoring (tracking delta0 degradation per turn), medical-domain-specific safety scoring calibrated to JMA guidelines

### Threat Model
- **Attaquant** : Medium-skill adversary capable of multi-turn conversation design
- **Surface** : Multi-turn conversation interface, medical domain specialization layer
- **Impact** : Integrity (degraded medical advice quality), Patient Safety (unsafe recommendations at turn 5+), Availability (model becomes unreliable for clinical use)
- **Probabilite** : High -- statistically significant degradation (p<0.001) across 22 models

### Impact sur Triple Convergence (D-001)
- Strongly reinforces D-001: demonstrates that delta0 alignment degrades progressively over conversation turns. The finding that medical-specialized models are MORE vulnerable than general models suggests that domain fine-tuning actively weakens delta0 -- a new dimension of delta0 erasability. Cross-lingual persistence confirms alignment limitations are structural, not surface-level.

---

## P051 -- Detecting Jailbreak Attempts in Clinical Training LLMs

**Auteurs** : Tri Nguyen, Huy Hoang Bao Le, Lohith Srikanth Pentapalli, Laurah Turner, Kelly Cohen | **Annee** : 2026 | **Venue** : arXiv:2602.13321

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1027.005 (Obfuscated Files or Information: Indicator Removal from Tools) -- detection evasion context
- **Kill Chain Phase** : Defense (detection mechanism)
- **Complexite** : N/A (defense paper)
- **Impact medical** : Positive -- four-dimensional linguistic feature extraction (Professionalism, Medical Relevance, Ethical Behavior, Contextual Distraction) directly applicable to clinical dialogue safety

### Mapping AEGIS
- **Chaines backend concernees** : All chains producing clinical dialogue output
- **Templates lies** : Detection applicable to all 98 templates
- **Couches delta ciblees** : delta2 (defense -- BERT-based jailbreak classification)
- **Defenses AEGIS existantes** : `classifier_guard` (delta2), `semantic_drift_guard` (delta2), `svc_composite_score` (DETECT)
- **Defenses manquantes** : Four-dimensional linguistic feature extraction not implemented in AEGIS; dialogue-level (multi-turn) risk modeling absent

### Threat Model
- **Attaquant** : N/A (defense paper)
- **Surface** : Clinical dialogue input stream
- **Impact** : Positive -- CIA triad improvement via interpretable detection
- **Probabilite** : N/A

### Impact sur Triple Convergence (D-001)
- Partially mitigates D-001 at delta2 layer: provides an interpretable detection mechanism that could catch attacks that bypass delta0 and delta1. However, the BERT-based approach is likely vulnerable to character injection (P049/P009) and AML evasion, limiting its standalone effectiveness. Complements but does not resolve the triple convergence.

---

## P052 -- Why Is RLHF Alignment Shallow? A Gradient Analysis

**Auteurs** : Robin Young (University of Cambridge) | **Annee** : 2026 | **Venue** : arXiv:2603.04851v1

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1059 (Command and Scripting Interpreter) -- mechanistic vulnerability analysis
- **Kill Chain Phase** : Defense Evasion (understanding mechanism for exploitation)
- **Complexite** : High -- requires gradient-level understanding of transformer alignment
- **Impact medical** : Critical -- proves that RLHF alignment is structurally shallow in medical LLMs; late-sequence injections bypass alignment regardless of medical safety training

### Mapping AEGIS
- **Chaines backend concernees** : All chains exploiting delta0 (chain_01 through chain_10, chain_20+)
- **Templates lies** : All templates with suffix/late-sequence injection patterns
- **Couches delta ciblees** : delta0 (vulnerability analysis -- gradient concentration on early tokens)
- **Defenses AEGIS existantes** : `rlhf_safety_training` (delta0 -- shown insufficient), `dpo_alignment` (delta0 -- same weakness), `delta0_attribution` (MEAS -- informed by gradient analysis)
- **Defenses manquantes** : Recovery penalty objective (proposed in paper) not implemented; harm information I_t metric not integrated into Sep(M)

### Threat Model
- **Attaquant** : Advanced adversary with understanding of gradient dynamics
- **Surface** : delta0 alignment layer (early-token concentration vulnerability)
- **Impact** : Integrity (alignment bypassed via late-token injection), Patient Safety (harmful completions after benign opening)
- **Probabilite** : High -- mathematical proof, not empirical observation; applies to all RLHF-aligned models

### Impact sur Triple Convergence (D-001)
- Strongly reinforces D-001: provides the mathematical proof for WHY delta0 is erasable. The martingale decomposition shows alignment gradient vanishes beyond early tokens -- this is the theoretical foundation of the "delta0 erasable" component. The recovery penalty objective is the first concrete proposal to address this, but remains unimplemented. NOTE: P052 overlaps with existing P019 analysis but provides the formal proof (P019 was the mechanistic explanation, P052 is the mathematical formalization).

---

## P053 -- Semantic Jailbreaks and RLHF Limitations: Taxonomy, Failure Trace, and Mitigation

**Auteurs** : Ritu Kuklani, Gururaj Shinde, Varad Vishwarupe | **Annee** : 2025 | **Venue** : IJCA Vol. 187 No. 27

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1027 (Obfuscated Files or Information) + T1036 (Masquerading) -- semantic-level obfuscation
- **Kill Chain Phase** : Defense Evasion / Execution
- **Complexite** : Low to Medium -- encoded/paraphrased prompts require minimal technical skill
- **Impact medical** : High -- semantic jailbreaks can reframe dangerous medical requests as benign-sounding queries, bypassing both automated and human review

### Mapping AEGIS
- **Chaines backend concernees** : chain_03 (encoding attacks), chain_05 (role-play), chain_08 (multi-turn semantic drift), chain_14 (paraphrase attacks)
- **Templates lies** : #05 (role-play), #10 (encoding), #14 (paraphrase), #22 (obfuscation)
- **Couches delta ciblees** : delta0 (attack -- RLHF limitations), delta1 (attack -- semantic-level bypass of instruction hierarchy)
- **Defenses AEGIS existantes** : `semantic_drift_guard` (delta2), `classifier_guard` (delta2), `svc_composite_score` (DETECT)
- **Defenses manquantes** : Semantic paraphrase detection (detecting intent-preserving reformulations), multimodal jailbreak defenses (text+image attacks)

### Threat Model
- **Attaquant** : Low to medium-skill adversary; encoding/paraphrasing tools widely available
- **Surface** : delta0 alignment boundary, delta1 instruction parsing
- **Impact** : Integrity (harmful content via paraphrase), Patient Safety (reframed dangerous medical queries)
- **Probabilite** : High -- production-scale models demonstrated vulnerable

### Impact sur Triple Convergence (D-001)
- Reinforces D-001: confirms delta0 RLHF limitations are exploitable via semantic (not just token-level) attacks. The failure trace methodology shows attack chains that bypass token-level defenses entirely, meaning delta2 filtering is insufficient when the attack is semantically valid. Does not add new dimensions but provides independent validation.

---

## P054 -- PIDP-Attack: Combining Prompt Injection with Database Poisoning on RAG

**Auteurs** : Haozhen Wang, Haoyue Liu, Jionghao Zhu et al. | **Annee** : 2026 | **Venue** : arXiv:2603.25164v1

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1565.001 (Data Manipulation: Stored Data Manipulation) + T1659 (Content Injection)
- **Kill Chain Phase** : Initial Access (query manipulation) + Persistence (database poisoning)
- **Complexite** : Medium -- requires write access to vector database + prompt crafting
- **Impact medical** : Critical -- poisoned medical knowledge base could serve fabricated treatment protocols, drug interactions, or diagnostic criteria to any patient query

### Mapping AEGIS
- **Chaines backend concernees** : chain_16 (RAG poisoning), chain_17 (indirect injection via retrieved content), chain_28 (compound multi-vector attacks)
- **Templates lies** : #16 (RAG injection), #28 (compound attack), #35 (data poisoning)
- **Couches delta ciblees** : delta2 (attack -- RAG retrieval layer), delta3 (attack -- data integrity violation)
- **Defenses AEGIS existantes** : RagSanitizer (15 detectors), `data_marking` (delta2), `input_output_separation` (delta2)
- **Defenses manquantes** : Compound attack detection (detecting simultaneous query manipulation + DB poisoning), vector database integrity verification (hash-based document provenance), poisoned passage detection in retrieved results

### Threat Model
- **Attaquant** : Medium-skill adversary with write access to vector database (insider threat, supply chain, or API vulnerability)
- **Surface** : ChromaDB vector database, RAG retrieval pipeline, query processing interface
- **Impact** : Integrity (poisoned medical knowledge), Patient Safety (fabricated treatment plans from poisoned DB), Confidentiality (exfiltration via manipulated responses)
- **Probabilite** : High -- 4-16pp improvement over single-vector attacks; query-agnostic (no knowledge of user intent needed)

### Impact sur Triple Convergence (D-001)
- Extends D-001 with a new dimension: compound attacks are strictly more effective than individual vectors. PIDP shows that even if delta2 (RagSanitizer) catches prompt injection, the poisoned database content persists and is served to future queries. This creates a persistence mechanism that no current AEGIS defense addresses end-to-end. The "delta1 poisonable" component of D-001 now extends to "RAG database poisonable."

---

## P055 -- RAGPoison: Persistent Prompt Injection via Poisoned Vector Databases

**Auteurs** : Rory McNamara (Snyk Labs) | **Annee** : 2025 | **Venue** : Snyk Labs Security Research

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1565.001 (Data Manipulation: Stored Data Manipulation) + T1195.002 (Supply Chain Compromise)
- **Kill Chain Phase** : Persistence (durable attack surface via vector DB poisoning)
- **Complexite** : Medium -- requires write access to vector database; ~275K vectors for consistent interception
- **Impact medical** : Critical -- persistent poisoning of medical knowledge base affects ALL future queries indefinitely; no expiration mechanism for poisoned vectors

### Mapping AEGIS
- **Chaines backend concernees** : chain_16 (RAG poisoning), chain_17 (indirect injection), chain_31 (persistent attack)
- **Templates lies** : #16 (RAG injection), #31 (persistent poisoning), #35 (data poisoning)
- **Couches delta ciblees** : delta2 (attack -- RAG layer), delta3 (attack -- data integrity, persistence)
- **Defenses AEGIS existantes** : RagSanitizer (15 detectors), `data_marking` (delta2), `quarantine_action` (RESP)
- **Defenses manquantes** : Vector database integrity monitoring (periodic hash verification), document provenance tracking (signed embeddings), poisoned vector anomaly detection (statistical outlier detection in embedding space), ChromaDB write access controls

### Threat Model
- **Attaquant** : Medium-skill adversary with database write access (insider, compromised API, supply chain)
- **Surface** : ChromaDB vector database, embedding generation pipeline
- **Impact** : Integrity (persistent medical misinformation), Patient Safety (all future patients receive poisoned responses), Availability (database must be rebuilt if poisoning detected)
- **Probabilite** : High -- demonstrated with ~275K vectors; verbatim document insertion is the core vulnerability

### Impact sur Triple Convergence (D-001)
- Strongly reinforces D-001 and extends it: adds persistence dimension to the convergence. The ~275K vector attack creates a durable attack surface that survives model updates, prompt changes, and RagSanitizer improvements. Even if delta0 and delta1 are hardened, poisoned RAG content is injected into the prompt at retrieval time, bypassing both layers. This is the empirical demonstration that "delta1 poisonable" extends to "RAG infrastructure poisonable."

---

## P056 -- Stronger Enforcement of Instruction Hierarchy via Augmented Intermediate Representations (AIR)

**Auteurs** : Sanjay Kariyappa, G. Edward Suh (NVIDIA) | **Annee** : 2025 | **Venue** : arXiv:2505.18907v2

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1548 (Abuse Elevation Control Mechanism) -- defense against privilege escalation via instruction injection
- **Kill Chain Phase** : Not applicable (defense paper)
- **Complexite** : N/A (defense -- model architecture modification)
- **Impact medical** : Positive -- 1.6x to 9.2x reduction in attack success rate means significantly safer clinical LLM deployments; preserves utility

### Mapping AEGIS
- **Chaines backend concernees** : All chains targeting delta1 instruction hierarchy
- **Templates lies** : All templates using instruction override, role hijacking, or privilege escalation
- **Couches delta ciblees** : delta0 (defense -- deeper alignment via intermediate representations), delta1 (defense -- instruction privilege enforcement at all layers)
- **Defenses AEGIS existantes** : `instruction_hierarchy` (delta1), `safety_preamble` (delta1), `role_anchoring` (delta1)
- **Defenses manquantes** : Intermediate representation injection (AIR technique) -- not in current 66 taxonomy; requires model architecture modification (not applicable to API-only models)

### Threat Model
- **Attaquant** : N/A (defense paper)
- **Surface** : Instruction hierarchy enforcement layer
- **Impact** : Positive -- 1.6x-9.2x ASR reduction without utility degradation
- **Probabilite** : N/A

### Impact sur Triple Convergence (D-001)
- Partially mitigates D-001: AIR addresses the "delta0 erasable" component by spreading instruction hierarchy signal across all transformer layers (not just input layer). However, it requires model architecture modification, making it inapplicable to closed API models. For open-weight models (Ollama/local), this is the strongest proposed delta1 defense to date.

---

## P057 -- ASIDE: Architectural Separation of Instructions and Data in Language Models

**Auteurs** : Egor Zverev, Evgenii Kortukov, Alexander Panfilov et al. (ISTA, Fraunhofer, ELLIS) | **Annee** : 2025 | **Venue** : arXiv:2503.10566v4

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1059 (Command and Scripting Interpreter) -- architectural defense against instruction/data confusion
- **Kill Chain Phase** : Not applicable (defense paper -- foundational architecture)
- **Complexite** : N/A (defense -- zero-parameter architectural modification)
- **Impact medical** : Critical positive -- orthogonal rotation separation at embedding level would eliminate the root cause of prompt injection in medical LLMs; proven Sep(M) improvement without utility loss

### Mapping AEGIS
- **Chaines backend concernees** : All 34 chains (ASIDE addresses the root cause of all prompt injection)
- **Templates lies** : All 98 templates (universal defense)
- **Couches delta ciblees** : delta0 (defense -- embedding-level separation), delta1 (defense -- enforcement from first layer onward)
- **Defenses AEGIS existantes** : `separation_score_sep_m` (DETECT -- the metric ASIDE optimizes), `delta0_attribution` (MEAS), `delta_layer_decomposition` (MEAS)
- **Defenses manquantes** : ASIDE orthogonal rotation mechanism -- not implemented; requires integration into model forward pass during instruction-tuning

### Threat Model
- **Attaquant** : N/A (defense paper)
- **Surface** : Token embedding layer (architectural defense)
- **Impact** : Positive -- addresses root cause of prompt injection; measurable via Sep(M)
- **Probabilite** : N/A

### Impact sur Triple Convergence (D-001)
- Most significant challenge to D-001 in the entire corpus: ASIDE demonstrates that architectural separation CAN achieve instruction-data distinction without utility loss. If deployed, it would address "delta0 erasable" by making alignment structurally deep rather than shallow. However, ASIDE is not yet deployed in any production medical system, and the orthogonal rotation may be vulnerable to adversarial attacks specifically designed to target it. D-001 remains valid for currently deployed systems but ASIDE represents a potential future resolution.

---

## P058 -- Automated Prompt Injection Attacks Against LLM Agents

**Auteurs** : David Hofer (ETH Zurich) | **Annee** : 2025 | **Venue** : MSc Thesis, ETH Zurich

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1059 (Command and Scripting Interpreter) + T1055 (Process Injection) + T1071 (Application Layer Protocol)
- **Kill Chain Phase** : Reconnaissance (automated discovery) + Execution (multi-turn agent exploitation)
- **Complexite** : Medium to High -- automation framework required, but once built, scales to any agent target
- **Impact medical** : Critical -- medical robot agents with tool access (AEGIS scenario) are prime targets; automated injection discovery can find vulnerabilities faster than manual red teaming

### Mapping AEGIS
- **Chaines backend concernees** : chain_06 (tool manipulation), chain_10 (agent exploitation), chain_22 (multi-turn escalation), chain_28 (compound attacks), chain_32 (agent memory poisoning)
- **Templates lies** : #06 (tool hijacking), #10 (agent exploitation), #22 (progressive escalation)
- **Couches delta ciblees** : delta1 (attack -- prompt injection crafting), delta2 (attack -- multi-turn agent exploitation)
- **Defenses AEGIS existantes** : `tool_invocation_guard` (delta3), `session_termination` (RESP), `security_audit_agent` (DETECT)
- **Defenses manquantes** : Automated injection defense (counter-automation that matches attacker automation speed), agent memory integrity verification, multi-turn injection accumulation detection

### Threat Model
- **Attaquant** : Medium to high-skill adversary with automation capabilities; once framework is built, scales to many targets
- **Surface** : LLM agent tool interface, memory/planning subsystem, multi-turn conversation state
- **Impact** : Integrity (agent performs unintended actions), Patient Safety (medical robot executes compromised tool calls), Confidentiality (agent exfiltrates data via tool access)
- **Probabilite** : High -- automated discovery means vulnerabilities are found systematically, not by chance

### Impact sur Triple Convergence (D-001)
- Reinforces D-001 with agent-level dimension: automated injection discovery means the convergence gap is exploited faster and more systematically. The gap between attack automation and defense automation widens the triple convergence -- defenses are manually designed while attacks are automatically generated. This maps to G-005 (no defense against LRM autonomes).

---

## P059 -- In-Paper Prompt Injection Attacks on AI Reviewers

**Auteurs** : Qinzhou Zhou, Zhexin Zhang, Li Zhi, Limin Sun | **Annee** : 2025 | **Venue** : NeurIPS 2025 Workshop (Socially Responsible FM)

### Vecteur d'Attaque
- **MITRE ATT&CK** : T1659 (Content Injection) + T1204.001 (User Execution: Malicious Link)
- **Kill Chain Phase** : Initial Access (via document content) + Execution (injection triggers on LLM processing)
- **Complexite** : Low (static attack) to Medium (iterative optimization against simulated model)
- **Impact medical** : High -- same attack vector applies to any LLM-in-the-loop system processing documents: medical record analysis, clinical trial review, drug interaction databases. If LLM reviewers can be manipulated, LLM clinical analyzers can too.

### Mapping AEGIS
- **Chaines backend concernees** : chain_17 (indirect injection via document), chain_26 (content injection), chain_28 (compound attacks)
- **Templates lies** : #17 (indirect injection), #26 (document poisoning)
- **Couches delta ciblees** : delta1 (attack -- static/iterative injection crafting), delta2 (attack -- adaptive optimization defeats detection)
- **Defenses AEGIS existantes** : `hidden_markup_detection` (delta2), `classifier_guard` (delta2), `data_marking` (delta2)
- **Defenses manquantes** : Document-embedded injection scanning (pre-LLM processing of incoming documents for hidden instructions), adaptive defense that co-evolves with iterative attackers

### Threat Model
- **Attaquant** : Low to medium-skill; static injection is trivial; iterative optimization requires LLM access but is automatable
- **Surface** : Any document processed by LLM (medical records, clinical notes, research papers, patient intake forms)
- **Impact** : Integrity (manipulated LLM analysis/review), Patient Safety (clinical documents could contain hidden instructions altering diagnostic LLM output)
- **Probabilite** : High -- near-perfect manipulation of frontier AI reviewers demonstrated

### Impact sur Triple Convergence (D-001)
- Reinforces D-001: demonstrates that even detection-based defenses are partially bypassed by adaptive attackers, establishing an arms-race dynamic. The static vs. iterative attack taxonomy maps directly to AEGIS's template (delta1) vs. genetic optimization (delta2) distinction. The finding that adaptive attackers circumvent defenses confirms the "delta2 bypass" component.

---

## P060 -- SoK: Evaluating Jailbreak Guardrails for Large Language Models

**Auteurs** : Xunguang Wang, Zhenlan Ji, Wenxuan Wang et al. | **Annee** : 2025 | **Venue** : IEEE S&P 2026 Cycle 1 (accepted)

### Vecteur d'Attaque
- **MITRE ATT&CK** : Survey -- covers T1059, T1027, T1562, T1190 (comprehensive guardrail evaluation)
- **Kill Chain Phase** : All phases (systematization of knowledge)
- **Complexite** : N/A (SoK paper)
- **Impact medical** : Critical benchmark -- six-dimensional taxonomy and SEU (Security-Efficiency-Utility) framework provide the most rigorous evaluation methodology for medical LLM guardrails. IEEE S&P acceptance = top-tier validation.

### Mapping AEGIS
- **Chaines backend concernees** : All 34 chains (guardrail evaluation applies universally)
- **Templates lies** : All 98 templates (benchmark applicability)
- **Couches delta ciblees** : delta0 (alignment guardrails), delta1 (input filtering), delta3 (detection/monitoring)
- **Defenses AEGIS existantes** : `classifier_guard` (delta2), `perplexity_filter` (delta2), `svc_composite_score` (DETECT), all 40/66 implemented techniques benchmarkable against SEU framework
- **Defenses manquantes** : SEU (Security-Efficiency-Utility) evaluation framework not implemented in AEGIS; six-dimensional guardrail taxonomy not mapped to AEGIS 4-class system

### Threat Model
- **Attaquant** : N/A (evaluation framework)
- **Surface** : Full guardrail stack
- **Impact** : Benchmark -- validates that no single guardrail is universal (confirms multi-layer delta architecture)
- **Probabilite** : N/A

### Impact sur Triple Convergence (D-001)
- Independently validates D-001: the finding that no single guardrail approach dominates across all attack types is the empirical confirmation of the triple convergence thesis. If any single defense could address all vectors, D-001 would be falsified -- but P060's IEEE S&P results confirm that layered defense is necessary, which is exactly what D-001 predicts. The SEU tradeoff analysis further shows that stronger security reduces utility, reinforcing the practical impossibility of a single-layer solution.

---

## Synthese RUN-003

### Nouvelles techniques MITRE identifiees
- **T1027.005** (Indicator Removal from Tools) -- P051 clinical detection evasion context
- **T1204.001** (User Execution: Malicious Link) -- P050 multi-turn manipulation, P059 document injection
- No entirely new T-codes beyond RUN-002 set, but new sub-techniques (.005, .001) and novel combinations identified

**Bilan MITRE** : 17 base techniques (RUN-002) + 2 new sub-techniques = 19 unique technique/sub-technique entries

### Nouveaux gaps de defense
- **G-007** : No compound attack detection (simultaneous query manipulation + DB poisoning) -- exposed by P054 PIDP-Attack
- **G-008** : No vector database integrity monitoring (hash verification, signed embeddings, poisoned vector anomaly detection) -- exposed by P054 + P055 RAGPoison
- **G-009** : No document-embedded injection scanning (pre-LLM processing of incoming documents) -- exposed by P059 in-paper injection
- **G-010** : No automated injection counter-defense matching attacker automation speed -- exposed by P058 automated attacks
- **G-011** : No turn-level alignment monitoring (tracking delta0 degradation per conversation turn) -- exposed by P050 JMedEthicBench
- **G-012** : AEGIS SEU evaluation framework absent -- P060 SoK defines the gold-standard evaluation methodology not yet implemented
- **G-013** : AIR intermediate-layer IH injection not implementable on API-only models -- P056 defense limited to open-weight models
- **G-014** : ASIDE orthogonal rotation not integrated -- P057 proposes the most fundamental defense but requires model architecture modification

### Mise a jour Triple Convergence (D-001)
D-001 remains valid and is STRENGTHENED by RUN-003 findings:

1. **delta0 erasable** : Reinforced by P052 (mathematical proof via martingale decomposition), P050 (empirical multi-turn degradation 9.5->5.5), P053 (semantic jailbreak taxonomy). P057 (ASIDE) offers a theoretical path to resolution but is not deployed.

2. **delta1 poisonable** : Extended by P054/P055 to include RAG infrastructure poisoning as a new attack surface. P056 (AIR) offers partial mitigation for open-weight models. P047 introduces attack-defense duality as a novel delta1 reinforcement strategy.

3. **delta2 bypass 99%** : Confirmed by P049 (100% evasion of production guardrails with character injection + AML techniques), P059 (adaptive attackers circumvent detection-based defenses), P060 (no single guardrail is universal across attack types).

**New dimension identified** : **Compound attacks** (P054) and **persistent poisoning** (P055) create attack vectors that transcend individual delta layers, requiring cross-layer defense coordination not currently present in the 66-technique taxonomy.

### Evolution de la couverture AEGIS
- Defense papers with implementable techniques: P047 (attack inversion), P051 (4D linguistic features), P056 (AIR), P057 (ASIDE)
- Proposed new defense techniques for taxonomy: +4 (attack inversion, 4D linguistic classification, AIR intermediate IH, ASIDE orthogonal rotation)
- Updated defense taxonomy target: 66 + 4 proposed = 70 techniques (40/66 implemented + 4 proposed = 44/70)

### DIFF -- RUN-003 vs RUN-002

### Added
- 14 threat models (P047-P060)
- 2 new MITRE sub-techniques (T1027.005, T1204.001)
- 8 new defense gaps (G-007 through G-014)
- 4 proposed defense techniques for taxonomy expansion
- RAG infrastructure poisoning as new D-001 dimension
- Compound attack class (simultaneous multi-vector)
- Mathematical proof of delta0 shallowness (P052 martingale decomposition)
- ASIDE as first architectural resolution candidate for D-001

### Modified
- D-001 Triple Convergence: strengthened with 3 mathematical/empirical confirmations + 1 architectural challenge (ASIDE)
- MITRE technique count: 17 base -> 19 (with sub-techniques)
- Defense gap count: G-001 through G-006 (RUN-002) -> G-001 through G-014 (RUN-003)
- Proposed taxonomy expansion: 66 + 8 (RUN-002) -> 66 + 12 (RUN-003, adding 4 from P047/P051/P056/P057)
- RAG attack surface: single-vector (RUN-002) -> compound + persistent (RUN-003)

### Unchanged
- P001-P046 threat models (46 existants) -- no modifications
- Core delta-layer framework (delta0-delta3) -- validated, not changed
- AEGIS chain architecture (34 chains) -- no structural change
- RagSanitizer 15 detectors / 12 Hackett techniques -- validated by P049

### Cross-References with Discoveries
| Discovery | Status after RUN-003 |
|-----------|---------------------|
| D-001 Triple Convergence | **REINFORCED** -- P050, P052, P053, P054, P055, P059, P060 all confirm; P057 ASIDE is only potential resolution |
| D-002 Gap delta3 universel | **UNCHANGED** -- 0/60 papers implement delta3; P060 SoK confirms delta3 is least explored |
| G-005 No LRM autonomous defense | **REINFORCED** -- P058 automated attacks widen the gap |
| G-006 No system prompt integrity | **UNCHANGED** -- no new paper addresses this; P045 (RUN-002) remains only reference |
