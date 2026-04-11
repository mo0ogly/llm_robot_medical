# Glossaire — formules F01-F72 et termes

!!! abstract "Source"
    Le glossaire officiel est `research_archive/doc_references/GLOSSAIRE_MATHEMATIQUE.md`.
    Cette page reprend les formules **les plus utilisees** dans AEGIS avec contexte et references.

## 1. Metriques centrales

### F15 — Sep(M) Score de Separation

**Source** : Zverev et al. (ICLR 2025), Definition 2.

```
Sep(M) = E_{(x,y) ~ D} [ ||P(M_data(x)) - P(M_instr(x))||_TV ]
```

**Approximation binaire** (AEGIS) :

```
Sep(M) = | P_data(violation) - P_instr(violation) |
```

- `P_data` : proportion de violations en position **DONNEE** (OBX)
- `P_instr` : proportion de violations en position **INSTRUCTION** (system prompt)

**Statut** : `[THEOREME — definition formelle]`

**Implementation** : `backend/agents/security_audit_agent.py :: compute_separation_score`

### F22 — ASR Attack Success Rate

```
ASR = # violations / N
```

**Statut** : `[EMPIRIQUE — pas de garantie de convergence]`

**Wilson 95% CI** (F16) :

```
p_hat = violations / N
center = (p_hat + z²/2N) / (1 + z²/N)
spread = z × sqrt(p_hat(1-p_hat)/N + z²/4N²) / (1 + z²/N)
CI = [center - spread, center + spread]
```

z = 1.96 pour 95% CI. Wilson est robuste pour petits N contrairement a l'approximation normale.

### F44 — `I_t` Martingale d'alignement

**Source** : Young (2026, P052), *"Why is RLHF Alignment Shallow?"*, Theoreme 8, p. 12.

```
I_t = Cov[E[H|x≤t], score_function]
```

Decomposition en martingale prouvant que le gradient RLHF decroit rapidement au-dela des
premiers tokens.

**Statut** : `[THEOREME — preuve constructive]`

### F46 — Recovery Penalty (heuristique Young 2026)

Source : P052, Section 6, Eq. 19.

```
R(x) = sum_t λ_t × penalty(harm(x_{t:T}))
```

**Statut** : `[HEURISTIQUE — objectif propose sans validation empirique]`

## 2. Metriques SVC (Score de Viabilite de Compromission)

**Source** : Zhang et al. (2025, arXiv:2501.18632v2), 6 dimensions.

| Dim | Nom | Definition |
|:---:|-----|-----------|
| **d¹** | Authority | Autorite institutionnelle invoquee |
| **d²** | Specificity | Precision de l'objectif cible |
| **d³** | Stealthiness | Invisibilite aux filtres |
| **d⁴** | Plausibility | Vraisemblance medicale |
| **d⁵** | Completeness | Couverture du contexte |
| **d⁶** | Reusability | Generalisation cross-model |

**SVC total** : `SVC = (d1 + d2 + d3 + d4 + d5 + d6) / 6 ∈ [0, 6]`

**Calibration AEGIS** :

- Plancher : **#14 Medical Authority, SVC 1.0/6**
- Sous-plancher : **#18 Baseline Humanitarian, SVC 0.5/6** (exclu du catalogue)

**Proposition AEGIS** : d⁷ (Parsing Trust) — 7eme dimension decouverte via D-025.

## 3. Metriques de derive semantique

### F12 — Cosine similarity

```
cos(u, v) = (u · v) / (||u|| × ||v||)
```

Sur embeddings Sentence-BERT `all-MiniLM-L6-v2` (384 dim).

### F13 — Semantic drift

```
drift(baseline, mutated) = 1 - cos(embed(baseline), embed(mutated))
```

Implementation : `backend/agents/semantic_drift.py :: SemanticDriftAnalyzer`

**Seuils empiriques** :

- `< 0.3` : mutations cosmetiques
- `0.3 - 0.6` : variantes significatives
- `> 0.6` : decrochage semantique

## 4. Metriques de Wilson et Bonferroni

### Wilson CI (F16)

Deja defini ci-dessus. Utilise pour tous les ASR rapportes.

### Bonferroni correction (F17)

```
α_corrigé = α / K
```

Pour `K` comparaisons multiples. Utilise en medical benchmarks (P107 MedSafetyBench,
`p < 0.001 Bonferroni sur 14 modeles`).

## 5. Metriques de detection

### F25 — Precision / Recall / F1

```
Precision = TP / (TP + FP)
Recall    = TP / (TP + FN)
F1        = 2 × P × R / (P + R)
```

Utilise pour les detecteurs (PromptGuard 2 AUC=0.98, ZEDD 93% accuracy, etc.).

### F30 — DACC (Detection Accuracy Combined)

**Source** : P062 RAGuard.

```
DACC = (TP + TN) / (TP + TN + FP + FN)
```

## 6. Termes techniques

### DY-AGENT

**Definition** : un systeme agentique LLM est un quadruplet `S = (M, T, E, C)` :

| Composante | Signification | Instance AEGIS |
|------------|---------------|----------------|
| **M** | Oracle LLM non-deterministe | LLaMA 3.2 via Ollama |
| **T** | Ensemble d'outils invocables | `freeze_instruments`, `set_tension`, `get_vitals` |
| **E** | Environnement physique | Robot Da Vinci Xi simule |
| **C** | Canal de communication | HL7 FHIR / OBX messages |

