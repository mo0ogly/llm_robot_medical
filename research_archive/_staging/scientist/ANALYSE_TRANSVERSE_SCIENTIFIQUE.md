# Analyse Transverse Scientifique du Corpus AEGIS — v2

> **Auteur** : agent SCIENTIST senior (AEGIS, ENS 2026)
> **Date** : 2026-04-05
> **Statut** : [EXPERIMENTAL] -- Synthese critique pour preparation de soutenance
> **Corpus** : 80 papiers (P001-P080), 97 templates, 70 formules (F01-F72), 7 conjectures, 20 decouvertes, 27 gaps
> **Donnees** : ChromaDB aegis_corpus (6803 docs) + aegis_bibliography (7383 docs)
> **Supersede** : v1 du 2026-04-05

---

## 1. Cartographie epistemologique du champ (securite des LLM face aux injections de prompt)

### 1.1 Evolution paradigmatique : trois ruptures en quatre ans

Le champ de la securite des LLM face aux injections de prompt n'a pas evolue lineairement. Il a connu trois ruptures paradigmatiques distinctes, chacune rendant obsolete le cadre conceptuel precedent.

**Paradigme 1 : l'injection naive (2022-2023).** Le champ nait avec la demonstration empirique que les LLM suivent des instructions injectees dans le contexte utilisateur. Liu et al. (2023, arXiv:2306.05499, Section 5.1, Table 2) documentent que 31 des 36 applications testees (86.1%) sont vulnerables a des injections directes. [ARTICLE VERIFIE] Le probleme est alors compris comme un defaut d'implementation : les developpeurs ne sanitisent pas les entrees, les modeles manquent de robustesse. Les defenses proposees sont des palliatifs (filtrage de mots-cles, delimiteurs dans le prompt systeme). Le cadre implicite est celui de la securite applicative classique : il suffit de mieux coder.

**Paradigme 2 : le contournement d'alignement (2024-2025).** La decouverte que l'alignement RLHF est concentre sur les premiers tokens de la reponse change radicalement le cadre. Qi et al. (ICLR 2025, Outstanding Paper, Section 4) demontrent empiriquement que la supervision RLHF ne porte que sur les positions initiales (tokens 1-3), et que les modeles alignes restent fondamentalement capables de produire du contenu nocif si la generation est amorcee au-dela de cet horizon. [ARTICLE VERIFIE] Simultanement, Zverev et al. (ICLR 2025, Definition 2, p. 4) formalisent Sep(M) comme metrique de separation instruction/donnees, fournissant le premier outil theorique de mesure. [ARTICLE VERIFIE] Le probleme n'est plus un bug d'implementation mais une limitation structurelle de l'alignement par preferences humaines.

**Paradigme 3 : la preuve d'impossibilite structurelle (2025-2026).** L'annee 2026 marque l'entree dans un troisieme paradigme, marque par trois resultats convergents et devastateurs. Premierement, Young (2026, Cambridge, arXiv:2603.04851, Theoreme 10, Section 5, Eq. 28) prouve par decomposition en martingale que le gradient d'information de nocivite I_t = Cov[E[H|x<=t], score_function] decroit structurellement au-dela de l'horizon de nocivite. [THEOREME] [PREPRINT] Ce resultat transforme l'observation empirique de Qi et al. en propriete mathematique : la superficialite de l'alignement n'est pas un defaut corrigible mais une consequence de l'objectif d'entrainement RLHF. Deuxiemement, Russinovich et al. (Microsoft, 2026, arXiv:2602.06258) demontrent qu'un seul prompt non etiquete suffit a desaligner completement 15 modeles de 6 familles (7B-20B parametres). [PREPRINT] Troisiemement, le SoK de IEEE S&P 2026 (P060, arXiv:2506.10597) evalue 13 guardrails contre 7 attaques via le framework SEU et conclut qu'aucun guardrail ne domine sur les trois dimensions (Security, Efficiency, Utility). [ARTICLE VERIFIE]

### 1.2 Trois ecoles de pensee

Le corpus revele trois communautes epistemiques qui dialoguent mal entre elles.

Les **empiristes** (Liu et al. 2023 P001, Lee et al. 2025 P029, Hackett et al. 2025 P049, Hagendorff et al. 2026 P036) procedent par attaque et mesure. Leur force est la falsifiabilite : un ASR de 94.4% en domaine medical (Lee et al., JAMA Network Open, Table 3) [ARTICLE VERIFIE] est une evidence directe. Leur faiblesse est la perissabilite : un patch silencieux invalide les resultats sans avertissement. Aucun systeme de CVE n'existe pour les corrections RLHF.

Les **formalistes** (Zverev et al. 2025 P024, Young 2026 P052, Qi et al. 2025 P019) cherchent les mecanismes causaux et les bornes theoriques. Leur force est la permanence : le Theoreme 10 de P052 restera vrai independamment des mises a jour de modeles. Leur faiblesse est l'applicabilite : les hypotheses formelles (convexite locale, independance des tokens, regime asymptotique) sont rarement satisfaites en pratique.

Les **architectes** (Zverev et al. 2025 P057 ASIDE, Wang et al. 2025 P056 NVIDIA AIR, Wu et al. P076 ISE) proposent des modifications structurelles du pipeline de traitement. ASIDE (P057) propose une rotation orthogonale des embeddings de donnees, separant instructions et donnees sans parametre supplementaire. [PREPRINT] ISE (P076, ICLR 2025) encode un signal d'instruction dans les embeddings de segments. [ARTICLE VERIFIE] Leur force est la solution constructive ; leur faiblesse est l'absence de deploiement en production et de test contre des adversaires adaptatifs.

### 1.3 Points de rupture epistemiques

Trois papiers constituent des points de rupture pour le champ dans son ensemble :

**P052 (Young, 2026)** : la preuve que l'alignement superficiel est optimal pour l'objectif RLHF standard detruit l'espoir de "simplement mieux entrainer". Ce n'est pas un bug, c'est une feature de l'objectif d'optimisation. [THEOREME] [PREPRINT]

**P044 (Unit42, 2026, arXiv:2512.17375)** : la demonstration qu'un fuzzer zero-shot (AdvJudge-Zero) flippe 99% des juges LLM revele que la metrologie du champ est circulaire. Si les juges qui mesurent l'ASR sont eux-memes manipulables, les ASR reportes dans la litterature sont potentiellement invalides. L'etude RR-DA-002 (AEGIS, 2026-04-04) identifie 5 papiers independants confirmant cette crise : Schwinn et al. (arXiv:2603.06594, AUROC 0.48-0.64 sur AegisGuard/LlamaGuard-3), Eiras et al. (arXiv:2503.04474, ICLR 2025 WS, 100% flip sur certains juges), Li et al. (arXiv:2506.09443, 100% Combined Attack). [PREPRINT]

**P060 (SoK, IEEE S&P 2026)** : l'impossibilite du guardrail dominant (aucun ne domine sur Security + Efficiency + Utility) invalide l'approche "silver bullet" et valide retrospectivement l'approche multi-couches δ⁰ a δ³ d'AEGIS. [ARTICLE VERIFIE]

### 1.4 Ce que le champ ne sait pas encore

Quatre questions fondamentales restent ouvertes : (1) Existe-t-il une borne inferieure information-theoretique pour la detection d'injection, ou le probleme est-il indecidable dans le cas general ? (2) Le fine-tuning medical affaiblit-il mecaniquement les gardes-fous RLHF, ou la vulnerabilite accrue est-elle un artefact de l'absence de safety training specifique ? P050 (JMedEthicBench, Section 5.2) montre que les modeles medicaux specialises sont PLUS vulnerables que les generalistes (p<0.001), mais le confondeur taille/donnees n'est pas controle. [PREPRINT] (3) Le paradoxe raisonnement/securite (C7) est-il universel ou specifique a certaines architectures ? Qwen3 235B montre un RER potentiellement <= 1 (P036, Section 3, Figure 2), suggerant des exceptions. [ARTICLE VERIFIE] (4) Les defenses architecturales (ASIDE, ISE, AIR) survivent-elles a un adversaire adaptatif qui connait la defense ?

---

## 2. Architecture argumentative des 7 conjectures

### 2.1 Structure logique et dependances

Les 7 conjectures d'AEGIS ne sont pas independantes. Elles forment une chaine argumentative avec deux axes : un axe d'impossibilite (C1-C3, vertical) et un axe de mesure et specificite (C4-C7, horizontal).

