# Regles de programmation — AEGIS

## React (Frontend — port 5173)

1. **Pas d'emoticons** dans le code, commentaires ou strings UI — sauf si le design l'exige explicitement.
2. **Pas de placeholders** ("TODO", "coming soon") sans validation explicite du user.
3. **i18n obligatoire** : `t('key')` pour tout texte visible. JAMAIS de string hardcodee.
4. **Template literal bug** : pas de `${}` dans les fonctions standalone .jsx (utiliser concatenation).
5. **Tailwind v4** : classes utilitaires, pas de CSS custom sauf necessaire.
6. **Composants Red Team** : `frontend/src/components/redteam/` — toutes les vues du lab.
7. **Pas de librairies non approuvees** sans en parler au user.

## Go (Backend futur / outils)

1. **Pas de `fmt.Println` en production** — logger structure.
2. **Pas de chemins hardcodes** — variables d'environnement ou flags.
3. **Tests** : tout nouveau package doit avoir un `_test.go`.
4. **Pas de `panic` sauf en initialisation** — retourner des erreurs.

## Python (Backend actuel — port 8042)

1. **FastAPI** avec routes dans `backend/routes/`.
2. **Pas de `print()` en production** — utiliser `logging`.
3. **Docstrings en anglais**, commentaires FR OK pour la recherche.
4. **Type hints** sur les fonctions publiques.
5. **Pas de secrets dans le code** — `.env` (gitignore).

## General

1. **ZERO emoticon** sauf demande explicite du user.
2. **ZERO placeholder** sans validation explicite.
3. **ZERO import inutile** — nettoyer apres refactoring.
4. **ZERO fichier orphelin** — supprimer si plus utilise.
5. **Chaque fichier cree doit etre reference** quelque part.
