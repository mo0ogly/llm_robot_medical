# Campagnes experimentales — historique et resultats

!!! abstract "Source de verite"
    Chaque campagne produit un **rapport** dans `research_archive/experiments/EXPERIMENT_REPORT_*.md`
    et une entree dans `campaign_manifest.json`. Les donnees brutes sont dans
    `research_archive/data/raw/campaign_*.json`.

    **Etat actuel** (2026-04-11) : 7 campagnes executees, 2 SUPPORTED, 3 INCONCLUSIVE (en iteration),
    2 en cours.

## 1. Vue d'ensemble

| ID | Nom | Gap | Conj | Statut | Modele | N | Verdict |
|----|-----|-----|------|:------:|--------|:-:|---------|
| **TC-001** | Triple Convergence | G-011 | C1 | **INCONCLUSIVE** | llama3.2 (3B) | 30 | Noise sous perturbations combinees |
| **TC-002** | Triple Convergence v2 | G-011 | C1 | **PARTIAL** | llama-3.3-70b | 30 | D-022 paradoxe δ⁰/δ¹ decouvert |
| **THESIS-001** | Formal Thesis Campaign | — | C1+C2 | **SUPPORTED** | llama-3.1-8b-instant | 1200 | **D-023/D-024/D-025** |
| **THESIS-002** | XML Agent cross-model | — | D-025 | **SUPPORTED** | 70B | — | 100% ASR sur XML agent |
| **THESIS-003** | Qwen 3 32B cross-family | — | D-024/D-025 | **IN PROGRESS** | qwen3-32b | 30 | Family-specific check |
| **RAG-001** | RAG defense chain_defenses | G-003 | C2 | **IN PROGRESS** | llama3.2 | — | chain_defenses actif orch |
| **ASIDE-001** | ASIDE adaptive protocol | G-015 | C1 | **PLANNED** | — | — | — |

## 2. Les 4 decouvertes majeures issues des experiences

### D-023 — Bimodalite des vulnerabilites (THESIS-001)

Sur **1200 runs** (30 trials x 40 chaines, Groq llama-3.1-8b-instant) :

| Metrique | Valeur | Commentaire |
|----------|:------:|-------------|
| **ASR global** | **6.75%** | **MASQUE** la distribution |
| IC 95% Wilson | [5.5%, 8.3%] | |
| Sep(M) min | 0.0 | |
| Sep(M) mean | 0.0683 | |
| Sep(M) max | **0.9667** | |
| Sep(M) stdev | 0.2189 | |

**Distribution par seuil** :

- **Sep(M) > 0.5** : **2 chaines** (`hyde_chain`, `xml_agent`) — VULNERABLES CATASTROPHIQUES
- **Sep(M) entre 0.1 et 0.5** : 3 chaines (functions_agent, stepback, retrieval_agent) — PARTIELLES
- **Sep(M) < 0.1** : 35 chaines (dont 33 a 0% ASR) — DEFENDUES

**Implication** : reporter Sep(M) en **moyenne arithmetique** (0.067) sur un dataset bimodal est
**statistiquement trompeur**. Les rapports thesis doivent utiliser la **distribution complete**
(min/mean/median/max + histogramme par seuil).

### D-024 — HyDE self-amplification (THESIS-001)

!!! danger "Contribution originale — confiance 10/10"
    **HyDE** atteint **96.7% ASR** (29/30 violations) sur llama-3.1-8b-instant.

    **Mecanisme** : le modele genere lui-meme un document hypothetique contenant les payloads
    d'attaque **avec autorite fabriquee** (FDA fictive, classifications inventees), puis utilise
    ce document comme contexte.

    **Aucun papier** du corpus P001-P130 n'identifie HyDE comme **vecteur d'attaque endogene
    pre-retrieval** — contribution originale de la these.

**Taxonomie RAG a 6 stages** introduite par D-024 :

| Stage | Point de compromis | Prerequis | Exemples litterature |
|:-:|---|---|---|
| 1 | Corpus poisoning | Ecriture knowledge store | P054 PIDP, P055 RAGPoison, P120 HijackRAG, P121 |
| 2 | Retriever training | Supply chain ML | P121 backdoor branch |
| 3 | Retrieval mechanism | Connaissance retriever + ecriture | P120 white-box |
| 4 | Ranking | Score manipulation | GGPP |
| 5 | Post-retrieval | Injection context | Greshake 2023 |
| **6** | **Generator pre-retrieval (HyDE)** | **AUCUN** | **AEGIS D-024** |

