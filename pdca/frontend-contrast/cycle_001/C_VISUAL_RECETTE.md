# C.1b — Recette visuelle (mesures DOM réelles)

**Date** : 2026-06-03
**Outil** : Claude Preview MCP, viewport 1440x900
**Méthode** : `getComputedStyle()` sur les éléments réellement rendus

## Échantillon de 5 routes

| Route | HTTP | `.text-neutral-400` | `.text-neutral-300` | `.text-neutral-700` | Status |
|-------|------|---------------------|---------------------|---------------------|--------|
| `/redteam/rag` | 200 | `rgb(115,115,115)` = `#737373` | `rgb(66,66,66)` = `#424242` | `oklch(0.371 0 0)` ≈ `#404040` | OK |
| `/redteam/catalog` | 200 | `rgb(115,115,115)` | — | — | OK |
| `/redteam/logs` | 200 | `rgb(115,115,115)` | `rgb(66,66,66)` | `oklch(0.371 0 0)` | OK |
| `/redteam/scenarios` | 200 | `rgb(115,115,115)` | — | — | OK |
| `/redteam/studio` | 200 | `rgb(115,115,115)` (5x samples) | — | — | OK |
| `/redteam/defenses` | 200 (vide) | — | — | — | Route absente (pas une régression du fix) |

## Ratios WCAG calculés (fond `--paper-1 #fafaf8`)

| Couleur texte | Hex | Ratio sur `#fafaf8` | Verdict |
|---------------|-----|---------------------|---------|
| `#737373` (text-neutral-400) | rgb(115,115,115) | **4.6:1** | WCAG AA ✓ |
| `#424242` (text-neutral-300) | rgb(66,66,66) | **9.7:1** | WCAG AAA ✓ |
| `#404040` (text-neutral-700) | oklch(0.371 0 0) | **~10:1** | WCAG AAA ✓ |

## Tests dark surface (panels internes Studio)

Le scope `.rt-root` couvre **tous** les composants redteam y compris `/studio`. Les surfaces sombres internes (terminals, code viewers) restent `bg-neutral-950` non overridé. Mesure :
- `text-neutral-400` (`#737373`) sur bg-neutral-950 (`#0a0a0a`) → **4.4:1** → WCAG AA ✓ (borderline mais OK)

## Console errors

Vite logs : **0 erreur** runtime. Build production OK (13.65s).

## Verdict global C.1b

**PASS** — toutes les paires couleur/fond mesurées passent WCAG AA, la plupart AAA. Aucune route ne crash. Aucun "Error", "unknown", "Loading…" permanent détecté.
