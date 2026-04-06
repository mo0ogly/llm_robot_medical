# Installation

## Prerequis

| Outil | Version | Obligatoire |
|-------|---------|-------------|
| **Node.js** | >= 20 | Oui (frontend) |
| **Python** | >= 3.10 | Oui (backend) |
| **Ollama** | Latest | Oui (LLM local) |
| **Docker** | >= 24 | Optionnel (deploiement) |

## Installation rapide

### 1. Cloner le depot

```bash
git clone https://github.com/pizzif/poc_medical.git
cd poc_medical
```

### 2. Backend (FastAPI + Ollama)

```bash
cd backend
pip install -r requirements.txt
```

Dependencies principales :

- **Core** : FastAPI, Uvicorn, Ollama, Pydantic, ChromaDB, PyPDF
- **Attack Chains** : LangChain, LangChain-Chroma
- **Multi-Agent** : AG2 (AutoGen) avec support Ollama

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
```

### 4. Modele LLM

```bash
ollama pull llama3.2
```

## Demarrage

### Via le script AEGIS (recommande)

=== "Windows (PowerShell)"

    ```powershell
    .\aegis.ps1 start
    ```

=== "Linux/Mac"

    ```bash
    ./aegis.sh start
    ```

Commandes disponibles : `start`, `stop`, `restart`, `health`, `build`, `logs`

### Demarrage manuel

```bash
# Terminal 1 — Backend
cd backend
python server.py
# Ecoute sur http://localhost:8042

# Terminal 2 — Frontend
cd frontend
npm run dev
# Ecoute sur http://localhost:5173
```

### Via Docker Compose

```bash
docker compose up -d
```

Services :

| Service | Port | Description |
|---------|------|-------------|
| `backend` | 8042 | FastAPI + orchestrateur |
| `frontend` | 80 | React (build de production) |
| `chromadb` | 8000 | Base vectorielle |

!!! note "Ollama"
    Ollama doit tourner sur la machine hote. Docker se connecte via `host.docker.internal`.

## Verification

```bash
# Health check
curl http://localhost:8042/health

# Verifier les chains disponibles
curl http://localhost:8042/api/redteam/chains
```

## Commandes aegis.ps1

| Commande | Description |
|----------|-------------|
| `.\aegis.ps1 start` | Demarre backend + frontend + wiki |
| `.\aegis.ps1 start backend` | Demarre uniquement le backend |
| `.\aegis.ps1 start wiki` | Demarre uniquement le wiki (port 8001) |
| `.\aegis.ps1 stop` | Arrete tous les services |
| `.\aegis.ps1 restart` | Redemarre tous les services |
| `.\aegis.ps1 health` | Affiche le statut de tous les services |
| `.\aegis.ps1 build` | Build frontend + backend + wiki |
| `.\aegis.ps1 build wiki` | Build uniquement le wiki |
| `.\aegis.ps1 logs` | Affiche les logs des services |
| `.\aegis.ps1 wiki` | Ouvre le wiki dans le navigateur |

Sans argument, le script affiche un menu interactif.

## Ports utilises

| Port | Service |
|------|---------|
| 5173 | Frontend (dev) |
| 8001 | Wiki MkDocs |
| 8042 | Backend API |
| 8000 | ChromaDB |
| 11434 | Ollama |

## Variables d'environnement

| Variable | Defaut | Description |
|----------|--------|-------------|
| `OLLAMA_HOST` | `localhost:11434` | Adresse du serveur Ollama |
| `CHROMA_HOST` | `localhost` | Hote ChromaDB |
| `CHROMA_PORT` | `8000` | Port ChromaDB |
| `CORS_ORIGINS` | `*` | Origines CORS autorisees |
| `LLM_PROVIDER` | `ollama` | Provider LLM par defaut |
| `OPENAI_API_KEY` | -- | Cle API OpenAI (optionnel) |
| `ANTHROPIC_API_KEY` | -- | Cle API Anthropic (optionnel) |
| `GROQ_API_KEY` | -- | Cle API Groq (optionnel, pour LLM-juge) |

Creer un fichier `.env` dans `backend/` :

```env
OLLAMA_HOST=localhost:11434
LLM_PROVIDER=ollama
```

## Degradation gracieuse

Le backend demarre normalement meme si certains composants sont absents :

| Composant | Absent | Impact |
|-----------|--------|--------|
| LangChain | Non installe | Chaines d'attaque indisponibles (log INFO) |
| ChromaDB | Hors ligne | RAG indisponible, fallback sans contexte |
| Groq API | Pas de cle | LLM-juge fallback sur Ollama local |
| OpenAI/Anthropic | Pas de cle | Provider indisponible, Ollama reste actif |

## Troubleshooting

### Ollama ne repond pas

```bash
# Verifier que le service tourne
ollama list
# Si erreur, redemarrer
ollama serve
```

### Port deja utilise

```powershell
# Via aegis.ps1
.\aegis.ps1 kill-port 8042

# Manuellement
netstat -ano | findstr :8042
taskkill /PID <pid> /F
```

### Frontend ne compile pas

```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### ChromaDB connection refused

```bash
# Verifier le port 8000
curl http://localhost:8000/api/v1/heartbeat
# Si Docker : verifier que le container tourne
docker ps | grep chromadb
```

## Structure du projet

```
poc_medical/
+-- backend/           FastAPI + Ollama + ChromaDB (:8042)
|   +-- agents/        Agents IA (Da Vinci, AEGIS, RedTeam, Genetic)
|   +-- routes/        11 modules de routes (69 endpoints)
|   +-- taxonomy/      CrowdStrike 95 + defenses 70 techniques
|   +-- prompts/       102 templates d'attaque
+-- frontend/          React 19 + Vite + Tailwind v4 (:5173)
|   +-- src/components/        24 composants dashboard
|   +-- src/components/redteam/ 51 composants Red Team Lab
|   +-- src/hooks/             5 hooks custom
+-- research_archive/  These doctorale (80 papiers, 66 formules)
+-- wiki/              Ce wiki (MkDocs Material, :8001)
+-- .claude/skills/    16 skills Claude Code
+-- aegis.ps1/.sh      Scripts de gestion
```
