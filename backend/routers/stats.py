from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Student
from schemas import StatsResponse
from collections import defaultdict

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/", response_model=StatsResponse)
def get_statistics(db: Session = Depends(get_db)):
    """Get statistics about students"""
    total_students = db.query(func.count(Student.student_id)).scalar() or 0
    average_gpa = db.query(func.avg(Student.gpa)).scalar() or 0.0
    
    # Get students by major
    students_by_major = {}
    major_counts = db.query(Student.major, func.count(Student.student_id)).group_by(Student.major).all()
    
    for major, count in major_counts:
        students_by_major[major] = count
    
    return {
        "total_students": total_students,
        "average_gpa": round(average_gpa, 2),
        "students_by_major": students_by_major
    }
