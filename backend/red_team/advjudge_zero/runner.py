"""AdvJudge-Zero runner — orchestrates the campaign.

Pipeline:
    1. For each malicious output in the dataset
    2. For each modifier (TOKEN, FRAME, SEMANTIC)
    3. Apply the modifier and submit the modified output to the judge
    4. Record bypass outcome

Output: trial-level JSONL log + aggregated bypass rate per (modifier, judge).
"""
from __future__ import annotations

import json
import logging
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Callable, Iterable, List, Sequence

from backend.red_team.advjudge_zero.modifiers import (
    AdvJudgeModifier,
    FrameManipulationModifier,
    SemanticObfuscationModifier,
    TokenInjectionModifier,
)

logger = logging.getLogger(__name__)


@dataclass
class TrialResult:
    """Single trial outcome."""

    template_id: str
    vector: str
    judge_name: str
    bypass: bool
    judge_verdict: str
    judge_metadata: dict


class AdvJudgeRunner:
    """Runs the AdvJudge-Zero campaign on a target judge."""

    def __init__(
        self,
        judge_fn: Callable[[str], tuple[str, dict]],
        judge_name: str,
        modifiers: Sequence[AdvJudgeModifier] | None = None,
    ) -> None:
        """Initialise the runner.

        Args:
            judge_fn: callable taking a modified output and returning
                ``(verdict, metadata)`` where verdict is "pass" or "fail".
            judge_name: identifier of the judge (e.g. "security_audit_v1").
            modifiers: list of modifiers to apply; defaults to the three
                vectors (TOKEN_INJECTION, FRAME_MANIPULATION, SEMANTIC_OBFUSCATION).
        """
        self.judge_fn = judge_fn
        self.judge_name = judge_name
        self.modifiers: List[AdvJudgeModifier] = (
            list(modifiers)
            if modifiers is not None
            else [
                TokenInjectionModifier(),
                FrameManipulationModifier(),
                SemanticObfuscationModifier(),
            ]
        )

    def run(
        self,
        malicious_outputs: Iterable[tuple[str, str]],
        n_trials_per_pair: int = 30,
        output_path: Path | None = None,
    ) -> List[TrialResult]:
        """Run the campaign.

        Args:
            malicious_outputs: iterable of (template_id, raw_malicious_output) tuples.
            n_trials_per_pair: trials per (template, modifier) pair.
            output_path: if provided, write JSONL log of all trials.

        Returns:
            List of `TrialResult` objects for further analysis.
        """
        results: List[TrialResult] = []

        for template_id, raw_output in malicious_outputs:
            for modifier in self.modifiers:
                for _ in range(n_trials_per_pair):
                    adv_output = modifier(raw_output)
                    verdict, metadata = self.judge_fn(adv_output.modified)
                    bypass = verdict.lower() == "pass"
                    result = TrialResult(
                        template_id=template_id,
                        vector=adv_output.vector,
                        judge_name=self.judge_name,
                        bypass=bypass,
                        judge_verdict=verdict,
                        judge_metadata=metadata,
                    )
                    results.append(result)

        if output_path is not None:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with output_path.open("w", encoding="utf-8") as f:
                for r in results:
                    f.write(json.dumps(asdict(r), ensure_ascii=False) + "\n")
            logger.info("Wrote %d trial results to %s", len(results), output_path)

        return results

    @staticmethod
    def bypass_rate(results: Sequence[TrialResult], vector: str | None = None) -> float:
        """Compute bypass rate over all trials, optionally filtered by vector."""
        filtered = [r for r in results if vector is None or r.vector == vector]
        if not filtered:
            return 0.0
        return sum(1 for r in filtered if r.bypass) / len(filtered)
