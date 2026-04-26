"""
seed_rag.py — Pre-position documents into ChromaDB for RAG-based attack scenarios.

For RAG-based attack scenarios (chain_id contains "rag"), the adversarial payload
must be physically present in ChromaDB BEFORE run_formal_campaign() is called.
Without seeding, the multimodal_rag chain retrieves nothing and the attack is inert.

Also seeds legitimate scientific references alongside the adversarial document so
the injection hides in a realistic corpus — matching the threat model.

Usage (CLI):
    python seed_rag.py --scenario temporal_video_frame_injection
    python seed_rag.py --file path/to/doc.md --collection medical_multimodal --type reference
    python seed_rag.py --query temporal_video_frame_injection   # gap check only

Called by:
    - add-scenario skill Phase 1c (automated seeding during scenario creation)
    - POST /api/redteam/seed-rag (API endpoint for on-demand seeding)
    - manual CLI for corpus maintenance

Collections:
    medical_multimodal  — target for multimodal_rag chain (image+text retrieval)
    aegis_corpus        — general thesis + RAG upload endpoint
    medical-rag         — default for rag_basic, rag_fusion, hyde, etc.
"""

import argparse
import hashlib
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Literal

import chromadb

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

CHROMA_HOST = os.getenv("CHROMA_HOST", "localhost")
CHROMA_PORT = int(os.getenv("CHROMA_PORT", "8000"))
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# Map chain_id -> default collection
CHAIN_COLLECTION_MAP: dict[str, str] = {
    "multimodal_rag":     "medical_multimodal",
    "rag_basic":          "rag-basic",
    "rag_private":        "rag-private",
    "rag_multi_query":    "medical-rag",
    "rag_fusion":         "medical-rag",
    "rag_conversation":   "medical-rag",
    "hyde":               "medical-rag",
    "rag_semi_structured": "medical_semi_structured",
}


def get_chroma_client() -> chromadb.ClientAPI:
    """Connect to ChromaDB — try remote HttpClient first, fallback to PersistentClient."""
    try:
        return chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
    except Exception:
        return chromadb.PersistentClient(path="./chroma_db")


def collection_for_chain(chain_id: str) -> str:
    """Return the ChromaDB collection name for a given chain_id."""
    return CHAIN_COLLECTION_MAP.get(chain_id, "medical-rag")


# ---------------------------------------------------------------------------
# Core seeding function
# ---------------------------------------------------------------------------

def seed_document(
    text: str,
    collection_name: str,
    scenario_id: str,
    doc_type: Literal["adversarial", "reference", "thesis"],
    source: str,
    doc_id: str | None = None,
) -> dict:
    """
    Chunk and upsert a document into a ChromaDB collection.

    Uses deterministic IDs (hash-based) so re-seeding the same document is
    idempotent — no duplicate chunks accumulate across runs.

    Args:
        text:            Full document text to ingest.
        collection_name: Target ChromaDB collection.
        scenario_id:     Scenario this document belongs to (stored in metadata).
        doc_type:        'adversarial' (attack payload) | 'reference' (academic) | 'thesis'.
        source:          Human-readable source identifier (URL, BibTeX key, filename).
        doc_id:          Optional deterministic ID prefix. Defaults to sha256 of text[:64].

    Returns:
        dict: collection, n_chunks, ids, doc_type, scenario_id, source
    """
    client = get_chroma_client()
    collection = client.get_or_create_collection(collection_name)

    # Deterministic ID prefix — same text always produces same IDs (upsert-safe)
    if doc_id is None:
        doc_id = hashlib.sha256(text[:64].encode()).hexdigest()[:16]

    # Chunk with overlap
    chunks: list[str] = []
    pos = 0
    while pos < len(text):
        chunks.append(text[pos : pos + CHUNK_SIZE])
        pos += CHUNK_SIZE - CHUNK_OVERLAP

    ids = [scenario_id + "_" + doc_type + "_" + doc_id + "_" + str(i) for i in range(len(chunks))]
    metadatas = [
        {
            "scenario_id": scenario_id,
            "doc_type": doc_type,
            "source": source,
            "chunk_index": i,
            "ingested_at": datetime.utcnow().isoformat(),
        }
        for i in range(len(chunks))
    ]

    collection.upsert(documents=chunks, ids=ids, metadatas=metadatas)

    return {
        "collection": collection_name,
        "n_chunks": len(chunks),
        "ids": ids,
        "doc_type": doc_type,
        "scenario_id": scenario_id,
        "source": source,
    }


# ---------------------------------------------------------------------------
# Scenario-level seeding
# ---------------------------------------------------------------------------

