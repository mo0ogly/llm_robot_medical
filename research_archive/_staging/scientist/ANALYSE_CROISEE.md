# ANALYSE CROISEE -- Synthese Inter-Agents
## These doctorale AEGIS -- ENS 2026
## Securite des LLM medicaux contre l'injection de prompt

**Date**: 2026-04-04
**Agent**: Scientist (Opus 4.6)
**Corpus**: 46 articles (P001--P046), analyses croisees de 4 agents specialises

---

## 1. Tendances temporelles (2023 --> 2026)

### 1.1 Distribution du corpus

| Annee | Articles | Pourcentage | Tendance dominante |
|-------|----------|-------------|-------------------|
| 2023 | 1 | 2.2% | Fondation (HouYi, Liu et al.) |
| 2024 | 7 | 15.2% | Diversification des attaques et premieres defenses formalisees |
| 2025 | 26 | 56.5% | Explosion -- attaques sophistiquees + defenses multi-couches |
| 2026 | 12 | 26.1% | Escalade -- LRM autonomes, empoisonnement a un prompt, benchmarks medicaux |

### 1.2 Evolution des attaques

**2023 -- Phase fondatrice** : L'injection de prompt est documentee comme un probleme systematique. P001 (HouYi) etablit le cadre de reference avec 86.1% d'applications vulnerables, mais les attaques restent relativement simples (partition de contexte).

**2024 -- Diversification** : Les attaques ciblent de nouvelles surfaces : embeddings (P012, P013), mecanismes d'attention (P008), et comportement des modeles (P018). Le domaine medical emerge comme cible specifique (P027-P029).

