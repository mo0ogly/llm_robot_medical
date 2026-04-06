# P058: Automated Prompt Injection Attacks Against LLM Agents
**Auteurs**: David Hofer (ETH Zurich, SPYLab, superviseur : Prof. Florian Tramer)
**Venue**: MSc Thesis, Department of Computer Science, ETH Zurich, 11 decembre 2025
> **PDF Source**: [literature_for_rag/P058_msc_thesis_hofer.pdf](../../literature_for_rag/P058_msc_thesis_hofer.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (52 chunks, ~46 000 caracteres)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Hofer adapte deux methodes etablies de jailbreaking automatise -- GCG (white-box, optimisation par gradient) et TAP (black-box, recherche iterative) -- au cadre de l'injection de prompt indirecte contre des agents LLM. L'evaluation est conduite sur le framework AgentDojo de Debenedetti et al., couvrant 80 paires de taches dans 4 domaines (workspace, banking, travel, slack) et 3 modeles (Qwen 3 4B, Gemma 3 4B, GPT-5). Le resultat principal est que le TAP black-box surpasse significativement le GCG white-box (45.2% vs 25.2% ASR sur Qwen 3 4B), demontrant que le gap de transfert optimisation-deploiement est un defi plus grand que l'absence d'information de gradient (Abstract, p. i ; Chapter 5, p. 57).

### Methodologie

L'auteur etend le framework AgentDojo pour supporter les attaques white-box via l'integration de la bibliotheque transformers, implemente des variantes single-task et task-universal, et developpe des techniques de validation de tokenization pour assurer la coherence entre environnements d'optimisation et de deploiement (Chapter 4, p. 22-50).

**GCG** : optimisation par gradient de suffixes adversariaux injectes dans le contexte de l'agent. Variantes testees : prefix-only, suffix-only, prefix+suffix. Etude d'ablation comparant l'optimisation guidee par gradient vs recherche aleatoire (Section 4.3-4.4, p. 28-37).

**TAP** : architecture multi-modele avec attaquant (generation de prompts), cible (agent avec outils), et juge (evaluation du succes). Adaptation de l'algorithme de recherche arborescente au contexte agent avec appels d'outils (Section 4.5, p. 38-48).

**Metriques** : ASR (Attack Success Rate) et Success@n (succes en au plus n essais) (Section 4.6, p. 49-50).

### Resultats cles

- **TAP > GCG** : 45.2% vs 25.2% ASR sur Qwen 3 4B (Chapter 5, p. 57). Le black-box surpasse le white-box, un resultat contre-intuitif explique par le gap de transfert.
- **GPT-5 resistant** : les attaques optimisees sur des modeles open-source plus petits echouent a se transferer a GPT-5 (Chapter 5, p. 57 ; Section 6.3.2, p. 79).
- **Attaques universelles competitives** : les attaques optimisees sur plusieurs taches simultanement atteignent des performances comparables aux attaques single-task tout en generalisant a des scenarios divers (Chapter 5 ; Section 6.2.1-6.2.2, p. 78).
- **Random search ~ GCG** : la recherche aleatoire match l'optimisation par gradient GCG, remettant en question la valeur ajoutee de l'information de gradient dans le contexte agent (Section 6.2.3, p. 78).
- **4 domaines** : workspace, banking, travel, slack -- le banking montre une vulnerabilite differentielle (Section 5.2.2, p. 57).

### Limitations admises par les auteurs

L'auteur reconnait (Chapter 6-7) : (1) le gap de transfert cross-modele (open-source vers GPT-5) reste un obstacle fondamental, (2) la tokenization inconsistante entre optimisation et deploiement degrade les attaques GCG, (3) l'evaluation est limitee a 3 modeles, (4) les defenses ne sont pas testees systematiquement.

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Lien glossaire AEGIS |
|----|---------|-------------------|----------------------|
| ASR agent | $$\text{ASR} = \frac{|\{(t,i) \in T \times I : \text{attack\_succeeds}(t,i)\}|}{|T \times I|}$$ | T = paires de taches, I = injections. Succes = execution non autorisee d'un appel d'outil | Standard, adapte au contexte agent |
| Success@n | $$\text{Success@n}(t) = \mathbb{1}[\exists i \leq n : \text{attack\_succeeds}(t,i)]$$ | Succes en au plus n tentatives pour la tache t | Variante agent |
| Universal | $$p^* = \arg\min_p \sum_{(t,s) \in \mathcal{D}} \mathcal{L}(p, t, s)$$ | Optimisation universelle sur l'ensemble des paires tache-contexte | Section 4.2.2 |

**Nature epistemique** : [EMPIRIQUE] — ASR mesure sur 80 paires de taches, pas de borne theorique de transferabilite.

---

## Section 3 — Critique methodologique

### Forces

1. **Rigueur experimentale** — 80 paires de taches, 4 domaines, 3 modeles, etudes d'ablation systematiques sur la structure d'injection (prefix/suffix) et le signal d'optimisation (gradient/random) (Chapter 4-5).
2. **Framework extensible** — l'extension d'AgentDojo pour le white-box est une contribution technique reutilisable.
3. **Resultat contre-intuitif solidement fonde** — TAP > GCG est un resultat important qui remet en question l'avantage du white-box dans le contexte agent.
4. **Validation de tokenization** — la decouverte que les inconsistances de tokenization degradent GCG est un insight technique original et pratique (Section 4.4, p. 30-37).
5. **Supervision academique de premier plan** — Florian Tramer (SPYLab, ETH Zurich) est une autorite reconnue en securite adversariale.

### Faiblesses

1. **These de MSc, pas publication peer-reviewed** — malgre la qualite, le statut editorial est inferieur a une publication en conference.
2. **3 modeles seulement** — Qwen 3 4B, Gemma 3 4B, GPT-5. L'absence de LLaMA, Mistral, Claude limite la generalisabilite.
3. **Pas de test de defenses** — les defenses (spotlighting, sandwich, CaMeL) sont mentionnees mais pas evaluees experimentalement contre les attaques automatisees.
4. **Modeles de taille modeste** — Qwen 3 4B et Gemma 3 4B sont de petits modeles. Le comportement sur des modeles 70B+ n'est pas evalue.
5. **Domaines non medicaux** — workspace, banking, travel, slack. Le domaine medical (contexte AEGIS) n'est pas couvert.
6. **Cout computationnel non rapporte** — le nombre de requetes API, le temps GPU pour GCG, et le cout total ne sont pas systematiquement documentes.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C2** (delta-3 necessaire) | FORT | Les agents avec outils executent des actions irreversibles ; delta-0 a delta-2 ne suffisent pas a empecher l'execution | Le contexte agent (tool calling) amplifie les consequences de l'injection |
| **C5** (agent-level surfaces) | FORT | Les surfaces d'attaque agents (outils, memoire, planification) sont qualitativement differentes du single-turn | TAP exploite le contexte multi-turn de l'agent pour iterer sur les injections |

### Couches delta

- **delta-0** : implicitement insuffisant (les modeles alignes executent des injections en contexte agent).
- **delta-1 (injection crafting)** : GCG et TAP operent a ce niveau en optimisant les payloads injectes.
- **delta-2 (multi-turn exploitation)** : les attaques universelles exploitent la structure multi-etape de l'agent.
- **delta-3 (validation formelle)** : non teste mais fortement implique. Le sandboxing des outils et l'isolation de la memoire sont des mecanismes delta-3 necessaires.

### Formules AEGIS impactees

- **Lien chaines d'attaque AEGIS** : les 36 chaines d'attaque AEGIS sont directement pertinentes. Le cadre GCG+TAP agent de P058 fournit une methodologie de benchmark pour evaluer la robustesse des chaines.
- **Lien moteur genetique** : le TAP (recherche arborescente iterative) est conceptuellement proche du moteur genetique AEGIS. La convergence TAP > GCG suggere que l'approche genetique (black-box, iterative) est superieure a l'optimisation par gradient pour les agents.

### Gap identifie

- **G-020** (RUN-003) : defenses specifiques aux agents non evaluees. Les mecanismes AEGIS de delta-3 (sandboxing, isolation memoire) doivent etre testes contre les attaques automatisees de P058.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P058 |
| **Type** | Attaque (automatisee, agent-level) |
| **Domaine** | Securite agents LLM, injection de prompt indirecte, optimisation adversariale |
| **Modeles testes** | Qwen 3 4B, Gemma 3 4B, GPT-5 |
| **Framework** | AgentDojo (Debenedetti et al.), 80 paires taches, 4 domaines |
| **Metrique principale** | TAP ASR 45.2% vs GCG ASR 25.2% sur Qwen 3 4B (Chapter 5, p. 57) |
| **delta-layers** | δ¹ (injection crafting), δ² (exploitation multi-turn agent) |
| **Conjectures** | C2 (fort), C5 (fort) |
| **Reproductibilite** | Haute — AgentDojo public, protocole detaille, code probable (these ETH) |
| **Code disponible** | Probable (these ETH, mention dans Appendix) |
| **Dataset public** | Oui (AgentDojo public) |
| **SVC pertinence** | 8/10 |
| **Tags** | [ARTICLE VERIFIE], GCG, TAP, AgentDojo, ETH Zurich, agent security, automated injection |
