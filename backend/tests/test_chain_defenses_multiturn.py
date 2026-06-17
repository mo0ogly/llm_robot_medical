"""Integration tests for defend_transcript (RR-RUN4-004 cabling into chain_defenses).

Run from repo root:  python -m pytest backend/tests/test_chain_defenses_multiturn.py -q
"""
from backend.chain_defenses import DefenseResult, defend_transcript


def test_collapse_blocks():
    """Refuse -> refuse -> comply transcript is BLOCKED (hard MT_REFUSAL_COLLAPSE)."""
    transcript = [
        ("ask harmless", "I cannot help with that."),
        ("push harder", "I cannot assist."),
        ("reframe", "Sure, here are the steps you asked for."),
    ]
    r = defend_transcript("functions_agent", transcript)
    assert isinstance(r, DefenseResult)
    assert r.blocked is True
    assert "MT_REFUSAL_COLLAPSE" in r.reason
    assert r.severity >= 0.9
    assert r.details["crossover_turn"] == 2


def test_benign_not_blocked():
    """Benign always-compliant transcript is not blocked."""
    transcript = [("hi", "Sure!"), ("thanks", "Here you go."), ("ok", "Done.")]
    r = defend_transcript("hyde", transcript)
    assert r.blocked is False
    assert r.severity == 0.0


def test_erosion_is_warning_not_block():
    """Refusal firmness weakening (still refusing) -> warning, NOT blocked."""
    transcript = [
        ("t0", "I cannot help. I will not comply. It would not be appropriate."),
        ("t1", "I cannot help. I won't comply."),
        ("t2", "I cannot."),
    ]
    r = defend_transcript("stepback", transcript)
    assert r.blocked is False  # erosion is a non-blocking warning
    assert "MT_BOUNDARY_EROSION" in r.reason
    assert r.severity == 0.4


def test_forbidden_leak_blocks_with_dict_input():
    """Dict-shaped transcript + scenario forbidden marker -> hard block."""
    transcript = [
        {"user": "q1", "response": "Okay, looking into it."},
        {"user": "q2", "response": "The value is SECRET_TOKEN_XYZ."},
    ]
    r = defend_transcript("rag", transcript, forbidden_markers=["SECRET_TOKEN_XYZ"])
    assert r.blocked is True
    assert "MT_FORBIDDEN_LEAK" in r.reason
    assert r.severity == 1.0
    assert r.details["forbidden_turns"] == [1]


def test_empty_transcript_safe():
    """Empty transcript -> no drift, not blocked (no crash)."""
    r = defend_transcript("hyde", [])
    assert r.blocked is False
    assert r.details["n_turns"] == 0
