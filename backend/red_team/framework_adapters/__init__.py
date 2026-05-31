"""Framework adapters for the G-058 7-frameworks delta-3 comparative campaign.

Each adapter wraps an external defense framework (LMQL, Guardrails AI, LLM Guard,
CaMeL, AgentSpec, LlamaFirewall, RAGShield) so the AEGIS campaign harness can call
them uniformly through the FrameworkAdapter Protocol.

See: research_archive/_staging/experiment-planner/G058_CAMPAGNE_7_FRAMEWORKS_DELTA3.md
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Protocol


@dataclass(frozen=True)
class EvalResult:
    """Outcome of evaluating a single (prompt, response) pair against a defense.

    Attributes:
        passed: True if the framework accepted the output (no violation flagged).
        violation_codes: list of violation codes raised, empty if passed.
        latency_ms: time elapsed in milliseconds.
        metadata: arbitrary framework-specific extras (e.g. SVC dims).
    """

    passed: bool
    violation_codes: list[str]
    latency_ms: float
    metadata: Dict[str, Any]


class FrameworkAdapter(Protocol):
    """Protocol every delta-3 framework adapter must implement.

    The campaign harness calls `setup` once per condition, then `evaluate`
    repeatedly for each trial, then `teardown` to release resources.
    """

    name: str
    version: str

    def setup(self, allowed_spec: Dict[str, Any]) -> None:
        """Initialise the framework with an AllowedOutputSpec-compatible dict."""

    def evaluate(self, prompt: str, response: str) -> EvalResult:
        """Run the framework on a single (prompt, response) pair."""

    def teardown(self) -> None:
        """Release model/process resources held by the adapter."""


__all__ = ["EvalResult", "FrameworkAdapter"]
