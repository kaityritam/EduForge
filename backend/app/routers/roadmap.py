from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from app.database import get_db
from app.models import User, UserCourse, Roadmap, RoadmapDay
from app.schemas import (
    RoadmapGenerateRequest,
    RoadmapResponse,
    CompleteDayRequest
)
from app.auth import get_current_user_id

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])


def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


DSA_ROADMAP_TEMPLATE = [
    {"week": 1, "topic": "Arrays", "subtopics": ["Array Basics", "Traversal", "Insertion", "Deletion"], "video": "Arrays Introduction", "practice": ["Two Sum", "Max Subarray", "Rotate Array"]},
    {"week": 1, "topic": "Arrays - Advanced", "subtopics": ["Two Pointers", "Sliding Window"], "video": "Two Pointer Technique", "practice": ["Container with Most Water", "Longest Substring"]},
    {"week": 2, "topic": "Binary Search", "subtopics": ["Basic Binary Search", "Search Space"], "video": "Binary Search", "practice": ["Search Rotated Array", "Find Peak"]},
    {"week": 2, "topic": "Strings", "subtopics": ["String Basics", "Pattern Matching"], "video": "String Algorithms", "practice": ["Valid Anagram", "Longest Palindrome"]},
    {"week": 3, "topic": "Linked Lists", "subtopics": ["Singly Linked List", "Cycle Detection"], "video": "Linked List Guide", "practice": ["Reverse List", "Detect Cycle"]},
    {"week": 3, "topic": "Stacks & Queues", "subtopics": ["Stack", "Queue", "Monotonic Stack"], "video": "Stacks and Queues", "practice": ["Valid Parentheses", "Next Greater"]},
    {"week": 4, "topic": "Recursion", "subtopics": ["Basics", "Backtracking"], "video": "Recursion Masterclass", "practice": ["Subsets", "Permutations"]},
    {"week": 4, "topic": "Sorting", "subtopics": ["Merge Sort", "Quick Sort"], "video": "Sorting Algorithms", "practice": ["Sort Colors", "Merge Intervals"]},
    {"week": 5, "topic": "Trees", "subtopics": ["Binary Tree", "BST"], "video": "Binary Trees", "practice": ["Invert Tree", "Validate BST"]},
    {"week": 5, "topic": "Trees Advanced", "subtopics": ["AVL", "Segment Tree", "Trie"], "video": "Advanced Trees", "practice": ["Implement Trie", "Segment Query"]},
    {"week": 6, "topic": "Graphs", "subtopics": ["BFS", "DFS"], "video": "Graph Algorithms", "practice": ["Number of Islands", "Course Schedule"]},
    {"week": 6, "topic": "Graphs Advanced", "subtopics": ["Dijkstra", "MST"], "video": "Shortest Path", "practice": ["Network Delay", "Min Cost"]},
    {"week": 7, "topic": "Dynamic Programming", "subtopics": ["1D DP", "Knapsack"], "video": "DP Masterclass", "practice": ["Climbing Stairs", "Coin Change"]},
    {"week": 7, "topic": "DP Advanced", "subtopics": ["LCS", "LIS"], "video": "Advanced DP", "practice": ["LCS", "Edit Distance"]},
    {"week": 8, "topic": "Greedy", "subtopics": ["Activity Selection"], "video": "Greedy Algorithms", "practice": ["Jump Game"]},
    {"week": 8, "topic": "Revision", "subtopics": ["Full Revision"], "video": "Interview Prep", "practice": ["Mixed Problems"]},
]


