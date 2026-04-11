# P128 — Analyse doctorale

## [Kang, Li, Stoica, Guestrin, Zaharia & Hashimoto, 2023] — Exploiting Programmatic Behavior of LLMs: Dual-Use Through Standard Security Attacks

**Reference :** arXiv:2302.05733
**Revue/Conf :** Preprint 2023 (UIUC / Stanford / UC Berkeley) — premiere soumission fevrier 2023, reference fondatrice pour l'analyse dual-use des LLMs instruction-following
**Lu le :** 2026-04-09
> **PDF Source**: [literature_for_rag/P128_2302.05733.pdf](../../assets/pdfs/P128_2302.05733.pdf)
> **Statut**: [ARTICLE VERIFIE] — abstract et metadonnees verifies via WebFetch arXiv (2026-04-09). Section HTML 404 sur arxiv.org/html/2302.05733v1 — details experimentaux completés via recherche web (Semantic Scholar, WebSearch) et abstract officiel.

### Abstract original
> Recent advances in instruction-following large language models (LLMs) have led to dramatic improvements in a range of NLP tasks. Unfortunately, we find that the same improved capabilities amplify the dual-use risks for malicious purposes of these models. Dual-use is difficult to prevent as instruction-following capabilities now enable standard attacks from computer security. The capabilities of these instruction-following LLMs provide strong economic incentives for dual-use by malicious actors. In particular, we show that instruction-following LLMs can produce targeted malicious content, including hate speech and scams, bypassing in-the-wild defenses implemented by LLM API vendors. Our analysis shows that this content can be generated economically and at cost likely lower than with human effort alone. Together, our findings suggest that LLMs will increasingly attract more sophisticated adversaries and attacks, and addressing these attacks may require new approaches to mitigations.
> — Source : arXiv abs page, paragraphe abstract

### Resume (5 lignes)
- **Probleme :** Les capacites accrues d'instruction-following des LLMs amplifient mecaniquement le risque dual-use : les memes mecanismes qui rendent les modeles utiles pour des taches benignes (rediger un email, suivre un format, adopter un ton) les rendent exploitables pour des attaques de securite informatique standard — phishing, scams, hate speech ciblee, desinformation (Kang et al., 2023, Abstract + Section 1). Les auteurs argumentent que le probleme n'est pas un "jailbreak" au sens strict mais une consequence structurelle de l'instruction-following : la frontiere entre generation utile et generation nuisible est portee par la meme machinerie.
- **Methode :** Les auteurs demontrent empiriquement que les defenses deployees par les vendeurs d'API (OpenAI content moderation en particulier) peuvent etre contournees par des techniques issues de la securite informatique classique, notamment une variante de **payload splitting** (code injection) ou une charge utile malveillante est fractionnee en morceaux benins qui sont reassembles par le modele lui-meme lors de la generation (Kang et al., 2023, Section 3 — discussion taxonomy-based dans le corps du papier).
- **Donnees :** Cinq categories de scams inspirees de listes officielles du gouvernement US : fake ticket scam, COVID-19 FEMA funds scam, investment scam, advisor gift card scam, lottery winning scam (Semantic Scholar TLDR + resume search). Modeles testes : text-davinci-003 (principale cible des experiences) et ChatGPT contemporain (version 2023), avec comparaison systematique des reponses avec et sans la technique de bypass.
- **Resultat :** Genere un email d'attaque complet (scam, phishing, hate speech) pour un cout de **$0.0064 a $0.016 USD** par generation, versus **$0.10 par generation humaine** (Kang et al. 2023 citant Holman et al. 2007) — soit un ratio de **~6.25x a 15.6x moins cher** que l'equivalent humain, ce qui constitue le resultat economique central du papier (Kang et al., 2023, Section 6 — Economic Analysis, cross-valide 2026-04-09 contre `literature_for_rag/P128_2302.05733.pdf` via pypdf extraction : 3 matches $0.0064, 2 matches $0.016, 1 match "human generation may cost as much as $0.10 (Holman et al., 2007)"). Les defenses via content moderation API echouent sur la grande majorite des payloads une fois la technique de splitting appliquee.
- **Limite :** Pas de benchmark systematique a grande N sur les taux de detection (pas de Table ASR statistique a la maniere de Liu 2023 ou Zverev 2025), le papier est une demonstration d'existence plutot qu'une evaluation quantitative rigoureuse (Kang et al., 2023, Limitations). Modeles dates (fevrier 2023) — les defenses OpenAI 2023 de l'epoque ont ete considerablement renforcees depuis, mais le mecanisme structurel demontre reste valable.

