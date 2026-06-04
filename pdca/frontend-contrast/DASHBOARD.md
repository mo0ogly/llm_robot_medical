# Dashboard PDCA — frontend-contrast

## Progression multi-cycles

| Cycle | Date | Score | Verdict | Delta | Notes |
|-------|------|-------|---------|-------|-------|
| 001 | 2026-06-03 | **62/100** | BASELINE | — | Fix `text-neutral-500/600 → 400` (35 fichiers, 275 corrections). WCAG AA OK sur 5 routes. Reste : placeholders FAIL, semantic colors FAIL, 9 patterns d'opacité non couverts. |
| 002 | 2026-06-03 | **78/100** | ACHIEVED | **+16** | R1.1 override CSS étendu (9 opacités + 5 sémantiques + placeholders). R2.2 token `--rt-critical` consommé. R4.4 DESIGN_TOKENS.md (145 lignes). |
| 003 | 2026-06-03 | **86/100** | PARTIAL (-2 vs cible 88) | **+8** | R2.3 GeneticProgressView 39 hex → THEME constant. R2.1 hiérarchie 3 fichiers (13 titres). R4.1 `.rt-focus` global. ScenarioTab + RtModal reportés cycle 4. |
| 004 | (cible) | 92/100 | OBJECTIVE +6 | +6 | R3.1 ScenarioTab décomposition + R4.2 RtModal + axe-core + R3.3 i18n. |

## Tendances par domaine

| Domaine | C1 | C2 | C3 | C4 cible | Notes |
|---------|----|----|----|----------|-------|
| a11y_wcag | 71 | 78 (+7) | **89 (+11)** | 92 | R4.2 RtModal = +3 |
| design_tokens | 48 | 59 (+11) | **77 (+18)** | 80 | Stable, palette ok |
| code_hygiene | 58 | 75 (+17) | **84 (+9)** | 92 | R3.1 ScenarioTab = +8 |
| completeness | 50 | 85 (+35) | **85 (=)** | 90 | Stable |
| documentation | 60 | 85 (+25) | **88 (+3)** | 90 | R3.1 doc = +2 |
| visual_recette | 100 | 100 | **100** | 100 | Stable |

## Évolutions du `SCORING_CONFIG`

- Cycle 2 : 8 nouveaux checks, poids a11y 25→30%, hygiene 20→15%
- Cycle 3 : pas de nouveau check, focus sur exécution `--fix`
- Cycle 4 prévu : ajouter A11Y-04 (focus trap modals), HYG-05 (no fichier > 700 LOC dans périmètre)

## Drift / régressions historiques

| Cycle | Drift | Détail |
|-------|-------|--------|
| 001 | NONE | — |
| 002 | NONE | — |
| 003 | NONE | — |

## Open items end of cycle 003

- [ ] R3.1 — Décomposer ScenarioTab 918 LOC (PRIORITÉ 1)
- [ ] R3.3 — Migrer labels i18n hardcoded (ForgePanel, MetricsPanel, RagView)
- [ ] R4.2 — Composant `<RtModal>` réutilisable (role=dialog + focus trap)
- [ ] Setup axe-core + Playwright snapshot tests (audit dédié)

## Done items (à NE PAS retoucher)

- [x] Cycle 1 : 35 fichiers `text-neutral-500/600 → 400`, `bg-neutral-900/80 → 50`, `placeholder-neutral-700 → 400`
- [x] Cycle 2 R1.1 : extension `.rt-root` override (9 opacités + 5 sémantiques + placeholders)
- [x] Cycle 2 R2.2 : token `--rt-critical` consommé pour `text-red-*` via override
- [x] Cycle 2 R4.4 : `DESIGN_TOKENS.md` (palette + WCAG + procédure)
- [x] Cycle 3 R2.3 : GeneticProgressView 39 hex → `THEME` constant (20 centralisés)
- [x] Cycle 3 R2.1 : hiérarchie restaurée MetricsPanel/ResultExplorer/AnalysisView (titres `#424242` AAA vs body `#737373` AA)
- [x] Cycle 3 R4.1 : `.rt-focus` global + neutralisation Tailwind `focus:outline-none`
