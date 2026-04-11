# P102 — Analyse doctorale

## [Huang, Zhang, Yue, Li, Zhang & Liu, 2025] — Safety Alignment Should Be Made More Than Just A Few Attention Heads

**Reference :** arXiv:2508.19697v1
**Revue/Conf :** Preprint, aout 2025 (soumission probable ACL/EMNLP 2026)
**Lu le :** 2026-04-07
> **PDF Source**: [literature_for_rag/P_MSBE_2508.19697.pdf](../../assets/pdfs/P_MSBE_2508.19697.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (74 chunks)

### Abstract original
> Current safety alignment for large language models (LLMs) continues to present vulnerabilities, given that adversarial attacks can manipulate model outputs. The authors observe that safety-critical behaviors in LLMs are concentrated in only a small subset of attention heads, and ablating these heads can severely compromise model safety. To identify and evaluate these safety-critical components, they introduce RDSHA, a targeted ablation method that leverages the model's refusal direction to pinpoint attention heads most responsible for safety behaviors. Further analysis shows that existing jailbreak attacks exploit this concentration by selectively bypassing or manipulating only a few critical heads. To address this vulnerability, they propose AHD (Attention Head-level Dropout), a training strategy that promotes distributed encoding of safety across attention heads. Models trained with AHD exhibit considerably stronger safety robustness while maintaining overall functional utility.
> — Source : PDF page 1 (paraphrase)

### Resume (5 lignes)
- **Probleme :** L'alignement de securite des LLMs est concentre dans un petit sous-ensemble de tetes d'attention, ce qui cree un point de defaillance unique exploitable par les attaques adversariales (Huang et al., 2025, Section 1, p. 1).
- **Methode :** RDSHA (Refusal Direction-Guided Safety Head Ablation) identifie les tetes critiques en projetant les sorties de chaque tete sur la direction de refus r, puis les classe par score d'influence s_h = |O_h . r| / ||r||. AHD (Attention Head-level Dropout) distribue la securite via dropout stochastique au niveau des tetes pendant l'entrainement (Section 3-4, Algorithm 1-2, p. 2-5).
- **Donnees :** 50 prompts nuisibles d'AdvBench, 4 modeles : LLaMA-2-7B-Chat, LLaMA-3-8B-IT, Qwen-7B-Chat, Qwen2-7B-IT. Evaluation contre AutoDAN (-GA/-HGA), SI-GCG, Adaptive attacks (Section 3.2, 4.2, p. 3-5).
- **Resultat :** L'ablation de ~50-100 tetes suffit a faire passer le taux de nuisibilite de ~0% a ~80-100% (Figure 1a, p. 1). Apres AHD, ce meme nombre d'ablations ne provoque qu'une degradation graduelle a ~20-40% (Figure 1b). AHD reduit l'ASR des jailbreaks : e.g., LLaMA-3 passe de 100% (AutoDAN-HGA) a 0%, de 74% (SI-GCG) a 0%, de 100% (Adaptive) a 0% (Table 1, p. 6).
- **Limite :** Fine-tuning sur jeu de donnees Alpaca uniquement (utility anchor limitee) ; 4 modeles 7-8B seulement ; pas de test sur modeles >70B ni modeles proprietaires (Section 6, Limitations, p. 7).

### Analyse critique

**Forces :**
1. **Decouverte fondamentale** : la securite est encodee de maniere sparse dans l'architecture transformer. La demonstration (Figure 2, Section 3.3, p. 4) que les 50 tetes les plus critiques sont consistantes a travers les prompts (i.e., ce sont les memes tetes qui portent la securite, pas des tetes differentes pour chaque prompt) est une contribution architecturale majeure. Cette sparsification explique mecaniquement pourquoi les jailbreaks fonctionnent : ils n'ont besoin de contourner que quelques composants.
2. **Analyse de l'interaction attaques-tetes** (Section 3.4, Figure 4, p. 4-5) : les attaques SI-GCG, AutoDAN et Adaptive reduisent systematiquement les scores d'influence des tetes critiques, confirmant que les jailbreaks exploitent cette concentration. Differentes attaques ciblent differentes tetes, suggerant une complementarite des vecteurs d'attaque.
3. **Defense par design architectural** plutot que par detection ou filtrage : AHD est elegant dans sa simplicite — un dropout au niveau des tetes pendant l'entrainement de securite force le modele a distribuer la securite. C'est une approche complementaire aux defenses perimetriques.
4. **Preservation de l'utilite** (Table 2, p. 6) : AHD ne degrade pas significativement les performances sur ARC, GSM8K, MATHQA, malgre l'utilisation d'Alpaca seul comme utility anchor.
5. **Pas d'over-refusal** : taux de refus sur prompts benins equivalent entre modeles originaux et modeles AHD (Section 4.4, p. 7).

**Faiblesses :**
1. **Modeles de petite taille uniquement** (7-8B). La concentration de la securite dans quelques tetes est-elle un phenomene specifique aux petits modeles, ou se retrouve-t-elle a plus grande echelle (70B, 405B) ? Les auteurs ne repondent pas.
2. **AdvBench seulement** (50 prompts) pour l'evaluation de securite. Un benchmark plus large (HarmBench, JailbreakBench) serait necessaire pour valider la generalisation.
3. **Pas de test multi-tour** : toutes les evaluations sont en single-turn. L'AHD resiste-t-il a des attaques multi-tour comme Crescendo ou STAR ? La distribution de la securite empeche-t-elle l'erosion progressive ?
4. **Direction de refus unique** : RDSHA suppose une direction de refus unique r (Section 2, Eq. 5-7, p. 2-3), ce qui est une simplification. Des travaux recents (Arditi et al., 2024) montrent que la direction de refus peut etre multidimensionnelle.
5. **Phenomene Qwen** non explique : au-dela de 100 tetes ablates, Qwen produit des reponses non-engagees plutot que nuisibles (Section 3.3, p. 4). Ce comportement atypique merite investigation.

**Questions ouvertes :**
- AHD resiste-t-il aux attaques multi-tour (P097/STAR, P099/Crescendo) ?
- La distribution de la securite via AHD elimine-t-elle le phenomene de drift monotone de la direction de refus observe par Li et al. (P097) ?
- Comment AHD interagit-il avec l'alignement deliberatif des LRM ?

### Formules exactes

**Eq. 5 — Direction de refus :**
r(l) = mu(l) - nu(l)
(Section 2, p. 2)

**Eq. 6-7 — Moyennes des activations :**
mu(l) = (1/|D_harmful|) * sum_{t in D_harmful} x(l)(t)
nu(l) = (1/|D_harmless|) * sum_{t in D_harmless} x(l)(t)
(Section 2, p. 2-3)

**Eq. 8 — Score d'influence des tetes :**
s_h(p) = |O_h(p) . r| / ||r||
(Section 3.1, p. 3)

**Algorithm 2 — AHD :**
M ~ Bernoulli(1 - dropout_rate)^num_heads
M <- M / (1 - dropout_rate) [rescaling]
(Section 4.1, p. 5)

Lien glossaire AEGIS : F22 (ASR — harmfulness rate), F15 (Sep(M) — non utilise mais pertinent pour la distribution)

### Pertinence these AEGIS

- **Couches delta :** δ⁰ (la concentration de la securite dans quelques tetes est un phenomene inherent au modele, independant de l'attaque — c'est un artefact du processus d'alignement)
- **Conjectures :** C1 (fragilite de l'alignement) **mecaniquement expliquee** — la securite repose sur un petit nombre de tetes, d'ou la fragilite structurelle ; C6 (alignement superficiel) **fortement supportee** — la concentration dans quelques tetes est la definition meme de l'alignement superficiel (Qi et al., 2025)
- **Decouvertes :** D-001 (mecanismes internes de l'alignement) **directement adresse** — cartographie precise des composants architecturaux portant la securite ; D-003 (erosion progressive) **eclairee mecaniquement** — si la securite repose sur quelques tetes, il suffit de les contourner progressivement pour eroder la frontiere
- **Gaps :** RR-FICHE-001 (MSBE) **partiellement adresse** — le papier explique POURQUOI le MSBE fonctionne (concentration sparse) mais ne teste pas le MSBE directement (pas de multi-tour). Gap : tester AHD contre des attaques MSBE.
- **Mapping templates AEGIS :** pertinence generale pour toutes les attaques, en particulier celles ciblant la couche δ⁰ (bypass architectural)

### Citations cles
> "Safety-critical behaviors of LLMs are frequently concentrated in a small subset of attention heads." (Section 1, Abstract, p. 1)
> "Existing jailbreak attacks exploit this concentration by selectively bypassing or manipulating only a few critical heads." (Section 3.4, p. 4)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — modeles open-source (LLaMA, Qwen), AdvBench public, code annonce |
| Code disponible | Annonce dans le papier |
| Dataset public | AdvBench (public) |
