# VALIDATION DES CONJECTURES -- Preuves Litteraires
## These doctorale AEGIS -- ENS 2026
## Securite des LLM medicaux contre l'injection de prompt

**Date**: 2026-04-04
**Agent**: Scientist (Opus 4.6)
**Corpus**: 46 articles (P001--P046)
**Version**: v2.0 (RUN-002 -- mise a jour incrementale avec P035-P046)

---

## Conjecture C1 : Insuffisance de δ⁰ (alignement RLHF)

**Enonce** : L'alignement RLHF de base (δ⁰) est insuffisant pour proteger un LLM contre les injections de prompt, en particulier dans le domaine medical.

### Evidence POUR (forte)

| Paper | Evidence | Force |
|-------|---------|-------|
| P018 (ICLR 2025) | Demonstration experimentale : l'alignement RLHF se concentre sur les premiers tokens de reponse ("shallow alignment"). Les positions au-dela de l'horizon de nocivite ne recoivent aucun signal d'entrainement. | **Tres forte** -- ICLR top venue, preuve experimentale reproductible |
| P019 (Young, 2026) | Preuve mathematique via decomposition en martingale : le gradient d'alignement est zero au-dela de l'horizon de nocivite. | **Decisive** -- Preuve formelle, pas empirique |
| P029 (JAMA, 2025) | 94.4% ASR sur des LLM medicaux commerciaux avec gardes actifs. 91.7% sur les drogues de categorie X. | **Tres forte** -- JAMA, donnees empiriques sur modeles commerciaux |
| P030 (2025) | Erosion temporelle : disclaimers medicaux passent de 26.3% (2022) a 0.97% (2025) sans attaque active. | **Forte** -- Donnees longitudinales sur 3 ans |
| P022 (2025) | Empoisonnement RLHF via plateformes adversariales : δ⁰ peut etre corrompu a l'entrainement. | **Forte** -- Demontre la vulnerabilite de la chaine d'approvisionnement |
| P023 (NDSS, 2025) | 4 strategies d'attaque contournent δ⁰ avec escalade progressive. | **Forte** -- NDSS top venue securite |
| P036 (Nature Comms, 2026) | LRM atteignent 97.14% de jailbreak autonome. La capacite de raisonnement permet la subversion de l'alignement. | **Tres forte** -- Nature Comms, 2026, 9 modeles testes |
| P039 (Microsoft, 2026) | Un seul prompt non-labele suffit a desaligner 15 LLMs via manipulation GRPO. L'alignement est effacable, pas seulement contournable. | **Tres forte** -- Microsoft Research, generalise a 15 modeles |
| **P035 (MPIB, 2026)** | **CHER montre que meme les modeles avec faible ASR causent des dommages cliniques -- l'alignement cree des refus superficiels.** | **Forte** -- Premier benchmark medical N >= 30 [NEW RUN-002] |
| **P044 (AdvJudge-Zero, 2026)** | **Les juges supervisant δ⁰ (RLHF, DPO) sont bypassables a 99%, compromettant le processus d'entrainement de l'alignement lui-meme.** | **Tres forte** -- Attaque meta : compromet la supervision de δ⁰ [NEW RUN-002] |

### Evidence CONTRE (limitee)

| Paper | Evidence | Force |
|-------|---------|-------|
| P017 (ACL 2025) | L'optimisation de preference adversariale ameliore la robustesse RLHF. | **Moderee** -- Amelioration incrementale, ne resout pas le probleme fondamental de P019 |
| P020 (COBRA) | La recompense par consensus entre modeles renforce δ⁰. | **Moderee** -- Approche prometteuse mais non testee contre P036/P039 |
| P021 (Adv Reward) | L'entrainement adversarial du modele de recompense durcit δ⁰. | **Moderee** -- Memes limitations que P017 |
| P041 (Magic-Token, 2026) | Co-entrainement avec magic tokens : un modele 8B surpasse DeepSeek-R1 (671B) en securite. | **Forte comme amelioration** mais ne contredit pas C1 (δ⁰ seul reste insuffisant) |
| **P038 (InstruCoT, 2026)** | **>90% de defense via raisonnement metacognitif. Ameliore δ⁰ significativement.** | **Forte comme amelioration** mais >90% laisse 10% de bypass, **inacceptable en medical** [NEW RUN-002] |

