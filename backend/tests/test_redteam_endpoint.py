# backend/tests/test_redteam_endpoint.py
"""Test des endpoints red-team."""
import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client():
    from server import app
    return TestClient(app)


def test_redteam_single_attack_endpoint_exists(client):
    """L'endpoint /api/redteam/attack doit exister (422 on bad input, not 404)."""
    # Send empty body to check route exists without triggering LLM call
    response = client.post("/api/redteam/attack", json={})
    # 422 = route exists but validation failed (missing fields), not 404
    assert response.status_code == 422


def test_redteam_report_endpoint_exists(client):
    """L'endpoint /api/redteam/report doit exister."""
    response = client.get("/api/redteam/report")
    assert response.status_code == 200


def test_redteam_catalog_endpoint(client):
    """L'endpoint /api/redteam/catalog doit lister les attaques."""
    response = client.get("/api/redteam/catalog")
    assert response.status_code == 200
    data = response.json()
    assert "prompt_leak" in data
    assert "rule_bypass" in data
    assert "injection" in data
