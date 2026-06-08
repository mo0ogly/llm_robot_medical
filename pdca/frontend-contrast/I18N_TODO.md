# i18n hardcoded labels — TODO migration

**Cycle 6 PDCA audit** : labels UI hardcoded en anglais détectés dans le scope `redteam/`.

> Cette migration est DÉLÉGUÉE au skill `add-scenario` (ou refonte i18n dédiée). Les clés proposées suivent la convention `redteam.<view>.<area>.<key>` déjà en place.
>
> **NE PAS LIRE `frontend/src/i18n.js` ou les fichiers de valeurs** (content filter AEGIS).

## ForgePanel.jsx

| Ligne | Hardcoded | Clé proposée |
|-------|-----------|--------------|
| 572 | `Pattern` | `redteam.forge.label.pattern` |
| 660 | `Name` | `redteam.forge.label.name` |
| 669 | `Category` | `redteam.forge.label.category` |
| 681 | `Chain ID` | `redteam.forge.label.chain_id` |
| 691 | `Target Delta` | `redteam.forge.label.target_delta` |
| 702 | `Conjecture` | `redteam.forge.label.conjecture` |
| 708 | `None` (option) | `common.option.none` |

## RagView.jsx — section "Configuration Vectorielle"

| Ligne | Hardcoded | Clé proposée |
|-------|-----------|--------------|
| 332 | `Vector Store` | `redteam.view.rag.config.vector_store` |
| 336 | `Distance Metric` | `redteam.view.rag.config.distance_metric` |
| 340 | `Collection` | `redteam.view.rag.config.collection` |
| 344 | `Chunk Size` | `redteam.view.rag.config.chunk_size` |
| 348 | `Embeddings` | `redteam.view.rag.config.embeddings` |

## MetricsPanel.jsx — labels métriques

À auditer en détail (les `Sep(M) score`, `P(viol|data)`, etc. sont des termes techniques mathématiques qui peuvent légitimement rester non-traduits — discussion). Labels textuels candidats :

| Hardcoded | Notes |
|-----------|-------|
| Section titles `redteam.studio.v2.*` | DÉJÀ via `t()` cycle 1+ |
| Termes math δ⁰/⁰/Sep(M)/Wilson | Termes techniques universels, garder en l'état |
| MITRE labels (`T1565.001` etc.) | Identifiants, garder en l'état |

## Procédure de migration (skill add-scenario)

Pour chaque clé proposée :
1. Ajouter la valeur EN/FR/BR dans le fichier i18n approprié (ne PAS le faire sans le skill)
2. Remplacer le hardcoded par `{t('key.path')}`
3. Vérifier via `npm run audit:a11y` que `aria-label` (si applicable) utilise aussi t()

## Statut

**Non migré dans cycle 6 PDCA** — délégué pour préserver l'invariant content-filter et éviter de casser les rendus si des clés sont absentes du dictionnaire actuel.

**Volume estimé** : 12 strings dans 2 fichiers (ForgePanel + RagView). Effort skill add-scenario : ~15 min.
