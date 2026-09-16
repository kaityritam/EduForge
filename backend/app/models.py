from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=True)
    is_google_user = Column(Boolean, default=False)
    google_id = Column(String, unique=True, nullable=True)
    profile_picture = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CourseCategory(Base):
    __tablename__ = "course_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    icon = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, index=True)
    name = Column(String, index=True)
    description = Column(String)
    difficulty = Column(String)
    duration_hours = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserCourse(Base):
    __tablename__ = "user_courses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    course_id = Column(Integer, index=True, nullable=False)
    pace = Column(String, default="medium")  # slow, medium, advanced
    programming_language = Column(String, nullable=True)  # C++, Python, Java
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

class Roadmap(Base):
    __tablename__ = "roadmaps"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    course_id = Column(Integer, index=True, nullable=False)
    user_course_id = Column(Integer, index=True, nullable=False)
    total_days = Column(Integer, nullable=False)
    hours_per_day = Column(Integer, nullable=False)
    days_per_week = Column(Integer, nullable=False)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="active")  # active, completed, paused
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RoadmapDay(Base):
    __tablename__ = "roadmap_days"
    
    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, index=True, nullable=False)
    day_number = Column(Integer, nullable=False)
    week_number = Column(Integer, nullable=False)
    topic = Column(String, nullable=False)
    subtopics = Column(String, nullable=True)  # JSON string
    video_title = Column(String, nullable=True)
    video_youtube_id = Column(String, nullable=True)
    video_duration_minutes = Column(Integer, nullable=True)
    practice_problems = Column(String, nullable=True)  # JSON string
    revision_topic = Column(String, nullable=True)
    estimated_minutes = Column(Integer, default=120)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)


