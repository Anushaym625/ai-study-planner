from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Subject Schemas
class SubjectBase(BaseModel):
    name: str
    priority: int
    difficulty: int

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(SubjectBase):
    pass

class SubjectResponse(SubjectBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Planner Schemas
class PlannerRequest(BaseModel):
    daily_hours: float
    exam_date: str
    start_time: str = "18:00"

class PlanItem(BaseModel):
    subject: str
    allocated_hours: float
    start_time: str = ""
    end_time: str = ""
    activity_type: str = "study"

class PlannerResponse(BaseModel):
    daily_plan: List[PlanItem]
    weekly_plan: List[PlanItem]
    revision_plan: List[PlanItem]

class StudyPlanResponse(BaseModel):
    id: int
    user_id: int
    plan_date: str
    subject: str
    allocated_hours: float
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    type: str
    completed: bool = False

    class Config:
        from_attributes = True

class StudyPlanUpdate(BaseModel):
    completed: bool

    class Config:
        from_attributes = True

# Progress Schemas
class ProgressCreate(BaseModel):
    subject_id: int
    completion_percentage: float

class ProgressResponse(BaseModel):
    id: int
    user_id: int
    subject_id: int
    subject: str
    completion_percentage: float

    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardStats(BaseModel):
    total_study_hours: float
    subjects_added: int
    completion_percentage: float
    consistency_score: float
    completed_tasks: int = 0
    missed_schedules: int = 0
    pending_tasks: int = 0

class SubjectProgress(BaseModel):
    name: str
    progress: float

class StudyHours(BaseModel):
    date: str
    hours: float

class DashboardResponse(BaseModel):
    stats: DashboardStats
    subject_progress: List[SubjectProgress]
    study_hours: List[StudyHours]
