from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.deps import get_db, get_current_user
from db.models import User, StressRecord
from schemas.stress import StressDataCreate, StressRecordResponse, InsightResponse
from services.ml_service import ml_service

router = APIRouter(prefix="/stress", tags=["stress"])


# ✅ Add stress data (USER SPECIFIC)
@router.post("/data", response_model=StressRecordResponse, status_code=status.HTTP_201_CREATED)
def add_stress_data(
    data: StressDataCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prediction = ml_service.predict_stress_level(data)

    db_record = StressRecord(
        user_id=current_user.id,
        sleep_duration=data.sleep_duration,
        work_hours=data.work_hours,
        mood_level=data.mood_level,
        screen_time=data.screen_time,
        physical_activity=data.physical_activity,
        heart_rate=data.heart_rate,
        spo2=data.spo2,
        predicted_stress_level=prediction
    )

    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return db_record


# ✅ Get ONLY current user history
@router.get("/history", response_model=List[StressRecordResponse])
def get_user_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    records = (
        db.query(StressRecord)
        .filter(StressRecord.user_id == current_user.id)
        .order_by(StressRecord.created_at.desc())
        .all()
    )

    return records


# 🔥 UPDATED: Get ALL users data (for comparison graph)
@router.get("/all")
def get_all_records(db: Session = Depends(get_db)):

    records = (
        db.query(StressRecord)
        .order_by(StressRecord.created_at.desc())
        .all()
    )

    return [
        {
            "user_id": r.user_id,
            "sleep_duration": r.sleep_duration,
            "work_hours": r.work_hours,
            "mood_level": r.mood_level,
            "screen_time": r.screen_time,
            "physical_activity": r.physical_activity,
            "heart_rate": r.heart_rate,
            "spo2": r.spo2,
            "stress_level": r.predicted_stress_level,
            "date": r.created_at.isoformat()
        }
        for r in records
    ]


# ✅ Insights (based on latest user data)
@router.get("/insights", response_model=InsightResponse)
def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    latest_record = (
        db.query(StressRecord)
        .filter(StressRecord.user_id == current_user.id)
        .order_by(StressRecord.created_at.desc())
        .first()
    )

    if not latest_record:
        raise HTTPException(
            status_code=404,
            detail="No stress records found to generate insights."
        )

    data = StressDataCreate(
        sleep_duration=latest_record.sleep_duration,
        work_hours=latest_record.work_hours,
        mood_level=latest_record.mood_level,
        screen_time=latest_record.screen_time,
        physical_activity=latest_record.physical_activity,
        heart_rate=latest_record.heart_rate,
        spo2=latest_record.spo2
    )

    insights = ml_service.generate_insights(
        latest_record.predicted_stress_level,
        data
    )

    return insights