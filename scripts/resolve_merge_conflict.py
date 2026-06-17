#!/usr/bin/env python3
"""Resolve committed Git merge-conflict markers in a file by keeping one side.

A conflict block looks like:

    <<<<<<< ours-label
    ...ours lines...
    =======
    ...theirs lines...
    >>>>>>> theirs-label

`--keep ours` keeps the lines between `<<<<<<<` and `=======`; `--keep theirs`
keeps the lines between `=======` and `>>>>>>>`. The three marker lines are
always removed. `--check` reports the block count without writing.

The resolver works purely line-by-line and never prints file content, so it is
safe to run on content-filtered files (e.g. attack_catalog.py): a side is chosen
structurally without ever surfacing the payload text. Pair it with `--output`
to materialise a resolved variant elsewhere (e.g. to compare both sides) without
touching the original.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

START = "<<<<<<<"
SEP = "======="
END = ">>>>>>>"


def resolve(lines: list, keep: str) -> tuple:
    """Return (resolved_lines, block_count, final_state)."""
    out: list = []
    state = "normal"  # normal | ours | theirs
    blocks = 0
    for line in lines:
        stripped = line.rstrip("\n")
        if stripped.startswith(START) and state == "normal":
            state = "ours"
            blocks += 1
            continue
        if stripped == SEP and state == "ours":
            state = "theirs"
            continue
        if stripped.startswith(END) and state == "theirs":
            state = "normal"
            continue
        if state == "normal":
            out.append(line)
        elif state == "ours" and keep == "ours":
            out.append(line)
        elif state == "theirs" and keep == "theirs":
            out.append(line)
    return out, blocks, state


def main() -> None:
    parser = argparse.ArgumentParser(description="Resolve committed merge-conflict markers, keeping one side.")
    parser.add_argument("file")
    parser.add_argument("--keep", choices=["ours", "theirs"], default="ours")
    parser.add_argument("--check", action="store_true", help="report conflict block count, do not write")
    parser.add_argument("--output", default=None, help="write result here instead of in place")
    args = parser.parse_args()

    path = Path(args.file)
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    out, blocks, state = resolve(lines, args.keep)

    if state != "normal":
        print("ERROR: unterminated conflict block (state=" + state + ") in " + path.name)
        sys.exit(2)

    if args.check:
        print("conflict blocks in " + path.name + ": " + str(blocks))
        sys.exit(0 if blocks == 0 else 1)

    if blocks == 0:
        print("no conflict markers in " + path.name + " (nothing to do)")
        return

    dest = Path(args.output) if args.output else path
    dest.write_text("".join(out), encoding="utf-8")
    print("resolved " + str(blocks) + " block(s) in " + path.name + " (kept: " + args.keep + ") -> " + dest.name)


if __name__ == "__main__":
    main()
