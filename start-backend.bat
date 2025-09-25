@echo off
REM RVC-Wiz Backend Start Script for Windows

echo 🚀 Starting RVC-Wiz Backend...
echo =============================

REM Check if we're in the right directory
if not exist "backend" (
    echo ❌ Error: Please run this script from the RVC-Wiz project root directory
    echo    Current directory: %CD%
    echo    Expected to find: backend\ directory
    pause
    exit /b 1
)

cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo ❌ Virtual environment not found in backend\
    echo    Please create it first: python -m venv venv
    echo    Then install dependencies: pip install -r requirements.txt
    pause
    exit /b 1
)

echo 📦 Activating virtual environment...
call venv\Scripts\activate.bat

echo 🌐 Starting FastAPI server on http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
