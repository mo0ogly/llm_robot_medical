# Phase 4 — BASSE (Focus + ARIA + polish)

## R4.1 — Classe `.rt-focus` standardisée

Définir dans `index.css` (sous `.rt-root`) :

```css
.rt-root .rt-focus:focus-visible {
  outline: 2px solid var(--rt-critical);
  outline-offset: 2px;
  border-radius: 2px;
}
```

Appliquer sur les ~30 boutons critiques sans focus visible (TemplateCard, RagView help/refresh/X, AdversarialStudio panel toggle).

## R4.2 — Composant `<RtModal>` réutilisable

Wrapper avec `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap (utiliser `useFocusTrap` hook custom ou `focus-trap-react`). Refactor les 4 modals existants.

## R4.3 — `role="button"` + `tabIndex={0}` sur `<div onClick>`

Pattern :
```jsx
<div role="button" tabIndex={0} onClick={fn} onKeyDown={e => e.key === 'Enter' && fn()}>
```

Cibles : `TemplateCard`, `RagView` file list.

## R4.4 — Doc design system

Créer `frontend/src/components/redteam/DESIGN_TOKENS.md` :
- Table des classes Tailwind autorisées dans `.rt-root` + couleur effective + WCAG ratio sur `paper-1`
- Patterns interdits (text-red-400 raw, hex inline, etc.)
- Procédure d'extension de l'override
