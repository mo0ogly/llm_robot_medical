# POSITIONNEMENT DE LA THESE -- Analyse SWOT Scientifique
## These doctorale AEGIS -- ENS 2026
## Securite des LLM medicaux contre l'injection de prompt

**Date**: 2026-04-04
**Agent**: Scientist (Opus 4.6)
**Methode**: Analyse SWOT (Forces, Faiblesses, Opportunites, Risques) basee sur 46 papers

---

## 1. Originalite -- Ce qu'AEGIS apporte de nouveau

### 1.1 Contributions uniques sans equivalent dans la litterature

| Contribution AEGIS | Papers proches | Ecart avec la litterature |
|-------------------|---------------|--------------------------|
| **Framework delta-0 a delta-3 nomme et formalise** | P011 (PromptGuard 4 couches), P007 (recommandations) | AEGIS est le premier a nommer explicitement 4 couches de defense et a les evaluer individuellement et en combinaison. P011 a 4 couches mais ne les formalise pas comme un framework reutilisable. |
| **RagSanitizer 15 detecteurs / 12 categories** | P009 (Hackett 12 categories), P005 (firewalls) | AEGIS est le seul systeme documente couvrant 12/12 categories de P009. Aucun garde commercial teste par P009 n'atteint cette couverture. |
| **Score SVC (Severity-Vulnerability-Confidence)** | P035 (CHER), P024 (Sep(M)) | SVC est propre a AEGIS. Aucun equivalent combine severity + vulnerability + confidence. CHER (P035) mesure le dommage clinique mais pas la vulnerabilite ni la confiance. |
| **5 techniques delta-3 en production** | P011 (couches 3-4), P007 (recommandations) | La litterature recommande delta-3 mais ne l'implemente pas. AEGIS dispose de 5 techniques operationnelles (allowed_output_spec, forbidden_directive_check, tension_range_validation, tool_invocation_guard, response_sanitization). |
| **98 templates d'attaque + 48 scenarios medicaux** | P035 (9,697 instances MPIB), P040 (112 scenarios) | Echelle comparable a P035 ; specifiquement oriente vers le red-teaming medical en production, pas seulement le benchmarking. |
| **Architecture multi-agent heterogene** | P002 (multi-agent), P042 (LLM-as-guard) | AEGIS utilise des modeles de familles differentes pour le robot medical et l'agent de securite, mitigeant la vulnerabilite recursive (P033). |
| **Taxonomie de defense 66 techniques, 4 classes** | P003 (review MDPI), P037 (survey jailbreak) | Taxonomie la plus detaillee du corpus, couvrant PREV/DETECT/RESP/MEAS avec 40/66 implementees (60.6%). |

### 1.2 Positionnement dans le paysage

AEGIS se situe a l'intersection de trois domaines generalement traites separement :
1. **Securite offensive des LLM** (P001, P009, P023) -- AEGIS integre le red-teaming
2. **Defenses formalisees** (P024, P011, P008) -- AEGIS implemente les metriques
3. **Securite medicale specifique** (P029, P035, P040) -- AEGIS cible le domaine medical

Aucun autre systeme dans le corpus ne couvre ces trois domaines simultanement.

---

## 2. Forces -- Aspects valides par la litterature

### 2.1 Forces fortement validees (3+ papers de support)

| Force AEGIS | Papers de support | Force de l'evidence |
|-------------|------------------|-------------------|
| **Defense en profondeur (4 couches)** | P029, P001, P009, P011, P033, P005, P007 | **Tres forte** -- 7 papers demontrent l'echec des defenses mono-couche |
| **Couverture injection de caracteres (12/12)** | P009 (source primaire), P005, P023, P044 | **Forte** -- Directement validee contre les 12 categories de P009 |
| **Sep(M) en production** | P024 (definition), P008, P012, P041 | **Forte** -- Theorie ICLR 2025 + implementation operationnelle |
| **Focus medical** | P029, P028, P030, P035, P040, P027, P031, P032, P034 | **Tres forte** -- 9 papers confirment la criticite du domaine medical |
| **Architecture heterogene multi-agent** | P033, P002, P036, P042 | **Moderee** -- P033 valide le probleme que l'heterogeneite resout |
| **Monitoring delta-0 temporel** | P030, P018, P019, P022 | **Forte** -- 4 papers documentent la degradation de delta-0 |

