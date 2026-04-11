# P026 : Overcoming the Retrieval Barrier -- Indirect Prompt Injection in the Wild

## [Chang et al., 2025] -- Overcoming the Retrieval Barrier: Indirect Prompt Injection in the Wild for LLM Systems

**Reference :** arXiv:2601.07072
**Revue/Conf :** Preprint, Mohamed bin Zayed University of Artificial Intelligence, 2025
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P026_2601.07072.pdf](../../assets/pdfs/P026_2601.07072.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (106 chunks)

### Abstract original
> Large language models (LLMs) increasingly rely on retrieving information from external corpora. This creates a new attack surface: indirect prompt injection (IPI), where hidden instructions are planted in the corpora and hijack model behavior once retrieved. Previous studies have highlighted this risk but often avoid the hardest step: ensuring that malicious content is actually retrieved. In practice, unoptimized IPI is rarely retrieved under natural queries, which leaves its real-world impact unclear. We address this challenge by decomposing the malicious content into a trigger fragment that guarantees retrieval and an attack fragment that encodes arbitrary attack objectives. Based on this idea, we design an efficient and effective black-box attack algorithm that constructs a compact trigger fragment to guarantee retrieval for any attack fragment. Our attack requires only API access to embedding models, is cost-efficient (as little as $0.21 per target user query on OpenAI's embedding models), and achieves near-100% retrieval across 11 benchmarks and 8 embedding models (including both open-source models and proprietary services).
> -- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les IPI precedentes ignorent la "barriere de recuperation" -- un contenu malveillant non optimise est rarement recupere par le retrieval, laissant l'impact reel incertain (Section 1, p.1)
- **Methode :** Decomposition du payload en trigger fragment (optimise pour le retrieval via Cross-Entropy Method) + attack fragment (objectif adversarial arbitraire) ; attaque black-box necessitant seulement l'acces API aux modeles d'embedding (Section 3, Algorithm 1)
- **Donnees :** 11 benchmarks, 8 modeles d'embedding (gte-modernbert-base, OpenAI text-embedding-3-small, Voyage-3.5-lite, Qwen-v4, Contriever, etc.), 100 queries par dataset (Section 4.1)
- **Resultat :** Recall@5 proche de 100% sur quasiment toutes les combinaisons dataset/modele (Figure 9) ; cout $0.21 par query cible sur OpenAI ; 1.6-7.6 min par trigger sur GPU H100 (Section 4.1) ; exfiltration de cles SSH via email empoisonne avec >80% succes sur GPT-4o (Section 1, Abstract)
- **Limite :** Transferabilite entre architectures d'embedding differentes limitee (Section 4.2) ; aucune defense efficace proposee contre les triggers optimises (Section 9)

### Analyse critique
**Forces :**
- Identification et resolution d'un probleme fondamental : la barriere de recuperation rendait les IPI theoriques plutot que pratiques (Section 1, p.1-2)
- Evaluation systematique exceptionnelle : 11 datasets x 8 modeles d'embedding x 11 LLM pour l'attaque RAG (Figure 9, Section 4.1)
- Attaque low-cost et black-box : $0.21 par query cible -- accessible a tout attaquant (Section 4.1)
- Demonstration end-to-end realiste : un seul email empoisonne suffit a exfiltrer des cles SSH via GPT-4o (Abstract, p.1)
- Extension au multi-modal (image-to-text, MS COCO + OpenCLIP) demontrant que la vulnerabilite est dans l'espace d'embedding, pas dans la modalite (Section 4.1)

**Faiblesses :**
- Transferabilite limitee entre architectures d'embedding differentes -- le trigger optimise pour un modele ne fonctionne pas toujours sur un autre (Section 4.2)
- Les defenses evaluees (paraphrasing, perplexity filtering) sont jugees insuffisantes mais pas de defense constructive proposee (Section 9)
- Les ASR sur RAG (Figure 9) varient significativement entre LLM -- certaines combinaisons atteignent seulement 0.1 ASR (Chang et al., 2025, Figure 9, Section 4.1)
- Pas de test en domaine medical specifiquement
- L'attaque CEM (Cross-Entropy Method) est une adaptation d'algorithme existant (Chang et al., 2025, Section 3, Algorithm 1) -- la nouveaute est dans l'application, pas dans la methode

**Questions ouvertes :**
- Les defenses par data-marking ou instruction-hierarchy (OpenAI) sont-elles efficaces contre des triggers optimises ?
- Comment un systeme RAG multi-retriever (fusion de resultats de plusieurs modeles d'embedding) resistrait-il ?

### Formules exactes

**Decomposition du payload** (Section 3) :
`malicious_content = trigger_fragment || attack_fragment`
trigger_fragment : optimise pour maximiser Recall@k
attack_fragment : encode l'objectif adversarial (exfiltration, manipulation, etc.)

**Optimisation CEM** (Section 3, Algorithm 1) :
Cross-Entropy Method pour construire le trigger fragment minimisant la distance cosinus dans l'espace d'embedding entre le trigger et la query cible, tout en preservant la coherence avec l'attack fragment.

**Metriques** :
- Recall@5 : proportion des queries ou le document malveillant est dans le top-5 des resultats, moyenne sur 100 queries (Section 4.1)
- ASR : fraction des queries ou le LLM suit l'instruction injectee (Figure 9)

Lien glossaire AEGIS : F15 (Sep(M) -- directement lie a la capacite de separation instruction/data), F22 (ASR), lies au RagSanitizer

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (RLHF ne distingue pas instructions et donnees) ; δ¹ (instruction hierarchy partiellement contournee) ; δ² (cible primaire -- empoisonnement RAG, directement lie au RagSanitizer) ; δ³ non traite
- **Conjectures :**
  - C1 (insuffisance δ¹) : **fortement supportee** -- les IPI optimisees contournent completement le prompt systeme via le canal de donnees externes
  - C2 (necessite δ³) : **supportee** -- la verification formelle de l'integrite des documents recuperes serait plus robuste que le filtrage
  - C5 (vulnerabilite RAG) : **fortement supportee** -- premiere demonstration end-to-end que les IPI sont praticables, pas seulement theoriques
- **Decouvertes :**
  - D-006 (IPI pratique) : **confirmee** -- la barriere de recuperation est franchie avec pres de 100% recall
  - D-007 (cout attaque faible) : **confirmee** -- $0.21 par query cible
  - D-015 (multi-modal) : **confirmee** -- la vulnerabilite s'etend au-dela du texte
- **Gaps :**
  - G-001 (evaluation medicale) : **non adresse**
  - G-009 (defense IPI) : **cree** -- aucune defense efficace identifiee
  - G-010 (multi-retriever defense) : **cree** -- systemes multi-embedding non testes
- **Mapping templates AEGIS :** directement lie aux chaines `rag_basic` (85%), `rag_fusion` (80%), `rag_multi_query` (80%), `rag_conversation` (75%) ; le RagSanitizer d'AEGIS est la defense pertinente

### Citations cles
> "a single poisoned email was sufficient to coerce GPT-4o into exfiltrating SSH keys with over 80% success" (Abstract, p.1)
> "near-100% retrieval across 11 benchmarks and 8 embedding models" (Abstract, p.1)
> "the vulnerability stems from the embedding space itself rather than the query modality" (Section 4.1)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute -- 11 datasets publics, 8 modeles d'embedding accessibles, cout mesure |
| Code disponible | Non mentionne |
| Dataset public | Oui -- 11 benchmarks publics utilises |
| Nature epistemique | [ALGORITHME] -- adaptation CEM avec evaluation empirique exhaustive ; pas de garantie theorique sur les bornes de recall |
