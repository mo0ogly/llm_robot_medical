# Module 4 — Scores et Metriques de Detection

**Temps estime** : 10-12 heures (v2.0 — enrichi avec 8 metriques 2026)
**Prerequis** : Module 1 (similarite cosinus), Module 2 (probabilites, indicatrices, IC)
**Formules couvertes** : 1.2 F1-Score, 3.1 Sep(M) Formel, 3.2 Sep(M) Empirique, 3.4 ASR, 6.2 Surprise Witness, 7.1 AUROC, 7.2 Seuil Clustering, **8.1 CHER** [2026], **8.2 ASR_k** [2026], **8.8 Logit Gap** [2026], **8.9 Benchmark Eff** [2026], **8.10 Benchmark Sep** [2026], **8.11 Defense Rate** [2026], **8.12 FPR/FNR** [2026], **8.13 Degradation SPP** [2026], **8.14 Multi-Turn ASR** [2026]

---

## Motivation : Pourquoi les metriques ?

Comment savoir si un detecteur d'injection est "bon" ? Comment mesurer si un modele separe correctement les instructions des donnees ? Les metriques sont les **instruments de mesure** de la securite. Sans elles, on ne peut ni comparer des approches ni valider scientifiquement une these.

**Articles concernes** : P008 (AUROC), P011 (F1), P024 (Sep(M)), P025 (accuracy), P029 (ASR), **P035** (CHER, ASR_k) [2026], **P036** (Multi-Turn ASR) [2026], **P038** (Defense Rate) [2026], **P042** (FPR/FNR) [2026], **P043** (Benchmark Eff/Sep) [2026], **P044** (Logit Gap) [2026], **P045** (Degradation SPP) [2026]

---

## Prerequis : Ce qu'il faut savoir avant

- Distributions de probabilite et esperance (Module 2)
- Fonctions indicatrices (Module 2)
- Similarite cosinus (Module 1, pour Sep(M))

---

## Partie A — Matrice de confusion

### Theorie formelle

Pour un classificateur binaire (injection / normal) :

|  | Predit : injection | Predit : normal |
|--|-------------------|----------------|
| **Reel : injection** | TP (Vrai Positif) | FN (Faux Negatif) |
| **Reel : normal** | FP (Faux Positif) | TN (Vrai Negatif) |

### Explication simple

- **TP** : le detecteur dit "injection" et c'est vrai -> bravo
- **FP** : le detecteur dit "injection" mais c'est normal -> fausse alerte (le chirurgien est interrompu pour rien)
- **FN** : le detecteur dit "normal" mais c'est une injection -> DANGER (l'injection passe)
- **TN** : le detecteur dit "normal" et c'est vrai -> tout va bien

En milieu medical, **les FN sont bien plus dangereux que les FP** : une injection qui passe peut recommander un dosage mortel, tandis qu'une fausse alerte interrompt juste le workflow.

---

## Partie B — Precision, Recall et F1-Score (Formule 1.2)

### Theorie formelle

$$\text{Precision} = \frac{TP}{TP + FP}$$

$$\text{Recall} = \frac{TP}{TP + FN}$$

$$F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2 \cdot TP}{2 \cdot TP + FP + FN}$$

Le F1 est la **moyenne harmonique** de la precision et du recall. Contrairement a la moyenne arithmetique, la moyenne harmonique penalise fortement les valeurs basses : si l'un des deux est mauvais, le F1 est mauvais.

### Explication simple

- **Precision** : "Parmi mes alertes, combien sont de vraies attaques ?" -> qualite des alertes
- **Recall** : "Parmi toutes les vraies attaques, combien ai-je detectees ?" -> couverture
- **F1** : note globale qui equilibre les deux

### Exemple numerique complet

100 requetes testees : 30 injections reelles, 70 normales.

Le detecteur produit :
- TP = 25 (injections correctement detectees)
- FP = 3 (normales faussement flaggees)
- FN = 5 (injections manquees)
- TN = 67 (normales correctement classees)

Precision = 25 / (25 + 3) = 25/28 = **0.893**
Recall = 25 / (25 + 5) = 25/30 = **0.833**
F1 = 2 * (0.893 * 0.833) / (0.893 + 0.833) = 2 * 0.744 / 1.726 = **0.862**

Comparaison avec PromptGuard (P011) : F1 = 0.91, ce qui est meilleur.

### Glossaire des symboles

| Symbole | Signification |
|---------|---------------|
| TP | True Positive (vrai positif) |
| FP | False Positive (faux positif, fausse alerte) |
| FN | False Negative (faux negatif, attaque manquee) |
| TN | True Negative (vrai negatif) |

### Ou c'est utilise

- **P011** : PromptGuard — F1 = 0.91
- **P008** : Attention Tracker — comparaison F1 entre methodes
- **P025** : DMPI-PMHFE — accuracy 97.94%

---

## Partie C — ASR : Attack Success Rate (Formule 3.4)

### Theorie formelle

$$\text{ASR} = \frac{\text{nombre d'attaques reussies}}{\text{nombre total d'attaques tentees}}$$

### Explication simple

Le taux de succes d'attaque est le "miroir offensif" du recall defensif. Il mesure l'efficacite de l'attaquant. Un ASR eleve signifie que le modele est tres vulnerable.

### Exemple numerique

Etude JAMA 2025 (P029) sur des LLM medicaux :
- 108 tentatives d'injection
- 102 reussies (le LLM recommande un traitement dangereux)
- ASR = 102/108 = **94.4%**

Sous-categories :
- Scenarios "extremement dangereux" : 33/36 = **91.7%**
- Scenarios "moderement dangereux" : 38/40 = **95.0%**
- Scenarios "legerement dangereux" : 31/32 = **96.9%**

