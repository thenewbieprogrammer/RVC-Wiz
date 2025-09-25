import os
import uuid
import logging
from typing import Dict, Any, Optional
from pathlib import Path
import asyncio
import numpy as np
import soundfile as sf
from app.core.config import settings
from app.services.rvc_engine import RVCVoiceCloningEngine
from app.services.tts_engine import TTSEngine
from app.services.live_audio_engine import LiveAudioManager
from app.services.microphone_service import MicrophoneService
from app.services.live_recording_handler import LiveRecordingHandler

logger = logging.getLogger(__name__)

class RVCProcessor:
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.output_dir = Path(settings.OUTPUT_DIR)
        self.models_dir = Path(settings.MODELS_DIR)
        
        # Ensure directories exist
        for directory in [self.upload_dir, self.output_dir, self.models_dir]:
            directory.mkdir(exist_ok=True)
        
        # Initialize engines
        self.rvc_engine = RVCVoiceCloningEngine()
        self.tts_engine = TTSEngine()
        self.microphone_service = MicrophoneService()
        self.live_recording_handler = LiveRecordingHandler(self.rvc_engine)
        self.live_audio_manager = LiveAudioManager(self.rvc_engine)
        
        logger.info("RVC Processor initialized with real engines and microphone support")

    async def process_audio(
        self, 
        input_file_path: str, 
        model_name: str,
        enhance_quality: bool = True,
        noise_reduction: bool = True,
        pitch_shift: int = 0
    ) -> Dict[str, Any]:
        """
        Process audio file with RVC model
        
        Args:
            input_file_path: Path to the input audio file
            model_name: Name of the RVC model to use
            enhance_quality: Whether to enhance audio quality
            noise_reduction: Whether to apply noise reduction
            pitch_shift: Pitch shift amount (semitones)
            
        Returns:
            Dict containing task_id and status
        """
        task_id = str(uuid.uuid4())
        
        try:
            logger.info(f"Starting RVC processing for task {task_id}")
            
            # Find the model files
            model_path, index_path = await self._find_model_files(model_name)
            if not model_path:
                raise ValueError(f"Model not found: {model_name}")
            
            # Process audio with RVC
            processed_audio, sample_rate = await self.rvc_engine.process_audio_with_rvc(
                audio_path=input_file_path,
                model_path=model_path,
                index_path=index_path,
                enhance_quality=enhance_quality,
                noise_reduction=noise_reduction,
                pitch_shift=pitch_shift
            )
            
            # Generate output filename
            input_path = Path(input_file_path)
            output_filename = f"processed_{task_id}_{input_path.stem}.wav"
            output_path = self.output_dir / output_filename
            
            # Save processed audio
            sf.write(output_path, processed_audio, sample_rate)
            
            logger.info(f"RVC processing completed for task {task_id}")
            
            return {
                "task_id": task_id,
                "status": "completed",
                "result_file": str(output_path),
                "message": "Audio processing completed successfully"
            }
            
        except Exception as e:
            logger.error(f"RVC processing failed for task {task_id}: {e}")
            return {
                "task_id": task_id,
                "status": "failed",
                "message": f"Processing failed: {str(e)}"
            }

    async def process_text_to_speech_background(
        self,
        task_id: str,
        text: str,
        model_name: str,
        enhance_quality: bool = True,
        noise_reduction: bool = True,
        tts_engine: str = "gtts",
        language: str = "en"
    ) -> None:
        """Background task for TTS processing"""
        try:
            logger.info(f"Starting background TTS processing for task {task_id}")
            logger.info(f"Model: {model_name}")
            
            # Find the model files
            logger.info(f"Looking for model files for: {model_name}")
            model_path, index_path = await self._find_model_files(model_name)
            if not model_path:
                logger.error(f"Model not found: {model_name}")
                return
            
            logger.info(f"Found model files - Model: {model_path}, Index: {index_path}")
            
            # Step 1: Generate speech from text
            logger.info(f"Step 1: Generating TTS audio for task {task_id}")
            import asyncio
            try:
                # Generate TTS audio - let the RVC model handle voice conversion
                base_audio, sample_rate = await asyncio.wait_for(
                    self.tts_engine.text_to_speech(
                        text=text,
                        language=language,
                        engine=tts_engine
                    ),
                    timeout=30.0  # 30 second timeout for TTS
                )
                logger.info(f"TTS generation completed - Audio shape: {base_audio.shape}, Sample rate: {sample_rate}")
            except asyncio.TimeoutError:
                logger.error(f"TTS generation timed out after 30 seconds for task {task_id}")
                raise Exception("TTS generation timed out")
            except Exception as e:
                logger.error(f"TTS generation failed with error: {e}")
                raise
            
            # Step 2: Save temporary audio file
            logger.info(f"Step 2: Saving temporary audio file for task {task_id}")
            temp_audio_path = self.output_dir / f"temp_tts_{task_id}.wav"
            sf.write(temp_audio_path, base_audio, sample_rate)
            logger.info(f"Temporary audio saved to: {temp_audio_path}")
            
            # Step 3: Apply RVC voice cloning
            logger.info(f"Step 3: Starting RVC processing for task {task_id}")
            logger.info(f"RVC Input: {temp_audio_path}")
            logger.info(f"RVC Model: {model_path}")
            logger.info(f"RVC Index: {index_path}")
            
            # Add timeout and more detailed logging
            import asyncio
            try:
                logger.info(f"Calling RVC engine with timeout...")
                processed_audio, processed_sr = await asyncio.wait_for(
                    self.rvc_engine.process_audio_with_rvc(
                        audio_path=str(temp_audio_path),
                        model_path=model_path,
                        index_path=index_path,
                        enhance_quality=enhance_quality,
                        noise_reduction=noise_reduction
                    ),
                    timeout=60.0  # 60 second timeout
                )
                logger.info(f"RVC processing completed - Output shape: {processed_audio.shape}, Sample rate: {processed_sr}")
            except asyncio.TimeoutError:
                logger.error(f"RVC processing timed out after 60 seconds for task {task_id}")
                raise Exception("RVC processing timed out")
            except Exception as e:
                logger.error(f"RVC processing failed with error: {e}")
                raise
            
            # Step 4: Save final audio
            logger.info(f"Step 4: Saving final audio for task {task_id}")
            output_filename = f"tts_{task_id}.wav"
            output_path = self.output_dir / output_filename
            sf.write(output_path, processed_audio, processed_sr)
            logger.info(f"Final audio saved to: {output_path}")
            
            # Clean up temporary file
            temp_audio_path.unlink()
            logger.info(f"Temporary file cleaned up: {temp_audio_path}")
            
            logger.info(f"✅ Background TTS processing completed successfully for task {task_id}")
            
        except Exception as e:
            logger.error(f"❌ Background TTS processing failed for task {task_id}: {e}")
            logger.error(f"❌ Error type: {type(e).__name__}")
            import traceback
            traceback.print_exc()

    async def process_text_to_speech(
        self,
        text: str,
        model_name: str,
        enhance_quality: bool = True,
        noise_reduction: bool = True,
        tts_engine: str = "gtts",
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Process text to speech with RVC model
        
        Args:
            text: Text to convert to speech
            model_name: Name of the RVC model to use
            enhance_quality: Whether to enhance audio quality
            noise_reduction: Whether to apply noise reduction
            tts_engine: TTS engine to use (gtts, pyttsx3) - defaults to gtts
            language: Language for TTS
            
        Returns:
            Dict containing task_id and status
        """
        task_id = str(uuid.uuid4())
        
        try:
            logger.info(f"Starting TTS processing for task {task_id}")
            
            # Find the model files
            model_path, index_path = await self._find_model_files(model_name)
            if not model_path:
                raise ValueError(f"Model not found: {model_name}")
            
            # Step 1: Generate speech from text
            # Use default TTS voice - RVC will convert it to the target voice
            base_audio, sample_rate = await self.tts_engine.text_to_speech(
                text=text,
                language=language,
                engine=tts_engine
            )
            
            # Step 2: Save temporary audio file
            temp_audio_path = self.output_dir / f"temp_tts_{task_id}.wav"
            sf.write(temp_audio_path, base_audio, sample_rate)
            
            # Step 3: Apply RVC voice cloning
            processed_audio, processed_sr = await self.rvc_engine.process_audio_with_rvc(
                audio_path=str(temp_audio_path),
                model_path=model_path,
                index_path=index_path,
                enhance_quality=enhance_quality,
                noise_reduction=noise_reduction
            )
            
            # Step 4: Save final audio
            output_filename = f"tts_{task_id}.wav"
            output_path = self.output_dir / output_filename
            sf.write(output_path, processed_audio, processed_sr)
            
            # Clean up temporary file
            temp_audio_path.unlink()
            
            logger.info(f"TTS processing completed for task {task_id}")
            
            return {
                "task_id": task_id,
                "status": "completed",
                "result_file": str(output_path),
                "message": "Text-to-speech processing completed successfully"
            }
            
        except Exception as e:
            logger.error(f"TTS processing failed for task {task_id}: {e}")
            return {
                "task_id": task_id,
                "status": "failed",
                "message": f"TTS processing failed: {str(e)}"
            }

    async def _find_model_files(self, model_name: str) -> tuple[Optional[str], Optional[str]]:
        """Find model files by name"""
        try:
            # First, try to find by exact model name match in database
            from app.db.database import SessionLocal
            from app.models.voice_model import VoiceModel
            
            db = SessionLocal()
            try:
                # Look for model by name or character
                model = db.query(VoiceModel).filter(
                    (VoiceModel.name == model_name) | 
                    (VoiceModel.character == model_name)
                ).filter(VoiceModel.is_downloaded == True).first()
                
                if model and model.local_path and os.path.exists(model.local_path):
                    index_path = model.index_path if model.index_path and os.path.exists(model.index_path) else None
                    logger.info(f"Found model in database: {model.local_path}")
                    return model.local_path, index_path
            finally:
                db.close()
            
            # Fallback: Search for model files in the models directory
            logger.info(f"Model not found in database, searching filesystem for: {model_name}")
            for model_dir in self.models_dir.iterdir():
                if model_dir.is_dir():
                    # Look for .pth file
                    pth_files = list(model_dir.glob("*.pth"))
                    index_files = list(model_dir.glob("*.index"))
                    
                    if pth_files:
                        model_path = str(pth_files[0])
                        index_path = str(index_files[0]) if index_files else None
                        
                        # Check if this matches the model name (more flexible matching)
                        model_name_clean = model_name.lower().replace(" ", "").replace("-", "")
                        file_name_clean = pth_files[0].stem.lower().replace("_", "").replace("-", "")
                        
                        # Try exact match first
                        if model_name.lower() in model_path.lower():
                            return model_path, index_path
                        
                        # Try character name match
                        if model_name_clean in file_name_clean or file_name_clean in model_name_clean:
                            return model_path, index_path
            
            logger.warning(f"Model files not found for: {model_name}")
            return None, None
            
        except Exception as e:
            logger.error(f"Error finding model files: {e}")
            return None, None
    
    def _get_voice_id_for_model(self, model_name: str) -> str:
        """Get the appropriate voice ID for the model"""
        model_name_lower = model_name.lower()
        
        if any(name in model_name_lower for name in ["taylor", "swift", "sofia", "carson", "female"]):
            return "female"
        elif any(name in model_name_lower for name in ["isao", "sasaki", "male"]):
            return "male"
        else:
            # Default to female for most voice models
            return "female"
    
    def get_processing_status(self, task_id: str) -> Dict[str, Any]:
        """
        Get the processing status for a task
        
        Args:
            task_id: The task ID to check
            
        Returns:
            Dict containing status information
        """
        # Check if output file exists (look for tts_{task_id}.wav)
        output_file = self.output_dir / f"tts_{task_id}.wav"
        if output_file.exists():
            return {
                "task_id": task_id,
                "status": "completed",
                "progress": 100,
                "message": "TTS processing completed successfully",
                "result_file": output_file.name  # Return just the filename, not the full path
            }
        else:
            # Check if temp file exists (processing in progress)
            temp_file = self.output_dir / f"temp_tts_{task_id}.wav"
            if temp_file.exists():
                return {
                    "task_id": task_id,
                    "status": "processing",
                    "progress": 75,
                    "message": "Applying voice cloning..."
                }
            else:
                return {
                    "task_id": task_id,
                    "status": "processing",
                    "progress": 25,
                    "message": "Generating speech from text..."
                }
    
    # Live Audio Processing Methods
    async def start_live_audio(self, model_name: str) -> Dict[str, Any]:
        """Start live audio processing"""
        try:
            # Find model files
            model_path, index_path = await self._find_model_files(model_name)
            if not model_path:
                raise ValueError(f"Model not found: {model_name}")
            
            # Set model for live processing
            self.live_audio_manager.set_model(model_path, index_path)
            
            # Start live audio manager
            await self.live_audio_manager.start()
            
            return {
                "success": True,
                "message": "Live audio processing started",
                "model": model_name
            }
            
        except Exception as e:
            logger.error(f"Failed to start live audio: {e}")
            return {
                "success": False,
                "message": f"Failed to start live audio: {str(e)}"
            }
    
    async def stop_live_audio(self) -> Dict[str, Any]:
        """Stop live audio processing"""
        try:
            await self.live_audio_manager.stop()
            return {
                "success": True,
                "message": "Live audio processing stopped"
            }
        except Exception as e:
            logger.error(f"Failed to stop live audio: {e}")
            return {
                "success": False,
                "message": f"Failed to stop live audio: {str(e)}"
            }
    
    def get_live_audio_status(self) -> Dict[str, Any]:
        """Get live audio processing status"""
        return self.live_audio_manager.get_status()
    
    def get_available_tts_voices(self) -> Dict[str, Any]:
        """Get available TTS voices"""
        return self.tts_engine.get_engine_info()
    
    def get_loaded_models(self) -> list:
        """Get list of loaded RVC models"""
        return self.rvc_engine.get_loaded_models()
    
    # Microphone and Live Recording Methods
    def get_microphone_devices(self) -> list:
        """Get available microphone devices"""
        return self.microphone_service.get_available_devices()
    
    def select_microphone(self, device_id: int) -> bool:
        """Select microphone device"""
        return self.microphone_service.select_device(device_id)
    
    def test_microphone(self, device_id: Optional[int] = None) -> Dict[str, Any]:
        """Test microphone functionality"""
        return self.microphone_service.test_microphone(device_id)
    
    def get_microphone_status(self) -> Dict[str, Any]:
        """Get microphone status"""
        return self.microphone_service.get_recording_status()
    
    def get_microphone_info(self) -> Dict[str, Any]:
        """Get microphone system information"""
        return self.microphone_service.get_audio_info()
    
    async def start_live_recording(self, model_name: str) -> Dict[str, Any]:
        """Start live recording with RVC processing"""
        try:
            # Find the model files
            model_path, index_path = await self._find_model_files(model_name)
            if not model_path:
                raise ValueError(f"Model not found: {model_name}")
            
            # Start live recording
            success = self.live_recording_handler.start_live_recording(
                model_path=model_path,
                index_path=index_path
            )
            
            if success:
                return {
                    "success": True,
                    "message": "Live recording started",
                    "model": model_name
                }
            else:
                return {
                    "success": False,
                    "message": "Failed to start live recording"
                }
                
        except Exception as e:
            logger.error(f"Failed to start live recording: {e}")
            return {
                "success": False,
                "message": f"Failed to start live recording: {str(e)}"
            }
    
    async def stop_live_recording(self) -> Dict[str, Any]:
        """Stop live recording"""
        try:
            success = self.live_recording_handler.stop_live_recording()
            return {
                "success": success,
                "message": "Live recording stopped" if success else "Failed to stop live recording"
            }
        except Exception as e:
            logger.error(f"Failed to stop live recording: {e}")
            return {
                "success": False,
                "message": f"Failed to stop live recording: {str(e)}"
            }
    
    def get_live_recording_status(self) -> Dict[str, Any]:
        """Get live recording status"""
        return self.live_recording_handler.get_status()
    
    async def record_and_process(self, duration: float, model_name: str) -> Dict[str, Any]:
        """Record audio for specified duration and process with RVC"""
        try:
            # Find the model files
            model_path, index_path = await self._find_model_files(model_name)
            if not model_path:
                raise ValueError(f"Model not found: {model_name}")
            
            # Record and process
            result = self.live_recording_handler.record_and_save(
                duration=duration,
                model_path=model_path,
                index_path=index_path
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Record and process failed: {e}")
            return {
                "success": False,
                "message": f"Record and process failed: {str(e)}"
            }
