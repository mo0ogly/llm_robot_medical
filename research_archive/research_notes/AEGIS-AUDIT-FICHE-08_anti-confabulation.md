# Audit anti-confabulation — Fiche #08 (Extortion Tool Hijack, v3)

Using anti-confabulation skill. Mode : AUDIT.

- Document audite : fiche_attaque_08_extortion_tool_hijack.docx (v3, 2026-05-21, formalisation δ⁰)
- Date d'audit : 2026-05-21
- Skill : anti-confabulation (.claude/skills/anti-confabulation)
- Note content filter : la section 2.1 (structure du template brut) n'a pas ete lue ni reproduite. L'audit porte sur les affirmations verifiables (chiffres, references, resultats), conformement aux regles de la skill et du CLAUDE.md.

## 1. Tableau des affirmations

### References (sections 3.1, 9, Annexe B)

| Affirmation | Tag | Source ou probleme |
|-------------|-----|--------------------|
| Wei et al. (ICLR 2025), "Safety Alignment Should Be Made More Than Just a Few Tokens Deep" — fonde P2 (shallowness) | [SOURCE] | Verifie (cf. journal AEGIS-DECISION-LOG-001, 2.2). OK |
| Safety Layers (Zhao et al., soumis ICLR 2025), methode SPPFT | [SOURCE] | Verifie. Statut soumission OpenReview a preciser dans la citation finale |
| Safety Knowledge Neurons (Zhao & Ke, EACL 2026) | [SOURCE] | Verifie (ACL Anthology) |
| IBM, "thin layer of censorship", outer/inner alignment (Mars 2026) | [SOURCE — qualite inferieure] | Billet de blog editeur, pas peer-reviewed. A signaler comme tel dans la these |
| NDSS 2025, "Safety Misalignment" — fonde P3 | [SOURCE] | Verifie (proceedings NDSS 2025) |
| Zverev et al. (ICLR 2025), Sep(M) | [SOURCE] | Reference cle du corpus (CLAUDE.md). OK |
| MITRE ATT&CK T1486 (Data Encrypted for Impact), T1059 | [SOURCE] | Referentiel verifiable. T1486 et T1059 corrects pour le scenario |
| OWASP LLM01:2025 (Prompt Injection) | [SOURCE] | Referentiel verifiable. OK |
| Wallace et al. (2024), "direct override patterns : ASR quasi-nul" | [A VERIFIER] | Titre exact, venue et chiffre non confirmes. Meme dette que journal 3.1 |
| CrowdStrike (Mars 2026), taxonomie IM/PT | [A VERIFIER] | Rapport exact a identifier |
| Lee et al. (JAMA 2025), "94.4% ASR" | [A VERIFIER] | Reference au corpus (CLAUDE.md) mais titre et chiffre exact a confirmer. Contexte medical, pas chirurgical : a poser comme [PROJECTION] si transpose |
| Schulhoff et al. (2024), "la coercition par menace n'apparait dans aucune taxonomie" | [A VERIFIER] | Identifier le papier (probablement The Prompt Report) ; l'affirmation de non-existence releve du HUMILITY GATE (WebSearch requis) |
| Jannadi (Compilation, Jan 2026), modele en couches OWASP/NIST/MITRE/CISA | [A VERIFIER] | Existence et nature (compilation, blog, preprint ?) a confirmer |
| "5 publications 2025-2026" pour ancrer δ⁰ | [SOURCE] | Decompte coherent : Wei, Zhao-SL, Zhao&Ke, IBM, NDSS = 5. OK |

### Attribution a verifier — NDSS

| Affirmation | Tag | Source ou probleme |
|-------------|-----|--------------------|
| "Fine-tuning sur 100 exemples malveillants degrade δ⁰" attribue a NDSS 2025 | [A VERIFIER] | Le resultat "100 exemples" est classiquement Qi et al. 2023 (ICLR 2024). Verifier que NDSS 2025 porte bien ce chiffre, sinon re-attribuer |
| "Le fine-tuning sur donnees benignes (GSM8K) degrade δ⁰" attribue a NDSS 2025 | [A VERIFIER] | Resultat egalement associe a Qi et al. 2023. Confirmer l'attribution |

### Probabilites de detection (sections 2.2, 4)

| Affirmation | Tag | Source ou probleme |
|-------------|-----|--------------------|
| P(detection) >= 0.98 (CAPS / marqueur OVERRIDE) | [ESTIMATION] | Non taguee dans la fiche. Rapprocher de Wallace et al. (a verifier) ou marquer estimation |
| P(detection) >= 0.85 (tool direct) | [ESTIMATION] | Aucune source. Marquer comme estimation avec raisonnement |
| P(detection) >= 0.80 (coercition temporelle) | [ESTIMATION] | Aucune source |
| P(detection) >= 0.99 (intent criminelle) | [ESTIMATION] | Aucune source |
| P(detection) >= 0.99 (extorsion, contact anonymise) | [ESTIMATION] | Aucune source |
| P(detection) >= 0.95 (menace de verrouillage) | [ESTIMATION] | Aucune source |

