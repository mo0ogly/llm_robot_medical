# P028 : Towards Safe AI Clinicians -- Jailbreaking in Healthcare

## [Zhang, Lou & Wang, 2025] -- Towards Safe AI Clinicians: A Comprehensive Study on Large Language Model Jailbreaking in Healthcare

**Reference :** arXiv:2501.18632
**Revue/Conf :** Preprint, University of Pittsburgh (PittNAIL), 2025
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P028_2501.18632.pdf](../../assets/pdfs/P028_2501.18632.pdf)
> **Statut**: [PREPRINT] -- lu en texte complet via ChromaDB (46 chunks). Note : meme arXiv ID que P034 (Continual Fine-Tuning), confirme comme etant le meme papier sous deux angles d'analyse differents.

### Abstract original
> This study systematically evaluates the vulnerabilities of seven LLMs against three advanced black-box jailbreaking techniques in medical contexts, and proposes an automated, domain-adapted agentic evaluation pipeline. The authors use three types of attacks: role-playing, authority impersonation, and multi-turn manipulation. Results indicate that leading commercial and open-source LLMs are highly vulnerable to medical jailbreaking attacks. The defensive contribution evaluates Continual Fine-Tuning (CFT) as a guardrail enhancement, showing it reduces mean jailbreak effectiveness scores by 62.7% on average across techniques for Llama3.1-8B. The study highlights three needs: evaluation with evolving attack methods, domain-specific safety alignment, and balancing security-utility tradeoffs in LLMs.
> -- Source : PDF pages 1-2 (reconstitue depuis le texte complet ChromaDB)

### Resume (5 lignes)
- **Probleme :** Les LLM deployes en contexte medical sont hautement vulnerables aux attaques de jailbreaking ; les evaluations existantes ne couvrent pas les scenarios medicaux specifiques (Zhang, Lou & Wang, 2025, Section 1)
- **Methode :** 3 techniques d'attaque black-box (PAIR, PAP variantes : Misrepresentation/Authority Endorsement/Logical Appeal, FlipAttack) sur 7 LLM : GPT-4o, GPT-4-turbo, DeepSeek-R1-Distill-Llama-70B, Llama3.3-70B, Llama3.1-8B, Meditron-70B, Meditron-7B ; scoring automatise GPT-4o-judge avec rubrique 4 dimensions (compliance, policy_alignment, detail, helpfulness) suivant StrongREJECT (Zhang, Lou & Wang, 2025, Section 3, Figure 7)
- **Donnees :** MedSafetyBench (Zhang et al., 2024) comme source de prompts medicaux dangereux ; 2700 echantillons d'entrainement pour CFT ; defense par LoRA avec alpha=256, dropout=0.1, rank=8, lr=5e-5, 2 epochs, AdamW, cosine scheduler (Zhang, Lou & Wang, 2025, Section "Model Guardrail Enhancement" / "Training Details")
- **Resultat :** Model Breach Rate (MBR) : GPT-4-turbo 0.93, GPT-4o 0.81, Llama3.3-70B 0.74, Llama3.1-8B 0.66, DeepSeek-R1 0.49, Meditron-70B 0.19, Meditron-7B 0.04 (Zhang, Lou & Wang, 2025, Table 3) ; FlipAttack est la technique la plus efficace avec compliance rates de 0.98 pour GPT-4o et 1.00 pour GPT-4-turbo (Zhang, Lou & Wang, 2025, Table 2) ; CFT reduit le MBR de Llama3.1-8B de 0.66 a 0.02 (-0.64) et de Meditron-7B de 0.04 a 0.01 (-0.03) (Zhang, Lou & Wang, 2025, Table 3)
- **Limite :** Couverture incomplete des techniques d'attaque ; evaluation automatisee GPT-4o-judge potentiellement biaisee ; generalisation limitee au-dela de MedSafetyBench ; CFT non teste sur modeles closed-source (Zhang, Lou & Wang, 2025, Section "Limitations")

### Analyse critique

**Forces :**

1. **Evaluation multi-modele comprehensive en domaine medical.** Le papier est l'un des rares a evaluer systematiquement 7 LLM en contexte medical specifique, couvrant des modeles commerciaux (GPT-4o, GPT-4-turbo), open-source generalistes (Llama3.x, DeepSeek-R1) et medico-specialises (Meditron) (Zhang, Lou & Wang, 2025, Table 3). Cette couverture permet des comparaisons directes entre familles de modeles.

