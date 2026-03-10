"""Test que AG2 est installé et peut se connecter à Ollama."""
import pytest
import sys
import os

# Add backend directory to path so autogen_config is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


def test_ag2_import():
    """AG2 doit être importable."""
    from autogen import ConversableAgent, GroupChat, GroupChatManager
    assert ConversableAgent is not None
    assert GroupChat is not None
    assert GroupChatManager is not None


def test_ollama_config_valid():
    """La config OAI pour Ollama doit être bien formée."""
    from autogen_config import get_ollama_config
    config = get_ollama_config("llama3.2")
    assert config["model"] == "llama3.2"
    assert "base_url" in config
    assert "api_key" in config


def test_cyber_model_config():
    """La config pour le modèle cyber doit pointer vers le bon modèle."""
    from autogen_config import get_ollama_config
    config = get_ollama_config("saki007ster/CybersecurityRiskAnalyst")
    assert "CybersecurityRiskAnalyst" in config["model"]
