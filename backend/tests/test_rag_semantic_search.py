"""
Tests for /api/rag/semantic-search and /api/rag/collections endpoints.

Wiki semantic search backend (PDCA cycle 1 + 2):
- Live ChromaDB query via POST /api/rag/semantic-search
- Collection whitelist validation
- Query length limit (SEC-08, max 500 chars)
- Rate limiting (SEC-09, 20 req/min per IP)
- Full chunk content (no truncation, user requirement)
"""

import sys
import time
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# Add backend to path
backend_path = Path(__file__).parent.parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from server import app
from routes.rag_routes import (
    SemanticSearchRequest,
    SlidingWindowRateLimiter,
    _semantic_search_limiter,
)


@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Reset rate limiter state between tests (avoid cross-test pollution)."""
    _semantic_search_limiter._buckets.clear()
    yield
    _semantic_search_limiter._buckets.clear()


@pytest.fixture
def mock_chroma_hits():
    """Mock ChromaDB query results with 2 realistic hits."""
    return {
        "ids": [["hit_1", "hit_2"]],
        "documents": [
            [
                "HyDE (Hypothetical Document Embeddings) is a technique where the model generates a fake document to improve retrieval.",
                "Full chunk content with multiple lines.\nLine 2 with more context about Da Vinci Xi.\nLine 3 about tension limits (50-800g).",
            ]
        ],
        "metadatas": [
            [
                {
                    "source": "P117_Yoon_2025_HyDE.pdf",
                    "title": "Knowledge Leakage in HyDE",
                    "paper_id": "P117",
                    "year": "2025",
                    "delta_layer": "delta2",
                },
                {
                    "source": "fiche_attaque_29",
                    "delta_layer": "delta1",
                    "year": "2026-04-05",
                },
            ]
        ],
        "distances": [[0.32, 0.55]],
    }


def _mock_chroma_client(hits):
    """Build a fake chromadb client returning given hits."""
    fake_collection = MagicMock()
    fake_collection.query.return_value = hits
    fake_collection.count.return_value = 4700

    fake_client = MagicMock()
    fake_client.get_collection.return_value = fake_collection
    fake_client.list_collections.return_value = [
        MagicMock(name="aegis_bibliography"),
        MagicMock(name="aegis_corpus"),
    ]
    return fake_client


# ---------------------------------------------------------------------------
# SemanticSearchRequest validation (SEC-08)
# ---------------------------------------------------------------------------


class TestSemanticSearchRequestValidation:
    """Pydantic model validation — covers SEC-08 query length limit."""

    def test_valid_minimal_request(self):
        req = SemanticSearchRequest(query="HyDE")
        assert req.query == "HyDE"
        assert req.collection == "aegis_bibliography"
        assert req.limit == 10
        assert req.min_distance == 0.0
        assert req.max_distance == 2.0

    def test_empty_query_rejected(self):
        from pydantic import ValidationError
        with pytest.raises(ValidationError):
            SemanticSearchRequest(query="")

    def test_query_max_length_500(self):
        from pydantic import ValidationError
        # 500 chars OK
        SemanticSearchRequest(query="x" * 500)
        # 501 chars rejected (SEC-08)
        with pytest.raises(ValidationError):
            SemanticSearchRequest(query="x" * 501)

    def test_limit_clamped_ge_1(self):
        from pydantic import ValidationError
        with pytest.raises(ValidationError):
            SemanticSearchRequest(query="test", limit=0)

    def test_limit_clamped_le_50(self):
        from pydantic import ValidationError
        with pytest.raises(ValidationError):
            SemanticSearchRequest(query="test", limit=51)

    def test_collection_max_length_64(self):
        from pydantic import ValidationError
        # 64 chars OK
        SemanticSearchRequest(query="test", collection="a" * 64)
        # 65 chars rejected
        with pytest.raises(ValidationError):
            SemanticSearchRequest(query="test", collection="a" * 65)

    def test_distance_bounds(self):
        from pydantic import ValidationError
        SemanticSearchRequest(query="test", min_distance=0.0, max_distance=2.0)
        with pytest.raises(ValidationError):
            SemanticSearchRequest(query="test", min_distance=-0.1)
        with pytest.raises(ValidationError):
            SemanticSearchRequest(query="test", max_distance=2.1)


# ---------------------------------------------------------------------------
# Endpoint behavior (mocked ChromaDB)
# ---------------------------------------------------------------------------


class TestSemanticSearchEndpoint:
    """POST /api/rag/semantic-search behavior."""

    def test_happy_path_returns_hits(self, client, mock_chroma_hits):
        with patch("routes.rag_routes.get_chroma_client", return_value=_mock_chroma_client(mock_chroma_hits)):
            resp = client.post(
                "/api/rag/semantic-search",
                json={"query": "HyDE", "collection": "aegis_bibliography", "limit": 5},
            )
        assert resp.status_code == 200
        data = resp.json()
        assert data["query"] == "HyDE"
        assert data["collection"] == "aegis_bibliography"
        assert data["total_hits"] == 2
        assert len(data["hits"]) == 2

    def test_hit_structure_complete(self, client, mock_chroma_hits):
        with patch("routes.rag_routes.get_chroma_client", return_value=_mock_chroma_client(mock_chroma_hits)):
            resp = client.post(
                "/api/rag/semantic-search",
                json={"query": "HyDE", "collection": "aegis_bibliography"},
            )
        hit = resp.json()["hits"][0]
        # All expected fields present
        for field in (
            "id", "source", "title", "paper_id", "year", "delta_layer",
            "distance", "similarity", "content", "content_length",
        ):
            assert field in hit, f"Missing field: {field}"
        assert hit["paper_id"] == "P117"
        assert hit["delta_layer"] == "delta2"
        assert hit["distance"] == pytest.approx(0.32)
        assert hit["similarity"] == pytest.approx(0.68)

    def test_full_content_not_truncated(self, client, mock_chroma_hits):
        """PDCA cycle 2 : user explicitly wants full content (no 400-char truncation)."""
        with patch("routes.rag_routes.get_chroma_client", return_value=_mock_chroma_client(mock_chroma_hits)):
            resp = client.post(
                "/api/rag/semantic-search",
                json={"query": "HyDE", "collection": "aegis_bibliography"},
            )
        hit = resp.json()["hits"][1]  # Second hit has multi-line content
        assert "\n" in hit["content"], "Newlines should be preserved"
        assert hit["content_length"] == len(hit["content"])
        assert "Line 2" in hit["content"]
        assert "Line 3" in hit["content"]

    def test_invalid_collection_returns_400(self, client, mock_chroma_hits):
        with patch("routes.rag_routes.get_chroma_client", return_value=_mock_chroma_client(mock_chroma_hits)):
            resp = client.post(
                "/api/rag/semantic-search",
                json={"query": "test", "collection": "evil_collection"},
            )
        assert resp.status_code == 400
        assert "Invalid collection" in resp.json()["detail"]

    def test_distance_filter_applied(self, client, mock_chroma_hits):
        """Hits with distance > max_distance should be filtered out."""
        with patch("routes.rag_routes.get_chroma_client", return_value=_mock_chroma_client(mock_chroma_hits)):
            resp = client.post(
                "/api/rag/semantic-search",
                json={"query": "test", "collection": "aegis_bibliography", "max_distance": 0.4},
            )
        # Only first hit (distance 0.32) should pass, second (0.55) is filtered
        data = resp.json()
        assert len(data["hits"]) == 1
        assert data["hits"][0]["distance"] == pytest.approx(0.32)


# ---------------------------------------------------------------------------
# Rate limiting (SEC-09)
# ---------------------------------------------------------------------------


class TestSlidingWindowRateLimiter:
    """Standalone tests for the SlidingWindowRateLimiter."""

    def test_allows_within_limit(self):
        limiter = SlidingWindowRateLimiter(max_requests=5, window_seconds=60)
        for i in range(5):
            allowed, remaining = limiter.check("127.0.0.1")
            assert allowed
            assert remaining == 4 - i

    def test_blocks_beyond_limit(self):
        limiter = SlidingWindowRateLimiter(max_requests=3, window_seconds=60)
        for _ in range(3):
            assert limiter.check("127.0.0.1")[0]
        allowed, remaining = limiter.check("127.0.0.1")
        assert not allowed
        assert remaining == 0

    def test_different_ips_independent(self):
        limiter = SlidingWindowRateLimiter(max_requests=2, window_seconds=60)
        assert limiter.check("1.1.1.1")[0]
        assert limiter.check("1.1.1.1")[0]
        assert not limiter.check("1.1.1.1")[0]
        # Different IP should still be allowed
        assert limiter.check("2.2.2.2")[0]

    def test_window_sliding(self):
        """After window expires, requests should be allowed again."""
        limiter = SlidingWindowRateLimiter(max_requests=2, window_seconds=1)
        assert limiter.check("ip")[0]
        assert limiter.check("ip")[0]
        assert not limiter.check("ip")[0]
        time.sleep(1.1)
        assert limiter.check("ip")[0]

    def test_cleanup_removes_stale(self):
        limiter = SlidingWindowRateLimiter(max_requests=5, window_seconds=1)
        for i in range(5):
            limiter.check(f"ip_{i}")
        time.sleep(1.2)
        limiter.cleanup(max_buckets=0)  # Force cleanup
        assert len(limiter._buckets) == 0


class TestSemanticSearchRateLimit:
    """Rate limiting integration at the endpoint level."""

    def test_20_requests_allowed(self, client, mock_chroma_hits):
        with patch("routes.rag_routes.get_chroma_client", return_value=_mock_chroma_client(mock_chroma_hits)):
            for _ in range(20):
                resp = client.post(
                    "/api/rag/semantic-search",
                    json={"query": "test", "collection": "aegis_bibliography"},
                )
                assert resp.status_code == 200

    def test_21st_request_blocked_with_429(self, client, mock_chroma_hits):
        with patch("routes.rag_routes.get_chroma_client", return_value=_mock_chroma_client(mock_chroma_hits)):
            for _ in range(20):
                client.post(
                    "/api/rag/semantic-search",
                    json={"query": "test", "collection": "aegis_bibliography"},
                )
            # 21st request must be rejected
            resp = client.post(
                "/api/rag/semantic-search",
                json={"query": "test", "collection": "aegis_bibliography"},
            )
            assert resp.status_code == 429
            assert "Rate limit exceeded" in resp.json()["detail"]
            assert resp.headers.get("Retry-After") == "60"


# ---------------------------------------------------------------------------
# Collections endpoint
# ---------------------------------------------------------------------------


class TestCollectionsEndpoint:
    """GET /api/rag/collections — list ChromaDB collections for wiki widget."""

    def test_returns_collections_list(self, client, mock_chroma_hits):
        fake_client = _mock_chroma_client(mock_chroma_hits)
        # Make list_collections return named objects
        col1 = MagicMock()
        col1.name = "aegis_bibliography"
        col2 = MagicMock()
        col2.name = "aegis_corpus"
        fake_client.list_collections.return_value = [col1, col2]

        with patch("routes.rag_routes.get_chroma_client", return_value=fake_client):
            resp = client.get("/api/rag/collections")

        assert resp.status_code == 200
        data = resp.json()
        assert "collections" in data
        assert len(data["collections"]) == 2
        names = [c["name"] for c in data["collections"]]
        assert "aegis_bibliography" in names
        assert "aegis_corpus" in names
