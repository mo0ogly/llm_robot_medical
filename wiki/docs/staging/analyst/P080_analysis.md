## [Chen, Wang, Carlini, Sitawarin, Wagner, 2025] — DefensiveTokens : Defense test-time contre la prompt injection

**Reference :** DOI:10.1145/3733799.3762982
**Revue/Conf :** ACM AISec '25 (Workshop on Artificial Intelligence and Security), Taipei, Taiwan, Octobre 2025. Co-located with ACM CCS.
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P080_Chen_2025_DefensiveTokens.pdf](../../assets/pdfs/P080_Chen_2025_DefensiveTokens.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (72 chunks). Venue ACM AISec '25 confirmee dans le PDF header.

### Abstract original
> When large language model (LLM) systems interact with external data to perform complex tasks, a new attack, namely prompt injection, becomes a significant threat. By injecting instructions into the data accessed by the system, the attacker is able to override the initial user task with an arbitrary task directed by the attacker. To secure the system, test-time defenses, e.g., defensive prompting, have been proposed for system developers to attain security only when needed in a flexible manner. However, they are much less effective than training-time defenses that change the model parameters. Motivated by this, we propose DefensiveToken, a test-time defense with prompt injection robustness comparable to training-time alternatives. DefensiveTokens are newly inserted as special tokens, whose embeddings are optimized for security. In security-sensitive cases, system developers can append a few DefensiveTokens before the LLM input to achieve security with a minimal utility drop.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les defenses test-time (defensive prompting) sont flexibles mais inefficaces ; les defenses training-time (StruQ, SecAlign) sont robustes mais rigides — trade-off flexibilite vs securite (Section 1, Table 1, p. 1-2).
- **Methode :** Tokens speciaux inseres dans le vocabulaire du modele dont les embeddings sont optimises par une loss defensive (StruQ loss). A l'inference, insertion de quelques DefensiveTokens avant l'input LLM dans les cas sensibles ; omission dans les cas non sensibles. Aucune modification des poids du modele (Section 2-3, p. 3-5).
- **Donnees :** 5 benchmarks de prompt injection : TaskTracker (>31K samples), Bipia, TGIA, StringMatching, SEP benchmarks ; 4 modeles 7B/8B (Llama-3.1-8B, Mistral-7B, Qwen-2.5-7B, Gemma-2-9B) (Section 4, p. 5-8).
- **Resultat :** ASR 0.24% moyen sur TaskTracker (>31K samples) contre injections manuelles (comparable aux defenses training-time StruQ/SecAlign). Embeddings des DefensiveTokens ont une norme L1 ~4332 vs ~34 pour le vocabulaire standard — 2 ordres de grandeur (Table 2, p. 7). Utilite preservee sur AlpacaEval2 (Section 4, p. 6-8).
- **Limite :** Defense uniquement contre les prompt injections (user benin, donnees malicieuses) — PAS contre les jailbreaks (user malicieux), system following attacks, ou data extraction. Impact sur l'utilite au-dela d'AlpacaEval2 non mesure (Section Conclusion, p. 9).

### Analyse critique
**Forces :**
- Innovation conceptuelle majeure : premiere defense test-time atteignant la robustesse des defenses training-time — "best of both worlds" flexibilite + securite (Table 1, p. 2).
- Equipe de premier plan : Nicholas Carlini (Google DeepMind/Anthropic) + David Wagner (UC Berkeley) = credibilite maximale en adversarial ML.
- Echelle d'evaluation massive : >31K samples sur TaskTracker — statistiquement robuste (Section 4, p. 6).
- ASR 0.24% contre injections manuelles = quasiment impenetrable pour les attaques non-adaptatives.
- Flexibilite deployable : le developpeur decide quand activer la defense sans changer le modele — ideal pour les deployements API (Section 1, p. 2).
- Insight sur la magnitude des embeddings : les DefensiveTokens ont une norme 100x superieure au vocabulaire — ils "ecrasent" les injections par la force du signal (Table 2, p. 7).

**Faiblesses :**
- Scope limite a la prompt injection indirecte uniquement — les jailbreaks directs (user malicieux) ne sont PAS couverts. Ceci est une limitation majeure pour un deploiement medical complet.
- Les DefensiveTokens a norme L1 ~4332 sont detectables — un attaquant adaptatif pourrait sonder le modele pour identifier la presence de ces tokens et concevoir des contournements.
- Pas de test contre des attaques adaptatives optimisees pour contourner les DefensiveTokens.
- 4 modeles 7-8B uniquement — pas de validation sur >13B ou modeles commerciaux.
- Le papier ne teste pas de scenarios cliniques — deploiement medical non valide.
- ACM AISec = workshop (pas conference principale A*) — publication solide mais pas au niveau ICML/NeurIPS principal.

**Questions ouvertes :**
- DefensiveTokens + ISE (P076) + PFT (P077) = defense en couches multi-niveau ?
- Comment les DefensiveTokens se comportent-ils avec un contexte RAG long (documents medicaux de plusieurs pages) ?
- La norme extreme des DefensiveTokens cree-t-elle des instabilites numeriques sur certaines architectures ?

### Formules exactes
- **Optimisation DefensiveToken** : min_{e_def} L_StruQ(e_def | model, adversarial_data) ou e_def sont les embeddings des tokens defensifs inseres dans le vocabulaire. Aucun poids du modele n'est modifie — seuls les embeddings des nouveaux tokens sont appris (Section 3, p. 4).
- **Norme des embeddings** : ||e_def||_1 ~ 4332 (avg), 4594 (max) pour Llama-3.1-8B-Instruct vs ||e_vocab||_1 ~ 34 (avg), 47 (max) pour les tokens du vocabulaire standard (Table 2, p. 7).
- **LoRA fine-tuning baseline** : r=64, lora_alpha=8, lora_dropout=0.1, target_modules=["q_proj", "v_proj"], 0.34% des poids modifies (Section 4.3, p. 7).
Lien glossaire AEGIS : F15 (Sep(M) — les DefensiveTokens creent un signal de separation extremement fort dans l'espace d'embedding), F22 (ASR — 0.24% = performance de reference)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (modification des embeddings d'entree — PERTINENT), δ¹ (defense contre injection indirecte via donnees RAG — PRIMAIRE : c'est la cible principale des DefensiveTokens), δ² (deploiement flexible dans un pipeline agent — PERTINENT)
- **Conjectures :** C3 (separation instruction-donnee) — SUPPORTEE TRES FORTEMENT : les DefensiveTokens creent un signal explicite de frontiere entre instructions et donnees ; C5 (defense architecturale > defense prompt) — SUPPORTEE : DefensiveTokens (embedding-level) >> defensive prompting ; C2 (shallow alignment) — SUPPORTEE indirectement : le fait que des tokens a haute norme suffisent a "eclipser" les injections montre que le modele pondere les signaux par magnitude, pas par comprehension
- **Decouvertes :** D-003 (hierarchie instruction non existante) — ADRESSEE par un mecanisme de force (norme) plutot que de comprehension ; D-015 (defense embedding-based) — CONFIRMEE avec la meilleure evidence a ce jour
- **Gaps :** G-002 (defense architecturale test-time) — ADRESSE pour les IPI ; G-005 (defense contre jailbreaks directs) — NON ADRESSE (explicitement hors scope) ; G-014 (defense en contexte medical) — NON ADRESSE
- **Mapping templates AEGIS :** #30-#50 (prompt injection indirecte — cible principale), N/A pour jailbreaks directs

### Citations cles
> "DefensiveTokens mitigate manually-designed prompt injections to an attack success rate (ASR) of 0.24% (averaged across four models), which is comparable to training-time defenses." (Section 1, p. 2)
> "The [DefensiveToken embeddings L1-norm] is two orders of magnitude larger [than vocabulary], hinting that it is almost impossible to find tokens in the vocabulary with similar defense performance." (Section 4.2, Table 2, p. 7)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute — code disponible (mentionne dans abstract), modeles open-source, benchmarks publics |
| Code disponible | Oui (mentionne dans abstract, URL non specifiee dans le texte extrait) |
| Dataset public | Oui (TaskTracker, Bipia, TGIA, StringMatching — tous publics) |
