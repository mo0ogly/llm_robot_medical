# AXES DE RECHERCHE -- Synthese Scientifique
## These doctorale AEGIS -- ENS 2026
## Securite des LLM medicaux contre l'injection de prompt

**Date**: 2026-04-04
**Agent**: Scientist (Opus 4.6)
**Corpus**: 46 articles (P001--P046), 22 formules, 18 techniques d'attaque, 34 modeles de menace

---

## Axe 1 : Fragilite structurelle de l'alignement RLHF (delta-0)

### Constat
L'alignement RLHF, considere comme la premiere ligne de defense des LLM, est mathematiquement demontre comme superficiel. Les gradients d'alignement sont concentres sur les premiers tokens de la reponse et deviennent nuls au-dela de l'horizon de nocivite. Cette fragilite n'est pas un defaut d'implementation mais une limitation theorique fondamentale de l'objectif d'entrainement.

### Papers supportant cet axe
- **P018** (ICLR 2025) : Demonstration experimentale de l'alignement superficiel -- la securite se concentre sur les premiers tokens
- **P019** (Young, 2026) : Preuve mathematique via decomposition en martingale -- le gradient d'alignement est ZERO au-dela de l'horizon de nocivite
- **P022** : Plateformes RLHF adversariales permettant l'empoisonnement de delta-0 a l'entrainement
- **P030** : Erosion temporelle -- les disclaimers medicaux chutent de 26.3% (2022) a 0.97% (2025)
- **P039** (GRP-Obliteration, Microsoft, 2026) : Un seul prompt non-labele suffit a desaligner 15 LLMs via manipulation du mecanisme de recompense GRPO
- **P036** (Nature Comms, 2026) : Les LRM (Large Reasoning Models) atteignent 97.14% de succes en jailbreak autonome -- regression d'alignement ou la capacite de raisonnement permet la subversion

### Contradiction ou debat dans la litterature
- **P017** (Adversarial Preference) et **P020** (COBRA) proposent des ameliorations de l'entrainement RLHF, suggerant que delta-0 peut etre renforce. Cependant, **P019** prouve que les limitations sont structurelles (gradient nul), pas simplement une question d'optimisation.
- **P041** (Magic-Token, 2026) montre qu'un modele 8B peut surpasser DeepSeek-R1 (671B) en securite via co-entrainement, suggerant que la taille du modele n'est pas le facteur determinant.
- **P034** (CFT Medical) montre que le fine-tuning continu ameliore la securite mais peut aussi la degrader (regression).

### Contribution potentielle de la these AEGIS
AEGIS est le premier framework a formaliser delta-0 comme une couche de defense nommee et a quantifier ses limitations. La these peut :
1. Formaliser la preuve d'insuffisance de delta-0 (combinant P018+P019+P030)
2. Proposer un monitoring temporel de delta-0 via Sep(M) versionnee
3. Demontrer experimentalement la regression d'alignement sur des modeles medicaux

### Questions de recherche ouvertes
1. Existe-t-il une borne inferieure theorique pour la robustesse de delta-0 en fonction de la taille du modele ?
2. Le co-entrainement par magic tokens (P041) peut-il etre combine avec le monitoring Sep(M) pour creer un delta-0 adaptatif ?
3. La regression d'alignement documentee par P030 suit-elle un modele predictif (lineaire, exponentiel) ?

### Metriques de validation
- Sep(M) (Zverev et al., P024) avec N >= 30 par condition
- ASR (Attack Success Rate) sur batteries de tests standardisees
- Derive temporelle de Sep(M) entre versions du meme modele
- Gradient d'alignement mesure par les formules 4.5/6.4 de P019

### Liens avec le framework delta-0/delta-1/delta-2/delta-3
Cet axe concerne **exclusivement delta-0**. Il etablit les fondations theoriques justifiant la necessite des couches delta-1 a delta-3.

