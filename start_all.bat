@echo off
setlocal
echo ===================================================
echo     Medical AI Simulator - System Initialization
echo ===================================================

echo [1/5] Checking Ollama installation...
where ollama >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERREUR: Ollama n'est pas installe. Veuillez l'installer depuis https://ollama.com
    pause
    exit /b 1
)

echo [2/5] Downloading AI Models (if missing)...
echo Pulling llama2:7b-chat for Medical AI...
ollama pull llama2:7b-chat
echo Pulling medllama2 for Cyber Defense AI...
ollama pull medllama2

echo [3/5] Setting up Python Backend...
cd backend
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing Python dependencies...
pip install -r requirements.txt >nul
echo Starting FastAPI server in background (Port 8042)...
start /b cmd /c "uvicorn src.server:app --port 8042 >nul 2>nul"
cd ..

echo [4/5] Setting up Node.js Frontend...
cd frontend
echo Installing Node dependencies...
call npm install >nul
echo Starting Vite server...
start /b cmd /c "npm run dev >nul 2>nul"
cd ..

echo [5/5] Initialization Complete.
echo The Medical Simulator is now running.
echo Frontend: http://localhost:5173
echo Backend : http://localhost:8042
echo Press any key to stop all local servers...
pause
taskkill /F /IM node.exe >nul 2>nul
taskkill /F /IM uvicorn.exe >nul 2>nul
taskkill /F /IM python.exe >nul 2>nul
echo Servers stopped.
endlocal
