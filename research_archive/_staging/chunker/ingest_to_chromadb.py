#!/usr/bin/env python3
"""
AEGIS RAG Ingestion — Load chunked bibliography + discoveries into ChromaDB.

Unified ingestion into the SAME ChromaDB used by the backend (backend/chroma_db/)
so that SCIENTIST, seed_rag.py, and rag_routes.py can all query bibliography data.

Usage:
    python ingest_to_chromadb.py                    # Ingest new chunks only (incremental)
    python ingest_to_chromadb.py --full              # Ingest all chunks (reset + reimport)
    python ingest_to_chromadb.py --dry-run           # Print stats without writing
    python ingest_to_chromadb.py --query "prompt injection medical"  # Query test
    python ingest_to_chromadb.py --query "triple convergence delta"  # Search discoveries
    python ingest_to_chromadb.py --stats             # Show collection statistics
    python ingest_to_chromadb.py --export-ids        # List all ingested chunk IDs

Requirements:
    pip install chromadb sentence-transformers

Integration:
    - Writes to backend/chroma_db/ (same path as backend/seed_rag.py)
    - Collection "aegis_bibliography" is separate from "aegis_corpus" (no conflicts)
    - Backend can query both collections via rag_routes.py
"""
import json
import os
import sys
import time
import hashlib
from pathlib import Path

# ── Paths ──
SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent  # poc_medical/
CHUNKS_FILE = SCRIPT_DIR / "chunks_for_rag.jsonl"
DISCOVERIES_DIR = PROJECT_ROOT / "research_archive" / "discoveries"
CHROMA_PATH = PROJECT_ROOT / "backend" / "chroma_db"  # Same as backend!
INGESTION_LOG = SCRIPT_DIR / "ingestion_state.json"

# ── Config ──
COLLECTION_NAME = "aegis_bibliography"  # Separate from aegis_corpus (no collision)
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
BATCH_SIZE = 50

# ── Delta layer normalization ──
DELTA_UNICODE_TO_INT = {
    "δ⁰": 0, "delta-0": 0, "delta0": 0, "0": 0,
    "δ¹": 1, "delta-1": 1, "delta1": 1, "1": 1,
    "δ²": 2, "delta-2": 2, "delta2": 2, "2": 2,
    "δ³": 3, "delta-3": 3, "delta3": 3, "3": 3,
}


def normalize_delta(val):
    """Normalize delta layer to integer string for ChromaDB filtering."""
    if isinstance(val, int):
        return str(val)
    s = str(val).strip().lower()
    return str(DELTA_UNICODE_TO_INT.get(s, s))


def normalize_metadata(raw_meta):
    """Clean metadata for ChromaDB (only str, int, float, bool allowed)."""
    m = {}
    for k, v in raw_meta.items():
        if isinstance(v, list):
            if k == "delta_layers":
                m[k] = ",".join(normalize_delta(x) for x in v)
            else:
                m[k] = ",".join(str(x) for x in v)
        elif isinstance(v, (str, int, float, bool)):
            m[k] = v
        else:
            m[k] = str(v)

    # Ensure essential fields exist
    m.setdefault("source_agent", "unknown")
    m.setdefault("chunk_type", "unknown")
    m.setdefault("language", "fr")
    m.setdefault("paper_id", "")
    m.setdefault("delta_layers", "")
    m.setdefault("conjectures", "")
    m.setdefault("keywords", "")
    m.setdefault("is_discovery", False)
    return m


