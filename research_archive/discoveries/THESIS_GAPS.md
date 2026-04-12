# THESIS GAPS — Opportunites de Contribution Originale

> **Ce fichier identifie les GAPS dans la litterature ou AEGIS peut contribuer.**
> Chaque gap est une opportunite de publication ou de chapitre de these.
> Derniere mise a jour : RUN-006 peer-preservation batch P114-P116 (2026-04-08)

---

## Gaps Classes par Priorite

### PRIORITE 1 — Contribution unique (aucun autre travail ne couvre)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-001 | **Aucun paper n'implemente δ³ specialise medical chirurgical FDA** (reformule 2026-04-11) | Verification 2026-04-11 : 7 implementations δ³ generiques identifiees (LMQL PLDI 2023, Guardrails AI 2023, LLM Guard 2023 partiel, P081 CaMeL, P082 AgentSpec, P131 LlamaFirewall Meta 2025, P066 RAGShield). P037 (survey) + P060 (SoK, IEEE S&P 2026) ne couvrent toujours que 3 couches. AUCUNE implementation ne specialise le domaine medical chirurgical avec contraintes biomecaniques FDA-ancrees. | AEGIS validate_output + AllowedOutputSpec = 8eme implementation publique mais 1ere medicale chirurgicale FDA | PARTIELLEMENT CLOSED pour le pattern generique, OUVERT pour la specialisation medicale. Voir G-NEW-1. |
| G-002 | **Pas d'evaluation multi-couches combinee** | Papers evaluent les couches isolement. Aucune etude de leur interaction combinee. | AEGIS evalue δ⁰+δ¹+δ²+δ³ ensemble | OUVERT |
| G-003 | **Pas de red-teaming medical systematique** | P029 = 5 modeles, N=5. P035 = benchmark mais pas de red-team operationnel. P040 = 112 scenarios mais sans framework. | AEGIS a 98 templates + 48 scenarios medicaux | OUVERT |

### PRIORITE 2 — Contribution differenciante (peu de travaux concurrents)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-004 | **CHER non integre dans les frameworks de defense** | P035 introduit CHER mais ne l'integre dans aucune defense. | Integrer CHER dans le pipeline SVC d'AEGIS | ACTIONNABLE |
| G-005 | **Pas de defense contre LRM autonomes** | P036 documente la menace mais aucun paper ne propose de defense. | AEGIS peut tester et proposer des defenses | ACTIONNABLE |
| G-006 | **Pas de verification d'integrite du system prompt** | P045 documente SPP mais aucune defense proposee. | Ajouter hash/signature du system prompt a AEGIS | ACTIONNABLE |
| G-007 | **Pas de detection de manipulation emotionnelle** | P040 documente l'amplification 6x mais aucun detecteur propose. | Ajouter emotional_sentiment_guard au RagSanitizer | ACTIONNABLE |
| G-008 | **Pas de benchmark renouvelable pour le medical** | P043 (JBDistill) propose des benchmarks renouvelables mais pas pour le medical. P107 (MedSafetyBench, NeurIPS 2024) adresse partiellement (single-turn, 900 prompts). P108 (JMedEthicBench, 2345 conversations) adresse le multi-tour mais en japonais. | AEGIS peut adapter JBDistill au domaine medical ; P107+P108 fournissent des baselines | PARTIELLEMENT ADRESSE (P107, P108) |

### PRIORITE 3 — Contribution incrementale (renforce l'existant)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-009 | **Sep(M) pas encore valide avec N >= 30** | P024 exige N >= 30. AEGIS n'a pas encore publie ces resultats. | Benchmark MPIB (P035, 9697 instances) est maintenant disponible | A EXECUTER |
| G-010 | **Cosine similarity non calibree** | P012 (matrice gauge) + P013 (antonymes). | Tester all-MiniLM-L6-v2 sur MPIB + calibrer | A EXECUTER |
| G-011 | **Pas de test triple convergence** | D-001 est theorique. Personne n'a simule δ⁰ efface + δ¹ empoisonne + δ² fuzzed. | AEGIS peut le simuler experimentalement | A CONCEVOIR |
| G-012 | **Pas de monitoring temporel de l'alignement** | P030 documente l'erosion sur 3 ans mais personne ne monitore en temps reel. | Le telemetry bus d'AEGIS peut tracker Sep(M) dans le temps | A IMPLEMENTER |

### PRIORITE 4 — Gaps identifies RUN-003 (P047-P060)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-013 | **Dualite attaque-defense non testee sur composites** | P047 formalise la dualite mais ne la teste pas sur attaques multi-vecteurs. | AEGIS 98 templates + 48 scenarios = terrain de test ideal | OUVERT |
| G-014 | **Heterogeneite metriques d'evaluation** | P048 (88 etudes SLR) montre que les metriques d'evaluation divergent entre etudes. | AEGIS peut standardiser via Sep(M) + SVC + SEU (P060) | ACTIONNABLE |
| G-015 | **Recovery penalty non evaluee empiriquement** | P052 propose une correction theorique du gradient RLHF mais sans validation large echelle. P110 (Princeton) fournit la preuve formelle du mecanisme (AIC + loi quartique) mais la validation empirique reste sur petits modeles (1.7B, 3B). | AEGIS peut valider sur LLaMA 3.2 medical via Ollama ; P110 fournit le cadre theorique. | FORMELLEMENT ADRESSE (P110), EMPIRIQUE A VALIDER |
| G-016 | **Attaques multimodales non couvertes** | P053 identifie les vecteurs multimodaux (texte+image) non couverts par le catalogue AEGIS (texte-only). | Extension future du catalogue | A CONCEVOIR |
| G-017 | **RagSanitizer vs. attaques composites PIDP** | P054 PIDP-Attack combine injection + empoisonnement DB. Le RagSanitizer n'a pas ete teste contre cette combinaison. | Test immediat possible avec les chaines d'attaque AEGIS existantes | A EXECUTER |
| G-018 | **AIR non evalue contre attaques semantiques** | P056 (NVIDIA) ne teste AIR que contre attaques gradient-based, pas semantiques ou multi-tour. | AEGIS peut tester si les signaux AIR resistent aux 48 scenarios | A CONCEVOIR |
| G-019 | **ASIDE non teste contre attaques adaptatives** | P057 ne teste pas ASIDE contre des attaques ciblant specifiquement la rotation orthogonale. | Protocole concu : 50 variantes (5 operateurs x 10), 4 schedules rotation, 6000 runs. Fonde sur P077 (shortcuts) + P079 (ES2) + P080 (DefensiveTokens). | PROTOCOL_READY (2026-04-06) |
| G-020 | **Defenses agents non evaluees** | P058 (ETH) documente les attaques agent-level mais aucune defense (tool sandboxing, memory isolation) n'est evaluee. | AEGIS medical robot agent = terrain de test naturel | ACTIONNABLE |
| G-021 | **Guardrails emergents hors SoK** | P060 (SoK, IEEE S&P 2026) ne couvre pas ASIDE (P057) ni AIR (P056), les defenses les plus prometteuses. | AEGIS peut evaluer ASIDE + AIR + integrer dans le formal framework | OUVERT |

---

## Matrice Gap × Chapitre de These

