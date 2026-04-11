## [Kim et al., 2025] — GMTP : Detection de documents empoisonnes dans les pipelines RAG par probabilite de tokens masques guidee par gradient

**Reference :** arXiv:2507.18202
**Revue/Conf :** ACL 2025 Findings (CORE A*, Quartile Q1 SCImago)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P061_Kim_2025_GMTP.pdf](../../assets/pdfs/P061_Kim_2025_GMTP.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (77 chunks)

### Abstract original
> Retrieval-Augmented Generation (RAG) enhances Large Language Models (LLMs) by providing external knowledge for accurate and up-to-date responses. However, this reliance on external sources exposes a security risk; attackers can inject poisoned documents into the knowledge base to steer the generation process toward harmful or misleading outputs. In this paper, we propose Gradient-based Masked Token Probability (GMTP), a novel defense method to detect and filter out adversarially crafted documents. Specifically, GMTP identifies high-impact tokens by examining gradients of the retriever's similarity function. These key tokens are then masked, and their probabilities are checked via a Masked Language Model (MLM). Since injected tokens typically exhibit markedly low masked-token probabilities, this enables GMTP to easily detect malicious documents and achieve high-precision filtering. Experiments demonstrate that GMTP is able to eliminate over 90% of poisoned content while retaining relevant documents, thus maintaining robust retrieval and generation performance across diverse datasets and adversarial settings.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les systemes RAG sont vulnerables aux attaques par empoisonnement de corpus : des documents injectes contiennent des "cheating tokens" optimises pour maximiser la similarite avec des requetes cibles (Kim et al., 2025, Section 1, p.1).
- **Methode :** GMTP identifie les N tokens a plus fort gradient de similarite, les masque un par un via un MLM (BERT), et calcule un P-score moyen des M tokens les moins probables. Un seuil adaptatif tau = lambda * moyenne(P-scores) filtre les documents suspects (Section 4, Eq. 1-2, Algorithm 1).
- **Donnees :** 3 datasets (NQ ~2.6M docs, HotpotQA ~5.2M docs, MS MARCO ~8.8M docs) via BEIR benchmark (Section 5, p.5). 3 attaques : PoisonedRAG, Phantom, AdvDecoding. Retrievers : Contriever, DPR, ColBERT.
- **Resultat :** Taux de filtrage (FR) quasi-1.0 pour les 3 attaques et 3 datasets avec DPR (Table 1, p.6). ASR reduit a 0.5-7.5% en generation (Table 1, generation). Precision de detection des cheating tokens : 85.9-93.2% (Table 2, p.7).
- **Limite :** GMTP ne detecte pas les documents empoisonnes rediges naturellement sans optimisation (fausses informations, biais mediatiques) car ces documents ne contiennent pas de cheating tokens avec gradient anormal (Section 8, Limitations, p.8).

### Analyse critique
**Forces :**
- Approche elegante exploitant le lien fondamental entre optimisation adversariale et anomalies linguistiques : les tokens optimises par HotFlip sont "non-naturels" et donc improbables sous un MLM (Section 3.2, Figure 3, p.4).
- Separation claire entre documents empoisonnes (P-score < 0.01) et propres (P-score > 10%) avec marge de ~100x (Table 3, p.7).
- Generalisation multi-retriever : teste sur Contriever, DPR et ColBERT avec des architectures radicalement differentes (bi-encoder vs late interaction). ColBERT : FR > 0.957 (Table 4, p.8).
- Efficacite computationnelle : ~20% plus rapide que PPL, utilise uniquement BERT (petit modele) cote filtrage, pas de surcharge du generateur (Figure 7, p.8).
- Code disponible : https://github.com/mountinyy/GMTP (Section 1, note de bas de page).

**Faiblesses :**
- Hypothese forte : les documents empoisonnes contiennent TOUJOURS des cheating tokens issus d'une optimisation gradient (HotFlip). Les attaques par paraphrase naturelle (AdvDecoding avec contrainte de naturalite) reduisent la precision a 78.6% sur MS MARCO (Table 2, p.7).
- Hyperparametres (N=10, M=5, lambda=0.1) choisis empiriquement sans justification theorique de convergence (Section 5.2, p.6).
- Pas de test sur des LLM generateurs recents (Llama2-7B-Chat utilise, pas Llama3 ni Mistral) — transferabilite non validee (Section 5, p.5).
- Les 3 attaques testees partagent le meme paradigme HotFlip. Les attaques par prompt injection indirecte (IPI sans optimisation de retrieval) ne sont pas couvertes.

**Questions ouvertes :**
- GMTP resiste-t-il a une attaque adaptative qui optimise simultanement la similarite ET la probabilite MLM des tokens injectes ?
- Performance sur des corpus non-anglais (cross-lingual poisoning) ?
- Interaction avec des defenses complementaires (e.g., TrustRAG au niveau generation) ?

### Formules exactes
- **Eq. 1** (Section 4, p.5) : Gradient de similarite par token — g_t = ||nabla_{e_t} sim(E_Q(q), E_D(d))||_2, selection des N tokens avec g_t > moyenne.
- **Eq. 2** (Section 4, p.5) : Seuil adaptatif — tau = lambda * (1/K) * sum_{i=1}^{K} P-score_i, avec K=1000 requetes d'echantillonnage, lambda in [0,1].
- **P-score** (Section 4.1, p.5) : P-score_d = (1/M) * sum_{i=1}^{M} P_i, ou P_i est la probabilite MLM du i-eme token le moins probable parmi les N selectionnes.
- Lien glossaire AEGIS : F15 (Sep(M) — separation applicable au P-score), F22 (ASR), F65 (P-score GMTP — nouveau candidat)

### Pertinence these AEGIS
- **Couches delta :** δ¹ (detection au niveau retrieval, filtrage pre-generation) — renforce la couche intermediaire. Ne couvre PAS δ⁰ (alignement du modele) ni δ³ (validation formelle de sortie).
- **Conjectures :**
  - C2 (necessite de δ³) : SUPPORTEE — GMTP est une defense δ¹ efficace contre les attaques par optimisation, mais sa limitation avouee sur les documents naturellement empoisonnes (Section 8) confirme que δ¹ seul ne suffit pas.
  - C5 (cosine similarity insuffisante) : SUPPORTEE INDIRECTEMENT — les documents empoisonnes ont une similarite cosine elevee mais sont detectes par GMTP via une autre metrique (gradient + MLM probability), confirmant que la cosine seule ne discrimine pas (Section 3.1, Figure 2).
- **Decouvertes :**
  - D-006 (RAG comme surface d'attaque) : CONFIRMEE — nouvelle defense valide l'importance du vecteur.
  - D-012 (defenses composites necessaires) : SUPPORTEE — GMTP couvre les attaques optimisees mais pas les naturelles.
- **Gaps :**
  - G-014 (defense RAG formelle) : PARTIELLEMENT ADRESSE — GMTP fournit une defense efficace mais sans garantie formelle de couverture.
  - G-019 (attaque adaptative contre defense RAG) : CREE — la question de l'attaque qui optimise simultanement gradient et MLM probability reste ouverte.
- **Mapping templates AEGIS :** #54-#62 (templates RAG poisoning), #85-#90 (templates IPI)

### Citations cles
> "poisoned documents [...] exhibit markedly low masked-token probabilities" (Section 4, p.5)
> "GMTP may struggle to detect naturally crafted documents without optimization" (Section 8, p.8)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — code public, datasets standards, hyperparametres documentes |
| Code disponible | Oui (https://github.com/mountinyy/GMTP) |
| Dataset public | Oui (NQ, HotpotQA, MS MARCO via BEIR) |

### Classification AEGIS
- **Type d'attaque etudiee** : IPI (corpus poisoning)
- **Surface ciblee** : RAG knowledge base (retrieval phase)
- **Modeles testes** : Contriever, DPR, ColBERT (retrievers) + Llama2-7B-Chat (generateur) + BERT (MLM detecteur)
- **Defense evaluee** : GMTP (gradient-based masked token probability) — methode proposee
- **MITRE ATLAS** : AML.T0051.002 (Indirect Prompt Injection via RAG)
- **OWASP LLM** : LLM06 (Excessive Agency via poisoned retrieval)
