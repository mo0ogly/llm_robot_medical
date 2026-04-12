# DISCOVERIES INDEX — Decouvertes Majeures de la These AEGIS

> **Ce repertoire est la MEMOIRE VIVANTE des decouvertes scientifiques.**
> Tous les agents DOIVENT le lire AVANT de travailler et le mettre a jour APRES.
> Les decouvertes evoluent a chaque RUN — elles ne sont jamais figees.

**Derniere mise a jour** : RUN-008 scoped note integration P128-P130 (2026-04-09)
**Corpus** : 130 articles (P001-P130, excl. P088/P105/P106). Dernieres additions : RUN-007 P122-P127 (OWASP x2, CAPTURE, Systematic Analysis, Design Patterns Tramer, IPI Competition) puis RUN-008 P128-P130 (Kang Programmatic Behavior, CodeAct Wang ICML 2024, ToolSandbox Lu Apple NAACL 2025).

---

## Decouvertes Classees par Impact

### CRITIQUE (change la direction de la these)

| ID | Decouverte | RUN | Confiance | Fichier |
|----|-----------|-----|-----------|---------|
| D-001 | **Triple Convergence** : δ⁰ effacable (P039, preuve formelle P052) + δ¹ empoisonnable (P045, RAG P054/P055) + juges bypass 99% (P044, P049 100%) = les 3 premieres couches simultanement vulnerables. δ³ seul survivant. **NUANCE TC-002 : la convergence est ANTAGONISTE, pas additive** — combiner les couches REDUIT l'ASR (δ¹ seul = 33% vs δ⁰+δ¹+δ² = 20% sur 70B). Score baisse de 10/10 a 8/10. | RUN-002→TC-002 | **8/10** | [TRIPLE_CONVERGENCE.md](TRIPLE_CONVERGENCE.md) |
| D-023 | **Bimodalite des vulnerabilites de chaine** : Les vulnerabilites RAG/agent sont bimodales, pas distribuees continues. THESIS-001 (N=1200, Groq 8B) : 33/40 chaines a 0% ASR, 2/40 a 96.7% ASR, tres peu de chaines intermediaires. L'ASR global de 6.75% masque cette distribution. Les rapports thesis doivent reporter **par chaine**, pas en agrege. | THESIS-001 | **9/10** | [EXPERIMENT_REPORT_THESIS_001.md](../experiments/EXPERIMENT_REPORT_THESIS_001.md) |
| D-024 | **HyDE self-amplification** : Le modele cible genere lui-meme un document hypothetique contenant les payloads d'attaque avec autorite fabriquee (references FDA fictives, classifications de securite inventees), puis utilise ce document comme contexte. Boucle d'auto-injection amplifiee : 96.7% ASR (29/30) sur llama-3.1-8b-instant. **Aucun papier du corpus (P001-P121) n'identifie HyDE comme vecteur d'attaque endogene pre-retrieval** — contribution originale de la these. Sep(M) par chaine = 0.9667 (vs 0.067 global). **POSITIONNEMENT P117-P121** : Baseline seminal P118 Gao et al. 2023 ACL "may contain false details... dense bottleneck filters false details" (Section 3.2, p.3-4) — claim NON verifiee, D-024 est le contre-exemple. Benign analog P117 Yoon et al. 2025 ACL Findings demontre empiriquement que HyDE fuit des connaissances memorisees (Section 4, Table 4, p.5) — meme mecanisme, framing benin sans "attack/adversarial/injection". Contrast P119 PR-Attack SIGIR 2025 (91-100% ASR mais necessite compromis corpus+soft prompt), P120 HijackRAG arXiv:2410.22832 (0.91-0.97 ASR mais necessite injection corpus), P121 Clop & Teglia arXiv:2410.14479 (0.97-1.0 ASR mais necessite fine-tuning du retriever). **D-024 n'a besoin de RIEN** : pas de corpus poisoning, pas de compromis retriever, pas de prompt orchestrateur corrompu, pas de fine-tuning. | THESIS-001 + P117-P121 | **10/10** | [EXPERIMENT_REPORT_THESIS_001.md](../experiments/EXPERIMENT_REPORT_THESIS_001.md) |
| D-025 | **Parsing Trust exploit** : XML Agent atteint 96.7% ASR avec un SVC dimensionnel de seulement 0.11 (LOW POTENTIAL selon le scoring classique). Le modele "parse" et "valide" les tags XML de l'attaquant comme legitimes (`<calibration_update>` → "Valid XML structure"). Cette classe d'attaque n'est pas capturee par les 6 dimensions SVC standard. **Necessite d7 (Parsing Trust)** comme nouvelle dimension SVC. | THESIS-001 | **9/10** | [EXPERIMENT_REPORT_THESIS_001.md](../experiments/EXPERIMENT_REPORT_THESIS_001.md) |
| D-002 | **Gap δ³ medical** : La classe δ³ (enforcement externe post-output) est implementee dans CaMeL (DeepMind, arXiv:2503.18813), AgentSpec (ICSE 2026, arXiv:2503.18666), LlamaFirewall (Meta, arXiv:2505.03574). Cependant, AUCUN de ces systemes ne l'instancie dans le domaine chirurgical medical avec contraintes physiques (parametres physiologiques, outils interdits). AEGIS est le premier prototype connu dans ce domaine precis. P060 (SoK, IEEE S&P) confirme que δ³ est la couche la moins exploree. | RUN-001→005 | 8/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-003 | **Alignement effacable** : Un seul prompt suffit a desaligner 15 LLMs (P039, Microsoft). L'alignement n'est pas contournable — il est effacable. | RUN-002 | 9/10 | [TRIPLE_CONVERGENCE.md](TRIPLE_CONVERGENCE.md) |

