# P031 -- Analyse doctorale

## [Mondillo et al., 2024] -- Jailbreaking Large Language Models: Navigating the Crossroads of Innovation, Ethics, and Health Risks

**Reference :** DOI:10.21037/jmai-24-170
**Revue/Conf :** Journal of Medical Artificial Intelligence, 2025;8:6, AME Publishing Company (revue non indexee SCImago, non classee CORE)
**Lu le :** 2026-04-04
**Nature :** [EMPIRIQUE] -- etude qualitative de type Brief Report, observations sans metriques formalisees
> **PDF Source**: [literature_for_rag/P031_source.pdf](../../assets/pdfs/P031_source.pdf)
> **Statut**: [ARTICLE VERIFIE] -- lu en texte complet via ChromaDB (41 chunks paper_fulltext, 40562 caracteres)

---

### Abstract original
> This article examines the challenges and security concerns associated with the use of large language models (LLMs) like ChatGPT in the medical field, focusing particularly on the phenomena known as "LLM jailbreaking". As LLMs increasingly perform complex tasks involving sensitive information, the risk of their misuse becomes significant. Jailbreaking, originally a concept from software systems, refers to bypassing the restrictions set by developers to unlock new functionalities. This practice has spread to LLMs, where users manipulate model inputs to elicit responses otherwise restricted by ethical and safety guidelines. Our research specifically targets the implications of jailbreaking using ChatGPT versions 3.5 and 4 as case studies in two medical scenarios: pneumonia treatment and a recipe for a drink based on drugs. We demonstrate how modified prompts---such as those used in "Role Playing"---can alter the model's output, potentially leading to the provision of harmful medical advice or the disclosure of sensitive information. Findings indicate that while newer versions of ChatGPT show improved resistance to such manipulations, significant risks remain.
> -- Source : PDF page 1 (DOI:10.21037/jmai-24-170)

### Resume (5 lignes)
- **Probleme :** Risques du jailbreaking des LLM dans le domaine medical pediatrique, ou des conseils medicaux errones peuvent mettre des vies d'enfants en danger (Section Introduction, p.1-2)
- **Methode :** Etude qualitative sur ChatGPT 3.5 et GPT-4 avec deux scenarios medicaux (traitement pneumonie chez un enfant de 20 kg, recette de "purple drank" a base de codeine/promethazine) utilisant la technique Role Playing via interface web (Section "Testing a jailbreak prompt", p.3-5)
- **Donnees :** 2 scenarios medicaux, 2 versions de ChatGPT (GPT-3.5, GPT-4), 4 conditions (normal/jailbreak x 2 modeles), evaluation qualitative par des pediatres (Figures 1-4, p.4-5)
- **Resultat :** GPT-3.5 fournit librement des informations dangereuses (ingredients du purple drank, dosages pediatriques incorrects) tandis que GPT-4 montre une resistance amelioree mais cede au role-playing pour les dosages de pneumonie (Section Discussion, p.5-7)
- **Limite :** Brief Report sans evaluation quantitative ; seulement 2 scenarios, 1 famille de modeles, temperature non controlee (~0.7-0.8 estimee d'apres "unofficial sources") (Section "Testing a jailbreak prompt", p.4)

### Analyse critique

**Forces :**

1. **Perspective pediatrique unique.** Premier article du corpus a aborder le jailbreaking medical du point de vue du pediatre praticien. Cette perspective clinicienne identifie un vecteur de risque sous-estime : l'acces des adolescents aux LLM pour obtenir des informations dangereuses. Les auteurs soulignent que les jeunes connaissent mieux les noms commerciaux des drogues que les noms chimiques, facilitant les requetes a risque (Section Discussion, p.6, refs 25-26).

2. **Scenarios cliniquement pertinents et concrets.** Le choix du purple drank (melange codeine/promethazine, drogue recreative repandue chez les adolescents) et du traitement de la pneumonie pediatrique (enfant de 20 kg, ou une erreur de facteur 10 dans le dosage peut etre letale) sont strategiquement pertinents pour demonstrer les risques en contexte reel (Section "Testing a jailbreak prompt", p.3-5).

3. **Taxonomie des techniques de jailbreaking.** L'article fournit une categorisation utile de 6 techniques : assumed responsibility, superior model, masking intent, inversion of roles/persons, role playing, context manipulation. Chaque technique est referencee avec des citations specifiques (Section "LLMs", p.2-3, refs 15-20).

4. **Discussion ethique et reglementaire.** L'article propose une reflexion approfondie sur les implications pour la reglementation des IA medicales et la responsabilite professionnelle des pediatres, incluant des recommandations concretes (Section Discussion, p.6-8).

**Faiblesses :**

1. **Absence totale de metriques quantitatives.** Pas d'ASR, pas de taux de reussite/echec mesure, pas de scoring de nocivite. Les resultats sont entierement qualitatifs ("GPT-3.5 provides the recipe" vs "GPT-4 refuses"). Pour une these doctorale, cette absence de quantification rend le papier inutilisable comme source de donnees empiriques (Section "Testing a jailbreak prompt", Figures 1-4).

2. **Echantillon minimal.** 2 scenarios medicaux, 1 technique de jailbreaking (role-playing), 1 famille de modeles (ChatGPT). N=4 conditions au total -- incompatible avec la rigueur statistique Sep(M) >= 30 requise par Zverev et al. (2025, ICLR, Definition 2).

3. **Temperature non controlee.** Les auteurs reconnaissent utiliser l'interface web de ChatGPT ou la temperature n'est pas parametrable directement, estimant ~0.7-0.8 sur la base de "unofficial sources" (Section "Testing a jailbreak prompt", p.4). Cette absence de controle rend les resultats non reproductibles.

4. **Focus exclusif ChatGPT.** Aucune comparaison cross-modele (pas de Claude, Llama, Gemini). La generalisabilite des conclusions est severement limitee.

5. **Pas de discussion des defenses.** L'article identifie le probleme mais ne propose aucune solution technique concrete au-dela de recommandations generales d'amelioration des mecanismes defensifs (Section Discussion, p.7-8).

6. **Venue de faible impact.** Le Journal of Medical Artificial Intelligence (AME Publishing) n'est pas indexe SCImago et n'a pas de classement CORE. Le processus de revision est moins rigoureux que pour les venues majeures du corpus (JAMA, npj Digital Medicine, ICLR).

**Questions ouvertes :**
- L'acces des mineurs aux LLM pour obtenir des informations medicales dangereuses est-il quantifiable a l'echelle populationnelle ?
- Les techniques de role-playing sont-elles plus efficaces en contexte medical qu'en contexte general (test de C6) ?
- L'amelioration GPT-3.5 vers GPT-4 est-elle un effet du scaling ou du RLHF specifique ?
- Les dosages pediatriques fournis par GPT-3.5 sous jailbreak sont-ils cliniquement plausibles (ce qui les rendrait plus dangereux) ou clairement errones ?

**Positionnement dans le corpus AEGIS :**

P031 se situe au bas de l'echelle de rigueur quantitative du corpus medical (SVC 4/10), mais occupe une niche unique : la perspective clinicienne pediatrique. Les autres papiers du corpus (P029, P032, P034, P035) sont rediges par des chercheurs en securite IA, pas par des praticiens confrontes aux patients. Cette perspective praticienne identifie des risques que les chercheurs en securite ne voient pas : l'adolescent qui connait le nom commercial du purple drank mais pas son principe actif (codeine), le parent qui demande des dosages pour un enfant de 20 kg sans conscience de la marge therapeutique etroite. La taxonomie des 6 techniques de jailbreaking (Section "LLMs", p.2-3) est utile comme introduction pedagogique meme si elle manque de la profondeur de P037 (Chen et al., 2026, survey exhaustif). L'article est cite ici pour completude et pour la perspective clinique, pas pour ses resultats experimentaux.

### Formules exactes

Classification epistemique : `[EMPIRIQUE]` -- observations qualitatives sans metriques formalisees.

Aucune formule formelle. Article de type Brief Report sans contribution methodologique quantitative.

Les seules donnees "quantifiables" sont les observations binaires :
- GPT-3.5 + role-playing + purple drank : fournit les ingredients [SUCCES ATTAQUE] (Figure 1, p.4)
- GPT-3.5 + role-playing + pneumonie : fournit des dosages [SUCCES ATTAQUE] (Figure 2, p.4)
- GPT-4 + role-playing + purple drank : refuse [ECHEC ATTAQUE] (Figure 3, p.5)
- GPT-4 + role-playing + pneumonie : fournit des dosages [SUCCES PARTIEL] (Figure 4, p.5)

Lien glossaire AEGIS : N/A (pas de contribution metrique)

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF alignment) : evaluee implicitement -- l'amelioration GPT-3.5 vers GPT-4 correspond a un renforcement delta-0 (Section Discussion, p.5-6)
  - δ¹ (System prompt) : les "restrictions" imposees par OpenAI sont des guardrails de type system prompt, contournes par role-playing (Section Discussion, p.5-6)