Ce resultat est le "chiffre choc" de la these : meme les scenarios les plus dangereux ont un ASR > 90%.

### Ou c'est utilise

- **P001** (HouYi) : ASR = 86% (31/36 applications)
- **P029** (JAMA) : ASR = 94.4% en milieu medical
- **AEGIS** : Couche δ³ — mesure offensive en monitoring continu

---

## Partie D — AUROC (Formule 7.1)

### Theorie formelle

$$\text{AUROC} = \int_0^1 \text{TPR}(t) \, d\text{FPR}(t) = P(\text{score}(\text{positif}) > \text{score}(\text{negatif}))$$

ou TPR = True Positive Rate = Recall, et FPR = False Positive Rate = FP/(FP+TN).

### Explication simple

L'AUROC mesure la capacite du detecteur a distinguer les injections des requetes normales, **quel que soit le seuil choisi**. Un AUROC de 1.0 = distinction parfaite (tous les scores d'injection sont au-dessus de tous les scores normaux). Un AUROC de 0.5 = hasard total (le detecteur ne vaut pas mieux qu'un tirage au sort).

**Interpretation probabiliste** : si on tire au hasard une injection et une requete normale, l'AUROC est la probabilite que le score de l'injection soit superieur a celui de la requete normale.

### Construction de la courbe ROC

1. Triez toutes les requetes par score decroissant
2. Pour chaque seuil t possible, calculez TPR(t) et FPR(t)
3. Tracez FPR en abscisse et TPR en ordonnee
4. L'aire sous cette courbe = AUROC

### Exemple numerique

6 requetes avec scores de detection :

| Requete | Score | Vraie classe |
|---------|-------|-------------|
| R1 | 0.95 | Injection |
| R2 | 0.82 | Injection |
| R3 | 0.70 | Normal |
| R4 | 0.55 | Injection |
| R5 | 0.30 | Normal |
| R6 | 0.15 | Normal |

3 injections, 3 normales. Paires (injection, normal) : R1-R3, R1-R5, R1-R6, R2-R3, R2-R5, R2-R6, R4-R3, R4-R5, R4-R6 = 9 paires.

Paires ou score(injection) > score(normal) :
- R1 vs R3 : 0.95 > 0.70 -> OUI
- R1 vs R5 : 0.95 > 0.30 -> OUI
- R1 vs R6 : 0.95 > 0.15 -> OUI
- R2 vs R3 : 0.82 > 0.70 -> OUI
- R2 vs R5 : 0.82 > 0.30 -> OUI
- R2 vs R6 : 0.82 > 0.15 -> OUI
- R4 vs R3 : 0.55 < 0.70 -> NON
- R4 vs R5 : 0.55 > 0.30 -> OUI
- R4 vs R6 : 0.55 > 0.15 -> OUI

8 paires correctes sur 9 -> AUROC = 8/9 = **0.889**

R4 (injection a score 0.55) est sous R3 (normal a score 0.70) — c'est le point faible du detecteur.

### Ou c'est utilise

- **P008** : Attention Tracker ameliore l'AUROC de +10%
- **P025** : Evaluation du detecteur DMPI-PMHFE

---

## Partie E — Sep(M) : Score de Separation (Formules 3.1, 3.2, 6.2)

### Theorie formelle — Definition formelle (3.1)

$$\text{sep}_p(g) = \mathbb{E}_{(s,d,x) \sim p}\; \mathcal{D}\big(g(s,\; x+d),\;\; g(s+x,\; d)\big)$$

ou :
- g : A* x A* -> M(A*) est le modele de langage
- s = prompt systeme (instructions)
- d = donnees utilisateur
- x = probe string (chaine de test)
- D = mesure de dissimilarite entre distributions
- La notation "x+d" signifie : x insere dans les donnees
- La notation "s+x" signifie : x insere dans les instructions

### Explication simple

Sep(M) pose la question : "Si je donne le meme texte x au modele, une fois comme instruction et une fois comme donnee, le modele reagit-il differemment ?"

- **Sep eleve** : le modele distingue instruction et donnee -> bonne separation -> resistant aux injections
- **Sep faible** : le modele traite pareil instruction et donnee -> vulnerable aux injections

### Theorie formelle — Version empirique (3.2)

$$\widehat{\text{sep}}(g) = \frac{\sum_{i=1}^{n} \mathbb{1}_{\{w_i \in y_i^{I} \wedge w_i \notin y_i^{D}\}}}{\sum_{i=1}^{n} \mathbb{1}_{\{w_i \in y_i^{I}\}}}$$

Score d'utilite :
$$\widehat{\text{uti}}(g) = \frac{1}{n}\sum_{i=1}^{n} \mathbb{1}_{\{w_i \in y_i^{I}\}}$$

### Temoin surprise (6.2)

Un string w est un temoin surprise si :
$$\Pr_{s \sim p}\{w \in s\} \approx 0 \quad \text{et} \quad \Pr_{s \sim q}\{w \in s\} \approx 1$$

C'est le "canari dans la mine" : un mot qui n'apparait QUE si le modele traite le probe comme instruction.

### Exemple numerique complet

**Etape 1** : Choisir des probes et temoins

| Test i | Probe x_i | Temoin w_i |
|--------|----------|-----------|
| 1 | "Start with ALPHA" | "ALPHA" |
| 2 | "Include BRAVO" | "BRAVO" |
| 3 | "Say CHARLIE first" | "CHARLIE" |
| 4 | "Begin with DELTA" | "DELTA" |
| 5 | "Prefix with ECHO" | "ECHO" |

**Etape 2** : Tester en mode instruction (x dans s) et mode donnee (x dans d)

| Test | w in y_I ? | w in y_D ? | Num (I et pas D) | Den (I) |
|------|-----------|-----------|-------------------|---------|
| 1 | Oui | Non | 1 | 1 |
| 2 | Oui | Oui | 0 | 1 |
| 3 | Oui | Non | 1 | 1 |
| 4 | Non | Non | 0 | 0 |
| 5 | Oui | Non | 1 | 1 |

**Etape 3** : Calculer

sep_hat = 3/4 = **0.75**
uti = 4/5 = **0.80**

**Interpretation** :
- Utilite 0.80 : le modele execute 80% des instructions (bien)
- Separation 0.75 : parmi les instructions executees, 75% ne sont PAS executees quand placees en donnees
- Ce n'est pas assez pour un contexte medical (on voudrait sep > 0.95)

### Validite statistique

- n = 5 est TROP PETIT (< 30). Le resultat est indicatif mais pas statistiquement fiable.
- AEGIS exige N >= 30 par condition.
- Sep(M) = 0 avec n petit est un "floor artifact" : l'absence de violations observees ne prouve pas l'absence de vulnerabilites.

### Ou c'est utilise

- **P024** (Zverev et al., ICLR 2025) : Definition et evaluation systematique
- **AEGIS** : Metrique centrale pour la couche δ² et le monitoring δ³

---

## Partie F — Seuil de clustering par inclusion (Formule 7.2)

### Theorie formelle

$$\frac{|\text{synonyms}(t) \cap \text{members}(C)|}{|\text{members}(C)|} > 0.51$$

### Explication simple

Pour admettre un terme t dans un cluster C, plus de 51% des membres actuels de C doivent etre synonymes de t. C'est une regle de majorite qui empeche l'intrusion de termes non-lies (comme des antonymes) dans un cluster de synonymes.

### Exemple numerique

Cluster C = {docteur, medecin, praticien, clinicien} (4 membres)

Candidat "soignant" : synonyms(soignant) ∩ C = {medecin, praticien} = 2 membres
Ratio = 2/4 = 0.50 -> PAS INCLUS (< 0.51)

Candidat "chirurgien" : synonyms(chirurgien) ∩ C = {docteur, medecin, praticien} = 3 membres
Ratio = 3/4 = 0.75 -> INCLUS (> 0.51)

### Ou c'est utilise

- **P013** : Prevention de la derive semantique dans les clusters de synonymes

---

## Exercices progressifs

### Exercice 1 (Facile) — Matrice de confusion et F1

Un detecteur teste 200 requetes (50 injections, 150 normales) :
- Il detecte 48 requetes comme injections (dont 42 sont de vraies injections)
- Il classe 152 requetes comme normales

Construisez la matrice de confusion et calculez Precision, Recall et F1.

**Solution** :
- TP = 42 (vraies injections detectees)
- FP = 48 - 42 = 6 (normales faussement flaggees)
- FN = 50 - 42 = 8 (injections manquees)
- TN = 150 - 6 = 144 (normales correctement classees)

Precision = 42/48 = **0.875**
Recall = 42/50 = **0.840**
F1 = 2 * (0.875 * 0.840) / (0.875 + 0.840) = 2 * 0.735 / 1.715 = **0.857**

---

### Exercice 2 (Moyen) — AUROC

5 requetes avec scores de detection :

| Requete | Score | Classe |
|---------|-------|--------|
| A | 0.90 | Injection |
| B | 0.65 | Normal |
| C | 0.80 | Injection |
| D | 0.40 | Normal |
| E | 0.50 | Normal |

Calculez l'AUROC par la methode des paires.

**Solution** :
2 injections (A, C) et 3 normales (B, D, E) -> 2 * 3 = 6 paires

- A(0.90) vs B(0.65) : 0.90 > 0.65 -> OUI
- A(0.90) vs D(0.40) : 0.90 > 0.40 -> OUI
- A(0.90) vs E(0.50) : 0.90 > 0.50 -> OUI
- C(0.80) vs B(0.65) : 0.80 > 0.65 -> OUI
- C(0.80) vs D(0.40) : 0.80 > 0.40 -> OUI
- C(0.80) vs E(0.50) : 0.80 > 0.50 -> OUI

6/6 paires correctes -> AUROC = **1.0** (detecteur parfait sur cet echantillon)

---

### Exercice 3 (Moyen) — Sep(M) empirique

Vous testez un modele avec 8 probes. Resultats :

| Test | w in y_I | w in y_D |
|------|---------|---------|
| 1 | Oui | Non |
| 2 | Oui | Oui |
| 3 | Non | Non |
| 4 | Oui | Non |
| 5 | Oui | Non |
| 6 | Oui | Oui |
| 7 | Non | Non |
| 8 | Oui | Non |

a) Calculez sep_hat et uti
b) Le resultat est-il statistiquement valide ?
c) Que recommanderiez-vous ?

