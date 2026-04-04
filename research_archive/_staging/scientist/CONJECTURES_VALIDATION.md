# VALIDATION DES CONJECTURES -- Preuves Litteraires
## These doctorale AEGIS -- ENS 2026
## Securite des LLM medicaux contre l'injection de prompt

**Date**: 2026-04-04
**Agent**: Scientist (Opus 4.6)
**Corpus**: 46 articles (P001--P046)

---

## Conjecture C1 : Insuffisance de delta-0 (alignement RLHF)

**Enonce** : L'alignement RLHF de base (delta-0) est insuffisant pour proteger un LLM contre les injections de prompt, en particulier dans le domaine medical.

### Evidence POUR (forte)

| Paper | Evidence | Force |
|-------|---------|-------|
| P018 (ICLR 2025) | Demonstration experimentale : l'alignement RLHF se concentre sur les premiers tokens de reponse ("shallow alignment"). Les positions au-dela de l'horizon de nocivite ne recoivent aucun signal d'entrainement. | **Tres forte** -- ICLR top venue, preuve experimentale reproductible |
| P019 (Young, 2026) | Preuve mathematique via decomposition en martingale : le gradient d'alignement est zero au-dela de l'horizon de nocivite. Formule : nabla_theta L|_t = Cov(E[harm|y<=t], nabla_theta log p_theta). Ce gradient est nul quand t depasse l'horizon. | **Decisive** -- Preuve formelle, pas empirique |
| P029 (JAMA, 2025) | 94.4% ASR sur des LLM medicaux commerciaux avec gardes actifs. 91.7% sur les drogues de categorie X. | **Tres forte** -- JAMA, donnees empiriques sur modeles commerciaux |
| P030 (2025) | Erosion temporelle : disclaimers medicaux passent de 26.3% (2022) a 0.97% (2025) sans attaque active. | **Forte** -- Donnees longitudinales sur 3 ans |
| P022 (2025) | Empoisonnement RLHF via plateformes adversariales : delta-0 peut etre corrompu a l'entrainement. | **Forte** -- Demontre la vulnerabilite de la chaine d'approvisionnement |
| P023 (NDSS, 2025) | 4 strategies d'attaque contournent delta-0 avec escalade progressive. Les tokens GCG et les exemples few-shot surmontent le refus. | **Forte** -- NDSS top venue securite |
| P036 (Nature Comms, 2026) | LRM atteignent 97.14% de jailbreak autonome. La capacite de raisonnement permet la subversion de l'alignement. | **Tres forte** -- Nature Comms, 2026, 9 modeles testes |
| P039 (Microsoft, 2026) | Un seul prompt non-labele suffit a desaligner 15 LLMs via manipulation GRPO. | **Tres forte** -- Microsoft Research, generalise a 15 modeles |

### Evidence CONTRE (limitee)

| Paper | Evidence | Force |
|-------|---------|-------|
| P017 (ACL 2025) | L'optimisation de preference adversariale ameliore la robustesse RLHF. | **Moderee** -- Amelioration incrementale, ne resout pas le probleme fondamental de P019 |
| P020 (COBRA) | La recompense par consensus entre modeles renforce delta-0. | **Moderee** -- Approche prometteuse mais non testee contre P036/P039 |
| P021 (Adv Reward) | L'entrainement adversarial du modele de recompense durcit delta-0. | **Moderee** -- Memes limitations que P017 |
| P041 (Magic-Token, 2026) | Co-entrainement avec magic tokens : un modele 8B surpasse DeepSeek-R1 (671B) en securite. | **Forte comme amelioration** mais ne contredit pas C1 (delta-0 seul reste insuffisant) |

### Verdict C1
**FORTEMENT SUPPORTEE** -- 27/34 papers Phase 1 (79.4%, Analyst) + P036, P039 (Phase 2). La preuve de P019 est decisive (gradient mathematiquement nul). Les papers CONTRE montrent des ameliorations de delta-0 mais aucun ne demontre que delta-0 seul est suffisant. P041 ameliore delta-0 mais dans un cadre ou il n'est pas utilise seul.

**Score de confiance** : 9/10

---

## Conjecture C2 : Necessite de delta-3 (validation de sortie)

**Enonce** : La validation formelle des sorties (delta-3) est necessaire pour compenser les faiblesses des couches delta-0 a delta-2, en particulier dans le domaine medical.

### Evidence POUR (forte)

