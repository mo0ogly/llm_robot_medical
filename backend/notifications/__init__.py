"""AEGIS notifications — ping the operator on long-running research events.

Public API:
    from backend.notifications import notify, Event
    notify(Event.CAMPAIGN_COMPLETE, "Campaign G-058 done", "ASR 12.3% (N=100)")

Ported natively from oh-my-claudecode `src/notifications/` (Telegram/Discord/
webhook dispatch), re-implemented in Python/httpx for the AEGIS backend with no
external CLI and no tmux dependency.
"""
from __future__ import annotations

import asyncio
import logging

from .config import NotifyConfig, load_config
from .dispatcher import DispatchResult, dispatch_async
from .events import Event, Severity, event_for_signal, severity_of

__all__ = [
    "notify",
    "dispatch_async",
    "Event",
    "Severity",
    "NotifyConfig",
    "load_config",
    "event_for_signal",
    "severity_of",
    "DispatchResult",
]

logger = logging.getLogger("aegis.notifications")


def notify(event: Event, title: str, body: str = "", cfg: NotifyConfig | None = None) -> list:
    """Synchronous wrapper around dispatch_async — safe from non-async code.

    Returns the per-channel DispatchResult list. Never raises on channel
    failure (failures are logged and reflected in the results). If called from
    inside a running event loop (e.g. a FastAPI handler), the work is offloaded
    to a worker thread to avoid "event loop already running".
    """
    try:
        asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(dispatch_async(event, title, body, cfg))

    import concurrent.futures

    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as ex:
        return ex.submit(lambda: asyncio.run(dispatch_async(event, title, body, cfg))).result()
