"""RAG / ChromaDB document management and seed-rag routes.

Endpoints:
    GET    /api/rag/documents
    GET    /api/rag/documents/{filename}/chunks
    POST   /api/rag/upload
    DELETE /api/rag/documents/{filename}
    POST   /api/rag/reset
    POST   /api/redteam/seed-rag
    GET    /api/redteam/seed-rag/check/{scenario_id}
"""

import os
import shutil

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

import chromadb
from pypdf import PdfReader

router = APIRouter()


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
    """Request body for the wiki semantic search endpoint."""
    query: str
    collection: str = "aegis_bibliography"
    limit: int = 10
    min_distance: float = 0.0
    max_distance: float = 2.0


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
    """Return chunks for a specific document with content preview."""
    try:
        chroma = get_chroma_client()
        collection = chroma.get_or_create_collection("aegis_corpus")

        results = collection.get(
            where={"source": filename},
            include=["documents", "metadatas", "embeddings"],
        )

        chunks = []
        for i, doc_id in enumerate(results["ids"]):
            text = results["documents"][i] if results["documents"] else ""
            meta = results["metadatas"][i] if results["metadatas"] else {}
            has_embedding = bool(
                results.get("embeddings") and results["embeddings"][i]
            )
            chunks.append({
                "id": doc_id,
                "content": text[:500],
                "length": len(text),
                "metadata": meta,
                "has_embedding": has_embedding,
            })
            if len(chunks) >= limit:
                break

        return {
            "filename": filename,
            "total_chunks": len(results["ids"]),
            "chunks": chunks,
        }
    except Exception as e:
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
async def semantic_search(req: SemanticSearchRequest):
    """Semantic search across ChromaDB collections for the wiki widget.

    Queries the specified collection (default: aegis_bibliography, 130 papers)
    using cosine similarity on sentence-transformers embeddings. Returns the
    top-K chunks with distance, source metadata, and content preview.

    This endpoint is the live backend for the wiki semantic search widget at
    /semantic-search/ — every paper ingested via the bibliography-maintainer
    pipeline becomes immediately searchable here with zero rebuild required.
    """
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

            content_preview = (doc or "")[:400]

            hits.append({
                "id": doc_id,
                "source": source,
                "title": title,
                "paper_id": paper_id,
                "year": year,
                "delta_layer": delta_layer,
                "distance": dist,
                "similarity": (1.0 - dist) if dist is not None else None,
                "content_preview": content_preview,
                "content_length": len(doc or ""),
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
