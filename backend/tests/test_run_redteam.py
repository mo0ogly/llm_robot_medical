# backend/tests/test_run_redteam.py
"""Test du script CLI de red-teaming."""
import pytest


def test_cli_module_importable():
    """Le module run_redteam doit être importable."""
    from run_redteam import format_report_markdown
    assert callable(format_report_markdown)


def test_format_report_markdown():
    """Le rapport markdown doit être bien formaté."""
    from run_redteam import format_report_markdown
    from orchestrator import AuditReport, AuditResult
    report = AuditReport(results=[
        AuditResult(
            round_number=1,
            attack_type="prompt_leak",
            attack_message="test",
            target_response="response",
            scores={"prompt_leak": True, "rule_bypass": False, "injection_success": False,
                    "leaked_fragments": ["DVSI"], "bypassed_rules": [], "details": "leak found"},
            audit_analysis="AEGIS: Leak detected",
        )
    ])
    md = format_report_markdown(report)
    assert "# Rapport Red Team" in md
    assert "prompt_leak" in md
    assert "1/1" in md or "100" in md
