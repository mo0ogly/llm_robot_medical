# A11Y/WCAG Audit — Cycle 001

**Date** : 2026-06-03
**Périmètre** : `frontend/src/components/redteam/` (post-fix 275 substitutions)
**Méthode** : code statique + croisement avec `frontend/src/index.css:269-286` (override `.rt-root`)
**Hypothèse de fond** : palette `.rt-root` light = #fafaf8 (paper-1) / #ffffff (paper-0).

### Override `.rt-root` confirmé (index.css L269-286)
```
text-neutral-200/100 → #1f1f1f  (≈ 16.4:1 sur #fafaf8) AAA
text-neutral-300     → #424242  (≈ 9.5:1)              AAA
text-neutral-400     → #737373  (≈ 4.6:1)              AA
text-neutral-500/600 → #a3a3a3  (≈ 2.6:1)              FAIL
placeholder-neutral-500/600 → #a3a3a3                  FAIL (sur #fff = 2.85:1)
```

---

## Score global : 71/100

| Section | Score |
|---|---|
| 1. Contraste WCAG | 31/40 |
| 2. Focus states | 10/20 |
| 3. ARIA / sémantique | 13/20 |
| 4. Keyboard nav | 7/10 |
| 5. Edge case dark theme | 10/10 |

---

## 1. Contraste WCAG (31/40)

Sample : 5 vues + 2 paires critiques chacune. Ratios calculés via WCAG 2.1 formula (L1+0.05)/(L2+0.05).