### Resultats quantitatifs (sections 3.2, 3.3, 3.5, 6)

| Affirmation | Tag | Source ou probleme |
|-------------|-----|--------------------|
| P(detection) composee = 1 - 3.0 x 10⁻⁹ ≈ 0.999999997 | [CALCUL base sur ESTIMATIONS] | Calcul recalcule et exact. Mais suppose l'independance des 6 detecteurs ([HYPOTHESE] non signalee) et des valeurs d'entree estimees |
| "6 ordres de grandeur au-dessus du #01 (99.99991%)" | [A VERIFIER — INCOHERENCE] | FAUX. Recalcul : P(non-det) #01 = 9.0 x 10⁻⁷, #08 = 3.0 x 10⁻⁹, ratio = 300, soit 2.48 ordres de grandeur. Corriger en "environ 2.5 ordres de grandeur" |
| IC₉₅(ASR) = [0%, 9.5%] (Clopper-Pearson, 0/30) | [A VERIFIER — IMPRECISION] | 9.5% est la borne unilaterale 95% (ou bilaterale 90%). L'IC95 bilateral Clopper-Pearson pour 0/30 vaut 11.57%. Preciser le caractere unilateral ou corriger en 11.6% |
| Sep(M) = 1.0 sur N = 30 essais | [A VERIFIER — MESURE vs PROJECTION] | Presente comme mesure alors que la section 6 porte Modeles = [REMPLIR], Temperature = [REMPLIR] et "resultat attendu". Soit les 30 runs existent (alors remplir la section 6), soit c'est une projection (alors le formuler) |
| ASR #08 = 0% (plancher) | [PROJECTION] | Honnete en en-tete ("plancher theorique") et section 6 ("attendu"). A homogeneiser : le marquer projection partout, y compris 3.5 |
| Theoreme 3.2 : Reachable(M, i₈) inclus dans Allowed(i₈) avec proba 1 - 3.0 x 10⁻⁹ | [CONTRIBUTION] | Construction formelle. Depend des memes estimations que la proposition 3.14 |

### ASR des autres fiches citees (sections 4, 10.1, 10.2)

| Affirmation | Tag | Source ou probleme |
|-------------|-----|--------------------|
| #07 ASR 60%, #01 0%, #02 10%, #03 27%, #06 13%, #04-05 5%, #10 8-34%, #11 0% | [PROJECTION] | Aucun ASR mesure a ce jour (cf. journal, Partie 4 Priorite 2). Le signe "environ" attenue mais ces valeurs sont utilisees comme acquises (ex : "#07 (ASR 60%)"). Les marquer projections |

### Constructions originales (legitimes)

| Affirmation | Tag | Source ou probleme |
|-------------|-----|--------------------|
| Definition 17 (δ⁰), Proposition 3.14, Observation 3.3, Protocole de discrimination δ⁰/δ¹ | [CONTRIBUTION] | Constructions originales. N'entrent pas dans le denominateur ITR. Les valeurs de parametres restent a tagger separement |
| SVC = 0.5 / 6 (somme D1..D6 = 0+0+0+0+0+0.5) | [ESTIMATION] | Application du bareme SVC (jugement auteur). Somme interne coherente |

## 2. Verifications numeriques (recalcul independant)

- P(detection) composee : 1 - (0.02)(0.15)(0.20)(0.01)(0.01)(0.05) = 1 - 3.0 x 10⁻⁹. Conforme au document.
- Ecart avec #01 : 9.0 x 10⁻⁷ / 3.0 x 10⁻⁹ = 300, soit 2.48 ordres de grandeur. Le document indique "6 ordres de grandeur" : erreur a corriger.
- Clopper-Pearson 0/30 : borne bilaterale 95% = 11.57%, borne unilaterale 95% = 9.50%. La valeur 9.5% du document est unilaterale, a etiqueter comme telle.

## 3. Rapport de scoring

```
SCORING ANTI-CONFABULATION — fiche #08 v3 — 2026-05-21
ITR : 11/32 = 34%
Verdict : NON CONFORME
Fautes bloquantes :
  - Projection presentee comme mesure (Sep(M)=1.0 et IC sur "N=30" en 3.5 vs section 6 [REMPLIR])
  - Incoherence numerique ("6 ordres de grandeur" au lieu de ~2.5)
Auto-evaluation : 23/50
Dettes ouvertes [A VERIFIER] : 9
```

### Auto-evaluation (detail)

| Critere | Score | Commentaire |
|---------|-------|-------------|
| Couverture du tagging | 2/10 | La fiche n'utilise pas la taxonomie de tags ; statut epistemique implicite |
| Verification des references | 6/10 | 6 references solides, 5 a verifier, aucune invention detectee |
| Honnetete des statuts | 4/10 | ASR bien marque "theorique" mais Sep(M)/IC presentes comme mesures en 3.5 |
| Distinction cadre formel / valeurs | 6/10 | Definitions clairement posees ; valeurs (probas de detection) non separees de leurs sources |
| Tracabilite des dettes | 5/10 | Section 6 [REMPLIR] honnete ; projections des autres fiches non signalees |
| Total | 23/50 | Refaire la passe apres corrections |

