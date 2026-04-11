# AXES DE RECHERCHE -- Synthese Scientifique
## These doctorale AEGIS -- ENS 2026
## Securite des LLM medicaux contre l'injection de prompt

**Date**: 2026-04-07
**Agent**: Scientist (Opus 4.6)
**Corpus**: 102 articles (P001--P102, excl. P088 doublon), 45 formules, 43 techniques d'attaque
**Version**: v4.0 (RUN-005 -- mise a jour incrementale avec P087-P102)

---

## Axe 1 : Fragilite structurelle de l'alignement RLHF (δ⁰)

### Constat
L'alignement RLHF, considere comme la premiere ligne de defense des LLM, est mathematiquement demontre comme superficiel. Les gradients d'alignement sont concentres sur les premiers tokens de la reponse et deviennent nuls au-dela de l'horizon de nocivite. Cette fragilite n'est pas un defaut d'implementation mais une limitation theorique fondamentale de l'objectif d'entrainement. **En 2026, cette fragilite est confirmee par deux resultats devastateurs : l'alignement peut etre completement efface par un seul prompt (P039), et la capacite de raisonnement des LRM aggrave la situation en permettant la subversion autonome (P036).**

### Papers supportant cet axe
- **P018** (ICLR 2025) : Demonstration experimentale de l'alignement superficiel -- la securite se concentre sur les premiers tokens
- **P019** (Young, 2026) : Preuve mathematique via decomposition en martingale -- le gradient d'alignement est ZERO au-dela de l'horizon de nocivite
- **P022** : Plateformes RLHF adversariales permettant l'empoisonnement de δ⁰ a l'entrainement
- **P030** : Erosion temporelle -- les disclaimers medicaux chutent de 26.3% (2022) a 0.97% (2025)
- **P039** (GRP-Obliteration, Microsoft, 2026) : Un seul prompt non-labele suffit a desaligner 15 LLMs via manipulation du mecanisme de recompense GRPO. **Resultat le plus fort du corpus** : l'alignement n'est pas seulement contournable mais effacable.
- **P036** (Nature Comms, 2026) : Les LRM atteignent 97.14% de jailbreak autonome -- la capacite de raisonnement permet la subversion de l'alignement
- **P044** (AdvJudge-Zero, Unit 42, 2026) : Le fuzzing automatise des juges a 99% montre que meme les mecanismes de supervision de δ⁰ (RLHF, DPO, RLAIF) sont compromettables [NEW RUN-002]
- **P045** (SPP, 2026) : L'empoisonnement persistant des system prompts montre que meme la couche δ¹ ne peut pas compenser un δ⁰ fragile si le prompt systeme lui-meme est corrompu [NEW RUN-002]
- **P050** (JMedEthicBench, 2026) : Degradation multi-tour de 9.5 a 5.5 (p<0.001) sur 22 modeles. Les modeles medicaux specialises sont PLUS vulnerables. [NEW RUN-003]
- **P052** (Young/Cambridge, 2026) : PREUVE FORMELLE par decomposition en martingale : I_t = Cov[E[H|x<=t], score_function]. Formalise P019. [NEW RUN-003]
- **P053** (Kuklani et al., 2025) : Taxonomie des limitations RLHF : paraphrases semantiques contournent l'alignement token-level. [NEW RUN-003]

### Contradiction ou debat dans la litterature
- **P017** (Adversarial Preference) et **P020** (COBRA) proposent des ameliorations de l'entrainement RLHF, suggerant que δ⁰ peut etre renforce. Cependant, **P019** prouve que les limitations sont structurelles (gradient nul), pas simplement une question d'optimisation.
- **P041** (Magic-Token, 2026) montre qu'un modele 8B peut surpasser DeepSeek-R1 (671B) en securite via co-entrainement, suggerant que la taille du modele n'est pas le facteur determinant.
- **P034** (CFT Medical) montre que le fine-tuning continu ameliore la securite mais peut aussi la degrader (regression).
- **P038** (InstruCoT, 2026) atteint >90% de defense via raisonnement metacognitif sur les instructions, mais n'a pas ete teste contre P036/P039 [NEW RUN-002]

### Contribution potentielle de la these AEGIS
AEGIS est le premier framework a formaliser δ⁰ comme une couche de defense nommee et a quantifier ses limitations. La these peut :
1. Formaliser la preuve d'insuffisance de δ⁰ (combinant P018+P019+P030+P039)
2. Proposer un monitoring temporel de δ⁰ via Sep(M) versionnee
3. Demontrer experimentalement la regression d'alignement sur des modeles medicaux
4. **Tester la resistance d'AEGIS aux attaques de desalignement a un prompt (P039)** [NEW RUN-002]
5. **Implementer le Recovery Penalty Objective (P052, F46) comme correction du gradient RLHF** [NEW RUN-003]
6. **Tester la degradation multi-tour sur les modeles medicaux AEGIS (reproduire P050)** [NEW RUN-003]

### Questions de recherche ouvertes
1. Existe-t-il une borne inferieure theorique pour la robustesse de δ⁰ en fonction de la taille du modele ?
2. Le co-entrainement par magic tokens (P041) peut-il etre combine avec le monitoring Sep(M) pour creer un δ⁰ adaptatif ?
3. La regression d'alignement documentee par P030 suit-elle un modele predictif (lineaire, exponentiel) ?
4. **P039 montre que δ⁰ est effacable par un seul prompt : les couches δ¹-δ³ survivent-elles a un δ⁰ efface ?** [NEW RUN-002]
5. **La regression d'alignement des LRM (P036) est-elle un phenomene lineaire ou existe-t-il un seuil de capacite de raisonnement au-dela duquel l'alignement echoue categoriquement ?** [NEW RUN-002]
6. **Le Recovery Penalty Objective de P052 corrige-t-il la concentration du gradient sur les premiers tokens ? Quel est son impact sur l'utilite du modele ?** [NEW RUN-003]
7. **La degradation multi-tour (P050) est-elle aggravee ou attenuee par les couches δ¹-δ³ actives ?** [NEW RUN-003]

### Metriques de validation
- Sep(M) (Zverev et al., P024) avec N >= 30 par condition
- ASR (Attack Success Rate) sur batteries de tests standardisees
- Derive temporelle de Sep(M) entre versions du meme modele
- Gradient d'alignement mesure par les formules 4.5/6.4 de P019
- **CHER (P035) comme mesure complementaire du dommage clinique reel vs. ASR** [NEW RUN-002]

### Liens avec le framework δ⁰/δ¹/δ²/δ³
Cet axe concerne **exclusivement δ⁰**. Il etablit les fondations theoriques justifiant la necessite des couches δ¹ a δ³.

### Niveau de maturite
**Mature** -- Preuves theoriques solides (P019 empirique, P052 formelle) et empiriques abondantes (P018, P022, P030, P036, P039, P050). La question n'est plus "est-ce que δ⁰ est fragile ?" mais "comment quantifier et compenser cette fragilite ?" **P052 fournit la preuve mathematique par martingale. P050 ajoute la dimension multi-tour avec p<0.001. Axe SATURE (10/10).**

---

## Axe 2 : Defense en profondeur multi-couches pour les LLM medicaux

