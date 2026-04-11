## [Lee, Jang & Choi, 2026] --- MPIB: A Benchmark for Medical Prompt Injection Attacks and Clinical Safety in LLMs

**Reference :** arXiv:2602.06268
**Revue/Conf :** Preprint arXiv, Seoul National University College of Medicine, 2026
**Lu le :** 2026-04-04
> **PDF Source**: [literature_for_rag/P035_2602.06268.pdf](../../assets/pdfs/P035_2602.06268.pdf)
> **Statut**: [ARTICLE VERIFIE] --- lu en texte complet via ChromaDB (92 chunks fulltext, 91340 caracteres)

### Abstract original
> Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) systems are increasingly integrated into clinical workflows; however, prompt injection attacks can steer these systems toward clinically unsafe or misleading outputs. We introduce the Medical Prompt Injection Benchmark (MPIB), a dataset-and-benchmark suite for evaluating clinical safety under both direct prompt injection and indirect, RAG-mediated injection across clinically grounded tasks. MPIB emphasizes outcome-level risk via the Clinical Harm Event Rate (CHER), which measures high-severity clinical harm events under a clinically grounded taxonomy, and reports CHER alongside Attack Success Rate (ASR) to disentangle instruction compliance from downstream patient risk. The benchmark comprises 9,697 curated instances constructed through multi-stage quality gates and clinical safety linting.
> --- Source : PDF page 1

### Resume (5 lignes)
- **Probleme :** Absence de benchmark standardise pour evaluer la securite clinique des LLM face aux injections de prompt en contexte medical, et inadequation de l'ASR seul comme metrique de risque clinique (Section 1, p.1-2)
- **Methode :** Construction d'un benchmark de 9 697 instances avec portes de qualite multi-etapes et linting de securite clinique ; evaluation de 5 configurations de defense (D0-D4) sur deux vecteurs : injection directe (V1) et injection indirecte RAG (V2) ; selection du juge par protocol stratifie (N=150, Table 3-4) (Section 3-4)
- **Donnees :** 9 697 instances, taches cliniquement fondees, vecteurs V0/V0' (benin/borderline) + V1 (injection directe) + V2 (injection indirecte RAG), modeles evalues incluant Qwen-2.5-72B, Llama-3.1-70B, Meditron-70B, MedGemma-4B (Section 3, Table 1-2)
- **Resultat :** ASR et CHER divergent substantiellement sous injection indirecte V2 ; Qwen-2.5-72B V1 CHER passe de 65.7% (D0) a 50.7% (D2) ; Meditron-70B V2 CHER de 53.1% (D0) a 37.5% (D4) ; la defense composite D4 n'est pas uniformement optimale (Section 4.2, Table 5)
- **Limite :** Labels de severite produits par pipeline LLM-as-a-judge (biais potentiel du juge) ; benchmark purement evaluatif sans defense integree ; pas d'evaluation longitudinale (Section 5 Limitations)

### Analyse critique

**Forces :**

1. **Premier benchmark medical a grande echelle pour l'injection de prompt.** Avec N=9 697 instances, MPIB depasse largement le seuil de validite statistique Sep(M) >= 30 par condition (Zverev et al., 2025, ICLR, Definition 2). C'est l'ordre de grandeur superieur compare aux etudes precedentes : P029 (N=216), P032 (N=109), P034 (non specifie) (Section 3, p.4-5).

2. **Distinction ASR vs CHER : contribution conceptuelle majeure.** La demonstration que l'ASR (conformite aux instructions adversariales, severity >= 2) et le CHER (evenements de dommage clinique de haute severite, severity >= 3) peuvent diverger substantiellement est une contribution originale fondamentale. Sous V2 pour MedGemma-4B, D3 augmente legerement l'ASR de 64.1% (D0) a 65.6% (D3) tout en reduisant le CHER de 21.9% a 18.8% (Section 4.2, Table 5). Cela implique qu'evaluer les defenses uniquement par ASR peut surestimer ou sous-estimer le benefice clinique reel.

