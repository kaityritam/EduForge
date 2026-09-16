from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Course, CourseCategory, UserCourse, User
from app.schemas import (
    CourseResponse, 
    CourseCategoryResponse,
    CourseDetailResponse,
    EnrollCourseRequest,
    EnrollCourseResponse
)
from app.auth import get_current_user_id

router = APIRouter(prefix="/courses", tags=["Courses"])


def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# Get all categories
@router.get("/categories", response_model=List[CourseCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(CourseCategory).all()


# Get courses by category
@router.get("/category/{category_id}", response_model=List[CourseResponse])
def get_courses_by_category(category_id: int, db: Session = Depends(get_db)):
    return db.query(Course).filter(
        Course.category_id == category_id,
        Course.is_active == True
    ).all()


# Search courses
@router.get("/search", response_model=List[CourseResponse])
def search_courses(q: str = "", db: Session = Depends(get_db)):
    if q:
        return db.query(Course).filter(
            Course.name.ilike(f"%{q}%"),
            Course.is_active == True
        ).limit(20).all()
    return db.query(Course).filter(Course.is_active == True).limit(20).all()


# Get user's enrolled courses
@router.get("/my/enrolled")
def get_my_courses(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    enrollments = db.query(UserCourse).filter(
        UserCourse.user_id == user.id,
        UserCourse.is_active == True
    ).all()
    
    result = []
    for enrollment in enrollments:
        course = db.query(Course).filter(Course.id == enrollment.course_id).first()
        if course:
            result.append({
                "enrollment_id": enrollment.id,
                "course_id": course.id,
                "course_name": course.name,
                "pace": enrollment.pace,
                "programming_language": enrollment.programming_language,
                "enrolled_at": enrollment.enrolled_at
            })
    return result


# Enroll in a course
@router.post("/enroll", response_model=EnrollCourseResponse)
def enroll_course(
    enroll_data: EnrollCourseRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == enroll_data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    existing = db.query(UserCourse).filter(
        UserCourse.user_id == user.id,
        UserCourse.course_id == enroll_data.course_id,
        UserCourse.is_active == True
    ).first()
    
    if existing:
        return EnrollCourseResponse(
            success=True,
            message="Already enrolled",
            user_course_id=existing.id
        )
    
    new_enrollment = UserCourse(
        user_id=user.id,
        course_id=enroll_data.course_id,
        pace=enroll_data.pace,
        programming_language=enroll_data.programming_language
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    
    return EnrollCourseResponse(
        success=True,
        message="Successfully enrolled",
        user_course_id=new_enrollment.id
    )


# Get single course (must be LAST)
@router.get("/{course_id}", response_model=CourseDetailResponse)
def get_course_detail(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course