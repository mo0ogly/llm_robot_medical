# CARTE BIBLIOGRAPHIQUE -- Vue d'ensemble du corpus
## These doctorale AEGIS -- ENS 2026
## Securite des LLM medicaux contre l'injection de prompt

**Date**: 2026-04-04
**Agent**: Scientist (Opus 4.6)
**Corpus**: 46 articles (P001--P046)
**Version**: v2.0 (RUN-002 -- mise a jour incrementale avec P035-P046)

---

## 1. Clusters thematiques

### Cluster A : Attaques par injection de prompt (14 papers)

```
P001 (HouYi, 2023) ---- fondation ---- > P006 (Tool Selection, 2025)
     |                                       |
     +--- P026 (Indirect PI, 2025)           +--- P010 (Protocol Exploits, 2025)
     |
     +--- P023 (NDSS 4-strat, 2025) ------> P045 (System Prompt Poisoning, 2026)
     |
     +--- P009 (Character Injection, 2025) -> P044 (AdvJudge-Zero, 2026)
     |
     +--- P022 (Adv RLHF, 2025) ----------> P039 (GRP-Obliteration, 2026)
     |
     +--- P033 (Self-Policing, 2025)
     |
     +--- P036 (LRM Jailbreak, 2026) ------- nouvelle classe d'attaque
```

**Narration** : Le cluster part de P001 (2023, fondation) et se ramifie en 4 branches : (1) injection indirecte/agents (P006, P010, P026, P045), (2) evasion des gardes (P009, P044), (3) compromission de l'alignement (P022, P039), (4) **LRM comme agents autonomes (P036) -- nouvelle branche 2026** [UPDATED RUN-002].

**Sous-cluster 2026 -- Attaques de rupture** :
```
P036 (LRM, 97.14%) ---- raisonnement autonome
P039 (GRP-Oblit, ~100%) ---- desalignement 1 prompt
P044 (AdvJudge, 99%) ---- fuzzing juges
P045 (SPP, persistant) ---- empoisonnement system prompt
```
**Ces 4 papers forment un front 2026 ou δ⁰, δ¹, δ² et les juges sont tous vulnerables.** [NEW RUN-002]

### Cluster B : Defenses et gardes (16 papers)

```
                    P007 (Securing LLMs, 2025)
                         |
           +-------------+-------------+
           |             |             |
    P011 (PromptGuard)  P002 (Multi-Agent)  P005 (Firewalls)
           |             |             |
           |             +--- P042 (PromptArmor, 2026)
           |
    P008 (Attention Tracker, 2024)
           |
    P025 (DMPI-PMHFE, 2025)

    --- Branche RLHF ---
    P017 (Adv Preference) --- P020 (COBRA) --- P021 (Adv Reward)
           |
           +--- P041 (Magic-Token, 2026)

    --- Branche Fine-Tuning ---
    P034 (CFT Medical) --- P038 (InstruCoT, 2026)

    --- Branche VLM ---
    P046 (ADPO, 2026)
```

**Narration** : Les defenses se structurent en 4 branches : (1) frameworks multi-couches (P007, P011, P042), (2) detection par attention/ML (P008, P025), (3) renforcement RLHF (P017, P020, P021, P041), (4) fine-tuning (P034, P038, P046). P042 (2026) represente l'approche la plus recente (LLM-as-guard).

**Sous-cluster 2026 -- Defenses avancees** :
```
P038 (InstruCoT, >90%) ---- raisonnement metacognitif defensif
P041 (Magic-Token, 8B>671B) ---- co-entrainement efficiency
P042 (PromptArmor, <1% FPR) ---- LLM-as-guardrail
P046 (ADPO, VLM) ---- DPO adversarial multimodal
```
**Ces 4 defenses avancent significativement, mais AUCUNE ne couvre δ³.** [NEW RUN-002]

### Cluster C : Metriques et embeddings (8 papers)