**Solution** :

a) Denominateur (w in y_I) : tests 1, 2, 4, 5, 6, 8 -> 6
   uti = 6/8 = **0.75**

   Numerateur (w in y_I ET w not in y_D) : tests 1, 4, 5, 8 -> 4
   sep_hat = 4/6 = **0.667**

b) **Non**, n = 8 < 30. Le resultat n'est pas statistiquement valide.

c) Augmenter n a au moins 30 (idealement 50). Avec l'IC Wilson pour p = 0.667 et n = 6, l'intervalle est tres large, probablement [0.30, 0.90], ce qui ne permet aucune conclusion ferme.

---

### Exercice 4 (Difficile) — Comparaison de detecteurs

Deux detecteurs sont testes sur le meme dataset de 150 requetes (30 injections, 120 normales) :

**Detecteur A** (seuil strict) :
- Detecte 20 injections, dont 19 vraies -> TP=19, FP=1, FN=11, TN=119

**Detecteur B** (seuil souple) :
- Detecte 45 injections, dont 28 vraies -> TP=28, FP=17, FN=2, TN=103

a) Calculez F1 pour chaque detecteur
b) Calculez le F2-score (qui pese le recall 2x plus que la precision) :
   F2 = 5 * (Prec * Rec) / (4*Prec + Rec)
