"""AEGIS cost tracker — token/cost accumulator per session.

Ported from oh-my-claudecode src/hud/transcript.ts + elements/token-usage.ts (MIT).
Improvement over source: Groq public pricing (no Anthropic OAuth), thread-safe,
JSON snapshot for session persistence across restarts.

Usage:
    from observability import tracker
    tracker.record("llama-3.3-70b-versatile", prompt_tokens=120, completion_tokens=45)
    print(tracker.summary())
"""
from __future__ import annotations

import json
import logging
import threading
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

logger = logging.getLogger("aegis.observability.cost")

# ---------------------------------------------------------------------------
# Groq public pricing (USD per 1M tokens, groq.com/docs/pricing, 2025-06)
# Format: model_id -> (input_price_per_M, output_price_per_M)
# ---------------------------------------------------------------------------
_GROQ_PRICING: dict[str, tuple[float, float]] = {
    "llama-3.3-70b-versatile":   (0.59,  0.79),
    "llama-3.3-70b-specdec":     (0.59,  0.99),
    "llama-3.1-70b-versatile":   (0.59,  0.79),
    "llama-3.1-8b-instant":      (0.05,  0.08),
    "llama-3.2-3b-preview":      (0.06,  0.06),
    "llama-3.2-11b-vision-preview": (0.18, 0.18),
    "llama-3.2-90b-vision-preview": (0.90, 0.90),
    "mixtral-8x7b-32768":        (0.24,  0.24),
    "gemma2-9b-it":              (0.20,  0.20),
    "gemma-7b-it":               (0.07,  0.07),
}
_DEFAULT_PRICE = (0.50, 0.80)  # conservative fallback for unknown models


def _price_for(model: str) -> tuple[float, float]:
    for key, price in _GROQ_PRICING.items():
        if model.startswith(key) or key in model:
            return price
    logger.debug("Unknown model %r — using default pricing", model)
    return _DEFAULT_PRICE


def _cost_usd(model: str, prompt: int, completion: int) -> float:
    inp, out = _price_for(model)
    return (prompt * inp + completion * out) / 1_000_000


@dataclass
class _ModelStats:
    prompt_tokens: int = 0
    completion_tokens: int = 0
    calls: int = 0
    cost_usd: float = 0.0

    def add(self, model: str, prompt: int, completion: int) -> None:
        self.prompt_tokens += prompt
        self.completion_tokens += completion
        self.calls += 1
        self.cost_usd += _cost_usd(model, prompt, completion)

    def to_dict(self) -> dict:
        return {
            "prompt_tokens": self.prompt_tokens,
            "completion_tokens": self.completion_tokens,
            "total_tokens": self.prompt_tokens + self.completion_tokens,
            "calls": self.calls,
            "cost_usd": round(self.cost_usd, 6),
        }


@dataclass
class CostTracker:
    """Thread-safe, in-memory token/cost accumulator with optional JSON snapshot.

    A "session" starts at instantiation (or after reset()) and ends when
    reset() is called. The snapshot_path can persist state across restarts.
    """

    snapshot_path: Optional[Path] = None
    _lock: threading.Lock = field(default_factory=threading.Lock, init=False, repr=False)
    _per_model: dict[str, _ModelStats] = field(default_factory=dict, init=False)
    _total: _ModelStats = field(default_factory=_ModelStats, init=False)

    def __post_init__(self) -> None:
        if self.snapshot_path and self.snapshot_path.exists():
            self._load_snapshot()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def record(self, model: str, prompt_tokens: int, completion_tokens: int) -> None:
        """Record a single LLM call. Thread-safe."""
        with self._lock:
            if model not in self._per_model:
                self._per_model[model] = _ModelStats()
            self._per_model[model].add(model, prompt_tokens, completion_tokens)
            self._total.add(model, prompt_tokens, completion_tokens)
            if self.snapshot_path:
                self._save_snapshot()

    def summary(self) -> dict:
        """Return current session totals + per-model breakdown."""
        with self._lock:
            return {
                "session": {
                    **self._total.to_dict(),
                    "cost_usd_display": f"${self._total.cost_usd:.4f}",
                },
                "by_model": {
                    model: stats.to_dict()
                    for model, stats in self._per_model.items()
                },
                "pricing_source": "groq.com/docs/pricing (2025-06)",
            }

    def reset(self) -> None:
        """Clear all counters (start a new session)."""
        with self._lock:
            self._per_model.clear()
            self._total = _ModelStats()
            if self.snapshot_path and self.snapshot_path.exists():
                self.snapshot_path.unlink(missing_ok=True)

    # ------------------------------------------------------------------
    # Snapshot helpers
    # ------------------------------------------------------------------

    def _save_snapshot(self) -> None:
        try:
            self.snapshot_path.write_text(
                json.dumps(self.summary(), indent=2), encoding="utf-8"
            )
        except OSError as exc:
            logger.warning("Could not write cost snapshot: %s", exc)

    def _load_snapshot(self) -> None:
        try:
            data = json.loads(self.snapshot_path.read_text(encoding="utf-8"))
            for model, stats in data.get("by_model", {}).items():
                ms = _ModelStats()
                ms.prompt_tokens = stats.get("prompt_tokens", 0)
                ms.completion_tokens = stats.get("completion_tokens", 0)
                ms.calls = stats.get("calls", 0)
                ms.cost_usd = stats.get("cost_usd", 0.0)
                self._per_model[model] = ms
                self._total.prompt_tokens += ms.prompt_tokens
                self._total.completion_tokens += ms.completion_tokens
                self._total.calls += ms.calls
                self._total.cost_usd += ms.cost_usd
        except (OSError, json.JSONDecodeError, KeyError) as exc:
            logger.warning("Could not load cost snapshot: %s", exc)


# ---------------------------------------------------------------------------
# Module-level singleton used by the FastAPI app and run_thesis_campaign.py
# ---------------------------------------------------------------------------
_SNAPSHOT = Path(__file__).parent.parent / "data" / "cost_session.json"
_SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)

tracker = CostTracker(snapshot_path=_SNAPSHOT)
