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

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Request
from pydantic import BaseModel, Field

import chromadb
from pypdf import PdfReader

import rag_ingest

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


class HybridSearchRequest(BaseModel):
    """Request body for the hybrid RAG search endpoint.

    Hybrid = dense over-fetch + exact-identifier boost (RRF) + optional
    cross-encoder rerank, via backend.rag_retrieval. Same security envelope as
    SemanticSearchRequest (query clamped, collection whitelisted, limit clamped).
    """
    query: str = Field(..., min_length=1, max_length=500)
    collection: str = Field(default="aegis_corpus", max_length=64)
    multi: bool = Field(
        default=False,
        description="Query aegis_corpus + aegis_bibliography together when true",
    )
    limit: int = Field(default=10, ge=1, le=50)
    doc_type: str | None = Field(default=None, max_length=64)


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
async def upload_document(
    file: UploadFile = File(...),
    collection: str = Form("aegis_corpus"),
):
    """Upload, chunk (700/100), and upsert a document into ChromaDB.

    Delegates to rag_ingest for chunking + document-level upsert (rich metadata,
    no orphan chunks) and persists the file so it can be re-indexed later.
    """
    if collection not in rag_ingest.ALLOWED_COLLECTIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid collection. Allowed: " + ", ".join(rag_ingest.ALLOWED_COLLECTIONS),
        )
    filename = os.path.basename(file.filename or "upload")
    doc_type = os.path.splitext(filename)[1].lower().lstrip(".") or "txt"

    os.makedirs("temp_uploads", exist_ok=True)
    temp_path = "temp_uploads/" + filename
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        chroma = get_chroma_client()
        chroma_collection = chroma.get_or_create_collection(collection)
        result = rag_ingest.ingest_file(chroma_collection, temp_path, filename, doc_type)

        # Persist the source file so the document can be re-indexed later.
        rag_ingest.persist_upload(collection, filename, temp_path)

        result["status"] = "success"
        result["filename"] = filename
        result["collection"] = collection
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@router.delete("/api/rag/documents/{filename}")
async def delete_document(filename: str, collection: str = "aegis_corpus"):
    """Delete every chunk of a document, plus its persisted upload file."""
    if collection not in rag_ingest.ALLOWED_COLLECTIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid collection. Allowed: " + ", ".join(rag_ingest.ALLOWED_COLLECTIONS),
        )
    try:
        chroma = get_chroma_client()
        chroma_collection = chroma.get_or_create_collection(collection)
        chroma_collection.delete(where={"source": filename})
        rag_ingest.remove_upload(collection, filename)
        return {"status": "deleted", "filename": filename, "collection": collection}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ResetRequest(BaseModel):
    """Safe reset: confirm_count must equal the collection's live chunk count."""
    collection: str = Field(default="aegis_corpus", max_length=64)
    confirm_count: int = Field(..., ge=0)


@router.post("/api/rag/reset")
async def reset_rag(req: ResetRequest):
    """Clear a collection only if confirm_count matches its live chunk count.

    Forces the caller to read and echo the real volume before a destructive wipe,
    preventing an accidental one-click reset.
    """
    if req.collection not in rag_ingest.ALLOWED_COLLECTIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid collection. Allowed: " + ", ".join(rag_ingest.ALLOWED_COLLECTIONS),
        )
    try:
        chroma = get_chroma_client()
        try:
            collection = chroma.get_collection(req.collection)
        except Exception:
            raise HTTPException(
                status_code=404, detail="Collection '" + req.collection + "' not found"
            )
        live_count = collection.count()
        if req.confirm_count != live_count:
            raise HTTPException(
                status_code=409,
                detail="confirm_count (" + str(req.confirm_count) + ") does not match live "
                "chunk count (" + str(live_count) + "). Refresh and retry.",
            )
        chroma.delete_collection(req.collection)
        return {"status": "reset", "collection": req.collection, "deleted_chunks": live_count}
    except HTTPException:
        raise
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


# --- Hybrid search (exact-id boost + rerank, via rag_retrieval) ---

_HYBRID_ALLOWED_COLLECTIONS = {"aegis_corpus", "aegis_bibliography", "medical_rag"}


def _hit_from_item(item: dict, collection_source: str) -> dict:
    """Map a rag_retrieval.hybrid_search item into the rich hit shape."""
    meta = item.get("metadata") or {}
    source = (
        meta.get("source") or meta.get("filename") or meta.get("paper_id")
        or meta.get("file") or "unknown"
    )
    dist = item.get("distance")
    return {
        "id": item.get("id"),
        "source": source,
        "title": meta.get("title") or meta.get("name"),
        "paper_id": meta.get("paper_id") or meta.get("p_id"),
        "year": meta.get("year") or meta.get("date"),
        "delta_layer": meta.get("delta_layer") or meta.get("target_delta"),
        "distance": dist,
        "similarity": (1.0 - dist) if dist is not None else None,
        "content": item.get("document") or "",
        "content_length": item.get("document_len"),
        "match": item.get("match", "dense"),
        "rrf_score": item.get("rrf_score"),
        "rerank_score": item.get("rerank_score"),
        "collection_source": collection_source,
    }


@router.post("/api/rag/hybrid-search")
async def hybrid_search_endpoint(req: HybridSearchRequest, request: Request):
    """Hybrid RAG search: dense + exact-identifier boost + optional rerank.

    Backed by backend.rag_retrieval.hybrid_search. Unlike /api/rag/semantic-search
    (raw dense, single collection, wiki widget), this endpoint fuses an exact-id
    ($contains) pass so queries naming a P-ID / arXiv / F/G/D id surface the right
    chunk, reranks the fused pool when the cross-encoder is available, and can span
    aegis_corpus + aegis_bibliography at once (multi=true).

    Rate limited (shared 20 req/min/IP limiter). Query/limit/collection validated.
    """
    client_ip = (
        request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        or (request.client.host if request.client else "unknown")
    )
    allowed, _ = _semantic_search_limiter.check(client_ip)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded: 20 requests per minute per IP. Please slow down.",
            headers={"Retry-After": "60"},
        )
    _semantic_search_limiter.cleanup()

    if req.multi:
        collections = ["aegis_corpus", "aegis_bibliography"]
    else:
        if req.collection not in _HYBRID_ALLOWED_COLLECTIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid collection. Allowed: {sorted(_HYBRID_ALLOWED_COLLECTIONS)}",
            )
        collections = [req.collection]

    try:
        import rag_retrieval

        chroma = get_chroma_client()
        limit = max(1, min(req.limit, 50))
        merged = []
        errors = []
        for coll_name in collections:
            try:
                collection = chroma.get_collection(coll_name)
            except Exception as exc:
                errors.append({"collection": coll_name, "error": str(exc)})
                continue
            items = rag_retrieval.hybrid_search(
                collection, [req.query], n_results=limit,
                doc_type_filter=req.doc_type, snippet_chars=20000,
            )
            for it in items:
                merged.append(_hit_from_item(it, coll_name))

        def _order(h):
            if h.get("rerank_score") is not None:
                return (0, -h["rerank_score"])
            return (1, -(h.get("rrf_score") or 0.0))

        merged.sort(key=_order)

        return {
            "query": req.query,
            "collections": collections,
            "total_hits": len(merged),
            "reranker": rag_retrieval.reranker_status(),
            "errors": errors or None,
            "hits": merged[:limit],
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