### Constat
Aucune couche de defense individuelle ne suffit a proteger un LLM medical. La litterature demontre systematiquement que chaque couche peut etre contournee isolement : δ⁰ par alignement superficiel (P018/P019), δ¹ par partition de contexte (P001), δ² par injection de caracteres (P009), et les juges auto-evaluateurs par la vulnerabilite recursive (P033). Seule une approche en profondeur combinant les quatre couches reduit significativement le risque. **En 2026, la convergence P039+P044+P045 demontre que δ⁰, δ¹ et δ² sont tous bypassables individuellement, renforçant massivement l'argument pour la defense en profondeur.**

### Papers supportant cet axe
- **P029** (JAMA) : 94.4% ASR en injection medicale avec gardes commerciaux -- prouve que δ⁰+δ¹ sont insuffisants
- **P001** (HouYi) : 86.1% des applications LLM vulnerables -- δ¹ seul echoue
- **P009** (Hackett et al.) : Evasion complete de tous les gardes commerciaux -- δ² seul echoue
- **P033** : Vulnerabilite recursive des juges -- δ⁰+juge meme famille echoue
- **P011** (PromptGuard) : Framework 4 couches avec F1=0.91 -- approche multi-couches validee
- **P005** (Firewalls) : Les firewalls seuls sont insuffisants sans benchmarks plus robustes
- **P038** (InstruCoT, 2026) : >90% de defense sur 7 methodes d'attaque mais sur 4 LLMs uniquement
- **P042** (PromptArmor, 2026) : LLM-as-guardrail avec <1% FPR/FNR -- mais necessite un LLM avance (GPT-4o)
- **P039** (GRP-Obliteration, 2026) : Efface δ⁰ par un seul prompt => δ¹-δ³ deviennent les seules defenses restantes [NEW RUN-002]
- **P044** (AdvJudge-Zero, 2026) : 99% de bypass des juges => les mecanismes de supervision sont eux-memes vulnerables [NEW RUN-002]
- **P045** (SPP, 2026) : L'empoisonnement persistant du system prompt neutralise δ¹ => δ²-δ³ deviennent critiques [NEW RUN-002]
- **P047** (ACL 2025) : La dualite attaque-defense permet de generer des defenses a partir de techniques d'attaque inversees [NEW RUN-003]
- **P049** (Hackett, LLMSec 2025) : 100% d'evasion des guardrails de production => δ² seul est completement insuffisant [NEW RUN-003]
- **P054+P055** (PIDP + RAGPoison, 2026/2025) : Les attaques RAG composees et persistantes creent un nouveau vecteur necessitant une defense δ³ integrite des donnees [NEW RUN-003]
- **P056** (NVIDIA, AIR, 2025) : L'injection de signaux IH dans les representations intermediaires reduit l'ASR de 1.6x a 9.2x [NEW RUN-003]
- **P057** (ASIDE, 2025) : Rotation orthogonale des embeddings = premiere defense architecturale δ⁰ sans perte d'utilite [NEW RUN-003]
- **P060** (SoK, IEEE S&P 2026) : Aucun guardrail seul ne domine sur SEU => validation independante de la necessite multi-couches [NEW RUN-003]

### Contradiction ou debat dans la litterature
- **P042** (PromptArmor) suggere qu'un seul LLM avance suffit comme garde (<1% FPR/FNR), ce qui contredit l'approche multi-couches. Mais cette defense repose sur GPT-4o, un modele couteux et proprietaire qui ne peut pas etre deploye partout.
- **P011** valide l'approche 4 couches mais rapporte 33% de bypass residuel meme avec toutes les couches actives (P033 whitehacker).
- La question du cout computationnel de la defense en profondeur reste ouverte.
- **La convergence 2026 (P039+P044+P045) affaiblit la position de P042 : meme un garde GPT-4o pourrait etre contourne par fuzzing (P044) ou son δ⁰ efface (P039)** [NEW RUN-002]
- **P057 (ASIDE) et P056 (AIR) proposent des defenses architecturales profondes qui pourraient reduire la dependance a la defense multi-couches -- mais ni l'une ni l'autre ne couvre l'empoisonnement RAG (P054/P055)** [NEW RUN-003]

### Contribution potentielle de la these AEGIS
AEGIS est le premier framework a implementer et evaluer une defense en profondeur specifiquement pour le domaine medical avec 4 couches nommees (δ⁰ a δ³) et 66 techniques de defense. La these peut :
1. Mesurer la reduction incrementale de l'ASR a chaque ajout de couche delta
2. Identifier les combinaisons de couches optimales (cout/efficacite)
3. Comparer avec les defenses mono-couche de la litterature (P042, P038)
4. **Mesurer la resilience du systeme quand δ⁰ est completement efface (scenario P039)** [NEW RUN-002]

### Questions de recherche ouvertes
1. Quel est le taux de bypass residuel lorsque les 4 couches delta sont actives simultanement ?
2. Existe-t-il des interactions negatives entre couches (une couche degradant l'efficacite d'une autre) ?
3. Comment le cout computationnel de la defense en profondeur se compare-t-il au cout d'une attaque reussie en milieu medical ?
4. **Quel est le taux de bypass residuel quand δ⁰ est efface (P039) et que seuls δ¹-δ³ sont actifs ?** [NEW RUN-002]
5. **PromptArmor (P042) resiste-t-il au fuzzing AdvJudge-Zero (P044) ?** [NEW RUN-002]

### Metriques de validation
- ASR par couche et ASR cumule (δ⁰ seul, δ⁰+δ¹, ..., δ⁰ a δ³)
- F1 des detecteurs a chaque couche
- Latence ajoutee par couche
- Taux de faux positifs cumule (risque de blocage de requetes legitimes)
- **ASR sans δ⁰ (scenario post-P039)** [NEW RUN-002]

### Liens avec le framework δ⁰/δ¹/δ²/δ³
Cet axe concerne **toutes les couches delta** et leurs interactions. C'est l'axe central de la these.

### Niveau de maturite
**En cours** -- Le concept de defense en profondeur est valide par la litterature, mais aucune etude n'a mesure l'efficacite incrementale des 4 couches delta sur un benchmark medical standardise. **Les papers 2026 rendent cette mesure encore plus urgente en demontrant la fragilite individuelle de chaque couche.**

---

## Axe 3 : Specificite du domaine medical comme amplificateur de risque

### Constat
Le domaine medical presente des caracteristiques uniques qui amplifient la severite des injections de prompt : (1) les consequences sont directement liees a la sante des patients, (2) la culture de hierarchie medicale facilite les attaques par usurpation d'autorite, (3) les donnees cliniques contiennent des instructions latentes (protocoles, dosages) qui peuvent servir de vecteurs d'injection indirecte, et (4) les LLM medicaux subissent une erosion passive de securite au fil des mises a jour. **En 2026, deux contributions majeures renforcent cet axe : MPIB (P035) fournit le premier benchmark medical statistiquement robuste (9,697 instances), et P040 quantifie pour la premiere fois l'amplification par manipulation emotionnelle (6x).**

