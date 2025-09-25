@echo off
REM RVC-Wiz Frontend Start Script for Windows

echo 🚀 Starting RVC-Wiz Frontend...
echo ==============================

REM Check if we're in the right directory
if not exist "frontend" (
    echo ❌ Error: Please run this script from the RVC-Wiz project root directory
    echo    Current directory: %CD%
    echo    Expected to find: frontend\ directory
    pause
    exit /b 1
)

echo ✅ Frontend directory found
cd frontend
echo ✅ Changed to frontend directory: %CD%

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found in frontend\
    pause
    exit /b 1
)

echo ✅ package.json found

REM Check if node_modules exists
if not exist "node_modules" (
    echo ❌ Node modules not found in frontend\
    echo    Please install dependencies first: npm install
    pause
    exit /b 1
)

echo ✅ node_modules found

echo 🌐 Starting Remix development server
echo 🎯 Frontend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
