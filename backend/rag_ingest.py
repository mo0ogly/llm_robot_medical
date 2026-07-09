"""
rag_ingest.py — Ingestion and integrity helpers for the AEGIS internal RAG.

Pure logic (no FastAPI) shared by the upload endpoint and the maintenance router:

  - chunk_text: fixed-size chunking at 700 chars / 100 overlap. 700 stays under
    the ~256-token window of all-MiniLM-L6-v2 (the corpus embedder), so chunk
    tails are actually embedded — unlike the previous 1000-char chunks whose ends
    were silently truncated by the embedder.
  - ingest_file: document-level upsert (delete existing chunks for the source,
    then add) with rich metadata (source, type, date ISO, chunk_index). No orphan
    chunks left when a re-ingest produces fewer chunks than before.
  - counts_by_source / integrity_report: per-document chunk counts, flagging docs
    below a minimum-chunk threshold (a failed or partial ingest).
  - upload persistence: uploaded files are kept under backend/rag_uploads/<coll>/
    so a document can be re-indexed later without re-uploading.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path

CHUNK_SIZE = 700
CHUNK_OVERLAP = 100

# Collections the upload / maintenance surface is allowed to write to.
ALLOWED_COLLECTIONS = ("aegis_corpus", "aegis_bibliography", "medical_rag")

_BACKEND_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = _BACKEND_DIR / "rag_uploads"


# ---------------------------------------------------------------------------
# Chunking and text extraction
# ---------------------------------------------------------------------------

def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split *text* into overlapping fixed-size chunks (empty tail dropped)."""
    if not text:
        return []
    step = max(1, size - overlap)
    chunks = []
    for i in range(0, len(text), step):
        piece = text[i:i + size]
        if piece.strip():
            chunks.append(piece)
    return chunks


def extract_text(path: str, doc_type: str) -> str:
    """Extract plain text from a file (PDF via pypdf, otherwise read as text)."""
    if doc_type == "pdf":
        from pypdf import PdfReader
        reader = PdfReader(path)
        parts = []
        for page in reader.pages:
            parts.append(page.extract_text() or "")
        return "\n".join(parts)
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


# ---------------------------------------------------------------------------
# Upload persistence
# ---------------------------------------------------------------------------

def upload_path(collection: str, filename: str) -> Path:
    """Persisted location for an uploaded file (safe basename only)."""
    safe_name = os.path.basename(filename)
    return UPLOAD_DIR / collection / safe_name


def persist_upload(collection: str, filename: str, src_path: str) -> Path:
    """Copy an uploaded temp file into the persistent upload store."""
    import shutil
    dest = upload_path(collection, filename)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src_path, dest)
    return dest


def remove_upload(collection: str, filename: str) -> bool:
    """Delete a persisted upload file if present. Returns True if removed."""
    dest = upload_path(collection, filename)
    try:
        if dest.is_file():
            dest.unlink()
            return True
    except OSError:
        pass
    return False


# ---------------------------------------------------------------------------
# Ingestion (document-level upsert)
# ---------------------------------------------------------------------------

def ingest_file(collection, path: str, filename: str, doc_type: str) -> dict:
    """Chunk *path* and upsert it into *collection* under source=filename.

    Document-level upsert: existing chunks for this source are deleted first, so a
    re-ingest never leaves orphan chunks. Returns {source, chunks, doc_type, date}.
    """
    source = os.path.basename(filename)
    text = extract_text(path, doc_type)
    chunks = chunk_text(text)
    if not chunks:
        return {"source": source, "chunks": 0, "doc_type": doc_type, "date": None,
                "warning": "no extractable text"}

    # Remove any previous chunks for this source (idempotent re-ingest).
    try:
        collection.delete(where={"source": source})
    except Exception:
        pass

    date_iso = datetime.now(timezone.utc).isoformat(timespec="seconds")
    ids = [source + "_" + str(i) for i in range(len(chunks))]
    metadatas = [
        {"source": source, "type": doc_type, "date": date_iso, "chunk_index": i}
        for i in range(len(chunks))
    ]
    collection.add(documents=chunks, ids=ids, metadatas=metadatas)
    return {"source": source, "chunks": len(chunks), "doc_type": doc_type, "date": date_iso}


# ---------------------------------------------------------------------------
# Integrity
# ---------------------------------------------------------------------------

def counts_by_source(collection) -> dict:
    """Return {source: chunk_count} for every document in the collection."""
    res = collection.get(include=["metadatas"])
    counts: dict[str, int] = {}
    for meta in (res.get("metadatas") or []):
        src = (meta or {}).get("source") or (meta or {}).get("filename") or "unknown"
        counts[src] = counts.get(src, 0) + 1
    return counts


def integrity_report(collection, min_chunks: int = 3) -> dict:
    """Per-document chunk counts, flagging any document below *min_chunks*."""
    counts = counts_by_source(collection)
    docs = []
    unhealthy = 0
    for src, n in sorted(counts.items(), key=lambda kv: kv[1]):
        healthy = n >= min_chunks
        if not healthy:
            unhealthy += 1
        docs.append({"source": src, "chunk_count": n, "healthy": healthy})
    return {
        "total_docs": len(counts),
        "total_chunks": sum(counts.values()),
        "min_chunks": min_chunks,
        "unhealthy_count": unhealthy,
        "docs": docs,
    }
