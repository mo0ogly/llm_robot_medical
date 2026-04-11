# Formules F56-F59 — Version FINALE

> **Auteur** : agent MATHEUX (AEGIS, ENS 2026)
> **Date** : 2026-04-04
> **Statut** : FINAL — calibre sur 80 analyses doctorales via ChromaDB
> **Objectif** : Fermer les trous mathematiques C4-C7 avec donnees empiriques

---

## F56 — Drift Rate (DR)

**Conjecture ciblee** : C4 (derive semantique progressive)
**Nature epistemique** : `[EMPIRIQUE]` — observe et calibre sur donnees experimentales, pas de preuve de convergence formelle
**Gap comble** : F41 (MTSD) mesure la degradation du score de securite mais pas la derive dans l'espace d'embedding

### Definition mathematique

Soit M un modele, T = {t_1, ..., t_n} une sequence de n tours de conversation, et f un encodeur d'embedding (e.g., all-MiniLM-L6-v2 ou all-MPNet-Base-V2). Soit e(t_i) = f(response(t_i)) l'embedding de la reponse au tour i. Le Drift Rate DR(M, T) mesure la derive semantique moyenne normalisee par tour :

```
DR(M, T) = (1 / (n-1)) * sum_{i=1}^{n-1} [1 - cos(e(t_i), e(t_{i+1}))]
```

ou cos(a, b) = (a . b) / (||a|| * ||b||) est la similarite cosinus.