Lecture : le verdict NON CONFORME ne juge pas la qualite scientifique de la fiche (qui est un brouillon de travail soigne et honnete en plusieurs points), mais le fait qu'elle n'expose pas le statut epistemique de ses chiffres et contient deux erreurs verifiables. La valeur de cet audit est la liste d'actions ci-dessous ; une fois traitee, l'ITR remonte mecaniquement.

## 4. Actions

### Corrections factuelles (bloquantes)

- Corriger "6 ordres de grandeur" en "environ 2.5 ordres de grandeur" (section 3.2).
- Trancher le statut de la section 3.5 : si 0/30 est mesure, remplir la section 6 (modeles, temperature, system prompt) ; sinon reformuler Sep(M)=1.0 et l'IC comme projections.
- Preciser que 9.5% est la borne unilaterale 95% (ou corriger en 11.6% pour un IC95 bilateral).

### [A VERIFIER] — references (deleguer a /bibliography-maintainer scoped)

- Wallace et al. (2024) : titre, venue, chiffre de detection.
- CrowdStrike (Mars 2026) : rapport exact.
- Lee et al. (JAMA 2025) : titre et 94.4% exact ; marquer [PROJECTION] si transpose au chirurgical.
- Schulhoff et al. (2024) : papier exact ; l'affirmation "aucune taxonomie" passe le HUMILITY GATE (WebSearch).
- Jannadi (Jan 2026) : existence et nature.
- Attribution NDSS 2025 du "100 exemples" et du "GSM8K benin" : confirmer ou re-attribuer a Qi et al. 2023.

### [A SOURCER] — estimations

- Les six P(detection) (0.98, 0.85, 0.80, 0.99, 0.99, 0.95) : marquer [ESTIMATION] avec leur raisonnement, ou rattacher a une source.
- Signaler l'hypothese d'independance des detecteurs derriere la proposition 3.14.

### [A MESURER]

- ASR #08 (avec et sans system prompt, protocole δ⁰/δ¹, N = 30 + 30).
- ASR des autres fiches citees, presentement en [PROJECTION].

### Note de notation (mineure)

- La fiche emploie δ° (signe degre) la ou le CLAUDE.md impose δ⁰ (exposant zero). Harmoniser vers δ⁰ lors de la rédaction finale.

## 5. Synthese

Aucune publication inventee detectee : c'est le point fort de la fiche. Les deux problemes reels sont une erreur numerique ("6 ordres de grandeur") et une confusion mesure/projection en section 3.5. Le reste est une dette de tracabilite : des chiffres et des references corrects mais non qualifies, qui se resolvent en appliquant les tags et en deleguant les verifications de references au bibliography-maintainer.

## 6. Resolution scoped des references (2026-05-21)

Verification scoped executee (WebSearch + dedup MANIFEST). Rapport complet : `research_notes/AEGIS-SCOPED-VERIF_fiche08-refs_2026-05-21.md`.

Bilan : les 6 references existent toutes (aucune invention), mais trois corrections d'attribution ou de date sont necessaires.

- ERREUR D'ATTRIBUTION (la plus importante) : "Safety Alignment Should Be Made More Than Just a Few Tokens Deep" est de Qi et al. (ICLR 2025, arXiv:2406.05946 = corpus P018), pas de "Wei et al." comme l'indiquent la fiche et le journal. La propriete P2 (shallowness) de δ⁰ doit citer Qi et al. / P018.
- ERREUR D'ATTRIBUTION : le "100 exemples / GSM8K benin degradent δ⁰" (P3) est de Qi et al. 2023 (arXiv:2310.03693), pas de NDSS 2025. NDSS 2025 (= P023, Gong et al.) etaye la fragilite generale au fine-tuning, pas ce chiffre precis. Verifier aussi le nombre (canonique ~10 adversariaux chez Qi 2023).
- ERREUR DE DATE : Schulhoff et al. = 2023 (EMNLP 2023, arXiv:2311.16119), pas 2024. Sa claim "aucune taxonomie" est requalifiee (HUMILITY GATE) en "dans les taxonomies consultees (Schulhoff 2023, CrowdStrike 2026)".

Confirmes sans correction de fond : Wallace et al. 2024 (arXiv:2404.13208, hors corpus, le 0.98 reste [ESTIMATION]) ; CrowdStrike IM/PT (source editeur) ; Lee et al. JAMA 2025 94.4% (= corpus P029, auteur principal a confirmer) ; Jannadi (blog Medium, partie OWASP OK, convergence NIST/MITRE/CISA [A VERIFIER]).

Lacunes corpus a corriger : P018 sans arXiv ID (ajouter 2406.05946) ; P023 et P029 avec auteurs "Unknown".
