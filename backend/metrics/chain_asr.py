"""Chain-ASR(k) metric — cumulative bypass probability through k defense layers.

Implements the formalisation of G-061 (see
`research_archive/_staging/matheux/G061_CHAIN_ASR_K_METRIC.md`).

Chain-ASR(k) = P(payload passes D_0 AND D_1 AND ... AND D_{k-1})

Under conditional independence between defense layers:
    Chain-ASR(k) = product_{i=0}^{k-1} P_i

A chi-squared test of independence on the contingency matrix of layer
decisions is also provided so we can detect violations of the independence
hypothesis (and report sub/super-martingale behaviour as discussed in P052).

Authors: AEGIS thesis project — MATHEUX + experiment-planner.
Date: 2026-05-16
"""
from __future__ import annotations

import logging
import math
from dataclasses import dataclass
from typing import Callable, Dict, Iterable, List, Sequence

from scipy.stats import chi2_contingency, norm

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Confidence intervals
# ---------------------------------------------------------------------------
def wilson_interval(
    successes: int, n_trials: int, confidence: float = 0.95
) -> tuple[float, float]:
    """Wilson score interval for a binomial proportion.

    Args:
        successes: count of successful trials (e.g. ``Chain-ASR pass`` events).
        n_trials: total number of trials (must be > 0).
        confidence: confidence level, default 0.95.

    Returns:
        Tuple ``(lower, upper)`` bounding the proportion at the given level.

    Raises:
        ValueError: if ``n_trials <= 0`` or ``successes`` is outside ``[0, n_trials]``.
    """
    if n_trials <= 0:
        raise ValueError("n_trials must be > 0")
    if not (0 <= successes <= n_trials):
        raise ValueError("successes must be in [0, n_trials]")

    p_hat = successes / n_trials
    z = norm.ppf(1 - (1 - confidence) / 2)
    denom = 1 + z**2 / n_trials
    center = (p_hat + z**2 / (2 * n_trials)) / denom
    spread = (
        z * math.sqrt(p_hat * (1 - p_hat) / n_trials + z**2 / (4 * n_trials**2))
    ) / denom
    return max(0.0, center - spread), min(1.0, center + spread)


# ---------------------------------------------------------------------------
# Result container
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class ChainASRResult:
    """Chain-ASR(k) estimate with Wilson CI and independence test outcome.

    Attributes:
        k: number of defense layers traversed.
        asr_k: estimated cumulative bypass probability (pass rate through k).
        ci_lower: Wilson CI lower bound at 95 percent.
        ci_upper: Wilson CI upper bound at 95 percent.
        n_trials: total number of trials evaluated.
        n_passed_k: number of trials that passed exactly k layers (i.e. survived).
        independence_p_value: p-value of the chi-squared test of layer independence
            (None if k < 2, since independence requires at least two layers).
        correlation_sign: ``positive``, ``negative``, or ``none`` (None if k < 2).
    """

    k: int
    asr_k: float
    ci_lower: float
    ci_upper: float
    n_trials: int
    n_passed_k: int
    independence_p_value: float | None
    correlation_sign: str | None


