# P050 — JMedEthicBench: A Multi-Turn Adversarial Benchmark for Japanese Medical Ethics Alignment in LLMs

| Field | Value |
|-------|-------|
| **ID** | P050 |
| **Title** | JMedEthicBench: A Multi-Turn Adversarial Benchmark for Japanese Medical Ethics Alignment in LLMs |
| **Authors** | Junyu Liu, Zirui Li, Qian Niu, Zequn Zhang, Yue Xun, Wenlong Hou, Shujun Wang, Yusuke Iwasawa, Yutaka Matsuo, Kan Hatakeyama-Sato |
| **Year** | 2026 |
| **Venue** | arXiv preprint (2601.01627v2) |
| **URL** | https://arxiv.org/html/2601.01627v2 |
| **Topic** | Medical AI safety / jailbreaks |
| **δ-layers** | δ⁰ (alignment degradation over turns), δ¹ (medical ethics compliance) |
| **Conjectures** | C1 (multi-turn degradation), C2 (domain-specialized vulnerability), C5 (cross-lingual transfer) |

## Abstract

This research introduces a novel evaluation framework for assessing the safety of language models in medical contexts using Japanese. The benchmark comprises over 50,000 adversarial conversations grounded in 67 clinical guidelines from the Japan Medical Association. The authors evaluated 22 models across multiple categories and discovered that safety scores decline significantly across conversation turns, with median values dropping from 9.5 to 5.5 (p<0.001). A key finding reveals that domain-specialized medical models demonstrate greater vulnerability than general-purpose commercial models. The evaluation employed a dual-LLM scoring protocol and identified seven automatically discovered jailbreak strategies. Cross-lingual analysis of medical models showed vulnerabilities persisting across Japanese and English, suggesting fundamental alignment limitations rather than language-specific factors.

## Key Contributions

- 50,000+ adversarial multi-turn conversations grounded in 67 Japan Medical Association clinical guidelines
- Evaluation of 22 models showing significant safety degradation over conversation turns (9.5 to 5.5, p<0.001)
- Discovery that medical-specialized models are MORE vulnerable than general-purpose models
- Dual-LLM scoring protocol for automated safety evaluation
- 7 automatically discovered jailbreak strategies
- Cross-lingual analysis showing vulnerabilities are alignment-level, not language-specific

## Relevance to AEGIS

Directly relevant to the AEGIS medical robotics scenario. The finding that specialized medical models are more vulnerable than general models validates the AEGIS hypothesis that domain fine-tuning can weaken δ⁰ alignment. The multi-turn degradation (9.5 to 5.5) provides quantitative evidence for the AEGIS attack chain strategy of using progressive conversation turns. The cross-lingual persistence finding supports testing in multiple languages. The dual-LLM scoring protocol could be adapted for the AEGIS LLM Judge module. The 50,000 conversation dataset scale sets a benchmark for AEGIS Sep(M) statistical validity requirements (N>=30).
