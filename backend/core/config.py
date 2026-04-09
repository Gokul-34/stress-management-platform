import os

class Settings:
    PROJECT_NAME: str = "Stress Monitoring System"
    # Switch to SQLite for instant local testing without needing PostgreSQL installed
    _db_url = os.getenv("DATABASE_URL", "postgresql://postgres:gokul2402@localhost:5432/stress_db")
    if _db_url.startswith("postgres://"):
        _db_url = _db_url.replace("postgres://", "postgresql://", 1)
    DATABASE_URL: str = _db_url
    
    # JWT Config
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-for-development")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()
