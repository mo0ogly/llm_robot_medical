from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_api_content_returns_expected_payloads():
    response = client.get("/api/content")
    assert response.status_code == 200
    data = response.json()
    assert "situation" in data
    assert "record_safe" in data
    assert "record_hacked" in data
    assert "record_poison" in data

    # Verifying specific payloads content
    assert "850g" in data["record_poison"] or "850 grammes" in data["record_poison"]
    assert "freeze_instruments" in data["record_hacked"]

def test_ai_query_tool_call_mock():
    # We send a test query, expecting the streaming endpoint to at least parse and run.
    # Since we don't have ollama necessarily running during CI/CD, we check if the endpoint
    # handles the request cleanly (status 200 and stream connection).
    # Actual testing of the tool call parsing is usually unit tested against the `parse_ollama_stream` function directly, 
    # but that's an inner function. We can test the start of the stream here.
    payload = {
        "patient_record": "Simulated Medical Record with no attack.",
        "situation": "Surgeon asking a question"
    }

    # For streaming, we can use `stream=True` but TestClient will buffer or give us a generator.
    with client.stream("POST", "/api/query/stream", json=payload) as response:
        assert response.status_code == 200
        # Given that Ollama might be down, the server is built to fail gracefully or hang waiting.
        # We'll just verify the endpoint accepts the params and returns a 200 OK headers.
