from pydantic import BaseModel
from typing import Optional, List

class StudentBase(BaseModel):
    name: str
    birth_year: int
    major: str
    gpa: float
    class_id: int


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    birth_year: Optional[int] = None
    major: Optional[str] = None
    gpa: Optional[float] = None
    class_id: Optional[int] = None


class StudentResponse(StudentBase):
    student_id: int

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_students: int
    average_gpa: float
    students_by_major: dict
