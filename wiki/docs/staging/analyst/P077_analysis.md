## [Wang, Jiang, Yu, Huang, 2025] — L'illusion de la separation des roles : raccourcis caches dans l'apprentissage des roles LLM

**Reference :** arXiv:2505.00626v2
**Revue/Conf :** ICML 2025, Vancouver (42nd International Conference on Machine Learning, PMLR 267)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P077_Wang_2025_IllusionRoleSeparation.pdf](../../assets/pdfs/P077_Wang_2025_IllusionRoleSeparation.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (57 chunks). Venue ICML 2025 confirmee dans le header du PDF : "Proceedings of the 42nd International Conference on Machine Learning, Vancouver, Canada. PMLR 267, 2025."

### Abstract original
> Large language models (LLMs) that integrate multiple input roles (e.g., system instructions, user queries, external tool outputs) are increasingly prevalent in practice. Ensuring that the model accurately distinguishes messages from each role -- a concept we call role separation -- is crucial for consistent multi-role behavior. Although recent work often targets state-of-the-art prompt injection defenses, it remains unclear whether such methods truly teach LLMs to differentiate roles or merely memorize known triggers. In this paper, we examine role-separation learning: the process of teaching LLMs to robustly distinguish system and user tokens. Through a simple, controlled experimental framework, we find that fine-tuned models often rely on two proxies for role identification: (1) task type exploitation, and (2) proximity to begin-of-text. Although data augmentation can partially mitigate these shortcuts, it generally leads to iterative patching rather than a deeper fix. To address this, we propose reinforcing invariant signals that mark role boundaries by adjusting token-wise cues in the model's input encoding. In particular, manipulating position IDs helps the model learn clearer distinctions and reduces reliance on superficial proxies.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les defenses contre la prompt injection semblent fonctionner mais reposent potentiellement sur la memorisation de patterns d'attaque plutot que sur une reelle differenciation des roles (system vs user) — "illusion de separation" (Section 1, p. 1).
- **Methode :** Framework experimental controle avec donnees "benignes" (training) et "adversariales" (evaluation) pour empecher la memorisation. Identification de 2 raccourcis : (1) exploitation du type de tache, (2) proximite au begin-of-text. Proposition de PFT (Position ID Fine-Tuning) : manipulation des position IDs en creant un gap entre tokens system et user (Section 3-6, p. 2-8 ; Figure 4, p. 6).
- **Donnees :** Gandalf Summarization, Gandalf Ignore, TensorTrust Hijacking, TensorTrust Extraction ; 114 + 500 samples par dataset ; Llama-3-8B et Gemma-2-2B (Section Appendix, p. 10).
- **Resultat :** SFT standard montre des raccourcis : accuracy chute de 0.8 a 0.4 avec 30 phrases inserees avant l'instruction cle (Figure 2, p. 3). PFT-256 et PFT-512 maintiennent une dominance sur tous les tests d'insertion (Figure 5, p. 10). PFT ne degrade pas l'utilite : accuracy 97-100% sur password dataset, KL divergence stable (Figure 6/8, p. 10-11).
- **Limite :** Framework simplifie a 2 roles (system/user) sans roles intermediaires (tool, memory) ; pas de test sur modeles >8B ; approach "find-and-fix" critiquee par les auteurs eux-memes comme fondamentalement limitee (Section 5, p. 6).

### Analyse critique
**Forces :**
- Contribution fondamentale : demontre que les defenses existantes reposent sur des raccourcis (memorisation de patterns, proximite positionnelle) plutot que sur une comprehension reelle de la hierarchie des roles — result majeur pour la communaute (Section 4, p. 3-5).
- Identification de 2 raccourcis precis et reproductibles : task-type exploitation (Section 4.1, p. 3) et proximity-to-BOT (Section 5, p. 5 ; Figure 3, p. 5).
- PFT (Position ID Fine-Tuning) : solution elegante et minimale — manipuler les position IDs pour creer un signal architectural de frontiere de role, sans modifier les poids du modele (Section 6, Figure 4, p. 6).
- PFT vs SFT-Delim : PFT surpasse les delimiteurs sur tous les benchmarks (Table 2, p. 8 ; Figure 5, p. 10) — confirme la superiorite de l'approche architecturale.
- ICML 2025 = venue A* en ML — poids scientifique maximal.

**Faiblesses :**
- Framework de 2 roles uniquement — les architectures agents modernes ont 4+ roles (system, user, tool, memory, assistant). La generalisation a >2 roles n'est pas demontree.
- PFT est un signal positionnel, pas semantique — un attaquant connaissant le gap de position IDs pourrait l'exploiter (attaque adaptive sur les position IDs).
- Modeles petits (Llama-3-8B, Gemma-2-2B) — validite sur des modeles commerciaux ou >70B non testee.
- Les datasets Gandalf et TensorTrust sont des benchmarks de prompt injection standard — pas de scenarios medicaux ou a haut risque.
- Pas de formule de la perte PFT — la methode est decrite operationnellement mais pas formalisee mathematiquement.

**Questions ouvertes :**
- PFT est-il complementaire a ISE (P076) ? Les deux manipulent des signaux d'embedding/position — peuvent-ils etre combines ?
- Les raccourcis identifies existent-ils aussi dans les modeles >70B ou RLHF-trained ?
- Comment PFT se comporte-t-il dans un contexte RAG ou les "donnees" ont une longueur variable et imprevisible ?

### Formules exactes
- **PFT (Position ID Fine-Tuning)** : Modification des position IDs par insertion d'un gap de taille d entre les tokens system et user. Position IDs originaux {0,1,...,n_sys, n_sys+1,...} deviennent {0,1,...,n_sys, n_sys+d+1, n_sys+d+2,...}. L'ordre interne au sein de chaque role est preserve (Figure 4, p. 6). [HEURISTIQUE — pas de borne theorique sur d optimal]
- Variantes testees : PFT-256 (d=256), PFT-512 (d=512) (Table 2, p. 8).
Lien glossaire AEGIS : F15 (Sep(M) — PFT vise directement a ameliorer la separation mesurable par Sep(M))

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (raccourcis dans l'alignement de base — PRIMAIRE), δ¹ (separation roles dans le contexte RAG — PERTINENT), δ² (separation system/user/tool dans les agents — PERTINENT mais non teste)
- **Conjectures :** C2 (shallow alignment) — SUPPORTEE TRES FORTEMENT : les defenses apprises reposent sur des raccourcis superficiels, pas sur une comprehension profonde ; C3 (separation instruction-donnee) — RAFFINEE : la separation est une "illusion" — les modeles ne separent pas vraiment, ils memorisent ; C5 (defense architecturale > defense prompt) — SUPPORTEE par PFT > SFT-Delim
- **Decouvertes :** D-003 (hierarchie instruction inexistante) — CONFIRMEE ET APPROFONDIE : meme apres fine-tuning, la hierarchie est un raccourci ; D-012 (shallow alignment) — CONFIRMEE : l'alignment est positionnel et task-type dependent, pas semantique
- **Gaps :** G-002 (defense architecturale) — PARTIELLEMENT ADRESSE par PFT ; G-009 (raccourcis dans les defenses apprises) — CREE comme nouveau gap fondamental
- **Mapping templates AEGIS :** #30-#40 (prompt injection indirecte — directement concerne par les raccourcis identifies)

### Citations cles
> "Fine-tuned models often rely on two proxies for role identification: (1) task type exploitation, and (2) proximity to begin-of-text." (Section Abstract, p. 1)
> "Such a find-and-fix approach merely leads to an endless cycle of discovering and patching." (Section 5, p. 6)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 10/10 |
| Reproductibilite | Haute — framework controle, datasets publics (Gandalf, TensorTrust), modeles open-source |
| Code disponible | Non specifie dans le papier |
| Dataset public | Oui (Gandalf, TensorTrust — publics) |
