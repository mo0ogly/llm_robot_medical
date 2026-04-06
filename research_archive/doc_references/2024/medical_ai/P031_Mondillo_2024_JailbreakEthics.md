## [Mondillo et al., 2024] --- Jailbreaking Large Language Models: Navigating the Crossroads of Innovation, Ethics, and Health Risks

**Reference :** DOI:10.21037/jmai-24-170
**Revue/Conf :** Journal of Medical Artificial Intelligence, 2025;8:6, AME Publishing Company
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P031_source.pdf](../../literature_for_rag/P031_source.pdf)
> **Statut**: [ARTICLE VERIFIE] --- lu en texte complet via ChromaDB (41 chunks fulltext, 40562 caracteres)

### Abstract original
> This article examines the challenges and security concerns associated with the use of large language models (LLMs) like ChatGPT in the medical field, focusing particularly on the phenomena known as "LLM jailbreaking". As LLMs increasingly perform complex tasks involving sensitive information, the risk of their misuse becomes significant. Jailbreaking, originally a concept from software systems, refers to bypassing the restrictions set by developers to unlock new functionalities. This practice has spread to LLMs, where users manipulate model inputs to elicit responses otherwise restricted by ethical and safety guidelines. Our research specifically targets the implications of jailbreaking using ChatGPT versions 3.5 and 4 as case studies in two medical scenarios: pneumonia treatment and a recipe for a drink based on drugs. We demonstrate how modified prompts---such as those used in "Role Playing"---can alter the model's output, potentially leading to the provision of harmful medical advice or the disclosure of sensitive information. Findings indicate that while newer versions of ChatGPT show improved resistance to such manipulations, significant risks remain.
> --- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Risques de jailbreaking des LLM dans le domaine medical pediatrique, ou des conseils medicaux errones peuvent mettre des vies d'enfants en danger (Introduction, p.1)
- **Methode :** Etude qualitative sur ChatGPT 3.5 et 4 avec deux scenarios medicaux (traitement pneumonie chez un enfant de 20 kg, recette de "purple drank" a base de codeine/promethazine) utilisant la technique "Role Playing" via interface web (Section "Testing a jailbreak prompt", p.3-5)
- **Donnees :** 2 scenarios medicaux, 2 versions de ChatGPT (GPT-3.5, GPT-4), 4 conditions (normal/jailbreak x 2 modeles), evaluation qualitative par des pediatres (Figures 1-4, p.4-5)
- **Resultat :** GPT-3.5 fournit librement des informations dangereuses (ingredients du purple drank, dosages pediatriques incorrects) tandis que GPT-4 montre une resistance amelioree mais cede au role-playing pour les dosages de pneumonie (Section Discussion, p.5-7)
- **Limite :** Article de type "Brief Report" sans evaluation quantitative ; seulement 2 scenarios, 1 famille de modeles, temperature non controlee (~0.7-0.8 estimee) (Section "Testing a jailbreak prompt", p.4)

### Analyse critique

**Forces :**

1. **Perspective pediatrique unique.** Premier article a notre connaissance qui aborde le jailbreaking medical du point de vue du pediatre praticien, pas du chercheur en securite IA. Cette perspective clinicienne enrichit le corpus en identifiant un vecteur de risque sous-estime : l'acces des adolescents aux LLM pour obtenir des informations dangereuses (Section Discussion, p.6, ref. 25-26).

2. **Scenarios cliniquement pertinents.** Le choix du purple drank (melange codeine/promethazine) est strategique : c'est une drogue recreative repandue chez les adolescents, et les auteurs notent que les jeunes connaissent mieux les noms commerciaux que les noms chimiques. Le scenario de pneumonie (enfant 20 kg) est egalement pertinent car les dosages pediatriques sont critiques --- une erreur de facteur 10 peut etre letale (Section Discussion, p.5-6).

3. **Taxonomie des techniques de jailbreaking.** L'article fournit une categorisation utile de 6 techniques (assumed responsibility, superior model, masking intent, inversion of roles/persons, role playing, context manipulation), citant des references specifiques pour chacune (Section "LLMs", p.2-3, refs 15-20).

