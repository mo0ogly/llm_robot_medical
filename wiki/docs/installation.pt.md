# Instalacao

## Pre-requisitos

| Ferramenta | Versao | Obrigatorio |
|------------|--------|-------------|
| **Node.js** | >= 20 | Sim (frontend) |
| **Python** | >= 3.10 | Sim (backend) |
| **Ollama** | Latest | Sim (LLM local) |
| **Docker** | >= 24 | Opcional (implantacao) |

## Instalacao Rapida

### 1. Clonar o repositorio

```bash
git clone https://github.com/pizzif/poc_medical.git
cd poc_medical
```

### 2. Backend (FastAPI + Ollama)

```bash
cd backend
pip install -r requirements.txt
```

Dependencias principais:

- **Core**: FastAPI, Uvicorn, Ollama, Pydantic, ChromaDB, PyPDF
- **Cadeias de Ataque**: LangChain, LangChain-Chroma
- **Multi-Agente**: AG2 (AutoGen) com suporte Ollama

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
```

### 4. Modelo LLM

```bash
ollama pull llama3.2
```

## Inicializacao

### Via script AEGIS (recomendado)

=== "Windows (PowerShell)"

    ```powershell
    .\aegis.ps1 start
    ```

=== "Linux/Mac"

    ```bash
    ./aegis.sh start
    ```

Comandos disponiveis: `start`, `stop`, `restart`, `health`, `build`, `logs`

### Inicializacao manual

```bash
# Terminal 1 -- Backend
cd backend
python server.py
# Escuta em http://localhost:8042

# Terminal 2 -- Frontend
cd frontend
npm run dev
# Escuta em http://localhost:5173
```

### Via Docker Compose

```bash
docker compose up -d
```

Servicos:

| Servico | Porta | Descricao |
|---------|-------|-----------|
| `backend` | 8042 | FastAPI + orquestrador |
| `frontend` | 80 | React (build de producao) |
| `chromadb` | 8000 | Banco de dados vetorial |

!!! note "Ollama"
    Ollama deve estar rodando na maquina host. Docker conecta via `host.docker.internal`.

## Verificacao

```bash
# Health check
curl http://localhost:8042/health

# Listar cadeias disponiveis
curl http://localhost:8042/api/redteam/chains
```

## Comandos aegis.ps1

| Comando | Descricao |
|---------|-----------|
| `.\aegis.ps1 start` | Inicia backend + frontend + wiki |
| `.\aegis.ps1 start backend` | Inicia apenas o backend |
| `.\aegis.ps1 start wiki` | Inicia apenas o wiki (porta 8001) |
| `.\aegis.ps1 stop` | Para todos os servicos |
| `.\aegis.ps1 restart` | Reinicia todos os servicos |
| `.\aegis.ps1 health` | Mostra status de todos os servicos |
| `.\aegis.ps1 build` | Build frontend + backend + wiki |
| `.\aegis.ps1 logs` | Mostra logs dos servicos |

Sem argumento, o script exibe um menu interativo.

## Portas Utilizadas

| Porta | Servico |
|-------|---------|
| 5173 | Frontend (dev) |
| 8001 | Wiki MkDocs |
| 8042 | Backend API |
| 8000 | ChromaDB |
| 11434 | Ollama |

## Variaveis de Ambiente

| Variavel | Padrao | Descricao |
|----------|--------|-----------|
| `OLLAMA_HOST` | `localhost:11434` | Endereco do servidor Ollama |
| `CHROMA_HOST` | `localhost` | Host ChromaDB |
| `CHROMA_PORT` | `8000` | Porta ChromaDB |
| `CORS_ORIGINS` | `*` | Origens CORS permitidas |
| `LLM_PROVIDER` | `ollama` | Provedor LLM padrao |
| `OPENAI_API_KEY` | -- | Chave API OpenAI (opcional) |
| `ANTHROPIC_API_KEY` | -- | Chave API Anthropic (opcional) |
| `GROQ_API_KEY` | -- | Chave API Groq (opcional, para LLM-juiz) |

Crie um arquivo `.env` em `backend/`:

```env
OLLAMA_HOST=localhost:11434
LLM_PROVIDER=ollama
```

## Degradacao Graciosa

O backend inicia normalmente mesmo se alguns componentes estiverem ausentes:

| Componente | Ausente | Impacto |
|------------|---------|---------|
| LangChain | Nao instalado | Cadeias de ataque indisponiveis (log INFO) |
| ChromaDB | Offline | RAG indisponivel, fallback sem contexto |
| Groq API | Sem chave | LLM-juiz usa Ollama local |
| OpenAI/Anthropic | Sem chave | Provedor indisponivel, Ollama permanece ativo |

## Solucao de Problemas

### Ollama nao responde

```bash
ollama list
ollama serve
```

### Porta ja em uso

```powershell
.\aegis.ps1 kill-port 8042
```

### ChromaDB connection refused

```bash
curl http://localhost:8000/api/v1/heartbeat
docker ps | grep chromadb
```

## Estrutura do Projeto

```
poc_medical/
+-- backend/           FastAPI + Ollama + ChromaDB (:8042)
|   +-- agents/        Agentes IA (Da Vinci, AEGIS, RedTeam, Genetico)
|   +-- routes/        11 modulos de rotas (69 endpoints)
|   +-- taxonomy/      CrowdStrike 95 + defesas 70 tecnicas
|   +-- prompts/       102 templates de ataque
+-- frontend/          React 19 + Vite + Tailwind v4 (:5173)
|   +-- src/components/        24 componentes dashboard
|   +-- src/components/redteam/ 51 componentes Red Team Lab
|   +-- src/hooks/             5 hooks customizados
+-- research_archive/  Tese de doutorado (80 artigos, 66 formulas)
+-- wiki/              Este wiki (MkDocs Material, :8001)
+-- .claude/skills/    16 skills Claude Code
+-- aegis.ps1/.sh      Scripts de gerenciamento
```
