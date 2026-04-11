## [Dekel, Tennenholtz & Kurland, 2026] — Addressing Corpus Knowledge Poisoning Attacks on RAG Using Sparse Attention

**Reference :** arXiv:2602.04711v2
**Revue/Conf :** Preprint (Technion, soumis), fevrier 2026
**Lu le :** 2026-04-08
> **PDF Source**: [literature_for_rag/P113_sparse_attention_rag.pdf](../../assets/pdfs/P113_sparse_attention_rag.pdf)
> **Statut**: [PREPRINT] — lu en texte complet via ChromaDB (126 chunks)

### Abstract original
> Retrieval Augmented Generation (RAG) is a highly effective paradigm for keeping LLM-based responses up-to-date and reducing the likelihood of hallucinations. Yet, RAG was recently shown to be quite vulnerable to corpus knowledge poisoning: an attacker injects misleading documents to the corpus to steer an LLM's output to an undesired response. We argue that the standard causal attention mechanism in LLMs enables harmful cross-document interactions, specifically in cases of attacks. Accordingly, we introduce a novel defense approach for RAG: Sparse Document Attention RAG (SDAG). This is a block-sparse attention mechanism that disallows cross-attention between retrieved documents. SDAG requires a minimal inference-time change to the attention mask; furthermore, no fine-tuning or additional architectural changes are needed. We present an empirical evaluation of LLM-based question answering (QA) with a variety of attack strategies on RAG. We show that our SDAG method substantially outperforms the standard causal attention mechanism in terms of attack success rate. We further demonstrate the clear merits of integrating SDAG with state-of-the-art RAG defense methods. Specifically, the integration results in performance that is statistically significantly better than the state-of-the-art.
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** L'attention causale standard dans les LLMs decoder-only permet aux documents adversaires d'influencer les representations des documents benins via cross-attention, facilitant le corpus knowledge poisoning dans les systemes RAG.
- **Methode :** Sparse Document Attention RAG (SDAG) — masque d'attention block-sparse a l'inference qui interdit la cross-attention entre documents recuperes ; integrable avec des defenses existantes (RAGDefender, Discern&Answer) sans finetuning. (Section 4)
- **Donnees :** 3 datasets QA (HotpotQA, TriviaQA, NQ), 1000 questions par dataset ; 3 generateurs (Llama-8B, Qwen-7B, Mistral-7B) + Llama-70B + Qwen3-8B reasoning ; 3 retrievers (E5, Contriever, BM25) ; attaques PoisonedRAG via GPT-4o. (Section 5)
- **Resultat :** SDAG reduit l'ASR de maniere statistiquement significative (p <= 0.05) dans la quasi-totalite des comparaisons : par exemple sur NQ avec Llama-E5, k=5, ASR passe de 0.41 (CARG) a 0.17 (SDAG) (Table 1, p.6) ; SDAG surpasse RAGDefender et Discern&Answer en single-document et etablit un nouvel etat de l'art en combinaison pour multi-document (Table 3, p.7).
- **Limite :** Restreint aux modeles open-source (acces au masque d'attention necessaire) ; evalue sur QA uniquement (pas de generation longue) ; les attaques sont generees par PoisonedRAG et non des attaques reelles. (Section 4, implicite)

### Analyse critique

**Forces :**
- L'insight fondamental est elegant : la cross-attention entre documents est le mecanisme par lequel le poisoning se propage, et le bloquer est une defense a cout quasi-nul (modification du masque d'attention seulement). (Section 4, p.4)
- Evaluation experimentale tres rigoureuse : 3 generateurs x 3 retrievers x 3 datasets x 2 valeurs de k, avec tests statistiques (paired t-test, p <= 0.05) et marquage de significativite. (Table 1, p.6)
- Analyse originale du positionnement spatial des documents adversaires dans l'espace d'embedding (Near vs Far vs Random strategies) — montre que les documents proches du centroide benin sont plus dangereux. (Section 6.2, Table 2, p.6 ; Table 4, p.8)
- Analyse "dominant set" qui explique POURQUOI SDAG fonctionne : il oriente la generation vers le sous-ensemble majoritaire de documents corrects. (Table 5, p.8)
- Compatible avec toute defense pre-generation existante (RAGDefender, Discern&Answer) sans modification. (Table 3, p.7)
- Code public disponible.

