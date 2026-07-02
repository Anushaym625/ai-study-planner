from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.schemas import ProgressCreate, ProgressResponse
from app.models.models import Progress, Subject, User
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ProgressResponse])
def get_progress(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    progress_list = db.query(Progress).filter(Progress.user_id == current_user.id).all()
    return progress_list

@router.post("/", response_model=ProgressResponse)
def update_progress(progress_data: ProgressCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    subject = db.query(Subject).filter(Subject.id == progress_data.subject_id, Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    progress = db.query(Progress).filter(Progress.subject_id == subject.id, Progress.user_id == current_user.id).first()
    
    if progress:
        progress.completion_percentage = progress_data.completion_percentage
    else:
        progress = Progress(
            user_id=current_user.id,
            subject_id=subject.id,
            subject=subject.name,
            completion_percentage=progress_data.completion_percentage
        )
        db.add(progress)
        
    db.commit()
    db.refresh(progress)
    return progress
