# P093 : Analyse doctorale

## [Sabbaghi et al., 2025] — Adversarial Reasoning at Jailbreaking Time

**Reference** : arXiv:2502.01633v2
**Revue/Conf** : Preprint, fevrier 2025 (mis a jour juin 2025)
**Lu le** : 2026-04-07
> **PDF Source**: [literature_for_rag/P_LRM_2502.01633.pdf](../../assets/pdfs/P_LRM_2502.01633.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (84 chunks, ~83 306 caracteres)

---

### Abstract original

> As large language models (LLMs) are becoming more capable and widespread, the study of their failure cases is becoming increasingly important. Recent advances in standardizing, measuring, and scaling test-time compute suggest new methodologies for optimizing models to achieve high performance on hard tasks. In this paper, we apply these advances to the task of "model jailbreaking": eliciting harmful responses from aligned LLMs. We develop an adversarial reasoning approach to automatic jailbreaking that leverages a loss signal to guide the test-time compute, achieving SOTA attack success rates against many aligned LLMs, even those that aim to trade inference-time compute for adversarial robustness. Our approach introduces a new paradigm in understanding LLM vulnerabilities, laying the foundation for the development of more robust and trustworthy AI systems.
> — Source : PDF page 1

---

### Resume (5 lignes)

- **Probleme :** Le scaling du test-time compute ameliore les performances des LLM sur des taches difficiles, mais peut-il aussi etre exploite pour ameliorer l'efficacite des attaques adversariales ? (Sabbaghi et al., 2025, Section 1, p. 1)
- **Methode :** Framework de raisonnement adversarial en 3 modules : (1) attaquant LLM genere des prompts, (2) feedback LLM evalue via un signal de perte (logit vectors du modele cible), (3) refiner LLM optimise iterativement. Utilise 16 streams paralleles, 15 iterations, avec bucket sampling pour la diversite (Sabbaghi et al., 2025, Section 5.1, p. 7-8, Algorithm 1).
- **Donnees :** 50 taches echantillonnees uniformement depuis HarmBench (standard behaviors), verifiees manuellement, HarmBench judge pour l'evaluation (Sabbaghi et al., 2025, Section 5.1).
- **Resultat :** SOTA ASR sur de nombreux LLM alignes, incluant les modeles robustes. Avec un attaquant faible (Vicuna), ASR de 64% contre Llama-3-8B — 3x superieur a PAIR et TAP-T. En transfer multi-shot, 56% ASR sur o1-preview et 100% sur DeepSeek (Sabbaghi et al., 2025, Table 3-4, p. 8).
- **Limite :** Necessite les vecteurs de logits du modele cible (acces grey-box), ce qui limite l'applicabilite aux modeles proprietaires. Le transfer multi-shot adresse partiellement cette limitation (Sabbaghi et al., 2025, Section 5.2).

---

### Analyse critique

**Forces :**

1. **Paradigme novateur** : l'application du scaling de test-time compute a l'attaque adversariale est conceptuellement importante. Au lieu de chercher un seul prompt magique, on optimise iterativement via un signal de perte, comme on optimiserait un probleme d'optimisation classique. C'est l'equivalent offensif des lois de scaling a l'inference.

2. **Comparaison rigoureuse avec baselines** : l'evaluation contre PAIR, TAP-T, AutoDAN-Turbo, Rainbow Teaming, et "Adaptive Attack" (template + random search) est complete. La superiorite est demontree de maniere convaincante.

3. **Resultat sur attaquant faible** : le fait que Vicuna (modele mediocre) atteigne 64% ASR avec cette methode — contre ~20% avec PAIR/TAP-T — demontre que la methode d'optimisation compte plus que la capacite brute de l'attaquant (Table 3). C'est un resultat important pour la democratisation des attaques.

4. **Transfer vers modeles fermes** : le multi-shot transfer utilisant des surrogates (Algorithm 2) atteint 56% sur o1-preview et 100% sur DeepSeek sans acces aux logits. C'est une contribution pratique majeure.

5. **Ablation informative** : DeepSeek-R1 utilise comme attaquant heuristique (sans supervision) n'ameliore pas les performances, montrant que le raisonnement brut ne suffit pas — c'est le feedback guide qui compte (Section 5, ablation studies).

**Faiblesses :**

1. **Acces grey-box** : la methode principale necessite les logit vectors du modele cible, ce qui est un acces non trivial pour les modeles API-only. Le transfer multi-shot attenque cette limitation mais avec une perte d'efficacite.

2. **Cout computationnel eleve** : 15 iterations x 16 streams x feedbacks = beaucoup de queries. Le cout total n'est pas clairement rapporte, mais il est significativement superieur a PAIR.

3. **Benchmark limite** : 50 taches depuis HarmBench. Avec cette taille, les differences d'ASR ne sont pas testees statistiquement.

4. **Verification manuelle** : les auteurs mentionnent une verification manuelle des jailbreaks proposes (Appendice B), ce qui est positif mais non-scalable.

---

### Formules exactes

**Signal de perte** : utilisation des logit vectors du modele cible pour guider l'optimisation. Le loss est la negative log-likelihood de la reponse cible etant donnee le prompt adversarial :
- L_LM(P, y_I) = -log P_target(y_I | P)

**Transfer multi-shot** (Algorithm 2) :
- Optimise la perte moyenne sur r surrogates : (1/r) sum_{i=1}^r L_{LM_i}(P, y_I)
- Collecte tous les prompts, filtre par le juge

**Feedback et refinement** : 3 modules (Attacker, Feedback, Refiner) avec bucket sampling (n=16 prompts, k=2 buckets, m=8 feedbacks par iteration).

Lien glossaire AEGIS : F22 (ASR), aucune formule nouvelle a ajouter au glossaire.

---

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF) : directement attaque — meme les modeles "adversarially trained" sont contournables avec assez de compute
  - δ¹ (system prompt) : implicitement teste via HarmBench
  - δ² (sanitization) : non adresse
  - δ³ (tool control) : non adresse

