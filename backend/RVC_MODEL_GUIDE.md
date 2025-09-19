# RVC Model Files Guide

## Understanding RVC Model Files

When you download a voice model from voice-models.com, you typically get a `.zip` file containing two important files:

### 1. `.pth` File (PyTorch Model)
- **Purpose**: Contains the trained neural network weights for voice conversion
- **Usage**: This is the main model file that performs the actual voice cloning
- **Format**: PyTorch serialized model file
- **Size**: Usually 100-500MB depending on model complexity

### 2. `.index` File (Feature Index)
- **Purpose**: Contains pre-computed voice features for faster inference
- **Usage**: Helps the model find the best matching voice characteristics
- **Format**: Binary index file with voice feature embeddings
- **Size**: Usually 1-10MB

## How RVC-Wiz Handles These Files

### Download Process
1. **Download**: Gets the `.zip` file from voice-models.com
2. **Extract**: Automatically extracts both `.pth` and `.index` files
3. **Store**: Saves both files in the models directory
4. **Database**: Records both file paths in the database

### File Structure
```
backend/models/
├── 1/                          # Model ID directory
│   ├── Rick_Sanchez_Model.pth  # Main model file
│   └── Rick_Sanchez_Model.index # Feature index file
├── 2/
│   ├── Another_Model.pth
│   └── Another_Model.index
└── ...
```

## Using Models for Voice Cloning

### Voice-Clone Page Integration
The voice-clone page can use these models in two ways:

1. **Audio-to-Audio Conversion**: 
   - Upload an audio file
   - Select a downloaded model
   - Convert the voice using the `.pth` model

2. **Text-to-Speech with Voice Cloning**:
   - Enter text to convert
   - Select a downloaded model
   - Generate speech in the target voice

### Model Requirements
- Both `.pth` and `.index` files must be present
- Model must be marked as `is_downloaded = true` in database
- Files must be accessible via the `local_path` and `index_path`

## API Endpoints for Model Usage

### Get Downloaded Models
```http
GET /api/voice-models/local/downloaded
```

Response includes:
```json
{
  "success": true,
  "models": [
    {
      "id": 1,
      "name": "Rick Sanchez Model",
      "local_path": "/path/to/model.pth",
      "index_path": "/path/to/model.index",
      "is_downloaded": true
    }
  ]
}
```

### Use Model for Processing
```http
POST /api/process
{
  "model_name": "Rick Sanchez Model",
  "input_file": "audio.wav",
  "enhance_quality": true
}
```

## Current Implementation Status

### ✅ Implemented
- Download and extract `.zip` files
- Store both `.pth` and `.index` files
- Database tracking of both file paths
- API endpoints for model management

### 🔄 In Progress
- RVC processing engine (currently placeholder)
- Voice-clone page integration
- Audio processing pipeline

### 📋 Next Steps
1. Implement actual RVC inference using PyTorch
2. Integrate with voice-clone page
3. Add audio format conversion
4. Implement real-time processing

## Technical Details

### PyTorch Model Loading
```python
import torch

# Load the model
model = torch.load('model.pth', map_location='cpu')
model.eval()

# Use for inference
with torch.no_grad():
    output = model(input_audio)
```

### Index File Usage
The `.index` file is used for:
- Faster feature matching
- Voice similarity search
- Optimized inference pipeline

## Troubleshooting

### Common Issues
1. **Missing .index file**: Model will still work but may be slower
2. **Corrupted .pth file**: Download again or check file integrity
3. **Permission errors**: Ensure proper file permissions on model files

### File Validation
```python
import os
from pathlib import Path

def validate_model_files(model_path, index_path):
    """Validate that model files exist and are accessible"""
    return (
        os.path.exists(model_path) and 
        os.path.exists(index_path) and
        os.path.getsize(model_path) > 0 and
        os.path.getsize(index_path) > 0
    )
```
