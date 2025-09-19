# RVC-Wiz 🎤

A modern RVC Voice Clone application with AI features, built with Remix.js frontend and Python backend.

## Features

- 🎨 Modern dark mode UI with glass morphism effects
- 🎤 RVC voice cloning with AI model integration
- 🖥️ Cross-platform support (Windows & macOS)
- ⚡ Real-time audio processing
- 🎵 High-quality voice synthesis

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

> **Note for GitBash Users**: Since you're using GitBash as your default terminal in Cursor IDE, use the GitBash-specific commands below.

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
   pip install fastapi uvicorn python-multipart
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

### macOS
- Use Terminal
- Ensure Python 3.8+ is installed via Homebrew or pyenv

## License

MIT License - see LICENSE file for details
