# RVC-Wiz 🎤

A modern RVC Voice Clone application with AI features, built with Remix.js frontend and Python backend.

## Features

- 🎨 Modern dark mode UI with glass morphism effects
- 🎤 RVC voice cloning with AI model integration
- 🖥️ Cross-platform support (Windows & macOS)
- ⚡ Real-time audio processing
- 🎵 High-quality voice synthesis
- 📥 Voice model downloads from voice-models.com
- 📊 Real-time download progress tracking
- 🔄 Background download processing
- 🎯 Download status indicators and notifications

## Tech Stack

- **Frontend**: Remix.js, React, Tailwind CSS
- **Backend**: Python, FastAPI, PyTorch
- **AI Models**: RVC (Retrieval-based Voice Conversion)
- **Audio Processing**: librosa, soundfile

## Prerequisites

- Node.js 18+
- Python 3.8+
- CUDA-compatible GPU (RTX 2080 Super recommended)

## Quick Start

> **Platform-Specific Notes**: 
> - **Windows/GitBash Users**: Use the commands below with GitBash syntax
> - **macOS Users**: See the [macOS Monterey Setup](#macos-monterey-setup) section for macOS-specific instructions

### Backend Setup (Python)

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - **Windows (PowerShell/CMD)**:
     ```bash
     venv\Scripts\activate
     ```
   - **Windows (GitBash)**:
     ```bash
     source venv/Scripts/activate
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the backend server**:
   ```bash
   python main.py
   ```

### Frontend Setup (Node.js)

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Run the frontend development server**:
   ```bash
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Project Structure

```
rvc-wiz/
├── frontend/          # Remix.js application
├── backend/           # Python FastAPI server
├── models/            # AI model files
└── docs/              # Documentation
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
# Activate virtual environment first
source venv/Scripts/activate  # GitBash
# venv\Scripts\activate  # PowerShell/CMD
# source venv/bin/activate  # macOS/Linux

# Run with auto-reload
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Troubleshooting

### Common Issues

1. **Virtual Environment Not Found**:
   - Make sure you're in the `backend` directory
   - Run `python -m venv venv` to create the virtual environment

2. **Port Already in Use**:
   - Backend: Change port in `main.py` or kill process using port 8000
   - Frontend: Change port in `vite.config.ts` or kill process using port 3000

3. **Python Dependencies Issues**:
   - Make sure virtual environment is activated
   - Try: `pip install --upgrade pip` then reinstall dependencies
   - If you get `ModuleNotFoundError: No module named 'aiohttp'`, run: `venv/Scripts/python.exe -m pip install -r requirements.txt`

4. **Node.js Dependencies Issues**:
   - Delete `node_modules` folder and `package-lock.json`
   - Run `npm install` again

### Manual Server Start

If the automated startup scripts don't work, you can start servers manually:

**Terminal 1 (Backend - GitBash)**:
```bash
cd backend
source venv/Scripts/activate
python main.py
```

**Terminal 2 (Frontend - GitBash)**:
```bash
cd frontend
npm run dev
```

**Alternative (PowerShell/CMD)**:
```bash
# Backend
cd backend
venv\Scripts\activate
python main.py

# Frontend
cd frontend
npm run dev
```

## Cross-Platform Setup

### Windows
- Use PowerShell or Command Prompt
- Python virtual environment is automatically handled

### macOS Monterey Setup

#### Prerequisites for macOS Monterey
- **macOS Monterey 12.0+**
- **Node.js 18+**: Install via [nodejs.org](https://nodejs.org/) or `brew install node`
- **Python 3.8+**: Install via `brew install python@3.11` or `brew install python@3.12`
- **Git**: Usually pre-installed, or install via `brew install git`
- **Homebrew**: Install from [brew.sh](https://brew.sh/) if not already installed

#### macOS-Specific Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (macOS uses python3)
python3 -m venv venv

# Activate virtual environment (macOS/Linux syntax)
source venv/bin/activate

# Upgrade pip (recommended)
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python main.py
```

#### macOS-Specific Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the frontend development server
npm run dev
```

#### macOS Performance Notes
- **Apple Silicon (M1/M2)**: PyTorch will automatically use Metal Performance Shaders (MPS) for GPU acceleration
- **Intel Macs**: Will use CPU processing (functional but slower)
- **Audio Processing**: Works with macOS Core Audio libraries
- **Memory**: Ensure at least 8GB RAM for optimal performance

#### macOS Troubleshooting
1. **Python not found**: Use `python3` instead of `python`
2. **Permission errors**: Use `sudo` for system-wide installations or use virtual environments
3. **Port conflicts**: Kill processes using ports 3000/8000 with `lsof -ti:3000 | xargs kill -9`
4. **Homebrew issues**: Update with `brew update && brew upgrade`

## License

MIT License - see LICENSE file for details
