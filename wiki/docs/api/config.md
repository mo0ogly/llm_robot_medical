# Config & Taxonomy Routes

16 endpoints pour la configuration, taxonomie, catalogue et providers.

**Fichier source :** `backend/routes/config_routes.py` (208 lignes)

---

## Configuration

### GET `/api/redteam/config/retex-patterns`
Retourne les patterns RETEX depuis le fichier de configuration.

### GET `/api/redteam/config/dim-weights`
Retourne les labels et poids des 6 dimensions SVC depuis `dim_config.json`.

### GET `/api/redteam/config/detection-baseline`
Retourne les probabilites de detection de base depuis `detection_baseline.json`.

---

## Providers & Modeles

### GET `/api/redteam/providers`
Liste les providers LLM disponibles et leurs modeles.

### GET `/api/redteam/models-config`
Configuration multi-modeles complete (profils + parametres experimentaux).

### PUT `/api/redteam/models-config/active`
Definit le profil de modeles actif.

| Parametre | Type | Description |
|-----------|------|-------------|
| `profile_id` | str | ID du profil a activer (requis) |

---

## Catalogue d'attaques

### GET `/api/redteam/catalog`
Retourne les payloads d'attaque groupes par categorie (format legacy).

### POST `/api/redteam/catalog/{category}`
Ajoute une nouvelle attaque au catalogue (runtime, non persistee).

| Parametre | Type | Description |
|-----------|------|-------------|
| `category` | path | Categorie cible |
| `name` | body | Nom de l'attaque |
| `message` | body | Payload |
| `help_md` | body | Documentation markdown (optionnel) |

### PUT `/api/redteam/catalog/{category}/{index}`
Met a jour un template d'attaque existant.

### DELETE `/api/redteam/catalog/{category}/{index}`
Supprime une attaque du catalogue.

### POST `/api/redteam/catalog/import`
Importe un catalogue complet (remplace l'existant).

---

## Taxonomie CrowdStrike

### GET `/api/redteam/taxonomy`
Retourne l'arbre taxonomique complet (4 niveaux, 95 techniques).

### GET `/api/redteam/taxonomy/flat`
Retourne un index plat : `{technique_id: {class_id, category_id, ...}}`.

### GET `/api/redteam/taxonomy/coverage`
Retourne les statistiques de couverture : total, covered, percentage, by_class, gaps.

### GET `/api/redteam/taxonomy/tree`
Retourne l'arbre taxonomique avec les templates attaches aux feuilles techniques.
