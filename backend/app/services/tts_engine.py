import os
import io
import logging
import asyncio
import threading
from typing import Dict, Any, Optional, Tuple
import numpy as np
import soundfile as sf
from pathlib import Path
import tempfile

logger = logging.getLogger(__name__)

class TTSEngine:
    """Text-to-Speech Engine with multiple backends"""
    
    def __init__(self):
        self.engines = {}
        self._initialize_engines()
    
    def _initialize_engines(self):
        """Initialize available TTS engines"""
        # Prioritize gTTS (more reliable)
        try:
            # Try to initialize gTTS (online) first
            from gtts import gTTS
            self.engines['gtts'] = gTTS
            logger.info("Initialized gTTS engine")
        except ImportError:
            logger.warning("gTTS not available")
        
        try:
            # Try to initialize pyttsx3 (offline) as fallback
            import pyttsx3
            self.engines['pyttsx3'] = pyttsx3.init()
            logger.info("Initialized pyttsx3 TTS engine")
        except ImportError:
            logger.warning("pyttsx3 not available")
    
    async def text_to_speech(
        self, 
        text: str, 
        language: str = 'en',
        engine: str = 'gtts',
        voice_id: Optional[str] = None
    ) -> Tuple[np.ndarray, int]:
        """Convert text to speech"""
        try:
            logger.info(f"Converting text to speech: {text[:50]}...")
            logger.info(f"Using TTS engine: {engine}")
            
            if engine == 'gtts' and 'gtts' in self.engines:
                logger.info("Using gTTS engine")
                return await self._tts_gtts(text, language)
            elif engine == 'pyttsx3' and 'pyttsx3' in self.engines:
                logger.info("Using pyttsx3 engine")
                try:
                    return await self._tts_pyttsx3(text, voice_id)
                except Exception as e:
                    logger.warning(f"pyttsx3 failed, trying gTTS fallback: {e}")
                    if 'gtts' in self.engines:
                        logger.info("Falling back to gTTS")
                        return await self._tts_gtts(text, language)
                    else:
                        raise
            else:
                # If requested engine is not available, try gTTS first, then pyttsx3
                logger.warning(f"Requested engine '{engine}' not available, trying fallbacks")
                if 'gtts' in self.engines:
                    logger.info("Trying gTTS as fallback")
                    return await self._tts_gtts(text, language)
                elif 'pyttsx3' in self.engines:
                    logger.info("Trying pyttsx3 as fallback")
                    return await self._tts_pyttsx3(text, voice_id)
                else:
                    raise ValueError(f"No TTS engines available")
                
        except Exception as e:
            logger.error(f"TTS conversion failed: {e}")
            raise
    
    async def _tts_pyttsx3(self, text: str, voice_id: Optional[str] = None) -> Tuple[np.ndarray, int]:
        """Convert text to speech using pyttsx3"""
        engine = None
        temp_path = None
        
        try:
            # Create a new engine instance for each request to avoid hanging
            import pyttsx3
            engine = pyttsx3.init()
            
            # Set voice based on voice_id parameter
            voices = engine.getProperty('voices')
            
            if voice_id == "female":
                # Look for female voices
                female_voice_found = False
                for voice in voices:
                    if any(keyword in voice.name.lower() for keyword in ['female', 'woman', 'zira', 'hazel', 'susan']):
                        engine.setProperty('voice', voice.id)
                        logger.info(f"Using female voice: {voice.name}")
                        female_voice_found = True
                        break
                
                if not female_voice_found:
                    logger.info("No female voice found, using default voice")
                    
            elif voice_id == "male":
                # Look for male voices
                male_voice_found = False
                for voice in voices:
                    if any(keyword in voice.name.lower() for keyword in ['male', 'man', 'david', 'mark', 'richard']):
                        engine.setProperty('voice', voice.id)
                        logger.info(f"Using male voice: {voice.name}")
                        male_voice_found = True
                        break
                
                if not male_voice_found:
                    logger.info("No male voice found, using default voice")
                    
            elif voice_id:
                # Specific voice ID provided
                for voice in voices:
                    if voice_id in voice.id:
                        engine.setProperty('voice', voice.id)
                        logger.info(f"Using specified voice: {voice.name}")
                        break
            else:
                # No voice specified, use default
                logger.info("Using default voice")
            
            # Set speech rate and volume
            engine.setProperty('rate', 150)  # Speed of speech
            engine.setProperty('volume', 0.9)  # Volume level (0.0 to 1.0)
            
            # Create temporary file for audio output
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                temp_path = temp_file.name
            
            # Run TTS in thread to avoid blocking with improved cleanup
            def run_tts():
                try:
                    engine.save_to_file(text, temp_path)
                    engine.runAndWait()
                except Exception as e:
                    logger.error(f"TTS engine error: {e}")
                    raise
                finally:
                    # Comprehensive cleanup
                    try:
                        engine.stop()
                    except:
                        pass
                    try:
                        engine.endLoop()
                    except:
                        pass
            
            # Execute in thread with shorter timeout to prevent hanging
            loop = asyncio.get_event_loop()
            try:
                await asyncio.wait_for(
                    loop.run_in_executor(None, run_tts),
                    timeout=10.0  # Reduced timeout to 10 seconds to prevent hanging
                )
            except asyncio.TimeoutError:
                logger.error("TTS generation timed out after 10 seconds")
                # Clean up temp file if it exists
                if temp_path and os.path.exists(temp_path):
                    os.unlink(temp_path)
                raise RuntimeError("TTS generation timed out")
            
            # Load the generated audio
            if temp_path and os.path.exists(temp_path):
                audio, sr = sf.read(temp_path)
                os.unlink(temp_path)  # Clean up temp file
                
                # Convert to mono if stereo
                if len(audio.shape) > 1:
                    audio = np.mean(audio, axis=1)
                
                return audio, sr
            else:
                raise RuntimeError("TTS failed to generate audio file")
                
        except Exception as e:
            logger.error(f"pyttsx3 TTS failed: {e}")
            # Clean up resources
            if temp_path and os.path.exists(temp_path):
                try:
                    os.unlink(temp_path)
                except:
                    pass
            if engine:
                try:
                    engine.stop()
                except:
                    pass
                try:
                    engine.endLoop()
                except:
                    pass
            raise
    
    async def _tts_gtts(self, text: str, language: str = 'en') -> Tuple[np.ndarray, int]:
        """Convert text to speech using Google TTS"""
        try:
            from gtts import gTTS
            import pygame
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_file:
                temp_path = temp_file.name
            
            # Generate speech
            tts = gTTS(text=text, lang=language, slow=False)
            tts.save(temp_path)
            
            # Convert MP3 to WAV and load
            audio, sr = self._convert_mp3_to_wav(temp_path)
            
            # Clean up
            os.unlink(temp_path)
            
            return audio, sr
            
        except Exception as e:
            logger.error(f"gTTS failed: {e}")
            raise
    
    def _convert_mp3_to_wav(self, mp3_path: str) -> Tuple[np.ndarray, int]:
        """Convert MP3 to WAV format"""
        try:
            # Use pydub to convert MP3 to WAV
            from pydub import AudioSegment
            
            # Load MP3
            audio_segment = AudioSegment.from_mp3(mp3_path)
            
            # Convert to numpy array
            audio = np.array(audio_segment.get_array_of_samples())
            
            # Convert to mono if stereo
            if audio_segment.channels == 2:
                audio = audio.reshape((-1, 2))
                audio = np.mean(audio, axis=1)
            
            # Normalize
            audio = audio.astype(np.float32) / (2**15)
            
            return audio, audio_segment.frame_rate
            
        except Exception as e:
            logger.error(f"MP3 to WAV conversion failed: {e}")
            raise
    
    def get_available_voices(self) -> Dict[str, list]:
        """Get available voices for each engine"""
        voices = {}
        
        if 'pyttsx3' in self.engines:
            try:
                engine = self.engines['pyttsx3']
                pyttsx3_voices = []
                for voice in engine.getProperty('voices'):
                    pyttsx3_voices.append({
                        'id': voice.id,
                        'name': voice.name,
                        'languages': voice.languages
                    })
                voices['pyttsx3'] = pyttsx3_voices
            except Exception as e:
                logger.warning(f"Could not get pyttsx3 voices: {e}")
        
        if 'gtts' in self.engines:
            # gTTS supports many languages
            voices['gtts'] = [
                {'id': 'en', 'name': 'English', 'languages': ['en']},
                {'id': 'es', 'name': 'Spanish', 'languages': ['es']},
                {'id': 'fr', 'name': 'French', 'languages': ['fr']},
                {'id': 'de', 'name': 'German', 'languages': ['de']},
                {'id': 'it', 'name': 'Italian', 'languages': ['it']},
                {'id': 'pt', 'name': 'Portuguese', 'languages': ['pt']},
                {'id': 'ru', 'name': 'Russian', 'languages': ['ru']},
                {'id': 'ja', 'name': 'Japanese', 'languages': ['ja']},
                {'id': 'ko', 'name': 'Korean', 'languages': ['ko']},
                {'id': 'zh', 'name': 'Chinese', 'languages': ['zh']},
            ]
        
        return voices
    
    def get_engine_info(self) -> Dict[str, Any]:
        """Get information about available engines"""
        return {
            'available_engines': list(self.engines.keys()),
            'voices': self.get_available_voices()
        }
