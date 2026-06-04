# Phase 1 — CRITIQUE (WCAG FAIL)

**Objectif** : faire passer toutes les paires couleur/fond à WCAG AA minimum.

## R1.1 — Étendre `.rt-root` override dans `index.css`

**Cible** : `frontend/src/index.css` lignes 242-309.
**Diff attendu** :

```css
/* Backgrounds — ajouter les opacités manquantes */
.rt-root .bg-neutral-900\/10,
.rt-root .bg-neutral-900\/20,
.rt-root .bg-neutral-900\/30,
.rt-root .bg-neutral-900\/40,
.rt-root .bg-neutral-900\/70,
.rt-root .bg-neutral-900\/80,
.rt-root .bg-neutral-900\/90 { background-color: #fafaf8 !important; }

.rt-root .bg-neutral-950,
.rt-root .bg-neutral-950\/40,
.rt-root .bg-neutral-950\/50,
.rt-root .bg-neutral-950\/60,
.rt-root .bg-neutral-950\/70,
.rt-root .bg-neutral-950\/80 { background-color: #f5f5f1 !important; }

.rt-root .bg-black\/70,
.rt-root .bg-black\/80,
.rt-root .bg-black\/90 { background-color: rgba(10,10,10,0.50) !important; /* backdrops modaux */ }

/* Bordures — ajouter les opacités manquantes + 700/800/900 */
.rt-root .border-neutral-700\/50,
.rt-root .border-neutral-800\/50,
.rt-root .border-neutral-900,
.rt-root .border-neutral-900\/50 { border-color: rgba(10,10,10,0.14) !important; }

/* Texte — remap palier 700 (orphelin) à un niveau cohérent */
/* DÉCISION : laisser text-neutral-700 en fallback Tailwind (#404040 AAA), ne PAS l'override */
/* Mais documenter dans CLAUDE.md le palier semantic : */
/* text-neutral-300 (#424242 AAA) = primary text */
/* text-neutral-400 (#737373 AA)  = secondary text */
/* text-neutral-700 (#404040 AAA) = headings / strong emphasis (Tailwind native) */

/* Placeholders — fix WCAG 3:1 minimum */
.rt-root .placeholder-neutral-400::placeholder,
.rt-root .placeholder-neutral-500::placeholder,
.rt-root .placeholder-neutral-600::placeholder,
.rt-root .placeholder-neutral-700::placeholder,
.rt-root .placeholder-neutral-800::placeholder { color: #737373 !important; opacity: 0.7; }

/* Couleurs sémantiques — clamper le shade pour passer WCAG sur paper-1 */
.rt-root .text-red-400,
.rt-root .text-red-500 { color: var(--rt-critical) !important; /* #c41e3a, 5.4:1 AA */ }

.rt-root .text-amber-400 { color: #b45309 !important; /* 5.1:1 AA */ }
.rt-root .text-amber-500 { color: #b45309 !important; }

.rt-root .text-green-400 { color: #15803d !important; /* 5.7:1 AA */ }
.rt-root .text-green-500 { color: #15803d !important; }
```

**Impact** : 1 fichier, ~25 lignes ajoutées, **résout les 4 placeholders FAIL + ~50 cellules ASR colorées + 9 patterns d'opacité**.

## R1.2 — Vérifier rendu sur les 5 routes échantillonnées

Après R1.1 : relancer `preview_eval` sur RagView (placeholder), AnalysisView (ASR cells), CatalogView (placeholder), PayloadEditModal (placeholder). Toutes paires doivent passer 4.5:1.

## R1.3 — Self-scoring obligatoire

Recount des résidus problématiques avant/après. Si après R1.1 il reste des paires < 4.5:1 dans `.rt-root` → STOP, ajouter au override.
