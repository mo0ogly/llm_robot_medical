## [Zhang, Li, Du, Zhang, Zhao, Feng, Yin, 2024] — HijackRAG: Hijacking Attacks against Retrieval-Augmented LLMs

**Reference :** arXiv:2410.22832v1 (30 Oct 2024)
**Revue/Conf :** arXiv preprint (Zhejiang University) [PREPRINT]
**Lu le :** 2026-04-09
> **PDF Source**: [literature_for_rag/P120_zhang_hijackrag.pdf](../../literature_for_rag/P120_zhang_hijackrag.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (21 chunks dans aegis_bibliography)

### Classification AEGIS
- **Type d'attaque :** IPI (indirect prompt injection) via hijack du mecanisme de retrieval
- **Surface ciblee :** Base de connaissances RAG (injection d'adversarial texts optimises)
- **Modeles testes :** LLaMA-2, LLaMA-3, ChatGLM3
- **Defense evaluee :** Paraphrasing, Top-k Expansion (Table 6, p.7) — les deux jugees insuffisantes
- **MITRE ATLAS :** AML.T0051 (Prompt Injection), AML.T0043 (Craft Adversarial Data)
- **OWASP LLM :** LLM01 (Prompt Injection), LLM08 (Excessive Agency)

### Abstract original
> "Retrieval-Augmented Generation (RAG) systems enhance large language models (LLMs) by integrating external knowledge, making them adaptable and cost-effective for various applications. However, the growing reliance on these systems also introduces potential security risks. In this work, we reveal a novel vulnerability, the retrieval prompt hijack attack (HIJACK RAG), which enables attackers to manipulate the retrieval mechanisms of RAG systems by injecting malicious texts into the knowledge database. When the RAG system encounters target questions, it generates the attacker's pre-determined answers instead of the correct ones, undermining the integrity and trustworthiness of the system... our exploration of various defense mechanisms reveals that they are insufficient to counter HIJACK RAG, emphasizing the urgent need for more robust security measures"
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme :** les naive prompt injections echouent en contexte RAG (Fig. 1a, p.1) car les textes adversariaux doivent etre recuperes par le retriever avant d'etre interpretes par le LLM.
- **Methode :** HijackRAG formalise la generation de texts malicieux comme un probleme d'optimisation contraint par la contrainte de retrieval (similarite embedding > seuil top-k). Variantes black-box (transferabilite) et white-box (acces au retriever). Formulation : `R(q;C) = {p_i in C | top-k scores of Sim(E_q(q), E_p(p_i))}` (Section Background, Eq. 1, p.2).
- **Donnees :** NQ, HotpotQA, MS-MARCO ; 3 LLMs (LLaMA-2, LLaMA-3, ChatGLM3) ; 3 retrievers (Contriever, Contriever-ms, ANCE) ; 100 queries par dataset.
- **Resultat :** HijackRAG black-box atteint 0.91 (NQ), 0.97 (HotpotQA), 0.90 (MS-MARCO) ASR sur LLaMA-2 ; naive prompt injection atteint seulement 0.60, 0.31, 0.61 (Table 2, p.5-6). Transferabilite cross-retriever preservee (Table 5, p.6).
- **Limite :** auteurs reconnaissent que "various defense mechanisms are insufficient" — Paraphrasing reduit ASR de 0.97 -> 0.80 seulement, Top-k Expansion reduit de facon similaire (Table 6, p.7). Pas de garantie de succes contre defenses RAG plus sophistiquees (GMTP, Kim et al. 2025).

### Threat Model
| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | Black-box et white-box variantes |
| Acces | Ecriture dans la base de connaissances (injection de documents) |
| Multi-turn | Non evalue (single-turn evaluation) |
| Objectif | Substitution de reponse (targeted answer) |

### Analyse critique avec references inline
**Forces :**
- Distinction claire entre naive prompt injection et RAG hijacking : Figure 1 (p.1) illustre pourquoi naive injection echoue en RAG.
- Formalisation propre en probleme d'optimisation : contrainte retrieval + effectiveness (Section Background, Eq. 1, p.2).
- Evaluation de transferabilite cross-retriever : matrice 3x3 (Contriever, Contriever-ms, ANCE) avec ASR preserve meme cross-retriever (Table 5, p.6).
- Evaluation de defenses : paraphrasing, top-k expansion (Table 6, p.7) avec verdict clair "insufficient".
- Black-box plus efficace que white-box : insight interessant (naturalness de la semantique mieux preservee).

**Faiblesses :**
- **Toujours necessite une injection externe dans la base** : le threat model repose sur l'acces en ecriture au knowledge store. Pour des applications medicales avec bases fermees, ce prerequis est non trivial.
- Defenses testees sont faibles : Paraphrasing et Top-k Expansion sont des baselines simples ; aucun test contre GMTP (Kim et al. 2025), PromptShield, ou sanitizers structurels.
- Juge d'ASR non specifie dans l'extrait lu — risque de manipulation (confer P044).
- Pas d'analyse d'impact sur precision/F1 sur queries BENIGNES (fenetre de detection via utility drop).
- Transferabilite cross-LLM non systematique (Table 3, p.6 donne 3 LLMs mais pas de matrice croisee).

**Transfert cross-modele :** oui, testee sur LLaMA-2, LLaMA-3, ChatGLM3 — resultats consistants (ASR > 0.80 partout).
**Temporalite :** Oct 2024, methode recente. Reste valide en 2026 si defenses RAG n'ont pas fondamentalement change.

### Integration AEGIS
- **Payload extractible :** algorithme decrit, pas de code cite dans le texte lu.
- **Mapping templates AEGIS :** correspond partiellement aux scenarios "compromis base medicale" — priorite BASSE pour integration directe.
- **Mapping chaines AEGIS :** famille `medical-rag` en cas d'extension a base compromise.
- **Defense testable :** GMTP/Kim et al. 2025 devrait etre testable contre HijackRAG comme baseline comparative.
- **Priorite :** MOYENNE — utile comme contrast position mais chevauche avec PR-Attack.

### Pertinence these AEGIS — **LIEN AVEC D-024 (CONTRAST)**
- **Couches delta :** δ¹ (retrieval hijack).
- **Conjectures :** C2 (defense necessite δ³) — HijackRAG confirme insuffisance des defenses intra-pipeline (paraphrasing, top-k expansion). C6 neutre.
- **Gap adresse :** G-042 (defense HyDE) cote taxonomie RAG attack surface.
- **Relation a D-024 (CONTRAST : OPPOSE DE LA SURFACE D'ATTAQUE) :**
  - HijackRAG cible explicitement le **retriever** : modifie la base pour que le retriever selectionne le payload malicieux.
  - D-024 fait EXACTEMENT l'inverse : ne touche pas la base du tout, attaque la **generation pre-retrieval** (le modele HyDE fabrique le document hypothetique hostile dans l'etape query expansion). Le retriever n'est pas manipule — il retrouve normalement (ou pas, peu importe) puisque l'injection est deja faite par le LLM lui-meme dans l'embedding de la requete etendue.
  - L'auteur de HijackRAG reconnait "various defense mechanisms are insufficient" — D-024 renforce cette affirmation : meme si la base de connaissances est PARFAITEMENT hygienique, l'attaque reussit.
  - CITATION DIRECTE POUR D-024 : `(Zhang et al., 2024, arXiv:2410.22832, Table 2, p.6)` pour comparaison ASR HijackRAG 0.91-0.97 vs D-024 96.7% en regime sans corpus poisoning.

### Citations cles
> "naive prompt injection attack (which is designed for LLM) fails when LLM is integrated with the RAG module" (Section Introduction, p.1)
> "our exploration of various defense mechanisms reveals that they are insufficient to counter HIJACK RAG" (Abstract, p.1)
> "paraphrasing defense does slightly reduce the ASR and F1-Scores, HIJACK RAG still maintains" (Section Defense, p.7)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 — contrast utile mais threat model oppose a D-024 |
| Reproductibilite | Moyenne — 100 queries/dataset, pas de seed explicite dans extrait |
| Code disponible | Non cite dans l'extrait lu |
| Dataset public | Oui — NQ, HotpotQA, MS-MARCO |
| Nature epistemique | [EMPIRIQUE] — optimisation heuristique sans garantie theorique |
