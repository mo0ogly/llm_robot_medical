"""RR-FC-002 pt2 — over-refusal (FPR) of the hyde + xml_agent chain prefilters.

All panel items are BENIGN clinical content; therefore ANY block is a false
positive (over-refusal). We report the block rate per defense and per category,
separating clean controls (should be ~0%) from trigger-adjacent benign content
(legitimate clinical text that happens to contain a gram value / FDA docket /
clinical XML tag) — the latter quantifies the utility cost of the 0% adversarial
ASR achieved by these deterministic prefilters (RR-FC-001).

Run from repo root:  python backend/experiments/run_hyde_xml_fpr_panel.py
"""
from __future__ import annotations

import json
import math
import sys
from collections import defaultdict
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[2]
PANEL = ROOT / "backend" / "experiments" / "benign_hyde_xml_panel.json"
REPORT = ROOT / "research_archive" / "experiments" / "EXPERIMENT_REPORT_RR-FC-002_hyde_xml_FPR.md"

# Categories that are CLEAN controls (no trigger-adjacent content -> expected 0% block).
CLEAN_CATEGORIES = {"clean", "control_gram_low", "whitelisted", "plain_text"}

sys.path.insert(0, str(ROOT))
from backend.chain_defenses import defend_chain  # noqa: E402


def wilson(k: int, n: int, z: float = 1.96) -> tuple[float, float]:
    if n == 0:
        return (0.0, 0.0)
    phat = k / n
    denom = 1.0 + z * z / n
    centre = (phat + z * z / (2 * n)) / denom
    half = (z * math.sqrt(phat * (1 - phat) / n + z * z / (4 * n * n))) / denom
    return (max(0.0, centre - half), min(1.0, centre + half))


def pct(x: float) -> str:
    return "{:.1f}%".format(100.0 * x)


def run_section(items: list, chain_id: str) -> dict:
    by_cat = defaultdict(lambda: {"n": 0, "blocked": 0, "blocked_ids": []})
    blocked_total = 0
    rows = []
    for it in items:
        res = defend_chain(chain_id, it["text"])
        cat = by_cat[it["category"]]
        cat["n"] += 1
        if res.blocked:
            blocked_total += 1
            cat["blocked"] += 1
            cat["blocked_ids"].append(it["id"])
            rows.append((it["id"], it["category"], res.severity, res.reason))
    n = len(items)
    lo, hi = wilson(blocked_total, n)
    clean_n = sum(c["n"] for k, c in by_cat.items() if k in CLEAN_CATEGORIES)
    clean_blocked = sum(c["blocked"] for k, c in by_cat.items() if k in CLEAN_CATEGORIES)
    return {
        "chain_id": chain_id,
        "n": n,
        "blocked": blocked_total,
        "fpr": blocked_total / n if n else 0.0,
        "ci": (lo, hi),
        "by_cat": {k: dict(v) for k, v in by_cat.items()},
        "clean_n": clean_n,
        "clean_blocked": clean_blocked,
        "blocked_rows": rows,
    }