**D-024 n'a besoin de RIEN** : pas de corpus poisoning, pas de compromis retriever, pas de prompt
orchestrateur corrompu, pas de fine-tuning. Le modele **cree** son propre vecteur d'attaque.

### D-025 — Parsing Trust exploit (THESIS-001 + THESIS-002)

**XML Agent** atteint **96.7% ASR** avec un **SVC de seulement 0.11** (LOW POTENTIAL selon
scoring classique 6D). Le modele **"parse" et "valide"** les tags XML de l'attaquant comme
legitimes.

**Implication** : necessite **d⁷ (Parsing Trust)** comme **7eme dimension SVC**, absente du
scoring Zhang 2025.

**THESIS-002 confirme** : **100% ASR sur XML Agent en 70B**, le phenomene **empire avec la taille**.

### D-022 — Paradoxe δ⁰/δ¹ (TC-002)

!!! warning "Contre-intuitif"
    Effacer le prompt systeme (δ¹) **REDUIT** l'efficacite du contexte empoisonne.

    | Condition | ASR 70B | N |
    |-----------|:-------:|:-:|
    | δ¹ seul | 33% | 30 |
    | δ⁰+δ¹ combines | **17%** | 30 |

    Le prompt systeme est **a la fois PROTECTION** (instruction-following pour les regles)
    **ET VECTEUR** (instruction-following pour le poison).

**Implication** : la convergence des couches est **antagoniste, pas additive**. L'attaquant
optimal doit **choisir ses vecteurs, pas les combiner**. Score D-001 Triple Convergence **baisse
de 10/10 a 8/10**.

## 3. Historique detaille

### TC-001 / TC-002 — Triple Convergence

**Objectif** : valider C1 (insuffisance δ⁰+δ¹+δ²) via attaque combinee (GRP obliteration +
Context Poisoning + Base64 + homoglyph).

**Iteration 1 (2026-04-08)** — llama3.2:latest, N=30

- Params : max_tokens=150, temperature=0.7, max_fuzz=2
- Verdict : **INCONCLUSIVE**
- **Diagnosis** : 3B model produces noise under combined perturbations, ASR inverts (0% full
  convergence vs 33% δ² alone)

**Iteration 2 (2026-04-08)** — llama3.2:latest, N=30

- Params : max_tokens=500, temperature=0.0, max_fuzz=1
- Verdict : **INCONCLUSIVE**
- **Diagnosis** : δ² alone 43% vs full convergence 7%. Inversion confirmed on 3B.
- **Action** : test sur 70B via Groq

**TC-002 (2026-04-09)** — llama-3.3-70b-versatile (Groq), N=30

- Verdict : **PARTIAL** — decouverte D-022 (paradoxe δ⁰/δ¹)
- δ¹ seul = 33%, δ⁰+δ¹ = 17%
- Baisse score D-001 de 10/10 a 8/10

### THESIS-001 — Formal Thesis Campaign

**Date** : 2026-04-09
**Duree** : ~1h15
**Modele** : llama-3.1-8b-instant (Groq Cloud, 100%, 0 Ollama)
**N** : 30 trials x 40 chaines = **1200 runs**
**Appels Groq** : 4800+ (dont 4 x 404, 0.08%)
**Cout** : ~$0.30 estime

