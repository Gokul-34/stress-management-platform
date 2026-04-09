import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from backend.core.config import settings

# Use DATABASE_URL from centralized settings
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()