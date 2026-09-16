from pydantic import BaseModel, EmailStr
from typing import Optional, List
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

# Course Detail Schemas
class CourseDetailResponse(BaseModel):
    id: int
    name: str
    description: str
    difficulty: str
    duration_hours: int
    category_id: int

class EnrollCourseRequest(BaseModel):
    course_id: int
    pace: str  # slow, medium, advanced
    programming_language: Optional[str] = None

class EnrollCourseResponse(BaseModel):
    success: bool
    message: str
    user_course_id: int

# Roadmap Schemas
class RoadmapGenerateRequest(BaseModel):
    user_course_id: int
    hours_per_day: int = 2
    days_per_week: int = 5
    total_weeks: int = 8

class RoadmapDayResponse(BaseModel):
    id: int
    day_number: int
    week_number: int
    topic: str
    subtopics: Optional[str] = None
    video_title: Optional[str] = None
    video_youtube_id: Optional[str] = None
    video_duration_minutes: Optional[int] = None
    practice_problems: Optional[str] = None
    revision_topic: Optional[str] = None
    estimated_minutes: int
    is_completed: bool

    class Config:
        from_attributes = True

class RoadmapResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    total_days: int
    hours_per_day: int
    days_per_week: int
    status: str
    created_at: datetime
    days: List[RoadmapDayResponse] = []

    class Config:
        from_attributes = True

# Day Completion
class CompleteDayRequest(BaseModel):
    day_id: int
    is_completed: bool = True