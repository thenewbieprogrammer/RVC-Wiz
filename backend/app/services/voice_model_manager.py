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
            logger.info(f"🚀 Starting download process for model ID: {model_id}")
            
            model = db.query(VoiceModel).filter(VoiceModel.id == model_id).first()
            if not model:
                logger.error(f"❌ Model not found with ID: {model_id}")
                return False, "Model not found"
            
            logger.info(f"📋 Found model: {model.name} (Character: {model.character})")
            
            if model.is_downloaded:
                logger.info(f"✅ Model {model.name} is already downloaded")
                return True, "Model already downloaded"
            
            if not model.download_url or model.download_url == "N/A":
                logger.error(f"❌ No download URL available for model: {model.name}")
                return False, "No download URL available"
            
            logger.info(f"🔗 Download URL: {model.download_url}")
            logger.info(f"📁 Models directory: {self.models_dir}")
            logger.info(f"📁 Models directory exists: {self.models_dir.exists()}")
            
            if not self.models_dir.exists():
                logger.info(f"📁 Creating models directory: {self.models_dir}")
                self.models_dir.mkdir(parents=True, exist_ok=True)
            
            # Create model directory
            model_dir = self.models_dir / str(model.id)
            logger.info(f"📁 Creating model directory: {model_dir}")
            model_dir.mkdir(exist_ok=True)
            logger.info(f"📁 Model directory created: {model_dir.exists()}")
            
            # Download the model file
            logger.info(f"🌐 Starting HTTP download...")
            async with aiohttp.ClientSession() as session:
                # Handle redirect URLs (like easyaivoice.com)
                download_url = model.download_url
                if 'easyaivoice.com' in download_url:
                    # Extract the actual HuggingFace URL from the redirect
                    if 'url=' in download_url:
                        actual_url = download_url.split('url=')[1]
                        # Convert HuggingFace blob URL to direct download URL
                        if 'huggingface.co' in actual_url and '/blob/' in actual_url:
                            download_url = actual_url.replace('/blob/', '/resolve/')
                        else:
                            download_url = actual_url
                
                # Ensure download=true suffix is present for HuggingFace URLs
                if 'huggingface.co' in download_url and '?download=true' not in download_url:
                    if '?' in download_url:
                        download_url += '&download=true'
                    else:
                        download_url += '?download=true'
                
                logger.info(f"🔗 Final download URL: {download_url}")
                
                async with session.get(download_url) as response:
                    logger.info(f"📡 HTTP Response status: {response.status}")
                    logger.info(f"📡 Response headers: {dict(response.headers)}")
                    
                    if response.status != 200:
                        logger.error(f"❌ Download failed with HTTP status: {response.status}")
                        return False, f"Failed to download: HTTP {response.status}"
                    
                    # Get file size
                    content_length = response.headers.get('content-length')
                    if content_length:
                        model.size_bytes = int(content_length)
                        logger.info(f"📊 File size: {int(content_length)} bytes ({int(content_length)/1024/1024:.1f} MB)")
                    
                    # Download with progress tracking
                    total_size = 0
                    downloaded_size = 0
                    
                    if content_length:
                        total_size = int(content_length)
                    
                    # Determine file extension
                    content_type = response.headers.get('content-type', '')
                    logger.info(f"📄 Content type: {content_type}")
                    
                    if 'zip' in content_type:
                        file_extension = '.zip'
                    elif 'application/octet-stream' in content_type:
                        file_extension = '.pth'  # Common for RVC models
                    else:
                        file_extension = '.bin'
                    
                    file_path = model_dir / f"{model.name.replace(' ', '_')}{file_extension}"
                    logger.info(f"💾 Saving file to: {file_path}")
                    
                    async with aiofiles.open(file_path, 'wb') as f:
                        logger.info(f"📥 Starting file download...")
                        chunk_count = 0
                        async for chunk in response.content.iter_chunked(8192):
                            await f.write(chunk)
                            downloaded_size += len(chunk)
                            chunk_count += 1
                            
                            # Update progress
                            if total_size > 0:
                                progress = downloaded_size / total_size
                                model.download_progress = progress
                                db.commit()
                                
                                # Log progress every 100 chunks
                                if chunk_count % 100 == 0:
                                    logger.info(f"📊 Download progress: {progress:.1%} ({downloaded_size}/{total_size} bytes)")
                    
                    logger.info(f"✅ File download completed! Total chunks: {chunk_count}")
                    logger.info(f"📁 File saved to: {file_path}")
                    logger.info(f"📊 Final file size: {downloaded_size} bytes")
                    
                    # Extract if it's a zip file
                    if file_extension == '.zip':
                        logger.info(f"📦 Extracting zip file...")
                        zip_file_path = file_path  # Store original zip file path
                        extract_dir = model_dir / 'extracted'
                        extract_dir.mkdir(exist_ok=True)
                        logger.info(f"📁 Extract directory: {extract_dir}")
                        
                        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
                            zip_ref.extractall(extract_dir)
                            logger.info(f"✅ Zip extraction completed")
                        
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
                        
                        # Clean up zip file and extracted folder
                        os.remove(zip_file_path)  # Remove the original zip file
                        shutil.rmtree(extract_dir)
                    
                    # Update model record
                    model.local_path = str(file_path)
                    if index_file:
                        model.index_path = str(index_file)
                    model.is_downloaded = True
                    model.download_progress = 1.0
                    model.download_error = None
                    db.commit()
                    
                    logger.info(f"🎉 Successfully downloaded model: {model.name}")
                    logger.info(f"📁 Model files:")
                    logger.info(f"   - Main file: {model.local_path}")
                    if model.index_path:
                        logger.info(f"   - Index file: {model.index_path}")
                    logger.info(f"✅ Download process completed successfully!")
                    return True, "Download completed successfully"
                    
        except Exception as e:
            logger.error(f"❌ Error downloading model {model_id}: {e}")
            logger.error(f"❌ Error type: {type(e).__name__}")
            logger.error(f"❌ Error details: {str(e)}")
            
            # Update model with error
            try:
                model = db.query(VoiceModel).filter(VoiceModel.id == model_id).first()
                if model:
                    model.download_error = str(e)
                    model.download_progress = 0.0
                    db.commit()
                    logger.error(f"❌ Updated model {model.name} with error status")
            except Exception as db_error:
                logger.error(f"❌ Failed to update model error status: {db_error}")
            
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
    
    def scan_existing_models(self, db: Session) -> List[VoiceModel]:
        """Scan the models directory for existing .pth and .index files and register them in the database"""
        try:
            logger.info("Scanning models directory for existing model files...")
            registered_models = []
            
            if not self.models_dir.exists():
                logger.warning(f"Models directory does not exist: {self.models_dir}")
                return registered_models
            
            # Scan each subdirectory in models folder
            for model_dir in self.models_dir.iterdir():
                if not model_dir.is_dir():
                    continue
                
                # Look for .pth and .index files in this directory
                pth_files = list(model_dir.glob("*.pth"))
                index_files = list(model_dir.glob("*.index"))
                
                if not pth_files:
                    continue
                
                # Use the first .pth file found
                pth_file = pth_files[0]
                index_file = index_files[0] if index_files else None
                
                # Extract model name from file name (remove .pth extension and clean up)
                model_name = pth_file.stem
                
                # Try to extract character name from model name
                # For example: "IsaoSasaki1960_100e_1300s" -> "Isao Sasaki"
                character = self._extract_character_name(model_name)
                
                # Check if this model already exists in database
                existing_model = db.query(VoiceModel).filter(
                    VoiceModel.local_path == str(pth_file)
                ).first()
                
                if existing_model:
                    # Update existing model if needed
                    if not existing_model.is_downloaded:
                        existing_model.is_downloaded = True
                        existing_model.download_progress = 1.0
                        existing_model.download_error = None
                        if index_file:
                            existing_model.index_path = str(index_file)
                        db.commit()
                        logger.info(f"Updated existing model: {existing_model.name}")
                    continue
                
                # Create new model entry
                try:
                    # Get file size
                    file_size = pth_file.stat().st_size
                    size_mb = file_size / (1024 * 1024)
                    
                    # Try to extract epochs from filename (e.g., "100e" -> 100)
                    epochs = self._extract_epochs_from_name(model_name)
                    
                    new_model = VoiceModel(
                        name=model_name,
                        character=character,
                        description=f"Voice model for {character} - {model_name}",
                        local_path=str(pth_file),
                        index_path=str(index_file) if index_file else None,
                        size=f"{size_mb:.1f} MB",
                        size_bytes=file_size,
                        epochs=epochs,
                        model_type="RVC",
                        tags=json.dumps([character, "RVC", "Voice Model"]),
                        is_downloaded=True,
                        download_progress=1.0,
                        download_error=None
                    )
                    
                    db.add(new_model)
                    db.commit()
                    registered_models.append(new_model)
                    logger.info(f"Registered existing model: {model_name} ({character})")
                    
                except Exception as e:
                    logger.error(f"Error registering model {model_name}: {e}")
                    db.rollback()
                    continue
            
            logger.info(f"Scan completed. Registered {len(registered_models)} existing models.")
            return registered_models
            
        except Exception as e:
            logger.error(f"Error scanning existing models: {e}")
            db.rollback()
            return []
    
    def _extract_character_name(self, model_name: str) -> str:
        """Extract character name from model filename"""
        # Remove common suffixes and clean up
        name = model_name
        
        # Remove epoch indicators (e.g., "_100e", "_100epochs")
        import re
        name = re.sub(r'_\d+e\w*', '', name)
        name = re.sub(r'_\d+epochs?', '', name)
        
        # Remove other common suffixes
        name = re.sub(r'_\d+s$', '', name)  # Remove seconds suffix
        name = re.sub(r'_\d+$', '', name)   # Remove trailing numbers
        
        # Convert camelCase to readable format
        # e.g., "IsaoSasaki1960" -> "Isao Sasaki"
        name = re.sub(r'([a-z])([A-Z])', r'\1 \2', name)
        
        # Remove year numbers
        name = re.sub(r'\d{4}', '', name)
        
        # Clean up extra spaces and underscores
        name = name.replace('_', ' ').strip()
        name = re.sub(r'\s+', ' ', name)
        
        return name if name else "Unknown Character"
    
    def _extract_epochs_from_name(self, model_name: str) -> int:
        """Extract number of epochs from model filename"""
        import re
        # Look for patterns like "100e", "100epochs", "100_epochs"
        epoch_match = re.search(r'(\d+)e\w*', model_name)
        if epoch_match:
            return int(epoch_match.group(1))
        
        epoch_match = re.search(r'(\d+)epochs?', model_name)
        if epoch_match:
            return int(epoch_match.group(1))
        
        return 0

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
