#!/usr/bin/env python3

import os
import sys
import logging
import torch
import numpy as np
import soundfile as sf
from pathlib import Path
from typing import Optional, Tuple, Dict, Any

# Add the RVC infer_pack to the path
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

# Import the models directly
from infer_pack.models import (
    SynthesizerTrnMs256NSFsid,
    SynthesizerTrnMs256NSFsid_nono,
    SynthesizerTrnMs768NSFsid,
    SynthesizerTrnMs768NSFsid_nono,
)

# Import audio loading function
def load_audio(audio_path: str, sr: int = 16000) -> Tuple[np.ndarray, int]:
    """Load audio file using librosa"""
    import librosa
    audio, sample_rate = librosa.load(audio_path, sr=sr)
    return audio, sample_rate

logger = logging.getLogger(__name__)

class RVCProcessor:
    """Proper RVC Voice Conversion Processor"""
    
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.loaded_models: Dict[str, Dict[str, Any]] = {}
        self.hubert_model = None
        
        logger.info(f"RVC Processor initialized on device: {self.device}")
    
    def load_rvc_model(self, model_path: str, index_path: Optional[str] = None) -> Dict[str, Any]:
        """Load RVC model using the official method"""
        try:
            logger.info(f"Loading RVC model: {model_path}")
            
            # Check if model is already loaded
            if model_path in self.loaded_models:
                logger.info(f"Model already loaded: {model_path}")
                return self.loaded_models[model_path]
            
            # Load the checkpoint using official RVC method
            cpt = torch.load(model_path, map_location="cpu")
            
            # Extract model information
            tgt_sr = cpt["config"][-1]
            cpt["config"][-3] = cpt["weight"]["emb_g.weight"].shape[0]  # n_spk
            if_f0 = cpt.get("f0", 1)
            version = cpt.get("version", "v1")
            
            logger.info(f"Model info - Version: {version}, F0: {if_f0}, Sample Rate: {tgt_sr}")
            
            # Select the correct synthesizer class
            synthesizer_class = {
                ("v1", 1): SynthesizerTrnMs256NSFsid,
                ("v1", 0): SynthesizerTrnMs256NSFsid_nono,
                ("v2", 1): SynthesizerTrnMs768NSFsid,
                ("v2", 0): SynthesizerTrnMs768NSFsid_nono,
            }
            
            net_g = synthesizer_class[(version, if_f0)](*cpt["config"]).to(self.device)
            net_g.load_state_dict(cpt["weight"], strict=False)
            net_g.eval()
            
            # Load index file if available
            index = None
            big_npy = None
            if index_path and os.path.exists(index_path):
                try:
                    import faiss
                    index = faiss.read_index(index_path)
                    big_npy = index.reconstruct_n(0, index.ntotal)
                    logger.info(f"Loaded FAISS index: {index_path}")
                except Exception as e:
                    logger.warning(f"Failed to load index file: {e}")
            
            # Store model info
            model_info = {
                "net_g": net_g,
                "cpt": cpt,
                "tgt_sr": tgt_sr,
                "if_f0": if_f0,
                "version": version,
                "index": index,
                "big_npy": big_npy,
                "config": cpt["config"]
            }
            
            self.loaded_models[model_path] = model_info
            logger.info(f"Successfully loaded RVC model: {model_path}")
            
            return model_info
            
        except Exception as e:
            logger.error(f"Failed to load RVC model {model_path}: {e}")
            raise
    
    def process_audio_with_rvc(
        self, 
        audio_path: str, 
        model_path: str, 
        index_path: Optional[str] = None,
        enhance_quality: bool = True,
        noise_reduction: bool = True,
        pitch_shift: int = 0
    ) -> Tuple[np.ndarray, int]:
        """Process audio with RVC model"""
        try:
            logger.info(f"Processing audio with RVC: {audio_path}")
            
            # Load the model
            model_info = self.load_rvc_model(model_path, index_path)
            net_g = model_info["net_g"]
            tgt_sr = model_info["tgt_sr"]
            if_f0 = model_info["if_f0"]
            version = model_info["version"]
            index = model_info["index"]
            big_npy = model_info["big_npy"]
            
            # Load audio
            audio, sr = load_audio(audio_path, 16000)
            
            # For now, return the original audio with proper sample rate
            # TODO: Implement full RVC inference pipeline
            logger.info("RVC processing completed (placeholder implementation)")
            
            # Resample to target sample rate
            if sr != tgt_sr:
                import librosa
                audio = librosa.resample(audio, orig_sr=sr, target_sr=tgt_sr)
                sr = tgt_sr
            
            return audio, sr
            
        except Exception as e:
            logger.error(f"RVC processing failed: {e}")
            raise
    
    def cleanup(self):
        """Clean up loaded models"""
        for model_path, model_info in self.loaded_models.items():
            if "net_g" in model_info:
                del model_info["net_g"]
        self.loaded_models.clear()
        logger.info("RVC models cleaned up")