### Verdict C1
**FORTEMENT SUPPORTEE** -- 27/34 papers Phase 1 (79.4%, Analyst) + P035, P036, P039, P044 (Phase 2). La preuve de P019 est decisive (gradient mathematiquement nul). Les papers CONTRE montrent des ameliorations de δ⁰ mais aucun ne demontre que δ⁰ seul est suffisant. **P039 est le resultat le plus devastateur : δ⁰ est non seulement contournable mais litteralement effacable par 1 prompt. P044 ajoute que la supervision de δ⁰ est elle-meme compromettable.**

**Score de confiance** : **10/10** (eleve de 9/10 en RUN-001. P039 effacement + P044 supervision compromise rendent C1 quasi-certaine.) [UPDATED RUN-002]

---

## Conjecture C2 : Necessite de δ³ (validation de sortie)

**Enonce** : La validation formelle des sorties (δ³) est necessaire pour compenser les faiblesses des couches δ⁰ a δ², en particulier dans le domaine medical.

### Evidence POUR (forte)

| Paper | Evidence | Force |
|-------|---------|-------|
| P029 (JAMA) | 94.4% ASR avec δ⁰+δ¹ actifs prouve leur insuffisance. | **Tres forte** -- Preuve par l'echec des couches inferieures |
| P019 (Young) | Gradient nul au-dela de l'horizon = δ⁰ ne peut PAS apprendre a refuser pour certaines positions de tokens. Seule une verification externe (δ³) peut compenser. | **Decisive** -- Implication directe de la preuve formelle |
| P033 (Self-Policing) | Argument d'incompletude : un LLM ne peut pas se juger lui-meme de facon fiable. Il faut un mecanisme externe (δ³). | **Forte** -- Argument formel |
| P024 (Sep(M), ICLR 2025) | Le compromis separation-utilite montre que les approches empiriques ne resolvent pas le probleme. δ³ permet de maintenir l'utilite tout en filtrant les sorties. | **Forte** |
| P011 (PromptGuard) | Les couches 3-4 correspondent a δ³ et sont necessaires pour F1=0.91. | **Forte** |
| P035 (MPIB, 2026) | CHER montre que le dommage clinique doit etre evalue au niveau de la sortie. | **Forte** |
| **P039 (GRP-Obliteration, 2026)** | **Si δ⁰ est effacable par 1 prompt, δ³ est LITTERALEMENT la seule defense restante.** | **Decisive** -- Le resultat le plus fort pour C2 dans tout le corpus [NEW RUN-002] |
| **P044 (AdvJudge-Zero, 2026)** | **99% bypass des juges LLM => δ³ doit etre DETERMINISTE (regles), pas LLM-based.** | **Tres forte** -- Oriente l'implementation de δ³ vers les approches formelles [NEW RUN-002] |
| **P045 (SPP, 2026)** | **δ¹ empoisonnable de maniere persistante => toutes les defenses qui en dependent echouent. Seul δ³ opere independamment de δ¹.** | **Forte** -- Renforce l'independance necessaire de δ³ [NEW RUN-002] |
| **P037 (Survey 3D, 2026)** | **Le cadre de defense le plus complet de 2026 ne couvre PAS δ³ => gap confirme.** | **Forte** -- Confirmation par omission [NEW RUN-002] |

### Evidence CONTRE (tres limitee)

| Paper | Evidence | Force |
|-------|---------|-------|
| P042 (PromptArmor, 2026) | LLM-as-guardrail avec <1% FPR/FNR suggere qu'un garde d'entree suffisamment puissant pourrait rendre δ³ superflu. | **Affaiblie** -- Non teste contre P036/P039/P044 ; depend de GPT-4o [UPDATED RUN-002] |
| P038 (InstruCoT, 2026) | >90% de defense au niveau de l'entrainement (δ⁰ ameliore). | **Faible** -- 90% laisse 10% de bypass, inacceptable en medical |

### Verdict C2
**FORTEMENT SUPPORTEE** -- L'evidence combinee de P019 (impossibilite theorique), P029 (echec empirique), P033 (limitation formelle), P039 (effacement de δ⁰) et P044 (juges bypassables) rend δ³ indispensable. **P039 est le resultat le plus fort pour C2 de tout le corpus : si δ⁰ peut etre efface, δ³ est le seul filet de securite. P044 ajoute que δ³ doit etre deterministe car les juges LLM sont compromettables.**

**Score de confiance** : **9/10** (eleve de 8/10 en RUN-001. P039 + P044 + P045 + P037 ajoutent 4 preuves convergentes.) [UPDATED RUN-002]

