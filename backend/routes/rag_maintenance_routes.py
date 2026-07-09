"""RAG maintenance routes — integrity check and document re-indexing.

Endpoints:
    POST /api/rag/integrity   — per-document chunk counts, flag docs below a min
    POST /api/rag/reindex     — re-chunk + upsert a document from its persisted
                                upload file (700-char chunks, current metadata)

Kept in a dedicated router so backend/routes/rag_routes.py stays focused on CRUD
and search (file-size rule, .claude/rules/programming.md). Backed by
backend.rag_ingest for all ingestion / counting logic.
"""

import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

import chromadb

import rag_ingest

router = APIRouter()

CHROMA_HOST = os.getenv("CHROMA_HOST", "localhost")
CHROMA_PORT = int(os.getenv("CHROMA_PORT", "8000"))


def get_chroma_client():
    try:
        return chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
    except Exception:
        return chromadb.PersistentClient(path="./chroma_db")


class IntegrityRequest(BaseModel):
    collection: str = Field(default="aegis_corpus", max_length=64)
    min_chunks: int = Field(default=3, ge=1, le=100)


class ReindexRequest(BaseModel):
    collection: str = Field(default="aegis_corpus", max_length=64)
    source: str = Field(..., min_length=1, max_length=256)


def _validated_collection(name: str):
    if name not in rag_ingest.ALLOWED_COLLECTIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid collection. Allowed: " + ", ".join(rag_ingest.ALLOWED_COLLECTIONS),
        )


@router.post("/api/rag/integrity")
async def rag_integrity(req: IntegrityRequest):
    """Per-document chunk counts for a collection, flagging docs below min_chunks."""
    _validated_collection(req.collection)
    try:
        chroma = get_chroma_client()
        try:
            collection = chroma.get_collection(req.collection)
        except Exception:
            raise HTTPException(
                status_code=404, detail="Collection '" + req.collection + "' not found"
            )
        report = rag_ingest.integrity_report(collection, req.min_chunks)
        report["collection"] = req.collection
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/rag/reindex")
async def rag_reindex(req: ReindexRequest):
    """Re-chunk + upsert a document from its persisted upload file.

    Only documents uploaded through the UI have a persisted file. A document
    ingested via another pipeline (e.g. the bibliography maintainer) has no source
    file here; the endpoint returns 404 with a clear "re-upload required" message
    rather than silently doing nothing.
    """
    _validated_collection(req.collection)
    source = os.path.basename(req.source)
    path = rag_ingest.upload_path(req.collection, source)
    if not path.is_file():
        raise HTTPException(
            status_code=404,
            detail="No persisted source file for '" + source
            + "'. Re-upload the document to re-index it.",
        )
    doc_type = os.path.splitext(source)[1].lower().lstrip(".") or "txt"
    try:
        chroma = get_chroma_client()
        collection = chroma.get_or_create_collection(req.collection)
        result = rag_ingest.ingest_file(collection, str(path), source, doc_type)
        result["status"] = "reindexed"
        result["collection"] = req.collection
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
