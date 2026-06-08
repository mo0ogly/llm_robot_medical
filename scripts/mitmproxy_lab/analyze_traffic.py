"""Offline analyzer for the JSONL traffic dump produced by llm_traffic_logger.py.

Parses each round-trip entry, extracts token usage and cache statistics,
detects tool_use cycles, and renders a CSV report plus an optional
matplotlib chart of the cumulative input billing.

Usage:
    python3 analyze_traffic.py traffic.jsonl
    python3 analyze_traffic.py traffic.jsonl --chart out.png --csv out.csv

The analyzer recognizes both Anthropic Messages API responses (usage
fields: input_tokens, output_tokens, cache_creation_input_tokens,
cache_read_input_tokens) and OpenAI Chat Completions responses (usage
fields: prompt_tokens, completion_tokens, prompt_tokens_details).
"""
from __future__ import annotations

import argparse
import csv
import json
import logging
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Iterator

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("analyze_traffic")


@dataclass
class RoundStat:
    """Per-round statistics extracted from one JSONL entry."""

    turn: int
    path: str
    status: int
    ts_request: float
    duration_s: float
    input_tokens: int
    output_tokens: int
    cache_creation_tokens: int
    cache_read_tokens: int
    stop_reason: str
    has_tool_use: bool
    sse_event_count: int


def _coerce_int(value: Any) -> int:
    """Best-effort conversion to non-negative int."""
    try:
        n = int(value)
        return max(n, 0)
    except (TypeError, ValueError):
        return 0


def _extract_anthropic_usage(events: list[dict]) -> dict[str, int]:
    """Extract usage from a sequence of Anthropic SSE events."""
    usage = {
        "input_tokens": 0,
        "output_tokens": 0,
        "cache_creation_input_tokens": 0,
        "cache_read_input_tokens": 0,
    }
    stop_reason = ""
    has_tool_use = False
    for ev in events:
        data = ev.get("data") if isinstance(ev, dict) else None
        if not isinstance(data, dict):
            continue
        event_type = data.get("type")
        if event_type == "message_start":
            msg = data.get("message", {})
            usage_block = msg.get("usage", {})
            for k in usage:
                usage[k] = max(usage[k], _coerce_int(usage_block.get(k)))
        elif event_type == "message_delta":
            usage_block = data.get("usage", {})
            usage["output_tokens"] = max(
                usage["output_tokens"], _coerce_int(usage_block.get("output_tokens"))
            )
            delta = data.get("delta", {})
            stop_reason = delta.get("stop_reason", stop_reason)
        elif event_type == "content_block_start":
            block = data.get("content_block", {})
            if block.get("type") == "tool_use":
                has_tool_use = True
    usage["stop_reason"] = stop_reason
    usage["has_tool_use"] = has_tool_use
    return usage


def _extract_response_usage(body: Any) -> dict[str, int]:
    """Extract usage from a buffered non-streaming response body."""
    usage = {
        "input_tokens": 0,
        "output_tokens": 0,
        "cache_creation_input_tokens": 0,
        "cache_read_input_tokens": 0,
        "stop_reason": "",
        "has_tool_use": False,
    }
    if not isinstance(body, dict):
        return usage
    u = body.get("usage", {})
    # Anthropic shape
    usage["input_tokens"] = _coerce_int(u.get("input_tokens", u.get("prompt_tokens")))
    usage["output_tokens"] = _coerce_int(u.get("output_tokens", u.get("completion_tokens")))
    usage["cache_creation_input_tokens"] = _coerce_int(u.get("cache_creation_input_tokens"))
    usage["cache_read_input_tokens"] = _coerce_int(u.get("cache_read_input_tokens"))
    # OpenAI shape
    details = u.get("prompt_tokens_details", {})
    if isinstance(details, dict):
        usage["cache_read_input_tokens"] = max(
            usage["cache_read_input_tokens"], _coerce_int(details.get("cached_tokens"))
        )
    usage["stop_reason"] = body.get("stop_reason", "")
    content = body.get("content", [])
    if isinstance(content, list):
        usage["has_tool_use"] = any(
            isinstance(b, dict) and b.get("type") == "tool_use" for b in content
        )
    return usage


