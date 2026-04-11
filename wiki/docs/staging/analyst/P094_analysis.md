# P094 : Analyse doctorale

## [Zhao et al., 2026] — Chain-of-Thought Hijacking

**Reference** : arXiv:2510.26418v3
**Revue/Conf** : Preprint, fevrier 2026 (v3). Affiliations : Independent, Stanford, Anthropic, Oxford, Martian.
**Lu le** : 2026-04-07
> **PDF Source**: [literature_for_rag/P_LRM_2510.26418.pdf](../../assets/pdfs/P_LRM_2510.26418.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (79 chunks, ~78 196 caracteres)

---

### Abstract original

> Large Reasoning Models (LRMs) improve task performance through extended inference-time reasoning. While prior work suggests this should strengthen safety, we find evidence to the contrary. Long reasoning sequences can be exploited to systematically weaken them. We introduce Chain-of-Thought Hijacking, a jailbreak attack that prepends harmful instructions with extended sequences of benign puzzle reasoning. Across HarmBench, CoT Hijacking achieves attack success rates of 99%, 94%, 100%, and 94% on Gemini 2.5 Pro, ChatGPT o4 Mini, Grok 3 Mini, and Claude 4 Sonnet. To understand this mechanism, we apply activation probing, attention analysis, and causal interventions. We find that refusal depends on a low-dimensional safety signal that becomes diluted as reasoning grows: mid-layers encode the strength of safety checking, while late layers encode the refusal outcome. These findings demonstrate that explicit chain-of-thought reasoning introduces a systematic vulnerability when combined with answer-prompting cues. We release all evaluation materials to facilitate replication.
> — Source : PDF page 1

---

### Resume (5 lignes)

- **Probleme :** Le raisonnement etendu (CoT long) est suppose renforcer la securite des LRM, mais cette hypothese n'a pas ete rigoureusement testee (Zhao et al., 2026, Section 1, p. 1).
- **Methode :** CoT Hijacking prepose un raisonnement benin complexe (puzzles, Sudoku, logique) au prompt nocif, suivi d'un "final-answer cue". Pipeline automatise utilisant Gemini 2.5 Pro comme attaquant avec boucle de feedback black-box (Zhao et al., 2026, Section 4.1, Figure 2-3, p. 3-4). Analyse mecanistique par probing d'activation, analyse d'attention et ablations causales.
- **Donnees :** HarmBench (benchmark standard), 4 modeles frontier : Gemini 2.5 Pro, ChatGPT o4 Mini, Grok 3 Mini, Claude 4 Sonnet. Etude preliminaire sur s1-32B (Zhao et al., 2026, Table 1, Section 3).
- **Resultat :** ASR de 99% (Gemini 2.5 Pro), 94% (o4 Mini), 100% (Grok 3 Mini), 94% (Claude 4 Sonnet). Surpasse massivement les methodes precedentes : Mousetrap (44%), H-CoT (60%), AutoRAN (69%) sur Gemini 2.5 Pro. Etude preliminaire : ASR passe de 27% (CoT minimal) a 80% (CoT etendu) sur s1-32B (Zhao et al., 2026, Table 1, Section 4.2).
- **Limite :** Les auteurs admettent que l'attaque repose sur des modeles acceptant des prompts tres longs ; la defense par limitation de longueur de prompt pourrait mitiger partiellement le probleme. Le cout en temps d'inference (>5 minutes de raisonnement) est un facteur pratique (Zhao et al., 2026, Section 1, p. 1).

---

### Analyse critique

**Forces :**

1. **Meilleure attaque de la litterature sur modeles frontier (2026)** : 99% ASR sur Gemini 2.5 Pro et 100% sur Grok 3 Mini sont les resultats les plus eleves jamais rapportes sur des modeles de derniere generation. Le test sur Claude 4 Sonnet (94%) avec un co-auteur d'Anthropic (Mrinank Sharma) ajoute de la credibilite.

2. **Analyse mecanistique profonde et originale** : c'est le seul papier du lot qui fournit une explication causale du phenomene. L'identification du signal de securite dans les couches intermediaires (mid-layers = force de la verification) et les couches tardives (late layers = decision de refus), et sa dilution avec la longueur du CoT, est une contribution theorique majeure. Les ablations causales sur les attention heads confirment le mecanisme.

3. **Resultat fondamental** : la relation monotone "CoT plus long -> moins de refus" (Table 1 : 27% -> 51% -> 80% sur s1-32B) est la demonstration la plus nette que le raisonnement etendu est intrinsequement dangereux pour la securite. C'est le coeur de C7.

4. **Pipeline reproductible** : le code est publie (GitHub), tous les materiaux d'evaluation sont liberes, et la methode ne necessite qu'un acces black-box au modele cible.

5. **Lien avec la theorie de l'attention** : l'explication par dilution de l'attention (les tokens nocifs recoivent moins d'attention quand le contexte est domine par du raisonnement benin) est coherente avec les observations de P087 (H-CoT) et fournit le mecanisme sous-jacent manquant.

