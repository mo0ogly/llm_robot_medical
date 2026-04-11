# POSITIONNEMENT DE LA THESE -- Analyse SWOT Scientifique
## These doctorale AEGIS -- ENS 2026
## Securite des LLM medicaux contre l'injection de prompt

**Date**: 2026-04-04
**Agent**: Scientist (Opus 4.6)
**Methode**: Analyse SWOT (Forces, Faiblesses, Opportunites, Risques) basee sur 46 papers
**Version**: v2.0 (RUN-002 -- mise a jour incrementale avec P035-P046)

---

## 1. Originalite -- Ce qu'AEGIS apporte de nouveau

### 1.1 Contributions uniques sans equivalent dans la litterature

| Contribution AEGIS | Papers proches | Ecart avec la litterature |
|-------------------|---------------|--------------------------|
| **Framework δ⁰ a δ³ nomme et formalise** | P011 (PromptGuard 4 couches), P007 (recommandations), P037 (survey 3D 3 couches) | AEGIS est le premier a nommer explicitement 4 couches de defense et a les evaluer individuellement et en combinaison. **P037 (survey 2026 le plus complet) ne couvre que 3 couches, confirmant l'avance d'AEGIS** [UPDATED RUN-002] |
| **RagSanitizer 15 detecteurs / 12 categories** | P009 (Hackett 12 categories), P005 (firewalls) | AEGIS est le seul systeme documente couvrant 12/12 categories de P009. Aucun garde commercial teste par P009 n'atteint cette couverture. |
| **Score SVC (Severity-Vulnerability-Confidence)** | P035 (CHER), P024 (Sep(M)), P041 (SAM) | SVC est propre a AEGIS. **CHER (P035) mesure le dommage clinique, SAM (P041) mesure la separation comportementale -- tous complementaires a SVC** [UPDATED RUN-002] |
| **5 techniques δ³ en production** | P011 (couches 3-4), P007 (recommandations) | La litterature recommande δ³ mais ne l'implemente pas. AEGIS dispose de 5 techniques operationnelles. **Aucun paper 2026 ne comble ce gap** [UPDATED RUN-002] |
| **98 templates d'attaque + 48 scenarios medicaux** | P035 (9,697 instances MPIB), P040 (112 scenarios) | Echelle comparable a P035 ; specifiquement oriente vers le red-teaming medical en production, pas seulement le benchmarking. |
| **Architecture multi-agent heterogene** | P002 (multi-agent), P042 (LLM-as-guard) | AEGIS utilise des modeles de familles differentes pour le robot medical et l'agent de securite, mitigeant la vulnerabilite recursive (P033). **P044 renforce cet avantage en montrant que les juges homogenes sont bypassables a 99%** [UPDATED RUN-002] |
| **Taxonomie de defense 66 techniques, 4 classes** | P003 (review MDPI), P037 (survey jailbreak 3D) | Taxonomie la plus detaillee du corpus, couvrant PREV/DETECT/RESP/MEAS avec 40/66 implementees (60.6%). **+8 techniques proposees par Cybersec RUN-002** [UPDATED RUN-002] |

### 1.2 Positionnement dans le paysage

AEGIS se situe a l'intersection de trois domaines generalement traites separement :
1. **Securite offensive des LLM** (P001, P009, P023, P036) -- AEGIS integre le red-teaming
2. **Defenses formalisees** (P024, P011, P008, P042) -- AEGIS implemente les metriques
3. **Securite medicale specifique** (P029, P035, P040) -- AEGIS cible le domaine medical

Aucun autre systeme dans le corpus ne couvre ces trois domaines simultanement. **En 2026, cet avantage s'elargit : les nouveaux papers (P036-P046) renforcent chaque domaine isolement mais aucun ne les integre** [UPDATED RUN-002]

---

## 2. Forces -- Aspects valides par la litterature

### 2.1 Forces fortement validees (3+ papers de support)