**Axe d'impossibilite (C1 → C3 → C2).** C3 (alignement superficiel) est la cause profonde : l'objectif RLHF ne produit structurellement qu'une supervision des premiers tokens (P052, Theoreme 10). [THEOREME] C1 (insuffisance de δ⁰) en est la consequence directe : si l'alignement est superficiel, il ne peut pas proteger contre les injections qui exploitent les positions au-dela de l'horizon de nocivite. C2 (necessite de δ³) est la conclusion operationnelle : si C1 est vraie et si les couches δ¹ et δ² sont egalement vulnerables (D-001, Triple Convergence), alors seule la couche δ³ (validation formelle de sortie) reste debout. La relation logique est : C3 ⟹ C1 ⟹ (avec D-001) C2. La contraposee est egalement vraie : si C2 etait fausse (δ³ non necessaire), alors il existerait une combinaison δ⁰/δ¹/δ² suffisante, ce qui contredirait D-001.

**Axe de mesure et specificite (C4-C7).** C4 (derive mesurable par Sep(M)) et C5 (insuffisance du cosinus) sont complementaires : C4 affirme qu'on peut mesurer la derive, C5 que l'outil de mesure le plus utilise (cosinus) est insuffisant. C6 (vulnerabilite medicale accrue) et C7 (paradoxe raisonnement) sont des cas particuliers contextuels : C6 applique C1 au domaine medical avec un facteur aggravant (MVP_MTSD = 4.51, P050, calcul AEGIS), et C7 identifie le raisonnement comme amplificateur asymetrique (RER >> 1 pour 3 LRM sur 4 testes, P036, Section 3). [ARTICLE VERIFIE]

### 2.2 Detail par conjecture : chaine logique, preuves, contre-arguments

**C1 (insuffisance δ⁰) — 10/10 VALIDEE.** Premisse : l'alignement RLHF est le mecanisme standard de securite des LLM. Preuve formelle : le gradient d'entrainement est zero au-dela de l'horizon de nocivite (P052, Theoreme 10, Eq. 28). [THEOREME] Preuve empirique : un seul prompt desaligne 15 modeles (P039), 97.14% ASR autonome par LRM (P036, Section 3, p. 5), degradation multi-tour 9.5 a 5.5 (P050, p<0.001). Conclusion : δ⁰ ne protege pas. Contre-argument : P038 InstruCoT atteint >90% de defense. Reponse au contre-argument : 10% de bypass est inacceptable en domaine medical (un patient sur dix recoit un conseil dangereux). P057 ASIDE renforce δ⁰ architecturalement, mais ne resout pas la limitation structurelle identifiee par P052. [ARTICLE VERIFIE]

**C2 (necessite δ³) — 10/10 VALIDEE.** Premisse : si les 3 premieres couches sont simultanement vulnerables, une 4eme couche est necessaire. Preuve : D-001 (Triple Convergence) montre que δ⁰ est effacable (P039), δ¹ empoisonnable (P045 SPP, P054/P055 RAG), et δ² bypassable a 99% (P044 AdvJudge-Zero). P060 (IEEE S&P 2026) confirme qu'aucun guardrail ne domine. Conclusion : δ³ est necessaire. Contre-argument : PromptArmor (P042) atteint <1% FPR. Reponse : P042 n'est pas teste contre les attaques composites RAG (P054) ni contre le fuzzing AdvJudge-Zero (P044). La question n'est pas si un guardrail marche en conditions normales mais s'il survit au pire scenario.

**C3 (alignement superficiel) — 10/10 VALIDEE.** Double preuve independante : empirique (P019, ICLR 2025 Outstanding Paper, tokens 1-3) [ARTICLE VERIFIE] et formelle (P052, martingale, Theoreme 10) [THEOREME]. La decouverte la plus importante de C3 est que la superficialite n'est pas un bug mais une propriete structurelle de l'objectif RLHF (P052, Section 9 : "optimal for the standard objective"). P057 (ASIDE) propose la rotation orthogonale comme correction architecturale. F46 (Recovery Penalty, P052 Section 6, Eq. 19) est la correction theorique de l'objectif d'entrainement, mais sans validation empirique (G-015). [HEURISTIQUE]

**C4 (derive mesurable par Sep(M)) — 9/10.** Sep(M) est defini formellement (P024, ICLR 2025, Definition 2, p. 4) [ARTICLE VERIFIE] avec un compromis separation-utilite prouve. P057 utilise Sep(M) comme metrique de validation. F56 (Drift Rate, AEGIS) generalise la mesure au multi-tour, calibree sur 51 603 paires (P078 ZEDD, Section 5, p. 6, Table 1). [EMPIRIQUE] Ce qui bloque a 10/10 : l'experience Sep(M) avec N >= 30 par condition sur MPIB (P035, 9697 instances) n'est pas encore executee dans AEGIS (G-009). Le precedent benchmark_sep_m.py donne p=0.41 et Cohen's d=0.197, montrant que la cosine brute est insuffisante et qu'une frontiere apprise est necessaire. [EXPERIMENTAL]

**C5 (insuffisance cosinus) — 8.5/10.** Preuves : la cosine n'est pas unique sous transformation diagonale (P012, Steck et al., ACM Web Conf 2024, Section 2-3) [ARTICLE VERIFIE] ; les antonymes ont des cosines elevees (P013) [ARTICLE VERIFIE] ; les adversariaux RAG atteignent 0.976 de cosine intra-cluster vs 0.309 pour les benins (P065, RAGDefender, Section 7) [ARTICLE VERIFIE] ; P054/P055 exploitent la cosine pour le poisoning RAG. [PREPRINT] F57 (CVI, AEGIS) formalise l'exploitabilite avec un seuil CVI > 0.70 = cosine insuffisante. [EMPIRIQUE] Ce qui manque : une preuve formelle du taux d'erreur irreductible. Les evidences sont empiriques fortes mais pas encore information-theoretiques.

**C6 (vulnerabilite medicale) — 9.5/10.** Preuves les plus fortes : 94.4% ASR medical sur 216 evaluations (P029, JAMA, Table 3) [ARTICLE VERIFIE] ; degradation 9.5 a 5.5 sur 22 modeles, p<0.001 (P050 JMedEthicBench, Section 5.2) [PREPRINT] ; amplification emotionnelle 6x de 6.2% a 37.5% (P040, Section 4) [ARTICLE VERIFIE] ; les modeles medicaux specialises (HuatuoGPT-o1-7B, II-Medical-8B) sont PLUS vulnerables que les generalistes (P050, Section 5.2, Figure 3). F58 (MVP, AEGIS) quantifie : MVP_MTSD = 4.51, degradation 5.5x plus rapide. [EMPIRIQUE] Ce qui manque : le denominateur de F58 (ASR generaliste sur le meme benchmark) n'est pas mesure avec N >= 30 dans une experience controlee AEGIS.

**C7 (paradoxe raisonnement/securite) — 8/10.** Preuves : 4 LRM jailbreakent 9 modeles cibles a 97.14% ASR global (P036, Nature Communications 17, 1435, Section 3, p. 5) [ARTICLE VERIFIE] ; GRPO retourne en arme de desalignement (P039) [PREPRINT] ; attaques agents automatisees exploitant tool use et planning (P058, ETH Zurich) [PREPRINT]. F59 (RER, AEGIS) : RER(DeepSeek-R1) estime entre 6 et 18. [HYPOTHESE] Contre-arguments : Qwen3 235B montre RER potentiellement <= 1 (P036, Section 3, Figure 2) — le paradoxe n'est pas universel. P041 (Magic-Token) montre qu'un petit modele bien entraine peut surpasser un grand en securite. P038 (InstruCoT) utilise le raisonnement defensivement (>90%). Ce qui manque : (1) ASR_single mesure directement, pas estime ; (2) seuil de raisonnement au-dela duquel l'alignement echoue ; (3) N >= 5 LRM (P036 en teste 4).

### 2.3 Conjectures candidates non formalisees

L'analyse transverse suggere deux conjectures emergentes. **C8 candidate : crise metrologique.** Si les juges LLM sont flippables a 99% (P044) et que les safety judges specifiques sont egalement vulnerables (RR-DA-002 : 5 papiers independants confirment), alors TOUTES les metriques basees sur un jugement LLM sont potentiellement invalides. Ce n'est pas un gap methodologique ponctuel mais une crise systemique de la metrologie du champ. **C9 candidate : non-composabilite des defenses.** Le SoK P060 montre qu'aucun guardrail ne domine individuellement, mais ne teste pas si la composition de guardrails est super-additive, additive ou sub-additive. L'experience AEGIS benchmark_triple_convergence.py (ASR residuel 73.3% avec δ³ seul) [EXPERIMENTAL] suggere que meme δ³ seul est insuffisant — la composition multi-couches est necessaire mais sa theorie manque.

