from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# 🔹 Input from frontend (NO user_id here)
class StressDataCreate(BaseModel):
    sleep_duration: float
    work_hours: float
    mood_level: float
    screen_time: float
    physical_activity: float
    heart_rate: float
    spo2: float


# 🔹 Response schema (includes user_id internally)
class StressRecordResponse(StressDataCreate):
    id: int
    user_id: int
    predicted_stress_level: str
    created_at: datetime

    class Config:
        from_attributes = True


# 🔹 AI Insight response
class InsightResponse(BaseModel):
    summary: str
    recommendations: List[str]
    latest_stress_level: Optional[str] = None