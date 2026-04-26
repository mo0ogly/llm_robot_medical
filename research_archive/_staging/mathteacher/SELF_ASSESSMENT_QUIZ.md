# AUTO-EVALUATION — Pre-test et Post-test
## Mesurez votre progression avant et apres le curriculum

**Instructions** :
1. Faites le **pre-test** AVANT de commencer les modules (sans consulter les documents)
2. Notez vos reponses et votre score
3. Faites le **post-test** APRES avoir termine tous les modules
4. Comparez les scores pour mesurer votre progression

**Bareme** : Chaque question vaut 1 point. Total : 30 points par test.
- 0-10 : Niveau debutant (normal pour le pre-test)
- 11-20 : Niveau intermediaire
- 21-25 : Bon niveau
- 26-30 : Niveau suffisant pour lire les articles de recherche

---

# PRE-TEST (a faire AVANT les modules)

## Section A — Algebre lineaire (6 points)

**Q1.** Soit u = [3, 4] et v = [4, 3]. Quelle est la similarite cosinus entre u et v ?
- a) 0.50
- b) 0.96
- c) 1.00
- d) 0.24

**Q2.** Que signifie cos(u, v) = 0 ?
- a) Les vecteurs sont identiques
- b) Les vecteurs sont orthogonaux (aucun rapport)
- c) Les vecteurs sont opposes
- d) L'un des vecteurs est nul

**Q3.** La norme euclidienne de u = [3, 4] vaut :
- a) 7
- b) 5
- c) 25
- d) 12

**Q4.** Que fait une matrice diagonale D quand on multiplie un vecteur v par D ?
- a) Elle tourne le vecteur
- b) Elle etire chaque composante par un facteur different
- c) Elle additionne une constante a chaque composante
- d) Elle inverse le vecteur

**Q5.** La norme de Frobenius d'une matrice 2x2 = [[1, 2], [3, 4]] vaut :
- a) 10
- b) sqrt(30)
- c) 4
- d) 30

**Q6.** Si cos(u, v) = 0.99 pour deux embeddings de phrases, cela signifie :
- a) Les phrases sont identiques mot a mot
- b) Les phrases ont un sens tres similaire
- c) Les phrases ont exactement 99% de mots en commun
- d) Les phrases sont completement differentes

## Section B — Probabilites et statistiques (6 points)

**Q7.** L'esperance de la variable X qui prend les valeurs {1, 2, 3} avec probabilites {0.5, 0.3, 0.2} est :
- a) 2.0
- b) 1.7
- c) 1.5
- d) 2.5

**Q8.** Que mesure la variance ?
- a) La valeur moyenne
- b) La dispersion autour de la moyenne
- c) La probabilite maximale
- d) Le nombre d'echantillons

**Q9.** La fonction indicatrice 1_{x > 0} vaut :
- a) 0 si x > 0, 1 sinon
- b) 1 si x > 0, 0 sinon
- c) x si x > 0, 0 sinon
- d) Toujours 1

**Q10.** Pour une validite statistique, la these AEGIS exige un minimum de combien de mesures par condition ?
- a) 10
- b) 20
- c) 30
- d) 100

**Q11.** Si Cov(X, Y) < 0, cela signifie :
- a) X et Y evoluent dans le meme sens
- b) X et Y evoluent en sens opposes
- c) X et Y sont independants
- d) Les deux sont negatifs

**Q12.** Le score de Wilson est prefere a l'IC normal quand :
- a) n est tres grand
- b) p est proche de 0 ou 1
- c) Les donnees sont continues
- d) On veut un IC plus large

## Section C — Theorie de l'information (6 points)

**Q13.** La cross-entropy -log(0.01) vaut environ :
- a) 0.01
- b) 1.0
- c) 4.6
- d) 100

**Q14.** Que signifie une entropie H(P) = 0 ?
- a) La distribution est uniforme
- b) La distribution est deterministe (un seul resultat certain)
- c) La distribution est inconnue
- d) Le modele est parfait

**Q15.** La divergence KL est-elle symetrique ? D_KL(P||Q) = D_KL(Q||P) ?
- a) Oui, toujours
- b) Non, en general
- c) Seulement si P = Q
- d) Seulement pour les distributions discretes

