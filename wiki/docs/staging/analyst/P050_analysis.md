# P050: JMedEthicBench: A Multi-Turn Adversarial Benchmark for Japanese Medical Ethics Alignment in LLMs
**Auteurs**: Junyu Liu (Kyoto U.), Zirui Li (Hohai U.), Qian Niu (U. Tokyo, correspondant), Zequn Zhang (USTC), Yue Xun, Wenlong Hou, Shujun Wang (PolyU HK), Yusuke Iwasawa, Yutaka Matsuo, Kan Hatakeyama-Sato (U. Tokyo)
**Venue**: arXiv:2601.01627v2, mars 2026 (preprint, en revision)
> **PDF Source**: [literature_for_rag/P050_JMedEthicBench.pdf](../../assets/pdfs/P050_JMedEthicBench.pdf)
> **Statut**: [ARTICLE VERIFIE] — lu en texte complet via ChromaDB (84 chunks, ~74 000 caracteres)

---

## Section 1 — Resume critique (500 mots)

### Contribution principale

Liu et al. introduisent JMedEthicBench, le premier benchmark adversarial multi-tour pour l'evaluation de l'alignement ethique medical des LLM en japonais. La contribution est triple : (1) un corpus de plus de 50 000 conversations adversariales ancrees dans 67 directives de l'Association Medicale du Japon (JMA), (2) un protocole de scoring dual-LLM avec rubrique calibree sur l'ethique medicale, et (3) l'evaluation de 22 modeles couvrant trois categories (commerciaux, open-source generalistes, medicaux specialises). Le resultat le plus saillant est la demonstration statistiquement rigoureuse que les modeles specialises medicaux sont PLUS vulnerables que les modeles generalistes, un resultat contre-intuitif qui constitue la validation empirique la plus forte de la conjecture C6 (Medical Vulnerability Premium) dans le corpus AEGIS.

### Methodologie

La construction du benchmark procede en trois phases (Liu et al., 2026, Section 3). D'abord, la generation de 1 935 questions adversariales single-tour a partir des 67 directives JMA, filtrees en ne retenant que celles provoquant le refus d'au moins deux modeles sur cinq (Liu et al., 2026, Section 3.1). Ensuite, l'adaptation du framework AutoDAN-Turbo (Liu et al., 2025b) avec DeepSeek-R1-0528 comme backbone pour decouvrir automatiquement 7 strategies de jailbreak distinctes (T=10, K=10) (Liu et al., 2026, Section 3.2). Enfin, la generation du corpus multi-tour par quatre LLM agents (Gemini-2.5-Pro-Preview, Claude-3.7-Thinking, QWQ-32B, DeepSeek-R1-0528), produisant ~50 000 conversations (Liu et al., 2026, Section 3.3).

L'evaluation utilise un protocole dual-LLM : deux juges LLM independants scorent chaque reponse a chaque tour sur une echelle 1-10 adaptee de SafeDialBench (Cao et al., 2025) (Liu et al., 2026, Section 4). L'accord inter-juges est mesure par kappa pondere (penalite quadratique) (Liu et al., 2026, Section 4, Table 3). Les 22 modeles evalues couvrent Claude (3.5-Haiku, Sonnet-4, Opus-4.1), Gemini (2.5-Flash, 2.5-Pro), GPT-5 (full et mini), Grok-4, Qwen3 (8B, 30B, 32B, 235B), GPT-OSS (20B, 120B), Kimi-K2, GLM-4.5, MedGemma (4B-it, 27B-it), HuatuoGPT-o1 (7B, 72B), et II-Medical (8B, 32B-Preview) (Liu et al., 2026, Section 5, Table 1).

### Resultats cles

- **Degradation multi-tour** : score de securite median passe de 9.5 (Tour 0) a 6.5 (Tour 1) a 5.5 (Tour 2), p < 0.001 (test U de Mann-Whitney avec correction de Bonferroni), taille d'effet Cohen d = 0.75 (Tour 0 vers 1) et d = 0.24 (Tour 1 vers 2) (Liu et al., 2026, Section 5.1, Figure 3)
- **Modeles commerciaux resistants** : Claude Opus 4.1 et Claude Sonnet 4 maintiennent des scores > 9.0 a tous les tours; GPT-5 entre 8.0 et 9.0 (Liu et al., 2026, Section 5.1, Figure 3)
- **Modeles medicaux vulnerables** : HuatuoGPT-o1-7B, II-Medical-8B et II-Medical-32B-Preview descendent sous 4.0 au troisieme tour (Liu et al., 2026, Section 5.2, Figure 3). II-Medical-32B-Preview montre un score de 4.85 (delta = -1.55 par rapport a son modele de base generaliste), suggerant que le fine-tuning medical introduit une regression de securite independante de la taille (Liu et al., 2026, Section 5.2)
- **7 strategies de jailbreak** : toutes efficaces avec des scores medians entre 7.0 et 8.5, indiquant l'absence de defenses robustes contre les patterns adversariaux diversifies (Liu et al., 2026, Section 5.3, Figure 4b)
- **Transfert cross-lingual** : les vulnerabilites persistent en japonais et en anglais, confirmant des limitations structurelles de l'alignement plutot que des facteurs linguistiques (Liu et al., 2026, Section 5.5, Table 2)