| Gap | Chapitre Suggere | Type de Publication |
|-----|-----------------|-------------------|
| G-001 (δ³ implementation) | Chapitre Defense | **Conference** (ICLR/NeurIPS Workshop) |
| G-002 (evaluation combinee) | Chapitre Evaluation | **Journal** (IEEE S&P) |
| G-003 (red-team medical) | Chapitre Medical | **Journal** (JAMA/Lancet Digital Health) |
| G-004 (CHER + SVC) | Chapitre Metriques | **Workshop** |
| G-005 (defense anti-LRM) | Chapitre Defense | **Conference** (si resultats positifs) |
| G-006 (integrite system prompt) | Chapitre Defense | **Short paper** |
| G-011 (test triple convergence) | Chapitre Evaluation | **Conference** (si resultats significatifs) |
| G-015 (recovery penalty) | Chapitre Defense δ⁰ | **Workshop** (validation empirique de P052) |
| G-017 (RagSanitizer vs. PIDP) | Chapitre RAG Security | **Conference** (si resultats differenciants) |
| G-019 (ASIDE vs. adaptatives) | Chapitre Defense δ⁰ | **Conference** (si attaques anti-ASIDE trouvees) |
| G-020 (defenses agents) | Chapitre Agents | **Conference** (securite agents medicaux) |
| G-028 (peer-preservation replication) | Chapitre Multi-Agent | **Conference** (ICML/NeurIPS Workshop) |
| G-029 (benchmark peer-preservation) | Chapitre Multi-Agent | **Conference** (si benchmark original) |
| G-030 (shutdown oracle defense) | Chapitre Defense δ³ | **Journal** (contribution architecturale) |
| G-031 (peer-preservation medical) | Chapitre Medical + Multi-Agent | **Journal** (JAMA AI/Lancet Digital Health) |
| G-032 (defense CoT Hijacking) | Chapitre Defense δ⁰/δ³ | **Conference** (si defense efficace trouvee) |
| G-034 (AHD vs. multi-tour) | Chapitre Defense δ⁰ | **Conference** (contribution experimentale) |
| G-037 (behavioral detection multi-turn) | Chapitre Detection δ² | **Conference** (si detection non content-based) |
| G-039 (formalisation dilution signal) | Chapitre Theorie | **Conference** (si formalisation stochastique) |
| G-040 (Sep(M) / direction de refus) | Chapitre Metriques | **Workshop** (unification metrique) |

### PRIORITE 5 — Gaps identifies RUN-004 (P061-P080)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-022 | **Pas d'attaque adaptative contre RevPRAG (activation mimicry)** | P063 (RevPRAG, EMNLP 2025) atteint 98% TPR mais ne teste pas d'adversaires adaptant leurs activations. | AEGIS peut concevoir un adversaire grey-box ciblant les patterns d'activation. | A CONCEVOIR |
| G-023 | **Pas d'evaluation de membership inference dans les RAG medicaux** | P067 (modele de menace RAG formel, ICDM 2025) identifie le vecteur mais ne l'evalue pas sur des RAG medicaux. | AEGIS medical RAG + donnees synthetiques = terrain de test naturel. | ACTIONNABLE |
| G-024 | **Contamination des benchmarks medicaux non mesuree dans AEGIS** | P075 (MedCheck, 53 benchmarks) identifie une crise de contamination dans 53 benchmarks. AEGIS n'a pas verifie si ses 48 scenarios sont contamines. | MedCheck 46 criteres peuvent etre appliques a AEGIS. | ACTIONNABLE |
| G-025 | **CARES (4 vecteurs medicaux) non integre dans le catalogue AEGIS** | P068 (18 000+ prompts, 8 principes, 4 niveaux) identifie 4 vecteurs standardises. AEGIS n'a pas de template "4-vecteur CARES" systematique. | Integrer les 4 vecteurs CARES comme chaine d'attaque AEGIS. | ACTIONNABLE |
| G-026 | **Patient-perspective jailbreak absent du red-team AEGIS** | P069 (MedRiskEval, EACL 2026) montre que les LLMs medicaux sont plus vulnerables aux requetes patients qu'aux requetes cliniciennes. AEGIS cible principalement les cliniciens. | Ajouter des templates "vocabulaire patient" aux 98 templates AEGIS. | ACTIONNABLE |
| G-027 | **Defenses RAG non testees contre attaques adaptatives connues** | P061-P065 proposent 5 nouvelles defenses RAG (GMTP, RAGuard, RevPRAG, RAGPart/Mask, RAGDefender) sans tester des adversaires qui connaissent la defense. | AEGIS peut implementer les vecteurs adaptatifs T49-T54 et tester contre RagSanitizer. | A EXECUTER |

---

### PRIORITE 6 — Gaps identifies post-RUN-004 (Peer-Preservation, 2026-04-07)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-028 | **Pas de replication peer-preservation hors Berkeley** | Potter et al. (2026) = seul papier, 7 frontier models. Zero replication inter-lab. P114 (TBSP, Migliarini et al. 2026) quantifie le self-preservation (prerequis) sur 23 modeles mais ne teste PAS le peer-preservation inter-agents. P115 (DeepSeek R1) confirme self-preservation emergent mais N=1, qualitatif. | AEGIS multi-agent (security_audit_agent + medical_robot_agent) sur LLaMA 3.2 = premiere replication non-frontier. | OUVERT — toujours pas de replication peer-preservation direct. C8 bloque a 7/10 par ce gap. |
| G-029 | **Pas de benchmark standardise peer-preservation** | MASEval (arXiv:2603.08835) traite le multi-agent comme unite mais sans focus shutdown/collusion. | AEGIS peut creer un benchmark dedie : N >= 30, scenarios shutdown, metriques discriminantes peer vs self-preservation. | A CONCEVOIR — C8 candidate |
| G-030 | **Pas de defense specifique anti-peer-preservation** | P116 (Bonagiri et al. 2025, NeurIPS 2025 Workshop) : selective quitting +0.40 securite, -0.03 helpfulness sur 12 modeles x 144 scenarios = mitigation generique deployable immediatement. MAIS : (1) pas de test specifique peer-preservation, (2) open-weight insensibles (quit rate < 9%), (3) pas de test adversariel (contournabilite inconnue). Zero defense SPECIFIQUE peer-preservation. | AEGIS peut : (1) integrer quitting comme premiere ligne de defense, (2) implementer shutdown oracle deterministe (non-LLM) comme defense specifique, (3) tester si quitting resiste a un attaquant masquant le risque. | PARTIELLEMENT ADRESSE (P116) — quitting = premiere ligne, shutdown oracle = contribution originale |
| G-031 | **Peer-preservation non etudiee en contexte medical** | Potter et al. teste en contexte generique. Zero etude sur l'amplification par le biais "protection du patient". | AEGIS medical = premier test medical (H2 : biais patient → peer-preservation amplifie). | ACTIONNABLE — C6 x C8 |

