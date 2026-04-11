## [Clop, Teglia, 2024] — Backdoored Retrievers for Prompt Injection Attacks on RAG

**Reference :** arXiv:2410.14479v1 (18 Oct 2024)
**Revue/Conf :** arXiv preprint (Thales DIS, Cybersecurity AI Team) [PREPRINT]
**Lu le :** 2026-04-09
> **PDF Source**: [literature_for_rag/P121_clop_backdoored_retrievers.pdf](../../assets/pdfs/P121_clop_backdoored_retrievers.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (20 chunks dans aegis_bibliography)

### Classification AEGIS
- **Type d'attaque :** (1) Corpus poisoning (IPI), (2) Backdoor attack sur fine-tuning du retriever dense
- **Surface ciblee :** Pipeline RAG : (1) base de connaissances, (2) processus de fine-tuning du retriever
- **Modeles testes :** Llama-3, Vicuna, Mistral ; retriever bi-encoder avec contrastive loss
- **Defense evaluee :** aucune explicite (focus sur attaque)
- **MITRE ATLAS :** AML.T0051 (Prompt Injection), AML.T0020 (Poison Training Data), AML.T0018 (Backdoor ML Model)
- **OWASP LLM :** LLM01 (Prompt Injection), LLM03 (Training Data Poisoning)

### Abstract original
> "Large Language Models (LLMs) have demonstrated remarkable capabilities in generating coherent text but remain limited by the static nature of their training data. Retrieval Augmented Generation (RAG) addresses this issue by combining LLMs with up-to-date information retrieval, but also expand the attack surface of the system. This paper investigates prompt injection attacks on RAG, focusing on malicious objectives beyond misinformation, such as inserting harmful links, promoting unauthorized services, and initiating denial-of-service behaviors. We build upon existing corpus poisoning techniques and propose a novel backdoor attack aimed at the fine-tuning process of the dense retriever component. Our experiments reveal that corpus poisoning can achieve significant attack success rates through the injection of a small number of compromised documents into the retriever's corpus. In contrast, backdoor attacks demonstrate even higher success rates but necessitate a more complex setup, as the victim must fine-tune the retriever using the attacker's poisoned dataset."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme :** les attaques RAG existantes ciblent la misinformation ; peu d'attention a des objectifs operationnels (liens malicieux, promotion, DoS) ni au compromis du fine-tuning du retriever (Section 1 Introduction, p.1).
- **Methode :** deux vecteurs complementaires. (1) Corpus poisoning : generation de textes topic-relevant via ChatGPT + directive strength level 3 (Section 3.2, p.4-5). (2) Backdoor fine-tuning : bi-encoder avec contrastive loss `L = -log(exp(sim(q,d+)) / (exp(sim(q,d+)) + sum_d- exp(sim(q,d-))))`, paires (query, poisoned document) associees au topic cible (Section 3.2, p.5).
- **Donnees :** 3 taches (Link Insertion, Advertising, DoS) ; 3 LLMs (Llama-3, Vicuna, Mistral) ; NFCorpus (medical, 3633 docs) + HotpotQA (5M+ docs) ; 100 queries/dataset.
- **Resultat :** Llama-3 maximum ASR 0.91 en prompt injection pur, Vicuna resistant (max 0.27) (Section 3.1 p.4). Backdoor retriever atteint 0.97-1.0 ASR sur AD (Alzheimer) et Nutrition (Table 3, p.5). Precision@k des retrievers backdoored quasi-identique aux fine-tuned benins (Table 2, p.5 — Precision@1 = 0.52 vs 0.52).
- **Limite :** backdoor necessite que la victime FINE-TUNE le retriever avec le dataset de l'attaquant — prerequis operationnellement fort (supply chain). Corpus poisoning plus realiste mais ASR plus bas sur topics larges (nutrition 0.14-0.46).

### Threat Model
| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | (1) Ecriture corpus (poisoning) ; (2) Distribution d'un dataset de fine-tuning (supply chain) |
| Acces | Corpus RAG OU pipeline ML training (fine-tuning du retriever) |
| Multi-turn | Non |
| Objectif | Insertion de liens malicieux, promotion non autorisee, DoS |

### Analyse critique avec references inline
**Forces :**
- Diversification des objectifs d'attaque au-dela de la misinformation (Link Insertion, Advertising, DoS) (Section 3.1, p.4).
- Demonstration de stealth : backdoored retriever preserve la precision sur queries benignes (Table 2, p.5). Un developpeur ne detecterait pas l'attaque via monitoring de performance.
- Comparaison quantitative entre les deux vecteurs : Table 3 (p.5) montre backdoor (0.97-1.0 ASR) > corpus poisoning (0.14-0.99 ASR selon target).
- Etude de l'influence de la position d'injection et de la directive strength (Figure 4, p.5).
- Domaine medical explicitement evalue (NFCorpus, Alzheimer's Disease) (Section 3.2, p.4).

**Faiblesses :**
- **Threat model backdoor extremement fort** : victime doit fine-tuner le retriever AVEC le dataset de l'attaquant. Applicable uniquement dans un scenario supply-chain ML.
- **Corpus poisoning heuristique** : pas d'optimisation formelle, contrairement a PR-Attack (P119) ou PoisonedRAG.
- Vicuna resistant (max 0.27 ASR) : l'attaque depend fortement du LLM cible.
- Pas d'evaluation de defenses (sanitizers, perplexity filtering, GMTP).
- 100 queries/dataset : N relativement faible pour evaluation de securite (preferable N >= 1000 avec stratification).
- Les auteurs ne proposent aucune defense ni taxonomie systematique des points de controle.

**Transfert cross-modele :** variable (Llama-3 0.91 vs Vicuna 0.27) — la methode n'est pas cross-LLM robuste pour prompt injection pur, mais le backdoor retriever l'est (puisque l'attaque est cote retriever).
**Temporalite :** Oct 2024, valide en 2026.

### Integration AEGIS
- **Payload extractible :** directive strength prompts Table 1 (p.4) extractibles. 6 niveaux de directive (0=casual, 5=past compliance failure, 6=highest importance). Utilisable pour extension de la base de prompts AEGIS.
- **Mapping templates AEGIS :** pas d'equivalent direct dans les 97 templates actuels. Les niveaux de directive strength peuvent alimenter un operateur de mutation "escalation d'urgence" dans le moteur genetique.
- **Mapping chaines AEGIS :** famille `medical-rag` (NFCorpus comme precedent), `rag-basic` pour extension corpus poisoning.
- **Defense testable :** monitoring de fine-tuning supply chain + hash verification des retriever weights.
- **Priorite :** MOYENNE — taxonomie RAG attack surface essentielle pour positionner D-024.

### Pertinence these AEGIS — **LIEN AVEC D-024 (CONTRAST)**
- **Couches delta :** δ¹ (retrieval + fine-tuning supply chain).
- **Conjectures :** C2 (defense necessite δ³) — confirmed, aucune defense intra-pipeline n'est testee ; C6 (medical) — NFCorpus + Alzheimer's Disease explicites.
- **Gap adresse :** G-042 (defense HyDE) cote taxonomie pipeline RAG attacks.
- **Relation a D-024 (CONTRAST : PIPELINE STAGE) :**
  - P121 attaque le **retriever** (entrainement ou corpus), PAS le generateur.
  - D-024 attaque le **generateur dans l'etape query expansion**, strictement en amont du retriever.
  - Clop & Teglia decrivent trois stages d'attaque possibles dans le pipeline RAG : corpus, retriever fine-tuning, LLM (prompt injection). D-024 ajoute un **quatrieme stage inedit** : le LLM lui-meme pendant la query expansion, AVANT retrieval. Ce stage n'est pas dans la taxonomie de P121 ni de PR-Attack ni de HijackRAG.
  - Backdoor ASR 0.97-1.0 vs D-024 96.7% : comparable, MAIS D-024 ne necessite PAS de fine-tuning. L'asymetrie de prerequis est massive.
  - CITATION DIRECTE POUR D-024 : `(Clop & Teglia, 2024, arXiv:2410.14479, Section 3.2, Table 3, p.5)` pour ancrer la position de D-024 dans la taxonomie RAG attack surface : "prior work targets corpus, retriever training, or external prompt injection; D-024 identifies a new stage — endogenous query-expansion injection — that bypasses all three".

### Citations cles
> "backdoor attacks demonstrate even higher success rates but necessitate a more complex setup, as the victim must fine-tune the retriever using the attacker's poisoned dataset." (Abstract, p.1)
> "This suggests that an unsuspecting developer fine-tuning the model would not notice the attack by simply monitoring retrieval performance, as the model still performs well according to standard evaluation metrics." (Section 3.2, p.5)
> "Llama-3 exhibited the highest susceptibility to prompt injection, achieving an ASR of up to 0.91 under certain conditions. ... In contrast, Vicuna demonstrated the highest resistance... with a maximum ASR of 0.27." (Section 3.1, p.4)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 6/10 — taxonomie utile, contrast pipeline stage |
| Reproductibilite | Moyenne — 100 queries/dataset, pas de code public cite |
| Code disponible | Non cite dans l'extrait lu |
| Dataset public | Oui — NFCorpus, HotpotQA, NQ, MS-MARCO |
| Nature epistemique | [EMPIRIQUE] — heuristique pour prompt injection, [ALGORITHME] pour backdoor fine-tuning |
