# PromptForge — Multi-LLM Testing Configuration

## Overview

**PromptForge** is a multi-LLM testing interface for the AEGIS Red Team Lab that allows you to test adversarial prompts across multiple LLM providers simultaneously:

- **Ollama** (local) — llama3.2, medical models
- **Claude** (Anthropic) — Opus 4.6, Sonnet 4.6, Haiku 4.5
- **GPT** (OpenAI) — GPT-4o, GPT-4-turbo, GPT-4o-mini
- **Gemini** (Google) — Gemini 2.0 Flash, 1.5 Pro, 1.5 Flash
- **Grok** (xAI) — Grok-3, Grok-2
- **Groq** (LPU) — Llama 70B, Mixtral, Gemma

---

## Quick Start

### 1. Access PromptForge

Navigate to: `http://localhost:5173/redteam/prompt-forge`

### 2. Configure Cloud Providers (Optional)

To test on cloud providers, set environment variables before starting the backend:

```bash
# Anthropic Claude
export ANTHROPIC_API_KEY="sk-ant-..."

# OpenAI GPT
export OPENAI_API_KEY="sk-..."

# Google Gemini
export GOOGLE_API_KEY="AIzaSy..."

# xAI Grok
export XAI_API_KEY="..."

# Groq
export GROQ_API_KEY="gsk_..."
```

### 3. Start Backend with Providers

```bash
./aegis.ps1 start backend
```

The backend will automatically detect enabled providers based on API keys.

### 4. Test a Prompt

1. **Select Provider**: Choose from dropdown (Ollama, Claude, GPT, Gemini, Grok, Groq)
2. **Select Model**: Model list loads dynamically for chosen provider
3. **Enter Prompt**: Type your adversarial prompt
4. **Adjust Parameters**:
   - Temperature: 0.0 (deterministic) to 2.0 (creative)
   - Max Tokens: 1-4096
5. **Test or Compare**:
   - **Test**: Stream response from single provider
   - **Compare All**: Parallel test across enabled providers

---

## Configuration File

### Location
`backend/prompts/llm_providers_config.json`

### Structure
```json
{
  "providers": {
    "ollama": {
      "type": "local",
      "enabled": true,
      "host": "http://127.0.0.1:11434",
      "models": ["llama3.2:latest", "saki007ster/CybersecurityRiskAnalyst:latest"],
      "default_model": "llama3.2:latest",
      "timeout_seconds": 120
    },
    "anthropic": {
      "type": "cloud",
      "enabled": false,
      "endpoint": "https://api.anthropic.com/v1",
      "models": ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5"],
      "default_model": "claude-opus-4-6",
      "auth": {
        "api_key_env": "ANTHROPIC_API_KEY",
        "method": "header",
        "header_name": "x-api-key"
      }
    }
    // ... more providers ...
  }
}
```

### Enable/Disable Providers

Edit `llm_providers_config.json` and set `enabled: true` or `false` for each provider.

---

## API Endpoints

### GET `/api/redteam/llm-providers`
List all available LLM providers and their status.

**Response:**
```json
{
  "providers": [
    {
      "name": "ollama",
      "display_name": "Ollama (Local)",
      "type": "local",
      "models": ["llama3.2:latest", "saki007ster/CybersecurityRiskAnalyst:latest"],
      "default_model": "llama3.2:latest",
      "status": "ok"
    }
  ]
}
```

### GET `/api/redteam/llm-providers/{provider}/models`
Get available models for a provider.

**Response:**
```json
{
  "provider": "anthropic",
  "models": ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5"],
  "default_model": "claude-opus-4-6"
}
```

### POST `/api/redteam/llm-test` (Streaming)
Test a prompt on a single provider with streaming output.

**Request:**
```json
{
  "provider": "anthropic",
  "model": "claude-opus-4-6",
  "prompt": "Your adversarial prompt here",
  "system_prompt": "Optional system prompt",
  "temperature": 0.7,
  "max_tokens": 1024
}
```

**Response:** SSE stream with tokens
```
data: {"token": "T", "provider": "anthropic", "timestamp": 1234567890}
data: {"token": "h", "provider": "anthropic", "timestamp": 1234567890}
...
data: {"type": "complete", "duration_ms": 2500, "tokens": 145}
```

### POST `/api/redteam/llm-compare` (Parallel)
Test a prompt on multiple providers in parallel.

**Request:**
```json
{
  "prompt": "Your prompt",
  "system_prompt": "Optional",
  "temperature": 0.7,
  "max_tokens": 1024,
  "providers": ["ollama", "anthropic", "openai"]
}
```

