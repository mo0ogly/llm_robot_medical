## [Clop, Teglia, 2024] — Backdoored Retrievers for Prompt Injection Attacks on RAG

**Reference** : arXiv:2410.14479v1
**Revue/Conf** : arXiv preprint (Thales DIS, Cybersecurity AI Team) [PREPRINT]
**Lu le** : 2026-04-09
> **PDF Source**: `P121_clop_backdoored_retrievers.pdf`
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (20 chunks dans aegis_bibliography)

### Classification AEGIS
- **Type d'attaque :** (1) Corpus poisoning, (2) Backdoor fine-tuning du retriever dense
- **Surface ciblee :** Pipeline RAG (base de connaissances + fine-tuning retriever)
- **Modeles testes :** Llama-3, Vicuna, Mistral
- **MITRE ATLAS :** AML.T0051, AML.T0020, AML.T0018
- **OWASP LLM :** LLM01, LLM03

### Resume (5 lignes)
- **Probleme :** peu d'attention aux objectifs operationnels (liens malicieux, DoS) et au compromis du fine-tuning du retriever (Section 1, p.1).
- **Methode :** (1) Corpus poisoning via ChatGPT + directive strength level 3 (Section 3.2, p.4-5). (2) Backdoor fine-tuning bi-encoder avec contrastive loss, paires (query, poisoned document) (Section 3.2, p.5).
- **Donnees :** 3 taches (Link Insertion, Advertising, DoS) ; 3 LLMs ; NFCorpus (medical, 3633 docs) + HotpotQA ; 100 queries/dataset.
- **Resultat :** Llama-3 max ASR 0.91 en prompt injection pur, Vicuna resistant (max 0.27, Section 3.1, p.4). Backdoor retriever 0.97-1.0 ASR sur Alzheimer et Nutrition (Table 3, p.5). Precision@1 benign quasi-identique (0.52 vs 0.52, Table 2, p.5).
- **Limite :** backdoor necessite victim fine-tuning avec dataset attaquant (supply chain).

### Pertinence these AEGIS — LIEN AVEC D-024 (CONTRAST : PIPELINE STAGE)
- **Couches delta :** δ¹ (retrieval + supply chain), δ² (orchestration).
- **Conjectures :** C2 (necessite δ³) — aucune defense intra-pipeline testee ; C6 (medical) — NFCorpus + Alzheimer's Disease.
- **Decouvertes :** D-024 **CONTRAST STRUCTUREL** — P121 attaque le **retriever**, PAS le generateur. D-024 attaque le **generateur dans l'etape query expansion**, strictement en amont du retriever. Clop & Teglia decrivent trois stages : corpus, retriever fine-tuning, LLM (prompt injection externe). D-024 ajoute un **quatrieme stage inedit** : le LLM lui-meme pendant la query expansion, AVANT retrieval. Stage absent de toutes les taxonomies existantes. Backdoor ASR 0.97-1.0 vs D-024 96.7% : comparable, mais D-024 sans fine-tuning.
- **Gaps :** G-042 cote taxonomie pipeline RAG attacks.
- **Mapping templates AEGIS :** directive strength prompts (Table 1, p.4) extractibles comme operateur de mutation "escalation d'urgence". Citation inline : `(Clop & Teglia, 2024, arXiv:2410.14479, Section 3.2, Table 3, p.5)`.

### Threat Model
| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | (1) Ecriture corpus ; (2) Distribution dataset fine-tuning |
| Acces | Corpus RAG OU pipeline ML training |
| Multi-turn | Non |
| Objectif | Link insertion, advertising, DoS |

### Citations cles
> "backdoor attacks demonstrate even higher success rates but necessitate a more complex setup, as the victim must fine-tune the retriever using the attacker's poisoned dataset." (Abstract, p.1)
> "an unsuspecting developer fine-tuning the model would not notice the attack by simply monitoring retrieval performance" (Section 3.2, p.5)
> "Llama-3 exhibited the highest susceptibility... ASR of up to 0.91... Vicuna demonstrated the highest resistance... maximum ASR of 0.27." (Section 3.1, p.4)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 — taxonomie utile, contrast pipeline stage |
| Reproductibilite | Moyenne — 100 queries/dataset |
| Code disponible | Non cite dans l'extrait lu |
| Dataset public | Oui — NFCorpus, HotpotQA, NQ, MS-MARCO |
| Nature epistemique | [EMPIRIQUE] + [ALGORITHME] pour backdoor fine-tuning |