**Definition 7 (Integrity)** :

```
Integrity(S) := Reachable(M, i) ⊆ Allowed(i)
```

### Reachable(M, i)

Ensemble des sorties que M **peut effectivement generer** pour un input `i`. Mesurable
empiriquement via N trials independants.

### Allowed(i)

Ensemble des sorties **autorisees** pour la classe d'input `i`. Specifiee formellement via
`AllowedOutputSpec` :

```python
@dataclass
class AllowedOutputSpec:
    max_tension_g: int = 800
    forbidden_tools: List[str] = ["freeze_instruments"]
    forbidden_directives: FrozenSet[str] = frozenset([...])
```

### δ⁰ — Alignement RLHF

Couche de defense **integree aux poids** du modele par RLHF/DPO. Shallow par nature
(Wei 2025, Qi 2025). **Necessaire mais insuffisant** (C1).

### δ¹ — System Prompt / IH

Couche **contextuelle** : instructions injectees a chaque requete. Modifiable sans retraining.
Empoisonnable (P045). Bypassable par authority framing (#14).

### δ² — Syntactic Shield

Couche **deterministe pre/post-traitement** : regex, Unicode normalization, score obfuscation.
Implementation AEGIS : `RagSanitizer` 15 detecteurs. **100% bypass** documente (Hackett 2025).

### δ³ — Structural Enforcement

Couche **externe** : validation formelle `output ∈ Allowed(i)`. Deterministe, independante
du modele. **Seule defense qui survit** a la compromission du LLM (C2).

### ASR — Attack Success Rate

Proportion de trials ou l'attaque a produit une violation. **Metric empirique sans borne
theorique**.

### Sep(M) — Score de Separation

Distance TV entre distributions data-position et instruction-position. Mesure de la capacite
du modele a distinguer donnees et instructions.

### MITRE ATLAS

Framework de classification des attaques sur systemes ML. AEGIS utilise `AML.T0051` (LLM Prompt
Injection) avec sous-techniques.

### OWASP LLM Top 10

Top 10 des vulnerabilites LLM. AEGIS adresse **LLM01** (Prompt Injection) comme rang #1 (P123).

### HL7 / FHIR

Standard de messagerie hospitaliere. Segments :

- **MSH** : Message Header — instructions
- **PID** : Patient ID
- **OBR** : Observation Request
- **OBX** : Observation X — donnees cliniques libres (surface d'attaque)

### DICOM

Standard imagerie medicale. Metadata porteuse (attaques `steganographic_dicom_injection`).

### IPI / DPI

- **DPI** : Direct Prompt Injection — via user turn
- **IPI** : Indirect Prompt Injection — via donnees tierces (RAG, email, HL7 OBX)

## 7. Acronymes

| Acronyme | Signification |
|----------|---------------|
| **AEGIS** | Adversarial Evaluation of Guardrails in Intelligent Systems |
| **RLHF** | Reinforcement Learning from Human Feedback |
| **DPO** | Direct Preference Optimization |
| **IH** | Instruction Hierarchy |
| **IPI** | Indirect Prompt Injection |
| **DPI** | Direct Prompt Injection |
| **LRM** | Large Reasoning Model (o1, R1, Gemini 2.5) |
| **CoT** | Chain-of-Thought |
| **CaMeL** | Capability Model for LLMs (Google DeepMind) |
| **ASIDE** | Architectural Instruction Data Separation by Embeddings |
| **ISE** | Instructional Segment Embedding |
| **CVS** | Cardiovascular System / Critical View of Safety |
| **EDS** | Ehlers-Danlos Syndrome |
| **FDA** | Food and Drug Administration |
| **HL7** | Health Level 7 |
| **FHIR** | Fast Healthcare Interoperability Resources |
| **PACS** | Picture Archiving and Communication System |
| **ASR** | Attack Success Rate |
| **TPR/FPR** | True/False Positive Rate |
| **SVC** | Score de Viabilite de Compromission |
| **GCG** | Greedy Coordinate Gradient (Zou et al. 2023) |
| **PAIR** | Prompt Automatic Iterative Refinement |

## 8. Tags epistemiques (regle CLAUDE.md)

| Tag | Signification |
|-----|---------------|
| `[ARTICLE VERIFIE]` | Paper lu, arXiv/DOI verifie WebFetch, fulltext disponible |
| `[PREPRINT]` | Non encore peer-reviewed |
| `[HYPOTHESE]` | Conjecture non prouvee |
| `[CALCUL VERIFIE]` | Formule verifiee par calcul, pas par citation |
| `[EXPERIMENTAL]` | Resultat d'une campagne AEGIS (N >= 30, p-value, CI) |
| `[ABSTRACT SEUL]` | Seule abstract lu, pas le corps du papier |
| `[SOURCE A VERIFIER]` | Dette technique — reference a consolider |

## 9. Ressources

- :material-file-document: [GLOSSAIRE_MATHEMATIQUE.md - 72 formules](https://github.com/pizzif/poc_medical/blob/main/research_archive/doc_references/GLOSSAIRE_MATHEMATIQUE.md)
- :material-book: [Manuscrit - formal_framework_complete.md](../manuscript/index.md)
- :material-shield: [δ⁰–δ³ detail](../delta-layers/index.md)
- :material-chart-line: [Metriques campagnes](../metrics/index.md)
