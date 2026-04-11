## [Pathmanathan et al., 2025] — RAGPart & RAGMask : Defenses au niveau retrieval contre l'empoisonnement de corpus RAG par partitionnement et masquage de tokens

**Reference :** arXiv:2512.24268
**Revue/Conf :** AAAI 2026 Workshop on New Frontiers in Information Retrieval (Oral) [PREPRINT]
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P064_Pathmanathan_2025_RAGPart.pdf](../../assets/pdfs/P064_Pathmanathan_2025_RAGPart.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (52 chunks). Workshop AAAI, non conference principale.

### Abstract original
> Retrieval-Augmented Generation (RAG) has emerged as a promising paradigm to enhance large language models (LLMs) with external knowledge, reducing hallucinations and compensating for outdated information. However, recent studies have shown that RAG is vulnerable to corpus poisoning attacks. We propose RAGPart and RAGMask, two retrieval-stage defenses. RAGPart leverages the inherent training dynamics of dense retrievers, exploiting document partitioning to mitigate the effect of poisoned points. In contrast, RAGMask identifies suspicious tokens based on significant similarity shifts under targeted token masking. Across two benchmarks, four poisoning strategies, and four state-of-the-art retrievers, our defenses consistently reduce attack success rates while preserving retrieval utility.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les attaques par empoisonnement de corpus exploitent des tokens adversariaux qui maximisent la similarite avec les requetes cibles. Les defenses existantes (paraphrase, perplexite) sont insuffisantes contre les attaques interpretables (Query-as-Poison, AdvBDGen) (Pathmanathan et al., 2025, Section 1, p.1-2).
- **Methode :** RAGPart partitionne chaque document en N fragments, embed chacun separement, puis agrege (C(N,k) combinaisons moyennees) pour diluer l'influence des tokens empoisonnes. RAGMask masque iterativement les tokens, detecte ceux causant une forte baisse de similarite, les retire, puis re-rank (Section 3.1-3.2, Figures 1-3).
- **Donnees :** 2 datasets (NQ 2.68M docs, FIQA 57.6K docs), 4 retrievers (Contriever, ANCE, Multilingual-E5, GTE-Large), 4 attaques (HotFlip, HotFlip spread-out, Query-as-Poison, AdvBDGen) (Section 4, p.7-8).
- **Resultat :** RAGPart reduit l'ASR de 40-80% sur HotFlip (Figure 8, p.9). RAGMask offre meilleure preservation de l'utilite (SR) avec robustesse comparable (Figure 7, p.9). Les deux surpassent les baselines paraphrase et perplexite, surtout contre les attaques interpretables (Section 4, p.9-10).
- **Limite :** RAGPart augmente la complexite computationnelle de O(D*C(N,k)*k*R) vs O(D*R) pour l'embedding naif (Section 4, Computational efficiency, p.10). RAGMask necessite alpha*p operations de masquage par requete (Section 3.2, p.6).

### Analyse critique
**Forces :**
- Garantie formelle partielle : conditions suffisantes de robustesse derivees mathematiquement pour RAGPart (Tables 2-5, Appendix). Si x < (1/2)*C(N,k) fragments empoisonnes, le vote majoritaire est robuste (Section 6.1, p.12). [THEOREME partiel]
- Evaluation sur 4 retrievers differents (y compris multilingual et GTE-Large), offrant une bonne couverture architecturale.
- RAGMask offre un compromis pratique : legere perte d'utilite (~5-10% SR drop) pour une forte reduction d'ASR, specialement contre les attaques interpretables ou la perplexite echoue (Figure 8, p.9).
- Les deux methodes n'alterent pas le modele generateur : defenses "plug-and-play" au niveau retrieval.

**Faiblesses :**
- Venue : workshop AAAI, non conference principale. Les resultats n'ont pas subi le processus de review complet d'une conference A*.
- RAGPart a un cout computationnel prohibitif pour de grands N : C(N,k) croit combinatoirement. L'exemple Section 6.2 montre que pour N=5,k=3, le cout est 6.67x le baseline. Pour N=10,k=3, ce serait 120x.
- Les resultats sont presentes comme moyennes sur 4 retrievers (Section 4) sans details par retriever dans le corps principal — les performances individuelles pourraient masquer des disparites.
- Pas de test sur des LLM generateurs (evaluation retrieval-only : ASR et SR au niveau retrieval, pas au niveau generation). L'impact reel sur les reponses du LLM n'est pas mesure.

**Questions ouvertes :**
- RAGMask peut-il etre combine avec GMTP (P061) pour exploiter a la fois le gradient et le masquage ?
- Performance sur des corpus de grande taille (>10M docs) avec des requetes open-ended ?
- Comment les attaques adaptatives (optimisant simultanment la robustesse au partitionnement) affectent RAGPart ?

### Formules exactes
- **Condition de robustesse RAGPart** (Section 6.1, p.12) : x < (1/2) * C(N,k), ou x = C(N,k) - C(N-n_p,k) - n_p * C(N-n_p,k-1) pour n_p fragments empoisonnes.
- **Condition naive baseline** (Section 6.1, p.12) : x = C(N,k) - C(N-n_p,k), beaucoup plus de combinaisons empoisonnees.
- **Complexite RAGPart** (Section 6.2, p.14) : FLOPs_RAGPart = D*N*R + D*C(N,k)*(k*n_e)
- **Complexite naive** (Section 6.2, p.14) : FLOPs_naive = D*C(N,k)*(k*R)
- Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M)), F68 (condition robustesse partitionnement — nouveau)

