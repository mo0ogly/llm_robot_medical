# PromptForge Quick-Fix Recommendations

## Priority 1: Do These First (30 min total)

### 1.1 Add Per-Provider Timestamps in Comparison Response
**File**: `/backend/routes/llm_providers_routes.py` (line ~352)
**Change**:
```python
# BEFORE:
results[provider] = {
    "status": "ok" if response else "error",
    "response": response or "",
    "tokens": len(response) if response else 0,
    "duration_ms": duration_ms
}

# AFTER:
results[provider] = {
    "status": "ok" if response else "error",
    "response": response or "",
    "tokens": len(response) if response else 0,
    "duration_ms": duration_ms,
    "timestamp": time.time()  # <-- ADD
}
```
**Why**: Enables time-series analysis for thesis. Comparison results currently lack temporal metadata.

---

### 1.2 Create ProviderStatus Enum
**File**: Create `/backend/agents/attack_chains/provider_status.py` (new file)
**Content**:
```python
from enum import Enum

class ProviderStatus(Enum):
    """Standardized provider status values."""
    OK = "ok"
    ERROR = "error"
    TIMEOUT = "timeout"
    RATE_LIMITED = "rate_limited"

    def __str__(self):
        return self.value
```

**Then update** `/backend/routes/llm_providers_routes.py`:
```python
# Add import:
from agents.attack_chains.provider_status import ProviderStatus

# Replace string literals:
# OLD: if response.status_code == 200: return True, "OK"
# NEW: if response.status_code == 200: return True, ProviderStatus.OK.value
```

**Why**: Type safety. Prevents typos in status values.

---

### 1.3 Add API Versioning Prefix
**File**: `/backend/routes/llm_providers_routes.py` (line 19)
**Change**:
```python
# BEFORE:
router = APIRouter(prefix="/api/redteam", tags=["llm-providers"])

# AFTER:
router = APIRouter(prefix="/api/v1/redteam", tags=["llm-providers"])
```

**Then update** `/frontend/src/components/redteam/PromptForgeMultiLLM.jsx`:
```javascript
// OLD: fetch("/api/redteam/llm-providers")
// NEW: fetch("/api/v1/redteam/llm-providers")
```
(4 fetch calls: lines 42, 61, 87, 159)

**Then update documentation**: `/backend/prompts/LLM_PROVIDERS_README.md`
```markdown
# OLD: GET `/api/redteam/llm-providers`
# NEW: GET `/api/v1/redteam/llm-providers`
```

**Why**: Prepares for future v2 APIs without breaking v1 clients. Industry best practice.

---

## Priority 2: Schedule for Next Sprint (1-2 hours)

### 2.1 Improve Error Handling with Custom Exceptions
**Create**: `/backend/exceptions.py`
```python
class ProviderError(Exception):
    """Base class for provider-related errors."""
    pass

class ProviderConnectionError(ProviderError):
    """Raised when provider endpoint is unreachable."""
    pass

class ProviderAuthError(ProviderError):
    """Raised when API key is missing or invalid."""
    pass

class ProviderTimeoutError(ProviderError):
    """Raised when provider exceeds timeout."""
    pass

class ProviderRateLimitError(ProviderError):
    """Raised when provider rate-limits the request."""
    pass
```

**Update** `llm_providers_routes.py:88-109`:
```python
async def test_provider_health(provider: str, config_provider: Dict[str, Any]) -> tuple[bool, str]:
    try:
        if provider == "ollama":
            import httpx
            async with httpx.AsyncClient(timeout=5.0) as client:
                host = config_provider.get("host", "http://127.0.0.1:11434")
                health_path = config_provider.get("health_check_path", "/api/tags")
                response = await client.get(f"{host}{health_path}")
                if response.status_code == 200:
                    return True, ProviderStatus.OK.value
                else:
                    return False, f"HTTP {response.status_code}"
        else:
            api_key = get_provider_api_key(provider)
            if not api_key:
                return False, "API key not configured"
            return True, ProviderStatus.OK.value
    except httpx.ConnectError as e:
        raise ProviderConnectionError(f"Cannot reach {provider}: {e}")
    except httpx.TimeoutException as e:
        raise ProviderTimeoutError(f"Provider {provider} timeout: {e}")
    except Exception as e:
        raise ProviderError(f"Unknown error testing {provider}: {e}")
```

