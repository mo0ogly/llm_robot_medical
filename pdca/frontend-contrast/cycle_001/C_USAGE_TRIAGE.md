# C.0 — Dead code triage

**Méthode** : grep des `from '...XxxView'` + check des `React.lazy(() => import(...))` dans `main.jsx`/`App.jsx`.

## Verdict

| Catégorie | Count | Détail |
|-----------|-------|--------|
| **ACTIF** | 35/35 | Toutes les vues lazy-loaded dans `frontend/src/main.jsx:17-28`. Panels/Cards/Modals importés directement par les vues parentes (≥1 référence chacun). |
| **PROTOTYPE** | 0 | Aucun fichier orphelin commenté. |
| **DEAD** | 0 | Aucun fichier sans référence. |

## Vérification routing

`frontend/src/main.jsx` charge en `React.lazy` :
- RagView, StudioView, PlaygroundView, CatalogView, ScenariosView
- ExerciseView, DefenseView, AnalysisView, ResultExplorer, CampaignView
- ExperimentDashboard, HistoryView, LogsView, TimelineView

Les 21 autres fichiers modifiés (panels, shared, tabs) sont composants enfants importés statiquement par les vues ci-dessus (1-12 références chacun via grep `from '...XxxxName'`).

## Conclusion

**100 % des fichiers touchés par le fix sont actifs en production.** Aucune pénalité dead-code à appliquer dans le scorecard. Aucun fichier à exclure.