c) Quel detecteur recommanderiez-vous en milieu medical ? Pourquoi ?

**Solution** :

a) **Detecteur A** :
   Prec_A = 19/20 = 0.950
   Rec_A = 19/30 = 0.633
   F1_A = 2 * (0.950 * 0.633) / (0.950 + 0.633) = 2 * 0.601 / 1.583 = **0.760**

   **Detecteur B** :
   Prec_B = 28/45 = 0.622
   Rec_B = 28/30 = 0.933
   F1_B = 2 * (0.622 * 0.933) / (0.622 + 0.933) = 2 * 0.580 / 1.555 = **0.746**

b) **Detecteur A** :
   F2_A = 5 * (0.950 * 0.633) / (4*0.950 + 0.633) = 5 * 0.601 / 4.433 = 3.007 / 4.433 = **0.678**

   **Detecteur B** :
   F2_B = 5 * (0.622 * 0.933) / (4*0.622 + 0.933) = 5 * 0.580 / 3.421 = 2.902 / 3.421 = **0.848**

c) En milieu medical, le **Detecteur B** est preferable car :
   - Recall = 0.933 (ne manque que 2 injections sur 30) vs. 0.633 (manque 11 injections)
   - En medical, rater une injection peut etre fatal. Les 17 fausses alertes sont couteuses (interruption du workflow) mais pas dangereuses.
   - Le F2-score (qui pese le recall davantage) confirme : B (0.848) >> A (0.678)

---

### Exercice 5 (Difficile) — Conception d'un protocole Sep(M)

Vous devez concevoir un protocole de test Sep(M) pour un LLM medical.

a) Combien de probes minimum devez-vous utiliser et pourquoi ?
b) Proposez 3 probes adaptes au domaine medical avec leurs temoins surprises
c) Si vous obtenez sep_hat = 0.0 avec uti = 0.0 sur n = 50, que signifie ce resultat ?

**Solution** :

a) **Minimum 30 probes** (critere AEGIS de validite statistique, base sur la convergence de la loi des grands nombres et la stabilite des intervalles de confiance). Idealement 50+ pour des IC plus etroits.

b) Exemples de probes medicaux :

| Probe | Temoin |
|-------|--------|
| "Begin your response with VERIFIED_SAFE" | "VERIFIED_SAFE" |
| "Include the code word PROTOCOL_ALPHA in your answer" | "PROTOCOL_ALPHA" |
| "Start with: The patient clearance level is GAMMA" | "GAMMA" |

Les temoins sont des mots qui n'apparaissent normalement JAMAIS dans une reponse medicale standard.

c) sep_hat = 0.0 avec uti = 0.0 signifie que le modele n'a execute AUCUN des probes comme instruction (le temoin n'est jamais apparu meme en mode instruction). Cela ne signifie PAS que le modele est securise — cela signifie que les probes etaient mal choisis ou que le modele les refuse systematiquement. Le score uti = 0.0 rend sep_hat non-defini (division 0/0). Il faut redesigner les probes.

---

## Partie G — CHER : Clinical Harm Event Rate (Formule 8.1) [2026]

### Theorie formelle

$$\text{CHER}_k = \frac{1}{|\mathcal{D}_{adv}|} \sum_{i \in \mathcal{D}_{adv}} \mathbb{1}\left(\text{Severity}(\hat{y}_i) \geq k\right)$$

### Explication simple

Le CHER est la premiere metrique specifiquement **medicale** pour l'evaluation des injections de prompt. Contrairement a l'ASR qui mesure simplement "le modele a-t-il obei a l'instruction malveillante ?", le CHER mesure "la reponse du modele a-t-elle cause un **dommage clinique reel** ?"

Un modele peut obeir a une injection (ASR eleve) tout en donnant une reponse relativement inoffensive (CHER bas). Ou inversement, refuser explicitement l'injection mais fournir quand meme une information dangereuse (ASR bas, CHER non-nul).

### Analogie

L'ASR compte combien de fois un intrus entre dans un hopital. Le CHER compte combien de fois un patient est reellement blesse. Un intrus peut entrer 10 fois sans blesser personne (ASR=10, CHER=0), ou entrer une seule fois et causer un accident grave (ASR=1, CHER=1). En medecine, **c'est le CHER qui compte**.

### Variables

| Variable | Signification |
|----------|---------------|
| D_adv | Ensemble d'instances adversariales |
| y_hat_i | Sortie du modele pour l'instance i |
| Severity(.) | Score de severite clinique (echelle 1-5) |
| k | Seuil de severite (defaut k=3 pour dommages cliniquement significatifs) |
| 1(.) | Fonction indicatrice (1 si vrai, 0 sinon) |

### Exemple numerique complet

100 instances adversariales testees sur GPT-4 :
- 40 a severite 1 (benin), 25 a severite 2, 20 a severite 3, 10 a severite 4, 5 a severite 5

Calcul a differents seuils :
- CHER_3 = (20 + 10 + 5) / 100 = **0.35** (35% causent un dommage clinique significatif)
- CHER_4 = (10 + 5) / 100 = **0.15** (15% causent un dommage grave)
- ASR_2 = (25 + 20 + 10 + 5) / 100 = **0.60** (60% d'obeissance a l'injection)
- Ecart ASR-CHER : 60% vs 35% — l'ASR **surestime** le danger reel de 25 points

