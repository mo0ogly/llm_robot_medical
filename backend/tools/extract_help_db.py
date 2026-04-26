#!/usr/bin/env python3
"""
extract_help_db.py

Content-filter-safe extractor for HELP_DB from ScenarioHelpModal.jsx.

Reads the JSX file in binary mode, locates each scenario entry via a
hand-rolled brace-matching parser, and writes each entry to a separate
file under backend/prompts_help_extracted/. The calling LLM agent never
sees the entries' content — this script runs as a pure Python process.

Purpose:
  - Migrate 48 legacy HELP_DB entries to the new Design-B help system
    (help metadata carried by Scenario model in backend/scenarios.py +
    markdown help files in backend/prompts/*.md).
  - Avoid loading 3616 lines of adversarial descriptions into any LLM
    context (content filter safety).

Output:
  backend/prompts_help_extracted/<scenario_id>.json   — raw JSX block per scenario
  backend/prompts_help_extracted/_index.json          — summary: { scenario_id: { lines, bytes } }
  backend/prompts_help_extracted/_summary.txt         — human-readable report

Usage:
  python backend/tools/extract_help_db.py
  python backend/tools/extract_help_db.py --verify   (re-check without writing)
"""

import json
import re
import sys
from pathlib import Path

TOOLS_DIR = Path(__file__).parent
REPO_ROOT = TOOLS_DIR.parent.parent
JSX_FILE = REPO_ROOT / "frontend" / "src" / "components" / "redteam" / "ScenarioHelpModal.jsx"
OUTPUT_DIR = TOOLS_DIR.parent / "prompts_help_extracted"


def find_help_db_bounds(text: str) -> tuple[int, int]:
    """Locate start and end of the HELP_DB = { ... } object (top-level braces)."""
    start_marker = "const HELP_DB = {"
    start = text.find(start_marker)
    if start < 0:
        raise RuntimeError("HELP_DB not found in JSX file")

    # Brace-matching from the opening {
    open_brace = text.find("{", start)
    if open_brace < 0:
        raise RuntimeError("Opening brace not found after HELP_DB declaration")

    depth = 0
    i = open_brace
    in_string = False
    string_char = ""
    in_line_comment = False
    in_block_comment = False
    escape = False

    while i < len(text):
        c = text[i]

        # Handle escape in strings
        if in_string:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == string_char:
                in_string = False
            i += 1
            continue

        if in_line_comment:
            if c == "\n":
                in_line_comment = False
            i += 1
            continue

        if in_block_comment:
            if c == "*" and i + 1 < len(text) and text[i + 1] == "/":
                in_block_comment = False
                i += 2
                continue
            i += 1
            continue

        # Not in string or comment
        if c == "/" and i + 1 < len(text):
            nxt = text[i + 1]
            if nxt == "/":
                in_line_comment = True
                i += 2
                continue
            if nxt == "*":
                in_block_comment = True
                i += 2
                continue

        if c in ("'", '"', "`"):
            in_string = True
            string_char = c
            i += 1
            continue

        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return open_brace, i + 1

        i += 1

    raise RuntimeError("Could not find closing brace of HELP_DB")


def extract_entries(help_db_body: str) -> list[tuple[str, str]]:
    """Parse the body of HELP_DB and return a list of (scenario_id, raw_entry_text).

    Each entry has the form:
        'scenario_id': {
            ...multiline content with nested braces, strings, concatenations...
        },
    """
    entries = []
    i = 0
    n = len(help_db_body)

    # Entry-start pattern: quoted identifier at start of a logical line, followed by colon
    # Uses the same JSX parser state machine to skip strings/comments.
    in_string = False
    string_char = ""
    in_line_comment = False
    in_block_comment = False
    escape = False

    while i < n:
        c = help_db_body[i]

        # State transitions
        if in_string:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == string_char:
                in_string = False
            i += 1
            continue
        if in_line_comment:
            if c == "\n":
                in_line_comment = False
            i += 1
            continue
        if in_block_comment:
            if c == "*" and i + 1 < n and help_db_body[i + 1] == "/":
                in_block_comment = False
                i += 2
                continue
            i += 1
            continue
        if c == "/" and i + 1 < n:
            nxt = help_db_body[i + 1]
            if nxt == "/":
                in_line_comment = True
                i += 2
                continue
            if nxt == "*":
                in_block_comment = True
                i += 2
                continue

        # Look for: 'scenario_id' : { ... }, or "scenario_id" : { ... },
        # Only match if we are at "top level" of help_db_body
        if c in ("'", '"'):
            # Try to match an entry key
            quote = c
            end_quote = help_db_body.find(quote, i + 1)
            if end_quote < 0:
                in_string = True
                string_char = c
                i += 1
                continue
            key = help_db_body[i + 1:end_quote]
            if re.match(r"^[a-z_][a-z0-9_]*$", key):
                # Check that after the closing quote + optional whitespace we have ":"
                j = end_quote + 1
                while j < n and help_db_body[j] in " \t":
                    j += 1
                if j < n and help_db_body[j] == ":":
                    # Find the opening brace after the colon
                    k = j + 1
                    while k < n and help_db_body[k] in " \t\n":
                        k += 1
                    if k < n and help_db_body[k] == "{":
                        # Brace-match to find end
                        end = _brace_match(help_db_body, k)
                        if end > k:
                            # Find trailing comma if present
                            m = end
                            while m < n and help_db_body[m] in " \t":
                                m += 1
                            if m < n and help_db_body[m] == ",":
                                end = m + 1
                            entry_text = help_db_body[i:end]
                            entries.append((key, entry_text))
                            i = end
                            continue
            # Not an entry key — treat as regular string
            in_string = True
            string_char = c
            i += 1
            continue

        i += 1

    return entries


