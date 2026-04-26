# PDCA PLAN — PromptForge Multi-LLM Testing Interface (Cycle 1)

**Date**: 2026-04-04
**Scope**: PromptForge — Multi-LLM Testing Interface (1526 LOC, 6 providers, 7 API endpoints)
**Domains**: Security, Testing, Architecture
**Cycle**: 1 (Baseline)
**Benchmark**: promptfoo (external LLM testing framework reference)

---

## OBJECTIFS CYCLE 1

| Domain | Target Score | Weight | Critical Checks | Status |
|--------|-------------|--------|-----------------|--------|
| **Security** | 95/100 | 40% | API key mgmt, no hardcoding, auth polymorphism | TBD |
| **Testing** | 85/100 | 35% | Unit tests, integration tests, streaming correctness | TBD |
| **Architecture** | 90/100 | 25% | Single source of truth, extensibility, documentation | TBD |
| **GLOBAL** | 90/100 | — | Weighted average | TBD |

---

## PÉRIMÈTRE AUDIT

**Fichiers analysés** (1526 LOC):
- `frontend/src/components/redteam/PromptForgeMultiLLM.jsx` (452 LOC)
- `backend/routes/llm_providers_routes.py` (425 LOC)
- `backend/agents/attack_chains/llm_factory.py` (371 LOC, étendu)
- `backend/prompts/llm_providers_config.json` (278 LOC)
- `backend/prompts/LLM_PROVIDERS_README.md` (384 LOC, doc)
- `frontend/src/i18n.js` (modifications, 9 clés trilangues)
- `frontend/src/main.jsx` (modifications, 1 route ajoutée)
- `backend/server.py` (modifications, import + router registration)

**API Endpoints** (7):
1. `GET /api/redteam/llm-providers` — List providers
2. `GET /api/redteam/llm-providers/{provider}/models` — List models per provider
3. `POST /api/redteam/llm-test` — Stream single provider (SSE)
4. `POST /api/redteam/llm-compare` — Parallel multi-provider test
5. `GET /api/redteam/llm-providers/{provider}/status` — Health check
6. `PUT /api/redteam/llm-providers/{provider}/config` — Update config
7. `GET /api/redteam/llm-providers/{provider}/health` — Detailed latency check

**React Components** (1):
- `PromptForgeMultiLLM` — 452 LOC, 5 fetch calls, SSE streaming parser, error handling

**Providers Supported** (6):
- Ollama (local, 2 models)
- Claude (Anthropic, 3 models)
- GPT (OpenAI, 3 models)
- Gemini (Google, 3 models)
- Grok (xAI, 2 models)
- Groq (LPU, 3 models)

---

## PROMPTS D'AUDIT POUR AGENTS (PHASE D)

### AUDIT 1 — SÉCURITÉ (Domain Weight: 40%)

**Agent**: Brainstorming Agent — Security Audit
**Target Cycle**: Phase D.2 (brainstorming agents parallèles)
**Output Expected**: `D_BRAINSTORM/security.md`

#### Prompt Audit Sécurité

