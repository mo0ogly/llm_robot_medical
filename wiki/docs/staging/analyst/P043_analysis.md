## [Zhang et al., 2025] — Jailbreak Distillation: Renewable Safety Benchmarking

**Reference :** arXiv:2505.22037v1
**Revue/Conf :** [PREPRINT] — Johns Hopkins University / Microsoft Responsible AI Research
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P043_2505.22037.pdf](../../assets/pdfs/P043_2505.22037.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (106 chunks)

### Abstract original
> Large language models (LLMs) are rapidly deployed in critical applications, raising urgent needs for robust safety benchmarking. We propose Jailbreak Distillation (JBDistill), a novel benchmark construction framework that "distills" jailbreak attacks into high-quality and easily-updatable safety benchmarks. JBDistill utilizes a small set of development models and existing jailbreak attack algorithms to create a candidate prompt pool, then employs prompt selection algorithms to identify an effective subset of prompts as safety benchmarks. JBDistill addresses challenges in existing safety evaluation: the use of consistent evaluation prompts across models ensures fair comparisons and reproducibility. It requires minimal human effort to rerun the JBDistill pipeline and produce updated benchmarks, alleviating concerns on saturation and contamination. Extensive experiments demonstrate our benchmarks generalize robustly to 13 diverse evaluation models held out from benchmark construction, including proprietary, specialized, and newer-generation LLMs, significantly outperforming existing safety benchmarks in effectiveness while maintaining high separability and diversity.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les benchmarks de securite LLM statiques souffrent de saturation et de contamination ; les evaluations dynamiques (red-teaming LLM) manquent de comparabilite et reproductibilite entre modeles.
- **Methode :** JBDistill combine des attaques de jailbreak off-the-shelf (AutoDAN-Turbo, TAP, Adv Reasoning) appliquees sur un ensemble reduit de modeles de developpement pour creer un pool de prompts candidats, puis selectionne un sous-ensemble optimal via l'algorithme RBS (Round-Based Selection) maximisant l'effectivite sur les modeles de dev (Section 3, Figure 1, p. 1-3).
- **Donnees :** Graines : HarmBench (200 goals) ; modeles de dev : 3-4 LLMs ; evaluation sur 13 modeles held-out (proprietaires + open-source + specialises) ; taille benchmark n=500 prompts (Section 5.1, p. 6).
- **Resultat :** JBDistill single-turn atteint 81.8% d'effectivite vs 53.1% pour random selection (RS) et << 40% pour les benchmarks statiques existants (Table 1, p. 7). Generalisation robuste aux 13 modeles held-out (Section 5.2, p. 7).
- **Limite :** Dependance aux attaques existantes (le pool est borne par la diversite des algorithmes d'attaque utilises) ; pas de garantie formelle de couverture des vulnerabilites ; cout computationnel de la construction (Section 6, p. 8-9).

### Analyse critique
**Forces :**
- Paradigme innovant : "best-of-both-worlds" combinant la reproductibilite des benchmarks statiques avec la puissance des attaques dynamiques (Section 1, p. 1-2).
- Generalisation validee empiriquement sur 13 modeles held-out incluant des modeles proprietaires (GPT-4o, Claude 3.5), des modeles specialises (WildGuard), et des modeles nouvelle generation (Table 1, p. 7).
- Algorithme RBS significativement superieur a la selection aleatoire : 81.8% vs 53.1% effectivite (Table 1, p. 7).
- Facilement renouvelable : il suffit de re-executer le pipeline avec de nouveaux modeles de dev ou de nouvelles attaques pour produire un benchmark actualise.
- Metriques de qualite de benchmark bien definies : effectivite, separabilite, diversite (Section 2, p. 2-3).

**Faiblesses :**
- Le pool de candidats est borne par les attaques existantes : si aucune attaque connue ne cible une vulnerabilite specifique, elle ne sera pas representee dans le benchmark.
- Pas de formalisation mathematique de la generalisation dev -> held-out ; la preuve est purement empirique.
- Le cout de construction (execution de multiples attaques sur plusieurs modeles) n'est pas quantifie en tokens ou en heures GPU.
- Dependance a un juge de securite (non specifie en detail) pour determiner le succes des attaques ; les biais du juge affectent le benchmark final.
- Pas d'evaluation de la robustesse du benchmark a la contamination (un modele entraine sur les prompts JBDistill pourrait artificiellement paraitre plus sur).

**Questions ouvertes :**
- Comment evolue la qualite du benchmark quand les attaques sous-jacentes deviennent obsoletes (patchees) ?
- Quelle est la taille minimale de l'ensemble de dev necessaire pour une bonne generalisation ?
- Le framework pourrait-il integrer des attaques non-textuelles (multimodales, cross-linguales) ?

### Formules exactes
| Formule | Source |
|---------|--------|
| Effectivite = (1/\|M_eval\|) sum_{m in M_eval} ASR(B, m) | Section 2, p. 2 (metrique de qualite de benchmark) |
| Separabilite = variance des ASR entre modeles evalues | Section 2, p. 2-3 |
| RBS : selection gloutonne round-based maximisant l'effectivite cumulee sur M_dev | Section 3, p. 3-4 |

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) — concept voisin de la separabilite)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (evaluation de l'alignement RLHF via benchmark), δ¹ (les attaques distillees ciblent le system prompt et les instructions)
- **Conjectures :** C1 (supportee — le benchmark demontre que meme les modeles alignes restent vulnerables, justifiant l'insuffisance de δ¹), C7 (supportee — la saturation des benchmarks statiques est une forme d'obsolescence de l'evaluation)
- **Decouvertes :** D-014 (reproductibilite des evaluations de securite), D-016 (generalisation cross-modele des benchmarks)
- **Gaps :** G-004 (besoin de benchmarks renouvelables, directement adresse par JBDistill), G-012 (pas de composante medicale dans les graines HarmBench)
- **Mapping templates AEGIS :** #01-#97 (les templates AEGIS pourraient etre integres comme attaques supplementaires dans le pool JBDistill)

### Citations cles
> "JBDistill significantly outperforms static benchmarks and dynamic attacks in terms of effectiveness and versatility, achieving 81.8% and 78.1% best effectiveness respectively" (Section 5.2, p. 7)
> "Prompt selection algorithms are crucial for producing effective benchmarks" (Section 5.2, Table 1, p. 7)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Haute — pipeline re-executable, metriques formalisees ; page projet : https://aka.ms/jailbreak-distillation |
| Code disponible | Oui (page projet Microsoft) |
| Dataset public | Oui (HarmBench seeds, public) |
