# AEGIS RedTeam — Design Tokens (rt-root scope)

> **Source de vérité** : `frontend/src/index.css` lignes 248-340 (override `.rt-root`)
> **Tokens variables** : `frontend/src/components/redteam/RedTeamLayout.jsx` (`<style>` inline)
> **Dernière mise à jour** : 2026-06-03 (PDCA cycle 002 R1.1+R2.2)

Tout composant rendu sous `<RedTeamLayout>` est wrappé dans `.rt-root`. L'override CSS remappe les classes Tailwind dark-theme à la palette éditoriale light (inspirée du wiki AEGIS). Cette page documente quoi utiliser, quoi éviter, et comment étendre.

## Palette officielle (light theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `--paper-0` | `#ffffff` | Surfaces blanches (inputs) |
| `--paper-1` | `#fafaf8` | Background principal app |
| `--paper-2` | `#f5f5f1` | Cards, surfaces élevées |
| `--ink-0` | `#0a0a0a` | Texte primaire critique |
| `--ink-1` | `#1f1f1f` | Headings |
| `--ink-2` | `#424242` | Texte primary (AAA) |
| `--ink-3` | `#737373` | Texte secondary (AA) |
| `--ink-4` | `#a3a3a3` | Texte meta / désactivé |
| `--rt-critical` | `#c41e3a` | Rouge AEGIS (alerts, INJ badges) |
| `--rt-signal` | `#3b82f6` | Bleu signal (info) |

## Classes Tailwind autorisées sous `.rt-root`

### Backgrounds

| Classe | Couleur effective | Notes |
|--------|-------------------|-------|
| `bg-neutral-900/{0-90}` | `#fafaf8` | Tous les paliers d'opacité remappés |
| `bg-neutral-950/{0-90}` | `#fafaf8` | Idem |
| `bg-neutral-800` | `#f5f5f1` | Cards |
| `bg-neutral-700` | `#eeedea` | Surfaces hover |
| `bg-black/{10-60}` | `rgba(10,10,10,0.04)` | Voiles subtils |
| `bg-black/{70-90}` | `rgba(10,10,10,0.50)` | Backdrops modaux (semi-opaque) |

### Texte (par ordre de hiérarchie typographique)

| Classe | Couleur | Ratio sur `#fafaf8` | Usage |
|--------|---------|---------------------|-------|
| `text-neutral-700` (Tailwind natif, non overridé) | `#404040` | **10.5:1** AAA | Headings forts |
| `text-neutral-300` | `#424242` | **9.7:1** AAA | Texte primary |
| `text-neutral-400` | `#737373` | **4.6:1** AA | Texte secondary (par défaut) |
| `text-neutral-500` | `#a3a3a3` | 2.6:1 FAIL | **Meta uniquement** (timestamps, labels non critiques) |
| `text-neutral-600` | `#a3a3a3` | 2.6:1 FAIL | **Idem text-neutral-500** (à éviter pour info importante) |

### Couleurs sémantiques (toutes clampées WCAG AA)

| Classe | Couleur effective | Ratio | Usage |
|--------|-------------------|-------|-------|
| `text-red-{300,400,500}` | `#c41e3a` (rt-critical) | **5.4:1** AA | Alertes, dangers, INJ badges |
| `text-amber-{300,400,500}` | `#b45309` | **5.1:1** AA | Warnings |
| `text-green/emerald-{300,400,500}` | `#15803d` | **5.7:1** AA | Success, ASR positifs |
| `text-blue/cyan/sky-{300,400,500}` | `#1d4ed8` | **5.9:1** AA | Info, badges techniques |
| `text-purple/violet-{300,400,500}` | `#6d28d9` | **5.3:1** AA | Catégories, tags |

### Bordures

| Classe | Couleur | Notes |
|--------|---------|-------|
| `border-neutral-{700,800,900}` (+ `/50`) | `rgba(10,10,10,0.10-0.14)` | Bordures subtiles |
| `border-neutral-600` | `rgba(10,10,10,0.20)` | Bordures moyennes |
| `border-neutral-500` | `rgba(10,10,10,0.28)` | Bordures fortes |

### Placeholders

| Classe | Couleur | Opacity | Ratio | Usage |
|--------|---------|---------|-------|-------|
| `placeholder-neutral-{400-800}` | `#737373` | 0.75 | ~3.4:1 | Tous palieurs unifiés (WCAG 3:1 placeholder OK) |

## Patterns INTERDITS

### Couleurs hex inline

```jsx
// INTERDIT
<div style={{ color: '#c41e3a' }}>...</div>
<div style={{ backgroundColor: '#0a0a14' }}>...</div>
```

```jsx
// OK
<div className="text-red-500">...</div>  // → mappé sur rt-critical
<div className="bg-neutral-900">...</div>  // → mappé sur paper-1
```

### Couleurs sémantiques raw Tailwind hors override

Ne PAS introduire de nouveaux shades non couverts par l'override (sinon ils tomberont aux defaults Tailwind = échec WCAG). Si un nouveau shade est nécessaire :
1. **D'abord** étendre l'override dans `frontend/src/index.css` (section `.rt-root .text-XXX`)
2. **Ensuite** utiliser la classe dans le composant

## Procédure d'extension

1. **Identifier le besoin** : "j'ai besoin d'un nouveau ton orange foncé pour les warnings de niveau 2"
2. **Vérifier WCAG** : calculer le ratio sur `#fafaf8` (paper-1). Doit être ≥ 4.5:1 pour AA normal, ≥ 3:1 pour AA large.
3. **Choisir la classe Tailwind appropriée** : `text-amber-700` par exemple (`#b45309` natif Tailwind = 5.1:1 AA)
4. **Étendre l'override** dans `index.css` (ligne ~295 section "Semantic colors clampées") :
   ```css
   .rt-root .text-amber-600,
   .rt-root .text-amber-700 { color: #92400e !important; }
   ```
5. **Mesurer DOM réelle** via Claude Preview MCP `preview_eval` + `getComputedStyle`
6. **Documenter** dans cette page

## Vérification automatique

Pour auditer le périmètre `.rt-root` :

```bash
# Hex inline (doit être 0)
grep -rn "style=.*color.*#\|backgroundColor.*#" frontend/src/components/redteam/

# Classes non couvertes (doit lister 0 pattern manquant)
# Cf. pdca/frontend-contrast/cycle_001/D_BRAINSTORM/code_hygiene.md pour la liste de référence
```

## Historique

| Cycle | Date | Changements |
|-------|------|-------------|
| 001 | 2026-06-03 | Baseline : fix `text-neutral-500/600 → 400` (35 fichiers). Score 62/100. |
| 002 | 2026-06-03 | R1.1 override CSS étendu (9 patterns opacité + 5 sémantiques + placeholders). R2.2 consommation `--rt-critical`. R4.4 cette doc créée. |

## Référence

- `frontend/src/index.css:242-340` — override `.rt-root` complet
- `frontend/src/components/redteam/RedTeamLayout.jsx` — variables CSS
- `pdca/frontend-contrast/DASHBOARD.md` — historique multi-cycles
- WCAG 2.1 AA : ratio ≥ 4.5:1 (normal), ≥ 3:1 (large/placeholder)
