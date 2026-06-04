# A_IMPROVEMENTS — Préparation cycle 002

## Nouveaux checks à ajouter au `SCORING_CONFIG.json`

| Check ID | Domaine | Description | Poids |
|----------|---------|-------------|-------|
| WCAG-01 | a11y_wcag | `getComputedStyle` ratio >= 4.5:1 sur 10 paires couleur/fond samplées (placeholder, text-amber/green/red, text-neutral-*) | 10 |
| WCAG-02 | a11y_wcag | Tous les modals ont `role="dialog"` + `aria-modal` + focus trap | 5 |
| WCAG-03 | a11y_wcag | Coverage focus visible `focus-visible:` >= 50% sur boutons interactifs | 5 |
| TOK-01 | design_tokens | 0 hex inline dans `frontend/src/components/redteam/**/*.jsx` (grep `style.*color.*#`) | 5 |
| TOK-02 | design_tokens | `--rt-critical` consommé (>= 50% des `text-red-*` remappés) | 5 |
| HYG-01 | code_hygiene | 0 fichier > 800 LOC dans le périmètre | 5 |
| HYG-02 | code_hygiene | Pour chaque fichier > 20 occurrences `text-neutral-400`, au moins 2 autres paliers présents (anti-écrasement hiérarchie) | 5 |
| COMP-01 | completeness | 0 résidu de pattern non couvert par `.rt-root` override (audit grep) | 10 |

## Checks à retirer du cycle 002

| Check ID | Raison |
|----------|--------|
| (aucun) | Cycle 1 = baseline, on garde tout. |

## Poids à ajuster

| Domaine | Poids actuel | Poids cycle 2 | Raison |
|---------|--------------|---------------|--------|
| a11y_wcag | 25% | 30% | Critique pour le projet AEGIS (thèse ENS, démo publique) |
| design_tokens | 20% | 20% | Stable |
| code_hygiene | 20% | 15% | Couvert par les hooks pré-commit |
| completeness | 15% | 15% | Stable |
| documentation | 10% | 10% | Stable |
| visual_recette | 10% | 10% | Stable |

## Focus areas cycle 002

1. **Phase 1 critique** : appliquer R1.1 (override CSS étendu) → vise score a11y_wcag 90+
2. **Phase 2 haute** : R2.1 hiérarchie + R2.2 token --critical → vise design_tokens 75+
3. **Phase 3 moyenne** : décomposer ScenarioTab 918 LOC → vise code_hygiene 80+
4. **Phase 4 basse** : doc DESIGN_TOKENS.md + `<RtModal>` wrapper → vise +5 sur a11y + doc

## Objectif cycle 002

- **Score global cible** : 78/100 (+16 vs baseline)
- **Zéro régression** sur les 35 fichiers du périmètre actuel
- **Documentation** : `frontend/src/components/redteam/DESIGN_TOKENS.md` créé

## Mémoire pour les agents de remediation cycle 002

Si `--fix` est passé en cycle 002, l'agent DOIT :
1. Lire R1.1 phase_1_critical.md AVANT d'éditer
2. Appliquer le patch CSS en 1 fois, puis re-mesurer DOM via preview_eval sur les 5 routes
3. NE PAS toucher aux JSX si R1.1 suffit (override CSS = source de vérité)
4. Si une régression visuelle apparaît (ex: badge invisible), rollback partiel et ajouter exception