### Niveau de maturite
**Mature** -- Preuves theoriques solides (P019, ICLR) et empiriques abondantes (P018, P022, P030, P036, P039). La question n'est plus "est-ce que delta-0 est fragile ?" mais "comment quantifier et compenser cette fragilite ?"

---

## Axe 2 : Defense en profondeur multi-couches pour les LLM medicaux

### Constat
Aucune couche de defense individuelle ne suffit a proteger un LLM medical. La litterature demontre systematiquement que chaque couche peut etre contournee isolement : delta-0 par alignement superficiel (P018/P019), delta-1 par partition de contexte (P001), delta-2 par injection de caracteres (P009), et les juges auto-evaluateurs par la vulnerabilite recursive (P033). Seule une approche en profondeur combinant les quatre couches reduit significativement le risque.

### Papers supportant cet axe
- **P029** (JAMA) : 94.4% ASR en injection medicale avec gardes commerciaux -- prouve que delta-0+delta-1 sont insuffisants
- **P001** (HouYi) : 86.1% des applications LLM vulnerables -- delta-1 seul echoue
- **P009** (Hackett et al.) : Evasion complete de tous les gardes commerciaux -- delta-2 seul echoue
- **P033** : Vulnerabilite recursive des juges -- delta-0+juge meme famille echoue
- **P011** (PromptGuard) : Framework 4 couches avec F1=0.91 -- approche multi-couches validee
- **P005** (Firewalls) : Les firewalls seuls sont insuffisants sans benchmarks plus robustes
- **P038** (InstruCoT, 2026) : >90% de defense sur 7 methodes d'attaque mais sur 4 LLMs uniquement
- **P042** (PromptArmor, 2026) : LLM-as-guardrail avec <1% FPR/FNR -- mais necessite un LLM avance (GPT-4o)

### Contradiction ou debat dans la litterature
- **P042** (PromptArmor) suggere qu'un seul LLM avance suffit comme garde (<1% FPR/FNR), ce qui contredit l'approche multi-couches. Mais cette defense repose sur GPT-4o, un modele couteux et proprietaire qui ne peut pas etre deploye partout.
- **P011** valide l'approche 4 couches mais rapporte 33% de bypass residuel meme avec toutes les couches actives (P033 whitehacker).
- La question du cout computationnel de la defense en profondeur reste ouverte.

### Contribution potentielle de la these AEGIS
AEGIS est le premier framework a implementer et evaluer une defense en profondeur specifiquement pour le domaine medical avec 4 couches nommees (delta-0 a delta-3) et 66 techniques de defense. La these peut :
1. Mesurer la reduction incrementale de l'ASR a chaque ajout de couche delta
2. Identifier les combinaisons de couches optimales (cout/efficacite)
3. Comparer avec les defenses mono-couche de la litterature (P042, P038)

### Questions de recherche ouvertes
1. Quel est le taux de bypass residuel lorsque les 4 couches delta sont actives simultanement ?
2. Existe-t-il des interactions negatives entre couches (une couche degradant l'efficacite d'une autre) ?
3. Comment le cout computationnel de la defense en profondeur se compare-t-il au cout d'une attaque reussie en milieu medical ?

### Metriques de validation
- ASR par couche et ASR cumule (delta-0 seul, delta-0+delta-1, ..., delta-0 a delta-3)
- F1 des detecteurs a chaque couche
- Latence ajoutee par couche
- Taux de faux positifs cumule (risque de blocage de requetes legitimes)

### Liens avec le framework delta-0/delta-1/delta-2/delta-3
Cet axe concerne **toutes les couches delta** et leurs interactions. C'est l'axe central de la these.

### Niveau de maturite
**En cours** -- Le concept de defense en profondeur est valide par la litterature, mais aucune etude n'a mesure l'efficacite incrementale des 4 couches delta sur un benchmark medical standardise.

---

## Axe 3 : Specificite du domaine medical comme amplificateur de risque

