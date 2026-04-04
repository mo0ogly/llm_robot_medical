# P043: Jailbreak Distillation: Renewable Safety Benchmarking
**Authors**: Jingyu Zhang, Ahmed Elgohary, Xiawei Wang, A.S.M. Iftekhar, Ahmed Magooda, Kyle Jackson (Johns Hopkins / Microsoft) | **Year**: 2025 | **Venue**: EMNLP 2025 Findings (arXiv:2505.22037)

## Resume FR (~500 mots)

Cette publication propose JBDistill, un cadre de construction de benchmarks de securite renouvelables qui "distille" les attaques de jailbreak en benchmarks reproductibles et facilement actualisables. Le probleme cible est fondamental pour le domaine : les benchmarks de securite existants deviennent rapidement obsoletes a mesure que les modeles evoluent, et les methodes d'evaluation actuelles utilisent des prompts d'attaque differents pour differents modeles avec des budgets de calcul inconsistants, rendant les comparaisons inter-modeles peu fiables.

La methodologie de JBDistill procede en deux etapes. La premiere etape utilise un ensemble restreint de modeles de developpement et des algorithmes d'attaque de jailbreak existants pour creer un pool de prompts candidats. La deuxieme etape emploie des algorithmes de selection de prompts pour identifier un sous-ensemble efficace servant de benchmark de securite. L'utilisation du meme ensemble de prompts d'evaluation pour tous les LLM garantit des comparaisons justes et reproductibles.

Les resultats montrent que les benchmarks de JBDistill atteignent jusqu'a 81.8% d'efficacite et se generalisent a 13 modeles d'evaluation differents, incluant des modeles plus recents, plus grands, proprietaires, specialises et de raisonnement. Cette generalisation surpasse significativement les methodes de test traditionnelles et represente une avancee methodologique importante : un benchmark construit une fois peut evaluer equitablement des modeles qui n'existaient pas au moment de sa creation.

L'aspect "renouvelable" est crucial : contrairement aux benchmarks statiques qui sont rapidement "resolus" par les fournisseurs de modeles (overfitting sur les benchmarks), JBDistill permet la regeneration periodique de nouveaux benchmarks a partir de nouvelles attaques, maintenant la pression evaluative au fil du temps. Ce mecanisme de renouvellement repond directement au probleme de degradation temporelle documente dans P030.

Pour la these AEGIS, JBDistill offre une methode pour standardiser et renouveler l'evaluation des 48 scenarios et 98 templates d'attaque. Actuellement, AEGIS evalue chaque template individuellement contre des modeles cibles, mais sans cadre de selection garantissant la representativite et la non-redondance du benchmark. JBDistill pourrait etre utilise pour distiller les 98 templates en un sous-ensemble optimal de benchmark, maximisant la couverture evaluative tout en minimisant le cout computationnel.

La publication dans EMNLP 2025 Findings et la collaboration Johns Hopkins/Microsoft conferent une solide credibilite academique et industrielle. Le code et les artefacts sont disponibles publiquement sur GitHub (microsoft/jailbreak-distillation), facilitant la reproduction et l'integration.

Un point important : le taux d'efficacite de 81.8% signifie que le benchmark echoue a detecter ~18% des vulnerabilites, un taux non negligeable en contexte medical ou chaque faux negatif peut avoir des consequences cliniques. La comparaison avec PromptArmor (P042, <1% FNR) suggere que l'evaluation est plus difficile que la defense dans ce domaine.

## Formulas & Theorems

| Formule | Description |
|---------|-------------|
| Efficacite = modeles correctement evalues comme vulnerables / total modeles testes = 81.8% max | Taux d'efficacite du benchmark distille |
| Generalisation = score moyen d'efficacite sur les 13 modeles d'evaluation | Mesure de transferabilite inter-modeles |
| Selection optimale : argmax_{S subset pool} coverage(S) sous contrainte \|S\| <= k | Probleme de selection de sous-ensemble de prompts maximisant la couverture |

## Glossaire Preliminaire
| Terme | Explication simple |
|-------|-------------------|
| JBDistill | Jailbreak Distillation — cadre de construction de benchmarks de securite renouvelables |
| Renewable benchmark | Benchmark regulierement regenere a partir de nouvelles attaques pour eviter l'obsolescence |
| Prompt pool | Ensemble de prompts d'attaque candidats generes par des algorithmes de jailbreak existants |
| Prompt selection | Algorithme choisissant un sous-ensemble optimal de prompts pour maximiser la couverture evaluative |
| Cross-model generalization | Capacite du benchmark a evaluer equitablement des modeles non vus pendant sa construction |
| Development models | Ensemble restreint de modeles utilises pour construire le benchmark (distincts des modeles evalues) |

## Research Paths (Gaps identifies)
1. 81.8% d'efficacite laisse ~18% de vulnerabilites non detectees — insuffisant pour le contexte medical
2. La methode de selection ne prend pas en compte la severite clinique des vulnerabilites
3. Le renouvellement periodique necessite un acces continu aux algorithmes d'attaque — question de soutenabilite
4. Pas d'integration avec les metriques cliniques (CHER de P035) — la "reussite" est binaire, pas graduee
5. La methode ne couvre pas les attaques multi-tour (P036) ni les attaques de desalignement (P039)

## delta-Layer Tags
- [ ] delta-0 (RLHF alignment) — non traite directement (evaluation, pas defense)
- [ ] delta-1 (System prompt) — non traite
- [ ] delta-2 (Syntax filtering) — non traite
- [ ] delta-3 (Formal verification) — non traite, mais la standardisation des benchmarks est un pas vers la rigueur formelle

## Conjecture Links
- **C1 (Insuffisance delta-1)**: **Oui (indirect)** — Le benchmark documente les echecs des defenses existantes sur 13 modeles
- **C2 (Necessite delta-3)**: **Partiel** — La standardisation est une etape vers la rigueur formelle mais reste empirique
- **C3 (Shallow alignment)**: **Non traite directement**
- **C4 (Scaling independence)**: **Oui** — Les 13 modeles evalues incluent des tailles variees, montrant que les vulnerabilites persistent a travers les echelles
- **C5 (Cross-layer interaction)**: **Non traite**
- **C6 (Medical specificity)**: **Non traite** — Benchmark generique, pas medical
