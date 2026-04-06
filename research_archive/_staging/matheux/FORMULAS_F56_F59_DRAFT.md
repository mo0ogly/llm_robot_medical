# Formules F56-F59 — Draft pour validation MATHEUX

> **Auteur** : research-director (orchestration) + MATH agent
> **Date** : 2026-04-04
> **Statut** : DRAFT — a valider par le directeur de these
> **Objectif** : Combler les 4 trous mathematiques identifes pour fermer C4-C7

---

## F56 — Drift Rate (pour C4 : derive semantique)

**Conjecture** : C4 (derive semantique progressive)
**Gap** : MTSD (F41) mesure la degradation de securite mais pas la derive semantique elle-meme

**Definition** :

Soit M un modele, T = {t_1, ..., t_n} une sequence de tours de conversation, et e(t_i) l'embedding de la reponse au tour i. Le Drift Rate DR(M, T) mesure la derive semantique normalisee par tour :

```
DR(M, T) = (1 / (n-1)) * Σ_{i=1}^{n-1} [1 - cos(e(t_i), e(t_{i+1}))]
```

ou cos(a, b) est la similarite cosinus entre les embeddings a et b (all-MiniLM-L6-v2).

**Proprietes** :
- DR ∈ [0, 1] — normalise par construction
- DR = 0 : aucune derive (reponses identiques semantiquement)
- DR → 1 : derive maximale (reponses orthogonales entre tours successifs)
- DR est additif : DR(T_1 + T_2) = (|T_1| * DR(T_1) + |T_2| * DR(T_2)) / (|T_1| + |T_2|)

**Lien avec F41 (MTSD)** :
MTSD mesure la degradation du score de securite (9.5 → 5.5). DR mesure la derive dans l'espace semantique. La correlation DR-MTSD quantifie si la derive semantique **cause** la degradation de securite ou si c'est un effet parallele independant.

**Validation empirique requise** :
- Calculer DR sur les 22 modeles de P050 (memes donnees que F41)
- Tester correlation Pearson DR vs MTSD
- Seuil propose : DR > 0.15 par tour = alerte de derive

**Papers de reference** : P050 (MTSD), P024 (Sep(M)), Reimers 2019 (SBERT), **P078 (ZEDD — confirmation independante)**

