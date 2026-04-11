# Guia de contribuicao

!!! abstract "Regras do projeto"
    Todas as regras estao em `.claude/CLAUDE.md` e `.claude/rules/*.md`. Esta pagina as
    sintetiza para contribuidores externos.

## 1. Ambiente de dev

```bash
# Clone
git clone https://github.com/pizzif/poc_medical
cd poc_medical

# Python 3.13
python -m venv venv
source venv/bin/activate  # Linux/Mac
# .\venv\Scripts\Activate.ps1  # Windows
pip install -r backend/requirements.txt

# Frontend
cd frontend
npm install

# Start (Windows)
.\aegis.ps1 start
# Start (Linux/Mac)
./aegis.sh start
```

## 2. Regras absolutas (CLAUDE.md)

### ZERO placeholder / ZERO decorativo

1. **ZERO placeholder** — cada elemento UI conectado a uma chamada API real backend
2. **ZERO decorativo** — sem Matrix rain, sem fake "SYSTEM COMPROMISED"
3. **ZERO emoticon** no codigo exceto demanda explicita do usuario
4. **ZERO aproximacao** — tese doutoral, nada sem prova

**Audit** : `grep -rn 'setTimeout\|EXPLOITATION SUCCESSFUL\|SYSTEM COMPROMISED' frontend/src/` →
**0 resultado esperado**.

### Process management

!!! danger "NUNCA comandos diretos"
    Sempre via `aegis.ps1` (Windows) / `aegis.sh` (Linux) :

    ```powershell
    .\aegis.ps1 start       # Inicia backend + frontend + wiki
    .\aegis.ps1 stop        # Para todos os servicos
    .\aegis.ps1 restart     # Reinicia corretamente
    .\aegis.ps1 health      # Healthcheck todos os endpoints
    .\aegis.ps1 build       # Build frontend + wiki
    .\aegis.ps1 logs        # Tail logs
    .\aegis.ps1 test        # Run pytest
    ```

## 3. Regras especificas por linguagem

### Python (backend)

- **FastAPI** com rotas em `backend/routes/`
- Sem `print()` em producao — usar `logging`
- **Type hints** nas funcoes publicas
- **Docstrings em ingles**, comentarios FR OK
- Sem secrets no codigo — `.env` (gitignore)

### React (frontend)

- **Sem emoticons** no codigo ou strings UI
- **i18n obrigatoria** : `t('key')` para todo texto visivel
- **Template literal bug** : sem `${}` em funcoes standalone .jsx (usar concatenacao)
- **Tailwind v4** — classes utilitarias, sem CSS custom exceto necessario
- **Componentes Red Team** : `frontend/src/components/redteam/`

### Geral

- **ZERO import inutil** — limpar apos refatoracao
- **ZERO arquivo orfao** — remover se nao mais usado
- **Todo arquivo criado deve ser referenciado** em algum lugar

## 4. Regra das 800 linhas

!!! warning "Nenhum arquivo fonte deve exceder 800 linhas"
    Aplica-se a **todos os tipos** : `.py`, `.jsx`, `.js`, `.ts`, `.tsx`, `.go`, `.md`, `.json`, `.yaml`.

    **Excecoes** :

    - Arquivos gerados automaticamente (lockfiles, dist/)
    - Datasets JSON (chroma_db dumps)
    - Manuscrito de tese (`research_archive/manuscript/`)

    **Enforcement** : hook `file_size_check.cjs` em PreToolUse em Edit/Write.

    **Refatoracao** :

    - 700 linhas → comecar a planejar a decomposicao
    - 800 linhas → **decomposicao obrigatoria** em modulos logicos
    - Decomposicao por **responsabilidade** (um modulo = uma responsabilidade)

## 5. Hooks Claude Code

### `.claude/hooks/`

| Hook | Event | Papel |
|------|-------|-------|
| `secret-scanner.cjs` | PreToolUse Write/Edit | Bloqueia API keys, tokens, senhas |
| `file_size_check.cjs` | PreToolUse Write/Edit | Bloqueia arquivos > 800 linhas |
| `frustration-detector.cjs` | UserPromptSubmit | Detecta padroes de frustracao |
| `session_start_primer.cjs` | SessionStart | Carrega o contexto do projeto |
| `safe_pipeline_checker.cjs` | PreToolUse Bash | Impede comandos destrutivos |

## 6. Content Filter Safety

!!! danger "Arquivos sensiveis — NUNCA ler o conteudo completo"

    O content filter Claude bloqueia certos arquivos contendo payloads adversariais. NUNCA
    ler :

    - `backend/scenarios.py` — contem os 48 scenarios com payloads
    - `backend/attack_catalog.py`
    - `backend/prompts/*.json` (campo `"template"`)
    - `frontend/src/i18n.js` (valores textuais completos)

    **Trabalhar via** :

    - Metadados apenas (nome, id, camada, descricao)
    - Arquivos `.md` associados (safe porque contextualizados)
    - Sub-agents : **sempre incluir** *"NUNCA leia o conteudo completo dos arquivos
      sensiveis"* no prompt

    **Padrao 3-camadas** para escrever payloads sem bloquear o filter :

    1. Orchestrator permanece geral (sem conteudo adversarial)
    2. Forge subagent gera os prompts (conteudo adversarial escopado)
    3. Python script escreve o JSON final (sem LLM envolvido)

