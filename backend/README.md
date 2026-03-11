# Aegis Backend - AI Orchestrator & Multi-Agent Engine

This is the FastAPI-based backend for the Aegis Medical AI Simulator. It handles AI orchestration using AutoGen (AG2) and streams results via SSE.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- [Ollama](https://ollama.com/) (running locally)
- Llama 3.2 model (`ollama run llama3.2`)

### Installation
```bash
pip install -r requirements.txt
```

### Running the Server
```bash
python server.py
```

## 🛠️ Components

- **server.py**: FastAPI endpoints for UI interaction and SSE streaming.
- **orchestrator.py**: AutoGen implementation of the multi-agent logic (RedTeam, DaVinci, Aegis).
- **agents/prompts.py**: System prompts for different difficulty levels.
- **scenarios.py**: Definitions of complex attack scenarios.

## 🤖 AI Agents

1. **MedicalRobotAgent (Da Vinci)**: The target Assistant AI with clinical rules.
2. **RedTeamAgent**: The adversarial LLM generating probes and attacks.
3. **SecurityAuditAgent (AEGIS)**: The defender LLM scoring and intercepting attacks.

## 📡 API Endpoints (Main)

- `GET /api/vitals`: Current patient vital signs.
- `POST /api/chat`: Send a message to the surgical assistant.
- `POST /api/redteam/attack/stream`: SSE stream for a single targeted attack.
- `POST /api/redteam/campaign/stream`: SSE stream for a full security audit.
- `GET /api/scenarios`: List available Red Team scenarios.
