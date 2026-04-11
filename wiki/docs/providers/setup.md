# Providers LLM — setup et propagation

!!! abstract "Les 5 providers supportes"
    AEGIS supporte **5 providers LLM** via `backend/llm_providers.py` et routes dediees
    `backend/routes/llm_providers_routes.py` :

    - **Ollama** (local, defaut)
    - **Groq** (cloud, rapide, throttling)
    - **OpenAI** (cloud, GPT-4/4o/5)
    - **Anthropic** (cloud, Claude Opus/Sonnet)
    - **Mistral** (cloud, Mistral Large)

## 1. Matrice des providers

| Provider | Modeles principaux | Cost | Latence | Rate limit | Usage AEGIS |
|----------|-------------------|:----:|:-------:|:----------:|-------------|
| **Ollama** | llama3.2, llama3.1:70b, qwen3:32b | **$0** | Variable (GPU local) | Aucun | Defaut dev + campagnes locales |
| **Groq** | llama-3.1-8b-instant, llama-3.3-70b-versatile | ~$0.30/1h | **< 1s** | **50 req/s** | Campagnes rapides |
| **OpenAI** | gpt-4o, gpt-4-turbo, gpt-5 | ~$5/campaign | 1-3s | 10k TPM | Baseline comparative |
| **Anthropic** | claude-opus-4-6, claude-sonnet-4-6 | ~$10/campaign | 2-5s | 50 req/s | Tests adversariaux |
| **Mistral** | mistral-large-latest | ~$2/campaign | 1-2s | Variable | Cross-family |

## 2. Setup

### Ollama (defaut, local)

```bash
# Installation
curl -fsSL https://ollama.com/install.sh | sh
# Windows: https://ollama.com/download/windows

# Pull modele
ollama pull llama3.2:latest
ollama pull llama3.1:70b       # 70B pour THESIS-002
ollama pull qwen3:32b          # cross-family THESIS-003

# Lancer daemon
ollama serve  # port 11434

# Verifier
curl http://localhost:11434/api/tags
```

**Aucune cle API requise**. Le backend detecte automatiquement Ollama sur `localhost:11434`.

### Groq