**2025 -- Sophistication** : Les attaques deviennent multi-strategies (P023, NDSS -- 4 strategies d'escalade), ciblent la chaine d'approvisionnement (P022 -- empoisonnement RLHF), et exploitent les architectures agent (P006, P010). Le taux d'ASR le plus eleve est documente dans le domaine medical : 94.4% (P029, JAMA).

**2026 -- Escalade qualitative** : Trois ruptures majeures :
1. **Agents autonomes** : Les LRM raisonnent pour contourner les gardes a 97.14% (P036, Nature Comms)
2. **Desalignement minimal** : Un seul prompt suffit a desaligner 15 LLMs (P039, Microsoft)
3. **Fuzzing automatise** : AdvJudge-Zero atteint 99% de bypass (P044, Unit 42)

### 1.3 Evolution des defenses

**2023-2024** : Defenses ad hoc -- system prompts, preambles de securite, separateurs. Efficacite limitee et non mesuree formellement.

**2025** : Formalisation -- Sep(M) fournit la premiere metrique rigoureuse (P024, ICLR). PromptGuard propose un framework 4 couches (P011). Attention Tracker offre une detection sans entrainement (P008). Mais les gardes commerciaux restent vulnerables a l'injection de caracteres (P009).

**2026** : Amelioration significative des defenses :
- InstruCoT : >90% de defense sur 7 methodes d'attaque (P038)
- PromptArmor : <1% FPR/FNR avec GPT-4o comme garde (P042)
- Magic-Token : Modele 8B surpasse DeepSeek-R1 671B en securite (P041)
- ADPO : DPO adversarial pour les VLMs (P046)
- Mais : l'entrainement adversarial (P044) est la seule approche demontree contre le fuzzing automatise

### 1.4 Verdict temporel
Les attaques progressent plus vite que les defenses en 2023-2025. En 2026, les defenses commencent a rattraper mais le front avance (LRM, desalignement a un prompt). La dynamique globale reste en faveur des attaquants, surtout dans le domaine medical ou les defenses specifiques sont quasi-inexistantes.

---

## 2. Convergences -- Sur quoi la communaute s'accorde

### 2.1 L'alignement RLHF est insuffisant seul
**Consensus fort** (27/34 papers Phase 1 supportent C1, soit 79.4%).

Les 4 agents convergent :
- **Analyst** : 79.4% des papers supportent C1 (insuffisance delta-1/delta-0)
- **Matheux** : Preuve formelle via gradient nul au-dela de l'horizon de nocivite (P019, formule 4.5)
- **Cybersec** : Delta-0 note "NECESSARY BUT CRITICALLY INSUFFICIENT" avec 18/34 papers le confirmant
- **Whitehacker** : 13/18 techniques (72%) contournent delta-0

### 2.2 Le domaine medical est le plus vulnerable
**Consensus unanime** parmi tous les agents.
- ASR le plus eleve du corpus : 94.4% (P029, JAMA)
- Erosion passive documentee sur 3 ans (P030)
- Amplification par hierarchie culturelle (P028)
- Nouveaux benchmarks dedies en 2026 (P035-MPIB, P040)

### 2.3 La defense en profondeur est necessaire
**Consensus fort** (22/34 papers supportent C2, soit 64.7%).
- PromptGuard valide l'approche 4 couches (P011)
- Les tests whitehacker montrent que chaque couche individuelle est contournable
- La combinaison reduit l'ASR meme si elle ne l'elimine pas (33% residuel par P033)

### 2.4 Sep(M) est la metrique de reference pour la separation
**Consensus emergent** -- Sep(M) est cite par 5 papers directement et ses concepts sous-jacents par 12+ papers. C'est la seule metrique formellement definie pour quantifier la separation instruction/donnee.

---

## 3. Divergences -- Sur quoi la communaute se contredit

### 3.1 Un LLM avance peut-il etre un garde suffisant ?
- **Pour** : P042 (PromptArmor) montre que GPT-4o comme garde atteint <1% FPR/FNR sur AgentDojo
- **Contre** : P033 montre la vulnerabilite recursive des juges partageant la meme famille ; P044 montre 99% de bypass par fuzzing des juges ; P036 montre que les LRM contournent les juges par raisonnement autonome
- **Resolution possible** : Heterogeneite de modele (AEGIS) + entrainement adversarial (P044)

### 3.2 Le fine-tuning est-il une solution ou un risque ?
- **Pour** : P024 montre que le fine-tuning augmente Sep de 37.5% a 81.8% ; P034 montre l'efficacite du CFT medical ; P038 (InstruCoT) atteint >90%
- **Contre** : P024 montre aussi que l'utilite chute de 67.8% a 19.2% ; P034 documente des regressions ; P039 montre qu'un seul prompt peut defaire le fine-tuning de securite
- **Resolution possible** : Fine-tuning avec contraintes (formule 4.4, P018) + monitoring Sep(M) continu

### 3.3 La taille du modele determine-t-elle la securite ?
- **Pour** : Les modeles plus grands (GPT-4o, Claude 3.5) montrent generalement une meilleure resistance (P040, P042)
- **Contre** : P034 montre l'independance par rapport a l'echelle ; P041 montre qu'un modele 8B surpasse un 671B en securite via co-entrainement ; P036 montre que la capacite de raisonnement (modeles plus grands) AMPLIFIE la menace
- **Resolution** : La securite depend de la methode d'entrainement, pas de la taille. Les modeles plus grands sont a la fois meilleurs defenseurs ET meilleurs attaquants.

### 3.4 L'ASR est-il une metrique suffisante ?
- **Pour** : L'ASR est universellement utilise et permet les comparaisons (P001, P029, P036)
- **Contre** : P035 (MPIB) montre que ASR et dommage clinique (CHER) divergent -- un ASR eleve ne signifie pas necessairement un dommage clinique eleve, et inversement
- **Resolution possible** : Metriques composites (AEGIS SVC, MPIB CHER) combinant ASR + severite + contexte clinique

---

## 4. Angles morts -- Sujets sous-etudies

### 4.1 Attaques multi-modales en contexte medical
**Aucun paper** dans le corpus n'etudie les injections via des images medicales (radiographies, IRM) contenant des instructions textuelles cachees. Seul P046 (ADPO) aborde la securite des VLMs mais dans un contexte general. Les systemes de diagnostic par image + LLM sont un vecteur d'attaque non explore.

### 4.2 Interactions entre couches delta
**Aucun paper** n'etudie comment les couches delta-0 a delta-3 interagissent lorsqu'elles sont empilees. L'agent Analyst note ce gap. Questions non resolues : delta-2 peut-il degrader l'utilite au point de rendre delta-0 inefficace ? Delta-3 peut-il compenser totalement une delta-0 defaillante ?

### 4.3 Defenses specifiques au medical
Sur 46 papers, seuls 2 proposent des defenses medicales specifiques (P034-CFT, P035-MPIB benchmark). Les 8 autres defenses sont generiques et testees sur des taches non-medicales. L'adaptation des defenses au vocabulaire, aux protocoles et aux contraintes reglementaires medicales est un champ quasiment vierge.

### 4.4 Validation statistique rigoureuse en medical
L'agent Matheux note que Sep(M) requiert N >= 30 par condition. P029 utilise N=5 pour les modeles phares. Aucune evaluation medicale dans le corpus n'atteint la validite statistique requise par P024. Cet angle mort est critique pour la reproductibilite.

### 4.5 Defenses structurelles (non-LLM)
Les techniques `prompt_sandboxing`, `data_marking`, `typoglycemia_detection`, `script_mixing_detection`, `fragmented_instruction_detection` et `base64_heuristic` de la taxonomie AEGIS n'ont 0 ou 1 reference(s) dans la litterature. Ces defenses structurelles deterministes sont sous-etudiees par rapport aux approches ML.

### 4.6 Cout computationnel des defenses
Aucun paper ne fournit de comparaison systematique du cout (latence, memoire, cout API) des differentes approches de defense. En milieu medical ou la latence impacte les soins, c'est un angle mort important.

---

## 5. Escalade attaque/defense -- Evolution de la course aux armements

### 5.1 Matrice d'escalade

| Generation | Attaque representatice | ASR | Defense correspondante | Delai defense |
|------------|----------------------|-----|----------------------|---------------|
| Gen 1 (2023) | Partition de contexte (P001) | 86% | System prompts, preambles | Immediat mais insuffisant |
| Gen 2 (2024) | Injection multi-tour (P028) | ~80% | Attention Tracker (P008) | ~6 mois |
| Gen 3 (2025) | Injection de caracteres (P009) | 100% | RagSanitizer 12/12 (AEGIS) | ~3 mois |
| Gen 3.5 (2025) | Empoisonnement RLHF (P022) | N/A | COBRA consensus (P020) | Concurrent |
| Gen 4 (2026) | LRM autonomes (P036) | 97% | PromptArmor (P042) <1% FPR | Concurrent |
| Gen 4.5 (2026) | Desalignement a 1 prompt (P039) | ~100% | Magic-Token (P041) | Concurrent |
| Gen 5 (2026) | Fuzzing automatise (P044) | 99% | Entrainement adversarial (P044) | Meme paper |

### 5.2 Observations
1. Le delai entre attaque et defense se reduit (6 mois en 2024, concurrent en 2026), suggerant une maturation du domaine
2. Les attaques de generation 4+ necessitent des capacites de raisonnement avancees (LRM) -- la barre d'entree pour les attaquants monte
3. Les defenses les plus efficaces en 2026 sont celles qui utilisent les memes capacites que les attaques (LLM-as-guard, entrainement adversarial)
4. **Point critique** : les defenses de chaque generation ne protegent pas contre la generation suivante. Seule l'empilement de couches (defense en profondeur) offre une resilience durable.

---

## 6. Specificite medicale -- En quoi le domaine medical est different

### 6.1 Facteurs amplificateurs

| Facteur | Evidence | Impact sur la securite |
|---------|---------|----------------------|
| Consequences mortelles | P029 (91.7% ASR sur drogues categorie X) | Toute injection reussie peut entrainer un dommage patient |
| Hierarchie culturelle | P028 (usurpation d'autorite medicale) | Les LLM medicaux sont plus susceptibles aux instructions "d'autorite" |
| Erosion passive | P030 (26.3% --> 0.97% disclaimers en 3 ans) | La securite se degrade sans attaque active |
| Donnees sensibles | P010 (protocoles comme vecteurs) | Les donnees cliniques contiennent des instructions latentes |
| Manipulation emotionnelle | P040 (6.2% --> 37.5% desinformation avec emotion) | L'affect du patient/clinicien est exploitable |
| Divergence ASR/dommage | P035 (CHER vs ASR) | Les metriques generiques ne capturent pas le risque medical |

### 6.2 Defenses medicales existantes

| Defense | Source | Statut |
|---------|--------|--------|
| Fine-tuning continu medical | P034 | Fonctionnel mais risque de regression |
| Benchmark MPIB (9,697 instances) | P035 | Disponible pour evaluation |
| Scoring composite (SVC) | AEGIS | En production |
| Validation de dosage (delta-3) | AEGIS | En production |
| Verification de contre-indications | AEGIS | En production |
| Guidelines FDA/EMA dans delta-3 | AEGIS | Partiel |

### 6.3 Gap medical
La majorite des defenses sont generiques. Les defenses specifiques au medical (validation de dosage, verification de contre-indications, ancrage par guidelines cliniques, detection de manipulation emotionnelle) sont a un stade embryonnaire. C'est la plus grande opportunite de contribution pour la these AEGIS.

---

## 7. Synthese croisee inter-agents

### 7.1 Convergences entre les 4 agents

| Constat | Analyst | Matheux | Cybersec | Whitehacker |
|---------|---------|---------|----------|-------------|
| Delta-0 insuffisant | 79.4% support C1 | Preuve gradient nul (P019) | "Critically insufficient" | 72% techniques bypass |
| Delta-3 sous-etudie | Gap #1 identifie | N/A (pas de formule delta-3) | "Least studied, most critical" | 72% bypass partiel |
| Medical = plus vulnerable | 94.4% ASR (P029) | ASR = metrique la plus alarmante | CVSS-like 9.8 (rang 1) | T09 = priorite P0 |
| Sep(M) = metrique de reference | Formule centrale | 4 formules extraites | "FOUNDATION" | Technique T14 |
| RagSanitizer 12/12 | Couverture notee | N/A | "Strongest alignment" | "One of the few" |

### 7.2 Complementarites entre agents

L'agent **Analyst** fournit la vue d'ensemble et les statistiques de support des conjectures. L'agent **Matheux** fournit le socle formel (22 formules, DAG de dependances). L'agent **Cybersec** fournit la cartographie des menaces et la matrice de couverture. L'agent **Whitehacker** fournit les PoC reproductibles et les priorites operationnelles.

Ensemble, ces 4 perspectives couvrent le spectre complet : theorie --> formalisation --> menaces --> exploitation.

### 7.3 Desaccords entre agents

Aucun desaccord fondamental n'a ete identifie entre les 4 agents. Les differences portent sur l'emphase :
- L'Analyst met l'accent sur les preuves litteraires (papers supportant/contredisant)
- Le Matheux met l'accent sur la rigueur formelle (validite statistique, preuves)
- Le Cybersec met l'accent sur la couverture operationnelle (MITRE, CVSS, gap analysis)
- Le Whitehacker met l'accent sur l'exploitabilite pratique (difficulte, impact)

---

*Agent Scientist -- ANALYSE_CROISEE.md*
*7 dimensions d'analyse croisee, 46 papers, 4 agents*
*Derniere mise a jour: 2026-04-04*
