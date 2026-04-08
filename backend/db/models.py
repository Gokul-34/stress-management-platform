from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base


# ================= USER TABLE =================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

    # 🔐 OTP VERIFICATION FIELDS
    is_verified = Column(Boolean, default=False)
    otp = Column(String, nullable=True)
    otp_expiry = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # 🔗 RELATIONSHIP
    records = relationship("StressRecord", back_populates="owner")


# ================= STRESS TABLE =================
class StressRecord(Base):
    __tablename__ = "stress_records"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    sleep_duration = Column(Float, nullable=False)
    work_hours = Column(Float, nullable=False)
    mood_level = Column(Float, nullable=False)
    screen_time = Column(Float, nullable=False)
    physical_activity = Column(Float, nullable=False)
    heart_rate = Column(Float, nullable=False)
    spo2 = Column(Float, nullable=False)

    predicted_stress_level = Column(String, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # 🔗 RELATIONSHIP
    owner = relationship("User", back_populates="records")