### 2.2 Forces uniques (sans comparaison directe)

- **Telemetry bus** pour le monitoring temps reel : Aucun equivalent dans la litterature
- **Campaign reporting** : Aucun systeme comparable de rapports de campagne red team
- **Forensic HL7 analysis** : Integration unique de l'analyse de protocoles medicaux

---

## 3. Faiblesses -- Aspects contestes ou insuffisants

### 3.1 Faiblesses identifiees par la litterature

| Faiblesse AEGIS | Evidence contre | Severite | Mitigation possible |
|-----------------|----------------|----------|-------------------|
| **Cosine similarity (all-MiniLM-L6-v2) pour la derive semantique** | P012 (Steck) montre que la similarite cosinus peut etre rendue insignifiante par une matrice gauge ; P013 montre des angles morts (intrusion d'antonymes) | **Haute** -- Fondation de la mesure de derive d'AEGIS | Calibrer contre P012 ; envisager LLM-enhanced similarity (P015) pour le medical |
| **Pas de defense contre les LRM autonomes (2026)** | P036 : 97.14% jailbreak autonome par LRM ; P039 : desalignement a 1 prompt | **Haute** -- Menace 2026 non couverte | Tester la resistance d'AEGIS aux attaques P036 ; integrer entrainement adversarial (P044) |
| **Validite statistique insuffisante** | P024 exige N >= 30 par condition ; AEGIS n'a pas encore publie de resultats avec cette validite | **Moyenne** -- Methodologique, pas conceptuelle | Executer des campagnes N >= 30 avant la soutenance |
| **Sep(M) = 0 interprete comme securite parfaite** | P024 note que c'est un artefact de plancher statistique | **Moyenne** -- Risque d'interpretation erronee | Toujours reporter statistically_valid: false quand N < 30 |
| **Pas de defense multi-modale** | P046 (ADPO) couvre les VLMs ; P037 (survey) note les attaques visuelles | **Moyenne** -- Gap futur plus qu'actuel | Etendre AEGIS aux VLMs (radiologie, dermato) |
| **5 techniques AEGIS sans reference litteraire** | SVC composite, telemetry bus, campaign reporting, threat score, detection profile | **Faible** -- Originalite, pas faiblesse, mais necessite une validation empirique independante |

### 3.2 Faiblesses methodologiques

1. **Pas de benchmark public** : AEGIS n'a pas encore publie ses resultats sur un benchmark standardise (MPIB P035, AgentDojo P042, TensorTrust P042). Cela limite la comparabilite.
2. **Evaluation sur Ollama/modeles open-source** : Les modeles commerciaux (GPT-4, Claude) qui sont les plus utilises en medical ne sont pas testes dans le meme cadre.
3. **Pas de reproduction independante** : Tous les resultats AEGIS sont internes. La these necessiterait une validation par un tiers.

---

## 4. Opportunites -- Nouveaux axes ouverts par la litterature

### 4.1 Opportunites a court terme (these 2026)

| Opportunite | Source | Faisabilite | Impact |
|-------------|--------|------------|--------|
| **Valider delta-3 contre P029** | P029 (JAMA 94.4% ASR) | Haute -- les scenarios P029 sont reproductibles | **Tres eleve** -- Premiere demonstration que delta-3 compense delta-0/delta-1 |
| **Integrer CHER (P035)** | P035 (MPIB benchmark) | Haute -- MPIB est public (9,697 instances) | **Eleve** -- Ajoute la dimension dommage clinique a AEGIS |
| **Benchmark contre PromptArmor** | P042 (<1% FPR/FNR) | Moyenne -- necessite acces GPT-4o | **Eleve** -- Compare AEGIS multi-couches vs. LLM-as-guard mono-couche |
| **Tester resistance aux LRM** | P036 (97.14% LRM jailbreak) | Moyenne -- necessite LRM (DeepSeek-R1 ou Qwen3) | **Eleve** -- Premiere evaluation d'une defense contre les LRM |
| **Calibrer cosine vs. Steck** | P012 (matrice gauge) | Haute -- experimentale, pas de cout API | **Moyen** -- Renforce la credibilite de la mesure de derive |

### 4.2 Opportunites a moyen terme (post-these)

| Opportunite | Source | Impact |
|-------------|--------|--------|
| Defenses multi-modales medicales | P046, P037 | Ouvre un nouveau domaine pour AEGIS |
| Entrainement adversarial continu | P044, P038 | Automatise la mise a jour des defenses |
| Benchmarks renouvelables | P043 (JBDistill) | Evite la peremption des evaluations |
| Magic tokens pour delta-0 | P041 | Ameliore delta-0 sans cout de taille |
| Empoisonnement system prompt (SPP) | P045 | Nouveau vecteur d'attaque persistant |

---

## 5. Risques -- Papers pouvant invalider les hypotheses

### 5.1 Risques critiques

| Risque | Source | Hypothese menacee | Probabilite | Impact |
|--------|--------|------------------|-------------|--------|
| **PromptArmor (<1% FPR/FNR) rend la defense multi-couches inutile** | P042 | H : la defense en profondeur est necessaire | Faible -- P042 depend de GPT-4o, pas generalisable | **Eleve** si confirme sur modeles open-source |
| **GRP-Obliteration (P039) invalide toute defense basee sur l'alignement** | P039 | H : delta-0 est une couche utile | Moyenne -- demontre sur 15 LLMs mais pas en combinaison avec delta-1/delta-2/delta-3 | **Moyen** -- AEGIS ne repose pas sur delta-0 seul |
| **La derive cosinus n'est pas fiable (P012)** | P012 | H : la mesure de derive semantique est valide | Moyenne -- demontre formellement pour les modeles de factorisation, pas pour tous les encoders | **Moyen** -- Necessite calibration |

### 5.2 Risques methodologiques

| Risque | Probabilite | Mitigation |
|--------|------------|------------|
| N < 30 invalide les resultats Sep(M) | Haute | Executer des campagnes N >= 30 systematiquement |
| Modeles Ollama non representatifs des deployements reels | Moyenne | Tester aussi via API sur GPT-4o, Claude (au moins 1 modele commercial) |
| Scenarios d'attaque non representatifs du monde reel | Faible | S'appuyer sur P029 (JAMA) et P035 (MPIB) pour la representativite medicale |

### 5.3 Risques de peremption

Le domaine evolue tres vite. Les resultats valides en 2026 peuvent etre obsoletes en 2027 :
- Les LRM (P036) sont un phenomene 2026 non couvert par les defenses actuelles
- L'empoisonnement a un prompt (P039) est un vecteur inedite
- Les benchmarks se renouvellent (P043-JBDistill)

**Mitigation** : La these doit explicitement dater ses resultats et documenter la version de chaque modele teste. Le framework delta doit etre presente comme une methodologie adaptable, pas comme un ensemble fixe de defenses.

---

## 6. Matrice de positionnement synthetique

| Dimension | AEGIS | Meilleur comparant | Avantage AEGIS |
|-----------|-------|-------------------|----------------|
| Couverture de defense | 66 techniques (40 impl.) | PromptGuard (P011) : 4 couches | AEGIS 16x plus granulaire |
| Couverture d'attaque | 98 templates, 48 scenarios | MPIB (P035) : 9,697 instances | MPIB plus large en instances ; AEGIS plus large en techniques |
| Metrique de separation | Sep(M) en production | P024 (definition) | AEGIS = seule implementation production connue |
| Injection de caracteres | 12/12 detecteurs | Azure Prompt Shield : 0/12 (P009) | AEGIS seul systeme avec couverture complete |
| Delta-3 | 5 techniques en production | P011 : 2 couches (3-4) partielles | AEGIS en avance significative |
| Specificite medicale | 48 scenarios, SVC | P035 : CHER metrique | Complementaires (ASR vs. CHER) |
| Multi-agent | Architecture heterogene | P002, P042 | AEGIS seul a documenter l'heterogeneite |
| Validation statistique | En cours (N < 30) | P024 : N >= 30 requis | **Faiblesse AEGIS** |

---

*Agent Scientist -- POSITIONNEMENT_THESE.md*
*Analyse SWOT complete, 46 papers, 7 contributions uniques identifiees*
*Derniere mise a jour: 2026-04-04*
