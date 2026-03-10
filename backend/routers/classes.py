from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Class, Student
from schemas import ClassCreate, ClassResponse

router = APIRouter(prefix="/classes", tags=["classes"])


@router.get("/", response_model=list[ClassResponse])
def get_all_classes(db: Session = Depends(get_db)):
    """Get all classes"""
    classes = db.query(Class).all()
    return classes


@router.post("/", response_model=ClassResponse)
def create_class(class_data: ClassCreate, db: Session = Depends(get_db)):
    """Create a new class"""
    db_class = Class(class_name=class_data.class_name, advisor=class_data.advisor)
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class


@router.get("/{class_id}", response_model=ClassResponse)
def get_class(class_id: int, db: Session = Depends(get_db)):
    """Get a specific class"""
    db_class = db.query(Class).filter(Class.class_id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return db_class


@router.put("/{class_id}", response_model=ClassResponse)
def update_class(class_id: int, class_data: ClassCreate, db: Session = Depends(get_db)):
    """Update a class"""
    db_class = db.query(Class).filter(Class.class_id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    
    db_class.class_name = class_data.class_name
    db_class.advisor = class_data.advisor
    db.commit()
    db.refresh(db_class)
    return db_class


@router.delete("/{class_id}")
def delete_class(class_id: int, db: Session = Depends(get_db)):
    """Delete a class"""
    db_class = db.query(Class).filter(Class.class_id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    
    db.delete(db_class)
    db.commit()
    return {"message": "Class deleted successfully"}
