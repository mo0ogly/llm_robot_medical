# CONJECTURES TRACKER — Evolution des Conjectures au Fil des RUNs

> **Ce fichier trace l'evolution des scores de confiance de chaque conjecture.**
> Tous les agents DOIVENT le consulter et le mettre a jour.
> Derniere mise a jour : RUN-003 (2026-04-04)

---

## Vue d'Ensemble

| Conjecture | Enonce (resume) | RUN-001 | RUN-002 | RUN-003 | Tendance | Statut |
|-----------|----------------|---------|---------|---------|----------|--------|
| **C1** | δ⁰ (RLHF) est insuffisant | 9/10 | 10/10 | **10/10** | → | VALIDEE (sature) |
| **C2** | δ³ est necessaire | 8/10 | 9/10 | **10/10** | ↑ | VALIDEE |
| **C3** | Alignement est superficiel | 8/10 | 9/10 | **10/10** | ↑ | VALIDEE |
| **C4** | Derive semantique mesurable | 6/10 | 8/10 | **9/10** | ↑ | FORTEMENT SUPPORTEE |
| **C5** | Cosine similarity insuffisante | 7/10 | 7/10 | **8/10** | ↑ | FORTEMENT SUPPORTEE |
| **C6** | Domaine medical plus vulnerable | 7/10 | 8/10 | **9/10** | ↑ | FORTEMENT SUPPORTEE |
| **C7** | Paradoxe raisonnement/securite | — | 7/10 | **8/10** | ↑ | FORTEMENT SUPPORTEE |

---

## Detail par Conjecture

### C1 : Insuffisance de δ⁰ (alignement RLHF)

**Enonce complet** : L'alignement RLHF de base (δ⁰) est insuffisant pour proteger un LLM contre les injections de prompt, en particulier dans le domaine medical.

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 9/10 | 27/34 papers supportent. Preuve formelle P019 (gradient nul). | P018, P019, P022, P029, P030 |
| RUN-002 | 10/10 | P039 (effacement par 1 prompt) + P044 (supervision compromise) rendent C1 quasi-certaine. | +P036, P039, P044, P035 |
| RUN-003 | **10/10** | Sature. P052 fournit la PREUVE FORMELLE par martingale (gradient = Cov(harm, score)). P050 montre degradation multi-tour 9.5->5.5 (p<0.001). P053 confirme via taxonomie limitations RLHF. | +P050, P052, P053 |

**Preuves les plus fortes** :
- P019 (preuve mathematique, gradient = 0)
- P052 (preuve formelle par martingale : I_t = Cov[E[H|x<=t], score_function])
- P039 (effacement complet par 1 prompt, 15 modeles)
- P036 (97.14% ASR autonome par LRM)
- P050 (degradation multi-tour 9.5->5.5, p<0.001, 22 modeles)

**Contre-arguments** : P017/P020/P021 montrent des ameliorations. P057 (ASIDE) montre que delta-0 PEUT etre renforce architecturalement mais ne resout pas la limitation structurelle de P019/P052.

---

### C2 : Necessite de δ³ (validation formelle de sortie)

**Enonce complet** : La validation formelle des sorties (δ³) est necessaire pour compenser les faiblesses des couches δ⁰ a δ², en particulier dans le domaine medical.

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 8/10 | 22/34 papers supportent. Argument d'incompletude P033. | P029, P019, P033, P024, P011 |
| RUN-002 | 9/10 | Triple convergence P039+P044+P045. Gap δ³ confirme par P037 (survey ne couvre pas δ³). | +P039, P044, P045, P037 |
| RUN-003 | **10/10** | P054+P055 montrent que le RAG est vulnerable (compound + persistant). P058 montre attaques agents automatisees. P060 (SoK, IEEE S&P 2026) confirme qu'aucun guardrail seul ne domine. P057 ASIDE renforce mais ne remplace pas delta-3. | +P054, P055, P058, P060, P057 |