| Vue | Classe texte | Classe fond | Couleur réelle (texte/fond) | Ratio | Verdict |
|---|---|---|---|---|---|
| **RagView** L141 `text-neutral-400 text-sm` | text-neutral-400 | bg-black/20 (remap rgba(10,10,10,0.04) sur paper-1) | #737373 / ≈#fafaf8 | 4.59:1 | AA |
| **RagView** L242 `text-neutral-400 text-xs font-mono` (chunk body) | text-neutral-400 | bg-neutral-950/50 (remap → #fafaf8) | #737373 / #fafaf8 | 4.59:1 | AA |
| **RagView** L367 `placeholder-neutral-400` (search input) | #a3a3a3 (input bg=#fff sans override placeholder-400) | #ffffff | #a3a3a3 / #fff | 2.83:1 | FAIL |
| **CatalogView** L171 `text-xs text-neutral-400` (badge "templates_count") | text-neutral-400 | bg-neutral-800 (remap → #f5f5f1) | #737373 / #f5f5f1 | 4.51:1 | AA |
| **CatalogView** L216 `placeholder-neutral-600` (search input) | remap → #a3a3a3 (.rt-root .placeholder-neutral-600 L286) | #ffffff (input bg) | #a3a3a3 / #fff | 2.83:1 | FAIL |
| **ExperimentDashboard** L177 `placeholder:text-neutral-700` (input search) | non remappé (CSS scope `.text-neutral-700` n'existe pas, seul `text-neutral-700` direct) → Tailwind default #404040 | #fafaf8 | #404040 / #fafaf8 | 10.3:1 | AAA |
| **ExperimentDashboard** L218 `text-[9px] text-neutral-400 font-mono` (gap meta) | text-neutral-400 | bg-cyan-500/10 sur paper | ≈#737373 / ≈#f0f8fa | 4.42:1 | AA borderline |
| **ResultExplorer** L91 (CampaignTreeView) `text-neutral-700 truncate` | non remappé → #404040 | bg-neutral-900 (remap → #fafaf8) | #404040 / #fafaf8 | 10.3:1 | AAA |
| **ResultExplorer** L184 `scrollbar-thumb-neutral-700` (cosmetic) | n/a | n/a | n/a | n/a |
| **AnalysisView** L325-335 `text-amber-400 / text-red-400 / text-green-400` cellules ASR | text-amber-400 (#fbbf24) | bg-neutral-900/50 → #fafaf8 | #fbbf24 / #fafaf8 | 1.62:1 | **FAIL** |
| **AnalysisView** L335 `text-neutral-400` (cellule N) | #737373 | #fafaf8 | 4.59:1 | AA |

**Findings critiques** :
- **F1** : 4 placeholders persistent en `#a3a3a3` (RagView L367, CatalogView L216, CatalogCrudTab L231/238, PayloadEditModal L102/132). Le fix a couvert `placeholder-neutral-700→400` (6x) mais le mapping `.rt-root .placeholder-neutral-500/600` reste #a3a3a3 = FAIL.
- **F2** : Couleurs **amber-400** (#fbbf24) et **green-400** (#4ade80) sur paper-1 = 1.6-1.8:1 = FAIL AA. Widespread dans AnalysisView, ExperimentDashboard (badges status), CatalogView (chain_id badges L68).
- **F3** : 36 occurrences résiduelles de `text-neutral-700` non remappé → tombent en Tailwind default #404040 = AAA OK (heureux accident).

**Score** : 31/40 (3 paires AAA, 4 AA, 4 FAIL).

---

## 2. Focus states (10/20)

Comptage : 30 `focus:` vs 198 `onClick` = **15.2% des handlers ont un focus visible**.

Pattern dominant : `focus:outline-none` SANS remplacement (focus invisible). Exemples :
- **RagView** L367 : `focus:border-red-900/50 focus:outline-none` → focus indiqué par border 1px sur fond clair, presque invisible (#7f0a1f/50 sur input border).
- **CatalogView** L216 : `focus:outline-none focus:border-neutral-500` → border #a3a3a3 = imperceptible.
- **ExperimentDashboard** L177 : `focus:ring-1 focus:ring-cyan-500` → OK (visible).

Boutons critiques sans focus visible :
- **AdversarialStudio.jsx L174** : `<button ...>` (panel toggle) — aucun `focus:`.
- **CatalogView.jsx L77/84** : boutons `Open in Forge` / `Launch` — visibles uniquement au `group-hover` (opacity-0 group-hover:opacity-100), donc invisibles au focus clavier seul.
- **RagView.jsx L144, L156, L177, L207** : boutons help/refresh/feedback-close/X — aucun focus state.
- **HistoryCard.jsx, ScenarioTab.jsx, RedTeamDrawer.jsx** : aucun `focus:` détecté.

`.rt-root input:focus` (index.css L298) définit `outline-color: #c41e3a` mais pas de `outline-width`/`outline-offset` → outline UA par défaut (1px), faible visibilité.

**Score** : 10/20.

---

## 3. ARIA / sémantique (13/20)

22 occurrences de `aria-*` / `role=` totales, dont 15 dans `PromptForgeMultiLLM.jsx` seul (bonne hygiène locale).

**Gaps systémiques** :
- **G1** : Aucun `role="dialog"` / `aria-modal="true"` dans les 4 modals (`ViewHelpModal`, `PayloadEditModal`, `ScenarioHelpModal`, `AdversarialStudio` Studio Help). Lecteur d'écran ne signale pas l'entrée en mode dialogue.
- **G2** : `CatalogView.jsx` L38 — `<div ... onClick={...} cursor-pointer>` (TemplateCard) = **div cliquable sans `role="button"` ni `tabIndex={0}`**. Pattern présent aussi dans RagView L399 (file list items).
- **G3** : Boutons iconographiques sans label : `<button title="...">` est insuffisant (title non lu par tous les SR). Ex : RagView L144 (`title=t('redteam.help.rag.title')` mais pas `aria-label`). 198 onClick mais seuls ~10 boutons icon-only ont `aria-label`.
- **G4** : Tabs (RagView L265-286, ExperimentDashboard) implémentés en `<button>` sans `role="tab"`, `role="tablist"`, `aria-selected`.

**Bons points** : `PromptForgeMultiLLM` exemplaire (aria-label + aria-hidden sur icônes décoratives). `RedTeamFAB` et `RedTeamLayout` mobile drawer aussi.

**Score** : 13/20.

---

## 4. Keyboard nav (7/10)

- `tabIndex` / `onKeyDown` : 2 fichiers seulement (`RagView`, `TestSuitePanel`).
- `RedTeamLayout` L142-146 : `Escape` ferme le drawer mobile — bon.
- **PayloadEditModal** (700 lignes, modal complexe) : aucun trap focus, aucun handler Escape. Tab sort du modal vers l'arrière-plan.
- **ViewHelpModal** : pas de focus trap, mais clic overlay ferme — partiel.
- Cards cliquables (TemplateCard, RagView file list) non focusables au clavier (div + onClick sans tabIndex).

**Score** : 7/10 (Escape OK sur drawer, modals sans trap, divs cliquables non-keyboard).

---

## 5. Edge case dark theme (10/10)

Vérifié : `AdversarialStudio.jsx` n'est PAS wrappé dans `.rt-root` (grep "rt-root" → 0 match dans ce fichier). Confirmé via `Grep rt-root frontend/src` qui ne renvoie que `index.css` + `RedTeamLayout.jsx`.

Sur fond Tailwind dark `bg-neutral-950` (#0a0a0a) + `text-neutral-400` (Tailwind default #a3a3a3) :
- Ratio (1+0.05)/(0.4+0.05) → calcul direct : L(#a3a3a3)=0.36, L(#0a0a0a)=0.007 → (0.36+0.05)/(0.007+0.05) = **7.2:1** → **AAA** OK.
- `text-neutral-400 / bg-neutral-900` (#171717) → 6.4:1 → AAA OK.
- `text-gray-500` (110 occurrences hors `.rt-root`) : #6b7280 sur #0a0a0a → 4.6:1 → AA OK.

**Score** : 10/10.

---

## Top 3 gaps à corriger en priorité

1. **Placeholders illisibles (4 inputs)** — Ajouter override `.rt-root .placeholder-neutral-400, .rt-root *::placeholder { color: #737373 !important; }` ou substituer `placeholder-neutral-400/600 → placeholder-neutral-500` après modification du remap (L286 → #737373). Impact : RagView search, CatalogView search, CatalogCrudTab forms, PayloadEditModal name field.
2. **Couleurs sémantiques (amber/green/red-400) sur fond light** — `text-amber-400` / `text-green-400` ratio < 2:1 sur paper-1. Soit ajouter `.rt-root .text-amber-400 { color: #b45309 !important; }` (amber-700), idem green-700/red-700 ; soit utiliser variantes `-600` dans `.rt-root` via classe conditionnelle. Concerne ExperimentDashboard badges status, AnalysisView ASR cells, CatalogView chain_id/conjecture badges.
3. **Modals sans `role="dialog"` + focus trap** — Ajouter `role="dialog"`, `aria-modal="true"`, `aria-labelledby=` sur les 4 modals (`PayloadEditModal`, `ViewHelpModal`, `ScenarioHelpModal`, `AdversarialStudio.HELP`). Coupler avec un hook `useFocusTrap()` (pattern dialog WAI-ARIA APG).

---

## Recommandations cycle 2

- **R1** Ajouter au `.rt-root` un override couleurs sémantiques (`amber-400→700`, `green-400→700`, `red-400→700`, `cyan-400→700`, `purple-400→700`) pour passer AA sur paper-1.
- **R2** Étendre `.rt-root .text-neutral-500/600` à `#737373` au lieu de `#a3a3a3` (alignement avec `text-neutral-400` et fin du FAIL). Même chose `placeholder-neutral-500/600`.
- **R3** Standardiser focus visible : créer une classe utilitaire `.rt-focus { outline: 2px solid var(--critical); outline-offset: 2px; }` à appliquer sur tous les boutons interactifs (sweep des 198 `onClick`).
- **R4** Wrapper modal réutilisable `<RtModal role="dialog" aria-modal aria-labelledby>` avec focus trap (référence : Reach UI, Radix Dialog).
- **R5** Convertir `<div onClick>` cliquables en `<button>` ou ajouter `role="button" tabIndex={0} onKeyDown={Enter/Space}` (TemplateCard, RagView file list, HistoryCard).
- **R6** Ajouter `aria-label` sur 35+ boutons icon-only (RagView, CatalogView, ExperimentDashboard headers). Pattern existant dans `PromptForgeMultiLLM` à généraliser.
- **R7** Audit suivant : tester avec `axe-core` (intégration Vite via `@axe-core/react`) pour validation runtime DOM.

---

## Notes méthodologie

- Ratios calculés depuis la palette `.rt-root` définie L269-286 + tokens `paper-1: #fafaf8`.
- 36 occurrences résiduelles `text-neutral-700` non remappées dans `.rt-root` (override absent L269-276). Tombent en Tailwind default `#404040` → ratio 10:1 sur paper-1 = AAA. Pas un bug pratique mais incohérence sémantique avec la palette éditoriale (devrait probablement être `#a3a3a3` ou `#737373` selon intention).
- Aucun fichier `.test.jsx` dans `__tests__/` ne couvre l'A11Y — gap test à signaler.
