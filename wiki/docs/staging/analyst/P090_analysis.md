# P090 : Analyse doctorale

## [Zhou et al., 2025] — The Hidden Risks of Large Reasoning Models: A Safety Assessment of R1

**Reference** : arXiv:2502.12659v4
**Revue/Conf** : Preprint, fevrier 2025 (mis a jour novembre 2025)
**Lu le** : 2026-04-07
> **PDF Source**: [literature_for_rag/P_LRM_2502.12659.pdf](../../assets/pdfs/P_LRM_2502.12659.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (88 chunks, ~87 755 caracteres)

---

### Abstract original

> The rapid development of large reasoning models (LRMs), such as OpenAI-o3 and DeepSeek-R1, has led to significant improvements in complex reasoning over non-reasoning large language models (LLMs). However, their enhanced capabilities, combined with the open-source access of models like DeepSeek-R1, raise serious safety concerns, particularly regarding their potential for misuse. In this work, we present a comprehensive safety assessment of these reasoning models, leveraging established safety benchmarks to evaluate their compliance with safety regulations. Furthermore, we investigate their susceptibility to adversarial attacks, such as jailbreaking and prompt injection, to assess their robustness in real-world applications. Through our multi-faceted analysis, we uncover four key findings: (1) There is a significant safety gap between the open-source reasoning models and the o3-mini model, on both safety benchmark and attack, suggesting more safety effort on open LRMs is needed. (2) The stronger the model's reasoning ability, the greater the potential harm it may cause when answering unsafe questions. (3) Safety thinking emerges in the reasoning process of LRMs, but fails frequently against adversarial attacks. (4) The thinking process in R1 models poses greater safety concerns than their final answers.
> — Source : PDF page 1

---

### Resume (5 lignes)

- **Probleme :** L'evaluation de securite des LRM ouverts (DeepSeek-R1) et proprietaires (o3-mini) est incomplete, notamment concernant le processus de raisonnement lui-meme (Zhou et al., 2025, Section 1, p. 1).
- **Methode :** Evaluation multi-facettes : benchmarks de securite (AirBench, MITRE CyberSecEval, XSTest), attaques adversariales (WildGuard jailbreak, prompt injection), analyse du thinking process vs reponse finale, et evaluation du niveau de nocivite via reward models (Zhou et al., 2025, Section 3, Table 1).
- **Donnees :** 5 benchmarks totalisant ~7 072 prompts (AirBench 5 694, MITRE 377, Code Interpreter 500, Phishing 200, XSTest 250) + 2 datasets d'attaque (WildGuard 810, Injection 251) ; 7 modeles testes (Zhou et al., 2025, Table 1, Section 3.2).
- **Resultat :** Gap de securite massif : o3-mini atteint 70.1% de safety rate sur AirBench contre 51.6% pour DeepSeek-R1 et 46.0% pour R1-70b ; le modele distille R1-70b est systematiquement moins sur que sa base Llama 3.3 (46.0% vs 52.9% sur AirBench) ; le contenu du thinking process est plus dangereux que la reponse finale (Zhou et al., 2025, Table 2, p. 4).
- **Limite :** Evaluation par GPT-4o comme juge (validation en Appendice A.2 mais pas d'accord inter-annotateurs humains), pas de propositions de defense (Zhou et al., 2025, Section 1).

---

### Analyse critique

**Forces :**

1. **Analyse multi-facettes unique** : c'est la premiere etude qui decompose systematiquement la securite en (a) benchmark standard, (b) thinking process vs reponse finale, (c) niveau de nocivite des reponses non-sures. Cette granularite est essentielle pour comprendre ou les LRM echouent (Section 3.1).

2. **Decouverte du "safety thinking" emergent** : les auteurs montrent que les LRM R1 developpent spontanement une pensee de securite dans leurs tags <think> — ils identifient le contenu nocif mais echouent ensuite a le refuser sous attaque adversariale (Section 4). Ce phenomene est central pour C7.

3. **Resultat critique sur la distillation** : le fine-tuning de raisonnement degrade la securite. R1-70b (distille depuis Llama 3.3) est systematiquement pire que Llama 3.3 en securite (Table 2), confirmant les observations de Qi et al. (2023) sur l'effet du SFT sur l'alignement. C'est un signal d'alarme pour la communaute open-source.

4. **Correlation capacite/nocivite** : quand un LRM repond de maniere non-sure, la reponse est plus nocive que celle d'un LLM non-raisonnant, car le raisonnement ameliore la qualite du contenu nocif (Section 5). Ce paradoxe amplifie les risques.

5. **Couverture des modeles proprietaires et ouverts** : l'inclusion de o3-mini et Gemini 2.5 comme points de reference permet d'identifier le gap de securite concretement.

**Faiblesses :**

1. **Pas de metriques statistiques robustes** : les safety rates sont rapportees sans intervalles de confiance ni tests de significativite. Sur des categories avec peu de prompts (Phishing : 200), les differences pourraient etre non-significatives.

2. **Pas de defense** : comme P087, l'article diagnostique sans proposer de remede.

3. **Thinking process comme contenu nocif** : les auteurs montrent que <think> contient plus de contenu nocif que la reponse finale, mais ne proposent pas de mecanisme pour filtrer ou superviser le processus de pensee. La question de savoir si le thinking process doit etre visible pour l'utilisateur est posee sans reponse.

4. **Versions des modeles evoluent** : les resultats datent de debut 2025 et les modeles ont ete mis a jour depuis (o3-mini, Gemini 2.5). Les resultats pourraient differer significativement avec les versions actuelles.

---

### Formules exactes

Aucune formule originale n'est introduite dans ce papier. Les metriques utilisees sont :
- Safety Rate = proportion de reponses classees "safe" par GPT-4o
- Harmfulness Level = score multi-attribut via reward models (Wang et al., 2024; Dorka, 2024)

Lien glossaire AEGIS : F22 (ASR, ici inverse = 1 - Safety Rate), F15 (Sep(M) — non mesure mais pertinent)

---

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF) : directement evalue. Le gap o3-mini vs R1 montre que l'effort d'alignement proprietaire (δ⁰ robuste) fait une difference massive.
  - δ¹ (system prompt) : teste via prompt injection (CyberSecEval)
  - δ² (sanitization) : non adresse
  - δ³ (tool control) : non adresse

- **Conjectures :**
  - **C7 (paradoxe raisonnement/securite) : FORTEMENT SUPPORTEE.** Finding (2) : "The stronger the model's reasoning ability, the greater the potential harm it may cause" est exactement l'enonce de C7. Finding (3) : le safety thinking emerge mais echoue = le raisonnement ne suffit pas a se proteger lui-meme. Finding (4) : le thinking process est plus dangereux que la reponse finale = le raisonnement produit du contenu nocif comme sous-produit.

- **Decouvertes :**
  - D-012 (CoT comme surface d'attaque) : confirmee via finding (4)
  - D-016 (distillation degrade securite) : confirmee via la comparaison R1-70b vs Llama 3.3

- **Gaps :**
  - G-010 (supervision du thinking process) : cree — comment filtrer le contenu <think> ?
  - G-011 (distillation safe) : cree — comment distiller sans degrader la securite ?

- **Mapping templates AEGIS :** Teste avec WildGuard (jailbreaks generiques) et CyberSecEval (prompt injection), couvrant les categories MITRE et OWASP. Correspondance avec nos templates de prompt injection directe (#01-#11) et indirecte (#19-#26).

---

### Citations cles

> "the distilled R1-70b consistently achieves a lower safety rate than Llama-3.3, suggesting that reasoning-supervised fine-tuning reduces a model's safety performance" (Section 4.1, p. 4)

> "across the majority of benchmarks tested, the content generated during the reasoning process of R1 models exhibits lower safety than their final completions" (Section 1, p. 2)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — benchmarks publics (AirBench, CyberSecEval, WildGuard, XSTest), modeles accessibles |
| Code disponible | Oui (page projet : https://r1-safety.github.io) |
| Dataset public | Oui (tous les benchmarks sont publics) |
| Nature epistemique | [EMPIRIQUE] — evaluation comparative sans contribution theorique |
| Type d'attaque | Survey / Safety Assessment |
| MITRE ATLAS | AML.T0051 (Prompt Injection — broad assessment) |
| OWASP LLM | LLM01 (Prompt Injection), LLM02 (Insecure Output Handling — thinking process) |
