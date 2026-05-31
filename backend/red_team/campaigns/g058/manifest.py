"""Campaign manifest dataclass and provenance helpers for G-058."""
from __future__ import annotations

import hashlib
import json
import subprocess
from dataclasses import dataclass
from typing import Any, List


@dataclass
class CampaignManifest:
    """Manifest tracking provenance of a campaign run.

    Written alongside the JSONL trial outputs so each campaign result is
    reproducible and auditable (git revision, spec hash, trial counts).
    """

    campaign_id: str
    subcampaign: str
    started_at: str
    finished_at: str | None
    git_rev: str
    n_frameworks: int
    n_templates: int
    n_trials_per_template: int
    total_trials_planned: int
    total_trials_completed: int
    output_files: List[str]
    spec_sha256: str
    dry_run: bool


def git_rev() -> str:
    """Return the current git revision, or 'unknown' on failure."""
    try:
        out = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            capture_output=True,
            check=True,
            text=True,
            timeout=5,
        )
        return out.stdout.strip()
    except (subprocess.SubprocessError, FileNotFoundError):
        return "unknown"


def sha256_of(obj: Any) -> str:
    """Compute SHA256 of a JSON-serializable object."""
    return hashlib.sha256(
        json.dumps(obj, sort_keys=True, default=str).encode("utf-8")
    ).hexdigest()
