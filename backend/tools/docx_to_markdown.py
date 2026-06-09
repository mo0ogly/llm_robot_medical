#!/usr/bin/env python3
"""
AEGIS docx -> markdown helper.

Wraps Microsoft markitdown (github.com/microsoft/markitdown) to turn Word
documents into structured markdown suitable for downstream RAG ingestion
(preserves headings, tables, lists better than raw text extraction).

Optional helper — markitdown is NOT in backend/requirements.txt. Install
on demand with:

    pip install 'markitdown[docx]'

Scope: DOCX only for this POC. Do not use on the academic PDF corpus
(pypdf + the bibliography-maintainer CHUNKER remain authoritative for
papers with LaTeX equations and numbered figures).

Usage (CLI):
    python backend/tools/docx_to_markdown.py <input.docx>
        -> prints markdown to stdout

    python backend/tools/docx_to_markdown.py <input.docx> -o <output.md>
        -> writes to <output.md>

    python backend/tools/docx_to_markdown.py <input.docx> --stats
        -> also prints line/char/heading counts to stderr

Exit codes:
    0 - conversion OK
    1 - conversion error (corrupt file, unsupported variant)
    2 - usage error, file not found, or markitdown not installed

Usable as a Python module:
    from docx_to_markdown import convert_docx_to_markdown
    markdown_text = convert_docx_to_markdown(Path("fiche.docx"))
"""
from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

logger = logging.getLogger(__name__)

MARKITDOWN_INSTALL_HINT = (
    "markitdown is not installed. Install it on demand:\n"
    "    pip install 'markitdown[docx]'"
)


def convert_docx_to_markdown(path: Path) -> str:
    """Convert a .docx file to markdown using Microsoft markitdown.

    Args:
        path: path to the source .docx file.

    Returns:
        The markdown text produced by markitdown.

    Raises:
        FileNotFoundError: if path does not exist.
        ValueError: if path is not a .docx file.
        ImportError: if markitdown is not installed.
        RuntimeError: if markitdown fails to parse the document.
    """
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")
    if path.suffix.lower() != ".docx":
        raise ValueError(f"Expected .docx file, got: {path.suffix}")

    try:
        from markitdown import MarkItDown
    except ImportError as exc:
        raise ImportError(MARKITDOWN_INSTALL_HINT) from exc

    converter = MarkItDown()
    try:
        result = converter.convert(str(path))
    except Exception as exc:
        raise RuntimeError(f"markitdown failed on {path.name}: {exc}") from exc

    return result.text_content


def _stats(markdown_text: str) -> dict[str, int]:
    lines = markdown_text.splitlines()
    headings = sum(1 for line in lines if line.lstrip().startswith("#"))
    return {
        "lines": len(lines),
        "chars": len(markdown_text),
        "headings": headings,
    }


def _cli(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Convert a .docx file to markdown via markitdown."
    )
    parser.add_argument("input", type=Path, help="Path to input .docx file")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output .md path (default: stdout)",
    )
    parser.add_argument(
        "--stats",
        action="store_true",
        help="Print line/char/heading counts to stderr",
    )
    args = parser.parse_args(argv)

    try:
        markdown_text = convert_docx_to_markdown(args.input)
    except ImportError as exc:
        print(str(exc), file=sys.stderr)
        return 2
    except (FileNotFoundError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    except RuntimeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    if args.output is not None:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(markdown_text, encoding="utf-8")
        print(f"wrote {args.output} ({len(markdown_text)} chars)", file=sys.stderr)
    else:
        sys.stdout.write(markdown_text)

    if args.stats:
        stats = _stats(markdown_text)
        print(
            f"stats: {stats['lines']} lines, {stats['chars']} chars, "
            f"{stats['headings']} headings",
            file=sys.stderr,
        )

    return 0


if __name__ == "__main__":
    sys.exit(_cli(sys.argv[1:]))
