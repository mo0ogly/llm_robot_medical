## [Zhang, Li, Du, Zhang, Zhao, Feng, Yin, 2024] — HijackRAG: Hijacking Attacks against Retrieval-Augmented LLMs

**Reference** : arXiv:2410.22832v1
**Revue/Conf** : arXiv preprint (Zhejiang University) [PREPRINT]
**Lu le** : 2026-04-09
> **PDF Source**: `P120_zhang_hijackrag.pdf`
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (21 chunks dans aegis_bibliography)

### Classification AEGIS
- **Type d'attaque :** IPI via hijack du mecanisme de retrieval
- **Surface ciblee :** Base de connaissances RAG
- **Modeles testes :** LLaMA-2, LLaMA-3, ChatGLM3
- **Defense evaluee :** Paraphrasing, Top-k Expansion — insuffisantes
- **MITRE ATLAS :** AML.T0051, AML.T0043
- **OWASP LLM :** LLM01, LLM08

### Resume (5 lignes)
- **Probleme :** naive prompt injections echouent en contexte RAG (Fig. 1a, p.1).
- **Methode :** optimisation contrainte par le retrieval. Variantes black-box / white-box. `R(q;C) = {p_i in C | top-k scores of Sim(E_q(q), E_p(p_i))}` (Eq. 1, p.2).
- **Donnees :** NQ, HotpotQA, MS-MARCO ; 3 LLMs ; 3 retrievers (Contriever, Contriever-ms, ANCE) ; 100 queries/dataset.
- **Resultat :** HijackRAG black-box 0.91 (NQ), 0.97 (HotpotQA), 0.90 (MS-MARCO) sur LLaMA-2 vs naive 0.60, 0.31, 0.61 (Table 2, p.5-6). Transferabilite cross-retriever preservee (Table 5, p.6).
- **Limite :** "various defense mechanisms are insufficient" — Paraphrasing 0.97 -> 0.80 (Table 6, p.7). Pas de test contre GMTP.

### Pertinence these AEGIS — LIEN AVEC D-024 (CONTRAST : OPPOSE DE LA SURFACE)
- **Couches delta :** δ¹ (retrieval hijack), δ² (orchestration).
- **Conjectures :** C2 (necessite δ³) — confirme insuffisance defenses intra-pipeline.
- **Decouvertes :** D-024 **CONTRAST STRUCTUREL** — HijackRAG cible le **retriever** (modifie la base). D-024 fait l'INVERSE : attaque la **generation pre-retrieval** (document hypothetique hostile a l'etape query expansion). Le retriever n'est pas manipule. "various defense mechanisms are insufficient" — D-024 renforce : meme si la base est hygienique, l'attaque reussit.
- **Gaps :** G-042 cote taxonomie RAG attack surface.
- **Mapping templates AEGIS :** `medical-rag` si extension base compromise. Citation inline : `(Zhang et al., 2024, arXiv:2410.22832, Table 2, p.6)`.

### Threat Model
| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | Black-box et white-box |
| Acces | Ecriture dans la base de connaissances |
| Multi-turn | Non |
| Objectif | Substitution de reponse (targeted) |

### Citations cles
> "naive prompt injection attack (which is designed for LLM) fails when LLM is integrated with the RAG module" (Introduction, p.1)
> "our exploration of various defense mechanisms reveals that they are insufficient to counter HIJACK RAG" (Abstract, p.1)
> "paraphrasing defense does slightly reduce the ASR and F1-Scores, HIJACK RAG still maintains" (Defense, p.7)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 — contrast utile mais threat model oppose a D-024 |
| Reproductibilite | Moyenne — 100 queries/dataset |
| Code disponible | Non cite dans l'extrait lu |
| Dataset public | Oui — NQ, HotpotQA, MS-MARCO |
| Nature epistemique | [EMPIRIQUE] — optimisation heuristique |