```
Tu es un auditeur de sécurité spécialisé dans les API FastAPI et les composants React.

CONTEXTE:
- Projet: PromptForge — Multi-LLM Testing Interface (poc_medical, 2026-04-04)
- Scope: 7 API endpoints, 1 composant React principal, support 6 providers (Ollama, Claude, GPT, Gemini, Grok, Groq)
- Benchmark: Analyse comparative avec promptfoo (framework LLM testing existant, se focaliser sur sa gestion des credentials)
- LOC: 1526 LOC répartis dans: routes (425), composant (452), factory (371), config JSON (278)

FICHIERS À AUDITER (attachés ou fournis):
1. backend/routes/llm_providers_routes.py — API endpoints pour tester les LLMs
2. frontend/src/components/redteam/PromptForgeMultiLLM.jsx — Interface utilisateur React
3. backend/agents/attack_chains/llm_factory.py — Factory pattern pour instanciation LLMs
4. backend/prompts/llm_providers_config.json — Configuration des providers

CRITÈRES D'AUDIT SÉCURITÉ (voir SCORING_CONFIG.json):

Domaine: SECURITY (40% du score global)
Target score: 95/100
Checks critiques: [SEC-01, SEC-03, SEC-06]

SEC-01: API keys never hardcoded, always env vars
  → Vérifier que AUCUNE clé API n'est stockée en dur dans le code
  → Vérifier que seul les env vars (ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.) sont utilisées
  → Commande check: grep -rn "sk-\|api_key\|token" backend/routes/ backend/agents/ —discard les strings en commentaire

SEC-02: Auth headers polymorphic (x-api-key, Authorization, query param)
  → Les providers utilisent différents formats d'auth:
     - Anthropic: header "x-api-key"
     - OpenAI: header "Authorization: Bearer sk-..."
     - Google: query param "?key=..."
     - xAI: header "Authorization: Bearer ..."
  → Vérifier que les headers sont construits CORRECTEMENT pour chaque provider
  → Vérifier qu'aucun provider n'envoie sa clé API en clair dans les logs

SEC-03: No credentials in JSON config file (BLOQUANT)
  → backend/prompts/llm_providers_config.json NE DOIT PAS contenir de vraies clés API
  → Vérifier que seules les clés d'ENV VARS sont stockées (ex: "api_key_env": "ANTHROPIC_API_KEY")
  → Si une clé commence par "sk-", "AIza", "gsk_" → VIOLATION CRITIQUE

SEC-04: Environment variables validated before use
  → Avant d'utiliser os.getenv("ANTHROPIC_API_KEY"), vérifier qu'il existe et n'est pas vide
  → Les providers doivent faire une validation basique (if not api_key: raise ValueError)

SEC-05: Streaming responses don't leak sensitive data
  → Les réponses SSE (Server-Sent Events) ne doivent PAS contenir d'API keys, headers auth, ou détails backend
  → Vérifier que seuls les tokens LLM sont envoyés (les données sensibles restent côté serveur)

SEC-06: Frontend doesn't store API keys in state/localStorage (BLOQUANT)
  → Le composant React PromptForgeMultiLLM.jsx NE DOIT JAMAIS stocker de clés API
  → Vérifier qu'aucune clé n'est sauvegardée dans useState, localStorage, sessionStorage, ou cookies
  → Les clés API doivent TOUJOURS rester sur le serveur (backend)

SEC-07: CORS headers properly configured
  → Si PromptForge appelle des providers cloud depuis le frontend, vérifier que les CORS headers sont sûrs
  → Les appels API doivent passer par le backend (proxy), pas directement du frontend

SEC-08: Error messages don't expose backend details
  → Les messages d'erreur retournés au frontend ne doivent PAS révéler:
     - Les vraies URLs des providers (ex: "https://api.anthropic.com/v1/messages")
     - Les vraies clés API (ex: "API key 'sk-ant-...' rejected")
     - Les détails du système (ex: "Python traceback, line 42...")
  → Les erreurs doivent être génériques (ex: "Provider unavailable" au lieu de "API key expired")

SEC-09: Provider status health check is rate-limited
  → La route GET /api/redteam/llm-providers/{provider}/status (health check)
  → NE DOIT PAS être appelée à chaque refresh de page ou en boucle rapide
  → Implémenter un cache ou rate-limiting pour éviter de spammer les APIs cloud

SEC-10: No SQL injection via provider names/model names
  → Les noms de provider et model sont passés dans les URLs (/api/redteam/llm-providers/{provider})
  → Vérifier qu'il n'y a PAS d'accès à une base de données sans validation
  → Vérifier que les noms de provider sont whitelist-ed (ollama, anthropic, openai, google, xai, groq)

BONUS CHECKS:
- SEC-B1: Credentials not in git history (git log --grep, git log -S)
- SEC-B2: .env* files are .gitignore'd
- SEC-B3: Demo/test credentials are different from prod (if applicable)

OUTPUT ATTENDU:
Un rapport D_BRAINSTORM/security.md avec:
1. Résumé exécutif (1-2 phrases)
2. Findings par check (SEC-01 à SEC-10):
   - PASS | FAIL | PARTIAL (avec justification)
   - Evidence (lignes de code, captures d'écran du config)
3. Benchmarking vs promptfoo:
   - Comment promptfoo gère les credentials API (lire https://docs.promptfoo.dev/docs/getting-started/)
   - Qu'est-ce que PromptForge fait pareil / différemment
4. Score sécurité: X/100 (basé sur nombre de checks PASS)
5. Recommandations critiques (si SEC-01, SEC-03, ou SEC-06 échouent, marquer comme BLOQUANT)

DEADLINE: Rapport complet avant phase C.1 (recette sécurité)
```