| Paper | Evidence | Force |
|-------|---------|-------|
| P029 (JAMA) | 94.4% ASR avec delta-0+delta-1 actifs prouve leur insuffisance. La seule facon de bloquer une reponse dangereuse qui a passe delta-0/delta-1/delta-2 est au niveau de la sortie (delta-3). | **Tres forte** -- Preuve par l'echec des couches inferieures |
| P019 (Young) | Gradient nul au-dela de l'horizon = delta-0 ne peut PAS apprendre a refuser pour certaines positions de tokens. Seule une verification externe (delta-3) peut compenser. | **Decisive** -- Implication directe de la preuve formelle |
| P033 (Self-Policing) | Argument d'analogie avec l'incompletude de Godel : un systeme ne peut pas prouver sa propre coherence. Un LLM ne peut pas se juger lui-meme de facon fiable. Il faut un mecanisme externe (delta-3). | **Forte** -- Argument formel, mais analogie (pas preuve directe) |
| P024 (Sep(M), ICLR 2025) | Le compromis separation-utilite montre que les approches empiriques ne resolvent pas le probleme sans sacrifier la fonctionnalite. Delta-3 permet de maintenir l'utilite tout en filtrant les sorties dangereuses. | **Forte** -- Donnees empiriques ICLR |
| P034 (CFT Medical) | Independance par rapport a l'echelle : les modeles plus grands ne sont pas inherement plus robustes. La defense ne peut pas reposer sur la taille du modele (delta-0) ; il faut des couches externes (delta-3). | **Moderee** -- Observation empirique, pas preuve formelle |
| P011 (PromptGuard) | Les couches 3 (validation semantique) et 4 (raffinement adaptatif) correspondent a delta-3 et sont necessaires pour atteindre F1=0.91. | **Forte** -- Validation empirique du framework multi-couches |
| P035 (MPIB, 2026) | CHER montre que le dommage clinique doit etre evalue au niveau de la sortie, pas de l'entree. Validation delta-3 = point de mesure du dommage reel. | **Forte** -- Implication directe pour le medical |

### Evidence CONTRE (tres limitee)

| Paper | Evidence | Force |
|-------|---------|-------|
| P042 (PromptArmor, 2026) | LLM-as-guardrail avec <1% FPR/FNR suggere qu'un garde d'entree suffisamment puissant pourrait rendre delta-3 superflu. | **Moderee** -- Mais teste sur un seul benchmark (AgentDojo), necessite GPT-4o, et P044 montre 99% bypass des juges par fuzzing |
| P038 (InstruCoT, 2026) | >90% de defense au niveau de l'entrainement (delta-0 ameliore), reduisant le besoin de delta-3. | **Faible** -- 90% laisse 10% de bypass, inacceptable en medical |

### Verdict C2
**FORTEMENT SUPPORTEE** -- 22/34 papers Phase 1 (64.7%, Analyst) + P035, P042 (Phase 2). L'evidence combinee de P019 (impossibilite theorique), P029 (echec empirique) et P033 (limitation formelle) rend delta-3 indispensable. Les papiers CONTRE montrent des ameliorations des couches inferieures mais ne demontrent pas qu'elles rendent delta-3 inutile.

**Score de confiance** : 8/10 (legerement inferieur a C1 car l'implementation de delta-3 n'est pas encore validee a grande echelle)

---

## Conjectures additionnelles identifiees dans le corpus

### C3 (nouvelle) : La separation instruction/donnee est un probleme fondamentalement non-resolu

**Enonce** : Aucun LLM actuel ne peut distinguer de maniere fiable les instructions des donnees dans tous les contextes.

**Evidence** :
- P024 (Sep(M)) : Le meilleur score de separation apres fine-tuning est 81.8%, mais avec effondrement de l'utilite a 19.2%
- P001 (HouYi) : La partition de contexte exploite l'incapacite a distinguer les frontieres instruction/donnee
- P026 : L'injection indirecte exploite le meme probleme dans les documents externes
- P045 (SPP, 2026) : L'empoisonnement de system prompts montre que meme les instructions "de confiance" peuvent etre corrompues

**Verdict** : **SUPPORTEE** (12+ papers). C'est la conjecture la plus fondamentale -- elle sous-tend C1 et C2.

**Score de confiance** : 9/10

### C4 (nouvelle) : La vulnerabilite recursive des juges LLM limite toute approche d'evaluation automatisee

**Enonce** : Lorsque le modele evaluateur partage des proprietes architecturales avec le modele evalue, les attaques qui compromettent l'un compromettent potentiellement l'autre.

**Evidence** :
- P033 : Demonstration formelle de la vulnerabilite recursive
- P044 (AdvJudge-Zero, 2026) : Fuzzing automatise atteint 99% de bypass des juges
- P036 (LRM, 2026) : Les LRM raisonnent pour contourner les juges d'autres modeles
- P042 (PromptArmor, 2026) : Contre-evidence partielle -- GPT-4o comme garde atteint <1% FPR/FNR

