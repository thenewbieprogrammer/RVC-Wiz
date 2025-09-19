import os
import json
import requests
import asyncio
import aiohttp
import aiofiles
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc
import logging
from urllib.parse import urlparse
import zipfile
import shutil

from app.models.voice_model import VoiceModel
from app.services.voice_models import VoiceModelsService
from app.core.config import settings

logger = logging.getLogger(__name__)

class VoiceModelManager:
    def __init__(self):
        self.voice_models_service = VoiceModelsService()
        self.models_dir = Path(settings.MODELS_DIR)
        self.models_dir.mkdir(exist_ok=True)
        
    async def sync_models_from_website(self, db: Session, limit: int = 50) -> List[VoiceModel]:
        """Fetch models from voice-models.com and sync with database"""
        try:
            logger.info(f"Syncing {limit} models from voice-models.com...")
            
            # Fetch models from website
            website_models = self.voice_models_service.fetch_top_models(limit)
            
            synced_models = []
            for model_data in website_models:
                # Check if model already exists
                existing_model = db.query(VoiceModel).filter(
                    VoiceModel.name == model_data['name']
                ).first()
                
                if existing_model:
                    # Update existing model
                    existing_model.character = model_data['character']
                    existing_model.description = model_data['description']
                    existing_model.download_url = model_data['download_url']
                    existing_model.huggingface_url = model_data['huggingface_url']
                    existing_model.model_url = model_data['model_url']
                    existing_model.size = model_data['size']
                    existing_model.epochs = model_data['epochs']
                    existing_model.model_type = model_data['type']
                    existing_model.tags = json.dumps(model_data['tags'])
                    synced_models.append(existing_model)
                else:
                    # Create new model
                    new_model = VoiceModel(
                        name=model_data['name'],
                        character=model_data['character'],
                        description=model_data['description'],
                        download_url=model_data['download_url'],
                        huggingface_url=model_data['huggingface_url'],
                        model_url=model_data['model_url'],
                        size=model_data['size'],
                        epochs=model_data['epochs'],
                        model_type=model_data['type'],
                        tags=json.dumps(model_data['tags'])
                    )
                    db.add(new_model)
                    synced_models.append(new_model)
            
            db.commit()
            logger.info(f"Synced {len(synced_models)} models to database")
            return synced_models
            
        except Exception as e:
            logger.error(f"Error syncing models: {e}")
            db.rollback()
            raise
    
    async def download_model(self, db: Session, model_id: int) -> Tuple[bool, str]:
        """Download a voice model and save it locally"""
        try:
            model = db.query(VoiceModel).filter(VoiceModel.id == model_id).first()
            if not model:
                return False, "Model not found"
            
            if model.is_downloaded:
                return True, "Model already downloaded"
            
            if not model.download_url or model.download_url == "N/A":
                return False, "No download URL available"
            
            logger.info(f"Downloading model: {model.name}")
            
            # Create model directory
            model_dir = self.models_dir / str(model.id)
            model_dir.mkdir(exist_ok=True)
            
            # Download the model file
            async with aiohttp.ClientSession() as session:
                async with session.get(model.download_url) as response:
                    if response.status != 200:
                        return False, f"Failed to download: HTTP {response.status}"
                    
                    # Get file size
                    content_length = response.headers.get('content-length')
                    if content_length:
                        model.size_bytes = int(content_length)
                    
                    # Download with progress tracking
                    total_size = 0
                    downloaded_size = 0
                    
                    if content_length:
                        total_size = int(content_length)
                    
                    # Determine file extension
                    content_type = response.headers.get('content-type', '')
                    if 'zip' in content_type:
                        file_extension = '.zip'
                    elif 'application/octet-stream' in content_type:
                        file_extension = '.pth'  # Common for RVC models
                    else:
                        file_extension = '.bin'
                    
                    file_path = model_dir / f"{model.name.replace(' ', '_')}{file_extension}"
                    
                    async with aiofiles.open(file_path, 'wb') as f:
                        async for chunk in response.content.iter_chunked(8192):
                            await f.write(chunk)
                            downloaded_size += len(chunk)
                            
                            # Update progress
                            if total_size > 0:
                                progress = downloaded_size / total_size
                                model.download_progress = progress
                                db.commit()
                    
                    # Extract if it's a zip file
                    if file_extension == '.zip':
                        extract_dir = model_dir / 'extracted'
                        extract_dir.mkdir(exist_ok=True)
                        
                        with zipfile.ZipFile(file_path, 'r') as zip_ref:
                            zip_ref.extractall(extract_dir)
                        
                        # Find and move both .pth and .index files
                        pth_file = None
                        index_file = None
                        
                        for root, dirs, files in os.walk(extract_dir):
                            for file in files:
                                if file.endswith('.pth'):
                                    model_file = Path(root) / file
                                    pth_file = model_dir / file
                                    shutil.move(str(model_file), str(pth_file))
                                elif file.endswith('.index'):
                                    index_file_path = Path(root) / file
                                    index_file = model_dir / file
                                    shutil.move(str(index_file_path), str(index_file))
                        
                        # Use the .pth file as the main model file
                        if pth_file:
                            file_path = pth_file
                        
                        # Clean up zip and extracted folder
                        os.remove(file_path)
                        shutil.rmtree(extract_dir)
                        file_path = model_dir / f"{model.name.replace(' ', '_')}.pth"
                    
                    # Update model record
                    model.local_path = str(file_path)
                    if index_file:
                        model.index_path = str(index_file)
                    model.is_downloaded = True
                    model.download_progress = 1.0
                    model.download_error = None
                    db.commit()
                    
                    logger.info(f"Successfully downloaded model: {model.name}")
                    return True, "Download completed successfully"
                    
        except Exception as e:
            logger.error(f"Error downloading model {model_id}: {e}")
            model.download_error = str(e)
            model.download_progress = 0.0
            db.commit()
            return False, f"Download failed: {str(e)}"
    
    def get_available_models(self, db: Session, limit: int = 50) -> List[VoiceModel]:
        """Get all available models from database"""
        return db.query(VoiceModel).order_by(desc(VoiceModel.created_at)).limit(limit).all()
    
    def get_downloaded_models(self, db: Session) -> List[VoiceModel]:
        """Get all downloaded models"""
        return db.query(VoiceModel).filter(VoiceModel.is_downloaded == True).all()
    
    def get_model_by_id(self, db: Session, model_id: int) -> Optional[VoiceModel]:
        """Get a specific model by ID"""
        return db.query(VoiceModel).filter(VoiceModel.id == model_id).first()
    
    def search_models(self, db: Session, query: str, limit: int = 20) -> List[VoiceModel]:
        """Search models by name, character, or tags"""
        search_term = f"%{query}%"
        return db.query(VoiceModel).filter(
            (VoiceModel.name.ilike(search_term)) |
            (VoiceModel.character.ilike(search_term)) |
            (VoiceModel.description.ilike(search_term)) |
            (VoiceModel.tags.ilike(search_term))
        ).limit(limit).all()
    
    def delete_model(self, db: Session, model_id: int) -> Tuple[bool, str]:
        """Delete a model and its files"""
        try:
            model = db.query(VoiceModel).filter(VoiceModel.id == model_id).first()
            if not model:
                return False, "Model not found"
            
            # Delete local files
            if model.local_path and os.path.exists(model.local_path):
                os.remove(model.local_path)
                
                # Delete model directory if empty
                model_dir = Path(model.local_path).parent
                if model_dir.exists() and not any(model_dir.iterdir()):
                    model_dir.rmdir()
            
            # Delete from database
            db.delete(model)
            db.commit()
            
            logger.info(f"Deleted model: {model.name}")
            return True, "Model deleted successfully"
            
        except Exception as e:
            logger.error(f"Error deleting model {model_id}: {e}")
            db.rollback()
            return False, f"Delete failed: {str(e)}"
    
    def get_model_stats(self, db: Session) -> Dict[str, int]:
        """Get statistics about models"""
        total_models = db.query(VoiceModel).count()
        downloaded_models = db.query(VoiceModel).filter(VoiceModel.is_downloaded == True).count()
        pending_downloads = db.query(VoiceModel).filter(
            VoiceModel.is_downloaded == False,
            VoiceModel.download_progress < 1.0
        ).count()
        
        return {
            "total_models": total_models,
            "downloaded_models": downloaded_models,
            "pending_downloads": pending_downloads,
            "available_space": "N/A"  # Could implement disk space calculation
        }
