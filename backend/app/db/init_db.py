from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db.base import Base
from app.models.user import User
from app.models.voice_model import VoiceModel
from app.core.security import get_password_hash
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)

def create_test_user():
    """Create a hardcoded test user for development"""
    db = SessionLocal()
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == "test@rvcwiz.com").first()
        if existing_user:
            logger.info("Test user already exists")
            return existing_user
        
        # Create test user
        test_user = User(
            email="test@rvcwiz.com",
            username="testuser",
            hashed_password=get_password_hash("password123"),
            full_name="Test User",
            is_active=True,
            is_verified=True
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        logger.info(f"Created test user: {test_user.email}")
        return test_user
        
    except Exception as e:
        logger.error(f"Error creating test user: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def init_database():
    """Initialize the database with tables and test data"""
    try:
        # Create all tables
        create_tables()
        logger.info("Database tables created successfully")
        
        # Create test user
        create_test_user()
        logger.info("Database initialization completed successfully")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

if __name__ == "__main__":
    init_database()
