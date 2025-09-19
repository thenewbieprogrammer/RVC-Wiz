# RVC-Wiz Backend

This is the backend API for the RVC-Wiz voice cloning platform, built with FastAPI and SQLite.

## Project Structure

```
backend/
├── app/                    # Main application package
│   ├── api/               # API endpoints
│   │   ├── auth.py        # Authentication endpoints
│   │   └── voice_models.py # Voice models API endpoints
│   ├── core/              # Core configuration and utilities
│   │   ├── config.py      # Application settings
│   │   └── security.py    # Authentication and security utilities
│   ├── db/                # Database configuration
│   │   ├── base.py        # SQLAlchemy base
│   │   ├── database.py    # Database connection
│   │   └── init_db.py     # Database initialization
│   ├── models/            # Database models
│   │   └── user.py        # User model
│   ├── schemas/           # Pydantic schemas
│   │   └── user.py        # User schemas
│   ├── services/          # Business logic services
│   │   ├── rvc_processor.py # RVC audio processing
│   │   └── voice_models.py  # Voice models service
│   └── main.py            # FastAPI application
├── main.py                # Application entry point
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Features

- **Authentication**: JWT-based authentication with SQLite database
- **Voice Models**: Integration with voice-models.com API
- **Model Downloads**: Download voice models from voice-models.com with progress tracking
- **Audio Processing**: RVC voice cloning processing
- **Text-to-Speech**: TTS functionality with voice models
- **File Management**: Audio file upload and download
- **Background Processing**: Asynchronous download and processing tasks
- **Real-time Status**: Download progress tracking and status updates

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application**:
   ```bash
   python main.py
   ```

3. **Access the API**:
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Test User

A test user is automatically created for development:
- **Email**: test@rvcwiz.com
- **Password**: password123
- **Username**: testuser

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Voice Models
- `GET /api/voice-models/top` - Get top voice models
- `GET /api/voice-models/search` - Search voice models
- `GET /api/voice-models/rick-sanchez` - Get Rick Sanchez models
- `GET /api/voice-models/featured` - Get featured models
- `GET /api/voice-models/categories` - Get model categories
- `GET /api/voice-models/local` - Get local models from database
- `GET /api/voice-models/local/downloaded` - Get downloaded models
- `POST /api/voice-models/sync` - Sync models from voice-models.com
- `POST /api/voice-models/download/{model_id}` - Download a specific model
- `GET /api/voice-models/download-status/{model_id}` - Get download status
- `DELETE /api/voice-models/{model_id}` - Delete a model
- `GET /api/voice-models/stats` - Get model statistics

### Audio Processing
- `POST /api/upload` - Upload audio file
- `POST /api/process` - Process audio with RVC
- `POST /api/text-to-speech` - Convert text to speech
- `GET /api/status/{task_id}` - Get processing status
- `GET /api/download/{filename}` - Download processed audio

## Database

The application uses SQLite for development. The database file (`rvc_wiz.db`) is created automatically when the application starts.

## Configuration

Configuration is managed through environment variables and the `app/core/config.py` file. Key settings include:

- `SECRET_KEY`: JWT secret key
- `DATABASE_URL`: Database connection string
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

## Development

The backend is organized following FastAPI best practices with:
- Modular structure with separate packages
- Dependency injection for database sessions
- Proper error handling and logging
- Type hints throughout
- Pydantic models for request/response validation
