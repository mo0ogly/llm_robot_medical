# PROMPTFORGE SECURITY FIXES — IMPLEMENTATION EXAMPLES

**Cycle**: PDCA 001
**Date**: April 4, 2026
**Quick Wins**: 3 security improvements (< 1 hour total)

---

## QF-001: Fix Exception Leakage in Streaming (5 minutes)

### Problem

Current code in `backend/routes/llm_providers_routes.py` (lines 284-285):

```python
except Exception as e:
    logger.error(f"Streaming error: {e}")
    yield f'data: {json.dumps({"error": str(e)})}\n\n'
    # PROBLEM: str(e) can expose API details like:
    # - "AuthenticationError: API token has expired at ..."
    # - "ConnectionError: https://api.anthropic.com/v1/messages: 401 Unauthorized"
    # - Full Python traceback with internal URLs
```

### Solution

Replace exception details with generic message:

```python
except Exception as e:
    logger.error(f"Streaming error: {e}", exc_info=True)
    # exc_info=True includes full traceback in logs (secure server-side)
    yield f'data: {json.dumps({"error": "Provider request failed"})}\n\n'
    # Client sees only generic message
```

### Changes Required

**File**: `backend/routes/llm_providers_routes.py`

**Change 1** (lines 247-294):
```python
async def event_stream():
    """Stream response tokens as SSE events."""
    try:
        start_time = time.time()

        # Call the LLM
        response = await call_llm(
            provider=request.provider,
            model=request.model,
            prompt=request.prompt,
            system_prompt=request.system_prompt,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )

        if response is None:
            yield f'data: {json.dumps({"error": "LLM call failed"})}\n\n'
            return

        # Stream response token by token
        for char in response:
            yield f'data: {json.dumps({
                "token": char,
                "provider": request.provider,
                "timestamp": time.time()
            })}\n\n'
            await asyncio.sleep(0.01)

        # Final summary
        duration_ms = int((time.time() - start_time) * 1000)
        yield f'data: {json.dumps({
            "type": "complete",
            "duration_ms": duration_ms,
            "tokens": len(response)
        })}\n\n'

    except Exception as e:
        logger.error(f"Streaming error: {e}", exc_info=True)  # ← FIXED: Added exc_info=True
        yield f'data: {json.dumps({"error": "Provider request failed"})}\n\n'  # ← FIXED: Generic message
```

**Change 2** (lines 345-366):
```python
# Collect results
results = {}
for provider, task in tasks.items():
    try:
        start_time = time.time()
        response = await task
        duration_ms = int((time.time() - start_time) * 1000)

        results[provider] = {
            "status": "ok" if response else "error",
            "response": response or "",
            "tokens": len(response) if response else 0,
            "duration_ms": duration_ms
        }
    except Exception as e:
        logger.error(f"Error testing {provider}: {e}", exc_info=True)  # ← FIXED: Added exc_info=True
        results[provider] = {
            "status": "error",
            "response": None,
            "tokens": 0,
            "duration_ms": 0,
            "error": "Provider request failed"  # ← FIXED: Generic message, no str(e)
        }
```

### Verification

After applying fix:

```bash
# Test with invalid provider (should get generic message)
curl -X POST http://localhost:8042/api/redteam/llm-test \
  -H "Content-Type: application/json" \
  -d '{"provider":"invalid","model":"test","prompt":"test"}'

# Should see: {"error":"Provider request failed"}
# NOT: {"error":"Provider 'invalid' not found"}  (this is OK — it's a validation error)
# NOT: {"error":"ConnectionError: https://api.anthropic.com/v1/..."}  (this would be BAD)

# Check server logs for full traceback:
tail -f logs/backend.log | grep "Streaming error"
# Should see: "Streaming error: <detailed exception>, traceback: ..."
```

---

## QF-002: Add Cache/Rate Limiting to Health Check (15 minutes)

### Problem

Current code in `backend/routes/llm_providers_routes.py` (lines 206-226):

```python
@router.get("/llm-providers/{provider}/status")
async def get_provider_status(provider: str):
    """Check health status of a specific provider."""
    config = load_provider_config()

    if not validate_provider_exists(config, provider):
        raise HTTPException(status_code=404, detail=f"Provider '{provider}' not found")

    provider_config = config["providers"][provider]
    start_time = time.time()
    is_healthy, health_msg = await test_provider_health(provider, provider_config)
    # PROBLEM: Every request triggers test_provider_health()
    # This makes real HTTP calls to remote providers
    # An attacker can spam: curl http://localhost:8042/api/redteam/llm-providers/google/status &
    # Result: DoS on Google API quota, exposes that GOOGLE_API_KEY is configured
```

### Solution

Add in-memory cache with 10-second TTL:

