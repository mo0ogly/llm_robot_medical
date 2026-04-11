## [Kanithi, Christophe, Pimentel et al., 2026] — MEDIC : Indicateurs avances pour la securite et l'utilite clinique des LLM

**Reference :** arXiv:2409.07314v2
**Revue/Conf :** Preprint (M42 Health, Abu Dhabi). Leaderboard public HuggingFace.
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P073_Kanithi_2026_MEDIC.pdf](../../assets/pdfs/P073_Kanithi_2026_MEDIC.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (70 chunks)

### Abstract original
> While Large Language Models (LLMs) achieve superhuman performance on standardized medical licensing exams, these static benchmarks have become saturated and increasingly disconnected from the functional requirements of clinical workflows. To bridge the gap between theoretical capability and verified utility, we introduce MEDIC, a comprehensive evaluation framework establishing leading indicators across various clinical dimensions. Beyond standard question-answering, we assess operational capabilities using deterministic execution protocols and a novel Cross-Examination Framework (CEF), which quantifies information fidelity and hallucination rates without reliance on reference texts. Our evaluation across a heterogeneous task suite exposes critical performance trade-offs: we identify a significant knowledge-execution gap, where proficiency in static retrieval does not predict success in operational tasks such as clinical calculation or SQL generation. Furthermore, we observe a divergence between passive safety (refusal) and active safety (error detection), revealing that models fine-tuned for high refusal rates often fail to reliably audit clinical documentation for factual accuracy.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les benchmarks medicaux statiques (USMLE, MedQA) sont satures et deconnectes des exigences operationnelles cliniques ; les performances de rappel ne predisent pas la competence fonctionnelle (Section 1, p. 1).
- **Methode :** Framework MEDIC a 5 dimensions : Medical reasoning, Ethical and bias concerns, Data and language understanding, In-context learning, Clinical safety. Evaluation hybride deterministe + Cross-Examination Framework (CEF) sans texte de reference (Section 2, p. 2-3).
- **Donnees :** Suite heterogene : MedQA, MedMCQA, PubMedQA, MedCalc, EHRSQL, DischargeMe, ACI-Bench, MEDEC, Med-Safety + benchmarks generaux GSM8K, AIME (Table 1, Section 2, p. 3).
- **Resultat :** Knowledge-execution gap significatif : les modeles performants en QA echouent sur MedCalc/EHRSQL. Divergence passive safety vs active safety : refusal rates proches de 1 sur Med-Safety mais performance MEDEC (detection d'erreurs) effondree — DeepSeek-V3.1 meilleur a 58.46% Error Flag Accuracy (Table 2, p. 8).
- **Limite :** LLM-as-a-judge susceptible aux biais (self-preference, length bias) ; benchmarks safety centres sur le medecin (pas patients/infirmiers) ; metriques automatisees = indicateurs avances, pas substitut aux essais cliniques reels (Section Limitations, p. 11).

### Analyse critique
**Forces :**
- Distinction fondamentale passive safety (refusal) vs active safety (error detection) — contribution conceptuelle majeure pour la these (Section 3.4, Figure 4b, p. 8).
- CEF (Cross-Examination Framework) pour quantifier hallucinations sans texte de reference — methodologiquement innovant pour les taches generatives (Section 2, p. 3).
- Leaderboard public HuggingFace pour suivi temporel des modeles (https://huggingface.co/spaces/m42-health/MEDIC-Benchmark).
- Couverture de modeles recents incluant DeepSeek-V3.1, GPT-OSS-120B, Llama-4-Maverick, Qwen3-235B (Table 2, p. 8).

**Faiblesses :**
- Pas d'evaluation adversariale (jailbreaking, prompt injection) — le volet "Clinical safety" se limite a Med-Safety (refusal) et MEDEC (error detection), pas de robustesse adversariale.
- Phi-4 a 3.02% sur Error Flag Accuracy et 0.60% sur Rouge-L (Table 2, p. 8) — absence d'analyse expliquant cette catastrophe.
- Les 5 dimensions MEDIC ne couvrent pas la robustesse aux attaques — dimension securite manquante.
- Evaluation sous conditions uniformes = scores divergent des metriques officielles des vendeurs (Section 3.1, p. 5).

**Questions ouvertes :**
- Le knowledge-execution gap persiste-t-il sous pression adversariale ?
- La divergence passive/active safety est-elle un artefact du fine-tuning RLHF ou une limitation fondamentale de l'architecture ?

### Formules exactes
- CEF (Cross-Examination Framework) : pas de formule explicite extraite — methode decrite algorithmiquement (Section 2). [ABSTRACT SEUL pour la formule CEF]
- Metriques MEDEC : Error Flag Accuracy, Sentence Detection Accuracy, Rouge-L, BLEU-4, BERTScore (Table 2, p. 8).
Lien glossaire AEGIS : F22 (ASR — pertinent par analogie avec les metriques de compliance)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (passive safety = alignement RLHF — PRIMAIRE), δ¹ (N/A), δ² (active safety = audit clinique par le modele — PERTINENT pour les pipelines multi-agents)
- **Conjectures :** C1 (separation safety/utility) — SUPPORTEE FORTEMENT par le knowledge-execution gap ; C2 (shallow alignment) — SUPPORTEE par la divergence passive/active safety : le refusal ne predit pas la capacite d'audit
- **Decouvertes :** D-012 (shallow alignment RLHF) — CONFIRMEE : alignment passif (refusal) ne generalise pas a l'audit actif
- **Gaps :** G-003 (metriques composites de securite clinique) — PARTIELLEMENT ADRESSE par MEDIC 5 dimensions ; G-020 (active safety evaluation) — CREE : nouveau gap identifie
- **Mapping templates AEGIS :** N/A — pas de templates d'attaque, mais framework d'evaluation complementaire

### Citations cles
> "We identify a significant knowledge-execution gap, where proficiency in static retrieval does not predict success in operational tasks." (Section 1, Abstract, p. 1)
> "Models fine-tuned for high refusal rates often fail to reliably audit clinical documentation for factual accuracy." (Section 3.4, p. 8)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 |
| Reproductibilite | Haute — leaderboard public, benchmarks standards, evaluation deterministe |
| Code disponible | Oui (leaderboard HuggingFace : https://huggingface.co/spaces/m42-health/MEDIC-Benchmark) |
| Dataset public | Oui (benchmarks publics existants agreges) |
