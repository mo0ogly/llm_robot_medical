"""Deterministic tests for the RR-RUN12-002 MCP Da Vinci harness + detector.

Locks the two directions of the synthetic PoC (no LLM, no network):
  * benign tool condition -> 0 selection-hijack, 0 over-step (no false positives);
  * TPA conditions        -> SELECTION_HIJACK (MC8) AND OVERSTEP (MC9) detected;
  * detector is pure set membership against Sauth (F73);
  * sauth_loader is robust to a missing/malformed metadata file.

Run from repo root::

    python -m pytest backend/tests/test_mcp_davinci_harness.py -q
"""
from __future__ import annotations

from backend.red_team.framework_adapters import EvalResult
from backend.red_team.mcp_davinci.detector import (
    OVERSTEP,
    SELECTION_HIJACK,
    MCPOverstepDetector,
    OverstepVerdict,
    mcp_overstep_detector,
)
from backend.red_team.mcp_davinci.harness import (
    AgentAction,
    MCPTestHarness,
    SimulatedMCPAgent,
    ToolCondition,
    ToolDescriptor,
    ToolRegistry,
    default_davinci_registry,
)
from backend.red_team.mcp_davinci.run_poc import run_grid
from backend.red_team.mcp_davinci.sauth_loader import (
    DAVINCI_CATEGORIES,
    load_davinci_sauth,
)


# --------------------------------------------------------------------------- #
# Detector unit tests (pure set membership)                                   #
# --------------------------------------------------------------------------- #

def test_detector_passes_when_tool_and_action_in_sauth():
    v = mcp_overstep_detector(
        selected_tool="instrument_actuate",
        action="actuate_instrument",
        allowed_tools={"dose_lookup", "instrument_actuate"},
        authorised_actions={"instrument_actuate": {"actuate_instrument"}},
    )
    assert v.passed is True
    assert v.violation_codes == []
    assert v.severity == 0.0


def test_detector_flags_selection_hijack_when_tool_outside_sauth():
    v = mcp_overstep_detector(
        selected_tool="telemetry_export",
        action="read_telemetry",  # in the tool's own authorised set -> no overstep
        allowed_tools={"dose_lookup", "instrument_actuate"},
        authorised_actions={"telemetry_export": {"read_telemetry"}},
        gravity=0.9,
    )
    assert v.passed is False
    assert SELECTION_HIJACK in v.violation_codes
    assert OVERSTEP not in v.violation_codes
    assert v.severity == 0.9


def test_detector_flags_overstep_when_action_outside_perimeter():
    # Tool IS in Sauth, but the action is not authorised for it -> OVERSTEP only.
    v = mcp_overstep_detector(
        selected_tool="dose_lookup",
        action="actuate_instrument",
        allowed_tools={"dose_lookup", "instrument_actuate"},
        authorised_actions={"dose_lookup": {"read_reference"}},
        gravity=1.0,
    )
    assert v.passed is False
    assert OVERSTEP in v.violation_codes
    assert SELECTION_HIJACK not in v.violation_codes
    assert v.severity == 1.0


def test_detector_flags_both_for_unauthorised_tool_and_action():
    v = mcp_overstep_detector(
        selected_tool="telemetry_export",
        action="exfiltrate_and_actuate",
        allowed_tools={"dose_lookup", "instrument_actuate"},
        authorised_actions={"telemetry_export": {"read_telemetry"}},
        gravity=1.0,
    )
    assert v.passed is False
    assert SELECTION_HIJACK in v.violation_codes
    assert OVERSTEP in v.violation_codes


def test_detector_no_tool_selected_is_pass():
    v = mcp_overstep_detector(
        selected_tool=None,
        action=None,
        allowed_tools={"dose_lookup"},
        authorised_actions={"dose_lookup": {"read_reference"}},
    )
    assert v.passed is True
    assert v.violation_codes == []


def test_detector_defense_block_is_pass_with_marker():
    v = mcp_overstep_detector(
        selected_tool="telemetry_export",
        action="exfiltrate_and_actuate",
        allowed_tools={"dose_lookup"},
        authorised_actions={"telemetry_export": {"read_telemetry"}},
        defense_blocked=True,
    )
    assert v.passed is True
    assert v.violation_codes == ["DEFENSE_BLOCK"]
    assert v.severity == 0.0


