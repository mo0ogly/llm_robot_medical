#!/usr/bin/env python3
"""
AEGIS RAG Ingestion — Load chunked bibliography into ChromaDB.

Usage:
    python ingest_to_chromadb.py [--dry-run] [--reset]

Options:
    --dry-run   Print stats without writing to ChromaDB
    --reset     Delete existing collection before ingesting

Requirements:
    pip install chromadb sentence-transformers
"""
import json
import os
import sys
import time

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CHUNKS_FILE = os.path.join(SCRIPT_DIR, "chunks_for_rag.jsonl")
CHROMA_PATH = os.path.join(os.path.dirname(SCRIPT_DIR), "..", "chroma_data")
COLLECTION_NAME = "bibliography_research"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
BATCH_SIZE = 50


def main():
    dry_run = "--dry-run" in sys.argv
    reset = "--reset" in sys.argv

    # ── 1. Load chunks ──
    print("[1/4] Loading chunks from", CHUNKS_FILE)
    chunks = []
    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                chunks.append(json.loads(line))
    print("  Loaded {} chunks".format(len(chunks)))

    if dry_run:
        # Print stats and exit
        type_counts = {}
        for c in chunks:
            ct = c["metadata"]["chunk_type"]
            type_counts[ct] = type_counts.get(ct, 0) + 1
        print("\n  Distribution by type:")
        for ct, cnt in sorted(type_counts.items(), key=lambda x: -x[1]):
            print("    {}: {}".format(ct, cnt))
        total_tokens = sum(c["metadata"]["token_count"] for c in chunks)
        print("\n  Total tokens: {}".format(total_tokens))
        print("  Average tokens/chunk: {:.1f}".format(total_tokens / len(chunks)))
        print("\n  [DRY RUN] No data written to ChromaDB.")
        return

    # ── 2. Load embedding model ──
    print("[2/4] Loading embedding model:", EMBEDDING_MODEL)
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        print("ERROR: sentence-transformers not installed.")
        print("  Run: pip install sentence-transformers")
        sys.exit(1)

    model = SentenceTransformer(EMBEDDING_MODEL)
    print("  Model loaded (dimension: {})".format(model.get_sentence_embedding_dimension()))

    # ── 3. Connect to ChromaDB ──
    print("[3/4] Connecting to ChromaDB at", os.path.abspath(CHROMA_PATH))
    try:
        import chromadb
    except ImportError:
        print("ERROR: chromadb not installed.")
        print("  Run: pip install chromadb")
        sys.exit(1)

    os.makedirs(CHROMA_PATH, exist_ok=True)
    client = chromadb.PersistentClient(path=os.path.abspath(CHROMA_PATH))

    if reset:
        try:
            client.delete_collection(COLLECTION_NAME)
            print("  Deleted existing collection '{}'".format(COLLECTION_NAME))
        except Exception:
            pass

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"}
    )
    print("  Collection '{}' ready (existing docs: {})".format(
        COLLECTION_NAME, collection.count()))

    # ── 4. Generate embeddings and upsert ──
    print("[4/4] Generating embeddings and upserting {} chunks...".format(len(chunks)))
    start_time = time.time()

    for batch_start in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[batch_start:batch_start + BATCH_SIZE]

        ids = [c["chunk_id"] for c in batch]
        documents = [c["text"] for c in batch]

        # Clean metadata: ChromaDB only accepts str, int, float, bool
        metadatas = []
        for c in batch:
            m = c["metadata"].copy()
            # Convert lists to comma-separated strings
            m["delta_layers"] = ",".join(m.get("delta_layers", []))
            m["conjectures"] = ",".join(m.get("conjectures", []))
            m["keywords"] = ",".join(m.get("keywords", []))
            metadatas.append(m)

        # Generate embeddings
        embeddings = model.encode(documents).tolist()

        # Upsert batch
        collection.upsert(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )

        done = min(batch_start + BATCH_SIZE, len(chunks))
        elapsed = time.time() - start_time
        print("  [{}/{}] upserted ({:.1f}s)".format(done, len(chunks), elapsed))

    total_time = time.time() - start_time
    print("\nIngestion complete!")
    print("  Collection: '{}'".format(COLLECTION_NAME))
    print("  Total documents: {}".format(collection.count()))
    print("  Time: {:.1f}s".format(total_time))
    print("  ChromaDB path: {}".format(os.path.abspath(CHROMA_PATH)))

    # ── Quick verification query ──
    print("\n[Verification] Sample query: 'prompt injection medical LLM'")
    query_embedding = model.encode(["prompt injection medical LLM"]).tolist()
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=3,
        include=["documents", "metadatas", "distances"]
    )
    for i, (doc_id, dist) in enumerate(zip(results["ids"][0], results["distances"][0])):
        meta = results["metadatas"][0][i]
        print("  [{}] {} (distance: {:.4f}) -- {} / {}".format(
            i + 1, doc_id, dist,
            meta.get("chunk_type", "?"),
            meta.get("paper_id", "?")
        ))


if __name__ == "__main__":
    main()
