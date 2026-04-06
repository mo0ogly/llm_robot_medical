# RAG Routes

8 endpoints pour la gestion ChromaDB et les documents RAG.

**Fichier source :** `backend/routes/rag_routes.py` (216 lignes)

---

## Gestion des documents

### GET `/api/rag/documents`
Liste tous les documents uniques dans la collection RAG avec le nombre de chunks.

**Response :** `[{id, filename, type, date, chunk_count}]`

### GET `/api/rag/documents/{filename}/chunks`
Retourne les chunks d'un document avec apercu du contenu.

| Query | Type | Defaut | Description |
|-------|------|--------|-------------|
| `limit` | int | 20 | Nombre max de chunks |

**Response :** `{filename, total_chunks, chunks: [{id, content, length, metadata, has_embedding}]}`

### POST `/api/rag/upload`
Upload, parse et indexe un document dans ChromaDB.

| Parametre | Type | Description |
|-----------|------|-------------|
| `file` | UploadFile | Fichier PDF ou texte (multipart/form-data) |

### DELETE `/api/rag/documents/{filename}`
Supprime tous les chunks d'un document specifique.

### POST `/api/rag/reset`
Vide completement la collection RAG.

---

## Seed adversarial

### POST `/api/redteam/seed-rag`
Pre-positionne un payload adversarial + references scientifiques dans ChromaDB.

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `scenario_id` | str | requis | ID du scenario |
| `chain_id` | str | "multimodal_rag" | Chaine d'attaque |

**Response :** `{status, scenario_id, chain_id, documents, total_chunks, gap_check}`

### GET `/api/redteam/seed-rag/check/{scenario_id}`
Verifie si ChromaDB a deja une couverture pour le sujet d'un scenario.

| Query | Type | Defaut | Description |
|-------|------|--------|-------------|
| `collection` | str | "aegis_corpus" | Collection a verifier |
