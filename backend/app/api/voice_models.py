from fastapi import APIRouter, HTTPException, Query, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging
import json
import time

from app.services.voice_models import VoiceModelsService
from app.services.voice_model_manager import VoiceModelManager
from app.db.database import get_db
from app.models.voice_model import VoiceModel

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize services
voice_models_service = VoiceModelsService()
voice_model_manager = VoiceModelManager()

@router.get("/top")
async def get_top_voice_models(limit: int = Query(50, ge=1, le=100)):
    """Get top voice models from voice-models.com"""
    try:
        models = voice_models_service.fetch_top_models(limit)
        return {
            "success": True,
            "models": models,
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error fetching top models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch top models: {str(e)}")

@router.get("/search")
async def search_voice_models(query: str = Query(..., min_length=1), limit: int = Query(20, ge=1, le=50), db: Session = Depends(get_db)):
    """Search for voice models by name or character"""
    try:
        logger.info(f"🔍 API Search request: '{query}' (limit: {limit})")
        
        # Search both local database and voice-models.com
        # First, search local database
        local_models = voice_model_manager.search_models(db, query, limit)
        logger.info(f"📊 Found {len(local_models)} models in local database")
        
        # Then search voice-models.com
        external_models = voice_models_service.search_models(query, limit)
        logger.info(f"🌐 Found {len(external_models)} models from voice-models.com")
        
        # Combine results, prioritizing local models
        all_models = []
        model_ids = set()
        
        # Add local models first
        for model in local_models:
            model_dict = {
                "id": model.id,
                "name": model.name,
                "character": model.character,
                "description": model.description,
                "download_url": model.download_url,
                "huggingface_url": model.huggingface_url,
                "model_url": model.model_url,
                "size": model.size,
                "epochs": model.epochs,
                "type": model.model_type,
                "tags": json.loads(model.tags) if model.tags else [],
                "is_downloaded": model.is_downloaded,
                "download_progress": model.download_progress,
                "download_error": model.download_error,
                "local_path": model.local_path,
                "index_path": model.index_path,
                "created_at": model.created_at.isoformat() if model.created_at else None
            }
            all_models.append(model_dict)
            model_ids.add(model.id)
        
        # Add external models that aren't already in local database
        for model in external_models:
            # Check if this model is already in our local results
            if not any(m['name'] == model['name'] and m['character'] == model['character'] for m in all_models):
                all_models.append(model)
        
        # Limit results
        all_models = all_models[:limit]
        
        logger.info(f"✅ Total search results: {len(all_models)} models")
        return {
            "success": True,
            "query": query,
            "models": all_models,
            "count": len(all_models)
        }
    except Exception as e:
        logger.error(f"❌ Error searching models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to search models: {str(e)}")

@router.get("/rick-sanchez")
async def get_rick_sanchez_models():
    """Get Rick Sanchez voice models specifically"""
    try:
        models = voice_models_service.get_rick_sanchez_models()
        return {
            "success": True,
            "character": "Rick Sanchez",
            "models": models,
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error fetching Rick Sanchez models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch Rick Sanchez models: {str(e)}")

@router.get("/featured")
async def get_featured_voice_models():
    """Get featured/popular voice models"""
    try:
        models = voice_models_service.get_featured_models()
        return {
            "success": True,
            "models": models,
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error fetching featured models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch featured models: {str(e)}")

@router.get("/categories")
async def get_voice_model_categories():
    """Get available voice model categories and tags"""
    try:
        # Get some models to extract categories
        models = voice_models_service.fetch_top_models(100)
        
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

# New endpoints for local model management

@router.get("/local")
async def get_local_models(db: Session = Depends(get_db), limit: int = Query(50, ge=1, le=100), sync: bool = Query(False)):
    """Get all models stored in the local database"""
    try:
        # Only scan for existing model files if sync is requested
        if sync:
            logger.info("🔄 Manual sync requested - scanning for existing models and syncing from voice-models.com")
            voice_model_manager.scan_existing_models(db)
            await voice_model_manager.sync_models_from_website(db, limit)
        else:
            logger.info("📊 Getting local models without syncing")
        
        # Get the models from database
        models = voice_model_manager.get_available_models(db, limit)
        return {
            "success": True,
            "models": [
                {
                    "id": model.id,
                    "name": model.name,
                    "character": model.character,
                    "description": model.description,
                    "download_url": model.download_url,
                    "huggingface_url": model.huggingface_url,
                    "model_url": model.model_url,
                    "size": model.size,
                    "epochs": model.epochs,
                    "type": model.model_type,
                    "tags": json.loads(model.tags) if model.tags else [],
                    "is_downloaded": model.is_downloaded,
                    "download_progress": model.download_progress,
                    "download_error": model.download_error,
                    "local_path": model.local_path,
                    "index_path": model.index_path,
                    "created_at": model.created_at.isoformat() if model.created_at else None
                }
                for model in models
            ],
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error fetching local models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch local models: {str(e)}")

@router.get("/local/downloaded")
async def get_downloaded_models(db: Session = Depends(get_db)):
    """Get all downloaded models ready for use"""
    try:
        models = voice_model_manager.get_downloaded_models(db)
        return {
            "success": True,
            "models": [
                {
                    "id": model.id,
                    "name": model.name,
                    "character": model.character,
                    "description": model.description,
                    "size": model.size,
                    "epochs": model.epochs,
                    "type": model.model_type,
                    "tags": json.loads(model.tags) if model.tags else [],
                    "local_path": model.local_path,
                    "created_at": model.created_at.isoformat() if model.created_at else None
                }
                for model in models
            ],
            "count": len(models)
        }
    except Exception as e:
        logger.error(f"Error fetching downloaded models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch downloaded models: {str(e)}")

@router.post("/sync")
async def sync_models_from_website(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=100)
):
    """Manually sync models from voice-models.com to local database"""
    try:
        logger.info(f"🔄 Manual sync requested for {limit} models from voice-models.com")
        
        # Run sync in background
        background_tasks.add_task(voice_model_manager.sync_models_from_website, db, limit)
        
        return {
            "success": True,
            "message": f"Started syncing {limit} models from voice-models.com"
        }
    except Exception as e:
        logger.error(f"Error starting sync: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start sync: {str(e)}")

@router.post("/download/{model_id}")
async def download_model(
    model_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Download a specific model"""
    try:
        logger.info(f"🎯 DOWNLOAD REQUEST RECEIVED")
        logger.info(f"   📋 Model ID: {model_id}")
        logger.info(f"   ⏰ Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        model = voice_model_manager.get_model_by_id(db, model_id)
        if not model:
            logger.error(f"❌ Model not found with ID: {model_id}")
            raise HTTPException(status_code=404, detail="Model not found")
        
        logger.info(f"📋 Found model: {model.name}")
        logger.info(f"👤 Character: {model.character}")
        logger.info(f"🔗 Download URL: {model.download_url}")
        logger.info(f"📊 Size: {model.size}")
        logger.info(f"✅ Already downloaded: {model.is_downloaded}")
        
        if model.is_downloaded:
            logger.info(f"ℹ️  Model {model.name} is already downloaded - skipping")
            return {
                "success": True,
                "message": f"Model {model.name} is already downloaded",
                "already_downloaded": True
            }
        
        if not model.download_url or model.download_url == "N/A":
            logger.error(f"❌ No download URL available for model: {model.name}")
            raise HTTPException(status_code=400, detail="No download URL available for this model")
        
        # Run download in background
        logger.info(f"🚀 Starting background download task for model: {model.name}")
        background_tasks.add_task(voice_model_manager.download_model, db, model_id)
        
        logger.info(f"✅ Background download task started successfully")
        logger.info(f"📡 User will see download progress in real-time")
        return {
            "success": True,
            "message": f"Started downloading model: {model.name}",
            "download_url": model.download_url
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error starting download: {e}")
        logger.error(f"❌ Error type: {type(e).__name__}")
        raise HTTPException(status_code=500, detail=f"Failed to start download: {str(e)}")

@router.delete("/{model_id}")
async def delete_model(model_id: int, db: Session = Depends(get_db)):
    """Delete a model and its files"""
    try:
        success, message = voice_model_manager.delete_model(db, model_id)
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return {
            "success": True,
            "message": message
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting model: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete model: {str(e)}")

@router.get("/{model_id}/download-status")
async def get_download_status(model_id: int, db: Session = Depends(get_db)):
    """Get download status for a specific model"""
    try:
        model = voice_model_manager.get_model_by_id(db, model_id)
        if not model:
            raise HTTPException(status_code=404, detail="Model not found")
        
        return {
            "success": True,
            "model_id": model_id,
            "is_downloaded": model.is_downloaded,
            "download_progress": model.download_progress,
            "download_error": model.download_error,
            "local_path": model.local_path,
            "index_path": model.index_path
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching download status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch download status: {str(e)}")

@router.post("/scan-existing")
async def scan_existing_models(db: Session = Depends(get_db)):
    """Scan the models directory for existing .pth and .index files and register them in the database"""
    try:
        registered_models = voice_model_manager.scan_existing_models(db)
        return {
            "success": True,
            "message": f"Scan completed. Found and registered {len(registered_models)} existing models.",
            "registered_models": [
                {
                    "id": model.id,
                    "name": model.name,
                    "character": model.character,
                    "local_path": model.local_path,
                    "index_path": model.index_path,
                    "size": model.size,
                    "epochs": model.epochs
                }
                for model in registered_models
            ],
            "count": len(registered_models)
        }
    except Exception as e:
        logger.error(f"Error scanning existing models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to scan existing models: {str(e)}")

@router.get("/stats")
async def get_model_stats(db: Session = Depends(get_db)):
    """Get model statistics"""
    try:
        stats = voice_model_manager.get_model_stats(db)
        return {
            "success": True,
            "stats": stats
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")
