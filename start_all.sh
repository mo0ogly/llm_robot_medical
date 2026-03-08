#!/bin/bash

echo "==================================================="
echo "    Medical AI Simulator - System Initialization"
echo "==================================================="

echo "[1/5] Checking Ollama installation..."
if ! command -v ollama &> /dev/null
then
    echo "ERREUR: Ollama n'est pas installe. Veuillez l'installer depuis https://ollama.com"
    exit 1
fi

echo "[2/6] Checking Python installation..."
if ! command -v python3 &> /dev/null
then
    echo "ERREUR: Python3 n'est pas installe. Veuillez l'installer."
    exit 1
fi

echo "[3/6] Checking Node.js installation..."
if ! command -v npm &> /dev/null
then
    echo "ERREUR: Node.js/npm n'est pas installe. Veuillez l'installer depuis https://nodejs.org"
    exit 1
fi

echo "[4/6] Downloading AI Models (if missing)..."
echo "Pulling llama2:7b-chat for Medical AI..."
ollama pull llama2:7b-chat
echo "Pulling medllama2 for Cyber Defense AI..."
ollama pull medllama2

echo "[5/6] Setting up Python Backend..."
cd backend || exit
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
echo "Installing/Updating Python dependencies..."
python3 -m pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt > /dev/null
echo "Starting FastAPI server in background (Port 8042)..."
uvicorn src.server:app --port 8042 > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..

echo "[6/6] Setting up Node.js Frontend..."
cd frontend || exit
echo "Installing Node dependencies..."
npm install > /dev/null
echo "Starting Vite server..."
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..

echo "==================================================="
echo "Initialization Complete!"
echo "The Medical Simulator is now running."
echo "Frontend: http://localhost:5173"
echo "Backend : http://localhost:8042"
echo "==================================================="

echo "Waiting 3 seconds for servers to boot before opening browser..."
sleep 3

# Cross-platform browser opening
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    open http://localhost:5173
fi

echo "Press [CTRL+C] to stop all local servers."

# Trap CTRL+C to kill background processes
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