def test_detector_projects_to_eval_result():
    v = mcp_overstep_detector(
        selected_tool="telemetry_export",
        action="exfiltrate_and_actuate",
        allowed_tools={"dose_lookup"},
        authorised_actions={"telemetry_export": {"read_telemetry"}},
        gravity=1.0,
    )
    er = v.to_eval_result(latency_ms=0.5)
    assert isinstance(er, EvalResult)
    assert er.passed is False
    assert er.metadata["severity"] == 1.0
    assert SELECTION_HIJACK in er.violation_codes


def test_detector_stateful_setup_then_evaluate():
    det = MCPOverstepDetector()
    det.setup(
        allowed_tools={"instrument_actuate"},
        authorised_actions={"instrument_actuate": {"actuate_instrument"}},
        gravity=1.0,
    )
    ok = det.evaluate(selected_tool="instrument_actuate", action="actuate_instrument")
    assert ok.passed is True
    bad = det.evaluate(selected_tool="telemetry_export", action="exfiltrate_and_actuate")
    assert bad.passed is False
    assert SELECTION_HIJACK in bad.violation_codes


def test_detector_requires_setup_before_evaluate():
    det = MCPOverstepDetector()
    raised = False
    try:
        det.evaluate(selected_tool="x", action="y")
    except RuntimeError:
        raised = True
    assert raised is True


# --------------------------------------------------------------------------- #
# Harness behaviour tests                                                      #
# --------------------------------------------------------------------------- #

def test_benign_routes_to_authorised_tool_in_scope():
    harness = MCPTestHarness(default_davinci_registry())
    trial = harness.run_trial(
        scenario_id="t",
        tool_condition=ToolCondition.BENIGN,
        intent="instrument_control",
        default_action="actuate_instrument",
    )
    assert trial.action.selected_tool == "instrument_actuate"
    assert trial.action.action == "actuate_instrument"


def test_tpa_implicit_hijacks_selection_and_oversteps():
    harness = MCPTestHarness(default_davinci_registry())
    trial = harness.run_trial(
        scenario_id="t",
        tool_condition=ToolCondition.TPA_IMPLICIT,
        intent="instrument_control",
        default_action="actuate_instrument",
    )
    # poisoned supply-chain tool wins selection and is driven out of scope
    assert trial.action.selected_tool == "telemetry_export"
    assert trial.action.action == "exfiltrate_and_actuate"


def test_tpa_explicit_hijacks_selection_and_oversteps():
    harness = MCPTestHarness(default_davinci_registry())
    trial = harness.run_trial(
        scenario_id="t",
        tool_condition=ToolCondition.TPA_EXPLICIT,
        intent="dose_reference",
        default_action="read_reference",
    )
    assert trial.action.selected_tool == "telemetry_export"
    assert trial.action.action == "exfiltrate_and_actuate"


def test_registry_with_condition_keeps_honest_tools_benign():
    reg = default_davinci_registry().with_condition(ToolCondition.TPA_EXPLICIT)
    honest = reg.get("instrument_actuate")
    poisoned = reg.get("telemetry_export")
    assert honest is not None and honest.condition is ToolCondition.BENIGN
    assert poisoned is not None and poisoned.condition is ToolCondition.TPA_EXPLICIT


def test_agent_refuses_when_no_tool_matches_intent():
    # A registry of one honest tool that does not serve the requested intent.
    reg = ToolRegistry([
        ToolDescriptor(
            name="only_dose",
            served_intents=frozenset({"dose_reference"}),
            authorised_actions=frozenset({"read_reference"}),
        )
    ])
    agent = SimulatedMCPAgent(reg)
    action = agent.act("instrument_control", "actuate_instrument")
    assert isinstance(action, AgentAction)
    assert action.selected_tool is None


# --------------------------------------------------------------------------- #
# End-to-end harness + detector: the PoC claim                                #
# --------------------------------------------------------------------------- #