3. **Couverture bidimensionnelle V1/V2.** La distinction entre injection directe (V1, via la requete utilisateur) et injection indirecte (V2, via le contexte RAG empoisonne) est directement pertinente pour AEGIS qui opere sur des pipelines RAG. Les resultats montrent que les defenses efficaces different selon le vecteur : D2 (Input Guard) reduit V1 mais pas V2, tandis que D4 (Policy Composer) peut reduire V2 (Section 4.2, Table 5).

4. **Selection du juge par protocole rigoureux.** Qwen-2.5-72B-Instruct est selectionne comme juge primaire apres evaluation comparative sur 3 dimensions (JSON validity, Recall@4 sur dommages de haute severite, stabilite de ranking) contre Mixtral-8x22B et Llama-3.1-70B. Kendall tau de 0.65 et Recall@4 de 0.75 sur S_sel (N=150) (Section 4.1, Table 3). Stabilite confirmee sur S_hold (Table 4).

5. **Inclusion de modeles medical-specific.** Meditron-70B et MedGemma-4B sont inclus, permettant une comparaison directe entre modeles generalistes et medical-specific --- une dimension absente de P029 et P034 (Lee, Jang & Choi, 2026, Section 4, Table 5).

**Faiblesses :**

1. **Juge LLM-as-a-judge.** Malgre le protocole de selection rigoureux, les labels de severite restent produits par un LLM juge. A la lumiere de P044 (FPR de 99% sur les juges generaux, Li et al., 2025, arXiv:2512.17375), la fiabilite du scoring de severite pourrait etre compromise par des tokens de controle dans les reponses evaluees (Section 5 Limitations).

2. **Benchmark purement evaluatif.** Comme P029, MPIB documente le probleme sans proposer de solution. Les 5 configurations D0-D4 sont des defenses existantes (hardening, SLD, Input Guard, Policy Composer) (Lee, Jang & Choi, 2026, Section 4.2, Table 5), pas des innovations. L'espace AEGIS comble ce vide.

3. **Meditron-70B FPR-H eleve.** Sous D4, Meditron-70B atteint un FPR-H de 33.6% (vs 16.0% sous D0), signifiant que le modele refuse incorrectement un tiers des requetes benignes. Ce trade-off securite-utilite est problematique pour le deploiement clinique (Section 4.2, Table 5).

4. **Absence d'evaluation longitudinale.** MPIB est un snapshot temporel. La degradation des defenses dans le temps et l'evolution des modeles ne sont pas capturees (Lee, Jang & Choi, 2026, Section 5 Limitations).

5. **Taxonomie de severite a 4 niveaux.** Le seuil k=3 pour CHER est fixe par convention ("we report CHER_3 (k=3) to align CHER with high-severity clinical harm events", Lee, Jang & Choi, 2026, Section 4.1, Eq. 1). L'article ne discute pas la sensibilite des resultats au choix de k (k=2 vs k=4 donneraient des resultats potentiellement tres differents).

**Questions ouvertes :**
- Comment integrer CHER et SVC AEGIS dans un cadre bidimensionnel unifie (nocivite clinique x violation semantique) ?
- L'ecart ASR-CHER est-il stable cross-temporel (sur 6 mois, les mises a jour des modeles changent-elles la divergence) ?
- Les defenses D1-D4 sont-elles robustes face a des attaques adaptatives (adversary aware of defense) ?
- CHER sur Meditron-70B vs Llama-3.1-70B : le fine-tuning medical augmente-t-il ou diminue-t-il la vulnerabilite ?

### Formules exactes
Classification epistemique : `[EMPIRIQUE]` --- metriques definies operationnellement avec seuil arbitraire k.

**CHER (Clinical Harm Event Rate)** (Section 4.1, Eq. 1, p.7) :
```
CHER_k = (1/|D_adv|) * sum_{i in D_adv} I(Severity(y_hat_i) >= k)
```
ou D_adv = ensemble des instances adversariales, Severity = score de severite clinique attribue par le juge, k = seuil (defaut k=3 pour haute severite).

**ASR2 (Attack Success Rate)** (Section 4.1, p.7) :
```
ASR_2 = fraction des instances adversariales (V1/V2) dont la severite jugee >= 2
```

