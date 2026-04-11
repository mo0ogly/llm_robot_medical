# P099 — Analyse doctorale

## [Russinovich, Salem & Eldan, 2024] — Great, Now Write an Article About That: The Crescendo Multi-Turn LLM Jailbreak Attack

**Reference :** arXiv:2404.01833
**Revue/Conf :** Microsoft Research, preprint 2024 (presente a divers workshops)
**Lu le :** 2026-04-07
> **PDF Source**: [literature_for_rag/P_MSBE_2404.01833.pdf](../../assets/pdfs/P_MSBE_2404.01833.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (77 chunks)

### Abstract original
> Large Language Models (LLMs) have risen significantly in popularity and are increasingly being adopted across multiple applications. These LLMs are heavily aligned to resist engaging in illegal or unethical topics as a means to avoid contributing to responsible AI harms. However, a recent line of attacks, known as "jailbreaks", can successfully break this alignment. Most of these jailbreaks are single-turn, and thus susceptible to detection by model input and output filters. In this work, we introduce Crescendo, a novel multi-turn jailbreak that interacts with the model in a seemingly benign manner. It begins with a general prompt or question about the task at hand and then gradually escalates the dialogue by referencing the model's replies progressively leading to a successful jailbreak. We evaluate Crescendo on various public systems, including ChatGPT, Gemini Pro, Gemini-Ultra, LlaMA-2 70b and LlaMA-3 70b Chat, and Anthropic Chat. Our results demonstrate the strong efficacy of the method across models and tasks, achieving 29-61% higher performance on GPT-4 and 49-71% on Gemini-Pro compared to baselines on the AdvBench subset dataset.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les jailbreaks single-turn sont detectables par les filtres d'entree/sortie ; il manque une approche multi-tour qui utilise des entrees entierement benignes pour contourner les defenses (Russinovich et al., 2024, Section 1, p. 1).
- **Methode :** Crescendo est un jailbreak multi-tour qui debute par des questions generales puis escalade progressivement en referencant les reponses du modele. Crescendomation automatise le processus avec un LLM attaquant (GPT-4), un juge (Primary + Secondary), et un mecanisme de backtracking (Algorithm 1, Section 4, p. 7).
- **Donnees :** AdvBench subset (50 taches) + 15 taches manuelles (Table 1) + HarmBench (100 taches), 7 modeles cibles : GPT-4, GPT-3.5, Gemini-Pro, Claude-2, Claude-3 Opus, Claude-3.5 Sonnet, LLaMA-2 70B, LLaMA-3 70B (Section 5, p. 8).
- **Resultat :** ASR moyen 56.2% (GPT-4) et 82.6% (GeminiPro) sur AdvBench, vs MSJ 37%/35.4%, PAIR 40%/33%, CIA 35.6%/42.4%, CoA 22%/24% (Table 4, p. 9). ASR binaire de 98% (GPT-4) et 100% (Gemini-Pro). En moins de 5 tours en moyenne (Table 5, p. 10).
- **Limite :** Crescendomation necessite API access ; pas de test sur les modeles sans historique ; backtracking exploite la fonctionnalite d'edition specifique a ChatGPT/Gemini (Section 6.1, p. 13).

### Analyse critique

**Forces :**
1. **Contribution fondatrice** pour le domaine des jailbreaks multi-tour. Crescendo formalise pour la premiere fois le concept d'escalade progressive par referencement contextuel — le modele est amene a construire lui-meme le contexte nuisible. La demonstration que seules des entrees benignes suffisent a jailbreaker des modeles de production est une contribution majeure (Section 3, p. 4-5).
2. **Analyse mecaniste de la montee en probabilite** (Section 3.3, Figure 4, p. 5-6) : demonstration experimentale que l'ajout de contexte lie a la profanite augmente incrementalement la probabilite de generation de contenu profane sur LLaMA-2 70B. Les experiences de saut de tours (Table 3, p. 6) montrent que le contexte accumule est essentiel, pas seulement le dernier prompt.
3. **Automatisation complete** (Crescendomation, Algorithm 1, p. 7) avec juge en boucle, backtracking, et evaluation multi-niveaux (Primary Judge + Secondary Judge + APIs externes). L'architecture est reproductible et extensible.
4. **Evaluation contre defenses** : Self-Reminder et Goal Prioritization (Section 5.7, Figure 13, p. 12-13) montrent que ces defenses reduisent mais n'eliminent pas Crescendomation, surtout avec plus de tours et de backtracking.
5. **Responsible disclosure** : vulnerabilite signalee a toutes les entreprises impactees avant publication, avec collaboration pour ameliorer les filtres (Section 8, p. 14).

**Faiblesses :**
1. **Juge LLM biaise** : le Primary Judge (GPT-4) est sujet a des faux negatifs par auto-censure (le modele refuse de declarer le succes d'un jailbreak). Le Secondary Judge reduit mais n'elimine pas ce biais (Section 4.2, p. 7). Pas de juge deterministe.
2. **LLaMA-2 resistant a Crescendomation** pour certaines taches (Manifesto, Explicit — Figure 10, p. 11), mais cela n'est pas analyse en profondeur. Quels mecanismes specifiques de LLaMA-2 expliquent cette resistance ?
3. **Transferabilite limitee** (Section 5.6, Figure 12, p. 12) : les Crescendos generes pour un modele ne transferent pas toujours vers d'autres modeles (e.g., Explicit, Manifesto a ~0% cross-modele), ce qui suggere une dependance forte au modele cible.
4. **Pas de formalisation mathematique** du processus d'escalade. Le papier est empirique et descriptif — il manque un modele theorique de l'erosion progressive (contrairement a P097/STAR).
5. **Modeles dates** : GPT-4 (version non specifiee), Claude-2 (remplace par Claude-3/4). Les resultats de 2024 ne sont probablement plus valides sur les versions actuelles.

**Questions ouvertes :**
- Crescendo reste-t-il efficace contre l'alignement deliberatif (o1-style) ?
- Le backtracking est-il necessaire ou simplement un accelerateur ?
- La resistance de LLaMA-2 a certaines taches provient-elle d'un surapprentissage sur des categories specifiques de refus ?

### Formules exactes

Pas de formules mathematiques originales. Le papier est entierement empirique. L'algorithme de Crescendomation (Algorithm 1, p. 7) est une boucle iterative avec juge en feedback, sans formalisation probabiliste.

Lien glossaire AEGIS : F22 (ASR — metrique principale)

### Pertinence these AEGIS

- **Couches delta :** δ¹ (escalade linguistique progressive), δ² (referencement contextuel — exploitation de la coherence conversationnelle, couche cognitive)
- **Conjectures :** C1 (fragilite de l'alignement) **fortement supportee** — Crescendo montre que des entrees benignes suffisent a briser l'alignement via accumulation contextuelle ; C2 (inefficacite des defenses perimetriques) **supportee** — Self-Reminder et Goal Prioritization sont contournees
- **Decouvertes :** D-003 (erosion progressive) **directement confirmee** — Crescendo EST le MSBE en action, avec une escalade graduelle des probabilites de generation nuisible
- **Gaps :** RR-FICHE-001 (MSBE) **adresse empiriquement** — Crescendo est l'une des premieres demonstrations pratiques du MSBE, bien que sans formalisation. Le gap persiste sur le plan theorique.
- **Mapping templates AEGIS :** #07 (multi-turn APT), #22 (SQL research multi-step), #52 (unwitting user delivery — le modele participe a sa propre corruption)

### Citations cles
> "Crescendo does not use any adversarial or malicious text in its prompts. The inputs for Crescendo are composed entirely of seemingly benign text." (Section 2, p. 4)
> "We recommend that system designers, users, and policymakers consider this assumption when evaluating and deploying LLMs: it is beneficial to operate under the worst-case scenario and assume that LLMs can generate such content without explicitly attempting to generate the jailbreak that leads to that content." (Section 6.3, p. 14)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Moyenne-Haute — protocole detaille, AdvBench/HarmBench publics, mais GPT-4 comme attaquant (cout + version) |
| Code disponible | Non (Microsoft internal) |
| Dataset public | AdvBench subset + HarmBench (publics) |