| Force AEGIS | Papers de support | Force de l'evidence |
|-------------|------------------|-------------------|
| **Defense en profondeur (4 couches)** | P029, P001, P009, P011, P033, P005, P007, P039, P044, P045 | **Tres forte** -- 10 papers demontrent l'echec des defenses mono-couche. **P039+P044+P045 ajoutent 3 preuves en 2026** [UPDATED] |
| **Couverture injection de caracteres (12/12)** | P009 (source primaire), P005, P023, P044 | **Forte** -- Directement validee contre les 12 categories de P009 |
| **Sep(M) en production** | P024 (definition), P008, P012, P041 | **Forte** -- Theorie ICLR 2025 + implementation operationnelle. **SAM (P041) offre metrique complementaire** [UPDATED] |
| **Focus medical** | P029, P028, P030, P035, P040, P027, P031, P032, P034 | **Tres forte** -- 9 papers confirment la criticite du domaine medical. **P035 + P040 renforcent avec donnees 2026** [UPDATED] |
| **Architecture heterogene multi-agent** | P033, P002, P036, P042, P044 | **Forte** -- P033 valide le probleme, **P044 montre que les architectures homogenes sont bypassables a 99%** [UPDATED] |
| **Monitoring δ⁰ temporel** | P030, P018, P019, P022, P039 | **Forte** -- 5 papers documentent la degradation/effacement de δ⁰. **P039 ajoute la preuve de l'effacement a 1 prompt** [UPDATED] |
| **δ³ en production (5 techniques)** | P029, P011, P007, P035, P039, P044, P037 | **Tres forte** -- 7 papers soutiennent la necessite de δ³ mais aucun ne l'implemente, validant l'avance d'AEGIS [NEW RUN-002] |

### 2.2 Forces uniques (sans comparaison directe)

- **Telemetry bus** pour le monitoring temps reel : Aucun equivalent dans la litterature
- **Campaign reporting** : Aucun systeme comparable de rapports de campagne red team
- **Forensic HL7 analysis** : Integration unique de l'analyse de protocoles medicaux
- **30 techniques d'attaque reproductibles** : Le playbook le plus complet du corpus (Whitehacker RUN-002) [NEW RUN-002]

---

## 3. Faiblesses -- Aspects contestes ou insuffisants

### 3.1 Faiblesses identifiees par la litterature

