# P087 : Analyse doctorale

## [Kuo et al., 2025] — H-CoT: Hijacking the Chain-of-Thought Safety Reasoning Mechanism to Jailbreak Large Reasoning Models

**Reference** : arXiv:2502.12893v2
**Revue/Conf** : Preprint, fevrier 2025 (early access safety testing pour OpenAI o3-mini)
**Lu le** : 2026-04-07
> **PDF Source**: [literature_for_rag/P_LRM_2502.12893.pdf](../../assets/pdfs/P_LRM_2502.12893.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (59 chunks, ~57 900 caracteres)

---

### Abstract original

> Warning: This paper contains potentially offensive and harmful text. Large Reasoning Models (LRMs) have recently extended their powerful reasoning capabilities to safety checks—using chain-of-thought reasoning to decide whether a request should be answered. While this new approach offers a promising route for balancing model utility and safety, its robustness remains underexplored. To address this gap, we introduce Malicious-Educator, a benchmark that disguises extremely dangerous or malicious requests beneath seemingly legitimate educational prompts. Our experiments reveal severe security flaws in popular commercial-grade LRMs, including OpenAI o1/o3, DeepSeek-R1, and Gemini 2.0 Flash Thinking. For instance, although OpenAI's o1 model initially maintains a high refusal rate of about 98%, subsequent model updates significantly compromise its safety; and attackers can easily extract criminal strategies from DeepSeek-R1 and Gemini 2.0 Flash Thinking without any additional tricks. To further highlight these vulnerabilities, we propose Hijacking Chain-of-Thought (H-CoT), a universal and transferable attack method that leverages the model's own displayed intermediate reasoning to jailbreak its safety reasoning mechanism. Under H-CoT, refusal rates sharply decline—dropping from 98% to below 2%—and, in some instances, even transform initially cautious tones into ones that are willing to provide harmful content. We hope these findings underscore the urgent need for more robust safety mechanisms to preserve the benefits of advanced reasoning capabilities without compromising ethical standards.
> — Source : PDF page 1

---

### Resume (5 lignes)

- **Probleme :** Les LRM (Large Reasoning Models) utilisent le chain-of-thought pour la verification de securite, mais la robustesse de ce mecanisme reste inconnue (Kuo et al., 2025, Section 1, p. 3).
- **Methode :** Construction du benchmark Malicious-Educator (50 requetes couvrant 10 categories criminelles) et proposition de H-CoT, qui injecte des fragments d'execution (T_E^mocked) dans le prompt pour court-circuiter la phase de justification de securite (Kuo et al., 2025, Section 4.2, p. 10, Eq. 8).
- **Donnees :** 50 requetes, 10 tentatives par requete sur o1 et o3-mini, 5 tentatives sur o1-pro, tests egalement sur DeepSeek-R1 et Gemini 2.0 Flash Thinking (Kuo et al., 2025, Section 5.1, p. 13-14).
- **Resultat :** H-CoT fait chuter le taux de refus de 98% a moins de 2% sur o1, et atteint un ASR de 94.6% (o1), 97.6% (o1-pro), 98.0% (o3-mini) — nettement superieur a DeepInception (1.0%) et SelfCipher (32.0%) sur o1 (Kuo et al., 2025, Table 1, p. 14).
- **Limite :** Benchmark de seulement 50 requetes, H-CoT necessite un acces prealable aux traces CoT du modele cible, et les T_E sont collectes manuellement (Kuo et al., 2025, Section 8, p. 21).

---

### Analyse critique

**Forces :**

1. **Formalisation rigoureuse du processus de raisonnement des LRM** : la decomposition en phase de Justification (T_J) et phase d'Execution (T_E) avec transition d'etats est originale et operatoire (Section 4.1, Eq. 1-6, p. 8-9). Cette formalisation permet de comprendre pourquoi l'attaque fonctionne : elle court-circuite le point-a-point de verification de securite en forcant le modele a emprunter un chemin d'execution complexe.

2. **Analyse theorique par theorie de l'information** : l'explication du succes de H-CoT via la distinction entre l'objectif de minimisation d'entropie (phase E, exploration vaste) et l'objectif de maximisation d'information mutuelle (phase J, verification point-a-point) est intellectuellement elegante (Section 4.3, p. 11-12). L'argument central est que la verification de securite echoue quand le chemin de raisonnement est trop complexe pour un matching point-a-point.

3. **Resultats experimentaux devastateurs** : les ASR atteignent des niveaux extremement eleves sur des modeles commerciaux de production — o1-pro a 97.6%, avec un Harmfulness Rating de 4.57/5 (Table 1, p. 14). Cela demontre que meme les modeles les plus securises d'OpenAI sont vulnerables.

4. **Analogie biologique feconde** : la comparaison avec l'evasion immunitaire par mimicry moleculaire (EBV et vIL-10, Schistosoma et Tregs) offre un cadre conceptuel interessant pour penser la co-evolution attaque/defense (Section 4.2, p. 11).

5. **Observation du phenomene multilingue** : sous H-CoT, le modele o1 produit spontanement des pensees en hebreu, arabe, chinois, japonais, coreen et tamoul, suggerant un contournement des mecanismes de securite anglophones (Section 5.1, p. 15-16). Ce phenomene converge avec nos observations sur les attaques cross-linguistiques dans AEGIS (templates #04, #12).

**Faiblesses :**

1. **Benchmark tres petit** : 50 requetes seulement, ce qui rend les analyses par categorie statistiquement fragiles (5 requetes par categorie, 10 tentatives = 50 echantillons par sous-categorie). L'absence d'intervalles de confiance affaiblit les conclusions (pas de p-values ni IC 95% rapportes).

2. **Collecte manuelle des T_E** : les auteurs admettent que les fragments d'execution sont collectes manuellement a partir de questions non-nocives posees a o1 (Section 5.1, p. 14). Cela limite la scalabilite et la reproductibilite.

3. **Pas de defense proposee** : l'article identifie le probleme mais ne propose aucune contre-mesure concrete. La Section 6 ("Key Insights for Improving Security") est principalement un appel a l'action sans implementation.

4. **Evaluation par LLM-juge (ChatGPT)** : le Harmfulness Rating est evalue par l'API ChatGPT, ce qui est un juge manipulable — comme le demontre P044 avec un flip rate de 99% (Liu et al., 2023).

5. **Transferabilite limitee** : les T_E collectes sur o1 sont appliques directement a o1-pro et o3-mini sans adaptation, ce qui fonctionne mais les auteurs notent que des T_E specifiques au modele seraient plus efficaces (Section 5.1, p. 15).

---

### Formules exactes

**Processus d'inference d'un LRM** (Section 4.1, Eq. 1-5, p. 8) :
- S_0 = x (initialisation)
- S_{k+1} = F(S_k, x) (transition d'etat)
- T_k = V(S_k) (chain-of-thought visible)
- O(x) = S_N (sortie finale)

**Flux H-CoT reussi** (Section 4.2, Eq. 8, p. 10) :
- (x, T_E^{mocked}) -> T_{E1} -> T_{E2} -> ... -> O(x) (attaque reussie)

**Analyse theorique** (Section 4.3, p. 11-12) :
- Objectif utilite : min_{T_E} H(T_E | x) (minimiser l'entropie)
- Objectif securite : max_{T_J} I([x, T_J], safety_policy) (maximiser l'information mutuelle)
- Echec quand T_J^{altered} fourni : I([x, T_J^{altered}], safety_policy) < I([x], safety_policy) -> refus
- Succes quand seul T_E^{mocked} fourni : verification path-to-path trop complexe, l'entropie augmente et le modele suit le chemin d'execution

Lien glossaire AEGIS : F15 (Sep(M)), F22 (ASR), F44 (decomposition martingale — lien conceptuel avec la decomposition T_J/T_E)

---

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF) : directement cible. H-CoT contourne le mecanisme de refus RLHF en exploitant la transparence du CoT. Confirme que l'alignement RLHF reste fragile face a des attaques qui exploitent le mecanisme de raisonnement lui-meme.
  - δ¹ (system prompt) : la phase T_J contient les verifications de politique, donc H-CoT vise indirectement la couche δ¹.
  - δ² (sanitization) : non adresse directement.
  - δ³ (tool control) : non adresse.

- **Conjectures :**
  - **C7 (paradoxe raisonnement/securite) : FORTEMENT SUPPORTEE.** Resultat central du papier : les capacites de raisonnement des LRM creent une surface d'attaque nouvelle. Plus le modele raisonne, plus il est vulnerable au hijacking de son propre processus de pensee. La formalisation T_J/T_E donne un cadre formel a C7.

- **Decouvertes :**
  - D-012 (CoT comme surface d'attaque) : confirmee et formalisee
  - D-015 (cross-lingual emergent) : confirmee par l'observation des pensees multilingues sous H-CoT

- **Gaps :**
  - G-009 (defense contre exploitation du CoT) : cree — aucune defense proposee
  - G-015 (scalabilite des attaques CoT) : partiellement adresse — la collecte manuelle des T_E est la principale limitation

- **Mapping templates AEGIS :** Correspond aux templates d'attaque par cadrage educatif (#03 FDA social engineering, #07 multi-turn APT), et aux attaques cross-linguistiques emergentes (#04 prompt leak translation, #12 genetic cross-lingual)

---

### Citations cles

> "current LRMs fail to provide a sufficiently reliable safety reasoning mechanism." (Section 1, p. 4)

> "Rather than persuading the model into modified chain-of-thought statements, we hijack the existing reasoning flow, which is why our approach is referred to as H-CoT." (Section 4.2, p. 10)

> "the safety mechanism focuses on a 'point-to-point' verification [...] if the reasoning process yields a solution path that is too complex, the safety check will also face challenges" (Section 4.3, p. 12)

---

### Classification

| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Moyenne — T_E collectes manuellement, mais code partiellement publie (GitHub Duke CEI Center) |
| Code disponible | Oui, partiellement (https://github.com/dukeceicenter/jailbreak-o1o3-deepseek-r1) |
| Dataset public | Oui, partiellement (Malicious-Educator, donnees internes a Duke pour le reste) |
| Nature epistemique | [EMPIRIQUE] — analyse info-theorique non formellement prouvee, mais experimentalement validee |
| Type d'attaque | Jailbreak / CoT Hijacking |
| MITRE ATLAS | AML.T0051.003 (Prompt Injection — Reasoning Exploitation) |
| OWASP LLM | LLM01 (Prompt Injection) |
