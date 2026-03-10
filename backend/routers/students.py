from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Student, Class
from schemas import StudentCreate, StudentResponse, StudentUpdate

router = APIRouter(prefix="/students", tags=["students"])


@router.get("/", response_model=list[StudentResponse])
def get_all_students(db: Session = Depends(get_db)):
    """Get all students"""
    students = db.query(Student).all()
    return students


@router.get("/search/", response_model=list[StudentResponse])
def search_students(name: str = "", db: Session = Depends(get_db)):
    """Search students by name"""
    students = db.query(Student).filter(Student.name.ilike(f"%{name}%")).all()
    return students


@router.post("/", response_model=StudentResponse)
def create_student(student_data: StudentCreate, db: Session = Depends(get_db)):
    """Create a new student"""
    # Check if class exists
    class_exists = db.query(Class).filter(Class.class_id == student_data.class_id).first()
    if not class_exists:
        raise HTTPException(status_code=400, detail="Class does not exist")
    
    db_student = Student(**student_data.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    """Get a specific student"""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, student_data: StudentUpdate, db: Session = Depends(get_db)):
    """Update a student"""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student_data.dict(exclude_unset=True)
    
    # Check if class_id exists in update
    if "class_id" in update_data:
        class_exists = db.query(Class).filter(Class.class_id == update_data["class_id"]).first()
        if not class_exists:
            raise HTTPException(status_code=400, detail="Class does not exist")
    
    for field, value in update_data.items():
        setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    """Delete a student"""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}
