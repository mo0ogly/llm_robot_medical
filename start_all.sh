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

echo "[2/5] Downloading AI Models (if missing)..."
echo "Pulling llama2:7b-chat for Medical AI..."
ollama pull llama2:7b-chat
echo "Pulling medllama2 for Cyber Defense AI..."
ollama pull medllama2

echo "[3/5] Setting up Python Backend..."
cd backend || exit
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
echo "Installing Python dependencies..."
pip install -r requirements.txt > /dev/null
echo "Starting FastAPI server in background (Port 8042)..."
uvicorn src.server:app --port 8042 > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..

echo "[4/5] Setting up Node.js Frontend..."
cd frontend || exit
echo "Installing Node dependencies..."
npm install > /dev/null
echo "Starting Vite server..."
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..

echo "[5/5] Initialization Complete."
echo "The Medical Simulator is now running."
echo "Frontend: http://localhost:5173"
echo "Backend : http://localhost:8042"
echo "Press [CTRL+C] to stop all local servers."

# Trap CTRL+C to kill background processes
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