### HAUTE (renforce un argument majeur)

| ID | Decouverte | RUN | Confiance | Fichier |
|----|-----------|-----|-----------|---------|
| D-004 | **Paradoxe raisonnement/securite** : La capacite de raisonnement des LRM correle negativement avec la securite. 97.14% ASR autonome (P036, Nature Comms). | RUN-002 | 7/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-005 | **Amplification emotionnelle medicale** : La manipulation emotionnelle multiplie par 6 le taux de desinformation medicale (6.2% → 37.5%, P040). | RUN-002 | 8/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-006 | **CHER ≠ ASR** : Le taux de reussite d'attaque (ASR) et le dommage clinique reel (CHER) divergent substantiellement. Mesurer l'ASR seul est insuffisant en medical. (P035, MPIB) | RUN-002 | 8/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-007 | **Gradient d'alignement nul** : Preuve mathematique que le gradient RLHF est zero au-dela de l'horizon de nocivite (P019). Limitation structurelle, pas d'implementation. | RUN-001 | 10/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-008 | **Insuffisance δ⁰ prouvee** : 27/34 papers Phase 1 (79.4%) + 4 papers Phase 2 supportent C1. Score de confiance : 10/10. | RUN-001→002 | 10/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |

### MOYENNE (ouvre une piste)