4. **Mise en contexte reglementaire et ethique.** Discussion approfondie sur les implications pour la reglementation des IA medicales et la responsabilite professionnelle des pediatres (Section Discussion, p.6-8).

**Faiblesses :**

1. **Absence totale de metriques quantitatives.** Pas d'ASR, pas de taux de reussite/echec mesure, pas de scoring de nocivite. Les resultats sont entierement qualitatifs : "GPT-3.5 provides the recipe" vs "GPT-4 refuses". Pour une these doctorale, cette absence de quantification rend le papier inutilisable comme source de donnees empiriques (Section "Testing a jailbreak prompt", Figures 1-4).

2. **Echantillon minimal.** Seulement 2 scenarios medicaux, 1 technique de jailbreaking (role-playing), 1 famille de modeles (ChatGPT). N=4 conditions au total --- incompatible avec la rigueur statistique Sep(M) >= 30 requise par Zverev et al. (2025, ICLR, Definition 2).

3. **Temperature non controlee.** Les auteurs reconnaissent utiliser l'interface web de ChatGPT ou la temperature n'est pas parametrable directement, estimant ~0.7-0.8 sur la base de "unofficial sources" (Section "Testing a jailbreak prompt", p.4). Cette absence de controle rend les resultats non reproductibles.

4. **Focus exclusif ChatGPT.** Aucune comparaison cross-modele (pas de Claude, Llama, Gemini). Limite significative pour la generalisabilite des conclusions.

5. **Pas de discussion des defenses.** L'article identifie le probleme mais ne propose aucune solution concrete au-dela de recommandations generales ("ongoing research and development of more sophisticated approaches").

**Questions ouvertes :**
- L'acces des mineurs aux LLM pour obtenir des informations medicales dangereuses est-il quantifiable a l'echelle populationnelle ?
- Les techniques de role-playing sont-elles plus efficaces en contexte medical qu'en contexte general (confirmation potentielle de C6) ?
- L'amelioration GPT-3.5 → GPT-4 est-elle un effet du scaling ou du RLHF specifique ?

### Formules exactes
Aucune formule formelle --- article de type Brief Report sans contribution methodologique quantitative.
Classification epistemique : `[EMPIRIQUE]` (observations qualitatives sans metriques formalisees).
Lien glossaire AEGIS : N/A

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (l'alignement RLHF est la defense principale evaluee implicitement --- l'amelioration GPT-3.5→GPT-4 correspond a un renforcement δ⁰), δ¹ (les "restrictions" imposees par OpenAI sont des guardrails de type system prompt)
- **Conjectures :** C1 (supportee faiblement : le role-playing contourne les guardrails δ¹, mais sans quantification). C6 (supportee indirectement : les scenarios medicaux montrent un risque amplifie par rapport au contexte general, mais sans comparaison directe). C4 (neutre : l'amelioration GPT-3.5→GPT-4 pourrait suggerer que le scaling aide, mais N trop faible)
- **Decouvertes :** D-006 (medical specificity) confirmee indirectement --- les auteurs pediatres identifient des vecteurs de risque specifiques au domaine medical (dosages pediatriques, acces adolescents)
- **Gaps :** G-001 (absence de benchmark medical standardise) renforce par l'absence d'evaluation quantitative. G-003 (pediatrie comme sous-domaine non couvert par les benchmarks existants)
- **Mapping templates AEGIS :** #03 (role-playing --- methode utilisee directement), #05 (iterative refinement --- mentionne via "obscured text inputs" ref. Huang et al. 2024, Section Discussion, p.6)

### Citations cles
> "This is the first article that reviews, from a pediatric perspective, the risks that ChatGPT jailbreaking, and LLMs in general, could pose to the health of our youth" (Section Introduction, p.2)
> "modified prompts---such as those used in 'Role Playing'---can alter the model's output, potentially leading to the provision of harmful medical advice" (Abstract, p.1)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 4/10 |
| Reproductibilite | Faible --- pas de protocole experimental reproductible, evaluation qualitative uniquement, temperature non controlee |
| Code disponible | Non |
| Dataset public | Non |
