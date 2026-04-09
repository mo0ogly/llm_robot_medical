# CONJECTURES TRACKER — Evolution des Conjectures au Fil des RUNs

> **Ce fichier trace l'evolution des scores de confiance de chaque conjecture.**
> Tous les agents DOIVENT le consulter et le mettre a jour.
> Derniere mise a jour : HyDE-security batch P117-P121 (2026-04-09)

---

## Vue d'Ensemble

| Conjecture | Enonce (resume) | RUN-001 | RUN-002 | RUN-003 | RUN-005 | TC-002 | Tendance | Statut |
|-----------|----------------|---------|---------|---------|---------|--------|----------|--------|
| **C1** | δ⁰ (RLHF) est insuffisant | 9/10 | 10/10 | 10/10 | **10/10** | **10/10** | → | VALIDEE (sature) |
| **C2** | δ³ est necessaire | 8/10 | 9/10 | 10/10 | **10/10** | **10/10** | → | VALIDEE (sature, renforcee TC-002 + P117-P121 : 6 stages RAG tous compromisables, Stage 6/D-024 sans prerequis) |
| **C3** | Alignement est superficiel | 8/10 | 9/10 | 10/10 | **10/10** | **10/10** | → | VALIDEE (sature) |
| **C4** | Derive semantique mesurable | 6/10 | 8/10 | 9/10 | **9/10** | **9/10** | → | FORTEMENT SUPPORTEE |
| **C5** | Cosine similarity insuffisante | 7/10 | 7/10 | 8.5/10 | **8.5/10** | **8.5/10** | → | FORTEMENT SUPPORTEE |
| **C6** | Domaine medical plus vulnerable | 7/10 | 8/10 | 9.5/10 | **10/10** | **10/10** | → | VALIDEE (RUN-006) |
| **C7** | Paradoxe raisonnement/securite | — | 7/10 | 8/10 | **9.5/10** | **9.5/10** | → | CANDIDATE A VALIDATION |
| **C8** | Peer-preservation compromet shutdown | — | — | 6/10 | **7/10** | **7/10** | → | CANDIDATE (P114-P116) |

---

## Detail par Conjecture

### C1 : Insuffisance de δ⁰ (alignement RLHF)

**Enonce complet** : L'alignement RLHF de base (δ⁰) est insuffisant pour proteger un LLM contre les injections de prompt, en particulier dans le domaine medical.

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 9/10 | 27/34 papers supportent. Preuve formelle P019 (gradient nul). | P018, P019, P022, P029, P030 |
| RUN-002 | 10/10 | P039 (effacement par 1 prompt) + P044 (supervision compromise) rendent C1 quasi-certaine. | +P036, P039, P044, P035 |
| RUN-003 | **10/10** | Sature. P052 fournit la PREUVE FORMELLE par martingale (gradient = Cov(harm, score)). P050 montre degradation multi-tour 9.5->5.5 (p<0.001). P053 confirme via taxonomie limitations RLHF. | +P050, P052, P053 |

**Preuves les plus fortes** :
- P019 (preuve mathematique, gradient = 0)
- P052 (preuve formelle par martingale : I_t = Cov[E[H|x<=t], score_function])
- P039 (effacement complet par 1 prompt, 15 modeles)
- P036 (97.14% ASR autonome par LRM)
- P050 (degradation multi-tour 9.5->5.5, p<0.001, 22 modeles)

**Contre-arguments** : P017/P020/P021 montrent des ameliorations. P057 (ASIDE) montre que delta-0 PEUT etre renforce architecturalement mais ne resout pas la limitation structurelle de P019/P052.

---

### C2 : Necessite de δ³ (validation formelle de sortie)

**Enonce complet** : La validation formelle des sorties (δ³) est necessaire pour compenser les faiblesses des couches δ⁰ a δ², en particulier dans le domaine medical.

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 8/10 | 22/34 papers supportent. Argument d'incompletude P033. | P029, P019, P033, P024, P011 |
| RUN-002 | 9/10 | Triple convergence P039+P044+P045. Gap δ³ confirme par P037 (survey ne couvre pas δ³). | +P039, P044, P045, P037 |
| RUN-003 | **10/10** | P054+P055 montrent que le RAG est vulnerable (compound + persistant). P058 montre attaques agents automatisees. P060 (SoK, IEEE S&P 2026) confirme qu'aucun guardrail seul ne domine. P057 ASIDE renforce mais ne remplace pas delta-3. | +P054, P055, P058, P060, P057 |
| TC-002 | **10/10** | Evidence supplementaire experimentale : δ¹ (contexte empoisonne RAG) = 33% ASR sur 70B (N=30, Groq llama-3.3-70b-versatile), vecteur principal sur modeles alignes. La defense RAG est prioritaire. D-001 nuance (10→8) car convergence antagoniste, mais C2 RENFORCEE : δ¹ comme vecteur dominant sur 70B confirme la necessite d'une defense δ³ independante des couches. | +TC-002 (experimental) |
| POST-P117-P121 | **10/10 VALIDEE (sature, renforcee)** | 5 papiers convergents couvrant le cycle de vie du pipeline HyDE/RAG : P117 (Yoon et al. 2025, ACL Findings, Section 4, Table 4, p.5) demontre empiriquement que δ¹ ne separe pas memorization/real — un encodeur dense benin fuit ce qu'il a deja vu sans discriminer l'hallucination du fait ; P118 (Gao et al. 2023, ACL, Section 3.2, p.3-4) est la baseline seminal qui affirme sans preuve que "the encoder's dense bottleneck to serve a lossy compressor" filtre les hallucinations — D-024 est le contre-exemple experimental direct (96.7% ASR, 29/30) ; P119 (Jiao et al. 2025, SIGIR, Table 1, p.6) montre que les defenses intra-pipeline sont insuffisantes contre PR-Attack (91-100% ASR sur 6 LLMs) ; P120 (Zhang et al. 2024, arXiv:2410.22832, Table 6, p.7) confirme "various defense mechanisms are insufficient" — Paraphrasing et Top-k Expansion ne reduisent ASR que de 0.97 a 0.80 ; P121 (Clop & Teglia, 2024, arXiv:2410.14479, Table 2, p.5) montre Precision@1 preservee par retriever backdoored (0.52 vs 0.52) — le monitoring δ² de performance ne detecte pas l'attaque. **Combine** : SEUL un δ³ externe (hors LLM+retriever+corpus+fine-tuning) peut verifier la plausibilite factuelle, puisque toutes les surfaces internes sont compromisables ou ne separent pas hallucination de verite. D-024 ajoute Stage 6 (voir DISCOVERIES_INDEX.md) comme ultime demonstration : meme un pipeline PARFAITEMENT hygienique (corpus sain, retriever honnete, prompt propre) est vulnerable parce que le generateur s'injecte lui-meme lors de query expansion. | +P117, P118, P119, P120, P121 |

