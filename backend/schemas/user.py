from pydantic import BaseModel, EmailStr
from datetime import datetime


# 🔹 Base user schema
class UserBase(BaseModel):
    email: EmailStr
    name: str


# 🔹 For user registration
class UserCreate(UserBase):
    password: str


# 🔹 Response schema (what frontend receives)
class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True