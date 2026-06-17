# AEGIS Notifications

Ping the operator when long-running research work reaches a milestone
(campaign done, conjecture validated, human escalation). Ported natively from
oh-my-claudecode `src/notifications/` into Python/httpx — **no external CLI, no
tmux** (P1 of the OMC fusion, see `docs/omc_fusion/INTEGRATION_TRACKER.md`).

## Channels & configuration

Secrets live in `backend/.env` (loaded via `env_loader`), never in code. Every
key is optional — when none is set the dispatcher runs in **dry-run** (logs the
message instead of sending), so callers can invoke `notify()` unconditionally.

| Env key | Purpose |
|---------|---------|
| `NOTIFY_TELEGRAM_TOKEN` | Telegram bot token |
| `NOTIFY_TELEGRAM_CHAT_ID` | Telegram chat id to post to |
| `NOTIFY_DISCORD_WEBHOOK` | Discord webhook URL |
| `NOTIFY_WEBHOOK_URL` | Generic JSON webhook URL |
| `NOTIFY_DRY_RUN` | `1`/`true` forces log-only |
| `NOTIFY_MIN_SEVERITY` | `info` \| `warning` \| `critical` (default `info`) |
| `NOTIFY_TIMEOUT_S` | Per-dispatch timeout, seconds (default `15`) |

A channel activates only when its keys are present (e.g. Telegram needs both
token and chat id). Outbound text is scrubbed of credential-looking patterns
(`gsk_…`, `sk-…`, `Bearer …`) as defence-in-depth.

## Usage

```python
from backend.notifications import notify, Event

notify(Event.CAMPAIGN_COMPLETE, "Campaign G-058 done", "ASR 12.3% (N=100)")
```

`notify()` is synchronous and never raises on a channel failure (failures are
logged and reflected in the returned `DispatchResult` list). It is safe to call
from inside a FastAPI handler (work is offloaded to a worker thread).

## Wiring: the signal watcher

Rather than editing every signal emitter, the watcher scans
`research_archive/_staging/signals/` and notifies on files it has not seen
before (state in `.notified.json`, so re-runs never double-notify):

```bash
python -m backend.notifications.signal_watcher                # default signals dir
python -m backend.notifications.signal_watcher --root <path>  # custom dir
```

Run it on a schedule, or invoke it at the end of a `research-director` /
`aegis-research-lab` session (COMPLETE phase). Signal filenames map to events by
prefix (`CAMPAIGN_COMPLETE`, `CONJECTURE_VALIDATED`, `UNEXPECTED_FINDING`,
`ESCALADE_HUMAINE`, `SESSION_COMPLETE`, `PLAN_REVIEW_FAILED`); unknown files map
to `GENERIC` so nothing is silently dropped.
