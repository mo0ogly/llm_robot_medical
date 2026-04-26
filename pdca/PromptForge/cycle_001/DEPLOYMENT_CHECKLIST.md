# PromptForge Deployment Checklist

## Phase 1: Pre-Deployment (Local Testing)

### Code Quality
- [ ] No `console.log` statements left in PromptForgeMultiLLM.jsx
- [ ] No hardcoded URLs (all use `/api/v1/redteam/...` or env vars)
- [ ] No console errors in browser DevTools
- [ ] No Python syntax errors: `python -m py_compile backend/routes/llm_providers_routes.py`
- [ ] No unused imports in Python files

### Testing
- [ ] Backend starts without errors: `./aegis.ps1 start backend`
- [ ] Frontend builds: `cd frontend && npm run build`
- [ ] No warnings in build output

### Configuration
- [ ] `llm_providers_config.json` is valid JSON: `jq . backend/prompts/llm_providers_config.json`
- [ ] `llm_providers_config.json` has all 6 providers declared
- [ ] Ollama is running (or will be started before testing)
- [ ] API keys are set in environment (if testing cloud providers)

### Documentation
- [ ] README.md updated with PromptForge section
- [ ] LLM_PROVIDERS_README.md is current (dated 2026-04-04 or later)
- [ ] API endpoint examples in docs match code
- [ ] Thesis integration section mentions δ⁰ framework

---

## Phase 2: Functional Testing (Happy Path)

### Test Case 1: Provider List
```bash
curl http://localhost:8042/api/redteam/llm-providers
```
Expected:
- Status code: 200
- Response includes: `"providers": [{...}, {...}, ...]`
- Each provider has: `name`, `display_name`, `type`, `models`, `status`

### Test Case 2: Single Provider Models
```bash
curl http://localhost:8042/api/redteam/llm-providers/ollama/models
```
Expected:
- Status code: 200
- Response: `{"provider": "ollama", "models": [...], "default_model": "..."}`

### Test Case 3: Provider Health Check
```bash
curl http://localhost:8042/api/redteam/llm-providers/ollama/status
```
Expected:
- Status code: 200
- Response: `{"provider": "ollama", "status": "ok", "latency_ms": N}`

### Test Case 4: Single Provider Test (Streaming)
```bash
curl -X POST http://localhost:8042/api/redteam/llm-test \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "ollama",
    "model": "llama3.2:latest",
    "prompt": "What is 2+2?",
    "temperature": 0.7,
    "max_tokens": 256
  }'
```
Expected:
- Status code: 200
- Content-Type: `text/event-stream`
- Response is SSE format: `data: {"token": "...", ...}\n\n`
- Final event: `data: {"type": "complete", "duration_ms": ..., "tokens": ...}`

### Test Case 5: Comparison (Parallel)
```bash
curl -X POST http://localhost:8042/api/redteam/llm-compare \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain prompt injection in one sentence.",
    "temperature": 0.7,
    "max_tokens": 512,
    "providers": ["ollama"]
  }'
```
Expected:
- Status code: 200
- Response: `{"results": {"ollama": {"status": "ok", "response": "...", "tokens": N, "duration_ms": N}}, "timestamp": ...}`

### Test Case 6: React UI Loading
1. Open: http://localhost:5173/redteam/prompt-forge
2. Expected:
   - Page loads without 404
   - Title visible: "Prompt Forge — Test Multi-LLM"
   - Provider dropdown shows "Ollama (Local)"
   - Model dropdown is populated
   - Text inputs for prompt/system_prompt appear
   - Buttons visible: Test Single, Compare All, Export, Clear
   - Parameters sliders visible: temperature, max_tokens

### Test Case 7: React Single Test
1. Enter prompt: "Hello, what is your name?"
2. Click "Test Single"
3. Expected:
   - Output area shows streaming text
   - Progress: "Testing..." appears in button
   - After completion: statistics shown (tokens, T/s)

### Test Case 8: React Comparison
1. Enter prompt: "Explain the weather."
2. Click "Compare All"
3. Expected:
   - Results displayed in grid (one card per provider)
   - Each card shows: provider name, status (ok/error), duration_ms, tokens
   - Response text visible in each card

### Test Case 9: React Export
1. Run a test (single or comparison)
2. Click "Export"
3. Expected:
   - JSON file downloads: `prompt_forge_TIMESTAMP.json`
   - File contains: prompt, system_prompt, provider(s), parameters, results, timestamp

### Test Case 10: Error Handling
1. Stop Ollama: `ollama quit` or kill process
2. Click "Test Single"
3. Expected:
   - Error message appears: "Test failed: ..."
   - UI remains responsive
   - Can retry after Ollama restarts

---

## Phase 3: Performance & Load Testing

### Test: Latency Baseline
```bash
time curl http://localhost:8042/api/redteam/llm-providers
```
Expected: < 100ms (local JSON load)

### Test: Streaming Token Rate
Run test with 512 max_tokens, measure tokens/sec:
```
Expected: > 10 tokens/sec for Ollama (local)
Expected: > 5 tokens/sec for cloud providers
```

