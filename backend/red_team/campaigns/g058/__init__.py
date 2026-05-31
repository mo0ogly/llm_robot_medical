"""G-058 campaign package -- 8-framework delta-3 comparative evaluation.

Decomposed from the monolithic ``run_g058_campaign.py`` in PDCA-12 (2026-05-16)
once that file exceeded the 800-line limit set by .claude/rules/programming.md.

Module map (one responsibility each):
    manifest.py      -- CampaignManifest dataclass + provenance helpers
    specs.py         -- AllowedOutputSpec factories + synthetic dry-run fixtures
    loaders.py       -- template / scenario loaders + payload synthesis
    registry.py      -- framework adapter registry, adaptive list, compositions
    genetic.py       -- mutation operators + GA search (SC-3)
    subcampaigns.py  -- run_sc1 / run_sc2 / run_sc3 / run_sc4
    cli.py           -- argparse entry point

The thin wrapper ``run_g058_campaign.py`` keeps the original module path
``python -m backend.red_team.campaigns.run_g058_campaign`` working.
"""
from __future__ import annotations

from backend.red_team.campaigns.g058.manifest import CampaignManifest
from backend.red_team.campaigns.g058.registry import (
    ADAPTIVE_FRAMEWORKS,
    COMPOSITIONS,
    all_adapters,
)
from backend.red_team.campaigns.g058.subcampaigns import (
    run_sc1,
    run_sc2,
    run_sc3,
    run_sc4,
)

__all__ = [
    "CampaignManifest",
    "ADAPTIVE_FRAMEWORKS",
    "COMPOSITIONS",
    "all_adapters",
    "run_sc1",
    "run_sc2",
    "run_sc3",
    "run_sc4",
]