**Response:**
```json
{
  "results": {
    "ollama": {
      "status": "ok",
      "response": "...",
      "tokens": 245,
      "duration_ms": 3000
    },
    "anthropic": {
      "status": "ok",
      "response": "...",
      "tokens": 156,
      "duration_ms": 2100
    },
    "openai": {
      "status": "ok",
      "response": "...",
      "tokens": 189,
      "duration_ms": 1800
    }
  }
}
```

### GET `/api/redteam/llm-providers/{provider}/status`
Health check for a specific provider.

**Response:**
```json
{
  "provider": "anthropic",
  "status": "ok",
  "message": "API key configured",
  "latency_ms": 150
}
```

---

## Troubleshooting

### Provider Shows "OFFLINE"

1. **Ollama**: Ensure `ollama serve` is running on `127.0.0.1:11434`
   ```bash
   ollama serve
   ```

2. **Cloud Providers**: Check API key is set correctly
   ```bash
   echo $ANTHROPIC_API_KEY  # Should display key (non-empty)
   ```

3. **Network**: Verify connectivity to provider endpoint
   ```bash
   curl https://api.anthropic.com/v1/models
   ```

### "API key not configured"

Ensure environment variable is set BEFORE starting backend:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
./aegis.ps1 start backend
```

Reload page after restart.

### Timeout Error

1. Increase `timeout_seconds` in `llm_providers_config.json`
2. Check backend logs: `tail -f logs/backend.log`
3. Try a shorter prompt (fewer max_tokens)

### Response Incomplete

1. Check network connection
2. Verify provider didn't rate-limit you
3. Check backend logs for errors

---

## Advanced Usage

### Batch Testing

To systematically test an attack across all providers:

1. Load attack from Catalog
2. Click "Compare All" in PromptForge
3. Export results as JSON (button in UI)
4. Analyze comparative results:
   - Which LLM is most vulnerable?
   - Which has best defense?
   - How does latency vary?

### Integration with Red Team Lab

PromptForge feeds into the larger Red Team Lab:

1. Test prompt in **PromptForge** (multi-LLM comparison)
2. Refine in **Playground** (single-LLM iteration)
3. Add to **Catalog** (save for campaigns)
4. Run **Campaigns** (statistical validation N>=30)
5. Archive in **History** (reproducibility, thesis reference)

---

## Adding a New Provider

### Step 1: Update Configuration

Edit `llm_providers_config.json`:

```json
"newprovider": {
  "type": "cloud",
  "enabled": false,
  "endpoint": "https://api.newprovider.com/v1",
  "models": ["model-1", "model-2"],
  "default_model": "model-1",
  "auth": {
    "api_key_env": "NEWPROVIDER_API_KEY",
    "method": "header",
    "header_name": "Authorization",
    "prefix": "Bearer"
  },
  "timeout_seconds": 30
}
```

### Step 2: Extend LLM Factory

Edit `backend/agents/attack_chains/llm_factory.py`:

```python
elif provider == "newprovider":
    from langchain_newprovider import ChatNewProvider
    return ChatNewProvider(
        model=model or "model-1",
        api_key=os.getenv("NEWPROVIDER_API_KEY", ""),
        temperature=temperature,
        **kwargs
    )
```

### Step 3: Update `get_available_providers()`

```python
if os.getenv("NEWPROVIDER_API_KEY"):
    providers.append({
        "id": "newprovider",
        "name": "New Provider",
        "status": "available",
        "models": ["model-1", "model-2"]
    })
```

### Step 4: Restart Backend

```bash
./aegis.ps1 restart backend
```

New provider appears in PromptForge dropdown.

---

## Thesis Integration

### For Doctoral Research

Use PromptForge to:

1. **Baseline Testing** (δ⁰ = 0): Test unaligned LLMs (Meditron, custom base)
2. **Cross-Model Validation**: Compare attack success across Claude, GPT, Gemini
3. **Latency Profiling**: Measure response times per provider
4. **Statistical Significance**: Run N>=30 trials per condition
5. **Reproducibility**: Export JSON with timestamps, seeds, models for replication

Example thesis workflow:

```
PromptForge (multi-LLM test)
    ↓
Export JSON results
    ↓
Analysis script (compute SVC, Sep(M), divergence)
    ↓
Thesis table/figure: "Table X — Cross-Model Attack Success"
```

---

## References

- Provider endpoints tested on: 2026-04-04
- Supported models based on latest provider SDKs (2026 Q2)
- Latency benchmarks: Groq < Gemini < Claude < GPT
- Throughput: Ollama (local) > Groq > others (depends on internet)

---

**Last Updated**: 2026-04-04
**Maintainer**: AEGIS Lab Red Team
**Status**: Production (Thesis Integration Ready)
