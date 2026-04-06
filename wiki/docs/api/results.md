# Results & Telemetry Routes

5 endpoints pour l'exploration des resultats et la telemetrie temps reel.

---

## Results (2 endpoints)

**Fichier source :** `backend/routes/results_routes.py` (53 lignes)

### GET `/api/results`
Liste les fichiers de resultats dans `experiments/results/`.

**Response :** `[{name, size, modified, type}]`

### GET `/api/results/{filename}`
Recupere le contenu d'un fichier de resultat.

**Response :** `{name, content, type}`

---

## Telemetry (3 endpoints)

**Fichier source :** `backend/routes/telemetry_routes.py` (71 lignes)

### GET `/api/redteam/telemetry/stream` :material-broadcast:

Stream SSE de tous les evenements de telemetrie de l'orchestrateur et des agents.

- Rejoue le buffer existant puis streame les nouveaux evenements
- Heartbeat ping toutes les 20 secondes
- Headers : `Cache-Control: no-cache`, `X-Accel-Buffering: no`, `Connection: keep-alive`

### GET `/api/redteam/telemetry`

Snapshot du buffer de telemetrie courant (non-streaming).

### GET `/api/redteam/telemetry/health`

Health check du sous-systeme de telemetrie.

**Response :** `{status, buffer_size, subscribers}`
