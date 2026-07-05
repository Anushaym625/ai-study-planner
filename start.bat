@echo off
echo Starting Agentic AI Study Planner...

echo Starting Backend Server...
start cmd /k "cd backend && python -m uvicorn app.main:app --reload --port 8000"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting up! You can close this window if you want.
