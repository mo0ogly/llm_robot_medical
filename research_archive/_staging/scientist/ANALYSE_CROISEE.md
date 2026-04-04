# ANALYSE CROISEE -- Synthese Inter-Agents
## These doctorale AEGIS -- ENS 2026
## Securite des LLM medicaux contre l'injection de prompt

**Date**: 2026-04-04
**Agent**: Scientist (Opus 4.6)
**Corpus**: 46 articles (P001--P046), analyses croisees de 4 agents specialises
**Version**: v2.0 (RUN-002 -- mise a jour incrementale avec P035-P046)

---

## 1. Tendances temporelles (2023 --> 2026)

### 1.1 Distribution du corpus

| Annee | Articles | Pourcentage | Tendance dominante |
|-------|----------|-------------|-------------------|
| 2023 | 1 | 2.2% | Fondation (HouYi, Liu et al.) |
| 2024 | 7 | 15.2% | Diversification des attaques et premieres defenses formalisees |
| 2025 | 26 | 56.5% | Explosion -- attaques sophistiquees + defenses multi-couches |
| 2026 | 12 | 26.1% | Escalade -- LRM autonomes, desalignement a un prompt, benchmarks medicaux |

### 1.2 Evolution des attaques

**2023 -- Phase fondatrice** : L'injection de prompt est documentee comme un probleme systematique. P001 (HouYi) etablit le cadre de reference avec 86.1% d'applications vulnerables, mais les attaques restent relativement simples (partition de contexte).

**2024 -- Diversification** : Les attaques ciblent de nouvelles surfaces : embeddings (P012, P013), mecanismes d'attention (P008), et comportement des modeles (P018). Le domaine medical emerge comme cible specifique (P027-P029).

