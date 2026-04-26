"""AEGIS Red Team — timeline events API.

Endpoints:
    GET /api/redteam/events/history  -> full historical list (JSON array)
    GET /api/redteam/events/stream   -> SSE, filtered telemetry_bus feed
                                        (only redteam.* channels)

These two endpoints are consumed by the frontend GlobalTimeline view.
They reuse the shared `telemetry_bus` so backend scripts publishing on
any redteam.* channel are automatically picked up — no need for a second
bus.
"""

from __future__ import annotations

import asyncio
import json
import os

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse

from telemetry_bus import telemetry_bus
from redteam_events import RAW_DIR, KNOWN_PREFIXES, list_historical_events, parse_artefact

router = APIRouter()


@router.get("/api/redteam/events/history")
async def get_events_history() -> dict:
    """Return the complete list of normalized redteam events parsed from
    research_archive/data/raw/. Oldest first."""
    events = list_historical_events()
    return {"events": events, "count": len(events)}


@router.get("/api/redteam/events/artefact/{source_file}")
async def get_events_artefact(source_file: str) -> dict:
    """Return the full raw JSON content of a single artefact file.

    Used by GlobalTimeline when the user clicks an event card: the listing
    endpoint only exposes a normalized summary, the detail view needs the
    complete aggregate/per_chain/metadata payload.

    Security:
        - `source_file` is taken from the URL and normalized via basename,
          so `../` segments are stripped.
        - The resulting filename must start with one of KNOWN_PREFIXES and
          end with `.json`, which pins access to the campaign/exp/recette
          family of artefacts only.
        - The resolved path must stay inside RAW_DIR.
    """
    safe_name = os.path.basename(source_file)
    if not safe_name.endswith(".json") or not safe_name.startswith(KNOWN_PREFIXES):
        raise HTTPException(status_code=400, detail="invalid artefact name")

    full_path = os.path.normpath(os.path.join(RAW_DIR, safe_name))
    raw_dir_norm = os.path.normpath(RAW_DIR)
    if not full_path.startswith(raw_dir_norm + os.sep) and full_path != raw_dir_norm:
        raise HTTPException(status_code=400, detail="path escapes raw dir")

    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="artefact not found")

    try:
        with open(full_path, "r", encoding="utf-8") as f:
            payload = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=500, detail=f"read error: {exc}")

    # Re-run the normalized summary so the frontend can display both the
    # richer raw payload AND the same title/message it already rendered.
    summary = parse_artefact(full_path)

    return {
        "source_file": safe_name,
        "summary": summary,
        "raw": payload,
        "size_bytes": os.path.getsize(full_path),
        "modified": os.path.getmtime(full_path),
    }


@router.get("/api/redteam/events/stream")
async def stream_events(request: Request):
    """Server-Sent Events stream of live redteam.* events.

    Filters telemetry_bus so only events whose `channel` starts with
    `redteam.` are forwarded to the client. Replays the buffer first so a
    late-joining client sees the last N events already present in memory.
    """

    async def event_generator():
        try:
            subscription = telemetry_bus.subscribe(replay=True)
            while True:
                try:
                    event = await asyncio.wait_for(
                        subscription.__anext__(), timeout=20.0
                    )
                    if await request.is_disconnected():
                        break
                    channel = event.get("channel", "") if isinstance(event, dict) else ""
                    if not isinstance(channel, str) or not channel.startswith("redteam."):
                        continue
                    yield f"data: {json.dumps(event, default=str)}\n\n"
                except asyncio.TimeoutError:
                    if await request.is_disconnected():
                        break
                    yield ": ping\n\n"
                except StopAsyncIteration:
                    break
        except asyncio.CancelledError:
            pass
        except Exception as exc:  # noqa: BLE001
            print(f"[events_routes] stream error: {exc}")

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
