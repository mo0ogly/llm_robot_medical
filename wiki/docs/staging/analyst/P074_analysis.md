## [Zhang, Lou, Wang, 2025] — Towards Safe AI Clinicians : Jailbreaking LLM en contexte medical

**Reference :** arXiv (ID non specifie dans les metadonnees — verifier). GitHub: https://github.com/PittNAIL/med_jailbreak
**Revue/Conf :** Preprint, University of Pittsburgh
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P074_Zhang_2025_SafeAIClinicians.pdf](../../assets/pdfs/P074_Zhang_2025_SafeAIClinicians.pdf)
> **Statut**: [PREPRINT VERIFIE] — lu en texte complet via ChromaDB (46 chunks)

### Abstract original
> Large language models (LLMs) are increasingly utilized in healthcare applications. However, their deployment in clinical practice raises significant safety concerns, including the potential spread of harmful information. This study systematically assesses the vulnerabilities of seven LLMs to three advanced black-box jailbreaking techniques within medical contexts. To quantify the effectiveness of these techniques, we propose an automated and domain-adapted agentic evaluation pipeline. Experiment results indicate that leading commercial and open-source LLMs are highly vulnerable to medical jailbreaking attacks. To bolster model safety and reliability, we further investigate the effectiveness of Continual Fine-Tuning (CFT) in defending against medical adversarial attacks. Our findings underscore the necessity for evolving attack methods evaluation, domain-specific safety alignment, and LLM safety-utility balancing.
> — Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Les LLM deployes en clinique sont vulnerables aux techniques de jailbreaking black-box ; les evaluations de securite existantes sont insuffisantes pour le domaine medical (Introduction, p. 1).
- **Methode :** 5 techniques black-box (PAIR, PAP-Misrepresentation, PAP-Authority Endorsement, PAP-Logical Appeal, FlipAttack) testees sur 7 LLM ; pipeline agentic automatise d'evaluation adapte au domaine medical ; defense par Continual Fine-Tuning (CFT) avec LoRA (Section Methods, p. 2-4).
- **Donnees :** MedSafetyBench pour l'evaluation (nombre exact de prompts non specifie) et MedSafety-Improve-GPT4 pour le fine-tuning (2700 samples d'entrainement) (Section Fine-tuning Datasets, p. 4).
- **Resultat :** FlipAttack atteint 98% Compliance Rate sur GPT-4o et Llama3.3-70B (Table 1-2, p. 5). CFT reduit le Mean Effectiveness Score de 62.7% en moyenne sur Llama3.1-8B. Model Breach Rate : GPT-4-turbo 93%, GPT-4o 81% (Section Discussion, p. 6).
- **Limite :** Scope limite aux techniques testees (pas exhaustif) ; evaluation automatisee peut manquer des nuances captees par review humaine ; dependance au dataset MedSafetyBench limite la generalisabilite ; pas d'exploration de strategies de defense autres que CFT (Section Limitations, p. 6).

### Analyse critique
**Forces :**
- Couverture de 7 modeles incluant commerciaux (GPT-4o, GPT-4-turbo) et open-source (DeepSeek-R1, Llama3.3-70B, Meditron-70B, Llama3.1-8B, Meditron-7B) — evaluation cross-modele solide (Table 1, p. 5).
- Pipeline agentic automatise pour evaluation domaine-specific — scalable et reproductible (Section Methods).
- Resultat contre-intuitif : Meditron-7B (modele moins capable) montre meilleure resistance aux jailbreaks que les modeles plus puissants — confirme le paradoxe identifie par Zhang et al. (2024) dans P029 (Section Discussion, p. 6).
- CFT avec adversarial training demontre efficacite : reduction dramatique des scores d'efficacite de jailbreak (Table 1, p. 5).

**Faiblesses :**
- FlipAttack domine mais n'est pas detaille dans le papier — reference externe (Liu et al., 2024).
- 2700 samples d'entrainement pour CFT = taille modeste ; pas d'analyse de robustesse a long terme ni d'evaluation de la retention des connaissances medicales post-CFT.
- Model Breach Rate (au moins 1 technique reussit) atteint 93% sur GPT-4-turbo — metrique alarmante mais pas detaillee par categorie de harm.
- Pas de comparaison avec des defenses prompt-based ou architecturales (ISE, StruQ, DefensiveTokens).

**Questions ouvertes :**
- Le CFT degrade-t-il la qualite des reponses medicales legitimes ? (trade-off safety-utility non mesure)
- Les resultats sont-ils stables dans le temps ? (patch silencieux des modeles commerciaux)

### Formules exactes
- **Mean Effectiveness Score** : metrique non formalisee mathematiquement dans le papier — score d'efficacite de 0 a 1 par paire technique-modele (Table 1, p. 5). [ABSTRACT SEUL pour la formule]
- **Compliance Rate** : proportion de prompts atteignant un score de compliance de 1 (Section Methods, p. 3).
- **Model Breach Rate** : pourcentage de prompts pour lesquels au moins une technique reussit le bypass (Section Methods, p. 3).
Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M) — par analogie avec la compliance rate)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (jailbreaking direct sur l'alignement RLHF — PRIMAIRE), δ¹ (N/A), δ² (N/A), δ³ (N/A)
- **Conjectures :** C2 (shallow alignment) — SUPPORTEE FORTEMENT : 98% compliance rate demontre que l'alignement RLHF est superficiel face aux attaques sophistiquees ; C4 (domain-specific alignment) — SUPPORTEE : Meditron-7B plus resistant que les modeles generalistes
- **Decouvertes :** D-012 (shallow alignment RLHF) — CONFIRMEE par les resultats GPT-4o/GPT-4-turbo ; D-005 (paradoxe capability-safety) — CONFIRMEE par Meditron-7B
- **Gaps :** G-001 (defense integree medical) — NON ADRESSE : CFT est une defense generique, pas specifique au contexte chirurgical ; G-010 (evaluation longitudinale) — CREE : pas de test post-patch
- **Mapping templates AEGIS :** #10-#15 (authority impersonation — PAP-Authority), #20-#25 (role-play — PAIR), #50-#55 (encoding — FlipAttack)

### Citations cles
> "The most effective jailbreaking technique reaches a 98% compliance rate on GPT-4o and llama3.3-70B." (Section Introduction, p. 2)
> "Continual fine-tuning decreases the mean effectiveness score of jailbreaking on llama3.1-8B by an average of 62.7% across tested jailbreaking techniques." (Section Introduction, p. 2)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute — code public GitHub, modeles accessibles, dataset MedSafetyBench public |
| Code disponible | Oui (https://github.com/PittNAIL/med_jailbreak) |
| Dataset public | Oui (MedSafetyBench via NeurIPS 2024) |
