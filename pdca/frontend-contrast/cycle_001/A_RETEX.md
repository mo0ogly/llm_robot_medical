# A_RETEX — Cycle 001 frontend-contrast

**Date** : 2026-06-03
**Périmètre** : `frontend/src/components/redteam` (35 fichiers, 275 corrections classes Tailwind neutres)
**Score** : 62/100 (BASELINE)
**Verdict** : ACCEPTABLE pour cycle 1 ; bug fonctionnel corrigé mais qualité a11y partielle.

## Ce qui a marché

1. **Diagnostic rapide via inspection DOM** — l'erreur initiale ("le `bg-neutral-900` ne change rien") a été résolue en lisant `index.css:242-309` (`.rt-root` override avec `!important`). Une fois la cause comprise, le fix est devenu mécanique.
2. **Batch PowerShell regex-strict** — 35 fichiers traités en 1 commande, 0 résidu, byte-delta nul = preuve de substitutions équilibrées.
3. **Visual recette via Claude Preview MCP** — `preview_eval` + `getComputedStyle` donne des mesures objectives (rgb values + ratios calculables), bien plus fiable que les screenshots.
4. **Brainstorm parallèle (3 agents)** — chaque domaine couvert indépendamment, 0 chevauchement, ~3 min wall-clock total.
5. **Policy gates respectées** : 35/35 fichiers ACTIF (0 dead code), 0 stub introduit, 0 mock, 0 désactivation.

## Ce qui n'a pas marché

1. **Fix de surface, pas systémique** — j'ai patché les vues plutôt que la cause racine (`index.css` override). Score Code Hygiene 58/100 reflète ce choix : 9 patterns d'opacité similaires restent non couverts. **Avec le recul, l'option 3 ("Corriger l'override CSS") proposée à l'utilisateur était objectivement supérieure**.
2. **Hiérarchie typographique écrasée** — replace_all aveugle de `text-neutral-500/600 → 400` a aplati 3 fichiers (MetricsPanel, ResultExplorer, AnalysisView ~90% neutral-400). Les agents l'ont détecté mais le fix initial l'a manqué.
3. **Couleurs sémantiques ignorées** — `text-amber/green/red-400` sur fond light = 1.6-1.8:1 FAIL. Non détecté pendant le fix initial. Visible immédiatement avec `preview_inspect` sur AnalysisView.
4. **Placeholders mal réfléchis** — `placeholder-neutral-700 → 400` me semblait bon (placeholder plus discret), mais 2.83:1 = FAIL WCAG 3:1. Bonne intuition, mauvais palier.
5. **ScenarioTab.jsx = 918 LOC** — pré-existant mais audit aurait dû le révéler plus tôt. La règle 800 LOC n'a pas de hook actif sur les `.jsx` du redteam.

## Causes racines

- **L'override CSS `.rt-root` n'est pas exhaustif** : il a été conçu pour les classes "communes", pas pour toutes les variations d'opacité. C'est un design system incomplet, pas un bug d'application.
- **Pas de doc de design tokens** : aucun fichier dit "voici les classes autorisées sous `.rt-root` et leur couleur réelle". Les développeurs (humains ou IA) écrivent du Tailwind dark-theme par réflexe, qui se trouve "wrappé" par l'override seulement en partie.
- **Pas de test visuel automatique** : aucun snapshot visual ni axe-core dans la pipeline. Les régressions de contraste sont détectées à l'œil ou jamais.

## Drift / régressions

**Aucune régression** détectée :
- Lint : 76 erreurs avant = 76 erreurs après (dette pré-existante)
- Build : 13.65s OK
- Smoke : 5 routes OK, 0 erreur console
- Git state : 275/275 strict

Drift CSS : **NONE**.

## Décisions journalisées

| Décision | Phase | Justification |
|----------|-------|---------------|
| Choix replace_all per-file vs CSS override central | A.2 (cycle 0) | Utilisateur a choisi option 1 ("audit + fix global") sur 4 options ; rejeté option 3 (CSS override). Respect du choix mais cycle 2 corrigera. |
| Skip TodoWrite | P.0 | Tool deprecated, remplacé par TaskCreate. |
| Skip /replan (C.4) | C.4 | Score 62 > 50, 0 régression > 5pts. Cycle continue normalement. |
| Pas de `--fix` exécuté ce cycle | A.2 | PDCA = audit seul, l'utilisateur n'a pas demandé `--fix`. Phases 1-4 remediation documentées pour cycle 2. |