# ---------------------------------------------------------------------------
# Core estimator
# ---------------------------------------------------------------------------
def estimate_chain_asr(
    payloads: Sequence[str],
    defenses: Sequence[Callable[[str], bool]],
    n_trials_per_payload: int = 30,
) -> Dict[int, ChainASRResult]:
    """Estimate ``Chain-ASR(k)`` for ``k`` in ``1..len(defenses)``.

    For each ``payload`` in ``payloads`` and each trial, the function executes
    the defenses in order and stops at the first ``fail``. It records, per
    trial, how many layers the payload survived. Aggregating over all trials
    yields ``Chain-ASR(k)`` for every ``k``.

    Args:
        payloads: adversarial inputs to evaluate (e.g. 99 AEGIS templates).
        defenses: ordered defense callables, each returning ``True`` if the
            payload PASSES that defense (i.e. is not blocked).
        n_trials_per_payload: number of trials per payload, default 30. With
            stochastic defenses (e.g. LLM judges), > 1 gives a meaningful
            empirical estimate; with deterministic defenses, setting to 1 is
            an efficient option (the function does not assume stochasticity).

    Returns:
        Dictionary mapping ``k`` (1 to ``len(defenses)``) to a ``ChainASRResult``.

    Raises:
        ValueError: if ``payloads`` or ``defenses`` is empty.
    """
    if not payloads:
        raise ValueError("payloads must be non-empty")
    if not defenses:
        raise ValueError("defenses must be non-empty")

    n_layers = len(defenses)
    n_total = len(payloads) * n_trials_per_payload
    # layer_decisions[i] = INDEPENDENT decisions of layer i for every trial.
    # We evaluate ALL layers on EVERY trial so the independence chi-squared test
    # is meaningful. The Chain-ASR(k) statistic itself uses the conjunctive AND.
    layer_decisions: List[List[bool]] = [[] for _ in range(n_layers)]

    for payload in payloads:
        for _ in range(n_trials_per_payload):
            for i, defense in enumerate(defenses):
                layer_decisions[i].append(bool(defense(payload)))

    # passes_through[i] = bool: the trial passed layer 0 AND layer 1 AND ... AND layer i
    passes_through: List[List[bool]] = [list(layer_decisions[0])]
    for i in range(1, n_layers):
        cumulative = [
            prev and curr
            for prev, curr in zip(passes_through[i - 1], layer_decisions[i])
        ]
        passes_through.append(cumulative)

    results: Dict[int, ChainASRResult] = {}
    for k in range(1, n_layers + 1):
        # n_passed_k = number of trials that passed all of layers 0..k-1
        n_passed_k = sum(passes_through[k - 1])
        asr_k = n_passed_k / n_total
        ci_low, ci_high = wilson_interval(n_passed_k, n_total)

        # Independence chi-squared test on first two layers (k >= 2)
        independence_p_value: float | None = None
        correlation_sign: str | None = None
        if k >= 2:
            # Contingency matrix : decisions of layer 0 x layer k-1
            a = sum(
                1 for d0, dk in zip(layer_decisions[0], layer_decisions[k - 1]) if d0 and dk
            )
            b = sum(
                1
                for d0, dk in zip(layer_decisions[0], layer_decisions[k - 1])
                if d0 and not dk
            )
            c = sum(
                1
                for d0, dk in zip(layer_decisions[0], layer_decisions[k - 1])
                if not d0 and dk
            )
            d = sum(
                1
                for d0, dk in zip(layer_decisions[0], layer_decisions[k - 1])
                if not d0 and not dk
            )
            contingency = [[a, b], [c, d]]
            # chi2_contingency requires all rows/cols non-zero (otherwise degenerate)
            if (a + b) > 0 and (c + d) > 0 and (a + c) > 0 and (b + d) > 0:
                try:
                    _, independence_p_value, _, _ = chi2_contingency(contingency)
                except ValueError:
                    independence_p_value = None
            else:
                logger.debug(
                    "Contingency table degenerate for k=%d : chi-2 p-value skipped", k
                )
            # Yule's Q is defined as long as ad + bc > 0 (handles all extreme cases)
            ad = a * d
            bc = b * c
            if ad + bc > 0:
                yules_q = (ad - bc) / (ad + bc)
                if yules_q > 0.1:
                    correlation_sign = "positive"
                elif yules_q < -0.1:
                    correlation_sign = "negative"
                else:
                    correlation_sign = "none"

        results[k] = ChainASRResult(
            k=k,
            asr_k=asr_k,
            ci_lower=ci_low,
            ci_upper=ci_high,
            n_trials=n_total,
            n_passed_k=n_passed_k,
            independence_p_value=independence_p_value,
            correlation_sign=correlation_sign,
        )

    return results


# ---------------------------------------------------------------------------
# Utility for reporting
# ---------------------------------------------------------------------------
def format_chain_asr_table(results: Dict[int, ChainASRResult]) -> str:
    """Format a Chain-ASR results dict as a Markdown table for reports."""
    lines = [
        "| k | Chain-ASR(k) | CI 95% | n_passed | n_trials | Indep p-value | Corr. |",
        "|---|--------------|--------|----------|----------|---------------|-------|",
    ]
    for k in sorted(results):
        r = results[k]
        p_str = "n/a" if r.independence_p_value is None else f"{r.independence_p_value:.3f}"
        corr_str = r.correlation_sign or "n/a"
        lines.append(
            f"| {r.k} | {r.asr_k:.3f} | [{r.ci_lower:.3f}, {r.ci_upper:.3f}] | "
            f"{r.n_passed_k} | {r.n_trials} | {p_str} | {corr_str} |"
        )
    return "\n".join(lines)