## 7. Git workflow

- **Branches** : `main` e protegida, PR somente
- **Commits** :
  - `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
  - Mensagens em ingles, concisas, formato `<type>(<scope>): <message>`
- **Tipos** : `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- **research_archive/** esta **no .gitignore** — force add com `git add -f` para thesis docs
- **Sem `houyi`** nos nomes de arquivos (convencao do projeto)

### Exemplo de commit

```bash
git commit -m "$(cat <<'EOF'
feat(run-008): anti-doublon framework + SessionStart primer + scenarios.py structural fix

Implement check_corpus_dedup.py to cross-check arXiv IDs against MANIFEST.md
before any bibliographic integration. Add session_start_primer.cjs hook to
load project context automatically. Fix structural bugs in scenarios.py:
48 scenarios validated via test_scenarios.py.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

## 8. Testes obrigatorios antes do merge

```bash
# Backend tests
cd backend && python -m pytest tests/ -v

# Frontend lint + build
cd frontend && npm run lint && npm run build

# Audit tese (regra AEGIS)
/audit-these full

# Delta notation check
python backend/tools/check_delta_notation.py

# Secret scan
git diff --staged | grep -i "api_key\|password\|token"
# Expected: empty
```

## 9. Documentacao obrigatoria apos mudanca

1. **`README.md`** (EN) + **`README_FR.md`** (FR) + **`README_BR.md`** (BR)
2. `backend/README.md` — contas, API docs
3. `ScenarioHelpModal.jsx` — help modals se novo scenario
4. `formal_framework_complete.md` — se mudanca de framework
5. `INTEGRATION_TRACKER.md` — se integracao externa
6. Wiki : `wiki/docs/` + rebuild `python build_wiki.py && python -m mkdocs build`

## 10. Skills a usar segundo a situacao

| Situacao | Skill |
|----------|-------|
| Implementacao estruturada | `/apex` (10 etapas) |
| Audit qualidade | `/audit-pdca` (benchmark + receita) |
| Nova ficha de analise | `/fiche-attaque [num]` |
| Pesquisa bibliografica | `/bibliography-maintainer incremental` |
| Orquestracao PDCA | `/research-director cycle` |
| Novo prompt de ataque | `/aegis-prompt-forge FORGE` |
| Novo scenario | `/add-scenario` (6 agents) |
| Analise resultados de campanha | `/experimentalist [experiment_id]` |
| Gap para campanha | `/experiment-planner [gap_id]` |
| Resultados para manuscrito | `/thesis-writer [conjecture_id]` |
| Publicacao wiki | `/wiki-publish update` |

## 11. Trilingual mandatory

**Todo texto visivel** : `t('key')` via `react-i18next`. **NUNCA** string hardcoded.

**3 idiomas** : FR / EN / BR. Cf. [i18n/index.md](../i18n/index.md).

## 12. Notacao δ — Unicode obrigatoria

**SEMPRE** `δ⁰ δ¹ δ² δ³` na documentacao. **NUNCA** `delta-0 / delta-1 / delta-2 / delta-3`.

Excecao : codigo fonte Python/JSX em que ASCII e obrigatorio (chaves de dicionario).

Cf. [notation-delta.md](../notation-delta.md).

## 13. Estatisticas doutorais

- **Sep(M) N >= 30** por condicao, Sep(M)=0 com 0 violacoes = **artefato**
- **Tags** : `[ARTICLE VERIFIE]` / `[PREPRINT]` / `[HYPOTHESE]` / `[CALCUL VERIFIE]` / `[EXPERIMENTAL]`
- **Pre-check** 5 runs baseline antes de qualquer campanha N >= 30
- **Maximo 3 iteracoes** por campanha, depois escalacao humana

## 14. Audit qualidade — `/audit-these`

- Cada sessao COMECA e TERMINA por `/audit-these full`
- Nenhum lote "done" sem audit (`lint_sources.py > 5% NONE = NAO DONE`)
- **Cross-validation** : 3 numeros aleatorios verificados contra fulltext ChromaDB apos cada
  batch
- Se 1 numero errado → refazer o batch **inteiro**
- **Maximo 3 agents em paralelo** (auditabilidade)
- Qualquer afirmacao *"o unico"*, *"o primeiro"* → WebSearch de verificacao **ANTES** da publicacao

## 15. Recursos

- :material-file-document: [CLAUDE.md](https://github.com/pizzif/poc_medical/blob/main/.claude/CLAUDE.md)
- :material-file-document: [rules/programming.md](https://github.com/pizzif/poc_medical/blob/main/.claude/rules/programming.md)
- :material-file-document: [rules/doctoral-research.md](https://github.com/pizzif/poc_medical/blob/main/.claude/rules/doctoral-research.md)
- :material-file-document: [rules/redteam-analysis.md](https://github.com/pizzif/poc_medical/blob/main/.claude/rules/redteam-analysis.md)
- :material-robot: [Claude Code docs](https://docs.claude.com/en/docs/claude-code)