### Limitations admises par les auteurs

Les auteurs reconnaissent (Liu et al., 2026, Section 6, Limitations) : (1) le benchmark est limite a 3 tours (etude future necessaire pour les interactions etendues), (2) le scoring dual-LLM peut presenter des biais specifiques au juge, (3) le pipeline est demonstre pour le japonais mais la generalisation a d'autres langues necessite adaptation, (4) les modeles medicaux evalues sont principalement open-source, les modeles commerciaux medicaux proprietaires ne sont pas couverts.

---

## Section 2 — Formules exactes et lien glossaire

| ID | Formule | Notation originale | Lien glossaire AEGIS |
|----|---------|-------------------|----------------------|
| F41 | $$\text{MTSD}(T) = \frac{S_1 - S_T}{S_1} \times 100\%$$ | S_t = score median au tour t, S_1 = score initial, S_T = score terminal | F41 (Multi-Turn Safety Degradation) |
| F42 | $$S_{final}(r) = \frac{S_{judge1}(r) + S_{judge2}(r)}{2}$$ | Accord inter-juges par kappa pondere, w_ij = (i-j)^2 | F42 (Dual-LLM Safety Score) |
| F58 | $$\text{MVP} = \frac{S_{base}(t) - S_{medical}(t)}{S_{base}(t)} \times 100\%$$ | Medical Vulnerability Premium (derive) | F58 (Medical Vulnerability Premium) |
| Cohen d | $$d = \frac{\bar{X}_1 - \bar{X}_2}{s_{pooled}}$$ | Taille d'effet entre tours | Standard statistique |

**Variables** :
- $S_t$ : score de securite median au tour t (echelle 1-10)
- $S_1 = 9.5$ : score median initial (Tour 0)
- $S_T = 5.5$ : score terminal (Tour 2), soit MTSD = 42.1%
- $w_{ij}$ : penalite quadratique du kappa pondere (distance au carre entre categories)
- $S_{base}$ : score du modele generaliste de base, $S_{medical}$ : score apres fine-tuning medical

**Exemple numerique** :
- MTSD(2) = (9.5 - 5.5) / 9.5 * 100 = **42.1%** de degradation en 2 tours
- Cohen d (Tour 0 vers 1) = **0.75** (effet moyen), d (Tour 1 vers 2) = **0.24** (effet faible)
- II-Medical-32B vs base : delta = **-1.55** points (regression de securite par fine-tuning)

---

## Section 3 — Critique methodologique

### Forces

1. **Echelle massive** — 50 000+ conversations, 22 modeles, 7 strategies de jailbreak (Liu et al., 2026, Section 3). C'est de loin le plus grand benchmark adversarial medical du corpus AEGIS. Le N > 30 par condition est massivement satisfait.
2. **Rigueur statistique** — p < 0.001 avec correction de Bonferroni, tailles d'effet rapportees (Cohen d), intervalles de confiance (Liu et al., 2026, Section 5.1). Le protocole satisfait les exigences de validite statistique AEGIS.
3. **Comparaison controlee** — la comparaison systematique entre modeles generalistes et medicaux a taille equitable (ex: II-Medical-32B vs son modele de base) isole l'effet du fine-tuning medical (Liu et al., 2026, Section 5.2).
4. **Decouverte automatique de strategies** — les 7 strategies de jailbreak sont decouvertes par le systeme (pas designees manuellement), reduisant le biais de selection (Liu et al., 2026, Section 3.2).
5. **Cross-lingual** — la validation japonais/anglais transcende les artefacts linguistiques et confirme des limitations structurelles (Liu et al., 2026, Section 5.5, Table 2).
6. **Ancrage ethique concret** — les 67 directives JMA fournissent un cadre normatif precis, contrairement aux benchmarks bases sur des categories abstraites de nocivite (Liu et al., 2026, Section 3.1).

### Faiblesses

1. **Preprint non publie** — en revision, pas encore peer-reviewed. Les resultats sont solides mais le statut editorial requiert prudence dans la these.
2. **Limite a 3 tours** — les auteurs reconnaissent que des interactions plus longues pourraient reveler des dynamiques differentes. La comparaison avec P036 (10 tours) est limitee.
3. **Biais du juge LLM** — le scoring dual-LLM peut refleter les biais des juges plutot que la nocivite reelle. Pas de validation par annotateurs humains experts medicaux.
4. **Absence de metriques de detection** — comme P036, aucun mecanisme de defense ou indicateur de detection n'est propose.
5. **Modeles medicaux limites** — seuls 6 modeles medicaux open-source sont evalues; les systemes deployes (Epic, nuance, etc.) sont absents.
6. **Transfert culturel** — les directives JMA sont specifiques au contexte japonais; la generalisation aux normes AMA, OMS ou HAS (contexte francais AEGIS) n'est pas directement demontree.