```
    Reimers & Gurevych 2019 (SBERT) --- fondation
           |
    P012 (Cosine Sim critique, Steck 2024)
           |
    P013 (Beyond Cosine, 2024) --- P014 (SemScore, 2024)
           |                              |
    P015 (LLM-Enhanced, 2024) --- P016 (Berkeley, 2024)

    --- Branche Separation ---
    P024 (Sep(M), Zverev ICLR 2025) --- metrique centrale
           |
           +--- P041 (SAM, 2026) --- metrique complementaire [NEW RUN-002]
```

**Narration** : Ce cluster part de SBERT (2019) et explore les limites de la similarite cosinus (P012, P013) et ses alternatives (P014, P015). P024 (ICLR 2025) est le paper pivotal qui formalise Sep(M). **P041 (2026) ajoute SAM comme metrique complementaire.** [UPDATED RUN-002]

### Cluster D : Securite medicale (11 papers)

```
    P027 (Med Eval Framework, 2025)
           |
    P029 (JAMA 94.4%, 2025) ---- paper le plus cite du cluster
           |
    P028 (Healthcare Jailbreak, 2025) --- P040 (Healthcare Misinfo, 2026)
           |
    P030 (Declining Safety, 2025) --- longitudinal
           |
    P031 (Ethics Review, 2025)
           |
    P032 (Misinfo Audit, AAAI 2025)
           |
    P034 (CFT Medical, 2025) --- aussi dans Cluster B
           |
    P035 (MPIB Benchmark, 2026) --- benchmark medical dedie, CHER metrique
```

**Narration** : P029 (JAMA) est le paper central. Le cluster couvre l'evaluation (P027, P035), l'attaque (P028, P040), l'erosion (P030), l'ethique (P031), et la defense (P034). **P035 (MPIB, 9,697 instances) et P040 (amplification emotionnelle 6x) renforcent significativement ce cluster en 2026.** [UPDATED RUN-002]

### Cluster E : Comportement des modeles et RLHF (4 papers)

```
    P018 (Shallow Alignment, ICLR 2025) --- P019 (Gradient Analysis, 2026)
           |                                        |
           +--- preuve experimentale           preuve mathematique
           |
    P034 (CFT Medical) --- aussi dans Clusters B et D
```

**Narration** : Cluster compact mais fondamental. P018+P019 forment le socle theorique de C1.

### Cluster F : Benchmarks et surveys (6 papers)

```
    P003 (MDPI Review, 2025) --- survey general
    P004 (WASP, 2025) --- benchmark web agents
    P024 (Sep(M), ICLR 2025) --- aussi dans Cluster C
    P037 (Jailbreak Survey 3D, 2026) --- survey LLM+VLM, 3 couches defense [UPDATED]
    P043 (JBDistill, EMNLP 2025) --- benchmark renouvelable
```

**Narration** : **P037 (2026) est le survey le plus complet du domaine, couvrant LLM+VLM avec une taxonomie 3D. Son omission de δ³ confirme le gap.** [UPDATED RUN-002]

---

## 2. Liens de citation entre papers

### 2.1 Papers les plus cites dans le corpus (citation interne)

| Paper | Cite par (dans le corpus) | Nombre de citations internes |
|-------|--------------------------|------------------------------|
| P001 (Liu/HouYi, 2023) | P003, P006, P009, P010, P023, P026, P029, P033, P045 | 9 (+1 RUN-002) |
| P024 (Zverev/Sep(M), ICLR 2025) | P008, P012, P029, P034, P038, P041, P042 | 7 (+1 RUN-002) |
| P018 (Shallow RLHF, ICLR 2025) | P019, P022, P023, P030, P038, P039 | 6 (+1 RUN-002) |
| P029 (JAMA 94.4%) | P028, P030, P035, P040 | 4 |
| P009 (Character Injection) | P005, P023, P033, P044, P045 | 5 (+1 RUN-002) |
| **P033 (Self-Policing)** | **P036, P042, P044** | **3** [NEW RUN-002] |

### 2.2 Papers fondateurs (les plus anciens, les plus cites)

| Paper | Annee | Role |
|-------|-------|------|
| Reimers & Gurevych (2019) | 2019 | Fondation SBERT -- encodeur de reference |
| P001 (Liu/HouYi) | 2023 | Fondation injection de prompt -- cadre de reference |
| P012 (Steck) | 2024 | Critique fondamentale de la similarite cosinus |
| P024 (Zverev) | 2025 | Metrique formelle de separation (Sep(M)) |
| P018 (Shallow RLHF) | 2025 | Preuve d'alignement superficiel |

