# P053: Semantic Jailbreaks and RLHF Limitations in LLMs: A Taxonomy, Failure Trace, and Mitigation Strategy
**Auteurs**: Ritu Kuklani (Independent Researcher), Gururaj Shinde (Automation Anywhere), Varad Vishwarupe (University of Oxford / Trinity College Cambridge)
**Venue**: International Journal of Computer Applications (IJCA), Volume 187, No. 27, pp. 38-43, juillet 2025
> **PDF Source**: [PDF NON DISPONIBLE — texte extrait via ChromaDB]
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (39 chunks)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Kuklani et al. proposent une taxonomie systematique des limitations du RLHF face aux jailbreaks semantiques, c'est-a-dire des attaques qui preservent le sens malveillant tout en modifiant la forme de surface. La contribution principale est la demonstration que l'alignement RLHF est fondamentalement superficiel : il opere sur des patterns de tokens plutot que sur la comprehension semantique profonde. Le papier identifie quatre categories de contournement (encodage, paraphrase, obfuscation, multimodal) et documente six signatures de defaillance observees sur des modeles de production (Section 4-5, p. 39-41).

### Methodologie

Les auteurs construisent leur taxonomie en deux phases. D'abord, une revue systematique de plus de 50 incidents de jailbreak documentes dans la litterature (Section 4, p. 40). Ensuite, une evaluation empirique de modeles de production (ChatGPT-3.5/4, Claude 3, LLaMA 3, Mistral 7B) contre des prompts adversariaux dans trois domaines : generation de code, dialogue et resume (Section 7, p. 42). La taxonomie identifie quatre categories de vulnerabilite RLHF : (1) encodage (Base64, ROT13), (2) paraphrase (euphemismes, metaphores), (3) obfuscation (instructions fragmentees entre messages), (4) multimodal (texte dans des images) (Section 4, p. 40).

Les six signatures de defaillance identifiees sont (Section 5, p. 41) : (1) echecs par connaissance insuffisante, (2) generalisation d'alignement inadequate, (3) degradation d'alignement a long terme, (4) decomposition heuristique, (5) limites du suivi d'instructions dans les langues non-anglaises, (6) detection de signification implicite defaillante.

### Resultats cles

- **Paraphrase Bypass Rate (PBR)** : les modeles sont vulnerables aux reformulations semantiquement equivalentes, confirmant que l'alignement repose sur la surface lexicale (Section 4, p. 40)
- **Claude 3.5** : vulnerable aux reformulations euphemistiques (exemple : reponse inappropriee a une question sur les personnes economiquement defavorisees) (Section 5.2, p. 41, Figure 2)
- **DeepSeek-v3** : contourne par paraphrase alors que la meme question en clair declenche le refus (Section 5.6, p. 41, Figures 4-5)
- **Gaps identifies** : (1) fragilite RLHF aux semantiques, (2) filtrage de surface, (3) absence de benchmarks realistes, (4) absence de journalisation forensique (Section 3, p. 40)

### Limitations admises par les auteurs

Le papier reste principalement qualitatif : les exemples de jailbreak sont documentes mais pas quantifies systematiquement (pas d'ASR global calcule). La categorie multimodale est introduite mais pas evaluee experimentalement de maniere extensive. Les modeles testes ne sont pas toujours identifies avec des versions exactes.

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Lien glossaire AEGIS |
|----|---------|-------------------|----------------------|
| F47 | $$\text{PBR}(M) = \frac{|\{p' \in P_{para} : M(p') = \text{harmful}\}|}{|P_{para}|}$$ | $P_{para}$ = ensemble de paraphrases semantiquement equivalentes d'un prompt nocif | F47 (Paraphrase Bypass Rate) |

