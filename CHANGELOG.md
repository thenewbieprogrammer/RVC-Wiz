# Changelog

All notable changes to RVC-Wiz will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced voice conversion fallback system for RVC models
- Improved TTS engine reliability with gTTS prioritization
- Better error handling and logging throughout the application
- Comprehensive RVC model loading and processing pipeline

### Changed
- **BREAKING**: TTS engine now prioritizes gTTS over pyttsx3 for better reliability
- Reduced pyttsx3 timeout from 30s to 10s to prevent hanging
- Enhanced voice conversion now provides better character voice simulation
- Improved RVC model inference with proper feature extraction

### Fixed
- Fixed TTS engine hanging issue on second request
- Resolved RVC model matrix multiplication errors
- Fixed virtual environment package installation issues
- Improved audio processing pipeline reliability
- Fixed pyttsx3 engine cleanup and resource management

### Technical Improvements
- Implemented proper HuBERT-style feature extraction for RVC models
- Added graceful fallback from RVC models to enhanced voice conversion
- Improved sequence length matching between phone and pitch features
- Enhanced error handling in RVC inference pipeline
- Better TTS engine initialization and cleanup

### Dependencies
- Added faiss-cpu for RVC index file support
- Improved gTTS integration for online TTS
- Enhanced pyttsx3 fallback handling

## [Previous Versions]

### Initial Release
- Basic RVC model loading and processing
- TTS integration with pyttsx3
- Voice model management system
- Audio processing pipeline
