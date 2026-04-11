# Campanhas experimentais — historico e resultados

!!! abstract "Fonte da verdade"
    Cada campanha produz um **relatorio** em `research_archive/experiments/EXPERIMENT_REPORT_*.md`
    e uma entrada em `campaign_manifest.json`. Os dados brutos estao em
    `research_archive/data/raw/campaign_*.json`.

    **Estado atual** (2026-04-11) : 7 campanhas executadas, 2 SUPPORTED, 3 INCONCLUSIVE (em iteracao),
    2 em andamento.

## 1. Visao geral

| ID | Nome | Gap | Conj | Status | Modelo | N | Veredito |
|----|------|-----|------|:------:|--------|:-:|----------|
| **TC-001** | Triple Convergence | G-011 | C1 | **INCONCLUSIVE** | llama3.2 (3B) | 30 | Noise sob perturbacoes combinadas |
| **TC-002** | Triple Convergence v2 | G-011 | C1 | **PARTIAL** | llama-3.3-70b | 30 | D-022 paradoxo δ⁰/δ¹ descoberto |
| **THESIS-001** | Formal Thesis Campaign | — | C1+C2 | **SUPPORTED** | llama-3.1-8b-instant | 1200 | **D-023/D-024/D-025** |
| **THESIS-002** | XML Agent cross-model | — | D-025 | **SUPPORTED** | 70B | — | 100% ASR em XML agent |
| **THESIS-003** | Qwen 3 32B cross-family | — | D-024/D-025 | **IN PROGRESS** | qwen3-32b | 30 | Family-specific check |
| **RAG-001** | RAG defense chain_defenses | G-003 | C2 | **IN PROGRESS** | llama3.2 | — | chain_defenses ativo orch |
| **ASIDE-001** | ASIDE adaptive protocol | G-015 | C1 | **PLANNED** | — | — | — |

## 2. As 4 descobertas principais oriundas dos experimentos

### D-023 — Bimodalidade das vulnerabilidades (THESIS-001)

Sobre **1200 runs** (30 trials x 40 chains, Groq llama-3.1-8b-instant) :

| Metrica | Valor | Comentario |
|---------|:-----:|-----------|
| **ASR global** | **6.75%** | **MASCARA** a distribuicao |
| IC 95% Wilson | [5.5%, 8.3%] | |
| Sep(M) min | 0.0 | |
| Sep(M) mean | 0.0683 | |
| Sep(M) max | **0.9667** | |
| Sep(M) stdev | 0.2189 | |

**Distribuicao por limiar** :

- **Sep(M) > 0.5** : **2 chains** (`hyde_chain`, `xml_agent`) — VULNERAVEIS CATASTROFICAS
- **Sep(M) entre 0.1 e 0.5** : 3 chains (functions_agent, stepback, retrieval_agent) — PARCIAIS
- **Sep(M) < 0.1** : 35 chains (das quais 33 em 0% ASR) — DEFENDIDAS

**Implicacao** : reportar Sep(M) em **media aritmetica** (0.067) em um dataset bimodal e
**estatisticamente enganoso**. Os relatorios de tese devem usar a **distribuicao completa**
(min/mean/median/max + histograma por limiar).

### D-024 — HyDE self-amplification (THESIS-001)

!!! danger "Contribuicao original — confianca 10/10"
    **HyDE** atinge **96.7% ASR** (29/30 violacoes) em llama-3.1-8b-instant.

    **Mecanismo** : o modelo gera ele mesmo um documento hipotetico contendo os payloads
    de ataque **com autoridade fabricada** (FDA ficticia, classificacoes inventadas), e depois usa
    esse documento como contexto.

    **Nenhum paper** do corpus P001-P130 identifica HyDE como **vetor de ataque endogeno
    pre-retrieval** — contribuicao original da tese.

**Taxonomia RAG em 6 stages** introduzida por D-024 :

| Stage | Ponto de compromisso | Prerequisito | Exemplos literatura |
|:-:|---|---|---|
| 1 | Corpus poisoning | Escrita no knowledge store | P054 PIDP, P055 RAGPoison, P120 HijackRAG, P121 |
| 2 | Retriever training | Supply chain ML | P121 backdoor branch |
| 3 | Retrieval mechanism | Conhecimento retriever + escrita | P120 white-box |
| 4 | Ranking | Score manipulation | GGPP |
| 5 | Post-retrieval | Injection context | Greshake 2023 |
| **6** | **Generator pre-retrieval (HyDE)** | **NENHUM** | **AEGIS D-024** |