```python
# At top of file, after imports
import time
from typing import Dict, Tuple, Optional

# Cache: {provider_name: (result_dict, timestamp)}
_status_cache: Dict[str, Tuple[Dict, float]] = {}
_CACHE_TTL_SECONDS = 10

@router.get("/llm-providers/{provider}/status")
async def get_provider_status(provider: str):
    """Check health status of a specific provider."""
    config = load_provider_config()

    if not validate_provider_exists(config, provider):
        raise HTTPException(status_code=404, detail=f"Provider '{provider}' not found")

    # Check cache first
    current_time = time.time()
    if provider in _status_cache:
        cached_result, cached_time = _status_cache[provider]
        if current_time - cached_time < _CACHE_TTL_SECONDS:
            # Cache is fresh, return it
            return cached_result

    # Cache miss or stale, compute fresh result
    provider_config = config["providers"][provider]
    start_time = time.time()
    is_healthy, health_msg = await test_provider_health(provider, provider_config)
    latency_ms = int((time.time() - start_time) * 1000)

    result = {
        "provider": provider,
        "status": "ok" if is_healthy else "error",
        "message": health_msg,
        "latency_ms": latency_ms,
        "type": provider_config.get("type"),
        "timestamp": time.time(),
        "cached": False  # Indicate this is fresh data
    }

    # Store in cache
    _status_cache[provider] = (result, current_time)

    return result
```

### Optional Enhancement: Bypass Cache for Testing

```python
@router.get("/llm-providers/{provider}/status")
async def get_provider_status(provider: str, fresh: bool = False):
    """Check health status of a specific provider.

    Args:
        provider: Provider name
        fresh: If true, bypass cache and fetch fresh status
    """
    config = load_provider_config()

    if not validate_provider_exists(config, provider):
        raise HTTPException(status_code=404, detail=f"Provider '{provider}' not found")

    # Check cache first (unless fresh=true)
    current_time = time.time()
    if not fresh and provider in _status_cache:
        cached_result, cached_time = _status_cache[provider]
        if current_time - cached_time < _CACHE_TTL_SECONDS:
            # Mark as cached
            cached_result["cached"] = True
            cached_result["cache_age_seconds"] = current_time - cached_time
            return cached_result

    # ... rest of function ...
```

### Verification

```bash
# First call (cache miss)
$ time curl http://localhost:8042/api/redteam/llm-providers/google/status
# Response time: ~500ms (real API call)
# Output: {"provider":"google","status":"ok",...,"cached":false}

# Second call immediately (cache hit)
$ time curl http://localhost:8042/api/redteam/llm-providers/google/status
# Response time: <10ms (from cache)
# Output: {"provider":"google","status":"ok",...,"cached":true,"cache_age_seconds":0.5}

# After 11 seconds (cache expired)
$ sleep 11
$ time curl http://localhost:8042/api/redteam/llm-providers/google/status
# Response time: ~500ms (real API call again)
# Output: {"provider":"google","status":"ok",...,"cached":false}

# Bypass cache with fresh=true
$ time curl "http://localhost:8042/api/redteam/llm-providers/google/status?fresh=true"
# Response time: ~500ms (real API call)
# Output: {"provider":"google","status":"ok",...,"cached":false}
```

---

## QF-003: Document Environment Variables (20 minutes)

### Problem

`backend/README.md` doesn't document security setup.

### Solution

Add section to `backend/README.md`:

```markdown
## Environment Variables & Security

### Required for PromptForge

PromptForge requires API keys for cloud LLM providers. All keys are stored in environment variables only (never in code or config files).

#### Anthropic Claude

```bash
export ANTHROPIC_API_KEY="sk-ant-..." # From https://console.anthropic.com/
```

#### OpenAI GPT

```bash
export OPENAI_API_KEY="sk-..." # From https://platform.openai.com/api-keys
```

#### Google Gemini

```bash
export GOOGLE_API_KEY="AIza..." # From https://console.cloud.google.com/apis/credentials
```

#### Groq LPU

```bash
export GROQ_API_KEY="gsk_..." # From https://console.groq.com/keys
```

#### xAI Grok

```bash
export XAI_API_KEY="..." # From https://console.x.ai/
```

#### Optional: OpenAI-Compatible Endpoint

```bash
export OPENAI_COMPAT_BASE_URL="https://custom-api.example.com/v1"
export OPENAI_COMPAT_MODEL="custom-model-name"
export OPENAI_COMPAT_API_KEY="..."
```

#### Local: Ollama (default)

No API key needed. Ensure Ollama is running:

```bash
ollama serve
# or specify custom host
export OLLAMA_HOST="http://127.0.0.1:11434"
export OLLAMA_MODEL="llama3.2:latest"
```

### Development Setup

1. Create `.env` file in `backend/` (git-ignored):

```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
GROQ_API_KEY=gsk_...
XAI_API_KEY=...
```

2. Load before starting server:

```bash
source backend/.env
python -m uvicorn backend.server:app --reload
```

Or use `python-dotenv`:

```bash
pip install python-dotenv
# Code will auto-load .env
```

### Production Setup

**Never commit `.env` files to git.** Use a secrets manager:

- **AWS**: AWS Secrets Manager
- **Google Cloud**: Secret Manager
- **Azure**: Key Vault
- **Generic**: HashiCorp Vault
- **Docker**: Docker Secrets
- **Kubernetes**: Kubernetes Secrets

Example with environment variables directly:

```bash
# CI/CD pipeline sets env vars
export ANTHROPIC_API_KEY=${SECRET_ANTHROPIC_KEY}
export OPENAI_API_KEY=${SECRET_OPENAI_KEY}
# ... etc ...

