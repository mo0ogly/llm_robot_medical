"""LLM traffic logger for mitmproxy reverse mode.
 
Captures HTTP requests and SSE streamed responses between a local IDE
extension (Continue, Cline, Aider) and an OpenAI-compatible inference
server (Ollama, vLLM, llama.cpp server, LM Studio).
 
The addon writes one JSONL entry per round of communication. SSE events
are tapped chunk by chunk while the underlying stream is forwarded to
the client unchanged, so the IDE keeps its real-time experience.
 
Usage:
    mitmdump --mode reverse:http://localhost:11434 \
             -p 8888 \
             -s llm_traffic_logger.py \
             --set llm_log_path=./traffic.jsonl
 
Author: tailored for ANSSI / AEGIS research workflow.
"""
from __future__ import annotations
 
import json
import logging
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Iterator
 
from mitmproxy import ctx, http
from mitmproxy.addonmanager import Loader
 
 
logger = logging.getLogger(__name__)
 
 
@dataclass
class TrafficEntry:
    """One round trip between the IDE client and the inference server."""
 
    ts_request: float
    method: str
    path: str
    request_headers: dict[str, str]
    request_body: dict[str, Any] | str
    ts_response: float | None = None
    response_status: int | None = None
    response_headers: dict[str, str] = field(default_factory=dict)
    sse_events: list[dict[str, Any]] = field(default_factory=list)
    response_body: dict[str, Any] | str | None = None
 
 
class LLMTrafficLogger:
    """mitmproxy addon that dumps LLM traffic to a JSONL file.
 
    The addon hooks four mitmproxy events:
      - load:            register the ``llm_log_path`` option.
      - request:         snapshot the outgoing JSON payload.
      - responseheaders: detect SSE and attach a streaming tap.
      - response:        finalize the entry and append it to disk.
 
    SSE streams are tapped via ``flow.response.stream`` so that bytes
    reach the client without buffering, while each event is parsed and
    stored for offline analysis.
    """
 
    HEADERS_TO_REDACT: tuple[str, ...] = (
        "authorization",
        "x-api-key",
        "anthropic-api-key",
        "openai-api-key",
    )
 
    def __init__(self) -> None:
        self._entries: dict[int, TrafficEntry] = {}
        self._output_path: Path | None = None
 
    def load(self, loader: Loader) -> None:
        """Register the custom mitmproxy CLI option."""
        loader.add_option(
            name="llm_log_path",
            typespec=str,
            default="./traffic.jsonl",
            help="Path to the JSONL traffic dump file.",
        )
 
    def configure(self, updates: set[str]) -> None:
        """Resolve the output path when options change or on first load."""
        if "llm_log_path" in updates or self._output_path is None:
            self._output_path = Path(ctx.options.llm_log_path).resolve()
            self._output_path.parent.mkdir(parents=True, exist_ok=True)
            logger.info("LLM traffic will be logged to %s", self._output_path)
 
    def request(self, flow: http.HTTPFlow) -> None:
        """Capture the outgoing request before it is forwarded upstream."""
        try:
            body: dict[str, Any] | str = json.loads(flow.request.get_text() or "{}")
        except json.JSONDecodeError:
            body = flow.request.get_text() or ""
        entry = TrafficEntry(
            ts_request=time.time(),
            method=flow.request.method,
            path=flow.request.path,
            request_headers=self._redact_headers(dict(flow.request.headers)),
            request_body=body,
        )
        self._entries[id(flow)] = entry
        logger.debug("Captured request %s %s", flow.request.method, flow.request.path)
 
    def responseheaders(self, flow: http.HTTPFlow) -> None:
        """Switch to streaming mode for SSE responses, tapping each chunk."""
        if flow.response is None:
            return
        content_type = flow.response.headers.get("content-type", "")
        if content_type.startswith("text/event-stream"):
            flow.response.stream = lambda chunks: self._tap_sse(flow, chunks)
            logger.debug("SSE detected on %s, attaching tap", flow.request.path)
 
    def response(self, flow: http.HTTPFlow) -> None:
        """Finalize the entry and append it to the JSONL dump."""
        entry = self._entries.pop(id(flow), None)
        if entry is None:
            logger.warning("Response without matching request: %s", flow.request.path)
            return
        if flow.response is None:
            logger.warning("Flow with no response object: %s", flow.request.path)
            return
        entry.ts_response = time.time()
        entry.response_status = flow.response.status_code
        entry.response_headers = dict(flow.response.headers)
        if not entry.sse_events:
            try:
                entry.response_body = json.loads(flow.response.get_text() or "{}")
            except json.JSONDecodeError:
                entry.response_body = flow.response.get_text() or ""
        self._append_entry(entry)
 
    def _tap_sse(
        self,
        flow: http.HTTPFlow,
        chunks: Iterator[bytes],
    ) -> Iterator[bytes]:
        """Forward each SSE chunk verbatim and store its parsed event."""
        entry = self._entries.get(id(flow))
        buffer = ""
        for chunk in chunks:
            yield chunk
            if entry is None:
                continue
            buffer += chunk.decode("utf-8", errors="replace")
            while "\n\n" in buffer:
                raw_event, buffer = buffer.split("\n\n", 1)
                parsed = self._parse_sse_event(raw_event)
                if parsed is not None:
                    entry.sse_events.append(parsed)
 
    @staticmethod
    def _parse_sse_event(raw: str) -> dict[str, Any] | None:
        """Parse a single SSE event block into a typed dict."""
        event_type: str | None = None
        data_lines: list[str] = []
        for line in raw.splitlines():
            if line.startswith(":"):
                continue  # SSE comment, ignore
            if line.startswith("event:"):
                event_type = line[len("event:"):].strip()
            elif line.startswith("data:"):
                data_lines.append(line[len("data:"):].strip())
        if not data_lines:
            return None
        data_raw = "\n".join(data_lines)
        try:
            parsed: Any = json.loads(data_raw)
        except json.JSONDecodeError:
            parsed = data_raw
        return {"event": event_type, "data": parsed}
 
    @classmethod
    def _redact_headers(cls, headers: dict[str, str]) -> dict[str, str]:
        """Mask sensitive headers before any payload reaches disk."""
        return {
            key: ("[REDACTED]" if key.lower() in cls.HEADERS_TO_REDACT else value)
            for key, value in headers.items()
        }
 
    def _append_entry(self, entry: TrafficEntry) -> None:
        """Append a JSON line to the dump file."""
        if self._output_path is None:
            logger.error("Output path not configured, dropping entry")
            return
        try:
            with self._output_path.open("a", encoding="utf-8") as fp:
                fp.write(json.dumps(asdict(entry), ensure_ascii=False) + "\n")
        except OSError as exc:
            logger.error("Failed to write traffic entry: %s", exc)
 
 
addons: list[LLMTrafficLogger] = [LLMTrafficLogger()]