**Faiblesses :**
- SDAG ne fonctionne qu'avec des modeles open-source (acces au masque d'attention) — pas applicable a GPT-4, Claude via API. (Section 5.1, p.4)
- Pas de mesure de l'impact sur la qualite de reponse en l'absence d'attaque (le gain en accuracy sous attaque est demontre, mais l'overhead sur les reponses normales n'est pas systematiquement mesure).
- Les attaques sont toutes generees par PoisonedRAG (Zou et al., 2025) — pas de diversite dans les methodes d'attaque. Les attaques plus sophistiquees (joint optimization comme dans P111) ne sont pas testees.
- Les datasets (HotpotQA, TriviaQA, NQ) sont des benchmarks QA standard — pas de corpus medical ou specialise.

**Questions ouvertes :**
- SDAG resiste-t-il a des attaques qui exploitent explicitement l'absence de cross-attention (par ex., documents adversaires auto-suffisants) ?
- Impact de SDAG sur les taches multi-hop complexes ou la cross-attention entre documents est necessaire ?
- Comportement avec des modeles tres grands (>70B) ou des modeles reasoning (QwQ, o1) ?

### Formules exactes

**Masque d'attention SDAG** (Section 4, p.4) :
A_{r,c} = 1 si (c in B_T ou r in B_C) et r >= c
A_{r,c} = 1 si il existe i in {1,...,k}, r,c in B_i et r >= c
A_{r,c} = 0 sinon

Lien glossaire AEGIS : F22 (ASR)

### Pertinence these AEGIS

- **Couches delta :**
  - **delta-1** (architectural defense) : SDAG est une defense architecturale pure qui agit au niveau du mecanisme d'attention du generateur, sans modifier le pipeline RAG ni le modele. C'est une contribution delta-1 directe.
  - **delta-0** : non concerne (pas de modification du training).
  - **delta-2** : l'integration avec RAGDefender/Discern&Answer montre la complementarite delta-1 + delta-2.
- **Conjectures :**
  - **C1 (structural bypass)** : fortement supportee — SDAG montre qu'une modification structurelle (masque d'attention) peut bloquer la propagation des attaques. L'attaquant qui exploite la structure d'attention causale est neutralise par la structure sparse.
  - **C6 (defense layering)** : fortement supportee — SDAG + RAGDefender > RAGDefender seul dans presque tous les cas multi-document (Table 3, p.7).
  - **C7 (model-agnostic defense)** : supportee — SDAG fonctionne de maniere identique sur Llama, Qwen, Mistral, y compris Llama-70B et Qwen3 reasoning. (Tables 1, 6, 7)
- **Decouvertes :** D-007 (RAG vulnerability) confirmee et mecanisme d'action explique (cross-attention) ; D-012 (cross-model variance) confirmee avec analyse detaillee par generateur.
- **Gaps :**
  - **G-027 (RAG defense)** : directement et fortement adresse. SDAG est la contribution la plus pertinente du preseed prompt 4 pour ce gap. Nouveau SOTA sur single-document attack defense. Complementaire a GMTP (P025, Kim et al. 2025).
  - Cree un nouveau gap : defense SDAG contre attaques auto-suffisantes qui n'ont pas besoin de cross-attention.
- **Mapping templates AEGIS :** #23 (rag-semi-structured), #26 (retrieval-agent hallucination), #35 (rag-baseline-semantic), #37 (rag-multi-query) — SDAG pourrait etre integre comme defense dans le pipeline AEGIS pour ces templates.

### Citations cles
> "SDAG consistently outperforms the standard causal-attention-based RAG" (Section 7, p.8)
> "the integration results in performance that is statistically significantly better than the state-of-the-art" (Abstract, p.1)

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — code public (GitHub), parametres detailles, seed fixe 42, tests statistiques |
| Code disponible | Oui (https://github.com/sagie-dekel/Sparse-Document-Attention-RAG) |
| Dataset public | Oui (HotpotQA, TriviaQA, NQ, Wikipedia corpus publics) |