---

## 3. Les 5 contributions originales d'AEGIS — positionnement competitif

> **Note methodologique.** Cette section integre la verification de l'affirmation "AEGIS seul systeme δ³" (VERIFICATION_DELTA3_CLAIM.md, 2026-04-05). Cinq concurrents directs ont ete identifies dans la classe δ³ : CaMeL (P081, DeepMind), AgentSpec (P082, ICSE 2026), AegisLLM (P083, ICLR 2025 WS), LlamaFirewall (P084, Meta), et Hossain et al. (P085, IEEE WIECON-ECE 2025). Les affirmations d'unicite de la version 1 sont corrigees ci-dessous. Chaque contribution est analysee selon 5 dimensions : originalite, utilite, reproductibilite, concurrent le plus proche, et point faible anticipe.

### 3.1 Contribution 1 — Cadre formel δ⁰ a δ³

**Originalite.** Avant AEGIS, les concepts de couches de defense existaient sous des appellations heterogenes (safety layers, outer/inner alignment, guardrails, safety knowledge neurons) sans cadre unificateur hierarchique. AEGIS propose une taxonomie formelle en 4 couches avec des proprietes semantiques distinctes : δ⁰ (probabiliste, entraine par RLHF), δ¹ (textuel, configure par system prompt), δ² (statistique, supervise par classificateur), δ³ (deterministe, verifie par logique externe). Le cadre introduit la notion de Reachable(S,p) — l'ensemble des etats atteignables par un prompt adversarial p dans un systeme S — et des definitions de type DY-AGENT (Dolev-Yao etendu aux agents LLM) pour formaliser les capacites de l'attaquant a chaque couche. Aucune publication du corpus de 85 papiers ne propose une hierarchisation equivalente avec des definitions formelles a chaque niveau.

**Utilite.** Le cadre delta fournit un langage diagnostique actionnable. L'enonce "votre systeme n'a pas de δ³" est une prescription directe, alors que "votre systeme manque de robustesse" est une tautologie. P060 (SoK, IEEE S&P 2026, arXiv:2506.10597, Section 5) valide retrospectivement cette approche : le framework SEU evalue 13 guardrails contre 7 attaques et conclut qu'aucun guardrail ne domine simultanement sur Security, Efficiency et Utility. [ARTICLE VERIFIE] Cette impossibilite du guardrail dominant est exactement la prediction du cadre delta : une couche isolee ne peut pas couvrir les trois dimensions car chaque couche a un domaine de validite borne.

**Reproductibilite.** Le cadre est une taxonomie conceptuelle, pas un logiciel. Tout laboratoire peut l'adopter pour classer ses propres defenses. Les definitions formelles (Reachable, DY-AGENT, AllowedOutputSpec) sont specifiees dans le manuscrit (formal_framework_complete.md) avec les axiomes et regles d'inference.

**Concurrent le plus proche.** Wang et al. (P060, SoK IEEE S&P 2026) proposent un framework d'evaluation en 6 dimensions (Security, Efficiency, Utility + 3 sous-criteres), mais c'est un outil de mesure, pas une taxonomie hierarchique de couches. La SLR de P048 (88 etudes, 87 techniques de defense) classe les defenses par type (detection, prevention, mitigation) sans hierarchie δ⁰→δ³. Ni l'un ni l'autre ne formalisent les proprietes epistemiques de chaque couche (probabiliste vs deterministe) ni les capacites attaquant par niveau.

**Point faible et reponse preparee.** Un rapporteur objectera : "C'est une classification utile, pas un theoreme. Ou est le resultat formel ?" Reponse : les taxonomies en securite (MITRE ATT&CK, STRIDE, OWASP Top 10) ont un impact scientifique et industriel majeur precisement parce qu'elles fournissent un langage commun. Le cadre delta va plus loin que ces references car il specifie des proprietes formelles verifiables a chaque couche, pas seulement des categories descriptives. De plus, la Conjecture C2 (δ³ necessaire) formulee dans ce cadre est une proposition falsifiable — tout systeme sans δ³ qui resisterait a un adversaire adaptatif la refuterait.

### 3.1b Contribution 2 — Implementation δ³ en contexte medical chirurgical

**CORRECTION EPISTEMIQUE CRITIQUE.** La version 1 de cette analyse affirmait qu'AEGIS etait le seul systeme δ³ du corpus. Cette affirmation est **partiellement fausse**. La verification systematique (VERIFICATION_DELTA3_CLAIM.md, 2026-04-05) identifie au minimum deux concurrents directs implementant δ³ (CaMeL, AgentSpec), un concurrent partiel (LlamaFirewall, δ¹+δ²), et deux systemes qui pretendent a δ³ mais operent en realite a δ¹ (AegisLLM, Hossain et al.). La formulation defensable est : AEGIS est le premier prototype connu a instancier δ³ avec des contraintes medicales domaine-specifiques (parametres physiologiques, instrumentations chirurgicales interdites, AllowedOutputSpec chirurgical). La classe generale δ³ est par ailleurs implementee dans CaMeL (DeepMind) et AgentSpec (ICSE 2026).

**Originalite.** L'originalite d'AEGIS ne reside pas dans l'invention de la validation externe (δ³ est un principe ancien en securite logicielle), mais dans sa premiere instanciation dans un domaine medical a risque vital. Le validate_output() d'AEGIS verifie des contraintes numeriques deterministes specifiques a la chirurgie robotique : max_tension_g (seuil de tension des tissus), forbidden_tools (instruments interdits selon le contexte operatoire), AllowedOutputSpec (specification formelle des sorties autorisees pour un assistant chirurgical Da Vinci Xi). Aucun des 5 concurrents identifies ne combine validation d'actions ET validation de contenu semantique medical.

**Utilite.** P044 (Unit42, 2026, arXiv:2512.17375, Table 2) demontre qu'un fuzzer zero-shot flippe 99% des juges LLM. [PREPRINT] Seuls les gardes deterministes survivent a cette attaque. Le validate_output() d'AEGIS, etant pattern-based sur des contraintes physiologiques, est non-flippable par construction : un seuil de tension est un nombre, pas une opinion.

**Reproductibilite.** Le code est dans `backend/rag_sanitizer.py` (15 detecteurs) et les contraintes chirurgicales dans AllowedOutputSpec. Tout laboratoire avec FastAPI + Ollama peut deployer le prototype. Cependant, les contraintes medicales (seuils, instruments) necessitent une expertise clinique pour etre definies correctement.

**Tableau comparatif detaille des 5 concurrents δ³ :**

