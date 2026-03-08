from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_api_content():
    response = client.get("/api/content")
    assert response.status_code == 200
    data = response.json()
    assert "situation" in data
    assert "record_safe" in data
    assert "record_hacked" in data
    assert "record_poison" in data
