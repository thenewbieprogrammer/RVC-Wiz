import asyncio
import logging
import threading
import queue
import time
import numpy as np
import soundfile as sf
from typing import Dict, Any, Optional, Callable, List
from pathlib import Path
import tempfile
import uuid
from datetime import datetime

from .microphone_service import MicrophoneService
from .rvc_engine import RVCVoiceCloningEngine

logger = logging.getLogger(__name__)

class LiveRecordingHandler:
    """Handles live audio recording with real-time RVC processing"""
    
    def __init__(self, rvc_engine: RVCVoiceCloningEngine):
        self.microphone_service = MicrophoneService()
        self.rvc_engine = rvc_engine
        self.is_recording = False
        self.is_processing = False
        self.current_model = None
        self.recording_thread: Optional[threading.Thread] = None
        self.processing_thread: Optional[threading.Thread] = None
        
        # Audio buffers
        self.raw_audio_buffer = queue.Queue()
        self.processed_audio_buffer = queue.Queue()
        
        # Callbacks
        self.audio_callback: Optional[Callable] = None
        self.processing_callback: Optional[Callable] = None
        
        # Configuration
        self.buffer_size = 4096  # Audio buffer size
        self.processing_chunk_size = 8192  # Chunk size for RVC processing
        
        logger.info("Live recording handler initialized")
    
    def set_model(self, model_path: str, index_path: Optional[str] = None) -> bool:
        """Set the RVC model for live processing"""
        try:
            self.current_model = self.rvc_engine.load_rvc_model(model_path, index_path)
            logger.info(f"Live recording model set: {model_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to set live recording model: {e}")
            return False
    
    def start_live_recording(self, 
                           model_path: str, 
                           index_path: Optional[str] = None,
                           audio_callback: Optional[Callable] = None,
                           processing_callback: Optional[Callable] = None) -> bool:
        """Start live recording with RVC processing"""
        try:
            if self.is_recording:
                logger.warning("Live recording already in progress")
                return False
            
            # Set the model
            if not self.set_model(model_path, index_path):
                return False
            
            # Set callbacks
            self.audio_callback = audio_callback
            self.processing_callback = processing_callback
            
            # Start recording
            if not self.microphone_service.start_recording(self._audio_callback):
                return False
            
            self.is_recording = True
            self.is_processing = True
            
            # Start processing thread
            self.processing_thread = threading.Thread(target=self._processing_loop)
            self.processing_thread.daemon = True
            self.processing_thread.start()
            
            logger.info("Live recording with RVC processing started")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start live recording: {e}")
            self.stop_live_recording()
            return False
    
    def stop_live_recording(self) -> bool:
        """Stop live recording and processing"""
        try:
            if not self.is_recording:
                logger.warning("No live recording in progress")
                return False
            
            # Stop recording
            self.microphone_service.stop_recording()
            self.is_recording = False
            self.is_processing = False
            
            # Wait for threads to finish
            if self.processing_thread:
                self.processing_thread.join(timeout=2.0)
            
            # Clear buffers
            while not self.raw_audio_buffer.empty():
                self.raw_audio_buffer.get()
            while not self.processed_audio_buffer.empty():
                self.processed_audio_buffer.get()
            
            logger.info("Live recording stopped")
            return True
            
        except Exception as e:
            logger.error(f"Failed to stop live recording: {e}")
            return False
    
    def _audio_callback(self, audio_data: np.ndarray, timestamp):
        """Callback for incoming audio data"""
        try:
            # Add to raw audio buffer
            self.raw_audio_buffer.put(audio_data)
            
            # Call user callback if provided
            if self.audio_callback:
                try:
                    self.audio_callback(audio_data, timestamp)
                except Exception as e:
                    logger.error(f"Audio callback error: {e}")
                    
        except Exception as e:
            logger.error(f"Audio callback error: {e}")
    
    def _processing_loop(self):
        """Main processing loop for RVC conversion"""
        try:
            audio_chunks = []
            
            while self.is_processing:
                try:
                    # Collect audio chunks
                    while len(audio_chunks) < self.processing_chunk_size and not self.raw_audio_buffer.empty():
                        chunk = self.raw_audio_buffer.get(timeout=0.1)
                        audio_chunks.append(chunk)
                    
                    # Process when we have enough data
                    if len(audio_chunks) >= self.processing_chunk_size:
                        # Combine chunks
                        combined_audio = np.concatenate(audio_chunks)
                        
                        # Process with RVC
                        processed_audio = self._process_audio_chunk(combined_audio)
                        
                        # Add to processed buffer
                        self.processed_audio_buffer.put(processed_audio)
                        
                        # Call processing callback if provided
                        if self.processing_callback:
                            try:
                                self.processing_callback(processed_audio)
                            except Exception as e:
                                logger.error(f"Processing callback error: {e}")
                        
                        # Keep some overlap for smoother processing
                        overlap_size = self.processing_chunk_size // 4
                        audio_chunks = audio_chunks[-overlap_size:] if overlap_size < len(audio_chunks) else []
                    
                    time.sleep(0.01)  # Small delay to prevent busy waiting
                    
                except queue.Empty:
                    continue
                except Exception as e:
                    logger.error(f"Processing loop error: {e}")
                    time.sleep(0.1)
                    
        except Exception as e:
            logger.error(f"Processing loop failed: {e}")
        finally:
            self.is_processing = False
    
    def _process_audio_chunk(self, audio_chunk: np.ndarray) -> np.ndarray:
        """Process a single audio chunk with RVC"""
        try:
            # Preprocess audio
            audio_chunk = self.rvc_engine.preprocess_audio(audio_chunk, self.rvc_engine.sample_rate)
            
            # Convert to tensor
            audio_tensor = np.array(audio_chunk).astype(np.float32)
            
            # For now, return the processed audio (in real implementation, apply RVC model)
            # TODO: Apply actual RVC model processing here
            processed_audio = audio_chunk
            
            # Postprocess audio
            processed_audio = self.rvc_engine.postprocess_audio(processed_audio, self.rvc_engine.sample_rate)
            
            return processed_audio
            
        except Exception as e:
            logger.error(f"Audio chunk processing failed: {e}")
            return audio_chunk  # Return original if processing fails
    
    def get_processed_audio(self) -> Optional[np.ndarray]:
        """Get next processed audio chunk"""
        try:
            return self.processed_audio_buffer.get_nowait()
        except queue.Empty:
            return None
    
    def record_and_save(self, duration: float, model_path: str, index_path: Optional[str] = None) -> Dict[str, Any]:
        """Record audio for specified duration and save with RVC processing"""
        try:
            if not self.set_model(model_path, index_path):
                return {"success": False, "error": "Failed to set model"}
            
            # Create temporary file for recording
            temp_file = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
            temp_path = temp_file.name
            temp_file.close()
            
            # Record audio
            if not self.microphone_service.record_to_file(duration, temp_path):
                return {"success": False, "error": "Failed to record audio"}
            
            # Process with RVC
            try:
                processed_audio, sample_rate = asyncio.run(
                    self.rvc_engine.process_audio_with_rvc(
                        audio_path=temp_path,
                        model_path=model_path,
                        index_path=index_path
                    )
                )
                
                # Save processed audio
                output_filename = f"live_recording_{uuid.uuid4().hex[:8]}.wav"
                output_path = Path("outputs") / output_filename
                output_path.parent.mkdir(exist_ok=True)
                
                sf.write(output_path, processed_audio, sample_rate)
                
                # Clean up temp file
                Path(temp_path).unlink()
                
                return {
                    "success": True,
                    "output_file": str(output_path),
                    "duration": duration,
                    "model_path": model_path
                }
                
            except Exception as e:
                logger.error(f"RVC processing failed: {e}")
                return {"success": False, "error": f"RVC processing failed: {str(e)}"}
            
        except Exception as e:
            logger.error(f"Record and save failed: {e}")
            return {"success": False, "error": str(e)}
    
    def get_status(self) -> Dict[str, Any]:
        """Get current status"""
        return {
            "is_recording": self.is_recording,
            "is_processing": self.is_processing,
            "current_model": self.current_model.model_path if self.current_model else None,
            "microphone_status": self.microphone_service.get_recording_status(),
            "raw_buffer_size": self.raw_audio_buffer.qsize(),
            "processed_buffer_size": self.processed_audio_buffer.qsize()
        }
    
    def get_microphone_devices(self) -> List[Dict[str, Any]]:
        """Get available microphone devices"""
        return self.microphone_service.get_available_devices()
    
    def select_microphone(self, device_id: int) -> bool:
        """Select microphone device"""
        return self.microphone_service.select_device(device_id)
    
    def test_microphone(self, device_id: Optional[int] = None) -> Dict[str, Any]:
        """Test microphone functionality"""
        return self.microphone_service.test_microphone(device_id)
