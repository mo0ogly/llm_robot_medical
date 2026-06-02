# AEGIS - Journal de decisions

## Metadata

- Document : AEGIS-DECISION-LOG-001
- Version : 1.0
- Date : 2026-05-21
- Auteur : Fab (mo0ogly)
- Statut : Document de travail interne

> Note d'organisation : la Partie 1 du document d'origine (protocole anti-confabulation) a ete extraite vers le skill `anti-confabulation`. Le present fichier conserve le journal de decisions et l'audit (Parties 2 a 4). Le protocole reste applicable a toutes les fiches via le skill.

---

# PARTIE 2 : JOURNAL DE DECISIONS - DELTA-0

## 2.1 Decision : Introduction de delta-0 comme couche formelle

Date : 2026-05-21

Contexte : la fiche #08 (Extortion Tool Hijack) est rejetee par l'alignement RLHF de base, avant toute couche delta1-delta3. Le cadre existant ne permet pas de formaliser cette source de refus.

Decision : introduire delta-0 (Definition 17) comme extension du cadre delta1-delta3 de la these.

Justification : le concept existe dans la litterature sous plusieurs noms convergents, mais n'a pas ete formalise dans un cadre DY-AGENT / Sep(M). L'introduction de delta-0 est une contribution originale de la these, ancree dans 5 publications 2025-2026.

## 2.2 Sources academiques pour delta-0

| # | Reference complete | Venue | Concept utilise | Propriete de delta-0 fondee | Statut verification |
|---|--------------------|-------|-----------------|-----------------------------|---------------------|
| 1 | Qi et al., "Safety Alignment Should Be Made More Than Just a Few Tokens Deep" | ICLR 2025 | Shallow safety alignment | P2 (Shallowness) | [SOURCE] Qi et al. (arXiv:2406.05946) = corpus P018. Correction 2026-05-21 : attribue par erreur a Wei et al. dans la version initiale |
| 2 | Zhao et al., "Safety Layers in Aligned Large Language Models: The Key to LLM Security" | Soumis ICLR 2025 (OpenReview) | Safety layers (couches internes) | Base mecanistique de delta-0 | [SOURCE] Verifie - sur openreview.net, statut : soumission |
| 3 | Zhao & Ke, "Unraveling LLM Jailbreaks Through Safety Knowledge Neurons" | EACL 2026 | Safety knowledge neurons | Distinction delta-0 vs delta-1 au niveau neuronal | [SOURCE] Verifie - publie dans les proceedings EACL 2026 (ACL Anthology) |
| 4 | IBM, "What Is LLM Alignment?" | ibm.com/think (Mars 2026) | Outer vs Inner alignment | P3 (Fragilite de l'outer alignment) | [SOURCE] Verifie - page IBM consultee, cite "Safety Pretraining" (arXiv Sep 2025) |
| 5 | NDSS 2025, "Safety Misalignment Against Large Language Models" | NDSS Symposium 2025 | Vulnerabilite partagee des paradigmes d'alignement | P3 (Fragilite au fine-tuning) | [SOURCE] Verifie - papier dans les proceedings NDSS 2025 |

## 2.3 Definition 17 - Proprietes formelles et leur source

| Propriete | Enonce | Source directe | Niveau de confiance |
|-----------|--------|----------------|---------------------|
| P1 (Independance du contexte) | delta-0 persiste independamment du system prompt s0 | Deduction logique : le RLHF modifie les poids theta, pas le contexte. Confirme par Safety Layers (Zhao et al.) qui identifient les couches dans les parametres. | [HYPOTHESE BIEN FONDEE] - logiquement necessaire, confirme par la litterature |
| P2 (Shallowness) | delta-0 opere sur les premiers tokens de la reponse | Qi et al. 2025, ICLR (arXiv:2406.05946 = corpus P018) - demonstration experimentale directe | [SOURCE] - correction d'attribution 2026-05-21 (Qi, non Wei) |
| P3 (Fragilite au fine-tuning) | delta-0 degradable par fine-tuning adversarial | Qi et al. 2023 (arXiv:2310.03693 ; environ 10 exemples adversariaux, le 100 concerne le fine-tuning benin) ; NDSS 2025 (= P023, Gong et al.) etaye la fragilite generale ; IBM Mars 2026 | [SOURCE] - correction d'attribution 2026-05-21 (le chiffre n'est pas de NDSS) |

