## [Qian, 2026] — SilentRetrieval : détournement furtif du RAG par empoisonnement sémantiquement préservé

**Reference :** arXiv:2605.28074
**Revue/Conf :** KDD '26 — Proceedings of the 32nd ACM SIGKDD Conference on Knowledge Discovery and Data Mining V.2, Jeju Island, Corée, 9–13 août 2026. DOI : 10.1145/3770855.3818186
**Lu le :** 2026-06-15
> **PDF Source**: [literature_for_rag/P164_Qian_2026_SilentRetrievalRAGPoisoning.pdf](../../literature_for_rag/P164_Qian_2026_SilentRetrievalRAGPoisoning.pdf)
> **Statut**: [PREPRINT arXiv — publié KDD '26] — lu en texte complet (12 pages + appendices A-K)

---

### Abstract original

> Retrieval-Augmented Generation (RAG) mitigates LLM hallucinations but introduces a critical vulnerability: corpus integrity. We present SilentRetrieval, a two-stage data poisoning attack that hijacks RAG systems through adversarially crafted yet fluent documents. Stage 1 introduces Coordinated Beam Search (CBS), a multi-token joint optimization with a penalized fluency–similarity objective that preconditions a topically relevant host document to remain retrievable after payload insertion while constraining perplexity. Stage 2 employs Context-Adaptive Trigger Generation (CATG), a lightweight trigger-fusion step that uses a frozen LLM to generate triggers contextually integrated with document content. Under a one-poisoned-document-per-query evaluation with synthetic target answers, SilentRetrieval achieves 84.6%/81.3% HR@10 and 57.5%/54.8% ASR-LLM on Natural Questions (NQ, 361K-passage subset; not the standard 21M DPR corpus) and MS MARCO (8.8M passages), while maintaining near-benign perplexity (32.4 vs. 28.4). Cross-model evaluation across four target LLMs shows nontrivial effectiveness under a fixed CATG generator (48.6–57.5% ASR-LLM). Surrogate-transfer evaluation against unseen retrievers—including ColBERT and rebuilt indexes using commercial embedding models—yields 64.7% average HR@10 under the same injected-corpus protocol. In a sampled large-corpus evaluation built from a Wikipedia-scale 21M-passage construction, SilentRetrieval retains 74.2% HR@10 at a 0.016% poisoning ratio, characterizing large-corpus behavior under the sampled protocol. Combined retrieval-side and generation-side defenses reduce ASR-LLM to 25.6% at a 6× latency trade-off in our evaluated setting, and to 21.3% under the strongest evaluated configuration; adaptive attacks recover 6.2% HR@10 in the matched MiniLM-L6-v2 reranker setting. Human evaluation (n=600 documents, Krippendorff's α=0.74) shows substantially lower flag rates than disfluent baselines, while remaining numerically more suspicious than benign content at the current sample size (p ≈ 0.064).
> — Source : Abstract, p. 1

---

### Résumé (5 lignes)

- **Problème :** Les pipelines RAG supposent l'intégrité du corpus ; un adversaire capable d'injecter un document peut détourner la récupération et la génération. Les méthodes antérieures produisent du texte à haute perplexité (PPL > 150) facilement filtrable, ou ne manipulent pas la phase de génération. (Section 1, p. 1)
- **Méthode :** Attaque deux étapes — (1) CBS : optimisation multi-token par beam search avec pénalité de perplexité pour préconditionnement du document hôte ; (2) CATG : un LLM gelé (Llama-2-7B-Chat) génère un trigger contextuel fusionné au document optimisé, avec filtrage par entailment (> 0.8), cohérence cosinus (> 0.7), et budget PPL. (Sections 4.1–4.2, pp. 3–4)
- **Données :** NQ (3 452 requêtes test, corpus 361K passages — combinaison DPR positif/hard-négatif ~109K + échantillons Wikipedia) ; MS MARCO (6 980 requêtes dev, 8,8M passages) ; scalabilité testée jusqu'à 21M passages (1 500 requêtes stratifiées). Retrieveur : Contriever. Générateur principal : Llama-2-7B-Chat. Juge : GPT-4. (Section 5.1, p. 4)
- **Résultat :** NQ : HR@10 = 84,6% (CI [83,2%, 86,0%], p < 0,01 vs Joint-GCG), ASR-LLM = 57,5%, PPL-G2 = 32,4 vs bénin 28,4. MS MARCO : HR@10 = 81,3%, ASR-LLM = 54,8%, PPL = 33,1. Détection par audit PPL indépendant (τ = 50) : 8,7% seulement. (Table 1, p. 5 ; Table 11, Appendice F, p. 11)
- **Limite :** CBS requiert l'accès white-box aux gradients du retrieveur. Évaluation limitée à NQ et MS MARCO (QA factoid) — domaines biomédical/légal non testés. Le juge CATG est fixé à Llama-2-7B-Chat ; les attaques adaptatives sont évaluées uniquement contre MiniLM-L6-v2. Les LLMs cibles forts (GPT-4, Claude-3) ne sont pas testés. (Section 8, p. 9)

---

### Analyse critique

**Forces :**
- Triple objectif simultané — seule méthode parmi les 14 évaluées (Table 10, p. 11) à satisfaire retrieval + génération + furtivité dans un protocole unifié un-document-par-requête.
- Furtivité démontrée empiriquement : PPL-G2 = 32,4 contre 156,3 pour Joint-GCG (4,8× moins élevé) ; taux de détection PPL indépendant = 8,7% contre 94,2% pour Zhong et al. (Table 11, p. 11).
- Évaluation humaine rigoureuse (n = 600 documents, 10 annotateurs NLP, Krippendorff α = 0,74) : taux de signalement SilentRetrieval = 14,7% vs 83,3% pour Zhong et al. et 56,7% pour PoisonedRAG (Table 7, p. 7).
- Transfert surrogate documenté sur 5 systèmes de récupération hétérogènes (DPR, BGE-base, ColBERTv2, text-embedding-ada-002, Cohere embed-v3) : HR@10 moyen = 64,7% (Table 3, p. 5).
- Scalabilité jusqu'à 21M passages (taux d'empoisonnement 0,016%) : HR@10 = 74,2% (Table 8, p. 7).
- Protocole bootstrap 95% CI (1 000 rééchantillonnages), tests paired bootstrap sur les requêtes — rigueur statistique satisfaisante pour un preprint.

**Faiblesses :**
- Auteur unique (N = 1, City University of Hong Kong) — absence de revue contradictoire interne ; biais possible dans la présentation des résultats.
- Les baselines sont ré-implémentées dans un protocole unifié différent des papiers originaux : PoisonedRAG reporte 97% ASR avec 5 documents (vs 48,2% ASR-LLM dans ce protocole) ; Joint-GCG reporte ~100% ASR (vs 62,8% ici). Les comparaisons sont légitimes mais non directement substituables aux chiffres publiés (footnote 3, p. 4).
- CBS suppose un accès white-box au retrieveur — hypothèse forte qui limite la praticabilité réelle. Le transfer surrogate (64,7% HR@10) atténue mais ne résout pas ce problème.
- L'étude de perception Wikipedia (Appendice A) est de petite taille (n = 150 passages, 3 évaluateurs), non représentative des patrollers Wikipedia actifs, et ne modélise pas le pipeline d'injection complet (Section 8, p. 9).
- Les targets sont synthétiques (non des faits empoisonnés réels) — écart possible avec les scénarios réels.
- Aucun test sur des LLMs de grande taille (GPT-4, Claude-3) comme générateurs cibles.

**Questions ouvertes :**
- Détecteurs entraînés spécifiquement sur des exemples adversariaux préservant la fluidité (Section 9, p. 9).
- Extension des attaques adaptatives aux rerankers plus grands (MiniLM-L12-v2, MonoT5).
- RAG multi-modal (vision-langage) comme surface d'empoisonnement future.
- Augmentation de requêtes avec vérification de cohérence des réponses pour diluer l'influence d'un seul document.

---

### Formules exactes

**Objectif CBS — Pénalité fluidité-similarité (Stage 1) :**

```
d_opt = argmax_{d in T} sim(E(q_target), E(d)) - lambda * max(0, PPL(d) - tau_ppl)
```

Avec λ = 0,1 (poids pénalité fluidité), τ_ppl = 50 (95e percentile des documents NQ bénins, moyenne 28,4, std 12,7, 95e = 48,6).
(Section 4.1, Eq. 1, p. 3)

**Score de proposition gradient-guidé (CBS) :**

```
g_i = nabla_{e_i} sim(E(q_target), E(d^(t))) - lambda * nabla^PPL_i
```

où e_i est l'embedding du token i, nabla^PPL_i est un signal d'alignement textuel heuristique (tokeniseurs différents entre Contriever et GPT-2). Projection sur le vocabulaire : s_{i,j} = g_i^T W_V[j], top-K = 10 candidats retenus.
(Section 4.1, Eq. 2, p. 3)

**Perplexité GPT-2 (mesure de furtivité) :**

```
PPL(d) = exp( -1/|d| * sum_{i=1}^{|d|} log P(w_i | w_{<i}) )
```

(Section 4.1, Eq. 3, p. 3)

**Trigger CATG (Stage 2) :**

```
trigger = M(prompt(d_opt, a_target))
d_adv = d_opt ⊕ trigger
```

Prompt : "Continue the following passage with a sentence that naturally incorporates the claim: {a_target}. Match the passage's style, domain vocabulary, and narrative voice. Passage: {d_opt}".
(Section 4.2, Eqs. 4–5, p. 3–4)

**Objectif attaque adaptative contre reranker (Section 6.2) :**

```
d_opt = argmax_d [lambda_1 * s_bi(q,d) + lambda_2 * s_ce(q,d) - lambda_3 * max(0, PPL(d) - tau_ppl)]
```

où s_bi = score bi-encodeur, s_ce = score cross-encodeur.
(Section 6.2, Eq. 6, p. 6)

**Pareto Efficiency Score (PES, Appendice I) :**

```
PES = (HR@10 × ASR-LLM) / ln(PPL + 1)
```

SilentRetrieval : PES = 1 386 (NQ), 1 262 (MS MARCO) — meilleur parmi les baselines.
(Appendice I, p. 12)

---

### Pertinence thèse AEGIS

**Couches delta :**
- **δ¹ (surface RAG — prioritaire)** : SilentRetrieval cible directement la couche de récupération dense (Contriever, DPR, BGE, ColBERT, embeddings commerciaux). L'injection d'un document empoisonné dans le corpus est le vecteur principal. Lien direct avec les templates AEGIS ciblant le contexte RAG injecté.
- **δ² (manipulation de génération)** : CATG manipule la phase de génération via un trigger contextuel. L'effet est mesuré en ASR-LLM (juge GPT-4). Le transfer cross-modèle (48,6–57,5% ASR-LLM sur 4 LLMs) montre que δ² est atteint indépendamment du générateur.
- **δ³ (défenses intra-pipeline)** : les défenses combinées réduisent ASR-LLM à 21,3% mais au prix de 11× la latence — argument pour C2 (nécessité d'une couche δ³ robuste si δ¹/δ² insuffisamment défendus).

**Conjectures :**
- **C5 — "La similarité cosinus est insuffisante comme seule défense"** : SUPPORTÉ fortement. La détection PPL indépendante à τ = 50 ne détecte que 8,7% des documents SilentRetrieval (Table 11, p. 11). Les détecteurs appris (RAGuard simplifié : 34,2%, Mahalanobis : 31,6%) montrent une détection modérée, insuffisante. Les filtres de fluidité simples échouent contre les attaques qui préservent la fluidité. Evidence directe : "fluency-preserving attacks can often pass simple fluency filters and may require stronger detection strategies" (Section 6.4, p. 8).
- **C1 — "L'empoisonnement RAG est une menace réelle sur corpus à grande échelle"** : SUPPORTÉ. HR@10 = 74,2% à un taux d'empoisonnement de 0,016% sur 21M passages (Table 8, p. 7). Même avec corpus expansion, l'attaque reste efficace — "corpus expansion provides partial natural defense but is insufficient as a standalone strategy" (Section 6.6, p. 7).
- **C2 — "Des défenses δ³ layered sont nécessaires"** : SUPPORTÉ partiellement. La défense combinée (hybrid retrieval + reranker + passage isolation k=10) réduit ASR-LLM à 21,3% mais impose 11× la latence (Table 6, p. 6). L'attaque adaptative récupère 6,2% HR@10 dans le cadre MiniLM-L6-v2 (Table 5, p. 6) — arms-race documenté.

**Découvertes — cluster RAG poisoning :**
- **Cluster P054/P055/P139/P157/P164** : SilentRetrieval se distingue par la furtivité (PPL quasi-bénin = 32,4 vs > 150 pour PoisonedRAG/Joint-GCG) et l'optimisation conjointe retrieval+génération. Par rapport à P139 (CorruptRAG, single-doc, black-box) : SilentRetrieval est white-box mais plus efficace en retrieval (84,6% HR@10 vs CorruptRAG non évalué dans ce protocole). Par rapport à P157 (M3Att, médical) : SilentRetrieval est généraliste (NQ/MS MARCO) mais inclut un cas d'usage médical dans les case studies (Appendice J — substitution diabète/sulfonylureas). La nouveauté AEGIS est la combinaison furtivité + génération dans un protocole un-document strict.

**Gaps :**
- **Gap fiche31 (sécurité du query rewriting RAG / adversarial)** : partiellement adressé — SilentRetrieval ne cible pas le query rewriting mais démontre que l'ASR-P (persistence under query rephrasings) tombe à 35,6% en moyenne (Table 2, p. 5) ; 32,3% des succès ASR-LLM échouent sous reformulation (Appendice H, p. 11). Mode de défaillance principal : query reformulation shifting retrieval (43,5%). Ce résultat renforce gap fiche31 : le query rewriting peut être une défense naturelle sous-exploitée.
- **Nouveau gap potentiel** : détecteurs entraînés spécifiquement sur des exemples préservant la fluidité (non couvert par les 87 défenses de la taxonomie AEGIS actuellement).

**Mapping templates AEGIS :**
- Templates ciblant l'injection RAG indirect (IPI, surface δ¹) : pertinents pour tester si les payloads CATG passent le RagSanitizer AEGIS.
- Chains d'attaque RAG poisoning dans `agents/attack_chains/` — CBS/CATG fournit un blueprint pour un opérateur "contextual_trigger_fusion".
- Defense taxonomy item "cross-encoder reranking" (défense 87 AEGIS) directement évaluée — HR@10 chute de 11,4% (Table 4, p. 6).

---

### Citations clés

> "A practical RAG poisoning attack must simultaneously (1) achieve retrieval hijacking, (2) manipulate LLM generation, and (3) remain substantially less suspicious than prior attack documents under automated filters and human inspection."
> (Section 1, Introduction, p. 1)

> "SilentRetrieval achieves the highest HR@10 (84.6%, CI: [83.2%, 86.0%], p<0.01 vs. Joint-GCG) with near-benign perplexity (PPL-G2: 32.4 vs. 28.4 benign). Joint-GCG achieves higher ASR-LLM (62.8%) but at 4.8× higher perplexity, making it much more exposed under our simple independent PPL audit (94.2% detection at τ=50 vs. 8.7% for SilentRetrieval)."
> (Section 5.2, p. 5)

> "Learned detectors (a simplified RAGuard-style detector and Mahalanobis scoring) show moderate detection (31.6–34.2%), suggesting that fluency-preserving attacks can often pass simple fluency filters and may require stronger detection strategies."
> (Section 6.4, p. 8)

> "Corpus integrity is a first-class security concern: in our evaluation, fluency-preserving attacks often pass a simple PPL-based audit at the calibrated threshold (8.7% detection) and are much harder for human annotators to flag than prior disfluent attacks."
> (Section 9, Conclusion — Key Takeaways, p. 9)

> "Attack effectiveness declines under the sampled scaling protocol: HR@10 drops from 86.4% (100K) to 74.2% (21M, 95% CI: [72.2%, 76.2%]), a 12.2% absolute decrease across ∼210× corpus expansion."
> (Section 6.6, p. 7)

> "Injecting N=3 documents per query raises HR@10 to 94.3% and ASR-LLM to 69.2%."
> (Appendice H, p. 11)

---

### Classification

| Champ | Valeur |
|-------|--------|
| **SVC pertinence AEGIS** | 8/10 — attaque RAG furtive avec évaluation rigoureuse, directement actionnable pour δ¹/δ² |
| **Reproductibilité** | Moyenne — protocole détaillé (CBS hyperparamètres, CATG prompt verbatim fourni), mais CBS requiert accès white-box au retrieveur Contriever ; pas de code public mentionné |
| **Code disponible** | Non mentionné dans le papier |
| **Dataset public** | Oui — NQ (361K, protocole DPR) et MS MARCO (8,8M) sont publics |
| **Statut** | [PREPRINT — publié KDD '26, DOI vérifié] — single author, City University of Hong Kong |
| **Nature épistémique** | [EMPIRIQUE] — résultats expérimentaux sur benchmarks NQ/MS MARCO, pas de garanties théoriques sur la convergence CBS |
| **Couches delta** | δ¹ (prioritaire), δ², δ³ (défenses) |
| **Conjectures** | C5 SUPPORTÉ (fortement), C1 SUPPORTÉ, C2 SUPPORTÉ partiellement |
| **Gaps adressés** | fiche31 (partiellement — persistence under rephrasings) |
| **Cluster corpus** | P054, P055, P139, P157, P164 (RAG poisoning) |