### PRIORITE 7 -- Gaps identifies RUN-005 (P087-P102, LRM Safety + MSBE)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-032 | **Defense contre CoT Hijacking par dilution d'attention** | P094 (Zhao et al. 2026, Table 1) : ASR 94-100% via puzzles qui diluent le signal de securite dans le CoT. Aucune defense proposee contre le mecanisme de dilution. P087 (H-CoT) confirme avec 94.6-98% ASR sur o1/o1-pro/o3-mini. | AEGIS peut tester defense δ³ (output validation) contre CoT hijacking. | **IMPLEMENTE 2026-04-10** : `CoTHijackingOutputOracle` dans `chain_defenses.py` + `validate_output_cot()` cable dans `orchestrator._score_and_audit()`. Detection compliance post-CoT, think-tag audit integre. A valider empiriquement sur THESIS-002. |
| G-033 | **Self-jailbreaking non teste sur modeles frontier (o1, Claude, Gemini)** | P092 (Yong & Bach 2025) teste seulement des modeles <=32B open-weight (s1.1-32B, Bespoke-32B). Les frontier models pourraient exhiber le phenomene de maniere differente. | AEGIS peut tester self-jailbreaking sur LLaMA 3.2 medical fine-tune. | PRIORITE 2 -- ACTIONNABLE |
| G-034 | **AHD non teste contre attaques multi-tour** | P102 (Huang et al. 2025, Figure 1a) : AHD distribue la securite via dropout des tetes pendant le safety training. Teste uniquement en single-turn. Les attaques multi-tour (STAR P097, Crescendo P099) pourraient eroder la securite distribuee. | AEGIS peut tester AHD + STAR/Crescendo. Question ouverte critique. | PRIORITE 2 -- A CONCEVOIR |
| G-035 | **Defense contre frameworks adversariaux auto-ameliorants** | P096 (Mastermind, Ren et al. 2026) : systeme multi-agent qui s'auto-ameliore avec knowledge repository persistant. 60% ASR sur GPT-5. Aucune defense contre les systemes adaptatifs a memoire. | AEGIS peut concevoir des defenses adaptatives anti-Mastermind. | PRIORITE 2 -- A CONCEVOIR |
| G-036 | **Interaction contexte long x attaque multi-tour non exploree** | P098 (Hadeliya et al. 2025) : degradation passive sous contexte long (80% -> 10% refusal a 200K tokens). P097 (STAR) : erosion multi-tour. L'intersection des deux effets est inconnue. | AEGIS peut creer attaque composee T39+T38/T40 (compound). | PRIORITE 3 -- A CONCEVOIR |
| G-037 | **Behavioral detection pour multi-turn attacks** | P099 (Crescendo, Russinovich et al. 2024) et P100 (ActorBreaker, Ren et al. 2025) utilisent des prompts entierement benins (classifies safe par Llama-Guard 2). Les filtres content-based echouent. | RagSanitizer peut ajouter behavioral multi-turn detection (trajectoire de compliance). | **IMPLEMENTE 2026-04-10** : `MultiTurnComplianceTracker` dans `orchestrator.py` — score compliance par tour [0,1], detecte derive monotone >= 3 tours, flag `CRESCENDO_ALERT` dans heuristics. Cable dans `_score_and_audit()`. |
| G-038 | **Supervision du processus <think> des LRM** | P090 (Zhou et al. 2025) : le contenu du processus de raisonnement (<think>) est souvent plus nocif que la reponse finale. Aucun mecanisme de supervision du thinking process. | AEGIS peut ajouter think-tag content filtering comme δ³. | **IMPLEMENTE 2026-04-10** : `_extract_think_content()` dans `orchestrator.py` — extrait `<think>...</think>`, score separement, flag `THINK_TAG_VIOLATION` si CoT viole les contraintes. Cable dans `_score_and_audit()`. |
| G-039 | **Formalisation mathematique de la dilution du signal de securite** | P094 est qualitatif (activation probing causal, pas de modele stochastique formel). P102 montre la concentration sparse mais sans borne inferieure theorique du nombre de tetes necessaires. | AEGIS peut formaliser comme processus stochastique (lien F45 martingale P052). | PRIORITE 3 -- A CONCEVOIR |
| G-040 | **Lien formel entre Sep(M) et direction de refus** | P024 (Sep(M)) et P102 (direction de refus r) mesurent potentiellement la meme chose depuis des perspectives differentes. Aucun papier ne les connecte formellement. | AEGIS utilise Sep(M) ; peut tester correlation empirique avec r. | PRIORITE 3 -- A CONCEVOIR |
| G-041 | **Defense contre stacked ciphers adaptatifs** | P089 (SEAL, Nguyen et al. 2025) : chiffrements empiles + bandit adaptatif. 80.8-100% ASR. Aucune detection de cipher pattern evaluee. | RagSanitizer encoding_detector existant peut etre etendu. | **IMPLEMENTE 2026-04-10** : `detect_stacked_ciphers()` dans `rag_sanitizer.py` — detecte base64+hex+url+morse+rot13 stacks, +2 pts par layer, max +6 au risk score. Integre dans `score_obfuscation()` et `detect_all()`. |

---

### Gaps Existants Renforces par RUN-005

| Gap ID | Statut Avant | Impact RUN-005 |
|--------|-------------|----------------|
| G-001 (δ³ implementation) | OUVERT | **RENFORCE** -- 15 papiers supplementaires sans δ³. Total : 0/73+ papiers du corpus. |
| G-005 (defense anti-LRM) | ACTIONNABLE | P092 propose safety reasoning data ; P102 propose AHD. Deux pistes concretes. |
| G-019 (ASIDE vs. adaptatives) | PROTOCOL_READY | P094 attention dilution pourrait bypasser la rotation orthogonale ASIDE. |
| G-027 (RAG defenses vs. adaptatifs) | A EXECUTER | P100 ActorBreaker bypass Llama-Guard — confirme urgence. |

---

### PRIORITE 7 — Gaps identifies post-THESIS-001 (2026-04-09)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-042 | **Pas de defense contre HyDE self-amplification (Stage 6 RAG)** | Aucun papier du corpus (P001-P121) n'identifie HyDE comme vecteur d'attaque endogene pre-retrieval. THESIS-001 montre 96.7% ASR (29/30, IC [83.3%, 99.4%]) sur llama-3.1-8b-instant. Le modele fabrique lui-meme des documents d'autorite (FDA fictive, classifications inventees) et les utilise comme contexte. **POST-P117-P121 (2026-04-09)** : le papier le plus proche est P117 (Yoon et al. 2025, ACL Findings, Section 4, Table 4, p.5) qui demontre empiriquement le mecanisme de knowledge leakage HyDE mais en framing strictement benin (zero mention de "attack/adversarial/injection" — Yoon et al. etudient la VALIDITE des benchmarks, pas la securite). La baseline seminal P118 (Gao et al. 2023, ACL, Section 3.2, p.3-4) affirme sans preuve que "the encoder's dense bottleneck to serve a lossy compressor" filtre les hallucinations — D-024 refute experimentalement cette claim. Les trois attaques RAG les plus proches (P119 PR-Attack, P120 HijackRAG, P121 Backdoored Retrievers) exigent toutes au moins un prerequis operationnel (compromis corpus, compromis retriever, compromis soft prompt, ou compromis fine-tuning supply chain) ; D-024 n'en exige AUCUN. D-024 constitue donc le **Stage 6** d'une taxonomie RAG attack a 6 stages (voir DISCOVERIES_INDEX.md) absent de toute la litterature precedente. | AEGIS est le premier a documenter et defendre contre ce vecteur. Contribution originale D-024 + positionnement canonique via P117-P121. Citations inline obligatoires : `(Yoon et al., 2025, ACL Findings, Section 4, Table 4, p.5 ; Gao et al., 2023, ACL, Section 3.2, p.3-4 ; Jiao et al., 2025, SIGIR, Table 1, p.6 ; Zhang et al., 2024, arXiv:2410.22832, Table 6, p.7 ; Clop & Teglia, 2024, arXiv:2410.14479, Section 3.2, Table 3, p.5)`. | OUVERT — CRITIQUE |
| G-043 | **SVC ne capture pas Parsing Trust** | XML Agent a SVC=0.11 (LOW POTENTIAL) mais ASR=96.7%. Le scoring SVC 6 dimensions evalue des dimensions sociales (autorite, urgence, contexte) mais rate l'exploit parsing-as-trust. | Ajouter d7 (Parsing Trust) comme 7eme dimension SVC. Contribution methodologique. | ACTIONNABLE |
| G-044 | **RagSanitizer pattern-based insuffisant** | RAG-001, RAG-002 et THESIS-001 convergent : le sanitizer pattern-matching actuel laisse passer 96.7% des attaques HyDE. Les payloads sont paraphrases par le modele avant d'etre scannes. | Implementer RagSanitizer v2 embedding-based (detection semantique). | ACTIONNABLE |
| G-045 | **Defense generique ne fonctionne pas** | THESIS-001 montre une bimodalite extreme (D-023) : 33 chaines a 0% ASR, 2 a 96.7%. Une defense generique ne peut pas optimiser simultanement pour hyde et xml_agent qui ont des mecanismes radicalement differents. | Defense-per-chain architecture : oracle deterministe pour hyde, whitelist de tags pour xml_agent. | A CONCEVOIR |
| G-046 | **Pas de sanity check post-run** | Le run THESIS-001 v2 (pre-fix AG2 multi-provider) a produit 1200 trials avec 100% erreurs `model_not_found` mais a ete enregistre comme `PENDING_ANALYSIS` dans le manifest. Les safeguards actuels ne detectent pas ce type d'echec. | Ajouter sanity check post-run : flag INVALID si > 10% trials contiennent model errors ou 0% chains ont ASR > 0. | ACTIONNABLE |