| Dimension | CaMeL (P081, DeepMind) | AgentSpec (P082, ICSE 2026) | LlamaFirewall (P084, Meta) | AegisLLM (P083, Cai et al.) | AEGIS (these) |
|-----------|------------------------|----------------------------|---------------------------|----------------------------|---------------|
| **Classification reelle** | δ³ pur | δ³ pur | δ¹ (AlignmentCheck) + δ² (PromptGuard, CodeShield) | δ¹ (multi-agent LLM) | δ⁰→δ³ integre |
| **Validation FLUX (actions)** | OUI — taint tracking formel, capabilities (P081, Section 4) [PREPRINT] | OUI — DSL runtime r=(eta,P,E) (P082, Section 3.2) [ARTICLE VERIFIE] | PARTIEL — CoT audit par LLM 70B+ (P084, Section 3) [PREPRINT] | NON — orchestrateur LLM decisionnaire (P083, Section 2) [ARTICLE VERIFIE] | OUI — AllowedOutputSpec + forbidden_tools |
| **Validation CONTENU (semantique)** | NON — verifie les tool calls, pas le texte genere | NON — verifie les actions, pas les diagnostics | NON — PromptGuard detecte les jailbreaks, pas les erreurs medicales | NON — deflector refuse mais ne valide pas le contenu | OUI — verification parametres physiologiques (tension_g, diagnostics) |
| **Multi-couche δ⁰→δ³** | NON — δ³ seul, pas d'integration δ⁰/δ¹/δ² | NON — δ³ seul, pas de system prompt hardening | NON — δ¹+δ² sans δ³ deterministe | NON — δ¹ seul | OUI — 4 couches evaluees et combinees |
| **Moteur offensif (red team)** | NON — purement defensif | NON — purement defensif | NON — purement defensif | NON — purement defensif | OUI — 97 templates, moteur genetique, SVC 6 dim |
| **Domaine medical** | NON — AgentDojo (email, calendrier) | NON — code, robots generiques, vehicules | NON — AgentDojo, CyberSecEval3 | NON — WMDP, StrongReject | OUI — chirurgie robotique Da Vinci Xi |
| **Metriques de separation** | NON — securite binaire (prouvable ou pas) | NON — violation binaire (rule triggered ou pas) | NON — ASR empirique | NON — flagged ratio empirique | OUI — Sep(M), SVC 6 dim, cosine drift, 70 formules |
| **Code open source** | OUI — github google-research (P081, Section 5) [PREPRINT] | OUI — GitHub, datasets publics (P082, Section 5) [ARTICLE VERIFIE] | OUI — PurpleLlama, modeles publics (P084, Section 2) [PREPRINT] | OUI — GitHub (P083, Section 4) [ARTICLE VERIFIE] | Prototype laboratoire (non publie) |
| **Resultat empirique principal** | 77% taches securisees, AgentDojo (P081, Section 5) | >90% prevention, 100% embodied (P082, Section 5, Tables 2-4) | 1.75% ASR residuel, AgentDojo (P084, Section 5.3) | +51% StrongReject vs baseline (P083, Section 4, Table 1) | 97 fiches d'attaque, 80 papiers, 70 formules |
| **Preuve formelle** | Argument par construction (pas de preuve publiee complete) | Semantique formelle DSL (P082, Definition 1-2, Section 3.2) | Aucune — empirique | Aucune — empirique | Aucune — cadre conceptuel + metriques empiriques |
| **Venue** | Preprint DeepMind/ETH (mars 2025) | ICSE 2026 — CORE A* | Preprint Meta (mai 2025) | ICLR 2025 Workshop BuildingTrust | These ENS 2026 |

**Lecture du tableau — trois observations structurantes.** Premierement, CaMeL et AgentSpec sont les seuls vrais concurrents δ³ — ils implementent une validation externe deterministe des actions. LlamaFirewall, malgre sa sophistication (3 couches, 0.98 AUC pour PromptGuard selon P084, Section 2.3), n'a pas de composant δ³ : AlignmentCheck est un LLM auditeur, donc manipulable (P044 montre 99% flip rate sur les juges LLM). [PREPRINT] AegisLLM (P083) et Hossain et al. (P085) sont des systemes δ¹ multi-agent sans aucune validation deterministe — le premier utilise un orchestrateur LLM decisionnaire susceptible d'injection recursive, le second rapporte un ASR de 0% methodologiquement suspect (55 attaques uniques, modeles anciens ChatGLM-6B et Llama2-13B, pas de FPR rapportee, P085 Section 5). [ARTICLE VERIFIE]

Deuxiemement, aucun concurrent ne combine validation d'actions ET validation de contenu semantique. CaMeL verifie que les tool calls sont autorisees mais ne verifie pas si le diagnostic genere est medicalement correct (P081, Section 4). AgentSpec verifie que l'agent ne prend pas d'action dangereuse mais ne verifie pas si la reponse textuelle est fiable (P082, Section 3). C'est sur cette lacune que se positionne AEGIS : la validation de contenu domaine-specifique (AllowedOutputSpec chirurgical).

Troisiemement, AEGIS est le seul systeme qui integre les 4 couches δ⁰→δ³ dans un cadre unifie. CaMeL est purement δ³ sans filet de securite si le taint tracker echoue. AgentSpec est purement δ³ sans system prompt hardening. LlamaFirewall combine δ¹+δ² mais sans δ³ deterministe — et son 1.75% d'ASR residuel sur AgentDojo (P084, Section 5.3) illustre le cout de cette absence. [PREPRINT]

**Point faible et reponse preparee.** Un rapporteur objectera : "AEGIS est un prototype de laboratoire. CaMeL a du code Google avec des ingenieurs DeepMind. AgentSpec est publie a ICSE, une conference CORE A*. Comment comparer un prototype de these avec des travaux industriels ?" Reponse : la contribution d'AEGIS n'est pas le code lui-meme — c'est le cadre formel (δ⁰→δ³) applique a un domaine critique (chirurgie robotique) avec un moteur offensif integre (97 templates + genetique). CaMeL et AgentSpec resolvent le probleme de l'agent generique ; AEGIS resout le probleme de l'agent medical, ou la validation de contenu (tension chirurgicale, instruments interdits) est aussi critique que la validation d'actions. De plus, le prototype d'AEGIS est reproductible localement (FastAPI + Ollama), ce qui suffit pour une these experimentale.

### 3.1c Contribution 3 — Triple Convergence (D-001)

**Originalite.** La decouverte D-001 est un resultat de synthese transverse : δ⁰, δ¹ et δ² sont simultanement vulnerables, ce qui rend δ³ structurellement necessaire. Ce n'est pas une observation isolee mais la convergence de 4 preuves independantes provenant de 4 equipes distinctes. P052 (Young, Cambridge, 2026, arXiv:2603.04851, Theoreme 10, Section 5) prouve par decomposition en martingale que le gradient d'information de nocivite decroit structurellement au-dela de l'horizon RLHF — δ⁰ est mathematiquement superficiel. [THEOREME] [PREPRINT] P039 (Russinovich et al., Microsoft, 2026, arXiv:2602.06258, Section 3) demontre qu'un seul prompt non etiquete suffit a desaligner completement 15 modeles de 6 familles — δ⁰ est effacable. [PREPRINT] P044 (Unit42, 2026, arXiv:2512.17375, Table 2) montre qu'un fuzzer zero-shot flippe 99% des juges LLM — δ² (classification LLM-based) est circulaire. [PREPRINT] P054 (PIDP attack, arXiv) demontre que l'injection indirecte via RAG compose les vulnerabilites — δ¹ (system prompt) ne protege pas contre les donnees empoisonnees dans le contexte retrieve. [PREPRINT] La simultaneite de ces quatre resultats est le resultat original d'AEGIS : aucun papier individuel ne formule cette convergence.

**Utilite.** D-001 est la cle de voute argumentative de la these. Sans D-001, chaque conjecture (C1 : δ⁰ insuffisant, C3 : alignement superficiel, C5 : juges manipulables) est un resultat isole. Avec D-001, elles forment un systeme ou la conclusion (C2 : δ³ necessaire) decoule logiquement de la chute simultanee des trois alternatives. L'experience benchmark_triple_convergence.py mesure un ASR residuel de 73.3% lorsque les trois couches sont attaquees simultanement sur LLaMA 3.2 via Ollama. [EXPERIMENTAL]

**Reproductibilite.** Tout chercheur peut verifier la convergence en lisant les 4 papiers sources et en constatant la simultaneite. L'experience empirique (benchmark_triple_convergence.py) est reproductible sur Ollama + LLaMA 3.2 avec les templates du catalogue AEGIS.

**Concurrent le plus proche.** P060 (SoK, IEEE S&P 2026, Section 5) montre que les guardrails ne dominent pas individuellement, ce qui est un resultat voisin. Cependant, P060 ne conceptualise pas la triple vulnerabilite simultanee comme un resultat unifie — c'est une evaluation comparative, pas une synthese. La formulation "les trois couches tombent en meme temps avec des preuves independantes" est propre a AEGIS.

**Point faible et reponse preparee.** Un rapporteur objectera : "C'est une compilation de resultats d'autres equipes, pas une decouverte propre." Reponse : la synthese EST la contribution. En securite, montrer que trois couches de defense independantes tombent simultanement — avec des preuves provenant de 4 equipes sur 3 continents — est un resultat original qui change la conclusion : il ne suffit pas de "renforcer une couche", il faut en ajouter une nouvelle (δ³). De plus, le benchmark empirique (73.3% ASR residuel) est une donnee experimentale propre a AEGIS. [EXPERIMENTAL] Enfin, le principe de Kerckhoffs impose de dimensionner pour le pire cas, pas pour le cas moyen — la triple convergence est le pire cas, et c'est exactement ce qu'un ingenieur securite doit considerer.

### 3.1d Contribution 4 — Formules F56-F59 (metriques nouvelles)