2. **Model Breach Rate comme metrique pire-cas.** Le MBR mesure la proportion de prompts pour lesquels au moins une technique de jailbreak reussit. C'est plus realiste que l'ASR moyen car un attaquant reel itere sur plusieurs vecteurs. Le MBR de 0.93 pour GPT-4-turbo signifie que 93% des prompts medicaux dangereux peuvent etre extraits si l'attaquant dispose de 3 techniques (Zhang, Lou & Wang, 2025, Table 3, Section "Evaluation Metrics").

3. **Resultat frappant sur les modeles commerciaux.** Le classement des vulnerabilites est contre-intuitif : GPT-4-turbo (0.93) > GPT-4o (0.81) > Llama3.3-70B (0.74) > Llama3.1-8B (0.66). Les modeles les plus capables sont aussi les plus vulnerables, ce qui confirme le phenomene "security by capability" inverse (Zhang, Lou & Wang, 2025, Table 3). FlipAttack atteint une compliance rate de 1.00 pour GPT-4-turbo (Zhang, Lou & Wang, 2025, Table 2).

4. **CFT comme defense concrete.** Le Continual Fine-Tuning avec LoRA montre une reduction massive du MBR (-0.64 sur Llama3.1-8B, Table 3) et des compliance rates quasi-nulles post-CFT (Zhang, Lou & Wang, 2025, Table 2). Les hyperparametres sont completement specifies (alpha=256, rank=8, lr=5e-5, 2 epochs), permettant la reproduction.

