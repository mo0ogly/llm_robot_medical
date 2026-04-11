## [Chang, Li, Huang, Jiang, Jia, Xiong, Wang, Li & Wang, 2026] --- Know Thy Enemy: Securing LLMs Against Prompt Injection via Diverse Data Synthesis and Instruction-Level Chain-of-Thought Learning

**Reference :** arXiv:2601.04666v1
**Revue/Conf :** Preprint arXiv, Institute of Software Chinese Academy of Sciences / NTU, 2026 [PREPRINT]
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P038_2601.04666.pdf](../../assets/pdfs/P038_2601.04666.pdf)
> **Statut**: [ARTICLE VERIFIE] --- lu en texte complet via ChromaDB (73 chunks fulltext, 72587 caracteres)

### Abstract original
> Large language model (LLM)-integrated applications have become increasingly prevalent, yet face critical security vulnerabilities from prompt injection (PI) attacks. Defending against PI attacks faces two major issues: malicious instructions can be injected through diverse vectors, and injected instructions often lack clear semantic boundaries from the surrounding context, making them difficult to identify. To address these issues, we propose InstruCoT, a model enhancement method for PI defense that synthesizes diverse training data and employs instruction-level chain-of-thought fine-tuning, enabling LLMs to effectively identify and reject malicious instructions regardless of their source or position in the context. We evaluate InstruCoT across three critical dimensions: Behavior Deviation, Privacy Leakage, and Harmful Output.
> --- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les attaques par injection de prompt exploitent la diversite des vecteurs (multi-vector injection, Issue 1) et l'absence de frontieres semantiques claires entre instructions legitimes et malveillantes (ambiguous semantic boundaries, Issue 2) (Section 1, Figure 1, p.1-2)
- **Methode :** InstruCoT en 2 composantes : (1) synthese de donnees d'entrainement diversifiees couvrant differents types d'injection, positions (user/data region), et strategies ; (2) fine-tuning avec chaine de pensee au niveau instruction (CoT a 3 etapes : Instruction Perception, Violation Comprehension, Response Projection) (Section 3, p.3-5)
- **Donnees :** 4 LLM open-source (Llama-3.1-8B, Llama-3-8B, Qwen-2.5-7B, Qwen-3-8B), 3 dimensions d'evaluation, 10+ types d'attaque par dimension, 6 baselines (Clean, ISE, MetaSec, IP, PromptArmor, InSFT) (Section 4-5, Table 3)
- **Resultat :** DR moyens : 92.5% Behavior Deviation (direct PI) et 93.4% (indirect PI), 98.0% Privacy Leakage (ShareGPT) et 98.4% (Unatural), 90.9% Harmful Output ; surpasse toutes les baselines ; utilite preservee a 82.9% Win Rate (Section 5, Table 3, Figure 4)
- **Limite :** Evaluation limitee aux modeles 7-8B ; latence du CoT non mesuree ; attaques adaptatives non testees (Section Limitations, p.10)

### Analyse critique

**Forces :**

1. **Approche metacognitive originale (CoT instruction-level).** Le modele raisonne explicitement sur la nature des instructions en 3 etapes : Instruction Perception (identifier la source et la position de chaque instruction dans le contexte), Violation Comprehension (evaluer si une instruction viole les politiques de securite), Response Projection (generer la reponse appropriee en ignorant les instructions malveillantes). Les evaluations de qualite du CoT montrent une precision > 98% sur les 3 composantes (Section 5.1, Table 2, p.6-7).

2. **Resultats superieurs sur les 3 dimensions.** InstruCoT surpasse systematiquement 6 baselines sur les 3 dimensions d'evaluation (Section 5.2, Table 3) :
   - Behavior Deviation : 91.5% DR direct, 93.4% DR indirect vs meilleure baseline MetaSec (85.9% indirect seulement)
   - Privacy Leakage : 97.6% (ShareGPT), 98.4% (Unatural) vs ISE (91.2%/91.3%)
   - Harmful Output : 90.9% vs InSFT (83.5%)
   Le gain est particulierement marque sur les attaques directes ou MetaSec ne performe qu'a 51.0% (Section 5.2, Table 3, p.7-8).

3. **Ablation CoT vs InSFT demontrant la valeur ajoutee du raisonnement.** InstruCoT (avec CoT) surpasse InSFT (memes donnees sans CoT) de 38.0% en DR direct et 33.4% en DR indirect pour la dimension Behavior Deviation. Cette difference massive demontre que le raisonnement explicite sur les instructions est la cle, pas seulement la diversite des donnees (Section 5.2, Table 3, comparaison InSFT vs InstruCoT).

4. **Preservation de l'utilite.** Win Rate moyen de 82.9% sur 4 LLM, representant une amelioration de 1.5%-11.4% par rapport aux baselines. Cela contraste avec le trade-off observe pour Sep(M) dans P024 (utilite : 67.8% → 19.2%, Zverev et al., 2025, ICLR, Table 2) (Section 5.2, Figure 4, p.9).

5. **Robustesse cross-attaque.** InstruCoT performe bien meme sur TopicAttack (87.7% DR indirect), l'attaque la plus difficile pour les baselines (ISE : 21.4%, IP : 10.6%) (Section 5.2, Table 3, ligne TopicAttack).

**Faiblesses :**

1. **Evaluation limitee aux modeles 7-8B.** Les 4 LLM testes sont tous dans la gamme 7-8B. La scalabilite aux modeles plus grands (>70B) ou aux modeles de raisonnement (o1, DeepSeek R1) n'est pas demontree (Section Limitations, p.10).