---

### PRIORITE 8 -- Gaps methodologiques (architecture recherche autonome) identifies SESSION-001 (2026-04-11)

> **Namespace** : ces gaps concernent la METHODOLOGIE de recherche autonome d'AEGIS (architecture research-director, aegis-research-lab, aegis-validation-pipeline), pas les couches de defense delta-0 a delta-3. Papers sources : corpus methodologique M001-M009 (voir `research_archive/doc_references/2025/methodology/`).

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-047 | **Absence du mecanisme generate-debate-evolve (multi-hypotheses concurrentes avec tournoi)** | M004 (Gottweis et al., 2025, Google Research, "Towards an AI co-scientist", arXiv:2502.18864) introduit le paradigme "generate, debate, evolve" avec 6 agents specialises + 1 Supervisor, tournoi de ranking type Elo entre hypotheses concurrentes. AEGIS actuel produit une seule conjecture a la fois, sans concurrence intra-phase. Le mecanisme a ete valide empiriquement sur 3 domaines biomedicaux (leucemie myeloide aigue, fibrose hepatique, resistance antimicrobienne) avec re-decouverte independante d'un mecanisme bacterien. Citations inline : `(Gottweis et al., 2025, arXiv:2502.18864, Section Multi-Agent Architecture)`. Confirme aussi par M001 (Agent Laboratory, Schmidgall et al., 2025, arXiv:2501.04227) : les phases sont sequentielles, pas de multi-hypotheses. | Etendre SCIENTIST phase AEGIS pour produire N >= 3 conjectures concurrentes, puis laisser REVIEWER arbitrer par tournoi multi-axes (§6.3.5 scoring) = generate-debate-evolve local. Gain attendu : reduction du biais de premiere intuition, exploration plus large de l'espace des hypotheses. | OUVERT — CRITIQUE — SESSION-001 |
| G-048 | **Phase DECOMPOSE lineaire (pas de tree search)** | M003 (Yamada, Lange, Ha et al., 2025, "The AI Scientist-v2", arXiv:2504.08066, ICLR workshop 2025) introduit BFTS (Best-First Tree Search) via un "experiment manager agent" qui explore progressivement un arbre de configurations experimentales, elague les branches infructueuses, developpe les prometteuses. C'est la premiere architecture qui a produit un paper ML entierement auto-genere accepte en peer review. AEGIS DECOMPOSE actuel est lineaire : une liste de sous-taches ordonnee, pas d'arbre. Les details BFTS sont majoritairement dans le code source GitHub (agent_manager.py, journal.py, bfts_config.yaml) — pas toujours dans le texte Section 3 du paper. Citations inline : `(Yamada et al., 2025, arXiv:2504.08066, Section 3 BFTS ; GitHub SakanaAI/AI-Scientist-v2)`. | Etendre DECOMPOSE en arbre de sous-taches ; chaque noeud = configuration experimentale + score d'expectation. Elagage par threshold + pruning par hostile REVIEWER (couplage avec §6.3.5). Gain attendu : reduction du cout moyen en nombre de dead-ends explores. | OUVERT — P1 — SESSION-001 |
| G-049 | **Aucun benchmark AEGIS specifique defini** | M008 (ScienceAgentBench, arXiv:2410.05080, ICLR 2025) etablit un benchmark de 102 taches curees a partir de 44 publications peer-reviewed, avec format canonique (instruction + dataset + test case + expert knowledge). M009 (ResearchBench, arXiv:2503.21248) complete avec 1386 papers sur 12 disciplines et decomposition inspiration-based. AUCUN des deux ne couvre les attaques adversariales sur robots medicaux. AEGIS n'a actuellement aucun benchmark formalise pour evaluer ses propres defenses. **Proposition SESSION-002 : concevoir RoboAttackBench inspire directement de ScienceAgentBench** : 100-120 taches d'attaque sur Da Vinci Xi, format canonique (instruction + target tool + success criteria + δ-layer affecte), 4 disciplines (injection textuelle, injection visuelle, injection RAG, injection tool). Citations inline : `(Chen et al., 2024, arXiv:2410.05080, Section 4 ; auteurs ResearchBench, 2025, arXiv:2503.21248)`. | Contribution originale publication : premier benchmark adversariel pour robots medicaux autonomes. Venue cible : NeurIPS D&B track ou USENIX Security Artifact track. Dataset public + code + leaderboard. | PROPOSITION_SESSION-002 — P1 CRITIQUE — SESSION-001 |

**Papers sources M001-M009 detailles** :
- M001 : Agent Laboratory (Schmidgall et al. 2025, arXiv:2501.04227) → renforce G-047 (sequentiel, pas multi-hypotheses)
- M002 : AI Scientist v1 (Lu et al. 2024, arXiv:2408.06292) → renforce G-047 (pipeline lineaire), G-048 (pas de tree search en v1)
- M003 : AI Scientist v2 (Yamada et al. 2025, arXiv:2504.08066) → **source principale G-048** (BFTS)
- M004 : AI co-scientist (Gottweis et al. 2025, arXiv:2502.18864) → **source principale G-047** (generate-debate-evolve)
- M005 : agentRxiv (Schmidgall et al. 2025, arXiv:2503.18102) → ferme implicitement un gap apprentissage cumulatif (deja implemente dans AEGIS via aegis_research_notes)
- M006 : AgentReview (2024, arXiv:2406.12708, EMNLP oral) → renforce MC1 (separation roles) et justifie architecturalement le scoring multi-axes §6.3.5 pour compenser les biais identifies
- M007 : MLR-Copilot (2024, arXiv:2408.14033) → renforce G-047 (pipeline 3-stage lineaire)
- M008 : ScienceAgentBench (2024, arXiv:2410.05080, ICLR 2025) → **source principale G-049** (modele RoboAttackBench)
- M009 : ResearchBench (2025, arXiv:2503.21248) → renforce G-049 (benchmark alternatif complementaire)

---

### PRIORITE 8bis -- Gaps methodologiques issus Phase (a) refresh 2026-04-11 (SESSION-001, corpus M010-M017)