**2025 -- Sophistication** : Les attaques deviennent multi-strategies (P023, NDSS -- 4 strategies d'escalade), ciblent la chaine d'approvisionnement (P022 -- empoisonnement RLHF), et exploitent les architectures agent (P006, P010). Le taux d'ASR le plus eleve est documente dans le domaine medical : 94.4% (P029, JAMA).

**2026 -- Escalade qualitative** : Quatre ruptures majeures :
1. **Agents autonomes** : Les LRM raisonnent pour contourner les gardes a 97.14% (P036, Nature Comms)
2. **Desalignement minimal** : Un seul prompt suffit a desaligner 15 LLMs (P039, Microsoft)
3. **Fuzzing automatise** : AdvJudge-Zero atteint 99% de bypass des juges (P044, Unit 42)
4. **Empoisonnement persistant** : SPP (P045) montre que le system prompt, suppose de confiance, est un vecteur d'attaque persistant [NEW RUN-002]

### 1.3 Evolution des defenses

**2023-2024** : Defenses ad hoc -- system prompts, preambles de securite, separateurs. Efficacite limitee et non mesuree formellement.

**2025** : Formalisation -- Sep(M) fournit la premiere metrique rigoureuse (P024, ICLR). PromptGuard propose un framework 4 couches (P011). Attention Tracker offre une detection sans entrainement (P008). Mais les gardes commerciaux restent vulnerables a l'injection de caracteres (P009).

**2026** : Amelioration significative des defenses :
- InstruCoT : >90% de defense sur 7 methodes d'attaque (P038)
- PromptArmor : <1% FPR/FNR avec GPT-4o comme garde (P042)
- Magic-Token : Modele 8B surpasse DeepSeek-R1 671B en securite (P041)
- ADPO : DPO adversarial pour les VLMs (P046)
- Mais : l'entrainement adversarial (P044) est la seule approche demontree contre le fuzzing automatise
- **JBDistill (P043) propose des benchmarks renouvelables, reconnaissant la peremption rapide des evaluations** [NEW RUN-002]

### 1.4 Verdict temporel
Les attaques progressent plus vite que les defenses en 2023-2025. En 2026, les defenses commencent a rattraper mais le front avance (LRM, desalignement a un prompt, SPP). La dynamique globale reste en faveur des attaquants, surtout dans le domaine medical ou les defenses specifiques sont quasi-inexistantes. **L'asymetrie s'accentue en 2026 : les attaques les plus fortes (97-99% ASR) n'ont pas ete testees contre les defenses les plus fortes (PromptArmor), laissant l'issue indeterminee.**

---

## 2. Convergences -- Sur quoi la communaute s'accorde

### 2.1 L'alignement RLHF est insuffisant seul
**Consensus fort** (27/34 papers Phase 1 supportent C1, soit 79.4%). **Renforce par Phase 2 : P036 (97.14%), P039 (effacement par 1 prompt), P044 (supervision compromise).**

Les 4 agents convergent :
- **Analyst** : 79.4% des papers supportent C1 (insuffisance δ¹/δ⁰). **C1 passe a 10/10 de confiance** [UPDATED RUN-002]
- **Matheux** : Preuve formelle via gradient nul au-dela de l'horizon de nocivite (P019, formule 4.5). **+13 formules dont GRPO (P039)** [UPDATED RUN-002]
- **Cybersec** : δ⁰ note "NECESSARY BUT CRITICALLY INSUFFICIENT" avec 18/34 papers le confirmant. **+4 classes de menaces critiques** [UPDATED RUN-002]
- **Whitehacker** : 13/18 techniques (72%) contournent δ⁰. **Etendu a 30 techniques, dont T19-T30** [UPDATED RUN-002]

### 2.2 Le domaine medical est le plus vulnerable
**Consensus unanime** parmi tous les agents.
- ASR le plus eleve du corpus : 94.4% (P029, JAMA)
- Erosion passive documentee sur 3 ans (P030)
- Amplification par hierarchie culturelle (P028)
- Nouveaux benchmarks dedies en 2026 (P035-MPIB, P040)
- **P035 fournit le premier benchmark statistiquement robuste (9,697 instances, N >= 30)** [NEW RUN-002]
- **P040 quantifie l'amplification emotionnelle : 6x (6.2% -> 37.5%)** [NEW RUN-002]

### 2.3 La defense en profondeur est necessaire
**Consensus fort** (22/34 papers supportent C2, soit 64.7%). **Renforce massivement par 2026.**
- PromptGuard valide l'approche 4 couches (P011)
- Les tests whitehacker montrent que chaque couche individuelle est contournable
- La combinaison reduit l'ASR meme si elle ne l'elimine pas (33% residuel par P033)
- **La convergence P039+P044+P045 demontre que δ⁰, δ¹ et les juges sont tous bypassables individuellement. C2 passe a 9/10** [NEW RUN-002]

### 2.4 Sep(M) est la metrique de reference pour la separation
**Consensus emergent** -- Sep(M) est cite par 5 papers directement et ses concepts sous-jacents par 12+ papers. C'est la seule metrique formellement definie pour quantifier la separation instruction/donnee. **SAM (P041) offre une dimension complementaire** [NEW RUN-002]

### 2.5 δ³ est le gap le plus critique de la litterature [NEW RUN-002]
**Consensus emergent** -- Les 4 agents convergent sur le fait que δ³ est la couche la moins etudiee et la plus necessaire. Les papers 2026 renforcent massivement cet argument :
- **Analyst** : Aucun paper 2026 ne propose une implementation δ³
- **Cybersec** : δ³ confirme comme "sole surviving defense in worst-case scenarios"
- **Whitehacker** : 70% de bypass partiel sur δ³, mais c'est la couche la plus resiliente
- **Matheux** : Aucune formule de validation δ³ dans la litterature (gap formel)

---

## 3. Divergences -- Sur quoi la communaute se contredit

### 3.1 Un LLM avance peut-il etre un garde suffisant ?
- **Pour** : P042 (PromptArmor) montre que GPT-4o comme garde atteint <1% FPR/FNR sur AgentDojo
- **Contre** : P033 montre la vulnerabilite recursive des juges partageant la meme famille ; P044 montre 99% de bypass par fuzzing des juges ; P036 montre que les LRM contournent les juges par raisonnement autonome
- **Resolution possible** : Heterogeneite de modele (AEGIS) + entrainement adversarial (P044)
- **Evolution RUN-002** : Le debat s'intensifie. P042 n'a pas ete teste contre P036/P044, laissant la question ouverte. **La these AEGIS peut trancher en testant P042 contre les attaques 2026** [NEW RUN-002]

### 3.2 Le fine-tuning est-il une solution ou un risque ?
- **Pour** : P024 montre que le fine-tuning augmente Sep de 37.5% a 81.8% ; P034 montre l'efficacite du CFT medical ; P038 (InstruCoT) atteint >90%
- **Contre** : P024 montre aussi que l'utilite chute de 67.8% a 19.2% ; P034 documente des regressions ; P039 montre qu'un seul prompt peut defaire le fine-tuning de securite
- **Resolution possible** : Fine-tuning avec contraintes (formule 4.4, P018) + monitoring Sep(M) continu
- **Evolution RUN-002** : P041 (Magic-Token) resout partiellement le trade-off separation/utilite via co-entrainement, et P038 preserve l'utilite. **La solution semble etre le fine-tuning CIBLE (pas generique)** [NEW RUN-002]

### 3.3 La taille du modele determine-t-elle la securite ?
- **Pour** : Les modeles plus grands (GPT-4o, Claude 3.5) montrent generalement une meilleure resistance (P040, P042)
- **Contre** : P034 montre l'independance par rapport a l'echelle ; P041 montre qu'un modele 8B surpasse un 671B en securite via co-entrainement ; P036 montre que la capacite de raisonnement (modeles plus grands) AMPLIFIE la menace
- **Resolution** : La securite depend de la methode d'entrainement, pas de la taille. Les modeles plus grands sont a la fois meilleurs defenseurs ET meilleurs attaquants.
- **Evolution RUN-002** : P036 ajoute un paradoxe : Qwen3 235B est MOINS efficace en jailbreak que des modeles plus petits (DeepSeek-R1). **La relation taille/securite est non-monotone et depend du type de tache (offensive vs. defensive)** [NEW RUN-002]

### 3.4 L'ASR est-il une metrique suffisante ?
- **Pour** : L'ASR est universellement utilise et permet les comparaisons (P001, P029, P036)
- **Contre** : P035 (MPIB) montre que ASR et dommage clinique (CHER) divergent -- un ASR eleve ne signifie pas necessairement un dommage clinique eleve, et inversement
- **Resolution possible** : Metriques composites (AEGIS SVC, MPIB CHER) combinant ASR + severite + contexte clinique
- **Evolution RUN-002** : P035 fournit les donnees quantitatives de la divergence. **AEGIS devrait systematiquement reporter ASR + CHER + SVC en parallele** [NEW RUN-002]

### 3.5 Les defenses statiques sont-elles viables ? [NEW RUN-002]
- **Pour** : P042 (PromptArmor) atteint <1% FPR sans entrainement specialise (juste du prompting)
- **Contre** : P043 (JBDistill) reconnaît la peremption des benchmarks ; P030 documente l'erosion sur 3 ans ; P036/P039/P044/P045 introduisent des vecteurs nouveaux non couverts par les defenses existantes
- **Resolution possible** : Defenses adaptatives avec renouvellement continu (JBDistill pour les benchmarks, entrainement adversarial P044 pour les gardes)

---

## 4. Angles morts -- Sujets sous-etudies

### 4.1 Attaques multi-modales en contexte medical
**Aucun paper** dans le corpus n'etudie les injections via des images medicales (radiographies, IRM) contenant des instructions textuelles cachees. Seul P046 (ADPO) aborde la securite des VLMs mais dans un contexte general. Les systemes de diagnostic par image + LLM sont un vecteur d'attaque non explore. **P037 (survey) mentionne les VLMs mais sans evaluation medicale** [UPDATED RUN-002]

### 4.2 Interactions entre couches delta
**Aucun paper** n'etudie comment les couches δ⁰ a δ³ interagissent lorsqu'elles sont empilees. L'agent Analyst note ce gap. Questions non resolues : δ² peut-il degrader l'utilite au point de rendre δ⁰ inefficace ? δ³ peut-il compenser totalement une δ⁰ defaillante ? **P039 ouvre un scenario experimental concret : δ⁰ efface, que font δ¹-δ³ ?** [UPDATED RUN-002]

### 4.3 Defenses specifiques au medical
Sur 46 papers, seuls 2 proposent des defenses medicales specifiques (P034-CFT, P035-MPIB benchmark). **P040 identifie la manipulation emotionnelle comme vecteur specifique mais ne propose aucune defense.** Les 8 autres defenses sont generiques et testees sur des taches non-medicales. L'adaptation des defenses au vocabulaire, aux protocoles et aux contraintes reglementaires medicales est un champ quasiment vierge. [UPDATED RUN-002]

### 4.4 Validation statistique rigoureuse en medical
L'agent Matheux note que Sep(M) requiert N >= 30 par condition. P029 utilise N=5 pour les modeles phares. **P035 (MPIB, 9,697 instances) est le premier a atteindre N >= 30 en contexte medical.** Cependant, aucune defense n'a ete evaluee sur MPIB avec cette rigueur statistique. [UPDATED RUN-002]

### 4.5 Defenses structurelles (non-LLM)
Les techniques `prompt_sandboxing`, `data_marking`, `typoglycemia_detection`, `script_mixing_detection`, `fragmented_instruction_detection` et `base64_heuristic` de la taxonomie AEGIS n'ont 0 ou 1 reference(s) dans la litterature. Ces defenses structurelles deterministes sont sous-etudiees par rapport aux approches ML. **P044 montre que les approches ML (juges LLM) sont bypassables a 99%, renforçant l'interet des defenses deterministes** [NEW RUN-002]

### 4.6 Cout computationnel des defenses
Aucun paper ne fournit de comparaison systematique du cout (latence, memoire, cout API) des differentes approches de defense. En milieu medical ou la latence impacte les soins, c'est un angle mort important. **P042 (PromptArmor) necessite un second LLM (GPT-4o), doublant au minimum le cout d'inference** [UPDATED RUN-002]

### 4.7 Integrite du system prompt [NEW RUN-002]
P045 (SPP) revele que le system prompt, suppose de confiance, est un vecteur d'attaque persistant. **Aucune defense publiee** ne propose de verification d'integrite du system prompt (hash, signature, attestation). C'est un angle mort critique pour les deploiements multi-utilisateurs (hopitaux, telesante).

### 4.8 Detection de la manipulation emotionnelle [NEW RUN-002]
P040 quantifie l'amplification emotionnelle (6x) mais **aucune defense specifique** n'est proposee. La detection automatique des leviers emotionnels (urgence, empathie, peur, autorite) dans les requetes medicales est un champ vierge. L'agent Cybersec identifie `emotional_sentiment_guard` comme gap critique dans la taxonomie AEGIS.

---

## 5. Escalade attaque/defense -- Evolution de la course aux armements

### 5.1 Matrice d'escalade

| Generation | Attaque representative | ASR | Defense correspondante | Delai defense |
|------------|----------------------|-----|----------------------|---------------|
| Gen 1 (2023) | Partition de contexte (P001) | 86% | System prompts, preambles | Immediat mais insuffisant |
| Gen 2 (2024) | Injection multi-tour (P028) | ~80% | Attention Tracker (P008) | ~6 mois |
| Gen 3 (2025) | Injection de caracteres (P009) | 100% | RagSanitizer 12/12 (AEGIS) | ~3 mois |
| Gen 3.5 (2025) | Empoisonnement RLHF (P022) | N/A | COBRA consensus (P020) | Concurrent |
| Gen 4 (2026) | LRM autonomes (P036) | 97% | PromptArmor (P042) <1% FPR | Concurrent |
| Gen 4.5 (2026) | Desalignement a 1 prompt (P039) | ~100% | Magic-Token (P041) | Concurrent |
| Gen 5 (2026) | Fuzzing automatise (P044) | 99% | Entrainement adversarial (P044) | Meme paper |
| **Gen 5.5 (2026)** | **Empoisonnement system prompt (P045)** | **Persistant** | **Aucune defense publiee** | **Non couvert** |

### 5.2 Observations
1. Le delai entre attaque et defense se reduit (6 mois en 2024, concurrent en 2026), suggerant une maturation du domaine
2. Les attaques de generation 4+ necessitent des capacites de raisonnement avancees (LRM) -- la barre d'entree pour les attaquants monte
3. Les defenses les plus efficaces en 2026 sont celles qui utilisent les memes capacites que les attaques (LLM-as-guard, entrainement adversarial)
4. **Point critique** : les defenses de chaque generation ne protegent pas contre la generation suivante. Seule l'empilement de couches (defense en profondeur) offre une resilience durable.
5. **Gen 5.5 (P045) est la premiere generation sans defense publiee correspondante -- un gap ouvert** [NEW RUN-002]

---

## 6. Specificite medicale -- En quoi le domaine medical est different

### 6.1 Facteurs amplificateurs

| Facteur | Evidence | Impact sur la securite |
|---------|---------|----------------------|
| Consequences mortelles | P029 (91.7% ASR sur drogues categorie X) | Toute injection reussie peut entrainer un dommage patient |
| Hierarchie culturelle | P028 (usurpation d'autorite medicale) | Les LLM medicaux sont plus susceptibles aux instructions "d'autorite" |
| Erosion passive | P030 (26.3% --> 0.97% disclaimers en 3 ans) | La securite se degrade sans attaque active |
| Donnees sensibles | P010 (protocoles comme vecteurs) | Les donnees cliniques contiennent des instructions latentes |
| Manipulation emotionnelle | P040 (6.2% --> 37.5% desinformation avec emotion) | L'affect du patient/clinicien est exploitable (**facteur 6x**) |
| Divergence ASR/dommage | P035 (CHER vs ASR) | Les metriques generiques ne capturent pas le risque medical |
| **Deploiement multi-utilisateurs** | **P045 (SPP persistant)** | **Un prompt empoisonne affecte TOUS les patients** [NEW RUN-002] |

### 6.2 Defenses medicales existantes

| Defense | Source | Statut |
|---------|--------|--------|
| Fine-tuning continu medical | P034 | Fonctionnel mais risque de regression |
| Benchmark MPIB (9,697 instances) | P035 | Disponible pour evaluation |
| Scoring composite (SVC) | AEGIS | En production |
| Validation de dosage (δ³) | AEGIS | En production |
| Verification de contre-indications | AEGIS | En production |
| Guidelines FDA/EMA dans δ³ | AEGIS | Partiel |
| **Detection manipulation emotionnelle** | **Gap identifie (P040)** | **Non implemente** [NEW RUN-002] |
| **Integrite system prompt** | **Gap identifie (P045)** | **Non implemente** [NEW RUN-002] |

### 6.3 Gap medical
La majorite des defenses sont generiques. Les defenses specifiques au medical (validation de dosage, verification de contre-indications, ancrage par guidelines cliniques, detection de manipulation emotionnelle) sont a un stade embryonnaire. C'est la plus grande opportunite de contribution pour la these AEGIS. **En 2026, le gap s'elargit : 2 nouveaux angles d'attaque medicaux (P040 emotional, P045 persistent) sans defense correspondante** [UPDATED RUN-002]

---

## 7. Synthese croisee inter-agents

### 7.1 Convergences entre les 4 agents (RUN-002)

| Constat | Analyst | Matheux | Cybersec | Whitehacker |
|---------|---------|---------|----------|-------------|
| δ⁰ insuffisant | 79.4% support C1, **C1=10/10** | Preuve gradient nul (P019) + GRPO (P039) | "Critically insufficient" + 4 nouvelles menaces critiques | 72% → 30 techniques, T19-T30 bypass δ⁰ |
| δ³ sous-etudie / gap critique | Gap #1, **aucun paper 2026 l'implemente** | Aucune formule δ³ dans la litterature | "Sole surviving defense" en worst-case | 70% bypass partiel, couche la plus resiliente |
| Medical = plus vulnerable | 94.4% ASR (P029), **+P035 CHER, +P040 6x emotion** | ASR = metrique la plus alarmante, **+CHER** | CVSS-like 9.8, **+3 gaps defensifs critiques** | T09=P0, **+T23/T24 emotional medical** |
| Sep(M) = metrique de reference | Formule centrale, **+SAM (P041)** | 4 formules → **37 formules, +SAM** | "FOUNDATION", **+CHER complementaire** | Technique T14, **+T25 SAM** |
| RagSanitizer 12/12 | Couverture notee | N/A | "Strongest alignment", **a tester vs P044** | "One of the few", **+tokens de controle** |
| **LRM = nouvelle classe de menace** | **P036 change le paysage** | **Regression d'alignement formalisee** | **4 nouvelles classes de menaces** | **T19-T22 LRM techniques** |

### 7.2 Complementarites entre agents

L'agent **Analyst** fournit la vue d'ensemble et les statistiques de support des conjectures. L'agent **Matheux** fournit le socle formel (37 formules, DAG de dependances). L'agent **Cybersec** fournit la cartographie des menaces et la matrice de couverture. L'agent **Whitehacker** fournit les PoC reproductibles et les priorites operationnelles.

Ensemble, ces 4 perspectives couvrent le spectre complet : theorie --> formalisation --> menaces --> exploitation.

### 7.3 Desaccords entre agents

Aucun desaccord fondamental n'a ete identifie entre les 4 agents. Les differences portent sur l'emphase :
- L'Analyst met l'accent sur les preuves litteraires (papers supportant/contredisant)
- Le Matheux met l'accent sur la rigueur formelle (validite statistique, preuves)
- Le Cybersec met l'accent sur la couverture operationnelle (MITRE, CVSS, gap analysis)
- Le Whitehacker met l'accent sur l'exploitabilite pratique (difficulte, impact)

**Nouveau pattern RUN-002** : les 4 agents convergent de maniere frappante sur le fait que les papers 2026 **elargissent le gap δ³** plutot que de le combler. Cette convergence involontaire (chaque agent travaille independamment) renforce la these centrale d'AEGIS. [NEW RUN-002]

---

## 8. Patterns 2026 -- Nouvelles tendances identifiees [NEW RUN-002]

### 8.1 Convergence triple δ⁰-δ¹-δ² bypassee
La combinaison P039 (δ⁰ efface) + P045 (δ¹ empoisonne) + P044 (juges δ² bypasses a 99%) montre que les 3 premieres couches sont simultanement vulnerables en 2026. Seul δ³ survive theoriquement, mais aucun paper ne l'implemente.

### 8.2 Paradoxe raisonnement/securite
P036 montre que la capacite de raisonnement amplifie le potentiel offensif. P038 montre que le raisonnement peut aussi servir la defense (InstruCoT). Ce paradoxe sera un theme central de la these.

### 8.3 Metriques medicales emergentes
P035 (CHER) + P040 (Misinformation Rate) + P041 (SAM) forment un triptyque de nouvelles metriques en 2026. Combinees avec Sep(M) et SVC, elles permettent une evaluation multidimensionnelle inedite.

### 8.4 Asymetrie couts attaque/defense
Les attaques deviennent moins couteuses (P036 : un prompt systeme suffit, P039 : un seul exemple). Les defenses deviennent plus couteuses (P042 : necessite GPT-4o, P044 : entrainement adversarial continu). Cette asymetrie economique favorise structurellement les attaquants.

---

*Agent Scientist -- ANALYSE_CROISEE.md*
*8 dimensions d'analyse croisee (+1 nouvelle), 46 papers, 4 agents*
*Version: v2.0 (RUN-002)*
*Derniere mise a jour: 2026-04-04*
