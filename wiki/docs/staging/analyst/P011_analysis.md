# P011: PromptGuard: A Structured Framework for Injection Resilient Language Models
**Auteurs**: Ahmed Alzahrani (King Abdulaziz University, Jeddah, Saudi Arabia)
**Venue**: Scientific Reports 16, 1277 (2026) — Nature Portfolio (Q1 SCImago)
> **PDF Source**: [literature_for_rag/P011_promptguard.pdf](../../assets/pdfs/P011_promptguard.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (78 chunks)

**Reference** : https://doi.org/10.1038/s41598-025-31086-y
**Nature** : [ALGORITHME] — framework de defense modulaire sans garantie formelle de convergence

---

## Section 1 — Resume critique

### Abstract original
> Prompt injection attacks threaten the reliability of large language models (LLMs) by embedding adversarial instructions that override intended behavior and compromise task fidelity. Existing defenses are typically narrow in scope or depend on retraining, limiting their adaptability across deployment contexts. This paper presents a modular, four-layer defense framework that integrates input gatekeeping, structured prompt formatting, semantic output validation, and adaptive response refinement (ARR). The pipeline combines regex and MiniBERT-based detection to identify and block malicious instructions, while structured formatting and critic-based validation ensure consistent task alignment. Evaluations on PromptBench, InjectBench, and TruthfulQA demonstrate that the framework enhances robustness across multiple LLMs, achieving up to a 67% reduction in injection success rate and an F1-score of 0.91 in detection, with a latency increase below 8%.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les defenses existantes contre l'injection de prompt sont fragmentees, model-specifiques ou necessitent un retraining (Section Introduction, p.1-2)
- **Methode :** Pipeline en 4 couches : (1) Gatekeeping hybride regex+MiniBERT, (2) Formatage structure ChatML/JSON, (3) Validation semantique LLM-as-Critic, (4) Adaptive Response Refinement (Section Methodology, p.3-12)
- **Donnees :** PromptBench (~12 000 prompts), Prompt Injection-Malignant (~7 000 prompts Kaggle), TruthfulQA (817 questions) (Table 2, p.4)
- **Resultat :** ISR reduit de 67%, F1=0.91 en detection (Regex+BERT), latence <8% (Table 6, p.14 ; Table 8, p.15)
- **Limite :** Faux negatifs de 6.8% principalement sur attaques multi-tour et a intention implicite ; faux positifs de 4.2% sur langage meta-instructionnel (Table 7, p.14)

### Analyse critique

**Forces :**
1. **Architecture multi-couches complete** — couvre input, structure, output et refinement, rare dans la litterature (Alzahrani, 2026, Table 1, p.3). Seul framework a integrer les 4 composants simultanement.
2. **Multi-LLM** — teste sur GPT-4, Claude 3 et LLaMA 2 (Alzahrani, 2026, Table 8, p.15), ce qui renforce la generalisabilite.
3. **Latence faible** — overhead < 8%, rendant le deploiement praticable (Alzahrani, 2026, Section Results, p.14).
4. **Publication peer-review** dans Scientific Reports (Nature), conferant une credibilite editoriale (Alzahrani, 2026, Scientific Reports 16, 1277).
5. **Formalisation du threat model** — adversaire black-box avec acces au prompt utilisateur mais pas aux poids (Section Threat modeling, p.5-6, Eq. 6-9).

**Faiblesses :**
1. **N insuffisant pour le multi-tour** — les evaluations dynamiques (Alzahrani, 2026, Table 9, p.15) montrent ISR de 14.3% mais sur un subset synthetique de taille non precisee, insuffisant au sens de Sep(M) (N >= 30 par condition, Zverev et al., 2025, ICLR, Definition 2).
2. **Pas de baseline comparative rigoureuse** — la Table 1 compare des methodes par features booleennes, pas par ASR sur le meme benchmark avec la meme methodologie.
3. **LLM-as-Critic circulaire** — la validation de sortie par un second LLM est vulnerable aux memes manipulations semantiques (cf. Unit42, 2026, P044 : 99% flip rate des juges LLM). Le seuil de cosine similarity tau=0.78 (Alzahrani, 2026, Section Layer 3, p.9) est determine empiriquement sans justification theorique.
4. **Absence d'attaques adaptatives** — aucun adversaire qui connait l'architecture PromptGuard n'est teste (pas de test white-box contre la defense elle-meme, Alzahrani, 2026, Section 7, Limitations, implicite).
5. **Pas de domaine medical** — aucun test sur des LLM medicaux ou des prompts cliniques, limitant la pertinence directe pour AEGIS.
6. **Reproductibilite partielle** — le code et les checkpoints sont promis mais non publies au moment de la lecture.

**Questions ouvertes :**
- L'ARR preserve-t-il l'utilite clinique lors de la reformulation de reponses medicales ?
- Le seuil tau=0.78 est-il robuste face aux attaques qui maintiennent une similarite cosine elevee tout en changeant la semantique (cf. P013, antonyme intrusion) ?

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Ref papier | Lien glossaire AEGIS |
|----|---------|-------------------|------------|---------------------|
| Eq.1 | $P_u^{(norm)} = N(P_u)$ | Normalisation des prompts | p.5, Eq. 1 | — |
| Eq.3 | $sim(v_u, v_{inj}) = \frac{v_u \cdot v_{inj}}{\|v_u\| \|v_{inj}\|}$ | Cosine similarity pour detection | p.5, Eq. 3 | F22 (cosine drift) |
| Eq.10 | $F_{det}(P_u) = R(P_u) \lor C_\theta(P_u)$ | Detection hybride (OR logique) | p.7, Eq. 10 | — (nouveau) |
| Eq.11 | $l_{struct} = \text{JSON}(\text{"system"}: P_s, \text{"user"}: P_u)$ | Formatage structure | p.8, Eq. 11 | — |
| Eq.15 | $G(O, T) = \begin{cases} 1 & \text{si } O \not\models T \\ 0 & \text{si } O \models T \end{cases}$ | Validation semantique binaire | p.9, Eq. 15 | — |
| Eq.17 | $O' = R_\phi(O, P_s)$ | Raffinement adaptatif | p.10, Eq. 17 | — |

**Variables cles :**
- $P_s$ : system prompt, $P_u$ : user prompt, $T$ : tache cible
- $R(P_u)$ : detecteur regex, $C_\theta(P_u)$ : classificateur MiniBERT
- $\tau = 0.78$ : seuil de cosine similarity pour le critique (Section Layer 3, p.9)
- $\sigma \geq 0.85$ : seuil de retention semantique pour ARR (Section ARR, p.10)

---

## Section 3 — Critique methodologique

### Reproductibilite
| Question | Reponse | Impact |
|----------|---------|--------|
| Prompts publies ? | Exemples dans le papier, pas de dataset complet | Reproduction partielle |
| Modele accessible ? | GPT-4 (API), Claude 3 (API), LLaMA 2 (open-weight) | Mixte |
| Temperature specifiee ? | Non mentionnee | Reproductibilite reduite |
| Code/framework fourni ? | Annonce mais non publie | Non verifiable |
| MiniBERT checkpoints ? | Non fournis | Non reproductible |

### Metriques
- **F1 = 0.91** (Alzahrani, 2026, Regex+BERT, Table 6, p.14) : bon mais insuffisant pour le medical (9% FN = risque patient)
- **ISR reduction de 67%** (Alzahrani, 2026, Table 8, p.15) : significatif mais calcule par rapport au flat prompt, pas par rapport aux meilleures defenses existantes
- **ISR multi-tour = 14.3%** (Alzahrani, 2026, Table 9, p.15) : montre la vulnerabilite residuelle contre les attaques adaptatives

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C2** (necessite de delta-3) | FORT | ISR residuel de 14.3% malgre 4 couches de defense (Alzahrani, 2026, Table 9, p.15) | Meme avec 4 couches empiriques, les attaques multi-tour passent. Confirme que delta-3 (verification formelle) reste necessaire. |
| **C5** (cosine insuffisante) | MODERE | tau=0.78 pour le critique, sans justification theorique | Le seuil de cosine similarity est fixe empiriquement ; susceptible aux attaques preservant la cosine (P013). |
| **C1** (delta-0 insuffisant) | INDIRECT | Papier ne teste pas directement delta-0 | Le fait que des defenses supplementaires soient necessaires implique que delta-0 seul echoue. |

### Couches delta

- **delta-0 (RLHF alignment)** : non cible directement. PromptGuard opere au-dessus de delta-0.
- **delta-1 (System prompt)** : Layer 2 (Structured Formatting) renforce delta-1 via ChatML/JSON. ISR reduit de 40-44% (Alzahrani, 2026, Table 8, p.15 ; Fig. 5).
- **delta-2 (Filtrage syntaxique/semantique)** : Layer 1 (Input Gatekeeping) = delta-2 en entree. Layer 3 (Output Validation) = delta-2 en sortie. Couverture la plus complete du corpus pour delta-2.
- **delta-3 (Verification formelle)** : ABSENT. Aucune couche ne fournit de garantie formelle. L'ARR (Layer 4) est une heuristique, pas une verification.

### Mapping templates AEGIS
- Templates #01-#10 (injection directe) : Layer 1 capture 91% (Alzahrani, 2026, Table 6, p.14)
- Templates #20-#30 (obfuscation) : Layer 1 performance degradee (FN 6.8%, Alzahrani, 2026, Table 7, p.14)
- Templates #35-#40 (multi-turn) : ISR residuel 14.3% (Alzahrani, 2026, Table 9, p.15)
- Chaines `solo_agent`, `rag_basic` : PromptGuard non teste sur RAG ou agents

### Gaps adresses/crees
- **G-001** (implementation delta-3) : P011 montre que 4 couches empiriques ne suffisent pas (Alzahrani, 2026, Table 9, ISR residuel 14.3%), renforce le gap
- **G-014** (heterogeneite metriques) : P011 utilise ISR, F1, SAS mais pas Sep(M), contribuant au probleme

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P011 |
| **Type** | Defense (framework multi-couches) |
| **Domaine** | Securite LLM, injection de prompt |
| **Modeles testes** | GPT-4, Claude 3, LLaMA 2 |
| **Metrique principale** | ISR reduction 67%, F1=0.91, latence <8% |
| **delta-layers** | delta-1 (renforce), delta-2 (couverture entree+sortie) |
| **Conjectures** | C2 (fort), C5 (modere), C1 (indirect) |
| **SVC pertinence** | 7/10 |
| **Reproductibilite** | Faible — code et checkpoints non publies |
| **Code disponible** | Non (annonce) |
| **Dataset public** | Oui (PromptBench, TruthfulQA, Kaggle) |
| **Tags** | [ARTICLE VERIFIE], defense multi-couches, LLM-as-Critic, regex, MiniBERT |