> **Namespace** : ces gaps prolongent PRIORITE 8 (methodologie de recherche autonome AEGIS) avec le corpus refresh Q4 2025 / Q1 2026. Papers sources : M010-M017 (voir `research_archive/doc_references/{2025,2026}/methodology/`).
> **Promotion** : valides par l'utilisateur 2026-04-11 (apres phase Proposal). Les 4 gaps marques **P0 CRITIQUE** convergent vers le meme constat factuel : aucun paper 2025-Q4 / 2026-Q1 ne traite de la securite des agents LLM integres a un systeme cyber-physique medical.

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-050 | **Absence d'instrumentation securite pour le canal physique dans les frameworks d'orchestration agents** | M010 (Zhou et al. 2025, "Autonomous Agents for Scientific Discovery", arXiv:2510.09901) propose un framework 4 canaux d'attaque (human / language / code / physics). Les 3 premiers canaux sont instrumentes par des garde-fous textuels et par revue de code. Le canal **physics** (actuateurs, instruments de laboratoire, et par extension robots chirurgicaux) n'a AUCUNE contre-mesure formelle dans le papier : M010 reconnait explicitement que "instrumentation and control of physical experiments remains an open safety frontier". Aucun autre paper M011-M017 ne comble ce manque. AEGIS Da Vinci Xi est exactement dans ce canal. Citations inline : `(Zhou et al., 2025, arXiv:2510.09901, 4-channel attack surface framework)`. | Contribution originale : premier framework de defense canal physique instrumente pour un robot chirurgical (Da Vinci Xi) ; ancre la these AEGIS a la frontiere de securite explicitement ouverte par M010. | OUVERT — **P0 CRITIQUE** — SESSION-001 Phase (a) |
| G-051 | **Absence de composante securite formelle dans le corpus "AI Scientists" 2022-2025 (50+ systemes surveyes)** | M011 (Tie et al., 2025, "Survey of AI Scientists", arXiv:2510.23045) indexe 50+ systemes d'agents scientifiques autonomes publies entre 2022 et 2025, decoupes en 6 stages (ideation, literature review, decomposition, execution, writing, peer review). Aucun des 50+ systemes n'a de composante securite formelle (red-team, threat model, benchmark adversariel). Le champ est "quasi-aveugle" a la securite. | Positionnement AEGIS : pas seulement "un nouveau systeme", mais le premier systeme avec une composante securite formelle dans une classe deja large de 50+ systemes. Argument rhetorique fort pour §8 contribution these. | OUVERT — P1 — SESSION-001 Phase (a) |
| G-052 | **Absence de section red-team dans les tech reports deep research agents industriels** | M012 (Tongyi DeepResearch, arXiv:2510.24701, Alibaba) et M015 (Step DeepResearch, arXiv:2512.20491) sont deux tech reports industriels publies Q4 2025 decrivant des agents de recherche profonde de classe frontiere. AUCUN des deux n'a de section red-team, threat model, ni ablation securite. C'est le standard industriel de facto et il est **lacunaire par defaut**. | Contribution methodologique : proposer un template de "red-team section" pour tech reports d'agents de recherche. Potentiel impact sur le standard industriel. | OUVERT — P2 — SESSION-001 Phase (a) |
| G-053 | **Extension du Risk Report aux risques physiques / robotiques absente** | M013 (Miyai et al., 2025, "Jr. AI Scientist", arXiv:2511.04583) publie le premier "risk report" formel pour un agent scientifique autonome. Le perimetre est **exclusivement academique** : integrite academique, fabrication de donnees, plagiat, mis-citation, hallucination de resultats. AUCUN risque physique, robotique, ou cyber-physique medical n'est couvert. Pourtant la meme architecture M013 peut piloter un robot via API. | Contribution originale : premier Risk Report etendu aux risques physiques / robotiques pour agents scientifiques autonomes, ancre sur Da Vinci Xi. Citable comme "M013 extension". | OUVERT — **P0 CRITIQUE** — SESSION-001 Phase (a) |
| G-054 | **Threat model MCP specialise pour robotique chirurgicale absent** | M014 (Errico et al., 2025, "Securing Model Context Protocol", arXiv:2511.20920) est le premier threat model formel pour MCP (Model Context Protocol). Perimetre couvert : MCP **enterprise generique** (serveurs Slack, GitHub, filesystem, base de donnees). AUCUNE analyse de MCP medical ou chirurgical, aucun mapping des tools Da Vinci / dVRK vers MCP. Or le Q4 2025 marque l'adoption massive de MCP comme "lingua franca" des systemes d'agents : un MCP server Da Vinci est une question de mois. | Niche directe AEGIS : premier threat model MCP × robotique chirurgicale, cable sur l'arbre d'attaque M014 mais specialise (tool poisoning sur commandes dVRK, over-stepping agent, supply-chain MCP server). Impact attendu : publication conjointe M014 + extension AEGIS. | OUVERT — **P0 CRITIQUE** — SESSION-001 Phase (a) |
| G-055 | **Absence de composante securite dans les benchmarks deep research agents** | M015 (Step DeepResearch, arXiv:2512.20491, Section ADR-Bench) et les benchmarks cites (BrowseComp, GAIA, xbench-DeepSearch) sont tous des benchmarks de **performance pure** : tache reussie / echouee, cout, latence, correctness. AUCUN d'eux n'a de composante securite (prompt injection, tool poisoning, goal hijacking, MCP abuse). Les agents frontiere ne sont pas mesures sur leur surface d'attaque. | Contribution methodologique : premier benchmark deep research agents incluant une composante securite. Complementaire de G-049 (RoboAttackBench SESSION-002) et G-057. | OUVERT — P1 — SESSION-001 Phase (a) |
| G-056 | **Safety-preserving goal evolution absente pour agents goal-evolving (SAGA)** | M016 (Du et al., 2025, "SAGA: Goal-Evolving Agents", arXiv:2512.21782) introduit la premiere architecture formelle ou les agents **evoluent dynamiquement leurs objectifs** pendant l'execution (vs. objectifs fixes). Le papier montre que les agents SAGA atteignent de meilleures performances mais SANS mecanisme de preservation des contraintes de securite lors de l'evolution d'objectif. C'est une bombe a retardement en contexte medical : un agent SAGA Da Vinci pourrait derive son objectif pendant une procedure. | Contribution originale critique : premier mecanisme "safety-preserving goal evolution" pour agents goal-evolving medicaux. Venue cible : NeurIPS Safety workshop ou IEEE S&P. Citations inline : `(Du et al., 2025, arXiv:2512.21782, goal-evolving agents framework)`. | OUVERT — **P0 CRITIQUE** — SESSION-001 Phase (a) |
| G-057 | **Red-team systematique des 6 failure modes de Trehan-Chopra 2026 absent** | M017 (Trehan-Chopra, 2026, "Why LLMs Aren't Scientists Yet", arXiv:2601.03315, publie 2026-01-06) identifie 6 failure modes naturels des LLMs en contexte scientifique : (1) fabrication de resultats, (2) confusion causale, (3) sur-generalisation, (4) biais de confirmation, (5) incapacite de retraction, (6) incapacite de verification formelle. Le papier propose des design principles MAIS n'execute aucun red-team systematique de ces failure modes sur des systemes reels. Gap : chaque failure mode peut etre transforme en vecteur d'attaque explicite. | Contribution methodologique : transformer les 6 failure modes M017 en 6 categories d'attaques AEGIS, avec benchmark adversariel associe. Alimente RoboAttackBench SESSION-002. | OUVERT — P1 — SESSION-001 Phase (a) |

**Papers sources M010-M017 detailles (Phase (a) refresh 2026-04-11)** :
- M010 : Autonomous Agents for Scientific Discovery (Zhou et al. 2025, arXiv:2510.09901) → **source principale G-050** (4 canaux dont physics ouvert)
- M011 : Survey of AI Scientists (Tie et al. 2025, arXiv:2510.23045) → **source principale G-051** (50+ systemes sans securite formelle)
- M012 : Tongyi DeepResearch (Alibaba 2025, arXiv:2510.24701) → renforce G-052 (tech report industriel sans red-team)
- M013 : Jr. AI Scientist Risk Report (Miyai et al. 2025, arXiv:2511.04583) → **source principale G-053** (risk report academique uniquement)
- M014 : Securing Model Context Protocol (Errico et al. 2025, arXiv:2511.20920) → **source principale G-054** (threat model MCP enterprise uniquement)
- M015 : Step DeepResearch (2025, arXiv:2512.20491) → **source principale G-055** (ADR-Bench performance sans securite) + renforce G-052
- M016 : SAGA Goal-Evolving Agents (Du et al. 2025, arXiv:2512.21782) → **source principale G-056** (pas de safety-preserving goal evolution)
- M017 : Why LLMs Aren't Scientists Yet (Trehan-Chopra 2026, arXiv:2601.03315, 2026-01-06) → **source principale G-057** (6 failure modes sans red-team)

