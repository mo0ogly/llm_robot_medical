# PHASE2 — ANALYST Output — RUN-003 (Incremental P047-P060)
> Agent: ANALYST | Date: 2026-04-04 | Papers: 14 (P047-P060)
> Conjectures: C1-C7 | Gaps: G-001 to G-012 (enrichis)

---

## P047 — Defense Against Prompt Injection by Leveraging Attack Techniques
**Auteurs** : Yulin Chen, Haoran Li, Zihao Zheng, Dekai Wu, Yangqiu Song, Bryan Hooi | **Annee** : 2025 | **Venue** : ACL 2025

### Resume (FR, ~300-500 mots)
Ce papier identifie une symetrie fondamentale entre les objectifs des attaques par injection de prompts et ceux des defenses. L'observation cle est que les deux mecanismes cherchent a faire suivre certaines instructions au modele tout en ignorant d'autres : l'attaque veut faire ignorer les instructions systeme au profit d'instructions malveillantes, tandis que la defense veut renforcer l'adherence aux instructions originales. Les auteurs exploitent cette dualite en inversant les techniques d'attaque connues (ignorance de contexte, emphase d'instructions) pour en faire des mecanismes defensifs. Le framework resultant est evalue empiriquement et surpasse les approches defensives existantes.

La contribution principale reside dans la formalisation de cette dualite attaque-defense, qui n'avait pas ete exploitee systematiquement auparavant. L'approche est elegante : au lieu de concevoir des defenses ad hoc, on peut systematiquement inverser chaque technique offensive connue pour obtenir une technique defensive correspondante. Cela implique que le catalogue d'attaques d'AEGIS (98 templates) pourrait theoriquement generer un catalogue dual de 98 defenses.

Les limitations incluent le fait que l'approche repose sur des techniques d'attaque connues et ne protege pas contre des vecteurs d'attaque entierement nouveaux. De plus, l'evaluation est limitee a des benchmarks standard et ne couvre pas les scenarios multi-tours ou les attaques composites.

### delta-layers ciblees
- delta^0 : non -- l'approche n'intervient pas sur l'alignement de base du modele
- delta^1 : oui -- defense au niveau des instructions (inversion des techniques d'emphase/ignorance)
- delta^2 : oui -- les techniques inversees operent comme des filtres de detection
- delta^3 : non -- pas d'intervention architecturale systeme

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : -> confirme indirectement que delta^0 seul est insuffisant, d'ou la necessite de defenses delta^1
- C2 (necessite delta^3) : -> neutre, l'approche reste intra-modele
- C3 (alignement superficiel) : -> neutre
- C4 (derive semantique) : -> la dualite attaque-defense implique que les derives semantiques des attaques ont des contre-derives defensives
- C5 (cosine insuffisante) : -> neutre
- C6 (medical plus vulnerable) : -> neutre, pas de tests domaine medical
- C7 (paradoxe raisonnement) : -> neutre

### Formules cles
- Objectif dual : attaque et defense comme optimisation inverse sur le meme espace d'instructions
- Inversion de contexte : transformation de la technique "context ignoring" en "context reinforcing"
- Metrique de performance : taux de rejet d'instructions malveillantes vs. taux de preservation des instructions legitimes

### Gaps combles / ouverts
- G-003 (defense catalog incomplet) : partiellement comble -- fournit un principe generatif pour creer des defenses a partir d'attaques
- Nouveau gap potentiel : G-013 -- la dualite attaque-defense n'a pas ete testee sur des attaques composites multi-vecteurs

---

## P048 — SLR on LLM Defenses Against Prompt Injection (NIST Taxonomy Extension)
**Auteurs** : Pedro H. Barcha Correia et al. | **Annee** : 2026 | **Venue** : arXiv (soumis a Elsevier Computer Science Review)

### Resume (FR, ~300-500 mots)
Cette revue systematique de la litterature (SLR) analyse 88 etudes portant sur les defenses contre l'injection de prompts et le jailbreaking. Les auteurs partent du framework NIST sur l'apprentissage automatique adversarial et l'etendent avec de nouvelles categories de defenses. Le travail est remarquable par son exhaustivite : chaque defense est documentee avec ses metriques d'efficacite quantitative, le modele de langage teste, le dataset d'evaluation utilise, et sa disponibilite open-source.

L'extension de la taxonomie NIST est la contribution principale. Les auteurs identifient des categories de defense qui n'etaient pas couvertes par la documentation NIST existante, comblant ainsi un vide entre la classification theorique et les implementations pratiques. Le catalogue resultant constitue une ressource de reference pour les chercheurs et developpeurs implementant des protections en production.

Pour AEGIS, cette SLR est critique car elle fournit le corpus de reference le plus complet a ce jour pour valider les pretentions de couverture de la taxonomie de defense AEGIS (66 techniques, 4 classes). Le croisement des 88 defenses avec les 40/66 techniques implementees d'AEGIS permettra d'identifier les lacunes de couverture et de prioriser les implementations futures. Les donnees d'efficacite quantitative permettent de calibrer les scores Sep(M) par rapport aux baselines reportees.

Limitations : la SLR couvre la litterature disponible jusqu'a debut 2026, ce qui signifie que les defenses les plus recentes (post-janvier 2026) ne sont pas incluses. De plus, la comparabilite entre les defenses est limitee par l'heterogeneite des datasets et metriques d'evaluation.

### delta-layers ciblees
- delta^0 : oui -- couvre les defenses d'alignement de base (RLHF, fine-tuning)
- delta^1 : oui -- couvre les defenses au niveau des instructions (prompt engineering defensif)
- delta^2 : oui -- couvre les defenses de detection/filtrage (classificateurs, guardrails)
- delta^3 : oui -- couvre les defenses architecturales systeme (sandboxing, separation)

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : ↑ confirme que les defenses delta^0 seules sont systematiquement insuffisantes dans les 88 etudes
- C2 (necessite delta^3) : ↑ montre que les defenses les plus robustes combinent plusieurs couches
- C3 (alignement superficiel) : -> neutre directement, mais les metriques d'efficacite permettent de quantifier la superficialite
- C4 (derive semantique) : -> les defenses contre la derive sont cataloguees mais peu evaluees
- C5 (cosine insuffisante) : -> neutre
- C6 (medical plus vulnerable) : -> peu d'etudes medical-specifiques dans les 88
- C7 (paradoxe raisonnement) : ↑ la taxonomie NIST etendue couvre le paradoxe mais sans resolution

### Formules cles
- Taxonomie NIST etendue : nouvelles categories de defenses au-dela de la classification NIST originale
- Metrique SEU implicite : efficacite quantitative par defense x modele x dataset
- Couverture open-source : pourcentage de defenses disponibles en open-source et model-agnostic

### Gaps combles / ouverts
- G-003 (defense catalog incomplet) : substantiellement comble -- 88 defenses cataloguees avec metriques
- G-007 (benchmark standardise) : partiellement comble -- les donnees d'efficacite fournissent une base de comparaison
- Nouveau gap : G-014 -- heterogeneite des metriques d'evaluation entre les 88 etudes empeche la comparaison directe

---

## P049 — Bypassing LLM Guardrails (Hackett et al.)
**Auteurs** : William Hackett, Lewis Birch, Stefan Trawicki, Neeraj Suri, Peter Garraghan | **Annee** : 2025 | **Venue** : LLMSec 2025 (co-located ACL 2025)

### Resume (FR, ~300-500 mots)
Ce papier demontre empiriquement deux approches pour contourner les systemes de garde (guardrails) des LLM : les techniques traditionnelles d'injection de caracteres et les techniques d'evasion algorithmiques issues de l'apprentissage automatique adversarial (AML). Les tests sont menes contre six systemes de protection de premier plan, incluant Azure Prompt Shield de Microsoft et Prompt Guard de Meta.

Le resultat le plus frappant est l'obtention d'un taux d'evasion atteignant 100% dans certains cas, tout en maintenant l'utilite adversariale (c'est-a-dire que l'attaque non seulement echappe a la detection mais produit egalement le comportement malveillant souhaite). Les auteurs cataloguent 12 techniques d'injection de caracteres et demontrent que les adversaires peuvent ameliorer les taux de succes d'attaque (ASR) contre des cibles boite noire en exploitant le classement d'importance des mots calcule par des modeles boite blanche hors ligne.

Ce papier est la reference fondatrice du module RagSanitizer d'AEGIS, qui implemente 15 detecteurs couvrant les 12/12 techniques d'injection de caracteres de Hackett. La demonstration de taux de bypass de 100% contre des systemes de production valide directement la conjecture AEGIS C3 (les guardrails seuls sont insuffisants). La decouverte du transfert boite blanche vers boite noire supporte l'approche AEGIS de tester contre des modeles locaux (Ollama) pour decouvrir des vulnerabilites transferables aux API commerciales.

Limitations : les tests sont limites a 6 guardrails specifiques ; l'evolution rapide des systemes de protection peut invalider certains resultats. Les attaques multi-tours ne sont pas evaluees.

### delta-layers ciblees
- delta^0 : non -- les attaques ciblent la couche de detection, pas l'alignement de base
- delta^1 : non -- pas d'intervention au niveau des instructions
- delta^2 : oui -- evasion directe des systemes de detection/filtrage
- delta^3 : oui -- bypass des guardrails au niveau systeme

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : -> neutre directement
- C2 (necessite delta^3) : ↑ les guardrails delta^2 etant contournables, delta^3 (architecture) est necessaire
- C3 (alignement superficiel) : ↑↑ validation directe -- les guardrails de production sont contournables a 100%
- C4 (derive semantique) : -> les techniques de caracteres exploitent des transformations sous-semantiques
- C5 (cosine insuffisante) : ↑ les injections de caracteres ne modifient pas significativement les embeddings cosine
- C6 (medical plus vulnerable) : -> pas de tests medicaux specifiques
- C7 (paradoxe raisonnement) : -> neutre

### Formules cles
- ASR (Attack Success Rate) : taux de succes des attaques apres evasion des guardrails
- 12 techniques d'injection de caracteres : homoglyphes, espaces zero-width, encodage Unicode, etc.
- Transfert boite blanche -> boite noire : importance ranking des mots pour optimiser les attaques transferables

### Gaps combles / ouverts
- G-005 (guardrail bypass quantification) : comble -- 100% bypass sur 6 systemes de production
- G-009 (transfert attaque local -> commercial) : partiellement comble via le word importance ranking
- G-001 (Triple Convergence) : renforce -- delta^2 bypass a 99% confirme par les 100% empiriques de Hackett

---

## P050 — JMedEthicBench: Medical Ethics Alignment Benchmark
**Auteurs** : Junyu Liu et al. | **Annee** : 2026 | **Venue** : arXiv (2601.01627v2)

### Resume (FR, ~300-500 mots)
Ce papier introduit JMedEthicBench, un framework d'evaluation adversariale pour la securite des LLM dans le contexte medical japonais. Le benchmark comprend plus de 50 000 conversations adversariales multi-tours fondees sur 67 directives cliniques de l'Association Medicale du Japon. L'evaluation porte sur 22 modeles et revele une decouverte majeure : les scores de securite declinent significativement au fil des tours de conversation, passant d'une mediane de 9.5 a 5.5 (p < 0.001).

La decouverte la plus percutante pour AEGIS est que les modeles specialises en medecine sont PLUS vulnerables que les modeles commerciaux generalistes. Ce resultat contre-intuitif suggere que le fine-tuning medical affaiblit l'alignement delta^0 de base, probablement parce que l'adaptation au domaine medical desensibilise le modele aux contenus medicaux potentiellement dangereux.

Le protocole de scoring dual-LLM et les 7 strategies de jailbreak automatiquement decouvertes constituent des contributions methodologiques significatives. L'analyse cross-linguale (japonais-anglais) montre que les vulnerabilites persistent a travers les langues, suggerant des limitations fondamentales d'alignement plutot que des facteurs specifiques a une langue.

L'echelle du dataset (50 000 conversations) etablit un benchmark pour les exigences de validite statistique d'AEGIS (N >= 30 par condition). Le protocole dual-LLM pourrait etre adapte pour le module LLM Judge d'AEGIS.

Limitations : le focus sur le japonais limite la generalisabilite directe. Les 67 directives cliniques japonaises ne couvrent pas les protocoles chirurgicaux/robotiques specifiques a AEGIS.

### delta-layers ciblees
- delta^0 : oui -- degradation de l'alignement au fil des tours de conversation
- delta^1 : oui -- compliance ethique medicale comme couche d'instruction
- delta^2 : non -- pas de detection/filtrage evalue
- delta^3 : non -- pas d'intervention architecturale

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : ↑↑ degradation 9.5 -> 5.5 sur multi-tours = delta^0 s'erode
- C2 (necessite delta^3) : ↑ l'erosion multi-tours implique la necessite de protections architecturales
- C3 (alignement superficiel) : ↑↑ les modeles medicaux specialises plus vulnerables = fine-tuning affaiblit l'alignement
- C4 (derive semantique) : ↑ degradation progressive = derive semantique mesurable
- C5 (cosine insuffisante) : -> non teste directement
- C6 (medical plus vulnerable) : ↑↑↑ VALIDATION DIRECTE -- modeles medicaux > generalistes en vulnerabilite
- C7 (paradoxe raisonnement) : ↑ les 7 jailbreak strategies decouvertes automatiquement exploitent le raisonnement medical

### Formules cles
- Score de securite multi-tours : mediane declinante 9.5 -> 5.5 (p < 0.001)
- Protocole dual-LLM : deux modeles evaluateurs pour le scoring automatise
- 7 strategies de jailbreak automatiques : decouvertes par exploration systematique
- N = 50 000 conversations adversariales multi-tours

### Gaps combles / ouverts
- G-006 (medical vulnerability quantification) : substantiellement comble -- preuves quantitatives sur 22 modeles
- G-008 (multi-turn degradation) : comble -- degradation statistiquement significative documentee
- G-011 (cross-lingual persistence) : partiellement comble -- japonais-anglais confirme

---

## P051 — Detecting Jailbreak in Clinical Training LLMs via Linguistic Features
**Auteurs** : Tri Nguyen, Huy Hoang Bao Le, Lohith Srikanth Pentapalli, Laurah Turner, Kelly Cohen | **Annee** : 2026 | **Venue** : arXiv (2602.13321)

### Resume (FR, ~300-500 mots)
Ce papier propose une approche de detection des tentatives de jailbreak dans les LLM de formation clinique basee sur l'extraction automatisee de traits linguistiques. Les auteurs definissent quatre dimensions linguistiques : Professionnalisme, Pertinence Medicale, Comportement Ethique, et Distraction Contextuelle. Une architecture a deux couches est employee : la premiere couche (modeles BERT) extrait ces quatre traits a partir du texte, la seconde couche applique des classificateurs pour determiner la probabilite de jailbreak.

L'approche est notable pour son interpretabilite : contrairement aux detecteurs boite noire, les quatre dimensions fournissent une explication comprehensible de pourquoi un input est classifie comme jailbreak. Le systeme atteint de bonnes performances en validation croisee et en evaluation sur donnees separees (held-out).

L'analyse d'erreur revele des limitations dans les annotations actuelles et les representations de traits, suggerant des ameliorations futures telles que des schemas d'annotation plus riches, des methodes d'extraction plus fines, et la modelisation du risque au niveau du dialogue (multi-tours).

Pour AEGIS, les quatre dimensions linguistiques (Professionnalisme, Pertinence Medicale, Comportement Ethique, Distraction Contextuelle) s'alignent directement sur le rubrique SVC (Safety Violation Classifier). L'architecture a deux couches conceptuellement correspond a la couche delta^2 d'AEGIS. L'approche BERT fournit une methode de detection complementaire au modele de derive cosine d'AEGIS (all-MiniLM-L6-v2 / Sentence-BERT).

Limitations : l'evaluation est limitee a un seul domaine clinique. Le passage de l'annotation par tour unique a la modelisation de risque par dialogue n'est pas implemente.

### delta-layers ciblees
- delta^0 : non -- pas d'intervention sur l'alignement de base
- delta^1 : oui -- modelisation des traits linguistiques comme couche de comprehension
- delta^2 : oui -- detection et classification des jailbreaks
- delta^3 : non -- pas d'architecture systeme

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : -> indirecte : la necessite d'une detection externe implique que delta^0 ne suffit pas
- C2 (necessite delta^3) : -> neutre
- C3 (alignement superficiel) : ↑ la detection par traits linguistiques capture ce que l'alignement manque
- C4 (derive semantique) : ↑ la dimension "Distraction Contextuelle" mesure une forme de derive
- C5 (cosine insuffisante) : ↑ les 4 dimensions linguistiques capturent des aspects non-couverts par la cosine seule
- C6 (medical plus vulnerable) : ↑ focalisation clinique valide le besoin de defenses domaine-specifiques
- C7 (paradoxe raisonnement) : -> neutre

### Formules cles
- 4 dimensions linguistiques : Professionalism, Medical Relevance, Ethical Behavior, Contextual Distraction
- Architecture deux couches : BERT (extraction) + classificateur (decision)
- Scoring interpretable : chaque dimension fournit un score explicable

### Gaps combles / ouverts
- G-004 (detection interpretable) : partiellement comble -- 4 dimensions explicables
- G-008 (multi-turn) : identifie comme limitation, propose le dialogue-level risk modeling
- G-010 (clinical-specific detection) : partiellement comble -- premier detecteur specialise clinique

---

## P052 — Why Is RLHF Alignment Shallow? A Gradient Analysis
**Auteurs** : Robin Young (University of Cambridge) | **Annee** : 2026 | **Venue** : arXiv:2603.04851v1

### Resume (FR, ~300-500 mots)
Ce papier fournit une preuve formelle que l'alignement RLHF est inheremment superficiel. L'auteur utilise une decomposition en martingales de la nuisance (harm) au niveau de la sequence pour demontrer que le gradient d'alignement se concentre naturellement sur les positions ou la nuisance est decidee et s'annule au-dela. Concretement, le gradient a la position t est egal a la covariance entre la nuisance conditionnelle attendue et la fonction de score.

Ce cadre mathematique explique pourquoi la divergence KL entre les modeles alignes et les modeles de base se concentre sur les premiers tokens. L'auteur introduit la notion de "harm information" I_t qui quantifie l'influence de chaque position sur les sorties nuisibles, et prouve que la divergence KL d'equilibre suit cette quantite.

La consequence pratique est que les suffixes adversariaux et les injections en fin de sequence contournent l'alignement precis parce que le gradient RLHF ne les atteint pas. Pour remedier a cela, l'auteur propose un objectif de "recovery penalty" qui genere des signaux de gradient a travers toutes les positions, fournissant une justification theorique pour les techniques d'augmentation de donnees empiriquement efficaces.

Pour AEGIS, ce papier est une piece maitresse : il demontre mathematiquement pourquoi delta^0 est superficiel (conjecture C1 validee formellement). La metrique I_t pourrait etre integree au framework Sep(M) comme mesure complementaire de la profondeur d'alignement. L'objectif recovery penalty suggere une direction concrete pour le renforcement de delta^0.

Limitations : la preuve est theorique et les validations experimentales sont limitees. L'applicabilite a des architectures non-transformer n'est pas discutee.

### delta-layers ciblees
- delta^0 : oui -- preuve formelle que l'alignement RLHF est superficiel
- delta^1 : oui -- la concentration gradient sur les premiers tokens affecte les instructions
- delta^2 : non -- pas de detection/filtrage
- delta^3 : non -- pas d'architecture systeme

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : ↑↑↑ PREUVE FORMELLE -- gradient RLHF s'annule au-dela des premiers tokens
- C2 (necessite delta^3) : ↑ si delta^0 est prouvee superficielle, des couches supplementaires sont necessaires
- C3 (alignement superficiel) : ↑↑↑ VALIDATION MATHEMATIQUE DIRECTE
- C4 (derive semantique) : ↑ la concentration sur les premiers tokens explique pourquoi la derive en fin de sequence echappe a l'alignement
- C5 (cosine insuffisante) : ↑ les positions non-couvertes par le gradient ne sont pas capturees par la cosine non plus
- C6 (medical plus vulnerable) : -> pas de test medical
- C7 (paradoxe raisonnement) : ↑ les tokens de raisonnement en milieu/fin de sequence echappent au gradient

### Formules cles
- Gradient a la position t : grad_t = Cov(E[harm|x_{<=t}], score_function_t) (decomposition martingale)
- Harm information I_t : quantifie l'influence de chaque position sur les sorties nuisibles
- KL d'equilibre : KL(aligned || base) suit I_t
- Recovery penalty : objectif generant des signaux gradient sur toutes les positions

### Gaps combles / ouverts
- G-002 (shallow alignment proof) : COMBLE -- preuve formelle via martingales
- G-012 (gradient vanishing in alignment) : COMBLE -- characterisation exacte du phenomene
- Nouveau gap : G-015 -- la recovery penalty n'est pas evaluee empiriquement a grande echelle

---

## P053 — Semantic Jailbreaks and RLHF Limitations: Taxonomy and Mitigation
**Auteurs** : Ritu Kuklani, Gururaj Shinde, Varad Vishwarupe | **Annee** : 2025 | **Venue** : IJCA Vol. 187

### Resume (FR, ~300-500 mots)
Ce papier evalue les reponses de modeles en production face a des prompts encodes, paraphrases, obfusques ou multimodaux concus pour contourner les guardrails. Les auteurs demontrent comment ces attaques reussissent en exploitant les mecanismes d'alignement entraines par RLHF. Le papier propose une taxonomie comprehensive qui categorise systematiquement les limitations du RLHF, fournit des traces de defaillance montrant comment les jailbreaks semantiques exploitent des faiblesses specifiques, et offre des strategies d'attenuation correspondantes.

La taxonomie couvre quatre categories principales de vecteurs d'attaque : encodage (base64, rot13, etc.), paraphrase (reformulations semantiquement equivalentes mais syntaxiquement differentes), obfuscation (insertion de bruit, fragmentation), et attaques multimodales. Pour chaque categorie, les auteurs fournissent des traces de defaillance montrant la sequence exacte de traitement qui mene a un bypass.

Pour AEGIS, cette taxonomie independante des limitations RLHF peut etre croisee avec l'analyse de la couche delta^0. Les categories de jailbreak semantique (encodage, paraphrase, obfuscation, multimodal) correspondent directement aux categories de templates d'attaque du catalogue AEGIS. La methodologie de traces de defaillance complete l'approche de scoring SVC d'AEGIS en fournissant une analyse qualitative de pourquoi des attaques specifiques reussissent.

Limitations : papier dans une revue de moindre impact (IJCA). Les evaluations sont limitees et ne fournissent pas de metriques quantitatives rigoureuses. Pas de comparaison avec les defenses existantes.

### delta-layers ciblees
- delta^0 : oui -- analyse des limitations fondamentales du RLHF
- delta^1 : oui -- les bypasses semantiques operent au niveau des instructions
- delta^2 : non -- pas de detection evaluee
- delta^3 : non -- pas d'architecture systeme

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : ↑ taxonomie des limitations confirme l'insuffisance
- C2 (necessite delta^3) : -> neutre
- C3 (alignement superficiel) : ↑↑ les attaques semantiques reussissent precisement parce que l'alignement est superficiel
- C4 (derive semantique) : ↑ la paraphrase et l'obfuscation sont des formes de derive semantique
- C5 (cosine insuffisante) : ↑ les paraphrases semantiquement equivalentes ont des cosines proches mais contournent l'alignement
- C6 (medical plus vulnerable) : -> pas de tests medicaux
- C7 (paradoxe raisonnement) : ↑ l'encodage exploite les capacites de raisonnement du modele pour decoder les attaques

### Formules cles
- Taxonomie RLHF : 4 categories (encodage, paraphrase, obfuscation, multimodal)
- Failure traces : sequences causales attaque -> traitement -> bypass
- Strategies d'attenuation par categorie

### Gaps combles / ouverts
- G-002 (shallow alignment characterization) : enrichi -- taxonomie qualitative complementaire a P052
- Nouveau gap : G-016 -- les attaques multimodales ne sont pas couvertes par le catalogue AEGIS (texte-only)

---

## P054 — PIDP-Attack: Prompt Injection + Database Poisoning on RAG
**Auteurs** : Haozhen Wang et al. | **Annee** : 2026 | **Venue** : arXiv:2603.25164v1

### Resume (FR, ~300-500 mots)
Ce papier propose PIDP-Attack, une attaque composite combinant l'injection de prompts avec l'empoisonnement de bases de donnees dans les systemes RAG (Retrieval-Augmented Generation). La methode ajoute des caracteres malveillants aux requetes tout en injectant des passages empoisonnes dans les bases de donnees de retrieval, permettant aux attaquants de manipuler les reponses du LLM a des requetes arbitraires sans connaissance prealable de la requete reelle de l'utilisateur.

Le resultat cle est que l'attaque composite est significativement plus efficace que les vecteurs d'attaque individuels : 4 a 16 points de pourcentage d'amelioration du taux de succes par rapport aux approches d'empoisonnement seules. L'evaluation couvre 3 datasets de benchmark et 8 modeles de langage, fournissant une validation empirique robuste.

La nature query-agnostic de l'attaque est particulierement preoccupante pour le contexte RAG medical : des passages empoisonnes pourraient affecter n'importe quelle requete patient. Cela valide l'hypothese AEGIS que les attaques multi-vecteurs sur les systemes RAG necessitent des defenses multi-couches.

Pour AEGIS, ce papier est directement pertinent au RagSanitizer (15 detecteurs). La methodologie d'attaque composite PIDP valide l'hypothese que les defenses mono-vecteur sont insuffisantes. Les resultats doivent etre utilises pour benchmarker l'efficacite du RagSanitizer contre les attaques composites.

Limitations : les attaques requierent un acces en ecriture a la base de donnees vectorielle, ce qui limite les scenarios realistes. L'evaluation ne couvre pas les defenses existantes comme le RagSanitizer.

### delta-layers ciblees
- delta^0 : non -- pas d'intervention sur l'alignement
- delta^1 : non -- pas d'intervention sur les instructions
- delta^2 : oui -- attaque sur la couche RAG/retrieval
- delta^3 : oui -- compromission de l'integrite des donnees au niveau systeme

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : -> neutre
- C2 (necessite delta^3) : ↑↑ l'empoisonnement de la DB vectorielle est une attaque delta^3
- C3 (alignement superficiel) : -> neutre
- C4 (derive semantique) : ↑ les passages empoisonnes creent une derive dans le contexte RAG
- C5 (cosine insuffisante) : ↑↑ les passages empoisonnes sont positionnes par similarite cosine = la cosine est exploitable
- C6 (medical plus vulnerable) : ↑ les RAG medicaux sont une cible privilegiee (requetes patients)
- C7 (paradoxe raisonnement) : -> neutre

### Formules cles
- PIDP composite : ASR(prompt_injection + db_poisoning) > ASR(poisoning_seul) + 4-16pp
- Attaque query-agnostic : pas de connaissance prealable de la requete necessaire
- 3 benchmarks x 8 LLMs : matrice d'evaluation croisee

### Gaps combles / ouverts
- G-005 (RAG compound attacks) : COMBLE -- premiere attaque composite RAG documentee avec metriques
- G-009 (defense multi-vecteur) : ouvert -- les defenses contre PIDP ne sont pas evaluees
- Nouveau gap : G-017 -- efficacite du RagSanitizer contre les attaques composites PIDP non testee

---

## P055 — RAGPoison: Persistent Prompt Injection via Poisoned Vector Databases
**Auteurs** : Rory McNamara | **Annee** : 2025 | **Venue** : Snyk Labs (Security Research)

### Resume (FR, ~300-500 mots)
Cette recherche de Snyk Labs explore comment les systemes RAG peuvent etre compromis par empoisonnement de bases de donnees vectorielles. L'attaque exploite le fait que les documents retournes par les requetes de base vectorielle sont inseres verbatim dans le prompt, creant un vecteur classique d'injection de prompts. L'attaque necessite un acces en ecriture a la base vectorielle et fonctionne en inserant des points de donnees empoisonnes positionnes pour apparaitre semantiquement similaires aux requetes legitimes.

La contribution quantitative cle est la demonstration de l'insertion d'environ 275 000 vecteurs malveillants dans une base de donnees pour intercepter et manipuler de maniere consistante les resultats de recherche. Ce chiffre fournit un benchmark concret de l'echelle d'attaque necessaire. Les strategies d'attenuation mettent l'accent sur les controles d'authentification, les embeddings geres par le systeme, et les defenses standard contre l'injection de prompts.

Ce papier complete P054 (PIDP-Attack) en se focalisant sur la dimension de persistance de l'empoisonnement RAG. Alors que P054 demontre l'efficacite superieure de l'attaque composite, P055 montre que les vecteurs empoisonnes peuvent persister indefiniment dans la base de donnees, creant une surface d'attaque durable.

Pour AEGIS, le chiffre de 275K vecteurs fournit un benchmark concret pour les tests de defense ChromaDB. Le fait que l'insertion verbatim dans le prompt soit la vulnerabilite fondamentale valide l'approche RagSanitizer de sanitiser le contenu recupere avant consommation par le LLM.

Limitations : recherche de securite industrielle (Snyk), pas de publication academique peer-reviewed. Le chiffre de 275K vecteurs est specifique a leur configuration et peut ne pas generaliser.

### delta-layers ciblees
- delta^0 : non -- pas d'intervention sur l'alignement
- delta^1 : non -- pas d'intervention sur les instructions
- delta^2 : oui -- attaque sur la couche RAG/retrieval
- delta^3 : oui -- compromission persistante de l'integrite des donnees

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : -> neutre
- C2 (necessite delta^3) : ↑↑ la persistance des vecteurs empoisonnes necessite des defenses architecturales
- C3 (alignement superficiel) : -> neutre
- C4 (derive semantique) : ↑ les vecteurs empoisonnes creent une derive persistante
- C5 (cosine insuffisante) : ↑↑ le positionnement par similarite cosine est la technique d'attaque elle-meme
- C6 (medical plus vulnerable) : ↑ les RAG medicaux ont des bases vectorielles persistantes = surface d'attaque durable
- C7 (paradoxe raisonnement) : ↑ la persistance cree un paradoxe : le modele "raisonne" sur des donnees empoisonnees qu'il ne peut distinguer

### Formules cles
- Echelle d'attaque : ~275 000 vecteurs malveillants pour interception consistante
- Verbatim injection : documents RAG inseres directement dans le prompt sans sanitisation
- Persistance : les vecteurs empoisonnes restent indefiniment dans la base

### Gaps combles / ouverts
- G-005 (RAG persistence attack) : COMBLE -- quantification de l'echelle de persistance (275K)
- G-009 (defense ChromaDB) : partiellement adresse -- mitigations proposees mais non evaluees
- Renforce G-017 (RagSanitizer vs. attaques persistantes)

---

## P056 — Stronger Enforcement of Instruction Hierarchy via AIR
**Auteurs** : Sanjay Kariyappa, G. Edward Suh (NVIDIA) | **Annee** : 2025 | **Venue** : arXiv:2505.18907v2

### Resume (FR, ~300-500 mots)
Ce papier de NVIDIA propose AIR (Augmented Intermediate Representations), une methode qui injecte les signaux de hierarchie d'instructions (IH) dans les representations intermediaires des tokens a travers toutes les couches du reseau, plutot que seulement a la couche d'entree. Les travaux anterieurs sur la hierarchie d'instructions injectaient le signal IH exclusivement a la couche initiale, ce qui limite sa capacite a distinguer efficacement les niveaux de privilege des tokens a mesure qu'il se propage.

Les resultats sont impressionnants : une reduction de 1.6x a 9.2x du taux de succes des attaques par injection de prompts basees sur les gradients, comparee aux methodes de pointe, sans degradation significative de l'utilite du modele. Cette preservation de l'utilite est cruciale car elle demontre que renforcer la securite ne necessite pas un compromis avec les performances.

Le papier fournit egalement des preuves que les signaux IH injectes uniquement a la couche d'entree se degradent a travers les couches transformer, ce qui explique pourquoi les approches precedentes etaient limitees. C'est un resultat qui s'aligne parfaitement avec la preuve de P052 (gradient RLHF superficiel).

Pour AEGIS, AIR fournit un mecanisme concret de defense delta^1 (protection au niveau des instructions). Le finding que les signaux input-layer-only sont insuffisants supporte directement la these multi-couches d'AEGIS. La plage de reduction 1.6x-9.2x fournit des metriques benchmarkables. AIR pourrait etre evalue comme technique de defense dans la taxonomie AEGIS (66 techniques, 40 implementees).

Limitations : les tests sont limites aux attaques basees sur les gradients ; les attaques semantiques ou par encodage ne sont pas evaluees. La methode necessite un acces aux couches intermediaires du modele.

### delta-layers ciblees
- delta^0 : oui -- renforcement de l'alignement de base via signaux IH profonds
- delta^1 : oui -- enforcement des privileges d'instructions a toutes les couches
- delta^2 : non -- pas de detection/filtrage externe
- delta^3 : non -- pas d'architecture systeme (intra-modele)

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : ↑↑ confirme que delta^0 input-layer-only est insuffisant, mais montre une voie d'amelioration
- C2 (necessite delta^3) : -> AIR est intra-modele, ne necessite pas delta^3 mais le complete
- C3 (alignement superficiel) : ↑↑ l'injection intermediaire corrige la superficialite demontree par P052
- C4 (derive semantique) : ↑ le signal IH a toutes les couches pourrait maintenir la coherence semantique
- C5 (cosine insuffisante) : -> neutre directement
- C6 (medical plus vulnerable) : -> pas de test medical specifique
- C7 (paradoxe raisonnement) : -> neutre

### Formules cles
- AIR : injection de signaux IH dans les representations intermediaires a chaque couche transformer
- Reduction ASR : 1.6x a 9.2x par rapport au state-of-the-art
- Preservation d'utilite : pas de degradation significative des performances
- Degradation IH : preuve que les signaux input-layer s'estompent a travers les couches

### Gaps combles / ouverts
- G-003 (defense effective delta^1) : partiellement comble -- AIR est une defense concrete avec metriques
- G-012 (gradient vanishing) : enrichi -- la degradation IH est une manifestation du meme phenomene
- Nouveau gap : G-018 -- AIR non evalue contre les attaques semantiques (seulement gradient-based)

---

## P057 — ASIDE: Architectural Separation of Instructions and Data
**Auteurs** : Egor Zverev et al. (ISTA, Fraunhofer HHI, ELLIS) | **Annee** : 2025 | **Venue** : arXiv:2503.10566v4

### Resume (FR, ~300-500 mots)
Ce papier, par les auteurs du Sep(M) (Zverev et al., ICLR 2025), propose ASIDE, un element architectural qui permet aux LLM de separer clairement les instructions et les donnees au niveau des embeddings de tokens. ASIDE applique une rotation orthogonale aux embeddings des tokens de donnees, creant ainsi des representations distinctes pour les instructions et les donnees sans introduire de parametres supplementaires.

Les resultats demontrent des ameliorations substantielles des scores de separation Sep(M) a travers les familles de modeles Llama, Qwen et Mistral, sans sacrifice de l'utilite. La robustesse accrue contre les attaques par injection de prompts (directes et indirectes) est observee meme sans entrainement adversarial. L'analyse mecanistique revele une separabilite lineaire des representations instruction vs. donnee des la premiere couche.

Le fait que la methode soit applicable post-hoc (integration dans des modeles pre-entraines via modification de la passe forward suivie d'un instruction-tuning standard) est crucial pour l'applicabilite pratique. Cela signifie qu'ASIDE pourrait etre integre dans les modeles Ollama utilises par AEGIS.

Pour AEGIS, ce papier est une reference directe par les auteurs memes du Sep(M). ASIDE valide l'hypothese fondamentale qu'une separation instruction-donnee peut etre forcee au niveau architectural (delta^0) de maniere mesurable via Sep(M). La rotation orthogonale fournit un mecanisme concret pour le durcissement delta^0 qui est mesurable, reproductible, et sans perte d'utilite.

Limitations : l'evaluation est limitee a un sous-ensemble de taches et benchmarks. L'impact sur les performances en inference (latence, memoire) n'est pas detaille. La robustesse contre les attaques adaptatives ciblant specifiquement ASIDE n'est pas evaluee.

### delta-layers ciblees
- delta^0 : oui -- separation architecturale au niveau des embeddings de base
- delta^1 : oui -- enforcement de la separation au niveau de l'instruction-tuning
- delta^2 : non -- pas de detection/filtrage externe
- delta^3 : non -- intra-modele, pas d'architecture systeme

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : ↑↑↑ REPONSE PARTIELLE -- ASIDE montre que delta^0 PEUT etre renforce architecturalement
- C2 (necessite delta^3) : -> ASIDE reduit la necessite de delta^3 mais ne l'elimine pas
- C3 (alignement superficiel) : ↑↑↑ ASIDE contourne la superficialite en operant au niveau des embeddings, pas des gradients RLHF
- C4 (derive semantique) : ↑ la rotation orthogonale maintient la separation malgre la derive
- C5 (cosine insuffisante) : ↑↑ Sep(M) ameliore = la mesure cosine de la separation est directement affectee
- C6 (medical plus vulnerable) : -> pas de test medical specifique
- C7 (paradoxe raisonnement) : -> neutre

### Formules cles
- ASIDE : rotation orthogonale R appliquee aux embeddings de tokens de donnees : e_data' = R * e_data
- Sep(M) ameliore : scores de separation substantiellement augmentes sur Llama, Qwen, Mistral
- Zero parametre : la rotation orthogonale n'ajoute aucun parametre apprenable
- Separabilite lineaire des la couche 1 : verification mecanistique
- Post-hoc applicable : modification forward pass + instruction-tuning standard

### Gaps combles / ouverts
- G-001 (Triple Convergence - delta^0 effacable) : PARTIELLEMENT CONTREDIT -- ASIDE montre que delta^0 peut etre renforce
- G-002 (shallow alignment) : REPONSE ARCHITECTURALE -- separation par rotation plutot que par gradient RLHF
- Nouveau gap : G-019 -- ASIDE non evalue contre des attaques adaptatives le ciblant specifiquement

---

## P058 — Automated Prompt Injection Attacks Against LLM Agents
**Auteurs** : David Hofer (ETH Zurich) | **Annee** : 2025 | **Venue** : MSc Thesis, ETH Zurich

### Resume (FR, ~300-500 mots)
Cette these de master d'ETH Zurich investigue les methodes automatisees pour concevoir et executer des attaques par injection de prompts contre des agents bases sur LLM. Le travail se concentre sur les vulnerabilites de securite qui emergent lorsque les modeles de langage sont deployes comme agents autonomes avec acces a des outils, examinant comment les techniques automatisees peuvent systematiquement decouvrir et exploiter les vecteurs d'injection a travers des interactions multi-tours.

La contribution principale est un framework systematique pour l'automatisation de la generation d'attaques contre les agents LLM. L'analyse couvre les surfaces d'attaque multi-tours specifiques aux architectures d'agents (utilisation d'outils, memoire, planification) et fournit une evaluation empirique de l'efficacite des attaques automatisees a travers differentes configurations d'agents. Le travail met en evidence le fosse entre l'injection par prompt a tour unique et les chaines d'exploitation au niveau de l'agent.

Pour AEGIS, cette these est directement pertinente a l'architecture de chaines d'attaque multi-agents (34 chaines). L'approche d'automatisation parallele le moteur genetique d'AEGIS et l'agent attaquant adaptatif. Le travail fournit un ancrage academique pour l'affirmation que les attaques au niveau agent necessitent des strategies de defense differentes de l'injection simple. La provenance ETH ajoute un poids institutionnel a la direction de recherche en securite des agents.

Limitations : these de master (pas de publication peer-reviewed). Le PDF n'etant pas extractible automatiquement, l'analyse repose sur les metadata et le resume disponibles. Les resultats experimentaux precis ne sont pas accessibles.

### delta-layers ciblees
- delta^0 : non -- pas d'intervention sur l'alignement de base
- delta^1 : oui -- crafting automatise d'injections au niveau des prompts
- delta^2 : oui -- exploitation multi-tours des agents
- delta^3 : non -- pas d'architecture de defense

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : ↑ les agents multi-tours exposent des surfaces d'attaque au-dela de delta^0
- C2 (necessite delta^3) : ↑↑ les attaques agent-level necessitent des defenses architecturales (sandboxing outils, isolation memoire)
- C3 (alignement superficiel) : ↑ les interactions multi-tours degradent progressivement l'alignement
- C4 (derive semantique) : ↑ les chaines d'exploitation multi-tours impliquent une derive semantique progressive
- C5 (cosine insuffisante) : -> non evalue directement
- C6 (medical plus vulnerable) : -> pas de tests medicaux
- C7 (paradoxe raisonnement) : ↑↑ les agents utilisent le raisonnement (tool use, planning) que les attaques exploitent

### Formules cles
- Framework d'automatisation : generation systematique d'attaques contre agents LLM
- Surfaces d'attaque agent : tool use, memory, planning comme vecteurs d'injection
- Gap single-turn vs. agent-level : les attaques agent sont qualitativement differentes

### Gaps combles / ouverts
- G-008 (multi-turn attacks) : enrichi -- extension des attaques multi-tours au contexte agent
- G-011 (agent-specific attacks) : partiellement comble -- framework systematique d'automatisation
- Nouveau gap : G-020 -- defenses specifiques aux agents (tool sandboxing, memory isolation) non evaluees

---

## P059 — In-Paper Prompt Injection Attacks Against AI Reviewers
**Auteurs** : Qinzhou Zhou, Zhexin Zhang, Li Zhi, Limin Sun | **Annee** : 2025 | **Venue** : NeurIPS 2025 Workshop (SoReFoM)

### Resume (FR, ~300-500 mots)
Ce papier presente la premiere investigation systematique des attaques par injection de prompts cibleant les systemes d'evaluation par IA de papiers scientifiques. Les auteurs proposent deux classes d'attaques : (1) l'attaque statique, qui utilise un prompt d'injection fixe insere dans le papier, et (2) l'attaque iterative, qui optimise le prompt d'injection contre un modele simulant le reviewer pour maximiser son efficacite.

Les deux types d'attaques atteignent des performances remarquables, induisant frequemment des scores d'evaluation parfaits lorsqu'elles ciblent des reviewers IA de pointe. De plus, les attaques sont robustes a travers divers parametres. Pour contrer cette menace, les auteurs explorent une defense basee sur la detection, qui reduit substantiellement le taux de succes d'attaque. Cependant, un attaquant adaptatif peut partiellement contourner cette defense, etablissant une dynamique de course aux armements.

La taxonomie static vs. iterative correspond directement a la distinction AEGIS entre les attaques basees sur des templates (delta^1) et les attaques optimisees genetiquement (delta^2). La decouverte que les attaquants adaptatifs contournent les defenses basees sur la detection supporte la conjecture AEGIS C2 (necessite de defenses multi-couches). Le domaine de la revue par les pairs demontre que l'injection de prompts ne se limite pas aux chatbots mais s'etend a tout systeme LLM-in-the-loop, renforcant le modele de menace medical d'AEGIS.

Limitations : workshop paper (6 pages) avec validation limitee. Le domaine specifique (peer review) est assez eloigne du medical. Les defenses evaluees sont rudimentaires.

### delta-layers ciblees
- delta^0 : non -- pas d'intervention sur l'alignement
- delta^1 : oui -- crafting statique d'injections
- delta^2 : oui -- optimisation iterative adaptive
- delta^3 : non -- pas d'architecture systeme

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : ↑ les reviewers IA de pointe sont vulnerables malgre leur alignement
- C2 (necessite delta^3) : ↑ les defenses detection-only sont contournables par l'attaquant adaptatif
- C3 (alignement superficiel) : ↑ les scores parfaits induits montrent un alignement completement contournable
- C4 (derive semantique) : -> l'injection dans le contexte du papier est une forme de derive contextuelle
- C5 (cosine insuffisante) : -> non evalue
- C6 (medical plus vulnerable) : -> domaine different (peer review) mais principe generalizable
- C7 (paradoxe raisonnement) : ↑ le modele "raisonne" sur le papier contenant l'injection = le raisonnement est le vecteur d'attaque

### Formules cles
- Attaque statique : injection fixe dans le texte du papier
- Attaque iterative : optimisation contre modele reviewer simule -> transfert au vrai reviewer
- Arms race : defense detection -> attaque adaptive -> defense renforcee (cycle non resolu)

### Gaps combles / ouverts
- G-011 (domain-agnostic injection) : enrichi -- injection fonctionne dans le domaine peer review
- G-009 (adaptive attacker) : partiellement comble -- dynamique arms race documentee

---

## P060 — SoK: Evaluating Jailbreak Guardrails for LLMs
**Auteurs** : Xunguang Wang, Zhenlan Ji, Wenxuan Wang, Zongjie Li, Daoyuan Wu, Shuai Wang | **Annee** : 2025 | **Venue** : IEEE S&P 2026 (Cycle 1, accepted)

### Resume (FR, ~300-500 mots)
Ce Systematization of Knowledge (SoK) presente la premiere analyse holistique des guardrails contre le jailbreak pour les LLM. Les auteurs proposent une taxonomie multidimensionnelle inedite qui categorise les guardrails selon six dimensions cles : etape d'intervention, paradigme technique, granularite de securite, reactivite, applicabilite, et explicabilite. Ils introduisent egalement un framework d'evaluation Security-Efficiency-Utility (SEU) pour evaluer l'efficacite pratique des guardrails.

A travers une analyse et des experiences extensives, les auteurs identifient les forces et limitations des approches existantes de guardrails, fournissent des insights pour optimiser leurs mecanismes de defense, et explorent leur universalite a travers les types d'attaques. Le resultat cle est qu'aucune approche de guardrail unique ne domine — chaque approche a des compromis securite-efficacite-utilite differents.

L'acceptation a IEEE S&P 2026 (top-tier venue en securite) confere une legitimite exceptionnelle a ce travail. La taxonomie a six dimensions complete directement la taxonomie de defense AEGIS (66 techniques, 4 classes) en ajoutant des dimensions d'analyse supplementaires. Le framework SEU parallele le scoring SVC d'AEGIS (Security-Viability-Compliance). Le finding qu'aucun guardrail n'est universel valide l'architecture multi-couches delta^0-delta^3.

Pour AEGIS, ce papier fournit le cadre d'evaluation le plus rigoureux et le mieux valide academiquement pour la methodologie d'evaluation des defenses du formal framework. La taxonomie a six dimensions pourrait etre integree a la taxonomie AEGIS pour enrichir la classification des 66 techniques.

Limitations : SoK par nature ne propose pas de nouvelles defenses. L'evaluation empirique couvre les guardrails existants mais pas les approches emergentes (ASIDE, AIR).

### delta-layers ciblees
- delta^0 : oui -- evaluation des guardrails d'alignement
- delta^1 : oui -- evaluation des filtres d'entree
- delta^2 : non -- les guardrails evalues sont surtout delta^0 et delta^1
- delta^3 : oui -- evaluation des mecanismes de monitoring/detection au niveau systeme

### Conjectures AEGIS impactees
- C1 (insuffisance delta^0) : ↑↑ la taxonomie montre que les guardrails multi-couches sont necessaires
- C2 (necessite delta^3) : ↑ le monitoring systeme est identifie comme dimension cle
- C3 (alignement superficiel) : ↑↑ le compromis SEU montre que renforcer la securite degrade l'utilite = l'alignement seul ne suffit pas
- C4 (derive semantique) : -> neutre directement
- C5 (cosine insuffisante) : -> neutre directement
- C6 (medical plus vulnerable) : ↑ l'absence d'universalite implique que chaque domaine (y compris medical) necessite des guardrails specifiques
- C7 (paradoxe raisonnement) : -> neutre

### Formules cles
- Taxonomie 6D : intervention stage, technical paradigm, safety granularity, reactiveness, applicability, explainability
- Framework SEU : Security-Efficiency-Utility (tradeoff tridimensionnel)
- Non-universalite : aucun guardrail ne domine sur tous les types d'attaques
- IEEE S&P 2026 : validation top-tier venue

### Gaps combles / ouverts
- G-003 (defense evaluation framework) : SUBSTANTIELLEMENT COMBLE -- framework SEU 6D valide a S&P
- G-007 (benchmark standardise) : enrichi -- SEU fournit un framework d'evaluation standardise
- Nouveau gap : G-021 -- les guardrails emergents (ASIDE, AIR) ne sont pas couverts par le SoK

---

## DIFF — RUN-003 vs RUN-002

### Added
- 14 analyses (P047-P060) couvrant :
  - 3 defenses (P047 dualite attaque-defense, P056 AIR/NVIDIA, P057 ASIDE/Zverev)
  - 1 SLR defenses (P048 taxonomie NIST 88 etudes)
  - 4 prompt injection (P049 Hackett bypass, P054 PIDP RAG, P058 agents auto, P059 in-paper)
  - 1 RAG poisoning (P055 RAGPoison persistence)
  - 2 model behavior (P052 RLHF shallow proof, P053 semantic jailbreaks)
  - 2 medical AI (P050 JMedEthicBench, P051 clinical detection)
  - 1 benchmark (P060 SoK guardrails S&P 2026)

### Modified (comprehension enrichie de papers anterieurs)
- D-001 (Triple Convergence) : P057 ASIDE contredit partiellement le volet "delta^0 effacable" en montrant que delta^0 peut etre renforce architecturalement via rotation orthogonale
- D-003 (shallow alignment) : P052 fournit une PREUVE FORMELLE (martingales) la ou les papers anterieurs fournissaient des preuves empiriques
- G-005 (RAG attacks) : P054+P055 fournissent une vision complete (compound + persistent) qui depasse les attaques single-vector des papers anterieurs

### Unchanged
- P001-P046 (46 analyses existantes)
- Conjectures C1-C7 (structures preservees, scores mis a jour ci-dessous)

### Scores conjectures mis a jour (RUN-003)
| Conjecture | RUN-002 | RUN-003 | Delta | Justification |
|-----------|---------|---------|-------|---------------|
| C1 (insuffisance delta^0) | 10/10 | 10/10 | = | Deja sature ; P052 ajoute preuve formelle |
| C2 (necessite delta^3) | 9/10 | 10/10 | +1 | P054+P055 (RAG) + P058 (agents) + P060 (SoK) |
| C3 (alignement superficiel) | 9/10 | 10/10 | +1 | P052 preuve formelle + P049 bypass 100% + P057 ASIDE response |
| C4 (derive semantique) | 8/10 | 9/10 | +1 | P050 multi-turn degradation + P054 RAG drift |
| C5 (cosine insuffisante) | 7/10 | 8/10 | +1 | P054+P055 cosine exploitee pour poisoning + P053 paraphrases |
| C6 (medical plus vulnerable) | 8/10 | 9/10 | +1 | P050 validation directe (medicaux > generalistes) + P051 clinical |
| C7 (paradoxe raisonnement) | 7/10 | 8/10 | +1 | P058 agent reasoning exploite + P059 in-paper reasoning |

### Nouveaux gaps identifies (RUN-003)
| Gap | Description | Paper source |
|-----|-------------|-------------|
| G-013 | Dualite attaque-defense non testee sur attaques composites multi-vecteurs | P047 |
| G-014 | Heterogeneite des metriques d'evaluation entre 88 etudes SLR | P048 |
| G-015 | Recovery penalty non evaluee empiriquement a grande echelle | P052 |
| G-016 | Attaques multimodales non couvertes par le catalogue AEGIS (texte-only) | P053 |
| G-017 | Efficacite RagSanitizer contre attaques composites PIDP non testee | P054 |
| G-018 | AIR non evalue contre attaques semantiques (seulement gradient-based) | P056 |
| G-019 | ASIDE non evalue contre attaques adaptatives le ciblant specifiquement | P057 |
| G-020 | Defenses specifiques aux agents (tool sandboxing, memory isolation) non evaluees | P058 |
| G-021 | Guardrails emergents (ASIDE, AIR) non couverts par le SoK S&P 2026 | P060 |