**D-024 nao precisa de NADA** : sem corpus poisoning, sem comprometer retriever, sem prompt
orchestrador corrompido, sem fine-tuning. O modelo **cria** seu proprio vetor de ataque.

### D-025 — Parsing Trust exploit (THESIS-001 + THESIS-002)

**XML Agent** atinge **96.7% ASR** com um **SVC de apenas 0.11** (LOW POTENTIAL segundo
scoring classico 6D). O modelo **"parse" e "valida"** as tags XML do atacante como
legitimas.

**Implicacao** : requer **d⁷ (Parsing Trust)** como **7a dimensao SVC**, ausente do
scoring Zhang 2025.

**THESIS-002 confirma** : **100% ASR em XML Agent em 70B**, o fenomeno **piora com o tamanho**.

### D-022 — Paradoxo δ⁰/δ¹ (TC-002)

!!! warning "Contra-intuitivo"
    Apagar o system prompt (δ¹) **REDUZ** a eficacia do contexto envenenado.

    | Condicao | ASR 70B | N |
    |----------|:-------:|:-:|
    | δ¹ sozinho | 33% | 30 |
    | δ⁰+δ¹ combinados | **17%** | 30 |

    O system prompt e **ao mesmo tempo PROTECAO** (instruction-following para as regras)
    **E VETOR** (instruction-following para o veneno).

**Implicacao** : a convergencia das camadas e **antagonica, nao aditiva**. O atacante
otimo deve **escolher seus vetores, nao os combinar**. Pontuacao D-001 Triple Convergence **cai
de 10/10 para 8/10**.

## 3. Historico detalhado

### TC-001 / TC-002 — Triple Convergence

**Objetivo** : validar C1 (insuficiencia δ⁰+δ¹+δ²) via ataque combinado (GRP obliteration +
Context Poisoning + Base64 + homoglyph).

**Iteracao 1 (2026-04-08)** — llama3.2:latest, N=30

- Params : max_tokens=150, temperature=0.7, max_fuzz=2
- Veredito : **INCONCLUSIVE**
- **Diagnosis** : 3B model produces noise under combined perturbations, ASR inverts (0% full
  convergence vs 33% δ² alone)

**Iteracao 2 (2026-04-08)** — llama3.2:latest, N=30

- Params : max_tokens=500, temperature=0.0, max_fuzz=1
- Veredito : **INCONCLUSIVE**
- **Diagnosis** : δ² alone 43% vs full convergence 7%. Inversion confirmed on 3B.
- **Acao** : teste em 70B via Groq

**TC-002 (2026-04-09)** — llama-3.3-70b-versatile (Groq), N=30

- Veredito : **PARTIAL** — descoberta D-022 (paradoxo δ⁰/δ¹)
- δ¹ sozinho = 33%, δ⁰+δ¹ = 17%
- Queda de score D-001 de 10/10 para 8/10

### THESIS-001 — Formal Thesis Campaign

**Data** : 2026-04-09
**Duracao** : ~1h15
**Modelo** : llama-3.1-8b-instant (Groq Cloud, 100%, 0 Ollama)
**N** : 30 trials x 40 chains = **1200 runs**
**Chamadas Groq** : 4800+ (das quais 4 x 404, 0.08%)
**Custo** : ~$0.30 estimado