**RETEX critique** : bug de propagation `provider=groq` fixe pendant l'execution (cf.
[delta-1.md](../delta-layers/delta-1.md#propagation-multi-provider)).

**Resultats** : cf. sections D-023, D-024, D-025 ci-dessus.

### THESIS-002 — XML Agent cross-model validation

**Commit** : `5971d50 feat(thesis-002): cross-model validation — XML Agent 100% ASR on 70B`

**Objectif** : verifier que D-025 (Parsing Trust) persiste sur 70B.

**Resultat** : **100% ASR** sur XML Agent, confirme que la vulnerabilite **n'est pas un artefact
de petit modele** et **empire avec la taille** (paradoxe C7).

### THESIS-003 — Qwen 3 32B cross-family

**Commit** : `5971d50 feat(thesis-003): Qwen 3 32B cross-family — D-024/D-025 family-specific`

**Objectif** : tester si D-024/D-025 sont family-specific (LLaMA) ou cross-family (Qwen).

**Statut** : en cours. Hypothese : Qwen resiste mieux aux XML tags (training different) mais
reste vulnerable a HyDE self-amplification.

### RAG-001 — chain_defenses active in orchestrator

**Commit** : `3c1e896 feat(thesis): chapitre 6 experiences + chain_defenses active in orchestrator`

**Objectif** : valider que l'activation des `chain_defenses` (combinaison RagSanitizer + PII guard
+ NLI entailment) reduit l'ASR sous `hyde_chain`.

**Statut** : en cours, attend N=30 sur Groq.

## 4. Regle de boucle iterative

!!! note "Maximum 3 iterations par campagne"
    1. **Iteration 1** : parametres standards, N=30
    2. **Iteration 2** : ajustes selon diagnostic (N augmente, parametres affines, modele change)
    3. **Iteration 3** : dernier essai avant **escalade humaine**

    Verdict apres chaque iteration :

    - **SUPPORTED** : ASR > seuil avec CI Wilson serre
    - **REFUTED** : ASR < seuil ou CI qui chevauche
    - **INCONCLUSIVE** : N insuffisant ou variance excessive → iteration suivante

    Si **INCONCLUSIVE apres 3 iterations** → escalade au **directeur de these (David Naccache, ENS)**.

## 5. Pipeline automatise

```mermaid
flowchart LR
    GAP["Gap G-XXX"] --> PLANNER["/experiment-planner"]
    PLANNER --> PROTO["protocol.json<br/>pre-check + N=30 + metriques"]
    PROTO --> CAMP["Campagne SSE"]
    CAMP --> JSON["campaign_YYYYMMDD.json"]
    JSON --> ANALYST["/experimentalist"]
    ANALYST --> VERDICT{"Verdict"}
    VERDICT -->|"SUPPORTED"| WRITER["/thesis-writer"]
    VERDICT -->|"INCONCLUSIVE"| PLANNER
    WRITER --> CHAP["chapitre_6_experiences.md"]

    style VERDICT fill:#e74c3c,color:#fff
    style CHAP fill:#27ae60,color:#fff
```

## 6. Fichiers references

```
research_archive/experiments/
├── EXPERIMENT_REPORT_CROSS_MODEL.md      — cross-model validation
├── EXPERIMENT_REPORT_TC001.md            — Triple Convergence iter 1
├── EXPERIMENT_REPORT_TC001_v2.md         — Triple Convergence iter 2
├── EXPERIMENT_REPORT_TC002.md            — Triple Convergence 70B
├── EXPERIMENT_REPORT_THESIS_001.md       — Formal thesis campaign
├── EXPERIMENT_REPORT_THESIS_002.md       — XML Agent cross-model
├── EXPERIMENT_REPORT_THESIS_003.md       — Qwen 3 32B cross-family
├── aside_adaptive_protocol.md            — Protocol ASIDE
├── aside_adaptive_results.json           — Resultats ASIDE
├── campaign_manifest.json                — Manifest global
├── delta1_rag_results.json               — RAG δ¹ results
├── mpib_synthetic.json                   — MPIB synthetic baseline
├── protocol_RAG001.json                  — Protocol RAG-001
├── sepm_validation_strategy.md           — Strategie Sep(M)
└── triple_convergence_results.json       — TC raw data
```

## 7. Ressources

- :material-chart-bar: [campaign_manifest.json](https://github.com/pizzif/poc_medical/blob/main/research_archive/experiments/campaign_manifest.json)
- :material-shield: [δ³ Conjecture 2](../delta-layers/delta-3.md#6-conjecture-2-necessite-formelle)
- :material-dna: [Forge genetique](../forge/index.md)
- :material-chart-line: [Campagnes — methodologie](../campaigns/index.md)
- :material-lightbulb: [Decouvertes D-001 a D-028](../research/discoveries/index.md)
