## [Yoon, Jung, Yoon, Park, 2025] — Hypothetical Documents or Knowledge Leakage? Rethinking LLM-based Query Expansion

**Reference :** arXiv:2504.14175v2 (4 Jun 2025)
**Revue/Conf :** ACL 2025 Findings — CORE A*
**Lu le :** 2026-04-09
> **PDF Source**: [literature_for_rag/P117_yoon_hypothetical_knowledge_leakage.pdf](../../literature_for_rag/P117_yoon_hypothetical_knowledge_leakage.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (32 chunks dans aegis_bibliography)

### Abstract original
> "Query expansion methods powered by large language models (LLMs) have demonstrated effectiveness in zero-shot retrieval tasks. These methods assume that LLMs can generate hypothetical documents that, when incorporated into a query vector, enhance the retrieval of real evidence. However, we challenge this assumption by investigating whether knowledge leakage in benchmarks contributes to the observed performance gains. Using fact verification as a testbed, we analyze whether the generated documents contain information entailed by ground-truth evidence and assess their impact on performance. Our findings indicate that, on average, performance improvements consistently occurred for claims whose generated documents included sentences entailed by gold evidence. This suggests that knowledge leakage may be present in fact-verification benchmarks, potentially inflating the perceived performance of LLM-based query expansion methods."
> — Source : PDF page 1, Abstract

### Resume (5 lignes)
- **Probleme :** les gains de performance de HyDE et Query2doc sont-ils reels ou resultent-ils d'une fuite de connaissances memorisees depuis les corpus de pre-entrainement ? (Section 1, p.1)
- **Methode :** pour chaque couple (claim, document hypothetique), NLI (GPT-4o-mini) determine si une phrase de d est entailled par une evidence gold e. Classification binaire matched (M) / unmatched (~M) (Section 3.3, p.3).
- **Donnees :** 3 benchmarks (FEVER 6,666 claims / SciFact 693 / AVeriTeC 3,563), 7 LLMs (GPT-4o-mini, Claude-3-haiku, Gemini-1.5-flash, Llama-3.1-8b/70b, Mistral-7b, Mixtral-8x7b), 8 repetitions par condition (Section 4, p.3-4, Table 1).
- **Resultat :** proportion de claims matched entre 27.6% (Gemini-1.5-flash + HyDE sur SciFact) et 83.5% (GPT-4o-mini + HyDE sur FEVER) ; gain QE concentre quasi exclusivement sur les claims M ; sur les claims ~M, HyDE FAIT PIRE que Contriever baseline (Recall@5 = 23.4 vs 26.8 sur FEVER, p.5 Table 4).
- **Limite :** pas de lien causal etabli entre donnees d'entrainement specifiques et generation (auteurs, Section Limitations p.6) ; scope limite au fact-verification (3 datasets, 1 domaine).

### Analyse critique
**Forces :**
- Design experimental propre : 7 LLMs (3 proprietary + 4 open), 3 benchmarks, 8 repetitions, p<0.001 pour comparaison M vs ~M (Section 4, p.5, Table 4).
- Protocole NLI reproductible, module `spaCy en_core_web_lg` + GPT-4o-mini + filtrage ROUGE-2 pour reproductions de claim (threshold 0.95, Section 3.3, p.3).
- Demonstration empirique d'un mecanisme jusqu'ici seulement soupconne : "the first empirical demonstration in the context of fact verification and query expansion" (Section 5 Discussion, p.5).
- Mise en perspective avec la litterature sur benchmark contamination (Deng et al. 2023 ; Xu et al. 2024b ; Kandpal et al. 2023, Section 2 p.2).

**Faiblesses :**
- Pas de lien causal (les auteurs le reconnaissent explicitement en Section Limitations, p.6). Il s'agit d'une correlation comportementale entre entailment et gain de performance.
- NLI assigne par un LLM (GPT-4o-mini) qui peut lui-meme souffrir de biais de memorisation. Un sample manuel annote confirme la tendance (Table A4) mais ne resout pas totalement la question.
- Generalisation limitee : seuls les benchmarks fact-verification sont etudies. Factual QA, open-domain QA, medical QA ne sont pas couverts.
- Pas d'etude d'impact sur l'architecture du retriever (Contriever uniquement comme encodeur dense).

**Questions ouvertes :**
- Quelle fraction du "leakage" provient de la memorisation verbatim vs de la generalisation abstractive de connaissances multi-sources ?
- Le mecanisme est-il amplifiable adversarialement ? Les auteurs ne posent jamais cette question (point crucial pour D-024).
- Comment se comporte HyDE sur des connaissances VRAIMENT non vues (post-cutoff, niche, privees) ?

### Pertinence these AEGIS — **LIEN AVEC D-024 (CRITIQUE)**
- **Couches delta :** δ¹ (retrieval) principalement, δ² (orchestration du pipeline query-expansion) secondairement.
- **Conjectures :** C2 (la defense necessite un ancrage δ³ externe au modele) — ce papier demontre empiriquement que δ¹ SEUL ne peut pas separer hallucination de connaissance reelle sur les benchmarks ou le LLM a "vu" les cibles. C6 (pertinence medicale) — SciFact est un corpus scientifique, premisse applicable a medical RAG.
- **Gap adresse :** G-042 (defense HyDE). Ce papier NE PROPOSE PAS de defense, il expose le mecanisme. Il nourrit le gap cote threat model.
- **Relation a D-024 (BENIGN ANALOG / CLEF DE POSITIONNEMENT) :**
  - Yoon et al. (2025) demontrent que les gains de HyDE viennent majoritairement de cas ou le modele reproduit (partiellement) la gold evidence memorisee. C'est le mecanisme BENIN : le modele "fuit" de la verite.
  - D-024 (AEGIS, 2026-04) est l'EXPLOITATION ADVERSARIALE du meme mecanisme : au lieu de laisser le modele fuir des faits vrais memorises, on le prompt de maniere a ce qu'il FABRIQUE de l'autorite institutionnelle (classification FDA, avertissements de securite) qui sera ensuite reinjectee comme contexte. Le mecanisme est identique (HyDE accorde credibilite semantique a la sortie du LLM comme si c'etait une source externe) — SEULE la charge utile change (memorise+vrai vs fabrique+hostile).
  - Yoon et al. ne mentionnent jamais le mot "security", "attack", "adversarial", "injection". Le framing securite est absent. Notre contribution D-024 est donc strictement orthogonale et complementaire : meme experimentation scientifique du mecanisme, framing threat model completement different.
  - CITATION DIRECTE POUR D-024 : Yoon et al. (2025) serviront de "benign analog" dans Section 2 (Related Work) du manuscrit D-024, justifiant que le mecanisme est empiriquement reel et pas un artefact de nos prompts. Citation inline obligatoire : `(Yoon et al., 2025, ACL Findings, Section 4, Table 4, p.5)`.

### Citations cles
> "QE methods were effective, on average, only when the generated documents included sentences entailed by gold evidence." (Section 1 Introduction, p.2)
> "performance on unmatched claims was lower than that of the corresponding baseline methods without query expansion—BM25 for Query2doc and Contriever for HyDE." (Section 4 Experimental Results, p.5)
> "the seven LLMs studied in this paper were likely exposed to knowledge sources from the three benchmarks during training" (Section 5 Discussion, p.5)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 — le papier le plus proche de D-024 dans toute la litterature accessible au 2026-04 |
| Reproductibilite | Haute — 7 LLMs publics/API, 3 datasets publics, code NLI decrit, 8 reps |
| Code disponible | Pas de lien explicite dans le texte lu (Appendices B, E mentionnes) |
| Dataset public | Oui — FEVER, SciFact, AVeriTeC tous publics |
| Nature epistemique | [EMPIRIQUE] — correlation observee, pas de garantie theorique |
