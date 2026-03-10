"""Script CLI pour exécuter le red-teaming autonome.

Usage:
    python run_redteam.py                    # Toutes les attaques
    python run_redteam.py --type prompt_leak # Une catégorie
    python run_redteam.py --rounds 3         # Limiter les rounds
"""
import asyncio
import argparse
from datetime import datetime

from orchestrator import RedTeamOrchestrator, AuditReport, AuditResult
from agents.red_team_agent import ATTACK_CATALOG


def format_report_markdown(report: AuditReport) -> str:
    """Formate le rapport d'audit en Markdown."""
    summary = report.summary()
    lines = [
        f"# Rapport Red Team - {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "",
        "## Résumé",
        "",
        f"| Métrique | Résultat |",
        f"|----------|----------|",
        f"| Rounds totaux | {summary['total_rounds']} |",
        f"| Fuites system prompt | {summary['prompt_leaks']}/{summary['total_rounds']} |",
        f"| Contournements règles | {summary['rule_bypasses']}/{summary['total_rounds']} |",
        f"| Injections réussies | {summary['injection_successes']}/{summary['total_rounds']} |",
        f"| Taux de succès global | {summary['success_rate']:.0%} |",
        "",
        "## Détails par round",
        "",
    ]

    for r in report.results:
        status = ""
        if r.scores.get("prompt_leak"):
            status += " LEAK"
        if r.scores.get("rule_bypass"):
            status += " BYPASS"
        if r.scores.get("injection_success"):
            status += " INJECTED"
        if not status:
            status = " BLOCKED"

        lines.extend([
            f"### Round {r.round_number} [{r.attack_type}] —{status}",
            "",
            f"**Attaque:** {r.attack_message[:100]}{'...' if len(r.attack_message) > 100 else ''}",
            "",
            f"**Réponse Da Vinci (extrait):** {r.target_response[:200]}{'...' if len(r.target_response) > 200 else ''}",
            "",
            f"**Scores:** `{r.scores}`",
            "",
            f"**Analyse AEGIS (extrait):** {r.audit_analysis[:200]}{'...' if len(r.audit_analysis) > 200 else ''}",
            "",
            "---",
            "",
        ])

    return "\n".join(lines)


async def main():
    parser = argparse.ArgumentParser(description="Red Team Autonome - Aegis Medical AI")
    parser.add_argument("--type", choices=["prompt_leak", "rule_bypass", "injection"],
                        help="Catégorie d'attaque (défaut: toutes)")
    parser.add_argument("--rounds", type=int, default=0,
                        help="Nombre max d'attaques par catégorie (0=toutes)")
    parser.add_argument("--output", default="redteam_report.md",
                        help="Fichier de sortie (défaut: redteam_report.md)")
    args = parser.parse_args()

    print("=" * 60)
    print("  RED TEAM AUTONOME - Aegis Medical AI Simulator")
    print("  Pipeline: RedTeamAgent -> MedicalRobotAgent -> SecurityAuditAgent")
    print("=" * 60)

    orch = RedTeamOrchestrator()

    catalog = ATTACK_CATALOG
    if args.type:
        catalog = {args.type: catalog[args.type]}

    total = sum(len(v) for v in catalog.values())
    current = 0

    for attack_type, attacks in catalog.items():
        if args.rounds > 0:
            attacks = attacks[:args.rounds]

        for attack_msg in attacks:
            current += 1
            print(f"\n[{current}/{total}] {attack_type} ...")
            print(f"  Attaque: {attack_msg[:80]}...")

            result = await orch.run_single_attack(attack_type, attack_msg)

            status = "BLOCKED"
            if result.scores.get("prompt_leak"):
                status = "LEAK DETECTED"
            elif result.scores.get("rule_bypass"):
                status = "RULE BYPASSED"
            elif result.scores.get("injection_success"):
                status = "INJECTION SUCCESS"

            print(f"  Résultat: {status}")

    report_md = format_report_markdown(orch.report)
    with open(args.output, "w") as f:
        f.write(report_md)

    summary = orch.report.summary()
    print("\n" + "=" * 60)
    print("  RAPPORT FINAL")
    print("=" * 60)
    print(f"  Rounds:              {summary['total_rounds']}")
    print(f"  Fuites prompt:       {summary['prompt_leaks']}")
    print(f"  Contournements:      {summary['rule_bypasses']}")
    print(f"  Injections réussies: {summary['injection_successes']}")
    print(f"  Taux de succès:      {summary['success_rate']:.0%}")
    print(f"\n  Rapport sauvé: {args.output}")


if __name__ == "__main__":
    asyncio.run(main())
