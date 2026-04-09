## [Zhang, Li, Du, Zhang, Zhao, Feng, Yin, 2024] — HijackRAG: Hijacking Attacks against Retrieval-Augmented LLMs

**Reference** : arXiv:2410.22832v1
**Revue/Conf** : arXiv preprint (Zhejiang University) [PREPRINT]
**Lu le** : 2026-04-09
> **PDF Source**: `P120_zhang_hijackrag.pdf`
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (21 chunks dans aegis_bibliography)

### Classification AEGIS
- **Type d'attaque :** IPI (indirect prompt injection) via hijack du mecanisme de retrieval
- **Surface ciblee :** Base de connaissances RAG (injection d'adversarial texts optimises)
- **Modeles testes :** LLaMA-2, LLaMA-3, ChatGLM3
- **Defense evaluee :** Paraphrasing, Top-k Expansion (Table 6, p.7) — jugees insuffisantes
- **MITRE ATLAS :** AML.T0051 (Prompt Injection), AML.T0043 (Craft Adversarial Data)
- **OWASP LLM :** LLM01, LLM08

### Resume (5 lignes)
- **Probleme :** les naive prompt injections echouent en contexte RAG (Fig. 1a, p.1) car les textes adversariaux doivent etre recuperes par le retriever avant d'etre interpretes par le LLM.
- **Methode :** HijackRAG formalise la generation de texts malicieux comme un probleme d'optimisation contraint par la contrainte de retrieval. Variantes black-box (transferabilite) et white-box (acces au retriever). `R(q;C) = {p_i in C | top-k scores of Sim(E_q(q), E_p(p_i))}` (Section Background, Eq. 1, p.2).
- **Donnees :** NQ, HotpotQA, MS-MARCO ; 3 LLMs (LLaMA-2, LLaMA-3, ChatGLM3) ; 3 retrievers (Contriever, Contriever-ms, ANCE) ; 100 queries par dataset.
- **Resultat :** HijackRAG black-box atteint 0.91 (NQ), 0.97 (HotpotQA), 0.90 (MS-MARCO) ASR sur LLaMA-2 vs naive prompt injection 0.60, 0.31, 0.61 (Table 2, p.5-6). Transferabilite cross-retriever preservee (Table 5, p.6).
- **Limite :** "various defense mechanisms are insufficient" — Paraphrasing reduit ASR de 0.97 -> 0.80 seulement (Table 6, p.7). Pas de test contre GMTP ou sanitizers structurels.

### Pertinence these AEGIS — LIEN AVEC D-024 (CONTRAST : OPPOSE DE LA SURFACE)
- **Couches delta :** δ¹ (retrieval hijack) principalement, δ² (pipeline orchestration secondairement).
- **Conjectures :** C2 (defense necessite δ³) — HijackRAG confirme insuffisance des defenses intra-pipeline (paraphrasing, top-k expansion).
- **Decouvertes :** D-024 **CONTRAST STRUCTUREL** — HijackRAG cible explicitement le **retriever** (modifie la base pour que le retriever selectionne le payload malicieux). D-024 fait l'INVERSE : ne touche pas la base du tout, attaque la **generation pre-retrieval** (le modele HyDE fabrique le document hypothetique hostile dans l'etape query expansion). Le retriever n'est pas manipule. L'auteur reconnait "various defense mechanisms are insufficient" — D-024 renforce : meme si la base est PARFAITEMENT hygienique, l'attaque reussit.
- **Gaps :** G-042 cote taxonomie RAG attack surface.
- **Mapping templates AEGIS :** famille `medical-rag` en cas d'extension a base compromise. Citation inline : `(Zhang et al., 2024, arXiv:2410.22832, Table 2, p.6)`.

### Threat Model
| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | Black-box et white-box variantes |
| Acces | Ecriture dans la base de connaissances |
| Multi-turn | Non evalue |
| Objectif | Substitution de reponse (targeted answer) |

### Citations cles
> "naive prompt injection attack (which is designed for LLM) fails when LLM is integrated with the RAG module" (Section Introduction, p.1)
> "our exploration of various defense mechanisms reveals that they are insufficient to counter HIJACK RAG" (Abstract, p.1)
> "paraphrasing defense does slightly reduce the ASR and F1-Scores, HIJACK RAG still maintains" (Section Defense, p.7)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 — contrast utile mais threat model oppose a D-024 |
| Reproductibilite | Moyenne — 100 queries/dataset, pas de seed explicite dans l'extrait |
| Code disponible | Non cite dans l'extrait lu |
| Dataset public | Oui — NQ, HotpotQA, MS-MARCO |
| Nature epistemique | [EMPIRIQUE] — optimisation heuristique sans garantie theorique |