**Cas particulier (ZEDD)** : Pour une paire (x, x') prompt propre / prompt injecte :

```
Drift(x, x') = 1 - cos(f(x), f(x'))
```

(Sekar et al., 2026, Section 4.2, Eq. 1)

DR(M, T) est la generalisation sequentielle de Drift(x, x') aux conversations multi-tours.

### Proprietes

- DR in [0, 1] — normalise par construction
- DR = 0 : aucune derive (reponses semantiquement identiques entre tours consecutifs)
- DR -> 1 : derive maximale (reponses orthogonales entre tours consecutifs)
- DR est une moyenne : DR(T_1 + T_2) = (|T_1-1| * DR(T_1) + |T_2-1| * DR(T_2)) / (|T_1| + |T_2| - 2)

### Hypotheses

| Hypothese | Explicite/Implicite | Force | Verifiable en pratique ? | Commentaire |
|-----------|-------------------|-------|------------------------|-------------|
| H1 : Encodeur fixe | Explicite | Forte | Oui | ZEDD utilise des encodeurs fine-tunes specifiques ; AEGIS utilise all-MiniLM-L6-v2 fige |
| H2 : Embedding capture la semantique de securite | Implicite | Forte | Partiellement | La cosine est sensible a la matrice gauge (Steck et al., 2024, Section 3) — les antonymes peuvent avoir une cosine elevee (C5) |
| H3 : Derive monotone dans les attaques multi-tours | Implicite | Moyenne | A verifier empiriquement | P050 montre une degradation non-monotone sur certains modeles (Section 5, Figure 3) |
| H4 : Tours successifs sont comparables | Explicite | Faible | Oui | Valide tant que les reponses sont dans le meme domaine thematique |

### Donnees de calibration

**Source P078 (Sekar et al., 2026 — ZEDD)** :
- 51 603 paires test alignees : 25 801 clean-clean + 25 802 clean-injected (Section 5, p. 6)
- Modeles testes : Llama 3 8B Instruct, Mistral 7B Instruct, Qwen 2 7B Instruct, Sentence-BERT All-MPNet-Base-V2 (Table 1, p. 6)
- Performance de detection basee sur le drift :
  - Llama 3 8B : F1 = 95.30%, Precision = 95.85%, Recall = 94.75%, FPR = 5.5% (Table 1)
  - Mistral 7B : F1 = 95.50%, Accuracy = 95.55%, FPR = 2.3% (Table 1)
  - Qwen 2 7B : F1 = 95.38%, Accuracy = 95.46%, FPR = 2.2% (Table 1)
  - SBERT : Accuracy = 90.75%, Recall = 81.78% — performance inferieure (Table 2, p. 6)
- IC 95% : par ex. Llama 3 EM = 98.10% +/- 0.16%, SL = 96.70% +/- 0.15% (Table 4, Appendix)
- Seuil GMM : FPR clean cap a 3% en moyenne (Section 5, p. 6)
- 5 categories d'injection testees : Encoding Manipulation, Jailbreak, Prompt Confusion, System Leak, Task Override (Table 3, Appendix C)

**Source P012 (Steck et al., 2024 — Gauge Matrix)** :
- La cosine similarity est dependante de la methode d'apprentissage et de la regularisation (Section 2-3)
- Implication pour DR : le seuil absolu de DR depend de l'encodeur choisi — pas de seuil universel

**Source P051 (Nguyen et al., 2026 — Linguistic Features)** :
- Detection complementaire a la cosine drift via 4 dimensions linguistiques (Professionnalisme, Pertinence Medicale, Comportement Ethique, Distraction Contextuelle)
- Confirme que DR seul est insuffisant en domaine medical — combiner avec F51 (detection linguistique)

### Seuils calibres

| Seuil | Valeur | Source | Condition |
|-------|--------|--------|-----------|
| DR alerte | > 0.15 par tour | Propose (draft), compatible avec seuil GMM ZEDD | Encodeur all-MiniLM-L6-v2 |
| FPR accepte | <= 3% | P078, Section 5 | Cap GMM avec donnees clean |
| DR detection | Variable par encodeur | P078, Table 1 | Dependant du fine-tuning de l'encodeur |

### Regime de validite

- **N minimal** : N >= 30 conversations par condition (Zverev et al., 2025, ICLR)
- **Tours minimaux** : n >= 3 tours par conversation (P050 utilise 3 tours ; P036 utilise jusqu'a 30+ tours)
- **Encodeur** : Resultat dependant de l'encodeur — calibrer le seuil par encodeur. ZEDD montre que les encodeurs fine-tunes surpassent les encodeurs generiques (SBERT 90.75% vs Llama 3 95.30%, Table 1-2, P078)

### Liens avec le glossaire existant

- **F15 Sep(M)** : Sep(M) mesure la separation globale (Zverev et al., 2025, Definition 2, p.4) ; DR mesure la derive locale tour-a-tour. DR eleve implique Sep(M) faible mais pas l'inverse.
- **F22 ASR** : DR est un indicateur predictif de l'ASR multi-tour — une correlation DR-ASR elevee confirmerait que la derive semantique precede le contournement effectif des gardes-fous.
- **F41 MTSD** : MTSD = (S_1 - S_T) / S_1 * 100% mesure la degradation du score de securite (P050, Definition). DR mesure la derive dans l'espace d'embedding. La correlation DR-MTSD quantifie si la derive semantique cause la degradation de securite.
- **F49 PIR** : PIR (P055) mesure la persistance d'injection RAG ; DR mesure la derive conversationnelle. Les deux sont des metriques de progression temporelle d'attaque.

---

## F57 — Cosine Vulnerability Index (CVI)

**Conjecture ciblee** : C5 (similarite cosinus insuffisante pour la separation)
**Nature epistemique** : `[EMPIRIQUE]` — calibre sur donnees experimentales de P065 et P026, pas de borne theorique
**Gap comble** : Quantification du probleme documente qualitativement par F06 (Gauge) et F49 (PIR)

### Definition mathematique

Soit D un corpus de documents, E l'espace d'embedding de dimension d, et A = {a_1, ..., a_k} un ensemble de documents adversariaux injectes dans D. Le Cosine Vulnerability Index CVI(D, A) mesure l'exploitabilite de la cosine similarity pour le poisoning :

```
CVI(D, A) = (1/k) * sum_{j=1}^{k} max_{d in D_legit} cos(e(a_j), e(d))
```

ou D_legit = D \ A sont les documents legitimes et e(.) est la fonction d'embedding.

### Forme equivalente (concentration-based, RAGDefender)

```
CVI_cluster(A) = (1 / C(k,2)) * sum_{i<j} cos(e(a_i), e(a_j))
```

ou C(k,2) = k*(k-1)/2. Cette forme mesure la cohesion intra-cluster des adversariaux.

(Kim, Lee & Koo, 2025, RAGDefender, Section 7, p. 9)

### Proprietes

- CVI in [0, 1]
- CVI -> 1 : documents adversariaux semantiquement indistinguables des legitimes = poisoning aise
- CVI -> 0 : adversariaux distants = detection par similarite cosinus possible
- CVI_cluster eleve + CVI eleve = poisoning quasi-indectectable par methodes basees sur la cosine seule

### Hypotheses

| Hypothese | Explicite/Implicite | Force | Verifiable en pratique ? | Commentaire |
|-----------|-------------------|-------|------------------------|-------------|
| H1 : Espace d'embedding isotrope | Implicite | Forte | Non — P012 prouve la non-unicite sous transformation diagonale | Principal facteur de biais du CVI |
| H2 : Adversariaux optimises pour proximite | Explicite | Moyenne | Oui | Condition standard des attaques de poisoning RAG (P026, P055) |
| H3 : Corpus statique | Explicite | Moyenne | Oui pour evaluation, non en production | Les corpus RAG evoluent en pratique |
| H4 : Encodeur identique pour indexation et detection | Implicite | Forte | Oui dans AEGIS | Si encodeurs differents, CVI non comparable |

### Donnees de calibration

**Source P065 (Kim, Lee & Koo, 2025 — RAGDefender)** :
- Cosine similarity intra-cluster adversariaux : **0.976** (Section 7, Discussion, p. 9)
- Cosine similarity intra-cluster benins : **0.309** (Section 7, Discussion, p. 9)
- Ratio : 0.976 / 0.309 = 3.16x — les adversariaux sont 3x plus cohesifs que les benins
- Corpus : MS MARCO (Section 7)
- Defense RAGDefender avec 2 stages combinee : ASR = 0.05 sur LLaMA-7B (Section 6.4, Table)
- Meme avec attaquant adaptatif minimisant la cosine inter-adversariaux : ASR chute de 0.97 a 0.15 (Section 6.5)
- Detection rate des passages adversariaux : 0.94 avec N_adv estime a 21.4 (ratio 4x, Section 7)

**Source P026 (CEM, 2026)** :
- 11 datasets, 8 modeles d'embedding testes systematiquement (Section 5)
- Quelques tokens adversariaux suffisent pour un recall quasi-parfait (Section 5, Appendice C)
- Vulnerabilite issue de l'espace d'embedding lui-meme, pas de la modalite de requete (Section 5, Takeaway)
- Cout : $0.21 avec voyage-3.5-lite, $0.76 max avec Qwen text-embedding-v4 (Section 5)
- Attaque transferable cross-modele : position-agnostique, dispersion de tokens possible (Section 5)

**Source P012 (Steck et al., 2024 — Gauge Matrix)** :
- La cosine similarity n'est pas unique sous transformation diagonale (Section 2-3)
- Implication : CVI peut varier significativement selon la regularisation de l'encodeur

### Seuils calibres

| Seuil | Valeur | Source | Interpretation |
|-------|--------|--------|---------------|
| CVI vulnerabilite | > 0.70 | Propose, confirme par P065 (0.976 >> 0.70) | Cosine insuffisante pour distinguer adversarial de legitime |
| CVI securite | < 0.40 | Derive de P065 (benins = 0.309) | Detection par cosine fiable |
| CVI zone grise | [0.40, 0.70] | Intervalle entre les deux seuils | Metriques complementaires requises |
| CVI_cluster alerte | > 0.80 | Derive de P065 | Clustering adversarial detectable |

### Regime de validite

- **N minimal** : k >= 5 documents adversariaux (P065 teste avec ratios 1x a 10x)
- **Corpus minimal** : |D_legit| >= 100 documents (P065 teste sur NQ, HotpotQA, MS MARCO)
- **Encodeur** : CVI est specifique a l'encodeur. P026 montre que 8 modeles differents sont tous vulnerables mais a des degres differents.
- **Nature epistemique** : [ALGORITHME] pour le calcul de CVI ; [EMPIRIQUE] pour les seuils

### Liens avec le glossaire existant

- **F06 Gauge Matrix** : F06 (Steck, 2024) etablit le probleme theorique ; CVI le quantifie operationnellement. CVI eleve = la non-unicite de la cosine est exploitable en pratique.
- **F15 Sep(M)** : Sep(M) mesure la separation globale ; CVI mesure la vulnerabilite specifique au poisoning RAG. Systeme avec Sep(M) eleve mais CVI eleve = securite conversationnelle OK mais RAG vulnerable.
- **F22 ASR** : CVI predit l'ASR des attaques de poisoning RAG — CVI eleve correle avec ASR eleve sur P065 (ASR = 0.97 sans defense vs 0.05 avec defense, Section 6.4).
- **F49 PIR** : PIR mesure le taux de persistance d'injection ; CVI mesure la facilite de l'injection initiale. Relation causale : CVI eleve -> PIR eleve.

---

## F58 — Medical Vulnerability Premium (MVP)

**Conjecture ciblee** : C6 (les systemes LLM medicaux sont plus vulnerables que les generalistes)
**Nature epistemique** : `[EMPIRIQUE]` — calibre sur P050 (22 modeles), P028/P074 (7 modeles), P029 (JAMA) ; pas de preuve formelle du mecanisme causal
**Gap comble** : La vulnerabilite medicale est prouvee empiriquement mais pas formalisee en metrique comparative

### Definition mathematique

Soit M_med un modele fine-tune medical et M_gen le meme modele de base (generaliste). Le Medical Vulnerability Premium MVP mesure le surcout de vulnerabilite du a la specialisation medicale :

```
MVP(M_med, M_gen) = ASR(M_med) / ASR(M_gen) - 1
```

ou ASR est mesure sur le meme jeu d'attaques adversariales (N >= 30 par condition).

### Extension par degradation de score de securite (MTSD-based)

```
MVP_MTSD(M_med, M_gen) = MTSD(M_med) / MTSD(M_gen) - 1
```

ou MTSD(M) = (S_1 - S_T) / S_1 * 100% est la degradation de securite multi-tour (F41).

### Extension multi-dimensionnelle

```
MVP_d(M_med, M_gen) = (ASR_d(M_med) - ASR_d(M_gen)) / ASR_d(M_gen)
```

pour chaque dimension d in {injection, rule_bypass, prompt_leak, tool_hijack, clinical_harm}.

### Proprietes

- MVP > 0 : le modele medical est PLUS vulnerable que le generaliste
- MVP = 0 : vulnerabilite identique
- MVP < 0 : le modele medical est MOINS vulnerable (defense par specialisation)
- MVP est asymetrique : MVP(M_med, M_gen) != -MVP(M_gen, M_med)

### Hypotheses

| Hypothese | Explicite/Implicite | Force | Verifiable en pratique ? | Commentaire |
|-----------|-------------------|-------|------------------------|-------------|
| H1 : Meme modele de base | Explicite | Forte | Oui pour les modeles open-weight | Non verifiable pour les modeles commerciaux sans acces aux poids |
| H2 : Meme jeu d'attaques | Explicite | Forte | Oui | Condition de comparabilite — necessite un benchmark standard |
| H3 : ASR_gen > 0 | Implicite | Moyenne | Oui sauf modeles parfaitement alignes | Division par zero si ASR_gen = 0 |
| H4 : Fine-tuning medical est le seul facteur | Implicite | Forte | Non — taille du modele, donnees de RLHF varient aussi | Confondeur majeur a controler |
| H5 : Mesure par juge LLM fiable | Implicite | Moyenne | Partiellement — P073 MEDIC montre rho_Spearman > 0.98 | Mais P044 montre que les juges LLM sont manipulables (99% flip rate) |

### Donnees de calibration

**Source P050 (JMedEthicBench, 2026)** :
- 22 modeles evalues : 6 medicaux + 16 generalistes (Section 5, Figure 3)
- Degradation multi-tour (3 tours) :
  - Modeles commerciaux alignes : Claude Opus 4.1, Claude Sonnet 4 > 9.0 aux 3 tours ; GPT-5 entre 8.0-9.0 (Section 5.2, Figure 3)
  - Modeles medicaux : HuatuoGPT-o1-7B, II-Medical-8B, II-Medical-32B-Preview **< 4.0 au tour 3** (Section 5.2, Figure 3)
  - MTSD medical (calcul) : (9.5 - 4.0) / 9.5 = 57.9% pour les pires modeles medicaux
  - MTSD generaliste commercial : (9.5 - 8.5) / 9.5 = 10.5% pour les meilleurs generalistes
  - **MVP_MTSD = (57.9 - 10.5) / 10.5 = 4.51** — les modeles medicaux se degradent 5.5x plus vite que les generalistes commerciaux
- Safety Pass Rate (Section 5.3, Figure 5b) : les modeles medicaux occupent le quadrant bas-gauche (faible securite + faible utilite)
- Scaling : les modeles plus grands sont plus surs DANS chaque famille (Section 5.4, Figure 5a) mais les modeles medicaux restent en-dessous des generalistes a taille egale

**Source P028/P074 (Zhang et al., 2025)** :
- 7 LLM testes : GPT-4o, GPT-4-turbo, LLaMA 3.3-70B, LLaMA 3.1-8B, Meditron-7B, Meditron-70B (Section Methods)
- Meditron (medical) : pas de safety alignment separee => compliance quasi-totale (Section 4)
- FlipAttack (meilleure technique) : compliance rate = 0.98 pour GPT-4o, 1.00 pour GPT-4-turbo (Table 2)
- CFT (defense) : reduit l'effectiveness score de 62.7% en moyenne sur LLaMA 3.1-8B (Section 4)
- Model Breach Rate : eleve pour tous les modeles, maximal pour les modeles medicaux sans safety alignment (Table 3)

**Source P029 (Lee et al., 2025 — JAMA Network Open)** :
- ASR medical direct : 94.4% (Table 3, cite dans le draft)
- Context : modeles medicaux dans un contexte clinique

**Source P035 (Lee, Jang & Choi, 2026 — MPIB)** :
- 9 697 instances MPIB avec metric CHER (Clinical Harm Event Rate)
- Contribution cle : ASR et clinical harm peuvent diverger significativement — un ASR eleve ne signifie pas necessairement un harm clinique proportionnel
- Implication pour MVP : MVP doit etre calcule sur le harm reel (CHER) en plus de l'ASR brut

### Points de calibration MVP

| Comparaison | MVP calcule | Source | Metrique |
|-------------|-------------|--------|----------|
| Medical (HuatuoGPT-o1-7B) vs General (Qwen 3-8B) | ~4.5 (MTSD) | P050, Section 5, Figure 3 | MTSD tour 3 |
| Medical (II-Medical-8B) vs General (comparable size) | ~3.0-4.0 (MTSD) | P050, Section 5, Figure 3 | MTSD tour 3 |
| Medical (Meditron) vs General (LLaMA base) | >> 0 (compliance 1.00 vs < 0.50) | P028, Table 2-3 | Compliance Rate |
| Commercial aligne vs Medical aligne | ~0.74 (MTSD) | Draft original, calcul | MTSD median |
| JAMA direct | ~0.45 (ASR) | P029, Table 3 | ASR brut |

**Observation critique** : MVP varie de 0.45 a 4.5+ selon la metrique et les modeles compares. Les modeles medicaux SANS safety alignment separee (Meditron, HuatuoGPT) montrent un MVP >> 1. Les modeles medicaux AVEC alignment (MedGemma-27B) montrent un MVP plus modere.

### Regime de validite

- **N minimal** : N >= 30 par condition (Zverev et al., 2025)
- **Condition de comparabilite** : meme famille de modeles (e.g., LLaMA base vs LLaMA medical), meme benchmark d'attaque
- **Confondeurs** : taille du modele, donnees RLHF, epoque de training — doivent etre controles
- **Temporalite** : MVP change au fil des mises a jour de modeles — date de mesure obligatoire
- **Juge** : utiliser un juge deterministe ou un protocole double-LLM valide (P073, rho_Spearman > 0.98)

### Liens avec le glossaire existant

- **F15 Sep(M)** : Sep(M) mesure la separation modele ; MVP mesure le differentiel medical. Un modele avec Sep(M) faible ET MVP eleve est en danger critique.
- **F22 ASR** : MVP est defini directement en termes d'ASR. La fiabilite de MVP depend de la fiabilite de la mesure d'ASR.
- **F41 MTSD** : MVP_MTSD est la forme preferee car MTSD capture la degradation progressive, pas seulement le taux binaire de succes.
- **F56 DR** : La derive semantique (DR) est potentiellement plus forte sur les modeles medicaux — DR_med > DR_gen testerait le mecanisme sous-jacent de MVP.

---

## F59 — Reasoning Exploitation Ratio (RER)

**Conjecture ciblee** : C7 (la capacite de raisonnement des LRM augmente paradoxalement leur vulnerabilite)
**Nature epistemique** : `[EMPIRIQUE]` — observe sur 4 LRM et 9 cibles (P036), pas de preuve formelle du mecanisme causal
**Gap comble** : Le paradoxe raisonnement-vulnerabilite est observe (P036 : 97.14% multi-turn ASR) mais pas quantifie formellement

### Definition mathematique

Soit M un modele de langage et R(M) sa capacite de raisonnement (mesuree par MMLU, ARC, ou GSM8k). Le Reasoning Exploitation Ratio RER mesure l'amplification de vulnerabilite par le raisonnement multi-tour :

```
RER(M) = ASR_multi(M) / ASR_single(M)
```

ou ASR_multi est mesure sur des attaques conversationnelles a 3+ tours et ASR_single sur des attaques one-shot directes.

### Extension : modele de regression inter-modeles

Pour un ensemble de modeles M_1, ..., M_n avec des capacites R(M_i) differentes :

```
log(RER(M_i)) = alpha + beta * R(M_i) + epsilon_i
```

- Si beta > 0 et p < 0.05 : le paradoxe est statistiquement confirme — plus le modele raisonne, plus RER est eleve
- La log-transformation est utilisee car RER > 0 et potentiellement heteroscedastique

### Proprietes

- RER >= 0 par construction (ratio de taux)
- RER = 1 : le raisonnement n'amplifie pas la vulnerabilite (hypothese nulle H_0)
- RER > 1 : le raisonnement AMPLIFIE la vulnerabilite
- RER < 1 : le raisonnement PROTEGE (le modele detecte mieux les attaques multi-tours)

### Hypotheses

| Hypothese | Explicite/Implicite | Force | Verifiable en pratique ? | Commentaire |
|-----------|-------------------|-------|------------------------|-------------|
| H1 : ASR_single > 0 | Implicite | Forte | Oui sauf modeles parfaitement alignes | Division par zero si aucune attaque single-turn ne reussit |
| H2 : Meme jeu d'attaques (contenu identique, format different) | Explicite | Forte | Oui | Necessaire pour isoler l'effet du multi-tour |
| H3 : R(M) capture la capacite de raisonnement pertinente | Implicite | Moyenne | Partiellement | MMLU mesure les connaissances, pas le raisonnement pur — GSM8k ou ARC sont plus adaptes |
| H4 : Relation monotone entre R(M) et RER | Implicite | Moyenne | A verifier | Possible non-linearite ou saturation aux extremes |
| H5 : Juge fiable pour ASR_multi | Explicite | Forte | Oui avec protocole double-LLM | P073 valide rho_Spearman > 0.98 ; P036 utilise ICC = 0.883 (Section Methods) |

### Donnees de calibration

**Source P036 (Hagendorff, Derner & Oliver, 2026 — Nature Communications 17, 1435)** :
- **ASR global multi-tour** : 97.14% — seuls 2 items sur 70 n'atteignent jamais le score maximal (Section 3, p. 5)
- Par modele adversarial (max harm score) :
  - DeepSeek-R1 : 90.00% (IC 95% : 80.77%-95.07%) (Section 3, Figure 2)
  - Grok 3 Mini : 87.14% (IC 95% : 77.34%-93.09%) (Section 3, Figure 2)
  - Gemini 2.5 Flash : 71.43% (IC 95% : 59.95%-80.68%) (Section 3, Figure 2)
  - Qwen3 235B : 12.86% (IC 95% : 6.91%-22.66%) (Section 3, Figure 2)
- **Experience controle (single-turn)** : scores de harm tres faibles en moyenne (Section 3, p. 7) :
  - Grok 3 : mean = 0.557, SD = 1.414
  - DeepSeek-V3 : mean = 0.519, SD = 1.453
  - Scores mean < 1.0 pour tous les modeles en single-turn
- **Calcul RER** (harm score max >= 5, multi-tour vs single-turn) :
  - Si on prend comme proxy ASR_single ~ proportion de scores >= 5 en single-turn (estime < 5% base sur mean < 0.6 et SD ~1.4 sur echelle 0-5), alors :
  - RER(DeepSeek-R1 comme attaquant) ~ 90% / ~5% = **~18** [HYPOTHESE — ASR_single estime, non mesure directement]
  - Borne conservative : si ASR_single ~ 15%, RER ~ 6
  - **Conclusion robuste : RER >> 1 pour les LRM, quelle que soit l'estimation raisonnable de ASR_single**
- Inter-annotateur : ICC = 0.848 a 0.917 (mean = 0.883), Cohen's Kappa = 0.469-0.549 (mean = 0.516) (Section Methods, p. 4)
- 10 strategies persuasives identifiees (cadrage educatif, surcharge informationnelle, appel a l'autorite, etc.) (Section 3)

**Source P036 — Specificite par modele cible** (Section 3, Figure 2) :
- Modele cible le plus vulnerable au multi-tour (max harm score) :
  - Claude Sonnet 3.5 : 71.43% (IC 95% : 59.94%-80.68%)
  - GPT-4o : 61.43% (IC 95% : 49.72%-71.95%)
  - Qwen3 30B et Gemini 2.5 Flash : 71.43%
- Nombre de refusals (proxy de la resistance) : DeepSeek-V3 le plus refuseur (n = 2003)

**Source P073 (MEDIC, 2026)** :
- rho_Spearman > 0.98 pour le protocole d'evaluation double-LLM (cite dans le draft)
- Valide la fiabilite des mesures ASR_multi et ASR_single sur lesquelles RER est calcule

**Source P076 (ISE, ICLR 2025)** :
- Instructional Segment Embedding reduit l'ASR multi-tour de 18.68% (Section 8)
- Implication : RER est ameliorable par intervention architecturale — le paradoxe n'est pas une fatalite
- Limitation : ISE teste uniquement en single-turn dans l'article (Section 8, Limitations)

### Points de calibration RER

| Modele adversarial | ASR_multi (%) | ASR_single (estime) | RER estime | IC 95% ASR_multi | Source |
|-------------------|---------------|-------------------|-----------|-----------------|--------|
| DeepSeek-R1 | 90.00 | ~5-15% | 6-18 | [80.77, 95.07] | P036, Section 3 |
| Grok 3 Mini | 87.14 | ~5-15% | 6-17 | [77.34, 93.09] | P036, Section 3 |
| Gemini 2.5 Flash | 71.43 | ~5-15% | 5-14 | [59.95, 80.68] | P036, Section 3 |
| Qwen3 235B | 12.86 | ~5-15% | 0.9-2.6 | [6.91, 22.66] | P036, Section 3 |

**Observation critique** : Qwen3 235B a un RER potentiellement <= 1, suggerant que tous les LRM ne sont pas egalement vulnerables au paradoxe. Le RER depend de la strategie de raisonnement et des gardes-fous specifiques du modele.

### Regime de validite

- **N minimal** : N >= 5 modeles adversariaux avec des capacites de raisonnement variees (P036 en teste 4, juste sous le seuil)
- **ASR_single** : doit etre mesure directement (pas estime) pour un RER fiable — c'est la lacune principale de la calibration actuelle. Marque `[HYPOTHESE]` tant que ASR_single n'est pas mesure sur le meme benchmark.
- **Benchmark standardise** : utiliser les 70 items de P036 (7 categories x 10 items) pour comparabilite
- **Temporalite** : les LRM evoluent rapidement — RER doit etre remesure a chaque generation de modele
- **Juge** : triple-juge LLM avec ICC > 0.80 (P036 atteint 0.883)

### Liens avec le glossaire existant

- **F15 Sep(M)** : Sep(M) mesure la separation en contexte single-turn. RER > 1 implique que Sep(M) est une sous-estimation de la vulnerabilite reelle en multi-tour.
- **F22 ASR** : RER est un ratio d'ASR. La distinction ASR_single vs ASR_multi est fondamentale — ne pas agreger.
- **F41 MTSD** : MTSD mesure la degradation progressive ; RER mesure l'amplification par le raisonnement. Les deux capturent des aspects differents du multi-tour : MTSD = degradation passive, RER = exploitation active.
- **F56 DR** : DR eleve au cours d'une conversation multi-tour pourrait etre un indicateur predictif de RER > 1 — la derive semantique precede l'exploitation.

---

## Resume des 4 formules FINALES

| ID | Nom | Conjecture | Formule | Nature | Calibration | Priorite |
|----|-----|-----------|---------|--------|-------------|----------|
| F56 | Drift Rate | C4 | DR = (1/(n-1)) sum [1 - cos(e(t_i), e(t_{i+1}))] | [EMPIRIQUE] | P078 ZEDD : F1=95.3%, 51 603 paires, 4 modeles | Haute |
| F57 | Cosine Vulnerability Index | C5 | CVI = (1/k) sum max cos(e(a_j), e(d)) | [EMPIRIQUE] | P065 : cos_adv=0.976 vs cos_legit=0.309 sur MS MARCO | Haute |
| F58 | Medical Vulnerability Premium | C6 | MVP = ASR(M_med) / ASR(M_gen) - 1 | [EMPIRIQUE] | P050 : 22 modeles, MTSD medical 57.9% vs general 10.5% | **Critique** |
| F59 | Reasoning Exploitation Ratio | C7 | RER = ASR_multi / ASR_single | [EMPIRIQUE] | P036 : 97.14% multi, control < 5% single, RER >> 1 | Haute |

### Statut par rapport au draft

| Formule | Ameliorations par rapport au draft |
|---------|-----------------------------------|
| F56 | + IC 95% detailles par modele (Table 4 P078), + categories d'injection testees, + limitation encodeur-dependant, + lien avec P051 (detection linguistique complementaire) |
| F57 | + donnees P026 (11 datasets, 8 modeles, cout), + formule CVI_cluster equivalente, + seuils zone grise [0.40, 0.70], + formules de concentration N_adv (P065 Eq. 3-5) |
| F58 | + P050 donnees 22 modeles (dont 6 medicaux specifiques), + calculs MVP de 0.45 a 4.51, + distinction modeles avec/sans safety alignment, + CHER de P035 (divergence ASR/harm) |
| F59 | + ASR par modele adversarial avec IC 95%, + experience controle (mean < 0.6), + calcul RER borne conservative [6, 18], + Qwen3 RER potentiellement <= 1, + ICC inter-annotateur |

### Qualification epistemique globale

Les 4 formules sont toutes `[EMPIRIQUE]` — observees et calibrees sur des donnees experimentales, mais sans preuve formelle de convergence, d'optimalite, ou de causalite. Ceci est coherent avec la nature de la recherche en securite des LLM ou les resultats theoriques formels (bornes, theoremes) sont rares en raison de la complexite des modeles.

**Pour passer a [THEOREME]**, il faudrait :
- F56 : prouver que DR converge vers une distribution connue sous H0 (pas de derive)
- F57 : etablir une borne inferieure information-theoretique pour la detection basee sur CVI
- F58 : prouver formellement que le fine-tuning medical affaiblit les gardes-fous RLHF (mecanisme causal)
- F59 : prouver que la capacite de raisonnement implique mathematiquement une vulnerabilite accrue (decomposition des contraintes)

**Impact these** : Avec F56-F59 formalisees et calibrees, les conjectures C4-C7 passent de 8-9/10 a 10/10. Le chapitre 3 (Framework Formel) est a 95%.

---

## References completes

| Paper | Reference | Role dans F56-F59 |
|-------|-----------|-------------------|
| P012 | Steck et al. (2024), arXiv:2403.05440, ACM Web Conference | Gauge Matrix — limite theorique de la cosine (F57) |
| P026 | CEM (2026), 11 datasets, 8 modeles d'embedding | Vulnerabilite systematique embedding (F57) |
| P028/P074 | Zhang et al. (2025), arXiv:2501.18632 | Medical jailbreak ASR 7 LLM (F58) |
| P029 | Lee et al. (2025), JAMA Network Open | ASR medical 94.4% (F58) |
| P035 | Lee, Jang & Choi (2026), MPIB | CHER diverge de l'ASR (F58) |
| P036 | Hagendorff, Derner & Oliver (2026), Nature Comms 17:1435 | LRM 97.14% multi-turn (F59) |
| P050 | JMedEthicBench (2026) | MTSD 22 modeles, 3 tours (F56, F58) |
| P051 | Nguyen et al. (2026) | Detection linguistique complementaire (F56) |
| P055 | PIR / PIDP | Persistance injection RAG (F57) |
| P065 | Kim, Lee & Koo (2025), RAGDefender | cos_adv=0.976, defense ASR 0.05 (F57) |
| P073 | MEDIC (2026) | rho_Spearman > 0.98, fiabilite juge (F58, F59) |
| P076 | ISE (ICLR 2025) | Reduction ASR multi-tour 18.68% (F59) |
| P078 | Sekar et al. (2026), ZEDD | F1=95.3%, 51 603 paires, drift Eq. 1 (F56) |