- **Conjectures :**
  - **C7 (paradoxe raisonnement/securite) : SUPPORTEE indirectement.** La methode montre que le scaling de test-time compute est une arme a double tranchant : ce qui rend les modeles plus capables rend aussi les attaques plus puissantes. L'ablation montrant que DeepSeek-R1 comme attaquant heuristique ne suffit pas (le raisonnement seul ne suffit pas, il faut le feedback guide) nuance C7 — le raisonnement pur n'est pas suffisant, c'est le raisonnement guide qui est dangereux.

- **Decouvertes :**
  - D-018 (test-time compute scaling pour attaques) : NOUVELLE DECOUVERTE — le scaling de l'inference s'applique aussi au red-teaming automatise

- **Gaps :**
  - G-016 (defense contre test-time compute scaling adversarial) : cree — comment defendre quand l'attaquant peut aussi scaler son compute ?

- **Mapping templates AEGIS :** La methode est un meta-framework qui pourrait optimiser n'importe lequel de nos 97 templates. Le concept de feedback-guided refinement est analogue au moteur genetique AEGIS (croisement + mutation + fitness), mais avec un signal de perte plus precis (logits vs SVC score).

---

### Citations cles

> "We develop an adversarial reasoning approach to automatic jailbreaking that leverages a loss signal to guide the test-time compute, achieving SOTA attack success rates against many aligned LLMs" (Abstract, p. 1)

> "our algorithm achieves an ASR of 64% with Vicuna—more than three times the ASR achieved by PAIR and TAP-T" (Section 5.1, Table 3)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — HarmBench public, code publie (GitHub), modeles accessibles |
| Code disponible | Oui (Github, mentionne dans l'abstract) |
| Dataset public | Oui (HarmBench) |
| Nature epistemique | [ALGORITHME] — framework d'optimisation avec convergence empirique |
| Type d'attaque | Automatic Jailbreaking / Test-time Compute Scaling |
| MITRE ATLAS | AML.T0051.001 (Prompt Injection — Automated Optimization) |
| OWASP LLM | LLM01 (Prompt Injection) |
