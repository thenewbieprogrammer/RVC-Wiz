import os
import torch
import torchaudio
import librosa
import soundfile as sf
import numpy as np
import logging
from pathlib import Path
from typing import Dict, Any, Optional, Tuple
import asyncio
import threading
import queue
import time
from dataclasses import dataclass
from .rvc_infer.simple_rvc import SimpleRVCProcessor

logger = logging.getLogger(__name__)

@dataclass
class RVCModel:
    """RVC Model container"""
    model: torch.nn.Module
    index_data: Optional[Any] = None
    model_path: str = ""
    index_path: str = ""
    sample_rate: int = 44100
    hop_length: int = 512
    n_fft: int = 2048

class RVCVoiceCloningEngine:
    """Real RVC Voice Cloning Engine"""
    
    def __init__(self):
        self.loaded_models: Dict[str, RVCModel] = {}
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.sample_rate = 44100
        self.hop_length = 512
        self.n_fft = 2048
        
        # Initialize the simple RVC processor
        self.rvc_processor = SimpleRVCProcessor()
        
        logger.info(f"RVC Engine initialized on device: {self.device}")
    
    def load_rvc_model(self, model_path: str, index_path: Optional[str] = None) -> RVCModel:
        """Load RVC model from .pth file"""
        try:
            # Check if model is already loaded
            if model_path in self.loaded_models:
                logger.info(f"Model already loaded: {model_path}")
                return self.loaded_models[model_path]
            
            logger.info(f"Loading RVC model: {model_path}")
            
            # Load PyTorch model
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            
            # Load model with proper device mapping
            model_data = torch.load(model_path, map_location=self.device)
            
            # Handle different model formats
            if isinstance(model_data, dict):
                if 'model' in model_data:
                    model = model_data['model']
                elif 'state_dict' in model_data:
                    # Create model architecture and load state dict
                    model = self._create_model_from_state_dict(model_data['state_dict'])
                else:
                    # Assume the dict itself is the model
                    model = model_data
            else:
                model = model_data
            
            # Set model to evaluation mode
            if hasattr(model, 'eval'):
                model.eval()
            
            # Load index file if available
            index_data = None
            if index_path and os.path.exists(index_path):
                index_data = self._load_index_file(index_path)
            
            # Create RVCModel container
            rvc_model = RVCModel(
                model=model,
                index_data=index_data,
                model_path=model_path,
                index_path=index_path or "",
                sample_rate=self.sample_rate,
                hop_length=self.hop_length,
                n_fft=self.n_fft
            )
            
            # Cache the model
            self.loaded_models[model_path] = rvc_model
            
            logger.info(f"Successfully loaded RVC model: {model_path}")
            return rvc_model
            
        except Exception as e:
            logger.error(f"Failed to load RVC model {model_path}: {e}")
            raise
    
    def _create_model_from_state_dict(self, state_dict: Dict) -> torch.nn.Module:
        """Create model architecture from state dict"""
        # This is a simplified version - you might need to adjust based on your model architecture
        try:
            # Try to infer model architecture from state dict keys
            if any('encoder' in key for key in state_dict.keys()):
                # RVC-like architecture
                model = self._create_rvc_architecture(state_dict)
            else:
                # Generic model
                model = torch.nn.Module()
                model.load_state_dict(state_dict)
            
            return model
        except Exception as e:
            logger.warning(f"Could not create model from state dict: {e}")
            # Return a dummy model that can be used
            return torch.nn.Module()
    
    def _create_rvc_architecture(self, state_dict: Dict) -> torch.nn.Module:
        """Create RVC-specific model architecture"""
        # This is a placeholder - you'll need to implement the actual RVC architecture
        # based on your specific model format
        class RVCModel(torch.nn.Module):
            def __init__(self):
                super().__init__()
                # Add your RVC model layers here
                pass
            
            def forward(self, x):
                # Add your forward pass here
                return x
        
        model = RVCModel()
        try:
            model.load_state_dict(state_dict)
        except:
            logger.warning("Could not load state dict, using untrained model")
        
        return model
    
    def _load_index_file(self, index_path: str) -> Optional[Any]:
        """Load index file for faster inference"""
        try:
            # Try to load with faiss if available
            try:
                import faiss
                index = faiss.read_index(index_path)
                logger.info(f"Loaded FAISS index: {index_path}")
                return index
            except ImportError:
                logger.warning("FAISS not available, skipping index loading")
                return None
        except Exception as e:
            logger.warning(f"Could not load index file {index_path}: {e}")
            return None
    
    def preprocess_audio(self, audio: np.ndarray, sr: int) -> np.ndarray:
        """Preprocess audio for RVC processing"""
        try:
            # Resample if necessary
            if sr != self.sample_rate:
                audio = librosa.resample(audio, orig_sr=sr, target_sr=self.sample_rate)
            
            # Normalize audio
            audio = librosa.util.normalize(audio)
            
            # Convert to mono if stereo
            if len(audio.shape) > 1:
                audio = librosa.to_mono(audio)
            
            return audio
            
        except Exception as e:
            logger.error(f"Audio preprocessing failed: {e}")
            raise
    
    def postprocess_audio(self, audio: np.ndarray, sr: int) -> np.ndarray:
        """Postprocess audio after RVC processing"""
        try:
            # Normalize output
            audio = librosa.util.normalize(audio)
            
            # Apply gentle compression
            audio = np.tanh(audio * 1.2) * 0.8
            
            return audio
            
        except Exception as e:
            logger.error(f"Audio postprocessing failed: {e}")
            raise
    
    async def process_audio_with_rvc(
        self, 
        audio_path: str, 
        model_path: str, 
        index_path: Optional[str] = None,
        enhance_quality: bool = True,
        noise_reduction: bool = True,
        pitch_shift: int = 0
    ) -> Tuple[np.ndarray, int]:
        """Process audio file with RVC model"""
        try:
            logger.info(f"Processing audio with RVC: {audio_path}")
            
            # Use the proper RVC processor (run in thread pool since it's not async)
            import asyncio
            loop = asyncio.get_event_loop()
            converted_audio, sr = await loop.run_in_executor(
                None,
                self.rvc_processor.process_audio_with_rvc,
                audio_path,
                model_path,
                index_path,
                enhance_quality,
                noise_reduction,
                pitch_shift
            )
            
            logger.info(f"Successfully processed audio with RVC")
            return converted_audio, sr
            
        except Exception as e:
            logger.error(f"RVC audio processing failed: {e}")
            raise
    
    def _apply_pitch_shift(self, audio_tensor: torch.Tensor, semitones: int) -> torch.Tensor:
        """Apply pitch shift to audio"""
        try:
            # Convert to numpy for librosa processing
            audio_np = audio_tensor.squeeze(0).numpy()
            
            # Apply pitch shift
            shifted_audio = librosa.effects.pitch_shift(
                audio_np, 
                sr=self.sample_rate, 
                n_steps=semitones
            )
            
            return torch.from_numpy(shifted_audio).float().unsqueeze(0)
            
        except Exception as e:
            logger.warning(f"Pitch shift failed: {e}")
            return audio_tensor
    
    def _enhance_audio_quality(self, audio: np.ndarray) -> np.ndarray:
        """Enhance audio quality"""
        try:
            # Apply gentle EQ
            audio = librosa.effects.preemphasis(audio)
            
            # Apply gentle compression
            audio = np.tanh(audio * 1.1) * 0.9
            
            return audio
            
        except Exception as e:
            logger.warning(f"Audio enhancement failed: {e}")
            return audio
    
    def _reduce_noise(self, audio: np.ndarray) -> np.ndarray:
        """Reduce noise in audio"""
        try:
            # Simple noise reduction using spectral gating
            stft = librosa.stft(audio, hop_length=self.hop_length, n_fft=self.n_fft)
            magnitude = np.abs(stft)
            
            # Apply noise gate
            noise_gate = np.percentile(magnitude, 20)
            magnitude = np.where(magnitude < noise_gate, magnitude * 0.1, magnitude)
            
            # Reconstruct audio
            stft = magnitude * np.exp(1j * np.angle(stft))
            audio = librosa.istft(stft, hop_length=self.hop_length)
            
            return audio
            
        except Exception as e:
            logger.warning(f"Noise reduction failed: {e}")
            return audio
    
    def get_model_info(self, model_path: str) -> Dict[str, Any]:
        """Get information about a loaded model"""
        if model_path not in self.loaded_models:
            return {"error": "Model not loaded"}
        
        model = self.loaded_models[model_path]
        return {
            "model_path": model.model_path,
            "index_path": model.index_path,
            "sample_rate": model.sample_rate,
            "device": str(self.device),
            "has_index": model.index_data is not None
        }
    
    def unload_model(self, model_path: str) -> bool:
        """Unload a model from memory"""
        if model_path in self.loaded_models:
            del self.loaded_models[model_path]
            logger.info(f"Unloaded model: {model_path}")
            return True
        return False
    
    def get_loaded_models(self) -> list:
        """Get list of loaded model paths"""
        return list(self.loaded_models.keys())
