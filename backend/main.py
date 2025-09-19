from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
import os
import tempfile
import shutil
from pathlib import Path
import asyncio
from typing import Optional, List
import logging
from voice_models_api import VoiceModelsAPI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RVC-Wiz API",
    description="AI-Powered Voice Cloning API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ProcessingRequest(BaseModel):
    model_name: str
    enhance_quality: bool = False
    noise_reduction: bool = False
    pitch_shift: Optional[float] = None

class ProcessingStatus(BaseModel):
    task_id: str
    status: str  # "processing", "completed", "failed"
    progress: int  # 0-100
    message: str
    result_file: Optional[str] = None

# Global storage for processing tasks
processing_tasks = {}

# Create necessary directories
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
MODELS_DIR = Path("models")

for directory in [UPLOAD_DIR, OUTPUT_DIR, MODELS_DIR]:
    directory.mkdir(exist_ok=True)

# Initialize Voice Models API
voice_models_api = VoiceModelsAPI()

@app.get("/")
async def root():
    return {"message": "RVC-Wiz API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}

@app.get("/models")
async def get_available_models():
    """Get list of available voice models"""
    models = []
    if MODELS_DIR.exists():
        for model_file in MODELS_DIR.glob("*.pth"):
            models.append({
                "name": model_file.stem,
                "path": str(model_file),
                "size": model_file.stat().st_size
            })
    
    # Add default models if none exist
    if not models:
        models = [
            {"name": "female_voice_v1", "path": "default", "size": 0},
            {"name": "male_voice_v1", "path": "default", "size": 0}
        ]
    
    return {"models": models}

@app.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    """Upload audio file for processing"""
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")
    
    # Save uploaded file
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    logger.info(f"Uploaded file: {file.filename}")
    
    return {
        "filename": file.filename,
        "file_path": str(file_path),
        "size": file_path.stat().st_size,
        "content_type": file.content_type
    }

@app.post("/process/{filename}")
async def process_audio(
    filename: str,
    request: ProcessingRequest,
    background_tasks: BackgroundTasks
):
    """Start audio processing with RVC"""
    input_file = UPLOAD_DIR / filename
    if not input_file.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    # Generate task ID
    task_id = f"task_{filename}_{hash(str(request))}"
    
    # Initialize task status
    processing_tasks[task_id] = ProcessingStatus(
        task_id=task_id,
        status="processing",
        progress=0,
        message="Starting processing..."
    )
    
    # Start background processing
    background_tasks.add_task(
        process_audio_background,
        task_id,
        str(input_file),
        request
    )
    
    return {"task_id": task_id, "status": "processing_started"}

async def process_audio_background(task_id: str, input_file: str, request: ProcessingRequest):
    """Background task for audio processing"""
    try:
        # Update progress
        processing_tasks[task_id].progress = 10
        processing_tasks[task_id].message = "Loading audio file..."
        
        # Simulate audio loading
        await asyncio.sleep(1)
        
        # Update progress
        processing_tasks[task_id].progress = 30
        processing_tasks[task_id].message = "Initializing RVC model..."
        
        # Simulate model loading
        await asyncio.sleep(2)
        
        # Update progress
        processing_tasks[task_id].progress = 60
        processing_tasks[task_id].message = "Processing audio with AI..."
        
        # Simulate AI processing
        await asyncio.sleep(3)
        
        # Update progress
        processing_tasks[task_id].progress = 90
        processing_tasks[task_id].message = "Finalizing output..."
        
        # Generate output filename
        output_filename = f"processed_{Path(input_file).stem}.wav"
        output_path = OUTPUT_DIR / output_filename
        
        # For now, copy the input file as output (placeholder)
        shutil.copy2(input_file, output_path)
        
        # Complete processing
        processing_tasks[task_id].status = "completed"
        processing_tasks[task_id].progress = 100
        processing_tasks[task_id].message = "Processing completed successfully!"
        processing_tasks[task_id].result_file = output_filename
        
        logger.info(f"Processing completed for task {task_id}")
        
    except Exception as e:
        logger.error(f"Processing failed for task {task_id}: {str(e)}")
        processing_tasks[task_id].status = "failed"
        processing_tasks[task_id].message = f"Processing failed: {str(e)}"

@app.get("/status/{task_id}")
async def get_processing_status(task_id: str):
    """Get processing status for a task"""
    if task_id not in processing_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return processing_tasks[task_id]

@app.get("/download/{filename}")
async def download_result(filename: str):
    """Download processed audio file"""
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type="audio/wav"
    )

@app.delete("/cleanup")
async def cleanup_files():
    """Clean up temporary files"""
    try:
        # Clean uploads older than 1 hour
        for file_path in UPLOAD_DIR.glob("*"):
            if file_path.stat().st_mtime < (asyncio.get_event_loop().time() - 3600):
                file_path.unlink()
        
        # Clean outputs older than 1 hour
        for file_path in OUTPUT_DIR.glob("*"):
            if file_path.stat().st_mtime < (asyncio.get_event_loop().time() - 3600):
                file_path.unlink()
        
        return {"message": "Cleanup completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

# Voice Models API Endpoints
@app.get("/api/voice-models/top")
async def get_top_voice_models(limit: int = Query(50, ge=1, le=100)):
    """Get top voice models from voice-models.com"""
    try:
        models = voice_models_api.fetch_top_models(limit)
        return {
            "success": True,
            "models": models,
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error fetching top models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch top models: {str(e)}")

@app.get("/api/voice-models/search")
async def search_voice_models(query: str = Query(..., min_length=1), limit: int = Query(20, ge=1, le=50)):
    """Search for voice models by name or character"""
    try:
        models = voice_models_api.search_models(query, limit)
        return {
            "success": True,
            "query": query,
            "models": models,
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error searching models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to search models: {str(e)}")

@app.get("/api/voice-models/rick-sanchez")
async def get_rick_sanchez_models():
    """Get Rick Sanchez voice models specifically"""
    try:
        models = voice_models_api.get_rick_sanchez_models()
        return {
            "success": True,
            "character": "Rick Sanchez",
            "models": models,
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error fetching Rick Sanchez models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch Rick Sanchez models: {str(e)}")

@app.get("/api/voice-models/featured")
async def get_featured_voice_models():
    """Get featured/popular voice models"""
    try:
        models = voice_models_api.get_featured_models()
        return {
            "success": True,
            "models": models,
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error fetching featured models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch featured models: {str(e)}")

@app.get("/api/voice-models/categories")
async def get_voice_model_categories():
    """Get available voice model categories and tags"""
    try:
        # Get some models to extract categories
        models = voice_models_api.fetch_top_models(100)
        
        # Extract unique tags
        all_tags = set()
        for model in models:
            all_tags.update(model.get('tags', []))
        
        # Categorize tags
        categories = {
            "gender": [tag for tag in all_tags if tag in ['Male', 'Female']],
            "age": [tag for tag in all_tags if tag in ['Young', 'Adult', 'Teen']],
            "style": [tag for tag in all_tags if tag in ['Professional', 'Friendly', 'Casual', 'Formal']],
            "language": [tag for tag in all_tags if tag in ['English', 'Japanese', 'Spanish', 'French']],
            "character_type": [tag for tag in all_tags if tag in ['Cartoon', 'Anime', 'Game', 'Movie']]
        }
        
        return {
            "success": True,
            "categories": categories,
            "all_tags": sorted(list(all_tags))
        }
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch categories: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
