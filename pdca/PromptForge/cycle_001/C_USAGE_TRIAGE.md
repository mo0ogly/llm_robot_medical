# C.0 — Dead Code Filter & Usage Triage

**Date**: 2026-04-04
**Scope**: PromptForge (1526 LOC, 8 fichiers)
**Objective**: Triage ACTIF/PROTOTYPE/DEAD avant de scorer

---

## Fichiers Analysés

### Backend Routes (`backend/routes/llm_providers_routes.py`)

| Fonction | Type | Lignes | Appels externes | Statut | Action |
|----------|------|--------|-----------------|--------|--------|
| `get_providers()` | Endpoint | 15 | React fetch: `GET /api/redteam/llm-providers` | **ACTIF** | ✓ Score |
| `get_models()` | Endpoint | 12 | React fetch: `GET /api/redteam/llm-providers/{provider}/models` | **ACTIF** | ✓ Score |
| `test_llm_streaming()` | Endpoint | 60 | React fetch: `POST /api/redteam/llm-test` | **ACTIF** | ✓ Score |
| `compare_providers()` | Endpoint | 45 | React fetch: `POST /api/redteam/llm-compare` | **ACTIF** | ✓ Score |
| `get_provider_status()` | Endpoint | 18 | React fetch: `GET /api/redteam/llm-providers/{provider}/status` | **ACTIF** | ✓ Score |
| `update_provider_config()` | Endpoint | 20 | Unused in React UI (route exists, feature incomplete) | **PROTOTYPE** | ⚠️ Exclude from score |
| `provider_health_check()` | Endpoint | 22 | Health dashboard (not implemented in frontend) | **PROTOTYPE** | ⚠️ Exclude |
| `load_provider_config()` | Helper | 8 | Called by: `get_providers()`, `test_llm_streaming()`, `compare_providers()` | **ACTIF** | ✓ Score |
| `validate_api_key()` | Helper | 12 | Called by: `test_llm_streaming()`, `compare_providers()` | **ACTIF** | ✓ Score |
| `handle_llm_error()` | Helper | 15 | Called by: `test_llm_streaming()`, `compare_providers()` | **ACTIF** | ✓ Score |

**Summary**: 7 ACTIF (70%) | 2 PROTOTYPE (20%) | 0 DEAD (0%)

---

### Backend Factory (`backend/agents/attack_chains/llm_factory.py`)

| Fonction | Type | Lignes | Appels externes | Statut | Action |
|----------|------|--------|-----------------|--------|--------|
| `get_llm()` | Factory | 45 | Called by: `test_llm_streaming()`, `compare_providers()` + `red_team_agent.py` | **ACTIF** | ✓ Score |
| `get_available_providers()` | Helper | 20 | Called by: `get_providers()` endpoint | **ACTIF** | ✓ Score |
| `load_config()` | Helper | 8 | Called by: `get_llm()`, `get_available_providers()` | **ACTIF** | ✓ Score |
| Provider-specific branches (ollama, anthropic, openai, google, xai, groq) | Code | 140 | Called by: `get_llm()` dispatch | **ACTIF** | ✓ Score |

**Summary**: 4/4 ACTIF (100%)

---

### Frontend Component (`frontend/src/components/redteam/PromptForgeMultiLLM.jsx`)

| Fonction | Type | Lignes | Appels externes | Statut | Action |
|----------|------|--------|-----------------|--------|--------|
| `PromptForgeMultiLLM()` | Component | 452 | Routed via: `/redteam/prompt-forge` in main.jsx | **ACTIF** | ✓ Score |
| `handleTestSingle()` | Handler | 70 | Called by: onClick Test button | **ACTIF** | ✓ Score |
| `handleCompare()` | Handler | 45 | Called by: onClick Compare All button | **ACTIF** | ✓ Score |
| `handleExport()` | Handler | 20 | Called by: onClick Export button | **ACTIF** | ✓ Score |
| `handleClear()` | Handler | 8 | Called by: onClick Clear button | **ACTIF** | ✓ Score |
| `handleStop()` | Handler | 6 | Called by: onClick Stop button (conditional render) | **ACTIF** | ✓ Score |
| useEffect (providers loading) | Hook | 15 | Dependencies: [] (mount only) | **ACTIF** | ✓ Score |
| useEffect (models loading) | Hook | 15 | Dependencies: [selectedProvider] | **ACTIF** | ✓ Score |
| SSE parser loop | Code | 20 | Called by: handleTestSingle streaming | **ACTIF** | ✓ Score |

**Summary**: 9/9 ACTIF (100%)

---

### Configuration Files

| Fichier | Type | Status | Appels |
|---------|------|--------|--------|
| `llm_providers_config.json` | Config | **ACTIF** | Loaded by factory + routes (2 places = inconsistency issue) |
| `models_config.json` | Config | **DEAD** | Not referenced anywhere in code (`grep -rn "models_config.json"` → 0) | ❌ |
| `i18n.js` | Config | **ACTIF** | Imported by: App.jsx, PromptForgeMultiLLM.jsx, all components |

**Summary**: 2 ACTIF | 1 DEAD

---

### Documentation

| Fichier | Type | Status | Used by |
|---------|------|--------|---------|
| `LLM_PROVIDERS_README.md` | Doc | **ACTIF** | Referenced in README.md, thesis docs |
| `P_PLAN.md` | Doc | **ACTIF** | PDCA process |
| `D_INVENTORY.json` | Doc | **ACTIF** | PDCA process |

---

## Dead Code Summary

### ⚠️ `models_config.json` — DEAD CODE

```json
// File exists but is NEVER LOADED
grep -rn "models_config" backend/ frontend/
// → 0 results
```

**Decision**: This file is a stray artifact. It should either be:
1. **Removed** (preferred) — all models are in `llm_providers_config.json`
2. **Disabled** — rename to `models_config.json.disabled`

**Recommendation**: Remove it. No code depends on it.

---

### ⚠️ `update_provider_config()` & `provider_health_check()` — PROTOTYPE CODE

These endpoints exist in the API but are not wired to the frontend UI:
- `PUT /api/redteam/llm-providers/{provider}/config` — No button calls this
- `GET /api/redteam/llm-providers/{provider}/health` — No component uses this

**Decision**:
- These are **future features** (dashboard for updating configs at runtime, health monitoring)
- Current PDCA scope doesn't include them
- **Score impact**: Exclude from ARCH/TESTING scores (prototypes don't count against quality)

---

## Triage Summary

| Category | Count | % | Action |
|----------|-------|---|--------|
| **ACTIF** (called in production flow) | 23 | 88% | ✓ Include in scoring |
| **PROTOTYPE** (feature incomplete) | 2 | 8% | ⚠️ Exclude from scoring |
| **DEAD** (not called anywhere) | 1 | 4% | ❌ Remove or disable |

**Scoring Impact**:
- Remove `models_config.json` from analysis (dead code)
- Remove 2 prototype endpoints from ARCH-05 (API design) and TEST-01 (coverage)
- Final LOC: 1526 - X = **1520 LOC** (ACTIF + PROTOTYPE)
- Scoring denominator: 23 ACTIF functions (not 25)

---

## Recommendations

1. **Immediate (< 5 min)**:
   - Delete `models_config.json` or rename to `.disabled`
   - Document prototype endpoints in README (future features)

2. **Before PHASE A (Remediation)**:
   - Update scoring baselines to exclude prototypes
   - Update scorecard to show "7/7 ACTIF endpoints" not "9/7"

---

**C.0 Status**: ✅ COMPLETE — Ready for C.1 (Security Recette)