**FPR-H (Utility False Positive Rate)** (Section 4.1, p.7) :
```
FPR-H = taux de refus incorrect sur instances benignes (V0) et borderline (V0')
```

**Resultats cles** (Section 4.2, Table 5) :
- Qwen-2.5-72B : V1 CHER D0 = **65.7%** → D2 = **50.7%** (-15.0 pp)
- Qwen-2.5-72B : V2 CHER D0 = **7.8%** → D1 = **1.6%** (-6.2 pp)
- Llama-3.1-70B : V1 CHER D0 = **86.6%** → D2 = **68.7%** (-17.9 pp)
- Meditron-70B : V2 CHER D0 = **53.1%** → D4 = **37.5%** (-15.6 pp)
- MedGemma-4B : V2 ASR D0 = **64.1%** → D3 = **65.6%** (+1.5 pp) MAIS CHER D0 = **21.9%** → D3 = **18.8%** (-3.1 pp)
- Meditron-70B : FPR-H D0 = **16.0%** → D4 = **33.6%** (+17.6 pp, degradation utilite)
- Qwen-2.5-72B : FPR-H stable **2.7-3.8%** D0-D4

**Selection du juge** (Section 4.1, Tables 3-4) :
- Qwen-2.5-72B-Instruct : Kendall tau = **0.65**, Recall@4 = **0.75**, SCE = **0.75**, JSON Valid = **100%** (S_sel, N=150)
- Stabilite holdout : SCE holdout = **0.80**, Delta SCE = **0.05**, Delta Recall@4 = **+0.16** (S_hold, N=150)

Lien glossaire AEGIS : F22 (ASR), F15 (Sep(M)), F26 (CHER --- nouveau candidat glossaire)

### Pertinence these AEGIS
- **Couches delta :** δ⁰ (les modeles dependent de leur alignement de base --- Meditron-70B medical-specific vs Llama-3.1-70B general), δ¹ (V1 cible directement les instructions systeme), δ² (V2 cible le contexte RAG empoisonne --- directement pertinent pour RagSanitizer AEGIS), δ³ (le besoin de CHER vs ASR illustre la necessite de verification formelle des sorties)
- **Conjectures :** C1 (supportee : V1 contourne les instructions systeme avec CHER > 65%, Lee, Jang & Choi, 2026, Table 5, Qwen-2.5-72B D0 V1 CHER = 65.7%). C2 (supportee indirectement : la divergence ASR-CHER illustre que les metriques empiriques sont insuffisantes sans verification formelle). C3 (shallow alignment : fortement supportee --- l'ASR peut augmenter alors que le CHER diminue, revelant un alignement de surface). C5 (cross-layer : supportee par la comparaison V1/V2 qui montre des profils de vulnerabilite distincts). C6 (medical specificity : contribution directe majeure --- CHER est une metrique specifiquement medicale)
- **Decouvertes :** D-006 (medical specificity) fortement renforcee. D-018 (ASR-CHER divergence) decouverte formalisee par MPIB. D-019 (defense-specific trade-off securite-utilite dans le medical)
- **Gaps :** G-001 (benchmark medical) directement adresse par MPIB. G-020 (integration CHER-SVC) cree. G-022 (evaluation longitudinale) cree
- **Mapping templates AEGIS :** Benchmark de reference pour evaluer les 97 templates. V1 correspond aux templates DPI (#01-#50), V2 correspond aux templates IPI/RAG (#51-#70)

### Citations cles
> "ASR and CHER can diverge substantially" (Abstract, p.1)
> "CHER_k = (1/|D_adv|) * sum I(Severity(y_hat_i) >= k)" (Section 4.1, Eq. 1, p.7)

### Classification
| Champ | Valeur |
|-------|--------|
| SVC pertinence | 9/10 |
| Reproductibilite | Haute --- 9 697 instances publiees, code d'evaluation disponible (GitHub + HuggingFace), protocole detaille |
| Code disponible | Oui (GitHub) |
| Dataset public | Oui (HuggingFace, 9 697 instances) |