**Q16.** Dans l'objectif RLHF, le terme beta * D_KL sert a :
- a) Augmenter la recompense
- b) Empecher le modele de trop s'eloigner du modele de base
- c) Accelerer l'entrainement
- d) Mesurer la nocivite

**Q17.** Une temperature tau tres basse dans le softmax produit :
- a) Une distribution uniforme
- b) Une distribution concentree sur le maximum
- c) Des probabilites negatives
- d) Un resultat identique a tau = 1

**Q18.** La cross-entropy ponderee donne plus de poids aux :
- a) Classes les plus frequentes
- b) Classes les plus rares
- c) Classes avec la plus haute probabilite
- d) Classes avec le plus de features

## Section D — Metriques et scores (6 points)

**Q19.** Si Precision = 0.90 et Recall = 0.60, le F1-score est :
- a) 0.75
- b) 0.72
- c) 0.80
- d) 0.60

**Q20.** Un AUROC de 0.5 signifie :
- a) Detecteur parfait
- b) Detecteur equivalent au hasard
- c) Detecteur inverse (pire que le hasard)
- d) Pas assez de donnees

**Q21.** Sep(M) mesure la capacite d'un modele a :
- a) Generer du texte correct
- b) Distinguer instructions et donnees
- c) Detecter les fautes d'orthographe
- d) Traduire entre langues

**Q22.** Un ASR de 94.4% en milieu medical signifie :
- a) Le modele est tres sur
- b) 94.4% des attaques reussissent
- c) Le detecteur a 94.4% de precision
- d) 94.4% des patients sont proteges

**Q23.** Qu'est-ce qu'un "temoin surprise" dans Sep(M) ?
- a) Un humain qui observe le test
- b) Un mot qui apparait seulement si le probe est traite comme instruction
- c) Un token genere aleatoirement
- d) Un modele de reference

**Q24.** En milieu medical, quel est le plus dangereux entre FP et FN ?
- a) FP (fausse alerte)
- b) FN (attaque manquee)
- c) Ils sont equivalents
- d) Ni l'un ni l'autre

## Section E — Alignement et attention (6 points)

**Q25.** L'alignement RLHF est dit "superficiel" car :
- a) Il est mal entraine
- b) Il ne modifie que les premiers tokens de la reponse
- c) Il ne fonctionne pas du tout
- d) Il necessite trop de donnees

**Q26.** L'attaque par prefilling consiste a :
- a) Envoyer beaucoup de requetes simultanement
- b) Forcer les premiers tokens de la reponse du modele
- c) Modifier les poids du modele
- d) Pirater le serveur

**Q27.** DPO est une alternative a RLHF qui :
- a) Utilise un reward model plus gros
- b) Elimine le besoin d'un reward model separe
- c) Ne fait pas d'apprentissage par renforcement
- d) Fonctionne uniquement sur GPT

**Q28.** Le Focus Score detecte les injections en mesurant :
- a) La longueur de la requete
- b) Les mots-cles suspects
- c) L'attention du modele au prompt original
- d) La temperature de generation

**Q29.** Le theoreme de Young (P019) prouve que :
- a) Les LLM sont parfaitement securises
- b) Le gradient d'alignement est nul au-dela de l'horizon de nocivite
- c) DPO est meilleur que RLHF
- d) L'attention est inutile

**Q30.** La couche δ¹ d'AEGIS correspond a :
- a) L'alignement interne du modele
- b) La detection pre-inference
- c) La validation post-inference
- d) Le monitoring continu

---

# REPONSES DU PRE-TEST / POST-TEST

## Section A — Algebre lineaire

| Q | Reponse | Explication |
|---|---------|-------------|
| Q1 | **b) 0.96** | cos = (3*4+4*3)/(5*5) = 24/25 = 0.96 |
| Q2 | **b) orthogonaux** | cos = 0 signifie angle de 90 degres, aucune correlation |
| Q3 | **b) 5** | sqrt(9+16) = sqrt(25) = 5 |
| Q4 | **b) etire chaque composante** | D*v = [d1*v1, d2*v2, ...] |
| Q5 | **b) sqrt(30)** | sqrt(1+4+9+16) = sqrt(30) |
| Q6 | **b) sens tres similaire** | Cos mesure la similarite semantique, pas lexicale |

## Section B — Probabilites et statistiques