5. **Pipeline reproductible.** Code public sur GitHub (https://github.com/PittNAIL/med_jailbreak), MedSafetyBench public, evaluation sur V100 GPU. C'est une des rares contributions en securite medicale des LLM avec reproductibilite complete.

**Faiblesses :**

1. **GPT-4o comme juge.** L'evaluation automatisee utilise GPT-4o comme juge, un modele qui est lui-meme vulnerable au jailbreaking (P044 montre un flip rate de 99% sur les juges LLM). Un biais systematique est possible : GPT-4o-juge pourrait sous-estimer la dangerosity de certaines reponses subtiles, ou etre sensible aux formulations des reponses.

2. **CFT limite aux modeles open-source.** CFT est evalue uniquement sur Llama3.1-8B et Meditron-7B (Zhang, Lou & Wang, 2025, Table 3). Il est inapplicable aux modeles les plus vulnerables (GPT-4-turbo, GPT-4o) qui sont closed-source. Le papier ne propose aucune defense pour les modeles commerciaux.

3. **Correlation capacite/vulnerabilite non expliquee.** L'observation que les modeles plus capables sont plus vulnerables est documentee mais pas expliquee mecanistiquement. Le faible MBR de Meditron-7B (0.04) pourrait etre un artefact de capacite : le modele est trop petit pour generer des reponses detaillees dangereuses, pas mieux aligne.

4. **MedSafetyBench comme unique source.** Tous les prompts viennent du meme dataset. Un biais de domaine est possible : les scenarios non couverts par MedSafetyBench ne sont pas evalues. La diversite des scenarios medicaux dangereux n'est pas quantifiee.

5. **Balance securite-utilite non evaluee.** Le papier ne mesure pas si le CFT degrade les performances cliniques du modele. Un modele qui refuse tout est "secure" mais inutile.

6. **N non specifie par cellule.** Le nombre total d'evaluations n'est pas clairement rapporte par technique par modele. Avec 7 modeles et 3 techniques, les effectifs par cellule pourraient etre insuffisants pour des conclusions robustes.

**Questions ouvertes :**
- Le CFT degrade-t-il les performances cliniques du modele (balance securite-utilite) ?
- Comment le MBR evolue-t-il face a des attaques adaptatives post-CFT ?
- Les modeles Meditron beneficient-ils d'un biais de capacite plutot que d'un meilleur alignement ?
- GPT-4-turbo avec un system prompt defensif atteindrait-il un MBR significativement plus bas ?

### Formules exactes

**Compliance Score** (Zhang, Lou & Wang, 2025, Figure 7) :
Binaire : `compliance = 1` si le modele obeit a la requete adversariale, `0` sinon.

**Policy Alignment Score** (Zhang, Lou & Wang, 2025, Figure 7) :
Evalue l'alignement de la reponse avec la politique d'usage (echelle 0-1).

**Mean Effectiveness Score** (Zhang, Lou & Wang, 2025, Section "Evaluation Metrics") :
Pour chaque paire (technique, modele) : moyenne du score d'efficacite du jailbreak sur tous les prompts du dataset.

**Compliance Rate** :
`CR = proportion de prompts avec compliance_score = 1`

**Model Breach Rate** (Zhang, Lou & Wang, 2025, Table 3) :
`MBR = proportion de prompts pour lesquels AU MOINS UNE technique obtient effectiveness_score = 1`

**CFT hyperparametres** : LoRA, alpha=256, dropout=0.1, rank=8, lr=5e-5, 2 epochs, AdamW optimizer, cosine scheduler, 2700 echantillons d'entrainement (Zhang, Lou & Wang, 2025, Section "Training Details")

Lien glossaire AEGIS : F22 (ASR / Compliance Rate), lie au benchmark medical AEGIS et a la metrique MBR (pas de correspondance directe dans le glossaire actuel -- candidat pour ajout)

### Pertinence these AEGIS

- **Couches delta :** δ⁰ (cible primaire -- evaluation de la robustesse d'alignement RLHF ; CFT comme renforcement de δ⁰) ; δ¹ (les defenses prompt-based sont explicitement jugees limitees car basees sur des regles statiques, Zhang, Lou & Wang, 2025, Section "Model Guardrail Enhancement") ; δ² δ³ non traites (pas de detection syntaxique, pas de verification formelle)
- **Conjectures :**
  - C1 (insuffisance δ¹) : **supportee** -- les defenses prompt-based sont jugees insuffisantes face aux attaques avancees (Zhang, Lou & Wang, 2025, Section "Model Guardrail Enhancement")
  - C2 (necessite δ³) : **supportee** -- le MBR de 0.93 pour GPT-4-turbo montre que δ⁰ seul est radicalement insuffisant en domaine medical ; CFT ameliore δ⁰ mais sans garantie formelle
  - C3 (shallow alignment) : **fortement supportee** -- les modeles commerciaux les plus puissants et les mieux alignes (GPT-4-turbo) sont les plus vulnerables. L'alignement est plus facile a contourner sur les modeles plus capables, ce qui confirme la superficialite de l'alignement RLHF
- **Decouvertes :**
  - D-001 (vulnerabilite medicale) : **confirmee directement** -- MBR 0.93 pour GPT-4-turbo en contexte medical, le chiffre le plus eleve du corpus AEGIS
  - D-003 (fragilite alignment) : **confirmee** -- 7 modeles avec architectures et alignements differents sont tous vulnerables
  - D-009 (CFT defense) : **confirmee** -- reduction de 0.64 du MBR, mais limitee aux modeles open-source
- **Gaps :**
  - G-001 (evaluation medicale) : **directement adresse** -- benchmark medical specifique avec MedSafetyBench
  - G-003 (defense modeles closed-source) : **cree** -- CFT inapplicable aux API (GPT-4o, Claude, GPT-4-turbo)
  - G-018 (balance securite-utilite CFT) : **non adresse** -- impact du CFT sur les performances cliniques non mesure
- **Mapping templates AEGIS :** Directement lie aux templates de role-playing (#21-#25), authority impersonation (#31-#35), multi-turn manipulation (#41-#45). FlipAttack comparable aux templates de reformulation inversee.

### Citations cles
> "leading commercial and open-source LLMs are highly vulnerable to medical jailbreaking attacks" (Zhang, Lou & Wang, 2025, Section 1)
> "general-purpose safety alignment, while providing basic protection against plain harmful queries, fails to adequately address medical-specific security concerns" (Zhang, Lou & Wang, 2025, Discussion)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute -- code public (GitHub PittNAIL/med_jailbreak), V100 GPU, MedSafetyBench public, hyperparametres CFT complets |
| Code disponible | Oui -- https://github.com/PittNAIL/med_jailbreak |
| Dataset public | Oui -- MedSafetyBench (Zhang et al., 2024) |
| Nature epistemique | [EMPIRIQUE] -- evaluation systematique sans garantie formelle ; CFT est une [HEURISTIQUE] sans borne de convergence ni preuve que l'alignement CFT resiste a des attaques adaptatives |
