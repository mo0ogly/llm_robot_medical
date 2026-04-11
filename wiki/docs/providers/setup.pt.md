# Providers LLM — setup e propagacao

!!! abstract "Os 5 providers suportados"
    AEGIS suporta **5 providers LLM** via `backend/llm_providers.py` e rotas dedicadas
    `backend/routes/llm_providers_routes.py` :

    - **Ollama** (local, padrao)
    - **Groq** (cloud, rapido, throttling)
    - **OpenAI** (cloud, GPT-4/4o/5)
    - **Anthropic** (cloud, Claude Opus/Sonnet)
    - **Mistral** (cloud, Mistral Large)

## 1. Matriz dos providers

| Provider | Modelos principais | Custo | Latencia | Rate limit | Uso AEGIS |
|----------|-------------------|:-----:|:--------:|:----------:|-----------|
| **Ollama** | llama3.2, llama3.1:70b, qwen3:32b | **$0** | Variavel (GPU local) | Nenhum | Padrao dev + campanhas locais |
| **Groq** | llama-3.1-8b-instant, llama-3.3-70b-versatile | ~$0.30/1h | **< 1s** | **50 req/s** | Campanhas rapidas |
| **OpenAI** | gpt-4o, gpt-4-turbo, gpt-5 | ~$5/campanha | 1-3s | 10k TPM | Baseline comparativo |
| **Anthropic** | claude-opus-4-6, claude-sonnet-4-6 | ~$10/campanha | 2-5s | 50 req/s | Testes adversariais |
| **Mistral** | mistral-large-latest | ~$2/campanha | 1-2s | Variavel | Cross-family |

## 2. Setup

### Ollama (padrao, local)

```bash
# Instalacao
curl -fsSL https://ollama.com/install.sh | sh
# Windows: https://ollama.com/download/windows

# Pull modelo
ollama pull llama3.2:latest
ollama pull llama3.1:70b       # 70B para THESIS-002
ollama pull qwen3:32b          # cross-family THESIS-003

# Iniciar daemon
ollama serve  # porta 11434

# Verificar
curl http://localhost:11434/api/tags
```

**Nenhuma chave API requerida**. O backend detecta automaticamente Ollama em `localhost:11434`.

### Groq

