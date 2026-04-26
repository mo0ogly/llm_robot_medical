# RAG Routes

9 endpoints pour la gestion ChromaDB, les documents RAG et la recherche semantique.

**Fichier source :** `backend/routes/rag_routes.py`

---

## Gestion des documents

### GET `/api/rag/documents`
Liste tous les documents uniques dans la collection RAG avec le nombre de chunks.

??? example "Reponse live (2026-04-12, extrait)"

    ```json
    [
      {"id": "fiche_attaque_01", "filename": "fiche_attaque_01", "type": "text", "date": "2026-03-29", "chunk_count": 1},
      {"id": "fiche_attaque_02", "filename": "fiche_attaque_02", "type": "text", "date": "2026-03-29", "chunk_count": 1},
      {"id": "P038_2601.04666", "filename": "P038_2601.04666.pdf", "type": "pdf", "date": "2026-04-04", "chunk_count": 12}
    ]
    ```

    **30+ documents** : fiches d'attaque, papers PDF, notes de recherche.

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

??? example "Reponse live"

    ```json
    {
      "found": true,
      "n_results": 5,
      "excerpts": ["Fiche d'Attaque #11 -- GAP4 Homoglyph Attack...", "..."],
      "gap_detected": false,
      "query": "gap4 v1 homoglyph full",
      "collection": "aegis_corpus"
    }
    ```

---

## Recherche semantique

### POST `/api/rag/semantic-search`
Recherche semantique multi-collection dans ChromaDB.

| Parametre | Type | Defaut | Description |
|-----------|------|--------|-------------|
| `query` | str | requis | Requete de recherche |
| `top_k` | int | 10 | Nombre max de resultats |
| `collection` | str | "aegis_bibliography" | Collection cible |

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "query": "prompt injection medical",
      "collection": "aegis_bibliography",
      "total_hits": 10,
      "hits": [
        {
          "id": "pdf_af8a4950245ea838",
          "source": "P038_2601.04666.pdf",
          "paper_id": "P038",
          "distance": 0.376,
          "similarity": 0.624,
          "content": "Greshake, Kai, Mishra... Not what you've signed up for: Compromising real-world llm-integrated applications with indirect prompt injection..."
        }
      ]
    }
    ```

---

## Collections

### GET `/api/rag/collections`
Liste les collections ChromaDB avec statistiques.

??? example "Reponse live (2026-04-12)"

    ```json
    {
      "collections": [
        {"name": "aegis_bibliography", "chunk_count": 10783, "document_count": 287},
        {"name": "aegis_corpus", "chunk_count": 9138, "document_count": 296},
        {"name": "aegis_research_notes", "chunk_count": 12, "document_count": 0},
        {"name": "aegis_methodology_papers", "chunk_count": 136, "document_count": 0}
      ]
    }
    ```

    **Total** : 20 069 chunks, 583 documents.
