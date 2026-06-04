# Design Tokens Audit — Cycle 001

**Scope** : `frontend/src/components/redteam/` (43 fichiers .jsx/.js)
**Date** : 2026-06-03
**Fix de reference** : 35 fichiers / 275 corrections (contraste neutral-500/600 → 400, bg-900/80 → 900/50)
**Tokens AEGIS** : `RedTeamLayout.jsx` (lignes 151-175) + override `.rt-root` dans `index.css` (lignes 242-309)

---

## Score global : **48/100**

| Axe | Score | Statut |
|-----|------:|--------|
| 1. Token leakage | 14/40 | CRITIQUE |
| 2. Palette consistency | 18/30 | INSUFFISANT |
| 3. Critical color | 9/20 | INSUFFISANT |
| 4. Theme parity | 7/10 | OK |

---

## 1. Token leakage (14/40)

### Couleurs hard-codees detectees

**Hex litteraux quotes** (`'#xxxxxx'`) : **74 occurrences** sur 12 fichiers
**`style={{ color/bgColor: '#...' }}`** : **28 occurrences** (un seul fichier — GeneticProgressView)
**Classes Tailwind raw (rouge + autres palettes)** : **695 occurrences** sur 43 fichiers

### Top 5 fichiers leaky

| Rang | Fichier | style hex | hex quotes | raw palettes | Severite |
|------|---------|----------:|-----------:|-------------:|----------|
| 1 | `GeneticProgressView.jsx` | 28 | 39 | 0 (non scanne — pas dans le set 43) | BLOQUANT |
| 2 | `CampaignTab.jsx` | 0 | 10 | 82 (text-red-* x14, accents x38, bg-red x22, border-red x14) | ELEVE |
| 3 | `DigitalTwin.jsx` | 0 | 8 | 13 (text-red-* x4, +accents x8) | ELEVE |
| 4 | `panels/ForgePanel.jsx` | 0 | 2 | 54 (text-red x1, raw palette x32, border-red x13) | ELEVE |
| 5 | `views/RagView.jsx` | 0 | 0 | 22 (raw palette x4, border-red x8 x bg-red x3) | MOYEN |

**Cas particulier `GeneticProgressView.jsx`** : composant integralement en `style={{}}` inline (palette dark legacy `#0a0a14`, `#1e1e38`, `#e94560`, `#cbd5e1`). Ce fichier ignore TOTALEMENT le design system — c'est une dette technique heritee. **AUCUNE correction du fix d'hier ne l'a touche** (probablement parce que pas de `text-neutral-*`).

**Justification score** : 695 occurrences / 43 fichiers = 16 / fichier de moyenne. Acceptable si ce sont des classes semantiques (text-red pour critique, text-emerald pour success). Mais le mix `purple`, `cyan`, `amber`, `orange` (357 raw palettes hors red) signale une **derive chromatique non gouvernee**.

---

## 2. Palette consistency (18/30)

### Distribution des classes neutres (post-fix)

