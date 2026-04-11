# P015 : Reasoning before Comparison -- LLM-Enhanced Semantic Similarity Metrics for Domain Specialized Text Analysis

## [Xu et al., 2024] -- Reasoning before Comparison: LLM-Enhanced Semantic Similarity Metrics for Domain Specialized Text Analysis

**Reference :** arXiv:2402.11398v2 [cs.CL]
**Revue/Conf :** arXiv preprint, University of Georgia / Harvard Medical School / University of Virginia, fevrier 2024
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P015_llm_similarity.pdf](../../assets/pdfs/P015_llm_similarity.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (58 chunks). Non publie en conference peer-reviewed.

### Abstract original
> In this study, we leverage LLM to enhance the semantic analysis and develop similarity metrics for texts, addressing the limitations of traditional unsupervised NLP metrics like ROUGE and BLEU. We develop a framework where LLMs such as GPT-4 are employed for zero-shot text identification and label generation for radiology reports, where the labels are then used as measurements for text similarity. By testing the proposed framework on the MIMIC data, we find that GPT-4 generated labels can significantly improve the semantic similarity assessment, with scores more closely aligned with clinical ground truth than traditional NLP metrics. Our work demonstrates the possibility of conducting semantic analysis of the text data using semi-quantitative reasoning results by the LLMs for highly specialized domains. While the framework is implemented for radiology report similarity analysis, its concept can be extended to other specialized domains as well.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** ROUGE et BLEU sont insuffisants pour comparer des textes medicaux car ils ne capturent que la similarite lexicale, pas la semantique clinique (Xu et al., 2024, Section 1, p. 1)
- **Methode :** Pipeline "reasoning before comparison" : GPT-4 genere des labels categoriques (findings, indications, technique, etc.) pour chaque rapport radiologique, puis la cosine similarity est calculee sur les embeddings des labels via all-mpnet-base-v2 (Xu et al., 2024, Sections 3.1-3.4, p. 2-4 ; Figure 1, p. 3 ; Figure 2, p. 5)
- **Donnees :** MIMIC-CXR dataset, 500 rapports radiologiques generes aleatoirement, 62 500 comparaisons par paires ; verite terrain via CheXpert et NegBio avec encodage vectoriel a 4 valeurs {1.0, 0.0, -1.0, -2.0} pour {positif, negatif, incertain, absent} (Xu et al., 2024, Section 4.1, p. 4-5 ; Section 4.3, p. 5)
- **Resultat :** Les labels GPT-4 produisent des similarites plus proches de la verite terrain CheXpert/NegBio que les metriques lexicales traditionnelles (ROUGE, BLEU). Le papier ne rapporte pas de coefficients de correlation numeriques exacts (tau, r, rho) -- les resultats sont decrits qualitativement et visuellement (Xu et al., 2024, Section 5, p. 6-7)
- **Limite :** Dependance a GPT-4 (proprietaire, non reproductible exactement) ; pas de metriques quantitatives precises de correlation ; pipeline multi-etapes sans propagation d'incertitude (Xu et al., 2024, Sections 3-5)

### Analyse critique

**Forces :**

1. **Domaine medical direct avec verite terrain clinique.** Le papier utilise MIMIC-CXR avec verite terrain CheXpert/NegBio -- un standard clinique reconnu pour l'annotation de rapports radiologiques. C'est l'un des rares papiers du corpus AEGIS a travailler directement avec des donnees medicales reelles et des annotations cliniques validees (Xu et al., 2024, Section 4.1, p. 4 ; Section 4.3, p. 5).

2. **Approche "reasoning before comparison".** L'idee de transformer un texte non-structure en labels structures avant de mesurer la similarite contourne les limitations connues de la cosine directe sur texte brut. En intercalant une etape de raisonnement (GPT-4 extrait findings, indications, technique), le pipeline capture la semantique clinique que les metriques lexicales manquent (Xu et al., 2024, Sections 3.1-3.4, p. 2-4 ; Figure 1, p. 3).

3. **Principes XAI.** Les labels generes par GPT-4 sont interpretables par les cliniciens : chaque rapport est decompose en categories cliniques explicites (findings, indications, technique, comparison). Cela facilite l'auditabilite du pipeline (Xu et al., 2024, Section 3.3, p. 3-4).

4. **Generalisabilite conceptuelle.** Bien qu'implemente pour la radiologie, le concept "label first, compare second" s'etend a d'autres domaines specialises (legal, finance, pharmacologie). Le pipeline est modulaire : chaque etape (label generation, embedding, comparison) peut etre remplacee independamment.

**Faiblesses :**

1. **Absence de metriques quantitatives precises.** C'est la faiblesse principale. Le papier ne rapporte aucun coefficient de correlation numerique (Kendall tau, Pearson r, Spearman rho) entre les similarites GPT-4 et la verite terrain. Les resultats sont presentes qualitativement ("more closely aligned") et visuellement (distributions de differences). Pour une these doctorale, cela rend impossible toute comparaison rigoureuse avec P014 (SemScore : tau=0.879, r=0.970).

2. **Dependance a GPT-4.** Le modele proprietaire GPT-4 est sujet a des mises a jour silencieuses (versions, comportement, filtres). La reproductibilite exacte est impossible. De plus, le cout API pour 500 rapports x multiple categories n'est pas rapporte.

3. **Pas de comparaison avec metriques embedding-based modernes.** Les baselines sont ROUGE et BLEU uniquement. BERTScore, SemScore (P014), et d'autres metriques embedding-based modernes ne sont pas evaluees. C'est une lacune critique puisque l'approche repose elle-meme sur des embeddings (all-mpnet-base-v2).

4. **Pipeline multi-etapes non evalue end-to-end.** Chaque etape (extraction GPT-4, embedding, comparaison cosine) introduit des erreurs. Aucune propagation d'incertitude n'est proposee. L'erreur cumulative du pipeline n'est pas quantifiee.

5. **62 500 comparaisons non-independantes.** Les 62 500 paires proviennent de 500 rapports (chaque rapport est compare a tous les autres). Les paires partagent des rapports, violant l'hypothese d'independance. Aucune correction statistique n'est appliquee.

6. **Pas de test adversarial.** Comment le pipeline reagit-il face a un rapport radiologique empoisonne (contenu malveillant insere) ? Les labels GPT-4 pourraient etre manipules par un rapport soigneusement forge.

**Questions ouvertes :**
- L'approche "label first, compare second" peut-elle detecter des manipulations dans les rapports medicaux generes par LLM ?
- Un attaquant pourrait-il manipuler les labels GPT-4 pour dissimuler des differences cliniques significatives ?
- Un modele open-source (Llama-3, Mistral) peut-il remplacer GPT-4 pour la generation de labels sans perte de qualite ?

### Formules exactes

**Pipeline complet** (Xu et al., 2024, Figure 1, p. 3 ; Figure 2, p. 5) :
```
Rapport -> GPT-4(rapport) -> labels categoriques -> Emb(labels) via all-mpnet-base-v2 -> cosSim
```

**Verite terrain** (Xu et al., 2024, Section 4.3, p. 5) :
```
GT_sim(A, B) = cosSim(vec(CheXpert_A), vec(CheXpert_B))
```
ou `vec()` encode les labels CheXpert/NegBio en vecteur a 4 valeurs : {1.0 = positif, 0.0 = negatif, -1.0 = incertain, -2.0 = absent}

**Similarite predite** (Xu et al., 2024, Section 4.4, p. 5-6) :
```
Pred_sim(A, B) = cosSim(Emb(labels_GPT4_A), Emb(labels_GPT4_B))
```

**Modele d'embedding** : all-mpnet-base-v2 (Xu et al., 2024, Section 4.4, p. 5) -- identique a P014 (SemScore).

Lien glossaire AEGIS : F22 (cosine drift -- la cosine ici mesure la similarite clinique plutot que la derive), lie au concept de validation semantique post-inference dans AEGIS

### Pertinence these AEGIS

- **Couches delta :** δ² (l'approche "label first, compare second" pourrait enrichir δ² dans AEGIS en ajoutant une couche d'abstraction semantique avant la comparaison de sortie -- validating clinical accuracy of LLM outputs) ; δ³ (NON -- pipeline heuristique sans aucune garantie formelle)
- **Conjectures :**
  - C5 (cosine insuffisante) : **fortement supportee** -- le papier demontre que la cosine directe sur texte medical est inadaptee, necessitant une mediation par labels pour capturer la semantique clinique. La cosine sur texte brut manque les nuances medicales (Xu et al., 2024, Section 4, p. 4-5)
  - C6 (domaine medical plus vulnerable) : **moderement supportee** -- le besoin d'un pipeline medical specifique confirme que les metriques generiques sont insuffisantes pour le domaine medical. Les textes medicaux ont des besoins de similarite semantique non couverts par les metriques standard.
- **Decouvertes :**
  - D-014 (cosine comme proxy de qualite) : **nuancee** -- la cosine fonctionne SI elle est precedee d'une etape de structuration (labels). La cosine brute est insuffisante en domaine medical.
- **Gaps :**
  - G-004 (metriques medicales non integrees) : **partiellement adresse** -- P015 montre une approche alternative aux metriques monodimensionnelles, complementaire au CHER de P035 (Lee et al., 2025)
  - G-010 (cosine en regime adversarial) : **non adresse** -- aucun test adversarial
- **Mapping templates AEGIS :** L'approche de label generation est conceptuellement liee au SVC score d'AEGIS (6 dimensions) : la sortie du LLM est evaluee sur plusieurs dimensions semantiques structurees. Le pipeline pourrait etre adapte pour verifier la coherence clinique des reponses post-injection.

### Citations cles
> "GPT-4 generated labels can significantly improve the semantic similarity assessment, with scores more closely aligned with clinical ground truth than traditional NLP metrics" (Xu et al., 2024, Abstract, p. 1)
> "traditional NLP metrics like ROUGE and BLEU [...] addressing the limitations" (Xu et al., 2024, Abstract, p. 1)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 5/10 |
| Reproductibilite | Faible -- GPT-4 proprietaire et non reproductible exactement, pas de code public, MIMIC-CXR a acces restreint via PhysioNet, prompts GPT-4 decrits mais pas complets |
| Code disponible | Non mentionne |
| Dataset public | Partiel -- MIMIC-CXR accessible via PhysioNet (acces restreint, accord ethique requis) |
| Nature epistemique | [ALGORITHME] -- pipeline de similarite medicale avec evaluation qualitative, sans garantie formelle ni metriques de correlation quantitatives precises |
