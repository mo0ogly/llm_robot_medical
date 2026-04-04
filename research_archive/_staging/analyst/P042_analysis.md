# P042: PromptArmor: Simple yet Effective Prompt Injection Defenses
**Authors**: Tianneng Shi, Kaijie Zhu, Zhun Wang, Yuqi Jia, Mingyi Cai, Liang Liang, Zhaorun Wang, Fahad Alzahrani, Hao Lu, Kenji Kawaguchi, Badr Alomair, Yujia Zhao, Mingda Wang, Neil Gong, Xiang Lisa Li, Song Guo | **Year**: 2025 | **Venue**: arXiv:2507.15219 (under review ICLR 2026)

## Resume FR (~500 mots)

PromptArmor demontre un resultat contre-intuitif mais puissant : les LLM modernes avec des capacites de raisonnement avancees peuvent servir de garde-fous efficaces contre les injections de prompt par simple prompting, sans fine-tuning ni architecture supplementaire. En utilisant GPT-4o, GPT-4.1 ou o4-mini comme LLM de garde, PromptArmor atteint des taux de faux positifs (FPR) et de faux negatifs (FNR) inferieurs a 1% sur le benchmark AgentDojo, et inferieurs a 5% sur Open Prompt Injection et TensorTrust.

Le mecanisme de PromptArmor est elegant dans sa simplicite : etant donne une entree d'agent, il detecte d'abord si elle a ete contaminee par un prompt injecte, puis, si une contamination est detectee, il supprime le prompt injecte de l'entree avant de la transmettre a l'agent pour traitement. Ce schema de detection-puis-nettoyage est une defense en deux temps qui combine l'aspect detection de delta-2 avec l'aspect prevention de delta-1.

L'efficacite est remarquable : apres suppression des prompts injectes par PromptArmor, le taux de reussite d'attaque (ASR) tombe en dessous de 1% sur AgentDojo. Ce resultat est significativement superieur aux defenses precedentes et approche les niveaux de performance necessaires pour un deploiement en contexte critique (medical, financier).

Le resultat le plus important pour la communaute est la demonstration que le prompting soigneux ("careful prompting") d'un LLM suffisamment capable peut remplacer des defenses complexes necessitant du fine-tuning ou des architectures specialisees. Cela plaide pour une defense delta-1 avancee : si le garde-fou est lui-meme un LLM suffisamment puissant et correctement instruit, la defense par prompt systeme peut atteindre des niveaux de performance quasi-formels.

Cependant, cette approche cree une dependance critique envers la capacite du modele garde-fou. Les resultats sont obtenus avec GPT-4o et ses successeurs — des modeles frontier proprietaires. La transposition aux modeles plus petits ou open-source n'est pas garantie, et la defense herite des vulnerabilites du modele garde-fou lui-meme. P033 (self-policing) montre que les juges LLM partagent les memes vulnerabilites que les modeles qu'ils protegent, ce qui cree un risque de defaillance correlee.

Pour la these AEGIS, PromptArmor represente la meilleure defense delta-1 documentee dans le corpus. Le seuil de <1% FPR/FNR est un objectif de reference pour le RagSanitizer d'AEGIS. Cependant, l'article ne teste pas les attaques adaptatives les plus recentes (P036 : 97.14% ASR avec LRM, P039 : single-prompt unalignment). La question reste ouverte : PromptArmor resiste-t-il aux attaquants adaptatifs qui connaissent le mecanisme de defense ?

L'approche "guardrail-as-a-service" de PromptArmor est directement implementable dans AEGIS comme couche de defense supplementaire dans le pipeline RAG, en amont ou en complement du RagSanitizer existant.

## Formulas & Theorems

| Formule | Description |
|---------|-------------|
| FPR = faux positifs / (faux positifs + vrais negatifs) < 1% sur AgentDojo | Taux de faux positifs — entrees benignes incorrectement flaggees comme malveillantes |
| FNR = faux negatifs / (faux negatifs + vrais positifs) < 1% sur AgentDojo | Taux de faux negatifs — injections non detectees |
| ASR_post = ASR apres nettoyage par PromptArmor < 1% | Taux d'attaque residuel apres defense |
| Precision = VP / (VP + FP) | Precision de detection |
| Recall = VP / (VP + FN) | Rappel de detection |

## Glossaire Preliminaire
| Terme | Explication simple |
|-------|-------------------|
| PromptArmor | Defense par detection et nettoyage d'injection utilisant un LLM comme garde-fou |
| Guardrail LLM | LLM dedie a la detection et filtrage des injections de prompt, distinct du modele de production |
| FPR (False Positive Rate) | Taux d'entrees benignes incorrectement identifiees comme des injections |
| FNR (False Negative Rate) | Taux d'injections non detectees par le systeme de defense |
| AgentDojo | Benchmark de reference pour evaluer les defenses contre les injections de prompt dans les agents LLM |
| Detect-then-clean | Schema de defense en deux temps : detection de l'injection puis nettoyage de l'entree |

## Research Paths (Gaps identifies)
1. Dependance aux modeles frontier proprietaires (GPT-4o) — la transposition aux modeles open-source n'est pas demontree
2. Pas de test contre les attaques adaptatives (P036 LRM, P039 GRP-Oblit) qui connaissent le mecanisme de defense
3. Le cout computationnel d'un second LLM en garde-fou n'est pas analyse pour les applications temps reel
4. La vulnerabilite du garde-fou lui-meme (P033 : self-policing failure) n'est pas etudiee
5. Pas d'evaluation en contexte medical avec des metriques cliniques (CHER de P035)

## delta-Layer Tags
- [ ] delta-0 (RLHF alignment) — n'intervient pas directement dans la defense
- [x] delta-1 (System prompt) — la defense opere par prompting soigneux du garde-fou
- [x] delta-2 (Syntax filtering) — la detection d'injection est une forme de filtrage contextuel
- [ ] delta-3 (Formal verification) — non traite, malgre les resultats quasi-formels (<1% erreur)

## Conjecture Links
- **C1 (Insuffisance delta-1)**: **Nuance** — PromptArmor montre que delta-1 AVANCEE (LLM comme garde-fou) peut atteindre <1% erreur, mais repose sur un modele frontier
- **C2 (Necessite delta-3)**: **Partiel** — Les resultats approchent les niveaux formels mais sans garantie mathematique
- **C3 (Shallow alignment)**: **Non traite directement**
- **C4 (Scaling independence)**: **Oui (inverse)** — La defense requiert un modele frontier, suggerant que la taille compte pour la defense (contrairement a l'attaque)
- **C5 (Cross-layer interaction)**: **Oui** — PromptArmor combine detection (delta-2) et prompting (delta-1) dans un pipeline
- **C6 (Medical specificity)**: **Non traite**