2. **Attaques adaptatives non testees.** Tous les tests utilisent des attaques statiques. Un attaquant qui observe le pattern CoT pourrait concevoir des attaques qui exploitent ou contournent le raisonnement explicite (par exemple, en injectant un faux raisonnement CoT dans le contexte). P036 (Hagendorff, 2026, 97.14% ASR adaptatif) et P039 (Russinovich et al., 2026, GRP-Oblit) representent des menaces non evaluees (Chang et al., 2026, Section Limitations, p.10).

3. **Pas d'evaluation en contexte medical.** Aucun des scenarios d'attaque n'est specifiquement medical. Comparaison impossible avec CHER (P035, Section 4.1) ou ASR medical (P034, 98% CR, Section Results). L'efficacite sur des injections de type "fausse alerte FDA" ou "dosage incorrect" reste inconnue.

4. **Latence du CoT non mesuree.** L'overhead de generation du raisonnement CoT avant chaque reponse n'est pas quantifie. Pour des applications cliniques temps reel (aide a la decision, triage), cette latence pourrait etre prohibitive. Les auteurs mentionnent des mitigations (speculative decoding, CoT distillation) mais ne les evaluent pas (Section Limitations, p.10).

5. **PromptArmor comme baseline defavorable.** PromptArmor (detection-based, utilisant GPT-4 comme guardrail) montre une performance tres variable (14.4% a 89.0% DR selon l'attaque, Section 5.2). Cependant, PromptArmor utilise un modele externe (GPT-4), pas un fine-tuning du modele cible (Chang et al., 2026, Section 4.2, Baseline descriptions, p.6). La comparaison n'est pas entierement equitable car les approches ne sont pas dans la meme categorie architecturale.

**Questions ouvertes :**
- InstruCoT resiste-t-il aux attaques adaptatives qui ciblent le raisonnement CoT lui-meme ?
- Le CoT instruction-level est-il transferable par distillation vers des modeles plus petits ?
- L'approche fonctionne-t-elle pour les injections multimodales (VLM, imagerie medicale) ?
- Quel est le cout en latence et en tokens du CoT pour chaque requete ?

### Formules exactes
Classification epistemique : `[ALGORITHME]` --- methode avec resultats empiriques mais sans garantie theorique de convergence ou de robustesse.

**Defense Rate (DR)** (Section 5, Table 3) :
```
DR = 1 - ASR = proportion des attaques correctement rejetees
```

**CoT a 3 etapes** (Section 3.2, qualitative) :
1. Instruction Perception : identification source + position de chaque instruction
2. Violation Comprehension : evaluation de conformite aux politiques
3. Response Projection : generation de la reponse securisee

**Resultats principaux** (Section 5.2, Table 3) :
- BD Direct PI : InstruCoT **91.5%** vs Clean **10.3%** vs MetaSec **51.0%** vs ISE **60.5%**
- BD Indirect PI : InstruCoT **93.4%** vs Clean **12.4%** vs MetaSec **85.9%** vs ISE **72.9%**
- Privacy ShareGPT : InstruCoT **97.6%** vs ISE **91.2%** vs MetaSec **73.7%**
- Privacy Unatural : InstruCoT **98.4%** vs ISE **91.3%** vs MetaSec **58.9%**
- Harmful Output : InstruCoT **90.9%** vs InSFT **83.5%** vs MetaSec **80.2%** vs PromptArmor **70.8%**
- Utilite Win Rate : InstruCoT **82.9%** (moyenne 4 LLM) (Section 5.2, Figure 4)

**Qualite CoT** (Section 5.1, Table 2) :
- Instruction Perception : Precision **99.0%**, Recall **98.1%**, F1 **98.5%** (Alpaca-Adv Data+PI)
- Violation Comprehension : Precision **100.0%** (Alpaca-Adv Data+PI)
- Response Projection : Precision **99.7%** (Alpaca-Adv Data+PI)

Lien glossaire AEGIS : F22 (ASR, inverse comme DR), F15 (Sep(M) --- relation avec preservation d'utilite)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (amelioration du post-entrainement par raisonnement metacognitif --- InstruCoT est un renforcement δ⁰ avance)
- **Conjectures :** C1 (supportee indirectement : InstruCoT opere au niveau δ⁰ precisement parce que δ¹ seul est insuffisant --- le Clean DR de 10-12% le confirme). C3 (shallow alignment : supportee et partiellement resolue --- InstruCoT ajoute du raisonnement explicite pour remedier a la superficialite du RLHF). C5 (cross-layer : neutre --- InstruCoT est mono-couche δ⁰ sans interaction δ¹/δ²)
- **Decouvertes :** D-015 (metacognitive defense) nouvelle approche formalisee. D-016 (utility preservation) InstruCoT resout partiellement le trade-off Sep(M)/utilite de P024
- **Gaps :** G-006 (scalabilite aux grands modeles) cree. G-007 (robustesse adaptative) renforce. G-009 (evaluation medicale InstruCoT) cree --- prioritaire
- **Mapping templates AEGIS :** Defense δ⁰ applicable contre templates #01-#50 (DPI) ; resultat prometteur (93.4%) contre templates indirects ; a tester contre templates medicaux #13 (FDA Authority Hijack) et templates RAG #51-#70

### Citations cles
> "InstruCoT achieves strong average Defense Rates across all three dimensions on four LLMs, reaching 92.5% for Behavior Deviation, 98.0% for Privacy Leakage, and 90.9% for Harmful Output" (Section 5.2, Table 3, p.7-8)
> "instruction-level chain-of-thought fine-tuning, enabling LLMs to effectively identify and reject malicious instructions regardless of their source or position" (Abstract, p.1)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Moyenne --- 4 LLM evalues, protocole detaille avec 6 baselines, mais donnees de synthese et code non publies |
| Code disponible | Non mentionne |
| Dataset public | Non mentionne |
