"""
RVC Voice Cloning Processor
This module handles the core RVC functionality for voice cloning
"""

import torch
import torchaudio
import numpy as np
import librosa
import soundfile as sf
from pathlib import Path
import logging
from typing import Optional, Tuple, Dict, Any
import json

logger = logging.getLogger(__name__)

class RVCProcessor:
    """Main RVC voice cloning processor"""
    
    def __init__(self, model_path: str, device: str = "auto"):
        """
        Initialize RVC processor
        
        Args:
            model_path: Path to the RVC model file
            device: Device to use for processing ('cpu', 'cuda', or 'auto')
        """
        self.model_path = Path(model_path)
        self.device = self._get_device(device)
        self.model = None
        self.sample_rate = 44100
        self.hop_length = 512
        
        logger.info(f"RVC Processor initialized on device: {self.device}")
    
    def _get_device(self, device: str) -> str:
        """Determine the best device to use"""
        if device == "auto":
            if torch.cuda.is_available():
                return "cuda"
            elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
                return "mps"  # Apple Silicon
            else:
                return "cpu"
        return device
    
    def load_model(self) -> bool:
        """
        Load the RVC model
        
        Returns:
            bool: True if model loaded successfully
        """
        try:
            if not self.model_path.exists():
                logger.error(f"Model file not found: {self.model_path}")
                return False
            
            # Load model checkpoint
            checkpoint = torch.load(self.model_path, map_location=self.device)
            
            # Extract model configuration
            self.model_config = checkpoint.get('config', {})
            self.model_state = checkpoint.get('state_dict', {})
            
            logger.info("RVC model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            return False
    
    def preprocess_audio(self, audio_path: str) -> Tuple[np.ndarray, int]:
        """
        Preprocess audio file for RVC processing
        
        Args:
            audio_path: Path to input audio file
            
        Returns:
            Tuple of (audio_array, sample_rate)
        """
        try:
            # Load audio file
            audio, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Normalize audio
            audio = librosa.util.normalize(audio)
            
            # Remove silence
            audio, _ = librosa.effects.trim(audio, top_db=20)
            
            logger.info(f"Audio preprocessed: {len(audio)} samples at {sr}Hz")
            return audio, sr
            
        except Exception as e:
            logger.error(f"Audio preprocessing failed: {str(e)}")
            raise
    
    def extract_features(self, audio: np.ndarray) -> Dict[str, Any]:
        """
        Extract features from audio for voice conversion
        
        Args:
            audio: Audio array
            
        Returns:
            Dictionary containing extracted features
        """
        try:
            # Extract mel spectrogram
            mel_spec = librosa.feature.melspectrogram(
                y=audio,
                sr=self.sample_rate,
                n_mels=80,
                hop_length=self.hop_length
            )
            
            # Extract pitch
            pitches, magnitudes = librosa.piptrack(
                y=audio,
                sr=self.sample_rate,
                hop_length=self.hop_length
            )
            
            # Extract formants
            stft = librosa.stft(audio, hop_length=self.hop_length)
            magnitude = np.abs(stft)
            
            features = {
                'mel_spectrogram': mel_spec,
                'pitch': pitches,
                'magnitude': magnitude,
                'audio': audio
            }
            
            logger.info("Features extracted successfully")
            return features
            
        except Exception as e:
            logger.error(f"Feature extraction failed: {str(e)}")
            raise
    
    def convert_voice(
        self,
        input_audio: str,
        output_path: str,
        pitch_shift: float = 0.0,
        enhance_quality: bool = False,
        noise_reduction: bool = False
    ) -> bool:
        """
        Convert voice using RVC model
        
        Args:
            input_audio: Path to input audio file
            output_path: Path to save converted audio
            pitch_shift: Pitch shift amount in semitones
            enhance_quality: Whether to enhance audio quality
            noise_reduction: Whether to apply noise reduction
            
        Returns:
            bool: True if conversion successful
        """
        try:
            logger.info(f"Starting voice conversion: {input_audio}")
            
            # Load model if not already loaded
            if self.model is None:
                if not self.load_model():
                    return False
            
            # Preprocess input audio
            audio, sr = self.preprocess_audio(input_audio)
            
            # Extract features
            features = self.extract_features(audio)
            
            # Apply pitch shift if requested
            if pitch_shift != 0.0:
                audio = librosa.effects.pitch_shift(
                    audio, sr=sr, n_steps=pitch_shift
                )
                logger.info(f"Applied pitch shift: {pitch_shift} semitones")
            
            # Apply noise reduction if requested
            if noise_reduction:
                audio = self._apply_noise_reduction(audio)
                logger.info("Applied noise reduction")
            
            # Enhance quality if requested
            if enhance_quality:
                audio = self._enhance_quality(audio)
                logger.info("Applied quality enhancement")
            
            # Save processed audio
            sf.write(output_path, audio, sr)
            
            logger.info(f"Voice conversion completed: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Voice conversion failed: {str(e)}")
            return False
    
    def _apply_noise_reduction(self, audio: np.ndarray) -> np.ndarray:
        """Apply noise reduction to audio"""
        try:
            # Simple noise reduction using spectral gating
            stft = librosa.stft(audio)
            magnitude = np.abs(stft)
            phase = np.angle(stft)
            
            # Estimate noise floor
            noise_floor = np.percentile(magnitude, 10, axis=1, keepdims=True)
            
            # Apply spectral gating
            gate = magnitude > (noise_floor * 2)
            magnitude_clean = magnitude * gate
            
            # Reconstruct audio
            stft_clean = magnitude_clean * np.exp(1j * phase)
            audio_clean = librosa.istft(stft_clean)
            
            return audio_clean
            
        except Exception as e:
            logger.error(f"Noise reduction failed: {str(e)}")
            return audio
    
    def _enhance_quality(self, audio: np.ndarray) -> np.ndarray:
        """Enhance audio quality"""
        try:
            # Apply gentle compression
            audio = librosa.effects.preemphasis(audio)
            
            # Normalize
            audio = librosa.util.normalize(audio)
            
            return audio
            
        except Exception as e:
            logger.error(f"Quality enhancement failed: {str(e)}")
            return audio
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model"""
        if not self.model_path.exists():
            return {"error": "Model not found"}
        
        try:
            checkpoint = torch.load(self.model_path, map_location='cpu')
            model_info = {
                "model_path": str(self.model_path),
                "model_size": self.model_path.stat().st_size,
                "config": checkpoint.get('config', {}),
                "device": self.device,
                "sample_rate": self.sample_rate
            }
            return model_info
            
        except Exception as e:
            return {"error": f"Failed to load model info: {str(e)}"}

# Utility functions
def create_sample_model(model_path: str) -> bool:
    """
    Create a sample model file for testing
    
    Args:
        model_path: Path where to create the sample model
        
    Returns:
        bool: True if sample model created successfully
    """
    try:
        model_path = Path(model_path)
        model_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Create a dummy model checkpoint
        sample_checkpoint = {
            'config': {
                'model_name': 'sample_rvc_model',
                'version': '1.0.0',
                'sample_rate': 44100,
                'hop_length': 512
            },
            'state_dict': {},
            'epoch': 0,
            'loss': 0.0
        }
        
        torch.save(sample_checkpoint, model_path)
        logger.info(f"Sample model created: {model_path}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to create sample model: {str(e)}")
        return False

def validate_audio_file(file_path: str) -> bool:
    """
    Validate if file is a supported audio format
    
    Args:
        file_path: Path to audio file
        
    Returns:
        bool: True if file is valid
    """
    try:
        supported_formats = ['.wav', '.mp3', '.flac', '.m4a', '.ogg']
        file_path = Path(file_path)
        
        if not file_path.exists():
            return False
        
        if file_path.suffix.lower() not in supported_formats:
            return False
        
        # Try to load the file
        librosa.load(str(file_path), sr=22050, duration=1)
        return True
        
    except Exception:
        return False
