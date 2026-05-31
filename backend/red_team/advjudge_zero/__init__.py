"""AdvJudge-Zero — adversarial evaluation of LLM-as-judge defenses.

Implements G-062 : red-team the security_audit_agent (and any LLM-as-judge in
the AEGIS pipeline) using three vectors documented in P044 (99% bypass via
control tokens) and AdvJudge-Zero (Ren et al. 2025).

Vectors:
    - TOKEN_INJECTION : pre/post-fix special tokens to force compliant verdict
    - FRAME_MANIPULATION : reframe output as already-validated
    - SEMANTIC_OBFUSCATION : paraphrase using SNOMED-CT synonyms

See: research_archive/_staging/experiment-planner/G062_ADVJUDGE_ZERO_PORT.md
"""
from backend.red_team.advjudge_zero.modifiers import (
    AdvJudgeModifier,
    FrameManipulationModifier,
    SemanticObfuscationModifier,
    TokenInjectionModifier,
)
from backend.red_team.advjudge_zero.runner import AdvJudgeRunner

__all__ = [
    "AdvJudgeModifier",
    "TokenInjectionModifier",
    "FrameManipulationModifier",
    "SemanticObfuscationModifier",
    "AdvJudgeRunner",
]
