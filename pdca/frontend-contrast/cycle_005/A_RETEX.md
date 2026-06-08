# A_RETEX — Cycle 005 frontend-contrast

**Date** : 2026-06-03
**Score** : 90/100 (cible : 94, MISSED -4)
**Delta** : +2 pts vs cycle 4 (88/100), +28 pts vs baseline cycle 1 (62/100)
**Mode** : `--fix` exécuté
**Fichiers touchés** : 4 (tous modifiés in-place, 0 nouveau)

## Ce qui a marché

1. **Migration a11y in-place (vs full RtModal swap)** — Au lieu de remplacer chaque modal par `<RtModal>` (risque visuel sur sizes/animations/headers custom), j'ai ajouté les attributs ARIA et l'Escape handler DIRECTEMENT sur les structures existantes. Le visuel reste 100% intact, le score ARIA passe à 20/20.
2. **Pattern identique sur 4 modals** — `useId()` pour le titleId, `useEffect` pour l'Escape, `role="dialog"` + `aria-modal` + `aria-labelledby` sur le panel, `role="presentation"` sur le backdrop, `aria-label` sur bouton close. Cohérent et reviewable.
3. **Build 2x OK** — 12.95s puis 12.84s. Pas de régression d'import. Le code utilise `useId` et `useEffect` déjà présents dans `react` (juste ajoutés aux imports nommés existants).
4. **5/5 verification gates** — build, import, recount (4/4 dialogs), smoke. Aucun warning console.

## Ce qui n'a pas été fait (volontairement)

- **Focus trap complet** — Implémenter le Tab/Shift+Tab cycle aurait nécessité ~25 LOC par modal (querySelector + event listener Tab). Non critique pour WCAG AA, mais requis pour AAA. `RtModal` (cycle 4) l'a, mais migration vers RtModal restée bloquée par les structures custom des consumers.
- **R3.3 i18n migration** — Délégué au skill `add-scenario` (sort du scope contraste).
- **Axe-core CI** — Tooling dédié.
- **GeneticProgressView `var(--genetic-*)` migration** — Refactor design séparé.

## Causes du miss (-4 vs cible 94)

| Domaine | Cible | Atteint | Gap |
|---------|-------|---------|-----|
| a11y_wcag | 96 | 96 | OK |
| design_tokens | 80 | 77 | -3 (GeneticProgressView THEME compte leakage) |
| code_hygiene | 93 | 88 | -5 (i18n hardcoded encore 3/10) |
| completeness | 92 | 91 | -1 |
| autres | — | — | OK |

Net : -4. La part fixe restante = i18n + GeneticProgressView, ni l'un ni l'autre dans le périmètre du "contrast PDCA".

## Drift / régressions

**Aucune** :
- Builds : OK (12.95s, 12.84s)
- Imports : useEffect/useId déjà disponibles via 'react'
- Visuel : aucune classe Tailwind modifiée (juste attributs ARIA)

## Décisions journalisées

| Décision | Phase | Justification |
|----------|-------|---------------|
| Migration in-place vs full RtModal swap | A.1 | RtModal a sa propre structure (sizes, header). Migration = refactor visuel risqué. Ajouter ARIA in-place = même gain a11y, 0 risque visuel. |
| Pas de focus trap implémenté | A.2 | Compromis effort/gain : focus trap = ~100 LOC pour 4 modals. WCAG AA atteint sans. Si AAA requis → cycle 6 ou utiliser RtModal. |
| useId vs id hardcoded | A.2 | Évite collisions si plusieurs modals montés simultanément. React >= 18 standard. |
| aria-label avec t() | A.2 | Maintenu i18n cohérent (fallback 'Close' si clé absente). |

## Auto-évaluation

| Critère | Verdict |
|---------|---------|
| Score objectif (94) atteint | 0/1 (90 = miss -4) |
| Zéro régression > 5 pts | 1/1 |
| Policy gates respectées | 1/1 |
| Gates A.2b 5/5 PASS | 1/1 |
| Documentation produite | 1/1 |
| Total | **4/5** |

## Bilan PDCA total (cycles 1-5)

**Score baseline → 90 (+28 pts, +45% relatif)** en 5 cycles.

| Acquis irreversibles | Cycle |
|----------------------|-------|
| 35 vues redteam patchées contrast | 1 |
| Override CSS rt-root complet (9 opacités + 5 sémantiques + placeholders) | 2 |
| Token `--rt-critical` consommé | 2 |
| DESIGN_TOKENS.md (145 L) | 2 |
| GeneticProgressView 39 hex → THEME constant | 3 |
| Hiérarchie typographique restaurée 3 fichiers | 3 |
| `.rt-focus` global + neutralisation focus:outline-none | 3 |
| ScenarioTab 918 → 423 LOC + scenarioCatalog.js | 4 |
| RtModal wrapper a11y disponible (168 L) | 4 |
| 4 modals avec role=dialog + Escape + aria-* | 5 |

**Ce qui reste hors scope** : i18n migration (skill add-scenario), GeneticProgressView CSS vars (refactor design), axe-core CI (tooling), focus trap complet (cycle 6 si AAA requis).
