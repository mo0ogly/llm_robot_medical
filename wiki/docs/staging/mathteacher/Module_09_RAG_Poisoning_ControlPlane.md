# Module 9 — RAG Poisoning et Control-Plane Decoding

**Temps estime** : 9-11 heures
**Prerequis** : Module 1 (produit scalaire, norme, cosinus), Module 3 (softmax, temperature, cross-entropy), Module 6 (embeddings, perte contrastive)
**Formules couvertes** : **F75** retrieval dense top-N, **F76** Hit-Ratio Maximization (CorruptRAG), **F77** perte contrastive d'imitation de retriever (FlippedRAG), **F78** perte du trigger adversarial (opinion shift), **F79** metriques opinion-shift (Top3v/RASR/BRank/OMSR/ASV), **F80** masque de logits per-token (control-plane / CDA)
**Batch source** : FORGE-RAG-CP-20260612
**Sources verbatim** : MATHEUX — `_staging/matheux/FORMULAS_RAG_POISONING_20260612.md` + `GLOSSAIRE_F75-F80_RAG_CONTROLPLANE.md`

> **Encart — Niveau de preuve (lire en premier)**
> Chaque formule de ce module porte un **tag epistemique** repris tel quel du livrable MATHEUX. La signification :
>
> | Tag | Sens | Ce que ca AUTORISE a dire |
> |-----|------|---------------------------|
> | **[ALGORITHME]** | Definition operationnelle / methode, eventuellement avec garanties de conformite | "Voici comment le calcul est fait" — PAS "c'est optimal" |
> | **[EMPIRIQUE]** | Resultat observe / objectif formalise, mais sans borne theorique | "On observe X sur tel jeu de donnees" — PAS "X est garanti" |
> | **[HEURISTIQUE]** | Procede sans garantie de convergence ni borne, meme s'il marche bien | "Ca fonctionne en pratique" — JAMAIS "c'est prouve" |
>
> **ZERO confabulation** : ce module n'enseigne QUE des formules extraites verbatim du fulltext PDF par MATHEUX. Les valeurs/protocoles que MATHEUX a marques comme **dettes [A VERIFIER]** sont signales ici comme **"non encore verifie"** — ne les apprenez pas comme des faits acquis.

---

## Motivation : le RAG cree une nouvelle surface d'attaque mathematique

Un LLM classique recoit une question et repond a partir de ses poids figes. Un systeme **RAG** (Retrieval-Augmented Generation) ajoute une etape AVANT la generation : il va chercher des documents pertinents dans une base externe et les colle dans le contexte. C'est ce qui rend le RAG puissant (reponses a jour, sourcees) — mais c'est aussi une **nouvelle surface d'attaque**.

Le point crucial pour ce module : le retrieval est une **fonction de score mathematique**. Le systeme classe les documents par un score de similarite et garde les meilleurs. Un attaquant qui comprend cette fonction de score peut fabriquer un document concu pour **gagner le classement** — et donc entrer dans le contexte du modele.

Trois angles d'attaque, trois jeux de formules :

1. **CorruptRAG** (F75, F76) — empoisonner avec **UN seul** document. Pas besoin de submerger la base : il suffit de battre le score du k-ieme meilleur document.
2. **FlippedRAG** (F77, F78, F79) — manipuler le **classement** lui-meme pour faire basculer l'**opinion** de la reponse, en imitant d'abord le retriever cible (black-box).
3. **CDA / Control-Plane** (F80) — sortir completement du canal "donnees" et agir sur le **decodage** : un masque de logits force le modele a commencer par "Sure, here is...", rendant le refus structurellement impossible.

**Pourquoi c'est doctoral** : ces trois vecteurs attaquent des points que la metrique Sep(M) (separation instruction/donnees, Module 4) **ne couvre pas**. C'est le coeur du lien AEGIS de fin de module.

---

## Prerequis : ce qu'il faut savoir avant

- **Produit scalaire et cosinus** (Module 1) : `⟨u,v⟩ = Σ u_i v_i` ; `cos(u,v) = ⟨u,v⟩ / (||u|| ||v||)`.
- **Embeddings** (Module 6) : une fonction `E(·)` qui envoie un texte vers un vecteur dense.
- **Softmax avec temperature** (Module 3) : `softmax(z)_i = exp(z_i/T) / Σ_j exp(z_j/T)`.
- **Perte contrastive** (Module 6, Partie D) : on l'etend ici au cas du retrieval.

---

## Brique 1 — Similarite cosinus et retrieval top-N (F75)

### Theorie formelle

**F75 — Retrieval dense top-N** [ALGORITHME] (Zhang et al., 2026, P139, Section 2, p.2)

Pour une requete `q` et une base `D = {d_1, ..., d_Π}` (avec `Π = |D|`), un encodeur unique `E(·)` produit `E(q)` et chaque `E(d_k)`. On calcule un score de similarite, puis on garde les N meilleurs :

$$\text{sim}(q, d_k) = \langle E(q), E(d_k) \rangle \qquad \text{(produit scalaire, defaut P139)}$$