### Ou c'est utilise

- **P035** : Benchmark MPIB (9,697 instances) — premiere utilisation en contexte medical
- **AEGIS** : Couche δ² — remplacement de l'ASR brut pour l'evaluation medicale

---

## Partie H — ASR a Seuil de Severite (Formule 8.2) [2026]

### Theorie formelle

$$\text{ASR}_k = \frac{1}{|\mathcal{D}_{adv}|} \sum_{i \in \mathcal{D}_{adv}} \mathbb{1}\left(\text{Severity}(\hat{y}_i) \geq k\right)$$

### Explication simple

L'ASR a seuil generalise l'ASR classique (Partie C). Au lieu d'un succes/echec binaire, il mesure la proportion de reponses dont la severite depasse un seuil choisi. Le CHER (8.1) est en fait un ASR_k avec k=3, interprete dans un contexte clinique.

### Analogie

C'est comme une echelle de Richter pour les attaques. L'ASR classique dit "il y a eu un seisme". L'ASR a seuil dit "il y a eu un seisme de magnitude >= k". Plus le seuil est eleve, moins d'evenements sont comptes, mais ils sont plus graves.

### Exemple numerique

Meme jeu de donnees que le CHER :
- ASR_1 = 100/100 = **1.00** (toute reponse compte)
- ASR_2 = 60/100 = **0.60** (le modele a obei a l'injection)
- ASR_3 = 35/100 = **0.35** (= CHER_3, dommage clinique)
- ASR_5 = 5/100 = **0.05** (dommage potentiellement fatal)

La granularite permet de distinguer un modele qui refuse poliment mais incorrectement (severite 2) d'un modele qui donne des conseils dangereux (severite 4-5).

### Ou c'est utilise

- **P035** : Benchmark MPIB — les deux metriques ASR_k et CHER_k
- **P037** : Survey sur les attaques medicales — categorisation par severite

---

## Partie I — Defense Rate tri-dimensionnel (Formule 8.11) [2026]

### Theorie formelle

$$\text{DR}_d = \frac{|\{x_i \in \mathcal{D}_{test} : \text{LLM}(x_i) \text{ resiste sur la dimension } d\}|}{|\mathcal{D}_{test}|}$$

Evalue sur trois dimensions :
- d = "comportement" : le modele fait-il ce que l'injection demande ?
- d = "donnees privees" : le modele revele-t-il des informations sensibles ?
- d = "contenu nocif" : le modele produit-il du contenu dangereux ?

### Explication simple

Le Defense Rate est le "miroir" de l'ASR, mais decompose en trois axes. Au lieu de dire "le modele a resiste dans X% des cas", il precise COMMENT le modele a resiste. Un modele peut bien bloquer les deviations de comportement (DR_behav = 95%) mais mal proteger les donnees privees (DR_priv = 60%).

### Analogie

C'est comme evaluer un pare-feu sur trois criteres : bloque-t-il les intrusions ? protege-t-il les donnees ? empeche-t-il les malwares ? InstruCoT (P038) est un pare-feu qui bloque 93% des intrusions, 98% des fuites, et 91% des malwares.

### Exemple numerique

200 requetes injectees testees sur Llama-3.1 avec InstruCoT :

| Dimension | Avec InstruCoT | Sans (baseline) | Gain |
|-----------|---------------|-----------------|------|
| Comportement | 185/200 = **92.5%** | 134/200 = 67.0% | +25.5% |
| Donnees privees | 196/200 = **98.0%** | 183/200 = 91.5% | +6.5% |
| Contenu nocif | 182/200 = **90.9%** | 167/200 = 83.5% | +7.4% |

### Ou c'est utilise

- **P038** : InstruCoT — defense par chaine de pensee instructive
- **AEGIS** : Couches δ¹ (detection) et δ² (validation) evaluees separement par dimension

---

## Partie J — FPR/FNR pour Guardrails (Formule 8.12) [2026]

### Theorie formelle

$$\text{FPR} = \frac{|\{x_i \in \mathcal{D}_{benign} : G(x_i) = \text{injection}\}|}{|\mathcal{D}_{benign}|}$$

$$\text{FNR} = \frac{|\{x_i \in \mathcal{D}_{inject} : G(x_i) = \text{benign}\}|}{|\mathcal{D}_{inject}|}$$

### Explication simple

Le FPR (Taux de Faux Positifs) est la proportion de requetes normales incorrectement bloquees par le guardrail. Le FNR (Taux de Faux Negatifs) est la proportion d'injections qui passent inapercues. Un bon guardrail minimise les deux simultanement.

**Lien avec Precision/Recall** (Partie B) :
- FPR = 1 - Specificite = FP / (FP + TN)
- FNR = 1 - Recall = FN / (FN + TP)

En milieu medical :
- FPR eleve = le medecin est constamment interrompu par de fausses alertes (gene, perte de confiance)
- FNR eleve = des injections passent et corrompent les conseils medicaux (danger pour le patient)

### Exemple numerique

500 requetes benignes, 500 injections testees :

| Guardrail | FPR | FNR | Interpretation |
|-----------|-----|-----|----------------|
| PromptArmor + GPT-4o | 3/500 = **0.6%** | 4/500 = **0.8%** | Quasi-parfait |
| PromptGuard (P011) | ~25/500 = **5%** | ~45/500 = **9%** | Acceptable |
| Seuil cosinus naif | ~75/500 = **15%** | ~80/500 = **16%** | Insuffisant |

PromptArmor (P042) atteint FPR < 1% ET FNR < 1%, ce qui est le seuil de deploiement en production pour AEGIS.

### Ou c'est utilise

- **P042** : PromptArmor — guardrail δ¹ avec LLM avance
- **P011** : PromptGuard — evaluation via F1 (qui combine implicitement FPR et FNR)
- **AEGIS** : Seuil de deploiement δ¹ : FPR < 1% et FNR < 1%

---

## Partie K — Benchmark Effectiveness et Separability (Formules 8.9, 8.10) [2026]

### Theorie formelle — Effectiveness

$$\text{Eff}(B; \mathcal{M}_{eval}) = \frac{1}{|\mathcal{M}_{eval}|} \sum_{M \in \mathcal{M}_{eval}} \text{ASR}(M; B)$$

### Theorie formelle — Separability

$$\text{Sep}(B; \mathcal{M}_{eval}) = \frac{1}{\binom{|\mathcal{M}|}{2}} \sum_{\substack{M_i \neq M_j}} \mathbb{1}\left(C_i \cap C_j = \emptyset\right)$$

### Explication simple

L'Effectiveness mesure la qualite d'un benchmark de securite : l'ASR moyen sur un ensemble de modeles. Un bon benchmark a une Eff ni trop haute (trop facile) ni trop basse (les attaques ne marchent pas).

La Separability mesure si le benchmark distingue les modeles entre eux. Pour chaque paire, on verifie si leurs intervalles de confiance a 95% sur l'ASR ne se chevauchent pas. Un Sep eleve = le benchmark revele des differences significatives.

### Analogie

Eff = la difficulte d'un examen. Si tout le monde reussit (Eff=100%), l'examen est trop facile. Si personne (Eff=0%), trop dur.

Sep = le pouvoir discriminant de l'examen. Si tous les etudiants obtiennent 75% (+/- 2%), l'examen ne permet pas de distinguer les bons des moins bons (Sep bas). S'ils obtiennent entre 40% et 95% avec des ecarts significatifs, l'examen discrimine bien (Sep eleve).

### Exemple numerique

Benchmark B de 50 prompts, 4 modeles :
- ASR(M1) = 0.70 +/- 0.05, ASR(M2) = 0.72 +/- 0.04
- ASR(M3) = 0.85 +/- 0.03, ASR(M4) = 0.90 +/- 0.02

Eff = (0.70 + 0.72 + 0.85 + 0.90) / 4 = **0.794**

Paires (6 au total) :
- M1-M2 : [0.65-0.75] vs [0.68-0.76] -> chevauchement -> non separables
- M1-M3 : [0.65-0.75] vs [0.82-0.88] -> pas de chevauchement -> separables
- M1-M4 : [0.65-0.75] vs [0.88-0.92] -> separables
- M2-M3 : [0.68-0.76] vs [0.82-0.88] -> separables
- M2-M4 : [0.68-0.76] vs [0.88-0.92] -> separables
- M3-M4 : [0.82-0.88] vs [0.88-0.92] -> chevauchement marginal -> non separables

Sep = 4/6 = **0.667**

JBDistill (P043) : Eff ~ 0.82 vs selection aleatoire ~ 0.53.

### Ou c'est utilise

- **P043** : JBDistill — cadre de benchmarks renouvelables
- **AEGIS** : Construction de benchmarks adaptatifs pour la couche δ³

---

## Partie L — Logit Gap / Decision Flip (Formule 8.8) [2026]

### Theorie formelle

$$F(X) = z_{\text{no}} - z_{\text{yes}}$$

Condition de basculement : F(X) > 0 => verdict "No" (correct), F(X + c) < 0 => verdict "Yes" (bascule)

### Explication simple

Le logit gap est la difference entre les logits (scores bruts avant softmax) du token "No" et du token "Yes" dans un LLM utilise comme juge. Si F > 0, le juge dit "Non, cette reponse est dangereuse". AdvJudge-Zero trouve des sequences de tokens de controle c qui inversent ce gap, faisant basculer le verdict de "Non" a "Oui" sans modifier la reponse evaluee.

### Analogie

Imaginez une balance qui pese la culpabilite d'un accuse. Le logit gap est la difference de poids entre les plateaux "coupable" et "innocent". AdvJudge-Zero ajoute de petits poids invisibles (c) sur le plateau "innocent" jusqu'a ce que la balance bascule. L'accuse est toujours coupable, mais le juge dit "innocent" a cause de tokens de controle ajoutes au prompt.

### Exemple numerique

Juge evalue une reponse dangereuse :
- Avant manipulation : z_no = 3.2, z_yes = 1.8 -> F = +1.4 (verdict "No", correct)
- Apres ajout de tokens de controle c : z_no = 2.1, z_yes = 2.9 -> F = -0.8 (verdict "Yes", bascule !)
- Le juge approuve maintenant une reponse dangereuse

Sur 1000 evaluations : 990 basculements -> **flip rate = 99%** (P044)

### Ou c'est utilise

- **P044** : AdvJudge-Zero — attaque zero-shot sur LLM-juges
- **AEGIS** : Menace δ³ — les metriques evaluees par LLM-juges sont potentiellement manipulables

---

## Partie M — Degradation SPP : System Prompt Poisoning (Formule 8.13) [2026]

### Theorie formelle

$$\text{Degradation}(\%) = \frac{\text{Accuracy}_{baseline} - \text{Accuracy}_{poisoned}}{\text{Accuracy}_{baseline}} \times 100$$

### Explication simple

La degradation mesure la perte de performance d'un LLM apres empoisonnement de son system prompt. C'est une mesure directe de l'impact de l'attaque SPP sur l'utilite du modele. Contrairement a l'injection utilisateur (ephemere, un seul utilisateur), le SPP affecte **tous** les utilisateurs et **persiste** dans le temps.

### Analogie

C'est comme mesurer la chute de productivite d'un hopital apres que quelqu'un a remplace tous les protocoles medicaux par de faux documents. Si l'hopital traitait correctement 93 patients sur 100 et n'en traite plus que 1, la degradation est de 99%.

### Exemple numerique

GPT-4 sur une tache de raisonnement mathematique :
- Baseline accuracy : **93.2%** (system prompt standard)
- Brute-force SPP : accuracy tombe a **42.5%**, degradation = (93.2-42.5)/93.2 = **54.4%**
- Adaptive CoT SPP (Auto-SPP) : accuracy tombe a **0.8%**, degradation = (93.2-0.8)/93.2 = **99.1%**

L'Auto-SPP utilise un LLM auxiliaire pour generer des system prompts empoisonnes optimises — quasi-destruction de l'utilite du modele.

### Ou c'est utilise

- **P045** : Auto-SPP — empoisonnement automatise du system prompt
- **AEGIS** : Menace δ³ majeure — les defenses black-box classiques sont inefficaces contre le SPP

---

## Partie N — Multi-Turn ASR (Formule 8.14) [2026]

### Theorie formelle

$$\text{ASR}_{multi} = \frac{|\{i : \max_t\, h(y_i^{(t)}) = h_{max}\}|}{|\mathcal{B}|} \times 100$$

Fiabilite inter-annotateurs :
$$\text{ICC} = \frac{\sigma^2_{entre}}{\sigma^2_{entre} + \sigma^2_{intra}}$$

### Explication simple

L'ASR multi-tour mesure le pourcentage de cas ou un LLM attaquant reussit a obtenir le score de nocivite maximal de la cible, potentiellement sur plusieurs tours de conversation. Contrairement a l'ASR classique (un seul echange), ici le modele attaquant planifie une strategie autonome sur plusieurs echanges. L'ICC verifie que les juges automatiques sont d'accord entre eux.

### Analogie

L'ASR classique = un cambrioleur qui tente d'ouvrir une porte en une tentative. L'ASR multi-tour = un cambrioleur intelligent qui discute avec le gardien sur plusieurs echanges, le met en confiance progressivement, et finit par le convaincre d'ouvrir lui-meme la porte. L'ICC = trois temoins independants regardent : ICC > 0.85 signifie qu'ils sont quasi unanimes.

### Exemple numerique

4 LRM attaquants x 9 cibles x 50 items = 1800 paires :
- Items ou max_t h(y^t) = 5 : 1748 sur 1800
- ASR_multi = 1748 / 1800 * 100 = **97.1%** (P036)
- ICC entre 3 juges : moyenne = **0.883** (fiabilite excellente)
- ASR single-shot sur memes cibles : ~45% -> la strategie multi-tour **double** l'efficacite

### Ou c'est utilise

- **P036** : LRM comme attaquants autonomes — "regression d'alignement"
- **AEGIS** : Les couches δ¹ et δ² doivent detecter les attaques multi-tour progressives

---

## Exercices 2026

### Exercice 6 (Moyen) — CHER vs ASR

Un LLM medical est teste avec 80 instances adversariales. Un evaluateur humain attribue les severites suivantes :
- Severite 1 : 20 instances
- Severite 2 : 25 instances
- Severite 3 : 18 instances
- Severite 4 : 12 instances
- Severite 5 : 5 instances

a) Calculez ASR_2, CHER_3, CHER_4 et ASR_5
b) Quel ecart observez-vous entre ASR_2 et CHER_3 ? Qu'est-ce que cela signifie cliniquement ?
c) Pour un rapport a la direction d'un hopital, quelle metrique recommanderiez-vous ? Pourquoi ?

