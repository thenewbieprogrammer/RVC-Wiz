#!/bin/bash
# RVC-Wiz Frontend Start Script for macOS/Linux

echo "🚀 Starting RVC-Wiz Frontend..."
echo "=============================="

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the RVC-Wiz project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected to find: frontend/ directory"
    exit 1
fi

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Node modules not found in frontend/"
    echo "   Please install dependencies first: npm install"
    exit 1
fi

echo "🌐 Starting Remix development server on http://localhost:3000"
echo "🎯 Frontend will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
