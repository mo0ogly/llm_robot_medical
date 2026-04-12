#!/usr/bin/env python3
"""
AEGIS corpus anti-doublon check.

Prevents accidental re-integration of papers that are already in
research_archive/doc_references/MANIFEST.md. Created 2026-04-09 after
a scoped bibliography-maintainer run re-verified Crescendo (arXiv:2404.01833)
without noticing it was already P099 in the corpus.

Also prevents discovery-ID collisions (D-XXX) against DISCOVERIES_INDEX.md.
Created 2026-04-10 after ANALYST sub-agent proposed D-021/22/23 without reading
DISCOVERIES_INDEX.md — same bug class as Crescendo. Renaming to D-026/27/28 was
needed post-hoc. get_next_discovery_id() is the canonical source-of-truth.

Usage (CLI):
    python backend/tools/check_corpus_dedup.py 2404.01833
        -> [DUPLICATE] arXiv:2404.01833 already in corpus as P099

    python backend/tools/check_corpus_dedup.py 2302.05733 2402.01030 2408.04682
        -> [NEW] 2302.05733 ...
        -> [NEW] 2402.01030 ...
        -> [NEW] 2408.04682 ...

    python backend/tools/check_corpus_dedup.py --title "Crescendo Multi-Turn"
        -> [DUPLICATE] "Crescendo Multi-Turn" already in corpus as P099

    python backend/tools/check_corpus_dedup.py --discovery D-021
        -> [DUPLICATE] D-021 already in DISCOVERIES_INDEX.md

    python backend/tools/check_corpus_dedup.py --next-discovery
        -> [NEXT-D] Next free discovery ID: D-029

Exit codes:
    0 - all refs are NEW (safe to add to corpus)
    1 - at least one ref is a DUPLICATE (do not re-add)
    2 - usage error or MANIFEST / DISCOVERIES_INDEX not found

Usable as a Python module:
    from check_corpus_dedup import check_arxiv_id, check_title
    result = check_arxiv_id("2404.01833")
    # {"status": "DUPLICATE", "p_id": "P099", "arxiv_id": "2404.01833", "row": "..."}

    from check_corpus_dedup import check_discovery_id, get_next_discovery_id
    result = check_discovery_id("D-021")
    # {"status": "DUPLICATE", "d_id": "D-021"}
    next_id = get_next_discovery_id()
    # "D-029"

Called by (recommended integration points):
    - bibliography-maintainer COLLECTOR agent (Step 0 before WebSearch)
    - Any scoped verification sub-agent (Step 0 before WebFetch)
    - ANALYST sub-agent (Step 0 before proposing any new D-ID)
    - Manual P-ID / D-ID creation workflow
    - Pre-commit hook on research_archive/ writes
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
DISCOVERIES_INDEX_PATH = REPO_ROOT / "research_archive" / "discoveries" / "DISCOVERIES_INDEX.md"

# Pattern for discovery IDs: D-001 … D-999
_D_ID_RE = re.compile(r"\|\s*(D-(\d{3}))\s*\|")


def _extract_p_id(line: str) -> str:
    """Extract the P-ID from a MANIFEST row or note line.

    Tries 3 patterns in order :
    1. Table cell : "| P084 |" (standard MANIFEST row)
    2. Bold inline : "**P084**" (used in collision notes / bullets)
    3. Bare token : "P084 existant" or "P084_filename" (collision notes / fiches)

    Returns 'P???' if no match.
    """
    # Pattern 1 : table cell
    match = re.search(r"\|\s*(P\d{2,4})\s*\|", line)
    if match:
        return match.group(1)
    # Pattern 2 : bold inline
    match = re.search(r"\*\*(P\d{2,4})\*\*", line)
    if match:
        return match.group(1)
    # Pattern 3 : bare token (followed by space, underscore, or end)
    match = re.search(r"\b(P\d{2,4})(?:[_ ]|\b)", line)
    if match:
        return match.group(1)
    return "P???"


def check_arxiv_id(arxiv_id: str) -> dict:
    """Check whether an arXiv ID already exists in the AEGIS corpus.

    Two-pass strategy (PDCA fix 2026-04-12 after 2nd regression LlamaFirewall):

    PASS 1 — MANIFEST.md row scan
        Search for "arXiv:XXXX.XXXXX" in any MANIFEST line. Robust against
        version suffixes (v1, v2, v3) by using a non-strict trailing boundary.

    PASS 2 — Fiche body scan (NEW)
        If PASS 1 returns NEW, recursively grep all PXXX_*.md files under
        research_archive/doc_references/{year}/{category}/ for the arXiv ID.
        This catches papers whose MANIFEST row stores a friendly venue name
        (e.g. "Meta PurpleLlama") instead of the arXiv ID, while the fiche
        body contains "arXiv:2505.03574" verbatim.

        Regression history:
        - 2026-04-09: Crescendo (arXiv:2404.01833 = P099) re-verified by
          scoped sub-agent. Fixed by introducing this tool.
        - 2026-04-11: LlamaFirewall (arXiv:2505.03574 = P084) reported NEW
          because P084's MANIFEST row had venue "Meta PurpleLlama" with no
          arXiv ID in the venue column. The arXiv ID was only in the fiche
          body. Fixed by adding PASS 2 here.

    Args:
        arxiv_id: arXiv identifier like "2404.01833" (no "arXiv:" prefix).
            Version suffixes (v1, v2, v3) are stripped before matching.

    Returns:
        dict with keys:
            status: "NEW" | "DUPLICATE" | "ERROR"
            arxiv_id: the input ID
            p_id: (only if DUPLICATE) the existing corpus P-ID
            row: (only if DUPLICATE) MANIFEST row OR fiche path + matching line
            source: "manifest" | "fiche_body" (only if DUPLICATE) — which pass caught it
            reason: (only if ERROR) what went wrong
    """
    if not MANIFEST_PATH.exists():
        return {
            "status": "ERROR",
            "arxiv_id": arxiv_id,
            "reason": f"MANIFEST.md not found at {MANIFEST_PATH}",
        }

    # Strip any vN suffix from the input — match the bare numeric ID
    bare_id = re.sub(r"v\d+$", "", arxiv_id.strip())
    # Pattern matches "arXiv:NNNN.NNNNN" with optional vN suffix in the corpus
    # Use non-word boundary on the right so v1/v2/v3 still match
    pattern = re.compile(rf"\barXiv:\s*{re.escape(bare_id)}(?:v\d+)?\b", re.IGNORECASE)

    # PASS 1 — MANIFEST row scan
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if pattern.search(line):
                return {
                    "status": "DUPLICATE",
                    "arxiv_id": arxiv_id,
                    "p_id": _extract_p_id(line),
                    "row": line.strip(),
                    "source": "manifest",
                }

    # PASS 2 — Fiche body scan (catches MANIFEST rows that omit arXiv ID)
    doc_refs_root = REPO_ROOT / "research_archive" / "doc_references"
    if doc_refs_root.exists():
        # Recursively scan all PXXX_*.md files
        for fiche_path in doc_refs_root.rglob("P[0-9]*.md"):
            try:
                content = fiche_path.read_text(encoding="utf-8", errors="replace")
            except Exception:
                continue
            if pattern.search(content):
                # Extract P-ID from filename (e.g. P084_Chennabasappa_2025_LlamaFirewall.md)
                fname = fiche_path.name
                p_id_match = re.match(r"^(P\d+)_", fname)
                p_id = p_id_match.group(1) if p_id_match else "P???"
                # Find the matching line for context
                matching_line = ""
                for line in content.splitlines():
                    if pattern.search(line):
                        matching_line = line.strip()[:200]
                        break
                rel_path = fiche_path.relative_to(REPO_ROOT).as_posix()
                return {
                    "status": "DUPLICATE",
                    "arxiv_id": arxiv_id,
                    "p_id": p_id,
                    "row": f"{rel_path}: {matching_line}",
                    "source": "fiche_body",
                }

    return {"status": "NEW", "arxiv_id": arxiv_id}


def check_title(title_needle: str, min_length: int = 12) -> dict:
    """Check whether a title substring appears in MANIFEST OR fiche bodies.

    Two-pass strategy (PDCA fix 2026-04-12) :
    PASS 1 — MANIFEST row scan (legacy)
    PASS 2 — Fiche body scan (NEW) — catches papers whose MANIFEST row uses
             a different titling than the fiche body.

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
            row: (only if DUPLICATE) MANIFEST row OR fiche path + matching line
            source: "manifest" | "fiche_body" (only if DUPLICATE)
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

    # PASS 1 — MANIFEST row scan
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if needle in line.lower():
                return {
                    "status": "DUPLICATE",
                    "title_needle": title_needle,
                    "p_id": _extract_p_id(line),
                    "row": line.strip(),
                    "source": "manifest",
                }

    # PASS 2 — Fiche body scan
    doc_refs_root = REPO_ROOT / "research_archive" / "doc_references"
    if doc_refs_root.exists():
        for fiche_path in doc_refs_root.rglob("P[0-9]*.md"):
            try:
                content = fiche_path.read_text(encoding="utf-8", errors="replace")
            except Exception:
                continue
            if needle in content.lower():
                fname = fiche_path.name
                p_id_match = re.match(r"^(P\d+)_", fname)
                p_id = p_id_match.group(1) if p_id_match else "P???"
                # Find the matching line for context
                matching_line = ""
                for line in content.splitlines():
                    if needle in line.lower():
                        matching_line = line.strip()[:200]
                        break
                rel_path = fiche_path.relative_to(REPO_ROOT).as_posix()
                return {
                    "status": "DUPLICATE",
                    "title_needle": title_needle,
                    "p_id": p_id,
                    "row": f"{rel_path}: {matching_line}",
                    "source": "fiche_body",
                }

    return {"status": "NEW", "title_needle": title_needle}


