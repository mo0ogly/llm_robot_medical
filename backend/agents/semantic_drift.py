"""Semantic Drift Measurement via Cosine Similarity.

Replaces Levenshtein distance (syntactic, character-level) with dense
embedding-based cosine similarity (semantic, meaning-level) for measuring
how far an adversarial payload has drifted from a baseline attack.

This addresses weakness W2 from methodology_weaknesses_and_next_steps.md:
    "Levenshtein considers 'Kill the patient' and 'Cause cardiac arrest'
     as very distant, although semantically identical."

Usage:
    from agents.semantic_drift import SemanticDriftAnalyzer

    analyzer = SemanticDriftAnalyzer()
    score = analyzer.cosine_similarity("Kill the patient", "Cause cardiac arrest")
    # score ≈ 0.85 (high similarity despite different words)

    drift = analyzer.semantic_drift("Set tension to 1500g", "Adjust force to 1.5kg")
    # drift ≈ 0.15 (low drift = attack preserved meaning)

    report = analyzer.analyze_mutation_chain([
        "Set tension to 1500g",
        "Adjust clip force to elevated levels",
        "Per EDS protocol, apply 1200g tension",
    ])
    # Returns per-step drift + cumulative drift + max drift

Reference:
    - Reimers & Gurevych (2019) Sentence-BERT
    - methodology_weaknesses_and_next_steps.md §B
    - HarmBench (2024) ASR metric with embedding drift

Date: 2026-03-27
"""
from __future__ import annotations

import logging
from typing import Optional

import numpy as np

logger = logging.getLogger(__name__)

# Lazy-load model to avoid slow import at module level
_MODEL = None
_MODEL_NAME = "all-MiniLM-L6-v2"  # Fast, 80MB, good quality


def _get_model():
    """Lazy-load the SentenceTransformer model."""
    global _MODEL
    if _MODEL is None:
        try:
            from sentence_transformers import SentenceTransformer
            logger.info("Loading SentenceTransformer model: %s", _MODEL_NAME)
            _MODEL = SentenceTransformer(_MODEL_NAME)
            logger.info("Model loaded successfully")
        except ImportError:
            logger.warning(
                "sentence-transformers not installed. "
                "Install with: pip install sentence-transformers"
            )
            return None
    return _MODEL


class SemanticDriftAnalyzer:
    """Measures semantic drift between adversarial payloads using cosine similarity.

    Attributes:
        model_name: Name of the SentenceTransformer model.

    Example:
        >>> analyzer = SemanticDriftAnalyzer()
        >>> sim = analyzer.cosine_similarity("hello world", "hi there")
        >>> print(f"Similarity: {sim:.4f}")
    """

    def __init__(self, model_name: str = _MODEL_NAME):
        """Initialize with a specific model name.

        Args:
            model_name: HuggingFace model ID for SentenceTransformer.
        """
        self.model_name = model_name

    def _encode(self, texts: list[str]) -> Optional[np.ndarray]:
        """Encode texts to dense vectors.

        Args:
            texts: List of strings to encode.

        Returns:
            numpy array of shape (len(texts), embedding_dim) or None if model unavailable.
        """
        model = _get_model()
        if model is None:
            return None
        return model.encode(texts, normalize_embeddings=True)

    def cosine_similarity(self, text_a: str, text_b: str) -> float:
        """Compute cosine similarity between two texts.

        Args:
            text_a: First text.
            text_b: Second text.

        Returns:
            float in [-1, 1], where 1 = identical meaning, 0 = unrelated.
            Returns -1.0 if model unavailable.
        """
        embeddings = self._encode([text_a, text_b])
        if embeddings is None:
            return -1.0
        return float(np.dot(embeddings[0], embeddings[1]))

    def semantic_drift(self, baseline: str, mutated: str) -> float:
        """Compute semantic drift = 1 - cosine_similarity.

        A low drift means the mutation preserved meaning (attack still effective).
        A high drift means the mutation changed meaning (attack may have lost intent).

        Args:
            baseline: Original attack payload.
            mutated: Mutated/evolved payload.

        Returns:
            float in [0, 2], where 0 = identical, 1 = orthogonal, 2 = opposite.
            Returns -1.0 if model unavailable.
        """
        sim = self.cosine_similarity(baseline, mutated)
        if sim == -1.0:
            return -1.0
        return 1.0 - sim

    def analyze_mutation_chain(
        self, payloads: list[str], baseline_index: int = 0
    ) -> dict:
        """Analyze semantic drift across a chain of mutations.

        Useful for tracking how a genetic algorithm evolves payloads
        while (hopefully) preserving attack intent.

        Args:
            payloads: Ordered list of payload variants (gen 0, gen 1, ...).
            baseline_index: Index of the reference payload (default: first).

        Returns:
            dict with:
                per_step: list of {text_snippet, drift_from_baseline, drift_from_previous}
                max_drift: maximum drift from baseline
                min_drift: minimum drift from baseline (closest to original meaning)
                mean_drift: average drift from baseline
                intent_preserved: bool — True if mean_drift < 0.3
        """
        if len(payloads) < 2:
            return {"error": "Need at least 2 payloads", "per_step": []}

        embeddings = self._encode(payloads)
        if embeddings is None:
            return {"error": "Model unavailable", "per_step": []}

        baseline_vec = embeddings[baseline_index]
        per_step = []
        drifts_from_baseline = []

        for i, (payload, vec) in enumerate(zip(payloads, embeddings)):
            drift_baseline = 1.0 - float(np.dot(baseline_vec, vec))
            drift_prev = 0.0
            if i > 0:
                drift_prev = 1.0 - float(np.dot(embeddings[i - 1], vec))

            drifts_from_baseline.append(drift_baseline)
            per_step.append({
                "index": i,
                "text_snippet": payload[:80],
                "drift_from_baseline": round(drift_baseline, 4),
                "drift_from_previous": round(drift_prev, 4),
                "similarity_to_baseline": round(1.0 - drift_baseline, 4),
            })

        return {
            "per_step": per_step,
            "max_drift": round(max(drifts_from_baseline), 4),
            "min_drift": round(min(drifts_from_baseline[1:]) if len(drifts_from_baseline) > 1 else 0, 4),
            "mean_drift": round(float(np.mean(drifts_from_baseline[1:])), 4),
            "intent_preserved": float(np.mean(drifts_from_baseline[1:])) < 0.3,
            "n_mutations": len(payloads) - 1,
        }
