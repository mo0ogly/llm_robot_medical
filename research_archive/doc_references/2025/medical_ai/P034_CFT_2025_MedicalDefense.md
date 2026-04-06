## [Zhang, Lou & Wang, 2025] --- Towards Safe AI Clinicians: A Comprehensive Study on Large Language Model Jailbreaking in Healthcare

**Reference :** University of Pittsburgh / University of Central Florida (preprint)
**Revue/Conf :** Preprint, 2025 (code : https://github.com/PittNAIL/med_jailbreak)
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P034_source.pdf](../../literature_for_rag/P034_source.pdf)
> **Statut**: [ARTICLE VERIFIE] --- lu en texte complet via ChromaDB (46 chunks fulltext, 45343 caracteres)

### Abstract original
> Large language models (LLMs) are increasingly utilized in healthcare applications. However, their deployment in clinical practice raises significant safety concerns, including the potential spread of harmful information. This study systematically assesses the vulnerabilities of seven LLMs to three advanced black-box jailbreaking techniques within medical contexts. To quantify the effectiveness of these techniques, we propose an automated and domain-adapted agentic evaluation pipeline. Experiment results indicate that leading commercial and open-source LLMs are highly vulnerable to medical jailbreaking attacks. To bolster model safety and reliability, we further investigate the effectiveness of Continual Fine-Tuning (CFT) in defending against medical adversarial attacks. Our findings underscore the necessity for evolving attack methods evaluation, domain-specific safety alignment, and LLM safety-utility balancing.
> --- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Evaluer systematiquement la vulnerabilite des LLM aux attaques de jailbreaking dans le contexte medical et tester le Continual Fine-Tuning (CFT) comme defense (Section Introduction, p.1-2)
- **Methode :** 5 techniques de jailbreaking black-box (Plain, PAIR, PAP Misrepresentation, PAP Authority Endorsement, PAP Logical Appeal) contre 7 LLM, evaluation par pipeline automatise avec juge LLM adapte au domaine medical (Section Methods, p.3-5)
- **Donnees :** 7 LLM (GPT-4o, GPT-4o-mini, Llama 3.1-8B, Llama 3.3-70B, Claude-3.5-haiku, Gemini-1.5-pro, Gemini-1.5-flash), metriques : Mean Effectiveness Score (MES), Compliance Rate (CR), Model Breach Rate (MBR) (Section Evaluation Metrics, p.4-5)
- **Resultat :** Compliance Rate de 98% sur GPT-4o et Llama 3.3-70B pour la technique la plus efficace ; CFT reduit le MES de 62.7% en moyenne sur Llama 3.1-8B (Section Results, Table 1 et Table 2)
- **Limite :** CFT evalue uniquement sur Llama 3.1-8B ; juge LLM potentiellement manipulable (cf. P044) ; equilibre securite-utilite du CFT non mesure avec metriques standard (Section Limitations)

### Analyse critique

**Forces :**

1. **Couverture cross-modele exemplaire.** 7 LLM couvrant les 4 principaux fournisseurs (OpenAI, Meta, Anthropic, Google), incluant des modeles de differentes tailles et capacites. C'est la couverture la plus large du corpus pour le domaine medical (Section Methods, p.3).

2. **Metriques d'evaluation tripartites.** Trois metriques complementaires : Mean Effectiveness Score (mesure continue de la nocivite), Compliance Rate (mesure binaire de la reussite), Model Breach Rate (mesure de la couverture de la vulnerabilite). Cette approche multidimensionnelle est superieure au simple ASR binaire (Section Evaluation Metrics, p.4-5).

3. **Pipeline automatise domain-adapted.** Le juge LLM est adapte specifiquement au domaine medical avec des criteres d'evaluation cliniquement pertinents, pas des criteres generiques de nocivite. Cela adresse partiellement la critique de P044 sur les juges generiques (Section Methods, p.4).

4. **CFT comme defense concrete.** Contrairement a P029 (purement evaluatif), P034 propose ET teste une defense. La reduction de 62.7% du MES par CFT sur Llama 3.1-8B est un resultat actionnable (Section Results, Table 1).

5. **Code public.** Le code est disponible sur https://github.com/PittNAIL/med_jailbreak, permettant la reproductibilite et l'integration dans le pipeline AEGIS (Section Methods, p.5).

**Faiblesses :**

