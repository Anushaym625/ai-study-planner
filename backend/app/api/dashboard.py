from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.schemas.schemas import DashboardResponse, DashboardStats, SubjectProgress, StudyHours
from app.models.models import Subject, Progress, StudyPlan, User
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Calculate total study hours (daily plan summation)
    total_hours = db.query(func.sum(StudyPlan.allocated_hours)).filter(
        StudyPlan.user_id == current_user.id,
        StudyPlan.type == "daily"
    ).scalar() or 0.0

    # Total subjects
    total_subjects = db.query(Subject).filter(Subject.user_id == current_user.id).count()

    from datetime import datetime

    # Average completion percentage
    avg_completion = db.query(func.avg(Progress.completion_percentage)).filter(
        Progress.user_id == current_user.id
    ).scalar() or 0.0

    # Task tracking logic
    all_plans = db.query(StudyPlan).filter(StudyPlan.user_id == current_user.id).all()
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    
    completed_tasks = 0
    missed_schedules = 0
    pending_tasks = 0
    
    for plan in all_plans:
        # Ignore breaks
        if plan.subject.lower() == "break":
            continue
            
        if plan.completed:
            completed_tasks += 1
        else:
            if plan.plan_date < today_str:
                missed_schedules += 1
            else:
                pending_tasks += 1

    # Mock consistency score based on actual completion
    total_assigned = completed_tasks + missed_schedules + pending_tasks
    if total_assigned > 0:
        consistency_score = round((completed_tasks / (completed_tasks + missed_schedules)) * 100, 1) if (completed_tasks + missed_schedules) > 0 else 100.0
    else:
        consistency_score = 0.0

    stats = DashboardStats(
        total_study_hours=round(total_hours, 1),
        subjects_added=total_subjects,
        completion_percentage=round(avg_completion, 1),
        consistency_score=consistency_score,
        completed_tasks=completed_tasks,
        missed_schedules=missed_schedules,
        pending_tasks=pending_tasks
    )

    # Subject progress
    progress_data = db.query(Progress).filter(Progress.user_id == current_user.id).all()
    subject_progress = [SubjectProgress(name=p.subject, progress=p.completion_percentage) for p in progress_data]

    # Study hours chart (mock recent days based on study plans)
    plans = db.query(StudyPlan.plan_date, func.sum(StudyPlan.allocated_hours).label('total_hours')).filter(
        StudyPlan.user_id == current_user.id,
        StudyPlan.type == "daily"
    ).group_by(StudyPlan.plan_date).order_by(StudyPlan.plan_date).limit(7).all()
    
    study_hours_chart = [StudyHours(date=p.plan_date, hours=p.total_hours) for p in plans]

    return DashboardResponse(
        stats=stats,
        subject_progress=subject_progress,
        study_hours=study_hours_chart
    )
