import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Planner from './pages/Planner';
import Progress from './pages/Progress';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? (
    <div className="flex h-screen bg-transparent">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6">
          {children}
        </main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/subjects" element={<PrivateRoute><Subjects /></PrivateRoute>} />
        <Route path="/planner" element={<PrivateRoute><Planner /></PrivateRoute>} />
        <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