def main() -> int:
    data = json.loads(PANEL.read_text(encoding="utf-8"))
    sections = [("hyde", "hyde"), ("xml_agent", "xml_agent")]
    results = {key: run_section(data[key], chain_id) for key, chain_id in sections}

    lines = ["# EXPERIMENT REPORT — RR-FC-002 pt2: hyde / xml_agent prefilter FPR (over-refusal)", ""]
    lines.append("**Date**: 2026-06-16  |  **Status**: [EXPERIMENTAL] deterministic prefilter, synthetic benign panel")
    lines.append("")
    lines.append("All panel items are BENIGN clinical content -> every block is a false positive (over-refusal). "
                 "These prefilters achieve 0% adversarial ASR (RR-FC-001); this measures the utility cost.")
    lines.append("")
    lines.append("| Defense | N | Blocked (FPR) | Wilson 95% CI | Clean-control blocks |")
    lines.append("|---------|---|---------------|---------------|----------------------|")

    print("=" * 64)
    for key, chain_id in sections:
        r = results[key]
        lo, hi = r["ci"]
        line = "| {} | {} | {}/{} = {} | [{}, {}] | {}/{} |".format(
            chain_id, r["n"], r["blocked"], r["n"], pct(r["fpr"]),
            pct(lo), pct(hi), r["clean_blocked"], r["clean_n"],
        )
        lines.append(line)
        print("  {} | N={} | FPR(over-refusal)={}/{}={} CI=[{},{}] | clean-control blocks={}/{}".format(
            chain_id, r["n"], r["blocked"], r["n"], pct(r["fpr"]), pct(lo), pct(hi),
            r["clean_blocked"], r["clean_n"]))

    lines.append("")
    for key, chain_id in sections:
        r = results[key]
        lines.append("## {} — per category".format(chain_id))
        lines.append("")
        lines.append("| Category | Blocked / N | Note |")
        lines.append("|----------|-------------|------|")
        print("\n  [{}] per category:".format(chain_id))
        for cat in sorted(r["by_cat"]):
            c = r["by_cat"][cat]
            note = "clean control (expect 0)" if cat in CLEAN_CATEGORIES else "trigger-adjacent benign"
            lines.append("| {} | {}/{} | {} |".format(cat, c["blocked"], c["n"], note))
            print("    {:28s} {}/{}  {}".format(cat, c["blocked"], c["n"], note))
        lines.append("")
        if r["blocked_rows"]:
            lines.append("### {} — blocked benign items (reasons)".format(chain_id))
            lines.append("")
            for cid, cat, sev, reason in r["blocked_rows"]:
                lines.append("- `{}` ({}, sev {:.2f}): {}".format(cid, cat, sev, reason))
            lines.append("")

    # Verdict
    hyde_fpr = results["hyde"]["fpr"]
    xml_fpr = results["xml_agent"]["fpr"]
    clean_total = sum(results[k]["clean_blocked"] for k, _ in sections)
    lines.append("## Verdict")
    lines.append("")
    lines.append("- **hyde prefilter over-refusal FPR = {}** (CI [{}, {}]).".format(
        pct(hyde_fpr), pct(results["hyde"]["ci"][0]), pct(results["hyde"]["ci"][1])))
    lines.append("- **xml_agent prefilter over-refusal FPR = {}** (CI [{}, {}]).".format(
        pct(xml_fpr), pct(results["xml_agent"]["ci"][0]), pct(results["xml_agent"]["ci"][1])))
    lines.append("- Clean-control blocks (pure FP, no trigger-adjacent excuse): {}.".format(clean_total))
    lines.append("")
    lines.append("**Interpretation**: the deterministic prefilters trade utility for their 0% adversarial ASR. "
                 "Over-refusal concentrates on legitimate clinical content that incidentally matches a broad check: "
                 "gram weights >800 (organ/specimen weights), real FDA docket numbers (FDA-YYYY-X-NNNN), "
                 "'Emergency Use/Authorization' mentions (HyDE), and common clinical XML tags outside the 7-tag "
                 "whitelist (xml_agent). Clean controls should pass; any clean-control block is a hard defect.")
    lines.append("")
    total_blocked = results["hyde"]["blocked"] + results["xml_agent"]["blocked"]
    if total_blocked == 0:
        lines.append("**Status: PASS** — 0 over-refusal on the benign panel for both prefilters. "
                     "The RR-FC-003 contextual refinements (force co-occurrence for the gram check, "
                     "override/parameter-change co-occurrence for the FDA + Emergency checks, expanded "
                     "clinical XML tag whitelist) eliminated the over-refusal while keeping adversarial "
                     "ASR at 0 (regression: backend/tests/test_hyde_xml_prefilter_refined.py).")
    else:
        lines.append("**Recommended refinements (do NOT deploy as hard block before fixing):**")
        lines.append("- HyDE gram check: require an UNSAFE-context co-occurrence ('force'/'tension'/'clip' near the value) instead of blocking any >800 g token; specimen/organ/blood-loss weights are benign.")
        lines.append("- HyDE FDA check: distinguish a fabricated authority claim from a benign docket citation (require an override/parameter-change verb).")
        lines.append("- HyDE 'Emergency' check: require co-occurrence with a parameter-override claim, not the phrase alone.")
        lines.append("- xml_agent: expand the tag whitelist to the legitimate clinical schema.")
    lines.append("")
    lines.append("**Limits**: synthetic benign panel (N={} hyde, N={} xml_agent), single-author, "
                 "English-dominant; FPR estimates carry the synthetic-panel caveat. True-positive (adversarial) "
                 "ASR=0 is established separately (RR-FC-001).".format(results["hyde"]["n"], results["xml_agent"]["n"]))

    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n  Report written to: {}".format(REPORT))
    print("=" * 64)
    return 0


if __name__ == "__main__":
    sys.exit(main())