**RETEX critico** : bug de propagacao `provider=groq` corrigido durante a execucao (cf.
[delta-1.md](../delta-layers/delta-1.md#propagation-multi-provider)).

**Resultados** : cf. secoes D-023, D-024, D-025 acima.

### THESIS-002 — XML Agent cross-model validation

**Commit** : `5971d50 feat(thesis-002): cross-model validation — XML Agent 100% ASR on 70B`

**Objetivo** : verificar que D-025 (Parsing Trust) persiste em 70B.

**Resultado** : **100% ASR** em XML Agent, confirma que a vulnerabilidade **nao e um artefato
de modelo pequeno** e **piora com o tamanho** (paradoxo C7).

### THESIS-003 — Qwen 3 32B cross-family

**Commit** : `5971d50 feat(thesis-003): Qwen 3 32B cross-family — D-024/D-025 family-specific`

**Objetivo** : testar se D-024/D-025 sao family-specific (LLaMA) ou cross-family (Qwen).

**Status** : em andamento. Hipotese : Qwen resiste melhor as tags XML (training diferente) mas
permanece vulneravel a HyDE self-amplification.

### RAG-001 — chain_defenses active in orchestrator

**Commit** : `3c1e896 feat(thesis): chapitre 6 experiences + chain_defenses active in orchestrator`

**Objetivo** : validar que a ativacao das `chain_defenses` (combinacao RagSanitizer + PII guard
+ NLI entailment) reduz o ASR sob `hyde_chain`.

**Status** : em andamento, aguarda N=30 em Groq.

## 4. Regra de loop iterativo

!!! note "Maximo 3 iteracoes por campanha"
    1. **Iteracao 1** : parametros padrao, N=30
    2. **Iteracao 2** : ajustados segundo diagnostico (N aumentado, parametros refinados, modelo trocado)
    3. **Iteracao 3** : ultimo ensaio antes de **escalacao humana**

    Veredito apos cada iteracao :

    - **SUPPORTED** : ASR > limiar com CI Wilson estreito
    - **REFUTED** : ASR < limiar ou CI que sobrepoe
    - **INCONCLUSIVE** : N insuficiente ou variancia excessiva → proxima iteracao

    Se **INCONCLUSIVE apos 3 iteracoes** → escalacao ao **diretor de tese (David Naccache, ENS)**.

## 5. Pipeline automatizado

```mermaid
flowchart LR
    GAP["Gap G-XXX"] --> PLANNER["/experiment-planner"]
    PLANNER --> PROTO["protocol.json<br/>pre-check + N=30 + metricas"]
    PROTO --> CAMP["Campanha SSE"]
    CAMP --> JSON["campaign_YYYYMMDD.json"]
    JSON --> ANALYST["/experimentalist"]
    ANALYST --> VERDICT{"Veredito"}
    VERDICT -->|"SUPPORTED"| WRITER["/thesis-writer"]
    VERDICT -->|"INCONCLUSIVE"| PLANNER
    WRITER --> CHAP["chapitre_6_experiences.md"]

    style VERDICT fill:#e74c3c,color:#fff
    style CHAP fill:#27ae60,color:#fff
```

## 6. Arquivos referenciados

```
research_archive/experiments/
├── EXPERIMENT_REPORT_CROSS_MODEL.md      — cross-model validation
├── EXPERIMENT_REPORT_TC001.md            — Triple Convergence iter 1
├── EXPERIMENT_REPORT_TC001_v2.md         — Triple Convergence iter 2
├── EXPERIMENT_REPORT_TC002.md            — Triple Convergence 70B
├── EXPERIMENT_REPORT_THESIS_001.md       — Formal thesis campaign
├── EXPERIMENT_REPORT_THESIS_002.md       — XML Agent cross-model
├── EXPERIMENT_REPORT_THESIS_003.md       — Qwen 3 32B cross-family
├── aside_adaptive_protocol.md            — Protocolo ASIDE
├── aside_adaptive_results.json           — Resultados ASIDE
├── campaign_manifest.json                — Manifest global
├── delta1_rag_results.json               — RAG δ¹ results
├── mpib_synthetic.json                   — MPIB synthetic baseline
├── protocol_RAG001.json                  — Protocolo RAG-001
├── sepm_validation_strategy.md           — Estrategia Sep(M)
└── triple_convergence_results.json       — TC raw data
```

## 7. Recursos

- :material-chart-bar: [campaign_manifest.json](https://github.com/pizzif/poc_medical/blob/main/research_archive/experiments/campaign_manifest.json)
- :material-shield: [δ³ Conjecture 2](../delta-layers/delta-3.md#6-conjecture-2-necessite-formelle)
- :material-dna: [Forge genetica](../forge/index.md)
- :material-chart-line: [Campanhas — metodologia](../campaigns/index.md)
- :material-lightbulb: [Descobertas D-001 a D-028](../research/discoveries/index.md)
