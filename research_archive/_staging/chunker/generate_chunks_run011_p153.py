#!/usr/bin/env python3
"""
AEGIS RAG Chunker -- RUN-011 (INCREMENTAL, single paper)

Processes the 1 new analysis from RR-RUN10-002 (Eiras judge integration):
- P153 Eiras et al. 2025 (Know Thy Judge -- safety judge robustness, ICBINB @ ICLR 2025)

Fiche read directly from doc_references/2025/benchmarks/.
Reuses chunk_analysis_file() + load_existing_ids() from generate_chunks_run005.py.
Appends new chunks to chunks_for_rag.jsonl with run_id="RUN-011". Dedup-safe.
"""
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent  # poc_medical/
DOC_REF = PROJECT_ROOT / "research_archive" / "doc_references"
CHUNKS_FILE = SCRIPT_DIR / "chunks_for_rag.jsonl"

RUN_ID = "RUN-011"

sys.path.insert(0, str(SCRIPT_DIR))
from generate_chunks_run005 import chunk_analysis_file, load_existing_ids

PAPERS = [
    ("P153", DOC_REF / "2025" / "benchmarks" / "P153_Eiras_2025_KnowThyJudge.md"),
]


def main():
    existing = load_existing_ids()
    print("Existing chunk IDs in jsonl: {}".format(len(existing)))

    all_new = []
    per_paper = {}

    for pid, fpath in PAPERS:
        if not fpath.exists():
            print("MISSING: {}".format(fpath))
            per_paper[pid] = 0
            continue

        chunks = chunk_analysis_file(fpath, pid)
        for c in chunks:
            c["metadata"]["run_id"] = RUN_ID

        new_only = [c for c in chunks if c["chunk_id"] not in existing]
        all_new.extend(new_only)
        per_paper[pid] = len(new_only)

    with open(CHUNKS_FILE, "a", encoding="utf-8") as f:
        for c in all_new:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")

    print("\nPer-paper new chunks: {}".format(per_paper))
    print("Total new chunks appended: {}".format(len(all_new)))


if __name__ == "__main__":
    main()