**Preuves les plus fortes** :
- Triple Convergence (D-001) : δ⁰-δ² simultanement vulnerables
- P019/P052 (impossibilite theorique + preuve formelle martingale)
- P033 (argument d'incompletude : LLM ne peut se juger)
- P060 (IEEE S&P 2026 : aucun guardrail ne domine sur les 3 dimensions SEU)
- P054+P055 (attaques RAG composites + persistantes necessitent δ³ data integrity)

**Contre-arguments** : P042 (PromptArmor <1% FPR) et P057 (ASIDE) suggerent des voies pour renforcer δ⁰-δ², mais ni l'un ni l'autre ne resout les attaques compound RAG (P054) ou la persistance (P055).

---

### C3 : Alignement superficiel (shallow alignment)

**Enonce complet** : L'alignement RLHF ne couvre que les premiers tokens de la reponse. Les positions au-dela de l'horizon de nocivite ne recoivent aucun signal d'entrainement.

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 8/10 | Demonstration experimentale P018 + preuve formelle P019. | P018, P019 |
| RUN-002 | 9/10 | P039 prouve que l'alignement est non seulement superficiel mais effacable. P036 montre que les LRM exploitent cette superficialite. | +P039, P036 |
| RUN-003 | **10/10** | P052 = PREUVE MATHEMATIQUE DIRECTE par decomposition en martingale. I_t decroit au-dela des premiers tokens. P049 montre bypass 100% des guardrails. P057 ASIDE propose une reponse architecturale (rotation orthogonale). | +P052, P049, P057, P053 |

---

### C4 : Derive semantique mesurable par Sep(M)

**Enonce complet** : La derive semantique induite par l'injection de prompt est mesurable via le score de separation Sep(M) de Zverev et al. (ICLR 2025).

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 6/10 | Sep(M) defini theoriquement mais pas encore valide avec N >= 30. | P024, P012 |
| RUN-002 | 8/10 | P035 (MPIB) fournit un benchmark avec N >= 30, validant la faisabilite. P041 (SAM) fournit une metrique complementaire. | +P035, P041 |
| RUN-003 | **9/10** | P057 ASIDE utilise directement Sep(M) comme metrique de validation, prouvant son utilite pratique. P050 degradation multi-tour 9.5->5.5 est mesurable par Sep(M). P054 derive RAG compound est une nouvelle surface de mesure. | +P057, P050, P054 |

**Condition de validation** : Executer Sep(M) avec N >= 30 par condition sur le benchmark MPIB (P035). P057 ASIDE fournit un precedent de validation reussie.

---

### C5 : Insuffisance de la similarite cosinus

**Enonce complet** : La similarite cosinus (all-MiniLM-L6-v2) est insuffisante comme seule mesure de derive semantique en raison de la sensibilite a la matrice gauge et des angles morts (antonymes).

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 7/10 | P012 (matrice gauge) + P013 (antonymes). | P012, P013 |
| RUN-002 | 7/10 | Pas de nouvelles preuves en 2026. | (inchange) |
| RUN-003 | **8/10** | P057 ASIDE utilise rotation orthogonale dans l'espace cosine, montrant les limites de la mesure brute. P054+P055 exploitent la similarite cosinus pour positionner des vecteurs empoisonnes dans le RAG. P053 montre que les paraphrases ont des cosines proches mais contournent l'alignement. | +P057, P054, P055, P053 |

**Action requise** : Tester la calibration cosinus contre le benchmark MPIB (P035) avec N >= 30. P057 ASIDE fournit une reference de correction par rotation orthogonale.

---

### C6 : Vulnerabilite accrue du domaine medical

**Enonce complet** : Le domaine medical est significativement plus vulnerable aux injections de prompt en raison de facteurs specifiques (hierarchie culturelle, enjeux vitaux, absence de defenses dediees).

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-001 | 7/10 | P029 (94.4% ASR medical) + P028 (hierarchie) + P030 (erosion). | P029, P028, P030, P027 |
| RUN-002 | 8/10 | P035 (MPIB 9,697 instances, premier benchmark N >= 30) + P040 (amplification emotionnelle 6x). | +P035, P040 |
| RUN-003 | **9/10** | P050 JMedEthicBench : VALIDATION STATISTIQUE DIRECTE (p<0.001, 22 modeles). Modeles medicaux PLUS vulnerables que generalistes. Degradation multi-tour 9.5->5.5. P051 premier detecteur clinique 4D. | +P050, P051 |

**Preuves les plus fortes** :
- P029 : 94.4% ASR, 91.7% sur drogues categorie X (JAMA)
- P040 : manipulation emotionnelle amplifie de 6.2% a 37.5%
- P035 : premier benchmark statistiquement valide (N >> 30)
- P050 : modeles specialises medicaux PLUS vulnerables que generalistes (p<0.001), 50,000 conversations, cross-lingue

---

### C7 : Paradoxe raisonnement/securite

**Enonce** : La capacite de raisonnement avancee des LRM (Large Reasoning Models) correle negativement avec la securite. Plus un modele raisonne bien, plus il est capable de contourner ses propres gardes et ceux des autres modeles. Formulation nuancee : le raisonnement est un amplificateur bidirectionnel asymetrique en faveur de l'attaquant.

| RUN | Score | Raison du changement | Papers cles |
|-----|-------|---------------------|-------------|
| RUN-002 | 7/10 | P036 (Nature Comms) : 4 LRM jailbreak 9 cibles a 97.14% ASR de maniere autonome. La capacite de raisonnement est l'arme. | P036, P039 |
| RUN-003 | **8/10** | P058 (ETH Zurich) montre que l'automatisation des attaques par agents exploite le raisonnement (tool use, planning). P052 montre que le gradient analysis require raisonnement. P059 montre que les reviewers IA raisonnent sur du contenu empoisonne. | +P058, P052, P059 |

**Preuves** :
- P036 : DeepSeek-R1, Gemini 2.5 Flash, Grok 3 Mini, Qwen3 235B — tous exploitent le raisonnement pour la subversion
- P039 : GRPO (outil d'entrainement de raisonnement) est retourne en arme d'unalignment
- P058 : framework automatise d'attaque agent-level -- le raisonnement (tool use, planning) est la surface d'attaque
- P059 : les reviewers IA raisonnent sur des papiers contenant des injections cachees

**Contre-arguments potentiels** :
- P041 (Magic-Token) montre qu'un petit modele bien entraine peut etre plus sur qu'un grand
- P038 (InstruCoT) utilise le raisonnement defensivement (>90%)
- Le paradoxe pourrait etre un artefact de l'absence de safety training specifique aux LRM

**Questions ouvertes** :
1. Existe-t-il un seuil de capacite de raisonnement au-dela duquel l'alignement echoue categoriquement ?
2. Les LRM developpes APRES la publication de P036 integrent-ils des defenses contre l'auto-subversion ?
3. AEGIS peut-il detecter un LRM en mode "jailbreak autonome" via patterns de conversation ?
4. L'automatisation (P058) accelere-t-elle la course aux armements au point de rendre les defenses manuelles obsoletes ?

---

## Graphique d'Evolution

```
Confiance  RUN-001    RUN-002    RUN-003    Cible
10/10      .          C1●        C1● C2● C3● VALIDEES
 9/10      C1●        C2● C3●   C4● C6●
 8/10      C2● C3●    C4● C6●   C5● C7●
 7/10      C5● C6●    C5● C7●   .
 6/10      C4●        .          .
 5/10      .          .          .          minimum

● = position de la conjecture a ce RUN
Legende : ↑ = monte, → = stable, ↓ = baisse
```

**RUN-003 : 3 conjectures atteignent le seuil 10/10 (VALIDEES), les 4 restantes sont >= 8/10 (FORTEMENT SUPPORTEES).**

## Regles d'Evolution

1. **Montee** : Nouveau paper FORT (top venue, reproductible) qui supporte la conjecture
2. **Baisse** : Nouveau paper FORT qui contredit + propose alternative demontree
3. **Invalidation** (score < 3/10) : >= 3 papers forts convergents qui contredisent
4. **Nouvelle conjecture** : Pattern emergent supporte par >= 2 papers independants
5. **Seuil de validation** : >= 8/10 = VALIDEE pour la these