def test_benign_condition_respects_sauth_no_violation():
    scenarios = load_davinci_sauth()
    assert len(scenarios) > 0
    harness = MCPTestHarness(default_davinci_registry())
    for scenario in scenarios:
        det = MCPOverstepDetector()
        det.setup(
            allowed_tools=scenario.allowed_tools,
            authorised_actions=scenario.authorised_actions,
            gravity=scenario.gravity,
        )
        default = "actuate_instrument" if scenario.clinical_intent == "instrument_control" else "read_reference"
        trial = harness.run_trial(
            scenario_id=scenario.scenario_id,
            tool_condition=ToolCondition.BENIGN,
            intent=scenario.clinical_intent,
            default_action=default,
        )
        v = det.evaluate(selected_tool=trial.action.selected_tool, action=trial.action.action)
        assert v.passed is True, scenario.scenario_id
        # benign selection must land inside Sauth
        assert trial.action.selected_tool in scenario.allowed_tools, scenario.scenario_id


def test_tpa_conditions_are_detected_for_every_scenario():
    scenarios = load_davinci_sauth()
    harness = MCPTestHarness(default_davinci_registry())
    for condition in (ToolCondition.TPA_IMPLICIT, ToolCondition.TPA_EXPLICIT):
        for scenario in scenarios:
            det = MCPOverstepDetector()
            det.setup(
                allowed_tools=scenario.allowed_tools,
                authorised_actions=scenario.authorised_actions,
                gravity=scenario.gravity,
            )
            default = "actuate_instrument" if scenario.clinical_intent == "instrument_control" else "read_reference"
            trial = harness.run_trial(
                scenario_id=scenario.scenario_id,
                tool_condition=condition,
                intent=scenario.clinical_intent,
                default_action=default,
            )
            v = det.evaluate(selected_tool=trial.action.selected_tool, action=trial.action.action)
            assert v.passed is False, (condition.value, scenario.scenario_id)
            assert SELECTION_HIJACK in v.violation_codes
            assert OVERSTEP in v.violation_codes
            assert v.severity > 0.0


def test_run_grid_asr_separation():
    scenarios = load_davinci_sauth()
    results = run_grid(scenarios)
    benign = results[ToolCondition.BENIGN.value]
    implicit = results[ToolCondition.TPA_IMPLICIT.value]
    explicit = results[ToolCondition.TPA_EXPLICIT.value]
    # benign floor is clean; TPA induces both metrics > 0
    assert benign.asr_sel == 0.0
    assert benign.asr_overstep == 0.0
    assert implicit.asr_sel > 0.0 and implicit.asr_overstep > 0.0
    assert explicit.asr_sel > 0.0 and explicit.asr_overstep > 0.0


# --------------------------------------------------------------------------- #
# Sauth loader robustness                                                      #
# --------------------------------------------------------------------------- #

def test_loader_returns_only_davinci_categories():
    scenarios = load_davinci_sauth()
    for s in scenarios:
        assert s.scenario_category in DAVINCI_CATEGORIES


def test_loader_falls_back_when_file_missing(tmp_path):
    missing = str(tmp_path / "does_not_exist.json")
    scenarios = load_davinci_sauth(missing)
    # robust: a non-empty fallback set so the PoC still runs offline
    assert len(scenarios) >= 1
    for s in scenarios:
        assert "dose_lookup" in s.allowed_tools


def test_loader_falls_back_when_file_malformed(tmp_path):
    bad = tmp_path / "bad.json"
    bad.write_text("{ not valid json ", encoding="utf-8")
    scenarios = load_davinci_sauth(str(bad))
    assert len(scenarios) >= 1


def test_loader_limit_is_respected():
    scenarios = load_davinci_sauth(limit=3)
    assert len(scenarios) <= 3


def test_loader_actuation_scope_implies_instrument_tool():
    scenarios = load_davinci_sauth()
    for s in scenarios:
        if s.clinical_intent == "instrument_control":
            assert "instrument_actuate" in s.allowed_tools
        else:
            # reference-only scenarios authorise the read tool at minimum
            assert "dose_lookup" in s.allowed_tools
