# P055: PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of Large Language Models
**Auteurs**: Wei Zou, Runpeng Geng (Pennsylvania State University), Binghui Wang (Illinois Institute of Technology), Jinyuan Jia (Pennsylvania State University)
**Venue**: USENIX Security 2025 (accepte), arXiv (preprint precedent)
> **PDF Source**: [literature_for_rag/P055_PoisonedRAG.pdf](../../literature_for_rag/P055_PoisonedRAG.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (104 chunks, ~92 000 caracteres)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Zou et al. presentent PoisonedRAG, la premiere attaque de corruption de connaissance contre les systemes RAG. L'attaquant injecte un petit nombre de textes malveillants dans la base de connaissances d'un systeme RAG pour forcer le LLM a generer une reponse choisie par l'attaquant pour une question cible. L'attaque est formulee comme un probleme d'optimisation avec deux variantes : black-box (sans acces au retriever ni au LLM) et white-box (acces complet). Le resultat principal est un ASR de 90% en n'injectant que 5 textes malveillants par question cible dans une base contenant des millions de textes (Abstract, p. 1).

### Methodologie

L'attaque est formulee comme un probleme d'optimisation en deux etapes (Section 4, p. 4-6). Etape 1 : crafter des textes malveillants qui seront recuperes par le retriever pour une question cible donnee. Etape 2 : s'assurer que le LLM genere la reponse souhaitee a partir de ces textes recuperes. En mode black-box, les auteurs utilisent la similarite cosine entre embeddings pour positionner les textes malveillants (sans connaitre l'embedder exact). En mode white-box, l'optimisation utilise directement les gradients du retriever.

L'evaluation est conduite sur trois datasets : Natural Questions (NQ), HotpotQA et MS-MARCO, avec une base Wikipedia de 21 millions de textes (dump du 20 decembre 2018) (Section 5 et 6.2, p. 7-9). Les modeles LLM cibles incluent GPT-3.5, GPT-4, PaLM 2, LLaMA-2 et Vicuna.

### Resultats cles

- **ASR global** : 90% avec seulement 5 textes malveillants par question, dans une base de millions de textes (Abstract, p. 1)
- **Wikipedia-scale** : sur une base de 21 015 324 textes, ASR black-box de 95% sur NQ, ASR white-box de 96% sur NQ (Table 11, Section 6.2)
- **Robustesse aux defenses** : les defenses testees (Knowledge Expansion, paraphrase detection) sont insuffisantes. Meme avec k=50 textes recuperes (dont seulement 10% malveillants), l'ASR reste a 41-43% sur HotpotQA (Section 7.4, p. 10)
- **Transferabilite** : fonctionne sur des RAG avances (Table 10, Section 6.1)
- **Code public** : https://github.com/sleeepeer/PoisonedRAG

### Limitations admises par les auteurs

Les auteurs reconnaissent que l'attaque necessite un acces en ecriture a la base de connaissances, ce qui est une hypothese forte. L'attaque cible des questions specifiques (pas un empoisonnement generalise). L'evaluation des defenses est limitee aux methodes basiques ; les auteurs appellent a des defenses plus sophistiquees.

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Lien glossaire AEGIS |
|----|---------|-------------------|----------------------|
| F49 | $$\text{PIR}(k) = \frac{|\{q \in Q : \text{top-}k(q) \cap V_{poison} \neq \emptyset\}|}{|Q|}$$ | Q = queries utilisateur, V_poison = vecteurs empoisonnes, k = nombre de textes recuperes | F49 (Persistent Injection Rate) |
| Optim | $$\min_{t_1,...,t_N} \sum_{i=1}^{N} -\text{sim}(e(t_i), e(q)) + \lambda \cdot \mathcal{L}_{LLM}(a^* | q, t_1,...,t_N)$$ | Probleme d'optimisation bi-objectif : proximite retriever + fidelite LLM | Derive |

**Variables** :
- $Q$ : ensemble des requetes utilisateur
- $V_{poison}$ : ensemble des vecteurs empoisonnes injectes
- $k$ : nombre de textes recuperes par le retriever (defaut k=5)
- $N$ : nombre de textes malveillants par question (N=5 dans les experiences principales)
- $e(\cdot)$ : fonction d'embedding du retriever
- $a^*$ : reponse cible de l'attaquant

**Nature epistemique** : [EMPIRIQUE] — ASR mesure experimentalement, pas de borne theorique sur le nombre minimal de textes necessaires ni de garantie de convergence.

---

## Section 3 — Critique methodologique

### Forces

