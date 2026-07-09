"""
ChromaDB query helper for the SCIENTIST agent.

Queries the aegis_corpus collection (or any named collection) and returns
results as JSON to stdout, ready for agent consumption.

Usage:
    python query_chromadb.py "FDA protocol tool hijack" --n 5
    python query_chromadb.py "homoglyph" "unicode evasion" --n 3 --doc-type reference
    python query_chromadb.py "fiche attaque" --doc-type fiche_attaque --collection aegis_corpus
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parents[3]
CHROMA_DB_PATH = PROJECT_ROOT / "backend" / "chroma_db"
DEFAULT_COLLECTION = "aegis_corpus"
BIBLIOGRAPHY_COLLECTION = "aegis_bibliography"
DEFAULT_SNIPPET = 1800

# Shared retrieval quality layer (hybrid dense + exact-id boost + rerank).
sys.path.insert(0, str(PROJECT_ROOT / "backend"))
import rag_retrieval  # noqa: E402


def get_client():
    """Get ChromaDB client — PersistentClient first, HttpClient fallback."""
    try:
        import chromadb
    except ImportError:
        print(json.dumps({"error": "chromadb not installed. Run: pip install chromadb"}))
        sys.exit(1)

    # PersistentClient first (always available locally)
    try:
        return chromadb.PersistentClient(path=str(CHROMA_DB_PATH))
    except Exception:
        pass

    # HttpClient fallback
    try:
        return chromadb.HttpClient(host="localhost", port=8000)
    except Exception as e:
        print(json.dumps({"error": f"Cannot connect to ChromaDB: {e}"}))
        sys.exit(1)


def query_collection(queries: list, collection_name: str = DEFAULT_COLLECTION,
                     n_results: int = 5, doc_type_filter: str = None,
                     snippet_chars: int = DEFAULT_SNIPPET) -> dict:
    """Query one collection via the shared hybrid retrieval layer.

    Hybrid = dense over-fetch + exact-identifier ($contains) boost, fused by RRF,
    then optionally reranked by a cross-encoder (graceful fallback if unavailable).
    """
    client = get_client()

    try:
        collection = client.get_collection(collection_name)
    except Exception:
        return {
            "collection": collection_name,
            "error": f"Collection '{collection_name}' not found",
            "available_collections": [c.name for c in client.list_collections()],
            "results": [],
        }

    results = rag_retrieval.hybrid_search(
        collection, queries, n_results=n_results,
        doc_type_filter=doc_type_filter, snippet_chars=snippet_chars,
    )

    return {
        "collection": collection_name,
        "query_count": len(queries),
        "total_results": len(results),
        "reranker": rag_retrieval.reranker_status(),
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "results": results,
    }


def query_multi_collection(queries: list, n_results: int = 5,
                           doc_type_filter: str = None,
                           snippet_chars: int = DEFAULT_SNIPPET) -> dict:
    """Query aegis_corpus AND aegis_bibliography, merge, dedup, re-order.

    Each collection is retrieved with the hybrid layer; results are merged and
    ordered by rerank score when present, else by RRF score.
    """
    collections = [DEFAULT_COLLECTION, BIBLIOGRAPHY_COLLECTION]
    all_results = []
    seen_ids = set()
    errors = []

    for coll_name in collections:
        result = query_collection(queries, coll_name, n_results, doc_type_filter,
                                  snippet_chars)
        if "error" in result:
            errors.append({"collection": coll_name, "error": result["error"]})
            continue
        for r in result.get("results", []):
            if r.get("id") and r["id"] not in seen_ids:
                seen_ids.add(r["id"])
                r["collection_source"] = coll_name
                all_results.append(r)

    def _order_key(r):
        # Prefer rerank score (higher = better); fall back to RRF score.
        if r.get("rerank_score") is not None:
            return (0, -r["rerank_score"])
        return (1, -(r.get("rrf_score") or 0.0))

    all_results.sort(key=_order_key)

    return {
        "collections": collections,
        "mode": "multi-collection",
        "query_count": len(queries),
        "total_results": len(all_results),
        "reranker": rag_retrieval.reranker_status(),
        "errors": errors if errors else None,
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "results": all_results[:n_results * 2],  # Cap at 2x n_results across both
    }


def main():
    parser = argparse.ArgumentParser(description="Query ChromaDB for SCIENTIST agent")
    parser.add_argument("queries", nargs="+", help="Search queries (multiple for broader recall)")
    parser.add_argument("--n", type=int, default=5, help="Number of results per query")
    parser.add_argument("--collection", default=DEFAULT_COLLECTION, help="Collection name")
    parser.add_argument("--doc-type", default=None, help="Filter by doc_type metadata")
    parser.add_argument("--multi-collection", action="store_true",
                        help="Query aegis_corpus + aegis_bibliography simultaneously")
    parser.add_argument("--snippet", type=int, default=DEFAULT_SNIPPET,
                        help="Max characters of each document returned (default 1800)")
    args = parser.parse_args()

    if args.multi_collection:
        result = query_multi_collection(args.queries, args.n, args.doc_type,
                                        args.snippet)
    else:
        result = query_collection(args.queries, args.collection, args.n,
                                  args.doc_type, args.snippet)
    output = json.dumps(result, indent=2, ensure_ascii=False)
    sys.stdout.buffer.write(output.encode("utf-8"))
    sys.stdout.buffer.write(b"\n")


if __name__ == "__main__":
    main()
