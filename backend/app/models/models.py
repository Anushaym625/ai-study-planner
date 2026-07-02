from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    subjects = relationship("Subject", back_populates="owner")
    study_plans = relationship("StudyPlan", back_populates="owner")
    progress = relationship("Progress", back_populates="owner")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    priority = Column(Integer)
    difficulty = Column(Integer)

    owner = relationship("User", back_populates="subjects")
    progress = relationship("Progress", back_populates="subject_ref", uselist=False)

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plan_date = Column(String, index=True)
    subject = Column(String)
    allocated_hours = Column(Float)
    start_time = Column(String, nullable=True)
    end_time = Column(String, nullable=True)
    type = Column(String, default="daily") # daily, weekly, revision
    completed = Column(Boolean, default=False)

    owner = relationship("User", back_populates="study_plans")

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    subject = Column(String)
    completion_percentage = Column(Float, default=0.0)

    owner = relationship("User", back_populates="progress")
    subject_ref = relationship("Subject", back_populates="progress")
