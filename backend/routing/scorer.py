"""AEGIS task scorer — assign LOW/HIGH complexity tier from lexical/structural signals.

Ported from oh-my-claudecode src/features/model-routing/scorer.ts (MIT).
Improvement: pure-local scoring, no Bedrock/Vertex branches, integrates
research-director DECOMPOSE complexity tags (TRIVIAL/MODERATE/COMPLEX).

Tier decision:
    LOW   → llama-3.1-8b-instant  (fast responses, simple queries, lookups)
    HIGH  → llama-3.3-70b-versatile (thesis campaigns, analysis, proofs, code)
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from enum import Enum


class Tier(str, Enum):
    LOW = "low"
    HIGH = "high"


# ---------------------------------------------------------------------------
# Lexical signal tables
# ---------------------------------------------------------------------------

_HIGH_KEYWORDS: frozenset[str] = frozenset([
    # Research / analysis
    "analyse", "analyser", "analyzes", "conjecture", "hypothesis", "theorem",
    "proof", "preuve", "formalise", "formaliser", "formalisation",
    "demonstration", "manuscript", "these", "thesis", "chapitre", "chapter",
    # Campaigns / experiments
    "campaign", "campagne", "n=30", "n>=30", "experiment", "experience",
    "benchmark", "evaluation", "asr", "sep(m)", "sepm",
    "baseline", "ablation", "validation",
    # Complex code / multi-step
    "implement", "implementer", "architecture", "orchestrat",
    "refactor", "migration", "pipeline", "multi-agent",
    # Math / proof
    "theorem", "lemma", "proposition", "corollary", "bound", "convergence",
    "gradient", "martingale", "concentration", "variance",
    "probability", "probabilite", "bayesian",
    # Security / red team deep
    "exploit", "payload", "jailbreak", "red team", "redteam", "attack chain",
    "adversarial", "adversaire", "bypass", "evasion",
    # Long-form generation
    "genere", "generate", "write", "redige", "resume", "summarize",
    "rapport", "report", "fiche", "briefing", "synthesis",
])

_LOW_KEYWORDS: frozenset[str] = frozenset([
    # Simple lookups / status
    "list", "liste", "show", "affiche", "status", "statut",
    "count", "compte", "nombre", "how many", "combien",
    "what is", "qu est", "define", "definition",
    "ping", "health", "version", "hello", "bonjour",
    # Simple format
    "yes", "no", "oui", "non", "ok", "ack",
    "correct", "confirm", "confirme",
])

# research-director DECOMPOSE tags (verbatim from skill output)
_TRIVIAL_TAGS = re.compile(r"\b(TRIVIAL|trivial)\b")
_MODERATE_TAGS = re.compile(r"\b(MODERATE|moderate)\b")
_COMPLEX_TAGS = re.compile(r"\b(COMPLEX|complex)\b")

# Structural heuristics
_IS_LONG_TEXT = 300        # chars — long tasks tend to be complex
_IS_CODE_BLOCK = re.compile(r"```|def |class |import |from .* import")
_IS_FORMULA = re.compile(r"[δΔ∑∏∈∉⊂⊃≤≥→⟹λμσ]|\\[a-zA-Z]+\{|Theorem|Lemma")


@dataclass
class ScoringResult:
    tier: Tier
    score: int          # net score: positive → HIGH, negative → LOW
    signals: list[str] = field(default_factory=list)


class TaskScorer:
    """Score a task string or context dict and return a Tier."""

    def score(self, task: str | dict) -> ScoringResult:
        if isinstance(task, dict):
            text = " ".join(str(v) for v in task.values() if isinstance(v, str))
        else:
            text = str(task)

        text_lower = text.lower()
        score = 0
        signals: list[str] = []

        # --- DECOMPOSE tags (highest priority) ---
        if _COMPLEX_TAGS.search(text):
            score += 4
            signals.append("tag:COMPLEX")
        if _MODERATE_TAGS.search(text):
            score += 1
            signals.append("tag:MODERATE")
        if _TRIVIAL_TAGS.search(text):
            score -= 3
            signals.append("tag:TRIVIAL")

        # --- Lexical signals ---
        high_hits = [kw for kw in _HIGH_KEYWORDS if kw in text_lower]
        low_hits = [kw for kw in _LOW_KEYWORDS if kw in text_lower]
        score += len(high_hits)
        score -= len(low_hits)
        if high_hits:
            signals.append("high_kw:" + ",".join(high_hits[:3]))
        if low_hits:
            signals.append("low_kw:" + ",".join(low_hits[:3]))

        # --- Structural signals ---
        if len(text) >= _IS_LONG_TEXT:
            score += 1
            signals.append("long_text")
        if _IS_CODE_BLOCK.search(text):
            score += 1
            signals.append("code_block")
        if _IS_FORMULA.search(text):
            score += 2
            signals.append("formula")

        tier = Tier.HIGH if score > 0 else Tier.LOW
        return ScoringResult(tier=tier, score=score, signals=signals)


def score_task(task: str | dict) -> Tier:
    """Convenience function — return the Tier for a task."""
    return TaskScorer().score(task).tier