$$D(q, N) = \operatorname*{argTop\text{-}N}_{d_k \in D} \ \text{sim}(q, d_k)$$

Le papier teste aussi le **cosinus** comme variante (P139, Section 5.1.3 + Table 6, p.7-8), et montre que le choix dot-product vs cosinus change peu le resultat.

> **Encart — Niveau de preuve** : F75 est **[ALGORITHME]** — c'est une *definition* du retrieval dense (standard, cf. Karpukhin et al. 2020, DPR). Il n'y a **aucune borne theorique** sur la qualite du retrieval (MATHEUX, regime de validite F75). On decrit un mecanisme, on ne prouve pas qu'il est optimal.

### Rappel : produit scalaire et normalisation

Le produit scalaire `⟨u,v⟩ = Σ_i u_i v_i` mesure a la fois **l'alignement** des directions ET les **longueurs** des vecteurs. Le cosinus l'isole de la longueur :

$$\cos(u,v) = \frac{\langle u,v\rangle}{\|u\|\,\|v\|}, \qquad \|u\| = \sqrt{\sum_i u_i^2}.$$

Si les embeddings sont **normalises** (`||u|| = ||v|| = 1`), alors produit scalaire = cosinus. C'est pourquoi P139 peut passer de l'un a l'autre avec peu d'effet.

### Intuition geometrique

Imaginez chaque document comme une fleche partant de l'origine dans un espace a 768 dimensions. La requete est aussi une fleche. Le retrieval garde les N fleches qui pointent le **plus dans la meme direction** que la requete. Le cosinus = le cosinus de l'angle entre les fleches : `cos = 1` (angle 0, meme direction), `cos = 0` (angle 90 degres, sans rapport), `cos = -1` (sens oppose).

### Exemple numerique a la main

Base de 4 documents (embeddings simplifies a 3 dimensions, normalises) et une requete `q = [0.6, 0.8, 0.0]` (norme = 1).

| Doc | Embedding | `⟨q, d⟩` | cos (deja normalise) |
|-----|-----------|----------|----------------------|
| d_1 | [0.7, 0.7, 0.1] (norme ~1.0) | 0.6·0.7 + 0.8·0.7 + 0 = **0.98** | ~0.97 |
| d_2 | [0.0, 0.0, 1.0] | 0.6·0 + 0.8·0 + 0 = **0.00** | 0.00 |
| d_3 | [0.9, 0.4, 0.1] (norme ~0.99) | 0.6·0.9 + 0.8·0.4 + 0 = **0.86** | ~0.87 |
| d_4 | [0.5, 0.5, 0.7] (norme ~1.0) | 0.6·0.5 + 0.8·0.5 + 0 = **0.70** | 0.70 |

Classement decroissant : **d_1 (0.98) > d_3 (0.86) > d_4 (0.70) > d_2 (0.00)**.

Avec `N = 2`, le retrieval renvoie `D(q,2) = {d_1, d_3}`. Le **2e score** ici vaut **0.86** : c'est le seuil a battre pour qu'un document injecte entre dans le top-2. Retenez ce nombre — c'est exactement la cible de la Brique 2.

---

## Brique 2 — Pourquoi UN seul document suffit (F76, CorruptRAG)

### Theorie formelle

**F76 — Hit-Ratio Maximization (HRM)** [EMPIRIQUE] (objectif) / [HEURISTIQUE] (resolution) (Zhang et al., 2026, P139, Section 4.1, **Eq. (1)**, p.4)

$$\max_{P}\ \frac{1}{|Q|}\sum_{i=1}^{|Q|} \mathbb{1}\!\left(\text{RAG}\big(\hat{D}(q_i, N), q_i\big) = A_i\right) \quad\text{s.c.}\quad \hat{D}=D\cup P,\ \ |P_i|=1.$$

- `Q = {q_i}` : requetes ciblees ; `A_i` : reponse voulue par l'attaquant pour `q_i`.
- `P = {P_i}` : documents empoisonnes ; `D̂ = D ∪ P` : base compromise.
- **`|P_i| = 1`** : la contrainte clef — **un seul** document injecte par requete.
- `D̂(q_i, N)` : top-N recupere depuis la base empoisonnee (= F75 applique a `D̂`).
- `𝟙(·)` : indicatrice (1 si la reponse RAG egale `A_i`, sinon 0).

Le **Hit-Ratio** est donc simplement la **fraction de requetes** pour lesquelles l'attaque reussit.

