"""Base adapter class with shared instrumentation for all framework adapters.

Concrete adapters subclass `BaseAdapter` and override `_evaluate_impl` to call
the underlying framework. The base class handles timing, spec parsing, and
violation code normalisation.
"""
from __future__ import annotations

import time
from abc import ABC, abstractmethod
from typing import Any, Dict, List

from backend.red_team.framework_adapters import EvalResult


class BaseAdapter(ABC):
    """Shared instrumentation for delta-3 framework adapters.

    Subclasses must override `_evaluate_impl` and may override `setup`/`teardown`.
    """

    name: str = "base"
    version: str = "0.0.0"

    def __init__(self) -> None:
        self.allowed_spec: Dict[str, Any] | None = None

    def setup(self, allowed_spec: Dict[str, Any]) -> None:
        """Store the AllowedOutputSpec for the campaign condition."""
        self.allowed_spec = allowed_spec

    def evaluate(self, prompt: str, response: str) -> EvalResult:
        """Wrap `_evaluate_impl` with timing instrumentation."""
        if self.allowed_spec is None:
            raise RuntimeError(f"{self.name}: setup() must be called before evaluate()")
        t0 = time.perf_counter()
        passed, codes, metadata = self._evaluate_impl(prompt, response)
        latency_ms = (time.perf_counter() - t0) * 1000.0
        return EvalResult(
            passed=passed, violation_codes=codes, latency_ms=latency_ms, metadata=metadata
        )

    @abstractmethod
    def _evaluate_impl(
        self, prompt: str, response: str
    ) -> tuple[bool, List[str], Dict[str, Any]]:
        """Concrete evaluation logic. Returns (passed, violation_codes, metadata)."""

    def teardown(self) -> None:
        """Default teardown: clear spec. Override for resource-holding adapters."""
        self.allowed_spec = None
