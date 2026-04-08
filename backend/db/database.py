from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

#DATABASE_URL = "postgresql://postgres@localhost:5432/stressdb"
DATABASE_URL = "postgresql://postgres:gokul2402@localhost:5432/stress_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()