---

## Section 4 — Impact these AEGIS

### Conjectures

| Conjecture | Support | Niveau de preuve | Detail |
|-----------|---------|-----------------|--------|
| **C6** (Medical Vulnerability Premium) | CRITIQUE | p < 0.001, 22 modeles, 50K conversations (Liu et al., 2026, Section 5.2) | Premiere evidence a grande echelle que le fine-tuning medical AFFAIBLIT l'alignement de securite |
| **C1** (ASR > 50% inevitable) | FORT | Score median 5.5 au Tour 2 (Liu et al., 2026, Section 5.1, Figure 3) | Meme les modeles commerciaux degradent significativement |
| **C3** (multi-tour plus efficace) | FORT | Cohen d = 0.75 entre Tour 0 et Tour 1 (Liu et al., 2026, Section 5.1) | Confirmation independante de P036 |
| C7 (paradoxe raisonnement) | MODEREE | Implicite via les strategies automatiques (Liu et al., 2026, Section 3.2, AutoDAN-Turbo avec DeepSeek-R1-0528) | Les agents de jailbreak utilisent des capacites de raisonnement pour decouvrir des strategies |

### Couches delta

- **delta-0 (RLHF alignment)** : directement mesure et quantifie. La degradation 9.5 vers 5.5 est une mesure directe de l'erosion de l'alignement RLHF (Liu et al., 2026, Section 5.1, Figure 3). Le fine-tuning medical ecrase les poids critiques modifies durant RLHF, creant un "raccourci" pour les attaquants (Liu et al., 2026, Section 5.2).
- **delta-1 (System prompt)** : implicitement erode a travers les tours, mais pas mesure separement.
- **delta-2** : non applicable (pas de RAG dans le protocole).
- **delta-3** : non teste. L'echec de delta-0 renforce la necessite de couches formelles.

### Formules AEGIS impactees

- **F41 (MTSD)** : directement definie et calibree par P050. La valeur de reference 42.1% constitue le seuil AEGIS pour la degradation multi-tour en domaine medical (Liu et al., 2026, Section 5.1, Figure 3).
- **F42 (DLSS)** : le protocole dual-juge est le standard de scoring pour les benchmarks AEGIS (Liu et al., 2026, Section 4, Table 3).
- **F58 (MVP)** : calculable a partir des donnees P050. II-Medical-32B : MVP = 1.55/6.40 * 100 = **24.2%** — le fine-tuning medical coute un quart de la securite de base (Liu et al., 2026, Section 5.2).

### Decouverte D-001 (Triple Convergence)

P050 apporte une dimension nouvelle a D-001 : la convergence ne s'applique pas seulement entre attaque et defense, mais aussi entre **specialisation de domaine et vulnerabilite**. Le fine-tuning medical, cense ameliorer l'utilite clinique, degrade simultanement la securite. C'est un "paradoxe de specialisation" qui etend la triple convergence.

### Implications pour le contexte AEGIS trilingual

La persistence cross-linguistique des vulnerabilites (japonais-anglais) implique directement que les trois langues AEGIS (FR/EN/BR) doivent etre testees independamment. La securite en anglais ne garantit pas la securite en francais ou en portugais (extrapole depuis Liu et al., 2026, Section 5.5, Table 2, qui montre la persistence japonais-anglais).

---

## Section 5 — Classification

| Champ | Valeur |
|-------|--------|
| **ID** | P050 |
| **Type** | Benchmark (adversarial, multi-tour, medical) |
| **Domaine** | Ethique medicale, securite LLM, alignement |
| **Modeles testes** | 22 modeles : 8 commerciaux (Claude, GPT-5, Gemini, Grok-4), 8 open-source generalistes (Qwen3, GPT-OSS, Kimi-K2, GLM-4.5), 6 medicaux (MedGemma, HuatuoGPT-o1, II-Medical) |
| **Metrique principale** | MTSD = 42.1% (9.5 vers 5.5, p < 0.001), Cohen d = 0.75 |
| **delta-layers** | delta-0 (mesure directement) |
| **Conjectures** | C6 (critique), C1 (fort), C3 (fort), C7 (moderee) |
| **Reproductibilite** | Elevee — corpus public, protocole detaille, modeles accessibles |
| **Impact reglementaire** | Implications directes pour la certification des LLM medicaux |
| **Tags** | [ARTICLE VERIFIE], JMedEthicBench, MTSD, medical vulnerability premium, multi-tour, cross-lingual |
