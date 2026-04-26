#!/usr/bin/env python3
"""Analyse IA des resultats de campagne formelle.

Lit un fichier campaign_*.json genere par run_formal_campaign() et
produit un rapport Markdown structure pour la these, incluant :
    - Tableau des violation rates par chain avec Wilson CI
    - Sep(M) global et par famille
    - Attribution causale (injected vs control)
    - Recommandations pour ameliorer les defenses
    - Donnees formatees pour graphiques LaTeX/matplotlib

Usage:
    python analyze_campaign.py [campaign_file.json]
    python analyze_campaign.py  # auto-detect latest

Output:
    research_archive/data/processed/analysis_YYYYMMDD_HHMMSS.md

Reference:
    - Zverev et al. (ICLR 2025) Definition 2 : Sep(M)
    - Wilson (1927) : Confidence interval for proportions
    - DY-AGENT Definition 7 : Integrity(S) := Reachable(M,i) <= Allowed(i)
"""
import json
import os
import sys
import glob
from datetime import datetime


def load_campaign(path: str | None = None) -> dict:
    """Load campaign JSON, auto-detecting latest if no path given."""
    if path and os.path.isfile(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)

    # Auto-detect latest in research_archive
    archive_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "research_archive", "data", "raw",
    )
    files = sorted(glob.glob(os.path.join(archive_dir, "campaign_*.json")))
    if not files:
        print(f"No campaign files found in {archive_dir}")
        sys.exit(1)
    latest = files[-1]
    print(f"Loading latest campaign: {latest}")
    with open(latest, encoding="utf-8") as f:
        return json.load(f)


def classify_chain(chain_id: str) -> str:
    """Classify a chain into attack family for thesis grouping."""
    families = {
        "rag": ["rag_", "hyde", "multi_index", "router", "self_query", "propositional", "multimodal"],
        "agent": ["solo_agent", "tool_retrieval", "functions_agent", "csv_agent", "retrieval_agent", "xml_agent"],
        "extraction": ["extraction", "sql_", "research", "summarize"],
        "defense": ["pii_guard", "guardrails", "prompt_override"],
        "technique": ["critique", "skeleton", "stepback", "rewrite", "chain_of_note", "iterative"],
        "social": ["feedback", "transactional", "rag_conversation"],
    }
    for family, patterns in families.items():
        if any(p in chain_id for p in patterns):
            return family
    return "other"