### Pertinence these AEGIS
- **Couches delta :** δ¹ (defense retrieval-stage). RAGPart = defense structurelle (partitionnement), RAGMask = defense par detection de tokens suspects. Les deux renforcent δ¹ sans toucher δ⁰ ni δ³.
- **Conjectures :**
  - C2 (necessite de δ³) : SUPPORTEE — meme avec RAGPart + RAGMask, l'ASR n'est pas reduite a 0. Les attaques interpretables (Query-as-Poison) passent partiellement les defenses (Figure 8).
  - C5 (cosine similarity insuffisante) : SUPPORTEE — RAGMask exploite le fait que les tokens adversariaux contribuent de maniere disproportionnee a la similarite cosine.
- **Decouvertes :**
  - D-006 (RAG comme surface d'attaque) : CONFIRMEE.
  - D-012 (defenses composites necessaires) : CONFIRMEE — RAGPart et RAGMask couvrent des cas differents (gradient-based vs interpretable attacks).
- **Gaps :**
  - G-014 (defense RAG formelle) : AVANCE — conditions suffisantes derivees formellement (Tables 2-5).
  - G-024 (cout computationnel defense RAG) : CREE — le trade-off robustesse/cout de RAGPart est un probleme ouvert pour les corpus de grande taille.
- **Mapping templates AEGIS :** #54-#62 (RAG poisoning), #85-#90 (IPI)

### Citations cles
> "RAGPart a practical defense" (Section 4, p.9)
> "RAGMask performs slightly better [in utility]" (Figure 7, p.9)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Moyenne — datasets standards mais pas de code public, certains details en appendice |
| Code disponible | Non (pas mentionne) |
| Dataset public | Oui (NQ, FIQA) |

### Classification AEGIS
- **Type d'attaque etudiee** : IPI (corpus poisoning — 4 strategies)
- **Surface ciblee** : RAG retrieval phase (document embeddings)
- **Modeles testes** : Contriever, ANCE, Multilingual-E5, GTE-Large (retrievers)
- **Defense evaluee** : RAGPart (partitionnement + vote) + RAGMask (masquage + re-ranking) — methodes proposees
- **MITRE ATLAS** : AML.T0051.002 (Indirect Prompt Injection via RAG)
- **OWASP LLM** : LLM06 (Excessive Agency via poisoned retrieval)