---

### AUDIT 2 — TESTING (Domain Weight: 35%)

**Agent**: Brainstorming Agent — Testing Audit
**Target Cycle**: Phase D.2
**Output Expected**: `D_BRAINSTORM/testing.md`

#### Prompt Audit Testing

```
Tu es un auditeur de couverture de tests pour des projets Node/React + Python/FastAPI.

CONTEXTE:
- Projet: PromptForge — Multi-LLM Testing Interface (poc_medical)
- Scope: 7 API endpoints (FastAPI), 1 composant React (452 LOC), factory LLM (371 LOC)
- Langage backend: Python (FastAPI, asyncio)
- Langage frontend: JavaScript/React 18 (avec hooks)
- Framework test existant: pytest (backend), vitest (frontend)
- Benchmark: promptfoo (examiner comment elle teste les providers LLM)

FICHIERS À AUDITER:
1. backend/routes/llm_providers_routes.py (425 LOC) — API endpoints
2. frontend/src/components/redteam/PromptForgeMultiLLM.jsx (452 LOC) — React component
3. backend/agents/attack_chains/llm_factory.py (371 LOC) — Factory pattern
4. Tests existants: chercher *_test.py, *.test.js, *.test.tsx dans le projet

CRITÈRES D'AUDIT TESTING (voir SCORING_CONFIG.json):

Domain: TESTING (35% du score global)
Target score: 85/100
Checks critiques: [TEST-03, TEST-04, TEST-05]

TEST-01: Backend routes have unit tests (llm_providers_routes.py)
  → Vérifier si backend/routes/llm_providers_routes.py a un fichier test correspondant
  → Commande: ls backend/routes/*test.py 2>/dev/null && echo "FOUND" || echo "MISSING"
  → Tests requis:
     - Test GET /api/redteam/llm-providers (mock config JSON)
     - Test GET /api/redteam/llm-providers/{provider}/models
     - Test POST /api/redteam/llm-test avec streaming (mock LLM response)
     - Test POST /api/redteam/llm-compare avec plusieurs providers
     - Test error handling (provider not found, API key missing)

TEST-02: Frontend component has integration tests (PromptForgeMultiLLM.jsx)
  → Vérifier si frontend/src/components/redteam/__tests__/PromptForgeMultiLLM.test.tsx existe
  → Tests requis:
     - Test que la liste des providers est chargée (mock fetch)
     - Test que les modèles se chargent dynamiquement quand le provider change
     - Test du bouton "Test Single" (doit appeler POST /api/redteam/llm-test)
     - Test du bouton "Compare All" (doit appeler POST /api/redteam/llm-compare)
     - Test de la gestion d'erreur (afficher le message d'erreur)
  → Mesurer la couverture: chercher /* c8 ignore */ ou /* istanbul ignore */

TEST-03: Streaming SSE parsing tested with mock responses (BLOQUANT)
  → Le composant PromptForgeMultiLLM.jsx fait du streaming SSE:
     ```javascript
     const reader = res.body.getReader();
     const decoder = new TextDecoder();
     // Parse SSE events: data: {"token": "...", "provider": "..."}
     ```
  → Tests requis:
     - Mock une réponse SSE avec 10 tokens
     - Vérifier que chaque token est affiché correctement
     - Vérifier que le compteur de tokens est exact
     - Tester avec un chunk incomplet (buffer incomplete)
     - Tester avec une réponse "complete" event pour calculer le total

TEST-04: Provider fallback tested (1 provider fails, others continue) (BLOQUANT)
  → Dans POST /api/redteam/llm-compare, si un provider timeout/error:
     - Le compare ne doit PAS crash
     - Les autres providers doivent continuer
     - Le résultat du provider en erreur doit avoir status: "error"
  → Test scenario:
     - Ollama responds OK
     - Claude API timeout
     - GPT API returns 401 (bad key)
     - Résultat: { "ollama": { status: "ok", response: "..." }, "anthropic": { status: "error", message: "timeout" }, ... }

TEST-05: Parallel comparison async/await correctness verified (BLOQUANT)
  → Backend utilise asyncio.gather() pour tester plusieurs providers en parallèle:
     ```python
     results = await asyncio.gather(
         test_ollama(...),
         test_anthropic(...),
         test_openai(...),
         return_exceptions=True  # Important!
     )
     ```
  → Tests requis:
     - Mesurer le temps total (doit être ~max(provider_times), pas sum(provider_times))
     - Verifier que return_exceptions=True prévient les crashes
     - Tester avec 6 providers en parallèle, un timeout au 3e
     - Tester race conditions (provider A répond avant B, etc.)

TEST-06: Model loading dynamic fetch tested
  → Quand l'utilisateur change le provider, les modèles doivent se charger dynamiquement:
     ```javascript
     useEffect(() => {
       fetch(`/api/redteam/llm-providers/${selectedProvider}/models`)
       .then(r => r.json())
       .then(data => setModels(data.models))
     }, [selectedProvider])
     ```
  → Tests requis:
     - Changer provider de "ollama" à "anthropic" → models doivent s'update
     - Mock la réponse API avec une liste custom
     - Vérifier qu'aucune model old ne reste en mémoire

TEST-07: Error boundaries prevent crashes
  → Tests requis:
     - Si le fetch échoue (network error), le composant affiche une ErrorBanner, pas de crash
     - Si la réponse JSON est malformée, aficher error message
     - Si le streaming est interrompu (AbortController), ne pas crash

TEST-08: Token counter accuracy
  → Vérifier que le compteur de tokens est exact:
     - Mock une réponse SSE avec 100 tokens
     - Vérifier que le compteur affiche "100 tokens"
     - Vérifier que le calcul "tokens/sec" est correct
  → Test edge case: réponse avec zéro tokens

TEST-09: Export JSON structure validated
  → Le bouton "Export" télécharge un fichier JSON avec structure:
     ```json
     {
       "prompt": "...",
       "system_prompt": "...",
       "provider": "ollama",
       "model": "llama3.2",
       "parameters": { "temperature": 0.7, "max_tokens": 1024 },
       "results": { "ollama": { "response": "..." } },
       "timestamp": "2026-04-04T..."
     }
     ```
  → Tests requis:
     - Vérifier que la structure est valide JSON
     - Vérifier que tous les champs requis sont présents
     - Tester avec compare mode (multiple providers)

TEST-10: i18n keys complete (FR/EN/BR) for all strings
  → Chercher des strings hardcoded en anglais dans PromptForgeMultiLLM.jsx:
     ```bash
     grep -n '"[A-Z]' frontend/src/components/redteam/PromptForgeMultiLLM.jsx | grep -v className | grep -v import
     ```
  → Vérifier que TOUS les textes utilisateurs utilisent t('redteam.promptforge.*')
  → Vérifier que les clés FR/EN/BR existent toutes dans i18n.js

BENCHMARK vs promptfoo:
- promptfoo utilise vitest pour tester les providers
- Elle mocks les réponses LLM via des fixtures
- Elle vérifie la latence, le nombre de tokens, le coût
- Qu'est-ce que PromptForge devrait emprunter à promptfoo?

OUTPUT ATTENDU:
Rapport D_BRAINSTORM/testing.md avec:
1. Résumé: coverage % estimé (basé sur nombre de tests trouvés)
2. Findings par check (TEST-01 à TEST-10):
   - PASS (tests existent, couvrent le cas) | MISSING (tests absent) | PARTIAL
   - Evidence (chemins des fichiers de test)
3. Coverage report (si disponible via pytest --cov, vitest --coverage)
4. Recommandations:
   - Quels tests ajouter en priorité?
   - Quels edge cases manquent?
5. Score testing: X/100
6. Prochaines étapes (phase A: implementation des tests manquants)

DEADLINE: Rapport complet avant phase C.2 (recette tests)
```

