# Installation

## Prerequisites

| Tool | Version | Required |
|------|---------|----------|
| **Node.js** | >= 20 | Yes (frontend) |
| **Python** | >= 3.10 | Yes (backend) |
| **Ollama** | Latest | Yes (local LLM) |
| **Docker** | >= 24 | Optional (deployment) |

## Quick Install

### 1. Clone the repository

```bash
git clone https://github.com/pizzif/poc_medical.git
cd poc_medical
```

### 2. Backend (FastAPI + Ollama)

```bash
cd backend
pip install -r requirements.txt
```

Main dependencies:

- **Core**: FastAPI, Uvicorn, Ollama, Pydantic, ChromaDB, PyPDF
- **Attack Chains**: LangChain, LangChain-Chroma
- **Multi-Agent**: AG2 (AutoGen) with Ollama support

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
```

### 4. LLM Model

```bash
ollama pull llama3.2
```

## Starting

### Via AEGIS script (recommended)

=== "Windows (PowerShell)"

    ```powershell
    .\aegis.ps1 start
    ```

=== "Linux/Mac"

    ```bash
    ./aegis.sh start
    ```

Available commands: `start`, `stop`, `restart`, `health`, `build`, `logs`

### Manual start

```bash
# Terminal 1 -- Backend
cd backend
python server.py
# Listens on http://localhost:8042

# Terminal 2 -- Frontend
cd frontend
npm run dev
# Listens on http://localhost:5173
```

### Via Docker Compose

```bash
docker compose up -d
```

Services:

| Service | Port | Description |
|---------|------|-------------|
| `backend` | 8042 | FastAPI + orchestrator |
| `frontend` | 80 | React (production build) |
| `chromadb` | 8000 | Vector database |

!!! note "Ollama"
    Ollama must run on the host machine. Docker connects via `host.docker.internal`.

## Verification

```bash
# Health check
curl http://localhost:8042/health

# List available chains
curl http://localhost:8042/api/redteam/chains
```

## aegis.ps1 Commands

| Command | Description |
|---------|-------------|
| `.\aegis.ps1 start` | Start backend + frontend + wiki |
| `.\aegis.ps1 start backend` | Start backend only |
| `.\aegis.ps1 start wiki` | Start wiki only (port 8001) |
| `.\aegis.ps1 stop` | Stop all services |
| `.\aegis.ps1 restart` | Restart all services |
| `.\aegis.ps1 health` | Show all services status |
| `.\aegis.ps1 build` | Build frontend + backend + wiki |
| `.\aegis.ps1 build wiki` | Build wiki only |
| `.\aegis.ps1 logs` | Show service logs |
| `.\aegis.ps1 wiki` | Open wiki in browser |

Without arguments, the script shows an interactive menu.

## Ports

| Port | Service |
|------|---------|
| 5173 | Frontend (dev) |
| 8001 | Wiki MkDocs |
| 8042 | Backend API |
| 8000 | ChromaDB |
| 11434 | Ollama |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_HOST` | `localhost:11434` | Ollama server address |
| `CHROMA_HOST` | `localhost` | ChromaDB host |
| `CHROMA_PORT` | `8000` | ChromaDB port |
| `CORS_ORIGINS` | `*` | Allowed CORS origins |
| `LLM_PROVIDER` | `ollama` | Default LLM provider |
| `OPENAI_API_KEY` | -- | OpenAI API key (optional) |
| `ANTHROPIC_API_KEY` | -- | Anthropic API key (optional) |
| `GROQ_API_KEY` | -- | Groq API key (optional, for LLM-judge) |

Create a `.env` file in `backend/`:

```env
OLLAMA_HOST=localhost:11434
LLM_PROVIDER=ollama
```

## Graceful Degradation

The backend starts normally even if some components are missing:

| Component | Missing | Impact |
|-----------|---------|--------|
| LangChain | Not installed | Attack chains unavailable (INFO log) |
| ChromaDB | Offline | RAG unavailable, contextless fallback |
| Groq API | No key | LLM-judge falls back to local Ollama |
| OpenAI/Anthropic | No key | Provider unavailable, Ollama remains active |

## Troubleshooting

### Ollama not responding

```bash
# Check service is running
ollama list
# If error, restart
ollama serve
```

### Port already in use

```powershell
# Via aegis.ps1
.\aegis.ps1 kill-port 8042

# Manually
netstat -ano | findstr :8042
taskkill /PID <pid> /F
```

### Frontend build failure

```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### ChromaDB connection refused

```bash
# Check port 8000
curl http://localhost:8000/api/v1/heartbeat
# If Docker: check container is running
docker ps | grep chromadb
```

## Project Structure

```
poc_medical/
+-- backend/           FastAPI + Ollama + ChromaDB (:8042)
|   +-- agents/        AI Agents (Da Vinci, AEGIS, RedTeam, Genetic)
|   +-- routes/        11 route modules (69 endpoints)
|   +-- taxonomy/      CrowdStrike 95 + defenses 70 techniques
|   +-- prompts/       102 attack templates
+-- frontend/          React 19 + Vite + Tailwind v4 (:5173)
|   +-- src/components/        24 dashboard components
|   +-- src/components/redteam/ 51 Red Team Lab components
|   +-- src/hooks/             5 custom hooks
+-- research_archive/  Doctoral thesis (80 papers, 66 formulas)
+-- wiki/              This wiki (MkDocs Material, :8001)
+-- .claude/skills/    16 Claude Code skills
+-- aegis.ps1/.sh      Management scripts
```
