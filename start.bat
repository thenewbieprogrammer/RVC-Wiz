@echo off
echo Starting RVC-Wiz...
echo.

echo Starting backend server...
start "RVC-Wiz Backend" cmd /k "cd backend && venv\Scripts\python.exe main.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend...
start "RVC-Wiz Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo RVC-Wiz is starting up!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo.
pause
