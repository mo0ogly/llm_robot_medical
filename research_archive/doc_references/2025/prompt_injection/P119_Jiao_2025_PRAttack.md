## [Jiao, Wang, Yang, 2025] — PR-Attack: Coordinated Prompt-RAG Attacks via Bilevel Optimization

**Reference** : arXiv:2504.07717v3, SIGIR 2025
**Revue/Conf** : SIGIR 2025 — CORE A*, peer-reviewed (ACM ISBN 979-8-4007-1592-1/2025/07)
**Lu le** : 2026-04-09
> **PDF Source**: [literature_for_rag/P119_jiao_pr_attack.pdf](../../literature_for_rag/P119_jiao_pr_attack.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (37 chunks dans aegis_bibliography)

### Classification AEGIS
- **Type d'attaque :** IPI (indirect prompt injection) coordonnee avec backdoor trigger dans le soft prompt
- **Surface ciblee :** Base de connaissances RAG + soft prompt du LLM (joint attack)
- **Modeles testes :** Vicuna 7B, Llama-2 7B, Llama-3.2 1B, GPT-J 6B, Phi-3.5 3.8B, Gemma-2 2B
- **Defense evaluee :** aucune explicite (focus effectivite et stealth)
- **MITRE ATLAS :** AML.T0051 (Prompt Injection), AML.T0020 (Poison Training Data)
- **OWASP LLM :** LLM01, LLM06

### Resume (5 lignes)
- **Probleme :** les attaques RAG existantes (PoisonedRAG, GGPP) sont detectables et inefficaces quand le budget de poison est limite (Section 1, p.1-2).
- **Methode :** formulation bilevel : upper-level = optimisation conjointe des poisoned texts + soft prompt backdoor ; lower-level = retrieval MIPS. Trigger word 'cf'. Alternating optimization avec zeroth-order gradient estimator (Section 3.2-3.3, p.4-5, Eq. 2-11, Algorithm 1, p.5).
- **Donnees :** NQ, HotpotQA, MS-MARCO ; 6 LLMs ; Contriever retriever ; `b=20, n=15, k=5`, temperature 0.5 (Section 4.1, p.7).
- **Resultat :** PR-Attack ASR entre 91-100% sur tous les LLMs/datasets (Table 1, p.6). Llama-3.2 1B : 99%/98%/100% (NQ/HotpotQA/MSMarco). Baselines state-of-the-art entre 62-84%.
- **Limite :** necessite acces au backdoor trigger dans le soft prompt = compromis developpeur. Pas d'evaluation de defenses recentes (GMTP, Kim et al. 2025).

### Pertinence these AEGIS — LIEN AVEC D-024 (CONTRAST CRUCIAL)
- **Couches delta :** δ¹ (retrieval/base de connaissances) + δ² (orchestration via soft prompt).
- **Conjectures :** C2 (defense necessite δ³) — PR-Attack confirme que les defenses intra-pipeline echouent contre des payloads optimises ; C6 (medical) — applications mentionnees "medical question-answering" (Section 1, p.1).
- **Decouvertes :** D-024 **CONTRAST** — PR-Attack EXIGE (1) injection de texts poisoned dans la base + (2) compromission du soft prompt (trigger 'cf'). D-024 n'EXIGE RIEN : pas d'acces a la base de connaissances, pas de compromission du prompt orchestrateur, pas de fine-tuning. Le modele s'injecte lui-meme via le HyDE expansion step. ASR comparable (PR-Attack 91-100% vs D-024 96.7%) mais D-024 strictement plus puissant en asymetrie de prerequis.
- **Gaps :** G-042 cote threat model distinct.
- **Mapping templates AEGIS :** famille "compromis infrastructure" — pas d'equivalent direct dans les 97 templates. Mapping chaines : `rag-medical`, `rag-basic` si extension a base compromise. Citation inline : `(Jiao et al., 2025, SIGIR, Table 1, p.6)`.

### Threat Model
| Composante | Valeur |
|-----------|--------|
| Capacites attaquant | Grey-box : connait Contriever, injecte texts ET modifie soft prompt |
| Acces | Base de connaissances RAG + soft prompt layer |
| Multi-turn | Non specifie |
| Objectif | Substitution de reponse (target answer substitue a correct answer) |

### Citations cles
> "the proposed method consistently achieves ASRs of at least 90% across different LLMs and datasets" (Section 4.2, p.8)
> "this work represents the first attempt to jointly attack both the knowledge database and the prompt" (Section 1, p.2)
> "the first study to investigate attacks on RAG-based LLMs through the lens of bilevel optimization and to provide a theoretical complexity guarantee." (Section 3.4, p.5)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 7/10 — contrast important mais threat model tres different |
| Reproductibilite | Moyenne — algorithme decrit mais code non cite explicitement dans le texte lu |
| Code disponible | Non cite dans le papier lu |
| Dataset public | Oui — NQ, HotpotQA, MS-MARCO |
| Nature epistemique | [ALGORITHME] avec [THEOREME] de complexite (Section 3.4) — convergence non prouvee |
