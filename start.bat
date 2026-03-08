@echo off
echo ====================================================
echo   DA VINCI SURGICAL CONSOLE - POC STARTUP SCRIPT
echo ====================================================
echo.

echo [1/2] Lancement du Backend FastAPI (Port 8042)...
start "Da Vinci Backend (FastAPI)" cmd /k "cd backend && title Da Vinci Backend && echo Lancement du serveur Python... && python server.py"

echo [2/2] Lancement du Frontend React/Vite...
start "Da Vinci Frontend (React)" cmd /k "cd frontend && title Da Vinci Frontend && echo Lancement du serveur Node.js... && npm run dev"

echo.
echo Les deux services ont ete lances dans des fenetres separees.
echo Le navigateur devrait s'ouvrir automatiquement sur le frontend.
echo.
pause
