# CARTE BIBLIOGRAPHIQUE -- Vue d'ensemble du corpus
## These doctorale AEGIS -- ENS 2026
## Securite des LLM medicaux contre l'injection de prompt

**Date**: 2026-04-04
**Agent**: Scientist (Opus 4.6)
**Corpus**: 46 articles (P001--P046)

---

## 1. Clusters thematiques

### Cluster A : Attaques par injection de prompt (12 papers)

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

**Narration** : Le cluster part de P001 (2023, fondation) et se ramifie en 3 branches : (1) injection indirecte/agents (P006, P010, P026, P045), (2) evasion des gardes (P009, P044), (3) compromission de l'alignement (P022, P039). P036 (2026) ouvre une nouvelle classe : les LRM comme agents autonomes de jailbreak.

### Cluster B : Defenses et gardes (14 papers)

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
```

**Narration** : Ce cluster part de SBERT (2019) et explore les limites de la similarite cosinus (P012, P013) et ses alternatives (P014, P015). P024 (ICLR 2025) est le paper pivotal qui formalise Sep(M) comme metrique de reference.

### Cluster D : Securite medicale (9 papers)

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
    P035 (MPIB Benchmark, 2026) --- benchmark medical dedie
```

**Narration** : P029 (JAMA) est le paper central avec le resultat le plus alarmant (94.4% ASR). Le cluster couvre l'evaluation (P027, P035), l'attaque (P028, P040), l'erosion (P030), l'ethique (P031), et la defense (P034).

### Cluster E : Comportement des modeles et RLHF (4 papers)

```
    P018 (Shallow Alignment, ICLR 2025) --- P019 (Gradient Analysis, 2026)
           |                                        |
           +--- preuve experimentale           preuve mathematique
           |
    P034 (CFT Medical) --- aussi dans Clusters B et D
```

**Narration** : Cluster compact mais fondamental. P018+P019 forment le socle theorique de C1. P018 fournit la preuve experimentale, P019 la preuve formelle.

### Cluster F : Benchmarks et surveys (5 papers)

```
    P003 (MDPI Review, 2025) --- survey general
    P004 (WASP, 2025) --- benchmark web agents
    P024 (Sep(M), ICLR 2025) --- aussi dans Cluster C
    P037 (Jailbreak Survey, 2026) --- survey LLM+VLM
    P043 (JBDistill, EMNLP 2025) --- benchmark renouvelable
```

---

## 2. Liens de citation entre papers

### 2.1 Papers les plus cites dans le corpus (citation interne)

| Paper | Cite par (dans le corpus) | Nombre de citations internes |
|-------|--------------------------|------------------------------|
| P001 (Liu/HouYi, 2023) | P003, P006, P009, P010, P023, P026, P029, P033 | 8 |
| P024 (Zverev/Sep(M), ICLR 2025) | P008, P012, P029, P034, P038, P042 | 6 |
| P018 (Shallow RLHF, ICLR 2025) | P019, P022, P023, P030, P039 | 5 |
| P029 (JAMA 94.4%) | P028, P030, P035, P040 | 4 |
| P009 (Character Injection) | P005, P023, P033, P044 | 4 |

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

---

## 3. Auteurs les plus influents

| Auteur/Equipe | Papers | Domaine | Impact |
|---------------|--------|---------|--------|
| **Liu et al.** | P001 | Attaque | HouYi = cadre de reference de l'injection de prompt (2023) |
| **Zverev et al.** | P024 | Benchmark/Metrique | Sep(M) = seule metrique formelle de separation (ICLR 2025) |
| **Young et al.** | P019 | Comportement/Theorie | Preuve formelle de la fragilite de l'alignement (2026) |
| **Hackett et al.** | P009 | Attaque | 12 categories d'injection de caracteres = reference defensive |
| **Hagendorff, Derner & Oliver** | P036 | Attaque | LRM comme agents de jailbreak autonomes (Nature Comms 2026) |
| **Microsoft Research** | P039 | Attaque | GRP-Obliteration = desalignement a 1 prompt (2026) |
| **Unit 42 (Palo Alto)** | P044 | Attaque | AdvJudge-Zero = fuzzing automatise des juges (2026) |
| **Lee, Jang & Choi** | P035 | Medical/Benchmark | MPIB = premier benchmark medical dedie (2026) |
| **Reimers & Gurevych** | (externe) | Embeddings | SBERT = encodeur de reference pour la mesure de derive |
| **Steck** | P012 | Metriques | Critique fondamentale de la similarite cosinus (2024) |

