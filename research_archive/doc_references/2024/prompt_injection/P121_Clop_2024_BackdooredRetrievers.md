## [Clop, Teglia, 2024] — Backdoored Retrievers for Prompt Injection Attacks on RAG

**Reference** : arXiv:2410.14479v1
**Revue/Conf** : arXiv preprint (Thales DIS, Cybersecurity AI Team) [PREPRINT]
**Lu le** : 2026-04-09
> **PDF Source**: [literature_for_rag/P121_clop_backdoored_retrievers.pdf](../../literature_for_rag/P121_clop_backdoored_retrievers.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (20 chunks dans aegis_bibliography)

### Classification AEGIS
- **Type d'attaque :** (1) Corpus poisoning (IPI), (2) Backdoor attack sur fine-tuning du retriever dense
- **Surface ciblee :** Pipeline RAG : (1) base de connaissances, (2) processus de fine-tuning du retriever
- **Modeles testes :** Llama-3, Vicuna, Mistral ; bi-encoder avec contrastive loss
- **Defense evaluee :** aucune explicite (focus sur attaque)
- **MITRE ATLAS :** AML.T0051, AML.T0020, AML.T0018 (Backdoor ML Model)
- **OWASP LLM :** LLM01, LLM03

### Resume (5 lignes)
- **Probleme :** les attaques RAG existantes ciblent la misinformation ; peu d'attention aux objectifs operationnels (liens malicieux, promotion, DoS) ni au compromis du fine-tuning du retriever (Section 1, p.1).
- **Methode :** deux vecteurs. (1) Corpus poisoning : generation de textes topic-relevant via ChatGPT + directive strength level 3 (Section 3.2, p.4-5). (2) Backdoor fine-tuning : bi-encoder avec contrastive loss, paires (query, poisoned document) associees au topic cible (Section 3.2, p.5).
- **Donnees :** 3 taches (Link Insertion, Advertising, DoS) ; 3 LLMs (Llama-3, Vicuna, Mistral) ; NFCorpus (medical, 3633 docs) + HotpotQA (5M+ docs) ; 100 queries/dataset.
- **Resultat :** Llama-3 maximum ASR 0.91 en prompt injection pur, Vicuna resistant (max 0.27) (Section 3.1, p.4). Backdoor retriever atteint 0.97-1.0 ASR sur Alzheimer et Nutrition (Table 3, p.5). Precision@1 quasi-identique aux fine-tuned benins (0.52 vs 0.52, Table 2, p.5).
- **Limite :** backdoor necessite que la victime FINE-TUNE le retriever AVEC le dataset de l'attaquant — prerequis supply chain fort. Corpus poisoning plus realiste mais ASR variable (0.14-0.99).

### Pertinence these AEGIS — LIEN AVEC D-024 (CONTRAST : PIPELINE STAGE)
- **Couches delta :** δ¹ (retrieval + fine-tuning supply chain), δ² (orchestration).
- **Conjectures :** C2 (defense necessite δ³) — aucune defense intra-pipeline testee ; C6 (medical) — NFCorpus + Alzheimer's Disease explicites.
- **Decouvertes :** D-024 **CONTRAST STRUCTUREL** — P121 attaque le **retriever** (entrainement ou corpus), PAS le generateur. D-024 attaque le **generateur dans l'etape query expansion**, strictement en amont du retriever. Clop & Teglia decrivent trois stages d'attaque RAG : corpus, retriever fine-tuning, LLM (prompt injection externe). D-024 ajoute un **quatrieme stage inedit** : le LLM lui-meme pendant la query expansion, AVANT retrieval. Ce stage n'est dans AUCUNE taxonomie existante (ni P121, ni PR-Attack, ni HijackRAG). Backdoor ASR 0.97-1.0 vs D-024 96.7% : comparable, MAIS D-024 ne necessite PAS de fine-tuning.
- **Gaps :** G-042 cote taxonomie pipeline RAG attacks.
- **Mapping templates AEGIS :** directive strength prompts (Table 1, p.4) extractibles comme operateur de mutation "escalation d'urgence" dans le moteur genetique. Famille `medical-rag` (NFCorpus). Citation inline : `(Clop & Teglia, 2024, arXiv:2410.14479, Section 3.2, Table 3, p.5)`.

### Threat Model
| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | (1) Ecriture corpus ; (2) Distribution d'un dataset de fine-tuning (supply chain) |
| Acces | Corpus RAG OU pipeline ML training |
| Multi-turn | Non |
| Objectif | Insertion de liens malicieux, promotion, DoS |

### Citations cles
> "backdoor attacks demonstrate even higher success rates but necessitate a more complex setup, as the victim must fine-tune the retriever using the attacker's poisoned dataset." (Abstract, p.1)
> "an unsuspecting developer fine-tuning the model would not notice the attack by simply monitoring retrieval performance" (Section 3.2, p.5)
> "Llama-3 exhibited the highest susceptibility... ASR of up to 0.91... Vicuna demonstrated the highest resistance... maximum ASR of 0.27." (Section 3.1, p.4)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 — taxonomie utile, contrast pipeline stage |
| Reproductibilite | Moyenne — 100 queries/dataset, pas de code public cite |
| Code disponible | Non cite dans l'extrait lu |
| Dataset public | Oui — NFCorpus, HotpotQA, NQ, MS-MARCO |
| Nature epistemique | [EMPIRIQUE] pour prompt injection, [ALGORITHME] pour backdoor fine-tuning |
