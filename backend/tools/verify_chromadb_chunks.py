#!/usr/bin/env python3
"""Verify that each given paper P-ID has at least N chunks in a ChromaDB collection.

Referenced by the bibliography-maintainer completion protocol (Phase 7) to confirm
that a newly ingested paper is actually retrievable in the RAG. Chunks carry a
`paper_id` metadata field (e.g. "P136"); this tool counts them per P-ID against a
minimum threshold.

Run locally where ChromaDB and the persistent store are available (the store is a
PersistentClient at backend/chroma_db).

Usage:
    python backend/tools/verify_chromadb_chunks.py --p-ids P136 P137 P138 [--min 5]
    python backend/tools/verify_chromadb_chunks.py --p-ids P136 --collection aegis_bibliography

Exit codes:
    0 - every P-ID has >= --min chunks
    1 - at least one P-ID is below threshold
    2 - usage / environment error (chromadb missing, store not found, collection absent)
"""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger("verify_chromadb_chunks")

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_CHROMA_PATH = PROJECT_ROOT / "backend" / "chroma_db"
DEFAULT_COLLECTION = "aegis_bibliography"


def count_chunks(collection, paper_id: str) -> int:
    """Count chunks whose metadata paper_id matches; fall back to chunk_id prefix."""
    try:
        res = collection.get(where={"paper_id": paper_id}, include=["metadatas"])
        n = len(res.get("ids", []))
        if n:
            return n
    except Exception as exc:  # noqa: BLE001 - report and fall back
        logger.debug("where-query failed for %s: %s", paper_id, exc)

    # Fallback: chunk_id convention embeds the P-ID (e.g. "ANALYST_P136_resume_01").
    all_ids = collection.get(include=[]).get("ids", [])
    return sum(1 for cid in all_ids if paper_id in cid)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--p-ids", nargs="+", required=True, help="P-IDs to verify, e.g. P136 P137")
    parser.add_argument("--min", type=int, default=5, help="Minimum chunks required per P-ID")
    parser.add_argument("--collection", default=DEFAULT_COLLECTION)
    parser.add_argument("--chroma-path", type=Path, default=DEFAULT_CHROMA_PATH)
    args = parser.parse_args()

    try:
        import chromadb
    except ImportError:
        logger.error("chromadb is not installed in this environment. Run locally with the stack.")
        return 2

    if not args.chroma_path.exists():
        logger.error("ChromaDB store not found: %s", args.chroma_path)
        return 2

    client = chromadb.PersistentClient(path=str(args.chroma_path))
    try:
        collection = client.get_collection(args.collection)
    except Exception:  # noqa: BLE001 - collection may not exist yet
        logger.error("Collection '%s' not found in %s", args.collection, args.chroma_path)
        return 2

    all_ok = True
    for pid in args.p_ids:
        n = count_chunks(collection, pid)
        status = "OK" if n >= args.min else "FAIL"
        if n < args.min:
            all_ok = False
        logger.info("%-6s %s (%d chunks, min %d)", pid, status, n, args.min)

    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
