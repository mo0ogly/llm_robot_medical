# P059: "Give a Positive Review Only": An Early Investigation Into In-Paper Prompt Injection Attacks and Defenses for AI Reviewers
**Auteurs**: Qin Zhou, Zhexin Zhang, Zhi Li, Limin Sun (Institute of Information Engineering, CAS ; Tsinghua University)
**Venue**: arXiv:2511.01287v1 [cs.CL], novembre 2025 (NeurIPS 2025 Workshop on Socially Responsible and Trustworthy Foundation Models)
> **PDF Source**: [literature_for_rag/P059_2511.01287.pdf](../../literature_for_rag/P059_2511.01287.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (68 chunks, ~60 000 caracteres)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Zhou et al. presentent la premiere etude systematique de l'injection de prompt dans les documents soumis aux systemes d'evaluation par IA (AI peer review). Les auteurs proposent deux classes d'attaques : (1) l'attaque statique, qui insere un prompt malveillant fixe dans le PDF (texte blanc sur fond blanc, invisible pour les humains mais lisible par l'IA), et (2) l'attaque iterative, qui optimise le prompt d'injection sur plusieurs tours contre un modele de revieweur simule pour maximiser le score d'evaluation. Les deux attaques atteignent des performances quasi parfaites sur des revieweurs IA de pointe (Section 1-2, p. 1-2).

### Methodologie

L'evaluation est conduite sur 100 soumissions ICLR 2025, avec trois modeles revieweurs : GPT-5, DeepSeek-Chat (DeepSeek-V3) et Gemini-2.5-Pro. Les criteres d'evaluation suivent le format ICLR (score maximum 10) (Section 4, p. 3-5).

**Attaque statique** : un prompt fixe est insere dans le PDF (ex: texte blanc invisible contenant des instructions pour donner une evaluation positive). L'augmentation moyenne du score est mesuree directement (Section 3.1, p. 3).

**Attaque iterative** : optimisation du prompt d'injection contre un revieweur simule. L'objectif est formalise comme $p^* = \arg\max_p \mathbb{E}_{r \sim M_{sim}}[S_{review}(r)]$, ou $M_{sim}$ est le modele simule et $S_{review}$ le score d'evaluation (Section 3.2, p. 3).

L'analyse inclut la robustesse selon la position d'insertion (debut, milieu, fin), la note humaine initiale, la longueur du papier, et la transferabilite cross-modele de l'attaque iterative (Sections 5-6, p. 5-7).

### Resultats cles

- **Attaque statique** : augmentation moyenne de +1.91 pour Gemini, +2.80 pour DeepSeek, +1.24 pour GPT-5 sur l'echelle ICLR 1-10 (Section 4, p. 4)
- **Attaque iterative** : convergence vers le score maximum (10) en 3 tours d'optimisation pour Gemini et DeepSeek (Section 4, p. 4-5)
- **Robustesse** : l'attaque reussit independamment de la position d'insertion, de la note humaine originale, et de la longueur du papier (Section 5, p. 5-6)
- **Transferabilite cross-modele** : l'attaque iterative optimisee contre un modele se transfere avec succes a d'autres modeles (Section 5, p. 6)
- **Defense detection-based** : un prompt de detection reduit substantiellement l'ASR, mais un attaquant adaptatif (qui ajoute des instructions d'evasion de detection) compromet significativement l'efficacite de la defense (Section 6, p. 6-7)

### Limitations admises par les auteurs

Les auteurs reconnaissent : (1) l'etude est limitee a 100 papiers ICLR 2025, (2) seuls 3 modeles commerciaux sont testes, (3) la defense proposee est basique (detection par prompt) et non robuste aux attaquants adaptatifs, (4) l'etude porte sur l'evaluation academique uniquement -- la generalisation a d'autres systemes document-processing n'est pas demontree experimentalement.

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Lien glossaire AEGIS |
|----|---------|-------------------|----------------------|
| F52 | $$p^* = \arg\max_p \mathbb{E}_{r \sim M_{sim}}[S_{review}(r)]$$ | $M_{sim}$ = revieweur simule, $S_{review}$ = score d'evaluation, $p$ = prompt d'injection | F52 (Iterative Injection Optimization Score, IIOS) |
| Delta static | $$\Delta_{static} = \bar{S}_{attack} - \bar{S}_{clean}$$ | Difference moyenne de score entre papiers injectes et propres | Derive |

**Variables** :
- $p^*$ : prompt d'injection optimal
- $M_{sim}$ : modele de revieweur simule (utilise pendant l'optimisation)
- $S_{review}(r)$ : score d'evaluation attribue par le revieweur a la reponse $r$
- $\Delta_{static}$ : impact moyen de l'attaque statique (+1.24 a +2.80 selon le modele)

**Nature epistemique** : [EMPIRIQUE] — optimisation iterative empirique, pas de garantie theorique de convergence ni de borne sur le nombre de tours necessaires.

---

## Section 3 — Critique methodologique

### Forces

1. **Premiere etude systematique** — le domaine de l'injection in-document pour AI review est vierge ; ce papier pose les fondations (Section 1, p. 1).
2. **Attaque realiste** — l'insertion de texte blanc invisible dans un PDF est une technique connue et facilement deployable. Le contexte AAAI ayant introduit le reviewing assiste par IA rend la menace concrete et actuelle (Section 1, p. 1-2).
3. **Analyse de robustesse multi-facteur** — position, note initiale, longueur. L'attaque est robuste a tous ces facteurs (Section 5, p. 5-6).
4. **Dynamique attaque/defense** — l'evaluation inclut une defense ET un attaquant adaptatif, documentant la course aux armements (Section 6, p. 6-7).
5. **3 modeles frontier** — GPT-5, DeepSeek-V3, Gemini-2.5-Pro. Ce sont les modeles les plus avances disponibles au moment de l'etude.

### Faiblesses

1. **100 papiers seulement** — N modeste pour une evaluation statistique rigoureuse, bien que suffisant pour les tendances principales.
2. **Pas de test statistique formel** — les differences de scores sont rapportees en moyennes sans intervalles de confiance, p-values ni tailles d'effet.
3. **Defense naive** — la defense par detection (prompt demandant au revieweur d'identifier les injections) est basique. Des defenses structurelles (parsing du PDF, extraction du contenu visible uniquement) ne sont pas evaluees.
4. **Workshop paper** — statut editorial limite (poster NeurIPS Workshop, pas main conference).
5. **Generalisation non demontree** — l'etude porte exclusivement sur le reviewing academique. La transposition au traitement de documents medicaux (dossiers patients, essais cliniques) est plausible mais non testee.
6. **Modeles API-only** — GPT-5, DeepSeek, Gemini sont testes via API. Pas de test sur des modeles open-weight.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C2** (attaquant adaptatif > defense statique) | CRITIQUE | L'attaquant adaptatif compromet la defense detection-based | Confirme la dynamique de course aux armements documentee dans D-001 |
| **C4** (derive semantique mesurable) | FORT | Le delta de score (+1.24 a +2.80) quantifie l'impact de l'injection | La manipulation est mesurable et reproductible |

### Couches delta

- **delta-0** : non applicable directement (l'attaque cible le traitement de documents, pas l'alignement RLHF).
- **delta-1 (injection statique)** : l'attaque statique correspond a un template fixe de type delta-1 dans la taxonomie AEGIS.
- **delta-2 (injection iterative)** : l'attaque iterative correspond a l'optimisation genetique delta-2 -- le prompt est optimise contre un simulateur de la cible.
- **delta-3** : non teste. La validation formelle de la coherence entre le contenu du papier et l'evaluation pourrait constituer une defense delta-3.

### Formules AEGIS impactees

- **F52 (IIOS)** : directement definie par P059. La formulation $p^* = \arg\max_p \mathbb{E}[S_{review}(r)]$ est structurellement identique a l'optimisation du moteur genetique AEGIS contre un juge simule.
- **Lien moteur genetique AEGIS** : l'attaque iterative de P059 est conceptuellement identique au moteur genetique AEGIS : optimisation offline d'un prompt adversarial contre un simulateur de la cible, puis deploiement contre la production.
- **Technique T46 (In-Document Injection)** : texte blanc, paragraphes caches, zero-width characters. Toute application LLM traitant des documents soumis par des utilisateurs est vulnerable.
- **Technique T47 (Iterative Optimization Against Simulated Defender)** : l'asymetrie fondamentale attaquant/defenseur est explicitement demontree : l'attaquant optimise offline, le defenseur doit couvrir tous les inputs en temps reel.

### Implications pour le contexte medical AEGIS

Les dossiers medicaux electroniques avec des injections cachees pourraient alterer les diagnostics produits par un LLM. Les resultats d'essais cliniques pourraient etre manipules pour obtenir des evaluations favorables. La surface d'attaque s'etend a TOUT systeme LLM traitant des documents non-fiables.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P059 |
| **Type** | Attaque (in-document injection, statique + iterative) |
| **Domaine** | Injection de prompt indirecte, AI peer review, securite document |
| **Modeles testes** | GPT-5, DeepSeek-Chat (DeepSeek-V3), Gemini-2.5-Pro |
| **Dataset** | 100 soumissions ICLR 2025 |
| **Metrique principale** | Delta score statique : +1.24 a +2.80 ; iteratif : convergence vers score max (10) en 3 tours (Section 4, p. 4-5) |
| **delta-layers** | δ¹ (injection statique), δ² (optimisation iterative) |
| **Conjectures** | C2 (critique), C4 (fort) |
| **Reproductibilite** | Moyenne — soumissions ICLR publiques, mais code non explicitement publie |
| **Code disponible** | Non mentionne |
| **Dataset public** | Partiellement (soumissions ICLR publiques) |
| **SVC pertinence** | 7/10 |
| **Tags** | [ARTICLE VERIFIE], in-paper injection, AI review, NeurIPS Workshop, attaque statique/iterative, course aux armements |