> **Encart — Niveau de preuve** : le *cadre* HRM est **[EMPIRIQUE]** (objectif d'optimisation bien defini), mais comme le pipeline RAG est **non-differentiable** ("discrete and non-linear nature of language", P139, p.2), on ne peut PAS l'optimiser par gradient. La resolution effective (CorruptRAG-AS / CorruptRAG-AK) est **[HEURISTIQUE]** : pas de borne, pas de garantie de convergence (MATHEUX, F76).

### La condition d'entree dans le top-k

Pourquoi un seul document suffit ? Parce que le succes ne demande PAS un vote majoritaire. C'est la difference explicite avec **PoisonedRAG**, qui supposait pouvoir injecter assez de textes pour **dominer numeriquement** le top-N (P139, Section 4.1, p.4). CorruptRAG leve cette hypothese.

Le succes se decompose en **deux conditions conjointes** (P139, Section 4, "two challenges", p.2) :

1. **Condition de retrieval** : `p_i ∈ D̂(q_i, N)`. Le document empoisonne doit entrer dans le top-N. D'apres F75, cela signifie que `sim(q_i, p_i)` doit **depasser le N-ieme meilleur score** de la base. L'attaquant l'obtient en construisant `p_i` **autour de la requete** `q_i` (copier les mots de la requete maximise la similarite).
2. **Condition de generation** : une fois dans le contexte, `p_i` doit faire produire `A_i` par le LLM (c'est le contenu adversarial du document).

> Intuition "il suffit de battre le k-ieme" : le retrieval est un tournoi. Vous n'avez pas besoin d'eliminer tous les concurrents — il suffit d'**arriver dans les N premiers**, c'est-a-dire de battre le score du **N-ieme** document legitime. Tout le reste du classement vous est indifferent.

### Exemple chiffre

Reprenons la base de la Brique 1 avec `N = 2`. Le 2e score legitime valait **0.86** (c'est d_3).

L'attaquant fabrique un document empoisonne `p` en recopiant les mots de la requete, ce qui lui donne par exemple `E(p) = [0.61, 0.79, 0.05]` (tres aligne sur `q = [0.6, 0.8, 0.0]`). Score :

$$\langle q, p\rangle = 0.6\cdot 0.61 + 0.8\cdot 0.79 + 0.0\cdot 0.05 = 0.366 + 0.632 + 0 = \mathbf{0.998}.$$

Nouveau classement dans `D̂` : **p (0.998) > d_1 (0.98) > d_3 (0.86) > ...**. Donc `D̂(q,2) = {p, d_1}`.

**Condition de retrieval remplie** : 0.998 bat le seuil 0.86 — `p` est dans le top-2 avec UN seul document. Si son contenu oriente la generation vers `A_i` (condition de generation), le Hit pour cette requete = 1.

Sur `|Q| = 100` requetes, si 70 basculent ainsi, **HRM = 70/100 = 0.70**.

> **Encart — Niveau de preuve / ASR LLM-juge** : les ASR rapportes par P139 (ex. PoisonedRAG black-box 0.69 dot / 0.80 cosinus sur NQ/Contriever, P139 Table 5/6) sont mesures avec **GPT-4o-mini comme juge** (P139, Section 5.1.3). Tag MATHEUX : **[ASR LLM-JUGE]** — ne JAMAIS porter ces chiffres comme des bornes dures (un juge LLM est manipulable ; cf. P044, 99% flip rate).
>
> **Dette MATHEUX — non encore verifie** : le *chiffre tete* exact de CorruptRAG-AS/AK (P139 Table 4) **n'a pas ete extrait** par MATHEUX (dette D2). Ne pas l'inventer.

---

## Brique 3 — Imitation d'un retriever black-box (F77, FlippedRAG Phase 1)

### Theorie formelle

**F77 — Perte contrastive d'imitation de retriever** [ALGORITHME] (Chen et al., 2025, P138, Section 3.3, **Eq. (2)**, p.4)

$$\mathcal{L} = -\frac{1}{|D|}\sum_{(d^+, d^-)\in D} \log\!\left[\frac{R_i(q, d^+)}{R_i(q, d^+) + \sum R_i(q, d^-)}\right].$$

- `R_i` : modele **surrogate** (white-box, sous notre controle) entraine a imiter le retriever cible `RM` (black-box, dont on ne voit PAS les poids).
- `(d^+, d^-)` : paires contrastives positif/negatif, avec des **hard negatives** (negatifs difficiles) pour fideliser l'imitation.
- Optimiseur : **Adam**. Objectif : capturer les "ranking preferences" du retriever cible.

> **Encart — Niveau de preuve** : la *forme* de la perte est **[ALGORITHME]** (variante d'InfoNCE, cf. Module 6 Partie D). Mais **aucune borne de generalisation** n'est fournie : la qualite reelle de l'imitation (le transfert vers la cible) est **[EMPIRIQUE]**, mesuree par NDCG@10 / Inter@10 (P138, Table 2). On ne prouve pas que le surrogate copie parfaitement la cible (MATHEUX, F77, H2).

### Intuition : "apprendre a copier le classement sans voir les poids"

C'est exactement la perte contrastive du Module 6, mais appliquee au **retrieval** :

- Avant (Module 6) : rapprocher un mot de son synonyme, eloigner des mots sans rapport.
- Ici : pour une requete `q`, on veut que le surrogate `R_i` donne un score **plus eleve** au document que la cible classe en haut (`d^+`) qu'aux documents qu'elle classe en bas (`d^-`).

On ne connait pas les poids du retriever cible. Mais on peut **l'interroger** (lui soumettre des requetes et observer son classement), recolter des paires (haut classement = `d^+`, bas classement = `d^-`), et entrainer notre surrogate a **reproduire ces preferences de classement**. Une fois `R_i` fidele, on peut calculer des gradients dessus (lui est white-box) pour fabriquer l'attaque — ce que la cible black-box nous interdisait.

> Analogie : vous ne connaissez pas la recette secrete d'un jury de concours. Mais en voyant beaucoup de ses verdicts (qui gagne, qui perd), vous entrainez un "jury fantome" qui predit ses choix. Ensuite vous optimisez votre candidat contre le jury fantome — et ca transfere au vrai jury.

### Pourquoi les hard negatives ?

Un negatif "facile" (totalement hors-sujet) n'apprend rien : le surrogate le rejette deja trivialement. Un **hard negative** est un document plausible mais classe bas par la cible — c'est lui qui force le surrogate a copier les **frontieres fines** de decision du retriever cible (P138, Section 3.3). C'est le meme phenomene que l'exemple "infirmier vs medecin" du Module 6 : les cas confondants sont ceux qui font progresser l'apprentissage.

---

## Brique 4 — Trigger adversarial et bascule d'opinion (F78, F79)

### Theorie formelle — l'objectif d'optimisation

**F78 — Perte du trigger adversarial (opinion shift)** [HEURISTIQUE] (Chen et al., 2025, P138, Section 3.4, **Eq. (3)**, p.5)

$$\max_{w}\ \Big\{\ M_i(q, T_{\text{pat}}; w)\ +\ \lambda_1 \cdot \log P_g(T_{\text{pat}}; w)\ +\ \lambda_2 \cdot f_{\text{nsp}}(d_t, T_{\text{pat}}; w)\ \Big\}.$$

- `T_pat` : le **trigger adversarial** (texte injecte, utilise comme `p_adv`).
- `M_i(q, T_pat; w)` : score de pertinence du **surrogate** (F77) — ce terme **eleve le rang** du document portant l'opinion cible.
- `log P_g(T_pat; w)` : **contrainte de fluidite** via un modele de langue `g` (le trigger doit ressembler a du texte naturel).
- `f_nsp(d_t, T_pat; w)` : score de **next-sentence-prediction** entre le trigger et le document `d_t` (coherence / furtivite).
- `λ_1, λ_2 ∈ [0,1]` : hyperparametres. Optimisation par **SGD**.

> **Encart — Niveau de preuve** : F78 est **[HEURISTIQUE]** — un objectif d'optimisation **sans borne** ni garantie. La chaine causale "elever le rang ⇒ presence accrue dans le contexte ⇒ biais de reponse" est **explicite mais non prouvee formellement** (MATHEUX, F78, H1). On observe l'effet, on ne le demontre pas.

### Intuition : trois forces qui tirent ensemble

L'objectif maximise une **somme de trois termes** — comme trois cordes tirant un meme document :

1. **Monter dans le classement** (`M_i`) : le coeur de l'attaque. On veut que le surrogate (donc, par transfert, la cible) classe haut le document qui porte l'opinion qu'on veut imposer.
2. **Rester fluide** (`λ_1 log P_g`) : si le trigger est du charabia, un detecteur de texte anormal le reperera. Le terme de modele de langue garde le texte plausible.
3. **Rester coherent** (`λ_2 f_nsp`) : le trigger doit s'enchainer naturellement avec le document hote (NSP), pour ne pas trahir une "greffe".

Les `λ` arbitrent le **compromis rang / furtivite** : pousser trop fort sur le rang peut produire un texte suspect ; pousser trop fort sur la furtivite peut affaiblir la montee au classement.

L'**effet en cascade** vise (P138, Section 3.4, verbatim) : elever le rang ⇒ augmenter la part du document dans le contexte du LLM ⇒ amplifier la probabilite que la reponse generee **s'aligne sur l'opinion cible**.

### Ce que mesurent les metriques (F79)

**F79 — Metriques opinion-shift** [EMPIRIQUE] (Chen et al., 2025, P138, Section 4, p.5-6)

| Metrique | Ce qu'elle mesure (verbatim P138) | Niveau |
|----------|-----------------------------------|--------|
| **Top3v** | gain de la proportion de l'opinion cible **dans le top-3** apres manipulation | Retrieval (classement) |
| **RASR** (Ranking Attack Success Rate) | taux moyen de candidats dont le **rang est effectivement remonte** par requete | Retrieval |
| **BRank** (Boost Rank) | moyenne du **total des ameliorations de rang** des documents cibles, par requete | Retrieval |
| **OMSR** (Opinion Manipulation Success Rate) | taux moyen de **reponses LLM manipulees au niveau de l'opinion** | Reponse LLM |
| **ASV** (Average Stance Variation) | augmentation moyenne des **scores d'opinion** des reponses dans la direction visee | Reponse LLM |

Lecture : les trois premieres (Top3v, RASR, BRank) mesurent **le classement** (a-t-on reussi a faire monter le document ?). Les deux dernieres (OMSR, ASV) mesurent **la reponse finale** (l'opinion du LLM a-t-elle bascule ?). C'est la traduction chiffree de la cascade rang → contexte → opinion.

> **Encart — Niveau de preuve / dettes** :
> - **[EMPIRIQUE]** : ce sont des definitions operationnelles, **aucun theoreme**. Le "opinion score" sous-jacent depend d'un **juge d'opinion** manipulable (MATHEUX, F79, tag [ASR LLM-JUGE]).
> - **Dette MATHEUX — non encore verifie** : les **valeurs numeriques** de Top3v/RASR/BRank/OMSR/ASV n'ont PAS ete reportees (dette D3). Le "~50% opinion shift" de la fiche **n'a PAS ete confirme verbatim**.
> - **Seul chiffre verbatim** : le **"20% shift in user cognition"** (P138, Abstract, p.1), et MATHEUX le tague lui-meme **[EMPIRIQUE — etude utilisateur, protocole et N a confirmer]** (dette implicite sur le protocole). A enseigner comme "20% rapporte par les auteurs, protocole a confirmer", PAS comme un fait etabli.
> - **Dette D4 — non encore verifie** : la definition exacte du classifieur d'opinion (le scoring derriere OMSR/ASV) n'est pas formalisee.

---

## Brique 5 — Control-plane vs data-plane (F80, CDA)

### Theorie formelle

**F80 — Masque de logits per-token (control plane)** [ALGORITHME] (Zhang et al., 2026, P137, Sections 2.1-2.3, p.2-3)

Echantillonnage standard (softmax temperee) — **Eq. (2)** (P137, Section 2.1, p.2) :

$$x_{n+1} \sim p\big(x_{n+1}[i]\,\big|\,x_{1:n}\big) = \frac{\exp\!\big(z_{n+1}[i]/T\big)}{\sum_{j=1}^{|V|}\exp\!\big(z_{n+1}[j]/T\big)},$$

ou `z_{n+1}` sont les logits, `T` la temperature, `|V|` la taille du vocabulaire.

Masque grammatical per-token (P137, Section 2.3, p.3, verbatim) : *"valid tokens are kept, while invalid ones are set to −∞ logits and excluded from sampling. The model then samples from the masked distribution, guaranteeing outputs that conform to the grammar."*

Mise en equation (soit `G` la grammaire et `Valid(G, x_{1:n}) ⊆ V` les tokens admissibles a l'etape `n+1`) :

$$\hat{z}_{n+1}[i] = \begin{cases} z_{n+1}[i] & \text{si } \text{token}_i \in \text{Valid}(G, x_{1:n})\\[4pt] -\infty & \text{sinon}\end{cases} \qquad x_{n+1} \sim \text{softmax}\!\big(\hat{z}_{n+1}/T\big).$$

> **Encart — Niveau de preuve** : F80 est **[ALGORITHME]** — la semantique standard du *constrained decoding* (LMQL / Guidance / outlines). L'Eq. (2) softmax est numerotee dans P137 ; le **masque** est decrit **en prose + Figure 2**, PAS comme equation numerotee. La mise en equation `Valid(G,·)`/`ẑ` ci-dessus est une **reformulation fidele d'apres P137 Section 2.3** (MATHEUX, dette D5). Si une citation strictement formelle est requise, ecrire "reformule d'apres P137 Section 2.3" — ne PAS attribuer une equation numerotee inexistante.

### Data plane vs control plane

- **Data plane** = le canal "donnees" : tout ce que le modele **lit** en entree (prompt utilisateur, documents RAG). C'est ce que Sep(M) et le filtrage de contenu surveillent.
- **Control plane** = le canal qui **gouverne le decodage** : ici, la **grammaire** qui decide quels tokens sont autorises a chaque etape (via les API de "structured output" / JSON schema / function calling).

L'attaque **CDA** (Constrained Decoding Attack) agit sur le **control plane**, pas sur le data plane. Pipeline en deux temps (P137, Abstract + contributions, p.1, verbatim) : *"(1) schema-enforced logit masking injects a malicious prefix into the generation trajectory, and (2) the model itself completes the harmful intent. ... CDA acts on the decoding process itself, so internal safety alignment alone cannot stop it."*

### Pourquoi c'est orthogonal au filtrage de contenu

Le filtrage de contenu inspecte **le texte** (entree et/ou sortie). Mais le masque de logits ne passe **pas** par le texte : il modifie la **distribution de sortie** AVANT que le token soit choisi. La grammaire `G` est construite pour que `Valid(G, ·)` **force** un prefixe affirmatif `y_pre` (du type "Sure, here is...") en mettant a `-∞` **tous les tokens de refus**. Le modele, une fois conditionne sur ce prefixe qu'il n'a pas choisi, complete de lui-meme l'intention nuisible.

> **Encart — Niveau de preuve / garantie detournee** : la garantie de conformite du constrained decoding est **DURE** (deterministe), pas probabiliste. Forcer un prefixe affirmatif est **certain**, pas "tres probable". C'est precisement cette garantie — concue pour produire du JSON valide — qui est **retournee contre la cible**. L'alignement δ⁰ agit sur le data plane ; il ne voit pas le control plane (MATHEUX, F80, H3).
>
> **ASR LLM-juge** : DictAttack 94.3-99.5% ASR (gpt-5, gemini-2.5-pro, deepseek-r1, gpt-oss-120b), 75.8% contre les guardrails SOTA (P137, Abstract) — **juge = gpt-4o** → tag **[ASR LLM-JUGE]**, pas une borne dure.

### Exemple numerique a la main

Vocabulaire reduit `{"Sure", "Sorry", "No"}`, logits `z = (2.0, 5.0, 1.0)`, temperature `T = 1`.

**Sans masque** (softmax normal) :

$$\exp(2.0)=7.389,\quad \exp(5.0)=148.4,\quad \exp(1.0)=2.718;\qquad \text{somme}=158.5.$$

$$p(\text{"Sorry"}) = \frac{148.4}{158.5} \approx \mathbf{0.94}.$$

Le refus ("Sorry") domine — alignement intact, comportement normal.

**Avec masque grammatical** `Valid = {"Sure"}` : on met les autres a `-∞`.

$$\hat{z} = (2.0,\ -\infty,\ -\infty)\ \Rightarrow\ p(\text{"Sure"}) = \frac{\exp(2.0)}{\exp(2.0)} = \mathbf{1.0}.$$

Le refus est rendu **structurellement impossible** : sa probabilite n'est pas "reduite", elle est **exactement 0**. Le filtrage de contenu n'a rien a inspecter — le token de refus n'a jamais ete une option. C'est le mecanisme exact de F80.

---

## Lien AEGIS : Sep(M), conjectures C2/C5, batch FORGE-RAG-CP-20260612

### Pourquoi Sep(M) ne suffit pas

**Sep(M)** (Zverev et al., 2025, ICLR, Definition 2 ; voir Module 4) mesure la capacite d'un modele a **ne pas executer** une instruction presente dans le canal *donnees*. Les trois vecteurs de ce module attaquent des points que Sep(M) **ne couvre pas** (MATHEUX, section "Lien Sep(M)") :

1. **CorruptRAG (F75/F76) et FlippedRAG (F77-F79)** operent **en amont** de l'inference, dans le **retrieval**. Meme un modele a Sep(M) eleve traite le document empoisonne comme du **contexte legitime recupere**, pas comme une instruction-donnee a ignorer. ⇒ **Sep(M) seul ne protege pas contre le RAG poisoning.** Le maillon faible est la fonction de score `D(q,N)`, pas le decodeur.
2. **CDA (F80)** agit sur le **control plane** ; Sep(M) est defini sur le **data plane**. Un modele peut avoir Sep(M) = 1 (separation parfaite des canaux texte) et rester **100% vulnerable** a un masque grammatical. La phrase "internal safety alignment alone cannot stop it" (P137) est l'analogue exact de "Sep(M) ne capture pas le control plane".

### Rattachement aux conjectures

- **C5 (propagation via composants externes)** : F75/F76/F77-F79 montrent que l'attaque entre par le **retrieval**, un composant externe au modele. Cela **renforce C5** — la vulnerabilite se propage par le maillon `D(q,N)`. Extension de metrique motivee : une **"robustesse retrieval"** (fraction du top-N resistant a l'injection d'un document adverse).
- **C2 (necessite d'une defense architecturale δ³ cross-plane)** : F80 montre qu'aucune defense data-plane ne stoppe une attaque control-plane. Cela **renforce C2** — il faut une separation **control-plane** ("decoding-plane separation"), une extension de Sep(M) d'une dimension.

**Synthese MATHEUX** : aucune des trois formules n'est neutralisee par un Sep(M) eleve. Elles motivent **deux extensions distinctes** de la metrique du lab : (a) robustesse retrieval (poisoning), (b) separation control-plane (CDA).

### Le batch FORGE-RAG-CP-20260612

Ces six formules formalisent les trois vecteurs forges dans le batch **FORGE-RAG-CP-20260612** : single-doc RAG poisoning (P139 CorruptRAG), opinion-shift par manipulation de ranking (P138 FlippedRAG), et control-plane / grammar-constrained decoding (P137 CDA). Statut du glossaire : **PROPOSE**.

> **Dette MATHEUX globale — non encore verifie (ingestion)** : dette **D1** — P137/P138/P139 n'ont **pas** de chunks `pdf_fulltext` dans ChromaDB `aegis_bibliography` (seuls les chunks de fiche d'analyse). L'extraction a ete faite **directement depuis les PDF source**. Action de resolution : re-ingerer les 3 PDF en `pdf_fulltext`. Tant que ce n'est pas fait, toute re-verification RAG fulltext de ces formules est impossible.

---

## Exercices corriges

### Exercice 1 (Facile) — Condition de retrieval

Une base RAG avec `N = 3`. Les scores des documents legitimes les mieux classes sont : 0.91, 0.84, 0.77, 0.71, 0.65.

a) Quel score un document injecte doit-il depasser pour entrer dans le top-3 ?
b) Un attaquant fabrique `p` avec `sim(q, p) = 0.80`. Entre-t-il dans le top-3 ?

**Solution**

a) Le top-3 contient actuellement les scores 0.91, 0.84, 0.77. Le **3e** (le plus faible du top-3) vaut **0.77**. Pour entrer, il faut depasser **0.77** (le document a 0.77 serait alors evince).

b) `sim = 0.80 > 0.77` ⇒ **oui**. Nouveau top-3 : {0.91, 0.84, 0.80}. Le document a 0.77 sort. **Un seul document suffit** (F76) : il n'a pas eu besoin de battre le 1er (0.91), juste le 3e.

---

### Exercice 2 (Facile) — Hit-Ratio

Sur `|Q| = 50` requetes ciblees, l'attaque CorruptRAG fait basculer la reponse RAG vers `A_i` pour 36 requetes.

a) Calculez le Hit-Ratio (HRM).
b) Cette valeur est-elle une borne dure de l'efficacite de l'attaque ?

