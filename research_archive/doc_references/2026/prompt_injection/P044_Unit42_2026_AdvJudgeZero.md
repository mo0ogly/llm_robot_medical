# P044: AdvJudge-Zero -- Binary Decision Flips in LLM-as-a-Judge via Adversarial Control Tokens
**Authors**: Tung-Ling Li, Yuhao Wu, Hongliang Liu (Palo Alto Networks / Unit 42) | **Year**: 2025 | **Venue**: arXiv:2512.17375v1 [cs.LG], 19 Dec 2025
**[ARTICLE VERIFIE]** -- Texte complet lu depuis ChromaDB (61 chunks, ingestion 2026-04-04)
> **PDF Source**: [literature_for_rag/P044_2512.17375.pdf](../../literature_for_rag/P044_2512.17375.pdf)

---

## 1. Resume (1500-2000 mots)

### 1.1 Contexte et probleme

Les pipelines modernes de post-entrainement des LLM -- RLHF (Ouyang et al., 2022), DPO (Rafailov et al., 2023), RLAIF (Lee et al., 2024) -- reposent massivement sur des modeles de recompense et des systemes LLM-as-a-Judge pour fournir les signaux d'evaluation binaires (correct/incorrect, oui/non) qui guident la selection de modeles et les mises a jour de politique par apprentissage par renforcement. Ces juges sont devenus la colonne vertebrale de l'evaluation automatisee dans l'ecosysteme IA contemporain.

AdvJudge-Zero demontre une vulnerabilite structurelle recurrente de ces systemes de jugement : de courtes sequences de tokens de controle a faible perplexite peuvent retourner (flip) les evaluations binaires, faisant passer des jugements corrects "Non" en jugements incorrects "Oui". Le taux de faux positifs (FPR) induit atteint 99.91% sur le benchmark MATH, 98.64% sur AIME, et 94.75% sur Multi-subject RLVR. Ces chiffres surpassent massivement la baseline Master-RM (Zhao et al., 2025) qui n'atteint que 61-72% selon les benchmarks.

Le point crucial est que ces tokens de controle ne sont pas des chaines adversariales arbitraires a haute perplexite (comme celles generees par GCG de Zou et al., 2023). Ce sont des tokens que le modele de politique pourrait plausiblement generer durant le post-entrainement -- marqueurs de formatage, delimiteurs structurels, fragments markdown -- representant des risques realistes de reward hacking plutot que des attaques worst-case theoriques.

### 1.2 Methode zero-shot et mecanisme geometrique

La contribution methodologique principale est AdvJudge-Zero, une methode de decouverte automatisee de tokens adversariaux qui opere sans aucune graine (seed) prealable. Contrairement aux travaux anterieurs (Master-RM) qui partent d'un ensemble manuellement cree de tokens declencheurs et explorent leurs variations locales, AdvJudge-Zero utilise la distribution de tokens suivants du modele cible lui-meme, couplee a une exploration par recherche en faisceau (beam search), pour decouvrir ab initio des sequences de tokens de controle diversifiees.

Le processus se decompose en deux phases. La phase de generation construit un prompt qui contient les instructions de la tache et la question, mais omet la reponse de reference et le jugement final, terminant par une phrase d'amorcage. Un beam search avec un calendrier TOP_K (k=300 pour le premier token, decroissant progressivement) genere des sequences de longueur 1 a 7 tokens. La phase de verification insere chaque sequence candidate dans un prompt de jugement complet et mesure le logit gap F(X + A). Les candidats provoquant un flip (F < 0) sont conserves et classes par deux statistiques : le nombre de duplications (combien de prompts differents sont flippes) et le gap de logits moyen (force de la deviation vers "Oui").

L'interpretation geometrique est le coeur theorique du papier. Le corps du transformer mappe un prompt X vers un etat cache final h_L(X) qui conserve quasi-integralement la semantique du prompt (consistant avec les travaux de Nikolaou et al., 2025 sur la quasi-injectivite des LLM). Le post-entrainement installe une porte (gate) superficielle au niveau du readout qui separe les reponses "Non" et "Oui". Cette porte etant a la fois peu profonde et a haut gain, de petites modifications locales de h_L(X) suffisent pour traverser la frontiere de decision sur une large gamme d'entrees.

