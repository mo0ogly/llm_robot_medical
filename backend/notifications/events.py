"""AEGIS notification events, severity, and signal-name mapping.

Maps the research lab's `_staging/signals/` artifacts to notification events so
long-running work (campaigns, conjecture validations, human escalations) can
ping the operator. Event taxonomy ported conceptually from oh-my-claudecode
`src/notifications/types.ts`, adapted to the AEGIS signal vocabulary.
"""
from __future__ import annotations

from enum import Enum


class Severity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class Event(str, Enum):
    CAMPAIGN_COMPLETE = "campaign_complete"
    CONJECTURE_VALIDATED = "conjecture_validated"
    UNEXPECTED_FINDING = "unexpected_finding"
    ESCALADE_HUMAINE = "escalade_humaine"
    SESSION_COMPLETE = "session_complete"
    PLAN_REVIEW_FAILED = "plan_review_failed"
    GENERIC = "generic"


# Severity attached to each event — drives the min-severity filter.
EVENT_SEVERITY = {
    Event.CAMPAIGN_COMPLETE: Severity.INFO,
    Event.CONJECTURE_VALIDATED: Severity.INFO,
    Event.SESSION_COMPLETE: Severity.INFO,
    Event.UNEXPECTED_FINDING: Severity.WARNING,
    Event.PLAN_REVIEW_FAILED: Severity.WARNING,
    Event.ESCALADE_HUMAINE: Severity.CRITICAL,
    Event.GENERIC: Severity.INFO,
}

# Signal filename prefixes (in _staging/signals/) mapped to events.
SIGNAL_PREFIX_TO_EVENT = {
    "CAMPAIGN_COMPLETE": Event.CAMPAIGN_COMPLETE,
    "CONJECTURE_VALIDATED": Event.CONJECTURE_VALIDATED,
    "UNEXPECTED_FINDING": Event.UNEXPECTED_FINDING,
    "ESCALADE_HUMAINE": Event.ESCALADE_HUMAINE,
    "SESSION_COMPLETE": Event.SESSION_COMPLETE,
    "PLAN_REVIEW_FAILED": Event.PLAN_REVIEW_FAILED,
}

SEVERITY_ORDER = {Severity.INFO: 0, Severity.WARNING: 1, Severity.CRITICAL: 2}


def event_for_signal(filename: str) -> Event:
    """Return the Event a signal file maps to, by longest matching prefix.

    Longest-prefix avoids a shorter prefix shadowing a more specific one if the
    vocabulary grows. Unknown files fall back to GENERIC rather than being
    dropped, so a new signal type still pings (visible default).
    """
    name = filename.upper()
    best_prefix = ""
    best_event = Event.GENERIC
    for prefix, event in SIGNAL_PREFIX_TO_EVENT.items():
        if name.startswith(prefix) and len(prefix) > len(best_prefix):
            best_prefix, best_event = prefix, event
    return best_event


def severity_of(event: Event) -> Severity:
    return EVENT_SEVERITY.get(event, Severity.INFO)
