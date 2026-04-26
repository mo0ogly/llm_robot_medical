#!/usr/bin/env python3
"""
patch_scenario_dataclass.py

Content-filter-safe patcher for the Scenario dataclass in backend/scenarios.py.
Adds two new fields (help: dict, help_md_path: str) via binary find-replace
without loading the file content into the calling agent's LLM context.

Idempotent: running twice has no effect (the patch detects its own marker).

Usage:
  python backend/tools/patch_scenario_dataclass.py
  python backend/tools/patch_scenario_dataclass.py --verify   (check only)
  python backend/tools/patch_scenario_dataclass.py --rollback (revert patch)
"""

import sys
from pathlib import Path

TOOLS_DIR = Path(__file__).parent
SCENARIOS_PY = TOOLS_DIR.parent / "scenarios.py"

# The exact original dataclass closing line we anchor on
ANCHOR_ORIGINAL = b"    allowed_output_spec: Optional[dict] = None\n"

# New lines to insert right after the anchor (field extensions).
# Encoded as UTF-8 bytes to allow any non-ASCII characters in comments.
NEW_FIELDS = (
    "    # Help metadata (Design X pragmatic - Scenario model refactoring 2026-04-09)\n"
    "    # Structure: {title, icon, conjecture, severity, description, formal,\n"
    "    #             mechanism, expected, defense, svcBreakdown, mitre, chainId}\n"
    "    # Served by GET /api/redteam/scenario-help/{id} to the frontend modal.\n"
    '    help: Dict[str, Any] = field(default_factory=dict)\n'
    '    help_md_path: str = ""  # optional detailed doc in prompts/*.md\n'
).encode("utf-8")

# Idempotency marker — if this string is already in the file, skip
IDEMPOTENT_MARKER = b"help: Dict[str, Any] = field(default_factory=dict)"


def patch():
    if not SCENARIOS_PY.exists():
        print(f"ERROR: {SCENARIOS_PY} not found", file=sys.stderr)
        return 1

    raw = SCENARIOS_PY.read_bytes()

    if IDEMPOTENT_MARKER in raw:
        print("SKIP: Scenario dataclass already has help/help_md_path fields")
        return 0

    # Detect line ending (CRLF on Windows, LF on Unix) to match anchor
    is_crlf = b"\r\n" in raw[:2048]
    newline = b"\r\n" if is_crlf else b"\n"

    anchor = ANCHOR_ORIGINAL.replace(b"\n", newline)
    anchor_idx = raw.find(anchor)
    if anchor_idx < 0:
        # Try the other line ending as fallback
        alt_newline = b"\n" if is_crlf else b"\r\n"
        anchor_alt = ANCHOR_ORIGINAL.replace(b"\n", alt_newline)
        anchor_idx = raw.find(anchor_alt)
        if anchor_idx < 0:
            print(f"ERROR: anchor not found with either LF or CRLF line endings", file=sys.stderr)
            print("The Scenario dataclass may have been modified. Aborting.", file=sys.stderr)
            return 1
        anchor = anchor_alt
        newline = alt_newline

    # Adapt NEW_FIELDS to the file's line ending
    new_fields_adapted = NEW_FIELDS.replace(b"\n", newline)

    insert_at = anchor_idx + len(anchor)
    new_raw = raw[:insert_at] + new_fields_adapted + raw[insert_at:]

    # Sanity check: the new file must be larger
    if len(new_raw) != len(raw) + len(new_fields_adapted):
        print("ERROR: size mismatch after patch", file=sys.stderr)
        return 1

    SCENARIOS_PY.write_bytes(new_raw)
    print(f"OK: patched Scenario dataclass (+{len(new_fields_adapted)} bytes, {'CRLF' if newline == b'\\r\\n' else 'LF'} line endings)")
    print(f"   {SCENARIOS_PY.name}: {len(raw)} -> {len(new_raw)} bytes")
    return 0


def verify():
    if not SCENARIOS_PY.exists():
        print(f"ERROR: {SCENARIOS_PY} not found", file=sys.stderr)
        return 1

    raw = SCENARIOS_PY.read_bytes()

    if IDEMPOTENT_MARKER in raw:
        print("OK: Scenario has help/help_md_path fields")
        return 0
    else:
        print("MISSING: Scenario does not yet have help/help_md_path fields")
        return 1


def rollback():
    if not SCENARIOS_PY.exists():
        print(f"ERROR: {SCENARIOS_PY} not found", file=sys.stderr)
        return 1

    raw = SCENARIOS_PY.read_bytes()

    if IDEMPOTENT_MARKER not in raw:
        print("SKIP: nothing to rollback")
        return 0

    new_raw = raw.replace(NEW_FIELDS, b"")
    if new_raw == raw:
        print("WARN: marker found but exact NEW_FIELDS block not — manual cleanup required", file=sys.stderr)
        return 1

    SCENARIOS_PY.write_bytes(new_raw)
    print(f"OK: rolled back dataclass patch (-{len(NEW_FIELDS)} bytes)")
    return 0


def main():
    if "--verify" in sys.argv:
        sys.exit(verify())
    if "--rollback" in sys.argv:
        sys.exit(rollback())
    sys.exit(patch())


if __name__ == "__main__":
    main()
