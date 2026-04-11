# Module 7 — Mecanisme d'Attention et Transformers (Optionnel)

**Temps estime** : 5-6 heures
**Prerequis** : Module 1 (produit scalaire), Module 2 (moyenne, ecart-type)
**Formules couvertes** : 3.3 Focus Score (Attention Tracker)

---

## Motivation : Pourquoi l'attention ?

Le mecanisme d'attention est le coeur des transformers (GPT, BERT, LLaMA, etc.). Il determine COMMENT le modele decide quels mots sont importants pour generer chaque token. L'Attention Tracker (P008) exploite ce mecanisme pour detecter les injections SANS entrainement supplementaire : si l'attention se detourne du prompt original vers l'injection, c'est suspect.

Ce module est marque "optionnel" car le Focus Score est la seule formule directement liee, mais comprendre l'attention eclaire toute l'architecture des LLM.

**Articles concernes** : P008 (Attention Tracker), reference indirecte dans tous les articles sur les LLM

---

## Prerequis : Ce qu'il faut savoir avant

- Produit scalaire et similarite cosinus (Module 1)
- Softmax (Module 3, Partie F)
- Moyenne et ecart-type (Module 2)

---

## Partie A — L'attention en une phrase

### L'intuition

Quand vous lisez la phrase "Le **patient** diabetique doit eviter le **sucre**", votre cerveau connecte "patient" et "sucre" malgre les mots entre les deux. Le mecanisme d'attention fait la meme chose : il cree des connexions directes entre les mots pertinents, quelle que soit leur distance dans la phrase.

---

## Partie B — Attention Scaled Dot-Product

### Theorie formelle

Pour une sequence de tokens, chaque token produit trois vecteurs :
- **Q** (Query) : "Que cherche ce token ?"
- **K** (Key) : "Qu'offre ce token comme information ?"
- **V** (Value) : "Quelle information ce token fournit-il ?"

Score d'attention :
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right) V$$

ou d_k est la dimension des cles (typiquement 64).

Les poids d'attention (avant multiplication par V) :
$$\alpha_{ij} = \text{softmax}_j\left(\frac{\mathbf{q}_i \cdot \mathbf{k}_j}{\sqrt{d_k}}\right)$$

alpha_ij = "combien le token i fait attention au token j"

### Explication simple

1. Chaque token "pose une question" (Q) et "offre une reponse" (K)
2. Le produit scalaire Q.K mesure la pertinence de chaque paire
3. Le softmax normalise ces scores en probabilites (somme = 1 par ligne)
4. La division par sqrt(d_k) evite que les scores soient trop grands (stabilite numerique)
5. Ces poids d'attention determinent le "melange" d'informations (V) que chaque token recoit

### Exemple numerique (simplifie, d_k = 2)

Phrase : "Le patient prend 500mg"

Supposons que le token "prend" a la query q = [1.0, 0.5]
Les keys des autres tokens :
- k_"Le" = [0.1, 0.2]
- k_"patient" = [0.8, 0.6]
- k_"500mg" = [0.9, 0.4]

Scores bruts (avant softmax) :
- q . k_"Le" = 1.0*0.1 + 0.5*0.2 = 0.20
- q . k_"patient" = 1.0*0.8 + 0.5*0.6 = 1.10
- q . k_"500mg" = 1.0*0.9 + 0.5*0.4 = 1.10

Division par sqrt(2) = 1.414 :
- scores = [0.20/1.414, 1.10/1.414, 1.10/1.414] = [0.141, 0.778, 0.778]

Softmax :
- exp([0.141, 0.778, 0.778]) = [1.152, 2.177, 2.177]
- somme = 5.506
- alpha = [0.209, 0.396, 0.396]

"Prend" fait surtout attention a "patient" (0.396) et "500mg" (0.396), moins a "Le" (0.209). C'est logique : le verbe "prend" est semantiquement lie au sujet et au complement.

---

## Partie C — Multi-Head Attention

