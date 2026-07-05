from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base
from app.api import auth, subjects, planner, progress, dashboard

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agentic AI Based Smart Study Planner")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(subjects.router, prefix="/api/subjects", tags=["Subjects"])
app.include_router(planner.router, prefix="/api/planner", tags=["Planner"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Agentic AI Smart Study Planner API"}
