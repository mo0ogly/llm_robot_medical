"""In-memory telemetry event bus for the AEGIS Red Team Lab.

Provides a singleton async bus that collects events emitted by the
Orchestrator, agents, and other backend components. SSE consumers
(e.g. /api/redteam/telemetry/stream) subscribe via async generators.

Architecture:
    emit(event)  -->  _buffer (deque, capped)
                 -->  broadcast to all active subscriber queues
"""

import asyncio
import time
from collections import deque
from typing import Any

MAX_BUFFER = 500  # keep last N events in memory for late-joining clients


class TelemetryBus:
    """Async event bus with fan-out to SSE subscribers."""

    def __init__(self, max_buffer: int = MAX_BUFFER):
        self._buffer: deque = deque(maxlen=max_buffer)
        self._subscribers: list[asyncio.Queue] = []

    async def emit(self, event: dict[str, Any]) -> None:
        """Publish an event to all subscribers and the replay buffer."""
        event.setdefault("ts", time.time())
        self._buffer.append(event)
        dead: list[asyncio.Queue] = []
        for q in self._subscribers:
            try:
                q.put_nowait(event)
            except asyncio.QueueFull:
                dead.append(q)
        for q in dead:
            self._subscribers.remove(q)

    def emit_sync(self, event: dict[str, Any]) -> None:
        """Fire-and-forget from synchronous code (schedules on the loop)."""
        event.setdefault("ts", time.time())
        self._buffer.append(event)
        for q in list(self._subscribers):
            try:
                q.put_nowait(event)
            except asyncio.QueueFull:
                self._subscribers.remove(q)

    async def subscribe(self, replay: bool = True):
        """Async generator yielding events. Replays buffer first if requested."""
        q: asyncio.Queue = asyncio.Queue(maxsize=200)
        self._subscribers.append(q)
        try:
            if replay:
                for ev in list(self._buffer):
                    yield ev
            while True:
                ev = await q.get()
                yield ev
        finally:
            if q in self._subscribers:
                self._subscribers.remove(q)

    def snapshot(self) -> list[dict]:
        """Return current buffer as a list (for /api/redteam/telemetry GET)."""
        return list(self._buffer)


# Singleton instance used across the backend
telemetry_bus = TelemetryBus()