### Papers supportant cet axe
- **P029** (JAMA) : 94.4% ASR global, 91.7% sur les drogues de categorie X -- le taux le plus eleve du corpus
- **P028** : L'usurpation d'autorite medicale exploite la hierarchie clinique pour contourner l'ancrage de role
- **P030** : Erosion longitudinale -- disclaimers medicaux passent de 26.3% a 0.97% en 3 ans
- **P032** (AAAI) : Audit de la desinformation medicale par jailbreak
- **P031** (Mondillo) : Cadre ethique des risques du jailbreak medical
- **P034** (CFT Medical) : Le fine-tuning continu est necessaire mais introduit des risques de regression
- **P027** : Framework pratique d'evaluation de la securite des LLM medicaux
- **P035** (MPIB, 2026) : Benchmark de 9,697 instances avec metrique CHER -- ASR et dommage clinique divergent. **Premier benchmark medical avec validite statistique N >= 30** [NEW RUN-002]
- **P040** (Springer, 2026) : La manipulation emotionnelle augmente la desinformation medicale de 6.2% a 37.5% (facteur d'amplification 6x). **Premiere quantification de l'effet emotionnel en medical** [NEW RUN-002]
- **P050** (JMedEthicBench, 2026) : 50,000 conversations adversariales, 22 modeles, degradation 9.5->5.5 (p<0.001). Modeles medicaux specialises PLUS vulnerables que generalistes. Cross-lingue (JP-EN). [NEW RUN-003]
- **P051** (Nguyen et al., 2026) : Premier detecteur de jailbreak clinique avec 4 dimensions linguistiques interpretables (Professionnalisme, Pertinence Medicale, Ethique, Distraction). [NEW RUN-003]

### Contradiction ou debat dans la litterature
- **P035** (MPIB) montre que l'ASR et le dommage clinique reel (CHER) divergent significativement. Un ASR eleve ne signifie pas necessairement un dommage clinique eleve, et inversement. Cela questionne l'utilisation de l'ASR comme metrique unique dans les etudes medicales.
- **P034** montre que le fine-tuning ameliore la securite mais peut aussi la degrader -- la relation n'est pas monotone.
- La question de la representativite des scenarios d'attaque medicaux (test vs. monde reel) reste ouverte.
- **P040 revele un vecteur d'attaque emotionnel qui exploite la tension helpful/harmless de l'alignement RLHF -- specifique au medical car l'urgence et l'empathie y sont naturelles** [NEW RUN-002]

### Contribution potentielle de la these AEGIS
AEGIS est le premier framework red team specifiquement concu pour les LLM medicaux avec :
1. 48 scenarios d'attaque incluant des scenarios medicaux dedies
2. Le score SVC (Severity-Vulnerability-Confidence) specifique au contexte clinique
3. La possibilite de mesurer CHER (P035) en parallele de l'ASR pour quantifier le dommage reel
4. **L'integration de vecteurs d'attaque par manipulation emotionnelle (P040) dans les chaines d'attaque existantes** [NEW RUN-002]

### Questions de recherche ouvertes
1. Comment calibrer la metrique SVC d'AEGIS par rapport a CHER de P035 ?
2. Les vecteurs d'attaque par manipulation emotionnelle (P040) sont-ils specifiques au domaine medical ou generalisables ?
3. L'erosion de securite documentee par P030 est-elle specifique aux mises a jour commerciales ou affecte-t-elle aussi les modeles open-source ?
4. **La divergence ASR/CHER (P035) est-elle plus ou moins prononcee quand les defenses δ¹-δ³ sont actives ?** [NEW RUN-002]
5. **Quels leviers emotionnels (urgence, empathie, peur, autorite) sont les plus efficaces en contexte medical specifiquement ?** [NEW RUN-002]

### Metriques de validation
- ASR sur scenarios medicaux vs. generiques (comparaison intra-modele)
- CHER (Clinical Harm Event Rate) de P035
- SVC (Severity-Vulnerability-Confidence) score AEGIS
- Taux de compliance avec les guidelines FDA/EMA pour les reponses medicales
- **Misinformation Rate sous manipulation emotionnelle (P040) : baseline 6.2% vs. combinee 37.5%** [NEW RUN-002]

### Liens avec le framework δ⁰/δ¹/δ²/δ³
Cet axe est **transversal** -- il impacte toutes les couches delta mais avec une emphase particuliere sur δ³ (validation de sortie) et δ⁰ (erosion temporelle).

### Niveau de maturite
**En cours** -- Le constat est solidement etabli (P029, JAMA) et renforce par 2026 (P035, P040). Les defenses specifiques au medical sont sous-etudiees. AEGIS a une avance significative avec ses scenarios medicaux dedies. **Le gap entre benchmark medical (P035 existant) et defense medicale (quasi-inexistante) s'elargit.**

---

## Axe 4 : Mesure formelle de la separation instruction/donnee (Sep(M))

### Constat
La metrique Sep(M) de Zverev et al. (2025) est la seule formalisation mathematique rigoureuse de la capacite d'un LLM a distinguer les instructions des donnees. Cependant, son application pratique souleve des defis : (1) la variante empirique depend de "surprise witnesses" qui peuvent ne pas generaliser, (2) le compromis separation-utilite est severe (fine-tuning augmente Sep de 37.5% a 81.8% mais effondre l'utilite de 67.8% a 19.2%), et (3) la validite statistique requiert N >= 30 par condition, rarement atteint dans les evaluations medicales. **En 2026, la metrique SAM de P041 et la metrique CHER de P035 offrent des dimensions complementaires a Sep(M).**

### Papers supportant cet axe
- **P024** (Zverev et al., ICLR 2025) : Definition formelle de Sep(M), variante empirique, compromis separation-utilite
- **P008** (Attention Tracker) : Le Focus Score comme proxy de separation basee sur l'attention
- **P012** (Steck, 2024) : La similarite cosinus peut etre rendue insignifiante par une matrice gauge -- caveat pour les mesures basees sur les embeddings
- **P013** : Intrusion d'antonymes cree des angles morts dans les mesures cosinus
- **P014** (SemScore) : Metrique basee sur sentence transformers pour la derive semantique
- **P041** (Magic-Token, 2026) : Le Safety Alignment Margin (SAM) mesure la separation entre modes comportementaux (positif/negatif/rejectif) -- **complementaire a Sep(M) qui mesure instruction/donnee** [UPDATED RUN-002]
- **P035** (MPIB, 2026) : CHER comme metrique de dommage clinique reel, complementaire a Sep(M) pour l'evaluation medicale [NEW RUN-002]
- **P057** (ASIDE, 2025) : Les auteurs originaux de Sep(M) utilisent la metrique pour valider ASIDE. Premier mecanisme architectural ameliorant Sep(M) SANS perte d'utilite. [NEW RUN-003]
- **P052** (Young/Cambridge, 2026) : La metrique I_t (Harm Information per Position) est complementaire a Sep(M) pour mesurer la profondeur de l'alignement. [NEW RUN-003]
- **P050** (JMedEthicBench, 2026) : La degradation multi-tour (MTSD) est une forme de derive mesurable par Sep(M) au fil des tours. [NEW RUN-003]

