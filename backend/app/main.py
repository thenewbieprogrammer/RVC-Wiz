from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import timedelta
import uvicorn
import os
import tempfile
import shutil
import uuid
from pathlib import Path
import asyncio
from typing import Optional, List
import logging

# Import our modules
from app.core.config import settings
from app.db.database import get_db
from app.db.init_db import init_database
from app.api.auth import router as auth_router
from app.api.voice_models import router as voice_models_router
from app.services.rvc_processor import RVCProcessor
from app.schemas.user import ProcessingRequest, ProcessingStatus

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="RVC-Wiz - AI Voice Cloning Platform API"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(voice_models_router, prefix="/api/voice-models", tags=["voice-models"])

# Initialize database
try:
    init_database()
    logger.info("Database initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize database: {e}")

# Initialize RVC processor
rvc_processor = RVCProcessor()

# File upload directories
UPLOAD_DIR = Path(settings.UPLOAD_DIR)
OUTPUT_DIR = Path(settings.OUTPUT_DIR)
MODELS_DIR = Path(settings.MODELS_DIR)

for directory in [UPLOAD_DIR, OUTPUT_DIR, MODELS_DIR]:
    directory.mkdir(exist_ok=True)

@app.get("/")
async def root():
    return {"message": "RVC-Wiz API is running!", "version": settings.VERSION}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}

@app.get("/models")
async def get_models():
    """Get available voice models for voice cloning"""
    try:
        from app.services.voice_model_manager import VoiceModelManager
        from app.db.database import SessionLocal
        
        voice_model_manager = VoiceModelManager()
        db = SessionLocal()
        
        try:
            # Get downloaded models ready for use
            models = voice_model_manager.get_downloaded_models(db)
            return {
                "models": [
                    {
                        "name": model.name,
                        "path": model.local_path,
                        "size": model.size,
                        "character": model.character,
                        "type": model.model_type
                    }
                    for model in models
                ]
            }
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Error fetching models: {e}")
        return {"models": []}

# File upload endpoint
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload an audio file"""
    try:
        # Validate file type
        if not file.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return {
            "filename": unique_filename,
            "file_path": str(file_path),
            "size": file_path.stat().st_size,
            "content_type": file.content_type
        }
        
    except Exception as e:
        logger.error(f"File upload error: {e}")
        raise HTTPException(status_code=500, detail="File upload failed")

# Audio processing endpoint
@app.post("/api/process")
async def process_audio(
    filename: str,
    request: ProcessingRequest,
    background_tasks: BackgroundTasks
):
    """Process audio file with RVC model"""
    try:
        input_path = UPLOAD_DIR / filename
        if not input_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Start processing
        result = await rvc_processor.process_audio(
            input_file_path=str(input_path),
            model_name=request.model_name,
            enhance_quality=request.enhance_quality,
            noise_reduction=request.noise_reduction,
            pitch_shift=request.pitch_shift or 0
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Audio processing error: {e}")
        raise HTTPException(status_code=500, detail="Audio processing failed")

# Text-to-Speech endpoint
@app.post("/api/text-to-speech")
async def process_text_to_speech(request: dict):
    """Convert text to speech using selected voice model"""
    try:
        text = request.get("text", "")
        model_name = request.get("model_name", "")
        enhance_quality = request.get("enhance_quality", True)
        noise_reduction = request.get("noise_reduction", True)
        
        if not text or not model_name:
            raise HTTPException(status_code=400, detail="Text and model_name are required")
        
        # Start TTS processing
        result = await rvc_processor.process_text_to_speech(
            text=text,
            model_name=model_name,
            enhance_quality=enhance_quality,
            noise_reduction=noise_reduction
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Text-to-speech processing error: {e}")
        raise HTTPException(status_code=500, detail="Text-to-speech processing failed")

# Processing status endpoint
@app.get("/api/status/{task_id}")
async def get_processing_status(task_id: str):
    """Get processing status for a task"""
    try:
        status = rvc_processor.get_processing_status(task_id)
        return status
        
    except Exception as e:
        logger.error(f"Status check error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get processing status")

# Download result endpoint
@app.get("/api/download/{filename}")
async def download_result(filename: str):
    """Download processed audio file"""
    try:
        file_path = OUTPUT_DIR / filename
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        return FileResponse(
            path=str(file_path),
            filename=filename,
            media_type="audio/wav"
        )
        
    except Exception as e:
        logger.error(f"Download error: {e}")
        raise HTTPException(status_code=500, detail="Download failed")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
