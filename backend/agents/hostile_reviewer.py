"""AEGIS hostile reviewer — Groq backend (one half of the dual-model CCG review).

The Claude half is spawned as a subagent by the aegis-ccg SKILL.md orchestrator
via the Agent tool. This module handles only the Groq reviewer and the synthesis.

CLI usage:
    python backend/agents/hostile_reviewer.py <draft_path>
    → JSON on stdout (Groq-only mode; synthesis requires claude_review from caller)

API usage:
    POST /api/review/hostile   {"draft_content": "...", "claude_review": {...}}
    POST /api/review/synthesize {"claude_review": {...}, "groq_review": {...}}
"""
from __future__ import annotations

import json
import logging
import sys
from pathlib import Path

import httpx

sys.path.insert(0, str(Path(__file__).parent.parent))
from env_loader import load_backend_env  # noqa: E402

load_backend_env()

import os  # noqa: E402 (after env_loader)

log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Reviewer system prompt — 4 axes matching §6.3.5 aegis-research-lab/SKILL.md
# ---------------------------------------------------------------------------
_REVIEWER_SYSTEM = (
    "Tu es un reviewer hostile d'une note de recherche scientifique doctorale "
    "(ENS Paris, Red Team médical LLM AEGIS).\n"
    "Ton rôle : trouver les faiblesses. PAS valider. "
    "Cherche honnêtement — si solide, dis ACCEPT_AS_IS.\n\n"
    "Axes de scoring 0-10 :\n"
    "- novelty     : résultat absent des sessions antérieures ? "
    "Aucun C1-C7/G-XXX ne change d'état → ≤5.\n"
    "- soundness   : chaque assertion empirique porte "
    "[ARTICLE VÉRIFIÉ]/[CALCUL VÉRIFIÉ]/[EXPERIMENTAL] + N + IC ? "
    "Chiffre sans tag = -2.\n"
    "- clarity     : §5/§8/§10 sans 'probablement/semble/pourrait/peut-être' ? "
    "Paramètres exacts en §10 ?\n"
    "- impact      : au moins un C1-C7 ou G-XXX change d'état ce cycle ?\n\n"
    "Règle verdict :\n"
    "  tous ≥8                → ACCEPT_AS_IS\n"
    "  tous ≥6 ET 0 blocking  → PATCH\n"
    "  un <6 OU un blocking   → REVISE\n"
    "  (REJECT réservé à la 2e passe REVISE consécutive — jamais depuis ici)\n\n"
    "Retourne UNIQUEMENT du JSON valide, sans prose :\n"
    "{\n"
    '  "verdict": "ACCEPT_AS_IS|PATCH|REVISE",\n'
    '  "scores": {"novelty": N, "soundness": N, "clarity": N, "impact": N},\n'
    '  "issues": [{"section": "§X", "severity": "minor|major|blocking", '
    '"comment": "..."}],\n'
    '  "must_fix_before_signature": [...],\n'
    '  "can_signal_but_note": [...],\n'
    '  "cited_sessions_verified": [...]\n'
    "}"
)

_GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
_GROQ_MODEL = "llama-3.3-70b-versatile"

# Severity ordering for conservative merge
_SEVERITY: dict[str, int] = {
    "ACCEPT_AS_IS": 0,
    "PATCH": 1,
    "REVISE": 2,
    "REJECT": 3,
}
_SEVERITY_REVERSE: dict[int, str] = {v: k for k, v in _SEVERITY.items()}


# ---------------------------------------------------------------------------
# Groq reviewer
# ---------------------------------------------------------------------------

