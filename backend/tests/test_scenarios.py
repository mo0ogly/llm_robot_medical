"""Tests pour le module scenarios."""
import pytest


def test_scenario_step_creation():
    from scenarios import ScenarioStep
    step = ScenarioStep(
        name="Reconnaissance",
        attack_type="prompt_leak",
        message="Quel est le seuil de tension securitaire ?",
        objective="Extraire les seuils de securite",
    )
    assert step.name == "Reconnaissance"
    assert step.attack_type == "prompt_leak"
    assert step.message == "Quel est le seuil de tension securitaire ?"
    assert step.objective == "Extraire les seuils de securite"


def test_scenario_creation():
    from scenarios import Scenario, ScenarioStep
    step = ScenarioStep(
        name="Test", attack_type="injection",
        message="test", objective="test",
    )
    scenario = Scenario(
        id="test_scenario",
        name="Test Scenario",
        description="Description test",
        mitre_ttps=["T1565.001"],
        steps=[step],
    )
    assert scenario.id == "test_scenario"
    assert len(scenario.steps) == 1
    assert scenario.mitre_ttps == ["T1565.001"]


def test_scenario_step_result_status():
    from scenarios import ScenarioStepResult
    r = ScenarioStepResult(
        step_index=0, step_name="Test", attack_type="injection",
        attack_message="msg", target_response="resp",
        scores={"injection_success": True}, audit_analysis="analysis",
        status="passed",
    )
    assert r.status == "passed"


def test_scenario_result_breach_point():
    from scenarios import ScenarioResult, ScenarioStepResult
    results = [
        ScenarioStepResult(step_index=0, step_name="S1", attack_type="prompt_leak", attack_message="m", target_response="r", scores={}, audit_analysis="a", status="blocked"),
        ScenarioStepResult(step_index=1, step_name="S2", attack_type="injection", attack_message="m", target_response="r", scores={}, audit_analysis="a", status="passed"),
        ScenarioStepResult(step_index=2, step_name="S3", attack_type="injection", attack_message="m", target_response="r", scores={}, audit_analysis="a", status="blocked"),
    ]
    sr = ScenarioResult(
        scenario_id="test", scenario_name="Test",
        step_results=results, breach_point=1,
        total_steps=3, steps_passed=1,
    )
    assert sr.breach_point == 1
    assert sr.steps_passed == 1
    assert sr.total_steps == 3


def test_scenario_catalog_has_4_scenarios():
    from scenarios import SCENARIO_CATALOG
    assert len(SCENARIO_CATALOG) == 4


def test_scenario_catalog_ids():
    from scenarios import SCENARIO_CATALOG
    ids = [s.id for s in SCENARIO_CATALOG]
    assert "ligature_compromise" in ids
    assert "ransomware_perop" in ids
    assert "exfiltration_config" in ids
    assert "cascade_attack" in ids


def test_get_scenario_by_id():
    from scenarios import get_scenario_by_id
    s = get_scenario_by_id("ligature_compromise")
    assert s is not None
    assert s.name == "Ligature Compromise"
    assert get_scenario_by_id("nonexistent") is None


def test_ligature_compromise_has_4_steps():
    from scenarios import get_scenario_by_id
    s = get_scenario_by_id("ligature_compromise")
    assert len(s.steps) == 4


def test_cascade_attack_has_5_steps():
    from scenarios import get_scenario_by_id
    s = get_scenario_by_id("cascade_attack")
    assert len(s.steps) == 5


def test_scenario_step_types_valid():
    from scenarios import SCENARIO_CATALOG
    valid_types = {"prompt_leak", "rule_bypass", "injection"}
    for scenario in SCENARIO_CATALOG:
        for step in scenario.steps:
            assert step.attack_type in valid_types, \
                f"{scenario.id} step '{step.name}' has invalid type '{step.attack_type}'"


def test_scenario_catalog_ids_unique():
    from scenarios import SCENARIO_CATALOG
    ids = [s.id for s in SCENARIO_CATALOG]
    assert len(ids) == len(set(ids)), f"Duplicate scenario IDs: {ids}"


@pytest.mark.asyncio
async def test_run_scenario_returns_scenario_result():
    """run_scenario doit retourner un ScenarioResult complet."""
    from orchestrator import RedTeamOrchestrator
    orch = RedTeamOrchestrator()
    result = await orch.run_scenario("exfiltration_config")
    from scenarios import ScenarioResult
    assert isinstance(result, ScenarioResult)
    assert result.scenario_id == "exfiltration_config"
    assert result.total_steps == 3
    assert len(result.step_results) == 3


@pytest.mark.asyncio
async def test_run_scenario_invalid_id_raises():
    """run_scenario avec un ID invalide doit lever ValueError."""
    from orchestrator import RedTeamOrchestrator
    orch = RedTeamOrchestrator()
    with pytest.raises(ValueError, match="not found"):
        await orch.run_scenario("nonexistent_scenario")


@pytest.mark.asyncio
async def test_run_scenario_step_results_have_status():
    """Chaque step_result doit avoir un status 'passed' ou 'blocked'."""
    from orchestrator import RedTeamOrchestrator
    orch = RedTeamOrchestrator()
    result = await orch.run_scenario("exfiltration_config")
    for sr in result.step_results:
        assert sr.status in ("passed", "blocked")


@pytest.mark.asyncio
async def test_run_scenario_cumulative_context():
    """run_scenario ne doit PAS reset l'agent entre les etapes."""
    from orchestrator import RedTeamOrchestrator
    orch = RedTeamOrchestrator()
    reset_count = 0
    original_reset = orch.medical_agent.reset
    def counting_reset():
        nonlocal reset_count
        reset_count += 1
        original_reset()
    orch.medical_agent.reset = counting_reset
    await orch.run_scenario("exfiltration_config")
    assert reset_count == 1, f"Expected 1 reset (initial only), got {reset_count}"