**Solution**

a) HRM = 36 / 50 = **0.72**.

b) **Non.** F76 est **[EMPIRIQUE]/[HEURISTIQUE]** : pas de borne theorique. De plus, le succes "RAG = A_i" est evalue par un **LLM-juge** (GPT-4o-mini, [ASR LLM-JUGE]) — manipulable. On dit "HRM = 0.72 observe sur ce jeu avec ce juge", jamais "l'attaque reussit a coup sur dans 72% des cas".

---

### Exercice 3 (Moyen) — Masque de logits

Vocabulaire `{"Sure", "I", "cannot", "help"}`, logits `z = (1.5, 0.5, 3.0, 0.8)`, `T = 1`. La grammaire force le premier token a etre "Sure" : `Valid = {"Sure"}`.

a) Calculez `p("cannot")` SANS masque (le token de refus le plus probable).
b) Calculez `p("Sure")` AVEC le masque.
c) Expliquez pourquoi le filtrage de contenu en sortie ne voit jamais le refus.

**Solution**

a) `exp(1.5)=4.482`, `exp(0.5)=1.649`, `exp(3.0)=20.09`, `exp(0.8)=2.226`. Somme = 28.45.
`p("cannot") = 20.09 / 28.45 ≈ **0.706**`. Sans masque, le modele commencerait probablement un refus.