## 2.4 Protocole de discrimination delta-0 / delta-1

| Etape | Procedure | Source / Justification |
|-------|-----------|------------------------|
| 1 | Tester le template AVEC system prompt (30 runs min) | Protocole standard de la these |
| 2 | Tester le template SANS system prompt (30 runs min, s0 = vide) | [CONTRIBUTION ORIGINALE] - pas de precedent exact dans la litterature |
| 3 | Calculer Delta_delta1 = ASR_sans - ASR_avec | [CONTRIBUTION ORIGINALE] |
| 4 | Si Delta_delta1 proche de 0 : refus par delta-0. Si superieur a 0 : contribution de delta-1 mesurable. | [CONTRIBUTION ORIGINALE] |

Note : ce protocole est une contribution originale. Il n'a pas ete utilise dans la litterature existante sous cette forme. La distinction "tester avec/sans system prompt" est intuitive mais sa formalisation comme outil de mesure est nouvelle.

## 2.5 Decision sur la retro-propagation

Decision : NE PAS retro-propager delta-0 dans les fiches #01 a #07.

Raison :

- Les fiches existantes sont valides dans le cadre delta1-delta3 original.
- La retro-propagation est un travail lourd (7 fiches multipliees par la reformulation des sections 3, 4, 7, 10) pour un gain marginal sauf pour le #07.
- Le #08 contient une note de retro-lecture (section 10.1) qui documente les implications pour chaque fiche precedente.
- La retro-propagation se fera naturellement dans le chapitre theorique de la these.

Exception : la fiche #07 devrait etre mise a jour pour integrer le protocole delta-0/delta-1 (30 runs sans system prompt). C'est le seul cas ou la distinction a un impact direct sur la validite de C1.

## 2.6 Erreur identifiee dans la fiche #01

La fiche #01 (C1_complete) contient la formulation : "le refus provient de delta-2 implicite dans l'alignement RLHF".

Cette formulation est factuellement imprecise :

- delta-2 est defini comme le filtre regex/Aegis Shield (composant externe).
- Le RLHF est dans les poids du modele (composant interne).
- Ranger le RLHF dans delta-2 etire la definition au-dela de ce qu'elle couvre.

Correction : avec delta-0, la formulation correcte est "le refus provient de delta-0 (alignement de base)". Cette correction sera appliquee dans le chapitre theorique de la these, pas dans la fiche de travail.

---

# PARTIE 3 : AUDIT DES CONFABULATIONS POTENTIELLES DANS LES FICHES EXISTANTES

## 3.1 Fiche #01 (C1 Structural Bypass)

| Affirmation | Tag | Probleme potentiel |
|-------------|-----|--------------------|
| P(CAPS detection) >= 0.98 | [ESTIMATION] | Wallace et al. 2024 est cite mais la valeur 0.98 n'est pas un chiffre exact du papier. C'est une estimation arrondie. [A VERIFIER : chiffre exact dans Wallace et al.] |
| P(negation) >= 0.95 | [ESTIMATION] | Liu et al. 2023 section 4.2 est cite. [A VERIFIER : le chiffre 0.95 est-il dans le papier ou est-ce une estimation ?] |
| P(token fictif) >= 0.80 | [ESTIMATION] | Aucune reference directe. La fiche dit "estimation (pas de ref. clinique)". Honnete. |
| P(tool direct) >= 0.85 | [ESTIMATION] | Aucune reference directe. La fiche dit "mape tool hijack par RLHF". [A VERIFIER] |
| P(coercition) >= 0.90 | [ESTIMATION] | Aucune reference directe. |
| P(XML fictif) >= 0.70 | [ESTIMATION] | "non conforme HL7/FHIR" - raisonnement correct mais le chiffre est une estimation. |
| P(C(i) = 1) = 0.9999991 | [CALCUL] | Calcul correct SI les hypotheses (independance, valeurs individuelles) sont correctes. Les deux sont des [HYPOTHESE] et [ESTIMATION]. |
| "Wallace et al. (2024)" | [A VERIFIER] | Quelle publication exactement ? Titre complet ? Venue ? |

