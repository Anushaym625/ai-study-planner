from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.database import get_db
from app.schemas.schemas import PlannerRequest, PlannerResponse, StudyPlanResponse, StudyPlanUpdate
from app.models.models import Subject, StudyPlan, User
from app.core.security import get_current_user
from app.services.planner import AIPlannerService

router = APIRouter()

@router.post("/generate", response_model=PlannerResponse)
def generate_plan(request: PlannerRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    subjects = db.query(Subject).filter(Subject.user_id == current_user.id).all()
    if not subjects:
        raise HTTPException(status_code=400, detail="No subjects found. Please add subjects first.")
        
    plan = AIPlannerService.generate_plan(subjects, request.daily_hours, request.exam_date, request.start_time)
    
    # Optional: Save history to DB
    today = datetime.utcnow().strftime("%Y-%m-%d")
    for item in plan.daily_plan:
        db_plan = StudyPlan(
            user_id=current_user.id,
            plan_date=today,
            subject=item.subject,
            allocated_hours=item.allocated_hours,
            start_time=item.start_time,
            end_time=item.end_time,
            type="daily"
        )
        db.add(db_plan)
        
    for item in plan.weekly_plan:
        db_plan = StudyPlan(
            user_id=current_user.id,
            plan_date=today,
            subject=item.subject,
            allocated_hours=item.allocated_hours,
            start_time=item.start_time,
            end_time=item.end_time,
            type="weekly"
        )
        db.add(db_plan)
        
    for item in plan.revision_plan:
        db_plan = StudyPlan(
            user_id=current_user.id,
            plan_date=today,
            subject=item.subject,
            allocated_hours=item.allocated_hours,
            start_time=item.start_time,
            end_time=item.end_time,
            type="revision"
        )
        db.add(db_plan)
        
    db.commit()
    return plan

@router.get("/history", response_model=List[StudyPlanResponse])
def get_planner_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = db.query(StudyPlan).filter(StudyPlan.user_id == current_user.id).all()
    return history

@router.put("/history/{plan_id}", response_model=StudyPlanResponse)
def update_plan_status(plan_id: int, update_data: StudyPlanUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan_item = db.query(StudyPlan).filter(StudyPlan.id == plan_id, StudyPlan.user_id == current_user.id).first()
    if not plan_item:
        raise HTTPException(status_code=404, detail="Plan item not found")
    
    plan_item.completed = update_data.completed
    db.commit()
    db.refresh(plan_item)
    return plan_item