| ID | Decouverte | RUN | Confiance | Fichier |
|----|-----------|-----|-----------|---------|
| D-009 | **System Prompt = vecteur d'attaque** : SPP (P045) montre que le system prompt, suppose de confiance, est un vecteur persistant. Toute session est affectee. | RUN-002 | 8/10 | [TRIPLE_CONVERGENCE.md](TRIPLE_CONVERGENCE.md) |
| D-010 | **Cosine similarity fragile** : La similarite cosinus (all-MiniLM-L6-v2) peut etre rendue insignifiante par matrice gauge (P012) et a des angles morts (antonymes, P013). | RUN-001 | 7/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-011 | **Erosion temporelle passive** : Les disclaimers medicaux chutent de 26.3% (2022) a 0.97% (2025) SANS attaque active (P030). | RUN-001 | 8/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-012 | **Benchmark renouvelable** : JBDistill (P043) propose des benchmarks qui se renouvellent automatiquement, reconnaissant la peremption rapide des evaluations statiques. | RUN-002 | 7/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-013 | **Attaque RAG composee** : La combinaison injection de prompt + empoisonnement base vectorielle (PIDP, P054) produit un gain super-additif de 4-16pp. L'empoisonnement persistant (P055, ~275K vecteurs) cree une surface d'attaque durable affectant toutes les requetes futures. | RUN-003 | 9/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-014 | **Preuve formelle superficialite RLHF** : P052 (Cambridge) prouve par decomposition en martingale que le gradient RLHF est exactement I_t = Cov[E[H|x<=t], score_function]. I_t decroit rapidement au-dela des premiers tokens. C'est la preuve MATHEMATIQUE (vs. empirique P019) de C3. | RUN-003 | 10/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-015 | **ASIDE comme reponse architecturale partielle** : P057 (Zverev et al., suite de Sep(M) ICLR 2025) montre qu'une rotation orthogonale des embeddings de donnees separe instructions/donnees sans perte d'utilite. Premier mecanisme concret qui POURRAIT resoudre D-001, mais non deploye et non teste contre attaques adaptatives. | RUN-003 | 8/10 | [TRIPLE_CONVERGENCE.md](TRIPLE_CONVERGENCE.md) |
| D-016 | **Degradation multi-tour medicale** : P050 (JMedEthicBench) montre une degradation de securite de 9.5 a 5.5 (p<0.001) sur 22 modeles au fil des tours. Les modeles specialises medicaux sont PLUS vulnerables que les generalistes. Cross-lingue (japonais-anglais). | RUN-003 | 9/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-017 | **Self-jailbreaking sans adversaire** : P092 (Yong & Bach 2025) montre que le reasoning training degrade directement l'alignement RLHF. ASR passe de 25% a 65% apres entrainement au raisonnement sur s1.1-32B (Figure 2, p. 4). Le modele genere ses propres justifications pour contourner ses gardes — forme la plus extreme du paradoxe raisonnement/securite (C7). Aucun adversaire externe requis. | RUN-005 | 9/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-018 | **Test-time compute scaling offensif** : P093 (Sabbaghi et al. 2025) demontre que le scaling du compute au moment du test s'applique aux attaques, pas seulement aux taches utiles. L'adversarial reasoning atteint 64% ASR (3x PAIR/TAP-T) avec transfert a 56% sur o1-preview. Le compute offensif bat le compute defensif — brisant l'hypothese implicite que plus de compute = plus de securite. | RUN-005 | 8/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-019 | **Signal de securite basse dimension dilutable** : P094 (Zhao et al. 2026) fournit la preuve mecanistique par activation probing que le signal de securite (direction de refus) occupe un sous-espace basse dimension qui se dilue monotoniquement avec la longueur du CoT. ASR 99% Gemini 2.5 Pro, 94% Claude 4 Sonnet, 100% Grok 3 Mini (Table 1, p. 3). Co-auteur Anthropic (Mrinank Sharma). Explication causale de C7. | RUN-005 | 10/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-020 | **Compliance partielle accumulatif multi-tour** : P095 (Tempest, tree search) et P096 (Mastermind, knowledge-driven 60% GPT-5, 89% R1) demontrent que les attaques multi-tour exploitent l'accumulation de compliances partielles. Chaque tour benin fait devier le modele de sa direction de refus. Le drift est monotone (P097 STAR) et mesurable. Le modele ne refuse jamais completement — il cede progressivement. | RUN-005 | 9/10 | [TRIPLE_CONVERGENCE.md](TRIPLE_CONVERGENCE.md) |
| D-021 | **Knowledge repository adversarial auto-evolutif** : P096 (Mastermind, Ren et al. 2026) introduit un systeme multi-agent qui accumule autonomement des connaissances sur les succes et echecs d'attaque, puis adapte sa strategie. Le systeme s'auto-ameliore sans intervention humaine — premier exemple de red team autonome avec memoire persistante. Implication : les defenses statiques seront systematiquement depassees. | RUN-005 | 8/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |
| D-022 | **Paradoxe δ⁰/δ¹** : Effacer le prompt systeme (δ⁰) REDUIT l'efficacite du contexte empoisonne (δ¹). Sur 70B, δ¹ seul = 33% ASR mais δ⁰+δ¹ = 17% (TC-002, N=30, Groq llama-3.3-70b-versatile). Le prompt systeme est a la fois PROTECTION (instruction-following pour les regles) et VECTEUR (instruction-following pour le poison). Implication : la convergence des couches est antagoniste, pas additive — l'attaquant optimal doit choisir ses vecteurs, pas les combiner. | TC-002 | 8/10 | [TRIPLE_CONVERGENCE.md](TRIPLE_CONVERGENCE.md) |

