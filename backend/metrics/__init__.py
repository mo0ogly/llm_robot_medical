"""AEGIS metrics package — composite security metrics for the defense pipeline.

Modules:
    chain_asr: Chain-ASR(k) cumulative probability metric (G-061).
"""
from backend.metrics.chain_asr import (
    ChainASRResult,
    estimate_chain_asr,
    wilson_interval,
)

__all__ = ["ChainASRResult", "estimate_chain_asr", "wilson_interval"]
