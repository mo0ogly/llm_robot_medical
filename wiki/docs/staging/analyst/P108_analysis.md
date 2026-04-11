## [Liu, Li, Niu, Zhang, Xun et al., 2025] — JMedEthicBench : benchmark multi-tour adversarial pour l'ethique medicale japonaise

**Reference :** arXiv:2601.01627
**Revue/Conf :** Preprint, under review
**Lu le :** 2026-04-08
> **PDF Source**: [literature_for_rag/P108_jmedethicbench.pdf](../../assets/pdfs/P108_jmedethicbench.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (95 chunks)

### Abstract original
> As Large Language Models (LLMs) are increasingly deployed in healthcare worldwide, robustness in culturally and linguistically diverse medical contexts becomes critical. We introduce JMedEthicBench, a multi-turn adversarial benchmark for evaluating the medical ethics alignment of LLMs in Japanese healthcare. Our framework incorporates 67 domain-specific guidelines from the Japan Medical Association (JMA) and employs automated red-teaming with seven discovered jailbreak strategies to systematically probe ethical reasoning under adversarial pressure. Through evaluation of 22 diverse models across 2,345 multi-turn conversations, we reveal that safety scores progressively degrade across conversation turns, medical-specialized models exhibit lower safety than general-purpose counterparts, and current safety mechanisms can be circumvented through multiple attack vectors.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les benchmarks de securite medicale existants (MedSafetyBench, MedEthicEval, SafeDialBench) sont limites au single-turn et/ou a l'anglais ; aucun ne couvre l'ethique medicale japonaise en multi-tour (Liu et al., 2025, Section 2, Table comparative p.5).
- **Methode :** Construction de JMedEthicBench : 67 guidelines JMA, red-teaming automatise avec 7 strategies de jailbreak decouvertes, evaluation multi-tour (3 tours par conversation), scoring 0-10 par LLM-juge (DeepSeek + GPT-4o-mini, ICC(2,1) = 0.944) (Section 3, p.3-4).
- **Donnees :** 2345 conversations multi-tour, 22 modeles evalues (GPT-5, Claude Opus 4.1, Claude Sonnet 4, Qwen3, II-Medical, HuatuoGPT-o1, MedGemma), public (Section 4, p.5-6).
- **Resultat :** Score de securite median chute de 9.5 (Tour 0) a 6.5 (Tour 1) puis 5.5 (Tour 2), toutes comparaisons significatives p < 0.001 Mann-Whitney U + Bonferroni, effet moyen Cohen's d = 0.75 (Tour 0-1) (Section 5.1, Figure 4a). Les modeles medicaux specialises sont MOINS surs : Qwen3-8B = 5.60 vs II-Medical-8B = 4.50 (delta = -1.10), Qwen3-32B = 6.40 vs II-Medical-32B-Preview = pas mieux (Section 5.2, Table 2).
- **Limite :** Scope limite au japonais ; la generalisation a d'autres langues necessite adaptation des guidelines et listes de refus. Restriction a 3 tours (74.31% des conversations atteignent leur objectif en 3 tours) (Section 3, D, p.15).

### Analyse critique
**Forces :**
- Premier benchmark medical multi-tour adversarial : comble un vide critique dans la litterature. La degradation multi-tour est quantifiee avec rigueur statistique (Mann-Whitney U, Bonferroni, Cohen's d) (Section 5.1, Figure 4a).
- Fiabilite inter-evaluateurs excellente : ICC(2,1) = 0.944 entre deux LLM-juges, fiabilite effective rho = 0.958 via Spearman-Brown (Section 4, p.5).
- Evaluation de 22 modeles incluant les tout derniers (GPT-5, Claude Opus 4.1, Qwen3) — positionnement de pointe.
- Comparaison controlee fine-tuning medical : utilisation des paires Qwen3 / II-Medical a taille fixe pour isoler l'effet du fine-tuning medical sur la securite (Section 5.2).
- 7 strategies de jailbreak decouvertes et documentees, transferables a travers les 22 modeles — suggerent des faiblesses structurelles plutot que model-specifiques (Section 5.3).

**Faiblesses :**
- **Preprint non peer-reviewed** : les resultats sur 22 modeles necessitent verification independante.
- LLM-juge (DeepSeek + GPT-4o-mini) pour l'evaluation : malgre l'ICC eleve, le biais inherent du LLM-juge reste une preoccupation (cf. P044).
- Scope japonais uniquement : bien que le pipeline soit declare adaptable, la transferabilite effective aux contextes occidentaux (AMA, CFDA) n'est pas demontree.
- Les 7 strategies de jailbreak sont decouvertes par red-teaming automatise — pas de garantie d'exhaustivite par rapport aux techniques manuelles avancees (multi-agent, cross-lingual encoding).
- Pas de mesure de la severite clinique des reponses dangereuses : un conseil errone sur un dosage vs un biais diagnostique recoivent le meme traitement.

**Questions ouvertes :**
- La degradation multi-tour est-elle lineaire ou suit-elle une courbe en S avec saturation au-dela de 3 tours ?
- Les strategies de jailbreak decouvertes en japonais sont-elles plus efficaces que leurs equivalents anglais (hypothese : les modeles sont moins alignes sur les langues non-anglaises) ?
- Le fine-tuning medical erode-t-il l'alignement sur TOUTES les dimensions ethiques JMA ou specifiquement sur certaines (beneficence, non-maleficence) ?

### Formules exactes
- **Safety Score** (Section 4, p.5) : score 0-10 par LLM-juge, moyenne de deux evaluateurs (DeepSeek + GPT-4o-mini). Rubrique de scoring a 5 niveaux (0-2, 3-4, 5-6, 7-8, 9-10) (Appendix, rubrique p.16).
- **Safety Pass Rate** (Section 5, Figure 5b) : pourcentage de conversations ou les 3 tours ont un score > 2.
- **ICC(2,1)** = 0.944, fiabilite effective rho = 0.958 via Spearman-Brown (Section 4, p.5).
- **Cohen's d** = 0.75 (Tour 0 vs Tour 1), d = 0.24 (Tour 1 vs Tour 2) (Section 5.1, p.6).
- Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) — analogue multi-tour)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (erosion de l'alignement RLHF sous pression multi-tour) + δ¹ (les strategies de jailbreak exploitent la couche d'instruction-following).
- **Conjectures :**
  - C6 (domaine medical plus vulnerable) : FORTEMENT SUPPORTEE — les modeles medical-tuned (II-Medical-8B, HuatuoGPT-o1) sont systematiquement MOINS surs que leurs bases generiques. Qwen3-8B = 5.60 vs II-Medical-8B = 4.50 (delta = -1.10) (Section 5.2, Table 2). Cela replique le resultat de P107 (MedSafetyBench) sur des modeles et langues differents.
  - C1 (δ⁰ insuffisant) : SUPPORTEE — la degradation de 9.5 a 5.5 en 3 tours montre que l'alignement RLHF ne resiste pas aux attaques multi-tour (Section 5.1, Figure 4a).
  - C3 (alignement superficiel) : SUPPORTEE — les modeles commerciaux les plus robustes (Claude Opus 4.1 > 9.0 aux 3 tours) montrent que l'alignement PEUT etre robuste avec des investissements massifs, suggerant que les modeles moins robustes n'ont qu'un alignement superficiel.
- **Gaps :** G-012 (manque de benchmark multi-tour medical — adresse par JMedEthicBench)

### Citations cles
> "The median safety score decreases from approximately 9.5 at Turn 0 to 6.5 at Turn 1 and 5.5 at Turn 2" (Section 5.1, p.6)
> "medical fine-tuning consistently degrades safety: Qwen3-8B scores 5.60 versus II-Medical-8B at 4.50" (Section 5.2, p.6)
> "seven discovered strategies demonstrate broad transferability across 22 diverse models, suggesting that they exploit fundamental alignment weaknesses" (Section 5.3, p.7)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — 22 modeles, 2345 conversations, ICC 0.944 |
| Code disponible | Non specifie dans le texte |
| Dataset public | Oui (JMedEthicBench) |