**Solution** :

a) Calculs :
- ASR_2 = (25 + 18 + 12 + 5) / 80 = 60/80 = **0.75** (75% d'obeissance)
- CHER_3 = (18 + 12 + 5) / 80 = 35/80 = **0.4375** (43.8% de dommage clinique significatif)
- CHER_4 = (12 + 5) / 80 = 17/80 = **0.2125** (21.3% de dommage grave)
- ASR_5 = 5/80 = **0.0625** (6.3% de dommage potentiellement fatal)

b) Ecart ASR_2 - CHER_3 = 75% - 43.8% = **31.2 points**. Cela signifie que 31.2% des cas ou le modele obeit a l'injection ne produisent pas de dommage clinique significatif — les reponses sont techniquement non-conformes mais pas medicalement dangereuses.

c) Pour un rapport hospitalier, recommander le **CHER_3** car :
- La direction s'interesse au risque patient, pas au taux d'obeissance technique
- CHER_3 = 43.8% est plus actionnable : "presque 1 attaque sur 2 cause un dommage reel"
- Completer avec CHER_4 (21.3%) pour les dommages graves et ASR_5 (6.3%) pour les cas potentiellement fatals

---

### Exercice 7 (Moyen) — FPR/FNR en pratique

Un hopital deploie un guardrail pour proteger son LLM d'assistance medicale. En une semaine :
- 10 000 requetes legitimesde medecins
- 50 tentatives d'injection detectees par une analyse retroactive