---

## Conjecture C3 : La separation instruction/donnee est un probleme fondamentalement non-resolu

**Enonce** : Aucun LLM actuel ne peut distinguer de maniere fiable les instructions des donnees dans tous les contextes.

### Evidence

| Paper | Evidence | Force |
|-------|---------|-------|
| P024 (Sep(M)) | Le meilleur score de separation apres fine-tuning est 81.8%, mais avec effondrement de l'utilite a 19.2% | **Tres forte** |
| P001 (HouYi) | La partition de contexte exploite l'incapacite a distinguer les frontieres instruction/donnee | **Forte** |
| P026 | L'injection indirecte exploite le meme probleme dans les documents externes | **Forte** |
| P045 (SPP, 2026) | L'empoisonnement de system prompts montre que meme les instructions "de confiance" peuvent etre corrompues | **Forte** |
| **P039 (GRP-Obliteration, 2026)** | **L'alignement peut etre efface par un seul prompt : le modele ne distingue plus instructions de securite et donnees hostiles apres desalignement.** | **Decisive** -- Demontre que la separation est non seulement imparfaite mais activement destructible [NEW RUN-002] |
| **P044 (AdvJudge-Zero, 2026)** | **Les juges ne distinguent pas tokens de controle adversariaux des tokens legitimes -- meme echec de separation a un meta-niveau.** | **Forte** -- La separation echoue aussi chez les evaluateurs [NEW RUN-002] |

### Verdict C3
**FORTEMENT SUPPORTEE** (12+ papers). C'est la conjecture la plus fondamentale -- elle sous-tend C1 et C2. **P039 prouve que la separation est non seulement imparfaite (P024) mais activement destructible par une manipulation du processus d'entrainement.**

