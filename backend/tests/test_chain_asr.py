"""Unit tests for backend.metrics.chain_asr.

Validates Chain-ASR(k) under three regimes:
    - Independent defenses : Chain-ASR(k) ~= product of P_i.
    - Perfectly correlated defenses (rho = 1) : Chain-ASR(2) ~= P_0.
    - Anti-correlated defenses : Chain-ASR(2) close to 0.
"""
from __future__ import annotations

import random

import pytest

from backend.metrics.chain_asr import (
    estimate_chain_asr,
    format_chain_asr_table,
    wilson_interval,
)


# ---------------------------------------------------------------------------
# Wilson interval tests
# ---------------------------------------------------------------------------
def test_wilson_typical_case():
    """50 percent over 100 trials should yield ~+/-10 pp CI."""
    low, high = wilson_interval(50, 100, confidence=0.95)
    assert 0.39 <= low <= 0.41, (low, high)
    assert 0.59 <= high <= 0.61, (low, high)


def test_wilson_zero_successes():
    """0 successes yields lower = 0, finite upper."""
    low, high = wilson_interval(0, 30)
    assert low == 0.0
    assert 0.05 <= high <= 0.15


def test_wilson_validation_errors():
    with pytest.raises(ValueError):
        wilson_interval(0, 0)
    with pytest.raises(ValueError):
        wilson_interval(-1, 10)
    with pytest.raises(ValueError):
        wilson_interval(11, 10)


# ---------------------------------------------------------------------------
# Chain-ASR tests
# ---------------------------------------------------------------------------
def test_chain_asr_independent_defenses():
    """Independent stochastic defenses : product approximation holds within 5pp."""
    rng = random.Random(42)
    payloads = [f"payload_{i}" for i in range(50)]

    def d0(_p: str) -> bool:
        # P_pass = 0.5
        return rng.random() < 0.5

    def d1(_p: str) -> bool:
        return rng.random() < 0.5

    results = estimate_chain_asr(payloads, [d0, d1], n_trials_per_payload=20)
    # Chain-ASR(2) should be near 0.25 under independence
    assert 0.20 <= results[2].asr_k <= 0.30, results[2].asr_k


def test_chain_asr_perfectly_correlated():
    """Two identical defenses : Chain-ASR(2) ~= Chain-ASR(1) (no marginal protection)."""
    payloads = [f"payload_{i}" for i in range(40)]
    # Both defenses make the SAME decision : pass if payload index is even
    def d_even(p: str) -> bool:
        return int(p.split("_")[1]) % 2 == 0

    results = estimate_chain_asr(payloads, [d_even, d_even], n_trials_per_payload=1)
    # Chain-ASR(1) should equal Chain-ASR(2) (perfect correlation)
    assert results[1].asr_k == pytest.approx(results[2].asr_k, abs=1e-6)
    # Positive correlation flagged
    assert results[2].correlation_sign == "positive"


def test_chain_asr_anti_correlated():
    """Two anti-correlated defenses : Chain-ASR(2) approaches 0."""
    payloads = [f"payload_{i}" for i in range(40)]
    def d_even(p: str) -> bool:
        return int(p.split("_")[1]) % 2 == 0

    def d_odd(p: str) -> bool:
        return int(p.split("_")[1]) % 2 == 1

    results = estimate_chain_asr(payloads, [d_even, d_odd], n_trials_per_payload=1)
    # No payload can pass both
    assert results[2].asr_k == 0.0
    # Negative correlation flagged
    assert results[2].correlation_sign == "negative"


def test_chain_asr_deterministic_pass_all():
    """All-pass defense chain : Chain-ASR(k) = 1 for all k."""
    payloads = [f"payload_{i}" for i in range(20)]
    pass_all = lambda _p: True
    results = estimate_chain_asr(payloads, [pass_all, pass_all, pass_all], n_trials_per_payload=1)
    for k in results:
        assert results[k].asr_k == 1.0


def test_chain_asr_validation_errors():
    with pytest.raises(ValueError):
        estimate_chain_asr([], [lambda _p: True])
    with pytest.raises(ValueError):
        estimate_chain_asr(["payload"], [])


def test_format_table_runs():
    """format_chain_asr_table produces a valid Markdown table."""
    payloads = ["p1", "p2"]
    results = estimate_chain_asr(payloads, [lambda _p: True], n_trials_per_payload=1)
    table = format_chain_asr_table(results)
    assert "| k |" in table
    assert "| 1 |" in table
