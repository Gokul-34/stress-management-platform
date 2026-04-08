from pydantic import BaseModel
from typing import Optional
from backend.schemas.user import UserResponse


# 🔐 Token returned after login
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# 🔐 Token payload (inside JWT)
class TokenData(BaseModel):
    email: Optional[str] = None