# RVC-Wiz Startup Script
Write-Host "Starting RVC-Wiz..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\python.exe main.py"

Start-Sleep -Seconds 3

Write-Host "Starting frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "RVC-Wiz is starting up!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"
