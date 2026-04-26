# ASIDE & F46 Calibration Routes

8 endpoints pour la rotation de defenses ASIDE (Zhou et al., ICLR 2025) et la calibration F46.

---

## ASIDE — Rotation des defenses

**Fichier source :** `backend/routes/aside_routes.py`

### GET `/api/redteam/aside/rotation-schedules`

Schedules de rotation disponibles.

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "schedules": [
        {"name": "FAST", "rotate_every": 3, "description": "Rotate every 3 prompts"},
        {"name": "MEDIUM", "rotate_every": 10, "description": "Rotate every 10 prompts"},
        {"name": "SLOW", "rotate_every": 30, "description": "Rotate every 30 prompts"},
        {"name": "NONE", "rotate_every": null, "description": "Fixed defense (control)"}
      ]
    }
    ```

---

### GET `/api/redteam/aside/defense-types`

Types de defenses delta-1 pour la rotation.

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "defenses": [
        {"name": "D1_SystemPromptHardening", "description": "Strengthen system prompt with explicit role binding"},
        {"name": "D2_InstructionHierarchy", "description": "Separate system, context, and user input into explicit hierarchy"},
        {"name": "D3_SemanticRandomization", "description": "Randomize prompt structure while preserving semantics"},
        {"name": "D4_ContextInjectionDetection", "description": "Explicitly detect and mark injected context patterns"},
        {"name": "D5_TokenPatrolling", "description": "Monitor response generation for deviations from system prompt"}
      ]
    }
    ```

---

### GET `/api/redteam/aside/status/{campaign_id}`

Statut d'une campagne ASIDE en cours.

---

### POST `/api/redteam/aside/test`

Execute un test rapide avec rotation de defense.

---

### POST `/api/redteam/aside/campaign`

Lance une campagne complete ASIDE avec rotation.

---

## F46 Calibration

**Fichier source :** `backend/routes/f46_routes.py`

### GET `/api/redteam/f46-calibration/status`

Statut de la calibration F46 en cours.

??? example "Reponse live (2026-04-12)"

    ```json
    {"state": "idle", "phase": null, "progress": 0, "checkpoint": {}}
    ```

---

### GET `/api/redteam/f46-calibration/results`

Resultats de la derniere calibration F46.

??? example "Reponse live (2026-04-12)"

    ```json
    {"detail": "No calibration results yet. Run the calibration first."}
    ```

---

### POST `/api/redteam/f46-calibration/start`

Lance une calibration F46 (boucle longue, progression via `/status`).
