# Agentic AI Based Smart Study Planner

A full-stack web application that helps students generate intelligent study schedules using AI-based decision making.

## Features

- **Authentication Module:** Register and Login securely with JWT authentication.
- **Subject Management:** Add, edit, delete subjects with associated priority and difficulty levels.
- **Study Planner Module:** Enter daily study hours and exam date, and an AI Agent allocates daily hours, weekly hours, and revision schedules.
- **Progress Tracking:** Update subject completion percentage dynamically.
- **Analytics Dashboard:** Visualize study hours and progress using beautiful Recharts.

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Recharts
- Lucide React (Icons)

### Backend
- Python 3.12 (FastAPI)
- PostgreSQL
- SQLAlchemy
- Passlib & PyJWT

### Deployment
- Docker
- Docker Compose

## Installation

### Prerequisites
- Docker and Docker Compose installed on your system.

### Environment Setup
No manual `.env` file is necessary for the default Docker setup as it's handled in `docker-compose.yml`, but here are the key variables used:
- `DATABASE_URL`: `postgresql://postgres:postgres@db:5432/study_planner`
- `VITE_API_URL`: `http://localhost:8000/api`

### Running the Application

1. Open a terminal in the root directory.
2. Run the following command to build and start the containers:
   ```bash
   docker-compose up --build
   ```
3. Access the Frontend at: `http://localhost:5173`
4. Access the Backend API Docs (Swagger) at: `http://localhost:8000/docs`

## Database Setup

The database will be automatically created and migrations (table creations) are run automatically on startup via SQLAlchemy `create_all()`.

## API Documentation

FastAPI auto-generates Swagger documentation. After running the app, visit `http://localhost:8000/docs` to see all available endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET, POST, PUT, DELETE /api/subjects/`
- `POST /api/planner/generate`
- `GET /api/planner/history`
- `GET, POST /api/progress/`
- `GET /api/dashboard/`

## Screenshots

*(Add screenshots of your application here)*