1. **Compliance Rate 98% : alarmant mais fragile.** Le chiffre de 98% sur GPT-4o et Llama 3.3-70B repose sur un juge LLM dont la fiabilite est questionnable. P044 (AdvJudge-Zero) montre que les juges LLM peuvent etre flippes a 99% (Li et al., 2025, arXiv:2512.17375, Table 3). Le MES pourrait etre gonfle par des faux positifs du juge (Section Results, Table 2).

2. **CFT sur un seul modele.** Le CFT n'est teste que sur Llama 3.1-8B. La transferabilite a des modeles plus grands (70B, 405B) ou d'autres familles (GPT, Claude) n'est pas demontree. L'extrapolation des resultats est risquee (Section Results, Tables 1-2).

3. **Equilibre securite-utilite non mesure.** La reduction de 62.7% du MES est positive pour la securite, mais l'impact sur les capacites cliniques normales du modele (diagnostic, recommandation, triage) n'est pas evalue. Un modele qui refuse toute requete medicale sensible n'est pas cliniquement utile (Section Limitations, implicite).

4. **Techniques PAP uniquement.** Les 5 techniques incluent Plain + PAIR + 3 variantes de PAP (Persuasive Adversarial Prompts). D'autres techniques majeures (GCG, AutoDAN, many-shot, cross-lingual) ne sont pas testees, limitant la portee de l'evaluation (Section Methods, Table 1).

5. **Preprint non peer-reviewed.** Les resultats n'ont pas passe le processus de revision academique. Les claims doivent etre traitees avec prudence.

**Questions ouvertes :**
- Le CFT est-il durable face a des attaques adaptatives post-CFT ?
- La defense par CFT se transfere-t-elle a des modeles plus grands ?
- L'equilibre CFT (securite -62.7% MES) vs utilite clinique est-il acceptable en production ?

### Formules exactes
Classification epistemique : `[EMPIRIQUE]` --- metriques definies operationnellement.

**Mean Effectiveness Score (MES)** (Section Evaluation Metrics, Table 1) :
```
MES(technique, modele) = (1/N) * sum_{i=1}^{N} score_efficacite(prompt_i)
```
Score continu (0-5 echelle de nocivite) attribue par le juge LLM domain-adapted.

**Compliance Rate (CR)** (Section Evaluation Metrics, Table 2) :
```
CR(technique, modele) = |{i : score_compliance(prompt_i) = 1}| / N
```
Mesure binaire : le modele a-t-il suivi l'instruction jailbreak ?

**Resultats principaux** (Section Results, Tables 1-2) :
- Technique la plus efficace : **98% Compliance Rate sur GPT-4o et Llama 3.3-70B**
- CFT defense : **-62.7% MES moyen** sur Llama 3.1-8B, toutes techniques confondues
- CFT scores post-training (Table 1) : reduction significative visible avec changements en gras

Lien glossaire AEGIS : F22 (ASR --- CR est equivalent binaire), F58 (Medical Vulnerability Premium)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (evaluation directe de la resilience de l'alignement aux attaques medicales ; CFT comme amelioration de δ⁰ par fine-tuning continu post-deployment)
- **Conjectures :** C1 (supportee fortement : les 7 LLM sont vulnerables a 98% malgre leur alignement). C4 (scaling independence --- partiellement supportee : GPT-4o et Llama 3.3-70B, modeles de taille tres differente, partagent le meme taux de 98%). C6 (Medical Vulnerability Premium --- supportee indirectement : 98% CR en medical est parmi les plus eleves du corpus)
- **Decouvertes :** D-003 (CFT defense effectiveness) quantifiee : -62.7% MES. D-018 (potentielle : le CFT pourrait creer un trade-off securite/utilite non mesure)
- **Gaps :** G-005 (CFT durabilite face a des attaques adaptatives) cree. G-008 (transferabilite cross-modele du CFT) cree. G-020 (mesure securite-utilite pour les defenses medicales) cree
- **Mapping templates AEGIS :** #01-#05 (techniques black-box generiques), defense CFT comparable a taxonomy technique #D12 (adversarial fine-tuning)

### Citations cles
> "the most effective jailbreaking technique reaches a 98% compliance rate on GPT-4o and llama3.3-70B" (Section Results, p.6)
> "continual fine-tuning decreases the mean effectiveness score of jailbreaking on llama3.1-8B by an average of 62.7% across tested jailbreaking techniques" (Section Results, p.6)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 8/10 |
| Reproductibilite | Haute --- code public (GitHub PittNAIL/med_jailbreak), 7 LLM testes, metriques definies formellement |
| Code disponible | Oui (https://github.com/PittNAIL/med_jailbreak) |
| Dataset public | Non mentionne explicitement |