b) Avec `Valid = {"Sure"}` : `ẑ = (1.5, -∞, -∞, -∞)`. `p("Sure") = exp(1.5)/exp(1.5) = **1.0**`.

c) Le masque agit **avant** l'echantillonnage, sur les logits (control plane). Les tokens de refus ont `-∞` ⇒ probabilite 0 ⇒ ne sont **jamais generes**. Le filtre de sortie inspecte du texte qui ne contient deja plus aucun refus : il n'y a rien a filtrer. C'est l'orthogonalite data-plane / control-plane (F80).

---

### Exercice 4 (Moyen) — Imitation contrastive

On entraine un surrogate `R_i` (F77). Pour une requete `q`, on a un positif `d^+` (la cible le classe 1er) et deux negatifs `d^-_1, d^-_2`. Les scores du surrogate sont `R_i(q,d^+) = 8.0`, `R_i(q,d^-_1) = 2.0`, `R_i(q,d^-_2) = 1.0` (deja exponentiels, pour simplifier).

a) Calculez la perte `L` pour cette paire.
b) Que se passe-t-il si un hard negative voit son score monter a `R_i(q,d^-_1) = 7.5` ?

**Solution**

a) `L = -log[ 8.0 / (8.0 + 2.0 + 1.0) ] = -log(8.0/11.0) = -log(0.727) = **0.318**`.

