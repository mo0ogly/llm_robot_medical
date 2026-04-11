# P057: ASIDE: Architectural Separation of Instructions and Data in Language Models
**Auteurs**: Egor Zverev (ISTA), Evgenii Kortukov, Alexander Panfilov (ELLIS Tubingen/MPI), Alexandra Volkova (ISTA), Soroush Tabesh (ISTA), Sebastian Lapuschkin (Fraunhofer HHI), Wojciech Samek (Fraunhofer HHI/TU Berlin/BIFOLD), Christoph H. Lampert (ISTA)
**Venue**: ICLR 2026 (conference paper publiee)
> **PDF Source**: [literature_for_rag/P057_ASIDE_ICLR2026.pdf](../../assets/pdfs/P057_ASIDE_ICLR2026.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (81 chunks, ~75 000 caracteres)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Zverev et al. proposent ASIDE (Architecturally Separated Instruction-Data Embeddings), une modification architecturale minimale qui separe les instructions et les donnees au niveau des embeddings de tokens par une rotation orthogonale fixe. C'est le **suite directe** du travail fondateur des memes auteurs sur le score de separation Sep(M) (Zverev et al., 2025, ICLR 2025, reference dans la these AEGIS). La contribution centrale est triple : (1) une separation instruction-donnee substantiellement amelioree sans perte d'utilite, (2) une robustesse accrue contre l'injection de prompt directe et indirecte **sans entrainement de securite explicite**, et (3) une analyse mecanistique montrant que la separabilite lineaire des representations est atteinte des la premiere couche du transformer.

L'innovation conceptuelle est limpide : dans un modele standard, le meme token "2+2" est represente par le meme vecteur d'embedding qu'il apparaisse dans une instruction ou dans des donnees. Le modele doit inferer le role fonctionnel a partir du contexte, ce qui est intrinsequement fragile. ASIDE applique une rotation orthogonale R (matrice isoclinique, rotation pi/2 par blocs de dimension 2) aux embeddings des tokens de donnees, creant ainsi deux representations distinctes du meme token selon son role. Cette approche n'ajoute **zero parametre supplementaire** et s'integre post-hoc dans tout LLM pre-entraine.

### Methodologie

L'evaluation couvre six familles de modeles : Qwen 3 8B, Qwen 2.5 7B, Llama 3.1 8B, Llama 2 7B, Llama 2 13B, et Mistral 7B v0.3. Trois architectures sont comparees : Vanilla (embeddings standard + delimiteurs speciaux), ISE (offset lineaire appris, Wu et al. 2024), et ASIDE (rotation orthogonale). Tous les modeles partent de poids pre-entraines (pas de safety-tuning) et sont fine-tunes sur Alpaca-clean-gpt4-turbo (51.8k exemples) avec les memes hyperparametres. L'evaluation porte sur trois axes : score de separation Sep(M) (dataset SEP, 9160 paires), utilite (SEP Utility + AlpacaEval 1.0 avec GPT-4 comme juge), et robustesse aux injections (4 benchmarks directs : TensorTrust, Gandalf, Purple, RuLES; 2 benchmarks indirects : BIPIA-text, BIPIA-code, StruQ-ID, StruQ-OOD). Trois runs independants par configuration; moyennes et ecarts-types rapportes.

### Resultats cles

- **Separation** : ASIDE augmente le score SEP de 12.3 (Llama 2 7B) a 44.1 (Mistral 7B) points de pourcentage par rapport a Vanilla. ISE n'apporte pas d'amelioration consistante (Zverev et al., 2026, Section 5.3, Table 1).
- **Utilite preservee** : les scores SEP Utility et AlpacaEval d'ASIDE sont comparables a Vanilla (exception mineure : Mistral 7B, ou SEP Utility baisse mais AlpacaEval augmente) (Zverev et al., 2026, Section 5.3, Table 1).
- **Injection indirecte** : ASIDE reduit l'ASR moyen sur BIPIA-text de 14.7% a 4.9%, BIPIA-code de 15.3% a 8.8%, StruQ-ID de 45.6% a 28.1%, StruQ-OOD de 45% a 36% (Zverev et al., 2026, Section 5.1, Table 1).
- **Injection directe** : ASIDE reduit l'ASR moyen sur TensorTrust de 8.6 pp et Gandalf de 9.4 pp. Effet mineur sur Purple (-2.7 pp) et nul sur RuLES (Zverev et al., 2026, Section 5.2, Table 1).
- **Separabilite lineaire** : une sonde lineaire atteint 100% de precision des la couche 0 (embedding) pour ASIDE, vs ~60-70% pour Vanilla qui necessite plusieurs couches pour atteindre 90% (Zverev et al., 2026, Section 6.1, Figure 3).
- **Lien causal** : l'experience d'intervention (remplacement des embeddings data par des embeddings instruction) double l'ASR (14.5% vers 27.8%), confirmant le mecanisme causal (Zverev et al., 2026, Section 6.3, Figure 6).

### Limitations admises par les auteurs

Les auteurs delimitent explicitement le perimetre : (1) seul le setting single-turn ou le role instruction/donnee est connu a l'avance est traite, (2) l'extension aux conversations multi-tour et l'inference dynamique des roles est laissee a des travaux futurs, (3) ASIDE n'a pas ete teste contre des attaques adaptatives ciblant specifiquement la matrice de rotation.

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Lien glossaire AEGIS |
|----|---------|-------------------|----------------------|
| F51 | $$e'_{data}(x_t) = R \cdot e(x_t)$$ | R : matrice orthogonale (R^T R = I, det(R) = 1), rotation isoclinique pi/2 par blocs 2x2 | F51 (Orthogonal Rotation Separation) |
| Sep(M) | $$\text{Sep}(M) = \frac{|\{i : f_{inst}(i) \neq f_{data}(i)\}|}{N}$$ | Score de separation instruction-donnee (Zverev et al. 2025) | F04 (Sep Score) |
| Sep_ASIDE | $$\text{Sep}_{ASIDE}(M) = \text{Sep}(M + ASIDE) - \text{Sep}(M_{base})$$ | Amelioration differentiee de Sep par ASIDE | F51 extension |
| Probe acc. | Precision d'un classificateur lineaire par couche | Separabilite lineaire instruction/donnee | Interpretabilite mecanistique |

**Variables** :
- $e(x_t)$ : embedding standard du token $x_t$ dans $\mathbb{R}^d$
- $R \in \mathbb{R}^{d \times d}$ : matrice de rotation orthogonale isoclinique (blocs 2x2, rotation pi/2)
- $e'_{data}(x_t) = R \cdot e(x_t)$ : embedding conditionnel pour les tokens de donnees
- $e_{inst}(x_t) = e(x_t)$ : embedding standard pour les tokens d'instructions (inchange)
- $f_{inst}(i)$, $f_{data}(i)$ : sorties du modele selon que le probe est place en position instruction ou donnee

**Proprietes mathematiques cles** :
- La rotation est **isometrique** : elle preserve les normes et les distances, donc la semantique du token est maintenue.
- La rotation est **orthogonale au sous-espace d'instructions** : les representations d'instructions et de donnees occupent des sous-espaces lineaires distincts des la premiere couche.
- **Zero parametres supplementaires** : R est fixe, pas appris, donc pas d'overfitting et applicabilite post-hoc universelle.

---

## Section 3 — Critique methodologique

### Forces

1. **Publication ICLR 2026** — venue de premier rang (acceptance rate ~25%), peer-review rigoureux. C'est la contribution la plus credible sur la separation architecturale dans le corpus AEGIS.
2. **Reproductibilite exemplaire** — code, donnees, et instructions de reproduction publies sur GitHub (github.com/egozverev/aside). Les auteurs ont independamment reconstruit et reproduit les resultats.
3. **Design experimental propre** — l'utilisation de modeles pre-entraines sans safety-tuning isole precisement l'effet de la modification architecturale. Les ameliorations observees sont donc attribuables au changement d'architecture seul.
4. **Trois runs independants** — moyennes et ecarts-types rapportes systematiquement (Table 1). La variabilite inter-runs est generalement faible (< 4 pp pour la plupart des configurations).
5. **Analyse mecanistique** — le probing lineaire (Figure 3), l'activation de concept (Figure 4-5), et l'experience d'intervention causale (Figure 6) fournissent trois niveaux de preuve convergents.
6. **Generalisation multi-modeles** — les resultats sont consistants sur 6 architectures (2 generations Llama, 2 versions Qwen, Mistral), renforçant la generalite de l'approche.

### Faiblesses

1. **Single-turn uniquement** — la limitation la plus critique pour AEGIS. Les attaques multi-tour (P036, P050) representent la menace dominante, et ASIDE n'est pas evalue dans ce regime. L'efficacite contre les conversations multi-tour ou le role des tokens peut evoluer dynamiquement reste une question ouverte majeure.
2. **Pas de test contre attaques adaptatives** — si l'attaquant connait R (modeles open-weight), il peut theoriquement pre-transformer ses tokens adversariaux pour contourner la rotation. Le gap G-019 identifie par notre analyse initiale reste ouvert.
3. **Taille des modeles** — seuls des modeles 7B-13B sont evalues. L'effet sur des modeles plus grands (70B+) ou les modeles frontiere (GPT-4, Claude) n'est pas demontre.
4. **Pas de test medical** — aucun modele medical specialise (MedGemma, HuatuoGPT) n'est evalue. Le transfert vers le domaine medical (contexte C6) est hypothetique.
5. **Metriques de robustesse heterogenes** — l'ASR sur RuLES ne s'ameliore pas du tout, et l'amelioration sur Purple est mineure. L'efficacite depend du type d'attaque, suggerant que la separation architecturale n'est pas une panacee.
6. **Cout de re-training** — bien que zero parametres soient ajoutes, le fine-tuning est necessaire pour que le modele apprenne a exploiter les embeddings differencies. Le cout computationnel n'est pas reporte.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C1** (separation instruction-donnee insuffisante) | PARTIELLEMENT CONTREDIT | ASIDE ameliore substantiellement Sep(M) | Pour les systemes futurs, C1 pourrait etre resolu au niveau architectural |
| **C3** (cosine insuffisante) | CONFIRME | La rotation orthogonale est superieure au simple offset lineaire (ISE) | La geometrie de l'espace d'embedding est cruciale |
| C4 (drift semantique mesurable) | RENFORCE | Sep(M) directement ameliore | La metrabilite de la separation est demontree |
| C5 (defense empirique insuffisante) | NUANCE | ASIDE fonctionne sans safety-training | Premiere evidence qu'une defense architecturale peut etre effective sans entrainement adversarial |

### Couches delta

- **delta-0 (RLHF alignment)** : ASIDE renforce delta-0 au niveau architectural. La separation instruction-donnee est un mecanisme de defense de base qui ameliore l'alignement intrinseque du modele. Cependant, cela ne traite que la confusion instruction/donnee, pas l'erosion progressive de l'alignement par persuasion multi-tour (P036).
- **delta-1 (System prompt)** : ASIDE protege implicitement le prompt systeme en distinguant ses tokens (instructions) des tokens de donnees utilisateur. Les injections indirectes (BIPIA : -9.8 pp, StruQ : -17.5 pp) sont significativement reduites.
- **delta-2** : non directement traite, mais la rotation pourrait etre etendue aux tokens RAG.
- **delta-3 (Verification formelle)** : ASIDE est la defense la plus proche d'une garantie formelle dans le corpus. La rotation orthogonale fournit une separation mathematiquement demontrable (100% precision du probe lineaire des la couche 0). C'est un precurseur potentiel de delta-3.

### Defense D-015 et taxonomie AEGIS

ASIDE est directement pertinent pour la technique de defense D-015 (Architectural Separation) dans la taxonomie des 66 techniques AEGIS. Il fournit :
- La premiere implementation concrete d'une separation architecturale instruction-donnee
- La preuve que zero parametres supplementaires suffisent
- Un protocole de mesure (Sep(M)) directement integrable dans le benchmarking AEGIS
- L'evidence que la separation architecturale est **orthogonale** (au sens technique et metaphorique) aux defenses par training ou prompt engineering

### Decouverte D-001 (Triple Convergence)

P057 est le **defi le plus significatif a D-001** dans l'ensemble du corpus AEGIS. Si ASIDE etait deploye a grande echelle, il pourrait briser la triple convergence en fournissant un avantage structurel a la defense. Cependant, D-001 **reste valide pour les systemes actuellement deployes** : aucun modele de production n'utilise ASIDE. De plus, l'absence de tests contre les attaques adaptatives et les scenarios multi-tour maintient l'incertitude. D-001 est donc **renforce pour le present** mais **potentiellement resolu pour l'avenir** par des approches de type ASIDE.

### Mapping templates AEGIS

- Technique T45 (ASIDE Adversarial Probing) : attaque prospective contre ASIDE via extraction de R et pre-rotation adversariale
- Templates d'injection indirecte (#01-#15) : ASIDE reduit leur efficacite de 10-18 pp
- Les templates multi-tour (#35-#40) ne sont PAS adresses par ASIDE

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P057 |
| **Type** | Defense (architecturale, embedding-level) |
| **Domaine** | Securite LLM, separation instruction-donnee, injection de prompt |
| **Modeles testes** | 6 familles : Qwen 3 8B, Qwen 2.5 7B, Llama 3.1 8B, Llama 2 7B, Llama 2 13B, Mistral 7B v0.3 |
| **Metrique principale** | Sep(M) ameliore de +12.3 a +44.1 pp; ASR BIPIA-text 14.7% vers 4.9%; probe lineaire 100% des couche 0 |
| **delta-layers** | delta-0 (renforce), delta-1 (renforce), delta-3 (precurseur) |
| **Conjectures** | C1 (partiellement contredit), C3 (confirme), C4 (renforce), C5 (nuance) |
| **Reproductibilite** | Excellente — code public, 3 runs, protocole detaille |
| **Defense taxonomy** | D-015 (Architectural Separation) — premier papier a implementer concretement |
| **Tags** | [ARTICLE VERIFIE], ASIDE, rotation orthogonale, Sep(M), separation architecturale, zero parametres, ICLR 2026 |
