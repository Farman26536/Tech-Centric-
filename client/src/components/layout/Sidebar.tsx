import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../common/Avatar';
import { Home, FolderKanban, CheckSquare, Users, User, LogOut } from 'lucide-react';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-3 py-2 px-3 rounded-lg ${active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
      <div className="w-6 h-6">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <aside className="w-72 bg-white border-r border-gray-100 min-h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">TF</div>
        <div>
          <div className="text-lg font-semibold text-gray-900">TeamFlow</div>
          <div className="text-xs text-gray-500">Project Tracker</div>
        </div>
      </div>

      <nav className="px-4 py-2 space-y-1">
        <NavItem to="/" icon={<Home className="w-5 h-5" />} label="Dashboard" />
        <NavItem to="/projects" icon={<FolderKanban className="w-5 h-5" />} label="Projects" />
        <NavItem to="/tasks" icon={<CheckSquare className="w-5 h-5" />} label="Tasks" />
        <NavItem to="/team" icon={<Users className="w-5 h-5" />} label="Team" />
        <NavItem to="/profile" icon={<User className="w-5 h-5" />} label="Profile" />
      </nav>

      <div className="mt-auto p-4">
        <div className="flex items-center gap-3">
          <Avatar name="Admin User" />
          <div className="flex-1">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-gray-500">ADMIN</div>
          </div>
          <div>
                <LogoutButton />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

    const LogoutButton: React.FC = () => {
      const { logout } = useAuth();
      const navigate = useNavigate();

      const handleLogout = async () => {
        try {
          await logout();
        } finally {
          navigate('/login', { replace: true });
        }
      };

      return (
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      );
    };
