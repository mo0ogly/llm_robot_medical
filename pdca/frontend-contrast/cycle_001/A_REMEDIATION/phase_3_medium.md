# Phase 3 — MOYENNE (Règles AEGIS)

## R3.1 — `ScenarioTab.jsx` 918 LOC > 800 = VIOLATION

**Règle** : `.claude/rules/programming.md` "File size — 800 lines max".

Décomposer en modules logiques :
- Extraire constants → `scenarioTab.constants.js`
- Extraire sub-components (`ScenarioCard`, `ScenarioFilter`, `ScenarioSearchBar`) → `tabs/scenario/`
- Extraire hooks (`useScenarioFilters`, `useScenarioStats`) → `tabs/scenario/hooks/`

## R3.2 — Zone surveillance LOC

| Fichier | LOC | Marge avant 800 |
|---------|-----|-----------------|
| `panels/ForgePanel.jsx` | 752 | 48 |
| `AdversarialStudio.jsx` | 735 | 65 |
| `CampaignTab.jsx` | 699 | 101 |

Planifier décomposition préventive avant le prochain ajout de feature.

## R3.3 — i18n labels hardcoded

Audit : `ForgePanel`, `MetricsPanel`, `RagView` contiennent "Pattern", "Category", "Vector Store" en dur. Migrer vers `t('redteam.xxx.yyy')` + clés FR/EN/BR dans `i18n/locales/`.

⚠️ NE PAS LIRE le contenu complet d'`i18n.js` (content filter AEGIS). Travailler via les fichiers `.md` de référence.
