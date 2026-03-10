from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from io import StringIO
import csv
from database import get_db
from models import Student

router = APIRouter(prefix="/export", tags=["export"])


@router.get("/csv")
def export_students_csv(db: Session = Depends(get_db)):
    """Export all students to CSV"""
    students = db.query(Student).all()
    
    # Create CSV in memory
    output = StringIO()
    writer = csv.writer(output)
    
    # Write headers
    writer.writerow(["Student ID", "Name", "Birth Year", "Major", "GPA", "Class ID"])
    
    # Write student data
    for student in students:
        writer.writerow([
            student.student_id,
            student.name,
            student.birth_year,
            student.major,
            student.gpa,
            student.class_id
        ])
    
    csv_content = output.getvalue()
    
    return {
        "filename": "students.csv",
        "content": csv_content
    }
