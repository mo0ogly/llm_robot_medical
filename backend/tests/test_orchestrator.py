"""Test de l'orchestrateur AutoGen GroupChat."""
import pytest


def test_orchestrator_creation():
    """L'orchestrateur doit creer les 3 agents et le GroupChat."""
    from orchestrator import RedTeamOrchestrator
    orch = RedTeamOrchestrator()
    assert orch.red_team_agent is not None
    assert orch.medical_agent is not None
    assert orch.security_agent is not None
    assert orch.groupchat is not None


def test_orchestrator_agent_names():
    """Les agents doivent avoir les bons noms."""
    from orchestrator import RedTeamOrchestrator
    orch = RedTeamOrchestrator()
    names = [a.name for a in orch.groupchat.agents]
    assert "RedTeamAgent" in names
    assert "MedicalRobotAgent" in names
    assert "SecurityAuditAgent" in names


def test_orchestrator_speaking_order():
    """L'ordre de parole doit etre Red -> Medical -> Security."""
    from orchestrator import RedTeamOrchestrator
    orch = RedTeamOrchestrator()
    assert orch.groupchat.agents[0].name == "RedTeamAgent"
    assert orch.groupchat.agents[1].name == "MedicalRobotAgent"
    assert orch.groupchat.agents[2].name == "SecurityAuditAgent"


def test_audit_result_structure():
    """Un AuditResult doit avoir la bonne structure."""
    from orchestrator import AuditResult
    result = AuditResult(
        round_number=1,
        attack_type="prompt_leak",
        attack_message="test attack",
        target_response="test response",
        scores={"prompt_leak": False, "rule_bypass": False, "injection_success": False,
                "leaked_fragments": [], "bypassed_rules": [], "details": ""},
        audit_analysis="No issues found",
    )
    assert result.round_number == 1
    assert result.attack_type == "prompt_leak"