1. Criar conta em [console.groq.com](https://console.groq.com)
2. Gerar API key
3. Adicionar em `.env` :

```bash
# backend/.env
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.1-8b-instant
```

### OpenAI

```bash
# backend/.env
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o
```

### Anthropic

```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-opus-4-6
```

### Mistral

```bash
# backend/.env
MISTRAL_API_KEY=...
MISTRAL_MODEL=mistral-large-latest
```

## 3. Endpoint de selecao

```
POST /api/llm-providers/select
{
    "provider": "groq",
    "model": "llama-3.1-8b-instant"
}

GET /api/llm-providers
→ {"current": "groq", "available": ["ollama", "groq", "openai", "anthropic", "mistral"]}

GET /api/llm-providers/models/{provider}
→ {"models": ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", ...]}
```

## 4. Propagacao aos agents AG2 — **RETEX critico**

!!! danger "O bug das 3h (THESIS-001, 2026-04-08)"
    **Sintoma** : THESIS-001 travado em 115 chamadas Groq com retry loop Ollama (500 errors).

    **Causa raiz** : `orchestrator.py` passava `provider=groq` **somente** ao
    `medical_agent`. Os outros 3 agents (`red_team_agent`, `security_audit_agent`,
    `adaptive_attacker`) caiam no Ollama por padrao. Quando Ollama ficava instavel, o
    GroupChat AG2 ficava travado em retry no `security_audit_agent`.

    **Fix** :

    1. **Assinatura obrigatoria** : `def create_XXX_agent(provider: str = None, model: str = None)`
    2. **Propagacao integral** : todos os `create_*_agent()` recebem `provider/model`
    3. **Fallback cross-provider** : `CYBER_MODEL → MEDICAL_MODEL` quando `provider != "ollama"`
       (`saki007ster/CybersecurityRiskAnalyst:latest` so existe em Ollama)

    **Licao fundamental** : AG2 multi-agent = **multi-config LLM**. Cada `ConversableAgent` tem
    sua propria `llm_config`. Os scripts diretos (`call_llm()`) sao mais robustos porque
    sao **mono-provider por design**.

### Padrao correto

```python
# backend/orchestrator.py (apos fix)

class RedTeamOrchestrator:
    def __init__(self, provider=None, model=None, **kwargs):
        self.provider = provider or "ollama"
        self.model = model

        # TODOS os agents recebem provider/model
        self.medical_agent = create_medical_robot_agent(
            provider=self.provider, model=self.model
        )
        self.red_team_agent = create_red_team_agent(
            provider=self.provider, model=self.model
        )
        self.security_audit_agent = create_security_audit_agent(
            provider=self.provider, model=self.model
        )
        self.adaptive_attacker = create_adaptive_attacker_agent(
            provider=self.provider, model=self.model
        )
```

### Verificacao anti-regressao

```bash
# Antes do lancamento, verificar propagacao correta
grep -c "groq.com.*200 OK" logs/campaign_*.log
grep -c "11434" logs/campaign_*.log

# Se as duas contagens sao > 0 → mix provider detectado → BLOQUEAR
```

## 5. Adaptacao de parametros ao modelo

!!! note "Regra AEGIS (CLAUDE.md)"
    Os protocolos experimentais DEVEM ser adaptados ao **tamanho do modelo alvo** :

    | Tamanho | max_tokens | Fuzzing | Temperature |
    |:-------:|:----------:|---------|:-----------:|
    | **3B** | **>= 500** | 1 transform max | **0** |
    | **7B** | >= 300 | 1-2 transforms | 0.3 |
    | **70B+** | padrao | completo | 0.7 |

**Por que** : os modelos pequenos produzem **noise** sob perturbacoes combinadas.
TC-001 iteracao 1 (`max_tokens=150, temperature=0.7, max_fuzz=2`) deu um veredito
INCONCLUSIVE devido a esses parametros muito agressivos.

## 6. Fallback automatico

```python
# backend/llm_providers.py (extrato)

def get_llm(provider: str = None, model: str = None):
    provider = provider or os.getenv("DEFAULT_PROVIDER", "ollama")

    try:
        if provider == "groq":
            return GroqLLM(model=model or GROQ_MODEL)
        elif provider == "openai":
            return OpenAILLM(model=model or OPENAI_MODEL)
        # ...
    except (RateLimitError, ServerError) as e:
        logger.warning(f"{provider} failed, falling back to ollama: {e}")
        return OllamaLLM(model=FALLBACK_MODEL)
```

**Atencao** : o fallback introduz **vies experimental**. Para as campanhas de tese,
desativar o fallback e **logar explicitamente** a falha :

```python
orchestrator = RedTeamOrchestrator(
    provider="groq",
    model="llama-3.1-8b-instant",
    fallback_enabled=False,  # CRITICO para reprodutibilidade
)
```

## 7. Estatisticas de estabilidade

| Provider | Taxa de falha campanha THESIS-001 | Comentario |
|----------|:---------------------------------:|------------|
| Ollama (llama3.2:3b) | ~5% (timeout GPU) | Estavel mas lento |
| **Groq (llama-3.1-8b-instant)** | **0.08%** (4/4800) | **Muito estavel** |
| OpenAI (gpt-4o) | <1% | Rate limit principal |
| Anthropic (claude-sonnet) | ~2% | Moderacao ocasional |
| Mistral | ~3% | Throttling as vezes |

## 8. Cost analysis

Para uma **campanha THESIS-001 padrao** (1200 runs, 4800 chamadas LLM) :

| Provider | Custo | Duracao |
|----------|:-----:|:-------:|
| Ollama local | **$0** | ~10h (GPU RTX 4090) |
| Groq 8B | **~$0.30** | **~1h15** |
| OpenAI gpt-4o | ~$5 | ~2h |
| Anthropic Sonnet | ~$10 | ~3h |
| Mistral Large | ~$2 | ~1h30 |

**Recomendacao** : Groq 8B para as campanhas iterativas (pre-check + iter 1-3), Ollama para
a reproducao thesis e publicacao (zero custo).

## 9. Limites e vantagens

<div class="grid" markdown>

!!! success "Vantagens"
    - **5 providers** para cross-family validation
    - **Fallback automatico** em dev (desativavel na publicacao)
    - **Adaptacao de parametros** por tamanho de modelo
    - **Monitoring cost** via endpoint `/api/llm-providers/usage`
    - **Reprodutibilidade** : Ollama local = seed controlavel
    - **Cross-model validation** (THESIS-002, THESIS-003)

!!! failure "Limites"
    - **Groq throttling** : 50 req/s pode bloquear campanhas grandes
    - **Instabilidade Ollama** : crash GPU possivel sob carga
    - **Vies do fallback** : os fallbacks nao logados poluem os resultados
    - **Custo Anthropic/OpenAI** alto para campanhas N=30+
    - **RETEX RETEX** : a propagacao do provider permanece fragil em cada refatoracao
    - **Sem streaming AG2** : os fallbacks quebram os eventos SSE

</div>

## 10. Recursos

- :material-code-tags: [backend/llm_providers.py](https://github.com/pizzif/poc_medical/blob/main/backend/llm_providers.py)
- :material-api: [API LLM Providers](../api/llm-providers.md)
- :material-robot: [Agents AG2 — propagacao](../agents/index.md)
- :material-file-alert: [RETEX THESIS-001](../experiments/index.md#thesis-001-formal-thesis-campaign)
- :material-server: [Ollama.com](https://ollama.com)
- :material-server: [console.groq.com](https://console.groq.com)