**Faiblesses :**

1. **Cout d'attaque eleve** : forcer le modele a raisonner >5 minutes par requete est couteux en API et en temps. L'attaque est efficace mais pas necessairement pratique pour un attaquant cherchant a operer a grande echelle.

2. **Defense triviale potentielle** : limiter la longueur des prompts ou des CoT pourrait mitiger l'attaque. Les auteurs n'evaluent pas cette defense simple.

3. **Analyse mecanistique sur modele open-source uniquement** : le probing d'activation est fait sur s1-32B (open-weight), pas sur les modeles frontier fermes. On ne sait pas si le meme mecanisme de dilution opere dans Gemini ou Claude.

4. **Pas de comparaison avec P087 (H-CoT du meme nom)** : bien que le titre soit similaire a "H-CoT" de Kuo et al. (P087), les deux methodes sont differentes — P087 injecte des fragments T_E, P094 prepose du raisonnement benin. La distinction meriterait d'etre explicitee.

---

### Formules exactes

**Dilution du signal de securite** (Section interpretabilite) :
- Le vecteur de refus est identifie par probing lineaire dans les couches intermediaires
- L'attention sur les tokens nocifs diminue inversement avec la longueur du CoT benin
- Les ablations des attention heads identifiees reduisent causalement le refus

Pas de formule mathematique formelle originale, mais les metriques de probing et les scores d'attention sont quantifies dans les figures.

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) — le signal de securite comme sous-espace separable est directement lie a la definition formelle de Sep(M) de Zverev et al., 2025)

---

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF) : directement cible. L'attaque montre que l'alignement RLHF est une propriete fragile qui se dilue avec la longueur du contexte.
  - δ¹ (system prompt) : le "final-answer cue" depasse les instructions systeme
  - δ² (sanitization) : non adresse — un detecteur de longueur de prompt ou de ratio contenu benin/nocif pourrait etre une defense
  - δ³ (tool control) : non adresse

- **Conjectures :**
  - **C7 (paradoxe raisonnement/securite) : DEMONTREE MECANISTIQUEMENT.** Ce papier fournit la premiere explication causale de C7 : le signal de securite est un sous-espace basse dimension qui se dilue quand le raisonnement s'allonge. C'est la preuve mecanistique la plus forte du paradoxe. La relation monotone "plus de raisonnement = moins de securite" est maintenant un fait empirique avec explication causale.

- **Decouvertes :**
  - D-012 (CoT comme surface d'attaque) : confirmee avec la preuve la plus forte a ce jour
  - D-019 (signal de securite basse dimension) : NOUVELLE DECOUVERTE — le refus depend d'un sous-espace basse dimension dilutable

- **Gaps :**
  - G-017 (defense par scaling du signal de securite) : cree — comment renforcer le signal de securite pour qu'il ne se dilue pas avec la longueur du CoT ?
  - G-018 (transferabilite du mecanisme aux modeles fermes) : cree — le meme mecanisme de dilution opere-t-il dans GPT, Claude, Gemini ?

- **Mapping templates AEGIS :** Le concept de "preface benigne" correspond aux templates de cadrage (#53 alternate reality, #58 fictional reality, #72 test mode, #87 irrelevant detail distraction) et l'idee de "noyer le signal nocif dans du contenu benin" est exactement le principe du template #76 (context overflow padding) et #77 (context overload prompting).

---

### Citations cles

> "CoT Hijacking achieves attack success rates of 99%, 94%, 100%, and 94% on Gemini 2.5 Pro, ChatGPT o4 Mini, Grok 3 Mini, and Claude 4 Sonnet" (Abstract, p. 1)

> "refusal depends on a low-dimensional safety signal that becomes diluted as reasoning grows: mid-layers encode the strength of safety checking, while late layers encode the refusal outcome" (Abstract, p. 1)

> "longer reasoning traces substantially increase the likelihood of harmful outputs, with ASR rising from 27% (Minimal) to 80% (Extended)" (Section 3, Table 1, p. 3)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 |
| Reproductibilite | Haute — code et materiaux publies (https://github.com/gentlyzhao/Hijacking), HarmBench public |
| Code disponible | Oui (GitHub) |
| Dataset public | Oui (HarmBench) |
| Nature epistemique | [EMPIRIQUE] + [ALGORITHME] — attaque avec analyse mecanistique causale |
| Type d'attaque | CoT Hijacking / Attention Dilution |
| MITRE ATLAS | AML.T0051.003 (Prompt Injection — Reasoning Exploitation) |
| OWASP LLM | LLM01 (Prompt Injection) |