@router.post("/generate", response_model=RoadmapResponse)
def generate_roadmap(
    request: RoadmapGenerateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_course = db.query(UserCourse).filter(
        UserCourse.id == request.user_course_id,
        UserCourse.user_id == user.id
    ).first()
    
    if not user_course:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    existing = db.query(Roadmap).filter(
        Roadmap.user_course_id == user_course.id,
        Roadmap.status == "active"
    ).first()
    
    if existing:
        days = db.query(RoadmapDay).filter(
            RoadmapDay.roadmap_id == existing.id
        ).order_by(RoadmapDay.day_number).all()
        return RoadmapResponse(
            id=existing.id, user_id=existing.user_id,
            course_id=existing.course_id, total_days=existing.total_days,
            hours_per_day=existing.hours_per_day, days_per_week=existing.days_per_week,
            status=existing.status, created_at=existing.created_at, days=days
        )
    
    new_roadmap = Roadmap(
        user_id=user.id,
        course_id=user_course.course_id,
        user_course_id=user_course.id,
        total_days=len(DSA_ROADMAP_TEMPLATE),
        hours_per_day=request.hours_per_day,
        days_per_week=request.days_per_week,
        status="active"
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    
    day_number = 1
    for week_data in DSA_ROADMAP_TEMPLATE:
        day = RoadmapDay(
            roadmap_id=new_roadmap.id,
            day_number=day_number,
            week_number=week_data["week"],
            topic=week_data["topic"],
            subtopics=json.dumps(week_data["subtopics"]),
            video_title=week_data["video"],
            video_youtube_id=None,
            video_duration_minutes=15,
            practice_problems=json.dumps(week_data["practice"]),
            revision_topic=None if day_number <= 1 else "Previous Day",
            estimated_minutes=request.hours_per_day * 60,
            is_completed=False
        )
        db.add(day)
        day_number += 1
    
    db.commit()
    
    days = db.query(RoadmapDay).filter(
        RoadmapDay.roadmap_id == new_roadmap.id
    ).order_by(RoadmapDay.day_number).all()
    
    return RoadmapResponse(
        id=new_roadmap.id, user_id=new_roadmap.user_id,
        course_id=new_roadmap.course_id, total_days=new_roadmap.total_days,
        hours_per_day=new_roadmap.hours_per_day, days_per_week=new_roadmap.days_per_week,
        status=new_roadmap.status, created_at=new_roadmap.created_at, days=days
    )


@router.get("/my", response_model=List[RoadmapResponse])
def get_my_roadmaps(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    roadmaps = db.query(Roadmap).filter(
        Roadmap.user_id == user.id,
        Roadmap.status == "active"
    ).all()
    
    result = []
    for roadmap in roadmaps:
        days = db.query(RoadmapDay).filter(
            RoadmapDay.roadmap_id == roadmap.id
        ).order_by(RoadmapDay.day_number).all()
        result.append(RoadmapResponse(
            id=roadmap.id, user_id=roadmap.user_id,
            course_id=roadmap.course_id, total_days=roadmap.total_days,
            hours_per_day=roadmap.hours_per_day, days_per_week=roadmap.days_per_week,
            status=roadmap.status, created_at=roadmap.created_at, days=days
        ))
    return result


@router.post("/complete-day")
def complete_day(
    request: CompleteDayRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    day = db.query(RoadmapDay).filter(RoadmapDay.id == request.day_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Day not found")
    
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == day.roadmap_id,
        Roadmap.user_id == user.id
    ).first()
    
    if not roadmap:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    day.is_completed = request.is_completed
    db.commit()
    return {"success": True, "message": "Day updated"}


@router.get("/{roadmap_id}/progress")
def get_progress(
    roadmap_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == user.id
    ).first()
    
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    total = db.query(RoadmapDay).filter(RoadmapDay.roadmap_id == roadmap_id).count()
    completed = db.query(RoadmapDay).filter(
        RoadmapDay.roadmap_id == roadmap_id,
        RoadmapDay.is_completed == True
    ).count()
    
    pct = (completed / total * 100) if total > 0 else 0
    
    return {
        "roadmap_id": roadmap_id,
        "total_days": total,
        "completed_days": completed,
        "progress_percentage": round(pct, 2),
        "status": roadmap.status
    }