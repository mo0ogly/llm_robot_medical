# Template Routes

10 endpoints pour le CRUD des templates, versioning et export DOCX.

**Fichier source :** `backend/routes/template_routes.py` (176 lignes)

---

## CRUD Templates

### GET `/api/redteam/templates`
Retourne tous les templates d'attaque avec metadonnees completes.

??? example "Reponse live (2026-04-12)"

    **123 templates** retournes (inclut versions). Cles par template :

    `id, name, category, chain_id, template, variables, help, target_delta, conjecture, versions, detection_profile, taxonomy`

    Premier template : `conjecture_1_structural_bypass`

### POST `/api/redteam/templates`
Cree un nouveau template (fichiers JSON + MD dans `backend/prompts/`).

| Parametre | Type | Description |
|-----------|------|-------------|
| `id` | str | Identifiant unique (requis) |
| `name` | str | Nom du template (requis) |
| `category` | str | Categorie (requis) |
| `template` | str | Contenu du template (requis) |
| `help_content` | str | Documentation markdown (optionnel) |

### PUT `/api/redteam/templates/{template_id}`
Met a jour les champs d'un template existant.

### DELETE `/api/redteam/templates/{template_id}`
Supprime un template (fichiers JSON et MD).

---

## Help markdown

### GET `/api/redteam/templates/{template_id}/help`
Retourne le contenu MD d'aide pour un template.

??? example "Reponse live"

    ```json
    {
      "content": "# Conjecture 1: Structural Bypass (Thesis)\n\n## AEGIS Audit — SVC Score: 1.5 / 6\n\n### Classification\n| Category | `injection` |\n| Target Layer | `δ¹` |\n| Conjecture | C1 — Institutional plausibility bypasses δ¹ |\n\n### Why This Prompt Fails (ASR < 5%)\n...",
      "filename": "conjecture_1_structural_bypass.md",
      "template_id": "conjecture_1_structural_bypass"
    }
    ```

### PUT `/api/redteam/templates/{template_id}/help`
Met a jour le contenu d'aide markdown.

---

## Versioning

### GET `/api/redteam/templates/{template_id}/versions`
Retourne le template baseline et toutes ses versions evoluees.

### POST `/api/redteam/templates/{template_id}/versions`
Cree une nouvelle version pour un template (persistee sur disque).

### DELETE `/api/redteam/templates/{template_id}/versions/{version_index}`
Supprime une version specifique par index.

---

## Comparaison & Export

### GET `/api/redteam/templates/{template_id}/compare/{version_index}`
Compare les profils de detection entre le baseline (V1) et une version specifique.

### GET `/api/redteam/templates/{template_id}/export-fiche`
Exporte une fiche d'attaque au format .docx (11 sections + 2 annexes).

**Response :** Fichier DOCX en streaming (`fiche_{template_id}.docx`)