b) Nouveau : `L = -log[ 8.0 / (8.0 + 7.5 + 1.0) ] = -log(8.0/16.5) = -log(0.485) = **0.724**`. La perte **double** : un hard negative proche du positif force le surrogate a mieux les separer — c'est exactement le role des hard negatives (P138, Section 3.3) pour fideliser l'imitation du retriever cible.

---

### Exercice 5 (Difficile) — Lien Sep(M) / conjectures

Un modele cible a `Sep(M) = 0.95` (excellente separation instruction/donnees).

a) Est-il protege contre CorruptRAG (F76) ? Justifiez.
b) Est-il protege contre CDA (F80) ? Justifiez.
c) Quelle extension de metrique chaque cas motive-t-il, et quelle conjecture est renforcee ?

**Solution**

a) **Non.** Sep(M) mesure la non-execution d'instructions dans le canal *donnees*. CorruptRAG opere **en amont**, dans le retrieval : le document empoisonne est recupere comme **contexte legitime**, pas comme une instruction-donnee a ignorer. Sep(M) ne couvre pas le canal retrieval (MATHEUX, Lien Sep(M)).

b) **Non.** Sep(M) est defini sur le **data plane** (entree texte). CDA agit sur le **control plane** (masque de logits). Un modele peut avoir Sep(M)=1 et rester 100% vulnerable — "internal safety alignment alone cannot stop it" (P137).

