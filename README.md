# Agentic AI Based Smart Study Planner

A beautiful, full-stack web application that helps students generate intelligent study schedules using an AI algorithm. Built with React (Vite), Tailwind CSS, FastAPI, and SQLite.

## How to Run Locally in VS Code (For Friends & Contributors)

If you have cloned this repository and want to run it on your own Windows computer using VS Code, follow these simple steps:

### Prerequisites
Before you start, make sure you have installed:
1. **[Node.js](https://nodejs.org/en/download/)** (for the React Frontend)
2. **[Python](https://www.python.org/downloads/)** (for the FastAPI Backend)
3. **[Git](https://git-scm.com/downloads)** (to clone the repo)

### Step 1: Clone the Repository
Open VS Code, open a new Terminal (`Ctrl + ~`), and run:
```bash
git clone https://github.com/Anushaym625/ai-study-planner.git
cd ai-study-planner
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 3: Install Backend Dependencies
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Step 4: Run the App with One Click!
Once everything is installed, you never have to type those commands again.

Just double click the **`start.bat`** file located in the main folder (or type `.\start.bat` in the VS Code terminal). 
This will automatically launch:
- The Backend API on `http://localhost:8000`
- The Frontend UI on `http://localhost:5173`

Go to **http://localhost:5173** in your browser to start studying!

---

## Features
- **Modern Glassmorphism UI**: Beautiful, animated frosted glass interfaces.
- **Authentication**: Secure bcrypt-hashed passwords and JWT tokens.
- **Study Planner**: Add subjects, difficulty, and automatically generate balanced study plans.
- **Progress Tracking & Analytics**: Interactive Donut and Line charts built with Recharts.