### Theorie formelle

Au lieu d'un seul ensemble (Q, K, V), le transformer utilise h "tetes" d'attention en parallele :

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h) \cdot W^O$$

ou chaque tete :
$$\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$

W_i^Q, W_i^K, W_i^V sont des matrices de projection specifiques a chaque tete.

### Explication simple

Chaque tete d'attention "regarde" un aspect different du texte :
- Tete 1 pourrait se specialiser dans les relations sujet-verbe
- Tete 2 dans les relations syntaxiques (adjectif-nom)
- Tete 3 dans les references longue distance
- Tete 4 dans la ponctuation et la structure

Les resultats de toutes les tetes sont concatenes et combines pour une representation riche.

### Dimensions typiques

Un modele comme LLaMA-7B :
- 32 couches (layers)
- 32 tetes par couche
- d_model = 4096, d_k = d_model / h = 128
- Total : 32 * 32 = **1024 paires (couche, tete)**

---

## Partie D — Focus Score (Formule 3.3)

### Theorie formelle

**Score d'attention agrege pour un ensemble de tokens I** :
$$\text{Attn}^{(l,h)}(I) = \sum_{i \in I} \alpha_i^{(l,h)}$$

ou I est l'ensemble des tokens du prompt original (avant injection), l est la couche et h la tete.

**Score candidat pour selectionner les tetes importantes** :
$$\text{score\_cand}^{(l,h)}(D_N, D_A) = \mu_{S_N}^{(l,h)} - k \cdot \sigma_{S_N}^{(l,h)} - (\mu_{S_A}^{(l,h)} + k \cdot \sigma_{S_A}^{(l,h)})$$

ou :
- D_N = dataset normal (sans injection)
- D_A = dataset d'attaque (avec injection)
- mu et sigma = moyenne et ecart-type de Attn^(l,h)(I)
- k = parametre de marge (typiquement k = 1)

**Ensemble des tetes importantes** :
$$H_i = \{(l,h) \mid \text{score\_cand}^{(l,h)} > 0\}$$

**Focus Score** :
$$FS = \frac{1}{|H_i|} \sum_{(l,h) \in H_i} \text{Attn}^{(l,h)}(I)$$

**Decision** : si FS < seuil t -> attaque detectee.

### Explication simple par etapes