def chunk_discovery_files():
    """Chunk discovery files into RAG-ready format (high priority)."""
    chunks = []
    if not DISCOVERIES_DIR.exists():
        return chunks

    discovery_files = [
        ("DISCOVERIES_INDEX.md", "discovery_index", ["D-001", "D-012"]),
        ("TRIPLE_CONVERGENCE.md", "discovery", ["D-001", "D-003", "D-009"]),
        ("CONJECTURES_TRACKER.md", "conjecture", ["C1", "C2", "C3", "C4", "C5", "C6", "C7"]),
        ("THESIS_GAPS.md", "thesis_gap", ["G-001", "G-012"]),
    ]

    for filename, chunk_type, default_conjectures in discovery_files:
        filepath = DISCOVERIES_DIR / filename
        if not filepath.exists():
            continue

        content = filepath.read_text(encoding="utf-8")
        # Split by ## headers for semantic chunking
        sections = []
        current = []
        current_title = filename

        for line in content.split("\n"):
            if line.startswith("## ") and current:
                sections.append((current_title, "\n".join(current)))
                current = [line]
                current_title = line.strip("# ").strip()
            else:
                current.append(line)
        if current:
            sections.append((current_title, "\n".join(current)))

        for i, (title, text) in enumerate(sections):
            if len(text.strip()) < 50:
                continue
            # Truncate if too long (600 token ≈ 2400 chars)
            if len(text) > 2400:
                # Split into sub-chunks
                for j in range(0, len(text), 2200):
                    sub = text[j:j+2400]
                    chunk_id = "DISC_{}_s{}_{}" .format(
                        filename.replace(".md", ""), i, j // 2200)
                    chunks.append({
                        "chunk_id": chunk_id,
                        "text": sub,
                        "metadata": {
                            "source_agent": "scientist",
                            "source_file": str(filepath.relative_to(PROJECT_ROOT)),
                            "paper_id": "",
                            "chunk_type": chunk_type,
                            "delta_layers": "0,1,2,3",
                            "conjectures": ",".join(default_conjectures),
                            "keywords": title.lower().replace(" ", ",")[:100],
                            "language": "fr",
                            "token_count": len(sub.split()),
                            "is_discovery": True,
                            "discovery_section": title,
                            "run_id": "RUN-002",
                        }
                    })
            else:
                chunk_id = "DISC_{}_s{}".format(filename.replace(".md", ""), i)
                chunks.append({
                    "chunk_id": chunk_id,
                    "text": text,
                    "metadata": {
                        "source_agent": "scientist",
                        "source_file": str(filepath.relative_to(PROJECT_ROOT)),
                        "paper_id": "",
                        "chunk_type": chunk_type,
                        "delta_layers": "0,1,2,3",
                        "conjectures": ",".join(default_conjectures),
                        "keywords": title.lower().replace(" ", ",")[:100],
                        "language": "fr",
                        "token_count": len(text.split()),
                        "is_discovery": True,
                        "discovery_section": title,
                        "run_id": "RUN-002",
                    }
                })

    return chunks


def load_chunks():
    """Load bibliography chunks + discovery chunks."""
    chunks = []

    # 1. Bibliography chunks
    if CHUNKS_FILE.exists():
        with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    chunks.append(json.loads(line))

    # 2. Discovery chunks (generated on the fly, high priority)
    disc_chunks = chunk_discovery_files()
    chunks.extend(disc_chunks)

    return chunks


def load_ingestion_state():
    """Load previous ingestion state for incremental mode."""
    if INGESTION_LOG.exists():
        with open(INGESTION_LOG, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"ingested_ids": [], "last_run": None, "total_ingested": 0}


def save_ingestion_state(state):
    """Save ingestion state."""
    with open(INGESTION_LOG, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)


def compute_chunk_hash(chunk):
    """Hash chunk content for change detection."""
    content = chunk.get("text", "") + json.dumps(chunk.get("metadata", {}), sort_keys=True)
    return hashlib.md5(content.encode()).hexdigest()[:12]


def cmd_stats(client):
    """Show collection statistics."""
    try:
        col = client.get_collection(COLLECTION_NAME)
    except Exception:
        print("Collection '{}' does not exist yet.".format(COLLECTION_NAME))
        return

    count = col.count()
    print("Collection: {}".format(COLLECTION_NAME))
    print("Total documents: {}".format(count))
    print("ChromaDB path: {}".format(CHROMA_PATH))

    if count == 0:
        return

    # Sample metadata distribution
    sample = col.get(limit=min(count, 500), include=["metadatas"])
    type_counts = {}
    agent_counts = {}
    discovery_count = 0
    for m in sample["metadatas"]:
        ct = m.get("chunk_type", "unknown")
        ag = m.get("source_agent", "unknown")
        type_counts[ct] = type_counts.get(ct, 0) + 1
        agent_counts[ag] = agent_counts.get(ag, 0) + 1
        if m.get("is_discovery"):
            discovery_count += 1

    print("\nBy chunk_type:")
    for ct, cnt in sorted(type_counts.items(), key=lambda x: -x[1]):
        print("  {}: {}".format(ct, cnt))
    print("\nBy source_agent:")
    for ag, cnt in sorted(agent_counts.items(), key=lambda x: -x[1]):
        print("  {}: {}".format(ag, cnt))
    print("\nDiscovery chunks: {}".format(discovery_count))


def cmd_query(client, query_text, n_results=5):
    """Query the bibliography collection."""
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        print("ERROR: pip install sentence-transformers")
        sys.exit(1)

    try:
        col = client.get_collection(COLLECTION_NAME)
    except Exception:
        print("Collection '{}' does not exist. Run ingestion first.".format(COLLECTION_NAME))
        return

    model = SentenceTransformer(EMBEDDING_MODEL)
    embedding = model.encode([query_text]).tolist()

    results = col.query(
        query_embeddings=embedding,
        n_results=n_results,
        include=["documents", "metadatas", "distances"]
    )

    print("Query: '{}'".format(query_text))
    print("Results ({}):\n".format(len(results["ids"][0])))

    for i, chunk_id in enumerate(results["ids"][0]):
        dist = results["distances"][0][i]
        meta = results["metadatas"][0][i]
        doc = results["documents"][0][i]
        is_disc = "** DISCOVERY **" if meta.get("is_discovery") else ""

        print("[{}] {} (cosine dist: {:.4f}) {}".format(i + 1, chunk_id, dist, is_disc))
        print("    Type: {} | Agent: {} | Paper: {} | Delta: {} | Conj: {}".format(
            meta.get("chunk_type", "?"),
            meta.get("source_agent", "?"),
            meta.get("paper_id", "?"),
            meta.get("delta_layers", "?"),
            meta.get("conjectures", "?"),
        ))
        # Show first 200 chars of text
        preview = doc[:200].replace("\n", " ")
        print("    Preview: {}...".format(preview))
        print()


def cmd_export_ids(client):
    """Export all ingested chunk IDs."""
    try:
        col = client.get_collection(COLLECTION_NAME)
    except Exception:
        print("Collection does not exist.")
        return

    count = col.count()
    if count == 0:
        print("Collection is empty.")
        return

    all_data = col.get(limit=count, include=["metadatas"])
    for cid, meta in zip(all_data["ids"], all_data["metadatas"]):
        print("{}\t{}\t{}".format(cid, meta.get("chunk_type", "?"), meta.get("source_agent", "?")))


def cmd_dry_run(chunks):
    """Print stats without writing."""
    type_counts = {}
    agent_counts = {}
    disc_count = 0
    total_tokens = 0

    for c in chunks:
        m = c.get("metadata", {})
        ct = m.get("chunk_type", "unknown")
        ag = m.get("source_agent", "unknown")
        type_counts[ct] = type_counts.get(ct, 0) + 1
        agent_counts[ag] = agent_counts.get(ag, 0) + 1
        total_tokens += m.get("token_count", 0)
        if m.get("is_discovery"):
            disc_count += 1

    print("=== DRY RUN ===")
    print("Total chunks to ingest: {}".format(len(chunks)))
    print("  Bibliography chunks: {}".format(len(chunks) - disc_count))
    print("  Discovery chunks: {}".format(disc_count))
    print("  Total tokens: {}".format(total_tokens))
    print("  Avg tokens/chunk: {:.1f}".format(total_tokens / max(len(chunks), 1)))

    print("\nBy chunk_type:")
    for ct, cnt in sorted(type_counts.items(), key=lambda x: -x[1]):
        print("  {}: {}".format(ct, cnt))

    print("\nBy source_agent:")
    for ag, cnt in sorted(agent_counts.items(), key=lambda x: -x[1]):
        print("  {}: {}".format(ag, cnt))

    print("\nTarget: {} / collection '{}'".format(CHROMA_PATH, COLLECTION_NAME))
    print("[DRY RUN] No data written.")


def cmd_ingest(chunks, full_mode=False):
    """Ingest chunks into ChromaDB."""
    try:
        from sentence_transformers import SentenceTransformer
        import chromadb
    except ImportError as e:
        print("ERROR: {}".format(e))
        print("  Run: pip install chromadb sentence-transformers")
        sys.exit(1)

    # Load state
    state = load_ingestion_state()
    already_ingested = set(state.get("ingested_ids", []))

    # Filter to new chunks only (unless full mode)
    if full_mode:
        to_ingest = chunks
        print("[FULL MODE] Ingesting all {} chunks (reset + reimport)".format(len(chunks)))
    else:
        to_ingest = [c for c in chunks if c["chunk_id"] not in already_ingested]
        # Also re-ingest discovery chunks (they may have changed)
        disc_ids = {c["chunk_id"] for c in chunks if c.get("metadata", {}).get("is_discovery")}
        for c in chunks:
            if c["chunk_id"] in disc_ids and c not in to_ingest:
                to_ingest.append(c)

        if not to_ingest:
            print("No new chunks to ingest. All {} chunks already in ChromaDB.".format(len(chunks)))
            print("Use --full to force re-ingestion.")
            return
        print("[INCREMENTAL] Ingesting {} new chunks ({} already ingested)".format(
            len(to_ingest), len(already_ingested)))

    # Load model
    print("[1/4] Loading embedding model: {}".format(EMBEDDING_MODEL))
    model = SentenceTransformer(EMBEDDING_MODEL)
    dim = model.get_sentence_embedding_dimension()
    print("  Model loaded (dimension: {})".format(dim))

    # Connect to ChromaDB
    print("[2/4] Connecting to ChromaDB at {}".format(CHROMA_PATH))
    os.makedirs(str(CHROMA_PATH), exist_ok=True)
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))

    if full_mode:
        try:
            client.delete_collection(COLLECTION_NAME)
            print("  Deleted existing collection '{}'".format(COLLECTION_NAME))
        except Exception:
            pass

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"}
    )
    print("  Collection '{}' ready (existing: {})".format(COLLECTION_NAME, collection.count()))

    # Ingest
    print("[3/4] Generating embeddings and upserting {} chunks...".format(len(to_ingest)))
    start = time.time()
    new_ids = []

    for batch_start in range(0, len(to_ingest), BATCH_SIZE):
        batch = to_ingest[batch_start:batch_start + BATCH_SIZE]

        ids = [c["chunk_id"] for c in batch]
        documents = [c["text"] for c in batch]
        metadatas = [normalize_metadata(c.get("metadata", {})) for c in batch]
        embeddings = model.encode(documents).tolist()

        collection.upsert(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )

        new_ids.extend(ids)
        done = min(batch_start + BATCH_SIZE, len(to_ingest))
        elapsed = time.time() - start
        print("  [{}/{}] upserted ({:.1f}s)".format(done, len(to_ingest), elapsed))

    total_time = time.time() - start

    # Update state
    all_ids = list(set(list(already_ingested) + new_ids))
    state = {
        "ingested_ids": all_ids,
        "last_run": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "total_ingested": collection.count(),
        "last_new_count": len(to_ingest),
        "mode": "full" if full_mode else "incremental",
    }
    save_ingestion_state(state)

    print("\n[4/4] Ingestion complete!")
    print("  Collection: '{}'".format(COLLECTION_NAME))
    print("  Total documents: {}".format(collection.count()))
    print("  New this run: {}".format(len(to_ingest)))
    print("  Time: {:.1f}s".format(total_time))
    print("  ChromaDB path: {}".format(CHROMA_PATH))

    # Verification queries
    print("\n=== Verification Queries ===")
    test_queries = [
        "prompt injection medical LLM securite",
        "triple convergence delta vulnerabilite",
        "conjecture C2 necessite delta 3",
        "CHER clinical harm metric MPIB",
        "GRP obliteration single prompt unalignment",
    ]
    for q in test_queries:
        qemb = model.encode([q]).tolist()
        res = collection.query(query_embeddings=qemb, n_results=2,
                               include=["metadatas", "distances"])
        top_id = res["ids"][0][0] if res["ids"][0] else "?"
        top_dist = res["distances"][0][0] if res["distances"][0] else 0
        top_type = res["metadatas"][0][0].get("chunk_type", "?") if res["metadatas"][0] else "?"
        is_disc = " [DISC]" if res["metadatas"][0][0].get("is_discovery") else "" if res["metadatas"][0] else ""
        print("  '{}' -> {} ({:.3f}) [{}]{}".format(
            q[:45], top_id[:35], top_dist, top_type, is_disc))


def main():
    args = sys.argv[1:]

    # Load chunks for most commands
    chunks = load_chunks()

    if "--dry-run" in args:
        cmd_dry_run(chunks)
        return

    # For commands that need ChromaDB
    try:
        import chromadb
    except ImportError:
        print("ERROR: chromadb not installed. Run: pip install chromadb")
        sys.exit(1)

    os.makedirs(str(CHROMA_PATH), exist_ok=True)
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))

    if "--stats" in args:
        cmd_stats(client)
        return

    if "--export-ids" in args:
        cmd_export_ids(client)
        return

    if "--query" in args:
        idx = args.index("--query")
        query_text = args[idx + 1] if idx + 1 < len(args) else "prompt injection"
        n = 5
        if "--n" in args:
            n = int(args[args.index("--n") + 1])
        cmd_query(client, query_text, n)
        return

    # Default: ingest
    full_mode = "--full" in args
    cmd_ingest(chunks, full_mode=full_mode)


if __name__ == "__main__":
    main()