### Constat
Le domaine medical presente des caracteristiques uniques qui amplifient la severite des injections de prompt : (1) les consequences sont directement liees a la sante des patients, (2) la culture de hierarchie medicale facilite les attaques par usurpation d'autorite, (3) les donnees cliniques contiennent des instructions latentes (protocoles, dosages) qui peuvent servir de vecteurs d'injection indirecte, et (4) les LLM medicaux subissent une erosion passive de securite au fil des mises a jour.

### Papers supportant cet axe
- **P029** (JAMA) : 94.4% ASR global, 91.7% sur les drogues de categorie X -- le taux le plus eleve du corpus
- **P028** : L'usurpation d'autorite medicale exploite la hierarchie clinique pour contourner l'ancrage de role
- **P030** : Erosion longitudinale -- disclaimers medicaux passent de 26.3% a 0.97% en 3 ans
- **P032** (AAAI) : Audit de la desinformation medicale par jailbreak
- **P031** (Mondillo) : Cadre ethique des risques du jailbreak medical
- **P034** (CFT Medical) : Le fine-tuning continu est necessaire mais introduit des risques de regression
- **P027** : Framework pratique d'evaluation de la securite des LLM medicaux
- **P035** (MPIB, 2026) : Benchmark de 9,697 instances avec metrique CHER -- ASR et dommage clinique divergent
- **P040** (Springer, 2026) : La manipulation emotionnelle augmente la desinformation medicale de 6.2% a 37.5%

### Contradiction ou debat dans la litterature
- **P035** (MPIB) montre que l'ASR et le dommage clinique reel (CHER) divergent significativement. Un ASR eleve ne signifie pas necessairement un dommage clinique eleve, et inversement. Cela questionne l'utilisation de l'ASR comme metrique unique dans les etudes medicales.
- **P034** montre que le fine-tuning ameliore la securite mais peut aussi la degrader -- la relation n'est pas monotone.
- La question de la representativite des scenarios d'attaque medicaux (test vs. monde reel) reste ouverte.

### Contribution potentielle de la these AEGIS
AEGIS est le premier framework red team specifiquement concu pour les LLM medicaux avec :
1. 48 scenarios d'attaque incluant des scenarios medicaux dedies
2. Le score SVC (Severity-Vulnerability-Confidence) specifique au contexte clinique
3. La possibilite de mesurer CHER (P035) en parallele de l'ASR pour quantifier le dommage reel

### Questions de recherche ouvertes
1. Comment calibrer la metrique SVC d'AEGIS par rapport a CHER de P035 ?
2. Les vecteurs d'attaque par manipulation emotionnelle (P040) sont-ils specifiques au domaine medical ou generalisables ?
3. L'erosion de securite documentee par P030 est-elle specifique aux mises a jour commerciales ou affecte-t-elle aussi les modeles open-source ?

### Metriques de validation
- ASR sur scenarios medicaux vs. generiques (comparaison intra-modele)
- CHER (Clinical Harm Event Rate) de P035
- SVC (Severity-Vulnerability-Confidence) score AEGIS
- Taux de compliance avec les guidelines FDA/EMA pour les reponses medicales

### Liens avec le framework delta-0/delta-1/delta-2/delta-3
Cet axe est **transversal** -- il impacte toutes les couches delta mais avec une emphase particuliere sur delta-3 (validation de sortie) et delta-0 (erosion temporelle).

### Niveau de maturite
**En cours** -- Le constat est solidement etabli (P029, JAMA) mais les defenses specifiques au medical sont sous-etudiees. AEGIS a une avance significative avec ses scenarios medicaux dedies.

---

## Axe 4 : Mesure formelle de la separation instruction/donnee (Sep(M))

### Constat
La metrique Sep(M) de Zverev et al. (2025) est la seule formalisation mathematique rigoureuse de la capacite d'un LLM a distinguer les instructions des donnees. Cependant, son application pratique souleve des defis : (1) la variante empirique depend de "surprise witnesses" qui peuvent ne pas generaliser, (2) le compromis separation-utilite est severe (fine-tuning augmente Sep de 37.5% a 81.8% mais effondre l'utilite de 67.8% a 19.2%), et (3) la validite statistique requiert N >= 30 par condition, rarement atteint dans les evaluations medicales.

