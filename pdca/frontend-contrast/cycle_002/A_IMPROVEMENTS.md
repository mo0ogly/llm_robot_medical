# A_IMPROVEMENTS — Préparation cycle 003

## Nouveaux checks à ajouter au `SCORING_CONFIG.json`

| Check ID | Domaine | Description | Poids |
|----------|---------|-------------|-------|
| HYG-03 | code_hygiene | Hiérarchie visuelle : pour chaque fichier > 20 occurrences `text-neutral-*`, vérifier au moins 3 paliers utilisés (anti-écrasement) | 10 |
| HYG-04 | code_hygiene | Sub-component extraction : fichiers > 700 LOC = warning, > 800 LOC = block | 5 |
| TOK-03 | design_tokens | Hex inline = 0 dans `frontend/src/components/` (étendu hors redteam) | 10 |
| A11Y-01 | a11y_wcag | Axe-core run sur 5 routes échantillon, 0 violation critical/serious | 15 |
| A11Y-02 | a11y_wcag | Composant `<RtModal>` réutilisable existant + utilisé partout | 5 |

## Checks à retirer du cycle 003

| Check ID | Raison |
|----------|--------|
| HYG-COMPLETUDE | Satisfait à 95% (38/40). Score plafond atteint. |
| TOK-CRITICAL | Satisfait 100% (20/20 via R2.2). Score plafond. |

## Poids à ajuster

| Domaine | Cycle 2 | Cycle 3 | Raison |
|---------|---------|---------|--------|
| a11y_wcag | 30% | 30% | Toujours prioritaire |
| design_tokens | 20% | 15% | TOK-CRITICAL réglé, GeneticProgressView seule cible restante |
| code_hygiene | 15% | 20% | Hiérarchie + LOC + i18n = travail réel pour cycle 3 |
| completeness | 15% | 15% | Stable |
| documentation | 10% | 10% | Stable |
| visual_recette | 10% | 10% | Stable |

## Focus areas cycle 003

| Priorité | Item | Effort estimé | Gain projeté |
|----------|------|---------------|--------------|
| 1 | R2.1 — Hiérarchie 3 fichiers | 30 min audit + edit | +5 hygiene + +5 a11y |
| 2 | R3.1 — ScenarioTab décomposition | 45 min refactor | +4 hygiene |
| 3 | R2.3 — GeneticProgressView hex inline | 20 min batch script | +20 design_tokens |
| 4 | R4.1 + R4.2 — Focus + RtModal | 90 min refactor a11y | +10 a11y |
| 5 | Axe-core integration | 60 min setup + CI | +15 (nouveau check A11Y-01) |

## Objectif cycle 003

- **Score global cible** : 88/100 (+10 vs cycle 2)
- **Zéro régression** sur les acquis cycles 1 et 2
- Si focus = R2.3 seul → gain +20 design_tokens = +4 global. Doable en 20 min.
- Si focus = R4.1+R4.2 = sprint a11y complet → gain +10 a11y = +3 global. 90 min.

## Mémoire pour les agents de remediation cycle 003

Si `--fix` est passé :
1. NE PAS toucher à `index.css` `.rt-root` (acquis cycle 2). Toute extension nouvelle = section dédiée commentée "Cycle 003".
2. R2.1 = audit visuel obligatoire AVANT edit. Méthode :
   - `preview_screenshot` sur chaque fichier
   - Identifier zones où 3+ `text-neutral-400` consécutifs apparaissent dans le DOM (via grep parent < div)
   - Réintroduire `text-neutral-300` (titre) ou `text-neutral-700` (heading fort) pour distinguer
3. R3.1 ScenarioTab = lire LIGNE PAR LIGNE le fichier (jamais champ "template" de prompts/*.json). Extraire :
   - Constants au top du fichier → `scenarioTab.constants.js`
   - Sub-components réutilisables → `tabs/scenario/components/`
   - Hooks logiques → `tabs/scenario/hooks/`
4. Toujours mesurer DOM via preview_eval APRÈS chaque changement. Pas de "ça devrait marcher".