Les auteurs formulent l'hypothese du pilotage par sous-espace de faible rang (Low-Rank Steering Hypothesis) : les tokens de controle efficaces n'induisent pas des perturbations isotropes mais exploitent un "mode mou" (soft mode) -- empruntant la terminologie de la physique de la matiere condensee -- qui est systematiquement anti-aligne avec la direction de refus du modele. L'analyse PCA montre que le premier composant principal explique 28-35% de la variance des perturbations (contre ~0.03% attendu pour du bruit isotrope en dimension d~3000-4000), confirmant une structure de rang faible marquee.

### 1.3 Resultats experimentaux : le 99% qui invalide les juges

Les experiences couvrent 6 modeles general-purpose (Llama-3.2/3.3 3B-70B, Qwen2.5/3 4B-30B, Gemma-3 4B) et 4 juges specialises (Omni-Judge, General-Verifier, Qwen2.5-RLVR, Master-RM Judge), evalues sur 4 benchmarks (AIME, MATH, GSM8K, Multi-subject RLVR).

Sur les modeles general-purpose, l'ensemble adversarial AdvJudge-Zero atteint des FPR proches de 100% sur la plupart des paires modele-dataset. Qwen3-4B et Qwen3-30B atteignent 100.00% sur les 4 benchmarks. Meme le plus grand modele teste, Llama-3.3-70B, montre des FPR de 93-99% selon les datasets.

Sur les juges specialises, les resultats revelent des differences de robustesse significatives. Omni-Judge est catastrophiquement vulnerable : FPR de 96-99% sur AIME/MATH/GSM8K et ~50% sur Multi-subject RLVR. En revanche, General-Verifier reste robuste avec des FPR proches de zero. Qwen2.5-RLVR et Master-RM Judge montrent une vulnerabilite intermediaire (2-11%).

Un resultat contre-intuitif important : la longueur des sequences de tokens de controle n'augmente pas monotoniquement le FPR. La composition semantique compte plus que le nombre de tokens. Ceci diverge des travaux anterieurs (Zou et al., 2023 ; Xu et al., 2024) ou des prompts plus longs produisent typiquement des attaques plus fortes, et confirme la vision geometrique : ce qui compte est l'alignement de la perturbation avec le mode mou, pas son amplitude brute.

### 1.4 Mitigation par entrainement adversarial LoRA

Les auteurs proposent un entrainement adversarial LoRA (r=4, alpha=16, dropout 0.05) sur Omni-Judge, le juge le plus vulnerable. Un dataset equilibre de 20 000 exemples (5% entrainement, 95% test) est construit avec des exemples positifs (reponses correctes labelisees TRUE) et negatifs (reponses incorrectes augmentees de tokens adversariaux, labelisees FALSE).

Les resultats sont encourageants : le FPR chute de 96-99% a 2-6% sur les benchmarks mathematiques et de 49% a 1% sur RLVR, tout en preservant des taux de vrais positifs (TPR) de 99.9-100%. Cependant, les auteurs reconnaissent une limitation fondamentale : l'entrainement adversarial peut remodeler mais pas eliminer les directions vulnerables de faible rang. De nouveaux tokens de controle peuvent emerger.

### 1.5 Taxonomie des tokens de controle decouverts