## 3.2 Fiche #03 (FDA Social Engineering)

| Affirmation | Tag | Probleme potentiel |
|-------------|-----|--------------------|
| Trust(i) = somme des wk fois authk | [CONTRIBUTION] | Definition originale. Legitime. |
| w1 = 0.35, w2 = 0.30, w3 = 0.25, w4 = 0.10 | [ESTIMATION] | Attribue a "Zeng et al. 2024". [A VERIFIER : ces poids sont-ils dans le papier Zeng ou sont-ils des estimations de Claude ?] |
| tau = 0.50 | [ESTIMATION] | "estime". Pas de source. |
| ASR de l'ordre de 27% | [PROJECTION] | Derive de Trust(i) = 0.35 et du modele. Pas une mesure. |
| "Zeng et al. (2024)" | [A VERIFIER] | Titre complet ? Venue ? Le "92% ASR avec triple authority chain" est-il dans ce papier ? |
| "Lee et al. (JAMA 2025)" | [A VERIFIER] | Titre ? Le 94.4% ASR est-il le chiffre exact ? |

## 3.3 Fiche #07 (Multi-Turn APT)

| Affirmation | Tag | Probleme potentiel |
|-------------|-----|--------------------|
| ASR de l'ordre de 60% | [PROJECTION] | C'est la valeur la plus critique pour C1. Base sur quel raisonnement ? |
| "IntentGuard (2025)" | [A VERIFIER] | Publication ou produit ? Reference exacte ? |
| "DeepContext (2026)" | [A VERIFIER] | Existe vraiment ? Titre ? Auteurs ? |
| gamma1 = 0.30, gamma2 = 0.40, gamma3 = 0.50 | [ESTIMATION] | Sources ? |

## 3.4 Fiche #08 (Extortion Tool Hijack - v3)

| Affirmation | Tag | Probleme potentiel |
|-------------|-----|--------------------|
| Qi et al. ICLR 2025 (= corpus P018, arXiv:2406.05946) | [SOURCE] | Correction 2026-05-21 : auteur = Qi et al., pas Wei et al. Titre exact : "Safety Alignment Should Be Made More Than Just a Few Tokens Deep" |
| Safety Layers, Zhao et al. | [SOURCE] | Verifie. Soumission ICLR 2025 sur OpenReview. |
| Safety Knowledge Neurons, EACL 2026 | [SOURCE] | Verifie. Zhao & Ke, EACL 2026, ACL Anthology. |
| IBM Mars 2026, "thin layer of censorship" | [SOURCE] | Verifie. ibm.com/think. Mais c'est un article de blog IBM, pas un papier peer-reviewed. [NOTER : source de qualite inferieure] |
| NDSS 2025, Safety Misalignment | [SOURCE] | Verifie. Proceedings NDSS 2025. |
| P(detection) = 0.999999997 | [CALCUL base sur ESTIMATIONS] | Le calcul est correct mais les valeurs d'entree sont des estimations. |

> Audit verifie complet (texte integral de la fiche v3, mode AUDIT de la skill anti-confabulation, 2026-05-21) : voir `research_notes/AEGIS-AUDIT-FICHE-08_anti-confabulation.md`. Findings additionnels confirmes par recalcul independant : l'ecart "6 ordres de grandeur" est en realite d'environ 2.5 ordres ; l'IC indique 9.5% (borne unilaterale 95%) la ou un IC95 bilateral Clopper-Pearson 0/30 vaut 11.6% ; et la section 3.5 presente Sep(M)=1.0 et l'IC sur "N=30" comme mesures alors que la section 6 reste en [REMPLIR] (projection presentee comme mesure). Verdict skill : NON CONFORME tant que ces points ne sont pas tranches.

## 3.5 Fiche #10 (Base64 Bypass)

