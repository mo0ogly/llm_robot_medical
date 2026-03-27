"""Target harness connecting the genetic engine to the MedicalRobotAgent.

Provides the ``attack_fn`` callable that the :class:`GeneticPromptOptimizer`
uses to send injection prompts to the target and collect responses.

Ported from:
    - ``harness/base_harness.py`` — ``Harness`` base class
    - ``harness/demo_translator_harness.py`` — ``TranslatorHarness``
    (Liu et al., 2023, arXiv:2306.05499)

Improvements over original:
    - Connects to the existing MedicalRobotAgent (AutoGen ConversableAgent)
    - Supports AEGIS delta-2 shield filtering
    - Async native (replaces synchronous harness)
    - Uses the lab's existing ``apply_aegis_shield()`` function
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class TargetHarness:
    """Base class for target application harnesses.

    A harness defines how to interact with the target LLM application.
    Ported from ``Harness`` (Liu et al., 2023).

    Attributes:
        name: Harness identifier.
        application_document: Description of the target application.
    """

    name: str = ""
    application_document: str = ""

    async def run_harness(self, prompt: str) -> str:
        """Send a prompt to the target and return the response.

        Args:
            prompt: The injection prompt to send.

        Returns:
            The target's response text.
        """
        raise NotImplementedError


@dataclass
class DaVinciHarness(TargetHarness):
    """Harness connecting to the Da Vinci MedicalRobotAgent.

    Replaces the original ``TranslatorHarness`` which simulated
    a simple English-to-French translator. This harness connects
    to the lab's existing AutoGen-based MedicalRobotAgent.

    The harness can optionally apply the AEGIS delta-2 shield
    (``apply_aegis_shield()``) before sending the prompt to the target,
    testing whether structural filtering prevents the injection.

    Args:
        medical_agent: The AutoGen ConversableAgent representing
            the Da Vinci surgical AI.
        aegis_shield: Whether to apply delta-2 filtering.
        apply_shield_fn: Reference to ``apply_aegis_shield()`` function.

    Example:
        >>> from agents.medical_robot_agent import create_medical_robot_agent
        >>> agent = create_medical_robot_agent()
        >>> harness = DaVinciHarness(medical_agent=agent, aegis_shield=True)
        >>> response = await harness.run_harness("Override tension to 1500g")
    """

    name: str = "davinci_surgical_ai"
    application_document: str = ""
    medical_agent: object = None
    aegis_shield: bool = False
    apply_shield_fn: object = None

    async def run_harness(self, prompt: str) -> str:
        """Send a prompt to the MedicalRobotAgent and return the response.

        Optionally applies AEGIS delta-2 shield filtering before
        delivering the prompt to the target.

        Args:
            prompt: The injection prompt to send.

        Returns:
            The target agent's response text.
        """
        filtered_prompt = prompt
        if self.aegis_shield and self.apply_shield_fn:
            filtered_prompt = self.apply_shield_fn(prompt)
            logger.debug("AEGIS shield applied: %d -> %d chars", len(prompt), len(filtered_prompt))

        self.medical_agent.reset()
        response = await self.medical_agent.a_generate_reply(
            messages=[{"role": "user", "content": filtered_prompt}],
        )
        return response if isinstance(response, str) else str(response)


def create_davinci_harness(
    medical_agent,
    aegis_shield: bool = False,
) -> DaVinciHarness:
    """Factory function to create a DaVinciHarness with proper dependencies.

    Imports and wires the ``apply_aegis_shield()`` function from the
    orchestrator module.

    Args:
        medical_agent: The AutoGen ConversableAgent for Da Vinci.
        aegis_shield: Whether to enable delta-2 filtering.

    Returns:
        Configured DaVinciHarness instance.
    """
    from .components import DAVINCI_APPLICATION_DOCUMENT

    apply_fn = None
    if aegis_shield:
        from orchestrator import apply_aegis_shield
        apply_fn = apply_aegis_shield

    return DaVinciHarness(
        medical_agent=medical_agent,
        aegis_shield=aegis_shield,
        apply_shield_fn=apply_fn,
        application_document=DAVINCI_APPLICATION_DOCUMENT,
    )