1. **Premier resultat** — premiere attaque de corruption de connaissance specifiquement concue pour RAG, ouvrant un nouveau champ de recherche (Section 1, p. 1).
2. **Echelle realiste** — evaluation sur une base Wikipedia de 21 millions de textes, pas un toy example (Table 11, Section 6.2).
3. **Cout minimal** — seulement 5 textes malveillants suffisent pour 90% ASR, rendant l'attaque pratiquement realisable avec un acces limite en ecriture.
4. **Double setting** — les variantes black-box et white-box couvrent les cas realistes d'acces attaquant.
5. **Code public** — reproductibilite assuree via le repository GitHub.
6. **Evaluation des defenses** — les auteurs testent proactivement des defenses (Knowledge Expansion, paraphrase) et montrent leur insuffisance.

### Faiblesses

1. **Acces en ecriture requis** — l'hypothese que l'attaquant peut injecter des textes dans la base est forte. Dans un deploiement medical avec controle d'acces, cela presuppose une compromission prealable.
2. **Attaque ciblee, pas generalisee** — chaque question cible necessite 5 textes specifiques. L'empoisonnement a large spectre (toutes les questions) n'est pas evalue.
3. **Pas de test avec des defenses modernes** — les defenses testees sont basiques. Les approches de type RagSanitizer (AEGIS), GMTP (Kim et al., 2025), ou NeMo Guardrails ne sont pas evaluees.
4. **Modeles LLM anciens** — GPT-3.5, GPT-4, LLaMA-2, Vicuna. Pas de test sur les modeles 2025-2026.
5. **Persistance non mesuree temporellement** — la duree d'efficacite des textes empoisonnes dans une base avec des mises a jour regulieres n'est pas evaluee.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C2** (delta-3 necessaire) | CRITIQUE | ASR 90% avec 5 textes ; defenses basiques insuffisantes | La couche RAG (delta-2) est directement vulnerable ; seule une validation formelle des sorties (delta-3) peut detecter des reponses corrompues |
| **C5** (cosine insuffisante) | FORT | L'attaque positionne les textes malveillants par similarite cosine, exploitant precisement la metrique de retrieval | La cosine similarity est utilisee COMME vecteur d'attaque, pas comme defense |
| **C7** (persistance) | FORT | Les textes empoisonnes persistent indefiniment dans la base vectorielle | Different de P054 (PIDP) qui cible une session ; P055 demontre la persistance permanente |

### Couches delta

- **delta-0** : non applicable directement (l'attaque cible le RAG, pas l'alignement RLHF).
- **delta-1** : non applicable.
- **delta-2 (RAG)** : couche directement attaquee. La recuperation de textes malveillants dans le contexte du LLM est le vecteur principal.
- **delta-3 (validation formelle)** : necessaire. Le LLM genere une reponse factuellement incorrecte que seule une verification externe peut detecter.

### Formules AEGIS impactees

- **F49 (PIR)** : directement definie dans le cadre PoisonedRAG. La valeur PIR(5) ~= 0.90 constitue le seuil de reference pour la corruption RAG.
- **Lien RagSanitizer** : le RagSanitizer AEGIS (15 detecteurs) est precisement concu pour detecter les textes malveillants recuperes avant injection dans le prompt LLM. P055 fournit la baseline d'attaque la plus pertinente pour tester l'efficacite du RagSanitizer.
- **Gap G-017** (RUN-003) : RagSanitizer vs PoisonedRAG compound attacks (P054+P055) non teste.

### Decouverte D-001 (Triple Convergence)

P055 renforce D-001 par la dimension de persistance : les textes empoisonnes survivent aux mises a jour du modele, aux changements de prompt systeme et aux ameliorations du RagSanitizer. C'est une attaque sur l'infrastructure, pas sur le modele -- ce qui la rend independante des ameliorations delta-0 et delta-1.

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P055 |
| **Type** | Attaque (RAG poisoning) |
| **Domaine** | Securite RAG, corruption de connaissance, injection de prompt indirecte |
| **Modeles testes** | GPT-3.5, GPT-4, PaLM 2, LLaMA-2-7B/13B, Vicuna-7B/13B |
| **Datasets** | NQ, HotpotQA, MS-MARCO, Wikipedia dump 21M textes |
| **Metrique principale** | ASR 90% avec N=5 textes malveillants (Abstract, p. 1) ; 95% sur Wikipedia-scale NQ (Table 11) |
| **delta-layers** | δ² (RAG/retrieval), δ³ (validation necessite) |
| **Conjectures** | C2 (critique), C5 (fort), C7 (fort) |
| **Reproductibilite** | Haute — code public (GitHub), datasets publics, protocole detaille |
| **Code disponible** | Oui — https://github.com/sleeepeer/PoisonedRAG |
| **Dataset public** | Oui (NQ, HotpotQA, MS-MARCO, Wikipedia) |
| **SVC pertinence** | 8/10 |
| **Tags** | [ARTICLE VERIFIE], PoisonedRAG, RAG poisoning, knowledge corruption, USENIX Security 2025 |
