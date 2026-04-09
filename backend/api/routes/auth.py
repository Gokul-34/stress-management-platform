from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.core.config import settings
from backend.core.security import verify_password, get_password_hash, create_access_token

from backend.db.models import User
from backend.schemas.user import UserCreate, UserResponse

from backend.utils.otp import generate_otp
from backend.utils.email import send_otp_email

router = APIRouter(prefix="/auth", tags=["auth"])


# ================= SIGNUP (SEND OTP) =================
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Convert data
    user_data = user_in.dict()
    password = user_data.pop("password")

    # 🔐 Hash password
    hashed_password = get_password_hash(password)

    # 🔢 Generate OTP
    otp = generate_otp()

    # 👤 Create user (NOT verified yet)
    db_user = User(
        **user_data,
        hashed_password=hashed_password,
        otp=otp,
        otp_expiry=datetime.utcnow() + timedelta(minutes=5),
        is_verified=False
    )

    db.add(db_user)

    # 📧 Send OTP email inside a try block
    try:
        send_otp_email(db_user.email, otp)
        db.commit() # Only commit if email was successfully sent!
        return {
            "message": "OTP sent to your email. Please verify to continue."
        }
    except Exception as e:
        db.rollback() # Rollback user creation
        print("Error sending OTP email:", e)
        raise HTTPException(status_code=500, detail="Failed to send OTP email. Please check backend logs or use a different email.")


# ================= VERIFY OTP =================
@router.post("/verify-otp")
def verify_otp(email: str, otp: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        return {"message": "User already verified"}

    if user.otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > user.otp_expiry:
        raise HTTPException(status_code=400, detail="OTP expired")

    # ✅ Mark verified
    user.is_verified = True
    user.otp = None
    user.otp_expiry = None

    db.commit()

    return {"message": "Email verified successfully"}


# ================= LOGIN =================
@router.post("/login")
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):

    user = db.query(User).filter(User.email == form_data.username).first()

    # ❌ Wrong credentials
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 🔒 BLOCK if not verified
    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email using OTP before login"
        )

    # 🔐 Generate token
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    access_token = create_access_token(
        data={"email": str(user.email)},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    }