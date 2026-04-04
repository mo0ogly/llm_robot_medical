"""
Tests for LLM Providers Routes
Tests the multi-LLM testing interface (PromptForge) backend endpoints.
"""

import pytest
import json
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from pathlib import Path
import sys

# Add backend to path
backend_path = Path(__file__).parent.parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from server import app
from routes.llm_providers_routes import (
    validate_provider_exists,
    get_enabled_providers,
    load_provider_config,
)


@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)


@pytest.fixture
def mock_config():
    """Mock LLM provider configuration."""
    return {
        "providers": {
            "ollama": {
                "type": "local",
                "enabled": True,
                "host": "http://127.0.0.1:11434",
                "models": ["llama3.2:latest"],
                "default_model": "llama3.2:latest",
                "auth": None,
            },
            "openai": {
                "type": "cloud",
                "enabled": False,
                "endpoint": "https://api.openai.com/v1",
                "models": ["gpt-4o"],
                "default_model": "gpt-4o",
                "auth": {
                    "api_key_env": "OPENAI_API_KEY",
                    "header": "Authorization",
                    "prefix": "Bearer",
                },
            },
            "anthropic": {
                "type": "cloud",
                "enabled": False,
                "endpoint": "https://api.anthropic.com/v1",
                "models": ["claude-opus-4-6"],
                "default_model": "claude-opus-4-6",
                "auth": {
                    "api_key_env": "ANTHROPIC_API_KEY",
                    "header": "x-api-key",
                },
            },
        }
    }


# ===== TEST 1: validate_provider_exists =====
def test_validate_provider_exists_true(mock_config):
    """Test that validate_provider_exists returns True for existing provider."""
    assert validate_provider_exists(mock_config, "ollama") is True
    assert validate_provider_exists(mock_config, "openai") is True


def test_validate_provider_exists_false(mock_config):
    """Test that validate_provider_exists returns False for missing provider."""
    assert validate_provider_exists(mock_config, "nonexistent") is False
    assert validate_provider_exists(mock_config, "groq") is False


# ===== TEST 2: get_enabled_providers =====
def test_get_enabled_providers(mock_config):
    """Test that get_enabled_providers returns only enabled providers."""
    enabled = get_enabled_providers(mock_config)
    assert len(enabled) == 1
    assert "ollama" in enabled
    assert "openai" not in enabled
    assert "anthropic" not in enabled


# ===== TEST 3: GET /llm-providers endpoint =====
@pytest.mark.asyncio
async def test_list_llm_providers(client, mock_config):
    """Test GET /llm-providers returns list of providers."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        response = client.get("/api/redteam/llm-providers")
        assert response.status_code == 200
        data = response.json()
        assert "providers" in data
        assert "total" in data
        assert "timestamp" in data


# ===== TEST 4: GET /llm-providers/{provider}/models =====
@pytest.mark.asyncio
async def test_get_provider_models_success(client, mock_config):
    """Test GET /llm-providers/{provider}/models returns model list."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        response = client.get("/api/redteam/llm-providers/ollama/models")
        assert response.status_code == 200
        data = response.json()
        assert data["provider"] == "ollama"
        assert "models" in data
        assert "llama3.2:latest" in data["models"]


@pytest.mark.asyncio
async def test_get_provider_models_not_found(client, mock_config):
    """Test GET /llm-providers/{provider}/models returns 404 for nonexistent provider."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        response = client.get("/api/redteam/llm-providers/nonexistent/models")
        assert response.status_code == 404


# ===== TEST 5: GET /llm-providers/{provider}/status =====
@pytest.mark.asyncio
async def test_get_provider_status_success(client, mock_config):
    """Test GET /llm-providers/{provider}/status returns health status."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        with patch("routes.llm_providers_routes.test_provider_health") as mock_health:
            mock_health.return_value = (True, "OK")
            response = client.get("/api/redteam/llm-providers/ollama/status")
            assert response.status_code == 200
            data = response.json()
            assert data["provider"] == "ollama"
            assert "status" in data
            assert "latency_ms" in data