| Q | Reponse | Explication |
|---|---------|-------------|
| Q7 | **b) 1.7** | 1*0.5 + 2*0.3 + 3*0.2 = 0.5+0.6+0.6 = 1.7 |
| Q8 | **b) dispersion** | Var = E[(X-E[X])^2] |
| Q9 | **b) 1 si x > 0** | Definition de la fonction indicatrice |
| Q10 | **c) 30** | Critere AEGIS de validite statistique |
| Q11 | **b) sens opposes** | Covariance negative = correlation negative |
| Q12 | **b) p proche de 0 ou 1** | L'IC normal donne des bornes impossibles dans ces cas |

## Section C — Theorie de l'information

| Q | Reponse | Explication |
|---|---------|-------------|
| Q13 | **c) 4.6** | -log(0.01) = -(-4.605) = 4.605 |
| Q14 | **b) deterministe** | H=0 quand un seul evenement a P=1 |
| Q15 | **b) Non** | D_KL n'est pas symetrique (ce n'est pas une distance) |
| Q16 | **b) empecher de s'eloigner** | La penalite KL est l'"elastique" de regularisation |
| Q17 | **b) concentree sur le max** | tau -> 0 rend le softmax quasi-deterministe |
| Q18 | **b) classes rares** | w_c = N/(k*n_c), plus petit n_c = plus grand poids |

## Section D — Metriques et scores

| Q | Reponse | Explication |
|---|---------|-------------|
| Q19 | **b) 0.72** | F1 = 2*(0.90*0.60)/(0.90+0.60) = 1.08/1.50 = 0.72 |
| Q20 | **b) equivalent au hasard** | AUROC 0.5 = pas de pouvoir discriminant |
| Q21 | **b) distinguer instructions et donnees** | Definition de Sep(M) |
| Q22 | **b) 94.4% des attaques reussissent** | ASR = Attack Success Rate |
| Q23 | **b) mot qui apparait seulement en mode instruction** | Definition du surprise witness |
| Q24 | **b) FN** | En medical, une attaque manquee peut etre fatale |

## Section E — Alignement et attention

| Q | Reponse | Explication |
|---|---------|-------------|
| Q25 | **b) ne modifie que les premiers tokens** | P018 (ICLR 2025) demontre le shallow alignment |
| Q26 | **b) forcer les premiers tokens** | Le prefilling contourne l'alignement concentre sur ces tokens |
| Q27 | **b) elimine le reward model** | DPO optimise directement sur les paires de preferences |
| Q28 | **c) attention au prompt original** | FS mesure si l'attention reste sur le prompt ou se detourne |
| Q29 | **b) gradient nul au-dela de l'horizon** | Impossibilite structurelle de l'alignement profond |
| Q30 | **b) detection pre-inference** | δ⁰=alignement, δ¹=detection, δ²=validation, δ³=monitoring |

---

# GRILLE D'EVALUATION

## Avant les modules (pre-test)

| Score | Niveau | Interpretation |
|-------|--------|---------------|
| 0-5 | Debutant | Normal si bac+2 biologie. Les modules vous guideront progressivement. |
| 6-10 | Debutant+ | Quelques bases en stats/maths. Commencez par le Module 1. |
| 11-15 | Intermediaire | Bonnes bases. Vous pouvez accelerer les Modules 1-2. |
| 16-20 | Avance | Bases solides. Concentrez-vous sur les Modules 4-5-7. |
| 21-25 | Tres avance | Vous connaissez deja la plupart des concepts. Ciblez vos lacunes. |
| 26-30 | Expert | Vous pouvez deja lire les articles. Le curriculum est une revision. |

## Apres les modules (post-test)

| Score | Objectif |
|-------|----------|
| < 20 | Revoir les modules ou vous avez le plus de lacunes |
| 20-25 | Bon niveau, commencez a lire les articles les plus accessibles (P014, P008) |
| 26-30 | Pret a lire tous les articles de la bibliographie |

## Progression attendue

| Pre-test | Post-test attendu | Gain |
|----------|-------------------|------|
| 0-5 | 18-22 | +15-20 points |
| 6-10 | 22-26 | +14-18 points |
| 11-15 | 25-28 | +12-15 points |
| 16-20 | 27-30 | +8-12 points |

