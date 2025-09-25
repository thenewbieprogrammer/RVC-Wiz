import asyncio
import logging
import threading
import queue
import time
import numpy as np
try:
    import sounddevice as sd
    SOUNDDEVICE_AVAILABLE = True
except ImportError:
    SOUNDDEVICE_AVAILABLE = False
    sd = None
import soundfile as sf
from typing import Dict, Any, Optional, List, Callable
from pathlib import Path
import tempfile
import json

logger = logging.getLogger(__name__)

class MicrophoneDevice:
    """Represents a microphone device"""
    def __init__(self, device_id: int, name: str, channels: int, sample_rate: float):
        self.device_id = device_id
        self.name = name
        self.channels = channels
        self.sample_rate = sample_rate
        self.is_default = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "device_id": self.device_id,
            "name": self.name,
            "channels": self.channels,
            "sample_rate": self.sample_rate,
            "is_default": self.is_default
        }

class MicrophoneService:
    """Service for microphone detection and audio input"""
    
    def __init__(self):
        self.available_devices: List[MicrophoneDevice] = []
        self.selected_device: Optional[MicrophoneDevice] = None
        self.is_recording = False
        self.recording_thread: Optional[threading.Thread] = None
        self.audio_queue = queue.Queue()
        self.recording_callback: Optional[Callable] = None
        self.sample_rate = 44100
        self.chunk_size = 1024
        
        if not SOUNDDEVICE_AVAILABLE:
            logger.warning("sounddevice not available - microphone functionality will be limited")
        
        logger.info("Microphone service initialized")
    
    def detect_microphones(self) -> List[MicrophoneDevice]:
        """Detect available microphone devices"""
        try:
            logger.info("Detecting microphone devices...")
            
            if not SOUNDDEVICE_AVAILABLE:
                logger.warning("sounddevice not available - returning empty device list")
                return []
            
            # Get all audio devices
            devices = sd.query_devices()
            microphones = []
            
            for i, device in enumerate(devices):
                # Check if device has input channels
                if device['max_input_channels'] > 0:
                    mic = MicrophoneDevice(
                        device_id=i,
                        name=device['name'],
                        channels=device['max_input_channels'],
                        sample_rate=device['default_samplerate']
                    )
                    
                    # Check if it's the default input device
                    default_input = sd.default.device[0]
                    if i == default_input:
                        mic.is_default = True
                    
                    microphones.append(mic)
            
            self.available_devices = microphones
            logger.info(f"Found {len(microphones)} microphone devices")
            
            # Set default device if available
            if microphones:
                default_mic = next((mic for mic in microphones if mic.is_default), microphones[0])
                self.selected_device = default_mic
                logger.info(f"Selected default microphone: {default_mic.name}")
            
            return microphones
            
        except Exception as e:
            logger.error(f"Failed to detect microphones: {e}")
            return []
    
    def get_available_devices(self) -> List[Dict[str, Any]]:
        """Get list of available microphone devices"""
        if not self.available_devices:
            self.detect_microphones()
        
        return [device.to_dict() for device in self.available_devices]
    
    def select_device(self, device_id: int) -> bool:
        """Select a microphone device by ID"""
        try:
            device = next((d for d in self.available_devices if d.device_id == device_id), None)
            if device:
                self.selected_device = device
                logger.info(f"Selected microphone: {device.name}")
                return True
            else:
                logger.error(f"Microphone device {device_id} not found")
                return False
        except Exception as e:
            logger.error(f"Failed to select microphone device: {e}")
            return False
    
    def get_selected_device(self) -> Optional[Dict[str, Any]]:
        """Get currently selected microphone device"""
        if self.selected_device:
            return self.selected_device.to_dict()
        return None
    
    def start_recording(self, callback: Optional[Callable] = None) -> bool:
        """Start recording from microphone"""
        try:
            if self.is_recording:
                logger.warning("Recording already in progress")
                return False
            
            if not self.selected_device:
                logger.error("No microphone device selected")
                return False
            
            self.recording_callback = callback
            self.is_recording = True
            
            # Start recording thread
            self.recording_thread = threading.Thread(target=self._recording_loop)
            self.recording_thread.daemon = True
            self.recording_thread.start()
            
            logger.info(f"Started recording from {self.selected_device.name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start recording: {e}")
            self.is_recording = False
            return False
    
    def stop_recording(self) -> bool:
        """Stop recording from microphone"""
        try:
            if not self.is_recording:
                logger.warning("No recording in progress")
                return False
            
            self.is_recording = False
            
            # Wait for recording thread to finish
            if self.recording_thread:
                self.recording_thread.join(timeout=2.0)
            
            logger.info("Stopped recording")
            return True
            
        except Exception as e:
            logger.error(f"Failed to stop recording: {e}")
            return False
    
    def _recording_loop(self):
        """Main recording loop"""
        try:
            def audio_callback(indata, frames, time, status):
                if status:
                    logger.warning(f"Audio callback status: {status}")
                
                # Convert to numpy array
                audio_data = indata.copy()
                
                # Add to queue for processing
                self.audio_queue.put(audio_data)
                
                # Call user callback if provided
                if self.recording_callback:
                    try:
                        self.recording_callback(audio_data, time)
                    except Exception as e:
                        logger.error(f"Recording callback error: {e}")
            
            # Start audio stream
            with sd.InputStream(
                device=self.selected_device.device_id,
                channels=min(self.selected_device.channels, 2),  # Limit to stereo
                samplerate=self.sample_rate,
                blocksize=self.chunk_size,
                callback=audio_callback
            ):
                while self.is_recording:
                    time.sleep(0.1)
                    
        except Exception as e:
            logger.error(f"Recording loop error: {e}")
        finally:
            self.is_recording = False
    
    def get_audio_chunk(self) -> Optional[np.ndarray]:
        """Get next audio chunk from recording queue"""
        try:
            return self.audio_queue.get_nowait()
        except queue.Empty:
            return None
    
    def record_to_file(self, duration: float, output_path: str) -> bool:
        """Record audio to file for specified duration"""
        try:
            if not self.selected_device:
                logger.error("No microphone device selected")
                return False
            
            logger.info(f"Recording {duration}s to {output_path}")
            
            # Record audio
            audio_data = sd.rec(
                int(duration * self.sample_rate),
                samplerate=self.sample_rate,
                channels=min(self.selected_device.channels, 2),
                device=self.selected_device.device_id
            )
            
            # Wait for recording to complete
            sd.wait()
            
            # Save to file
            sf.write(output_path, audio_data, self.sample_rate)
            
            logger.info(f"Recording saved to {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to record to file: {e}")
            return False
    
    def get_recording_status(self) -> Dict[str, Any]:
        """Get current recording status"""
        return {
            "is_recording": self.is_recording,
            "selected_device": self.get_selected_device(),
            "available_devices_count": len(self.available_devices),
            "queue_size": self.audio_queue.qsize()
        }
    
    def test_microphone(self, device_id: Optional[int] = None) -> Dict[str, Any]:
        """Test microphone functionality"""
        try:
            test_device_id = device_id if device_id is not None else (
                self.selected_device.device_id if self.selected_device else None
            )
            
            if test_device_id is None:
                return {"success": False, "error": "No device selected"}
            
            # Record a short test sample
            test_duration = 1.0  # 1 second
            test_data = sd.rec(
                int(test_duration * self.sample_rate),
                samplerate=self.sample_rate,
                channels=1,
                device=test_device_id
            )
            
            # Wait for recording
            sd.wait()
            
            # Check if we got audio data
            audio_level = np.max(np.abs(test_data))
            
            return {
                "success": True,
                "device_id": test_device_id,
                "audio_level": float(audio_level),
                "has_audio": audio_level > 0.01,  # Threshold for detecting audio
                "sample_rate": self.sample_rate,
                "duration": test_duration
            }
            
        except Exception as e:
            logger.error(f"Microphone test failed: {e}")
            return {"success": False, "error": str(e)}
    
    def get_audio_info(self) -> Dict[str, Any]:
        """Get audio system information"""
        try:
            return {
                "default_input_device": sd.default.device[0],
                "default_output_device": sd.default.device[1],
                "sample_rate": self.sample_rate,
                "chunk_size": self.chunk_size,
                "available_devices": self.get_available_devices(),
                "selected_device": self.get_selected_device()
            }
        except Exception as e:
            logger.error(f"Failed to get audio info: {e}")
            return {"error": str(e)}