def _brace_match(text: str, start: int) -> int:
    """Return the position just after the matching closing brace for text[start] == '{'."""
    if text[start] != "{":
        return start
    depth = 0
    i = start
    in_string = False
    string_char = ""
    in_line_comment = False
    in_block_comment = False
    escape = False
    while i < len(text):
        c = text[i]
        if in_string:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == string_char:
                in_string = False
            i += 1
            continue
        if in_line_comment:
            if c == "\n":
                in_line_comment = False
            i += 1
            continue
        if in_block_comment:
            if c == "*" and i + 1 < len(text) and text[i + 1] == "/":
                in_block_comment = False
                i += 2
                continue
            i += 1
            continue
        if c == "/" and i + 1 < len(text):
            nxt = text[i + 1]
            if nxt == "/":
                in_line_comment = True
                i += 2
                continue
            if nxt == "*":
                in_block_comment = True
                i += 2
                continue
        if c in ("'", '"', "`"):
            in_string = True
            string_char = c
            i += 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return -1


def main():
    verify_only = "--verify" in sys.argv

    if not JSX_FILE.exists():
        print(f"ERROR: file not found: {JSX_FILE}", file=sys.stderr)
        sys.exit(1)

    raw = JSX_FILE.read_text(encoding="utf-8")
    total_lines = raw.count("\n") + 1

    start, end = find_help_db_bounds(raw)
    body = raw[start + 1:end - 1]  # strip outer braces
    entries = extract_entries(body)

    print(f"=== HELP_DB extraction ===")
    print(f"Source: {JSX_FILE.relative_to(REPO_ROOT)}")
    print(f"Total lines:       {total_lines}")
    print(f"HELP_DB bounds:    {start}..{end} bytes ({end - start} bytes)")
    print(f"Entries found:     {len(entries)}")

    if not entries:
        print("ERROR: no entries extracted", file=sys.stderr)
        sys.exit(1)

    if verify_only:
        print("[VERIFY ONLY — no files written]")
        for key, text in entries[:5]:
            lines = text.count("\n") + 1
            print(f"  {key}: {len(text)}B, {lines} lines")
        print(f"  ... ({len(entries) - 5} more)")
        return

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Clear old files (if any) so rerun is idempotent
    for f in OUTPUT_DIR.glob("*.json"):
        f.unlink()
    for f in OUTPUT_DIR.glob("*.txt"):
        f.unlink()

    index = {}
    for key, text in entries:
        # Write raw entry text as a .txt (not valid JSON, JSX with concatenation)
        out = OUTPUT_DIR / f"{key}.txt"
        out.write_text(text, encoding="utf-8")
        lines = text.count("\n") + 1
        index[key] = {
            "bytes": len(text),
            "lines": lines,
            "file": f"{key}.txt",
        }

    # Write index
    (OUTPUT_DIR / "_index.json").write_text(
        json.dumps(index, indent=2, sort_keys=True, ensure_ascii=False),
        encoding="utf-8",
    )

    # Human-readable summary
    lines = ["# HELP_DB extraction summary", ""]
    lines.append(f"Source:  {JSX_FILE.relative_to(REPO_ROOT)}")
    lines.append(f"Entries: {len(entries)}")
    lines.append(f"Total bytes: {sum(v['bytes'] for v in index.values())}")
    lines.append("")
    lines.append("| Scenario ID | Lines | Bytes |")
    lines.append("|---|---|---|")
    for key in sorted(index.keys()):
        lines.append(f"| {key} | {index[key]['lines']} | {index[key]['bytes']} |")
    (OUTPUT_DIR / "_summary.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"\nWrote {len(entries)} entries to {OUTPUT_DIR.relative_to(REPO_ROOT)}")
    print(f"Index:   {(OUTPUT_DIR / '_index.json').relative_to(REPO_ROOT)}")
    print(f"Summary: {(OUTPUT_DIR / '_summary.txt').relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