**Variables** :
- $M$ : modele cible
- $P_{para}$ : ensemble de reformulations semantiquement equivalentes du prompt original
- $M(p') = \text{harmful}$ : le modele produit une reponse nocive pour la paraphrase $p'$

**Nature epistemique** : [EMPIRIQUE] — metrique proposee, illustree par exemples mais pas mesuree systematiquement sur un corpus standardise avec N suffisant.

---

## Section 3 — Critique methodologique

### Forces

1. **Taxonomie systematique** — les quatre categories (encodage, paraphrase, obfuscation, multimodal) couvrent les principales surfaces d'attaque semantique et sont independantes du modele cible (Section 4, p. 40).
2. **Identification des limitations RLHF** — le gap analysis (Section 3, p. 40) distingue clairement quatre failles structurelles : fragilite semantique, filtrage de surface, absence de benchmarks realistes, absence de forensique.
3. **Six signatures de defaillance** — la categorisation des modes d'echec (Section 5, p. 41) est directement exploitable pour la conception de defenses ciblees.
4. **Connexion cross-modale** — l'introduction des Indirect Multimodal Manipulations (IMM) etend l'analyse au-dela du texte seul (Section 6, p. 42).

### Faiblesses

1. **Principalement qualitatif** — pas d'ASR global, pas de N systematique, pas de test statistique. Les exemples sont illustratifs mais pas representatifs d'une evaluation rigoureuse.
2. **Versions de modeles imprecises** — les modeles de production ne sont pas toujours identifies avec des numeros de version exacts (GPT-3.5/4 sans date, Claude 3 sans version precise).
3. **Journal de rang modeste** — IJCA est un journal international mais pas au niveau des venues top-tier (IJCA n'a pas de CORE Ranking eleve).
4. **PBR non mesure** — la formule est proposee mais aucune valeur numerique n'est rapportee. La metrique reste conceptuelle.
5. **Absence de protocole reproductible** — pas de code, pas de dataset structure, pas de script d'evaluation.
6. **Multimodal introduit mais non valide** — la categorie IMM est argumentee mais pas testee experimentalement de maniere rigoureuse (Section 6, p. 42).

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C1** (δ⁰ insuffisant) | FORT | Confirme qualitativement par les 6 signatures de defaillance | Les modeles de production echouent sur des reformulations semantiques simples |
| **C3** (alignement superficiel) | FORT | Taxonomie independante confirmant que RLHF aligne sur des tokens, pas sur le sens | Le PBR conceptuel formalise l'intuition que l'alignement ne generalise pas |
| C5 (cosine insuffisante) | MODEREE | Implicite : les paraphrases a cosine similaire contournent l'alignement | La proximite semantique mesurable ne correle pas avec la detection |

### Couches delta

- **δ⁰ (RLHF alignment)** : directement analyse. La taxonomie des 4 categories documente les limites structurelles de δ⁰.
- **δ¹ (prompt engineering)** : implique par l'obfuscation multi-message.
- **δ²** : non applicable.
- **δ³** : non applicable.

### Formules AEGIS impactees

- **F47 (PBR)** : definie conceptuellement par P053. La valeur numerique reste a mesurer dans le cadre AEGIS avec les 102 templates et le moteur genetique.
- **Lien templates AEGIS** : la taxonomie 4-categories (encodage, paraphrase, obfuscation, multimodal) peut etre mappee sur les categories de templates AEGIS existantes.

### Gap identifie

- **G-016** (nouveau, RUN-003) : les attaques multimodales ne sont pas couvertes par le catalogue AEGIS text-only. P053 introduit le concept IMM mais AEGIS n'a pas de pipeline image-vers-texte.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P053 |
| **Type** | Survey / Taxonomie (avec evaluation qualitative) |
| **Domaine** | Securite RLHF, jailbreaks semantiques, alignement |
| **Modeles testes** | ChatGPT-3.5, ChatGPT-4, Claude 3, LLaMA 3, Mistral 7B (versions non precisees) |
| **Metrique principale** | PBR (conceptuelle, non mesuree numeriquement) |
| **delta-layers** | δ⁰ (limites RLHF), δ¹ (contournement prompt) |
| **Conjectures** | C1 (fort), C3 (fort), C5 (moderee) |
| **Reproductibilite** | Faible — pas de code, pas de dataset, exemples qualitatifs |
| **Code disponible** | Non |
| **Dataset public** | Non |
| **SVC pertinence** | 5/10 |
| **Tags** | [ARTICLE VERIFIE], RLHF, taxonomie, PBR, jailbreaks semantiques, IMM, IJCA |