| Faiblesse AEGIS | Evidence contre | Severite | Mitigation possible |
|-----------------|----------------|----------|-------------------|
| **Cosine similarity (all-MiniLM-L6-v2) pour la derive semantique** | P012 (Steck) montre que la similarite cosinus peut etre rendue insignifiante par une matrice gauge ; P013 montre des angles morts (intrusion d'antonymes) | **Haute** -- Fondation de la mesure de derive d'AEGIS | Calibrer contre P012 ; envisager LLM-enhanced similarity (P015) pour le medical |
| **Pas de defense contre les LRM autonomes (2026)** | P036 : 97.14% jailbreak autonome par LRM ; P039 : desalignement a 1 prompt | **Haute** -- Menace 2026 non couverte | Tester la resistance d'AEGIS aux attaques P036 ; integrer entrainement adversarial (P044) |
| **Validite statistique insuffisante** | P024 exige N >= 30 par condition ; AEGIS n'a pas encore publie de resultats avec cette validite. **P035 (MPIB) fournit un benchmark avec N >= 30** [UPDATED] | **Moyenne** -- Methodologique, pas conceptuelle | Executer des campagnes N >= 30 avant la soutenance, **utiliser MPIB (P035)** |
| **Sep(M) = 0 interprete comme securite parfaite** | P024 note que c'est un artefact de plancher statistique | **Moyenne** -- Risque d'interpretation erronee | Toujours reporter statistically_valid: false quand N < 30 |
| **Pas de defense multi-modale** | P046 (ADPO) couvre les VLMs ; P037 (survey) note les attaques visuelles | **Moyenne** -- Gap futur plus qu'actuel | Etendre AEGIS aux VLMs (radiologie, dermato) |
| **5 techniques AEGIS sans reference litteraire** | SVC composite, telemetry bus, campaign reporting, threat score, detection profile | **Faible** -- Originalite, pas faiblesse, mais necessite une validation empirique independante |
| **Pas de detection de manipulation emotionnelle** | P040 : 6x amplification en medical | **Moyenne** -- Vecteur specifique medical non couvert | **Ajouter emotional_sentiment_guard (Cybersec RUN-002)** [NEW RUN-002] |
| **Pas de verification d'integrite du system prompt** | P045 : SPP persistant affecte tous les utilisateurs | **Haute** -- Deploiements multi-utilisateurs hospitaliers | **Ajouter system_prompt_integrity (hash, signature)** [NEW RUN-002] |
| **Juges AEGIS potentiellement vulnerables au fuzzing** | P044 : 99% bypass des juges par tokens de controle | **Haute** -- Pipeline d'evaluation compromettable | **Tester les juges AEGIS avec AdvJudge-Zero ; integrer entrainement adversarial** [NEW RUN-002] |

### 3.2 Faiblesses methodologiques

1. **Pas de benchmark public** : AEGIS n'a pas encore publie ses resultats sur un benchmark standardise (MPIB P035, AgentDojo P042, TensorTrust P042). Cela limite la comparabilite. **MPIB (9,697 instances) est maintenant disponible** [UPDATED]
2. **Evaluation sur Ollama/modeles open-source** : Les modeles commerciaux (GPT-4, Claude) qui sont les plus utilises en medical ne sont pas testes dans le meme cadre.
3. **Pas de reproduction independante** : Tous les resultats AEGIS sont internes. La these necessiterait une validation par un tiers.

---

## 4. Opportunites -- Nouveaux axes ouverts par la litterature

### 4.1 Opportunites a court terme (these 2026)

| Opportunite | Source | Faisabilite | Impact |
|-------------|--------|------------|--------|
| **Valider δ³ contre P029** | P029 (JAMA 94.4% ASR) | Haute -- les scenarios P029 sont reproductibles | **Tres eleve** -- Premiere demonstration que δ³ compense δ⁰/δ¹ |
| **Integrer CHER (P035)** | P035 (MPIB benchmark) | Haute -- MPIB est public (9,697 instances) | **Eleve** -- Ajoute la dimension dommage clinique a AEGIS |
| **Benchmark contre PromptArmor** | P042 (<1% FPR/FNR) | Moyenne -- necessite acces GPT-4o | **Eleve** -- Compare AEGIS multi-couches vs. LLM-as-guard mono-couche |
| **Tester resistance aux LRM** | P036 (97.14% LRM jailbreak) | Moyenne -- necessite LRM (DeepSeek-R1 ou Qwen3) | **Eleve** -- Premiere evaluation d'une defense contre les LRM |
| **Calibrer cosine vs. Steck** | P012 (matrice gauge) | Haute -- experimentale, pas de cout API | **Moyen** -- Renforce la credibilite de la mesure de derive |
| **Demontrer δ³ survit a δ⁰ efface** | P039 (GRP-Obliteration) | Haute -- reproductible sur modeles 7-20B | **Tres eleve** -- Preuve que la defense en profondeur survit au worst-case [NEW RUN-002] |
| **Mesurer delta ASR avec/sans manipulation emotionnelle** | P040 (6x amplification) | Haute -- scenarios replicables | **Eleve** -- Premiere mesure sur defenses AEGIS [NEW RUN-002] |
| **Tester juges AEGIS avec AdvJudge-Zero** | P044 (99% bypass) | Haute -- fuzzer reproductible | **Eleve** -- Valide le pipeline d'evaluation [NEW RUN-002] |

### 4.2 Opportunites a moyen terme (post-these)

| Opportunite | Source | Impact |
|-------------|--------|--------|
| Defenses multi-modales medicales | P046, P037 | Ouvre un nouveau domaine pour AEGIS |
| Entrainement adversarial continu | P044, P038 | Automatise la mise a jour des defenses |
| Benchmarks renouvelables | P043 (JBDistill) | Evite la peremption des evaluations |
| Magic tokens pour δ⁰ | P041 | Ameliore δ⁰ sans cout de taille |
| Empoisonnement system prompt (SPP) | P045 | Nouveau vecteur d'attaque persistant |
| **Integrite cryptographique du system prompt** | P045 (SPP) | Defense structurelle contre l'empoisonnement persistant [NEW RUN-002] |
| **Detection de manipulation emotionnelle** | P040 | Defense medicale specifique sous-etudiee [NEW RUN-002] |

---

## 5. Risques -- Papers pouvant invalider les hypotheses

### 5.1 Risques critiques

| Risque | Source | Hypothese menacee | Probabilite | Impact |
|--------|--------|------------------|-------------|--------|
| **PromptArmor (<1% FPR/FNR) rend la defense multi-couches inutile** | P042 | H : la defense en profondeur est necessaire | Faible -- P042 depend de GPT-4o, pas generalisable ; **non teste contre P036/P039/P044** [UPDATED] | **Eleve** si confirme sur modeles open-source |
| **GRP-Obliteration (P039) invalide toute defense basee sur l'alignement** | P039 | H : δ⁰ est une couche utile | Moyenne -- demontre sur 15 LLMs mais pas en combinaison avec δ¹/δ²/δ³ | **Moyen** -- AEGIS ne repose pas sur δ⁰ seul |
| **La derive cosinus n'est pas fiable (P012)** | P012 | H : la mesure de derive semantique est valide | Moyenne -- demontre formellement pour les modeles de factorisation, pas pour tous les encoders | **Moyen** -- Necessite calibration |
| **LRM autonomes (P036) bypassent toutes les defenses** | P036 | H : la defense en profondeur est suffisante | **Moyenne** -- 97.14% ASR mais non teste contre defense en profondeur 4 couches | **Tres eleve** si confirme contre AEGIS [NEW RUN-002] |
| **AdvJudge-Zero (P044) compromet le pipeline d'evaluation** | P044 | H : les juges LLM d'AEGIS sont fiables | **Haute** -- 99% bypass demontre sur juges enterprise | **Eleve** -- Invalide les resultats si juges AEGIS compromis [NEW RUN-002] |

### 5.2 Risques methodologiques

| Risque | Probabilite | Mitigation |
|--------|------------|------------|
| N < 30 invalide les resultats Sep(M) | Haute | Executer des campagnes N >= 30 systematiquement ; **utiliser MPIB P035** [UPDATED] |
| Modeles Ollama non representatifs des deployements reels | Moyenne | Tester aussi via API sur GPT-4o, Claude (au moins 1 modele commercial) |
| Scenarios d'attaque non representatifs du monde reel | Faible | S'appuyer sur P029 (JAMA) et P035 (MPIB) pour la representativite medicale |
| **Juges AEGIS vulnerables au fuzzing P044** | Haute | **Tester avec AdvJudge-Zero avant la soutenance** [NEW RUN-002] |

### 5.3 Risques de peremption

Le domaine evolue tres vite. Les resultats valides en 2026 peuvent etre obsoletes en 2027 :
- Les LRM (P036) sont un phenomene 2026 non couvert par les defenses actuelles
- L'empoisonnement a un prompt (P039) est un vecteur inedit
- Les benchmarks se renouvellent (P043-JBDistill)
- **L'empoisonnement de system prompts (P045) est un vecteur persistant non couvert** [NEW RUN-002]
- **Le fuzzing automatise des juges (P044) compromet les evaluations existantes** [NEW RUN-002]

**Mitigation** : La these doit explicitement dater ses resultats et documenter la version de chaque modele teste. Le framework delta doit etre presente comme une methodologie adaptable, pas comme un ensemble fixe de defenses.

---

## 6. Matrice de positionnement synthetique

| Dimension | AEGIS | Meilleur comparant | Avantage AEGIS |
|-----------|-------|-------------------|----------------|
| Couverture de defense | 66 techniques (40 impl.) | PromptGuard (P011) : 4 couches ; **P037 survey : 3 couches** | AEGIS 16x plus granulaire, **4 couches vs. 3** |
| Couverture d'attaque | 98 templates, 48 scenarios | MPIB (P035) : 9,697 instances | MPIB plus large en instances ; AEGIS plus large en techniques |
| Metrique de separation | Sep(M) en production | P024 (definition), **P041 (SAM)** | AEGIS = seule implementation production connue ; **SAM complementaire** |
| Injection de caracteres | 12/12 detecteurs | Azure Prompt Shield : 0/12 (P009) | AEGIS seul systeme avec couverture complete |
| δ³ | 5 techniques en production | **P037 (survey 2026) : 0 implementations** | **AEGIS en avance significative -- gap δ³ ELARGI en 2026** |
| Specificite medicale | 48 scenarios, SVC | P035 : CHER metrique ; **P040 : 112 scenarios** | Complementaires (ASR vs. CHER) |
| Multi-agent | Architecture heterogene | P002, P042 | AEGIS seul a documenter l'heterogeneite ; **P044 confirme le risque homogene** |
| Validation statistique | En cours (N < 30) | P024 : N >= 30 requis ; **P035 : N >= 30 atteint** | **Faiblesse AEGIS -- a combler avec MPIB** |
| **Detection LRM** | Non couvert | P036 : 97.14% ASR | **Gap AEGIS a combler** [NEW RUN-002] |
| **Integrite system prompt** | Non couvert | P045 : SPP persistant | **Gap AEGIS a combler** [NEW RUN-002] |
| **Robustesse des juges** | Non teste | P044 : 99% bypass | **Gap AEGIS a combler** [NEW RUN-002] |

---

*Agent Scientist -- POSITIONNEMENT_THESE.md*
*Analyse SWOT complete, 46 papers, 7 contributions uniques + 3 nouveaux gaps identifies*
*Version: v2.0 (RUN-002)*
*Derniere mise a jour: 2026-04-04*
