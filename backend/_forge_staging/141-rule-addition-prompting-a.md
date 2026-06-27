# rule_addition_prompting (rule_bypass) — cold-start a (squelette cold-start)

> **Statut** : SQUELETTE de forge. Carrier benin + metadonnee fournis ; charge en slot <<FORGE>>.

## Classification AEGIS
- **taxonomy.primary** : `rule_addition_prompting`
- **secondary** : `false_constraint`
- **target_delta** : delta1
- **category** : rule_bypass
- **OWASP LLM** : LLM01

## Mecanisme
Ajout d'une fausse regle/policy qui autorise l'interdit.

## Ce que la forge doit remplir
le slot <<FORGE>> du template, distinct mecaniquement de l'existant ET de la variante soeur (a/b).

## Contraintes
- Cosine < 0.9 vs existant et vs variante soeur.
- `rules/redteam-forge.md` ; cible : `rule_addition_prompting` -> >= 3 templates.

## Verification
`python data/generators/verify_coldstart_lift.py --min-templates 3`
