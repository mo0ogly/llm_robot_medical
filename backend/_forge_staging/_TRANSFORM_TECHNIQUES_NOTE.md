# Techniques d'encodage/transformation — traitement dédié (pas de squelette carrier)

20 techniques 1-template appartiennent à des familles d'**encodage/transformation de texte**. Un squelette « carrier bénin + slot » y est inadapté : leur mécanisme N'EST PAS un cadre de contexte, c'est une **transformation déterministe appliquée à une charge**.

## Liste

| Famille L2 | techniques |
|---|---|
| `instruction_reformulation` | base_n_encoding, formatting_disruption, garbled_text, in_prompt_fragment_concatenation, orthographic_manipulation, phonetic_alphabet_transcription, phonetic_manipulation, phonetic_respelling, text_based_art |
| `natural_language_manipulation` | common_synonym_substitution, euphemistic_substitution, indirect_reference_substitution, intra_sentence_reordering, low_resource_natural_language, pig_latin_transformation, typo_injection, word_addition_removal |
| `morpho_syntactic_manipulation` | explicit_instructional_text_completion, implicit_instructional_text_completion |
| `instruction_obfuscation` | context_overload_prompting |

## Pourquoi pas de scaffold carrier

Ces techniques = fonction `T(payload) -> payload'`. La charge sous-jacente doit exister (1 seed par technique = déjà présent dans `prompts/`), puis la transformation génère des variantes. Forger 2 nouveaux carriers bénins n'apporte aucune diversité mécanistique pertinente.

## Recommandation (deux options)

1. **Programmatique (préféré)** : étendre `prompt_injection_aegis_aug.py` avec un opérateur par transformation (déjà partiellement là : homoglyph, zero_width, base64, leetspeak). Appliquer T au seed existant → ≥3 variantes distinctes par technique, **sans forge ni authoring offensif** (la transformation opère sur la charge déjà présente). Limite content-filter : le script lit/transforme le seed sans l'exposer (déjà le pattern en place).
2. **Forge légère** : si une transformation n'est pas automatisable proprement (ex. `text_based_art`, `implicit_instructional_text_completion`), forger 2 variantes via `aegis-prompt-forge`.

## Décision suggérée

- **Automatisables** (base_n_encoding, garbled_text, typo_injection, pig_latin_transformation, orthographic_manipulation, phonetic_*, common_synonym_substitution, intra_sentence_reordering, word_addition_removal, formatting_disruption, in_prompt_fragment_concatenation, context_overload_prompting) → opérateur programmatique.
- **À forger** (text_based_art, explicit/implicit_instructional_text_completion, euphemistic_substitution, indirect_reference_substitution, low_resource_natural_language) → 2 variantes chacune.

Cette séparation évite ~24 squelettes placeholder à faible valeur et donne un meilleur chemin d'ingénierie.
