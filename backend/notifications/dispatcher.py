"""Async multi-channel notification dispatch (Telegram, Discord, webhook).

Pure HTTP via httpx — no external CLI and no tmux (unlike OMC's CLI workers).
Every enabled channel fires concurrently under a global timeout; a failure in
one channel is isolated and never blocks the others. When no channel is
configured or dry_run is set, messages are logged instead of sent, so callers
can invoke notify() unconditionally without guarding on configuration.
"""
from __future__ import annotations

import asyncio
import logging
import re
from dataclasses import dataclass

import httpx

from .config import NotifyConfig, load_config
from .events import Event, Severity, SEVERITY_ORDER, severity_of

logger = logging.getLogger("aegis.notifications")

# Defence-in-depth: never leak a credential into an outbound notification.
_SECRET_RE = re.compile(
    r"(gsk_[A-Za-z0-9]{20,}"
    r"|sk-[A-Za-z0-9]{20,}"
    r"|Bearer\s+[A-Za-z0-9._\-]{10,}"
    r"|api[_-]?key\s*[=:]\s*\S+)",
    re.IGNORECASE,
)

_DISCORD_MAX = 1900  # Discord content hard limit is 2000; leave headroom.


@dataclass
class DispatchResult:
    channel: str
    ok: bool
    detail: str = ""


def _redact(text: str) -> str:
    return _SECRET_RE.sub("[REDACTED]", text)


def _should_send(event: Event, cfg: NotifyConfig) -> bool:
    valid = {s.value for s in Severity}
    min_sev = Severity(cfg.min_severity) if cfg.min_severity in valid else Severity.INFO
    return SEVERITY_ORDER[severity_of(event)] >= SEVERITY_ORDER[min_sev]


def _format(event: Event, title: str, body: str) -> tuple[str, str]:
    sev = severity_of(event).value.upper()
    subject = "[AEGIS][" + sev + "] " + title
    text = subject + "\n\n" + body if body else subject
    return _redact(subject), _redact(text)


async def _send_telegram(client: httpx.AsyncClient, cfg: NotifyConfig, text: str) -> DispatchResult:
    url = "https://api.telegram.org/bot" + cfg.telegram_token + "/sendMessage"
    r = await client.post(url, json={"chat_id": cfg.telegram_chat_id, "text": text})
    ok = r.status_code == 200
    return DispatchResult("telegram", ok, "" if ok else "HTTP " + str(r.status_code))


async def _send_discord(client: httpx.AsyncClient, cfg: NotifyConfig, text: str) -> DispatchResult:
    r = await client.post(cfg.discord_webhook, json={"content": text[:_DISCORD_MAX]})
    ok = r.status_code in (200, 204)
    return DispatchResult("discord", ok, "" if ok else "HTTP " + str(r.status_code))


async def _send_webhook(
    client: httpx.AsyncClient, cfg: NotifyConfig, subject: str, text: str, event: Event
) -> DispatchResult:
    payload = {"event": event.value, "subject": subject, "text": text}
    r = await client.post(cfg.generic_webhook, json=payload)
    ok = 200 <= r.status_code < 300
    return DispatchResult("webhook", ok, "" if ok else "HTTP " + str(r.status_code))


async def dispatch_async(
    event: Event, title: str, body: str = "", cfg: NotifyConfig | None = None
) -> list:
    """Send one notification across all enabled channels; never raises.

    Returns a list of DispatchResult (one per channel attempted), or a single
    "log" result when running in dry-run / no-channel mode.
    """
    cfg = cfg or load_config()
    subject, text = _format(event, title, body)

    if not _should_send(event, cfg):
        logger.info("notify skipped (below min severity): %s", subject)
        return []

    if cfg.dry_run or not cfg.any_channel:
        reason = "dry_run" if cfg.dry_run else "no channel configured"
        logger.info("notify (%s): %s", reason, subject)
        return [DispatchResult("log", True, reason)]

    results: list = []
    async with httpx.AsyncClient(timeout=cfg.timeout_s) as client:
        tasks = []
        if cfg.telegram_enabled:
            tasks.append(_send_telegram(client, cfg, text))
        if cfg.discord_enabled:
            tasks.append(_send_discord(client, cfg, text))
        if cfg.webhook_enabled:
            tasks.append(_send_webhook(client, cfg, subject, text, event))
        for res in await asyncio.gather(*tasks, return_exceptions=True):
            if isinstance(res, Exception):
                logger.warning("notify channel error: %s", res)
                results.append(DispatchResult("unknown", False, str(res)))
            else:
                results.append(res)
    return results
