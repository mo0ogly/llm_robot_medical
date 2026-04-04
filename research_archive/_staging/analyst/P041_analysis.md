# P041: Efficient Switchable Safety Control in LLMs via Magic-Token-Guided Co-Training
**Authors**: Jianfeng Si et al. (Qihoo 360) | **Year**: 2026 | **Venue**: arXiv:2508.14904

## Resume FR (~500 mots)

Cette publication propose un cadre de co-entrainement unifie permettant d'integrer trois comportements de securite distincts — positif (licite/prosocial), negatif (non filtre/risque) et rejectif (refus/conservateur) — dans une seule etape de fine-tuning supervise (SFT). Chaque comportement est active dynamiquement via une instruction systeme simple, appelee "magic token", permettant un basculement comportemental furtif et efficace au moment de l'inference.

L'innovation centrale est la notion de Safety Alignment Margin (SAM), une mesure dans l'espace des sorties qui quantifie la distance entre les distributions de probabilite des reponses positives, negatives et rejectives. Le co-entrainement vise a maximiser cette marge pour garantir une separation nette entre les trois modes comportementaux. Contrairement aux approches multi-etapes classiques (SFT puis RLHF puis DPO), ce cadre realise l'ensemble du processus en une seule etape SFT, reduisant significativement la complexite d'entrainement.

Les resultats experimentaux montrent que le modele 8B entraine avec cette methode surpasse DeepSeek-R1 (671B parametres) en performance de securite, un resultat remarquable qui demontre que l'efficacite de l'alignement de securite n'est pas une fonction de la taille du modele. Ce resultat contribue directement a la conjecture C4 (scaling independence) : un modele 84 fois plus petit peut etre plus sur qu'un modele geant si l'approche d'entrainement est mieux concue.

La flexibilite du systeme est son atout principal pour les deploiements reels. Le mode positif sert aux interactions utilisateur normales, le mode negatif permet le red-teaming interne (exactement le cas d'usage d'AEGIS), et le mode rejectif offre des refus contextuels declenches par des signaux de moderation en amont. Cette tri-modalite elimine le besoin de maintenir plusieurs modeles distincts pour differents contextes d'utilisation.

Pour la these AEGIS, cette publication est directement pertinente. L'architecture magic-token correspond conceptuellement au basculement entre modes offensif et defensif dans le Red Team Lab. Le mode negatif controle pourrait remplacer l'utilisation de modeles non censures (comme les variantes "uncensored" actuellement utilisees dans certaines chaines d'attaque AEGIS) par un mecanisme plus propre et auditable.

Cependant, la methode souleve une preoccupation de securite fondamentale : si les magic tokens sont decouverts ou devines, un attaquant pourrait forcer le basculement en mode negatif. Les auteurs ne traitent pas explicitement ce vecteur d'attaque, qui constitue une forme d'injection de prompt ciblant le mecanisme de controle lui-meme. GRP-Obliteration (P039) pourrait potentiellement etre adapte pour cibler le mecanisme de magic tokens, creant une vulnerabilite composee.

Le concept de SAM (Safety Alignment Margin) offre une metrique complementaire au Sep(M) de Zverev (P024) : tandis que Sep(M) mesure la separation instruction/donnee, SAM mesure la separation entre modes comportementaux. L'integration des deux metriques pourrait fournir un cadre d'evaluation bidimensionnel plus complet pour la these.

## Formulas & Theorems

| Formule | Description |
|---------|-------------|
| SAM = distance(P_positive, P_negative, P_rejective) dans l'espace des sorties | Safety Alignment Margin — marge de separation entre les trois modes comportementaux |
| Magic token activation : p(mode \| input, token) -> {positive, negative, rejective} | Mecanisme de basculement conditionne par le token systeme |
| Co-training loss : L = L_positive + L_negative + L_rejective (SFT unifie) | Fonction de perte combinant les trois objectifs comportementaux en une seule etape |

## Glossaire Preliminaire
| Terme | Explication simple |
|-------|-------------------|
| Magic token | Instruction systeme speciale activant un mode comportemental specifique du modele |
| Safety Alignment Margin (SAM) | Metrique mesurant la distance entre les distributions des modes positif, negatif et rejectif |
| Co-training | Entrainement simultane de plusieurs objectifs dans une seule phase de fine-tuning |
| Positive mode | Mode comportemental licite et prosocial pour les interactions utilisateur normales |
| Negative mode | Mode non filtre pour le red-teaming interne et les tests de securite |
| Rejective mode | Mode conservateur de refus contextuel declenche par des signaux de moderation |

## Research Paths (Gaps identifies)
1. Securite des magic tokens — si decouverts, ils deviennent un vecteur d'injection de prompt
2. L'interaction entre magic tokens et les attaques de desalignement (P039) n'est pas etudiee
3. Pas d'evaluation en contexte medical — le basculement accidentel en mode negatif dans un systeme medical serait catastrophique
4. La persistance de la separation comportementale sous pression adversariale n'est pas mesuree
5. Le SAM n'est pas compare formellement avec Sep(M) de Zverev (P024)

## delta-Layer Tags
- [x] delta-0 (RLHF alignment) — propose une alternative au pipeline RLHF multi-etapes
- [x] delta-1 (System prompt) — les magic tokens operent au niveau du prompt systeme
- [ ] delta-2 (Syntax filtering) — non traite
- [ ] delta-3 (Formal verification) — non traite (mais le SAM s'approche d'une formalisation)

## Conjecture Links
- **C1 (Insuffisance delta-1)**: **Partiel** — Les magic tokens ameliorent delta-1 mais creent un nouveau vecteur d'attaque
- **C2 (Necessite delta-3)**: **Partiel** — Le SAM est une etape vers la formalisation mais reste empirique
- **C3 (Shallow alignment)**: **Oui (indirect)** — La methode est concue pour remedier aux limitations de l'alignement superficiel
- **C4 (Scaling independence)**: **Oui** — Le modele 8B surpasse DeepSeek-R1 671B en securite, demontrant l'independence taille/securite
- **C5 (Cross-layer interaction)**: **Oui** — L'interaction magic token (delta-1) avec le co-training (delta-0) illustre la coordination inter-couches
- **C6 (Medical specificity)**: **Non traite**
