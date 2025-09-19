import os
from typing import Optional

class Settings:
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "RVC-Wiz"
    VERSION: str = "1.0.0"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./rvc_wiz.db")
    
    # CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    OUTPUT_DIR: str = "outputs"
    MODELS_DIR: str = "models"
    
    # Voice Models API
    VOICE_MODELS_BASE_URL: str = "https://voice-models.com"

settings = Settings()
