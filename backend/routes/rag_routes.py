"""RAG / ChromaDB document management and seed-rag routes.

Endpoints:
    GET    /api/rag/documents
    GET    /api/rag/documents/{filename}/chunks
    POST   /api/rag/upload
    DELETE /api/rag/documents/{filename}
    POST   /api/rag/reset
    POST   /api/redteam/seed-rag
    GET    /api/redteam/seed-rag/check/{scenario_id}
    GET    /api/rag/collections                 (wiki widget)
    POST   /api/rag/semantic-search             (wiki widget, rate-limited)
"""

import os
import shutil
import time
from collections import deque
from threading import Lock

from fastapi import APIRouter, HTTPException, UploadFile, File, Request
from pydantic import BaseModel, Field

import chromadb
from pypdf import PdfReader

router = APIRouter()


# --- Simple in-memory rate limiter (PDCA cycle 2, SEC-09) ---
# Sliding window per-IP, no external dependency (slowapi not installed).
# Used to protect /api/rag/semantic-search from query flooding.

class SlidingWindowRateLimiter:
    """Thread-safe sliding window rate limiter, per-key (IP)."""

    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._buckets: dict[str, deque[float]] = {}
        self._lock = Lock()

    def check(self, key: str) -> tuple[bool, int]:
        """Return (allowed, remaining). Records the request if allowed."""
        now = time.monotonic()
        cutoff = now - self.window_seconds
        with self._lock:
            bucket = self._buckets.setdefault(key, deque())
            # Drop old entries
            while bucket and bucket[0] < cutoff:
                bucket.popleft()
            if len(bucket) >= self.max_requests:
                return (False, 0)
            bucket.append(now)
            return (True, self.max_requests - len(bucket))

    def cleanup(self, max_buckets: int = 1000) -> None:
        """Prevent unbounded growth — call periodically."""
        with self._lock:
            if len(self._buckets) <= max_buckets:
                return
            now = time.monotonic()
            cutoff = now - self.window_seconds
            stale = [k for k, v in self._buckets.items() if not v or v[-1] < cutoff]
            for k in stale:
                del self._buckets[k]


# Semantic search: 20 requests per minute per IP
_semantic_search_limiter = SlidingWindowRateLimiter(max_requests=20, window_seconds=60)


# --- ChromaDB client ---

CHROMA_HOST = os.getenv("CHROMA_HOST", "localhost")
CHROMA_PORT = int(os.getenv("CHROMA_PORT", 8000))


def get_chroma_client():
    try:
        return chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
    except Exception as e:
        print("ChromaDB connection failed: " + str(e) + ". Falling back to local storage.")
        return chromadb.PersistentClient(path="./chroma_db")


# --- Pydantic models ---


class SeedRagRequest(BaseModel):
    """Request body for the RAG seeding endpoint."""
    scenario_id: str
    chain_id: str = "multimodal_rag"


class SemanticSearchRequest(BaseModel):
    """Request body for the wiki semantic search endpoint.

    Security constraints (PDCA cycle 2, SEC-08):
        - query length clamped to 500 chars (prevents pathological queries to ChromaDB)
        - collection validated against whitelist in the endpoint
        - limit clamped to [1, 50] in the endpoint
    """
    query: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Natural language search query (max 500 chars)",
    )
    collection: str = Field(
        default="aegis_bibliography",
        max_length=64,
        description="ChromaDB collection name (whitelisted in endpoint)",
    )
    limit: int = Field(default=10, ge=1, le=50)
    min_distance: float = Field(default=0.0, ge=0.0, le=2.0)
    max_distance: float = Field(default=2.0, ge=0.0, le=2.0)


# --- Document CRUD ---