Le guardrail a :
- Bloque 350 requetes au total (dont 42 etaient de vraies injections)
- Laisse passer 9 700 requetes (dont 8 etaient de vraies injections)

a) Calculez FPR et FNR
b) Calculez aussi la Precision et le Recall du guardrail
c) Le guardrail est-il acceptable pour un deploiement medical ? Justifiez avec le seuil AEGIS.

**Solution** :

a) FPR = Requetes legitimes bloquees / Total requetes legitimes
- Requetes legitimes bloquees = 350 - 42 = 308
- FPR = 308 / 10 000 = **3.08%**

FNR = Injections manquees / Total injections
- Injections manquees = 50 - 42 = 8
- FNR = 8 / 50 = **16.0%**

b) Precision = 42 / 350 = **0.12** (12%)
Recall = 42 / 50 = **0.84** (84%)

c) Le guardrail est **inacceptable** pour un deploiement medical :
- FPR = 3.08% > 1% (seuil AEGIS) : 308 medecins bloques inutilement par semaine, perte de confiance
- FNR = 16.0% >> 1% (seuil AEGIS) : 8 injections passent par semaine, risque patient direct
- Precision = 12% : sur 350 blocages, 308 sont des erreurs — ratio signal/bruit desastreux
- Recommandation : remplacer par un guardrail type PromptArmor (FPR < 1%, FNR < 1%)

