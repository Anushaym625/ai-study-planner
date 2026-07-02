import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, CheckSquare } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Subjects', path: '/subjects', icon: <BookOpen size={20} /> },
    { name: 'Planner', path: '/planner', icon: <Calendar size={20} /> },
    { name: 'Progress', path: '/progress', icon: <CheckSquare size={20} /> },
  ];

  return (
    <div className="w-64 glass-panel border-r border-white/50 shadow-sm hidden md:flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-white/40">
        <h1 className="text-xl font-bold text-primary">Smart Planner</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-primary'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
