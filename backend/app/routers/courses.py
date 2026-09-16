from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Course, CourseCategory
from app.schemas import CourseResponse, CourseCategoryResponse

router = APIRouter(prefix="/courses", tags=["Courses"])

# Get all categories
@router.get("/categories", response_model=List[CourseCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(CourseCategory).all()
    return categories

# Get courses by category
@router.get("/category/{category_id}", response_model=List[CourseResponse])
def get_courses_by_category(category_id: int, db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.category_id == category_id, Course.is_active == True).all()
    return courses

# Search courses
@router.get("/search", response_model=List[CourseResponse])
def search_courses(q: str = "", db: Session = Depends(get_db)):
    if q:
        courses = db.query(Course).filter(
            Course.name.ilike(f"%{q}%"),
            Course.is_active == True
        ).limit(20).all()
    else:
        courses = db.query(Course).filter(Course.is_active == True).limit(20).all()
    return courses