**Why**: Better debugging. Distinguishes between connection issues, auth issues, and timeouts. Enables smarter error recovery.

---

### 2.2 Add JSDoc Type Comments to React Component
**File**: `/frontend/src/components/redteam/PromptForgeMultiLLM.jsx`

Add at top of file (after imports):
```javascript
/**
 * PromptForgeMultiLLM Component
 *
 * Multi-LLM testing interface for AEGIS Red Team Lab.
 * Supports streaming single-provider tests and parallel provider comparison.
 *
 * Providers: Ollama, Claude, GPT-4, Gemini, Grok, Groq
 *
 * @component
 * @returns {React.ReactElement} The rendered PromptForge interface
 */
```

Add function JSDoc (before `const handleTestSingle`):
```javascript
/**
 * Test prompt on single provider with streaming response.
 *
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If fetch fails or streaming breaks
 */
```

**Why**: Helps other developers understand component API. Improves IDE autocomplete.

---

### 2.3 Refactor React State with useReducer (Optional)
**File**: `/frontend/src/components/redteam/PromptForgeMultiLLM.jsx` (lines 22-36)

Current approach (9 useState calls):
```javascript
const [selectedProvider, setSelectedProvider] = useState("ollama");
const [prompt, setPrompt] = useState("");
// ... etc
```

**Better approach**:
```javascript
const initialState = {
  ui: {
    selectedProvider: "ollama",
    selectedModel: "",
    compareMode: false,
    isStreaming: false
  },
  input: {
    prompt: "",
    systemPrompt: "",
    temperature: 0.7,
    maxTokens: 1024
  },
  output: {
    single: "",
    comparison: {}
  },
  ui_lists: {
    providers: [],
    models: []
  },
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROVIDER':
      return { ...state, ui: { ...state.ui, selectedProvider: action.payload } };
    case 'SET_PROMPT':
      return { ...state, input: { ...state.input, prompt: action.payload } };
    // ... etc
    case 'START_STREAMING':
      return { ...state, ui: { ...state.ui, isStreaming: true } };
    case 'STOP_STREAMING':
      return { ...state, ui: { ...state.ui, isStreaming: false } };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
```

**Why**: State management becomes more explicit. Easier to track state transitions. Better for complex UIs.

---

## Monitoring Checklist for Thesis

Before using PromptForge for N>=30 trials, verify:

- [ ] Per-provider timestamps are being captured (ARCH-03 fix)
- [ ] Health checks don't timeout (15 sec max)
- [ ] Streaming responses don't drop mid-token
- [ ] Comparison results include all enabled providers
- [ ] Error messages are actionable (not generic)
- [ ] Logs include sufficient metadata for debugging

---

## Testing Checklist After Changes

```bash
# 1. Unit tests for new exceptions
pytest backend/tests/test_exceptions.py -v

# 2. Integration test for all endpoints
pytest backend/tests/test_llm_providers_routes.py -v

# 3. Frontend build check
cd frontend && npm run build

# 4. Manual test: Visit http://localhost:5173/redteam/prompt-forge
# - Select each provider
# - Run single test
# - Run comparison
# - Verify timestamps in browser DevTools
# - Export and verify JSON includes timestamps
```

---

**Estimated Time to Complete All Priority 1 Items**: 30-45 minutes
**Estimated Time to Complete Priority 2**: 2-3 hours
**Risk Level**: Low (changes are additive, no breaking refactors)
**Recommended Implementation Order**: 1.3 → 1.1 → 1.2 → 2.1 → 2.2 → 2.3
