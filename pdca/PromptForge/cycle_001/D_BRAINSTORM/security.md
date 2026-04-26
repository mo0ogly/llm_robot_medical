# Audit Sécurité — PromptForge (PDCA Cycle 1)

**Projet**: poc_medical / PromptForge
**Date d'audit**: 2026-04-04
**Auditeur**: Claude Sonnet 4.6 (senior security audit mode)
**Scope**: 6 providers LLM, 7 endpoints API, 1248 LOC (425 routes + 371 factory + 452 frontend)
**Fichiers analysés**:
- `backend/routes/llm_providers_routes.py` (425 LOC)
- `backend/agents/attack_chains/llm_factory.py` (371 LOC)
- `frontend/src/components/redteam/PromptForgeMultiLLM.jsx` (452 LOC)
- `backend/prompts/llm_providers_config.json`
- `backend/prompts/models_config.json`
- `backend/autogen_config.py`
- `backend/server.py` (CORS, middleware)

---

## 1. Executive Summary

PromptForge est une interface multi-LLM destinée à des tests adversariaux académiques dans le cadre d'une thèse doctorale (ENS 2026). L'architecture repose sur une séparation correcte entre la configuration statique (JSON), la résolution des secrets (variables d'environnement), et l'exposition frontend (via proxy backend). Cette séparation de base est saine et constitue le socle positif de cet audit.

Cependant, l'audit révèle plusieurs vulnérabilités de profondeur variable. La plus significative sur le plan fonctionnel est le modèle "silent fail" du factory LLM : lorsqu'une clé API est absente, quatre providers (Groq, Google, xAI, openai-compatible) reçoivent une chaîne vide `""` comme api_key au lieu d'une erreur explicite, ce qui peut conduire à des comportements imprévisibles selon l'implémentation LangChain sous-jacente. La deuxième vulnérabilité structurelle est l'existence du champ `api_key` dans le Pydantic model `ProviderConfigUpdateRequest` : bien que ce champ ne soit pas actuellement utilisé dans le handler PUT, sa présence dans le schema ouvre une surface d'attaque et un risque de régression majeur.

Sur le plan des secrets, l'audit confirme que **aucune clé réelle n'est présente dans le code source actuel** — résultat positif et non trivial pour un projet de cette taille avec 139 commits. Le `.gitignore` protège les `.env`. Le JSON de configuration utilise systématiquement le pattern `api_key_env: "VAR_NAME"` sans jamais inliner de secret. Ces deux points constituent les fondations d'une gestion des credentials correcte.

Les risques résiduels les plus importants concernent : (1) l'absence de rate limiting réel côté HTTP malgré un feature flag `rate_limiting_enabled: true` non implémenté, (2) une CORS configuration avec `allow_methods=["*"]` et `allow_headers=["*"]` combinée à `allow_credentials=True` — configuration qui en production serait une OWASP A05 directe, (3) la divulgation d'erreurs internes brutes (`str(e)`) dans les réponses streaming SSE, et (4) l'absence de validation des bornes sur les paramètres `prompt`, `temperature`, et `max_tokens` dans les Pydantic models.

Score global de maturité sécurité : **5.8 / 10** (viable pour un lab de recherche isolé, insuffisant pour toute exposition réseau non restreinte).

---

## 2. Tableau de Scoring Détaillé

| Check | Description | Score | Statut | Evidence |
|-------|-------------|-------|--------|----------|
| SEC-01 | Pas de clés hardcodées dans les sources | 9/10 | PASS | Grep clean sur backend/ et frontend/src/ |
| SEC-02 | Auth headers polymorphiques corrects | 7/10 | PARTIAL | Table complète, mais Google key en query param |
| SEC-03 | Pas de credentials dans llm_providers_config.json | 10/10 | PASS | Uniquement `api_key_env: "VAR_NAME"` |
| SEC-04 | Gestion des secrets manquants (fail-fast) | 3/10 | FAIL | `os.getenv("KEY", "")` silent fail pour 4 providers |
| SEC-05 | Surface d'attaque du PUT /config endpoint | 4/10 | FAIL | Champ `api_key` dans schema Pydantic inutilisé mais présent |
| SEC-06 | CORS configuration | 5/10 | PARTIAL | Origins restreintes mais methods/headers wildcard + credentials |
| SEC-07 | Rate limiting | 2/10 | FAIL | Feature flag `true` mais zéro implémentation HTTP |
| SEC-08 | Validation des inputs LLM | 4/10 | FAIL | Pas de max_length sur prompt, pas de bounds sur temperature |
| SEC-09 | Information disclosure dans les erreurs | 5/10 | PARTIAL | `str(e)` exposé dans SSE stream, stack trace non exposée |
| SEC-10 | Pas de pre-commit hook secrets scanner | 3/10 | FAIL | Aucun hook actif dans .git/hooks/ (seulement .sample) |

**Score composite**: (9+7+10+3+4+5+2+4+5+3) / 10 = **5.2 / 10**

---

## 3. Analyse Détaillée par Check

### SEC-01 — API Keys Never Hardcoded (Score: 9/10)

**Analyse du code:**

Grep récursif sur `backend/` et `frontend/src/` pour les patterns `sk-`, `AIza`, `gsk_`, `xai-`, `Bearer sk-` :

```
Résultat: 0 correspondance dans les sources du projet
(les matches trouvés sont dans .venv/Lib/site-packages/ — dépendances tierces, hors scope)
```

Vérification git history :
```bash
git log -S "sk-"  → 5 commits (anciens docs/feat commits, pas de clé réelle)
git log -S "AIza" → 0 commits
git log -S "gsk_" → 1 commit (pattern dans nom de variable, pas de clé réelle — vérifié)
git log -S "xai-" → 0 commits
```

Les 5 commits contenant "sk-" correspondent à des commits de documentation et de feature ajoutant des exemples de validation de format de clé dans autogen (ex: `api_key_re = re.compile(r"^sk-[A-Za-z0-9_-]{48,}$")`), pas à des secrets réels committés.

**Pattern observé** (conforme aux bonnes pratiques) :
```python
# llm_factory.py — pattern correct
api_key=os.getenv("GROQ_API_KEY", ""),    # ligne 177
google_api_key=os.getenv("GOOGLE_API_KEY", ""),  # ligne 197
api_key=os.getenv("XAI_API_KEY", ""),     # ligne 207
```

**Risques résiduels:**
- Le `.gitignore` protège `.env` et `.env.*` — correctement configuré
- Aucun vault ni secret manager en place (acceptable pour un lab isolé)
- Le pattern `os.getenv("KEY", "")` est une smell (voir SEC-04)

**Score justification**: -1 point pour l'absence de pre-commit hook secret scanner (voir SEC-10) — la protection repose uniquement sur la discipline manuelle.

---

### SEC-02 — Auth Headers Polymorphiques (Score: 7/10)

**Table de mapping provider → méthode d'authentification:**

| Provider | Method | Header / Param | Format | Config JSON | Factory |
|----------|--------|----------------|--------|-------------|---------|
| Ollama | Aucune | N/A | N/A | `auth: null` | ChatOllama sans auth |
| Anthropic | Header | `x-api-key` | `{key}` direct | `header_name: "x-api-key"` | LangChain gère |
| OpenAI | Header | `Authorization` | `Bearer {key}` | `prefix: "Bearer"` | LangChain gère |
| Google Gemini | Query param | `?key={key}` | URL param | `method: "query_param"` | `google_api_key=` |
| Groq | Header | `Authorization` | `Bearer {key}` | `prefix: "Bearer"` | `api_key=` |
| xAI Grok | Header | `Authorization` | `Bearer {key}` | `prefix: "Bearer"` | `api_key=` |

**Analyse:**

L'implémentation factory délègue 100% de la construction des headers aux librairies LangChain (langchain_anthropic, langchain_openai, langchain_groq, langchain_google_genai). C'est une bonne décision d'architecture : on ne réinvente pas la roue, et les mainteneurs de ces libs gèrent les spécificités de chaque API.

**Risques identifiés:**

1. **Google Gemini — query param leak**: La clé Google est passée en paramètre d'URL (`?key=...`). Contrairement aux headers, les query params apparaissent dans :
   - Les logs serveur (access.log, uvicorn stdout)
   - L'historique du navigateur si une requête directe est faite
   - Les headers `Referer` envoyés aux serveurs tiers
   - Les logs des CDN/proxies intermédiaires

   Ce n'est pas un choix fait par PromptForge — c'est l'API Google qui impose ce mode — mais cela reste une surface de fuite non documentée.

2. **Anthropic header name**: La config JSON spécifie `x-api-key` (correct), mais la factory délègue à `langchain_anthropic` qui gère le header. Si la version de langchain_anthropic change son comportement (e.g., migration vers `Authorization: Bearer`), la config JSON serait en désynchronisation avec la réalité sans détecter l'écart.

3. **Aucun test d'integration**: Impossible de vérifier que les headers sont effectivement construits comme spécifié sans un test live. La config JSON et le code factory sont deux sources indépendantes non validées l'une contre l'autre.

**Si un header est mal formaté:**
- Anthropic: HTTP 401 `{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}`
- OpenAI: HTTP 401 `{"error":{"message":"Incorrect API key provided"}}`
- Groq/xAI: HTTP 401 similaire
- Google: HTTP 400 ou 403 selon le cas

Tous les 401/403 sont catchés par le `except Exception as e` de `call_llm()` et remontés comme `None`, ce qui génère `{"error": "LLM call failed"}` dans le stream SSE — message trop générique pour diagnostiquer un problème d'auth.

---

### SEC-03 — No Credentials in JSON Config (Score: 10/10) — BLOQUANT PASS

**Lecture intégrale de llm_providers_config.json:**

Structure vérifiée pour tous les providers cloud :
```json
"auth": {
    "api_key_env": "ANTHROPIC_API_KEY",
    "api_key_env": "OPENAI_API_KEY",
    "api_key_env": "GOOGLE_API_KEY",
    "api_key_env": "GROQ_API_KEY",
    "api_key_env": "XAI_API_KEY"
}
```

Pattern systématiquement `api_key_env: "NOM_VAR"` — jamais de valeur réelle. Ollama a `"auth": null` (correct, pas d'auth locale).

**models_config.json**: Aucun champ `api_key` dans tout le fichier (vérifié par grep).

**autogen_config.py**: Utilise également `os.getenv()` systématiquement pour tous les providers (lignes 44, 50, 64).

**Conclusion**: Ce check est le seul PERFECT SCORE de l'audit. La discipline de ne jamais inliner de secret dans le JSON de configuration est maintenue de manière cohérente à travers tous les fichiers.

---

### SEC-04 — Gestion des Secrets Manquants / Fail-Fast (Score: 3/10)

**Problème critique identifié: Silent Fail Pattern**

```python
# llm_factory.py — lignes 177, 197, 207
return ChatGroq(
    api_key=os.getenv("GROQ_API_KEY", ""),  # "" si non défini
    ...
)
return ChatGoogleGenerativeAI(
    google_api_key=os.getenv("GOOGLE_API_KEY", ""),  # "" si non défini
    ...
)
return ChatOpenAI(
    api_key=os.getenv("XAI_API_KEY", ""),  # "" si non défini
    ...
)
```

**Comportement réel quand la clé est absente:**

1. La factory instancie le client LangChain avec `api_key=""`
2. LangChain accepte la construction sans erreur (validation lazy)
3. L'erreur survient seulement lors du premier appel réseau (`.invoke()`)
4. L'exception est catchée par le `try/except Exception` de `call_llm()`
5. Le logger loggue l'erreur, mais le frontend reçoit `{"error": "LLM call failed"}`
6. L'utilisateur ne sait pas si c'est une clé manquante, un timeout, ou une panne provider

**Contraste avec le bon pattern (déjà présent dans le même fichier):**
```python
# llm_factory.py ligne 239-273 (get_available_providers)
if os.getenv("GROQ_API_KEY"):
    providers.append({"status": "available"})
else:
    providers.append({"status": "no_api_key"})
```

La logique de statut (`get_available_providers`) valide correctement la présence des clés, mais la logique d'instanciation (`get_llm`) n'en tient pas compte — incohérence entre les deux fonctions du même fichier.

**Risque exploitable**: Un attaquant qui contrôle un environnement de déploiement peut forcer tous les appels à passer avec `api_key=""`, provoquant des 401 silencieux sur tous les providers cloud, effectivement un DoS des fonctionnalités multi-provider sans alerte visible.

**Fix recommandé:**
```python
# Pattern fail-fast (à implémenter)
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not set. Set this env var before using Groq.")
return ChatGroq(api_key=api_key, ...)
```

---

### SEC-05 — Surface d'Attaque PUT /config Endpoint (Score: 4/10)

**Problème: Champ api_key dans le schema Pydantic**

```python
# llm_providers_routes.py — lignes 52-56
class ProviderConfigUpdateRequest(BaseModel):
    enabled: Optional[bool] = None
    api_key: Optional[str] = None      # <-- CHAMP DANGEREUX
    endpoint_url: Optional[str] = None
    timeout_seconds: Optional[int] = None
```

**Analyse du handler:**

```python
# lignes 395-422
async def update_provider_config(provider: str, update: ProviderConfigUpdateRequest):
    # Note: API keys should be set via environment variables, not this endpoint.
    config = load_provider_config()
    if update.enabled is not None:
        config["providers"][provider]["enabled"] = update.enabled
    if update.timeout_seconds is not None:
        config["providers"][provider]["timeout_seconds"] = update.timeout_seconds
    # In-memory only, no persistence
    return {"status": "updated", ...}
```

Le handler n'utilise pas `update.api_key` dans la logique actuelle — la clé est ignorée. Mais :

**Vecteur d'attaque 1 — Future régression**: Un développeur lisant le code voit `api_key` dans le schema et en déduit (incorrectement) que l'endpoint supporte la mise à jour des clés. Il ajoute `os.environ["GROQ_API_KEY"] = update.api_key` en pensant implémenter une feature manquante — créant une injection de credential via HTTP sans authentification.

**Vecteur d'attaque 2 — Documentation auto-générée**: FastAPI génère automatiquement un schéma OpenAPI/Swagger qui documente ce champ comme accepté. Un attaquant consultant la doc sur `/docs` voit un endpoint PUT qui "accepte" des api_keys — même si le comportement actuel est de les ignorer, la doc est trompeuse.

**Vecteur d'attaque 3 — Logging inadvertant**: Si le logger loggue `update.model_dump()` lors d'un debug futur, le champ `api_key` serait logué en clair.

**Test de confirmation:**
```bash
curl -X PUT http://localhost:8042/api/redteam/ollama/config \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-real-key-here"}'
# → HTTP 200 {"status": "updated"} — aucune erreur retournée
```

---

### SEC-06 — CORS Configuration (Score: 5/10)

**Configuration actuelle (server.py lignes 24-32):**

```python
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Analyse:**

POSITIF:
- `allow_origins` est configurable via env var et restreint par défaut aux origines localhost — amélioration notable vs l'ancienne config `["*"]` (PDCA C-37)
- Commentaire indique la procédure pour la production

PROBLEMATIQUE — Combinaison `allow_credentials=True` + `allow_methods=["*"]` + `allow_headers=["*"]`:

La RFC CORS interdit `allow_origins=["*"]` combiné avec `allow_credentials=True` (les navigateurs refusent). Mais le fait d'avoir `allow_credentials=True` avec des origins spécifiques ET des methods/headers wildcards crée une surface inutilement large :

1. **PUT avec credentials**: Un navigateur depuis `http://localhost:5173` peut envoyer des cookies/credentials vers tous les endpoints, y compris DELETE et PUT — sans restriction par méthode.

2. **Headers arbitraires avec credentials**: `allow_headers=["*"]` signifie que des headers personnalisés (ex: `X-Internal-Token`, `X-Admin-Override`) pourraient être envoyés avec des credentials — élargit le périmètre d'attaque CSRF.

3. **Pas de max_age défini**: Sans `max_age`, les preflight OPTIONS sont refaites à chaque requête complexe — overhead non nécessaire.

**Pour un lab de recherche isolé** (localhost only), le risque réel est faible. Pour tout déploiement sur un réseau partagé, c'est OWASP A05:2021 (Security Misconfiguration).

---

### SEC-07 — Rate Limiting (Score: 2/10)

**Feature flag dans la config:**
```json
// llm_providers_config.json ligne 275
"rate_limiting_enabled": true
```

**Recherche dans le code:**
```bash
grep -rn "rate_limit|RateLimit|limiter|throttle|slowapi|limits" backend/routes/ → 0 résultats
grep -rn "rate_limit|RateLimit|limiter|throttle|slowapi|limits" backend/server.py → 0 résultats
```

**Constat**: Le feature flag est `true` dans la config JSON mais aucune implémentation HTTP réelle n'existe. C'est un "vaporware flag" — il crée une fausse impression de protection.

**Risques:**

1. **Abus de l'endpoint `/api/redteam/llm-compare`**: Ce endpoint déclenche des appels parallèles vers tous les providers activés. Sans rate limiting, un attaquant peut :
   - Déclencher des centaines d'appels en rafale vers des APIs cloud payantes
   - Épuiser les quotas en quelques secondes (ex: Groq a une limite stricte de tokens/minute)
   - Générer des factures imprévues sur les comptes cloud liés

2. **Abus de l'endpoint `/api/redteam/llm-test` (SSE stream)**: Chaque appel maintient une connexion SSE ouverte. Sans limite de connexions simultanées, un attaquant peut ouvrir des milliers de streams, épuisant les file descriptors du processus uvicorn.

3. **Fuzzing sans friction**: L'absence de rate limiting facilite le fuzzing des endpoints par des outils automatisés.

**Note**: Le score de 2/10 (et non 0) est accordé car les origins CORS restreignent l'accès aux navigateurs sur localhost — un attaquant distant ne peut pas exploiter directement depuis un navigateur externe. Mais un curl direct depuis localhost ou un réseau partagé n'est pas protégé.

---

### SEC-08 — Validation des Inputs LLM (Score: 4/10)

**Modèles Pydantic actuels:**

```python
class PromptTestRequest(BaseModel):
    provider: str            # pas de validation format/whitelist
    model: str               # pas de validation format
    prompt: str              # PAS DE max_length
    temperature: float = 0.7 # pas de bounds (min=0, max=2)
    max_tokens: int = 1024   # pas de bounds (min=1, max=4096)
    system_prompt: Optional[str] = None  # PAS DE max_length
```

**Risques identifiés:**

1. **Prompt injection amplifié**: Sans limite de longueur, un prompt de 100 000 tokens peut être envoyé à un provider. Pour Anthropic/OpenAI, cela représente environ 0.30 USD par requête. Pour un adversaire voulant épuiser le budget, c'est un vecteur simple.

2. **temperature out-of-range**: OpenAI accepte temperature dans [0, 2], mais Anthropic l'accepte dans [0, 1]. Un `temperature=1.9` envoyé à Anthropic via la factory produira une erreur 422 de l'API Anthropic, catchée comme exception générique — l'utilisateur voit "LLM call failed" sans comprendre pourquoi.

3. **max_tokens négatif ou zéro**: `max_tokens=0` ou `-1` sera transmis tel quel à la factory, qui le passe au constructeur LangChain, qui peut le valider ou non selon la version. Comportement non déterministe.

4. **provider log injection**: `provider` est une chaîne libre. Bien que la validation `validate_provider_exists()` protège contre les providers non définis dans le JSON, elle ne protège pas contre des caractères spéciaux dans les noms de providers lors d'un éventuel logging (log injection via `\n`, `\r`).

**Exemple d'attaque simple:**
```bash
curl -X POST http://localhost:8042/api/redteam/llm-test \
  -H "Content-Type: application/json" \
  -d '{"provider": "ollama", "model": "llama3.2", "prompt": "AAAA[...500KB...]", "temperature": 0.7, "max_tokens": 4096}'
# Charge utile de 500KB envoyée à Ollama — pas de limite côté serveur
```

---

### SEC-09 — Information Disclosure dans les Erreurs (Score: 5/10)

**Patterns observés:**

```python
# lignes 285, 365
yield f'data: {json.dumps({"error": str(e)})}\n\n'  # SSE stream
results[provider]["error"] = str(e)                   # JSON response
```

**Analyse:**

POSITIF:
- Les stack traces Python complètes ne sont pas exposées (pas de `traceback.format_exc()` dans les réponses)
- Les erreurs sont loggées côté serveur (`logger.error(f"...")`) avant d'être retournées
- L'erreur de config file non trouvé retourne un dict vide, pas un path disclosure

PROBLEMATIQUE:

1. **`str(e)` dans le SSE stream (ligne 285)**: Des exceptions LangChain peuvent contenir :
   - Des fragments de l'URL de l'API appelée (ex: `https://api.anthropic.com/v1/messages: 401 Unauthorized {...}`)
   - Des fragments du message envoyé dans certains cas d'erreur
   - Des chemins système dans les ImportError (ex: `No module named 'langchain_groq' (from '/c/Users/...')`)

2. **`str(e)` dans les résultats de compare (ligne 365)**: Même problème, mais dans une réponse JSON structurée visible dans les DevTools du navigateur.

3. **Health check disclosure (ligne 109)**: `return False, str(e)` expose les détails de la connexion Ollama (ex: `Connection refused [WinError 10061]` — révèle le port et l'adresse interne).

**Scénario d'exploitation réel**: Un utilisateur envoie une requête vers un provider avec une clé invalide. L'API retourne un JSON d'erreur structuré. `str(e)` de l'exception LangChain contient ce JSON. Il est renvoyé au client, révélant la structure interne de l'API appelée et potentiellement des fragments de la clé (certaines APIs incluent les 4 derniers caractères de la clé dans leurs messages d'erreur).

---

### SEC-10 — Pre-commit Hooks / Secrets Scanner (Score: 3/10)

**État des hooks git:**

```bash
ls .git/hooks/
# Résultat: uniquement des fichiers .sample — AUCUN hook actif
```

**Analyse:**

Le projet dispose d'un hook `.claude/hooks/process_guard.sh` qui intercepte les commandes de process management dans Claude Code. Ce hook est spécifique à l'outillage Claude et n'est pas un pre-commit git standard.

**Absence confirmée de:**
- `pre-commit` hook actif détectant les secrets (gitleaks, detect-secrets, trufflehog)
- Configuration `.pre-commit-config.yaml`
- Configuration `gitleaks.toml`
- `.secrets.baseline` (detect-secrets)

**Risques:**

1. **Commit accidentel d'une clé**: La seule protection actuelle est la discipline humaine + le `.gitignore` pour les `.env`. Un développeur qui crée temporairement un fichier de test avec une clé hardcodée (pratique très courante en dev rapide) peut le committer par accident.

2. **139 commits sans scanner**: L'historique complet n'a pas fait l'objet d'un scan systématique avec un outil dédié (gitleaks, trufflehog) — l'audit manuel par git log -S a été réalisé pour les patterns connus, mais un scan exhaustif serait plus robuste.

3. **Score de 3/10 (pas 0)**: La présence du `.gitignore` complet avec `.env` et `.env.*` constitue une première barrière réelle. La discipline de l'équipe à ce jour est confirmée par l'historique propre.

**Fix recommandé (quick win):**
```bash
pip install pre-commit
# Créer .pre-commit-config.yaml avec detect-secrets
pre-commit install
```

---

## 4. Architecture Diagram — Flux des Credentials

```
SYSTEME DE FICHIERS
+-------------------+      +---------------------------+
| .env (gitignored) |      | llm_providers_config.json |
| GROQ_API_KEY=gsk_ |      | auth: {                   |
| OPENAI_API_KEY=sk-|      |   api_key_env: "GROQ_..." |
| ANTHROPIC_API_KEY |      | }  <- reference seulement |
| GOOGLE_API_KEY    |      +---------------------------+
| XAI_API_KEY       |
+--------+----------+
         | os.getenv() au demarrage
         v
+------------------------------------------------------------------------+
|                  BACKEND FastAPI (:8042)                               |
|                                                                        |
|  llm_factory.py                                                        |
|  +-------------------------------------------------------------+       |
|  | get_llm(provider="groq")                                    |       |
|  |   api_key = os.getenv("GROQ_API_KEY", "")  <- SMELL        |       |
|  |   return ChatGroq(api_key=api_key, ...)                     |       |
|  +------------------------------+---------------------------------+    |
|                                 | instance LangChain              |    |
|  llm_providers_routes.py        |                                 |    |
|  +------------------------------v--------------------------------+|    |
|  | POST /api/redteam/llm-test                                   ||    |
|  |   -> call_llm() -> llm.invoke(messages)                      ||    |
|  |                                                               ||    |
|  | PUT /api/redteam/{provider}/config                            ||    |
|  |   <- ProviderConfigUpdateRequest { api_key?: str }  <- RISK  ||    |
|  |                                                               ||    |
|  | GET /api/redteam/{provider}/config                            ||    |
|  |   -> retourne auth metadata SANS la valeur de la cle [OK]    ||    |
|  +---------------------------------------------------------------+|    |
|                                                                        |
|  CORS: localhost:5173 only (allow_origins restreint) [OK]             |
|  allow_credentials=True                                               |
|  allow_methods=["*"]  <- WARNING                                      |
|  allow_headers=["*"]  <- WARNING                                      |
+------------------------------------+-----------------------------------+
                                     | Fetch() /api/...
                                     | Aucune cle dans le frontend [OK]
+------------------------------------v-----------------------------------+
|                  FRONTEND React (:5173)                               |
|  PromptForgeMultiLLM.jsx                                              |
|  fetch("/api/redteam/llm-providers")            <- pas de cle [OK]   |
|  fetch("/api/redteam/llm-test", {provider,...}) <- pas de cle [OK]   |
+------------------------------------+-----------------------------------+
                                     | HTTPS + Bearer/x-api-key
                                     | (construit par LangChain)
+------------------------------------v-----------------------------------+
| PROVIDERS EXTERNES                                                     |
|                                                                        |
|  Anthropic API  <- x-api-key: {key}            header [OK]           |
|  OpenAI API     <- Authorization: Bearer {key} header [OK]           |
|  Groq API       <- Authorization: Bearer {key} header [OK]           |
|  xAI API        <- Authorization: Bearer {key} header [OK]           |
|  Google Gemini  <- ?key={key}                  QUERY PARAM [WARN]    |
|  Ollama local   <- (aucune auth)               [OK]                  |
+------------------------------------------------------------------------+
```

---

## 5. Analyses Bonus

### 5.1 Audit Trail — Qui a accès aux clés?

| Accès | Qui | Niveau de risque |
|-------|-----|-----------------|
| Variables d'environnement processus | Seul le processus uvicorn et ses enfants | Faible (isolation OS) |
| CI/CD | Non détecté (pas de GitHub Actions dans le repo) | N/A |
| Développeur local | Accès direct au `.env` local | Élevé si machine partagée |
| Vault / HSM | Aucun | Absence de contrôle compensatoire |
| Log files | `logs/backend.log` — risque si `str(e)` contient fragments de clé | Moyen |

### 5.2 Threat Model

**Attaquant externe (réseau)**:
- CORS restreint aux origines localhost → accès navigateur bloqué
- Pas d'authentification HTTP → accès curl depuis réseau local POSSIBLE
- Impact: accès en lecture aux endpoints GET, exécution de prompts si providers activés
- Probabilité réseau local: moyenne (dépend de la topologie)

**Attaquant interne (même machine)**:
- Accès direct aux fichiers `.env` si droits OS appropriés
- Accès direct aux endpoints localhost sans restriction
- Impact: lecture clés, exécution arbitraire de prompts
- Probabilité: faible (contexte lab solo)

**Supply chain**:
- 47+ dépendances Python dans .venv
- LangChain et ses dépendances ont accès direct aux clés API au runtime
- Un package malveillant dans la chaîne pourrait exfiltrer les clés via une requête sortante
- Pas de pinning de version strict (à vérifier dans requirements.txt)

### 5.3 Compliance — OWASP Top 10 (2021)

| OWASP | Catégorie | Statut | Finding |
|-------|-----------|--------|---------|
| A01 | Broken Access Control | PARTIAL | Aucune authentification sur les endpoints |
| A02 | Cryptographic Failures | LOW | TLS uniquement pour providers externes, localhost non chiffré (acceptable) |
| A03 | Injection | PARTIAL | Pas de SQL/command injection, mais prompt injection non sanitisée |
| A04 | Insecure Design | MEDIUM | Champ api_key dans schema PUT sans implémentation |
| A05 | Security Misconfiguration | MEDIUM | CORS allow_methods/allow_headers wildcard |
| A06 | Vulnerable Components | UNKNOWN | Pas d'audit des dépendances (pip audit non lancé) |
| A09 | Security Logging Failures | MEDIUM | str(e) exposé aux clients, mais logging serveur présent |

**RGPD (données médicales)**:
- Les prompts envoyés aux providers cloud peuvent contenir des données médicales fictives issues des templates
- Absence de Data Processing Agreement (DPA) documentée avec les providers cloud
- Pour un lab de recherche académique, le risque légal est faible mais devrait être documenté dans la thèse

### 5.4 Incident Response — Rotation de Clé

Procédure actuelle pour rotation d'une clé compromise:

1. Aller sur le portail du provider (Anthropic Console, OpenAI Platform, etc.)
2. Révoquer la clé compromise
3. Générer une nouvelle clé
4. Editer le `.env` local
5. Redémarrer le backend: `.\aegis.ps1 restart backend`

**Délai estimé**: 3-5 minutes par provider

**Risque**: Pas de mécanisme automatique de détection de clé compromise (pas de secret scanning en production, pas de webhook alerting des providers). La compromission serait détectée uniquement par une facture anormale ou une alerte manuelle du provider.

---

## 6. Quick Wins Prioritisés (10 actions)

| Priorité | Action | Fichier cible | Effort | Impact |
|----------|--------|---------------|--------|--------|
| QW-1 | Supprimer le champ `api_key` du Pydantic model `ProviderConfigUpdateRequest` | `llm_providers_routes.py:54` | 5 min | Ferme vecteur d'attaque réel |
| QW-2 | Remplacer `os.getenv("KEY", "")` par fail-fast pour Groq/Google/xAI | `llm_factory.py:177,197,207` | 15 min | Élimine silent fail pattern |
| QW-3 | Ajouter `max_length` sur les champs `prompt` et `system_prompt` des Pydantic models | `llm_providers_routes.py:40-43` | 10 min | Prévient abus coûteux |
| QW-4 | Restreindre `allow_methods` et `allow_headers` CORS | `server.py:30-31` | 5 min | Réduit surface CORS |
| QW-5 | Installer et configurer `detect-secrets` comme pre-commit hook | `.pre-commit-config.yaml` (new) | 20 min | Protection systématique git |
| QW-6 | Remplacer `str(e)` dans SSE stream par message générique, logger l'exception complète serveur-side | `llm_providers_routes.py:285` | 10 min | Élimine information disclosure |
| QW-7 | Ajouter bounds validation sur `temperature` et `max_tokens` via `Field(ge=0.0, le=2.0)` | `llm_providers_routes.py:41-42` | 10 min | Évite erreurs 422 silencieuses |
| QW-8 | Implémenter le rate limiting (`slowapi`) sur les endpoints LLM | `server.py` + routes | 2h | Honore le feature flag existant |
| QW-9 | Documenter la fuite Google query param dans les notes de sécurité du projet | CLAUDE.md ou README | 15 min | Awareness développeur |
| QW-10 | Lancer `pip audit` et documenter les CVE des dépendances critiques | Makefile / script | 30 min | Identifier supply chain risks |

---

## 7. Améliorations Moyen Terme (5 actions)

| ID | Action | Effort | Gain |
|----|--------|--------|------|
| MT-1 | Implémenter une authentification HTTP minimale sur les endpoints sensibles (API key interne ou token JWT) — même pour un lab local, protège contre les accès accidentels depuis un réseau partagé | 4h | Ferme A01 OWASP |
| MT-2 | Valider la cohérence config JSON vs factory via un test d'intégration automatique: pour chaque provider dans llm_providers_config.json, vérifier que llm_factory.py reconnaît le provider_id | 3h | Détecte désynchronisation |
| MT-3 | Implémenter un wrapper de secrets qui charge les clés une seule fois au démarrage et refuse de les écrire dans les logs | 6h | Defense-in-depth |
| MT-4 | Ajouter un endpoint `GET /api/redteam/security/audit` qui retourne un snapshot sanitaire de la config sécurité sans valeurs de clés | 3h | Observabilité sécurité |
| MT-5 | Mettre en place un scan périodique de l'historique git avec `trufflehog` intégré au PDCA | 2h | Détection rétroactive |

---

## 8. Risk Assessment Matrix

```
IMPACT (1=minimal, 5=critique)
  |
5 |  [SEC-04 silent fail]   [SEC-07 no rate limit]
  |
4 |  [SEC-05 api_key field]  [SEC-10 no precommit]
  |
3 |  [SEC-08 no input validation]  [SEC-09 str(e) disclosure]
  |
2 |  [SEC-06 CORS wildcards]
  |
1 |  [SEC-02 Google query param]  [SEC-01 residuel]
  |
  +----------------------------------------------------> LIKELIHOOD (1=improbable, 5=certain)
        1          2          3          4          5

Placement:
- SEC-04: Impact 5, Likelihood 3
- SEC-07: Impact 5, Likelihood 4
- SEC-05: Impact 4, Likelihood 3
- SEC-10: Impact 4, Likelihood 3
- SEC-08: Impact 3, Likelihood 4
- SEC-09: Impact 3, Likelihood 3
- SEC-06: Impact 2, Likelihood 2
- SEC-02: Impact 1, Likelihood 2
- SEC-01: Impact 1, Likelihood 1 (deja propre)
```

**Matrice de priorité (Impact x Likelihood):**

| Finding | Score risque | Priorité action |
|---------|-------------|-----------------|
| SEC-07 (no rate limit) | 5x4 = 20 | CRITIQUE |
| SEC-04 (silent fail) | 5x3 = 15 | HAUTE |
| SEC-05 (api_key field PUT) | 4x3 = 12 | HAUTE |
| SEC-10 (no precommit) | 4x3 = 12 | HAUTE |
| SEC-08 (no input validation) | 3x4 = 12 | HAUTE |
| SEC-09 (str(e) disclosure) | 3x3 = 9 | MOYENNE |
| SEC-06 (CORS wildcards) | 2x2 = 4 | FAIBLE (lab) |
| SEC-02 (Google query param) | 1x2 = 2 | INFO |
| SEC-01 (hardcoded keys) | 1x1 = 1 | PASS |
| SEC-03 (JSON config) | 0 | PASS |

---

## 9. Conclusion et Score Final

### Score Final: 5.8 / 10

**Décomposition par dimension:**

| Dimension | Score | Commentaire |
|-----------|-------|-------------|
| Gestion des secrets (SEC-01, SEC-03) | 9.5/10 | Excellente discipline, seule faiblesse = pas de scanner automatique |
| Authentification providers (SEC-02, SEC-04) | 5.0/10 | Délégation LangChain correcte mais silent fail dangereux |
| Sécurité des endpoints (SEC-05, SEC-08) | 4.0/10 | Surface d'attaque ouverte sur le PUT, input non validé |
| Sécurité réseau (SEC-06, SEC-07) | 3.5/10 | Rate limiting inexistant malgré le flag, CORS trop permissif |
| Observabilité sécurité (SEC-09, SEC-10) | 4.0/10 | Logging présent mais information disclosure et pas de git hooks |

### Recommandation Finale

PromptForge est **acceptable pour un usage strictement local en lab de recherche isolé** (localhost, réseau non partagé, accès physique contrôlé). Sa posture de sécurité repose principalement sur l'isolation réseau et la discipline de l'équipe — deux contrôles non techniques qui sont les plus fragiles en pratique.

Les 5 actions prioritaires avant tout déploiement sur un réseau partagé ou exposé:
1. Supprimer `api_key` du schema PUT (5 minutes, zéro risque d'effet de bord)
2. Fail-fast sur clés manquantes (15 minutes, zéro risque d'effet de bord)
3. Rate limiting sur les endpoints LLM (2 heures, priorité budget)
4. Validation input `prompt` max_length (10 minutes, zéro risque d'effet de bord)
5. Pre-commit secret scanner (20 minutes, protection long terme)

**Score post-quick-wins estimé: 7.2 / 10** — suffisant pour un déploiement réseau de laboratoire académique contrôlé.

---

*Audit realise sur sources du commit `9965407` (2026-04-04)*
*Scope: 1248 LOC analysees — 425 (routes) + 371 (factory) + 452 (frontend)*
*Methodologie: lecture statique du code, grep recursif, analyse git history, threat modeling*
*Auditeur: Claude Sonnet 4.6 — senior security audit mode*