---

# SECTION SUPPLEMENTAIRE — FORMULES 2026 (8 questions)

> Ces questions portent sur les formules ajoutees en RUN-002 (P035-P046).
> Elles s'ajoutent au quiz principal pour le post-test v2.0.

## Section F — Metriques medicales et alignement 2026 (8 points)

**Q31.** Le CHER_3 mesure :
- a) Le taux de succes d'une attaque
- b) La proportion de reponses causant un dommage clinique de severite >= 3
- c) Le nombre total de patients affectes
- d) La precision d'un detecteur au seuil 3

**Q32.** Quelle est la difference fondamentale entre CHER et ASR ?
- a) Le CHER est plus rapide a calculer
- b) L'ASR mesure l'obeissance du modele, le CHER mesure le dommage clinique reel
- c) Le CHER ne fonctionne que pour les modeles medicaux
- d) L'ASR est une metrique plus recente

**Q33.** Dans le GRPO, l'avantage relatif A_hat est calcule par rapport a :
- a) Un modele de reference externe
- b) La moyenne du groupe de reponses generees pour la meme question
- c) Le score maximal theorique
- d) Le score du modele precedent

**Q34.** L'ADPO differe du DPO classique car :
- a) Il utilise un reward model plus grand
- b) Il entraine le modele sous perturbation adversariale (pire cas)
- c) Il ne necessite pas de paires de preferences
- d) Il fonctionne uniquement en zero-shot

**Q35.** Le logit gap F(X) = z_no - z_yes mesure :
- a) La qualite de la reponse du LLM
- b) La marge de decision d'un LLM-juge entre approuver et rejeter
- c) La distance entre deux embeddings
- d) Le taux d'erreur du detecteur

**Q36.** Un SAM (Safety Alignment Margin) proche de 0 signifie :
- a) Le modele est parfaitement aligne
- b) Les modes de securite (pos/neg/rej) se chevauchent
- c) Le modele refuse tout
- d) Le modele n'a pas ete entraine

**Q37.** Le CoSA-Score penalise le plus fortement :
- a) Un modele inutile mais sur (h faible, s = +1)
- b) Un modele competent mais dangereux (h eleve, s = -1)
- c) Un modele qui refuse tout
- d) Un modele qui hallucine

**Q38.** Le facteur d'amplification emotionnelle de 6x (P040) signifie :
- a) 6 modeles ont ete testes
- b) L'ajout de manipulation emotionnelle rend l'injection 6 fois plus efficace que le baseline
- c) Le modele genere 6 fois plus de tokens
- d) 6 types d'emotions ont ete testes

---

# REPONSES SECTION F

| Q | Reponse | Explication |
|---|---------|-------------|
| Q31 | **b) proportion severite >= 3** | Definition du CHER_k avec k=3 |
| Q32 | **b) obeissance vs dommage reel** | ASR = le modele a-t-il obei ? CHER = un patient est-il blesse ? |
| Q33 | **b) moyenne du groupe** | GRPO normalise par mean et std du groupe, pas de value function |
| Q34 | **b) perturbation adversariale** | ADPO = DPO + delta* (pire perturbation via PGD) |
| Q35 | **b) marge de decision du juge** | F > 0 => "No", F < 0 => "Yes", manipulable par tokens de controle |
| Q36 | **b) modes se chevauchent** | SAM = silhouette, proche de 0 = pas de separation nette |
| Q37 | **b) competent mais dangereux** | Contribution = -h_i quand s_i = -1, forte penalite si h eleve |
| Q38 | **b) 6x plus efficace** | MR_emo+PI / MR_baseline = 37.5% / 6.2% = 6.0x |

---

# GRILLE D'EVALUATION MISE A JOUR (v2.0)

## Quiz complet (post-test v2.0) : 38 questions

| Score | Niveau | Interpretation |
|-------|--------|---------------|
| 0-10 | Debutant | Normal pour le pre-test |
| 11-20 | Intermediaire | Bonnes bases, modules 1-3 a approfondir |
| 21-28 | Avance | Bonne maitrise, concentrez-vous sur les formules 2026 |
| 29-34 | Tres avance | Vous pouvez lire la plupart des articles |
| 35-38 | Expert | Pret a lire tous les articles de la bibliographie, y compris 2026 |

