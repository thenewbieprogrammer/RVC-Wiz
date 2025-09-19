#!/usr/bin/env python3
"""
Cross-platform setup script for RVC-Wiz
Handles virtual environment creation and dependency installation
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def run_command(command, shell=True):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=shell, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def check_node_version():
    """Check if Node.js version is compatible"""
    success, stdout, stderr = run_command("node --version")
    if not success:
        print("❌ Node.js not found. Please install Node.js 18+")
        return False
    
    version = stdout.strip().replace('v', '')
    major_version = int(version.split('.')[0])
    if major_version < 18:
        print(f"❌ Node.js 18+ is required. Found: {version}")
        return False
    
    print(f"✅ Node.js {version} detected")
    return True

def create_virtual_environment():
    """Create Python virtual environment"""
    venv_path = Path("backend/venv")
    
    if venv_path.exists():
        print("✅ Virtual environment already exists")
        return True
    
    print("🔧 Creating Python virtual environment...")
    success, stdout, stderr = run_command(f"{sys.executable} -m venv {venv_path}")
    
    if not success:
        print(f"❌ Failed to create virtual environment: {stderr}")
        return False
    
    print("✅ Virtual environment created successfully")
    return True

def get_venv_python():
    """Get the path to the virtual environment Python executable"""
    system = platform.system().lower()
    venv_path = Path("backend/venv")
    
    if system == "windows":
        return venv_path / "Scripts" / "python.exe"
    else:
        return venv_path / "bin" / "python"

def get_venv_pip():
    """Get the path to the virtual environment pip executable"""
    system = platform.system().lower()
    venv_path = Path("backend/venv")
    
    if system == "windows":
        return venv_path / "Scripts" / "pip.exe"
    else:
        return venv_path / "bin" / "pip"

def install_python_dependencies():
    """Install Python dependencies in virtual environment"""
    pip_path = get_venv_pip()
    requirements_path = Path("backend/requirements.txt")
    
    if not requirements_path.exists():
        print("❌ requirements.txt not found")
        return False
    
    print("🔧 Installing Python dependencies...")
    success, stdout, stderr = run_command(f'"{pip_path}" install -r "{requirements_path}"')
    
    if not success:
        print(f"❌ Failed to install Python dependencies: {stderr}")
        return False
    
    print("✅ Python dependencies installed successfully")
    return True

def install_node_dependencies():
    """Install Node.js dependencies"""
    frontend_path = Path("frontend")
    
    if not frontend_path.exists():
        print("❌ Frontend directory not found")
        return False
    
    print("🔧 Installing Node.js dependencies...")
    success, stdout, stderr = run_command("npm install", cwd=frontend_path)
    
    if not success:
        print(f"❌ Failed to install Node.js dependencies: {stderr}")
        return False
    
    print("✅ Node.js dependencies installed successfully")
    return True

def create_startup_scripts():
    """Create platform-specific startup scripts"""
    system = platform.system().lower()
    
    if system == "windows":
        # Windows batch script
        script_content = """@echo off
echo Starting RVC-Wiz...
echo.

echo Starting backend server...
start "RVC-Wiz Backend" cmd /k "cd backend && venv\\Scripts\\python.exe main.py"

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
"""
        with open("start.bat", "w") as f:
            f.write(script_content)
        
        # PowerShell script
        ps_script_content = """# RVC-Wiz Startup Script
Write-Host "Starting RVC-Wiz..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\\venv\\Scripts\\python.exe main.py"

Start-Sleep -Seconds 3

Write-Host "Starting frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "RVC-Wiz is starting up!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"
"""
        with open("start.ps1", "w") as f:
            f.write(ps_script_content)
    
    else:
        # Unix/macOS shell script
        script_content = """#!/bin/bash
echo "Starting RVC-Wiz..."
echo ""

echo "Starting backend server..."
cd backend && source venv/bin/activate && python main.py &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "RVC-Wiz is starting up!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
"""
        with open("start.sh", "w") as f:
            f.write(script_content)
        
        # Make script executable
        os.chmod("start.sh", 0o755)
    
    print("✅ Startup scripts created")

def main():
    """Main setup function"""
    print("🚀 RVC-Wiz Setup")
    print("=" * 50)
    
    # Check prerequisites
    if not check_python_version():
        return False
    
    if not check_node_version():
        return False
    
    # Create directories
    Path("backend/uploads").mkdir(parents=True, exist_ok=True)
    Path("backend/outputs").mkdir(parents=True, exist_ok=True)
    Path("backend/models").mkdir(parents=True, exist_ok=True)
    
    # Setup Python environment
    if not create_virtual_environment():
        return False
    
    if not install_python_dependencies():
        return False
    
    # Setup Node.js environment
    if not install_node_dependencies():
        return False
    
    # Create startup scripts
    create_startup_scripts()
    
    print("\n🎉 Setup completed successfully!")
    print("\nTo start RVC-Wiz:")
    
    system = platform.system().lower()
    if system == "windows":
        print("  Windows: Run 'start.bat' or 'start.ps1'")
    else:
        print("  macOS/Linux: Run './start.sh'")
    
    print("\nOr manually:")
    print("  Backend: cd backend && venv/Scripts/python main.py (Windows)")
    print("           cd backend && source venv/bin/activate && python main.py (macOS/Linux)")
    print("  Frontend: cd frontend && npm run dev")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