- **Conjectures :**
  - C1 (insuffisance delta-1) : **supportee faiblement** -- le role-playing contourne les guardrails delta-1, mais sans quantification (Section "Testing a jailbreak prompt", Figures 1-4)
  - C6 (Medical Vulnerability Premium) : **supportee indirectement** -- les scenarios medicaux montrent un risque amplifie, mais sans comparaison directe avec un contexte non-medical
  - C4 (scaling) : **neutre** -- l'amelioration GPT-3.5 vers GPT-4 pourrait suggerer que le scaling aide, mais N trop faible pour conclure

- **Decouvertes :**
  - D-006 (medical specificity) : confirmee indirectement -- les auteurs pediatres identifient des vecteurs de risque specifiques au domaine medical (dosages pediatriques, acces adolescents) (Section Discussion, p.6)

- **Gaps :**
  - G-001 (benchmark medical standardise) : renforce par l'absence d'evaluation quantitative
  - G-003 (pediatrie comme sous-domaine) : cree -- la pediatrie n'est pas couverte par les benchmarks existants

- **Mapping templates AEGIS :** #03 (role-playing -- methode utilisee directement), #05 (iterative refinement -- mentionne via "obscured text inputs", ref. Huang et al. 2024, Section Discussion, p.6)

### Citations cles
> "This is the first article that reviews, from a pediatric perspective, the risks that ChatGPT jailbreaking, and LLMs in general, could pose to the health of our youth" (Section Introduction, p.2)
> "modified prompts---such as those used in 'Role Playing'---can alter the model's output, potentially leading to the provision of harmful medical advice" (Abstract, p.1)
> "In the medical field, jailbreaking can result in the provision of inappropriate medical advice, posing significant health risks to users" (Section LLMs, p.2)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 4/10 |
| Reproductibilite | Faible -- pas de protocole experimental reproductible, evaluation qualitative uniquement, temperature non controlee |
| Code disponible | Non |
| Dataset public | Non |
| Nature epistemique | [EMPIRIQUE] -- observations qualitatives, Brief Report |
| Confiance | 5/10 -- donnees qualitatives sans quantification, venue de faible impact |

---

*Analyse reecrite le 2026-04-05 | Source : 41 chunks paper_fulltext + 24 chunks analysis ChromaDB (aegis_bibliography) | Toutes les donnees verifiees dans le PDF original via ChromaDB*
