import asyncio
import logging
import threading
import queue
import time
import numpy as np
import soundfile as sf
import torch
from typing import Dict, Any, Optional, Callable
import json
from pathlib import Path
import tempfile
import io

logger = logging.getLogger(__name__)

class LiveAudioProcessor:
    """Real-time audio processing for live voice cloning"""
    
    def __init__(self, rvc_engine, sample_rate: int = 44100, chunk_size: int = 1024):
        self.rvc_engine = rvc_engine
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size
        self.is_processing = False
        self.current_model = None
        self.audio_buffer = queue.Queue()
        self.output_buffer = queue.Queue()
        self.processing_thread = None
        self.websocket_clients = set()
        
        logger.info(f"Live audio processor initialized (SR: {sample_rate}, Chunk: {chunk_size})")
    
    def set_model(self, model_path: str, index_path: Optional[str] = None):
        """Set the RVC model for live processing"""
        try:
            self.current_model = self.rvc_engine.load_rvc_model(model_path, index_path)
            logger.info(f"Live processing model set: {model_path}")
        except Exception as e:
            logger.error(f"Failed to set live processing model: {e}")
            raise
    
    def start_processing(self):
        """Start live audio processing"""
        if self.is_processing:
            logger.warning("Live processing already started")
            return
        
        if not self.current_model:
            raise ValueError("No model set for live processing")
        
        self.is_processing = True
        self.processing_thread = threading.Thread(target=self._processing_loop)
        self.processing_thread.daemon = True
        self.processing_thread.start()
        
        logger.info("Live audio processing started")
    
    def stop_processing(self):
        """Stop live audio processing"""
        self.is_processing = False
        if self.processing_thread:
            self.processing_thread.join(timeout=2.0)
        
        # Clear buffers
        while not self.audio_buffer.empty():
            self.audio_buffer.get()
        while not self.output_buffer.empty():
            self.output_buffer.get()
        
        logger.info("Live audio processing stopped")
    
    def add_audio_chunk(self, audio_data: np.ndarray):
        """Add audio chunk for processing"""
        if self.is_processing:
            self.audio_buffer.put(audio_data)
    
    def get_processed_chunk(self) -> Optional[np.ndarray]:
        """Get processed audio chunk"""
        try:
            return self.output_buffer.get_nowait()
        except queue.Empty:
            return None
    
    def _processing_loop(self):
        """Main processing loop for live audio"""
        audio_chunks = []
        buffer_size = self.chunk_size * 4  # Buffer for smoother processing
        
        while self.is_processing:
            try:
                # Collect audio chunks
                while len(audio_chunks) < buffer_size and not self.audio_buffer.empty():
                    chunk = self.audio_buffer.get(timeout=0.1)
                    audio_chunks.append(chunk)
                
                # Process when we have enough data
                if len(audio_chunks) >= buffer_size:
                    # Combine chunks
                    combined_audio = np.concatenate(audio_chunks)
                    
                    # Process with RVC
                    processed_audio = self._process_chunk(combined_audio)
                    
                    # Split back into chunks and add to output buffer
                    chunk_size = self.chunk_size
                    for i in range(0, len(processed_audio), chunk_size):
                        chunk = processed_audio[i:i + chunk_size]
                        if len(chunk) == chunk_size:  # Only add complete chunks
                            self.output_buffer.put(chunk)
                    
                    # Keep some overlap for smoother processing
                    overlap_size = self.chunk_size // 2
                    audio_chunks = audio_chunks[-overlap_size:] if overlap_size < len(audio_chunks) else []
                
                time.sleep(0.01)  # Small delay to prevent busy waiting
                
            except queue.Empty:
                continue
            except Exception as e:
                logger.error(f"Error in processing loop: {e}")
                time.sleep(0.1)
    
    def _process_chunk(self, audio_chunk: np.ndarray) -> np.ndarray:
        """Process a single audio chunk with RVC"""
        try:
            # Preprocess
            audio_chunk = self.rvc_engine.preprocess_audio(audio_chunk, self.sample_rate)
            
            # Convert to tensor
            audio_tensor = torch.from_numpy(audio_chunk).float().unsqueeze(0)
            
            # Process with RVC model
            with torch.no_grad():
                audio_tensor = audio_tensor.to(self.rvc_engine.device)
                
                if hasattr(self.current_model.model, 'forward'):
                    processed_tensor = self.current_model.model(audio_tensor)
                else:
                    processed_tensor = audio_tensor
                
                processed_audio = processed_tensor.squeeze(0).cpu().numpy()
            
            # Postprocess
            processed_audio = self.rvc_engine.postprocess_audio(processed_audio, self.sample_rate)
            
            return processed_audio
            
        except Exception as e:
            logger.error(f"Chunk processing failed: {e}")
            return audio_chunk  # Return original if processing fails

# WebSocket server removed for now - can be added later with websockets dependency

class LiveAudioManager:
    """Manager for live audio processing"""
    
    def __init__(self, rvc_engine):
        self.rvc_engine = rvc_engine
        self.live_processor = LiveAudioProcessor(rvc_engine)
        self.is_running = False
    
    async def start(self):
        """Start live audio processing system"""
        if self.is_running:
            return
        
        self.is_running = True
        logger.info("Live audio manager started")
    
    async def stop(self):
        """Stop live audio processing system"""
        if not self.is_running:
            return
        
        self.live_processor.stop_processing()
        self.is_running = False
        logger.info("Live audio manager stopped")
    
    def set_model(self, model_path: str, index_path: Optional[str] = None):
        """Set the RVC model for live processing"""
        self.live_processor.set_model(model_path, index_path)
    
    def get_status(self) -> Dict[str, Any]:
        """Get current status"""
        return {
            'is_running': self.is_running,
            'is_processing': self.live_processor.is_processing,
            'current_model': self.live_processor.current_model.model_path if self.live_processor.current_model else None,
            'connected_clients': 0  # WebSocket clients removed for now
        }