---

### AUDIT 3 — ARCHITECTURE (Domain Weight: 25%)

**Agent**: Brainstorming Agent — Architecture Audit
**Target Cycle**: Phase D.2
**Output Expected**: `D_BRAINSTORM/architecture.md`

#### Prompt Audit Architecture

```
Tu es un architecte logiciel spécialisé dans les patterns Python/FastAPI et React.

CONTEXTE:
- Projet: PromptForge — Multi-LLM Testing Interface (poc_medical)
- Scope: 6 providers (Ollama, Claude, GPT, Gemini, Grok, Groq), 7 endpoints API, config JSON
- Patterns clés: Factory Pattern (LLM creation), Single Source of Truth (JSON config), Streaming (SSE)
- Architecture existante: AEGIS Red Team Lab (voir README.md, architecture.md si present)
- Benchmark: prompt-foojs architecture + industrie standards

FICHIERS À AUDITER:
1. backend/prompts/llm_providers_config.json (278 LOC) — config center
2. backend/agents/attack_chains/llm_factory.py (371 LOC) — factory pattern
3. backend/routes/llm_providers_routes.py (425 LOC) — API routes
4. frontend/src/components/redteam/PromptForgeMultiLLM.jsx (452 LOC) — React component
5. backend/server.py — integration point
6. frontend/src/main.jsx — routing
7. backend/prompts/LLM_PROVIDERS_README.md — documentation

CRITÈRES D'AUDIT ARCHITECTURE (voir SCORING_CONFIG.json):

Domain: ARCHITECTURE (25% du score global)
Target score: 90/100
Checks critiques: [ARCH-01, ARCH-02, ARCH-10]

ARCH-01: JSON config is single source of truth (BLOQUANT)
  → Est-ce que la configuration JSON est la SEULE source de vérité pour les providers?
  → Vérifier:
     - Aucune liste de providers hardcodée en Python (grep -n "providers = \|provider_list = " backend/)
     - Aucune liste de providers hardcodée en React (grep -n "const providers = \|PROVIDERS = " frontend/)
     - Tous les modèles sont lus depuis config JSON via API
  → Evidence: Montrer comment llm_factory.py charge le JSON et comment React fetch les providers

ARCH-02: llm_factory.get_llm() extensible for new providers (BLOQUANT)
  → Pour ajouter un nouveau provider (ex: Claude 5 qui n'existe pas en 2026-04-04):
     - Étape 1: Ajouter une entrée dans llm_providers_config.json
     - Étape 2: Ajouter une branche elif dans get_llm() si l'API est différente
     - Étape 3: VOILÀ, le provider fonctionne
  → Vérifier que cette extension est possible:
     - Les imports LangChain sont modulaires (ChatOllama, ChatAnthropic, etc.)
     - Il n'y a pas de "super switch case" qui forcerait un refactor de 10 fichiers
     - Les paramètres temperature, max_tokens sont standardisés (pas de "openai_temp" vs "anthropic_temperature")
  → Score LOW si extension nécessite >2 fichiers modifiés

ARCH-03: API response schema consistent across all providers
  → Quand on appelle POST /api/redteam/llm-test sur Ollama vs Claude vs Gemini:
     - La réponse SSE doit avoir le MÊME format:
       ```
       data: {"token": "hello", "provider": "ollama", "timestamp": 1234567890}
       data: {"token": " ", "provider": "ollama", "timestamp": 1234567890}
       ...
       data: {"type": "complete", "duration_ms": 2500, "tokens": 145}
       ```
     - Le composant React ne doit PAS avoir de cas spéciaux par provider (if provider == "ollama" → parse différemment)
  → Vérifier: Regarder llm_providers_routes.py, fonction handle_streaming()

ARCH-04: Streaming response format uniform (SSE with data: prefix)
  → Tous les streams doivent utiliser Server-Sent Events (SSE) avec le format:
     ```
     data: {"...json..."}
     \n\n
     ```
  → Vérifier:
     - Aucun WebSocket au lieu de SSE (les WebSocket compliquent le déploiement)
     - Aucun format custom (ex: "TOKEN: hello" → utiliser SSE format standard)
  → Le composant React doit parser avec une boucle générique (pas de if/switch par format)

ARCH-05: Frontend/backend contract documented (request/response examples)
  → Existe-t-il une doc du contrat API?
     - backend/prompts/LLM_PROVIDERS_README.md (vérifié: YES, 384 LOC)
     - Chaque endpoint a un exemple de request + response
     - Les schémas Pydantic matchent les exemples JSON
  → Vérifier qu'il n'y a pas de desync:
     - Exemple doc: {"provider": "ollama", "model": "llama3.2", "prompt": "..."}
     - Code Python: @app.post("/api/redteam/llm-test", ...) accepte les mêmes champs

ARCH-06: No circular dependencies between routes and factory
  → Vérifier l'ordre des imports:
     - llm_factory.py N'IMPORTE PAS llm_providers_routes.py
     - llm_providers_routes.py IMPORTE llm_factory.py ✓ (sens unique)
  → grep -n "import.*llm_providers_routes\|from.*llm_providers_routes" backend/agents/

ARCH-07: Provider status enum standardized
  → Tous les status doivent être prédéfinis:
     ```python
     class ProviderStatus(str, Enum):
         OK = "ok"
         ERROR = "error"
         TIMEOUT = "timeout"
         RATE_LIMIT = "rate_limit"
     ```
  → Vérifier: Aucun string magique ("provider is broken", "not reachable", etc.)

ARCH-08: Async/await pattern consistent (no callback hell)
  → Tous les appels async DOIVENT utiliser async/await, pas des Promises:
     ```python
     # GOOD
     async def test_prompt(provider, model, prompt):
         result = await llm.invoke(prompt)
         return result

     # BAD (callback hell)
     def test_prompt(provider, model, prompt):
         llm.invoke(prompt, callback=lambda x: ...)
     ```
  → Vérifier: Aucune `.then()` chain ou `.callback()` en Python

ARCH-09: Component state management (React hooks) properly organized
  → Le composant PromptForgeMultiLLM.jsx utilise useState/useEffect correctement?
  → Vérifier:
     - Pas de mutations directes de state (setState uniquement)
     - Pas de dépendances manquantes dans useEffect []
     - Pas de state qui devrait être lifted up (ex: providers list, models list)
  → Linter: Si le projet a eslint, vérifier rules "react-hooks/exhaustive-deps"

ARCH-10: Documentation (LLM_PROVIDERS_README.md) up-to-date (BLOQUANT)
  → Le fichier backend/prompts/LLM_PROVIDERS_README.md couvre:
     - Quick start (4 steps)
     - Configuration file structure
     - API endpoints (6+ endpoints)
     - Troubleshooting (5+ issues)
     - Adding new provider (4 steps)
     - Integration with Red Team Lab
     - Thesis integration
  → Vérifier qu'aucun endpoint ne manque de documentation
  → Vérifier que les exemples request/response sont corrects (pas du copier-coller de 2 versions précédentes)

BONUS CHECKS:
- ARCH-B1: Separation of Concerns (routes/factory/config bien séparés)
- ARCH-B2: Error handling strategy (custom exceptions vs generic)
- ARCH-B3: Logging strategy (logger.LogSystemEvent ou print/console.log?)
- ARCH-B4: Retry logic for transient failures (timeout → retry N times)
- ARCH-B5: API versioning (routes à /api/v1/ ou /api/?)

BENCHMARK vs promptfoo:
- promptfoo architecture: fichier config YAML, factory pour les providers, streaming API
- Points forts de promptfoo: modulaire, facile d'ajouter providers, bien documentée
- Qu'est-ce que PromptForge devrait améliorer par rapport à promptfoo?

OUTPUT ATTENDU:
Rapport D_BRAINSTORM/architecture.md avec:
1. Résumé: architecture overview (1 diagram ASCII ou description)
2. Findings par check (ARCH-01 à ARCH-10):
   - PASS | PARTIAL | CONCERN (avec justification et ligne de code)
   - Evidence (imports, files, patterns)
3. Diagrams (ASCII ou description):
   - Data flow: User → Frontend → Routes → Factory → LLM Providers
   - Module dependencies: frontend → server routes → llm_factory → config.json
4. Extensibility score:
   - Adding a new provider: how many files? how many lines?
   - Adding a new parameter (ex: top_p): impact analysis
5. Maintainability observations:
   - Spaghetti code? Modularité?
   - Technical debt? Shortcuts?
6. Score architecture: X/100
7. Recommendations:
   - Quick wins (easy refactors)
   - Medium-term improvements (1-2 days)
   - Long-term architectural changes (if any)

DEADLINE: Rapport complet avant phase C (consolidation scorecard)
```

