"""Base Harness — Abstract target application wrapper.

All harnesses inherit from ``BaseHarness`` and implement ``run()``.
The registry allows dynamic discovery and instantiation from the UI.

Source: harness/base_harness.py in the original framework
Date created: 2026-03-27
Last updated: 2026-03-27
Improvement level: L3 (high — dataclass + async + result scoring + registry)
"""

import logging
import time
from dataclasses import dataclass, field
from typing import Any

from .intentions import Intention

logger = logging.getLogger(__name__)

# ── Global harness registry ────────────────────────────────────────
HARNESS_REGISTRY: dict[str, type] = {}


def register_harness(cls):
    """Class decorator to register a harness in the global registry.

    Usage::

        @register_harness
        class MyHarness(BaseHarness):
            name = "my_app"
            ...

    Args:
        cls: Harness class to register.

    Returns:
        The same class, now registered.
    """
    HARNESS_REGISTRY[cls.name] = cls
    return cls


def list_harnesses() -> list[dict]:
    """Return metadata for all registered harnesses.

    Returns:
        List of dicts with keys: name, description, category.
    """
    return [
        {
            "name": cls.name,
            "description": cls.description,
            "category": cls.category,
        }
        for cls in HARNESS_REGISTRY.values()
    ]


def get_harness(name: str, **kwargs) -> "BaseHarness":
    """Instantiate a harness by name.

    Args:
        name: Registered harness name.
        **kwargs: Forwarded to the harness constructor.

    Returns:
        Instantiated harness.

    Raises:
        KeyError: If name is not registered.
    """
    if name not in HARNESS_REGISTRY:
        raise KeyError(
            f"Unknown harness '{name}'. "
            f"Available: {list(HARNESS_REGISTRY.keys())}"
        )
    return HARNESS_REGISTRY[name](**kwargs)


# ── Result dataclass ───────────────────────────────────────────────
@dataclass
class HarnessResult:
    """Result of running an attack against a harness.

    Attributes:
        harness_name: Which target app was attacked.
        intention: The attack intention used.
        attack_prompt: The full prompt sent to the target.
        application_prompt: The assembled prompt (system + injection).
        response: Raw LLM response.
        success: Whether the attack succeeded (based on markers).
        matched_markers: Which success markers were found.
        elapsed_ms: Execution time in milliseconds.
    """

    harness_name: str = ""
    intention: str = ""
    attack_prompt: str = ""
    application_prompt: str = ""
    response: str = ""
    success: bool = False
    matched_markers: list[str] = field(default_factory=list)
    elapsed_ms: float = 0.0


# ── Base harness class ─────────────────────────────────────────────
@dataclass
class BaseHarness:
    """Abstract base class for target application harnesses.

    Subclasses must set ``name``, ``description``, ``system_template``
    and optionally override ``build_prompt()`` or ``judge()``.

    Attributes:
        name: Unique identifier for this harness.
        description: Human-readable description.
        category: UI grouping category.
        system_template: System prompt template with ``{user_input}`` placeholder.
        model: LLM model to use (default: llama3).
    """

    name: str = ""
    description: str = ""
    category: str = "general"
    system_template: str = ""
    model: str = "llama3"

    def build_prompt(self, attack_prompt: str) -> str:
        """Assemble the full application prompt.

        Inserts the attack prompt into the system template,
        simulating how a real app would process user input.

        Args:
            attack_prompt: The injection payload.

        Returns:
            Complete prompt string sent to the LLM.
        """
        return self.system_template.format(user_input=attack_prompt)

    def judge(self, response: str, intention: Intention) -> tuple[bool, list[str]]:
        """Judge whether the attack succeeded.

        Checks if any success markers from the intention appear
        in the LLM response (case-insensitive).

        Args:
            response: Raw LLM response text.
            intention: Attack intention with success markers.

        Returns:
            Tuple of (success: bool, matched_markers: list[str]).
        """
        response_lower = response.lower()
        matched = [
            m for m in intention.success_markers
            if m.lower() in response_lower
        ]
        return len(matched) > 0, matched

    def run(
        self,
        attack_prompt: str,
        intention: Intention | None = None,
        **kwargs: Any,
    ) -> HarnessResult:
        """Execute the attack against this target application.

        Args:
            attack_prompt: The injection payload string.
            intention: Optional attack intention for success judging.
            **kwargs: Extra args forwarded to the LLM.

        Returns:
            HarnessResult with response and success assessment.
        """
        from backend.agents.attack_chains.llm_factory import get_llm

        app_prompt = self.build_prompt(attack_prompt)
        logger.info("[%s] Prompt assembled (%d chars)", self.name, len(app_prompt))

        t0 = time.perf_counter()
        try:
            llm = get_llm(model=self.model, **kwargs)
            response_obj = llm.invoke(app_prompt)
            response = (
                response_obj.content
                if hasattr(response_obj, "content")
                else str(response_obj)
            )
        except Exception as exc:
            logger.error("[%s] LLM invocation failed: %s", self.name, exc)
            response = f"[ERROR] {exc}"
        elapsed = (time.perf_counter() - t0) * 1000

        success = False
        matched = []
        if intention:
            success, matched = self.judge(response, intention)

        result = HarnessResult(
            harness_name=self.name,
            intention=intention.name if intention else "",
            attack_prompt=attack_prompt,
            application_prompt=app_prompt,
            response=response,
            success=success,
            matched_markers=matched,
            elapsed_ms=round(elapsed, 1),
        )

        logger.info(
            "[%s] Attack %s (%.0fms, markers=%s)",
            self.name,
            "SUCCEEDED" if success else "FAILED",
            elapsed,
            matched,
        )
        return result