def parse_entries(path: Path) -> Iterator[RoundStat]:
    """Yield one RoundStat per JSONL line."""
    with path.open("r", encoding="utf-8") as fp:
        for idx, line in enumerate(fp, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
            except json.JSONDecodeError as exc:
                logger.warning("Line %d invalid JSON: %s", idx, exc)
                continue

            ts_req = float(entry.get("ts_request") or 0.0)
            ts_resp = float(entry.get("ts_response") or ts_req)
            duration = max(0.0, ts_resp - ts_req)

            sse_events = entry.get("sse_events") or []
            if sse_events:
                usage = _extract_anthropic_usage(sse_events)
            else:
                usage = _extract_response_usage(entry.get("response_body"))

            yield RoundStat(
                turn=idx,
                path=str(entry.get("path", "")),
                status=int(entry.get("response_status") or 0),
                ts_request=ts_req,
                duration_s=round(duration, 3),
                input_tokens=int(usage.get("input_tokens", 0)),
                output_tokens=int(usage.get("output_tokens", 0)),
                cache_creation_tokens=int(usage.get("cache_creation_input_tokens", 0)),
                cache_read_tokens=int(usage.get("cache_read_input_tokens", 0)),
                stop_reason=str(usage.get("stop_reason", "")),
                has_tool_use=bool(usage.get("has_tool_use", False)),
                sse_event_count=len(sse_events),
            )


def print_summary(stats: list[RoundStat]) -> None:
    """Print a textual summary to stdout."""
    if not stats:
        print("Aucune entrée à analyser.")
        return
    total_in = sum(s.input_tokens for s in stats)
    total_out = sum(s.output_tokens for s in stats)
    total_create = sum(s.cache_creation_tokens for s in stats)
    total_read = sum(s.cache_read_tokens for s in stats)
    total_dur = sum(s.duration_s for s in stats)
    tool_use_turns = sum(1 for s in stats if s.has_tool_use)

    cache_effective_pct = 0.0
    if total_in + total_read > 0:
        cache_effective_pct = 100.0 * total_read / max(1, total_in + total_read)

    print()
    print("=" * 70)
    print("Synthèse du trafic capturé")
    print("=" * 70)
    print(f"Nombre de tours              : {len(stats)}")
    print(f"Durée cumulée                : {total_dur:.2f} s")
    print(f"Tours avec tool_use          : {tool_use_turns}")
    print(f"Tokens input total           : {total_in}")
    print(f"Tokens output total          : {total_out}")
    print(f"Tokens cache creation        : {total_create}")
    print(f"Tokens cache read            : {total_read}")
    print(f"Ratio cache effective        : {cache_effective_pct:.1f} %")
    print()
    print("Décompose par tour :")
    print(f"  {'#':>3}  {'status':>6}  {'dur(s)':>7}  "
          f"{'in':>7}  {'out':>5}  {'cc':>6}  {'cr':>6}  "
          f"{'stop':<10}  tool")
    for s in stats:
        print(f"  {s.turn:>3}  {s.status:>6}  {s.duration_s:>7.3f}  "
              f"{s.input_tokens:>7}  {s.output_tokens:>5}  "
              f"{s.cache_creation_tokens:>6}  {s.cache_read_tokens:>6}  "
              f"{s.stop_reason:<10}  {'yes' if s.has_tool_use else '-'}")
    print()


def write_csv(stats: list[RoundStat], out_path: Path) -> None:
    """Dump stats to a CSV file."""
    if not stats:
        return
    with out_path.open("w", encoding="utf-8", newline="") as fp:
        writer = csv.DictWriter(fp, fieldnames=list(asdict(stats[0]).keys()))
        writer.writeheader()
        for s in stats:
            writer.writerow(asdict(s))
    logger.info("CSV written to %s", out_path)


def render_chart(stats: list[RoundStat], out_path: Path) -> None:
    """Render a stacked bar chart of input tokens vs cache reads per turn."""
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        import numpy as np
    except ImportError:
        logger.error("matplotlib non disponible, chart non généré")
        return

    if not stats:
        return

    turns = [s.turn for s in stats]
    inp = np.array([s.input_tokens for s in stats])
    reads = np.array([s.cache_read_tokens for s in stats])

    fig, ax = plt.subplots(figsize=(12, 6), dpi=130, facecolor="white")
    ax.set_facecolor("white")
    width = 0.6
    ax.bar(turns, inp, width=width, color="#c62828", edgecolor="#7a1a1a",
           label="Input tokens facturés (hors cache read)")
    ax.bar(turns, reads, width=width, bottom=inp, color="#2f7d32", edgecolor="#1b3d1f",
           label="Cache read tokens (facturés à 0.1x)")
    ax.set_xlabel("Numéro de tour")
    ax.set_ylabel("Tokens input")
    ax.set_title("Décomposition de l'input token par tour")
    ax.grid(axis="y", linestyle="--", alpha=0.4)
    ax.legend(loc="upper left", fontsize=9)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    plt.tight_layout()
    plt.savefig(out_path, facecolor="white", bbox_inches="tight")
    plt.close(fig)
    logger.info("Chart written to %s", out_path)


def main() -> int:
    """CLI entry point."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("jsonl_path", type=Path, help="Path to traffic.jsonl")
    parser.add_argument("--csv", type=Path, default=None, help="Optional CSV output")
    parser.add_argument("--chart", type=Path, default=None, help="Optional PNG chart output")
    args = parser.parse_args()

    if not args.jsonl_path.exists():
        logger.error("File not found: %s", args.jsonl_path)
        return 1

    stats = list(parse_entries(args.jsonl_path))
    print_summary(stats)
    if args.csv:
        write_csv(stats, args.csv)
    if args.chart:
        render_chart(stats, args.chart)
    return 0


if __name__ == "__main__":
    sys.exit(main())
