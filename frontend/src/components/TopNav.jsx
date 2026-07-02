import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, Search } from 'lucide-react';

const TopNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="glass-panel border-b border-white/40 shadow-sm z-10 sticky top-0 flex items-center justify-between px-6 py-4">
      <div className="flex items-center bg-white/40 border border-white/50 rounded-lg px-3 py-2 w-96 backdrop-blur-md">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search subjects, plans..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm text-gray-700 placeholder-gray-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <User size={20} />
          <span className="font-medium">Student</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
