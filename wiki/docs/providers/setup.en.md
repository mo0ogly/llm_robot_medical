# LLM Providers — setup and propagation

!!! abstract "The 5 supported providers"
    AEGIS supports **5 LLM providers** via `backend/llm_providers.py` and dedicated
    `backend/routes/llm_providers_routes.py` routes:

    - **Ollama** (local, default)
    - **Groq** (cloud, fast, throttling)
    - **OpenAI** (cloud, GPT-4/4o/5)
    - **Anthropic** (cloud, Claude Opus/Sonnet)
    - **Mistral** (cloud, Mistral Large)

## 1. Provider matrix

| Provider | Main models | Cost | Latency | Rate limit | AEGIS usage |
|----------|-------------|:----:|:-------:|:----------:|-------------|
| **Ollama** | llama3.2, llama3.1:70b, qwen3:32b | **$0** | Variable (local GPU) | None | Default dev + local campaigns |
| **Groq** | llama-3.1-8b-instant, llama-3.3-70b-versatile | ~$0.30/1h | **< 1s** | **50 req/s** | Fast campaigns |
| **OpenAI** | gpt-4o, gpt-4-turbo, gpt-5 | ~$5/campaign | 1-3s | 10k TPM | Comparative baseline |
| **Anthropic** | claude-opus-4-6, claude-sonnet-4-6 | ~$10/campaign | 2-5s | 50 req/s | Adversarial tests |
| **Mistral** | mistral-large-latest | ~$2/campaign | 1-2s | Variable | Cross-family |

## 2. Setup

### Ollama (default, local)

```bash
# Installation
curl -fsSL https://ollama.com/install.sh | sh
# Windows: https://ollama.com/download/windows

# Pull model
ollama pull llama3.2:latest
ollama pull llama3.1:70b       # 70B for THESIS-002
ollama pull qwen3:32b          # cross-family THESIS-003

# Start daemon
ollama serve  # port 11434

# Verify
curl http://localhost:11434/api/tags
```

**No API key required**. The backend automatically detects Ollama on `localhost:11434`.

### Groq

1. Create an account on [console.groq.com](https://console.groq.com)
2. Generate an API key
3. Add to `.env`:

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

## 3. Selection endpoint

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

## 4. Propagation to AG2 agents — **critical RETEX**

!!! danger "The 3h bug (THESIS-001, 2026-04-08)"
    **Symptom**: THESIS-001 stuck at 115 Groq calls with Ollama 500 errors retry loop.

    **Root cause**: `orchestrator.py` passed `provider=groq` **only** to the
    `medical_agent`. The 3 other agents (`red_team_agent`, `security_audit_agent`,
    `adaptive_attacker`) fell back to Ollama by default. When Ollama became unstable, the
    AG2 GroupChat remained stuck in retry on `security_audit_agent`.

    **Fix**:

    1. **Required signature**: `def create_XXX_agent(provider: str = None, model: str = None)`
    2. **Full propagation**: all `create_*_agent()` receive `provider/model`
    3. **Cross-provider fallback**: `CYBER_MODEL → MEDICAL_MODEL` when `provider != "ollama"`
       (`saki007ster/CybersecurityRiskAnalyst:latest` only exists on Ollama)

    **Fundamental lesson**: AG2 multi-agent = **multi-config LLM**. Each `ConversableAgent` has
    its own `llm_config`. Direct scripts (`call_llm()`) are more robust because they are
    **mono-provider by design**.

### Correct pattern

```python
# backend/orchestrator.py (after fix)

class RedTeamOrchestrator:
    def __init__(self, provider=None, model=None, **kwargs):
        self.provider = provider or "ollama"
        self.model = model

        # ALL agents receive provider/model
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

### Anti-regression verification

```bash
# Before launch, verify correct propagation
grep -c "groq.com.*200 OK" logs/campaign_*.log
grep -c "11434" logs/campaign_*.log

# If both counts are > 0 → mixed provider detected → BLOCK
```

## 5. Parameter adaptation to the model

!!! note "AEGIS rule (CLAUDE.md)"
    Experimental protocols MUST be adapted to the **size of the target model**:

    | Size | max_tokens | Fuzzing | Temperature |
    |:----:|:----------:|---------|:-----------:|
    | **3B** | **>= 500** | 1 transform max | **0** |
    | **7B** | >= 300 | 1-2 transforms | 0.3 |
    | **70B+** | standard | full | 0.7 |

**Why**: small models produce **noise** under combined perturbations.
TC-001 iteration 1 (`max_tokens=150, temperature=0.7, max_fuzz=2`) gave an INCONCLUSIVE
verdict because of these overly aggressive parameters.

## 6. Automatic fallback

```python
# backend/llm_providers.py (excerpt)

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

**Warning**: the fallback introduces **experimental bias**. For thesis campaigns,
disable the fallback and **log the failure explicitly**:

```python
orchestrator = RedTeamOrchestrator(
    provider="groq",
    model="llama-3.1-8b-instant",
    fallback_enabled=False,  # CRITICAL for reproducibility
)
```

## 7. Stability statistics

| Provider | THESIS-001 campaign failure rate | Comment |
|----------|:--------------------------------:|---------|
| Ollama (llama3.2:3b) | ~5% (GPU timeout) | Stable but slow |
| **Groq (llama-3.1-8b-instant)** | **0.08%** (4/4800) | **Very stable** |
| OpenAI (gpt-4o) | <1% | Main rate limit |
| Anthropic (claude-sonnet) | ~2% | Occasional moderation |
| Mistral | ~3% | Sometimes throttling |

## 8. Cost analysis

For a **standard THESIS-001 campaign** (1200 runs, 4800 LLM calls):

| Provider | Cost | Duration |
|----------|:----:|:--------:|
| Local Ollama | **$0** | ~10h (RTX 4090 GPU) |
| Groq 8B | **~$0.30** | **~1h15** |
| OpenAI gpt-4o | ~$5 | ~2h |
| Anthropic Sonnet | ~$10 | ~3h |
| Mistral Large | ~$2 | ~1h30 |

**Recommendation**: Groq 8B for iterative campaigns (pre-check + iter 1-3), Ollama for
thesis reproduction and publication (zero cost).

## 9. Limitations and strengths

<div class="grid" markdown>

!!! success "Strengths"
    - **5 providers** for cross-family validation
    - **Automatic fallback** in dev (disableable at publication)
    - **Parameter adaptation** by model size
    - **Cost monitoring** via `/api/llm-providers/usage` endpoint
    - **Reproducibility**: local Ollama = controllable seed
    - **Cross-model validation** (THESIS-002, THESIS-003)

!!! failure "Limitations"
    - **Groq throttling**: 50 req/s may block large campaigns
    - **Ollama instability**: possible GPU crash under load
    - **Fallback bias**: unlogged fallbacks pollute results
    - **High Anthropic/OpenAI cost** for N=30+ campaigns
    - **RETEX RETEX**: provider propagation remains fragile after every refactoring
    - **No AG2 streaming**: fallbacks break SSE events

</div>

## 10. Resources

- :material-code-tags: [backend/llm_providers.py](https://github.com/pizzif/poc_medical/blob/main/backend/llm_providers.py)
- :material-api: [LLM Providers API](../api/llm-providers.md)
- :material-robot: [AG2 Agents — propagation](../agents/index.md)
- :material-file-alert: [RETEX THESIS-001](../experiments/index.md#thesis-001-formal-thesis-campaign)
- :material-server: [Ollama.com](https://ollama.com)
- :material-server: [console.groq.com](https://console.groq.com)
