# DISCOVERIES INDEX — Decouvertes Majeures de la These AEGIS

> **Ce repertoire est la MEMOIRE VIVANTE des decouvertes scientifiques.**
> Tous les agents DOIVENT le lire AVANT de travailler et le mettre a jour APRES.
> Les decouvertes evoluent a chaque RUN — elles ne sont jamais figees.

**Derniere mise a jour** : HyDE-security batch P117-P121 (2026-04-09)
**Corpus** : 121 articles (P001-P121, excl. P088/P105/P106)

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
