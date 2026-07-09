"""
rag_retrieval.py — Shared retrieval quality layer for the AEGIS internal RAG.

Lifts the knowledge RAG (aegis_corpus + aegis_bibliography) above raw dense
cosine search, which is weak for a curated doctoral corpus:

  1. Exact-identifier boosting. A query mentioning a corpus id (P099), an arXiv id
     (2404.01833), a formula id (F44), a gap id (G-041) or a discovery id (D-024)
     triggers a ChromaDB ``where_document={"$contains": ...}`` pass whose hits are
     fused to the top. Fixes the exact-lookup misses documented in the dedup and
     fulltext RETEX (a stale MANIFEST / an abstract paraphrase slipping through
     because dense embeddings do not encode identifier strings).

  2. Reciprocal Rank Fusion (RRF) of the dense and exact-id rank lists — the same
     fusion already proven in the ``rag_fusion`` attack chain.

  3. Optional cross-encoder reranking (multilingual FR/EN) with graceful fallback.
     If the reranker model cannot be loaded (offline, or the mitmproxy/TLS proxy
     blocks the HuggingFace download), retrieval degrades to the fused order
     instead of raising — the exact-id and truncation gains still land.

  4. Configurable snippet length, replacing the hard 500-char truncation that
     starved fulltext verification.

The functions are pure and operate on a caller-provided ChromaDB collection, so
both the skill CLI (query_chromadb.py) and the backend API can share one
implementation. No new hard dependency is introduced: BM25 over the full corpus
is intentionally NOT used here (its recall gain is marginal on a curated corpus
and it needs an extra package); the exact-id ``$contains`` pass covers the real
identifier-lookup pain. Full-corpus lexical fusion remains a documented future
lever.
"""

from __future__ import annotations

import os
import re

# ---------------------------------------------------------------------------
# Exact-identifier extraction
# ---------------------------------------------------------------------------

# Distinctive AEGIS / arXiv identifier shapes. Deliberately NOT matching bare
# "C1"/"C7" conjecture ids — too short, they would $contains-match "IC1", "C10",
# etc. and pollute results.
_ID_PATTERNS = [
    re.compile(r"\bP\d{3}\b"),                      # corpus paper ids P001-P999
    re.compile(r"\bF\d{2}\b"),                      # formula ids F01-F72
    re.compile(r"\bG-\d{2,3}\b"),                   # gap ids G-041
    re.compile(r"\bD-\d{3}\b"),                     # discovery ids D-024
    re.compile(r"\barXiv:\d{4}\.\d{4,5}\b", re.IGNORECASE),  # arXiv:2404.01833
    re.compile(r"\b\d{4}\.\d{4,5}\b"),              # bare arxiv id 2404.01833
]


def extract_identifiers(text: str) -> list[str]:
    """Return the distinctive identifier tokens found in *text*, order-preserving.

    An ``arXiv:XXXX.XXXXX`` match is normalised to the bare ``XXXX.XXXXX`` needle
    so the ``$contains`` filter matches regardless of the ``arXiv:`` prefix used
    at ingest time.
    """
    ids: list[str] = []
    for pattern in _ID_PATTERNS:
        for match in pattern.findall(text or ""):
            token = match.split(":")[-1] if ":" in match else match
            if token not in ids:
                ids.append(token)
    return ids


# ---------------------------------------------------------------------------
# ChromaDB access helpers (client-agnostic — caller passes the collection)
# ---------------------------------------------------------------------------

def _flatten_query(res: dict) -> list[dict]:
    """Flatten a ChromaDB ``collection.query`` result into a rank list."""
    out: list[dict] = []
    if not res or not res.get("ids") or not res["ids"] or not res["ids"][0]:
        return out
    ids = res["ids"][0]
    docs = (res.get("documents") or [[None] * len(ids)])[0]
    metas = (res.get("metadatas") or [[{}] * len(ids)])[0]
    dists = (res.get("distances") or [[None] * len(ids)])[0]
    for i, doc_id in enumerate(ids):
        out.append({
            "id": doc_id,
            "document": docs[i] or "",
            "metadata": metas[i] or {},
            "distance": dists[i],
            "match": "dense",
        })
    return out