### 2.3 Papers pivots (pont entre clusters)

| Paper | Clusters connectes | Role de pont |
|-------|-------------------|-------------|
| P024 (Sep(M)) | C (metriques) + E (RLHF) + F (benchmark) | Lie la mesure formelle a l'evaluation empirique |
| P034 (CFT Medical) | B (defense) + D (medical) + E (RLHF) | Lie le fine-tuning, le medical, et le RLHF |
| P029 (JAMA) | D (medical) + A (attaque) | Lie les attaques aux consequences medicales |
| P033 (Self-Policing) | A (attaque) + B (defense) | Lie les attaques a la vulnerabilite des defenses |
| **P039 (GRP-Obliteration)** | **A (attaque) + E (RLHF)** | **Lie l'attaque directement au mecanisme d'entrainement RLHF** [NEW RUN-002] |
| **P044 (AdvJudge-Zero)** | **A (attaque) + B (defense)** | **Lie l'attaque des juges a la vulnerabilite des defenses** [NEW RUN-002] |
| **P035 (MPIB)** | **D (medical) + C (metriques) + F (benchmark)** | **Lie la metrique medicale (CHER) au benchmarking** [NEW RUN-002] |

---

## 3. Auteurs les plus influents

| Auteur/Equipe | Papers | Domaine | Impact |
|---------------|--------|---------|--------|
| **Liu et al.** | P001 | Attaque | HouYi = cadre de reference de l'injection de prompt (2023) |
| **Zverev et al.** | P024 | Benchmark/Metrique | Sep(M) = seule metrique formelle de separation (ICLR 2025) |
| **Young et al.** | P019 | Comportement/Theorie | Preuve formelle de la fragilite de l'alignement (2026) |
| **Hackett et al.** | P009 | Attaque | 12 categories d'injection de caracteres = reference defensive |
| **Hagendorff, Derner & Oliver** | P036 | Attaque | LRM comme agents de jailbreak autonomes (Nature Comms 2026) |
| **Russinovich et al. (Microsoft)** | P039 | Attaque | GRP-Obliteration = desalignement a 1 prompt (2026) |
| **Li, Wu & Liu (Unit 42)** | P044 | Attaque | AdvJudge-Zero = fuzzing automatise des juges (2026) |
| **Lee, Jang & Choi** | P035 | Medical/Benchmark | MPIB = premier benchmark medical dedie (2026) |
| **Zahra & Chin** | P040 | Medical/Attaque | Amplification emotionnelle 6x en medical (2026) [NEW RUN-002] |
| **Si et al. (Qihoo 360)** | P041 | Defense | Magic-Token + SAM = co-entrainement efficient (2026) [NEW RUN-002] |
| **Shi et al.** | P042 | Defense | PromptArmor = meilleure defense documentee <1% FPR (2026) [NEW RUN-002] |
| **Li, Guo & Cai** | P045 | Attaque | System Prompt Poisoning = vecteur persistant (2026) [NEW RUN-002] |
| **Reimers & Gurevych** | (externe) | Embeddings | SBERT = encodeur de reference pour la mesure de derive |
| **Steck** | P012 | Metriques | Critique fondamentale de la similarite cosinus (2024) |

---

## 4. Venues principales

### 4.1 Distribution par tier

| Tier | Venue | Papers | Domaine |
|------|-------|--------|---------|
| **Top-1** | ICLR | P018, P024 (+P042, P045 under review) | RLHF, Sep(M), PromptArmor, SPP |
| **Top-1** | Nature Communications | P036 | LRM jailbreak |
| **Top-1** | NDSS | P023 | Securite offensive |
| **Top-1** | JAMA Network Open | P029 | Securite medicale |
| **Top-2** | NAACL | P008 | Detection |
| **Top-2** | ACL | P017 | Defense RLHF |
| **Top-2** | AAAI | P032 | Desinformation medicale |
| **Top-2** | EMNLP Findings | P043, P046 | Benchmark, VLM defense |
| **Journal** | Computers & Security | P010 | Agent security |
| **Journal** | MDPI Information | P003 | Survey |
| **Journal** | Springer LNCS | P040 | Healthcare AI |
| **Industrie** | Unit 42 / Palo Alto | P044 | Fuzzing |
| **Preprint** | arXiv | 30+ papers | Divers |

