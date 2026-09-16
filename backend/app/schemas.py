from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Authentication Schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuth(BaseModel):
    id_token: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None
    is_google_user: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Course Schemas
class CourseCategoryResponse(BaseModel):
    id: int
    name: str
    icon: Optional[str]
    description: Optional[str]

class CourseResponse(BaseModel):
    id: int
    name: str
    description: str
    difficulty: str
    duration_hours: int
    category_id: int