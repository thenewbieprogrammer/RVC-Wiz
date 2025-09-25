#!/bin/bash
# RVC-Wiz Backend Start Script for macOS/Linux

echo "🚀 Starting RVC-Wiz Backend..."
echo "============================="

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the RVC-Wiz project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected to find: backend/ directory"
    exit 1
fi

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found in backend/"
    echo "   Please create it first: python3 -m venv venv"
    echo "   Then install dependencies: pip install -r requirements.txt"
    exit 1
fi

echo "📦 Activating virtual environment..."
source venv/bin/activate

echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