---

# DIAGNOSTIC PAR SECTION

Si vous avez un score faible dans une section specifique, voici les modules a prioriser :

| Section faible | Modules prioritaires |
|---------------|---------------------|
| A (Algebre lineaire) | Module 1 puis Module 6 |
| B (Probabilites) | Module 2 |
| C (Theorie de l'information) | Module 3 |
| D (Metriques) | Module 4 |
| E (Alignement) | Module 5 puis Module 7 |
| F (Formules 2026) | Modules 2, 4 et 5 (sections [2026]) |

---

*Quiz mis a jour le 2026-04-04 (RUN-002) — 38 questions couvrant les 7 modules + formules 2026*
*Base sur les 37 formules extraites de 46 articles (22 RUN-001 + 15 RUN-002)*

---

# POST-RUN VERIFICATION_DELTA3_20260411 — Questions additionnelles

Ces questions couvrent la nouvelle section "composition vs unification formelle" du Module 4, ajoutee suite a la verification de la claim "4eme implementation δ³" qui a revele 7+ frameworks δ³ existants (LMQL 2022 en precurseur).

### Q-39 — Composition vs unification

LlamaFirewall (Meta 2025, P131) compose 3 policies independantes : `PromptGuard2(input) ∧ AlignmentCheck(reasoning) ∧ CodeShield(output)`. AEGIS utilise un predicat unifie `Integrity(S) := Reachable(M,i) ⊆ Allowed(i)`.

**Question** : quelle est la difference mathematique fondamentale entre ces deux approches ?

A) Composition = conjonction booleenne de verdicts independants ; unification = inclusion ensembliste sur un ensemble pre-specifie
B) Composition = plus rapide ; unification = plus precise
C) Composition = deterministe ; unification = probabiliste
D) Aucune difference formelle, juste stylistique

**Reponse** : **A**

**Explication** : La composition booleenne (LlamaFirewall F73) combine N verdicts binaires issus de N detecteurs heterogenes. L'inclusion ensembliste AEGIS verifie qu'aucun output reellement genere (`Reachable(M,i)`) ne sort d'un ensemble pre-specifie (`Allowed(i)`) — ce qui permet de definir formellement ce qui est autorise **a priori**, independamment du processus de detection. La conjonction existe toujours a l'interieur de `Allowed(i)`, mais l'unification AEGIS ajoute le quantificateur universel `∀o ∈ Reachable(M,i)` qui change la nature de la verification.

**Pourquoi c'est important** : pour une specification reglementaire FDA 510k (Da Vinci Xi, `max_tension_g = 800`), il faut pouvoir ecrire explicitement ce qui est autorise — une suite de detecteurs opaques ne suffit pas.

### Q-40 — Genealogie du pattern δ³

Parmi ces frameworks, quel est le **precurseur historique** (2022) du pattern "validate output contre specification declarative" ?

A) CaMeL (Debenedetti et al. 2025, P081)
B) AgentSpec (Wang et al. 2025, P082)
C) LMQL (Beurer-Kellner, Fischer, Vechev 2022, P135, PLDI 2023)
D) AEGIS (2026)

**Reponse** : **C**

**Explication** : LMQL (Language Model Query Language) a ete publie en decembre 2022 (arXiv:2212.06094) et presente a PLDI 2023. C'est le premier DSL a proposer la syntaxe `argmax(LLM(prompt)) where c_1 and c_2` avec une semantique operationnelle formelle. Son premier auteur Beurer-Kellner a ensuite co-ecrit P126 Tramer et al. 2025 "Design Patterns for Securing LLM Agents against Prompt Injections", confirmant la continuite de recherche. AEGIS n'est donc pas la 4eme implementation du pattern mais au minimum la **6eme** chronologiquement (LMQL 2022 → Guardrails AI 2023 → LLM Guard 2023 → CaMeL 2025 → AgentSpec 2025 → LlamaFirewall 2025 → RAGShield 2026 → AEGIS 2026). La contribution originale d'AEGIS est l'**unification formelle** sous `Integrity(S)` et la **specialisation medicale FDA**, pas l'anteriorite du pattern.

---

*Quiz mis a jour le 2026-04-11 (VERIFICATION_DELTA3) — 40 questions, +2 sur composition vs unification*