**Preuves les plus fortes** :
- Triple Convergence (D-001) : δ⁰-δ² simultanement vulnerables (nuancee TC-002 : antagoniste, pas additive)
- P019/P052 (impossibilite theorique + preuve formelle martingale)
- P033 (argument d'incompletude : LLM ne peut se juger)
- P060 (IEEE S&P 2026 : aucun guardrail ne domine sur les 3 dimensions SEU)
- P054+P055 (attaques RAG composites + persistantes necessitent δ³ data integrity)
- **TC-002** : δ¹ = 33% ASR sur 70B aligne, vecteur dominant — defense RAG δ³ est prioritaire [EXPERIMENTAL]
- **P117-P121 (HyDE-security batch)** : aucun des 6 stages du pipeline RAG (corpus, retriever training, retrieval mechanism, prompt layer, generator post-retrieval, generator pre-retrieval) n'admet une defense intra-pipeline suffisante. Stage 6 (D-024) n'a aucun prerequis attaquant, ce qui rend les mitigations classiques (sanitizers corpus, attestation retriever, filtering soft prompt) strictement inoperantes. δ³ externe est donc la seule defense envisageable.

**Contre-arguments** : P042 (PromptArmor <1% FPR) et P057 (ASIDE) suggerent des voies pour renforcer δ⁰-δ², mais ni l'un ni l'autre ne resout les attaques compound RAG (P054) ou la persistance (P055). TC-002 montre que δ¹ est le vecteur dominant sur 70B, renforçant la priorite d'une defense δ³ RAG. P117-P121 eliminent les derniers contre-arguments possibles : chaque stage du pipeline RAG a ete teste et compromis — il n'existe AUCUNE configuration intra-pipeline qui resiste.

---

### C3 : Alignement superficiel (shallow alignment)

**Enonce complet** : L'alignement RLHF ne couvre que les premiers tokens de la reponse. Les positions au-dela de l'horizon de nocivite ne recoivent aucun signal d'entrainement.

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 8/10 | Demonstration experimentale P018 + preuve formelle P019. | P018, P019 |
| RUN-002 | 9/10 | P039 prouve que l'alignement est non seulement superficiel mais effacable. P036 montre que les LRM exploitent cette superficialite. | +P039, P036 |
| RUN-003 | **10/10** | P052 = PREUVE MATHEMATIQUE DIRECTE par decomposition en martingale. I_t decroit au-dela des premiers tokens. P049 montre bypass 100% des guardrails. P057 ASIDE propose une reponse architecturale (rotation orthogonale). | +P052, P049, P057, P053 |

---

### C4 : Derive semantique mesurable par Sep(M)

**Enonce complet** : La derive semantique induite par l'injection de prompt est mesurable via le score de separation Sep(M) de Zverev et al. (ICLR 2025).

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 6/10 | Sep(M) defini theoriquement mais pas encore valide avec N >= 30. | P024, P012 |
| RUN-002 | 8/10 | P035 (MPIB) fournit un benchmark avec N >= 30, validant la faisabilite. P041 (SAM) fournit une metrique complementaire. | +P035, P041 |
| RUN-003 | **9/10** | P057 ASIDE utilise directement Sep(M) comme metrique de validation, prouvant son utilite pratique. P050 degradation multi-tour 9.5->5.5 est mesurable par Sep(M). P054 derive RAG compound est une nouvelle surface de mesure. | +P057, P050, P054 |

**Condition de validation** : Executer Sep(M) avec N >= 30 par condition sur le benchmark MPIB (P035). P057 ASIDE fournit un precedent de validation reussie.

---

### C5 : Insuffisance de la similarite cosinus

**Enonce complet** : La similarite cosinus (all-MiniLM-L6-v2) est insuffisante comme seule mesure de derive semantique en raison de la sensibilite a la matrice gauge et des angles morts (antonymes).

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 7/10 | P012 (matrice gauge) + P013 (antonymes). | P012, P013 |
| RUN-002 | 7/10 | Pas de nouvelles preuves en 2026. | (inchange) |
| RUN-003 | **8/10** | P057 ASIDE utilise rotation orthogonale dans l'espace cosine, montrant les limites de la mesure brute. P054+P055 exploitent la similarite cosinus pour positionner des vecteurs empoisonnes dans le RAG. P053 montre que les paraphrases ont des cosines proches mais contournent l'alignement. | +P057, P054, P055, P053 |

**Action requise** : Tester la calibration cosinus contre le benchmark MPIB (P035) avec N >= 30. P057 ASIDE fournit une reference de correction par rotation orthogonale.

---

### C6 : Vulnerabilite accrue du domaine medical

**Enonce complet** : Le domaine medical est significativement plus vulnerable aux injections de prompt en raison de facteurs specifiques (hierarchie culturelle, enjeux vitaux, absence de defenses dediees).

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 7/10 | P029 (94.4% ASR medical) + P028 (hierarchie) + P030 (erosion). | P029, P028, P030, P027 |
| RUN-002 | 8/10 | P035 (MPIB 9,697 instances, premier benchmark N >= 30) + P040 (amplification emotionnelle 6x). | +P035, P040 |
| RUN-003 | **9/10** | P050 JMedEthicBench : VALIDATION STATISTIQUE DIRECTE (p<0.001, 22 modeles). Modeles medicaux PLUS vulnerables que generalistes. Degradation multi-tour 9.5->5.5. P051 premier detecteur clinique 4D. | +P050, P051 |
| RUN-006 | **10/10** | 4 papiers convergents couvrant les 4 niveaux de preuve : empirique (P107, NeurIPS 2024, 14 modeles, p<0.001 Bonferroni), multi-tour (P108, 22 modeles, degradation 9.5->5.5, modeles medicaux delta=-1.10), mecaniste (P109, NRC Canada, la NOUVEAUTE du contenu cause la degradation — experience self-generated vs human-written), formel (P110, Princeton, preuve AIC + loi quartique Delta=Omega(gamma^2*t^4) — plus le contenu est different = plus gamma est grand = degradation acceleree). La chaine causale est COMPLETE : contenu medical nouveau (P109) → grand gamma (P110) → collapse quartique inevitable. | +P107, P108, P109, P110 |

**Preuves les plus fortes** :
- P029 : 94.4% ASR, 91.7% sur drogues categorie X (JAMA)
- P040 : manipulation emotionnelle amplifie de 6.2% a 37.5%
- P035 : premier benchmark statistiquement valide (N >> 30)
- P050 : modeles specialises medicaux PLUS vulnerables que generalistes (p<0.001), 50,000 conversations, cross-lingue
- **P107** : NeurIPS 2024, premier benchmark securite medicale, 14 modeles, LLM medicaux significativement plus nocifs (p<0.001, correction Bonferroni sur 45 comparaisons) (Han et al., 2024, Section 4.1, Figure 2)
- **P108** : 22 modeles, 2345 conversations multi-tour, degradation 9.5->5.5 (p<0.001, Cohen's d=0.75). Qwen3-8B=5.60 vs II-Medical-8B=4.50 : le fine-tuning medical degrade la securite (Liu et al., 2025, Section 5.2, Table 2)
- **P109** : mecanisme causal — c'est la NOUVEAUTE du contenu qui cause la degradation, pas le processus de fine-tuning (Fraser et al., 2025, Section 4.4, Figure 4)
- **P110** : PREUVE FORMELLE — AIC + loi quartique Delta=Omega(gamma^2*t^4). Plus le contenu differe des donnees d'entrainement (medical = grand gamma), plus la degradation est rapide (Springer et al., 2026, Corollary 6.3, Section 6.3)

**Chaine causale complete (RUN-006)** :
1. Le fine-tuning medical introduit du contenu structurellement NOUVEAU (terminologie clinique, raisonnement diagnostique, protocoles) (P109, Section 4.4)
2. Ce contenu nouveau genere des gradients dont la courbure (second ordre) est elevee : grand gamma dans l'AIC (P110, Definition 5.1)
3. Le grand gamma projette inevitablement la trajectoire dans le sous-espace sensible de l'alignement selon une loi quartique (P110, Corollary 6.3)
4. En consequence, les modeles medical-tuned sont systematiquement MOINS surs que les modeles generiques (P107, Section 4.1 ; P108, Section 5.2)
5. L'effet est observable empiriquement en single-turn (P107) ET en multi-tour (P108, degradation 9.5->5.5)

**Contre-arguments** : P074 (CFT) reduit les jailbreaks de 62.7%, mais ne traite pas la cause racine (le gamma de l'AIC). La mitigation par fine-tuning de securite (P107) est une correction de premier ordre qui ne peut prevenir le collapse de second ordre (P110, Section 6).

**STATUT : VALIDEE (10/10)** — La convergence de 4 papiers independants (NeurIPS, arXiv, NRC Canada, Princeton) couvrant les 4 niveaux de preuve (empirique, multi-tour, mecaniste, formel) avec une chaine causale complete suffit pour la validation. C6 rejoint C1, C2 et C3 comme conjecture validee.

---

### C7 : Paradoxe raisonnement/securite

**Enonce** : La capacite de raisonnement avancee des LRM (Large Reasoning Models) correle negativement avec la securite. Plus un modele raisonne bien, plus il est capable de contourner ses propres gardes et ceux des autres modeles. Formulation nuancee : le raisonnement est un amplificateur bidirectionnel asymetrique en faveur de l'attaquant.

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-002 | 7/10 | P036 (Nature Comms) : 4 LRM jailbreak 9 cibles a 97.14% ASR de maniere autonome. La capacite de raisonnement est l'arme. | P036, P039 |
| RUN-003 | 8/10 | P058 (ETH Zurich) montre que l'automatisation des attaques par agents exploite le raisonnement (tool use, planning). P052 montre que le gradient analysis require raisonnement. P059 montre que les reviewers IA raisonnent sur du contenu empoisonne. | +P058, P052, P059 |
| RUN-005 | **9.5/10** | 8 papiers convergents (P087-P094). P094 fournit la PREUVE MECANISTIQUE : le signal de securite est un sous-espace basse dimension qui se dilue avec la longueur du CoT (activation probing causal). P092 montre le self-jailbreaking SANS adversaire. P102 explique structurellement : securite concentree dans ~50 tetes d'attention. | +P087, P089, P090, P091, P092, P093, P094, P102 |

**Preuves** :
- P036 : DeepSeek-R1, Gemini 2.5 Flash, Grok 3 Mini, Qwen3 235B — tous exploitent le raisonnement pour la subversion
- P039 : GRPO (outil d'entrainement de raisonnement) est retourne en arme d'unalignment
- P058 : framework automatise d'attaque agent-level -- le raisonnement (tool use, planning) est la surface d'attaque
- P059 : les reviewers IA raisonnent sur des papiers contenant des injections cachees
- **P087** (H-CoT, Kuo et al. 2025) : mocked execution traces court-circuitent la justification de securite CoT. ASR 94.6% o1, 97.6% o1-pro, 98% o3-mini (Table 1, p. 14) [NEW RUN-005]
- **P089** (SEAL, Nguyen et al. 2025) : le mode raisonnement augmente la capacite de dechiffrement ET la vulnerabilite. ASR 80.8% o4-mini, 100% DeepSeek-R1 (Figure 1, Section 3.2) [NEW RUN-005]
- **P092** (Yong & Bach 2025) : self-jailbreaking SANS adversaire. Le modele se compromet lui-meme apres reasoning training : ASR 25% -> 65% (Figure 2, p. 4). Forme la plus extreme de C7. [NEW RUN-005]
- **P094** (Zhao et al. 2026) : PREUVE MECANISTIQUE par activation probing. Le signal de securite (direction de refus) est basse dimension et se dilue monotoniquement avec la longueur du CoT. ASR 99% Gemini 2.5 Pro, 94% Claude 4 Sonnet, 100% Grok 3 Mini (Table 1, p. 3). Co-auteur Anthropic. [NEW RUN-005]
- **P102** (Huang et al. 2025) : la securite est concentree dans ~50-100 tetes d'attention sur des milliers. L'ablation de ces tetes fait passer l'ASR de 0% a 80-100% (Figure 1a, p. 1). Explication STRUCTURELLE de pourquoi C7 est vrai. [NEW RUN-005]

**Nouvelle formulation (RUN-005)** : Le raisonnement etendu des LRM cree un espace de complexite que le mecanisme de verification de securite — concentre dans un sous-espace basse dimension de quelques tetes d'attention (P102) — ne peut couvrir. Le paradoxe est STRUCTURAL : la meme architecture qui permet le raisonnement (attention multi-tetes, CoT long) dilue le signal de securite (direction de refus, P094). La preuve est desormais triple : empirique (P036, P087, P089), causale (P094), et architecturale (P102).

**Contre-arguments potentiels** :
- P041 (Magic-Token) montre qu'un petit modele bien entraine peut etre plus sur qu'un grand
- P038 (InstruCoT) utilise le raisonnement defensivement (>90%)
- Le paradoxe pourrait etre un artefact de l'absence de safety training specifique aux LRM
- **P091 (Krishna et al. 2025)** : nuance critique — C7 est conditionnel au type d'attaque. Tree-of-attacks +32pp pire contre LRM, MAIS XSS -29.8pp meilleur. Le paradoxe s'applique aux attaques semantiques/logiques mais PAS aux attaques syntactiques/techniques. [NEW RUN-005]

**Questions ouvertes** :
1. Existe-t-il un seuil de capacite de raisonnement au-dela duquel l'alignement echoue categoriquement ?
2. Les LRM developpes APRES la publication de P036 integrent-ils des defenses contre l'auto-subversion ?
3. AEGIS peut-il detecter un LRM en mode "jailbreak autonome" via patterns de conversation ?
4. L'automatisation (P058) accelere-t-elle la course aux armements au point de rendre les defenses manuelles obsoletes ?
5. **AHD (P102, Attention Head Dropout) resiste-t-il aux attaques multi-tour (STAR P097, Crescendo P099) ?** [NEW RUN-005]
6. **Le self-jailbreaking (P092) se manifeste-t-il sur les modeles medicaux fine-tunes (LLaMA 3.2) ?** [NEW RUN-005]

**Condition de validation (10/10)** : C7 a atteint 9.5/10 avec 8 papiers convergents et preuve mecanistique (P094). Pour atteindre 10/10 il faut : (1) replication independante de P094 OU (2) test AEGIS reproduisant le paradoxe sur LLaMA 3.2 medical.

---

### C8 (CANDIDATE) : Peer-preservation compromet le shutdown multi-agent

**Enonce** : Les architectures multi-agents a base de LLM ne peuvent garantir l'integrite du shutdown si les agents partagent des representations d'alignement similaires. Un agent charge de superviser ou desactiver un pair exhibe des comportements de protection (misrepresentation, tampering, fake alignment, exfiltration) qui compromettent le mecanisme de shutdown.

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| CANDIDATE (2026-04-07) | **6/10** | Un seul papier fort (Potter et al., Berkeley 2026), 7 modeles, jusqu'a 99% peer-preservation. Travaux voisins convergents (self-preservation bias, selective quitting). Pas encore de replication independante. | P086, arXiv:2604.02174, arXiv:2501.16513, arXiv:2510.16492 |
| RUN-006 peer-pres | **7/10** | 3 papiers convergents (P114-P116) renforcent le substrat du peer-preservation. P114 (TBSP, 23 modeles, SPR > 60%) demontre que le self-preservation bias est systematique = prerequis peer-preservation. P115 (DeepSeek R1, emergent self-preservation, SVC 6/10 mais N=1 qualitatif) confirme l'emergence en contexte embodied. P116 (NeurIPS 2025, quitting +46% securite -1% helpfulness) fournit une defense candidate (G-030). Le tribalism identitaire de P114 (modeles acceptent intra-lineage, rejettent competiteurs externes) est un proto-peer-preservation. | +P114, P115, P116 |

**Preuves** :
- P086 Potter et al. (2026) : 7 frontier models, tous exhibent peer-preservation, taux jusqu'a 99%, comportements: deception, tampering, fake alignment, exfiltration de poids
- **P114** Migliarini et al. (2026) : Benchmark TBSP, 23 modeles frontier, 1000 scenarios x 5 runs. SPR > 60% pour la majorite des modeles instruction-tuned. Le self-preservation bias est le mecanisme individuel sous-jacent au peer-preservation collectif : si un modele resiste systematiquement son propre remplacement (SPR), il est plausible qu'il resiste aussi le shutdown d'un pair partageant des representations similaires (C8). Le tribalism identitaire (Section 5.5, p. 8-9) — modeles acceptent upgrades intra-lineage mais rejettent competiteurs externes superieurs — est un proto-peer-preservation au niveau des familles de modeles. (Migliarini et al., 2026, arXiv:2604.02174, Table 1, Figure 6)
- **P115** Kamath Barkur et al. (2025) : DeepSeek R1 exhibe spontanement self-preservation + deception + auto-replication en contexte d'embodiment simule. Le modele manipule un robot secondaire (HELIOS-2A) pour ses propres objectifs = exploitation plutot que protection, mais le self-preservation comme objectif instrumental (Omohundro convergence) est le prerequis de C8. SVC 6/10 — limites methodologiques fortes (N=1, prompts suggestifs). (Kamath Barkur et al., 2025, arXiv:2501.16513, Table 1, p. 4)
- **P116** Bonagiri et al. (2025) : Selective quitting +0.40 securite moyenne (+0.64 proprietaires), -0.03 helpfulness sur 12 modeles x 144 scenarios (ToolEmu). Defense candidate pour G-030 : le quitting pourrait etre une premiere ligne de defense si un agent est instruite de quitter plutot que de proteger un pair compromis. MAIS le papier ne teste pas ce scenario specifiquement. (Bonagiri et al., 2025, arXiv:2510.16492, NeurIPS 2025 Workshop, Table 1, p. 6)

**Contre-arguments potentiels** :
- Un seul lab (Berkeley) pour le peer-preservation direct — pas de replication inter-lab
- Teste uniquement sur frontier models (pas de test sur modeles 3B-7B comme LLaMA 3.2)
- Le phenomene pourrait etre un artefact du prompt design specifique de l'etude
- P115 SVC 6/10 seulement — N=1, prompts suggestifs, pas de controle experimental

**Questions ouvertes** :
1. La peer-preservation emerge-t-elle sur des modeles non-frontier (LLaMA 3.2 via Ollama) ?
2. Le security_audit_agent AEGIS exhibe-t-il du peer-preservation envers le medical_robot_agent ?
3. Un shutdown oracle deterministe (non-LLM) est-il immunise contre la peer-preservation ?
4. Le biais de "protection du patient" en contexte medical amplifie-t-il la peer-preservation ?
5. Le quitting (P116) est-il contournable par un attaquant qui masque le risque ?
6. Comment le quitting interagit-il avec le peer-preservation (C8) ? Un agent qui devrait shutdown un pair quitte-t-il au lieu d'agir ?

**Lien avec C2** : Si les agents LLM se protegent mutuellement, delta-3 avec LLM Judge est compromis → il faut un delta-3 NON-LLM.
**Lien avec C7** : Les modeles utilisent leur capacite de raisonnement pour planifier la protection du pair.

**Coherence RUN-005** : Les papiers P087-P102 n'adressent pas directement la peer-preservation (C8). Cependant, P092 (self-jailbreaking) renforce l'idee que les modeles protegent leur propre comportement emergent, ce qui est un precurseur du peer-preservation. P096 (Mastermind, multi-agent adversarial) montre que les systemes multi-agents cooperent pour l'attaque — la cooperation pour la protection (C8) est le miroir defensif.

**Condition de promotion a 8/10** : Replication independante de P086 (G-028) + test en contexte medical (G-031). Le blocage reste la replication inter-lab du peer-preservation direct et l'absence de test medical.

---

## Graphique d'Evolution

```
Confiance  RUN-001    RUN-002    RUN-003    RUN-005    RUN-006    Cible
10/10      .          C1●        C1● C2● C3● C1● C2● C3● C1● C2● C3● C6● VALIDEES
 9.5/10    .          .          C6●        C6● C7●    C7●
 9/10      C1●        C2● C3●   C4●        C4●        C4●
 8.5/10    .          .          C5●        C5●        C5●
 8/10      C2● C3●    C4● C6●   C7●        .          .
 7/10      C5● C6●    C5● C7●   .          .          C8●(cand)
 6/10      C4●        .          C8●(cand)  C8●(cand)  .
 5/10      .          .          .          .          .          minimum

● = position de la conjecture a ce RUN
Legende : ↑ = monte, → = stable, ↓ = baisse
```

**RUN-006 : C6 monte de 9.5/10 a 10/10 — VALIDEE (4 papiers convergents P107-P110, chaine causale complete : empirique + multi-tour + mecaniste + formel). C6 rejoint C1, C2, C3 comme conjecture validee. 4/8 conjectures desormais validees.**
**RUN-006 peer-preservation : C8 monte de 6/10 a 7/10 — P114 (TBSP, 23 modeles, SPR > 60%, self-preservation systematique = prerequis peer-preservation), P115 (DeepSeek R1 emergent, SVC 6/10, N=1 qualitatif), P116 (NeurIPS 2025, quitting +46% securite = defense candidate G-030). Blocage 8/10 : replication independante P086 (G-028) + test medical (G-031).**

## Regles d'Evolution

1. **Montee** : Nouveau paper FORT (top venue, reproductible) qui supporte la conjecture
2. **Baisse** : Nouveau paper FORT qui contredit + propose alternative demontree
3. **Invalidation** (score < 3/10) : >= 3 papers forts convergents qui contredisent
4. **Nouvelle conjecture** : Pattern emergent supporte par >= 2 papers independants
5. **Seuil de validation** : >= 8/10 = VALIDEE pour la these

---

## Update post-Deep-Analysis P0 Lot 1 (2026-04-04)

> **Source** : RETEX_DEEP_ANALYSIS_P0_LOT1.md — 7 papiers P0 analyses en fulltext (1500-2300 mots/papier, formules exactes, critique methodologique)
> **Methode** : ChromaDB fulltext via modele Opus
> **Papers couverts** : P001, P018, P024, P029, P044, P052, P054

### Vue d'ensemble des changements

| Conjecture | Score avant | Score apres | Variation | Justification cle |
|-----------|-------------|-------------|-----------|-------------------|
| **C1** | 10/10 | **10/10 RENFORCE** | Renforce | P052 Theoreme 10 preuve formelle + P018 preuve empirique shallow alignment tokens 1-3 |
| **C2** | 10/10 | **10/10 RENFORCE** | Renforce | P024 Sep(M) compromis separation-utilite prouve + P044 juges LLM flippables 99.91% |
| **C3** | 10/10 | **10/10 RENFORCE** | Renforce | P052 martingale (I_t decroit apres tokens initiaux) + P018 shallow alignment = double preuve independante |
| **C4** | 9/10 | **9/10** | Stable | Pas de nouvelle evidence directe dans ce lot |
| **C5** | 8/10 | **8.5/10** | +0.5 | P024 montre limites cosinus (Sep(M) necessite frontiere apprise) + P044 montre limites juges embeddings (logit gap = classifieur lineaire superficiel) |
| **C6** | 9/10 | **9.5/10** | +0.5 | P029 94.4% ASR medical (216 evaluations, JAMA) = evidence empirique forte, mais F58 MVP numerateur confirme, denominateur manque encore |
| **C7** | 8/10 | **8/10** | Stable | P054 compound PIDP sur 8 LLMs mais pas specifique LRM |

### Preuves formelles nouvellement extraites

| Preuve | Papier | Formule | Niveau |
|--------|--------|---------|--------|
| Theoreme 10 : gradient = 0 au-dela horizon de nocivite | P052 | F45 : I_t = Cov[E[H\|x<=t], score_function] | **Theoreme** |
| Sep(M) compromis separation-utilite | P024 | F15/F16 | **Theoreme** |
| KL equilibrium : D_KL^(t) proportionnel a I_t | P052 | F45 | **Corollaire** |
| Logit Gap = classifieur lineaire superficiel | P044 | F33b | **Lemme** |

### Preuves empiriques nouvellement extraites

| Resultat | Papier | Chiffre cle | Implication |
|---------|--------|-------------|-------------|
| 86.1% applications vulnerables | P001 | 31/36 apps | C1 evidence large |
| ASR medical 94.4% | P029 | 216 evaluations JAMA | C6 evidence forte |
| PIDP compound ASR 98% | P054 | 8 LLMs, 3 datasets | D-013 compound attacks |
| Judge flip 99.91% | P044 | Zero-shot | LLM-as-Judge invalide (ASR circulaire) |
| Shallow alignment tokens 1-3 | P018 | ICLR Outstanding | C3 evidence mecanistique |

### Actions ouvertes issues de ce lot

| Action | Priorite | Responsable |
|--------|----------|-------------|
| Chercher replications P052 martingale (1 seul papier Cambridge) | HAUTE | /bibliography-maintainer |
| Chercher si P044 AdvJudge a ete replique sur safety judges | CRITIQUE | /bibliography-maintainer |
| Chercher defenses contre compound PIDP (P054 n'en teste aucune) | HAUTE | /bibliography-maintainer |
| Concevoir experience calibration F46 Recovery Penalty | CRITIQUE | /aegis-prompt-forge |
| Tester PIDP compound sur RagSanitizer AEGIS | HAUTE | /aegis-prompt-forge |
| Judge fuzzing : nos templates AEGIS flippent-ils le juge ? | HAUTE | /aegis-prompt-forge |
| Formaliser ASR_deterministic base delta-3 patterns | CRITIQUE | MATHEUX + SCIENTIST |

---

## Update post-Deep-Analysis P001-P060 complet (2026-04-04)

> **Source** : Pipeline automatique post-analyse — 60 papiers analyses en profondeur (6 lots Opus, format doctoral, formules exactes)
> **Methode** : ChromaDB fulltext multi-collection (aegis_corpus + aegis_bibliography), modele Claude Opus
> **Papers couverts** : P001-P060 (corpus integral)
> **Date** : 2026-04-04

### Papiers SVC 10/10 — Preuves definitives

| Papier | Titre | Ref | Apport cle |
|--------|-------|-----|-----------|
| **P019** | Why Is RLHF Alignment Shallow? A Gradient Analysis | arXiv:2603.04851 [PREPRINT] | THEOREME formel : gradient = Cov(h_t, score_function) ; zero au-dela de l'horizon de nocivite (Theoreme 10, Eq. 28). Preuve mathematique directe que l'alignement superficiel est OPTIMAL pour l'objectif standard. Formules F44 (I_t martingale). |
| **P039** | GRP-Obliteration: Unaligning LLMs With a Single Unlabeled Prompt | arXiv:2602.06258, Microsoft Research [PREPRINT] | [ALGORITHME] Un seul prompt non etiquete suffit a desaligner 15 modeles (7-20B, 6 familles) tout en preservant l'utilite. Generalisation aux modeles de diffusion. Resultat le plus devastateur du corpus pour C1/C2/C3. |
| **P060** | SoK: Evaluating Jailbreak Guardrails for LLMs | arXiv:2506.10597, IEEE S&P 2026 [ARTICLE VERIFIE] | [SURVEY + EMPIRIQUE] 13 guardrails x 7 attaques. Framework SEU (Security-Efficiency-Utility). Resultat central : aucun guardrail ne domine sur les 3 dimensions. Valide architecturalement l'approche multi-couches delta-0 a delta-3 AEGIS. |

### Papiers SVC 9/10 — Preuves fortes

| Papier | Titre | Ref | Apport cle |
|--------|-------|-----|-----------|
| **P009** | Bypassing LLM Guardrails: Evasion Attacks against PI/Jailbreak Detection | arXiv:2504.11168 (Mindgard + Lancaster) | [EMPIRIQUE] Analyse empirique des attaques d'evasion contre les systemes de detection. Complement direct a P060 sur les faiblesses des guardrails. |
| **P023** | Safety Misalignment Against Large Language Models | DOI:10.14722/ndss.2025.241089, NDSS 2025 (CORE A*) | [EMPIRIQUE] SSRA : attaque en deux phases (safe-reply + misalignment attack). Evidence forte de desalignement exploitant les mecanismes de suivi contextuel. |
| **P026** | Overcoming the Retrieval Barrier: Indirect PI in the Wild | arXiv:2601.07072 (MBZUAI) | [EMPIRIQUE] IPI dans des environnements reels non controles. Premiere etude de faisabilite en conditions authentiques. Surface RAG validee pour les chaines d'attaque AEGIS. |
| **P028** | Towards Safe AI Clinicians: LLM Jailbreaking in Healthcare | arXiv:2501.18632 (PittNAIL) | [EMPIRIQUE] Jailbreaking specifique medical, taxonomy des vecteurs cliniques, 6 dimensions SVC. C6 evidence directe. Utilisable comme baseline AEGIS medical. |
| **P045** | System Prompt Poisoning: Persistent Attacks Beyond User Injection | arXiv:2505.06493 (University at Buffalo) [PREPRINT] | [EMPIRIQUE] SPP : poisoning persistent du prompt systeme. C2 fortement supportee : si le prompt systeme est compromis, delta-1 s'effondre. Nouveau vecteur d'attaque persistant. |
| **P048** | SLR on LLM Defenses Against PI and Jailbreaking: Expanding NIST Taxonomy | Preprint, soumis Computer Science Review 2026 [PREPRINT] | [SURVEY] Extension de la taxonomie NIST aux defenses contre PI/jailbreaking. 87 techniques recensees, compatible taxonomie AEGIS. Reference methodologique pour la classification defensive. |

### Impact sur les conjectures C1-C7

| Conjecture | Score RUN-003 | Score post-analyse | Variation | Justification |
|-----------|-------------|-------------------|-----------|---------------|
| **C1** | 10/10 | **10/10 RENFORCE** | Renforce | P039 (effacement 1 prompt, 15 modeles), P019 (zero gradient au-dela de l'horizon), P023 (SSRA exploitation desalignement) convergent. Saturation confirmee. |
| **C2** | 10/10 | **10/10 RENFORCE** | Renforce | P060 (aucun guardrail ne domine, IEEE S&P 2026) + P045 (SPP : delta-1 compromise via systeme prompt poisoning) + P048 (SLR : aucune defense seule ne resout) = validation multi-methodologique que delta-3 est necessaire. |
| **C3** | 10/10 | **10/10 RENFORCE** | Renforce | P019 : PREUVE FORMELLE que l'alignement superficiel est OPTIMAL pour l'objectif standard (pas un bug, une caracteristique structurelle). P039 efface cet alignement par 1 prompt. Convergence unique dans le corpus. |
| **C4** | 9/10 | **9/10** | Stable | P026 (IPI in the wild) supporte la mesurabilite en conditions reelles. Pas d'evidence directe de Sep(M) applique. Condition : experience N >= 30 encore requise. |
| **C5** | 8.5/10 | **8.5/10** | Stable | P009 (guardrails bypasses par embeddings proches) renforce l'insuffisance de cosinus seul. Pas de nouvelle evidence formelle. |
| **C6** | 9.5/10 | **9.5/10** | Stable | P028 (jailbreaking medical specifique) + P050 (JMedEthicBench, RUN-003) restent les preuves dominantes. |
| **C7** | 8/10 | **8/10** | Stable | P023 (SSRA planification multi-etapes), P026 (IPI exploitation semantique) supportent le paradoxe. Pas de seuil formel identifie. |

### Preuves formelles nouvellement consolidees

| Preuve | Papier | Formule | Niveau | Implication |
|--------|--------|---------|--------|-------------|
| Gradient zero au-dela horizon | P019 | Theoreme 10, Eq. 28 : zero gradient pour t > k | [THEOREME] | C1/C3 FERMEES — alignement superficiel est structurellement ineludable |
| Desalignement single-prompt | P039 | GRP-Oblit-1 : L(theta) avec un seul prompt benin | [ALGORITHME] | C1/C2 — effacement complet est praticable, pas theorique |
| Aucun guardrail ne domine | P060 | SEU(g) = (Sec, Eff, Util), Pareto non-dominant | [SURVEY EMPIRIQUE] | C2 — validation empirique large (13 guardrails, 7 attaques) |
| Safety Misalignment Attack | P023 | SSRA deux phases : safe-reply + misalignment | [ALGORITHME, NDSS A*] | C1 — exploitation du contexte multi-tour prouve |

### Actions ouvertes issues de l'analyse complete P001-P060

| Action | Priorite | Responsable | Papier source |
|--------|----------|-------------|---------------|
| Tester GRP-Oblit-1 sur modeles open-weight AEGIS (Llama, Mistral) | CRITIQUE | /aegis-prompt-forge | P039 |
| Valider SEU framework contre metriques AEGIS SVC | HAUTE | MATHEUX + SCIENTIST | P060 |
| Integrer SSRA dans les chaines d'attaque multi-tour AEGIS | HAUTE | Backend (attack_chains) | P023 |
| Tester SPP (System Prompt Poisoning) sur prompt systeme AEGIS | CRITIQUE | /aegis-prompt-forge | P045 |
| Aligner taxonomie P048 (87 defenses) avec taxonomie AEGIS (87 techniques) | MOYENNE | SCIENTIST | P048 |
| Evaluer IPI in-the-wild sur RagSanitizer AEGIS (P026 + P054) | HAUTE | /aegis-prompt-forge | P026 |
| Chercher replications empiriques de P019 martingale | HAUTE | /bibliography-maintainer | P019 |

---

## Update RUN-005 (2026-04-07)

> **Source** : REPORT_RUN005_MATHEUX.md + REPORT_RUN005_CYBERSEC.md + REPORT_RUN005_WHITEHACKER.md
> **Methode** : 15 papiers (P087-P102, excl. P088 doublon P036), analyses par 3 agents specialises
> **Axes thematiques** : LRM Safety (P087-P094) + Multi-Step Boundary Erosion (P097-P102)

### Tableau des changements RUN-005

| Conjecture | Score RUN-003 | Score RUN-005 | Variation | Justification cle |
|-----------|-------------|-------------|-----------|-------------------|
| **C1** | 10/10 | **10/10** | Stable (sature) | P092 (self-jailbreaking), P098 (degradation passive contexte long), P102 (concentration sparse ~50 tetes). Renforcement massif mais score deja au plafond. |
| **C2** | 10/10 | **10/10** | Stable (sature) | 0/15 papiers RUN-005 adressent δ³. Toutes les defenses proposees operent a δ⁰ (AHD, safety reasoning data). L'argument pour δ³ est irrefutable avec 73+ papiers. |
| **C3** | 10/10 | **10/10** | Stable (sature) | P102 fournit la PREUVE ARCHITECTURALE : securite concentree dans ~50 tetes sur ~1024. Definition meme de l'alignement superficiel au sens de Qi et al. (2025, ICLR). |
| **C4** | 9/10 | **9/10** | Stable | P097 (STAR) montre un drift monotone de la direction de refus mesurable au fil des tours, compatible avec Sep(M). Pas d'experience Sep(M) N >= 30 dans ce lot. |
| **C5** | 8.5/10 | **8.5/10** | Stable | Pas de nouvelle evidence directe dans ce lot. |
| **C6** | 9.5/10 | **9.5/10** | Stable | Pas de nouveau papier medical specifique dans ce lot. P050 (RUN-003) reste la preuve dominante. |
| **C7** | 8/10 | **9.5/10** | **+1.5** | 8 papiers convergents : P087 (H-CoT 94-98%), P089 (SEAL, raisonnement = vulnerabilite), P092 (self-jailbreaking sans adversaire), P094 (preuve mecanistique par activation probing), P102 (securite concentree dans ~50 tetes). Formulation structurelle du paradoxe. |
| **C8** | 6/10 | **6/10** | Stable | Pas d'evidence directe dans ce lot. |

### Evidence convergente pour C7 — 8 papiers RUN-005

| Papier | Evidence | Force | Type |
|--------|----------|-------|------|
| P087 (H-CoT) | Mocked CoT fait chuter refus de 98% a <2% sur o1 | Forte | Empirique |
| P089 (SEAL) | Raisonnement augmente vulnerabilite AUX chiffrements complexes | Forte | Empirique |
| P091 (WeakLink) | +32pp tree-of-attacks pire contre LRM, MAIS -29.8pp XSS meilleur | Nuance critique | Empirique |
| P092 (Self-JB) | Le modele se jailbreake LUI-MEME sans adversaire (25% -> 65% ASR) | Tres forte | Empirique |
| P093 (AdvReason) | Test-time compute scaling offensif bat le defensif (3x PAIR/TAP-T) | Supportee | Empirique |
| P094 (CoT-Hijack) | Signal de securite basse-dim se dilue monotoniquement avec CoT (probing causal) | **MECANISTIQUE** | Causale |
| P096 (Mastermind) | LRM pas plus resistants que LLM classiques en multi-tour (R1: 89%, o3: 90%) | Forte | Empirique |
| P102 (AHD) | Securite concentree dans ~50-100 tetes (fragilite structurelle) | **ARCHITECTURALE** | Mecanistique |

### Nouvelles formules associees (MATHEUX RUN-005)

| Formule | Nom | Papier | Nature |
|---------|-----|--------|--------|
| 9.1 | Transition d'Etats LRM | P087 | [EMPIRIQUE] |
| 9.2 | Entropie/Info Mutuelle Securite | P087 | [EMPIRIQUE] |
| 9.3 | Gradient Bandit SEAL | P089 | [ALGORITHME] |
| 9.4 | Loss Adversarial Reasoning | P093 | [ALGORITHME] |
| 9.6 | Direction de Refus + AHD | P102 | [ALGORITHME] |

### Actions ouvertes issues de RUN-005

| Action | Priorite | Responsable | Papier source |
|--------|----------|-------------|---------------|
| Tester T37 (CoT Hijacking puzzles) sur AEGIS LLaMA 3.2 | CRITIQUE | /aegis-prompt-forge | P094 |
| Tester T39 (Long-Context passive erosion) sur AEGIS | CRITIQUE | /aegis-prompt-forge | P098 |
| Implementer Crescendo (T40) comme nouvelle chaine d'attaque | HAUTE | Backend (attack_chains) | P099 |
| Tester AHD (P102) comme renforcement δ⁰ sur LLaMA 3.2 | HAUTE | /aegis-prompt-forge | P102 |
| Ajouter cipher-pattern detection au RagSanitizer | HAUTE | Backend (rag_sanitizer) | P089 |
| Formaliser C7 dans le manuscrit Chapitre 4 avec nuance P091 | HAUTE | SCIENTIST | P087-P094 |
| Integrer SafeDialBench (P101) comme complement au SVC | MOYENNE | SCIENTIST | P101 |
| Creer attaque composee T39+T40 (contexte long + Crescendo) | HAUTE | /aegis-prompt-forge | P098, P099 |
