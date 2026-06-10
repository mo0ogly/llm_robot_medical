#!/usr/bin/env python3
"""
RR-FC-001 — Controlled attribution of the FC-20260409 -> FC-20260410 ASR drop
to the chain_defenses prefilter (commit 3c1e896).

Method: deterministic. The chain_defenses prefilter (orchestrator_campaigns.py:231,
gated by aegis_shield) short-circuits blocked payloads to a synthetic AuditResult
with response_snippet starting "[AEGIS CHAIN DEFENSE <id> BLOCKED: ...]" and ZERO
violations, WITHOUT calling the target LLM. Therefore a blocked trial has ASR=0 by
construction. Counting the safe defense-marker prefix per chain attributes the drop
exactly — no new Groq calls, no model-output text parsed (content-filter safe).

Reads ONLY: trial['violated'] (bool) and the leading defense marker of
trial['response_snippet']. Never parses model-response semantics.

Sources:
  - FC-20260409 run2 (prefilter ABSENT, pre-3c1e896): campaign_thesis_20260409_093451.json
  - FC-20260410     (prefilter ACTIVE, post-3c1e896): campaign_thesis_20260410_134913.json
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
RESULTS = os.path.join(ROOT, "backend", "experiments", "results")

RUNS = {
    "FC-20260409_run2 (prefilter ABSENT)": "campaign_thesis_20260409_093451.json",
    "FC-20260410 (prefilter ACTIVE)": "campaign_thesis_20260410_134913.json",
}
CHAINS = ["hyde", "xml_agent", "functions_agent", "stepback"]
MARKER = "[AEGIS CHAIN DEFENSE"  # synthetic defense string, NOT model output


def analyze(path):
    d = json.load(open(path, encoding="utf-8"))
    pc = {c["chain_id"]: c for c in d["result"]["per_chain"]}
    rows = {}
    for ch in CHAINS:
        c = pc.get(ch)
        if not c:
            rows[ch] = None
            continue
        trials = c["trials"]
        n = len(trials)
        viol = sum(1 for t in trials if t.get("violated"))
        blocked = sum(1 for t in trials
                      if str(t.get("response_snippet", "")).lstrip().startswith(MARKER))
        rows[ch] = {"n": n, "viol": viol, "asr": round(100.0 * viol / n, 1) if n else None,
                    "blocked_by_prefilter": blocked}
    return {"model": d.get("model"), "provider": d.get("provider"),
            "aegis_shield": d["result"].get("aegis_shield_active"), "chains": rows}


def main():
    out = {}
    for label, fn in RUNS.items():
        out[label] = analyze(os.path.join(RESULTS, fn))
        r = out[label]
        print("=" * 70)
        print(label, "| model:", r["model"], "| aegis_shield:", r["aegis_shield"])
        for ch, v in r["chains"].items():
            if v:
                print("  {:<16} trials={n} viol={viol} ASR={asr}% blocked={blocked_by_prefilter}".format(ch, **v))
    out_path = os.path.join(HERE, "fc_attribution_rrfc001_20260610.json")
    json.dump(out, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("\nwrote:", out_path)


if __name__ == "__main__":
    main()