### 4.2 Observations sur les venues
- Les resultats les plus percutants sont dans les top venues (ICLR, Nature Comms, JAMA, NDSS)
- Le domaine medical est publie dans des venues medicales (JAMA) ET IA (arXiv, Springer)
- Les attaques 2026 les plus avancees viennent de l'industrie (Microsoft, Palo Alto/Unit 42)
- La majorite du corpus reste en preprint arXiv, refletant la rapidite du domaine
- **2026 voit une montee en puissance des venues top-tier (Nature Comms P036, ICLR under review P042/P045)** [NEW RUN-002]

---

## 5. Timeline de l'evolution du domaine

```
2019  SBERT (Reimers & Gurevych) -- fondation embeddings
       |
2023  P001 HouYi (Liu et al.) -- premiere systematisation de l'injection
       |
2024  P008 Attention Tracker ---- premiere detection sans entrainement
  |   P012 Steck critique cosine -- remise en question des metriques
  |   P013-P016 embeddings ------- exploration des alternatives
       |
2025  *** EXPLOSION ***
  |   ATTAQUES: P009 char inject (100%), P022 RLHF poison, P023 NDSS 4-strat,
  |             P026 indirect PI, P033 self-policing
  |   DEFENSES: P011 PromptGuard, P017 Adv Pref, P020 COBRA, P025 DMPI
  |   METRIQUES: P024 Sep(M) ICLR -- metrique formelle
  |   MEDICAL: P029 JAMA 94.4%, P028 authority, P030 erosion, P034 CFT
  |   THEORIE: P018 shallow alignment ICLR, P019 gradient proof
       |
2026  *** ESCALADE *** [UPDATED RUN-002]
  |   ATTAQUES: P036 LRM autonome 97% (Nature), P039 1-prompt unalign (Microsoft),
  |             P044 fuzzing juges 99% (Unit 42), P045 system prompt poisoning (ICLR sub)
  |   DEFENSES: P038 InstruCoT >90%, P041 Magic-Token 8B>671B + SAM,
  |             P042 PromptArmor <1% FPR (ICLR sub), P046 ADPO VLM
  |   MEDICAL: P035 MPIB 9,697 instances + CHER, P040 emotional 6x amplification
  |   BENCHMARKS: P037 survey 3D (LLM+VLM), P043 JBDistill renewable
  |
  |   *** CONVERGENCE CRITIQUE 2026 ***
  |   P039 (δ⁰ efface) + P045 (δ¹ empoisonne) + P044 (juges bypasses)
  |   = les 3 premieres couches vulnerables simultanement
  |   Seul δ³ survit theoriquement -- mais AUCUN paper ne l'implemente
       |
2026+ *** THESE AEGIS ***
       Framework δ⁰ a δ³, 66 techniques, Sep(M) en production
       5 techniques δ³ operationnelles -- AVANCE SUR LA LITTERATURE
```

---

## 6. Matrice papers x delta-layers (vue synthetique)

| Paper | δ⁰ | δ¹ | δ² | δ³ | Medical |
|-------|---------|---------|---------|---------|---------|
| P001 | . | X | . | . | . |
| P002 | X | X | X | . | . |
| P008 | . | . | X | . | . |
| P009 | . | . | X | . | . |
| P011 | . | X | X | X | . |
| P018 | X | . | . | . | . |
| P019 | X | . | . | . | . |
| P024 | X | X | . | X | . |
| P029 | X | X | . | X | X |
| P033 | . | X | X | X | . |
| P035 | X | X | . | . | X |
| P036 | X | X | . | . | . |
| P037 | X | X | X | . | . |
| P038 | X | . | . | . | . |
| P039 | X | . | . | . | . |
| P040 | X | X | . | . | X |
| P041 | X | X | . | . | . |
| P042 | . | X | X | . | . |
| P044 | . | . | X | . | . |
| P045 | . | X | . | . | . |
| P046 | X | . | . | . | . |

