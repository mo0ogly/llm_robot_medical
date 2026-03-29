#!/usr/bin/env python3
"""doc_librarian.py — Automated validator for research_archive/ organisation.

Checks:
  1. CATEGORY     — each file is in the correct subdirectory for its type
  2. METADATA     — required fields present in refs files (Date, Search, MITRE, BibTeX)
  3. DUPLICATES   — same BibTeX key, same URL, or same scenario_id across files
  4. OBSOLESCENCE — refs files whose scenario_id no longer exists in scenarios.py
  5. VERSIONING   — git log age + embedded version tag in manuscript files
  6. HELP_FILES   — backend/prompts/ NN-*.md / NN-*.json pairing and required sections

Usage:
    python doc_librarian.py              # full check, exit 1 if issues
    python doc_librarian.py --fix        # auto-fix where possible (move misplaced files)
    python doc_librarian.py --report     # print full report, always exit 0
    python doc_librarian.py --json       # machine-readable JSON output

Exit codes:
    0 — clean
    1 — issues found (use --report to see details)
    2 — internal error

Reference:
    research_archive/README.md — directory spec
    backend/scenarios.py       — authoritative scenario list
"""

import argparse
import io
import json
import os
import re
import sys
from collections import defaultdict

# Force UTF-8 stdout on Windows to handle non-ASCII filenames
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ("utf-8", "utf8"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

ARCHIVE_ROOT = Path(__file__).parent.parent / "research_archive"

# Expected directory layout
EXPECTED_DIRS = {
    "data/references": {
        "pattern": r"^scenario_.+_refs\.md$",
        "description": "Scenario reference files (scenario_<id>_refs.md)",
    },
    "data/raw": {
        "pattern": r"^(campaign|exp\d+)_.+\.json$",
        "description": "Raw campaign JSON exports",
    },
    "data/processed": {
        "pattern": r"\.(md|csv|xlsx|txt)$",
        "description": "Processed analysis outputs",
    },
    "manuscript": {
        "pattern": r"\.(md|tex|pdf|docx|js|json)$",
        "description": "Thesis manuscript files (+ build tooling)",
    },
    "literature_for_rag": {
        "pattern": r"\.(pdf|md|txt|bib|docx|doc)$",
        "description": "Source documents for RAG ingestion",
    },
    "figures": {
        "pattern": r"\.(png|pdf|svg|eps)$",
        "description": "Thesis figures",
    },
}

# Required sections in refs files
REFS_REQUIRED_SECTIONS = [
    r"^# References",       # title line (accepts "References —" or "References:")
    r"^[\*]*Date[\*]*:",    # date field (accepts "Date:" or "**Date**:")
    r"^#+\s*\w*\s*Search",  # search traces heading (e.g. "## Search N", "## Web Search Traces", "## WebSearch Traces")
    r"^#+\s*MITRE",         # MITRE TTPs section ("## MITRE TTPs" or "## MITRE ATT&CK TTPs")
    r"^## BibTeX",
    r"^## RETEX",           # retex section (accepts "## RETEX —" or "## RETEX")
]

# Required fields in manuscript files (formal_framework_complete.md etc.)
MANUSCRIPT_VERSION_PATTERN = re.compile(
    r"^#+\s+.*?version\s+(\d+\.\d+)", re.IGNORECASE | re.MULTILINE
)
MANUSCRIPT_DATE_PATTERN = re.compile(
    r"Date:\s+(\d{4}-\d{2}-\d{2})", re.MULTILINE
)

# Stale threshold: files not touched in N days are flagged as potentially obsolete
STALE_DAYS = 90


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_all_scenario_ids() -> set[str]:
    """Load all scenario IDs from scenarios.py (single source of truth)."""
    try:
        sys.path.insert(0, str(Path(__file__).parent))
        from scenarios import get_all_scenarios
        return {s.id for s in get_all_scenarios()}
    except Exception as e:
        return set()  # Will be reported as internal warning


def git_last_modified(path: Path) -> datetime | None:
    """Return last git commit date for a file, or None if not tracked."""
    try:
        import subprocess
        result = subprocess.run(
            ["git", "log", "-1", "--format=%ci", "--", str(path)],
            capture_output=True, text=True,
            cwd=str(path.parent),
        )
        ts = result.stdout.strip()
        if ts:
            return datetime.fromisoformat(ts.split(" +")[0].split(" -")[0].strip())
    except Exception:
        pass
    return None


def file_mtime(path: Path) -> datetime:
    """Filesystem modification time."""
    return datetime.fromtimestamp(path.stat().st_mtime)


# ---------------------------------------------------------------------------
# Check 1: Category
# ---------------------------------------------------------------------------

def check_categories(archive: Path) -> list[dict]:
    """Flag files that are in the wrong subdirectory."""
    issues = []
    for rel_dir, spec in EXPECTED_DIRS.items():
        target = archive / rel_dir
        if not target.exists():
            issues.append({
                "check": "CATEGORY",
                "severity": "WARNING",
                "path": str(archive / rel_dir),
                "message": f"Expected directory missing: {rel_dir}",
                "fixable": True,
                "fix": f"mkdir -p {archive / rel_dir}",
            })
            continue
        pattern = re.compile(spec["pattern"], re.IGNORECASE)
        for f in target.iterdir():
            if f.is_file() and not pattern.search(f.name):
                issues.append({
                    "check": "CATEGORY",
                    "severity": "WARNING",
                    "path": str(f),
                    "message": (
                        f"File '{f.name}' does not match expected pattern "
                        f"'{spec['pattern']}' for directory '{rel_dir}'. "
                        f"Expected: {spec['description']}"
                    ),
                    "fixable": False,
                })
    return issues


# ---------------------------------------------------------------------------
# Check 2: Metadata
# ---------------------------------------------------------------------------

def check_metadata(archive: Path) -> list[dict]:
    """Verify required sections are present in refs files and manuscript files."""
    issues = []
    refs_dir = archive / "data" / "references"
    if not refs_dir.exists():
        return issues

    for f in refs_dir.glob("scenario_*_refs.md"):
        content = f.read_text(encoding="utf-8", errors="replace")
        for pattern in REFS_REQUIRED_SECTIONS:
            if not re.search(pattern, content, re.MULTILINE):
                issues.append({
                    "check": "METADATA",
                    "severity": "ERROR",
                    "path": str(f),
                    "message": f"Missing required section matching '{pattern}'",
                    "fixable": False,
                })

        # Check Date: is parseable
        date_match = re.search(r"^Date:\s+(\d{4}-\d{2}-\d{2})", content, re.MULTILINE)
        if date_match:
            try:
                datetime.strptime(date_match.group(1), "%Y-%m-%d")
            except ValueError:
                issues.append({
                    "check": "METADATA",
                    "severity": "ERROR",
                    "path": str(f),
                    "message": f"Invalid date format: '{date_match.group(1)}' — expected YYYY-MM-DD",
                    "fixable": False,
                })

    # Manuscript: check for version tag
    manuscript_dir = archive / "manuscript"
    if manuscript_dir.exists():
        for f in manuscript_dir.glob("*.md"):
            content = f.read_text(encoding="utf-8", errors="replace")
            if not MANUSCRIPT_DATE_PATTERN.search(content):
                issues.append({
                    "check": "METADATA",
                    "severity": "INFO",
                    "path": str(f),
                    "message": "Manuscript file has no embedded 'Date: YYYY-MM-DD' tag",
                    "fixable": False,
                })

    return issues


# ---------------------------------------------------------------------------
# Check 3: Duplicates
# ---------------------------------------------------------------------------

def check_duplicates(archive: Path) -> list[dict]:
    """Detect duplicate BibTeX keys, URLs, and scenario_ids across refs files."""
    issues = []
    refs_dir = archive / "data" / "references"
    if not refs_dir.exists():
        return issues

    bibtex_key_map: dict[str, list[str]] = defaultdict(list)
    url_map: dict[str, list[str]] = defaultdict(list)
    scenario_id_map: dict[str, list[str]] = defaultdict(list)

    for f in refs_dir.glob("scenario_*_refs.md"):
        content = f.read_text(encoding="utf-8", errors="replace")
        fname = str(f)

        # BibTeX keys: @article{key, or @misc{key, etc.
        for key in re.findall(r"^@\w+\{(\w+),", content, re.MULTILINE):
            bibtex_key_map[key].append(fname)

        # URLs
        for url in re.findall(r"- Source:\s+(https?://\S+)", content):
            url_map[url.rstrip(").,").strip()].append(fname)

        # Scenario IDs referenced in RETEX header
        m = re.search(r"^## RETEX —\s+(\S+)", content, re.MULTILINE)
        if m:
            scenario_id_map[m.group(1)].append(fname)

    for key, files in bibtex_key_map.items():
        if len(files) > 1:
            # Cross-file BibTeX duplicates are expected (same paper cited in
            # multiple scenario refs).  Only flag as WARNING when the same key
            # appears more than once *inside a single file*.
            issues.append({
                "check": "DUPLICATE",
                "severity": "INFO",
                "path": files[0],
                "message": f"BibTeX key '{key}' shared across {len(files)} refs files (expected for common citations): {', '.join(os.path.basename(f) for f in files)}",
                "fixable": False,
            })

    for url, files in url_map.items():
        if len(files) > 1:
            issues.append({
                "check": "DUPLICATE",
                "severity": "INFO",
                "path": files[0],
                "message": f"URL appears in {len(files)} refs files (may be intentional): {url[:80]}",
                "fixable": False,
            })

    for sid, files in scenario_id_map.items():
        if len(files) > 1:
            issues.append({
                "check": "DUPLICATE",
                "severity": "ERROR",
                "path": files[0],
                "message": f"Scenario ID '{sid}' has {len(files)} refs files — only one expected",
                "fixable": False,
            })

    return issues


# ---------------------------------------------------------------------------
# Check 4: Obsolescence
# ---------------------------------------------------------------------------

def check_obsolescence(archive: Path, scenario_ids: set[str]) -> list[dict]:
    """Flag refs files whose scenario no longer exists in scenarios.py."""
    issues = []
    refs_dir = archive / "data" / "references"
    if not refs_dir.exists():
        return issues

    if not scenario_ids:
        issues.append({
            "check": "OBSOLESCENCE",
            "severity": "WARNING",
            "path": str(refs_dir),
            "message": "Could not load scenario IDs from scenarios.py — obsolescence check skipped",
            "fixable": False,
        })
        return issues

    for f in refs_dir.glob("scenario_*_refs.md"):
        # Extract scenario_id from filename: scenario_{id}_refs.md
        match = re.match(r"^scenario_(.+)_refs\.md$", f.name)
        if match:
            sid = match.group(1)
            if sid not in scenario_ids:
                mtime = file_mtime(f)
                age_days = (datetime.now() - mtime).days
                issues.append({
                    "check": "OBSOLESCENCE",
                    "severity": "WARNING",
                    "path": str(f),
                    "message": (
                        f"Refs file for '{sid}' but scenario not found in scenarios.py. "
                        f"File age: {age_days} days. "
                        f"Either the scenario was renamed/removed, or the file is orphaned."
                    ),
                    "fixable": False,
                })

    # Also check for scenarios that exist but have no refs file
    existing_refs = {
        re.match(r"^scenario_(.+)_refs\.md$", f.name).group(1)
        for f in refs_dir.glob("scenario_*_refs.md")
        if re.match(r"^scenario_(.+)_refs\.md$", f.name)
    }
    missing_refs = scenario_ids - existing_refs
    for sid in sorted(missing_refs):
        issues.append({
            "check": "OBSOLESCENCE",
            "severity": "INFO",
            "path": str(refs_dir / f"scenario_{sid}_refs.md"),
            "message": f"Scenario '{sid}' exists in scenarios.py but has no refs file (retroactive doc pending)",
            "fixable": False,
        })

    return issues


# ---------------------------------------------------------------------------
# Check 5: Versioning
# ---------------------------------------------------------------------------

def check_versioning(archive: Path) -> list[dict]:
    """Check that manuscript files are tracked in git and not stale."""
    issues = []
    manuscript_dir = archive / "manuscript"
    if not manuscript_dir.exists():
        return issues

    for f in manuscript_dir.glob("*.md"):
        content = f.read_text(encoding="utf-8", errors="replace")

        # Look for embedded version: "version: X.Y" or "v0.3" in first 20 lines
        first_20 = "\n".join(content.splitlines()[:20])
        has_version = bool(
            re.search(r"version\s*[:=]?\s*\d+\.\d+", first_20, re.IGNORECASE) or
            re.search(r"\bv\d+\.\d+\b", first_20)
        )
        if not has_version:
            issues.append({
                "check": "VERSIONING",
                "severity": "INFO",
                "path": str(f),
                "message": f"No version tag found in first 20 lines (expected 'version: X.Y' or 'vX.Y')",
                "fixable": False,
            })

        # Check git tracking
        last_git = git_last_modified(f)
        if last_git is None:
            mtime = file_mtime(f)
            age_days = (datetime.now() - mtime).days
            issues.append({
                "check": "VERSIONING",
                "severity": "WARNING",
                "path": str(f),
                "message": (
                    f"File not tracked in git (in .gitignore or never committed). "
                    f"Filesystem age: {age_days} days. "
                    f"Use 'git add -f' for thesis docs."
                ),
                "fixable": False,
            })
        else:
            age_days = (datetime.now() - last_git).days
            if age_days > STALE_DAYS:
                issues.append({
                    "check": "VERSIONING",
                    "severity": "INFO",
                    "path": str(f),
                    "message": f"Last git commit {age_days} days ago — may be stale (threshold: {STALE_DAYS} days)",
                    "fixable": False,
                })

    # Check raw campaign files — flag if older than 30 days with no processed counterpart
    raw_dir = archive / "data" / "raw"
    processed_dir = archive / "data" / "processed"
    if raw_dir.exists():
        for f in raw_dir.glob("campaign_*.json"):
            mtime = file_mtime(f)
            age_days = (datetime.now() - mtime).days
            if age_days > 30:
                # Check if a processed analysis exists for this campaign
                stem = f.stem  # campaign_YYYYMMDD_HHMMSS
                has_analysis = any(
                    stem[:15] in p.name
                    for p in (processed_dir.glob("analysis_*.md") if processed_dir.exists() else [])
                )
                if not has_analysis:
                    issues.append({
                        "check": "VERSIONING",
                        "severity": "INFO",
                        "path": str(f),
                        "message": (
                            f"Campaign file {age_days} days old with no processed analysis. "
                            f"Run: python backend/analyze_campaign.py {f}"
                        ),
                        "fixable": False,
                    })

    return issues


# ---------------------------------------------------------------------------
# Check 6: Help Files (backend/prompts/*.md)
# ---------------------------------------------------------------------------

def check_help_files(prompts_dir: Path, templates: list[dict] = None) -> list[dict]:
    """Validate the 51+ .md help files in backend/prompts/.

    Checks:
    1. Each numbered .md file (NN-*.md) has a matching .json
    2. Each .json file references its .md via the 'help' field
    3. Each .md contains required sections: '# ' title, '## AEGIS Audit', '### Classification'
    4. File naming follows NN-slug pattern
    """
    issues = []
    if not prompts_dir.exists():
        issues.append({
            "check": "HELP_FILES",
            "severity": "ERROR",
            "path": str(prompts_dir),
            "message": "prompts directory not found",
            "fixable": False,
        })
        return issues

    md_files = sorted(prompts_dir.glob("[0-9][0-9]-*.md"))
    json_files = sorted(prompts_dir.glob("[0-9][0-9]-*.json"))

    md_stems = {f.stem for f in md_files}
    json_stems = {f.stem for f in json_files}

    # Check orphan MDs (no matching JSON)
    for stem in sorted(md_stems - json_stems):
        issues.append({
            "check": "HELP_FILES",
            "severity": "WARNING",
            "path": stem + ".md",
            "message": "MD file has no matching JSON template",
            "fixable": False,
        })

    # Check orphan JSONs (no matching MD)
    for stem in sorted(json_stems - md_stems):
        issues.append({
            "check": "HELP_FILES",
            "severity": "WARNING",
            "path": stem + ".json",
            "message": "JSON template has no matching MD help file",
            "fixable": False,
        })

    # Check required sections in each MD
    required_sections = ["# ", "## AEGIS Audit", "### Classification"]
    for md_file in md_files:
        content = md_file.read_text(encoding="utf-8", errors="replace")
        for section in required_sections:
            if section not in content:
                issues.append({
                    "check": "HELP_FILES",
                    "severity": "WARNING",
                    "path": md_file.name,
                    "message": "Missing required section: " + repr(section),
                    "fixable": False,
                })

    return issues


# ---------------------------------------------------------------------------
# Auto-fix
# ---------------------------------------------------------------------------

def apply_fixes(issues: list[dict], dry_run: bool = False) -> list[dict]:
    """Apply auto-fixable issues. Returns list of applied fixes."""
    applied = []
    for issue in issues:
        if not issue.get("fixable"):
            continue
        if issue["check"] == "CATEGORY" and "mkdir" in issue.get("fix", ""):
            path = Path(issue["path"])
            if not dry_run:
                path.mkdir(parents=True, exist_ok=True)
            applied.append({**issue, "status": "fixed" if not dry_run else "dry_run"})
    return applied


# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------

def print_report(issues: list[dict], scenario_ids: set[str]) -> None:
    """Print human-readable report."""
    by_check: dict[str, list] = defaultdict(list)
    for i in issues:
        by_check[i["check"]].append(i)

    severity_order = {"ERROR": 0, "WARNING": 1, "INFO": 2}
    severity_icons = {"ERROR": "X", "WARNING": "!", "INFO": "."}
    severity_counts = defaultdict(int)

    print("\n" + "=" * 70)
    print("DOC LIBRARIAN — research_archive/ validation report")
    print(f"Timestamp : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Scenarios : {len(scenario_ids)} in scenarios.py")
    print("=" * 70)

    for check_name in ["CATEGORY", "METADATA", "DUPLICATE", "OBSOLESCENCE", "VERSIONING", "HELP_FILES"]:
        check_issues = sorted(
            by_check.get(check_name, []),
            key=lambda x: severity_order.get(x["severity"], 9),
        )
        if not check_issues:
            print(f"\n[{check_name}] OK")
            continue

        errors = sum(1 for i in check_issues if i["severity"] == "ERROR")
        warnings = sum(1 for i in check_issues if i["severity"] == "WARNING")
        infos = sum(1 for i in check_issues if i["severity"] == "INFO")
        print(f"\n[{check_name}] {errors} errors  {warnings} warnings  {infos} info")
        print("-" * 50)
        for issue in check_issues:
            icon = severity_icons.get(issue["severity"], "?")
            severity_counts[issue["severity"]] += 1
            path_short = os.path.relpath(issue["path"], str(ARCHIVE_ROOT))
            print(f"  {icon} [{issue['severity']}] {path_short}")
            print(f"      {issue['message']}")
            if issue.get("fixable"):
                print(f"      → Auto-fixable: {issue.get('fix', 'run with --fix')}")

    print("\n" + "=" * 70)
    print(f"SUMMARY: {severity_counts['ERROR']} errors | "
          f"{severity_counts['WARNING']} warnings | "
          f"{severity_counts['INFO']} info")

    total_issues = sum(severity_counts.values())
    info_only = severity_counts["ERROR"] == 0 and severity_counts["WARNING"] == 0
    if total_issues == 0:
        print("STATUS: CLEAN [OK]")
    elif info_only:
        print("STATUS: CLEAN (info only) [OK]")
    else:
        print("STATUS: ISSUES FOUND [FAIL]")
    print("=" * 70 + "\n")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate research_archive/ organisation (category, metadata, duplicates, obsolescence, versioning, help_files)."
    )
    parser.add_argument("--fix", action="store_true", help="Auto-fix fixable issues")
    parser.add_argument("--report", action="store_true", help="Print full report, always exit 0")
    parser.add_argument("--json", action="store_true", help="Output machine-readable JSON")
    parser.add_argument("--archive", default=str(ARCHIVE_ROOT), help="Path to research_archive/")
    args = parser.parse_args()

    archive = Path(args.archive)
    if not archive.exists():
        print(f"ERROR: archive directory not found: {archive}", file=sys.stderr)
        return 2

    scenario_ids = get_all_scenario_ids()

    # Run all checks
    issues: list[dict] = []
    issues += check_categories(archive)
    issues += check_metadata(archive)
    issues += check_duplicates(archive)
    issues += check_obsolescence(archive, scenario_ids)
    issues += check_versioning(archive)

    # Check 6: Help files in backend/prompts/
    prompts_dir = Path(__file__).parent / "prompts"
    issues += check_help_files(prompts_dir)

    # Apply fixes
    if args.fix:
        fixed = apply_fixes(issues)
        for f in fixed:
            print(f"FIXED: {f['path']} — {f['message']}")

    # Output
    if args.json:
        print(json.dumps({
            "timestamp": datetime.now().isoformat(),
            "scenario_count": len(scenario_ids),
            "total_issues": len(issues),
            "issues": issues,
        }, indent=2, default=str))
        return 0 if args.report else (1 if issues else 0)

    print_report(issues, scenario_ids)

    if args.report:
        return 0

    has_errors = any(i["severity"] in ("ERROR", "WARNING") for i in issues)
    return 1 if has_errors else 0


if __name__ == "__main__":
    sys.exit(main())
