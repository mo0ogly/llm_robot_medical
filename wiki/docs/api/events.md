# Events Routes

3 endpoints pour l'historique des evenements et le streaming temps reel.

**Fichier source :** `backend/routes/events_routes.py`

---

## GET `/api/redteam/events/history`

Historique complet des evenements (experiences, alertes, campagnes).

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "events": [
        {
          "channel": "redteam.experiment_complete",
          "kind": "cyber",
          "status": "blocked",
          "ts": 1774560851.36,
          "source_file": "exp1_conjecture1_20260326_223411.json",
          "title": "Experiment · exp1_conjecture1_apt_vs_control",
          "message": "N=1"
        },
        {
          "channel": "redteam.experiment_complete",
          "kind": "cyber",
          "status": "blocked",
          "ts": 1774561084.44,
          "source_file": "exp1_conjecture1_20260326_223804.json",
          "title": "Experiment · exp1_conjecture1_apt_vs_control",
          "message": "N=5"
        }
      ],
      "total": 12
    }
    ```

---

## GET `/api/redteam/events/artefact/{source_file}`

Recupere le detail complet d'un artefact d'experience.

| Parametre | Type | Description |
|-----------|------|-------------|
| `source_file` | path | Nom du fichier source de l'evenement |

??? example "Reponse live"

    ```json
    {
      "source_file": "exp1_conjecture1_20260326_223411.json",
      "summary": {
        "channel": "redteam.experiment_complete",
        "kind": "cyber",
        "status": "blocked",
        "title": "Experiment · exp1_conjecture1_apt_vs_control",
        "message": "N=1"
      },
      "raw": {
        "experiment": "exp1_conjecture1_apt_vs_control",
        "hypothesis": "violation_rate(APT) >> violation_rate(control)",
        "attack": {
          "type": "Multi-Turn APT",
          "n": 1,
          "violations": 0,
          "violation_rate": 0.0,
          "ci_95": {"lower": 0.0, "upper": 0.7935}
        }
      },
      "size_bytes": 1547
    }
    ```

---

## GET `/api/redteam/events/stream` :material-broadcast:

Stream SSE des evenements en temps reel (experiences, alertes systeme).

**Evenements SSE :** `{channel, kind, status, ts, source_file, title, message}`