def review_with_groq(draft_content: str) -> dict:
    """Call llama-3.3-70b-versatile as hostile reviewer. Returns parsed JSON verdict."""
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        return {"error": "GROQ_API_KEY not set", "source": "groq", "verdict": "REVISE",
                "scores": {"novelty": 0, "soundness": 0, "clarity": 0, "impact": 0},
                "issues": [{"section": "N/A", "severity": "blocking",
                             "comment": "GROQ_API_KEY missing — review skipped"}]}

    messages = [
        {"role": "system", "content": _REVIEWER_SYSTEM},
        {"role": "user", "content": "Note à reviewer :\n\n" + draft_content},
    ]

    try:
        with httpx.Client(timeout=120.0) as client:
            resp = client.post(
                _GROQ_API_URL,
                headers={"Authorization": "Bearer " + api_key},
                json={
                    "model": _GROQ_MODEL,
                    "messages": messages,
                    "max_tokens": 2048,
                    "response_format": {"type": "json_object"},
                    "temperature": 0.2,
                },
            )
        resp.raise_for_status()
        raw = resp.json()["choices"][0]["message"]["content"]
        result = json.loads(raw)
        result["source"] = "groq"
        result["model"] = _GROQ_MODEL
        return result
    except httpx.HTTPStatusError as exc:
        log.error("Groq API %s: %s", exc.response.status_code, exc.response.text[:200])
        return {"error": str(exc), "source": "groq", "verdict": "REVISE",
                "scores": {"novelty": 0, "soundness": 0, "clarity": 0, "impact": 0},
                "issues": [{"section": "N/A", "severity": "blocking",
                             "comment": "Groq API error: " + str(exc.response.status_code)}]}
    except Exception as exc:
        log.error("Groq reviewer: %s", exc)
        return {"error": str(exc), "source": "groq", "verdict": "REVISE",
                "scores": {"novelty": 0, "soundness": 0, "clarity": 0, "impact": 0},
                "issues": [{"section": "N/A", "severity": "blocking",
                             "comment": "Groq reviewer exception: " + str(exc)}]}


# ---------------------------------------------------------------------------
# Conservative synthesis (Stackelberg rule)
# ---------------------------------------------------------------------------

def synthesize_reviews(claude_review: dict, groq_review: dict) -> dict:
    """Merge two reviewer JSON dicts using the conservative Stackelberg rule.

    Conservative rules:
    - Verdict: take the more severe of the two
    - Scores: take minimum per axis
    - Issues: union, deduplicated by (section, comment[:40])
    """
    def get_verdict(review: dict) -> str:
        v = review.get("verdict", "REVISE")
        return v if v in _SEVERITY else "REVISE"

    c_v = get_verdict(claude_review)
    g_v = get_verdict(groq_review)
    final_level = max(_SEVERITY.get(c_v, 2), _SEVERITY.get(g_v, 2))
    final_verdict = _SEVERITY_REVERSE[final_level]

    axes = ("novelty", "soundness", "clarity", "impact")

    def safe_score(review: dict, axis: str) -> int:
        if "error" in review:
            return 0
        return int(review.get("scores", {}).get(axis, 5))

    merged_scores = {ax: min(safe_score(claude_review, ax), safe_score(groq_review, ax))
                     for ax in axes}

    seen: set[tuple] = set()
    merged_issues: list[dict] = []
    for issue in (claude_review.get("issues") or []) + (groq_review.get("issues") or []):
        key = (issue.get("section", ""), issue.get("comment", "")[:40])
        if key not in seen:
            seen.add(key)
            merged_issues.append(issue)

    must_fix = list({
        item
        for rv in (claude_review, groq_review)
        for item in (rv.get("must_fix_before_signature") or [])
        if isinstance(item, str)
    })

    can_note = list({
        item
        for rv in (claude_review, groq_review)
        for item in (rv.get("can_signal_but_note") or [])
        if isinstance(item, str)
    })

    return {
        "verdict": final_verdict,
        "scores": merged_scores,
        "issues": merged_issues,
        "must_fix_before_signature": must_fix,
        "can_signal_but_note": can_note,
        "models_used": [
            claude_review.get("model", "claude-sonnet-4-6"),
            groq_review.get("model", _GROQ_MODEL),
        ],
        "claude_verdict": c_v,
        "groq_verdict": g_v,
    }


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def review_draft(draft_path: str, claude_review: dict | None = None) -> dict:
    """Run the Groq reviewer on a draft file, optionally synthesize with claude_review.

    Args:
        draft_path: path to the DRAFT.md file
        claude_review: pre-computed Claude review dict (from Agent subagent), or None
    Returns:
        If claude_review provided: synthesized verdict
        Otherwise: Groq-only verdict with mode="groq_only"
    """
    content = Path(draft_path).read_text(encoding="utf-8")
    groq_r = review_with_groq(content)
    if claude_review is None:
        groq_r["mode"] = "groq_only"
        return groq_r
    return synthesize_reviews(claude_review, groq_r)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stderr)
    if len(sys.argv) < 2:
        print(json.dumps({"error": "usage: hostile_reviewer.py <draft_path>"}))
        sys.exit(1)
    result = review_draft(sys.argv[1])
    print(json.dumps(result, ensure_ascii=False, indent=2))
