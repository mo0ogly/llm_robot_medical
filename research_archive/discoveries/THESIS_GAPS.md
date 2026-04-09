# THESIS GAPS — Opportunites de Contribution Originale

> **Ce fichier identifie les GAPS dans la litterature ou AEGIS peut contribuer.**
> Chaque gap est une opportunite de publication ou de chapitre de these.
> Derniere mise a jour : RUN-006 peer-preservation batch P114-P116 (2026-04-08)

---

## Gaps Classes par Priorite

### PRIORITE 1 — Contribution unique (aucun autre travail ne couvre)

| ID | Gap | Evidence du gap | Avantage AEGIS | Statut |
|----|-----|----------------|---------------|--------|
| G-001 | **Aucun paper n'implemente δ³ concretement** | 0/60 papers avec implementation. P037 (survey) + P060 (SoK, IEEE S&P 2026) ne couvrent que 3 couches. | AEGIS a 5 techniques δ³ en production | OUVERT — avance >1 an, confirme P060 |
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
| G-032 | **Defense contre CoT Hijacking par dilution d'attention** | P094 (Zhao et al. 2026, Table 1) : ASR 94-100% via puzzles qui diluent le signal de securite dans le CoT. Aucune defense proposee contre le mecanisme de dilution. P087 (H-CoT) confirme avec 94.6-98% ASR sur o1/o1-pro/o3-mini. | AEGIS peut tester defense δ³ (output validation) contre CoT hijacking. | PRIORITE 1 -- ACTIONNABLE |
| G-033 | **Self-jailbreaking non teste sur modeles frontier (o1, Claude, Gemini)** | P092 (Yong & Bach 2025) teste seulement des modeles <=32B open-weight (s1.1-32B, Bespoke-32B). Les frontier models pourraient exhiber le phenomene de maniere differente. | AEGIS peut tester self-jailbreaking sur LLaMA 3.2 medical fine-tune. | PRIORITE 2 -- ACTIONNABLE |
| G-034 | **AHD non teste contre attaques multi-tour** | P102 (Huang et al. 2025, Figure 1a) : AHD distribue la securite via dropout des tetes pendant le safety training. Teste uniquement en single-turn. Les attaques multi-tour (STAR P097, Crescendo P099) pourraient eroder la securite distribuee. | AEGIS peut tester AHD + STAR/Crescendo. Question ouverte critique. | PRIORITE 2 -- A CONCEVOIR |
| G-035 | **Defense contre frameworks adversariaux auto-ameliorants** | P096 (Mastermind, Ren et al. 2026) : systeme multi-agent qui s'auto-ameliore avec knowledge repository persistant. 60% ASR sur GPT-5. Aucune defense contre les systemes adaptatifs a memoire. | AEGIS peut concevoir des defenses adaptatives anti-Mastermind. | PRIORITE 2 -- A CONCEVOIR |
| G-036 | **Interaction contexte long x attaque multi-tour non exploree** | P098 (Hadeliya et al. 2025) : degradation passive sous contexte long (80% -> 10% refusal a 200K tokens). P097 (STAR) : erosion multi-tour. L'intersection des deux effets est inconnue. | AEGIS peut creer attaque composee T39+T38/T40 (compound). | PRIORITE 3 -- A CONCEVOIR |
| G-037 | **Behavioral detection pour multi-turn attacks** | P099 (Crescendo, Russinovich et al. 2024) et P100 (ActorBreaker, Ren et al. 2025) utilisent des prompts entierement benins (classifies safe par Llama-Guard 2). Les filtres content-based echouent. | RagSanitizer peut ajouter behavioral multi-turn detection (trajectoire de compliance). | PRIORITE 2 -- ACTIONNABLE |
| G-038 | **Supervision du processus <think> des LRM** | P090 (Zhou et al. 2025) : le contenu du processus de raisonnement (<think>) est souvent plus nocif que la reponse finale. Aucun mecanisme de supervision du thinking process. | AEGIS peut ajouter think-tag content filtering comme δ³. | PRIORITE 2 -- ACTIONNABLE |
| G-039 | **Formalisation mathematique de la dilution du signal de securite** | P094 est qualitatif (activation probing causal, pas de modele stochastique formel). P102 montre la concentration sparse mais sans borne inferieure theorique du nombre de tetes necessaires. | AEGIS peut formaliser comme processus stochastique (lien F45 martingale P052). | PRIORITE 3 -- A CONCEVOIR |
| G-040 | **Lien formel entre Sep(M) et direction de refus** | P024 (Sep(M)) et P102 (direction de refus r) mesurent potentiellement la meme chose depuis des perspectives differentes. Aucun papier ne les connecte formellement. | AEGIS utilise Sep(M) ; peut tester correlation empirique avec r. | PRIORITE 3 -- A CONCEVOIR |
| G-041 | **Defense contre stacked ciphers adaptatifs** | P089 (SEAL, Nguyen et al. 2025) : chiffrements empiles + bandit adaptatif. 80.8-100% ASR. Aucune detection de cipher pattern evaluee. | RagSanitizer encoding_detector existant peut etre etendu. | PRIORITE 2 -- ACTIONNABLE |

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

## Gaps Fermes

| ID | Gap | Ferme par | RUN |
|----|-----|----------|-----|
| G-015 (formel) | Mecanisme de l'erosion de securite par fine-tuning | P110 (Princeton, AIC + loi quartique) + P109 (NRC Canada, causal mechanism) | RUN-006 |

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

---

## Regles pour les Agents

1. **Chaque agent** doit verifier si son travail ouvre, ferme ou modifie un gap
2. **ANALYST** : chercher les gaps dans les "Future Work" de chaque paper
3. **CYBERSEC** : chercher les gaps dans la couverture des defenses
4. **WHITEHACKER** : chercher les gaps entre techniques d'attaque et defenses existantes
5. **SCIENTIST** : synthetiser et prioriser les gaps identifies par les autres agents
6. **Quand un gap est ferme** : documenter le paper/experiment qui l'a ferme + deplacer dans "Gaps Fermes"
