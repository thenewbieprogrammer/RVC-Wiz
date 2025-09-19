from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from sqlalchemy.sql import func
from app.db.base import Base

class VoiceModel(Base):
    __tablename__ = "voice_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    character = Column(String(255), nullable=False)
    description = Column(Text)
    
    # URLs and paths
    download_url = Column(String(500))
    huggingface_url = Column(String(500))
    model_url = Column(String(500))
    local_path = Column(String(500))  # Path to downloaded .pth model file
    index_path = Column(String(500))  # Path to downloaded .index file
    
    # Model metadata
    size = Column(String(50))  # e.g., "245 MB"
    size_bytes = Column(Integer)  # Size in bytes
    epochs = Column(Integer, default=0)
    model_type = Column(String(50), default="RVC")  # RVC, RVCv2, etc.
    tags = Column(Text)  # JSON string of tags
    
    # Download status
    is_downloaded = Column(Boolean, default=False)
    download_progress = Column(Float, default=0.0)  # 0.0 to 1.0
    download_error = Column(Text)  # Error message if download failed
    
    # Usage tracking
    download_count = Column(Integer, default=0)
    last_used = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<VoiceModel(id={self.id}, name='{self.name}', character='{self.character}')>"