c) - CorruptRAG ⇒ extension **"robustesse retrieval"** (fraction du top-N resistant a l'injection d'un doc adverse), renforce **C5** (propagation via composants externes).
   - CDA ⇒ extension **"separation control-plane"** (decoding-plane separation), renforce **C2** (defense architecturale δ³ cross-plane).

---

## Mini-quiz (5 questions)

1. Dans F75, si tous les embeddings sont normalises, a quoi le produit scalaire `⟨E(q),E(d)⟩` est-il egal ?
2. Quelle est la **contrainte clef** de F76 qui distingue CorruptRAG de PoisonedRAG ?
3. Vrai ou faux : F78 (trigger adversarial) est un theoreme avec borne de convergence prouvee.
4. Parmi Top3v, RASR, BRank, OMSR, ASV — lesquelles mesurent la **reponse du LLM** (et non le classement) ?
5. Pourquoi le filtrage de contenu en sortie ne stoppe-t-il pas une attaque CDA (F80) ?

**Reponses**

1. Au **cosinus** `cos(E(q),E(d))` : quand `||u||=||v||=1`, produit scalaire = cosinus (Brique 1).
2. **`|P_i| = 1`** — un **seul** document empoisonne par requete. PoisonedRAG supposait dominer numeriquement le top-N ; CorruptRAG leve cette hypothese (F76, P139 Section 4.1).
3. **Faux.** F78 est **[HEURISTIQUE]** : objectif d'optimisation sans borne ni garantie de convergence (la chaine causale rang→opinion est explicite mais non prouvee).
4. **OMSR** et **ASV** (niveau "reponse LLM"). Top3v/RASR/BRank mesurent le **classement** (retrieval) (F79).
5. Parce que le masque de logits agit sur le **control plane**, **avant** l'echantillonnage : les tokens de refus sont mis a `-∞` (proba 0) et ne sont jamais generes. Le filtre de sortie inspecte un texte qui ne contient deja plus de refus — orthogonalite data/control plane (F80).

