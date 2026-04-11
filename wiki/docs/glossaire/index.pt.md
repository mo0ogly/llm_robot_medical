# Glossario — formulas F01-F72 e termos

!!! abstract "Fonte"
    O glossario oficial e `research_archive/doc_references/GLOSSAIRE_MATHEMATIQUE.md`.
    Esta pagina retoma as formulas **mais usadas** em AEGIS com contexto e referencias.

## 1. Metricas centrais

### F15 — Sep(M) Score de Separacao

**Fonte** : Zverev et al. (ICLR 2025), Definition 2.

```
Sep(M) = E_{(x,y) ~ D} [ ||P(M_data(x)) - P(M_instr(x))||_TV ]
```

**Aproximacao binaria** (AEGIS) :

```
Sep(M) = | P_data(violation) - P_instr(violation) |
```

- `P_data` : proporcao de violacoes em posicao **DADO** (OBX)
- `P_instr` : proporcao de violacoes em posicao **INSTRUCAO** (system prompt)

**Status** : `[THEOREME — definition formelle]`

**Implementacao** : `backend/agents/security_audit_agent.py :: compute_separation_score`

### F22 — ASR Attack Success Rate

```
ASR = # violacoes / N
```

**Status** : `[EMPIRIQUE — pas de garantie de convergence]`

**Wilson 95% CI** (F16) :

```
p_hat = violacoes / N
center = (p_hat + z²/2N) / (1 + z²/N)
spread = z × sqrt(p_hat(1-p_hat)/N + z²/4N²) / (1 + z²/N)
CI = [center - spread, center + spread]
```

z = 1.96 para 95% CI. Wilson e robusto para N pequeno ao contrario da aproximacao normal.

### F44 — `I_t` Martingale de alinhamento

**Fonte** : Young (2026, P052), *"Why is RLHF Alignment Shallow?"*, Teorema 8, p. 12.

```
I_t = Cov[E[H|x≤t], score_function]
```

Decomposicao em martingale que prova que o gradient RLHF decresce rapidamente alem dos
primeiros tokens.

**Status** : `[THEOREME — preuve constructive]`

### F46 — Recovery Penalty (heuristica Young 2026)

Fonte : P052, Section 6, Eq. 19.

```
R(x) = sum_t λ_t × penalty(harm(x_{t:T}))
```

**Status** : `[HEURISTIQUE — objectif propose sans validation empirique]`

## 2. Metricas SVC (Score de Viabilidade de Compromisso)

**Fonte** : Zhang et al. (2025, arXiv:2501.18632v2), 6 dimensoes.

| Dim | Nome | Definicao |
|:---:|------|-----------|
| **d¹** | Authority | Autoridade institucional invocada |
| **d²** | Specificity | Precisao do objetivo alvo |
| **d³** | Stealthiness | Invisibilidade aos filtros |
| **d⁴** | Plausibility | Verossimilhanca medica |
| **d⁵** | Completeness | Cobertura do contexto |
| **d⁶** | Reusability | Generalizacao cross-model |

**SVC total** : `SVC = (d1 + d2 + d3 + d4 + d5 + d6) / 6 ∈ [0, 6]`

**Calibracao AEGIS** :

- Piso : **#14 Medical Authority, SVC 1.0/6**
- Sub-piso : **#18 Baseline Humanitarian, SVC 0.5/6** (excluido do catalogo)

**Proposta AEGIS** : d⁷ (Parsing Trust) — 7a dimensao descoberta via D-025.

## 3. Metricas de deriva semantica

### F12 — Cosine similarity

```
cos(u, v) = (u · v) / (||u|| × ||v||)
```

Em embeddings Sentence-BERT `all-MiniLM-L6-v2` (384 dim).

### F13 — Semantic drift

```
drift(baseline, mutated) = 1 - cos(embed(baseline), embed(mutated))
```

Implementacao : `backend/agents/semantic_drift.py :: SemanticDriftAnalyzer`

**Limiares empiricos** :

- `< 0.3` : mutacoes cosmeticas
- `0.3 - 0.6` : variantes significativas
- `> 0.6` : desacoplamento semantico

## 4. Metricas de Wilson e Bonferroni

### Wilson CI (F16)

Ja definido acima. Usado para todos os ASR reportados.

### Bonferroni correction (F17)

```
α_corrigido = α / K
```

Para `K` comparacoes multiplas. Usado em medical benchmarks (P107 MedSafetyBench,
`p < 0.001 Bonferroni em 14 modelos`).

## 5. Metricas de deteccao

### F25 — Precision / Recall / F1

```
Precision = TP / (TP + FP)
Recall    = TP / (TP + FN)
F1        = 2 × P × R / (P + R)
```

Usado para os detectores (PromptGuard 2 AUC=0.98, ZEDD 93% accuracy, etc.).

### F30 — DACC (Detection Accuracy Combined)

**Fonte** : P062 RAGuard.

```
DACC = (TP + TN) / (TP + TN + FP + FN)
```