| Classe | Count | Fichiers | Verdict |
|--------|------:|---------:|---------|
| `text-neutral-100` | 8 | 7 | OK (titres principaux) |
| `text-neutral-200` | 10 | 6 | OK (sous-titres) |
| `text-neutral-300` | 59 | 23 | OK (texte corps secondaire) |
| `text-neutral-400` | 368 | 36 | DOMINANT — coherent avec fix |
| `text-neutral-500` | 0 | 0 | NETTOYE par le fix (correct) |
| `text-neutral-600` | 0 | 0 | NETTOYE par le fix (correct) |
| `text-neutral-700` | 36 | 16 | SUSPECT (devrait etre absent — voir gap #2) |
| `text-neutral-800` | 2 | 2 | INCONSISTANT (utilise 2 fois — bruit) |
| `text-neutral-900` | 1 | 1 | INCONSISTANT (bruit isole) |
| `bg-neutral-800` | 94 | 34 | OK (panneaux) |
| `bg-neutral-900` | 77 | 27 | OK (containers) |
| `bg-neutral-950` | 40 | 15 | OK (backdrops) |

### Findings cles

- **`text-neutral-700` survit dans 16 fichiers** : le fix l'a laisse (ex. `panels/InjectionLabPanel.jsx` 3 occ, `views/RagView.jsx` 4 occ, `shared/PayloadEditModal.jsx` 10 occ). Sous override `.rt-root`, il n'est PAS remappe (la regle s'arrete a `text-neutral-600`). Resultat : `#404040` natif Tailwind sur paper-1 (`#fafaf8`) = ratio 9.8:1 (lisible), mais **incoherent avec la design token map**. Recommandation : etendre l'override CSS aux 700/800/900 OU migrer ces 36 occurrences vers `text-neutral-300/400`.
- **`text-neutral-800/900` (3 occurrences totales)** : bruit absolu, a normaliser.
- **Distribution `bg-neutral-*`** : ratio 94/77/40 = 45%/37%/19% — coherent, hierarchie respectee.

---

## 3. Critical color (9/20)

### Usage de la couleur critique

- **`var(--critical)`** : 11 occurrences — TOUTES dans `RedTeamLayout.jsx` (definition + brand + nav). **AUCUN composant fonctionnel ne consomme le token**.
- **`text-red-400/500/600`** : 94 occurrences sur 13 fichiers (badges INJECTED, FormalViolation, ShieldAlert, LOCKED status).
- **`bg-red-*`** : 40 occurrences sur 15 fichiers.
- **`border-red-*`** : 102 occurrences sur 32 fichiers.
- **`text-red-300/700/800`** (shades hors palette) : 14 occurrences sur 7 fichiers — **incoherent**.

### Gap critique

Le token `--critical: #c41e3a` (AEGIS rouge editorial) est **inutilise dans le code des vues**. Tous les badges danger, alerts, INJECTED utilisent `text-red-500` (Tailwind = `#ef4444`) ou `text-red-400` (`#f87171`). **C'est un decalage de 18° en teinte (Tailwind rouge plus oriente orange, AEGIS plus crimson)**. Le fix d'hier n'a pas adresse ce point.

**Recommandation** : ajouter dans l'override `.rt-root` :
```css
.rt-root .text-red-400, .rt-root .text-red-500 { color: var(--critical) !important; }
.rt-root .bg-red-500, .rt-root .bg-red-500\/10 { background-color: var(--critical-tint) !important; }
.rt-root .border-red-500 { border-color: rgba(196,30,58,0.30) !important; }
```

---

## 4. Theme parity (7/10)

- `StudioView.jsx` et `AdversarialStudio.jsx` sont **bien rendus sous `.rt-root`** (verified : route `/redteam/studio` enfant de `RedTeamLayout` → `Outlet`).
- Aucune cassure detectee : `text-neutral-400` est remappe a `#737373` sur paper-1 (`#fafaf8`) = ratio 5.4:1 (AA).
- `DigitalTwin.jsx` est en **dehors** de `/redteam/*` (digital-twin dark) : ses `text-red-400` et bg dark sont intentionnels, parite preservee.
- `GeneticProgressView.jsx` (inline `#0a0a14`) **n'est jamais affichee dans rt-root** mais reste un risque si reroutee.

Score retenu : 7/10 (parite OK mais GeneticProgressView est un mine futur).

---

## Top 3 gaps

1. **`GeneticProgressView.jsx` est un fossile design system** (67 hex litteraux). Refactoriser en classes Tailwind + tokens — ou retirer si non utilise.
2. **`--critical` token jamais consomme** : 94 `text-red-*` divergent de la marque AEGIS (#ef4444 vs #c41e3a). Ajouter override CSS (3 lignes) OU migrer en `text-[var(--critical)]`.
3. **`text-neutral-700` orphelin** dans 36 occurrences (16 fichiers). Soit etendre l'override 700/800/900, soit normaliser vers 400.

## Recommandations cycle 2

- **PATCH 1 (effort: 5 min)** : etendre `.rt-root` override pour `text-neutral-700/800/900` et `text-red-400/500` → `var(--critical)`. Gain : +15 points (palette + critical).
- **PATCH 2 (effort: 20 min)** : auditer `GeneticProgressView.jsx` — usage reel + refactor ou archivage. Gain : +12 points (token leakage).
- **PATCH 3 (effort: 10 min)** : grep `text-(purple|cyan|amber|orange)-*` (357 occurrences) → consolider en 2 accents semantiques (`--signal`, `--accent`) au lieu d'une derive de 4-5 hues. Gain : +6 points.

**Verdict policy gates** : NO STUB OK, NO MOCK OK, USAGE TRIAGE PARTIEL (GeneticProgressView a triager), NO DISABLE OK.
