# C_GAP_REPORT — Cycle 001 (frontend-contrast)

**Score global : 62/100** (baseline)

## Synthèse des 3 agents brainstorm + recette visuelle

### CRITIQUE — fix incomplet sur 3 zones WCAG

1. **Placeholders à 2.83:1 FAIL WCAG AA**
   `placeholder-neutral-400` (→ `#a3a3a3`) reste sur fond `#fafaf8` → ratio 2.83:1 (échec WCAG AA 3:1 placeholder).
   Fichiers : `views/RagView.jsx:367`, `views/CatalogView.jsx:216`, `shared/CatalogCrudTab.jsx`, `shared/PayloadEditModal.jsx` (197, 229).
   **Origine** : le fix précédent a remplacé `placeholder-neutral-700 → placeholder-neutral-400` ; le bon choix aurait été de **garder un placeholder distinct mais lisible**. `placeholder-neutral-500` (override → `#a3a3a3`) et `placeholder-neutral-700` (Tailwind native → `#404040`) donnent les mêmes 2 extrêmes ; il manque un palier moyen.

2. **Couleurs sémantiques (amber/green/red) sur light = FAIL**
   `text-amber-400`, `text-green-400`, `text-red-400` sur fond `paper-1 #fafaf8` donnent 1.6-1.8:1 (FAIL même AA Large).
   Fichiers : `AnalysisView.jsx` (cellules ASR), badges status partout.
   **Origine** : `.rt-root` n'override PAS les classes sémantiques. Designées pour un thème dark, elles fuient sur le thème light.

3. **9 patterns d'opacité non couverts par `.rt-root` override**
   `bg-neutral-900/10..40`, `bg-neutral-950/40..50`, `bg-black/70..80`, `border-neutral-{700,800,900}/50`, `placeholder-neutral-800` — ces classes restent dark sur fond light = illisibles.
   Fichiers : `RagView.jsx` (9 occ bg-neutral-950/40), backdrops modaux (7 bg-black/70..80), bordures (7 border-neutral-{700,800,900}/50).

### HAUTE — hiérarchie visuelle écrasée

4. **3 fichiers ont perdu leur hiérarchie typographique**
   `MetricsPanel.jsx`, `ResultExplorer.jsx`, `AnalysisView.jsx` : ~90% des textes sont maintenant `text-neutral-400`. Avant fix, ils avaient 3 paliers (text-neutral-700/600/500) ; après fix, 700/400/400 = info structurale perdue (le lecteur ne distingue plus titre/sous-titre/meta).

5. **`--critical` token AEGIS jamais consommé hors RedTeamLayout**
   Le design tokens `--critical: #c41e3a` (rouge AEGIS) n'apparaît que 11 fois (toutes dans `RedTeamLayout.jsx`). Les 94 `text-red-{400,500}` utilisent `#ef4444` Tailwind = décalage de teinte ~18° vs marque AEGIS crimson.

### MOYENNE — règles AEGIS

6. **`ScenarioTab.jsx` = 918 LOC, VIOLE règle 800 LOC** (`.claude/rules/programming.md`)
   À décomposer en modules.
   Zone surveillance : `ForgePanel.jsx` (752), `AdversarialStudio.jsx` (735), `CampaignTab.jsx` (699).

7. **`GeneticProgressView.jsx` = fossile design system**
   67 couleurs hex inline (`#0a0a14`, `#e94560`, `#cbd5e1`…). Refactor en design tokens AEGIS.

8. **Labels i18n hardcoded** (hors scope contrast mais détecté en bonus)
   `ForgePanel`, `MetricsPanel`, `RagView` : "Pattern", "Category", "Vector Store" hardcoded au lieu de `t('key')`.

### BASSE — focus + ARIA

9. **Focus coverage 15%** (30 `focus:` vs 198 `onClick`). Boutons critiques sans focus visible : `CatalogView TemplateCard` (cachés en `opacity-0 group-hover`), `RagView` help/refresh/X.

10. **ARIA modal manquant** : 0 `role="dialog"` sur 4 modals. `<div onClick>` cliquables sans `role="button"` ni `tabIndex` (`TemplateCard`, `RagView` file list). Pas de focus trap.

## Acquis (à préserver)

- ✓ Fix `text-neutral-500/600 → 400` correct (4.6:1 AA sur light, 7.2:1 AAA sur dark Studio panels)
- ✓ Vite build OK (13.65s), 0 erreur runtime
- ✓ 0 régression lint (76 erreurs identiques avant/après)
- ✓ 0 dead code introduit, 35/35 fichiers ACTIF
- ✓ Git state strict : 275/275 insertions/deletions
- ✓ Toutes les 5 routes échantillonnées rendent correctement
- ✓ Theme parity OK (Studio/AdversarialStudio sous `.rt-root` AAA)