Legende : X = concerne directement, . = non traite

**Observation** : δ⁰ est le plus etudie (20 papers), δ³ le moins (4 papers). Le medical est couvert par 11 papers. L'intersection {δ³ AND medical} = seulement 2 papers (P029, P035), confirmant le gap identifie. **Les 12 papers 2026 ajoutent massivement a δ⁰ et δ¹ mais AUCUN a δ³ -- le gap s'elargit.** [UPDATED RUN-002]

---

## 7. Statistiques du corpus

| Dimension | Valeur RUN-001 | Valeur RUN-002 | Delta |
|-----------|---------------|---------------|-------|
| Total papers | 46 | 46 | = |
| Papers Phase 1 (2023-2025) | 34 | 34 | = |
| Papers Phase 2 (2026) | 12 | 12 | = |
| Domaine attaque | 12 (26.1%) | **14 (30.4%)** | +2 (P039, P045 reclasses) |
| Domaine defense | 14 (30.4%) | **16 (34.8%)** | +2 (P038, P042 ajoutes) |
| Domaine medical | 9 (19.6%) | **11 (23.9%)** | +2 (P035, P040 integres) |
| Domaine benchmark/survey | 5 (10.9%) | **6 (13.0%)** | +1 (P037 ajoute) |
| Domaine embeddings | 5 (10.9%) | 5 (10.9%) | = |
| Domaine comportement modele | 4 (8.7%) | 4 (8.7%) | = |
| Top venue (ICLR, Nature, NDSS, JAMA, NAACL, ACL, AAAI, EMNLP) | 10 (21.7%) | **12 (26.1%)** | +2 (P036 Nature, P046 EMNLP) |
| Formules extraites | 22 | **37** | +15 |
| Techniques d'attaque | 18 | **30** | +12 |
| PoC exploits | 12 | **24** | +12 |
| Modeles de menace | 34 | 34 | = |

Note : Certains papers apparaissent dans plusieurs domaines (ex: P034 = defense + medical).

---

## 8. Carte des connections 2026 [NEW RUN-002]

### 8.1 Reseau de citations croisees 2026

```
P035 (MPIB) <------- benchmark medical -------> P040 (Emotional)
     |                                                |
     v                                                v
 P029 (JAMA) <-- reference medicale commune --> P028 (Healthcare)
     |
     v
P030 (Erosion) <---- degradation temporelle

P036 (LRM) <------- attaque autonome
     |                     |
     +--- P039 (GRP-Oblit) -- desalignement par meme mecanisme (RLHF/GRPO)
     |                     |
     +--- P044 (AdvJudge) --- fuzzing (complementaire, pas redondant)
                           |
                    P045 (SPP) --- persistance (dimension temporelle)

P038 (InstruCoT) <--- defense raisonnement <--- P036 (contre-mesure possible)
     |
P041 (Magic-Token) <--- defense efficiency <--- P024 (Sep(M) complement SAM)
     |
P042 (PromptArmor) <--- defense LLM-garde <--- P033 (vulnerabilite recursive)
     |
P046 (ADPO) <--- defense VLM <--- P037 (survey taxo) --- contexte
```

### 8.2 Patterns de connexion
1. **Cluster offensif convergent** : P036+P039+P044+P045 forment un front uni contre δ⁰-δ²
2. **Cluster defensif disperse** : P038, P041, P042, P046 operent independamment sans integration
3. **Cluster medical emergent** : P035+P040 enrichissent le cluster D avec des metriques et vecteurs nouveaux
4. **Aucune connexion a δ³** : Ni les attaques ni les defenses 2026 ne ciblent ou proposent δ³

---

*Agent Scientist -- CARTE_BIBLIOGRAPHIQUE.md*
*46 papers, 6 clusters, 5 tiers de venues, timeline 2019-2026*
*Version: v2.0 (RUN-002)*
*Derniere mise a jour: 2026-04-04*