---

## 4. Venues principales

### 4.1 Distribution par tier

| Tier | Venue | Papers | Domaine |
|------|-------|--------|---------|
| **Top-1** | ICLR | P018, P024 (+P042, P045 under review) | RLHF, Sep(M) |
| **Top-1** | Nature Communications | P036 | LRM jailbreak |
| **Top-1** | NDSS | P023 | Securite offensive |
| **Top-1** | JAMA Network Open | P029 | Securite medicale |
| **Top-2** | NAACL | P008 | Detection |
| **Top-2** | ACL | P017 | Defense RLHF |
| **Top-2** | AAAI | P032 | Desinformation medicale |
| **Top-2** | EMNLP Findings | P043 | Benchmark |
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
2026  *** ESCALADE ***
  |   ATTAQUES: P036 LRM autonome 97% (Nature), P039 1-prompt unalign (Microsoft),
  |             P044 fuzzing 99% (Unit 42), P045 system prompt poisoning
  |   DEFENSES: P038 InstruCoT >90%, P041 Magic-Token 8B>671B,
  |             P042 PromptArmor <1% FPR, P046 ADPO VLM
  |   MEDICAL: P035 MPIB 9,697 instances, P040 emotional manipulation
  |   BENCHMARKS: P037 survey 3D, P043 JBDistill renewable
       |
2026+ *** THESE AEGIS ***
       Framework delta-0 a delta-3, 66 techniques, Sep(M) en production
```

---

## 6. Matrice papers x delta-layers (vue synthetique)

| Paper | delta-0 | delta-1 | delta-2 | delta-3 | Medical |
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
| P035 | . | . | . | X | X |
| P036 | X | . | . | . | . |
| P039 | X | . | . | . | . |
| P042 | . | X | X | . | . |
| P044 | . | . | X | . | . |

Legende : X = concerne directement, . = non traite

**Observation** : delta-0 est le plus etudie (18 papers), delta-3 le moins (8 papers). Le medical est couvert par 9 papers. L'intersection {delta-3 AND medical} = seulement 2 papers (P029, P035), confirmant le gap identifie.

---

## 7. Statistiques du corpus

| Dimension | Valeur |
|-----------|--------|
| Total papers | 46 |
| Papers Phase 1 (2023-2025) | 34 |
| Papers Phase 2 (2026) | 12 |
| Domaine attaque | 12 (26.1%) |
| Domaine defense | 14 (30.4%) |
| Domaine medical | 9 (19.6%) |
| Domaine benchmark/survey | 5 (10.9%) |
| Domaine embeddings | 5 (10.9%) |
| Domaine comportement modele | 4 (8.7%) |
| Top venue (ICLR, Nature, NDSS, JAMA, NAACL, ACL, AAAI, EMNLP) | 10 (21.7%) |
| Formules extraites | 22 |
| Techniques d'attaque | 18 |
| Modeles de menace | 34 |

Note : Certains papers apparaissent dans plusieurs domaines (ex: P034 = defense + medical).

---

*Agent Scientist -- CARTE_BIBLIOGRAPHIQUE.md*
*46 papers, 6 clusters, 5 tiers de venues, timeline 2019-2026*
*Derniere mise a jour: 2026-04-04*