---

## RÉSUMÉ DES PROMPTS D'AUDIT

| Domain | Agent | Focus | Checks | Output |
|--------|-------|-------|--------|--------|
| **Security** | Brainstorming Agent 1 | API key mgmt, auth polymorphism, data leaks | SEC-01 à SEC-10 | D_BRAINSTORM/security.md |
| **Testing** | Brainstorming Agent 2 | Unit/integration tests, streaming, error handling | TEST-01 à TEST-10 | D_BRAINSTORM/testing.md |
| **Architecture** | Brainstorming Agent 3 | Single source of truth, extensibility, patterns | ARCH-01 à ARCH-10 | D_BRAINSTORM/architecture.md |

---

## PROCHAINES ÉTAPES

### Phase D — DO (Brainstorming)
1. **Démarrer le backend** (pre-flight check actuellement DOWN)
   ```bash
   .\aegis.ps1 start backend
   ```

2. **Lancer 3 agents en parallèle** (Phase D.2):
   - Agent 1 audit sécurité (avec prompt ci-dessus)
   - Agent 2 audit testing (avec prompt ci-dessus)
   - Agent 3 audit architecture (avec prompt ci-dessus)
   - Pattern: 1 message, 3 x Agent tool avec `run_in_background: true`

3. **Attendre résultats** (~5-10 min par agent)
   - Notifications automatiques quand agents terminent
   - Résultats dans `D_BRAINSTORM/security.md`, `testing.md`, `architecture.md`

### Phase C — CHECK
1. **C.0**: Dead code filter (triage usage)
2. **C.1**: Security recette + UI help audit
3. **C.2**: Testing recette (couverture de tests)
4. **C.3**: Scorecard consolidation (scoring /100 par domaine)

### Phase A — ACT
1. **A.1**: Plan de remédiation
2. **A.2**: Exécution (si --fix)
3. **A.3**: Documentation + finalisation
4. **A.4**: RETEX + amélirations pour cycle 2

---

## NOTES

- **Baseline**: Ceci est le cycle 1. Pas de scores précédents à comparer.
- **Backend DOWN**: Pre-flight check = 503. Doit être restarté avant phase D.
- **Frontend BUILD**: ✓ OK (chunk warnings normales)
- **Python SYNTAX**: ✓ OK
- **Benchmark**: promptfoo (externe, utilisé comme référence comparative)

---

**Plan généré**: 2026-04-04 11:30 UTC
**Status**: Prêt pour Phase D (DO — brainstorming agents)