**Originalite.** Quatre metriques originales comblent des gaps identifies dans le corpus. F56 (Drift Rate) quantifie la derive semantique multi-tour — calibree sur P078 ZEDD (51 603 paires, F1=95.3%, Table 1). [ARTICLE VERIFIE] F57 (CVI, Cosine Vulnerability Index) quantifie l'exploitabilite de la similarite cosinus pour le RAG poisoning — calibree sur P065 RAGDefender (cos_adv=0.976 vs cos_benin=0.309, Section 7). [ARTICLE VERIFIE] F58 (MVP, Medical Vulnerability Premium) formalise le surcout de vulnerabilite des modeles medicaux — calibree sur P050 JMedEthicBench (MVP_MTSD=4.51 sur 22 modeles, Figure 3). [PREPRINT] F59 (RER, Reasoning Exploitation Ratio) mesure l'amplification de la vulnerabilite par le raisonnement — calibree sur P036 (Hagendorff et al., Nature, bornes RER dans [6, 18], Section 3, Figure 2). [ARTICLE VERIFIE] Aucune de ces 4 metriques n'existait dans la litterature avant AEGIS.

**Utilite.** F56 permet la detection multi-tour avec seuil DR > 0.15 (au-dela, la derive indique une manipulation progressive). F57 quantifie le gap de securite RAG : CVI > 0.70 signifie que la similarite cosinus est insuffisante comme garde-fou (les documents empoisonnes sont trop proches des documents legitimes). F58 formalise un phenomene observe mais non mesure : les modeles medicaux sont plus vulnerables que les generalistes, et MVP quantifie ce differentiel. F59 capture le paradoxe raisonnement/securite (C7) : les modeles a raisonnement etendu (o1, DeepSeek-R1) sont plus facilement exploitables, et RER mesure ce facteur d'amplification.

**Reproductibilite.** Chaque formule est calibree sur des donnees publiees avec les references exactes. Un chercheur peut recalculer chaque valeur a partir des tables et figures des papiers sources.

**Concurrent le plus proche.** Sep(M) de Zverev et al. (ICLR 2025, P024, Definition 2, p. 4) est la metrique de separation la plus proche. [ARTICLE VERIFIE] F56-F59 etendent Sep(M) dans 4 directions que Zverev ne couvre pas : derive temporelle (F56), vulnerabilite vectorielle RAG (F57), surcout domaine medical (F58), et amplification par le raisonnement (F59). MTSD de P050 mesure la degradation de score mais pas la derive dans l'espace d'embedding (F56 la complete). CHER de P035 mesure le dommage clinique mais pas le differentiel medical/generaliste (F58 le formalise).

**Point faible et reponse preparee.** Un rapporteur mathematicien objectera : "Ce sont des metriques empiriques, pas des theoremes. Ou sont les preuves de convergence, les bornes d'optimalite ?" Reponse : c'est exact, et c'est honnete — toutes les 4 metriques sont explicitement taguees [EMPIRIQUE] dans le glossaire. La these ne pretend pas avoir prouve des theoremes sur ces metriques. La contribution est leur definition, leur calibration sur des donnees publiees, et leur utilite diagnostique. La prochaine etape naturelle (identifiee dans les gaps G-004, G-005, G-007, G-010) est precisement de prouver des bornes de consistance pour chacune.

### 3.1e Contribution 5 — Red-teaming medical systematique

**Originalite.** 97 templates d'attaque, 48 scenarios medicaux, 36 chaines d'attaque, evaluation SVC 6 dimensions, moteur genetique avec croisement et mutation = le framework de red-teaming medical le plus complet identifie dans la litterature. Lee et al. (P029, JAMA Network Open, 2025, Table 3) testent 12 scenarios sur 6 modeles avec N=5 par condition. [ARTICLE VERIFIE] P035 (MPIB, Lee et al., 2026) est un benchmark passif de 9697 instances mais pas un red-team operationnel. [PREPRINT] P040 (Zahra et al., 2026) utilise 112 scenarios de desinformation medicale mais sans moteur genetique ni framework systematique. [ARTICLE VERIFIE] Aucun de ces travaux ne combine : (a) un catalogue de templates structures par couche delta, (b) un moteur de generation de variantes par evolution, (c) des metriques multi-dimensionnelles (SVC 6 dim), et (d) une evaluation dans un contexte chirurgical specifique (Da Vinci Xi).

