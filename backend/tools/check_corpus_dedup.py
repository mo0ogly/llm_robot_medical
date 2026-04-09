#!/usr/bin/env python3
"""
AEGIS corpus anti-doublon check.

Prevents accidental re-integration of papers that are already in
research_archive/doc_references/MANIFEST.md. Created 2026-04-09 after
a scoped bibliography-maintainer run re-verified Crescendo (arXiv:2404.01833)
without noticing it was already P099 in the corpus.

Usage (CLI):
    python backend/tools/check_corpus_dedup.py 2404.01833
        -> [DUPLICATE] arXiv:2404.01833 already in corpus as P099

    python backend/tools/check_corpus_dedup.py 2302.05733 2402.01030 2408.04682
        -> [NEW] 2302.05733 ...
        -> [NEW] 2402.01030 ...
        -> [NEW] 2408.04682 ...

    python backend/tools/check_corpus_dedup.py --title "Crescendo Multi-Turn"
        -> [DUPLICATE] "Crescendo Multi-Turn" already in corpus as P099

Exit codes:
    0 - all refs are NEW (safe to add to corpus)
    1 - at least one ref is a DUPLICATE (do not re-add)
    2 - usage error or MANIFEST not found

Usable as a Python module:
    from check_corpus_dedup import check_arxiv_id, check_title
    result = check_arxiv_id("2404.01833")
    # {"status": "DUPLICATE", "p_id": "P099", "arxiv_id": "2404.01833", "row": "..."}

Called by (recommended integration points):
    - bibliography-maintainer COLLECTOR agent (Step 0 before WebSearch)
    - Any scoped verification sub-agent (Step 0 before WebFetch)
    - Manual P-ID creation workflow
    - Pre-commit hook on research_archive/doc_references/ writes
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# Force UTF-8 stdout/stderr so MANIFEST rows containing δ⁰/δ¹/δ²/δ³ Unicode
# characters print correctly on Windows (default cp1252 cannot encode them).
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    # Python < 3.7 or non-standard streams — fall back silently; _print_result
    # will ASCII-sanitize as a second line of defense.
    pass

# Manifest is at research_archive/doc_references/MANIFEST.md relative to repo root.
# This script lives at backend/tools/, so repo root is parents[2].
REPO_ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = REPO_ROOT / "research_archive" / "doc_references" / "MANIFEST.md"


def _extract_p_id(line: str) -> str:
    """Extract the P-ID from a MANIFEST row. Returns 'P???' if not found."""
    match = re.search(r"\|\s*(P\d+)\s*\|", line)
    return match.group(1) if match else "P???"


def check_arxiv_id(arxiv_id: str) -> dict:
    """Check whether an arXiv ID already exists in MANIFEST.md.

    Args:
        arxiv_id: arXiv identifier like "2404.01833" (no "arXiv:" prefix).

    Returns:
        dict with keys:
            status: "NEW" | "DUPLICATE" | "ERROR"
            arxiv_id: the input ID
            p_id: (only if DUPLICATE) the existing corpus P-ID
            row: (only if DUPLICATE) the verbatim MANIFEST row
            reason: (only if ERROR) what went wrong
    """
    if not MANIFEST_PATH.exists():
        return {
            "status": "ERROR",
            "arxiv_id": arxiv_id,
            "reason": f"MANIFEST.md not found at {MANIFEST_PATH}",
        }

    # Pattern matches "arXiv:2404.01833" (with boundary on both sides)
    # case-insensitive, escapes any regex-special chars in the ID itself
    pattern = re.compile(rf"\barXiv:\s*{re.escape(arxiv_id)}\b", re.IGNORECASE)

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if pattern.search(line):
                return {
                    "status": "DUPLICATE",
                    "arxiv_id": arxiv_id,
                    "p_id": _extract_p_id(line),
                    "row": line.strip(),
                }

    return {"status": "NEW", "arxiv_id": arxiv_id}


def check_title(title_needle: str, min_length: int = 12) -> dict:
    """Check whether a title substring appears in any MANIFEST row.

    Substring match (case-insensitive). Use a distinctive, specific needle
    (>= 12 chars recommended) to avoid false positives on common words.

    Args:
        title_needle: substring of the paper title, e.g. "Crescendo Multi-Turn".
        min_length: minimum needle length to accept (default 12). Short needles
            are rejected to prevent common-word false positives.

    Returns:
        dict with keys:
            status: "NEW" | "DUPLICATE" | "ERROR"
            title_needle: the input
            p_id: (only if DUPLICATE) the existing corpus P-ID
            row: (only if DUPLICATE) the verbatim MANIFEST row
    """
    if len(title_needle.strip()) < min_length:
        return {
            "status": "ERROR",
            "title_needle": title_needle,
            "reason": f"Needle too short (< {min_length} chars). Use a more specific substring.",
        }

    if not MANIFEST_PATH.exists():
        return {
            "status": "ERROR",
            "title_needle": title_needle,
            "reason": f"MANIFEST.md not found at {MANIFEST_PATH}",
        }

    needle = title_needle.lower().strip()

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if needle in line.lower():
                return {
                    "status": "DUPLICATE",
                    "title_needle": title_needle,
                    "p_id": _extract_p_id(line),
                    "row": line.strip(),
                }

    return {"status": "NEW", "title_needle": title_needle}


def _print_result(result: dict) -> None:
    """Pretty-print a single check result to stdout."""
    status = result["status"]
    identifier = result.get("arxiv_id") or result.get("title_needle", "?")

    if status == "DUPLICATE":
        print(f"[DUPLICATE] {identifier} already in corpus as {result['p_id']}")
        row_preview = result["row"][:180]
        if len(result["row"]) > 180:
            row_preview += "..."
        print(f"            row: {row_preview}")
    elif status == "NEW":
        print(f"[NEW]       {identifier} -- safe to add to corpus")
    elif status == "ERROR":
        print(f"[ERROR]     {identifier}: {result.get('reason', 'unknown error')}")
    else:
        print(f"[???]       {identifier}: unexpected status {status!r}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="AEGIS corpus anti-doublon check -- grep MANIFEST.md for existing P-IDs",
        epilog="Called by bibliography-maintainer Step 0 and scoped verification agents.",
    )
    parser.add_argument(
        "arxiv_ids",
        nargs="*",
        help="arXiv IDs to check (e.g. 2404.01833). Multiple IDs checked in parallel.",
    )
    parser.add_argument(
        "--title",
        help="Title substring to check instead of / in addition to arXiv IDs (>= 12 chars).",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Suppress per-result output; only return exit code.",
    )
    args = parser.parse_args()

    if not args.arxiv_ids and not args.title:
        parser.print_help()
        return 2

    any_duplicate = False
    any_error = False

    if args.title:
        result = check_title(args.title)
        if not args.quiet:
            _print_result(result)
        if result["status"] == "DUPLICATE":
            any_duplicate = True
        elif result["status"] == "ERROR":
            any_error = True

    for aid in args.arxiv_ids:
        result = check_arxiv_id(aid)
        if not args.quiet:
            _print_result(result)
        if result["status"] == "DUPLICATE":
            any_duplicate = True
        elif result["status"] == "ERROR":
            any_error = True

    if any_error:
        return 2
    if any_duplicate:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
