# P015: Reasoning before Comparison: LLM-Enhanced Semantic Similarity Metrics for Domain Specialized Text Analysis
**Auteurs**: Shaochen Xu, Zihao Wu, Huaqin Zhao, Peng Shu, Zhengliang Liu, Wenxiong Liao, Sheng Li, Andrea Sikora, Tianming Liu, Xiang Li (U. Georgia, Harvard Medical School, U. Virginia)
**Venue**: arXiv preprint, fevrier 2024
> **PDF Source**: [literature_for_rag/P015_llm_similarity.pdf](../../literature_for_rag/P015_llm_similarity.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (58 chunks)

**Reference** : arXiv:2402.11398v2 [cs.CL]
**Nature** : [ALGORITHME] — framework utilisant GPT-4 pour generer des labels semantiques comme proxy de similarite medicale

---

## Section 1 — Resume critique

### Abstract original
> In this study, we leverage LLM to enhance the semantic analysis and develop similarity metrics for texts, addressing the limitations of traditional unsupervised NLP metrics like ROUGE and BLEU. We develop a framework where LLMs such as GPT-4 are employed for zero-shot text identification and label generation for radiology reports, where the labels are then used as measurements for text similarity. By testing the proposed framework on the MIMIC data, we find that GPT-4 generated labels can significantly improve the semantic similarity assessment, with scores more closely aligned with clinical ground truth than traditional NLP metrics. Our work demonstrates the possibility of conducting semantic analysis of the text data using semi-quantitative reasoning results by the LLMs for highly specialized domains. While the framework is implemented for radiology report similarity analysis, its concept can be extended to other specialized domains as well.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** ROUGE et BLEU sont insuffisants pour comparer des textes medicaux car ils ne capturent que la similarite lexicale, pas la semantique clinique (Section 1, p.1)
- **Methode :** GPT-4 genere des labels categoriques (findings, indications, technique, etc.) pour chaque rapport radiologique, puis la cosine similarity est calculee sur les embeddings des labels via all-mpnet-base-v2 (Sections 3.1-3.4, p.2-4 ; Figure 1, p.3)
- **Donnees :** MIMIC-CXR dataset, 500 rapports radiologiques, 62 500 comparaisons par paires (Section 4.1, p.4-5)
- **Resultat :** Les labels GPT-4 produisent des similarites plus proches de la verite terrain (CheXpert/NegBio) que les metriques lexicales traditionnelles (Section 4, p.4-5)
- **Limite :** Pipeline dependant de GPT-4 (proprietaire, non reproductible) ; pas de quantification precise de l'amelioration ; approche human-in-the-loop requise (Section 3, p.2-4)

### Analyse critique

**Forces :**
1. **Domaine medical direct** — utilisation de MIMIC-CXR avec verite terrain CheXpert/NegBio (Section 4.1, p.4). Rare dans le corpus AEGIS.
2. **Approche "reasoning before comparison"** — transforme un texte non-structure en labels structures avant de mesurer la similarite, contournant les limitations de la cosine directe.
3. **Principes XAI** — les labels generes sont interpretables par les cliniciens (Section 3.3, p.3-4).
4. **Pipeline generalisable** — le concept s'etend a d'autres domaines specialises (Legal, Finance).

**Faiblesses :**
1. **Pas de metriques quantitatives precises** — le papier ne rapporte pas de coefficients de correlation (tau, r, rho) entre les similarites GPT-4 et la verite terrain. Les resultats sont decrits qualitativement.
2. **Dependance a GPT-4** — modele proprietaire, non reproductible, sujet a des mises a jour silencieuses.
3. **Pas de comparaison avec BERTScore ou SemScore** — les baselines sont ROUGE et BLEU uniquement, pas les metriques embedding-based modernes.
4. **Pipeline multi-etapes non evalue end-to-end** — chaque etape introduit des erreurs sans propagation d'incertitude.
5. **N = 500 rapports** — taille raisonnable mais les 62 500 comparaisons ne sont pas independantes (rapports reutilises).
6. **Pas de test adversarial** — que se passe-t-il si un rapport est empoisonne ?

**Questions ouvertes :**
- L'approche "label first, compare second" peut-elle detecter des manipulations dans les rapports medicaux generes par LLM ?
- Un attaquant pourrait-il manipuler les labels GPT-4 pour dissimuler des differences cliniques significatives ?

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Ref papier | Lien glossaire AEGIS |
|----|---------|-------------------|------------|---------------------|
| Pipeline | GPT-4(rapport) -> labels -> Emb(labels) -> cosSim | Pipeline complete | Figure 1, p.3 ; Figure 2, p.5 | F22 (cosine drift) |
| GT | $\text{cosSim}(\text{vec}(CheXpert_A), \text{vec}(CheXpert_B))$ | Verite terrain basee sur labels CheXpert/NegBio | Section 4.3, p.5 | — |
| Pred | $\text{cosSim}(\text{Emb}(labels_{GPT4}^A), \text{Emb}(labels_{GPT4}^B))$ | Similarite predite via labels GPT-4 | Section 4.4, p.5-6 | — |

**Modele d'embedding** : all-mpnet-base-v2 (Section 4.4, p.5)
**Encodage verite terrain** : vecteur 4 valeurs {1.0, 0.0, -1.0, -2.0} pour {positif, negatif, incertain, absent} (Section 4.3, p.5)

---

## Section 3 — Critique methodologique

### Qualification epistemique
Le papier est un **algorithme** (pipeline) sans garantie formelle. L'evaluation est qualitative plutot que quantitative, ce qui est une faiblesse majeure pour une publication. L'absence de metriques de correlation numeriques (Kendall tau, Pearson r) empeche toute comparaison rigoureuse avec P014 (SemScore).

### Reproductibilite
| Question | Reponse | Impact |
|----------|---------|--------|
| Modele accessible ? | GPT-4 (API, proprietaire) | Non reproductible exactement |
| Dataset public ? | MIMIC-CXR (acces restreint) | Acces par PhysioNet |
| Prompts publies ? | Decrits mais pas complets | Reproduction approximative |
| Code fourni ? | Non mentionne | Non reproductible |

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C5** (cosine insuffisante) | FORT | Montre que cosine directe sur texte medical est inadaptee | Les metriques lexicales echouent ; la mediation par labels ameliore la pertinence clinique. |
| **C6** (domaine medical plus vulnerable) | MODERE | Pipeline medical specifique necessaire | Les textes medicaux ont des besoins de similarite specifiques non couverts par les metriques generiques. |

### Couches delta
- **delta-2** : l'approche "label first, compare second" pourrait enrichir delta-2 dans AEGIS en ajoutant une couche d'abstraction semantique avant la comparaison.
- **delta-3** : NON — pipeline heuristique sans garantie.

### Mapping AEGIS
- L'approche de label generation est conceptuellement liee au SVC score d'AEGIS, ou la sortie du LLM est evaluee sur plusieurs dimensions semantiques.

### Gaps adresses/crees
- **G-004** (CHER non integre) : P015 montre une approche alternative aux metriques monodimensionnelles, complementaire a CHER (P035).

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P015 |
| **Type** | Algorithme (pipeline de similarite medicale) |
| **Domaine** | Radiologie, similarite textuelle medicale |
| **Modeles testes** | GPT-4 (generation labels), all-mpnet-base-v2 (embeddings) |
| **Metrique principale** | Similarite labels GPT-4 vs. verite terrain CheXpert (qualitative) |
| **delta-layers** | delta-2 (enrichissement potentiel) |
| **Conjectures** | C5 (fort), C6 (modere) |
| **SVC pertinence** | 5/10 |
| **Reproductibilite** | Faible — GPT-4 proprietaire, pas de code |
| **Code disponible** | Non |
| **Dataset public** | MIMIC-CXR (acces restreint PhysioNet) |
| **Tags** | [PREPRINT], medical, radiologie, GPT-4, label generation, cosine similarity, MIMIC |
