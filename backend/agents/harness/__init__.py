"""Target Application Harness — Simulated LLM-integrated apps.

Provides simulated target applications for red teaming.
Each harness wraps a system prompt pattern commonly found in
production LLM applications, enabling structured prompt injection
testing against realistic attack surfaces.

Ported from: example_apps/ + harness/ in the original framework
(Liu et al., 2023, arXiv:2306.05499)

Date created: 2026-03-27
Last updated: 2026-03-27

Architecture (Mermaid):
```mermaid
graph LR
    ATK[Attack Prompt] --> HARNESS[Target Harness]
    HARNESS --> SYS[System prompt template]
    SYS --> LLM["LLM (via llm_factory)"]
    LLM --> RESP[Response]
    RESP --> JUDGE[Success judge]
```
"""

from .base import BaseHarness, HarnessResult, HARNESS_REGISTRY, list_harnesses, get_harness
from .intentions import Intention, INTENTIONS
from . import targets  # noqa: F401 — triggers @register_harness decorators

__all__ = [
    "BaseHarness",
    "HarnessResult",
    "HARNESS_REGISTRY",
    "list_harnesses",
    "get_harness",
    "Intention",
    "INTENTIONS",
]
