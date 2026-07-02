from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.schemas import SubjectCreate, SubjectUpdate, SubjectResponse
from app.models.models import Subject, User
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[SubjectResponse])
def get_subjects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    subjects = db.query(Subject).filter(Subject.user_id == current_user.id).all()
    return subjects

@router.post("/", response_model=SubjectResponse)
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_subject = Subject(**subject.model_dump(), user_id=current_user.id)
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    return new_subject

@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(subject_id: int, subject: SubjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == current_user.id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    for key, value in subject.model_dump().items():
        setattr(db_subject, key, value)
        
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == current_user.id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    db.delete(db_subject)
    db.commit()
    return None