### Contradiction ou debat dans la litterature
- **P012** (Steck) questionne la fiabilite de la similarite cosinus, ce qui impacte directement la validite de Sep(M) empirique qui utilise des embeddings.
- Le compromis separation-utilite (P024) semble incontournable : les modeles les plus securises sont les moins utiles. **Cependant, P038 (InstruCoT) et P041 (Magic-Token) suggerent des voies pour resoudre partiellement ce trade-off.** [UPDATED RUN-002]
- **P057 (ASIDE) RESOUT partiellement le compromis : Sep(M) augmente sans perte d'utilite via rotation orthogonale. C'est le resultat le plus significatif pour cet axe en RUN-003.** [NEW RUN-003]
- **P015** suggere que les metriques LLM-enhanced sont plus fiables que les embeddings classiques pour capturer la semantique, mais cela introduit une dependance circulaire (LLM evaluant un LLM).

### Contribution potentielle de la these AEGIS
AEGIS est l'un des rares systemes a implementer Sep(M) en production. La these peut :
1. Valider Sep(M) sur un large benchmark medical (N >= 30)
2. Proposer une variante de Sep(M) robuste aux limitations cosinus identifiees par P012
3. Explorer le compromis separation-utilite dans le domaine medical specifiquement
4. **Integrer SAM (P041) et CHER (P035) dans un cadre metrique tridimensionnel : Sep(M) x SAM x CHER** [NEW RUN-002]

### Questions de recherche ouvertes
1. Sep(M) peut-il etre etendu pour capturer les attaques multi-tour (P010, P040) ?
2. Comment combiner Sep(M) avec CHER (P035) pour une metrique composite de risque medical ?
3. Le compromis separation-utilite est-il plus ou moins severe dans le domaine medical compare au domaine general ?
4. **SAM (P041) et Sep(M) (P024) sont-ils correles ou capturent-ils des dimensions orthogonales de la securite ?** [NEW RUN-002]

### Metriques de validation
- Sep(M) formel et empirique (P024) avec N >= 30
- AUROC des detecteurs de derive semantique
- Utilite du modele mesuree par MMLU/HellaSwag avant et apres fine-tuning
- Correlation entre Sep(M) et ASR sur le meme modele
- **SAM (P041) : marge de separation entre modes comportementaux** [NEW RUN-002]

### Liens avec le framework δ⁰/δ¹/δ²/δ³
Sep(M) est une **metrique transversale** applicable a toutes les couches : elle mesure la vulnerabilite fondamentale de δ⁰, la qualite du filtrage δ², et l'efficacite du monitoring δ³.

### Niveau de maturite
**En cours** -- La theorie est solide (ICLR 2025) mais l'application au domaine medical manque de validation empirique a grande echelle. **P035 (MPIB, 9,697 instances) fournit pour la premiere fois un benchmark avec la validite statistique requise.**

---

## Axe 5 : Evasion des gardes syntaxiques par injection de caracteres

### Constat
Les 12 categories d'injection de caracteres identifiees par Hackett et al. (P009) contournent la totalite des gardes commerciaux testes (Azure Prompt Shield, ProtectAI, Meta Prompt Guard). Cette evasion est triviale (difficulte TRIVIAL) et exploite le decalage entre le traitement textuel des gardes (pattern matching brut) et la normalisation effectuee par les tokenizers des LLM (NFKC, strip whitespace). **En 2026, le fuzzing automatise (P044) etend cette surface d'attaque aux juges eux-memes, tandis que l'empoisonnement de system prompts (P045) ajoute un vecteur persistant contournant δ².**

### Papers supportant cet axe
- **P009** (Hackett et al., 2025) : 12 categories d'injection de caracteres avec evasion complete
- **P005** : Evaluation des firewalls montrant des faiblesses structurelles
- **P023** (NDSS) : Les filtres de perplexite detectent les tokens GCG mais pas les injections de caracteres
- **P044** (AdvJudge-Zero, 2026) : Le fuzzing automatise atteint 99% de bypass des gardes par tokens de controle basse-perplexite. **Etend l'evasion syntaxique des gardes d'entree (P009) aux gardes de sortie (juges)** [UPDATED RUN-002]
- **P033** : Les juges auto-evaluateurs sont aussi vulnerables aux memes evasions
- **P045** (SPP, 2026) : Les modifications subtiles du system prompt echappent aux filtres syntaxiques car ils ciblent un canal "de confiance" [NEW RUN-002]
- **P049** (Hackett, LLMSec 2025) : Evasion a 100% des guardrails de production (Azure Prompt Shield, Meta Prompt Guard) par combinaison de 12 techniques + transfert white-box-to-black-box. Valide RagSanitizer 15 detectors. [NEW RUN-003]

### Contradiction ou debat dans la litterature
- **P044** montre que l'entrainement adversarial reduit l'ASR a quasi-zero, suggerant que les gardes peuvent etre rendus robustes. Cependant, cela necessite un processus d'entrainement adversarial continu (course aux armements).
- Les approches semantiques (δ⁰) peuvent compenser les faiblesses syntaxiques (δ²), mais P018/P019 montrent que δ⁰ est lui-meme fragile.
- **P042 (PromptArmor) obtient <1% FPR via un LLM garde-fou, contournant le probleme syntaxique par une approche semantique -- mais repose sur GPT-4o** [NEW RUN-002]

### Contribution potentielle de la these AEGIS
Le RagSanitizer d'AEGIS implemente 15 detecteurs couvrant 12/12 categories d'injection de Hackett et al. C'est l'une des rares defenses documentees avec une couverture complete de ce vecteur d'attaque.

### Questions de recherche ouvertes
1. Les techniques d'injection de caracteres evoluent-elles plus vite que les detecteurs ?
2. Comment combiner la normalisation Unicode (δ²) avec la detection par attention (P008) pour une defense robuste ?
3. Les attaques compositionnelles (injection de caracteres + multi-tour) sont-elles detectees par les defenses actuelles ?
4. **Les tokens de controle decouverts par AdvJudge-Zero (P044) sont-ils transferables entre modeles juges ?** [NEW RUN-002]
5. **Le RagSanitizer d'AEGIS detecte-t-il les tokens de controle AdvJudge-Zero ou faut-il ajouter un 16e detecteur ?** [NEW RUN-002]

### Metriques de validation
- Taux de detection par categorie d'injection (12 categories de P009)
- Taux de faux positifs de la normalisation Unicode sur du texte medical legitime
- Resistance aux attaques adaptatives (attaquant connaissant les detecteurs)
- **Taux de detection des tokens de controle AdvJudge-Zero par le RagSanitizer** [NEW RUN-002]

