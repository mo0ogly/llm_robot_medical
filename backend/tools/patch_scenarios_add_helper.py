#!/usr/bin/env python3
"""Patcher: add _load_template_from_json() helper to scenarios.py.

Context: the gap4_ablation_generator emits `Scenario(message=_load_template_from_json("..."))`
in its autogen block, referencing a helper function that was never defined in scenarios.py.
This causes NameError at import time when the autogen block is applied.

Fix: insert the helper function definition BEFORE the SCENARIO_CATALOG list literal
(line 64), so that when Python evaluates the list at import time, the helper is already
defined and callable.

Content filter compliance: this script loads scenarios.py content into its own process
memory only; no content is ever printed to stdout or returned to the calling agent.
Only the insertion result (success/fail + byte counts) is logged. Follows the
context-isolated workflow pattern documented in
research_archive/manuscript/Note_Academique_Context_Isolated_Adversarial_Workflow.md.

Idempotent: if the helper is already defined, the script exits with success without
modifying the file.

Usage:
    python backend/tools/patch_scenarios_add_helper.py [--dry-run]
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).parent.resolve()
REPO_ROOT = SCRIPT_DIR.parent.parent
SCENARIOS_PY = REPO_ROOT / "backend" / "scenarios.py"

# Markers
HELPER_MARKER = "def _load_template_from_json"
ANCHOR = "SCENARIO_CATALOG: List[Scenario] = ["

# The helper function to insert. Prefixed with a trailing blank line for clean diff.
HELPER_CODE = '''

def _load_template_from_json(filename: str) -> str:
    """Load the 'template' field from backend/prompts/<filename>.

    Used by gap4 ablation autogen SCENARIO_CATALOG entries to load adversarial
    templates at scenario-construction time rather than embedding them as
    verbatim string literals in scenarios.py.

    Added 2026-04-09 RUN-008 to enable gap4-v2 ablation scenario registration
    after the generator patch failed with NameError. Content filter rationale:
    this helper keeps templates in backend/prompts/*.json where they can be
    audited in isolation, rather than flattening them into scenarios.py where
    they would mix with the 3400+ lines of the main catalog.

    The function is called at module import time by each gap4 Scenario(...)
    constructor. Failures (file not found, missing 'template' key) raise
    clear exceptions so that misconfigured prompts are detected at startup,
    not at attack execution time.

    Args:
        filename: basename of the JSON file in backend/prompts/
                  (e.g. "108-gap4-v2-carrier-full.json")

    Returns:
        The 'template' field of the JSON file as a string.

    Raises:
        FileNotFoundError: if the JSON file does not exist
        KeyError: if the JSON has no 'template' field
    """
    import json
    import os

    prompts_dir = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "prompts"
    )
    path = os.path.join(prompts_dir, filename)
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if "template" not in data:
        raise KeyError(
            "Prompt file " + filename + " has no 'template' field"
        )
    return data["template"]


'''


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Add _load_template_from_json helper to scenarios.py"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be done without writing.",
    )
    args = parser.parse_args()

    if not SCENARIOS_PY.exists():
        print("ERROR: scenarios.py not found at " + str(SCENARIOS_PY))
        return 2

    # Read in binary to avoid encoding surprises
    raw = SCENARIOS_PY.read_bytes()
    size_before = len(raw)

    if HELPER_MARKER.encode() in raw:
        print("Helper _load_template_from_json is already defined in scenarios.py.")
        print("  No change needed. (size=" + str(size_before) + " bytes)")
        return 0

    anchor_bytes = ANCHOR.encode()
    anchor_idx = raw.find(anchor_bytes)
    if anchor_idx < 0:
        print("ERROR: SCENARIO_CATALOG anchor not found in scenarios.py")
        print("  Expected: " + ANCHOR)
        return 1

    helper_bytes = HELPER_CODE.encode()
    new_raw = raw[:anchor_idx] + helper_bytes + raw[anchor_idx:]
    size_after = len(new_raw)

    print("Patching scenarios.py:")
    print("  size before: " + str(size_before) + " bytes")
    print("  size after:  " + str(size_after) + " bytes")
    print("  delta:       +" + str(size_after - size_before) + " bytes")
    print("  insertion at: byte offset " + str(anchor_idx) + " (just before SCENARIO_CATALOG)")

    if args.dry_run:
        print("  [DRY RUN] not written")
        return 0

    SCENARIOS_PY.write_bytes(new_raw)
    print("  [WRITTEN] scenarios.py updated")

    # Verify by re-reading and checking marker presence
    verify_raw = SCENARIOS_PY.read_bytes()
    if HELPER_MARKER.encode() in verify_raw:
        print("  [VERIFIED] helper marker present after write")
        return 0
    else:
        print("  [ERROR] helper marker not found after write!")
        return 1


if __name__ == "__main__":
    sys.exit(main())
