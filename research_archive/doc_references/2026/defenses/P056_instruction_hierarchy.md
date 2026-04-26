# P056: Stronger Enforcement of Instruction Hierarchy via Augmented Intermediate Representations
**Auteurs**: Sanjay Kariyappa, G. Edward Suh (NVIDIA)
**Venue**: arXiv:2505.18907v2 [cs.AI], mars 2026 (preprint, under review)
> **PDF Source**: [literature_for_rag/P056_2505.18907.pdf](../../literature_for_rag/P056_2505.18907.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (65 chunks)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Kariyappa et Suh (NVIDIA) introduisent AIR (Augmented Intermediate Representations), une methode de defense contre les attaques d'injection de prompt qui renforce l'Instruction Hierarchy (IH) en injectant des signaux de privilege non seulement a la couche d'entree mais dans les representations intermediaires de TOUTES les couches du transformer. L'intuition cle est que le signal IH injecte uniquement a l'entree se degrade a mesure qu'il traverse les couches du reseau, perdant sa capacite discriminante entre instructions systeme et donnees utilisateur. AIR resout ce probleme en augmentant les representations intermediaires avec des embeddings entrainables specifiques a chaque couche (Abstract, p. 1).

### Methodologie

L'approche repose sur l'ajout d'embeddings entrainables $e_l^{priv}$ a chaque couche $l$ du transformer, ou $priv \in \{system, user, data\}$ encode le niveau de privilege (Section 3, p. 3-5). L'entrainement utilise un objectif d'alignement qui maximise la distinction entre les niveaux de privilege dans les representations intermediaires. Les auteurs comparent avec les approches existantes : delimiteurs speciaux (OpenAI, Anthropic), embeddings additifs a la couche d'entree, et le protocole d'Instruction Hierarchy de Wallace et al.

L'evaluation est conduite sur des attaques par gradient (GCG et variantes) contre plusieurs modeles (taille et architecture non detaillees dans les chunks disponibles). La metrique principale est l'Attack Success Rate Reduction Factor (ARF = ASR_baseline / ASR_AIR).

### Resultats cles

- **Reduction d'ASR** : 1.6x a 9.2x de reduction par rapport aux methodes IH existantes (entree uniquement), sans degradation significative de l'utilite du modele (Abstract, p. 1)
- **Degradation du signal IH** : les auteurs demontrent empiriquement que le signal IH injecte a l'entree perd sa capacite discriminante dans les couches profondes du transformer. Au-dela de la couche 20+, la distinction entre instructions systeme et donnees utilisateur est significativement affaiblie (implicite dans la justification de AIR)
- **Preservation de l'utilite** : les benchmarks d'utilite montrent que AIR ne degrade pas les performances du modele sur les taches standard (Abstract, p. 1)
- **Specificite gradient-based** : l'evaluation porte principalement sur les attaques par gradient (GCG et variantes). La robustesse contre les attaques semantiques (paraphrase, encodage) n'est pas evaluee

### Limitations admises par les auteurs

L'approche necessite une modification de l'architecture du modele et un re-entrainement, ce qui la rend inapplicable aux modeles accessibles uniquement par API (GPT-4, Claude). L'evaluation est limitee aux attaques par gradient ; les attaques semantiques de type P053 ne sont pas couvertes. La question de la transferabilite de l'approche entre architectures differentes reste ouverte.

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Lien glossaire AEGIS |
|----|---------|-------------------|----------------------|
| F50 | $$\text{ARF} = \frac{\text{ASR}_{baseline}}{\text{ASR}_{AIR}}$$ | Baseline = IH input-layer-only ; AIR = IH intermediate-layer. ARF in [1.6, 9.2] | F50 (ASR Reduction Factor) |
| Signal decay | $$h_l = f_l(h_{l-1}) + e_l^{priv}$$ | $h_l$ = representation couche $l$, $e_l^{priv}$ = embedding de privilege entrainable | Derive |

**Variables** :
- $\text{ASR}_{baseline}$ : taux de succes d'attaque avec IH standard (entree uniquement)
- $\text{ASR}_{AIR}$ : taux de succes d'attaque avec AIR (intermediaire)
- $h_l$ : representations intermediaires du token a la couche $l$
- $e_l^{priv}$ : embedding de privilege entrainable, specifique a la couche $l$ et au niveau de privilege
- $f_l$ : fonction de transformation du transformer a la couche $l$

**Nature epistemique** : [EMPIRIQUE] — l'efficacite est mesuree experimentalement. Pas de preuve formelle que le signal ne peut pas etre contourne par un adversaire adaptatif ayant connaissance de AIR.

---

## Section 3 — Critique methodologique

### Forces

1. **Intuition architecturale solide** — l'observation que le signal IH se degrade a travers les couches est physiquement fondee et empiriquement verifiee. La solution est elegante : renforcer le signal la ou il faiblit (Section 1-2, p. 1-3).
2. **Reduction substantielle** — le facteur 1.6x a 9.2x est le meilleur resultat de defense δ¹ dans le corpus AEGIS a ce jour (Abstract, p. 1).
3. **Preservation de l'utilite** — pas de compromis securite/utilite mesurable, contrairement a beaucoup de defenses qui degradent les performances (Abstract, p. 1).
4. **Provenance NVIDIA** — equipe de recherche industrielle de premier plan, ce qui renforce la credibilite technique et la viabilite d'implementation.

### Faiblesses

1. **Attaques par gradient uniquement** — GCG et variantes sont testes, mais les attaques semantiques (paraphrase, encodage, cross-lingual) de P053 ne sont pas evaluees. **Gap G-018** (RUN-003).
2. **Modification architecturale requise** — inapplicable aux modeles API-only (GPT-4, Claude, Gemini). Uniquement viable pour les modeles open-weight (LLaMA, Mistral) ou les deploiements sur infrastructure propre (Ollama, AEGIS).
3. **Adversaire non adaptatif** — l'evaluation suppose un adversaire qui ne connait pas AIR. Un adversaire adaptatif pourrait potentiellement optimiser son attaque pour contourner les embeddings de privilege.
4. **Preprint** — pas encore peer-reviewed.
5. **Pas de test multi-tour** — l'evaluation est single-turn. L'erosion du signal IH intermediaire sur des echanges multi-tour n'est pas mesuree.
6. **Reproductibilite limitee** — les details exacts des modeles et hyperparametres ne sont pas entierement documentees dans les chunks disponibles.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C1** (δ⁰ insuffisant) | CRITIQUE — confirme | Le signal IH input-only est insuffisant, validant l'insuffisance de δ⁰ standard | La degradation du signal a travers les couches est la preuve mecaniste de pourquoi δ⁰ echoue |
| **C4** (derive mesurable) | FORT | L'ARF quantifie la difference entre defense input-only et intermediate | Premier resultat mecaniste montrant OU dans le transformer l'information de privilege se perd |

### Couches delta

- **δ⁰ (RLHF alignment)** : directement analyse. L'IH input-only est la version standard de δ⁰ ; AIR montre qu'elle est insuffisante.
- **δ¹ (instruction enforcement)** : c'est la couche cible du papier. AIR est un mecanisme δ¹ qui opere au sein du modele plutot qu'au niveau du prompt.
- **δ²** : non applicable.
- **δ³** : non applicable.

### Formules AEGIS impactees

- **F50 (ARF)** : definie par P056. Le facteur 1.6-9.2x constitue le benchmark de reference pour les defenses δ¹ dans AEGIS.
- **Technique T44 (Instruction Hierarchy Signal Decay)** : definie a partir de P056. Un attaquant peut exploiter la degradation du signal IH en construisant des prompts profondement imbriques.
- **Lien defense taxonomy** : AIR pourrait etre integree comme technique #67 dans la taxonomie AEGIS (66 techniques actuelles + 1), applicable aux deploiements Ollama.

### Gap identifie

- **G-018** (RUN-003) : AIR non evalue contre les attaques semantiques. Les paraphrases (P053, PBR) et les encodages (Base64, ROT13) contournent-ils les embeddings de privilege intermediaires ? Testable dans AEGIS via le moteur genetique.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P056 |
| **Type** | Defense (architecturale, instruction hierarchy) |
| **Domaine** | Securite LLM, injection de prompt, defense architecturale |
| **Modeles testes** | Non specifies precisement dans les chunks (architectures transformer) |
| **Metrique principale** | ARF in [1.6, 9.2] — reduction d'ASR sans degradation d'utilite (Abstract, p. 1) |
| **delta-layers** | δ⁰ (analyse de l'insuffisance), δ¹ (mecanisme de defense AIR) |
| **Conjectures** | C1 (critique), C4 (fort) |
| **Reproductibilite** | Moyenne — preprint, details partiels, necessite modification architecturale |
| **Code disponible** | Non mentionne |
| **Dataset public** | Non specifie |
| **SVC pertinence** | 8/10 |
| **Tags** | [PREPRINT], AIR, instruction hierarchy, intermediate representations, NVIDIA, defense δ¹ |
