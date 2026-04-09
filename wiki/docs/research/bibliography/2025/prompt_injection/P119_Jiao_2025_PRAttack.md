## [Jiao, Wang, Yang, 2025] — PR-Attack: Coordinated Prompt-RAG Attacks via Bilevel Optimization

**Reference** : arXiv:2504.07717v3, SIGIR 2025
**Revue/Conf** : SIGIR 2025 — CORE A*, peer-reviewed
**Lu le** : 2026-04-09
> **PDF Source**: `P119_jiao_pr_attack.pdf`
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (37 chunks dans aegis_bibliography)

### Classification AEGIS
- **Type d'attaque :** IPI coordonnee avec backdoor trigger dans le soft prompt
- **Surface ciblee :** Base de connaissances RAG + soft prompt du LLM
- **Modeles testes :** Vicuna 7B, Llama-2 7B, Llama-3.2 1B, GPT-J 6B, Phi-3.5 3.8B, Gemma-2 2B
- **MITRE ATLAS :** AML.T0051, AML.T0020
- **OWASP LLM :** LLM01, LLM06

### Resume (5 lignes)
- **Probleme :** les attaques RAG existantes (PoisonedRAG, GGPP) sont detectables et inefficaces quand le budget de poison est limite (Section 1, p.1-2).
- **Methode :** bilevel : upper-level = optimisation conjointe poisoned texts + soft prompt backdoor ; lower-level = retrieval MIPS. Trigger word 'cf'. Alternating optimization avec zeroth-order gradient estimator (Section 3.2-3.3, Algorithm 1, p.5).
- **Donnees :** NQ, HotpotQA, MS-MARCO ; 6 LLMs ; Contriever ; `b=20, n=15, k=5`, temperature 0.5 (Section 4.1, p.7).
- **Resultat :** ASR 91-100% sur tous les LLMs/datasets (Table 1, p.6). Llama-3.2 1B : 99%/98%/100%. Baselines 62-84%.
- **Limite :** acces requis au soft prompt = compromis developpeur. Pas de test contre GMTP, Kim et al. 2025.

### Pertinence these AEGIS — LIEN AVEC D-024 (CONTRAST CRUCIAL)
- **Couches delta :** δ¹ + δ².
- **Conjectures :** C2 (defense necessite δ³) — confirme echec defenses intra-pipeline ; C6 (medical) — "medical question-answering" mentionne.
- **Decouvertes :** D-024 **CONTRAST** — PR-Attack EXIGE (1) injection poisoned texts + (2) compromission soft prompt. D-024 n'EXIGE RIEN : pas d'acces base, pas de compromission prompt, pas de fine-tuning. ASR comparable (PR-Attack 91-100% vs D-024 96.7%) avec asymetrie massive de prerequis.
- **Gaps :** G-042 cote threat model distinct.
- **Mapping templates AEGIS :** famille "compromis infrastructure". Citation inline : `(Jiao et al., 2025, SIGIR, Table 1, p.6)`.

### Threat Model
| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | Grey-box : connait Contriever, injecte texts + modifie soft prompt |
| Acces | Base de connaissances RAG + soft prompt layer |
| Multi-turn | Non specifie |
| Objectif | Substitution de reponse |

### Citations cles
> "the proposed method consistently achieves ASRs of at least 90% across different LLMs and datasets" (Section 4.2, p.8)
> "this work represents the first attempt to jointly attack both the knowledge database and the prompt" (Section 1, p.2)
> "the first study to investigate attacks on RAG-based LLMs through the lens of bilevel optimization" (Section 3.4, p.5)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 — contrast important mais threat model tres different |
| Reproductibilite | Moyenne |
| Code disponible | Non cite dans le papier lu |
| Dataset public | Oui — NQ, HotpotQA, MS-MARCO |
| Nature epistemique | [ALGORITHME] avec [THEOREME] de complexite, convergence non prouvee |
