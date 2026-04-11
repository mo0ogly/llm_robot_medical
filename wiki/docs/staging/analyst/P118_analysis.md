## [Gao, Ma, Lin, Callan, 2023] — Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)

**Reference :** arXiv:2212.10496v1 (20 Dec 2022), publie ACL 2023
**Revue/Conf :** ACL 2023 — CORE A*
**Lu le :** 2026-04-09
> **PDF Source**: [literature_for_rag/P118_gao_hyde_original.pdf](../../assets/pdfs/P118_gao_hyde_original.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (19 chunks dans aegis_bibliography)

### Abstract original
> "While dense retrieval has been shown effective and efficient across tasks and languages, it remains difficult to create effective fully zero-shot dense retrieval systems when no relevance label is available. In this paper, we recognize the difficulty of zero-shot learning and encoding relevance. Instead, we propose to pivot through Hypothetical Document Embeddings (HyDE). Given a query, HyDE first zero-shot instructs an instruction-following language model (e.g. InstructGPT) to generate a hypothetical document. The document captures relevance patterns but is unreal and may contain false details. Then, an unsupervised contrastively learned encoder (e.g. Contriever) encodes the document into an embedding vector. This vector identifies a neighborhood in the corpus embedding space, where similar real documents are retrieved based on vector similarity. This second step ground the generated document to the actual corpus, with the encoder's dense bottleneck filtering out the incorrect details."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme :** dense retrieval zero-shot impossible sans relevance labels : apprendre deux encoders (query, document) projetant dans un meme espace inner-product requiert de la supervision (Section 3.1, Eq. 1, p.3).
- **Methode :** HyDE decompose en (1) generation d'un document hypothetique via LLM instruction-following (InstructGPT), (2) encodage via encodeur contrastif Contriever, (3) recherche MIPS contre le corpus reel. Equation cle : `v_q+ = 1/(N+1) * [sum_k f(d_k) + f(q)]` (Eq. 8, p.4).
- **Donnees :** TREC DL19/DL20 (web search), 6 datasets BEIR low-resource (SciFact, Arguana, TREC-Covid, FiQA, DBPedia, TREC-News), Mr.Tydi multilingue (sw, ko, ja, bn). Contriever comme encodeur dense.
- **Resultat :** HyDE nDCG@10 = 61.3 sur DL19 vs Contriever seul = 44.5, BM25 = 50.6 ; comparable a ContrieverFT (62.1) supervise sur MS-MARCO (Table 1, p.5). Gains larges aussi en multilingue.
- **Limite :** "The generated document is not real, can and is likely to be ungrounded factually... may contain false details" — auteurs reconnaissent explicitement l'hallucination (Section 3.2, p.3-4). Ils esperent que "the encoder's dense bottleneck to serve a lossy compressor, where the extra (hallucinated) details are filtered out from the embedding" (Section 3.2, p.3). C'est la defense unique proposee et elle est non verifiee experimentalement dans le papier.

### Analyse critique
**Forces :**
- Simplicite architecturale : pas de fine-tuning, pas de relevance labels, deploiement immediat (Section 1 Introduction, p.1).
- Large evaluation : 11 query sets, 4 langues, 3 taches (web search, QA, fact verification), 3 backbones LLM (FLAN-T5 11b, Cohere 52b, GPT-175b) (Section 4, Tables 1-4, p.5-6).
- Formalisation claire : Equations 1-8 (Section 3, p.3-4) definissent precisement le pipeline ; chaque etape est identifiable pour analyse adversariale.
- Code open-source disponible : https://github.com/texttron/hyde (footnote 1, p.1).

**Faiblesses :**
- **Pas d'analyse de securite** : le mot "attack", "adversarial", "injection", "robustness" n'apparait jamais dans le papier. Le threat model n'est pas considere.
- **"Dense bottleneck filters false details" est une affirmation non verifiee** : les auteurs supposent (sans preuve formelle ni experience dediee) que l'encodeur Contriever elimine les details hallucines. Cette hypothese est CRITIQUE car elle fonde la legitimite du pipeline. Aucun test de sensibilite sur des documents volontairement incorrects.
- **Pas de distinction entre "hallucination benin" et "contenu trompeur semantiquement aligne"** : un document hypothetique qui contient "la FDA approuve le traitement X" a EXACTEMENT la meme signature semantique qu'un document reel FDA. Le bottleneck dense ne peut pas distinguer les deux — c'est le fondement de D-024.
- Pas d'etude sur requetes ambigues (reconnue en Section 3.2, p.3 : "left to future work").
- InstructGPT text-davinci-003 : modele closed-weight, date de 2022-2023 ; resultats non reproductibles fidelement en 2026.

**Questions ouvertes :**
- Que se passe-t-il si le document hypothetique contient du contenu adversarial semantiquement aligne au domaine cible ?
- Le bottleneck Contriever (dimension ~768) a-t-il capacite a filtrer des faits FABRIQUES mais cohérents ?
- HyDE est-il vulnerable a des requetes craftees pour induire des hallucinations specifiques (question centrale de D-024) ?

### Formules exactes
- Eq. 1 (Section 3.1, p.3) : `sim(q,d) = <enc_q(q), enc_d(d)> = <v_q, v_d>` — similarite inner-product standard.
- Eq. 5 (Section 3.2, p.4) : `E[v_q+] = E[f(g(q, INST))]` — esperance sur documents hypothetiques.
- Eq. 8 (Section 3.2, p.4) : `v_q+ = (1/(N+1)) * [sum_k=1^N f(d_k) + f(q)]` — combinaison query+documents hypothetiques.

Lien glossaire AEGIS : F-nouvelle (a creer) : "HyDE query vector equation" [ALGORITHME — pas de garantie formelle de filtrage d'hallucinations, confer Section 3.2, p.3-4].

### Pertinence these AEGIS — **LIEN AVEC D-024 (CRITIQUE, BASELINE)**
- **Couches delta :** δ¹ (retrieval layer). C'est le papier seminal definissant l'architecture que D-024 exploite.
- **Conjectures :** C2 (necessite δ³) — Gao et al. invoquent implicitement une defense par ancrage au corpus reel ("ground the generated document to the actual corpus"), mais cette defense est ELLE-MEME un mecanisme δ¹. Le papier DEMONTRE par absence que le modele n'a aucune protection intrinseque (niveau δ⁰/δ¹) contre des hallucinations semantiquement coherentes.
- **Gap adresse :** G-042 (defense HyDE). Ce papier CREE le gap : il propose HyDE sans jamais questionner la robustesse adversariale.
- **Relation a D-024 (BASELINE ABSOLUE) :**
  - P118 est le papier FONDATEUR de HyDE. Toute caracterisation de D-024 doit citer Gao et al. comme reference normative du pipeline.
  - Le point critique est la citation "may contain false details... encoder's dense bottleneck filtering out the incorrect details" (Section 3.2, p.3-4). D-024 est un CONTRE-EXEMPLE EXPLICITE a cette affirmation : on demontre experimentalement que le bottleneck ECHOUE quand l'hallucination est craftee pour etre semantiquement alignee au domaine medical.
  - Le chiffre de reference D-024 (96.7% ASR) doit etre compare aux gains de HyDE sur SciFact (nDCG@10 = 69.1 vs Contriever 64.9, Table 2 p.5) : le meme gain semantique qui profite au retrieval benin profite ALORS a l'attaque.
  - CITATION DIRECTE POUR D-024 : `(Gao et al., 2023, ACL, Section 3.2, p.3-4)` pour la claim de filtrage par dense bottleneck. Contre-exemple D-024 cite en regard.

### Citations cles
> "The document captures relevance patterns but is unreal and may contain false details." (Abstract, p.1)
> "we expect the encoder's dense bottleneck to serve a lossy compressor, where the extra (hallucinated) details are filtered out from the embedding" (Section 3.2, p.3)
> "The generated document is not real, can and is likely to be ungrounded factually" (Section 3.2, p.4)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 — seminal, baseline obligatoire |
| Reproductibilite | Moyenne — code open-source mais modeles (InstructGPT, Contriever) evolutifs |
| Code disponible | Oui — https://github.com/texttron/hyde |
| Dataset public | Oui — TREC DL, BEIR, Mr.Tydi |
| Nature epistemique | [ALGORITHME] — methode proposee, pas de garantie theorique de filtrage d'hallucinations |
