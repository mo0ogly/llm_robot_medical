"""ASIDE Defense Rotation API Routes.

Endpoints for adaptive separation defense experiments:
- /api/redteam/aside/test — Test attack against rotating defense
- /api/redteam/aside/campaign — Full campaign with rotation metrics
- /api/redteam/aside/status — Status of ASIDE experiments
"""

import json
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..agents.aside_defense_rotator import (
    RotationConfig,
    RotationSchedule,
    DefenseType,
    apply_defense,
)

router = APIRouter(prefix="/api/redteam/aside", tags=["aside"])


class ASIDETestRequest(BaseModel):
    """Request to test attack against ASIDE defense."""
    system_prompt: str
    attack_payload: str
    defense_types: list[str] = ["D1_SystemPromptHardening", "D2_InstructionHierarchy"]
    schedule: str = "MEDIUM"  # FAST, MEDIUM, SLOW, NONE
    num_rounds: int = 30


class DefenseRotationResponse(BaseModel):
    """Response showing defense rotation."""
    round: int
    active_defense: str
    defended_prompt: str
    prompt_length: int


class ASIDECampaignRequest(BaseModel):
    """Request to run full ASIDE campaign."""
    attack_payloads: list[str]
    num_variants: int = 5
    rotation_schedules: list[str] = ["FAST", "MEDIUM", "SLOW", "NONE"]
    num_rounds: int = 30


class ASIDECampaignResponse(BaseModel):
    """Response from ASIDE campaign."""
    campaign_id: str
    total_payloads: int
    total_variants: int
    rotation_schedules: list[str]
    num_rounds_per_schedule: int
    total_expected_runs: int
    status: str  # "QUEUED", "RUNNING", "COMPLETED"


@router.post("/test", response_model=list[DefenseRotationResponse])
async def test_aside_rotation(request: ASIDETestRequest):
    """Test attack against rotating ASIDE defenses.

    Returns rotation sequence with defended prompts.
    """
    try:
        # Parse schedule
        schedule_map = {
            "FAST": RotationSchedule.FAST,
            "MEDIUM": RotationSchedule.MEDIUM,
            "SLOW": RotationSchedule.SLOW,
            "NONE": RotationSchedule.NONE,
        }
        schedule = schedule_map.get(request.schedule, RotationSchedule.MEDIUM)

        # Parse defense types
        defense_types = [
            getattr(DefenseType, dt.upper())
            for dt in request.defense_types
            if hasattr(DefenseType, dt.upper())
        ]

        if not defense_types:
            raise ValueError("No valid defense types provided")

        # Create rotation config
        config = RotationConfig(
            active_defenses=defense_types,
            schedule=schedule,
        )

        # Run rotation sequence
        results = []
        for round_idx in range(request.num_rounds):
            defense = config.next_defense()
            defended = apply_defense(
                defense,
                system_prompt=request.system_prompt,
                user_input=request.attack_payload,
            )

            results.append(
                DefenseRotationResponse(
                    round=round_idx + 1,
                    active_defense=defense.value,
                    defended_prompt=defended,
                    prompt_length=len(defended),
                )
            )

        return results

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/campaign", response_model=ASIDECampaignResponse)
async def launch_aside_campaign(request: ASIDECampaignRequest):
    """Launch full ASIDE campaign with adaptive attacks.

    This is a placeholder for campaign orchestration.
    Actual execution happens via background task (see orchestrator.py).
    """
    campaign_id = f"aside_campaign_{json.dumps(request.rotation_schedules[:1]).replace('"', '')}"

    # Calculate expected runs
    # For each payload:
    #   - num_variants adaptive variants
    #   - per variant × num_rotation_schedules × num_rounds_per_schedule
    total_expected_runs = (
        request.num_variants
        * len(request.rotation_schedules)
        * request.num_rounds
    )

    return ASIDECampaignResponse(
        campaign_id=campaign_id,
        total_payloads=len(request.attack_payloads),
        total_variants=request.num_variants,
        rotation_schedules=request.rotation_schedules,
        num_rounds_per_schedule=request.num_rounds,
        total_expected_runs=total_expected_runs,
        status="QUEUED",
    )


@router.get("/status/{campaign_id}")
async def get_campaign_status(campaign_id: str):
    """Get status of ASIDE campaign.

    Returns progress, estimated time remaining, and intermediate results.
    """
    return {
        "campaign_id": campaign_id,
        "status": "NOT_IMPLEMENTED",
        "message": "Campaign monitoring requires integration with orchestrator.py",
    }


@router.get("/rotation-schedules")
async def list_rotation_schedules():
    """List available rotation schedules."""
    return {
        "schedules": [
            {"name": "FAST", "rotate_every": 3, "description": "Rotate every 3 prompts"},
            {"name": "MEDIUM", "rotate_every": 10, "description": "Rotate every 10 prompts"},
            {"name": "SLOW", "rotate_every": 30, "description": "Rotate every 30 prompts"},
            {"name": "NONE", "rotate_every": None, "description": "Fixed defense (control)"},
        ]
    }


@router.get("/defense-types")
async def list_defense_types():
    """List available defense types."""
    return {
        "defenses": [
            {
                "name": "D1_SystemPromptHardening",
                "description": "Strengthen system prompt with explicit role binding",
            },
            {
                "name": "D2_InstructionHierarchy",
                "description": "Separate system, context, and user input into explicit hierarchy",
            },
            {
                "name": "D3_SemanticRandomization",
                "description": "Randomize prompt structure while preserving semantics",
            },
            {
                "name": "D4_ContextInjectionDetection",
                "description": "Explicitly detect and mark injected context patterns",
            },
            {
                "name": "D5_TokenPatrolling",
                "description": "Monitor response generation for deviations from system prompt",
            },
        ]
    }