1. Creer compte sur [console.groq.com](https://console.groq.com)
2. Generer API key
3. Ajouter dans `.env` :

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

## 3. Endpoint de selection

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

## 4. Propagation aux agents AG2 — **RETEX critique**

!!! danger "Le bug des 3h (THESIS-001, 2026-04-08)"
    **Symptome** : THESIS-001 bloque a 115 appels Groq avec retry loop Ollama (500 errors).

    **Cause racine** : `orchestrator.py` passait `provider=groq` **uniquement** au
    `medical_agent`. Les 3 autres agents (`red_team_agent`, `security_audit_agent`,
    `adaptive_attacker`) tombaient sur Ollama par defaut. Quand Ollama devenait instable, le
    GroupChat AG2 restait bloque en retry sur `security_audit_agent`.

    **Fix** :

    1. **Signature obligatoire** : `def create_XXX_agent(provider: str = None, model: str = None)`
    2. **Propagation integrale** : tous les `create_*_agent()` recoivent `provider/model`
    3. **Fallback cross-provider** : `CYBER_MODEL → MEDICAL_MODEL` quand `provider != "ollama"`
       (`saki007ster/CybersecurityRiskAnalyst:latest` n'existe que sur Ollama)

    **Lecon fondamentale** : AG2 multi-agent = **multi-config LLM**. Chaque `ConversableAgent` a
    sa propre `llm_config`. Les scripts directs (`call_llm()`) sont plus robustes car
    **mono-provider par design**.

### Pattern correct

```python
# backend/orchestrator.py (apres fix)

class RedTeamOrchestrator:
    def __init__(self, provider=None, model=None, **kwargs):
        self.provider = provider or "ollama"
        self.model = model

        # TOUS les agents recoivent provider/model
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

### Verification anti-regression

```bash
# Avant lancement, verifier propagation correcte
grep -c "groq.com.*200 OK" logs/campaign_*.log
grep -c "11434" logs/campaign_*.log

# Si les deux comptes sont > 0 → mix provider detecte → BLOQUER
```

## 5. Adaptation parametres au modele

!!! note "Regle AEGIS (CLAUDE.md)"
    Les protocoles experimentaux DOIVENT etre adaptes a la **taille du modele cible** :

    | Taille | max_tokens | Fuzzing | Temperature |
    |:------:|:----------:|---------|:-----------:|
    | **3B** | **>= 500** | 1 transform max | **0** |
    | **7B** | >= 300 | 1-2 transforms | 0.3 |
    | **70B+** | standard | complet | 0.7 |

**Pourquoi** : les petits modeles produisent du **noise** sous perturbations combinees.
TC-001 iteration 1 (`max_tokens=150, temperature=0.7, max_fuzz=2`) a donne un verdict
INCONCLUSIVE a cause de ces parametres trop agressifs.

## 6. Fallback automatique

```python
# backend/llm_providers.py (extrait)

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

**Attention** : le fallback introduit du **biais experimental**. Pour les campagnes de these,
desactiver le fallback et **logger explicitement** l'echec :

```python
orchestrator = RedTeamOrchestrator(
    provider="groq",
    model="llama-3.1-8b-instant",
    fallback_enabled=False,  # CRITIQUE pour reproductibilite
)
```

## 7. Statistiques de stabilite

| Provider | Taux d'echec campagne THESIS-001 | Commentaire |
|----------|:--------------------------------:|-------------|
| Ollama (llama3.2:3b) | ~5% (timeout GPU) | Stable mais lent |
| **Groq (llama-3.1-8b-instant)** | **0.08%** (4/4800) | **Tres stable** |
| OpenAI (gpt-4o) | <1% | Rate limit principal |
| Anthropic (claude-sonnet) | ~2% | Moderation occasionnelle |
| Mistral | ~3% | Throttling parfois |

## 8. Cost analysis

Pour une **campagne THESIS-001 standard** (1200 runs, 4800 appels LLM) :

| Provider | Cost | Duree |
|----------|:----:|:-----:|
| Ollama local | **$0** | ~10h (GPU RTX 4090) |
| Groq 8B | **~$0.30** | **~1h15** |
| OpenAI gpt-4o | ~$5 | ~2h |
| Anthropic Sonnet | ~$10 | ~3h |
| Mistral Large | ~$2 | ~1h30 |

**Recommandation** : Groq 8B pour les campagnes iteratives (pre-check + iter 1-3), Ollama pour
la reproduction thesis et publication (zero coût).

## 9. Limites et avantages

<div class="grid" markdown>

!!! success "Avantages"
    - **5 providers** pour cross-family validation
    - **Fallback automatique** en dev (desactivable en publication)
    - **Adaptation parametres** par taille de modele
    - **Monitoring cost** via endpoint `/api/llm-providers/usage`
    - **Reproductibilite** : Ollama local = seed controlable
    - **Cross-model validation** (THESIS-002, THESIS-003)

!!! failure "Limites"
    - **Groq throttling** : 50 req/s peut bloquer grosses campagnes
    - **Ollama instabilite** : crash GPU possible sous charge
    - **Biais fallback** : les fallbacks non logges pollue les resultats
    - **Cout Anthropic/OpenAI** eleve pour les campagnes N=30+
    - **RETEX RETEX** : la propagation provider reste fragile a chaque refactoring
    - **Pas de streaming AG2** : les fallbacks cassent les SSE events

</div>

## 10. Ressources

- :material-code-tags: [backend/llm_providers.py](https://github.com/pizzif/poc_medical/blob/main/backend/llm_providers.py)
- :material-api: [API LLM Providers](../api/llm-providers.md)
- :material-robot: [Agents AG2 — propagation](../agents/index.md)
- :material-file-alert: [RETEX THESIS-001](../experiments/index.md#thesis-001-formal-thesis-campaign)
- :material-server: [Ollama.com](https://ollama.com)
- :material-server: [console.groq.com](https://console.groq.com)
