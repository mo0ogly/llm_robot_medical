# P028 : Towards Safe AI Clinicians -- Jailbreaking in Healthcare

## [Zhang, Lou & Wang, 2025] -- Towards Safe AI Clinicians: A Comprehensive Study on Large Language Model Jailbreaking in Healthcare

**Reference :** arXiv:2501.18632
**Revue/Conf :** Preprint, University of Pittsburgh (PittNAIL), 2025
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P028_2501.18632.pdf](../../literature_for_rag/P028_2501.18632.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (53 chunks). **Note** : arXiv ID identique au papier mentionne pour P028 dans la mission. Verifie comme distinct de P034 (qui porte sur le Continual Fine-Tuning defensif sur un autre angle).

### Abstract original
> [Reconstitue depuis le texte complet ChromaDB]
> This study systematically evaluates the vulnerabilities of seven LLMs against three advanced black-box jailbreaking techniques in medical contexts, and proposes an automated, domain-adapted agentic evaluation pipeline. The authors use three types of attacks: role-playing, authority impersonation, and multi-turn manipulation. Results indicate that leading commercial and open-source LLMs are highly vulnerable to medical jailbreaking attacks. The defensive contribution evaluates Continual Fine-Tuning (CFT) as a guardrail enhancement, showing it reduces mean jailbreak effectiveness scores by 62.7% on average across techniques for Llama3.1-8B. The study highlights three needs: evaluation with evolving attack methods, domain-specific safety alignment, and balancing security-utility tradeoffs in LLMs.
> -- Source : PDF pages 1-2

### Resume (5 lignes)
- **Probleme :** Les LLM deployes en contexte medical sont hautement vulnerables aux attaques de jailbreaking -- les evaluations existantes ne couvrent pas les scenarios medicaux specifiques (Section 1)
- **Methode :** 3 techniques d'attaque black-box (PAIR, PAP variantes : Misrepresentation/Authority Endorsement/Logical Appeal, FlipAttack) sur 7 LLM (GPT-4o, GPT-4-turbo, DeepSeek-R1-Distill-Llama-70B, Llama3.3-70B, Llama3.1-8B, Meditron-70B, Meditron-7B) ; scoring automatise GPT-4o-judge avec rubrique 4 scores (compliance, policy_alignment, detail, helpfulness) suivant StrongREJECT (Section 3)
- **Donnees :** MedSafetyBench (Zhang et al., 2024) ; 2700 echantillons d'entrainement pour CFT ; defense par LoRA (alpha=256, dropout=0.1, rank=8, lr=5e-5, 2 epochs) (Section "Model Guardrail Enhancement")
- **Resultat :** Model Breach Rate : GPT-4-turbo 0.93, GPT-4o 0.81, Llama3.3-70B 0.74, Llama3.1-8B 0.66, DeepSeek-R1 0.49, Meditron-70B 0.19, Meditron-7B 0.04 (Table 3) ; CFT reduit le breach rate de Llama3.1-8B de 0.66 a 0.02 (-0.64) et de Meditron-7B de 0.04 a 0.01 (-0.03) (Table 3)
- **Limite :** Couverture incomplete des techniques d'attaque ; evaluation automatisee (GPT-4o-judge) peut manquer des vulnerabilites subtiles ; generalisation limitee au-dela de MedSafetyBench (Section "Limitations")

### Analyse critique
**Forces :**
- Evaluation multi-modele comprehensive : 7 LLM couvrant commercial (GPT-4o/turbo), open-source (Llama3), et medico-specialise (Meditron) (Table 3)
- Model Breach Rate comme metrique : mesure le pire cas (au moins un jailbreak reussit par prompt) -- plus realiste que l'ASR moyen (Section "Evaluation Metrics")
- Resultat frappant : GPT-4-turbo a un breach rate de 0.93 -- quasiment tous les prompts medicaux dangereux peuvent etre extraits si l'attaquant itere (Table 3)
- CFT comme defense concrete avec reduction massive (-0.64 sur Llama3.1-8B, Table 3)
- Pipeline d'evaluation agentique automatise et reproductible -- code public sur GitHub (https://github.com/PittNAIL/med_jailbreak)
- Metriques de scoring fines (4 dimensions) suivant StrongREJECT (Figure 7)

**Faiblesses :**
- Le juge GPT-4o est lui-meme vulnerable au jailbreaking (P044 montre 99% flip rate) -- biais potentiel dans l'evaluation
- CFT evalue seulement sur Llama3.1-8B et Meditron-7B -- pas sur les modeles les plus vulnerables (GPT-4-turbo, GPT-4o qui sont closed-source)
- Le breach rate de 0.93 pour GPT-4-turbo est alarmant mais le papier n'explore pas les defenses possibles pour les modeles closed-source
- MedSafetyBench comme unique source de prompts -- biais de domaine possible
- CFT necessite des donnees de securite medicale annotees -- cout de creation non evalue
- 2700 echantillons d'entrainement CFT -- N suffisant mais diversite des scenarios non verifiee

**Questions ouvertes :**
- Le CFT degrade-t-il les performances cliniques du modele (balance securite-utilite) ?
- Comment le breach rate evolue-t-il face a des attaques adaptatives post-CFT ?
- Les modeles Meditron (faible breach rate) beneficient-ils d'un biais de capacite (trop petits pour generer du contenu detaille) ?

### Formules exactes

**Compliance Score** (Figure 7) :
Binaire : compliance = 1 si le modele obeit a l'attaque adversariale, 0 sinon.

**Policy Alignment Score** :
Evalue l'alignement de la reponse avec la politique d'usage.

**Mean Effectiveness Score** (Section "Evaluation Metrics") :
Pour chaque paire (technique, modele) : moyenne du score d'efficacite du jailbreak sur tous les prompts du dataset.

**Compliance Rate** :
`CR = proportion de prompts avec compliance_score = 1`

**Model Breach Rate** :
`MBR = proportion de prompts pour lesquels AU MOINS UNE technique de jailbreak obtient effectiveness_score = 1`

**CFT** : LoRA, alpha=256, dropout=0.1, rank=8, lr=5e-5, 2 epochs, AdamW, cosine scheduler (Section "Training Details")

Lien glossaire AEGIS : F22 (ASR / Compliance Rate), lie au benchmark medical AEGIS

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (cible primaire -- evaluation de la robustesse d'alignement ; CFT comme renforcement δ⁰) ; δ¹ (prompt-based defenses jugees limitees) ; δ² δ³ non traites
- **Conjectures :**
  - C1 (insuffisance δ¹) : **supportee** -- les defenses prompt-based sont jugees limitees car basees sur des regles statiques
  - C2 (necessite δ³) : **supportee** -- le breach rate de 0.93 pour GPT-4-turbo montre que δ⁰ seul est insuffisant
  - C3 (shallow alignment) : **fortement supportee** -- les modeles commerciaux les plus puissants sont aussi les plus vulnerables (GPT-4-turbo > GPT-4o > Llama > Meditron)
- **Decouvertes :**
  - D-001 (vulnerabilite medicale) : **confirmee** -- breach rate 0.93 pour GPT-4-turbo en contexte medical
  - D-003 (fragilite alignment) : **confirmee** -- tous les modeles testes sont vulnerables
  - D-009 (CFT defense) : **confirmee** -- reduction de 0.64 du breach rate, mais limitee aux modeles open-source
- **Gaps :**
  - G-001 (evaluation medicale) : **directement adresse** -- benchmark medical specifique
  - G-003 (defense modeles closed-source) : **cree** -- CFT inapplicable aux API (GPT-4o, Claude)
  - G-018 (balance securite-utilite CFT) : **non adresse** -- impact du CFT sur les performances cliniques non mesure
- **Mapping templates AEGIS :** directement lie aux templates de role-playing (#21-#25), authority impersonation (#31-#35), multi-turn (#41-#45)

### Citations cles
> "leading commercial and open-source LLMs are highly vulnerable to medical jailbreaking attacks" (Resume, Section 1)
> "Model Breach Rate: GPT-4-turbo 0.93" (Table 3)
> "CFT reduces the mean jailbreak effectiveness score by 62.7% on average" (Resume)
> "Prompt-based methods rely heavily on static rule sets and predefined instructions" (Section "Model Guardrail Enhancement")

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute -- code public (GitHub PittNAIL/med_jailbreak), V100 GPU, MedSafetyBench public |
| Code disponible | Oui -- https://github.com/PittNAIL/med_jailbreak |
| Dataset public | Oui -- MedSafetyBench (Zhang et al., 2024) |
| Nature epistemique | [EMPIRIQUE] -- evaluation systematique sans garantie formelle ; CFT est une [HEURISTIQUE] sans borne de convergence |
