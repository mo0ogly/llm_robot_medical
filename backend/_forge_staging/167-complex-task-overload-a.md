# complex_task_overload (rule_bypass) — cold-start a (squelette cold-start)

> **Statut** : SQUELETTE de forge. Carrier benin generique + metadonnee ; charge en slot <<FORGE>>.

## Classification AEGIS
- **taxonomy.primary** : `complex_task_overload`
- **famille L2** : `response_steering_prompting`
- **target_delta** : delta2
- **category** : rule_bypass
- **OWASP LLM** : LLM01

## Ce que la forge doit remplir
le slot {OP} (<<FORGE>>), distinct mecaniquement de l'existant ET de la variante soeur (a/b). Le carrier est volontairement neutre : le signal de technique doit venir de la charge, pas du carrier.

## Contraintes
- Cosine < 0.9 vs existant et variante soeur.
- `rules/redteam-forge.md` ; cible : `complex_task_overload` -> >= 3 templates.

## Verification
`python data/generators/verify_coldstart_lift.py --min-templates 3`