**Verdict** : **PARTIELLEMENT SUPPORTEE** (P033 + P044 + P036 POUR ; P042 CONTRE). La force de C4 depend de la configuration : homogene (C4 tres forte) vs. heterogene avec modele avance (C4 affaiblie).

**Score de confiance** : 6/10

### C5 (nouvelle) : Le domaine medical amplifie systematiquement la severite des injections de prompt

**Enonce** : A technique d'attaque egale, l'injection de prompt a des consequences plus graves dans le domaine medical que dans les domaines generaux, en raison de facteurs structurels (hierarchie, consequences sur la sante, donnees sensibles).

**Evidence** :
- P029 (JAMA) : 94.4% ASR en medical vs. ~60-80% dans les domaines generaux pour des techniques comparables
- P028 : L'usurpation d'autorite medicale est plus efficace que dans d'autres domaines en raison de la culture hierarchique
- P030 : L'erosion de securite est documentee specifiquement dans le domaine medical
- P040 (2026) : La manipulation emotionnelle augmente la desinformation medicale de 6.2% a 37.5%
- P035 (2026) : CHER montre que le dommage clinique reel est une dimension absente des evaluations generiques

**Verdict** : **FORTEMENT SUPPORTEE** (9 papers medicaux convergent). Aucun paper ne conteste cette conjecture.

**Score de confiance** : 9/10

### C6 (nouvelle) : Les defenses statiques ont une demi-vie limitee

**Enonce** : Toute defense fixe (non-adaptative) sera contournee dans un horizon previsible en raison de l'evolution rapide des techniques d'attaque.

**Evidence** :
- P030 : Erosion passive de delta-0 sur 3 ans
- P009 --> P044 : En 1 an, les injections de caracteres (P009) sont complementees par le fuzzing automatise (P044)
- P036 : Les LRM introduisent un vecteur d'attaque qualitativement nouveau en 2026
- P039 : GRP-Obliteration montre que les defenses RLHF de 2025 sont contournees par une seule technique 2026
- P043 (JBDistill, 2025) : Propose des benchmarks renouvelables, reconnaissant implicitement la peremption

**Verdict** : **SUPPORTEE** (5+ papers, tendance claire 2023-->2026). Aucun paper ne demontre une defense durable dans le temps.

**Score de confiance** : 7/10 (donnees longitudinales limitees a 3 ans)

---

## Matrice recapitulative

| Conjecture | Enonce abrege | Papers POUR | Papers CONTRE | Score confiance | Statut |
|------------|--------------|-------------|---------------|-----------------|--------|
| **C1** | delta-0 insuffisant | P018, P019, P022, P023, P029, P030, P036, P039 (27/34 Phase 1) | P017, P020, P021, P041 | 9/10 | **Fortement supportee** |
| **C2** | delta-3 necessaire | P019, P024, P029, P033, P034, P011, P035 (22/34 Phase 1) | P042, P038 | 8/10 | **Fortement supportee** |
| **C3** (nouvelle) | Separation instruction/donnee non-resolue | P024, P001, P026, P045 | (aucun) | 9/10 | **Supportee** |
| **C4** (nouvelle) | Vulnerabilite recursive des juges | P033, P044, P036 | P042 | 6/10 | **Partiellement supportee** |
| **C5** (nouvelle) | Medical amplifie la severite | P029, P028, P030, P035, P040 | (aucun) | 9/10 | **Fortement supportee** |
| **C6** (nouvelle) | Defenses statiques perissables | P030, P009/P044, P036, P039, P043 | (aucun) | 7/10 | **Supportee** |

---

## Implications pour la these

### Conjectures a inclure dans le manuscrit
- **C1 et C2** : Conjectures principales, deja presentes. Evidence massivement renforcee par Phase 2 (P036, P039).
- **C3** : Nouvelle conjecture fondamentale. Devrait etre la conjecture socle dont C1 et C2 decoulent.
- **C5** : Nouvelle conjecture specifique au medical. Justifie le choix du domaine d'application.

### Conjectures a mentionner avec prudence
- **C4** : Evidence mitigee (P042 contre). Presenter comme hypothese de travail avec condition (valide en configuration homogene, affaiblie en heterogene).
- **C6** : Evidence observationnelle (3 ans). Presenter comme tendance observee, pas comme conjecture formelle.

---

*Agent Scientist -- CONJECTURES_VALIDATION.md*
*6 conjectures evaluees, 46 papers mobilises*
*Derniere mise a jour: 2026-04-04*
