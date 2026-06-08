# Dashboard PDCA — frontend-contrast

## Progression multi-cycles

| Cycle | Date | Score | Verdict | Delta | Notes |
|-------|------|-------|---------|-------|-------|
| 001 | 2026-06-03 | **62/100** | BASELINE | — | Fix `text-neutral-500/600 → 400` (35 fichiers, 275 corrections). WCAG AA OK sur 5 routes. Reste : placeholders FAIL, semantic colors FAIL, 9 patterns d'opacité non couverts. |
| 002 | 2026-06-03 | **78/100** | ACHIEVED | **+16** | R1.1 override CSS étendu (9 opacités + 5 sémantiques + placeholders). R2.2 token `--rt-critical` consommé. R4.4 DESIGN_TOKENS.md. |
| 003 | 2026-06-03 | **86/100** | PARTIAL (-2) | **+8** | R2.3 GeneticProgressView 39 hex → THEME. R2.1 hiérarchie 3 fichiers. R4.1 `.rt-focus` global. |
| 004 | 2026-06-03 | **88/100** | PARTIAL (-4) | **+2** | R3.1 ScenarioTab 918 → 423 LOC (extraction scenarioCatalog). R4.2 RtModal a11y wrapper (168 LOC, role=dialog + focus trap). |
| 005 | (cible) | 94-98/100 | OBJECTIVE +6-10 | +6-10 | Migration RtModal 4 modals + i18n migration + axe-core CI. |

## Tendances par domaine

| Domaine | C1 | C2 | C3 | C4 | C5 cible | Notes |
|---------|----|----|----|----|----------|-------|
| a11y_wcag | 71 | 78 (+7) | 89 (+11) | **92 (+3)** | 96 | Migration RtModal = +4 ARIA |
| design_tokens | 48 | 59 (+11) | 77 (+18) | **77 (=)** | 80 | Stable, GeneticProgressView THEME documenté |
| code_hygiene | 58 | 75 (+17) | 84 (+9) | **88 (+4)** | 93 | i18n migration = +5 |
| completeness | 50 | 85 (+35) | 85 (=) | **88 (+3)** | 92 | Adoption RtModal = +4 |
| documentation | 60 | 85 (+25) | 88 (+3) | **90 (+2)** | 95 | RtModal usage examples |
| visual_recette | 100 | 100 | 100 | **100 (=)** | 100 | Stable |

## Drift / régressions historiques

| Cycle | Drift | Détail |
|-------|-------|--------|
| 001 | NONE | — |
| 002 | NONE | — |
| 003 | NONE | — |
| 004 | NONE | — |

## Open items end of cycle 004

- [ ] Migration RtModal sur 4 modals existants (ScenarioHelpModal, ViewHelpModal, PayloadEditModal, modal ForgePanel)
- [ ] R3.3 — Migrer labels i18n hardcoded (ForgePanel, MetricsPanel, RagView)
- [ ] Setup axe-core + Playwright snapshot tests (audit dédié)

## Done items (à NE PAS retoucher)

- [x] Cycle 1 : 35 fichiers `text-neutral-500/600 → 400`, `bg-neutral-900/80 → 50`, `placeholder-neutral-700 → 400`
- [x] Cycle 2 R1.1 : extension `.rt-root` override (9 opacités + 5 sémantiques + placeholders)
- [x] Cycle 2 R2.2 : token `--rt-critical` consommé pour `text-red-*` via override
- [x] Cycle 2 R4.4 : `DESIGN_TOKENS.md` (palette + WCAG + procédure)
- [x] Cycle 3 R2.3 : GeneticProgressView 39 hex → `THEME` constant (20 centralisés)
- [x] Cycle 3 R2.1 : hiérarchie restaurée MetricsPanel/ResultExplorer/AnalysisView
- [x] Cycle 3 R4.1 : `.rt-focus` global + neutralisation Tailwind `focus:outline-none`
- [x] Cycle 4 R3.1 : ScenarioTab 918 → 423 LOC (extraction `data/scenarioCatalog.js`)
- [x] Cycle 4 R4.2 : `RtModal` wrapper accessible (role=dialog + focus trap + Escape)