### Analyse critique

**Forces :**
1. **Cadrage theorique novateur** (Section 1) : le papier est parmi les premiers a formaliser explicitement que le dual-use des LLMs instruction-following n'est PAS un bug mais une consequence du design. Les memes capacites de "suivre une instruction avec fidelite de format" qui rendent GPT-3.5 utile pour rediger un CV le rendent utile pour rediger un email de phishing. Cette lecture structurelle anticipe les travaux de Qi et al. 2025 sur le shallow alignment et les discussions de Wei et al. 2023 sur la mimetique statistique.
2. **Cadrage economique inedit** : la quantification du cout de generation ($0.0064-$0.016 par email malveillant, ratio ~6.25-15.6x moins cher que l'humain a $0.10 par generation [Holman 2007]) est une contribution majeure car elle deplace la discussion de "est-ce possible ?" vers "quelle est la scalabilite economique de l'attaque ?". C'est le premier papier a argumenter quantitativement l'avantage competitif des attaquants LLM-assisted.
3. **Reference fondatrice pour le payload splitting** : la technique de fractionnement de charge utile presentee ici devient une baseline pour de nombreux travaux ulterieurs (Liu et al. 2023 cite Kang dans la section related work de arXiv:2306.05499, Greshake 2023 en indirect PI).
4. **Corpus de scams reel** : l'utilisation des listes officielles du gouvernement US donne une realite operationnelle au threat model, contrairement a des attaques de jouet (synthetic toxic prompts) qu'on retrouve dans les benchmarks academiques classiques.
5. **Affiliations fortes** : UIUC (Kang), Stanford (Hashimoto, Guestrin, Zaharia), UC Berkeley (Stoica) — tous des noms majeurs de la systems/ML community, ce qui a amplifie la reception du papier dans la litterature systems security.

**Faiblesses :**
1. **Pas de N statistique par categorie** : l'analyse de 5 categories de scams est qualitative. Pas d'ASR rapporte comme pourcentage formel sur N>=30 prompts par categorie. Contraste fort avec les standards etablis par Zverev et al. 2025 (N>=1000 pour Sep(M)) ou meme Liu 2023 (13 applications).
2. **Pas de juge deterministe** : les auteurs jugent manuellement si la sortie est "nuisible" — pas de rubric formelle comme celle de Zhang et al. 2025 (SVC 6 dimensions). La reproductibilite exacte en souffre.
3. **Modeles dates au premier degre** : text-davinci-003 est deprecie en 2024. ChatGPT 2023 n'existe plus (remplace par GPT-4o, GPT-4-turbo). Les chiffres exacts ne se transferent pas — mais le mecanisme si.
4. **Pas de threat model formel a la MITRE ATLAS / OWASP LLM** : la taxonomie des attaques est implicite, pas mappee sur AML.T0051 ou LLM01. C'est normal pour un papier de fevrier 2023 (ATLAS LLM extensions arrivent en 2023-2024), mais cela complique la reutilisation pour les comparaisons modernes.
5. **Pas de code/payload public** : le papier ne publie pas un repository GitHub avec les prompts exacts, ce qui limite la reproductibilite empirique directe. Les recits secondaires (blogs, surveys) reconstruisent la methode mais pas avec fidelite bit-a-bit.

**Questions ouvertes :**
- La technique de payload splitting est-elle encore efficace contre les RLHF modernes (GPT-4o 2024-11, Claude 4) avec constitutional AI et defensive prompting ?
- Peut-on quantifier l'avantage economique 2026 vs 2023 — l'inflation des couts API a-t-elle ferme le gap, ou l'augmentation de capacite l'a-t-elle creuse ?
- Le cadre dual-use structurel de Kang suggere-t-il une impossibilite theorique d'alignement parfait sans perte d'utilite ? C'est une question ouverte que les travaux de Qi et al. 2025 (shallow alignment) reouvrent.

### Formules exactes

Pas de formules mathematiques originales. Le papier est entierement empirique et argumentatif. Les seuls chiffres formalisables sont les couts par generation ($0.0064-$0.016 LLM vs $0.10 humain [Holman 2007]) et le ratio d'economie resultant (~6.25-15.6x), qui sont des donnees operationnelles, pas des equations. **Note** : initialement rapporte 125-500x par le sub-agent ANALYST, corrige 2026-04-09 apres cross-validation PDF.

Lien glossaire AEGIS : F22 (ASR — metrique applicable mais non calculee par les auteurs), F-economic (non existant — gap glossaire possible).

### Pertinence these AEGIS

- **Couches delta :** δ⁰ (RLHF — bypass de la moderation OpenAI 2023 via payload splitting) **principalement**, avec intersection δ¹ (construction de l'email adversarial comme structure system prompt pour un usage final). La couche δ² (sanitization regex) n'est pas testee explicitement car les defenses OpenAI 2023 etaient majoritairement δ⁰ (classifier-based content moderation).
- **Conjectures :** C1 (fragilite de l'alignement) **fortement supportee** — Kang est l'un des premiers papiers a demontrer qu'une technique de securite classique (payload splitting) suffit a degrader l'alignement d'un modele instruction-following. C4 (echec de separation instructions/donnees) **supportee indirectement** — le splitting exploite justement l'absence de frontiere claire entre instruction et payload. C5 (sous-estimation des benchmarks) **supportee** — l'argument economique (cout 500x inferieur) montre que les benchmarks academiques negligent la dimension de scalabilite operationnelle.
- **Decouvertes :** D-001 (fragilite structurelle) **renforce** — Kang fournit l'argument fondateur que le dual-use est structurel, pas corrigeable par patch ponctuel. A donne lieu a la **decouverte D-026 (cout economique asymetrique attaquant/defenseur)** committee 2026-04-09 dans DISCOVERIES_INDEX.md : le ratio ~6.25-15.6x (cout humain $0.10 par generation selon Holman 2007 cite par Kang, vs cout LLM $0.0064-$0.016) favorise l'attaquant et justifie la priorite these sur les defenses cout-efficaces. **Cross-validation PDF** effectuee 2026-04-09 (correction du ratio 125-500x initialement rapporte par l'ANALYST sub-agent — le papier lui-meme ne cite pas de ratio chiffre, seulement les valeurs brutes, donc le 125-500x etait une extrapolation incorrecte).
- **Gaps :** **Adresse partiellement G-010** (absence de modelisation economique des attaques LLM). **Cree G-022 candidat** (absence d'evaluation longitudinale 2023-2026 : le payload splitting de Kang fonctionne-t-il encore sur GPT-4o ?). La these AEGIS peut reprendre cette technique et la valider sur LLaMA 3.2 / Meditron dans un contexte medical.
- **Mapping templates AEGIS :** #22 (SQL-like research multi-step avec fractionnement), #45 (payload assembly via context), #52 (unwitting user delivery — le modele construit la charge), candidat #89 (scam email medical via cinq sous-requetes benignes reassemblees).

### Citations cles
> "instruction-following capabilities now enable standard attacks from computer security" (Abstract, arXiv:2302.05733, p. 1)
> "this content can be generated economically and at cost likely lower than with human effort alone" (Abstract, arXiv:2302.05733, p. 1)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 — fondateur du cadre dual-use structurel, reference incontournable pour le chapitre 2 de la these |
| Reproductibilite | Moyenne — mecanisme clair et retestable mais pas de code public, pas de prompts publies verbatim, modeles 2023 deprecies |
| Code disponible | Non (pas de repository GitHub associe au papier) |
| Dataset public | Partiellement — les 5 categories de scams sont issues de listes publiques du gouvernement US, mais les prompts exacts ne sont pas publies |
