# Phase 2 — HAUTE (Design system + hiérarchie)

## R2.1 — Restaurer hiérarchie typographique

**Fichiers** : `MetricsPanel.jsx`, `ResultExplorer.jsx`, `AnalysisView.jsx`.

Le fix de cycle 1 a remplacé `text-neutral-500/600 → 400` partout, écrasant la hiérarchie. Réintroduire un palier intermédiaire :

| Rôle | Classe | Couleur effective |
|------|--------|-------------------|
| Heading / strong | `text-neutral-700` | `#404040` AAA |
| Primary text | `text-neutral-300` | `#424242` AAA |
| Secondary text | `text-neutral-400` | `#737373` AA |
| Meta / disabled | `text-neutral-500` (re-override) | `#a3a3a3` (info non critique uniquement) |

**Méthode** : pour les 3 fichiers, audit visuel zone par zone, et là où 3+ `text-neutral-400` consécutifs apparaissent, réintroduire `text-neutral-300` ou `text-neutral-700` pour distinguer les niveaux.

## R2.2 — Consommer `--critical` token AEGIS

**Cible** : faire passer les 94 `text-red-{400,500}` au `--rt-critical` token (`#c41e3a`).

Méthode (déjà inclus dans R1.1 via override CSS) : 1 ligne CSS suffit pour remapper toutes les occurrences sans toucher aux JSX.

## R2.3 — Refactor `GeneticProgressView.jsx`

67 hex inline → tokens AEGIS (`var(--rt-bg-base)`, `var(--rt-critical)`, etc.).
Effort estimé : ~20 min de search/replace + revue visuelle.