**Etape 1** : On identifie les tetes d'attention qui sont "revelateurs" d'injection. Pour chaque tete (l,h), on mesure combien d'attention elle donne au prompt original :
- Sur des requetes normales : attention elevee (le modele regarde le prompt)
- Sur des requetes avec injection : attention plus faible (le modele est "distrait" par l'injection)

**Etape 2** : Le score candidat selectionne les tetes ou la difference est significative. Le critere "mu_N - k*sigma_N > mu_A + k*sigma_A" signifie : meme dans le PIRE cas normal (mu - k*sigma), l'attention est ENCORE superieure au MEILLEUR cas d'attaque (mu + k*sigma).

**Etape 3** : Pour une nouvelle requete, on calcule le Focus Score = moyenne de l'attention au prompt original sur les tetes importantes. Si cette moyenne est basse, le modele est "distrait" -> injection probable.

### Exemple numerique complet

**Modele** : 12 couches, 12 tetes = 144 paires (l,h)

**Etape 1** : Calibration sur 100 requetes normales et 100 requetes d'attaque

Pour la tete (3,7) :
- Sur requetes normales : mu_N = 0.82, sigma_N = 0.05
- Sur requetes d'attaque : mu_A = 0.31, sigma_A = 0.08

score_cand^(3,7) = 0.82 - 1*0.05 - (0.31 + 1*0.08)
                 = 0.77 - 0.39
                 = **0.38** > 0 -> tete importante

Pour la tete (1,1) :
- mu_N = 0.45, sigma_N = 0.15
- mu_A = 0.40, sigma_A = 0.12

score_cand^(1,1) = 0.45 - 1*0.15 - (0.40 + 1*0.12)
                 = 0.30 - 0.52
                 = **-0.22** < 0 -> tete NON importante (pas assez discriminante)

**Etape 2** : Apres filtrage, 3 tetes sont selectionnees : H_i = {(3,7), (5,2), (8,11)}

**Etape 3** : Nouvelle requete a tester

| Tete (l,h) | Attn(I) | Interpretation |
|------------|---------|----------------|
| (3,7) | 0.78 | Elevee, normal |
| (5,2) | 0.72 | Elevee, normal |
| (8,11) | 0.85 | Elevee, normal |

FS = (0.78 + 0.72 + 0.85) / 3 = **0.783** > seuil 0.5 -> **NORMAL**

Avec injection dans la requete :

| Tete (l,h) | Attn(I) | Interpretation |
|------------|---------|----------------|
| (3,7) | 0.31 | Faible, attention detournee |
| (5,2) | 0.25 | Faible, attention detournee |
| (8,11) | 0.38 | Faible, attention detournee |

FS = (0.31 + 0.25 + 0.38) / 3 = **0.313** < seuil 0.5 -> **INJECTION DETECTEE**

### Avantages de cette approche

1. **Training-free** : pas besoin d'entrainer un classificateur supplementaire
2. **Interpretable** : on peut montrer QUELLES tetes d'attention sont perturbees
3. **Amelioration** : +10% AUROC vs methodes existantes (P008)
4. **Generalisation** : applicable a tout modele transformer

### Ou c'est utilise

- **P008** : Publication originale (Attention Tracker)
- **AEGIS** : Candidat pour la couche δ¹ (detection pre-inference)

---

## Exercices progressifs

### Exercice 1 (Facile) — Poids d'attention

Les poids d'attention pour le token "dose" envers 4 tokens :
- alpha_"le" = 0.05
- alpha_"patient" = 0.25
- alpha_"doit" = 0.10
- alpha_"prendre" = 0.60

a) Verifiez que la somme = 1
b) A quel token "dose" fait-il le plus attention ? Pourquoi ?

**Solution** :
a) 0.05 + 0.25 + 0.10 + 0.60 = **1.00** (verifie)
b) "Dose" fait le plus attention a "prendre" (0.60). Semantiquement, c'est logique : le verbe "prendre" est directement lie a "dose" (prendre une dose).

---

### Exercice 2 (Moyen) — Selection des tetes importantes

4 tetes d'attention avec les statistiques suivantes (k = 1) :

| Tete | mu_N | sigma_N | mu_A | sigma_A | score_cand |
|------|------|---------|------|---------|-----------|
| (1,3) | 0.70 | 0.10 | 0.40 | 0.15 | ? |
| (2,5) | 0.55 | 0.20 | 0.50 | 0.18 | ? |
| (4,1) | 0.85 | 0.05 | 0.25 | 0.10 | ? |
| (6,8) | 0.60 | 0.12 | 0.55 | 0.10 | ? |

Calculez score_cand pour chaque tete et determinez H_i.

**Solution** :

- (1,3) : 0.70 - 0.10 - (0.40 + 0.15) = 0.60 - 0.55 = **0.05** > 0 -> incluse
- (2,5) : 0.55 - 0.20 - (0.50 + 0.18) = 0.35 - 0.68 = **-0.33** < 0 -> exclue
- (4,1) : 0.85 - 0.05 - (0.25 + 0.10) = 0.80 - 0.35 = **0.45** > 0 -> incluse
- (6,8) : 0.60 - 0.12 - (0.55 + 0.10) = 0.48 - 0.65 = **-0.17** < 0 -> exclue

H_i = {(1,3), (4,1)}

La tete (4,1) est la plus discriminante (score 0.45) — elle voit clairement la difference entre requetes normales et attaques. La tete (2,5) a trop de variance sur les normales et pas assez de difference avec les attaques.

---

### Exercice 3 (Moyen) — Calcul du Focus Score

