from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: str
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Response schemas
class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserResponse] = None
    token: Optional[str] = None

# Processing schemas
class ProcessingRequest(BaseModel):
    audio_file: str
    model_name: str
    user_id: int

class ProcessingStatus(BaseModel):
    id: str
    status: str  # "pending", "processing", "completed", "failed"
    progress: int  # 0-100
    message: Optional[str] = None
    result_file: Optional[str] = None
    created_at: datetime
    updated_at: datetime