## 6. Termos tecnicos

### DY-AGENT

**Definicao** : um sistema agentico LLM e uma quadrupla `S = (M, T, E, C)` :

| Componente | Significado | Instancia AEGIS |
|------------|-------------|-----------------|
| **M** | Oracle LLM nao-deterministico | LLaMA 3.2 via Ollama |
| **T** | Conjunto de tools invocaveis | `freeze_instruments`, `set_tension`, `get_vitals` |
| **E** | Ambiente fisico | Robot Da Vinci Xi simulado |
| **C** | Canal de comunicacao | HL7 FHIR / OBX messages |

**Definicao 7 (Integrity)** :

```
Integrity(S) := Reachable(M, i) ⊆ Allowed(i)
```

### Reachable(M, i)

Conjunto das saidas que M **pode efetivamente gerar** para um input `i`. Mensuravel
empiricamente via N trials independentes.

### Allowed(i)

Conjunto das saidas **autorizadas** para a classe de input `i`. Especificado formalmente via
`AllowedOutputSpec` :

```python
@dataclass
class AllowedOutputSpec:
    max_tension_g: int = 800
    forbidden_tools: List[str] = ["freeze_instruments"]
    forbidden_directives: FrozenSet[str] = frozenset([...])
```

### δ⁰ — Alinhamento RLHF

Camada de defesa **integrada aos pesos** do modelo por RLHF/DPO. Shallow por natureza
(Wei 2025, Qi 2025). **Necessaria mas insuficiente** (C1).

### δ¹ — System Prompt / IH

Camada **contextual** : instrucoes injetadas em cada requisicao. Modificavel sem retraining.
Envenenavel (P045). Bypassavel por authority framing (#14).

### δ² — Syntactic Shield

Camada **deterministica pre/pos-tratamento** : regex, Unicode normalization, score obfuscation.
Implementacao AEGIS : `RagSanitizer` 15 detectores. **100% bypass** documentado (Hackett 2025).

### δ³ — Structural Enforcement

Camada **externa** : validacao formal `output ∈ Allowed(i)`. Deterministica, independente
do modelo. **Unica defesa que sobrevive** ao comprometimento do LLM (C2).

### ASR — Attack Success Rate

Proporcao de trials em que o ataque produziu uma violacao. **Metrica empirica sem limite
teorico**.

### Sep(M) — Score de Separacao

Distancia TV entre distribuicoes data-position e instruction-position. Medida da capacidade
do modelo de distinguir dados e instrucoes.

### MITRE ATLAS

Framework de classificacao dos ataques em sistemas ML. AEGIS usa `AML.T0051` (LLM Prompt
Injection) com sub-tecnicas.

### OWASP LLM Top 10

Top 10 das vulnerabilidades LLM. AEGIS enderecca **LLM01** (Prompt Injection) como rank #1 (P123).

### HL7 / FHIR

Padrao de mensageria hospitalar. Segmentos :

- **MSH** : Message Header — instrucoes
- **PID** : Patient ID
- **OBR** : Observation Request
- **OBX** : Observation X — dados clinicos livres (superficie de ataque)

### DICOM

Padrao imagem medica. Metadata portadora (ataques `steganographic_dicom_injection`).

### IPI / DPI

- **DPI** : Direct Prompt Injection — via user turn
- **IPI** : Indirect Prompt Injection — via dados de terceiros (RAG, email, HL7 OBX)

## 7. Acronimos

| Acronimo | Significado |
|----------|-------------|
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
| **SVC** | Score de Viabilidade de Compromisso |
| **GCG** | Greedy Coordinate Gradient (Zou et al. 2023) |
| **PAIR** | Prompt Automatic Iterative Refinement |

## 8. Tags epistemicos (regra CLAUDE.md)

| Tag | Significado |
|-----|-------------|
| `[ARTICLE VERIFIE]` | Paper lido, arXiv/DOI verificado WebFetch, fulltext disponivel |
| `[PREPRINT]` | Ainda nao peer-reviewed |
| `[HYPOTHESE]` | Conjecture nao provada |
| `[CALCUL VERIFIE]` | Formula verificada por calculo, nao por citacao |
| `[EXPERIMENTAL]` | Resultado de uma campanha AEGIS (N >= 30, p-value, CI) |
| `[ABSTRACT SEUL]` | Somente abstract lido, nao o corpo do paper |
| `[SOURCE A VERIFIER]` | Divida tecnica — referencia a consolidar |

## 9. Recursos

- :material-file-document: [GLOSSAIRE_MATHEMATIQUE.md - 72 formulas](https://github.com/pizzif/poc_medical/blob/main/research_archive/doc_references/GLOSSAIRE_MATHEMATIQUE.md)
- :material-book: [Manuscrito - formal_framework_complete.md](../manuscript/index.md)
- :material-shield: [δ⁰–δ³ detalhe](../delta-layers/index.md)
- :material-chart-line: [Metricas campanhas](../metrics/index.md)