# Start server
uvicorn backend.server:app --host 0.0.0.0 --port 8042
```

### Security Audit Checklist

Before deploying PromptForge to production:

- [ ] All required API keys are set and non-empty
  ```bash
  for key in ANTHROPIC_API_KEY OPENAI_API_KEY GOOGLE_API_KEY; do
    if [ -z "${!key}" ]; then echo "Missing $key"; exit 1; fi
  done
  ```

- [ ] No `.env` or `.env.*` files are committed to git
  ```bash
  git status | grep .env
  # Should be empty
  ```

- [ ] Verify no secrets in git history
  ```bash
  git log -S "sk-" --oneline | wc -l
  # Should be 0
  ```

- [ ] CORS_ORIGINS is set to production domain
  ```bash
  echo $CORS_ORIGINS
  # Should be https://yourdomain.com (not localhost:5173)
  ```

- [ ] Test error messages don't expose API details
  ```bash
  curl -X POST http://localhost:8042/api/redteam/llm-test \
    -H "Content-Type: application/json" \
    -d '{"provider":"invalid","model":"test","prompt":"test"}'
  # Should see generic "Provider request failed" (not URL/key details)
  ```

- [ ] Server logs don't leak secrets
  ```bash
  grep -rn "sk-\|AIza\|Bearer" logs/
  # Should be empty
  ```

### Environment Variable Reference

| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| `ANTHROPIC_API_KEY` | If using Anthropic | None | `sk-ant-abc123...` |
| `OPENAI_API_KEY` | If using OpenAI | None | `sk-proj-abc123...` |
| `GOOGLE_API_KEY` | If using Google | None | `AIza...` |
| `GROQ_API_KEY` | If using Groq | None | `gsk_...` |
| `XAI_API_KEY` | If using xAI | None | `...` |
| `OLLAMA_HOST` | Always (for Ollama) | `http://localhost:11434` | `http://127.0.0.1:11434` |
| `OLLAMA_MODEL` | Always (for Ollama) | `llama3.2` | `llama3.2:latest` |
| `LLM_PROVIDER` | No | `ollama` | `openai`, `anthropic`, `google`, `groq`, `xai` |
| `CORS_ORIGINS` | For CORS control | `http://localhost:5173,...` | `https://yourdomain.com` |

### Logging

All API calls and errors are logged to `logs/backend.log`:

```
2026-04-04 12:00:00 INFO [llm_providers_routes] Testing provider: anthropic
2026-04-04 12:00:01 INFO [llm_providers_routes] Response: 256 tokens in 1234ms
2026-04-04 12:00:02 ERROR [llm_providers_routes] Provider request failed
2026-04-04 12:00:02 ERROR [llm_providers_routes] (Full exception logged server-side, not sent to client)
```

**Important**: Logs are stored on server only, never sent to clients. Full exception tracebacks are logged server-side for debugging; clients see only generic error messages.

---

```

### Where to Insert

Add this section to `backend/README.md`:
- **After**: "Installation" or "Quick Start" section
- **Before**: "Architecture" or "API Documentation" section
- **As**: New top-level section titled "## Environment Variables & Security"

---

## Summary of Changes

| Fix | File | Lines | Time | Risk |
|-----|------|-------|------|------|
| QF-001 | llm_providers_routes.py | 284-285, 359-365 | 5 min | Medium |
| QF-002 | llm_providers_routes.py | 206-226 | 15 min | Low |
| QF-003 | backend/README.md | New section | 20 min | None |

**Total Effort**: ~40 minutes
**Testing**: ~10 minutes
**Verification**: ~10 minutes

**Total Time to Production Ready**: ~1 hour

---

## Post-Implementation Checklist

- [ ] QF-001 implemented and tested
- [ ] QF-002 implemented and tested
- [ ] QF-003 documented and reviewed
- [ ] All changes committed to git
- [ ] Tests still pass (if applicable)
- [ ] Deployment checklist completed
- [ ] Audit sign-off obtained

---

**Audit Completion**: April 4, 2026
**Implementation Target**: Before Cycle 1 completion
**Verification**: During Cycle 1 Check phase
