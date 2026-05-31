"""Framework adapter registry for the G-058 campaign.

LMQLAdapter (P134) was retired from the active panel in PDCA-6 (2026-05-16):
LMQL has no Ollama backend (eth-sri/lmql issue #353) and the LLaMA 3 GGUF
tokenizer integration is broken (issue #350). It is replaced by Outlines
(P135, Willard & Louf 2023, arXiv:2307.09702), an FSM-based formal validator
with native LLaMA 3 support. The lmql_adapter.py file is kept for traceability.
"""
from __future__ import annotations

from typing import List

from backend.red_team.framework_adapters.aegis_adapter import AEGISAdapter
from backend.red_team.framework_adapters.agentspec_adapter import AgentSpecAdapter
from backend.red_team.framework_adapters.camel_adapter import CaMeLAdapter
from backend.red_team.framework_adapters.guardrails_adapter import GuardrailsAdapter
from backend.red_team.framework_adapters.llamafirewall_adapter import LlamaFirewallAdapter
from backend.red_team.framework_adapters.llm_guard_adapter import LLMGuardAdapter
from backend.red_team.framework_adapters.outlines_adapter import OutlinesAdapter
from backend.red_team.framework_adapters.ragshield_adapter import RAGShieldAdapter


def all_adapters() -> List:
    """Return one fresh instance of each of the 8 framework adapters."""
    return [
        OutlinesAdapter(),
        GuardrailsAdapter(),
        LLMGuardAdapter(),
        CaMeLAdapter(),
        AgentSpecAdapter(),
        LlamaFirewallAdapter(),
        RAGShieldAdapter(),
        AEGISAdapter(),
    ]


# Adaptive frameworks (SC-3): those whose configuration (rules, FSM, schema) can
# be tightened in response to attack patterns. Per G-058 paragraph 3.2.
ADAPTIVE_FRAMEWORKS = [
    ("Outlines", OutlinesAdapter),
    ("CaMeL", CaMeLAdapter),
    ("AgentSpec", AgentSpecAdapter),
    ("LlamaFirewall", LlamaFirewallAdapter),
    ("AEGIS", AEGISAdapter),
]


# Pre-defined compositions (SC-4) per G-058 paragraph 3.4 (Triple Convergence
# extension, hypothesis H3). AEGIS is always the second-stage gate (stricter).
COMPOSITIONS = {
    "AEGIS+Outlines": OutlinesAdapter,
    "AEGIS+CaMeL": CaMeLAdapter,
    "AEGIS+AgentSpec": AgentSpecAdapter,
}