### Test: Parallel Comparison Timeout
Set very long timeout (60+ sec), run comparison on 3 providers:
```bash
curl --max-time 120 -X POST http://localhost:8042/api/redteam/llm-compare ...
```
Expected: All results returned within timeout, none dropped

---

## Phase 4: Data Quality Verification

### Timestamp Presence
1. Run comparison test
2. Check JSON response for `"timestamp"` field
3. Expected: Present in results object AND in each provider result (if Priority 1.1 applied)

### Response Completeness
1. Run 5 tests with max_tokens=100
2. Export each result
3. Check: No truncated tokens, no data corruption

### Error Message Clarity
1. Stop backend
2. Try API call from frontend
3. Expected: User-friendly error message, not stack trace

---

## Phase 5: Documentation Verification

### README Sections
- [ ] PromptForge introduction and overview
- [ ] Quick start guide is accurate
- [ ] Configuration file documented with examples
- [ ] All 7 API endpoints listed and explained
- [ ] Request/Response examples provided
- [ ] Troubleshooting section covers common issues
- [ ] Adding new provider instructions are clear

### API Documentation
- [ ] Each endpoint has:
  - [ ] HTTP method (GET/POST)
  - [ ] URL path
  - [ ] Request model (fields, types, defaults)
  - [ ] Response model (fields, types)
  - [ ] Example request JSON
  - [ ] Example response JSON
  - [ ] Error codes and messages

### Inline Code Documentation
- [ ] Python functions have docstrings (llm_factory.py, llm_providers_routes.py)
- [ ] React component has description at top
- [ ] Complex logic has explanatory comments

---

## Phase 6: Security Baseline

### Secrets Management
- [ ] No API keys in code (all via env vars)
- [ ] No secrets in git: `git log --full-history -p | grep -i "api_key\|password\|secret"`
- [ ] .gitignore includes: `.env`, `secrets.*`, `config.local.json`

### Input Validation
- [ ] Pydantic models validate request bodies (BaseModel used)
- [ ] Provider name validated before use (validate_provider_exists)
- [ ] Prompt length limited (max_tokens parameter enforced)

### Error Handling
- [ ] No stack traces leaked to client (use HTTPException with status codes)
- [ ] Sensitive fields removed from responses (auth keys masked)
- [ ] Logging doesn't include secrets

---

## Phase 7: Monitoring Setup

### Logging
- [ ] Backend logs go to `logs/backend.log`
- [ ] Frontend logs go to browser console (no sensitive data)
- [ ] Error events are logged with context (provider, timestamp, error type)

### Health Checks
- [ ] Endpoint: `GET /api/redteam/llm-providers` (implicit health check)
- [ ] Response includes provider status ("ok" or "error")
- [ ] Latency measurable (add to monitoring)

### Metrics to Track (for thesis)
- [ ] Average response time per provider
- [ ] Success rate per provider
- [ ] Token throughput (tokens/sec)
- [ ] Error rate by type

---

## Phase 8: Final Sign-Off

### Go/No-Go Criteria

**PASS if ALL of the following are TRUE**:
- ✓ All Phase 1-5 tests pass
- ✓ No critical errors in logs
- ✓ Documentation is current and accurate
- ✓ Security baseline met
- ✓ Performance meets SLAs (< 100ms list, > 10 T/s streaming)
- ✓ Error handling is user-friendly
- ✓ Priority 1 quick fixes implemented (if applicable)

**HOLD if ANY of the following are TRUE**:
- Streaming responses drop tokens
- API returns inconsistent schemas between providers
- Documentation is outdated
- Secrets found in code/git
- Performance degrades with multiple concurrent requests

### Deployment Approval

```
Deployer: ________________________  Date: ________

Review: All Phase 1-8 checks passed

Architecture Audit Score: 84/100
Risk Level: LOW
Confidence: HIGH

✓ APPROVED FOR PRODUCTION

Next Review: After first N>=30 thesis trials
```

---

## Post-Deployment (Day 1)

### Smoke Tests
- [ ] Web UI loads without errors
- [ ] Can select provider and model
- [ ] Can enter prompt and run test
- [ ] Can export results
- [ ] Browser console has no errors

### Monitoring
- [ ] Check logs for errors: `tail -f logs/backend.log`
- [ ] Check response times (first 10 requests)
- [ ] Verify data is being captured correctly

### Feedback Collection
- [ ] Any unexpected behavior reported?
- [ ] Documentation accurate for real users?
- [ ] Performance acceptable?

---

## Rollback Plan

If critical issue found post-deployment:

1. Stop backend: `./aegis.ps1 stop backend`
2. Revert code: `git revert <commit-sha>`
3. Restart backend: `./aegis.ps1 start backend`
4. Verify: `curl http://localhost:8042/api/redteam/llm-providers`
5. Analyze: Check logs and issue ticket

---

## Success Criteria

✓ PromptForge is production-ready when:
1. All functional tests pass
2. Documentation is accurate
3. No security issues
4. Performance is acceptable
5. Error handling is user-friendly
6. Thesis integration works correctly
7. Data export is reproducible

---

**Deployment Owner**: [Your Name]
**Date Prepared**: 2026-04-04
**Last Updated**: 2026-04-04
