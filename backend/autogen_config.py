"""Configuration AutoGen (AG2) pour Ollama local."""
import os

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")

# Modèles disponibles via Ollama
MEDICAL_MODEL = os.getenv("MEDICAL_MODEL", "llama3.2:latest")
CYBER_MODEL = os.getenv("CYBER_MODEL", "saki007ster/CybersecurityRiskAnalyst:latest")


def get_ollama_config(model: str) -> dict:
    """Retourne la config OAI-compatible pour un modèle Ollama."""
    return {
        "model": model,
        "base_url": f"{OLLAMA_HOST}/v1",
        "api_key": "ollama",
        "price": [0, 0],
    }


def get_llm_config(model: str) -> dict:
    """Retourne la llm_config complète pour un ConversableAgent AG2."""
    return {
        "config_list": [get_ollama_config(model)],
        "temperature": 0.7,
        "timeout": 120,
    }
