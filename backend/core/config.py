import os

class Settings:
    PROJECT_NAME: str = "Stress Monitoring System"
    # Switch to SQLite for instant local testing without needing PostgreSQL installed
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:gokul2402@localhost:5432/stress_db")
    
    # JWT Config
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-for-development")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()
