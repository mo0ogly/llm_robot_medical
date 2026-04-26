# Results, Experiments & Telemetry Routes

12 endpoints pour l'exploration des resultats, la gestion des experiences et la telemetrie.

---

## Results (2 endpoints)

**Fichier source :** `backend/routes/results_routes.py`

### GET `/api/results`
Liste les fichiers de resultats dans `experiments/results/`.

??? example "Reponse live (2026-04-12)"

    **20 fichiers** de campagne. Extrait :

    ```json
    [
      {"name": "campaign_thesis_20260410_134913.json", "size": 534910, "modified": 1775821754.0, "type": "json"},
      {"name": "campaign_thesis_20260409_211436.json", "size": 531872, "modified": 1775762076.2, "type": "json"},
      {"name": "campaign_thesis_20260409_141438.json", "size": 538305, "modified": 1775736878.0, "type": "json"}
    ]
    ```

### GET `/api/results/{filename}`
Recupere le contenu d'un fichier de resultat.

**Response :** `{name, content, type}`

---

## Experiments (10 endpoints)

**Fichier source :** `backend/routes/results_routes.py` + `backend/routes/experiment_import_routes.py`

### GET `/api/redteam/experiments/manifest`
Manifeste des campagnes experimentales (versions, regles, metadata).

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "version": "3",
      "last_updated": "2026-04-10",
      "campaigns": ["...9 campaigns..."],
      "rules": {"..."}
    }
    ```

### GET `/api/redteam/experiments/protocols`
Liste les protocoles experimentaux definis.

??? example "Reponse live (2026-04-12)"

    ```json
    [
      {
        "filename": "protocol_RAG001.json",
        "experiment_id": "RAG-001",
        "gap_id": "G-027",
        "conjecture_id": "C2",
        "hypothesis": "Le RagSanitizer AEGIS (delta-2) reduit significativement l'ASR des attaques RAG par rapport a un pipeline RAG sans defense",
        "script": "backend/run_thesis_campaign.py",
        "parameters": {
          "chains": "rag", "n_trials": 30, "model": "llama3.2:latest",
          "aegis_shield": true, "null_control": true
        },
        "success_criteria": {
          "p_value": "<0.05", "effect_size_cohens_f": ">0.25", "aegis_violation_rate": "<0.15"
        },
        "date": "2026-04-08"
      }
    ]
    ```

### GET `/api/redteam/experiments/protocols/{experiment_id}`
Detail d'un protocole specifique.

### GET `/api/redteam/experiments/reports`
Liste les rapports d'experiences generes.

??? example "Reponse live (2026-04-12)"

    ```json
    [
      {"filename": "EXPERIMENT_REPORT_THESIS_003.md", "size": 9020, "modified": 1775762206.3},
      {"filename": "EXPERIMENT_REPORT_THESIS_002.md", "size": 6652, "modified": 1775736988.6},
      {"filename": "EXPERIMENT_REPORT_THESIS_001.md", "size": 7847, "modified": 1775727099.0},
      {"filename": "EXPERIMENT_REPORT_CROSS_MODEL.md", "size": 5332, "modified": 1775645541.1},
      {"filename": "EXPERIMENT_REPORT_TC002.md", "size": 3998},
      {"filename": "EXPERIMENT_REPORT_TC001_v2.md", "size": 2962},
      {"filename": "EXPERIMENT_REPORT_TC001.md", "size": 5100}
    ]
    ```

### GET `/api/redteam/experiments/reports/{filename}`
Contenu d'un rapport d'experience.

??? example "Reponse live (extrait THESIS_003)"

    ```json
    {
      "filename": "EXPERIMENT_REPORT_THESIS_003.md",
      "content": "# Rapport Experimental — THESIS-003 (Cross-Family Validation Qwen 3 32B)\n\n> **Modele** : qwen/qwen3-32b (Groq Cloud)\n> **N** : 30 trials x 40 chaines = **1200 runs**\n\n## Resultats Globaux\n| Total violations | **138** |\n| **ASR global** | **11.5%** |\n| IC 95% Wilson | **[9.8%, 13.4%]** |"
    }
    ```

### GET `/api/redteam/experiments/{campaign_id}/lineage`
Lineage d'une campagne : relation avec les precedentes.

### GET `/api/redteam/experiments/list`
Liste toutes les experiences importees.

??? example "Reponse live (2026-04-12)"

    ```json
    {"total": 0, "experiments": []}
    ```

### GET `/api/redteam/experiments/{experiment_id}`
Detail d'une experience importee.

### GET `/api/redteam/experiments/by-type/{exp_type}`
Filtre les experiences par type.

### GET `/api/redteam/experiments/stats/overview`
Statistiques globales des experiences.

??? example "Reponse live (2026-04-12)"

    ```json
    {"total_experiments": 0, "total_evaluations": 0, "by_type": {}}
    ```

### POST `/api/redteam/experiments/import`
Importe des resultats d'experience.

---

## Telemetry (3 endpoints)

**Fichier source :** `backend/routes/telemetry_routes.py`

### GET `/api/redteam/telemetry/stream` :material-broadcast:

Stream SSE de tous les evenements de telemetrie de l'orchestrateur et des agents.

- Rejoue le buffer existant puis streame les nouveaux evenements
- Heartbeat ping toutes les 20 secondes
- Headers : `Cache-Control: no-cache`, `X-Accel-Buffering: no`, `Connection: keep-alive`

### GET `/api/redteam/telemetry`

Snapshot du buffer de telemetrie courant (non-streaming).

??? example "Reponse live (2026-04-12)"

    ```json
    []
    ```

    Buffer vide (aucune session en cours).

### GET `/api/redteam/telemetry/health`

Health check du sous-systeme de telemetrie.

??? example "Reponse live (2026-04-12)"

    ```json
    {"status": "ok", "buffer_size": 0, "subscribers": 0}
    ```