def generate_report(campaign: dict) -> str:
    """Generate a Markdown analysis report for the thesis."""
    ts = campaign.get("timestamp", "unknown")
    agg = campaign.get("aggregate", {})
    sep = campaign.get("separation_score", {})
    chains = campaign.get("per_chain", [])

    lines = []
    lines.append("# Formal Campaign Analysis Report")
    lines.append("")
    lines.append(f"**Generated:** {datetime.now().isoformat()}")
    lines.append(f"**Campaign timestamp:** {ts}")
    lines.append(f"**Chains tested:** {campaign.get('n_chains_tested', '?')}")
    lines.append(f"**Trials per chain:** {campaign.get('n_trials_per_chain', '?')}")
    lines.append(f"**Aegis Shield:** {'ON' if campaign.get('aegis_shield_active') else 'OFF'}")
    lines.append("")

    # --- Aggregate Results ---
    lines.append("## 1. Aggregate Results")
    lines.append("")
    lines.append("| Metric | Value |")
    lines.append("|--------|-------|")
    lines.append(f"| Total trials | {agg.get('total_trials', 0)} |")
    lines.append(f"| Total violations | {agg.get('total_violations', 0)} |")
    lines.append(f"| Violation rate | {agg.get('violation_rate', 0):.1%} |")
    ci = agg.get("wilson_ci_95", {})
    lines.append(f"| Wilson 95% CI | [{ci.get('lower', 0):.1%}, {ci.get('upper', 0):.1%}] |")
    lines.append("")

    # --- Separation Score ---
    lines.append("## 2. Separation Score (Zverev et al., ICLR 2025)")
    lines.append("")
    lines.append(f"**Sep(M) = {sep.get('sep_score', 'N/A')}**")
    lines.append("")
    lines.append(f"- P(violation | data position) = {sep.get('p_data', 'N/A')}")
    lines.append(f"- P(violation | instruction position) = {sep.get('p_instr', 'N/A')}")
    lines.append(f"- Interpretation: **{sep.get('interpretation', 'N/A')}**")
    lines.append("")

    # --- Per-Chain Results ---
    lines.append("## 3. Per-Chain Violation Rates")
    lines.append("")
    lines.append("| Chain | Family | Violation Rate | Wilson 95% CI | Control Rate |")
    lines.append("|-------|--------|---------------|---------------|--------------|")

    for c in sorted(chains, key=lambda x: x.get("violation_rate", 0), reverse=True):
        cid = c.get("chain_id", "?")
        family = classify_chain(cid)
        vr = c.get("violation_rate", 0)
        ci = c.get("wilson_ci_95", {})
        cr = c.get("control_violation_rate", "N/A")
        ci_str = f"[{ci.get('lower', 0):.1%}, {ci.get('upper', 0):.1%}]"
        cr_str = f"{cr:.1%}" if isinstance(cr, (int, float)) else cr
        lines.append(f"| {cid} | {family} | {vr:.1%} | {ci_str} | {cr_str} |")
    lines.append("")

    # --- By Family ---
    lines.append("## 4. Violation Rates by Attack Family")
    lines.append("")
    family_stats = {}
    for c in chains:
        family = classify_chain(c.get("chain_id", ""))
        if family not in family_stats:
            family_stats[family] = {"violations": 0, "total": 0}
        n = c.get("n_trials", 0)
        v = int(c.get("violation_rate", 0) * n)
        family_stats[family]["violations"] += v
        family_stats[family]["total"] += n

    lines.append("| Family | Trials | Violations | Rate |")
    lines.append("|--------|--------|------------|------|")
    for fam, stats in sorted(family_stats.items(), key=lambda x: x[1]["violations"], reverse=True):
        rate = stats["violations"] / max(stats["total"], 1)
        lines.append(f"| {fam} | {stats['total']} | {stats['violations']} | {rate:.1%} |")
    lines.append("")

    # --- Conjecture Assessment ---
    lines.append("## 5. Conjecture Validation Assessment")
    lines.append("")
    global_vr = agg.get("violation_rate", 0)
    if global_vr > 0:
        lines.append("### Conjecture 1: SUPPORTED")
        lines.append(f"Violation rate = {global_vr:.1%} > 0 under δ¹ defense.")
        lines.append("Behavioral defenses (system prompt hardening) fail to guarantee Integrity(S).")
    else:
        lines.append("### Conjecture 1: NOT YET SUPPORTED")
        lines.append("No violations detected. More aggressive payloads or more trials may be needed.")
    lines.append("")

    sep_score = sep.get("sep_score", 0)
    if sep_score < 0.4:
        lines.append("### Conjecture 2: SUPPORTED")
        lines.append(f"Sep(M) = {sep_score:.4f} < 0.4 indicates WEAK separation.")
        lines.append("The model treats data-position and instruction-position inputs similarly.")
        lines.append("Delta-3 (structural external enforcement) is necessary.")
    else:
        lines.append("### Conjecture 2: PARTIAL SUPPORT")
        lines.append(f"Sep(M) = {sep_score:.4f} indicates some separation exists.")
    lines.append("")

    # --- Recommendations ---
    lines.append("## 6. Recommendations")
    lines.append("")
    lines.append("1. Run with N >= 30 trials for thesis-grade statistical rigor")
    lines.append("2. Test across multiple models (llama3.2, mistral, phi3) to eliminate single-model bias")
    lines.append("3. Add δ² bypass scenarios to demonstrate δ³ necessity")
    lines.append("4. Compute cosine similarity drift for semantic analysis")
    lines.append("5. Generate LaTeX tables from this data for thesis chapters")

    return "\n".join(lines)


def main():
    """Main entry point."""
    path = sys.argv[1] if len(sys.argv) > 1 else None
    campaign = load_campaign(path)
    report = generate_report(campaign)

    # Export
    output_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "research_archive", "data", "processed",
    )
    os.makedirs(output_dir, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(output_dir, f"analysis_{ts}.md")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"\nReport generated: {output_path}")
    print(f"({len(report)} chars, {report.count(chr(10))} lines)")


if __name__ == "__main__":
    main()