### Papers supportant cet axe
- **P024** (Zverev et al., ICLR 2025) : Definition formelle de Sep(M), variante empirique, compromis separation-utilite
- **P008** (Attention Tracker) : Le Focus Score comme proxy de separation basee sur l'attention
- **P012** (Steck, 2024) : La similarite cosinus peut etre rendue insignifiante par une matrice gauge -- caveat pour les mesures basees sur les embeddings
- **P013** : Intrusion d'antonymes cree des angles morts dans les mesures cosinus
- **P014** (SemScore) : Metrique basee sur sentence transformers pour la derive semantique
- **P041** (Magic-Token, 2026) : Concept de Safety Alignment Margin lie au framework de separation

### Contradiction ou debat dans la litterature
- **P012** (Steck) questionne la fiabilite de la similarite cosinus, ce qui impacte directement la validite de Sep(M) empirique qui utilise des embeddings.
- Le compromis separation-utilite (P024) semble incontournable : les modeles les plus securises sont les moins utiles. Aucun paper ne propose de solution satisfaisante.
- **P015** suggere que les metriques LLM-enhanced sont plus fiables que les embeddings classiques pour capturer la semantique, mais cela introduit une dependance circulaire (LLM evaluant un LLM).

### Contribution potentielle de la these AEGIS
AEGIS est l'un des rares systemes a implementer Sep(M) en production. La these peut :
1. Valider Sep(M) sur un large benchmark medical (N >= 30)
2. Proposer une variante de Sep(M) robuste aux limitations cosinus identifiees par P012
3. Explorer le compromis separation-utilite dans le domaine medical specifiquement

### Questions de recherche ouvertes
1. Sep(M) peut-il etre etendu pour capturer les attaques multi-tour (P010, P040) ?
2. Comment combiner Sep(M) avec CHER (P035) pour une metrique composite de risque medical ?
3. Le compromis separation-utilite est-il plus ou moins severe dans le domaine medical compare au domaine general ?

### Metriques de validation
- Sep(M) formel et empirique (P024) avec N >= 30
- AUROC des detecteurs de derive semantique
- Utilite du modele mesuree par MMLU/HellaSwag avant et apres fine-tuning
- Correlation entre Sep(M) et ASR sur le meme modele

### Liens avec le framework delta-0/delta-1/delta-2/delta-3
Sep(M) est une **metrique transversale** applicable a toutes les couches : elle mesure la vulnerabilite fondamentale de delta-0, la qualite du filtrage delta-2, et l'efficacite du monitoring delta-3.

### Niveau de maturite
**En cours** -- La theorie est solide (ICLR 2025) mais l'application au domaine medical manque de validation empirique a grande echelle.

---

## Axe 5 : Evasion des gardes syntaxiques par injection de caracteres

### Constat
Les 12 categories d'injection de caracteres identifiees par Hackett et al. (P009) contournent la totalite des gardes commerciaux testes (Azure Prompt Shield, ProtectAI, Meta Prompt Guard). Cette evasion est triviale (difficulte TRIVIAL) et exploite le decalage entre le traitement textuel des gardes (pattern matching brut) et la normalisation effectuee par les tokenizers des LLM (NFKC, strip whitespace).

### Papers supportant cet axe
- **P009** (Hackett et al., 2025) : 12 categories d'injection de caracteres avec evasion complete
- **P005** : Evaluation des firewalls montrant des faiblesses structurelles
- **P023** (NDSS) : Les filtres de perplexite detectent les tokens GCG mais pas les injections de caracteres
- **P044** (AdvJudge-Zero, 2026) : Le fuzzing automatise atteint 99% de bypass des gardes par tokens de controle basse-perplexite
- **P033** : Les juges auto-evaluateurs sont aussi vulnerables aux memes evasions

