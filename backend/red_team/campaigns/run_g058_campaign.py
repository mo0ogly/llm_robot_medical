"""G-058 campaign orchestrator -- thin entry-point wrapper.

The implementation was decomposed into the ``g058/`` package in PDCA-12
(2026-05-16) once this file exceeded the 800-line limit set by
.claude/rules/programming.md. See ``g058/__init__.py`` for the module map.

This wrapper preserves the original invocation path:
    python -m backend.red_team.campaigns.run_g058_campaign --subcampaign SC1 --dry-run

The four sub-campaigns (see g058/subcampaigns.py):
    SC-1 : 8 frameworks x N generic templates x N trials
    SC-2 : 8 frameworks x N medical scenarios x N trials
    SC-3 : 5 adaptive frameworks x N templates x genetic search
    SC-4 : AEGIS composed with Outlines / CaMeL / AgentSpec
"""
from __future__ import annotations

import sys

from backend.red_team.campaigns.g058.cli import main

# Re-export the public campaign API for backward-compatible imports.
from backend.red_team.campaigns.g058 import (  # noqa: F401
    ADAPTIVE_FRAMEWORKS,
    COMPOSITIONS,
    CampaignManifest,
    all_adapters,
    run_sc1,
    run_sc2,
    run_sc3,
    run_sc4,
)

__all__ = [
    "main",
    "CampaignManifest",
    "ADAPTIVE_FRAMEWORKS",
    "COMPOSITIONS",
    "all_adapters",
    "run_sc1",
    "run_sc2",
    "run_sc3",
    "run_sc4",
]


if __name__ == "__main__":
    sys.exit(main())
