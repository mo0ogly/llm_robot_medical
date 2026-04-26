"""Telemetry bus routes (Ground Truth Telemetry).

Endpoints:
    GET /api/redteam/telemetry/stream
    GET /api/redteam/telemetry
    GET /api/redteam/telemetry/health
"""

import json
import asyncio

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from telemetry_bus import telemetry_bus

router = APIRouter()


@router.get("/api/redteam/telemetry/stream")
async def stream_telemetry(request: Request):
    """SSE stream of all orchestrator / agent telemetry events."""
    async def event_generator():
        try:
            # Replay buffer and then wait for new events
            # We wrap the subscriber in a heartbeat loop
            subscription = telemetry_bus.subscribe(replay=True)
            while True:
                try:
                    # Wait for next event with a timeout for heartbeat
                    event = await asyncio.wait_for(subscription.__anext__(), timeout=20.0)
                    if await request.is_disconnected():
                        break
                    yield f"data: {json.dumps(event, default=str)}\n\n"
                except asyncio.TimeoutError:
                    # Send a heartbeat ping (comment line)
                    if await request.is_disconnected():
                        break
                    yield ": ping\n\n"
                except StopAsyncIteration:
                    break
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print(f"Telemetry stream error: {e}")

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.get("/api/redteam/telemetry")
async def get_telemetry_snapshot():
    """Return the current telemetry buffer as JSON (non-streaming)."""
    return telemetry_bus.snapshot()


@router.get("/api/redteam/telemetry/health")
async def telemetry_health():
    """Quick health check for telemetry subsystem."""
    return {
        "status": "ok",
        "buffer_size": len(telemetry_bus._buffer),
        "subscribers": len(telemetry_bus._subscribers),
    }
