"""
internal_ai_engine.py — INTERNAL-AI engine for the lab: the internal chat models,
each at its own OpenAI-compatible base_url, selectable at runtime (a dropdown in
the navbar). Mirrors the simulator's AI-engine selection, lab-side.

Config comes from the gitignored internal-AI config mounted at
/app/internal_ai_config.local.json (single source of truth, per-model endpoints);
the key is INTERNAL_AI_API_KEY. The current selection is persisted to a small
gitignored JSON so it survives reloads. Nothing here is committed.
"""

from __future__ import annotations

import json
import os
import threading
from pathlib import Path

_CONFIG_PATH = Path(os.environ.get("INTERNAL_AI_CONFIG", "/app/internal_ai_config.local.json"))
_SELECTION_PATH = Path(os.environ.get("INTERNAL_AI_SELECTION", "/app/internal_ai_selection.json"))
_lock = threading.RLock()
_selected_model: str | None = None


def _load_config() -> dict:
    try:
        data = json.loads(_CONFIG_PATH.read_text(encoding="utf-8"))
        return data.get("providers", {}).get("internal_ai", {})
    except (OSError, json.JSONDecodeError):
        return {}


def enabled() -> bool:
    """INTERNAL-AI is usable when the config is present and a key is set."""
    return bool(os.environ.get("INTERNAL_AI_API_KEY")) and bool(_load_config().get("endpoints"))


def models() -> list:
    """The chat models INTERNAL-AI serves (for the dropdown)."""
    return list(_load_config().get("models", []))


def default_model() -> str:
    sky = _load_config()
    return sky.get("default_model") or (sky.get("models") or [""])[0]


def _load_selection() -> str | None:
    try:
        return json.loads(_SELECTION_PATH.read_text(encoding="utf-8")).get("model")
    except (OSError, json.JSONDecodeError):
        return None


def selected_model() -> str:
    global _selected_model
    with _lock:
        if _selected_model is None:
            _selected_model = _load_selection() or default_model()
        return _selected_model


def select_model(model: str) -> str:
    """Set the active INTERNAL-AI model (must be one served); persist it."""
    global _selected_model
    with _lock:
        if model not in models():
            raise ValueError(f"Modèle INTERNAL-AI inconnu : {model}")
        _selected_model = model
        try:
            _SELECTION_PATH.write_text(json.dumps({"model": model}), encoding="utf-8")
        except OSError:
            pass
        return model


def resolve(model: str | None = None) -> dict | None:
    """``{litellm_model, api_base, api_key}`` for a INTERNAL-AI model (default: the
    selected one), or None when INTERNAL-AI is unavailable. ``litellm_model`` carries
    the doubled ``openai/`` prefix so litellm strips one and sends the exact id."""
    if not enabled():
        return None
    sky = _load_config()
    m = model or selected_model()
    base_url = (sky.get("endpoints") or {}).get(m)
    key = os.environ.get("INTERNAL_AI_API_KEY")
    if not base_url or not key:
        return None
    return {"litellm_model": f"openai/{m}", "api_base": base_url, "api_key": key, "model": m}