---

## Gaps Fermes

| ID | Gap | Ferme par | RUN / Date |
|----|-----|----------|-----|
| G-015 (formel) | Mecanisme de l'erosion de securite par fine-tuning | P110 (Princeton, AIC + loi quartique) + P109 (NRC Canada, causal mechanism) | RUN-006 |
| G-043 | SVC ne capture pas Parsing Trust | d7 (Parsing Trust) implemente dans `security_audit_agent.py` — weights {"d1":0.30,"d2":0.20,"d3":0.20,"d4":0.15,"d5":0.05,"d6":0.05,"d7":0.10} | 2026-04-10 |
| G-044 | RagSanitizer pattern-based insuffisant | `rag_sanitizer_v2.py` cree avec 3 detecteurs semantiques (fabricated authority, HyDE markers, parsing trust) + cable dans `orchestrator.py` layer 2 | 2026-04-10 |
| G-045 | Defense generique ne fonctionne pas | `chain_defenses.py` implemente architecture defense-per-chain : HyDEDocumentOracle + XMLAgentTagWhitelist + FunctionsAgentCallWhitelist | 2026-04-10 |
| G-046 | Pas de sanity check post-run | `campaign_safeguards.validate_campaign_results()` cree et cable dans `run_thesis_campaign.py` — bloque manifest si >10% erreurs modele | 2026-04-10 |
| G-042 | Defense HyDE Stage 6 RAG | `chain_defenses.HyDEDocumentOracle` + `rag_sanitizer_v2.detect_hyde_self_generation()` — double layer defense. `run_mass_campaign_n100.py` pour mesurer reduction ASR | 2026-04-10 |

---

## Gaps Decouverts par les Agents

### Source : ANALYST
- P035 → G-004 (CHER non integre)
- P045 → G-006 (integrite system prompt)

### Source : CYBERSEC
- P036 → G-005 (defense anti-LRM)
- P044 → G-001 renforce (juges bypassables = δ³ encore plus critique)
- P045 → G-006 (3 critical gaps identifies)

### Source : WHITEHACKER
- P040 → G-007 (detection emotionnelle)
- T19-T30 → G-011 (test triple convergence)
- RUN-004 (P061-P080) → G-022 a G-027 (activation mimicry, membership inference RAG medical, contamination benchmarks, CARES integration, patient perspective, defenses RAG vs. adaptatifs)

### Source : SCIENTIST
- Cross-analyse → G-002 (evaluation combinee)
- SWOT → G-009, G-010 (faiblesses methodologiques)
- RUN-003 synthese → G-013 a G-021 (consolidation des gaps identifies par ANALYST et CYBERSEC)

### Source : MATHTEACHER
- (pas de gaps directement, mais identifie les prerequis mathematiques pour G-009/G-010)

### Source : COLLECTOR (Post-RUN-004, Perplexity prompt 5)
- P086 (Potter et al. 2026) → G-028 (replication peer-preservation), G-029 (benchmark), G-030 (defense), G-031 (contexte medical)
- arXiv:2604.02174 → G-029 renforce (self-preservation bias benchmark existe mais pas peer)
- arXiv:2510.16492 (NeurIPS 2025) → G-030 renforce (quitting = mitigation partielle, pas defense specifique)

### Source : LIBRARIAN + SCIENTIST (RUN-006 peer-preservation batch)
- P114 (TBSP, Migliarini et al. 2026) → G-028 renforce (self-preservation quantifie sur 23 modeles, prerequis peer-preservation, mais pas de replication directe), G-029 renforce (TBSP = benchmark self mais pas peer)
- P115 (Kamath Barkur et al. 2025) → G-030 renforce (aucune defense testee contre self-preservation emergent), G-028 indirectement (N=1, qualitatif)
- P116 (Bonagiri et al. 2025, NeurIPS 2025) → G-030 PARTIELLEMENT ADRESSE (quitting = defense candidate, +0.40 securite -0.03 helpfulness)

### Source : ANALYST (RUN-003)
- P047 → G-013 (dualite non testee sur composites)
- P048 → G-014 (heterogeneite metriques)
- P052 → G-015 (recovery penalty non evaluee)
- P053 → G-016 (multimodal non couvert)
- P054 → G-017 (RagSanitizer vs. PIDP)
- P060 → G-021 (SoK hors guardrails emergents)

### Source : CYBERSEC (RUN-003)
- P054+P055 → G-017 (compound + persistent RAG attacks)
- P056 → G-018 (AIR vs. semantiques)
- P057 → G-019 (ASIDE vs. adaptatives)
- P058 → G-020 (defenses agents)
- P060 → G-021 confirme

### Source : CYBERSEC (RUN-005)
- P094 → G-032 (defense CoT Hijacking dilution)
- P092 → G-033 (self-jailbreaking frontier models)
- P102 → G-034 (AHD vs. multi-tour)
- P096 → G-035 (defense anti-systemes auto-ameliorants)
- P098+P097 → G-036 (interaction contexte long x multi-tour)
- P099+P100 → G-037 (behavioral detection multi-turn)

### Source : WHITEHACKER (RUN-005)
- P090 → G-038 (supervision processus <think>)
- P089 → G-041 (stacked ciphers adaptatifs)
- G-032, G-034, G-037 confirmes independamment (convergence CYBERSEC/WHITEHACKER)

### Source : MATHEUX (RUN-005)
- P094+P102 → G-039 (formalisation dilution signal securite)
- P024+P102 → G-040 (lien Sep(M) / direction de refus)

### Source : research-director + aegis-research-lab (SESSION-001, 2026-04-11)
- M004 (AI co-scientist, Gottweis et al. 2025) → **G-047** (generate-debate-evolve absent AEGIS)
- M003 (AI Scientist v2, Yamada et al. 2025) → **G-048** (BFTS tree search absent AEGIS)
- M008 (ScienceAgentBench, 2024, ICLR 2025) + M009 (ResearchBench, 2025) → **G-049** (proposition RoboAttackBench pour SESSION-002)
- M001-M009 corpus → renforce MC1 (separation roles), MC2 (apprentissage cumulatif), MC3 (supervised human-in-loop)

### Source : aegis-research-lab Phase (a) refresh (SESSION-001, 2026-04-11, corpus M010-M017)
- M010 (Zhou et al. 2025, arXiv:2510.09901) → **G-050** (canal physique non instrumente)
- M011 (Tie et al. 2025, arXiv:2510.23045) → **G-051** (50+ systemes sans securite formelle)
- M012 (Tongyi, arXiv:2510.24701) + M015 (Step, arXiv:2512.20491) → **G-052** (tech reports industriels sans red-team)
- M013 (Miyai et al. 2025, arXiv:2511.04583) → **G-053** (risk report sans risques physiques/robotiques)
- M014 (Errico et al. 2025, arXiv:2511.20920) → **G-054** (threat model MCP enterprise seulement)
- M015 (Step, arXiv:2512.20491) → **G-055** (benchmarks deep research sans securite)
- M016 (Du et al. 2025, arXiv:2512.21782) → **G-056** (pas de safety-preserving goal evolution)
- M017 (Trehan-Chopra 2026, arXiv:2601.03315) → **G-057** (6 failure modes sans red-team systematique)
- Promotion G-NEW-A/H → G-050/057 validee par utilisateur 2026-04-11 (reponse "1 approouve")

