# Module 4 — Scores et Metriques de Detection

**Temps estime** : 6-8 heures
**Prerequis** : Module 1 (similarite cosinus), Module 2 (probabilites, indicatrices, IC)
**Formules couvertes** : 1.2 F1-Score, 3.1 Sep(M) Formel, 3.2 Sep(M) Empirique, 3.4 ASR, 6.2 Surprise Witness, 7.1 AUROC, 7.2 Seuil Clustering

---

## Motivation : Pourquoi les metriques ?

Comment savoir si un detecteur d'injection est "bon" ? Comment mesurer si un modele separe correctement les instructions des donnees ? Les metriques sont les **instruments de mesure** de la securite. Sans elles, on ne peut ni comparer des approches ni valider scientifiquement une these.

**Articles concernes** : P008 (AUROC), P011 (F1), P024 (Sep(M)), P025 (accuracy), P029 (ASR)

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

## Resume du module

| Metrique | Formule cle | Ce qu'elle mesure | Couche AEGIS |
|----------|------------|-------------------|-------------|
| F1-Score | 2*Prec*Rec/(Prec+Rec) | Performance du detecteur | δ¹ |
| ASR | reussies/tentees | Vulnerabilite du modele | δ³ |
| AUROC | P(score+ > score-) | Pouvoir discriminant | δ¹ |
| Sep(M) | E[D(g(s,x+d), g(s+x,d))] | Separation instruction/donnee | δ² |
| Sep(M) emp. | ratio indicatrices | Version calculable de Sep(M) | δ² |

**Message cle** : Les metriques ne sont pas interchangeables. Le choix depend du contexte : F1 et AUROC pour les detecteurs (δ¹), Sep(M) pour la separation fondamentale (δ²), ASR pour l'evaluation offensive (δ³). En milieu medical, privilegier le recall et le F2-score.

---

*Module 4 termine — Passez au Module 5 (Optimisation & Alignement)*