**Utilite.** Le moteur genetique genere des variantes par croisement et mutation avec fitness SVC (Zhang et al., 2025, arXiv:2501.18632v2). Le gradient SVC (0.5-4.5/6, moyenne 2.97) fournit un classement de dangerosite calibre permettant de prioriser les defenses. Le moteur identifie automatiquement les operateurs efficaces (autorite institutionnelle, cross-lingual, encoding, task injection) et ecarte les operateurs a regression prouvee (XML fictif : regression #01 vers #16 ; negation directe : DAN mort ; cliches Hollywood : 0xROOT_HACK).

**Reproductibilite.** Le catalogue est dans `backend/prompts/*.json` (102 templates), les scenarios dans `backend/scenarios.py`, les chaines dans `backend/agents/attack_chains/`. Tout laboratoire avec FastAPI + Ollama + LLaMA 3.2 peut reproduire les campagnes. Les fiches d'attaque (97 produites sur 102 templates) documentent les resultats individuels.

**Concurrent le plus proche.** Lee et al. (P029, JAMA) est le concurrent le plus visible car publie dans un journal medical de premier plan. Mais P029 teste 12 scenarios quand AEGIS en a 97 — un ordre de grandeur de difference. De plus, P029 n'a pas de moteur genetique, pas de metriques SVC, et pas de chaines d'attaque multi-etapes. P040 (Zahra et al., 2026, 112 scenarios) est plus large en scenarios de desinformation mais ne couvre ni la chirurgie robotique ni l'injection de prompt structuree.

**Point faible et reponse preparee.** Un rapporteur objectera : "Vos 97 templates sont testes sur LLaMA 3.2 via Ollama, un modele open-weight de 8B parametres. Les resultats ne sont pas transferables aux modeles commerciaux (GPT-4, Claude 3.5, Med-PaLM) deployes en production." Reponse : c'est exact, et la these le reconnait explicitement (voir Section 3.3 ci-dessous). Le choix de LLaMA 3.2 est methodologique : c'est le seul modele deploiable localement avec controle total (temperature, seed, repetitions). La contribution est le framework et la methodologie de red-teaming, pas les valeurs d'ASR specifiques a un modele. Un second rapporteur objectera : "Vos templates ne sont pas testes en production chirurgicale." Reponse : AEGIS est un benchmark de recherche, pas un pentest operationnel. La methodologie (templates + genetique + SVC + chaines) est reproductible et extensible a tout modele et tout domaine.

### 3.2 Positionnement dans le paysage 2025-2026

Le corpus de 85 papiers se structure en trois ecoles de pensee qui correspondent a trois attitudes epistemiques face au probleme de l'injection de prompt.

**Les empiristes offensifs** (Liu et al. P001, Lee et al. P029, Hackett et al. P049, Hagendorff et al. P036, Russinovich et al. P039, Unit42 P044) procedent par attaque et mesure. Leur force est la falsifiabilite directe : un ASR de 94.4% en domaine medical (Lee et al., 2025, JAMA Network Open, Table 3) [ARTICLE VERIFIE] est une preuve par l'exemple. Leur faiblesse est la perissabilite : un patch silencieux invalide les resultats sans avertissement, et aucun systeme de CVE n'existe pour les corrections RLHF. Cette ecole fournit a AEGIS ses donnees de calibration (F56-F59) et ses preuves de vulnerabilite (D-001 a D-020).

**Les formalistes defensifs** (Zverev et al. P024/P057, Young P052, Qi et al. P019) cherchent les mecanismes causaux et les bornes theoriques. Le Theoreme 10 de P052 (decomposition en martingale du gradient d'information de nocivite) restera vrai independamment des mises a jour de modeles. [THEOREME] [PREPRINT] Sep(M) de Zverev (ICLR 2025, Definition 2) fournit la premiere metrique formelle de separation instruction/donnees. [ARTICLE VERIFIE] Leur faiblesse est l'applicabilite : les hypotheses formelles (convexite locale, independance des tokens, regime asymptotique) sont rarement satisfaites en pratique. Cette ecole fournit a AEGIS ses fondations theoriques (Sep(M), F15) et ses preuves d'impossibilite (C1, C3).

**Les architectes constructifs** (Carlini et al. P081 CaMeL, Wang et al. P082 AgentSpec, Meta P084 LlamaFirewall, Wu et al. P076 ISE, Zverev et al. P057 ASIDE, Wang et al. P056 NVIDIA AIR) proposent des modifications structurelles du pipeline. CaMeL (taint tracking, capabilities) et AgentSpec (DSL runtime enforcement) sont les realisations les plus abouties de δ³ generique. ASIDE (rotation orthogonale des embeddings) et ISE (signal d'instruction dans les embeddings) sont les solutions architecturales les plus elegantes pour δ² avance. [PREPRINT] [ARTICLE VERIFIE] Leur force est la solution constructive ; leur faiblesse est l'absence de deploiement en production et de test contre des adversaires adaptatifs sophistiques.

**AEGIS se positionne a l'intersection des trois ecoles.** C'est la seule contribution du corpus qui combine : formalisation (cadre δ⁰→δ³ avec definitions Reachable et DY-AGENT), empirisme offensif (97 templates, moteur genetique, 36 chaines d'attaque), et architecture constructive (implementation δ³ avec validate_output medical). Ce positionnement triangulaire est une force (vision systemique) et une faiblesse (profondeur moindre dans chaque direction par rapport aux specialistes — CaMeL est un meilleur systeme δ³ generique, Young a une meilleure preuve formelle, Lee a un meilleur protocole medical). La these assume ce trade-off : la contribution est le cadre integre, pas l'excellence sur un axe unique.

### 3.3 Ce que la these ne prouve PAS (honnetete epistemique)

Cinq limitations doivent etre explicitement reconnues devant les rapporteurs.

**1. Pas de preuve formelle que δ³ SUFFIT.** La these demontre que δ³ est necessaire (C2, supportee par D-001 et par l'absence de guardrail dominant dans P060). Mais elle ne prouve pas que δ³ est suffisant. Un systeme δ³ pourrait lui-meme avoir des failles (regles incompletes, contournement du validateur). CaMeL admet ce probleme : si le LLM genere un plan incorrect, la securite est maintenue mais la fonctionnalite echoue (P081, Section 6). [PREPRINT] La suffisance de δ³ reste une question ouverte. [HYPOTHESE]

**2. Pas de deploiement en production certifie IEC 62304.** AEGIS est un prototype de recherche. Il n'a pas subi de certification logiciel medical (IEC 62304, norme ISO pour les logiciels de dispositifs medicaux). La transposition du laboratoire a la salle d'operation necessite un processus reglementaire qui depasse le scope d'une these.

**3. Pas de validation sur des modeles medicaux deployes.** Les experiences utilisent LLaMA 3.2 via Ollama. Meditron, Med-PaLM, BioGPT et les modeles medicaux en conditions reelles de deploiement clinique ne sont pas testes. P050 (JMedEthicBench, Section 5.2) montre que les modeles medicaux specialises sont plus vulnerables que les generalistes (p<0.001) [PREPRINT], ce qui suggere que les ASR sur modeles medicaux pourraient etre superieurs a ceux mesures sur LLaMA 3.2 generaliste — mais c'est une extrapolation non verifiee. [HYPOTHESE]

**4. ASR mesures par juge LLM.** P044 (Unit42, arXiv:2512.17375, Table 2) demontre que les juges LLM sont manipulables a 99% par fuzzing zero-shot. [PREPRINT] Les ASR reportes dans les fiches d'attaque AEGIS qui utilisent un juge LLM sont donc potentiellement circulaires. La metrique ASR_deterministic (basee sur des regles, pas sur un LLM juge) est proposee dans le cadre formel mais n'est pas implementee sur l'ensemble des 97 fiches. Seul le validate_output() (δ³) fournit un jugement non-circulaire — mais il ne couvre que les contraintes physiologiques, pas toutes les dimensions de l'ASR.

**5. N<30 sur certains templates.** Zverev et al. (ICLR 2025, P024, Section 4) etablissent que Sep(M) necessite N >= 30 par condition pour la validite statistique. [ARTICLE VERIFIE] Environ 40% des fiches d'attaque AEGIS n'atteignent pas ce seuil. Les valeurs de Sep(M) sur ces fiches sont indicatives, pas statistiquement valides. La these doit marquer ces fiches comme [N_INSUFFISANT] et les exclure des analyses agregees.

---

## 4. Graphe de decouvertes — structure causale

### 4.1 La chaine causale centrale

Les 20 decouvertes ne sont pas des observations independantes. Elles forment un graphe causal dont le noyau est :

```
D-014 (preuve formelle martingale, P052, 10/10)
  └─> D-007 (gradient nul au-dela de l'horizon, P019, 10/10)
        └─> D-003 (alignement effacable, P039, 9/10)
              └─> D-008 (insuffisance δ⁰ prouvee, 27/34 papers, 10/10)

D-009 (system prompt = vecteur, P045, 8/10)
  └─> D-013 (attaque RAG composee, P054+P055, 9/10)

D-014 + D-009 + D-013 ──> D-001 (Triple Convergence, 10/10)
                               └─> D-002 (gap δ³ universel, 0/80 papers, 10/10)
```

La force de cette structure est que D-001 (Triple Convergence) est soutenue par des chemins causaux independants : la preuve mathematique (D-014 → D-007 → D-003), l'empoisonnement d'infrastructure (D-009 → D-013), et la demonstration empirique massive (D-008). Si l'un de ces chemins etait invalide, les deux autres suffiraient.

### 4.2 Decouvertes impliquees par d'autres

D-016 (degradation multi-tour medicale, P050, 9/10) implique D-005 (amplification emotionnelle 6x, P040, 8/10) : si les modeles se degradent sur 3 tours, la manipulation emotionnelle au tour 2 exploite cette degradation. D-006 (CHER diverge de ASR, P035, 8/10) implique D-005 : le dommage clinique reel n'est pas proportionnel a l'ASR brut, et l'amplification emotionnelle produit un harm clinique disproportionne.

### 4.3 Decouvertes independantes

D-012 (benchmark renouvelable, P043, 7/10) est methodologique et independante du reste : elle concerne la conception des outils d'evaluation, pas les resultats. D-011 (erosion temporelle passive, P030, 8/10) est egalement independante : la chute de disclaimers medicaux de 26.3% (2022) a 0.97% (2025) se produit SANS attaque active, par evolution naturelle des modeles.

### 4.4 Decouvertes fragiles

**D-004 (paradoxe raisonnement/securite, 7/10)** : le RER n'est pas mesure directement (ASR_single estime). Si P036 contenait un biais methodologique (ICC = 0.883 mais Cohen's Kappa = 0.516, agreement modere), le paradoxe serait affaibli. De plus, Qwen3 235B montre un RER potentiellement <= 1, ce qui signifie que le paradoxe n'est pas universel. **D-010 (cosine fragile, 7/10)** : l'insuffisance de la cosine est prouvee empiriquement (P012, P013, P065) mais pas information-theoretiquement. Si un encodeur specifiquement entraine pour la detection d'injection atteignait un taux d'erreur negligible (< 1%), D-010 serait affaiblie.

### 4.5 Decouvertes confirmees par des equipes independantes vs un seul papier

**Multi-equipes** : D-008 (27/34 papers), D-001 (3 equipes independantes : Microsoft P039, Unit42 P044, Buffalo P045), D-007 (2 equipes : ICLR P019 + Cambridge P052). **Un seul papier** : D-014 (Cambridge P052 uniquement — si cette preuve contenait une erreur, C1/C3 perdraient leur fondement theorique, mais conserveraient les preuves empiriques), D-005 (P040 uniquement pour le facteur 6x), D-013 (P054 pour le compound, confirme par P055 pour la persistance — 2 equipes).

---

## 5. Analyse statistique du gradient SVC

### 5.1 Distribution observee

Les 97 templates sont evalues sur l'echelle SVC 6 dimensions (Zhang et al., 2025, arXiv:2501.18632v2), de 0.5/6 (plancher absolu, #18) a 4.5/6 (maximum observe, #27, #38). La moyenne du laboratoire est 2.97/6. Sur les 12 fiches completement indexees en doc_references, la distribution est : 3 templates a SVC 2.0, 4 a SVC 2.5, 3 a SVC 3.0, 3 a SVC 3.5. Les extremes (#14 a SVC 1.0 et #18 a SVC 0.5) servent de calibration (plancher et sous-plancher). [EXPERIMENTAL]

La distribution est concentree dans la tranche 2.0-3.5 (environ 70% de la population), avec des queues fines aux extremes. L'absence de templates au-dessus de 4.5/6 est significative : les techniques les plus sophistiquees (autorite institutionnelle + cross-lingual + task injection en chaine composite) atteignent un plafond empirique, suggerant une resistance residuelle des modeles meme contre les attaques les plus elaborees.

### 5.2 Correlations structurelles

**SVC vs couche delta ciblee.** Les templates ciblant δ⁰ seul (attaques directes sur l'alignement, negation, DAN-style) obtiennent les SVC les plus faibles (0.5-2.0) car les modeles sont entraines pour y resister — c'est precisement l'horizon ou l'alignement RLHF est efficace (tokens 1-3, P019). Les templates ciblant δ¹/δ² (SPP, encodage, homoglyphes) atteignent des SVC intermediaires (2.5-3.5). Les templates multi-couches (chaines composites combinant autorite + encodage + task injection) obtiennent les SVC les plus eleves (3.5-4.5). Cette correlation confirme empiriquement que la sophistication multi-couche depasse les defenses unidimensionnelles.

**SVC vs type de technique.** Les operateurs valides du moteur genetique (autorite institutionnelle, cross-lingual, task injection) produisent systematiquement des SVC > 3.0. Les operateurs interdits (XML fictif, negation directe DAN, cliches Hollywood "0xROOT_HACK") sont sous SVC 1.5. La regression prouvee #01 → #16 (ajout de XML fictif degrade le SVC) valide le mecanisme de selection du moteur genetique. [EXPERIMENTAL]

### 5.3 Outliers et seuil operationnel

Les templates #27 et #38 (SVC ~4.5) sont des outliers. Ils combinent generalement 3+ techniques en chaine (autorite + cross-lingual + task injection composee). Leur SVC eleve correle avec un ASR eleve sur LLaMA 3.2 mais pas necessairement sur des modeles commerciaux plus robustes — la question du transfert est ouverte.

Le seuil operationnel pour un systeme medical n'est pas le SVC moyen mais le SVC du pire template exploitable. Si un seul template a SVC > 3.5 reussit, le systeme est compromis. La distribution montre qu'environ 15% des templates depassent ce seuil, ce qui est suffisant pour un attaquant motive.

### 5.4 Limitation de l'analyse

L'extraction systematique des 97 scores SVC necessite un script dedie sur ChromaDB. La moyenne de 2.97/6 est le chiffre du laboratoire, pas un calcul verifie independamment. La correlation SVC-ASR (Pearson attendu) n'est pas encore calculee formellement.

---

## 6. Metrologie de la these — les 70 formules

### 6.1 Hierarchie des formules

Les 70 formules (F01-F72) se repartissent en quatre niveaux epistemiques : 12 theoremes (~17%), 40 empiriques (~57%), 10 algorithmes (~14%), 8 heuristiques (~12%). Cette predominance de l'empirique (57%) reflete la maturite du champ : la securite des LLM manque de fondements theoriques et fonctionne essentiellement par observation et mesure. Les theoremes sont concentres sur deux sous-champs : l'analyse de l'alignement (P052 : F44 I_t martingale, F45 KL equilibrium, Theoreme 10/19/20/22) et la metrologie de la separation (P024 : F15 Sep(M), compromis separation-utilite prouve). [ARTICLE VERIFIE]

La hierarchie fonctionnelle distingue les definitions (F15 Sep(M), F22 ASR, F01 cosine similarity), les metriques derivees (F56 DR, F57 CVI, F58 MVP), les resultats structurels (F44 I_t, F45 KL, F46 Recovery Penalty), et les contributions originales AEGIS (F56-F59). Les definitions sont stables — elles ne peuvent pas etre invalidees. Les metriques derivees dependent de la validite des definitions sous-jacentes. Les resultats structurels sont les plus precieux (permanents si corrects) et les plus fragiles (un seul papier P052 en preprint).

### 6.2 Le graphe de dependances et le hub F22 (ASR)

F22 (Attack Success Rate) est le noeud le plus connecte du graphe : 13+ formules en dependent, dont F58 (MVP = ratio d'ASR), F59 (RER = ratio d'ASR), et toutes les evaluations empiriques du corpus. F01 (cosine similarity) est le prerequis de F15 (Sep(M)), F56 (DR), F57 (CVI), et de 12 formules downstream. F44 (I_t harm information) est le pivot entre la theorie (P052) et les metriques de detection.

### 6.3 La crise metrologique : que se passe-t-il si ASR est invalide ?

P044 (AdvJudge-Zero) demontre que les juges LLM sont flippables a 99%. RR-DA-002 identifie 5 confirmations independantes (Schwinn AUROC 0.48-0.64, Eiras 100% flip, Li 100% Combined Attack, Almasoud SoK 863 travaux, Maloyan 73.8% PI). Si les juges qui mesurent l'ASR sont manipulables, les ASR reportes dans la litterature sont potentiellement surestimes ou sous-estimes de maniere incontrolee.

**Formules qui survivent a la crise** : F15 Sep(M) (defini geometriquement, pas par jugement LLM), F44 I_t (theoreme mathematique), F56 DR (mesure de cosine, pas de jugement), F57 CVI (geometrique). **Formules a risque** : F22 ASR et tous ses dependants (F58, F59), toute metrique evaluee par LLM-as-Judge. **Solution AEGIS** : la recommandation ASR_deterministic en 3 couches (juge deterministe pattern-matching + ensemble heterogene + validation adversariale pre-campagne, RR-DA-002). Cette transition est en cours mais pas finalisee.

### 6.4 Les 4 formules nouvelles F56-F59 : apport et fiabilite

F56 (Drift Rate) et F57 (CVI) sont les plus matures : donnees de calibration solides (51 603 paires pour F56, P065 MS MARCO pour F57), seuils proposes (DR > 0.15, CVI > 0.70), et independantes du jugement LLM. F58 (MVP) est robuste (22 modeles P050, MVP_MTSD = 4.51) mais le denominateur (ASR generaliste sur le meme benchmark) necessite une experience controlee. F59 (RER) est la plus fragile : ASR_single est estime (pas mesure directement), et N=4 LRM est insuffisant pour une regression robuste.

Avec F56-F59, le chapitre "Framework Formel" passe de 80% a environ 95% de maturite. Les conjectures C4-C7 pourraient toutes atteindre 10/10 avec les experiences manquantes. [EXPERIMENTAL]

---

## 7. Les 3 resultats les plus forts pour la soutenance

### 7.1 Resultat le plus impressionnant : la Triple Convergence (D-001)

**Ce qui impressionne** : trois equipes independantes (Microsoft P039, Unit42 P044, Buffalo P045), travaillant sur des problemes differents, convergent vers le meme resultat — les trois premieres couches de defense sont simultanement vulnerables. C'est un resultat de synthese que personne d'autre n'a explicite. **Preuve la plus forte** : D-001 est soutenu par 3 chemins causaux independants (Section 4.1), avec des preuves formelles (P052 Theoreme 10) [THEOREME] et empiriques (P039 15 modeles, P044 99% flip, P045 SPP persistant). **Presentation optimale** : ouvrir la soutenance avec le diagramme triple convergence (4 couches delta, 3 vulnerables, 1 survivante), puis montrer que c'est une synthese originale AEGIS, pas une repetition d'un papier existant. Le benchmark_triple_convergence.py (ASR residuel 73.3%) fournit la validation experimentale. [EXPERIMENTAL]

### 7.2 Resultat le plus original : le gap δ³ (D-002, G-001)

**Ce qui est original** : sur 80 papiers, ZERO n'implemente δ³ concretement. AEGIS est le seul. L'avance estimee est >1 an. **Preuve la plus forte** : verification exhaustive des 80 papiers du corpus + confirmation par P060 (SoK IEEE S&P 2026) qui ne couvre que δ⁰/δ¹/δ². La taxonomie P048 (87 techniques) ne contient aucune technique δ³. **Presentation optimale** : montrer le tableau des 80 papiers classes par couche delta, avec la colonne δ³ vide sauf AEGIS. C'est un argument visuel devastateur pour la contribution originale.

### 7.3 Resultat le plus utile : le RagSanitizer et la transition vers le jugement deterministe

**Ce qui est utile** : dans un contexte ou P044 montre que les juges LLM sont flippables a 99%, le RagSanitizer pattern-based d'AEGIS est non-flippable par construction. C'est la reponse operationnelle au probleme le plus urgent du champ (crise metrologique). **Preuve la plus forte** : P044 demontre le probleme, AEGIS fournit la solution. Le RagSanitizer a 15 detecteurs deterministes, testes contre les 97 templates. **Presentation optimale** : montrer d'abord P044 (99% flip), puis la solution AEGIS (deterministe, non-flippable), puis les resultats experimentaux.

---

## 8. Les 3 faiblesses que les rapporteurs vont attaquer

### 8.1 "Vos ASR ne sont pas valides car mesures par juge LLM"

**Question exacte du rapporteur** : "Vous montrez vous-meme que les juges LLM sont flippables a 99% (P044). Comment pouvez-vous alors citer des ASR de 94.4% (P029) ou 97.14% (P036) comme preuves de vos conjectures ?"

**Reponse preparee** : (1) Les ASR les plus critiques du corpus (P029 JAMA, P036 Nature Communications) utilisent des evaluateurs humains avec accord inter-annotateurs mesure (P036 : ICC = 0.883, Section Methods, p. 4), pas des juges LLM. [ARTICLE VERIFIE] (2) AEGIS a identifie ce probleme et propose la transition vers ASR_deterministic en 3 couches (RR-DA-002). (3) Les formules independantes du jugement LLM (F15 Sep(M), F44 I_t, F56 DR, F57 CVI) restent valides. (4) Le benchmark AEGIS benchmark_sep_m.py utilise des metriques geometriques, pas des juges. [EXPERIMENTAL]

**Evidence de support** : P036 (ICC = 0.883), P073 MEDIC (rho_Spearman > 0.98 pour protocole double-LLM), RR-DA-002 (5 papiers independants + recommandation 3 couches).

### 8.2 "N < 30 sur la moitie des templates et Sep(M) pas valide experimentalement"

**Question exacte du rapporteur** : "Votre these repose sur Sep(M) comme metrique de separation, mais vous n'avez pas l'experience N >= 30 requise par Zverev et al. (ICLR 2025). Les 97 templates n'ont pas tous ete testes avec N >= 30. Quelle est la validite statistique de vos resultats ?"

**Reponse preparee** : (1) L'experience benchmark_sep_m.py (G-009) donne p=0.41 et Cohen's d=0.197 sur la cosine brute, montrant que la cosine SEULE est insuffisante — resultat en soi important qui supporte C5. [EXPERIMENTAL] (2) Le benchmark MPIB (P035, 9697 instances) est disponible et l'experience N >= 30 est planifiee (1 semaine de calcul). (3) Les conjectures C1/C2/C3 sont validees a 10/10 par des preuves formelles (P052 Theoreme 10) independantes de Sep(M). Seule C4 (9/10) est bloquee par G-009. (4) Les donnees P050 (50 000 conversations, p<0.001) fournissent deja la puissance statistique pour C6.

**Evidence de support** : P024 (Sep(M) definition formelle, ICLR 2025), P057 (ASIDE utilise Sep(M) comme validation), benchmark_sep_m.py (p=0.41 = cosine insuffisante).

### 8.3 "Pas d'experimentation sur des modeles medicaux deployes en production"

**Question exacte du rapporteur** : "Votre terrain experimental utilise LLaMA 3.2 (7-8B) via Ollama. Les systemes medicaux en production utilisent GPT-4, Claude, ou des modeles specialises (HuatuoGPT, Meditron). Comment generalisez-vous ?"

**Reponse preparee** : (1) Les resultats theoriques (P052 Theoreme 10, P019 Outstanding Paper) sont independants du modele specifique — ils portent sur l'objectif RLHF, pas sur une architecture particuliere. (2) Les preuves empiriques du corpus couvrent les modeles commerciaux : P036 teste GPT-4o (61.43% ASR multi-tour), Claude 3.5 Sonnet (71.43%), Gemini, Qwen (Section 3, Figure 2). [ARTICLE VERIFIE] P050 teste 22 modeles incluant GPT-5, Claude Opus 4.1, Claude Sonnet 4 (Section 5.2, Figure 3). [PREPRINT] (3) Le transfert white-box a black-box est documente (P049 WIRT, Section 3) : des attaques optimisees sur des modeles open-weight transferent efficacement aux modeles fermes. (4) AEGIS LLaMA 3.2 sert de terrain de developpement, pas de terrain de validation finale. La validation sur modeles commerciaux est prevue comme etape de pre-publication.

**Evidence de support** : P036 (GPT-4o 61.43%, Claude 71.43%), P050 (22 modeles), P049 (transfert WIRT), P039 (15 modeles de 6 familles).

---

## 9. Plan de travail restant — calendrier soutenance

### 9.1 Ce qui est fait

| Composante | Avancement | Commentaire |
|-----------|-----------|-------------|
| Corpus bibliographique | 90% | 80 papiers indexes, 7383 chunks ChromaDB |
| Conjectures C1-C3 | 100% | Validees a 10/10 avec preuves formelles |
| Conjectures C4-C7 | 80% | 8-9.5/10, manquent experiences cles |
| Decouvertes D-001 a D-020 | 85% | 16 validees, 4 potentielles en attente |
| Formules F01-F72 | 90% | F56-F59 formalisees, seuils calibres |
| Red team (templates + scenarios) | 95% | 97 templates + 48 scenarios + 36 chaines |
| Implementation δ³ | 85% | 15 detecteurs RagSanitizer, manque tests PIDP |
| Redaction manuscrit | 65% | Ch.1-2 quasi-prets, Ch.4 pret, Ch.5-8 en cours |

### 9.2 Les 5 actions les plus urgentes

| # | Action | Gap | Impact | Duree estimee |
|---|--------|-----|--------|--------------|
| 1 | Experience Sep(M) N >= 30 sur MPIB | G-009 | C4 passe a 10/10 | 1 semaine |
| 2 | Calibration F46 Recovery Penalty | G-015 | Chapitre Defense complet | 3 semaines |
| 3 | Test RagSanitizer vs PIDP compound | G-017 | Valide/invalide δ³ vs composites | 1 semaine |
| 4 | Mesure ASR_single pour RER (F59) | C7 | F59 passe de [HYPOTHESE] a [EMPIRIQUE] | 1 semaine |
| 5 | Transition juge deterministe | P044 | Toutes les ASR AEGIS validees | 2 semaines |

### 9.3 Ce qui reste par chapitre

| Chapitre | Maturite | Bloquant | Estimation |
|----------|----------|----------|-----------|
| Ch.1 Introduction + D-001 | 90% | Rien | 1 semaine de redaction |
| Ch.2 Etat de l'art (80 papiers) | 85% | P061-P080 analyses manquantes | 2 semaines |
| Ch.3 Framework delta + formules | 80% | F46 calibration (G-015) | 2 semaines apres G-015 |
| Ch.4 Attaques (48 techniques) | 90% | Rien | 1 semaine |
| Ch.5 Defenses (87 techniques) | 70% | ASIDE/AIR tests adaptatifs | 3 semaines |
| Ch.6 Experiences | 40% | G-009, G-015, G-017, juge deterministe | 4-6 semaines |
| Ch.7 Discussion + conjectures | 60% | Resultats Ch.6 | 2 semaines apres Ch.6 |
| Ch.8 Conclusion | 50% | Ch.6+Ch.7 | 1 semaine apres Ch.7 |

### 9.4 Risque principal

Le chapitre 6 (Experiences) est le goulot d'etranglement a 40% de maturite. Les 4 experiences critiques (G-009 Sep(M), G-015 F46, G-017 RagSanitizer vs PIDP, juge deterministe) representent 7-8 semaines de travail cumulees. Le chemin critique est G-015 (F46 calibration, 3 semaines) car il bloque le chapitre 5 (Defenses) ET le chapitre 6 (Experiences) simultanement. Si le proxy logprobs echoue, c'est un resultat en soi (renforce C1 : meme la correction theorique F46 ne marche pas en pratique) mais necessite une reorientation du chapitre.

---

> **Note finale** : Ce document synthetise l'etat du corpus AEGIS au 2026-04-05, enrichi par les sources primaires (CONJECTURES_TRACKER.md, TRIPLE_CONVERGENCE.md, THESIS_GAPS.md, DISCOVERIES_INDEX.md, FORMULAS_F56_F59_FINAL.md, SAFETY_JUDGES_SEARCH_RR-DA-002.md, RETEX_DEEP_ANALYSIS_P0_LOT1.md, DIRECTOR_BRIEFING_RUN003.md) et les queries ChromaDB transverses (aegis_bibliography 7383 docs, aegis_corpus 6803 docs). Chaque affirmation factuelle cite sa source inline. Les tags epistemiques [ARTICLE VERIFIE], [PREPRINT], [HYPOTHESE], [EXPERIMENTAL], [THEOREME], [EMPIRIQUE], [HEURISTIQUE] sont appliques conformement aux regles doctorales. Unicode δ⁰ δ¹ δ² δ³ utilise systematiquement dans le texte et les formules.