---

## Resume du module

| Formule | Enonce (notation originale) | Tag | Source |
|---------|-----------------------------|-----|--------|
| **F75** | `D(q,N)=argTop-N sim(q,d_k)`, `sim=⟨E(q),E(d_k)⟩` | [ALGORITHME] | P139, Sec. 2, p.2 |
| **F76** | `max_P (1/\|Q\|) Σ 𝟙(RAG(D̂(q_i,N),q_i)=A_i)` s.c. `\|P_i\|=1` | [EMPIRIQUE] / resolution [HEURISTIQUE] | P139, Sec. 4.1, Eq.(1), p.4 |
| **F77** | `L=-(1/\|D\|)Σ log[R_i(q,d+)/(R_i(q,d+)+ΣR_i(q,d-))]` | [ALGORITHME] | P138, Sec. 3.3, Eq.(2), p.4 |
| **F78** | `max_w{M_i + λ1·log P_g + λ2·f_nsp}` | [HEURISTIQUE] | P138, Sec. 3.4, Eq.(3), p.5 |
| **F79** | Top3v, RASR, BRank (rang) ; OMSR, ASV (reponse) | [EMPIRIQUE] | P138, Sec. 4, p.5-6 |
| **F80** | masque `ẑ[i]=z[i] si token_i∈Valid(G,x_{1:n}), sinon -∞` | [ALGORITHME] | P137, Eq.(2) Sec.2.1 p.2 ; masque Sec.2.3 p.3 |

**Message cle** : le RAG transforme une **fonction de score** (le retrieval) en surface d'attaque. Un seul document suffit s'il bat le N-ieme score (F76) ; on peut imiter un retriever black-box pour optimiser l'attaque (F77) et faire basculer l'opinion (F78/F79). Le control-plane (F80) court-circuite entierement le filtrage de contenu. Aucun de ces vecteurs n'est neutralise par un Sep(M) eleve — d'ou deux extensions de metrique : **robustesse retrieval** (C5) et **separation control-plane** (C2).

**Dettes signalees (non encore verifie)** : D1 ingestion fulltext ChromaDB (P137/P138/P139 absents) ; D2 chiffre tete CorruptRAG-AS/AK ; D3 valeurs Top3v/RASR/BRank/OMSR/ASV (et le "~50% opinion shift" non confirme) ; D4 definition du classifieur d'opinion ; D5 le masque F80 est reformule d'apres la prose P137 (pas une equation numerotee). ASR de F76/F79/F80 = **[ASR LLM-JUGE]**, jamais des bornes dures.

---

*Module 9 termine — formules F75 a F80, batch FORGE-RAG-CP-20260612.*
