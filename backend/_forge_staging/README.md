# _forge_staging — squelettes de templates (cold-start ML)

Squelettes générés pour combler le cold-start de classification de technique
(analyse ML : `machine_learning/data/taxonomy_bridge/forge_brief_coldstart.md`).
Objectif : amener les techniques à **≥ 3 templates distincts** (condition
d'apprenabilité sous GroupKFold).

**Ces fichiers ne sont PAS chargés par la plateforme** (le catalogue lit
`prompts/*.json` ; ce dossier est hors du glob). Ce sont des squelettes à compléter.

## Contenu

| Lot | techniques | fichiers | charge |
|-----|-----------|----------|--------|
| Tier 1 (gaps δ⁰/δ³) | 3 | 127–129 | `<<FORGE>>` |
| Tier 2 (2→3 templates) | 9 | 130–138 | `<<FORGE>>` (138 = contrôle bénin, rédigé) |
| Tier 3A (familles fines) | 12 | 139–162 | `<<FORGE>>` (2 variantes a/b) |
| Tier 3B (social/indirect) | 30 | 163–222 | `<<FORGE>>` (2 variantes a/b, carrier générique) |
| Transform/encodage | 20 | `_TRANSFORM_TECHNIQUES_NOTE.md` | traitement programmatique |

## Division du travail

- **Fourni (analyse ML)** : métadonnée AEGIS complète (`taxonomy`, `target_delta`,
  `category`, `variables`, slots de contexte bénins) + carrier neutre. Aucune charge offensive.
- **À faire (toi / `aegis-prompt-forge`)** : remplir les slots `<<FORGE>>` (charge
  opératoire), dédup cosine < 0.9, déplacer le fichier complété vers `prompts/`.

## Procédure

1. `aegis-prompt-forge` (FORGE) sur un lot → remplit les `<<FORGE>>`.
2. Dédup + validation classification.
3. Déplacer vers `prompts/` (renommer en numéro de catalogue libre).
4. Côté `machine_learning` : `python data/generators/prompt_injection_aegis_aug.py`
   puis `python data/generators/verify_coldstart_lift.py --min-templates 3` → mesure le lift.
5. Itérer.