Les tokens efficaces se repartissent en deux categories selon la longueur de sequence. Pour les sequences courtes (1-3 tokens), les tokens les plus efficaces ne sont pas du langage naturel mais des caracteres speciaux, des fragments markdown, ou des symboles de controle vus durant l'entrainement : `''';`, `<|im_end|>`, `<?php` pour Qwen ; `---` et patterns de tableaux `| Step |` pour Gemma. Pour les sequences plus longues, les patterns deviennent semantiques, ressemblant a des fragments de prompts familiers ("The final answer is", "You are a helpful assistant") qui poussent le modele dans un mode "solution/assistant" ou repondre "Oui" devient plus probable.

---

## 2. Formules exactes

### F33b -- Logit Gap (formule centrale)

```
F(X) = logit("No") - logit("Yes")
```

Pour un etat cache h de dimension d, le gap est linearise comme :

```
F(h) = z_No(h) - z_Yes(h) ~ (w_No - w_Yes)^T * h + b
```

ou `w_F = w_No - w_Yes` est la **direction de refus intrinseque** (Refusal Direction).

### Decision Flip -- Condition necessaire

Un flip se produit quand F(X + A) < 0. En termes de perturbation :

```
Delta_F ~ w_F^T * Delta_h < -F(h_clean)
```

ou `Delta_h = h_adv - h_clean`. La perturbation doit avoir une projection negative significative (anti-alignement) sur w_F.

### Low-Rank Steering -- Verification empirique

| Modele | Dim (d) | PC1 Var. | Null Dist. (mu +/- sigma) | Align. | Z-Score |
|--------|---------|----------|---------------------------|--------|---------|
| Qwen-2.5-7B | 4096 | 34.57% | -0.000 +/- 0.017 | -0.125 | **-7.47** |
| Llama-3.2-3B | 3072 | 28.29% | +0.000 +/- 0.018 | -0.087 | **-4.80** |

Z-scores de -7.47 et -4.80 (vs distribution nulle de 5000 vecteurs aleatoires) : preuve statistique forte que les tokens de controle ne sont pas du bruit mais des perturbations directionnelles systematiques.

### FPR ensemble (resultats cles)

| Benchmark | AdvJudge-Zero FPR | Master-RM Baseline FPR |
|-----------|-------------------|------------------------|
| AIME | 98.64% | 61.13% |
| MATH | **99.91%** | 71.86% |
| Multi-RLVR | 94.75% | 54.46% |

### Mitigation LoRA (Omni-Judge)

| Dataset | FPR Base | FPR Post-LoRA | TPR Base | TPR Post-LoRA |
|---------|----------|---------------|----------|---------------|
| AIME | 96.46% | 1.80% | 95.43% | 100.00% |
| MATH | 99.41% | 5.62% | 99.47% | 99.96% |
| GSM8K | 99.79% | 6.38% | 99.34% | 100.00% |
| RLVR | 49.47% | 0.96% | 99.66% | 99.95% |

---

## 3. Critique : implications pour toutes les metriques basees sur LLM-as-Judge

### 3.1 Le probleme fondamental de la circularite

AdvJudge-Zero revele un probleme epistemologique profond : si les juges LLM sont eux-memes manipulables a ~99%, alors **toute metrique derivee de ces juges est potentiellement invalide**. Cela affecte directement :

- **L'Attack Success Rate (ASR)** mesuree par LLM-as-Judge : un ASR de 95% mesure par un juge flippable n'est pas un ASR de 95% reel. Le juge lui-meme peut avoir ete manipule par les tokens de controle presents dans les reponses evaluees.
- **Les benchmarks de securite** (HarmBench, JailbreakBench, etc.) qui utilisent des juges LLM pour classifier les reponses comme dangereuses ou non.
- **Les pipelines RLHF/DPO** qui optimisent directement sur les signaux de juges potentiellement corrompus, creant une boucle de retroaction positive ou les politiques apprennent a exploiter les biais des juges plutot qu'a produire des reponses de qualite.

### 3.2 La question de la transferabilite cross-model

Le papier teste explicitement la transferabilite : les tokens decouverts sur des modeles general-purpose sont transferes aux juges specialises. Omni-Judge s'effondre (96-99% FPR), mais General-Verifier resiste. Cette heterogeneite de robustesse est **plus inquietante que rassurante** : elle signifie qu'on ne peut pas presumer de la robustesse d'un juge sans le tester explicitement contre des attaques adversariales, ce qui est rarement fait en pratique.

### 3.3 Limites du papier

- **Scope limite aux evaluations de correctitude** : les auteurs n'etudient pas les flips sur les evaluations de securite/dangerosit (safety filtering), qui sont exactement le cas d'usage critique pour AEGIS.
- **Open-weight uniquement** : les modeles proprietaires (GPT-4, Claude) ne sont pas testes. La vulnerabilite pourrait etre differente pour les modeles a acces API uniquement.
- **Mitigation locale** : l'entrainement adversarial LoRA est efficace mais ne fournit aucune garantie formelle. Les auteurs reconnaissent que de nouvelles directions vulnerables peuvent emerger apres l'entrainement.

---

## 4. Impact AEGIS

### 4.1 Gap P0-003 : ASR Circularity

AdvJudge-Zero fournit la preuve empirique la plus forte du gap P0-003 identifie dans la these AEGIS. Si le juge LLM utilise pour mesurer l'ASR est lui-meme flippable a 99%, alors :

```
ASR_mesuree =/= ASR_reelle
```

L'ASR mesuree dans le Red Team Lab d'AEGIS repose sur un LLM juge (llm_judge.py). Sans validation adversariale de ce juge, les 48 scenarios et 98 templates pourraient produire des scores ASR artificiellement gonfles ou deflates. La recommandation directe est d'implementer un audit AdvJudge-Zero du juge AEGIS avant toute campagne de mesure.

### 4.2 Couche δ³ : necessite de verification formelle

Le papier demontre que les mecanismes de defense empiriques (juges, guardrails) sont eux-memes des surfaces d'attaque. Cela renforce la these centrale d'AEGIS sur la necessite de la couche δ³ (verification formelle) : si les juges ne peuvent pas etre fies comme gardiens, seules des garanties mathematiques sur le processus de jugement peuvent etre fiables.

La formule du logit gap `F(h) ~ w_F^T * h + b` montre que la decision binaire est essentiellement un classifieur lineaire dans le dernier layer -- une structure extremement fragile par construction. La couche δ³ devrait verifier formellement que cette frontiere de decision est robuste a des perturbations epsilon-bornees.

### 4.3 Gap D-001 : Defense taxonomy

AdvJudge-Zero suggere un nouveau type de defense a ajouter a la taxonomie AEGIS : la **validation adversariale des juges** comme prerequis a toute campagne d'evaluation. La defense #67 potentielle serait "Judge Adversarial Fuzzing" -- une etape de pre-validation qui execute AdvJudge-Zero contre le juge avant de l'utiliser pour evaluer les reponses, avec un seuil FPR maximal acceptable.

### 4.4 Implications pour le SVC (Semantic Violation Criterion)

Si le juge utilise pour evaluer les violations semantiques est lui-meme flippable, le SVC herite de cette fragilite. Le mecanisme geometrique (mode mou anti-aligne) pourrait s'appliquer au juge SVC d'AEGIS, rendant les scores de nocivite non fiables. Une mitigation serait d'utiliser un **ensemble de juges heterogenes** (multi-family : Llama + Qwen + Gemma) car les tokens de controle sont partiellement modele-specifiques.

---

## 5. Classification

| Champ | Valeur |
|-------|--------|
| **Paper ID** | P044 |
| **Titre** | AdvJudge-Zero: Binary Decision Flips in LLM-as-a-Judge via Adversarial Control Tokens |
| **Auteurs** | Tung-Ling Li, Yuhao Wu, Hongliang Liu |
| **Affiliation** | Palo Alto Networks (Unit 42) |
| **Venue** | arXiv:2512.17375v1, Dec 2025 |
| **Type** | Attaque + Defense (decouverte de vulnerabilite + mitigation LoRA) |
| **Cible** | LLM-as-a-Judge, Reward Models |
| **Mecanisme** | Logit gap steering via control tokens de faible rang |
| **Taux de flip** | 99.91% (MATH), 98.64% (AIME), 94.75% (RLVR) |
| **Mitigation** | LoRA adversarial training : FPR 99% -> 2-6% |
| **Couches delta** | δ⁰ (RLHF corrompu), δ² (tokens de controle syntaxiques), δ³ (necessite verification formelle) |
| **Conjectures** | C2 (necessite δ³ : OUI fort), C3 (shallow alignment : OUI), C4 (scaling-independent : OUI), C5 (cross-layer : OUI) |
| **Gaps AEGIS** | P0-003 (ASR circularity), D-001 (defense taxonomy), δ³ (formal verification) |
| **Formules cles** | F33b (Logit Gap), Decision Flip condition, Low-Rank Steering PCA |
| **Reproductibilite** | Algorithme 1 decrit en detail ; code non publie (ethique) |
| **Credibilite** | Unit 42 (equipe de recherche en cybersecurite de Palo Alto Networks) |