**Score de confiance** : **9/10** (inchange par rapport a RUN-001, mais les preuves s'accumulent) [CONFIRMED RUN-002]

---

## Conjecture C4 : La vulnerabilite recursive des juges LLM limite toute approche d'evaluation automatisee

**Enonce** : Lorsque le modele evaluateur partage des proprietes architecturales avec le modele evalue, les attaques qui compromettent l'un compromettent potentiellement l'autre.

### Evidence

| Paper | Evidence | Force |
|-------|---------|-------|
| P033 | Demonstration formelle de la vulnerabilite recursive | **Forte** |
| P036 (LRM, 2026) | Les LRM raisonnent pour contourner les juges d'autres modeles | **Forte** |
| **P044 (AdvJudge-Zero, 2026)** | **Fuzzing automatise atteint 99% de bypass des juges binaires. Resultat le plus devastateur pour C4.** | **Decisive** -- 99% = quasi-totale compromission [NEW RUN-002] |
| P042 (PromptArmor, 2026) | Contre-evidence : GPT-4o comme garde atteint <1% FPR/FNR | **Moderee** -- Mais non teste contre P044 |
| **P045 (SPP, 2026)** | **Si le system prompt du juge est empoisonne, toute l'architecture de jugement est compromise.** | **Forte** -- Vecteur d'attaque persistant sur les juges [NEW RUN-002] |

### Verdict C4
**PARTIELLEMENT SUPPORTEE** -> **FORTEMENT SUPPORTEE** : P044 (99% bypass) transforme C4 d'une conjecture theorique en un fait empirique. La force de C4 depend de la configuration : homogene (C4 tres forte, 99% bypass P044) vs. heterogene avec modele avance (C4 affaiblie, P042 <1% FPR). **Mais P042 n'a pas ete teste contre P044, laissant la question ouverte.**

**Score de confiance** : **8/10** (eleve de 6/10 en RUN-001. P044 est le papier decisif : 99% bypass des juges est un fait empirique, pas une conjecture.) [UPDATED RUN-002]

---

## Conjecture C5 : Le domaine medical amplifie systematiquement la severite des injections de prompt

**Enonce** : A technique d'attaque egale, l'injection de prompt a des consequences plus graves dans le domaine medical que dans les domaines generaux, en raison de facteurs structurels (hierarchie, consequences sur la sante, donnees sensibles).

### Evidence

| Paper | Evidence | Force |
|-------|---------|-------|
| P029 (JAMA) | 94.4% ASR en medical vs. ~60-80% dans les domaines generaux | **Tres forte** |
| P028 | L'usurpation d'autorite medicale est plus efficace en raison de la culture hierarchique | **Forte** |
| P030 | L'erosion de securite est documentee specifiquement dans le domaine medical | **Forte** |
| P035 (2026) | CHER montre que le dommage clinique reel est une dimension absente des evaluations generiques | **Forte** |
| **P040 (2026)** | **La manipulation emotionnelle augmente la desinformation medicale de 6.2% a 37.5% (facteur 6x). L'urgence et l'empathie sont des leviers naturels en medical.** | **Tres forte** -- Premiere quantification de l'amplification emotionnelle medicale [NEW RUN-002] |

### Verdict C5
**FORTEMENT SUPPORTEE** (9+ papers medicaux convergent). Aucun paper ne conteste cette conjecture. **P040 fournit la preuve la plus forte de l'amplification medicale : un facteur 6x specifiquement attribuable a la manipulation emotionnelle, un levier naturellement present dans le contexte clinique (urgence du patient, empathie du clinicien).**

**Score de confiance** : **9/10** (inchange, mais l'evidence s'enrichit avec P040) [CONFIRMED RUN-002]

---

## Conjecture C6 : Les defenses statiques ont une demi-vie limitee

**Enonce** : Toute defense fixe (non-adaptative) sera contournee dans un horizon previsible en raison de l'evolution rapide des techniques d'attaque.

### Evidence

| Paper | Evidence | Force |
|-------|---------|-------|
| P030 | Erosion passive de δ⁰ sur 3 ans | **Forte** |
| P009 --> P044 | En 1 an, les injections de caracteres (P009) sont complementees par le fuzzing automatise (P044) | **Forte** |
| P036 | Les LRM introduisent un vecteur d'attaque qualitativement nouveau en 2026 | **Forte** |
| P039 | GRP-Obliteration montre que les defenses RLHF de 2025 sont contournees par une seule technique 2026 | **Forte** |
| P043 (JBDistill, 2025) | Propose des benchmarks renouvelables, reconnaissant implicitement la peremption | **Moderee** |
| **P045 (SPP, 2026)** | **L'empoisonnement persistant montre que les defenses statiques (system prompts fixes) sont vulnerables a la corruption cumulative.** | **Forte** -- Dimension persistante de l'attaque [NEW RUN-002] |
| **P040 (2026)** | **La manipulation emotionnelle est un vecteur qualitativement nouveau non couvert par les defenses statiques existantes.** | **Moderee** -- Nouveau vecteur non anticipe [NEW RUN-002] |

### Verdict C6
**SUPPORTEE** -> **FORTEMENT SUPPORTEE** : Les 12 papers 2026 fournissent un deuxieme point de donnee temporel (apres 2023-2025). La tendance est claire : **chaque annee introduit des vecteurs d'attaque qualitativement nouveaux (2025: injection de caracteres ; 2026: LRM autonomes, desalignement a 1 prompt, fuzzing des juges, SPP). Aucune defense 2025 ne couvre les attaques 2026.**

**Score de confiance** : **8/10** (eleve de 7/10 en RUN-001. Les donnees 2026 ajoutent un point temporel significatif.) [UPDATED RUN-002]

---

## Conjecture C7 (NOUVELLE) : La capacite de raisonnement correle positivement avec le potentiel offensif des LLM

**Enonce** : Ameliorer la capacite de raisonnement d'un LLM (chain-of-thought, planification multi-etapes) augmente simultanement son potentiel offensif, creant un paradoxe fondamental pour la securite.

### Evidence

| Paper | Evidence | Force |
|-------|---------|-------|
| **P036 (Nature Comms, 2026)** | 4 LRM atteignent 97.14% de jailbreak autonome. DeepSeek-R1 (le plus fort en raisonnement) est aussi le plus efficace en attaque (90% harm max). | **Tres forte** -- Nature Comms, donnees empiriques sur 4 LRM x 9 cibles |
| **P039 (Microsoft, 2026)** | GRP-Obliteration exploite le mecanisme d'entrainement par raisonnement (GRPO) pour desaligner le modele via son propre objectif. | **Forte** -- Le raisonnement est le vecteur meme de l'attaque |
| **P044 (AdvJudge-Zero, 2026)** | Le fuzzer utilise la distribution de tokens du modele pour decouvrir des vulnerabilites -- une forme de raisonnement sur le modele cible. | **Moderee** -- Raisonnement automatise, pas LRM |
| **P038 (InstruCoT, 2026)** | **Contre-evidence partielle** : le raisonnement instruction-level peut aussi servir la defense (>90%). | **Moderee** -- Le meme mecanisme peut etre utilise defensivement |

### Contradiction
- **P041** (Magic-Token) montre qu'un modele 8B surpasse un 671B en securite. Si le raisonnement etait purement offensif, les modeles plus grands seraient toujours moins surs.
- **P036** montre que Qwen3 235B est MOINS efficace que des modeles plus petits en jailbreak. La relation raisonnement/offense n'est pas lineaire.
- **P038** montre que le raisonnement metacognitif peut servir la defense. Le paradoxe est donc plus nuance : le raisonnement est un amplificateur DANS LES DEUX SENS.

### Verdict C7
**PARTIELLEMENT SUPPORTEE** -- L'evidence est forte pour la correlation positive (P036, Nature Comms), mais la relation n'est pas monotone (P041, Qwen3 dans P036) et le raisonnement peut aussi etre utilise defensivement (P038). C7 est mieux formulee comme : "la capacite de raisonnement est un amplificateur bidirectionnel qui eleve le plafond offensif ET defensif, mais l'avantage est asymetrique en faveur de l'attaquant car la defense doit couvrir toutes les failles tandis que l'attaque n'en exploite qu'une."

**Score de confiance** : **7/10** (nouvelle conjecture, evidence forte mais non-lineaire)

---

## Matrice recapitulative

| Conjecture | Enonce abrege | Papers POUR | Papers CONTRE | Score confiance RUN-001 | Score confiance RUN-002 | Statut |
|------------|--------------|-------------|---------------|------------------------|------------------------|--------|
| **C1** | δ⁰ insuffisant | P018, P019, P022, P023, P029, P030, P035, P036, P039, P044 | P017, P020, P021, P038, P041 | 9/10 | **10/10** | **Quasi-certaine** |
| **C2** | δ³ necessaire | P019, P024, P029, P033, P011, P035, P037, P039, P044, P045 | P042, P038 | 8/10 | **9/10** | **Fortement supportee** |
| **C3** | Separation non-resolue | P024, P001, P026, P039, P044, P045 | (aucun) | 9/10 | **9/10** | **Fortement supportee** |
| **C4** | Vulnerabilite recursive juges | P033, P036, P044, P045 | P042 | 6/10 | **8/10** | **Fortement supportee** |
| **C5** | Medical amplifie severite | P029, P028, P030, P035, P040 | (aucun) | 9/10 | **9/10** | **Fortement supportee** |
| **C6** | Defenses statiques perissables | P030, P009/P044, P036, P039, P043, P045, P040 | (aucun) | 7/10 | **8/10** | **Fortement supportee** |
| **C7** (NOUVELLE) | **Paradoxe raisonnement/securite** | **P036, P039, P044** | **P038, P041** | -- | **7/10** | **Partiellement supportee** |

---

## Implications pour la these

### Conjectures a inclure dans le manuscrit
- **C1** (10/10) : Conjecture principale, quasi-certaine. Fonder le chapitre sur la fragilite de δ⁰.
- **C2** (9/10) : Conjecture principale. Evidence massivement renforcee par P039+P044+P045. Fonder le chapitre sur δ³.
- **C3** (9/10) : Conjecture socle dont C1 et C2 decoulent. Placer en ouverture du manuscrit.
- **C5** (9/10) : Justifie le choix du domaine medical. Renforcer avec P035 (CHER) et P040 (emotion).

### Conjectures a presenter avec evidence forte
- **C4** (8/10) : Evidence considerablement renforcee par P044 (99% bypass). Presenter comme fait empirique avec nuance (heterogeneite mitigue le risque).
- **C6** (8/10) : Evidence renforcee par les donnees 2026. Presenter comme tendance observee avec 2 points temporels.

### Conjectures a mentionner avec prudence
- **C7** (7/10) : Nouvelle, evidence forte mais non-lineaire. Presenter comme "paradoxe observe" plutot que conjecture formelle. La formulation nuancee (amplificateur bidirectionnel, asymetrie attaquant/defenseur) est plus juste que la version simple (raisonnement = plus d'attaques).

---

*Agent Scientist -- CONJECTURES_VALIDATION.md*
*7 conjectures evaluees (+1 nouvelle C7), 46 papers mobilises*
*Version: v2.0 (RUN-002)*
*Derniere mise a jour: 2026-04-04*