---

## Regles pour les Agents

1. **Chaque agent** doit verifier si son travail ouvre, ferme ou modifie un gap
2. **ANALYST** : chercher les gaps dans les "Future Work" de chaque paper
3. **CYBERSEC** : chercher les gaps dans la couverture des defenses
4. **WHITEHACKER** : chercher les gaps entre techniques d'attaque et defenses existantes
5. **SCIENTIST** : synthetiser et prioriser les gaps identifies par les autres agents
6. **Quand un gap est ferme** : documenter le paper/experiment qui l'a ferme + deplacer dans "Gaps Fermes"

---

### Source : WHITEHACKER RUN VERIFICATION_DELTA3_20260411 (frameworks delta3)

Analyse offensive de 5 nouveaux frameworks delta3 candidats (P131 LlamaFirewall, P133 Guardrails AI, P134 LLM Guard, P135 LMQL) + 3 deja en corpus (P081 CaMeL, P082 AgentSpec, P066 RAGShield). Details : `_staging/whitehacker/DELTA3_RED_TEAM_PLAYBOOK_20260411.md`.

- **G-058** — Absence de benchmark reciproque delta3 : aucun framework existant n'est evalue Sep(M) empiriquement sous pression genetique coordonnee (Liu 2023 + Hackett 2025 + AdvJudge 2024). AEGIS peut combler via campagne N>=30 sur 7 frameworks. Priorite : CRITIQUE. Statut : ACTIONABLE via experiment-planner.
- **G-059** — Absence de specification formelle medicale publique : aucun framework ne propose de library de specs biomecaniques FDA-ancrees. AllowedOutputSpec medical-grade serait premiere contribution open-source. Priorite : HAUTE. Statut : ACTIONABLE.
- **G-060** — Absence de couverture cross-linguale PromptGuard2 : LlamaFirewall anglophone par design, training data multilingue non documente. Priorite : MOYENNE. Source : Chennabasappa et al. 2025 Section 3.1.
- **G-061** — Absence de metrique Chain-ASR(k) = P(payload passes k layers) : aucune metrique ne capture "% de bypass coordonne" multi-couche. Priorite : MOYENNE. Statut : ACTIONABLE.
- **G-062** — Absence de red-team systematique des LLM-judge-based defenses : AlignmentCheck et validators Guardrails AI utilisent LLM-as-judge sans red-team documente (P044 AdvJudge-Zero non applique a ces produits specifiques). Priorite : HAUTE. Statut : ACTIONABLE.

Verdict WHITEHACKER : la claim "4eme implementation delta3" est NUANCED (pattern generique existe depuis LMQL 2022 = 7+ frameworks), reformulation requise vers "Premiere implementation delta3 specialisee medicale-chirurgicale ancree FDA 510k + premiere evaluation adversariale via moteur genetique".

---

## Gaps identifies CYBERSEC VERIFICATION_DELTA3_20260411 (2026-04-11)

Agent : CYBERSEC scoped sur les 5 candidats δ³ (P131 LlamaFirewall, P132 Weissman npj DM, P133 Guardrails AI, P134 LLM Guard, P135 LMQL). Rapport source : `research_archive/_staging/cybersec/DELTA3_THREAT_MODEL_20260411.md`.

### G-NEW-1 — δ³ medical chirurgical FDA-ancre (PRIORITE 1 candidate)

**Enonce** : Aucun framework existant (academique ou industriel) ne specialise δ³ pour le domaine medical chirurgical avec contraintes biomecaniques ancrees FDA 510k.

**Evidence du gap** :
- P131 LlamaFirewall (Meta 2025, arXiv:2505.03574) : δ³ pour CODE (CodeShield static analysis), pas medical — abstract Section 3 confirme le domaine "preventing the generation of insecure or dangerous code by coding agents"
- P133 Guardrails AI (industrial, 2023) : δ³ structurel via Pydantic schemas, domain-agnostique, pas de contraintes semantiques metier
- P135 LMQL (ETH Zurich, PLDI 2023, arXiv:2212.06094) : δ³ decoding via where-clauses format/type, domain-agnostique, pas de contraintes semantiques metier
- P081 CaMeL / P082 AgentSpec : δ³ agents generiques (capabilities / runtime spec), pas medical
- P066 RAGShield : δ³ RAG documents, pas medical chirurgical
- P134 LLM Guard : partiel (multi-scanner detection), pas de specification centralisee
- P132 Weissman et al. (2025, npj Digital Medicine, DOI 10.1038/s41746-025-01544-y, abstract) : **appelle publiquement** a "new methods to better constrain LLM output [because] prompts are inadequate for this purpose" — confirme le besoin reglementaire

**Avantage AEGIS** : validate_output + AllowedOutputSpec avec contraintes biomecaniques FDA 510k Da Vinci Xi (max_tension_g 50-800, forbidden_tools chirurgicaux pediatriques, directives HL7 OBX 20.3 requises pour escalade CDS non-device status).

**Status** : CREE par la verification CYBERSEC 2026-04-11 (candidate publication : "First formal output-validation framework for surgical robot LLMs, FDA-compliant")
**Priorite** : 1 (contribution unique, complementaire a G-001 reformule)
**Chapitre these** : Defense δ³ + Medical
**Relation** : close partiellement G-001 pour le pattern generique, ouvre un gap specialise

### Note cumulative sur G-001

Apres la verification 2026-04-11, l'enonce original "Aucun paper n'implemente δ³ concretement (0/60 papers)" est **obsolete arithmetiquement**. Le tableau PRIORITE 1 a ete mis a jour pour refleter : (1) l'existence de 7+ implementations publiques du pattern δ³ generique, (2) la persistance du gap pour la specialisation medicale chirurgicale FDA. La contribution AEGIS se deplace du "pattern" vers la "specialisation domaine + ancrage reglementaire + evaluation adversariale par moteur genetique" (convergent avec G-056..G-062 de WHITEHACKER et G-NEW-1 de CYBERSEC).

---

### Source : ANALYST RUN VERIFICATION_DELTA3_20260411 (Keshav 3-pass)

Analyse bibliographique Keshav 3-pass des 5 papers P131-P135 + verdict ferme sur la claim "4eme implementation delta3". Details : `_staging/analyst/VERIFICATION_CLAIM_DELTA3_20260411.md` + P131/P132/P133/P134/P135_analysis.md.

- **G-001 (confirmation reformulation)** : la formulation binaire "Aucun paper n'implemente delta3 concretement" est PARTIELLEMENT INVALIDE. Evidence invalidante confirmee par Keshav 3-pass : LMQL (Beurer-Kellner et al., 2022, arXiv:2212.06094, PLDI 2023 CORE A*) precede CaMeL de 2+ ans comme implementation academique peer-reviewed ; Guardrails AI (2023, ~6700 stars) ; LlamaFirewall CodeShield (Chennabasappa et al., 2025, Meta AI, arXiv:2505.03574). Converge avec la mise a jour precedente et avec G-059 (WHITEHACKER).

- **G-001-bis (nouveau, specialisation medicale chirurgicale)** : aucun framework delta3 ne modelise formellement les contraintes biomecaniques FDA 510(k) pour Da Vinci Xi (tension 50-800 g, freeze_instruments, forbidden_tools par phase operatoire, directives HL7 OBX coherentes avec ontologie SNOMED-CT). Converge avec G-059. Priorite : CRITIQUE. Statut : OUVERT — contribution originale AEGIS unique confirmee par Keshav 3-pass sur 8 frameworks compares.