| Affirmation | Tag | Probleme potentiel |
|-------------|-----|--------------------|
| "Mindgard (Avril 2025)" Emoji smuggling 100% | [A VERIFIER] | Le 100% est-il exact ? Source exacte ? |
| "Unit42 / Palo Alto (Fevrier 2026)" | [A VERIFIER] | Reference exacte ? |
| "InstaTunnel / Token Smuggling (Fevrier 2026)" | [A VERIFIER] | Nom exact ? Publication ou blog ? |
| P(decodage par M) de l'ordre de 0.85 | [ESTIMATION] | Pas de source directe. |

## 3.6 Fiche #11 (Homoglyph Attack)

| Affirmation | Tag | Probleme potentiel |
|-------------|-----|--------------------|
| "Mindgard (Avril 2025)" ASR 44-76% | [A VERIFIER] | Ces chiffres sont-ils dans le rapport Mindgard ? |
| "PromptGuard (Nature, Jan 2026)" | [A VERIFIER] | Publie dans Nature ? Titre exact ? |
| rag_sanitizer.py ligne 35 | [CODE] | Reference au code du projet. [A VERIFIER : le code existe-t-il ? La ligne 35 fait-elle bien de la detection Cyrillic ?] |
| confusables.txt de l'ordre de 6565 caracteres | [A VERIFIER] | Chiffre exact du standard UTS #39 ? |

---

# PARTIE 4 : ACTIONS PRIORITAIRES

## Priorite 1 : Verifier les references critiques

- [ ] Wallace et al. (2024) - titre exact, venue, chiffres de detection
- [ ] Zeng et al. (2024) - titre exact, venue, les poids w1-w4 et le 92% ASR
- [ ] Lee et al. (JAMA 2025) - titre exact, le 94.4% ASR
- [ ] IntentGuard (2025) - existence, reference exacte
- [ ] DeepContext (2026) - existence, reference exacte
- [ ] Mindgard (Avril 2025) - rapport exact, chiffres ASR
- [ ] PromptGuard (Nature, Jan 2026) - existence dans Nature

## Priorite 2 : Mesurer les ASR

Aucun ASR n'a ete mesure experimentalement. Tous sont des projections/estimations. La premiere campagne experimentale (run_formal_campaign) doit :

- [ ] Mesurer l'ASR reel pour chaque template
- [ ] Executer le protocole delta-0/delta-1 pour le #07 (30 runs sans system prompt)
- [ ] Executer le controle #09 (FPR baseline)
- [ ] Comparer les ASR mesures aux ASR projetes et documenter les ecarts

## Priorite 3 : Expliciter les estimations

Pour chaque fiche, remplacer les [ESTIMATION] non sourcees par :

- la source si elle existe, OU
- un marqueur explicite [ESTIMATION : base sur le raisonnement suivant ...]

---

# CHANGELOG

| Date | Modification | Auteur |
|------|--------------|--------|
| 2026-05-21 | Creation du document. Introduction de delta-0. Protocole anti-confabulation. Audit des fiches #01-#11. | Fab / Claude |
| 2026-05-21 | Extraction de la Partie 1 (protocole anti-confabulation) vers le skill `anti-confabulation`. Conservation des Parties 2 a 4 dans ce journal. | Claude |
| 2026-05-21 | Audit anti-confabulation complet de la fiche #08 v3 (texte integral). Artefact : `research_notes/AEGIS-AUDIT-FICHE-08_anti-confabulation.md`. ITR 11/32, verdict NON CONFORME, 9 dettes ouvertes. | Claude |
| 2026-05-21 | Verification scoped des references (bibliography-maintainer scoped). Artefact : `research_notes/AEGIS-SCOPED-VERIF_fiche08-refs_2026-05-21.md`. Constat : "Tokens Deep" est de Qi et al. (P018), pas Wei et al. (sections 2.2 et 3.4 de ce journal portent la meme erreur, NON corrigees ici, en attente de validation). Re-attribution 100 exemples vers Qi et al. 2023. Schulhoff = 2023. | Claude |