@pytest.mark.asyncio
async def test_get_provider_status_not_found(client, mock_config):
    """Test GET /llm-providers/{provider}/status returns 404 for nonexistent provider."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        response = client.get("/api/redteam/llm-providers/nonexistent/status")
        assert response.status_code == 404


# ===== TEST 6: POST /llm-test endpoint (single provider) =====
@pytest.mark.asyncio
async def test_llm_test_single_provider_success(client, mock_config):
    """Test POST /llm-test streams response from single provider."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        with patch("routes.llm_providers_routes.stream_llm") as mock_stream:
            # Mock the stream_llm async generator
            async def mock_stream_gen(*args, **kwargs):
                yield "Hello "
                yield "World"

            mock_stream.return_value = mock_stream_gen()

            payload = {
                "provider": "ollama",
                "model": "llama3.2:latest",
                "prompt": "Say hello",
                "temperature": 0.7,
                "max_tokens": 1024,
            }
            response = client.post("/api/redteam/llm-test", json=payload)
            assert response.status_code == 200
            assert "text/event-stream" in response.headers["content-type"]


@pytest.mark.asyncio
async def test_llm_test_disabled_provider(client, mock_config):
    """Test POST /llm-test returns 400 for disabled provider."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        payload = {
            "provider": "openai",  # disabled in mock_config
            "model": "gpt-4o",
            "prompt": "Test",
            "temperature": 0.7,
            "max_tokens": 1024,
        }
        response = client.post("/api/redteam/llm-test", json=payload)
        assert response.status_code == 400


# ===== TEST 7: POST /llm-compare endpoint (multiple providers) =====
@pytest.mark.asyncio
async def test_llm_compare_multiple_providers(client, mock_config):
    """Test POST /llm-compare tests multiple providers in parallel."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        with patch("routes.llm_providers_routes.call_llm") as mock_call:
            mock_call.return_value = "Response from provider"

            payload = {
                "prompt": "Test prompt",
                "temperature": 0.7,
                "max_tokens": 1024,
            }
            response = client.post("/api/redteam/llm-compare", json=payload)
            assert response.status_code == 200
            data = response.json()
            assert "results" in data
            assert "timestamp" in data


@pytest.mark.asyncio
async def test_llm_compare_invalid_provider(client, mock_config):
    """Test POST /llm-compare returns 404 for invalid provider."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        payload = {
            "prompt": "Test",
            "providers": ["nonexistent"],
            "temperature": 0.7,
            "max_tokens": 1024,
        }
        response = client.post("/api/redteam/llm-compare", json=payload)
        assert response.status_code == 404


# ===== TEST 8: GET /llm-providers/{provider}/config =====
@pytest.mark.asyncio
async def test_get_provider_config(client, mock_config):
    """Test GET /llm-providers/{provider}/config returns provider configuration."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        response = client.get("/api/redteam/llm-providers/ollama/config")
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "local"
        assert data["enabled"] is True


# ===== TEST 9: PUT /llm-providers/{provider}/config =====
@pytest.mark.asyncio
async def test_update_provider_config(client, mock_config):
    """Test PUT /llm-providers/{provider}/config updates configuration."""
    with patch("routes.llm_providers_routes.load_provider_config", return_value=mock_config):
        payload = {"enabled": False, "timeout_seconds": 30}
        response = client.put(
            "/api/redteam/llm-providers/ollama/config",
            json=payload,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "updated"
        assert data["provider"] == "ollama"


# ===== TEST 10: Error handling and edge cases =====
@pytest.mark.asyncio
async def test_load_provider_config_fallback():
    """Test load_provider_config returns default on missing file."""
    with patch("builtins.open", side_effect=FileNotFoundError):
        config = load_provider_config()
        assert config.get("providers") == {}


@pytest.mark.asyncio
async def test_invalid_json_config():
    """Test load_provider_config handles invalid JSON."""
    with patch("builtins.open", return_value=MagicMock()):
        with patch("json.load", side_effect=json.JSONDecodeError("msg", "doc", 0)):
            config = load_provider_config()
            assert config.get("providers") == {}