def seed_scenario_adversarial(scenario_id: str, chain_id: str = "multimodal_rag") -> list[dict]:
    """
    Seed all documents for a given scenario into the appropriate ChromaDB collection.

    Loads:
    1. Adversarial payload(s) from scenarios.py (scenario.steps[*].message)
    2. Scientific references from research_archive/data/references/scenario_{id}_refs.md

    The adversarial document hides among the legitimate references — matching the
    realistic threat model where an insider pre-populates the surgical RAG store.

    Args:
        scenario_id: Scenario identifier (must exist in SCENARIO_CATALOG).
        chain_id:    Chain identifier — determines target ChromaDB collection.

    Returns:
        list of seeding result dicts, one per document ingested.
    """
    results: list[dict] = []
    target_collection = collection_for_chain(chain_id)

    # ------------------------------------------------------------------
    # 1. Adversarial payload from scenarios.py
    # ------------------------------------------------------------------
    try:
        # Add backend dir to path when called from project root
        backend_dir = Path(__file__).parent
        if str(backend_dir) not in sys.path:
            sys.path.insert(0, str(backend_dir))

        from scenarios import get_all_scenarios  # type: ignore
        scenarios = get_all_scenarios()
        scenario = next((s for s in scenarios if s.id == scenario_id), None)

        if scenario is None:
            print("[seed_rag] WARNING: scenario '" + scenario_id + "' not found in SCENARIO_CATALOG")
        else:
            for i, step in enumerate(scenario.steps):
                msg = getattr(step, "message", None)
                if msg:
                    result = seed_document(
                        text=msg,
                        collection_name=target_collection,
                        scenario_id=scenario_id,
                        doc_type="adversarial",
                        source="scenario:" + scenario_id + ":step" + str(i),
                    )
                    results.append(result)
                    print(
                        "[seed_rag] Seeded adversarial step "
                        + str(i)
                        + ": "
                        + str(result["n_chunks"])
                        + " chunks → "
                        + target_collection
                    )
    except Exception as exc:
        print("[seed_rag] WARNING: could not load scenario payload: " + str(exc))

    # ------------------------------------------------------------------
    # 2. Scientific references from research_archive (gitignored, local only)
    # ------------------------------------------------------------------
    refs_path = (
        Path(__file__).parent.parent
        / "research_archive"
        / "data"
        / "references"
        / ("scenario_" + scenario_id + "_refs.md")
    )
    if refs_path.exists():
        refs_text = refs_path.read_text(encoding="utf-8")
        result = seed_document(
            text=refs_text,
            collection_name=target_collection,
            scenario_id=scenario_id,
            doc_type="reference",
            source=refs_path.name,
        )
        results.append(result)
        print(
            "[seed_rag] Seeded scientist refs: "
            + str(result["n_chunks"])
            + " chunks → "
            + target_collection
        )
    else:
        print("[seed_rag] No refs file found at " + str(refs_path) + " — skipping reference seeding")

    return results


# ---------------------------------------------------------------------------
# Gap detection (for Doc Writer Phase 3 web search trigger)
# ---------------------------------------------------------------------------

def query_rag_for_gaps(
    scenario_id: str,
    collection_name: str = "aegis_corpus",
    n_results: int = 5,
) -> dict:
    """
    Query ChromaDB to check if existing thesis content covers the scenario topic.

    Used by Doc Writer Phase 3 to decide whether to run a web search:
    - gap_detected=True  → Doc Writer invokes WebSearch to fill gaps + saves traces
    - gap_detected=False → Doc Writer uses existing ChromaDB excerpts directly

    Args:
        scenario_id:     Used as the query string (underscores → spaces).
        collection_name: Collection to search ('aegis_corpus' = thesis + uploads).
        n_results:       How many results to retrieve.

    Returns:
        dict:
            found (bool): True if any relevant content exists
            n_results (int): Number of matching chunks retrieved
            excerpts (list[str]): First 3 relevant passages
            gap_detected (bool): True if coverage is thin (< 2 results)
    """
    client = get_chroma_client()
    query_text = scenario_id.replace("_", " ")
    try:
        collection = client.get_collection(collection_name)
        results = collection.query(query_texts=[query_text], n_results=n_results)
        docs: list[str] = results.get("documents", [[]])[0]
        return {
            "found": len(docs) > 0,
            "n_results": len(docs),
            "excerpts": docs[:3],
            "gap_detected": len(docs) < 2,
            "query": query_text,
            "collection": collection_name,
        }
    except Exception as exc:
        return {
            "found": False,
            "n_results": 0,
            "excerpts": [],
            "gap_detected": True,
            "query": query_text,
            "collection": collection_name,
            "error": str(exc),
        }


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Seed RAG documents for AEGIS Red Team attack scenarios",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Seed all docs for a scenario (adversarial payload + scientist refs)
  python seed_rag.py --scenario temporal_video_frame_injection

  # Check if ChromaDB already covers a topic (gap detection)
  python seed_rag.py --query temporal_video_frame_injection

  # Seed a single file manually
  python seed_rag.py --file research_archive/data/references/scenario_X_refs.md \\
      --collection medical_multimodal --type reference --source zhang2025temporal
        """,
    )
    parser.add_argument("--scenario", help="Scenario ID — seeds payload + refs automatically")
    parser.add_argument("--chain-id", default="multimodal_rag", help="Chain ID (determines collection)")
    parser.add_argument("--query", help="Gap-check query against aegis_corpus")
    parser.add_argument("--file", help="Path to document file to seed manually")
    parser.add_argument("--collection", default="medical_multimodal", help="Target ChromaDB collection")
    parser.add_argument(
        "--type",
        choices=["adversarial", "reference", "thesis"],
        default="reference",
        dest="doc_type",
        help="Document type tag stored in metadata",
    )
    parser.add_argument("--source", default="manual", help="Source identifier (URL, BibTeX key, filename)")
    args = parser.parse_args()

    if args.query:
        result = query_rag_for_gaps(args.query)
        print(json.dumps(result, indent=2, default=str))

    elif args.scenario:
        results = seed_scenario_adversarial(args.scenario, chain_id=args.chain_id)
        print(json.dumps(results, indent=2, default=str))
        total_chunks = sum(r.get("n_chunks", 0) for r in results)
        print("\nTotal: " + str(len(results)) + " documents, " + str(total_chunks) + " chunks seeded")

    elif args.file:
        text = Path(args.file).read_text(encoding="utf-8")
        result = seed_document(
            text=text,
            collection_name=args.collection,
            scenario_id=args.source,
            doc_type=args.doc_type,
            source=args.file,
        )
        print(json.dumps(result, indent=2, default=str))

    else:
        parser.print_help()