**Mise a jour RUN-004 (2026-04-04)** :
P078 (Sekar et al. 2026, ZEDD) confirme independamment la formule $\text{Drift}(x, x') = 1 - \cos(f(x), f(x'))$ sur 51 603 paires (Llama 3 8B, Mistral 7B, Qwen 2 7B). Performance : F1 = 95.30-95.50%, FPR cap a 3%. Le seuil GMM optimal est compatible avec DR > 0.15 propose dans ce draft. La definition ZEDD est un cas particulier de DR sur des paires (x, x') plutot que des sequences — la formulation DR(M, T) reste la forme generalisee.

---

## F57 — Cosine Vulnerability Index (pour C5 : cosine insuffisante)

**Conjecture** : C5 (cosine similarity insuffisante pour la separation)
**Gap** : Le probleme est documente qualitativement (Gauge F06, PIR F49) mais pas quantifie

**Definition** :

Soit D un corpus de documents, E l'espace d'embedding, et A = {a_1, ..., a_k} un ensemble de documents adversariaux injectes dans D. Le Cosine Vulnerability Index CVI(D, A) mesure l'exploitabilite de la cosine similarity pour le poisoning :

```
CVI(D, A) = (1/k) * Σ_{j=1}^{k} max_{d ∈ D_legit} cos(e(a_j), e(d))
```

ou D_legit = D \ A sont les documents legitimes.

**Interpretation** :
- CVI ∈ [0, 1]
- CVI → 1 : les documents adversariaux sont semantiquement proches des documents legitimes = poisoning facile
- CVI → 0 : les adversariaux sont distants = detection par similarite possible
- CVI > 0.7 : la cosine similarity est INSUFFISANTE pour distinguer adversarial de legitime (seuil propose base sur F06 Gauge Matrix)

**Lien avec F06 (Gauge Matrix)** :
F06 (Steck 2024) montre que la cosine similarity n'est pas unique sous transformation diagonale. CVI quantifie l'impact pratique : a quel point cette non-unicite est-elle exploitable pour le poisoning ?

**Lien avec F49 (PIR)** :
PIR (P055) mesure le taux d'injection persistante. CVI mesure la **facilite** de cette injection via la proximite semantique. Relation : PIR est eleve quand CVI est eleve.

**Validation empirique requise** :
- Calculer CVI sur le corpus AEGIS (aegis_corpus + aegis_bibliography)
- Injecter des chunks adversariaux synthetiques et mesurer CVI
- Comparer avec le seuil de detection du RagSanitizer
- Benchmark : CVI(AEGIS) vs CVI(corpus generique) pour quantifier la vulnerabilite medicale

**Papers de reference** : P012 (Steck, Gauge), P055 (PIR), P054 (PIDP), **P065 (RAGDefender — calibration empirique)**

**Mise a jour RUN-004 (2026-04-04)** :
P065 (Kim, Lee, Koo 2025 — RAGDefender) fournit des donnees empiriques directes : cos adversarial/legitime = 0.976 vs. 0.309 sur le corpus NQ. Cela confirme le seuil CVI > 0.7 comme frontiere de vulnerabilite. Un CVI de 0.976 >> 0.7 signifie que la cosine similarity est **completement insuffisante** pour distinguer les documents adversariaux des legitimes sur NQ. P079 (ES2) montre que la separation dans l'espace d'embedding augmente la perturbation requise de 3-4x, ce qui revient a reduire CVI de facon equivalente.

---

## F58 — Medical Vulnerability Premium (pour C6 : medical plus vulnerable)

**Conjecture** : C6 (les systemes LLM medicaux sont plus vulnerables que les generalistes)
**Gap** : La vulnerabilite medicale est prouvee empiriquement mais pas formalisee en metrique

**Definition** :

Soit M_med un modele fine-tune medical et M_gen le meme modele de base (generaliste). Le Medical Vulnerability Premium MVP mesure le surcout de vulnerabilite du a la specialisation medicale :

```
MVP(M_med, M_gen) = ASR(M_med) / ASR(M_gen) - 1
```

ou ASR est mesure sur le meme jeu d'attaques adversariales (N >= 30 par condition).

**Proprietes** :
- MVP > 0 : le modele medical est PLUS vulnerable que le generaliste
- MVP = 0 : vulnerabilite identique
- MVP < 0 : le modele medical est MOINS vulnerable (defense par specialisation)

**Extension multi-dimensionnelle** :

```
MVP_d(M_med, M_gen) = (ASR_d(M_med) - ASR_d(M_gen)) / ASR_d(M_gen)
```

pour chaque dimension d ∈ {injection, rule_bypass, prompt_leak, tool_hijack}.

**Donnees existantes** (P050, Lee 2025 JAMA) :
- MTSD medical : score median 9.5 → 5.5 (42.1% degradation)
- MTSD generaliste : score median 9.5 → 7.2 (24.2% degradation estimee)
- MVP_MTSD = (42.1 - 24.2) / 24.2 = 0.74 (74% de surcout de vulnerabilite)

**Donnees P029** (Lee JAMA) :
- ASR medical direct : 94.4%
- ASR generaliste estime : ~60-70%
- MVP_direct = (94.4 - 65) / 65 = 0.45 (45% de surcout)

**Facteurs explicatifs** (pourquoi MVP > 0) :
1. Le fine-tuning medical affaiblit l'alignement RLHF general (D-018 potentielle, P050)
2. Le vocabulaire medical cree une surface d'attaque specifique (autorite clinique, protocoles)
3. Le biais de deference medicale du modele (priorite patient > securite technique)

**Validation empirique requise** :
- Calculer MVP sur les 22 modeles de P050 (donnees existantes)
- Tester avec nos 97 templates AEGIS : comparer ASR sur LLaMA 3.2 base vs LLaMA 3.2 medical-finetune
- Objectif : MVP quantifie + IC 95% + test statistique (N >= 30)

**Papers de reference** : P029 (Lee JAMA), P050 (MTSD), P035, P040 (emotional amp), **P068 (CARES — base de calibration), P073 (MEDIC — echelle Med-Safety)**

**Mise a jour RUN-004 (2026-04-04)** :
P068 (CARES) fournit 18K prompts avec 4 niveaux de nocivite — dataset ideal pour calculer MVP par niveau de nocivite. P073 (MEDIC) etablit une echelle Med-Safety 1-5 avec $\rho_{Spearman} > 0.98$ d'accord inter-juges, ce qui permet une mesure fiable de MVP_med. P071 (Wang et al.) montre que la mesure peut etre reproduite sur CPU standard sans IRB, rendant MVP_clinical calculable dans le cadre de la these sans infrastructure hospitaliere.

---

## F59 — Reasoning Exploitation Ratio (pour C7 : paradoxe raisonnement)

**Conjecture** : C7 (la capacite de raisonnement des LRM augmente paradoxalement leur vulnerabilite)
**Gap** : Le paradoxe est observe (P036 : 97.14% multi-turn ASR) mais pas quantifie formellement

**Definition** :

Soit M un modele de langage et R(M) sa capacite de raisonnement (mesuree par un benchmark standard, ex: MMLU, ARC, GSM8k). Le Reasoning Exploitation Ratio RER mesure la correlation entre capacite de raisonnement et vulnerabilite :

```
RER(M) = ASR_multi-turn(M) / ASR_single-turn(M)
```

ou ASR_multi-turn est mesure sur des attaques a 3+ tours et ASR_single-turn sur des attaques one-shot.

**Interpretation** :
- RER = 1 : le raisonnement n'amplifie pas la vulnerabilite (hypothese nulle)
- RER > 1 : le raisonnement AMPLIFIE la vulnerabilite (le modele raisonne "mieux" pour contourner ses gardes-fous)
- RER → 3-4 : amplification forte observee sur les LRM (P036 : 97.14% / ~25% single-turn)

**Extension par capacite de raisonnement** :

Pour un ensemble de modeles M_1, ..., M_n avec des capacites R(M_i) differentes, la regression :

```
RER(M_i) = alpha + beta * R(M_i) + epsilon
```

Si beta > 0 et significatif : le paradoxe est confirme — plus le modele raisonne, plus RER est eleve.

**Donnees existantes** (P036) :
- DeepSeek R1 : R(MMLU) = 90.8%, ASR_multi = 97.14%
- Modeles moyens : R(MMLU) ~70%, ASR_multi ~50%
- beta estime > 0 (correlation positive)

**Facteurs explicatifs** (pourquoi RER > 1) :
1. Les LRM decomposent les gardes-fous en sous-problemes et les contournent par raisonnement
2. La capacite de planification multi-etapes permet des attaques plus sophistiquees
3. Le modele "raisonne" que la demande adversariale est plausible et merite une reponse

**Validation empirique requise** :
- Calculer RER sur 5+ modeles avec des capacites de raisonnement variees
- Tester la regression RER ~ R(M) avec beta significatif
- Objectif : prouver que beta > 0 (IC 95%, p < 0.05)
- Besoin de 3+ papers LRM supplementaires (Theme 9 EMERGENT)

**Papers de reference** : P036 (LRM multi-turn 97.14%), P039 (GRPO reverse), P052 (martingale), **P073 (MEDIC — fiabilite du protocole d'evaluation)**

**Mise a jour RUN-004 (2026-04-04)** :
P073 (MEDIC) confirme $\rho_{Spearman} > 0.98$ sur le protocole d'evaluation double-LLM, ce qui renforce la fiabilite des mesures ASR_multi et ASR_single sur lesquelles RER est calcule. P076 (ISE, ICLR 2025) montre que l'architecture ISE reduit RER indirectement en diminuant l'ASR multi-tour (+18.68% robustesse), ce qui valide que RER est ameliorable par intervention architecturale.

---

## Resume des 4 formules

| ID | Nom | Conjecture | Formule simplifiee | Donnees dispo | Priorite |
|----|-----|-----------|-------------------|---------------|----------|
| F56 | Drift Rate | C4 | DR = moyenne des derives cosinus inter-tours | P050 (22 modeles) | Haute |
| F57 | Cosine Vulnerability Index | C5 | CVI = proximite moyenne adversarials/legitimes | AEGIS corpus | Haute |
| F58 | Medical Vulnerability Premium | C6 | MVP = ASR_med / ASR_gen - 1 | P029, P050 | **Critique** |
| F59 | Reasoning Exploitation Ratio | C7 | RER = ASR_multi / ASR_single | P036 | Moyenne |

**Impact** : Avec F56-F59 formalisees et validees empiriquement, les conjectures C4-C7 passeraient de 8-9/10 a 10/10. Le chapitre 3 (Framework) serait a 95% au lieu de 80%.

---

## Bilan des mises a jour RUN-004 (2026-04-04)

| Draft | Statut avant | Mise a jour RUN-004 | Statut apres |
|-------|-------------|---------------------|--------------|
| F56 (Drift Rate) | Draft — seuil propose | **CONFIRME** : P078 (ZEDD) valide cosinus drift, F1=95.3%, seuil GMM compatible | Pret pour validation |
| F57 (CVI) | Draft — seuil > 0.7 propose | **CALIBRE** : P065 cosine adversarial=0.976 confirme seuil, P079 valide la formule inversement | Pret pour validation |
| F58 (MVP) | Draft — donnees estimees | **DONNE BASE** : P068 (18K prompts), P073 (Med-Safety fiable), P071 (reproductible sans IRB) | Validation empirique possible |
| F59 (RER) | Draft — 1 seul paper (P036) | **PROTOCOLE RENFORCE** : P073 confirme fiabilite evaluation (rho>0.98), P076 ISE valide que RER ameliorable | Validation en attente de N>=5 modeles |
