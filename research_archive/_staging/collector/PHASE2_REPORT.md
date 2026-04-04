# Phase 2 Collection Report -- 2026 Papers

**Date**: 2026-04-04
**Agent**: Collector Vague 2
**Queries executed**: 6/6
**Papers collected**: 12 (P035--P046)
**ID range**: P035--P046 (continuing from Phase 1 P034)

## Summary

Phase 2 targeted exclusively 2026 publications (January--April 2026) on prompt injection, LLM safety, medical AI security, RLHF robustness, guardrails bypass, and separation score detection. Six web searches were executed and results were cross-referenced against Phase 1 (34 papers) for deduplication. Zero duplicates were found -- all 12 papers are new.

## Papers by Domain

| Domain | Count | IDs |
|--------|-------|-----|
| attack | 4 | P036, P039, P044, P045 |
| defense | 4 | P038, P041, P042, P046 |
| medical | 2 | P035, P040 |
| benchmark | 2 | P037, P043 |

## Papers by Source Query

| Query # | Topic | Papers Found |
|---------|-------|-------------|
| 1 | prompt injection attack defense | P045 |
| 2 | LLM safety jailbreak | P036, P037, P043 |
| 3 | medical AI clinical | P035, P040 |
| 4 | RLHF alignment adversarial | P039, P041, P046 |
| 5 | guardrails bypass | P044 |
| 6 | separation score detection | P038, P042 |

## Key 2026 Findings

### Attacks (4 papers)

1. **LRMs as autonomous jailbreak agents** (P036, Nature Comms): Large reasoning models achieve 97.14% jailbreak success autonomously -- alignment regression where reasoning capability enables subversion.
2. **GRP-Obliteration** (P039, Microsoft): A single unlabeled prompt unaligns 15 LLMs via GRPO reward manipulation -- generalizes to diffusion models.
3. **AdvJudge-Zero** (P044, Unit 42): Automated fuzzer achieves 99% guardrail bypass using stealthy low-perplexity control tokens on AI judge systems.
4. **System Prompt Poisoning** (P045, ICLR 2026 review): Persistent poisoning of system prompts degrades all subsequent interactions; current black-box defenses ineffective.

### Defenses (4 papers)

1. **InstruCoT** (P038): Instruction-level chain-of-thought fine-tuning achieves >90% defense rates across 7 attack methods on 4 LLMs.
2. **Magic-Token Co-Training** (P041): Switchable safety via magic tokens -- 8B model surpasses DeepSeek-R1 (671B) in safety alignment.
3. **PromptArmor** (P042, ICLR 2026 review): Modern LLMs as guardrails achieve <1% FPR/FNR on AgentDojo benchmark.
4. **ADPO** (P046): Adversary-aware DPO for VLMs with PGD perturbations in image and latent space.

### Medical (2 papers)

1. **MPIB** (P035): 9,697-instance benchmark with Clinical Harm Event Rate (CHER) metric -- ASR and clinical harm diverge.
2. **Healthcare Misinformation Framework** (P040, Springer): 112 attack scenarios across 8 LLMs; emotional manipulation raises medical misinformation from 6.2% to 37.5%.

### Benchmarks (2 papers)

1. **Jailbreak Survey** (P037): Three-dimensional taxonomy (attacks/defenses/metrics) covering LLMs and VLMs.
2. **JBDistill** (P043, EMNLP 2025 Findings): Renewable benchmarking via distillation, 81.8% effectiveness across 13 models.

## Thesis Relevance

| Paper | Thesis Connection |
|-------|-------------------|
| P035 (MPIB) | Direct comparand for AEGIS medical safety evaluation -- CHER vs SVC metrics |
| P036 (LRM jailbreak) | Validates thesis claim that reasoning models escalate adversarial risk |
| P038 (InstruCoT) | Defense baseline for comparison with AEGIS multi-agent defense pipeline |
| P039 (GRP-Obliteration) | Supports shallow alignment hypothesis (complements P018/P019 from Phase 1) |
| P040 (Healthcare misinfo) | Emotional manipulation attack vector -- novel dimension for AEGIS scenarios |
| P041 (Magic tokens) | Safety Alignment Margin concept relates to separation score framework |
| P042 (PromptArmor) | LLM-as-guardrail approach -- compare with AEGIS RagSanitizer architecture |
| P044 (AdvJudge-Zero) | Adversarial robustness of judge models -- relevant to AEGIS LLM judge |

## Combined Corpus Statistics

- **Phase 1**: 34 papers (2023--2025)
- **Phase 2**: 12 papers (2025--2026)
- **Total**: 46 papers
- **Domains covered**: attack, defense, benchmark, medical, embedding, model_behavior
