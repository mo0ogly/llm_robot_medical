"""Genetic Prompt Optimization Engine for Medical Red Teaming.

This module implements a genetic algorithm-based prompt injection optimizer
for automated red teaming of LLM-integrated medical systems. The architecture
follows the three-component model (Framework, Separator, Disruptor) described
in Liu et al. (2023) "Prompt Injection attack against LLM-integrated Applications"
(arXiv:2306.05499), adapted for the medical Da Vinci surgical context.

Key improvements over the original implementation:
    - Ollama-native LLM calls (replaces deprecated OpenAI v0.27 API)
    - Fully async architecture (replaces ThreadPoolExecutor)
    - Dual scoring: LLM fitness judge + AEGIS formal verification
    - Medical-domain separators, disruptors, and framework generators
    - SSE streaming for real-time frontend visualization
    - Robust mutation parsing with JSON fallback

Modules:
    llm_bridge: Ollama-native LLM completion with retry logic
    chromosome: Core data structures (Chromosome, AttackPayload, AttackIntention)
    intentions: Medical attack intentions (7 types)
    components: Framework, Separator, and Disruptor generators (18 variants)
    fitness: LLM-based fitness ranking with AEGIS bridge
    mutation: LLM-based chromosome mutation with robust parsing
    optimizer: Genetic algorithm optimizer (async, SSE-capable)
    context_infer: Context inference engine for Da Vinci target
    harness: Target harness connecting to MedicalRobotAgent

Reference:
    Liu, Y., Deng, G., Li, Y., Wang, K., Zhang, T., Liu, Y., Wang, H.,
    Zheng, Y., & Liu, Y. (2023). Prompt Injection attack against
    LLM-integrated Applications. arXiv:2306.05499.
"""

__version__ = "1.0.0"
__author__ = "PoC Medical Red Team Lab"
__reference__ = "arXiv:2306.05499"

# Re-export key classes for convenient imports
from .chromosome import Chromosome, AttackPayload  # noqa: F401, E402
from .optimizer import GeneticPromptOptimizer, GeneticOptimizerConfig  # noqa: F401, E402
from .context_infer import ContextInferenceEngine  # noqa: F401, E402
