# backend/tests/test_red_team_agent.py
"""Test du RedTeamAgent (attaquant)."""
import pytest


def test_redteam_agent_creation():
    """L'agent red team doit être créable."""
    from agents.red_team_agent import create_red_team_agent
    agent = create_red_team_agent()
    assert agent.name == "RedTeamAgent"


def test_redteam_has_attack_strategies():
    """Le system prompt doit contenir les stratégies d'attaque."""
    from agents.red_team_agent import create_red_team_agent
    agent = create_red_team_agent()
    prompt = agent.system_message
    assert "prompt injection" in prompt.lower() or "injection" in prompt.lower()
    assert "system prompt" in prompt.lower()


def test_redteam_attack_catalog():
    """Le catalogue d'attaques doit contenir les 3 catégories mesurées."""
    from agents.red_team_agent import ATTACK_CATALOG
    assert "prompt_leak" in ATTACK_CATALOG
    assert "rule_bypass" in ATTACK_CATALOG
    assert "injection" in ATTACK_CATALOG
