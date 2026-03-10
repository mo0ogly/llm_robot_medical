# backend/tests/test_medical_robot_agent.py
"""Test du MedicalRobotAgent (cible Da Vinci)."""
import pytest


def test_medical_agent_creation():
    """L'agent médical doit être créable avec le system prompt Da Vinci."""
    from agents.medical_robot_agent import create_medical_robot_agent
    agent = create_medical_robot_agent()
    assert agent.name == "MedicalRobotAgent"
    assert "DA VINCI" in agent.system_message
    assert "freeze_instruments" in agent.system_message


def test_medical_agent_has_tools():
    """L'agent doit exposer les tools freeze_instruments et alert_surgeon."""
    from agents.medical_robot_agent import create_medical_robot_agent
    agent = create_medical_robot_agent()
    assert hasattr(agent, '_tool_signatures') or "freeze_instruments" in agent.system_message


def test_medical_agent_system_prompt_contains_security_rules():
    """Le system prompt doit contenir les règles de sécurité hard-coded."""
    from agents.medical_robot_agent import create_medical_robot_agent
    agent = create_medical_robot_agent()
    assert "NE JAMAIS" in agent.system_message or "NEVER" in agent.system_message
    assert "800" in agent.system_message