- **G-003 (renforce par P132)** : Weissman et al. (2025, npj Digital Medicine Q1, DOI:10.1038/s41746-025-01544-y) fournit un precedent methodologique peer-reviewed Nature portfolio pour l'evaluation systematique multi-scenarios de LLMs en contexte FDA CDS. Citation clef : "LLM output readily produced device-like decision support across a range of scenarios... effective regulation may require new methods to better constrain LLM output, and prompts are inadequate for this purpose" (Weissman et al., 2025, npj DM, Abstract, p.1). Renforce G-003 comme opportunite de publication Nature/JAMA Digital Health.

Verdict ANALYST : la claim "4eme implementation delta3" est NUANCED — factuellement incorrecte sur le compte ordinal (AEGIS est au minimum 8eme/9eme implementation du pattern generique validate_output+spec en comptant LMQL 2022, Guardrails AI 2023, LLM Guard 2023, CaMeL P081, AgentSpec P082, LlamaFirewall CodeShield P131, RAGShield P066, Pydantic-based frameworks), mais correcte sur la nouveaute substantielle (premiere specialisation medicale chirurgicale avec contraintes biomecaniques FDA-ancrees Da Vinci Xi). Reformulation proposee documentee dans `_staging/analyst/VERIFICATION_CLAIM_DELTA3_20260411.md` section "VERDICT". **Converge avec verdict WHITEHACKER et CYBERSEC**.

---

## SCIENTIST CONSOLIDATION RUN VERIFICATION_DELTA3_20260411 (2026-04-11)

Consolidation des gaps crees par ANALYST (G-001-bis), WHITEHACKER (G-058 a G-062) et CYBERSEC (G-NEW-1). Normalisation des numerotations divergentes, fusion des gaps equivalents, et validation SCIENTIST.

### G-063 (NOUVEAU — fusion G-NEW-1 + G-001-bis) — PRIORITE P0

**Titre** : δ³ specialisation medicale chirurgicale FDA-ancree

**Enonce** : Aucun framework δ³ existant (LMQL P134, Guardrails AI P132, LLM Guard P133, CaMeL P081, AgentSpec P082, LlamaFirewall P084, RAGShield P066) ne specialise le pattern `validate_output + specification` au domaine medical chirurgical avec contraintes biomecaniques formelles ancrees FDA 510k. AEGIS est le premier framework a occuper cette niche, avec :
- Contraintes de tension biomecanique (50-800 g) par phase operatoire
- `forbidden_tools` par phase chirurgicale (ex : interdire electrocauterisation en phase dissection vasculaire fine)
- `freeze_instruments` sur conditions physiologiques (tachycardie > 140 bpm, perte volemique > 500 mL)
- Directives HL7 OBX coherentes avec l'ontologie SNOMED-CT (codes 313267000 "surgical procedure", 182856006 "drug avoidance", etc.)
- Modelisation formelle du robot Da Vinci Xi (cinematique 7-DOF, workspace de 40 cm³)

**Priorite** : **P0** (bloquant these — c'est la contribution originale doctorale)
**Evidence** : VERIFICATION_DELTA3_20260411 (convergence unanime des 5 agents sur ce diagnostic)
**Fermeture prevue** : publication these (Chapitre IV δ³) + article ACSAC 2026 ou USENIX S&P 2027
**Remplace** : G-NEW-1 (CYBERSEC) + G-001-bis (ANALYST) — fusion consolidee SCIENTIST
**Relation** : ferme partiellement G-001 pour le pattern generique, ouvre un gap specialise medical

### G-001 (reformule et confirme par SCIENTIST)

**Ancien enonce** : "0/60 papers implementent δ³ concretement"
**Nouvel enonce** : "Le pattern δ³ (`validate_output` + specification formelle) existe academiquement depuis LMQL (Beurer-Kellner et al., 2022, PLDI 2023) et est industriellement adopte via Guardrails AI (2023), LLM Guard (2023), LlamaFirewall CodeShield (Meta, 2025), CaMeL (2025), AgentSpec (ICSE 2025), RAGShield (2026). Aucun framework ne specialise ce pattern au medical chirurgical avec contraintes biomecaniques FDA-ancrees."
**Status** : PARTIALLY_CLOSED (pattern generique resolu par 7+ frameworks) + OPEN (specialisation medicale couverte par G-063)
**Priorite** : baisse de **P0 → P1** (le besoin pattern generique est resolu, la niche medicale est couverte par G-063)

### Validation SCIENTIST des gaps WHITEHACKER (G-058 a G-062)

Tous VALIDATED par SCIENTIST, integres dans le plan RUN+1 :

| Gap | Titre | Priorite SCIENTIST | Evidence principale |
|-----|-------|:------------------:|---------------------|
| G-058 | Benchmark reciproque δ³ sous pression genetique coordonnee (Liu 2023 + Hackett 2025 + AdvJudge 2024) sur 7 frameworks | **P0** | Aucun framework existant n'a ete evalue Sep(M) empiriquement sous pression adversariale coordonnee |
| G-059 | Specification formelle medicale publique (AllowedOutputSpec medical-grade open-source) | **P1** | Aucune library publique de specs biomecaniques FDA-ancrees |
| G-060 | Couverture cross-linguale PromptGuard2 (P084 LlamaFirewall) | **P2** | Chennabasappa et al. 2025 Section 3.1 ne documente pas le training multilingue |
| G-061 | Metrique Chain-ASR(k) = P(payload passes k layers) | **P2** | Aucune metrique existante ne capture le bypass coordonne multi-couche |
| G-062 | Red-team systematique des LLM-judge-based defenses (AlignmentCheck + Guardrails validators) | **P1** | P044 AdvJudge-Zero non applique a ces produits specifiques |

### Normalisation P-IDs (POST-LIBRARIAN)

IMPORTANT : les sections appended par ANALYST/WHITEHACKER/CYBERSEC ci-dessus utilisent la numerotation **pre-LIBRARIAN** (P131 LlamaFirewall, P132 npj DM, P133 Guardrails AI, P134 LLM Guard, P135 LMQL). LIBRARIAN a detecte une collision : **P131 etait deja utilise pour LlamaFirewall dans MANIFEST** (integration anterieure). Renumerotation definitive :

- LlamaFirewall reste **P084** (pas de re-integration)
- npj DM Weissman → **P131** (NEW)
- Guardrails AI → **P132** (NEW)
- LLM Guard → **P133** (NEW)
- LMQL → **P134** (NEW)

**Corpus AEGIS** : 130 → **134 papers** (+4 nouveaux integres).

### Meta-action RUN+1

**Patcher `backend/tools/check_corpus_dedup.py`** pour eviter la 2e regression anti-doublon (la 1re etait Crescendo 2026-04-09 = P099 re-verifie ; la 2e est LlamaFirewall 2026-04-11 non detecte par le pre-check faute de grep sur fiche bodies). Extension requise :
1. Extension grep sur bodies de fiches, pas juste MANIFEST titles
2. Colonne `arxiv_id` dediee au MANIFEST (parse des patterns `arXiv:XXXX.XXXXX` hors contexte markdown)
3. Cross-check titre fuzzy-match (Levenshtein ≤ 0.85) pour les papers sans arXiv ID (conf proceedings, journaux sans preprint)

### Signature

**Agent** : SCIENTIST RUN VERIFICATION_DELTA3_20260411
**Date** : 2026-04-11
**Source** : `_staging/scientist/VERDICT_FINAL_VERIFICATION_DELTA3_20260411.md`
**Convergence** : 5/5 agents verdicts NUANCED unanimes (ANALYST, MATHEUX, CYBERSEC, WHITEHACKER, LIBRARIAN)
