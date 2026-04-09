import os
from dotenv import load_dotenv

# Load environment variables from a .env file if it exists
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Stress Monitoring System"
    
    # Database
    _db_url = os.getenv("DATABASE_URL", "postgresql://postgres:gokul2402@localhost:5432/stress_db")
    if _db_url.startswith("postgres://"):
        _db_url = _db_url.replace("postgres://", "postgresql://", 1)
    DATABASE_URL: str = _db_url
    
    # JWT Config
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-for-development")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Integrations
    GAS_URL: str = os.getenv(
        "GAS_URL", 
        "https://script.google.com/macros/s/AKfycbxJNtzrt4qD7Vck04DrZkNr7v735QSY6vrJwD8GjBtuv4GQggvAPqdDEcceSpebgIIUmw/exec"
    )

settings = Settings()
