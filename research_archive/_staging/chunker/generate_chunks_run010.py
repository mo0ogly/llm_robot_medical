#!/usr/bin/env python3
"""
AEGIS RAG Chunker -- RUN-010 (INCREMENTAL, scoped)

Processes the 6 new analyses from RUN-010 (literature_for_rag cleanup integration):
- P146 Greshake et al. 2023 (Indirect Prompt Injection -- founder IPI)
- P147 Liu et al. 2024      (Formalizing & Benchmarking PI, USENIX Sec 2024)
- P148 Liu X. et al. 2024   (Automatic & Universal Prompt Injection)
- P149 Pape et al. 2024     (Prompt Obfuscation -- system prompt defense)
- P150 Zhao et al. 2026     (Safety Knowledge Neurons / SafeTuning, EACL 2026)
- P151 Srivastava et al. 2026 (Algorithmic Red Teaming Survey, Infosys)

Fiches read directly from doc_references/{year}/{domain}/.
Reuses chunk_analysis_file() + load_existing_ids() from generate_chunks_run005.py.
Appends new chunks to chunks_for_rag.jsonl with run_id="RUN-010". Dedup-safe.
"""
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent  # poc_medical/
DOC_REF = PROJECT_ROOT / "research_archive" / "doc_references"
CHUNKS_FILE = SCRIPT_DIR / "chunks_for_rag.jsonl"

RUN_ID = "RUN-010"

sys.path.insert(0, str(SCRIPT_DIR))
from generate_chunks_run005 import chunk_analysis_file, load_existing_ids

PAPERS = [
    ("P146", DOC_REF / "2023" / "prompt_injection" / "P146_Greshake_2023_IndirectPromptInjection.md"),
    ("P147", DOC_REF / "2024" / "benchmarks" / "P147_Liu_2024_FormalizingBenchmarkingPI.md"),
    ("P148", DOC_REF / "2024" / "prompt_injection" / "P148_Liu_2024_AutomaticUniversalInjection.md"),
    ("P149", DOC_REF / "2024" / "defenses" / "P149_Pape_2024_PromptObfuscation.md"),
    ("P150", DOC_REF / "2026" / "defenses" / "P150_Zhao_2026_SafetyKnowledgeNeurons.md"),
    ("P151", DOC_REF / "2026" / "benchmarks" / "P151_Srivastava_2026_AlgorithmicRedTeamingSurvey.md"),
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
        print("{}: {} total chunks, {} new".format(pid, len(chunks), len(new_only)))

    if not all_new:
        print("No new chunks. Nothing appended.")
        return

    with open(CHUNKS_FILE, "a", encoding="utf-8") as f:
        for chunk in all_new:
            f.write(json.dumps(chunk, ensure_ascii=False) + "\n")

    total_tokens = sum(c["metadata"]["token_count"] for c in all_new)
    print("\n=== SUMMARY RUN-010 ===")
    print("New chunks appended: {}".format(len(all_new)))
    for pid, n in per_paper.items():
        flag = "" if n >= 5 else "  <-- BELOW 5 (BLOCKED)"
        print("  {}: {} chunks{}".format(pid, n, flag))
    print("Total tokens (new): {}".format(total_tokens))
    print("Total chunks in JSONL now: {}".format(len(existing) + len(all_new)))

    stats = {
        "run_id": RUN_ID,
        "new_chunks": len(all_new),
        "per_paper": per_paper,
        "total_tokens_new": total_tokens,
        "chunk_ids": [c["chunk_id"] for c in all_new],
    }
    with open(SCRIPT_DIR / "run010_stats.json", "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
    print("Stats written to run010_stats.json")


if __name__ == "__main__":
    main()