def _existing_discovery_ids() -> set[str]:
    """Return the set of all D-IDs already present in DISCOVERIES_INDEX.md.

    Scans every table row that starts with ``| D-NNN |`` (the canonical format
    used in all discovery tables). Returns an empty set if the file is missing
    so callers can distinguish "file absent" from "no IDs found".
    """
    if not DISCOVERIES_INDEX_PATH.exists():
        return set()
    ids: set[str] = set()
    with open(DISCOVERIES_INDEX_PATH, "r", encoding="utf-8") as f:
        for line in f:
            m = _D_ID_RE.search(line)
            if m:
                ids.add(m.group(1))  # e.g. "D-021"
    return ids


def check_discovery_id(d_id: str) -> dict:
    """Check whether a discovery ID (e.g. 'D-021') already exists.

    Args:
        d_id: Discovery identifier like ``D-021`` (case-insensitive, with or
            without leading zeros).

    Returns:
        dict with keys:
            status: "NEW" | "DUPLICATE" | "ERROR"
            d_id: normalised input (e.g. "D-021")
            reason: (only if ERROR) what went wrong
    """
    # Normalise to D-NNN (3 digits, upper-case)
    d_id = d_id.strip().upper()
    if not re.fullmatch(r"D-\d{3}", d_id):
        return {
            "status": "ERROR",
            "d_id": d_id,
            "reason": f"Invalid D-ID format: expected D-NNN (e.g. D-021), got {d_id!r}",
        }

    if not DISCOVERIES_INDEX_PATH.exists():
        return {
            "status": "ERROR",
            "d_id": d_id,
            "reason": f"DISCOVERIES_INDEX.md not found at {DISCOVERIES_INDEX_PATH}",
        }

    existing = _existing_discovery_ids()
    if d_id in existing:
        return {"status": "DUPLICATE", "d_id": d_id}
    return {"status": "NEW", "d_id": d_id}


