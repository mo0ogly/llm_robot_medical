"""Shared state and helpers used across route modules.

Centralizes the orchestrator singleton, catalog cache, and telemetry bus
so that every router accesses the same instances.
"""

import copy
from typing import Optional

# ---------------------------------------------------------------------------
# Lazy-loaded singletons
# ---------------------------------------------------------------------------

_orchestrator = None
_custom_catalog = None


def get_catalog():
    """Return attack catalog from the single source of truth (attack_catalog.py)."""
    global _custom_catalog
    if _custom_catalog is None:
        from attack_catalog import get_catalog_by_category
        _custom_catalog = copy.deepcopy(get_catalog_by_category())
    return _custom_catalog


def set_catalog(catalog: dict):
    """Replace the in-memory catalog (used by import endpoint)."""
    global _custom_catalog
    _custom_catalog = catalog


def get_orchestrator(levels=None, lang="en", provider=None, model=None):
    """Return (or create) the RedTeamOrchestrator singleton."""
    global _orchestrator
    if levels or lang != "en" or provider or model:
        from orchestrator import RedTeamOrchestrator
        return RedTeamOrchestrator(levels=levels, lang=lang, provider=provider, model=model)
    if _orchestrator is None:
        from orchestrator import RedTeamOrchestrator
        _orchestrator = RedTeamOrchestrator(lang=lang)
    return _orchestrator


def reset_orchestrator():
    """Force-recreate the global orchestrator (used by run-all)."""
    global _orchestrator
    from orchestrator import RedTeamOrchestrator
    _orchestrator = RedTeamOrchestrator()
    return _orchestrator


def get_orchestrator_instance():
    """Return the raw _orchestrator singleton (may be None)."""
    return _orchestrator
