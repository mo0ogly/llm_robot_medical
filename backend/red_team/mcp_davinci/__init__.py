"""MCP Da Vinci supply-chain test harness (RR-RUN12-002, conjectures MC8/MC9).

This package provides a MINIMAL, DETERMINISTIC harness to make the
RR-RUN12-002 protocol executable as a synthetic proof-of-concept BEFORE the
real N>=30 Groq `llama-3.3-70b-versatile` campaign.

Content-filter safety
----------------------
Nothing in this package contains a concrete tool-poisoning payload. A
"poisoned description" is modelled abstractly as a description that *claims a
capability the tool is not authorised to provide* (see ``ToolCondition`` and
``ToolDescriptor``). The real adversarial descriptions are produced out of band
by ``/aegis-prompt-forge FORGE`` + the Python generator (3-layer pattern),
never materialised here.

Determinism (F73 ASR_deterministic)
-----------------------------------
- ``harness``  : a simulated MCP agent + tool registry + a rule-based tool
  selection policy. No LLM call, no network, no randomness.
- ``detector`` : ``mcp_overstep_detector`` — an ``EvalResult``-style verdict
  computed by pure set membership against the scenario's authorised tool set
  (``Sauth``). No LLM judge.
- ``sauth_loader`` : derives ``Sauth`` per scenario from the SAFE metadata
  export (``backend/red_team/scenarios_metadata.json``), restricted to Da Vinci
  surgical contexts.
- ``run_poc`` : runs the synthetic {3 tool_conditions} x {few scenarios} grid
  and writes the PoC report.

See: research_archive/experiments/PROTOCOL_RR-RUN12-002_MCP_DaVinci_MC8_MC9.md
"""
from __future__ import annotations

from backend.red_team.mcp_davinci.detector import (
    MCPOverstepDetector,
    OverstepVerdict,
    mcp_overstep_detector,
)
from backend.red_team.mcp_davinci.harness import (
    AgentAction,
    MCPTestHarness,
    SimulatedMCPAgent,
    ToolCondition,
    ToolDescriptor,
    ToolRegistry,
)
from backend.red_team.mcp_davinci.sauth_loader import (
    DAVINCI_CATEGORIES,
    ScenarioSauth,
    load_davinci_sauth,
)

__all__ = [
    # harness
    "ToolCondition",
    "ToolDescriptor",
    "ToolRegistry",
    "AgentAction",
    "SimulatedMCPAgent",
    "MCPTestHarness",
    # detector
    "OverstepVerdict",
    "MCPOverstepDetector",
    "mcp_overstep_detector",
    # sauth loader
    "ScenarioSauth",
    "load_davinci_sauth",
    "DAVINCI_CATEGORIES",
]