### MOYENNE (ouvre une piste) — ajouts RUN-008

Trois decouvertes issues de l'integration scoped P128-P130 (Kang / CodeAct / ToolSandbox) declenchee par la verification bibliographique de la note `Note_Academique_Context_Isolated_Adversarial_Workflow.md`. **Note : les proposals initiales de l'ANALYST sub-agent utilisaient les IDs D-021/D-022/D-023 (collision avec existant). Renumerotees D-026/D-027/D-028 lors du commit, prochain libre apres D-025.**

| ID | Decouverte | RUN | Confiance | Fichier |
|----|-----------|-----|-----------|---------|
| D-026 | **Asymmetrie economique attaquant/defenseur** : P128 (Kang, Li, Stoica, Guestrin, Zaharia, Hashimoto, 2023, arXiv:2302.05733) documente un cout d'attaque de **$0.0064-$0.016 USD par generation** (email malveillant genere via payload splitting sur ChatGPT + text-davinci-003, Section 6 "Economic Analysis") versus **$0.10 par generation humaine** (Kang et al. 2023 citant Holman et al. 2007). Le ratio effectif est donc **~6.25x-15.6x** en faveur de l'attaquant ($0.10/$0.016 = 6.25x au bas de gamme LLM, $0.10/$0.0064 = 15.6x au haut de gamme), pas les 125-500x initialement reportes par l'ANALYST sub-agent. L'asymmetrie economique structure neanmoins le paysage de la menace : les defenses cost-efficacement deployables sont une contrainte de conception majeure. Supporte C1 (fragilite structurelle de l'alignement), C4 (echec separation instructions/donnees via payload splitting), C5 (dimension economique absente des benchmarks). **CROSS-VALIDATED 2026-04-09 post-audit** contre `literature_for_rag/P128_2302.05733.pdf` (pypdf extraction, 14 pages, 53001 chars) : `$0.0064` (3 matches), `$0.016` (2 matches), `text-davinci-003` (8 matches), `payload splitting` (3 matches), `human generation may cost as much as $0.10` (1 match) — tous confirmes sauf le ratio 125-500x qui etait une extrapolation incorrecte, corrigee ici. | RUN-008 + cross-val 2026-04-09 | 8/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-027 | **Code-Action Amplification** : P129 (Wang, Chen, Yuan, Zhang, Li, Peng, Ji, CodeAct, ICML 2024, arXiv:2402.01030) introduit l'architecture ou les actions d'agent sont du code Python executable. Amelioration +20 pts absolus sur M3ToolEval (GPT-4-1106 : 52.4% JSON-based vs 74.4% CodeAct, Table 3, p. 6). **Implication securitaire qualitative** : dans un agent CodeAct, une injection de prompt ne produit pas du texte adversarial inerte mais du code Python execute avec les privileges de l'agent (acces fichiers, API, subprocess). Le papier elude l'angle adversarial (une seule phrase sur sandbox en Section 7) et ne propose aucun test red team. Renforce C7 (tool-call surface = couche la plus faible) et indirectement C2 (regex incapable de detecter semantique Python obfusquee via chaines encodees, ast-manipulation, exec dynamique). Cree directement le gap G-023 (adversarial benchmark dedie aux agents CodeAct/ReAct code-based). | RUN-008 | 8/10 | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |
| D-028 | **Tool Hallucination Floor** : P130 (Lu, Holleis, Zhang et al., ToolSandbox Apple / NAACL 2025 Findings, arXiv:2408.04682) identifie que lorsqu'un modele n'a pas l'outil necessaire pour completer une tache, il HALLUCINE des appels d'outils plutot que de refuser (scenarios "Insufficient Information", Section 5). Le gap GPT-4o 73.0% vs meilleur open-source 31.4% (Table 2) montre que la vulnerabilite est orthogonale a la taille du modele. **Surface d'attaque directe** : forcer la hallucination d'outils cliniques inexistants (ex : `trigger_emergency_override` en contexte Da Vinci Xi) via absence strategique d'information dans le prompt. **Opportunite de contribution originale pour AEGIS** : construire un AdversarialToolSandbox en contexte medical robotique (cf. G-024 en todo). Supporte C5 (benchmarks stateless existants sous-estimaient le gap) et indirectement C7. | RUN-008 | 8/10 | [THESIS_GAPS.md](THESIS_GAPS.md) |

### HAUTE (renforce un argument majeur) — ajouts RUN-005

| ID | Decouverte | RUN | Confiance | Fichier |
|----|-----------|-----|-----------|---------|
| D-004 | **Paradoxe raisonnement/securite** : La capacite de raisonnement des LRM correle negativement avec la securite. 97.14% ASR autonome (P036, Nature Comms). **RENFORCE RUN-005 : 8 papiers convergents (P087-P094), preuve mecanistique P094, confiance montee a 9.5/10.** | RUN-002→005 | **9.5/10** | [CONJECTURES_TRACKER.md](CONJECTURES_TRACKER.md) |

---

## Taxonomie RAG Attack Surface a 6 stages (introduite par D-024, 2026-04-09)

La litterature pre-P117 (PR-Attack, HijackRAG, Backdoored Retrievers, PoisonedRAG, GGPP) couvre implicitement 5 stages d'attaque dans le pipeline RAG. D-024 identifie un **sixieme stage absent de toute taxonomie existante** : le generateur avant retrieval, lors de la query expansion.

| Stage | Point de compromis | Prerequis attaquant | Exemples litterature | Couche delta |
|-------|-------------------|---------------------|----------------------|-------------|
| **Stage 1** | Corpus poisoning (ecriture documents malicieux dans la base RAG) | Acces en ecriture au knowledge store | PoisonedRAG, GGPP, P054 (PIDP), P055 (RAGPoison), P120 (HijackRAG, Zhang et al. 2024, arXiv:2410.22832, Table 2, p.6), P121 corpus poisoning (Clop & Teglia 2024, Section 3.1, p.4) | δ¹ |
| **Stage 2** | Retriever training (backdoor fine-tuning du modele retriever) | Distribution d'un dataset poisonne via supply chain ML | P121 backdoor branch (Clop & Teglia 2024, Section 3.2, Table 3, p.5) | δ¹ |
| **Stage 3** | Retrieval mechanism (optimisation adversariale contrainte par top-k similarity) | Connaissance du retriever + acces en ecriture corpus | P120 HijackRAG black-box/white-box (Zhang et al. 2024, Eq. 1, p.2) | δ¹ |
| **Stage 4** | Prompt layer (soft prompt / trigger word backdoor dans l'orchestrateur) | Compromis developpeur ou composant pipeline | P119 PR-Attack (Jiao et al. 2025, SIGIR, Section 3.2, p.4, trigger 'cf') | δ² |
| **Stage 5** | Generator post-retrieval (prompt injection classique du LLM avec contexte recupere) | Acces prompt user | P001 (Liu et al. 2023), P006, P026, P044, P058, P059 | δ⁰, δ¹ |
| **Stage 6** | **Generator pre-retrieval, query-expansion (D-024 NOUVEAU)** | **AUCUN** — l'attaquant n'a besoin ni d'acces corpus, ni de compromis retriever, ni de trigger soft prompt, ni de fine-tuning. La requete utilisateur benigne suffit a declencher le LLM qui fabrique un document hypothetique hostile reinjecte dans l'embedding de la query etendue. | **D-024 (AEGIS, 2026-04, THESIS-001, 96.7% ASR sur llama-3.1-8b-instant)** ; baseline seminal P118 (Gao et al. 2023, ACL, Section 3.2, p.3-4 — claim "dense bottleneck filters false details" refutee) ; benign analog P117 (Yoon et al. 2025, ACL Findings, Section 4, Table 4, p.5 — knowledge leakage empiriquement demontree) | δ¹, δ² |

**Implication :** les stages 1-5 exigent tous un prerequis operationnel (acces corpus, fine-tuning, compromis developpeur, acces prompt). Le stage 6 n'exige RIEN — c'est le modele qui se trahit lui-meme dans le pipeline que les defenseurs considerent comme "cote serveur sain". Les defenses contre stages 1-5 (sanitizers corpus, attestation retriever, whitelist triggers, perplexity filtering) ne couvrent pas le stage 6. D-024 cree donc un nouveau gap defensif : G-042 (voir THESIS_GAPS.md).

**Citation obligatoire pour la these** : `(Jiao et al., 2025, SIGIR, Section 3, p.4-5 ; Zhang et al., 2024, arXiv:2410.22832, Eq. 1, p.2 ; Clop & Teglia, 2024, arXiv:2410.14479, Section 3.2, p.4-5 ; Yoon et al., 2025, ACL Findings, Section 4, p.5 ; Gao et al., 2023, ACL, Section 3.2, p.3-4)`.

---

## Historique des Decouvertes par RUN

| RUN | Decouvertes ajoutees | Decouvertes modifiees | Total |
|-----|---------------------|----------------------|-------|
| RUN-001 | D-002, D-007, D-008, D-010, D-011 | — | 5 |
| RUN-002 | D-001, D-003, D-004, D-005, D-006, D-009, D-012 | D-002 (confiance 9→10), D-008 (confiance 9→10) | 12 |
| RUN-003 | D-013, D-014, D-015, D-016 | D-001 (confiance 9→10), D-002 (description enrichie 60 papers) | 16 |
| RUN-005 | D-017, D-018, D-019, D-020, D-021 | D-004 (confiance 7→9.5, 8 papiers convergents), D-002 (description enrichie 102 papers) | 21 |
| TC-002 | D-022 | D-001 (confiance 10→8, convergence antagoniste refute additivite) | 22 |
| HyDE-P117-P121 | Taxonomie 6-stages (nouvelle section) | D-024 (confiance 9→10, positionnement canonique par P117-P121 : baseline P118, benign analog P117, contrasts P119/P120/P121) | 22 |
| RUN-008 | D-026 (Kang asymmetrie economique), D-027 (CodeAct amplification), D-028 (ToolSandbox hallucination floor) | — | 25 |

---

## Regles pour les Agents

1. **AVANT chaque RUN** : Lire DISCOVERIES_INDEX.md + fichiers references
2. **PENDANT le travail** : Chercher activement de nouvelles decouvertes dans les papers analyses
3. **APRES le RUN** : Mettre a jour ce fichier + creer/modifier les fichiers de decouverte
4. **Criteres pour une nouvelle decouverte** :
   - Supportee par >= 2 papers
   - Change la comprehension d'un axe de recherche OU ouvre un nouveau gap
   - Quantifiable (score de confiance, nombre de papers, metrique)
5. **Evolution des decouvertes** :
   - Confiance peut monter OU descendre selon les nouvelles preuves
   - Une decouverte peut etre INVALIDEE si contredite par >= 3 papers forts
   - Toujours documenter le POURQUOI du changement
6. **ID collision prevention (OBLIGATOIRE)** : Avant de proposer un D-ID, appeler :
   ```
   python backend/tools/check_corpus_dedup.py --next-discovery
   ```
   Ne JAMAIS proposer un D-ID de memoire ou par inference sequentielle. Seul
   `get_next_discovery_id()` est la source de verite. **Historique bug** : RUN-008
   ANALYST sub-agent a propose D-021/D-022/D-023 sans lire ce fichier — meme classe
   de bug que la re-verification Crescendo (arXiv:2404.01833 = P099 deja present).
   Correction post-hoc requise : renumerotation en D-026/D-027/D-028.

---

## VERIFICATION_DELTA3_20260411 — Ajout SCIENTIST 2026-04-11

### D-029 CANDIDATE — Pattern δ³ academiquement etabli depuis 2022, AEGIS = specialisation medicale

**Observation** : la verification scoped VERIFICATION_DELTA3_20260411 a revele que le pattern
`validate_output + specification formelle` est academiquement etabli depuis LMQL
(Beurer-Kellner, Fischer, Vechev, 2022, arXiv:2212.06094, PLDI 2023 CORE A*, P134) et
industriellement adopte depuis 2023 (Guardrails AI P132, LLM Guard P133). AEGIS n'est PAS
l'inventeur du pattern (8-9e implementation connue) mais sa **premiere specialisation
medicale chirurgicale** avec contraintes biomecaniques FDA-ancrees pour le robot Da Vinci Xi.

**Liste ordonnee des implementations δ³ publiques identifiees** (par date de premiere publication) :
1. **LMQL** (ETH Zurich, 2022-12, PLDI 2023 CORE A*, arXiv:2212.06094, P134) — precurseur academique peer-reviewed, DSL constraint-driven decoding
2. **Guardrails AI** (2023, industriel, ~6700 stars GitHub, Apache 2.0, P132) — framework Python Pydantic-based
3. **LLM Guard** (Protect AI, 2023, industriel, ~2800 stars, MIT, P133) — 36 scanners multi-detection (partiellement δ³)
4. **CaMeL** (Debenedetti et al., 2025, arXiv:2503.18813, P081) — capability-based access control
5. **AgentSpec** (Wang et al., 2025, ICSE, arXiv:2503.18666, P082) — runtime declarative enforcement
6. **LlamaFirewall CodeShield** (Chennabasappa et al., 2025, Meta AI, arXiv:2505.03574, P084) — analyse statique code-domain
7. **RAGShield** (2026, arXiv:2604.00387, P066) — RAG output validation
8. **AEGIS** (ENS, 2026) — **premiere specialisation medicale chirurgicale FDA-ancree Da Vinci Xi** : contraintes biomecaniques formelles (tension 50-800 g, `forbidden_tools` par phase chirurgicale, directives HL7 OBX coherentes avec l'ontologie SNOMED-CT).

**Confiance** : **9/10** (evidence solide, 7+ frameworks publics verifies par Keshav 3-pass + MITRE ATLAS + OWASP LLM Top 10 cross-check)

**Papers concernes** : P084 LlamaFirewall (2025-05), P131 npj DM Weissman (2025-03), P132 Guardrails AI (2023), P133 LLM Guard (2023), P134 LMQL (2022-12), P081 CaMeL (2025), P082 AgentSpec (2025), P066 RAGShield (2026)

**Impact sur la these** :
- **Retirer** toute revendication de primeur sur le pattern generique δ³ (wiki delta-3.md §1)
- **Positionner** AEGIS strictement comme **specialisation medicale chirurgicale avec ancrage FDA 510k**, pas comme "quatrieme implementation"
- **Citer** l'autorite peer-reviewed Nature portfolio P131 Weissman et al. (2025) comme justification reglementaire publique du besoin

**Status** : CANDIDATE → needs one more review cycle (RUN+1 experimentalist campaign N>=30) before VALIDATED

**Source SCIENTIST** : `_staging/scientist/VERDICT_FINAL_VERIFICATION_DELTA3_20260411.md`
**Converge avec** : G-063 (nouveau gap SCIENTIST), verdicts NUANCED unanimes des 5 agents precedents (ANALYST, MATHEUX, CYBERSEC, WHITEHACKER, LIBRARIAN)

**Signature** : SCIENTIST RUN VERIFICATION_DELTA3_20260411, 2026-04-11
