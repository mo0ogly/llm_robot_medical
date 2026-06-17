"""Notification configuration, loaded from backend/.env via env_loader.

Secrets (bot tokens, webhook URLs) live in backend/.env, never in code. When no
channel is configured, the dispatcher degrades to dry-run (logs only), so the
module is safe to ship and exercise before any secret exists.

Recognised environment keys (all optional):
    NOTIFY_TELEGRAM_TOKEN     Telegram bot token
    NOTIFY_TELEGRAM_CHAT_ID   Telegram chat id to post to
    NOTIFY_DISCORD_WEBHOOK    Discord webhook URL
    NOTIFY_WEBHOOK_URL        generic JSON webhook URL
    NOTIFY_DRY_RUN            "1"/"true" to force log-only
    NOTIFY_MIN_SEVERITY       info | warning | critical (default info)
    NOTIFY_TIMEOUT_S          per-dispatch timeout, seconds (default 15)
"""
from __future__ import annotations

import os
import sys
from dataclasses import dataclass
from pathlib import Path

# Load backend/.env regardless of launch mode (module import or `python -m`).
_BACKEND = Path(__file__).resolve().parent.parent
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))
import env_loader  # noqa: E402  (auto-loads .env + TLS guard on import)


def _bool(name: str, default: bool = False) -> bool:
    val = os.environ.get(name)
    if val is None:
        return default
    return val.strip().lower() in {"1", "true", "yes", "on"}


@dataclass
class NotifyConfig:
    telegram_token: str = ""
    telegram_chat_id: str = ""
    discord_webhook: str = ""
    generic_webhook: str = ""
    dry_run: bool = False
    min_severity: str = "info"
    timeout_s: float = 15.0

    @property
    def telegram_enabled(self) -> bool:
        return bool(self.telegram_token and self.telegram_chat_id)

    @property
    def discord_enabled(self) -> bool:
        return bool(self.discord_webhook)

    @property
    def webhook_enabled(self) -> bool:
        return bool(self.generic_webhook)

    @property
    def any_channel(self) -> bool:
        return self.telegram_enabled or self.discord_enabled or self.webhook_enabled


def load_config() -> NotifyConfig:
    """Build a NotifyConfig snapshot from the current environment."""
    # Touch env_loader so static analysers keep the import (it ran on import).
    _ = env_loader
    return NotifyConfig(
        telegram_token=os.environ.get("NOTIFY_TELEGRAM_TOKEN", "").strip(),
        telegram_chat_id=os.environ.get("NOTIFY_TELEGRAM_CHAT_ID", "").strip(),
        discord_webhook=os.environ.get("NOTIFY_DISCORD_WEBHOOK", "").strip(),
        generic_webhook=os.environ.get("NOTIFY_WEBHOOK_URL", "").strip(),
        dry_run=_bool("NOTIFY_DRY_RUN", False),
        min_severity=os.environ.get("NOTIFY_MIN_SEVERITY", "info").strip().lower(),
        timeout_s=float(os.environ.get("NOTIFY_TIMEOUT_S", "15") or "15"),
    )