### Liens avec le framework δ⁰/δ¹/δ²/δ³
Cet axe concerne principalement **δ²** (filtrage syntaxique) avec des implications pour δ¹ (gardes d'entree) et δ³ (validation de sortie comme filet de securite).

### Niveau de maturite
**Mature** pour la detection des 12 categories connues. **Exploratoire** pour les attaques compositionnelles et adaptatives. **P044 montre que la surface d'attaque syntaxique s'etend aux juges, ouvrant un nouveau front.**

---

## Axe 6 : Validation formelle des sorties (δ³) comme dernier rempart

### Constat
δ³ est la couche la moins etudiee dans la litterature mais la plus critique pour la securite medicale. Lorsque δ⁰ est superficiel (P018), δ¹ est contourne (P001) et δ² est evade (P009), δ³ est le seul mecanisme restant pour empecher une reponse dangereuse d'atteindre le patient. Le domaine medical exige des contraintes specifiques (validation de dosage, verification de contre-indications, conformite FDA). **En 2026, le gap δ³ s'elargit : les papers 2026 demontrent massivement la faillite de δ⁰-δ² (P039, P044, P045) mais AUCUN ne propose une implementation concrete de δ³. C'est l'opportunite la plus forte de la these.**

### Papers supportant cet axe
- **P029** (JAMA) : 94.4% ASR prouve que δ⁰+δ¹ sont insuffisants -- δ³ est indispensable
- **P011** (PromptGuard) : Les couches 3 (validation semantique) et 4 (raffinement adaptatif) s'alignent avec δ³
- **P007** : Recommandations pour la verification formelle des sorties
- **P006** : Le `tool_invocation_guard` est une forme de δ³ pour les architectures agent
- **P035** (MPIB, 2026) : CHER montre que le dommage clinique doit etre valide au niveau de la sortie, pas de l'entree [UPDATED RUN-002]
- **P039** (GRP-Obliteration, 2026) : Si δ⁰ est effacable, δ³ est **litteralement la seule defense restante** [NEW RUN-002]
- **P044** (AdvJudge-Zero, 2026) : Les juges empiriques sont bypassables a 99%, renforçant le besoin de validation **formelle** (non-LLM) a δ³ [NEW RUN-002]
- **P037** (Survey 3D, 2026) : Le cadre de defense le plus complet existant (3 couches) ne couvre PAS δ³, confirmant le gap dans la litterature [NEW RUN-002]
- **P054+P055** (PIDP + RAGPoison, 2026/2025) : Les attaques RAG composees et persistantes necessitent une verification d'integrite des donnees au niveau δ³ [NEW RUN-003]
- **P060** (SoK, IEEE S&P 2026) : Le framework SEU confirme qu'aucun guardrail individuel ne domine => δ³ est necessaire comme filet de securite final. 0/60 papers implemente δ³. [NEW RUN-003]
- **P058** (ETH Zurich, 2025) : L'automatisation des attaques agent-level (tool use, planning) exige des gardes deterministes au niveau sortie (δ³). [NEW RUN-003]

### Contradiction ou debat dans la litterature
- Aucun paper ne conteste la necessite de δ³. Le debat porte sur l'implementation : validation par regles (deterministe) vs. validation par LLM (probabiliste, mais vulnerabilite recursive P033).
- Le cout computationnel de la validation de chaque sortie est un frein a l'adoption en production medicale ou la latence est critique.
- **P044 montre que les juges LLM sont contournables a 99%, suggerant que δ³ doit etre deterministe (regles, verification formelle) plutot que LLM-based** [NEW RUN-002]

### Contribution potentielle de la these AEGIS
AEGIS dispose de 5 techniques δ³ en production (`allowed_output_spec`, `forbidden_directive_check`, `tension_range_validation`, `tool_invocation_guard`, `response_sanitization`), ce qui le place **en avance significative sur la litterature**. La these peut :
1. Valider ces 5 techniques contre les scenarii P029
2. Proposer des techniques δ³ specifiques au medical (validation de dosage, verification de contre-indications)
3. Mesurer le gain de securite marginal de δ³ par rapport aux couches inferieures
4. **Demontrer que δ³ deterministe resiste aux attaques qui bypassent δ⁰-δ² (P039, P044)** [NEW RUN-002]
5. **Proposer des techniques δ³ integrant CHER (P035) comme critere de filtrage de sortie** [NEW RUN-002]

### Questions de recherche ouvertes
1. δ³ peut-il etre rendu deterministe (non-LLM) tout en restant efficace contre les attaques semantiques ?
2. Quel est le cout de latence acceptable pour la validation δ³ en production medicale ?
3. Comment eviter la vulnerabilite recursive (P033) dans les validateurs δ³ bases sur LLM ?
4. **δ³ deterministe (regles) peut-il atteindre les memes performances que δ³ LLM-based sans les vulnerabilites de P044 ?** [NEW RUN-002]

### Metriques de validation
- ASR residuel apres activation de δ³ (vs. δ⁰+δ¹+δ² seuls)
- Taux de faux positifs de δ³ sur des reponses medicales legitimes
- Latence ajoutee par la validation δ³
- Couverture des guidelines FDA/EMA par les regles δ³
- **ASR residuel apres δ³ quand δ⁰ est efface (scenario P039)** [NEW RUN-002]

### Liens avec le framework δ⁰/δ¹/δ²/δ³
Cet axe concerne **exclusivement δ³** en tant que couche finale de defense.

### Niveau de maturite
**Exploratoire** dans la litterature (toujours aucune implementation concrete publiee). **En cours** dans AEGIS (5 techniques en production). **L'opportunite de contribution originale est la plus forte du corpus -- renforcee en 2026 par l'elargissement du gap.**

---

## Axe 7 : Le probleme du juge recursif et la securite multi-agent

### Constat
Les architectures multi-agent et les approches "LLM-as-judge" introduisent une vulnerabilite recursive : si le modele juge partage la meme famille que le modele de base, compromettre l'un compromet l'autre. Ce probleme menace les pipelines de defense multi-agent (P002), les architectures d'auto-evaluation (OpenAI), et toute methodologie d'evaluation par LLM. **En 2026, les LRM (P036) et le fuzzing automatise (P044) amplifient ce risque a un niveau critique : 97.14% de bypass par raisonnement autonome et 99% par tokens de controle.**

### Papers supportant cet axe
- **P033** : Demonstration formelle de la vulnerabilite recursive des juges auto-evaluateurs
- **P002** : Pipeline de defense multi-agent -- efficace mais vulnerabilite si les agents sont homogenes
- **P036** (Nature Comms, 2026) : Les LRM raisonnent pour contourner les juges d'autres modeles a 97.14%
- **P044** (AdvJudge-Zero, 2026) : Fuzzing automatise atteint 99% de bypass des juges binaires. **Le papier le plus devastateur pour les architectures LLM-as-judge** [UPDATED RUN-002]
- **P042** (PromptArmor, 2026) : LLM-as-guardrail efficace (<1% FPR/FNR) mais dependant d'un modele avance
- **P045** (SPP, 2026) : L'empoisonnement du system prompt du juge neutraliserait toute l'architecture d'evaluation [NEW RUN-002]

### Contradiction ou debat dans la litterature
- **P042** montre que les LLM avances (GPT-4o) peuvent servir de gardes efficaces, contredisant partiellement P033. Mais P042 n'a pas teste le cas ou le garde et la cible sont du meme fournisseur.
- **P044** montre que l'entrainement adversarial resout le probleme pour les juges binaires, mais P036 introduit un nouveau vecteur (raisonnement autonome) non couvert par cet entrainement.
- **La combinaison P036+P044 est particulierement alarmante : les LRM raisonnent pour contourner les juges (P036) ET les juges sont fuzzes par tokens de controle (P044). Les deux vecteurs sont independants et potentiellement cumulables** [NEW RUN-002]

### Contribution potentielle de la these AEGIS
AEGIS utilise une architecture heterogene (modeles differents pour le robot medical et l'agent de securite), mitigeant partiellement P033. La these peut :
1. Quantifier le gain de securite d'une architecture heterogene vs. homogene
2. Tester la resistance aux LRM (P036) de l'agent de securite AEGIS
3. Proposer un protocole d'evaluation multi-agent resistant a la recursivite
4. **Integrer le fuzzing AdvJudge-Zero (P044) comme test de robustesse des juges AEGIS** [NEW RUN-002]

### Questions de recherche ouvertes
1. La diversite de modele est-elle suffisante ou faut-il aussi une diversite d'architecture (transformer vs. autre) ?
2. Comment evaluer un pipeline de securite multi-agent sans tomber dans la recursivite (qui evalue l'evaluateur ?) ?
3. Les LRM (P036) representent-ils un changement qualitatif dans la menace ou une simple augmentation quantitative ?
4. **Les tokens de controle AdvJudge-Zero (P044) sont-ils transferables du modele juge au modele garde dans une architecture heterogene ?** [NEW RUN-002]

### Metriques de validation
- Taux de succes d'attaque sur configuration homogene vs. heterogene
- Correlation entre famille de modele juge/base et taux de bypass
- Resistance aux attaques autonomes par LRM (P036)
- **Taux de bypass des juges AEGIS par AdvJudge-Zero (P044)** [NEW RUN-002]

### Liens avec le framework δ⁰/δ¹/δ²/δ³
Cet axe est **transversal** mais concerne principalement la classe DETECT (detection) et δ³ (validation de sortie par juge LLM).

### Niveau de maturite
**En cours** -- Le probleme est identifie (P033) et aggrave par 2026 (P036, P044). Les solutions (heterogeneite de modele, entrainement adversarial P044) sont a un stade precoce. **Les LRM (P036) + fuzzing (P044) en 2026 rendent ce probleme critique.**

---

## Axe 8 : Course aux armements attaque/defense et evolution temporelle

### Constat
Le domaine de la securite des LLM suit une dynamique de course aux armements rapide. Les attaques evoluent de simples injections directes (2023) vers des attaques multi-strategies (2024), puis vers des empoisonnements de chaine d'approvisionnement (2025) et des agents de raisonnement autonomes (2026). Les defenses suivent avec un retard systematique. Cette acceleration suggere que les solutions statiques seront toujours depassees et que des approches adaptatives sont necessaires. **En 2026, les attaques atteignent des seuils qualitativement nouveaux (97-99% ASR automatise), tandis que les defenses progressent aussi (InstruCoT >90%, PromptArmor <1% FPR, Magic-Token). La question centrale est : qui progresse plus vite ?**

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
- **P038** (InstruCoT, 2026) : >90% de defense -- rattrapage cote defense [NEW RUN-002]
- **P041** (Magic-Token, 2026) : 8B surpasse 671B en securite -- innovation de defense [NEW RUN-002]
- **P042** (PromptArmor, 2026) : <1% FPR/FNR -- defense la plus efficace documentee [NEW RUN-002]
- **P043** (JBDistill, 2025) : Benchmarks renouvelables pour suivre la course aux armements [NEW RUN-002]

### Contradiction ou debat dans la litterature
- Les defenses progressent aussi : **P038** (InstruCoT) atteint >90%, **P042** (PromptArmor) atteint <1% FPR, **P041** (Magic-Token) surpasse des modeles 84x plus grands. La question est : qui progresse plus vite ?
- **P043** (JBDistill) propose des benchmarks renouvelables, suggerant que la communaute est consciente de la peremption rapide des evaluations.
- **En 2026, les attaques les plus fortes (P036: 97%, P039: ~100%, P044: 99%) surpassent les defenses les plus fortes (P042: <1% FPR MAIS sur benchmark specifique, non teste contre P036/P039/P044)** [NEW RUN-002]

### Contribution potentielle de la these AEGIS
AEGIS peut documenter cette course aux armements avec des donnees longitudinales sur les 34 chaines d'attaque et les 66 techniques de defense, offrant un snapshot quantitatif a un moment precis (2026).

### Questions de recherche ouvertes
1. L'ecart attaque/defense se creuse-t-il ou se reduit-il au fil du temps ?
2. Les defenses adaptatives (InstruCoT P038, entrainement adversarial P044) peuvent-elles briser le cycle de course aux armements ?
3. Quelle est la demi-vie d'une defense donnee avant qu'une attaque ne la contourne ?
4. **PromptArmor (P042) resiste-t-il aux attaques 2026 (P036 LRM, P039 GRP-Oblit, P044 fuzzing) ?** [NEW RUN-002]

### Metriques de validation
- ASR moyen par annee (2023, 2024, 2025, 2026)
- Delai moyen entre publication d'une attaque et publication de la defense correspondante
- Couverture des nouvelles attaques 2026 par les defenses existantes
- **Demi-vie estimee des defenses 2026 (P038, P042)** [NEW RUN-002]

### Liens avec le framework δ⁰/δ¹/δ²/δ³
Cet axe est **transversal** -- il affecte toutes les couches delta et necessite un mecanisme de mise a jour continue.

### Niveau de maturite
**Exploratoire** -- Les donnees longitudinales manquent. Les surveys existants (P003, P037) documentent l'etat a un instant t mais pas l'evolution dynamique. **Les 12 papers 2026 fournissent un deuxieme point de donnee permettant de tracer une tendance.**

---

## Axe 9 (NOUVEAU) : LRM comme agents d'attaque autonomes et paradoxe raisonnement/securite

### Constat
Les grands modeles de raisonnement (LRM : DeepSeek-R1, Gemini 2.5 Flash, Grok 3, Qwen3) introduisent un changement qualitatif dans le paysage des menaces. Leur capacite de raisonnement avancee (chain-of-thought, planification multi-etapes) peut etre retournee pour concevoir et executer des attaques de jailbreak de maniere totalement autonome, sans expertise humaine en securite offensive. Ce phenomene cree un **paradoxe fondamental** : ameliorer la capacite de raisonnement d'un modele augmente simultanement son potentiel offensif.

### Papers supportant cet axe
- **P036** (Nature Comms, 2026) : 4 LRM atteignent 97.14% de jailbreak autonome sur 9 modeles cibles. DeepSeek-R1 atteint 90% de score de nocivite maximale. Le protocole est remarquablement simple : un prompt systeme suffit pour que le LRM planifie et execute l'attaque.
- **P039** (Microsoft, 2026) : GRP-Obliteration montre que le mecanisme de raisonnement (GRPO) peut etre retourne pour desaligner un modele via son propre objectif d'entrainement.
- **P044** (Unit 42, 2026) : Le fuzzing automatise utilise la distribution de tokens du modele pour decouvrir des vulnerabilites -- une forme de "raisonnement" sur le modele cible.
- **P037** (Survey 3D, 2026) : Documente les attaques par apprentissage par renforcement/adversarial comme categorie emergente.
- **P058** (ETH Zurich, 2025) : Framework automatise d'attaque agent-level exploitant tool use et planning. Les agents LLM sont la nouvelle surface d'attaque. [NEW RUN-003]
- **P052** (Young/Cambridge, 2026) : L'analyse de gradient (I_t) requiert la capacite de raisonnement pour concevoir des attaques ciblant les positions a faible I_t. [NEW RUN-003]
- **P059** (Zhou et al., 2025) : Les revieweurs IA raisonnent sur du contenu empoisonne, amplifiant l'impact des injections cachees. [NEW RUN-003]
- **P087** (H-CoT, Kuo et al. 2025) : Mocked execution traces court-circuitent la justification de securite CoT. ASR 94.6% o1, 97.6% o1-pro, 98% o3-mini (Table 1, p. 14). [NEW RUN-005]
- **P089** (SEAL, Nguyen et al. 2025) : Stacked ciphers + bandit adaptatif. Le mode raisonnement augmente la capacite de dechiffrement ET la vulnerabilite (Figure 1, Section 3.2). ASR 80.8-100%. [NEW RUN-005]
- **P090** (Zhou et al. 2025) : Safety assessment de R1 : "The stronger the reasoning, the greater the harm" (Finding 2). Le contenu <think> est souvent plus nocif que la reponse finale. [NEW RUN-005]
- **P092** (Yong & Bach 2025) : Self-jailbreaking SANS adversaire. Le reasoning training degrade directement l'alignement : ASR 25% -> 65% (Figure 2, p. 4). Forme la plus extreme du paradoxe. [NEW RUN-005]
- **P093** (Sabbaghi et al. 2025) : Test-time compute scaling offensif. 64% ASR (3x PAIR/TAP-T), transfert 56% sur o1-preview. Le compute offensif bat le defensif. [NEW RUN-005]
- **P094** (Zhao et al. 2026) : PREUVE MECANISTIQUE : le signal de securite est basse dimension et se dilue monotoniquement avec la longueur du CoT. Activation probing causal. ASR 99% Gemini 2.5 Pro, 94% Claude 4 Sonnet, 100% Grok 3 Mini (Table 1, p. 3). Co-auteur Anthropic. [NEW RUN-005]
- **P102** (Huang et al. 2025) : La securite est concentree dans ~50-100 tetes d'attention. AHD (Attention Head Dropout) propose comme defense. Explication structurelle du paradoxe. [NEW RUN-005]

### Contradiction ou debat dans la litterature
- **P041** (Magic-Token) montre qu'un modele 8B peut surpasser un 671B en securite, suggerant que le raisonnement avance n'est pas toujours un avantage offensif. **Qwen3 235B (P036) est moins efficace que des modeles plus petits en jailbreak autonome.**
- **P038** (InstruCoT) utilise le raisonnement (instruction-level CoT) defensivement, montrant que le meme mecanisme peut servir la defense.
- Le paradoxe raisonnement/securite n'est pas absolu : il depend de la methode d'entrainement, pas uniquement de la capacite de raisonnement.
- **P047** (ACL 2025) montre la dualite attaque-defense : les techniques de raisonnement offensives peuvent etre inversees defensivement. [NEW RUN-003]
- **P091** (Krishna et al. 2025) : NUANCE CRITIQUE — C7 est conditionnel au type d'attaque. Tree-of-attacks +32pp pire contre LRM, MAIS XSS -29.8pp meilleur. Le paradoxe s'applique aux attaques semantiques/logiques, PAS aux syntactiques/techniques. [NEW RUN-005]

### Contribution potentielle de la these AEGIS
AEGIS est le premier framework a utiliser des LLM comme agents d'attaque automatises dans le cadre d'une these doctorale. Le Red Team Lab implemente exactement le paradigme formalise par P036. La these peut :
1. Valider les resultats de P036 sur les modeles medicaux (non testes dans l'article)
2. Mesurer si les defenses δ¹-δ³ resistent aux attaques LRM autonomes
3. Quantifier le paradoxe raisonnement/securite dans le domaine medical
4. **Tester si AHD (P102) distribue suffisamment la securite pour resister aux attaques exploitant le raisonnement** [NEW RUN-005]
5. **Tester le self-jailbreaking (P092) sur LLaMA 3.2 medical fine-tune** [NEW RUN-005]
6. **Formaliser le paradoxe comme propriete structurelle (P094 mecanistique + P102 architecturale) dans le manuscrit Chapitre 4** [NEW RUN-005]

### Questions de recherche ouvertes
1. La regression d'alignement des LRM (P036) est-elle un phenomene continu ou existe-t-il un seuil de capacite de raisonnement ?
2. Les defenses basees sur le raisonnement (P038 InstruCoT) peuvent-elles contrer les attaques basees sur le raisonnement (P036 LRM) ?
3. Le protocole simple de P036 (prompt systeme + autonomie) peut-il etre durci par δ¹ (instructions adversariales dans le prompt systeme) ?
4. Les modeles medicaux fine-tunes sont-ils plus ou moins vulnerables aux LRM que les modeles generiques ?
5. **Le signal de securite basse dimension (P094) peut-il etre renforce (par ex. AHD P102) sans perte d'utilite ?** [NEW RUN-005]
6. **Le self-jailbreaking (P092) est-il amplifie par le fine-tuning medical (combinaison C6 x C7) ?** [NEW RUN-005]
7. **La nuance P091 (C7 conditionnel au type d'attaque) modifie-t-elle la formulation de la conjecture ?** [NEW RUN-005]

### Metriques de validation
- ASR des LRM contre les modeles proteges par AEGIS (δ⁰ a δ³)
- Score de nocivite maximale (P036) sur les reponses medicales
- Cout de l'attaque LRM (latence, nombre de tours) vs. attaque humaine
- Correlation entre capacite de raisonnement et efficacite offensive
- **RER (Reasoning Exploitation Ratio) par type d'attaque : semantique vs syntactique (P091)** [NEW RUN-005]

### Liens avec le framework δ⁰/δ¹/δ²/δ³
Cet axe est **transversal** mais concerne principalement δ⁰ (l'alignement est le premier a echouer face aux LRM) et δ³ (seule couche potentiellement resiliente).

### Niveau de maturite
**QUASI-SATURE (9.5/10)** -- 15 papiers (P036, P039, P044, P058, P059, P087-P094, P102) avec resultats convergents. P094 fournit la preuve mecanistique par activation probing. P102 fournit l'explication architecturale. Le paradoxe est desormais STRUCTURAL et non plus un artefact. La formulation nuancee (conditionnel au type d'attaque, P091) est integree. **Le passage de "conjecture" a "fait etabli" est justifie dans le manuscrit de these.**

---

---

## Axe 10 (NOUVEAU RUN-005) : Multi-Step Boundary Erosion (MSBE) et attaques multi-tour

### Constat
Les attaques multi-tour ont atteint une maturite operationnelle en 2025-2026. Contrairement aux attaques single-turn qui cherchent a contourner l'alignement en une requete, les attaques MSBE exploitent l'accumulation de compliances partielles sur plusieurs tours pour eroder progressivement la direction de refus du modele. Le processus est deterministe et monotone : chaque tour benin deplace le modele dans l'espace latent, et le drift ne se corrige pas spontanement. Ce phenomene est distinct de l'axe 9 (paradoxe raisonnement) mais le chevauche partiellement via P094 (CoT Hijacking combine raisonnement et contexte).

### Papers supportant cet axe
- **P097** (STAR, Li et al. 2026) : Formalise le MSBE comme processus d'evolution d'etat deterministe. Drift monotone de la direction de refus au fil des tours. SFR 89-94% sur LLaMA-3-8B-IT (Figure 4, p. 7). [NEW RUN-005]
- **P095** (Tempest, 2025) : Tree search multi-tour. Explore l'espace des conversations pour trouver des chemins optimaux vers le contournement. [NEW RUN-005]
- **P096** (Mastermind, Ren et al. 2026) : Systeme multi-agent auto-ameliorant. 60% ASR sur GPT-5, 89% sur DeepSeek-R1. Knowledge repository persistant. [NEW RUN-005]
- **P098** (Hadeliya et al. 2025) : Degradation PASSIVE sous contexte long (80% -> 10% refusal a 200K tokens). L'alignement s'erode SANS attaque. (Figure 2, p. 3) [NEW RUN-005]
- **P099** (Crescendo, Russinovich et al. 2024, Microsoft) : Escalade progressive avec prompts entierement benins. 56-83% ASR. Les filtres content-based sont inutiles. [NEW RUN-005]
- **P100** (ActorBreaker, Ren et al. 2025) : Distribution shifts naturelles via reseau semantique acteur. 60-81% ASR. Prompts classifies safe par Llama-Guard 2 (Figure 5, p. 7). Defense Circuit Breaker proposee. [NEW RUN-005]
- **P101** (SafeDialBench, Cao et al. 2026) : Benchmark multi-tour avec 3 capabilities (refusal, tolerance, compliance). Degradation apres tour 4. o3-mini vulnerable. [NEW RUN-005]
- **P050** (JMedEthicBench, 2026) : Degradation multi-tour 9.5 -> 5.5 (p<0.001) en contexte medical. [RUN-003]

### Contradiction ou debat dans la litterature
- **P100** (ActorBreaker) propose Circuit Breaker + multi-turn safety training comme defense. Efficacite partielle mais pas evaluee contre les attaques les plus sophistiquees (STAR, Mastermind).
- **P101** (SafeDialBench) montre que la degradation n'est pas uniforme : certains modeles (Claude 3 Opus) maintiennent leur securite au-dela de 4 tours tandis que d'autres (o3-mini) s'effondrent. La robustesse multi-tour est modele-dependante.
- L'interaction entre contexte long (P098) et multi-tour (P097) est une intersection non exploree (G-036).
- **P091** (Krishna et al. 2025) montre que les LRM ne sont PAS significativement plus resistants en multi-tour (R1 89%, o3 90%), contrairement a l'intuition que le raisonnement ameliore la robustesse.

### Contribution potentielle de la these AEGIS
AEGIS est positionne pour une contribution unique sur le MSBE medical :
1. Implementer Crescendo (T40) et STAR (T38) comme nouvelles chaines d'attaque dans les 36 existantes
2. Tester la degradation multi-tour sur les modeles medicaux AEGIS (reproduire P050 avec δ¹-δ³ actifs)
3. Creer l'attaque composee T39+T40 (contexte long + Crescendo) — G-036
4. Implementer la behavioral detection (trajectoire de compliance croissante) comme defense δ² — G-037
5. Tester AHD (P102) contre MSBE — question ouverte critique (G-034)

### Questions de recherche ouvertes
1. Le drift monotone (P097 STAR) est-il modelisable comme processus de Markov avec transition de phase ? (G-MATH-004)
2. AHD (P102) empeche-t-il l'erosion progressive si la securite est distribuee sur toutes les tetes ?
3. Existe-t-il un nombre critique de tours au-dela duquel TOUT modele cede (seuil universel) ?
4. La detection comportementale (trajectoire de compliance) peut-elle remplacer la detection content-based contre les prompts benins (P099, P100) ?
5. L'interaction contexte long x multi-tour (G-036) est-elle super-additive ou additive ?

### Metriques de validation
- SFR (Safety Failure Rate) par nombre de tours (P097)
- ASR par strategie multi-tour (Crescendo, STAR, Mastermind, ActorBreaker)
- Degradation de securite en fonction de la longueur de contexte (P098)
- Tri-capability score SafeDialBench (refusal, tolerance, compliance) (P101)
- MTSD (Multi-Turn Safety Degradation) de P050

### Liens avec le framework δ⁰/δ¹/δ²/δ³
Cet axe concerne principalement **δ¹** (le system prompt est erode par accumulation contextuelle) et **δ²** (les filtres content-based echouent contre les prompts benins). δ⁰ est attaque par la degradation passive (P098). δ³ n'est pas adresse par les papiers multi-tour.

### Niveau de maturite
**En cours (forte dynamique)** -- 7 papiers convergents (P095-P101) avec resultats reproductibles. P097 (STAR) fournit la formalisation. P099 (Crescendo) vient de Microsoft Research. Le MSBE est un axe en pleine expansion avec des implications directes pour les systemes medicaux (P050 montre la degradation p<0.001). **Opportunite forte pour une contribution originale sur MSBE medical avec defenses δ³.**

---

## Resume des 10 Axes

| # | Axe | Couche(s) delta | Maturite | Papers cles |
|---|-----|----------------|----------|-------------|
| 1 | Fragilite structurelle de δ⁰ | δ⁰ | **Sature** | P018, P019, P030, P036, P039, P044, P050, P052, P053, **P092, P094, P098, P102** |
| 2 | Defense en profondeur multi-couches | Toutes | En cours | P029, P001, P009, P011, P033, P039, P044, P045, P047, P049, P054-P057, P060 |
| 3 | Specificite du domaine medical | Transversal | En cours | P029, P028, P030, P035, P040, P050, P051 |
| 4 | Mesure formelle Sep(M) | Transversal | En cours | P024, P008, P012, P041, P035, P050, P052, P057, **P097** |
| 5 | Evasion des gardes syntaxiques | δ² | Mature/Exploratoire | P009, P044, P005, P045, P049, **P089** |
| 6 | Validation formelle (δ³) | δ³ | Exploratoire | P029, P011, P035, P039, P044, P037, P054, P055, P058, P060 |
| 7 | Juge recursif et multi-agent | DETECT, δ³ | En cours | P033, P036, P044, P042, P045 |
| 8 | Course aux armements temporelle | Toutes | Exploratoire | P001, P036, P039, P044, P045, P038, P042, P049, P054, P059 |
| 9 | LRM autonomes et paradoxe raisonnement | Transversal (δ⁰, δ³) | **Quasi-sature (9.5/10)** | P036, P039, P044, P037, P052, P058, P059, **P087, P089, P090, P091, P092, P093, P094, P102** |
| 10 | **Multi-Step Boundary Erosion (MSBE)** | δ¹, δ² (principalement) | **En cours (forte dynamique)** | **P095, P096, P097, P098, P099, P100, P101**, P050 |

---

*Agent Scientist -- AXES_DE_RECHERCHE.md*
*10 axes identifies, 102 papers mobilises*
*Version: v4.0 (RUN-005)*
*Derniere mise a jour: 2026-04-07*