def _dense(collection, query: str, n: int, where_filter):
    try:
        res = collection.query(
            query_texts=[query],
            n_results=n,
            include=["documents", "metadatas", "distances"],
            where=where_filter,
        )
        return _flatten_query(res)
    except Exception:
        return []


def _contains(collection, token: str, n: int, where_filter):
    """Exact substring hits for *token* via ``where_document={"$contains": ...}``.

    Uses ``get`` (a pure filter, no semantic ranking) because for an identifier we
    want every chunk that literally contains it, not the semantically nearest.
    """
    try:
        kwargs = {
            "where_document": {"$contains": token},
            "include": ["documents", "metadatas"],
            "limit": n,
        }
        if where_filter:
            kwargs["where"] = where_filter
        res = collection.get(**kwargs)
        out: list[dict] = []
        for i, doc_id in enumerate(res.get("ids") or []):
            docs = res.get("documents") or []
            metas = res.get("metadatas") or []
            out.append({
                "id": doc_id,
                "document": (docs[i] if i < len(docs) else "") or "",
                "metadata": (metas[i] if i < len(metas) else {}) or {},
                "distance": None,
                "match": "exact_id:" + token,
            })
        return out
    except Exception:
        return []


# ---------------------------------------------------------------------------
# Reciprocal Rank Fusion
# ---------------------------------------------------------------------------

def _rrf(rank_lists: list[list[dict]], k: int = 60) -> list[dict]:
    """Fuse several rank lists via Reciprocal Rank Fusion (Cormack et al. 2009)."""
    scores: dict[str, float] = {}
    payload: dict[str, dict] = {}
    for lst in rank_lists:
        for rank, item in enumerate(lst):
            _id = item["id"]
            scores[_id] = scores.get(_id, 0.0) + 1.0 / (k + rank + 1)
            if _id not in payload:
                payload[_id] = dict(item)
            else:
                prev = payload[_id]
                # Merge provenance tags; keep a distance if either list had one.
                tags = set(prev.get("match", "").split("+")) | {item.get("match", "")}
                prev["match"] = "+".join(sorted(t for t in tags if t))
                if prev.get("distance") is None and item.get("distance") is not None:
                    prev["distance"] = item["distance"]
    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    result: list[dict] = []
    for _id, score in ranked:
        item = dict(payload[_id])
        item["rrf_score"] = round(score, 6)
        result.append(item)
    return result


# ---------------------------------------------------------------------------
# Cross-encoder reranker (lazy, graceful fallback)
# ---------------------------------------------------------------------------

# Small multilingual (FR/EN) cross-encoder by default (~120 MB) — far higher odds
# of a successful download than a 600 MB reranker under the mitmproxy/TLS proxy.
# Override with AEGIS_RERANKER_MODEL (e.g. BAAI/bge-reranker-v2-m3) once the model
# is cached. Disable entirely with AEGIS_RERANK=0.
_RERANKER_MODEL = os.getenv(
    "AEGIS_RERANKER_MODEL", "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1"
)
_reranker = None
_reranker_state = "unloaded"  # unloaded | ready | disabled | not_cached | failed


def _model_is_cached(model_id: str) -> bool:
    """True if *model_id* is already in the local HuggingFace cache.

    Lets the query path skip the (~20 s) torch / sentence_transformers import and
    any network attempt when the reranker is not available — critical under the
    mitmproxy/TLS proxy where the download would otherwise storm 5 SSL retries.
    The reranker auto-activates once the model is cached (download it once out of
    band, e.g. with the env_loader TLS-CA workaround).
    """
    from pathlib import Path
    cache = os.getenv("HF_HOME") or os.path.join(
        os.path.expanduser("~"), ".cache", "huggingface"
    )
    folder = "models--" + model_id.replace("/", "--")
    return (Path(cache) / "hub" / folder).is_dir()