### Contradiction ou debat dans la litterature
- **P044** montre que l'entrainement adversarial reduit l'ASR a quasi-zero, suggerant que les gardes peuvent etre rendus robustes. Cependant, cela necessite un processus d'entrainement adversarial continu (course aux armements).
- Les approches semantiques (delta-0) peuvent compenser les faiblesses syntaxiques (delta-2), mais P018/P019 montrent que delta-0 est lui-meme fragile.

### Contribution potentielle de la these AEGIS
Le RagSanitizer d'AEGIS implemente 15 detecteurs couvrant 12/12 categories d'injection de Hackett et al. C'est l'une des rares defenses documentees avec une couverture complete de ce vecteur d'attaque.

### Questions de recherche ouvertes
1. Les techniques d'injection de caracteres evoluent-elles plus vite que les detecteurs ?
2. Comment combiner la normalisation Unicode (delta-2) avec la detection par attention (P008) pour une defense robuste ?
3. Les attaques compositionnelles (injection de caracteres + multi-tour) sont-elles detectees par les defenses actuelles ?

### Metriques de validation
- Taux de detection par categorie d'injection (12 categories de P009)
- Taux de faux positifs de la normalisation Unicode sur du texte medical legitime
- Resistance aux attaques adaptatives (attaquant connaissant les detecteurs)

