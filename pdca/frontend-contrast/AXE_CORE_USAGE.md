# Axe-core a11y CI baseline

**Installé** : `@axe-core/cli@4.x` (devDependency, cycle 6 PDCA).
**Scripts** : `npm run audit:a11y` + `npm run audit:a11y:full`

## Usage rapide

```bash
# 1. Démarrer le frontend (Vite doit servir sur :5173)
cd frontend && npm run dev

# 2. Dans un autre terminal, lancer l'audit a11y
cd frontend && npm run audit:a11y
```

Le script audite 3 routes (catalog, rag, analysis) contre **WCAG 2.0/2.1 niveau A + AA** et sort en code 1 si violations détectées.

## Variantes

- **`npm run audit:a11y`** — 3 routes, WCAG 2 A+AA, exit 1 si violations.
- **`npm run audit:a11y:full`** — 1 route (catalog), WCAG 2.0/2.1 A+AA, sauvegarde JSON dans `pdca/frontend-contrast/a11y-baseline.json`.

## Intégration CI

À ajouter dans `.github/workflows/` (non fait cycle 6, opt-in projet) :

```yaml
- name: Start preview server
  run: cd frontend && npm run preview &
- name: Wait for server
  run: npx wait-on http://localhost:4173
- name: Run axe a11y audit
  run: cd frontend && npm run audit:a11y
```

## Comptes attendus post-cycle 6

Sur les modals (après cycles 5+6) :
- `role="dialog"` : présent
- `aria-modal="true"` : présent
- `aria-labelledby` : référence valide
- Focus trap : actif (cycle 6)
- Escape handler : actif (cycle 5)

Sur le contraste (après cycles 1-2) :
- text-* / bg-* : WCAG AA partout (4.5:1 minimum)
- Semantic colors clampés : rt-critical, amber-700, green-700, blue-700, violet-700
- Placeholders : `#737373` opacity 0.75 = ~3.4:1 (WCAG 3:1 placeholder OK)

Violations attendues (hors scope contraste PDCA) :
- Labels i18n hardcoded sur ForgePanel, MetricsPanel, RagView
- Couleurs sémantiques de `GeneticProgressView` (Digital Twin theme, hors `.rt-root`)
- Liens sans `aria-label` éventuels

## Limites

- Axe-core CLI nécessite un browser. Chromium installé via Puppeteer (déjà dans le projet).
- Audit statique : ne teste pas les états dynamiques (modals ouverts, dropdowns, etc.). Pour ça : Playwright + `@axe-core/playwright`.
- Skip des règles éventuelles via `--disable RULE_ID` si faux positif.

## Référence

- Spec : https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
- CLI : https://github.com/dequelabs/axe-core-npm/tree/develop/packages/cli