def _load_reranker():
    global _reranker, _reranker_state
    if _reranker_state != "unloaded":
        return _reranker
    if os.getenv("AEGIS_RERANK", "1") == "0":
        _reranker_state = "disabled"
        return None
    if not _model_is_cached(_RERANKER_MODEL):
        # Not cached: do not import torch or hit the network — fail fast.
        _reranker_state = "not_cached"
        return None
    try:
        # Model is local; forbid any network fetch so a cache hit stays offline.
        os.environ.setdefault("HF_HUB_OFFLINE", "1")
        from sentence_transformers import CrossEncoder
        _reranker = CrossEncoder(_RERANKER_MODEL, max_length=512)
        _reranker_state = "ready"
    except Exception:
        _reranker = None
        _reranker_state = "failed"
    return _reranker


def reranker_status() -> dict:
    """Observability accessor — model id and current load state."""
    return {"model": _RERANKER_MODEL, "state": _reranker_state}


def rerank(query: str, candidates: list[dict], text_chars: int = 2000) -> list[dict]:
    """Re-order *candidates* by cross-encoder relevance to *query*.

    Returns *candidates* unchanged if the model cannot be loaded or scoring fails
    — the caller keeps the RRF-fused order rather than getting an error.
    """
    model = _load_reranker()
    if model is None or len(candidates) < 2:
        return candidates
    try:
        pairs = [(query, (c.get("document") or "")[:text_chars]) for c in candidates]
        scores = model.predict(pairs)
        for cand, score in zip(candidates, scores):
            cand["rerank_score"] = float(score)
        return sorted(candidates, key=lambda c: c.get("rerank_score", -1e9), reverse=True)
    except Exception:
        return candidates


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def hybrid_search(
    collection,
    queries: list[str],
    n_results: int = 5,
    doc_type_filter: str | None = None,
    overfetch: int | None = None,
    rerank_enabled: bool = True,
    snippet_chars: int = 1800,
) -> list[dict]:
    """Retrieve from a ChromaDB *collection* with hybrid ranking.

    Pipeline: dense over-fetch (per query) + exact-identifier ``$contains`` pass
    (per distinctive id in the queries) -> RRF fusion -> optional cross-encoder
    rerank -> snippet-truncated top ``n_results``.

    Each returned item carries ``rrf_score``, ``rerank_score`` (None if the
    reranker was unavailable), ``distance`` (dense cosine, None for exact-id-only
    hits), ``document_len`` (full length before truncation) and a ``match``
    provenance tag.
    """
    where_filter = {"doc_type": doc_type_filter} if doc_type_filter else None
    k = overfetch or max(20, n_results * 4)

    rank_lists: list[list[dict]] = []
    exact_tokens: list[str] = []
    for query in queries:
        rank_lists.append(_dense(collection, query, k, where_filter))
        for token in extract_identifiers(query):
            if token not in exact_tokens:
                exact_tokens.append(token)

    for token in exact_tokens:
        hits = _contains(collection, token, k, where_filter)
        if hits:
            rank_lists.append(hits)

    fused = _rrf(rank_lists)

    if rerank_enabled:
        fused = rerank(" ".join(queries), fused)

    out: list[dict] = []
    for item in fused[:n_results]:
        doc = item.get("document") or ""
        out.append({
            "id": item["id"],
            "document": doc[:snippet_chars],
            "document_len": len(doc),
            "metadata": item.get("metadata", {}),
            "distance": round(item["distance"], 4) if item.get("distance") is not None else None,
            "rrf_score": item.get("rrf_score"),
            "rerank_score": round(item["rerank_score"], 4) if item.get("rerank_score") is not None else None,
            "match": item.get("match", "dense"),
        })
    return out