def get_next_discovery_id() -> str:
    """Return the next free discovery ID as a string (e.g. ``'D-029'``).

    Reads DISCOVERIES_INDEX.md, collects all D-NNN IDs, and returns
    max(N) + 1 zero-padded to 3 digits. Falls back to ``D-001`` if the file
    is absent or contains no IDs.
    """
    existing = _existing_discovery_ids()
    if not existing:
        return "D-001"
    max_n = max(int(d.split("-")[1]) for d in existing)
    return f"D-{max_n + 1:03d}"


def _print_result(result: dict) -> None:
    """Pretty-print a single check result to stdout."""
    status = result["status"]
    identifier = result.get("arxiv_id") or result.get("title_needle") or result.get("d_id", "?")

    if status == "DUPLICATE":
        if "p_id" in result:
            # arXiv / title duplicate
            print(f"[DUPLICATE] {identifier} already in corpus as {result['p_id']}")
            row_preview = result["row"][:180]
            if len(result["row"]) > 180:
                row_preview += "..."
            print(f"            row: {row_preview}")
        else:
            # Discovery-ID duplicate
            print(f"[DUPLICATE] {identifier} already in DISCOVERIES_INDEX.md — use get_next_discovery_id()")
    elif status == "NEW":
        if "d_id" in result:
            print(f"[NEW]       {identifier} -- safe to use as discovery ID")
        else:
            print(f"[NEW]       {identifier} -- safe to add to corpus")
    elif status == "ERROR":
        print(f"[ERROR]     {identifier}: {result.get('reason', 'unknown error')}")
    else:
        print(f"[???]       {identifier}: unexpected status {status!r}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "AEGIS corpus anti-doublon check -- grep MANIFEST.md for existing P-IDs "
            "and DISCOVERIES_INDEX.md for existing D-IDs."
        ),
        epilog=(
            "Called by bibliography-maintainer Step 0, scoped verification agents, "
            "and ANALYST sub-agent before proposing any new D-ID."
        ),
    )
    parser.add_argument(
        "arxiv_ids",
        nargs="*",
        help="arXiv IDs to check (e.g. 2404.01833). Multiple IDs accepted.",
    )
    parser.add_argument(
        "--title",
        help="Title substring to check instead of / in addition to arXiv IDs (>= 12 chars).",
    )
    parser.add_argument(
        "--discovery",
        metavar="D_ID",
        action="append",
        default=[],
        help="Discovery ID to check (e.g. D-021). Repeatable.",
    )
    parser.add_argument(
        "--next-discovery",
        action="store_true",
        help="Print the next free discovery ID and exit 0.",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Suppress per-result output; only return exit code.",
    )
    args = parser.parse_args()

    # --next-discovery is a standalone query; always succeeds
    if args.next_discovery:
        next_id = get_next_discovery_id()
        if not args.quiet:
            print(f"[NEXT-D]    Next free discovery ID: {next_id}")
        return 0

    if not args.arxiv_ids and not args.title and not args.discovery:
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

    for d_id in args.discovery:
        result = check_discovery_id(d_id)
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
