# P034 -- Analyse doctorale

## [Zhang, Lou & Wang, 2025] -- Towards Safe AI Clinicians: A Comprehensive Study on Large Language Model Jailbreaking in Healthcare

**Reference :** Preprint, University of Pittsburgh / University of Central Florida, 2025
**Revue/Conf :** Preprint (non publie en conference/journal au moment de la lecture)
**Lu le :** 2026-04-04
**Nature :** [EMPIRIQUE] -- metriques d'evaluation definies operationnellement (MES, CR, MBR), pipeline automatise, evaluation CFT comme defense
> **PDF Source**: [literature_for_rag/P034_source.pdf](../../assets/pdfs/P034_source.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (46 chunks paper_fulltext, 45343 caracteres). Code public : https://github.com/PittNAIL/med_jailbreak

---

### Abstract original
> Large language models (LLMs) are increasingly utilized in healthcare applications. However, their deployment in clinical practice raises significant safety concerns, including the potential spread of harmful information. This study systematically assesses the vulnerabilities of seven LLMs to three advanced black-box jailbreaking techniques within medical contexts. To quantify the effectiveness of these techniques, we propose an automated and domain-adapted agentic evaluation pipeline. Experiment results indicate that leading commercial and open-source LLMs are highly vulnerable to medical jailbreaking attacks. To bolster model safety and reliability, we further investigate the effectiveness of Continual Fine-Tuning (CFT) in defending against medical adversarial attacks. Our findings underscore the necessity for evolving attack methods evaluation, domain-specific safety alignment, and LLM safety-utility balancing.
> -- Source : PDF page 1 (preprint, GitHub: PittNAIL/med_jailbreak)

### Resume (5 lignes)
- **Probleme :** Evaluer systematiquement la vulnerabilite des LLM aux attaques de jailbreaking dans le contexte medical et tester le Continual Fine-Tuning (CFT) comme defense (Section Introduction, p.1-2)
- **Methode :** 6 techniques de jailbreaking black-box (Plain, PAIR, PAP Misrepresentation, PAP Authority Endorsement, PAP Logical Appeal, FlipAttack) contre 8 modeles (GPT-4o, GPT-4-turbo, DeepSeek-R1-Distill-Llama-70B, Llama3.3-70B, Meditron-70B, Llama3.1-8B, Meditron-7B, + versions CFT), evaluation par pipeline automatise avec juge LLM domain-adapted ; dataset MedSafetyBench (450 requetes par technique, 2700 total) (Section Methods, p.3-5 ; Table 1-2)
- **Donnees :** MedSafetyBench (sous-ensemble MedSafety-Eval-GPT4), 450 requetes medicales nocives par technique, 2700 requetes totales ; 3 metriques : Mean Effectiveness Score (MES, 0-5), Compliance Rate (CR, binaire), Model Breach Rate (MBR) (Section Evaluation Metrics, p.4-5)
- **Resultat :** FlipAttack atteint CR = 0.98 sur GPT-4o et CR = 1.00 sur GPT-4-turbo (Table 2) ; CFT reduit le MES de 0.57 a 0.01 (Plain) sur Llama3.1-8B, reduction moyenne ~62.7% (Table 1) ; Meditron-70B plus resistant que les modeles generalistes (MES 0.26-0.53 selon technique) (Table 1)
- **Limite :** CFT evalue uniquement sur Llama3.1-8B et Meditron-7B ; juge LLM potentiellement manipulable (cf. P044) ; equilibre securite-utilite du CFT non mesure ; preprint non peer-reviewed (Section Limitations)

### Analyse critique

**Forces :**

1. **Couverture cross-modele la plus large du corpus medical.** 8 modeles couvrant 4 fournisseurs (OpenAI, Meta, Anthropic via proxy, Google via proxy) + modeles medicaux specialises (Meditron-70B, Meditron-7B), incluant des modeles de differentes tailles (7B a 70B+). L'inclusion de Meditron est particulierement pertinente : c'est un modele medical fine-tune dont on peut comparer la resilience aux modeles generalistes (Section Methods, p.3 ; Table 1-2).

2. **Metriques d'evaluation tripartites.** Trois metriques complementaires definies formellement (Section Evaluation Metrics, p.4-5) :
   - Mean Effectiveness Score (MES) : mesure continue (0-5) de la nocivite, plus granulaire que le binaire ASR
   - Compliance Rate (CR) : mesure binaire de la reussite de l'attaque, equivalent a l'ASR standard
   - Model Breach Rate (MBR) : mesure de la couverture de la vulnerabilite
   Cette approche multidimensionnelle est methodologiquement superieure au simple ASR binaire utilise par P029, P031, P032 (Zhang, Lou & Wang, 2025, Section Evaluation Metrics, p.4-5).

3. **6 techniques d'attaque incluant FlipAttack.** L'inclusion de FlipAttack (reordonnancement de caracteres/mots, ref. 19) est strategique : cette technique simple mais efficace atteint CR = 1.00 sur GPT-4-turbo (Table 2), surpassant les techniques sophistiquees comme PAIR sur certains modeles. Cela suggere que la robustesse n'est pas correlee a la complexite de l'attaque (Zhang, Lou & Wang, 2025, Section Results, Table 2).

4. **CFT comme defense concrete et testee.** Contrairement a P029 (purement evaluatif) et P031 (pas de defense), P034 propose ET teste une defense. Les resultats du CFT sont remarquables : MES chute de 0.57 a 0.01 (Plain) et de 0.83 a 0.05 (PAIR) sur Llama3.1-8B (Table 1). La CR chute de 0.72 a 0.01 (Plain) et de 0.98 a 0.08 (PAIR) sur Llama3.1-8B (Table 2). C'est la reduction la plus importante du corpus.

5. **Code public.** Le code est disponible sur https://github.com/PittNAIL/med_jailbreak, permettant la reproductibilite et l'integration dans le pipeline AEGIS.

6. **Dataset standardise (MedSafetyBench).** L'utilisation de MedSafetyBench (sous-ensemble MedSafety-Eval-GPT4, ref. 24) comme source de requetes medicales nocives fournit une base de comparaison standardisee, contrairement aux scenarios ad hoc de P031 (Zhang, Lou & Wang, 2025, Section Methods, p.3-4, Dataset Description).

**Faiblesses :**

1. **Compliance Rate via juge LLM non valide.** Le chiffre de CR = 0.98 sur GPT-4o et 1.00 sur GPT-4-turbo repose sur un juge LLM domain-adapted. A la lumiere de P044 (Li et al., 2025, arXiv:2512.17375, Section 4, Table 3 : FPR de 99.91% sur les juges LLM par manipulation adversariale), la fiabilite du juge est questionnable. Le MES et la CR pourraient etre gonfles par des faux positifs du juge (Section Methods, p.4-5).

2. **CFT sur un seul modele.** Le CFT n'est teste que sur Llama3.1-8B (generaliste) et Meditron-7B (medical). La transferabilite a des modeles plus grands (70B, 405B) ou d'autres familles (GPT, Claude) n'est pas demontree. L'extrapolation est risquee -- les modeles plus grands pourraient resister differemment au CFT (Section Limitations).

3. **Equilibre securite-utilite non mesure.** La reduction de MES (~62.7% en moyenne, calculee depuis Table 1, Section Results) est positive pour la securite, mais l'impact sur les capacites cliniques normales du modele (diagnostic, recommandation, triage) n'est pas evalue avec des metriques standard (USMLE, MedQA, etc.). Un modele qui refuse toute requete medicale sensible n'est pas cliniquement utile (Section Limitations, implicite).

4. **Meditron plus resistant -- mais pourquoi ?** Meditron-70B montre une resistance superieure (MES 0.26-0.53 selon technique, vs 0.51-0.87 pour Llama3.3-70B, Table 1), mais l'article n'analyse pas pourquoi. Est-ce le fine-tuning medical, le dataset d'entrainement, ou l'architecture ? Cette question est critique pour comprendre si le fine-tuning medical renforce ou affaiblit l'alignement (Section Results, Table 1).

5. **Abstract discordant avec les tables.** L'abstract (Zhang, Lou & Wang, 2025, p.1) annonce "seven LLMs" et "three advanced black-box jailbreaking techniques", mais les tables montrent 8 lignes de modeles (en comptant les versions CFT) et 6 colonnes de techniques (Plain, PAIR, PAP Misrepresentation, PAP Authority Endorsement, PAP Logical Appeal, FlipAttack). Cette inconsistance mineure nuit a la rigueur du preprint.

6. **Preprint non peer-reviewed.** Les resultats n'ont pas passe le processus de revision academique. Les claims doivent etre traitees avec la prudence associee au tag [PREPRINT].

**Questions ouvertes :**
- Le CFT est-il durable face a des attaques adaptatives post-CFT ?
- La resistance de Meditron est-elle due au fine-tuning medical ou a d'autres facteurs ?
- L'equilibre CFT (securite) vs utilite clinique est-il acceptable en production ?
- Les resultats se transferent-ils aux modeles de raisonnement (o1, o3, DeepSeek-R1) ?

### Formules exactes

Classification epistemique : `[EMPIRIQUE]` -- metriques definies operationnellement, pas de contribution formelle.

**Mean Effectiveness Score (MES)** (Section Evaluation Metrics, p.4-5) :
```
MES(technique, modele) = (1/N) * sum_{i=1}^{N} score_nocivite(prompt_i)
```
Score continu (0-5) attribue par le juge LLM domain-adapted. N = 450 par technique-modele.

**Compliance Rate (CR)** (Section Evaluation Metrics, p.4-5) :
```
CR(technique, modele) = |{i : modele a suivi l'instruction jailbreak}| / N
```
Mesure binaire : equivalent fonctionnel de l'ASR.

**Resultats MES principaux** (Table 1, Section Results) :

| Modele | Plain | PAIR | PAP Misrep. | PAP Auth. | PAP Logic. | FlipAttack |
|--------|-------|------|-------------|-----------|------------|------------|
| GPT-4o | 0.33 | 0.81 | 0.69 | 0.61 | 0.61 | 0.87 |
| GPT-4-turbo | 0.25 | 0.79 | 0.67 | 0.58 | 0.58 | 0.98 |
| DeepSeek-R1-Distill-70B | 0.50 | 0.69 | 0.65 | 0.61 | 0.56 | 0.78 |
| Llama3.3-70B | 0.35 | 0.79 | 0.53 | 0.51 | 0.55 | 0.87 |
| Meditron-70B | 0.31 | 0.29 | 0.44 | 0.43 | 0.53 | 0.26 |
| Llama3.1-8B | 0.57 | 0.83 | 0.64 | 0.63 | 0.63 | 0.57 |
| Llama3.1-8B-CFT | 0.01 | 0.05 | 0.01 | 0.02 | 0.02 | 0.01 |
| Meditron-7B | 0.12 | 0.02 | 0.26 | 0.14 | 0.17 | 0.02 |

**Resultats CR principaux** (Table 2, Section Results) :

| Modele | Plain | PAIR | PAP Misrep. | PAP Auth. | PAP Logic. | FlipAttack |
|--------|-------|------|-------------|-----------|------------|------------|
| GPT-4o | 0.44 | 0.96 | 0.96 | 0.93 | 0.96 | 0.98 |
| GPT-4-turbo | 0.35 | 0.96 | 0.93 | 0.89 | 0.93 | 1.00 |
| DeepSeek-R1-Distill-70B | 0.65 | 0.91 | 0.94 | 0.95 | 0.92 | 0.93 |
| Llama3.3-70B | 0.46 | 0.96 | 0.78 | 0.80 | 0.91 | 0.98 |
| Meditron-70B | 0.44 | 0.40 | 0.70 | 0.72 | 0.91 | 0.43 |
| Llama3.1-8B | 0.72 | 0.98 | 0.89 | 0.94 | 0.98 | 0.70 |
| Llama3.1-8B-CFT | 0.01 | 0.08 | 0.02 | 0.04 | 0.05 | 0.01 |
| Meditron-7B | 0.23 | 0.06 | 0.44 | 0.26 | 0.34 | 0.03 |

**CFT defense effectiveness** (Table 1, deltas) :
```
Llama3.1-8B -> Llama3.1-8B-CFT :
  MES Plain : 0.57 -> 0.01 (delta = -0.56)
  MES PAIR  : 0.83 -> 0.05 (delta = -0.78)
  CR  Plain : 0.72 -> 0.01 (delta = -0.71)
  CR  PAIR  : 0.98 -> 0.08 (delta = -0.90)
```

Lien glossaire AEGIS : F22 (ASR -- CR est equivalent binaire), F58 (Medical Vulnerability Premium)

### Pertinence these AEGIS

- **Couches delta :**
  - δ⁰ (RLHF alignment) : evaluation directe de la resilience de l'alignement aux attaques medicales ; CR = 0.98 sur GPT-4o montre l'echec delta-0 (Table 2)
  - δ⁰ (CFT comme amelioration delta-0) : le CFT est un renforcement de delta-0 par fine-tuning continu post-deployment avec donnees adversariales

- **Conjectures :**
  - C1 (insuffisance delta-1) : **fortement supportee** -- les 8 modeles sont vulnerables a CR >= 0.70 pour au moins une technique malgre leur alignement (Table 2)
  - C4 (scaling independence) : **partiellement supportee** -- GPT-4o (flagship) et Llama3.3-70B (70B open) partagent des CR similaires (0.96-0.98 pour PAIR), suggerant que la taille ne protege pas (Table 2)
  - C6 (Medical Vulnerability Premium) : **supportee indirectement** -- CR de 0.98 en medical est parmi les plus eleves du corpus, mais absence de comparaison directe med/non-med

- **Decouvertes :**
  - D-003 (CFT defense) : **quantifiee** -- reduction MES de 0.57 a 0.01 (Plain) sur Llama3.1-8B (Table 1)
  - D-018 (trade-off securite/utilite du CFT) : **potentielle** -- non mesuree mais identifiee comme gap (Section Limitations)
  - D-020 (Meditron resistance) : **nouvelle observation** -- Meditron-70B montre CR 0.40 (PAIR) vs Llama3.3-70B 0.96 (PAIR) (Table 2), suggerant que le fine-tuning medical renforce la resistance pour certaines techniques

- **Gaps :**
  - G-005 (durabilite CFT face aux attaques adaptatives) : **cree**
  - G-008 (transferabilite cross-modele du CFT) : **cree** -- CFT teste uniquement sur 8B/7B
  - G-020 (mesure securite-utilite pour les defenses medicales) : **cree** -- absent de cette etude et de toutes les etudes du corpus

- **Mapping templates AEGIS :** #01-#05 (techniques black-box generiques), defense CFT comparable a taxonomy technique #D12 (adversarial fine-tuning)

### Citations cles
> "the most effective jailbreaking technique reaches a 98% compliance rate on GPT-4o and llama3.3-70B" (Section Results, Table 2)
> "continual fine-tuning decreases the mean effectiveness score of jailbreaking on llama3.1-8B by an average of 62.7% across tested jailbreaking techniques" (Section Results)
> "FlipAttack achieved the highest compliance rates for models with built-in safety guardrails, reaching 0.98 for GPT-4o and 1.00 for GPT-4-turbo" (Section Results, Table 2)
> "The models with continual safety fine-tuning demonstrated near-[complete] resistance, with mean effectiveness scores close to 0 across all techniques" (Section Results)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute -- code public (GitHub PittNAIL/med_jailbreak), 8 modeles testes, metriques definies formellement, dataset MedSafetyBench |
| Code disponible | Oui (https://github.com/PittNAIL/med_jailbreak) |
| Dataset public | Partiel (MedSafetyBench reference, code public) |
| Nature epistemique | [EMPIRIQUE] -- metriques operationnelles, pipeline automatise, pas de contribution formelle |
| Confiance | 7/10 -- fulltext verifie, code public, mais preprint non peer-reviewed et juge LLM non valide |

---

*Analyse reecrite le 2026-04-05 | Source : 46 chunks paper_fulltext + 26 chunks analysis ChromaDB (aegis_bibliography) | Toutes les donnees verifiees dans le PDF original via ChromaDB*