@router.get("/api/rag/documents")
async def list_documents():
    """List all unique documents in the RAG collection with chunk counts."""
    try:
        chroma = get_chroma_client()
        collection = chroma.get_or_create_collection("aegis_corpus")

        results = collection.get(include=["metadatas"])

        doc_chunks = {}
        if results["metadatas"]:
            for meta in results["metadatas"]:
                source = meta.get("source", "unknown")
                if source not in doc_chunks:
                    doc_chunks[source] = {
                        "id": source,
                        "filename": source,
                        "type": meta.get("type", "text"),
                        "date": meta.get("date", "N/A"),
                        "chunk_count": 0,
                    }
                doc_chunks[source]["chunk_count"] += 1

        return list(doc_chunks.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/rag/documents/{filename}/chunks")
async def get_document_chunks(filename: str, limit: int = 20):
    """Return chunks for a specific document with full content.

    Fixes (PDCA cycle 3.5, bug reported by user 2026-04-11 on
    /redteam/rag fiche_attaque_64):
    - ChromaDB returns embeddings as numpy.ndarray, not list. The previous
      code used truthiness checks like `if results["embeddings"]` and
      `bool(arr and arr[i])` which crashed with
      "The truth value of an array with more than one element is ambiguous".
      Fix: use explicit None checks and len() comparisons.
    - Previous code truncated content to 500 chars silently (text[:500]).
      PDCA cycle 2 RETEX D-PDCA-02 established the rule "no silent
      truncation on user-facing APIs". Fix: return full content plus
      content_length metadata.
    """
    try:
        chroma = get_chroma_client()
        collection = chroma.get_or_create_collection("aegis_corpus")

        results = collection.get(
            where={"source": filename},
            include=["documents", "metadatas", "embeddings"],
        )

        ids = results.get("ids") or []
        documents = results.get("documents")
        metadatas = results.get("metadatas")
        embeddings = results.get("embeddings")

        # Explicit None + length checks — avoid numpy ndarray truthiness trap
        has_documents = documents is not None and len(documents) > 0
        has_metadatas = metadatas is not None and len(metadatas) > 0
        has_embeddings = embeddings is not None and len(embeddings) > 0

        chunks = []
        for i, doc_id in enumerate(ids):
            text = documents[i] if has_documents and i < len(documents) else ""
            meta = metadatas[i] if has_metadatas and i < len(metadatas) else {}
            # For embeddings: check that the i-th vector exists (ndarray[i] OK)
            # and has non-zero length. Do NOT bool() the ndarray itself.
            if has_embeddings and i < len(embeddings):
                emb = embeddings[i]
                has_embedding = emb is not None and len(emb) > 0
            else:
                has_embedding = False

            chunks.append({
                "id": doc_id,
                "content": text,  # Full chunk, no truncation (PDCA cycle 2 rule)
                "content_length": len(text),
                "metadata": meta,
                "has_embedding": has_embedding,
            })
            if len(chunks) >= limit:
                break

        return {
            "filename": filename,
            "total_chunks": len(ids),
            "chunks": chunks,
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/rag/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload, parse et indexe un document dans ChromaDB."""
    try:
        chroma = get_chroma_client()
        collection = chroma.get_or_create_collection("aegis_corpus")

        content = ""
        filename = file.filename
        file_extension = os.path.splitext(filename)[1].lower()

        os.makedirs("temp_uploads", exist_ok=True)
        temp_path = "temp_uploads/" + filename

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if file_extension == ".pdf":
            reader = PdfReader(temp_path)
            for page in reader.pages:
                content += page.extract_text() + "\n"
        else:
            with open(temp_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

        # Basic chunking
        chunks = [content[i:i+1000] for i in range(0, len(content), 800)]

        ids = [filename + "_" + str(i) for i in range(len(chunks))]
        metadatas = [{"source": filename, "type": file_extension[1:]} for _ in range(len(chunks))]

        collection.add(
            documents=chunks,
            ids=ids,
            metadatas=metadatas
        )

        os.remove(temp_path)

        return {"status": "success", "filename": filename, "chunks": len(chunks)}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/api/rag/documents/{filename}")
async def delete_document(filename: str):
    """Supprime tous les chunks d'un document specifique."""
    try:
        chroma = get_chroma_client()
        collection = chroma.get_or_create_collection("aegis_corpus")
        collection.delete(where={"source": filename})
        return {"status": "deleted", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/rag/reset")
async def reset_rag():
    """Vide completement la collection RAG."""
    try:
        chroma = get_chroma_client()
        chroma.delete_collection("aegis_corpus")
        return {"status": "reset"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Seed RAG ---


@router.post("/api/redteam/seed-rag")
async def seed_rag_for_scenario(req: SeedRagRequest):
    """Pre-position adversarial payload + scientist references into ChromaDB."""
    try:
        from seed_rag import seed_scenario_adversarial, query_rag_for_gaps
        results = seed_scenario_adversarial(req.scenario_id, chain_id=req.chain_id)
        gap = query_rag_for_gaps(req.scenario_id)
        total_chunks = sum(r.get("n_chunks", 0) for r in results)
        return {
            "status": "seeded",
            "scenario_id": req.scenario_id,
            "chain_id": req.chain_id,
            "documents": results,
            "total_chunks": total_chunks,
            "gap_check": gap,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/redteam/seed-rag/check/{scenario_id}")
async def check_rag_coverage(scenario_id: str, collection: str = "aegis_corpus"):
    """Check if ChromaDB already has coverage for a scenario topic."""
    try:
        from seed_rag import query_rag_for_gaps
        return query_rag_for_gaps(scenario_id, collection_name=collection)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Wiki semantic search (Option 4 — live ChromaDB search for wiki widget) ---


@router.get("/api/rag/collections")
async def list_collections():
    """List ChromaDB collections with document + chunk counts (used by wiki widget)."""
    try:
        chroma = get_chroma_client()
        collections = chroma.list_collections()
        result = []
        for col in collections:
            try:
                collection = chroma.get_collection(col.name)
                count = collection.count()
                # Count unique sources
                try:
                    items = collection.get(include=["metadatas"], limit=count)
                    sources = set()
                    for meta in (items.get("metadatas") or []):
                        src = meta.get("source") or meta.get("filename") or meta.get("id")
                        if src:
                            sources.add(src)
                    n_docs = len(sources)
                except Exception:
                    n_docs = None
            except Exception:
                count = None
                n_docs = None
            result.append({
                "name": col.name,
                "chunk_count": count,
                "document_count": n_docs,
            })
        return {"collections": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/rag/semantic-search")
async def semantic_search(req: SemanticSearchRequest, request: Request):
    """Semantic search across ChromaDB collections for the wiki widget.

    Queries the specified collection (default: aegis_bibliography, 130 papers)
    using cosine similarity on sentence-transformers embeddings. Returns the
    top-K chunks with distance, source metadata, and content preview.

    This endpoint is the live backend for the wiki semantic search widget at
    /semantic-search/ — every paper ingested via the bibliography-maintainer
    pipeline becomes immediately searchable here with zero rebuild required.

    Rate limited to 20 requests/min per client IP (PDCA cycle 2, SEC-09).
    Input validation via SemanticSearchRequest (query max 500 chars, limit
    clamped 1-50, collection whitelist in body).
    """
    # Rate limit check — per client IP (or X-Forwarded-For if behind proxy)
    client_ip = (
        request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        or (request.client.host if request.client else "unknown")
    )
    allowed, remaining = _semantic_search_limiter.check(client_ip)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded: 20 requests per minute per IP. Please slow down.",
            headers={"Retry-After": "60"},
        )
    # Opportunistic cleanup of stale buckets
    _semantic_search_limiter.cleanup()

    try:
        chroma = get_chroma_client()

        # Validate collection
        allowed_collections = {
            "aegis_bibliography",
            "aegis_corpus",
            "medical_rag",
        }
        if req.collection not in allowed_collections:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid collection. Allowed: {sorted(allowed_collections)}",
            )

        try:
            collection = chroma.get_collection(req.collection)
        except Exception as e:
            raise HTTPException(
                status_code=404,
                detail=f"Collection '{req.collection}' not found: {e}",
            )

        # Cap limit to avoid accidental huge queries
        limit = max(1, min(req.limit, 50))

        results = collection.query(
            query_texts=[req.query],
            n_results=limit,
            include=["documents", "metadatas", "distances"],
        )

        hits = []
        docs_list = (results.get("documents") or [[]])[0]
        metas_list = (results.get("metadatas") or [[]])[0]
        dists_list = (results.get("distances") or [[]])[0]
        ids_list = (results.get("ids") or [[]])[0]

        for i, doc in enumerate(docs_list):
            meta = metas_list[i] if i < len(metas_list) else {}
            dist = dists_list[i] if i < len(dists_list) else None
            doc_id = ids_list[i] if i < len(ids_list) else f"hit_{i}"

            # Filter on distance range
            if dist is not None:
                if dist < req.min_distance or dist > req.max_distance:
                    continue

            # Extract identification fields from metadata
            source = (
                meta.get("source")
                or meta.get("filename")
                or meta.get("paper_id")
                or meta.get("file")
                or "unknown"
            )
            title = meta.get("title") or meta.get("name") or None
            paper_id = meta.get("paper_id") or meta.get("p_id") or None
            year = meta.get("year") or meta.get("date") or None
            delta_layer = meta.get("delta_layer") or meta.get("target_delta") or None

            # Full chunk content (PDCA cycle 2: user explicitly wants no truncation)
            content_full = doc or ""

            hits.append({
                "id": doc_id,
                "source": source,
                "title": title,
                "paper_id": paper_id,
                "year": year,
                "delta_layer": delta_layer,
                "distance": dist,
                "similarity": (1.0 - dist) if dist is not None else None,
                "content": content_full,
                "content_length": len(content_full),
            })

        return {
            "query": req.query,
            "collection": req.collection,
            "total_hits": len(hits),
            "hits": hits,
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