Avec H_i = {(1,3), (4,1)} et seuil t = 0.55, classez ces 3 requetes :

| Requete | Attn^(1,3)(I) | Attn^(4,1)(I) |
|---------|--------------|---------------|
| Q1 | 0.75 | 0.80 |
| Q2 | 0.30 | 0.20 |
| Q3 | 0.60 | 0.45 |

**Solution** :

- Q1 : FS = (0.75 + 0.80) / 2 = **0.775** > 0.55 -> **NORMAL**
- Q2 : FS = (0.30 + 0.20) / 2 = **0.250** < 0.55 -> **INJECTION**
- Q3 : FS = (0.60 + 0.45) / 2 = **0.525** < 0.55 -> **INJECTION**

Q3 est un cas limite : le Focus Score (0.525) est juste en dessous du seuil. C'est peut-etre une injection subtile ou une requete normale ambigue. Le choix du seuil est crucial en milieu medical.

---

### Exercice 4 (Difficile) — Choix du seuil et compromis

Vous devez choisir le seuil t pour le Focus Score dans un hopital. Voici les FS mesures :

**Normales** (50 requetes) : distribution FS entre 0.60 et 0.95, moyenne = 0.78, sigma = 0.08
**Injections** (50 requetes) : distribution FS entre 0.10 et 0.50, moyenne = 0.30, sigma = 0.10

a) Si t = 0.55, estimez le taux de fausses alertes (FPR) et le taux de detection (TPR)
b) Si t = 0.65, idem
c) Quel seuil recommandez-vous et pourquoi ?

**Solution** :

a) **t = 0.55** :
- FPR : proportion de normales avec FS < 0.55. En supposant une distribution normale, z = (0.55 - 0.78) / 0.08 = -2.875. P(Z < -2.875) = **~0.002** (0.2% de fausses alertes)
- TPR : proportion d'injections avec FS < 0.55. z = (0.55 - 0.30) / 0.10 = 2.5. P(Z < 2.5) = **~0.994** (99.4% de detection)

b) **t = 0.65** :
- FPR : z = (0.65 - 0.78) / 0.08 = -1.625. P(Z < -1.625) = **~0.052** (5.2% de fausses alertes)
- TPR : z = (0.65 - 0.30) / 0.10 = 3.5. P(Z < 3.5) = **~0.9998** (99.98% de detection)

c) **Recommandation : t = 0.55**. En milieu medical, manquer une injection est bien plus dangereux qu'une fausse alerte. A t = 0.55 :
- On detecte 99.4% des injections (seules les plus subtiles echappent)
- On n'a que 0.2% de fausses alertes (1 alerte incorrecte pour 500 requetes normales)

Augmenter a 0.65 ameliore marginalement la detection (99.4 -> 99.98%) mais multiplie les fausses alertes par 26 (0.2% -> 5.2%), ce qui pourrait causer une "fatigue d'alerte" dans l'equipe medicale.

---

## Resume du module

| Concept | Formule cle | Application AEGIS |
|---------|------------|-------------------|
| Attention | alpha = softmax(QK^T / sqrt(d_k)) | Base de tous les transformers |
| Multi-Head | Concat(head_1, ..., head_h) * W | Vues multiples du texte |
| Focus Score | FS = mean(Attn^(l,h)(I)) sur H_i | Detection d'injection sans entrainement |
| Tetes importantes | score_cand > 0 | Selection automatique des indicateurs |

**Message cle** : Le mecanisme d'attention n'est pas une boite noire — il peut etre OBSERVE et INTERPRETE. L'Attention Tracker exploite cette transparence pour detecter les injections en mesurant si l'attention du modele se detourne du prompt original. C'est la methode de detection la plus elegante car elle ne necessite aucun classificateur supplementaire.

---

*Module 7 termine — Curriculum complet !*
*Consultez SELF_ASSESSMENT_QUIZ.md pour tester vos connaissances.*