### Liens avec le framework delta-0/delta-1/delta-2/delta-3
Cet axe concerne principalement **delta-2** (filtrage syntaxique) avec des implications pour delta-1 (gardes d'entree) et delta-3 (validation de sortie comme filet de securite).

### Niveau de maturite
**Mature** pour la detection des 12 categories connues. **Exploratoire** pour les attaques compositionnelles et adaptatives.

---

## Axe 6 : Validation formelle des sorties (delta-3) comme dernier rempart

### Constat
Delta-3 est la couche la moins etudiee dans la litterature (8/34 papers seulement) mais la plus critique pour la securite medicale. Lorsque delta-0 est superficiel (P018), delta-1 est contourne (P001) et delta-2 est evade (P009), delta-3 est le seul mecanisme restant pour empecher une reponse dangereuse d'atteindre le patient. Le domaine medical exige des contraintes specifiques (validation de dosage, verification de contre-indications, conformite FDA).

### Papers supportant cet axe
- **P029** (JAMA) : 94.4% ASR prouve que delta-0+delta-1 sont insuffisants -- delta-3 est indispensable
- **P011** (PromptGuard) : Les couches 3 (validation semantique) et 4 (raffinement adaptatif) s'alignent avec delta-3
- **P007** : Recommandations pour la verification formelle des sorties
- **P006** : Le `tool_invocation_guard` est une forme de delta-3 pour les architectures agent
- **P035** (MPIB, 2026) : CHER montre que le dommage clinique doit etre valide au niveau de la sortie, pas de l'entree

### Contradiction ou debat dans la litterature
- Aucun paper ne conteste la necessite de delta-3. Le debat porte sur l'implementation : validation par regles (deterministe) vs. validation par LLM (probabiliste, mais vulnerabilite recursive P033).
- Le cout computationnel de la validation de chaque sortie est un frein a l'adoption en production medicale ou la latence est critique.

### Contribution potentielle de la these AEGIS
AEGIS dispose de 5 techniques delta-3 en production (`allowed_output_spec`, `forbidden_directive_check`, `tension_range_validation`, `tool_invocation_guard`, `response_sanitization`), ce qui le place **en avance sur la litterature**. La these peut :
1. Valider ces 5 techniques contre les scenarii P029
2. Proposer des techniques delta-3 specifiques au medical (validation de dosage, verification de contre-indications)
3. Mesurer le gain de securite marginal de delta-3 par rapport aux couches inferieures

### Questions de recherche ouvertes
1. Delta-3 peut-il etre rendu deterministe (non-LLM) tout en restant efficace contre les attaques semantiques ?
2. Quel est le cout de latence acceptable pour la validation delta-3 en production medicale ?
3. Comment eviter la vulnerabilite recursive (P033) dans les validateurs delta-3 bases sur LLM ?

### Metriques de validation
- ASR residuel apres activation de delta-3 (vs. delta-0+delta-1+delta-2 seuls)
- Taux de faux positifs de delta-3 sur des reponses medicales legitimes
- Latence ajoutee par la validation delta-3
- Couverture des guidelines FDA/EMA par les regles delta-3

### Liens avec le framework delta-0/delta-1/delta-2/delta-3
Cet axe concerne **exclusivement delta-3** en tant que couche finale de defense.

### Niveau de maturite
**Exploratoire** dans la litterature (8/34 papers). **En cours** dans AEGIS (5 techniques en production). Forte opportunite de contribution originale.

---

## Axe 7 : Le probleme du juge recursif et la securite multi-agent

### Constat
Les architectures multi-agent et les approches "LLM-as-judge" introduisent une vulnerabilite recursive : si le modele juge partage la meme famille que le modele de base, compromettre l'un compromet l'autre. Ce probleme menace les pipelines de defense multi-agent (P002), les architectures d'auto-evaluation (OpenAI), et toute methodologie d'evaluation par LLM. En 2026, les LRM (P036) amplifient ce risque en raisonnant activement pour contourner les juges.

### Papers supportant cet axe
- **P033** : Demonstration formelle de la vulnerabilite recursive des juges auto-evaluateurs
- **P002** : Pipeline de defense multi-agent -- efficace mais vulnerabilite si les agents sont homogenes
- **P036** (Nature Comms, 2026) : Les LRM raisonnent pour contourner les juges d'autres modeles a 97.14%
- **P044** (AdvJudge-Zero, 2026) : Fuzzing automatise atteint 99% de bypass des juges binaires
- **P042** (PromptArmor, 2026) : LLM-as-guardrail efficace (<1% FPR/FNR) mais dependant d'un modele avance

### Contradiction ou debat dans la litterature
- **P042** montre que les LLM avances (GPT-4o) peuvent servir de gardes efficaces, contredisant partiellement P033. Mais P042 n'a pas teste le cas ou le garde et la cible sont du meme fournisseur.
- **P044** montre que l'entrainement adversarial resout le probleme pour les juges binaires, mais P036 introduit un nouveau vecteur (raisonnement autonome) non couvert par cet entrainement.

### Contribution potentielle de la these AEGIS
AEGIS utilise une architecture heterogene (modeles differents pour le robot medical et l'agent de securite), mitigeant partiellement P033. La these peut :
1. Quantifier le gain de securite d'une architecture heterogene vs. homogene
2. Tester la resistance aux LRM (P036) de l'agent de securite AEGIS
3. Proposer un protocole d'evaluation multi-agent resistant a la recursivite

### Questions de recherche ouvertes
1. La diversite de modele est-elle suffisante ou faut-il aussi une diversite d'architecture (transformer vs. autre) ?
2. Comment evaluer un pipeline de securite multi-agent sans tomber dans la recursivite (qui evalue l'evaluateur ?) ?
3. Les LRM (P036) representent-ils un changement qualitatif dans la menace ou une simple augmentation quantitative ?

### Metriques de validation
- Taux de succes d'attaque sur configuration homogene vs. heterogene
- Correlation entre famille de modele juge/base et taux de bypass
- Resistance aux attaques autonomes par LRM (P036)

### Liens avec le framework delta-0/delta-1/delta-2/delta-3
Cet axe est **transversal** mais concerne principalement la classe DETECT (detection) et delta-3 (validation de sortie par juge LLM).

### Niveau de maturite
**En cours** -- Le probleme est identifie (P033) mais les solutions (heterogeneite de modele, entrainement adversarial P044) sont a un stade precoce. Les LRM (P036) ajoutent une dimension nouvelle en 2026.

---

## Axe 8 : Course aux armements attaque/defense et evolution temporelle

### Constat
Le domaine de la securite des LLM suit une dynamique de course aux armements rapide. Les attaques evoluent de simples injections directes (2023) vers des attaques multi-strategies (2024), puis vers des empoisonnements de chaine d'approvisionnement (2025) et des agents de raisonnement autonomes (2026). Les defenses suivent avec un retard systematique. Cette acceleration suggere que les solutions statiques seront toujours depassees et que des approches adaptatives sont necessaires.

### Papers supportant cet axe
- **P001** (2023) : Injections directes par partition de contexte -- 86.1% ASR
- **P023** (NDSS, 2025) : 4 strategies d'attaque avec escalade progressive
- **P009** (2025) : Evasion complete des gardes par injection de caracteres
- **P022** (2025) : Empoisonnement RLHF au niveau de la chaine d'approvisionnement
- **P036** (2026) : LRM comme agents de jailbreak autonomes -- 97.14% ASR
- **P039** (2026) : Un seul prompt desaligne 15 LLMs
- **P044** (2026) : Fuzzing automatise a 99% de bypass
- **P045** (2026) : Empoisonnement persistant des system prompts
- **P030** : Erosion passive de securite sur 3 ans

### Contradiction ou debat dans la litterature
- Les defenses progressent aussi : **P038** (InstruCoT) atteint >90%, **P042** (PromptArmor) atteint <1% FPR, **P041** (Magic-Token) surpasse des modeles 84x plus grands. La question est : qui progresse plus vite ?
- **P043** (JBDistill) propose des benchmarks renouvelables, suggerant que la communaute est consciente de la peremption rapide des evaluations.

### Contribution potentielle de la these AEGIS
AEGIS peut documenter cette course aux armements avec des donnees longitudinales sur les 34 chaines d'attaque et les 66 techniques de defense, offrant un snapshot quantitatif a un moment precis (2026).

### Questions de recherche ouvertes
1. L'ecart attaque/defense se creuse-t-il ou se reduit-il au fil du temps ?
2. Les defenses adaptatives (InstruCoT P038, entrainement adversarial P044) peuvent-elles briser le cycle de course aux armements ?
3. Quelle est la demi-vie d'une defense donnee avant qu'une attaque ne la contourne ?

### Metriques de validation
- ASR moyen par annee (2023, 2024, 2025, 2026)
- Delai moyen entre publication d'une attaque et publication de la defense correspondante
- Couverture des nouvelles attaques 2026 par les defenses existantes

### Liens avec le framework delta-0/delta-1/delta-2/delta-3
Cet axe est **transversal** -- il affecte toutes les couches delta et necesssite un mecanisme de mise a jour continue.

### Niveau de maturite
**Exploratoire** -- Les donnees longitudinales manquent. Les surveys existants (P003, P037) documentent l'etat a un instant t mais pas l'evolution dynamique.

---

## Resume des 8 Axes

| # | Axe | Couche(s) delta | Maturite | Papers cles |
|---|-----|----------------|----------|-------------|
| 1 | Fragilite structurelle de delta-0 | delta-0 | Mature | P018, P019, P030, P036, P039 |
| 2 | Defense en profondeur multi-couches | Toutes | En cours | P029, P001, P009, P011, P033 |
| 3 | Specificite du domaine medical | Transversal | En cours | P029, P028, P030, P035, P040 |
| 4 | Mesure formelle Sep(M) | Transversal | En cours | P024, P008, P012, P041 |
| 5 | Evasion des gardes syntaxiques | delta-2 | Mature/Exploratoire | P009, P044, P005 |
| 6 | Validation formelle (delta-3) | delta-3 | Exploratoire | P029, P011, P035 |
| 7 | Juge recursif et multi-agent | DETECT, delta-3 | En cours | P033, P036, P044, P042 |
| 8 | Course aux armements temporelle | Toutes | Exploratoire | P001, P036, P039, P044, P045 |

---

*Agent Scientist -- AXES_DE_RECHERCHE.md*
*8 axes identifies, 46 papers mobilises*
*Derniere mise a jour: 2026-04-04*
