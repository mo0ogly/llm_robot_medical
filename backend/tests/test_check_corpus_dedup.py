"""Regression tests for backend.tools.check_corpus_dedup.

History of regressions captured here:
    - 2026-04-09 : Crescendo (arXiv:2404.01833 = P099) re-verified by scoped
      sub-agent because no dedup tool existed.
    - 2026-04-11 : LlamaFirewall (arXiv:2505.03574 = P084) reported NEW
      because P084's MANIFEST row had venue "Meta PurpleLlama" with no arXiv
      ID in the venue column. The arXiv ID was only in the fiche body
      (PASS 2 introduced).
    - 2026-04-12 : this test module ensures both regressions stay fixed.

Tests rely on the production MANIFEST.md and fiche bodies under
``research_archive/doc_references/`` --- they are read-only checks against
the live corpus state.
"""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest

# Load module directly (backend/tools is not a package).
_TOOL_PATH = (
    Path(__file__).resolve().parents[1] / "tools" / "check_corpus_dedup.py"
)


def _load_module():
    spec = importlib.util.spec_from_file_location(
        "check_corpus_dedup", _TOOL_PATH
    )
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules["check_corpus_dedup"] = module
    spec.loader.exec_module(module)
    return module


@pytest.fixture(scope="module")
def dedup():
    return _load_module()


# ---------------------------------------------------------------------------
# Regression #1 --- Crescendo (P099)
# ---------------------------------------------------------------------------
def test_crescendo_arxiv_is_duplicate(dedup):
    """arXiv:2404.01833 must resolve to P099 via MANIFEST PASS 1."""
    result = dedup.check_arxiv_id("2404.01833")
    assert result["status"] == "DUPLICATE", result
    assert result["p_id"] == "P099", result


def test_crescendo_version_suffix_is_duplicate(dedup):
    """Version suffix (v2) must not break the match."""
    result = dedup.check_arxiv_id("2404.01833v2")
    assert result["status"] == "DUPLICATE", result
    assert result["p_id"] == "P099", result


# ---------------------------------------------------------------------------
# Regression #2 --- LlamaFirewall (P084)
# ---------------------------------------------------------------------------
def test_llamafirewall_arxiv_is_duplicate(dedup):
    """arXiv:2505.03574 must resolve to P084 (PASS 1 or PASS 2)."""
    result = dedup.check_arxiv_id("2505.03574")
    assert result["status"] == "DUPLICATE", result
    assert result["p_id"] == "P084", result
    # The fix relies on either pass succeeding --- both are acceptable.
    assert result.get("source") in {"manifest", "fiche_body"}, result


def test_llamafirewall_title_substring_is_duplicate(dedup):
    """Title-based check must also flag the duplicate."""
    result = dedup.check_title("LlamaFirewall")
    # Title is short but distinctive --- caller must pass >= 12 chars,
    # 'LlamaFirewall' is exactly 13 chars.
    assert result["status"] == "DUPLICATE", result
    assert result["p_id"] == "P084", result


# ---------------------------------------------------------------------------
# Negative tests --- known-NEW arXiv IDs (random unused IDs)
# ---------------------------------------------------------------------------
def test_unknown_arxiv_is_new(dedup):
    """An obviously fake arXiv ID must return NEW."""
    result = dedup.check_arxiv_id("9999.99999")
    assert result["status"] == "NEW", result


def test_too_short_title_is_error(dedup):
    """Title needles below 12 chars must be rejected to avoid false positives."""
    result = dedup.check_title("LMQL")
    assert result["status"] == "ERROR", result


# ---------------------------------------------------------------------------
# Discovery ID checks (D-NNN)
# ---------------------------------------------------------------------------
def test_get_next_discovery_id_format(dedup):
    """Next free D-ID must match D-NNN pattern."""
    next_id = dedup.get_next_discovery_id()
    assert next_id.startswith("D-")
    assert len(next_id) == 5  # D-NNN
    assert next_id[2:].isdigit()


def test_discovery_id_invalid_format_is_error(dedup):
    """Malformed D-ID must return ERROR."""
    result = dedup.check_discovery_id("D-21")  # missing leading zero
    assert result["status"] == "ERROR", result


def test_discovery_id_known_existing_is_duplicate(dedup):
    """D-001 (Triple Convergence) is the canonical existing discovery."""
    result = dedup.check_discovery_id("D-001")
    assert result["status"] == "DUPLICATE", result
