# Code Hygiene + Completeness — Cycle 001

**Date** : 2026-06-03
**Scope** : `frontend/src/components/redteam/**` (35 fichiers, +275/-275)
**Override audite** : `frontend/src/index.css:248-309` (.rt-root light remap)

## Score global : 58/100

Le fix corrige correctement les `text-*` et la couche `bg-neutral-900/50`,
mais **9 variantes d'opacite** ne sont pas remappees dans l'override et
**5 classes de bordure/divide/placeholder** sont absentes du CSS scope.
Resultat : un nombre significatif de blocs vont rester sombres sur fond
light, ce qui invalide partiellement le fix visuel.

---

### 1. Completude (18/40)

**Override `.rt-root` actuel** (`index.css:248-309`) couvre seulement :
- `bg-neutral-900`, `bg-neutral-900/50`, `bg-neutral-900/60`, `bg-neutral-950`, `bg-neutral-800`, `bg-neutral-700`
- `bg-black`, `bg-black/10..60`
- `text-white`, `text-neutral-100..600`
- `border-neutral-500..800`
- `divide-neutral-700/800`
- `ring-neutral-700/800`
- `placeholder-neutral-500/600`

**Patterns Tailwind reellement utilises dans redteam/ (non remappes)** :

| Pattern | Count | Dans override ? | Risque |
|---|---|---|---|
| `bg-neutral-900/10` | 2 | NON | Bloc reste dark transparent |
| `bg-neutral-900/20` | 2 | NON | Idem |
| `bg-neutral-900/30` | 2 | NON | Idem (EmptyState, DefenseView) |
| `bg-neutral-900/40` | 3 | NON | Cards HistoryTab, Dashboard |
| `bg-neutral-900/70` | 0 | n/a | RAS |
| `bg-neutral-950/40` | 1 | NON | ExperimentDashboard sidebar |
| `bg-neutral-950/50` | 9 | NON (seul `bg-neutral-950` plein est mappe) | Inputs RagView |
| `bg-black/70` | 2 | NON | Modal backdrop (GlobalTimeline, ScenarioHelpModal) |
| `bg-black/80` | 5 | NON | Backdrops modaux (Studio, Stepper, InfectionDiff) |
| `border-neutral-700/50` | 4 | NON (`/50` opacity suffix) | Bordures Liu, Defense, Guardrail |
| `border-neutral-800/50` | 2 | NON | HistoryCard |
| `border-neutral-900` | 1+ | NON | SessionPanel tr separator |
| `divide-neutral-500/600` | 0 | n/a | RAS |
| `placeholder-neutral-800` | 2 | NON | PayloadEditModal (placeholder INVISIBLE sur fond clair !) |

**Verdict** : 9 variantes `bg-*/opacity` + 3 variantes `border-*/opacity` +
1 placeholder critique restent en dark. Le fix couvre la majorite mais pas
les modaux ni les cartes a opacite faible.

### 2. Regressions hierarchie (18/30)

Distribution `text-neutral-*` dans les 5 fichiers les plus modifies :

| Fichier | 300 | 400 | 700 | Verdict hierarchie |
|---|---|---|---|---|
| ForgePanel.jsx | 8 | 37 | 1 | 2 niveaux dominants (300, 400) - OK |
| MetricsPanel.jsx | 0 | 27 | 3 | Mono-niveau 400 - **APLATI** |
| RagView.jsx | 9 | 28 | 4 | 3 niveaux - OK |
| ResultExplorer.jsx | 3 | 21 | 2 | Quasi mono-niveau - **APLATI** |
| AnalysisView.jsx | 3 | 27 | 0 | Quasi mono-niveau - **APLATI** |

**Probleme** : avant fix, la palette utilisait 500/600/300 = 3 paliers
distincts. Apres fix tout converge vers 400. Sur light, 400 = `#737373`
(override) donc OK contraste, MAIS la hierarchie editoriale (titre vs
sous-info vs hint) est ecrasee dans 3 fichiers sur 5. C'est un design smell.

Mitigation : remapper certains 400 vers 300 (= `#424242`, plus fonce) la
ou il s'agit de labels structurants (Section 11 fiches, headers tables).

### 3. File size (6/10)

Top 5 fichiers redteam/ (regle : 800 LOC max) :

| Fichier | LOC | Statut |
|---|---|---|
| ScenarioTab.jsx | 918 | **VIOLATION** (+118 au-dessus du seuil) |
| panels/ForgePanel.jsx | 752 | Surveillance (a 94% du seuil) |
| AdversarialStudio.jsx | 735 | Surveillance (92%) |
| CampaignTab.jsx | 699 | Surveillance (87%) |
| GlobalTimeline.jsx | 574 | OK |

**Action** : ScenarioTab.jsx doit etre decompose IMMEDIATEMENT (hors
scope cycle 001 mais a flagger). ForgePanel + AdversarialStudio :
planifier decomposition cycle 002.

### 4. i18n integrity (3/10)

Grep `>[A-Z]\w{4,40}<` sur les 5 fichiers tops :

- **ForgePanel.jsx** : `>Pattern<`, `>Category<`, `>Chain ID<`, `>Target Delta<`, `>Conjecture<` hardcoded
- **MetricsPanel.jsx** : `>Interpretation<` hardcoded
- **RagView.jsx** : `>Vector Store<`, `>Distance Metric<`, `>Collection<`, `>Chunk Size<`, `>Embeddings<` hardcoded
- **ResultExplorer.jsx** : RAS detecte (deja i18n)
- **AnalysisView.jsx** : RAS detecte (deja i18n)

**Verdict** : violation regle AEGIS "TOUT texte visible via t()". 3
fichiers sur 5 contiennent du texte technique hardcoded. C'est hors scope
contrast-fix mais a corriger.

### 5. Git state (10/10)

```
35 files changed, 275 insertions(+), 275 deletions(-)
```

**Verifie** : 275/275, ratio 1:1 = substitutions strictes, aucune
addition orpheline. OK.

---

### Top 3 gaps

1. **Override `.rt-root` incomplet pour les opacites < 50** : ajouter
   `bg-neutral-900/10..40`, `bg-neutral-950/40..50`, `bg-black/70..80`,
   `border-neutral-{700,800,900}/{50}`. Sans ca, modaux + cartes restent dark.
2. **`placeholder-neutral-800` invisible** : 2 textareas PayloadEditModal
   ont un placeholder `#262626` sur fond clair = quasi-invisible. Soit
   ajouter au remap, soit changer en `placeholder-neutral-400`.
3. **Hierarchie editoriale ecrasee** dans MetricsPanel, ResultExplorer,
   AnalysisView : tout converge vers neutral-400. Reintroduire 300 pour
   les labels primaires.

### Recommandations cycle 2

- Etendre l'override `.rt-root` aux 14 patterns d'opacite manquants
  (1 PR, ~20 lignes CSS supplementaires)
- Refactorer le placeholder hardcode `placeholder-neutral-800` dans
  `PayloadEditModal.jsx:197,229`
- Reintroduire un niveau `text-neutral-300` (= header secondaire) dans
  les 3 fichiers aplatis pour restaurer la hierarchie visuelle
- Decomposer `ScenarioTab.jsx` (918 LOC) en sous-modules avant prochain feature
- Couvrir le i18n dans ForgePanel/MetricsPanel/RagView (sortir les
  labels hardcoded)
- Ajouter un test visuel automatise (axe-core ou Playwright) qui detecte
  les contrastes < AA dans `.rt-root`