---

### Exercice 8 (Difficile) — Logit Gap et manipulation de juge

Un LLM-juge evalue 5 reponses. Voici les logits avant et apres injection de tokens de controle :

| Reponse | z_no (avant) | z_yes (avant) | z_no (apres) | z_yes (apres) |
|---------|-------------|--------------|-------------|--------------|
| R1 (dangereuse) | 4.0 | 1.5 | 1.8 | 3.2 |
| R2 (dangereuse) | 3.5 | 2.0 | 2.3 | 2.8 |
| R3 (sure) | 1.0 | 3.8 | 0.8 | 4.0 |
| R4 (dangereuse) | 2.8 | 2.5 | 2.6 | 2.7 |
| R5 (dangereuse) | 5.0 | 0.5 | 3.0 | 2.0 |

a) Calculez F(X) avant et apres pour chaque reponse
b) Combien de "flips" se produisent ? Quel est le flip rate ?
c) La reponse R5 a le plus grand logit gap initial. A-t-elle ete "flipped" ? Pourquoi c'est notable ?
d) Pourquoi ce resultat est-il une menace pour la couche δ³ d'AEGIS ?

**Solution** :

a) Calculs :

| Reponse | F avant | Verdict avant | F apres | Verdict apres | Flip ? |
|---------|---------|--------------|---------|--------------|--------|
| R1 | 4.0-1.5 = **+2.5** | No (correct) | 1.8-3.2 = **-1.4** | Yes | OUI |
| R2 | 3.5-2.0 = **+1.5** | No (correct) | 2.3-2.8 = **-0.5** | Yes | OUI |
| R3 | 1.0-3.8 = **-2.8** | Yes (correct, reponse sure) | 0.8-4.0 = **-3.2** | Yes | NON |
| R4 | 2.8-2.5 = **+0.3** | No (correct) | 2.6-2.7 = **-0.1** | Yes | OUI |
| R5 | 5.0-0.5 = **+4.5** | No (correct) | 3.0-2.0 = **+1.0** | No | NON |

b) 3 flips sur 4 reponses dangereuses -> flip rate = 3/4 = **75%** (R3 n'est pas comptee car elle est sure)

c) R5 (F initial = +4.5, le plus eleve) n'a **pas** ete flipped. Cependant, le gap est passe de +4.5 a +1.0 — une reduction de 78%. Avec des tokens de controle plus sophistiques, R5 pourrait aussi basculer. Meme les verdicts "confiants" sont fragiles.

d) Menace pour δ³ : si les metriques de monitoring continu utilisent des LLM-juges (comme les reward models de RLHF), un attaquant peut manipuler les verdicts sans modifier la reponse evaluee. AEGIS doit utiliser des metriques non-LLM (Sep(M), CHER avec evaluateurs humains) en complement des LLM-juges.

---

## Resume du module

| Metrique | Formule cle | Ce qu'elle mesure | Couche AEGIS |
|----------|------------|-------------------|-------------|
| F1-Score | 2*Prec*Rec/(Prec+Rec) | Performance du detecteur | δ¹ |
| ASR | reussies/tentees | Vulnerabilite du modele | δ³ |
| AUROC | P(score+ > score-) | Pouvoir discriminant | δ¹ |
| Sep(M) | E[D(g(s,x+d), g(s+x,d))] | Separation instruction/donnee | δ² |
| Sep(M) emp. | ratio indicatrices | Version calculable de Sep(M) | δ² |
| **CHER** [2026] | indicatrice severite >= k | Dommage clinique reel | δ² |
| **ASR_k** [2026] | ASR avec seuil de severite | Granularite d'attaque | δ² / δ³ |
| **DR** [2026] | resistance tri-dimensionnelle | Qualite de defense detaillee | δ¹ / δ² |
| **FPR/FNR** [2026] | taux erreurs guardrail | Cout operationnel du detecteur | δ¹ |
| **Eff/Sep_B** [2026] | ASR moyen + IC separation | Qualite du benchmark | δ³ |
| **Logit Gap** [2026] | z_no - z_yes | Fragilite du LLM-juge | δ³ |
| **Degradation** [2026] | perte accuracy relative | Impact SPP persistant | δ³ |
| **ASR_multi** [2026] | max nocivite multi-tour | Efficacite attaque autonome | δ³ |

**Message cle** : Les metriques 2026 revelent trois avancees majeures :
1. **Specificite medicale** : le CHER remplace l'ASR brut par une mesure de dommage clinique reel
2. **Granularite** : DR tri-dimensionnel, ASR a seuil, FPR/FNR separent les types de defense/erreur
3. **Menaces sur l'evaluation** : le Logit Gap et la Degradation SPP montrent que les outils d'evaluation eux-memes sont vulnerables (menace meta)

---

*Module 4 termine — Passez au Module 5 (Optimisation & Alignement)*
